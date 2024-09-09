const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); 
const app = express();

require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    user:       process.env.DB_USER,
    host:       process.env.DB_HOST,
    database:   process.env.DB_DATABASE,
    password:   process.env.DB_PASSWORD,
    port:       process.env.DB_PORT,
  });
app.use(cors());


const { spawn } = require('child_process');
const pythonProcess = spawn('python3', ['-u', 'lora_communication.py']);

pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing Python process');
    pythonProcess.kill('SIGINT');
    process.exit();
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing Python process');
    pythonProcess.kill('SIGTERM');
    process.exit();
});


app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

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

app.get('/data', async (req, res) => {
    const { startDate, endDate, columns, tableName } = req.query;

    try {
        
        const allowedTables = ['environmental_data', 'device_data'];
        if (!tableName || !allowedTables.includes(tableName)) {
            throw new Error('Invalid table name');
        }

        let query = `SELECT * FROM ${tableName}`;
        const queryParams = [];

        if (startDate && endDate) {
            queryParams.push(startDateUTC, endDateUTC);
            query += ` WHERE timestamp >= $${queryParams.length - 1} AND timestamp <= $${queryParams.length}`;
        }

        const allowedColumns = [ 'timestamp', 'air_temperature', 'soil_temperature', 'air_humidity',
                                 'soil_moisture', 'solar_intensity', 'pressure', 'aqi', 'tvoc', 'co2',
                                 'wind_speed', 'particles_2_5u', 'particles_5u', 'particles_10u',
                                 'solar_current', 'solar_voltage', 'state_of_charge', 'battery_age']; 
        if (columns) {
            const columnsArray = columns.split(',').map(col => col.trim());
            if (columnsArray.every(col => allowedColumns.includes(col))) {
                query = query.replace('*', columnsArray.join(', '));
            } else {
                throw new Error('Invalid column name');
            }
        }

        query += ' ORDER BY timestamp ASC';

        const result = await pool.query(query, queryParams);
        res.json(result.rows);
    } catch (error) {
        console.error('Error querying the database:', error);
        res.status(500).json({ message: 'Error querying the database' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
