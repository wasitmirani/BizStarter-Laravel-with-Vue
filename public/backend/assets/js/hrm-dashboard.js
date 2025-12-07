(function () {
  'use strict';

  /* Performance by category chart */
var options = {
  series: [{
      name: 'Designing',
      data: [44, 55, 41, 67, 22, 43, 44, 55, 41, 67, 22, 43]
  }, {
      name: 'Development',
      data: [13, 23, 20, 8, 13, 27, 13, 23, 20, 8, 13, 27]
  }, {
      name: 'Marketing',
      data: [11, 17, 15, 15, 21, 14, 11, 17, 15, 15, 21, 14]
  }, {
      name: 'Testing',
      type: 'line',
      data: [45, 31, 24, 56, 13, 28, 55, 41, 67, 22, 15, 13]
  }, {
    name: 'Other',
    type: 'line',
    data: [20, 55, 41, 30, 22, 50, 44, 55, 41, 67, 22, 43]
  }],
  chart: {
      type: 'bar',
      height: 300,
      stacked: true,
      toolbar: {
          show: true  
      },
      zoom: {
          enabled: true
      },
      dropShadow: {
          enabled: true,
          enabledOnSeries: undefined,
          top: 3,
          left: 0,
          blur: 4,
          color: "#000",
          opacity: 0.1,
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
  colors: ["var(--primary07)", "var(--primary02)", "var(--primary05)", "rgba(127, 103, 257, 1)","rgba(253, 73, 99,0.8)"],
  legend: {
      show: true,
      position: 'bottom',
      markers: {
          size: 5,
          shape: "circle"
      }
  },
  markers: {
      size: [0, 0, 0, 4, 0],
      colors: ['rgba(var(--secondary-rgb), 1)'], 
      strokeColors: '#ffffff',
      strokeWidth: 1,
      hover: {
          size: 5
      }
  },
  stroke: {
      curve: 'smooth',
      width: [0, 0, 0, 2,2],
      dashArray: [0,0,0,0,4]
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
document.getElementById('performanceReport').innerHTML = '';
var chart1 = new ApexCharts(document.querySelector("#performanceReport"), options);
chart1.render();
/* Performance by category chart */

var options = {
  series: [18235, 12743, 8369,7543],
  labels: ["Job Boards", "Referrals", "Media", "Campus"],
  chart: {
    height: 235,
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
            offsetY: -10
          },
          value: {
            show: true,
            fontSize: '22px',
            color: undefined,
            offsetY: 10,
            fontWeight: 600,
            fontFamily: "Montserrat, sans-serif",
            formatter: function (val) {
              return val + "%"
            }
          },
          total: {
            show: true,
            showAlways: true,
            label: 'Total Leads',
            fontSize: '14px',
            fontWeight: 400,
            color: '#495057',
          }
        }
      }
    }
  },
  colors: ["var(--primary09)", "rgba(127, 103, 257, 0.9)", "rgba(253, 73, 99, 0.9)" ,"rgba(255, 169, 9, 0.9)"],
};
var chart = new ApexCharts(document.querySelector("#hiring-source"), options);
chart.render();

})();