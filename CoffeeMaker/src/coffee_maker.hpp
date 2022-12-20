#pragma once

#include <Arduino.h>
#include <SoftwareSerial.h>

void coffee_maker_command(String command);

void coffee_maker_setup();

void coffee_maker_make_coffee();