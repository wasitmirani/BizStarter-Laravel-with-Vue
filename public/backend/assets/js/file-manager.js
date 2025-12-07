(function() {
    "use strict";

    var myElement3 = document.getElementById('filemanager-file-details');
    new SimpleBar(myElement3, { autoHide: true });

    var options = {
        series: [35, 34, 26, 29],
        labels: ["Media", "Downloads", "Apps", "Documents"],
        chart: {
            height: 200,
            type: 'donut',
        },
        dataLabels: {
            enabled: false,
        },

        legend: {
            show: false,
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
                            offsetY: 3,
                        },
                        value: {
                            show: true,
                            fontSize: '28px',
                            fontWeight: 600,
                            color: undefined,
                            offsetY: -35,
                            formatter: function (val) {
                                return val + "%"
                            },
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'Used of 256 GB',
                            fontSize: '12px',
                            fontWeight: 400,
                        }

                    }
                }
            }
        },
        grid: {
            padding: {
                bottom: -100
            }
        },
        colors: ["var(--primary09)", "rgba(127, 103, 257, 0.9)", "rgba(253, 73, 99, 0.9)", "rgba(255, 169, 9, 0.9)"],
    };
    var chart = new ApexCharts(document.querySelector("#file-manager-storage"), options);
    chart.render();


})();