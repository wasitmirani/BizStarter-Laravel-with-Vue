(function () {
    'use strict';

    // swiper with navigation
    var swiper = new Swiper(".swiper-related-jobs", {
      direction: "vertical",
      pagination: {
          el: ".swiper-pagination",
          clickable: true,
      },
      loop: true,
      autoplay: {
          delay: 1500,
          disableOnInteraction: false
      }
    });

})();