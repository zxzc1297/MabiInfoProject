// 재료 데이터 (실제로는 서버에서 가져올 데이터)
const materialsData = {
  "철 광석": {
    image: "https://via.placeholder.com/60x60/8B4513/FFFFFF?text=철",
    description: "가장 기본적인 금속 재료로, 다양한 무기와 도구 제작에 사용됩니다.",
    locations: [
      { name: "초보자 광산", type: "채굴", dropRate: "90%", level: "1-10" },
      { name: "돌골렘", type: "몬스터", dropRate: "15%", level: "5-15" },
      { name: "광산 던전 1층", type: "던전", dropRate: "100%", level: "10+" },
    ],
  },
  "마나 허브": {
    image: "https://via.placeholder.com/60x60/228B22/FFFFFF?text=약초",
    description: "마법력이 깃든 특별한 허브로, 마나 회복 물약 제작에 필수적입니다.",
    locations: [
      { name: "마법의 숲", type: "채집", dropRate: "70%", level: "15-25" },
      { name: "엘프 마을 근처", type: "채집", dropRate: "50%", level: "10+" },
      { name: "마나 정령", type: "몬스터", dropRate: "25%", level: "20-30" },
    ],
  },
  "드래곤 가죽": {
    image: "https://via.placeholder.com/60x60/8B4513/FFFFFF?text=가죽",
    description: "고대 드래곤의 가죽으로, 최고급 방어구 제작에만 사용되는 귀중한 재료입니다.",
    locations: [
      { name: "고대 드래곤", type: "레이드 보스", dropRate: "5%", level: "80+" },
      { name: "드래곤 둥지", type: "던전", dropRate: "15%", level: "70+" },
      { name: "용족 상인", type: "NPC 교환", dropRate: "100%", level: "60+" },
    ],
  },
  "마력 결정": {
    image: "https://via.placeholder.com/60x60/9932CC/FFFFFF?text=마석",
    description: "순수한 마력이 결정화된 형태로, 장비 강화와 마법 부여에 사용됩니다.",
    locations: [
      { name: "마력 폭풍 지역", type: "채집", dropRate: "30%", level: "40+" },
      { name: "마법사 탑", type: "던전", dropRate: "45%", level: "50+" },
      { name: "마력 골렘", type: "몬스터", dropRate: "20%", level: "45-55" },
    ],
  },
  "신성한 보석": {
    image: "https://via.placeholder.com/60x60/FFD700/000000?text=보석",
    description: "신들의 축복이 깃든 보석으로, 전설급 액세서리 제작에만 사용할 수 있습니다.",
    locations: [
      { name: "신전 최상층", type: "던전", dropRate: "1%", level: "90+" },
      { name: "신의 사도", type: "레이드 보스", dropRate: "3%", level: "95+" },
      { name: "신성한 제단", type: "특별 이벤트", dropRate: "10%", level: "80+" },
    ],
  },
  "은 광석": {
    image: "https://via.placeholder.com/60x60/C0C0C0/000000?text=은",
    description: "순수한 은으로 이루어진 광석으로, 마법 무기 제작에 특히 유용합니다.",
    locations: [
      { name: "은빛 광산", type: "채굴", dropRate: "60%", level: "20-30" },
      { name: "은빛 늑대", type: "몬스터", dropRate: "12%", level: "25-35" },
      { name: "달빛 동굴", type: "던전", dropRate: "80%", level: "30+" },
    ],
  },
}

// 장바구니 데이터
let cartItems = []

$(document).ready(() => {
  // 필터 버튼 클릭 이벤트
  $(".filter-btn").click(function () {
    const group = $(this).parent()
    group.find(".filter-btn").removeClass("active")
    $(this).addClass("active")
    filterMaterials()
  })

  // 정렬 변경 이벤트
  $("#sort-select").change(function () {
    sortMaterials($(this).val())
  })

  // 보기 방식 변경
  $(".view-toggle").click(function () {
    console.log("toggle click!");
    $(".view-toggle").removeClass("active")
    $(this).addClass("active")

    const viewType = $(this).data("view")
    const container = $("#materials-container")

    if (viewType === "grid") {
      container.removeClass("list-view").addClass("grid-view")
    } else {
      container.removeClass("grid-view").addClass("list-view")
    }
  })

  // 장바구니 버튼 클릭 이벤트
  $(document).on("click", ".btn-cart", function () {
    const materialCard = $(this).closest(".material-card")
    const materialName = materialCard.find(".material-name").text()
    addToCart(materialName)
  })

  // 장바구니 관련 버튼들
  $(".btn-clear-cart").click(() => {
    clearCart()
  })

  $(".btn-view-locations").click(() => {
    viewAllLocations()
  })
})

// 재료 검색 함수
function searchMaterials() {
  const searchTerm = $("#material-search").val().toLowerCase()
  $(".material-card").each(function () {
    const materialName = $(this).find(".material-name").text().toLowerCase()
    const materialDesc = $(this).find(".material-description").text().toLowerCase()

    if (materialName.includes(searchTerm) || materialDesc.includes(searchTerm)) {
      $(this).show()
    } else {
      $(this).hide()
    }
  })
}

// 재료 필터링 함수
function filterMaterials() {
  const category = $(".filter-buttons [data-category].active").data("category")
  const grade = $(".filter-buttons [data-grade].active").data("grade")
  const usage = $(".filter-buttons [data-usage].active").data("usage")

  $(".material-card").each(function () {
    const cardCategory = $(this).data("category")
    const cardGrade = $(this).data("grade")
    const cardUsage = $(this).data("usage")

    let show = true

    if (category !== "all" && cardCategory !== category) show = false
    if (grade !== "all" && cardGrade !== grade) show = false
    if (usage !== "all" && cardUsage !== usage) show = false

    if (show) {
      $(this).show()
    } else {
      $(this).hide()
    }
  })
}

// 재료 정렬 함수
function sortMaterials(sortBy) {
  const container = $("#materials-container")
  const cards = container.find(".material-card").get()

  cards.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return $(a).find(".material-name").text().localeCompare($(b).find(".material-name").text())
      case "grade":
        const gradeOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 }
        return gradeOrder[$(a).data("grade")] - gradeOrder[$(b).data("grade")]
      case "category":
        return $(a).data("category").localeCompare($(b).data("category"))
      default:
        return 0
    }
  })

  container.empty().append(cards)
}

// 획득처 모달 표시 함수
function showLocationModal(materialName) {
  const material = materialsData[materialName]
  if (!material) return

  $("#modal-material-name").text(materialName)
  $("#modal-material-image").attr("src", material.image)
  $("#modal-material-description").text(material.description)

  const locationsContainer = $("#locations-container")
  locationsContainer.empty()

  material.locations.forEach((location) => {
    const locationHtml = `
            <div class="location-item">
                <div class="location-header">
                    <h5>${location.name}</h5>
                    <span class="location-type">${location.type}</span>
                </div>
                <div class="location-details">
                    <span class="drop-rate">드롭률: ${location.dropRate}</span>
                    <span class="level-req">권장 레벨: ${location.level}</span>
                </div>
            </div>
        `
    locationsContainer.append(locationHtml)
  })

  $("#location-modal").show()
}

// 획득처 모달 닫기 함수
function closeLocationModal() {
  $("#location-modal").hide()
}

// 장바구니에 추가 함수
function addToCart(materialName) {
  const existingItem = cartItems.find((item) => item.name === materialName)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cartItems.push({ name: materialName, quantity: 1 })
  }

  updateCartDisplay()

  // 성공 메시지 표시
  showToast(`${materialName}이(가) 장바구니에 추가되었습니다.`)
}

// 장바구니 표시 업데이트 함수
function updateCartDisplay() {
  const cartContainer = $("#cart-items")
  cartContainer.empty()

  if (cartItems.length === 0) {
    cartContainer.html('<p class="empty-cart">장바구니가 비어있습니다.</p>')
    return
  }

  cartItems.forEach((item, index) => {
    const cartItemHtml = `
            <div class="cart-item">
                <span class="item-name">${item.name}</span>
                <div class="item-controls">
                    <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `
    cartContainer.append(cartItemHtml)
  })
}

// 수량 변경 함수
function changeQuantity(index, change) {
  cartItems[index].quantity += change
  if (cartItems[index].quantity <= 0) {
    cartItems.splice(index, 1)
  }
  updateCartDisplay()
}

// 장바구니에서 제거 함수
function removeFromCart(index) {
  cartItems.splice(index, 1)
  updateCartDisplay()
}

// 장바구니 비우기 함수
function clearCart() {
  cartItems = []
  updateCartDisplay()
  showToast("장바구니가 비워졌습니다.")
}

// 모든 획득처 보기 함수
function viewAllLocations() {
  if (cartItems.length === 0) {
    showToast("장바구니에 아이템이 없습니다.")
    return
  }

  let allLocations = ""
  cartItems.forEach((item) => {
    const material = materialsData[item.name]
    if (material) {
      allLocations += `\n${item.name}:\n`
      material.locations.forEach((location) => {
        allLocations += `- ${location.name} (${location.type}, 드롭률: ${location.dropRate})\n`
      })
    }
  })

  alert("장바구니 아이템 획득처:\n" + allLocations)
}

// 토스트 메시지 표시 함수
function showToast(message) {
  // 간단한 토스트 메시지 구현
  const toast = $(`<div class="toast">${message}</div>`)
  $("body").append(toast)

  setTimeout(() => {
    toast.addClass("show")
  }, 100)

  setTimeout(() => {
    toast.removeClass("show")
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

// 모달 외부 클릭시 닫기
$(document).click((event) => {
  if (event.target.id === "location-modal") {
    closeLocationModal()
  }
})

// 검색 엔터키 이벤트
$("#material-search").keypress((e) => {
  if (e.which === 13) {
    searchMaterials()
  }
})
