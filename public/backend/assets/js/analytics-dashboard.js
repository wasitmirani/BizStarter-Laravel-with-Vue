(function () {
    'use strict';

   /* Audience report Chart */
var options = {
    series: [
        {
            name: 'Views',
            type: 'column',
            data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 45, 35]
        },
        {
            name: 'Followers',
            type: 'column',
            data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 27]
        },
    ],
    chart: {
        toolbar: {
            show: false
        },
        type: 'line',
        height: 328,
    },
    grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 3
    },
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: [1, 1.1],
        curve: ['straight', 'smooth'],
    },
    legend: {
        show: true,
        position: 'top',
        markers: {
            shape: "circle",
            size: 5
        }
    },
    xaxis: {
        axisBorder: {
            color: '#e9e9e9',
        },
    },
    plotOptions: {
        bar: {
            columnWidth: "45%",
            borderRadius: 2
        }
    },
    colors: ["var(--primary-color)", "rgba(var(--secondary-rgb), 1)"],
};
document.querySelector("#audienceReport").innerHTML = ""
var chart2 = new ApexCharts(document.querySelector("#audienceReport"), options);
chart2.render();
/* Audience report Chart */

  /* Start:: Sales growth */
  var options6 = {
    series: [{
        name: 'Last Year',
        data: [35, 36, 22, 44, 48, 37, 36, 26, 27, 33, 32, 36]
    },{
      name: 'This Year',
      data: [55, 53, 46, 40, 45, 38, 46, 37, 22, 34, 40, 44,]
  },
    ],
    chart: {
        type: 'line',
        height: 195,
        stacked: true,
        toolbar: {
          show: false,
        },
        sparkline: {
            enabled: false
        },
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 6,
            left: 1,
            blur: 4,
            color: '#000',
            opacity: 0.12
        },
    },
    grid: {
      show: true,
      xaxis: {
        lines: {
            show: true
        }
    },   
    yaxis: {
        lines: {
            show: false
        }
    },  
    padding: {
      top:2,
      right:2,
      bottom:2,
      left:2
  },  
      borderColor: '#f1f1f1',
      strokeDashArray: 3
  },
    markers: {
      size: 4,
      hover: {
          size: 3
      },
    },
    colors: [ "rgba(127, 103, 257, 1)","var(--primary-color)"],
    stroke: {
        curve: 'straight',
        width: 2.5,
        dashArray: 2
    },
    legend: {
        show: true,
        position: "bottom",
        fontFamily: 'Poppins',
        markers: {
          size: 4,
          shape: "circle",
          strokeWidth: 0
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
        color: "rgba(119, 119, 142, 0.05)",
        offsetX: 0,
        offsetY: 0,
    },
    axisTicks: {
        show: true,
        borderType: "solid",
        color: "rgba(119, 119, 142, 0.05)",
        width: 6,
        offsetX: 0,
        offsetY: 0,
    },
        title: {
            style: {
                color: '#adb5be',
                fontSize: '14px',
                fontFamily: 'poppins, sans-serif',
                fontWeight: 600,
                cssClass: 'apexcharts-yaxis-label',
            },
        },
        labels: {
          show: false,
            formatter: function (y) {
                return y.toFixed(0) + "";
            }
        }
    },
    xaxis: {
        type: 'month',
        categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        axisBorder: {
          show: true,
          color: "rgba(119, 119, 142, 0.05)",
          offsetX: 0,
          offsetY: 0,
      },
      title: {
        style: {
            color: '#adb5be',
            fontSize: '5px',
            fontFamily: 'poppins, sans-serif',
            fontWeight: 600,
            cssClass: 'apexcharts-yaxis-label',
        },
    },
    },
  };
  var chart11 = new ApexCharts(document.querySelector("#sales-growth"), options6);
  chart11.render();
  /* End:: Sales growth */


  /* impression Chart */
  var total = {
    chart: {
        type: 'area',
        height: 70,
        sparkline: {
            enabled: true
        },
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 7,
            left: 0,
            blur: 1,
            color: 'var(--primary-color)',
            opacity: 0.10
        }
    },
    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: undefined,
        width: 1.5,
        dashArray: 0,
    },
    fill: {
        type: 'gradient',
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
                        color: "var(--primary01)",
                        opacity: 1
                    },
                    {
                        offset: 100,
                        color: "var(--primary01)",
                        opacity: 1
                    }
                ]
            ]
        }
    },
    series: [{
        name: 'Value',
        data: [46, 34, 40, 35, 21, 46, 37, 22, 34, 34, 40, 44, 28, 23, 18, 15, 18, 16, 17, 12, 14]
    }],
    yaxis: {
        min: 0,
        show: false
    },
    xaxis: {
        axisBorder: {
            show: false
        },
    },
    yaxis: {
        axisBorder: {
            show: false
        },
    },
    colors: ["var(--primary-color)"],
    tooltip: {
        enabled: false,
    }
}
document.getElementById('impression-chat').innerHTML = '';
var total = new ApexCharts(document.querySelector("#impression-chat"), total);
total.render();
/* impression Chart */

 /* subscriber Chart */
 var total = {
    chart: {
        type: 'area',
        height: 70,
        sparkline: {
            enabled: true
        },
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 7,
            left: 0,
            blur: 1,
            color: 'rgba(127, 103, 257)',
            opacity: 0.10
        }
    },
    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: undefined,
        width: 1.5,
        dashArray: 0,
    },
    fill: {
        type: 'gradient',
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
                        color: "rgba(127, 103, 257,0.1)",
                        opacity: 1
                    },
                    {
                        offset: 100,
                        color: "rgba(127, 103, 257,0.1)",
                        opacity: 1
                    }
                ]
            ]
        }
    },
    series: [{
        name: 'Value',
        data: [14, 12, 17, 16, 18, 15, 18, 23, 28, 44, 40, 34, 34, 34, 22, 37, 46, 21, 35, 40, 34, 46]
    }],
    yaxis: {
        min: 0,
        show: false
    },
    xaxis: {
        axisBorder: {
            show: false
        },
    },
    yaxis: {
        axisBorder: {
            show: false
        },
    },
    colors: ["rgba(127, 103, 257)"],
    tooltip: {
        enabled: false,
    }
}
document.getElementById('subscriber-chat').innerHTML = '';
var total = new ApexCharts(document.querySelector("#subscriber-chat"), total);
total.render();
/* subscriber Chart */

/* sessions device Chart */
var options = {
    series: [2224, 1267, 553],
    labels: ["Mobile", "Laptop", "Desktop"],
    chart: {
        height: 162,
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
    fill: {
        type: 'solid',
    },
    plotOptions: {
    
        pie: {
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
                offsetY: -4
            },
            value: {
                show: true,
                fontSize: '18px',
                color: undefined,
                offsetY: 8,
                formatter: function (val) {
                return val + "%"
                }
            },
            total: {
                show: true,
                showAlways: true,
                label: 'Total',
                fontSize: '22px',
                fontWeight: 600,
                color: '#495057',
            }
    
            }
        }
        }
    },
    colors: ["var(--primary-color)", "rgba(127, 103, 257)", "rgba(253, 73, 99)"],
    };
    document.querySelector("#crmprofit-report").innerHTML = " ";
    var chart = new ApexCharts(document.querySelector("#crmprofit-report"), options);
    chart.render();

    /* sessions device Chart */

})();