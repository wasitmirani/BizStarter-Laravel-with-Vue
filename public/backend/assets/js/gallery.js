(function () {
    "use strict";

    var lightboxVideo = GLightbox({
        selector: '.glightbox'
    });
    lightboxVideo.on('slide_changed', ({ prev, current }) => {
        console.log('Prev slide', prev);
        console.log('Current slide', current);

        const { slideIndex, slideNode, slideConfig, player } = current;
    });

    var lightboxDescription = GLightbox({
        selector: '.glightbox2'
    });

    var lightboxVideo = GLightbox({
        selector: '.glightbox3'
    });

    var lightboxInlineIframe = GLightbox({
        selector: '.glightbox4'
    });

})();