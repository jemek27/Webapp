// chart_render.js

document.addEventListener('DOMContentLoaded', function() {
    // Renderowanie wykresów
    const temperatureChart = new Chart(document.getElementById('temperatureChart').getContext('2d'), {
        type: 'line',
        data: temperatureData,
        options: {
            scales: {
                x: { display: true },
                y: { display: true }
            }
        }
    });

    const humidityChart = new Chart(document.getElementById('humidityChart').getContext('2d'), {
        type: 'line',
        data: humidityData,
        options: {
            scales: {
                x: { display: true },
                y: { display: true }
            }
        }
    });

    const sunlightChart = new Chart(document.getElementById('sunlightChart').getContext('2d'), {
        type: 'line',
        data: sunlightData,
        options: {
            scales: {
                x: { display: true },
                y: { display: true }
            }
        }
    });

    const barChart = new Chart(document.getElementById('barChart').getContext('2d'), {
        type: 'bar',
        data: barData
    });

    const horizontalBarChart = new Chart(document.getElementById('horizontalBarChart').getContext('2d'), {
        type: 'bar',
        data: horizontalBarData,
        options: {
            indexAxis: 'y', 
            scales: {
                x: { beginAtZero: true },
                y: { beginAtZero: true }
            }
        }
    });

    const pieChart = new Chart(document.getElementById('pieChart').getContext('2d'), {
        type: 'pie',
        data: pieData
    });

    function fetchData() {
        fetch('/data')
            .then(response => response.json())
            .then(data => {
                if (data.data) {
                    dataChart.data.labels.push(new Date().toLocaleTimeString());
                    dataChart.data.datasets[0].data.push(data.data);
                    dataChart.update();
                }
            });
    }

    setInterval(fetchData, 10000);  // Aktualizacja co 10 s
});
