import psycopg2
from psycopg2 import sql
import psycopg2.extras
import json
import os

conn = psycopg2.connect(
    dbname="LoRaProject ",
    user="postgres",
    password="admin",
    host="localhost",
    port="5432"
)

# cur = conn.cursor()
cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

def insert_data(data):
    for i in range(len(data['timestamps']) - 1):
        cur.execute(
            sql.SQL("INSERT INTO environmental_data (timestamp, air_temperature, soil_temperature, air_humidity, soil_moisture, solar_intensity, pressure, AQI, TVOC, CO2, wind_speed, particles_2_5u, particles_5u, particles_10u) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"),
            (
                data['timestamps'][i],
                data['air_temperature'][i] if i < len(data['air_temperature']) else None,
                data['soil_temperature'][i] if i < len(data['soil_temperature']) else None,
                data['air_humidity'][i] if i < len(data['air_humidity']) else None,
                data['soil_moisture'][i]if i < len(data['soil_moisture']) else None,
                data['solar_intensity'][i] if i < len(data['solar_intensity']) else None,
                data['pressure'][i] if i < len(data['pressure']) else None,
                data['AQI'][i] if i < len(data['AQI']) else None,
                data['TVOC'][i] if i < len(data['TVOC']) else None,
                data['CO2'][i] if i < len(data['CO2']) else None,
                data['wind_speed'][i] if i < len(data['wind_speed']) else None,
	            data['particles_2.5u'][i] if i < len(data['particles_2.5u']) else None,
                data['particles_5u'][i] if i < len(data['particles_5u']) else None,
                data['particles_10u'][i] if i < len(data['particles_10u']) else None,                
            )
        )
    conn.commit()

def read_data():
    cur.execute("SELECT * FROM environmental_data;")
    rows = cur.fetchall()
    for row in rows:
        print(row)
        #print(f"{row['timestamp']} {row['air_temperature']}")

# scriptDir = os.path.dirname(os.path.abspath(__file__))
# dataPath = os.path.join(scriptDir, 'sensor_data.json')
# with open(dataPath, 'r') as file:
#     data = json.load(file)

# insert_data(data)
read_data()

cur.close()
conn.close()