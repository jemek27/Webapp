const datasets = [
    { label: 'Air Temperature (°C)',                    dataKey: 'air_temperature', borderColor: 'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.2)' },
    { label: 'Soil Temperature (°C)',                   dataKey: 'soil_temperature', borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)' },
    { label: 'Humidity (%)',                            dataKey: 'air_humidity', borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.2)' },
    { label: 'Soil moisture (%)',                       dataKey: 'soil_moisture', borderColor: 'rgba(139, 69, 19, 1)', backgroundColor: 'rgba(139, 69, 19, 0.2)' },
    { label: 'Solar Intensity (lx)',                  dataKey: 'solar_intensity', borderColor: 'rgba(255, 204, 0, 1)', backgroundColor: 'rgba(255, 204, 0, 0.2)' },
    { label: 'Pressure (hPa)',                          dataKey: 'pressure', borderColor: 'rgba(153, 102, 255, 1)', backgroundColor: 'rgba(153, 102, 255, 0.2)' },
    { label: 'Air Quality Index (AQI)',                 dataKey: 'aqi', borderColor: 'rgba(255, 159, 64, 1)', backgroundColor: 'rgba(255, 159, 64, 0.2)' },
    { label: 'Total Volatile Organic Compounds (TVOC)', dataKey: 'tvoc', borderColor: 'rgba(34, 202, 236, 1)', backgroundColor: 'rgba(34, 202, 236, 0.2)' },
    { label: 'CO2 (ppm)',                               dataKey: 'co2', borderColor: 'rgba(255, 99, 71, 1)', backgroundColor: 'rgba(255, 99, 71, 0.2)' },
    { label: 'Wind Speed (m/s)',                        dataKey: 'wind_speed', borderColor: 'rgba(0, 123, 255, 1)', backgroundColor: 'rgba(0, 123, 255, 0.2)' },
    { label: 'Particles 2.5µm (µg/m³)',                 dataKey: 'particles_2_5u', borderColor: 'rgba(192, 57, 43, 1)', backgroundColor: 'rgba(192, 57, 43, 0.2)' },
    { label: 'Particles 5µm (µg/m³)',                   dataKey: 'particles_5u', borderColor: 'rgba(39, 174, 96, 1)', backgroundColor: 'rgba(39, 174, 96, 0.2)' },
    { label: 'Particles 10µm (µg/m³)',                  dataKey: 'particles_10u', borderColor: 'rgba(241, 196, 15, 1)', backgroundColor: 'rgba(241, 196, 15, 0.2)' }
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
    end = new Date();
    end.setDate(end.getDate() + 1) // we want to include the end date <start, end>

    fetchDataFromDB({
        startDate: (new Date(0)).toISOString(),
        endDate: (end).toISOString(),
        columns: ['timestamp', selectedDataset.dataKey]
    }).then(data => {
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
        start = startDate ? new Date(startDate) : new Date(0);
        end = endDate ? new Date(endDate) : new Date();
        end.setDate(end.getDate() + 1) // we want to include the end date <start, end>

        fetchDataFromDB({
            startDate: (start).toISOString(),
            endDate: (end).toISOString(),
            columns: ['timestamp', selectedDataset.dataKey]
        }).then(data => {
            chartInstance = createChart(data, selectedDataset.label, [selectedDataset], 'detailedChart', chartInstance);
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