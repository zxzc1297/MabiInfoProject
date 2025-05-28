$(document).ready(() => {
    console.log("js start")
  // 로컬 스토리지에서 테마 설정 불러오기
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "light") {
    $("body").addClass("light-theme")
    $(".dark-light i").removeClass("fa-moon").addClass("fa-sun")
  }

  // Mobile menu toggle
  $(".mobile-menu-toggle").click(() => {
    $(".mobile-nav").toggleClass("active")
  })

  // Theme toggle - dark-light 클래스만 사용
  $(".dark-light").click(function () {
    $("body").toggleClass("light-theme")
    const $icon = $(this).find("i")

    if ($("body").hasClass("light-theme")) {
      $icon.removeClass("fa-moon").addClass("fa-sun")
      localStorage.setItem("theme", "light")
    } else {
      $icon.removeClass("fa-sun").addClass("fa-moon")
      localStorage.setItem("theme", "dark")
    }
  })

  // Material quantity buttons
  $(document).on("click", ".quantity-decrease", function () {
    const $input = $(this).next("input")
    const value = Number.parseInt($input.val())
    if (value > 1) {
      $input.val(value - 1)
    }
  })

  $(document).on("click", ".quantity-increase", function () {
    const $input = $(this).prev("input")
    const value = Number.parseInt($input.val())
    if (value < 999) {
      $input.val(value + 1)
    }
  })

  // Add to cart functionality
  $(document).on("click", ".add-to-cart", function () {
    const $materialItem = $(this).closest(".material-item")
    const materialName = $materialItem.find(".material-name").text()
    const quantity = $materialItem.find("input").val()

    // For demo purposes, let's add it to the cart summary
    const $cartItems = $(".cart-items")
    if ($cartItems.length) {
      // Check if item already exists in cart
      let existingItem = null
      $(".cart-item").each(function () {
        if ($(this).find(".item-name").text() === materialName) {
          existingItem = $(this)
        }
      })

      if (existingItem) {
        // Update quantity
        const $quantitySpan = existingItem.find(".item-quantity")
        const currentQuantity = Number.parseInt($quantitySpan.text().replace("x", ""))
        $quantitySpan.text(`x${currentQuantity + Number.parseInt(quantity)}`)
      } else {
        // Add new item
        const cartItemHtml = `
          <div class="cart-item">
            <span class="item-name">${materialName}</span>
            <span class="item-quantity">x${quantity}</span>
          </div>
        `
        $cartItems.append(cartItemHtml)
      }
    }
  })

  // Clear cart button
  $(document).on("click", ".clear-cart", () => {
    $(".cart-items").empty()
  })

  // View locations button
  $(document).on("click", ".view-locations", () => {
    alert("이 기능은 장바구니에 있는 아이템들의 획득처를 보여줍니다.")
  })
})
