var optionsProfileVisit = {
  annotations: {
    position: "back",
  },
  dataLabels: {
    enabled: false,
  },
  chart: {
    type: "bar",
    height: 350,
    fontFamily: "Arial, sans-serif",
    foreColor: "#333",
  },
  fill: {
    opacity: 1,
    colors: ["#95171b"],
  },
  series: [
    {
      name: "Sales",
      data: [9, 20, 30, 20, 10, 20, 30, 20, 10, 20, 30, 20],
    },
  ],
  xaxis: {
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
    labels: {
      style: {
        colors: "#666",
        fontSize: "14px",
        fontFamily: "Arial, sans-serif",
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: "#666",
        fontSize: "14px",
        fontFamily: "Arial, sans-serif",
      },
    },
  },
 
}

let optionsVisitorsProfile = {
  series: [70, 30],
  labels: ["Male", "Female"],
  colors: ["#95171b", "#d70f32"],
  chart: {
    type: "donut",
    width: "100%",
    height: "350px",
    fontFamily: "Arial, sans-serif",
    foreColor: "#333",
  },
  legend: {
    position: "bottom",
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
    markers: {
      width: 12,
      height: 12,
      radius: 6,
    },
    itemMargin: {
      horizontal: 10,
      vertical: 5,
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: "30%",
      },
    },
  },

}

var chartProfileVisit = new ApexCharts(
  document.querySelector("#chart-profile-visit"),
  optionsProfileVisit
)
var chartVisitorsProfile = new ApexCharts(
  document.getElementById("chart-attendance"),
  optionsVisitorsProfile
)

chartProfileVisit.render()
chartVisitorsProfile.render()
