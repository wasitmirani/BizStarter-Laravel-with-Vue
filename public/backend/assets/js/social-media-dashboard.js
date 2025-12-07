(function () {
  "use strict";

  /* attendance overview */
  var options = {
    series: [
        {
          type: "area",
            name: "Facebook",
            data: [32, 15, 63, 51, 36, 62, 99, 42, 78, 76, 32, 20],
        },
        {
          type: "line",
            name: "Instagram",
            data: [56, 58, 38, 50, 64, 45, 55, 32, 15, 63, 51, 36],
        },
    ],
    chart: {
        type: "line",
        height: 400,
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 7,
            left: 1,
            blur: 3,
            color: '#000',
            opacity: 0.1
        },
        toolbar: {
            show: false,
        }
    },
    grid: {
        borderColor: "#f5f4f4",
        strokeDashArray: 5,
        yaxis: {
            lines: {
                show: true, // Ensure y-axis grids are shown
            },
        },
    },
    colors: [
        "var(--primary-color)",
        "rgba(127, 103, 257, 1)",
    ],
    stroke: {
        curve: ["smooth", "smooth"],
        width: [1.5, 2],
        dashArray: [0, 3],
    },
    dataLabels: {
        enabled: false,
    },
    markers: {
      size: [0, 4,],
      colors: ['rgba(var(--secondary-rgb), 1)'], 
      strokeColors: '#ffffff',
      strokeWidth: 1,
      hover: {
          size: 5
      }
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
                      color: "var(--primary01)",
                      opacity: 0.1
                  },
                  {
                      offset: 75,
                      color: "var(--primary01)",
                      opacity: 1
                  },
                  {
                      offset: 100,
                      color: 'var(--primary02)',
                      opacity: 1
                  }
              ],
              [
                  {
                      offset: 0,
                      color: 'var(--primary02)',
                      opacity: 1
                  },
                  {
                      offset: 75,
                      color: 'var(--primary02)',
                      opacity: 1
                  },
                  {
                      offset: 100,
                      color: 'var(--primary02)',
                      opacity: 1
                  }
              ],
          ]
      }
  },
    legend: {
        show: true,
        position: "top",
        markers: {
            size: 5
        }
    },
    yaxis: {
        title: {
            style: {
                color: "#adb5be",
                fontSize: "14px",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                cssClass: "apexcharts-yaxis-label",
            },
        },
        axisBorder: {
            show: true,
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
        // labels: {
        //     formatter: function (y) {
        //         return y.toFixed(0) + "k";
        //     },
        // },
    },
    xaxis: {
        type: "month",
        categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "sep",
            "oct",
            "nov",
            "dec",
        ],
        axisBorder: {
            show: false,
            color: "rgba(119, 119, 142, 0.05)",
            offsetX: 0,
            offsetY: 0,
        },
        axisTicks: {
            show: false,
            borderType: "solid",
            color: "rgba(119, 119, 142, 0.05)",
            width: 6,
            offsetX: 0,
            offsetY: 0,
        },
        labels: {
            rotate: -90,
        },
    },
    tooltip: {
        theme: "dark",
    }
};
var chart = new ApexCharts(document.querySelector("#audience-statistics"), options);
chart.render();
  /* attendance overview */

  /* income chart */
  var options5 = {
    series: [{
      name: 'Profit',
      data: [34, 32, 37, 36, 38, 35, 38, 43, 48, 64, 60, 54, 54, 42, 57, 66, 41, 55, 60, 54, 66, 75, 82, 75, 43, 31, 42, 47, 33, 42, 57, 41, 64, 42, 65, 55],
    },
    ],
    chart: {
      type: 'area',
      height: 50,
      stacked: true,
      sparkline: {
        enabled: true,
      },
      zoom: {
        enabled: false
      }
    },
    grid: {
      borderColor: '#f2f6f7',
    },
    colors: ["var(--primary06)"],
    plotOptions: {
      bar: {
        columnWidth: '40%'
      }
    },
    stroke: {
      width: [0],
      curve: 'smooth',
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
      position: 'top',
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
              color: "var(--primary-color)",
              opacity: 0.2
            },
            {
              offset: 75,
              color: "var(--primary-color)",
              opacity: 0.2
            },
            {
              offset: 100,
              color: 'var(--primary-color)',
              opacity: 0.2
            }
          ]
        ]
      }
    },
    yaxis: {
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
        formatter: function (y) {
          return y.toFixed(0) + "";
        }
      }
    },
    xaxis: {
      type: 'month',
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'sep', 'oct', 'nov', 'dec'],
      axisBorder: {
        show: true,
        color: 'rgba(119, 119, 142, 0.05)',
        offsetX: 0,
        offsetY: 0,
      },
      axisTicks: {
        show: true,
        borderType: 'solid',
        color: 'rgba(119, 119, 142, 0.05)',
        width: 6,
        offsetX: 0,
        offsetY: 0
      },
      labels: {
        rotate: -90
      }
    },
    tooltip: {
      enabled: false,
    }
  };
  var chart1 = new ApexCharts(document.querySelector("#income-chart"), options5);
  chart1.render();

  /* income chart */
  
  /* page chat */
  var options5 = {
    series: [{
      name: 'Profit',
      data: [34, 32, 37, 36, 38, 35, 38, 43, 48, 64, 60, 54, 54, 42, 57, 66, 41, 55, 60, 54, 66, 75, 82, 75, 43, 31, 42, 47, 33, 42, 57, 41, 64, 42, 65, 55],
    },
    ],
    chart: {
      type: 'area',
      height: 50,
      stacked: true,
      sparkline: {
        enabled: true,
      },
      zoom: {
        enabled: false
      }
    },
    grid: {
      borderColor: '#f2f6f7',
    },
    colors: ["rgba(127, 103, 257,0.6)"],
    plotOptions: {
      bar: {
        columnWidth: '40%'
      }
    },
    stroke: {
      width: [0],
      curve: 'smooth',
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
      position: 'top',
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
              color: "rgba(127, 103, 257,1)",
              opacity: 0.2
            },
            {
              offset: 75,
              color: "rgba(127, 103, 257,1)",
              opacity: 0.2
            },
            {
              offset: 100,
              color: 'rgba(127, 103, 257,1)',
              opacity: 0.2
            }
          ]
        ]
      }
    },
    yaxis: {
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
        formatter: function (y) {
          return y.toFixed(0) + "";
        }
      }
    },
    xaxis: {
      type: 'month',
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'sep', 'oct', 'nov', 'dec'],
      axisBorder: {
        show: true,
        color: 'rgba(119, 119, 142, 0.05)',
        offsetX: 0,
        offsetY: 0,
      },
      axisTicks: {
        show: true,
        borderType: 'solid',
        color: 'rgba(119, 119, 142, 0.05)',
        width: 6,
        offsetX: 0,
        offsetY: 0
      },
      labels: {
        rotate: -90
      }
    },
    tooltip: {
      enabled: false,
    }
  };
  var chart1 = new ApexCharts(document.querySelector("#page-chart"), options5);
  chart1.render();
  /* page chat */
  
  /* audience reached */
  var options = {
    series: [22664, 13754, 12654],
    labels: ["male", "Female", "Others"],
    chart: {
      height: 270,
      type: 'donut',
    },
    dataLabels: { 
      enabled: false,
    },

    legend: {
      show: false,
    },
    stroke: {
      width: 8,
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
              label: 'Audience Reached',
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
    colors: ["var(--primary09)", "rgba(127, 103, 257, 0.9)", "rgba(253, 73, 99, 0.9)"],
  };
  var chart = new ApexCharts(document.querySelector("#audience-reached"), options);
  chart.render();
   /* audience reached */

    /* profile earned */
    var options = {
      series: [
          {
              name: "Followers",
              data: [20, 38, 38, 72, 55, 63, 43, 76, 55, 80, 40, 80],
              type: "column",
          }
      ],
      chart: {
          height: 230,
          type: "line",
          toolbar: {
              show: false,
          },
          zoom: {
              enabled: false,
          },
      },
      plotOptions: {
          bar: {
              columnWidth: "35%",
              borderRadiusApplication: "end",
              borderRadiusWhenStacked: "all",
              borderRadius: 3,
              colors: {
                  ranges: [{
                      from: 0,
                      to: 45,
                      color: 'var(--primary-color)'
                  }, {
                      from: 45,
                      to: 65,
                      color: 'rgba(127, 103, 257,1)'
                  }, {
                      from: 65,
                      to: 100,
                      color: 'var(--primary-color)'
                  }]
              },
          }
      },
      dataLabels: {
          enabled: false,
      },
      legend: {
          position: "top",
          horizontalAlign: "center",
      },
      stroke: {
          curve: "smooth",
          width: ["0"],
      },
      grid: {
          borderColor: "#f1f1f1",
          strokeDashArray: 2,
          xaxis: {
              lines: {
                  show: true
              }
          },
          yaxis: {
              lines: {
                  show: false
              }
          }
      },
      colors: ["var(--primary-color)"],
      xaxis: {
          type: "month",
          categories: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
          ],
          axisBorder: {
              show: true,
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
          labels: {
              rotate: -90,
          },
      },
  };
  var chart = new ApexCharts(document.querySelector("#profilt-earned"), options);
  chart.render();
     /* profile earned */

})()