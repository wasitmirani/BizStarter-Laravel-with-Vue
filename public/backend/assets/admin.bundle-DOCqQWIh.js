var e = Object.create,
  t = Object.defineProperty,
  n = Object.getOwnPropertyDescriptor,
  r = Object.getOwnPropertyNames,
  i = Object.getPrototypeOf,
  a = Object.prototype.hasOwnProperty,
  o = (e, t) => () => (
    t || (e((t = { exports: {} }).exports, t), (e = null)),
    t.exports
  ),
  s = (e, n) => {
    let r = {};
    for (var i in e) t(r, i, { get: e[i], enumerable: !0 });
    return (n || t(r, Symbol.toStringTag, { value: `Module` }), r);
  },
  c = (e, i, o, s) => {
    if ((i && typeof i == `object`) || typeof i == `function`)
      for (var c = r(i), l = 0, u = c.length, d; l < u; l++)
        ((d = c[l]),
          !a.call(e, d) &&
            d !== o &&
            t(e, d, {
              get: ((e) => i[e]).bind(null, d),
              enumerable: !(s = n(i, d)) || s.enumerable,
            }));
    return e;
  },
  l = (n, r, a) => (
    (a = n == null ? {} : e(i(n))),
    c(
      r || !n || !n.__esModule
        ? t(a, `default`, { value: n, enumerable: !0 })
        : a,
      n,
    )
  );
((function () {
  let e = document.createElement(`link`).relList;
  if (e && e.supports && e.supports(`modulepreload`)) return;
  for (let e of document.querySelectorAll(`link[rel="modulepreload"]`)) n(e);
  new MutationObserver((e) => {
    for (let t of e)
      if (t.type === `childList`)
        for (let e of t.addedNodes)
          e.tagName === `LINK` && e.rel === `modulepreload` && n(e);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(e) {
    let t = {};
    return (
      e.integrity && (t.integrity = e.integrity),
      e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
      e.crossOrigin === `use-credentials`
        ? (t.credentials = `include`)
        : e.crossOrigin === `anonymous`
          ? (t.credentials = `omit`)
          : (t.credentials = `same-origin`),
      t
    );
  }
  function n(e) {
    if (e.ep) return;
    e.ep = !0;
    let n = t(e);
    fetch(e.href, n);
  }
})(),
  (function () {
    let e = document.documentElement,
      t = [
        `data-layout`,
        `data-theme`,
        `data-nav-type`,
        `data-bs-theme`,
        `data-sidebar`,
        `data-sidebar-colors`,
        `data-profile-sidebar`,
        `data-topbar-colors`,
        `data-colors`,
        `data-sidebar-image`,
      ];
    function n() {
      (sessionStorage.getItem(`data-profile-sidebar`) === `true`
        ? e.setAttribute(`data-profile-sidebar`, `true`)
        : e.removeAttribute(`data-profile-sidebar`),
        t.forEach((t) => {
          let n = sessionStorage.getItem(t) || e.getAttribute(t);
          n !== null &&
            (e.setAttribute(t, n),
            sessionStorage.getItem(t) || sessionStorage.setItem(t, n));
        }));
    }
    (n(),
      window.addEventListener(`load`, function () {
        t.forEach((e) => {
          let t = sessionStorage.getItem(e);
          if (t) {
            let n = document.querySelector(`input[name="${e}"][value="${t}"]`);
            n && (n.checked = !0);
          }
        });
      }));
  })());
function u(e) {
  var t = typeof e;
  return e != null && (t == `object` || t == `function`);
}
var d =
    typeof global == `object` && global && global.Object === Object && global,
  f = typeof self == `object` && self && self.Object === Object && self,
  p = d || f || Function(`return this`)(),
  m = function () {
    return p.Date.now();
  },
  h = /\s/;
function g(e) {
  for (var t = e.length; t-- && h.test(e.charAt(t)); );
  return t;
}
var _ = /^\s+/;
function v(e) {
  return e && e.slice(0, g(e) + 1).replace(_, ``);
}
var y = p.Symbol,
  b = Object.prototype,
  x = b.hasOwnProperty,
  S = b.toString,
  C = y ? y.toStringTag : void 0;
function w(e) {
  var t = x.call(e, C),
    n = e[C];
  try {
    e[C] = void 0;
    var r = !0;
  } catch {}
  var i = S.call(e);
  return (r && (t ? (e[C] = n) : delete e[C]), i);
}
var T = Object.prototype.toString;
function E(e) {
  return T.call(e);
}
var ee = `[object Null]`,
  D = `[object Undefined]`,
  O = y ? y.toStringTag : void 0;
function te(e) {
  return e == null
    ? e === void 0
      ? D
      : ee
    : O && O in Object(e)
      ? w(e)
      : E(e);
}
function k(e) {
  return typeof e == `object` && !!e;
}
var A = `[object Symbol]`;
function ne(e) {
  return typeof e == `symbol` || (k(e) && te(e) == A);
}
var re = NaN,
  ie = /^[-+]0x[0-9a-f]+$/i,
  ae = /^0b[01]+$/i,
  oe = /^0o[0-7]+$/i,
  se = parseInt;
function ce(e) {
  if (typeof e == `number`) return e;
  if (ne(e)) return re;
  if (u(e)) {
    var t = typeof e.valueOf == `function` ? e.valueOf() : e;
    e = u(t) ? t + `` : t;
  }
  if (typeof e != `string`) return e === 0 ? e : +e;
  e = v(e);
  var n = ae.test(e);
  return n || oe.test(e) ? se(e.slice(2), n ? 2 : 8) : ie.test(e) ? re : +e;
}
var le = `Expected a function`,
  ue = Math.max,
  de = Math.min;
function fe(e, t, n) {
  var r,
    i,
    a,
    o,
    s,
    c,
    l = 0,
    d = !1,
    f = !1,
    p = !0;
  if (typeof e != `function`) throw TypeError(le);
  ((t = ce(t) || 0),
    u(n) &&
      ((d = !!n.leading),
      (f = `maxWait` in n),
      (a = f ? ue(ce(n.maxWait) || 0, t) : a),
      (p = `trailing` in n ? !!n.trailing : p)));
  function h(t) {
    var n = r,
      a = i;
    return ((r = i = void 0), (l = t), (o = e.apply(a, n)), o);
  }
  function g(e) {
    return ((l = e), (s = setTimeout(y, t)), d ? h(e) : o);
  }
  function _(e) {
    var n = e - c,
      r = e - l,
      i = t - n;
    return f ? de(i, a - r) : i;
  }
  function v(e) {
    var n = e - c,
      r = e - l;
    return c === void 0 || n >= t || n < 0 || (f && r >= a);
  }
  function y() {
    var e = m();
    if (v(e)) return b(e);
    s = setTimeout(y, _(e));
  }
  function b(e) {
    return ((s = void 0), p && r ? h(e) : ((r = i = void 0), o));
  }
  function x() {
    (s !== void 0 && clearTimeout(s), (l = 0), (r = c = i = s = void 0));
  }
  function S() {
    return s === void 0 ? o : b(m());
  }
  function C() {
    var e = m(),
      n = v(e);
    if (((r = arguments), (i = this), (c = e), n)) {
      if (s === void 0) return g(c);
      if (f) return (clearTimeout(s), (s = setTimeout(y, t)), h(c));
    }
    return (s === void 0 && (s = setTimeout(y, t)), o);
  }
  return ((C.cancel = x), (C.flush = S), C);
}
var pe = `Expected a function`;
function me(e, t, n) {
  var r = !0,
    i = !0;
  if (typeof e != `function`) throw TypeError(pe);
  return (
    u(n) &&
      ((r = `leading` in n ? !!n.leading : r),
      (i = `trailing` in n ? !!n.trailing : i)),
    fe(e, t, { leading: r, maxWait: t, trailing: i })
  );
}
var j = function () {
  return (
    (j =
      Object.assign ||
      function (e) {
        for (var t, n = 1, r = arguments.length; n < r; n++)
          for (var i in ((t = arguments[n]), t))
            Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
        return e;
      }),
    j.apply(this, arguments)
  );
};
function he(e) {
  return !e || !e.ownerDocument || !e.ownerDocument.defaultView
    ? window
    : e.ownerDocument.defaultView;
}
function ge(e) {
  return !e || !e.ownerDocument ? document : e.ownerDocument;
}
var _e = function (e) {
  return Array.prototype.reduce.call(
    e,
    function (e, t) {
      var n = t.name.match(/data-simplebar-(.+)/);
      if (n) {
        var r = n[1].replace(/\W+(.)/g, function (e, t) {
          return t.toUpperCase();
        });
        switch (t.value) {
          case `true`:
            e[r] = !0;
            break;
          case `false`:
            e[r] = !1;
            break;
          case void 0:
            e[r] = !0;
            break;
          default:
            e[r] = t.value;
        }
      }
      return e;
    },
    {},
  );
};
function ve(e, t) {
  var n;
  e && (n = e.classList).add.apply(n, t.split(` `));
}
function ye(e, t) {
  e &&
    t.split(` `).forEach(function (t) {
      e.classList.remove(t);
    });
}
function be(e) {
  return `.${e.split(` `).join(`.`)}`;
}
var xe = !!(
    typeof window < `u` &&
    window.document &&
    window.document.createElement
  ),
  Se = Object.freeze({
    __proto__: null,
    addClasses: ve,
    canUseDOM: xe,
    classNamesToQuery: be,
    getElementDocument: ge,
    getElementWindow: he,
    getOptions: _e,
    removeClasses: ye,
  }),
  M = null,
  Ce = null;
xe &&
  window.addEventListener(`resize`, function () {
    Ce !== window.devicePixelRatio &&
      ((Ce = window.devicePixelRatio), (M = null));
  });
function we() {
  if (M === null) {
    if (typeof document > `u`) return ((M = 0), M);
    var e = document.body,
      t = document.createElement(`div`);
    (t.classList.add(`simplebar-hide-scrollbar`), e.appendChild(t));
    var n = t.getBoundingClientRect().right;
    (e.removeChild(t), (M = n));
  }
  return M;
}
var N = he,
  Te = ge,
  Ee = _e,
  P = ve,
  F = ye,
  I = be,
  De = (function () {
    function e(t, n) {
      n === void 0 && (n = {});
      var r = this;
      if (
        ((this.removePreventClickId = null),
        (this.minScrollbarWidth = 20),
        (this.stopScrollDelay = 175),
        (this.isScrolling = !1),
        (this.isMouseEntering = !1),
        (this.isDragging = !1),
        (this.scrollXTicking = !1),
        (this.scrollYTicking = !1),
        (this.wrapperEl = null),
        (this.contentWrapperEl = null),
        (this.contentEl = null),
        (this.offsetEl = null),
        (this.maskEl = null),
        (this.placeholderEl = null),
        (this.heightAutoObserverWrapperEl = null),
        (this.heightAutoObserverEl = null),
        (this.rtlHelpers = null),
        (this.scrollbarWidth = 0),
        (this.resizeObserver = null),
        (this.mutationObserver = null),
        (this.elStyles = null),
        (this.isRtl = null),
        (this.mouseX = 0),
        (this.mouseY = 0),
        (this.onMouseMove = function () {}),
        (this.onWindowResize = function () {}),
        (this.onStopScrolling = function () {}),
        (this.onMouseEntered = function () {}),
        (this.onScroll = function () {
          var e = N(r.el);
          ((r.scrollXTicking ||= (e.requestAnimationFrame(r.scrollX), !0)),
            (r.scrollYTicking ||= (e.requestAnimationFrame(r.scrollY), !0)),
            r.isScrolling ||
              ((r.isScrolling = !0), P(r.el, r.classNames.scrolling)),
            r.showScrollbar(`x`),
            r.showScrollbar(`y`),
            r.onStopScrolling());
        }),
        (this.scrollX = function () {
          (r.axis.x.isOverflowing && r.positionScrollbar(`x`),
            (r.scrollXTicking = !1));
        }),
        (this.scrollY = function () {
          (r.axis.y.isOverflowing && r.positionScrollbar(`y`),
            (r.scrollYTicking = !1));
        }),
        (this._onStopScrolling = function () {
          (F(r.el, r.classNames.scrolling),
            r.options.autoHide && (r.hideScrollbar(`x`), r.hideScrollbar(`y`)),
            (r.isScrolling = !1));
        }),
        (this.onMouseEnter = function () {
          ((r.isMouseEntering ||=
            (P(r.el, r.classNames.mouseEntered),
            r.showScrollbar(`x`),
            r.showScrollbar(`y`),
            !0)),
            r.onMouseEntered());
        }),
        (this._onMouseEntered = function () {
          (F(r.el, r.classNames.mouseEntered),
            r.options.autoHide && (r.hideScrollbar(`x`), r.hideScrollbar(`y`)),
            (r.isMouseEntering = !1));
        }),
        (this._onMouseMove = function (e) {
          ((r.mouseX = e.clientX),
            (r.mouseY = e.clientY),
            (r.axis.x.isOverflowing || r.axis.x.forceVisible) &&
              r.onMouseMoveForAxis(`x`),
            (r.axis.y.isOverflowing || r.axis.y.forceVisible) &&
              r.onMouseMoveForAxis(`y`));
        }),
        (this.onMouseLeave = function () {
          (r.onMouseMove.cancel(),
            (r.axis.x.isOverflowing || r.axis.x.forceVisible) &&
              r.onMouseLeaveForAxis(`x`),
            (r.axis.y.isOverflowing || r.axis.y.forceVisible) &&
              r.onMouseLeaveForAxis(`y`),
            (r.mouseX = -1),
            (r.mouseY = -1));
        }),
        (this._onWindowResize = function () {
          ((r.scrollbarWidth = r.getScrollbarWidth()), r.hideNativeScrollbar());
        }),
        (this.onPointerEvent = function (e) {
          if (
            !(
              !r.axis.x.track.el ||
              !r.axis.y.track.el ||
              !r.axis.x.scrollbar.el ||
              !r.axis.y.scrollbar.el
            )
          ) {
            var t, n;
            ((r.axis.x.track.rect = r.axis.x.track.el.getBoundingClientRect()),
              (r.axis.y.track.rect = r.axis.y.track.el.getBoundingClientRect()),
              (r.axis.x.isOverflowing || r.axis.x.forceVisible) &&
                (t = r.isWithinBounds(r.axis.x.track.rect)),
              (r.axis.y.isOverflowing || r.axis.y.forceVisible) &&
                (n = r.isWithinBounds(r.axis.y.track.rect)),
              (t || n) &&
                (e.stopPropagation(),
                e.type === `pointerdown` &&
                  e.pointerType !== `touch` &&
                  (t &&
                    ((r.axis.x.scrollbar.rect =
                      r.axis.x.scrollbar.el.getBoundingClientRect()),
                    r.isWithinBounds(r.axis.x.scrollbar.rect)
                      ? r.onDragStart(e, `x`)
                      : r.onTrackClick(e, `x`)),
                  n &&
                    ((r.axis.y.scrollbar.rect =
                      r.axis.y.scrollbar.el.getBoundingClientRect()),
                    r.isWithinBounds(r.axis.y.scrollbar.rect)
                      ? r.onDragStart(e, `y`)
                      : r.onTrackClick(e, `y`)))));
          }
        }),
        (this.drag = function (t) {
          if (!(!r.draggedAxis || !r.contentWrapperEl)) {
            var n,
              i = r.axis[r.draggedAxis].track,
              a = i.rect?.[r.axis[r.draggedAxis].sizeAttr] ?? 0,
              o = r.axis[r.draggedAxis].scrollbar,
              s =
                r.contentWrapperEl?.[r.axis[r.draggedAxis].scrollSizeAttr] ?? 0,
              c = parseInt(
                r.elStyles?.[r.axis[r.draggedAxis].sizeAttr] ?? `0px`,
                10,
              );
            (t.preventDefault(),
              t.stopPropagation(),
              (n = r.draggedAxis === `y` ? t.pageY : t.pageX));
            var l =
              n -
              (i.rect?.[r.axis[r.draggedAxis].offsetAttr] ?? 0) -
              r.axis[r.draggedAxis].dragOffset;
            l =
              r.draggedAxis === `x` && r.isRtl
                ? (i.rect?.[r.axis[r.draggedAxis].sizeAttr] ?? 0) - o.size - l
                : l;
            var u = (l / (a - o.size)) * (s - c);
            (r.draggedAxis === `x` &&
              r.isRtl &&
              (u = e.getRtlHelpers()?.isScrollingToNegative ? -u : u),
              (r.contentWrapperEl[r.axis[r.draggedAxis].scrollOffsetAttr] = u));
          }
        }),
        (this.onEndDrag = function (e) {
          r.isDragging = !1;
          var t = Te(r.el),
            n = N(r.el);
          (e.preventDefault(),
            e.stopPropagation(),
            F(r.el, r.classNames.dragging),
            r.onStopScrolling(),
            t.removeEventListener(`mousemove`, r.drag, !0),
            t.removeEventListener(`mouseup`, r.onEndDrag, !0),
            (r.removePreventClickId = n.setTimeout(function () {
              (t.removeEventListener(`click`, r.preventClick, !0),
                t.removeEventListener(`dblclick`, r.preventClick, !0),
                (r.removePreventClickId = null));
            })));
        }),
        (this.preventClick = function (e) {
          (e.preventDefault(), e.stopPropagation());
        }),
        (this.el = t),
        (this.options = j(j({}, e.defaultOptions), n)),
        (this.classNames = j(j({}, e.defaultOptions.classNames), n.classNames)),
        (this.axis = {
          x: {
            scrollOffsetAttr: `scrollLeft`,
            sizeAttr: `width`,
            scrollSizeAttr: `scrollWidth`,
            offsetSizeAttr: `offsetWidth`,
            offsetAttr: `left`,
            overflowAttr: `overflowX`,
            dragOffset: 0,
            isOverflowing: !0,
            forceVisible: !1,
            track: { size: null, el: null, rect: null, isVisible: !1 },
            scrollbar: { size: null, el: null, rect: null, isVisible: !1 },
          },
          y: {
            scrollOffsetAttr: `scrollTop`,
            sizeAttr: `height`,
            scrollSizeAttr: `scrollHeight`,
            offsetSizeAttr: `offsetHeight`,
            offsetAttr: `top`,
            overflowAttr: `overflowY`,
            dragOffset: 0,
            isOverflowing: !0,
            forceVisible: !1,
            track: { size: null, el: null, rect: null, isVisible: !1 },
            scrollbar: { size: null, el: null, rect: null, isVisible: !1 },
          },
        }),
        typeof this.el != `object` || !this.el.nodeName)
      )
        throw Error(
          `Argument passed to SimpleBar must be an HTML element instead of ${this.el}`,
        );
      ((this.onMouseMove = me(this._onMouseMove, 64)),
        (this.onWindowResize = fe(this._onWindowResize, 64, { leading: !0 })),
        (this.onStopScrolling = fe(
          this._onStopScrolling,
          this.stopScrollDelay,
        )),
        (this.onMouseEntered = fe(this._onMouseEntered, this.stopScrollDelay)),
        this.init());
    }
    return (
      (e.getRtlHelpers = function () {
        if (e.rtlHelpers) return e.rtlHelpers;
        var t = document.createElement(`div`);
        t.innerHTML = `<div class="simplebar-dummy-scrollbar-size"><div></div></div>`;
        var n = t.firstElementChild,
          r = n?.firstElementChild;
        if (!r) return null;
        (document.body.appendChild(n), (n.scrollLeft = 0));
        var i = e.getOffset(n),
          a = e.getOffset(r);
        n.scrollLeft = -999;
        var o = e.getOffset(r);
        return (
          document.body.removeChild(n),
          (e.rtlHelpers = {
            isScrollOriginAtZero: i.left !== a.left,
            isScrollingToNegative: a.left !== o.left,
          }),
          e.rtlHelpers
        );
      }),
      (e.prototype.getScrollbarWidth = function () {
        try {
          return (this.contentWrapperEl &&
            getComputedStyle(this.contentWrapperEl, `::-webkit-scrollbar`)
              .display === `none`) ||
            `scrollbarWidth` in document.documentElement.style ||
            `-ms-overflow-style` in document.documentElement.style
            ? 0
            : we();
        } catch {
          return we();
        }
      }),
      (e.getOffset = function (e) {
        var t = e.getBoundingClientRect(),
          n = Te(e),
          r = N(e);
        return {
          top: t.top + (r.pageYOffset || n.documentElement.scrollTop),
          left: t.left + (r.pageXOffset || n.documentElement.scrollLeft),
        };
      }),
      (e.prototype.init = function () {
        xe &&
          (this.initDOM(),
          (this.rtlHelpers = e.getRtlHelpers()),
          (this.scrollbarWidth = this.getScrollbarWidth()),
          this.recalculate(),
          this.initListeners());
      }),
      (e.prototype.initDOM = function () {
        ((this.wrapperEl = this.el.querySelector(I(this.classNames.wrapper))),
          (this.contentWrapperEl =
            this.options.scrollableNode ||
            this.el.querySelector(I(this.classNames.contentWrapper))),
          (this.contentEl =
            this.options.contentNode ||
            this.el.querySelector(I(this.classNames.contentEl))),
          (this.offsetEl = this.el.querySelector(I(this.classNames.offset))),
          (this.maskEl = this.el.querySelector(I(this.classNames.mask))),
          (this.placeholderEl = this.findChild(
            this.wrapperEl,
            I(this.classNames.placeholder),
          )),
          (this.heightAutoObserverWrapperEl = this.el.querySelector(
            I(this.classNames.heightAutoObserverWrapperEl),
          )),
          (this.heightAutoObserverEl = this.el.querySelector(
            I(this.classNames.heightAutoObserverEl),
          )),
          (this.axis.x.track.el = this.findChild(
            this.el,
            `${I(this.classNames.track)}${I(this.classNames.horizontal)}`,
          )),
          (this.axis.y.track.el = this.findChild(
            this.el,
            `${I(this.classNames.track)}${I(this.classNames.vertical)}`,
          )),
          (this.axis.x.scrollbar.el =
            this.axis.x.track.el?.querySelector(I(this.classNames.scrollbar)) ||
            null),
          (this.axis.y.scrollbar.el =
            this.axis.y.track.el?.querySelector(I(this.classNames.scrollbar)) ||
            null),
          this.options.autoHide ||
            (P(this.axis.x.scrollbar.el, this.classNames.visible),
            P(this.axis.y.scrollbar.el, this.classNames.visible)));
      }),
      (e.prototype.initListeners = function () {
        var e = this,
          t,
          n = N(this.el);
        if (
          (this.el.addEventListener(`mouseenter`, this.onMouseEnter),
          this.el.addEventListener(`pointerdown`, this.onPointerEvent, !0),
          this.el.addEventListener(`mousemove`, this.onMouseMove),
          this.el.addEventListener(`mouseleave`, this.onMouseLeave),
          (t = this.contentWrapperEl) == null ||
            t.addEventListener(`scroll`, this.onScroll),
          n.addEventListener(`resize`, this.onWindowResize),
          this.contentEl)
        ) {
          if (window.ResizeObserver) {
            var r = !1,
              i = n.ResizeObserver || ResizeObserver;
            ((this.resizeObserver = new i(function () {
              r &&
                n.requestAnimationFrame(function () {
                  e.recalculate();
                });
            })),
              this.resizeObserver.observe(this.el),
              this.resizeObserver.observe(this.contentEl),
              n.requestAnimationFrame(function () {
                r = !0;
              }));
          }
          ((this.mutationObserver = new n.MutationObserver(function () {
            n.requestAnimationFrame(function () {
              e.recalculate();
            });
          })),
            this.mutationObserver.observe(this.contentEl, {
              childList: !0,
              subtree: !0,
              characterData: !0,
            }));
        }
      }),
      (e.prototype.recalculate = function () {
        if (
          !(
            !this.heightAutoObserverEl ||
            !this.contentEl ||
            !this.contentWrapperEl ||
            !this.wrapperEl ||
            !this.placeholderEl
          )
        ) {
          var e = N(this.el);
          ((this.elStyles = e.getComputedStyle(this.el)),
            (this.isRtl = this.elStyles.direction === `rtl`));
          var t = this.contentEl.offsetWidth,
            n = this.heightAutoObserverEl.offsetHeight <= 1,
            r = this.heightAutoObserverEl.offsetWidth <= 1 || t > 0,
            i = this.contentWrapperEl.offsetWidth,
            a = this.elStyles.overflowX,
            o = this.elStyles.overflowY;
          ((this.contentEl.style.padding = `${this.elStyles.paddingTop} ${this.elStyles.paddingRight} ${this.elStyles.paddingBottom} ${this.elStyles.paddingLeft}`),
            (this.wrapperEl.style.margin = `-${this.elStyles.paddingTop} -${this.elStyles.paddingRight} -${this.elStyles.paddingBottom} -${this.elStyles.paddingLeft}`));
          var s = this.contentEl.scrollHeight,
            c = this.contentEl.scrollWidth;
          ((this.contentWrapperEl.style.height = n ? `auto` : `100%`),
            (this.placeholderEl.style.width = r ? `${t || c}px` : `auto`),
            (this.placeholderEl.style.height = `${s}px`));
          var l = this.contentWrapperEl.offsetHeight;
          ((this.axis.x.isOverflowing = t !== 0 && c > t),
            (this.axis.y.isOverflowing = s > l),
            (this.axis.x.isOverflowing =
              a === `hidden` ? !1 : this.axis.x.isOverflowing),
            (this.axis.y.isOverflowing =
              o === `hidden` ? !1 : this.axis.y.isOverflowing),
            (this.axis.x.forceVisible =
              this.options.forceVisible === `x` ||
              this.options.forceVisible === !0),
            (this.axis.y.forceVisible =
              this.options.forceVisible === `y` ||
              this.options.forceVisible === !0),
            this.hideNativeScrollbar());
          var u = this.axis.x.isOverflowing ? this.scrollbarWidth : 0,
            d = this.axis.y.isOverflowing ? this.scrollbarWidth : 0;
          ((this.axis.x.isOverflowing = this.axis.x.isOverflowing && c > i - d),
            (this.axis.y.isOverflowing =
              this.axis.y.isOverflowing && s > l - u),
            (this.axis.x.scrollbar.size = this.getScrollbarSize(`x`)),
            (this.axis.y.scrollbar.size = this.getScrollbarSize(`y`)),
            this.axis.x.scrollbar.el &&
              (this.axis.x.scrollbar.el.style.width = `${this.axis.x.scrollbar.size}px`),
            this.axis.y.scrollbar.el &&
              (this.axis.y.scrollbar.el.style.height = `${this.axis.y.scrollbar.size}px`),
            this.positionScrollbar(`x`),
            this.positionScrollbar(`y`),
            this.toggleTrackVisibility(`x`),
            this.toggleTrackVisibility(`y`));
        }
      }),
      (e.prototype.getScrollbarSize = function (e) {
        if (
          (e === void 0 && (e = `y`),
          !this.axis[e].isOverflowing || !this.contentEl)
        )
          return 0;
        var t = this.contentEl[this.axis[e].scrollSizeAttr],
          n = this.axis[e].track.el?.[this.axis[e].offsetSizeAttr] ?? 0,
          r = n / t,
          i = Math.max(~~(r * n), this.options.scrollbarMinSize);
        return (
          this.options.scrollbarMaxSize &&
            (i = Math.min(i, this.options.scrollbarMaxSize)),
          i
        );
      }),
      (e.prototype.positionScrollbar = function (t) {
        t === void 0 && (t = `y`);
        var n = this.axis[t].scrollbar;
        if (
          !(
            !this.axis[t].isOverflowing ||
            !this.contentWrapperEl ||
            !n.el ||
            !this.elStyles
          )
        ) {
          var r = this.contentWrapperEl[this.axis[t].scrollSizeAttr],
            i = this.axis[t].track.el?.[this.axis[t].offsetSizeAttr] || 0,
            a = parseInt(this.elStyles[this.axis[t].sizeAttr], 10),
            o = this.contentWrapperEl[this.axis[t].scrollOffsetAttr];
          ((o =
            t === `x` && this.isRtl && e.getRtlHelpers()?.isScrollOriginAtZero
              ? -o
              : o),
            t === `x` &&
              this.isRtl &&
              (o = e.getRtlHelpers()?.isScrollingToNegative ? o : -o));
          var s = o / (r - a),
            c = ~~((i - n.size) * s);
          ((c = t === `x` && this.isRtl ? -c + (i - n.size) : c),
            (n.el.style.transform =
              t === `x`
                ? `translate3d(${c}px, 0, 0)`
                : `translate3d(0, ${c}px, 0)`));
        }
      }),
      (e.prototype.toggleTrackVisibility = function (e) {
        e === void 0 && (e = `y`);
        var t = this.axis[e].track.el,
          n = this.axis[e].scrollbar.el;
        !t ||
          !n ||
          !this.contentWrapperEl ||
          (this.axis[e].isOverflowing || this.axis[e].forceVisible
            ? ((t.style.visibility = `visible`),
              (this.contentWrapperEl.style[this.axis[e].overflowAttr] =
                `scroll`),
              this.el.classList.add(`${this.classNames.scrollable}-${e}`))
            : ((t.style.visibility = `hidden`),
              (this.contentWrapperEl.style[this.axis[e].overflowAttr] =
                `hidden`),
              this.el.classList.remove(`${this.classNames.scrollable}-${e}`)),
          this.axis[e].isOverflowing
            ? (n.style.display = `block`)
            : (n.style.display = `none`));
      }),
      (e.prototype.showScrollbar = function (e) {
        (e === void 0 && (e = `y`),
          this.axis[e].isOverflowing &&
            !this.axis[e].scrollbar.isVisible &&
            (P(this.axis[e].scrollbar.el, this.classNames.visible),
            (this.axis[e].scrollbar.isVisible = !0)));
      }),
      (e.prototype.hideScrollbar = function (e) {
        (e === void 0 && (e = `y`),
          !this.isDragging &&
            this.axis[e].isOverflowing &&
            this.axis[e].scrollbar.isVisible &&
            (F(this.axis[e].scrollbar.el, this.classNames.visible),
            (this.axis[e].scrollbar.isVisible = !1)));
      }),
      (e.prototype.hideNativeScrollbar = function () {
        this.offsetEl &&
          ((this.offsetEl.style[this.isRtl ? `left` : `right`] =
            this.axis.y.isOverflowing || this.axis.y.forceVisible
              ? `-${this.scrollbarWidth}px`
              : `0px`),
          (this.offsetEl.style.bottom =
            this.axis.x.isOverflowing || this.axis.x.forceVisible
              ? `-${this.scrollbarWidth}px`
              : `0px`));
      }),
      (e.prototype.onMouseMoveForAxis = function (e) {
        e === void 0 && (e = `y`);
        var t = this.axis[e];
        !t.track.el ||
          !t.scrollbar.el ||
          ((t.track.rect = t.track.el.getBoundingClientRect()),
          (t.scrollbar.rect = t.scrollbar.el.getBoundingClientRect()),
          this.isWithinBounds(t.track.rect)
            ? (this.showScrollbar(e),
              P(t.track.el, this.classNames.hover),
              this.isWithinBounds(t.scrollbar.rect)
                ? P(t.scrollbar.el, this.classNames.hover)
                : F(t.scrollbar.el, this.classNames.hover))
            : (F(t.track.el, this.classNames.hover),
              this.options.autoHide && this.hideScrollbar(e)));
      }),
      (e.prototype.onMouseLeaveForAxis = function (e) {
        (e === void 0 && (e = `y`),
          F(this.axis[e].track.el, this.classNames.hover),
          F(this.axis[e].scrollbar.el, this.classNames.hover),
          this.options.autoHide && this.hideScrollbar(e));
      }),
      (e.prototype.onDragStart = function (e, t) {
        (t === void 0 && (t = `y`), (this.isDragging = !0));
        var n = Te(this.el),
          r = N(this.el),
          i = this.axis[t].scrollbar,
          a = t === `y` ? e.pageY : e.pageX;
        ((this.axis[t].dragOffset =
          a - (i.rect?.[this.axis[t].offsetAttr] || 0)),
          (this.draggedAxis = t),
          P(this.el, this.classNames.dragging),
          n.addEventListener(`mousemove`, this.drag, !0),
          n.addEventListener(`mouseup`, this.onEndDrag, !0),
          this.removePreventClickId === null
            ? (n.addEventListener(`click`, this.preventClick, !0),
              n.addEventListener(`dblclick`, this.preventClick, !0))
            : (r.clearTimeout(this.removePreventClickId),
              (this.removePreventClickId = null)));
      }),
      (e.prototype.onTrackClick = function (e, t) {
        var n = this;
        t === void 0 && (t = `y`);
        var r = this.axis[t];
        if (
          !(
            !this.options.clickOnTrack ||
            !r.scrollbar.el ||
            !this.contentWrapperEl
          )
        ) {
          e.preventDefault();
          var i = N(this.el);
          this.axis[t].scrollbar.rect = r.scrollbar.el.getBoundingClientRect();
          var a = this.axis[t].scrollbar.rect?.[this.axis[t].offsetAttr] ?? 0,
            o = parseInt(this.elStyles?.[this.axis[t].sizeAttr] ?? `0px`, 10),
            s = this.contentWrapperEl[this.axis[t].scrollOffsetAttr],
            c = (t === `y` ? this.mouseY - a : this.mouseX - a) < 0 ? -1 : 1,
            l = c === -1 ? s - o : s + o,
            u = 40,
            d = function () {
              n.contentWrapperEl &&
                (c === -1
                  ? s > l &&
                    ((s -= u),
                    (n.contentWrapperEl[n.axis[t].scrollOffsetAttr] = s),
                    i.requestAnimationFrame(d))
                  : s < l &&
                    ((s += u),
                    (n.contentWrapperEl[n.axis[t].scrollOffsetAttr] = s),
                    i.requestAnimationFrame(d)));
            };
          d();
        }
      }),
      (e.prototype.getContentElement = function () {
        return this.contentEl;
      }),
      (e.prototype.getScrollElement = function () {
        return this.contentWrapperEl;
      }),
      (e.prototype.removeListeners = function () {
        var e = N(this.el);
        (this.el.removeEventListener(`mouseenter`, this.onMouseEnter),
          this.el.removeEventListener(`pointerdown`, this.onPointerEvent, !0),
          this.el.removeEventListener(`mousemove`, this.onMouseMove),
          this.el.removeEventListener(`mouseleave`, this.onMouseLeave),
          this.contentWrapperEl &&
            this.contentWrapperEl.removeEventListener(`scroll`, this.onScroll),
          e.removeEventListener(`resize`, this.onWindowResize),
          this.mutationObserver && this.mutationObserver.disconnect(),
          this.resizeObserver && this.resizeObserver.disconnect(),
          this.onMouseMove.cancel(),
          this.onWindowResize.cancel(),
          this.onStopScrolling.cancel(),
          this.onMouseEntered.cancel());
      }),
      (e.prototype.unMount = function () {
        this.removeListeners();
      }),
      (e.prototype.isWithinBounds = function (e) {
        return (
          this.mouseX >= e.left &&
          this.mouseX <= e.left + e.width &&
          this.mouseY >= e.top &&
          this.mouseY <= e.top + e.height
        );
      }),
      (e.prototype.findChild = function (e, t) {
        var n =
          e.matches ||
          e.webkitMatchesSelector ||
          e.mozMatchesSelector ||
          e.msMatchesSelector;
        return Array.prototype.filter.call(e.children, function (e) {
          return n.call(e, t);
        })[0];
      }),
      (e.rtlHelpers = null),
      (e.defaultOptions = {
        forceVisible: !1,
        clickOnTrack: !0,
        scrollbarMinSize: 25,
        scrollbarMaxSize: 0,
        ariaLabel: `scrollable content`,
        tabIndex: 0,
        classNames: {
          contentEl: `simplebar-content`,
          contentWrapper: `simplebar-content-wrapper`,
          offset: `simplebar-offset`,
          mask: `simplebar-mask`,
          wrapper: `simplebar-wrapper`,
          placeholder: `simplebar-placeholder`,
          scrollbar: `simplebar-scrollbar`,
          track: `simplebar-track`,
          heightAutoObserverWrapperEl: `simplebar-height-auto-observer-wrapper`,
          heightAutoObserverEl: `simplebar-height-auto-observer`,
          visible: `simplebar-visible`,
          horizontal: `simplebar-horizontal`,
          vertical: `simplebar-vertical`,
          hover: `simplebar-hover`,
          dragging: `simplebar-dragging`,
          scrolling: `simplebar-scrolling`,
          scrollable: `simplebar-scrollable`,
          mouseEntered: `simplebar-mouse-entered`,
        },
        scrollableNode: null,
        contentNode: null,
        autoHide: !0,
      }),
      (e.getOptions = Ee),
      (e.helpers = Se),
      e
    );
  })(),
  Oe = function (e, t) {
    return (
      (Oe =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, t) {
            e.__proto__ = t;
          }) ||
        function (e, t) {
          for (var n in t)
            Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
        }),
      Oe(e, t)
    );
  };
function ke(e, t) {
  if (typeof t != `function` && t !== null)
    throw TypeError(
      `Class extends value ` + String(t) + ` is not a constructor or null`,
    );
  Oe(e, t);
  function n() {
    this.constructor = e;
  }
  e.prototype =
    t === null ? Object.create(t) : ((n.prototype = t.prototype), new n());
}
var Ae = De.helpers,
  je = Ae.getOptions,
  L = Ae.addClasses,
  Me = Ae.canUseDOM,
  Ne = (function (e) {
    ke(t, e);
    function t() {
      var n = [...arguments],
        r = e.apply(this, n) || this;
      return (t.instances.set(n[0], r), r);
    }
    return (
      (t.initDOMLoadedElements = function () {
        (document.removeEventListener(
          `DOMContentLoaded`,
          this.initDOMLoadedElements,
        ),
          window.removeEventListener(`load`, this.initDOMLoadedElements),
          Array.prototype.forEach.call(
            document.querySelectorAll(`[data-simplebar]`),
            function (e) {
              e.getAttribute(`data-simplebar`) !== `init` &&
                !t.instances.has(e) &&
                new t(e, je(e.attributes));
            },
          ));
      }),
      (t.removeObserver = function () {
        var e;
        (e = t.globalObserver) == null || e.disconnect();
      }),
      (t.prototype.initDOM = function () {
        var e = this,
          t,
          n,
          r;
        if (
          !Array.prototype.filter.call(this.el.children, function (t) {
            return t.classList.contains(e.classNames.wrapper);
          }).length
        ) {
          for (
            this.wrapperEl = document.createElement(`div`),
              this.contentWrapperEl = document.createElement(`div`),
              this.offsetEl = document.createElement(`div`),
              this.maskEl = document.createElement(`div`),
              this.contentEl = document.createElement(`div`),
              this.placeholderEl = document.createElement(`div`),
              this.heightAutoObserverWrapperEl = document.createElement(`div`),
              this.heightAutoObserverEl = document.createElement(`div`),
              L(this.wrapperEl, this.classNames.wrapper),
              L(this.contentWrapperEl, this.classNames.contentWrapper),
              L(this.offsetEl, this.classNames.offset),
              L(this.maskEl, this.classNames.mask),
              L(this.contentEl, this.classNames.contentEl),
              L(this.placeholderEl, this.classNames.placeholder),
              L(
                this.heightAutoObserverWrapperEl,
                this.classNames.heightAutoObserverWrapperEl,
              ),
              L(
                this.heightAutoObserverEl,
                this.classNames.heightAutoObserverEl,
              );
            this.el.firstChild;
          )
            this.contentEl.appendChild(this.el.firstChild);
          (this.contentWrapperEl.appendChild(this.contentEl),
            this.offsetEl.appendChild(this.contentWrapperEl),
            this.maskEl.appendChild(this.offsetEl),
            this.heightAutoObserverWrapperEl.appendChild(
              this.heightAutoObserverEl,
            ),
            this.wrapperEl.appendChild(this.heightAutoObserverWrapperEl),
            this.wrapperEl.appendChild(this.maskEl),
            this.wrapperEl.appendChild(this.placeholderEl),
            this.el.appendChild(this.wrapperEl),
            (t = this.contentWrapperEl) == null ||
              t.setAttribute(`tabindex`, this.options.tabIndex.toString()),
            (n = this.contentWrapperEl) == null ||
              n.setAttribute(`role`, `region`),
            (r = this.contentWrapperEl) == null ||
              r.setAttribute(`aria-label`, this.options.ariaLabel));
        }
        if (!this.axis.x.track.el || !this.axis.y.track.el) {
          var i = document.createElement(`div`),
            a = document.createElement(`div`);
          (L(i, this.classNames.track),
            L(a, this.classNames.scrollbar),
            i.appendChild(a),
            (this.axis.x.track.el = i.cloneNode(!0)),
            L(this.axis.x.track.el, this.classNames.horizontal),
            (this.axis.y.track.el = i.cloneNode(!0)),
            L(this.axis.y.track.el, this.classNames.vertical),
            this.el.appendChild(this.axis.x.track.el),
            this.el.appendChild(this.axis.y.track.el));
        }
        (De.prototype.initDOM.call(this),
          this.el.setAttribute(`data-simplebar`, `init`));
      }),
      (t.prototype.unMount = function () {
        (De.prototype.unMount.call(this), t.instances.delete(this.el));
      }),
      (t.initHtmlApi = function () {
        ((this.initDOMLoadedElements = this.initDOMLoadedElements.bind(this)),
          typeof MutationObserver < `u` &&
            ((this.globalObserver = new MutationObserver(t.handleMutations)),
            this.globalObserver.observe(document, {
              childList: !0,
              subtree: !0,
            })),
          document.readyState === `complete` ||
          (document.readyState !== `loading` &&
            !document.documentElement.doScroll)
            ? window.setTimeout(this.initDOMLoadedElements)
            : (document.addEventListener(
                `DOMContentLoaded`,
                this.initDOMLoadedElements,
              ),
              window.addEventListener(`load`, this.initDOMLoadedElements)));
      }),
      (t.handleMutations = function (e) {
        e.forEach(function (e) {
          (e.addedNodes.forEach(function (e) {
            e.nodeType === 1 &&
              (e.hasAttribute(`data-simplebar`)
                ? !t.instances.has(e) &&
                  document.documentElement.contains(e) &&
                  new t(e, je(e.attributes))
                : e.querySelectorAll(`[data-simplebar]`).forEach(function (e) {
                    e.getAttribute(`data-simplebar`) !== `init` &&
                      !t.instances.has(e) &&
                      document.documentElement.contains(e) &&
                      new t(e, je(e.attributes));
                  }));
          }),
            e.removedNodes.forEach(function (e) {
              var n;
              e.nodeType === 1 &&
                (e.getAttribute(`data-simplebar`) === `init`
                  ? !document.documentElement.contains(e) &&
                    ((n = t.instances.get(e)) == null || n.unMount())
                  : Array.prototype.forEach.call(
                      e.querySelectorAll(`[data-simplebar="init"]`),
                      function (e) {
                        var n;
                        !document.documentElement.contains(e) &&
                          ((n = t.instances.get(e)) == null || n.unMount());
                      },
                    ));
            }));
        });
      }),
      (t.instances = new WeakMap()),
      t
    );
  })(De);
Me && Ne.initHtmlApi();
var R = `bottom`,
  z = `right`,
  B = `left`,
  Pe = `auto`,
  Fe = [`top`, R, z, B],
  Ie = `start`,
  Le = `clippingParents`,
  Re = `viewport`,
  ze = `popper`,
  Be = `reference`,
  Ve = Fe.reduce(function (e, t) {
    return e.concat([t + `-` + Ie, t + `-end`]);
  }, []),
  He = [].concat(Fe, [Pe]).reduce(function (e, t) {
    return e.concat([t, t + `-` + Ie, t + `-end`]);
  }, []),
  Ue = `beforeRead`,
  We = `read`,
  Ge = `afterRead`,
  Ke = `beforeMain`,
  qe = `main`,
  Je = `afterMain`,
  Ye = `beforeWrite`,
  Xe = `write`,
  Ze = `afterWrite`,
  Qe = [Ue, We, Ge, Ke, qe, Je, Ye, Xe, Ze];
function V(e) {
  return e ? (e.nodeName || ``).toLowerCase() : null;
}
function H(e) {
  if (e == null) return window;
  if (e.toString() !== `[object Window]`) {
    var t = e.ownerDocument;
    return (t && t.defaultView) || window;
  }
  return e;
}
function $e(e) {
  return e instanceof H(e).Element || e instanceof Element;
}
function U(e) {
  return e instanceof H(e).HTMLElement || e instanceof HTMLElement;
}
function et(e) {
  return typeof ShadowRoot > `u`
    ? !1
    : e instanceof H(e).ShadowRoot || e instanceof ShadowRoot;
}
function tt(e) {
  var t = e.state;
  Object.keys(t.elements).forEach(function (e) {
    var n = t.styles[e] || {},
      r = t.attributes[e] || {},
      i = t.elements[e];
    !U(i) ||
      !V(i) ||
      (Object.assign(i.style, n),
      Object.keys(r).forEach(function (e) {
        var t = r[e];
        t === !1 ? i.removeAttribute(e) : i.setAttribute(e, t === !0 ? `` : t);
      }));
  });
}
function nt(e) {
  var t = e.state,
    n = {
      popper: {
        position: t.options.strategy,
        left: `0`,
        top: `0`,
        margin: `0`,
      },
      arrow: { position: `absolute` },
      reference: {},
    };
  return (
    Object.assign(t.elements.popper.style, n.popper),
    (t.styles = n),
    t.elements.arrow && Object.assign(t.elements.arrow.style, n.arrow),
    function () {
      Object.keys(t.elements).forEach(function (e) {
        var r = t.elements[e],
          i = t.attributes[e] || {},
          a = Object.keys(
            t.styles.hasOwnProperty(e) ? t.styles[e] : n[e],
          ).reduce(function (e, t) {
            return ((e[t] = ``), e);
          }, {});
        !U(r) ||
          !V(r) ||
          (Object.assign(r.style, a),
          Object.keys(i).forEach(function (e) {
            r.removeAttribute(e);
          }));
      });
    }
  );
}
var rt = {
  name: `applyStyles`,
  enabled: !0,
  phase: `write`,
  fn: tt,
  effect: nt,
  requires: [`computeStyles`],
};
function W(e) {
  return e.split(`-`)[0];
}
var it = Math.max,
  at = Math.min,
  ot = Math.round;
function st() {
  var e = navigator.userAgentData;
  return e != null && e.brands && Array.isArray(e.brands)
    ? e.brands
        .map(function (e) {
          return e.brand + `/` + e.version;
        })
        .join(` `)
    : navigator.userAgent;
}
function ct() {
  return !/^((?!chrome|android).)*safari/i.test(st());
}
function lt(e, t, n) {
  (t === void 0 && (t = !1), n === void 0 && (n = !1));
  var r = e.getBoundingClientRect(),
    i = 1,
    a = 1;
  t &&
    U(e) &&
    ((i = (e.offsetWidth > 0 && ot(r.width) / e.offsetWidth) || 1),
    (a = (e.offsetHeight > 0 && ot(r.height) / e.offsetHeight) || 1));
  var o = ($e(e) ? H(e) : window).visualViewport,
    s = !ct() && n,
    c = (r.left + (s && o ? o.offsetLeft : 0)) / i,
    l = (r.top + (s && o ? o.offsetTop : 0)) / a,
    u = r.width / i,
    d = r.height / a;
  return {
    width: u,
    height: d,
    top: l,
    right: c + u,
    bottom: l + d,
    left: c,
    x: c,
    y: l,
  };
}
function ut(e) {
  var t = lt(e),
    n = e.offsetWidth,
    r = e.offsetHeight;
  return (
    Math.abs(t.width - n) <= 1 && (n = t.width),
    Math.abs(t.height - r) <= 1 && (r = t.height),
    { x: e.offsetLeft, y: e.offsetTop, width: n, height: r }
  );
}
function dt(e, t) {
  var n = t.getRootNode && t.getRootNode();
  if (e.contains(t)) return !0;
  if (n && et(n)) {
    var r = t;
    do {
      if (r && e.isSameNode(r)) return !0;
      r = r.parentNode || r.host;
    } while (r);
  }
  return !1;
}
function G(e) {
  return H(e).getComputedStyle(e);
}
function ft(e) {
  return [`table`, `td`, `th`].indexOf(V(e)) >= 0;
}
function pt(e) {
  return (($e(e) ? e.ownerDocument : e.document) || window.document)
    .documentElement;
}
function mt(e) {
  return V(e) === `html`
    ? e
    : e.assignedSlot || e.parentNode || (et(e) ? e.host : null) || pt(e);
}
function ht(e) {
  return !U(e) || G(e).position === `fixed` ? null : e.offsetParent;
}
function gt(e) {
  var t = /firefox/i.test(st());
  if (/Trident/i.test(st()) && U(e) && G(e).position === `fixed`) return null;
  var n = mt(e);
  for (et(n) && (n = n.host); U(n) && [`html`, `body`].indexOf(V(n)) < 0; ) {
    var r = G(n);
    if (
      r.transform !== `none` ||
      r.perspective !== `none` ||
      r.contain === `paint` ||
      [`transform`, `perspective`].indexOf(r.willChange) !== -1 ||
      (t && r.willChange === `filter`) ||
      (t && r.filter && r.filter !== `none`)
    )
      return n;
    n = n.parentNode;
  }
  return null;
}
function _t(e) {
  for (var t = H(e), n = ht(e); n && ft(n) && G(n).position === `static`; )
    n = ht(n);
  return n &&
    (V(n) === `html` || (V(n) === `body` && G(n).position === `static`))
    ? t
    : n || gt(e) || t;
}
function vt(e) {
  return [`top`, `bottom`].indexOf(e) >= 0 ? `x` : `y`;
}
function yt(e, t, n) {
  return it(e, at(t, n));
}
function bt(e, t, n) {
  var r = yt(e, t, n);
  return r > n ? n : r;
}
function xt() {
  return { top: 0, right: 0, bottom: 0, left: 0 };
}
function St(e) {
  return Object.assign({}, xt(), e);
}
function Ct(e, t) {
  return t.reduce(function (t, n) {
    return ((t[n] = e), t);
  }, {});
}
var wt = function (e, t) {
  return (
    (e =
      typeof e == `function`
        ? e(Object.assign({}, t.rects, { placement: t.placement }))
        : e),
    St(typeof e == `number` ? Ct(e, Fe) : e)
  );
};
function Tt(e) {
  var t,
    n = e.state,
    r = e.name,
    i = e.options,
    a = n.elements.arrow,
    o = n.modifiersData.popperOffsets,
    s = W(n.placement),
    c = vt(s),
    l = [`left`, `right`].indexOf(s) >= 0 ? `height` : `width`;
  if (!(!a || !o)) {
    var u = wt(i.padding, n),
      d = ut(a),
      f = c === `y` ? `top` : B,
      p = c === `y` ? R : z,
      m =
        n.rects.reference[l] + n.rects.reference[c] - o[c] - n.rects.popper[l],
      h = o[c] - n.rects.reference[c],
      g = _t(a),
      _ = g ? (c === `y` ? g.clientHeight || 0 : g.clientWidth || 0) : 0,
      v = m / 2 - h / 2,
      y = u[f],
      b = _ - d[l] - u[p],
      x = _ / 2 - d[l] / 2 + v,
      S = yt(y, x, b),
      C = c;
    n.modifiersData[r] = ((t = {}), (t[C] = S), (t.centerOffset = S - x), t);
  }
}
function Et(e) {
  var t = e.state,
    n = e.options.element,
    r = n === void 0 ? `[data-popper-arrow]` : n;
  r != null &&
    ((typeof r == `string` && ((r = t.elements.popper.querySelector(r)), !r)) ||
      (dt(t.elements.popper, r) && (t.elements.arrow = r)));
}
var Dt = {
  name: `arrow`,
  enabled: !0,
  phase: `main`,
  fn: Tt,
  effect: Et,
  requires: [`popperOffsets`],
  requiresIfExists: [`preventOverflow`],
};
function Ot(e) {
  return e.split(`-`)[1];
}
var kt = { top: `auto`, right: `auto`, bottom: `auto`, left: `auto` };
function At(e, t) {
  var n = e.x,
    r = e.y,
    i = t.devicePixelRatio || 1;
  return { x: ot(n * i) / i || 0, y: ot(r * i) / i || 0 };
}
function jt(e) {
  var t,
    n = e.popper,
    r = e.popperRect,
    i = e.placement,
    a = e.variation,
    o = e.offsets,
    s = e.position,
    c = e.gpuAcceleration,
    l = e.adaptive,
    u = e.roundOffsets,
    d = e.isFixed,
    f = o.x,
    p = f === void 0 ? 0 : f,
    m = o.y,
    h = m === void 0 ? 0 : m,
    g = typeof u == `function` ? u({ x: p, y: h }) : { x: p, y: h };
  ((p = g.x), (h = g.y));
  var _ = o.hasOwnProperty(`x`),
    v = o.hasOwnProperty(`y`),
    y = B,
    b = `top`,
    x = window;
  if (l) {
    var S = _t(n),
      C = `clientHeight`,
      w = `clientWidth`;
    if (
      (S === H(n) &&
        ((S = pt(n)),
        G(S).position !== `static` &&
          s === `absolute` &&
          ((C = `scrollHeight`), (w = `scrollWidth`))),
      (S = S),
      i === `top` || ((i === `left` || i === `right`) && a === `end`))
    ) {
      b = R;
      var T = d && S === x && x.visualViewport ? x.visualViewport.height : S[C];
      ((h -= T - r.height), (h *= c ? 1 : -1));
    }
    if (i === `left` || ((i === `top` || i === `bottom`) && a === `end`)) {
      y = z;
      var E = d && S === x && x.visualViewport ? x.visualViewport.width : S[w];
      ((p -= E - r.width), (p *= c ? 1 : -1));
    }
  }
  var ee = Object.assign({ position: s }, l && kt),
    D = u === !0 ? At({ x: p, y: h }, H(n)) : { x: p, y: h };
  if (((p = D.x), (h = D.y), c)) {
    var O;
    return Object.assign(
      {},
      ee,
      ((O = {}),
      (O[b] = v ? `0` : ``),
      (O[y] = _ ? `0` : ``),
      (O.transform =
        (x.devicePixelRatio || 1) <= 1
          ? `translate(` + p + `px, ` + h + `px)`
          : `translate3d(` + p + `px, ` + h + `px, 0)`),
      O),
    );
  }
  return Object.assign(
    {},
    ee,
    ((t = {}),
    (t[b] = v ? h + `px` : ``),
    (t[y] = _ ? p + `px` : ``),
    (t.transform = ``),
    t),
  );
}
function Mt(e) {
  var t = e.state,
    n = e.options,
    r = n.gpuAcceleration,
    i = r === void 0 ? !0 : r,
    a = n.adaptive,
    o = a === void 0 ? !0 : a,
    s = n.roundOffsets,
    c = s === void 0 ? !0 : s,
    l = {
      placement: W(t.placement),
      variation: Ot(t.placement),
      popper: t.elements.popper,
      popperRect: t.rects.popper,
      gpuAcceleration: i,
      isFixed: t.options.strategy === `fixed`,
    };
  (t.modifiersData.popperOffsets != null &&
    (t.styles.popper = Object.assign(
      {},
      t.styles.popper,
      jt(
        Object.assign({}, l, {
          offsets: t.modifiersData.popperOffsets,
          position: t.options.strategy,
          adaptive: o,
          roundOffsets: c,
        }),
      ),
    )),
    t.modifiersData.arrow != null &&
      (t.styles.arrow = Object.assign(
        {},
        t.styles.arrow,
        jt(
          Object.assign({}, l, {
            offsets: t.modifiersData.arrow,
            position: `absolute`,
            adaptive: !1,
            roundOffsets: c,
          }),
        ),
      )),
    (t.attributes.popper = Object.assign({}, t.attributes.popper, {
      "data-popper-placement": t.placement,
    })));
}
var Nt = {
    name: `computeStyles`,
    enabled: !0,
    phase: `beforeWrite`,
    fn: Mt,
    data: {},
  },
  Pt = { passive: !0 };
function Ft(e) {
  var t = e.state,
    n = e.instance,
    r = e.options,
    i = r.scroll,
    a = i === void 0 ? !0 : i,
    o = r.resize,
    s = o === void 0 ? !0 : o,
    c = H(t.elements.popper),
    l = [].concat(t.scrollParents.reference, t.scrollParents.popper);
  return (
    a &&
      l.forEach(function (e) {
        e.addEventListener(`scroll`, n.update, Pt);
      }),
    s && c.addEventListener(`resize`, n.update, Pt),
    function () {
      (a &&
        l.forEach(function (e) {
          e.removeEventListener(`scroll`, n.update, Pt);
        }),
        s && c.removeEventListener(`resize`, n.update, Pt));
    }
  );
}
var It = {
    name: `eventListeners`,
    enabled: !0,
    phase: `write`,
    fn: function () {},
    effect: Ft,
    data: {},
  },
  Lt = { left: `right`, right: `left`, bottom: `top`, top: `bottom` };
function Rt(e) {
  return e.replace(/left|right|bottom|top/g, function (e) {
    return Lt[e];
  });
}
var zt = { start: `end`, end: `start` };
function Bt(e) {
  return e.replace(/start|end/g, function (e) {
    return zt[e];
  });
}
function Vt(e) {
  var t = H(e);
  return { scrollLeft: t.pageXOffset, scrollTop: t.pageYOffset };
}
function Ht(e) {
  return lt(pt(e)).left + Vt(e).scrollLeft;
}
function Ut(e, t) {
  var n = H(e),
    r = pt(e),
    i = n.visualViewport,
    a = r.clientWidth,
    o = r.clientHeight,
    s = 0,
    c = 0;
  if (i) {
    ((a = i.width), (o = i.height));
    var l = ct();
    (l || (!l && t === `fixed`)) && ((s = i.offsetLeft), (c = i.offsetTop));
  }
  return { width: a, height: o, x: s + Ht(e), y: c };
}
function Wt(e) {
  var t = pt(e),
    n = Vt(e),
    r = e.ownerDocument?.body,
    i = it(
      t.scrollWidth,
      t.clientWidth,
      r ? r.scrollWidth : 0,
      r ? r.clientWidth : 0,
    ),
    a = it(
      t.scrollHeight,
      t.clientHeight,
      r ? r.scrollHeight : 0,
      r ? r.clientHeight : 0,
    ),
    o = -n.scrollLeft + Ht(e),
    s = -n.scrollTop;
  return (
    G(r || t).direction === `rtl` &&
      (o += it(t.clientWidth, r ? r.clientWidth : 0) - i),
    { width: i, height: a, x: o, y: s }
  );
}
function Gt(e) {
  var t = G(e),
    n = t.overflow,
    r = t.overflowX,
    i = t.overflowY;
  return /auto|scroll|overlay|hidden/.test(n + i + r);
}
function Kt(e) {
  return [`html`, `body`, `#document`].indexOf(V(e)) >= 0
    ? e.ownerDocument.body
    : U(e) && Gt(e)
      ? e
      : Kt(mt(e));
}
function qt(e, t) {
  t === void 0 && (t = []);
  var n = Kt(e),
    r = n === e.ownerDocument?.body,
    i = H(n),
    a = r ? [i].concat(i.visualViewport || [], Gt(n) ? n : []) : n,
    o = t.concat(a);
  return r ? o : o.concat(qt(mt(a)));
}
function Jt(e) {
  return Object.assign({}, e, {
    left: e.x,
    top: e.y,
    right: e.x + e.width,
    bottom: e.y + e.height,
  });
}
function Yt(e, t) {
  var n = lt(e, !1, t === `fixed`);
  return (
    (n.top += e.clientTop),
    (n.left += e.clientLeft),
    (n.bottom = n.top + e.clientHeight),
    (n.right = n.left + e.clientWidth),
    (n.width = e.clientWidth),
    (n.height = e.clientHeight),
    (n.x = n.left),
    (n.y = n.top),
    n
  );
}
function Xt(e, t, n) {
  return t === `viewport` ? Jt(Ut(e, n)) : $e(t) ? Yt(t, n) : Jt(Wt(pt(e)));
}
function Zt(e) {
  var t = qt(mt(e)),
    n = [`absolute`, `fixed`].indexOf(G(e).position) >= 0 && U(e) ? _t(e) : e;
  return $e(n)
    ? t.filter(function (e) {
        return $e(e) && dt(e, n) && V(e) !== `body`;
      })
    : [];
}
function Qt(e, t, n, r) {
  var i = t === `clippingParents` ? Zt(e) : [].concat(t),
    a = [].concat(i, [n]),
    o = a[0],
    s = a.reduce(
      function (t, n) {
        var i = Xt(e, n, r);
        return (
          (t.top = it(i.top, t.top)),
          (t.right = at(i.right, t.right)),
          (t.bottom = at(i.bottom, t.bottom)),
          (t.left = it(i.left, t.left)),
          t
        );
      },
      Xt(e, o, r),
    );
  return (
    (s.width = s.right - s.left),
    (s.height = s.bottom - s.top),
    (s.x = s.left),
    (s.y = s.top),
    s
  );
}
function $t(e) {
  var t = e.reference,
    n = e.element,
    r = e.placement,
    i = r ? W(r) : null,
    a = r ? Ot(r) : null,
    o = t.x + t.width / 2 - n.width / 2,
    s = t.y + t.height / 2 - n.height / 2,
    c;
  switch (i) {
    case `top`:
      c = { x: o, y: t.y - n.height };
      break;
    case R:
      c = { x: o, y: t.y + t.height };
      break;
    case z:
      c = { x: t.x + t.width, y: s };
      break;
    case B:
      c = { x: t.x - n.width, y: s };
      break;
    default:
      c = { x: t.x, y: t.y };
  }
  var l = i ? vt(i) : null;
  if (l != null) {
    var u = l === `y` ? `height` : `width`;
    switch (a) {
      case Ie:
        c[l] = c[l] - (t[u] / 2 - n[u] / 2);
        break;
      case `end`:
        c[l] = c[l] + (t[u] / 2 - n[u] / 2);
        break;
      default:
    }
  }
  return c;
}
function en(e, t) {
  t === void 0 && (t = {});
  var n = t,
    r = n.placement,
    i = r === void 0 ? e.placement : r,
    a = n.strategy,
    o = a === void 0 ? e.strategy : a,
    s = n.boundary,
    c = s === void 0 ? Le : s,
    l = n.rootBoundary,
    u = l === void 0 ? Re : l,
    d = n.elementContext,
    f = d === void 0 ? ze : d,
    p = n.altBoundary,
    m = p === void 0 ? !1 : p,
    h = n.padding,
    g = h === void 0 ? 0 : h,
    _ = St(typeof g == `number` ? Ct(g, Fe) : g),
    v = f === `popper` ? Be : ze,
    y = e.rects.popper,
    b = e.elements[m ? v : f],
    x = Qt($e(b) ? b : b.contextElement || pt(e.elements.popper), c, u, o),
    S = lt(e.elements.reference),
    C = $t({ reference: S, element: y, strategy: `absolute`, placement: i }),
    w = Jt(Object.assign({}, y, C)),
    T = f === `popper` ? w : S,
    E = {
      top: x.top - T.top + _.top,
      bottom: T.bottom - x.bottom + _.bottom,
      left: x.left - T.left + _.left,
      right: T.right - x.right + _.right,
    },
    ee = e.modifiersData.offset;
  if (f === `popper` && ee) {
    var D = ee[i];
    Object.keys(E).forEach(function (e) {
      var t = [`right`, `bottom`].indexOf(e) >= 0 ? 1 : -1,
        n = [`top`, `bottom`].indexOf(e) >= 0 ? `y` : `x`;
      E[e] += D[n] * t;
    });
  }
  return E;
}
function tn(e, t) {
  t === void 0 && (t = {});
  var n = t,
    r = n.placement,
    i = n.boundary,
    a = n.rootBoundary,
    o = n.padding,
    s = n.flipVariations,
    c = n.allowedAutoPlacements,
    l = c === void 0 ? He : c,
    u = Ot(r),
    d = u
      ? s
        ? Ve
        : Ve.filter(function (e) {
            return Ot(e) === u;
          })
      : Fe,
    f = d.filter(function (e) {
      return l.indexOf(e) >= 0;
    });
  f.length === 0 && (f = d);
  var p = f.reduce(function (t, n) {
    return (
      (t[n] = en(e, { placement: n, boundary: i, rootBoundary: a, padding: o })[
        W(n)
      ]),
      t
    );
  }, {});
  return Object.keys(p).sort(function (e, t) {
    return p[e] - p[t];
  });
}
function nn(e) {
  if (W(e) === `auto`) return [];
  var t = Rt(e);
  return [Bt(e), t, Bt(t)];
}
function rn(e) {
  var t = e.state,
    n = e.options,
    r = e.name;
  if (!t.modifiersData[r]._skip) {
    for (
      var i = n.mainAxis,
        a = i === void 0 ? !0 : i,
        o = n.altAxis,
        s = o === void 0 ? !0 : o,
        c = n.fallbackPlacements,
        l = n.padding,
        u = n.boundary,
        d = n.rootBoundary,
        f = n.altBoundary,
        p = n.flipVariations,
        m = p === void 0 ? !0 : p,
        h = n.allowedAutoPlacements,
        g = t.options.placement,
        _ = W(g) === g,
        v = c || (_ || !m ? [Rt(g)] : nn(g)),
        y = [g].concat(v).reduce(function (e, n) {
          return e.concat(
            W(n) === `auto`
              ? tn(t, {
                  placement: n,
                  boundary: u,
                  rootBoundary: d,
                  padding: l,
                  flipVariations: m,
                  allowedAutoPlacements: h,
                })
              : n,
          );
        }, []),
        b = t.rects.reference,
        x = t.rects.popper,
        S = new Map(),
        C = !0,
        w = y[0],
        T = 0;
      T < y.length;
      T++
    ) {
      var E = y[T],
        ee = W(E),
        D = Ot(E) === Ie,
        O = [`top`, R].indexOf(ee) >= 0,
        te = O ? `width` : `height`,
        k = en(t, {
          placement: E,
          boundary: u,
          rootBoundary: d,
          altBoundary: f,
          padding: l,
        }),
        A = O ? (D ? z : B) : D ? R : `top`;
      b[te] > x[te] && (A = Rt(A));
      var ne = Rt(A),
        re = [];
      if (
        (a && re.push(k[ee] <= 0),
        s && re.push(k[A] <= 0, k[ne] <= 0),
        re.every(function (e) {
          return e;
        }))
      ) {
        ((w = E), (C = !1));
        break;
      }
      S.set(E, re);
    }
    if (C)
      for (
        var ie = m ? 3 : 1,
          ae = function (e) {
            var t = y.find(function (t) {
              var n = S.get(t);
              if (n)
                return n.slice(0, e).every(function (e) {
                  return e;
                });
            });
            if (t) return ((w = t), `break`);
          },
          oe = ie;
        oe > 0 && ae(oe) !== `break`;
        oe--
      );
    t.placement !== w &&
      ((t.modifiersData[r]._skip = !0), (t.placement = w), (t.reset = !0));
  }
}
var an = {
  name: `flip`,
  enabled: !0,
  phase: `main`,
  fn: rn,
  requiresIfExists: [`offset`],
  data: { _skip: !1 },
};
function on(e, t, n) {
  return (
    n === void 0 && (n = { x: 0, y: 0 }),
    {
      top: e.top - t.height - n.y,
      right: e.right - t.width + n.x,
      bottom: e.bottom - t.height + n.y,
      left: e.left - t.width - n.x,
    }
  );
}
function sn(e) {
  return [`top`, z, R, B].some(function (t) {
    return e[t] >= 0;
  });
}
function cn(e) {
  var t = e.state,
    n = e.name,
    r = t.rects.reference,
    i = t.rects.popper,
    a = t.modifiersData.preventOverflow,
    o = en(t, { elementContext: `reference` }),
    s = en(t, { altBoundary: !0 }),
    c = on(o, r),
    l = on(s, i, a),
    u = sn(c),
    d = sn(l);
  ((t.modifiersData[n] = {
    referenceClippingOffsets: c,
    popperEscapeOffsets: l,
    isReferenceHidden: u,
    hasPopperEscaped: d,
  }),
    (t.attributes.popper = Object.assign({}, t.attributes.popper, {
      "data-popper-reference-hidden": u,
      "data-popper-escaped": d,
    })));
}
var ln = {
  name: `hide`,
  enabled: !0,
  phase: `main`,
  requiresIfExists: [`preventOverflow`],
  fn: cn,
};
function un(e, t, n) {
  var r = W(e),
    i = [`left`, `top`].indexOf(r) >= 0 ? -1 : 1,
    a = typeof n == `function` ? n(Object.assign({}, t, { placement: e })) : n,
    o = a[0],
    s = a[1];
  return (
    (o ||= 0),
    (s = (s || 0) * i),
    [`left`, `right`].indexOf(r) >= 0 ? { x: s, y: o } : { x: o, y: s }
  );
}
function dn(e) {
  var t = e.state,
    n = e.options,
    r = e.name,
    i = n.offset,
    a = i === void 0 ? [0, 0] : i,
    o = He.reduce(function (e, n) {
      return ((e[n] = un(n, t.rects, a)), e);
    }, {}),
    s = o[t.placement],
    c = s.x,
    l = s.y;
  (t.modifiersData.popperOffsets != null &&
    ((t.modifiersData.popperOffsets.x += c),
    (t.modifiersData.popperOffsets.y += l)),
    (t.modifiersData[r] = o));
}
var fn = {
  name: `offset`,
  enabled: !0,
  phase: `main`,
  requires: [`popperOffsets`],
  fn: dn,
};
function pn(e) {
  var t = e.state,
    n = e.name;
  t.modifiersData[n] = $t({
    reference: t.rects.reference,
    element: t.rects.popper,
    strategy: `absolute`,
    placement: t.placement,
  });
}
var mn = {
  name: `popperOffsets`,
  enabled: !0,
  phase: `read`,
  fn: pn,
  data: {},
};
function hn(e) {
  return e === `x` ? `y` : `x`;
}
function gn(e) {
  var t = e.state,
    n = e.options,
    r = e.name,
    i = n.mainAxis,
    a = i === void 0 ? !0 : i,
    o = n.altAxis,
    s = o === void 0 ? !1 : o,
    c = n.boundary,
    l = n.rootBoundary,
    u = n.altBoundary,
    d = n.padding,
    f = n.tether,
    p = f === void 0 ? !0 : f,
    m = n.tetherOffset,
    h = m === void 0 ? 0 : m,
    g = en(t, { boundary: c, rootBoundary: l, padding: d, altBoundary: u }),
    _ = W(t.placement),
    v = Ot(t.placement),
    y = !v,
    b = vt(_),
    x = hn(b),
    S = t.modifiersData.popperOffsets,
    C = t.rects.reference,
    w = t.rects.popper,
    T =
      typeof h == `function`
        ? h(Object.assign({}, t.rects, { placement: t.placement }))
        : h,
    E =
      typeof T == `number`
        ? { mainAxis: T, altAxis: T }
        : Object.assign({ mainAxis: 0, altAxis: 0 }, T),
    ee = t.modifiersData.offset ? t.modifiersData.offset[t.placement] : null,
    D = { x: 0, y: 0 };
  if (S) {
    if (a) {
      var O = b === `y` ? `top` : B,
        te = b === `y` ? R : z,
        k = b === `y` ? `height` : `width`,
        A = S[b],
        ne = A + g[O],
        re = A - g[te],
        ie = p ? -w[k] / 2 : 0,
        ae = v === `start` ? C[k] : w[k],
        oe = v === `start` ? -w[k] : -C[k],
        se = t.elements.arrow,
        ce = p && se ? ut(se) : { width: 0, height: 0 },
        le = t.modifiersData[`arrow#persistent`]
          ? t.modifiersData[`arrow#persistent`].padding
          : xt(),
        ue = le[O],
        de = le[te],
        fe = yt(0, C[k], ce[k]),
        pe = y
          ? C[k] / 2 - ie - fe - ue - E.mainAxis
          : ae - fe - ue - E.mainAxis,
        me = y
          ? -C[k] / 2 + ie + fe + de + E.mainAxis
          : oe + fe + de + E.mainAxis,
        j = t.elements.arrow && _t(t.elements.arrow),
        he = j ? (b === `y` ? j.clientTop || 0 : j.clientLeft || 0) : 0,
        ge = ee?.[b] ?? 0,
        _e = A + pe - ge - he,
        ve = A + me - ge,
        ye = yt(p ? at(ne, _e) : ne, A, p ? it(re, ve) : re);
      ((S[b] = ye), (D[b] = ye - A));
    }
    if (s) {
      var be = b === `x` ? `top` : B,
        xe = b === `x` ? R : z,
        Se = S[x],
        M = x === `y` ? `height` : `width`,
        Ce = Se + g[be],
        we = Se - g[xe],
        N = [`top`, B].indexOf(_) !== -1,
        Te = ee?.[x] ?? 0,
        Ee = N ? Ce : Se - C[M] - w[M] - Te + E.altAxis,
        P = N ? Se + C[M] + w[M] - Te - E.altAxis : we,
        F = p && N ? bt(Ee, Se, P) : yt(p ? Ee : Ce, Se, p ? P : we);
      ((S[x] = F), (D[x] = F - Se));
    }
    t.modifiersData[r] = D;
  }
}
var _n = {
  name: `preventOverflow`,
  enabled: !0,
  phase: `main`,
  fn: gn,
  requiresIfExists: [`offset`],
};
function vn(e) {
  return { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop };
}
function yn(e) {
  return e === H(e) || !U(e) ? Vt(e) : vn(e);
}
function bn(e) {
  var t = e.getBoundingClientRect(),
    n = ot(t.width) / e.offsetWidth || 1,
    r = ot(t.height) / e.offsetHeight || 1;
  return n !== 1 || r !== 1;
}
function xn(e, t, n) {
  n === void 0 && (n = !1);
  var r = U(t),
    i = U(t) && bn(t),
    a = pt(t),
    o = lt(e, i, n),
    s = { scrollLeft: 0, scrollTop: 0 },
    c = { x: 0, y: 0 };
  return (
    (r || (!r && !n)) &&
      ((V(t) !== `body` || Gt(a)) && (s = yn(t)),
      U(t)
        ? ((c = lt(t, !0)), (c.x += t.clientLeft), (c.y += t.clientTop))
        : a && (c.x = Ht(a))),
    {
      x: o.left + s.scrollLeft - c.x,
      y: o.top + s.scrollTop - c.y,
      width: o.width,
      height: o.height,
    }
  );
}
function Sn(e) {
  var t = new Map(),
    n = new Set(),
    r = [];
  e.forEach(function (e) {
    t.set(e.name, e);
  });
  function i(e) {
    (n.add(e.name),
      []
        .concat(e.requires || [], e.requiresIfExists || [])
        .forEach(function (e) {
          if (!n.has(e)) {
            var r = t.get(e);
            r && i(r);
          }
        }),
      r.push(e));
  }
  return (
    e.forEach(function (e) {
      n.has(e.name) || i(e);
    }),
    r
  );
}
function Cn(e) {
  var t = Sn(e);
  return Qe.reduce(function (e, n) {
    return e.concat(
      t.filter(function (e) {
        return e.phase === n;
      }),
    );
  }, []);
}
function wn(e) {
  var t;
  return function () {
    return (
      (t ||= new Promise(function (n) {
        Promise.resolve().then(function () {
          ((t = void 0), n(e()));
        });
      })),
      t
    );
  };
}
function Tn(e) {
  var t = e.reduce(function (e, t) {
    var n = e[t.name];
    return (
      (e[t.name] = n
        ? Object.assign({}, n, t, {
            options: Object.assign({}, n.options, t.options),
            data: Object.assign({}, n.data, t.data),
          })
        : t),
      e
    );
  }, {});
  return Object.keys(t).map(function (e) {
    return t[e];
  });
}
var En = { placement: `bottom`, modifiers: [], strategy: `absolute` };
function Dn() {
  return ![...arguments].some(function (e) {
    return !(e && typeof e.getBoundingClientRect == `function`);
  });
}
function On(e) {
  e === void 0 && (e = {});
  var t = e,
    n = t.defaultModifiers,
    r = n === void 0 ? [] : n,
    i = t.defaultOptions,
    a = i === void 0 ? En : i;
  return function (e, t, n) {
    n === void 0 && (n = a);
    var i = {
        placement: `bottom`,
        orderedModifiers: [],
        options: Object.assign({}, En, a),
        modifiersData: {},
        elements: { reference: e, popper: t },
        attributes: {},
        styles: {},
      },
      o = [],
      s = !1,
      c = {
        state: i,
        setOptions: function (n) {
          var o = typeof n == `function` ? n(i.options) : n;
          (u(),
            (i.options = Object.assign({}, a, i.options, o)),
            (i.scrollParents = {
              reference: $e(e)
                ? qt(e)
                : e.contextElement
                  ? qt(e.contextElement)
                  : [],
              popper: qt(t),
            }));
          var s = Cn(Tn([].concat(r, i.options.modifiers)));
          return (
            (i.orderedModifiers = s.filter(function (e) {
              return e.enabled;
            })),
            l(),
            c.update()
          );
        },
        forceUpdate: function () {
          if (!s) {
            var e = i.elements,
              t = e.reference,
              n = e.popper;
            if (Dn(t, n)) {
              ((i.rects = {
                reference: xn(t, _t(n), i.options.strategy === `fixed`),
                popper: ut(n),
              }),
                (i.reset = !1),
                (i.placement = i.options.placement),
                i.orderedModifiers.forEach(function (e) {
                  return (i.modifiersData[e.name] = Object.assign({}, e.data));
                }));
              for (var r = 0; r < i.orderedModifiers.length; r++) {
                if (i.reset === !0) {
                  ((i.reset = !1), (r = -1));
                  continue;
                }
                var a = i.orderedModifiers[r],
                  o = a.fn,
                  l = a.options,
                  u = l === void 0 ? {} : l,
                  d = a.name;
                typeof o == `function` &&
                  (i = o({ state: i, options: u, name: d, instance: c }) || i);
              }
            }
          }
        },
        update: wn(function () {
          return new Promise(function (e) {
            (c.forceUpdate(), e(i));
          });
        }),
        destroy: function () {
          (u(), (s = !0));
        },
      };
    if (!Dn(e, t)) return c;
    c.setOptions(n).then(function (e) {
      !s && n.onFirstUpdate && n.onFirstUpdate(e);
    });
    function l() {
      i.orderedModifiers.forEach(function (e) {
        var t = e.name,
          n = e.options,
          r = n === void 0 ? {} : n,
          a = e.effect;
        if (typeof a == `function`) {
          var s = a({ state: i, name: t, instance: c, options: r });
          o.push(s || function () {});
        }
      });
    }
    function u() {
      (o.forEach(function (e) {
        return e();
      }),
        (o = []));
    }
    return c;
  };
}
var kn = On(),
  An = On({ defaultModifiers: [It, mn, Nt, rt] }),
  jn = On({ defaultModifiers: [It, mn, Nt, rt, fn, an, _n, Dt, ln] }),
  Mn = s({
    afterMain: () => Je,
    afterRead: () => Ge,
    afterWrite: () => Ze,
    applyStyles: () => rt,
    arrow: () => Dt,
    auto: () => Pe,
    basePlacements: () => Fe,
    beforeMain: () => Ke,
    beforeRead: () => Ue,
    beforeWrite: () => Ye,
    bottom: () => R,
    clippingParents: () => Le,
    computeStyles: () => Nt,
    createPopper: () => jn,
    createPopperBase: () => kn,
    createPopperLite: () => An,
    detectOverflow: () => en,
    end: () => `end`,
    eventListeners: () => It,
    flip: () => an,
    hide: () => ln,
    left: () => B,
    main: () => qe,
    modifierPhases: () => Qe,
    offset: () => fn,
    placements: () => He,
    popper: () => ze,
    popperGenerator: () => On,
    popperOffsets: () => mn,
    preventOverflow: () => _n,
    read: () => We,
    reference: () => Be,
    right: () => z,
    start: () => Ie,
    top: () => `top`,
    variationPlacements: () => Ve,
    viewport: () => Re,
    write: () => Xe,
  }),
  Nn = s({
    Alert: () => Mr,
    Button: () => zr,
    Carousel: () => Fi,
    Collapse: () => na,
    Dropdown: () => Ba,
    Modal: () => No,
    Offcanvas: () => ts,
    Popover: () => Us,
    ScrollSpy: () => sc,
    Tab: () => Ic,
    Toast: () => $c,
    Tooltip: () => Ls,
  }),
  Pn = new Map(),
  Fn = {
    set(e, t, n) {
      Pn.has(e) || Pn.set(e, new Map());
      let r = Pn.get(e);
      if (!r.has(t) && r.size !== 0) {
        console.error(
          `Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(r.keys())[0]}.`,
        );
        return;
      }
      r.set(t, n);
    },
    get(e, t) {
      return (Pn.has(e) && Pn.get(e).get(t)) || null;
    },
    remove(e, t) {
      if (!Pn.has(e)) return;
      let n = Pn.get(e);
      (n.delete(t), n.size === 0 && Pn.delete(e));
    },
  },
  In = 1e6,
  Ln = 1e3,
  Rn = `transitionend`,
  zn = (e) => (
    e &&
      window.CSS &&
      window.CSS.escape &&
      (e = e.replace(/#([^\s"#']+)/g, (e, t) => `#${CSS.escape(t)}`)),
    e
  ),
  Bn = (e) =>
    e == null
      ? `${e}`
      : Object.prototype.toString
          .call(e)
          .match(/\s([a-z]+)/i)[1]
          .toLowerCase(),
  Vn = (e) => {
    do e += Math.floor(Math.random() * In);
    while (document.getElementById(e));
    return e;
  },
  Hn = (e) => {
    if (!e) return 0;
    let { transitionDuration: t, transitionDelay: n } =
      window.getComputedStyle(e);
    return !Number.parseFloat(t) && !Number.parseFloat(n)
      ? 0
      : ((t = t.split(`,`)[0]),
        (n = n.split(`,`)[0]),
        (Number.parseFloat(t) + Number.parseFloat(n)) * Ln);
  },
  Un = (e) => {
    e.dispatchEvent(new Event(Rn));
  },
  K = (e) =>
    !e || typeof e != `object`
      ? !1
      : (e.jquery !== void 0 && (e = e[0]), e.nodeType !== void 0),
  Wn = (e) =>
    K(e)
      ? e.jquery
        ? e[0]
        : e
      : typeof e == `string` && e.length > 0
        ? document.querySelector(zn(e))
        : null,
  Gn = (e) => {
    if (!K(e) || e.getClientRects().length === 0) return !1;
    let t = getComputedStyle(e).getPropertyValue(`visibility`) === `visible`,
      n = e.closest(`details:not([open])`);
    if (!n) return t;
    if (n !== e) {
      let t = e.closest(`summary`);
      if ((t && t.parentNode !== n) || t === null) return !1;
    }
    return t;
  },
  Kn = (e) =>
    !e || e.nodeType !== Node.ELEMENT_NODE || e.classList.contains(`disabled`)
      ? !0
      : e.disabled === void 0
        ? e.hasAttribute(`disabled`) && e.getAttribute(`disabled`) !== `false`
        : e.disabled,
  qn = (e) => {
    if (!document.documentElement.attachShadow) return null;
    if (typeof e.getRootNode == `function`) {
      let t = e.getRootNode();
      return t instanceof ShadowRoot ? t : null;
    }
    return e instanceof ShadowRoot ? e : e.parentNode ? qn(e.parentNode) : null;
  },
  Jn = () => {},
  Yn = (e) => {
    e.offsetHeight;
  },
  Xn = () =>
    window.jQuery && !document.body.hasAttribute(`data-bs-no-jquery`)
      ? window.jQuery
      : null,
  Zn = [],
  Qn = (e) => {
    document.readyState === `loading`
      ? (Zn.length ||
          document.addEventListener(`DOMContentLoaded`, () => {
            for (let e of Zn) e();
          }),
        Zn.push(e))
      : e();
  },
  q = () => document.documentElement.dir === `rtl`,
  J = (e) => {
    Qn(() => {
      let t = Xn();
      if (t) {
        let n = e.NAME,
          r = t.fn[n];
        ((t.fn[n] = e.jQueryInterface),
          (t.fn[n].Constructor = e),
          (t.fn[n].noConflict = () => ((t.fn[n] = r), e.jQueryInterface)));
      }
    });
  },
  Y = (e, t = [], n = e) => (typeof e == `function` ? e.call(...t) : n),
  $n = (e, t, n = !0) => {
    if (!n) {
      Y(e);
      return;
    }
    let r = Hn(t) + 5,
      i = !1,
      a = ({ target: n }) => {
        n === t && ((i = !0), t.removeEventListener(Rn, a), Y(e));
      };
    (t.addEventListener(Rn, a),
      setTimeout(() => {
        i || Un(t);
      }, r));
  },
  er = (e, t, n, r) => {
    let i = e.length,
      a = e.indexOf(t);
    return a === -1
      ? !n && r
        ? e[i - 1]
        : e[0]
      : ((a += n ? 1 : -1),
        r && (a = (a + i) % i),
        e[Math.max(0, Math.min(a, i - 1))]);
  },
  tr = /[^.]*(?=\..*)\.|.*/,
  nr = /\..*/,
  rr = /::\d+$/,
  ir = {},
  ar = 1,
  or = { mouseenter: `mouseover`, mouseleave: `mouseout` },
  sr = new Set(
    `click.dblclick.mouseup.mousedown.contextmenu.mousewheel.DOMMouseScroll.mouseover.mouseout.mousemove.selectstart.selectend.keydown.keypress.keyup.orientationchange.touchstart.touchmove.touchend.touchcancel.pointerdown.pointermove.pointerup.pointerleave.pointercancel.gesturestart.gesturechange.gestureend.focus.blur.change.reset.select.submit.focusin.focusout.load.unload.beforeunload.resize.move.DOMContentLoaded.readystatechange.error.abort.scroll`.split(
      `.`,
    ),
  );
function cr(e, t) {
  return (t && `${t}::${ar++}`) || e.uidEvent || ar++;
}
function lr(e) {
  let t = cr(e);
  return ((e.uidEvent = t), (ir[t] = ir[t] || {}), ir[t]);
}
function ur(e, t) {
  return function n(r) {
    return (
      vr(r, { delegateTarget: e }),
      n.oneOff && X.off(e, r.type, t),
      t.apply(e, [r])
    );
  };
}
function dr(e, t, n) {
  return function r(i) {
    let a = e.querySelectorAll(t);
    for (let { target: o } = i; o && o !== this; o = o.parentNode)
      for (let s of a)
        if (s === o)
          return (
            vr(i, { delegateTarget: o }),
            r.oneOff && X.off(e, i.type, t, n),
            n.apply(o, [i])
          );
  };
}
function fr(e, t, n = null) {
  return Object.values(e).find(
    (e) => e.callable === t && e.delegationSelector === n,
  );
}
function pr(e, t, n) {
  let r = typeof t == `string`,
    i = r ? n : t || n,
    a = _r(e);
  return (sr.has(a) || (a = e), [r, i, a]);
}
function mr(e, t, n, r, i) {
  if (typeof t != `string` || !e) return;
  let [a, o, s] = pr(t, n, r);
  t in or &&
    (o = ((e) =>
      function (t) {
        if (
          !t.relatedTarget ||
          (t.relatedTarget !== t.delegateTarget &&
            !t.delegateTarget.contains(t.relatedTarget))
        )
          return e.call(this, t);
      })(o));
  let c = lr(e),
    l = c[s] || (c[s] = {}),
    u = fr(l, o, a ? n : null);
  if (u) {
    u.oneOff = u.oneOff && i;
    return;
  }
  let d = cr(o, t.replace(tr, ``)),
    f = a ? dr(e, n, o) : ur(e, o);
  ((f.delegationSelector = a ? n : null),
    (f.callable = o),
    (f.oneOff = i),
    (f.uidEvent = d),
    (l[d] = f),
    e.addEventListener(s, f, a));
}
function hr(e, t, n, r, i) {
  let a = fr(t[n], r, i);
  a && (e.removeEventListener(n, a, !!i), delete t[n][a.uidEvent]);
}
function gr(e, t, n, r) {
  let i = t[n] || {};
  for (let [a, o] of Object.entries(i))
    a.includes(r) && hr(e, t, n, o.callable, o.delegationSelector);
}
function _r(e) {
  return ((e = e.replace(nr, ``)), or[e] || e);
}
var X = {
  on(e, t, n, r) {
    mr(e, t, n, r, !1);
  },
  one(e, t, n, r) {
    mr(e, t, n, r, !0);
  },
  off(e, t, n, r) {
    if (typeof t != `string` || !e) return;
    let [i, a, o] = pr(t, n, r),
      s = o !== t,
      c = lr(e),
      l = c[o] || {},
      u = t.startsWith(`.`);
    if (a !== void 0) {
      if (!Object.keys(l).length) return;
      hr(e, c, o, a, i ? n : null);
      return;
    }
    if (u) for (let n of Object.keys(c)) gr(e, c, n, t.slice(1));
    for (let [n, r] of Object.entries(l)) {
      let i = n.replace(rr, ``);
      (!s || t.includes(i)) && hr(e, c, o, r.callable, r.delegationSelector);
    }
  },
  trigger(e, t, n) {
    if (typeof t != `string` || !e) return null;
    let r = Xn(),
      i = t !== _r(t),
      a = null,
      o = !0,
      s = !0,
      c = !1;
    i &&
      r &&
      ((a = r.Event(t, n)),
      r(e).trigger(a),
      (o = !a.isPropagationStopped()),
      (s = !a.isImmediatePropagationStopped()),
      (c = a.isDefaultPrevented()));
    let l = vr(new Event(t, { bubbles: o, cancelable: !0 }), n);
    return (
      c && l.preventDefault(),
      s && e.dispatchEvent(l),
      l.defaultPrevented && a && a.preventDefault(),
      l
    );
  },
};
function vr(e, t = {}) {
  for (let [n, r] of Object.entries(t))
    try {
      e[n] = r;
    } catch {
      Object.defineProperty(e, n, {
        configurable: !0,
        get() {
          return r;
        },
      });
    }
  return e;
}
function yr(e) {
  if (e === `true`) return !0;
  if (e === `false`) return !1;
  if (e === Number(e).toString()) return Number(e);
  if (e === `` || e === `null`) return null;
  if (typeof e != `string`) return e;
  try {
    return JSON.parse(decodeURIComponent(e));
  } catch {
    return e;
  }
}
function br(e) {
  return e.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`);
}
var xr = {
    setDataAttribute(e, t, n) {
      e.setAttribute(`data-bs-${br(t)}`, n);
    },
    removeDataAttribute(e, t) {
      e.removeAttribute(`data-bs-${br(t)}`);
    },
    getDataAttributes(e) {
      if (!e) return {};
      let t = {},
        n = Object.keys(e.dataset).filter(
          (e) => e.startsWith(`bs`) && !e.startsWith(`bsConfig`),
        );
      for (let r of n) {
        let n = r.replace(/^bs/, ``);
        ((n = n.charAt(0).toLowerCase() + n.slice(1)),
          (t[n] = yr(e.dataset[r])));
      }
      return t;
    },
    getDataAttribute(e, t) {
      return yr(e.getAttribute(`data-bs-${br(t)}`));
    },
  },
  Sr = class {
    static get Default() {
      return {};
    }
    static get DefaultType() {
      return {};
    }
    static get NAME() {
      throw Error(
        `You have to implement the static method "NAME", for each component!`,
      );
    }
    _getConfig(e) {
      return (
        (e = this._mergeConfigObj(e)),
        (e = this._configAfterMerge(e)),
        this._typeCheckConfig(e),
        e
      );
    }
    _configAfterMerge(e) {
      return e;
    }
    _mergeConfigObj(e, t) {
      let n = K(t) ? xr.getDataAttribute(t, `config`) : {};
      return {
        ...this.constructor.Default,
        ...(typeof n == `object` ? n : {}),
        ...(K(t) ? xr.getDataAttributes(t) : {}),
        ...(typeof e == `object` ? e : {}),
      };
    }
    _typeCheckConfig(e, t = this.constructor.DefaultType) {
      for (let [n, r] of Object.entries(t)) {
        let t = e[n],
          i = K(t) ? `element` : Bn(t);
        if (!new RegExp(r).test(i))
          throw TypeError(
            `${this.constructor.NAME.toUpperCase()}: Option "${n}" provided type "${i}" but expected type "${r}".`,
          );
      }
    }
  },
  Cr = `5.3.8`,
  Z = class extends Sr {
    constructor(e, t) {
      (super(),
        (e = Wn(e)),
        e &&
          ((this._element = e),
          (this._config = this._getConfig(t)),
          Fn.set(this._element, this.constructor.DATA_KEY, this)));
    }
    dispose() {
      (Fn.remove(this._element, this.constructor.DATA_KEY),
        X.off(this._element, this.constructor.EVENT_KEY));
      for (let e of Object.getOwnPropertyNames(this)) this[e] = null;
    }
    _queueCallback(e, t, n = !0) {
      $n(e, t, n);
    }
    _getConfig(e) {
      return (
        (e = this._mergeConfigObj(e, this._element)),
        (e = this._configAfterMerge(e)),
        this._typeCheckConfig(e),
        e
      );
    }
    static getInstance(e) {
      return Fn.get(Wn(e), this.DATA_KEY);
    }
    static getOrCreateInstance(e, t = {}) {
      return (
        this.getInstance(e) || new this(e, typeof t == `object` ? t : null)
      );
    }
    static get VERSION() {
      return Cr;
    }
    static get DATA_KEY() {
      return `bs.${this.NAME}`;
    }
    static get EVENT_KEY() {
      return `.${this.DATA_KEY}`;
    }
    static eventName(e) {
      return `${e}${this.EVENT_KEY}`;
    }
  },
  wr = (e) => {
    let t = e.getAttribute(`data-bs-target`);
    if (!t || t === `#`) {
      let n = e.getAttribute(`href`);
      if (!n || (!n.includes(`#`) && !n.startsWith(`.`))) return null;
      (n.includes(`#`) && !n.startsWith(`#`) && (n = `#${n.split(`#`)[1]}`),
        (t = n && n !== `#` ? n.trim() : null));
    }
    return t
      ? t
          .split(`,`)
          .map((e) => zn(e))
          .join(`,`)
      : null;
  },
  Q = {
    find(e, t = document.documentElement) {
      return [].concat(...Element.prototype.querySelectorAll.call(t, e));
    },
    findOne(e, t = document.documentElement) {
      return Element.prototype.querySelector.call(t, e);
    },
    children(e, t) {
      return [].concat(...e.children).filter((e) => e.matches(t));
    },
    parents(e, t) {
      let n = [],
        r = e.parentNode.closest(t);
      for (; r; ) (n.push(r), (r = r.parentNode.closest(t)));
      return n;
    },
    prev(e, t) {
      let n = e.previousElementSibling;
      for (; n; ) {
        if (n.matches(t)) return [n];
        n = n.previousElementSibling;
      }
      return [];
    },
    next(e, t) {
      let n = e.nextElementSibling;
      for (; n; ) {
        if (n.matches(t)) return [n];
        n = n.nextElementSibling;
      }
      return [];
    },
    focusableChildren(e) {
      let t = [
        `a`,
        `button`,
        `input`,
        `textarea`,
        `select`,
        `details`,
        `[tabindex]`,
        `[contenteditable="true"]`,
      ]
        .map((e) => `${e}:not([tabindex^="-"])`)
        .join(`,`);
      return this.find(t, e).filter((e) => !Kn(e) && Gn(e));
    },
    getSelectorFromElement(e) {
      let t = wr(e);
      return t && Q.findOne(t) ? t : null;
    },
    getElementFromSelector(e) {
      let t = wr(e);
      return t ? Q.findOne(t) : null;
    },
    getMultipleElementsFromSelector(e) {
      let t = wr(e);
      return t ? Q.find(t) : [];
    },
  },
  Tr = (e, t = `hide`) => {
    let n = `click.dismiss${e.EVENT_KEY}`,
      r = e.NAME;
    X.on(document, n, `[data-bs-dismiss="${r}"]`, function (n) {
      if (
        ([`A`, `AREA`].includes(this.tagName) && n.preventDefault(), Kn(this))
      )
        return;
      let i = Q.getElementFromSelector(this) || this.closest(`.${r}`);
      e.getOrCreateInstance(i)[t]();
    });
  },
  Er = `alert`,
  Dr = `.bs.alert`,
  Or = `close${Dr}`,
  kr = `closed${Dr}`,
  Ar = `fade`,
  jr = `show`,
  Mr = class e extends Z {
    static get NAME() {
      return Er;
    }
    close() {
      if (X.trigger(this._element, Or).defaultPrevented) return;
      this._element.classList.remove(jr);
      let e = this._element.classList.contains(Ar);
      this._queueCallback(() => this._destroyElement(), this._element, e);
    }
    _destroyElement() {
      (this._element.remove(), X.trigger(this._element, kr), this.dispose());
    }
    static jQueryInterface(t) {
      return this.each(function () {
        let n = e.getOrCreateInstance(this);
        if (typeof t == `string`) {
          if (n[t] === void 0 || t.startsWith(`_`) || t === `constructor`)
            throw TypeError(`No method named "${t}"`);
          n[t](this);
        }
      });
    }
  };
(Tr(Mr, `close`), J(Mr));
var Nr = `button`,
  Pr = `.bs.button`,
  Fr = `.data-api`,
  Ir = `active`,
  Lr = `[data-bs-toggle="button"]`,
  Rr = `click${Pr}${Fr}`,
  zr = class e extends Z {
    static get NAME() {
      return Nr;
    }
    toggle() {
      this._element.setAttribute(
        `aria-pressed`,
        this._element.classList.toggle(Ir),
      );
    }
    static jQueryInterface(t) {
      return this.each(function () {
        let n = e.getOrCreateInstance(this);
        t === `toggle` && n[t]();
      });
    }
  };
(X.on(document, Rr, Lr, (e) => {
  e.preventDefault();
  let t = e.target.closest(Lr);
  zr.getOrCreateInstance(t).toggle();
}),
  J(zr));
var Br = `swipe`,
  Vr = `.bs.swipe`,
  Hr = `touchstart${Vr}`,
  Ur = `touchmove${Vr}`,
  Wr = `touchend${Vr}`,
  Gr = `pointerdown${Vr}`,
  Kr = `pointerup${Vr}`,
  qr = `touch`,
  Jr = `pen`,
  Yr = `pointer-event`,
  Xr = 40,
  Zr = { endCallback: null, leftCallback: null, rightCallback: null },
  Qr = {
    endCallback: `(function|null)`,
    leftCallback: `(function|null)`,
    rightCallback: `(function|null)`,
  },
  $r = class e extends Sr {
    constructor(t, n) {
      (super(),
        (this._element = t),
        !(!t || !e.isSupported()) &&
          ((this._config = this._getConfig(n)),
          (this._deltaX = 0),
          (this._supportPointerEvents = !!window.PointerEvent),
          this._initEvents()));
    }
    static get Default() {
      return Zr;
    }
    static get DefaultType() {
      return Qr;
    }
    static get NAME() {
      return Br;
    }
    dispose() {
      X.off(this._element, Vr);
    }
    _start(e) {
      if (!this._supportPointerEvents) {
        this._deltaX = e.touches[0].clientX;
        return;
      }
      this._eventIsPointerPenTouch(e) && (this._deltaX = e.clientX);
    }
    _end(e) {
      (this._eventIsPointerPenTouch(e) &&
        (this._deltaX = e.clientX - this._deltaX),
        this._handleSwipe(),
        Y(this._config.endCallback));
    }
    _move(e) {
      this._deltaX =
        e.touches && e.touches.length > 1
          ? 0
          : e.touches[0].clientX - this._deltaX;
    }
    _handleSwipe() {
      let e = Math.abs(this._deltaX);
      if (e <= Xr) return;
      let t = e / this._deltaX;
      ((this._deltaX = 0),
        t && Y(t > 0 ? this._config.rightCallback : this._config.leftCallback));
    }
    _initEvents() {
      this._supportPointerEvents
        ? (X.on(this._element, Gr, (e) => this._start(e)),
          X.on(this._element, Kr, (e) => this._end(e)),
          this._element.classList.add(Yr))
        : (X.on(this._element, Hr, (e) => this._start(e)),
          X.on(this._element, Ur, (e) => this._move(e)),
          X.on(this._element, Wr, (e) => this._end(e)));
    }
    _eventIsPointerPenTouch(e) {
      return (
        this._supportPointerEvents &&
        (e.pointerType === Jr || e.pointerType === qr)
      );
    }
    static isSupported() {
      return (
        `ontouchstart` in document.documentElement ||
        navigator.maxTouchPoints > 0
      );
    }
  },
  ei = `carousel`,
  ti = `.bs.carousel`,
  ni = `.data-api`,
  ri = `ArrowLeft`,
  ii = `ArrowRight`,
  ai = 500,
  oi = `next`,
  si = `prev`,
  ci = `left`,
  li = `right`,
  ui = `slide${ti}`,
  di = `slid${ti}`,
  fi = `keydown${ti}`,
  pi = `mouseenter${ti}`,
  mi = `mouseleave${ti}`,
  hi = `dragstart${ti}`,
  gi = `load${ti}${ni}`,
  _i = `click${ti}${ni}`,
  vi = `carousel`,
  yi = `active`,
  bi = `slide`,
  xi = `carousel-item-end`,
  Si = `carousel-item-start`,
  Ci = `carousel-item-next`,
  wi = `carousel-item-prev`,
  Ti = `.active`,
  Ei = `.carousel-item`,
  Di = `.active.carousel-item`,
  Oi = `.carousel-item img`,
  ki = `.carousel-indicators`,
  Ai = `[data-bs-slide], [data-bs-slide-to]`,
  ji = `[data-bs-ride="carousel"]`,
  Mi = { [ri]: li, [ii]: ci },
  Ni = {
    interval: 5e3,
    keyboard: !0,
    pause: `hover`,
    ride: !1,
    touch: !0,
    wrap: !0,
  },
  Pi = {
    interval: `(number|boolean)`,
    keyboard: `boolean`,
    pause: `(string|boolean)`,
    ride: `(boolean|string)`,
    touch: `boolean`,
    wrap: `boolean`,
  },
  Fi = class e extends Z {
    constructor(e, t) {
      (super(e, t),
        (this._interval = null),
        (this._activeElement = null),
        (this._isSliding = !1),
        (this.touchTimeout = null),
        (this._swipeHelper = null),
        (this._indicatorsElement = Q.findOne(ki, this._element)),
        this._addEventListeners(),
        this._config.ride === vi && this.cycle());
    }
    static get Default() {
      return Ni;
    }
    static get DefaultType() {
      return Pi;
    }
    static get NAME() {
      return ei;
    }
    next() {
      this._slide(oi);
    }
    nextWhenVisible() {
      !document.hidden && Gn(this._element) && this.next();
    }
    prev() {
      this._slide(si);
    }
    pause() {
      (this._isSliding && Un(this._element), this._clearInterval());
    }
    cycle() {
      (this._clearInterval(),
        this._updateInterval(),
        (this._interval = setInterval(
          () => this.nextWhenVisible(),
          this._config.interval,
        )));
    }
    _maybeEnableCycle() {
      if (this._config.ride) {
        if (this._isSliding) {
          X.one(this._element, di, () => this.cycle());
          return;
        }
        this.cycle();
      }
    }
    to(e) {
      let t = this._getItems();
      if (e > t.length - 1 || e < 0) return;
      if (this._isSliding) {
        X.one(this._element, di, () => this.to(e));
        return;
      }
      let n = this._getItemIndex(this._getActive());
      if (n === e) return;
      let r = e > n ? oi : si;
      this._slide(r, t[e]);
    }
    dispose() {
      (this._swipeHelper && this._swipeHelper.dispose(), super.dispose());
    }
    _configAfterMerge(e) {
      return ((e.defaultInterval = e.interval), e);
    }
    _addEventListeners() {
      (this._config.keyboard &&
        X.on(this._element, fi, (e) => this._keydown(e)),
        this._config.pause === `hover` &&
          (X.on(this._element, pi, () => this.pause()),
          X.on(this._element, mi, () => this._maybeEnableCycle())),
        this._config.touch &&
          $r.isSupported() &&
          this._addTouchEventListeners());
    }
    _addTouchEventListeners() {
      for (let e of Q.find(Oi, this._element))
        X.on(e, hi, (e) => e.preventDefault());
      let e = {
        leftCallback: () => this._slide(this._directionToOrder(ci)),
        rightCallback: () => this._slide(this._directionToOrder(li)),
        endCallback: () => {
          this._config.pause === `hover` &&
            (this.pause(),
            this.touchTimeout && clearTimeout(this.touchTimeout),
            (this.touchTimeout = setTimeout(
              () => this._maybeEnableCycle(),
              ai + this._config.interval,
            )));
        },
      };
      this._swipeHelper = new $r(this._element, e);
    }
    _keydown(e) {
      if (/input|textarea/i.test(e.target.tagName)) return;
      let t = Mi[e.key];
      t && (e.preventDefault(), this._slide(this._directionToOrder(t)));
    }
    _getItemIndex(e) {
      return this._getItems().indexOf(e);
    }
    _setActiveIndicatorElement(e) {
      if (!this._indicatorsElement) return;
      let t = Q.findOne(Ti, this._indicatorsElement);
      (t.classList.remove(yi), t.removeAttribute(`aria-current`));
      let n = Q.findOne(`[data-bs-slide-to="${e}"]`, this._indicatorsElement);
      n && (n.classList.add(yi), n.setAttribute(`aria-current`, `true`));
    }
    _updateInterval() {
      let e = this._activeElement || this._getActive();
      if (!e) return;
      let t = Number.parseInt(e.getAttribute(`data-bs-interval`), 10);
      this._config.interval = t || this._config.defaultInterval;
    }
    _slide(e, t = null) {
      if (this._isSliding) return;
      let n = this._getActive(),
        r = e === oi,
        i = t || er(this._getItems(), n, r, this._config.wrap);
      if (i === n) return;
      let a = this._getItemIndex(i),
        o = (t) =>
          X.trigger(this._element, t, {
            relatedTarget: i,
            direction: this._orderToDirection(e),
            from: this._getItemIndex(n),
            to: a,
          });
      if (o(ui).defaultPrevented || !n || !i) return;
      let s = !!this._interval;
      (this.pause(),
        (this._isSliding = !0),
        this._setActiveIndicatorElement(a),
        (this._activeElement = i));
      let c = r ? Si : xi,
        l = r ? Ci : wi;
      (i.classList.add(l),
        Yn(i),
        n.classList.add(c),
        i.classList.add(c),
        this._queueCallback(
          () => {
            (i.classList.remove(c, l),
              i.classList.add(yi),
              n.classList.remove(yi, l, c),
              (this._isSliding = !1),
              o(di));
          },
          n,
          this._isAnimated(),
        ),
        s && this.cycle());
    }
    _isAnimated() {
      return this._element.classList.contains(bi);
    }
    _getActive() {
      return Q.findOne(Di, this._element);
    }
    _getItems() {
      return Q.find(Ei, this._element);
    }
    _clearInterval() {
      this._interval &&= (clearInterval(this._interval), null);
    }
    _directionToOrder(e) {
      return q() ? (e === ci ? si : oi) : e === ci ? oi : si;
    }
    _orderToDirection(e) {
      return q() ? (e === si ? ci : li) : e === si ? li : ci;
    }
    static jQueryInterface(t) {
      return this.each(function () {
        let n = e.getOrCreateInstance(this, t);
        if (typeof t == `number`) {
          n.to(t);
          return;
        }
        if (typeof t == `string`) {
          if (n[t] === void 0 || t.startsWith(`_`) || t === `constructor`)
            throw TypeError(`No method named "${t}"`);
          n[t]();
        }
      });
    }
  };
(X.on(document, _i, Ai, function (e) {
  let t = Q.getElementFromSelector(this);
  if (!t || !t.classList.contains(vi)) return;
  e.preventDefault();
  let n = Fi.getOrCreateInstance(t),
    r = this.getAttribute(`data-bs-slide-to`);
  if (r) {
    (n.to(r), n._maybeEnableCycle());
    return;
  }
  if (xr.getDataAttribute(this, `slide`) === `next`) {
    (n.next(), n._maybeEnableCycle());
    return;
  }
  (n.prev(), n._maybeEnableCycle());
}),
  X.on(window, gi, () => {
    let e = Q.find(ji);
    for (let t of e) Fi.getOrCreateInstance(t);
  }),
  J(Fi));
var Ii = `collapse`,
  Li = `.bs.collapse`,
  Ri = `.data-api`,
  zi = `show${Li}`,
  Bi = `shown${Li}`,
  Vi = `hide${Li}`,
  Hi = `hidden${Li}`,
  Ui = `click${Li}${Ri}`,
  Wi = `show`,
  Gi = `collapse`,
  Ki = `collapsing`,
  qi = `collapsed`,
  Ji = `:scope .${Gi} .${Gi}`,
  Yi = `collapse-horizontal`,
  Xi = `width`,
  Zi = `height`,
  Qi = `.collapse.show, .collapse.collapsing`,
  $i = `[data-bs-toggle="collapse"]`,
  ea = { parent: null, toggle: !0 },
  ta = { parent: `(null|element)`, toggle: `boolean` },
  na = class e extends Z {
    constructor(e, t) {
      (super(e, t), (this._isTransitioning = !1), (this._triggerArray = []));
      let n = Q.find($i);
      for (let e of n) {
        let t = Q.getSelectorFromElement(e),
          n = Q.find(t).filter((e) => e === this._element);
        t !== null && n.length && this._triggerArray.push(e);
      }
      (this._initializeChildren(),
        this._config.parent ||
          this._addAriaAndCollapsedClass(this._triggerArray, this._isShown()),
        this._config.toggle && this.toggle());
    }
    static get Default() {
      return ea;
    }
    static get DefaultType() {
      return ta;
    }
    static get NAME() {
      return Ii;
    }
    toggle() {
      this._isShown() ? this.hide() : this.show();
    }
    show() {
      if (this._isTransitioning || this._isShown()) return;
      let t = [];
      if (
        (this._config.parent &&
          (t = this._getFirstLevelChildren(Qi)
            .filter((e) => e !== this._element)
            .map((t) => e.getOrCreateInstance(t, { toggle: !1 }))),
        (t.length && t[0]._isTransitioning) ||
          X.trigger(this._element, zi).defaultPrevented)
      )
        return;
      for (let e of t) e.hide();
      let n = this._getDimension();
      (this._element.classList.remove(Gi),
        this._element.classList.add(Ki),
        (this._element.style[n] = 0),
        this._addAriaAndCollapsedClass(this._triggerArray, !0),
        (this._isTransitioning = !0));
      let r = () => {
          ((this._isTransitioning = !1),
            this._element.classList.remove(Ki),
            this._element.classList.add(Gi, Wi),
            (this._element.style[n] = ``),
            X.trigger(this._element, Bi));
        },
        i = `scroll${n[0].toUpperCase() + n.slice(1)}`;
      (this._queueCallback(r, this._element, !0),
        (this._element.style[n] = `${this._element[i]}px`));
    }
    hide() {
      if (
        this._isTransitioning ||
        !this._isShown() ||
        X.trigger(this._element, Vi).defaultPrevented
      )
        return;
      let e = this._getDimension();
      ((this._element.style[e] =
        `${this._element.getBoundingClientRect()[e]}px`),
        Yn(this._element),
        this._element.classList.add(Ki),
        this._element.classList.remove(Gi, Wi));
      for (let e of this._triggerArray) {
        let t = Q.getElementFromSelector(e);
        t && !this._isShown(t) && this._addAriaAndCollapsedClass([e], !1);
      }
      this._isTransitioning = !0;
      let t = () => {
        ((this._isTransitioning = !1),
          this._element.classList.remove(Ki),
          this._element.classList.add(Gi),
          X.trigger(this._element, Hi));
      };
      ((this._element.style[e] = ``),
        this._queueCallback(t, this._element, !0));
    }
    _isShown(e = this._element) {
      return e.classList.contains(Wi);
    }
    _configAfterMerge(e) {
      return ((e.toggle = !!e.toggle), (e.parent = Wn(e.parent)), e);
    }
    _getDimension() {
      return this._element.classList.contains(Yi) ? Xi : Zi;
    }
    _initializeChildren() {
      if (!this._config.parent) return;
      let e = this._getFirstLevelChildren($i);
      for (let t of e) {
        let e = Q.getElementFromSelector(t);
        e && this._addAriaAndCollapsedClass([t], this._isShown(e));
      }
    }
    _getFirstLevelChildren(e) {
      let t = Q.find(Ji, this._config.parent);
      return Q.find(e, this._config.parent).filter((e) => !t.includes(e));
    }
    _addAriaAndCollapsedClass(e, t) {
      if (e.length)
        for (let n of e)
          (n.classList.toggle(qi, !t), n.setAttribute(`aria-expanded`, t));
    }
    static jQueryInterface(t) {
      let n = {};
      return (
        typeof t == `string` && /show|hide/.test(t) && (n.toggle = !1),
        this.each(function () {
          let r = e.getOrCreateInstance(this, n);
          if (typeof t == `string`) {
            if (r[t] === void 0) throw TypeError(`No method named "${t}"`);
            r[t]();
          }
        })
      );
    }
  };
(X.on(document, Ui, $i, function (e) {
  (e.target.tagName === `A` ||
    (e.delegateTarget && e.delegateTarget.tagName === `A`)) &&
    e.preventDefault();
  for (let e of Q.getMultipleElementsFromSelector(this))
    na.getOrCreateInstance(e, { toggle: !1 }).toggle();
}),
  J(na));
var ra = `dropdown`,
  ia = `.bs.dropdown`,
  aa = `.data-api`,
  oa = `Escape`,
  sa = `Tab`,
  ca = `ArrowUp`,
  la = `ArrowDown`,
  ua = 2,
  da = `hide${ia}`,
  fa = `hidden${ia}`,
  pa = `show${ia}`,
  ma = `shown${ia}`,
  ha = `click${ia}${aa}`,
  ga = `keydown${ia}${aa}`,
  _a = `keyup${ia}${aa}`,
  va = `show`,
  ya = `dropup`,
  ba = `dropend`,
  xa = `dropstart`,
  Sa = `dropup-center`,
  Ca = `dropdown-center`,
  wa = `[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)`,
  Ta = `${wa}.${va}`,
  Ea = `.dropdown-menu`,
  Da = `.navbar`,
  Oa = `.navbar-nav`,
  ka = `.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)`,
  Aa = q() ? `top-end` : `top-start`,
  ja = q() ? `top-start` : `top-end`,
  Ma = q() ? `bottom-end` : `bottom-start`,
  Na = q() ? `bottom-start` : `bottom-end`,
  Pa = q() ? `left-start` : `right-start`,
  Fa = q() ? `right-start` : `left-start`,
  Ia = `top`,
  La = `bottom`,
  Ra = {
    autoClose: !0,
    boundary: `clippingParents`,
    display: `dynamic`,
    offset: [0, 2],
    popperConfig: null,
    reference: `toggle`,
  },
  za = {
    autoClose: `(boolean|string)`,
    boundary: `(string|element)`,
    display: `string`,
    offset: `(array|string|function)`,
    popperConfig: `(null|object|function)`,
    reference: `(string|element|object)`,
  },
  Ba = class e extends Z {
    constructor(e, t) {
      (super(e, t),
        (this._popper = null),
        (this._parent = this._element.parentNode),
        (this._menu =
          Q.next(this._element, Ea)[0] ||
          Q.prev(this._element, Ea)[0] ||
          Q.findOne(Ea, this._parent)),
        (this._inNavbar = this._detectNavbar()));
    }
    static get Default() {
      return Ra;
    }
    static get DefaultType() {
      return za;
    }
    static get NAME() {
      return ra;
    }
    toggle() {
      return this._isShown() ? this.hide() : this.show();
    }
    show() {
      if (Kn(this._element) || this._isShown()) return;
      let e = { relatedTarget: this._element };
      if (!X.trigger(this._element, pa, e).defaultPrevented) {
        if (
          (this._createPopper(),
          `ontouchstart` in document.documentElement &&
            !this._parent.closest(Oa))
        )
          for (let e of [].concat(...document.body.children))
            X.on(e, `mouseover`, Jn);
        (this._element.focus(),
          this._element.setAttribute(`aria-expanded`, !0),
          this._menu.classList.add(va),
          this._element.classList.add(va),
          X.trigger(this._element, ma, e));
      }
    }
    hide() {
      if (Kn(this._element) || !this._isShown()) return;
      let e = { relatedTarget: this._element };
      this._completeHide(e);
    }
    dispose() {
      (this._popper && this._popper.destroy(), super.dispose());
    }
    update() {
      ((this._inNavbar = this._detectNavbar()),
        this._popper && this._popper.update());
    }
    _completeHide(e) {
      if (!X.trigger(this._element, da, e).defaultPrevented) {
        if (`ontouchstart` in document.documentElement)
          for (let e of [].concat(...document.body.children))
            X.off(e, `mouseover`, Jn);
        (this._popper && this._popper.destroy(),
          this._menu.classList.remove(va),
          this._element.classList.remove(va),
          this._element.setAttribute(`aria-expanded`, `false`),
          xr.removeDataAttribute(this._menu, `popper`),
          X.trigger(this._element, fa, e));
      }
    }
    _getConfig(e) {
      if (
        ((e = super._getConfig(e)),
        typeof e.reference == `object` &&
          !K(e.reference) &&
          typeof e.reference.getBoundingClientRect != `function`)
      )
        throw TypeError(
          `${ra.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`,
        );
      return e;
    }
    _createPopper() {
      if (Mn === void 0)
        throw TypeError(
          `Bootstrap's dropdowns require Popper (https://popper.js.org/docs/v2/)`,
        );
      let e = this._element;
      this._config.reference === `parent`
        ? (e = this._parent)
        : K(this._config.reference)
          ? (e = Wn(this._config.reference))
          : typeof this._config.reference == `object` &&
            (e = this._config.reference);
      let t = this._getPopperConfig();
      this._popper = jn(e, this._menu, t);
    }
    _isShown() {
      return this._menu.classList.contains(va);
    }
    _getPlacement() {
      let e = this._parent;
      if (e.classList.contains(ba)) return Pa;
      if (e.classList.contains(xa)) return Fa;
      if (e.classList.contains(Sa)) return Ia;
      if (e.classList.contains(Ca)) return La;
      let t =
        getComputedStyle(this._menu)
          .getPropertyValue(`--bs-position`)
          .trim() === `end`;
      return e.classList.contains(ya) ? (t ? ja : Aa) : t ? Na : Ma;
    }
    _detectNavbar() {
      return this._element.closest(Da) !== null;
    }
    _getOffset() {
      let { offset: e } = this._config;
      return typeof e == `string`
        ? e.split(`,`).map((e) => Number.parseInt(e, 10))
        : typeof e == `function`
          ? (t) => e(t, this._element)
          : e;
    }
    _getPopperConfig() {
      let e = {
        placement: this._getPlacement(),
        modifiers: [
          {
            name: `preventOverflow`,
            options: { boundary: this._config.boundary },
          },
          { name: `offset`, options: { offset: this._getOffset() } },
        ],
      };
      return (
        (this._inNavbar || this._config.display === `static`) &&
          (xr.setDataAttribute(this._menu, `popper`, `static`),
          (e.modifiers = [{ name: `applyStyles`, enabled: !1 }])),
        { ...e, ...Y(this._config.popperConfig, [void 0, e]) }
      );
    }
    _selectMenuItem({ key: e, target: t }) {
      let n = Q.find(ka, this._menu).filter((e) => Gn(e));
      n.length && er(n, t, e === la, !n.includes(t)).focus();
    }
    static jQueryInterface(t) {
      return this.each(function () {
        let n = e.getOrCreateInstance(this, t);
        if (typeof t == `string`) {
          if (n[t] === void 0) throw TypeError(`No method named "${t}"`);
          n[t]();
        }
      });
    }
    static clearMenus(t) {
      if (t.button === ua || (t.type === `keyup` && t.key !== sa)) return;
      let n = Q.find(Ta);
      for (let r of n) {
        let n = e.getInstance(r);
        if (!n || n._config.autoClose === !1) continue;
        let i = t.composedPath(),
          a = i.includes(n._menu);
        if (
          i.includes(n._element) ||
          (n._config.autoClose === `inside` && !a) ||
          (n._config.autoClose === `outside` && a) ||
          (n._menu.contains(t.target) &&
            ((t.type === `keyup` && t.key === sa) ||
              /input|select|option|textarea|form/i.test(t.target.tagName)))
        )
          continue;
        let o = { relatedTarget: n._element };
        (t.type === `click` && (o.clickEvent = t), n._completeHide(o));
      }
    }
    static dataApiKeydownHandler(t) {
      let n = /input|textarea/i.test(t.target.tagName),
        r = t.key === oa,
        i = [ca, la].includes(t.key);
      if ((!i && !r) || (n && !r)) return;
      t.preventDefault();
      let a = this.matches(wa)
          ? this
          : Q.prev(this, wa)[0] ||
            Q.next(this, wa)[0] ||
            Q.findOne(wa, t.delegateTarget.parentNode),
        o = e.getOrCreateInstance(a);
      if (i) {
        (t.stopPropagation(), o.show(), o._selectMenuItem(t));
        return;
      }
      o._isShown() && (t.stopPropagation(), o.hide(), a.focus());
    }
  };
(X.on(document, ga, wa, Ba.dataApiKeydownHandler),
  X.on(document, ga, Ea, Ba.dataApiKeydownHandler),
  X.on(document, ha, Ba.clearMenus),
  X.on(document, _a, Ba.clearMenus),
  X.on(document, ha, wa, function (e) {
    (e.preventDefault(), Ba.getOrCreateInstance(this).toggle());
  }),
  J(Ba));
var Va = `backdrop`,
  Ha = `fade`,
  Ua = `show`,
  Wa = `mousedown.bs.${Va}`,
  Ga = {
    className: `modal-backdrop`,
    clickCallback: null,
    isAnimated: !1,
    isVisible: !0,
    rootElement: `body`,
  },
  Ka = {
    className: `string`,
    clickCallback: `(function|null)`,
    isAnimated: `boolean`,
    isVisible: `boolean`,
    rootElement: `(element|string)`,
  },
  qa = class extends Sr {
    constructor(e) {
      (super(),
        (this._config = this._getConfig(e)),
        (this._isAppended = !1),
        (this._element = null));
    }
    static get Default() {
      return Ga;
    }
    static get DefaultType() {
      return Ka;
    }
    static get NAME() {
      return Va;
    }
    show(e) {
      if (!this._config.isVisible) {
        Y(e);
        return;
      }
      this._append();
      let t = this._getElement();
      (this._config.isAnimated && Yn(t),
        t.classList.add(Ua),
        this._emulateAnimation(() => {
          Y(e);
        }));
    }
    hide(e) {
      if (!this._config.isVisible) {
        Y(e);
        return;
      }
      (this._getElement().classList.remove(Ua),
        this._emulateAnimation(() => {
          (this.dispose(), Y(e));
        }));
    }
    dispose() {
      this._isAppended &&=
        (X.off(this._element, Wa), this._element.remove(), !1);
    }
    _getElement() {
      if (!this._element) {
        let e = document.createElement(`div`);
        ((e.className = this._config.className),
          this._config.isAnimated && e.classList.add(Ha),
          (this._element = e));
      }
      return this._element;
    }
    _configAfterMerge(e) {
      return ((e.rootElement = Wn(e.rootElement)), e);
    }
    _append() {
      if (this._isAppended) return;
      let e = this._getElement();
      (this._config.rootElement.append(e),
        X.on(e, Wa, () => {
          Y(this._config.clickCallback);
        }),
        (this._isAppended = !0));
    }
    _emulateAnimation(e) {
      $n(e, this._getElement(), this._config.isAnimated);
    }
  },
  Ja = `focustrap`,
  Ya = `.bs.focustrap`,
  Xa = `focusin${Ya}`,
  Za = `keydown.tab${Ya}`,
  Qa = `Tab`,
  $a = `forward`,
  eo = `backward`,
  to = { autofocus: !0, trapElement: null },
  no = { autofocus: `boolean`, trapElement: `element` },
  ro = class extends Sr {
    constructor(e) {
      (super(),
        (this._config = this._getConfig(e)),
        (this._isActive = !1),
        (this._lastTabNavDirection = null));
    }
    static get Default() {
      return to;
    }
    static get DefaultType() {
      return no;
    }
    static get NAME() {
      return Ja;
    }
    activate() {
      this._isActive ||=
        (this._config.autofocus && this._config.trapElement.focus(),
        X.off(document, Ya),
        X.on(document, Xa, (e) => this._handleFocusin(e)),
        X.on(document, Za, (e) => this._handleKeydown(e)),
        !0);
    }
    deactivate() {
      this._isActive && ((this._isActive = !1), X.off(document, Ya));
    }
    _handleFocusin(e) {
      let { trapElement: t } = this._config;
      if (e.target === document || e.target === t || t.contains(e.target))
        return;
      let n = Q.focusableChildren(t);
      n.length === 0
        ? t.focus()
        : this._lastTabNavDirection === eo
          ? n[n.length - 1].focus()
          : n[0].focus();
    }
    _handleKeydown(e) {
      e.key === Qa && (this._lastTabNavDirection = e.shiftKey ? eo : $a);
    }
  },
  io = `.fixed-top, .fixed-bottom, .is-fixed, .sticky-top`,
  ao = `.sticky-top`,
  oo = `padding-right`,
  so = `margin-right`,
  co = class {
    constructor() {
      this._element = document.body;
    }
    getWidth() {
      let e = document.documentElement.clientWidth;
      return Math.abs(window.innerWidth - e);
    }
    hide() {
      let e = this.getWidth();
      (this._disableOverFlow(),
        this._setElementAttributes(this._element, oo, (t) => t + e),
        this._setElementAttributes(io, oo, (t) => t + e),
        this._setElementAttributes(ao, so, (t) => t - e));
    }
    reset() {
      (this._resetElementAttributes(this._element, `overflow`),
        this._resetElementAttributes(this._element, oo),
        this._resetElementAttributes(io, oo),
        this._resetElementAttributes(ao, so));
    }
    isOverflowing() {
      return this.getWidth() > 0;
    }
    _disableOverFlow() {
      (this._saveInitialAttribute(this._element, `overflow`),
        (this._element.style.overflow = `hidden`));
    }
    _setElementAttributes(e, t, n) {
      let r = this.getWidth();
      this._applyManipulationCallback(e, (e) => {
        if (e !== this._element && window.innerWidth > e.clientWidth + r)
          return;
        this._saveInitialAttribute(e, t);
        let i = window.getComputedStyle(e).getPropertyValue(t);
        e.style.setProperty(t, `${n(Number.parseFloat(i))}px`);
      });
    }
    _saveInitialAttribute(e, t) {
      let n = e.style.getPropertyValue(t);
      n && xr.setDataAttribute(e, t, n);
    }
    _resetElementAttributes(e, t) {
      this._applyManipulationCallback(e, (e) => {
        let n = xr.getDataAttribute(e, t);
        if (n === null) {
          e.style.removeProperty(t);
          return;
        }
        (xr.removeDataAttribute(e, t), e.style.setProperty(t, n));
      });
    }
    _applyManipulationCallback(e, t) {
      if (K(e)) {
        t(e);
        return;
      }
      for (let n of Q.find(e, this._element)) t(n);
    }
  },
  lo = `modal`,
  $ = `.bs.modal`,
  uo = `.data-api`,
  fo = `Escape`,
  po = `hide${$}`,
  mo = `hidePrevented${$}`,
  ho = `hidden${$}`,
  go = `show${$}`,
  _o = `shown${$}`,
  vo = `resize${$}`,
  yo = `click.dismiss${$}`,
  bo = `mousedown.dismiss${$}`,
  xo = `keydown.dismiss${$}`,
  So = `click${$}${uo}`,
  Co = `modal-open`,
  wo = `fade`,
  To = `show`,
  Eo = `modal-static`,
  Do = `.modal.show`,
  Oo = `.modal-dialog`,
  ko = `.modal-body`,
  Ao = `[data-bs-toggle="modal"]`,
  jo = { backdrop: !0, focus: !0, keyboard: !0 },
  Mo = { backdrop: `(boolean|string)`, focus: `boolean`, keyboard: `boolean` },
  No = class e extends Z {
    constructor(e, t) {
      (super(e, t),
        (this._dialog = Q.findOne(Oo, this._element)),
        (this._backdrop = this._initializeBackDrop()),
        (this._focustrap = this._initializeFocusTrap()),
        (this._isShown = !1),
        (this._isTransitioning = !1),
        (this._scrollBar = new co()),
        this._addEventListeners());
    }
    static get Default() {
      return jo;
    }
    static get DefaultType() {
      return Mo;
    }
    static get NAME() {
      return lo;
    }
    toggle(e) {
      return this._isShown ? this.hide() : this.show(e);
    }
    show(e) {
      this._isShown ||
        this._isTransitioning ||
        X.trigger(this._element, go, { relatedTarget: e }).defaultPrevented ||
        ((this._isShown = !0),
        (this._isTransitioning = !0),
        this._scrollBar.hide(),
        document.body.classList.add(Co),
        this._adjustDialog(),
        this._backdrop.show(() => this._showElement(e)));
    }
    hide() {
      !this._isShown ||
        this._isTransitioning ||
        X.trigger(this._element, po).defaultPrevented ||
        ((this._isShown = !1),
        (this._isTransitioning = !0),
        this._focustrap.deactivate(),
        this._element.classList.remove(To),
        this._queueCallback(
          () => this._hideModal(),
          this._element,
          this._isAnimated(),
        ));
    }
    dispose() {
      (X.off(window, $),
        X.off(this._dialog, $),
        this._backdrop.dispose(),
        this._focustrap.deactivate(),
        super.dispose());
    }
    handleUpdate() {
      this._adjustDialog();
    }
    _initializeBackDrop() {
      return new qa({
        isVisible: !!this._config.backdrop,
        isAnimated: this._isAnimated(),
      });
    }
    _initializeFocusTrap() {
      return new ro({ trapElement: this._element });
    }
    _showElement(e) {
      (document.body.contains(this._element) ||
        document.body.append(this._element),
        (this._element.style.display = `block`),
        this._element.removeAttribute(`aria-hidden`),
        this._element.setAttribute(`aria-modal`, !0),
        this._element.setAttribute(`role`, `dialog`),
        (this._element.scrollTop = 0));
      let t = Q.findOne(ko, this._dialog);
      (t && (t.scrollTop = 0),
        Yn(this._element),
        this._element.classList.add(To),
        this._queueCallback(
          () => {
            (this._config.focus && this._focustrap.activate(),
              (this._isTransitioning = !1),
              X.trigger(this._element, _o, { relatedTarget: e }));
          },
          this._dialog,
          this._isAnimated(),
        ));
    }
    _addEventListeners() {
      (X.on(this._element, xo, (e) => {
        if (e.key === fo) {
          if (this._config.keyboard) {
            this.hide();
            return;
          }
          this._triggerBackdropTransition();
        }
      }),
        X.on(window, vo, () => {
          this._isShown && !this._isTransitioning && this._adjustDialog();
        }),
        X.on(this._element, bo, (e) => {
          X.one(this._element, yo, (t) => {
            if (!(this._element !== e.target || this._element !== t.target)) {
              if (this._config.backdrop === `static`) {
                this._triggerBackdropTransition();
                return;
              }
              this._config.backdrop && this.hide();
            }
          });
        }));
    }
    _hideModal() {
      ((this._element.style.display = `none`),
        this._element.setAttribute(`aria-hidden`, !0),
        this._element.removeAttribute(`aria-modal`),
        this._element.removeAttribute(`role`),
        (this._isTransitioning = !1),
        this._backdrop.hide(() => {
          (document.body.classList.remove(Co),
            this._resetAdjustments(),
            this._scrollBar.reset(),
            X.trigger(this._element, ho));
        }));
    }
    _isAnimated() {
      return this._element.classList.contains(wo);
    }
    _triggerBackdropTransition() {
      if (X.trigger(this._element, mo).defaultPrevented) return;
      let e =
          this._element.scrollHeight > document.documentElement.clientHeight,
        t = this._element.style.overflowY;
      t === `hidden` ||
        this._element.classList.contains(Eo) ||
        (e || (this._element.style.overflowY = `hidden`),
        this._element.classList.add(Eo),
        this._queueCallback(() => {
          (this._element.classList.remove(Eo),
            this._queueCallback(() => {
              this._element.style.overflowY = t;
            }, this._dialog));
        }, this._dialog),
        this._element.focus());
    }
    _adjustDialog() {
      let e =
          this._element.scrollHeight > document.documentElement.clientHeight,
        t = this._scrollBar.getWidth(),
        n = t > 0;
      if (n && !e) {
        let e = q() ? `paddingLeft` : `paddingRight`;
        this._element.style[e] = `${t}px`;
      }
      if (!n && e) {
        let e = q() ? `paddingRight` : `paddingLeft`;
        this._element.style[e] = `${t}px`;
      }
    }
    _resetAdjustments() {
      ((this._element.style.paddingLeft = ``),
        (this._element.style.paddingRight = ``));
    }
    static jQueryInterface(t, n) {
      return this.each(function () {
        let r = e.getOrCreateInstance(this, t);
        if (typeof t == `string`) {
          if (r[t] === void 0) throw TypeError(`No method named "${t}"`);
          r[t](n);
        }
      });
    }
  };
(X.on(document, So, Ao, function (e) {
  let t = Q.getElementFromSelector(this);
  ([`A`, `AREA`].includes(this.tagName) && e.preventDefault(),
    X.one(t, go, (e) => {
      e.defaultPrevented ||
        X.one(t, ho, () => {
          Gn(this) && this.focus();
        });
    }));
  let n = Q.findOne(Do);
  (n && No.getInstance(n).hide(), No.getOrCreateInstance(t).toggle(this));
}),
  Tr(No),
  J(No));
var Po = `offcanvas`,
  Fo = `.bs.offcanvas`,
  Io = `.data-api`,
  Lo = `load${Fo}${Io}`,
  Ro = `Escape`,
  zo = `show`,
  Bo = `showing`,
  Vo = `hiding`,
  Ho = `offcanvas-backdrop`,
  Uo = `.offcanvas.show`,
  Wo = `show${Fo}`,
  Go = `shown${Fo}`,
  Ko = `hide${Fo}`,
  qo = `hidePrevented${Fo}`,
  Jo = `hidden${Fo}`,
  Yo = `resize${Fo}`,
  Xo = `click${Fo}${Io}`,
  Zo = `keydown.dismiss${Fo}`,
  Qo = `[data-bs-toggle="offcanvas"]`,
  $o = { backdrop: !0, keyboard: !0, scroll: !1 },
  es = { backdrop: `(boolean|string)`, keyboard: `boolean`, scroll: `boolean` },
  ts = class e extends Z {
    constructor(e, t) {
      (super(e, t),
        (this._isShown = !1),
        (this._backdrop = this._initializeBackDrop()),
        (this._focustrap = this._initializeFocusTrap()),
        this._addEventListeners());
    }
    static get Default() {
      return $o;
    }
    static get DefaultType() {
      return es;
    }
    static get NAME() {
      return Po;
    }
    toggle(e) {
      return this._isShown ? this.hide() : this.show(e);
    }
    show(e) {
      this._isShown ||
        X.trigger(this._element, Wo, { relatedTarget: e }).defaultPrevented ||
        ((this._isShown = !0),
        this._backdrop.show(),
        this._config.scroll || new co().hide(),
        this._element.setAttribute(`aria-modal`, !0),
        this._element.setAttribute(`role`, `dialog`),
        this._element.classList.add(Bo),
        this._queueCallback(
          () => {
            ((!this._config.scroll || this._config.backdrop) &&
              this._focustrap.activate(),
              this._element.classList.add(zo),
              this._element.classList.remove(Bo),
              X.trigger(this._element, Go, { relatedTarget: e }));
          },
          this._element,
          !0,
        ));
    }
    hide() {
      !this._isShown ||
        X.trigger(this._element, Ko).defaultPrevented ||
        (this._focustrap.deactivate(),
        this._element.blur(),
        (this._isShown = !1),
        this._element.classList.add(Vo),
        this._backdrop.hide(),
        this._queueCallback(
          () => {
            (this._element.classList.remove(zo, Vo),
              this._element.removeAttribute(`aria-modal`),
              this._element.removeAttribute(`role`),
              this._config.scroll || new co().reset(),
              X.trigger(this._element, Jo));
          },
          this._element,
          !0,
        ));
    }
    dispose() {
      (this._backdrop.dispose(), this._focustrap.deactivate(), super.dispose());
    }
    _initializeBackDrop() {
      let e = () => {
          if (this._config.backdrop === `static`) {
            X.trigger(this._element, qo);
            return;
          }
          this.hide();
        },
        t = !!this._config.backdrop;
      return new qa({
        className: Ho,
        isVisible: t,
        isAnimated: !0,
        rootElement: this._element.parentNode,
        clickCallback: t ? e : null,
      });
    }
    _initializeFocusTrap() {
      return new ro({ trapElement: this._element });
    }
    _addEventListeners() {
      X.on(this._element, Zo, (e) => {
        if (e.key === Ro) {
          if (this._config.keyboard) {
            this.hide();
            return;
          }
          X.trigger(this._element, qo);
        }
      });
    }
    static jQueryInterface(t) {
      return this.each(function () {
        let n = e.getOrCreateInstance(this, t);
        if (typeof t == `string`) {
          if (n[t] === void 0 || t.startsWith(`_`) || t === `constructor`)
            throw TypeError(`No method named "${t}"`);
          n[t](this);
        }
      });
    }
  };
(X.on(document, Xo, Qo, function (e) {
  let t = Q.getElementFromSelector(this);
  if (([`A`, `AREA`].includes(this.tagName) && e.preventDefault(), Kn(this)))
    return;
  X.one(t, Jo, () => {
    Gn(this) && this.focus();
  });
  let n = Q.findOne(Uo);
  (n && n !== t && ts.getInstance(n).hide(),
    ts.getOrCreateInstance(t).toggle(this));
}),
  X.on(window, Lo, () => {
    for (let e of Q.find(Uo)) ts.getOrCreateInstance(e).show();
  }),
  X.on(window, Yo, () => {
    for (let e of Q.find(`[aria-modal][class*=show][class*=offcanvas-]`))
      getComputedStyle(e).position !== `fixed` &&
        ts.getOrCreateInstance(e).hide();
  }),
  Tr(ts),
  J(ts));
var ns = {
    "*": [`class`, `dir`, `id`, `lang`, `role`, /^aria-[\w-]*$/i],
    a: [`target`, `href`, `title`, `rel`],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    dd: [],
    div: [],
    dl: [],
    dt: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: [`src`, `srcset`, `alt`, `title`, `width`, `height`],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: [],
  },
  rs = new Set([
    `background`,
    `cite`,
    `href`,
    `itemtype`,
    `longdesc`,
    `poster`,
    `src`,
    `xlink:href`,
  ]),
  is = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i,
  as = (e, t) => {
    let n = e.nodeName.toLowerCase();
    return t.includes(n)
      ? rs.has(n)
        ? !!is.test(e.nodeValue)
        : !0
      : t.filter((e) => e instanceof RegExp).some((e) => e.test(n));
  };
function os(e, t, n) {
  if (!e.length) return e;
  if (n && typeof n == `function`) return n(e);
  let r = new window.DOMParser().parseFromString(e, `text/html`),
    i = [].concat(...r.body.querySelectorAll(`*`));
  for (let e of i) {
    let n = e.nodeName.toLowerCase();
    if (!Object.keys(t).includes(n)) {
      e.remove();
      continue;
    }
    let r = [].concat(...e.attributes),
      i = [].concat(t[`*`] || [], t[n] || []);
    for (let t of r) as(t, i) || e.removeAttribute(t.nodeName);
  }
  return r.body.innerHTML;
}
var ss = `TemplateFactory`,
  cs = {
    allowList: ns,
    content: {},
    extraClass: ``,
    html: !1,
    sanitize: !0,
    sanitizeFn: null,
    template: `<div></div>`,
  },
  ls = {
    allowList: `object`,
    content: `object`,
    extraClass: `(string|function)`,
    html: `boolean`,
    sanitize: `boolean`,
    sanitizeFn: `(null|function)`,
    template: `string`,
  },
  us = {
    entry: `(string|element|function|null)`,
    selector: `(string|element)`,
  },
  ds = class extends Sr {
    constructor(e) {
      (super(), (this._config = this._getConfig(e)));
    }
    static get Default() {
      return cs;
    }
    static get DefaultType() {
      return ls;
    }
    static get NAME() {
      return ss;
    }
    getContent() {
      return Object.values(this._config.content)
        .map((e) => this._resolvePossibleFunction(e))
        .filter(Boolean);
    }
    hasContent() {
      return this.getContent().length > 0;
    }
    changeContent(e) {
      return (
        this._checkContent(e),
        (this._config.content = { ...this._config.content, ...e }),
        this
      );
    }
    toHtml() {
      let e = document.createElement(`div`);
      e.innerHTML = this._maybeSanitize(this._config.template);
      for (let [t, n] of Object.entries(this._config.content))
        this._setContent(e, n, t);
      let t = e.children[0],
        n = this._resolvePossibleFunction(this._config.extraClass);
      return (n && t.classList.add(...n.split(` `)), t);
    }
    _typeCheckConfig(e) {
      (super._typeCheckConfig(e), this._checkContent(e.content));
    }
    _checkContent(e) {
      for (let [t, n] of Object.entries(e))
        super._typeCheckConfig({ selector: t, entry: n }, us);
    }
    _setContent(e, t, n) {
      let r = Q.findOne(n, e);
      if (r) {
        if (((t = this._resolvePossibleFunction(t)), !t)) {
          r.remove();
          return;
        }
        if (K(t)) {
          this._putElementInTemplate(Wn(t), r);
          return;
        }
        if (this._config.html) {
          r.innerHTML = this._maybeSanitize(t);
          return;
        }
        r.textContent = t;
      }
    }
    _maybeSanitize(e) {
      return this._config.sanitize
        ? os(e, this._config.allowList, this._config.sanitizeFn)
        : e;
    }
    _resolvePossibleFunction(e) {
      return Y(e, [void 0, this]);
    }
    _putElementInTemplate(e, t) {
      if (this._config.html) {
        ((t.innerHTML = ``), t.append(e));
        return;
      }
      t.textContent = e.textContent;
    }
  },
  fs = `tooltip`,
  ps = new Set([`sanitize`, `allowList`, `sanitizeFn`]),
  ms = `fade`,
  hs = `modal`,
  gs = `show`,
  _s = `.tooltip-inner`,
  vs = `.${hs}`,
  ys = `hide.bs.modal`,
  bs = `hover`,
  xs = `focus`,
  Ss = `click`,
  Cs = `manual`,
  ws = `hide`,
  Ts = `hidden`,
  Es = `show`,
  Ds = `shown`,
  Os = `inserted`,
  ks = `click`,
  As = `focusin`,
  js = `focusout`,
  Ms = `mouseenter`,
  Ns = `mouseleave`,
  Ps = {
    AUTO: `auto`,
    TOP: `top`,
    RIGHT: q() ? `left` : `right`,
    BOTTOM: `bottom`,
    LEFT: q() ? `right` : `left`,
  },
  Fs = {
    allowList: ns,
    animation: !0,
    boundary: `clippingParents`,
    container: !1,
    customClass: ``,
    delay: 0,
    fallbackPlacements: [`top`, `right`, `bottom`, `left`],
    html: !1,
    offset: [0, 6],
    placement: `top`,
    popperConfig: null,
    sanitize: !0,
    sanitizeFn: null,
    selector: !1,
    template: `<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>`,
    title: ``,
    trigger: `hover focus`,
  },
  Is = {
    allowList: `object`,
    animation: `boolean`,
    boundary: `(string|element)`,
    container: `(string|element|boolean)`,
    customClass: `(string|function)`,
    delay: `(number|object)`,
    fallbackPlacements: `array`,
    html: `boolean`,
    offset: `(array|string|function)`,
    placement: `(string|function)`,
    popperConfig: `(null|object|function)`,
    sanitize: `boolean`,
    sanitizeFn: `(null|function)`,
    selector: `(string|boolean)`,
    template: `string`,
    title: `(string|element|function)`,
    trigger: `string`,
  },
  Ls = class e extends Z {
    constructor(e, t) {
      if (Mn === void 0)
        throw TypeError(
          `Bootstrap's tooltips require Popper (https://popper.js.org/docs/v2/)`,
        );
      (super(e, t),
        (this._isEnabled = !0),
        (this._timeout = 0),
        (this._isHovered = null),
        (this._activeTrigger = {}),
        (this._popper = null),
        (this._templateFactory = null),
        (this._newContent = null),
        (this.tip = null),
        this._setListeners(),
        this._config.selector || this._fixTitle());
    }
    static get Default() {
      return Fs;
    }
    static get DefaultType() {
      return Is;
    }
    static get NAME() {
      return fs;
    }
    enable() {
      this._isEnabled = !0;
    }
    disable() {
      this._isEnabled = !1;
    }
    toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    }
    toggle() {
      if (this._isEnabled) {
        if (this._isShown()) {
          this._leave();
          return;
        }
        this._enter();
      }
    }
    dispose() {
      (clearTimeout(this._timeout),
        X.off(this._element.closest(vs), ys, this._hideModalHandler),
        this._element.getAttribute(`data-bs-original-title`) &&
          this._element.setAttribute(
            `title`,
            this._element.getAttribute(`data-bs-original-title`),
          ),
        this._disposePopper(),
        super.dispose());
    }
    show() {
      if (this._element.style.display === `none`)
        throw Error(`Please use show on visible elements`);
      if (!(this._isWithContent() && this._isEnabled)) return;
      let e = X.trigger(this._element, this.constructor.eventName(Es)),
        t = (
          qn(this._element) || this._element.ownerDocument.documentElement
        ).contains(this._element);
      if (e.defaultPrevented || !t) return;
      this._disposePopper();
      let n = this._getTipElement();
      this._element.setAttribute(`aria-describedby`, n.getAttribute(`id`));
      let { container: r } = this._config;
      if (
        (this._element.ownerDocument.documentElement.contains(this.tip) ||
          (r.append(n),
          X.trigger(this._element, this.constructor.eventName(Os))),
        (this._popper = this._createPopper(n)),
        n.classList.add(gs),
        `ontouchstart` in document.documentElement)
      )
        for (let e of [].concat(...document.body.children))
          X.on(e, `mouseover`, Jn);
      this._queueCallback(
        () => {
          (X.trigger(this._element, this.constructor.eventName(Ds)),
            this._isHovered === !1 && this._leave(),
            (this._isHovered = !1));
        },
        this.tip,
        this._isAnimated(),
      );
    }
    hide() {
      if (
        !(
          !this._isShown() ||
          X.trigger(this._element, this.constructor.eventName(ws))
            .defaultPrevented
        )
      ) {
        if (
          (this._getTipElement().classList.remove(gs),
          `ontouchstart` in document.documentElement)
        )
          for (let e of [].concat(...document.body.children))
            X.off(e, `mouseover`, Jn);
        ((this._activeTrigger[Ss] = !1),
          (this._activeTrigger[xs] = !1),
          (this._activeTrigger[bs] = !1),
          (this._isHovered = null),
          this._queueCallback(
            () => {
              this._isWithActiveTrigger() ||
                (this._isHovered || this._disposePopper(),
                this._element.removeAttribute(`aria-describedby`),
                X.trigger(this._element, this.constructor.eventName(Ts)));
            },
            this.tip,
            this._isAnimated(),
          ));
      }
    }
    update() {
      this._popper && this._popper.update();
    }
    _isWithContent() {
      return !!this._getTitle();
    }
    _getTipElement() {
      return (
        (this.tip ||= this._createTipElement(
          this._newContent || this._getContentForTemplate(),
        )),
        this.tip
      );
    }
    _createTipElement(e) {
      let t = this._getTemplateFactory(e).toHtml();
      if (!t) return null;
      (t.classList.remove(ms, gs),
        t.classList.add(`bs-${this.constructor.NAME}-auto`));
      let n = Vn(this.constructor.NAME).toString();
      return (
        t.setAttribute(`id`, n),
        this._isAnimated() && t.classList.add(ms),
        t
      );
    }
    setContent(e) {
      ((this._newContent = e),
        this._isShown() && (this._disposePopper(), this.show()));
    }
    _getTemplateFactory(e) {
      return (
        this._templateFactory
          ? this._templateFactory.changeContent(e)
          : (this._templateFactory = new ds({
              ...this._config,
              content: e,
              extraClass: this._resolvePossibleFunction(
                this._config.customClass,
              ),
            })),
        this._templateFactory
      );
    }
    _getContentForTemplate() {
      return { [_s]: this._getTitle() };
    }
    _getTitle() {
      return (
        this._resolvePossibleFunction(this._config.title) ||
        this._element.getAttribute(`data-bs-original-title`)
      );
    }
    _initializeOnDelegatedTarget(e) {
      return this.constructor.getOrCreateInstance(
        e.delegateTarget,
        this._getDelegateConfig(),
      );
    }
    _isAnimated() {
      return (
        this._config.animation || (this.tip && this.tip.classList.contains(ms))
      );
    }
    _isShown() {
      return this.tip && this.tip.classList.contains(gs);
    }
    _createPopper(e) {
      let t =
        Ps[Y(this._config.placement, [this, e, this._element]).toUpperCase()];
      return jn(this._element, e, this._getPopperConfig(t));
    }
    _getOffset() {
      let { offset: e } = this._config;
      return typeof e == `string`
        ? e.split(`,`).map((e) => Number.parseInt(e, 10))
        : typeof e == `function`
          ? (t) => e(t, this._element)
          : e;
    }
    _resolvePossibleFunction(e) {
      return Y(e, [this._element, this._element]);
    }
    _getPopperConfig(e) {
      let t = {
        placement: e,
        modifiers: [
          {
            name: `flip`,
            options: { fallbackPlacements: this._config.fallbackPlacements },
          },
          { name: `offset`, options: { offset: this._getOffset() } },
          {
            name: `preventOverflow`,
            options: { boundary: this._config.boundary },
          },
          {
            name: `arrow`,
            options: { element: `.${this.constructor.NAME}-arrow` },
          },
          {
            name: `preSetPlacement`,
            enabled: !0,
            phase: `beforeMain`,
            fn: (e) => {
              this._getTipElement().setAttribute(
                `data-popper-placement`,
                e.state.placement,
              );
            },
          },
        ],
      };
      return { ...t, ...Y(this._config.popperConfig, [void 0, t]) };
    }
    _setListeners() {
      let e = this._config.trigger.split(` `);
      for (let t of e)
        if (t === `click`)
          X.on(
            this._element,
            this.constructor.eventName(ks),
            this._config.selector,
            (e) => {
              let t = this._initializeOnDelegatedTarget(e);
              ((t._activeTrigger[Ss] = !(t._isShown() && t._activeTrigger[Ss])),
                t.toggle());
            },
          );
        else if (t !== Cs) {
          let e =
              t === bs
                ? this.constructor.eventName(Ms)
                : this.constructor.eventName(As),
            n =
              t === bs
                ? this.constructor.eventName(Ns)
                : this.constructor.eventName(js);
          (X.on(this._element, e, this._config.selector, (e) => {
            let t = this._initializeOnDelegatedTarget(e);
            ((t._activeTrigger[e.type === `focusin` ? xs : bs] = !0),
              t._enter());
          }),
            X.on(this._element, n, this._config.selector, (e) => {
              let t = this._initializeOnDelegatedTarget(e);
              ((t._activeTrigger[e.type === `focusout` ? xs : bs] =
                t._element.contains(e.relatedTarget)),
                t._leave());
            }));
        }
      ((this._hideModalHandler = () => {
        this._element && this.hide();
      }),
        X.on(this._element.closest(vs), ys, this._hideModalHandler));
    }
    _fixTitle() {
      let e = this._element.getAttribute(`title`);
      e &&
        (!this._element.getAttribute(`aria-label`) &&
          !this._element.textContent.trim() &&
          this._element.setAttribute(`aria-label`, e),
        this._element.setAttribute(`data-bs-original-title`, e),
        this._element.removeAttribute(`title`));
    }
    _enter() {
      if (this._isShown() || this._isHovered) {
        this._isHovered = !0;
        return;
      }
      ((this._isHovered = !0),
        this._setTimeout(() => {
          this._isHovered && this.show();
        }, this._config.delay.show));
    }
    _leave() {
      this._isWithActiveTrigger() ||
        ((this._isHovered = !1),
        this._setTimeout(() => {
          this._isHovered || this.hide();
        }, this._config.delay.hide));
    }
    _setTimeout(e, t) {
      (clearTimeout(this._timeout), (this._timeout = setTimeout(e, t)));
    }
    _isWithActiveTrigger() {
      return Object.values(this._activeTrigger).includes(!0);
    }
    _getConfig(e) {
      let t = xr.getDataAttributes(this._element);
      for (let e of Object.keys(t)) ps.has(e) && delete t[e];
      return (
        (e = { ...t, ...(typeof e == `object` && e ? e : {}) }),
        (e = this._mergeConfigObj(e)),
        (e = this._configAfterMerge(e)),
        this._typeCheckConfig(e),
        e
      );
    }
    _configAfterMerge(e) {
      return (
        (e.container = e.container === !1 ? document.body : Wn(e.container)),
        typeof e.delay == `number` &&
          (e.delay = { show: e.delay, hide: e.delay }),
        typeof e.title == `number` && (e.title = e.title.toString()),
        typeof e.content == `number` && (e.content = e.content.toString()),
        e
      );
    }
    _getDelegateConfig() {
      let e = {};
      for (let [t, n] of Object.entries(this._config))
        this.constructor.Default[t] !== n && (e[t] = n);
      return ((e.selector = !1), (e.trigger = `manual`), e);
    }
    _disposePopper() {
      ((this._popper &&= (this._popper.destroy(), null)),
        (this.tip &&= (this.tip.remove(), null)));
    }
    static jQueryInterface(t) {
      return this.each(function () {
        let n = e.getOrCreateInstance(this, t);
        if (typeof t == `string`) {
          if (n[t] === void 0) throw TypeError(`No method named "${t}"`);
          n[t]();
        }
      });
    }
  };
J(Ls);
var Rs = `popover`,
  zs = `.popover-header`,
  Bs = `.popover-body`,
  Vs = {
    ...Ls.Default,
    content: ``,
    offset: [0, 8],
    placement: `right`,
    template: `<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>`,
    trigger: `click`,
  },
  Hs = { ...Ls.DefaultType, content: `(null|string|element|function)` },
  Us = class e extends Ls {
    static get Default() {
      return Vs;
    }
    static get DefaultType() {
      return Hs;
    }
    static get NAME() {
      return Rs;
    }
    _isWithContent() {
      return this._getTitle() || this._getContent();
    }
    _getContentForTemplate() {
      return { [zs]: this._getTitle(), [Bs]: this._getContent() };
    }
    _getContent() {
      return this._resolvePossibleFunction(this._config.content);
    }
    static jQueryInterface(t) {
      return this.each(function () {
        let n = e.getOrCreateInstance(this, t);
        if (typeof t == `string`) {
          if (n[t] === void 0) throw TypeError(`No method named "${t}"`);
          n[t]();
        }
      });
    }
  };
J(Us);
var Ws = `scrollspy`,
  Gs = `.bs.scrollspy`,
  Ks = `.data-api`,
  qs = `activate${Gs}`,
  Js = `click${Gs}`,
  Ys = `load${Gs}${Ks}`,
  Xs = `dropdown-item`,
  Zs = `active`,
  Qs = `[data-bs-spy="scroll"]`,
  $s = `[href]`,
  ec = `.nav, .list-group`,
  tc = `.nav-link`,
  nc = `${tc}, .nav-item > ${tc}, .list-group-item`,
  rc = `.dropdown`,
  ic = `.dropdown-toggle`,
  ac = {
    offset: null,
    rootMargin: `0px 0px -25%`,
    smoothScroll: !1,
    target: null,
    threshold: [0.1, 0.5, 1],
  },
  oc = {
    offset: `(number|null)`,
    rootMargin: `string`,
    smoothScroll: `boolean`,
    target: `element`,
    threshold: `array`,
  },
  sc = class e extends Z {
    constructor(e, t) {
      (super(e, t),
        (this._targetLinks = new Map()),
        (this._observableSections = new Map()),
        (this._rootElement =
          getComputedStyle(this._element).overflowY === `visible`
            ? null
            : this._element),
        (this._activeTarget = null),
        (this._observer = null),
        (this._previousScrollData = { visibleEntryTop: 0, parentScrollTop: 0 }),
        this.refresh());
    }
    static get Default() {
      return ac;
    }
    static get DefaultType() {
      return oc;
    }
    static get NAME() {
      return Ws;
    }
    refresh() {
      (this._initializeTargetsAndObservables(),
        this._maybeEnableSmoothScroll(),
        this._observer
          ? this._observer.disconnect()
          : (this._observer = this._getNewObserver()));
      for (let e of this._observableSections.values())
        this._observer.observe(e);
    }
    dispose() {
      (this._observer.disconnect(), super.dispose());
    }
    _configAfterMerge(e) {
      return (
        (e.target = Wn(e.target) || document.body),
        (e.rootMargin = e.offset ? `${e.offset}px 0px -30%` : e.rootMargin),
        typeof e.threshold == `string` &&
          (e.threshold = e.threshold
            .split(`,`)
            .map((e) => Number.parseFloat(e))),
        e
      );
    }
    _maybeEnableSmoothScroll() {
      this._config.smoothScroll &&
        (X.off(this._config.target, Js),
        X.on(this._config.target, Js, $s, (e) => {
          let t = this._observableSections.get(e.target.hash);
          if (t) {
            e.preventDefault();
            let n = this._rootElement || window,
              r = t.offsetTop - this._element.offsetTop;
            if (n.scrollTo) {
              n.scrollTo({ top: r, behavior: `smooth` });
              return;
            }
            n.scrollTop = r;
          }
        }));
    }
    _getNewObserver() {
      let e = {
        root: this._rootElement,
        threshold: this._config.threshold,
        rootMargin: this._config.rootMargin,
      };
      return new IntersectionObserver((e) => this._observerCallback(e), e);
    }
    _observerCallback(e) {
      let t = (e) => this._targetLinks.get(`#${e.target.id}`),
        n = (e) => {
          ((this._previousScrollData.visibleEntryTop = e.target.offsetTop),
            this._process(t(e)));
        },
        r = (this._rootElement || document.documentElement).scrollTop,
        i = r >= this._previousScrollData.parentScrollTop;
      this._previousScrollData.parentScrollTop = r;
      for (let a of e) {
        if (!a.isIntersecting) {
          ((this._activeTarget = null), this._clearActiveClass(t(a)));
          continue;
        }
        let e = a.target.offsetTop >= this._previousScrollData.visibleEntryTop;
        if (i && e) {
          if ((n(a), !r)) return;
          continue;
        }
        !i && !e && n(a);
      }
    }
    _initializeTargetsAndObservables() {
      ((this._targetLinks = new Map()), (this._observableSections = new Map()));
      let e = Q.find($s, this._config.target);
      for (let t of e) {
        if (!t.hash || Kn(t)) continue;
        let e = Q.findOne(decodeURI(t.hash), this._element);
        Gn(e) &&
          (this._targetLinks.set(decodeURI(t.hash), t),
          this._observableSections.set(t.hash, e));
      }
    }
    _process(e) {
      this._activeTarget !== e &&
        (this._clearActiveClass(this._config.target),
        (this._activeTarget = e),
        e.classList.add(Zs),
        this._activateParents(e),
        X.trigger(this._element, qs, { relatedTarget: e }));
    }
    _activateParents(e) {
      if (e.classList.contains(Xs)) {
        Q.findOne(ic, e.closest(rc)).classList.add(Zs);
        return;
      }
      for (let t of Q.parents(e, ec))
        for (let e of Q.prev(t, nc)) e.classList.add(Zs);
    }
    _clearActiveClass(e) {
      e.classList.remove(Zs);
      let t = Q.find(`${$s}.${Zs}`, e);
      for (let e of t) e.classList.remove(Zs);
    }
    static jQueryInterface(t) {
      return this.each(function () {
        let n = e.getOrCreateInstance(this, t);
        if (typeof t == `string`) {
          if (n[t] === void 0 || t.startsWith(`_`) || t === `constructor`)
            throw TypeError(`No method named "${t}"`);
          n[t]();
        }
      });
    }
  };
(X.on(window, Ys, () => {
  for (let e of Q.find(Qs)) sc.getOrCreateInstance(e);
}),
  J(sc));
var cc = `tab`,
  lc = `.bs.tab`,
  uc = `hide${lc}`,
  dc = `hidden${lc}`,
  fc = `show${lc}`,
  pc = `shown${lc}`,
  mc = `click${lc}`,
  hc = `keydown${lc}`,
  gc = `load${lc}`,
  _c = `ArrowLeft`,
  vc = `ArrowRight`,
  yc = `ArrowUp`,
  bc = `ArrowDown`,
  xc = `Home`,
  Sc = `End`,
  Cc = `active`,
  wc = `fade`,
  Tc = `show`,
  Ec = `dropdown`,
  Dc = `.dropdown-toggle`,
  Oc = `.dropdown-menu`,
  kc = `:not(${Dc})`,
  Ac = `.list-group, .nav, [role="tablist"]`,
  jc = `.nav-item, .list-group-item`,
  Mc = `.nav-link${kc}, .list-group-item${kc}, [role="tab"]${kc}`,
  Nc = `[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]`,
  Pc = `${Mc}, ${Nc}`,
  Fc = `.${Cc}[data-bs-toggle="tab"], .${Cc}[data-bs-toggle="pill"], .${Cc}[data-bs-toggle="list"]`,
  Ic = class e extends Z {
    constructor(e) {
      (super(e),
        (this._parent = this._element.closest(Ac)),
        this._parent &&
          (this._setInitialAttributes(this._parent, this._getChildren()),
          X.on(this._element, hc, (e) => this._keydown(e))));
    }
    static get NAME() {
      return cc;
    }
    show() {
      let e = this._element;
      if (this._elemIsActive(e)) return;
      let t = this._getActiveElem(),
        n = t ? X.trigger(t, uc, { relatedTarget: e }) : null;
      X.trigger(e, fc, { relatedTarget: t }).defaultPrevented ||
        (n && n.defaultPrevented) ||
        (this._deactivate(t, e), this._activate(e, t));
    }
    _activate(e, t) {
      e &&
        (e.classList.add(Cc),
        this._activate(Q.getElementFromSelector(e)),
        this._queueCallback(
          () => {
            if (e.getAttribute(`role`) !== `tab`) {
              e.classList.add(Tc);
              return;
            }
            (e.removeAttribute(`tabindex`),
              e.setAttribute(`aria-selected`, !0),
              this._toggleDropDown(e, !0),
              X.trigger(e, pc, { relatedTarget: t }));
          },
          e,
          e.classList.contains(wc),
        ));
    }
    _deactivate(e, t) {
      e &&
        (e.classList.remove(Cc),
        e.blur(),
        this._deactivate(Q.getElementFromSelector(e)),
        this._queueCallback(
          () => {
            if (e.getAttribute(`role`) !== `tab`) {
              e.classList.remove(Tc);
              return;
            }
            (e.setAttribute(`aria-selected`, !1),
              e.setAttribute(`tabindex`, `-1`),
              this._toggleDropDown(e, !1),
              X.trigger(e, dc, { relatedTarget: t }));
          },
          e,
          e.classList.contains(wc),
        ));
    }
    _keydown(t) {
      if (![_c, vc, yc, bc, xc, Sc].includes(t.key)) return;
      (t.stopPropagation(), t.preventDefault());
      let n = this._getChildren().filter((e) => !Kn(e)),
        r;
      if ([xc, Sc].includes(t.key)) r = n[t.key === xc ? 0 : n.length - 1];
      else {
        let e = [vc, bc].includes(t.key);
        r = er(n, t.target, e, !0);
      }
      r && (r.focus({ preventScroll: !0 }), e.getOrCreateInstance(r).show());
    }
    _getChildren() {
      return Q.find(Pc, this._parent);
    }
    _getActiveElem() {
      return this._getChildren().find((e) => this._elemIsActive(e)) || null;
    }
    _setInitialAttributes(e, t) {
      this._setAttributeIfNotExists(e, `role`, `tablist`);
      for (let e of t) this._setInitialAttributesOnChild(e);
    }
    _setInitialAttributesOnChild(e) {
      e = this._getInnerElement(e);
      let t = this._elemIsActive(e),
        n = this._getOuterElement(e);
      (e.setAttribute(`aria-selected`, t),
        n !== e && this._setAttributeIfNotExists(n, `role`, `presentation`),
        t || e.setAttribute(`tabindex`, `-1`),
        this._setAttributeIfNotExists(e, `role`, `tab`),
        this._setInitialAttributesOnTargetPanel(e));
    }
    _setInitialAttributesOnTargetPanel(e) {
      let t = Q.getElementFromSelector(e);
      t &&
        (this._setAttributeIfNotExists(t, `role`, `tabpanel`),
        e.id && this._setAttributeIfNotExists(t, `aria-labelledby`, `${e.id}`));
    }
    _toggleDropDown(e, t) {
      let n = this._getOuterElement(e);
      if (!n.classList.contains(Ec)) return;
      let r = (e, r) => {
        let i = Q.findOne(e, n);
        i && i.classList.toggle(r, t);
      };
      (r(Dc, Cc), r(Oc, Tc), n.setAttribute(`aria-expanded`, t));
    }
    _setAttributeIfNotExists(e, t, n) {
      e.hasAttribute(t) || e.setAttribute(t, n);
    }
    _elemIsActive(e) {
      return e.classList.contains(Cc);
    }
    _getInnerElement(e) {
      return e.matches(Pc) ? e : Q.findOne(Pc, e);
    }
    _getOuterElement(e) {
      return e.closest(jc) || e;
    }
    static jQueryInterface(t) {
      return this.each(function () {
        let n = e.getOrCreateInstance(this);
        if (typeof t == `string`) {
          if (n[t] === void 0 || t.startsWith(`_`) || t === `constructor`)
            throw TypeError(`No method named "${t}"`);
          n[t]();
        }
      });
    }
  };
(X.on(document, mc, Nc, function (e) {
  ([`A`, `AREA`].includes(this.tagName) && e.preventDefault(),
    !Kn(this) && Ic.getOrCreateInstance(this).show());
}),
  X.on(window, gc, () => {
    for (let e of Q.find(Fc)) Ic.getOrCreateInstance(e);
  }),
  J(Ic));
var Lc = `toast`,
  Rc = `.bs.toast`,
  zc = `mouseover${Rc}`,
  Bc = `mouseout${Rc}`,
  Vc = `focusin${Rc}`,
  Hc = `focusout${Rc}`,
  Uc = `hide${Rc}`,
  Wc = `hidden${Rc}`,
  Gc = `show${Rc}`,
  Kc = `shown${Rc}`,
  qc = `fade`,
  Jc = `hide`,
  Yc = `show`,
  Xc = `showing`,
  Zc = { animation: `boolean`, autohide: `boolean`, delay: `number` },
  Qc = { animation: !0, autohide: !0, delay: 5e3 },
  $c = class e extends Z {
    constructor(e, t) {
      (super(e, t),
        (this._timeout = null),
        (this._hasMouseInteraction = !1),
        (this._hasKeyboardInteraction = !1),
        this._setListeners());
    }
    static get Default() {
      return Qc;
    }
    static get DefaultType() {
      return Zc;
    }
    static get NAME() {
      return Lc;
    }
    show() {
      X.trigger(this._element, Gc).defaultPrevented ||
        (this._clearTimeout(),
        this._config.animation && this._element.classList.add(qc),
        this._element.classList.remove(Jc),
        Yn(this._element),
        this._element.classList.add(Yc, Xc),
        this._queueCallback(
          () => {
            (this._element.classList.remove(Xc),
              X.trigger(this._element, Kc),
              this._maybeScheduleHide());
          },
          this._element,
          this._config.animation,
        ));
    }
    hide() {
      !this.isShown() ||
        X.trigger(this._element, Uc).defaultPrevented ||
        (this._element.classList.add(Xc),
        this._queueCallback(
          () => {
            (this._element.classList.add(Jc),
              this._element.classList.remove(Xc, Yc),
              X.trigger(this._element, Wc));
          },
          this._element,
          this._config.animation,
        ));
    }
    dispose() {
      (this._clearTimeout(),
        this.isShown() && this._element.classList.remove(Yc),
        super.dispose());
    }
    isShown() {
      return this._element.classList.contains(Yc);
    }
    _maybeScheduleHide() {
      this._config.autohide &&
        (this._hasMouseInteraction ||
          this._hasKeyboardInteraction ||
          (this._timeout = setTimeout(() => {
            this.hide();
          }, this._config.delay)));
    }
    _onInteraction(e, t) {
      switch (e.type) {
        case `mouseover`:
        case `mouseout`:
          this._hasMouseInteraction = t;
          break;
        case `focusin`:
        case `focusout`:
          this._hasKeyboardInteraction = t;
          break;
      }
      if (t) {
        this._clearTimeout();
        return;
      }
      let n = e.relatedTarget;
      this._element === n ||
        this._element.contains(n) ||
        this._maybeScheduleHide();
    }
    _setListeners() {
      (X.on(this._element, zc, (e) => this._onInteraction(e, !0)),
        X.on(this._element, Bc, (e) => this._onInteraction(e, !1)),
        X.on(this._element, Vc, (e) => this._onInteraction(e, !0)),
        X.on(this._element, Hc, (e) => this._onInteraction(e, !1)));
    }
    _clearTimeout() {
      (clearTimeout(this._timeout), (this._timeout = null));
    }
    static jQueryInterface(t) {
      return this.each(function () {
        let n = e.getOrCreateInstance(this, t);
        if (typeof t == `string`) {
          if (n[t] === void 0) throw TypeError(`No method named "${t}"`);
          n[t](this);
        }
      });
    }
  };
(Tr($c), J($c));
var el = {
    xmlns: `http://www.w3.org/2000/svg`,
    width: 24,
    height: 24,
    viewBox: `0 0 24 24`,
    fill: `none`,
    stroke: `currentColor`,
    "stroke-width": 2,
    "stroke-linecap": `round`,
    "stroke-linejoin": `round`,
  },
  tl = ([e, t, n]) => {
    let r = document.createElementNS(`http://www.w3.org/2000/svg`, e);
    return (
      Object.keys(t).forEach((e) => {
        r.setAttribute(e, String(t[e]));
      }),
      n?.length &&
        n.forEach((e) => {
          let t = tl(e);
          r.appendChild(t);
        }),
      r
    );
  },
  nl = (e, t = {}) => tl([`svg`, { ...el, ...t }, e]),
  rl = (e) => {
    for (let t in e)
      if (t.startsWith(`aria-`) || t === `role` || t === `title`) return !0;
    return !1;
  },
  il = (...e) =>
    e
      .filter((e, t, n) => !!e && e.trim() !== `` && n.indexOf(e) === t)
      .join(` `)
      .trim(),
  al = (e) =>
    e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) =>
      n ? n.toUpperCase() : t.toLowerCase(),
    ),
  ol = (e) => {
    let t = al(e);
    return t.charAt(0).toUpperCase() + t.slice(1);
  },
  sl = (e) =>
    Array.from(e.attributes).reduce((e, t) => ((e[t.name] = t.value), e), {}),
  cl = (e) =>
    typeof e == `string`
      ? e
      : !e || !e.class
        ? ``
        : e.class && typeof e.class == `string`
          ? e.class.split(` `)
          : e.class && Array.isArray(e.class)
            ? e.class
            : ``,
  ll = (e, { nameAttr: t, icons: n, attrs: r }) => {
    let i = e.getAttribute(t);
    if (i == null) return;
    let a = n[ol(i)];
    if (!a)
      return console.warn(
        `${e.outerHTML} icon name was not found in the provided icons object.`,
      );
    let o = sl(e),
      s = rl(o) ? {} : { "aria-hidden": `true` },
      c = { ...el, "data-lucide": i, ...s, ...r, ...o },
      l = cl(o),
      u = cl(r),
      d = il(`lucide`, `lucide-${i}`, ...l, ...u);
    d && Object.assign(c, { class: d });
    let f = nl(a, c);
    return e.parentNode?.replaceChild(f, e);
  },
  ul = [
    [`path`, { d: `m14 12 4 4 4-4` }],
    [`path`, { d: `M18 16V7` }],
    [`path`, { d: `m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16` }],
    [`path`, { d: `M3.304 13h6.392` }],
  ],
  dl = [
    [`path`, { d: `m14 11 4-4 4 4` }],
    [`path`, { d: `M18 16V7` }],
    [`path`, { d: `m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16` }],
    [`path`, { d: `M3.304 13h6.392` }],
  ],
  fl = [
    [`path`, { d: `m15 16 2.536-7.328a1.02 1.02 1 0 1 1.928 0L22 16` }],
    [`path`, { d: `M15.697 14h5.606` }],
    [`path`, { d: `m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16` }],
    [`path`, { d: `M3.304 13h6.392` }],
  ],
  pl = [
    [`circle`, { cx: `16`, cy: `4`, r: `1` }],
    [`path`, { d: `m18 19 1-7-6 1` }],
    [`path`, { d: `m5 8 3-3 5.5 3-2.36 3.5` }],
    [`path`, { d: `M4.24 14.5a5 5 0 0 0 6.88 6` }],
    [`path`, { d: `M13.76 17.5a5 5 0 0 0-6.88-6` }],
  ],
  ml = [
    [
      `path`,
      {
        d: `M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2`,
      },
    ],
  ],
  hl = [
    [`path`, { d: `M18 17.5a2.5 2.5 0 1 1-4 2.03V12` }],
    [
      `path`,
      {
        d: `M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2`,
      },
    ],
    [`path`, { d: `M6 8h12` }],
    [`path`, { d: `M6.6 15.572A2 2 0 1 0 10 17v-5` }],
  ],
  gl = [
    [
      `path`,
      {
        d: `M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1`,
      },
    ],
    [`path`, { d: `m12 15 5 6H7Z` }],
  ],
  _l = [
    [`circle`, { cx: `12`, cy: `13`, r: `8` }],
    [`path`, { d: `M5 3 2 6` }],
    [`path`, { d: `m22 6-3-3` }],
    [`path`, { d: `M6.38 18.7 4 21` }],
    [`path`, { d: `M17.64 18.67 20 21` }],
    [`path`, { d: `m9 13 2 2 4-4` }],
  ],
  vl = [
    [`circle`, { cx: `12`, cy: `13`, r: `8` }],
    [`path`, { d: `M5 3 2 6` }],
    [`path`, { d: `m22 6-3-3` }],
    [`path`, { d: `M6.38 18.7 4 21` }],
    [`path`, { d: `M17.64 18.67 20 21` }],
    [`path`, { d: `M9 13h6` }],
  ],
  yl = [
    [`circle`, { cx: `12`, cy: `13`, r: `8` }],
    [`path`, { d: `M5 3 2 6` }],
    [`path`, { d: `m22 6-3-3` }],
    [`path`, { d: `M6.38 18.7 4 21` }],
    [`path`, { d: `M17.64 18.67 20 21` }],
    [`path`, { d: `M12 10v6` }],
    [`path`, { d: `M9 13h6` }],
  ],
  bl = [
    [`path`, { d: `M6.87 6.87a8 8 0 1 0 11.26 11.26` }],
    [`path`, { d: `M19.9 14.25a8 8 0 0 0-9.15-9.15` }],
    [`path`, { d: `m22 6-3-3` }],
    [`path`, { d: `M6.26 18.67 4 21` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M4 4 2 6` }],
  ],
  xl = [
    [`circle`, { cx: `12`, cy: `13`, r: `8` }],
    [`path`, { d: `M12 9v4l2 2` }],
    [`path`, { d: `M5 3 2 6` }],
    [`path`, { d: `m22 6-3-3` }],
    [`path`, { d: `M6.38 18.7 4 21` }],
    [`path`, { d: `M17.64 18.67 20 21` }],
  ],
  Sl = [
    [`path`, { d: `M11 21c0-2.5 2-2.5 2-5` }],
    [`path`, { d: `M16 21c0-2.5 2-2.5 2-5` }],
    [
      `path`,
      { d: `m19 8-.8 3a1.25 1.25 0 0 1-1.2 1H7a1.25 1.25 0 0 1-1.2-1L5 8` },
    ],
    [
      `path`,
      {
        d: `M21 3a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a1 1 0 0 1 1-1z`,
      },
    ],
    [`path`, { d: `M6 21c0-2.5 2-2.5 2-5` }],
  ],
  Cl = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2`, ry: `2` }],
    [`polyline`, { points: `11 3 11 11 14 8 17 11 17 3` }],
  ],
  wl = [
    [`path`, { d: `M2 12h20` }],
    [`path`, { d: `M10 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4` }],
    [`path`, { d: `M10 8V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4` }],
    [`path`, { d: `M20 16v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1` }],
    [`path`, { d: `M14 8V7c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v1` }],
  ],
  Tl = [
    [`path`, { d: `M12 2v20` }],
    [`path`, { d: `M8 10H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h4` }],
    [`path`, { d: `M16 10h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4` }],
    [`path`, { d: `M8 20H7a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2h1` }],
    [`path`, { d: `M16 14h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1` }],
  ],
  El = [
    [`rect`, { width: `6`, height: `16`, x: `4`, y: `2`, rx: `2` }],
    [`rect`, { width: `6`, height: `9`, x: `14`, y: `9`, rx: `2` }],
    [`path`, { d: `M22 22H2` }],
  ],
  Dl = [
    [`rect`, { width: `16`, height: `6`, x: `2`, y: `4`, rx: `2` }],
    [`rect`, { width: `9`, height: `6`, x: `9`, y: `14`, rx: `2` }],
    [`path`, { d: `M22 22V2` }],
  ],
  Ol = [
    [`rect`, { width: `6`, height: `14`, x: `4`, y: `5`, rx: `2` }],
    [`rect`, { width: `6`, height: `10`, x: `14`, y: `7`, rx: `2` }],
    [`path`, { d: `M17 22v-5` }],
    [`path`, { d: `M17 7V2` }],
    [`path`, { d: `M7 22v-3` }],
    [`path`, { d: `M7 5V2` }],
  ],
  kl = [
    [`rect`, { width: `6`, height: `14`, x: `4`, y: `5`, rx: `2` }],
    [`rect`, { width: `6`, height: `10`, x: `14`, y: `7`, rx: `2` }],
    [`path`, { d: `M10 2v20` }],
    [`path`, { d: `M20 2v20` }],
  ],
  Al = [
    [`rect`, { width: `6`, height: `14`, x: `4`, y: `5`, rx: `2` }],
    [`rect`, { width: `6`, height: `10`, x: `14`, y: `7`, rx: `2` }],
    [`path`, { d: `M4 2v20` }],
    [`path`, { d: `M14 2v20` }],
  ],
  jl = [
    [`rect`, { width: `6`, height: `14`, x: `2`, y: `5`, rx: `2` }],
    [`rect`, { width: `6`, height: `10`, x: `16`, y: `7`, rx: `2` }],
    [`path`, { d: `M12 2v20` }],
  ],
  Ml = [
    [`rect`, { width: `6`, height: `14`, x: `2`, y: `5`, rx: `2` }],
    [`rect`, { width: `6`, height: `10`, x: `12`, y: `7`, rx: `2` }],
    [`path`, { d: `M22 2v20` }],
  ],
  Nl = [
    [`rect`, { width: `6`, height: `14`, x: `6`, y: `5`, rx: `2` }],
    [`rect`, { width: `6`, height: `10`, x: `16`, y: `7`, rx: `2` }],
    [`path`, { d: `M2 2v20` }],
  ],
  Pl = [
    [`rect`, { width: `6`, height: `14`, x: `3`, y: `5`, rx: `2` }],
    [`rect`, { width: `6`, height: `10`, x: `15`, y: `7`, rx: `2` }],
    [`path`, { d: `M3 2v20` }],
    [`path`, { d: `M21 2v20` }],
  ],
  Fl = [
    [`rect`, { width: `6`, height: `10`, x: `9`, y: `7`, rx: `2` }],
    [`path`, { d: `M4 22V2` }],
    [`path`, { d: `M20 22V2` }],
  ],
  Il = [
    [`rect`, { width: `9`, height: `6`, x: `6`, y: `14`, rx: `2` }],
    [`rect`, { width: `16`, height: `6`, x: `6`, y: `4`, rx: `2` }],
    [`path`, { d: `M2 2v20` }],
  ],
  Ll = [
    [`rect`, { width: `6`, height: `16`, x: `4`, y: `6`, rx: `2` }],
    [`rect`, { width: `6`, height: `9`, x: `14`, y: `6`, rx: `2` }],
    [`path`, { d: `M22 2H2` }],
  ],
  Rl = [
    [`path`, { d: `M22 17h-3` }],
    [`path`, { d: `M22 7h-5` }],
    [`path`, { d: `M5 17H2` }],
    [`path`, { d: `M7 7H2` }],
    [`rect`, { x: `5`, y: `14`, width: `14`, height: `6`, rx: `2` }],
    [`rect`, { x: `7`, y: `4`, width: `10`, height: `6`, rx: `2` }],
  ],
  zl = [
    [`rect`, { width: `14`, height: `6`, x: `5`, y: `14`, rx: `2` }],
    [`rect`, { width: `10`, height: `6`, x: `7`, y: `4`, rx: `2` }],
    [`path`, { d: `M2 20h20` }],
    [`path`, { d: `M2 10h20` }],
  ],
  Bl = [
    [`rect`, { width: `14`, height: `6`, x: `5`, y: `14`, rx: `2` }],
    [`rect`, { width: `10`, height: `6`, x: `7`, y: `4`, rx: `2` }],
    [`path`, { d: `M2 14h20` }],
    [`path`, { d: `M2 4h20` }],
  ],
  Vl = [
    [`rect`, { width: `14`, height: `6`, x: `5`, y: `16`, rx: `2` }],
    [`rect`, { width: `10`, height: `6`, x: `7`, y: `2`, rx: `2` }],
    [`path`, { d: `M2 12h20` }],
  ],
  Hl = [
    [`rect`, { width: `14`, height: `6`, x: `5`, y: `12`, rx: `2` }],
    [`rect`, { width: `10`, height: `6`, x: `7`, y: `2`, rx: `2` }],
    [`path`, { d: `M2 22h20` }],
  ],
  Ul = [
    [`rect`, { width: `14`, height: `6`, x: `5`, y: `16`, rx: `2` }],
    [`rect`, { width: `10`, height: `6`, x: `7`, y: `6`, rx: `2` }],
    [`path`, { d: `M2 2h20` }],
  ],
  Wl = [
    [`rect`, { width: `10`, height: `6`, x: `7`, y: `9`, rx: `2` }],
    [`path`, { d: `M22 20H2` }],
    [`path`, { d: `M22 4H2` }],
  ],
  Gl = [
    [`rect`, { width: `14`, height: `6`, x: `5`, y: `15`, rx: `2` }],
    [`rect`, { width: `10`, height: `6`, x: `7`, y: `3`, rx: `2` }],
    [`path`, { d: `M2 21h20` }],
    [`path`, { d: `M2 3h20` }],
  ],
  Kl = [
    [`path`, { d: `M16 12h3` }],
    [
      `path`,
      {
        d: `M17.5 12a8 8 0 0 1-8 8A4.5 4.5 0 0 1 5 15.5c0-6 8-4 8-8.5a3 3 0 1 0-6 0c0 3 2.5 8.5 12 13`,
      },
    ],
  ],
  ql = [
    [`path`, { d: `M10 10H6` }],
    [
      `path`,
      { d: `M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2` },
    ],
    [
      `path`,
      {
        d: `M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14`,
      },
    ],
    [`path`, { d: `M8 8v4` }],
    [`path`, { d: `M9 18h6` }],
    [`circle`, { cx: `17`, cy: `18`, r: `2` }],
    [`circle`, { cx: `7`, cy: `18`, r: `2` }],
  ],
  Jl = [
    [
      `path`,
      {
        d: `M10 17c-5-3-7-7-7-9a2 2 0 0 1 4 0c0 2.5-5 2.5-5 6 0 1.7 1.3 3 3 3 2.8 0 5-2.2 5-5`,
      },
    ],
    [
      `path`,
      {
        d: `M22 17c-5-3-7-7-7-9a2 2 0 0 1 4 0c0 2.5-5 2.5-5 6 0 1.7 1.3 3 3 3 2.8 0 5-2.2 5-5`,
      },
    ],
  ],
  Yl = [
    [
      `path`,
      {
        d: `M10 2v5.632c0 .424-.272.795-.653.982A6 6 0 0 0 6 14c.006 4 3 7 5 8`,
      },
    ],
    [`path`, { d: `M10 5H8a2 2 0 0 0 0 4h.68` }],
    [
      `path`,
      { d: `M14 2v5.632c0 .424.272.795.652.982A6 6 0 0 1 18 14c0 4-3 7-5 8` },
    ],
    [`path`, { d: `M14 5h2a2 2 0 0 1 0 4h-.68` }],
    [`path`, { d: `M18 22H6` }],
    [`path`, { d: `M9 2h6` }],
  ],
  Xl = [
    [`path`, { d: `M12 6v16` }],
    [`path`, { d: `m19 13 2-1a9 9 0 0 1-18 0l2 1` }],
    [`path`, { d: `M9 11h6` }],
    [`circle`, { cx: `12`, cy: `4`, r: `2` }],
  ],
  Zl = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M16 16s-1.5-2-4-2-4 2-4 2` }],
    [`path`, { d: `M7.5 8 10 9` }],
    [`path`, { d: `m14 9 2.5-1` }],
    [`path`, { d: `M9 10h.01` }],
    [`path`, { d: `M15 10h.01` }],
  ],
  Ql = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M8 15h8` }],
    [`path`, { d: `M8 9h2` }],
    [`path`, { d: `M14 9h2` }],
  ],
  $l = [
    [`path`, { d: `M2 12 7 2` }],
    [`path`, { d: `m7 12 5-10` }],
    [`path`, { d: `m12 12 5-10` }],
    [`path`, { d: `m17 12 5-10` }],
    [`path`, { d: `M4.5 7h15` }],
    [`path`, { d: `M12 16v6` }],
  ],
  eu = [
    [`path`, { d: `M7 10H6a4 4 0 0 1-4-4 1 1 0 0 1 1-1h4` }],
    [
      `path`,
      {
        d: `M7 5a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1 7 7 0 0 1-7 7H8a1 1 0 0 1-1-1z`,
      },
    ],
    [`path`, { d: `M9 12v5` }],
    [`path`, { d: `M15 12v5` }],
    [
      `path`,
      {
        d: `M5 20a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3 1 1 0 0 1-1 1H6a1 1 0 0 1-1-1`,
      },
    ],
  ],
  tu = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `m14.31 8 5.74 9.94` }],
    [`path`, { d: `M9.69 8h11.48` }],
    [`path`, { d: `m7.38 12 5.74-9.94` }],
    [`path`, { d: `M9.69 16 3.95 6.06` }],
    [`path`, { d: `M14.31 16H2.83` }],
    [`path`, { d: `m16.62 12-5.74 9.94` }],
  ],
  nu = [
    [`rect`, { width: `20`, height: `16`, x: `2`, y: `4`, rx: `2` }],
    [`path`, { d: `M6 8h.01` }],
    [`path`, { d: `M10 8h.01` }],
    [`path`, { d: `M14 8h.01` }],
  ],
  ru = [
    [`rect`, { x: `2`, y: `4`, width: `20`, height: `16`, rx: `2` }],
    [`path`, { d: `M10 4v4` }],
    [`path`, { d: `M2 8h20` }],
    [`path`, { d: `M6 4v4` }],
  ],
  iu = [
    [`path`, { d: `M12 6.528V3a1 1 0 0 1 1-1h0` }],
    [
      `path`,
      {
        d: `M18.237 21A15 15 0 0 0 22 11a6 6 0 0 0-10-4.472A6 6 0 0 0 2 11a15.1 15.1 0 0 0 3.763 10 3 3 0 0 0 3.648.648 5.5 5.5 0 0 1 5.178 0A3 3 0 0 0 18.237 21`,
      },
    ],
  ],
  au = [
    [`rect`, { width: `20`, height: `5`, x: `2`, y: `3`, rx: `1` }],
    [`path`, { d: `M4 8v11a2 2 0 0 0 2 2h2` }],
    [`path`, { d: `M20 8v11a2 2 0 0 1-2 2h-2` }],
    [`path`, { d: `m9 15 3-3 3 3` }],
    [`path`, { d: `M12 12v9` }],
  ],
  ou = [
    [`rect`, { width: `20`, height: `5`, x: `2`, y: `3`, rx: `1` }],
    [`path`, { d: `M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8` }],
    [`path`, { d: `m9.5 17 5-5` }],
    [`path`, { d: `m9.5 12 5 5` }],
  ],
  su = [
    [`rect`, { width: `20`, height: `5`, x: `2`, y: `3`, rx: `1` }],
    [`path`, { d: `M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8` }],
    [`path`, { d: `M10 12h4` }],
  ],
  cu = [
    [`path`, { d: `M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3` }],
    [
      `path`,
      {
        d: `M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z`,
      },
    ],
    [`path`, { d: `M5 18v2` }],
    [`path`, { d: `M19 18v2` }],
  ],
  lu = [
    [
      `path`,
      {
        d: `M14 8a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h3.293a.707.707 0 0 1 .5 1.207l-6.939 6.939a1.207 1.207 0 0 1-1.708 0l-6.94-6.94a.707.707 0 0 1 .5-1.206H8a1 1 0 0 0 1-1V9a1 1 0 0 1 1-1z`,
      },
    ],
    [`path`, { d: `M9 4h6` }],
  ],
  uu = [
    [
      `path`,
      {
        d: `M9 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 0 1 1h3.293a.707.707 0 0 1 .5 1.207l-7.086 7.086a1 1 0 0 1-1.414 0l-7.086-7.086a.707.707 0 0 1 .5-1.207H8a1 1 0 0 0 1-1z`,
      },
    ],
  ],
  du = [
    [
      `path`,
      {
        d: `M13 9a1 1 0 0 1-1-1V4.707a.707.707 0 0 0-1.207-.5l-6.94 6.94a1.207 1.207 0 0 0 0 1.707l6.94 6.94a.707.707 0 0 0 1.207-.5V16a1 1 0 0 1 1-1h2a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z`,
      },
    ],
    [`path`, { d: `M20 9v6` }],
  ],
  fu = [
    [
      `path`,
      {
        d: `M10.793 19.793a.707.707 0 0 0 1.207-.5V16a1 1 0 0 1 1-1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-6a1 1 0 0 1-1-1V4.707a.707.707 0 0 0-1.207-.5l-6.94 6.94a1.207 1.207 0 0 0 0 1.707z`,
      },
    ],
  ],
  pu = [
    [
      `path`,
      {
        d: `M11 9a1 1 0 0 0 1-1V4.707a.707.707 0 0 1 1.207-.5l6.94 6.94a1.207 1.207 0 0 1 0 1.707l-6.94 6.94a.707.707 0 0 1-1.207-.5V16a1 1 0 0 0-1-1H9a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z`,
      },
    ],
    [`path`, { d: `M4 9v6` }],
  ],
  mu = [
    [
      `path`,
      {
        d: `M13.207 19.793a.707.707 0 0 1-1.207-.5V16a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h6a1 1 0 0 0 1-1V4.707a.707.707 0 0 1 1.207-.5l6.94 6.94a1.207 1.207 0 0 1 0 1.707z`,
      },
    ],
  ],
  hu = [
    [
      `path`,
      {
        d: `M14 16a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h3.293a.707.707 0 0 0 .5-1.207l-6.939-6.939a1.207 1.207 0 0 0-1.708 0l-6.94 6.94a.707.707 0 0 0 .5 1.206H8a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1z`,
      },
    ],
    [`path`, { d: `M9 20h6` }],
  ],
  gu = [
    [
      `path`,
      {
        d: `M9 19a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-6a1 1 0 0 1 1-1h3.293a.707.707 0 0 0 .5-1.207l-7.086-7.086a1 1 0 0 0-1.414 0l-7.086 7.086a.707.707 0 0 0 .5 1.207H8a1 1 0 0 1 1 1z`,
      },
    ],
  ],
  _u = [
    [`path`, { d: `m3 16 4 4 4-4` }],
    [`path`, { d: `M7 20V4` }],
    [`rect`, { x: `15`, y: `4`, width: `4`, height: `6`, ry: `2` }],
    [`path`, { d: `M17 20v-6h-2` }],
    [`path`, { d: `M15 20h4` }],
  ],
  vu = [
    [`path`, { d: `m3 16 4 4 4-4` }],
    [`path`, { d: `M7 20V4` }],
    [`path`, { d: `M17 10V4h-2` }],
    [`path`, { d: `M15 10h4` }],
    [`rect`, { x: `15`, y: `14`, width: `4`, height: `6`, ry: `2` }],
  ],
  yu = [
    [`path`, { d: `m3 16 4 4 4-4` }],
    [`path`, { d: `M7 20V4` }],
    [`path`, { d: `M20 8h-5` }],
    [`path`, { d: `M15 10V6.5a2.5 2.5 0 0 1 5 0V10` }],
    [`path`, { d: `M15 14h5l-5 6h5` }],
  ],
  bu = [
    [`path`, { d: `M19 3H5` }],
    [`path`, { d: `M12 21V7` }],
    [`path`, { d: `m6 15 6 6 6-6` }],
  ],
  xu = [
    [`path`, { d: `M17 7 7 17` }],
    [`path`, { d: `M17 17H7V7` }],
  ],
  Su = [
    [`path`, { d: `m3 16 4 4 4-4` }],
    [`path`, { d: `M7 20V4` }],
    [`path`, { d: `M11 4h4` }],
    [`path`, { d: `M11 8h7` }],
    [`path`, { d: `M11 12h10` }],
  ],
  Cu = [
    [`path`, { d: `M12 2v14` }],
    [`path`, { d: `m19 9-7 7-7-7` }],
    [`circle`, { cx: `12`, cy: `21`, r: `1` }],
  ],
  wu = [
    [`path`, { d: `m7 7 10 10` }],
    [`path`, { d: `M17 7v10H7` }],
  ],
  Tu = [
    [`path`, { d: `M12 17V3` }],
    [`path`, { d: `m6 11 6 6 6-6` }],
    [`path`, { d: `M19 21H5` }],
  ],
  Eu = [
    [`path`, { d: `m3 16 4 4 4-4` }],
    [`path`, { d: `M7 20V4` }],
    [`path`, { d: `m21 8-4-4-4 4` }],
    [`path`, { d: `M17 4v16` }],
  ],
  Du = [
    [`path`, { d: `m3 16 4 4 4-4` }],
    [`path`, { d: `M7 20V4` }],
    [`path`, { d: `M11 4h10` }],
    [`path`, { d: `M11 8h7` }],
    [`path`, { d: `M11 12h4` }],
  ],
  Ou = [
    [`path`, { d: `m3 16 4 4 4-4` }],
    [`path`, { d: `M7 4v16` }],
    [`path`, { d: `M15 4h5l-5 6h5` }],
    [`path`, { d: `M15 20v-3.5a2.5 2.5 0 0 1 5 0V20` }],
    [`path`, { d: `M20 18h-5` }],
  ],
  ku = [
    [`path`, { d: `M12 5v14` }],
    [`path`, { d: `m19 12-7 7-7-7` }],
  ],
  Au = [
    [`path`, { d: `m9 6-6 6 6 6` }],
    [`path`, { d: `M3 12h14` }],
    [`path`, { d: `M21 19V5` }],
  ],
  ju = [
    [`path`, { d: `M8 3 4 7l4 4` }],
    [`path`, { d: `M4 7h16` }],
    [`path`, { d: `m16 21 4-4-4-4` }],
    [`path`, { d: `M20 17H4` }],
  ],
  Mu = [
    [`path`, { d: `M3 19V5` }],
    [`path`, { d: `m13 6-6 6 6 6` }],
    [`path`, { d: `M7 12h14` }],
  ],
  Nu = [
    [`path`, { d: `m12 19-7-7 7-7` }],
    [`path`, { d: `M19 12H5` }],
  ],
  Pu = [
    [`path`, { d: `M3 5v14` }],
    [`path`, { d: `M21 12H7` }],
    [`path`, { d: `m15 18 6-6-6-6` }],
  ],
  Fu = [
    [`path`, { d: `m16 3 4 4-4 4` }],
    [`path`, { d: `M20 7H4` }],
    [`path`, { d: `m8 21-4-4 4-4` }],
    [`path`, { d: `M4 17h16` }],
  ],
  Iu = [
    [`path`, { d: `M17 12H3` }],
    [`path`, { d: `m11 18 6-6-6-6` }],
    [`path`, { d: `M21 5v14` }],
  ],
  Lu = [
    [`path`, { d: `m3 8 4-4 4 4` }],
    [`path`, { d: `M7 4v16` }],
    [`rect`, { x: `15`, y: `4`, width: `4`, height: `6`, ry: `2` }],
    [`path`, { d: `M17 20v-6h-2` }],
    [`path`, { d: `M15 20h4` }],
  ],
  Ru = [
    [`path`, { d: `m3 8 4-4 4 4` }],
    [`path`, { d: `M7 4v16` }],
    [`path`, { d: `M17 10V4h-2` }],
    [`path`, { d: `M15 10h4` }],
    [`rect`, { x: `15`, y: `14`, width: `4`, height: `6`, ry: `2` }],
  ],
  zu = [
    [`path`, { d: `M5 12h14` }],
    [`path`, { d: `m12 5 7 7-7 7` }],
  ],
  Bu = [
    [`path`, { d: `m3 8 4-4 4 4` }],
    [`path`, { d: `M7 4v16` }],
    [`path`, { d: `M20 8h-5` }],
    [`path`, { d: `M15 10V6.5a2.5 2.5 0 0 1 5 0V10` }],
    [`path`, { d: `M15 14h5l-5 6h5` }],
  ],
  Vu = [
    [`path`, { d: `m21 16-4 4-4-4` }],
    [`path`, { d: `M17 20V4` }],
    [`path`, { d: `m3 8 4-4 4 4` }],
    [`path`, { d: `M7 4v16` }],
  ],
  Hu = [
    [`path`, { d: `m5 9 7-7 7 7` }],
    [`path`, { d: `M12 16V2` }],
    [`circle`, { cx: `12`, cy: `21`, r: `1` }],
  ],
  Uu = [
    [`path`, { d: `m18 9-6-6-6 6` }],
    [`path`, { d: `M12 3v14` }],
    [`path`, { d: `M5 21h14` }],
  ],
  Wu = [
    [`path`, { d: `M7 17V7h10` }],
    [`path`, { d: `M17 17 7 7` }],
  ],
  Gu = [
    [`path`, { d: `m3 8 4-4 4 4` }],
    [`path`, { d: `M7 4v16` }],
    [`path`, { d: `M11 12h4` }],
    [`path`, { d: `M11 16h7` }],
    [`path`, { d: `M11 20h10` }],
  ],
  Ku = [
    [`path`, { d: `M7 7h10v10` }],
    [`path`, { d: `M7 17 17 7` }],
  ],
  qu = [
    [`path`, { d: `M5 3h14` }],
    [`path`, { d: `m18 13-6-6-6 6` }],
    [`path`, { d: `M12 7v14` }],
  ],
  Ju = [
    [`path`, { d: `m3 8 4-4 4 4` }],
    [`path`, { d: `M7 4v16` }],
    [`path`, { d: `M11 12h10` }],
    [`path`, { d: `M11 16h7` }],
    [`path`, { d: `M11 20h4` }],
  ],
  Yu = [
    [`path`, { d: `m3 8 4-4 4 4` }],
    [`path`, { d: `M7 4v16` }],
    [`path`, { d: `M15 4h5l-5 6h5` }],
    [`path`, { d: `M15 20v-3.5a2.5 2.5 0 0 1 5 0V20` }],
    [`path`, { d: `M20 18h-5` }],
  ],
  Xu = [
    [`path`, { d: `m5 12 7-7 7 7` }],
    [`path`, { d: `M12 19V5` }],
  ],
  Zu = [
    [`path`, { d: `m4 6 3-3 3 3` }],
    [`path`, { d: `M7 17V3` }],
    [`path`, { d: `m14 6 3-3 3 3` }],
    [`path`, { d: `M17 17V3` }],
    [`path`, { d: `M4 21h16` }],
  ],
  Qu = [
    [`path`, { d: `M12 6v12` }],
    [`path`, { d: `M17.196 9 6.804 15` }],
    [`path`, { d: `m6.804 9 10.392 6` }],
  ],
  $u = [
    [
      `path`,
      {
        d: `M12.983 21.186a1 1 0 0 1-1.966 0 10 10 0 0 0-8.203-8.203 1 1 0 0 1 0-1.966 10 10 0 0 0 8.203-8.203 1 1 0 0 1 1.966 0 10 10 0 0 0 8.203 8.203 1 1 0 0 1 0 1.966 10 10 0 0 0-8.203 8.203`,
      },
    ],
  ],
  ed = [
    [`circle`, { cx: `12`, cy: `12`, r: `4` }],
    [`path`, { d: `M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8` }],
  ],
  td = [
    [`path`, { d: `M2 10v3` }],
    [`path`, { d: `M6 6v11` }],
    [`path`, { d: `M10 3v18` }],
    [`path`, { d: `M14 8v7` }],
    [`path`, { d: `M18 5v13` }],
    [`path`, { d: `M22 10v3` }],
  ],
  nd = [
    [
      `path`,
      {
        d: `M2 13a2 2 0 0 0 2-2V7a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0V4a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0v-4a2 2 0 0 1 2-2`,
      },
    ],
  ],
  rd = [
    [`circle`, { cx: `12`, cy: `12`, r: `1` }],
    [
      `path`,
      {
        d: `M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z`,
      },
    ],
    [
      `path`,
      {
        d: `M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z`,
      },
    ],
  ],
  id = [
    [
      `path`,
      {
        d: `m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526`,
      },
    ],
    [`circle`, { cx: `12`, cy: `8`, r: `6` }],
  ],
  ad = [
    [`path`, { d: `m14 12-8.381 8.38a1 1 0 0 1-3.001-3L11 9` }],
    [
      `path`,
      {
        d: `M15 15.5a.5.5 0 0 0 .5.5A6.5 6.5 0 0 0 22 9.5a.5.5 0 0 0-.5-.5h-1.672a2 2 0 0 1-1.414-.586l-5.062-5.062a1.205 1.205 0 0 0-1.704 0L9.352 5.648a1.205 1.205 0 0 0 0 1.704l5.062 5.062A2 2 0 0 1 15 13.828z`,
      },
    ],
  ],
  od = [
    [`path`, { d: `M13.5 10.5 15 9` }],
    [`path`, { d: `M4 4v15a1 1 0 0 0 1 1h15` }],
    [`path`, { d: `M4.293 19.707 6 18` }],
    [`path`, { d: `m9 15 1.5-1.5` }],
  ],
  sd = [
    [`path`, { d: `M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5` }],
    [`path`, { d: `M15 12h.01` }],
    [
      `path`,
      {
        d: `M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1`,
      },
    ],
    [`path`, { d: `M9 12h.01` }],
  ],
  cd = [
    [
      `path`,
      {
        d: `M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z`,
      },
    ],
    [`path`, { d: `M8 10h8` }],
    [`path`, { d: `M8 18h8` }],
    [`path`, { d: `M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6` }],
    [`path`, { d: `M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2` }],
  ],
  ld = [
    [
      `path`,
      {
        d: `M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z`,
      },
    ],
    [`path`, { d: `M12 7v10` }],
    [`path`, { d: `M15.4 10a4 4 0 1 0 0 4` }],
  ],
  ud = [
    [
      `path`,
      {
        d: `M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z`,
      },
    ],
    [`line`, { x1: `12`, x2: `12`, y1: `8`, y2: `12` }],
    [`line`, { x1: `12`, x2: `12.01`, y1: `16`, y2: `16` }],
  ],
  dd = [
    [
      `path`,
      {
        d: `M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z`,
      },
    ],
    [`path`, { d: `m9 12 2 2 4-4` }],
  ],
  fd = [
    [
      `path`,
      {
        d: `M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z`,
      },
    ],
    [`path`, { d: `M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8` }],
    [`path`, { d: `M12 18V6` }],
  ],
  pd = [
    [
      `path`,
      {
        d: `M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z`,
      },
    ],
    [`path`, { d: `M7 12h5` }],
    [`path`, { d: `M15 9.4a4 4 0 1 0 0 5.2` }],
  ],
  md = [
    [
      `path`,
      {
        d: `M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z`,
      },
    ],
    [`path`, { d: `M8 8h8` }],
    [`path`, { d: `M8 12h8` }],
    [`path`, { d: `m13 17-5-1h1a4 4 0 0 0 0-8` }],
  ],
  hd = [
    [
      `path`,
      {
        d: `M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z`,
      },
    ],
    [`line`, { x1: `12`, x2: `12`, y1: `16`, y2: `12` }],
    [`line`, { x1: `12`, x2: `12.01`, y1: `8`, y2: `8` }],
  ],
  gd = [
    [
      `path`,
      {
        d: `M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z`,
      },
    ],
    [`path`, { d: `m9 8 3 3v7` }],
    [`path`, { d: `m12 11 3-3` }],
    [`path`, { d: `M9 12h6` }],
    [`path`, { d: `M9 16h6` }],
  ],
  _d = [
    [
      `path`,
      {
        d: `M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z`,
      },
    ],
    [`line`, { x1: `8`, x2: `16`, y1: `12`, y2: `12` }],
  ],
  vd = [
    [
      `path`,
      {
        d: `M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z`,
      },
    ],
    [`path`, { d: `m15 9-6 6` }],
    [`path`, { d: `M9 9h.01` }],
    [`path`, { d: `M15 15h.01` }],
  ],
  yd = [
    [
      `path`,
      {
        d: `M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z`,
      },
    ],
    [`line`, { x1: `12`, x2: `12`, y1: `8`, y2: `16` }],
    [`line`, { x1: `8`, x2: `16`, y1: `12`, y2: `12` }],
  ],
  bd = [
    [
      `path`,
      {
        d: `M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z`,
      },
    ],
    [`path`, { d: `M8 12h4` }],
    [`path`, { d: `M10 16V9.5a2.5 2.5 0 0 1 5 0` }],
    [`path`, { d: `M8 16h7` }],
  ],
  xd = [
    [
      `path`,
      {
        d: `M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z`,
      },
    ],
    [`path`, { d: `M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3` }],
    [`line`, { x1: `12`, x2: `12.01`, y1: `17`, y2: `17` }],
  ],
  Sd = [
    [
      `path`,
      {
        d: `M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z`,
      },
    ],
    [`path`, { d: `M9 16h5` }],
    [`path`, { d: `M9 12h5a2 2 0 1 0 0-4h-3v9` }],
  ],
  Cd = [
    [
      `path`,
      {
        d: `M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z`,
      },
    ],
    [`path`, { d: `M11 17V8h4` }],
    [`path`, { d: `M11 12h3` }],
    [`path`, { d: `M9 16h4` }],
  ],
  wd = [
    [`path`, { d: `M11 7v10a5 5 0 0 0 5-5` }],
    [`path`, { d: `m15 8-6 3` }],
    [
      `path`,
      {
        d: `M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76`,
      },
    ],
  ],
  Td = [
    [
      `path`,
      {
        d: `M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z`,
      },
    ],
    [`line`, { x1: `15`, x2: `9`, y1: `9`, y2: `15` }],
    [`line`, { x1: `9`, x2: `15`, y1: `9`, y2: `15` }],
  ],
  Ed = [
    [
      `path`,
      {
        d: `M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z`,
      },
    ],
  ],
  Dd = [
    [`path`, { d: `M22 18H6a2 2 0 0 1-2-2V7a2 2 0 0 0-2-2` }],
    [`path`, { d: `M17 14V4a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v10` }],
    [`rect`, { width: `13`, height: `8`, x: `8`, y: `6`, rx: `1` }],
    [`circle`, { cx: `18`, cy: `20`, r: `2` }],
    [`circle`, { cx: `9`, cy: `20`, r: `2` }],
  ],
  Od = [
    [`path`, { d: `M12 16v1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v1` }],
    [`path`, { d: `M12 6a2 2 0 0 1 2 2` }],
    [`path`, { d: `M18 8c0 4-3.5 8-6 8s-6-4-6-8a6 6 0 0 1 12 0` }],
  ],
  kd = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M4.929 4.929 19.07 19.071` }],
  ],
  Ad = [
    [`path`, { d: `M4 13c3.5-2 8-2 10 2a5.5 5.5 0 0 1 8 5` }],
    [
      `path`,
      {
        d: `M5.15 17.89c5.52-1.52 8.65-6.89 7-12C11.55 4 11.5 2 13 2c3.22 0 5 5.5 5 8 0 6.5-4.2 12-10.49 12C5.11 22 2 22 2 20c0-1.5 1.14-1.55 3.15-2.11Z`,
      },
    ],
  ],
  jd = [
    [`path`, { d: `M10 10.01h.01` }],
    [`path`, { d: `M10 14.01h.01` }],
    [`path`, { d: `M14 10.01h.01` }],
    [`path`, { d: `M14 14.01h.01` }],
    [`path`, { d: `M18 6v12` }],
    [`path`, { d: `M6 6v12` }],
    [`rect`, { x: `2`, y: `6`, width: `20`, height: `12`, rx: `2` }],
  ],
  Md = [
    [
      `path`,
      { d: `M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5` },
    ],
    [`path`, { d: `m16 19 3 3 3-3` }],
    [`path`, { d: `M18 12h.01` }],
    [`path`, { d: `M19 16v6` }],
    [`path`, { d: `M6 12h.01` }],
    [`circle`, { cx: `12`, cy: `12`, r: `2` }],
  ],
  Nd = [
    [
      `path`,
      { d: `M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5` },
    ],
    [`path`, { d: `M18 12h.01` }],
    [`path`, { d: `M19 22v-6` }],
    [`path`, { d: `m22 19-3-3-3 3` }],
    [`path`, { d: `M6 12h.01` }],
    [`circle`, { cx: `12`, cy: `12`, r: `2` }],
  ],
  Pd = [
    [
      `path`,
      { d: `M13 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5` },
    ],
    [`path`, { d: `m17 17 5 5` }],
    [`path`, { d: `M18 12h.01` }],
    [`path`, { d: `m22 17-5 5` }],
    [`path`, { d: `M6 12h.01` }],
    [`circle`, { cx: `12`, cy: `12`, r: `2` }],
  ],
  Fd = [
    [`rect`, { width: `20`, height: `12`, x: `2`, y: `6`, rx: `2` }],
    [`circle`, { cx: `12`, cy: `12`, r: `2` }],
    [`path`, { d: `M6 12h.01M18 12h.01` }],
  ],
  Id = [
    [`path`, { d: `M3 5v14` }],
    [`path`, { d: `M8 5v14` }],
    [`path`, { d: `M12 5v14` }],
    [`path`, { d: `M17 5v14` }],
    [`path`, { d: `M21 5v14` }],
  ],
  Ld = [
    [`path`, { d: `M10 3a41 41 0 0 0 0 18` }],
    [`path`, { d: `M14 3a41 41 0 0 1 0 18` }],
    [
      `path`,
      {
        d: `M17 3a2 2 0 0 1 1.68.92 15.25 15.25 0 0 1 0 16.16A2 2 0 0 1 17 21H7a2 2 0 0 1-1.68-.92 15.25 15.25 0 0 1 0-16.16A2 2 0 0 1 7 3z`,
      },
    ],
    [`path`, { d: `M3.84 17h16.32` }],
    [`path`, { d: `M3.84 7h16.32` }],
  ],
  Rd = [
    [`path`, { d: `M4 20h16` }],
    [`path`, { d: `m6 16 6-12 6 12` }],
    [`path`, { d: `M8 12h8` }],
  ],
  zd = [
    [`path`, { d: `M10 4 8 6` }],
    [`path`, { d: `M17 19v2` }],
    [`path`, { d: `M2 12h20` }],
    [`path`, { d: `M7 19v2` }],
    [
      `path`,
      {
        d: `M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5`,
      },
    ],
  ],
  Bd = [
    [`path`, { d: `M10 10v4` }],
    [`path`, { d: `M14 10v4` }],
    [`path`, { d: `M22 14v-4` }],
    [`path`, { d: `M6 10v4` }],
    [`rect`, { x: `2`, y: `6`, width: `16`, height: `12`, rx: `2` }],
  ],
  Vd = [
    [`path`, { d: `m11 7-3 5h4l-3 5` }],
    [`path`, { d: `M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935` }],
    [`path`, { d: `M22 14v-4` }],
    [`path`, { d: `M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936` }],
  ],
  Hd = [
    [`path`, { d: `M22 14v-4` }],
    [`path`, { d: `M6 14v-4` }],
    [`rect`, { x: `2`, y: `6`, width: `16`, height: `12`, rx: `2` }],
  ],
  Ud = [
    [`path`, { d: `M10 14v-4` }],
    [`path`, { d: `M22 14v-4` }],
    [`path`, { d: `M6 14v-4` }],
    [`rect`, { x: `2`, y: `6`, width: `16`, height: `12`, rx: `2` }],
  ],
  Wd = [
    [`path`, { d: `M10 9v6` }],
    [`path`, { d: `M12.543 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.605` }],
    [`path`, { d: `M22 14v-4` }],
    [`path`, { d: `M7 12h6` }],
    [`path`, { d: `M7.606 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.606` }],
  ],
  Gd = [
    [`path`, { d: `M10 17h.01` }],
    [`path`, { d: `M10 7v6` }],
    [`path`, { d: `M14 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2` }],
    [`path`, { d: `M22 14v-4` }],
    [`path`, { d: `M6 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2` }],
  ],
  Kd = [
    [`path`, { d: `M 22 14 L 22 10` }],
    [`rect`, { x: `2`, y: `6`, width: `16`, height: `12`, rx: `2` }],
  ],
  qd = [
    [`path`, { d: `M4.5 3h15` }],
    [`path`, { d: `M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3` }],
    [`path`, { d: `M6 14h12` }],
  ],
  Jd = [
    [
      `path`,
      {
        d: `M9 9c-.64.64-1.521.954-2.402 1.165A6 6 0 0 0 8 22a13.96 13.96 0 0 0 9.9-4.1`,
      },
    ],
    [`path`, { d: `M10.75 5.093A6 6 0 0 1 22 8c0 2.411-.61 4.68-1.683 6.66` }],
    [
      `path`,
      {
        d: `M5.341 10.62a4 4 0 0 0 6.487 1.208M10.62 5.341a4.015 4.015 0 0 1 2.039 2.04`,
      },
    ],
    [`line`, { x1: `2`, x2: `22`, y1: `2`, y2: `22` }],
  ],
  Yd = [
    [
      `path`,
      {
        d: `M10.165 6.598C9.954 7.478 9.64 8.36 9 9c-.64.64-1.521.954-2.402 1.165A6 6 0 0 0 8 22c7.732 0 14-6.268 14-14a6 6 0 0 0-11.835-1.402Z`,
      },
    ],
    [`path`, { d: `M5.341 10.62a4 4 0 1 0 5.279-5.28` }],
  ],
  Xd = [
    [`path`, { d: `M3 20v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8` }],
    [`path`, { d: `M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4` }],
    [`path`, { d: `M3 18h18` }],
  ],
  Zd = [
    [`path`, { d: `M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8` }],
    [`path`, { d: `M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4` }],
    [`path`, { d: `M12 4v6` }],
    [`path`, { d: `M2 18h20` }],
  ],
  Qd = [
    [`path`, { d: `M2 4v16` }],
    [`path`, { d: `M2 8h18a2 2 0 0 1 2 2v10` }],
    [`path`, { d: `M2 17h20` }],
    [`path`, { d: `M6 8v9` }],
  ],
  $d = [
    [
      `path`,
      {
        d: `M16.4 13.7A6.5 6.5 0 1 0 6.28 6.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3`,
      },
    ],
    [
      `path`,
      {
        d: `m18.5 6 2.19 4.5a6.48 6.48 0 0 1-2.29 7.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5`,
      },
    ],
    [`circle`, { cx: `12.5`, cy: `8.5`, r: `2.5` }],
  ],
  ef = [
    [`path`, { d: `M13 13v5` }],
    [`path`, { d: `M17 11.47V8` }],
    [`path`, { d: `M17 11h1a3 3 0 0 1 2.745 4.211` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3` }],
    [
      `path`,
      { d: `M7.536 7.535C6.766 7.649 6.154 8 5.5 8a2.5 2.5 0 0 1-1.768-4.268` },
    ],
    [
      `path`,
      {
        d: `M8.727 3.204C9.306 2.767 9.885 2 11 2c1.56 0 2 1.5 3 1.5s1.72-.5 2.5-.5a1 1 0 1 1 0 5c-.78 0-1.5-.5-2.5-.5a3.149 3.149 0 0 0-.842.12`,
      },
    ],
    [`path`, { d: `M9 14.6V18` }],
  ],
  tf = [
    [`path`, { d: `M11.771 6.109a2.5 2.5 0 0 1 3.12 3.12` }],
    [`path`, { d: `M17.852 12.185a6.5 6.5 0 0 0-9.035-9.04` }],
    [
      `path`,
      {
        d: `M18.013 18.013C15.029 20.349 10.831 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5`,
      },
    ],
    [`path`, { d: `m18.5 6 2.19 4.5a6.48 6.48 0 0 1-.139 4.393` }],
    [`path`, { d: `m2 2 20 20` }],
    [
      `path`,
      {
        d: `M6.355 6.37a7 7 0 0 0-.075.23c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c3.356 0 6.993-1.267 9.85-3.151`,
      },
    ],
  ],
  nf = [
    [`path`, { d: `M17 11h1a3 3 0 0 1 0 6h-1` }],
    [`path`, { d: `M9 12v6` }],
    [`path`, { d: `M13 12v6` }],
    [
      `path`,
      {
        d: `M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z`,
      },
    ],
    [`path`, { d: `M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8` }],
  ],
  rf = [
    [`path`, { d: `M10.268 21a2 2 0 0 0 3.464 0` }],
    [`path`, { d: `m15 8 2 2 4-4` }],
    [
      `path`,
      { d: `M16.8607 4.4824A6 6 0 0 0 6 8C6 12.499 4.589 13.956 3.262 15.326` },
    ],
    [
      `path`,
      {
        d: `M3.262 15.326A1 1 0 0 0 4 17H20A1 1 0 0 0 20.74 15.327C20.209 14.779 19.665 14.218 19.203 13.454`,
      },
    ],
  ],
  af = [
    [`path`, { d: `M10.268 21a2 2 0 0 0 3.464 0` }],
    [
      `path`,
      {
        d: `M11.68 2.009A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673c-.824-.85-1.678-1.731-2.21-3.348`,
      },
    ],
    [`circle`, { cx: `18`, cy: `5`, r: `3` }],
  ],
  of = [
    [`path`, { d: `M18.518 17.347A7 7 0 0 1 14 19` }],
    [`path`, { d: `M18.8 4A11 11 0 0 1 20 9` }],
    [`path`, { d: `M9 9h.01` }],
    [`circle`, { cx: `20`, cy: `16`, r: `2` }],
    [`circle`, { cx: `9`, cy: `9`, r: `7` }],
    [`rect`, { x: `4`, y: `16`, width: `10`, height: `6`, rx: `2` }],
  ],
  sf = [
    [`path`, { d: `M10.268 21a2 2 0 0 0 3.464 0` }],
    [`path`, { d: `M15 8h6` }],
    [
      `path`,
      {
        d: `M16.243 3.757A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673A9.4 9.4 0 0 1 18.667 12`,
      },
    ],
  ],
  cf = [
    [`path`, { d: `M10.268 21a2 2 0 0 0 3.464 0` }],
    [
      `path`,
      {
        d: `M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742`,
      },
    ],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05` }],
  ],
  lf = [
    [`path`, { d: `M10.268 21a2 2 0 0 0 3.464 0` }],
    [`path`, { d: `M15 8h6` }],
    [`path`, { d: `M18 5v6` }],
    [
      `path`,
      {
        d: `M20.002 14.464a9 9 0 0 0 .738.863A1 1 0 0 1 20 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 8.75-5.332`,
      },
    ],
  ],
  uf = [
    [`path`, { d: `M10.268 21a2 2 0 0 0 3.464 0` }],
    [`path`, { d: `M22 8c0-2.3-.8-4.3-2-6` }],
    [
      `path`,
      {
        d: `M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326`,
      },
    ],
    [`path`, { d: `M4 2C2.8 3.7 2 5.7 2 8` }],
  ],
  df = [
    [`path`, { d: `M10.268 21a2 2 0 0 0 3.464 0` }],
    [
      `path`,
      {
        d: `M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326`,
      },
    ],
  ],
  ff = [
    [`rect`, { width: `13`, height: `7`, x: `3`, y: `3`, rx: `1` }],
    [`path`, { d: `m22 15-3-3 3-3` }],
    [`rect`, { width: `13`, height: `7`, x: `3`, y: `14`, rx: `1` }],
  ],
  pf = [
    [`rect`, { width: `13`, height: `7`, x: `8`, y: `3`, rx: `1` }],
    [`path`, { d: `m2 9 3 3-3 3` }],
    [`rect`, { width: `13`, height: `7`, x: `8`, y: `14`, rx: `1` }],
  ],
  mf = [
    [`rect`, { width: `7`, height: `13`, x: `3`, y: `3`, rx: `1` }],
    [`path`, { d: `m9 22 3-3 3 3` }],
    [`rect`, { width: `7`, height: `13`, x: `14`, y: `3`, rx: `1` }],
  ],
  hf = [
    [
      `path`,
      {
        d: `M12.409 13.017A5 5 0 0 1 22 15c0 3.866-4 7-9 7-4.077 0-8.153-.82-10.371-2.462-.426-.316-.631-.832-.62-1.362C2.118 12.723 2.627 2 10 2a3 3 0 0 1 3 3 2 2 0 0 1-2 2c-1.105 0-1.64-.444-2-1`,
      },
    ],
    [`path`, { d: `M15 14a5 5 0 0 0-7.584 2` }],
    [`path`, { d: `M9.964 6.825C8.019 7.977 9.5 13 8 15` }],
  ],
  gf = [
    [`circle`, { cx: `18.5`, cy: `17.5`, r: `3.5` }],
    [`circle`, { cx: `5.5`, cy: `17.5`, r: `3.5` }],
    [`circle`, { cx: `15`, cy: `5`, r: `1` }],
    [`path`, { d: `M12 17.5V14l-3-3 4-3 2 3h2` }],
  ],
  _f = [
    [`rect`, { width: `7`, height: `13`, x: `3`, y: `8`, rx: `1` }],
    [`path`, { d: `m15 2-3 3-3-3` }],
    [`rect`, { width: `7`, height: `13`, x: `14`, y: `8`, rx: `1` }],
  ],
  vf = [
    [`rect`, { x: `14`, y: `14`, width: `4`, height: `6`, rx: `2` }],
    [`rect`, { x: `6`, y: `4`, width: `4`, height: `6`, rx: `2` }],
    [`path`, { d: `M6 20h4` }],
    [`path`, { d: `M14 10h4` }],
    [`path`, { d: `M6 14h2v6` }],
    [`path`, { d: `M14 4h2v6` }],
  ],
  yf = [
    [`path`, { d: `M10 10h4` }],
    [`path`, { d: `M19 7V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3` }],
    [
      `path`,
      {
        d: `M20 21a2 2 0 0 0 2-2v-3.851c0-1.39-2-2.962-2-4.829V8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2z`,
      },
    ],
    [`path`, { d: `M 22 16 L 2 16` }],
    [
      `path`,
      {
        d: `M4 21a2 2 0 0 1-2-2v-3.851c0-1.39 2-2.962 2-4.829V8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M9 7V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v3` }],
  ],
  bf = [
    [`circle`, { cx: `12`, cy: `11.9`, r: `2` }],
    [`path`, { d: `M6.7 3.4c-.9 2.5 0 5.2 2.2 6.7C6.5 9 3.7 9.6 2 11.6` }],
    [`path`, { d: `m8.9 10.1 1.4.8` }],
    [`path`, { d: `M17.3 3.4c.9 2.5 0 5.2-2.2 6.7 2.4-1.2 5.2-.6 6.9 1.5` }],
    [`path`, { d: `m15.1 10.1-1.4.8` }],
    [
      `path`,
      { d: `M16.7 20.8c-2.6-.4-4.6-2.6-4.7-5.3-.2 2.6-2.1 4.8-4.7 5.2` },
    ],
    [`path`, { d: `M12 13.9v1.6` }],
    [`path`, { d: `M13.5 5.4c-1-.2-2-.2-3 0` }],
    [`path`, { d: `M17 16.4c.7-.7 1.2-1.6 1.5-2.5` }],
    [`path`, { d: `M5.5 13.9c.3.9.8 1.8 1.5 2.5` }],
  ],
  xf = [
    [`path`, { d: `M16 7h.01` }],
    [`path`, { d: `M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20` }],
    [`path`, { d: `m20 7 2 .5-2 .5` }],
    [`path`, { d: `M10 18v3` }],
    [`path`, { d: `M14 17.75V21` }],
    [`path`, { d: `M7 18a6 6 0 0 0 3.84-10.61` }],
  ],
  Sf = [
    [`path`, { d: `M12 18v4` }],
    [`path`, { d: `m17 18 1.956-11.468` }],
    [`path`, { d: `m3 8 7.82-5.615a2 2 0 0 1 2.36 0L21 8` }],
    [`path`, { d: `M4 18h16` }],
    [`path`, { d: `M7 18 5.044 6.532` }],
    [`circle`, { cx: `12`, cy: `10`, r: `2` }],
  ],
  Cf = [
    [
      `path`,
      {
        d: `M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727`,
      },
    ],
  ],
  wf = [
    [`circle`, { cx: `9`, cy: `9`, r: `7` }],
    [`circle`, { cx: `15`, cy: `15`, r: `7` }],
  ],
  Tf = [
    [
      `path`,
      {
        d: `M8 14a2 2 0 0 0-1.963 1.615l-1.018 5.193A1 1 0 0 0 6 22h12a1 1 0 0 0 .981-1.192l-1.018-5.193A2 2 0 0 0 16 14z`,
      },
    ],
    [`path`, { d: `m17 2-1 12` }],
    [`path`, { d: `M8.006 14 7 2` }],
    [`path`, { d: `M7.565 8.787A5 5 0 0 0 12 8a5 5 0 0 1 4.56-.75` }],
    [`path`, { d: `M19 2H5a2 2 0 0 0-2 2v5a2 2 0 0 0 .688 1.5` }],
    [`path`, { d: `M12 18h.01` }],
  ],
  Ef = [
    [`path`, { d: `M3 3h18` }],
    [`path`, { d: `M20 7H8` }],
    [`path`, { d: `M20 11H8` }],
    [`path`, { d: `M10 19h10` }],
    [`path`, { d: `M8 15h12` }],
    [`path`, { d: `M4 3v14` }],
    [`circle`, { cx: `4`, cy: `19`, r: `2` }],
  ],
  Df = [
    [
      `path`,
      {
        d: `M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2`,
      },
    ],
    [`rect`, { x: `14`, y: `2`, width: `8`, height: `8`, rx: `1` }],
  ],
  Of = [
    [`path`, { d: `m7 7 10 10-5 5V2l5 5L7 17` }],
    [`line`, { x1: `18`, x2: `21`, y1: `12`, y2: `12` }],
    [`line`, { x1: `3`, x2: `6`, y1: `12`, y2: `12` }],
  ],
  kf = [
    [`path`, { d: `m17 17-5 5V12l-5 5` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M14.5 9.5 17 7l-5-5v4.5` }],
  ],
  Af = [[`path`, { d: `m7 7 10 10-5 5V2l5 5L7 17` }]],
  jf = [
    [`path`, { d: `m7 7 10 10-5 5V2l5 5L7 17` }],
    [`path`, { d: `M20.83 14.83a4 4 0 0 0 0-5.66` }],
    [`path`, { d: `M18 12h.01` }],
  ],
  Mf = [
    [
      `path`,
      {
        d: `M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8`,
      },
    ],
  ],
  Nf = [
    [
      `path`,
      {
        d: `M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z`,
      },
    ],
    [`circle`, { cx: `12`, cy: `12`, r: `4` }],
  ],
  Pf = [
    [`circle`, { cx: `11`, cy: `13`, r: `9` }],
    [
      `path`,
      {
        d: `M14.35 4.65 16.3 2.7a2.41 2.41 0 0 1 3.4 0l1.6 1.6a2.4 2.4 0 0 1 0 3.4l-1.95 1.95`,
      },
    ],
    [`path`, { d: `m22 2-1.5 1.5` }],
  ],
  Ff = [
    [
      `path`,
      {
        d: `M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20`,
      },
    ],
    [`path`, { d: `m8 13 4-7 4 7` }],
    [`path`, { d: `M9.1 11h5.7` }],
  ],
  If = [
    [
      `path`,
      {
        d: `M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z`,
      },
    ],
  ],
  Lf = [
    [`path`, { d: `M12 13h.01` }],
    [`path`, { d: `M12 6v3` }],
    [
      `path`,
      {
        d: `M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20`,
      },
    ],
  ],
  Rf = [
    [`path`, { d: `M12 6v7` }],
    [`path`, { d: `M16 8v3` }],
    [
      `path`,
      {
        d: `M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20`,
      },
    ],
    [`path`, { d: `M8 8v3` }],
  ],
  zf = [
    [
      `path`,
      {
        d: `M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20`,
      },
    ],
    [`path`, { d: `m9 9.5 2 2 4-4` }],
  ],
  Bf = [
    [`path`, { d: `M5 7a2 2 0 0 0-2 2v11` }],
    [`path`, { d: `M5.803 18H5a2 2 0 0 0 0 4h9.5a.5.5 0 0 0 .5-.5V21` }],
    [
      `path`,
      {
        d: `M9 15V4a2 2 0 0 1 2-2h9.5a.5.5 0 0 1 .5.5v14a.5.5 0 0 1-.5.5H11a2 2 0 0 1 0-4h10`,
      },
    ],
  ],
  Vf = [
    [`path`, { d: `M12 17h1.5` }],
    [`path`, { d: `M12 22h1.5` }],
    [`path`, { d: `M12 2h1.5` }],
    [`path`, { d: `M17.5 22H19a1 1 0 0 0 1-1` }],
    [`path`, { d: `M17.5 2H19a1 1 0 0 1 1 1v1.5` }],
    [`path`, { d: `M20 14v3h-2.5` }],
    [`path`, { d: `M20 8.5V10` }],
    [`path`, { d: `M4 10V8.5` }],
    [`path`, { d: `M4 19.5V14` }],
    [`path`, { d: `M4 4.5A2.5 2.5 0 0 1 6.5 2H8` }],
    [`path`, { d: `M8 22H6.5a1 1 0 0 1 0-5H8` }],
  ],
  Hf = [
    [`path`, { d: `M12 13V7` }],
    [
      `path`,
      {
        d: `M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20`,
      },
    ],
    [`path`, { d: `m9 10 3 3 3-3` }],
  ],
  Uf = [
    [
      `path`,
      {
        d: `M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20`,
      },
    ],
    [`path`, { d: `M8 12v-2a4 4 0 0 1 8 0v2` }],
    [`circle`, { cx: `15`, cy: `12`, r: `1` }],
    [`circle`, { cx: `9`, cy: `12`, r: `1` }],
  ],
  Wf = [
    [`path`, { d: `m20 13.7-2.1-2.1a2 2 0 0 0-2.8 0L9.7 17` }],
    [
      `path`,
      {
        d: `M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20`,
      },
    ],
    [`circle`, { cx: `10`, cy: `8`, r: `2` }],
  ],
  Gf = [
    [
      `path`,
      {
        d: `M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20`,
      },
    ],
    [
      `path`,
      {
        d: `M8.62 9.8A2.25 2.25 0 1 1 12 6.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z`,
      },
    ],
  ],
  Kf = [
    [`path`, { d: `M13 2H6.5A2.5 2.5 0 0 0 4 4.5v15` }],
    [`path`, { d: `M17 2v6` }],
    [`path`, { d: `M17 4h2` }],
    [`path`, { d: `M20 15.2V21a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20` }],
    [`circle`, { cx: `17`, cy: `10`, r: `2` }],
  ],
  qf = [
    [`path`, { d: `M18 6V4a2 2 0 1 0-4 0v2` }],
    [`path`, { d: `M20 15v6a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20` }],
    [`path`, { d: `M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H10` }],
    [`rect`, { x: `12`, y: `6`, width: `8`, height: `5`, rx: `1` }],
  ],
  Jf = [
    [`path`, { d: `M10 2v8l3-3 3 3V2` }],
    [
      `path`,
      {
        d: `M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20`,
      },
    ],
  ],
  Yf = [
    [
      `path`,
      {
        d: `M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20`,
      },
    ],
    [`path`, { d: `M9 10h6` }],
  ],
  Xf = [
    [`path`, { d: `M12 21V7` }],
    [`path`, { d: `m16 12 2 2 4-4` }],
    [
      `path`,
      {
        d: `M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3`,
      },
    ],
  ],
  Zf = [
    [`path`, { d: `M12 7v14` }],
    [`path`, { d: `M16 12h2` }],
    [`path`, { d: `M16 8h2` }],
    [
      `path`,
      {
        d: `M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z`,
      },
    ],
    [`path`, { d: `M6 12h2` }],
    [`path`, { d: `M6 8h2` }],
  ],
  Qf = [
    [`path`, { d: `M12 7v14` }],
    [
      `path`,
      {
        d: `M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z`,
      },
    ],
  ],
  $f = [
    [`path`, { d: `M12 7v6` }],
    [
      `path`,
      {
        d: `M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20`,
      },
    ],
    [`path`, { d: `M9 10h6` }],
  ],
  ep = [
    [`path`, { d: `M11 22H5.5a1 1 0 0 1 0-5h4.501` }],
    [`path`, { d: `m21 22-1.879-1.878` }],
    [`path`, { d: `M3 19.5v-15A2.5 2.5 0 0 1 5.5 2H18a1 1 0 0 1 1 1v8` }],
    [`circle`, { cx: `17`, cy: `18`, r: `3` }],
  ],
  tp = [
    [
      `path`,
      {
        d: `M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20`,
      },
    ],
    [`path`, { d: `M8 11h8` }],
    [`path`, { d: `M8 7h6` }],
  ],
  np = [
    [`path`, { d: `M10 13h4` }],
    [`path`, { d: `M12 6v7` }],
    [`path`, { d: `M16 8V6H8v2` }],
    [
      `path`,
      {
        d: `M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20`,
      },
    ],
  ],
  rp = [
    [`path`, { d: `M12 13V7` }],
    [
      `path`,
      { d: `M18 2h1a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20` },
    ],
    [`path`, { d: `M4 19.5v-15A2.5 2.5 0 0 1 6.5 2` }],
    [`path`, { d: `m9 10 3-3 3 3` }],
    [`path`, { d: `m9 5 3-3 3 3` }],
  ],
  ip = [
    [`path`, { d: `M12 13V7` }],
    [
      `path`,
      {
        d: `M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20`,
      },
    ],
    [`path`, { d: `m9 10 3-3 3 3` }],
  ],
  ap = [
    [`path`, { d: `M15 13a3 3 0 1 0-6 0` }],
    [
      `path`,
      {
        d: `M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20`,
      },
    ],
    [`circle`, { cx: `12`, cy: `8`, r: `2` }],
  ],
  op = [
    [`path`, { d: `m14.5 7-5 5` }],
    [
      `path`,
      {
        d: `M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20`,
      },
    ],
    [`path`, { d: `m9.5 7 5 5` }],
  ],
  sp = [
    [
      `path`,
      {
        d: `M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z`,
      },
    ],
    [`path`, { d: `m9 10 2 2 4-4` }],
  ],
  cp = [
    [
      `path`,
      {
        d: `M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20`,
      },
    ],
  ],
  lp = [
    [`path`, { d: `M15 10H9` }],
    [
      `path`,
      {
        d: `M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z`,
      },
    ],
  ],
  up = [
    [
      `path`,
      {
        d: `M19 19v1a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5`,
      },
    ],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M8.656 3H17a2 2 0 0 1 2 2v8.344` }],
  ],
  dp = [
    [`path`, { d: `M12 7v6` }],
    [`path`, { d: `M15 10H9` }],
    [
      `path`,
      {
        d: `M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z`,
      },
    ],
  ],
  fp = [
    [`path`, { d: `m14.5 7.5-5 5` }],
    [
      `path`,
      {
        d: `M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z`,
      },
    ],
    [`path`, { d: `m9.5 7.5 5 5` }],
  ],
  pp = [
    [
      `path`,
      {
        d: `M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z`,
      },
    ],
  ],
  mp = [
    [`path`, { d: `M4 9V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4` }],
    [`path`, { d: `M8 8v1` }],
    [`path`, { d: `M12 8v1` }],
    [`path`, { d: `M16 8v1` }],
    [`rect`, { width: `20`, height: `12`, x: `2`, y: `9`, rx: `2` }],
    [`circle`, { cx: `8`, cy: `15`, r: `2` }],
    [`circle`, { cx: `16`, cy: `15`, r: `2` }],
  ],
  hp = [
    [`path`, { d: `M12 6V2H8` }],
    [`path`, { d: `M15 11v2` }],
    [`path`, { d: `M2 12h2` }],
    [`path`, { d: `M20 12h2` }],
    [
      `path`,
      {
        d: `M20 16a2 2 0 0 1-2 2H8.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 4 20.286V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z`,
      },
    ],
    [`path`, { d: `M9 11v2` }],
  ],
  gp = [
    [`path`, { d: `M13.67 8H18a2 2 0 0 1 2 2v4.33` }],
    [`path`, { d: `M2 14h2` }],
    [`path`, { d: `M20 14h2` }],
    [`path`, { d: `M22 22 2 2` }],
    [
      `path`,
      { d: `M8 8H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 1.414-.586` },
    ],
    [`path`, { d: `M9 13v2` }],
    [`path`, { d: `M9.67 4H12v2.33` }],
  ],
  _p = [
    [`path`, { d: `M12 8V4H8` }],
    [`rect`, { width: `16`, height: `12`, x: `4`, y: `8`, rx: `2` }],
    [`path`, { d: `M2 14h2` }],
    [`path`, { d: `M20 14h2` }],
    [`path`, { d: `M15 13v2` }],
    [`path`, { d: `M9 13v2` }],
  ],
  vp = [
    [
      `path`,
      {
        d: `M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a6 6 0 0 0 1.2 3.6l.6.8A6 6 0 0 1 17 13v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-8a6 6 0 0 1 1.2-3.6l.6-.8A6 6 0 0 0 10 5z`,
      },
    ],
    [`path`, { d: `M17 13h-4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h4` }],
  ],
  yp = [
    [`path`, { d: `M17 3h4v4` }],
    [
      `path`,
      {
        d: `M18.575 11.082a13 13 0 0 1 1.048 9.027 1.17 1.17 0 0 1-1.914.597L14 17`,
      },
    ],
    [
      `path`,
      { d: `M7 10 3.29 6.29a1.17 1.17 0 0 1 .6-1.91 13 13 0 0 1 9.03 1.05` },
    ],
    [
      `path`,
      {
        d: `M7 14a1.7 1.7 0 0 0-1.207.5l-2.646 2.646A.5.5 0 0 0 3.5 18H5a1 1 0 0 1 1 1v1.5a.5.5 0 0 0 .854.354L9.5 18.207A1.7 1.7 0 0 0 10 17v-2a1 1 0 0 0-1-1z`,
      },
    ],
    [`path`, { d: `M9.707 14.293 21 3` }],
  ],
  bp = [
    [
      `path`,
      {
        d: `M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z`,
      },
    ],
    [`path`, { d: `m3.3 7 8.7 5 8.7-5` }],
    [`path`, { d: `M12 22V12` }],
  ],
  xp = [
    [
      `path`,
      {
        d: `M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z`,
      },
    ],
    [`path`, { d: `m7 16.5-4.74-2.85` }],
    [`path`, { d: `m7 16.5 5-3` }],
    [`path`, { d: `M7 16.5v5.17` }],
    [
      `path`,
      {
        d: `M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z`,
      },
    ],
    [`path`, { d: `m17 16.5-5-3` }],
    [`path`, { d: `m17 16.5 4.74-2.85` }],
    [`path`, { d: `M17 16.5v5.17` }],
    [
      `path`,
      {
        d: `M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z`,
      },
    ],
    [`path`, { d: `M12 8 7.26 5.15` }],
    [`path`, { d: `m12 8 4.74-2.85` }],
    [`path`, { d: `M12 13.5V8` }],
  ],
  Sp = [
    [
      `path`,
      {
        d: `M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1`,
      },
    ],
    [
      `path`,
      {
        d: `M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1`,
      },
    ],
  ],
  Cp = [
    [`path`, { d: `M16 3h3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-3` }],
    [`path`, { d: `M8 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h3` }],
  ],
  wp = [
    [
      `path`,
      {
        d: `M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z`,
      },
    ],
    [`path`, { d: `M9 13a4.5 4.5 0 0 0 3-4` }],
    [`path`, { d: `M6.003 5.125A3 3 0 0 0 6.401 6.5` }],
    [`path`, { d: `M3.477 10.896a4 4 0 0 1 .585-.396` }],
    [`path`, { d: `M6 18a4 4 0 0 1-1.967-.516` }],
    [`path`, { d: `M12 13h4` }],
    [`path`, { d: `M12 18h6a2 2 0 0 1 2 2v1` }],
    [`path`, { d: `M12 8h8` }],
    [`path`, { d: `M16 8V5a2 2 0 0 1 2-2` }],
    [`circle`, { cx: `16`, cy: `13`, r: `.5` }],
    [`circle`, { cx: `18`, cy: `3`, r: `.5` }],
    [`circle`, { cx: `20`, cy: `21`, r: `.5` }],
    [`circle`, { cx: `20`, cy: `8`, r: `.5` }],
  ],
  Tp = [
    [`path`, { d: `M12 18V5` }],
    [`path`, { d: `M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4` }],
    [`path`, { d: `M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5` }],
    [`path`, { d: `M17.997 5.125a4 4 0 0 1 2.526 5.77` }],
    [`path`, { d: `M18 18a4 4 0 0 0 2-7.464` }],
    [`path`, { d: `M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517` }],
    [`path`, { d: `M6 18a4 4 0 0 1-2-7.464` }],
    [`path`, { d: `M6.003 5.125a4 4 0 0 0-2.526 5.77` }],
  ],
  Ep = [
    [`path`, { d: `m10.852 14.772-.383.923` }],
    [`path`, { d: `m10.852 9.228-.383-.923` }],
    [`path`, { d: `m13.148 14.772.382.924` }],
    [`path`, { d: `m13.531 8.305-.383.923` }],
    [`path`, { d: `m14.772 10.852.923-.383` }],
    [`path`, { d: `m14.772 13.148.923.383` }],
    [
      `path`,
      {
        d: `M17.598 6.5A3 3 0 1 0 12 5a3 3 0 0 0-5.63-1.446 3 3 0 0 0-.368 1.571 4 4 0 0 0-2.525 5.771`,
      },
    ],
    [`path`, { d: `M17.998 5.125a4 4 0 0 1 2.525 5.771` }],
    [`path`, { d: `M19.505 10.294a4 4 0 0 1-1.5 7.706` }],
    [
      `path`,
      {
        d: `M4.032 17.483A4 4 0 0 0 11.464 20c.18-.311.892-.311 1.072 0a4 4 0 0 0 7.432-2.516`,
      },
    ],
    [`path`, { d: `M4.5 10.291A4 4 0 0 0 6 18` }],
    [`path`, { d: `M6.002 5.125a3 3 0 0 0 .4 1.375` }],
    [`path`, { d: `m9.228 10.852-.923-.383` }],
    [`path`, { d: `m9.228 13.148-.923.383` }],
    [`circle`, { cx: `12`, cy: `12`, r: `3` }],
  ],
  Dp = [
    [`path`, { d: `M16 3v2.107` }],
    [
      `path`,
      {
        d: `M17 9c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 22 17a5 5 0 0 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C13 11.5 16 9 17 9`,
      },
    ],
    [
      `path`,
      { d: `M21 8.274V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.938` },
    ],
    [`path`, { d: `M3 15h5.253` }],
    [`path`, { d: `M3 9h8.228` }],
    [`path`, { d: `M8 15v6` }],
    [`path`, { d: `M8 3v6` }],
  ],
  Op = [
    [`path`, { d: `M12 9v1.258` }],
    [`path`, { d: `M16 3v5.46` }],
    [
      `path`,
      { d: `M21 9.118V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5.75` },
    ],
    [
      `path`,
      {
        d: `M22 17.5c0 2.499-1.75 3.749-3.83 4.474a.5.5 0 0 1-.335-.005c-2.085-.72-3.835-1.97-3.835-4.47V14a.5.5 0 0 1 .5-.499c1 0 2.25-.6 3.12-1.36a.6.6 0 0 1 .76-.001c.875.765 2.12 1.36 3.12 1.36a.5.5 0 0 1 .5.5z`,
      },
    ],
    [`path`, { d: `M3 15h7` }],
    [`path`, { d: `M3 9h12.142` }],
    [`path`, { d: `M8 15v6` }],
    [`path`, { d: `M8 3v6` }],
  ],
  kp = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M12 9v6` }],
    [`path`, { d: `M16 15v6` }],
    [`path`, { d: `M16 3v6` }],
    [`path`, { d: `M3 15h18` }],
    [`path`, { d: `M3 9h18` }],
    [`path`, { d: `M8 15v6` }],
    [`path`, { d: `M8 3v6` }],
  ],
  Ap = [
    [`path`, { d: `M10 20v2` }],
    [`path`, { d: `M14 20v2` }],
    [`path`, { d: `M18 20v2` }],
    [`path`, { d: `M21 20H3` }],
    [`path`, { d: `M6 20v2` }],
    [`path`, { d: `M8 16V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12` }],
    [`rect`, { x: `4`, y: `6`, width: `16`, height: `10`, rx: `2` }],
  ],
  jp = [
    [`path`, { d: `M12 12h.01` }],
    [`path`, { d: `M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2` }],
    [`path`, { d: `M22 13a18.15 18.15 0 0 1-20 0` }],
    [`rect`, { width: `20`, height: `14`, x: `2`, y: `6`, rx: `2` }],
  ],
  Mp = [
    [`path`, { d: `M12 11v4` }],
    [`path`, { d: `M14 13h-4` }],
    [`path`, { d: `M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2` }],
    [`path`, { d: `M18 6v14` }],
    [`path`, { d: `M6 6v14` }],
    [`rect`, { width: `20`, height: `14`, x: `2`, y: `6`, rx: `2` }],
  ],
  Np = [
    [`path`, { d: `M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16` }],
    [`rect`, { width: `20`, height: `14`, x: `2`, y: `6`, rx: `2` }],
  ],
  Pp = [
    [`rect`, { x: `8`, y: `8`, width: `8`, height: `8`, rx: `2` }],
    [`path`, { d: `M4 10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2` }],
    [`path`, { d: `M14 20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2` }],
  ],
  Fp = [
    [`path`, { d: `M10 13a3 3 0 0 1-2.121-5.121` }],
    [
      `path`,
      {
        d: `M15.606 14.204c-3.5 1.5-5.899 4.503-8.899 7.503A1 1 0 0 1 6 22c-2 0-4-2-4-4a1 1 0 0 1 .293-.707c1.911-1.911 3.823-3.578 5.347-5.441`,
      },
    ],
    [`path`, { d: `M16.573 14.737A4 4 0 0 1 14 11` }],
    [
      `path`,
      {
        d: `M7.14 10.907a4 4 0 1 1 2.756-7.43A4 4 0 0 1 16.7 4.48a2 2 0 0 1 2.82 2.82 4 4 0 0 1 1.002 6.805A4 4 0 1 1 13 16`,
      },
    ],
  ],
  Ip = [
    [`path`, { d: `m16 22-1-4` }],
    [
      `path`,
      {
        d: `M19 14a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v1a1 1 0 0 0 1 1`,
      },
    ],
    [
      `path`,
      { d: `M19 14H5l-1.973 6.767A1 1 0 0 0 4 22h16a1 1 0 0 0 .973-1.233z` },
    ],
    [`path`, { d: `m8 22 1-4` }],
  ],
  Lp = [
    [`path`, { d: `m11 10 3 3` }],
    [
      `path`,
      {
        d: `M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z`,
      },
    ],
    [
      `path`,
      { d: `M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031` },
    ],
  ],
  Rp = [
    [`path`, { d: `M7.001 15.085A1.5 1.5 0 0 1 9 16.5` }],
    [`circle`, { cx: `18.5`, cy: `8.5`, r: `3.5` }],
    [`circle`, { cx: `7.5`, cy: `16.5`, r: `5.5` }],
    [`circle`, { cx: `7.5`, cy: `4.5`, r: `2.5` }],
  ],
  zp = [
    [`path`, { d: `M12 20v-8` }],
    [`path`, { d: `M12.656 7H14a4 4 0 0 1 4 4v1.344` }],
    [`path`, { d: `M14.12 3.88 16 2` }],
    [`path`, { d: `M17.123 17.123A6 6 0 0 1 6 14v-3a4 4 0 0 1 1.72-3.287` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M21 5a4 4 0 0 1-3.55 3.97` }],
    [`path`, { d: `M22 13h-3.344` }],
    [`path`, { d: `M3 21a4 4 0 0 1 3.81-4` }],
    [`path`, { d: `M3 5a4 4 0 0 0 3.55 3.97` }],
    [`path`, { d: `M6 13H2` }],
    [`path`, { d: `m8 2 1.88 1.88` }],
    [`path`, { d: `M9.712 4.06A3 3 0 0 1 15 6v1.13` }],
  ],
  Bp = [
    [
      `path`,
      { d: `M10 19.655A6 6 0 0 1 6 14v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 3.97` },
    ],
    [
      `path`,
      {
        d: `M14 15.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997a1 1 0 0 1-1.517-.86z`,
      },
    ],
    [`path`, { d: `M14.12 3.88 16 2` }],
    [`path`, { d: `M21 5a4 4 0 0 1-3.55 3.97` }],
    [`path`, { d: `M3 21a4 4 0 0 1 3.81-4` }],
    [`path`, { d: `M3 5a4 4 0 0 0 3.55 3.97` }],
    [`path`, { d: `M6 13H2` }],
    [`path`, { d: `m8 2 1.88 1.88` }],
    [`path`, { d: `M9 7.13V6a3 3 0 1 1 6 0v1.13` }],
  ],
  Vp = [
    [`path`, { d: `M10 12h4` }],
    [`path`, { d: `M10 8h4` }],
    [`path`, { d: `M14 21v-3a2 2 0 0 0-4 0v3` }],
    [
      `path`,
      {
        d: `M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2`,
      },
    ],
    [`path`, { d: `M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16` }],
  ],
  Hp = [
    [`path`, { d: `M12 20v-9` }],
    [`path`, { d: `M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z` }],
    [`path`, { d: `M14.12 3.88 16 2` }],
    [`path`, { d: `M21 21a4 4 0 0 0-3.81-4` }],
    [`path`, { d: `M21 5a4 4 0 0 1-3.55 3.97` }],
    [`path`, { d: `M22 13h-4` }],
    [`path`, { d: `M3 21a4 4 0 0 1 3.81-4` }],
    [`path`, { d: `M3 5a4 4 0 0 0 3.55 3.97` }],
    [`path`, { d: `M6 13H2` }],
    [`path`, { d: `m8 2 1.88 1.88` }],
    [`path`, { d: `M9 7.13V6a3 3 0 1 1 6 0v1.13` }],
  ],
  Up = [
    [`path`, { d: `M12 10h.01` }],
    [`path`, { d: `M12 14h.01` }],
    [`path`, { d: `M12 6h.01` }],
    [`path`, { d: `M16 10h.01` }],
    [`path`, { d: `M16 14h.01` }],
    [`path`, { d: `M16 6h.01` }],
    [`path`, { d: `M8 10h.01` }],
    [`path`, { d: `M8 14h.01` }],
    [`path`, { d: `M8 6h.01` }],
    [`path`, { d: `M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3` }],
    [`rect`, { x: `4`, y: `2`, width: `16`, height: `20`, rx: `2` }],
  ],
  Wp = [
    [`path`, { d: `M4 6 2 7` }],
    [`path`, { d: `M10 6h4` }],
    [`path`, { d: `m22 7-2-1` }],
    [`rect`, { width: `16`, height: `16`, x: `4`, y: `3`, rx: `2` }],
    [`path`, { d: `M4 11h16` }],
    [`path`, { d: `M8 15h.01` }],
    [`path`, { d: `M16 15h.01` }],
    [`path`, { d: `M6 19v2` }],
    [`path`, { d: `M18 21v-2` }],
  ],
  Gp = [
    [`path`, { d: `M10 3h.01` }],
    [`path`, { d: `M14 2h.01` }],
    [`path`, { d: `m2 9 20-5` }],
    [`path`, { d: `M12 12V6.5` }],
    [`rect`, { width: `16`, height: `10`, x: `4`, y: `12`, rx: `3` }],
    [`path`, { d: `M9 12v5` }],
    [`path`, { d: `M15 12v5` }],
    [`path`, { d: `M4 17h16` }],
  ],
  Kp = [
    [
      `path`,
      {
        d: `M17 19a1 1 0 0 1-1-1v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a1 1 0 0 1-1 1z`,
      },
    ],
    [`path`, { d: `M17 21v-2` }],
    [`path`, { d: `M19 14V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V10` }],
    [`path`, { d: `M21 21v-2` }],
    [`path`, { d: `M3 5V3` }],
    [
      `path`,
      {
        d: `M4 10a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M7 5V3` }],
  ],
  qp = [
    [`path`, { d: `M8 6v6` }],
    [`path`, { d: `M15 6v6` }],
    [`path`, { d: `M2 12h19.6` }],
    [
      `path`,
      {
        d: `M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3`,
      },
    ],
    [`circle`, { cx: `7`, cy: `18`, r: `2` }],
    [`path`, { d: `M9 18h5` }],
    [`circle`, { cx: `16`, cy: `18`, r: `2` }],
  ],
  Jp = [
    [`path`, { d: `M16 13H3` }],
    [`path`, { d: `M16 17H3` }],
    [
      `path`,
      {
        d: `m7.2 7.9-3.388 2.5A2 2 0 0 0 3 12.01V20a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-8.654c0-2-2.44-6.026-6.44-8.026a1 1 0 0 0-1.082.057L10.4 5.6`,
      },
    ],
    [`circle`, { cx: `9`, cy: `7`, r: `2` }],
  ],
  Yp = [
    [`path`, { d: `M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8` }],
    [`path`, { d: `M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1` }],
    [`path`, { d: `M2 21h20` }],
    [`path`, { d: `M7 8v3` }],
    [`path`, { d: `M12 8v3` }],
    [`path`, { d: `M17 8v3` }],
    [`path`, { d: `M7 4h.01` }],
    [`path`, { d: `M12 4h.01` }],
    [`path`, { d: `M17 4h.01` }],
  ],
  Xp = [
    [`rect`, { width: `16`, height: `20`, x: `4`, y: `2`, rx: `2` }],
    [`line`, { x1: `8`, x2: `16`, y1: `6`, y2: `6` }],
    [`line`, { x1: `16`, x2: `16`, y1: `14`, y2: `18` }],
    [`path`, { d: `M16 10h.01` }],
    [`path`, { d: `M12 10h.01` }],
    [`path`, { d: `M8 10h.01` }],
    [`path`, { d: `M12 14h.01` }],
    [`path`, { d: `M8 14h.01` }],
    [`path`, { d: `M12 18h.01` }],
    [`path`, { d: `M8 18h.01` }],
  ],
  Zp = [
    [`path`, { d: `M11 14h1v4` }],
    [`path`, { d: `M16 2v4` }],
    [`path`, { d: `M3 10h18` }],
    [`path`, { d: `M8 2v4` }],
    [`rect`, { x: `3`, y: `4`, width: `18`, height: `18`, rx: `2` }],
  ],
  Qp = [
    [`path`, { d: `m14 18 4 4 4-4` }],
    [`path`, { d: `M16 2v4` }],
    [`path`, { d: `M18 14v8` }],
    [
      `path`,
      {
        d: `M21 11.354V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.343`,
      },
    ],
    [`path`, { d: `M3 10h18` }],
    [`path`, { d: `M8 2v4` }],
  ],
  $p = [
    [`path`, { d: `m14 18 4-4 4 4` }],
    [`path`, { d: `M16 2v4` }],
    [`path`, { d: `M18 22v-8` }],
    [
      `path`,
      { d: `M21 11.343V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9` },
    ],
    [`path`, { d: `M3 10h18` }],
    [`path`, { d: `M8 2v4` }],
  ],
  em = [
    [`path`, { d: `M8 2v4` }],
    [`path`, { d: `M16 2v4` }],
    [
      `path`,
      { d: `M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8` },
    ],
    [`path`, { d: `M3 10h18` }],
    [`path`, { d: `m16 20 2 2 4-4` }],
  ],
  tm = [
    [`path`, { d: `M8 2v4` }],
    [`path`, { d: `M16 2v4` }],
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `4`, rx: `2` }],
    [`path`, { d: `M3 10h18` }],
    [`path`, { d: `m9 16 2 2 4-4` }],
  ],
  nm = [
    [`path`, { d: `m15.228 16.852-.923-.383` }],
    [`path`, { d: `m15.228 19.148-.923.383` }],
    [`path`, { d: `M16 2v4` }],
    [`path`, { d: `m16.47 14.305.382.923` }],
    [`path`, { d: `m16.852 20.772-.383.924` }],
    [`path`, { d: `m19.148 15.228.383-.923` }],
    [`path`, { d: `m19.53 21.696-.382-.924` }],
    [`path`, { d: `m20.772 16.852.924-.383` }],
    [`path`, { d: `m20.772 19.148.924.383` }],
    [
      `path`,
      { d: `M21 10.592V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6` },
    ],
    [`path`, { d: `M3 10h18` }],
    [`path`, { d: `M8 2v4` }],
    [`circle`, { cx: `18`, cy: `18`, r: `3` }],
  ],
  rm = [
    [`path`, { d: `M16 14v2.2l1.6 1` }],
    [`path`, { d: `M16 2v4` }],
    [
      `path`,
      { d: `M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5` },
    ],
    [`path`, { d: `M3 10h5` }],
    [`path`, { d: `M8 2v4` }],
    [`circle`, { cx: `16`, cy: `16`, r: `6` }],
  ],
  im = [
    [`path`, { d: `M8 2v4` }],
    [`path`, { d: `M16 2v4` }],
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `4`, rx: `2` }],
    [`path`, { d: `M3 10h18` }],
    [`path`, { d: `M8 14h.01` }],
    [`path`, { d: `M12 14h.01` }],
    [`path`, { d: `M16 14h.01` }],
    [`path`, { d: `M8 18h.01` }],
    [`path`, { d: `M12 18h.01` }],
    [`path`, { d: `M16 18h.01` }],
  ],
  am = [
    [
      `path`,
      {
        d: `M3 20a2 2 0 0 0 2 2h10a2.4 2.4 0 0 0 1.706-.706l3.588-3.588A2.4 2.4 0 0 0 21 16V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z`,
      },
    ],
    [`path`, { d: `M15 22v-5a1 1 0 0 1 1-1h5` }],
    [`path`, { d: `M8 2v4` }],
    [`path`, { d: `M16 2v4` }],
    [`path`, { d: `M3 10h18` }],
  ],
  om = [
    [
      `path`,
      {
        d: `M12.127 22H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.125`,
      },
    ],
    [
      `path`,
      {
        d: `M14.62 18.8A2.25 2.25 0 1 1 18 15.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z`,
      },
    ],
    [`path`, { d: `M16 2v4` }],
    [`path`, { d: `M3 10h18` }],
    [`path`, { d: `M8 2v4` }],
  ],
  sm = [
    [`path`, { d: `M8 2v4` }],
    [`path`, { d: `M16 2v4` }],
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `4`, rx: `2` }],
    [`path`, { d: `M3 10h18` }],
    [`path`, { d: `M10 16h4` }],
  ],
  cm = [
    [`path`, { d: `M16 19h6` }],
    [`path`, { d: `M16 2v4` }],
    [
      `path`,
      { d: `M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5` },
    ],
    [`path`, { d: `M3 10h18` }],
    [`path`, { d: `M8 2v4` }],
  ],
  lm = [
    [
      `path`,
      { d: `M4.2 4.2A2 2 0 0 0 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 1.82-1.18` },
    ],
    [`path`, { d: `M21 15.5V6a2 2 0 0 0-2-2H9.5` }],
    [`path`, { d: `M16 2v4` }],
    [`path`, { d: `M3 10h7` }],
    [`path`, { d: `M21 10h-5.5` }],
    [`path`, { d: `m2 2 20 20` }],
  ],
  um = [
    [`path`, { d: `M8 2v4` }],
    [`path`, { d: `M16 2v4` }],
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `4`, rx: `2` }],
    [`path`, { d: `M3 10h18` }],
    [`path`, { d: `M10 16h4` }],
    [`path`, { d: `M12 14v4` }],
  ],
  dm = [
    [`path`, { d: `M16 19h6` }],
    [`path`, { d: `M16 2v4` }],
    [`path`, { d: `M19 16v6` }],
    [
      `path`,
      { d: `M21 12.598V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5` },
    ],
    [`path`, { d: `M3 10h18` }],
    [`path`, { d: `M8 2v4` }],
  ],
  fm = [
    [`path`, { d: `M16 2v4` }],
    [
      `path`,
      { d: `M21 11.75V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.25` },
    ],
    [`path`, { d: `m22 22-1.875-1.875` }],
    [`path`, { d: `M3 10h18` }],
    [`path`, { d: `M8 2v4` }],
    [`circle`, { cx: `18`, cy: `18`, r: `3` }],
  ],
  pm = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `4`, rx: `2` }],
    [`path`, { d: `M16 2v4` }],
    [`path`, { d: `M3 10h18` }],
    [`path`, { d: `M8 2v4` }],
    [`path`, { d: `M17 14h-6` }],
    [`path`, { d: `M13 18H7` }],
    [`path`, { d: `M7 14h.01` }],
    [`path`, { d: `M17 18h.01` }],
  ],
  mm = [
    [`path`, { d: `M11 10v4h4` }],
    [`path`, { d: `m11 14 1.535-1.605a5 5 0 0 1 8 1.5` }],
    [`path`, { d: `M16 2v4` }],
    [`path`, { d: `m21 18-1.535 1.605a5 5 0 0 1-8-1.5` }],
    [`path`, { d: `M21 22v-4h-4` }],
    [
      `path`,
      { d: `M21 8.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4.3` },
    ],
    [`path`, { d: `M3 10h4` }],
    [`path`, { d: `M8 2v4` }],
  ],
  hm = [
    [`path`, { d: `M8 2v4` }],
    [`path`, { d: `M16 2v4` }],
    [
      `path`,
      { d: `M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8` },
    ],
    [`path`, { d: `M3 10h18` }],
    [`path`, { d: `m17 22 5-5` }],
    [`path`, { d: `m17 17 5 5` }],
  ],
  gm = [
    [`path`, { d: `M8 2v4` }],
    [`path`, { d: `M16 2v4` }],
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `4`, rx: `2` }],
    [`path`, { d: `M3 10h18` }],
    [`path`, { d: `m14 14-4 4` }],
    [`path`, { d: `m10 14 4 4` }],
  ],
  _m = [
    [`path`, { d: `M8 2v4` }],
    [`path`, { d: `M16 2v4` }],
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `4`, rx: `2` }],
    [`path`, { d: `M3 10h18` }],
  ],
  vm = [
    [`path`, { d: `M14.564 14.558a3 3 0 1 1-4.122-4.121` }],
    [`path`, { d: `m2 2 20 20` }],
    [
      `path`,
      { d: `M20 20H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 .819-.175` },
    ],
    [
      `path`,
      {
        d: `M9.695 4.024A2 2 0 0 1 10.004 4h3.993a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v7.344`,
      },
    ],
  ],
  ym = [
    [`path`, { d: `M12 2v2` }],
    [
      `path`,
      { d: `M15.726 21.01A2 2 0 0 1 14 22H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2` },
    ],
    [`path`, { d: `M18 2v2` }],
    [`path`, { d: `M2 13h2` }],
    [`path`, { d: `M8 8h14` }],
    [`rect`, { x: `8`, y: `3`, width: `14`, height: `14`, rx: `2` }],
  ],
  bm = [
    [
      `path`,
      {
        d: `M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z`,
      },
    ],
    [`circle`, { cx: `12`, cy: `13`, r: `3` }],
  ],
  xm = [
    [`path`, { d: `m10.8 5 2.111 4.223` }],
    [`path`, { d: `M17.75 7 15 2.1` }],
    [`path`, { d: `m4.874 14.647 2.12 4.24` }],
    [
      `path`,
      {
        d: `M5.7 21a2 2 0 0 1-3.5-2l8.6-14a6 6 0 0 1 10.4 6 2 2 0 1 1-3.464-2 2 2 0 1 0-3.464-2z`,
      },
    ],
    [`path`, { d: `m7.906 9.712 2.005 4.411` }],
  ],
  Sm = [
    [`path`, { d: `M10 10v7.9` }],
    [`path`, { d: `M11.802 6.145a5 5 0 0 1 6.053 6.053` }],
    [`path`, { d: `M14 6.1v2.243` }],
    [
      `path`,
      {
        d: `m15.5 15.571-.964.964a5 5 0 0 1-7.071 0 5 5 0 0 1 0-7.07l.964-.965`,
      },
    ],
    [
      `path`,
      {
        d: `M16 7V3a1 1 0 0 1 1.707-.707 2.5 2.5 0 0 0 2.152.717 1 1 0 0 1 1.131 1.131 2.5 2.5 0 0 0 .717 2.152A1 1 0 0 1 21 8h-4`,
      },
    ],
    [`path`, { d: `m2 2 20 20` }],
    [
      `path`,
      {
        d: `M8 17v4a1 1 0 0 1-1.707.707 2.5 2.5 0 0 0-2.152-.717 1 1 0 0 1-1.131-1.131 2.5 2.5 0 0 0-.717-2.152A1 1 0 0 1 3 16h4`,
      },
    ],
  ],
  Cm = [
    [`path`, { d: `M10 7v10.9` }],
    [`path`, { d: `M14 6.1V17` }],
    [
      `path`,
      {
        d: `M16 7V3a1 1 0 0 1 1.707-.707 2.5 2.5 0 0 0 2.152.717 1 1 0 0 1 1.131 1.131 2.5 2.5 0 0 0 .717 2.152A1 1 0 0 1 21 8h-4`,
      },
    ],
    [
      `path`,
      {
        d: `M16.536 7.465a5 5 0 0 0-7.072 0l-2 2a5 5 0 0 0 0 7.07 5 5 0 0 0 7.072 0l2-2a5 5 0 0 0 0-7.07`,
      },
    ],
    [
      `path`,
      {
        d: `M8 17v4a1 1 0 0 1-1.707.707 2.5 2.5 0 0 0-2.152-.717 1 1 0 0 1-1.131-1.131 2.5 2.5 0 0 0-.717-2.152A1 1 0 0 1 3 16h4`,
      },
    ],
  ],
  wm = [
    [`path`, { d: `M12 22v-4c1.5 1.5 3.5 3 6 3 0-1.5-.5-3.5-2-5` }],
    [
      `path`,
      {
        d: `M13.988 8.327C13.902 6.054 13.365 3.82 12 2a9.3 9.3 0 0 0-1.445 2.9`,
      },
    ],
    [
      `path`,
      {
        d: `M17.375 11.725C18.882 10.53 21 7.841 21 6c-2.324 0-5.08 1.296-6.662 2.684`,
      },
    ],
    [`path`, { d: `m2 2 20 20` }],
    [
      `path`,
      {
        d: `M21.024 15.378A15 15 0 0 0 22 15c-.426-1.279-2.67-2.557-4.25-2.907`,
      },
    ],
    [
      `path`,
      {
        d: `M6.995 6.992C5.714 6.4 4.29 6 3 6c0 2 2.5 5 4 6-1.5 0-4.5 1.5-5 3 3.5 1.5 6 1 6 1-1.5 1.5-2 3.5-2 5 2.5 0 4.5-1.5 6-3`,
      },
    ],
  ],
  Tm = [
    [`path`, { d: `M12 22v-4` }],
    [
      `path`,
      {
        d: `M7 12c-1.5 0-4.5 1.5-5 3 3.5 1.5 6 1 6 1-1.5 1.5-2 3.5-2 5 2.5 0 4.5-1.5 6-3 1.5 1.5 3.5 3 6 3 0-1.5-.5-3.5-2-5 0 0 2.5.5 6-1-.5-1.5-3.5-3-5-3 1.5-1 4-4 4-6-2.5 0-5.5 1.5-7 3 0-2.5-.5-5-2-7-1.5 2-2 4.5-2 7-1.5-1.5-4.5-3-7-3 0 2 2.5 5 4 6`,
      },
    ],
  ],
  Em = [
    [`path`, { d: `M10.5 5H19a2 2 0 0 1 2 2v8.5` }],
    [`path`, { d: `M17 11h-.5` }],
    [`path`, { d: `M19 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M7 11h4` }],
    [`path`, { d: `M7 15h2.5` }],
  ],
  Dm = [
    [`rect`, { width: `18`, height: `14`, x: `3`, y: `5`, rx: `2`, ry: `2` }],
    [`path`, { d: `M7 15h4M15 15h2M7 11h2M13 11h4` }],
  ],
  Om = [
    [
      `path`,
      {
        d: `m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8`,
      },
    ],
    [`path`, { d: `M7 14h.01` }],
    [`path`, { d: `M17 14h.01` }],
    [`rect`, { width: `18`, height: `8`, x: `3`, y: `10`, rx: `2` }],
    [`path`, { d: `M5 18v2` }],
    [`path`, { d: `M19 18v2` }],
  ],
  km = [
    [
      `path`,
      {
        d: `M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2`,
      },
    ],
    [`circle`, { cx: `7`, cy: `17`, r: `2` }],
    [`path`, { d: `M9 17h6` }],
    [`circle`, { cx: `17`, cy: `17`, r: `2` }],
  ],
  Am = [
    [`path`, { d: `M10 2h4` }],
    [
      `path`,
      {
        d: `m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8`,
      },
    ],
    [`path`, { d: `M7 14h.01` }],
    [`path`, { d: `M17 14h.01` }],
    [`rect`, { width: `18`, height: `8`, x: `3`, y: `10`, rx: `2` }],
    [`path`, { d: `M5 18v2` }],
    [`path`, { d: `M19 18v2` }],
  ],
  jm = [
    [`path`, { d: `M18 19V9a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v8a2 2 0 0 0 2 2h2` }],
    [`path`, { d: `M2 9h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2` }],
    [
      `path`,
      { d: `M22 17v1a1 1 0 0 1-1 1H10v-9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v9` },
    ],
    [`circle`, { cx: `8`, cy: `19`, r: `2` }],
  ],
  Mm = [
    [`path`, { d: `M12 14v4` }],
    [
      `path`,
      {
        d: `M14.172 2a2 2 0 0 1 1.414.586l3.828 3.828A2 2 0 0 1 20 7.828V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z`,
      },
    ],
    [`path`, { d: `M8 14h8` }],
    [`rect`, { x: `8`, y: `10`, width: `8`, height: `8`, rx: `1` }],
  ],
  Nm = [
    [
      `path`,
      {
        d: `M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7zM8.64 14l-2.05-2.04M15.34 15l-2.46-2.46`,
      },
    ],
    [
      `path`,
      { d: `M22 9s-1.33-2-3.5-2C16.86 7 15 9 15 9s1.33 2 3.5 2S22 9 22 9z` },
    ],
    [
      `path`,
      { d: `M15 2s-2 1.33-2 3.5S15 9 15 9s2-1.84 2-3.5C17 3.33 15 2 15 2z` },
    ],
  ],
  Pm = [
    [`path`, { d: `M10 9v7` }],
    [`path`, { d: `M14 6v10` }],
    [`circle`, { cx: `17.5`, cy: `12.5`, r: `3.5` }],
    [`circle`, { cx: `6.5`, cy: `12.5`, r: `3.5` }],
  ],
  Fm = [
    [`path`, { d: `m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16` }],
    [`path`, { d: `M22 9v7` }],
    [`path`, { d: `M3.304 13h6.392` }],
    [`circle`, { cx: `18.5`, cy: `12.5`, r: `3.5` }],
  ],
  Im = [
    [
      `path`,
      {
        d: `M15 11h4.5a1 1 0 0 1 0 5h-4a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h3a1 1 0 0 1 0 5`,
      },
    ],
    [`path`, { d: `m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16` }],
    [`path`, { d: `M3.304 13h6.392` }],
  ],
  Lm = [
    [
      `path`,
      { d: `M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6` },
    ],
    [`path`, { d: `M2 12a9 9 0 0 1 8 8` }],
    [`path`, { d: `M2 16a5 5 0 0 1 4 4` }],
    [`line`, { x1: `2`, x2: `2.01`, y1: `20`, y2: `20` }],
  ],
  Rm = [
    [`path`, { d: `M10 5V3` }],
    [`path`, { d: `M14 5V3` }],
    [`path`, { d: `M15 21v-3a3 3 0 0 0-6 0v3` }],
    [`path`, { d: `M18 3v8` }],
    [`path`, { d: `M18 5H6` }],
    [`path`, { d: `M22 11H2` }],
    [`path`, { d: `M22 9v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9` }],
    [`path`, { d: `M6 3v8` }],
  ],
  zm = [
    [`rect`, { width: `20`, height: `16`, x: `2`, y: `4`, rx: `2` }],
    [`circle`, { cx: `8`, cy: `10`, r: `2` }],
    [`path`, { d: `M8 12h8` }],
    [`circle`, { cx: `16`, cy: `10`, r: `2` }],
    [
      `path`,
      { d: `m6 20 .7-2.9A1.4 1.4 0 0 1 8.1 16h7.8a1.4 1.4 0 0 1 1.4 1l.7 3` },
    ],
  ],
  Bm = [
    [
      `path`,
      {
        d: `M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z`,
      },
    ],
    [`path`, { d: `M8 14v.5` }],
    [`path`, { d: `M16 14v.5` }],
    [`path`, { d: `M11.25 16.25h1.5L12 17l-.75-.75Z` }],
  ],
  Vm = [
    [
      `path`,
      {
        d: `m12.309 6.652 4.797 2.401a1 1 0 0 1 .447 1.341l-.501 1.001.605.605h2.725a1 1 0 0 1 .894 1.447l-.724 1.448`,
      },
    ],
    [
      `path`,
      {
        d: `m15.166 15.166-.719 1.439a1 1 0 0 1-1.342.447L3.61 12.3a2.92 2.92 0 0 1-1.3-3.91L3.69 5.6a2.9 2.9 0 0 1 .873-1.037`,
      },
    ],
    [`path`, { d: `M2 19h3.76a2 2 0 0 0 1.8-1.1l1.441-2.902` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M2 21v-4` }],
    [`path`, { d: `M7 9h.01` }],
  ],
  Hm = [
    [
      `path`,
      {
        d: `M16.75 12h3.632a1 1 0 0 1 .894 1.447l-2.034 4.069a1 1 0 0 1-1.708.134l-2.124-2.97`,
      },
    ],
    [
      `path`,
      {
        d: `M17.106 9.053a1 1 0 0 1 .447 1.341l-3.106 6.211a1 1 0 0 1-1.342.447L3.61 12.3a2.92 2.92 0 0 1-1.3-3.91L3.69 5.6a2.92 2.92 0 0 1 3.92-1.3z`,
      },
    ],
    [`path`, { d: `M2 19h3.76a2 2 0 0 0 1.8-1.1L9 15` }],
    [`path`, { d: `M2 21v-4` }],
    [`path`, { d: `M7 9h.01` }],
  ],
  Um = [
    [`path`, { d: `M3 3v16a2 2 0 0 0 2 2h16` }],
    [
      `path`,
      {
        d: `M7 11.207a.5.5 0 0 1 .146-.353l2-2a.5.5 0 0 1 .708 0l3.292 3.292a.5.5 0 0 0 .708 0l4.292-4.292a.5.5 0 0 1 .854.353V16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z`,
      },
    ],
  ],
  Wm = [
    [`path`, { d: `M3 3v16a2 2 0 0 0 2 2h16` }],
    [`path`, { d: `M7 11h8` }],
    [`path`, { d: `M7 16h3` }],
    [`path`, { d: `M7 6h12` }],
  ],
  Gm = [
    [`path`, { d: `M3 3v16a2 2 0 0 0 2 2h16` }],
    [`rect`, { x: `7`, y: `13`, width: `9`, height: `4`, rx: `1` }],
    [`rect`, { x: `7`, y: `5`, width: `12`, height: `4`, rx: `1` }],
  ],
  Km = [
    [`path`, { d: `M3 3v16a2 2 0 0 0 2 2h16` }],
    [`path`, { d: `M7 11h8` }],
    [`path`, { d: `M7 16h12` }],
    [`path`, { d: `M7 6h3` }],
  ],
  qm = [
    [`path`, { d: `M11 13v4` }],
    [`path`, { d: `M15 5v4` }],
    [`path`, { d: `M3 3v16a2 2 0 0 0 2 2h16` }],
    [`rect`, { x: `7`, y: `13`, width: `9`, height: `4`, rx: `1` }],
    [`rect`, { x: `7`, y: `5`, width: `12`, height: `4`, rx: `1` }],
  ],
  Jm = [
    [`path`, { d: `M3 3v16a2 2 0 0 0 2 2h16` }],
    [`path`, { d: `M7 16h8` }],
    [`path`, { d: `M7 11h12` }],
    [`path`, { d: `M7 6h3` }],
  ],
  Ym = [
    [`path`, { d: `M9 5v4` }],
    [`rect`, { width: `4`, height: `6`, x: `7`, y: `9`, rx: `1` }],
    [`path`, { d: `M9 15v2` }],
    [`path`, { d: `M17 3v2` }],
    [`rect`, { width: `4`, height: `8`, x: `15`, y: `5`, rx: `1` }],
    [`path`, { d: `M17 13v3` }],
    [`path`, { d: `M3 3v16a2 2 0 0 0 2 2h16` }],
  ],
  Xm = [
    [`path`, { d: `M3 3v16a2 2 0 0 0 2 2h16` }],
    [`rect`, { x: `15`, y: `5`, width: `4`, height: `12`, rx: `1` }],
    [`rect`, { x: `7`, y: `8`, width: `4`, height: `9`, rx: `1` }],
  ],
  Zm = [
    [`path`, { d: `M13 17V9` }],
    [`path`, { d: `M18 17V5` }],
    [`path`, { d: `M3 3v16a2 2 0 0 0 2 2h16` }],
    [`path`, { d: `M8 17v-3` }],
  ],
  Qm = [
    [`path`, { d: `M13 17V9` }],
    [`path`, { d: `M18 17v-3` }],
    [`path`, { d: `M3 3v16a2 2 0 0 0 2 2h16` }],
    [`path`, { d: `M8 17V5` }],
  ],
  $m = [
    [`path`, { d: `M11 13H7` }],
    [`path`, { d: `M19 9h-4` }],
    [`path`, { d: `M3 3v16a2 2 0 0 0 2 2h16` }],
    [`rect`, { x: `15`, y: `5`, width: `4`, height: `12`, rx: `1` }],
    [`rect`, { x: `7`, y: `8`, width: `4`, height: `9`, rx: `1` }],
  ],
  eh = [
    [`path`, { d: `M3 3v16a2 2 0 0 0 2 2h16` }],
    [`path`, { d: `M18 17V9` }],
    [`path`, { d: `M13 17V5` }],
    [`path`, { d: `M8 17v-3` }],
  ],
  th = [
    [`path`, { d: `M10 6h8` }],
    [`path`, { d: `M12 16h6` }],
    [`path`, { d: `M3 3v16a2 2 0 0 0 2 2h16` }],
    [`path`, { d: `M8 11h7` }],
  ],
  nh = [
    [`path`, { d: `M3 3v16a2 2 0 0 0 2 2h16` }],
    [`path`, { d: `m19 9-5 5-4-4-3 3` }],
  ],
  rh = [
    [`path`, { d: `m13.11 7.664 1.78 2.672` }],
    [`path`, { d: `m14.162 12.788-3.324 1.424` }],
    [`path`, { d: `m20 4-6.06 1.515` }],
    [`path`, { d: `M3 3v16a2 2 0 0 0 2 2h16` }],
    [`circle`, { cx: `12`, cy: `6`, r: `2` }],
    [`circle`, { cx: `16`, cy: `12`, r: `2` }],
    [`circle`, { cx: `9`, cy: `15`, r: `2` }],
  ],
  ih = [
    [`path`, { d: `M5 21V3` }],
    [`path`, { d: `M12 21V9` }],
    [`path`, { d: `M19 21v-6` }],
  ],
  ah = [
    [`path`, { d: `M5 21v-6` }],
    [`path`, { d: `M12 21V9` }],
    [`path`, { d: `M19 21V3` }],
  ],
  oh = [
    [`path`, { d: `M5 21v-6` }],
    [`path`, { d: `M12 21V3` }],
    [`path`, { d: `M19 21V9` }],
  ],
  sh = [
    [`path`, { d: `M12 16v5` }],
    [`path`, { d: `M16 14.639V21` }],
    [`path`, { d: `M20 10.656V21` }],
    [
      `path`,
      {
        d: `m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15`,
      },
    ],
    [`path`, { d: `M4 18.463V21` }],
    [`path`, { d: `M8 14.656V21` }],
  ],
  ch = [
    [`path`, { d: `M6 5h12` }],
    [`path`, { d: `M4 12h10` }],
    [`path`, { d: `M12 19h8` }],
  ],
  lh = [
    [
      `path`,
      {
        d: `M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z`,
      },
    ],
    [`path`, { d: `M21.21 15.89A10 10 0 1 1 8 2.83` }],
  ],
  uh = [
    [`circle`, { cx: `7.5`, cy: `7.5`, r: `.5`, fill: `currentColor` }],
    [`circle`, { cx: `18.5`, cy: `5.5`, r: `.5`, fill: `currentColor` }],
    [`circle`, { cx: `11.5`, cy: `11.5`, r: `.5`, fill: `currentColor` }],
    [`circle`, { cx: `7.5`, cy: `16.5`, r: `.5`, fill: `currentColor` }],
    [`circle`, { cx: `17.5`, cy: `14.5`, r: `.5`, fill: `currentColor` }],
    [`path`, { d: `M3 3v16a2 2 0 0 0 2 2h16` }],
  ],
  dh = [
    [`path`, { d: `M3 3v16a2 2 0 0 0 2 2h16` }],
    [`path`, { d: `M7 16c.5-2 1.5-7 4-7 2 0 2 3 4 3 2.5 0 4.5-5 5-7` }],
  ],
  fh = [
    [`path`, { d: `M18 6 7 17l-5-5` }],
    [`path`, { d: `m22 10-7.5 7.5L13 16` }],
  ],
  ph = [
    [`path`, { d: `M20 4L9 15` }],
    [`path`, { d: `M21 19L3 19` }],
    [`path`, { d: `M9 15L4 10` }],
  ],
  mh = [[`path`, { d: `M20 6 9 17l-5-5` }]],
  hh = [
    [`path`, { d: `M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z` }],
    [`path`, { d: `M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z` }],
    [`path`, { d: `M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.94 9 5 12` }],
    [`path`, { d: `M22 9c-4.29 0-7.14-2.33-10-7 5.71 0 10 4.67 10 7Z` }],
  ],
  gh = [
    [
      `path`,
      {
        d: `M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z`,
      },
    ],
    [`path`, { d: `M6 17h12` }],
  ],
  _h = [
    [
      `path`,
      {
        d: `M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z`,
      },
    ],
    [
      `path`,
      {
        d: `M15 18c1.5-.615 3-2.461 3-4.923C18 8.769 14.5 4.462 12 2 9.5 4.462 6 8.77 6 13.077 6 15.539 7.5 17.385 9 18`,
      },
    ],
    [`path`, { d: `m16 7-2.5 2.5` }],
    [`path`, { d: `M9 2h6` }],
  ],
  vh = [
    [
      `path`,
      {
        d: `M4 20a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z`,
      },
    ],
    [
      `path`,
      {
        d: `m6.7 18-1-1C4.35 15.682 3 14.09 3 12a5 5 0 0 1 4.95-5c1.584 0 2.7.455 4.05 1.818C13.35 7.455 14.466 7 16.05 7A5 5 0 0 1 21 12c0 2.082-1.359 3.673-2.7 5l-1 1`,
      },
    ],
    [`path`, { d: `M10 4h4` }],
    [`path`, { d: `M12 2v6.818` }],
  ],
  yh = [
    [
      `path`,
      {
        d: `M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z`,
      },
    ],
    [`path`, { d: `m14.5 10 1.5 8` }],
    [`path`, { d: `M7 10h10` }],
    [`path`, { d: `m8 18 1.5-8` }],
    [`circle`, { cx: `12`, cy: `6`, r: `4` }],
  ],
  bh = [
    [
      `path`,
      {
        d: `M4 20a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z`,
      },
    ],
    [`path`, { d: `m12.474 5.943 1.567 5.34a1 1 0 0 0 1.75.328l2.616-3.402` }],
    [`path`, { d: `m20 9-3 9` }],
    [`path`, { d: `m5.594 8.209 2.615 3.403a1 1 0 0 0 1.75-.329l1.567-5.34` }],
    [`path`, { d: `M7 18 4 9` }],
    [`circle`, { cx: `12`, cy: `4`, r: `2` }],
    [`circle`, { cx: `20`, cy: `7`, r: `2` }],
    [`circle`, { cx: `4`, cy: `7`, r: `2` }],
  ],
  xh = [
    [
      `path`,
      {
        d: `M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z`,
      },
    ],
    [
      `path`,
      {
        d: `M16.5 18c1-2 2.5-5 2.5-9a7 7 0 0 0-7-7H6.635a1 1 0 0 0-.768 1.64L7 5l-2.32 5.802a2 2 0 0 0 .95 2.526l2.87 1.456`,
      },
    ],
    [`path`, { d: `m15 5 1.425-1.425` }],
    [`path`, { d: `m17 8 1.53-1.53` }],
    [`path`, { d: `M9.713 12.185 7 18` }],
  ],
  Sh = [
    [
      `path`,
      {
        d: `M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z`,
      },
    ],
    [`path`, { d: `M10 2v2` }],
    [`path`, { d: `M14 2v2` }],
    [`path`, { d: `m17 18-1-9` }],
    [`path`, { d: `M6 2v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2` }],
    [`path`, { d: `M6 4h12` }],
    [`path`, { d: `m7 18 1-9` }],
  ],
  Ch = [[`path`, { d: `m6 9 6 6 6-6` }]],
  wh = [
    [`path`, { d: `m17 18-6-6 6-6` }],
    [`path`, { d: `M7 6v12` }],
  ],
  Th = [
    [`path`, { d: `m7 18 6-6-6-6` }],
    [`path`, { d: `M17 6v12` }],
  ],
  Eh = [[`path`, { d: `m15 18-6-6 6-6` }]],
  Dh = [[`path`, { d: `m9 18 6-6-6-6` }]],
  Oh = [[`path`, { d: `m18 15-6-6-6 6` }]],
  kh = [
    [`path`, { d: `m7 6 5 5 5-5` }],
    [`path`, { d: `m7 13 5 5 5-5` }],
  ],
  Ah = [
    [`path`, { d: `m7 20 5-5 5 5` }],
    [`path`, { d: `m7 4 5 5 5-5` }],
  ],
  jh = [
    [`path`, { d: `M12 12h.01` }],
    [`path`, { d: `M16 12h.01` }],
    [`path`, { d: `m17 7 5 5-5 5` }],
    [`path`, { d: `m7 7-5 5 5 5` }],
    [`path`, { d: `M8 12h.01` }],
  ],
  Mh = [
    [`path`, { d: `m9 7-5 5 5 5` }],
    [`path`, { d: `m15 7 5 5-5 5` }],
  ],
  Nh = [
    [`path`, { d: `m11 17-5-5 5-5` }],
    [`path`, { d: `m18 17-5-5 5-5` }],
  ],
  Ph = [
    [`path`, { d: `m20 17-5-5 5-5` }],
    [`path`, { d: `m4 17 5-5-5-5` }],
  ],
  Fh = [
    [`path`, { d: `m7 15 5 5 5-5` }],
    [`path`, { d: `m7 9 5-5 5 5` }],
  ],
  Ih = [
    [`path`, { d: `m6 17 5-5-5-5` }],
    [`path`, { d: `m13 17 5-5-5-5` }],
  ],
  Lh = [
    [`path`, { d: `m17 11-5-5-5 5` }],
    [`path`, { d: `m17 18-5-5-5 5` }],
  ],
  Rh = [
    [`path`, { d: `M10 9h4` }],
    [`path`, { d: `M12 7v5` }],
    [`path`, { d: `M14 21v-3a2 2 0 0 0-4 0v3` }],
    [
      `path`,
      {
        d: `m18 9 3.52 2.147a1 1 0 0 1 .48.854V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6.999a1 1 0 0 1 .48-.854L6 9`,
      },
    ],
    [
      `path`,
      {
        d: `M6 21V7a1 1 0 0 1 .376-.782l5-3.999a1 1 0 0 1 1.249.001l5 4A1 1 0 0 1 18 7v14`,
      },
    ],
  ],
  zh = [
    [`path`, { d: `M12 12H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h13` }],
    [`path`, { d: `M18 8c0-2.5-2-2.5-2-5` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M21 12a1 1 0 0 1 1 1v2a1 1 0 0 1-.5.866` }],
    [`path`, { d: `M22 8c0-2.5-2-2.5-2-5` }],
    [`path`, { d: `M7 12v4` }],
  ],
  Bh = [
    [`path`, { d: `M17 12H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h14` }],
    [`path`, { d: `M18 8c0-2.5-2-2.5-2-5` }],
    [`path`, { d: `M21 16a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1` }],
    [`path`, { d: `M22 8c0-2.5-2-2.5-2-5` }],
    [`path`, { d: `M7 12v4` }],
  ],
  Vh = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`line`, { x1: `12`, x2: `12`, y1: `8`, y2: `12` }],
    [`line`, { x1: `12`, x2: `12.01`, y1: `16`, y2: `16` }],
  ],
  Hh = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M12 8v8` }],
    [`path`, { d: `m8 12 4 4 4-4` }],
  ],
  Uh = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `m12 8-4 4 4 4` }],
    [`path`, { d: `M16 12H8` }],
  ],
  Wh = [
    [`path`, { d: `M2 12a10 10 0 1 1 10 10` }],
    [`path`, { d: `m2 22 10-10` }],
    [`path`, { d: `M8 22H2v-6` }],
  ],
  Gh = [
    [`path`, { d: `M2 8V2h6` }],
    [`path`, { d: `m2 2 10 10` }],
    [`path`, { d: `M12 2A10 10 0 1 1 2 12` }],
  ],
  Kh = [
    [`path`, { d: `M12 22a10 10 0 1 1 10-10` }],
    [`path`, { d: `M22 22 12 12` }],
    [`path`, { d: `M22 16v6h-6` }],
  ],
  qh = [
    [`path`, { d: `M22 12A10 10 0 1 1 12 2` }],
    [`path`, { d: `M22 2 12 12` }],
    [`path`, { d: `M16 2h6v6` }],
  ],
  Jh = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `m12 16 4-4-4-4` }],
    [`path`, { d: `M8 12h8` }],
  ],
  Yh = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `m16 12-4-4-4 4` }],
    [`path`, { d: `M12 16V8` }],
  ],
  Xh = [
    [`path`, { d: `M21.801 10A10 10 0 1 1 17 3.335` }],
    [`path`, { d: `m9 11 3 3L22 4` }],
  ],
  Zh = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `m9 12 2 2 4-4` }],
  ],
  Qh = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `m16 10-4 4-4-4` }],
  ],
  $h = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `m14 16-4-4 4-4` }],
  ],
  eg = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `m10 8 4 4-4 4` }],
  ],
  tg = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `m8 14 4-4 4 4` }],
  ],
  ng = [
    [`path`, { d: `M10.1 2.182a10 10 0 0 1 3.8 0` }],
    [`path`, { d: `M13.9 21.818a10 10 0 0 1-3.8 0` }],
    [`path`, { d: `M17.609 3.721a10 10 0 0 1 2.69 2.7` }],
    [`path`, { d: `M2.182 13.9a10 10 0 0 1 0-3.8` }],
    [`path`, { d: `M20.279 17.609a10 10 0 0 1-2.7 2.69` }],
    [`path`, { d: `M21.818 10.1a10 10 0 0 1 0 3.8` }],
    [`path`, { d: `M3.721 6.391a10 10 0 0 1 2.7-2.69` }],
    [`path`, { d: `M6.391 20.279a10 10 0 0 1-2.69-2.7` }],
  ],
  rg = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`line`, { x1: `8`, x2: `16`, y1: `12`, y2: `12` }],
    [`line`, { x1: `12`, x2: `12`, y1: `16`, y2: `16` }],
    [`line`, { x1: `12`, x2: `12`, y1: `8`, y2: `8` }],
  ],
  ig = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8` }],
    [`path`, { d: `M12 18V6` }],
  ],
  ag = [
    [`path`, { d: `M10.1 2.18a9.93 9.93 0 0 1 3.8 0` }],
    [`path`, { d: `M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7` }],
    [`path`, { d: `M21.82 10.1a9.93 9.93 0 0 1 0 3.8` }],
    [`path`, { d: `M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69` }],
    [`path`, { d: `M13.9 21.82a9.94 9.94 0 0 1-3.8 0` }],
    [`path`, { d: `M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7` }],
    [`path`, { d: `M2.18 13.9a9.93 9.93 0 0 1 0-3.8` }],
    [`path`, { d: `M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69` }],
    [`circle`, { cx: `12`, cy: `12`, r: `1` }],
  ],
  og = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`circle`, { cx: `12`, cy: `12`, r: `1` }],
  ],
  sg = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M17 12h.01` }],
    [`path`, { d: `M12 12h.01` }],
    [`path`, { d: `M7 12h.01` }],
  ],
  cg = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M7 10h10` }],
    [`path`, { d: `M7 14h10` }],
  ],
  lg = [
    [`path`, { d: `M12 2a10 10 0 0 1 7.38 16.75` }],
    [`path`, { d: `m16 12-4-4-4 4` }],
    [`path`, { d: `M12 16V8` }],
    [`path`, { d: `M2.5 8.875a10 10 0 0 0-.5 3` }],
    [`path`, { d: `M2.83 16a10 10 0 0 0 2.43 3.4` }],
    [`path`, { d: `M4.636 5.235a10 10 0 0 1 .891-.857` }],
    [`path`, { d: `M8.644 21.42a10 10 0 0 0 7.631-.38` }],
  ],
  ug = [
    [`path`, { d: `M12 2a10 10 0 0 1 7.38 16.75` }],
    [`path`, { d: `M12 8v8` }],
    [`path`, { d: `M16 12H8` }],
    [`path`, { d: `M2.5 8.875a10 10 0 0 0-.5 3` }],
    [`path`, { d: `M2.83 16a10 10 0 0 0 2.43 3.4` }],
    [`path`, { d: `M4.636 5.235a10 10 0 0 1 .891-.857` }],
    [`path`, { d: `M8.644 21.42a10 10 0 0 0 7.631-.38` }],
  ],
  dg = [
    [`path`, { d: `M15.6 2.7a10 10 0 1 0 5.7 5.7` }],
    [`circle`, { cx: `12`, cy: `12`, r: `2` }],
    [`path`, { d: `M13.4 10.6 19 5` }],
  ],
  fg = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M8 12h8` }],
  ],
  pg = [
    [`path`, { d: `M12.656 7H13a3 3 0 0 1 2.984 3.307` }],
    [`path`, { d: `M13 13H9` }],
    [`path`, { d: `M19.071 19.071A1 1 0 0 1 4.93 4.93` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M8.357 2.687a10 10 0 0 1 12.956 12.956` }],
    [`path`, { d: `M9 17V9` }],
  ],
  mg = [
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M8.35 2.69A10 10 0 0 1 21.3 15.65` }],
    [`path`, { d: `M19.08 19.08A10 10 0 1 1 4.92 4.92` }],
  ],
  hg = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M9 17V7h4a3 3 0 0 1 0 6H9` }],
  ],
  gg = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`line`, { x1: `10`, x2: `10`, y1: `15`, y2: `9` }],
    [`line`, { x1: `14`, x2: `14`, y1: `15`, y2: `9` }],
  ],
  _g = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `m15 9-6 6` }],
    [`path`, { d: `M9 9h.01` }],
    [`path`, { d: `M15 15h.01` }],
  ],
  vg = [
    [`circle`, { cx: `12`, cy: `19`, r: `2` }],
    [`circle`, { cx: `12`, cy: `5`, r: `2` }],
    [`circle`, { cx: `16`, cy: `12`, r: `2` }],
    [`circle`, { cx: `20`, cy: `19`, r: `2` }],
    [`circle`, { cx: `4`, cy: `19`, r: `2` }],
    [`circle`, { cx: `8`, cy: `12`, r: `2` }],
  ],
  yg = [
    [
      `path`,
      {
        d: `M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z`,
      },
    ],
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
  ],
  bg = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M8 12h8` }],
    [`path`, { d: `M12 8v8` }],
  ],
  xg = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M10 16V9.5a1 1 0 0 1 5 0` }],
    [`path`, { d: `M8 12h4` }],
    [`path`, { d: `M8 16h7` }],
  ],
  Sg = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M12 7v4` }],
    [`path`, { d: `M7.998 9.003a5 5 0 1 0 8-.005` }],
  ],
  Cg = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3` }],
    [`path`, { d: `M12 17h.01` }],
  ],
  wg = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M22 2 2 22` }],
  ],
  Tg = [[`circle`, { cx: `12`, cy: `12`, r: `6` }]],
  Eg = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`line`, { x1: `9`, x2: `15`, y1: `15`, y2: `9` }],
  ],
  Dg = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [
      `path`,
      {
        d: `M11.051 7.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.867l-1.156-1.152a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z`,
      },
    ],
  ],
  Og = [
    [`path`, { d: `M17.925 20.056a6 6 0 0 0-11.851.001` }],
    [`circle`, { cx: `12`, cy: `11`, r: `4` }],
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
  ],
  kg = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`rect`, { x: `9`, y: `9`, width: `6`, height: `6`, rx: `1` }],
  ],
  Ag = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `m15 9-6 6` }],
    [`path`, { d: `m9 9 6 6` }],
  ],
  jg = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`circle`, { cx: `12`, cy: `10`, r: `3` }],
    [`path`, { d: `M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662` }],
  ],
  Mg = [[`circle`, { cx: `12`, cy: `12`, r: `10` }]],
  Ng = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M11 9h4a2 2 0 0 0 2-2V3` }],
    [`circle`, { cx: `9`, cy: `9`, r: `2` }],
    [`path`, { d: `M7 21v-4a2 2 0 0 1 2-2h4` }],
    [`circle`, { cx: `15`, cy: `15`, r: `2` }],
  ],
  Pg = [
    [
      `path`,
      {
        d: `M21.66 17.67a1.08 1.08 0 0 1-.04 1.6A12 12 0 0 1 4.73 2.38a1.1 1.1 0 0 1 1.61-.04z`,
      },
    ],
    [`path`, { d: `M19.65 15.66A8 8 0 0 1 8.35 4.34` }],
    [`path`, { d: `m14 10-5.5 5.5` }],
    [`path`, { d: `M14 17.85V10H6.15` }],
  ],
  Fg = [
    [`rect`, { width: `8`, height: `4`, x: `8`, y: `2`, rx: `1`, ry: `1` }],
    [
      `path`,
      {
        d: `M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2`,
      },
    ],
    [`path`, { d: `m9 14 2 2 4-4` }],
  ],
  Ig = [
    [`path`, { d: `m12.296 3.464 3.02 3.956` }],
    [
      `path`,
      {
        d: `M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3z`,
      },
    ],
    [`path`, { d: `M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z` }],
    [`path`, { d: `m6.18 5.276 3.1 3.899` }],
  ],
  Lg = [
    [`path`, { d: `M16 14v2.2l1.6 1` }],
    [`path`, { d: `M16 4h2a2 2 0 0 1 2 2v.832` }],
    [`path`, { d: `M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2` }],
    [`circle`, { cx: `16`, cy: `16`, r: `6` }],
    [`rect`, { x: `8`, y: `2`, width: `8`, height: `4`, rx: `1` }],
  ],
  Rg = [
    [`rect`, { width: `8`, height: `4`, x: `8`, y: `2`, rx: `1`, ry: `1` }],
    [
      `path`,
      {
        d: `M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2`,
      },
    ],
    [`path`, { d: `M12 11h4` }],
    [`path`, { d: `M12 16h4` }],
    [`path`, { d: `M8 11h.01` }],
    [`path`, { d: `M8 16h.01` }],
  ],
  zg = [
    [`rect`, { width: `8`, height: `4`, x: `8`, y: `2`, rx: `1`, ry: `1` }],
    [
      `path`,
      { d: `M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2` },
    ],
    [`path`, { d: `M16 4h2a2 2 0 0 1 2 2v4` }],
    [`path`, { d: `M21 14H11` }],
    [`path`, { d: `m15 10-4 4 4 4` }],
  ],
  Bg = [
    [`rect`, { width: `8`, height: `4`, x: `8`, y: `2`, rx: `1`, ry: `1` }],
    [
      `path`,
      {
        d: `M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2`,
      },
    ],
    [`path`, { d: `M9 14h6` }],
  ],
  Vg = [
    [`path`, { d: `M11 14h10` }],
    [`path`, { d: `M16 4h2a2 2 0 0 1 2 2v1.344` }],
    [`path`, { d: `m17 18 4-4-4-4` }],
    [
      `path`,
      { d: `M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 1.793-1.113` },
    ],
    [`rect`, { x: `8`, y: `2`, width: `8`, height: `4`, rx: `1` }],
  ],
  Hg = [
    [`rect`, { width: `8`, height: `4`, x: `8`, y: `2`, rx: `1` }],
    [
      `path`,
      { d: `M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-.5` },
    ],
    [`path`, { d: `M16 4h2a2 2 0 0 1 1.73 1` }],
    [`path`, { d: `M8 18h1` }],
    [
      `path`,
      {
        d: `M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z`,
      },
    ],
  ],
  Ug = [
    [`path`, { d: `M16 4h2a2 2 0 0 1 2 2v2` }],
    [
      `path`,
      {
        d: `M21.34 15.664a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z`,
      },
    ],
    [`path`, { d: `M8 22H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2` }],
    [`rect`, { x: `8`, y: `2`, width: `8`, height: `4`, rx: `1` }],
  ],
  Wg = [
    [`rect`, { width: `8`, height: `4`, x: `8`, y: `2`, rx: `1`, ry: `1` }],
    [
      `path`,
      {
        d: `M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2`,
      },
    ],
    [`path`, { d: `M9 14h6` }],
    [`path`, { d: `M12 17v-6` }],
  ],
  Gg = [
    [`rect`, { width: `8`, height: `4`, x: `8`, y: `2`, rx: `1`, ry: `1` }],
    [
      `path`,
      {
        d: `M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2`,
      },
    ],
    [`path`, { d: `M9 12v-1h6v1` }],
    [`path`, { d: `M11 17h2` }],
    [`path`, { d: `M12 11v6` }],
  ],
  Kg = [
    [`rect`, { width: `8`, height: `4`, x: `8`, y: `2`, rx: `1`, ry: `1` }],
    [
      `path`,
      {
        d: `M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2`,
      },
    ],
    [`path`, { d: `m15 11-6 6` }],
    [`path`, { d: `m9 11 6 6` }],
  ],
  qg = [
    [`rect`, { width: `8`, height: `4`, x: `8`, y: `2`, rx: `1`, ry: `1` }],
    [
      `path`,
      {
        d: `M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2`,
      },
    ],
  ],
  Jg = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M12 6v6l2-4` }],
  ],
  Yg = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M12 6v6l-4-2` }],
  ],
  Xg = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M12 6v6l-2-4` }],
  ],
  Zg = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M12 6v6` }],
  ],
  Qg = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M12 6v6h4` }],
  ],
  $g = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M12 6v6l4 2` }],
  ],
  e_ = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M12 6v6l4-2` }],
  ],
  t_ = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M12 6v6l2 4` }],
  ],
  n_ = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M12 6v10` }],
  ],
  r_ = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M12 6v6l-2 4` }],
  ],
  i_ = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M12 6v6l-4 2` }],
  ],
  a_ = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M12 6v6H8` }],
  ],
  o_ = [
    [`path`, { d: `M12 6v6l4 2` }],
    [`path`, { d: `M20 12v5` }],
    [`path`, { d: `M20 21h.01` }],
    [`path`, { d: `M21.25 8.2A10 10 0 1 0 16 21.16` }],
  ],
  s_ = [
    [`path`, { d: `M12 6v6l1.56.78` }],
    [`path`, { d: `M13.227 21.925a10 10 0 1 1 8.767-9.588` }],
    [`path`, { d: `m14 18 4-4 4 4` }],
    [`path`, { d: `M18 22v-8` }],
  ],
  c_ = [
    [`path`, { d: `M12 6v6l2 1` }],
    [`path`, { d: `M12.337 21.994a10 10 0 1 1 9.588-8.767` }],
    [`path`, { d: `m14 18 4 4 4-4` }],
    [`path`, { d: `M18 14v8` }],
  ],
  l_ = [
    [`path`, { d: `M12 6v6l4 2` }],
    [`path`, { d: `M22 12a10 10 0 1 0-11 9.95` }],
    [`path`, { d: `m22 16-5.5 5.5L14 19` }],
  ],
  u_ = [
    [`path`, { d: `M12 2a10 10 0 0 1 7.38 16.75` }],
    [`path`, { d: `M12 6v6l4 2` }],
    [`path`, { d: `M2.5 8.875a10 10 0 0 0-.5 3` }],
    [`path`, { d: `M2.83 16a10 10 0 0 0 2.43 3.4` }],
    [`path`, { d: `M4.636 5.235a10 10 0 0 1 .891-.857` }],
    [`path`, { d: `M8.644 21.42a10 10 0 0 0 7.631-.38` }],
  ],
  d_ = [
    [`path`, { d: `M12 6v6l3.644 1.822` }],
    [`path`, { d: `M16 19h6` }],
    [`path`, { d: `M19 16v6` }],
    [`path`, { d: `M21.92 13.267a10 10 0 1 0-8.653 8.653` }],
  ],
  f_ = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M12 6v6l4 2` }],
  ],
  p_ = [
    [`path`, { d: `M10 9.17a3 3 0 1 0 0 5.66` }],
    [`path`, { d: `M17 9.17a3 3 0 1 0 0 5.66` }],
    [`rect`, { x: `2`, y: `5`, width: `20`, height: `14`, rx: `2` }],
  ],
  m_ = [
    [`path`, { d: `M12 12v4` }],
    [`path`, { d: `M12 20h.01` }],
    [
      `path`,
      { d: `M8.128 16.949A7 7 0 1 1 15.71 8h1.79a1 1 0 0 1 0 9h-1.642` },
    ],
  ],
  h_ = [
    [`path`, { d: `M21 15.251A4.5 4.5 0 0 0 17.5 8h-1.79A7 7 0 1 0 3 13.607` }],
    [`path`, { d: `M7 11v4h4` }],
    [
      `path`,
      {
        d: `M8 19a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5 4.82 4.82 0 0 0-3.41 1.41L7 15`,
      },
    ],
  ],
  g_ = [
    [`path`, { d: `m10.852 19.772-.383.924` }],
    [`path`, { d: `m13.148 14.228.383-.923` }],
    [`path`, { d: `M13.148 19.772a3 3 0 1 0-2.296-5.544l-.383-.923` }],
    [`path`, { d: `m13.53 20.696-.382-.924a3 3 0 1 1-2.296-5.544` }],
    [`path`, { d: `m14.772 15.852.923-.383` }],
    [`path`, { d: `m14.772 18.148.923.383` }],
    [
      `path`,
      {
        d: `M4.2 15.1a7 7 0 1 1 9.93-9.858A7 7 0 0 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.2`,
      },
    ],
    [`path`, { d: `m9.228 15.852-.923-.383` }],
    [`path`, { d: `m9.228 18.148-.923.383` }],
  ],
  __ = [
    [`path`, { d: `m17 15-5.5 5.5L9 18` }],
    [
      `path`,
      { d: `M5.516 16.07A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 3.501 7.327` },
    ],
  ],
  v_ = [
    [`path`, { d: `M12 13v8l-4-4` }],
    [`path`, { d: `m12 21 4-4` }],
    [
      `path`,
      { d: `M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284` },
    ],
  ],
  y_ = [
    [`path`, { d: `M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242` }],
    [`path`, { d: `M8 19v1` }],
    [`path`, { d: `M8 14v1` }],
    [`path`, { d: `M16 19v1` }],
    [`path`, { d: `M16 14v1` }],
    [`path`, { d: `M12 21v1` }],
    [`path`, { d: `M12 16v1` }],
  ],
  b_ = [
    [`path`, { d: `M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242` }],
    [`path`, { d: `M16 17H7` }],
    [`path`, { d: `M17 21H9` }],
  ],
  x_ = [
    [`path`, { d: `M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242` }],
    [`path`, { d: `M16 14v2` }],
    [`path`, { d: `M8 14v2` }],
    [`path`, { d: `M16 20h.01` }],
    [`path`, { d: `M8 20h.01` }],
    [`path`, { d: `M12 16v2` }],
    [`path`, { d: `M12 22h.01` }],
  ],
  S_ = [
    [`path`, { d: `M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973` }],
    [`path`, { d: `m13 12-3 5h4l-3 5` }],
  ],
  C_ = [
    [`path`, { d: `M11 20v2` }],
    [
      `path`,
      {
        d: `M18.376 14.512a6 6 0 0 0 3.461-4.127c.148-.625-.659-.97-1.248-.714a4 4 0 0 1-5.259-5.26c.255-.589-.09-1.395-.716-1.248a6 6 0 0 0-4.594 5.36`,
      },
    ],
    [`path`, { d: `M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24` }],
    [`path`, { d: `M7 19v2` }],
  ],
  w_ = [
    [`path`, { d: `M13 16a3 3 0 0 1 0 6H7a5 5 0 1 1 4.9-6z` }],
    [
      `path`,
      {
        d: `M18.376 14.512a6 6 0 0 0 3.461-4.127c.148-.625-.659-.97-1.248-.714a4 4 0 0 1-5.259-5.26c.255-.589-.09-1.395-.716-1.248a6 6 0 0 0-4.594 5.36`,
      },
    ],
  ],
  T_ = [
    [
      `path`,
      { d: `M10.94 5.274A7 7 0 0 1 15.71 10h1.79a4.5 4.5 0 0 1 4.222 6.057` },
    ],
    [
      `path`,
      { d: `M18.796 18.81A4.5 4.5 0 0 1 17.5 19H9A7 7 0 0 1 5.79 5.78` },
    ],
    [`path`, { d: `m2 2 20 20` }],
  ],
  E_ = [
    [`path`, { d: `M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242` }],
    [`path`, { d: `m9.2 22 3-7` }],
    [`path`, { d: `m9 13-3 7` }],
    [`path`, { d: `m17 13-3 7` }],
  ],
  D_ = [
    [`path`, { d: `M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242` }],
    [`path`, { d: `M16 14v6` }],
    [`path`, { d: `M8 14v6` }],
    [`path`, { d: `M12 16v6` }],
  ],
  O_ = [
    [`path`, { d: `M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242` }],
    [`path`, { d: `M8 15h.01` }],
    [`path`, { d: `M8 19h.01` }],
    [`path`, { d: `M12 17h.01` }],
    [`path`, { d: `M12 21h.01` }],
    [`path`, { d: `M16 15h.01` }],
    [`path`, { d: `M16 19h.01` }],
  ],
  k_ = [
    [`path`, { d: `M12 2v2` }],
    [`path`, { d: `m4.93 4.93 1.41 1.41` }],
    [`path`, { d: `M20 12h2` }],
    [`path`, { d: `m19.07 4.93-1.41 1.41` }],
    [`path`, { d: `M15.947 12.65a4 4 0 0 0-5.925-4.128` }],
    [`path`, { d: `M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24` }],
    [`path`, { d: `M11 20v2` }],
    [`path`, { d: `M7 19v2` }],
  ],
  A_ = [
    [`path`, { d: `M12 2v2` }],
    [`path`, { d: `m4.93 4.93 1.41 1.41` }],
    [`path`, { d: `M20 12h2` }],
    [`path`, { d: `m19.07 4.93-1.41 1.41` }],
    [`path`, { d: `M15.947 12.65a4 4 0 0 0-5.925-4.128` }],
    [`path`, { d: `M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z` }],
  ],
  j_ = [
    [`path`, { d: `m17 18-1.535 1.605a5 5 0 0 1-8-1.5` }],
    [`path`, { d: `M17 22v-4h-4` }],
    [
      `path`,
      {
        d: `M20.996 15.251A4.5 4.5 0 0 0 17.495 8h-1.79a7 7 0 1 0-12.709 5.607`,
      },
    ],
    [`path`, { d: `M7 10v4h4` }],
    [`path`, { d: `m7 14 1.535-1.605a5 5 0 0 1 8 1.5` }],
  ],
  M_ = [
    [`path`, { d: `M12 13v8` }],
    [`path`, { d: `M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242` }],
    [`path`, { d: `m8 17 4-4 4 4` }],
  ],
  N_ = [[`path`, { d: `M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z` }]],
  P_ = [
    [`path`, { d: `M17.5 12a1 1 0 1 1 0 9H9.006a7 7 0 1 1 6.702-9z` }],
    [`path`, { d: `M21.832 9A3 3 0 0 0 19 7h-2.207a5.5 5.5 0 0 0-10.72.61` }],
  ],
  F_ = [
    [`path`, { d: `M16.17 7.83 2 22` }],
    [
      `path`,
      {
        d: `M4.02 12a2.827 2.827 0 1 1 3.81-4.17A2.827 2.827 0 1 1 12 4.02a2.827 2.827 0 1 1 4.17 3.81A2.827 2.827 0 1 1 19.98 12a2.827 2.827 0 1 1-3.81 4.17A2.827 2.827 0 1 1 12 19.98a2.827 2.827 0 1 1-4.17-3.81A1 1 0 1 1 4 12`,
      },
    ],
    [`path`, { d: `m7.83 7.83 8.34 8.34` }],
  ],
  I_ = [
    [
      `path`,
      {
        d: `M17.28 9.05a5.5 5.5 0 1 0-10.56 0A5.5 5.5 0 1 0 12 17.66a5.5 5.5 0 1 0 5.28-8.6Z`,
      },
    ],
    [`path`, { d: `M12 17.66L12 22` }],
  ],
  L_ = [
    [`path`, { d: `m18 16 4-4-4-4` }],
    [`path`, { d: `m6 8-4 4 4 4` }],
    [`path`, { d: `m14.5 4-5 16` }],
  ],
  R_ = [
    [`path`, { d: `m16 18 6-6-6-6` }],
    [`path`, { d: `m8 6-6 6 6 6` }],
  ],
  z_ = [
    [`path`, { d: `M10 2v2` }],
    [`path`, { d: `M14 2v2` }],
    [
      `path`,
      {
        d: `M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1`,
      },
    ],
    [`path`, { d: `M6 2v2` }],
  ],
  B_ = [
    [`path`, { d: `M11 10.27 7 3.34` }],
    [`path`, { d: `m11 13.73-4 6.93` }],
    [`path`, { d: `M12 22v-2` }],
    [`path`, { d: `M12 2v2` }],
    [`path`, { d: `M14 12h8` }],
    [`path`, { d: `m17 20.66-1-1.73` }],
    [`path`, { d: `m17 3.34-1 1.73` }],
    [`path`, { d: `M2 12h2` }],
    [`path`, { d: `m20.66 17-1.73-1` }],
    [`path`, { d: `m20.66 7-1.73 1` }],
    [`path`, { d: `m3.34 17 1.73-1` }],
    [`path`, { d: `m3.34 7 1.73 1` }],
    [`circle`, { cx: `12`, cy: `12`, r: `2` }],
    [`circle`, { cx: `12`, cy: `12`, r: `8` }],
  ],
  V_ = [
    [`path`, { d: `M13.744 17.736a6 6 0 1 1-7.48-7.48` }],
    [`path`, { d: `M15 6h1v4` }],
    [`path`, { d: `m6.134 14.768.866-.5 2 3.464` }],
    [`circle`, { cx: `16`, cy: `8`, r: `6` }],
  ],
  H_ = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M12 3v18` }],
  ],
  U_ = [
    [
      `path`,
      { d: `M10.5 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.5` },
    ],
    [`path`, { d: `m14.3 19.6 1-.4` }],
    [`path`, { d: `M15 3v7.5` }],
    [`path`, { d: `m15.2 16.9-.9-.3` }],
    [`path`, { d: `m16.6 21.7.3-.9` }],
    [`path`, { d: `m16.8 15.3-.4-1` }],
    [`path`, { d: `m19.1 15.2.3-.9` }],
    [`path`, { d: `m19.6 21.7-.4-1` }],
    [`path`, { d: `m20.7 16.8 1-.4` }],
    [`path`, { d: `m21.7 19.4-.9-.3` }],
    [`path`, { d: `M9 3v18` }],
    [`circle`, { cx: `18`, cy: `18`, r: `3` }],
  ],
  W_ = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M9 3v18` }],
    [`path`, { d: `M15 3v18` }],
  ],
  G_ = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M7.5 3v18` }],
    [`path`, { d: `M12 3v18` }],
    [`path`, { d: `M16.5 3v18` }],
  ],
  K_ = [
    [`path`, { d: `M14 3a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1` }],
    [`path`, { d: `M19 3a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1` }],
    [`path`, { d: `m7 15 3 3` }],
    [`path`, { d: `m7 21 3-3H5a2 2 0 0 1-2-2v-2` }],
    [`rect`, { x: `14`, y: `14`, width: `7`, height: `7`, rx: `1` }],
    [`rect`, { x: `3`, y: `3`, width: `7`, height: `7`, rx: `1` }],
  ],
  q_ = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [
      `path`,
      {
        d: `m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z`,
      },
    ],
  ],
  J_ = [
    [
      `path`,
      {
        d: `M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3`,
      },
    ],
  ],
  Y_ = [
    [
      `path`,
      {
        d: `M15.536 11.293a1 1 0 0 0 0 1.414l2.376 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z`,
      },
    ],
    [
      `path`,
      {
        d: `M2.297 11.293a1 1 0 0 0 0 1.414l2.377 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414L6.088 8.916a1 1 0 0 0-1.414 0z`,
      },
    ],
    [
      `path`,
      {
        d: `M8.916 17.912a1 1 0 0 0 0 1.415l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.415l-2.377-2.376a1 1 0 0 0-1.414 0z`,
      },
    ],
    [
      `path`,
      {
        d: `M8.916 4.674a1 1 0 0 0 0 1.414l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z`,
      },
    ],
  ],
  X_ = [
    [`rect`, { width: `14`, height: `8`, x: `5`, y: `2`, rx: `2` }],
    [`rect`, { width: `20`, height: `8`, x: `2`, y: `14`, rx: `2` }],
    [`path`, { d: `M6 18h2` }],
    [`path`, { d: `M12 18h6` }],
  ],
  Z_ = [
    [
      `path`,
      {
        d: `M3 20a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1Z`,
      },
    ],
    [`path`, { d: `M20 16a8 8 0 1 0-16 0` }],
    [`path`, { d: `M12 4v4` }],
    [`path`, { d: `M10 4h4` }],
  ],
  Q_ = [
    [`rect`, { x: `2`, y: `6`, width: `20`, height: `8`, rx: `1` }],
    [`path`, { d: `M17 14v7` }],
    [`path`, { d: `M7 14v7` }],
    [`path`, { d: `M17 3v3` }],
    [`path`, { d: `M7 3v3` }],
    [`path`, { d: `M10 14 2.3 6.3` }],
    [`path`, { d: `m14 6 7.7 7.7` }],
    [`path`, { d: `m8 6 8 8` }],
  ],
  $_ = [
    [`path`, { d: `m20.9 18.55-8-15.98a1 1 0 0 0-1.8 0l-8 15.98` }],
    [`ellipse`, { cx: `12`, cy: `19`, rx: `9`, ry: `3` }],
  ],
  ev = [
    [`path`, { d: `M16 2v2` }],
    [`path`, { d: `M17.915 22a6 6 0 0 0-12 0` }],
    [`path`, { d: `M8 2v2` }],
    [`circle`, { cx: `12`, cy: `12`, r: `4` }],
    [`rect`, { x: `3`, y: `4`, width: `18`, height: `18`, rx: `2` }],
  ],
  tv = [
    [
      `path`,
      {
        d: `M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z`,
      },
    ],
    [`path`, { d: `M10 21.9V14L2.1 9.1` }],
    [`path`, { d: `m10 14 11.9-6.9` }],
    [`path`, { d: `M14 19.8v-8.1` }],
    [`path`, { d: `M18 17.5V9.4` }],
  ],
  nv = [
    [`path`, { d: `M16 2v2` }],
    [`path`, { d: `M7 22v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2` }],
    [`path`, { d: `M8 2v2` }],
    [`circle`, { cx: `12`, cy: `11`, r: `3` }],
    [`rect`, { x: `3`, y: `4`, width: `18`, height: `18`, rx: `2` }],
  ],
  rv = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M12 18a6 6 0 0 0 0-12v12z` }],
  ],
  iv = [
    [`path`, { d: `M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5` }],
    [`path`, { d: `M8.5 8.5v.01` }],
    [`path`, { d: `M16 15.5v.01` }],
    [`path`, { d: `M12 12v.01` }],
    [`path`, { d: `M11 17v.01` }],
    [`path`, { d: `M7 14v.01` }],
  ],
  av = [
    [`path`, { d: `M2 12h20` }],
    [`path`, { d: `M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8` }],
    [`path`, { d: `m4 8 16-4` }],
    [
      `path`,
      {
        d: `m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8`,
      },
    ],
  ],
  ov = [
    [`path`, { d: `m12 15 2 2 4-4` }],
    [`rect`, { width: `14`, height: `14`, x: `8`, y: `8`, rx: `2`, ry: `2` }],
    [`path`, { d: `M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2` }],
  ],
  sv = [
    [`line`, { x1: `12`, x2: `18`, y1: `15`, y2: `15` }],
    [`rect`, { width: `14`, height: `14`, x: `8`, y: `8`, rx: `2`, ry: `2` }],
    [`path`, { d: `M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2` }],
  ],
  cv = [
    [`line`, { x1: `15`, x2: `15`, y1: `12`, y2: `18` }],
    [`line`, { x1: `12`, x2: `18`, y1: `15`, y2: `15` }],
    [`rect`, { width: `14`, height: `14`, x: `8`, y: `8`, rx: `2`, ry: `2` }],
    [`path`, { d: `M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2` }],
  ],
  lv = [
    [`line`, { x1: `12`, x2: `18`, y1: `18`, y2: `12` }],
    [`rect`, { width: `14`, height: `14`, x: `8`, y: `8`, rx: `2`, ry: `2` }],
    [`path`, { d: `M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2` }],
  ],
  uv = [
    [`line`, { x1: `12`, x2: `18`, y1: `12`, y2: `18` }],
    [`line`, { x1: `12`, x2: `18`, y1: `18`, y2: `12` }],
    [`rect`, { width: `14`, height: `14`, x: `8`, y: `8`, rx: `2`, ry: `2` }],
    [`path`, { d: `M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2` }],
  ],
  dv = [
    [`rect`, { width: `14`, height: `14`, x: `8`, y: `8`, rx: `2`, ry: `2` }],
    [`path`, { d: `M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2` }],
  ],
  fv = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M9.17 14.83a4 4 0 1 0 0-5.66` }],
  ],
  pv = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M14.83 14.83a4 4 0 1 1 0-5.66` }],
  ],
  mv = [
    [`path`, { d: `M20 4v7a4 4 0 0 1-4 4H4` }],
    [`path`, { d: `m9 10-5 5 5 5` }],
  ],
  hv = [
    [`path`, { d: `m15 10 5 5-5 5` }],
    [`path`, { d: `M4 4v7a4 4 0 0 0 4 4h12` }],
  ],
  gv = [
    [`path`, { d: `m14 15-5 5-5-5` }],
    [`path`, { d: `M20 4h-7a4 4 0 0 0-4 4v12` }],
  ],
  _v = [
    [`path`, { d: `M14 9 9 4 4 9` }],
    [`path`, { d: `M20 20h-7a4 4 0 0 1-4-4V4` }],
  ],
  vv = [
    [`path`, { d: `m10 15 5 5 5-5` }],
    [`path`, { d: `M4 4h7a4 4 0 0 1 4 4v12` }],
  ],
  yv = [
    [`path`, { d: `m10 9 5-5 5 5` }],
    [`path`, { d: `M4 20h7a4 4 0 0 0 4-4V4` }],
  ],
  bv = [
    [`path`, { d: `M20 20v-7a4 4 0 0 0-4-4H4` }],
    [`path`, { d: `M9 14 4 9l5-5` }],
  ],
  xv = [
    [`path`, { d: `m15 14 5-5-5-5` }],
    [`path`, { d: `M4 20v-7a4 4 0 0 1 4-4h12` }],
  ],
  Sv = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [
      `path`,
      {
        d: `M10 9.3a2.8 2.8 0 0 0-3.5 1 3.1 3.1 0 0 0 0 3.4 2.7 2.7 0 0 0 3.5 1`,
      },
    ],
    [
      `path`,
      {
        d: `M17 9.3a2.8 2.8 0 0 0-3.5 1 3.1 3.1 0 0 0 0 3.4 2.7 2.7 0 0 0 3.5 1`,
      },
    ],
  ],
  Cv = [
    [`path`, { d: `M12 20v2` }],
    [`path`, { d: `M12 2v2` }],
    [`path`, { d: `M17 20v2` }],
    [`path`, { d: `M17 2v2` }],
    [`path`, { d: `M2 12h2` }],
    [`path`, { d: `M2 17h2` }],
    [`path`, { d: `M2 7h2` }],
    [`path`, { d: `M20 12h2` }],
    [`path`, { d: `M20 17h2` }],
    [`path`, { d: `M20 7h2` }],
    [`path`, { d: `M7 20v2` }],
    [`path`, { d: `M7 2v2` }],
    [`rect`, { x: `4`, y: `4`, width: `16`, height: `16`, rx: `2` }],
    [`rect`, { x: `8`, y: `8`, width: `8`, height: `8`, rx: `1` }],
  ],
  wv = [
    [`rect`, { width: `20`, height: `14`, x: `2`, y: `5`, rx: `2` }],
    [`line`, { x1: `2`, x2: `22`, y1: `10`, y2: `10` }],
  ],
  Tv = [
    [
      `path`,
      { d: `M10.2 18H4.774a1.5 1.5 0 0 1-1.352-.97 11 11 0 0 1 .132-6.487` },
    ],
    [
      `path`,
      { d: `M18 10.2V4.774a1.5 1.5 0 0 0-.97-1.352 11 11 0 0 0-6.486.132` },
    ],
    [`path`, { d: `M18 5a4 3 0 0 1 4 3 2 2 0 0 1-2 2 10 10 0 0 0-5.139 1.42` }],
    [`path`, { d: `M5 18a3 4 0 0 0 3 4 2 2 0 0 0 2-2 10 10 0 0 1 1.42-5.14` }],
    [
      `path`,
      {
        d: `M8.709 2.554a10 10 0 0 0-6.155 6.155 1.5 1.5 0 0 0 .676 1.626l9.807 5.42a2 2 0 0 0 2.718-2.718l-5.42-9.807a1.5 1.5 0 0 0-1.626-.676`,
      },
    ],
  ],
  Ev = [
    [`path`, { d: `M6 2v14a2 2 0 0 0 2 2h14` }],
    [`path`, { d: `M18 22V8a2 2 0 0 0-2-2H2` }],
  ],
  Dv = [
    [
      `path`,
      {
        d: `M4 9a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4a1 1 0 0 1 1 1v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4a1 1 0 0 1 1-1h4a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-4a1 1 0 0 1-1-1V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4a1 1 0 0 1-1 1z`,
      },
    ],
  ],
  Ov = [
    [
      `path`,
      {
        d: `M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z`,
      },
    ],
    [`path`, { d: `M5 21h14` }],
  ],
  kv = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`line`, { x1: `22`, x2: `18`, y1: `12`, y2: `12` }],
    [`line`, { x1: `6`, x2: `2`, y1: `12`, y2: `12` }],
    [`line`, { x1: `12`, x2: `12`, y1: `6`, y2: `2` }],
    [`line`, { x1: `12`, x2: `12`, y1: `22`, y2: `18` }],
  ],
  Av = [
    [`path`, { d: `M10 22v-8` }],
    [`path`, { d: `M2.336 8.89 10 14l11.715-7.029` }],
    [
      `path`,
      {
        d: `M22 14a2 2 0 0 1-.971 1.715l-10 6a2 2 0 0 1-2.138-.05l-6-4A2 2 0 0 1 2 16v-6a2 2 0 0 1 .971-1.715l10-6a2 2 0 0 1 2.138.05l6 4A2 2 0 0 1 22 8z`,
      },
    ],
  ],
  jv = [
    [
      `path`,
      { d: `m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8` },
    ],
    [`path`, { d: `M5 8h14` }],
    [`path`, { d: `M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0` }],
    [`path`, { d: `m12 8 1-6h2` }],
  ],
  Mv = [
    [`ellipse`, { cx: `12`, cy: `5`, rx: `9`, ry: `3` }],
    [`path`, { d: `M3 5v14a9 3 0 0 0 18 0V5` }],
  ],
  Nv = [
    [`circle`, { cx: `12`, cy: `12`, r: `8` }],
    [`line`, { x1: `3`, x2: `6`, y1: `3`, y2: `6` }],
    [`line`, { x1: `21`, x2: `18`, y1: `3`, y2: `6` }],
    [`line`, { x1: `3`, x2: `6`, y1: `21`, y2: `18` }],
    [`line`, { x1: `21`, x2: `18`, y1: `21`, y2: `18` }],
  ],
  Pv = [
    [
      `path`,
      {
        d: `M11 11.31c1.17.56 1.54 1.69 3.5 1.69 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1`,
      },
    ],
    [
      `path`,
      { d: `M11.75 18c.35.5 1.45 1 2.75 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1` },
    ],
    [`path`, { d: `M2 10h4` }],
    [`path`, { d: `M2 14h4` }],
    [`path`, { d: `M2 18h4` }],
    [`path`, { d: `M2 6h4` }],
    [
      `path`,
      {
        d: `M7 3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1L10 4a1 1 0 0 0-1-1z`,
      },
    ],
  ],
  Fv = [
    [`ellipse`, { cx: `12`, cy: `5`, rx: `9`, ry: `3` }],
    [`path`, { d: `M3 12a9 3 0 0 0 5 2.69` }],
    [`path`, { d: `M21 9.3V5` }],
    [`path`, { d: `M3 5v14a9 3 0 0 0 6.47 2.88` }],
    [`path`, { d: `M12 12v4h4` }],
    [
      `path`,
      {
        d: `M13 20a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L12 16`,
      },
    ],
  ],
  Iv = [
    [`path`, { d: `M21 11.693V5` }],
    [`path`, { d: `m22 22-1.875-1.875` }],
    [`path`, { d: `M3 12a9 3 0 0 0 8.697 2.998` }],
    [`path`, { d: `M3 5v14a9 3 0 0 0 9.28 2.999` }],
    [`circle`, { cx: `18`, cy: `18`, r: `3` }],
    [`ellipse`, { cx: `12`, cy: `5`, rx: `9`, ry: `3` }],
  ],
  Lv = [
    [`ellipse`, { cx: `12`, cy: `5`, rx: `9`, ry: `3` }],
    [`path`, { d: `M3 5V19A9 3 0 0 0 15 21.84` }],
    [`path`, { d: `M21 5V8` }],
    [`path`, { d: `M21 12L18 17H22L19 22` }],
    [`path`, { d: `M3 12A9 3 0 0 0 14.59 14.87` }],
  ],
  Rv = [
    [`ellipse`, { cx: `12`, cy: `5`, rx: `9`, ry: `3` }],
    [`path`, { d: `M3 5V19A9 3 0 0 0 21 19V5` }],
    [`path`, { d: `M3 12A9 3 0 0 0 21 12` }],
  ],
  zv = [
    [`path`, { d: `m13 21-3-3 3-3` }],
    [`path`, { d: `M20 18H10` }],
    [`path`, { d: `M3 11h.01` }],
    [`rect`, { x: `6`, y: `3`, width: `5`, height: `8`, rx: `2.5` }],
  ],
  Bv = [
    [`path`, { d: `M10 18h10` }],
    [`path`, { d: `m17 21 3-3-3-3` }],
    [`path`, { d: `M3 11h.01` }],
    [`rect`, { x: `15`, y: `3`, width: `5`, height: `8`, rx: `2.5` }],
    [`rect`, { x: `6`, y: `3`, width: `5`, height: `8`, rx: `2.5` }],
  ],
  Vv = [
    [
      `path`,
      {
        d: `M10.162 3.167A10 10 0 0 0 2 13a2 2 0 0 0 4 0v-1a2 2 0 0 1 4 0v4a2 2 0 0 0 4 0v-4a2 2 0 0 1 4 0v1a2 2 0 0 0 4-.006 10 10 0 0 0-8.161-9.826`,
      },
    ],
    [`path`, { d: `M20.804 14.869a9 9 0 0 1-17.608 0` }],
    [`circle`, { cx: `12`, cy: `4`, r: `2` }],
  ],
  Hv = [
    [
      `path`,
      {
        d: `M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z`,
      },
    ],
    [`path`, { d: `m12 9 6 6` }],
    [`path`, { d: `m18 9-6 6` }],
  ],
  Uv = [
    [`circle`, { cx: `19`, cy: `19`, r: `2` }],
    [`circle`, { cx: `5`, cy: `5`, r: `2` }],
    [`path`, { d: `M6.48 3.66a10 10 0 0 1 13.86 13.86` }],
    [`path`, { d: `m6.41 6.41 11.18 11.18` }],
    [`path`, { d: `M3.66 6.48a10 10 0 0 0 13.86 13.86` }],
  ],
  Wv = [
    [
      `path`,
      {
        d: `M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z`,
      },
    ],
    [`path`, { d: `M8 12h8` }],
  ],
  Gv = [
    [
      `path`,
      {
        d: `M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0Z`,
      },
    ],
    [`path`, { d: `M9.2 9.2h.01` }],
    [`path`, { d: `m14.5 9.5-5 5` }],
    [`path`, { d: `M14.7 14.8h.01` }],
  ],
  Kv = [
    [`path`, { d: `M12 8v8` }],
    [
      `path`,
      {
        d: `M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z`,
      },
    ],
    [`path`, { d: `M8 12h8` }],
  ],
  qv = [
    [
      `path`,
      {
        d: `M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z`,
      },
    ],
  ],
  Jv = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2`, ry: `2` }],
    [`path`, { d: `M15 9h.01` }],
    [`path`, { d: `M9 15h.01` }],
  ],
  Yv = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2`, ry: `2` }],
    [`path`, { d: `M16 8h.01` }],
    [`path`, { d: `M12 12h.01` }],
    [`path`, { d: `M8 16h.01` }],
  ],
  Xv = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2`, ry: `2` }],
    [`path`, { d: `M12 12h.01` }],
  ],
  Zv = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2`, ry: `2` }],
    [`path`, { d: `M16 8h.01` }],
    [`path`, { d: `M8 8h.01` }],
    [`path`, { d: `M8 16h.01` }],
    [`path`, { d: `M16 16h.01` }],
  ],
  Qv = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2`, ry: `2` }],
    [`path`, { d: `M16 8h.01` }],
    [`path`, { d: `M8 8h.01` }],
    [`path`, { d: `M8 16h.01` }],
    [`path`, { d: `M16 16h.01` }],
    [`path`, { d: `M12 12h.01` }],
  ],
  $v = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2`, ry: `2` }],
    [`path`, { d: `M16 8h.01` }],
    [`path`, { d: `M16 12h.01` }],
    [`path`, { d: `M16 16h.01` }],
    [`path`, { d: `M8 8h.01` }],
    [`path`, { d: `M8 12h.01` }],
    [`path`, { d: `M8 16h.01` }],
  ],
  ey = [
    [`path`, { d: `M12 3v14` }],
    [`path`, { d: `M5 10h14` }],
    [`path`, { d: `M5 21h14` }],
  ],
  ty = [
    [`rect`, { width: `12`, height: `12`, x: `2`, y: `10`, rx: `2`, ry: `2` }],
    [
      `path`,
      {
        d: `m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6`,
      },
    ],
    [`path`, { d: `M6 18h.01` }],
    [`path`, { d: `M10 14h.01` }],
    [`path`, { d: `M15 6h.01` }],
    [`path`, { d: `M18 9h.01` }],
  ],
  ny = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`circle`, { cx: `12`, cy: `12`, r: `4` }],
    [`path`, { d: `M12 12h.01` }],
  ],
  ry = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M6 12c0-1.7.7-3.2 1.8-4.2` }],
    [`circle`, { cx: `12`, cy: `12`, r: `2` }],
    [`path`, { d: `M18 12c0 1.7-.7 3.2-1.8 4.2` }],
  ],
  iy = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`circle`, { cx: `12`, cy: `12`, r: `5` }],
    [`path`, { d: `M12 12h.01` }],
  ],
  ay = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`circle`, { cx: `12`, cy: `12`, r: `2` }],
  ],
  oy = [
    [`circle`, { cx: `12`, cy: `6`, r: `1` }],
    [`line`, { x1: `5`, x2: `19`, y1: `12`, y2: `12` }],
    [`circle`, { cx: `12`, cy: `18`, r: `1` }],
  ],
  sy = [
    [`path`, { d: `M15 2c-1.35 1.5-2.092 3-2.5 4.5L14 8` }],
    [`path`, { d: `m17 6-2.891-2.891` }],
    [`path`, { d: `M2 15c3.333-3 6.667-3 10-3` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `m20 9 .891.891` }],
    [`path`, { d: `M22 9c-1.5 1.35-3 2.092-4.5 2.5l-1-1` }],
    [`path`, { d: `M3.109 14.109 4 15` }],
    [`path`, { d: `m6.5 12.5 1 1` }],
    [`path`, { d: `m7 18 2.891 2.891` }],
    [`path`, { d: `M9 22c1.35-1.5 2.092-3 2.5-4.5L10 16` }],
  ],
  cy = [
    [`path`, { d: `m10 16 1.5 1.5` }],
    [`path`, { d: `m14 8-1.5-1.5` }],
    [`path`, { d: `M15 2c-1.798 1.998-2.518 3.995-2.807 5.993` }],
    [`path`, { d: `m16.5 10.5 1 1` }],
    [`path`, { d: `m17 6-2.891-2.891` }],
    [`path`, { d: `M2 15c6.667-6 13.333 0 20-6` }],
    [`path`, { d: `m20 9 .891.891` }],
    [`path`, { d: `M3.109 14.109 4 15` }],
    [`path`, { d: `m6.5 12.5 1 1` }],
    [`path`, { d: `m7 18 2.891 2.891` }],
    [`path`, { d: `M9 22c1.798-1.998 2.518-3.995 2.807-5.993` }],
  ],
  ly = [
    [`path`, { d: `M2 8h20` }],
    [`rect`, { width: `20`, height: `16`, x: `2`, y: `4`, rx: `2` }],
    [`path`, { d: `M6 16h12` }],
  ],
  uy = [
    [`line`, { x1: `12`, x2: `12`, y1: `2`, y2: `22` }],
    [`path`, { d: `M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6` }],
  ],
  dy = [
    [`path`, { d: `M11.25 16.25h1.5L12 17z` }],
    [`path`, { d: `M16 14v.5` }],
    [
      `path`,
      {
        d: `M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309`,
      },
    ],
    [`path`, { d: `M8 14v.5` }],
    [
      `path`,
      {
        d: `M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5`,
      },
    ],
  ],
  fy = [
    [
      `path`,
      {
        d: `M20.5 10a2.5 2.5 0 0 1-2.4-3H18a2.95 2.95 0 0 1-2.6-4.4 10 10 0 1 0 6.3 7.1c-.3.2-.8.3-1.2.3`,
      },
    ],
    [`circle`, { cx: `12`, cy: `12`, r: `3` }],
  ],
  py = [
    [`path`, { d: `M10 12h.01` }],
    [`path`, { d: `M18 9V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14` }],
    [`path`, { d: `M2 20h8` }],
    [`path`, { d: `M20 17v-2a2 2 0 1 0-4 0v2` }],
    [`rect`, { x: `14`, y: `17`, width: `8`, height: `5`, rx: `1` }],
  ],
  my = [
    [`path`, { d: `M10 12h.01` }],
    [`path`, { d: `M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14` }],
    [`path`, { d: `M2 20h20` }],
  ],
  hy = [[`circle`, { cx: `12.1`, cy: `12.1`, r: `1` }]],
  gy = [
    [`path`, { d: `M11 20H2` }],
    [
      `path`,
      {
        d: `M11 4.562v16.157a1 1 0 0 0 1.242.97L19 20V5.562a2 2 0 0 0-1.515-1.94l-4-1A2 2 0 0 0 11 4.561z`,
      },
    ],
    [`path`, { d: `M11 4H8a2 2 0 0 0-2 2v14` }],
    [`path`, { d: `M14 12h.01` }],
    [`path`, { d: `M22 20h-3` }],
  ],
  _y = [
    [`path`, { d: `M12 15V3` }],
    [`path`, { d: `M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4` }],
    [`path`, { d: `m7 10 5 5 5-5` }],
  ],
  vy = [
    [`path`, { d: `m12.99 6.74 1.93 3.44` }],
    [`path`, { d: `M19.136 12a10 10 0 0 1-14.271 0` }],
    [`path`, { d: `m21 21-2.16-3.84` }],
    [`path`, { d: `m3 21 8.02-14.26` }],
    [`circle`, { cx: `12`, cy: `5`, r: `2` }],
  ],
  yy = [
    [`path`, { d: `M10 11h.01` }],
    [`path`, { d: `M14 6h.01` }],
    [`path`, { d: `M18 6h.01` }],
    [`path`, { d: `M6.5 13.1h.01` }],
    [`path`, { d: `M22 5c0 9-4 12-6 12s-6-3-6-12c0-2 2-3 6-3s6 1 6 3` }],
    [`path`, { d: `M17.4 9.9c-.8.8-2 .8-2.8 0` }],
    [
      `path`,
      {
        d: `M10.1 7.1C9 7.2 7.7 7.7 6 8.6c-3.5 2-4.7 3.9-3.7 5.6 4.5 7.8 9.5 8.4 11.2 7.4.9-.5 1.9-2.1 1.9-4.7`,
      },
    ],
    [`path`, { d: `M9.1 16.5c.3-1.1 1.4-1.7 2.4-1.4` }],
  ],
  by = [
    [
      `path`,
      {
        d: `M10 18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a3 3 0 0 1-3-3 1 1 0 0 1 1-1z`,
      },
    ],
    [
      `path`,
      {
        d: `M13 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1l-.81 3.242a1 1 0 0 1-.97.758H8`,
      },
    ],
    [`path`, { d: `M14 4h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3` }],
    [`path`, { d: `M18 6h4` }],
    [`path`, { d: `m5 10-2 8` }],
    [`path`, { d: `m7 18 2-8` }],
  ],
  xy = [
    [`path`, { d: `M10 10 7 7` }],
    [`path`, { d: `m10 14-3 3` }],
    [`path`, { d: `m14 10 3-3` }],
    [`path`, { d: `m14 14 3 3` }],
    [`path`, { d: `M14.205 4.139a4 4 0 1 1 5.439 5.863` }],
    [`path`, { d: `M19.637 14a4 4 0 1 1-5.432 5.868` }],
    [`path`, { d: `M4.367 10a4 4 0 1 1 5.438-5.862` }],
    [`path`, { d: `M9.795 19.862a4 4 0 1 1-5.429-5.873` }],
    [`rect`, { x: `10`, y: `8`, width: `4`, height: `8`, rx: `1` }],
  ],
  Sy = [
    [
      `path`,
      {
        d: `M18.715 13.186C18.29 11.858 17.384 10.607 16 9.5c-2-1.6-3.5-4-4-6.5a10.7 10.7 0 0 1-.884 2.586`,
      },
    ],
    [`path`, { d: `m2 2 20 20` }],
    [
      `path`,
      {
        d: `M8.795 8.797A11 11 0 0 1 8 9.5C6 11.1 5 13 5 15a7 7 0 0 0 13.222 3.208`,
      },
    ],
  ],
  Cy = [
    [
      `path`,
      {
        d: `M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z`,
      },
    ],
  ],
  wy = [
    [`path`, { d: `m2 2 8 8` }],
    [`path`, { d: `m22 2-8 8` }],
    [`ellipse`, { cx: `12`, cy: `9`, rx: `10`, ry: `5` }],
    [`path`, { d: `M7 13.4v7.9` }],
    [`path`, { d: `M12 14v8` }],
    [`path`, { d: `M17 13.4v7.9` }],
    [`path`, { d: `M2 9v8a10 5 0 0 0 20 0V9` }],
  ],
  Ty = [
    [
      `path`,
      {
        d: `M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z`,
      },
    ],
    [
      `path`,
      {
        d: `M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97`,
      },
    ],
  ],
  Ey = [
    [
      `path`,
      { d: `M15.4 15.63a7.875 6 135 1 1 6.23-6.23 4.5 3.43 135 0 0-6.23 6.23` },
    ],
    [
      `path`,
      {
        d: `m8.29 12.71-2.6 2.6a2.5 2.5 0 1 0-1.65 4.65A2.5 2.5 0 1 0 8.7 18.3l2.59-2.59`,
      },
    ],
  ],
  Dy = [
    [
      `path`,
      {
        d: `M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z`,
      },
    ],
    [`path`, { d: `m2.5 21.5 1.4-1.4` }],
    [`path`, { d: `m20.1 3.9 1.4-1.4` }],
    [
      `path`,
      {
        d: `M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z`,
      },
    ],
    [`path`, { d: `m9.6 14.4 4.8-4.8` }],
  ],
  Oy = [
    [`path`, { d: `M6 18.5a3.5 3.5 0 1 0 7 0c0-1.57.92-2.52 2.04-3.46` }],
    [`path`, { d: `M6 8.5c0-.75.13-1.47.36-2.14` }],
    [`path`, { d: `M8.8 3.15A6.5 6.5 0 0 1 19 8.5c0 1.63-.44 2.81-1.09 3.76` }],
    [`path`, { d: `M12.5 6A2.5 2.5 0 0 1 15 8.5M10 13a2 2 0 0 0 1.82-1.18` }],
    [`line`, { x1: `2`, x2: `22`, y1: `2`, y2: `22` }],
  ],
  ky = [
    [`path`, { d: `M7 3.34V5a3 3 0 0 0 3 3` }],
    [
      `path`,
      { d: `M11 21.95V18a2 2 0 0 0-2-2 2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05` },
    ],
    [`path`, { d: `M21.54 15H17a2 2 0 0 0-2 2v4.54` }],
    [`path`, { d: `M12 2a10 10 0 1 0 9.54 13` }],
    [`path`, { d: `M20 6V4a2 2 0 1 0-4 0v2` }],
    [`rect`, { width: `8`, height: `5`, x: `14`, y: `6`, rx: `1` }],
  ],
  Ay = [
    [`path`, { d: `M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0` }],
    [`path`, { d: `M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4` }],
  ],
  jy = [
    [`path`, { d: `M21.54 15H17a2 2 0 0 0-2 2v4.54` }],
    [
      `path`,
      {
        d: `M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17`,
      },
    ],
    [
      `path`,
      { d: `M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05` },
    ],
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
  ],
  My = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M12 2a7 7 0 1 0 10 10` }],
  ],
  Ny = [
    [`circle`, { cx: `11.5`, cy: `12.5`, r: `3.5` }],
    [
      `path`,
      {
        d: `M3 8c0-3.5 2.5-6 6.5-6 5 0 4.83 3 7.5 5s5 2 5 6c0 4.5-2.5 6.5-7 6.5-2.5 0-2.5 2.5-6 2.5s-7-2-7-5.5c0-3 1.5-3 1.5-5C3.5 10 3 9 3 8Z`,
      },
    ],
  ],
  Py = [
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M20 14.347V14c0-6-4-12-8-12-1.078 0-2.157.436-3.157 1.19` }],
    [`path`, { d: `M6.206 6.21C4.871 8.4 4 11.2 4 14a8 8 0 0 0 14.568 4.568` }],
  ],
  Fy = [[`path`, { d: `M12 2C8 2 4 8 4 14a8 8 0 0 0 16 0c0-6-4-12-8-12` }]],
  Iy = [[`ellipse`, { cx: `12`, cy: `12`, rx: `10`, ry: `6` }]],
  Ly = [
    [`circle`, { cx: `12`, cy: `12`, r: `1` }],
    [`circle`, { cx: `12`, cy: `5`, r: `1` }],
    [`circle`, { cx: `12`, cy: `19`, r: `1` }],
  ],
  Ry = [
    [`circle`, { cx: `12`, cy: `12`, r: `1` }],
    [`circle`, { cx: `19`, cy: `12`, r: `1` }],
    [`circle`, { cx: `5`, cy: `12`, r: `1` }],
  ],
  zy = [
    [`path`, { d: `M5 15a6.5 6.5 0 0 1 7 0 6.5 6.5 0 0 0 7 0` }],
    [`path`, { d: `M5 9a6.5 6.5 0 0 1 7 0 6.5 6.5 0 0 0 7 0` }],
  ],
  By = [
    [`line`, { x1: `5`, x2: `19`, y1: `9`, y2: `9` }],
    [`line`, { x1: `5`, x2: `19`, y1: `15`, y2: `15` }],
    [`line`, { x1: `19`, x2: `5`, y1: `5`, y2: `19` }],
  ],
  Vy = [
    [`line`, { x1: `5`, x2: `19`, y1: `9`, y2: `9` }],
    [`line`, { x1: `5`, x2: `19`, y1: `15`, y2: `15` }],
  ],
  Hy = [
    [
      `path`,
      {
        d: `M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21`,
      },
    ],
    [`path`, { d: `m5.082 11.09 8.828 8.828` }],
  ],
  Uy = [
    [
      `path`,
      {
        d: `m15 20 3-3h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2l3 3z`,
      },
    ],
    [`path`, { d: `M6 8v1` }],
    [`path`, { d: `M10 8v1` }],
    [`path`, { d: `M14 8v1` }],
    [`path`, { d: `M18 8v1` }],
  ],
  Wy = [
    [`path`, { d: `M4 10h12` }],
    [`path`, { d: `M4 14h9` }],
    [
      `path`,
      {
        d: `M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2`,
      },
    ],
  ],
  Gy = [
    [
      `path`,
      {
        d: `M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0v-6.998a2 2 0 0 0-.59-1.42L18 5`,
      },
    ],
    [`path`, { d: `M14 21V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16` }],
    [`path`, { d: `M2 21h13` }],
    [`path`, { d: `M3 7h11` }],
    [`path`, { d: `m9 11-2 3h3l-2 3` }],
  ],
  Ky = [
    [`path`, { d: `m15 15 6 6` }],
    [`path`, { d: `m15 9 6-6` }],
    [`path`, { d: `M21 16v5h-5` }],
    [`path`, { d: `M21 8V3h-5` }],
    [`path`, { d: `M3 16v5h5` }],
    [`path`, { d: `m3 21 6-6` }],
    [`path`, { d: `M3 8V3h5` }],
    [`path`, { d: `M9 9 3 3` }],
  ],
  qy = [
    [`path`, { d: `M15 3h6v6` }],
    [`path`, { d: `M10 14 21 3` }],
    [`path`, { d: `M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6` }],
  ],
  Jy = [
    [`path`, { d: `m15 18-.722-3.25` }],
    [`path`, { d: `M2 8a10.645 10.645 0 0 0 20 0` }],
    [`path`, { d: `m20 15-1.726-2.05` }],
    [`path`, { d: `m4 15 1.726-2.05` }],
    [`path`, { d: `m9 18 .722-3.25` }],
  ],
  Yy = [
    [
      `path`,
      {
        d: `M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49`,
      },
    ],
    [`path`, { d: `M14.084 14.158a3 3 0 0 1-4.242-4.242` }],
    [
      `path`,
      {
        d: `M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143`,
      },
    ],
    [`path`, { d: `m2 2 20 20` }],
  ],
  Xy = [
    [
      `path`,
      {
        d: `M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0`,
      },
    ],
    [`circle`, { cx: `12`, cy: `12`, r: `3` }],
  ],
  Zy = [
    [
      `path`,
      {
        d: `M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z`,
      },
    ],
    [`path`, { d: `M12 12v.01` }],
  ],
  Qy = [
    [`path`, { d: `M12 16h.01` }],
    [`path`, { d: `M16 16h.01` }],
    [
      `path`,
      {
        d: `M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z`,
      },
    ],
    [`path`, { d: `M8 16h.01` }],
  ],
  $y = [
    [
      `path`,
      {
        d: `M12 6a2 2 0 0 1 3.414-1.414l6 6a2 2 0 0 1 0 2.828l-6 6A2 2 0 0 1 12 18z`,
      },
    ],
    [
      `path`,
      {
        d: `M2 6a2 2 0 0 1 3.414-1.414l6 6a2 2 0 0 1 0 2.828l-6 6A2 2 0 0 1 2 18z`,
      },
    ],
  ],
  eb = [
    [
      `path`,
      {
        d: `M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z`,
      },
    ],
    [`path`, { d: `M16 8 2 22` }],
    [`path`, { d: `M17.5 15H9` }],
  ],
  tb = [
    [`path`, { d: `M4 3 2 5v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z` }],
    [`path`, { d: `M6 8h4` }],
    [`path`, { d: `M6 18h4` }],
    [`path`, { d: `m12 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z` }],
    [`path`, { d: `M14 8h4` }],
    [`path`, { d: `M14 18h4` }],
    [`path`, { d: `m20 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z` }],
  ],
  nb = [
    [`circle`, { cx: `12`, cy: `12`, r: `2` }],
    [`path`, { d: `M12 2v4` }],
    [`path`, { d: `m6.8 15-3.5 2` }],
    [`path`, { d: `m20.7 7-3.5 2` }],
    [`path`, { d: `M6.8 9 3.3 7` }],
    [`path`, { d: `m20.7 17-3.5-2` }],
    [`path`, { d: `m9 22 3-8 3 8` }],
    [`path`, { d: `M8 22h8` }],
    [`path`, { d: `M18 18.7a9 9 0 1 0-12 0` }],
  ],
  rb = [
    [
      `path`,
      {
        d: `M13.659 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v11.5`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M8 12v-1` }],
    [`path`, { d: `M8 18v-2` }],
    [`path`, { d: `M8 7V6` }],
    [`circle`, { cx: `8`, cy: `20`, r: `2` }],
  ],
  ib = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `m8 18 4-4` }],
    [`path`, { d: `M8 10v8h8` }],
  ],
  ab = [
    [
      `path`,
      {
        d: `M13 22h5a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v3.3`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [
      `path`,
      {
        d: `m7.69 16.479 1.29 4.88a.5.5 0 0 1-.698.591l-1.843-.849a1 1 0 0 0-.879.001l-1.846.85a.5.5 0 0 1-.692-.593l1.29-4.88`,
      },
    ],
    [`circle`, { cx: `6`, cy: `14`, r: `3` }],
  ],
  ob = [
    [
      `path`,
      {
        d: `M14.5 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v3.8`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M11.7 14.2 7 17l-4.7-2.8` }],
    [
      `path`,
      {
        d: `M3 13.1a2 2 0 0 0-.999 1.76v3.24a2 2 0 0 0 .969 1.78L6 21.7a2 2 0 0 0 2.03.01L11 19.9a2 2 0 0 0 1-1.76V14.9a2 2 0 0 0-.97-1.78L8 11.3a2 2 0 0 0-2.03-.01z`,
      },
    ],
    [`path`, { d: `M7 17v5` }],
  ],
  sb = [
    [
      `path`,
      {
        d: `M14 22h4a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v6`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [
      `path`,
      {
        d: `M5 14a1 1 0 0 0-1 1v2a1 1 0 0 1-1 1 1 1 0 0 1 1 1v2a1 1 0 0 0 1 1`,
      },
    ],
    [
      `path`,
      {
        d: `M9 22a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-2a1 1 0 0 0-1-1`,
      },
    ],
  ],
  cb = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [
      `path`,
      {
        d: `M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1`,
      },
    ],
    [
      `path`,
      {
        d: `M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1`,
      },
    ],
  ],
  lb = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M8 18v-2` }],
    [`path`, { d: `M12 18v-4` }],
    [`path`, { d: `M16 18v-6` }],
  ],
  ub = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M8 18v-1` }],
    [`path`, { d: `M12 18v-6` }],
    [`path`, { d: `M16 18v-3` }],
  ],
  db = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `m16 13-3.5 3.5-2-2L8 17` }],
  ],
  fb = [
    [
      `path`,
      {
        d: `M15.941 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.704l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v3.512`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M4.017 11.512a6 6 0 1 0 8.466 8.475` }],
    [
      `path`,
      {
        d: `M9 16a1 1 0 0 1-1-1v-4c0-.552.45-1.008.995-.917a6 6 0 0 1 4.922 4.922c.091.544-.365.995-.917.995z`,
      },
    ],
  ],
  pb = [
    [
      `path`,
      {
        d: `M10.5 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v6`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `m14 20 2 2 4-4` }],
  ],
  mb = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `m9 15 2 2 4-4` }],
  ],
  hb = [
    [
      `path`,
      {
        d: `M16 22h2a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v2.85`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M8 14v2.2l1.6 1` }],
    [`circle`, { cx: `8`, cy: `16`, r: `6` }],
  ],
  gb = [
    [
      `path`,
      {
        d: `M4 12.15V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2h-3.35`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `m5 16-3 3 3 3` }],
    [`path`, { d: `m9 22 3-3-3-3` }],
  ],
  _b = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M10 12.5 8 15l2 2.5` }],
    [`path`, { d: `m14 12.5 2 2.5-2 2.5` }],
  ],
  vb = [
    [
      `path`,
      {
        d: `M15 8a1 1 0 0 1-1-1V2a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8z`,
      },
    ],
    [`path`, { d: `M20 8v12a2 2 0 0 1-2 2h-4.182` }],
    [`path`, { d: `m3.305 19.53.923-.382` }],
    [`path`, { d: `M4 10.592V4a2 2 0 0 1 2-2h8` }],
    [`path`, { d: `m4.228 16.852-.924-.383` }],
    [`path`, { d: `m5.852 15.228-.383-.923` }],
    [`path`, { d: `m5.852 20.772-.383.924` }],
    [`path`, { d: `m8.148 15.228.383-.923` }],
    [`path`, { d: `m8.53 21.696-.382-.924` }],
    [`path`, { d: `m9.773 16.852.922-.383` }],
    [`path`, { d: `m9.773 19.148.922.383` }],
    [`circle`, { cx: `7`, cy: `18`, r: `3` }],
  ],
  yb = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M9 10h6` }],
    [`path`, { d: `M12 13V7` }],
    [`path`, { d: `M9 17h6` }],
  ],
  bb = [
    [
      `path`,
      {
        d: `M4 12V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M10 16h2v6` }],
    [`path`, { d: `M10 22h4` }],
    [`rect`, { x: `2`, y: `16`, width: `4`, height: `6`, rx: `2` }],
  ],
  xb = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M12 18v-6` }],
    [`path`, { d: `m9 15 3 3 3-3` }],
  ],
  Sb = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M12 9v4` }],
    [`path`, { d: `M12 17h.01` }],
  ],
  Cb = [
    [
      `path`,
      {
        d: `M13 22h5a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v7`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [
      `path`,
      {
        d: `M3.62 18.8A2.25 2.25 0 1 1 7 15.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a1 1 0 0 1-1.507 0z`,
      },
    ],
  ],
  wb = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`circle`, { cx: `10`, cy: `12`, r: `2` }],
    [`path`, { d: `m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22` }],
  ],
  Tb = [
    [
      `path`,
      {
        d: `M4 6.835V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2h-.343`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [
      `path`,
      {
        d: `M2 19a2 2 0 0 1 4 0v1a2 2 0 0 1-4 0v-4a6 6 0 0 1 12 0v4a2 2 0 0 1-4 0v-1a2 2 0 0 1 4 0`,
      },
    ],
  ],
  Eb = [
    [
      `path`,
      {
        d: `M4 11V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M2 15h10` }],
    [`path`, { d: `m9 18 3-3-3-3` }],
  ],
  Db = [
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M4 12v6` }],
    [`path`, { d: `M4 14h2` }],
    [
      `path`,
      {
        d: `M9.65 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v4`,
      },
    ],
    [`circle`, { cx: `4`, cy: `20`, r: `2` }],
  ],
  Ob = [
    [
      `path`,
      {
        d: `M4 9.8V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2h-3`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M9 17v-2a2 2 0 0 0-4 0v2` }],
    [`rect`, { width: `8`, height: `5`, x: `3`, y: `17`, rx: `1` }],
  ],
  kb = [
    [
      `path`,
      {
        d: `M20 14V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M14 18h6` }],
  ],
  Ab = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M9 15h6` }],
  ],
  jb = [
    [
      `path`,
      {
        d: `M11.65 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v10.35`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M8 20v-7l3 1.474` }],
    [`circle`, { cx: `6`, cy: `20`, r: `2` }],
  ],
  Mb = [
    [
      `path`,
      {
        d: `M4.226 20.925A2 2 0 0 0 6 22h12a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v3.127`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `m5 11-3 3` }],
    [`path`, { d: `m5 17-3-3h10` }],
  ],
  Nb = [
    [
      `path`,
      {
        d: `M14.364 13.634a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506l4.013-4.009a1 1 0 0 0-3.004-3.004z`,
      },
    ],
    [`path`, { d: `M14.487 7.858A1 1 0 0 1 14 7V2` }],
    [
      `path`,
      {
        d: `M20 19.645V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l2.516 2.516`,
      },
    ],
    [`path`, { d: `M8 18h1` }],
  ],
  Pb = [
    [
      `path`,
      {
        d: `M12.659 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v9.34`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [
      `path`,
      {
        d: `M10.378 12.622a1 1 0 0 1 3 3.003L8.36 20.637a2 2 0 0 1-.854.506l-2.867.837a.5.5 0 0 1-.62-.62l.836-2.869a2 2 0 0 1 .506-.853z`,
      },
    ],
  ],
  Fb = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [
      `path`,
      {
        d: `M15.033 13.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56v-4.704a.645.645 0 0 1 .967-.56z`,
      },
    ],
  ],
  Ib = [
    [
      `path`,
      {
        d: `M11.35 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v5.35`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M14 19h6` }],
    [`path`, { d: `M17 16v6` }],
  ],
  Lb = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M9 15h6` }],
    [`path`, { d: `M12 18v-6` }],
  ],
  Rb = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M12 17h.01` }],
    [`path`, { d: `M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3` }],
  ],
  zb = [
    [
      `path`,
      {
        d: `M20 10V8a2.4 2.4 0 0 0-.706-1.704l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4.35`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M16 14a2 2 0 0 0-2 2` }],
    [`path`, { d: `M16 22a2 2 0 0 1-2-2` }],
    [`path`, { d: `M20 14a2 2 0 0 1 2 2` }],
    [`path`, { d: `M20 22a2 2 0 0 0 2-2` }],
  ],
  Bb = [
    [
      `path`,
      {
        d: `M11.1 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.589 3.588A2.4 2.4 0 0 1 20 8v3.25`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `m21 22-2.88-2.88` }],
    [`circle`, { cx: `16`, cy: `17`, r: `3` }],
  ],
  Vb = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`circle`, { cx: `11.5`, cy: `14.5`, r: `2.5` }],
    [`path`, { d: `M13.3 16.3 15 18` }],
  ],
  Hb = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M8 15h.01` }],
    [`path`, { d: `M11.5 13.5a2.5 2.5 0 0 1 0 3` }],
    [`path`, { d: `M15 12a5 5 0 0 1 0 6` }],
  ],
  Ub = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M8 12h8` }],
    [`path`, { d: `M10 11v2` }],
    [`path`, { d: `M8 17h8` }],
    [`path`, { d: `M14 16v2` }],
  ],
  Wb = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M8 13h2` }],
    [`path`, { d: `M14 13h2` }],
    [`path`, { d: `M8 17h2` }],
    [`path`, { d: `M14 17h2` }],
  ],
  Gb = [
    [
      `path`,
      {
        d: `M4 11V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h7`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `m10 18 3-3-3-3` }],
  ],
  Kb = [
    [`path`, { d: `M11 21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1` }],
    [`path`, { d: `M16 16a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1` }],
    [
      `path`,
      {
        d: `M21 6a2 2 0 0 0-.586-1.414l-2-2A2 2 0 0 0 17 2h-3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1z`,
      },
    ],
  ],
  qb = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `m8 16 2-2-2-2` }],
    [`path`, { d: `M12 18h4` }],
  ],
  Jb = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M10 9H8` }],
    [`path`, { d: `M16 13H8` }],
    [`path`, { d: `M16 17H8` }],
  ],
  Yb = [
    [
      `path`,
      {
        d: `M12 22h6a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v6`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M3 16v-1.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5V16` }],
    [`path`, { d: `M6 22h2` }],
    [`path`, { d: `M7 14v8` }],
  ],
  Xb = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M11 18h2` }],
    [`path`, { d: `M12 12v6` }],
    [`path`, { d: `M9 13v-.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v.5` }],
  ],
  Zb = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M12 12v6` }],
    [`path`, { d: `m15 15-3-3-3 3` }],
  ],
  Qb = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M16 22a4 4 0 0 0-8 0` }],
    [`circle`, { cx: `12`, cy: `15`, r: `3` }],
  ],
  $b = [
    [
      `path`,
      {
        d: `M4 12V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [
      `path`,
      {
        d: `m10 17.843 3.033-1.755a.64.64 0 0 1 .967.56v4.704a.65.65 0 0 1-.967.56L10 20.157`,
      },
    ],
    [`rect`, { width: `7`, height: `6`, x: `3`, y: `16`, rx: `1` }],
  ],
  ex = [
    [
      `path`,
      {
        d: `M4 11.55V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2h-1.95`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M12 15a5 5 0 0 1 0 6` }],
    [
      `path`,
      {
        d: `M8 14.502a.5.5 0 0 0-.826-.381l-1.893 1.631a1 1 0 0 1-.651.243H3.5a.5.5 0 0 0-.5.501v3.006a.5.5 0 0 0 .5.501h1.129a1 1 0 0 1 .652.243l1.893 1.633a.5.5 0 0 0 .826-.38z`,
      },
    ],
  ],
  tx = [
    [
      `path`,
      {
        d: `M11 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v5`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `m15 17 5 5` }],
    [`path`, { d: `m20 17-5 5` }],
  ],
  nx = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `m14.5 12.5-5 5` }],
    [`path`, { d: `m9.5 12.5 5 5` }],
  ],
  rx = [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
  ],
  ix = [
    [
      `path`,
      { d: `M15 2h-4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8` },
    ],
    [
      `path`,
      {
        d: `M16.706 2.706A2.4 2.4 0 0 0 15 2v5a1 1 0 0 0 1 1h5a2.4 2.4 0 0 0-.706-1.706z`,
      },
    ],
    [`path`, { d: `M5 7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 1.732-1` }],
  ],
  ax = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M7 3v18` }],
    [`path`, { d: `M3 7.5h4` }],
    [`path`, { d: `M3 12h18` }],
    [`path`, { d: `M3 16.5h4` }],
    [`path`, { d: `M17 3v18` }],
    [`path`, { d: `M17 7.5h4` }],
    [`path`, { d: `M17 16.5h4` }],
  ],
  ox = [
    [`path`, { d: `M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4` }],
    [`path`, { d: `M14 13.12c0 2.38 0 6.38-1 8.88` }],
    [`path`, { d: `M17.29 21.02c.12-.6.43-2.3.5-3.02` }],
    [`path`, { d: `M2 12a10 10 0 0 1 18-6` }],
    [`path`, { d: `M2 16h.01` }],
    [`path`, { d: `M21.8 16c.2-2 .131-5.354 0-6` }],
    [`path`, { d: `M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2` }],
    [`path`, { d: `M8.65 22c.21-.66.45-1.32.57-2` }],
    [`path`, { d: `M9 6.8a6 6 0 0 1 9 5.2v2` }],
  ],
  sx = [
    [`path`, { d: `M15 6.5V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3.5` }],
    [`path`, { d: `M9 18h8` }],
    [`path`, { d: `M18 3h-3` }],
    [`path`, { d: `M11 3a6 6 0 0 0-6 6v11` }],
    [`path`, { d: `M5 13h4` }],
    [`path`, { d: `M17 10a4 4 0 0 0-8 0v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2Z` }],
  ],
  cx = [
    [
      `path`,
      {
        d: `M18 12.47v.03m0-.5v.47m-.475 5.056A6.744 6.744 0 0 1 15 18c-3.56 0-7.56-2.53-8.5-6 .348-1.28 1.114-2.433 2.121-3.38m3.444-2.088A8.802 8.802 0 0 1 15 6c3.56 0 6.06 2.54 7 6-.309 1.14-.786 2.177-1.413 3.058`,
      },
    ],
    [
      `path`,
      {
        d: `M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33m7.48-4.372A9.77 9.77 0 0 1 16 6.07m0 11.86a9.77 9.77 0 0 1-1.728-3.618`,
      },
    ],
    [
      `path`,
      {
        d: `m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98M8.53 3h5.27a2 2 0 0 1 1.98 1.67l.23 1.4M2 2l20 20`,
      },
    ],
  ],
  lx = [[`path`, { d: `M2 16s9-15 20-4C11 23 2 8 2 8` }]],
  ux = [
    [
      `path`,
      {
        d: `M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z`,
      },
    ],
    [`path`, { d: `M18 12v.5` }],
    [`path`, { d: `M16 17.93a9.77 9.77 0 0 1 0-11.86` }],
    [
      `path`,
      {
        d: `M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33`,
      },
    ],
    [
      `path`,
      {
        d: `M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4`,
      },
    ],
    [
      `path`,
      {
        d: `m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98`,
      },
    ],
  ],
  dx = [
    [
      `path`,
      {
        d: `m17.586 11.414-5.93 5.93a1 1 0 0 1-8-8l3.137-3.137a.707.707 0 0 1 1.207.5V10`,
      },
    ],
    [`path`, { d: `M20.414 8.586 22 7` }],
    [`circle`, { cx: `19`, cy: `10`, r: `2` }],
  ],
  fx = [
    [`path`, { d: `M4 11h1` }],
    [`path`, { d: `M8 15a2 2 0 0 1-4 0V3a1 1 0 0 1 1-1h.5C14 2 20 9 20 18v4` }],
    [`circle`, { cx: `18`, cy: `18`, r: `2` }],
  ],
  px = [
    [`path`, { d: `M16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M4 22V4` }],
    [
      `path`,
      { d: `M7.656 2H8c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10.347` },
    ],
  ],
  mx = [
    [
      `path`,
      {
        d: `M18 22V2.8a.8.8 0 0 0-1.17-.71L5.45 7.78a.8.8 0 0 0 0 1.44L18 15.5`,
      },
    ],
  ],
  hx = [
    [
      `path`,
      {
        d: `M6 22V2.8a.8.8 0 0 1 1.17-.71l11.38 5.69a.8.8 0 0 1 0 1.44L6 15.5`,
      },
    ],
  ],
  gx = [
    [
      `path`,
      {
        d: `M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528`,
      },
    ],
  ],
  _x = [
    [
      `path`,
      {
        d: `M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4`,
      },
    ],
  ],
  vx = [
    [
      `path`,
      {
        d: `M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10a5 5 0 1 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C8 4.5 11 2 12 2Z`,
      },
    ],
    [`path`, { d: `m5 22 14-4` }],
    [`path`, { d: `m5 18 14 4` }],
  ],
  yx = [
    [`path`, { d: `M11.652 6H18` }],
    [`path`, { d: `M12 13v1` }],
    [
      `path`,
      {
        d: `M16 16v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-8a4 4 0 0 0-.8-2.4l-.6-.8A3 3 0 0 1 6 7V6`,
      },
    ],
    [`path`, { d: `m2 2 20 20` }],
    [
      `path`,
      {
        d: `M7.649 2H17a1 1 0 0 1 1 1v4a3 3 0 0 1-.6 1.8l-.6.8a4 4 0 0 0-.55 1.007`,
      },
    ],
  ],
  bx = [
    [`path`, { d: `M12 13v1` }],
    [
      `path`,
      {
        d: `M17 2a1 1 0 0 1 1 1v4a3 3 0 0 1-.6 1.8l-.6.8A4 4 0 0 0 16 12v8a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-8a4 4 0 0 0-.8-2.4l-.6-.8A3 3 0 0 1 6 7V3a1 1 0 0 1 1-1z`,
      },
    ],
    [`path`, { d: `M6 6h12` }],
  ],
  xx = [
    [`path`, { d: `M10 2v2.343` }],
    [`path`, { d: `M14 2v6.343` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M20 20a2 2 0 0 1-2 2H6a2 2 0 0 1-1.755-2.96l5.227-9.563` }],
    [`path`, { d: `M6.453 15H15` }],
    [`path`, { d: `M8.5 2h7` }],
  ],
  Sx = [
    [
      `path`,
      {
        d: `M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2`,
      },
    ],
    [`path`, { d: `M6.453 15h11.094` }],
    [`path`, { d: `M8.5 2h7` }],
  ],
  Cx = [
    [`path`, { d: `M10 2v6.292a7 7 0 1 0 4 0V2` }],
    [`path`, { d: `M5 15h14` }],
    [`path`, { d: `M8.5 2h7` }],
  ],
  wx = [
    [`path`, { d: `m3 7 5 5-5 5V7` }],
    [`path`, { d: `m21 7-5 5 5 5V7` }],
    [`path`, { d: `M12 20v2` }],
    [`path`, { d: `M12 14v2` }],
    [`path`, { d: `M12 8v2` }],
    [`path`, { d: `M12 2v2` }],
  ],
  Tx = [
    [`path`, { d: `m17 3-5 5-5-5h10` }],
    [`path`, { d: `m17 21-5-5-5 5h10` }],
    [`path`, { d: `M4 12H2` }],
    [`path`, { d: `M10 12H8` }],
    [`path`, { d: `M16 12h-2` }],
    [`path`, { d: `M22 12h-2` }],
  ],
  Ex = [
    [
      `path`,
      {
        d: `M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1`,
      },
    ],
    [`circle`, { cx: `12`, cy: `8`, r: `2` }],
    [`path`, { d: `M12 10v12` }],
    [`path`, { d: `M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z` }],
    [`path`, { d: `M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z` }],
  ],
  Dx = [
    [`circle`, { cx: `12`, cy: `12`, r: `3` }],
    [
      `path`,
      {
        d: `M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5`,
      },
    ],
    [`path`, { d: `M12 7.5V9` }],
    [`path`, { d: `M7.5 12H9` }],
    [`path`, { d: `M16.5 12H15` }],
    [`path`, { d: `M12 16.5V15` }],
    [`path`, { d: `m8 8 1.88 1.88` }],
    [`path`, { d: `M14.12 9.88 16 8` }],
    [`path`, { d: `m8 16 1.88-1.88` }],
    [`path`, { d: `M14.12 14.12 16 16` }],
  ],
  Ox = [
    [`circle`, { cx: `12`, cy: `12`, r: `3` }],
    [`path`, { d: `M3 7V5a2 2 0 0 1 2-2h2` }],
    [`path`, { d: `M17 3h2a2 2 0 0 1 2 2v2` }],
    [`path`, { d: `M21 17v2a2 2 0 0 1-2 2h-2` }],
    [`path`, { d: `M7 21H5a2 2 0 0 1-2-2v-2` }],
  ],
  kx = [
    [`path`, { d: `M2 12h6` }],
    [`path`, { d: `M22 12h-6` }],
    [`path`, { d: `M12 2v2` }],
    [`path`, { d: `M12 8v2` }],
    [`path`, { d: `M12 14v2` }],
    [`path`, { d: `M12 20v2` }],
    [`path`, { d: `m19 9-3 3 3 3` }],
    [`path`, { d: `m5 15 3-3-3-3` }],
  ],
  Ax = [
    [`path`, { d: `M12 22v-6` }],
    [`path`, { d: `M12 8V2` }],
    [`path`, { d: `M4 12H2` }],
    [`path`, { d: `M10 12H8` }],
    [`path`, { d: `M16 12h-2` }],
    [`path`, { d: `M22 12h-2` }],
    [`path`, { d: `m15 19-3-3-3 3` }],
    [`path`, { d: `m15 5-3 3-3-3` }],
  ],
  jx = [
    [`circle`, { cx: `15`, cy: `19`, r: `2` }],
    [
      `path`,
      {
        d: `M20.9 19.8A2 2 0 0 0 22 18V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h5.1`,
      },
    ],
    [`path`, { d: `M15 11v-1` }],
    [`path`, { d: `M15 17v-2` }],
  ],
  Mx = [
    [`path`, { d: `M12 6v8l3-3 3 3V6` }],
    [
      `path`,
      {
        d: `M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z`,
      },
    ],
  ],
  Nx = [
    [
      `path`,
      {
        d: `M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z`,
      },
    ],
    [`path`, { d: `m9 13 2 2 4-4` }],
  ],
  Px = [
    [`path`, { d: `M16 14v2.2l1.6 1` }],
    [
      `path`,
      {
        d: `M7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2`,
      },
    ],
    [`circle`, { cx: `16`, cy: `16`, r: `6` }],
  ],
  Fx = [
    [
      `path`,
      {
        d: `M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z`,
      },
    ],
    [`path`, { d: `M2 10h20` }],
  ],
  Ix = [
    [
      `path`,
      {
        d: `M10.3 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.98a2 2 0 0 1 1.69.9l.66 1.2A2 2 0 0 0 12 6h8a2 2 0 0 1 2 2v3.3`,
      },
    ],
    [`path`, { d: `m14.305 19.53.923-.382` }],
    [`path`, { d: `m15.228 16.852-.923-.383` }],
    [`path`, { d: `m16.852 15.228-.383-.923` }],
    [`path`, { d: `m16.852 20.772-.383.924` }],
    [`path`, { d: `m19.148 15.228.383-.923` }],
    [`path`, { d: `m19.53 21.696-.382-.924` }],
    [`path`, { d: `m20.772 16.852.924-.383` }],
    [`path`, { d: `m20.772 19.148.924.383` }],
    [`circle`, { cx: `18`, cy: `18`, r: `3` }],
  ],
  Lx = [
    [`path`, { d: `M10 10.5 8 13l2 2.5` }],
    [`path`, { d: `m14 10.5 2 2.5-2 2.5` }],
    [
      `path`,
      {
        d: `M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z`,
      },
    ],
  ],
  Rx = [
    [
      `path`,
      {
        d: `M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z`,
      },
    ],
    [`circle`, { cx: `12`, cy: `13`, r: `1` }],
  ],
  zx = [
    [
      `path`,
      {
        d: `M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z`,
      },
    ],
    [`path`, { d: `M12 10v6` }],
    [`path`, { d: `m15 13-3 3-3-3` }],
  ],
  Bx = [
    [`path`, { d: `M18 19a5 5 0 0 1-5-5v8` }],
    [
      `path`,
      {
        d: `M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5`,
      },
    ],
    [`circle`, { cx: `13`, cy: `12`, r: `2` }],
    [`circle`, { cx: `20`, cy: `19`, r: `2` }],
  ],
  Vx = [
    [`circle`, { cx: `12`, cy: `13`, r: `2` }],
    [
      `path`,
      {
        d: `M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z`,
      },
    ],
    [`path`, { d: `M14 13h3` }],
    [`path`, { d: `M7 13h3` }],
  ],
  Hx = [
    [
      `path`,
      {
        d: `M10.638 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v3.417`,
      },
    ],
    [
      `path`,
      {
        d: `M14.62 18.8A2.25 2.25 0 1 1 18 15.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z`,
      },
    ],
  ],
  Ux = [
    [
      `path`,
      {
        d: `M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1`,
      },
    ],
    [`path`, { d: `M2 13h10` }],
    [`path`, { d: `m9 16 3-3-3-3` }],
  ],
  Wx = [
    [
      `path`,
      {
        d: `M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z`,
      },
    ],
    [`path`, { d: `M8 10v4` }],
    [`path`, { d: `M12 10v2` }],
    [`path`, { d: `M16 10v6` }],
  ],
  Gx = [
    [
      `path`,
      {
        d: `M13 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v1.36`,
      },
    ],
    [`path`, { d: `M19 12v6` }],
    [`path`, { d: `M19 14h2` }],
    [`circle`, { cx: `19`, cy: `20`, r: `2` }],
  ],
  Kx = [
    [`rect`, { width: `8`, height: `5`, x: `14`, y: `17`, rx: `1` }],
    [
      `path`,
      {
        d: `M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5`,
      },
    ],
    [`path`, { d: `M20 17v-2a2 2 0 1 0-4 0v2` }],
  ],
  qx = [
    [`path`, { d: `M9 13h6` }],
    [
      `path`,
      {
        d: `M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z`,
      },
    ],
  ],
  Jx = [
    [
      `path`,
      {
        d: `m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2`,
      },
    ],
    [`circle`, { cx: `14`, cy: `15`, r: `1` }],
  ],
  Yx = [
    [
      `path`,
      {
        d: `m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2`,
      },
    ],
  ],
  Xx = [
    [
      `path`,
      {
        d: `M2 7.5V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-1.5`,
      },
    ],
    [`path`, { d: `M2 13h10` }],
    [`path`, { d: `m5 10-3 3 3 3` }],
  ],
  Zx = [
    [
      `path`,
      {
        d: `M2 11.5V5a2 2 0 0 1 2-2h3.9c.7 0 1.3.3 1.7.9l.8 1.2c.4.6 1 .9 1.7.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9.5`,
      },
    ],
    [
      `path`,
      {
        d: `M11.378 13.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z`,
      },
    ],
  ],
  Qx = [
    [`path`, { d: `M12 10v6` }],
    [`path`, { d: `M9 13h6` }],
    [
      `path`,
      {
        d: `M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z`,
      },
    ],
  ],
  $x = [
    [
      `path`,
      {
        d: `M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z`,
      },
    ],
    [`circle`, { cx: `12`, cy: `13`, r: `2` }],
    [`path`, { d: `M12 15v5` }],
  ],
  eS = [
    [`circle`, { cx: `11.5`, cy: `12.5`, r: `2.5` }],
    [
      `path`,
      {
        d: `M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z`,
      },
    ],
    [`path`, { d: `M13.3 14.3 15 16` }],
  ],
  tS = [
    [
      `path`,
      {
        d: `M10.7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v4.1`,
      },
    ],
    [`path`, { d: `m21 21-1.9-1.9` }],
    [`circle`, { cx: `17`, cy: `17`, r: `3` }],
  ],
  nS = [
    [
      `path`,
      {
        d: `M2 9.35V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h7`,
      },
    ],
    [`path`, { d: `m8 16 3-3-3-3` }],
  ],
  rS = [
    [
      `path`,
      {
        d: `M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v.5`,
      },
    ],
    [`path`, { d: `M12 10v4h4` }],
    [`path`, { d: `m12 14 1.535-1.605a5 5 0 0 1 8 1.5` }],
    [`path`, { d: `M22 22v-4h-4` }],
    [`path`, { d: `m22 18-1.535 1.605a5 5 0 0 1-8-1.5` }],
  ],
  iS = [
    [
      `path`,
      {
        d: `M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z`,
      },
    ],
    [
      `path`,
      {
        d: `M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z`,
      },
    ],
    [`path`, { d: `M3 5a2 2 0 0 0 2 2h3` }],
    [`path`, { d: `M3 3v13a2 2 0 0 0 2 2h3` }],
  ],
  aS = [
    [
      `path`,
      {
        d: `M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z`,
      },
    ],
    [`path`, { d: `M12 10v6` }],
    [`path`, { d: `m9 13 3-3 3 3` }],
  ],
  oS = [
    [
      `path`,
      {
        d: `M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z`,
      },
    ],
    [`path`, { d: `m9.5 10.5 5 5` }],
    [`path`, { d: `m14.5 10.5-5 5` }],
  ],
  sS = [
    [
      `path`,
      {
        d: `M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z`,
      },
    ],
  ],
  cS = [
    [
      `path`,
      {
        d: `M20 5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2.5a1.5 1.5 0 0 1 1.2.6l.6.8a1.5 1.5 0 0 0 1.2.6z`,
      },
    ],
    [
      `path`,
      { d: `M3 8.268a2 2 0 0 0-1 1.738V19a2 2 0 0 0 2 2h11a2 2 0 0 0 1.732-1` },
    ],
  ],
  lS = [
    [
      `path`,
      {
        d: `M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z`,
      },
    ],
    [
      `path`,
      {
        d: `M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z`,
      },
    ],
    [`path`, { d: `M16 17h4` }],
    [`path`, { d: `M4 13h4` }],
  ],
  uS = [
    [`path`, { d: `M12 12H5a2 2 0 0 0-2 2v5` }],
    [`path`, { d: `M15 19h7` }],
    [`path`, { d: `M16 19V2` }],
    [
      `path`,
      {
        d: `M6 12V7a2 2 0 0 1 2-2h2.172a2 2 0 0 1 1.414.586l3.828 3.828A2 2 0 0 1 16 10.828`,
      },
    ],
    [`path`, { d: `M7 19h4` }],
    [`circle`, { cx: `13`, cy: `19`, r: `2` }],
    [`circle`, { cx: `5`, cy: `19`, r: `2` }],
  ],
  dS = [
    [`path`, { d: `m15 17 5-5-5-5` }],
    [`path`, { d: `M4 18v-2a4 4 0 0 1 4-4h12` }],
  ],
  fS = [
    [`path`, { d: `M4 14h6` }],
    [`path`, { d: `M4 2h10` }],
    [`rect`, { x: `4`, y: `18`, width: `16`, height: `4`, rx: `1` }],
    [`rect`, { x: `4`, y: `6`, width: `16`, height: `4`, rx: `1` }],
  ],
  pS = [
    [`line`, { x1: `22`, x2: `2`, y1: `6`, y2: `6` }],
    [`line`, { x1: `22`, x2: `2`, y1: `18`, y2: `18` }],
    [`line`, { x1: `6`, x2: `6`, y1: `2`, y2: `22` }],
    [`line`, { x1: `18`, x2: `18`, y1: `2`, y2: `22` }],
  ],
  mS = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M16 16s-1.5-2-4-2-4 2-4 2` }],
    [`line`, { x1: `9`, x2: `9.01`, y1: `9`, y2: `9` }],
    [`line`, { x1: `15`, x2: `15.01`, y1: `9`, y2: `9` }],
  ],
  hS = [
    [
      `path`,
      {
        d: `M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0v-6.998a2 2 0 0 0-.59-1.42L18 5`,
      },
    ],
    [`path`, { d: `M14 21V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16` }],
    [`path`, { d: `M2 21h13` }],
    [`path`, { d: `M3 9h11` }],
  ],
  gS = [
    [`path`, { d: `M3 7V5a2 2 0 0 1 2-2h2` }],
    [`path`, { d: `M17 3h2a2 2 0 0 1 2 2v2` }],
    [`path`, { d: `M21 17v2a2 2 0 0 1-2 2h-2` }],
    [`path`, { d: `M7 21H5a2 2 0 0 1-2-2v-2` }],
    [`rect`, { width: `10`, height: `8`, x: `7`, y: `8`, rx: `1` }],
  ],
  _S = [
    [
      `path`,
      {
        d: `M13.354 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l1.218-1.348`,
      },
    ],
    [`path`, { d: `M16 6h6` }],
    [`path`, { d: `M19 3v6` }],
  ],
  vS = [
    [
      `path`,
      {
        d: `M12.531 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l.427-.473`,
      },
    ],
    [`path`, { d: `m16.5 3.5 5 5` }],
    [`path`, { d: `m21.5 3.5-5 5` }],
  ],
  yS = [
    [
      `path`,
      {
        d: `M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z`,
      },
    ],
  ],
  bS = [
    [`path`, { d: `M2 7v10` }],
    [`path`, { d: `M6 5v14` }],
    [`rect`, { width: `12`, height: `18`, x: `10`, y: `3`, rx: `2` }],
  ],
  xS = [
    [`path`, { d: `M2 3v18` }],
    [`rect`, { width: `12`, height: `18`, x: `6`, y: `3`, rx: `2` }],
    [`path`, { d: `M22 3v18` }],
  ],
  SS = [
    [`rect`, { width: `18`, height: `14`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M4 21h1` }],
    [`path`, { d: `M9 21h1` }],
    [`path`, { d: `M14 21h1` }],
    [`path`, { d: `M19 21h1` }],
  ],
  CS = [
    [`path`, { d: `M7 2h10` }],
    [`path`, { d: `M5 6h14` }],
    [`rect`, { width: `18`, height: `12`, x: `3`, y: `10`, rx: `2` }],
  ],
  wS = [
    [`path`, { d: `M3 2h18` }],
    [`rect`, { width: `18`, height: `12`, x: `3`, y: `6`, rx: `2` }],
    [`path`, { d: `M3 22h18` }],
  ],
  TS = [
    [`line`, { x1: `6`, x2: `10`, y1: `11`, y2: `11` }],
    [`line`, { x1: `8`, x2: `8`, y1: `9`, y2: `13` }],
    [`line`, { x1: `15`, x2: `15.01`, y1: `12`, y2: `12` }],
    [`line`, { x1: `18`, x2: `18.01`, y1: `10`, y2: `10` }],
    [
      `path`,
      {
        d: `M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z`,
      },
    ],
  ],
  ES = [
    [
      `path`,
      {
        d: `M11.146 15.854a1.207 1.207 0 0 1 1.708 0l1.56 1.56A2 2 0 0 1 15 18.828V21a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2.172a2 2 0 0 1 .586-1.414z`,
      },
    ],
    [
      `path`,
      {
        d: `M18.828 15a2 2 0 0 1-1.414-.586l-1.56-1.56a1.207 1.207 0 0 1 0-1.708l1.56-1.56A2 2 0 0 1 18.828 9H21a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1z`,
      },
    ],
    [
      `path`,
      {
        d: `M6.586 14.414A2 2 0 0 1 5.172 15H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2.172a2 2 0 0 1 1.414.586l1.56 1.56a1.207 1.207 0 0 1 0 1.708z`,
      },
    ],
    [
      `path`,
      {
        d: `M9 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2.172a2 2 0 0 1-.586 1.414l-1.56 1.56a1.207 1.207 0 0 1-1.708 0l-1.56-1.56A2 2 0 0 1 9 5.172z`,
      },
    ],
  ],
  DS = [
    [`line`, { x1: `6`, x2: `10`, y1: `12`, y2: `12` }],
    [`line`, { x1: `8`, x2: `8`, y1: `10`, y2: `14` }],
    [`line`, { x1: `15`, x2: `15.01`, y1: `13`, y2: `13` }],
    [`line`, { x1: `18`, x2: `18.01`, y1: `11`, y2: `11` }],
    [`rect`, { width: `20`, height: `12`, x: `2`, y: `6`, rx: `2` }],
  ],
  OS = [
    [`path`, { d: `m12 14 4-4` }],
    [`path`, { d: `M3.34 19a10 10 0 1 1 17.32 0` }],
  ],
  kS = [
    [`path`, { d: `m14 13-8.381 8.38a1 1 0 0 1-3.001-3l8.384-8.381` }],
    [`path`, { d: `m16 16 6-6` }],
    [`path`, { d: `m21.5 10.5-8-8` }],
    [`path`, { d: `m8 8 6-6` }],
    [`path`, { d: `m8.5 7.5 8 8` }],
  ],
  AS = [
    [`path`, { d: `M10.5 3 8 9l4 13 4-13-2.5-6` }],
    [
      `path`,
      {
        d: `M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z`,
      },
    ],
    [`path`, { d: `M2 9h20` }],
  ],
  jS = [
    [`path`, { d: `M11.5 21a7.5 7.5 0 1 1 7.35-9` }],
    [`path`, { d: `M13 12V3` }],
    [`path`, { d: `M4 21h16` }],
    [`path`, { d: `M9 12V3` }],
  ],
  MS = [
    [`path`, { d: `M9 10h.01` }],
    [`path`, { d: `M15 10h.01` }],
    [
      `path`,
      {
        d: `M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z`,
      },
    ],
  ],
  NS = [
    [`path`, { d: `M12 7v14` }],
    [`path`, { d: `M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8` }],
    [
      `path`,
      {
        d: `M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5`,
      },
    ],
    [`rect`, { x: `3`, y: `7`, width: `18`, height: `4`, rx: `1` }],
  ],
  PS = [
    [`path`, { d: `M15 6a9 9 0 0 0-9 9V3` }],
    [`path`, { d: `M21 18h-6` }],
    [`circle`, { cx: `18`, cy: `6`, r: `3` }],
    [`circle`, { cx: `6`, cy: `18`, r: `3` }],
  ],
  FS = [
    [`path`, { d: `M6 3v12` }],
    [`path`, { d: `M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z` }],
    [`path`, { d: `M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z` }],
    [`path`, { d: `M15 6a9 9 0 0 0-9 9` }],
    [`path`, { d: `M18 15v6` }],
    [`path`, { d: `M21 18h-6` }],
  ],
  IS = [
    [`path`, { d: `M15 6a9 9 0 0 0-9 9V3` }],
    [`circle`, { cx: `18`, cy: `6`, r: `3` }],
    [`circle`, { cx: `6`, cy: `18`, r: `3` }],
  ],
  LS = [
    [`circle`, { cx: `12`, cy: `12`, r: `3` }],
    [`line`, { x1: `3`, x2: `9`, y1: `12`, y2: `12` }],
    [`line`, { x1: `15`, x2: `21`, y1: `12`, y2: `12` }],
  ],
  RS = [
    [`path`, { d: `M12 3v6` }],
    [`circle`, { cx: `12`, cy: `12`, r: `3` }],
    [`path`, { d: `M12 15v6` }],
  ],
  zS = [
    [`circle`, { cx: `5`, cy: `6`, r: `3` }],
    [`path`, { d: `M12 6h5a2 2 0 0 1 2 2v7` }],
    [`path`, { d: `m15 9-3-3 3-3` }],
    [`circle`, { cx: `19`, cy: `18`, r: `3` }],
    [`path`, { d: `M12 18H7a2 2 0 0 1-2-2V9` }],
    [`path`, { d: `m9 15 3 3-3 3` }],
  ],
  BS = [
    [`circle`, { cx: `18`, cy: `18`, r: `3` }],
    [`circle`, { cx: `6`, cy: `6`, r: `3` }],
    [`path`, { d: `M13 6h3a2 2 0 0 1 2 2v7` }],
    [`path`, { d: `M11 18H8a2 2 0 0 1-2-2V9` }],
  ],
  VS = [
    [`circle`, { cx: `12`, cy: `18`, r: `3` }],
    [`circle`, { cx: `6`, cy: `6`, r: `3` }],
    [`circle`, { cx: `18`, cy: `6`, r: `3` }],
    [`path`, { d: `M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9` }],
    [`path`, { d: `M12 12v3` }],
  ],
  HS = [
    [`circle`, { cx: `5`, cy: `6`, r: `3` }],
    [`path`, { d: `M5 9v6` }],
    [`circle`, { cx: `5`, cy: `18`, r: `3` }],
    [`path`, { d: `M12 3v18` }],
    [`circle`, { cx: `19`, cy: `6`, r: `3` }],
    [`path`, { d: `M16 15.7A9 9 0 0 0 19 9` }],
  ],
  US = [
    [`circle`, { cx: `18`, cy: `18`, r: `3` }],
    [`circle`, { cx: `6`, cy: `6`, r: `3` }],
    [`path`, { d: `M6 21V9a9 9 0 0 0 9 9` }],
  ],
  WS = [
    [`path`, { d: `M12 6h4a2 2 0 0 1 2 2v7` }],
    [`path`, { d: `M6 12v9` }],
    [`path`, { d: `M9 3 3 9` }],
    [`path`, { d: `M9 9 3 3` }],
    [`circle`, { cx: `18`, cy: `18`, r: `3` }],
  ],
  GS = [
    [`circle`, { cx: `5`, cy: `6`, r: `3` }],
    [`path`, { d: `M5 9v12` }],
    [`circle`, { cx: `19`, cy: `18`, r: `3` }],
    [`path`, { d: `m15 9-3-3 3-3` }],
    [`path`, { d: `M12 6h5a2 2 0 0 1 2 2v7` }],
  ],
  KS = [
    [`circle`, { cx: `6`, cy: `6`, r: `3` }],
    [`path`, { d: `M6 9v12` }],
    [`path`, { d: `m21 3-6 6` }],
    [`path`, { d: `m21 9-6-6` }],
    [`path`, { d: `M18 11.5V15` }],
    [`circle`, { cx: `18`, cy: `18`, r: `3` }],
  ],
  qS = [
    [`circle`, { cx: `5`, cy: `6`, r: `3` }],
    [`path`, { d: `M5 9v12` }],
    [`path`, { d: `m15 9-3-3 3-3` }],
    [`path`, { d: `M12 6h5a2 2 0 0 1 2 2v3` }],
    [`path`, { d: `M19 15v6` }],
    [`path`, { d: `M22 18h-6` }],
  ],
  JS = [
    [`circle`, { cx: `6`, cy: `6`, r: `3` }],
    [`path`, { d: `M6 9v12` }],
    [`path`, { d: `M13 6h3a2 2 0 0 1 2 2v3` }],
    [`path`, { d: `M18 15v6` }],
    [`path`, { d: `M21 18h-6` }],
  ],
  YS = [
    [`circle`, { cx: `18`, cy: `18`, r: `3` }],
    [`circle`, { cx: `6`, cy: `6`, r: `3` }],
    [`path`, { d: `M18 6V5` }],
    [`path`, { d: `M18 11v-1` }],
    [`line`, { x1: `6`, x2: `6`, y1: `9`, y2: `21` }],
  ],
  XS = [
    [`circle`, { cx: `18`, cy: `18`, r: `3` }],
    [`circle`, { cx: `6`, cy: `6`, r: `3` }],
    [`path`, { d: `M13 6h3a2 2 0 0 1 2 2v7` }],
    [`line`, { x1: `6`, x2: `6`, y1: `9`, y2: `21` }],
  ],
  ZS = [
    [
      `path`,
      {
        d: `M5.116 4.104A1 1 0 0 1 6.11 3h11.78a1 1 0 0 1 .994 1.105L17.19 20.21A2 2 0 0 1 15.2 22H8.8a2 2 0 0 1-2-1.79z`,
      },
    ],
    [`path`, { d: `M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0` }],
  ],
  QS = [
    [`circle`, { cx: `6`, cy: `15`, r: `4` }],
    [`circle`, { cx: `18`, cy: `15`, r: `4` }],
    [`path`, { d: `M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2` }],
    [`path`, { d: `M2.5 13 5 7c.7-1.3 1.4-2 3-2` }],
    [`path`, { d: `M21.5 13 19 7c-.7-1.3-1.5-2-3-2` }],
  ],
  $S = [
    [`path`, { d: `m15 6 2 2 4-4` }],
    [
      `path`,
      {
        d: `M2 12h20A10 10 0 1 1 12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 4-10`,
      },
    ],
  ],
  eC = [
    [
      `path`,
      {
        d: `M15.686 15A14.5 14.5 0 0 1 12 22a14.5 14.5 0 0 1 0-20 10 10 0 1 0 9.542 13`,
      },
    ],
    [`path`, { d: `M2 12h8.5` }],
    [`path`, { d: `M20 6V4a2 2 0 1 0-4 0v2` }],
    [`rect`, { width: `8`, height: `5`, x: `14`, y: `6`, rx: `1` }],
  ],
  tC = [
    [
      `path`,
      { d: `M10.114 4.462A14.5 14.5 0 0 1 12 2a10 10 0 0 1 9.313 13.643` },
    ],
    [
      `path`,
      { d: `M15.557 15.556A14.5 14.5 0 0 1 12 22 10 10 0 0 1 4.929 4.929` },
    ],
    [
      `path`,
      { d: `M15.892 10.234A14.5 14.5 0 0 0 12 2a10 10 0 0 0-3.643.687` },
    ],
    [`path`, { d: `M17.656 12H22` }],
    [
      `path`,
      { d: `M19.071 19.071A10 10 0 0 1 12 22 14.5 14.5 0 0 1 8.44 8.45` },
    ],
    [`path`, { d: `M2 12h10` }],
    [`path`, { d: `m2 2 20 20` }],
  ],
  nC = [
    [`path`, { d: `m16 3 5 5` }],
    [
      `path`,
      {
        d: `M2 12h20A10 10 0 1 1 12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 4-10`,
      },
    ],
    [`path`, { d: `m21 3-5 5` }],
  ],
  rC = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20` }],
    [`path`, { d: `M2 12h20` }],
  ],
  iC = [
    [`path`, { d: `M2 17h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H2` }],
    [`path`, { d: `M2 21V3` }],
    [`path`, { d: `M7 17v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-3` }],
    [`circle`, { cx: `16`, cy: `11`, r: `2` }],
    [`circle`, { cx: `8`, cy: `11`, r: `2` }],
  ],
  aC = [
    [`path`, { d: `M12 13V2l8 4-8 4` }],
    [`path`, { d: `M20.561 10.222a9 9 0 1 1-12.55-5.29` }],
    [`path`, { d: `M8.002 9.997a5 5 0 1 0 8.9 2.02` }],
  ],
  oC = [
    [
      `path`,
      {
        d: `M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z`,
      },
    ],
    [`path`, { d: `M22 10v6` }],
    [`path`, { d: `M6 12.5V16a6 3 0 0 0 12 0v-3.5` }],
  ],
  sC = [
    [`path`, { d: `M22 5V2l-5.89 5.89` }],
    [`circle`, { cx: `16.6`, cy: `15.89`, r: `3` }],
    [`circle`, { cx: `8.11`, cy: `7.4`, r: `3` }],
    [`circle`, { cx: `12.35`, cy: `11.65`, r: `3` }],
    [`circle`, { cx: `13.91`, cy: `5.85`, r: `3` }],
    [`circle`, { cx: `18.15`, cy: `10.09`, r: `3` }],
    [`circle`, { cx: `6.56`, cy: `13.2`, r: `3` }],
    [`circle`, { cx: `10.8`, cy: `17.44`, r: `3` }],
    [`circle`, { cx: `5`, cy: `19`, r: `3` }],
  ],
  cC = [
    [
      `path`,
      {
        d: `M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3`,
      },
    ],
    [`path`, { d: `m16 19 2 2 4-4` }],
  ],
  lC = [
    [
      `path`,
      {
        d: `M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3`,
      },
    ],
    [`path`, { d: `M16 19h6` }],
    [`path`, { d: `M19 22v-6` }],
  ],
  uC = [
    [
      `path`,
      {
        d: `M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3`,
      },
    ],
    [`path`, { d: `m16 16 5 5` }],
    [`path`, { d: `m16 21 5-5` }],
  ],
  dC = [
    [`path`, { d: `M12 3v18` }],
    [`path`, { d: `M3 12h18` }],
    [`rect`, { x: `3`, y: `3`, width: `18`, height: `18`, rx: `2` }],
  ],
  fC = [
    [`path`, { d: `M15 3v18` }],
    [`path`, { d: `M3 12h18` }],
    [`path`, { d: `M9 3v18` }],
    [`rect`, { x: `3`, y: `3`, width: `18`, height: `18`, rx: `2` }],
  ],
  pC = [
    [`circle`, { cx: `12`, cy: `9`, r: `1` }],
    [`circle`, { cx: `19`, cy: `9`, r: `1` }],
    [`circle`, { cx: `5`, cy: `9`, r: `1` }],
    [`circle`, { cx: `12`, cy: `15`, r: `1` }],
    [`circle`, { cx: `19`, cy: `15`, r: `1` }],
    [`circle`, { cx: `5`, cy: `15`, r: `1` }],
  ],
  mC = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M3 9h18` }],
    [`path`, { d: `M3 15h18` }],
    [`path`, { d: `M9 3v18` }],
    [`path`, { d: `M15 3v18` }],
  ],
  hC = [
    [`circle`, { cx: `9`, cy: `12`, r: `1` }],
    [`circle`, { cx: `9`, cy: `5`, r: `1` }],
    [`circle`, { cx: `9`, cy: `19`, r: `1` }],
    [`circle`, { cx: `15`, cy: `12`, r: `1` }],
    [`circle`, { cx: `15`, cy: `5`, r: `1` }],
    [`circle`, { cx: `15`, cy: `19`, r: `1` }],
  ],
  gC = [
    [`path`, { d: `M3 7V5c0-1.1.9-2 2-2h2` }],
    [`path`, { d: `M17 3h2c1.1 0 2 .9 2 2v2` }],
    [`path`, { d: `M21 17v2c0 1.1-.9 2-2 2h-2` }],
    [`path`, { d: `M7 21H5c-1.1 0-2-.9-2-2v-2` }],
    [`rect`, { width: `7`, height: `5`, x: `7`, y: `7`, rx: `1` }],
    [`rect`, { width: `7`, height: `5`, x: `10`, y: `12`, rx: `1` }],
  ],
  _C = [
    [`path`, { d: `m11.9 12.1 4.514-4.514` }],
    [
      `path`,
      {
        d: `M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4z`,
      },
    ],
    [`path`, { d: `m6 16 2 2` }],
    [
      `path`,
      {
        d: `M8.23 9.85A3 3 0 0 1 11 8a5 5 0 0 1 5 5 3 3 0 0 1-1.85 2.77l-.92.38A2 2 0 0 0 12 18a4 4 0 0 1-4 4 6 6 0 0 1-6-6 4 4 0 0 1 4-4 2 2 0 0 0 1.85-1.23z`,
      },
    ],
  ],
  vC = [
    [`circle`, { cx: `12`, cy: `5`, r: `1` }],
    [`circle`, { cx: `19`, cy: `5`, r: `1` }],
    [`circle`, { cx: `5`, cy: `5`, r: `1` }],
    [`circle`, { cx: `12`, cy: `12`, r: `1` }],
    [`circle`, { cx: `19`, cy: `12`, r: `1` }],
    [`circle`, { cx: `5`, cy: `12`, r: `1` }],
    [`circle`, { cx: `12`, cy: `19`, r: `1` }],
    [`circle`, { cx: `19`, cy: `19`, r: `1` }],
    [`circle`, { cx: `5`, cy: `19`, r: `1` }],
  ],
  yC = [
    [`path`, { d: `M13.144 21.144A7.274 10.445 45 1 0 2.856 10.856` }],
    [
      `path`,
      {
        d: `M13.144 21.144A7.274 4.365 45 0 0 2.856 10.856a7.274 4.365 45 0 0 10.288 10.288`,
      },
    ],
    [
      `path`,
      {
        d: `M16.565 10.435 18.6 8.4a2.501 2.501 0 1 0 1.65-4.65 2.5 2.5 0 1 0-4.66 1.66l-2.024 2.025`,
      },
    ],
    [`path`, { d: `m8.5 16.5-1-1` }],
  ],
  bC = [
    [`path`, { d: `M12 16H4a2 2 0 1 1 0-4h16a2 2 0 1 1 0 4h-4.25` }],
    [`path`, { d: `M5 12a2 2 0 0 1-2-2 9 7 0 0 1 18 0 2 2 0 0 1-2 2` }],
    [
      `path`,
      {
        d: `M5 16a2 2 0 0 0-2 2 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 2 2 0 0 0-2-2q0 0 0 0`,
      },
    ],
    [`path`, { d: `m6.67 12 6.13 4.6a2 2 0 0 0 2.8-.4l3.15-4.2` }],
  ],
  xC = [
    [`path`, { d: `M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17` }],
    [
      `path`,
      {
        d: `m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9`,
      },
    ],
    [`path`, { d: `m2 16 6 6` }],
    [`circle`, { cx: `16`, cy: `9`, r: `2.9` }],
    [`circle`, { cx: `6`, cy: `5`, r: `3` }],
  ],
  SC = [
    [`path`, { d: `m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9` }],
    [`path`, { d: `m18 15 4-4` }],
    [
      `path`,
      {
        d: `m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5`,
      },
    ],
  ],
  CC = [
    [
      `path`,
      {
        d: `M12.035 17.012a3 3 0 0 0-3-3l-.311-.002a.72.72 0 0 1-.505-1.229l1.195-1.195A2 2 0 0 1 10.828 11H12a2 2 0 0 0 0-4H9.243a3 3 0 0 0-2.122.879l-2.707 2.707A4.83 4.83 0 0 0 3 14a8 8 0 0 0 8 8h2a8 8 0 0 0 8-8V7a2 2 0 1 0-4 0v2a2 2 0 1 0 4 0`,
      },
    ],
    [`path`, { d: `M13.888 9.662A2 2 0 0 0 17 8V5A2 2 0 1 0 13 5` }],
    [`path`, { d: `M9 5A2 2 0 1 0 5 5V10` }],
    [`path`, { d: `M9 7V4A2 2 0 1 1 13 4V7.268` }],
  ],
  wC = [
    [`path`, { d: `M18 11.5V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4` }],
    [`path`, { d: `M14 10V8a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2` }],
    [`path`, { d: `M10 9.9V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v5` }],
    [`path`, { d: `M6 14a2 2 0 0 0-2-2a2 2 0 0 0-2 2` }],
    [
      `path`,
      {
        d: `M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0`,
      },
    ],
  ],
  TC = [
    [`path`, { d: `M11 14h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16` }],
    [
      `path`,
      {
        d: `m14.45 13.39 5.05-4.694C20.196 8 21 6.85 21 5.75a2.75 2.75 0 0 0-4.797-1.837.276.276 0 0 1-.406 0A2.75 2.75 0 0 0 11 5.75c0 1.2.802 2.248 1.5 2.946L16 11.95`,
      },
    ],
    [`path`, { d: `m2 15 6 6` }],
    [
      `path`,
      {
        d: `m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a1 1 0 0 0-2.75-2.91`,
      },
    ],
  ],
  EC = [
    [`path`, { d: `M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14` }],
    [
      `path`,
      {
        d: `m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9`,
      },
    ],
    [`path`, { d: `m2 13 6 6` }],
  ],
  DC = [
    [`path`, { d: `M18 12.5V10a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4` }],
    [`path`, { d: `M14 11V9a2 2 0 1 0-4 0v2` }],
    [`path`, { d: `M10 10.5V5a2 2 0 1 0-4 0v9` }],
    [
      `path`,
      {
        d: `m7 15-1.76-1.76a2 2 0 0 0-2.83 2.82l3.6 3.6C7.5 21.14 9.2 22 12 22h2a8 8 0 0 0 8-8V7a2 2 0 1 0-4 0v5`,
      },
    ],
  ],
  OC = [
    [`path`, { d: `M12 3V2` }],
    [
      `path`,
      {
        d: `m15.4 17.4 3.2-2.8a2 2 0 1 1 2.8 2.9l-3.6 3.3c-.7.8-1.7 1.2-2.8 1.2h-4c-1.1 0-2.1-.4-2.8-1.2l-1.302-1.464A1 1 0 0 0 6.151 19H5`,
      },
    ],
    [`path`, { d: `M2 14h12a2 2 0 0 1 0 4h-2` }],
    [`path`, { d: `M4 10h16` }],
    [`path`, { d: `M5 10a7 7 0 0 1 14 0` }],
    [`path`, { d: `M5 14v6a1 1 0 0 1-1 1H2` }],
  ],
  kC = [
    [
      `path`,
      {
        d: `M2.048 18.566A2 2 0 0 0 4 21h16a2 2 0 0 0 1.952-2.434l-2-9A2 2 0 0 0 18 8H6a2 2 0 0 0-1.952 1.566z`,
      },
    ],
    [`path`, { d: `M8 11V6a4 4 0 0 1 8 0v5` }],
  ],
  AC = [
    [`path`, { d: `M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2` }],
    [`path`, { d: `M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2` }],
    [`path`, { d: `M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8` }],
    [
      `path`,
      {
        d: `M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15`,
      },
    ],
  ],
  jC = [
    [`path`, { d: `m11 17 2 2a1 1 0 1 0 3-3` }],
    [
      `path`,
      {
        d: `m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4`,
      },
    ],
    [`path`, { d: `m21 3 1 11h-2` }],
    [`path`, { d: `M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3` }],
    [`path`, { d: `M3 4h8` }],
  ],
  MC = [
    [`path`, { d: `M12 2v8` }],
    [`path`, { d: `m16 6-4 4-4-4` }],
    [`rect`, { width: `20`, height: `8`, x: `2`, y: `14`, rx: `2` }],
    [`path`, { d: `M6 18h.01` }],
    [`path`, { d: `M10 18h.01` }],
  ],
  NC = [
    [`path`, { d: `m16 6-4-4-4 4` }],
    [`path`, { d: `M12 2v8` }],
    [`rect`, { width: `20`, height: `8`, x: `2`, y: `14`, rx: `2` }],
    [`path`, { d: `M6 18h.01` }],
    [`path`, { d: `M10 18h.01` }],
  ],
  PC = [
    [`path`, { d: `M10 16h.01` }],
    [
      `path`,
      {
        d: `M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z`,
      },
    ],
    [`path`, { d: `M21.946 12.013H2.054` }],
    [`path`, { d: `M6 16h.01` }],
  ],
  FC = [
    [`path`, { d: `M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5` }],
    [`path`, { d: `M14 6a6 6 0 0 1 6 6v3` }],
    [`path`, { d: `M4 15v-3a6 6 0 0 1 6-6` }],
    [`rect`, { x: `2`, y: `15`, width: `20`, height: `4`, rx: `1` }],
  ],
  IC = [
    [`line`, { x1: `4`, x2: `20`, y1: `9`, y2: `9` }],
    [`line`, { x1: `4`, x2: `20`, y1: `15`, y2: `15` }],
    [`line`, { x1: `10`, x2: `8`, y1: `3`, y2: `21` }],
    [`line`, { x1: `16`, x2: `14`, y1: `3`, y2: `21` }],
  ],
  LC = [
    [`path`, { d: `M14 18a2 2 0 0 0-4 0` }],
    [
      `path`,
      {
        d: `m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11`,
      },
    ],
    [`path`, { d: `M2 11h20` }],
    [`circle`, { cx: `17`, cy: `18`, r: `3` }],
    [`circle`, { cx: `7`, cy: `18`, r: `3` }],
  ],
  RC = [
    [`path`, { d: `m5.2 6.2 1.4 1.4` }],
    [`path`, { d: `M2 13h2` }],
    [`path`, { d: `M20 13h2` }],
    [`path`, { d: `m17.4 7.6 1.4-1.4` }],
    [`path`, { d: `M22 17H2` }],
    [`path`, { d: `M22 21H2` }],
    [`path`, { d: `M16 13a4 4 0 0 0-8 0` }],
    [`path`, { d: `M12 5V2.5` }],
  ],
  zC = [
    [`path`, { d: `M10 12H6` }],
    [`path`, { d: `M10 15V9` }],
    [
      `path`,
      {
        d: `M14 14.5a.5.5 0 0 0 .5.5h1a2.5 2.5 0 0 0 2.5-2.5v-1A2.5 2.5 0 0 0 15.5 9h-1a.5.5 0 0 0-.5.5z`,
      },
    ],
    [`path`, { d: `M6 15V9` }],
    [`rect`, { x: `2`, y: `5`, width: `20`, height: `14`, rx: `2` }],
  ],
  BC = [
    [
      `path`,
      {
        d: `M22 9a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1l2 2h12l2-2h1a1 1 0 0 0 1-1Z`,
      },
    ],
    [`path`, { d: `M7.5 12h9` }],
  ],
  VC = [
    [`path`, { d: `M4 12h8` }],
    [`path`, { d: `M4 18V6` }],
    [`path`, { d: `M12 18V6` }],
    [`path`, { d: `m17 12 3-2v8` }],
  ],
  HC = [
    [`path`, { d: `M4 12h8` }],
    [`path`, { d: `M4 18V6` }],
    [`path`, { d: `M12 18V6` }],
    [`path`, { d: `M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1` }],
  ],
  UC = [
    [`path`, { d: `M4 12h8` }],
    [`path`, { d: `M4 18V6` }],
    [`path`, { d: `M12 18V6` }],
    [`path`, { d: `M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2` }],
    [`path`, { d: `M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2` }],
  ],
  WC = [
    [`path`, { d: `M4 12h8` }],
    [`path`, { d: `M4 18V6` }],
    [`path`, { d: `M12 18V6` }],
    [`path`, { d: `M17 13v-3h4` }],
    [
      `path`,
      { d: `M17 17.7c.4.2.8.3 1.3.3 1.5 0 2.7-1.1 2.7-2.5S19.8 13 18.3 13H17` },
    ],
  ],
  GC = [
    [`path`, { d: `M12 18V6` }],
    [`path`, { d: `M17 10v3a1 1 0 0 0 1 1h3` }],
    [`path`, { d: `M21 10v8` }],
    [`path`, { d: `M4 12h8` }],
    [`path`, { d: `M4 18V6` }],
  ],
  KC = [
    [`path`, { d: `M4 12h8` }],
    [`path`, { d: `M4 18V6` }],
    [`path`, { d: `M12 18V6` }],
    [`circle`, { cx: `19`, cy: `16`, r: `2` }],
    [`path`, { d: `M20 10c-2 2-3 3.5-3 6` }],
  ],
  qC = [
    [`path`, { d: `M6 12h12` }],
    [`path`, { d: `M6 20V4` }],
    [`path`, { d: `M18 20V4` }],
  ],
  JC = [
    [
      `path`,
      {
        d: `M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3`,
      },
    ],
  ],
  YC = [
    [`path`, { d: `M21 14h-1.343` }],
    [`path`, { d: `M9.128 3.47A9 9 0 0 1 21 12v3.343` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M20.414 20.414A2 2 0 0 1 19 21h-1a2 2 0 0 1-2-2v-3` }],
    [
      `path`,
      {
        d: `M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 2.636-6.364`,
      },
    ],
  ],
  XC = [
    [
      `path`,
      {
        d: `M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z`,
      },
    ],
    [`path`, { d: `M21 16v2a4 4 0 0 1-4 4h-5` }],
  ],
  ZC = [
    [
      `path`,
      {
        d: `M12.409 5.824c-.702.792-1.15 1.496-1.415 2.166l2.153 2.156a.5.5 0 0 1 0 .707l-2.293 2.293a.5.5 0 0 0 0 .707L12 15`,
      },
    ],
    [
      `path`,
      {
        d: `M13.508 20.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.677.6.6 0 0 0 .818.001A5.5 5.5 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5z`,
      },
    ],
  ],
  QC = [
    [
      `path`,
      {
        d: `M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762`,
      },
    ],
  ],
  $C = [
    [
      `path`,
      {
        d: `M10.5 4.893a5.5 5.5 0 0 1 1.091.931.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 1.872-1.002 3.356-2.187 4.655`,
      },
    ],
    [
      `path`,
      {
        d: `m16.967 16.967-3.459 3.346a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 2.747-4.761`,
      },
    ],
    [`path`, { d: `m2 2 20 20` }],
  ],
  ew = [
    [
      `path`,
      {
        d: `m14.876 18.99-1.368 1.323a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5a5.2 5.2 0 0 1-.244 1.572`,
      },
    ],
    [`path`, { d: `M15 15h6` }],
  ],
  tw = [
    [
      `path`,
      {
        d: `M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5`,
      },
    ],
    [`path`, { d: `M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27` }],
  ],
  nw = [
    [
      `path`,
      {
        d: `m14.479 19.374-.971.939a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5a5.2 5.2 0 0 1-.219 1.49`,
      },
    ],
    [`path`, { d: `M15 15h6` }],
    [`path`, { d: `M18 12v6` }],
  ],
  rw = [
    [`path`, { d: `m15.5 12.5 5 5` }],
    [`path`, { d: `m20.5 12.5-5 5` }],
    [
      `path`,
      {
        d: `M21.955 8.774a5.5 5.5 0 0 0-9.546-2.95.6.6 0 0 1-.818 0A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.508 5.332a2 2 0 0 0 2.57.352`,
      },
    ],
  ],
  iw = [
    [
      `path`,
      {
        d: `M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5`,
      },
    ],
  ],
  aw = [
    [`path`, { d: `M11 8c2-3-2-3 0-6` }],
    [`path`, { d: `M15.5 8c2-3-2-3 0-6` }],
    [`path`, { d: `M6 10h.01` }],
    [`path`, { d: `M6 14h.01` }],
    [`path`, { d: `M10 16v-4` }],
    [`path`, { d: `M14 16v-4` }],
    [`path`, { d: `M18 16v-4` }],
    [
      `path`,
      {
        d: `M20 6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3`,
      },
    ],
    [`path`, { d: `M5 20v2` }],
    [`path`, { d: `M19 20v2` }],
  ],
  ow = [
    [`path`, { d: `M11 17v4` }],
    [`path`, { d: `M14 3v8a2 2 0 0 0 2 2h5.865` }],
    [`path`, { d: `M17 17v4` }],
    [
      `path`,
      {
        d: `M18 17a4 4 0 0 0 4-4 8 6 0 0 0-8-6 6 5 0 0 0-6 5v3a2 2 0 0 0 2 2z`,
      },
    ],
    [`path`, { d: `M2 10v5` }],
    [`path`, { d: `M6 3h16` }],
    [`path`, { d: `M7 21h14` }],
    [`path`, { d: `M8 13H2` }],
  ],
  sw = [
    [
      `path`,
      {
        d: `M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z`,
      },
    ],
  ],
  cw = [
    [`path`, { d: `m9 11-6 6v3h9l3-3` }],
    [
      `path`,
      { d: `m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4` },
    ],
  ],
  lw = [
    [`path`, { d: `M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8` }],
    [`path`, { d: `M3 3v5h5` }],
    [`path`, { d: `M12 7v5l4 2` }],
  ],
  uw = [
    [`path`, { d: `M10.82 16.12c1.69.6 3.91.79 5.18.85.28.01.53-.09.7-.27` }],
    [
      `path`,
      {
        d: `M11.14 20.57c.52.24 2.44 1.12 4.08 1.37.46.06.86-.25.9-.71.12-1.52-.3-3.43-.5-4.28`,
      },
    ],
    [`path`, { d: `M16.13 21.05c1.65.63 3.68.84 4.87.91a.9.9 0 0 0 .7-.26` }],
    [
      `path`,
      {
        d: `M17.99 5.52a20.83 20.83 0 0 1 3.15 4.5.8.8 0 0 1-.68 1.13c-1.17.1-2.5.02-3.9-.25`,
      },
    ],
    [
      `path`,
      { d: `M20.57 11.14c.24.52 1.12 2.44 1.37 4.08.04.3-.08.59-.31.75` },
    ],
    [
      `path`,
      {
        d: `M4.93 4.93a10 10 0 0 0-.67 13.4c.35.43.96.4 1.17-.12.69-1.71 1.07-5.07 1.07-6.71 1.34.45 3.1.9 4.88.62a.85.85 0 0 0 .48-.24`,
      },
    ],
    [
      `path`,
      {
        d: `M5.52 17.99c1.05.95 2.91 2.42 4.5 3.15a.8.8 0 0 0 1.13-.68c.2-2.34-.33-5.3-1.57-8.28`,
      },
    ],
    [
      `path`,
      {
        d: `M8.35 2.68a10 10 0 0 1 9.98 1.58c.43.35.4.96-.12 1.17-1.5.6-4.3.98-6.07 1.05`,
      },
    ],
    [`path`, { d: `m2 2 20 20` }],
  ],
  dw = [
    [
      `path`,
      {
        d: `M10.82 16.12c1.69.6 3.91.79 5.18.85.55.03 1-.42.97-.97-.06-1.27-.26-3.5-.85-5.18`,
      },
    ],
    [
      `path`,
      {
        d: `M11.5 6.5c1.64 0 5-.38 6.71-1.07.52-.2.55-.82.12-1.17A10 10 0 0 0 4.26 18.33c.35.43.96.4 1.17-.12.69-1.71 1.07-5.07 1.07-6.71 1.34.45 3.1.9 4.88.62a.88.88 0 0 0 .73-.74c.3-2.14-.15-3.5-.61-4.88`,
      },
    ],
    [
      `path`,
      {
        d: `M15.62 16.95c.2.85.62 2.76.5 4.28a.77.77 0 0 1-.9.7 16.64 16.64 0 0 1-4.08-1.36`,
      },
    ],
    [
      `path`,
      {
        d: `M16.13 21.05c1.65.63 3.68.84 4.87.91a.9.9 0 0 0 .96-.96 17.68 17.68 0 0 0-.9-4.87`,
      },
    ],
    [
      `path`,
      {
        d: `M16.94 15.62c.86.2 2.77.62 4.29.5a.77.77 0 0 0 .7-.9 16.64 16.64 0 0 0-1.36-4.08`,
      },
    ],
    [
      `path`,
      {
        d: `M17.99 5.52a20.82 20.82 0 0 1 3.15 4.5.8.8 0 0 1-.68 1.13c-2.33.2-5.3-.32-8.27-1.57`,
      },
    ],
    [`path`, { d: `M4.93 4.93 3 3a.7.7 0 0 1 0-1` }],
    [
      `path`,
      {
        d: `M9.58 12.18c1.24 2.98 1.77 5.95 1.57 8.28a.8.8 0 0 1-1.13.68 20.82 20.82 0 0 1-4.5-3.15`,
      },
    ],
  ],
  fw = [
    [`path`, { d: `M12 7v4` }],
    [`path`, { d: `M14 21v-3a2 2 0 0 0-4 0v3` }],
    [`path`, { d: `M14 9h-4` }],
    [
      `path`,
      {
        d: `M18 11h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2`,
      },
    ],
    [`path`, { d: `M18 21V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16` }],
  ],
  pw = [
    [`path`, { d: `M10 22v-6.57` }],
    [`path`, { d: `M12 11h.01` }],
    [`path`, { d: `M12 7h.01` }],
    [`path`, { d: `M14 15.43V22` }],
    [`path`, { d: `M15 16a5 5 0 0 0-6 0` }],
    [`path`, { d: `M16 11h.01` }],
    [`path`, { d: `M16 7h.01` }],
    [`path`, { d: `M8 11h.01` }],
    [`path`, { d: `M8 7h.01` }],
    [`rect`, { x: `4`, y: `2`, width: `16`, height: `20`, rx: `2` }],
  ],
  mw = [
    [`path`, { d: `M5 22h14` }],
    [`path`, { d: `M5 2h14` }],
    [
      `path`,
      {
        d: `M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22`,
      },
    ],
    [
      `path`,
      {
        d: `M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2`,
      },
    ],
  ],
  hw = [
    [
      `path`,
      {
        d: `M8.62 13.8A2.25 2.25 0 1 1 12 10.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z`,
      },
    ],
    [
      `path`,
      {
        d: `M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z`,
      },
    ],
  ],
  gw = [
    [`path`, { d: `M10 12V8.964` }],
    [`path`, { d: `M14 12V8.964` }],
    [
      `path`,
      {
        d: `M15 12a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2a1 1 0 0 1 1-1z`,
      },
    ],
    [
      `path`,
      {
        d: `M8.5 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-2`,
      },
    ],
  ],
  _w = [
    [
      `path`,
      {
        d: `M12.35 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .71-1.53l7-6a2 2 0 0 1 2.58 0l7 6A2 2 0 0 1 21 10v2.35`,
      },
    ],
    [`path`, { d: `M14.8 12.4A1 1 0 0 0 14 12h-4a1 1 0 0 0-1 1v8` }],
    [`path`, { d: `M15 18h6` }],
    [`path`, { d: `M18 15v6` }],
  ],
  vw = [
    [`path`, { d: `M9.5 13.866a4 4 0 0 1 5 .01` }],
    [`path`, { d: `M12 17h.01` }],
    [
      `path`,
      {
        d: `M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z`,
      },
    ],
    [`path`, { d: `M7 10.754a8 8 0 0 1 10 0` }],
  ],
  yw = [
    [`path`, { d: `M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8` }],
    [
      `path`,
      {
        d: `M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z`,
      },
    ],
  ],
  bw = [
    [
      `path`,
      {
        d: `M12 17c5 0 8-2.69 8-6H4c0 3.31 3 6 8 6m-4 4h8m-4-3v3M5.14 11a3.5 3.5 0 1 1 6.71 0`,
      },
    ],
    [`path`, { d: `M12.14 11a3.5 3.5 0 1 1 6.71 0` }],
    [`path`, { d: `M15.5 6.5a3.5 3.5 0 1 0-7 0` }],
  ],
  xw = [
    [`path`, { d: `m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11` }],
    [`path`, { d: `M17 7A5 5 0 0 0 7 7` }],
    [`path`, { d: `M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4` }],
  ],
  Sw = [
    [`path`, { d: `M13.5 8h-3` }],
    [
      `path`,
      {
        d: `m15 2-1 2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3`,
      },
    ],
    [`path`, { d: `M16.899 22A5 5 0 0 0 7.1 22` }],
    [`path`, { d: `m9 2 3 6` }],
    [`circle`, { cx: `12`, cy: `15`, r: `3` }],
  ],
  Cw = [
    [`path`, { d: `M16 10h2` }],
    [`path`, { d: `M16 14h2` }],
    [`path`, { d: `M6.17 15a3 3 0 0 1 5.66 0` }],
    [`circle`, { cx: `9`, cy: `11`, r: `2` }],
    [`rect`, { x: `2`, y: `5`, width: `20`, height: `14`, rx: `2` }],
  ],
  ww = [
    [
      `path`,
      {
        d: `M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21`,
      },
    ],
    [`path`, { d: `m14 19 3 3v-5.5` }],
    [`path`, { d: `m17 22 3-3` }],
    [`circle`, { cx: `9`, cy: `9`, r: `2` }],
  ],
  Tw = [
    [`path`, { d: `M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7` }],
    [`line`, { x1: `16`, x2: `22`, y1: `5`, y2: `5` }],
    [`circle`, { cx: `9`, cy: `9`, r: `2` }],
    [`path`, { d: `m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21` }],
  ],
  Ew = [
    [`line`, { x1: `2`, x2: `22`, y1: `2`, y2: `22` }],
    [`path`, { d: `M10.41 10.41a2 2 0 1 1-2.83-2.83` }],
    [`line`, { x1: `13.5`, x2: `6`, y1: `13.5`, y2: `21` }],
    [`line`, { x1: `18`, x2: `21`, y1: `12`, y2: `15` }],
    [
      `path`,
      {
        d: `M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59`,
      },
    ],
    [`path`, { d: `M21 15V5a2 2 0 0 0-2-2H9` }],
  ],
  Dw = [
    [
      `path`,
      {
        d: `M15 15.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997a1 1 0 0 1-1.517-.86z`,
      },
    ],
    [
      `path`,
      { d: `M21 12.17V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6` },
    ],
    [`path`, { d: `m6 21 5-5` }],
    [`circle`, { cx: `9`, cy: `9`, r: `2` }],
  ],
  Ow = [
    [`path`, { d: `M16 5h6` }],
    [`path`, { d: `M19 2v6` }],
    [
      `path`,
      { d: `M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5` },
    ],
    [`path`, { d: `m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21` }],
    [`circle`, { cx: `9`, cy: `9`, r: `2` }],
  ],
  kw = [
    [
      `path`,
      {
        d: `M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21`,
      },
    ],
    [`path`, { d: `m14 19.5 3-3 3 3` }],
    [`path`, { d: `M17 22v-5.5` }],
    [`circle`, { cx: `9`, cy: `9`, r: `2` }],
  ],
  Aw = [
    [`path`, { d: `M16 3h5v5` }],
    [`path`, { d: `M17 21h2a2 2 0 0 0 2-2` }],
    [`path`, { d: `M21 12v3` }],
    [`path`, { d: `m21 3-5 5` }],
    [`path`, { d: `M3 7V5a2 2 0 0 1 2-2` }],
    [`path`, { d: `m5 21 4.144-4.144a1.21 1.21 0 0 1 1.712 0L13 19` }],
    [`path`, { d: `M9 3h3` }],
    [`rect`, { x: `3`, y: `11`, width: `10`, height: `10`, rx: `1` }],
  ],
  jw = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2`, ry: `2` }],
    [`circle`, { cx: `9`, cy: `9`, r: `2` }],
    [`path`, { d: `m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21` }],
  ],
  Mw = [
    [`path`, { d: `m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16` }],
    [`path`, { d: `M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2` }],
    [`circle`, { cx: `13`, cy: `7`, r: `1`, fill: `currentColor` }],
    [`rect`, { x: `8`, y: `2`, width: `14`, height: `14`, rx: `2` }],
  ],
  Nw = [
    [`path`, { d: `M12 3v12` }],
    [`path`, { d: `m8 11 4 4 4-4` }],
    [
      `path`,
      {
        d: `M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4`,
      },
    ],
  ],
  Pw = [
    [`polyline`, { points: `22 12 16 12 14 15 10 15 8 12 2 12` }],
    [
      `path`,
      {
        d: `M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z`,
      },
    ],
  ],
  Fw = [
    [`path`, { d: `M6 3h12` }],
    [`path`, { d: `M6 8h12` }],
    [`path`, { d: `m6 13 8.5 8` }],
    [`path`, { d: `M6 13h3` }],
    [`path`, { d: `M9 13c6.667 0 6.667-10 0-10` }],
  ],
  Iw = [
    [
      `path`,
      { d: `M6 16c5 0 7-8 12-8a4 4 0 0 1 0 8c-5 0-7-8-12-8a4 4 0 1 0 0 8` },
    ],
  ],
  Lw = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M12 16v-4` }],
    [`path`, { d: `M12 8h.01` }],
  ],
  Rw = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M7 7h.01` }],
    [`path`, { d: `M17 7h.01` }],
    [`path`, { d: `M7 17h.01` }],
    [`path`, { d: `M17 17h.01` }],
  ],
  zw = [
    [`line`, { x1: `19`, x2: `10`, y1: `4`, y2: `4` }],
    [`line`, { x1: `14`, x2: `5`, y1: `20`, y2: `20` }],
    [`line`, { x1: `15`, x2: `9`, y1: `4`, y2: `20` }],
  ],
  Bw = [
    [`path`, { d: `m16 14 4 4-4 4` }],
    [`path`, { d: `M20 10a8 8 0 1 0-8 8h8` }],
  ],
  Vw = [
    [`path`, { d: `M4 10a8 8 0 1 1 8 8H4` }],
    [`path`, { d: `m8 22-4-4 4-4` }],
  ],
  Hw = [
    [
      `path`,
      {
        d: `M21 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2Z`,
      },
    ],
    [`path`, { d: `M6 15v-2` }],
    [`path`, { d: `M12 15V9` }],
    [`circle`, { cx: `12`, cy: `6`, r: `3` }],
  ],
  Uw = [
    [`path`, { d: `M12 9.5V21m0-11.5L6 3m6 6.5L18 3` }],
    [`path`, { d: `M6 15h12` }],
    [`path`, { d: `M6 11h12` }],
  ],
  Ww = [
    [`path`, { d: `M5 3v14` }],
    [`path`, { d: `M12 3v8` }],
    [`path`, { d: `M19 3v18` }],
  ],
  Gw = [
    [`path`, { d: `M18 17a1 1 0 0 0-1 1v1a2 2 0 1 0 2-2z` }],
    [
      `path`,
      {
        d: `M20.97 3.61a.45.45 0 0 0-.58-.58C10.2 6.6 6.6 10.2 3.03 20.39a.45.45 0 0 0 .58.58C13.8 17.4 17.4 13.8 20.97 3.61`,
      },
    ],
    [`path`, { d: `m6.707 6.707 10.586 10.586` }],
    [`path`, { d: `M7 5a2 2 0 1 0-2 2h1a1 1 0 0 0 1-1z` }],
  ],
  Kw = [
    [
      `path`,
      {
        d: `M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z`,
      },
    ],
    [`circle`, { cx: `16.5`, cy: `7.5`, r: `.5`, fill: `currentColor` }],
  ],
  qw = [
    [
      `path`,
      {
        d: `M12.4 2.7a2.5 2.5 0 0 1 3.4 0l5.5 5.5a2.5 2.5 0 0 1 0 3.4l-3.7 3.7a2.5 2.5 0 0 1-3.4 0L8.7 9.8a2.5 2.5 0 0 1 0-3.4z`,
      },
    ],
    [`path`, { d: `m14 7 3 3` }],
    [
      `path`,
      {
        d: `m9.4 10.6-6.814 6.814A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814`,
      },
    ],
  ],
  Jw = [
    [
      `path`,
      { d: `m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4` },
    ],
    [`path`, { d: `m21 2-9.6 9.6` }],
    [`circle`, { cx: `7.5`, cy: `15.5`, r: `5.5` }],
  ],
  Yw = [
    [`rect`, { width: `20`, height: `16`, x: `2`, y: `4`, rx: `2` }],
    [`path`, { d: `M6 8h4` }],
    [`path`, { d: `M14 8h.01` }],
    [`path`, { d: `M18 8h.01` }],
    [`path`, { d: `M2 12h20` }],
    [`path`, { d: `M6 12v4` }],
    [`path`, { d: `M10 12v4` }],
    [`path`, { d: `M14 12v4` }],
    [`path`, { d: `M18 12v4` }],
  ],
  Xw = [
    [`path`, { d: `M 20 4 A2 2 0 0 1 22 6` }],
    [`path`, { d: `M 22 6 L 22 16.41` }],
    [`path`, { d: `M 7 16 L 16 16` }],
    [`path`, { d: `M 9.69 4 L 20 4` }],
    [`path`, { d: `M14 8h.01` }],
    [`path`, { d: `M18 8h.01` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M20 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2` }],
    [`path`, { d: `M6 8h.01` }],
    [`path`, { d: `M8 12h.01` }],
  ],
  Zw = [
    [`path`, { d: `M10 8h.01` }],
    [`path`, { d: `M12 12h.01` }],
    [`path`, { d: `M14 8h.01` }],
    [`path`, { d: `M16 12h.01` }],
    [`path`, { d: `M18 8h.01` }],
    [`path`, { d: `M6 8h.01` }],
    [`path`, { d: `M7 16h10` }],
    [`path`, { d: `M8 12h.01` }],
    [`rect`, { width: `20`, height: `16`, x: `2`, y: `4`, rx: `2` }],
  ],
  Qw = [
    [`path`, { d: `M12 2v5` }],
    [`path`, { d: `M14.829 15.998a3 3 0 1 1-5.658 0` }],
    [
      `path`,
      {
        d: `M20.92 14.606A1 1 0 0 1 20 16H4a1 1 0 0 1-.92-1.394l3-7A1 1 0 0 1 7 7h10a1 1 0 0 1 .92.606z`,
      },
    ],
  ],
  $w = [
    [
      `path`,
      {
        d: `M10.293 2.293a1 1 0 0 1 1.414 0l2.5 2.5 5.994 1.227a1 1 0 0 1 .506 1.687l-7 7a1 1 0 0 1-1.687-.506l-1.227-5.994-2.5-2.5a1 1 0 0 1 0-1.414z`,
      },
    ],
    [`path`, { d: `m14.207 4.793-3.414 3.414` }],
    [
      `path`,
      {
        d: `M3 20a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z`,
      },
    ],
    [`path`, { d: `m9.086 6.5-4.793 4.793a1 1 0 0 0-.18 1.17L7 18` }],
  ],
  eT = [
    [`path`, { d: `M12 10v12` }],
    [
      `path`,
      {
        d: `M17.929 7.629A1 1 0 0 1 17 9H7a1 1 0 0 1-.928-1.371l2-5A1 1 0 0 1 9 2h6a1 1 0 0 1 .928.629z`,
      },
    ],
    [`path`, { d: `M9 22h6` }],
  ],
  tT = [
    [
      `path`,
      {
        d: `M19.929 18.629A1 1 0 0 1 19 20H9a1 1 0 0 1-.928-1.371l2-5A1 1 0 0 1 11 13h6a1 1 0 0 1 .928.629z`,
      },
    ],
    [
      `path`,
      {
        d: `M6 3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z`,
      },
    ],
    [`path`, { d: `M8 6h4a2 2 0 0 1 2 2v5` }],
  ],
  nT = [
    [`path`, { d: `M12 12v6` }],
    [
      `path`,
      {
        d: `M4.077 10.615A1 1 0 0 0 5 12h14a1 1 0 0 0 .923-1.385l-3.077-7.384A2 2 0 0 0 15 2H9a2 2 0 0 0-1.846 1.23Z`,
      },
    ],
    [
      `path`,
      {
        d: `M8 20a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z`,
      },
    ],
  ],
  rT = [
    [
      `path`,
      {
        d: `M19.929 9.629A1 1 0 0 1 19 11H9a1 1 0 0 1-.928-1.371l2-5A1 1 0 0 1 11 4h6a1 1 0 0 1 .928.629z`,
      },
    ],
    [
      `path`,
      {
        d: `M6 15a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z`,
      },
    ],
    [`path`, { d: `M8 18h4a2 2 0 0 0 2-2v-5` }],
  ],
  iT = [
    [`path`, { d: `m12 8 6-3-6-3v10` }],
    [
      `path`,
      {
        d: `m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12`,
      },
    ],
    [`path`, { d: `m6.49 12.85 11.02 6.3` }],
    [`path`, { d: `M17.51 12.85 6.5 19.15` }],
  ],
  aT = [
    [`path`, { d: `M10 18v-7` }],
    [
      `path`,
      {
        d: `M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z`,
      },
    ],
    [`path`, { d: `M14 18v-7` }],
    [`path`, { d: `M18 18v-7` }],
    [`path`, { d: `M3 22h18` }],
    [`path`, { d: `M6 18v-7` }],
  ],
  oT = [
    [`path`, { d: `m5 8 6 6` }],
    [`path`, { d: `m4 14 6-6 2-3` }],
    [`path`, { d: `M2 5h12` }],
    [`path`, { d: `M7 2h1` }],
    [`path`, { d: `m22 22-5-10-5 10` }],
    [`path`, { d: `M14 18h6` }],
  ],
  sT = [
    [`path`, { d: `M2 20h20` }],
    [`path`, { d: `m9 10 2 2 4-4` }],
    [`rect`, { x: `3`, y: `4`, width: `18`, height: `12`, rx: `2` }],
  ],
  cT = [
    [
      `path`,
      {
        d: `M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z`,
      },
    ],
    [`path`, { d: `M20.054 15.987H3.946` }],
  ],
  lT = [
    [`rect`, { width: `18`, height: `12`, x: `3`, y: `4`, rx: `2`, ry: `2` }],
    [`line`, { x1: `2`, x2: `22`, y1: `20`, y2: `20` }],
  ],
  uT = [
    [`path`, { d: `M7 22a5 5 0 0 1-2-4` }],
    [`path`, { d: `M7 16.93c.96.43 1.96.74 2.99.91` }],
    [
      `path`,
      {
        d: `M3.34 14A6.8 6.8 0 0 1 2 10c0-4.42 4.48-8 10-8s10 3.58 10 8a7.19 7.19 0 0 1-.33 2`,
      },
    ],
    [`path`, { d: `M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z` }],
    [
      `path`,
      {
        d: `M14.33 22h-.09a.35.35 0 0 1-.24-.32v-10a.34.34 0 0 1 .33-.34c.08 0 .15.03.21.08l7.34 6a.33.33 0 0 1-.21.59h-4.49l-2.57 3.85a.35.35 0 0 1-.28.14z`,
      },
    ],
  ],
  dT = [
    [`path`, { d: `M3.704 14.467a10 8 0 1 1 3.115 2.375` }],
    [`path`, { d: `M7 22a5 5 0 0 1-2-3.994` }],
    [`circle`, { cx: `5`, cy: `16`, r: `2` }],
  ],
  fT = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5h12Z` }],
    [`line`, { x1: `9`, x2: `9.01`, y1: `9`, y2: `9` }],
    [`line`, { x1: `15`, x2: `15.01`, y1: `9`, y2: `9` }],
  ],
  pT = [
    [
      `path`,
      {
        d: `M13 13.74a2 2 0 0 1-2 0L2.5 8.87a1 1 0 0 1 0-1.74L11 2.26a2 2 0 0 1 2 0l8.5 4.87a1 1 0 0 1 0 1.74z`,
      },
    ],
    [
      `path`,
      {
        d: `m20 14.285 1.5.845a1 1 0 0 1 0 1.74L13 21.74a2 2 0 0 1-2 0l-8.5-4.87a1 1 0 0 1 0-1.74l1.5-.845`,
      },
    ],
  ],
  mT = [
    [
      `path`,
      {
        d: `M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 .83.18 2 2 0 0 0 .83-.18l8.58-3.9a1 1 0 0 0 0-1.832z`,
      },
    ],
    [`path`, { d: `M16 17h6` }],
    [
      `path`,
      { d: `M2.003 11.995a1 1 0 0 0 .597.915l8.58 3.91a2 2 0 0 0 .83.18` },
    ],
    [
      `path`,
      {
        d: `M2.003 16.995a1 1 0 0 0 .597.915l8.58 3.91a2 2 0 0 0 .83.18 2 2 0 0 0 .83-.18l2.11-.96`,
      },
    ],
    [`path`, { d: `M22.018 12.004a1 1 0 0 1-.598.916l-.177.08` }],
  ],
  hT = [
    [
      `path`,
      {
        d: `M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 .83.18 2 2 0 0 0 .83-.18l8.58-3.9a1 1 0 0 0 0-1.831z`,
      },
    ],
    [`path`, { d: `M16 17h6` }],
    [`path`, { d: `M19 14v6` }],
    [`path`, { d: `M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 .825.178` }],
    [
      `path`,
      { d: `M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l2.116-.962` },
    ],
  ],
  gT = [
    [
      `path`,
      {
        d: `M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z`,
      },
    ],
    [
      `path`,
      {
        d: `M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12`,
      },
    ],
    [
      `path`,
      {
        d: `M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17`,
      },
    ],
  ],
  _T = [
    [`rect`, { width: `7`, height: `9`, x: `3`, y: `3`, rx: `1` }],
    [`rect`, { width: `7`, height: `5`, x: `14`, y: `3`, rx: `1` }],
    [`rect`, { width: `7`, height: `9`, x: `14`, y: `12`, rx: `1` }],
    [`rect`, { width: `7`, height: `5`, x: `3`, y: `16`, rx: `1` }],
  ],
  vT = [
    [`rect`, { width: `7`, height: `7`, x: `3`, y: `3`, rx: `1` }],
    [`rect`, { width: `7`, height: `7`, x: `14`, y: `3`, rx: `1` }],
    [`rect`, { width: `7`, height: `7`, x: `14`, y: `14`, rx: `1` }],
    [`rect`, { width: `7`, height: `7`, x: `3`, y: `14`, rx: `1` }],
  ],
  yT = [
    [`rect`, { width: `7`, height: `7`, x: `3`, y: `3`, rx: `1` }],
    [`rect`, { width: `7`, height: `7`, x: `3`, y: `14`, rx: `1` }],
    [`path`, { d: `M14 4h7` }],
    [`path`, { d: `M14 9h7` }],
    [`path`, { d: `M14 15h7` }],
    [`path`, { d: `M14 20h7` }],
  ],
  bT = [
    [`rect`, { width: `7`, height: `18`, x: `3`, y: `3`, rx: `1` }],
    [`rect`, { width: `7`, height: `7`, x: `14`, y: `3`, rx: `1` }],
    [`rect`, { width: `7`, height: `7`, x: `14`, y: `14`, rx: `1` }],
  ],
  xT = [
    [`rect`, { width: `18`, height: `7`, x: `3`, y: `3`, rx: `1` }],
    [`rect`, { width: `7`, height: `7`, x: `3`, y: `14`, rx: `1` }],
    [`rect`, { width: `7`, height: `7`, x: `14`, y: `14`, rx: `1` }],
  ],
  ST = [
    [`rect`, { width: `18`, height: `7`, x: `3`, y: `3`, rx: `1` }],
    [`rect`, { width: `9`, height: `7`, x: `3`, y: `14`, rx: `1` }],
    [`rect`, { width: `5`, height: `7`, x: `16`, y: `14`, rx: `1` }],
  ],
  CT = [
    [
      `path`,
      {
        d: `M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z`,
      },
    ],
    [`path`, { d: `M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12` }],
  ],
  wT = [
    [
      `path`,
      {
        d: `M2 22c1.25-.987 2.27-1.975 3.9-2.2a5.56 5.56 0 0 1 3.8 1.5 4 4 0 0 0 6.187-2.353 3.5 3.5 0 0 0 3.69-5.116A3.5 3.5 0 0 0 20.95 8 3.5 3.5 0 1 0 16 3.05a3.5 3.5 0 0 0-5.831 1.373 3.5 3.5 0 0 0-5.116 3.69 4 4 0 0 0-2.348 6.155C3.499 15.42 4.409 16.712 4.2 18.1 3.926 19.743 3.014 20.732 2 22`,
      },
    ],
    [`path`, { d: `M2 22 17 7` }],
  ],
  TT = [
    [
      `path`,
      {
        d: `M16 12h3a2 2 0 0 0 1.902-1.38l1.056-3.333A1 1 0 0 0 21 6H3a1 1 0 0 0-.958 1.287l1.056 3.334A2 2 0 0 0 5 12h3`,
      },
    ],
    [`path`, { d: `M18 6V3a1 1 0 0 0-1-1h-3` }],
    [`rect`, { width: `8`, height: `12`, x: `8`, y: `10`, rx: `1` }],
  ],
  ET = [
    [
      `path`,
      {
        d: `M7 2a1 1 0 0 0-.8 1.6 14 14 0 0 1 0 16.8A1 1 0 0 0 7 22h10a1 1 0 0 0 .8-1.6 14 14 0 0 1 0-16.8A1 1 0 0 0 17 2z`,
      },
    ],
  ],
  DT = [
    [
      `path`,
      {
        d: `M13.433 2a1 1 0 0 1 .824.448 18 18 0 0 1 0 19.104 1 1 0 0 1-.824.448h-2.866a1 1 0 0 1-.824-.448 18 18 0 0 1 0-19.104A1 1 0 0 1 10.567 2z`,
      },
    ],
  ],
  OT = [
    [`rect`, { width: `8`, height: `18`, x: `3`, y: `3`, rx: `1` }],
    [`path`, { d: `M7 3v18` }],
    [
      `path`,
      {
        d: `M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z`,
      },
    ],
  ],
  kT = [
    [`path`, { d: `m16 6 4 14` }],
    [`path`, { d: `M12 6v14` }],
    [`path`, { d: `M8 8v12` }],
    [`path`, { d: `M4 4v16` }],
  ],
  AT = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `m4.93 4.93 4.24 4.24` }],
    [`path`, { d: `m14.83 9.17 4.24-4.24` }],
    [`path`, { d: `m14.83 14.83 4.24 4.24` }],
    [`path`, { d: `m9.17 14.83-4.24 4.24` }],
    [`circle`, { cx: `12`, cy: `12`, r: `4` }],
  ],
  jT = [
    [`path`, { d: `M14 12h2v8` }],
    [`path`, { d: `M14 20h4` }],
    [`path`, { d: `M6 12h4` }],
    [`path`, { d: `M6 20h4` }],
    [`path`, { d: `M8 20V8a4 4 0 0 1 7.464-2` }],
  ],
  MT = [
    [
      `path`,
      {
        d: `M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5`,
      },
    ],
    [`path`, { d: `M9 18h6` }],
    [`path`, { d: `M10 22h4` }],
  ],
  NT = [
    [`path`, { d: `M16.8 11.2c.8-.9 1.2-2 1.2-3.2a6 6 0 0 0-9.3-5` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M6.3 6.3a4.67 4.67 0 0 0 1.2 5.2c.7.7 1.3 1.5 1.5 2.5` }],
    [`path`, { d: `M9 18h6` }],
    [`path`, { d: `M10 22h4` }],
  ],
  PT = [
    [`path`, { d: `M 3 12 L 15 12` }],
    [`circle`, { cx: `18`, cy: `12`, r: `3` }],
  ],
  FT = [
    [
      `path`,
      {
        d: `M7 3.5c5-2 7 2.5 3 4C1.5 10 2 15 5 16c5 2 9-10 14-7s.5 13.5-4 12c-5-2.5.5-11 6-2`,
      },
    ],
  ],
  IT = [
    [`path`, { d: `M11 5h2` }],
    [`path`, { d: `M15 12h6` }],
    [`path`, { d: `M19 5h2` }],
    [`path`, { d: `M3 12h6` }],
    [`path`, { d: `M3 19h18` }],
    [`path`, { d: `M3 5h2` }],
  ],
  LT = [
    [`path`, { d: `M9 17H7A5 5 0 0 1 7 7h2` }],
    [`path`, { d: `M15 7h2a5 5 0 1 1 0 10h-2` }],
    [`line`, { x1: `8`, x2: `16`, y1: `12`, y2: `12` }],
  ],
  RT = [
    [`path`, { d: `M9 17H7A5 5 0 0 1 7 7` }],
    [`path`, { d: `M15 7h2a5 5 0 0 1 4 8` }],
    [`line`, { x1: `8`, x2: `12`, y1: `12`, y2: `12` }],
    [`line`, { x1: `2`, x2: `22`, y1: `2`, y2: `22` }],
  ],
  zT = [
    [
      `path`,
      { d: `M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71` },
    ],
    [
      `path`,
      { d: `M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71` },
    ],
  ],
  BT = [
    [`path`, { d: `M16 5H3` }],
    [`path`, { d: `M16 12H3` }],
    [`path`, { d: `M11 19H3` }],
    [`path`, { d: `m15 18 2 2 4-4` }],
  ],
  VT = [
    [`path`, { d: `M13 5h8` }],
    [`path`, { d: `M13 12h8` }],
    [`path`, { d: `M13 19h8` }],
    [`path`, { d: `m3 17 2 2 4-4` }],
    [`path`, { d: `m3 7 2 2 4-4` }],
  ],
  HT = [
    [`path`, { d: `M3 5h8` }],
    [`path`, { d: `M3 12h8` }],
    [`path`, { d: `M3 19h8` }],
    [`path`, { d: `m15 5 3 3 3-3` }],
    [`path`, { d: `m15 19 3-3 3 3` }],
  ],
  UT = [
    [`path`, { d: `M3 5h8` }],
    [`path`, { d: `M3 12h8` }],
    [`path`, { d: `M3 19h8` }],
    [`path`, { d: `m15 8 3-3 3 3` }],
    [`path`, { d: `m15 16 3 3 3-3` }],
  ],
  WT = [
    [`path`, { d: `M10 5h11` }],
    [`path`, { d: `M10 12h11` }],
    [`path`, { d: `M10 19h11` }],
    [`path`, { d: `m3 10 3-3-3-3` }],
    [`path`, { d: `m3 20 3-3-3-3` }],
  ],
  GT = [
    [`path`, { d: `M16 5H3` }],
    [`path`, { d: `M16 12H3` }],
    [`path`, { d: `M9 19H3` }],
    [`path`, { d: `m16 16-3 3 3 3` }],
    [`path`, { d: `M21 5v12a2 2 0 0 1-2 2h-6` }],
  ],
  KT = [
    [`path`, { d: `M12 5H2` }],
    [`path`, { d: `M6 12h12` }],
    [`path`, { d: `M9 19h6` }],
    [`path`, { d: `M16 5h6` }],
    [`path`, { d: `M19 8V2` }],
  ],
  qT = [
    [`path`, { d: `M2 5h20` }],
    [`path`, { d: `M6 12h12` }],
    [`path`, { d: `M9 19h6` }],
  ],
  JT = [
    [`path`, { d: `M21 5H11` }],
    [`path`, { d: `M21 12H11` }],
    [`path`, { d: `M21 19H11` }],
    [`path`, { d: `m7 8-4 4 4 4` }],
  ],
  YT = [
    [`path`, { d: `M21 5H11` }],
    [`path`, { d: `M21 12H11` }],
    [`path`, { d: `M21 19H11` }],
    [`path`, { d: `m3 8 4 4-4 4` }],
  ],
  XT = [
    [`path`, { d: `M16 5H3` }],
    [`path`, { d: `M11 12H3` }],
    [`path`, { d: `M16 19H3` }],
    [`path`, { d: `M21 12h-6` }],
  ],
  ZT = [
    [`path`, { d: `M16 5H3` }],
    [`path`, { d: `M11 12H3` }],
    [`path`, { d: `M11 19H3` }],
    [`path`, { d: `M21 16V5` }],
    [`circle`, { cx: `18`, cy: `16`, r: `3` }],
  ],
  QT = [
    [`path`, { d: `M11 5h10` }],
    [`path`, { d: `M11 12h10` }],
    [`path`, { d: `M11 19h10` }],
    [`path`, { d: `M4 4h1v5` }],
    [`path`, { d: `M4 9h2` }],
    [`path`, { d: `M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02` }],
  ],
  $T = [
    [`path`, { d: `M16 5H3` }],
    [`path`, { d: `M11 12H3` }],
    [`path`, { d: `M16 19H3` }],
    [`path`, { d: `M18 9v6` }],
    [`path`, { d: `M21 12h-6` }],
  ],
  eE = [
    [`path`, { d: `M21 5H3` }],
    [`path`, { d: `M7 12H3` }],
    [`path`, { d: `M7 19H3` }],
    [
      `path`,
      {
        d: `M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14`,
      },
    ],
    [`path`, { d: `M11 10v4h4` }],
  ],
  tE = [
    [`path`, { d: `M3 5h6` }],
    [`path`, { d: `M3 12h13` }],
    [`path`, { d: `M3 19h13` }],
    [`path`, { d: `m16 8-3-3 3-3` }],
    [`path`, { d: `M21 19V7a2 2 0 0 0-2-2h-6` }],
  ],
  nE = [
    [`path`, { d: `M13 5h8` }],
    [`path`, { d: `M13 12h8` }],
    [`path`, { d: `M13 19h8` }],
    [`path`, { d: `m3 17 2 2 4-4` }],
    [`rect`, { x: `3`, y: `4`, width: `6`, height: `6`, rx: `1` }],
  ],
  rE = [
    [`path`, { d: `M8 5h13` }],
    [`path`, { d: `M13 12h8` }],
    [`path`, { d: `M13 19h8` }],
    [`path`, { d: `M3 10a2 2 0 0 0 2 2h3` }],
    [`path`, { d: `M3 5v12a2 2 0 0 0 2 2h3` }],
  ],
  iE = [
    [`path`, { d: `M21 5H3` }],
    [`path`, { d: `M10 12H3` }],
    [`path`, { d: `M10 19H3` }],
    [
      `path`,
      {
        d: `M15 12.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997a1 1 0 0 1-1.517-.86z`,
      },
    ],
  ],
  aE = [
    [`path`, { d: `M16 5H3` }],
    [`path`, { d: `M11 12H3` }],
    [`path`, { d: `M16 19H3` }],
    [`path`, { d: `m15.5 9.5 5 5` }],
    [`path`, { d: `m20.5 9.5-5 5` }],
  ],
  oE = [
    [`path`, { d: `M3 5h.01` }],
    [`path`, { d: `M3 12h.01` }],
    [`path`, { d: `M3 19h.01` }],
    [`path`, { d: `M8 5h13` }],
    [`path`, { d: `M8 12h13` }],
    [`path`, { d: `M8 19h13` }],
  ],
  sE = [[`path`, { d: `M21 12a9 9 0 1 1-6.219-8.56` }]],
  cE = [
    [`path`, { d: `M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0` }],
    [`path`, { d: `M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6` }],
    [`path`, { d: `M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6` }],
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
  ],
  lE = [
    [`path`, { d: `M12 2v4` }],
    [`path`, { d: `m16.2 7.8 2.9-2.9` }],
    [`path`, { d: `M18 12h4` }],
    [`path`, { d: `m16.2 16.2 2.9 2.9` }],
    [`path`, { d: `M12 18v4` }],
    [`path`, { d: `m4.9 19.1 2.9-2.9` }],
    [`path`, { d: `M2 12h4` }],
    [`path`, { d: `m4.9 4.9 2.9 2.9` }],
  ],
  uE = [
    [`line`, { x1: `2`, x2: `5`, y1: `12`, y2: `12` }],
    [`line`, { x1: `19`, x2: `22`, y1: `12`, y2: `12` }],
    [`line`, { x1: `12`, x2: `12`, y1: `2`, y2: `5` }],
    [`line`, { x1: `12`, x2: `12`, y1: `19`, y2: `22` }],
    [`circle`, { cx: `12`, cy: `12`, r: `7` }],
    [`circle`, { cx: `12`, cy: `12`, r: `3` }],
  ],
  dE = [
    [`path`, { d: `M12 19v3` }],
    [`path`, { d: `M12 2v3` }],
    [`path`, { d: `M18.89 13.24a7 7 0 0 0-8.13-8.13` }],
    [`path`, { d: `M19 12h3` }],
    [`path`, { d: `M2 12h3` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M7.05 7.05a7 7 0 0 0 9.9 9.9` }],
  ],
  fE = [
    [`line`, { x1: `2`, x2: `5`, y1: `12`, y2: `12` }],
    [`line`, { x1: `19`, x2: `22`, y1: `12`, y2: `12` }],
    [`line`, { x1: `12`, x2: `12`, y1: `2`, y2: `5` }],
    [`line`, { x1: `12`, x2: `12`, y1: `19`, y2: `22` }],
    [`circle`, { cx: `12`, cy: `12`, r: `7` }],
  ],
  pE = [
    [`circle`, { cx: `12`, cy: `16`, r: `1` }],
    [`rect`, { width: `18`, height: `12`, x: `3`, y: `10`, rx: `2` }],
    [`path`, { d: `M7 10V7a5 5 0 0 1 9.33-2.5` }],
  ],
  mE = [
    [`circle`, { cx: `12`, cy: `16`, r: `1` }],
    [`rect`, { x: `3`, y: `10`, width: `18`, height: `12`, rx: `2` }],
    [`path`, { d: `M7 10V7a5 5 0 0 1 10 0v3` }],
  ],
  hE = [
    [`rect`, { width: `18`, height: `11`, x: `3`, y: `11`, rx: `2`, ry: `2` }],
    [`path`, { d: `M7 11V7a5 5 0 0 1 9.9-1` }],
  ],
  gE = [
    [`rect`, { width: `18`, height: `11`, x: `3`, y: `11`, rx: `2`, ry: `2` }],
    [`path`, { d: `M7 11V7a5 5 0 0 1 10 0v4` }],
  ],
  _E = [
    [`path`, { d: `m16 17 5-5-5-5` }],
    [`path`, { d: `M21 12H9` }],
    [`path`, { d: `M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4` }],
  ],
  vE = [
    [`path`, { d: `m10 17 5-5-5-5` }],
    [`path`, { d: `M15 12H3` }],
    [`path`, { d: `M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4` }],
  ],
  yE = [
    [`path`, { d: `M3 5h1` }],
    [`path`, { d: `M3 12h1` }],
    [`path`, { d: `M3 19h1` }],
    [`path`, { d: `M8 5h1` }],
    [`path`, { d: `M8 12h1` }],
    [`path`, { d: `M8 19h1` }],
    [`path`, { d: `M13 5h8` }],
    [`path`, { d: `M13 12h8` }],
    [`path`, { d: `M13 19h8` }],
  ],
  bE = [
    [`circle`, { cx: `11`, cy: `11`, r: `8` }],
    [`path`, { d: `m21 21-4.3-4.3` }],
    [`path`, { d: `M11 11a2 2 0 0 0 4 0 4 4 0 0 0-8 0 6 6 0 0 0 12 0` }],
  ],
  xE = [
    [
      `path`,
      {
        d: `M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2`,
      },
    ],
    [`path`, { d: `M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14` }],
    [`path`, { d: `M10 20h4` }],
    [`circle`, { cx: `16`, cy: `20`, r: `2` }],
    [`circle`, { cx: `8`, cy: `20`, r: `2` }],
  ],
  SE = [
    [`path`, { d: `m12 15 4 4` }],
    [
      `path`,
      {
        d: `M2.352 10.648a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l6.029-6.029a1 1 0 1 1 3 3l-6.029 6.029a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l6.365-6.367A1 1 0 0 0 8.716 4.282z`,
      },
    ],
    [`path`, { d: `m5 8 4 4` }],
  ],
  CE = [
    [
      `path`,
      { d: `M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8` },
    ],
    [`path`, { d: `m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7` }],
    [`path`, { d: `m16 19 2 2 4-4` }],
  ],
  wE = [
    [
      `path`,
      { d: `M22 15V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8` },
    ],
    [`path`, { d: `m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7` }],
    [`path`, { d: `M16 19h6` }],
  ],
  TE = [
    [
      `path`,
      {
        d: `M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z`,
      },
    ],
    [`path`, { d: `m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10` }],
  ],
  EE = [
    [
      `path`,
      { d: `M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5` },
    ],
    [`path`, { d: `m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7` }],
    [
      `path`,
      {
        d: `M18 15.28c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2`,
      },
    ],
    [`path`, { d: `M20 22v.01` }],
  ],
  DE = [
    [
      `path`,
      { d: `M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8` },
    ],
    [`path`, { d: `m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7` }],
    [`path`, { d: `M19 16v6` }],
    [`path`, { d: `M16 19h6` }],
  ],
  OE = [
    [
      `path`,
      { d: `M22 12.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h7.5` },
    ],
    [`path`, { d: `m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7` }],
    [`path`, { d: `M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z` }],
    [`circle`, { cx: `18`, cy: `18`, r: `3` }],
    [`path`, { d: `m22 22-1.5-1.5` }],
  ],
  kE = [
    [
      `path`,
      { d: `M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5` },
    ],
    [`path`, { d: `m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7` }],
    [`path`, { d: `M20 14v4` }],
    [`path`, { d: `M20 22v.01` }],
  ],
  AE = [
    [
      `path`,
      { d: `M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9` },
    ],
    [`path`, { d: `m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7` }],
    [`path`, { d: `m17 17 4 4` }],
    [`path`, { d: `m21 17-4 4` }],
  ],
  jE = [
    [`path`, { d: `m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7` }],
    [`rect`, { x: `2`, y: `4`, width: `20`, height: `16`, rx: `2` }],
  ],
  ME = [
    [
      `path`,
      {
        d: `M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z`,
      },
    ],
    [`polyline`, { points: `15,9 18,9 18,11` }],
    [`path`, { d: `M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2` }],
    [`line`, { x1: `6`, x2: `7`, y1: `10`, y2: `10` }],
  ],
  NE = [
    [
      `path`,
      {
        d: `m11 19-1.106-.552a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0l4.212 2.106a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619V14`,
      },
    ],
    [`path`, { d: `M15 5.764V14` }],
    [`path`, { d: `M21 18h-6` }],
    [`path`, { d: `M9 3.236v15` }],
  ],
  PE = [
    [
      `path`,
      { d: `M17 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 1-1.732` },
    ],
    [`path`, { d: `m22 5.5-6.419 4.179a2 2 0 0 1-2.162 0L7 5.5` }],
    [`rect`, { x: `7`, y: `3`, width: `15`, height: `12`, rx: `2` }],
  ],
  FE = [
    [
      `path`,
      {
        d: `M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0`,
      },
    ],
    [`path`, { d: `m9 10 2 2 4-4` }],
  ],
  IE = [
    [
      `path`,
      {
        d: `M19.43 12.935c.357-.967.57-1.955.57-2.935a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32.197 32.197 0 0 0 .813-.728`,
      },
    ],
    [`circle`, { cx: `12`, cy: `10`, r: `3` }],
    [`path`, { d: `m16 18 2 2 4-4` }],
  ],
  LE = [
    [
      `path`,
      {
        d: `M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z`,
      },
    ],
    [
      `path`,
      {
        d: `M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2`,
      },
    ],
    [`path`, { d: `M18 22v-3` }],
    [`circle`, { cx: `10`, cy: `10`, r: `3` }],
  ],
  RE = [
    [
      `path`,
      {
        d: `M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0`,
      },
    ],
    [`path`, { d: `M9 10h6` }],
  ],
  zE = [
    [
      `path`,
      {
        d: `M18.977 14C19.6 12.701 20 11.343 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32 32 0 0 0 .824-.738`,
      },
    ],
    [`circle`, { cx: `12`, cy: `10`, r: `3` }],
    [`path`, { d: `M16 18h6` }],
  ],
  BE = [
    [`path`, { d: `M12.75 7.09a3 3 0 0 1 2.16 2.16` }],
    [
      `path`,
      {
        d: `M17.072 17.072c-1.634 2.17-3.527 3.912-4.471 4.727a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 1.432-4.568`,
      },
    ],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M8.475 2.818A8 8 0 0 1 20 10c0 1.183-.31 2.377-.81 3.533` }],
    [`path`, { d: `M9.13 9.13a3 3 0 0 0 3.74 3.74` }],
  ],
  VE = [
    [
      `path`,
      { d: `M17.97 9.304A8 8 0 0 0 2 10c0 4.69 4.887 9.562 7.022 11.468` },
    ],
    [
      `path`,
      {
        d: `M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z`,
      },
    ],
    [`circle`, { cx: `10`, cy: `10`, r: `3` }],
  ],
  HE = [
    [
      `path`,
      {
        d: `M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0`,
      },
    ],
    [`path`, { d: `M12 7v6` }],
    [`path`, { d: `M9 10h6` }],
  ],
  UE = [
    [
      `path`,
      {
        d: `M19.914 11.105A7.298 7.298 0 0 0 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32 32 0 0 0 .824-.738`,
      },
    ],
    [`circle`, { cx: `12`, cy: `10`, r: `3` }],
    [`path`, { d: `M16 18h6` }],
    [`path`, { d: `M19 15v6` }],
  ],
  WE = [
    [
      `path`,
      {
        d: `M 12.248 21.969 a 1 1 0 0 1 -0.849 -0.17 C 9.539 20.193 4 14.993 4 10 a 8 8 0 0 1 16 0 C 20 10.42 19.961 10.841 19.888 11.262`,
      },
    ],
    [`path`, { d: `m22 22-1.88-1.88` }],
    [`circle`, { cx: `12`, cy: `10`, r: `3` }],
    [`circle`, { cx: `18`, cy: `18`, r: `3` }],
  ],
  GE = [
    [
      `path`,
      {
        d: `M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0`,
      },
    ],
    [`path`, { d: `m14.5 7.5-5 5` }],
    [`path`, { d: `m9.5 7.5 5 5` }],
  ],
  KE = [
    [
      `path`,
      {
        d: `M19.752 11.901A7.78 7.78 0 0 0 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 19 19 0 0 0 .09-.077`,
      },
    ],
    [`circle`, { cx: `12`, cy: `10`, r: `3` }],
    [`path`, { d: `m21.5 15.5-5 5` }],
    [`path`, { d: `m21.5 20.5-5-5` }],
  ],
  qE = [
    [
      `path`,
      {
        d: `M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0`,
      },
    ],
    [`circle`, { cx: `12`, cy: `8`, r: `2` }],
    [
      `path`,
      {
        d: `M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712`,
      },
    ],
  ],
  JE = [
    [
      `path`,
      {
        d: `M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0`,
      },
    ],
    [`circle`, { cx: `12`, cy: `10`, r: `3` }],
  ],
  YE = [
    [
      `path`,
      {
        d: `m11 19-1.106-.552a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0l4.212 2.106a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619V12`,
      },
    ],
    [`path`, { d: `M15 5.764V12` }],
    [`path`, { d: `M18 15v6` }],
    [`path`, { d: `M21 18h-6` }],
    [`path`, { d: `M9 3.236v15` }],
  ],
  XE = [
    [
      `path`,
      {
        d: `M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z`,
      },
    ],
    [`path`, { d: `M15 5.764v15` }],
    [`path`, { d: `M9 3.236v15` }],
  ],
  ZE = [
    [`path`, { d: `m14 6 4 4` }],
    [`path`, { d: `M17 3h4v4` }],
    [`path`, { d: `m21 3-7.75 7.75` }],
    [`circle`, { cx: `9`, cy: `15`, r: `6` }],
  ],
  QE = [
    [`path`, { d: `M16 3h5v5` }],
    [`path`, { d: `m21 3-6.75 6.75` }],
    [`circle`, { cx: `10`, cy: `14`, r: `6` }],
  ],
  $E = [
    [
      `path`,
      {
        d: `M12 12 4.207 4.207A.707.707 0 0 1 4.707 3h14.586a.707.707 0 0 1 .5 1.207z`,
      },
    ],
    [`path`, { d: `M12 12v10` }],
    [`path`, { d: `M7 22h10` }],
  ],
  eD = [
    [`path`, { d: `M15 3h6v6` }],
    [`path`, { d: `m21 3-7 7` }],
    [`path`, { d: `m3 21 7-7` }],
    [`path`, { d: `M9 21H3v-6` }],
  ],
  tD = [
    [`path`, { d: `M8 3H5a2 2 0 0 0-2 2v3` }],
    [`path`, { d: `M21 8V5a2 2 0 0 0-2-2h-3` }],
    [`path`, { d: `M3 16v3a2 2 0 0 0 2 2h3` }],
    [`path`, { d: `M16 21h3a2 2 0 0 0 2-2v-3` }],
  ],
  nD = [
    [
      `path`,
      {
        d: `M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15`,
      },
    ],
    [`path`, { d: `M11 12 5.12 2.2` }],
    [`path`, { d: `m13 12 5.88-9.8` }],
    [`path`, { d: `M8 7h8` }],
    [`circle`, { cx: `12`, cy: `17`, r: `5` }],
    [`path`, { d: `M12 18v-2h-.5` }],
  ],
  rD = [
    [`path`, { d: `M11.636 6A13 13 0 0 0 19.4 3.2 1 1 0 0 1 21 4v11.344` }],
    [
      `path`,
      {
        d: `M14.378 14.357A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1`,
      },
    ],
    [`path`, { d: `m2 2 20 20` }],
    [
      `path`,
      { d: `M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14` },
    ],
    [`path`, { d: `M8 8v6` }],
  ],
  iD = [
    [
      `path`,
      {
        d: `M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z`,
      },
    ],
    [
      `path`,
      { d: `M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14` },
    ],
    [`path`, { d: `M8 6v8` }],
  ],
  aD = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`line`, { x1: `8`, x2: `16`, y1: `15`, y2: `15` }],
    [`line`, { x1: `9`, x2: `9.01`, y1: `9`, y2: `9` }],
    [`line`, { x1: `15`, x2: `15.01`, y1: `9`, y2: `9` }],
  ],
  oD = [
    [`path`, { d: `M4 5h16` }],
    [`path`, { d: `M4 12h16` }],
    [`path`, { d: `M4 19h16` }],
  ],
  sD = [
    [`path`, { d: `M12 12v-2` }],
    [`path`, { d: `M12 18v-2` }],
    [`path`, { d: `M16 12v-2` }],
    [`path`, { d: `M16 18v-2` }],
    [`path`, { d: `M2 11h1.5` }],
    [`path`, { d: `M20 18v-2` }],
    [`path`, { d: `M20.5 11H22` }],
    [`path`, { d: `M4 18v-2` }],
    [`path`, { d: `M8 12v-2` }],
    [`path`, { d: `M8 18v-2` }],
    [`rect`, { x: `2`, y: `6`, width: `20`, height: `10`, rx: `2` }],
  ],
  cD = [
    [`path`, { d: `m8 6 4-4 4 4` }],
    [`path`, { d: `M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22` }],
    [`path`, { d: `m20 22-5-5` }],
  ],
  lD = [
    [
      `path`,
      {
        d: `M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719`,
      },
    ],
    [`path`, { d: `m9 12 2 2 4-4` }],
  ],
  uD = [
    [`path`, { d: `M10.1 2.182a10 10 0 0 1 3.8 0` }],
    [`path`, { d: `M13.9 21.818a10 10 0 0 1-3.8 0` }],
    [`path`, { d: `M17.609 3.72a10 10 0 0 1 2.69 2.7` }],
    [`path`, { d: `M2.182 13.9a10 10 0 0 1 0-3.8` }],
    [`path`, { d: `M20.28 17.61a10 10 0 0 1-2.7 2.69` }],
    [`path`, { d: `M21.818 10.1a10 10 0 0 1 0 3.8` }],
    [`path`, { d: `M3.721 6.391a10 10 0 0 1 2.7-2.69` }],
    [`path`, { d: `m6.163 21.117-2.906.85a1 1 0 0 1-1.236-1.169l.965-2.98` }],
  ],
  dD = [
    [`path`, { d: `m10 9-3 3 3 3` }],
    [`path`, { d: `m14 15 3-3-3-3` }],
    [
      `path`,
      {
        d: `M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719`,
      },
    ],
  ],
  fD = [
    [
      `path`,
      {
        d: `M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719`,
      },
    ],
    [`path`, { d: `M8 12h.01` }],
    [`path`, { d: `M12 12h.01` }],
    [`path`, { d: `M16 12h.01` }],
  ],
  pD = [
    [
      `path`,
      {
        d: `M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719`,
      },
    ],
    [
      `path`,
      {
        d: `M7.828 13.07A3 3 0 0 1 12 8.764a3 3 0 0 1 5.004 2.224 3 3 0 0 1-.832 2.083l-3.447 3.62a1 1 0 0 1-1.45-.001z`,
      },
    ],
  ],
  mD = [
    [`path`, { d: `m2 2 20 20` }],
    [
      `path`,
      {
        d: `M4.93 4.929a10 10 0 0 0-1.938 11.412 2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 0 0 11.302-1.989`,
      },
    ],
    [`path`, { d: `M8.35 2.69A10 10 0 0 1 21.3 15.65` }],
  ],
  hD = [
    [
      `path`,
      {
        d: `M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719`,
      },
    ],
    [`path`, { d: `M8 12h8` }],
    [`path`, { d: `M12 8v8` }],
  ],
  gD = [
    [
      `path`,
      {
        d: `M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719`,
      },
    ],
    [`path`, { d: `M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3` }],
    [`path`, { d: `M12 17h.01` }],
  ],
  _D = [
    [
      `path`,
      {
        d: `M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719`,
      },
    ],
    [`path`, { d: `m10 15-3-3 3-3` }],
    [`path`, { d: `M7 12h8a2 2 0 0 1 2 2v1` }],
  ],
  vD = [
    [
      `path`,
      {
        d: `M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719`,
      },
    ],
    [`path`, { d: `M12 8v4` }],
    [`path`, { d: `M12 16h.01` }],
  ],
  yD = [
    [
      `path`,
      {
        d: `M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719`,
      },
    ],
    [`path`, { d: `m15 9-6 6` }],
    [`path`, { d: `m9 9 6 6` }],
  ],
  bD = [
    [
      `path`,
      {
        d: `M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719`,
      },
    ],
  ],
  xD = [
    [
      `path`,
      {
        d: `M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.7.7 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z`,
      },
    ],
    [`path`, { d: `m9 11 2 2 4-4` }],
  ],
  SD = [
    [
      `path`,
      {
        d: `M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z`,
      },
    ],
    [`path`, { d: `m10 8-3 3 3 3` }],
    [`path`, { d: `m14 14 3-3-3-3` }],
  ],
  CD = [
    [`path`, { d: `M14 3h2` }],
    [`path`, { d: `M16 19h-2` }],
    [`path`, { d: `M2 12v-2` }],
    [`path`, { d: `M2 16v5.286a.71.71 0 0 0 1.212.502l1.149-1.149` }],
    [`path`, { d: `M20 19a2 2 0 0 0 2-2v-1` }],
    [`path`, { d: `M22 10v2` }],
    [`path`, { d: `M22 6V5a2 2 0 0 0-2-2` }],
    [`path`, { d: `M4 3a2 2 0 0 0-2 2v1` }],
    [`path`, { d: `M8 19h2` }],
    [`path`, { d: `M8 3h2` }],
  ],
  wD = [
    [
      `path`,
      {
        d: `M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z`,
      },
    ],
    [`path`, { d: `M10 15h4` }],
    [`path`, { d: `M10 9h4` }],
    [`path`, { d: `M12 7v4` }],
  ],
  TD = [
    [
      `path`,
      {
        d: `M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z`,
      },
    ],
    [
      `path`,
      {
        d: `M7.5 9.5c0 .687.265 1.383.697 1.844l3.009 3.264a1.14 1.14 0 0 0 .407.314 1 1 0 0 0 .783-.004 1.14 1.14 0 0 0 .398-.31l3.008-3.264A2.77 2.77 0 0 0 16.5 9.5 2.5 2.5 0 0 0 12 8a2.5 2.5 0 0 0-4.5 1.5`,
      },
    ],
  ],
  ED = [
    [
      `path`,
      {
        d: `M12.7 3H4a2 2 0 0 0-2 2v16.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H20a2 2 0 0 0 2-2v-4.7`,
      },
    ],
    [`circle`, { cx: `19`, cy: `6`, r: `3` }],
  ],
  DD = [
    [
      `path`,
      {
        d: `M22 8.5V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H10`,
      },
    ],
    [`path`, { d: `M20 15v-2a2 2 0 0 0-4 0v2` }],
    [`rect`, { x: `14`, y: `15`, width: `8`, height: `5`, rx: `1` }],
  ],
  OD = [
    [
      `path`,
      {
        d: `M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z`,
      },
    ],
    [`path`, { d: `M12 11h.01` }],
    [`path`, { d: `M16 11h.01` }],
    [`path`, { d: `M8 11h.01` }],
  ],
  kD = [
    [
      `path`,
      {
        d: `M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z`,
      },
    ],
    [`path`, { d: `M12 8v6` }],
    [`path`, { d: `M9 11h6` }],
  ],
  AD = [
    [
      `path`,
      {
        d: `M19 19H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.7.7 0 0 1 2 21.286V5a2 2 0 0 1 1.184-1.826`,
      },
    ],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M8.656 3H20a2 2 0 0 1 2 2v11.344` }],
  ],
  jD = [
    [`path`, { d: `M14 14a2 2 0 0 0 2-2V8h-2` }],
    [
      `path`,
      {
        d: `M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z`,
      },
    ],
    [`path`, { d: `M8 14a2 2 0 0 0 2-2V8H8` }],
  ],
  MD = [
    [
      `path`,
      {
        d: `M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z`,
      },
    ],
    [`path`, { d: `m10 8-3 3 3 3` }],
    [`path`, { d: `M17 14v-1a2 2 0 0 0-2-2H7` }],
  ],
  ND = [
    [
      `path`,
      {
        d: `M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z`,
      },
    ],
    [`path`, { d: `M7 11h10` }],
    [`path`, { d: `M7 15h6` }],
    [`path`, { d: `M7 7h8` }],
  ],
  PD = [
    [
      `path`,
      {
        d: `M12 3H4a2 2 0 0 0-2 2v16.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H20a2 2 0 0 0 2-2v-4`,
      },
    ],
    [`path`, { d: `M16 3h6v6` }],
    [`path`, { d: `m16 9 6-6` }],
  ],
  FD = [
    [
      `path`,
      {
        d: `M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z`,
      },
    ],
    [`path`, { d: `M12 15h.01` }],
    [`path`, { d: `M12 7v4` }],
  ],
  ID = [
    [
      `path`,
      {
        d: `M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z`,
      },
    ],
    [`path`, { d: `m14.5 8.5-5 5` }],
    [`path`, { d: `m9.5 8.5 5 5` }],
  ],
  LD = [
    [
      `path`,
      {
        d: `M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z`,
      },
    ],
  ],
  RD = [
    [`path`, { d: `M12 11.4V9.1` }],
    [`path`, { d: `m12 17 6.59-6.59` }],
    [
      `path`,
      {
        d: `m15.05 5.7-.218-.691a3 3 0 0 0-5.663 0L4.418 19.695A1 1 0 0 0 5.37 21h13.253a1 1 0 0 0 .951-1.31L18.45 16.2`,
      },
    ],
    [`circle`, { cx: `20`, cy: `9`, r: `2` }],
  ],
  zD = [
    [
      `path`,
      {
        d: `M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z`,
      },
    ],
    [
      `path`,
      {
        d: `M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1`,
      },
    ],
  ],
  BD = [
    [`path`, { d: `M12 19v3` }],
    [`path`, { d: `M15 9.34V5a3 3 0 0 0-5.68-1.33` }],
    [`path`, { d: `M16.95 16.95A7 7 0 0 1 5 12v-2` }],
    [`path`, { d: `M18.89 13.23A7 7 0 0 0 19 12v-2` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M9 9v3a3 3 0 0 0 5.12 2.12` }],
  ],
  VD = [
    [
      `path`,
      {
        d: `m11 7.601-5.994 8.19a1 1 0 0 0 .1 1.298l.817.818a1 1 0 0 0 1.314.087L15.09 12`,
      },
    ],
    [
      `path`,
      {
        d: `M16.5 21.174C15.5 20.5 14.372 20 13 20c-2.058 0-3.928 2.356-6 2-2.072-.356-2.775-3.369-1.5-4.5`,
      },
    ],
    [`circle`, { cx: `16`, cy: `7`, r: `5` }],
  ],
  HD = [
    [`path`, { d: `M12 19v3` }],
    [`path`, { d: `M19 10v2a7 7 0 0 1-14 0v-2` }],
    [`rect`, { x: `9`, y: `2`, width: `6`, height: `13`, rx: `3` }],
  ],
  UD = [
    [`path`, { d: `M6 18h8` }],
    [`path`, { d: `M3 22h18` }],
    [`path`, { d: `M14 22a7 7 0 1 0 0-14h-1` }],
    [`path`, { d: `M9 14h2` }],
    [`path`, { d: `M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z` }],
    [`path`, { d: `M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3` }],
  ],
  WD = [
    [`path`, { d: `M10 12h4` }],
    [`path`, { d: `M10 17h4` }],
    [`path`, { d: `M10 7h4` }],
    [`path`, { d: `M18 12h2` }],
    [`path`, { d: `M18 18h2` }],
    [`path`, { d: `M18 6h2` }],
    [`path`, { d: `M4 12h2` }],
    [`path`, { d: `M4 18h2` }],
    [`path`, { d: `M4 6h2` }],
    [`rect`, { x: `6`, y: `2`, width: `12`, height: `20`, rx: `2` }],
  ],
  GD = [
    [`rect`, { width: `20`, height: `15`, x: `2`, y: `4`, rx: `2` }],
    [`rect`, { width: `8`, height: `7`, x: `6`, y: `8`, rx: `1` }],
    [`path`, { d: `M18 8v7` }],
    [`path`, { d: `M6 19v2` }],
    [`path`, { d: `M18 19v2` }],
  ],
  KD = [
    [`path`, { d: `M12 13v8` }],
    [`path`, { d: `M12 3v3` }],
    [
      `path`,
      {
        d: `M18.172 6a2 2 0 0 1 1.414.586l2.06 2.06a1.207 1.207 0 0 1 0 1.708l-2.06 2.06a2 2 0 0 1-1.414.586H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z`,
      },
    ],
  ],
  qD = [
    [`path`, { d: `M8 2h8` }],
    [
      `path`,
      {
        d: `M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2`,
      },
    ],
    [`path`, { d: `M7 15a6.472 6.472 0 0 1 5 0 6.47 6.47 0 0 0 5 0` }],
  ],
  JD = [
    [`path`, { d: `M8 2h8` }],
    [
      `path`,
      {
        d: `M9 2v1.343M15 2v2.789a4 4 0 0 0 .672 2.219l.656.984a4 4 0 0 1 .672 2.22v1.131M7.8 7.8l-.128.192A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3`,
      },
    ],
    [`path`, { d: `M7 15a6.47 6.47 0 0 1 5 0 6.472 6.472 0 0 0 3.435.435` }],
    [`line`, { x1: `2`, x2: `22`, y1: `2`, y2: `22` }],
  ],
  YD = [
    [`path`, { d: `m14 10 7-7` }],
    [`path`, { d: `M20 10h-6V4` }],
    [`path`, { d: `m3 21 7-7` }],
    [`path`, { d: `M4 14h6v6` }],
  ],
  XD = [[`path`, { d: `M5 12h14` }]],
  ZD = [
    [`path`, { d: `M8 3v3a2 2 0 0 1-2 2H3` }],
    [`path`, { d: `M21 8h-3a2 2 0 0 1-2-2V3` }],
    [`path`, { d: `M3 16h3a2 2 0 0 1 2 2v3` }],
    [`path`, { d: `M16 21v-3a2 2 0 0 1 2-2h3` }],
  ],
  QD = [
    [`path`, { d: `M11 6 8 9` }],
    [`path`, { d: `m16 7-8 8` }],
    [`rect`, { x: `4`, y: `2`, width: `16`, height: `20`, rx: `2` }],
  ],
  $D = [
    [`path`, { d: `M10 6.6 8.6 8` }],
    [`path`, { d: `M12 18v4` }],
    [`path`, { d: `M15 7.5 9.5 13` }],
    [`path`, { d: `M7 22h10` }],
    [`circle`, { cx: `12`, cy: `10`, r: `8` }],
  ],
  eO = [
    [`path`, { d: `m9 10 2 2 4-4` }],
    [`rect`, { width: `20`, height: `14`, x: `2`, y: `3`, rx: `2` }],
    [`path`, { d: `M12 17v4` }],
    [`path`, { d: `M8 21h8` }],
  ],
  tO = [
    [`path`, { d: `M12 17v4` }],
    [`path`, { d: `m14.305 7.53.923-.382` }],
    [`path`, { d: `m15.228 4.852-.923-.383` }],
    [`path`, { d: `m16.852 3.228-.383-.924` }],
    [`path`, { d: `m16.852 8.772-.383.923` }],
    [`path`, { d: `m19.148 3.228.383-.924` }],
    [`path`, { d: `m19.53 9.696-.382-.924` }],
    [`path`, { d: `m20.772 4.852.924-.383` }],
    [`path`, { d: `m20.772 7.148.924.383` }],
    [`path`, { d: `M22 13v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7` }],
    [`path`, { d: `M8 21h8` }],
    [`circle`, { cx: `18`, cy: `6`, r: `3` }],
  ],
  nO = [
    [`path`, { d: `M11 13a3 3 0 1 1 2.83-4H14a2 2 0 0 1 0 4z` }],
    [`path`, { d: `M12 17v4` }],
    [`path`, { d: `M8 21h8` }],
    [`rect`, { x: `2`, y: `3`, width: `20`, height: `14`, rx: `2` }],
  ],
  rO = [
    [`path`, { d: `M12 17v4` }],
    [
      `path`,
      {
        d: `M22 12.307V15a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8.693`,
      },
    ],
    [`path`, { d: `M8 21h8` }],
    [`circle`, { cx: `19`, cy: `6`, r: `3` }],
  ],
  iO = [
    [`path`, { d: `M12 13V7` }],
    [`path`, { d: `m15 10-3 3-3-3` }],
    [`rect`, { width: `20`, height: `14`, x: `2`, y: `3`, rx: `2` }],
    [`path`, { d: `M12 17v4` }],
    [`path`, { d: `M8 21h8` }],
  ],
  aO = [
    [`path`, { d: `M12 17v4` }],
    [`path`, { d: `M17 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 1.184-1.826` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M8 21h8` }],
    [`path`, { d: `M8.656 3H20a2 2 0 0 1 2 2v10a2 2 0 0 1-.293 1.042` }],
  ],
  oO = [
    [`path`, { d: `M10 13V7` }],
    [`path`, { d: `M14 13V7` }],
    [`rect`, { width: `20`, height: `14`, x: `2`, y: `3`, rx: `2` }],
    [`path`, { d: `M12 17v4` }],
    [`path`, { d: `M8 21h8` }],
  ],
  sO = [
    [
      `path`,
      {
        d: `M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z`,
      },
    ],
    [`path`, { d: `M12 17v4` }],
    [`path`, { d: `M8 21h8` }],
    [`rect`, { x: `2`, y: `3`, width: `20`, height: `14`, rx: `2` }],
  ],
  cO = [
    [`path`, { d: `M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8` }],
    [`path`, { d: `M10 19v-3.96 3.15` }],
    [`path`, { d: `M7 19h5` }],
    [`rect`, { width: `6`, height: `10`, x: `16`, y: `12`, rx: `2` }],
  ],
  lO = [
    [`path`, { d: `M5.5 20H8` }],
    [`path`, { d: `M17 9h.01` }],
    [`rect`, { width: `10`, height: `16`, x: `12`, y: `4`, rx: `2` }],
    [`path`, { d: `M8 6H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4` }],
    [`circle`, { cx: `17`, cy: `15`, r: `1` }],
  ],
  uO = [
    [`path`, { d: `M12 17v4` }],
    [`path`, { d: `M8 21h8` }],
    [`rect`, { x: `2`, y: `3`, width: `20`, height: `14`, rx: `2` }],
    [`rect`, { x: `9`, y: `7`, width: `6`, height: `6`, rx: `1` }],
  ],
  dO = [
    [`path`, { d: `m9 10 3-3 3 3` }],
    [`path`, { d: `M12 13V7` }],
    [`rect`, { width: `20`, height: `14`, x: `2`, y: `3`, rx: `2` }],
    [`path`, { d: `M12 17v4` }],
    [`path`, { d: `M8 21h8` }],
  ],
  fO = [
    [`path`, { d: `m14.5 12.5-5-5` }],
    [`path`, { d: `m9.5 12.5 5-5` }],
    [`rect`, { width: `20`, height: `14`, x: `2`, y: `3`, rx: `2` }],
    [`path`, { d: `M12 17v4` }],
    [`path`, { d: `M8 21h8` }],
  ],
  pO = [
    [`rect`, { width: `20`, height: `14`, x: `2`, y: `3`, rx: `2` }],
    [`line`, { x1: `8`, x2: `16`, y1: `21`, y2: `21` }],
    [`line`, { x1: `12`, x2: `12`, y1: `17`, y2: `21` }],
  ],
  mO = [
    [
      `path`,
      {
        d: `M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401`,
      },
    ],
  ],
  hO = [
    [`path`, { d: `M18 5h4` }],
    [`path`, { d: `M20 3v4` }],
    [
      `path`,
      {
        d: `M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401`,
      },
    ],
  ],
  gO = [
    [`path`, { d: `m18 14-1-3` }],
    [`path`, { d: `m3 9 6 2a2 2 0 0 1 2-2h2a2 2 0 0 1 1.99 1.81` }],
    [
      `path`,
      {
        d: `M8 17h3a1 1 0 0 0 1-1 6 6 0 0 1 6-6 1 1 0 0 0 1-1v-.75A5 5 0 0 0 17 5`,
      },
    ],
    [`circle`, { cx: `19`, cy: `17`, r: `3` }],
    [`circle`, { cx: `5`, cy: `17`, r: `3` }],
  ],
  _O = [
    [`path`, { d: `m8 3 4 8 5-5 5 15H2L8 3z` }],
    [
      `path`,
      { d: `M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19` },
    ],
  ],
  vO = [[`path`, { d: `m8 3 4 8 5-5 5 15H2L8 3z` }]],
  yO = [
    [`path`, { d: `M12 7.318V10` }],
    [`path`, { d: `M5 10v5a7 7 0 0 0 14 0V9c0-3.527-2.608-6.515-6-7` }],
    [`circle`, { cx: `7`, cy: `4`, r: `2` }],
  ],
  bO = [
    [`path`, { d: `M12 6v.343` }],
    [`path`, { d: `M18.218 18.218A7 7 0 0 1 5 15V9a7 7 0 0 1 .782-3.218` }],
    [`path`, { d: `M19 13.343V9A7 7 0 0 0 8.56 2.902` }],
    [`path`, { d: `M22 22 2 2` }],
  ],
  xO = [
    [
      `path`,
      {
        d: `m15.55 8.45 5.138 2.087a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063L8.45 15.551`,
      },
    ],
    [`path`, { d: `M22 2 2 22` }],
    [
      `path`,
      { d: `m6.816 11.528-2.779-6.84a.495.495 0 0 1 .651-.651l6.84 2.779` },
    ],
  ],
  SO = [
    [
      `path`,
      {
        d: `M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z`,
      },
    ],
  ],
  CO = [
    [
      `path`,
      {
        d: `M2.034 2.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.944L8.204 7.545a1 1 0 0 0-.66.66l-1.066 3.443a.5.5 0 0 1-.944.033z`,
      },
    ],
    [`circle`, { cx: `16`, cy: `16`, r: `6` }],
    [`path`, { d: `m11.8 11.8 8.4 8.4` }],
  ],
  wO = [
    [`path`, { d: `M14 4.1 12 6` }],
    [`path`, { d: `m5.1 8-2.9-.8` }],
    [`path`, { d: `m6 12-1.9 2` }],
    [`path`, { d: `M7.2 2.2 8 5.1` }],
    [
      `path`,
      {
        d: `M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z`,
      },
    ],
  ],
  TO = [
    [`path`, { d: `M12.586 12.586 19 19` }],
    [
      `path`,
      {
        d: `M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z`,
      },
    ],
  ],
  EO = [
    [`path`, { d: `M12 7.318V10` }],
    [`path`, { d: `M19 10v5a7 7 0 0 1-14 0V9c0-3.527 2.608-6.515 6-7` }],
    [`circle`, { cx: `17`, cy: `4`, r: `2` }],
  ],
  DO = [
    [`rect`, { x: `5`, y: `2`, width: `14`, height: `20`, rx: `7` }],
    [`path`, { d: `M12 6v4` }],
  ],
  OO = [
    [`path`, { d: `M5 3v16h16` }],
    [`path`, { d: `m5 19 6-6` }],
    [`path`, { d: `m2 6 3-3 3 3` }],
    [`path`, { d: `m18 16 3 3-3 3` }],
  ],
  kO = [
    [`path`, { d: `M19 13v6h-6` }],
    [`path`, { d: `M5 11V5h6` }],
    [`path`, { d: `m5 5 14 14` }],
  ],
  AO = [
    [`path`, { d: `M11 19H5v-6` }],
    [`path`, { d: `M13 5h6v6` }],
    [`path`, { d: `M19 5 5 19` }],
  ],
  jO = [
    [`path`, { d: `M11 19H5V13` }],
    [`path`, { d: `M19 5L5 19` }],
  ],
  MO = [
    [`path`, { d: `M19 13V19H13` }],
    [`path`, { d: `M5 5L19 19` }],
  ],
  NO = [
    [`path`, { d: `M8 18L12 22L16 18` }],
    [`path`, { d: `M12 2V22` }],
  ],
  PO = [
    [`path`, { d: `m18 8 4 4-4 4` }],
    [`path`, { d: `M2 12h20` }],
    [`path`, { d: `m6 8-4 4 4 4` }],
  ],
  FO = [
    [`path`, { d: `M6 8L2 12L6 16` }],
    [`path`, { d: `M2 12H22` }],
  ],
  IO = [
    [`path`, { d: `M18 8L22 12L18 16` }],
    [`path`, { d: `M2 12H22` }],
  ],
  LO = [
    [`path`, { d: `M5 11V5H11` }],
    [`path`, { d: `M5 5L19 19` }],
  ],
  RO = [
    [`path`, { d: `M13 5H19V11` }],
    [`path`, { d: `M19 5L5 19` }],
  ],
  zO = [
    [`path`, { d: `M8 6L12 2L16 6` }],
    [`path`, { d: `M12 2V22` }],
  ],
  BO = [
    [`path`, { d: `M12 2v20` }],
    [`path`, { d: `m8 18 4 4 4-4` }],
    [`path`, { d: `m8 6 4-4 4 4` }],
  ],
  VO = [
    [`path`, { d: `M12 2v20` }],
    [`path`, { d: `m15 19-3 3-3-3` }],
    [`path`, { d: `m19 9 3 3-3 3` }],
    [`path`, { d: `M2 12h20` }],
    [`path`, { d: `m5 9-3 3 3 3` }],
    [`path`, { d: `m9 5 3-3 3 3` }],
  ],
  HO = [
    [`circle`, { cx: `8`, cy: `18`, r: `4` }],
    [`path`, { d: `M12 18V2l7 4` }],
  ],
  UO = [
    [`circle`, { cx: `12`, cy: `18`, r: `4` }],
    [`path`, { d: `M16 18V2` }],
  ],
  WO = [
    [`path`, { d: `M9 18V5l12-2v13` }],
    [`path`, { d: `m9 9 12-2` }],
    [`circle`, { cx: `6`, cy: `18`, r: `3` }],
    [`circle`, { cx: `18`, cy: `16`, r: `3` }],
  ],
  GO = [
    [`path`, { d: `M9 18V5l12-2v13` }],
    [`circle`, { cx: `6`, cy: `18`, r: `3` }],
    [`circle`, { cx: `18`, cy: `16`, r: `3` }],
  ],
  KO = [
    [`path`, { d: `M9.31 9.31 5 21l7-4 7 4-1.17-3.17` }],
    [`path`, { d: `M14.53 8.88 12 2l-1.17 3.17` }],
    [`line`, { x1: `2`, x2: `22`, y1: `2`, y2: `22` }],
  ],
  qO = [[`polygon`, { points: `12 2 19 21 12 17 5 21 12 2` }]],
  JO = [
    [`path`, { d: `M8.43 8.43 3 11l8 2 2 8 2.57-5.43` }],
    [`path`, { d: `M17.39 11.73 22 2l-9.73 4.61` }],
    [`line`, { x1: `2`, x2: `22`, y1: `2`, y2: `22` }],
  ],
  YO = [[`polygon`, { points: `3 11 22 2 13 21 11 13 3 11` }]],
  XO = [
    [`rect`, { x: `16`, y: `16`, width: `6`, height: `6`, rx: `1` }],
    [`rect`, { x: `2`, y: `16`, width: `6`, height: `6`, rx: `1` }],
    [`rect`, { x: `9`, y: `2`, width: `6`, height: `6`, rx: `1` }],
    [`path`, { d: `M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3` }],
    [`path`, { d: `M12 12V8` }],
  ],
  ZO = [
    [`path`, { d: `M15 18h-5` }],
    [`path`, { d: `M18 14h-8` }],
    [
      `path`,
      {
        d: `M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2`,
      },
    ],
    [`rect`, { width: `8`, height: `4`, x: `10`, y: `6`, rx: `1` }],
  ],
  QO = [
    [`path`, { d: `M6 8.32a7.43 7.43 0 0 1 0 7.36` }],
    [`path`, { d: `M9.46 6.21a11.76 11.76 0 0 1 0 11.58` }],
    [`path`, { d: `M12.91 4.1a15.91 15.91 0 0 1 .01 15.8` }],
    [`path`, { d: `M16.37 2a20.16 20.16 0 0 1 0 20` }],
  ],
  $O = [
    [`path`, { d: `M12 2v10` }],
    [`path`, { d: `m8.5 4 7 4` }],
    [`path`, { d: `m8.5 8 7-4` }],
    [`circle`, { cx: `12`, cy: `17`, r: `5` }],
  ],
  ek = [
    [
      `path`,
      { d: `M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4` },
    ],
    [`path`, { d: `M2 6h4` }],
    [`path`, { d: `M2 10h4` }],
    [`path`, { d: `M2 14h4` }],
    [`path`, { d: `M2 18h4` }],
    [
      `path`,
      {
        d: `M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z`,
      },
    ],
  ],
  tk = [
    [`path`, { d: `M2 6h4` }],
    [`path`, { d: `M2 10h4` }],
    [`path`, { d: `M2 14h4` }],
    [`path`, { d: `M2 18h4` }],
    [`rect`, { width: `16`, height: `20`, x: `4`, y: `2`, rx: `2` }],
    [`path`, { d: `M15 2v20` }],
    [`path`, { d: `M15 7h5` }],
    [`path`, { d: `M15 12h5` }],
    [`path`, { d: `M15 17h5` }],
  ],
  nk = [
    [`path`, { d: `M2 6h4` }],
    [`path`, { d: `M2 10h4` }],
    [`path`, { d: `M2 14h4` }],
    [`path`, { d: `M2 18h4` }],
    [`rect`, { width: `16`, height: `20`, x: `4`, y: `2`, rx: `2` }],
    [`path`, { d: `M9.5 8h5` }],
    [`path`, { d: `M9.5 12H16` }],
    [`path`, { d: `M9.5 16H14` }],
  ],
  rk = [
    [`path`, { d: `M2 6h4` }],
    [`path`, { d: `M2 10h4` }],
    [`path`, { d: `M2 14h4` }],
    [`path`, { d: `M2 18h4` }],
    [`rect`, { width: `16`, height: `20`, x: `4`, y: `2`, rx: `2` }],
    [`path`, { d: `M16 2v20` }],
  ],
  ik = [
    [`path`, { d: `M8 2v4` }],
    [`path`, { d: `M12 2v4` }],
    [`path`, { d: `M16 2v4` }],
    [`path`, { d: `M16 4h2a2 2 0 0 1 2 2v2` }],
    [`path`, { d: `M20 12v2` }],
    [`path`, { d: `M20 18v2a2 2 0 0 1-2 2h-1` }],
    [`path`, { d: `M13 22h-2` }],
    [`path`, { d: `M7 22H6a2 2 0 0 1-2-2v-2` }],
    [`path`, { d: `M4 14v-2` }],
    [`path`, { d: `M4 8V6a2 2 0 0 1 2-2h2` }],
    [`path`, { d: `M8 10h6` }],
    [`path`, { d: `M8 14h8` }],
    [`path`, { d: `M8 18h5` }],
  ],
  ak = [
    [`path`, { d: `M8 2v4` }],
    [`path`, { d: `M12 2v4` }],
    [`path`, { d: `M16 2v4` }],
    [`rect`, { width: `16`, height: `18`, x: `4`, y: `4`, rx: `2` }],
    [`path`, { d: `M8 10h6` }],
    [`path`, { d: `M8 14h8` }],
    [`path`, { d: `M8 18h5` }],
  ],
  ok = [
    [`path`, { d: `M12 4V2` }],
    [
      `path`,
      {
        d: `M5 10v4a7.004 7.004 0 0 0 5.277 6.787c.412.104.802.292 1.102.592L12 22l.621-.621c.3-.3.69-.488 1.102-.592a7.01 7.01 0 0 0 4.125-2.939`,
      },
    ],
    [`path`, { d: `M19 10v3.343` }],
    [
      `path`,
      {
        d: `M12 12c-1.349-.573-1.905-1.005-2.5-2-.546.902-1.048 1.353-2.5 2-1.018-.644-1.46-1.08-2-2-1.028.71-1.69.918-3 1 1.081-1.048 1.757-2.03 2-3 .194-.776.84-1.551 1.79-2.21m11.654 5.997c.887-.457 1.28-.891 1.556-1.787 1.032.916 1.683 1.157 3 1-1.297-1.036-1.758-2.03-2-3-.5-2-4-4-8-4-.74 0-1.461.068-2.15.192`,
      },
    ],
    [`line`, { x1: `2`, x2: `22`, y1: `2`, y2: `22` }],
  ],
  sk = [
    [`path`, { d: `M12 4V2` }],
    [
      `path`,
      {
        d: `M5 10v4a7.004 7.004 0 0 0 5.277 6.787c.412.104.802.292 1.102.592L12 22l.621-.621c.3-.3.69-.488 1.102-.592A7.003 7.003 0 0 0 19 14v-4`,
      },
    ],
    [
      `path`,
      {
        d: `M12 4C8 4 4.5 6 4 8c-.243.97-.919 1.952-2 3 1.31-.082 1.972-.29 3-1 .54.92.982 1.356 2 2 1.452-.647 1.954-1.098 2.5-2 .595.995 1.151 1.427 2.5 2 1.31-.621 1.862-1.058 2.5-2 .629.977 1.162 1.423 2.5 2 1.209-.548 1.68-.967 2-2 1.032.916 1.683 1.157 3 1-1.297-1.036-1.758-2.03-2-3-.5-2-4-4-8-4Z`,
      },
    ],
  ],
  ck = [
    [`path`, { d: `M12 16h.01` }],
    [`path`, { d: `M12 8v4` }],
    [
      `path`,
      {
        d: `M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z`,
      },
    ],
  ],
  lk = [
    [
      `path`,
      {
        d: `M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z`,
      },
    ],
    [`path`, { d: `M8 12h8` }],
  ],
  uk = [
    [`path`, { d: `M10 15V9` }],
    [`path`, { d: `M14 15V9` }],
    [
      `path`,
      {
        d: `M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z`,
      },
    ],
  ],
  dk = [
    [`path`, { d: `m15 9-6 6` }],
    [
      `path`,
      {
        d: `M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z`,
      },
    ],
    [`path`, { d: `m9 9 6 6` }],
  ],
  fk = [
    [
      `path`,
      {
        d: `M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z`,
      },
    ],
  ],
  pk = [
    [
      `path`,
      {
        d: `M3 20h4.5a.5.5 0 0 0 .5-.5v-.282a.52.52 0 0 0-.247-.437 8 8 0 1 1 8.494-.001.52.52 0 0 0-.247.438v.282a.5.5 0 0 0 .5.5H21`,
      },
    ],
  ],
  mk = [
    [`path`, { d: `M3 3h6l6 18h6` }],
    [`path`, { d: `M14 3h7` }],
  ],
  hk = [
    [`path`, { d: `M20.341 6.484A10 10 0 0 1 10.266 21.85` }],
    [`path`, { d: `M3.659 17.516A10 10 0 0 1 13.74 2.152` }],
    [`circle`, { cx: `12`, cy: `12`, r: `3` }],
    [`circle`, { cx: `19`, cy: `5`, r: `2` }],
    [`circle`, { cx: `5`, cy: `19`, r: `2` }],
  ],
  gk = [
    [
      `path`,
      { d: `M12 12V4a1 1 0 0 1 1-1h6.297a1 1 0 0 1 .651 1.759l-4.696 4.025` },
    ],
    [
      `path`,
      {
        d: `m12 21-7.414-7.414A2 2 0 0 1 4 12.172V6.415a1.002 1.002 0 0 1 1.707-.707L20 20.009`,
      },
    ],
    [
      `path`,
      {
        d: `m12.214 3.381 8.414 14.966a1 1 0 0 1-.167 1.199l-1.168 1.163a1 1 0 0 1-.706.291H6.351a1 1 0 0 1-.625-.219L3.25 18.8a1 1 0 0 1 .631-1.781l4.165.027`,
      },
    ],
  ],
  _k = [
    [`path`, { d: `M12 3v6` }],
    [
      `path`,
      {
        d: `M16.76 3a2 2 0 0 1 1.8 1.1l2.23 4.479a2 2 0 0 1 .21.891V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.472a2 2 0 0 1 .211-.894L5.45 4.1A2 2 0 0 1 7.24 3z`,
      },
    ],
    [`path`, { d: `M3.054 9.013h17.893` }],
  ],
  vk = [
    [`path`, { d: `M12 22V12` }],
    [`path`, { d: `m16 17 2 2 4-4` }],
    [
      `path`,
      {
        d: `M21 11.127V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l1.32-.753`,
      },
    ],
    [`path`, { d: `M3.29 7 12 12l8.71-5` }],
    [`path`, { d: `m7.5 4.27 8.997 5.148` }],
  ],
  yk = [
    [`path`, { d: `M12 22V12` }],
    [`path`, { d: `M16 17h6` }],
    [
      `path`,
      {
        d: `M21 13V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l1.675-.955`,
      },
    ],
    [`path`, { d: `M3.29 7 12 12l8.71-5` }],
    [`path`, { d: `m7.5 4.27 8.997 5.148` }],
  ],
  bk = [
    [`path`, { d: `M12 22v-9` }],
    [
      `path`,
      {
        d: `M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z`,
      },
    ],
    [
      `path`,
      {
        d: `M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13`,
      },
    ],
    [
      `path`,
      {
        d: `M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z`,
      },
    ],
  ],
  xk = [
    [`path`, { d: `M12 22V12` }],
    [`path`, { d: `M16 17h6` }],
    [`path`, { d: `M19 14v6` }],
    [
      `path`,
      {
        d: `M21 10.535V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l1.675-.955`,
      },
    ],
    [`path`, { d: `M3.29 7 12 12l8.71-5` }],
    [`path`, { d: `m7.5 4.27 8.997 5.148` }],
  ],
  Sk = [
    [`path`, { d: `M12 22V12` }],
    [`path`, { d: `M20.27 18.27 22 20` }],
    [
      `path`,
      {
        d: `M21 10.498V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l.98-.559`,
      },
    ],
    [`path`, { d: `M3.29 7 12 12l8.71-5` }],
    [`path`, { d: `m7.5 4.27 8.997 5.148` }],
    [`circle`, { cx: `18.5`, cy: `16.5`, r: `2.5` }],
  ],
  Ck = [
    [`path`, { d: `M12 22V12` }],
    [`path`, { d: `m16.5 14.5 5 5` }],
    [`path`, { d: `m16.5 19.5 5-5` }],
    [
      `path`,
      {
        d: `M21 10.5V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l.13-.074`,
      },
    ],
    [`path`, { d: `M3.29 7 12 12l8.71-5` }],
    [`path`, { d: `m7.5 4.27 8.997 5.148` }],
  ],
  wk = [
    [`path`, { d: `M11 7 6 2` }],
    [`path`, { d: `M18.992 12H2.041` }],
    [
      `path`,
      {
        d: `M21.145 18.38A3.34 3.34 0 0 1 20 16.5a3.3 3.3 0 0 1-1.145 1.88c-.575.46-.855 1.02-.855 1.595A2 2 0 0 0 20 22a2 2 0 0 0 2-2.025c0-.58-.285-1.13-.855-1.595`,
      },
    ],
    [
      `path`,
      {
        d: `m8.5 4.5 2.148-2.148a1.205 1.205 0 0 1 1.704 0l7.296 7.296a1.205 1.205 0 0 1 0 1.704l-7.592 7.592a3.615 3.615 0 0 1-5.112 0l-3.888-3.888a3.615 3.615 0 0 1 0-5.112L5.67 7.33`,
      },
    ],
  ],
  Tk = [
    [`rect`, { width: `16`, height: `6`, x: `2`, y: `2`, rx: `2` }],
    [
      `path`,
      { d: `M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2` },
    ],
    [`rect`, { width: `4`, height: `6`, x: `8`, y: `16`, rx: `1` }],
  ],
  Ek = [
    [
      `path`,
      {
        d: `M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z`,
      },
    ],
    [`path`, { d: `M12 22V12` }],
    [`polyline`, { points: `3.29 7 12 12 20.71 7` }],
    [`path`, { d: `m7.5 4.27 9 5.15` }],
  ],
  Dk = [
    [`path`, { d: `M10 2v2` }],
    [`path`, { d: `M14 2v4` }],
    [`path`, { d: `M17 2a1 1 0 0 1 1 1v9H6V3a1 1 0 0 1 1-1z` }],
    [
      `path`,
      {
        d: `M6 12a1 1 0 0 0-1 1v1a2 2 0 0 0 2 2h2a1 1 0 0 1 1 1v2.9a2 2 0 1 0 4 0V17a1 1 0 0 1 1-1h2a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1`,
      },
    ],
  ],
  Ok = [
    [
      `path`,
      {
        d: `M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z`,
      },
    ],
    [`circle`, { cx: `13.5`, cy: `6.5`, r: `.5`, fill: `currentColor` }],
    [`circle`, { cx: `17.5`, cy: `10.5`, r: `.5`, fill: `currentColor` }],
    [`circle`, { cx: `6.5`, cy: `12.5`, r: `.5`, fill: `currentColor` }],
    [`circle`, { cx: `8.5`, cy: `7.5`, r: `.5`, fill: `currentColor` }],
  ],
  kk = [
    [`path`, { d: `M11.25 17.25h1.5L12 18z` }],
    [`path`, { d: `m15 12 2 2` }],
    [`path`, { d: `M18 6.5a.5.5 0 0 0-.5-.5` }],
    [
      `path`,
      {
        d: `M20.69 9.67a4.5 4.5 0 1 0-7.04-5.5 8.35 8.35 0 0 0-3.3 0 4.5 4.5 0 1 0-7.04 5.5C2.49 11.2 2 12.88 2 14.5 2 19.47 6.48 22 12 22s10-2.53 10-7.5c0-1.62-.48-3.3-1.3-4.83`,
      },
    ],
    [`path`, { d: `M6 6.5a.495.495 0 0 1 .5-.5` }],
    [`path`, { d: `m9 12-2 2` }],
  ],
  Ak = [
    [`path`, { d: `m14.622 17.897-10.68-2.913` }],
    [
      `path`,
      {
        d: `M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z`,
      },
    ],
    [
      `path`,
      {
        d: `M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15`,
      },
    ],
  ],
  jk = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M3 15h18` }],
    [`path`, { d: `m15 8-3 3-3-3` }],
  ],
  Mk = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M14 15h1` }],
    [`path`, { d: `M19 15h2` }],
    [`path`, { d: `M3 15h2` }],
    [`path`, { d: `M9 15h1` }],
  ],
  Nk = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M3 15h18` }],
  ],
  Pk = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M3 15h18` }],
    [`path`, { d: `m9 10 3-3 3 3` }],
  ],
  Fk = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M9 3v18` }],
    [`path`, { d: `m16 15-3-3 3-3` }],
  ],
  Ik = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M9 14v1` }],
    [`path`, { d: `M9 19v2` }],
    [`path`, { d: `M9 3v2` }],
    [`path`, { d: `M9 9v1` }],
  ],
  Lk = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M9 3v18` }],
    [`path`, { d: `m14 9 3 3-3 3` }],
  ],
  Rk = [
    [`path`, { d: `M15 10V9` }],
    [`path`, { d: `M15 15v-1` }],
    [`path`, { d: `M15 21v-2` }],
    [`path`, { d: `M15 5V3` }],
    [`path`, { d: `M9 10V9` }],
    [`path`, { d: `M9 15v-1` }],
    [`path`, { d: `M9 21v-2` }],
    [`path`, { d: `M9 5V3` }],
    [`rect`, { x: `3`, y: `3`, width: `18`, height: `18`, rx: `2` }],
  ],
  zk = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M9 3v18` }],
  ],
  Bk = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M15 14v1` }],
    [`path`, { d: `M15 19v2` }],
    [`path`, { d: `M15 3v2` }],
    [`path`, { d: `M15 9v1` }],
  ],
  Vk = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M15 3v18` }],
    [`path`, { d: `m8 9 3 3-3 3` }],
  ],
  Hk = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M15 3v18` }],
    [`path`, { d: `m10 15-3-3 3-3` }],
  ],
  Uk = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M3 9h18` }],
    [`path`, { d: `m9 16 3-3 3 3` }],
  ],
  Wk = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M15 3v18` }],
  ],
  Gk = [
    [`path`, { d: `M14 15h1` }],
    [`path`, { d: `M14 9h1` }],
    [`path`, { d: `M19 15h2` }],
    [`path`, { d: `M19 9h2` }],
    [`path`, { d: `M3 15h2` }],
    [`path`, { d: `M3 9h2` }],
    [`path`, { d: `M9 15h1` }],
    [`path`, { d: `M9 9h1` }],
    [`rect`, { x: `3`, y: `3`, width: `18`, height: `18`, rx: `2` }],
  ],
  Kk = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M14 9h1` }],
    [`path`, { d: `M19 9h2` }],
    [`path`, { d: `M3 9h2` }],
    [`path`, { d: `M9 9h1` }],
  ],
  qk = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M3 9h18` }],
    [`path`, { d: `m15 14-3 3-3-3` }],
  ],
  Jk = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M3 9h18` }],
  ],
  Yk = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M9 3v18` }],
    [`path`, { d: `M9 15h12` }],
  ],
  Xk = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M3 15h12` }],
    [`path`, { d: `M15 3v18` }],
  ],
  Zk = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M3 9h18` }],
    [`path`, { d: `M9 21V9` }],
  ],
  Qk = [
    [
      `path`,
      {
        d: `m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551`,
      },
    ],
  ],
  $k = [
    [`path`, { d: `M12.5 11.134 18.196 21` }],
    [
      `path`,
      {
        d: `M20.425 5.299a10 10 0 0 0-16.941 9.78c.183.563.843.774 1.355.478L20.16 6.711c.512-.296.66-.973.264-1.413`,
      },
    ],
    [`path`, { d: `M21 21H3` }],
  ],
  eA = [
    [`path`, { d: `M8 21s-4-3-4-9 4-9 4-9` }],
    [`path`, { d: `M16 3s4 3 4 9-4 9-4 9` }],
  ],
  tA = [
    [`path`, { d: `M11 15h2` }],
    [`path`, { d: `M12 12v3` }],
    [`path`, { d: `M12 19v3` }],
    [
      `path`,
      {
        d: `M15.282 19a1 1 0 0 0 .948-.68l2.37-6.988a7 7 0 1 0-13.2 0l2.37 6.988a1 1 0 0 0 .948.68z`,
      },
    ],
    [`path`, { d: `M9 9a3 3 0 1 1 6 0` }],
  ],
  nA = [
    [`path`, { d: `M5.8 11.3 2 22l10.7-3.79` }],
    [`path`, { d: `M4 3h.01` }],
    [`path`, { d: `M22 8h.01` }],
    [`path`, { d: `M15 2h.01` }],
    [`path`, { d: `M22 20h.01` }],
    [
      `path`,
      {
        d: `m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10`,
      },
    ],
    [
      `path`,
      {
        d: `m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17`,
      },
    ],
    [
      `path`,
      { d: `m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7` },
    ],
    [
      `path`,
      {
        d: `M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z`,
      },
    ],
  ],
  rA = [
    [`rect`, { x: `14`, y: `3`, width: `5`, height: `18`, rx: `1` }],
    [`rect`, { x: `5`, y: `3`, width: `5`, height: `18`, rx: `1` }],
  ],
  iA = [
    [`circle`, { cx: `11`, cy: `4`, r: `2` }],
    [`circle`, { cx: `18`, cy: `8`, r: `2` }],
    [`circle`, { cx: `20`, cy: `16`, r: `2` }],
    [
      `path`,
      {
        d: `M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z`,
      },
    ],
  ],
  aA = [
    [`rect`, { width: `14`, height: `20`, x: `5`, y: `2`, rx: `2` }],
    [`path`, { d: `M15 14h.01` }],
    [`path`, { d: `M9 6h6` }],
    [`path`, { d: `M9 10h6` }],
  ],
  oA = [
    [`path`, { d: `M13 21h8` }],
    [
      `path`,
      {
        d: `M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`,
      },
    ],
  ],
  sA = [
    [
      `path`,
      {
        d: `M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z`,
      },
    ],
    [
      `path`,
      {
        d: `m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18`,
      },
    ],
    [`path`, { d: `m2.3 2.3 7.286 7.286` }],
    [`circle`, { cx: `11`, cy: `11`, r: `2` }],
  ],
  cA = [
    [
      `path`,
      {
        d: `m10 10-6.157 6.162a2 2 0 0 0-.5.833l-1.322 4.36a.5.5 0 0 0 .622.624l4.358-1.323a2 2 0 0 0 .83-.5L14 13.982`,
      },
    ],
    [
      `path`,
      { d: `m12.829 7.172 4.359-4.346a1 1 0 1 1 3.986 3.986l-4.353 4.353` },
    ],
    [`path`, { d: `m2 2 20 20` }],
  ],
  lA = [
    [
      `path`,
      {
        d: `M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`,
      },
    ],
  ],
  uA = [
    [`path`, { d: `M13 21h8` }],
    [`path`, { d: `m15 5 4 4` }],
    [
      `path`,
      {
        d: `M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`,
      },
    ],
  ],
  dA = [
    [
      `path`,
      {
        d: `m10 10-6.157 6.162a2 2 0 0 0-.5.833l-1.322 4.36a.5.5 0 0 0 .622.624l4.358-1.323a2 2 0 0 0 .83-.5L14 13.982`,
      },
    ],
    [
      `path`,
      { d: `m12.829 7.172 4.359-4.346a1 1 0 1 1 3.986 3.986l-4.353 4.353` },
    ],
    [`path`, { d: `m15 5 4 4` }],
    [`path`, { d: `m2 2 20 20` }],
  ],
  fA = [
    [
      `path`,
      {
        d: `M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13`,
      },
    ],
    [`path`, { d: `m8 6 2-2` }],
    [`path`, { d: `m18 16 2-2` }],
    [
      `path`,
      {
        d: `m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17`,
      },
    ],
    [
      `path`,
      {
        d: `M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`,
      },
    ],
    [`path`, { d: `m15 5 4 4` }],
  ],
  pA = [
    [
      `path`,
      {
        d: `M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`,
      },
    ],
    [`path`, { d: `m15 5 4 4` }],
  ],
  mA = [
    [`line`, { x1: `19`, x2: `5`, y1: `5`, y2: `19` }],
    [`circle`, { cx: `6.5`, cy: `6.5`, r: `2.5` }],
    [`circle`, { cx: `17.5`, cy: `17.5`, r: `2.5` }],
  ],
  hA = [
    [
      `path`,
      {
        d: `M10.83 2.38a2 2 0 0 1 2.34 0l8 5.74a2 2 0 0 1 .73 2.25l-3.04 9.26a2 2 0 0 1-1.9 1.37H7.04a2 2 0 0 1-1.9-1.37L2.1 10.37a2 2 0 0 1 .73-2.25z`,
      },
    ],
  ],
  gA = [
    [`circle`, { cx: `12`, cy: `5`, r: `1` }],
    [`path`, { d: `m9 20 3-6 3 6` }],
    [`path`, { d: `m6 8 6 2 6-2` }],
    [`path`, { d: `M12 10v4` }],
  ],
  _A = [
    [`path`, { d: `M20 11H4` }],
    [`path`, { d: `M20 7H4` }],
    [`path`, { d: `M7 21V4a1 1 0 0 1 1-1h4a1 1 0 0 1 0 12H7` }],
  ],
  vA = [
    [`path`, { d: `M13 2a9 9 0 0 1 9 9` }],
    [`path`, { d: `M13 6a5 5 0 0 1 5 5` }],
    [
      `path`,
      {
        d: `M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384`,
      },
    ],
  ],
  yA = [
    [`path`, { d: `M14 6h8` }],
    [`path`, { d: `m18 2 4 4-4 4` }],
    [
      `path`,
      {
        d: `M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384`,
      },
    ],
  ],
  bA = [
    [`path`, { d: `M16 2v6h6` }],
    [`path`, { d: `m22 2-6 6` }],
    [
      `path`,
      {
        d: `M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384`,
      },
    ],
  ],
  xA = [
    [`path`, { d: `m16 2 6 6` }],
    [`path`, { d: `m22 2-6 6` }],
    [
      `path`,
      {
        d: `M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384`,
      },
    ],
  ],
  SA = [
    [
      `path`,
      {
        d: `M10.1 13.9a14 14 0 0 0 3.732 2.668 1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2 18 18 0 0 1-12.728-5.272`,
      },
    ],
    [`path`, { d: `M22 2 2 22` }],
    [
      `path`,
      {
        d: `M4.76 13.582A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 .244.473`,
      },
    ],
  ],
  CA = [
    [`path`, { d: `m16 8 6-6` }],
    [`path`, { d: `M22 8V2h-6` }],
    [
      `path`,
      {
        d: `M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384`,
      },
    ],
  ],
  wA = [
    [
      `path`,
      {
        d: `M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384`,
      },
    ],
  ],
  TA = [
    [`line`, { x1: `9`, x2: `9`, y1: `4`, y2: `20` }],
    [`path`, { d: `M4 7c0-1.7 1.3-3 3-3h13` }],
    [`path`, { d: `M18 20c-1.7 0-3-1.3-3-3V4` }],
  ],
  EA = [
    [
      `path`,
      {
        d: `M18.5 8c-1.4 0-2.6-.8-3.2-2A6.87 6.87 0 0 0 2 9v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8.5C22 9.6 20.4 8 18.5 8`,
      },
    ],
    [`path`, { d: `M2 14h20` }],
    [`path`, { d: `M6 14v4` }],
    [`path`, { d: `M10 14v4` }],
    [`path`, { d: `M14 14v4` }],
    [`path`, { d: `M18 14v4` }],
  ],
  DA = [
    [`path`, { d: `m14 13-8.381 8.38a1 1 0 0 1-3.001-3L11 9.999` }],
    [
      `path`,
      {
        d: `M15.973 4.027A13 13 0 0 0 5.902 2.373c-1.398.342-1.092 2.158.277 2.601a19.9 19.9 0 0 1 5.822 3.024`,
      },
    ],
    [
      `path`,
      {
        d: `M16.001 11.999a19.9 19.9 0 0 1 3.024 5.824c.444 1.369 2.26 1.676 2.603.278A13 13 0 0 0 20 8.069`,
      },
    ],
    [
      `path`,
      {
        d: `M18.352 3.352a1.205 1.205 0 0 0-1.704 0l-5.296 5.296a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l5.296-5.296a1.205 1.205 0 0 0 0-1.704z`,
      },
    ],
  ],
  OA = [
    [`path`, { d: `M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h4` }],
    [`rect`, { width: `10`, height: `7`, x: `12`, y: `13`, rx: `2` }],
  ],
  kA = [
    [`path`, { d: `M2 10h6V4` }],
    [`path`, { d: `m2 4 6 6` }],
    [`path`, { d: `M21 10V7a2 2 0 0 0-2-2h-7` }],
    [`path`, { d: `M3 14v2a2 2 0 0 0 2 2h3` }],
    [`rect`, { x: `12`, y: `14`, width: `10`, height: `7`, rx: `1` }],
  ],
  AA = [
    [
      `path`,
      {
        d: `M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z`,
      },
    ],
    [`path`, { d: `M16 10h.01` }],
    [`path`, { d: `M2 8v1a2 2 0 0 0 2 2h1` }],
  ],
  jA = [
    [`path`, { d: `M14 3v11` }],
    [`path`, { d: `M14 9h-3a3 3 0 0 1 0-6h9` }],
    [`path`, { d: `M18 3v11` }],
    [`path`, { d: `M22 18H2l4-4` }],
    [`path`, { d: `m6 22-4-4` }],
  ],
  MA = [
    [`path`, { d: `M13 4v16` }],
    [`path`, { d: `M17 4v16` }],
    [`path`, { d: `M19 4H9.5a4.5 4.5 0 0 0 0 9H13` }],
  ],
  NA = [
    [`path`, { d: `M10 3v11` }],
    [`path`, { d: `M10 9H7a1 1 0 0 1 0-6h8` }],
    [`path`, { d: `M14 3v11` }],
    [`path`, { d: `m18 14 4 4H2` }],
    [`path`, { d: `m22 18-4 4` }],
  ],
  PA = [
    [`path`, { d: `M18 11h-4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4` }],
    [`path`, { d: `M6 7v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7` }],
    [`rect`, { width: `16`, height: `5`, x: `4`, y: `2`, rx: `1` }],
  ],
  FA = [
    [
      `path`,
      { d: `m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z` },
    ],
    [`path`, { d: `m8.5 8.5 7 7` }],
  ],
  IA = [
    [`path`, { d: `M12 17v5` }],
    [`path`, { d: `M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89` }],
    [`path`, { d: `m2 2 20 20` }],
    [
      `path`,
      {
        d: `M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11`,
      },
    ],
  ],
  LA = [
    [`path`, { d: `M12 17v5` }],
    [
      `path`,
      {
        d: `M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z`,
      },
    ],
  ],
  RA = [
    [
      `path`,
      {
        d: `m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12`,
      },
    ],
    [
      `path`,
      {
        d: `m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z`,
      },
    ],
    [`path`, { d: `m2 22 .414-.414` }],
  ],
  zA = [
    [`path`, { d: `m12 14-1 1` }],
    [`path`, { d: `m13.75 18.25-1.25 1.42` }],
    [`path`, { d: `M17.775 5.654a15.68 15.68 0 0 0-12.121 12.12` }],
    [`path`, { d: `M18.8 9.3a1 1 0 0 0 2.1 7.7` }],
    [
      `path`,
      {
        d: `M21.964 20.732a1 1 0 0 1-1.232 1.232l-18-5a1 1 0 0 1-.695-1.232A19.68 19.68 0 0 1 15.732 2.037a1 1 0 0 1 1.232.695z`,
      },
    ],
  ],
  BA = [
    [`path`, { d: `M2 22h20` }],
    [
      `path`,
      {
        d: `M3.77 10.77 2 9l2-4.5 1.1.55c.55.28.9.84.9 1.45s.35 1.17.9 1.45L8 8.5l3-6 1.05.53a2 2 0 0 1 1.09 1.52l.72 5.4a2 2 0 0 0 1.09 1.52l4.4 2.2c.42.22.78.55 1.01.96l.6 1.03c.49.88-.06 1.98-1.06 2.1l-1.18.15c-.47.06-.95-.02-1.37-.24L4.29 11.15a2 2 0 0 1-.52-.38Z`,
      },
    ],
  ],
  VA = [
    [`path`, { d: `M2 22h20` }],
    [
      `path`,
      {
        d: `M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z`,
      },
    ],
  ],
  HA = [
    [
      `path`,
      {
        d: `M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z`,
      },
    ],
  ],
  UA = [
    [
      `path`,
      {
        d: `M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z`,
      },
    ],
  ],
  WA = [
    [`path`, { d: `M9 2v6` }],
    [`path`, { d: `M15 2v6` }],
    [`path`, { d: `M12 17v5` }],
    [`path`, { d: `M5 8h14` }],
    [`path`, { d: `M6 11V8h12v3a6 6 0 1 1-12 0Z` }],
  ],
  GA = [
    [`path`, { d: `M12 22v-5` }],
    [`path`, { d: `M15 8V2` }],
    [
      `path`,
      {
        d: `M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z`,
      },
    ],
    [`path`, { d: `M9 8V2` }],
  ],
  KA = [
    [`path`, { d: `M5 12h14` }],
    [`path`, { d: `M12 5v14` }],
  ],
  qA = [
    [
      `path`,
      {
        d: `M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z`,
      },
    ],
    [`path`, { d: `m2 22 3-3` }],
    [`path`, { d: `M7.5 13.5 10 11` }],
    [`path`, { d: `M10.5 16.5 13 14` }],
    [`path`, { d: `m18 3-4 4h6l-4 4` }],
  ],
  JA = [
    [`path`, { d: `M3 2v1c0 1 2 1 2 2S3 6 3 7s2 1 2 2-2 1-2 2 2 1 2 2` }],
    [`path`, { d: `M18 6h.01` }],
    [`path`, { d: `M6 18h.01` }],
    [
      `path`,
      { d: `M20.83 8.83a4 4 0 0 0-5.66-5.66l-12 12a4 4 0 1 0 5.66 5.66Z` },
    ],
    [`path`, { d: `M18 11.66V22a4 4 0 0 0 4-4V6` }],
  ],
  YA = [
    [`path`, { d: `M10 4.5V4a2 2 0 0 0-2.41-1.957` }],
    [`path`, { d: `M13.9 8.4a2 2 0 0 0-1.26-1.295` }],
    [
      `path`,
      {
        d: `M21.7 16.2A8 8 0 0 0 22 14v-3a2 2 0 1 0-4 0v-1a2 2 0 0 0-3.63-1.158`,
      },
    ],
    [
      `path`,
      {
        d: `m7 15-1.8-1.8a2 2 0 0 0-2.79 2.86L6 19.7a7.74 7.74 0 0 0 6 2.3h2a8 8 0 0 0 5.657-2.343`,
      },
    ],
    [`path`, { d: `M6 6v8` }],
    [`path`, { d: `m2 2 20 20` }],
  ],
  XA = [
    [
      `path`,
      {
        d: `M13 17a1 1 0 1 0-2 0l.5 4.5a0.5 0.5 0 0 0 1 0z`,
        fill: `currentColor`,
      },
    ],
    [`path`, { d: `M16.85 18.58a9 9 0 1 0-9.7 0` }],
    [`path`, { d: `M8 14a5 5 0 1 1 8 0` }],
    [`circle`, { cx: `12`, cy: `11`, r: `1`, fill: `currentColor` }],
  ],
  ZA = [
    [`path`, { d: `M22 14a8 8 0 0 1-8 8` }],
    [`path`, { d: `M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2` }],
    [`path`, { d: `M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1` }],
    [`path`, { d: `M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10` }],
    [
      `path`,
      {
        d: `M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15`,
      },
    ],
  ],
  QA = [
    [
      `path`,
      {
        d: `M18 8a2 2 0 0 0 0-4 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0 0 4`,
      },
    ],
    [`path`, { d: `M10 22 9 8` }],
    [`path`, { d: `m14 22 1-14` }],
    [
      `path`,
      {
        d: `M20 8c.5 0 .9.4.8 1l-2.6 12c-.1.5-.7 1-1.2 1H7c-.6 0-1.1-.4-1.2-1L3.2 9c-.1-.6.3-1 .8-1Z`,
      },
    ],
  ],
  $A = [
    [
      `path`,
      {
        d: `M18.6 14.4c.8-.8.8-2 0-2.8l-8.1-8.1a4.95 4.95 0 1 0-7.1 7.1l8.1 8.1c.9.7 2.1.7 2.9-.1Z`,
      },
    ],
    [`path`, { d: `m22 22-5.5-5.5` }],
  ],
  ej = [
    [`path`, { d: `M18 7c0-5.333-8-5.333-8 0` }],
    [`path`, { d: `M10 7v14` }],
    [`path`, { d: `M6 21h12` }],
    [`path`, { d: `M6 13h10` }],
  ],
  tj = [
    [`path`, { d: `M18.36 6.64A9 9 0 0 1 20.77 15` }],
    [`path`, { d: `M6.16 6.16a9 9 0 1 0 12.68 12.68` }],
    [`path`, { d: `M12 2v4` }],
    [`path`, { d: `m2 2 20 20` }],
  ],
  nj = [
    [`path`, { d: `M12 2v10` }],
    [`path`, { d: `M18.4 6.6a9 9 0 1 1-12.77.04` }],
  ],
  rj = [
    [`path`, { d: `M2 3h20` }],
    [`path`, { d: `M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3` }],
    [`path`, { d: `m7 21 5-5 5 5` }],
  ],
  ij = [
    [
      `path`,
      { d: `M13.5 22H7a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v.5` },
    ],
    [`path`, { d: `m16 19 2 2 4-4` }],
    [
      `path`,
      { d: `M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2` },
    ],
    [`path`, { d: `M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6` }],
  ],
  aj = [
    [`path`, { d: `M12.531 22H7a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h6.377` }],
    [`path`, { d: `m16.5 16.5 5 5` }],
    [`path`, { d: `m16.5 21.5 5-5` }],
    [
      `path`,
      { d: `M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.5` },
    ],
    [`path`, { d: `M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6` }],
  ],
  oj = [
    [
      `path`,
      {
        d: `M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2`,
      },
    ],
    [`path`, { d: `M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6` }],
    [`rect`, { x: `6`, y: `14`, width: `12`, height: `8`, rx: `1` }],
  ],
  sj = [
    [`path`, { d: `M5 7 3 5` }],
    [`path`, { d: `M9 6V3` }],
    [`path`, { d: `m13 7 2-2` }],
    [`circle`, { cx: `9`, cy: `13`, r: `3` }],
    [
      `path`,
      {
        d: `M11.83 12H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2.17`,
      },
    ],
    [`path`, { d: `M16 16h2` }],
  ],
  cj = [
    [`rect`, { width: `20`, height: `16`, x: `2`, y: `4`, rx: `2` }],
    [`path`, { d: `M12 9v11` }],
    [`path`, { d: `M2 9h13a2 2 0 0 1 2 2v9` }],
  ],
  lj = [
    [
      `path`,
      {
        d: `M2.5 16.88a1 1 0 0 1-.32-1.43l9-13.02a1 1 0 0 1 1.64 0l9 13.01a1 1 0 0 1-.32 1.44l-8.51 4.86a2 2 0 0 1-1.98 0Z`,
      },
    ],
    [`path`, { d: `M12 2v20` }],
  ],
  uj = [
    [
      `path`,
      {
        d: `M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z`,
      },
    ],
  ],
  dj = [
    [
      `path`,
      {
        d: `M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z`,
      },
    ],
    [
      `path`,
      {
        d: `M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z`,
      },
    ],
  ],
  fj = [
    [`rect`, { width: `5`, height: `5`, x: `3`, y: `3`, rx: `1` }],
    [`rect`, { width: `5`, height: `5`, x: `16`, y: `3`, rx: `1` }],
    [`rect`, { width: `5`, height: `5`, x: `3`, y: `16`, rx: `1` }],
    [`path`, { d: `M21 16h-3a2 2 0 0 0-2 2v3` }],
    [`path`, { d: `M21 21v.01` }],
    [`path`, { d: `M12 7v3a2 2 0 0 1-2 2H7` }],
    [`path`, { d: `M3 12h.01` }],
    [`path`, { d: `M12 3h.01` }],
    [`path`, { d: `M12 16v.01` }],
    [`path`, { d: `M16 12h1` }],
    [`path`, { d: `M21 12v.01` }],
    [`path`, { d: `M12 21v-1` }],
  ],
  pj = [
    [`path`, { d: `M13 16a3 3 0 0 1 2.24 5` }],
    [`path`, { d: `M18 12h.01` }],
    [
      `path`,
      {
        d: `M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3`,
      },
    ],
    [`path`, { d: `M20 8.54V4a2 2 0 1 0-4 0v3` }],
    [`path`, { d: `M7.612 12.524a3 3 0 1 0-1.6 4.3` }],
  ],
  mj = [
    [`path`, { d: `M19.07 4.93A10 10 0 0 0 6.99 3.34` }],
    [`path`, { d: `M4 6h.01` }],
    [`path`, { d: `M2.29 9.62A10 10 0 1 0 21.31 8.35` }],
    [`path`, { d: `M16.24 7.76A6 6 0 1 0 8.23 16.67` }],
    [`path`, { d: `M12 18h.01` }],
    [`path`, { d: `M17.99 11.66A6 6 0 0 1 15.77 16.67` }],
    [`circle`, { cx: `12`, cy: `12`, r: `2` }],
    [`path`, { d: `m13.41 10.59 5.66-5.66` }],
  ],
  hj = [
    [`path`, { d: `M12 12h.01` }],
    [
      `path`,
      {
        d: `M14 15.4641a4 4 0 0 1-4 0L7.52786 19.74597 A 1 1 0 0 0 7.99303 21.16211 10 10 0 0 0 16.00697 21.16211 1 1 0 0 0 16.47214 19.74597z`,
      },
    ],
    [
      `path`,
      {
        d: `M16 12a4 4 0 0 0-2-3.464l2.472-4.282a1 1 0 0 1 1.46-.305 10 10 0 0 1 4.006 6.94A1 1 0 0 1 21 12z`,
      },
    ],
    [
      `path`,
      {
        d: `M8 12a4 4 0 0 1 2-3.464L7.528 4.254a1 1 0 0 0-1.46-.305 10 10 0 0 0-4.006 6.94A1 1 0 0 0 3 12z`,
      },
    ],
  ],
  gj = [
    [`path`, { d: `M13.414 13.414a2 2 0 1 1-2.828-2.828` }],
    [`path`, { d: `M16.247 7.761a6 6 0 0 1 1.744 4.572` }],
    [`path`, { d: `M19.075 4.933a10 10 0 0 1 2.234 10.72` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M4.925 19.067a10 10 0 0 1 0-14.134` }],
    [`path`, { d: `M7.753 16.239a6 6 0 0 1 0-8.478` }],
  ],
  _j = [
    [
      `path`,
      {
        d: `M3 12h3.28a1 1 0 0 1 .948.684l2.298 7.934a.5.5 0 0 0 .96-.044L13.82 4.771A1 1 0 0 1 14.792 4H21`,
      },
    ],
  ],
  vj = [
    [`path`, { d: `M5 16v2` }],
    [`path`, { d: `M19 16v2` }],
    [`rect`, { width: `20`, height: `8`, x: `2`, y: `8`, rx: `2` }],
    [`path`, { d: `M18 12h.01` }],
  ],
  yj = [
    [`path`, { d: `M4.9 16.1C1 12.2 1 5.8 4.9 1.9` }],
    [`path`, { d: `M7.8 4.7a6.14 6.14 0 0 0-.8 7.5` }],
    [`circle`, { cx: `12`, cy: `9`, r: `2` }],
    [`path`, { d: `M16.2 4.8c2 2 2.26 5.11.8 7.47` }],
    [`path`, { d: `M19.1 1.9a9.96 9.96 0 0 1 0 14.1` }],
    [`path`, { d: `M9.5 18h5` }],
    [`path`, { d: `m8 22 4-11 4 11` }],
  ],
  bj = [
    [`path`, { d: `M16.247 7.761a6 6 0 0 1 0 8.478` }],
    [`path`, { d: `M19.075 4.933a10 10 0 0 1 0 14.134` }],
    [`path`, { d: `M4.925 19.067a10 10 0 0 1 0-14.134` }],
    [`path`, { d: `M7.753 16.239a6 6 0 0 1 0-8.478` }],
    [`circle`, { cx: `12`, cy: `12`, r: `2` }],
  ],
  xj = [
    [`path`, { d: `M20.34 17.52a10 10 0 1 0-2.82 2.82` }],
    [`circle`, { cx: `19`, cy: `19`, r: `2` }],
    [`path`, { d: `m13.41 13.41 4.18 4.18` }],
    [`circle`, { cx: `12`, cy: `12`, r: `2` }],
  ],
  Sj = [
    [`path`, { d: `M22 17a10 10 0 0 0-20 0` }],
    [`path`, { d: `M6 17a6 6 0 0 1 12 0` }],
    [`path`, { d: `M10 17a2 2 0 0 1 4 0` }],
  ],
  Cj = [
    [`path`, { d: `M13 22H4a2 2 0 0 1 0-4h12` }],
    [`path`, { d: `M13.236 18a3 3 0 0 0-2.2-5` }],
    [`path`, { d: `M16 9h.01` }],
    [
      `path`,
      {
        d: `M16.82 3.94a3 3 0 1 1 3.237 4.868l1.815 2.587a1.5 1.5 0 0 1-1.5 2.1l-2.872-.453a3 3 0 0 0-3.5 3`,
      },
    ],
    [
      `path`,
      { d: `M17 4.988a3 3 0 1 0-5.2 2.052A7 7 0 0 0 4 14.015 4 4 0 0 0 8 18` },
    ],
  ],
  wj = [
    [`path`, { d: `M12 7v10` }],
    [
      `path`,
      {
        d: `M14.828 14.829a4 4 0 0 1-5.656 0 4 4 0 0 1 0-5.657 4 4 0 0 1 5.656 0`,
      },
    ],
    [
      `path`,
      {
        d: `M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z`,
      },
    ],
  ],
  Tj = [
    [`rect`, { width: `12`, height: `20`, x: `6`, y: `2`, rx: `2` }],
    [`rect`, { width: `20`, height: `12`, x: `2`, y: `6`, rx: `2` }],
  ],
  Ej = [
    [
      `path`,
      {
        d: `M15.828 14.829a4 4 0 0 1-5.656 0 4 4 0 0 1 0-5.657 4 4 0 0 1 5.656 0`,
      },
    ],
    [
      `path`,
      {
        d: `M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z`,
      },
    ],
    [`path`, { d: `M8 12h5` }],
  ],
  Dj = [
    [`path`, { d: `m12 10 3-3` }],
    [
      `path`,
      {
        d: `M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z`,
      },
    ],
    [`path`, { d: `M9 11h6` }],
    [`path`, { d: `M9 15h6` }],
    [`path`, { d: `m9 7 3 3v7` }],
  ],
  Oj = [
    [
      `path`,
      {
        d: `M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z`,
      },
    ],
    [`path`, { d: `M8 11h8` }],
    [`path`, { d: `M8 7h8` }],
    [`path`, { d: `M9 7a4 4 0 0 1 0 8H8l3 2` }],
  ],
  kj = [
    [`path`, { d: `M10 17V9.5a1 1 0 0 1 5 0` }],
    [
      `path`,
      {
        d: `M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z`,
      },
    ],
    [`path`, { d: `M8 13h5` }],
    [`path`, { d: `M8 17h7` }],
  ],
  Aj = [
    [
      `path`,
      {
        d: `M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z`,
      },
    ],
    [`path`, { d: `M8 11h5a2 2 0 0 0 0-4h-3v10` }],
    [`path`, { d: `M8 15h5` }],
  ],
  jj = [
    [`path`, { d: `M10 11h4` }],
    [`path`, { d: `M10 17V7h5` }],
    [
      `path`,
      {
        d: `M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z`,
      },
    ],
    [`path`, { d: `M8 15h5` }],
  ],
  Mj = [
    [`path`, { d: `M12 17V7` }],
    [`path`, { d: `M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8` }],
    [
      `path`,
      {
        d: `M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z`,
      },
    ],
  ],
  Nj = [
    [`path`, { d: `M13 16H8` }],
    [`path`, { d: `M14 8H8` }],
    [`path`, { d: `M16 12H8` }],
    [
      `path`,
      {
        d: `M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z`,
      },
    ],
  ],
  Pj = [
    [`path`, { d: `M10 7v10a5 5 0 0 0 5-5` }],
    [`path`, { d: `m14 8-6 3` }],
    [
      `path`,
      {
        d: `M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z`,
      },
    ],
  ],
  Fj = [
    [`path`, { d: `M14 4v16H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z` }],
    [`circle`, { cx: `14`, cy: `12`, r: `8` }],
  ],
  Ij = [
    [`rect`, { width: `20`, height: `12`, x: `2`, y: `6`, rx: `2` }],
    [`path`, { d: `M12 12h.01` }],
    [`path`, { d: `M17 12h.01` }],
    [`path`, { d: `M7 12h.01` }],
  ],
  Lj = [
    [
      `path`,
      {
        d: `M20 6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-1.6-.8l-1.6-2.13a1 1 0 0 0-1.6 0L9.6 17.2A2 2 0 0 1 8 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z`,
      },
    ],
  ],
  Rj = [[`rect`, { width: `20`, height: `12`, x: `2`, y: `6`, rx: `2` }]],
  zj = [[`rect`, { width: `12`, height: `20`, x: `6`, y: `2`, rx: `2` }]],
  Bj = [
    [
      `path`,
      {
        d: `M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5`,
      },
    ],
    [
      `path`,
      {
        d: `M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12`,
      },
    ],
    [`path`, { d: `m14 16-3 3 3 3` }],
    [`path`, { d: `M8.293 13.596 7.196 9.5 3.1 10.598` }],
    [
      `path`,
      {
        d: `m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843`,
      },
    ],
    [`path`, { d: `m13.378 9.633 4.096 1.098 1.097-4.096` }],
  ],
  Vj = [
    [`path`, { d: `m15 14 5-5-5-5` }],
    [`path`, { d: `M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13` }],
  ],
  Hj = [
    [`circle`, { cx: `12`, cy: `17`, r: `1` }],
    [`path`, { d: `M21 7v6h-6` }],
    [`path`, { d: `M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7` }],
  ],
  Uj = [
    [`path`, { d: `M21 7v6h-6` }],
    [`path`, { d: `M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7` }],
  ],
  Wj = [
    [`path`, { d: `M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8` }],
    [`path`, { d: `M3 3v5h5` }],
    [`path`, { d: `M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16` }],
    [`path`, { d: `M16 16h5v5` }],
    [`circle`, { cx: `12`, cy: `12`, r: `1` }],
  ],
  Gj = [
    [`path`, { d: `M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8` }],
    [`path`, { d: `M3 3v5h5` }],
    [`path`, { d: `M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16` }],
    [`path`, { d: `M16 16h5v5` }],
  ],
  Kj = [
    [
      `path`,
      { d: `M21 8L18.74 5.74A9.75 9.75 0 0 0 12 3C11 3 10.03 3.16 9.13 3.47` },
    ],
    [`path`, { d: `M8 16H3v5` }],
    [`path`, { d: `M3 12C3 9.51 4 7.26 5.64 5.64` }],
    [
      `path`,
      { d: `m3 16 2.26 2.26A9.75 9.75 0 0 0 12 21c2.49 0 4.74-1 6.36-2.64` },
    ],
    [`path`, { d: `M21 12c0 1-.16 1.97-.47 2.87` }],
    [`path`, { d: `M21 3v5h-5` }],
    [`path`, { d: `M22 22 2 2` }],
  ],
  qj = [
    [`path`, { d: `M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8` }],
    [`path`, { d: `M21 3v5h-5` }],
    [`path`, { d: `M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16` }],
    [`path`, { d: `M8 16H3v5` }],
  ],
  Jj = [
    [
      `path`,
      {
        d: `M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z`,
      },
    ],
    [`path`, { d: `M5 10h14` }],
    [`path`, { d: `M15 7v6` }],
  ],
  Yj = [
    [`path`, { d: `M17 3v10` }],
    [`path`, { d: `m12.67 5.5 8.66 5` }],
    [`path`, { d: `m12.67 10.5 8.66-5` }],
    [
      `path`,
      {
        d: `M9 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2z`,
      },
    ],
  ],
  Xj = [
    [`path`, { d: `M4 7V4h16v3` }],
    [`path`, { d: `M5 20h6` }],
    [`path`, { d: `M13 4 8 20` }],
    [`path`, { d: `m15 15 5 5` }],
    [`path`, { d: `m20 15-5 5` }],
  ],
  Zj = [
    [`path`, { d: `m17 2 4 4-4 4` }],
    [`path`, { d: `M3 11v-1a4 4 0 0 1 4-4h14` }],
    [`path`, { d: `m7 22-4-4 4-4` }],
    [`path`, { d: `M21 13v1a4 4 0 0 1-4 4H3` }],
    [`path`, { d: `M11 10h1v4` }],
  ],
  Qj = [
    [`path`, { d: `m2 9 3-3 3 3` }],
    [`path`, { d: `M13 18H7a2 2 0 0 1-2-2V6` }],
    [`path`, { d: `m22 15-3 3-3-3` }],
    [`path`, { d: `M11 6h6a2 2 0 0 1 2 2v10` }],
  ],
  $j = [
    [`path`, { d: `M11.656 6H21l-4-4` }],
    [`path`, { d: `M17.898 17.898A4 4 0 0 1 17 18H3l4-4` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M21 13v1a4 4 0 0 1-.171 1.159` }],
    [`path`, { d: `m21 6-4 4` }],
    [`path`, { d: `M3 11v-1a4 4 0 0 1 3.102-3.898` }],
    [`path`, { d: `m7 22-4-4` }],
  ],
  eM = [
    [`path`, { d: `m17 2 4 4-4 4` }],
    [`path`, { d: `M3 11v-1a4 4 0 0 1 4-4h14` }],
    [`path`, { d: `m7 22-4-4 4-4` }],
    [`path`, { d: `M21 13v1a4 4 0 0 1-4 4H3` }],
  ],
  tM = [
    [`path`, { d: `M14 14a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1` }],
    [`path`, { d: `M14 4a1 1 0 0 1 1-1` }],
    [`path`, { d: `M15 10a1 1 0 0 1-1-1` }],
    [`path`, { d: `M19 14a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1` }],
    [`path`, { d: `M21 4a1 1 0 0 0-1-1` }],
    [`path`, { d: `M21 9a1 1 0 0 1-1 1` }],
    [`path`, { d: `m3 7 3 3 3-3` }],
    [`path`, { d: `M6 10V5a2 2 0 0 1 2-2h2` }],
    [`rect`, { x: `3`, y: `14`, width: `7`, height: `7`, rx: `1` }],
  ],
  nM = [
    [`path`, { d: `M14 4a1 1 0 0 1 1-1` }],
    [`path`, { d: `M15 10a1 1 0 0 1-1-1` }],
    [`path`, { d: `M21 4a1 1 0 0 0-1-1` }],
    [`path`, { d: `M21 9a1 1 0 0 1-1 1` }],
    [`path`, { d: `m3 7 3 3 3-3` }],
    [`path`, { d: `M6 10V5a2 2 0 0 1 2-2h2` }],
    [`rect`, { x: `3`, y: `14`, width: `7`, height: `7`, rx: `1` }],
  ],
  rM = [
    [`path`, { d: `M20 18v-2a4 4 0 0 0-4-4H4` }],
    [`path`, { d: `m9 17-5-5 5-5` }],
  ],
  iM = [
    [
      `path`,
      {
        d: `M12 6a2 2 0 0 0-3.414-1.414l-6 6a2 2 0 0 0 0 2.828l6 6A2 2 0 0 0 12 18z`,
      },
    ],
    [
      `path`,
      {
        d: `M22 6a2 2 0 0 0-3.414-1.414l-6 6a2 2 0 0 0 0 2.828l6 6A2 2 0 0 0 22 18z`,
      },
    ],
  ],
  aM = [
    [`path`, { d: `m12 17-5-5 5-5` }],
    [`path`, { d: `M22 18v-2a4 4 0 0 0-4-4H7` }],
    [`path`, { d: `m7 17-5-5 5-5` }],
  ],
  oM = [
    [
      `path`,
      {
        d: `M12 11.22C11 9.997 10 9 10 8a2 2 0 0 1 4 0c0 1-.998 2.002-2.01 3.22`,
      },
    ],
    [`path`, { d: `m12 18 2.57-3.5` }],
    [`path`, { d: `M6.243 9.016a7 7 0 0 1 11.507-.009` }],
    [`path`, { d: `M9.35 14.53 12 11.22` }],
    [
      `path`,
      {
        d: `M9.35 14.53C7.728 12.246 6 10.221 6 7a6 5 0 0 1 12 0c-.005 3.22-1.778 5.235-3.43 7.5l3.557 4.527a1 1 0 0 1-.203 1.43l-1.894 1.36a1 1 0 0 1-1.384-.215L12 18l-2.679 3.593a1 1 0 0 1-1.39.213l-1.865-1.353a1 1 0 0 1-.203-1.422z`,
      },
    ],
  ],
  sM = [
    [`path`, { d: `M12 17v4` }],
    [`path`, { d: `M12 5V3` }],
    [`path`, { d: `M12 9v3` }],
    [
      `path`,
      {
        d: `M2.077 18.449A2 2 0 0 0 4 21h16a2 2 0 0 0 1.924-2.55l-4-14A2 2 0 0 0 16 3H8a2 2 0 0 0-1.924 1.45z`,
      },
    ],
  ],
  cM = [
    [`path`, { d: `M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5` }],
    [
      `path`,
      {
        d: `M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09`,
      },
    ],
    [
      `path`,
      {
        d: `M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z`,
      },
    ],
    [`path`, { d: `M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05` }],
  ],
  lM = [
    [`path`, { d: `m15 13 3.708 7.416` }],
    [`path`, { d: `M3 19a15 15 0 0 0 18 0` }],
    [`path`, { d: `m3 2 3.21 9.633A2 2 0 0 0 8.109 13H18` }],
    [`path`, { d: `m9 13-3.708 7.416` }],
  ],
  uM = [
    [`path`, { d: `M6 19V5` }],
    [`path`, { d: `M10 19V6.8` }],
    [`path`, { d: `M14 19v-7.8` }],
    [`path`, { d: `M18 5v4` }],
    [`path`, { d: `M18 19v-6` }],
    [`path`, { d: `M22 19V9` }],
    [
      `path`,
      { d: `M2 19V9a4 4 0 0 1 4-4c2 0 4 1.33 6 4s4 4 6 4a4 4 0 1 0-3-6.65` },
    ],
  ],
  dM = [
    [`path`, { d: `M17 10h-1a4 4 0 1 1 4-4v.534` }],
    [
      `path`,
      {
        d: `M17 6h1a4 4 0 0 1 1.42 7.74l-2.29.87a6 6 0 0 1-5.339-10.68l2.069-1.31`,
      },
    ],
    [
      `path`,
      {
        d: `M4.5 17c2.8-.5 4.4 0 5.5.8s1.8 2.2 2.3 3.7c-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2`,
      },
    ],
    [`path`, { d: `M9.77 12C4 15 2 22 2 22` }],
    [`circle`, { cx: `17`, cy: `8`, r: `2` }],
  ],
  fM = [
    [`path`, { d: `m15.194 13.707 3.814 1.86-1.86 3.814` }],
    [`path`, { d: `M16.47214 7.52786 A 5 10 0 1 0 13 21.79796` }],
    [`path`, { d: `M21.79796 11 A 10 5 0 1 0 19 15.57071` }],
  ],
  pM = [
    [`path`, { d: `M12 7v6` }],
    [`path`, { d: `M12 9h2` }],
    [`path`, { d: `M3 12a9 9 0 1 0 9-9 9.74 9.74 0 0 0-6.74 2.74L3 8` }],
    [`path`, { d: `M3 3v5h5` }],
    [`circle`, { cx: `12`, cy: `15`, r: `2` }],
  ],
  mM = [
    [`path`, { d: `M20 9V7a2 2 0 0 0-2-2h-6` }],
    [`path`, { d: `m15 2-3 3 3 3` }],
    [`path`, { d: `M20 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2` }],
  ],
  hM = [
    [`path`, { d: `M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8` }],
    [`path`, { d: `M3 3v5h5` }],
  ],
  gM = [
    [`path`, { d: `M12 5H6a2 2 0 0 0-2 2v3` }],
    [`path`, { d: `m9 8 3-3-3-3` }],
    [
      `path`,
      { d: `M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2` },
    ],
  ],
  _M = [
    [`path`, { d: `M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8` }],
    [`path`, { d: `M21 3v5h-5` }],
  ],
  vM = [
    [`circle`, { cx: `6`, cy: `19`, r: `3` }],
    [`path`, { d: `M9 19h8.5c.4 0 .9-.1 1.3-.2` }],
    [`path`, { d: `M5.2 5.2A3.5 3.53 0 0 0 6.5 12H12` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M21 15.3a3.5 3.5 0 0 0-3.3-3.3` }],
    [`path`, { d: `M15 5h-4.3` }],
    [`circle`, { cx: `18`, cy: `5`, r: `3` }],
  ],
  yM = [
    [`circle`, { cx: `6`, cy: `19`, r: `3` }],
    [`path`, { d: `M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15` }],
    [`circle`, { cx: `18`, cy: `5`, r: `3` }],
  ],
  bM = [
    [`rect`, { width: `20`, height: `8`, x: `2`, y: `14`, rx: `2` }],
    [`path`, { d: `M6.01 18H6` }],
    [`path`, { d: `M10.01 18H10` }],
    [`path`, { d: `M15 10v4` }],
    [`path`, { d: `M17.84 7.17a4 4 0 0 0-5.66 0` }],
    [`path`, { d: `M20.66 4.34a8 8 0 0 0-11.31 0` }],
  ],
  xM = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M3 12h18` }],
  ],
  SM = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M21 9H3` }],
    [`path`, { d: `M21 15H3` }],
  ],
  CM = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M21 7.5H3` }],
    [`path`, { d: `M21 12H3` }],
    [`path`, { d: `M21 16.5H3` }],
  ],
  wM = [
    [`path`, { d: `M4 11a9 9 0 0 1 9 9` }],
    [`path`, { d: `M4 4a16 16 0 0 1 16 16` }],
    [`circle`, { cx: `5`, cy: `19`, r: `1` }],
  ],
  TM = [
    [`path`, { d: `M10 15v-3` }],
    [`path`, { d: `M14 15v-3` }],
    [`path`, { d: `M18 15v-3` }],
    [`path`, { d: `M2 8V4` }],
    [`path`, { d: `M22 6H2` }],
    [`path`, { d: `M22 8V4` }],
    [`path`, { d: `M6 15v-3` }],
    [`rect`, { x: `2`, y: `12`, width: `20`, height: `8`, rx: `2` }],
  ],
  EM = [
    [
      `path`,
      {
        d: `M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z`,
      },
    ],
    [`path`, { d: `m14.5 12.5 2-2` }],
    [`path`, { d: `m11.5 9.5 2-2` }],
    [`path`, { d: `m8.5 6.5 2-2` }],
    [`path`, { d: `m17.5 15.5 2-2` }],
  ],
  DM = [
    [`path`, { d: `M6 11h8a4 4 0 0 0 0-8H9v18` }],
    [`path`, { d: `M6 15h8` }],
  ],
  OM = [
    [`path`, { d: `M10 2v15` }],
    [
      `path`,
      {
        d: `M7 22a4 4 0 0 1-4-4 1 1 0 0 1 1-1h16a1 1 0 0 1 1 1 4 4 0 0 1-4 4z`,
      },
    ],
    [
      `path`,
      {
        d: `M9.159 2.46a1 1 0 0 1 1.521-.193l9.977 8.98A1 1 0 0 1 20 13H4a1 1 0 0 1-.824-1.567z`,
      },
    ],
  ],
  kM = [
    [`path`, { d: `M7 21h10` }],
    [`path`, { d: `M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z` }],
    [
      `path`,
      {
        d: `M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1`,
      },
    ],
    [`path`, { d: `m13 12 4-4` }],
    [`path`, { d: `M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2` }],
  ],
  AM = [
    [`path`, { d: `m2.37 11.223 8.372-6.777a2 2 0 0 1 2.516 0l8.371 6.777` }],
    [`path`, { d: `M21 15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5.25` }],
    [`path`, { d: `M3 15a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h9` }],
    [`path`, { d: `m6.67 15 6.13 4.6a2 2 0 0 0 2.8-.4l3.15-4.2` }],
    [`rect`, { width: `20`, height: `4`, x: `2`, y: `11`, rx: `1` }],
  ],
  jM = [
    [`path`, { d: `M4 10a7.31 7.31 0 0 0 10 10Z` }],
    [`path`, { d: `m9 15 3-3` }],
    [`path`, { d: `M17 13a6 6 0 0 0-6-6` }],
    [`path`, { d: `M21 13A10 10 0 0 0 11 3` }],
  ],
  MM = [
    [
      `path`,
      {
        d: `m13.5 6.5-3.148-3.148a1.205 1.205 0 0 0-1.704 0L6.352 5.648a1.205 1.205 0 0 0 0 1.704L9.5 10.5`,
      },
    ],
    [`path`, { d: `M16.5 7.5 19 5` }],
    [
      `path`,
      {
        d: `m17.5 10.5 3.148 3.148a1.205 1.205 0 0 1 0 1.704l-2.296 2.296a1.205 1.205 0 0 1-1.704 0L13.5 14.5`,
      },
    ],
    [`path`, { d: `M9 21a6 6 0 0 0-6-6` }],
    [
      `path`,
      {
        d: `M9.352 10.648a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l4.296-4.296a1.205 1.205 0 0 0 0-1.704l-2.296-2.296a1.205 1.205 0 0 0-1.704 0z`,
      },
    ],
  ],
  NM = [
    [`path`, { d: `m20 19.5-5.5 1.2` }],
    [`path`, { d: `M14.5 4v11.22a1 1 0 0 0 1.242.97L20 15.2` }],
    [`path`, { d: `m2.978 19.351 5.549-1.363A2 2 0 0 0 10 16V2` }],
    [`path`, { d: `M20 10 4 13.5` }],
  ],
  PM = [
    [`path`, { d: `M10 2v3a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M18 18v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6` }],
    [`path`, { d: `M18 22H4a2 2 0 0 1-2-2V6` }],
    [
      `path`,
      {
        d: `M8 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9.172a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 22 6.828V16a2 2 0 0 1-2.01 2z`,
      },
    ],
  ],
  FM = [
    [`path`, { d: `M13 13H8a1 1 0 0 0-1 1v7` }],
    [`path`, { d: `M14 8h1` }],
    [`path`, { d: `M17 21v-4` }],
    [`path`, { d: `m2 2 20 20` }],
    [
      `path`,
      {
        d: `M20.41 20.41A2 2 0 0 1 19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 .59-1.41`,
      },
    ],
    [`path`, { d: `M29.5 11.5s5 5 4 5` }],
    [`path`, { d: `M9 3h6.2a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V15` }],
  ],
  IM = [
    [
      `path`,
      {
        d: `M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z`,
      },
    ],
    [`path`, { d: `M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7` }],
    [`path`, { d: `M7 3v4a1 1 0 0 0 1 1h7` }],
  ],
  LM = [
    [`path`, { d: `M5 7v11a1 1 0 0 0 1 1h11` }],
    [`path`, { d: `M5.293 18.707 11 13` }],
    [`circle`, { cx: `19`, cy: `19`, r: `2` }],
    [`circle`, { cx: `5`, cy: `5`, r: `2` }],
  ],
  RM = [
    [`path`, { d: `M12 3v18` }],
    [`path`, { d: `m19 8 3 8a5 5 0 0 1-6 0zV7` }],
    [`path`, { d: `M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1` }],
    [`path`, { d: `m5 8 3 8a5 5 0 0 1-6 0zV7` }],
    [`path`, { d: `M7 21h10` }],
  ],
  zM = [
    [
      `path`,
      { d: `M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7` },
    ],
    [`path`, { d: `M14 15H9v-5` }],
    [`path`, { d: `M16 3h5v5` }],
    [`path`, { d: `M21 3 9 15` }],
  ],
  BM = [
    [`path`, { d: `M3 7V5a2 2 0 0 1 2-2h2` }],
    [`path`, { d: `M17 3h2a2 2 0 0 1 2 2v2` }],
    [`path`, { d: `M21 17v2a2 2 0 0 1-2 2h-2` }],
    [`path`, { d: `M7 21H5a2 2 0 0 1-2-2v-2` }],
    [`path`, { d: `M8 7v10` }],
    [`path`, { d: `M12 7v10` }],
    [`path`, { d: `M17 7v10` }],
  ],
  VM = [
    [`path`, { d: `M3 7V5a2 2 0 0 1 2-2h2` }],
    [`path`, { d: `M17 3h2a2 2 0 0 1 2 2v2` }],
    [`path`, { d: `M21 17v2a2 2 0 0 1-2 2h-2` }],
    [`path`, { d: `M7 21H5a2 2 0 0 1-2-2v-2` }],
    [`circle`, { cx: `12`, cy: `12`, r: `1` }],
    [
      `path`,
      {
        d: `M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0`,
      },
    ],
  ],
  HM = [
    [`path`, { d: `M3 7V5a2 2 0 0 1 2-2h2` }],
    [`path`, { d: `M17 3h2a2 2 0 0 1 2 2v2` }],
    [`path`, { d: `M21 17v2a2 2 0 0 1-2 2h-2` }],
    [`path`, { d: `M7 21H5a2 2 0 0 1-2-2v-2` }],
    [`path`, { d: `M8 14s1.5 2 4 2 4-2 4-2` }],
    [`path`, { d: `M9 9h.01` }],
    [`path`, { d: `M15 9h.01` }],
  ],
  UM = [
    [`path`, { d: `M17 3h2a2 2 0 0 1 2 2v2` }],
    [`path`, { d: `M21 17v2a2 2 0 0 1-2 2h-2` }],
    [`path`, { d: `M3 7V5a2 2 0 0 1 2-2h2` }],
    [`path`, { d: `M7 21H5a2 2 0 0 1-2-2v-2` }],
    [
      `path`,
      {
        d: `M7.828 13.07A3 3 0 0 1 12 8.764a3 3 0 0 1 4.172 4.306l-3.447 3.62a1 1 0 0 1-1.449 0z`,
      },
    ],
  ],
  WM = [
    [`path`, { d: `M3 7V5a2 2 0 0 1 2-2h2` }],
    [`path`, { d: `M17 3h2a2 2 0 0 1 2 2v2` }],
    [`path`, { d: `M21 17v2a2 2 0 0 1-2 2h-2` }],
    [`path`, { d: `M7 21H5a2 2 0 0 1-2-2v-2` }],
    [`path`, { d: `M7 12h10` }],
  ],
  GM = [
    [`path`, { d: `M17 12v4a1 1 0 0 1-1 1h-4` }],
    [`path`, { d: `M17 3h2a2 2 0 0 1 2 2v2` }],
    [`path`, { d: `M17 8V7` }],
    [`path`, { d: `M21 17v2a2 2 0 0 1-2 2h-2` }],
    [`path`, { d: `M3 7V5a2 2 0 0 1 2-2h2` }],
    [`path`, { d: `M7 17h.01` }],
    [`path`, { d: `M7 21H5a2 2 0 0 1-2-2v-2` }],
    [`rect`, { x: `7`, y: `7`, width: `5`, height: `5`, rx: `1` }],
  ],
  KM = [
    [`path`, { d: `M3 7V5a2 2 0 0 1 2-2h2` }],
    [`path`, { d: `M17 3h2a2 2 0 0 1 2 2v2` }],
    [`path`, { d: `M21 17v2a2 2 0 0 1-2 2h-2` }],
    [`path`, { d: `M7 21H5a2 2 0 0 1-2-2v-2` }],
    [`circle`, { cx: `12`, cy: `12`, r: `3` }],
    [`path`, { d: `m16 16-1.9-1.9` }],
  ],
  qM = [
    [`path`, { d: `M3 7V5a2 2 0 0 1 2-2h2` }],
    [`path`, { d: `M17 3h2a2 2 0 0 1 2 2v2` }],
    [`path`, { d: `M21 17v2a2 2 0 0 1-2 2h-2` }],
    [`path`, { d: `M7 21H5a2 2 0 0 1-2-2v-2` }],
    [`path`, { d: `M7 8h8` }],
    [`path`, { d: `M7 12h10` }],
    [`path`, { d: `M7 16h6` }],
  ],
  JM = [
    [`path`, { d: `M3 7V5a2 2 0 0 1 2-2h2` }],
    [`path`, { d: `M17 3h2a2 2 0 0 1 2 2v2` }],
    [`path`, { d: `M21 17v2a2 2 0 0 1-2 2h-2` }],
    [`path`, { d: `M7 21H5a2 2 0 0 1-2-2v-2` }],
  ],
  YM = [
    [`path`, { d: `M14 21v-3a2 2 0 0 0-4 0v3` }],
    [`path`, { d: `M18 4.933V21` }],
    [`path`, { d: `m4 6 7.106-3.79a2 2 0 0 1 1.788 0L20 6` }],
    [
      `path`,
      {
        d: `m6 11-3.52 2.147a1 1 0 0 0-.48.854V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a1 1 0 0 0-.48-.853L18 11`,
      },
    ],
    [`path`, { d: `M6 4.933V21` }],
    [`circle`, { cx: `12`, cy: `9`, r: `2` }],
  ],
  XM = [
    [`path`, { d: `M5.42 9.42 8 12` }],
    [`circle`, { cx: `4`, cy: `8`, r: `2` }],
    [`path`, { d: `m14 6-8.58 8.58` }],
    [`circle`, { cx: `4`, cy: `16`, r: `2` }],
    [`path`, { d: `M10.8 14.8 14 18` }],
    [`path`, { d: `M16 12h-2` }],
    [`path`, { d: `M22 12h-2` }],
  ],
  ZM = [
    [`circle`, { cx: `6`, cy: `6`, r: `3` }],
    [`path`, { d: `M8.12 8.12 12 12` }],
    [`path`, { d: `M20 4 8.12 15.88` }],
    [`circle`, { cx: `6`, cy: `18`, r: `3` }],
    [`path`, { d: `M14.8 14.8 20 20` }],
  ],
  QM = [
    [`path`, { d: `M21 4h-3.5l2 11.05` }],
    [
      `path`,
      {
        d: `M6.95 17h5.142c.523 0 .95-.406 1.063-.916a6.5 6.5 0 0 1 5.345-5.009`,
      },
    ],
    [`circle`, { cx: `19.5`, cy: `17.5`, r: `2.5` }],
    [`circle`, { cx: `4.5`, cy: `17.5`, r: `2.5` }],
  ],
  $M = [
    [
      `path`,
      { d: `M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3` },
    ],
    [`path`, { d: `M8 21h8` }],
    [`path`, { d: `M12 17v4` }],
    [`path`, { d: `m22 3-5 5` }],
    [`path`, { d: `m17 3 5 5` }],
  ],
  eN = [
    [
      `path`,
      { d: `M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3` },
    ],
    [`path`, { d: `M8 21h8` }],
    [`path`, { d: `M12 17v4` }],
    [`path`, { d: `m17 8 5-5` }],
    [`path`, { d: `M17 3h5v5` }],
  ],
  tN = [
    [`path`, { d: `M15 12h-5` }],
    [`path`, { d: `M15 8h-5` }],
    [`path`, { d: `M19 17V5a2 2 0 0 0-2-2H4` }],
    [
      `path`,
      {
        d: `M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3`,
      },
    ],
  ],
  nN = [
    [`path`, { d: `M19 17V5a2 2 0 0 0-2-2H4` }],
    [
      `path`,
      {
        d: `M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3`,
      },
    ],
  ],
  rN = [
    [`circle`, { cx: `11`, cy: `11`, r: `8` }],
    [`path`, { d: `m21 21-4.3-4.3` }],
    [`path`, { d: `M11 7v4` }],
    [`path`, { d: `M11 15h.01` }],
  ],
  iN = [
    [`path`, { d: `m8 11 2 2 4-4` }],
    [`circle`, { cx: `11`, cy: `11`, r: `8` }],
    [`path`, { d: `m21 21-4.3-4.3` }],
  ],
  aN = [
    [`path`, { d: `m13 13.5 2-2.5-2-2.5` }],
    [`path`, { d: `m21 21-4.3-4.3` }],
    [`path`, { d: `M9 8.5 7 11l2 2.5` }],
    [`circle`, { cx: `11`, cy: `11`, r: `8` }],
  ],
  oN = [
    [`path`, { d: `m13.5 8.5-5 5` }],
    [`circle`, { cx: `11`, cy: `11`, r: `8` }],
    [`path`, { d: `m21 21-4.3-4.3` }],
  ],
  sN = [
    [`path`, { d: `m13.5 8.5-5 5` }],
    [`path`, { d: `m8.5 8.5 5 5` }],
    [`circle`, { cx: `11`, cy: `11`, r: `8` }],
    [`path`, { d: `m21 21-4.3-4.3` }],
  ],
  cN = [
    [`path`, { d: `m21 21-4.34-4.34` }],
    [`circle`, { cx: `11`, cy: `11`, r: `8` }],
  ],
  lN = [
    [`path`, { d: `M16 5a4 3 0 0 0-8 0c0 4 8 3 8 7a4 3 0 0 1-8 0` }],
    [`path`, { d: `M8 19a4 3 0 0 0 8 0c0-4-8-3-8-7a4 3 0 0 1 8 0` }],
  ],
  uN = [
    [
      `path`,
      {
        d: `M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z`,
      },
    ],
    [`path`, { d: `M6 12h16` }],
  ],
  dN = [
    [`rect`, { x: `14`, y: `14`, width: `8`, height: `8`, rx: `2` }],
    [`rect`, { x: `2`, y: `2`, width: `8`, height: `8`, rx: `2` }],
    [`path`, { d: `M7 14v1a2 2 0 0 0 2 2h1` }],
    [`path`, { d: `M14 7h1a2 2 0 0 1 2 2v1` }],
  ],
  fN = [
    [
      `path`,
      {
        d: `M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z`,
      },
    ],
    [`path`, { d: `m21.854 2.147-10.94 10.939` }],
  ],
  pN = [
    [`path`, { d: `m16 16-4 4-4-4` }],
    [`path`, { d: `M3 12h18` }],
    [`path`, { d: `m8 8 4-4 4 4` }],
  ],
  mN = [
    [`path`, { d: `M12 3v18` }],
    [`path`, { d: `m16 16 4-4-4-4` }],
    [`path`, { d: `m8 8-4 4 4 4` }],
  ],
  hN = [
    [`path`, { d: `m10.852 14.772-.383.923` }],
    [`path`, { d: `M13.148 14.772a3 3 0 1 0-2.296-5.544l-.383-.923` }],
    [`path`, { d: `m13.148 9.228.383-.923` }],
    [`path`, { d: `m13.53 15.696-.382-.924a3 3 0 1 1-2.296-5.544` }],
    [`path`, { d: `m14.772 10.852.923-.383` }],
    [`path`, { d: `m14.772 13.148.923.383` }],
    [
      `path`,
      {
        d: `M4.5 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-.5`,
      },
    ],
    [
      `path`,
      {
        d: `M4.5 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-.5`,
      },
    ],
    [`path`, { d: `M6 18h.01` }],
    [`path`, { d: `M6 6h.01` }],
    [`path`, { d: `m9.228 10.852-.923-.383` }],
    [`path`, { d: `m9.228 13.148-.923.383` }],
  ],
  gN = [
    [
      `path`,
      {
        d: `M6 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2`,
      },
    ],
    [
      `path`,
      {
        d: `M6 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2`,
      },
    ],
    [`path`, { d: `M6 6h.01` }],
    [`path`, { d: `M6 18h.01` }],
    [`path`, { d: `m13 6-4 6h6l-4 6` }],
  ],
  _N = [
    [`path`, { d: `M7 2h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-5` }],
    [`path`, { d: `M10 10 2.5 2.5C2 2 2 2.5 2 5v3a2 2 0 0 0 2 2h6z` }],
    [`path`, { d: `M22 17v-1a2 2 0 0 0-2-2h-1` }],
    [`path`, { d: `M4 14a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16.5l1-.5.5.5-8-8H4z` }],
    [`path`, { d: `M6 18h.01` }],
    [`path`, { d: `m2 2 20 20` }],
  ],
  vN = [
    [`rect`, { width: `20`, height: `8`, x: `2`, y: `2`, rx: `2`, ry: `2` }],
    [`rect`, { width: `20`, height: `8`, x: `2`, y: `14`, rx: `2`, ry: `2` }],
    [`line`, { x1: `6`, x2: `6.01`, y1: `6`, y2: `6` }],
    [`line`, { x1: `6`, x2: `6.01`, y1: `18`, y2: `18` }],
  ],
  yN = [
    [`path`, { d: `M14 17H5` }],
    [`path`, { d: `M19 7h-9` }],
    [`circle`, { cx: `17`, cy: `17`, r: `3` }],
    [`circle`, { cx: `7`, cy: `7`, r: `3` }],
  ],
  bN = [
    [
      `path`,
      {
        d: `M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`,
      },
    ],
    [`circle`, { cx: `12`, cy: `12`, r: `3` }],
  ],
  xN = [
    [
      `path`,
      {
        d: `M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z`,
      },
    ],
    [`rect`, { x: `3`, y: `14`, width: `7`, height: `7`, rx: `1` }],
    [`circle`, { cx: `17.5`, cy: `17.5`, r: `3.5` }],
  ],
  SN = [
    [`circle`, { cx: `18`, cy: `5`, r: `3` }],
    [`circle`, { cx: `6`, cy: `12`, r: `3` }],
    [`circle`, { cx: `18`, cy: `19`, r: `3` }],
    [`line`, { x1: `8.59`, x2: `15.42`, y1: `13.51`, y2: `17.49` }],
    [`line`, { x1: `15.41`, x2: `8.59`, y1: `6.51`, y2: `10.49` }],
  ],
  CN = [
    [`path`, { d: `M12 2v13` }],
    [`path`, { d: `m16 6-4-4-4 4` }],
    [`path`, { d: `M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8` }],
  ],
  wN = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2`, ry: `2` }],
    [`line`, { x1: `3`, x2: `21`, y1: `9`, y2: `9` }],
    [`line`, { x1: `3`, x2: `21`, y1: `15`, y2: `15` }],
    [`line`, { x1: `9`, x2: `9`, y1: `9`, y2: `21` }],
    [`line`, { x1: `15`, x2: `15`, y1: `9`, y2: `21` }],
  ],
  TN = [
    [
      `path`,
      {
        d: `M14 11a2 2 0 1 1-4 0 4 4 0 0 1 8 0 6 6 0 0 1-12 0 8 8 0 0 1 16 0 10 10 0 1 1-20 0 11.93 11.93 0 0 1 2.42-7.22 2 2 0 1 1 3.16 2.44`,
      },
    ],
  ],
  EN = [
    [`path`, { d: `M12 12V9a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3` }],
    [`path`, { d: `M16 20v-3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3` }],
    [`path`, { d: `M20 22V2` }],
    [`path`, { d: `M4 12h16` }],
    [`path`, { d: `M4 20h16` }],
    [`path`, { d: `M4 2v20` }],
    [`path`, { d: `M4 4h16` }],
  ],
  DN = [
    [
      `path`,
      {
        d: `M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,
      },
    ],
    [`path`, { d: `m4.243 5.21 14.39 12.472` }],
  ],
  ON = [
    [
      `path`,
      {
        d: `M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,
      },
    ],
    [`path`, { d: `M12 8v4` }],
    [`path`, { d: `M12 16h.01` }],
  ],
  kN = [
    [
      `path`,
      {
        d: `M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,
      },
    ],
    [`path`, { d: `m9 12 2 2 4-4` }],
  ],
  AN = [
    [
      `path`,
      {
        d: `M11 22c-3.806-1.45-7-3.966-7-9V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v4`,
      },
    ],
    [`path`, { d: `M14.923 16.547 14 16.164` }],
    [`path`, { d: `m14.923 18.843-.923.383` }],
    [`path`, { d: `M16.547 14.923 16.164 14` }],
    [`path`, { d: `m16.547 20.467-.383.924` }],
    [`path`, { d: `m18.843 14.923.383-.923` }],
    [`path`, { d: `m19.225 21.391-.382-.924` }],
    [`path`, { d: `m20.467 16.547.923-.383` }],
    [`path`, { d: `m20.467 18.843.923.383` }],
    [`circle`, { cx: `17.695`, cy: `17.695`, r: `3` }],
  ],
  jN = [
    [`path`, { d: `m10.929 14.467-.383.924` }],
    [`path`, { d: `M10.929 8.923 10.546 8` }],
    [`path`, { d: `M13.225 8.923 13.608 8` }],
    [`path`, { d: `m13.607 15.391-.382-.924` }],
    [`path`, { d: `m14.849 10.547.923-.383` }],
    [`path`, { d: `m14.849 12.843.923.383` }],
    [
      `path`,
      {
        d: `M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,
      },
    ],
    [`path`, { d: `m9.305 10.547-.923-.383` }],
    [`path`, { d: `m9.305 12.843-.923.383` }],
    [`circle`, { cx: `12.077`, cy: `11.695`, r: `3` }],
  ],
  MN = [
    [
      `path`,
      {
        d: `M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,
      },
    ],
    [`path`, { d: `M8 12h.01` }],
    [`path`, { d: `M12 12h.01` }],
    [`path`, { d: `M16 12h.01` }],
  ],
  NN = [
    [
      `path`,
      {
        d: `M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,
      },
    ],
    [`path`, { d: `M12 22V2` }],
  ],
  PN = [
    [`path`, { d: `m2 2 20 20` }],
    [
      `path`,
      {
        d: `M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71`,
      },
    ],
    [
      `path`,
      {
        d: `M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264`,
      },
    ],
  ],
  FN = [
    [
      `path`,
      {
        d: `M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,
      },
    ],
    [`path`, { d: `M9 12h6` }],
  ],
  IN = [
    [
      `path`,
      {
        d: `M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,
      },
    ],
    [`path`, { d: `M9 12h6` }],
    [`path`, { d: `M12 9v6` }],
  ],
  LN = [
    [
      `path`,
      {
        d: `M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,
      },
    ],
    [`path`, { d: `M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3` }],
    [`path`, { d: `M12 17h.01` }],
  ],
  RN = [
    [
      `path`,
      {
        d: `M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,
      },
    ],
    [`path`, { d: `M6.376 18.91a6 6 0 0 1 11.249.003` }],
    [`circle`, { cx: `12`, cy: `11`, r: `4` }],
  ],
  zN = [
    [
      `path`,
      {
        d: `M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,
      },
    ],
    [`path`, { d: `m14.5 9.5-5 5` }],
    [`path`, { d: `m9.5 9.5 5 5` }],
  ],
  BN = [
    [`circle`, { cx: `12`, cy: `12`, r: `8` }],
    [`path`, { d: `M12 2v7.5` }],
    [`path`, { d: `m19 5-5.23 5.23` }],
    [`path`, { d: `M22 12h-7.5` }],
    [`path`, { d: `m19 19-5.23-5.23` }],
    [`path`, { d: `M12 14.5V22` }],
    [`path`, { d: `M10.23 13.77 5 19` }],
    [`path`, { d: `M9.5 12H2` }],
    [`path`, { d: `M10.23 10.23 5 5` }],
    [`circle`, { cx: `12`, cy: `12`, r: `2.5` }],
  ],
  VN = [
    [
      `path`,
      {
        d: `M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,
      },
    ],
  ],
  HN = [
    [`path`, { d: `M12 10.189V14` }],
    [`path`, { d: `M12 2v3` }],
    [`path`, { d: `M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6` }],
    [
      `path`,
      {
        d: `M19.38 20A11.6 11.6 0 0 0 21 14l-8.188-3.639a2 2 0 0 0-1.624 0L3 14a11.6 11.6 0 0 0 2.81 7.76`,
      },
    ],
    [
      `path`,
      {
        d: `M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1`,
      },
    ],
  ],
  UN = [
    [
      `path`,
      {
        d: `M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z`,
      },
    ],
  ],
  WN = [
    [`path`, { d: `M16 10a4 4 0 0 1-8 0` }],
    [`path`, { d: `M3.103 6.034h17.794` }],
    [
      `path`,
      {
        d: `M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z`,
      },
    ],
  ],
  GN = [
    [`circle`, { cx: `8`, cy: `21`, r: `1` }],
    [`circle`, { cx: `19`, cy: `21`, r: `1` }],
    [
      `path`,
      {
        d: `M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12`,
      },
    ],
  ],
  KN = [
    [`path`, { d: `m15 11-1 9` }],
    [`path`, { d: `m19 11-4-7` }],
    [`path`, { d: `M2 11h20` }],
    [
      `path`,
      { d: `m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4` },
    ],
    [`path`, { d: `M4.5 15.5h15` }],
    [`path`, { d: `m5 11 4-7` }],
    [`path`, { d: `m9 11 1 9` }],
  ],
  qN = [
    [
      `path`,
      {
        d: `M21.56 4.56a1.5 1.5 0 0 1 0 2.122l-.47.47a3 3 0 0 1-4.212-.03 3 3 0 0 1 0-4.243l.44-.44a1.5 1.5 0 0 1 2.121 0z`,
      },
    ],
    [
      `path`,
      {
        d: `M3 22a1 1 0 0 1-1-1v-3.586a1 1 0 0 1 .293-.707l3.355-3.355a1.205 1.205 0 0 1 1.704 0l3.296 3.296a1.205 1.205 0 0 1 0 1.704l-3.355 3.355a1 1 0 0 1-.707.293z`,
      },
    ],
    [`path`, { d: `m9 15 7.879-7.878` }],
  ],
  JN = [
    [`path`, { d: `m4 4 2.5 2.5` }],
    [`path`, { d: `M13.5 6.5a4.95 4.95 0 0 0-7 7` }],
    [`path`, { d: `M15 5 5 15` }],
    [`path`, { d: `M14 17v.01` }],
    [`path`, { d: `M10 16v.01` }],
    [`path`, { d: `M13 13v.01` }],
    [`path`, { d: `M16 10v.01` }],
    [`path`, { d: `M11 20v.01` }],
    [`path`, { d: `M17 14v.01` }],
    [`path`, { d: `M20 11v.01` }],
  ],
  YN = [
    [`path`, { d: `M11 12h.01` }],
    [`path`, { d: `M13 22c.5-.5 1.12-1 2.5-1-1.38 0-2-.5-2.5-1` }],
    [
      `path`,
      {
        d: `M14 2a3.28 3.28 0 0 1-3.227 1.798l-6.17-.561A2.387 2.387 0 1 0 4.387 8H15.5a1 1 0 0 1 0 13 1 1 0 0 0 0-5H12a7 7 0 0 1-7-7V8`,
      },
    ],
    [`path`, { d: `M14 8a8.5 8.5 0 0 1 0 8` }],
    [`path`, { d: `M16 16c2 0 4.5-4 4-6` }],
  ],
  XN = [
    [
      `path`,
      {
        d: `M4 13V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v5`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M10 22v-5` }],
    [`path`, { d: `M14 19v-2` }],
    [`path`, { d: `M18 20v-3` }],
    [`path`, { d: `M2 13h20` }],
    [`path`, { d: `M6 20v-3` }],
  ],
  ZN = [
    [`path`, { d: `m15 15 6 6m-6-6v4.8m0-4.8h4.8` }],
    [`path`, { d: `M9 19.8V15m0 0H4.2M9 15l-6 6` }],
    [`path`, { d: `M15 4.2V9m0 0h4.8M15 9l6-6` }],
    [`path`, { d: `M9 4.2V9m0 0H4.2M9 9 3 3` }],
  ],
  QN = [
    [`path`, { d: `M12 22v-5.172a2 2 0 0 0-.586-1.414L9.5 13.5` }],
    [`path`, { d: `M14.5 14.5 12 17` }],
    [
      `path`,
      { d: `M17 8.8A6 6 0 0 1 13.8 20H10A6.5 6.5 0 0 1 7 8a5 5 0 0 1 10 0z` },
    ],
  ],
  $N = [
    [`path`, { d: `m18 14 4 4-4 4` }],
    [`path`, { d: `m18 2 4 4-4 4` }],
    [
      `path`,
      { d: `M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22` },
    ],
    [`path`, { d: `M2 6h1.972a4 4 0 0 1 3.6 2.2` }],
    [`path`, { d: `M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45` }],
  ],
  eP = [
    [
      `path`,
      {
        d: `M18 7V5a1 1 0 0 0-1-1H6.5a.5.5 0 0 0-.4.8l4.5 6a2 2 0 0 1 0 2.4l-4.5 6a.5.5 0 0 0 .4.8H17a1 1 0 0 0 1-1v-2`,
      },
    ],
  ],
  tP = [
    [`path`, { d: `M2 20h.01` }],
    [`path`, { d: `M7 20v-4` }],
    [`path`, { d: `M12 20v-8` }],
    [`path`, { d: `M17 20V8` }],
  ],
  nP = [
    [`path`, { d: `M2 20h.01` }],
    [`path`, { d: `M7 20v-4` }],
  ],
  rP = [
    [`path`, { d: `M2 20h.01` }],
    [`path`, { d: `M7 20v-4` }],
    [`path`, { d: `M12 20v-8` }],
  ],
  iP = [[`path`, { d: `M2 20h.01` }]],
  aP = [
    [`path`, { d: `M2 20h.01` }],
    [`path`, { d: `M7 20v-4` }],
    [`path`, { d: `M12 20v-8` }],
    [`path`, { d: `M17 20V8` }],
    [`path`, { d: `M22 4v16` }],
  ],
  oP = [
    [
      `path`,
      {
        d: `m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284`,
      },
    ],
    [`path`, { d: `M3 21h18` }],
  ],
  sP = [
    [`path`, { d: `M10 9H4L2 7l2-2h6` }],
    [`path`, { d: `M14 5h6l2 2-2 2h-6` }],
    [`path`, { d: `M10 22V4a2 2 0 1 1 4 0v18` }],
    [`path`, { d: `M8 22h8` }],
  ],
  cP = [
    [`path`, { d: `M12 13v8` }],
    [`path`, { d: `M12 3v3` }],
    [
      `path`,
      {
        d: `M2.354 10.354a1.207 1.207 0 0 1 0-1.708l2.06-2.06A2 2 0 0 1 5.828 6h12.344a2 2 0 0 1 1.414.586l2.06 2.06a1.207 1.207 0 0 1 0 1.708l-2.06 2.06a2 2 0 0 1-1.414.586H5.828a2 2 0 0 1-1.414-.586z`,
      },
    ],
  ],
  lP = [
    [`path`, { d: `M7 18v-6a5 5 0 1 1 10 0v6` }],
    [
      `path`,
      {
        d: `M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z`,
      },
    ],
    [`path`, { d: `M21 12h1` }],
    [`path`, { d: `M18.5 4.5 18 5` }],
    [`path`, { d: `M2 12h1` }],
    [`path`, { d: `M12 2v1` }],
    [`path`, { d: `m4.929 4.929.707.707` }],
    [`path`, { d: `M12 12v6` }],
  ],
  uP = [
    [
      `path`,
      {
        d: `M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z`,
      },
    ],
    [`path`, { d: `M3 20V4` }],
  ],
  dP = [
    [`path`, { d: `M21 4v16` }],
    [
      `path`,
      {
        d: `M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z`,
      },
    ],
  ],
  fP = [
    [`path`, { d: `m12.5 17-.5-1-.5 1h1z` }],
    [
      `path`,
      {
        d: `M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z`,
      },
    ],
    [`circle`, { cx: `15`, cy: `12`, r: `1` }],
    [`circle`, { cx: `9`, cy: `12`, r: `1` }],
  ],
  pP = [[`path`, { d: `M22 2 2 22` }]],
  mP = [
    [
      `path`,
      {
        d: `M11 16.586V19a1 1 0 0 1-1 1H2L18.37 3.63a1 1 0 1 1 3 3l-9.663 9.663a1 1 0 0 1-1.414 0L8 14`,
      },
    ],
  ],
  hP = [
    [`path`, { d: `M10 5H3` }],
    [`path`, { d: `M12 19H3` }],
    [`path`, { d: `M14 3v4` }],
    [`path`, { d: `M16 17v4` }],
    [`path`, { d: `M21 12h-9` }],
    [`path`, { d: `M21 19h-5` }],
    [`path`, { d: `M21 5h-7` }],
    [`path`, { d: `M8 10v4` }],
    [`path`, { d: `M8 12H3` }],
  ],
  gP = [
    [`path`, { d: `M10 8h4` }],
    [`path`, { d: `M12 21v-9` }],
    [`path`, { d: `M12 8V3` }],
    [`path`, { d: `M17 16h4` }],
    [`path`, { d: `M19 12V3` }],
    [`path`, { d: `M19 21v-5` }],
    [`path`, { d: `M3 14h4` }],
    [`path`, { d: `M5 10V3` }],
    [`path`, { d: `M5 21v-7` }],
  ],
  _P = [
    [`rect`, { width: `14`, height: `20`, x: `5`, y: `2`, rx: `2`, ry: `2` }],
    [`path`, { d: `M12.667 8 10 12h4l-2.667 4` }],
  ],
  vP = [
    [`rect`, { width: `7`, height: `12`, x: `2`, y: `6`, rx: `1` }],
    [`path`, { d: `M13 8.32a7.43 7.43 0 0 1 0 7.36` }],
    [`path`, { d: `M16.46 6.21a11.76 11.76 0 0 1 0 11.58` }],
    [`path`, { d: `M19.91 4.1a15.91 15.91 0 0 1 .01 15.8` }],
  ],
  yP = [
    [`rect`, { width: `14`, height: `20`, x: `5`, y: `2`, rx: `2`, ry: `2` }],
    [`path`, { d: `M12 18h.01` }],
  ],
  bP = [
    [`path`, { d: `M22 11v1a10 10 0 1 1-9-10` }],
    [`path`, { d: `M8 14s1.5 2 4 2 4-2 4-2` }],
    [`line`, { x1: `9`, x2: `9.01`, y1: `9`, y2: `9` }],
    [`line`, { x1: `15`, x2: `15.01`, y1: `9`, y2: `9` }],
    [`path`, { d: `M16 5h6` }],
    [`path`, { d: `M19 2v6` }],
  ],
  xP = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`path`, { d: `M8 14s1.5 2 4 2 4-2 4-2` }],
    [`line`, { x1: `9`, x2: `9.01`, y1: `9`, y2: `9` }],
    [`line`, { x1: `15`, x2: `15.01`, y1: `9`, y2: `9` }],
  ],
  SP = [
    [`path`, { d: `M2 13a6 6 0 1 0 12 0 4 4 0 1 0-8 0 2 2 0 0 0 4 0` }],
    [`circle`, { cx: `10`, cy: `13`, r: `8` }],
    [`path`, { d: `M2 21h12c4.4 0 8-3.6 8-8V7a2 2 0 1 0-4 0v6` }],
    [`path`, { d: `M18 3 19.1 5.2` }],
    [`path`, { d: `M22 3 20.9 5.2` }],
  ],
  CP = [
    [`path`, { d: `m10 20-1.25-2.5L6 18` }],
    [`path`, { d: `M10 4 8.75 6.5 6 6` }],
    [`path`, { d: `m14 20 1.25-2.5L18 18` }],
    [`path`, { d: `m14 4 1.25 2.5L18 6` }],
    [`path`, { d: `m17 21-3-6h-4` }],
    [`path`, { d: `m17 3-3 6 1.5 3` }],
    [`path`, { d: `M2 12h6.5L10 9` }],
    [`path`, { d: `m20 10-1.5 2 1.5 2` }],
    [`path`, { d: `M22 12h-6.5L14 15` }],
    [`path`, { d: `m4 10 1.5 2L4 14` }],
    [`path`, { d: `m7 21 3-6-1.5-3` }],
    [`path`, { d: `m7 3 3 6h4` }],
  ],
  wP = [
    [`path`, { d: `M10.5 2v4` }],
    [`path`, { d: `M14 2H7a2 2 0 0 0-2 2` }],
    [
      `path`,
      {
        d: `M19.29 14.76A6.67 6.67 0 0 1 17 11a6.6 6.6 0 0 1-2.29 3.76c-1.15.92-1.71 2.04-1.71 3.19 0 2.22 1.8 4.05 4 4.05s4-1.83 4-4.05c0-1.16-.57-2.26-1.71-3.19`,
      },
    ],
    [
      `path`,
      {
        d: `M9.607 21H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h7V7a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3`,
      },
    ],
  ],
  TP = [
    [`path`, { d: `M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3` }],
    [
      `path`,
      {
        d: `M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z`,
      },
    ],
    [`path`, { d: `M4 18v2` }],
    [`path`, { d: `M20 18v2` }],
    [`path`, { d: `M12 4v9` }],
  ],
  EP = [
    [`path`, { d: `M11 2h2` }],
    [`path`, { d: `m14.28 14-4.56 8` }],
    [`path`, { d: `m21 22-1.558-4H4.558` }],
    [`path`, { d: `M3 10v2` }],
    [
      `path`,
      {
        d: `M6.245 15.04A2 2 0 0 1 8 14h12a1 1 0 0 1 .864 1.505l-3.11 5.457A2 2 0 0 1 16 22H4a1 1 0 0 1-.863-1.506z`,
      },
    ],
    [`path`, { d: `M7 2a4 4 0 0 1-4 4` }],
    [`path`, { d: `m8.66 7.66 1.41 1.41` }],
  ],
  DP = [
    [`path`, { d: `M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z` }],
    [`path`, { d: `M7 21h10` }],
    [`path`, { d: `M19.5 12 22 6` }],
    [
      `path`,
      {
        d: `M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62`,
      },
    ],
    [
      `path`,
      {
        d: `M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62`,
      },
    ],
    [
      `path`,
      {
        d: `M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62`,
      },
    ],
  ],
  OP = [[`path`, { d: `M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1` }]],
  kP = [
    [`path`, { d: `M12 18v4` }],
    [
      `path`,
      {
        d: `M2 14.499a5.5 5.5 0 0 0 9.591 3.675.6.6 0 0 1 .818.001A5.5 5.5 0 0 0 22 14.5c0-2.29-1.5-4-3-5.5l-5.492-5.312a2 2 0 0 0-3-.02L5 8.999c-1.5 1.5-3 3.2-3 5.5`,
      },
    ],
  ],
  AP = [
    [
      `path`,
      {
        d: `M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z`,
      },
    ],
  ],
  jP = [
    [
      `path`,
      {
        d: `M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z`,
      },
    ],
    [`path`, { d: `M20 2v4` }],
    [`path`, { d: `M22 4h-4` }],
    [`circle`, { cx: `4`, cy: `20`, r: `2` }],
  ],
  MP = [
    [`rect`, { width: `16`, height: `20`, x: `4`, y: `2`, rx: `2` }],
    [`path`, { d: `M12 6h.01` }],
    [`circle`, { cx: `12`, cy: `14`, r: `4` }],
    [`path`, { d: `M12 14h.01` }],
  ],
  NP = [
    [
      `path`,
      {
        d: `M8.8 20v-4.1l1.9.2a2.3 2.3 0 0 0 2.164-2.1V8.3A5.37 5.37 0 0 0 2 8.25c0 2.8.656 3.054 1 4.55a5.77 5.77 0 0 1 .029 2.758L2 20`,
      },
    ],
    [`path`, { d: `M19.8 17.8a7.5 7.5 0 0 0 .003-10.603` }],
    [`path`, { d: `M17 15a3.5 3.5 0 0 0-.025-4.975` }],
  ],
  PP = [
    [`path`, { d: `m6 16 6-12 6 12` }],
    [`path`, { d: `M8 12h8` }],
    [`path`, { d: `m16 20 2 2 4-4` }],
  ],
  FP = [
    [`path`, { d: `m6 16 6-12 6 12` }],
    [`path`, { d: `M8 12h8` }],
    [
      `path`,
      {
        d: `M4 21c1.1 0 1.1-1 2.3-1s1.1 1 2.3 1c1.1 0 1.1-1 2.3-1 1.1 0 1.1 1 2.3 1 1.1 0 1.1-1 2.3-1 1.1 0 1.1 1 2.3 1 1.1 0 1.1-1 2.3-1`,
      },
    ],
  ],
  IP = [
    [
      `path`,
      {
        d: `M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z`,
      },
    ],
    [`path`, { d: `M5 17A12 12 0 0 1 17 5` }],
    [`circle`, { cx: `19`, cy: `5`, r: `2` }],
    [`circle`, { cx: `5`, cy: `19`, r: `2` }],
  ],
  LP = [
    [`circle`, { cx: `19`, cy: `5`, r: `2` }],
    [`circle`, { cx: `5`, cy: `19`, r: `2` }],
    [`path`, { d: `M5 17A12 12 0 0 1 17 5` }],
  ],
  RP = [
    [`path`, { d: `M16 3h5v5` }],
    [`path`, { d: `M8 3H3v5` }],
    [`path`, { d: `M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3` }],
    [`path`, { d: `m15 9 6-6` }],
  ],
  zP = [
    [
      `path`,
      {
        d: `M17 13.44 4.442 17.082A2 2 0 0 0 4.982 21H19a2 2 0 0 0 .558-3.921l-1.115-.32A2 2 0 0 1 17 14.837V7.66`,
      },
    ],
    [
      `path`,
      {
        d: `m7 10.56 12.558-3.642A2 2 0 0 0 19.018 3H5a2 2 0 0 0-.558 3.921l1.115.32A2 2 0 0 1 7 9.163v7.178`,
      },
    ],
  ],
  BP = [
    [`path`, { d: `m15 10.42 4.8-5.07` }],
    [`path`, { d: `M19 18h3` }],
    [
      `path`,
      {
        d: `M9.5 22 21.414 9.415A2 2 0 0 0 21.2 6.4l-5.61-4.208A1 1 0 0 0 14 3v2a2 2 0 0 1-1.394 1.906L8.677 8.053A1 1 0 0 0 8 9c-.155 6.393-2.082 9-4 9a2 2 0 0 0 0 4h14`,
      },
    ],
  ],
  VP = [
    [`path`, { d: `M15.295 19.562 16 22` }],
    [`path`, { d: `m17 16 3.758 2.098` }],
    [`path`, { d: `m19 12.5 3.026-.598` }],
    [
      `path`,
      {
        d: `M7.61 6.3a3 3 0 0 0-3.92 1.3l-1.38 2.79a3 3 0 0 0 1.3 3.91l6.89 3.597a1 1 0 0 0 1.342-.447l3.106-6.211a1 1 0 0 0-.447-1.341z`,
      },
    ],
    [`path`, { d: `M8 9V2` }],
  ],
  HP = [
    [`path`, { d: `M3 3h.01` }],
    [`path`, { d: `M7 5h.01` }],
    [`path`, { d: `M11 7h.01` }],
    [`path`, { d: `M3 7h.01` }],
    [`path`, { d: `M7 9h.01` }],
    [`path`, { d: `M3 11h.01` }],
    [`rect`, { width: `4`, height: `4`, x: `15`, y: `5` }],
    [`path`, { d: `m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2` }],
    [`path`, { d: `m13 14 8-2` }],
    [`path`, { d: `m13 19 8-2` }],
  ],
  UP = [
    [
      `path`,
      {
        d: `M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3`,
      },
    ],
    [`path`, { d: `M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4` }],
    [`path`, { d: `M5 21h14` }],
  ],
  WP = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M17 12h-2l-2 5-2-10-2 5H7` }],
  ],
  GP = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `m16 8-8 8` }],
    [`path`, { d: `M16 16H8V8` }],
  ],
  KP = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `m8 8 8 8` }],
    [`path`, { d: `M16 8v8H8` }],
  ],
  qP = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M12 8v8` }],
    [`path`, { d: `m8 12 4 4 4-4` }],
  ],
  JP = [
    [`path`, { d: `M13 21h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6` }],
    [`path`, { d: `m3 21 9-9` }],
    [`path`, { d: `M9 21H3v-6` }],
  ],
  YP = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `m12 8-4 4 4 4` }],
    [`path`, { d: `M16 12H8` }],
  ],
  XP = [
    [
      `path`,
      { d: `M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6` },
    ],
    [`path`, { d: `m21 21-9-9` }],
    [`path`, { d: `M21 15v6h-6` }],
  ],
  ZP = [
    [`path`, { d: `M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6` }],
    [`path`, { d: `m21 3-9 9` }],
    [`path`, { d: `M15 3h6v6` }],
  ],
  QP = [
    [`path`, { d: `m10 16 4-4-4-4` }],
    [`path`, { d: `M3 12h11` }],
    [
      `path`,
      {
        d: `M3 8V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3`,
      },
    ],
  ],
  $P = [
    [
      `path`,
      { d: `M13 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6` },
    ],
    [`path`, { d: `m3 3 9 9` }],
    [`path`, { d: `M3 9V3h6` }],
  ],
  eF = [
    [`path`, { d: `M10 12h11` }],
    [`path`, { d: `m17 16 4-4-4-4` }],
    [
      `path`,
      {
        d: `M21 6.344V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1.344`,
      },
    ],
  ],
  tF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M8 12h8` }],
    [`path`, { d: `m12 16 4-4-4-4` }],
  ],
  nF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M8 16V8h8` }],
    [`path`, { d: `M16 16 8 8` }],
  ],
  rF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M8 8h8v8` }],
    [`path`, { d: `m8 16 8-8` }],
  ],
  iF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `m16 12-4-4-4 4` }],
    [`path`, { d: `M12 16V8` }],
  ],
  aF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M12 8v8` }],
    [`path`, { d: `m8.5 14 7-4` }],
    [`path`, { d: `m8.5 10 7 4` }],
  ],
  oF = [
    [`line`, { x1: `5`, y1: `3`, x2: `19`, y2: `3` }],
    [`line`, { x1: `3`, y1: `5`, x2: `3`, y2: `19` }],
    [`line`, { x1: `21`, y1: `5`, x2: `21`, y2: `19` }],
    [`line`, { x1: `9`, y1: `21`, x2: `10`, y2: `21` }],
    [`line`, { x1: `14`, y1: `21`, x2: `15`, y2: `21` }],
    [`path`, { d: `M 3 5 A2 2 0 0 1 5 3` }],
    [`path`, { d: `M 19 3 A2 2 0 0 1 21 5` }],
    [`path`, { d: `M 5 21 A2 2 0 0 1 3 19` }],
    [`path`, { d: `M 21 19 A2 2 0 0 1 19 21` }],
    [`circle`, { cx: `8.5`, cy: `8.5`, r: `1.5` }],
    [`line`, { x1: `9.56066`, y1: `9.56066`, x2: `12`, y2: `12` }],
    [`line`, { x1: `17`, y1: `17`, x2: `14.82`, y2: `14.82` }],
    [`circle`, { cx: `8.5`, cy: `15.5`, r: `1.5` }],
    [`line`, { x1: `9.56066`, y1: `14.43934`, x2: `17`, y2: `7` }],
  ],
  sF = [
    [`path`, { d: `M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3` }],
    [`path`, { d: `M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3` }],
    [`path`, { d: `M12 20v2` }],
    [`path`, { d: `M12 14v2` }],
    [`path`, { d: `M12 8v2` }],
    [`path`, { d: `M12 2v2` }],
  ],
  cF = [
    [`path`, { d: `M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3` }],
    [`path`, { d: `M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3` }],
    [`path`, { d: `M4 12H2` }],
    [`path`, { d: `M10 12H8` }],
    [`path`, { d: `M16 12h-2` }],
    [`path`, { d: `M22 12h-2` }],
  ],
  lF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M9 8h7` }],
    [`path`, { d: `M8 12h6` }],
    [`path`, { d: `M11 16h5` }],
  ],
  uF = [
    [
      `path`,
      {
        d: `M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344`,
      },
    ],
    [`path`, { d: `m9 11 3 3L22 4` }],
  ],
  dF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `m9 12 2 2 4-4` }],
  ],
  fF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `m16 10-4 4-4-4` }],
  ],
  pF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `m14 16-4-4 4-4` }],
  ],
  mF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `m10 8 4 4-4 4` }],
  ],
  hF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `m8 14 4-4 4 4` }],
  ],
  gF = [
    [`path`, { d: `m10 9-3 3 3 3` }],
    [`path`, { d: `m14 15 3-3-3-3` }],
    [`rect`, { x: `3`, y: `3`, width: `18`, height: `18`, rx: `2` }],
  ],
  _F = [
    [`path`, { d: `M10 9.5 8 12l2 2.5` }],
    [`path`, { d: `M14 21h1` }],
    [`path`, { d: `m14 9.5 2 2.5-2 2.5` }],
    [
      `path`,
      {
        d: `M5 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2`,
      },
    ],
    [`path`, { d: `M9 21h1` }],
  ],
  vF = [
    [`path`, { d: `M8 7v7` }],
    [`path`, { d: `M12 7v4` }],
    [`path`, { d: `M16 7v9` }],
    [`path`, { d: `M5 3a2 2 0 0 0-2 2` }],
    [`path`, { d: `M9 3h1` }],
    [`path`, { d: `M14 3h1` }],
    [`path`, { d: `M19 3a2 2 0 0 1 2 2` }],
    [`path`, { d: `M21 9v1` }],
    [`path`, { d: `M21 14v1` }],
    [`path`, { d: `M21 19a2 2 0 0 1-2 2` }],
    [`path`, { d: `M14 21h1` }],
    [`path`, { d: `M9 21h1` }],
    [`path`, { d: `M5 21a2 2 0 0 1-2-2` }],
    [`path`, { d: `M3 14v1` }],
    [`path`, { d: `M3 9v1` }],
  ],
  yF = [
    [
      `path`,
      {
        d: `M5 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2`,
      },
    ],
    [`path`, { d: `M9 21h1` }],
    [`path`, { d: `M14 21h1` }],
  ],
  bF = [
    [
      `path`,
      {
        d: `M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z`,
      },
    ],
    [`path`, { d: `M5 3a2 2 0 0 0-2 2` }],
    [`path`, { d: `M19 3a2 2 0 0 1 2 2` }],
    [`path`, { d: `M5 21a2 2 0 0 1-2-2` }],
    [`path`, { d: `M9 3h1` }],
    [`path`, { d: `M9 21h2` }],
    [`path`, { d: `M14 3h1` }],
    [`path`, { d: `M3 9v1` }],
    [`path`, { d: `M21 9v2` }],
    [`path`, { d: `M3 14v1` }],
  ],
  xF = [
    [`path`, { d: `M14 21h1` }],
    [`path`, { d: `M14 3h1` }],
    [`path`, { d: `M19 3a2 2 0 0 1 2 2` }],
    [`path`, { d: `M21 14v1` }],
    [`path`, { d: `M21 19a2 2 0 0 1-2 2` }],
    [`path`, { d: `M21 9v1` }],
    [`path`, { d: `M3 14v1` }],
    [`path`, { d: `M3 9v1` }],
    [`path`, { d: `M5 21a2 2 0 0 1-2-2` }],
    [`path`, { d: `M5 3a2 2 0 0 0-2 2` }],
    [`path`, { d: `M7 12h10` }],
    [`path`, { d: `M7 16h6` }],
    [`path`, { d: `M7 8h8` }],
    [`path`, { d: `M9 21h1` }],
    [`path`, { d: `M9 3h1` }],
  ],
  SF = [
    [`path`, { d: `M14 21h1` }],
    [`path`, { d: `M21 14v1` }],
    [`path`, { d: `M21 19a2 2 0 0 1-2 2` }],
    [`path`, { d: `M21 9v1` }],
    [`path`, { d: `M3 14v1` }],
    [`path`, { d: `M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2` }],
    [`path`, { d: `M3 9v1` }],
    [`path`, { d: `M5 21a2 2 0 0 1-2-2` }],
    [`path`, { d: `M9 21h1` }],
  ],
  CF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2`, ry: `2` }],
    [`line`, { x1: `8`, x2: `16`, y1: `12`, y2: `12` }],
    [`line`, { x1: `12`, x2: `12`, y1: `16`, y2: `16` }],
    [`line`, { x1: `12`, x2: `12`, y1: `8`, y2: `8` }],
  ],
  wF = [
    [`path`, { d: `M5 3a2 2 0 0 0-2 2` }],
    [`path`, { d: `M19 3a2 2 0 0 1 2 2` }],
    [`path`, { d: `M21 19a2 2 0 0 1-2 2` }],
    [`path`, { d: `M5 21a2 2 0 0 1-2-2` }],
    [`path`, { d: `M9 3h1` }],
    [`path`, { d: `M9 21h1` }],
    [`path`, { d: `M14 3h1` }],
    [`path`, { d: `M14 21h1` }],
    [`path`, { d: `M3 9v1` }],
    [`path`, { d: `M21 9v1` }],
    [`path`, { d: `M3 14v1` }],
    [`path`, { d: `M21 14v1` }],
  ],
  TF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`circle`, { cx: `12`, cy: `12`, r: `1` }],
  ],
  EF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M7 10h10` }],
    [`path`, { d: `M7 14h10` }],
  ],
  DF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2`, ry: `2` }],
    [`path`, { d: `M9 17c2 0 2.8-1 2.8-2.8V10c0-2 1-3.3 3.2-3` }],
    [`path`, { d: `M9 11.2h5.7` }],
  ],
  OF = [
    [
      `path`,
      {
        d: `M8 16V8.5a.5.5 0 0 1 .9-.3l2.7 3.599a.5.5 0 0 0 .8 0l2.7-3.6a.5.5 0 0 1 .9.3V16`,
      },
    ],
    [`rect`, { x: `3`, y: `3`, width: `18`, height: `18`, rx: `2` }],
  ],
  kF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M7 7v10` }],
    [`path`, { d: `M11 7v10` }],
    [`path`, { d: `m15 7 2 10` }],
  ],
  AF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M8 7v7` }],
    [`path`, { d: `M12 7v4` }],
    [`path`, { d: `M16 7v9` }],
  ],
  jF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M8 12h8` }],
  ],
  MF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M7 8h10` }],
    [`path`, { d: `M7 12h10` }],
    [`path`, { d: `M7 16h10` }],
  ],
  NF = [
    [
      `path`,
      {
        d: `M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z`,
      },
    ],
    [
      `path`,
      { d: `M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6` },
    ],
  ],
  PF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M9 17V7h4a3 3 0 0 1 0 6H9` }],
  ],
  FF = [
    [
      `path`,
      { d: `M3.6 3.6A2 2 0 0 1 5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-.59 1.41` },
    ],
    [`path`, { d: `M3 8.7V19a2 2 0 0 0 2 2h10.3` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M13 13a3 3 0 1 0 0-6H9v2` }],
    [`path`, { d: `M9 17v-2.3` }],
  ],
  IF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`line`, { x1: `10`, x2: `10`, y1: `15`, y2: `9` }],
    [`line`, { x1: `14`, x2: `14`, y1: `15`, y2: `9` }],
  ],
  LF = [
    [
      `path`,
      { d: `M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7` },
    ],
    [
      `path`,
      {
        d: `M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z`,
      },
    ],
  ],
  RF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `m15 9-6 6` }],
    [`path`, { d: `M9 9h.01` }],
    [`path`, { d: `M15 15h.01` }],
  ],
  zF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M7 7h10` }],
    [`path`, { d: `M10 7v10` }],
    [`path`, { d: `M16 17a2 2 0 0 1-2-2V7` }],
  ],
  BF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M12 12H9.5a2.5 2.5 0 0 1 0-5H17` }],
    [`path`, { d: `M12 7v10` }],
    [`path`, { d: `M16 7v10` }],
  ],
  VF = [
    [`rect`, { x: `3`, y: `3`, width: `18`, height: `18`, rx: `2` }],
    [
      `path`,
      {
        d: `M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z`,
      },
    ],
  ],
  HF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M8 12h8` }],
    [`path`, { d: `M12 8v8` }],
  ],
  UF = [
    [`path`, { d: `M12 7v4` }],
    [`path`, { d: `M7.998 9.003a5 5 0 1 0 8-.005` }],
    [`rect`, { x: `3`, y: `3`, width: `18`, height: `18`, rx: `2` }],
  ],
  WF = [
    [`path`, { d: `M7 12h2l2 5 2-10h4` }],
    [`rect`, { x: `3`, y: `3`, width: `18`, height: `18`, rx: `2` }],
  ],
  GF = [
    [`path`, { d: `M21 11a8 8 0 0 0-8-8` }],
    [`path`, { d: `M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4` }],
  ],
  KF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M16 8.9V7H8l4 5-4 5h8v-1.9` }],
  ],
  qF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`circle`, { cx: `8.5`, cy: `8.5`, r: `1.5` }],
    [`line`, { x1: `9.56066`, y1: `9.56066`, x2: `12`, y2: `12` }],
    [`line`, { x1: `17`, y1: `17`, x2: `14.82`, y2: `14.82` }],
    [`circle`, { cx: `8.5`, cy: `15.5`, r: `1.5` }],
    [`line`, { x1: `9.56066`, y1: `14.43934`, x2: `17`, y2: `7` }],
  ],
  JF = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`line`, { x1: `9`, x2: `15`, y1: `15`, y2: `9` }],
  ],
  YF = [
    [`path`, { d: `M8 19H5c-1 0-2-1-2-2V7c0-1 1-2 2-2h3` }],
    [`path`, { d: `M16 5h3c1 0 2 1 2 2v10c0 1-1 2-2 2h-3` }],
    [`line`, { x1: `12`, x2: `12`, y1: `4`, y2: `20` }],
  ],
  XF = [
    [`path`, { d: `M5 8V5c0-1 1-2 2-2h10c1 0 2 1 2 2v3` }],
    [`path`, { d: `M19 16v3c0 1-1 2-2 2H7c-1 0-2-1-2-2v-3` }],
    [`line`, { x1: `4`, x2: `20`, y1: `12`, y2: `12` }],
  ],
  ZF = [
    [`rect`, { x: `3`, y: `3`, width: `18`, height: `18`, rx: `2` }],
    [`rect`, { x: `8`, y: `8`, width: `8`, height: `8`, rx: `1` }],
  ],
  QF = [
    [
      `path`,
      {
        d: `M11.035 7.69a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z`,
      },
    ],
    [`rect`, { x: `3`, y: `3`, width: `18`, height: `18`, rx: `2` }],
  ],
  $F = [
    [`path`, { d: `M4 10c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2` }],
    [`path`, { d: `M10 16c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2` }],
    [`rect`, { width: `8`, height: `8`, x: `14`, y: `14`, rx: `2` }],
  ],
  eI = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`rect`, { x: `9`, y: `9`, width: `6`, height: `6`, rx: `1` }],
  ],
  tI = [
    [`path`, { d: `m7 11 2-2-2-2` }],
    [`path`, { d: `M11 13h4` }],
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2`, ry: `2` }],
  ],
  nI = [
    [`path`, { d: `M18 21a6 6 0 0 0-12 0` }],
    [`circle`, { cx: `12`, cy: `11`, r: `4` }],
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
  ],
  rI = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`circle`, { cx: `12`, cy: `10`, r: `3` }],
    [`path`, { d: `M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2` }],
  ],
  iI = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2`, ry: `2` }],
    [`path`, { d: `m15 9-6 6` }],
    [`path`, { d: `m9 9 6 6` }],
  ],
  aI = [[`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }]],
  oI = [
    [`path`, { d: `M10 22a2 2 0 0 1-2-2` }],
    [`path`, { d: `M14 2a2 2 0 0 1 2 2` }],
    [`path`, { d: `M16 22h-2` }],
    [`path`, { d: `M2 10V8` }],
    [`path`, { d: `M2 4a2 2 0 0 1 2-2` }],
    [`path`, { d: `M20 8a2 2 0 0 1 2 2` }],
    [`path`, { d: `M22 14v2` }],
    [`path`, { d: `M22 20a2 2 0 0 1-2 2` }],
    [`path`, { d: `M4 16a2 2 0 0 1-2-2` }],
    [
      `path`,
      {
        d: `M8 10a2 2 0 0 1 2-2h5a1 1 0 0 1 1 1v5a2 2 0 0 1-2 2H9a1 1 0 0 1-1-1z`,
      },
    ],
    [`path`, { d: `M8 2h2` }],
  ],
  sI = [
    [
      `path`,
      {
        d: `M16 12v2a2 2 0 0 1-2 2H9a1 1 0 0 0-1 1v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h0`,
      },
    ],
    [
      `path`,
      {
        d: `M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3a1 1 0 0 1-1 1h-5a2 2 0 0 0-2 2v2`,
      },
    ],
  ],
  cI = [
    [
      `path`,
      {
        d: `M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3a1 1 0 0 0 1 1h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-3a1 1 0 0 0-1-1z`,
      },
    ],
  ],
  lI = [
    [`path`, { d: `M10 22a2 2 0 0 1-2-2` }],
    [`path`, { d: `M16 22h-2` }],
    [
      `path`,
      {
        d: `M16 4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-5a2 2 0 0 1 2-2h5a1 1 0 0 0 1-1z`,
      },
    ],
    [`path`, { d: `M20 8a2 2 0 0 1 2 2` }],
    [`path`, { d: `M22 14v2` }],
    [`path`, { d: `M22 20a2 2 0 0 1-2 2` }],
  ],
  uI = [
    [`path`, { d: `M13.77 3.043a34 34 0 0 0-3.54 0` }],
    [`path`, { d: `M13.771 20.956a33 33 0 0 1-3.541.001` }],
    [`path`, { d: `M20.18 17.74c-.51 1.15-1.29 1.93-2.439 2.44` }],
    [`path`, { d: `M20.18 6.259c-.51-1.148-1.291-1.929-2.44-2.438` }],
    [`path`, { d: `M20.957 10.23a33 33 0 0 1 0 3.54` }],
    [`path`, { d: `M3.043 10.23a34 34 0 0 0 .001 3.541` }],
    [`path`, { d: `M6.26 20.179c-1.15-.508-1.93-1.29-2.44-2.438` }],
    [`path`, { d: `M6.26 3.82c-1.149.51-1.93 1.291-2.44 2.44` }],
  ],
  dI = [
    [`path`, { d: `M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9` }],
  ],
  fI = [
    [`path`, { d: `M15.236 22a3 3 0 0 0-2.2-5` }],
    [`path`, { d: `M16 20a3 3 0 0 1 3-3h1a2 2 0 0 0 2-2v-2a4 4 0 0 0-4-4V4` }],
    [`path`, { d: `M18 13h.01` }],
    [
      `path`,
      {
        d: `M18 6a4 4 0 0 0-4 4 7 7 0 0 0-7 7c0-5 4-5 4-10.5a4.5 4.5 0 1 0-9 0 2.5 2.5 0 0 0 5 0C7 10 3 11 3 17c0 2.8 2.2 5 5 5h10`,
      },
    ],
  ],
  pI = [
    [`path`, { d: `M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-6 0c0 2 1 2 1 3.5V13` }],
    [
      `path`,
      {
        d: `M20 15.5a2.5 2.5 0 0 0-2.5-2.5h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1z`,
      },
    ],
    [`path`, { d: `M5 22h14` }],
  ],
  mI = [
    [
      `path`,
      {
        d: `M12 18.338a2.1 2.1 0 0 0-.987.244L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16l2.309-4.679A.53.53 0 0 1 12 2`,
      },
    ],
  ],
  hI = [
    [
      `path`,
      {
        d: `m10.344 4.688 1.181-2.393a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.237 3.152`,
      },
    ],
    [
      `path`,
      {
        d: `m17.945 17.945.43 2.505a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a8 8 0 0 0 .4-.099`,
      },
    ],
    [`path`, { d: `m2 2 20 20` }],
  ],
  gI = [
    [
      `path`,
      {
        d: `M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z`,
      },
    ],
  ],
  _I = [
    [
      `path`,
      {
        d: `M13.971 4.285A2 2 0 0 1 17 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z`,
      },
    ],
    [`path`, { d: `M21 20V4` }],
  ],
  vI = [
    [
      `path`,
      {
        d: `M10.029 4.285A2 2 0 0 0 7 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z`,
      },
    ],
    [`path`, { d: `M3 4v16` }],
  ],
  yI = [
    [`path`, { d: `M11 2v2` }],
    [`path`, { d: `M5 2v2` }],
    [`path`, { d: `M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1` }],
    [`path`, { d: `M8 15a6 6 0 0 0 12 0v-3` }],
    [`circle`, { cx: `20`, cy: `10`, r: `2` }],
  ],
  bI = [
    [
      `path`,
      {
        d: `M21 9a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z`,
      },
    ],
    [`path`, { d: `M15 3v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M8 13h.01` }],
    [`path`, { d: `M16 13h.01` }],
    [`path`, { d: `M10 16s.8 1 2 1c1.3 0 2-1 2-1` }],
  ],
  xI = [
    [`path`, { d: `m15 19 2 2 4-4` }],
    [`path`, { d: `M15 3v5a1 1 0 0 0 1 1h5` }],
    [
      `path`,
      {
        d: `M21 13V9a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6.5`,
      },
    ],
  ],
  SI = [
    [`path`, { d: `M15 3v5a1 1 0 0 0 1 1h5` }],
    [
      `path`,
      {
        d: `M21 14V9a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.35`,
      },
    ],
    [`path`, { d: `M21 18h-6` }],
  ],
  CI = [
    [`path`, { d: `M15 3v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `M18 15v6` }],
    [
      `path`,
      {
        d: `M21 12.356V9a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.355`,
      },
    ],
    [`path`, { d: `M21 18h-6` }],
  ],
  wI = [
    [`path`, { d: `M15 3v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `m2 2 20 20` }],
    [
      `path`,
      {
        d: `M3.586 3.586A2 2 0 0 0 3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 1.414-.586`,
      },
    ],
    [
      `path`,
      {
        d: `M8.656 3H15a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 21 9v6.344`,
      },
    ],
  ],
  TI = [
    [`path`, { d: `M15 3v5a1 1 0 0 0 1 1h5` }],
    [`path`, { d: `m16 16 5 5` }],
    [
      `path`,
      {
        d: `M21 12V9a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7`,
      },
    ],
    [`path`, { d: `m21 16-5 5` }],
  ],
  EI = [
    [
      `path`,
      {
        d: `M21 9a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z`,
      },
    ],
    [`path`, { d: `M15 3v5a1 1 0 0 0 1 1h5` }],
  ],
  DI = [
    [
      `path`,
      {
        d: `M10 8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 16 14v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z`,
      },
    ],
    [`path`, { d: `M10 8v5a1 1 0 0 0 1 1h5` }],
    [
      `path`,
      {
        d: `M8 4a2 2 0 0 1 2-2h6a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 22 8v6a2 2 0 0 1-2 2`,
      },
    ],
    [`path`, { d: `M16 2v5a1 1 0 0 0 1 1h5` }],
  ],
  OI = [
    [
      `path`,
      {
        d: `M11.264 2.205A4 4 0 0 0 6.42 4.211l-4 8a4 4 0 0 0 1.359 5.117l6 4a4 4 0 0 0 4.438 0l6-4a4 4 0 0 0 1.576-4.592l-2-6a4 4 0 0 0-2.53-2.53z`,
      },
    ],
    [`path`, { d: `M11.99 22 14 12l7.822 3.184` }],
    [`path`, { d: `M14 12 8.47 2.302` }],
  ],
  kI = [
    [`path`, { d: `M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5` }],
    [
      `path`,
      {
        d: `M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244`,
      },
    ],
    [`path`, { d: `M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05` }],
  ],
  AI = [
    [`rect`, { width: `20`, height: `6`, x: `2`, y: `4`, rx: `2` }],
    [`rect`, { width: `20`, height: `6`, x: `2`, y: `14`, rx: `2` }],
  ],
  jI = [
    [`rect`, { width: `6`, height: `20`, x: `4`, y: `2`, rx: `2` }],
    [`rect`, { width: `6`, height: `20`, x: `14`, y: `2`, rx: `2` }],
  ],
  MI = [
    [`path`, { d: `M16 4H9a3 3 0 0 0-2.83 4` }],
    [`path`, { d: `M14 12a4 4 0 0 1 0 8H6` }],
    [`line`, { x1: `4`, x2: `20`, y1: `12`, y2: `12` }],
  ],
  NI = [
    [`path`, { d: `m4 5 8 8` }],
    [`path`, { d: `m12 5-8 8` }],
    [
      `path`,
      {
        d: `M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07`,
      },
    ],
  ],
  PI = [
    [`circle`, { cx: `12`, cy: `12`, r: `4` }],
    [`path`, { d: `M12 4h.01` }],
    [`path`, { d: `M20 12h.01` }],
    [`path`, { d: `M12 20h.01` }],
    [`path`, { d: `M4 12h.01` }],
    [`path`, { d: `M17.657 6.343h.01` }],
    [`path`, { d: `M17.657 17.657h.01` }],
    [`path`, { d: `M6.343 17.657h.01` }],
    [`path`, { d: `M6.343 6.343h.01` }],
  ],
  FI = [
    [`circle`, { cx: `12`, cy: `12`, r: `4` }],
    [`path`, { d: `M12 3v1` }],
    [`path`, { d: `M12 20v1` }],
    [`path`, { d: `M3 12h1` }],
    [`path`, { d: `M20 12h1` }],
    [`path`, { d: `m18.364 5.636-.707.707` }],
    [`path`, { d: `m6.343 17.657-.707.707` }],
    [`path`, { d: `m5.636 5.636.707.707` }],
    [`path`, { d: `m17.657 17.657.707.707` }],
  ],
  II = [
    [`path`, { d: `M12 2v2` }],
    [
      `path`,
      {
        d: `M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715`,
      },
    ],
    [`path`, { d: `M16 12a4 4 0 0 0-4-4` }],
    [`path`, { d: `m19 5-1.256 1.256` }],
    [`path`, { d: `M20 12h2` }],
  ],
  LI = [
    [`path`, { d: `M10 21v-1` }],
    [`path`, { d: `M10 4V3` }],
    [`path`, { d: `M10 9a3 3 0 0 0 0 6` }],
    [`path`, { d: `m14 20 1.25-2.5L18 18` }],
    [`path`, { d: `m14 4 1.25 2.5L18 6` }],
    [`path`, { d: `m17 21-3-6 1.5-3H22` }],
    [`path`, { d: `m17 3-3 6 1.5 3` }],
    [`path`, { d: `M2 12h1` }],
    [`path`, { d: `m20 10-1.5 2 1.5 2` }],
    [`path`, { d: `m3.64 18.36.7-.7` }],
    [`path`, { d: `m4.34 6.34-.7-.7` }],
  ],
  RI = [
    [`circle`, { cx: `12`, cy: `12`, r: `4` }],
    [`path`, { d: `M12 2v2` }],
    [`path`, { d: `M12 20v2` }],
    [`path`, { d: `m4.93 4.93 1.41 1.41` }],
    [`path`, { d: `m17.66 17.66 1.41 1.41` }],
    [`path`, { d: `M2 12h2` }],
    [`path`, { d: `M20 12h2` }],
    [`path`, { d: `m6.34 17.66-1.41 1.41` }],
    [`path`, { d: `m19.07 4.93-1.41 1.41` }],
  ],
  zI = [
    [`path`, { d: `M12 2v8` }],
    [`path`, { d: `m4.93 10.93 1.41 1.41` }],
    [`path`, { d: `M2 18h2` }],
    [`path`, { d: `M20 18h2` }],
    [`path`, { d: `m19.07 10.93-1.41 1.41` }],
    [`path`, { d: `M22 22H2` }],
    [`path`, { d: `m8 6 4-4 4 4` }],
    [`path`, { d: `M16 18a4 4 0 0 0-8 0` }],
  ],
  BI = [
    [`path`, { d: `m4 19 8-8` }],
    [`path`, { d: `m12 19-8-8` }],
    [
      `path`,
      {
        d: `M20 12h-4c0-1.5.442-2 1.5-2.5S20 8.334 20 7.002c0-.472-.17-.93-.484-1.29a2.105 2.105 0 0 0-2.617-.436c-.42.239-.738.614-.899 1.06`,
      },
    ],
  ],
  VI = [
    [`path`, { d: `M12 10V2` }],
    [`path`, { d: `m4.93 10.93 1.41 1.41` }],
    [`path`, { d: `M2 18h2` }],
    [`path`, { d: `M20 18h2` }],
    [`path`, { d: `m19.07 10.93-1.41 1.41` }],
    [`path`, { d: `M22 22H2` }],
    [`path`, { d: `m16 6-4 4-4-4` }],
    [`path`, { d: `M16 18a4 4 0 0 0-8 0` }],
  ],
  HI = [
    [`path`, { d: `M11 17a4 4 0 0 1-8 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2Z` }],
    [`path`, { d: `M16.7 13H19a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7` }],
    [`path`, { d: `M 7 17h.01` }],
    [
      `path`,
      {
        d: `m11 8 2.3-2.3a2.4 2.4 0 0 1 3.404.004L18.6 7.6a2.4 2.4 0 0 1 .026 3.434L9.9 19.8`,
      },
    ],
  ],
  UI = [
    [`path`, { d: `M10 21V3h8` }],
    [`path`, { d: `M6 16h9` }],
    [`path`, { d: `M10 9.5h7` }],
  ],
  WI = [
    [`path`, { d: `M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5` }],
    [`path`, { d: `M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5` }],
    [`circle`, { cx: `12`, cy: `12`, r: `3` }],
    [`path`, { d: `m18 22-3-3 3-3` }],
    [`path`, { d: `m6 2 3 3-3 3` }],
  ],
  GI = [
    [`path`, { d: `m11 19-6-6` }],
    [`path`, { d: `m5 21-2-2` }],
    [`path`, { d: `m8 16-4 4` }],
    [`path`, { d: `M9.5 17.5 21 6V3h-3L6.5 14.5` }],
  ],
  KI = [
    [`polyline`, { points: `14.5 17.5 3 6 3 3 6 3 17.5 14.5` }],
    [`line`, { x1: `13`, x2: `19`, y1: `19`, y2: `13` }],
    [`line`, { x1: `16`, x2: `20`, y1: `16`, y2: `20` }],
    [`line`, { x1: `19`, x2: `21`, y1: `21`, y2: `19` }],
    [`polyline`, { points: `14.5 6.5 18 3 21 3 21 6 17.5 9.5` }],
    [`line`, { x1: `5`, x2: `9`, y1: `14`, y2: `18` }],
    [`line`, { x1: `7`, x2: `4`, y1: `17`, y2: `20` }],
    [`line`, { x1: `3`, x2: `5`, y1: `19`, y2: `21` }],
  ],
  qI = [
    [`path`, { d: `m18 2 4 4` }],
    [`path`, { d: `m17 7 3-3` }],
    [
      `path`,
      { d: `M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5` },
    ],
    [`path`, { d: `m9 11 4 4` }],
    [`path`, { d: `m5 19-3 3` }],
    [`path`, { d: `m14 4 6 6` }],
  ],
  JI = [
    [
      `path`,
      {
        d: `M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18`,
      },
    ],
  ],
  YI = [
    [`path`, { d: `M12 21v-6` }],
    [`path`, { d: `M12 9V3` }],
    [`path`, { d: `M3 15h18` }],
    [`path`, { d: `M3 9h18` }],
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
  ],
  XI = [
    [`path`, { d: `M12 15V9` }],
    [`path`, { d: `M3 15h18` }],
    [`path`, { d: `M3 9h18` }],
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
  ],
  ZI = [
    [`path`, { d: `M14 14v2` }],
    [`path`, { d: `M14 20v2` }],
    [`path`, { d: `M14 2v2` }],
    [`path`, { d: `M14 8v2` }],
    [`path`, { d: `M2 15h8` }],
    [`path`, { d: `M2 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2` }],
    [`path`, { d: `M2 9h8` }],
    [`path`, { d: `M22 15h-4` }],
    [`path`, { d: `M22 3h-2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2` }],
    [`path`, { d: `M22 9h-4` }],
    [`path`, { d: `M5 3v18` }],
  ],
  QI = [
    [`path`, { d: `M16 5H3` }],
    [`path`, { d: `M16 12H3` }],
    [`path`, { d: `M16 19H3` }],
    [`path`, { d: `M21 5h.01` }],
    [`path`, { d: `M21 12h.01` }],
    [`path`, { d: `M21 19h.01` }],
  ],
  $I = [
    [`path`, { d: `M15 3v18` }],
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M21 9H3` }],
    [`path`, { d: `M21 15H3` }],
  ],
  eL = [
    [`path`, { d: `M14 10h2` }],
    [`path`, { d: `M15 22v-8` }],
    [`path`, { d: `M15 2v4` }],
    [`path`, { d: `M2 10h2` }],
    [`path`, { d: `M20 10h2` }],
    [`path`, { d: `M3 19h18` }],
    [`path`, { d: `M3 22v-6a2 2 135 0 1 2-2h14a2 2 45 0 1 2 2v6` }],
    [`path`, { d: `M3 2v2a2 2 45 0 0 2 2h14a2 2 135 0 0 2-2V2` }],
    [`path`, { d: `M8 10h2` }],
    [`path`, { d: `M9 22v-8` }],
    [`path`, { d: `M9 2v4` }],
  ],
  tL = [
    [`path`, { d: `M12 3v18` }],
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M3 9h18` }],
    [`path`, { d: `M3 15h18` }],
  ],
  nL = [
    [`rect`, { width: `10`, height: `14`, x: `3`, y: `8`, rx: `2` }],
    [
      `path`,
      { d: `M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4` },
    ],
    [`path`, { d: `M8 18h.01` }],
  ],
  rL = [
    [`rect`, { width: `16`, height: `20`, x: `4`, y: `2`, rx: `2`, ry: `2` }],
    [`line`, { x1: `12`, x2: `12.01`, y1: `18`, y2: `18` }],
  ],
  iL = [
    [`circle`, { cx: `7`, cy: `7`, r: `5` }],
    [`circle`, { cx: `17`, cy: `17`, r: `5` }],
    [`path`, { d: `M12 17h10` }],
    [`path`, { d: `m3.46 10.54 7.08-7.08` }],
  ],
  aL = [
    [
      `path`,
      {
        d: `M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z`,
      },
    ],
    [`circle`, { cx: `7.5`, cy: `7.5`, r: `.5`, fill: `currentColor` }],
  ],
  oL = [
    [
      `path`,
      {
        d: `M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1z`,
      },
    ],
    [
      `path`,
      {
        d: `M2 7v6.172a2 2 0 0 0 .586 1.414l6.71 6.71a2.4 2.4 0 0 0 3.191.193`,
      },
    ],
    [`circle`, { cx: `10.5`, cy: `6.5`, r: `.5`, fill: `currentColor` }],
  ],
  sL = [
    [`path`, { d: `M4 4v16` }],
    [`path`, { d: `M9 4v16` }],
  ],
  cL = [[`path`, { d: `M4 4v16` }]],
  lL = [
    [`path`, { d: `M4 4v16` }],
    [`path`, { d: `M9 4v16` }],
    [`path`, { d: `M14 4v16` }],
  ],
  uL = [
    [`path`, { d: `M4 4v16` }],
    [`path`, { d: `M9 4v16` }],
    [`path`, { d: `M14 4v16` }],
    [`path`, { d: `M19 4v16` }],
  ],
  dL = [
    [`path`, { d: `M4 4v16` }],
    [`path`, { d: `M9 4v16` }],
    [`path`, { d: `M14 4v16` }],
    [`path`, { d: `M19 4v16` }],
    [`path`, { d: `M22 6 2 18` }],
  ],
  fL = [
    [`circle`, { cx: `17`, cy: `4`, r: `2` }],
    [`path`, { d: `M15.59 5.41 5.41 15.59` }],
    [`circle`, { cx: `4`, cy: `17`, r: `2` }],
    [`path`, { d: `M12 22s-4-9-1.5-11.5S22 12 22 12` }],
  ],
  pL = [
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
    [`circle`, { cx: `12`, cy: `12`, r: `6` }],
    [`circle`, { cx: `12`, cy: `12`, r: `2` }],
  ],
  mL = [
    [`circle`, { cx: `4`, cy: `4`, r: `2` }],
    [`path`, { d: `m14 5 3-3 3 3` }],
    [`path`, { d: `m14 10 3-3 3 3` }],
    [`path`, { d: `M17 14V2` }],
    [`path`, { d: `M17 14H7l-5 8h20Z` }],
    [`path`, { d: `M8 14v8` }],
    [`path`, { d: `m9 14 5 8` }],
  ],
  hL = [
    [
      `path`,
      {
        d: `m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44`,
      },
    ],
    [`path`, { d: `m13.56 11.747 4.332-.924` }],
    [`path`, { d: `m16 21-3.105-6.21` }],
    [
      `path`,
      {
        d: `M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z`,
      },
    ],
    [`path`, { d: `m6.158 8.633 1.114 4.456` }],
    [`path`, { d: `m8 21 3.105-6.21` }],
    [`circle`, { cx: `12`, cy: `13`, r: `2` }],
  ],
  gL = [
    [`path`, { d: `M3.5 21 14 3` }],
    [`path`, { d: `M20.5 21 10 3` }],
    [`path`, { d: `M15.5 21 12 15l-3.5 6` }],
    [`path`, { d: `M2 21h20` }],
  ],
  _L = [
    [`path`, { d: `M12 19h8` }],
    [`path`, { d: `m4 17 6-6-6-6` }],
  ],
  vL = [
    [
      `path`,
      { d: `M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2` },
    ],
    [`path`, { d: `M8.5 2h7` }],
    [`path`, { d: `M14.5 16h-5` }],
  ],
  yL = [
    [
      `path`,
      {
        d: `M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01a2.83 2.83 0 0 1 0-4L17 3`,
      },
    ],
    [`path`, { d: `m16 2 6 6` }],
    [`path`, { d: `M12 16H4` }],
  ],
  bL = [
    [`path`, { d: `M9 2v17.5A2.5 2.5 0 0 1 6.5 22A2.5 2.5 0 0 1 4 19.5V2` }],
    [`path`, { d: `M20 2v17.5a2.5 2.5 0 0 1-2.5 2.5a2.5 2.5 0 0 1-2.5-2.5V2` }],
    [`path`, { d: `M3 2h7` }],
    [`path`, { d: `M14 2h7` }],
    [`path`, { d: `M9 16H4` }],
    [`path`, { d: `M20 16h-5` }],
  ],
  xL = [
    [`path`, { d: `M21 5H3` }],
    [`path`, { d: `M21 12H9` }],
    [`path`, { d: `M21 19H7` }],
  ],
  SL = [
    [`path`, { d: `M21 5H3` }],
    [`path`, { d: `M17 12H7` }],
    [`path`, { d: `M19 19H5` }],
  ],
  CL = [
    [`path`, { d: `M3 5h18` }],
    [`path`, { d: `M3 12h18` }],
    [`path`, { d: `M3 19h18` }],
  ],
  wL = [
    [`path`, { d: `M21 5H3` }],
    [`path`, { d: `M15 12H3` }],
    [`path`, { d: `M17 19H3` }],
  ],
  TL = [
    [`path`, { d: `M12 20h-1a2 2 0 0 1-2-2 2 2 0 0 1-2 2H6` }],
    [`path`, { d: `M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7` }],
    [`path`, { d: `M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1` }],
    [`path`, { d: `M6 4h1a2 2 0 0 1 2 2 2 2 0 0 1 2-2h1` }],
    [`path`, { d: `M9 6v12` }],
  ],
  EL = [
    [`path`, { d: `M17 22h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1` }],
    [`path`, { d: `M7 22h1a4 4 0 0 0 4-4` }],
    [`path`, { d: `M7 2h1a4 4 0 0 1 4 4` }],
  ],
  DL = [
    [`path`, { d: `M15 5h6` }],
    [`path`, { d: `M15 12h6` }],
    [`path`, { d: `M3 19h18` }],
    [`path`, { d: `m3 12 3.553-7.724a.5.5 0 0 1 .894 0L11 12` }],
    [`path`, { d: `M3.92 10h6.16` }],
  ],
  OL = [
    [`path`, { d: `M17 5H3` }],
    [`path`, { d: `M21 12H8` }],
    [`path`, { d: `M21 19H8` }],
    [`path`, { d: `M3 12v7` }],
  ],
  kL = [
    [`path`, { d: `M21 5H3` }],
    [`path`, { d: `M10 12H3` }],
    [`path`, { d: `M10 19H3` }],
    [`circle`, { cx: `17`, cy: `15`, r: `3` }],
    [`path`, { d: `m21 19-1.9-1.9` }],
  ],
  AL = [
    [`path`, { d: `m16 16-3 3 3 3` }],
    [`path`, { d: `M3 12h14.5a1 1 0 0 1 0 7H13` }],
    [`path`, { d: `M3 19h6` }],
    [`path`, { d: `M3 5h18` }],
  ],
  jL = [
    [`path`, { d: `M2 10s3-3 3-8` }],
    [`path`, { d: `M22 10s-3-3-3-8` }],
    [`path`, { d: `M10 2c0 4.4-3.6 8-8 8` }],
    [`path`, { d: `M14 2c0 4.4 3.6 8 8 8` }],
    [`path`, { d: `M2 10s2 2 2 5` }],
    [`path`, { d: `M22 10s-2 2-2 5` }],
    [`path`, { d: `M8 15h8` }],
    [`path`, { d: `M2 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1` }],
    [`path`, { d: `M14 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1` }],
  ],
  ML = [
    [`path`, { d: `m10 20-1.25-2.5L6 18` }],
    [`path`, { d: `M10 4 8.75 6.5 6 6` }],
    [`path`, { d: `M10.585 15H10` }],
    [`path`, { d: `M2 12h6.5L10 9` }],
    [`path`, { d: `M20 14.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z` }],
    [`path`, { d: `m4 10 1.5 2L4 14` }],
    [`path`, { d: `m7 21 3-6-1.5-3` }],
    [`path`, { d: `m7 3 3 6h2` }],
  ],
  NL = [
    [`path`, { d: `M12 2v2` }],
    [`path`, { d: `M12 8a4 4 0 0 0-1.645 7.647` }],
    [`path`, { d: `M2 12h2` }],
    [`path`, { d: `M20 14.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z` }],
    [`path`, { d: `m4.93 4.93 1.41 1.41` }],
    [`path`, { d: `m6.34 17.66-1.41 1.41` }],
  ],
  PL = [[`path`, { d: `M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z` }]],
  FL = [
    [
      `path`,
      {
        d: `M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z`,
      },
    ],
    [`path`, { d: `M17 14V2` }],
  ],
  IL = [
    [
      `path`,
      {
        d: `M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z`,
      },
    ],
    [`path`, { d: `M7 10v12` }],
  ],
  LL = [
    [
      `path`,
      {
        d: `M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z`,
      },
    ],
    [`path`, { d: `m9 12 2 2 4-4` }],
  ],
  RL = [
    [
      `path`,
      {
        d: `M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z`,
      },
    ],
    [`path`, { d: `M9 12h6` }],
  ],
  zL = [
    [
      `path`,
      {
        d: `M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z`,
      },
    ],
    [`path`, { d: `M9 9h.01` }],
    [`path`, { d: `m15 9-6 6` }],
    [`path`, { d: `M15 15h.01` }],
  ],
  BL = [
    [
      `path`,
      {
        d: `M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z`,
      },
    ],
    [`path`, { d: `M9 12h6` }],
    [`path`, { d: `M12 9v6` }],
  ],
  VL = [
    [
      `path`,
      {
        d: `M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z`,
      },
    ],
    [`path`, { d: `m9.5 14.5 5-5` }],
  ],
  HL = [
    [
      `path`,
      {
        d: `M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z`,
      },
    ],
    [`path`, { d: `m9.5 14.5 5-5` }],
    [`path`, { d: `m9.5 9.5 5 5` }],
  ],
  UL = [
    [
      `path`,
      {
        d: `M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z`,
      },
    ],
    [`path`, { d: `M13 5v2` }],
    [`path`, { d: `M13 17v2` }],
    [`path`, { d: `M13 11v2` }],
  ],
  WL = [
    [`path`, { d: `M10.5 17h1.227a2 2 0 0 0 1.345-.52L18 12` }],
    [`path`, { d: `m12 13.5 3.794.506` }],
    [`path`, { d: `m3.173 8.18 11-5a2 2 0 0 1 2.647.993L18.56 8` }],
    [`path`, { d: `M6 10V8` }],
    [`path`, { d: `M6 14v1` }],
    [`path`, { d: `M6 19v2` }],
    [`rect`, { x: `2`, y: `8`, width: `20`, height: `13`, rx: `2` }],
  ],
  GL = [
    [`path`, { d: `m3.173 8.18 11-5a2 2 0 0 1 2.647.993L18.56 8` }],
    [`path`, { d: `M6 10V8` }],
    [`path`, { d: `M6 14v1` }],
    [`path`, { d: `M6 19v2` }],
    [`rect`, { x: `2`, y: `8`, width: `20`, height: `13`, rx: `2` }],
  ],
  KL = [
    [`path`, { d: `M4 12h.01` }],
    [`path`, { d: `M4 16h.01` }],
    [`path`, { d: `M4 20h.01` }],
    [`path`, { d: `M4 4h.01` }],
    [`path`, { d: `M4 8h.01` }],
    [
      `path`,
      {
        d: `M9.414 13.414a2 2 0 0 0 1.414.586H19a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-8.172a2 2 0 0 0-1.414.586L8 12z`,
      },
    ],
    [
      `path`,
      {
        d: `M9.414 21.414a2 2 0 0 0 1.414.586H19a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-8.172a2 2 0 0 0-1.414.586L8 20z`,
      },
    ],
    [
      `path`,
      {
        d: `M9.414 5.414A2 2 0 0 0 10.828 6H19a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-8.172a2 2 0 0 0-1.414.586L8 4z`,
      },
    ],
  ],
  qL = [
    [`path`, { d: `M10 2h4` }],
    [`path`, { d: `M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7` }],
    [`path`, { d: `M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M12 12v-2` }],
  ],
  JL = [
    [`line`, { x1: `10`, x2: `14`, y1: `2`, y2: `2` }],
    [`line`, { x1: `12`, x2: `15`, y1: `14`, y2: `11` }],
    [`circle`, { cx: `12`, cy: `14`, r: `8` }],
  ],
  YL = [
    [`path`, { d: `M10 2h4` }],
    [`path`, { d: `M12 14v-4` }],
    [`path`, { d: `M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6` }],
    [`path`, { d: `M9 17H4v5` }],
  ],
  XL = [
    [`circle`, { cx: `9`, cy: `12`, r: `3` }],
    [`rect`, { width: `20`, height: `14`, x: `2`, y: `5`, rx: `7` }],
  ],
  ZL = [
    [`circle`, { cx: `15`, cy: `12`, r: `3` }],
    [`rect`, { width: `20`, height: `14`, x: `2`, y: `5`, rx: `7` }],
  ],
  QL = [
    [
      `path`,
      {
        d: `M7 12h13a1 1 0 0 1 1 1 5 5 0 0 1-5 5h-.598a.5.5 0 0 0-.424.765l1.544 2.47a.5.5 0 0 1-.424.765H5.402a.5.5 0 0 1-.424-.765L7 18`,
      },
    ],
    [`path`, { d: `M8 18a5 5 0 0 1-5-5V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8` }],
  ],
  $L = [
    [`path`, { d: `M10 15h4` }],
    [
      `path`,
      {
        d: `m14.817 10.995-.971-1.45 1.034-1.232a2 2 0 0 0-2.025-3.238l-1.82.364L9.91 3.885a2 2 0 0 0-3.625.748L6.141 6.55l-1.725.426a2 2 0 0 0-.19 3.756l.657.27`,
      },
    ],
    [
      `path`,
      {
        d: `m18.822 10.995 2.26-5.38a1 1 0 0 0-.557-1.318L16.954 2.9a1 1 0 0 0-1.281.533l-.924 2.122`,
      },
    ],
    [
      `path`,
      {
        d: `M4 12.006A1 1 0 0 1 4.994 11H19a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z`,
      },
    ],
  ],
  eR = [
    [`path`, { d: `M16 12v4` }],
    [
      `path`,
      {
        d: `M16 6a2 2 0 0 1 1.414.586l4 4A2 2 0 0 1 22 12v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 .586-1.414l4-4A2 2 0 0 1 8 6z`,
      },
    ],
    [`path`, { d: `M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2` }],
    [`path`, { d: `M2 14h20` }],
    [`path`, { d: `M8 12v4` }],
  ],
  tR = [
    [`ellipse`, { cx: `12`, cy: `11`, rx: `3`, ry: `2` }],
    [`ellipse`, { cx: `12`, cy: `12.5`, rx: `10`, ry: `8.5` }],
  ],
  nR = [
    [`path`, { d: `M21 4H3` }],
    [`path`, { d: `M18 8H6` }],
    [`path`, { d: `M19 12H9` }],
    [`path`, { d: `M16 16h-6` }],
    [`path`, { d: `M11 20H9` }],
  ],
  rR = [
    [`path`, { d: `M12 20v-6` }],
    [`path`, { d: `M19.656 14H22` }],
    [`path`, { d: `M2 14h12` }],
    [`path`, { d: `m2 2 20 20` }],
    [`path`, { d: `M20 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2` }],
    [`path`, { d: `M9.656 4H20a2 2 0 0 1 2 2v10.344` }],
  ],
  iR = [
    [`rect`, { width: `20`, height: `16`, x: `2`, y: `4`, rx: `2` }],
    [`path`, { d: `M2 14h20` }],
    [`path`, { d: `M12 20v-6` }],
  ],
  aR = [
    [`path`, { d: `M22 7h-2` }],
    [
      `path`,
      {
        d: `M6.5 3h11A2.5 2.5 0 0 1 20 5.5V20a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V5.5a1 1 0 0 0-5 0V17a1 1 0 0 0 1 1h4`,
      },
    ],
    [`path`, { d: `M9 7H2` }],
  ],
  oR = [
    [
      `path`,
      { d: `m10 11 11 .9a1 1 0 0 1 .8 1.1l-.665 4.158a1 1 0 0 1-.988.842H20` },
    ],
    [`path`, { d: `M16 18h-5` }],
    [`path`, { d: `M18 5a1 1 0 0 0-1 1v5.573` }],
    [`path`, { d: `M3 4h8.129a1 1 0 0 1 .99.863L13 11.246` }],
    [`path`, { d: `M4 11V4` }],
    [`path`, { d: `M7 15h.01` }],
    [`path`, { d: `M8 10.1V4` }],
    [`circle`, { cx: `18`, cy: `18`, r: `2` }],
    [`circle`, { cx: `7`, cy: `15`, r: `5` }],
  ],
  sR = [
    [
      `path`,
      {
        d: `M18.2 12.27 20 6H4l1.8 6.27a1 1 0 0 0 .95.73h10.5a1 1 0 0 0 .96-.73Z`,
      },
    ],
    [`path`, { d: `M8 13v9` }],
    [`path`, { d: `M16 22v-9` }],
    [`path`, { d: `m9 6 1 7` }],
    [`path`, { d: `m15 6-1 7` }],
    [`path`, { d: `M12 6V2` }],
    [`path`, { d: `M13 2h-2` }],
  ],
  cR = [
    [`rect`, { width: `18`, height: `12`, x: `3`, y: `8`, rx: `1` }],
    [`path`, { d: `M10 8V5c0-.6-.4-1-1-1H6a1 1 0 0 0-1 1v3` }],
    [`path`, { d: `M19 8V5c0-.6-.4-1-1-1h-3a1 1 0 0 0-1 1v3` }],
  ],
  lR = [
    [`path`, { d: `M16.05 10.966a5 2.5 0 0 1-8.1 0` }],
    [
      `path`,
      {
        d: `m16.923 14.049 4.48 2.04a1 1 0 0 1 .001 1.831l-8.574 3.9a2 2 0 0 1-1.66 0l-8.574-3.91a1 1 0 0 1 0-1.83l4.484-2.04`,
      },
    ],
    [
      `path`,
      { d: `M16.949 14.14a5 2.5 0 1 1-9.9 0L10.063 3.5a2 2 0 0 1 3.874 0z` },
    ],
    [`path`, { d: `M9.194 6.57a5 2.5 0 0 0 5.61 0` }],
  ],
  uR = [
    [`path`, { d: `M2 22V12a10 10 0 1 1 20 0v10` }],
    [`path`, { d: `M15 6.8v1.4a3 2.8 0 1 1-6 0V6.8` }],
    [`path`, { d: `M10 15h.01` }],
    [`path`, { d: `M14 15h.01` }],
    [`path`, { d: `M10 19a4 4 0 0 1-4-4v-3a6 6 0 1 1 12 0v3a4 4 0 0 1-4 4Z` }],
    [`path`, { d: `m9 19-2 3` }],
    [`path`, { d: `m15 19 2 3` }],
  ],
  dR = [
    [`path`, { d: `M8 3.1V7a4 4 0 0 0 8 0V3.1` }],
    [`path`, { d: `m9 15-1-1` }],
    [`path`, { d: `m15 15 1-1` }],
    [
      `path`,
      { d: `M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z` },
    ],
    [`path`, { d: `m8 19-2 3` }],
    [`path`, { d: `m16 19 2 3` }],
  ],
  fR = [
    [`path`, { d: `M2 17 17 2` }],
    [`path`, { d: `m2 14 8 8` }],
    [`path`, { d: `m5 11 8 8` }],
    [`path`, { d: `m8 8 8 8` }],
    [`path`, { d: `m11 5 8 8` }],
    [`path`, { d: `m14 2 8 8` }],
    [`path`, { d: `M7 22 22 7` }],
  ],
  pR = [
    [`rect`, { width: `16`, height: `16`, x: `4`, y: `3`, rx: `2` }],
    [`path`, { d: `M4 11h16` }],
    [`path`, { d: `M12 3v8` }],
    [`path`, { d: `m8 19-2 3` }],
    [`path`, { d: `m18 22-2-3` }],
    [`path`, { d: `M8 15h.01` }],
    [`path`, { d: `M16 15h.01` }],
  ],
  mR = [
    [`path`, { d: `M10 11v6` }],
    [`path`, { d: `M14 11v6` }],
    [`path`, { d: `M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6` }],
    [`path`, { d: `M3 6h18` }],
    [`path`, { d: `M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2` }],
  ],
  hR = [
    [`path`, { d: `M12 16v6` }],
    [`path`, { d: `M14 20h-4` }],
    [`path`, { d: `M18 2h4v4` }],
    [`path`, { d: `m2 2 7.17 7.17` }],
    [`path`, { d: `M2 5.355V2h3.357` }],
    [`path`, { d: `m22 2-7.17 7.17` }],
    [`path`, { d: `M8 5 5 8` }],
    [`circle`, { cx: `12`, cy: `12`, r: `4` }],
  ],
  gR = [
    [`path`, { d: `M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6` }],
    [`path`, { d: `M3 6h18` }],
    [`path`, { d: `M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2` }],
  ],
  _R = [
    [
      `path`,
      {
        d: `M8 19a4 4 0 0 1-2.24-7.32A3.5 3.5 0 0 1 9 6.03V6a3 3 0 1 1 6 0v.04a3.5 3.5 0 0 1 3.24 5.65A4 4 0 0 1 16 19Z`,
      },
    ],
    [`path`, { d: `M12 19v3` }],
  ],
  vR = [
    [
      `path`,
      {
        d: `m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z`,
      },
    ],
    [`path`, { d: `M12 22v-3` }],
  ],
  yR = [
    [`path`, { d: `M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4` }],
    [
      `path`,
      {
        d: `M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3`,
      },
    ],
    [
      `path`,
      {
        d: `M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35`,
      },
    ],
    [`path`, { d: `M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14` }],
  ],
  bR = [
    [
      `path`,
      { d: `M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z` },
    ],
    [`path`, { d: `M7 16v6` }],
    [`path`, { d: `M13 19v3` }],
    [
      `path`,
      {
        d: `M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5`,
      },
    ],
  ],
  xR = [
    [`path`, { d: `M16 17h6v-6` }],
    [`path`, { d: `m22 17-8.5-8.5-5 5L2 7` }],
  ],
  SR = [
    [`path`, { d: `M14.828 14.828 21 21` }],
    [`path`, { d: `M21 16v5h-5` }],
    [`path`, { d: `m21 3-9 9-4-4-6 6` }],
    [`path`, { d: `M21 8V3h-5` }],
  ],
  CR = [
    [`path`, { d: `M16 7h6v6` }],
    [`path`, { d: `m22 7-8.5 8.5-5-5L2 17` }],
  ],
  wR = [
    [
      `path`,
      {
        d: `m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3`,
      },
    ],
    [`path`, { d: `M12 9v4` }],
    [`path`, { d: `M12 17h.01` }],
  ],
  TR = [
    [`path`, { d: `M10.17 4.193a2 2 0 0 1 3.666.013` }],
    [`path`, { d: `M14 21h2` }],
    [`path`, { d: `m15.874 7.743 1 1.732` }],
    [`path`, { d: `m18.849 12.952 1 1.732` }],
    [`path`, { d: `M21.824 18.18a2 2 0 0 1-1.835 2.824` }],
    [`path`, { d: `M4.024 21a2 2 0 0 1-1.839-2.839` }],
    [`path`, { d: `m5.136 12.952-1 1.732` }],
    [`path`, { d: `M8 21h2` }],
    [`path`, { d: `m8.102 7.743-1 1.732` }],
  ],
  ER = [
    [
      `path`,
      {
        d: `M22 18a2 2 0 0 1-2 2H3c-1.1 0-1.3-.6-.4-1.3L20.4 4.3c.9-.7 1.6-.4 1.6.7Z`,
      },
    ],
  ],
  DR = [
    [
      `path`,
      {
        d: `M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z`,
      },
    ],
  ],
  OR = [
    [`path`, { d: `M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978` }],
    [`path`, { d: `M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978` }],
    [`path`, { d: `M18 9h1.5a1 1 0 0 0 0-5H18` }],
    [`path`, { d: `M4 22h16` }],
    [`path`, { d: `M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z` }],
    [`path`, { d: `M6 9H4.5a1 1 0 0 1 0-5H6` }],
  ],
  kR = [
    [`path`, { d: `M14 19V7a2 2 0 0 0-2-2H9` }],
    [`path`, { d: `M15 19H9` }],
    [
      `path`,
      {
        d: `M19 19h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62L18.3 9.38a1 1 0 0 0-.78-.38H14`,
      },
    ],
    [`path`, { d: `M2 13v5a1 1 0 0 0 1 1h2` }],
    [
      `path`,
      {
        d: `M4 3 2.15 5.15a.495.495 0 0 0 .35.86h2.15a.47.47 0 0 1 .35.86L3 9.02`,
      },
    ],
    [`circle`, { cx: `17`, cy: `19`, r: `2` }],
    [`circle`, { cx: `7`, cy: `19`, r: `2` }],
  ],
  AR = [
    [
      `path`,
      { d: `M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2` },
    ],
    [`path`, { d: `M15 18H9` }],
    [
      `path`,
      {
        d: `M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14`,
      },
    ],
    [`circle`, { cx: `17`, cy: `18`, r: `2` }],
    [`circle`, { cx: `7`, cy: `18`, r: `2` }],
  ],
  jR = [
    [`path`, { d: `M15 4 5 9` }],
    [`path`, { d: `m15 8.5-10 5` }],
    [`path`, { d: `M18 12a9 9 0 0 1-9 9V3` }],
  ],
  MR = [
    [`path`, { d: `M10 12.01h.01` }],
    [`path`, { d: `M18 8v4a8 8 0 0 1-1.07 4` }],
    [`circle`, { cx: `10`, cy: `12`, r: `4` }],
    [`rect`, { x: `2`, y: `4`, width: `20`, height: `16`, rx: `2` }],
  ],
  NR = [
    [
      `path`,
      {
        d: `m12 10 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a8 8 0 1 0-16 0v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3l2-4h4Z`,
      },
    ],
    [`path`, { d: `M4.82 7.9 8 10` }],
    [`path`, { d: `M15.18 7.9 12 10` }],
    [`path`, { d: `M16.93 10H20a2 2 0 0 1 0 4H2` }],
  ],
  PR = [
    [
      `path`,
      {
        d: `M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z`,
      },
    ],
    [`path`, { d: `M7 21h10` }],
    [`rect`, { width: `20`, height: `14`, x: `2`, y: `3`, rx: `2` }],
  ],
  FR = [
    [`path`, { d: `M7 21h10` }],
    [`rect`, { width: `20`, height: `14`, x: `2`, y: `3`, rx: `2` }],
  ],
  IR = [
    [`path`, { d: `m17 2-5 5-5-5` }],
    [`rect`, { width: `20`, height: `15`, x: `2`, y: `7`, rx: `2` }],
  ],
  LR = [
    [
      `path`,
      {
        d: `M14 16.5a.5.5 0 0 0 .5.5h.5a2 2 0 0 1 0 4H9a2 2 0 0 1 0-4h.5a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V8a2 2 0 0 1-4 0V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 1-4 0v-.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5Z`,
      },
    ],
  ],
  RR = [
    [`path`, { d: `M12 4v16` }],
    [`path`, { d: `M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2` }],
    [`path`, { d: `M9 20h6` }],
  ],
  zR = [
    [`path`, { d: `M12 13v7a2 2 0 0 0 4 0` }],
    [`path`, { d: `M12 2v2` }],
    [
      `path`,
      {
        d: `M18.656 13h2.336a1 1 0 0 0 .97-1.274 10.284 10.284 0 0 0-12.07-7.51`,
      },
    ],
    [`path`, { d: `m2 2 20 20` }],
    [
      `path`,
      { d: `M5.961 5.957a10.28 10.28 0 0 0-3.922 5.769A1 1 0 0 0 3 13h10` },
    ],
  ],
  BR = [
    [`path`, { d: `M12 13v7a2 2 0 0 0 4 0` }],
    [`path`, { d: `M12 2v2` }],
    [
      `path`,
      {
        d: `M20.992 13a1 1 0 0 0 .97-1.274 10.284 10.284 0 0 0-19.923 0A1 1 0 0 0 3 13z`,
      },
    ],
  ],
  VR = [
    [`path`, { d: `M6 4v6a6 6 0 0 0 12 0V4` }],
    [`line`, { x1: `4`, x2: `20`, y1: `20`, y2: `20` }],
  ],
  HR = [
    [`path`, { d: `M9 14 4 9l5-5` }],
    [`path`, { d: `M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11` }],
  ],
  UR = [
    [`path`, { d: `M21 17a9 9 0 0 0-15-6.7L3 13` }],
    [`path`, { d: `M3 7v6h6` }],
    [`circle`, { cx: `12`, cy: `17`, r: `1` }],
  ],
  WR = [
    [`path`, { d: `M3 7v6h6` }],
    [`path`, { d: `M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13` }],
  ],
  GR = [
    [`path`, { d: `M16 12h6` }],
    [`path`, { d: `M8 12H2` }],
    [`path`, { d: `M12 2v2` }],
    [`path`, { d: `M12 8v2` }],
    [`path`, { d: `M12 14v2` }],
    [`path`, { d: `M12 20v2` }],
    [`path`, { d: `m19 15 3-3-3-3` }],
    [`path`, { d: `m5 9-3 3 3 3` }],
  ],
  KR = [
    [`path`, { d: `M12 22v-6` }],
    [`path`, { d: `M12 8V2` }],
    [`path`, { d: `M4 12H2` }],
    [`path`, { d: `M10 12H8` }],
    [`path`, { d: `M16 12h-2` }],
    [`path`, { d: `M22 12h-2` }],
    [`path`, { d: `m15 19-3 3-3-3` }],
    [`path`, { d: `m15 5-3-3-3 3` }],
  ],
  qR = [
    [`rect`, { width: `8`, height: `6`, x: `5`, y: `4`, rx: `1` }],
    [`rect`, { width: `8`, height: `6`, x: `11`, y: `14`, rx: `1` }],
  ],
  JR = [
    [`path`, { d: `M14 21v-3a2 2 0 0 0-4 0v3` }],
    [`path`, { d: `M18 12h.01` }],
    [`path`, { d: `M18 16h.01` }],
    [
      `path`,
      {
        d: `M22 7a1 1 0 0 0-1-1h-2a2 2 0 0 1-1.143-.359L13.143 2.36a2 2 0 0 0-2.286-.001L6.143 5.64A2 2 0 0 1 5 6H3a1 1 0 0 0-1 1v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2z`,
      },
    ],
    [`path`, { d: `M6 12h.01` }],
    [`path`, { d: `M6 16h.01` }],
    [`circle`, { cx: `12`, cy: `10`, r: `2` }],
  ],
  YR = [[`path`, { d: `M15 7h2a5 5 0 0 1 0 10h-2m-6 0H7A5 5 0 0 1 7 7h2` }]],
  XR = [
    [
      `path`,
      {
        d: `m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71`,
      },
    ],
    [
      `path`,
      {
        d: `m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71`,
      },
    ],
    [`line`, { x1: `8`, x2: `8`, y1: `2`, y2: `5` }],
    [`line`, { x1: `2`, x2: `5`, y1: `8`, y2: `8` }],
    [`line`, { x1: `16`, x2: `16`, y1: `19`, y2: `22` }],
    [`line`, { x1: `19`, x2: `22`, y1: `16`, y2: `16` }],
  ],
  ZR = [
    [`path`, { d: `m19 5 3-3` }],
    [`path`, { d: `m2 22 3-3` }],
    [
      `path`,
      {
        d: `M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z`,
      },
    ],
    [`path`, { d: `M7.5 13.5 10 11` }],
    [`path`, { d: `M10.5 16.5 13 14` }],
    [
      `path`,
      {
        d: `m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z`,
      },
    ],
  ],
  QR = [
    [`path`, { d: `M12 3v12` }],
    [`path`, { d: `m17 8-5-5-5 5` }],
    [`path`, { d: `M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4` }],
  ],
  $R = [
    [`circle`, { cx: `10`, cy: `7`, r: `1` }],
    [`circle`, { cx: `4`, cy: `20`, r: `1` }],
    [`path`, { d: `M4.7 19.3 19 5` }],
    [`path`, { d: `m21 3-3 1 2 2Z` }],
    [`path`, { d: `M9.26 7.68 5 12l2 5` }],
    [`path`, { d: `m10 14 5 2 3.5-3.5` }],
    [`path`, { d: `m18 12 1-1 1 1-1 1Z` }],
  ],
  ez = [
    [`path`, { d: `m16 11 2 2 4-4` }],
    [`path`, { d: `M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2` }],
    [`circle`, { cx: `9`, cy: `7`, r: `4` }],
  ],
  tz = [
    [`path`, { d: `M10 15H6a4 4 0 0 0-4 4v2` }],
    [`path`, { d: `m14.305 16.53.923-.382` }],
    [`path`, { d: `m15.228 13.852-.923-.383` }],
    [`path`, { d: `m16.852 12.228-.383-.923` }],
    [`path`, { d: `m16.852 17.772-.383.924` }],
    [`path`, { d: `m19.148 12.228.383-.923` }],
    [`path`, { d: `m19.53 18.696-.382-.924` }],
    [`path`, { d: `m20.772 13.852.924-.383` }],
    [`path`, { d: `m20.772 16.148.924.383` }],
    [`circle`, { cx: `18`, cy: `15`, r: `3` }],
    [`circle`, { cx: `9`, cy: `7`, r: `4` }],
  ],
  nz = [
    [`path`, { d: `M20 11v6` }],
    [`path`, { d: `M20 13h2` }],
    [`path`, { d: `M3 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 2.072.578` }],
    [`circle`, { cx: `10`, cy: `7`, r: `4` }],
    [`circle`, { cx: `20`, cy: `19`, r: `2` }],
  ],
  rz = [
    [`path`, { d: `M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2` }],
    [`circle`, { cx: `9`, cy: `7`, r: `4` }],
    [`line`, { x1: `22`, x2: `16`, y1: `11`, y2: `11` }],
  ],
  iz = [
    [`path`, { d: `M19 16v-2a2 2 0 0 0-4 0v2` }],
    [`path`, { d: `M9.5 15H7a4 4 0 0 0-4 4v2` }],
    [`circle`, { cx: `10`, cy: `7`, r: `4` }],
    [`rect`, { x: `13`, y: `16`, width: `8`, height: `5`, rx: `.899` }],
  ],
  az = [
    [`path`, { d: `M11.5 15H7a4 4 0 0 0-4 4v2` }],
    [
      `path`,
      {
        d: `M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z`,
      },
    ],
    [`circle`, { cx: `10`, cy: `7`, r: `4` }],
  ],
  oz = [
    [`path`, { d: `M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2` }],
    [`circle`, { cx: `9`, cy: `7`, r: `4` }],
    [`line`, { x1: `19`, x2: `19`, y1: `8`, y2: `14` }],
    [`line`, { x1: `22`, x2: `16`, y1: `11`, y2: `11` }],
  ],
  sz = [
    [`path`, { d: `M2 21a8 8 0 0 1 13.292-6` }],
    [`circle`, { cx: `10`, cy: `8`, r: `5` }],
    [`path`, { d: `m16 19 2 2 4-4` }],
  ],
  cz = [
    [`path`, { d: `M19 11v6` }],
    [`path`, { d: `M19 13h2` }],
    [`path`, { d: `M2 21a8 8 0 0 1 12.868-6.349` }],
    [`circle`, { cx: `10`, cy: `8`, r: `5` }],
    [`circle`, { cx: `19`, cy: `19`, r: `2` }],
  ],
  lz = [
    [`path`, { d: `m14.305 19.53.923-.382` }],
    [`path`, { d: `m15.228 16.852-.923-.383` }],
    [`path`, { d: `m16.852 15.228-.383-.923` }],
    [`path`, { d: `m16.852 20.772-.383.924` }],
    [`path`, { d: `m19.148 15.228.383-.923` }],
    [`path`, { d: `m19.53 21.696-.382-.924` }],
    [`path`, { d: `M2 21a8 8 0 0 1 10.434-7.62` }],
    [`path`, { d: `m20.772 16.852.924-.383` }],
    [`path`, { d: `m20.772 19.148.924.383` }],
    [`circle`, { cx: `10`, cy: `8`, r: `5` }],
    [`circle`, { cx: `18`, cy: `18`, r: `3` }],
  ],
  uz = [
    [`path`, { d: `M2 21a8 8 0 0 1 13.292-6` }],
    [`circle`, { cx: `10`, cy: `8`, r: `5` }],
    [`path`, { d: `M22 19h-6` }],
  ],
  dz = [
    [`path`, { d: `M2 21a8 8 0 0 1 10.821-7.487` }],
    [
      `path`,
      {
        d: `M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z`,
      },
    ],
    [`circle`, { cx: `10`, cy: `8`, r: `5` }],
  ],
  fz = [
    [`path`, { d: `M2 21a8 8 0 0 1 13.292-6` }],
    [`circle`, { cx: `10`, cy: `8`, r: `5` }],
    [`path`, { d: `M19 16v6` }],
    [`path`, { d: `M22 19h-6` }],
  ],
  pz = [
    [`circle`, { cx: `10`, cy: `8`, r: `5` }],
    [`path`, { d: `M2 21a8 8 0 0 1 10.434-7.62` }],
    [`circle`, { cx: `18`, cy: `18`, r: `3` }],
    [`path`, { d: `m22 22-1.9-1.9` }],
  ],
  mz = [
    [`path`, { d: `M2 21a8 8 0 0 1 11.873-7` }],
    [`circle`, { cx: `10`, cy: `8`, r: `5` }],
    [`path`, { d: `m17 17 5 5` }],
    [`path`, { d: `m22 17-5 5` }],
  ],
  hz = [
    [`circle`, { cx: `12`, cy: `8`, r: `5` }],
    [`path`, { d: `M20 21a8 8 0 0 0-16 0` }],
  ],
  gz = [
    [`circle`, { cx: `10`, cy: `7`, r: `4` }],
    [`path`, { d: `M10.3 15H7a4 4 0 0 0-4 4v2` }],
    [`circle`, { cx: `17`, cy: `17`, r: `3` }],
    [`path`, { d: `m21 21-1.9-1.9` }],
  ],
  _z = [
    [
      `path`,
      {
        d: `M16.051 12.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z`,
      },
    ],
    [`path`, { d: `M8 15H7a4 4 0 0 0-4 4v2` }],
    [`circle`, { cx: `10`, cy: `7`, r: `4` }],
  ],
  vz = [
    [`path`, { d: `M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2` }],
    [`circle`, { cx: `9`, cy: `7`, r: `4` }],
    [`line`, { x1: `17`, x2: `22`, y1: `8`, y2: `13` }],
    [`line`, { x1: `22`, x2: `17`, y1: `8`, y2: `13` }],
  ],
  yz = [
    [`path`, { d: `M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2` }],
    [`circle`, { cx: `12`, cy: `7`, r: `4` }],
  ],
  bz = [
    [`path`, { d: `M18 21a8 8 0 0 0-16 0` }],
    [`circle`, { cx: `10`, cy: `8`, r: `5` }],
    [`path`, { d: `M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3` }],
  ],
  xz = [
    [`path`, { d: `M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2` }],
    [`path`, { d: `M16 3.128a4 4 0 0 1 0 7.744` }],
    [`path`, { d: `M22 21v-2a4 4 0 0 0-3-3.87` }],
    [`circle`, { cx: `9`, cy: `7`, r: `4` }],
  ],
  Sz = [
    [
      `path`,
      { d: `m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8` },
    ],
    [
      `path`,
      {
        d: `M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7`,
      },
    ],
    [`path`, { d: `m2.1 21.8 6.4-6.3` }],
    [`path`, { d: `m19 5-7 7` }],
  ],
  Cz = [
    [`path`, { d: `M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2` }],
    [`path`, { d: `M7 2v20` }],
    [`path`, { d: `M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7` }],
  ],
  wz = [
    [`path`, { d: `M12 2v20` }],
    [`path`, { d: `M2 5h20` }],
    [`path`, { d: `M3 3v2` }],
    [`path`, { d: `M7 3v2` }],
    [`path`, { d: `M17 3v2` }],
    [`path`, { d: `M21 3v2` }],
    [`path`, { d: `m19 5-7 7-7-7` }],
  ],
  Tz = [
    [
      `path`,
      {
        d: `M13 6v5a1 1 0 0 0 1 1h6.102a1 1 0 0 1 .712.298l.898.91a1 1 0 0 1 .288.702V17a1 1 0 0 1-1 1h-3`,
      },
    ],
    [
      `path`,
      {
        d: `M5 18H3a1 1 0 0 1-1-1V8a2 2 0 0 1 2-2h12c1.1 0 2.1.8 2.4 1.8l1.176 4.2`,
      },
    ],
    [`path`, { d: `M9 18h5` }],
    [`circle`, { cx: `16`, cy: `18`, r: `2` }],
    [`circle`, { cx: `7`, cy: `18`, r: `2` }],
  ],
  Ez = [
    [`path`, { d: `M8 21s-4-3-4-9 4-9 4-9` }],
    [`path`, { d: `M16 3s4 3 4 9-4 9-4 9` }],
    [`line`, { x1: `15`, x2: `9`, y1: `9`, y2: `15` }],
    [`line`, { x1: `9`, x2: `15`, y1: `9`, y2: `15` }],
  ],
  Dz = [
    [`path`, { d: `M19.5 7a24 24 0 0 1 0 10` }],
    [`path`, { d: `M4.5 7a24 24 0 0 0 0 10` }],
    [`path`, { d: `M7 19.5a24 24 0 0 0 10 0` }],
    [`path`, { d: `M7 4.5a24 24 0 0 1 10 0` }],
    [`rect`, { x: `17`, y: `17`, width: `5`, height: `5`, rx: `1` }],
    [`rect`, { x: `17`, y: `2`, width: `5`, height: `5`, rx: `1` }],
    [`rect`, { x: `2`, y: `17`, width: `5`, height: `5`, rx: `1` }],
    [`rect`, { x: `2`, y: `2`, width: `5`, height: `5`, rx: `1` }],
  ],
  Oz = [
    [`path`, { d: `M16 8q6 0 6-6-6 0-6 6` }],
    [`path`, { d: `M17.41 3.59a10 10 0 1 0 3 3` }],
    [`path`, { d: `M2 2a26.6 26.6 0 0 1 10 20c.9-6.82 1.5-9.5 4-14` }],
  ],
  kz = [
    [`path`, { d: `M18 11c-1.5 0-2.5.5-3 2` }],
    [
      `path`,
      {
        d: `M4 6a2 2 0 0 0-2 2v4a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3a8 8 0 0 0-5 2 8 8 0 0 0-5-2z`,
      },
    ],
    [`path`, { d: `M6 11c1.5 0 2.5.5 3 2` }],
  ],
  Az = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`circle`, { cx: `7.5`, cy: `7.5`, r: `.5`, fill: `currentColor` }],
    [`path`, { d: `m7.9 7.9 2.7 2.7` }],
    [`circle`, { cx: `16.5`, cy: `7.5`, r: `.5`, fill: `currentColor` }],
    [`path`, { d: `m13.4 10.6 2.7-2.7` }],
    [`circle`, { cx: `7.5`, cy: `16.5`, r: `.5`, fill: `currentColor` }],
    [`path`, { d: `m7.9 16.1 2.7-2.7` }],
    [`circle`, { cx: `16.5`, cy: `16.5`, r: `.5`, fill: `currentColor` }],
    [`path`, { d: `m13.4 13.4 2.7 2.7` }],
    [`circle`, { cx: `12`, cy: `12`, r: `2` }],
  ],
  jz = [
    [`path`, { d: `M10 20h4` }],
    [`path`, { d: `M12 16v6` }],
    [`path`, { d: `M17 2h4v4` }],
    [`path`, { d: `m21 2-5.46 5.46` }],
    [`circle`, { cx: `12`, cy: `11`, r: `5` }],
  ],
  Mz = [
    [`path`, { d: `m2 8 2 2-2 2 2 2-2 2` }],
    [`path`, { d: `m22 8-2 2 2 2-2 2 2 2` }],
    [`path`, { d: `M8 8v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2` }],
    [`path`, { d: `M16 10.34V6c0-.55-.45-1-1-1h-4.34` }],
    [`line`, { x1: `2`, x2: `22`, y1: `2`, y2: `22` }],
  ],
  Nz = [
    [`path`, { d: `M12 15v7` }],
    [`path`, { d: `M9 19h6` }],
    [`circle`, { cx: `12`, cy: `9`, r: `6` }],
  ],
  Pz = [
    [`path`, { d: `m2 8 2 2-2 2 2 2-2 2` }],
    [`path`, { d: `m22 8-2 2 2 2-2 2 2 2` }],
    [`rect`, { width: `8`, height: `14`, x: `8`, y: `5`, rx: `1` }],
  ],
  Fz = [
    [
      `path`,
      {
        d: `M10.66 6H14a2 2 0 0 1 2 2v2.5l5.248-3.062A.5.5 0 0 1 22 7.87v8.196`,
      },
    ],
    [`path`, { d: `M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2` }],
    [`path`, { d: `m2 2 20 20` }],
  ],
  Iz = [
    [
      `path`,
      {
        d: `m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5`,
      },
    ],
    [`rect`, { x: `2`, y: `6`, width: `14`, height: `12`, rx: `2` }],
  ],
  Lz = [
    [`rect`, { width: `20`, height: `16`, x: `2`, y: `4`, rx: `2` }],
    [`path`, { d: `M2 8h20` }],
    [`circle`, { cx: `8`, cy: `14`, r: `2` }],
    [`path`, { d: `M8 12h8` }],
    [`circle`, { cx: `16`, cy: `14`, r: `2` }],
  ],
  Rz = [
    [`path`, { d: `M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2` }],
    [`path`, { d: `M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2` }],
    [`circle`, { cx: `12`, cy: `12`, r: `1` }],
    [
      `path`,
      {
        d: `M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0`,
      },
    ],
  ],
  zz = [
    [`circle`, { cx: `6`, cy: `12`, r: `4` }],
    [`circle`, { cx: `18`, cy: `12`, r: `4` }],
    [`line`, { x1: `6`, x2: `18`, y1: `16`, y2: `16` }],
  ],
  Bz = [
    [
      `path`,
      {
        d: `M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z`,
      },
    ],
    [`path`, { d: `M16 9a5 5 0 0 1 0 6` }],
  ],
  Vz = [
    [`path`, { d: `M11 7a16 16 20 0 1 10.98 4.362` }],
    [`path`, { d: `M12 12a13 13 0 0 1-8.66 5` }],
    [`path`, { d: `M16.83 13.634a16 16 0 0 1-9.267 7.328` }],
    [`path`, { d: `M20.66 17A13 13 0 0 0 12 12a13 13 0 0 1 0-10` }],
    [`path`, { d: `M8.17 15.366a16 16 0 0 1-1.713-11.69` }],
    [`circle`, { cx: `12`, cy: `12`, r: `10` }],
  ],
  Hz = [
    [`path`, { d: `M16 9a5 5 0 0 1 .95 2.293` }],
    [`path`, { d: `M19.364 5.636a9 9 0 0 1 1.889 9.96` }],
    [`path`, { d: `m2 2 20 20` }],
    [
      `path`,
      {
        d: `m7 7-.587.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298V11`,
      },
    ],
    [`path`, { d: `M9.828 4.172A.686.686 0 0 1 11 4.657v.686` }],
  ],
  Uz = [
    [
      `path`,
      {
        d: `M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z`,
      },
    ],
    [`path`, { d: `M16 9a5 5 0 0 1 0 6` }],
    [`path`, { d: `M19.364 18.364a9 9 0 0 0 0-12.728` }],
  ],
  Wz = [
    [
      `path`,
      {
        d: `M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z`,
      },
    ],
    [`line`, { x1: `22`, x2: `16`, y1: `9`, y2: `15` }],
    [`line`, { x1: `16`, x2: `22`, y1: `9`, y2: `15` }],
  ],
  Gz = [
    [
      `path`,
      {
        d: `M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z`,
      },
    ],
  ],
  Kz = [
    [`path`, { d: `m9 12 2 2 4-4` }],
    [`path`, { d: `M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z` }],
    [`path`, { d: `M22 19H2` }],
  ],
  qz = [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2` }],
    [
      `path`,
      {
        d: `M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21`,
      },
    ],
  ],
  Jz = [
    [
      `path`,
      {
        d: `M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1`,
      },
    ],
    [`path`, { d: `M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4` }],
  ],
  Yz = [
    [`path`, { d: `M17 14h.01` }],
    [
      `path`,
      {
        d: `M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14`,
      },
    ],
  ],
  Xz = [
    [`path`, { d: `M12 17v4` }],
    [`path`, { d: `M8 21h8` }],
    [`path`, { d: `m9 17 6.1-6.1a2 2 0 0 1 2.81.01L22 15` }],
    [`circle`, { cx: `8`, cy: `9`, r: `2` }],
    [`rect`, { x: `2`, y: `3`, width: `20`, height: `14`, rx: `2` }],
  ],
  Zz = [
    [
      `path`,
      {
        d: `m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72`,
      },
    ],
    [`path`, { d: `m14 7 3 3` }],
    [`path`, { d: `M5 6v4` }],
    [`path`, { d: `M19 14v4` }],
    [`path`, { d: `M10 2v2` }],
    [`path`, { d: `M7 8H3` }],
    [`path`, { d: `M21 16h-4` }],
    [`path`, { d: `M11 3H9` }],
  ],
  Qz = [
    [`path`, { d: `M15 4V2` }],
    [`path`, { d: `M15 16v-2` }],
    [`path`, { d: `M8 9h2` }],
    [`path`, { d: `M20 9h2` }],
    [`path`, { d: `M17.8 11.8 19 13` }],
    [`path`, { d: `M15 9h.01` }],
    [`path`, { d: `M17.8 6.2 19 5` }],
    [`path`, { d: `m3 21 9-9` }],
    [`path`, { d: `M12.2 6.2 11 5` }],
  ],
  $z = [
    [`path`, { d: `M18 21V10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v11` }],
    [
      `path`,
      {
        d: `M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 1.132-1.803l7.95-3.974a2 2 0 0 1 1.837 0l7.948 3.974A2 2 0 0 1 22 8z`,
      },
    ],
    [`path`, { d: `M6 13h12` }],
    [`path`, { d: `M6 17h12` }],
  ],
  eB = [
    [`path`, { d: `M3 6h3` }],
    [`path`, { d: `M17 6h.01` }],
    [`rect`, { width: `18`, height: `20`, x: `3`, y: `2`, rx: `2` }],
    [`circle`, { cx: `12`, cy: `13`, r: `5` }],
    [`path`, { d: `M12 18a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 1 0-5` }],
  ],
  tB = [
    [`path`, { d: `M12 10v2.2l1.6 1` }],
    [
      `path`,
      {
        d: `m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05`,
      },
    ],
    [
      `path`,
      { d: `m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05` },
    ],
    [`circle`, { cx: `12`, cy: `12`, r: `6` }],
  ],
  nB = [
    [`path`, { d: `M12 2v8` }],
    [
      `path`,
      {
        d: `M2 15c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1`,
      },
    ],
    [
      `path`,
      {
        d: `M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1`,
      },
    ],
    [`path`, { d: `m8 6 4-4 4 4` }],
  ],
  rB = [
    [`path`, { d: `M12 10L12 2` }],
    [`path`, { d: `M16 6L12 10L8 6` }],
    [
      `path`,
      {
        d: `M2 15C2.6 15.5 3.2 16 4.5 16C7 16 7 14 9.5 14C12.1 14 11.9 16 14.5 16C17 16 17 14 19.5 14C20.8 14 21.4 14.5 22 15`,
      },
    ],
    [
      `path`,
      {
        d: `M2 21C2.6 21.5 3.2 22 4.5 22C7 22 7 20 9.5 20C12.1 20 11.9 22 14.5 22C17 22 17 20 19.5 20C20.8 20 21.4 20.5 22 21`,
      },
    ],
  ],
  iB = [
    [`path`, { d: `M2 12q2.5 2 5 0t5 0 5 0 5 0` }],
    [`path`, { d: `M2 19q2.5 2 5 0t5 0 5 0 5 0` }],
    [`path`, { d: `M2 5q2.5 2 5 0t5 0 5 0 5 0` }],
  ],
  aB = [
    [`path`, { d: `M19 5a2 2 0 0 0-2 2v11` }],
    [
      `path`,
      {
        d: `M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1`,
      },
    ],
    [`path`, { d: `M7 13h10` }],
    [`path`, { d: `M7 9h10` }],
    [`path`, { d: `M9 5a2 2 0 0 0-2 2v11` }],
  ],
  oB = [
    [`path`, { d: `M12 2q2 2.5 0 5t0 5 0 5 0 5` }],
    [`path`, { d: `M19 2q2 2.5 0 5t0 5 0 5 0 5` }],
    [`path`, { d: `M5 2q2 2.5 0 5t0 5 0 5 0 5` }],
  ],
  sB = [
    [`path`, { d: `m10.586 5.414-5.172 5.172` }],
    [`path`, { d: `m18.586 13.414-5.172 5.172` }],
    [`path`, { d: `M6 12h12` }],
    [`circle`, { cx: `12`, cy: `20`, r: `2` }],
    [`circle`, { cx: `12`, cy: `4`, r: `2` }],
    [`circle`, { cx: `20`, cy: `12`, r: `2` }],
    [`circle`, { cx: `4`, cy: `12`, r: `2` }],
  ],
  cB = [
    [`circle`, { cx: `12`, cy: `10`, r: `8` }],
    [`circle`, { cx: `12`, cy: `10`, r: `3` }],
    [`path`, { d: `M7 22h10` }],
    [`path`, { d: `M12 22v-4` }],
  ],
  lB = [
    [`path`, { d: `M17 17h-5c-1.09-.02-1.94.92-2.5 1.9A3 3 0 1 1 2.57 15` }],
    [`path`, { d: `M9 3.4a4 4 0 0 1 6.52.66` }],
    [`path`, { d: `m6 17 3.1-5.8a2.5 2.5 0 0 0 .057-2.05` }],
    [`path`, { d: `M20.3 20.3a4 4 0 0 1-2.3.7` }],
    [`path`, { d: `M18.6 13a4 4 0 0 1 3.357 3.414` }],
    [`path`, { d: `m12 6 .6 1` }],
    [`path`, { d: `m2 2 20 20` }],
  ],
  uB = [
    [
      `path`,
      {
        d: `M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2`,
      },
    ],
    [
      `path`,
      { d: `m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06` },
    ],
    [`path`, { d: `m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8` }],
  ],
  dB = [
    [
      `path`,
      {
        d: `M6.5 8a2 2 0 0 0-1.906 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8z`,
      },
    ],
    [`path`, { d: `M7.999 15a2.5 2.5 0 0 1 4 0 2.5 2.5 0 0 0 4 0` }],
    [`circle`, { cx: `12`, cy: `5`, r: `3` }],
  ],
  fB = [
    [`circle`, { cx: `12`, cy: `5`, r: `3` }],
    [
      `path`,
      {
        d: `M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z`,
      },
    ],
  ],
  pB = [
    [`path`, { d: `m2 22 10-10` }],
    [`path`, { d: `m16 8-1.17 1.17` }],
    [
      `path`,
      {
        d: `M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z`,
      },
    ],
    [
      `path`,
      {
        d: `m8 8-.53.53a3.5 3.5 0 0 0 0 4.94L9 15l1.53-1.53c.55-.55.88-1.25.98-1.97`,
      },
    ],
    [
      `path`,
      {
        d: `M10.91 5.26c.15-.26.34-.51.56-.73L13 3l1.53 1.53a3.5 3.5 0 0 1 .28 4.62`,
      },
    ],
    [`path`, { d: `M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z` }],
    [
      `path`,
      {
        d: `M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z`,
      },
    ],
    [
      `path`,
      {
        d: `m16 16-.53.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.49 3.49 0 0 1 1.97-.98`,
      },
    ],
    [
      `path`,
      {
        d: `M18.74 13.09c.26-.15.51-.34.73-.56L21 11l-1.53-1.53a3.5 3.5 0 0 0-4.62-.28`,
      },
    ],
    [`line`, { x1: `2`, x2: `22`, y1: `2`, y2: `22` }],
  ],
  mB = [
    [`path`, { d: `M2 22 16 8` }],
    [
      `path`,
      {
        d: `M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z`,
      },
    ],
    [
      `path`,
      {
        d: `M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z`,
      },
    ],
    [
      `path`,
      {
        d: `M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z`,
      },
    ],
    [`path`, { d: `M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z` }],
    [
      `path`,
      {
        d: `M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z`,
      },
    ],
    [
      `path`,
      {
        d: `M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z`,
      },
    ],
    [
      `path`,
      {
        d: `M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z`,
      },
    ],
  ],
  hB = [
    [`path`, { d: `m14.305 19.53.923-.382` }],
    [`path`, { d: `m15.228 16.852-.923-.383` }],
    [`path`, { d: `m16.852 15.228-.383-.923` }],
    [`path`, { d: `m16.852 20.772-.383.924` }],
    [`path`, { d: `m19.148 15.228.383-.923` }],
    [`path`, { d: `m19.53 21.696-.382-.924` }],
    [`path`, { d: `M2 7.82a15 15 0 0 1 20 0` }],
    [`path`, { d: `m20.772 16.852.924-.383` }],
    [`path`, { d: `m20.772 19.148.924.383` }],
    [`path`, { d: `M5 11.858a10 10 0 0 1 11.5-1.785` }],
    [`path`, { d: `M8.5 15.429a5 5 0 0 1 2.413-1.31` }],
    [`circle`, { cx: `18`, cy: `18`, r: `3` }],
  ],
  gB = [
    [`path`, { d: `M12 20h.01` }],
    [`path`, { d: `M5 12.859a10 10 0 0 1 14 0` }],
    [`path`, { d: `M8.5 16.429a5 5 0 0 1 7 0` }],
  ],
  _B = [
    [`circle`, { cx: `7`, cy: `12`, r: `3` }],
    [`path`, { d: `M10 9v6` }],
    [`circle`, { cx: `17`, cy: `12`, r: `3` }],
    [`path`, { d: `M14 7v8` }],
    [`path`, { d: `M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1` }],
  ],
  vB = [
    [`path`, { d: `M12 20h.01` }],
    [`path`, { d: `M8.5 16.429a5 5 0 0 1 7 0` }],
  ],
  yB = [
    [`path`, { d: `M12 20h.01` }],
    [`path`, { d: `M8.5 16.429a5 5 0 0 1 7 0` }],
    [`path`, { d: `M5 12.859a10 10 0 0 1 5.17-2.69` }],
    [`path`, { d: `M19 12.859a10 10 0 0 0-2.007-1.523` }],
    [`path`, { d: `M2 8.82a15 15 0 0 1 4.177-2.643` }],
    [`path`, { d: `M22 8.82a15 15 0 0 0-11.288-3.764` }],
    [`path`, { d: `m2 2 20 20` }],
  ],
  bB = [
    [`path`, { d: `M2 8.82a15 15 0 0 1 20 0` }],
    [
      `path`,
      {
        d: `M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z`,
      },
    ],
    [`path`, { d: `M5 12.859a10 10 0 0 1 10.5-2.222` }],
    [`path`, { d: `M8.5 16.429a5 5 0 0 1 3-1.406` }],
  ],
  xB = [
    [`path`, { d: `M11.965 10.105v4L13.5 12.5a5 5 0 0 1 8 1.5` }],
    [`path`, { d: `M11.965 14.105h4` }],
    [`path`, { d: `M17.965 18.105h4L20.43 19.71a5 5 0 0 1-8-1.5` }],
    [`path`, { d: `M2 8.82a15 15 0 0 1 20 0` }],
    [`path`, { d: `M21.965 22.105v-4` }],
    [`path`, { d: `M5 12.86a10 10 0 0 1 3-2.032` }],
    [`path`, { d: `M8.5 16.429h.01` }],
  ],
  SB = [[`path`, { d: `M12 20h.01` }]],
  CB = [
    [`path`, { d: `M12 20h.01` }],
    [`path`, { d: `M2 8.82a15 15 0 0 1 20 0` }],
    [`path`, { d: `M5 12.859a10 10 0 0 1 14 0` }],
    [`path`, { d: `M8.5 16.429a5 5 0 0 1 7 0` }],
  ],
  wB = [
    [`path`, { d: `M10 2v8` }],
    [`path`, { d: `M12.8 21.6A2 2 0 1 0 14 18H2` }],
    [`path`, { d: `M17.5 10a2.5 2.5 0 1 1 2 4H2` }],
    [`path`, { d: `m6 6 4 4 4-4` }],
  ],
  TB = [
    [`path`, { d: `M12.8 19.6A2 2 0 1 0 14 16H2` }],
    [`path`, { d: `M17.5 8a2.5 2.5 0 1 1 2 4H2` }],
    [`path`, { d: `M9.8 4.4A2 2 0 1 1 11 8H2` }],
  ],
  EB = [
    [`path`, { d: `M8 22h8` }],
    [`path`, { d: `M7 10h3m7 0h-1.343` }],
    [`path`, { d: `M12 15v7` }],
    [
      `path`,
      {
        d: `M7.307 7.307A12.33 12.33 0 0 0 7 10a5 5 0 0 0 7.391 4.391M8.638 2.981C8.75 2.668 8.872 2.34 9 2h6c1.5 4 2 6 2 8 0 .407-.05.809-.145 1.198`,
      },
    ],
    [`line`, { x1: `2`, x2: `22`, y1: `2`, y2: `22` }],
  ],
  DB = [
    [`path`, { d: `M8 22h8` }],
    [`path`, { d: `M7 10h10` }],
    [`path`, { d: `M12 15v7` }],
    [
      `path`,
      {
        d: `M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z`,
      },
    ],
  ],
  OB = [
    [`rect`, { width: `8`, height: `8`, x: `3`, y: `3`, rx: `2` }],
    [`path`, { d: `M7 11v4a2 2 0 0 0 2 2h4` }],
    [`rect`, { width: `8`, height: `8`, x: `13`, y: `13`, rx: `2` }],
  ],
  kB = [
    [`path`, { d: `m19 12-1.5 3` }],
    [`path`, { d: `M19.63 18.81 22 20` }],
    [
      `path`,
      {
        d: `M6.47 8.23a1.68 1.68 0 0 1 2.44 1.93l-.64 2.08a6.76 6.76 0 0 0 10.16 7.67l.42-.27a1 1 0 1 0-2.73-4.21l-.42.27a1.76 1.76 0 0 1-2.63-1.99l.64-2.08A6.66 6.66 0 0 0 3.94 3.9l-.7.4a1 1 0 1 0 2.55 4.34z`,
      },
    ],
  ],
  AB = [
    [
      `path`,
      {
        d: `M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z`,
      },
    ],
  ],
  jB = [
    [`path`, { d: `M18 4H6` }],
    [`path`, { d: `M18 8 6 20` }],
    [`path`, { d: `m6 8 12 12` }],
  ],
  MB = [
    [`path`, { d: `M18 6 6 18` }],
    [`path`, { d: `m6 6 12 12` }],
  ],
  NB = [
    [`path`, { d: `M10.513 4.856 13.12 2.17a.5.5 0 0 1 .86.46l-1.377 4.317` }],
    [`path`, { d: `M15.656 10H20a1 1 0 0 1 .78 1.63l-1.72 1.773` }],
    [
      `path`,
      {
        d: `M16.273 16.273 10.88 21.83a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14H4a1 1 0 0 1-.78-1.63l4.507-4.643`,
      },
    ],
    [`path`, { d: `m2 2 20 20` }],
  ],
  PB = [
    [
      `path`,
      {
        d: `M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z`,
      },
    ],
  ],
  FB = [
    [
      `path`,
      {
        d: `m2 10 2.456-3.684a.7.7 0 0 1 1.106-.013l2.39 3.413a.7.7 0 0 0 1.096-.001l2.402-3.432a.7.7 0 0 1 1.098 0l2.402 3.432a.7.7 0 0 0 1.098 0l2.389-3.413a.7.7 0 0 1 1.106.013L22 10`,
      },
    ],
    [
      `path`,
      {
        d: `m2 18.002 2.456-3.684a.7.7 0 0 1 1.106-.013l2.39 3.413a.7.7 0 0 0 1.097 0l2.402-3.432a.7.7 0 0 1 1.098 0l2.402 3.432a.7.7 0 0 0 1.098 0l2.389-3.413a.7.7 0 0 1 1.106.013L22 18.002`,
      },
    ],
  ],
  IB = [
    [`path`, { d: `M12 7.5a4.5 4.5 0 1 1 5 4.5` }],
    [`path`, { d: `M7 12a4.5 4.5 0 1 1 5-4.5V21` }],
  ],
  LB = [
    [`path`, { d: `M21 14.5A9 6.5 0 0 1 5.5 19` }],
    [`path`, { d: `M3 9.5A9 6.5 0 0 1 18.5 5` }],
    [`circle`, { cx: `17.5`, cy: `14.5`, r: `3.5` }],
    [`circle`, { cx: `6.5`, cy: `9.5`, r: `3.5` }],
  ],
  RB = [
    [`path`, { d: `M11 21a3 3 0 0 0 3-3V6.5a1 1 0 0 0-7 0` }],
    [`path`, { d: `M7 19V6a3 3 0 0 0-3-3h0` }],
    [`circle`, { cx: `17`, cy: `17`, r: `3` }],
  ],
  zB = [
    [`path`, { d: `M16 4.525v14.948` }],
    [`path`, { d: `M20 3A17 17 0 0 1 4 3` }],
    [`path`, { d: `M4 21a17 17 0 0 1 16 0` }],
    [`path`, { d: `M8 4.525v14.948` }],
  ],
  BB = [
    [
      `path`,
      {
        d: `M10 16c0-4-3-4.5-3-8a5 5 0 0 1 10 0c0 3.466-3 6.196-3 10a3 3 0 0 0 6 0`,
      },
    ],
    [`circle`, { cx: `7`, cy: `16`, r: `3` }],
  ],
  VB = [
    [
      `path`,
      {
        d: `M3 16h6.857c.162-.012.19-.323.038-.38a6 6 0 1 1 4.212 0c-.153.057-.125.368.038.38H21`,
      },
    ],
    [`path`, { d: `M3 20h18` }],
  ],
  HB = [
    [`path`, { d: `M3 10A6.06 6.06 0 0 1 12 10 A6.06 6.06 0 0 0 21 10` }],
    [`path`, { d: `M6 3v12a6 6 0 0 0 12 0V3` }],
  ],
  UB = [
    [`path`, { d: `M19 21a15 15 0 0 1 0-18` }],
    [`path`, { d: `M20 12H4` }],
    [`path`, { d: `M5 3a15 15 0 0 1 0 18` }],
  ],
  WB = [
    [`path`, { d: `M15 3h6v6` }],
    [`path`, { d: `M21 3 3 21` }],
    [`path`, { d: `m9 9 6 6` }],
  ],
  GB = [
    [`path`, { d: `M10 19V5.5a1 1 0 0 1 5 0V17a2 2 0 0 0 2 2h5l-3-3` }],
    [`path`, { d: `m22 19-3 3` }],
    [`path`, { d: `M5 19V5.5a1 1 0 0 1 5 0` }],
    [`path`, { d: `M5 5.5A2.5 2.5 0 0 0 2.5 3` }],
  ],
  KB = [
    [`circle`, { cx: `12`, cy: `15`, r: `6` }],
    [`path`, { d: `M18 3A6 6 0 0 1 6 3` }],
  ],
  qB = [
    [`path`, { d: `M11 5.5a1 1 0 0 1 5 0V16a5 5 0 0 0 5 5` }],
    [`path`, { d: `M16 11.5a1 1 0 0 1 5 0V16a5 5 0 0 1-5 5` }],
    [`path`, { d: `M6 19V6a3 3 0 0 0-3-3h0` }],
    [`path`, { d: `M6 5.5a1 1 0 0 1 5 0V19` }],
  ],
  JB = [
    [`circle`, { cx: `11`, cy: `11`, r: `8` }],
    [`line`, { x1: `21`, x2: `16.65`, y1: `21`, y2: `16.65` }],
    [`line`, { x1: `11`, x2: `11`, y1: `8`, y2: `14` }],
    [`line`, { x1: `8`, x2: `14`, y1: `11`, y2: `11` }],
  ],
  YB = [
    [`circle`, { cx: `11`, cy: `11`, r: `8` }],
    [`line`, { x1: `21`, x2: `16.65`, y1: `21`, y2: `16.65` }],
    [`line`, { x1: `8`, x2: `14`, y1: `11`, y2: `11` }],
  ],
  XB = s({
    AArrowDown: () => ul,
    AArrowUp: () => dl,
    ALargeSmall: () => fl,
    Accessibility: () => pl,
    Activity: () => ml,
    ActivitySquare: () => WP,
    AirVent: () => hl,
    Airplay: () => gl,
    AlarmCheck: () => _l,
    AlarmClock: () => xl,
    AlarmClockCheck: () => _l,
    AlarmClockMinus: () => vl,
    AlarmClockOff: () => bl,
    AlarmClockPlus: () => yl,
    AlarmMinus: () => vl,
    AlarmPlus: () => yl,
    AlarmSmoke: () => Sl,
    Album: () => Cl,
    AlertCircle: () => Vh,
    AlertOctagon: () => ck,
    AlertTriangle: () => wR,
    AlignCenter: () => SL,
    AlignCenterHorizontal: () => wl,
    AlignCenterVertical: () => Tl,
    AlignEndHorizontal: () => El,
    AlignEndVertical: () => Dl,
    AlignHorizontalDistributeCenter: () => Ol,
    AlignHorizontalDistributeEnd: () => kl,
    AlignHorizontalDistributeStart: () => Al,
    AlignHorizontalJustifyCenter: () => jl,
    AlignHorizontalJustifyEnd: () => Ml,
    AlignHorizontalJustifyStart: () => Nl,
    AlignHorizontalSpaceAround: () => Fl,
    AlignHorizontalSpaceBetween: () => Pl,
    AlignJustify: () => CL,
    AlignLeft: () => wL,
    AlignRight: () => xL,
    AlignStartHorizontal: () => Ll,
    AlignStartVertical: () => Il,
    AlignVerticalDistributeCenter: () => Rl,
    AlignVerticalDistributeEnd: () => zl,
    AlignVerticalDistributeStart: () => Bl,
    AlignVerticalJustifyCenter: () => Vl,
    AlignVerticalJustifyEnd: () => Hl,
    AlignVerticalJustifyStart: () => Ul,
    AlignVerticalSpaceAround: () => Wl,
    AlignVerticalSpaceBetween: () => Gl,
    Ambulance: () => ql,
    Ampersand: () => Kl,
    Ampersands: () => Jl,
    Amphora: () => Yl,
    Anchor: () => Xl,
    Angry: () => Zl,
    Annoyed: () => Ql,
    Antenna: () => $l,
    Anvil: () => eu,
    Aperture: () => tu,
    AppWindow: () => ru,
    AppWindowMac: () => nu,
    Apple: () => iu,
    Archive: () => su,
    ArchiveRestore: () => au,
    ArchiveX: () => ou,
    AreaChart: () => Um,
    Armchair: () => cu,
    ArrowBigDown: () => uu,
    ArrowBigDownDash: () => lu,
    ArrowBigLeft: () => fu,
    ArrowBigLeftDash: () => du,
    ArrowBigRight: () => mu,
    ArrowBigRightDash: () => pu,
    ArrowBigUp: () => gu,
    ArrowBigUpDash: () => hu,
    ArrowDown: () => ku,
    ArrowDown01: () => _u,
    ArrowDown10: () => vu,
    ArrowDownAZ: () => yu,
    ArrowDownAz: () => yu,
    ArrowDownCircle: () => Hh,
    ArrowDownFromLine: () => bu,
    ArrowDownLeft: () => xu,
    ArrowDownLeftFromCircle: () => Wh,
    ArrowDownLeftFromSquare: () => JP,
    ArrowDownLeftSquare: () => GP,
    ArrowDownNarrowWide: () => Su,
    ArrowDownRight: () => wu,
    ArrowDownRightFromCircle: () => Kh,
    ArrowDownRightFromSquare: () => XP,
    ArrowDownRightSquare: () => KP,
    ArrowDownSquare: () => qP,
    ArrowDownToDot: () => Cu,
    ArrowDownToLine: () => Tu,
    ArrowDownUp: () => Eu,
    ArrowDownWideNarrow: () => Du,
    ArrowDownZA: () => Ou,
    ArrowDownZa: () => Ou,
    ArrowLeft: () => Nu,
    ArrowLeftCircle: () => Uh,
    ArrowLeftFromLine: () => Au,
    ArrowLeftRight: () => ju,
    ArrowLeftSquare: () => YP,
    ArrowLeftToLine: () => Mu,
    ArrowRight: () => zu,
    ArrowRightCircle: () => Jh,
    ArrowRightFromLine: () => Pu,
    ArrowRightLeft: () => Fu,
    ArrowRightSquare: () => tF,
    ArrowRightToLine: () => Iu,
    ArrowUp: () => Xu,
    ArrowUp01: () => Lu,
    ArrowUp10: () => Ru,
    ArrowUpAZ: () => Bu,
    ArrowUpAz: () => Bu,
    ArrowUpCircle: () => Yh,
    ArrowUpDown: () => Vu,
    ArrowUpFromDot: () => Hu,
    ArrowUpFromLine: () => Uu,
    ArrowUpLeft: () => Wu,
    ArrowUpLeftFromCircle: () => Gh,
    ArrowUpLeftFromSquare: () => $P,
    ArrowUpLeftSquare: () => nF,
    ArrowUpNarrowWide: () => Gu,
    ArrowUpRight: () => Ku,
    ArrowUpRightFromCircle: () => qh,
    ArrowUpRightFromSquare: () => ZP,
    ArrowUpRightSquare: () => rF,
    ArrowUpSquare: () => iF,
    ArrowUpToLine: () => qu,
    ArrowUpWideNarrow: () => Ju,
    ArrowUpZA: () => Yu,
    ArrowUpZa: () => Yu,
    ArrowsUpFromLine: () => Zu,
    Asterisk: () => Qu,
    AsteriskSquare: () => aF,
    Astroid: () => $u,
    AtSign: () => ed,
    Atom: () => rd,
    AudioLines: () => td,
    AudioWaveform: () => nd,
    Award: () => id,
    Axe: () => ad,
    Axis3D: () => od,
    Axis3d: () => od,
    Baby: () => sd,
    Backpack: () => cd,
    Badge: () => Ed,
    BadgeAlert: () => ud,
    BadgeCent: () => ld,
    BadgeCheck: () => dd,
    BadgeDollarSign: () => fd,
    BadgeEuro: () => pd,
    BadgeHelp: () => xd,
    BadgeIndianRupee: () => md,
    BadgeInfo: () => hd,
    BadgeJapaneseYen: () => gd,
    BadgeMinus: () => _d,
    BadgePercent: () => vd,
    BadgePlus: () => yd,
    BadgePoundSterling: () => bd,
    BadgeQuestionMark: () => xd,
    BadgeRussianRuble: () => Sd,
    BadgeSwissFranc: () => Cd,
    BadgeTurkishLira: () => wd,
    BadgeX: () => Td,
    BaggageClaim: () => Dd,
    Balloon: () => Od,
    Ban: () => kd,
    Banana: () => Ad,
    Bandage: () => jd,
    Banknote: () => Fd,
    BanknoteArrowDown: () => Md,
    BanknoteArrowUp: () => Nd,
    BanknoteX: () => Pd,
    BarChart: () => ah,
    BarChart2: () => oh,
    BarChart3: () => eh,
    BarChart4: () => Zm,
    BarChartBig: () => Xm,
    BarChartHorizontal: () => Jm,
    BarChartHorizontalBig: () => Gm,
    Barcode: () => Id,
    Barrel: () => Ld,
    Baseline: () => Rd,
    Bath: () => zd,
    Battery: () => Kd,
    BatteryCharging: () => Vd,
    BatteryFull: () => Bd,
    BatteryLow: () => Hd,
    BatteryMedium: () => Ud,
    BatteryPlus: () => Wd,
    BatteryWarning: () => Gd,
    Beaker: () => qd,
    Bean: () => Yd,
    BeanOff: () => Jd,
    Bed: () => Qd,
    BedDouble: () => Zd,
    BedSingle: () => Xd,
    Beef: () => $d,
    BeefOff: () => tf,
    Beer: () => nf,
    BeerOff: () => ef,
    Bell: () => df,
    BellCheck: () => rf,
    BellDot: () => af,
    BellElectric: () => of,
    BellMinus: () => sf,
    BellOff: () => cf,
    BellPlus: () => lf,
    BellRing: () => uf,
    BetweenHorizonalEnd: () => ff,
    BetweenHorizonalStart: () => pf,
    BetweenHorizontalEnd: () => ff,
    BetweenHorizontalStart: () => pf,
    BetweenVerticalEnd: () => mf,
    BetweenVerticalStart: () => _f,
    BicepsFlexed: () => hf,
    Bike: () => gf,
    Binary: () => vf,
    Binoculars: () => yf,
    Biohazard: () => bf,
    Bird: () => xf,
    Birdhouse: () => Sf,
    Bitcoin: () => Cf,
    Blend: () => wf,
    Blender: () => Tf,
    Blinds: () => Ef,
    Blocks: () => Df,
    Bluetooth: () => Af,
    BluetoothConnected: () => Of,
    BluetoothOff: () => kf,
    BluetoothSearching: () => jf,
    Bold: () => Mf,
    Bolt: () => Nf,
    Bomb: () => Pf,
    Bone: () => If,
    Book: () => cp,
    BookA: () => Ff,
    BookAlert: () => Lf,
    BookAudio: () => Rf,
    BookCheck: () => zf,
    BookCopy: () => Bf,
    BookDashed: () => Vf,
    BookDown: () => Hf,
    BookHeadphones: () => Uf,
    BookHeart: () => Gf,
    BookImage: () => Wf,
    BookKey: () => Kf,
    BookLock: () => qf,
    BookMarked: () => Jf,
    BookMinus: () => Yf,
    BookOpen: () => Qf,
    BookOpenCheck: () => Xf,
    BookOpenText: () => Zf,
    BookPlus: () => $f,
    BookSearch: () => ep,
    BookTemplate: () => Vf,
    BookText: () => tp,
    BookType: () => np,
    BookUp: () => ip,
    BookUp2: () => rp,
    BookUser: () => ap,
    BookX: () => op,
    Bookmark: () => pp,
    BookmarkCheck: () => sp,
    BookmarkMinus: () => lp,
    BookmarkOff: () => up,
    BookmarkPlus: () => dp,
    BookmarkX: () => fp,
    BoomBox: () => mp,
    Bot: () => _p,
    BotMessageSquare: () => hp,
    BotOff: () => gp,
    BottleWine: () => vp,
    BowArrow: () => yp,
    Box: () => bp,
    BoxSelect: () => wF,
    Boxes: () => xp,
    Braces: () => Sp,
    Brackets: () => Cp,
    Brain: () => Tp,
    BrainCircuit: () => wp,
    BrainCog: () => Ep,
    BrickWall: () => kp,
    BrickWallFire: () => Dp,
    BrickWallShield: () => Op,
    Briefcase: () => Np,
    BriefcaseBusiness: () => jp,
    BriefcaseConveyorBelt: () => Ap,
    BriefcaseMedical: () => Mp,
    BringToFront: () => Pp,
    Broccoli: () => Fp,
    Brush: () => Lp,
    BrushCleaning: () => Ip,
    Bubbles: () => Rp,
    Bug: () => Hp,
    BugOff: () => zp,
    BugPlay: () => Bp,
    Building: () => Up,
    Building2: () => Vp,
    Bus: () => qp,
    BusFront: () => Wp,
    Cable: () => Kp,
    CableCar: () => Gp,
    Cake: () => Yp,
    CakeSlice: () => Jp,
    Calculator: () => Xp,
    Calendar: () => _m,
    Calendar1: () => Zp,
    CalendarArrowDown: () => Qp,
    CalendarArrowUp: () => $p,
    CalendarCheck: () => tm,
    CalendarCheck2: () => em,
    CalendarClock: () => rm,
    CalendarCog: () => nm,
    CalendarDays: () => im,
    CalendarFold: () => am,
    CalendarHeart: () => om,
    CalendarMinus: () => cm,
    CalendarMinus2: () => sm,
    CalendarOff: () => lm,
    CalendarPlus: () => dm,
    CalendarPlus2: () => um,
    CalendarRange: () => pm,
    CalendarSearch: () => fm,
    CalendarSync: () => mm,
    CalendarX: () => gm,
    CalendarX2: () => hm,
    Calendars: () => ym,
    Camera: () => bm,
    CameraOff: () => vm,
    CandlestickChart: () => Ym,
    Candy: () => Cm,
    CandyCane: () => xm,
    CandyOff: () => Sm,
    Cannabis: () => Tm,
    CannabisOff: () => wm,
    Captions: () => Dm,
    CaptionsOff: () => Em,
    Car: () => km,
    CarFront: () => Om,
    CarTaxiFront: () => Am,
    Caravan: () => jm,
    CardSim: () => Mm,
    Carrot: () => Nm,
    CaseLower: () => Pm,
    CaseSensitive: () => Fm,
    CaseUpper: () => Im,
    CassetteTape: () => zm,
    Cast: () => Lm,
    Castle: () => Rm,
    Cat: () => Bm,
    Cctv: () => Hm,
    CctvOff: () => Vm,
    ChartArea: () => Um,
    ChartBar: () => Jm,
    ChartBarBig: () => Gm,
    ChartBarDecreasing: () => Wm,
    ChartBarIncreasing: () => Km,
    ChartBarStacked: () => qm,
    ChartCandlestick: () => Ym,
    ChartColumn: () => eh,
    ChartColumnBig: () => Xm,
    ChartColumnDecreasing: () => Qm,
    ChartColumnIncreasing: () => Zm,
    ChartColumnStacked: () => $m,
    ChartGantt: () => th,
    ChartLine: () => nh,
    ChartNetwork: () => rh,
    ChartNoAxesColumn: () => oh,
    ChartNoAxesColumnDecreasing: () => ih,
    ChartNoAxesColumnIncreasing: () => ah,
    ChartNoAxesCombined: () => sh,
    ChartNoAxesGantt: () => ch,
    ChartPie: () => lh,
    ChartScatter: () => uh,
    ChartSpline: () => dh,
    Check: () => mh,
    CheckCheck: () => fh,
    CheckCircle: () => Xh,
    CheckCircle2: () => Zh,
    CheckLine: () => ph,
    CheckSquare: () => uF,
    CheckSquare2: () => dF,
    ChefHat: () => gh,
    Cherry: () => hh,
    ChessBishop: () => _h,
    ChessKing: () => vh,
    ChessKnight: () => xh,
    ChessPawn: () => yh,
    ChessQueen: () => bh,
    ChessRook: () => Sh,
    ChevronDown: () => Ch,
    ChevronDownCircle: () => Qh,
    ChevronDownSquare: () => fF,
    ChevronFirst: () => wh,
    ChevronLast: () => Th,
    ChevronLeft: () => Eh,
    ChevronLeftCircle: () => $h,
    ChevronLeftSquare: () => pF,
    ChevronRight: () => Dh,
    ChevronRightCircle: () => eg,
    ChevronRightSquare: () => mF,
    ChevronUp: () => Oh,
    ChevronUpCircle: () => tg,
    ChevronUpSquare: () => hF,
    ChevronsDown: () => kh,
    ChevronsDownUp: () => Ah,
    ChevronsLeft: () => Nh,
    ChevronsLeftRight: () => Mh,
    ChevronsLeftRightEllipsis: () => jh,
    ChevronsRight: () => Ih,
    ChevronsRightLeft: () => Ph,
    ChevronsUp: () => Lh,
    ChevronsUpDown: () => Fh,
    Church: () => Rh,
    Cigarette: () => Bh,
    CigaretteOff: () => zh,
    Circle: () => Mg,
    CircleAlert: () => Vh,
    CircleArrowDown: () => Hh,
    CircleArrowLeft: () => Uh,
    CircleArrowOutDownLeft: () => Wh,
    CircleArrowOutDownRight: () => Kh,
    CircleArrowOutUpLeft: () => Gh,
    CircleArrowOutUpRight: () => qh,
    CircleArrowRight: () => Jh,
    CircleArrowUp: () => Yh,
    CircleCheck: () => Zh,
    CircleCheckBig: () => Xh,
    CircleChevronDown: () => Qh,
    CircleChevronLeft: () => $h,
    CircleChevronRight: () => eg,
    CircleChevronUp: () => tg,
    CircleDashed: () => ng,
    CircleDivide: () => rg,
    CircleDollarSign: () => ig,
    CircleDot: () => og,
    CircleDotDashed: () => ag,
    CircleEllipsis: () => sg,
    CircleEqual: () => cg,
    CircleFadingArrowUp: () => lg,
    CircleFadingPlus: () => ug,
    CircleGauge: () => dg,
    CircleHelp: () => Cg,
    CircleMinus: () => fg,
    CircleOff: () => mg,
    CircleParking: () => hg,
    CircleParkingOff: () => pg,
    CirclePause: () => gg,
    CirclePercent: () => _g,
    CirclePile: () => vg,
    CirclePlay: () => yg,
    CirclePlus: () => bg,
    CirclePoundSterling: () => xg,
    CirclePower: () => Sg,
    CircleQuestionMark: () => Cg,
    CircleSlash: () => Eg,
    CircleSlash2: () => wg,
    CircleSlashed: () => wg,
    CircleSmall: () => Tg,
    CircleStar: () => Dg,
    CircleStop: () => kg,
    CircleUser: () => jg,
    CircleUserRound: () => Og,
    CircleX: () => Ag,
    CircuitBoard: () => Ng,
    Citrus: () => Pg,
    Clapperboard: () => Ig,
    Clipboard: () => qg,
    ClipboardCheck: () => Fg,
    ClipboardClock: () => Lg,
    ClipboardCopy: () => zg,
    ClipboardEdit: () => Ug,
    ClipboardList: () => Rg,
    ClipboardMinus: () => Bg,
    ClipboardPaste: () => Vg,
    ClipboardPen: () => Ug,
    ClipboardPenLine: () => Hg,
    ClipboardPlus: () => Wg,
    ClipboardSignature: () => Hg,
    ClipboardType: () => Gg,
    ClipboardX: () => Kg,
    Clock: () => f_,
    Clock1: () => Jg,
    Clock10: () => Yg,
    Clock11: () => Xg,
    Clock12: () => Zg,
    Clock2: () => e_,
    Clock3: () => Qg,
    Clock4: () => $g,
    Clock5: () => t_,
    Clock6: () => n_,
    Clock7: () => r_,
    Clock8: () => i_,
    Clock9: () => a_,
    ClockAlert: () => o_,
    ClockArrowDown: () => c_,
    ClockArrowUp: () => s_,
    ClockCheck: () => l_,
    ClockFading: () => u_,
    ClockPlus: () => d_,
    ClosedCaption: () => p_,
    Cloud: () => N_,
    CloudAlert: () => m_,
    CloudBackup: () => h_,
    CloudCheck: () => __,
    CloudCog: () => g_,
    CloudDownload: () => v_,
    CloudDrizzle: () => y_,
    CloudFog: () => b_,
    CloudHail: () => x_,
    CloudLightning: () => S_,
    CloudMoon: () => w_,
    CloudMoonRain: () => C_,
    CloudOff: () => T_,
    CloudRain: () => D_,
    CloudRainWind: () => E_,
    CloudSnow: () => O_,
    CloudSun: () => A_,
    CloudSunRain: () => k_,
    CloudSync: () => j_,
    CloudUpload: () => M_,
    Cloudy: () => P_,
    Clover: () => F_,
    Club: () => I_,
    Code: () => R_,
    Code2: () => L_,
    CodeSquare: () => gF,
    CodeXml: () => L_,
    Coffee: () => z_,
    Cog: () => B_,
    Coins: () => V_,
    Columns: () => H_,
    Columns2: () => H_,
    Columns3: () => W_,
    Columns3Cog: () => U_,
    Columns4: () => G_,
    ColumnsSettings: () => U_,
    Combine: () => K_,
    Command: () => J_,
    Compass: () => q_,
    Component: () => Y_,
    Computer: () => X_,
    ConciergeBell: () => Z_,
    Cone: () => $_,
    Construction: () => Q_,
    Contact: () => nv,
    Contact2: () => ev,
    ContactRound: () => ev,
    Container: () => tv,
    Contrast: () => rv,
    Cookie: () => iv,
    CookingPot: () => av,
    Copy: () => dv,
    CopyCheck: () => ov,
    CopyMinus: () => sv,
    CopyPlus: () => cv,
    CopySlash: () => lv,
    CopyX: () => uv,
    Copyleft: () => fv,
    Copyright: () => pv,
    CornerDownLeft: () => mv,
    CornerDownRight: () => hv,
    CornerLeftDown: () => gv,
    CornerLeftUp: () => _v,
    CornerRightDown: () => vv,
    CornerRightUp: () => yv,
    CornerUpLeft: () => bv,
    CornerUpRight: () => xv,
    Cpu: () => Cv,
    CreativeCommons: () => Sv,
    CreditCard: () => wv,
    Croissant: () => Tv,
    Crop: () => Ev,
    Cross: () => Dv,
    Crosshair: () => kv,
    Crown: () => Ov,
    Cuboid: () => Av,
    CupSoda: () => jv,
    CurlyBraces: () => Sp,
    Currency: () => Nv,
    Cylinder: () => Mv,
    Dam: () => Pv,
    Database: () => Rv,
    DatabaseBackup: () => Fv,
    DatabaseSearch: () => Iv,
    DatabaseZap: () => Lv,
    DecimalsArrowLeft: () => zv,
    DecimalsArrowRight: () => Bv,
    Delete: () => Hv,
    Dessert: () => Vv,
    Diameter: () => Uv,
    Diamond: () => qv,
    DiamondMinus: () => Wv,
    DiamondPercent: () => Gv,
    DiamondPlus: () => Kv,
    Dice1: () => Xv,
    Dice2: () => Jv,
    Dice3: () => Yv,
    Dice4: () => Zv,
    Dice5: () => Qv,
    Dice6: () => $v,
    Dices: () => ty,
    Diff: () => ey,
    Disc: () => ay,
    Disc2: () => ny,
    Disc3: () => ry,
    DiscAlbum: () => iy,
    Divide: () => oy,
    DivideCircle: () => rg,
    DivideSquare: () => CF,
    Dna: () => cy,
    DnaOff: () => sy,
    Dock: () => ly,
    Dog: () => dy,
    DollarSign: () => uy,
    Donut: () => fy,
    DoorClosed: () => my,
    DoorClosedLocked: () => py,
    DoorOpen: () => gy,
    Dot: () => hy,
    DotSquare: () => TF,
    Download: () => _y,
    DownloadCloud: () => v_,
    DraftingCompass: () => vy,
    Drama: () => yy,
    Drill: () => by,
    Drone: () => xy,
    Droplet: () => Cy,
    DropletOff: () => Sy,
    Droplets: () => Ty,
    Drum: () => wy,
    Drumstick: () => Ey,
    Dumbbell: () => Dy,
    Ear: () => Ay,
    EarOff: () => Oy,
    Earth: () => jy,
    EarthLock: () => ky,
    Eclipse: () => My,
    Edit: () => LF,
    Edit2: () => lA,
    Edit3: () => oA,
    Egg: () => Fy,
    EggFried: () => Ny,
    EggOff: () => Py,
    Ellipse: () => Iy,
    Ellipsis: () => Ry,
    EllipsisVertical: () => Ly,
    Equal: () => Vy,
    EqualApproximately: () => zy,
    EqualNot: () => By,
    EqualSquare: () => EF,
    Eraser: () => Hy,
    EthernetPort: () => Uy,
    Euro: () => Wy,
    EvCharger: () => Gy,
    Expand: () => Ky,
    ExternalLink: () => qy,
    Eye: () => Xy,
    EyeClosed: () => Jy,
    EyeOff: () => Yy,
    Factory: () => Qy,
    Fan: () => Zy,
    FastForward: () => $y,
    Feather: () => eb,
    Fence: () => tb,
    FerrisWheel: () => nb,
    File: () => rx,
    FileArchive: () => rb,
    FileAudio: () => Tb,
    FileAudio2: () => Tb,
    FileAxis3D: () => ib,
    FileAxis3d: () => ib,
    FileBadge: () => ab,
    FileBadge2: () => ab,
    FileBarChart: () => lb,
    FileBarChart2: () => ub,
    FileBox: () => ob,
    FileBraces: () => cb,
    FileBracesCorner: () => sb,
    FileChartColumn: () => ub,
    FileChartColumnIncreasing: () => lb,
    FileChartLine: () => db,
    FileChartPie: () => fb,
    FileCheck: () => mb,
    FileCheck2: () => pb,
    FileCheckCorner: () => pb,
    FileClock: () => hb,
    FileCode: () => _b,
    FileCode2: () => gb,
    FileCodeCorner: () => gb,
    FileCog: () => vb,
    FileCog2: () => vb,
    FileDiff: () => yb,
    FileDigit: () => bb,
    FileDown: () => xb,
    FileEdit: () => Pb,
    FileExclamationPoint: () => Sb,
    FileHeadphone: () => Tb,
    FileHeart: () => Cb,
    FileImage: () => wb,
    FileInput: () => Eb,
    FileJson: () => cb,
    FileJson2: () => sb,
    FileKey: () => Db,
    FileKey2: () => Db,
    FileLineChart: () => db,
    FileLock: () => Ob,
    FileLock2: () => Ob,
    FileMinus: () => Ab,
    FileMinus2: () => kb,
    FileMinusCorner: () => kb,
    FileMusic: () => jb,
    FileOutput: () => Mb,
    FilePen: () => Pb,
    FilePenLine: () => Nb,
    FilePieChart: () => fb,
    FilePlay: () => Fb,
    FilePlus: () => Lb,
    FilePlus2: () => Ib,
    FilePlusCorner: () => Ib,
    FileQuestion: () => Rb,
    FileQuestionMark: () => Rb,
    FileScan: () => zb,
    FileSearch: () => Vb,
    FileSearch2: () => Bb,
    FileSearchCorner: () => Bb,
    FileSignal: () => Hb,
    FileSignature: () => Nb,
    FileSliders: () => Ub,
    FileSpreadsheet: () => Wb,
    FileStack: () => Kb,
    FileSymlink: () => Gb,
    FileTerminal: () => qb,
    FileText: () => Jb,
    FileType: () => Xb,
    FileType2: () => Yb,
    FileTypeCorner: () => Yb,
    FileUp: () => Zb,
    FileUser: () => Qb,
    FileVideo: () => Fb,
    FileVideo2: () => $b,
    FileVideoCamera: () => $b,
    FileVolume: () => ex,
    FileVolume2: () => Hb,
    FileWarning: () => Sb,
    FileX: () => nx,
    FileX2: () => tx,
    FileXCorner: () => tx,
    Files: () => ix,
    Film: () => ax,
    Filter: () => yS,
    FilterX: () => vS,
    Fingerprint: () => ox,
    FingerprintPattern: () => ox,
    FireExtinguisher: () => sx,
    Fish: () => ux,
    FishOff: () => cx,
    FishSymbol: () => lx,
    FishingHook: () => dx,
    FishingRod: () => fx,
    Flag: () => gx,
    FlagOff: () => px,
    FlagTriangleLeft: () => mx,
    FlagTriangleRight: () => hx,
    Flame: () => _x,
    FlameKindling: () => vx,
    Flashlight: () => bx,
    FlashlightOff: () => yx,
    FlaskConical: () => Sx,
    FlaskConicalOff: () => xx,
    FlaskRound: () => Cx,
    FlipHorizontal: () => sF,
    FlipHorizontal2: () => wx,
    FlipVertical: () => cF,
    FlipVertical2: () => Tx,
    Flower: () => Dx,
    Flower2: () => Ex,
    Focus: () => Ox,
    FoldHorizontal: () => kx,
    FoldVertical: () => Ax,
    Folder: () => sS,
    FolderArchive: () => jx,
    FolderBookmark: () => Mx,
    FolderCheck: () => Nx,
    FolderClock: () => Px,
    FolderClosed: () => Fx,
    FolderCode: () => Lx,
    FolderCog: () => Ix,
    FolderCog2: () => Ix,
    FolderDot: () => Rx,
    FolderDown: () => zx,
    FolderEdit: () => Zx,
    FolderGit: () => Vx,
    FolderGit2: () => Bx,
    FolderHeart: () => Hx,
    FolderInput: () => Ux,
    FolderKanban: () => Wx,
    FolderKey: () => Gx,
    FolderLock: () => Kx,
    FolderMinus: () => qx,
    FolderOpen: () => Yx,
    FolderOpenDot: () => Jx,
    FolderOutput: () => Xx,
    FolderPen: () => Zx,
    FolderPlus: () => Qx,
    FolderRoot: () => $x,
    FolderSearch: () => tS,
    FolderSearch2: () => eS,
    FolderSymlink: () => nS,
    FolderSync: () => rS,
    FolderTree: () => iS,
    FolderUp: () => aS,
    FolderX: () => oS,
    Folders: () => cS,
    Footprints: () => lS,
    ForkKnife: () => Cz,
    ForkKnifeCrossed: () => Sz,
    Forklift: () => uS,
    Form: () => fS,
    FormInput: () => Ij,
    Forward: () => dS,
    Frame: () => pS,
    Frown: () => mS,
    Fuel: () => hS,
    Fullscreen: () => gS,
    FunctionSquare: () => DF,
    Funnel: () => yS,
    FunnelPlus: () => _S,
    FunnelX: () => vS,
    GalleryHorizontal: () => xS,
    GalleryHorizontalEnd: () => bS,
    GalleryThumbnails: () => SS,
    GalleryVertical: () => wS,
    GalleryVerticalEnd: () => CS,
    Gamepad: () => DS,
    Gamepad2: () => TS,
    GamepadDirectional: () => ES,
    GanttChart: () => ch,
    GanttChartSquare: () => lF,
    Gauge: () => OS,
    GaugeCircle: () => dg,
    Gavel: () => kS,
    Gem: () => AS,
    GeorgianLari: () => jS,
    Ghost: () => MS,
    Gift: () => NS,
    GitBranch: () => IS,
    GitBranchMinus: () => PS,
    GitBranchPlus: () => FS,
    GitCommit: () => LS,
    GitCommitHorizontal: () => LS,
    GitCommitVertical: () => RS,
    GitCompare: () => BS,
    GitCompareArrows: () => zS,
    GitFork: () => VS,
    GitGraph: () => HS,
    GitMerge: () => US,
    GitMergeConflict: () => WS,
    GitPullRequest: () => XS,
    GitPullRequestArrow: () => GS,
    GitPullRequestClosed: () => KS,
    GitPullRequestCreate: () => JS,
    GitPullRequestCreateArrow: () => qS,
    GitPullRequestDraft: () => YS,
    GlassWater: () => ZS,
    Glasses: () => QS,
    Globe: () => rC,
    Globe2: () => jy,
    GlobeCheck: () => $S,
    GlobeLock: () => eC,
    GlobeOff: () => tC,
    GlobeX: () => nC,
    Goal: () => aC,
    Gpu: () => iC,
    Grab: () => wC,
    GraduationCap: () => oC,
    Grape: () => sC,
    Grid: () => mC,
    Grid2X2: () => dC,
    Grid2X2Check: () => cC,
    Grid2X2Plus: () => lC,
    Grid2X2X: () => uC,
    Grid2x2: () => dC,
    Grid2x2Check: () => cC,
    Grid2x2Plus: () => lC,
    Grid2x2X: () => uC,
    Grid3X3: () => mC,
    Grid3x2: () => fC,
    Grid3x3: () => mC,
    Grip: () => vC,
    GripHorizontal: () => pC,
    GripVertical: () => hC,
    Group: () => gC,
    Guitar: () => _C,
    Ham: () => yC,
    Hamburger: () => bC,
    Hammer: () => SC,
    Hand: () => AC,
    HandCoins: () => xC,
    HandFist: () => CC,
    HandGrab: () => wC,
    HandHeart: () => TC,
    HandHelping: () => EC,
    HandMetal: () => DC,
    HandPlatter: () => OC,
    Handbag: () => kC,
    Handshake: () => jC,
    HardDrive: () => PC,
    HardDriveDownload: () => MC,
    HardDriveUpload: () => NC,
    HardHat: () => FC,
    Hash: () => IC,
    HatGlasses: () => LC,
    Haze: () => RC,
    Hd: () => zC,
    HdmiPort: () => BC,
    Heading: () => qC,
    Heading1: () => VC,
    Heading2: () => HC,
    Heading3: () => UC,
    Heading4: () => GC,
    Heading5: () => WC,
    Heading6: () => KC,
    HeadphoneOff: () => YC,
    Headphones: () => JC,
    Headset: () => XC,
    Heart: () => iw,
    HeartCrack: () => ZC,
    HeartHandshake: () => QC,
    HeartMinus: () => ew,
    HeartOff: () => $C,
    HeartPlus: () => nw,
    HeartPulse: () => tw,
    HeartX: () => rw,
    Heater: () => aw,
    Helicopter: () => ow,
    HelpCircle: () => Cg,
    HelpingHand: () => EC,
    Hexagon: () => sw,
    Highlighter: () => cw,
    History: () => lw,
    Home: () => yw,
    Hop: () => dw,
    HopOff: () => uw,
    Hospital: () => fw,
    Hotel: () => pw,
    Hourglass: () => mw,
    House: () => yw,
    HouseHeart: () => hw,
    HousePlug: () => gw,
    HousePlus: () => _w,
    HouseWifi: () => vw,
    IceCream: () => xw,
    IceCream2: () => bw,
    IceCreamBowl: () => bw,
    IceCreamCone: () => xw,
    IdCard: () => Cw,
    IdCardLanyard: () => Sw,
    Image: () => jw,
    ImageDown: () => ww,
    ImageMinus: () => Tw,
    ImageOff: () => Ew,
    ImagePlay: () => Dw,
    ImagePlus: () => Ow,
    ImageUp: () => kw,
    ImageUpscale: () => Aw,
    Images: () => Mw,
    Import: () => Nw,
    Inbox: () => Pw,
    Indent: () => YT,
    IndentDecrease: () => JT,
    IndentIncrease: () => YT,
    IndianRupee: () => Fw,
    Infinity: () => Iw,
    Info: () => Lw,
    Inspect: () => NF,
    InspectionPanel: () => Rw,
    Italic: () => zw,
    IterationCcw: () => Bw,
    IterationCw: () => Vw,
    JapaneseYen: () => Uw,
    Joystick: () => Hw,
    Kanban: () => Ww,
    KanbanSquare: () => AF,
    KanbanSquareDashed: () => vF,
    Kayak: () => Gw,
    Key: () => Jw,
    KeyRound: () => Kw,
    KeySquare: () => qw,
    Keyboard: () => Zw,
    KeyboardMusic: () => Yw,
    KeyboardOff: () => Xw,
    Lamp: () => nT,
    LampCeiling: () => Qw,
    LampDesk: () => $w,
    LampFloor: () => eT,
    LampWallDown: () => tT,
    LampWallUp: () => rT,
    LandPlot: () => iT,
    Landmark: () => aT,
    Languages: () => oT,
    Laptop: () => cT,
    Laptop2: () => lT,
    LaptopMinimal: () => lT,
    LaptopMinimalCheck: () => sT,
    Lasso: () => dT,
    LassoSelect: () => uT,
    Laugh: () => fT,
    Layers: () => gT,
    Layers2: () => pT,
    Layers3: () => gT,
    LayersMinus: () => mT,
    LayersPlus: () => hT,
    Layout: () => Zk,
    LayoutDashboard: () => _T,
    LayoutGrid: () => vT,
    LayoutList: () => yT,
    LayoutPanelLeft: () => bT,
    LayoutPanelTop: () => xT,
    LayoutTemplate: () => ST,
    Leaf: () => CT,
    LeafyGreen: () => wT,
    Lectern: () => TT,
    LensConcave: () => ET,
    LensConvex: () => DT,
    LetterText: () => DL,
    Library: () => kT,
    LibraryBig: () => OT,
    LibrarySquare: () => kF,
    LifeBuoy: () => AT,
    Ligature: () => jT,
    Lightbulb: () => MT,
    LightbulbOff: () => NT,
    LineChart: () => nh,
    LineDotRightHorizontal: () => PT,
    LineSquiggle: () => FT,
    LineStyle: () => IT,
    Link: () => zT,
    Link2: () => LT,
    Link2Off: () => RT,
    List: () => oE,
    ListCheck: () => BT,
    ListChecks: () => VT,
    ListChevronsDownUp: () => HT,
    ListChevronsUpDown: () => UT,
    ListCollapse: () => WT,
    ListEnd: () => GT,
    ListFilter: () => qT,
    ListFilterPlus: () => KT,
    ListIndentDecrease: () => JT,
    ListIndentIncrease: () => YT,
    ListMinus: () => XT,
    ListMusic: () => ZT,
    ListOrdered: () => QT,
    ListPlus: () => $T,
    ListRestart: () => eE,
    ListStart: () => tE,
    ListTodo: () => nE,
    ListTree: () => rE,
    ListVideo: () => iE,
    ListX: () => aE,
    Loader: () => lE,
    Loader2: () => sE,
    LoaderCircle: () => sE,
    LoaderPinwheel: () => cE,
    Locate: () => fE,
    LocateFixed: () => uE,
    LocateOff: () => dE,
    LocationEdit: () => VE,
    Lock: () => gE,
    LockKeyhole: () => mE,
    LockKeyholeOpen: () => pE,
    LockOpen: () => hE,
    LogIn: () => vE,
    LogOut: () => _E,
    Logs: () => yE,
    Lollipop: () => bE,
    Luggage: () => xE,
    MSquare: () => OF,
    Magnet: () => SE,
    Mail: () => jE,
    MailCheck: () => CE,
    MailMinus: () => wE,
    MailOpen: () => TE,
    MailPlus: () => DE,
    MailQuestion: () => EE,
    MailQuestionMark: () => EE,
    MailSearch: () => OE,
    MailWarning: () => kE,
    MailX: () => AE,
    Mailbox: () => ME,
    Mails: () => PE,
    Map: () => XE,
    MapMinus: () => NE,
    MapPin: () => JE,
    MapPinCheck: () => IE,
    MapPinCheckInside: () => FE,
    MapPinHouse: () => LE,
    MapPinMinus: () => zE,
    MapPinMinusInside: () => RE,
    MapPinOff: () => BE,
    MapPinPen: () => VE,
    MapPinPlus: () => UE,
    MapPinPlusInside: () => HE,
    MapPinSearch: () => WE,
    MapPinX: () => KE,
    MapPinXInside: () => GE,
    MapPinned: () => qE,
    MapPlus: () => YE,
    Mars: () => QE,
    MarsStroke: () => ZE,
    Martini: () => $E,
    Maximize: () => tD,
    Maximize2: () => eD,
    Medal: () => nD,
    Megaphone: () => iD,
    MegaphoneOff: () => rD,
    Meh: () => aD,
    MemoryStick: () => sD,
    Menu: () => oD,
    MenuSquare: () => MF,
    Merge: () => cD,
    MessageCircle: () => bD,
    MessageCircleCheck: () => lD,
    MessageCircleCode: () => dD,
    MessageCircleDashed: () => uD,
    MessageCircleHeart: () => pD,
    MessageCircleMore: () => fD,
    MessageCircleOff: () => mD,
    MessageCirclePlus: () => hD,
    MessageCircleQuestion: () => gD,
    MessageCircleQuestionMark: () => gD,
    MessageCircleReply: () => _D,
    MessageCircleWarning: () => vD,
    MessageCircleX: () => yD,
    MessageSquare: () => LD,
    MessageSquareCheck: () => xD,
    MessageSquareCode: () => SD,
    MessageSquareDashed: () => CD,
    MessageSquareDiff: () => wD,
    MessageSquareDot: () => ED,
    MessageSquareHeart: () => TD,
    MessageSquareLock: () => DD,
    MessageSquareMore: () => OD,
    MessageSquareOff: () => AD,
    MessageSquarePlus: () => kD,
    MessageSquareQuote: () => jD,
    MessageSquareReply: () => MD,
    MessageSquareShare: () => PD,
    MessageSquareText: () => ND,
    MessageSquareWarning: () => FD,
    MessageSquareX: () => ID,
    MessagesSquare: () => zD,
    Metronome: () => RD,
    Mic: () => HD,
    Mic2: () => VD,
    MicOff: () => BD,
    MicVocal: () => VD,
    Microchip: () => WD,
    Microscope: () => UD,
    Microwave: () => GD,
    Milestone: () => KD,
    Milk: () => qD,
    MilkOff: () => JD,
    Minimize: () => ZD,
    Minimize2: () => YD,
    Minus: () => XD,
    MinusCircle: () => fg,
    MinusSquare: () => jF,
    MirrorRectangular: () => QD,
    MirrorRound: () => $D,
    Monitor: () => pO,
    MonitorCheck: () => eO,
    MonitorCloud: () => nO,
    MonitorCog: () => tO,
    MonitorDot: () => rO,
    MonitorDown: () => iO,
    MonitorOff: () => aO,
    MonitorPause: () => oO,
    MonitorPlay: () => sO,
    MonitorSmartphone: () => cO,
    MonitorSpeaker: () => lO,
    MonitorStop: () => uO,
    MonitorUp: () => dO,
    MonitorX: () => fO,
    Moon: () => mO,
    MoonStar: () => hO,
    MoreHorizontal: () => Ry,
    MoreVertical: () => Ly,
    Motorbike: () => gO,
    Mountain: () => vO,
    MountainSnow: () => _O,
    Mouse: () => DO,
    MouseLeft: () => yO,
    MouseOff: () => bO,
    MousePointer: () => TO,
    MousePointer2: () => SO,
    MousePointer2Off: () => xO,
    MousePointerBan: () => CO,
    MousePointerClick: () => wO,
    MousePointerSquareDashed: () => bF,
    MouseRight: () => EO,
    Move: () => VO,
    Move3D: () => OO,
    Move3d: () => OO,
    MoveDiagonal: () => AO,
    MoveDiagonal2: () => kO,
    MoveDown: () => NO,
    MoveDownLeft: () => jO,
    MoveDownRight: () => MO,
    MoveHorizontal: () => PO,
    MoveLeft: () => FO,
    MoveRight: () => IO,
    MoveUp: () => zO,
    MoveUpLeft: () => LO,
    MoveUpRight: () => RO,
    MoveVertical: () => BO,
    Music: () => GO,
    Music2: () => HO,
    Music3: () => UO,
    Music4: () => WO,
    Navigation: () => YO,
    Navigation2: () => qO,
    Navigation2Off: () => KO,
    NavigationOff: () => JO,
    Network: () => XO,
    Newspaper: () => ZO,
    Nfc: () => QO,
    NonBinary: () => $O,
    Notebook: () => rk,
    NotebookPen: () => ek,
    NotebookTabs: () => tk,
    NotebookText: () => nk,
    NotepadText: () => ak,
    NotepadTextDashed: () => ik,
    Nut: () => sk,
    NutOff: () => ok,
    Octagon: () => fk,
    OctagonAlert: () => ck,
    OctagonMinus: () => lk,
    OctagonPause: () => uk,
    OctagonX: () => dk,
    Omega: () => pk,
    Option: () => mk,
    Orbit: () => hk,
    Origami: () => gk,
    Outdent: () => JT,
    Package: () => Ek,
    Package2: () => _k,
    PackageCheck: () => vk,
    PackageMinus: () => yk,
    PackageOpen: () => bk,
    PackagePlus: () => xk,
    PackageSearch: () => Sk,
    PackageX: () => Ck,
    PaintBucket: () => wk,
    PaintRoller: () => Tk,
    Paintbrush: () => Ak,
    Paintbrush2: () => Dk,
    PaintbrushVertical: () => Dk,
    Palette: () => Ok,
    Palmtree: () => yR,
    Panda: () => kk,
    PanelBottom: () => Nk,
    PanelBottomClose: () => jk,
    PanelBottomDashed: () => Mk,
    PanelBottomInactive: () => Mk,
    PanelBottomOpen: () => Pk,
    PanelLeft: () => zk,
    PanelLeftClose: () => Fk,
    PanelLeftDashed: () => Ik,
    PanelLeftInactive: () => Ik,
    PanelLeftOpen: () => Lk,
    PanelLeftRightDashed: () => Rk,
    PanelRight: () => Wk,
    PanelRightClose: () => Vk,
    PanelRightDashed: () => Bk,
    PanelRightInactive: () => Bk,
    PanelRightOpen: () => Hk,
    PanelTop: () => Jk,
    PanelTopBottomDashed: () => Gk,
    PanelTopClose: () => Uk,
    PanelTopDashed: () => Kk,
    PanelTopInactive: () => Kk,
    PanelTopOpen: () => qk,
    PanelsLeftBottom: () => Yk,
    PanelsLeftRight: () => W_,
    PanelsRightBottom: () => Xk,
    PanelsTopBottom: () => SM,
    PanelsTopLeft: () => Zk,
    Paperclip: () => Qk,
    Parasol: () => $k,
    Parentheses: () => eA,
    ParkingCircle: () => hg,
    ParkingCircleOff: () => pg,
    ParkingMeter: () => tA,
    ParkingSquare: () => PF,
    ParkingSquareOff: () => FF,
    PartyPopper: () => nA,
    Pause: () => rA,
    PauseCircle: () => gg,
    PauseOctagon: () => uk,
    PawPrint: () => iA,
    PcCase: () => aA,
    Pen: () => lA,
    PenBox: () => LF,
    PenLine: () => oA,
    PenOff: () => cA,
    PenSquare: () => LF,
    PenTool: () => sA,
    Pencil: () => pA,
    PencilLine: () => uA,
    PencilOff: () => dA,
    PencilRuler: () => fA,
    Pentagon: () => hA,
    Percent: () => mA,
    PercentCircle: () => _g,
    PercentDiamond: () => Gv,
    PercentSquare: () => RF,
    PersonStanding: () => gA,
    PhilippinePeso: () => _A,
    Phone: () => wA,
    PhoneCall: () => vA,
    PhoneForwarded: () => yA,
    PhoneIncoming: () => bA,
    PhoneMissed: () => xA,
    PhoneOff: () => SA,
    PhoneOutgoing: () => CA,
    Pi: () => TA,
    PiSquare: () => zF,
    Piano: () => EA,
    Pickaxe: () => DA,
    PictureInPicture: () => kA,
    PictureInPicture2: () => OA,
    PieChart: () => lh,
    PiggyBank: () => AA,
    Pilcrow: () => MA,
    PilcrowLeft: () => jA,
    PilcrowRight: () => NA,
    PilcrowSquare: () => BF,
    Pill: () => FA,
    PillBottle: () => PA,
    Pin: () => LA,
    PinOff: () => IA,
    Pipette: () => RA,
    Pizza: () => zA,
    Plane: () => HA,
    PlaneLanding: () => BA,
    PlaneTakeoff: () => VA,
    Play: () => UA,
    PlayCircle: () => yg,
    PlaySquare: () => VF,
    Plug: () => GA,
    Plug2: () => WA,
    PlugZap: () => qA,
    PlugZap2: () => qA,
    Plus: () => KA,
    PlusCircle: () => bg,
    PlusSquare: () => HF,
    PocketKnife: () => JA,
    Podcast: () => XA,
    Pointer: () => ZA,
    PointerOff: () => YA,
    Popcorn: () => QA,
    Popsicle: () => $A,
    PoundSterling: () => ej,
    Power: () => nj,
    PowerCircle: () => Sg,
    PowerOff: () => tj,
    PowerSquare: () => UF,
    Presentation: () => rj,
    Printer: () => oj,
    PrinterCheck: () => ij,
    PrinterX: () => aj,
    Projector: () => sj,
    Proportions: () => cj,
    Puzzle: () => uj,
    Pyramid: () => lj,
    QrCode: () => fj,
    Quote: () => dj,
    Rabbit: () => pj,
    Radar: () => mj,
    Radiation: () => hj,
    Radical: () => _j,
    Radio: () => bj,
    RadioOff: () => gj,
    RadioReceiver: () => vj,
    RadioTower: () => yj,
    Radius: () => xj,
    Rainbow: () => Sj,
    Rat: () => Cj,
    Ratio: () => Tj,
    Receipt: () => Mj,
    ReceiptCent: () => wj,
    ReceiptEuro: () => Ej,
    ReceiptIndianRupee: () => Oj,
    ReceiptJapaneseYen: () => Dj,
    ReceiptPoundSterling: () => kj,
    ReceiptRussianRuble: () => Aj,
    ReceiptSwissFranc: () => jj,
    ReceiptText: () => Nj,
    ReceiptTurkishLira: () => Pj,
    RectangleCircle: () => Fj,
    RectangleEllipsis: () => Ij,
    RectangleGoggles: () => Lj,
    RectangleHorizontal: () => Rj,
    RectangleVertical: () => zj,
    Recycle: () => Bj,
    Redo: () => Uj,
    Redo2: () => Vj,
    RedoDot: () => Hj,
    RefreshCcw: () => Gj,
    RefreshCcwDot: () => Wj,
    RefreshCw: () => qj,
    RefreshCwOff: () => Kj,
    Refrigerator: () => Jj,
    Regex: () => Yj,
    RemoveFormatting: () => Xj,
    Repeat: () => eM,
    Repeat1: () => Zj,
    Repeat2: () => Qj,
    RepeatOff: () => $j,
    Replace: () => nM,
    ReplaceAll: () => tM,
    Reply: () => rM,
    ReplyAll: () => aM,
    Rewind: () => iM,
    Ribbon: () => oM,
    Road: () => sM,
    Rocket: () => cM,
    RockingChair: () => lM,
    RollerCoaster: () => uM,
    Rose: () => dM,
    Rotate3D: () => fM,
    Rotate3d: () => fM,
    RotateCcw: () => hM,
    RotateCcwKey: () => pM,
    RotateCcwSquare: () => mM,
    RotateCw: () => _M,
    RotateCwSquare: () => gM,
    Route: () => yM,
    RouteOff: () => vM,
    Router: () => bM,
    Rows: () => xM,
    Rows2: () => xM,
    Rows3: () => SM,
    Rows4: () => CM,
    Rss: () => wM,
    Ruler: () => EM,
    RulerDimensionLine: () => TM,
    RussianRuble: () => DM,
    Sailboat: () => OM,
    Salad: () => kM,
    Sandwich: () => AM,
    Satellite: () => MM,
    SatelliteDish: () => jM,
    SaudiRiyal: () => NM,
    Save: () => IM,
    SaveAll: () => PM,
    SaveOff: () => FM,
    Scale: () => RM,
    Scale3D: () => LM,
    Scale3d: () => LM,
    Scaling: () => zM,
    Scan: () => JM,
    ScanBarcode: () => BM,
    ScanEye: () => VM,
    ScanFace: () => HM,
    ScanHeart: () => UM,
    ScanLine: () => WM,
    ScanQrCode: () => GM,
    ScanSearch: () => KM,
    ScanText: () => qM,
    ScatterChart: () => uh,
    School: () => YM,
    School2: () => JR,
    Scissors: () => ZM,
    ScissorsLineDashed: () => XM,
    ScissorsSquare: () => qF,
    ScissorsSquareDashedBottom: () => oF,
    Scooter: () => QM,
    ScreenShare: () => eN,
    ScreenShareOff: () => $M,
    Scroll: () => nN,
    ScrollText: () => tN,
    Search: () => cN,
    SearchAlert: () => rN,
    SearchCheck: () => iN,
    SearchCode: () => aN,
    SearchSlash: () => oN,
    SearchX: () => sN,
    Section: () => lN,
    Send: () => fN,
    SendHorizonal: () => uN,
    SendHorizontal: () => uN,
    SendToBack: () => dN,
    SeparatorHorizontal: () => pN,
    SeparatorVertical: () => mN,
    Server: () => vN,
    ServerCog: () => hN,
    ServerCrash: () => gN,
    ServerOff: () => _N,
    Settings: () => bN,
    Settings2: () => yN,
    Shapes: () => xN,
    Share: () => CN,
    Share2: () => SN,
    Sheet: () => wN,
    Shell: () => TN,
    ShelvingUnit: () => EN,
    Shield: () => VN,
    ShieldAlert: () => ON,
    ShieldBan: () => DN,
    ShieldCheck: () => kN,
    ShieldClose: () => zN,
    ShieldCog: () => jN,
    ShieldCogCorner: () => AN,
    ShieldEllipsis: () => MN,
    ShieldHalf: () => NN,
    ShieldMinus: () => FN,
    ShieldOff: () => PN,
    ShieldPlus: () => IN,
    ShieldQuestion: () => LN,
    ShieldQuestionMark: () => LN,
    ShieldUser: () => RN,
    ShieldX: () => zN,
    Ship: () => HN,
    ShipWheel: () => BN,
    Shirt: () => UN,
    ShoppingBag: () => WN,
    ShoppingBasket: () => KN,
    ShoppingCart: () => GN,
    Shovel: () => qN,
    ShowerHead: () => JN,
    Shredder: () => XN,
    Shrimp: () => YN,
    Shrink: () => ZN,
    Shrub: () => QN,
    Shuffle: () => $N,
    Sidebar: () => zk,
    SidebarClose: () => Fk,
    SidebarOpen: () => Lk,
    Sigma: () => eP,
    SigmaSquare: () => KF,
    Signal: () => aP,
    SignalHigh: () => tP,
    SignalLow: () => nP,
    SignalMedium: () => rP,
    SignalZero: () => iP,
    Signature: () => oP,
    Signpost: () => cP,
    SignpostBig: () => sP,
    Siren: () => lP,
    SkipBack: () => uP,
    SkipForward: () => dP,
    Skull: () => fP,
    Slash: () => pP,
    SlashSquare: () => JF,
    Slice: () => mP,
    Sliders: () => gP,
    SlidersHorizontal: () => hP,
    SlidersVertical: () => gP,
    Smartphone: () => yP,
    SmartphoneCharging: () => _P,
    SmartphoneNfc: () => vP,
    Smile: () => xP,
    SmilePlus: () => bP,
    Snail: () => SP,
    Snowflake: () => CP,
    SoapDispenserDroplet: () => wP,
    Sofa: () => TP,
    SolarPanel: () => EP,
    SortAsc: () => Gu,
    SortDesc: () => Du,
    Soup: () => DP,
    Space: () => OP,
    Spade: () => kP,
    Sparkle: () => AP,
    Sparkles: () => jP,
    Speaker: () => MP,
    Speech: () => NP,
    SpellCheck: () => PP,
    SpellCheck2: () => FP,
    Spline: () => LP,
    SplinePointer: () => IP,
    Split: () => RP,
    SplitSquareHorizontal: () => YF,
    SplitSquareVertical: () => XF,
    Spool: () => zP,
    SportShoe: () => BP,
    Spotlight: () => VP,
    SprayCan: () => HP,
    Sprout: () => UP,
    Square: () => aI,
    SquareActivity: () => WP,
    SquareArrowDown: () => qP,
    SquareArrowDownLeft: () => GP,
    SquareArrowDownRight: () => KP,
    SquareArrowLeft: () => YP,
    SquareArrowOutDownLeft: () => JP,
    SquareArrowOutDownRight: () => XP,
    SquareArrowOutUpLeft: () => $P,
    SquareArrowOutUpRight: () => ZP,
    SquareArrowRight: () => tF,
    SquareArrowRightEnter: () => QP,
    SquareArrowRightExit: () => eF,
    SquareArrowUp: () => iF,
    SquareArrowUpLeft: () => nF,
    SquareArrowUpRight: () => rF,
    SquareAsterisk: () => aF,
    SquareBottomDashedScissors: () => oF,
    SquareCenterlineDashedHorizontal: () => sF,
    SquareCenterlineDashedVertical: () => cF,
    SquareChartGantt: () => lF,
    SquareCheck: () => dF,
    SquareCheckBig: () => uF,
    SquareChevronDown: () => fF,
    SquareChevronLeft: () => pF,
    SquareChevronRight: () => mF,
    SquareChevronUp: () => hF,
    SquareCode: () => gF,
    SquareDashed: () => wF,
    SquareDashedBottom: () => yF,
    SquareDashedBottomCode: () => _F,
    SquareDashedKanban: () => vF,
    SquareDashedMousePointer: () => bF,
    SquareDashedText: () => xF,
    SquareDashedTopSolid: () => SF,
    SquareDivide: () => CF,
    SquareDot: () => TF,
    SquareEqual: () => EF,
    SquareFunction: () => DF,
    SquareGanttChart: () => lF,
    SquareKanban: () => AF,
    SquareLibrary: () => kF,
    SquareM: () => OF,
    SquareMenu: () => MF,
    SquareMinus: () => jF,
    SquareMousePointer: () => NF,
    SquareParking: () => PF,
    SquareParkingOff: () => FF,
    SquarePause: () => IF,
    SquarePen: () => LF,
    SquarePercent: () => RF,
    SquarePi: () => zF,
    SquarePilcrow: () => BF,
    SquarePlay: () => VF,
    SquarePlus: () => HF,
    SquarePower: () => UF,
    SquareRadical: () => WF,
    SquareRoundCorner: () => GF,
    SquareScissors: () => qF,
    SquareSigma: () => KF,
    SquareSlash: () => JF,
    SquareSplitHorizontal: () => YF,
    SquareSplitVertical: () => XF,
    SquareSquare: () => ZF,
    SquareStack: () => $F,
    SquareStar: () => QF,
    SquareStop: () => eI,
    SquareTerminal: () => tI,
    SquareUser: () => rI,
    SquareUserRound: () => nI,
    SquareX: () => iI,
    SquaresExclude: () => sI,
    SquaresIntersect: () => oI,
    SquaresSubtract: () => lI,
    SquaresUnite: () => cI,
    Squircle: () => dI,
    SquircleDashed: () => uI,
    Squirrel: () => fI,
    Stamp: () => pI,
    Star: () => gI,
    StarHalf: () => mI,
    StarOff: () => hI,
    Stars: () => jP,
    StepBack: () => _I,
    StepForward: () => vI,
    Stethoscope: () => yI,
    Sticker: () => bI,
    StickyNote: () => EI,
    StickyNoteCheck: () => xI,
    StickyNoteMinus: () => SI,
    StickyNoteOff: () => wI,
    StickyNotePlus: () => CI,
    StickyNoteX: () => TI,
    StickyNotes: () => DI,
    Stone: () => OI,
    StopCircle: () => kg,
    Store: () => kI,
    StretchHorizontal: () => AI,
    StretchVertical: () => jI,
    Strikethrough: () => MI,
    Subscript: () => NI,
    Subtitles: () => Dm,
    Sun: () => RI,
    SunDim: () => PI,
    SunMedium: () => FI,
    SunMoon: () => II,
    SunSnow: () => LI,
    Sunrise: () => zI,
    Sunset: () => VI,
    Superscript: () => BI,
    SwatchBook: () => HI,
    SwissFranc: () => UI,
    SwitchCamera: () => WI,
    Sword: () => GI,
    Swords: () => KI,
    Syringe: () => qI,
    Table: () => tL,
    Table2: () => JI,
    TableCellsMerge: () => YI,
    TableCellsSplit: () => XI,
    TableColumnsSplit: () => ZI,
    TableConfig: () => U_,
    TableOfContents: () => QI,
    TableProperties: () => $I,
    TableRowsSplit: () => eL,
    Tablet: () => rL,
    TabletSmartphone: () => nL,
    Tablets: () => iL,
    Tag: () => aL,
    Tags: () => oL,
    Tally1: () => cL,
    Tally2: () => sL,
    Tally3: () => lL,
    Tally4: () => uL,
    Tally5: () => dL,
    Tangent: () => fL,
    Target: () => pL,
    Telescope: () => hL,
    Tent: () => gL,
    TentTree: () => mL,
    Terminal: () => _L,
    TerminalSquare: () => tI,
    TestTube: () => vL,
    TestTube2: () => yL,
    TestTubeDiagonal: () => yL,
    TestTubes: () => bL,
    Text: () => wL,
    TextAlignCenter: () => SL,
    TextAlignEnd: () => xL,
    TextAlignJustify: () => CL,
    TextAlignStart: () => wL,
    TextCursor: () => EL,
    TextCursorInput: () => TL,
    TextInitial: () => DL,
    TextQuote: () => OL,
    TextSearch: () => kL,
    TextSelect: () => xF,
    TextSelection: () => xF,
    TextWrap: () => AL,
    Theater: () => jL,
    Thermometer: () => PL,
    ThermometerSnowflake: () => ML,
    ThermometerSun: () => NL,
    ThumbsDown: () => FL,
    ThumbsUp: () => IL,
    Ticket: () => UL,
    TicketCheck: () => LL,
    TicketMinus: () => RL,
    TicketPercent: () => zL,
    TicketPlus: () => BL,
    TicketSlash: () => VL,
    TicketX: () => HL,
    Tickets: () => GL,
    TicketsPlane: () => WL,
    Timeline: () => KL,
    Timer: () => JL,
    TimerOff: () => qL,
    TimerReset: () => YL,
    ToggleLeft: () => XL,
    ToggleRight: () => ZL,
    Toilet: () => QL,
    ToolCase: () => $L,
    Toolbox: () => eR,
    Tornado: () => nR,
    Torus: () => tR,
    Touchpad: () => iR,
    TouchpadOff: () => rR,
    TowelRack: () => aR,
    TowerControl: () => sR,
    ToyBrick: () => cR,
    Tractor: () => oR,
    TrafficCone: () => lR,
    Train: () => pR,
    TrainFront: () => dR,
    TrainFrontTunnel: () => uR,
    TrainTrack: () => fR,
    TramFront: () => pR,
    Transgender: () => hR,
    Trash: () => gR,
    Trash2: () => mR,
    TreeDeciduous: () => _R,
    TreePalm: () => yR,
    TreePine: () => vR,
    Trees: () => bR,
    TrendingDown: () => xR,
    TrendingUp: () => CR,
    TrendingUpDown: () => SR,
    Triangle: () => DR,
    TriangleAlert: () => wR,
    TriangleDashed: () => TR,
    TriangleRight: () => ER,
    Trophy: () => OR,
    Truck: () => AR,
    TruckElectric: () => kR,
    TurkishLira: () => jR,
    Turntable: () => MR,
    Turtle: () => NR,
    Tv: () => IR,
    Tv2: () => FR,
    TvMinimal: () => FR,
    TvMinimalPlay: () => PR,
    Type: () => RR,
    TypeOutline: () => LR,
    Umbrella: () => BR,
    UmbrellaOff: () => zR,
    Underline: () => VR,
    Undo: () => WR,
    Undo2: () => HR,
    UndoDot: () => UR,
    UnfoldHorizontal: () => GR,
    UnfoldVertical: () => KR,
    Ungroup: () => qR,
    University: () => JR,
    Unlink: () => XR,
    Unlink2: () => YR,
    Unlock: () => hE,
    UnlockKeyhole: () => pE,
    Unplug: () => ZR,
    Upload: () => QR,
    UploadCloud: () => M_,
    Usb: () => $R,
    User: () => yz,
    User2: () => hz,
    UserCheck: () => ez,
    UserCheck2: () => sz,
    UserCircle: () => jg,
    UserCircle2: () => Og,
    UserCog: () => tz,
    UserCog2: () => lz,
    UserKey: () => nz,
    UserLock: () => iz,
    UserMinus: () => rz,
    UserMinus2: () => uz,
    UserPen: () => az,
    UserPlus: () => oz,
    UserPlus2: () => fz,
    UserRound: () => hz,
    UserRoundCheck: () => sz,
    UserRoundCog: () => lz,
    UserRoundKey: () => cz,
    UserRoundMinus: () => uz,
    UserRoundPen: () => dz,
    UserRoundPlus: () => fz,
    UserRoundSearch: () => pz,
    UserRoundX: () => mz,
    UserSearch: () => gz,
    UserSquare: () => rI,
    UserSquare2: () => nI,
    UserStar: () => _z,
    UserX: () => vz,
    UserX2: () => mz,
    Users: () => xz,
    Users2: () => bz,
    UsersRound: () => bz,
    Utensils: () => Cz,
    UtensilsCrossed: () => Sz,
    UtilityPole: () => wz,
    Van: () => Tz,
    Variable: () => Ez,
    Vault: () => Az,
    VectorSquare: () => Dz,
    Vegan: () => Oz,
    VenetianMask: () => kz,
    Venus: () => Nz,
    VenusAndMars: () => jz,
    Verified: () => dd,
    Vibrate: () => Pz,
    VibrateOff: () => Mz,
    Video: () => Iz,
    VideoOff: () => Fz,
    Videotape: () => Lz,
    View: () => Rz,
    Voicemail: () => zz,
    Volleyball: () => Vz,
    Volume: () => Gz,
    Volume1: () => Bz,
    Volume2: () => Uz,
    VolumeOff: () => Hz,
    VolumeX: () => Wz,
    Vote: () => Kz,
    Wallet: () => Jz,
    Wallet2: () => Yz,
    WalletCards: () => qz,
    WalletMinimal: () => Yz,
    Wallpaper: () => Xz,
    Wand: () => Qz,
    Wand2: () => Zz,
    WandSparkles: () => Zz,
    Warehouse: () => $z,
    WashingMachine: () => eB,
    Watch: () => tB,
    Waves: () => iB,
    WavesArrowDown: () => rB,
    WavesArrowUp: () => nB,
    WavesHorizontal: () => iB,
    WavesLadder: () => aB,
    WavesVertical: () => oB,
    Waypoints: () => sB,
    Webcam: () => cB,
    Webhook: () => uB,
    WebhookOff: () => lB,
    Weight: () => fB,
    WeightTilde: () => dB,
    Wheat: () => mB,
    WheatOff: () => pB,
    WholeWord: () => _B,
    Wifi: () => CB,
    WifiCog: () => hB,
    WifiHigh: () => gB,
    WifiLow: () => vB,
    WifiOff: () => yB,
    WifiPen: () => bB,
    WifiSync: () => xB,
    WifiZero: () => SB,
    Wind: () => TB,
    WindArrowDown: () => wB,
    Wine: () => DB,
    WineOff: () => EB,
    Workflow: () => OB,
    Worm: () => kB,
    WrapText: () => AL,
    Wrench: () => AB,
    X: () => MB,
    XCircle: () => Ag,
    XLineTop: () => jB,
    XOctagon: () => dk,
    XSquare: () => iI,
    Zap: () => PB,
    ZapOff: () => NB,
    ZodiacAquarius: () => FB,
    ZodiacAries: () => IB,
    ZodiacCancer: () => LB,
    ZodiacCapricorn: () => RB,
    ZodiacGemini: () => zB,
    ZodiacLeo: () => BB,
    ZodiacLibra: () => VB,
    ZodiacOphiuchus: () => HB,
    ZodiacPisces: () => UB,
    ZodiacSagittarius: () => WB,
    ZodiacScorpio: () => GB,
    ZodiacTaurus: () => KB,
    ZodiacVirgo: () => qB,
    ZoomIn: () => JB,
    ZoomOut: () => YB,
  }),
  ZB = ({
    icons: e = {},
    nameAttr: t = `data-lucide`,
    attrs: n = {},
    root: r = document,
    inTemplates: i,
  } = {}) => {
    if (!Object.values(e).length)
      throw Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);
    if (r === void 0)
      throw Error("`createIcons()` only works in a browser environment.");
    if (
      (Array.from(r.querySelectorAll(`[${t}]`)).forEach((r) =>
        ll(r, { nameAttr: t, icons: e, attrs: n }),
      ),
      i &&
        Array.from(r.querySelectorAll(`template`)).forEach((r) =>
          ZB({
            icons: e,
            nameAttr: t,
            attrs: n,
            root: r.content,
            inTemplates: i,
          }),
        ),
      t === `data-lucide`)
    ) {
      let t = r.querySelectorAll(`[icon-name]`);
      t.length > 0 &&
        (console.warn(
          `[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide`,
        ),
        Array.from(t).forEach((t) =>
          ll(t, { nameAttr: `icon-name`, icons: e, attrs: n }),
        ));
    }
  };
((window.bootstrap = Nn),
  ZB({ icons: XB }),
  window.addEventListener(`load`, () => {
    setTimeout(() => {
      ZB({ icons: XB });
    }, 0);
  }));
function QB(e) {
  let t = e.querySelector(`.spinner-border`);
  ((t.style.display = `inline-block`),
    setTimeout(() => {
      t.style.display = `none`;
      let n = e.querySelector(`.follow-text`),
        r = e.querySelector(`.unfollow-text`);
      n.style.display === `none`
        ? ((n.style.display = `inline`), (r.style.display = `none`))
        : ((n.style.display = `none`), (r.style.display = `inline`));
    }, 1e3));
}
(document.querySelectorAll(`.follow-btn`).forEach((e) => {
  e.addEventListener(`click`, () => QB(e));
}),
  document.addEventListener(`DOMContentLoaded`, function () {
    function e(e) {
      let t = parseFloat(e.getAttribute(`data-start`)),
        n = parseFloat(e.getAttribute(`data-end`)),
        r = parseFloat(e.getAttribute(`data-duration`)),
        i = t,
        a = n - t,
        o = performance.now();
      function s() {
        let c = performance.now() - o,
          l = Math.min(c / r, 1);
        ((i = t + a * l),
          (e.textContent = Math.round(i).toLocaleString()),
          l < 1
            ? requestAnimationFrame(s)
            : (e.textContent = n.toLocaleString()));
      }
      s();
    }
    (document.querySelectorAll(`.counter`).forEach((t) => {
      e(t);
    }),
      [...document.querySelectorAll(`[data-bs-toggle="tooltip"]`)].map(
        (e) => new window.bootstrap.Tooltip(e),
      ),
      [...document.querySelectorAll(`[data-bs-toggle="popover"]`)].map(
        (e) => new window.bootstrap.Popover(e),
      ));
  }));
function $B() {
  try {
    let e = new Date().getFullYear(),
      t = document.getElementById(`currentYearFooter`);
    t && (t.textContent = e);
  } catch (e) {
    console.error(`Error in displayCurrentYear:`, e);
  }
}
(document.addEventListener(`DOMContentLoaded`, $B), $B());
export { l as a, s as i, XB as n, o as r, ZB as t };
