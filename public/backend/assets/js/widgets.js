(function () {
    'use strict';

    var options = {
        series: [{
            name: "Sales",
            data: [30, 38, 25, 42, 35, 13, 63,25,53],
            type: 'area',
        },
        {
            name: "Revenue",
            data: [20, 38, 38, 72, 55, 63, 43,55,33],
            type: 'line',
        }],
        chart: {
            height: 290,
            zoom: {
                enabled: false
            },
            toolbar: { show: false }
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: true,
            position: "bottom",
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
            width: [2,2],
            dashArray:[0,4]
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                type:'vertical',
                opacityTo: 0.1,
                stops: [0, 90, 100],
                colorStops: [
                    [
                        {
                            offset: 0,
                            color: "var(--primary-color)",
                            opacity: 0.1
                        },
                        {
                            offset: 50,
                            color: "var(--primary-color)",
                            opacity: 0.1
                        },
                        {
                            offset: 100,
                            color: "var(--primary02)",
                            opacity: 0.1
                        }
                    ],
                    [
                        {
                            offset: 0,
                            color: "rgba(127, 103, 257)",
                            opacity: 1
                        },
                        {
                            offset: 75,
                            color: "rgba(127, 103, 257)",
                            opacity: 1
                        },
                        {
                            offset: 100,
                            color: "rgba(127, 103, 257)",
                            opacity: 1
                        }
                    ],
                   
                ]
            }
        },
        grid: {
            borderColor: '#f5f4f4',
            strokeDashArray: 3
        },
        colors: ["var(--primary-color)","rgba(127, 103, 257)"],
        yaxis: {
            min:0,
        },
        xaxis: {
            type: 'week',
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun','sun'],
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
        }
    };
    var chart = new ApexCharts(document.querySelector("#crm-revenue-analytics"), options);
    chart.render();

    var options = {
        series: [
            {
                name: "Profit",
                data: [20, 38, 38, 72, 55, 63, 43],
                type: "column",
            }
        ],
        chart: {
            height: 160,
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
                borderRadius: 5,
                colors: {
                    ranges: [{
                        from: 0,
                        to: 65,
                        color: 'var(--primary03)'
                    }, {
                        from: 70,
                        to: 100,
                        color:'var(--primary-color)'
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
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "sun"
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
    var chart = new ApexCharts(document.querySelector("#widget-profit"), options);
    chart.render();

    var options = {
        series: [18235, 12743, 8369, 16458],
        labels: ["male", "Female", "Others", "Not Mentioned"],
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
          colors: ["rgba(244, 244, 244,1)"],
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
                  label: 'Total Candidates',
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
      var chart = new ApexCharts(document.querySelector("#revenue-summery"), options);
      chart.render();

      var spark04 = {
        chart: {
          type: 'area',
          height: 90,
          sparkline: {
            enabled: true
          },
        },
        stroke: {
          show: true,
          width:[2],
          curve: 'smooth',
          lineCap: 'butt',
          colors: undefined,
          dashArray: 0,
        },
        tooltip: {
          enabled: false,
        },
        series: [{
          name: 'Value',
          data: [5, 4, 3, 8, 5, 6, 3, 8, 6, 9, 5, 7, 3, 8]
        }],
        yaxis: {
          min: 0,
          show: false
        },
        plotOptions: {
          bar: {
            columnWidth: "40%",
            borderRadiusApplication: "around",
          },
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                type: "horizontal",
                colorStops: [
                    [
                        {
                            offset: 0,
                            color: "rgba(var(--primary-rgb), 1)",
                            opacity: 0.03
                        },
                        {
                            offset: 90,
                            color: "rgba(var(--primary-rgb), 1)",
                            opacity: 0.03
                        }
                    ]
                ]
            }
        },
        xaxis: {
          axisBorder: {
            show: false
          },
        },
        yaxis: {
          min:0,
          axisBorder: {
            show: false
          },
        },
        colors: ['rgba(var(--primary-rgb), 1)'],
      
      }
      document.getElementById('widget-chart-5').innerHTML = '';
      var spark04 = new ApexCharts(document.querySelector("#widget-chart-5"), spark04);
      spark04.render();

      var spark05 = {
        chart: {
          type: 'area',
          height: 90,
          sparkline: {
            enabled: true
          },
        },
        stroke: {
          show: true,
          width:[2],
          curve: 'smooth',
          lineCap: 'butt',
          colors: undefined,
          dashArray: 0,
        },
        tooltip: {
          enabled: false,
        },
        series: [{
          name: 'Value',
          data: [5, 4, 3, 8, 5, 6, 3, 8, 6, 9, 5, 7, 3, 8]
        }],
        yaxis: {
          min: 0,
          show: false
        },
        plotOptions: {
          bar: {
            columnWidth: "40%",
            borderRadiusApplication: "around",
          },
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                type: "horizontal",
                colorStops: [
                    [
                        {
                            offset: 0,
                            color: "rgba(var(--secondary-rgb), 1)",
                            opacity: 0.03
                        },
                        {
                            offset: 90,
                            color: "rgba(var(--secondary-rgb), 1)",
                            opacity: 0.03
                        }
                    ]
                ]
            }
        },
        xaxis: {
          axisBorder: {
            show: false
          },
        },
        yaxis: {
          min:0,
          axisBorder: {
            show: false
          },
        },
        colors: ['rgba(var(--secondary-rgb), 1)'],
      
      }
      document.getElementById('widget-chart-6').innerHTML = '';
      var spark05 = new ApexCharts(document.querySelector("#widget-chart-6"), spark05);
      spark05.render();
     

      var options = {
        series: [{
            name: 'sales',
            type: 'column',
            data: [200, 170, 250, 240, 220, 280, 170, 155, 130, 242],
        }, {
            name: 'revenue',
            type: 'line',
            data: [13, 15, 25, 17, 19, 22, 11, 10, 9, 22],
            dataLabels: {
                enabled: false,
            },
        }],
        chart: {
            height: 300,
            type: 'line',
            dropShadow: {
                enabled: true,
                enabledOnSeries: undefined,
                top: 0,
                left: 0,
                blur: 4,
                color: ["rgba(255,255,255,0)", "rgb(215, 124, 247)"],
                opacity: 0.4,
            },
            toolbar: {
                show: false,
            }
        },
        dataLabels: {
            enabled: false,
            enabledOnSeries: [0],
            background: {
                enabled: false,
                foreColor: '#fff',
            },
            formatter: function (val) {
                return val + "%";
            },
            offsetY: -10,
            style: {
                fontSize: '12px',
                colors: ["#8c9097"]
            }
        },
        stroke: {
            curve: 'smooth',
            width: [0, 2],
        },
        plotOptions: {
            bar: {
                columnWidth: "30%",
                borderRadius: 3,
            }
        },

        colors: ["rgba(var(--primary-rgb),0.7)", "rgba(127, 103, 257,1)"],
        yaxis: [{

        }, {
            opposite: true,
        }],
    };
    var chart = new ApexCharts(document.querySelector("#salerevenue"), options);
    chart.render();
})();