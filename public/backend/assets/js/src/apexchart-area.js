
import { t as e } from "/assets/apexcharts.esm-CF-OO0O0.js";
function t(e) {
    let t = getComputedStyle(document.documentElement)
        .getPropertyValue(e)
        .trim();
    return /^\d{1,3},\s*\d{1,3},\s*\d{1,3}$/.test(t) ? `rgb(${t})` : t;
}
var n = [],
    r = (e) => {
        let n = JSON.parse(JSON.stringify(e)),
            r = (e) => {
                for (let n in e)
                    typeof e[n] == `string` && e[n].startsWith(`--dx-`)
                        ? (e[n] = t(e[n]))
                        : typeof e[n] == `object` && e[n] !== null && r(e[n]);
            };
        return (r(n), n);
    };
function i(t = ``) {
    (t && document.documentElement.setAttribute(`data-colors`, t),
        n.forEach((t) => {
            let n = JSON.parse(JSON.stringify(t[0].data)),
                i = r(structuredClone(n));
            t[0].chart && t[0].chart.destroy();
            var a = new e(document.querySelector(`#` + t[0].id), i);
            (a.render(), (t[0].chart = a));
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
    series: [{ name: `series1`, data: [31, 40, 28, 51, 42, 109, 100] }],
    labels: [
        `01 Jan`,
        `02 Jan`,
        `03 Jan`,
        `04 Jan`,
        `05 Jan`,
        `06 Jan`,
        `07 Jan`,
        `08 Jan`,
        `09 Jan`,
        `10 Jan`,
        `11 Jan`,
        `12 Jan`,
    ],
    chart: {
        defaultLocale: `en`,
        height: 300,
        type: `area`,
        zoom: { enabled: !1 },
    },
    dataLabels: { enabled: !1 },
    stroke: { width: [5, 7, 5], curve: `straight`, dashArray: [0, 8, 5] },
    title: { text: `Page Statistics`, align: `left` },
    legend: {
        tooltipHoverFormatter: function (e, t) {
            return (
                e +
                ` - <strong>` +
                t.w.globals.series[t.seriesIndex][t.dataPointIndex] +
                `</strong>`
            );
        },
    },
    markers: { size: 0, hover: { sizeOffset: 6 } },
    grid: { padding: { top: -20, right: 0, bottom: 0 } },
    tooltip: {
        y: [
            {
                title: {
                    formatter: function (e) {
                        return e + ` (mins)`;
                    },
                },
            },
            {
                title: {
                    formatter: function (e) {
                        return e + ` per session`;
                    },
                },
            },
            {
                title: {
                    formatter: function (e) {
                        return e;
                    },
                },
            },
        ],
    },
    colors: [`--dx-primary`],
};
n.push([{ id: `basicAreaChart`, data: o }]);
var o = {
    series: [
        { name: `series1`, data: [31, 40, 28, 51, 42, 109, 100] },
        { name: `series2`, data: [11, 32, 45, 32, 34, 52, 41] },
    ],
    chart: { height: 350, type: `area` },
    dataLabels: { enabled: !1 },
    stroke: { curve: `smooth` },
    xaxis: {
        type: `datetime`,
        categories: [
            `2018-09-19T00:00:00.000Z`,
            `2018-09-19T01:30:00.000Z`,
            `2018-09-19T02:30:00.000Z`,
            `2018-09-19T03:30:00.000Z`,
            `2018-09-19T04:30:00.000Z`,
            `2018-09-19T05:30:00.000Z`,
            `2018-09-19T06:30:00.000Z`,
        ],
    },
    tooltip: { x: { format: `dd/MM/yy HH:mm` } },
    grid: { padding: { right: 0 } },
    colors: [`--dx-primary`, `--dx-success`],
};
n.push([{ id: `splineAreaChart`, data: o }]);
var o = {
    series: [
        {
            name: `north`,
            data: [
                { x: 1996, y: 322 },
                { x: 1997, y: 324 },
                { x: 1998, y: 329 },
                { x: 1999, y: 342 },
                { x: 2e3, y: 348 },
                { x: 2001, y: 334 },
                { x: 2002, y: 325 },
                { x: 2003, y: 316 },
                { x: 2004, y: 318 },
                { x: 2005, y: 330 },
                { x: 2006, y: 355 },
                { x: 2007, y: 366 },
                { x: 2008, y: 337 },
                { x: 2009, y: 352 },
                { x: 2010, y: 377 },
                { x: 2011, y: 383 },
                { x: 2012, y: 344 },
                { x: 2013, y: 366 },
                { x: 2014, y: 389 },
                { x: 2015, y: 334 },
            ],
        },
        {
            name: `south`,
            data: [
                { x: 1996, y: 162 },
                { x: 1997, y: 90 },
                { x: 1998, y: 50 },
                { x: 1999, y: 77 },
                { x: 2e3, y: 35 },
                { x: 2001, y: -45 },
                { x: 2002, y: -88 },
                { x: 2003, y: -120 },
                { x: 2004, y: -156 },
                { x: 2005, y: -123 },
                { x: 2006, y: -88 },
                { x: 2007, y: -66 },
                { x: 2008, y: -45 },
                { x: 2009, y: -29 },
                { x: 2010, y: -45 },
                { x: 2011, y: -88 },
                { x: 2012, y: -132 },
                { x: 2013, y: -146 },
                { x: 2014, y: -169 },
                { x: 2015, y: -184 },
            ],
        },
    ],
    chart: { defaultLocale: `en`, height: 300, type: `area` },
    dataLabels: { enabled: !1 },
    stroke: { curve: `straight` },
    title: {
        text: `Area with Negative Values`,
        align: `left`,
        style: { fontSize: `14px` },
    },
    xaxis: {
        type: `datetime`,
        axisBorder: { show: !1 },
        axisTicks: { show: !1 },
    },
    yaxis: {
        tickAmount: 4,
        floating: !1,
        labels: { offsetY: -7, offsetX: 0 },
        axisBorder: { show: !1 },
        axisTicks: { show: !1 },
    },
    fill: { opacity: 0.5 },
    tooltip: {
        x: { format: `yyyy` },
        fixed: { enabled: !1, position: `topRight` },
    },
    grid: {
        yaxis: { lines: { offsetX: -30 } },
        padding: { left: 20, right: 0 },
    },
    colors: [`--dx-primary`, `--dx-border-color`],
};
n.push([{ id: `negativeAreaChart`, data: o }]);
var s = function (e, t, n) {
        for (var r = 0, i = []; r < t; ) {
            var a = e,
                o = Math.floor(Math.random() * (n.max - n.min + 1)) + n.min;
            (i.push([a, o]), (e += 864e5), r++);
        }
        return i;
    },
    o = {
        series: [
            {
                name: `South`,
                data: s(new Date(`11 Feb 2017 GMT`).getTime(), 20, {
                    min: 10,
                    max: 60,
                }),
            },
            {
                name: `North`,
                data: s(new Date(`11 Feb 2017 GMT`).getTime(), 20, {
                    min: 10,
                    max: 20,
                }),
            },
            {
                name: `Central`,
                data: s(new Date(`11 Feb 2017 GMT`).getTime(), 20, {
                    min: 10,
                    max: 15,
                }),
            },
        ],
        chart: {
            type: `area`,
            height: 350,
            stacked: !0,
            events: {
                selection: function (e, t) {
                    console.log(new Date(t.xaxis.min));
                },
            },
        },
        colors: [`#008FFB`, `#00E396`, `#CED4DC`],
        dataLabels: { enabled: !1 },
        stroke: { curve: `monotoneCubic` },
        fill: {
            type: `gradient`,
            gradient: { opacityFrom: 0.6, opacityTo: 0.8 },
        },
        legend: { position: `top`, horizontalAlign: `left` },
        xaxis: { type: `datetime` },
        grid: { padding: { right: 0 } },
        colors: [`--dx-primary`, `--dx-success`, `--dx-border-color`],
    };
n.push([{ id: `stackedAreaChart`, data: o }]);
var o = {
    series: [
        {
            name: `Network`,
            data: [
                { x: `Dec 23 2017`, y: null },
                { x: `Dec 24 2017`, y: 44 },
                { x: `Dec 25 2017`, y: 31 },
                { x: `Dec 26 2017`, y: 38 },
                { x: `Dec 27 2017`, y: null },
                { x: `Dec 28 2017`, y: 32 },
                { x: `Dec 29 2017`, y: 55 },
                { x: `Dec 30 2017`, y: 51 },
                { x: `Dec 31 2017`, y: 67 },
                { x: `Jan 01 2018`, y: 22 },
                { x: `Jan 02 2018`, y: 34 },
                { x: `Jan 03 2018`, y: null },
                { x: `Jan 04 2018`, y: null },
                { x: `Jan 05 2018`, y: 11 },
                { x: `Jan 06 2018`, y: 4 },
                { x: `Jan 07 2018`, y: 15 },
                { x: `Jan 08 2018`, y: null },
                { x: `Jan 09 2018`, y: 9 },
                { x: `Jan 10 2018`, y: 34 },
                { x: `Jan 11 2018`, y: null },
                { x: `Jan 12 2018`, y: null },
                { x: `Jan 13 2018`, y: 13 },
                { x: `Jan 14 2018`, y: null },
            ],
        },
    ],
    chart: {
        type: `area`,
        height: 350,
        animations: { enabled: !1 },
        zoom: { enabled: !1 },
    },
    dataLabels: { enabled: !1 },
    stroke: { curve: `straight` },
    fill: {
        opacity: 0.8,
        type: `pattern`,
        pattern: {
            style: [`verticalLines`, `horizontalLines`],
            width: 5,
            height: 6,
        },
    },
    markers: { size: 5, hover: { size: 9 } },
    title: { text: `Network Monitoring` },
    tooltip: { intersect: !0, shared: !1 },
    theme: { palette: `palette1` },
    xaxis: { type: `datetime` },
    colors: [`--dx-primary`],
    grid: { padding: { right: 0 } },
    yaxis: { title: { text: `Bytes Received` } },
};
(n.push([{ id: `missingAreaChart`, data: o }]),
    window.addEventListener(`DOMContentLoaded`, () => {
        i();
    }),
    window.addEventListener(`resize`, () => {
        setTimeout(() => {
            i();
        }, 0);
    }));
