function createChart(data, xAxisName, datasets) {
    const ctx = document.getElementById('temperatureDetailedChart').getContext('2d');

    const chartData = datasets.map(dataset => ({
        label: dataset.label,
        data: data[dataset.dataKey],
        borderColor: dataset.borderColor,
        backgroundColor: dataset.backgroundColor || 'rgba(0, 0, 0, 0.1)',
        fill: dataset.fill || false
    }));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.timestamps,
            datasets: chartData
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
