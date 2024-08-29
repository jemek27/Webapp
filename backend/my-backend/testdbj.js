const { Pool } = require('pg');

// Konfiguracja połączenia z bazą danych
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'TestDB',
  password: 'admin',
  port: 5432,
});

// Funkcja zapisu danych
const insertData = async (timestamps, airTemperatures, soilTemperatures, airHumidities) => {
  const client = await pool.connect();
  try {
    for (let i = 0; i < timestamps.length; i++) {
      await client.query(
        'INSERT INTO weather_data (timestamp, air_temperature, soil_temperature, air_humidity) VALUES ($1, $2, $3, $4)',
        [timestamps[i], airTemperatures[i], soilTemperatures[i], airHumidities[i]]
      );
    }
  } finally {
    client.release();
  }
};

// Funkcja odczytu danych
const readData = async () => {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM weather_data');
    console.log(res.rows);
  } finally {
    client.release();
  }
};

// Przykładowe dane
const timestamps = [
  "2024-08-12T00:00:00Z", "2024-08-12T01:00:00Z"
  // Dodaj więcej danych tutaj
];
const airTemperatures = [16.0, 17.5];
const soilTemperatures = [15.5, 16.0];
const airHumidities = [85.0, 83.0];

// Zapis danych
insertData(timestamps, airTemperatures, soilTemperatures, airHumidities).then(() => {
  // Odczyt danych
  readData().then(() => pool.end());
});