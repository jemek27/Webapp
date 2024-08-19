async function fetchData() {
    try {
        const response = await fetch('sensorData.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}