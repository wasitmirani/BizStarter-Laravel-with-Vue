
import { t as e } from "/assets/apexcharts.esm-CF-OO0O0.js";

function t(e) {
  let t = getComputedStyle(document.documentElement).getPropertyValue(e).trim();
  return /^\d{1,3},\s*\d{1,3},\s*\d{1,3}$/.test(t) ? `rgb(${t})` : t;
}
var n = [],
  r = (e) => {
    let n = (e) => {
        if (typeof e != `object` || !e) return e;
        if (Array.isArray(e)) return e.map(n);
        let t = {};
        for (let r in e) t[r] = n(e[r]);
        return t;
      },
      r = n(e),
      i = (e) => {
        for (let n in e)
          typeof e[n] == `string` && e[n].startsWith(`--dx-`)
            ? (e[n] = t(e[n]))
            : typeof e[n] == `object` && e[n] !== null && i(e[n]);
      };
    return (i(r), r);
  };
function i(t = ``) {
  (t && document.documentElement.setAttribute(`data-colors`, t),
    n.forEach((t) => {
      let n = r(t[0].data);
      t[0].chart && t[0].chart.destroy();
      var i = new e(document.querySelector(`#` + t[0].id), n);
      (i.render(), (t[0].chart = i));
    }));
}
(document.querySelectorAll(`input[name="data-colors"]`).forEach((e) => {
  e.addEventListener(`change`, function () {
    a(this.value);
  });
}),
  document.querySelectorAll(`input[name="data-theme"]`).forEach((e) => {
    e.addEventListener(`change`, function () {
      setTimeout(() => {
        a();
      }, 500);
    });
  }),
  document.querySelectorAll(`input[name="data-bs-theme"]`).forEach((e) => {
    e.addEventListener(`change`, function () {
      a(this.value);
    });
  }),
  document
    .getElementById(`darkModeButton`)
    ?.addEventListener(`click`, function () {
      a(this.value);
    }));
function a(e) {
  setTimeout(() => {
    i(e);
  }, 0);
}
document
  .getElementById(`darkModeButton`)
  ?.addEventListener(`click`, function () {
    setTimeout(() => {
      i();
    }, 0);
  });
var o = {
  series: [
    { name: `Organic Search`, data: [80, 50, 30, 40, 100, 20] },
    { name: `Direct`, data: [20, 30, 40, 80, 20, 80] },
    { name: `Referral`, data: [44, 76, 78, 13, 43, 10] },
    { name: `Social Media`, data: [40, 98, 20, 50, 23, 10] },
    { name: `Email`, data: [20, 50, 95, 10, 65, 41] },
  ],
  chart: { height: 260, type: `radar`, toolbar: { offsetY: -43, offsetX: 8 } },
  stroke: { width: 2 },
  fill: { opacity: 0.1 },
  markers: { size: 0 },
  yaxis: { stepSize: 20 },
  xaxis: { categories: [`2011`, `2012`, `2013`, `2014`, `2015`, `2016`] },
  grid: { padding: { right: 0, left: 0, top: -30, bottom: 0 } },
  colors: [
    `--dx-warning`,
    `--dx-secondary`,
    `--dx-success`,
    `--dx-danger`,
    `--dx-primary`,
  ],
  legend: { offsetY: 20, markers: { size: 6, strokeWidth: 2.5 } },
};
n.push([{ id: `trafficSource`, data: o }]);
var o = {
  series: [
    { name: `Revenue`, data: [6100, 4800, 9200, 3900, 5900, 7400, 4400] },
    {
      name: `Expenses`,
      data: [-1500, -1500, -1500, -1500, -1500, -1500, -1500],
    },
  ],
  chart: {
    type: `bar`,
    height: 130,
    stacked: !0,
    toolbar: { show: !1 },
    offsetY: 17,
  },
  states: {
    normal: { filter: { type: `none` } },
    hover: { filter: { type: `none` } },
    active: { filter: { type: `none` } },
  },
  tooltip: { enabled: !0 },
  fill: { opacity: [1, 0.3] },
  colors: [`--dx-dark`],
  plotOptions: {
    bar: {
      borderRadius: 6,
      borderRadiusApplication: `around`,
      borderRadiusWhenStacked: `all`,
      horizontal: !1,
      columnWidth: `46%`,
    },
  },
  responsive: [
    {
      breakpoint: 1441,
      options: { plotOptions: { bar: { columnWidth: `38%` } } },
    },
    {
      breakpoint: 769,
      options: { plotOptions: { bar: { columnWidth: `52%` } } },
    },
    {
      breakpoint: 426,
      options: { plotOptions: { bar: { columnWidth: `32%` } } },
    },
    {
      breakpoint: 376,
      options: { plotOptions: { bar: { columnWidth: `36%` } } },
    },
  ],
  dataLabels: { enabled: !1 },
  stroke: { width: 4, colors: [`--dx-dark`] },
  grid: {
    show: !1,
    xaxis: { lines: { show: !1 } },
    padding: { top: -62, bottom: -20, left: -20, right: -15 },
  },
  yaxis: {
    labels: { show: !1, offsetX: -18, style: { fontSize: `12px` } },
    min: -1500,
    max: 12e3,
    tickAmount: 8,
  },
  legend: { show: !1 },
  xaxis: {
    categories: [`S`, `M`, `T`, `W`, `T`, `F`, `S`],
    labels: {
      offsetY: -2,
      formatter: function (e) {
        return e;
      },
      style: { fontSize: `13px` },
    },
    axisBorder: { show: !1 },
    axisTicks: { show: !1 },
  },
};
n.push([{ id: `RevenueWidget`, data: o }]);
var o = {
  series: [56, 54, 57, 45],
  chart: { height: 140, type: `polarArea` },
  states: {
    normal: { filter: { type: `none` } },
    hover: { filter: { type: `none` } },
    active: { filter: { type: `none` } },
  },
  labels: [`New`, `Returning`, `Active`, `Inactive`],
  fill: {
    opacity: 1,
    type: `gradient`,
    gradient: {
      shade: `light`,
      shadeIntensity: 0.25,
      inverseColors: !1,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 65, 91],
    },
  },
  stroke: { width: 3 },
  yaxis: { show: !1 },
  legend: { show: !1 },
  plotOptions: {
    polarArea: { rings: { strokeWidth: 0 }, spokes: { strokeWidth: 0 } },
  },
  grid: { padding: { top: -62, right: -70, bottom: -62, left: -70 } },
  colors: [`--dx-warning`, `--dx-primary`, `--dx-success`, `--dx-danger`],
};
n.push([{ id: `UsersWidget`, data: o }]);
var o = {
  series: [
    {
      name: `Active Users`,
      data: [800, 1350, 700, 1150, 950, 1600, 780, 1300, 720, 1300],
    },
  ],
  chart: {
    height: 269,
    type: `area`,
    stacked: !1,
    toolbar: { show: !1 },
    zoom: { enabled: !1 },
    offsetY: 0,
    dropShadow: {
      enabled: !0,
      color: `--dx-secondary`,
      top: 11,
      left: 2,
      blur: 4,
      opacity: 0.4,
    },
  },
  stroke: { width: 3, curve: `smooth` },
  xaxis: {
    categories: [
      `Jan`,
      `Feb`,
      `Mar`,
      `Apr`,
      `May`,
      `Jun`,
      `Jul`,
      `Aug`,
      `Sep`,
      `Oct`,
    ],
    type: `category`,
    labels: { style: { fontSize: `12.5px` } },
    axisBorder: { show: !1 },
    axisTicks: { show: !1 },
  },
  yaxis: {
    labels: { offsetX: -18, style: { fontSize: `12.5px` } },
    min: 0,
    max: 2e3,
  },
  markers: { size: 6, strokeWidth: 4, hover: { size: 6 } },
  fill: {
    type: `gradient`,
    gradient: {
      shade: `light`,
      type: `vertical`,
      shadeIntensity: 0.5,
      opacityFrom: 0.4,
      opacityTo: 0,
      stops: [0, 100],
    },
  },
  legend: { show: !1 },
  dataLabels: { enabled: !1 },
  grid: {
    strokeDashArray: 4,
    padding: { top: -25, bottom: -7, left: 7, right: 5 },
    yaxis: { lines: { show: !1 } },
    xaxis: { lines: { show: !0 } },
  },
  colors: [`--dx-secondary`],
  tooltip: {
    shared: !0,
    intersect: !1,
    y: {
      formatter: function (e) {
        return e === void 0 ? e : e.toFixed(0) + ` points`;
      },
    },
  },
};
n.push([{ id: `audienceOverview`, data: o }]);
function s() {
  setTimeout(() => {
    let e = document.querySelector(`#audienceOverview svg`);
    if (!e) return;
    let t = e.querySelector(`defs`),
      n = e.querySelector(`.apexcharts-area-series path.apexcharts-area`);
    if (!t || !n) return;
    let r = `clip-area-` + Date.now(),
      i = document.createElementNS(`http://www.w3.org/2000/svg`, `clipPath`);
    i.id = r;
    let a = n.cloneNode(!0);
    ([`clip-path`, `fill`, `opacity`, `style`].forEach((e) =>
      a.removeAttribute(e),
    ),
      i.appendChild(a),
      t.appendChild(i));
    let o = Array.from(e.querySelectorAll(`.apexcharts-grid line`)).filter(
      (e) =>
        Math.abs(
          parseFloat(e.getAttribute(`x1`) || 0) -
            parseFloat(e.getAttribute(`x2`) || 0),
        ) < 5,
    );
    if (!o.length) return;
    o.forEach((e) => {
      (e.setAttribute(`stroke-width`, `1`),
        e.setAttribute(`stroke-dasharray`, `4 4`));
    });
    let s = document.createElementNS(`http://www.w3.org/2000/svg`, `g`);
    (s.setAttribute(`clip-path`, `url(#${r})`),
      o.forEach((e) => {
        let t = e.cloneNode(!0);
        (t.setAttribute(`stroke-width`, `3`),
          t.setAttribute(`stroke-dasharray`, `4 4`),
          s.appendChild(t));
      }),
      o[0].parentNode.appendChild(s));
  }, 800);
}
var c = i;
i = function (e = ``) {
  (c(e), setTimeout(s, 900));
};
var o = {
  series: [
    {
      name: `Revenue`,
      data: [
        {
          x: `Jan`,
          y: 546e3,
          goals: [
            {
              name: `Target`,
              value: 546e3,
              strokeHeight: 5,
              strokeColor: `--dx-primary`,
              strokeLineCap: `round`,
            },
          ],
        },
        {
          x: `Feb`,
          y: 4e5,
          goals: [
            {
              name: `Target`,
              value: 4e5,
              strokeHeight: 5,
              strokeColor: `--dx-primary`,
              strokeLineCap: `round`,
            },
          ],
        },
        {
          x: `Mar`,
          y: 654e3,
          goals: [
            {
              name: `Target`,
              value: 654e3,
              strokeHeight: 5,
              strokeColor: `--dx-primary`,
              strokeLineCap: `round`,
            },
          ],
        },
        {
          x: `Apr`,
          y: 45e4,
          goals: [
            {
              name: `Target`,
              value: 45e4,
              strokeHeight: 5,
              strokeColor: `--dx-primary`,
              strokeLineCap: `round`,
            },
          ],
        },
        {
          x: `May`,
          y: 31e4,
          goals: [
            {
              name: `Target`,
              value: 31e4,
              strokeHeight: 5,
              strokeColor: `--dx-primary`,
              strokeLineCap: `round`,
            },
          ],
        },
        {
          x: `Jun`,
          y: 51e4,
          goals: [
            {
              name: `Target`,
              value: 51e4,
              strokeHeight: 5,
              strokeColor: `--dx-primary`,
              strokeLineCap: `round`,
            },
          ],
        },
        {
          x: `Jul`,
          y: 81e4,
          goals: [
            {
              name: `Target`,
              value: 81e4,
              strokeHeight: 5,
              strokeColor: `--dx-primary`,
              strokeLineCap: `round`,
            },
          ],
        },
        {
          x: `Aug`,
          y: 3e5,
          goals: [
            {
              name: `Target`,
              value: 3e5,
              strokeHeight: 5,
              strokeColor: `--dx-primary`,
              strokeLineCap: `round`,
            },
          ],
        },
        {
          x: `Sep`,
          y: 59e4,
          goals: [
            {
              name: `Target`,
              value: 59e4,
              strokeHeight: 5,
              strokeColor: `--dx-primary`,
              strokeLineCap: `round`,
            },
          ],
        },
        {
          x: `Oct`,
          y: 75e4,
          goals: [
            {
              name: `Target`,
              value: 75e4,
              strokeHeight: 5,
              strokeColor: `--dx-primary`,
              strokeLineCap: `round`,
            },
          ],
        },
        {
          x: `Nov`,
          y: 57e4,
          goals: [
            {
              name: `Target`,
              value: 57e4,
              strokeHeight: 5,
              strokeColor: `--dx-primary`,
              strokeLineCap: `round`,
            },
          ],
        },
        {
          x: `Dec`,
          y: 38e4,
          goals: [
            {
              name: `Target`,
              value: 38e4,
              strokeHeight: 5,
              strokeColor: `--dx-primary`,
              strokeLineCap: `round`,
            },
          ],
        },
      ],
    },
  ],
  chart: {
    height: 287,
    type: `bar`,
    toolbar: { show: !1 },
    zoom: { enabled: !1 },
    dropShadow: { enabled: !0, top: -8, left: 1, blur: 3, opacity: 1 },
  },
  plotOptions: { bar: { columnWidth: `65%`, dataLabels: { position: `top` } } },
  fill: {
    type: `gradient`,
    gradient: {
      shade: `light`,
      type: `vertical`,
      shadeIntensity: 0.9,
      inverseColors: !1,
      opacityFrom: 0.2,
      opacityTo: 0,
      stops: [0, 100],
    },
  },
  grid: {
    strokeDashArray: 4,
    yaxis: { lines: { show: !1 } },
    xaxis: { lines: { show: !0 } },
    padding: { top: -26, right: -20, bottom: -15, left: -8 },
  },
  tooltip: { enabled: !1 },
  dataLabels: {
    enabled: !0,
    offsetY: 4,
    style: { fontSize: `14px`, fontWeight: 500, colors: [`--dx-body-color`] },
    formatter: function (e) {
      return `$` + (e / 1e3).toFixed(0) + `K`;
    },
  },
  colors: [`--dx-primary`],
  xaxis: {
    categories: [
      `Jan`,
      `Feb`,
      `Mar`,
      `Apr`,
      `May`,
      `Jun`,
      `Jul`,
      `Aug`,
      `Sep`,
      `Oct`,
      `Nov`,
      `Dec`,
    ],
    labels: { style: { fontSize: `14px` } },
    axisBorder: { show: !1 },
    axisTicks: { show: !1 },
  },
  states: {
    normal: { filter: { type: `none` } },
    hover: { filter: { type: `none` } },
    active: { filter: { type: `none` } },
  },
  legend: { show: !1 },
  yaxis: { show: !1, min: 2e4, max: 9e5 },
};
n.push([{ id: `performanceOverview`, data: o }]);
var o = {
  series: [
    {
      type: `rangeArea`,
      name: `Team B Range`,
      data: [
        { x: `Jan`, y: [1100, 1900] },
        { x: `Feb`, y: [1200, 1800] },
        { x: `Mar`, y: [900, 2900] },
        { x: `Apr`, y: [1400, 2700] },
        { x: `May`, y: [2600, 3900] },
        { x: `Jun`, y: [500, 1700] },
        { x: `Jul`, y: [1900, 2300] },
        { x: `Aug`, y: [1e3, 1500] },
      ],
    },
    {
      type: `rangeArea`,
      name: `Team A Range`,
      data: [
        { x: `Jan`, y: [3100, 3400] },
        { x: `Feb`, y: [4200, 5200] },
        { x: `Mar`, y: [3900, 4900] },
        { x: `Apr`, y: [3400, 3900] },
        { x: `May`, y: [5100, 5900] },
        { x: `Jun`, y: [5400, 6700] },
        { x: `Jul`, y: [4300, 4600] },
        { x: `Aug`, y: [2100, 2900] },
      ],
    },
    {
      type: `line`,
      name: `Team B Median`,
      data: [
        { x: `Jan`, y: 1500 },
        { x: `Feb`, y: 1700 },
        { x: `Mar`, y: 1900 },
        { x: `Apr`, y: 2200 },
        { x: `May`, y: 3e3 },
        { x: `Jun`, y: 1e3 },
        { x: `Jul`, y: 2100 },
        { x: `Aug`, y: 1200 },
        { x: `Sep`, y: 1800 },
        { x: `Oct`, y: 2e3 },
      ],
    },
    {
      type: `line`,
      name: `Team A Median`,
      data: [
        { x: `Jan`, y: 3300 },
        { x: `Feb`, y: 4900 },
        { x: `Mar`, y: 4300 },
        { x: `Apr`, y: 3700 },
        { x: `May`, y: 5500 },
        { x: `Jun`, y: 5900 },
        { x: `Jul`, y: 4500 },
        { x: `Aug`, y: 2400 },
        { x: `Sep`, y: 2100 },
        { x: `Oct`, y: 1500 },
      ],
    },
  ],
  chart: {
    height: 222,
    type: `rangeArea`,
    animations: { speed: 500 },
    toolbar: { show: !1 },
  },
  colors: [`--dx-danger`, `--dx-info`],
  dataLabels: { enabled: !1 },
  fill: { opacity: [0.24, 0.24, 1, 1] },
  forecastDataPoints: { count: 2 },
  stroke: { curve: `straight`, width: [0, 0, 2, 2] },
  grid: {
    strokeDashArray: 3,
    padding: { top: -23, right: 0, bottom: -18, left: -0 },
  },
  responsive: [{ breakpoint: 1441, options: { chart: { height: 300 } } }],
  xaxis: { type: `category`, labels: { style: { fontSize: `13px` } } },
  yaxis: { labels: { offsetX: -15, style: { fontSize: `12.5px` } } },
  legend: {
    show: !0,
    offsetY: 23,
    customLegendItems: [`New`, `Returning`],
    inverseOrder: !0,
  },
  markers: { hover: { sizeOffset: 5 } },
};
(n.push([{ id: `dailyInsights`, data: o }]),
  window.addEventListener(`DOMContentLoaded`, () => {
    i();
  }),
  window.addEventListener(`resize`, () => {
    setTimeout(() => {
      i();
    }, 0);
  }));
