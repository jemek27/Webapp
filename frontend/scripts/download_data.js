    let fetchedData = [];
    let selectedColumns = [];
  
    const Checkboxes = document.querySelectorAll('.checkbox-list input[type=checkbox]');
    const selectAll = document.getElementById('select-all');


    // Uncheck all checkboxes on page load
    Checkboxes.forEach(checkbox => checkbox.checked = false);

    selectAll.addEventListener('change', () => {
        const isChecked = selectAll.checked;
        Checkboxes.forEach(checkbox => {
            if (checkbox !== selectAll) {
                checkbox.checked = isChecked;
            }
        });
        updateSelectedColumns();
    });

    // Update selected columns based on checked boxes
    Checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedColumns);
    });

    function updateSelectedColumns() {
        selectedColumns = ['timestamp']; // Reset and add timestamp
        Checkboxes.forEach(box => {
            if (box.checked && box !== selectAll) {
                selectedColumns.push(box.value);
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
            const data = await fetchDeviceAndEnVData({
                startDate: start.toISOString(),
                endDate: end.toISOString(),
                columns: selectedColumns
            });
            
            displayDataOnPage(data);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });

    function displayDataOnPage(data) {
        fetchedData = data;
        const tableBody = document.getElementById('data-table').querySelector('tbody');
        const tableHead = document.getElementById('data-table').querySelector('thead');

        tableBody.innerHTML = '';
        tableHead.innerHTML = '<tr><th>Timestamp</th></tr>';
    
        selectedColumns.slice(1).forEach(column => {
            if (column == 'battery_age') {
                column = 'battery_voltage'; //looks bad but had to do a quick fix 
            }
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