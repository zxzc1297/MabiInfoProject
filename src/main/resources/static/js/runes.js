$(document).ready(() => {
  // 룬 검색 기능
  function filterRunes() {
    const searchTerm = $("#runeSearch").val().toLowerCase()
    const categoryFilter = $("#categoryFilter").val()
    const gradeFilter = $("#gradeFilter").val()

    let visibleCount = 0

    $(".rune-item").each(function () {
      const $item = $(this)
      const runeName = $item.find(".rune-name").text().toLowerCase()
      const runeCategory = $item.data("category")
      const runeGrade = $item.data("grade")

      let isVisible = true

      // 이름 검색 필터
      if (searchTerm && !runeName.includes(searchTerm)) {
        isVisible = false
      }

      // 카테고리 필터
      if (categoryFilter && runeCategory !== categoryFilter) {
        isVisible = false
      }

      // 등급 필터
      if (gradeFilter && runeGrade !== gradeFilter) {
        isVisible = false
      }

      if (isVisible) {
        $item.show()
        visibleCount++
      } else {
        $item.hide()
      }
    })

    // 검색 결과가 없을 때 메시지 표시
    if (visibleCount === 0) {
      $("#noResults").show()
    } else {
      $("#noResults").hide()
    }
  }

  // 검색 이벤트
  $("#runeSearch").on("input", filterRunes)
  $("#categoryFilter").on("change", filterRunes)
  $("#gradeFilter").on("change", filterRunes)

  // 검색 버튼 클릭
  $(".runes-search-button").click(() => {
    filterRunes()
  })

  // 엔터키로 검색
  $("#runeSearch").keypress((e) => {
    if (e.which === 13) {
      filterRunes()
    }
  })

  // 룬 상세보기 버튼
  $(document).on("click", ".view-details", function () {
    const runeName = $(this).closest(".rune-item").find(".rune-name").text()
    const runeEffect = $(this).closest(".rune-item").find(".rune-effect").html()

    // 간단한 모달 대신 alert로 정보 표시 (실제로는 모달이나 별도 페이지로 구현)
    alert(`룬 이름: ${runeName}\n\n효과:\n${$(runeEffect).text()}`)
  })
})
