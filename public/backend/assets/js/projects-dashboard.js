(function () {
    "use strict";
   
    var options = {
        series: [{
            name: "Paid",
            type: "column",
            data: [33, 21, 32, 37, 23, 32, 47, 31, 54, 32, 20, 38]
        }, {
            name: "Unpaid",
            type: "area",
            data: [44, 55, 41, 42, 22, 43, 21, 35, 56, 27, 43, 27]
        }, {
            name: "Refunded",
            type: "line",
            data: [30, 25, 36, 30, 45, 35, 64, 51, 59, 36, 39, 51]
        }],
        chart: {
            height: 310,
            type: "line",
            stacked: !1,
            toolbar: {
                show: !1
            }
        },
        stroke: {
            width: [0, 0, 2.5],
            dashArray: [0, 0, 4],
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
        },
        grid: {
            borderColor: '#f1f1f1',
            strokeDashArray: 3
        },
        xaxis: {
            axisBorder: {
                color: 'rgba(119, 119, 142, 0.05)',
                offsetX: 0,
                offsetY: 0,
            },
            axisTicks: {
                color: 'rgba(119, 119, 142, 0.05)',
                width: 6,
                offsetX: 0,
                offsetY: 0
            },
        },
        plotOptions: {
            bar: {
                columnWidth: "20%",
                borderRadius: 2
            }
        },
        legend: {
            position: "top"
        },
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        markers: {
            size: 0
        },
        colors: ['var(--primary-color)', "rgba(127, 103, 257,0.1)",'rgba(127, 103, 257,1)'],
        tooltip: {
            theme: "dark",
        },
    };
    var chart = new ApexCharts(document.querySelector("#project-analysis"), options);
    chart.render();

    //team memeber1//
    var options1 = {
        series: [4, 4, 4, 4, 4, 4,4, 4, 4, 3],
        chart: {
          type: "donut",
          width: 50,
          height: 50,
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
      var chart1 = new ApexCharts(document.querySelector("#team-1"), options1);
      chart1.render();

    //team memeber2//
    var options2 = {
        series: [5, 5, 5, 5, 5, 5,5, 5, 5, 2],
        chart: {
          type: "donut",
          width: 50,
          height: 50,
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
      var chart2 = new ApexCharts(document.querySelector("#team-2"), options2);
      chart2.render();

    //team memeber3//
    var options3 = {
        series: [4, 4, 4, 4, 3, 4,4, 4, 3, 2],
        chart: {
          type: "donut",
          width: 50,
          height: 50,
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
      var chart3 = new ApexCharts(document.querySelector("#team-3"), options3);
      chart3.render();

       //team memeber4//
      var options4 = {
        series: [5, 5, 5, 5, 5, 5,5, 5, 3, 2],
        chart: {
          type: "donut",
          width: 50,
          height: 50,
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
      var chart4 = new ApexCharts(document.querySelector("#team-4"), options4);
      chart4.render();

       //team memeber5//
       var options5 = {
        series: [5, 5, 4, 5, 5, 4,5, 5, 3, 2],
        chart: {
          type: "donut",
          width: 50,
          height: 50,
          sparkline: {
            enabled: true
          },    
        },
        dataLabels: {
          enabled: false
        },
        colors: ["rgba(15, 188, 249,1)","rgba(15, 188, 249,1)","rgba(15, 188, 249,1)","rgba(15, 188, 249,1)","rgba(15, 188, 249,1)","rgba(15, 188, 249,1)","rgba(15, 188, 249,0.1)","rgba(15, 188, 249,0.1)","rgba(15, 188, 249,0.1)","rgba(15, 188, 249,0.1)"],
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
      var chart5 = new ApexCharts(document.querySelector("#team-5"), options5);
      chart5.render();

})();