function handleIntervalInput() {
    document.getElementById('signalIntervalsTime').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {  
            const inputValue = parseFloat(event.target.value); 
            if (inputValue > 10) {
                document.getElementById('result').textContent = `Set interval: ${inputValue}`;
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', handleIntervalInput);
//todo zapis w czymś i potem czujnik to odczytuje?