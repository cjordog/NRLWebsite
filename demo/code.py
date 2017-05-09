import serial

port1 = serial.Serial(port = '/dev/ttyUSB0', baudrate = 2400)
port2 = serial.Serial(port = '/dev/ttyUSB1', baudrate = 2400, timeout = 5)

port1.write("+++A\r\n")
if("MMOKY" not in port1.readline()):
        print "error"
        exit(0)
port1.write("$HHCRW,MMCHK,0\r\n")
if("MMOKY" not in port1.readline()):
        print"error"
        exit(0)

