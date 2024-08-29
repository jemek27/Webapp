import psycopg2
from psycopg2 import sql

# Konfiguracja połączenia z bazą danych
conn = psycopg2.connect(
    dbname="TestDB",
    user="postgres",
    password="admin",
    host="localhost",
    port="5432"
)

cur = conn.cursor()

# Funkcja zapisu danych
def insert_data(timestamps, air_temperatures, soil_temperatures, air_humidities):
    for i in range(len(timestamps)):
        cur.execute(
            sql.SQL("INSERT INTO weather_data (timestamp, air_temperature, soil_temperature, air_humidity) VALUES (%s, %s, %s, %s)"),
            (timestamps[i], air_temperatures[i], soil_temperatures[i], air_humidities[i])
        )
    conn.commit()

# Funkcja odczytu danych
def read_data():
    cur.execute("SELECT * FROM weather_data;")
    rows = cur.fetchall()
    for row in rows:
        print(row)

# Przykładowe dane
timestamps = [ "2024-08-12T00:00:00Z", "2024-08-12T01:00:00Z"]
air_temperatures = [16.0, 17.5]
soil_temperatures = [15.5, 16.0]
air_humidities = [85.0, 83.0]

# Zapis danych
insert_data(timestamps, air_temperatures, soil_temperatures, air_humidities)

# Odczyt danych
read_data()

cur.close()
conn.close()