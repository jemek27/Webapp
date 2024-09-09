
function filterDataByDateRange(data, start, end) {
    end.setDate(end.getDate() + 1) // we want to include the end date <start, end>
    let startDateIndex = -1;
    let endDateIndex = -1;
    let i = 0;
    while (startDateIndex == -1) {
        if (start <= new Date(data['timestamps'][i])) {
            startDateIndex = i;
        } else if (i == data['timestamps'].length - 1){ 
            break;
        } else {
            ++i;
        }
    }

    i = data['timestamps'].length - 1;
    while (endDateIndex == -1) {
        if (end >= new Date(data['timestamps'][i])) {
            endDateIndex = i;
        } else if (i < startDateIndex){ 
            break;
        } else {
            --i;
        }
    }
    
    let filteredData = {};
    for (let key in data) {
        filteredData[key] = [];
        for (let i = startDateIndex; i <= endDateIndex; ++i)
        filteredData[key].push(data[key][i]);
    }
    
    return filteredData;
}

function createChart(data, yAxisName, datasets, canvasID, chartInstance) {
    const ctx = document.getElementById(canvasID).getContext('2d');

    if (chartInstance) {
        chartInstance.destroy();
    }

    const chartData = datasets.map(dataset => ({
        label: dataset.label,
        //data: data[dataset.dataKey],
        data: data.map(item => item[dataset.dataKey]),
        borderColor: dataset.borderColor,
        backgroundColor: dataset.backgroundColor || 'rgba(0, 0, 0, 0.1)',
        fill: dataset.fill || false,
        tension: 0.2  // Wartość od 0 (prostokątne segmenty) do 1 (maksymalne wygładzanie)
    }));
    
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            //labels: data.timestamps,
            labels: data.map(item => item.timestamp),
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
                            return tooltipItem.dataset.label + ': ' + tooltipItem.raw;
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
                    //suggestedMin: 0
                }
            }
        }
    });

    return chartInstance;
}