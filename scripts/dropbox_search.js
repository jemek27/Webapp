const datasets = [
    { label: 'Air Temperature (°C)', dataKey: 'air', borderColor: 'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.2)' },
    { label: 'Soil Temperature (°C)', dataKey: 'soil', borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)' },
    { label: 'Humidity (%)', dataKey: 'humidity', borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.2)' },
    
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

document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const options = document.querySelectorAll('#datasetSelect option');

    options.forEach(option => {
        const label = option.text.toLowerCase();
        option.style.display = label.includes(searchTerm) ? '' : 'none';
    });
});

document.getElementById('datasetSelect').addEventListener('change', function() {
    const selectedIndex = this.value;
    const selectedDataset = datasets[selectedIndex];

    
    fetchData().then(data => {
        createChart(data, 'aaaaa', [selectedDataset]);
    });
});


populateDropdown();
