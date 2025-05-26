$(document).ready(function() {
  // Toggle cart visibility
  $(".toggle-cart").click(function() {
    $(".cart-container").toggle();
  });

  // Filter reset button
  $(".filter-reset").click(function() {
    $(".materials-filters select").val("all");
    // Here you would typically trigger a filter update or page reload
  });

  // Add to cart functionality
  $(".add-to-cart").click(function() {
    var $materialCard = $(this).closest(".material-card");
    var materialName = $materialCard.find("h3").text();
    var materialImage = $materialCard.find("img").attr("src");
    
    // Check if item already exists in cart
    var $existingItem = $(".cart-items .cart-item").filter(function() {
      return $(this).find(".cart-item-name").text() === materialName;
    });
    
    if ($existingItem.length) {
      // Update quantity
      var $quantityInput = $existingItem.find(".cart-item-quantity input");
      $quantityInput.val(parseInt($quantityInput.val()) + 1);
    } else {
      // Add new item
      var $cartItem = $("<div>").addClass("cart-item").html(
        '<div class="cart-item-info">' +
          '<img src="' + materialImage + '" alt="' + materialName + '">' +
          '<span class="cart-item-name">' + materialName + '</span>' +
        '</div>' +
        '<div class="cart-item-quantity">' +
          '<button class="quantity-decrease">-</button>' +
          '<input type="number" value="1" min="1" max="999">' +
          '<button class="quantity-increase">+</button>' +
        '</div>' +
        '<button class="remove-from-cart">' +
          '<i class="fas fa-trash"></i>' +
        '</button>'
      );
      
      $(".cart-items").append($cartItem);
      
      // Add event listeners to new buttons
      $cartItem.find(".quantity-decrease").click(function() {
        var $input = $(this).next("input");
        var value = parseInt($input.val());
        if (value > 1) {
          $input.val(value - 1);
        }
        updateCartCount();
      });
      
      $cartItem.find(".quantity-increase").click(function() {
        var $input = $(this).prev("input");
        var value = parseInt($input.val());
        if (value < 999) {
          $input.val(value + 1);
        }
        updateCartCount();
      });
      
      $cartItem.find(".remove-from-cart").click(function() {
        $(this).closest(".cart-item").remove();
        updateCartCount();
      });
    }
    
    // Show cart if it's hidden
    $(".cart-container").show();
    
    // Update cart count
    updateCartCount();
  });

  // Clear cart button
  $(".clear-cart").click(function() {
    $(".cart-items").empty();
    updateCartCount();
  });

  // View locations buttons
  $(".view-locations").click(function() {
    var materialName = $(this).closest(".material-card").find("h3").text();
    alert(materialName + "의 획득처를 보여줍니다.");
  });

  // View all locations button
  $(".view-all-locations").click(function() {
    // Get all materials in cart
    var $cartItems = $(".cart-item");
    
    if ($cartItems.length === 0) {
      alert("장바구니가 비어 있습니다.");
      return;
    }
    
    var materialNames = [];
    $cartItems.each(function() {
      materialNames.push($(this).find(".cart-item-name").text());
    });
    
    alert("다음 아이템들의 획득처를 보여줍니다: " + materialNames.join(", "));
  });

  // Pagination buttons
  $(".pagination-numbers button").click(function() {
    $(".pagination-numbers button").removeClass("active");
    $(this).addClass("active");
    
    // Here you would typically load the corresponding page of results
    console.log($(this).text() + " 페이지 로딩 중...");
  });

  // Helper function to update cart count
  function updateCartCount() {
    var totalCount = 0;
    
    $(".cart-item").each(function() {
      var quantity = parseInt($(this).find(".cart-item-quantity input").val());
      totalCount += quantity;
    });
    
    $(".cart-count").text(totalCount);
  }
  
  // Initialize cart count
  updateCartCount();
  
  // Add event delegation for dynamically added elements
  $(document).on("click", ".cart-item .quantity-decrease", function() {
    var $input = $(this).next("input");
    var value = parseInt($input.val());
    if (value > 1) {
      $input.val(value - 1);
    }
    updateCartCount();
  });
  
  $(document).on("click", ".cart-item .quantity-increase", function() {
    var $input = $(this).prev("input");
    var value = parseInt($input.val());
    if (value < 999) {
      $input.val(value + 1);
    }
    updateCartCount();
  });
  
  $(document).on("click", ".cart-item .remove-from-cart", function() {
    $(this).closest(".cart-item").remove();
    updateCartCount();
  });
});