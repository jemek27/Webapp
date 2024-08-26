const datasets = [
    { label: 'Air Temperature (°C)', dataKey: 'air', borderColor: 'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.2)' },
    { label: 'Soil Temperature (°C)', dataKey: 'soil', borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)' },
    { label: 'Humidity (%)', dataKey: 'humidity', borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.2)' },
    { label: 'Soil moisture (%)', dataKey: 'soil_moisture', borderColor: 'rgba(139, 69, 19, 1)', backgroundColor: 'rgba(139, 69, 19, 0.2)' },
    { label: 'Solar Intensity (W/m²)', dataKey: 'solar_intensity', borderColor: 'rgba(255, 204, 0, 1)', backgroundColor: 'rgba(255, 204, 0, 0.2)' },
];

let chartInstance = null;

function populateList() {
    const datasetList = document.getElementById('datasetList');
    datasetList.innerHTML = '';

    datasets.forEach((dataset, index) => {
        const li = document.createElement('li');
        li.textContent = dataset.label;
        li.dataset.index = index;
        datasetList.appendChild(li);
    });
}

document.getElementById('searchInput').addEventListener('focus', function() {
    const select = document.getElementById('datasetList');
    select.style.display = 'block';
});

document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const items = document.querySelectorAll('#datasetList li');

    items.forEach(item => {
        const label = item.textContent.toLowerCase();
        item.style.display = label.includes(searchTerm) ? '' : 'none';
    });

    const datasetList = document.getElementById('datasetList');
    datasetList.style.display = 'block';
});

let selectedIndex = null;

document.getElementById('datasetList').addEventListener('click', function(event) {
    selectedIndex = event.target.dataset.index;
    const selectedDataset = datasets[selectedIndex];

    fetchData().then(data => {
        chartInstance = createChart(data, selectedDataset.label, [selectedDataset], 'detailedChart', chartInstance);
    });

    document.getElementById('datasetList').style.display = 'none';
    document.getElementById('searchInput').value = event.target.textContent;
});

document.getElementById('updateChart').addEventListener('click', function() {
    if (selectedIndex != null) {
        const selectedDataset = datasets[selectedIndex];
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        fetchData().then(data => {
            let filteredData = data;

            if (startDate && endDate) {
                filteredData = filterDataByDateRange(data, startDate, endDate);
            }

            chartInstance = createChart(filteredData, selectedDataset.label, [selectedDataset], 'detailedChart', chartInstance);
        });
    }
});

document.addEventListener('click', function(event) {
    const datasetList = document.getElementById('datasetList');
    const searchInput = document.getElementById('searchInput');

    if (!searchInput.contains(event.target) && !datasetList.contains(event.target)) {
        datasetList.style.display = 'none';
    }
});

populateList();