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