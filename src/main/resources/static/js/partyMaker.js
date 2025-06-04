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

// 파티 생성 메인 함수
function generateParties() {
  const characters = collectCharacters()
  if (characters.length === 0) {
    alert("캐릭터를 먼저 입력해주세요.")
    return
  }

  const raidType = Number.parseInt($("#raidType").val())
  const healerCount = Number.parseInt($("#healerCount").val()) || 0
  const minCombatPower = Number.parseInt($("#minCombatPower").val()) || 0

  let parties
  if (raidType === 4) {
    parties = generate4ManParties(characters, minCombatPower)
  } else {
    parties = generate8ManParties(characters, healerCount, minCombatPower)
  }

  displayParties(parties, raidType)
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

// 4인 레이드 파티 생성 (수정안)
// function generate4ManParties(characters, minCombatPower) {
//   const parties = [];
//   const availableCharacters = [...characters]; // 모든 캐릭터를 일단 사용 가능으로 간주
//   const usedCharacters = new Set(); // 전체 파티에서 사용된 캐릭터 추적

//   // 만들 파티의 수 결정 (캐릭터가 있으면 최소 1개, 없어도 1개의 빈 파티)
//   let numPartiesToCreate = 0;
//   if (availableCharacters.length > 0) {
//     numPartiesToCreate = Math.ceil(availableCharacters.length / 4); // 단순 계산, 혹은 다른 로직
//     // 혹은 고정적으로 1개만 만들거나, 길드원 수에 따라 만들 수도 있음.
//     // 여기서는 모든 캐릭터를 소진하려고 시도
//   } else {
//     numPartiesToCreate = 1; // 캐릭터가 없어도 빈 파티 1개 생성
//   }
  
//   // 최소 전투력 필터는 캐릭터를 수집할 때 적용하거나, 여기서 우선순위 정할 때 사용
//   // characters.filter(c => c.power >= minCombatPower)

//   for (let i = 0; i < numPartiesToCreate; i++) {
//     const party = [];
//     const usedOwnersInCurrentParty = new Set();

//     // 1. 탱커 시도 (최대 1명)
//     const tank = availableCharacters.find(
//       (c) => c.role === "탱커" && !usedCharacters.has(c.name) && !usedOwnersInCurrentParty.has(c.ownerIndex) && c.power >= minCombatPower
//     );
//     if (tank) {
//       party.push(tank);
//       usedCharacters.add(tank.name);
//       usedOwnersInCurrentParty.add(tank.ownerIndex);
//     }

//     // 2. 힐러 시도 (최대 1명)
//     if (party.length < 4) {
//       const healer = availableCharacters.find(
//         (c) => c.role === "힐러" && !usedCharacters.has(c.name) && !usedOwnersInCurrentParty.has(c.ownerIndex) && c.power >= minCombatPower
//       );
//       if (healer) {
//         party.push(healer);
//         usedCharacters.add(healer.name);
//         usedOwnersInCurrentParty.add(healer.ownerIndex);
//       }
//     }

//     // 3. 딜러 시도 (남은 자리 채우기)
//     const dealers = availableCharacters
//       .filter((c) => c.role === "딜러" && !usedCharacters.has(c.name) && !usedOwnersInCurrentParty.has(c.ownerIndex) && c.power >= minCombatPower)
//       .sort((a, b) => b.power - a.power); // 전투력 높은 딜러 우선

//     for (const dealer of dealers) {
//       if (party.length >= 4) break;
//       // 길드원 중복 체크는 이미 find 로직에 반영하려고 했으나, 여기서 다시 한번 확인하거나,
//       // find 로직에서 usedOwnersInCurrentParty를 먼저 체크하도록 구성
//       if (!usedOwnersInCurrentParty.has(dealer.ownerIndex)) {
//           party.push(dealer);
//           usedCharacters.add(dealer.name);
//           usedOwnersInCurrentParty.add(dealer.ownerIndex);
//       }
//     }
    
//     // 최소 전투력 미만 캐릭터로 채우기 (선택적)
//     if (party.length < 4) {
//         const lowPowerCharacters = availableCharacters
//             .filter(c => !usedCharacters.has(c.name) && !usedOwnersInCurrentParty.has(c.ownerIndex) && c.power < minCombatPower)
//             .sort((a, b) => b.power - a.power); // 그래도 높은 순

//         for (const char of lowPowerCharacters) {
//             if (party.length >= 4) break;
//             if (!usedOwnersInCurrentParty.has(char.ownerIndex)) { // 길드원 중복 확인
//                 // 역할 안배 로직 추가 가능 (예: 탱커/힐러 없으면 우선 채우기)
//                 // 현재는 역할 무관하게 채움
//                 party.push(char);
//                 usedCharacters.add(char.name);
//                 usedOwnersInCurrentParty.add(char.ownerIndex);
//             }
//         }
//     }


//     // 파티 추가 (캐릭터가 0명일 때 numPartiesToCreate가 1이면 빈 파티 []가 추가됨)
//     parties.push(party);

//     // 만약 한 파티에 모든 캐릭터를 넣는 방식이 아니라면,
//     // 사용된 캐릭터를 availableCharacters에서 제거하거나, usedCharacters를 더 철저히 관리해야 함.
//     // 현재 로직은 availableCharacters에서 find로 찾으므로, usedCharacters로 중복 사용을 막고 있음.
//   }
//   return parties;
// }

// 4인 레이드 파티 생성 (수정안)
function generate4ManParties(allCharactersInput, minCombatPower) {
  // 0. 초기 설정 및 최소 전투력 필터링 (이전과 동일)
  const charactersForPartyBuilding = allCharactersInput.filter(c => c.power >= minCombatPower);
  const parties = [];
  const partyShells = [];
  const usedCharacterNames = new Set();

  // 1. 파티 '틀' 생성 로직 (이전과 동일)
  let numPartiesToCreate = 0;
  if (allCharactersInput.length > 0) {
    numPartiesToCreate = Math.ceil(allCharactersInput.length / 4);
  } else if ($("#raidType").val() === "4") {
    parties.push([]);
    return parties;
  }
  if (charactersForPartyBuilding.length === 0 && allCharactersInput.length > 0) {
    numPartiesToCreate = Math.ceil(allCharactersInput.length / 4);
  } else if (charactersForPartyBuilding.length > 0) {
    numPartiesToCreate = Math.ceil(charactersForPartyBuilding.length / 4);
  } else if (allCharactersInput.length === 0 && numPartiesToCreate === 0 && $("#raidType").val() === "4") {
    numPartiesToCreate = 1;
  }

  for (let i = 0; i < numPartiesToCreate; i++) {
    partyShells.push({ id: i, members: [], ownerSet: new Set(), totalPower: 0 });
  }

  if (charactersForPartyBuilding.length === 0) {
    partyShells.forEach(shell => parties.push(shell.members));
    return parties;
  }

  // 2. 탱커 배분 (이전과 동일)
  const tanks = charactersForPartyBuilding.filter(c => c.role === "탱커").sort((a, b) => b.power - a.power);
  for (const tank of tanks) {
    if (usedCharacterNames.has(tank.name)) continue;
    for (const shell of partyShells) {
      if (shell.members.length < 4 && !shell.members.some(m => m.role === "탱커") && !shell.ownerSet.has(tank.ownerIndex)) {
        shell.members.push(tank); shell.ownerSet.add(tank.ownerIndex); shell.totalPower += tank.power; usedCharacterNames.add(tank.name); break;
      }
    }
  }

  // 3. 힐러 배분 (이전과 동일: 탱커 없는 파티 우선)
  const healers = charactersForPartyBuilding.filter(c => c.role === "힐러").sort((a, b) => b.power - a.power);
  const sortedShellsForHealers = [...partyShells].sort((a, b) => {
    const aHasTank = a.members.some(m => m.role === "탱커"); const bHasTank = b.members.some(m => m.role === "탱커");
    if (!aHasTank && bHasTank) return -1; if (aHasTank && !bHasTank) return 1;
    return a.members.length - b.members.length;
  });
  for (const healer of healers) {
    if (usedCharacterNames.has(healer.name)) continue;
    for (const shell of sortedShellsForHealers) {
      if (shell.members.length < 4 && !shell.members.some(m => m.role === "힐러") && !shell.ownerSet.has(healer.ownerIndex)) {
        shell.members.push(healer); shell.ownerSet.add(healer.ownerIndex); shell.totalPower += healer.power; usedCharacterNames.add(healer.name); break;
      }
    }
  }

  // --- 조건1 필터링 부분 제거 ---
  // const validPartyShellsForDealers = partyShells.filter(s => {
  //   const hasTank = s.members.some(m => m.role === "탱커");
  //   const hasHealer = s.members.some(m => m.role === "힐러");
  //   return hasTank || hasHealer; // 이 필터를 사용하지 않음
  // });
  // 이제 모든 partyShells가 딜러 배정 대상이 됩니다.

  // 4. 통합된 딜러 배분 로직 (라운드 기반으로 수정)
  let availableDealers = charactersForPartyBuilding
    .filter(c => c.role === "딜러" && !usedCharacterNames.has(c.name))
    .sort((a, b) => b.power - a.power); // 강한 딜러 순 정렬

  let successfullyPlacedADealerInOverallLoop = true; // 전체 루프를 제어 (한 라운드에서 한 명이라도 배정되면 계속)
  while (successfullyPlacedADealerInOverallLoop && availableDealers.length > 0) {
    successfullyPlacedADealerInOverallLoop = false; // 이번 라운드에서 배정 성공 여부 초기화

    // 딜러를 추가할 수 있는 파티들 필터링 (자리 있는 모든 쉘 대상)
    let partiesNeedingDealers = partyShells.filter(s => s.members.length < 4);

    if (partiesNeedingDealers.length === 0) {
        break; // 딜러를 채울 파티가 없으면 종료
    }

    // 현재 '평균' 전투력이 가장 낮은 파티 순으로 정렬 (멤버가 없으면 평균 0)
    partiesNeedingDealers.sort((a, b) => {
        const avgA = a.members.length > 0 ? a.totalPower / a.members.length : 0;
        const avgB = b.members.length > 0 ? b.totalPower / b.members.length : 0;
        if (avgA === avgB) { // 평균이 같으면 멤버 수가 적은 파티 우선
            return a.members.length - b.members.length;
        }
        return avgA - avgB;
    });

    // --- 한 라운드 시작: 정렬된 순서대로 각 파티가 딜러 한 명씩 선택 시도 ---
    for (const targetParty of partiesNeedingDealers) {
        if (targetParty.members.length >= 4) continue; // 이미 이번 라운드에서 다른 파티의 선택으로 꽉 찼을 수도 있음 (극히 드문 경우)
        if (availableDealers.length === 0) break; // 남은 딜러가 없으면 라운드 종료

        let assignedDealerIndex = -1;
        // 현재 targetParty에 가장 적합한 (사용 가능한 가장 강한) 딜러를 찾음
        for (let i = 0; i < availableDealers.length; i++) {
            const dealer = availableDealers[i];

            if (!targetParty.ownerSet.has(dealer.ownerIndex)) { // 소유주 중복 체크
                let canAddDealer = true;
                // 조건2 체크: 4번째 멤버로 추가 시 전체 원거리 파티 방지
                if (targetParty.members.length === 3) {
                    const currentMembersAndProspectiveDealer = [...targetParty.members, dealer];
                    const meleeCountInProspectiveParty = currentMembersAndProspectiveDealer.filter(m => JOBS[m.job].type === "근접").length;
                    if (meleeCountInProspectiveParty === 0 && currentMembersAndProspectiveDealer.length === 4) { // 4명 파티가 모두 원거리가 되는 경우
                        canAddDealer = false;
                    }
                }

                if (canAddDealer) {
                    targetParty.members.push(dealer);
                    targetParty.ownerSet.add(dealer.ownerIndex);
                    targetParty.totalPower += dealer.power;
                    usedCharacterNames.add(dealer.name);
                    assignedDealerIndex = i;
                    successfullyPlacedADealerInOverallLoop = true; // 이번 '전체 루프'에서 한 명이라도 배정 성공
                    break; // 이 파티는 이번 라운드에서 딜러를 선택했으므로 다음 파티로 넘어감
                }
            }
        }

        if (assignedDealerIndex !== -1) {
            availableDealers.splice(assignedDealerIndex, 1); // 사용된 딜러는 목록에서 제거
        }
        // 주의: 여기서 break를 하여 while(true)로 돌아가면 이전 로직과 같아짐.
        // 이 for문이 한 라운드를 의미하므로, for문은 계속 돌아야 함.
    }
    // --- 한 라운드 종료 ---
  }

  // 5. 최종 파티 목록 구성
  partyShells.forEach(shell => {
    parties.push(shell.members);
  });

  return parties;
}

// // 8인 레이드 파티 생성 (수정안)
// function generate8ManParties(characters, healerCount /*, minCombatPower - 8인도 필요하면 추가 */) {
//   const parties = [];
//   const availableCharacters = [...characters];
//   const usedCharacters = new Set(); // 전체 파티에서 사용된 캐릭터 추적

//   // 만들 파티의 수 결정
//   let numPartiesToCreate = 0;
//   if (availableCharacters.length > 0) {
//     numPartiesToCreate = Math.ceil(availableCharacters.length / 8);
//   } else {
//     numPartiesToCreate = 1; // 캐릭터가 없어도 빈 파티 1개 생성
//   }

//   for (let i = 0; i < numPartiesToCreate; i++) {
//     const party = [];
//     const usedOwners = new Set(); // 현재 파티 내 길드원 중복 방지

//     // 1. 지정된 수만큼 힐러 배치
//     const healersForParty = availableCharacters
//       .filter((c) => c.role === "힐러" && !usedCharacters.has(c.name))
//       .sort((a,b) => b.power - a.power); // 높은 전투력 힐러 우선

//     for (let h = 0; h < healerCount && party.length < 8; h++) {
//       const healerToAdd = healersForParty.find(heal => !usedCharacters.has(heal.name) && !usedOwners.has(heal.ownerIndex));
//       if (healerToAdd) {
//         party.push(healerToAdd);
//         usedCharacters.add(healerToAdd.name);
//         usedOwners.add(healerToAdd.ownerIndex);
//       } else {
//         break; // 배치할 힐러 부족
//       }
//     }

//     // 2. 탱커 배치 (예: 파티당 1~2명 시도)
//     const tanksForParty = availableCharacters
//       .filter((c) => c.role === "탱커" && !usedCharacters.has(c.name))
//       .sort((a,b) => b.power - a.power);

//     const targetTanks = Math.min(2, tanksForParty.filter(t => !usedOwners.has(t.ownerIndex)).length); // 최대 2명 또는 가능한 탱커 수
//     for (let t = 0; t < targetTanks && party.length < 8; t++) {
//       const tankToAdd = tanksForParty.find(tank => !usedCharacters.has(tank.name) && !usedOwners.has(tank.ownerIndex));
//       if (tankToAdd) {
//         party.push(tankToAdd);
//         usedCharacters.add(tankToAdd.name);
//         usedOwners.add(tankToAdd.ownerIndex);
//       } else {
//         break; // 배치할 탱커 부족
//       }
//     }

//     // 3. 딜러 배치 (나머지 슬롯)
//     const dealersForParty = availableCharacters
//       .filter((c) => c.role === "딜러" && !usedCharacters.has(c.name))
//       .sort((a, b) => b.power - a.power);

//     while (party.length < 8) {
//       const dealerToAdd = dealersForParty.find(d => !usedCharacters.has(d.name) && !usedOwners.has(d.ownerIndex));
//       if (dealerToAdd) {
//         party.push(dealerToAdd);
//         usedCharacters.add(dealerToAdd.name);
//         usedOwners.add(dealerToAdd.ownerIndex);
//       } else {
//         break; // 배치할 딜러 부족 또는 모든 딜러 사용
//       }
//     }
    
//     // 4. 역할 무관하게 남은 캐릭터로 채우기 (선택적, 위에서 역할별로 최대한 채웠으므로)
//     if (party.length < 8) {
//         const remainingCharsForParty = availableCharacters
//             .filter(c => !usedCharacters.has(c.name) && !usedOwners.has(c.ownerIndex))
//             .sort((a,b) => b.power - a.power);
        
//         for (const char of remainingCharsForParty) {
//             if (party.length >= 8) break;
//             party.push(char);
//             usedCharacters.add(char.name);
//             usedOwners.add(char.ownerIndex);
//         }
//     }


//     parties.push(party);
//   }

//   return parties;
// }

// 8인 레이드 파티 생성 (수정안)
function generate8ManParties(charactersInput, healerCountPerParty, minCombatPower = 0) {
  // 0. 초기 설정 및 최소 전투력 필터링
  const charactersForPartyBuilding = charactersInput.filter(c => c.power >= minCombatPower);
  const partiesOutput = []; // 최종 파티 목록
  const partyShells = []; // 파티 중간 구성 데이터 배열
  const usedCharacterNames = new Set(); // 전체적으로 사용된 캐릭터 이름 추적

  // 1. 파티 '틀' 생성 로직
  let numPartiesToCreate = 0;
  // UI 직접 접근보다는, 이 값이 필요한 경우 함수의 인자로 받는 것이 좋습니다.
  // const raidTypeVal = $("#raidType").val(); // 예시: 현재 함수에서는 직접 사용하지 않음.

  if (charactersInput.length > 0) {
    numPartiesToCreate = Math.ceil(charactersInput.length / 8);
  } else {
    // 캐릭터가 아예 없으면 빈 파티 1개 (displayParties에서 빈 슬롯 처리)
    // 이 조건은 generateParties 메인 함수에서 호출 여부를 결정하는 것이 더 적절할 수 있음.
    // 여기서는 일단 생성.
    numPartiesToCreate = 1;
  }

  // 실제 배치할 캐릭터가 있을 경우, 해당 캐릭터 수 기준으로 파티 수 재조정 가능
  if (charactersForPartyBuilding.length > 0) {
    numPartiesToCreate = Math.ceil(charactersForPartyBuilding.length / 8);
  } else if (charactersInput.length > 0) {
    // 원본 캐릭터는 있으나 필터링 후 0명 -> 원본 기준 파티 수 유지 또는 최소 1개
    numPartiesToCreate = Math.max(1, Math.ceil(charactersInput.length / 8));
  } else if (charactersInput.length === 0 && numPartiesToCreate === 0) {
    numPartiesToCreate = 1; // 정말 아무 캐릭터도 없으면 빈 파티 1개
  }


  for (let i = 0; i < numPartiesToCreate; i++) {
    partyShells.push({
      id: i,
      members: [], // 개별 파티 멤버
      ownerSet: new Set(), // 해당 파티 내 중복 소유주 방지용 Set
      totalPower: 0,
      healersAssigned: 0,
      tanksAssigned: 0,
      partySize: 8 // 8인 레이드 기준
    });
  }

  // 배치할 캐릭터가 전혀 없으면 빈 쉘들로 구성된 파티 목록 반환
  if (charactersForPartyBuilding.length === 0) {
    partyShells.forEach(shell => partiesOutput.push(shell.members));
    return partiesOutput;
  }

  // 역할별 사용 가능한 캐릭터 목록 (초기 필터링된 캐릭터 대상, 이후 배정 시마다 이 목록에서 직접 제거)
  let availableHealers = charactersForPartyBuilding
    .filter(c => c.role === "힐러") // 이 시점에서는 usedCharacterNames를 보지 않음 (아직 아무도 안 썼으므로)
    .sort((a, b) => b.power - a.power);
  let availableTanks = charactersForPartyBuilding
    .filter(c => c.role === "탱커")
    .sort((a, b) => b.power - a.power);
  let availableDealers = charactersForPartyBuilding
    .filter(c => c.role === "딜러")
    .sort((a, b) => b.power - a.power);

  // --- 헬퍼 함수: 파티 정렬 (약한 파티 또는 특정 역할군 부족 파티 우선) ---
  const sortPartyShells = (shells, primaryCountField = null) => {
    shells.sort((a, b) => {
      if (primaryCountField && a[primaryCountField] !== b[primaryCountField]) {
        return a[primaryCountField] - b[primaryCountField]; // 해당 역할군 할당 적은 순
      }
      const avgA = a.members.length > 0 ? a.totalPower / a.members.length : 0;
      const avgB = b.members.length > 0 ? b.totalPower / b.members.length : 0;
      if (avgA !== avgB) return avgA - avgB; // 평균 전투력 낮은 순
      return a.members.length - b.members.length; // 멤버 수 적은 순
    });
  };
  
  // --- 1. 목표 힐러 수 기반 힐러 배분 ---
  for (let round = 0; round < healerCountPerParty; round++) { // healerCountPerParty는 UI에서 받은 값
    sortPartyShells(partyShells, 'healersAssigned');
    for (const currentPartyShell of partyShells) {
      if (currentPartyShell.members.length < currentPartyShell.partySize && currentPartyShell.healersAssigned < (round + 1) && availableHealers.length > 0) {
        for (let i = 0; i < availableHealers.length; i++) {
          const healer = availableHealers[i];
          if (!usedCharacterNames.has(healer.name) && !currentPartyShell.ownerSet.has(healer.ownerIndex)) {
            currentPartyShell.members.push(healer);
            currentPartyShell.ownerSet.add(healer.ownerIndex);
            currentPartyShell.totalPower += healer.power;
            currentPartyShell.healersAssigned++;
            usedCharacterNames.add(healer.name); // 전역 사용 목록에 추가
            availableHealers.splice(i, 1); // 사용 가능한 목록에서 제거
            break; 
          }
        }
      }
    }
  }

  // --- 2. 탱커 균등 배분 ---
  // 8인 레이드에서 보통 파티당 1~2명의 탱커를 사용. 최대 2라운드(파티당 최대 2탱) 시도.
  const maxTankRounds = Math.min(2, Math.ceil(availableTanks.filter(t => !usedCharacterNames.has(t.name)).length / numPartiesToCreate) || 1);

  for (let round = 0; round < maxTankRounds; round++) {
    sortPartyShells(partyShells, 'tanksAssigned');
    for (const currentPartyShell of partyShells) {
      if (currentPartyShell.members.length < currentPartyShell.partySize && currentPartyShell.tanksAssigned < (round + 1) && availableTanks.length > 0) {
        for (let i = 0; i < availableTanks.length; i++) {
          const tank = availableTanks[i];
          if (!usedCharacterNames.has(tank.name) && !currentPartyShell.ownerSet.has(tank.ownerIndex)) {
            currentPartyShell.members.push(tank);
            currentPartyShell.ownerSet.add(tank.ownerIndex);
            currentPartyShell.totalPower += tank.power;
            currentPartyShell.tanksAssigned++;
            usedCharacterNames.add(tank.name);
            availableTanks.splice(i, 1);
            break; 
          }
        }
      }
    }
  }

  // --- 3. 잔여 힐러 배분 ---
  // availableHealers는 1단계에서 사용 후 '실제로 전역에서 사용되지 않은' 힐러들로 재구성 필요
  availableHealers = availableHealers.filter(h => !usedCharacterNames.has(h.name)); // 이미 사용된 힐러 제외
  
  while (availableHealers.length > 0) {
    sortPartyShells(partyShells); // 평균 전투력 약한 순 정렬 (healersAssigned는 이미 최소치 반영됨)
    let placedInThisCycle = false;
    // 아직 자리 있는 가장 약한 파티부터 순회
    for (const currentPartyShell of partyShells) {
        if (currentPartyShell.members.length < currentPartyShell.partySize && availableHealers.length > 0) {
            for (let i = 0; i < availableHealers.length; i++) {
                const healer = availableHealers[i];
                if (!usedCharacterNames.has(healer.name) && !currentPartyShell.ownerSet.has(healer.ownerIndex)) {
                    currentPartyShell.members.push(healer);
                    currentPartyShell.ownerSet.add(healer.ownerIndex);
                    currentPartyShell.totalPower += healer.power;
                    currentPartyShell.healersAssigned++;
                    usedCharacterNames.add(healer.name);
                    availableHealers.splice(i, 1);
                    placedInThisCycle = true;
                    break; // 이 파티에 잔여 힐러 배정 완료, 다음 약한 파티로 (for문 계속)
                }
            }
             if (placedInThisCycle && availableHealers.length > 0) { // 한명 배치했으면 다음 파티로 가기 전에 루프 재시작하여 다시 정렬
                // 혹은 이 for문이 한 라운드를 의미하게 두려면 이 break는 없어야 함.
                // 여기서는 가장 약한 파티에게 계속 기회를 주는 방식.
                 break; 
             }
        }
    }
    if (!placedInThisCycle) break; 
  }


  // --- 4. 딜러 배분 (라운드 기반, 약한 파티 우선) ---
  availableDealers = availableDealers.filter(d => !usedCharacterNames.has(d.name)); // 이미 사용된 딜러 제외

  let loopControl = true; // 변수명 한글로 변경 시 적절한 영문 변수명 사용 권장 (예: placedDealerInOverallLoop)
  while (loopControl && availableDealers.length > 0) {
    loopControl = false;

    let partiesNeedingDealers = partyShells.filter(s => s.members.length < s.partySize);
    if (partiesNeedingDealers.length === 0) break;

    sortPartyShells(partiesNeedingDealers); // 평균 전투력 낮은 순 정렬

    for (const targetParty of partiesNeedingDealers) {
      if (targetParty.members.length >= targetParty.partySize || availableDealers.length === 0) continue;

      let assignedDealerIndex = -1;
      for (let i = 0; i < availableDealers.length; i++) {
        const dealer = availableDealers[i];
        if (!usedCharacterNames.has(dealer.name) && !targetParty.ownerSet.has(dealer.ownerIndex)) {
          // 8인 레이드용 특별한 조합 규칙(예: 전체 원거리 금지)은 현재 없음. 필요시 추가.
          targetParty.members.push(dealer);
          targetParty.ownerSet.add(dealer.ownerIndex);
          targetParty.totalPower += dealer.power;
          usedCharacterNames.add(dealer.name);
          assignedDealerIndex = i;
          loopControl = true;
          break; 
        }
      }
      if (assignedDealerIndex !== -1) {
        availableDealers.splice(assignedDealerIndex, 1);
        // 한 파티에 딜러 배정 후, 다음 라운드에서 다시 가장 약한 파티를 찾도록 외부 while 루프로 제어 이동.
        // 이를 위해 for (const targetParty of partiesNeedingDealers) 루프도 break.
        break;
      }
    }
    // 만약 for (targetParty) 루프를 다 돌았는데 아무도 배정 못 받았으면 loopControl는 false 유지되어 while 종료.
  }
  
  // 5. 최종 파티 목록 구성
  partyShells.forEach(shell => {
    partiesOutput.push(shell.members);
  });

  return partiesOutput;
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
          <span class="member-role role-${member.role.toLowerCase()}">${member.role}</span>
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