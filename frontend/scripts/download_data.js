    let fetchedData = [];
    let selectedColumns = [];
    let selectedEnvironmentalColumns = [];
    let selectedDeviceColumns = [];

    const environmentalCheckboxes = document.querySelectorAll('#environmental-checkboxes input[type=checkbox]');
    const selectAll = document.getElementById('select-all');

    const deviceCheckboxes = document.querySelectorAll('#device-checkboxes input[type=checkbox]');

    // Uncheck all checkboxes on page load
    environmentalCheckboxes.forEach(checkbox => checkbox.checked = false);
    deviceCheckboxes.forEach(checkbox => checkbox.checked = false);


    selectAll.addEventListener('change', () => {
        const isChecked = selectAll.checked;
        environmentalCheckboxes.forEach(checkbox => {
            if (checkbox !== selectAll) {
                checkbox.checked = isChecked;
            }
        });
        updateSelectedEnvironmentalColumns();
        deviceCheckboxes.forEach(checkbox => {
            if (checkbox !== selectAll) {
                checkbox.checked = isChecked;
            }
        });
        updateSelectedDeviceColumns();
    });

    // Update selected environmental columns based on checked boxes
    environmentalCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedEnvironmentalColumns);
    });

    // Update selected device columns based on checked boxes
    deviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedDeviceColumns);
    });

    function updateSelectedEnvironmentalColumns() {
        selectedEnvironmentalColumns = ['timestamp']; // Reset and add timestamp
        environmentalCheckboxes.forEach(box => {
            if (box.checked && box !== selectAll) {
                selectedEnvironmentalColumns.push(box.value);
            }
        });
    }

    function updateSelectedDeviceColumns() {
        selectedDeviceColumns = ['timestamp']; // Reset and add timestamp
        deviceCheckboxes.forEach(box => {
            if (box.checked && box !== selectAll) {
                selectedDeviceColumns.push(box.value);
            }
        });
    }

    document.getElementById('fetch-all-data').addEventListener('click', async () => {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        end.setDate(end.getDate() + 1); // Include the end date <start, end>

        try {
            // Fetch environmental data
            const dataEnv = await fetchDataFromDB({
                startDate: start.toISOString(),
                endDate: end.toISOString(),
                columns: selectedEnvironmentalColumns
            });

            // Fetch device data
            const dataDevice = await fetchDeviceDataFromDB({
                startDate: start.toISOString(),
                endDate: end.toISOString(),
                columns: selectedDeviceColumns
            });

            
            const mergeData = mergeDataByTimestamp(dataEnv, dataDevice);

            displayDataOnPage(mergeData);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });

    function mergeDataByTimestamp(dataEnv, dataDevice) {
        const mergedData = [];
    
        // Map environmental data by timestamp
        const dataEnvMap = dataEnv.reduce((map, item) => {
            map[item.timestamp] = item;
            return map;
        }, {});
    
        // Create a Set of unique timestamps from both datasets
        const allTimestamps = new Set([...dataEnv.map(item => item.timestamp), ...dataDevice.map(item => item.timestamp)]);
    
        // Merge data by timestamp
        allTimestamps.forEach(timestamp => {
            const envRow = dataEnvMap[timestamp] || {}; // Environmental row or empty object if not present
            const deviceRow = dataDevice.find(deviceRow => deviceRow.timestamp === timestamp) || {}; // Find corresponding device row
    
            // Merge rows, adding null for missing fields
            const mergedRow = {};
    
            // Merge environmental data fields, assigning null for missing values
            Object.keys(dataEnvMap[timestamp] || {}).forEach(key => {
                mergedRow[key] = envRow[key] ?? null;
            });
    
            // Merge device data fields, assigning null for missing values
            Object.keys(deviceRow).forEach(key => {
                mergedRow[key] = deviceRow[key] ?? null;
            });
    
            mergedRow.timestamp = timestamp; // Ensure timestamp is added
    
            mergedData.push(mergedRow);
        });
    
        return mergedData;
    }


    function displayDataOnPage(data) {
        fetchedData = data;
        const tableBody = document.getElementById('data-table').querySelector('tbody');
        const tableHead = document.getElementById('data-table').querySelector('thead');

        // Clear previous data
        tableBody.innerHTML = '';
        tableHead.innerHTML = '<tr><th>Timestamp</th></tr>';

        // Dynamically add table headers based on selected columns
        selectedColumns = [...selectedEnvironmentalColumns, ...selectedDeviceColumns].filter((v, i, a) => a.indexOf(v) === i); // Merge both columns and remove duplicates
        selectedColumns.slice(1).forEach(column => {
            const th = document.createElement('th');
            th.textContent = column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            tableHead.querySelector('tr').appendChild(th);
        });

        // Populate table rows
        data.forEach(row => {
            const tr = document.createElement('tr');
            let rowHTML = `<td>${row.timestamp}</td>`;
            selectedColumns.slice(1).forEach(column => {
                rowHTML += `<td>${row[column]}</td>`;
            });
            tr.innerHTML = rowHTML;
            tableBody.appendChild(tr);
        });
    }



    function formatDate(timestamp) {
        console.log(timestamp)
        const date = new Date(timestamp);
        return date.toISOString().slice(0, 10); // Zwraca format 'YYYY-MM-DD'
    }


    function getDateRange() {
        const timestamps = fetchedData.map(row => new Date(row.timestamp));
        const minDate = new Date(Math.min(...timestamps));
        const maxDate = new Date(Math.max(...timestamps));
        return `${formatDate(minDate)}_to_${formatDate(maxDate)}`;
    }

    function downloadFile(data, fileName, fileType) {
        const blob = new Blob([data], { type: fileType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }

    document.getElementById('download-json').addEventListener('click', () => {
        if (fetchedData && fetchedData.length > 0) {
            const dateRange = getDateRange();
            downloadFile(JSON.stringify(fetchedData, null, 2), `data_${dateRange}.json`, 'application/json');
        } else {
            alert('No data to download. Fetch some data first.');
        }
    });

    document.getElementById('download-csv').addEventListener('click', () => {
        if (fetchedData && fetchedData.length > 0) {
            const headers = selectedColumns.join(',');
            const rows = fetchedData.map(row => {
            return selectedColumns.map(col => row[col] ?? '').join(',');
        });
            const csvData = [headers, ...rows].join('\n');
            const dateRange = getDateRange();
            downloadFile(csvData, `data_${dateRange}.csv`, 'text/csv');
        } else {
            alert('No data to download. Fetch some data first.');
        }
    });
