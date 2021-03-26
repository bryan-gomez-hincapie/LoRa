#include <SPI.h>
#include <RH_RF95.h>
#include <Console.h>
#include <Process.h>
#include <HttpClient.h>
#define BAUDRATE 115200
RH_RF95 rf95;

float frequency = 868.0;

char DeviceID[20]="\0"; 
char lon[20]="\0";           //Storage longtitude
char lat[20]="\0";           //Storage latitude
char alt[20]="\0";           //Storage altitude

void getTimeStamp();     
void receivepacket();    
void run_send_gps_data();

void setup()
{ 
    Bridge.begin(BAUDRATE);
    Console.begin(); 
    while (!Console) ;
    Console.println("Start Sketch");
    if (!rf95.init())
        Console.println("Starting LoRa failed!");
    ;
    rf95.setFrequency(frequency);
    rf95.setSpreadingFactor(7);
    rf95.setSignalBandwidth(125E3);
    rf95.setCodingRate4(5);
    rf95.setTxPower(20,false);
  
    Console.println("Ready to receive!");
}
void loop()
{                                  
    receivepacket();
}

void run_send_gps_data() {
  Process p;
  p.begin("send_gps_data.sh");
  p.addParameter("-d");
  p.addParameter(DeviceID);
  p.addParameter("-l"); 
  p.addParameter(lat);
  p.addParameter("-n"); 
  p.addParameter(lon);
  p.addParameter("-a"); 
  p.addParameter(alt);
  p.run();
}

void receivepacket() {
   if (rf95.available())
  {
    int i = 0,j=0,code[4];
    int m1=0,m2=0,m3=0,m4=0;   
    uint8_t buf[50];
    char message[50]="\0";
    uint8_t len = sizeof(buf);
    if (rf95.recv(buf, &len)){
      strcpy(message,(char *)buf);
      while(i<50)
      {
      if(message[i]==',')
      {
        code[j]=i;
        j++;
        }
        i++;
      }
    }
    for(int k=0;k<code[0];k++)
    {
      lon[m1]=message[k];//get longtitude
      m1++;
    }
     for(int k=code[0]+1;k<code[1];k++)
    {
      lat[m2]=message[k];//get latitude
      m2++;
    }
     for(int k=code[1]+1;k<code[2];k++)
    {
      alt[m3]=message[k];//get altitude
      m3++;
    }
    for(int k=code[2]+1;k<code[3];k++)
    {
      DeviceID[m4]=message[k];//get  DeviceID
      m4++;
    }
    run_send_gps_data();
    double rssi = rf95.lastRssi();
    double snr = rf95.lastSNR();

    //Node
//    String dataString = "http://45.5.188.200:5001/post/";
//    dataString += lat;
//    dataString += "/";
//    dataString += lon;
//    dataString += "/";
//    dataString += rssi;
//    dataString += "/";
//    dataString += snr;
//    //Nombre del gateway
//    dataString += "/prueba";
//    dataString += "/";
//    dataString += frequency;

    //Python
    //Nombre del gateway
    String gate = "PRUEBA";
    
    String dataString = "http://45.5.188.200:5000/lora-post?latitud=";
    dataString += lat;
    dataString += "&longitud=";
    dataString += lon;
    dataString += "&rssi=";
    dataString += rssi;
    dataString += "&snr=";
    dataString += snr;
    dataString += "&frec=";
    dataString += frequency;
    dataString += "&gate=";
    dataString += gate;

    Console.println(dataString);

    Process p;
    p.begin("curl");
    p.addParameter("-k");
    p.addParameter(dataString);
    p.run();
    
    //Fin
    
    uint8_t data[] = "Gateway receive GPS data";
    rf95.send(data, sizeof(data));
    rf95.waitPacketSent();
  }
}