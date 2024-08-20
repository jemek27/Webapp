async function fetchData() {
    try {
        const response = await fetch('../test_sensor_data_temperature.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}