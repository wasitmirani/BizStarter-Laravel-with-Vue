import { n as e, t } from "/assets/admin.bundle-DOCqQWIh.js";
var n = class {
  constructor() {
    ((this.elements = {
      searchInput: document.getElementById(`toolAppsSearch`),
      categoryButtons: document.querySelectorAll(`[data-category]`),
      appItems: document.querySelectorAll(`.app-item`),
      checkboxes: document.querySelectorAll(`.app-item input[type="checkbox"]`),
      selectedCount: document.getElementById(`selectedCount`),
      selectAllBtn: document.getElementById(`selectAllBtn`),
      saveBtn: document.getElementById(`saveAppsBtn`),
      noResults: document.getElementById(`noResults`),
      allSelectedMessage: document.getElementById(`allSelectedMessage`),
      selectedAppsSummary: document.getElementById(`selectedAppsSummary`),
      selectedAppsList: document.getElementById(`selectedAppsList`),
      clearAllSelectedBtn: document.getElementById(`clearAllSelected`),
      appsGrid: document.getElementById(`appsGrid`),
    }),
      (this.state = {
        currentCategory: `all`,
        searchTerm: ``,
        selectedApps: new Set(),
        isFiltering: !1,
      }),
      (this.debounceTimer = null),
      (this.animationFrame = null),
      (this.cachedAppData = new Map()),
      this.init());
  }
  init() {
    (this.preloadAppData(), this.bindEvents(), this.updateSelectedCount());
  }
  preloadAppData() {
    this.elements.appItems.forEach((e, t) => {
      let n = e.querySelector(`input[type="checkbox"]`),
        r = e.dataset.name?.toLowerCase() || ``,
        i = e.dataset.category || ``,
        a = e.querySelector(`h6`)?.textContent?.toLowerCase() || ``,
        o = e.querySelector(`p`)?.textContent?.toLowerCase() || ``,
        s = e.querySelector(`.app-icon img`)?.src || ``;
      this.cachedAppData.set(n.id, {
        index: t,
        appName: r,
        appCategory: i,
        appTitle: a,
        appDescription: o,
        appIcon: s,
        element: e,
        checkbox: n,
      });
    });
  }
  bindEvents() {
    let e = document.getElementById(`toolAppsModal`);
    e &&
      (this.elements.searchInput &&
        this.elements.searchInput.addEventListener(
          `input`,
          this.debounce((e) => {
            ((this.state.searchTerm = e.target.value.toLowerCase()),
              this.scheduleFilter());
          }, 300),
        ),
      e.addEventListener(`click`, (e) => {
        let t = e.target.closest(`[data-category]`);
        t &&
          ((this.state.currentCategory = t.dataset.category),
          this.updateCategoryButtons(t),
          this.scheduleFilter());
      }),
      e.addEventListener(`change`, (e) => {
        e.target.matches(`.app-item input[type="checkbox"]`) &&
          this.handleCheckboxChange(e.target);
      }),
      e.addEventListener(`click`, (e) => {
        let t = e.target.closest(`.app-card`);
        if (t && !e.target.closest(`.form-check-input`)) {
          let e = t.querySelector(`input[type="checkbox"]`);
          e && ((e.checked = !e.checked), this.handleCheckboxChange(e));
        }
      }),
      this.elements.selectedAppsList &&
        this.elements.selectedAppsList.addEventListener(`click`, (e) => {
          let t = e.target.closest(`button[data-app-id]`);
          if (t) {
            let e = t.dataset.appId,
              n = this.cachedAppData.get(e);
            n &&
              ((n.checkbox.checked = !1),
              this.handleCheckboxChange(n.checkbox));
          }
        }),
      this.elements.selectAllBtn &&
        this.elements.selectAllBtn.addEventListener(`click`, () =>
          this.toggleSelectAll(),
        ),
      this.elements.saveBtn &&
        this.elements.saveBtn.addEventListener(`click`, () =>
          this.saveSelections(),
        ),
      this.elements.clearAllSelectedBtn &&
        this.elements.clearAllSelectedBtn.addEventListener(`click`, () =>
          this.clearAllSelected(),
        ));
  }
  debounce(e, t) {
    return (...n) => {
      (clearTimeout(this.debounceTimer),
        (this.debounceTimer = setTimeout(() => e.apply(this, n), t)));
    };
  }
  scheduleFilter() {
    this.state.isFiltering ||
      ((this.state.isFiltering = !0),
      (this.animationFrame = requestAnimationFrame(() => {
        (this.filterApps(), (this.state.isFiltering = !1));
      })));
  }
  handleCheckboxChange(e) {
    let t = e.id;
    (e.checked
      ? this.state.selectedApps.add(t)
      : this.state.selectedApps.delete(t),
      this.updateCardState(e),
      this.updateSelectedCount(),
      this.scheduleFilter());
  }
  filterApps() {
    let e = 0,
      t = this.state.selectedApps.size,
      n = this.cachedAppData.size,
      r = t === n && n > 0;
    for (let [t, n] of this.cachedAppData) {
      let {
          element: r,
          appName: i,
          appCategory: a,
          appTitle: o,
          appDescription: s,
          checkbox: c,
        } = n,
        l = this.state.selectedApps.has(t),
        u =
          this.state.searchTerm === `` ||
          i.includes(this.state.searchTerm) ||
          o.includes(this.state.searchTerm) ||
          s.includes(this.state.searchTerm),
        d =
          this.state.currentCategory === `all` ||
          a === this.state.currentCategory;
      u && d
        ? (r.classList.remove(`filtered-out`),
          (r.style.display = ``),
          e++,
          l
            ? r.classList.add(`selected-app`, `active`)
            : r.classList.remove(`selected-app`, `active`))
        : (r.classList.add(`filtered-out`), (r.style.display = `none`));
    }
    this.updateMessages(e, r);
  }
  updateMessages(e, t) {
    let { noResults: n, allSelectedMessage: r } = this.elements;
    (n && (n.classList.add(`d-none`), (n.style.display = `none`)),
      r && (r.classList.add(`d-none`), (r.style.display = `none`)),
      t
        ? r && (r.classList.remove(`d-none`), (r.style.display = `block`))
        : e === 0 &&
          n &&
          (n.classList.remove(`d-none`), (n.style.display = `block`)));
  }
  updateCategoryButtons(e) {
    let { categoryButtons: t } = this.elements;
    (t.forEach((e) => {
      e.classList.remove(`active`);
    }),
      e.classList.add(`active`));
  }
  updateSelectedCount() {
    let e = this.state.selectedApps.size,
      { selectedCount: t, selectAllBtn: n } = this.elements;
    if (
      (t &&
        ((t.textContent = `${e} selected`),
        t.classList.toggle(`has-selection`, e > 0)),
      this.updateSelectedAppsSummary(),
      n)
    ) {
      let t = e === this.cachedAppData.size,
        r = e > 0 && e < this.cachedAppData.size,
        i = `<i class="mgc_checkbox_line me-1"></i>Select All`;
      (t
        ? (i = `<i class="mgc_minus_square_line me-1"></i>Deselect All`)
        : r && (i = `<i class="mgc_checkbox_line me-1"></i>Select All`),
        (n.innerHTML = i));
    }
  }
  updateCardState(e) {
    let t = e.closest(`.app-card`),
      n = e.closest(`.app-item`);
    if (t && n) {
      let t = e.checked;
      (n.classList.toggle(`selected-app`, t), n.classList.toggle(`active`, t));
    }
  }
  toggleSelectAll() {
    if (this.state.selectedApps.size !== this.cachedAppData.size)
      for (let [e, t] of this.cachedAppData)
        ((t.checkbox.checked = !0),
          this.state.selectedApps.add(e),
          this.updateCardState(t.checkbox));
    else
      for (let [e, t] of this.cachedAppData)
        ((t.checkbox.checked = !1),
          this.state.selectedApps.delete(e),
          this.updateCardState(t.checkbox));
    (this.updateSelectedCount(), this.scheduleFilter());
  }
  saveSelections() {
    (Array.from(this.state.selectedApps).map((e) => {
      let t = this.cachedAppData.get(e);
      return {
        id: e,
        name: t.checkbox.name,
        appName: t.element.querySelector(`h6`).textContent,
      };
    }),
      this.showNotification(`Apps saved successfully!`, `success`));
    let e = bootstrap.Modal.getInstance(
      document.getElementById(`toolAppsModal`),
    );
    e && e.hide();
  }
  showNotification(e, t = `info`) {
    let n = document.createElement(`div`);
    ((n.className = `alert alert-solid-${t} alert-dismissible fade show position-fixed`),
      (n.style.cssText = `top: 20px; right: 20px; z-index: 9999; min-width: 300px;`),
      (n.innerHTML = `
            ${e}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `),
      document.body.appendChild(n),
      setTimeout(() => {
        n.parentNode && n.remove();
      }, 3e3));
  }
  clearAllSelected() {
    this.state.selectedApps.clear();
    for (let [e, t] of this.cachedAppData)
      ((t.checkbox.checked = !1), this.updateCardState(t.checkbox));
    (this.updateSelectedCount(), this.scheduleFilter());
  }
  updateSelectedAppsSummary() {
    let { selectedAppsSummary: e, selectedAppsList: t } = this.elements;
    if (!(!e || !t))
      if (this.state.selectedApps.size > 0) {
        (e.classList.remove(`d-none`), (t.innerHTML = ``));
        let n = document.createDocumentFragment(),
          r = Array.from(this.state.selectedApps);
        for (let e of r) {
          let t = this.cachedAppData.get(e);
          if (!t) continue;
          let { appName: r, appIcon: i } = t,
            a = document.createElement(`div`);
          ((a.className = `col-auto`),
            (a.innerHTML = `
                    <div class="d-flex align-items-center bg-primary-subtle rounded-pill px-3 py-2 border border-primary-subtle">
                        <img src="${i}" alt="${r}" class="rounded-circle me-2" style="width: 24px; height: 24px; object-fit: cover;">
                        <span class="text-primary fw-medium small me-2">${r}</span>
                        <button type="button" class="btn btn-sm btn-link text-danger p-0" data-app-id="${e}" style="line-height: 1;">
                            <i data-lucide="x" class="size-3"></i>
                        </button>
                    </div>
                `),
            n.appendChild(a));
        }
        t.appendChild(n);
      } else (e.classList.add(`d-none`), (t.innerHTML = ``));
  }
  reset() {
    ((this.state.searchTerm = ``),
      (this.state.currentCategory = `all`),
      this.state.selectedApps.clear(),
      this.elements.searchInput && (this.elements.searchInput.value = ``),
      this.updateCategoryButtons(this.elements.categoryButtons[0]));
    for (let [e, t] of this.cachedAppData)
      ((t.checkbox.checked = !1), this.updateCardState(t.checkbox));
    (this.updateSelectedCount(), this.scheduleFilter());
  }
  testNoResults() {
    this.updateMessages(0, !1);
  }
  testSearch(e) {
    ((this.state.searchTerm = e.toLowerCase()), this.scheduleFilter());
  }
  testCategory(e) {
    ((this.state.currentCategory = e), this.scheduleFilter());
  }
  destroy() {
    (this.debounceTimer && clearTimeout(this.debounceTimer),
      this.animationFrame && cancelAnimationFrame(this.animationFrame),
      this.cachedAppData.clear(),
      this.state.selectedApps.clear());
    let e = document.getElementById(`toolAppsModal`);
    e && e.replaceWith(e.cloneNode(!0));
  }
};
(document.addEventListener(`DOMContentLoaded`, () => {
  document.getElementById(`toolAppsModal`) &&
    (performance.now(),
    (window.appsModal = new n()),
    (window.testNoResults = () => {
      window.appsModal && window.appsModal.testNoResults();
    }),
    (window.testSearch = (e) => {
      window.appsModal && window.appsModal.testSearch(e);
    }),
    (window.testCategory = (e) => {
      window.appsModal && window.appsModal.testCategory(e);
    }),
    (window.debugSelectedApps = () => {
      window.appsModal && window.appsModal.debugSelectedApps();
    }),
    performance.now());
}),
  document.addEventListener(`hidden.bs.modal`, (e) => {
    e.target.id === `toolAppsModal` &&
      window.appsModal &&
      window.appsModal.reset();
  }),
  window.addEventListener(`beforeunload`, () => {
    window.appsModal && (window.appsModal.destroy(), (window.appsModal = null));
  }));
var r = {};
async function i(e) {
  if (e)
    try {
      e = e.replace(/"/g, ``);
      let t = await fetch(`assets/lang/` + e + `.json`);
      if (!t.ok) throw Error(`Network response was not ok`);
      r = await t.json();
    } catch (e) {
      console.error(`Error loading translations:`, e);
    }
}
async function a(e) {
  (await i(e),
    document.querySelectorAll(`[data-translate]`).forEach((e) => {
      let t = e.getAttribute(`data-translate`);
      r[t] && (e.textContent = r[t]);
    }));
  let t = document.querySelector(`#languageButton`),
    n = document.querySelector(`.dropdown-item[data-lang="${e}"]`);
  if (t && n) {
    let e = n.querySelector(`img`),
      r = n.querySelector(`.text-muted.fs-sm`);
    e &&
      r &&
      (t.innerHTML = `<span class="topbar-icon p-1">${e.outerHTML} <span class="fs-sm mx-6px w-5 text-end">${r.textContent}</span></span>`);
  }
  sessionStorage.setItem(`selectedLanguage`, e);
}
(a(sessionStorage.getItem(`selectedLanguage`) || `en`),
  document.querySelectorAll(`a[data-lang]`).forEach((e) => {
    e.addEventListener(`click`, () => {
      a(e.getAttribute(`data-lang`));
    });
  }));
var o = [
  { id: `main-topbar`, stickyClass: `nav-sticky` },
  { id: `main-sidebar`, stickyClass: `sidebar-sticky` },
].map((e) => {
  let t = document.getElementById(e.id);
  return t
    ? { offsetTop: t.offsetTop, el: t, stickyClass: e.stickyClass }
    : { offsetTop: 0, el: null, stickyClass: `` };
});
function s() {
  o.forEach(({ offsetTop: e, el: t, stickyClass: n }) => {
    window.scrollY >= e && window.scrollY > 0
      ? t.classList.add(n)
      : t.classList.remove(n);
  });
}
(window.addEventListener(`scroll`, s),
  document.addEventListener(`DOMContentLoaded`, function () {
    let n =
      document.getElementById(`modal-root`) ||
      (() => {
        let e = document.createElement(`div`);
        return ((e.id = `modal-root`), document.body.appendChild(e), e);
      })();
    document.querySelectorAll(`.modal`).forEach((e) => {
      e.parentElement !== n && n.appendChild(e);
    });
    let r = [
        `data-layout`,
        `data-nav-type`,
        `data-bs-theme`,
        `data-sidebar`,
        `data-sidebar-colors`,
        `data-colors`,
        `data-profile-sidebar`,
        `data-topbar-colors`,
        `data-theme`,
        `data-sidebar-image`,
      ],
      i = document.documentElement,
      a = document.getElementById(`settingsModal`),
      o = document.getElementById(`navigationType`),
      s = document.getElementById(`profileSidebar`),
      c = document.getElementById(`sidebarSizes`),
      l = document.getElementById(`sidebarImageSection`),
      u = document.getElementById(`main-sidebar`),
      d = document.getElementById(`sidebar-backdrop`),
      f = document.getElementById(`profileWidgetsSwitch`),
      p = window.location.pathname;
    (p === `/` && (p = `index.html`),
      p.startsWith(`/`) && (p = p.substring(1)),
      (p = p.replace(`alloce/`, ``)));
    let m = {
      default: {
        "data-layout": `modern`,
        "data-sidebar": `large`,
        "data-sidebar-colors": `dark`,
        "data-topbar-colors": `light`,
        "data-nav-type": `default`,
        "data-sidebar-image": `none`,
        "data-profile-sidebar": `false`,
      },
      minimal: {
        "data-layout": `modern`,
        "data-sidebar": `large`,
        "data-sidebar-colors": `light`,
        "data-topbar-colors": `light`,
        "data-nav-type": `default`,
        "data-sidebar-image": `none`,
        "data-profile-sidebar": `true`,
      },
      material: {
        "data-layout": `modern`,
        "data-sidebar": `large`,
        "data-sidebar-colors": `dark`,
        "data-topbar-colors": `light`,
        "data-nav-type": `boxed`,
        "data-sidebar-image": `none`,
        "data-profile-sidebar": `false`,
      },
      corporate: {
        "data-layout": `semibox`,
        "data-sidebar": `large`,
        "data-sidebar-colors": `light`,
        "data-topbar-colors": `light`,
        "data-nav-type": `default`,
        "data-sidebar-image": `none`,
        "data-profile-sidebar": `false`,
      },
      retro: {
        "data-layout": `modern`,
        "data-sidebar": `medium`,
        "data-sidebar-colors": `green`,
        "data-topbar-colors": `light`,
        "data-nav-type": `boxed`,
        "data-sidebar-image": `image-2`,
        "data-profile-sidebar": `false`,
      },
      modern: {
        "data-layout": `modern`,
        "data-sidebar": `small`,
        "data-sidebar-colors": `dark`,
        "data-topbar-colors": `light`,
        "data-nav-type": `default`,
        "data-sidebar-image": `none`,
        "data-profile-sidebar": `false`,
      },
      edge: {
        "data-layout": `modern`,
        "data-sidebar": `large`,
        "data-sidebar-colors": `light`,
        "data-topbar-colors": `light`,
        "data-nav-type": `default`,
        "data-sidebar-image": `none`,
        "data-profile-sidebar": `false`,
      },
      creative: {
        "data-layout": `neo`,
        "data-sidebar": `large`,
        "data-sidebar-colors": `light`,
        "data-topbar-colors": `light`,
        "data-nav-type": `default`,
        "data-sidebar-image": `none`,
        "data-profile-sidebar": `false`,
      },
      vertex: {
        "data-layout": `horizontal`,
        "data-sidebar-colors": `light`,
        "data-topbar-colors": `dark`,
        "data-nav-type": `default`,
        "data-sidebar-image": `none`,
        "data-profile-sidebar": `false`,
      },
      prime: {
        "data-layout": `modern`,
        "data-sidebar": `offcanvas`,
        "data-sidebar-colors": `light`,
        "data-nav-type": `pattern`,
        "data-topbar-colors": `light`,
        "data-sidebar-image": `none`,
        "data-profile-sidebar": `false`,
      },
      flat: {
        "data-layout": `neo`,
        "data-sidebar": `large`,
        "data-sidebar-colors": `dark`,
        "data-topbar-colors": `light`,
        "data-nav-type": `default`,
        "data-sidebar-image": `image-1`,
        "data-profile-sidebar": `false`,
      },
      vision: {
        "data-layout": `modern`,
        "data-sidebar": `large`,
        "data-sidebar-colors": `light`,
        "data-topbar-colors": `light`,
        "data-nav-type": `default`,
        "data-sidebar-image": `none`,
        "data-profile-sidebar": `false`,
      },
      sparkle: {
        "data-layout": `default`,
        "data-sidebar": `small`,
        "data-sidebar-colors": `dark`,
        "data-topbar-colors": `light`,
        "data-nav-type": `default`,
        "data-sidebar-image": `image-3`,
        "data-profile-sidebar": `false`,
      },
      elegant: {
        "data-layout": `neo`,
        "data-sidebar": `large`,
        "data-sidebar-colors": `light`,
        "data-topbar-colors": `light`,
        "data-nav-type": `default`,
        "data-sidebar-image": `none`,
        "data-profile-sidebar": `false`,
      },
    };
    function h(e, t) {
      if (e === `data-profile-sidebar`) {
        t === `true`
          ? (i.setAttribute(e, `true`),
            sessionStorage.setItem(e, `true`),
            f && (f.checked = !0))
          : (i.removeAttribute(e),
            sessionStorage.removeItem(e),
            f && (f.checked = !1));
        return;
      }
      (i.setAttribute(e, t), sessionStorage.setItem(e, t));
      let n = document.querySelector(`input[name="${e}"][value="${t}"]`);
      (n && (n.checked = !0),
        e === `data-bs-theme` &&
          t === `dark` &&
          h(`data-sidebar-colors`, `dark`),
        e === `data-sidebar` && g(t));
    }
    function g(e) {
      l && (l.style.display = e === `small` ? `none` : `block`);
    }
    function _() {
      r.forEach((e) => {
        let t = i.getAttribute(e);
        t ? sessionStorage.setItem(e, t) : sessionStorage.removeItem(e);
      });
    }
    function v(e) {
      if (!e) return;
      let t = m[e];
      t &&
        (h(`data-theme`, e),
        Object.entries(t).forEach(([e, t]) => {
          h(e, t);
        }),
        t[`data-layout`] && b(t[`data-layout`]),
        t[`data-sidebar`] === `offcanvas` &&
          (document.body.classList.remove(`sidebar-hidden`),
          u?.classList.remove(`show`),
          d?.classList.remove(`d-block`)),
        _());
    }
    (sessionStorage.length &&
      r.forEach((e) => {
        let t = sessionStorage.getItem(e) || i.getAttribute(e);
        if (t) {
          (i.setAttribute(e, t),
            e === `data-layout` && b(t),
            e === `data-theme` && v(t));
          let n = document.querySelector(`input[name="${e}"][value="${t}"]`);
          n && (n.checked = !0);
        }
        sessionStorage.getItem(`data-profile-sidebar`) === `true`
          ? (i.setAttribute(`data-profile-sidebar`, `true`),
            sessionStorage.setItem(`data-profile-sidebar`, `true`))
          : (i.removeAttribute(`data-profile-sidebar`),
            sessionStorage.removeItem(`data-profile-sidebar`));
      }),
      g(i.getAttribute(`data-sidebar`) || `large`));
    let y = i.getAttribute(`data-layout`);
    y && b(y);
    function b(e) {
      (i.setAttribute(`data-layout`, e),
        sessionStorage.setItem(`data-layout`, e));
      let t = document.querySelector(`input[name="data-layout"][value="${e}"]`);
      if (
        (t && (t.checked = !0),
        o && (o.style.display = e === `modern` ? `block` : `none`),
        s && e === `horizontal` && (s.style.display = `none`),
        c &&
          (c.style.display =
            e === `horizontal` || e === `boxed` ? `none` : `block`),
        e === `horizontal`)
      )
        (i.removeAttribute(`data-profile-sidebar`),
          sessionStorage.removeItem(`data-profile-sidebar`),
          f && (f.checked = !1),
          i.setAttribute(`data-sidebar`, `large`),
          (document.querySelector(
            `input[name="data-sidebar"][value="large"]`,
          ).checked = !0),
          sessionStorage.setItem(`data-sidebar`, `large`));
      else if (e === `boxed`) {
        i.setAttribute(`data-sidebar`, `offcanvas`);
        let e = document.querySelector(
          `input[name="data-sidebar"][value="offcanvas"]`,
        );
        (e && (e.checked = !0),
          sessionStorage.setItem(`data-sidebar`, `offcanvas`),
          document.body.classList.remove(`sidebar-hidden`),
          u?.classList.remove(`show`),
          d?.classList.remove(`d-block`));
      } else w();
    }
    a &&
      (a.querySelectorAll(`input[type='radio']`).forEach((e) => {
        e.addEventListener(`change`, function () {
          let e = this.name,
            t = this.value;
          e === `data-theme`
            ? v(t)
            : (e === `data-layout` && b(t),
              e === `data-bs-theme` && t === `auto` ? x() : h(e, t),
              e === `data-sidebar` &&
                t === `offcanvas` &&
                (document.body.classList.remove(`sidebar-hidden`),
                u?.classList.remove(`show`),
                d?.classList.remove(`d-block`)));
        });
      }),
      a.querySelectorAll(`input[type='checkbox']`).forEach((e) => {
        e.addEventListener(`change`, function () {
          let e = this.name,
            t = this.checked ? `true` : ``;
          t === `true`
            ? (i.setAttribute(e, t), sessionStorage.setItem(e, t))
            : (i.removeAttribute(e), sessionStorage.removeItem(e));
        });
      }),
      a.addEventListener(`show.bs.modal`, function () {
        a.setAttribute(`aria-hidden`, `false`);
      }),
      a.addEventListener(`hidden.bs.modal`, function () {
        a.setAttribute(`aria-hidden`, `true`);
      }));
    function x() {
      let e = window.matchMedia(`(prefers-color-scheme: dark)`).matches
        ? `dark`
        : `light`;
      (i.setAttribute(`data-bs-theme`, e),
        sessionStorage.setItem(`data-bs-theme`, e));
    }
    let S = document.getElementById(`resetLayout`);
    S && S.addEventListener(`click`, C);
    function C() {
      (sessionStorage.clear(), location.reload());
    }
    function w() {
      let e = document.querySelectorAll(`.navbar-nav-menu a.nav-link`),
        t = null;
      (e.forEach((e) => {
        if (e.getAttribute(`href`) === p) {
          (e.classList.add(`active`), (t = e));
          let n = e.closest(`.collapse`);
          n && T(n, e);
        } else e.classList.remove(`active`);
      }),
        document.querySelector(`.navbar-nav-menu a.nav-link.active`) &&
          setTimeout(() => {
            let e = document
              .getElementById(`main-sidebar`)
              .querySelector(`.simplebar-content-wrapper`);
            e &&
              t.offsetTop > window.innerHeight &&
              (e.scrollTop = t.offsetTop - window.innerHeight / 2);
          }, 0));
    }
    function T(e, t) {
      if (
        (e.classList.add(`show`),
        e.closest(`li`).classList.contains(`nav-item`))
      ) {
        let e = t.closest(`.nav-item`);
        e && e.firstElementChild.classList.add(`active`);
      } else {
        let t = e.closest(`li`).firstElementChild;
        (t.classList.add(`active`), T(t.closest(`.collapse`), t));
      }
    }
    (w(),
      document.getElementById(`toggleSidebar`)?.addEventListener(`click`, D),
      window.addEventListener(`resize`, E));
    function E() {
      let e = window.innerWidth;
      i.getAttribute(`data-sidebar`) !== `offcanvas` &&
        (e <= 997.98
          ? ((document.querySelector(
              `input[name="data-sidebar"][value="large"]`,
            ).checked = !0),
            i.setAttribute(`data-sidebar`, `large`),
            O())
          : e <= 1199.98
            ? i.getAttribute(`data-layout`) === `horizontal`
              ? (document.querySelector(
                  `input[name="data-sidebar"][value="large"]`,
                ).checked = !0)
              : (u.classList.add(`show`),
                i.setAttribute(`data-sidebar`, `small`),
                P())
            : (document.querySelector(
                `input[name="data-sidebar"][value="large"]`,
              ).checked = !0));
    }
    function D() {
      let e = window.innerWidth;
      if (i.getAttribute(`data-sidebar`) === `offcanvas`) {
        (u?.classList.toggle(`show`), d?.classList.toggle(`d-block`));
        return;
      }
      if (e <= 997.98)
        (i.setAttribute(`data-sidebar`, `large`),
          (document.querySelector(
            `input[name="data-sidebar"][value="large"]`,
          ).checked = !0),
          u?.classList.toggle(`show`),
          d?.classList.toggle(`d-block`));
      else if (e <= 1199.98)
        (i.getAttribute(`data-layout`) === `horizontal`
          ? (i.setAttribute(`data-sidebar`, `large`),
            (document.querySelector(
              `input[name="data-sidebar"][value="large"]`,
            ).checked = !0),
            u?.classList.toggle(`show`))
          : (document.body.classList.toggle(`sidebar-hidden`),
            i.setAttribute(`data-sidebar`, `small`),
            P(),
            sessionStorage.setItem(`data-sidebar`, `small`)),
          O());
      else {
        let e =
          (i.getAttribute(`data-sidebar`) ?? `large`) === `large`
            ? `small`
            : `large`;
        (i.setAttribute(`data-sidebar`, e),
          sessionStorage.setItem(`data-sidebar`, e),
          e === `small` && P(),
          O());
      }
    }
    window.innerWidth < 1199.98 && E();
    function O() {
      (u?.classList.remove(`show`), d?.classList.remove(`d-block`));
    }
    (d?.addEventListener(`click`, function () {
      O();
    }),
      document.getElementById(`darkModeButton`)?.addEventListener(`click`, k),
      document
        .getElementById(`fullscreenButton`)
        ?.addEventListener(`click`, A));
    function k() {
      let e =
        (i.getAttribute(`data-bs-theme`) ?? `light`) === `light`
          ? `dark`
          : `light`;
      (i.setAttribute(`data-bs-theme`, e),
        sessionStorage.setItem(`data-bs-theme`, e));
    }
    function A() {
      let e = document,
        t = document.documentElement;
      (t.requestFullscreen ||
        t.webkitRequestFullscreen ||
        t.mozRequestFullScreen ||
        t.msRequestFullscreen,
        e.exitFullscreen ||
          e.webkitExitFullscreen ||
          e.mozCancelFullScreen ||
          e.msExitFullscreen,
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
          ? document.documentElement.requestFullscreen
            ? document.documentElement.requestFullscreen()
            : document.documentElement.mozRequestFullScreen
              ? document.documentElement.mozRequestFullScreen()
              : document.documentElement.webkitRequestFullscreen &&
                document.documentElement.webkitRequestFullscreen(
                  Element.ALLOW_KEYBOARD_INPUT,
                )
          : document.exitFullscreen
            ? document.exitFullscreen()
            : document.mozCancelFullScreen
              ? document.mozCancelFullScreen()
              : document.webkitExitFullscreen &&
                document.webkitExitFullscreen());
    }
    function j(n) {
      let r = document.getElementById(`fullscreenButton`);
      if (!r) return;
      let i = r.querySelector(`[data-lucide]`);
      (i && i.setAttribute(`data-lucide`, n ? `minimize` : `maximize`),
        r.setAttribute(
          `aria-label`,
          n ? `Exit fullscreen` : `Enter fullscreen`,
        ),
        typeof t == `function` && t({ icons: e }));
    }
    (document.addEventListener(`fullscreenchange`, () =>
      j(!!document.fullscreenElement),
    ),
      document.addEventListener(`webkitfullscreenchange`, () =>
        j(!!document.webkitFullscreenElement),
      ),
      document.addEventListener(`mozfullscreenchange`, () =>
        j(!!document.mozFullScreenElement),
      ),
      document.addEventListener(`MSFullscreenChange`, () =>
        j(!!document.msFullscreenElement),
      ));
    function M(e, t) {
      let n = e.getBoundingClientRect(),
        r = e.querySelector(`.nav-menu-sub`).getBoundingClientRect(),
        a = window.innerHeight,
        o = window.innerWidth;
      return n.left + n.width + r.width > o &&
        i.getAttribute(`data-layout`) === `horizontal`
        ? { top: n.top + 5, right: n.left - r.width }
        : n.y + r.height > a
          ? {
              left: n.left + n.right,
              right: t === `ltr` ? n.left : n.width + 28,
              bottom: 0,
            }
          : {
              top: n.y,
              left: n.left < 20 ? n.left * 2 + n.width : n.left + n.width - 1,
              right: t === `ltr` ? n.left : window.innerWidth - n.left - 10,
            };
    }
    function N(e, t) {
      let n = e.getBoundingClientRect(),
        r = e.querySelector(`.nav-menu-sub`).getBoundingClientRect(),
        i = window.innerWidth;
      return n.left + r.width > i
        ? {
            top: n.top + n.height + 3,
            right: t === `ltr` ? n.right - r.width : 0,
          }
        : { top: n.bottom + 3, left: n.left };
    }
    function P(e = null) {
      (i.getAttribute(`data-sidebar`) === `small` ||
        i.getAttribute(`data-layout`) === `horizontal`) &&
        document
          .querySelectorAll(`#navbar-menu-list .navbar-nav-menu > li.nav-item`)
          .forEach((t) => {
            t.contains(e)
              ? (e.parentElement.closest(`.collapse.show`) &&
                  e.parentElement
                    .closest(`.collapse.show`)
                    .querySelectorAll(`.collapse.show`)
                    .forEach((e) => {
                      (e.classList.remove(`show`),
                        e.previousElementSibling?.setAttribute(
                          `aria-expanded`,
                          `false`,
                        ));
                    }),
                t.querySelector(`a.nav-link`).classList.add(`active`))
              : (e && t.querySelector(`a.nav-link`).classList.remove(`active`),
                t.querySelectorAll(`.collapse.show`)?.forEach((e) => {
                  (e.classList.remove(`show`),
                    e.previousElementSibling?.setAttribute(
                      `aria-expanded`,
                      `false`,
                    ));
                }));
          });
    }
    ((
      document
        .getElementById(`navbar-menu-list`)
        ?.querySelectorAll(`a.nav-link`) || []
    ).forEach((e) => {
      e.addEventListener(`click`, (t) => {
        if (
          i.getAttribute(`data-sidebar`) === `small` ||
          i.getAttribute(`data-layout`) === `horizontal`
        ) {
          P(e);
          let t = e.nextElementSibling?.firstElementChild,
            n = e.getAttribute(`data-position`) || `left`,
            r = document.documentElement.getAttribute(`dir`),
            a = ``,
            o = e.closest(`li`).classList.contains(`nav-item`);
          (i.getAttribute(`data-layout`) === `horizontal` && o
            ? (a = N(e.parentElement, r))
            : n === `right-top`
              ? ((a = M(e.parentElement, r)), (t.style.top = a.top + `px`))
              : t &&
                a &&
                (a.top
                  ? ((t.style.top = a.top + `px`), (t.style.bottom = `auto`))
                  : ((t.style.bottom = a.bottom + `px`),
                    (t.style.top = `auto`)),
                r === `ltr`
                  ? (t.style.left = (a.left ?? a.right) + 1 + `px`)
                  : (t.style.right = a.right + 1 + `px`)),
            r === `ltr`
              ? (t.style.left = (a.left ?? a.right) + 1 + `px`)
              : (t.style.right = a.right + 1 + `px`));
        }
      });
    }),
      P());
  }),
  window.addEventListener(`click`, function (e) {
    (document.documentElement.getAttribute(`data-sidebar`) === `small` ||
      document.documentElement.getAttribute(`data-layout`) === `horizontal`) &&
      (e.target.closest(`#navbar-menu-list`) ||
        document.querySelectorAll(`.collapse.show`).forEach((e) => {
          (e.classList.remove(`show`),
            e.previousElementSibling?.setAttribute(`aria-expanded`, `false`));
        }));
  }),
  (function () {
    let e = document.querySelector(`.navbar-search input[type='search']`);
    if (!e) return;
    let t = [],
      n = ``;
    document
      .querySelectorAll(`#navbar-menu-list .navbar-nav-menu > li`)
      .forEach((e) => {
        if (e.classList.contains(`nav-menu-title`)) {
          n = e.textContent?.trim() || ``;
          return;
        }
        e.querySelectorAll(`a.nav-link`).forEach((e) => {
          let r =
              e.querySelector(`.content`)?.textContent?.trim() ||
              e.textContent?.trim(),
            i = e.getAttribute(`href`),
            a = e.querySelector(`.icons i`)?.className || ``;
          r &&
            i &&
            i !== `#!` &&
            t.push({
              text: r.toLowerCase(),
              displayText: r,
              href: i,
              icon: a,
              section: n || `Other`,
              originalElement: e,
            });
        });
      });
    let r = () => {
        let e = document.getElementById(`search-results-container`);
        e && e.remove();
        let t = document.createElement(`div`);
        return (
          (t.id = `search-results-container`),
          (t.className = `search-results-dropdown`),
          (t.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: 8px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      max-height: 400px;
      overflow-y: auto;
      z-index: 1050;
      background-color: var(--bs-body-bg);
      border: 1px solid var(--bs-border-color);
      min-width: 100%;
      background: white;
    `),
          t
        );
      },
      i = (n) => {
        let i = r(),
          a = n.toLowerCase().trim();
        if (!a) {
          i.remove();
          return;
        }
        let o = t.filter((e) => e.text.includes(a));
        if (o.length === 0)
          i.innerHTML = `
        <div style="padding: 16px; text-align: center; color: var(--bs-text-muted); font-size: 14px;">
          <i class="mgc_search_line" style="font-size: 24px; display: block; margin-bottom: 8px; opacity: 0.5;"></i>
          No results found for "${n}"
        </div>
      `;
        else {
          let e = [],
            t = o.reduce(
              (t, n) => (
                t[n.section] || ((t[n.section] = []), e.push(n.section)),
                t[n.section].push(n),
                t
              ),
              {},
            );
          e.forEach((e) => {
            let n = document.createElement(`div`);
            ((n.textContent = e),
              (n.style.cssText = `
          padding: 10px 16px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--bs-text-muted);
          background-color: var(--bs-gray-100);
        `),
              i.appendChild(n));
            let r = document.createElement(`ul`);
            ((r.className = `list-unstyled`),
              (r.style.margin = `0 15px 0`),
              (r.style.padding = `0`),
              t[e].forEach((n, i) => {
                let a = document.createElement(`li`);
                ((a.style.cssText = `
            border-bottom: 1px solid var(--bs-border-color);
            margin: 0;
            padding: 0;
          `),
                  i === t[e].length - 1 && (a.style.borderBottom = `none`));
                let o = document.createElement(`a`);
                ((o.href = n.href),
                  (o.className = `search-result-item`),
                  (o.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            color: var(--bs-body-color);
            text-decoration: none;
            transition: all 0.2s ease;
            cursor: pointer;
          `),
                  (o.onmouseover = () => {
                    o.style.backgroundColor = `var(--bs-gray-100)`;
                  }),
                  (o.onmouseout = () => {
                    o.style.backgroundColor = `transparent`;
                  }));
                let s = document.createElement(`span`);
                ((s.style.cssText = `
            flex: 1;
            font-size: 14px;
            font-weight: 500;
          `),
                  (s.textContent = n.displayText),
                  o.appendChild(s),
                  a.appendChild(o),
                  r.appendChild(a));
              }),
              i.appendChild(r));
          });
        }
        e.parentElement.appendChild(i);
      },
      a;
    (e.addEventListener(
      `input`,
      ((e, t) => (n) => {
        (clearTimeout(a), (a = setTimeout(() => e(n), t)));
      })((e) => {
        i(e.target.value);
      }, 300),
    ),
      e.addEventListener(`focus`, () => {
        e.value.trim() && i(e.value);
      }),
      document.addEventListener(`click`, (e) => {
        if (!e.target.closest(`.navbar-search`)) {
          let e = document.getElementById(`search-results-container`);
          e && e.remove();
        }
      }),
      document.addEventListener(`keydown`, (t) => {
        if (t.key === `Escape`) {
          let t = document.getElementById(`search-results-container`);
          (t && t.remove(), e.blur());
        }
      }));
  })());
