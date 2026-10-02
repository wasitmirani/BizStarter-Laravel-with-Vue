<script setup lang="ts">
let auth_user = window.user;
const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';

function logOut(event:any) {
    event.preventDefault();
    // First try: find any existing server-rendered logout form (Blade) and submit it
    const existing = Array.from(document.forms).find(f => {
        try {
            return new URL(f.action, window.location.href).pathname === '/logout' && f.method.toLowerCase() === 'post';
        } catch (e) { return false; }
    }) as HTMLFormElement | undefined;

    if (existing) {
        const tokenInput = existing.querySelector('input[name="_token"]') as HTMLInputElement | null;
        if (tokenInput) tokenInput.value = csrf;
        existing.submit();
        return;
    }

    // Fallback: create and submit a form programmatically (ensures cookies are sent)
    const f = document.createElement('form');
    f.method = 'POST';
    f.action = '/logout';
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = '_token';
    input.value = csrf;
    f.appendChild(input);
    document.body.appendChild(f);
    f.submit();
}
</script>
<template >
<div>
    <form id="logout-form" method="POST" action="/logout" style="display:none;">
        <input type="hidden" name="_token" :value="csrf">
    </form>
    
      <!-- Start::main-header -->

        <!-- Topbar End -->
        <header class="main-topbar" id="main-topbar">
        <div class="navbar-brand">
          <div class="logos">
            <a href="#!" aria-label="Topbar Logo">
              <img src="/backend/assets/images/main-logo.webp" loading="lazy" height="24" alt="Main Logo" class="logo-dark" />
              <img src="/backend/assets/images/logo-white.webp" loading="lazy" height="24" alt="Logo White" class="logo-light" />
            </a>
          </div>
          <button type="button" id="toggleSidebar" class="sidebar-toggle btn p-0" aria-label="sidebar-toggle"><i class="mgc_layout_rightbar_open_line"></i></button>
        </div>
        <div class="align-items-center d-none d-lg-flex ms-4">
          <div class="position-relative navbar-search">
            <input type="search" class="form-control border-0 shadow-none rounded-pill" placeholder="Search for Name"/>
              <i class="mgc_search_ai_line icon"></i>
          </div>
        </div>
        <div class="d-flex align-items-center gap-1 gap-md-2 gap-xl-10px ms-auto">
          <div class="dropdown d-none d-md-block">
            <button class="btn topbar-link w-auto" id="languageButton" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <span class="topbar-icon">
                <img src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20viewBox='0%200%207410%203900'%3e%3cpath%20fill='%23b22234'%20d='M0%200h7410v3900H0z'/%3e%3cpath%20d='M0%20450h7410m0%20600H0m0%20600h7410m0%20600H0m0%20600h7410m0%20600H0'%20stroke='%23fff'%20stroke-width='300'/%3e%3cpath%20fill='%233c3b6e'%20d='M0%200h2964v2100H0z'/%3e%3cg%20fill='%23fff'%3e%3cg%20id='d'%3e%3cg%20id='c'%3e%3cg%20id='e'%3e%3cg%20id='b'%3e%3cpath%20id='a'%20d='M247%2090l70.534%20217.082-184.66-134.164h228.253L176.466%20307.082z'/%3e%3cuse%20xlink:href='%23a'%20y='420'/%3e%3cuse%20xlink:href='%23a'%20y='840'/%3e%3cuse%20xlink:href='%23a'%20y='1260'/%3e%3c/g%3e%3cuse%20xlink:href='%23a'%20y='1680'/%3e%3c/g%3e%3cuse%20xlink:href='%23b'%20x='247'%20y='210'/%3e%3c/g%3e%3cuse%20xlink:href='%23c'%20x='494'/%3e%3c/g%3e%3cuse%20xlink:href='%23d'%20x='988'/%3e%3cuse%20xlink:href='%23c'%20x='1976'/%3e%3cuse%20xlink:href='%23e'%20x='2470'/%3e%3c/g%3e%3c/svg%3e" loading="lazy" alt="US" class="object-fit-cover rounded-circle size-6"/>
              </span>
            </button>
            <div class="dropdown-menu dropdown-menu-end dropdown-menu-md">
              <div data-simplebar class="dropdown-menu-topbar px-2 mx-n2">
                <ul class="p-0 mb-0">
                  <li>
                    <a class="dropdown-item d-flex gap-2 align-items-center" href="#" data-lang="en">
                      <img src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20viewBox='0%200%207410%203900'%3e%3cpath%20fill='%23b22234'%20d='M0%200h7410v3900H0z'/%3e%3cpath%20d='M0%20450h7410m0%20600H0m0%20600h7410m0%20600H0m0%20600h7410m0%20600H0'%20stroke='%23fff'%20stroke-width='300'/%3e%3cpath%20fill='%233c3b6e'%20d='M0%200h2964v2100H0z'/%3e%3cg%20fill='%23fff'%3e%3cg%20id='d'%3e%3cg%20id='c'%3e%3cg%20id='e'%3e%3cg%20id='b'%3e%3cpath%20id='a'%20d='M247%2090l70.534%20217.082-184.66-134.164h228.253L176.466%20307.082z'/%3e%3cuse%20xlink:href='%23a'%20y='420'/%3e%3cuse%20xlink:href='%23a'%20y='840'/%3e%3cuse%20xlink:href='%23a'%20y='1260'/%3e%3c/g%3e%3cuse%20xlink:href='%23a'%20y='1680'/%3e%3c/g%3e%3cuse%20xlink:href='%23b'%20x='247'%20y='210'/%3e%3c/g%3e%3cuse%20xlink:href='%23c'%20x='494'/%3e%3c/g%3e%3cuse%20xlink:href='%23d'%20x='988'/%3e%3cuse%20xlink:href='%23c'%20x='1976'/%3e%3cuse%20xlink:href='%23e'%20x='2470'/%3e%3c/g%3e%3c/svg%3e" loading="lazy" alt="US" class="object-fit-cover rounded-circle size-6"/>
                        <span>English</span>
                        <span class="text-muted fs-sm ms-auto">EN</span>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item d-flex gap-2 align-items-center" href="#" data-lang="es">
                      <img src="/backend/assets/images/es.svg" loading="lazy" alt="ES" class="object-fit-cover rounded-circle size-6" />  
                        <span>Spanish</span>
                        <span class="text-muted fs-sm ms-auto">ES</span>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item d-flex gap-2 align-items-center" href="#" data-lang="fr">
                      <img src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%203%202'%3e%3cpath%20fill='%23EC1920'%20d='M0%200h3v2H0z'/%3e%3cpath%20fill='%23fff'%20d='M0%200h2v2H0z'/%3e%3cpath%20fill='%23051440'%20d='M0%200h1v2H0z'/%3e%3c/svg%3e" loading="lazy" alt="FR" class="object-fit-cover rounded-circle size-6"/>
                        <span>French</span>
                        <span class="text-muted fs-sm ms-auto">FR</span>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item d-flex gap-2 align-items-center" href="#" data-lang="ru">
                      <img src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%209%206'%3e%3cpath%20fill='%23fff'%20d='M0%200h9v3H0z'/%3e%3cpath%20fill='%23DA291C'%20d='M0%203h9v3H0z'/%3e%3cpath%20fill='%230032A0'%20d='M0%202h9v2H0z'/%3e%3c/svg%3e" loading="lazy" alt="RU" class="object-fit-cover rounded-circle size-6"/>
                        <span>Russian</span>
                        <span class="text-muted fs-sm ms-auto">RU</span>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item d-flex gap-2 align-items-center" href="#" data-lang="de">
                      <img src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%205%203'%3e%3cpath%20d='M0%200h5v3H0z'/%3e%3cpath%20fill='%23D00'%20d='M0%201h5v2H0z'/%3e%3cpath%20fill='%23FFCE00'%20d='M0%202h5v1H0z'/%3e%3c/svg%3e" loading="lazy" alt="DE" class="object-fit-cover rounded-circle size-6"/>
                        <span>German</span>
                        <span class="text-muted fs-sm ms-auto">DE</span>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item d-flex gap-2 align-items-center" href="#" data-lang="it">
                      <img src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%203%202'%3e%3cpath%20fill='%23008C45'%20d='M0%200h1v2H0z'/%3e%3cpath%20fill='%23fff'%20d='M1%200h1v2H1z'/%3e%3cpath%20fill='%23CD212A'%20d='M2%200h1v2H2z'/%3e%3c/svg%3e" loading="lazy" alt="IT" class="object-fit-cover rounded-circle size-6" />
                        <span>Italian</span>
                        <span class="text-muted fs-sm ms-auto">IT</span>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item d-flex gap-2 align-items-center" href="#" data-lang="zh">
                      <img src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20viewBox='0%200%2030%2020'%3e%3cdefs%3e%3cpath%20id='a'%20d='M0-1L.588.809-.952-.309H.952L-.588.809z'%20fill='%23FF0'/%3e%3c/defs%3e%3cpath%20fill='%23EE1C25'%20d='M0%200h30v20H0z'/%3e%3cuse%20xlink:href='%23a'%20transform='matrix(3%200%200%203%205%205)'/%3e%3cuse%20xlink:href='%23a'%20transform='rotate(23.036%20.093%2025.536)'/%3e%3cuse%20xlink:href='%23a'%20transform='rotate(45.87%201.273%2016.18)'/%3e%3cuse%20xlink:href='%23a'%20transform='rotate(69.945%20.996%2012.078)'/%3e%3cuse%20xlink:href='%23a'%20transform='rotate(20.66%20-19.689%2031.932)'/%3e%3c/svg%3e" loading="lazy" alt="CN" class="object-fit-cover rounded-circle size-6" />
                        <span>Chinese</span>
                        <span class="text-muted fs-sm ms-auto">ZH</span>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item d-flex gap-2 align-items-center" href="#" data-lang="ar">
                      <img src="/backend/assets/images/sa.svg" loading="lazy" alt="SA" class="object-fit-cover rounded-circle size-6"/>
                        <span>Arabic</span>
                        <span class="text-muted fs-sm ms-auto">AR</span>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item d-flex gap-2 align-items-center" href="#" data-lang="tr">
                      <img src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2012%208'%3e%3cpath%20fill='%23E30A17'%20d='M0%200h12v8H0z'/%3e%3ccircle%20cx='4.25'%20cy='4'%20r='2'%20fill='%23fff'/%3e%3ccircle%20cx='4.75'%20cy='4'%20r='1.6'%20fill='%23e30a17'/%3e%3cpath%20fill='%23fff'%20d='M5.83334%204l1.80901%20.58779-1.11804-1.53885v1.90212l1.11804-1.53885z'/%3e%3c/svg%3e" loading="lazy" alt="TR" class="object-fit-cover rounded-circle size-6" />
                        <span>Turkish</span>
                        <span class="text-muted fs-sm ms-auto">TR</span>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item d-flex gap-2 align-items-center" href="#" data-lang="he">
                      <img src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%201100%20800'%3e%3cpath%20d='M0%200h1100v800H0z'%20fill='%23fff'/%3e%3cpath%20d='M0%2075h1100v125H0zm0%20525h1100v125H0z'%20fill='%230038b8'/%3e%3cpath%20d='M423.816%20472.853h252.368L550%20254.295zM550%20545.705l126.184-218.558H423.816z'%20fill='none'%20stroke='%230038b8'%20stroke-width='27.5'/%3e%3c/svg%3e" loading="lazy" alt="IL" class="object-fit-cover rounded-circle size-6" />
                        <span>Hebrew</span>
                        <span class="text-muted fs-sm ms-auto">HE</span>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item d-flex gap-2 align-items-center" href="#" data-lang="vi">
                      <img src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20viewBox='-15%20-10%2030%2020'%3e%3cpath%20fill='%23DA251d'%20d='M-20-15h40v30h-40z'/%3e%3cg%20id='b'%20transform='translate(0%20-6)'%3e%3cpath%20id='a'%20fill='%23FF0'%20transform='rotate(18)'%20d='M0%200v6h4'/%3e%3cuse%20xlink:href='%23a'%20transform='scale(-1%201)'/%3e%3c/g%3e%3cg%20id='c'%20transform='rotate(72)'%3e%3cuse%20xlink:href='%23b'/%3e%3cuse%20xlink:href='%23b'%20transform='rotate(72)'/%3e%3c/g%3e%3cuse%20xlink:href='%23c'%20transform='scale(-1%201)'/%3e%3c/svg%3e" loading="lazy" alt="VN" class="object-fit-cover rounded-circle size-6" />
                        <span>Vietnamese</span>
                        <span class="text-muted fs-sm ms-auto">VI</span>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item d-flex gap-2 align-items-center" href="#" data-lang="nl">
                      <img src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%209%206'%3e%3cpath%20fill='%2321468B'%20d='M0%200h9v6H0z'/%3e%3cpath%20fill='%23FFF'%20d='M0%200h9v4H0z'/%3e%3cpath%20fill='%23AE1C28'%20d='M0%200h9v2H0z'/%3e%3c/svg%3e" loading="lazy" alt="NL" class="object-fit-cover rounded-circle size-6" />
                        <span>Dutch</span>
                        <span class="text-muted fs-sm ms-auto">NL</span>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item d-flex gap-2 align-items-center" href="#" data-lang="ko">
                      <img src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20viewBox='-36%20-24%2072%2048'%3e%3cpath%20fill='%23fff'%20d='M-36-24h72v48h-72z'/%3e%3cg%20transform='rotate(-56.31)'%3e%3cg%20id='b'%3e%3cpath%20id='a'%20d='M-6-25H6m-12%203H6m-12%203H6'%20stroke='%23000'%20stroke-width='2'/%3e%3cuse%20xlink:href='%23a'%20y='44'/%3e%3c/g%3e%3cpath%20stroke='%23fff'%20d='M0%2017v10'/%3e%3ccircle%20fill='%23cd2e3a'%20r='12'/%3e%3cpath%20fill='%230047a0'%20d='M0-12A6%206%200%20000%200a6%206%200%20010%2012%2012%2012%200%20010-24z'/%3e%3c/g%3e%3cg%20transform='rotate(-123.69)'%3e%3cuse%20xlink:href='%23b'/%3e%3cpath%20stroke='%23fff'%20d='M0-23.5v3M0%2017v3.5m0%203v3'/%3e%3c/g%3e%3c/svg%3e" loading="lazy" alt="KR" class="object-fit-cover rounded-circle size-6" />
                        <span>Korean</span>
                        <span class="text-muted fs-sm ms-auto">KO</span>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item d-flex gap-2 align-items-center" href="#" data-lang="pt">
                      <img src="/backend/assets/images/pt.svg" loading="lazy" alt="PT" class="object-fit-cover rounded-circle size-6" />
                        <span>Portuguese</span>
                        <span class="text-muted fs-sm ms-auto">PT</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <button type="button" id="fullscreenButton" class="topbar-link btn d-none d-md-flex" aria-label="Fullscreen">
            <span class="topbar-icon">
              <i data-lucide="maximize" class="size-4-5"></i>
            </span>
          </button>
          <div class="dropdown">
            <button class="btn topbar-link position-relative" type="button" data-bs-toggle="dropdown" aria-label="Shopping Cart" data-bs-auto-close="outside" aria-expanded="false">
              <span class="topbar-icon">
                <i data-lucide="shopping-cart" class="size-4-5"></i>
                <span class="notification-animate size-2 animate-ping bg-danger rounded-circle" ></span>
                <span class="notification-animate size-2 bg-danger rounded-circle" ></span>
              </span>
            </button>
            <div class="dropdown-menu dropdown-menu-end dropdown-menu-lg p-0">
              <div class="position-relative overflow-hidden">
                <div class="p-4 pb-0 border-bottom">
                  <div class="d-flex align-items-start justify-content-between mb-4">
                    <h6 class="mb-1">Your Shopping Cart</h6>
                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle">03 Items Added</span>
                  </div>
                  <div class="border border-bottom-0 rounded-top py-10px px-4 d-flex align-items-center justify-content-between">
                    <p class="text-muted fs-15">Total Amount :</p>
                    <h5 class="mb-0 fs-16">$833.53</h5>
                  </div>
                </div>
              </div>
              <div class="p-4">
                <div class="vstack gap-4 mb-4">
                  <div class="d-flex align-items-center gap-3 bg-light bg-opacity-75 rounded p-2">
                    <div class="bg-body-secondary rounded-3 p-6px flex-shrink-0">
                      <img src="/backend/assets/images/product-05.webp" alt="Product 05" class="img-fluid size-10" />
                    </div>
                    <div class="flex-grow-1 overflow-hidden">
                      <div class="d-flex align-items-center justify-content-between gap-2 mb-6px">
                        <a href="#!" class="text-reset fw-medium fs-15">Wireless Bluetooth Speaker</a>
                        <h6 class="mb-0">$89.50</h6>
                      </div>
                      <div class="d-flex align-items-end justify-content-between gap-2 mb-1">
                        <span class="text-muted fs-sm">Qty: <span class="fw-medium text-body">01</span></span>
                        <div class="fs-13 d-flex align-items-end">
                          <a href="#!" class="link link-custom-primary pe-2 me-2 border-end">Move to Favourites</a>
                          <a href="#!" class="text-danger"><i class="mgc_delete_2_line"></i></a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3 bg-light bg-opacity-75 rounded p-2">
                    <div class="bg-body-secondary rounded-3 p-6px flex-shrink-0">
                      <img src="/backend/assets/images/product-09.webp" alt="Product 09" class="img-fluid size-10" />
                    </div>
                    <div class="flex-grow-1 overflow-hidden">
                      <div class="d-flex align-items-center justify-content-between gap-2 mb-6px">
                        <a href="#!" class="text-reset fw-medium fs-15">Premium Leather Backpack</a>
                        <h6 class="mb-0">$219.99</h6>
                      </div>
                      <div class="d-flex align-items-end justify-content-between gap-2 mb-1">
                        <span class="text-muted fs-sm">Qty: <span class="fw-medium text-body">02</span></span>
                        <div class="fs-13 d-flex align-items-end">
                          <a href="#!" class="link link-custom-primary pe-2 me-2 border-end">Move to Favourites</a>
                          <a href="#!" class="text-danger"><i class="mgc_delete_2_line"></i></a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3 bg-light bg-opacity-75 rounded p-2">
                    <div class="bg-body-secondary rounded-3 p-6px flex-shrink-0">
                      <img src="/backend/assets/images/product-11.webp" alt="Product 11" class="img-fluid size-10" />
                    </div>
                    <div class="flex-grow-1 overflow-hidden">
                      <div class="d-flex align-items-center justify-content-between gap-2 mb-6px">
                        <a href="#!" class="text-reset fw-medium fs-15">Minimal Smart Watch</a>
                        <h6 class="mb-0">$174.25</h6>
                      </div>
                      <div class="d-flex align-items-end justify-content-between gap-2 mb-1">
                        <span class="text-muted fs-sm">Qty: <span class="fw-medium text-body">01</span></span>
                        <div class="fs-13 d-flex align-items-end">
                          <a href="#!" class="link link-custom-primary pe-2 me-2 border-end">Move to Favourites</a>
                          <a href="#!" class="text-danger"><i class="mgc_delete_2_line"></i></a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3 bg-light bg-opacity-75 rounded p-2">
                    <div class="bg-body-secondary rounded-3 p-6px flex-shrink-0">
                      <img src="/backend/assets/images/product-14.webp" alt="Product 14" class="img-fluid size-10" />
                    </div>
                    <div class="flex-grow-1 overflow-hidden">
                      <div class="d-flex align-items-center justify-content-between gap-2 mb-6px">
                        <a href="#!" class="text-reset fw-medium fs-15">Classic White Sneakers</a>
                        <h6 class="mb-0">$129.80</h6>
                      </div>
                      <div class="d-flex align-items-end justify-content-between gap-2 mb-1">
                        <span class="text-muted fs-sm">Qty: <span class="fw-medium text-body">01</span></span>
                        <div class="fs-13 d-flex align-items-end">
                          <a href="#!" class="link link-custom-primary pe-2 me-2 border-end">Move to Favourites</a>
                          <a href="#!" class="text-danger"><i class="mgc_delete_2_line"></i></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <a href="#!" class="btn btn-primary w-100">Proceed to Checkout</a>
              </div>
            </div>
          </div>
          <button type="button" class="topbar-link btn d-none d-md-flex" aria-label="tools-apps-modal" data-bs-toggle="modal" data-bs-target="#toolAppsModal">
            <span class="topbar-icon">
              <i data-lucide="layout-grid" class="size-4-5"></i>
            </span>
          </button>
          <button type="button" id="darkModeButton" class="topbar-link topbar-mode btn d-none d-md-block" aria-label="topbar-link">
            <span class="topbar-icon">
              <i data-lucide="moon" class="size-4-5 dark"></i>
              <i data-lucide="sun-medium" class="size-4-5 light"></i>
            </span>
          </button>
          <div class="dropdown d-none d-md-block">
            <button class="btn topbar-link position-relative" type="button" aria-label="Notification-button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
              <span class="topbar-icon">
                <i data-lucide="bell" class="size-4-5"></i>
                <span class="notification-animate size-2 animate-ping bg-success rounded-circle" ></span>
                <span class="notification-animate size-2 bg-success rounded-circle" ></span>
              </span>
            </button>
            <div class="dropdown-menu dropdown-menu-end dropdown-menu-lg notification-dropdown p-0">
              <div class="bg-body-secondary rounded-top">
                <div class="d-flex align-items-center p-4">
                  <h6 class="mb-0 flex-grow-1">Notifications</h6>
                  <div class="d-flex gap-2">
                    <a href="#!" class="link link-custom-primary"><i class="ri-check-double-fill fs-17"></i></a>
                    <a href="#!" class="link link-custom-primary"><i class="ri-settings-3-line fs-17"></i></a>
                  </div>
                </div>
                <div class="call-center-nav border-bottom px-5 mb-0 overflow-x-auto custom-scroll">
                  <ul class="nav nav-pills gap-5 flex-nowrap" id="pills-tab" role="tablist">
                    <li class="nav-item" role="presentation">
                      <a class="nav-link px-4 py-6px active" id="all-tab" data-bs-toggle="pill" data-bs-target="#all" href="#" role="tab">
                        <div class="call-center-effect-right"></div>
                        <div class="call-center-effect-left"></div>
                        View all
                      </a>
                    </li>
                    <li class="nav-item" role="presentation">
                      <a class="nav-link px-4 py-6px" id="unread-tab" data-bs-toggle="pill" data-bs-target="#unread" href="#" role="tab">
                        <div class="call-center-effect-right"></div>
                        <div class="call-center-effect-left"></div>
                        Unread
                      </a>
                    </li>
                    <li class="nav-item" role="presentation">
                      <a class="nav-link px-4 py-6px" id="updates-tab" data-bs-toggle="pill" data-bs-target="#updates" href="#" role="tab">
                        <div class="call-center-effect-right"></div>
                        <div class="call-center-effect-left"></div>
                        Updates
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
           
              <div class="tab-content" id="pills-tabContent">
                <div class="tab-pane fade show active" id="all" role="tabpanel" aria-labelledby="all-tab" tabIndex={0}>
                  <div data-simplebar class="topbar-notification">
                    <div class="notification-item unread p-4">
                      <div class="d-flex align-items-start gap-3">
                        <div class="notification-avatar position-relative">
                          <img src="/backend/assets/images/user-28.webp" alt="User 21" class="size-11 rounded-circle" />
                            <span class="size-2-5 bg-success rounded-circle d-block position-absolute bottom-0 end-0 border border-white border-2"></span>
                        </div>
                        <div class="flex-grow-1 min-w-0">
                          <div class="d-flex align-items-start justify-content-between gap-2 mb-1">
                            <p class="text-muted max-w-72"><a href="#!" class="link link-custom fw-semibold">Emma</a> mentioned you in <span class="badge border text-body ms-1"><i class="ri-megaphone-line me-1 text-primary fw-semibold"></i>Campaign</span></p>
                            <span class="size-2 bg-danger rounded-circle mt-6px unread-dot"></span>
                          </div>
                          <div class="d-flex align-items-center justify-content-between gap-2 mb-4 fs-13 text-muted">
                            <p>Monday 11:42 AM</p>
                            <p>1 hour ago</p>
                          </div>
                          <p class="fs-15 bg-light bg-opacity-50 border px-10px py-2 rounded">"Please review the latest homepage banner before publishing..."</p>
                        </div>
                      </div>
                    </div>

                    <div class="notification-item unread p-4">
                      <div class="d-flex align-items-start gap-3">
                        <div class="notification-avatar position-relative">
                          <img src="/backend/assets/images/user-12.webp" alt="User 21" class="size-11 rounded-circle" />
                            <span class="size-2-5 bg-success rounded-circle d-block position-absolute bottom-0 end-0 border border-white border-2"></span>
                        </div>
                        <div class="flex-grow-1 min-w-0">
                          <div class="d-flex align-items-start justify-content-between gap-2 mb-1">
                            <p class="text-muted max-w-72"><a href="#!" class="link link-custom fw-semibold">Daniel</a> liked your latest design update</p>
                            <span class="size-2 bg-danger rounded-circle mt-6px unread-dot"></span>
                          </div>
                          <div class="d-flex align-items-center justify-content-between gap-2 fs-13 text-muted">
                            <p>Sunday 8:15 PM</p>
                            <p>4 hours ago</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="notification-item p-4">
                      <div class="d-flex align-items-start gap-3">
                        <div class="notification-avatar position-relative">
                          <img src="/backend/assets/images/user-13.webp" alt="User 21" class="size-11 rounded-circle"/>
                            <span class="size-2-5 bg-success rounded-circle d-block position-absolute bottom-0 end-0 border border-white border-2"></span>
                        </div>
                        <div class="flex-grow-1 min-w-0">
                          <div class="d-flex align-items-start justify-content-between gap-2 mb-1">
                            <p class="text-muted max-w-72"><a href="#!" class="link link-custom fw-semibold">Sophia</a> invited you to <span class="badge border text-body ms-1"><i class="ri-layout-4-line me-1 text-primary fw-semibold"></i>UI Brainstorm</span></p>
                            <span class="size-2 bg-danger rounded-circle mt-6px unread-dot"></span>
                          </div>
                          <div class="d-flex align-items-center justify-content-between gap-2 fs-13 text-muted mb-4">
                            <p>Saturday 1:30 PM</p>
                            <p>6 hours ago</p>
                          </div>
                          <div>
                            <button type="button" class="btn btn-sm btn-outline-dark">Decline</button>
                            <button type="button" class="btn btn-sm btn-dark ms-1">Accept</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="notification-item p-4">
                      <div class="d-flex align-items-start gap-3">
                        <div class="notification-avatar position-relative">
                          <img src="/backend/assets/images/user-18.webp" alt="User 21" class="size-11 rounded-circle" />
                            <span class="size-2-5 bg-success rounded-circle d-block position-absolute bottom-0 end-0 border border-white border-2"></span>
                        </div>
                        <div class="flex-grow-1 min-w-0">
                          <div class="d-flex align-items-start justify-content-between gap-2 mb-1">
                            <p class="text-muted max-w-72"><a href="#!" class="link link-custom fw-semibold">Michael</a> uploaded new assets in Fashion Store</p>
                            <span class="size-2 bg-danger rounded-circle mt-6px unread-dot"></span>
                          </div>
                          <div class="d-flex align-items-center justify-content-between gap-2 fs-13 text-muted mb-4">
                            <p>Friday 4:18 PM</p>
                            <p>1 day ago</p>
                          </div>
                          <a href="#!" class="mb-2 border border-dashed bg-light bg-opacity-50 rounded-1 px-10px py-2 d-flex align-items-center gap-10px text-reset">
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAB2AAAAdgB+lymcgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANESURBVHic7ZtLaBNRFIa/O5nWakJpfaXWBwU1LkQQxI2gIIqvigtBN4JrwZUbQbAbF+5UBBHdiO5UFF8gIihoRVERtVqQLkRqrH3Z2odNjZ05LtxqZnLndm5a54Nswnn88+fezJnJRBESeXMmh5s6gi9bUCwAVNjcknQ+/Pv7jiv0vx8jnT2rdj84bKTXXwh1ENJ2bgfKvwqkjSv4lwEAn+5DcQTmr+5Q+16vMN4bcIICpP38EpR/hck4+FAI9L7OycVcr8ielOnqgQbgeYeAjOnGZTPYMY9Lb/vk6p5qk2WDDVBsNNkwEoMd9Yy+HJC722tNlQw2QJhnqpkRhj6l+fKuV27typooF2YFmPm2N8lofgbdz/NybefyqKWCDahUxnpc+p99kBvNa6KUmboGABS+OXQ/fSE3m9fplpjaBgCMDzp0tT6RW5ubddKnvgEAP4cV+Wd35ObW/eWmTg8DAIo/FJ8fXZJrmw+VkzZ9DACYGIeuxyfl+qZjYVMq2wCnqvwcrwj51pawJlS2AZkFenl+EbqetsjtbWuDQl29DjFRnwPfg5FO8H6Vl+t7MNp3GVhaKqyyDVAOzF3556WDm8nCq5Ihlb0FoiLFmqCQ6W1ACBIDbAuwTWKAbQG2SQywLcA22oOQ73v0fGyjMNyPiGgL+D78UzsXFDXVDisaq3FTep+l9goY+dbF2FBfpIOPjjBe9Pg6OKFdQduAlGv09nwkqlz9nay9BTL185lYlKMwPBBpFRQKPdq5AJmZDg11+pc0ES6GFHXZJuqyTfolgMaaEr8NxsB/fxZIDLAtwDaJAbYF2CaZBHVbJ5NgMgkmk2AyCU4HEgNsC7BNYoBtAbaJdRJ03CrmLFxG7dzFum2NE+sk6E/8or/zA+J7um2NE/sk6KRccCpn58U6CTquS322qaIePrU+CdqmctaiJRIDbAuwTWKAbQG2SQywLcA2iQGBEYLN276TTpg/TfXFoGNycNxiYEhgEVF271pGwZ3VHhQSYgX4p4ARE3pixUkJVekDgWFBAWrVwc84shf4YURYHKiUkG44qtafKP2oOCHPAmrlwXs4shrkAqg84EcWaRoFpGZ41MzuINO4UW04fTxM2m9+4hqehcgNDwAAAABJRU5ErkJggg==" alt="Document" class="h-7"/>
                              <div class="flex-grow-1">
                                <h6 class="fs-sm lh-sm mb-0">Fashion-Banners.zip</h6>
                                <p><span class="text-muted fs-13">76.12 MB</span></p>
                              </div>
                              <i class="ri-download-2-line text-muted"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tab-pane fade" id="unread" role="tabpanel" aria-labelledby="unread-tab" tabIndex={0}>
                  <div data-simplebar class="topbar-notification">
                    <div class="notification-item unread p-4">
                      <div class="d-flex align-items-start gap-3">
                        <div class="notification-avatar position-relative">
                          <img src="/backend/assets/images/user-22.webp" alt="User" class="size-11 rounded-circle" />
                            <span class="size-2-5 bg-success rounded-circle d-block position-absolute bottom-0 end-0 border border-white border-2"></span>
                        </div>
                        <div class="flex-grow-1 min-w-0">
                          <div class="d-flex align-items-start justify-content-between gap-2 mb-1">
                            <p class="text-muted max-w-72">
                              <a href="#!" class="link link-custom fw-semibold">Daniel</a>
                              shared a new project proposal
                            </p>
                            <span class="size-2 bg-danger rounded-circle mt-6px unread-dot"></span>
                          </div>
                          <div class="d-flex align-items-center justify-content-between gap-2 mb-3 fs-13 text-muted">
                            <p>Today 10:24 AM</p>
                            <p>5 min ago</p>
                          </div>
                          <p class="fs-15 bg-light bg-opacity-50 border px-10px py-2 rounded">"Please review the latest dashboard wireframe before today's meeting."</p>
                        </div>
                      </div>
                    </div>
                    <div class="notification-item unread p-4">
                      <div class="d-flex align-items-start gap-3">
                        <div class="notification-avatar position-relative">
                          <img src="/backend/assets/images/user-8.webp" alt="User" class="size-11 rounded-circle" />
                            <span class="size-2-5 bg-success rounded-circle d-block position-absolute bottom-0 end-0 border border-white border-2"></span>
                        </div>
                        <div class="flex-grow-1 min-w-0">
                          <div class="d-flex align-items-start justify-content-between gap-2 mb-2">
                            <p class="text-muted max-w-72">
                              <a href="#!" class="link link-custom fw-semibold">Creative Team</a>
                              uploaded updated branding resources
                            </p>
                            <span class="size-2 bg-danger rounded-circle mt-6px unread-dot"></span>
                          </div>
                          <div class="d-flex align-items-center justify-content-between gap-2 fs-13 text-muted">
                            <p>Yesterday 08:15 PM</p>
                            <p>1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="notification-item unread p-4">
                      <div class="d-flex align-items-start gap-3">
                        <div class="notification-avatar position-relative">
                          <img src="/backend/assets/images/user-7.webp" alt="User" class="size-11 rounded-circle" />
                            <span class="size-2-5 bg-success rounded-circle d-block position-absolute bottom-0 end-0 border border-white border-2"></span>
                        </div>
                        <div class="flex-grow-1 min-w-0">
                          <div class="d-flex align-items-start justify-content-between gap-2 mb-1">
                            <p class="text-muted max-w-72">
                              <a href="#!" class="link link-custom fw-semibold">Sophia</a>
                              assigned a task
                              <span class="badge border text-body ms-1">
                                <i class="ri-layout-4-line me-1 text-primary fw-semibold"></i>
                                UI Revamp
                              </span>
                            </p>
                            <span class="size-2 bg-danger rounded-circle mt-6px unread-dot"></span>
                          </div>
                          <div class="d-flex align-items-center justify-content-between gap-2 mb-3 fs-13 text-muted">
                            <p>Today 09:40 AM</p>
                            <p>32 min ago</p>
                          </div>
                          <div class="d-flex align-items-center justify-content-between border rounded px-3 py-2 bg-light bg-opacity-50">
                            <div>
                              <h6 class="fs-sm mb-1">Landing Page Optimization</h6>
                              <p class="mb-0 fs-13 text-muted">Due Tomorrow</p>
                            </div>
                            <button type="button" class="btn btn-sm btn-dark">
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tab-pane fade" id="updates" role="tabpanel" aria-labelledby="updates-tab" tabIndex={0}>
                  <div data-simplebar class="topbar-notification">
                    <div class="notification-item unread p-4">
                      <div class="d-flex align-items-start gap-3">
                        <div class="notification-avatar position-relative">
                          <img src="/backend/assets/images/user-33.webp" alt="User" class="size-11 rounded-circle" />
                            <span class="size-2-5 bg-warning rounded-circle d-block position-absolute bottom-0 end-0 border border-white border-2"></span>
                        </div>
                        <div class="flex-grow-1 min-w-0">
                          <div class="d-flex align-items-start justify-content-between gap-2 mb-1">
                            <p class="text-muted max-w-72">
                              <a href="#!" class="link link-custom fw-semibold">Sophia Miller</a>
                              uploaded a new file in
                              <span class="badge border text-body ms-1">
                                <i class="ri-folder-upload-line me-1 text-success fw-semibold"></i>
                                Branding Kit
                              </span>
                            </p>
                            <span class="size-2 bg-danger rounded-circle mt-6px unread-dot"></span>
                          </div>
                          <div class="d-flex align-items-center justify-content-between gap-2 mb-4 fs-13 text-muted">
                            <p>Today 09:42 AM</p>
                            <p>1 hour ago</p>
                          </div>
                          <a href="#!" class="border border-dashed bg-light bg-opacity-50 rounded-1 px-10px py-2 d-flex align-items-center gap-10px text-reset">
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAB2AAAAdgB+lymcgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANESURBVHic7ZtLaBNRFIa/O5nWakJpfaXWBwU1LkQQxI2gIIqvigtBN4JrwZUbQbAbF+5UBBHdiO5UFF8gIihoRVERtVqQLkRqrH3Z2odNjZ05LtxqZnLndm5a54Nswnn88+fezJnJRBESeXMmh5s6gi9bUCwAVNjcknQ+/Pv7jiv0vx8jnT2rdj84bKTXXwh1ENJ2bgfKvwqkjSv4lwEAn+5DcQTmr+5Q+16vMN4bcIICpP38EpR/hck4+FAI9L7OycVcr8ielOnqgQbgeYeAjOnGZTPYMY9Lb/vk6p5qk2WDDVBsNNkwEoMd9Yy+HJC722tNlQw2QJhnqpkRhj6l+fKuV27typooF2YFmPm2N8lofgbdz/NybefyqKWCDahUxnpc+p99kBvNa6KUmboGABS+OXQ/fSE3m9fplpjaBgCMDzp0tT6RW5ubddKnvgEAP4cV+Wd35ObW/eWmTg8DAIo/FJ8fXZJrmw+VkzZ9DACYGIeuxyfl+qZjYVMq2wCnqvwcrwj51pawJlS2AZkFenl+EbqetsjtbWuDQl29DjFRnwPfg5FO8H6Vl+t7MNp3GVhaKqyyDVAOzF3556WDm8nCq5Ihlb0FoiLFmqCQ6W1ACBIDbAuwTWKAbQG2SQywLcA22oOQ73v0fGyjMNyPiGgL+D78UzsXFDXVDisaq3FTep+l9goY+dbF2FBfpIOPjjBe9Pg6OKFdQduAlGv09nwkqlz9nay9BTL185lYlKMwPBBpFRQKPdq5AJmZDg11+pc0ES6GFHXZJuqyTfolgMaaEr8NxsB/fxZIDLAtwDaJAbYF2CaZBHVbJ5NgMgkmk2AyCU4HEgNsC7BNYoBtAbaJdRJ03CrmLFxG7dzFum2NE+sk6E/8or/zA+J7um2NE/sk6KRccCpn58U6CTquS322qaIePrU+CdqmctaiJRIDbAuwTWKAbQG2SQywLcA2iQGBEYLN276TTpg/TfXFoGNycNxiYEhgEVF271pGwZ3VHhQSYgX4p4ARE3pixUkJVekDgWFBAWrVwc84shf4YURYHKiUkG44qtafKP2oOCHPAmrlwXs4shrkAqg84EcWaRoFpGZ41MzuINO4UW04fTxM2m9+4hqehcgNDwAAAABJRU5ErkJggg==" alt="Document" class="h-7"/>
                              <div class="flex-grow-1">
                                <h6 class="fs-sm lh-sm mb-0">Brand-Assets.fig</h6>
                                <p><span class="text-muted fs-13">24.5 MB</span></p>
                              </div>
                              <i class="ri-download-2-line text-muted"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="notification-item p-4">
                      <div class="d-flex align-items-start gap-3">
                        <div class="notification-avatar position-relative">
                          <img src="/backend/assets/images/user-28.webp" alt="User" class="size-11 rounded-circle" />
                            <span class="size-2-5 bg-info rounded-circle d-block position-absolute bottom-0 end-0 border border-white border-2"></span>
                        </div>
                        <div class="flex-grow-1 min-w-0">
                          <div class="d-flex align-items-start justify-content-between gap-2 mb-1">
                            <p class="text-muted max-w-72">
                              <a href="#!" class="link link-custom fw-semibold">Creative Team</a>
                              invited you to join
                              <span class="badge border text-body ms-1">
                                <i class="ri-layout-grid-line me-1 text-primary fw-semibold"></i>
                                Website Redesign
                              </span>
                            </p>
                            <span class="size-2 bg-danger rounded-circle mt-6px unread-dot"></span>
                          </div>
                          <div class="d-flex align-items-center justify-content-between gap-2 fs-13 text-muted mb-4">
                            <p>Yesterday 06:12 PM</p>
                            <p>18 hours ago</p>
                          </div>
                          <div>
                            <button type="button" class="btn btn-sm btn-outline-dark">Ignore</button>
                            <button type="button" class="btn btn-sm btn-dark ms-1">Join Now</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="notification-item p-4">
                      <div class="d-flex align-items-start gap-3">
                        <div class="notification-avatar position-relative">
                          <img src="/backend/assets/images/user-29.webp" alt="User" class="size-11 rounded-circle" />
                            <span class="size-2-5 bg-success rounded-circle d-block position-absolute bottom-0 end-0 border border-white border-2"></span>
                        </div>
                        <div class="flex-grow-1 min-w-0">
                          <div class="d-flex align-items-start justify-content-between gap-2 mb-1">
                            <p class="text-muted max-w-72">
                              <a href="#!" class="link link-custom fw-semibold">Olivia</a>
                              mentioned you in a discussion thread
                            </p>
                            <span class="size-2 bg-danger rounded-circle mt-6px unread-dot"></span>
                          </div>
                          <div class="d-flex align-items-center justify-content-between gap-2 mb-4 fs-13 text-muted">
                            <p>Monday 04:18 PM</p>
                            <p>2 days ago</p>
                          </div>
                          <p class="mb-2 fs-15 bg-light bg-opacity-50 border px-10px py-2 rounded">
                            "@alex please review the mobile responsive layout before publishing."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button type="button" class="topbar-link btn d-none d-md-flex" aria-label="topbar-link" data-bs-toggle="modal" data-bs-target="#settingsModal">
            <span class="topbar-icon">
              <i data-lucide="settings" class="size-4-5 animate-rotate"></i>
            </span>
          </button>
          <div class="dropdown profile-dropdown">
            <button class="btn topbar-link bg-transparent w-auto gap-2 ms-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <span class="d-flex align-items-center gap-2">
                <span class="text-end fs-sm d-none d-xl-block">
                  <span class="fw-medium d-block lh-sm admin-name">Emma Anderson</span>
                  <span class="d-inline-block admin-designation">Tech Lead</span>
                </span>
                <span class="position-relative ms-6">
                  <img src="/backend/assets/images/user-38.webp" loading="lazy" alt="User 38" class="object-fit-cover rounded-circle size-9" />
                    <span class="badge bg-orange rounded-pill border fw-normal profile-border-color position-absolute top-50 translate-middle-y start-0 ms-n6 profile-version">v.1</span>
                    <span class="size-2-5 bg-success rounded-circle d-block position-absolute bottom-0 end-0 border profile-border-color border-2"></span>
                </span>
              </span>
            </button>
            <div class="dropdown-menu p-0 profile-dropdown-menu dropdown-menu-end">
              <span class="text-muted px-5 pt-4 d-block">Welcome Back, Emma! 👋</span>
              <ul class="list-unstyled mb-0 p-2 border-bottom">
                <li>
                  <a class="dropdown-item align-items-center px-3 d-flex" href="pages-user-friends.html"><i class="mgc_user_1_line d-inline-block me-2"></i> User Profile <span class="text-muted ms-1 fst-italic fs-15">@emma.ander</span></a>
                </li>
                <li>
                  <a class="dropdown-item align-items-center px-3 d-flex" href="pages-account-settings.html"><i class="mgc_settings_3_line d-inline-block me-2"></i> Profile Preferences</a>
                </li>
                <li>
                  <a class="dropdown-item align-items-center px-3 d-flex" href="pages-help-center.html"><i class="mgc_headphone_2_line d-inline-block me-2"></i> Support Center</a>
                </li>
                <li>
                  <a class="dropdown-item align-items-center px-3 d-flex" href="pages-pricing.html"><i class="mgc_keyboard_line d-inline-block me-2"></i> Shortcut Keys</a>
                </li>
              </ul>
              <div class="border-bottom">
                <div class="d-flex justify-content-between align-items-center py-3 px-5">
                  <div>
                    <h6 class="mb-0">Free Plan</h6>
                    <p class="text-muted fs-sm">System control panel</p>
                  </div>
                  <a href="pages-pricing.html" class="badge bg-primary py-6px px-10px rounded-pill">Upgrade</a>
                </div>
              </div>
              <ul class="list-unstyled mb-0 px-2">
                <li>
                  <a class="dropdown-item align-items-center d-flex py-4 text-danger" href="#!" @click="logOut"><i class="mgc_key_2_line d-inline-block me-2"></i> Log Out</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>


</div>
</template>

