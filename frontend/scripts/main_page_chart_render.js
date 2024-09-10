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

    const slider = document.getElementById('daysRange');
    const output = document.getElementById('daysValue');
    output.textContent = `${slider.value} days`;

    slider.oninput = function() {
        output.textContent = this.value;
    }


    let temperatureChart = null;
    let humidityChart = null;
    let sunlightChart = null;
    let pressureChart = null;
    let AQIChart = null;
    let TVOCChart = null;
    let CO2Chart = null;
    let windSpeedChart = null;
    let particlesChart = null;

    function updateCharts() {
        const endDate = new Date();  
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - slider.value);

        const temperatureDataset = [
            { label: 'Air Temperature (°C)', dataKey: 'air_temperature', borderColor: 'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.2)' },
            { label: 'Soil Temperature (°C)', dataKey: 'soil_temperature', borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)' }
        ];
        const humidityDataset = [
            { label: 'Humidity (%)', dataKey: 'air_humidity', borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.2)' },
            { label: 'Soil moisture (%)', dataKey: 'soil_moisture', borderColor: 'rgba(139, 69, 19, 1)', backgroundColor: 'rgba(139, 69, 19, 0.2)' },
        ];
        const sunlightDataset = [
            { label: 'Solar Intensity (lx)', dataKey: 'solar_intensity', borderColor: 'rgba(255, 204, 0, 1)', backgroundColor: 'rgba(255, 204, 0, 0.2)' },
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

        fetchDataFromDB({
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            columns: ['timestamp', 'air_temperature', 'soil_temperature', 'air_humidity', 'soil_moisture', 'solar_intensity', 'pressure', 'aqi', 'tvoc', 'co2', 'wind_speed', 'particles_2_5u', 'particles_5u', 'particles_10u']
        }).then(data => {
            temperatureChart = createChart(data,     'Temperature (°C)', temperatureDataset, 'temperatureChart', temperatureChart);
            humidityChart = createChart(data,        'Humidity and moisture (%)', humidityDataset, 'humidityChart', humidityChart);
            sunlightChart = createChart(data,        'Intensity (lx)', sunlightDataset, 'sunlightChart', sunlightChart);
            pressureChart = createChart(data,        pressureDataset[0].label, pressureDataset, 'pressureChart', pressureChart);
            AQIChart = createChart(data,             AQIDataset[0].label, AQIDataset, 'AQIChart', AQIChart);
            TVOCChart = createChart(data,            TVOCDataset[0].label, TVOCDataset, 'TVOCChart', TVOCChart);
            CO2Chart = createChart(data,             CO2Dataset[0].label, CO2Dataset, 'CO2Chart', CO2Chart);
            windSpeedChart = createChart(data,       windSpeedDataset[0].label, windSpeedDataset, 'windSpeedChart', windSpeedChart);
            particlesChart = createChart(data,       'Particles (µg/m³)', particlesDataset, 'particlesChart', particlesChart);
        });
    }

    slider.addEventListener('input', function() {
        daysValue.textContent = `${this.value} days`;
        updateCharts();
    });

    const resizeHints = document.querySelectorAll('.resize-hint');
    resizeHints.forEach((resizeHint) => {
        resizeHint.addEventListener('click', function() {
            const chartBox = this.closest('.chart-box');
            toggleChartSize(chartBox); 
        });
    });
    
    function toggleChartSize(chartBox) {
        chartBox.classList.toggle('chart-box-full');
        const hintElement = chartBox.querySelector('.resize-hint');
        if (chartBox.classList.contains('chart-box-full')) {
            hintElement.textContent = 'Click on bottom to shrink';
        } else {
            hintElement.textContent = 'Click on bottom to enlarge';
        }
    }

    updateCharts();
});
