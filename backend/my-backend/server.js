const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); 
const app = express();

const { Pool } = require('pg');
const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'loraproject',
    password: 'admin',
    port: 5432,
  });
app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/settings', (req, res) => {
    const filePath = path.join(__dirname, 'sensor_settings.json');
    const newSettings = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => { //TODO if file does not exist try making one
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

// app.post('/data', (req, res) => {
//     const filePath = path.join(__dirname, 'data.json');
//     const newData = req.body;

//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//             if (err.code === 'ENOENT') {
//                 return fs.writeFile(filePath, JSON.stringify([newData], null, 2), 'utf8', (err) => {
//                     if (err) {
//                         console.error('Error writing new file:', err);
//                         return res.status(500).json({ message: 'Error writing new file' });
//                     }
//                     console.log('Data added:', newData);
//                     res.json({ message: 'Data added successfully' });
//                 });
//             } else {
//                 console.error('Error reading file:', err);
//                 return res.status(500).json({ message: 'Error reading file' });
//             }
//         }

//         let currentData;
//         try {
//             currentData = JSON.parse(data);
//         } catch (parseErr) {
//             console.error('Error parsing JSON:', parseErr);
//             return res.status(500).json({ message: 'Error parsing JSON' });
//         }

//         // Dodaj nowe dane do istniejącej tablicy
//         currentData.push(newData);

//         fs.writeFile(filePath, JSON.stringify(currentData, null, 2), 'utf8', (err) => {
//             if (err) {
//                 console.error('Error writing file:', err);
//                 return res.status(500).json({ message: 'Error writing file' });
//             }
//             console.log('Data added:', newData);
//             res.json({ message: 'Data added successfully' });
//         });
//     });
// });

app.get('/data', (req, res) => {
    const filePath = path.join(__dirname, 'sensor_data.json');

    fs.readFile(filePath, 'utf8', (err, fileContent) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ message: 'Error reading file' });
        }

        try {
            const data = JSON.parse(fileContent);
            res.json(data);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            res.status(500).json({ message: 'Error parsing JSON' });
        }
    });
});

app.get('/dataDb', async (req, res) => {
    const { startDate, endDate, columns } = req.query;
  
    try {
      let query = 'SELECT * FROM environmental_data';
      const queryParams = [];
  
      if (startDate && endDate) {
        queryParams.push(startDate, endDate);
        query += ` WHERE timestamp >= $${queryParams.length - 1} AND timestamp <= $${queryParams.length}`;
      }
  
      // Add column filtering to the query
      if (columns) {
        const columnsArray = columns.split(',');
        query = query.replace('*', columnsArray.join(', '));
      }
  
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
