const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); 
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Endpoint do aktualizacji ustawień
app.post('/settings', (req, res) => {
    const filePath = path.join(__dirname, 'sensor_settings.json');
    const newSettings = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ message: 'Error reading file' });
        }

        let currentSettings;
        try {
            currentSettings = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            return res.status(500).json({ message: 'Error parsing JSON' });
        }

        const updatedSettings = { ...currentSettings, ...newSettings };

        fs.writeFile(filePath, JSON.stringify(updatedSettings, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).json({ message: 'Error writing file' });
            }
            console.log('Settings updated:', updatedSettings);
            res.json({ message: 'Settings updated successfully' });
        });
    });
});

// Endpoint do odczytu ustawień
app.get('/settings', (req, res) => {
    const filePath = path.join(__dirname, 'sensor_settings.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ message: 'Error reading file' });
        }

        try {
            const settings = JSON.parse(data);
            res.json(settings);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            res.status(500).json({ message: 'Error parsing JSON' });
        }
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
