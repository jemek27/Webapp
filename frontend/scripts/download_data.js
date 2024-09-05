let fetchedData = [];
    let selectedColumns = [];
    
    const checkboxes = document.querySelectorAll('.checkbox-list input[type=checkbox]');
    const selectAllCheckbox = document.getElementById('select-all');
    
    checkboxes.forEach(checkbox => checkbox.checked = false);

    selectAllCheckbox.addEventListener('change', () => {
        const isChecked = selectAllCheckbox.checked;
        checkboxes.forEach(checkbox => {
            if (checkbox !== selectAllCheckbox) {
                checkbox.checked = isChecked;
            }
        });
    });

    // Update selected columns based on checked boxes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            selectedColumns = ['timestamp']; // reset and add timestamp
            checkboxes.forEach(box => {
                if (box.checked && box !== selectAllCheckbox) {
                    selectedColumns.push(box.value);
                }
            });
        });
    });

    document.getElementById('fetch-all-data').addEventListener('click', async () => {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        start = startDate ? new Date(startDate) : new Date(0);
        end = endDate ? new Date(endDate) : new Date();
        end.setDate(end.getDate() + 1) // we want to include the end date <start, end>

        try {  
            const data = await fetchDataFromDB({
                startDate: start.toISOString(),
                endDate: end.toISOString(),
                columns: selectedColumns
            });
            displayDataOnPage(data);
        } catch (error) {
            console.error('Error fetching all data:', error);
        }
    });

    function displayDataOnPage(data) {
        fetchedData = data;
        const tableBody = document.getElementById('data-table').querySelector('tbody');
        const tableHead = document.getElementById('data-table').querySelector('thead');
        
        // Clear previous data
        tableBody.innerHTML = '';
        tableHead.innerHTML = '<tr><th>Timestamp</th></tr>';

        // Dynamically add table headers based on selected columns
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
            downloadFile(JSON.stringify(fetchedData, null, 2), 'data.json', 'application/json');
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
            downloadFile(csvData, 'data.csv', 'text/csv');
        } else {
            alert('No data to download. Fetch some data first.');
        }
    });
