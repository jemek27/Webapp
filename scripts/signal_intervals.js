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

function toggleResetText() {
    const resetText = document.getElementById('resetText');
    if (resetText.style.display === 'none') {
        resetText.style.display = 'block';
    } else {
        resetText.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', handleIntervalInput);
//TODO zapis w czymś i potem czujnik to odczytuje?