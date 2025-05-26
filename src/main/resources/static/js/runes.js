$(document).ready(function() {
  // Filter reset button
  $(".filter-reset").click(function() {
    $(".runes-filters select").val("all");
    // Here you would typically trigger a filter update or page reload
  });

  // View details buttons
  $(".view-details").click(function() {
    var runeName = $(this).closest(".rune-card").find("h3").text();
    alert(runeName + "의 상세 정보를 보여줍니다.");
  });

  // View locations buttons
  $(".view-locations").click(function() {
    var runeName = $(this).closest(".rune-card").find("h3").text();
    alert(runeName + "의 획득처를 보여줍니다.");
  });

  // Pagination buttons
  $(".pagination-numbers button").click(function() {
    $(".pagination-numbers button").removeClass("active");
    $(this).addClass("active");
    
    // Here you would typically load the corresponding page of results
    console.log($(this).text() + " 페이지 로딩 중...");
  });

  // Search functionality
  function performSearch() {
    var searchTerm = $(".runes-search-input").val().toLowerCase().trim();
    
    if (searchTerm === "") {
      // Show all runes if search term is empty
      $(".rune-card").show();
      return;
    }
    
    // Filter runes based on search term
    $(".rune-card").each(function() {
      var $card = $(this);
      var runeName = $card.find("h3").text().toLowerCase();
      var runeDescription = $card.find(".rune-description").text().toLowerCase();
      
      if (runeName.includes(searchTerm) || runeDescription.includes(searchTerm)) {
        $card.show();
      } else {
        $card.hide();
      }
    });
  }
  
  $(".runes-search-button").click(performSearch);
  
  $(".runes-search-input").keypress(function(e) {
    if (e.which === 13) { // Enter key
      performSearch();
      e.preventDefault();
    }
  });
  
  // Category filter functionality
  $("#category-filter").change(function() {
    var category = $(this).val();
    
    if (category === "all") {
      $(".rune-card").show();
      return;
    }
    
    $(".rune-card").each(function() {
      var $card = $(this);
      var runeCategory = $card.find(".stat-value").first().text().toLowerCase();
      
      if (runeCategory === category) {
        $card.show();
      } else {
        $card.hide();
      }
    });
  });
  
  // Rarity filter functionality
  $("#rarity-filter").change(function() {
    var rarity = $(this).val();
    
    if (rarity === "all") {
      $(".rune-card").show();
      return;
    }
    
    $(".rune-card").each(function() {
      var $card = $(this);
      var $raritySpan = $card.find(".rune-rarity");
      var runeRarity = "";
      
      if ($raritySpan.hasClass("common")) runeRarity = "common";
      else if ($raritySpan.hasClass("uncommon")) runeRarity = "uncommon";
      else if ($raritySpan.hasClass("rare")) runeRarity = "rare";
      else if ($raritySpan.hasClass("epic")) runeRarity = "epic";
      else if ($raritySpan.hasClass("legendary")) runeRarity = "legendary";
      
      if (runeRarity === rarity) {
        $card.show();
      } else {
        $card.hide();
      }
    });
  });
  
  // Level filter functionality
  $("#level-filter").change(function() {
    var levelRange = $(this).val();
    
    if (levelRange === "all") {
      $(".rune-card").show();
      return;
    }
    
    var [minLevel, maxLevel] = levelRange.split("-").map(Number);
    
    $(".rune-card").each(function() {
      var $card = $(this);
      var levelText = $card.find(".stat-value").eq(1).text();
      var level = parseInt(levelText);
      
      if (level >= minLevel && level <= maxLevel) {
        $card.show();
      } else {
        $card.hide();
      }
    });
  });
});