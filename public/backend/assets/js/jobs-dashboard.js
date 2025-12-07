(function () {
    "use strict";
    var options = {
        chart: {
          height: 325,
          toolbar: {
            show: false,
          },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 7,
            left: 0,
            blur: 1,
            color: ["var(--primary-color)", "var(--primary02)", "rgb(127, 103, 257)"],
            opacity: 0.05,
          },
        },
        grid: {
          show: true,
          borderColor: "rgba(119, 119, 142, 0.1)",
          strokeDashArray: 4,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: [2, 2],
          curve: "smooth",
          dashArray: [0, 4],
        },
        legend: {
          show: true,
          position: "bottom",
          horizontalAlign: "center",
          fontWeight: 600,
          fontSize: "11px",
          labels: {
            colors: "#74767c",
          },
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
        series: [
          {
            name: "Total Application",
            data: [20, 65, 40, 55, 80, 90, 59, 86, 120, 165, 115, 120],
            type: "area",
          },
          {
            name: "Selected Application",
            data: [65, 20, 85, 38, 55, 25, 25, 165, 75, 64, 70, 75],
            type: "line",
          },
        ],
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
                  opacity: 0.05
                },
                {
                  offset: 75,
                  color: "var(--primary01)",
                  opacity: 1
                },
                {
                  offset: 100,
                  color: 'var(--primary02)',
                  opacity: 0.2
                }
              ],
              [
                {
                  offset: 0,
                  color: 'rgb(127, 103, 257)',
                  opacity: 1
                },
                {
                  offset: 75,
                  color: 'rgb(127, 103, 257)',
                  opacity: 1
                },
                {
                  offset: 100,
                  color: 'rgb(127, 103, 257)',
                  opacity: 1
                }
              ],
            ]
          }
        },
        colors: ["var(--primary-color)", "rgba(127, 103, 257)"],
        yaxis: {
          min:0,
          title: {
            style: {
              color: "#adb5be",
              fontSize: "14px",
              fontFamily: "poppins, sans-serif",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-label",
            },
          },
        },
        xaxis: {
          type: "day",
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
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
      };
      var chart = new ApexCharts(document.querySelector("#recruitment-stats"), options);
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
      var chart = new ApexCharts(document.querySelector("#candidates"), options);
      chart.render();

     // deault swiper
     var swiper = new Swiper(".swiper-basic", {
      loop: true,
      autoplay: {
          delay: 1500,
          disableOnInteraction: false,
          slidesPerView: 1,
            spaceBetween: 10
      },
       breakpoints: {
          1880: {
            slidesPerView: 1,
            spaceBetween: 10
          }
        }
  });

})();