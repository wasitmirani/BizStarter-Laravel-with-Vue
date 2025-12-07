(function () {
    "use strict";

    var options = {
      series: [{
          name: 'Boys',
          data: [44, 55, 41, 67, 22, 43, 44, 55, 41, 67, 22, 43]
      }, {
          name: 'Girls',
          type: 'line',
          data: [45, 31, 24, 56, 13, 28, 55, 41, 67, 22, 15, 13]
      }, {
        name: 'Teachers',
        type: 'line',
        data: [20, 55, 41, 30, 22, 50, 44, 55, 41, 67, 22, 43]
      }],
      chart: {
          type: 'bar',
          height: 345,
          stacked: true,
          toolbar: {
              show: true  
          },
          zoom: {
              enabled: true
          },
      },
      grid: {
          borderColor: '#f1f1f1',
          strokeDashArray: 3
      },
      yaxis: {
          max: 100
      },
      responsive: [{
          breakpoint: 480,
          options: {
              legend: {
                  position: 'bottom',
                  offsetX: -10,
                  offsetY: 0
              }
          }
      }],
      colors: ["rgba(var(--light-rgb),1)", "var(--primary-color)","rgba(127, 103, 257,1)"],
      legend: {
          show: true,
          position: 'top',
          markers: {
              size: 5,
              shape: "circle"
          }
      },
      markers: {
          size: [0, 4, 0],
          colors: ['var(--primary-color)'], 
          strokeColors: '#ffffff',
          strokeWidth: 1,
          hover: {
              size: 5
          }
      },
      stroke: {
          curve: 'smooth',
          width: [0, 2,2],
          dashArray: [0,0,4]
      },
      plotOptions: {
          bar: {
              columnWidth: "25%",
              borderRadius: 0,
          }
      },
      dataLabels: {
          enabled: false
      },
      xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      fill: {
          opacity: 1
      }
    };
    document.getElementById('attendance-report').innerHTML = '';
    var chart1 = new ApexCharts(document.querySelector("#attendance-report"), options);
    chart1.render();

      /* Students statistics */
    var options = {
        series: [
            {
                name: "Girls",
                data: [44, 42, 57, 86, 58, 55, 45],
            },
            {
                name: "Boys",
                data: [-34, -22, -37, -56, -21, -35, -34],
            },
        ],
        chart: {
            stacked: true,
            type: "bar",
            height: 305,
            toolbar: {
                show: false,
            },
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
        colors: ["var(--primary09)", "rgba(127, 103, 257, 0.9) "],
        plotOptions: {
            bar: {
                borderRadius: 2,
                borderRadiusApplication: "end",
                borderRadiusWhenStacked: "all",
                columnWidth: "25%",
            },
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: true,
            position: "top",
            fontFamily: "Mulish",
            markers: {
                size: 4,
                strokeWidth: 0,
                strokeColor: '#fff',
                fillColors: undefined,
                radius: 5,
                customHTML: undefined,
                onClick: undefined,
                offsetX: 0,
                offsetY: 0
              },
        },
        yaxis: {
            show: false,
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            }
        },
        xaxis: {
            type: "month",
            categories: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                rotate: -90,
            },
        },
    };
    var chart = new ApexCharts(document.querySelector("#students-overview"), options);
    chart.render();
    /* Students statistics */

})();