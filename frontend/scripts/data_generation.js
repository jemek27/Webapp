// chart_generation.js

// Dane testowe
const labels = ['08:00', '08:15', '08:30', '08:45'];

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
