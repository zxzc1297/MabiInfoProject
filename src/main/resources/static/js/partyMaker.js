// 직업 정보 정의
const JOBS = {
  전사: { roles: ["탱커"], type: "근접" },
  대검전사: { roles: ["탱커", "딜러"], type: "근접" },
  검술사: { roles: ["딜러"], type: "근접" },
  마법사: { roles: ["딜러"], type: "원거리" },
  화염술사: { roles: ["딜러"], type: "원거리" },
  빙결술사: { roles: ["탱커"], type: "근접" },
  전격술사: { roles: ["딜러"], type: "원거리" },
  궁수: { roles: ["딜러"], type: "원거리" },
  석궁사수: { roles: ["딜러"], type: "원거리" },
  장궁병: { roles: ["딜러"], type: "원거리" },
  음유시인: { roles: ["딜러"], type: "원거리" },
  악사: { roles: ["딜러"], type: "원거리" },
  댄서: { roles: ["딜러"], type: "근접" },
  힐러: { roles: ["힐러"], type: "원거리" },
  수도사: { roles: ["탱커", "힐러"], type: "근접" },
  사제: { roles: ["힐러"], type: "원거리" },
  도적: { roles: ["딜러"], type: "근접" },
  듀얼블레이드: { roles: ["딜러"], type: "근접" },
  격투가: { roles: ["딜러"], type: "근접" },
}

let memberCount = 1

$(document).ready(() => {
  // 레이드 유형 변경 시 힐러 설정 표시/숨김
  $("#raidType").change(function () {
    const raidType = $(this).val();
    if (raidType === "8") {
      $("#healerSetting").show();
    } else {
      $("#healerSetting").hide();
    }
  });

  // 저장된 데이터 불러오기 시도
  const loaded = loadGuildData();
  console.log("길드 정보 로드 시도:", loaded);

  // 저장된 데이터가 없거나 로드에 실패한 경우에만 첫 번째 길드원에 기본 캐릭터 폼 추가
  if (!loaded) {
    if ($(".member-card").length === 0) { // 길드원 카드가 하나도 없다면 첫번째 길드원 추가
        addMember(); // 첫 번째 길드원 추가 (내부적으로 memberCount가 1이 됨)
    }
    // 첫 번째 (또는 유일한) 길드원 카드에 기본 캐릭터 폼 하나 추가
    // addCharacter 함수는 버튼을 인자로 받으므로, 해당 버튼을 찾아 전달합니다.
    const firstMemberCard = $(".member-card").first();
    if (firstMemberCard.length > 0 && firstMemberCard.find(".character-form").length === 0) {
        addCharacter(firstMemberCard.find(".add-character-btn")[0]);
    }
  }
});

// 길드원 추가
function addMember() {
  memberCount++
  const memberHtml = `
    <div class="member-card">
      <div class="member-header">
        <h3>길드원 ${memberCount}</h3>
        <button type="button" class="add-character-btn" onclick="addCharacter(this)">
          <i class="fas fa-plus"></i> 캐릭터 추가
        </button>
      </div>
      <div class="characters-list">
      </div>
    </div>
  `
  $("#guildMembers").append(memberHtml)
}

// 캐릭터 추가 (데이터 로드 지원하도록 수정)
function addCharacter(button, charData = null) {
  const memberCard = $(button).closest(".member-card");
  const charactersList = memberCard.find(".characters-list");
  const currentCharacters = charactersList.find(".character-form").length;

  if (currentCharacters >= 5) {
    // 로드 시에는 이 경고가 부적절할 수 있으므로, charData가 있을 때는 경고를 스킵하거나 다르게 처리할 수 있습니다.
    // 여기서는 로드 중에도 5개 제한은 유효하다고 가정합니다.
    if (!charData) { // 사용자가 직접 추가할 때만 경고
        alert("한 명당 최대 5개의 캐릭터만 입력할 수 있습니다.");
    }
    return;
  }

  const jobOptions = Object.keys(JOBS)
    .map((job) => `<option value="${job}">${job}</option>`)
    .join("");

  // charData가 있으면 해당 값으로, 없으면 빈 값으로 초기화
  const charName = charData && charData.name ? charData.name : "";
  const charPower = charData && charData.power ? charData.power : "";
  const charJob = charData && charData.job ? charData.job : "";

  const characterHtml = `
    <div class="character-form">
      <input type="text" placeholder="캐릭터명" class="character-name" required value="${charName}">
      <input type="number" placeholder="전투력" class="character-power" required value="${charPower}">
      <select class="character-job" required>
        <option value="">직업 선택</option>
        ${jobOptions}
      </select>
      <button type="button" class="remove-character-btn" onclick="removeCharacter(this)">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;

  charactersList.append(characterHtml);

  // charData가 있고 직업 정보가 있다면, select 요소의 값을 설정
  if (charJob) {
    charactersList.find(".character-form").last().find(".character-job").val(charJob);
  }
}

// 캐릭터 제거
function removeCharacter(button) {
  $(button).closest(".character-form").remove()
}

// 직업에 따른 역할 옵션 업데이트
// function updateRoleOptions(jobSelect) {
//   const job = $(jobSelect).val()
//   const roleSelect = $(jobSelect).siblings(".character-role")

//   roleSelect.empty().append('<option value="">역할 선택</option>')

//   if (job && JOBS[job]) {
//     JOBS[job].roles.forEach((role) => {
//       roleSelect.append(`<option value="${role}">${role}</option>`)
//     })
//   }
// }

// 파티 생성 메인 함수 (AJAX 호출)
function generateParties() {
  const characters = collectCharacters();
  if (characters.length === 0) {
    alert("캐릭터를 먼저 입력해주세요.");
    return;
  }

  const raidType = parseInt($("#raidType").val(), 10);
  const healerCount = parseInt($("#healerCount").val(), 10) || 0;
  const minCombatPower = parseInt($("#minCombatPower").val(), 10) || 0;

  const requestData = {
    characters: characters,
    raidType: raidType,
    healerCount: healerCount,
    minCombatPower: minCombatPower,
  };

  $.ajax({
    url: "/partyMaker/api/generate",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(requestData),
    success: function (parties) {
      displayParties(parties, raidType);
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
      alert("파티 생성 중 오류가 발생했습니다.");
    },
  });
}

// 캐릭터 정보 수집
function collectCharacters() {
  const characters = []

  $(".member-card").each(function (memberIndex) {
    const memberName = `길드원 ${memberIndex + 1}`

    $(this)
      .find(".character-form")
      .each(function () {
        const name = $(this).find(".character-name").val().trim()
        const power = Number.parseInt($(this).find(".character-power").val())
        const job = $(this).find(".character-job").val()
        
        if (name && power && job) {
          // 직업에서 역할 자동 할당 (여러 역할 중 첫 번째만 사용)
          const roles = JOBS[job].roles
          const role = roles && roles.length > 0 ? roles[0] : ""
          characters.push({
            name,
            power,
            job,
            role,
            type: JOBS[job].type,
            owner: memberName,
            ownerIndex: memberIndex,
          })
        }
      })
  })

  return characters
}



// 파티 결과 표시
function displayParties(parties, raidType) {
  const container = $("#partiesContainer")
  container.empty()

  console.log("parties (JSON string):", JSON.stringify(parties, null, 2));

  parties.forEach((party, index) => {
    const avgPower =
      party.length > 0 ? Math.round(party.reduce((sum, member) => sum + member.power, 0) / party.length) : 0

    let partyHtml = `
      <div class="party-card">
        <div class="party-header">
          <h3 class="party-title">파티 ${index + 1}</h3>
          <div class="party-stats">
            <div>인원: ${party.length}/${raidType}</div>
            <div>평균 전투력: ${avgPower.toLocaleString()}</div>
          </div>
        </div>
        <div class="party-members">
    `

    // 파티원 표시
    party.forEach((member) => {
      partyHtml += `
        <div class="party-member">
          <div class="member-info">
            <div class="member-name">${member.name}</div>
            <div class="member-details">${member.job} | ${member.power.toLocaleString()} | ${member.owner}</div>
          </div>
          <span class="member-role role-${member.role ? member.role.toLowerCase() : ''}">${member.role}</span>
        </div>
      `
    })

    // 빈 슬롯 표시
    for (let i = party.length; i < raidType; i++) {
      partyHtml += `
        <div class="empty-slot">
          빈 슬롯 - 직접 추가해주세요
        </div>
      `
    }

    partyHtml += `
        </div>
      </div>
    `

    container.append(partyHtml)
  })

  $("#resultsPanel").show()
}

// 길드원 정보 저장
function saveGuildData() {
  const guildMembersData = [];
  $(".member-card").each(function () {
    const memberData = {
      characters: [],
    };
    $(this)
      .find(".character-form")
      .each(function () {
        const name = $(this).find(".character-name").val().trim();
        const powerString = $(this).find(".character-power").val();
        const job = $(this).find(".character-job").val();

        // 캐릭터명, 전투력, 직업이 모두 유효한 경우에만 저장
        if (name && powerString && job) {
          const power = Number.parseInt(powerString);
          if (!isNaN(power)) {
            memberData.characters.push({ name, power, job });
          }
        }
      });
    // 캐릭터가 하나라도 있는 길드원만 저장 (선택 사항)
    // if (memberData.characters.length > 0) {
    guildMembersData.push(memberData);
    // }
  });

  if (guildMembersData.length > 0) {
    localStorage.setItem("guildRaidPartyData", JSON.stringify(guildMembersData));
    alert("길드 정보가 저장되었습니다.");
  } else {
    // 저장할 데이터가 없을 경우 기존 데이터 삭제 또는 사용자 알림
    localStorage.removeItem("guildRaidPartyData"); // 선택: 데이터가 없으면 저장된 것도 지움
    alert("저장할 길드 정보가 없습니다.");
  }
}

// 길드원 정보 불러오기
function loadGuildData() {
  const savedDataString = localStorage.getItem("guildRaidPartyData");
  if (!savedDataString) {
    // console.log("저장된 길드 정보가 없습니다.");
    return false; // 데이터가 없으면 false 반환
  }

  const guildMembersData = JSON.parse(savedDataString);
  if (!guildMembersData || guildMembersData.length === 0) {
    // console.log("불러올 길드 정보가 형식에 맞지 않거나 비어있습니다.");
    return false; // 데이터가 유효하지 않으면 false 반환
  }

  $("#guildMembers").empty(); // 기존 길드원 정보 초기화
  memberCount = 0; // 길드원 카운트 초기화

  guildMembersData.forEach((memberData, index) => {
    addMember(); // 새 길드원 카드 추가 (memberCount가 내부적으로 증가)

    const currentMemberCard = $(".member-card").last(); // 방금 추가된 길드원 카드
    const charactersList = currentMemberCard.find(".characters-list");
    const addCharacterButton = currentMemberCard.find(".add-character-btn")[0];

    memberData.characters.forEach((charData) => {
      // addCharacter 함수를 직접 호출하기보다, 캐릭터 폼 HTML을 직접 만들고 값을 채우는 방식이
      // addCharacter 내부의 5개 제한 로직을 우회하지 않고 정확히 데이터를 복원하는데 유리할 수 있습니다.
      // 하지만 addCharacter 함수를 수정하여 데이터와 함께 호출하는 것도 좋은 방법입니다. (아래 addCharacter 수정안 참고)
      
      // 수정된 addCharacter 함수를 사용하는 경우:
      addCharacter(addCharacterButton, charData);
    });
  });

  console.log("guildMembersData (JSON string):", JSON.stringify(guildMembersData, null, 2));

  alert("길드 정보가 성공적으로 로드되었습니다.");
  return true; // 성공적으로 로드되면 true 반환
}