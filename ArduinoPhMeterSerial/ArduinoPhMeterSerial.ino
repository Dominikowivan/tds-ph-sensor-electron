
//Imports y variables para el LCD monitor

#include <Wire.h> // Library for I2C communication
#include <LiquidCrystal_I2C.h> // Library for LCD
LiquidCrystal_I2C lcd = LiquidCrystal_I2C(0x27, 20, 4); // Change to (0x27,16,2) for 16x2 LCD.


//Imports y variables para el PH Sensor

const int analogInPin = A0; 
int sensorValue = 0;  
unsigned long int avgValue; 
float b;
int buf[10],temp;


//Imports y variables para el TDS sensor

#include <EEPROM.h>
#include "GravityTDS.h"
#define TdsSensorPin A1
GravityTDS gravityTds;
float temperature = 25,tdsValue = 0;


void setup() {
  // Inicializar el LCD
  lcd.init();
  
  // Encender la luz de fondo.
  lcd.backlight();

  // Iniciar Tds Sensor
  gravityTds.setPin(TdsSensorPin);
  gravityTds.setAref(3.3);  // referencia el voltage, default 5.0V on Arduino UNO
  gravityTds.setAdcRange(1024);  //1024 for 10bit ADC;4096 for 12bit ADC
  gravityTds.begin(); 

  //init serial
  Serial.begin(9600);
}

void loop() {
  printPHValue();
  printTDSValue();
  delay(800);
}

void printPHValue(){
 
 //Obtiene 10 valores del sensado
 for(int i=0;i<10;i++) 
 { 
  buf[i]=analogRead(analogInPin);
  delay(10);
 }
 
 //Saca el average entre todos los valores
 for(int i=0;i<9;i++)   
 {
  
  for(int j=i+1;j<10;j++)
  {
   if(buf[i]>buf[j])
   {
    temp=buf[i];
    buf[i]=buf[j];
    buf[j]=temp;
   }
  }
 }
 avgValue=0;
 for(int i=2;i<8;i++)
 avgValue+=buf[i];
 

 // Convierte el valor analogo en valor de PH
 float pHVol=(float)avgValue*5.0/1024/6; //convert the analog into millivolt
 float phValue = -5.70 * pHVol + 21.34; //convert the millivolt into pH value
 float phValueAdjusted = phValue + 3; //Calibrate the PH value according to the hardware

 // Envia el LCD el valor
 
 lcd.setCursor(0, 0);
 lcd.print("PH = ");
 lcd.print(phValueAdjusted);
}


void printTDSValue(){
   
    gravityTds.setTemperature(temperature);  //setea la temperatura default
    gravityTds.update();  //Obtiene el valor de sensado
    tdsValue = gravityTds.getTdsValue();  // Consigue el valor de sensado

   // Enviar el valor al LCD
    lcd.setCursor(0, 1);
    lcd.print("TDS = ");
    lcd.print(tdsValue);
    lcd.print(" ppm");
}
