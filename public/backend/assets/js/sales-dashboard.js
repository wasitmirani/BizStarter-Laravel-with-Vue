(function () {
  "use strict";

  /*Sales Revenue*/

  var options = {
    series: [
      {
        name: "Delivered",
        data: [
          10, 11, 14, 12, 18, 19, 15, 25, 30, 35, 40, 45, 75, 69, 74, 68, 73, 78, 83, 77, 107, 106, 136, 141, 146, 176, 206, 200, 230, 224, 199, 193, 223, 198, 173, 148, 149, 124, 99, 129, 130, 160, 190, 165, 195, 225, 219, 213, 243, 273, 267, 272, 266, 260, 265, 259, 264, 269, 274, 279, 284, 314, 344, 349, 343, 337, 331, 361, 355, 385, 390, 395, 389, 394, 399
        ],
        type: "area",
      },
       {
        name: 'Cancelled',
        data: [
          15, 40, 39, 33, 27, 57, 62, 92, 86, 116, 146, 145, 150, 155, 185, 190, 195, 189, 219, 224, 254, 248, 242, 247, 252, 282, 312, 287, 288, 263, 257, 287, 281, 256, 257, 251, 252, 227, 221, 196, 226, 227, 202, 177, 178, 172, 147, 177, 152, 127, 157, 187, 181, 186, 185, 184, 189, 188, 193, 223, 228, 233, 263, 268, 273, 267, 261, 260, 254, 284, 289, 294, 324, 329, 334
        ]
      }
    ],
    chart: {
      type: "line",
      height: 337,
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 7,
        left: 0,
        blur: 1,
        color: ["rgba(127, 103, 257)", "var(--primary-color)",],
        opacity: 0.05,
      },
    },
    colors: [
      "rgba(127, 103, 257)",
      "var(--primary-color)",
    ],
    plotOptions: {
          bar: {
            columnWidth: "40%",
            borderRadius: 5,
            borderRadiusApplication: 'around',
            borderRadiusWhenStacked: 'all',
          },
        },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: "top",
      offsetX: 0,
      offsetY: 8,
      markers: {
        size: 4,
        strokeWidth: 0,
        strokeColor: '#fff',
        fillColors: undefined,
        radius: 12,
        customHTML: undefined,
        onClick: undefined,
        offsetX: 0,
        offsetY: 0
      },
    },
    stroke: {
      curve: 'smooth',
      width: [1.8, 1.8],
      lineCap: 'round',
      dashArray: [0, 0],
    },
    fill: {
      type: ['gradient', 'solid'],
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
              opacity: 0.1
            },
            {
              offset: 75,
              color: "rgba(127, 103, 257,0.1)",
              opacity: 1
            },
            {
              offset: 100,
              color: 'rgba(127, 103, 257,0.1)',
              opacity: 1
            }
          ],
          [
            {
              offset: 0,
              color: 'var(--primary-color)',
              opacity: 1
            },
            {
              offset: 75,
              color: 'var(--primary-color)',
              opacity: 1
            },
            {
              offset: 100,
              color: 'var(--primary-color)',
              opacity: 1
            }
          ],
        ]
      }
    },
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    yaxis: {
      tickAmount:8,
      show: true,
      axisBorder: {
        show: true,
        color: 'rgba(119, 119, 142, 0.1)',
      },
      axisTicks: {
        show: true,
      }
    },
    xaxis: {
      show: true,
      tickAmount:12,
      axisBorder: {
        show: false,
        color: 'rgba(119, 119, 142, 0.05)',
        offsetX: 0,
        offsetY: 0,
      },
      axisTicks: {
        show: true,
        borderType: 'solid',
        color: 'rgba(119, 119, 142, 0.05)',
        width: 2,
        offsetX: 0,
        offsetY: 0
      },
      labels: {
        show: true,
        rotate: 0,
      }
    },
  };
  var chart4 = new ApexCharts(document.querySelector("#salesOverview"), options);
  chart4.render();

  /*Sales Revenue*/

   /* Visitors By Device */
   var options = {
    series: [18235, 12743, 8369, 16458],
    labels: ["Mobile", "Desktop", "Laptop", "Tablet"],
    chart: {
      height: 260,
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
        startAngle: -90,
        endAngle: 90,
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
              offsetY: -35
            },
            value: {
              show: true,
              fontSize: '22px',
              color: undefined,
              offsetY: -25,
              fontWeight: 600,
              fontFamily: "Montserrat, sans-serif",
              formatter: function (val) {
                return val + "%"
              }
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total Visitors',
              fontSize: '14px',
              fontWeight: 400,
              color: '#495057',
            }
          }
        }
      }
    },
    grid: {
      padding: {
        bottom: -85
      }
    },
    colors: ["var(--primary09)", "rgba(127, 103, 257, 0.9)", "rgba(253, 73, 99, 0.9)", "rgba(255, 169, 9, 0.9)"],
  };
  var chart = new ApexCharts(document.querySelector("#visitors-by-device"), options);
  chart.render();
  /* Visitors By Device */

})();