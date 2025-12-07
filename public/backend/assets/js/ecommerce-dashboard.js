// sales overview//
var options1 = {
    series: [{
        name: 'Revenue',
        type: 'area',
        data: [40, 45, 22, 22, 35, 35, 50, 65, 50, 56, 34, 57],
    }, {
        name: 'Expenses',
        data: [20, 46, 46, 28, 28, 55, 30, 45, 60, 30, 46, 16],
        type: 'line',
      }, {
        name: 'Profit',
        data: [20, 36, 46, 28, 28, 35, 20, 35, 22, 30, 36, 36],
        type: 'bar',
      }],
    chart: {
        height: 385,  
        toolbar: false
    },
    grid: {
        borderColor: '#f2f6f7',
        strokeDashArray: 5,
    },
    colors: ["var(--primary-color)","rgba(253, 73, 99,1)","rgba(127, 103, 257, 1)",],
    dataLabels: {
        enabled: false,
    },
    legend: {
        show: true,
        position: "top",
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
    plotOptions: {
        bar: {
            columnWidth: '25%',
            borderRadius: "2",
        }
    },
    stroke: {
        curve: ["smooth","straight","smooth"],
        width: [2, 2, 0],
        dashArray: [0, 4, 0],
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
    yaxis: {
        title: {
            style: {
                color: '#adb5be',
                fontSize: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                cssClass: 'apexcharts-yaxis-label',
            },
        },
        // labels: {
        //     formatter: function (y) {
        //         return y.toFixed(0) + "";
        //     }
        // }
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
    }
};
document.getElementById('revenue-overview').innerHTML = '';
var chart1 = new ApexCharts(document.querySelector("#revenue-overview"), options1);
chart1.render();

//top categories//

var options = {
    series: [18235, 12743, 8369, 16458],
    labels: ["Electronics", "Fashion Trends", "Entertainment", "Home Decoration"],
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
              label: 'Top Categories',
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
  var chart = new ApexCharts(document.querySelector("#top-categories"), options);
  chart.render();

   // deault swiper
   var swiper = new Swiper(".swiper-basic", {
    loop: true,
    autoplay: {
        delay: 1500,
        disableOnInteraction: false,
    }
});