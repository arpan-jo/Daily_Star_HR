const lineHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </script>
<canvas id="myChart" width="300" height="200"></canvas>


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

    // alert(JSON.stringify(name, null, 2))
      const config = {
        type: 'line',
        data: {
            labels: name?.[0],
              datasets: [{
                label: 'Turn Over',
                fill: true,
                borderWidth: 3,
                backgroundColor: '#FDDEB6',
                borderColor: '#F79009',
                borderCapStyle: 'round',
                data: d?.[0],
            }]
          },
        options: {
            plugins: {
                legend: {
                    display: false,
                    }
                },
            indexAxis: 'x',
            scales: {
              x: {
                suggestedMin: 0,
                suggestedMax: 1,
                ticks: {
                    beginAtZero: true,
                 },
              },
              y: {
                suggestedMin: 0,
                suggestedMax: 1,
                ticks: {
                    beginAtZero: true,
                    callback: function(value, index, ticks) {
                        return value * 10 + " %";
                    }
              }
            },
            },
          }
        };
      const myChart = new Chart(
        document.getElementById('myChart'),
        config
      );
      myChart.render()

    });
  }  else {
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

    // alert(JSON.stringify(name, null, 2))
      const config = {
        type: 'line',
        data: {
            labels: name?.[0],
              datasets: [{
                label: 'Turn Over',
                fill: true,
                borderWidth: 3,
                backgroundColor: '#FDDEB6',
                borderColor: '#F79009',
                borderCapStyle: 'round',
                data: d?.[0],
            }]
          },
        options: {
            plugins: {
                legend: {
                    display: false,
                    }
                },
            indexAxis: 'x',
            scales: {
              x: {
                suggestedMin: 0,
                suggestedMax: 1,
                ticks: {
                    beginAtZero: true,
                 },
              },
              y: {
                suggestedMin: 0,
                suggestedMax: 1,
                ticks: {
                    beginAtZero: true,
                    callback: function(value, index, ticks) {
                        return value * 10 + " %";
                    }
              }
            },
            },
          }
        };
      const myChart = new Chart(
        document.getElementById('myChart'),
        config
      );
      myChart.render()
    });
  }




</script>
</body>

</html>

`;
export default lineHtml;
