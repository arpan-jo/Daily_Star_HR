const pieHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>

  <div id="chart"></div>

  <script src="https://cdn.jsdelivr.net/npm/apexcharts">
  </script>

  <script>

  if (navigator.appVersion.includes('Android')) {
    document.addEventListener("message", function (data) {
      let d = [];
      let name = [];
      let dddd = data;
      let dat = JSON.parse(dddd?.data)
      if(dat?.graphValue){
          d?.push(dat?.graphValue)
      }
      if(dat?.graphText){
        name?.push(dat?.graphText)
      }
      const options = {
        chart: {
          type: 'donut',
        },
        series: d?.[0] || [100],
        labels: name?.[0] || ["No Data"],
        dataLabels: {
          enabled: true,
          textAnchor: 'middle',
          formatter: function(val, opt) {
            return val.toFixed(0) + "%";
           },
          style: {
              fontSize: '12px',
              fontWeight: 'bold',
              colors:['white'] ,
          },
          dropShadow: {
            enabled: false,
          },
        },
        plotOptions: {
          pie: {
            donut: {
              size: '55%',
            },
          },
        },
        legend: {
          show: true,
          position: "bottom",
        },
      }
      var chart = new ApexCharts(document.querySelector('#chart'),options);
    if(d?.length > 0){
      chart.render()
    }
    });
  }
  else {
    window.addEventListener("message", function (data) {
      let d = [];
      let name = [];
      let dddd = data;
      let dat = JSON.parse(dddd?.data)
      if(dat?.graphValue){
          d?.push(dat?.graphValue)
      }
      if(dat?.graphText){
        name?.push(dat?.graphText)
      }
      const options = {
        chart: {
          type: 'donut',
        },
        series: d?.[0] || [100],
        labels: name?.[0] || ["No Data"],
        dataLabels: {
          enabled: true,
          textAnchor: 'middle',
          formatter: function(val, opt) {
            return val.toFixed(0) + "%";
           },
          style: {
              fontSize: '12px',
              fontWeight: 'bold',
              colors:['white'] ,
          },
          dropShadow: {
            enabled: false,
          },
        },
        plotOptions: {
          pie: {
            donut: {
              size: '55%',
            },
          },
        },
        legend: {
          show: true,
          position: "bottom",
        },
      }
      var chart = new ApexCharts(document.querySelector('#chart'),options);
    if(d?.length > 0){
      chart.render()
    }
    });
  }

  </script>

  </body>

</html>
`;

export default pieHtml;
