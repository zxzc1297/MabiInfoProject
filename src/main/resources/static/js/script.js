$(document).ready(function() {
    console.log("Document ready!");
    // Mobile menu toggle
    $(".mobile-menu-toggle").click(function() {
        $(".mobile-nav").toggleClass("active");
    });

    // 테마 토글 기능
    $(".dark-light").click(function () {
        console.log("Theme toggle clicked!")
        $("body").toggleClass("light-theme")

        const $icon = $(this).find("i")
        if ($("body").hasClass("light-theme")) {
            $icon.removeClass("fa-moon").addClass("fa-sun")
            localStorage.setItem("theme", "light")
            console.log("Switched to light theme")
        } else {
            $icon.removeClass("fa-sun").addClass("fa-moon")
            localStorage.setItem("theme", "dark")
            console.log("Switched to dark theme")
        }
    })

    // Material quantity buttons
    $(".quantity-decrease").click(function() {
        const $input = $(this).next("input");
        let value = parseInt($input.val());

        if (value > 1) {
            $input.val(value - 1);
        }
    });

    $(".quantity-increase").click(function() {
        const $input = $(this).prev("input");
        let value = parseInt($input.val());

        if (value < 999) {
            $input.val(value + 1);
        }
    });

    // Add to cart functionality
    $(".add-to-cart").click(function() {
        const $materialItem = $(this).closest(".material-item");
        const materialName = $materialItem.find(".material-name").text();
        const quantity = $materialItem.find("input").val();

        // For demo purposes, let's add it to the cart summary
        const $cartItems = $(".cart-items");
        if ($cartItems.length) {
            // Check if item already exists in cart
            let existingItem = null;
            $(".cart-item").each(function() {
                if ($(this).find(".item-name").text() === materialName) {
                    existingItem = $(this);
                }
            });

            if (existingItem) {
                // Update quantity
                const $quantitySpan = existingItem.find(".item-quantity");
                const currentQuantity = parseInt($quantitySpan.text().replace("x", ""));
                $quantitySpan.text(`x${currentQuantity + parseInt(quantity)}`);
            } else {
                // Add new item
                const cartItemHtml = `
                    <div class="cart-item">
                    <span class="item-name">${materialName}</span>
                    <span class="item-quantity">x${quantity}</span>
                    </div>
                `;
                $cartItems.append(cartItemHtml);
            }
        }
    });

    // Clear cart button
    $(".clear-cart").click(function() {
        $(".cart-items").empty();
    });

    // View locations button
    $(".view-locations").click(function() {
        alert("이 기능은 장바구니에 있는 아이템들의 획득처를 보여줍니다.");
    });

    $.ajax({
        type: "POST",
        url: "/ranking",
        contentType: 'application/json',
        success: function (res){
            console.log("success");
        },
        error: function (xhr, status, error){
            console.log(error);
        },
    });

});