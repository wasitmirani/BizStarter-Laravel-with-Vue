(function () {
    "use strict";

    var options = {
        series: [
          {
            name: 'Orders',
            type: 'area',
            data: [102, 103, 103, 99, 100, 105, 102, 102, 104, 104, 103, 105, 104, 106, 112, 101, 100, 102, 99, 98, 98, 99, 97, 103, 100, 101, 100, 103, 104, 102, 100]
          },
          {
            name: 'Sales',
            type: 'line',
            data: [118, 119, 119, 122, 120, 123, 122, 120, 125, 118, 117, 119, 121, 123, 121, 119, 120, 118, 117, 119, 118, 120, 119, 122, 120, 121, 119, 118, 117, 119],
          },
          {
            name: 'Profit',
            type: 'line',
            data: [123, 124, 124, 127, 125, 128, 127, 125, 130, 123, 122, 124, 126, 128, 126, 124, 125, 123, 122, 124, 123, 125, 124, 127, 125, 126, 124, 123, 122, 124
            ],
          }
        ],
        chart: {
          type: "line",
          height: 340,
          toolbar: {
            show: false
          },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 7,
            left: 0,
            blur: 1,
            color: ['var(--primary-color)', "rgba(127, 103, 257,1)", "rgba(253, 73, 99,1)"],
            opacity: 0.05,
          },
        },
        labels: ['Sun','','','','Mon','','','','','Tue','','','','','Wed','','','', '','Thu','','','','', 'Fri','','','','','Sat'],
        colors: [
          'var(--primary-color)',
          "rgba(127, 103, 257,1)", "rgba(253, 73, 99,1)"
        ],
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: true,
          position: "top",
          offsetX: 0,
          offsetY: 8,
          markers: {
            size:5,
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
          markers: {
            size: [3.5,0,0],
            strokeWidth: 1.5,
            dashArray: 5
          },
        stroke: {
          curve: 'smooth',
          width: [2, 1.8, 1.8],
          lineCap: 'round',
          dashArray: [4,0, 0],
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
                            color: "rgba(3, 181, 98,0.1)",
                            opacity: 1
                          },
                          {
                            offset: 50,
                            color: "rgba(3, 181, 98,0.1)",
                            opacity: 1
                          },
                          {
                            offset: 100,
                            color: 'rgba(3, 181, 98,0.1)',
                            opacity: 0.5
                          }
                    ],
                    [
                        {
                            offset: 0,
                            color: "rgb(253, 73, 99)",
                            opacity: 1
                          },
                          {
                            offset: 50,
                            color: "rgb(253, 73, 99)",
                            opacity: 1
                          },
                          {
                            offset: 100,
                            color: 'rgb(253, 73, 99)',
                            opacity: 1
                          }
                    ],
                    [
                        {
                            offset: 0,
                            color: "rgba(127, 103, 257,1)",
                            opacity: 1
                          },
                          {
                            offset: 50,
                            color: "rgba(127, 103, 257,1)",
                            opacity: 1
                          },
                          {
                            offset: 100,
                            color: 'rgba(127, 103, 257,1)',
                            opacity: 1
                          }
                    ],
                ],
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
        yaxis: {
          min: 85,
          tickAmount: 5,
          show: true,
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          }
        },
        xaxis: {
          show: false,
          axisBorder: {
            show: false,
            color: 'rgba(119, 119, 142, 0.05)',
            offsetX: 0,
            offsetY: 0,
          },
          axisTicks: {
            show: false,
            borderType: 'solid',
            color: 'rgba(119, 119, 142, 0.05)',
            width: 6,
            offsetX: 0,
            offsetY: 0
          },
          labels: {
            rotate: -90,
          }
        },
      };
      var chart4 = new ApexCharts(document.querySelector("#nft-statustics"), options);
      chart4.render();
    

})();