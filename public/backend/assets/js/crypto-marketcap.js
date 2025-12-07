(function () {
  "use strict";

  ///btcmain chart///
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
    colors: ["var(--primary05)"],
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
  var chart1 = new ApexCharts(document.querySelector("#btcmain-chart"), options1);
  chart1.render();
  ///btcmain chart//

    ///ethmain chart///
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
      colors: ["rgba(127, 103, 257,0.5)"],
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
    var chart1 = new ApexCharts(document.querySelector("#ethmain-chart"), options1);
    chart1.render();
    ///ethmain chart//

     ///bnbmain chart///
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
      colors: ["rgba(253, 73, 99,0.5)"],
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
    var chart1 = new ApexCharts(document.querySelector("#bnbmain-marketcap"), options1);
    chart1.render();
    ///bnbmain chart//

    ///cardinomain chart///
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
      colors: ["rgba(255, 169, 9,0.5)"],
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
    var chart1 = new ApexCharts(document.querySelector("#cardinomain-marketcap"), options1);
    chart1.render();
    ///cardinomain chart//

  /* Bitcoin Chart */
  var spark1 = {
    chart: {
      type: "line",
      height: 30,
      width: 120,
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 0,
        left: 0,
        blur: 3,
        color: "#000",
        opacity: 0.1,
      },
    },
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      colors: undefined,
      width: 1.5,
      dashArray: 0,
    },
    fill: {
      gradient: {
        enabled: false,
      },
    },
    series: [
      {
        name: "Value",
        data: [
          0, 45, 54, 38, 56, 24, 65,
        ],
      },
    ],
    yaxis: {
      min: 0,
      show: false,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      enabled: false,
    },
    colors: ["rgb(253, 73, 99)"],
  };
  document.getElementById("btc-chart").innerHTML = "";
  var spark1 = new ApexCharts(document.querySelector("#btc-chart"), spark1);
  spark1.render();

  /* Etherium Chart */
  var spark2 = {
    chart: {
      type: "line",
      height: 30,
      width: 120,
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 0,
        left: 0,
        blur: 3,
        color: "#000",
        opacity: 0.1,
      },
    },
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      colors: undefined,
      width: 1.5,
      dashArray: 0,
    },
    fill: {
      gradient: {
        enabled: false,
      },
    },
    series: [
      {
        name: "Value",
        data: [
          38, 24, 54, 65, 0, 45, 56
        ],
      },
    ],
    yaxis: {
      min: 0,
      show: false,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      enabled: false,
    },
    colors: ["rgb(3, 181, 98)"],
  };
  document.getElementById("eth-chart").innerHTML = "";
  var spark2 = new ApexCharts(document.querySelector("#eth-chart"), spark2);
  spark2.render();

  /* Golem Chart */
  var spark3 = {
    chart: {
      type: "line",
      height: 30,
      width: 120,
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 0,
        left: 0,
        blur: 3,
        color: "#000",
        opacity: 0.1,
      },
    },
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      colors: undefined,
      width: 1.5,
      dashArray: 0,
    },
    fill: {
      gradient: {
        enabled: false,
      },
    },
    series: [
      {
        name: "Value",
        data: [
          38, 65, 24, 0, 56, 45, 54
        ],
      },
    ],
    yaxis: {
      min: 0,
      show: false,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      enabled: false,
    },
    colors: ["rgb(3, 181, 98)"],
  };
  document.getElementById("glm-chart").innerHTML = "";
  var spark3 = new ApexCharts(document.querySelector("#glm-chart"), spark3);
  spark3.render();

  /* Dash Chart */
  var spark4 = {
    chart: {
      type: "line",
      height: 30,
      width: 120,
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 0,
        left: 0,
        blur: 3,
        color: "#000",
        opacity: 0.1,
      },
    },
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      colors: undefined,
      width: 1.5,
      dashArray: 0,
    },
    fill: {
      gradient: {
        enabled: false,
      },
    },
    series: [
      {
        name: "Value",
        data: [
          65, 38, 24, 56, 0, 54, 45
        ],
      },
    ],
    yaxis: {
      min: 0,
      show: false,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      enabled: false,
    },
    colors: ["rgb(3, 181, 98)"],
  };
  document.getElementById("dash-chart").innerHTML = "";
  var spark4 = new ApexCharts(document.querySelector("#dash-chart"), spark4);
  spark4.render();

  /* Litecoin Chart */
  var spark5 = {
    chart: {
      type: "line",
      height: 30,
      width: 120,
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 0,
        left: 0,
        blur: 3,
        color: "#000",
        opacity: 0.1,
      },
    },
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      colors: undefined,
      width: 1.5,
      dashArray: 0,
    },
    fill: {
      gradient: {
        enabled: false,
      },
    },
    series: [
      {
        name: "Value",
        data: [
          24, 45, 65, 0, 38, 56, 54
        ],
      },
    ],
    yaxis: {
      min: 0,
      show: false,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      enabled: false,
    },
    colors: ["rgb(253, 73, 99)"],
  };
  document.getElementById("lite-chart").innerHTML = "";
  var spark5 = new ApexCharts(document.querySelector("#lite-chart"), spark5);
  spark5.render();

  /* Ripple Chart */
  var spark6 = {
    chart: {
      type: "line",
      height: 30,
      width: 120,
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 0,
        left: 0,
        blur: 3,
        color: "#000",
        opacity: 0.1,
      },
    },
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      colors: undefined,
      width: 1.5,
      dashArray: 0,
    },
    fill: {
      gradient: {
        enabled: false,
      },
    },
    series: [
      {
        name: "Value",
        data: [
          54, 0, 56, 45, 38, 65, 24
        ],
      },
    ],
    yaxis: {
      min: 0,
      show: false,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      enabled: false,
    },
    colors: ["rgb(3, 181, 98)"],
  };
  document.getElementById("ripple-chart").innerHTML = "";
  var spark6 = new ApexCharts(document.querySelector("#ripple-chart"), spark6);
  spark6.render();

  /* Eos Chart */
  var spark7 = {
    chart: {
      type: "line",
      height: 30,
      width: 120,
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 0,
        left: 0,
        blur: 3,
        color: "#000",
        opacity: 0.1,
      },
    },
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      colors: undefined,
      width: 1.5,
      dashArray: 0,
    },
    fill: {
      gradient: {
        enabled: false,
      },
    },
    series: [
      {
        name: "Value",
        data: [
          38, 54, 24, 65, 45, 0, 56
        ],
      },
    ],
    yaxis: {
      min: 0,
      show: false,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      enabled: false,
    },
    colors: ["rgb(3, 181, 98)"],
  };
  document.getElementById("eos-chart").innerHTML = "";
  var spark7 = new ApexCharts(document.querySelector("#eos-chart"), spark7);
  spark7.render();


})();
