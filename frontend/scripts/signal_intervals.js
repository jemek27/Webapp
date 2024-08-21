function fetchSettings() {
    fetch('http://localhost:3000/settings')  // Użyj pełnego URL
        .then(response => {
            if (!response.ok) {  // Sprawdź, czy odpowiedź jest w porządku
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Settings:', data);
            // Możesz zaktualizować UI w zależności od danych
            // Na przykład:
            // document.getElementById('someElement').textContent = data.someField;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function handleIntervalInput() {
    document.getElementById('signalIntervalsTime').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {  
            const inputValue = parseFloat(event.target.value); 
            if (inputValue > 10) {
                document.getElementById('result').textContent = `Set interval: ${inputValue}`;

                fetch('/settings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ SignalIntervals: inputValue }),
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            }
        }
    });
}


function toggleResetText() {
    const resetText = document.getElementById('resetText');
    const isResetRequested = resetText.style.display === 'none' ? 1 : 0;
    
    resetText.style.display = isResetRequested ? 'block' : 'none';

    fetch('/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ResetRequest: isResetRequested }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

document.addEventListener('DOMContentLoaded', handleIntervalInput);
document.addEventListener('DOMContentLoaded', toggleResetText);
document.addEventListener('DOMContentLoaded', fetchSettings);
fetchSettings();
//TODO zapis w czymś i potem czujnik to odczytuje?