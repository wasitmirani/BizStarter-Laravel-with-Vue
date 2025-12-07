
function updateTimer() {
    future = Date.parse("Mar 31, 2025 5:30:00");
    now = new Date();
    diff = future - now;

    days = Math.floor(diff / (1000 * 60 * 60 * 24));
    hours = Math.floor(diff / (1000 * 60 * 60));
    mins = Math.floor(diff / (1000 * 60));
    secs = Math.floor(diff / 1000);

    d = days;
    h = hours - days * 24;
    m = mins - hours * 60;
    s = secs - mins * 60;

    document.getElementById("timer")
        .innerHTML =
        '<div><div class="text-center auth-timer primary-dash-border rounded"><h2 class="mb-0  d-block  mt-2 text-default fw-semibold">' + d + '</h2><p class="mt-1 fs-12 fw-medium">DAYS</p></div></div>' +
        '<div><h3 class="mt-4 custom-main">:</h3></div>'+
        '<div><div class="text-center auth-timer primary-dash-border rounded"><h2 class="d-block mb-0 mt-2 text-default fw-semibold">' + h + '</h2><p class="mt-1 fs-12 fw-medium">HOURS</p></div></div>' +
        '<div><h3 class="mt-4 custom-main">:</h3></div>'+
        '<div><div class="text-center auth-timer primary-dash-border rounded"><h2 class="mb-0 d-block mt-2 text-default fw-semibold">' + m + '</h2><p class="mt-1 fs-12 fw-medium">MINUTES</p></div></div>' +
        '<div><h3 class="mt-4 custom-main">:</h3></div>'+
        '<div><div class="text-center auth-timer primary-dash-border rounded"><h2 class="mb-0 d-block mt-2 text-default fw-semibold">' + s + '</h2><p class="mt-1 fs-12 fw-medium">SECONDS</p></div></div>'
}
setInterval('updateTimer()', 1000);


/* anime js */
var pathEls = document.querySelectorAll('path');
for (var i = 0; i < pathEls.length; i++) {
  var pathEl = pathEls[i];
  var offset = anime.setDashoffset(pathEl);
  pathEl.setAttribute('stroke-dashoffset', offset);
  anime({
    targets: pathEl,
    strokeDashoffset: [offset, 0],
    duration: anime.random(1000, 3000),
    delay: anime.random(0, 2000),
    loop: true,
    direction: 'alternate',
    easing: 'easeInOutSine',
    autoplay: true
  });
}
/* anime js */