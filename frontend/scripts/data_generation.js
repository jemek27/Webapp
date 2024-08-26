// chart_generation.js

// Dane testowe
const labels = ['08:00', '08:15', '08:30', '08:45'];

const endDate = new Date();  
const startDate = new Date();
startDate.setDate(endDate.getDate() - 3);

// Wykres temperatury (gleba i powietrze)
const temperatureData = {
    labels: labels,
    datasets: [
        {
            label: 'Soil Temperature (°C)',
            data: [16, 16.2, 16.3, 16.5],
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            fill: false
        },
        {
            label: 'Air Temperature (°C)',
            data: [22, 21.5, 21.8, 22.1],
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            fill: false
        }
    ]
};

// Wykres wilgotności (gleba i powietrze)
const humidityData = {
    labels: labels,
    datasets: [
        {
            label: 'Soil Humidity (%)',
            data: [60, 61, 60.5, 59.8],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false
        },
        {
            label: 'Air Humidity (%)',
            data: [55, 54, 53.5, 53],
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 2,
            fill: false
        }
    ]
};

// Wykres nasłonecznienia
const sunlightData = {
    labels: labels,
    datasets: [
        {
            label: 'Sunlight Intensity (W/m²)',
            data: [200, 220, 240, 260],
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 2,
            fill: false
        }
    ]
};

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
