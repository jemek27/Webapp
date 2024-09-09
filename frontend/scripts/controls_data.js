document.addEventListener('DOMContentLoaded', function() {

    let solarIChart = null;
    let solarVChart = null;
    let chargeChart = null;
    function updateData() {
        const endDate = new Date();  
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 14);
        endDate.setDate(endDate.getDate() + 1) // we want to include the end date <start, end>

            const solarIDataset = [
                { label: 'Solar Current (A)', dataKey: 'solar_current', borderColor: 'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.2)' }
            ];
            const solarVDataset = [
                { label: 'Solar Voltage (V)', dataKey: 'solar_voltage', borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)' }
            ];
            const chargeDataset = [
                { label: 'State of Charge (%)', dataKey: 'state_of_charge', borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.2)' }
            ];
            console.log(startDate.toISOString(), endDate.toISOString() )
            fetchDeviceDataFromDB({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                columns: ['timestamp', 'solar_current', 'solar_voltage', 'state_of_charge', 'battery_age']
            }).then(data => {
                solarIChart = createChart(data, 'Solar Current (A)', solarIDataset, 'solarIChart', solarIChart);
                solarVChart = createChart(data, 'Solar Voltage (V)', solarVDataset, 'solarVChart', solarVChart);
                chargeChart = createChart(data, 'State of Charge (%)', chargeDataset, 'chargeChart', chargeChart);

                const latestRecord = data[data.length - 1];

                const batteryState = latestRecord.state_of_charge;
                const batteryStatusElement = document.getElementById('battery-status');
                const batteryStatusText = `Battery: ${batteryState}%`;
                batteryStatusElement.textContent = batteryStatusText;
                
                const batteryAge = latestRecord.battery_age; 
                const batteryAgeElement = document.getElementById('battery-age');
                const batteryAgeText = `Battery voltage: ${batteryAge}V`;
                batteryAgeElement.textContent = batteryAgeText;
            });
        }

    const resizeHints = document.querySelectorAll('.resize-hint');
    resizeHints.forEach((resizeHint) => {
        resizeHint.addEventListener('click', function() {
            const chartBox = this.closest('.chart-box');
            toggleChartSize(chartBox); 
        });
    });
    
    function toggleChartSize(chartBox) {
        chartBox.classList.toggle('chart-box-full');
        const hintElement = chartBox.querySelector('.resize-hint');
        if (chartBox.classList.contains('chart-box-full')) {
            hintElement.textContent = 'Click on bottom to shrink';
        } else {
            hintElement.textContent = 'Click on bottom to enlarge';
        }
    }

    updateData();
});
