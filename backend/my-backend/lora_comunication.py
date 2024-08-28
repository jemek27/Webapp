import serial
import time
import json
import os
from datetime import datetime

timeBetweenCommends = 1
numOfData = 10


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
        time.sleep(timeBetweenCommends)  
        read_response()
        time.sleep(timeBetweenCommends)

def receive(readingData):
    send_command(commandsRX[0])
    time.sleep(timeBetweenCommends)  
    read_response()
    time.sleep(timeBetweenCommends)
    while readingData:
        readingData = read_response(True)

def send(messages):
    #while True:
    for message in messages:
        send_command(f'AT+TEST=TXLRSTR,"{str(message)}"\r\n')
        time.sleep(timeBetweenCommends)  
        read_response()
        time.sleep(timeBetweenCommends*2)
    time.sleep(timeBetweenCommends)


def send_command(command):
    print(f"Sending: {command.strip()}")
    ser.write(command.encode('utf-8'))

def read_response(modeReceive = False):
    readingData = True
    if ser.in_waiting > 0:
        response = ser.readline().decode('utf-8').strip()
        print(f"Received: {response}")
        if modeReceive:
            readingData = processResponse(response)  
    else :
        time.sleep(0.1) 
    return readingData        

def controlSignals(settingsPath, partedString):
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

def menageData(dataPath, dataStrings):
    print('mmmmmm data')
    floatList = [float(item) for item in dataStrings if item.strip()]
    print(floatList) 
    if os.path.exists(dataPath):
        with open(dataPath, 'r') as file:
            data = json.load(file)
    else:
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
    data['timestamps'].append(datetime.now().isoformat())
    for i in range(len(floatList) - 1):
        data[dataLabels[i]].append(floatList[i])
    with open(dataPath, 'w') as file:
        json.dump(data, file, indent=4)
    print(f"Dane zostały zapisane do pliku {dataPath}.")
    
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
            if len(dataStrings) == numOfData + 1: # +1 for sleep time
                partedString = (dataStrings.pop()).split(' ')
                
                controlSignals(settingsPath, partedString)
                menageData(dataPath, dataStrings)                
        except ValueError: 
            print("Error: The provided string is not a valid hex string.")

    return readingData


ser = serial.Serial('/dev/ttyUSB0', baudrate=9600, timeout=1)
initDevice()
while True:
    readingData = True
    receive(readingData)
    print(f"po receive {readingData}")

ser.close()