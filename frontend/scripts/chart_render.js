// chart_render.js

document.addEventListener('DOMContentLoaded', function() {
    // Renderowanie wykresów
    const endDate = new Date();  
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 13);//TODO change to last 5 or 3 days

    let temperatureChart = null;
    let humidityChart = null;
    let sunlightChart = null;
    const temperatureDataset = [
        { label: 'Air Temperature (°C)', dataKey: 'air_temperature', borderColor: 'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.2)' },
        { label: 'Soil Temperature (°C)', dataKey: 'soil_temperature', borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)' }
    ]
    const humidityDataset = [
        { label: 'Humidity (%)', dataKey: 'air_humidity', borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.2)' },
        { label: 'Soil moisture (%)', dataKey: 'soil_moisture', borderColor: 'rgba(139, 69, 19, 1)', backgroundColor: 'rgba(139, 69, 19, 0.2)' },
    ]
    const sunlightDataset = [
        { label: 'Solar Intensity (W/m²)', dataKey: 'solar_intensity', borderColor: 'rgba(255, 204, 0, 1)', backgroundColor: 'rgba(255, 204, 0, 0.2)' },
    ]

    fetchDataFormServer().then(data => {
        filteredData = filterDataByDateRange(data, startDate, endDate);

        chartInstance = createChart(filteredData, 'Temperature (°C)', temperatureDataset, 'temperatureChart', temperatureChart);
        chartInstance = createChart(filteredData, 'Humidity and moisture (%)', humidityDataset, 'humidityChart', humidityChart);
        chartInstance = createChart(filteredData, 'Intensity (W/m²)', sunlightDataset, 'sunlightChart', sunlightChart);
    });
    
    //left as examples

    const barData = {
        labels: ['North', 'South', 'East', 'West'],
        datasets: [{
            label: 'Number of Tree Species',
            data: [25, 30, 28, 24],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };

    const horizontalBarData = {
        labels: ['Oak', 'Pine', 'Birch', 'Maple'],
        datasets: [{
            label: 'Height (m)',
            data: [25, 30, 22, 18],
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
        }]
    };

    const pieData = {
        labels: ['Trees', 'Shrubs', 'Grass', 'Water'],
        datasets: [{
            data: [50, 20, 15, 15],
            backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(255, 205, 86, 0.6)',
                'rgba(54, 162, 235, 0.6)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        }]
    };


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

//    setInterval(fetchData, 10000);  // Aktualizacja co 10 s
});
