// chart_render.js
// const datasets = [
//     { label: 'Air Temperature (°C)', dataKey: 'air_temperature', borderColor: 'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.2)' },
//     { label: 'Soil Temperature (°C)', dataKey: 'soil_temperature', borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)' },
//     { label: 'Humidity (%)', dataKey: 'air_humidity', borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.2)' },
//     { label: 'Soil moisture (%)', dataKey: 'soil_moisture', borderColor: 'rgba(139, 69, 19, 1)', backgroundColor: 'rgba(139, 69, 19, 0.2)' },
//     { label: 'Solar Intensity (W/m²)', dataKey: 'solar_intensity', borderColor: 'rgba(255, 204, 0, 1)', backgroundColor: 'rgba(255, 204, 0, 0.2)' },
//     { label: 'Pressure (hPa)', dataKey: 'pressure', borderColor: 'rgba(153, 102, 255, 1)', backgroundColor: 'rgba(153, 102, 255, 0.2)' },
//     { label: 'Air Quality Index (AQI)', dataKey: 'AQI', borderColor: 'rgba(255, 159, 64, 1)', backgroundColor: 'rgba(255, 159, 64, 0.2)' },
//     { label: 'Total Volatile Organic Compounds (TVOC)', dataKey: 'TVOC', borderColor: 'rgba(34, 202, 236, 1)', backgroundColor: 'rgba(34, 202, 236, 0.2)' },
//     { label: 'CO2 (ppm)', dataKey: 'CO2', borderColor: 'rgba(255, 99, 71, 1)', backgroundColor: 'rgba(255, 99, 71, 0.2)' },
//     { label: 'Wind Speed (m/s)', dataKey: 'wind_speed', borderColor: 'rgba(0, 123, 255, 1)', backgroundColor: 'rgba(0, 123, 255, 0.2)' },
//     { label: 'Particles 2.5µm (µg/m³)', dataKey: 'particles_2_5u', borderColor: 'rgba(192, 57, 43, 1)', backgroundColor: 'rgba(192, 57, 43, 0.2)' },
//     { label: 'Particles 5µm (µg/m³)', dataKey: 'particles_5u', borderColor: 'rgba(39, 174, 96, 1)', backgroundColor: 'rgba(39, 174, 96, 0.2)' },
//     { label: 'Particles 10µm (µg/m³)', dataKey: 'particles_10u', borderColor: 'rgba(241, 196, 15, 1)', backgroundColor: 'rgba(241, 196, 15, 0.2)' }
// ];
document.addEventListener('DOMContentLoaded', function() {
    const endDate = new Date();  
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 5);//TODO change to last 5 or 3 days

    let temperatureChart = null;
    let humidityChart = null;
    let sunlightChart = null;
    let pressureChart = null;
    let AQIChart = null;
    let TVOCChart = null;
    let CO2Chart = null;
    let windSpeedChart = null;
    let particlesChart = null;
    const temperatureDataset = [
        { label: 'Air Temperature (°C)', dataKey: 'air_temperature', borderColor: 'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.2)' },
        { label: 'Soil Temperature (°C)', dataKey: 'soil_temperature', borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)' }
    ];
    const humidityDataset = [
        { label: 'Humidity (%)', dataKey: 'air_humidity', borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.2)' },
        { label: 'Soil moisture (%)', dataKey: 'soil_moisture', borderColor: 'rgba(139, 69, 19, 1)', backgroundColor: 'rgba(139, 69, 19, 0.2)' },
    ];
    const sunlightDataset = [
        { label: 'Solar Intensity (W/m²)', dataKey: 'solar_intensity', borderColor: 'rgba(255, 204, 0, 1)', backgroundColor: 'rgba(255, 204, 0, 0.2)' },
    ];
    const pressureDataset = [
        { label: 'Pressure (hPa)', dataKey: 'pressure', borderColor: 'rgba(153, 102, 255, 1)', backgroundColor: 'rgba(153, 102, 255, 0.2)' },
    ];
    const AQIDataset = [
        { label: 'Air Quality Index (AQI)', dataKey: 'aqi', borderColor: 'rgba(255, 159, 64, 1)', backgroundColor: 'rgba(255, 159, 64, 0.2)' },
    ];
    const TVOCDataset = [
        { label: 'Total Volatile Organic Compounds (TVOC)', dataKey: 'tvoc', borderColor: 'rgba(34, 202, 236, 1)', backgroundColor: 'rgba(34, 202, 236, 0.2)' },
    ];
    const CO2Dataset = [
        { label: 'CO2 (ppm)', dataKey: 'co2', borderColor: 'rgba(255, 99, 71, 1)', backgroundColor: 'rgba(255, 99, 71, 0.2)' },
    ];
    const windSpeedDataset = [
        { label: 'Wind Speed (m/s)', dataKey: 'wind_speed', borderColor: 'rgba(0, 123, 255, 1)', backgroundColor: 'rgba(0, 123, 255, 0.2)' },
    ];
    const particlesDataset = [
        { label: 'Particles 2.5µm (µg/m³)', dataKey: 'particles_2_5u', borderColor: 'rgba(192, 57, 43, 1)', backgroundColor: 'rgba(192, 57, 43, 0.2)' },
        { label: 'Particles 5µm (µg/m³)', dataKey: 'particles_5u', borderColor: 'rgba(39, 174, 96, 1)', backgroundColor: 'rgba(39, 174, 96, 0.2)' },
        { label: 'Particles 10µm (µg/m³)', dataKey: 'particles_10u', borderColor: 'rgba(241, 196, 15, 1)', backgroundColor: 'rgba(241, 196, 15, 0.2)' }
    ];

    fetchDataDb('http://localhost:3000/dataDb', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        columns: ['timestamp', 'air_temperature', 'soil_temperature', 'air_humidity', 'soil_moisture', 'solar_intensity', 'pressure', 'AQI', 'TVOC', 'CO2', 'wind_speed', 'particles_2_5u', 'particles_5u', 'particles_10u']
    }).then(data => {
        temperatureChart = createChart(data,     'Temperature (°C)', temperatureDataset, 'temperatureChart', temperatureChart);
        humidityChart = createChart(data,        'Humidity and moisture (%)', humidityDataset, 'humidityChart', humidityChart);
        sunlightChart = createChart(data,        'Intensity (W/m²)', sunlightDataset, 'sunlightChart', sunlightChart);
        pressureChart = createChart(data,        pressureDataset.label, pressureDataset, 'pressureChart', pressureChart);
        AQIChart = createChart(data,             AQIDataset.label, AQIDataset, 'AQIChart', AQIChart);
        TVOCChart = createChart(data,            TVOCDataset.label, TVOCDataset, 'TVOCChart', TVOCChart);
        CO2Chart = createChart(data,             CO2Dataset.label, CO2Dataset, 'CO2Chart', CO2Chart);
        windSpeedChart = createChart(data,       windSpeedDataset.label, windSpeedDataset, 'windSpeedChart', windSpeedChart);
        particlesChart = createChart(data,       'Particles (µg/m³)', particlesDataset, 'particlesChart', particlesChart);
    });

    // fetchDataFormServer().then(data => {
    //     filteredData = filterDataByDateRange(data, startDate, endDate);

    //     chartInstance = createChart(filteredData, 'Temperature (°C)', temperatureDataset, 'temperatureChart', temperatureChart);
    //     chartInstance = createChart(filteredData, 'Humidity and moisture (%)', humidityDataset, 'humidityChart', humidityChart);
    //     chartInstance = createChart(filteredData, 'Intensity (W/m²)', sunlightDataset, 'sunlightChart', sunlightChart);
    //     chartInstance = createChart(filteredData, pressureDataset.label, pressureDataset, 'pressureChart', pressureChart);
    //     chartInstance = createChart(filteredData, AQIDataset.label, AQIDataset, 'AQIChart', AQIChart);
    //     chartInstance = createChart(filteredData, TVOCDataset.label, TVOCDataset, 'TVOCChart', TVOCChart);
    //     chartInstance = createChart(filteredData, CO2Dataset.label, CO2Dataset, 'CO2Chart', CO2Chart);
    //     chartInstance = createChart(filteredData, windSpeedDataset.label, windSpeedDataset, 'windSpeedChart', windSpeedChart);
    //     chartInstance = createChart(filteredData, 'Particles (µg/m³)', particlesDataset, 'particlesChart', particlesChart);

    // });
    
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
