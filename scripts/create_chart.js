function createChart(data) { //todo zrobić bardzeij uniwersalne, przesłać całe data{} i id elemntu
    const ctx = document.getElementById('temperatureDetailedChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.temperature.timestamps,  // Czas pomiaru
            datasets: [
                {
                    label: 'Air Temperature (°C)',
                    data: data.temperature.air,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: false
                },
                {
                    label: 'Soil Temperature (°C)',
                    data: data.temperature.soil,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.dataset.label + ': ' + tooltipItem.raw + '°C';
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    },
                    suggestedMin: 0
                }
            }
        }
    });
}
