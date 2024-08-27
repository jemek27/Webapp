import serial
import time
import json

timeBetweenCommends = 1


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
        
def processResponse(response):
    readingData = True
    parts = response.split('"')
    extracted = parts[1::2]
    print(extracted) 
    if len(extracted) == 1:
        settingsPath = '../backend/my-backend/sensor_settings.json'
        dataPath = '../backend/my-backend/sensor_data.json'
        try: 
            asciiString = bytes.fromhex(extracted[0]).decode('utf-8')
            print(f"Translated: {asciiString}")
            if asciiString == 'yo':
                print('Roger')
            elif asciiString[0] == 's':
                partedString = asciiString.split(' ')
                if len(partedString) > 1:
                    currentSleepTime = int(partedString[1])
                    print('GO to sleep for: ')  
                    print(f'Curr sleep: {currentSleepTime}')  
                
                    with open(settingsPath, 'r') as file:
                        data = json.load(file)
                        signalIntervals = data.get("SignalIntervals")
                        print("SignalIntervals:", signalIntervals)
                    if currentSleepTime != int(signalIntervals):
                        readingData = False
                        time.sleep(2)
                        send([signalIntervals/5])#TODO usunąć /5
            else:
                print('mmmmmm data')
                dataStrings = asciiString.split('P')  
                print(f"aaaaaaaa{dataStrings}")
                for dataString in dataStrings:
                    #float_list = [float(item) for item in dataStrings if item.strip()]
                    print(f"{dataString} {type(dataString)}") 
                    #TODO zapis danych
                    
                    with open(settingsPath, 'r') as file:
                        data = json.load(file)
                        ResetRequest = data.get("ResetRequest")
                        print("ResetRequest:", ResetRequest)
                    #TODO nie po Sleep
                    data["ResetRequest"] = 0   
                    if int(ResetRequest):    
                        readingData = False
                        time.sleep(2)
                        send(['RESET'])#TODO usunąć /5
                        with open(settingsPath, 'w') as file:
                            json.dump(data, file, indent=4)
                    
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