import serial
import time
import json
import os
from datetime import datetime

import psycopg2
from psycopg2 import sql
import psycopg2.extras

import signal
import sys


conn = psycopg2.connect(
    dbname="loraproject",
    user="admin",
    password="admin",
    host="localhost",
    port="5432"
)
cur = conn.cursor()

running = True

def signal_handler(sig, frame):
    global running
    print('Signal received, shutting down...')
    running = False
    cur.close()
    ser.close()
    conn.close()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

TIME_AFTER_RESET = 15
TIME_BETWEEN_COMMENDS = 1
NUM_OF_DATA = 10


commandsInit = [
    'AT+RESET\r\n',
    'AT+MODE=TEST\r\n',
    'AT+TEST=RFCFG,868,SF12,125,12,15,14,ON,OFF,OFF\r\n',
]

commandsRX = [
    'AT+TEST=RXLRPKT\r\n'
]

commandsTX = [
    'AT+TEST=TXLRSTR,"10"\r\n'
]

def initDevice():
    for command in commandsInit:
        send_command(command)
        time.sleep(TIME_BETWEEN_COMMENDS)  
        read_response()
        time.sleep(TIME_BETWEEN_COMMENDS)

def receive(readingData):
    send_command(commandsRX[0])
    time.sleep(TIME_BETWEEN_COMMENDS)  
    read_response()
    time.sleep(TIME_BETWEEN_COMMENDS)
    while readingData:
        readingData = read_response(True)

def send(messages):
    #while True:
    for message in messages:
        send_command(f'AT+TEST=TXLRSTR,"{str(message)}"\r\n')
        time.sleep(TIME_BETWEEN_COMMENDS)  
        read_response()
        time.sleep(TIME_BETWEEN_COMMENDS*2)
    time.sleep(TIME_BETWEEN_COMMENDS)


def send_command(command):
    print(f"Sending: {command.strip()}")
    ser.write(command.encode('utf-8'))

def read_response(modeReceive = False):
    readingData = True
    try: 
        if ser.in_waiting > 0:
            response = ser.readline().decode('utf-8').strip()
            print(f"Received: {response}")
            print(f"Time: {datetime.now().isoformat(timespec='seconds')}")
            if modeReceive:
                readingData = processResponse(response)  
        else :
            time.sleep(0.1) 
    except OSError as e:
        print(f"Serial error: {e}")
        ser.close()
        time.sleep(2)
        ser.open()
    return readingData        

def controlSignals(settingsPath, partedString):
    readingData = True

    with open(settingsPath, 'r') as file:
        data = json.load(file)
        signalIntervals = data.get("SignalIntervals")
        print("SignalIntervals:", signalIntervals)
        ResetRequest = data.get("ResetRequest")
        print("ResetRequest:", ResetRequest) 
    if int(ResetRequest):    
        readingData = False
        time.sleep(2)
        send(['RESET'])
        data["ResetRequest"] = 0  
        data["SignalIntervals"] = TIME_AFTER_RESET
        with open(settingsPath, 'w') as file:
            json.dump(data, file, indent=4)
    else:
        if len(partedString) > 1:
            currentSleepTime = float(partedString[1])
            print(f'Curr sleep: {currentSleepTime}')  
            if currentSleepTime != float(signalIntervals):
                readingData = False
                time.sleep(2)
                send([signalIntervals])
    return readingData

# def menageData(dataPath, dataStrings):
#     print('mmmmmm data')
#     floatList = [float(item) for item in dataStrings if item.strip()]
#     print(floatList) 
#     if os.path.exists(dataPath):
#         with open(dataPath, 'r') as file:
#             data = json.load(file)
#     else:
#         data = {
#             "timestamps": [],                  
#             "air_temperature": [],
#             "soil_temperature": [],
#             "air_humidity": [],
#             "soil_moisture": [],
#             "solar_intensity": [],
#             "pressure": [],
#             "AQI": [],
#             "TVOC": [],
#             "CO2": [],
#             "wind_speed": [],
#             "particles_2.5u": [],
#             "particles_5u": [], 
#             "particles_10u": []
#         }
#     dataLabels = [              
#         "air_temperature",
#         "air_humidity",
#         "pressure",
#         "solar_intensity",
#         "AQI",
#         "TVOC",
#         "CO2",
#         "soil_moisture",
#         "wind_speed",
#         "soil_temperature",
#         "particles_2.5u",
#         "particles_5u", 
#         "particles_10u"
#     ]
#     data['timestamps'].append(datetime.now().isoformat(timespec='seconds'))
#     for i in range(len(floatList) - 1):
#         data[dataLabels[i]].append(floatList[i])
#     with open(dataPath, 'w') as file:
#         json.dump(data, file, indent=4)
#     print(f"Dane zostały zapisane do pliku {dataPath}.")


def insert_data(data):
    try:
        for i in range(len(data['timestamps'])):
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
        print("Data was saved")
    except Exception as e:
        print(f"Error inserting data: {e}")
        conn.rollback()

def menageDataDb(dataStrings):
    print('mmmmmm data')
    floatList = [float(item) for item in dataStrings if item.strip()]
    print(floatList) 
    data = {
        "timestamps": [],                  
        "air_temperature": [],
        "soil_temperature": [],
        "air_humidity": [],
        "soil_moisture": [],
        "solar_intensity": [],
        "pressure": [],
        "AQI": [],
        "TVOC": [],
        "CO2": [],
        "wind_speed": [],
        "particles_2.5u": [],
        "particles_5u": [], 
        "particles_10u": []
    }
    dataLabels = [              
        "air_temperature",
        "air_humidity",
        "pressure",
        "solar_intensity",
        "AQI",
        "TVOC",
        "CO2",
        "soil_moisture",
        "wind_speed",
        "soil_temperature",
        "particles_2.5u",
        "particles_5u", 
        "particles_10u"
    ]
    data['timestamps'].append(datetime.now().isoformat(timespec='seconds'))
    for i in range(len(floatList)):
        data[dataLabels[i]].append(floatList[i])

    insert_data(data)




def processResponse(response):
    readingData = True
    parts = response.split('"')
    extracted = parts[1::2]
    print(extracted) 
    if len(extracted) == 1:
        scriptDir = os.path.dirname(os.path.abspath(__file__))
        settingsPath = os.path.join(scriptDir, 'sensor_settings.json')
        dataPath = os.path.join(scriptDir, 'sensor_data.json')
        try: 
            asciiString = bytes.fromhex(extracted[0]).decode('utf-8')
            print(f"Translated: {asciiString}")

            dataStrings = asciiString.split(';')  
            print(dataStrings)
            if len(dataStrings) == NUM_OF_DATA + 1: # +1 for sleep time
                partedString = (dataStrings.pop()).split(' ')
                
                readingData = controlSignals(settingsPath, partedString)
                # menageData(dataPath, dataStrings)                
                menageDataDb(dataStrings)                
        except ValueError: 
            print("Error: The provided string is not a valid hex string.")

    return readingData


ser = serial.Serial('/dev/ttyUSB0', baudrate=9600, timeout=1)
initDevice()
while running:
    readingData = True
    receive(readingData)
    #TODO time of sensorSleep - something

cur.close()
conn.close()
ser.close()