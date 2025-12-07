var swiper = new Swiper(".swiper-navigation", {
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    loop: true,
    autoplay: {
        delay: 1500,
        disableOnInteraction: false,
    }
});