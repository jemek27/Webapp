// chart_render.js

document.addEventListener('DOMContentLoaded', function() {
    // Renderowanie wykresów
    const endDate = new Date();  
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 3);

    let temperatureChart = null;
    let humidityChart = null;
    let sunlightChart = null;
    const temperatureDataset = [
        { label: 'Air Temperature (°C)', dataKey: 'air', borderColor: 'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.2)' },
        { label: 'Soil Temperature (°C)', dataKey: 'soil', borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)' }
    ]
    const humidityDataset = [
        { label: 'Humidity (%)', dataKey: 'humidity', borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.2)' },
        { label: 'Soil moisture (%)', dataKey: 'soil_moisture', borderColor: 'rgba(139, 69, 19, 1)', backgroundColor: 'rgba(139, 69, 19, 0.2)' },
    ]
    const sunlightDataset = [
        { label: 'Solar Intensity (W/m²)', dataKey: 'solar_intensity', borderColor: 'rgba(255, 204, 0, 1)', backgroundColor: 'rgba(255, 204, 0, 0.2)' },
    ]
    // const datasets = [
    //     { label: 'Air Temperature (°C)', dataKey: 'air', borderColor: 'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.2)' },
    //     { label: 'Soil Temperature (°C)', dataKey: 'soil', borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)' },
    //     { label: 'Humidity (%)', dataKey: 'humidity', borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.2)' },
    //     { label: 'Soil moisture (%)', dataKey: 'soil_moisture', borderColor: 'rgba(139, 69, 19, 1)', backgroundColor: 'rgba(139, 69, 19, 0.2)' },
    //     { label: 'Solar Intensity (W/m²)', dataKey: 'solar_intensity', borderColor: 'rgba(255, 204, 0, 1)', backgroundColor: 'rgba(255, 204, 0, 0.2)' },
    // ];


    fetchData('test_sensor_data_temperature.json').then(data => {
        chartInstance = createChart(data, 'Temperature (°C)', temperatureDataset, 'temperatureChart', temperatureChart);
        chartInstance = createChart(data, 'Humidity and moisture (%)', humidityDataset, 'humidityChart', humidityChart);
        chartInstance = createChart(data, 'Intensity (W/m²)', sunlightDataset, 'sunlightChart', sunlightChart);
    });
    

    // const temperatureChart = new Chart(document.getElementById('temperatureChart').getContext('2d'), {
    //     type: 'line',
    //     data: temperatureData,
    //     options: {
    //         scales: {
    //             x: { display: true },
    //             y: { display: true }
    //         }
    //     }
    // });

    // const humidityChart = new Chart(document.getElementById('humidityChart').getContext('2d'), {
    //     type: 'line',
    //     data: humidityData,
    //     options: {
    //         scales: {
    //             x: { display: true },
    //             y: { display: true }
    //         }
    //     }
    // });

    // const sunlightChart = new Chart(document.getElementById('sunlightChart').getContext('2d'), {
    //     type: 'line',
    //     data: sunlightData,
    //     options: {
    //         scales: {
    //             x: { display: true },
    //             y: { display: true }
    //         }
    //     }
    // });

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

    setInterval(fetchData, 10000);  // Aktualizacja co 10 s
});
