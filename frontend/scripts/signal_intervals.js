function fetchSettings() {
    fetch('http://localhost:3000/settings') 
        .then(response => {
            if (!response.ok) {  
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Settings:', data);
            document.getElementById('currentSignalIntervalsTime').textContent = `Current interval time: ${data.SignalIntervals} min`;
            document.getElementById('resetText').style.display = data.ResetRequest ? 'block' : 'none';
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
                document.getElementById('intervalErrorMessage').textContent = '';

                fetch('http://localhost:3000/settings', {
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
            } else {
                document.getElementById('intervalErrorMessage').textContent = 'Interval must be greater than 10 minutes.';
            }
        }
    });
}


function toggleResetText() {
    const resetText = document.getElementById('resetText');
    const isResetRequested = resetText.style.display === 'none' ? 1 : 0;
    
    resetText.style.display = isResetRequested ? 'block' : 'none';

    fetch('http://localhost:3000/settings', {
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

document.addEventListener('DOMContentLoaded', function() {
    fetchSettings();
    handleIntervalInput();
});