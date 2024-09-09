import psycopg2
import os
import json
from psycopg2 import sql

# Connect to PostgreSQL
def connect_db():
    return psycopg2.connect(
        dbname="loraproject",
        user="admin",
        password="admin",
        host="localhost",
        port="5432"
    )

# Function to insert data into environmental_data
def insert_environmental_data(cursor, data):
    query = """
    INSERT INTO environmental_data (
        timestamp, air_temperature, soil_temperature, air_humidity, 
        soil_moisture, solar_intensity, pressure, AQI, TVOC, CO2, 
        wind_speed, particles_2_5u, particles_5u, particles_10u
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    RETURNING id;
    """
    values = (
        data["timestamp"], data["air_temperature"], data.get("soil_temperature"), data["air_humidity"],
        data.get("soil_moisture"), data["solar_intensity"], data["pressure"], data["aqi"], data["tvoc"], 
        data["co2"], data.get("wind_speed"), data.get("particles_2_5u"), data.get("particles_5u"), data.get("particles_10u")
    )
    
    cursor.execute(query, values)
    return cursor.fetchone()[0]  # Return the id of the inserted row

# Function to insert data into device_data
def insert_device_data(cursor, data, id_env):
    query = """
    INSERT INTO device_data (
        timestamp, solar_current, solar_voltage, state_of_charge, battery_age, id_env
    ) VALUES (%s, %s, %s, %s, NULL, %s);
    """
    values = (
        data["timestamp"], data.get("solar_current"), data.get("solar_voltage"), data.get("state_of_charge"), id_env
    )
    
    cursor.execute(query, values)

# Main function to process the data
def process_data(data):    
    try:      
        id_env = insert_environmental_data(cursor, data)
        
        if "solar_current" in data and "solar_voltage" in data and "state_of_charge" in data:
            insert_device_data(cursor, data, id_env)
        
        conn.commit()
        print("Data successfully inserted!")
    
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Error: {e}")
    


conn = connect_db()
cursor = conn.cursor()

scriptDir = os.path.dirname(os.path.abspath(__file__))
dataPath = os.path.join(scriptDir, 'data_2024-08-27_to_2024-09-09.json')
with open(dataPath, 'r') as file:
    data = json.load(file)
    for record in data:
        process_data(record)

if cursor:
    cursor.close()
if conn:
    conn.close()

# # Sample data
# data1 = {
#     "timestamp": "2024-09-09T15:03:21.000Z",
#     "air_temperature": 26.7,
#     "soil_temperature": 1,
#     "air_humidity": 57.7,
#     "soil_moisture": 2,
#     "solar_intensity": 840,
#     "pressure": 969.8,
#     "aqi": 1,
#     "tvoc": 14,
#     "co2": 400,
#     "wind_speed": 1,
#     "particles_2_5u": 1,
#     "particles_5u": 1,
#     "particles_10u": 1,
#     "solar_current": 7,
#     "solar_voltage": 531.2,
#     "state_of_charge": 8.1
# }

# data2 = {
#     "timestamp": "2024-09-02T11:29:31.000Z",
#     "air_temperature": 26.4,
#     "soil_temperature": None,
#     "air_humidity": 62.6,
#     "soil_moisture": None,
#     "solar_intensity": 789.2,
#     "pressure": 988.7,
#     "aqi": 1,
#     "tvoc": 4,
#     "co2": 400,
#     "wind_speed": None,
#     "particles_2_5u": None,
#     "particles_5u": None,
#     "particles_10u": None
# }

# # Process each set of data
# process_data(data1)
# process_data(data2)
