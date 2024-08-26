async function fetchData(filePath) {
    try {
        const response = await fetch(filePath);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
//TODO dokończyć 
function fetchSettingsFormServer() {
    fetch('http://localhost:3000/data') 
        .then(response => {
            if (!response.ok) {  
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}