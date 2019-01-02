rem start influxdb container
rem docker run -p 8086:8086 -v /docker/influxdb:/var/lib/influxdb influxdb

rem env should be set in setenv.bat located at JMETER_HOME
setlocal
set "HEAP=-Xms1g -Xmx2g -XX:MaxMetaspaceSize=256m"

C:\jmeter\bin\jmeter.bat -n -t C:\DC_L\project\UCSD-Planner-Helper\loadtest\scripts\SDScheduleDBTest.jmx -l C:\DC_L\project\UCSD-Planner-Helper\loadtest\output\SDSDBTresult.jtl -o C:\DC_L\project\UCSD-Planner-Helper\loadtest\output\report -e -Jthreads=1500 -Jrampup=200 -Jloops=5 -Jhost=localhost -Jport=22125

rem it seems that JMeter will creat a log file in the directory where the command is executed