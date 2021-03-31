#include <SoftwareSerial.h>
#include <TinyGPS.h>
#include <SPI.h>
#include <RH_RF95.h>
TinyGPS gps;
RH_RF95 rf95;

float frequency = 868.0;

SoftwareSerial ss(3, 4); // Arduino RX, TX to conenct to GPS module.

static void smartdelay(unsigned long ms);

int LED=A0;
int LEDG=13;

String datastring1="";
String datastring2="";
String datastring3="";
uint8_t datasend[50];    //Storage  longtitude,latitude and altitude

char gps_lon[50]={"\0"};  //Storage GPS info
char gps_lat[20]={"\0"}; //Storage latitude
char gps_alt[20]={"\0"}; //Storage altitude
void setup()
{
  // initialize digital pin  as an output.
  pinMode(LED, OUTPUT);
  pinMode(LEDG, OUTPUT);
  
  // initialize both serial ports:
  Serial.begin(9600);  // Serial to print out GPS info in Arduino IDE
  ss.begin(9600);       // SoftSerial port to get GPS data. 
  while (!Serial);

   if (!rf95.init()) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }
  
  rf95.setFrequency(frequency);
  rf95.setSpreadingFactor(7);
  rf95.setSignalBandwidth(125E3);
  rf95.setCodingRate4(5);
  rf95.setTxPower(20,false);
  
  Serial.println("Ready to send!");
  Serial.println("Longitud   Latitud  Altitud");
}

void loop()
{
  float flat, flon,falt;
  unsigned long age;
  gps.f_get_position(&flat, &flon, &age);
  falt=gps.f_altitude();  //get altitude       
  flon == TinyGPS::GPS_INVALID_F_ANGLE ? 0.0 : flon, 6;
  flat == TinyGPS::GPS_INVALID_F_ANGLE ? 0.0 : flat, 6;
  falt == TinyGPS::GPS_INVALID_F_ANGLE ? 0.0 : falt, 2;
  datastring1 +=dtostrf(flat, 0, 6, gps_lat); 
  datastring2 +=dtostrf(flon, 0, 6, gps_lon);
  datastring3 +=dtostrf(falt, 0, 2, gps_alt);
  if(flon!=1000.000000)
  {
  strcat(gps_lon,",");
  strcat(gps_lon,gps_lat); 
  strcat(gps_lon,","); 
  strcat(gps_lon,gps_alt);
  strcat(gps_lon,"");
  strcpy((char *)datasend,gps_lon);
  Serial.println((char *)datasend);
  
  // send data
  rf95.send(datasend, sizeof(datasend));  
  rf95.waitPacketSent();
  
  // Now wait for a reply
  receivepacket();
      digitalWrite(LEDG, HIGH);
  }
  smartdelay(1000);
      digitalWrite(LEDG, LOW);
}

void receivepacket(){
    uint8_t indatabuf[RH_RF95_MAX_MESSAGE_LEN];
    uint8_t len = sizeof(indatabuf);
    
    if (rf95.waitAvailableTimeout(3000))
     { 
       // Should be a reply message for us now   
       if (rf95.recv(indatabuf, &len))
         {
         Serial.println((char*)indatabuf);        
         digitalWrite(LED, HIGH);
         }
         else 
         {
          digitalWrite(LED, LOW);
          Serial.println("receive failed!");
         }
    }
    else
    {
      digitalWrite(LED, LOW);
    }
}

static void smartdelay(unsigned long ms)
{
  unsigned long start = millis();
  do 
  {
    while (ss.available())
    {
      //ss.print(Serial.read());
      gps.encode(ss.read());
    }
  } while (millis() - start < ms);
}
