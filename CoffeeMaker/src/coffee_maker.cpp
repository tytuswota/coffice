#include "coffee_maker.hpp"
#include <Arduino.h>
#include <SoftwareSerial.h>
#include "config.hpp"

SoftwareSerial coffee_serial(COFFEE_RX, COFFEE_TX);

void coffee_maker_command(String command) {
  Serial.print("sending command '");
  Serial.print(command);
  Serial.println('\'');

  String result;
  int bytes_read = 0;

  while (coffee_serial.available()) {
    coffee_serial.read();
  }

  command += "\r\n";
  for (int i = 0; i < command.length(); i++) {
    for (int s = 0; s < 8; s += 2) {
      char current_byte = 255;
      bitWrite(current_byte, 2, bitRead(command.charAt(i), s + 0));
      bitWrite(current_byte, 5, bitRead(command.charAt(i), s + 1));
      coffee_serial.write(current_byte);
    }
    delay(8);
  }

  int s = 0;
  char result_byte;
  while (!result.endsWith("\r\n")) {
    if (coffee_serial.available()) {
      byte current_byte = coffee_serial.read();
      bitWrite(result_byte, s + 0, bitRead(current_byte, 2));
      bitWrite(result_byte, s + 1, bitRead(current_byte, 5));
      if ((s += 2) >= 8) {
        s = 0;
        result += result_byte;
      }
    } else {
      delay(10);
    }
    if (bytes_read++ > 500) {
      Serial.print("no result received");
      Serial.print("\n\n\n");
      return;
    }
  }

  Serial.print("received result: '");
  Serial.print(result.substring(0, result.length() - 2));
  Serial.print("'\n\n\n");
}

void coffee_maker_setup() {
  coffee_serial.begin(9600);
  coffee_maker_command("AN:01");
  delay(3000);
  coffee_maker_command("FN:0D");
  delay(3000);
  coffee_maker_command("FN:0F");
}

void coffee_maker_make_coffee() {
  coffee_maker_command("FN:0D"); // throw out ground beans
  delay(3000);
  coffee_maker_command("FN:0F"); // brew group ready to accept ground beans
  delay(3000);
  coffee_maker_command("FN:09"); // start grind
  delay(3000);
  coffee_maker_command("FN:13"); // compress ground beans
  delay(3000);
  coffee_maker_command("FN:01"); // pump start
  delay(10000); // pump duration
  coffee_maker_command("FN:02"); // pump stop
  delay(3000);
  coffee_maker_command("FN:0D"); // throw out ground beans
  delay(3000);
  coffee_maker_command("FN:0F"); // brew group ready to accept ground beans
}