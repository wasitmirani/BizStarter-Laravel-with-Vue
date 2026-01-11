   <div>
        <div id="theme-customization"
            class="hs-overlay hs-overlay-open:translate-x-0 bg-card hs-overlay-open:flex fixed inset-y-0 end-0 bottom-0 z-80 hidden w-full max-w-[400px] translate-x-full transform flex-col overflow-hidden transition-all duration-300 rtl:-translate-x-full">
            <div
                class="bg-primary text-default-600 border-default-900/10 flex items-start gap-3 border-b border-dashed bg-[url(/backend/images/user-bg-pattern.png)] p-6">
                <div>
                    <h5 class="mb-1.5 text-sm font-bold text-white uppercase">Admin Customizer</h5>
                    <p class="font-medium text-white/75 italic">Easily configure layout, styles, and preferences for
                        your admin interface.</p>
                </div>

                <div class="grow">
                    <button type="button" data-hs-overlay="#theme-customization"
                        class="btn btn-sm bg-default-100/20 size-7.5 rounded-full text-white">
                        <i class="iconify tabler--x text-base"></i>
                    </button>
                </div>
            </div>

            <div class="h-full grow overflow-y-auto" data-simplebar="">
                <div class="divide-default-300 divide-y divide-dashed">
                    <div id="skin" class="p-6">
                        <h5 class="text-md mb-base font-bold">Select Theme</h5>
                        <div class="grid grid-cols-2 gap-base">
                            <div class="card-radio" id="skin-default">
                                <input class="hidden" type="radio" name="data-skin" id="demo-skin-default"
                                    value="default">
                                <label class="form-label" for="demo-skin-default">
                                    <img src="/backend/images/layouts/skin-default.png" alt="layout-img"
                                        class="flex size-full rounded-md">
                                </label>
                                <h5 class="text-md text-default-600 mt-2.5 text-center font-semibold">Default</h5>
                            </div>

                            <div class="card-radio" id="skin-minimal">
                                <input class="hidden" type="radio" name="data-skin" id="demo-skin-minimal"
                                    value="minimal">
                                <label class="form-label" for="demo-skin-minimal">
                                    <img src="/backend/images/layouts/skin-minimal.png" alt="layout img"
                                        class="flex size-full rounded-md">
                                </label>
                                <h5 class="text-md text-default-600 mt-2.5 text-center font-semibold">Minimal</h5>
                            </div>

                            <div class="card-radio" id="skin-modern">
                                <input class="hidden" type="radio" name="data-skin" id="demo-skin-modern"
                                    value="modern">
                                <label class="form-label" for="demo-skin-modern">
                                    <img src="/backend/images/layouts/skin-modern.png" alt="layout-img"
                                        class="flex size-full rounded-md">
                                </label>
                                <h5 class="text-md text-default-600 mt-2.5 text-center font-semibold">Modern</h5>
                            </div>

                            <div class="card-radio" id="skin-material">
                                <input class="hidden" type="radio" name="data-skin" id="demo-skin-material"
                                    value="material">
                                <label class="form-label" for="demo-skin-material">
                                    <img src="/backend/images/layouts/skin-material.png" alt="layout-img"
                                        class="flex size-full rounded-md">
                                </label>
                                <h5 class="text-md text-default-600 mt-2.5 text-center font-semibold">Material</h5>
                            </div>

                            <div class="card-radio" id="skin-saas">
                                <input class="hidden" type="radio" name="data-skin" id="demo-skin-saas" value="saas">
                                <label class="form-label" for="demo-skin-saas">
                                    <img src="/backend/images/layouts/skin-saas.png" alt="layout-img"
                                        class="flex size-full rounded-md">
                                </label>
                                <h5 class="text-md text-default-600 mt-2.5 text-center font-semibold">SaaS</h5>
                            </div>

                            <div class="card-radio" id="skin-flat">
                                <input class="hidden" type="radio" name="data-skin" id="demo-skin-flat" value="flat">
                                <label class="form-label" for="demo-skin-flat">
                                    <img src="/backend/images/layouts/skin-flat.png" alt="layout-img"
                                        class="flex size-full rounded-md">
                                </label>
                                <h5 class="text-md text-default-600 mt-2.5 text-center font-semibold">Flat</h5>
                            </div>

                            <div class="card-radio" id="skin-galaxy">
                                <input class="hidden" type="radio" name="data-skin" id="demo-skin-galaxy"
                                    value="galaxy">
                                <label class="form-label" for="demo-skin-galaxy">
                                    <img src="/backend/images/layouts/skin-galaxy.png" alt="layout-img"
                                        class="flex size-full rounded-md">
                                </label>
                                <h5 class="text-md text-default-600 mt-2.5 text-center font-semibold">Galaxy</h5>
                            </div>

                            <div class="card-radio" id="skin-luxe">
                                <input class="hidden" type="radio" name="data-skin" id="demo-skin-luxe" value="luxe">
                                <label class="form-label" for="demo-skin-luxe">
                                    <img src="/backend/images/layouts/skin-luxe.png" alt="layout-img"
                                        class="flex size-full rounded-md">
                                </label>
                                <h5 class="text-md text-default-600 mt-2.5 text-center font-semibold">Luxe</h5>
                            </div>

                            <div class="card-radio" id="skin-retro">
                                <input class="hidden" type="radio" name="data-skin" id="demo-skin-retro" value="retro">
                                <label class="form-label" for="demo-skin-retro">
                                    <img src="/backend/images/layouts/skin-retro.png" alt="layout-img"
                                        class="flex size-full rounded-md">
                                </label>
                                <h5 class="text-md text-default-600 mt-2.5 text-center font-semibold">Retro</h5>
                            </div>

                            <div class="card-radio" id="skin-neon">
                                <input class="hidden" type="radio" name="data-skin" id="demo-skin-neon" value="neon">
                                <label class="form-label" for="demo-skin-neon">
                                    <img src="/backend/images/layouts/skin-neon.png" alt="layout-img"
                                        class="flex size-full rounded-md">
                                </label>
                                <h5 class="text-md text-default-600 mt-2.5 text-center font-semibold">Neon</h5>
                            </div>

                            <div class="card-radio" id="skin-pixel">
                                <input class="hidden" type="radio" name="data-skin" id="demo-skin-pixel" value="pixel">
                                <label class="form-label" for="demo-skin-pixel">
                                    <img src="/backend/images/layouts/skin-pixel.png" alt="layout-img"
                                        class="flex size-full rounded-md">
                                </label>
                                <h5 class="text-md text-default-600 mt-2.5 text-center font-semibold">Pixel</h5>
                            </div>

                            <div class="card-radio" id="skin-soft">
                                <input class="hidden" type="radio" name="data-skin" id="demo-skin-soft" value="soft">
                                <label class="form-label" for="demo-skin-soft">
                                    <img src="/backend/images/layouts/skin-soft.png" alt="layout-img"
                                        class="flex size-full rounded-md">
                                </label>
                                <h5 class="text-md text-default-600 mt-2.5 text-center font-semibold">Soft</h5>
                            </div>

                            <div class="card-radio" id="skin-mono">
                                <input class="hidden" type="radio" name="data-skin" id="demo-skin-mono" value="mono">
                                <label class="form-label" for="demo-skin-mono">
                                    <img src="/backend/images/layouts/skin-mono.png" alt="layout-img"
                                        class="flex size-full rounded-md">
                                </label>
                                <h5 class="text-md text-default-600 mt-2.5 text-center font-semibold">Mono</h5>
                            </div>

                            <div class="card-radio" id="skin-prism">
                                <input class="hidden" type="radio" name="data-skin" id="demo-skin-prism" value="prism">
                                <label class="form-label" for="demo-skin-prism">
                                    <img src="/backend/images/layouts/skin-prism.png" alt="layout-img"
                                        class="flex size-full rounded-md">
                                </label>
                                <h5 class="text-md text-default-600 mt-2.5 text-center font-semibold">Prism</h5>
                            </div>

                            <div class="card-radio" id="skin-nova">
                                <input class="hidden" type="radio" name="data-skin" id="demo-skin-nova" value="nova">
                                <label class="form-label" for="demo-skin-nova">
                                    <img src="/backend/images/layouts/skin-nova.png" alt="layout-img"
                                        class="flex size-full rounded-md">
                                </label>
                                <h5 class="text-md text-default-600 mt-2.5 text-center font-semibold">Nova</h5>
                            </div>

                            <div class="card-radio" id="skin-zen">
                                <input class="hidden" type="radio" name="data-skin" id="demo-skin-zen" value="zen">
                                <label class="form-label" for="demo-skin-zen">
                                    <img src="/backend/images/layouts/skin-zen.png" alt="layout-img"
                                        class="flex size-full rounded-md">
                                </label>
                                <h5 class="text-md text-default-600 mt-2.5 text-center font-semibold">Zen</h5>
                            </div>

                            <div class="card-radio" id="skin-elegant">
                                <input class="hidden" type="radio" name="data-skin" id="demo-skin-elegant"
                                    value="elegant" checked>
                                <label class="form-label" for="demo-skin-elegant">
                                    <img src="/backend/images/layouts/skin-elegant.png" alt="layout-img"
                                        class="flex size-full rounded-md">
                                </label>
                                <h5 class="text-md text-default-600 mt-2.5 text-center font-semibold">Elegant</h5>
                            </div>

                            <div class="card-radio" id="skin-vivid">
                                <input class="hidden" type="radio" name="data-skin" id="demo-skin-vivid" value="vivid">
                                <label class="form-label" for="demo-skin-vivid">
                                    <img src="/backend/images/layouts/skin-vivid.png" alt="layout-img"
                                        class="flex size-full rounded-md">
                                </label>
                                <h5 class="text-md text-default-600 mt-2.5 text-center font-semibold">Vivid</h5>
                            </div>

                            <div class="card-radio" id="skin-matrix">
                                <input class="hidden" type="radio" name="data-skin" id="demo-skin-matrix"
                                    value="matrix">
                                <label class="form-label" for="demo-skin-matrix">
                                    <img src="/backend/images/layouts/skin-matrix.png" alt="layout-img"
                                        class="flex size-full rounded-md">
                                </label>
                                <h5 class="text-md text-default-600 mt-2.5 text-center font-semibold">Matrix</h5>
                            </div>

                            <div class="card-radio" id="skin-neo">
                                <input class="hidden" type="radio" name="data-skin" id="demo-skin-neo" value="neo">
                                <label class="form-label" for="demo-skin-neo">
                                    <img src="/backend/images/layouts/skin-neo.png" alt="layout-img"
                                        class="flex size-full rounded-md">
                                </label>
                                <h5 class="text-md text-default-600 mt-2.5 text-center font-semibold">Neo</h5>
                            </div>

                            <div class="card-radio" id="skin-silver">
                                <input class="hidden" type="radio" name="data-skin" id="demo-skin-silver"
                                    value="silver">
                                <label class="form-label" for="demo-skin-silver">
                                    <img src="/backend/images/layouts/skin-silver.png" alt="layout-img"
                                        class="flex size-full rounded-md">
                                </label>
                                <h5 class="text-md text-default-600 mt-2.5 text-center font-semibold">Silver</h5>
                            </div>

                            <div class="card-radio" id="skin-xenon">
                                <input class="hidden" type="radio" name="data-skin" id="demo-skin-xenon" value="xenon">
                                <label class="form-label" for="demo-skin-xenon">
                                    <img src="/backend/images/layouts/skin-xenon.png" alt="layout-img"
                                        class="flex size-full rounded-md">
                                </label>
                                <h5 class="text-md text-default-600 mt-2.5 text-center font-semibold">Xenon</h5>
                            </div>
                        </div>
                    </div>

                    <div class="p-5">
                        <h5 class="text-md mb-base font-bold">Theme Direction</h5>

                        <div class="grid grid-cols-3 gap-base">
                            <div class="card-radio">
                                <input class="hidden" type="radio" name="dir" id="direction-ltr" value="ltr">
                                <label class="form-label" for="direction-ltr">
                                    <img src="/backend/images/layouts/theme-light.png" alt="layout img"
                                        class="border-default-300 flex size-full rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">LTR Mode</div>
                            </div>

                            <div class="card-radio">
                                <input class="hidden" type="radio" name="dir" id="direction-rtl" value="rtl">
                                <label class="form-label" for="direction-rtl">
                                    <img src="/backend/images/layouts/theme-light.png" alt="layout img"
                                        class="border-default-300 flex size-full scale-x-[-1] rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">RTL Mode</div>
                            </div>
                        </div>
                    </div>

                    <div id="sidenav-size" class="p-5">
                        <h5 class="text-md mb-base font-bold">Sidenav View</h5>
                        <div class="grid grid-cols-3 gap-base">
                            <div class="card-radio" id="sidenav-size-default">
                                <input class="hidden" type="radio" name="data-sidenav-size" id="sidenav-view-default"
                                    value="default">
                                <label class="form-label" for="sidenav-view-default">
                                    <img src="/backend/images/layouts/sidenav-size-default.png" alt="layout img"
                                        class="border-default-300 flex size-full rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">Default</div>
                            </div>

                            <div class="card-radio" id="sidenav-size-compact">
                                <input class="hidden" type="radio" name="data-sidenav-size" id="sidenav-view-md"
                                    value="md">
                                <label class="form-label" for="sidenav-view-md">
                                    <img src="/backend/images/layouts/sidenav-size-compact.png" alt="layout img"
                                        class="border-default-300 flex size-full rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">Compact</div>
                            </div>

                            <div class="card-radio" id="sidenav-size-condensed">
                                <input class="hidden" type="radio" name="data-sidenav-size" id="sidenav-view-sm"
                                    value="sm">
                                <label class="form-label" for="sidenav-view-sm">
                                    <img src="/backend/images/layouts/sidenav-size-condensed.png" alt="layout img"
                                        class="border-default-300 flex size-full rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">Condensed</div>
                            </div>

                            <div class="card-radio" id="sidenav-size-on-hover">
                                <input class="hidden" type="radio" name="data-sidenav-size" id="sidenav-view-hover"
                                    value="on-hover">
                                <label class="form-label" for="sidenav-view-hover">
                                    <img src="/backend/images/layouts/sidenav-size-condensed.png" alt="layout img"
                                        class="border-default-300 flex size-full rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">On Hover</div>
                            </div>

                            <div class="card-radio" id="sidenav-size-on-hover-active">
                                <input class="hidden" type="radio" name="data-sidenav-size"
                                    id="sidenav-view-hover-active" value="on-hover-active">
                                <label class="form-label" for="sidenav-view-hover-active">
                                    <img src="/backend/images/layouts/sidenav-size-default.png" alt="layout img"
                                        class="border-default-300 flex size-full rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">On Hover- Show
                                </div>
                            </div>

                            <div class="card-radio" id="sidenav-size-offcanvas">
                                <input class="hidden" type="radio" name="data-sidenav-size" id="sidenav-view-mobile"
                                    value="offcanvas">
                                <label class="form-label" for="sidenav-view-mobile">
                                    <img src="/backend/images/layouts/sidenav-size-offcanvas.png" alt="layout img"
                                        class="border-default-300 flex size-full rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">Offcanvas</div>
                            </div>

                            <div class="card-radio">
                                <input class="hidden" type="radio" name="data-sidenav-size" id="sidenav-view-hidden"
                                    value="hidden">
                                <label class="form-label" for="sidenav-view-hidden">
                                    <img src="/backend/images/layouts/sidenav-size-offcanvas.png" alt="layout img"
                                        class="border-default-300 flex size-full rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">Hidden</div>
                            </div>
                        </div>
                    </div>

                    <div id="theme" class="p-5">
                        <h5 class="text-md mb-base font-bold">Theme Mode</h5>
                        <div class="grid grid-cols-3 gap-base">
                            <div class="card-radio" id="theme-light">
                                <input class="hidden" type="radio" name="data-theme" id="layout-color-light"
                                    value="light">
                                <label class="form-label" for="layout-color-light">
                                    <img src="/backend/images/layouts/theme-light.png" alt="layout img"
                                        class="border-default-300 flex size-full rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">Light</div>
                            </div>

                            <div class="card-radio" id="theme-dark">
                                <input class="hidden" type="radio" name="data-theme" id="layout-color-dark"
                                    value="dark">
                                <label class="form-label" for="layout-color-dark">
                                    <img src="/backend/images/layouts/theme-dark.png" alt="layout img"
                                        class="border-default-300 flex size-full rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">Dark</div>
                            </div>

                            <div class="card-radio" id="theme-system">
                                <input class="hidden" type="radio" name="data-theme" id="layout-color-system"
                                    value="system">
                                <label class="form-label" for="layout-color-system">
                                    <img src="/backend/images/layouts/theme-system.png" alt="layout img"
                                        class="border-default-300 flex size-full rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">System</div>
                            </div>
                        </div>
                    </div>

                    <div id="sidenav-color" class="p-5">
                        <h5 class="text-md mb-base font-bold">Sidenav Color</h5>
                        <div class="grid grid-cols-3 gap-base">
                            <div class="card-radio" id="sidenav-color-light">
                                <input class="hidden" type="radio" name="data-menu-color" id="menu-color-light"
                                    value="light">
                                <label class="form-label" for="menu-color-light">
                                    <img src="/backend/images/layouts/sidenav-color-light.png" alt="layout img"
                                        class="border-default-300 flex size-full rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">Light</div>
                            </div>

                            <div class="card-radio" id="sidenav-color-dark">
                                <input class="hidden" type="radio" name="data-menu-color" id="menu-color-dark"
                                    value="dark">
                                <label class="form-label" for="menu-color-dark">
                                    <img src="/backend/images/layouts/sidenav-color-dark.png" alt="layout img"
                                        class="border-default-300 flex size-full rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">Dark</div>
                            </div>

                            <div class="card-radio" id="sidenav-color-gradient">
                                <input class="hidden" type="radio" name="data-menu-color" id="menu-color-gradient"
                                    value="gradient">
                                <label class="form-label" for="menu-color-gradient">
                                    <img src="/backend/images/layouts/sidenav-color-gradient.png" alt="layout img"
                                        class="border-default-300 flex size-full rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">Gradient</div>
                            </div>

                            <div class="card-radio" id="sidenav-color-gray">
                                <input class="hidden" type="radio" name="data-menu-color" id="menu-color-gray"
                                    value="gray">
                                <label class="form-label" for="menu-color-gray">
                                    <img src="/backend/images/layouts/sidenav-color-gray.png" alt="layout img"
                                        class="border-default-300 flex size-full rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">Gray</div>
                            </div>

                            <div class="card-radio" id="sidenav-color-image">
                                <input class="hidden" type="radio" name="data-menu-color" id="menu-color-image"
                                    value="image">
                                <label class="form-label" for="menu-color-image">
                                    <img src="/backend/images/layouts/sidenav-color-image.png" alt="layout img"
                                        class="border-default-300 flex size-full rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">Image</div>
                            </div>
                        </div>
                    </div>

                    <div id="topbar-color" class="p-5">
                        <h5 class="text-md mb-base font-bold">Topbar Color</h5>
                        <div class="grid grid-cols-3 gap-base">
                            <div class="card-radio" id="topbar-color-light">
                                <input class="hidden" type="radio" name="data-topbar-color"
                                    id="layout-topbar-color-light" value="light">
                                <label class="form-label" for="layout-topbar-color-light">
                                    <img src="/backend/images/layouts/topbar-color-light.png" alt="layout img"
                                        class="border-default-300 flex size-full rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">Light</div>
                            </div>

                            <div class="card-radio" id="topbar-color-dark">
                                <input class="hidden" type="radio" name="data-topbar-color"
                                    id="layout-topbar-color-dark" value="dark">
                                <label class="form-label" for="layout-topbar-color-dark">
                                    <img src="/backend/images/layouts/topbar-color-dark.png" alt="layout img"
                                        class="border-default-300 flex size-full rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">Dark</div>
                            </div>

                            <div class="card-radio" id="topbar-color-gradient">
                                <input class="hidden" type="radio" name="data-topbar-color"
                                    id="layout-topbar-color-gradient" value="gradient">
                                <label class="form-label" for="layout-topbar-color-gradient">
                                    <img src="/backend/images/layouts/topbar-color-gradient.png" alt="layout img"
                                        class="border-default-300 flex size-full rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">Gradient</div>
                            </div>

                            <div class="card-radio" id="topbar-color-gray">
                                <input class="hidden" type="radio" name="data-topbar-color"
                                    id="layout-topbar-color-gray" value="gray">
                                <label class="form-label" for="layout-topbar-color-gray">
                                    <img src="/backend/images/layouts/topbar-color-gray.png" alt="layout img"
                                        class="border-default-300 flex size-full rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">Gray</div>
                            </div>
                        </div>
                    </div>

                    <div id="width" class="p-5">
                        <h5 class="text-md mb-base font-bold">Layout Width</h5>
                        <div class="grid grid-cols-3 gap-base">
                            <div class="card-radio" id="width-fluid">
                                <input class="hidden" type="radio" name="data-layout-width" id="layout-width-fluid"
                                    value="fluid">
                                <label class="form-label" for="layout-width-fluid">
                                    <img src="/backend/images/layouts/width-fluid.png" alt="layout img"
                                        class="border-default-300 flex size-full rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">Fluid</div>
                            </div>

                            <div class="card-radio" id="width-boxed">
                                <input class="hidden" type="radio" name="data-layout-width" id="layout-width-boxed"
                                    value="boxed">
                                <label class="form-label" for="layout-width-boxed">
                                    <img src="/backend/images/layouts/width-boxed.png" alt="layout img"
                                        class="border-default-300 flex size-full rounded-md border">
                                </label>
                                <div class="text-md text-default-600 mt-2.5 text-center font-semibold">Boxed</div>
                            </div>
                        </div>
                    </div>

                    <div id="position" class="p-6">
                        <div class="flex items-center justify-between">
                            <h5 class="font-bold">Layout Position</h5>

                            <div class="flex gap-1">
                                <div id="position-fixed">
                                    <input type="radio" class="peer hidden" name="data-layout-position"
                                        id="layout-position-fixed" value="fixed">
                                    <label
                                        class="btn bg-warning/15 text-warning peer-checked:bg-warning peer-checked:text-white"
                                        for="layout-position-fixed">Fixed</label>
                                </div>
                                <div id="position-scrollable">
                                    <input type="radio" class="peer hidden" name="data-layout-position"
                                        id="layout-position-scrollable" value="scrollable">
                                    <label
                                        class="btn bg-warning/15 text-warning peer-checked:bg-warning peer-checked:text-white"
                                        for="layout-position-scrollable">Scrollable</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="sidenav-user" class="p-6">
                        <div class="flex items-center justify-between">
                            <label class="m-0 font-bold" for="sidebaruser-check">Sidebar User Info</label>
                            <input type="checkbox" class="form-switch" name="sidebar-user" id="sidebaruser-check">
                        </div>
                    </div>
                </div>
            </div>

            <div class="border-default-900/10 flex border-t p-6">
                <div class="grid w-full grid-cols-2 gap-4">
                    <div></div>
                    <button type="button" class="btn btn-lg w-full bg-danger text-white hover:bg-danger-hover"
                        id="reset-layout">Reset</button>
                </div>
            </div>
        </div>
    </div>
