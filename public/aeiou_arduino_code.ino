#include<Wire.h>
const int MPU_addr=0x68;  // I2C address of the MPU-6050
int16_t AcX,AcY,AcZ,Tmp,GyX,GyY,GyZ;

#include <NewPing.h>

#define TRIGGER_PIN  12  // Arduino pin tied to trigger pin on the ultrasonic sensor.
#define ECHO_PIN     11  // Arduino pin tied to echo pin on the ultrasonic sensor.
#define MAX_DISTANCE 200 // Maximum distance we want to ping for (in centimeters). Maximum sensor distance is rated at 400-500cm.
NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE); // NewPing setup of pins and maximum distance.

void setup() {
  Wire.begin();
  Wire.beginTransmission(MPU_addr);
  Wire.write(0x6B);  // PWR_MGMT_1 register
  Wire.write(0);     // set to zero (wakes up the MPU-6050)
  Wire.endTransmission(true);
  Serial.begin(115200);
}

void loop() {
  unsigned int uS = sonar.ping(); // Send ping, get ping time in microseconds (uS).

  int b1 = uS >> 7;
  int b2 = uS & 127;

  Serial.write(b1);
  Serial.write(b2);

  Wire.beginTransmission(MPU_addr);
  Wire.write(0x3B);  // starting with register 0x3B (ACCEL_XOUT_H)
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_addr,14,true);  // request a total of 14 registers
  AcX=Wire.read()<<8|Wire.read();  // 0x3B (ACCEL_XOUT_H) & 0x3C (ACCEL_XOUT_L)    
  AcY=Wire.read()<<8|Wire.read();  // 0x3D (ACCEL_YOUT_H) & 0x3E (ACCEL_YOUT_L)
  AcZ=Wire.read()<<8|Wire.read();  // 0x3F (ACCEL_ZOUT_H) & 0x40 (ACCEL_ZOUT_L)
//  Tmp=Wire.read()<<8|Wire.read();  // 0x41 (TEMP_OUT_H) & 0x42 (TEMP_OUT_L)
//  GyX=Wire.read()<<8|Wire.read();  // 0x43 (GYRO_XOUT_H) & 0x44 (GYRO_XOUT_L)
//  GyY=Wire.read()<<8|Wire.read();  // 0x45 (GYRO_YOUT_H) & 0x46 (GYRO_YOUT_L)
//  GyZ=Wire.read()<<8|Wire.read();  // 0x47 (GYRO_ZOUT_H) & 0x48 (GYRO_ZOUT_L)

  AcX = (AcX + 32767) / 4;
  AcY = (AcY + 32767) / 4;

  int AcX_b1 = AcX >> 7;
  int AcX_b2 = AcX & 127;

  int AcY_b1 = AcY >> 7;
  int AcY_b2 = AcY & 127;
  
//  Serial.print("AcX = "); Serial.print(AcX);
//  Serial.print(" | AcY = "); Serial.println(AcY);
//  int AcX_b1 = AcX >> 10;
//  int AcX_b2 = (AcX >> 4) & 63;
//  int AcX_b3 = AcX & 15;
  Serial.write(AcX_b1);
  Serial.write(AcX_b2);
//  Serial.write(AcX_b3);
//  int AcY_b1 = AcY >> 10;
//  int AcY_b2 = (AcY >> 4) & 63;
//  int AcY_b3 = AcY & 15;
//  Serial.print("AcY_b1 = "); Serial.println(AcY_b1);
  Serial.write(AcY_b1);
  Serial.write(AcY_b2);
//  Serial.write(AcY_b3);

  Serial.write(255); // out of the range of the 

  delay(50);  // Wait 500ms between pings (about 2 pings/sec). 29ms should be the shortest delay between pings.
}
