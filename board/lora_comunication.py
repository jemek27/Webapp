import serial
import time

commandsInitRX = [
    'AT+RESET\r\n',
    'AT+MODE=TEST\r\n',
    'AT+TEST=RFCFG,868,SF12,125,12,15,14,ON,OFF,OFF\r\n',
    'AT+TEST=RXLRPKT\r\n'
]


commandsInitTX = [
    'AT+RESET\r\n',
    'AT+MODE=TEST\r\n',
    'AT+TEST=RFCFG,868,SF12,125,12,15,14,ON,OFF,OFF\r\n'
]

commands = [
    'AT+TEST=TXLRSTR,"Krzzysztofkrawczyk"\r\n'
]

def send_command(command):
    print(f"Sending: {command.strip()}")
    ser.write(command.encode('utf-8'))

def read_response():
    if ser.in_waiting > 0:
        response = ser.readline().decode('utf-8').strip()
        print(f"Received: {response}")
        parts = response.split('"')
        extracted = parts[1::2]
        print(extracted) 
        if len(extracted) == 1:
            try: 
                asciiString = bytes.fromhex(extracted[0]).decode('utf-8')
                print(f"Translated: {asciiString}")
                if asciiString == 'yo':
                    print('Roger')
                elif asciiString == 'sleep':
                    print('GO to sleep for: ')
                else:
                    print('mmmmmm data')
                    dataStrings = asciiString.split('P')  
                    for dataString in dataStrings:
                        
                        print(f"{dataString} {type(dataString)}") 
                        
            except ValueError: 
                print("Error: The provided string is not a valid hex string.")




ser = serial.Serial('/dev/ttyUSB0', baudrate=9600, timeout=1)

for command in commandsInitRX:
    send_command(command)
    time.sleep(1)  
    read_response()
    time.sleep(1)
    
while True:
    read_response()

'''

for command in commandsInitTX:
    send_command(command)
    time.sleep(1)  
    read_response()
    time.sleep(1)
    
while True:
    for command in commands:
        send_command(command)
        time.sleep(1)  
        read_response()
        time.sleep(1)
    time.sleep(7)
'''

#for x in range(100):
#    for command in commands:
#        print(f"Sending: {command.strip()}")
#        ser.write(command.encode('utf-8'))
#        time.sleep(1)


ser.close()
