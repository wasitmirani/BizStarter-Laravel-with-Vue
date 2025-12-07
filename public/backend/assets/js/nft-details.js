(function () {
    'use strict';

    var swiper = new Swiper(".swiper-view-details", {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
    });
    var swiper2 = new Swiper(".swiper-preview-details", {
        spaceBetween: 10,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        thumbs: {
            swiper: swiper,
        }
    });

    
    // swiper with navigation
    var swiper = new Swiper(".swiper-related-jobs", {
        slidesPerView: 1,
          navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
          },
          loop: true,
          autoplay: {
              delay: 1500,
              disableOnInteraction: false,
          },
           breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 5,
            },
            640: {
                slidesPerView: 1,
                spaceBetween: 5,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1400: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
            1600: {
                slidesPerView: 4,
                spaceBetween: 20,
            }
        },
      });

      var swiper3 = new Swiper(".swiper-basic", {
        spaceBetween: 10,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        slidesPerView: 1,
        autoplay: {
          delay: 2300,
          disableOnInteraction: false,
        },
    });

})();