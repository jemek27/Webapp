let chartInstance = null;

function filterDataByDateRange(data, startDate, endDate) { //todo jeśli nie ma start albo end to przyjąc max 
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredLabels = data.timestamps.filter((timestamp, index) => {
        const date = new Date(timestamp);
        return date >= start && date <= end;
    });

    const filteredData = {};
    for (const key in data) {
        if (key !== 'timestamps') {
            filteredData[key] = data[key].filter((_, index) => {
                const date = new Date(data.timestamps[index]);
                return date >= start && date <= end;
            });
        }
    }

    return { timestamps: filteredLabels, ...filteredData };
}

function createChart(data, yAxisName, datasets) {
    const ctx = document.getElementById('detailedChart').getContext('2d');

    if (chartInstance) {
        chartInstance.destroy();
    }

    const chartData = datasets.map(dataset => ({
        label: dataset.label,
        data: data[dataset.dataKey],
        borderColor: dataset.borderColor,
        backgroundColor: dataset.backgroundColor || 'rgba(0, 0, 0, 0.1)',
        fill: dataset.fill || false
    }));
    
    chartInstance = new Chart(ctx, {
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
                        text: yAxisName
                    },
                    suggestedMin: 0
                }
            }
        }
    });
}