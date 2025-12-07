(function () {
    "use strict";

      /* stocks swiper */
      if (document.querySelector('[data-width="boxed"]')) {
        var swiper = new Swiper(".swiper-basic", {
          loop: true,
          slidesPerView: 1,
          spaceBetween: 20,
          autoplay: {
              delay: 1000,
              disableOnInteraction: false,
          },
          breakpoints: {
              500: {
                  slidesPerView: 1,
                  spaceBetween: 20,
              },
              768: {
                  slidesPerView: 1,
                  spaceBetween: 20,
              },
              1024: {
                  slidesPerView: 1,
                  spaceBetween: 20,
              },
              1200: {
                  slidesPerView: 2,
                  spaceBetween: 20,
              },
              1500: {
                  slidesPerView: 2,
                  spaceBetween: 20,
              },
              1600: {
                  slidesPerView: 3,
                  spaceBetween: 20,
              },
              1800: {
                  slidesPerView: 3,
                  spaceBetween: 20,
              },
          },
        });
      }else {
      var swiper = new Swiper(".swiper-basic", {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 20,
        autoplay: {
            delay: 1000,
            disableOnInteraction: false,
        },
        breakpoints: {
            500: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1200: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
            1500: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
            1600: {
                slidesPerView: 4,
                spaceBetween: 20,
            },
            1800: {
                slidesPerView: 4,
                spaceBetween: 20,
            },
        },
      });
    }
    /* stocks swiper */
    
    /* Bitcoin chat */
    var spark1 = {
        chart: {
            type: 'line',
            height: 50,
            width: 120,
            sparkline: {
                enabled: true
            },
            dropShadow: {
                enabled: false,
                enabledOnSeries: undefined,
                top: 0,
                left: 0,
                blur: 3,
                color: '#000',
                opacity: 0.1
            }
        },
        grid: {
            show: false,
            xaxis: {
                lines: {
                    show: false
                }
            },
            yaxis: {
                lines: {
                    show: false
                }
            },
        },
        stroke: {
            show: true,
            curve: 'straight',
            lineCap: 'butt',
            colors: undefined,
            width: 1.5,
            dashArray: 2,
        },
        fill: {
            gradient: {
                enabled: false
            }
        },
        series: [{
            name: 'Value',
            data: [15, 42, 22, 42, 35, 32, 56, 35,45,25]
        }],
        yaxis: {
            min: 0,
            show: false
        },
        xaxis: {
            show: false,
            axisTicks: {
                show: false
            },
            axisBorder: {
                show: false
            }
        },
        yaxis: {
            axisBorder: {
                show: false
            },
        },
        colors: ['var(--primary08)'],
        responsive: [{
          breakpoint: 480,
          options: {
              chart: {
                  width: 90
              },
          }
      }]
      
      }
      document.getElementById('btn-coin-chart').innerHTML = '';
      var spark1 = new ApexCharts(document.querySelector("#btn-coin-chart"), spark1);
      spark1.render();
    /* Bitcoin chat */
    
    /* Amazon chat */
    var spark2 = {
        chart: {
            type: 'line',
            height: 50,
            width: 120,
            sparkline: {
                enabled: true
            },
            dropShadow: {
                enabled: false,
                enabledOnSeries: undefined,
                top: 0,
                left: 0,
                blur: 3,
                color: '#000',
                opacity: 0.1
            }
        },
        grid: {
            show: false,
            xaxis: {
                lines: {
                    show: false
                }
            },
            yaxis: {
                lines: {
                    show: false
                }
            },
        },
        stroke: {
            show: true,
            curve: 'straight',
            lineCap: 'butt',
            colors: undefined,
            width: 1.5,
            dashArray: 2,
        },
        fill: {
            gradient: {
                enabled: false
            }
        },
        series: [{
            name: 'Value',
            data: [15, 42, 22, 42, 35, 32, 56, 35,45,25]
        }],
        yaxis: {
            min: 0,
            show: false
        },
        xaxis: {
            show: false,
            axisTicks: {
                show: false
            },
            axisBorder: {
                show: false
            }
        },
        yaxis: {
            axisBorder: {
                show: false
            },
        },
        colors: ['rgba(127, 103, 257,0.8)'],
        responsive: [{
          breakpoint: 480,
          options: {
              chart: {
                  width: 90
              },
          }
      }]
      
      }
      document.getElementById('amazon-chart').innerHTML = '';
      var spark2 = new ApexCharts(document.querySelector("#amazon-chart"), spark2);
      spark2.render();
      /* Amazon chat */

    /* Apple chat */
    var spark3 = {
        chart: {
            type: 'line',
            height: 50,
            width: 120,
            sparkline: {
                enabled: true
            },
            dropShadow: {
                enabled: false,
                enabledOnSeries: undefined,
                top: 0,
                left: 0,
                blur: 3,
                color: '#000',
                opacity: 0.1
            }
        },
        grid: {
            show: false,
            xaxis: {
                lines: {
                    show: false
                }
            },
            yaxis: {
                lines: {
                    show: false
                }
            },
        },
        stroke: {
            show: true,
            curve: 'straight',
            lineCap: 'butt',
            colors: undefined,
            width: 1.5,
            dashArray: 2,
        },
        fill: {
            gradient: {
                enabled: false
            }
        },
        series: [{
            name: 'Value',
            data: [15, 42, 22, 42, 35, 32, 56, 35,45,25]
        }],
        yaxis: {
            min: 0,
            show: false
        },
        xaxis: {
            show: false,
            axisTicks: {
                show: false
            },
            axisBorder: {
                show: false
            }
        },
        yaxis: {
            axisBorder: {
                show: false
            },
        },
        colors: ['rgba(253, 73, 99,0.8)'],
        responsive: [{
          breakpoint: 480,
          options: {
              chart: {
                  width: 90
              },
          }
      }]
      
      }
      document.getElementById('apple-chart').innerHTML = '';
      var spark3 = new ApexCharts(document.querySelector("#apple-chart"), spark3);
      spark3.render();
    /* Apple chat */

        /* samsung chat */
        var spark4 = {
            chart: {
                type: 'line',
                height: 50,
                width: 120,
                sparkline: {
                    enabled: true
                },
                dropShadow: {
                    enabled: false,
                    enabledOnSeries: undefined,
                    top: 0,
                    left: 0,
                    blur: 3,
                    color: '#000',
                    opacity: 0.1
                }
            },
            grid: {
                show: false,
                xaxis: {
                    lines: {
                        show: false
                    }
                },
                yaxis: {
                    lines: {
                        show: false
                    }
                },
            },
            stroke: {
                show: true,
                curve: 'straight',
                lineCap: 'butt',
                colors: undefined,
                width: 1.5,
                dashArray: 2,
            },
            fill: {
                gradient: {
                    enabled: false
                }
            },
            series: [{
                name: 'Value',
                data: [15, 42, 22, 42, 35, 32, 56, 35,45,25]
            }],
            yaxis: {
                min: 0,
                show: false
            },
            xaxis: {
                show: false,
                axisTicks: {
                    show: false
                },
                axisBorder: {
                    show: false
                }
            },
            yaxis: {
                axisBorder: {
                    show: false
                },
            },
            colors: ['rgba(255, 169, 9,0.8)'],
            responsive: [{
              breakpoint: 480,
              options: {
                  chart: {
                      width: 90
                  },
              }
          }]
          
          }
          document.getElementById('samsung-chart').innerHTML = '';
          var spark4 = new ApexCharts(document.querySelector("#samsung-chart"), spark4);
          spark4.render();
        /* samsung chat */

        /* nvda chat */
        var spark5 = {
            chart: {
                type: 'line',
                height: 50,
                width: 120,
                sparkline: {
                    enabled: true
                },
                dropShadow: {
                    enabled: false,
                    enabledOnSeries: undefined,
                    top: 0,
                    left: 0,
                    blur: 3,
                    color: '#000',
                    opacity: 0.1
                }
            },
            grid: {
                show: false,
                xaxis: {
                    lines: {
                        show: false
                    }
                },
                yaxis: {
                    lines: {
                        show: false
                    }
                },
            },
            stroke: {
                show: true,
                curve: 'straight',
                lineCap: 'butt',
                colors: undefined,
                width: 1.5,
                dashArray: 2,
            },
            fill: {
                gradient: {
                    enabled: false
                }
            },
            series: [{
                name: 'Value',
                data: [15, 42, 22, 42, 35, 32, 56, 35,45,25]
            }],
            yaxis: {
                min: 0,
                show: false
            },
            xaxis: {
                show: false,
                axisTicks: {
                    show: false
                },
                axisBorder: {
                    show: false
                }
            },
            yaxis: {
                axisBorder: {
                    show: false
                },
            },
            colors: ['rgba(15, 188, 249,0.8)'],
            responsive: [{
              breakpoint: 480,
              options: {
                  chart: {
                      width: 90
                  },
              }
          }]
          
          }
          document.getElementById('nvda-chart').innerHTML = '';
          var spark5 = new ApexCharts(document.querySelector("#nvda-chart"), spark5);
          spark5.render();
        /* nvda chat */

        /* stock price overview chat */
            /* stocks chart */
    var data = generateDayWiseTimeSeries(new Date("22 Apr 2024").getTime(), 115, {
        min: 30,
        max: 90
      });
      var options1 = {
        chart: {
          id: "chart2",
          type: "area",
          height: 265,
          foreColor: "#ccc",
          toolbar: {
            autoSelected: "pan",
            show: false
          }
        },
        colors: ["var(--primary-color)"],
        stroke: {
          width: 2.5,
          curve: "straight",
          dashArray: 4
        },
        grid: {
          borderColor: "#555",
          clipMarkers: false,
          yaxis: {
            lines: {
              show: false
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        fill: {
          gradient: {
            enabled: true,
            opacityFrom: 0.5,
            opacityTo: 0.1,
            colorStops: [
              [
                  {
                      offset: 0,
                      color: "var(--primary05)",
                      opacity: 0.05
                  },
                  {
                      offset: 75,
                      color: "var(--primary03)",
                      opacity: 1
                  },
                  {
                      offset: 100,
                      color: 'var(--primary05)',
                      opacity: 1
                  }
              ],
          ]
          }
        },
        markers: {
          size: 3,
          strokeWidth: 1.5,
          dashArray: 4
        },
        series: [
          {
            name: 'Investment',
            data: data
          }
        ],
        tooltip: {
          theme: "dark"
        },
        xaxis: {
          type: "datetime"
        },
        yaxis: {
          min: 0,
          tickAmount: 3,
          max: 150
        }
      };
      
      var chart1 = new ApexCharts(document.querySelector("#stockCap-area"), options1);
      
      chart1.render();
      
      var options2 = {
        chart: {
          id: "chart1",
          height: 130,
          type: "bar",
          foreColor: "#ccc",
          brush: {
            target: "chart2",
            enabled: true
          },
          selection: {
            enabled: true,
            fill: {
              color: "#fff",
              opacity: 0.4
            },
            xaxis: {
              min: new Date("05 Jun 2024 10:00:00").getTime(),
              max: new Date("26 Jul 2024 10:00:00").getTime()
            }
          }
        },
        colors: ["rgba(var(--secondary-rgb), 1)"],
        series: [
          {
            name: 'Market Cap',
            data: data
          }
        ],
        grid: {
          show: false,
          borderColor: "#444"
        },
        markers: {
          size: 0
        },
        xaxis: {
          type: "datetime",
          tooltip: {
            enabled: false
          }
        },
        plotOptions: {
          bar: {
              columnWidth: "70%",
              borderRadius: 3
          }
        },
        yaxis: {
          tickAmount: 2
        }
      };
      
      var chart88 = new ApexCharts(document.querySelector("#stockCap"), options2);
      
      chart88.render();
      
      function generateDayWiseTimeSeries(baseval, count, yrange) {
        var i = 0;
        var series = [];
        while (i < count) {
          var x = baseval;
          var y =
            Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      
          series.push([x, y]);
          baseval += 76400000;
          i++;
        }
        return series;
      }
       /* stocks chart */

       /* stocks Analytics */


       var options = {
        series: [{
        type: 'bar',
        name: 'Earnings',
        data: [55, -30, 35, -40, 32, 45, -30
        ]
      },{
        type: 'line',
        name: 'Profit',
        data: [-20, 20, -5, 25, 45, -20, 40
        ]
      }],
        chart: {
        height: 278,
        toolbar: {
          show: false
        }
      },
      stroke: {
        curve: 'smooth',
        width: [0, 2],
        lineCap: 'round',
        dashArray: [0, 4],
      },
      grid: {
        borderColor: '#f5f4f4',
        strokeDashArray: 3
      },
      plotOptions: {
        bar: {
          colors: {
            ranges: [{
              from: -100,
              to: -46,
              color: 'rgba(var(--secondary-rgb), 0.9)'
            }, {
              from: -45,
              to: 0,
              color: 'rgba(var(--secondary-rgb), 0.9)'
            }]
          },
          columnWidth: '30%',
          borderRadius: 2,
          borderRadiusWhenStacked: 'last',
        }
      },
      dataLabels: {
        enabled: false,
      },
      yaxis: {
        tickAmount: 5,
        title: {
          text: 'Earnings',
        },
      },
      xaxis: {
        type: 'week',
        categories: ['sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri','Sat'],
      },
      colors: ["rgba(var(--primary-rgb), 1)" ,"rgba(var(--danger-rgb), 1)"],
      };
      
      var chart = new ApexCharts(document.querySelector("#growth-analytics"), options);
      chart.render();

        /* stocks Analytics */

        /* stock price overview chat */

})();