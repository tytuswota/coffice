#include <SPI.h>
#include <MFRC522.h>
#include "coffee_maker.hpp"
#include "config.hpp"

MFRC522 rfid(RFID_SDA, RFID_RST);

String rfid_get_uid() {
  String uid;
  uid.reserve(rfid.uid.size);

  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) {
      uid += '0';
    }

    // TODO: maybe optimize this/stop using strings?
    uid += String(rfid.uid.uidByte[i], HEX);
    uid += ' ';
  }

  return uid;
}

void setup() {
  Serial.begin(9600);

  SPI.begin();
  rfid.PCD_Init();
  
  Serial.println("Coffee maker setting up...");
  coffee_maker_setup();
  Serial.println("Coffee maker running");
}

void loop() {
  if (rfid.PICC_IsNewCardPresent()) {
    if (rfid.PICC_ReadCardSerial()) {
      Serial.print("found card with uid '");
      Serial.print(rfid_get_uid());
      Serial.println("' making coffee...");
      coffee_maker_make_coffee();
    } else {
      Serial.println("rfid reading error");
    }
  }
}