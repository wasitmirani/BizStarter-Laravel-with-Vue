(function () {
    "use strict";

     /* Patients Analysis */
     var options = {
        series: [
            {
                name: "This Year",
                data: [98, 110, 80, 145, 105, 112, 87, 150, 102, 98, 110, 80],
                type: "area",
            },
            {
                name: "Previous Year",
                data: [75, 55, 65, 28, 75, 25, 52, 30, 30, 54, 40, 59],
                type: "bar",
            },
        ],
        chart: {
            animations: {
                enabled: false,
            },
            height: 335,
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: true,
            position: "top",
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
        stroke: {
            show: true,
            curve: "straight",
            width: [2, 1.5],
            dashArray: [4, 0],
        },
        grid: {
            borderColor: "rgba(107 ,114 ,128,0.1)",
        },
        plotOptions: {
            bar: {
                columnWidth: "30%",
                borderRadius: 2
            }
        },
        colors: ["var(--primary-color)", "rgba(127, 103, 257 , 1)"],
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
        markers: {
            size: [4,0],
            hover: {
              size: 9
            },
            dropShadow: {
                enabled: true, 
                top: 1,
                left: 1, 
                blur: 3,
                opacity: 0.2
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
        yaxis: {
            title: {
                style: {
                    color: "#adb5be",
                    fontSize: "14px",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    cssClass: "apexcharts-yaxis-label",
                },
            },
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
                style: {
                    colors: "rgb(107 ,114 ,128)",
                    fontSize: "12px",
                },
            },
        },
    };
    var chart = new ApexCharts(document.querySelector("#patients-analysis"), options);
    chart.render();
    /* Patients Analysis */

})();