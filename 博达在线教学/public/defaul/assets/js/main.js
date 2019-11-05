(function($) {
  "use strict";

  // ------------------------------------------------------------------------------ //
  // Preloader
  // ------------------------------------------------------------------------------ //

  $("#status").fadeOut();
  $("#preloader")
    .delay(550)
    .fadeOut("slow");
  $("body")
    .delay(550)
    .css({ overflow: "visible" });

  // ------------------------------------------------------------------------------ //
  // Scroll Top
  // ------------------------------------------------------------------------------ //

  $(window).on("scroll", function() {
    if ($(this).scrollTop() > 600) {
      $(".scroll-top").fadeIn(600);
    } else {
      $(".scroll-top").fadeOut(600);
    }
  });
  $(".scroll-top").on("click", function() {
    $("html,body").animate(
      {
        scrollTop: 0
      },
      500
    );
    return false;
  });

  // ------------------------------------------------------------------------------ //
  // Mobile Menu
  // ------------------------------------------------------------------------------ //

  $(function() {
    var $menu = $(".main-menu ul").clone();
    $("#mobile-menu").html($menu);
    $("#mobile-menu ul li:last-child").remove();

    $(".mobile-menu-icon").on("click", function() {
      $(".mobile-menu-wrap").toggleClass("mobile-menu-show");
    });

    $(".close-btn").on("click", function() {
      $(".mobile-menu-wrap").removeClass("mobile-menu-show");
    });
  });

  // ------------------------------------------------------------------------------ //
  // Menu Fix on Scroll
  // ------------------------------------------------------------------------------ //

  $(function() {
    var header = $(".nav-section");
    $(window).scroll(function() {
      var scroll = $(window).scrollTop();

      if (scroll >= 50) {
        header.addClass("menu-fix");
      } else {
        header.removeClass("menu-fix");
      }
    });
  });

  // ------------------------------------------------------------------------------ //
  // Brand Logo Carousel
  // ------------------------------------------------------------------------------ //

  $(".brand-logo-carousel").owlCarousel({
    loop: true,
    margin: 10,
    responsiveClass: true,
    items: 5,
    autoplay: true,
    dots: false,
    responsive: {
      0: {
        items: 2
      },
      600: {
        items: 3
      },
      1000: {
        items: 5
      }
    }
  });

  // ------------------------------------------------------------------------------ //
  // Service Carousel
  // ------------------------------------------------------------------------------ //

  $(".service-carousel").owlCarousel({
    loop: true,
    margin: 15,
    responsiveClass: true,
    items: 3,
    dots: true,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },

      992: {
        items: 3
      }
    }
  });

  // ------------------------------------------------------------------------------ //
  // Testimonial Carousel
  // ------------------------------------------------------------------------------ //

  var action = false,
    clicked = false;
  var Owl = {
    init: function() {
      Owl.carousel();
    },

    carousel: function() {
      var owl;
      $(document).ready(function() {
        owl = $(".owlExample").owlCarousel({
          items: 1,
          center: true,
          nav: true,
          dots: true,
          loop: true,
          margin: 10,
          dotsContainer: ".test",
          navText: [
            '<i class="icofont-long-arrow-left"></i>',
            '<i class="icofont-long-arrow-right"></i>'
          ]
        });

        $(".owl-next").on("click", function() {
          action = "next";
        });

        $(".owl-prev").on("click", function() {
          action = "prev";
        });

        $(".t-img").on("click", "li", function(e) {
          owl.trigger("to.owl.carousel", [$(this).index(), 300]);
        });
      });
    }
  };

  $(document).ready(function() {
    Owl.init();
  });

  // ------------------------------------------------------------------------------ //
  // Contact Form
  // ------------------------------------------------------------------------------ //

  var submitContact = $("#submit-message"),
    message = $("#msg");

  submitContact.on("click", function(e) {
    e.preventDefault();

    var $this = $(this);

    $.ajax({
      type: "POST",
      url: "mail.php",
      dataType: "json",
      cache: false,
      data: $("#contact-form").serialize(),
      success: function(data) {
        if (data.info !== "error") {
          $this
            .parents("form")
            .find("input[type=text],input[type=email],textarea,select")
            .filter(":visible")
            .val("");
          message
            .hide()
            .removeClass("success")
            .removeClass("error")
            .addClass("success")
            .html(data.msg)
            .fadeIn("slow")
            .delay(1000)
            .fadeOut("slow");
        } else {
          message
            .hide()
            .removeClass("success")
            .removeClass("error")
            .addClass("error")
            .html(data.msg)
            .fadeIn("slow")
            .delay(1000)
            .fadeOut("slow");
        }
      }
    });
  });
})(jQuery);
