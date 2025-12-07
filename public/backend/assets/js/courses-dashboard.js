(function () {
  "use strict";

  /* learning activity */
  var options = {
    series: [{
      name: 'This Week',
      type: 'column',
      data: [25, 18, 20, 25, 50, 20, 40,35,55,25,30,43]
    }, {
      name: 'Last Week',
      type: 'line',
      data: [45, 55, 40, 65, 20, 45, 25 ,32,42,55,33,23]
    }, {
      name: 'Average',
      type: 'line',
      data: [30, 25, 35, 30, 45, 35, 65,52,41,35,55,60]
    }],
    chart: {
      height: 325,
      type: 'line',
      stacked: false,
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 3,
        color: ["transparent", 'rgba(127, 103, 257, 0.2)', 'var(--primary02)'],
        opacity: 0.5
      },
    },
    colors: ["var(--primary02)", "rgba(127, 103, 257,1)", "var(--primary-color)"],
    grid: {
      show: true,
      borderColor: 'rgba(119, 119, 142, 0.1)',
      strokeDashArray: 4,
    },
    stroke: {
      width: [0, 2, 2],
      curve: 'smooth',
      dashArray: [0,0, 4], 

    },
    plotOptions: {
      bar: {
        columnWidth: '32%',
        borderRadius: 3,
      }
    },
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    markers: {
      size: 0,
    },
    legend: {
      show: true,
      position: 'top',
      fontFamily: "Montserrat",
      markers: {
      size:4,
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'sep', 'oct', 'nov', 'dec'],
      fontFamily: "Montserrat",
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
    yaxis: {
      title: {
        text: 'Growth',
        style: {
          color: '	#adb5be',
          fontSize: '14px',
          fontFamily: 'Montserrat, sans-serif',
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
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return y.toFixed(0) + " Hours";
          }
          return y;

        }
      }
    }
  };
  var chart = new ApexCharts(document.querySelector("#learning-activity"), options);
  chart.render();
  /* learning activity */

  /* Top Category */
  var options = {
    series: [2224, 1267, 553],
    labels: ["Mobile", "Tablet", "Desktop"],
    chart: {
        height: 190,
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
    document.querySelector("#top-category").innerHTML = " ";
    var chart = new ApexCharts(document.querySelector("#top-category"), options);
    chart.render();
  /* Top Category */

    /* Financial Summery */
    var options = {
      series: [{
          name: 'Income',
          data: [4, 8, 10, 15, 8, 15, 5]
      },
      {
          name: 'Expenses',
          data: [-4, -8, -10, -15, -8, -15, -5]
      }
      ],
      chart: {
          type: 'bar',
          height: 320,
          stacked: true,
          toolbar: {
            show: false,
          },
      },
      colors: [ 'rgba(var(--primary-rgb),0.8)', 'rgba(var(--secondary-rgb), 0.8)'],
      plotOptions: {
          bar: {
              horizontal: true,
              barHeight: '35%',
              borderRadius: 4,
          },
      },
      dataLabels: {
          enabled: false
      },
      legend: {
          show: true,
          position: 'bottom',
          floating: false,
          markers: {
              size: 4,
              shape: "circle",
          },
      },
      grid: {
          show: true,
          borderColor: "rgba(119, 119, 142, 0.1)",
          strokeDashArray: 4,
          xaxis: {
              lines: {
                  show: false
              }
          }, 
          row: {
              colors: ["rgba(var(--light-rgb), 1)", "transparent"],
              opacity: 0.7
          },
      },
      xaxis: {
          labels: {
              formatter: function (val) {
                  return Math.abs(Math.round(val)) + "%"
              },
              style: {
                  colors: "#8c9097",
                  fontSize: '11px',
                  fontWeight: 600,
                  cssClass: 'apexcharts-xaxis-label',
              },
          },
          axisBorder: {
              show: false,
          }
      },
      yaxis: {
          labels: {
              show: true,
              style: {
                  colors: "#8c9097",
                  fontSize: '11px',
                  fontWeight: 600,
                  cssClass: 'apexcharts-yaxis-label',
              },
          },
      }
  };
  var chart = new ApexCharts(document.querySelector("#financial-summary"), options);
  chart.render();
    /* Financial Summery */

       // vertical swiper
    //    if (document.querySelector('[data-width="boxed"]')) {
    //     // Set swiper to 1 (for the "boxed" condition)
    //     var swiper = new Swiper(".course-swiper-vertical", {
    //         direction: "vertical",
    //         slidesPerView: 1,  // Adjusted to 1 as per the requirement
    //         spaceBetween: 10, 
    //         pagination: {
    //             el: ".swiper-pagination",
    //             clickable: true,
    //         },
    //         loop: true,
    //         autoplay: {
    //             delay: 1500,
    //             disableOnInteraction: false
    //         },
    //     });
    // } 
    // else {
        // Default swiper settings if data-width is not 'boxed'
        var swiper = new Swiper(".course-swiper-vertical", {
            direction: "vertical",
            slidesPerView: 2,  // Default value when not "boxed"
            spaceBetween: 10, 
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            loop: true,
            autoplay: {
                delay: 1500,
                disableOnInteraction: false
            },
            breakpoints: {
              1000: {
                  slidesPerView: 1,
                  spaceBetween: 10,
              },
              1400: {
                  slidesPerView: 1,
                  spaceBetween: 10,
              },
               1640: {
                  slidesPerView: 2,
                  spaceBetween: 10,
              },
          },
        }); 
    // }


    var options1 = {
      series: [4, 4, 4, 4, 4, 4,4, 4, 4, 3],
      chart: {
        type: "donut",
        width: 53,
        height: 53,
        sparkline: {
          enabled: true
        },    
      },
      dataLabels: {
        enabled: false
      },
      colors: ["var(--primary-color)","var(--primary-color)","var(--primary-color)","var(--primary-color)","var(--primary-color)","var(--primary-color)","var(--primary01)","var(--primary01)","var(--primary01)","var(--primary01)"],
      plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                value: {
                  fontSize: "11px",
                  fontFamily: "Rubik, sans-serif",
                  fontWeight: 400,
                  color: "#000",
                  offsetY: -12,
                  formatter: function (val) {
                    return val;
                  },
                },
                total: {
                  show: true,
                  showAlways: false,
                  fontSize: "11px",
                  fontFamily: "Rubik, sans-serif",
                },
              },
            },
          },
        },
        tooltip: {
          enabled: false // Disable tooltips
      }
    };
    var chart1 = new ApexCharts(document.querySelector("#course-1"), options1);
    chart1.render();


    var options2 = {
      series: [5, 5, 5, 5, 5, 5,5, 5, 5, 2],
      chart: {
        type: "donut",
        width: 53,
        height: 53,
        sparkline: {
          enabled: true
        },    
      },
      dataLabels: {
        enabled: false
      },
      colors: ["rgba(127, 103, 257,1)","rgba(127, 103, 257,1)","rgba(127, 103, 257,1)","rgba(127, 103, 257,1)","rgba(127, 103, 257,0.1)","rgba(127, 103, 257,0.1)","rgba(127, 103, 257,0.1)","rgba(127, 103, 257,0.1)","rgba(127, 103, 257,0.1)","rgba(127, 103, 257,0.1)"],
      plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                value: {
                  fontSize: "11px",
                  fontFamily: "Rubik, sans-serif",
                  fontWeight: 400,
                  color: "#000",
                  offsetY: -12,
                  formatter: function (val) {
                    return val;
                  },
                },
                total: {
                  show: true,
                  showAlways: false,
                  fontSize: "11px",
                  fontFamily: "Rubik, sans-serif",
                },
              },
            },
          },
        }, 
         tooltip: {
          enabled: false // Disable tooltips
        }
    };
    var chart2 = new ApexCharts(document.querySelector("#course-2"), options2);
    chart2.render();


    var options3 = {
      series: [4, 4, 4, 4, 3, 4,4, 4, 3, 2],
      chart: {
        type: "donut",
        width: 53,
        height: 53,
        sparkline: {
          enabled: true
        },    
      },
      dataLabels: {
        enabled: false
      },
      colors: ["rgba(253, 73, 99,1)","rgba(253, 73, 99,1)","rgba(253, 73, 99,1)","rgba(253, 73, 99,1)","rgba(253, 73, 99,1)","rgba(253, 73, 99,1)","rgba(253, 73, 99,0.1)","rgba(253, 73, 99,0.1)","rgba(253, 73, 99,0.1)","rgba(253, 73, 99,0.1)"],
      plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                value: {
                  fontSize: "11px",
                  fontFamily: "Rubik, sans-serif",
                  fontWeight: 400,
                  color: "#000",
                  offsetY: -12,
                  formatter: function (val) {
                    return val;
                  },
                },
                total: {
                  show: true,
                  showAlways: false,
                  fontSize: "11px",
                  fontFamily: "Rubik, sans-serif",
                },
              },
            },
          },
        },
        tooltip: {
          enabled: false // Disable tooltips
      }
    };
    var chart3 = new ApexCharts(document.querySelector("#course-3"), options3);
    chart3.render();

    var options4 = {
      series: [5, 5, 5, 5, 5, 5,5, 5, 3, 2],
      chart: {
        type: "donut",
        width: 53,
        height: 53,
        sparkline: {
          enabled: true
        },    
      },
      dataLabels: {
        enabled: false
      },
      colors: ["rgba(255, 169, 9,1)","rgba(255, 169, 9,1)","rgba(255, 169, 9,1)","rgba(255, 169, 9,1)","rgba(255, 169, 9,1)","rgba(255, 169, 9,1)","rgba(255, 169, 9,1)","rgba(255, 169, 9,0.1)","rgba(255, 169, 9,0.1)","rgba(255, 169, 9,0.1)"],
      plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                value: {
                  fontSize: "11px",
                  fontFamily: "Rubik, sans-serif",
                  fontWeight: 400,
                  color: "#000",
                  offsetY: -12,
                  formatter: function (val) {
                    return val;
                  },
                },
                total: {
                  show: true,
                  showAlways: false,
                  fontSize: "11px",
                  fontFamily: "Rubik, sans-serif",
                },
              },
            },
          },
        },
        tooltip: {
          enabled: false // Disable tooltips
      }
    };
    var chart4 = new ApexCharts(document.querySelector("#course-4"), options4);
    chart4.render();

})();