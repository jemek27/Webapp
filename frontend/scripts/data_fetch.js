async function fetchData(filePath) {
    try {
        const response = await fetch(filePath);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchSettingsFormServer() { 
    return await fetchData('http://localhost:3000/settings');
} 

async function fetchDataDB(filePath, { startDate, endDate, columns, tableName }) {
    try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);
        if (columns) queryParams.append('columns', columns.join(','));
        if (columns) queryParams.append('tableName', tableName);

        const response = await fetch(`${filePath}?${queryParams.toString()}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchDataFromDB({ startDate, endDate, columns }) { 
    return await fetchDataDB('http://localhost:3000/data', { startDate, endDate, columns, tableName: 'environmental_data'});
} 

async function fetchDeviceDataFromDB({ startDate, endDate, columns }) { 
    return await fetchDataDB('http://localhost:3000/data', { startDate, endDate, columns, tableName: 'device_data'});
} 

async function fetchDeviceAndEnVData({ startDate, endDate, columns }) { 
    return await fetchDataDB('http://localhost:3000/dataFromAllTables', { startDate, endDate, columns, tableName: ''});
}