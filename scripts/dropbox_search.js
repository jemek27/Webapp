const datasets = [
    { label: 'Air Temperature (°C)', dataKey: 'air', borderColor: 'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.2)' },
    { label: 'Soil Temperature (°C)', dataKey: 'soil', borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)' },
    { label: 'Humidity (%)', dataKey: 'humidity', borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.2)' },
    { label: 'Soil moisture (%)', dataKey: 'soil_moisture', borderColor: 'rgba(139, 69, 19, 1)', backgroundColor: 'rgba(139, 69, 19, 0.2)' },
    { label: 'Solar Intensity (W/m²)', dataKey: 'solar_intensity', borderColor: 'rgba(255, 204, 0, 1)', backgroundColor: 'rgba(255, 204, 0, 0.2)' },
];

function populateDropdown() {
    const select = document.getElementById('datasetSelect');
    select.innerHTML = ''; // clear existing options

    datasets.forEach((dataset, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = dataset.label;
        select.appendChild(option);
    });
}

document.getElementById('searchInput').addEventListener('focus', function() {
    const select = document.getElementById('datasetSelect');
    select.style.display = 'block';
});

document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const options = document.querySelectorAll('#datasetSelect option');

    options.forEach(option => {
        const label = option.text.toLowerCase();
        option.style.display = label.includes(searchTerm) ? '' : 'none';
    });

    const visibleOptions = Array.from(options).filter(option => option.style.display !== 'none');
    const select = document.getElementById('datasetSelect');
    select.size = Math.min(visibleOptions.length, 5);
});

document.getElementById('datasetSelect').addEventListener('change', function() {
    const selectedIndex = this.value;
    const selectedDataset = datasets[selectedIndex];

    fetchData().then(data => {
        createChart(data, selectedDataset.label, [selectedDataset]);
    });
});

document.getElementById('updateChart').addEventListener('click', function() {
    const selectedIndex = document.getElementById('datasetSelect').value;
    const selectedDataset = datasets[selectedIndex];

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    fetchData().then(data => {
        let filteredData = data;

        if (startDate && endDate) {
            filteredData = filterDataByDateRange(data, startDate, endDate);
        }

        createChart(filteredData, selectedDataset.label, [selectedDataset]);
    });
});

document.addEventListener('click', function(event) {
    const select = document.getElementById('datasetSelect');
    const searchInput = document.getElementById('searchInput');

    if (!searchInput.contains(event.target) && !select.contains(event.target)) {
        select.style.display = 'none';
    }
});

// document.getElementById('searchInput').addEventListener('input', function() {
//     const searchTerm = this.value.toLowerCase();
//     const options = document.querySelectorAll('#datasetSelect option');

//     options.forEach(option => {
//         const label = option.text.toLowerCase();
//         option.style.display = label.includes(searchTerm) ? '' : 'none';
//     });
// });

// document.getElementById('datasetSelect').addEventListener('change', function() {
//     const selectedIndex = this.value;
//     const selectedDataset = datasets[selectedIndex];

    
//     fetchData().then(data => {
//         createChart(data, selectedDataset.label, [selectedDataset]);
//     });
// });


populateDropdown();
