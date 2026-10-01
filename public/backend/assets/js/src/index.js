import "../../admin.bundle-DOCqQWIh.js";
import "../../main-BSp6wgyE.js";
import { t as e } from "../../apexcharts.esm-CF-OO0O0.js";
/* empty css                               */ function t(e) {
    let t = getComputedStyle(document.documentElement)
        .getPropertyValue(e)
        .trim();
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
    series: [{ name: `Sales`, data: [20, 40, 25, 55, 45, 70] }],
    chart: {
        type: `line`,
        height: 100,
        toolbar: { show: !1 },
        zoom: { enabled: !1 },
        offsetY: 15,
    },
    stroke: { curve: `straight`, width: 3 },
    colors: [`--dx-info`],
    markers: { size: 5, strokeWidth: 2, hover: { size: 6 } },
    grid: {
        show: !0,
        strokeDashArray: 4,
        padding: { top: -27, bottom: -25, left: 6, right: 6 },
        xaxis: { lines: { show: !0 } },
        yaxis: { lines: { show: !1 } },
    },
    xaxis: {
        categories: [`Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`],
        labels: { show: !1 },
        axisBorder: { show: !1 },
        axisTicks: { show: !1 },
    },
    yaxis: { show: !1, min: 0, max: 80 },
    tooltip: { enabled: !1 },
};
n.push([{ id: `weeklySalesChart`, data: o }]);
var o = {
    chart: {
        type: `bar`,
        height: 99,
        toolbar: { show: !1 },
        parentHeightOffset: 0,
    },
    plotOptions: {
        bar: {
            dataLabels: { enabled: !1 },
            columnWidth: `30%`,
            borderRadius: 5,
        },
    },
    dataLabels: { enabled: !1 },
    colors: [`--dx-orange`],
    series: [{ name: `This Week`, data: [19, 32, 16, 22, 36, 20] }],
    labels: [`Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`],
    xaxis: {
        axisBorder: { show: !1 },
        axisTicks: { show: !1 },
        crosshairs: { show: !1 },
        labels: { show: !1, style: { fontSize: `13px` } },
    },
    grid: { show: !1, padding: { top: -35, right: -7, bottom: -15, left: -7 } },
    yaxis: { show: !1 },
    legend: { show: !1 },
    states: {
        hover: { filter: { type: `none` } },
        active: { filter: { type: `none` } },
    },
    tooltip: { enabled: !1 },
};
n.push([{ id: `weeklyProfitChart`, data: o }]);
var s = {
    series: [
        {
            name: `Sales`,
            data: [4, 3, 10, 9, 27, 19, 21, 9, 12, 7, 19, 5, 13, 9, 17, 2],
        },
    ],
    chart: {
        height: 250,
        type: `line`,
        toolbar: { show: !1 },
        offsetY: 12,
        dropShadow: { enabled: !0, top: 12, left: 2, blur: 3, opacity: 0.17 },
    },
    forecastDataPoints: { count: 7 },
    stroke: { width: 3, curve: `smooth` },
    xaxis: {
        categories: [
            `Jan`,
            `Jan`,
            `Feb`,
            `Feb`,
            `Mar`,
            `Mar`,
            `Apr`,
            `Apr`,
            `May`,
            `May`,
            `Jun`,
            `Jun`,
            `Jul`,
            `Jul`,
            `Aug`,
            `Aug`,
        ],
        tickAmount: 7,
        labels: { style: { fontSize: `13px` } },
    },
    yaxis: {
        labels: { offsetX: -15, style: { fontSize: `12.5px` } },
        min: 0,
        max: 30,
    },
    markers: { size: 0, hover: { sizeOffset: 5 } },
    fill: {
        type: `gradient`,
        gradient: {
            shade: `dark`,
            gradientToColors: [`--dx-secondary`],
            shadeIntensity: 1,
            type: `horizontal`,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100],
        },
    },
    colors: [`--dx-primary`],
    grid: {
        strokeDashArray: 4,
        padding: { top: -20, right: -10, bottom: -16, left: 0 },
    },
};
function c(e, t = `--dx-success`) {
    let r = JSON.parse(JSON.stringify(s));
    ((r.colors = [t]), n.push([{ id: e, data: r }]));
}
(c(`websiteVisitChart`, `--dx-orange`), c(`conversionChart`, `--dx-info`));
var o = {
    series: [
        { name: `Expenses`, data: [85, 73, 126, 98, 61, 138] },
        { name: `Total Expenses`, data: [142, 105, 59, 139, 87, 85] },
    ],
    chart: { type: `bar`, height: 153, toolbar: { show: !1 }, offsetY: 14 },
    plotOptions: {
        bar: { horizontal: !1, columnWidth: `59%`, borderRadius: 4 },
    },
    dataLabels: { enabled: !1 },
    stroke: { show: !0, width: 2, colors: [`transparent`] },
    xaxis: {
        categories: [`Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`],
        axisTicks: { show: !1 },
        labels: { style: { fontSize: `13px` } },
    },
    yaxis: { labels: { show: !1 } },
    colors: [`--dx-danger`, `--dx-dark`],
    states: {
        hover: { filter: { type: `none` } },
        active: { filter: { type: `none` } },
    },
    fill: { opacity: 1 },
    legend: { show: !1 },
    grid: {
        xaxis: { lines: { show: !0 } },
        yaxis: { lines: { show: !1 } },
        padding: { left: -5, right: -5, top: -25, bottom: -14 },
    },
    tooltip: {
        y: {
            formatter: function (e) {
                return `$ ` + e + ` thousands`;
            },
        },
    },
};
n.push([{ id: `expenseChart`, data: o }]);
var o = {
    series: [
        { name: `Revenue`, data: [8, 8, 41, 8, 8, 60, 8, 8, 50, 8, 8, 8] },
    ],
    chart: {
        height: 155,
        type: `line`,
        toolbar: { show: !1 },
        offsetY: 14,
        zoom: { enabled: !1 },
    },
    dataLabels: { enabled: !1 },
    stroke: { width: 2, curve: `smooth` },
    xaxis: {
        axisTicks: { show: !1 },
        categories: [
            `Mon`,
            `Mon`,
            `Tue`,
            `Tue`,
            `Wed`,
            `Wed`,
            `Thu`,
            `Thu`,
            `Fri`,
            `Fri`,
            `Sat`,
            `Sat`,
        ],
        tickAmount: 7,
        labels: { style: { fontSize: `13px` } },
    },
    yaxis: { labels: { show: !1 }, min: 0, max: 80 },
    tooltip: { x: { format: `dd/MM/yy HH:mm` } },
    colors: [`--dx-secondary`],
    grid: {
        strokeDashArray: 5,
        xaxis: { lines: { show: !0 } },
        yaxis: { lines: { show: !1 } },
        padding: { left: 3, right: 3, top: -30, bottom: -12 },
    },
};
n.push([{ id: `revenueChart`, data: o }]);
var o = {
    series: [
        {
            name: `Online Sales`,
            data: [
                9800, 9800, 7e3, 7e3, 1e4, 1e4, 13900, 13900, 9500, 9500, 12200,
                12200, 8e3, 8e3, 11e3, 11e3, 8800, 8800, 13100, 13100,
            ],
        },
        {
            name: `Offline Sales`,
            data: [
                1800, 1800, 4800, 4800, 2e3, 2e3, 5e3, 5e3, 8e3, 8e3, 4400,
                4400, 1500, 1500, 4500, 4500, 7e3, 7e3, 4e3, 4e3,
            ],
        },
    ],
    chart: {
        height: 290,
        type: `area`,
        toolbar: { show: !1 },
        zoom: { enabled: !1 },
        offsetY: 7,
        dropShadow: { enabled: !0, top: 10, left: 1, blur: 3, opacity: 0.24 },
    },
    colors: [`--dx-primary`, `--dx-danger`],
    stroke: { width: 2.6, curve: `smooth` },
    xaxis: {
        categories: [
            `Jan`,
            `Jan`,
            `Feb`,
            `Feb`,
            `Mar`,
            `Mar`,
            `Apr`,
            `Apr`,
            `May`,
            `May`,
            `Jun`,
            `Jun`,
            `Jul`,
            `Jul`,
            `Aug`,
            `Aug`,
            `Sep`,
            `Sep`,
            `Oct`,
            `Oct`,
        ],
        labels: {
            show: !0,
            offsetX: 5,
            style: { fontSize: `14px` },
            formatter: (e, t) =>
                [
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
                ].includes(e)
                    ? e
                    : ``,
        },
        axisBorder: { show: !1 },
        axisTicks: { show: !1 },
        tickAmount: 10,
    },
    yaxis: {
        min: 0,
        max: 15e3,
        tickAmount: 6,
        labels: {
            offsetX: -18,
            formatter: (e) => (e / 1e3).toFixed(e % 1e3 == 0 ? 0 : 1) + `k`,
            style: { fontSize: `13px` },
        },
    },
    grid: {
        strokeDashArray: 3,
        padding: { top: -23, bottom: -14, left: 0, right: 0 },
    },
    fill: {
        type: `gradient`,
        gradient: {
            shade: `light`,
            type: `vertical`,
            shadeIntensity: 0.5,
            opacityFrom: 0.35,
            opacityTo: 0,
            stops: [0, 100],
        },
    },
    dataLabels: { enabled: !1 },
    legend: { show: !1 },
};
n.push([{ id: `salesOverview`, data: o }]);
var o = {
    series: [44, 55, 23, 35, 15],
    labels: [`Clothes`, `Electronics`, `Books`, `Home`, `Sports`],
    chart: { width: 330, type: `donut` },
    plotOptions: { pie: { startAngle: -90, endAngle: 270 } },
    dataLabels: { enabled: !1 },
    states: {
        hover: { filter: { type: `none` } },
        active: { filter: { type: `none` } },
    },
    fill: { type: `gradient` },
    colors: [
        `--dx-danger`,
        `--dx-primary`,
        `--dx-warning`,
        `--dx-success`,
        `--dx-secondary`,
    ],
    legend: {
        formatter: function (e, t) {
            return e + ` - ` + t.w.globals.series[t.seriesIndex];
        },
    },
    grid: { padding: { top: -5, bottom: -12, left: 0, right: 0 } },
    responsive: [
        {
            breakpoint: 321,
            options: { chart: { width: 260 }, legend: { position: `bottom` } },
        },
    ],
};
(n.push([{ id: `lowStockChart`, data: o }]),
    window.addEventListener(`DOMContentLoaded`, () => {
        i();
    }),
    window.addEventListener(`resize`, () => {
        setTimeout(() => {
            i();
        }, 0);
    }));
