(function () {
    "use strict";

/* Total Customers */
  var options1 = {
    series: [{
        data: [32, 63, 59, 45, 72, 31, 84, 28, 53, 49, 68, 50, 42, 60, 30, 18, 97, 61, 67, 22, 74, 58, 33, 55]
    }],
    labels: [...Array(24).keys()].map(n => `2018-09-0${n + 1}`),
    chart: {
        type: 'area',
        height: 50,
        sparkline: {
            enabled: true
        },
    },
    stroke: {
        curve: 'smooth',
        width: 1.5,
    },
    colors: ["var(--primary03)"],
    fill: {
        type: ['gradient'],
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100],
            colorStops: [
                [
                    {
                        offset: 0,
                        color: "var(--primary01)",
                        opacity: 1
                    },
                    {
                        offset: 75,
                        color: "var(--primary005)",
                        opacity: 1
                    },
                    {
                        offset: 100,
                        color: 'var(--primary005)',
                        opacity: 0.05
                    }
                ],
            ]
        }
    },
    tooltip: {
        fixed: {
            enabled: false
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return ''
                }
            }
        },
        marker: {
            show: false
        }
    }
};
var chart1 = new ApexCharts(document.querySelector("#crm-total-customers"), options1);
chart1.render();
/* Total Customers */

/* Total Deals */
var options2 = {
    series: [{
        data: [32, 63, 59, 45, 72, 31, 84, 28, 53, 49, 68, 50, 42, 60, 30, 18, 97, 61, 67, 22, 74, 58, 33, 55]
    }],
    labels: [...Array(24).keys()].map(n => `2018-09-0${n + 1}`),
    chart: {
        type: 'area',
        height: 50,
        sparkline: {
            enabled: true
        },
    },
    stroke: {
        curve: 'smooth',
        width: 1.5,
    },
    colors: ["rgba(127, 103, 257,0.3)"],
    fill: {
        type: ['gradient'], 
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100],
            colorStops: [
                [
                    {
                        offset: 0,
                        color: "rgba(127, 103, 257,0.1)",
                        opacity: 1
                    },
                    {
                        offset: 75,
                        color: "rgba(127, 103, 257,0.05)",
                        opacity: 1
                    },
                    {
                        offset: 100,
                        color: 'rgba(127, 103, 257,0.05)',
                        opacity: 0.05
                    }
                ],
            ]
        }
    },
    tooltip: {
        fixed: {
            enabled: false
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return ''
                }
            }
        },
        marker: {
            show: false
        }
    }
};
var chart2 = new ApexCharts(document.querySelector("#crm-total-deals"), options2);
chart2.render();
/* Total Deals */

/* Total Revenue */
var options3 = {
    series: [{
        data: [32, 63, 59, 45, 72, 31, 84, 28, 53, 49, 68, 50, 42, 60, 30, 18, 97, 61, 67, 22, 74, 58, 33, 55]
    }],
    labels: [...Array(24).keys()].map(n => `2018-09-0${n + 1}`),
    chart: {
        type: 'area',
        height: 50,
        sparkline: {
            enabled: true
        },
    },
    stroke: {
        curve: 'smooth',
        width: 1.5,
    },
    colors: ["rgba(253, 73, 99,0.3)"],
    fill: {
        type: ['gradient'], 
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100],
            colorStops: [
                [
                    {
                        offset: 0,
                        color: "rgba(253, 73, 99,0.1)",
                        opacity: 1
                    },
                    {
                        offset: 75,
                        color: "rgba(253, 73, 99,0.05)",
                        opacity: 1
                    },
                    {
                        offset: 100,
                        color: 'rgba(253, 73, 99,0.05)',
                        opacity: 0.05
                    }
                ],
            ]
        }
    },
    tooltip: {
        fixed: {
            enabled: false
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return ''
                }
            }
        },
        marker: {
            show: false
        }
    }
};
var chart3 = new ApexCharts(document.querySelector("#crm-total-revenue"), options3);
chart3.render();
/* Total Revenue */

/* Total Ratio */
var options4 = {
    series: [{
        data: [32, 63, 59, 45, 72, 31, 84, 28, 53, 49, 68, 50, 42, 60, 30, 18, 97, 61, 67, 22, 74, 58, 33, 55]
    }],
    labels: [...Array(24).keys()].map(n => `2018-09-0${n + 1}`),
    chart: {
        type: 'area',
        height: 50,
        sparkline: {
            enabled: true
        },
    },
    stroke: {
        curve: 'smooth',
        width: 1.5,
    },
    colors: ["rgba(255, 169, 9,0.3)"],
    fill: {
        type: ['gradient'], 
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100],
            colorStops: [
                [
                    {
                        offset: 0,
                        color: "rgba(255, 169, 9,0.1)",
                        opacity: 1
                    },
                    {
                        offset: 75,
                        color: "rgba(255, 169, 9,0.05)",
                        opacity: 1
                    },
                    {
                        offset: 100,
                        color: 'rgba(255, 169, 9,0.05)',
                        opacity: 0.05
                    }
                ],
            ]
        }
    },
    tooltip: {
        fixed: {
            enabled: false
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return ''
                }
            }
        },
        marker: {
            show: false
        }
    }
};
var chart4 = new ApexCharts(document.querySelector("#crm-total-ratio"), options4);
chart4.render();
/* Total Ratio */

//project analysis//
var options = {
    series: [{
        name: "Followers",
        data: [56, 44, 66, 55, 68, 90, 55, 68, 55, 66, 44, 56],
        type: 'area',
    },
    {
        name: "Total Views",
        data: [45, 50, 42, 59, 53, 74, 43, 43, 30, 55, 74, 49],
        type: 'area',
    }],
    chart: {
        type: 'area',
        height: 348,
        toolbar: {
          show: false,
        },
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 7,
            left: 0,
            blur: 1,
            color: ['rgba(var(--secondary-rgb), 1)', "var(--primary-color)"],
            opacity: 0.05,
          },
    },
    grid: {
        borderColor: 'rgba(167, 180, 201 ,0.2)',
        strokeDashArray: 3
    },
    colors: ['rgba(var(--secondary-rgb), 1)', "var(--primary-color)"],
    stroke: {
        width: [2, 2],
        curve: ["smooth", "smooth"],
        dashArray: [0, 4], 
      },
    dataLabels: {
        enabled: false,
    },
    legend: {
        show: true,
        position: 'top',
        labels: {
            colors: '#74767c',
        },
        markers:  {
          size: 5,
          shape: "circle", 
          strokeWidth: 0
        }
    },
    fill: {
        type: "gradient",
        gradient: {
            opacityFrom: 0.5,
            opacityTo: 0.2,
            stops: [0, 60],
            colorStops: [
                [
                    {
                        offset: 0,
                        color: "rgba(var(--secondary-rgb), 0.1)",
                        opacity: 0.2
                      },
                      {
                        offset: 50,
                        color: "rgba(var(--secondary-rgb), 0.1)",
                        opacity: 0.2
                      },
                      {
                        offset: 100,
                        color: 'rgba(var(--secondary-rgb), 0.1)',
                        opacity: 0.5
                      }
                ],
                [
                    {
                        offset: 0,
                        color: "var(--primary005)",
                        opacity: 1
                      },
                      {
                        offset: 50,
                        color: "var(--primary005)",
                        opacity: 1
                      },
                      {
                        offset: 100,
                        color: 'var(--primary005)',
                        opacity: 0.5
                      }
                ],
            ],
        },
    },
    yaxis: {
        labels: {
            formatter: function (y) {
                return y.toFixed(0) + "";
            }
        },
        labels: {
            style: {
                colors: "#8c9097",
                fontSize: '11px',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
        },
        max: 90,
        min: 20
    },
    xaxis: {
        type: 'month',
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'sep', 'oct', 'nov', 'dec'],
        axisBorder: {
            show: true,
            color: 'rgba(167, 180, 201 ,0.2)',
            offsetX: 0,
            offsetY: 0,
        },
        axisTicks: {
            show: true,
            borderType: 'solid',
            color: 'rgba(167, 180, 201 ,0.2)',
            width: 6,
            offsetX: 0,
            offsetY: 0
        },
        labels: {
            rotate: -90,
            style: {
                colors: "#8c9097",
                fontSize: '11px',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
        }
    }
  };
  var chart2 = new ApexCharts(document.querySelector("#project-analysis"), options);
  chart2.render();
//project analysis//

//leads overview//
var options = {
    series: [18235, 12743, 8369],
    labels: ["Hot Leads", "Warm Leads", "Cold Leads"],
    chart: {
      height: 225,
      type: 'donut',
    },
    dataLabels: { 
      enabled: false,
    },

    legend: {
      show: false,
    },
    stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'round',
      colors: "#fff",
      width: 0,
      dashArray: 0,
    },
    stroke: {
      width: 2,
    },
    plotOptions: {
      pie: {
        offsetY: 10,
        expandOnClick: false,
        donut: {
          size: '80%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '20px',
              color: '#495057',
              fontFamily: "Montserrat, sans-serif",
              offsetY: -10
            },
            value: {
              show: true,
              fontSize: '22px',
              color: undefined,
              offsetY: 10,
              fontWeight: 600,
              fontFamily: "Montserrat, sans-serif",
              formatter: function (val) {
                return val + "%"
              }
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total Leads',
              fontSize: '14px',
              fontWeight: 400,
              color: '#495057',
            }
          }
        }
      }
    },
    colors: ["var(--primary09)", "rgba(127, 103, 257, 0.9)", "rgba(253, 73, 99, 0.9)"],
  };
  var chart = new ApexCharts(document.querySelector("#leads-overview"), options);
  chart.render();
//leads overview//

})();