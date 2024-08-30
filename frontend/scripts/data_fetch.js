async function fetchData(filePath) {
    try {
        const response = await fetch(filePath);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchDataFormServer() { 
    return await fetchData('http://localhost:3000/data');
} 

async function fetchSettingsFormServer() { 
    return await fetchData('http://localhost:3000/settings');
} 

async function fetchDataDb(filePath, { startDate, endDate, columns }) {
    try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);
        if (columns) queryParams.append('columns', columns.join(','));

        const response = await fetch(`${filePath}?${queryParams.toString()}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}