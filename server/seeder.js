const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');
const Category = require('./models/Category');

// Removed img and pimg as they are no longer needed for base product images
// const img = (q) => `https://source.unsplash.com/400x400/?${encodeURIComponent(q)},electronics`;
const wimg = (path) => `https://upload.wikimedia.org/wikipedia/commons/${path}`;
const mimg = (path) => `https://cdn.shopify.com/s/files/1/0065/1486/8295/products/${path}`; // Example manufacturer image host
const CAT_COLORS = {
  arduino:'1a237e/ffffff','esp32-esp8266':'e65100/ffffff',sensors:'1b5e20/ffffff',
  modules:'4a148c/ffffff','robotics-kits':'880e4f/ffffff',components:'b71c1c/ffffff',
  'raspberry-pi':'ad1457/ffffff',tools:'263238/ffffff',displays:'1565c0/ffffff','iot-devices':'283593/ffffff',
};
// pimg is now only used for variants if no real image is available
const pimg = (name, cat) => {
  const col = CAT_COLORS[cat] || '333333/ffffff';
  return `https://placehold.co/400x400/${col}?text=${encodeURIComponent(name.substring(0, 16))}`;
};


// ── Category definitions ───────────────────────────────────────────────────
const CAT_DEFS = [
  { name: 'Arduino',        slug: 'arduino',         icon: '🔵', description: 'Arduino boards, shields and accessories' },
  { name: 'ESP32 / WiFi',   slug: 'esp32-esp8266',   icon: '📡', description: 'ESP32, ESP8266 WiFi and BLE modules' },
  { name: 'Sensors',        slug: 'sensors',          icon: '🌡️', description: 'Temperature, IR, ultrasonic, humidity sensors' },
  { name: 'Modules',        slug: 'modules',          icon: '📦', description: 'Relay, RTC, GPS, Bluetooth, display modules' },
  { name: 'Robotics Kits',  slug: 'robotics-kits',   icon: '🤖', description: 'Robot kits, chassis, motor drivers, servos' },
  { name: 'Components',     slug: 'components',       icon: '⚡', description: 'Resistors, capacitors, LEDs, transistors' },
  { name: 'Raspberry Pi',   slug: 'raspberry-pi',    icon: '🍓', description: 'Raspberry Pi boards, HATs and accessories' },
  { name: 'Tools',          slug: 'tools',            icon: '🔧', description: 'Soldering, multimeters, oscilloscopes, test equipment' },
  { name: 'Displays',       slug: 'displays',         icon: '🖥️', description: 'OLED, LCD, TFT, e-ink displays' },
  { name: 'IoT Devices',    slug: 'iot-devices',      icon: '🌐', description: 'IoT nodes, LoRa, Zigbee, smart home modules' },
];

// ── Base product templates per category ───────────────────────────────────
const BASES = {
  arduino: [
    { name:'Arduino Uno R3', price:799, dp:649, brand:'Arduino', images: [{ url: wimg('3/38/Arduino_Uno_-_R3.jpg'), alt: 'Arduino Uno R3' }, { url: mimg('arduino-uno-r3-top.jpg'), alt: 'Arduino Uno R3 Top View' }], tags:['uno','beginner'] },
    { name:'Arduino Nano V3', price:499, dp:379, brand:'Arduino', images: [{ url: wimg('d/d0/Arduino_Nano_V3.0.jpg'), alt: 'Arduino Nano V3' }, { url: mimg('arduino-nano-v3-pinout.jpg'), alt: 'Arduino Nano V3 Pinout' }], tags:['nano','small'] },
    { name:'Arduino Mega 2560', price:1299, dp:999, brand:'Arduino', images: [{ url: wimg('6/6a/Arduino_Mega_2560_R3.jpg'), alt: 'Arduino Mega 2560' }, { url: mimg('arduino-mega-2560-front.jpg'), alt: 'Arduino Mega 2560 Front' }], tags:['mega','advanced'] },
    { name:'Arduino Pro Mini 5V', price:349, dp:279, brand:'Arduino', images: [{ url: wimg('f/f1/Arduino_Pro_Mini.jpg'), alt: 'Arduino Pro Mini 5V' }, { url: mimg('arduino-pro-mini-back.jpg'), alt: 'Arduino Pro Mini Back' }], tags:['promini'] },
    { name:'Arduino Leonardo', price:1099, dp:849, brand:'Arduino', images: [{ url: wimg('c/c4/Arduino_Leonardo.jpg'), alt: 'Arduino Leonardo' }, { url: mimg('arduino-leonardo-usb.jpg'), alt: 'Arduino Leonardo USB' }], tags:['hid','usb'] },
    { name:'Arduino Due', price:1999, dp:1649, brand:'Arduino', images: [{ url: wimg('b/b7/Arduino_Due.jpg'), alt: 'Arduino Due' }, { url: mimg('arduino-due-32bit.jpg'), alt: 'Arduino Due 32-bit' }], tags:['32bit','sam3x'] },
    { name:'Arduino Micro', price:799, dp:629, brand:'Arduino', images: [{ url: wimg('e/e1/Arduino_Micro.jpg'), alt: 'Arduino Micro' }, { url: mimg('arduino-micro-board.jpg'), alt: 'Arduino Micro Board' }], tags:['micro','usb'] },
    { name:'Arduino MKR WiFi 1010', price:3499, dp:2999, brand:'Arduino', images: [{ url: mimg('arduino-mkr-wifi-1010.jpg'), alt: 'Arduino MKR WiFi 1010' }, { url: mimg('arduino-mkr-wifi-1010-iot.jpg'), alt: 'Arduino MKR WiFi 1010 IoT' }], tags:['wifi','iot'] },
  ],
  'esp32-esp8266': [
    { name:'ESP32 Dev Board (38-pin)', price:399, dp:299, brand:'Espressif', images: [{ url: wimg('2/27/ESP32_Espressif_ESP-WROOM-32_Dev_Board.jpg'), alt: 'ESP32 Dev Board' }, { url: mimg('esp32-dev-board-pinout.jpg'), alt: 'ESP32 Dev Board Pinout' }], tags:['esp32','wifi','bt'] },
    { name:'ESP8266 NodeMCU V3', price:249, dp:189, brand:'LoLin', images: [{ url: wimg('c/c7/NodeMCU_ESP8266_V3.jpg'), alt: 'ESP8266 NodeMCU V3' }, { url: mimg('nodemcu-v3-wifi.jpg'), alt: 'NodeMCU V3 WiFi' }], tags:['esp8266','wifi'] },
    { name:'ESP32-CAM Module', price:599, dp:449, brand:'AI-Thinker', images: [{ url: mimg('esp32-cam-module.jpg'), alt: 'ESP32-CAM Module' }, { url: mimg('esp32-cam-module-ai-thinker.jpg'), alt: 'ESP32-CAM AI-Thinker' }], tags:['camera','vision'] },
    { name:'ESP32 WROOM-32 Module', price:299, dp:229, brand:'Espressif', images: [{ url: wimg('e/e9/ESP32-WROOM-32_module.jpg'), alt: 'ESP32 WROOM-32 Module' }, { url: mimg('esp32-wroom-32-smd.jpg'), alt: 'ESP32 WROOM-32 SMD' }], tags:['wroom','smd'] },
    { name:'ESP32-S3 Dev Board', price:699, dp:549, brand:'Espressif', images: [{ url: mimg('esp32-s3-dev-board.jpg'), alt: 'ESP32-S3 Dev Board' }, { url: mimg('esp32-s3-usb-c.jpg'), alt: 'ESP32-S3 USB-C' }], tags:['s3','usb'] },
    { name:'Wemos D1 Mini (ESP8266)', price:199, dp:149, brand:'Wemos', images: [{ url: wimg('e/e6/Wemos_D1_Mini.jpg'), alt: 'Wemos D1 Mini' }, { url: mimg('wemos-d1-mini-esp8266.jpg'), alt: 'Wemos D1 Mini ESP8266' }], tags:['mini','small'] },
    { name:'ESP32-C3 SuperMini', price:299, dp:229, brand:'Espressif', images: [{ url: mimg('esp32-c3-supermini.jpg'), alt: 'ESP32-C3 SuperMini' }, { url: mimg('esp32-c3-risc-v.jpg'), alt: 'ESP32-C3 RISC-V' }], tags:['c3','risc-v'] },
    { name:'ESP32 LoRa Dev Board', price:1099, dp:849, brand:'TTGO', images: [{ url: mimg('ttgo-esp32-lora-board.jpg'), alt: 'ESP32 LoRa Dev Board' }, { url: mimg('ttgo-esp32-lora-iot.jpg'), alt: 'ESP32 LoRa IoT' }], tags:['lora','iot'] },
  ],
  sensors: [
    { name:'DHT22 Temperature & Humidity Sensor', price:199, dp:149, brand:'AOSONG', images: [{ url: wimg('1/1f/DHT22_sensor.jpg'), alt: 'DHT22 Sensor' }, { url: mimg('dht22-temperature-humidity.jpg'), alt: 'DHT22 Temperature Humidity' }], tags:['temperature','humidity'] },
    { name:'DS18B20 Waterproof Temp Sensor', price:149, dp:109, brand:'Maxim', images: [{ url: mimg('ds18b20-waterproof-temp-sensor.jpg'), alt: 'DS18B20 Waterproof' }, { url: mimg('ds18b20-1wire.jpg'), alt: 'DS18B20 1-Wire' }], tags:['waterproof','1wire'] },
    { name:'HC-SR04 Ultrasonic Sensor', price:99, dp:69, brand:'Generic', images: [{ url: wimg('3/3a/HC-SR04_ultrasonic_sensor.jpg'), alt: 'HC-SR04 Ultrasonic Sensor' }, { url: mimg('hc-sr04-distance-sensor.jpg'), alt: 'HC-SR04 Distance Sensor' }], tags:['ultrasonic','distance'] },
    { name:'MPU6050 Gyro + Accelerometer', price:199, dp:149, brand:'InvenSense', images: [{ url: wimg('b/b1/MPU-6050_module.jpg'), alt: 'MPU6050 Module' }, { url: mimg('mpu6050-imu-sensor.jpg'), alt: 'MPU6050 IMU Sensor' }], tags:['gyro','accel','imu'] },
    { name:'BMP280 Pressure Sensor', price:149, dp:109, brand:'Bosch', images: [{ url: mimg('bmp280-pressure-sensor.jpg'), alt: 'BMP280 Pressure Sensor' }, { url: mimg('bmp280-altitude-sensor.jpg'), alt: 'BMP280 Altitude Sensor' }], tags:['pressure','altitude'] },
    { name:'PIR Motion Sensor HC-SR501', price:129, dp:89, brand:'Generic', images: [{ url: wimg('c/c6/HC-SR501_PIR_motion_sensor.jpg'), alt: 'PIR Motion Sensor' }, { url: mimg('hc-sr501-pir-sensor.jpg'), alt: 'HC-SR501 PIR Sensor' }], tags:['pir','motion'] },
    { name:'Soil Moisture Sensor', price:79, dp:59, brand:'Generic', images: [{ url: wimg('1/1d/Soil_moisture_sensor.jpg'), alt: 'Soil Moisture Sensor' }, { url: mimg('soil-moisture-agriculture.jpg'), alt: 'Soil Moisture Agriculture' }], tags:['soil','agriculture'] },
    { name:'MQ-2 Gas/Smoke Sensor', price:149, dp:109, brand:'Zhengzhou', images: [{ url: wimg('e/e4/MQ-2_gas_sensor.jpg'), alt: 'MQ-2 Gas Sensor' }, { url: mimg('mq2-smoke-sensor.jpg'), alt: 'MQ-2 Smoke Sensor' }], tags:['gas','smoke'] },
    { name:'IR Obstacle Sensor Module', price:79, dp:55, brand:'Generic', images: [{ url: mimg('ir-obstacle-sensor-module.jpg'), alt: 'IR Obstacle Sensor' }, { url: mimg('infrared-obstacle-sensor.jpg'), alt: 'Infrared Obstacle Sensor' }], tags:['ir','obstacle'] },
    { name:'Rain/Water Sensor', price:89, dp:65, brand:'Generic', images: [{ url: mimg('rain-water-sensor-module.jpg'), alt: 'Rain Water Sensor' }, { url: mimg('water-level-sensor.jpg'), alt: 'Water Level Sensor' }], tags:['rain','water'] },
  ],
  modules: [
    { name:'4-Channel 5V Relay Module', price:179, dp:129, brand:'Generic', images: [{ url: wimg('e/e2/4_channel_relay_module.jpg'), alt: '4-Channel Relay Module' }, { url: mimg('4-channel-5v-relay.jpg'), alt: '4-Channel 5V Relay' }], tags:['relay','switching'] },
    { name:'DS3231 RTC Module', price:149, dp:109, brand:'Maxim', images: [{ url: wimg('b/b6/DS3231_RTC_module.jpg'), alt: 'DS3231 RTC Module' }, { url: mimg('ds3231-real-time-clock.jpg'), alt: 'DS3231 Real Time Clock' }], tags:['rtc','i2c'] },
    { name:'NEO-6M GPS Module', price:499, dp:379, brand:'u-blox', images: [{ url: wimg('8/84/NEO-6M_GPS_module.jpg'), alt: 'NEO-6M GPS Module' }, { url: mimg('neo-6m-gps-location.jpg'), alt: 'NEO-6M GPS Location' }], tags:['gps','location'] },
    { name:'HC-05 Bluetooth Module', price:299, dp:229, brand:'Generic', images: [{ url: wimg('0/06/HC-05_Bluetooth_module.jpg'), alt: 'HC-05 Bluetooth Module' }, { url: mimg('hc-05-bluetooth-serial.jpg'), alt: 'HC-05 Bluetooth Serial' }], tags:['bluetooth','serial'] },
    { name:'NRF24L01 RF Transceiver', price:149, dp:109, brand:'Nordic', images: [{ url: wimg('0/02/NRF24L01_module.jpg'), alt: 'NRF24L01 RF Transceiver' }, { url: mimg('nrf24l01-2-4ghz.jpg'), alt: 'NRF24L01 2.4GHz' }], tags:['rf','2.4ghz'] },
    { name:'L298N Motor Driver Module', price:149, dp:109, brand:'ST', images: [{ url: wimg('e/e1/L298N_motor_driver_module.jpg'), alt: 'L298N Motor Driver' }, { url: mimg('l298n-motor-driver.jpg'), alt: 'L298N Motor Driver' }], tags:['motor','driver'] },
    { name:'Step Down Buck Converter (LM2596)', price:99, dp:69, brand:'Generic', images: [{ url: wimg('f/f0/LM2596_buck_converter.jpg'), alt: 'LM2596 Buck Converter' }, { url: mimg('lm2596-power-module.jpg'), alt: 'LM2596 Power Module' }], tags:['power','step-down'] },
    { name:'SD Card Module', price:79, dp:59, brand:'Generic', images: [{ url: wimg('d/d2/SD_card_module.jpg'), alt: 'SD Card Module' }, { url: mimg('sd-card-spi-storage.jpg'), alt: 'SD Card SPI Storage' }], tags:['sd','storage'] },
  ],
  'robotics-kits': [
    { name:'4WD Robot Car Chassis Kit', price:699, dp:549, brand:'Generic', images: [{ url: mimg('4wd-robot-car-chassis.jpg'), alt: '4WD Robot Car Chassis' }, { url: mimg('4wd-robot-kit.jpg'), alt: '4WD Robot Kit' }], tags:['chassis','4wd'] },
    { name:'2WD Smart Robot Starter Kit', price:999, dp:799, brand:'Elegoo', images: [{ url: mimg('elegoo-2wd-robot-kit.jpg'), alt: '2WD Smart Robot Kit' }, { url: mimg('elegoo-arduino-robot.jpg'), alt: 'Elegoo Arduino Robot' }], tags:['2wd','beginner'] },
    { name:'Robotic Arm Kit (4-DOF)', price:1499, dp:1199, brand:'Generic', images: [{ url: mimg('robotic-arm-kit-4dof.jpg'), alt: 'Robotic Arm Kit' }, { url: mimg('robotic-arm-servo.jpg'), alt: 'Robotic Arm Servo' }], tags:['arm','servo','dof'] },
    { name:'Servo Motor SG90 9g', price:99, dp:69, brand:'Tower Pro', images: [{ url: wimg('f/f4/SG90_servo_motor.jpg'), alt: 'Servo Motor SG90' }, { url: mimg('sg90-9g-servo.jpg'), alt: 'SG90 9g Servo' }], tags:['servo','9g'] },
    { name:'Geared DC Motor (BO Motor)', price:79, dp:55, brand:'Generic', images: [{ url: mimg('bo-motor-geared-dc.jpg'), alt: 'Geared DC Motor' }, { url: mimg('dc-gear-motor.jpg'), alt: 'DC Gear Motor' }], tags:['dc','gear','motor'] },
    { name:'Stepper Motor 28BYJ-48 + ULN2003', price:149, dp:109, brand:'Generic', images: [{ url: wimg('d/d2/28BYJ-48_stepper_motor.jpg'), alt: 'Stepper Motor 28BYJ-48' }, { url: mimg('28byj-uln2003-driver.jpg'), alt: '28BYJ-48 ULN2003 Driver' }], tags:['stepper','driver'] },
    { name:'Line Following Robot Kit', price:799, dp:629, brand:'Robocraze', images: [{ url: mimg('line-follower-robot-kit.jpg'), alt: 'Line Following Robot Kit' }, { url: mimg('line-follower-robot.jpg'), alt: 'Line Follower Robot' }], tags:['line','follower'] },
    { name:'Obstacle Avoiding Robot Kit', price:899, dp:699, brand:'Robocraze', images: [{ url: mimg('obstacle-avoiding-robot-kit.jpg'), alt: 'Obstacle Avoiding Robot Kit' }, { url: mimg('obstacle-avoiding-robot-arduino.jpg'), alt: 'Obstacle Avoiding Robot Arduino' }], tags:['obstacle','ir'] },
  ],
  components: [
    { name:'Resistor Kit (600pcs, 30 values)', price:149, dp:99, brand:'Generic', images: [{ url: wimg('d/d5/Resistor_kit.jpg'), alt: 'Resistor Kit' }, { url: mimg('resistor-kit-assorted.jpg'), alt: 'Assorted Resistor Kit' }], tags:['resistor','kit'] },
    { name:'Capacitor Kit (500pcs)', price:199, dp:149, brand:'Generic', images: [{ url: mimg('capacitor-kit-electrolytic.jpg'), alt: 'Capacitor Kit' }, { url: mimg('capacitor-kit-ceramic.jpg'), alt: 'Ceramic Capacitor Kit' }], tags:['capacitor','kit'] },
    { name:'LED Kit (100pcs, 5 colors)', price:99, dp:69, brand:'Generic', images: [{ url: wimg('c/c2/LED_kit.jpg'), alt: 'LED Kit' }, { url: mimg('led-kit-assorted-colors.jpg'), alt: 'Assorted LED Kit' }], tags:['led','colors'] },
    { name:'Breadboard 830 Points', price:99, dp:69, brand:'Generic', images: [{ url: wimg('c/c8/Breadboard_830_points.jpg'), alt: 'Breadboard 830 Points' }, { url: mimg('830-point-breadboard.jpg'), alt: '830 Point Breadboard' }], tags:['breadboard','prototype'] },
    { name:'Jumper Wires (120pcs M-M/M-F/F-F)', price:149, dp:99, brand:'Generic', images: [{ url: wimg('e/e1/Jumper_wires.jpg'), alt: 'Jumper Wires' }, { url: mimg('jumper-wire-kit.jpg'), alt: 'Jumper Wire Kit' }], tags:['jumper','wires'] },
    { name:'NPN Transistor BC547 (50pcs)', price:79, dp:49, brand:'ON Semi', images: [{ url: wimg('f/f7/BC547_transistor.jpg'), alt: 'BC547 Transistor' }, { url: mimg('bc547-npn-transistor.jpg'), alt: 'BC547 NPN Transistor' }], tags:['transistor','npn'] },
    { name:'LM7805 Voltage Regulator (5pcs)', price:49, dp:35, brand:'ST', images: [{ url: wimg('3/36/LM7805.jpg'), alt: 'LM7805 Voltage Regulator' }, { url: mimg('lm7805-5v-regulator.jpg'), alt: 'LM7805 5V Regulator' }], tags:['regulator','5v'] },
    { name:'Push Button Switch (20pcs)', price:59, dp:39, brand:'Generic', images: [{ url: wimg('e/e4/Push_button_switch.jpg'), alt: 'Push Button Switch' }, { url: mimg('push-button-electronics.jpg'), alt: 'Push Button Electronics' }], tags:['button','switch'] },
    { name:'PCB Universal Board (10pcs)', price:129, dp:89, brand:'Generic', images: [{ url: wimg('f/f6/Universal_PCB_board.jpg'), alt: 'Universal PCB Board' }, { url: mimg('pcb-prototype-board.jpg'), alt: 'PCB Prototype Board' }], tags:['pcb','prototype'] },
    { name:'Crystal Oscillator 16MHz (5pcs)', price:49, dp:35, brand:'Generic', images: [{ url: mimg('crystal-oscillator-16mhz.jpg'), alt: 'Crystal Oscillator 16MHz' }, { url: mimg('16mhz-crystal.jpg'), alt: '16MHz Crystal' }], tags:['crystal','oscillator'] },
  ],
  'raspberry-pi': [
    { name:'Raspberry Pi 4 Model B (4GB)', price:6999, dp:5999, brand:'Raspberry Pi', images: [{ url: wimg('e/e1/Raspberry_Pi_4_Model_B_-_Top.jpg'), alt: 'Raspberry Pi 4 Model B' }, { url: mimg('raspberry-pi-4-4gb.jpg'), alt: 'Raspberry Pi 4 4GB' }], tags:['rpi4','4gb','linux'] },
    { name:'Raspberry Pi 3 Model B+', price:4499, dp:3799, brand:'Raspberry Pi', images: [{ url: wimg('e/e1/Raspberry_Pi_3_Model_B%2B.jpg'), alt: 'Raspberry Pi 3 Model B+' }, { url: mimg('raspberry-pi-3b-plus.jpg'), alt: 'Raspberry Pi 3B+' }], tags:['rpi3','wifi','bt'] },
    { name:'Raspberry Pi Zero 2W', price:1999, dp:1649, brand:'Raspberry Pi', images: [{ url: wimg('d/d6/Raspberry_Pi_Zero_2_W.jpg'), alt: 'Raspberry Pi Zero 2W' }, { url: mimg('raspberry-pi-zero-2w-mini.jpg'), alt: 'Raspberry Pi Zero 2W Mini' }], tags:['zero','mini'] },
    { name:'Raspberry Pi Pico W', price:799, dp:599, brand:'Raspberry Pi', images: [{ url: wimg('e/e4/Raspberry_Pi_Pico_W.jpg'), alt: 'Raspberry Pi Pico W' }, { url: mimg('raspberry-pi-pico-w-rp2040.jpg'), alt: 'Raspberry Pi Pico W RP2040' }], tags:['pico','rp2040','wifi'] },
    { name:'Raspberry Pi Camera Module V2', price:1499, dp:1199, brand:'Raspberry Pi', images: [{ url: wimg('e/e5/Raspberry_Pi_Camera_Module_V2.jpg'), alt: 'Raspberry Pi Camera Module V2' }, { url: mimg('raspberry-pi-camera-8mp.jpg'), alt: 'Raspberry Pi Camera 8MP' }], tags:['camera','8mp'] },
    { name:'32GB SD Card Class 10', price:499, dp:379, brand:'SanDisk', images: [{ url: wimg('e/e7/SanDisk_Ultra_microSDHC_32GB.jpg'), alt: '32GB SD Card' }, { url: mimg('sandisk-32gb-micro-sd.jpg'), alt: 'SanDisk 32GB Micro SD' }], tags:['sdcard','storage'] },
    { name:'Pi Official 5V 3A Power Supply', price:699, dp:549, brand:'Raspberry Pi', images: [{ url: mimg('raspberry-pi-power-supply.jpg'), alt: 'Pi Official Power Supply' }, { url: mimg('raspberry-pi-usb-c-power.jpg'), alt: 'Raspberry Pi USB-C Power' }], tags:['power','usbc'] },
    { name:'Raspberry Pi GPIO HAT Breakout', price:299, dp:229, brand:'Generic', images: [{ url: mimg('raspberry-pi-gpio-hat.jpg'), alt: 'Raspberry Pi GPIO HAT' }, { url: mimg('raspberry-pi-gpio-breakout.jpg'), alt: 'Raspberry Pi GPIO Breakout' }], tags:['gpio','hat'] },
  ],
  tools: [
    { name:'60W Soldering Iron Station (Adjustable)', price:999, dp:799, brand:'Soldron', images: [{ url: mimg('60w-soldering-station.jpg'), alt: '60W Soldering Station' }, { url: mimg('adjustable-soldering-iron.jpg'), alt: 'Adjustable Soldering Iron' }], tags:['soldering','station'] },
    { name:'Digital Multimeter (Auto Range)', price:799, dp:599, brand:'Fluke', images: [{ url: wimg('c/c6/Digital_multimeter.jpg'), alt: 'Digital Multimeter' }, { url: mimg('auto-range-multimeter.jpg'), alt: 'Auto Range Multimeter' }], tags:['multimeter','meter'] },
    { name:'Desoldering Pump (Solder Sucker)', price:149, dp:109, brand:'Generic', images: [{ url: wimg('6/6a/Desoldering_pump.jpg'), alt: 'Desoldering Pump' }, { url: mimg('solder-sucker-tool.jpg'), alt: 'Solder Sucker Tool' }], tags:['desoldering','sucker'] },
    { name:'Wire Stripper & Cutter Tool', price:299, dp:229, brand:'Stanley', images: [{ url: mimg('wire-stripper-cutter.jpg'), alt: 'Wire Stripper & Cutter' }, { url: mimg('stanley-wire-tool.jpg'), alt: 'Stanley Wire Tool' }], tags:['wire','stripper'] },
    { name:'PCB Holder Third Hand Stand', price:249, dp:189, brand:'Generic', images: [{ url: wimg('0/09/Third_hand_tool.jpg'), alt: 'PCB Holder Third Hand' }, { url: mimg('pcb-holder-soldering.jpg'), alt: 'PCB Holder Soldering' }], tags:['pcb','holder'] },
    { name:'Hot Air Rework Station', price:2499, dp:1999, brand:'Atten', images: [{ url: mimg('hot-air-rework-station.jpg'), alt: 'Hot Air Rework Station' }, { url: mimg('smd-rework-station.jpg'), alt: 'SMD Rework Station' }], tags:['hot air','rework','smd'] },
    { name:'Digital Oscilloscope (DSO138)', price:1499, dp:1199, brand:'JYE Tech', images: [{ url: mimg('dso138-oscilloscope-kit.jpg'), alt: 'DSO138 Oscilloscope Kit' }, { url: mimg('digital-oscilloscope-dso138.jpg'), alt: 'Digital Oscilloscope DSO138' }], tags:['oscilloscope','scope'] },
    { name:'Breadboard Power Supply Module 5V/3.3V', price:99, dp:69, brand:'Generic', images: [{ url: wimg('1/1f/Breadboard_power_supply.jpg'), alt: 'Breadboard Power Supply' }, { url: mimg('breadboard-power-module.jpg'), alt: 'Breadboard Power Module' }], tags:['power','breadboard'] },
  ],
  displays: [
    { name:'0.96" OLED Display (I2C, SSD1306)', price:149, dp:109, brand:'Generic', images: [{ url: wimg('b/b1/0.96_inch_OLED_display.jpg'), alt: '0.96" OLED Display' }, { url: mimg('ssd1306-oled-i2c.jpg'), alt: 'SSD1306 OLED I2C' }], tags:['oled','i2c','128x64'] },
    { name:'1.8" TFT LCD Display (SPI, ST7735)', price:249, dp:189, brand:'Generic', images: [{ url: mimg('1-8-tft-lcd-display.jpg'), alt: '1.8" TFT LCD Display' }, { url: mimg('st7735-tft-color.jpg'), alt: 'ST7735 TFT Color' }], tags:['tft','spi','color'] },
    { name:'16x2 LCD (Without I2C)', price:99, dp:69, brand:'Generic', images: [{ url: wimg('6/6c/16x2_LCD_display.jpg'), alt: '16x2 LCD Display' }, { url: mimg('16x2-character-lcd.jpg'), alt: '16x2 Character LCD' }], tags:['lcd','character'] },
    { name:'16x2 LCD with I2C Backpack', price:149, dp:109, brand:'Generic', images: [{ url: wimg('1/1a/16x2_LCD_with_I2C_backpack.jpg'), alt: '16x2 LCD with I2C Backpack' }, { url: mimg('16x2-lcd-i2c-module.jpg'), alt: '16x2 LCD I2C Module' }], tags:['lcd','i2c','backpack'] },
    { name:'2.4" TFT Touch LCD (ILI9341)', price:399, dp:299, brand:'Generic', images: [{ url: mimg('2-4-tft-touch-lcd.jpg'), alt: '2.4" TFT Touch LCD' }, { url: mimg('ili9341-touch-screen.jpg'), alt: 'ILI9341 Touch Screen' }], tags:['touch','tft','ili9341'] },
    { name:'7-Segment 4-Digit Display (TM1637)', price:99, dp:69, brand:'Generic', images: [{ url: wimg('c/c8/TM1637_7-segment_display.jpg'), alt: '7-Segment 4-Digit Display' }, { url: mimg('tm1637-4-digit-display.jpg'), alt: 'TM1637 4-Digit Display' }], tags:['7segment','tm1637'] },
    { name:'2.42" OLED 128x64 (SSD1309)', price:549, dp:429, brand:'Generic', images: [{ url: mimg('2-42-oled-ssd1309.jpg'), alt: '2.42" OLED 128x64' }, { url: mimg('large-oled-display.jpg'), alt: 'Large OLED Display' }], tags:['oled','large'] },
    { name:'E-Paper 2.9" Display Module', price:699, dp:549, brand:'Waveshare', images: [{ url: mimg('e-paper-2-9-display.jpg'), alt: 'E-Paper 2.9" Display' }, { url: mimg('waveshare-epaper-low-power.jpg'), alt: 'Waveshare E-Paper Low Power' }], tags:['epaper','eink','low-power'] },
  ],
  'iot-devices': [
    { name:'LoRa SX1278 Ra-02 Module (433MHz)', price:399, dp:299, brand:'AI-Thinker', images: [{ url: wimg('d/d1/LoRa_Ra-02_module.jpg'), alt: 'LoRa SX1278 Ra-02 Module' }, { url: mimg('lora-433mhz-iot.jpg'), alt: 'LoRa 433MHz IoT' }], tags:['lora','433mhz','iot'] },
    { name:'Zigbee CC2530 Module', price:599, dp:449, brand:'Texas Instruments', images: [{ url: mimg('zigbee-cc2530-module.jpg'), alt: 'Zigbee CC2530 Module' }, { url: mimg('cc2530-wireless-module.jpg'), alt: 'CC2530 Wireless Module' }], tags:['zigbee','2.4ghz'] },
    { name:'RFID RC522 Module + Card', price:149, dp:109, brand:'MFRC522', images: [{ url: wimg('e/e9/RFID_RC522_module.jpg'), alt: 'RFID RC522 Module' }, { url: mimg('rc522-rfid-reader.jpg'), alt: 'RC522 RFID Reader' }], tags:['rfid','nfc','rc522'] },
    { name:'SIM800L GSM GPRS Module', price:599, dp:449, brand:'SIMCom', images: [{ url: wimg('b/b0/SIM800L_GSM_module.jpg'), alt: 'SIM800L GSM GPRS Module' }, { url: mimg('sim800l-gsm-sim.jpg'), alt: 'SIM800L GSM SIM' }], tags:['gsm','gprs','sim'] },
    { name:'Fingerprint Sensor Module (R307)', price:799, dp:599, brand:'ZFM', images: [{ url: mimg('fingerprint-sensor-r307.jpg'), alt: 'Fingerprint Sensor Module R307' }, { url: mimg('r307-biometric-sensor.jpg'), alt: 'R307 Biometric Sensor' }], tags:['fingerprint','biometric'] },
    { name:'Voice Recognition Module (V3)', price:399, dp:299, brand:'Elechouse', images: [{ url: mimg('voice-recognition-module-v3.jpg'), alt: 'Voice Recognition Module V3' }, { url: mimg('elechouse-voice-recognition.jpg'), alt: 'Elechouse Voice Recognition' }], tags:['voice','recognition'] },
    { name:'Smart Plug WiFi Module (Tasmota)', price:699, dp:499, brand:'Generic', images: [{ url: mimg('smart-plug-wifi-tasmota.jpg'), alt: 'Smart Plug WiFi Module Tasmota' }, { url: mimg('iot-smart-home-plug.jpg'), alt: 'IoT Smart Home Plug' }], tags:['smartplug','wifi','home'] },
    { name:'PZEM-004T Energy Meter Module', price:599, dp:449, brand:'PEACEFAIR', images: [{ url: mimg('pzem-004t-energy-meter.jpg'), alt: 'PZEM-004T Energy Meter Module' }, { url: mimg('pzem-004t-power-meter.jpg'), alt: 'PZEM-004T Power Meter' }], tags:['energy','meter','power'] },
  ],
};

// ── Variants to pad to 50+ per category ───────────────────────────────────
const SUFFIXES = [
  '', ' (Pack of 2)', ' (Pack of 5)', ' Pro', ' v2',
  ' + Headers', ' Kit', ' Module', ' Breakout Board', ' (SMD)',
  ' (DIP)', ' (With Cable)', ' Starter Pack', ' (3.3V)', ' (5V)',
  ' (Blue)', ' (Red)', ' (Black)', ' Pro Mini', ' Plus',
  ' (OEM)', ' Bundle', ' Dev Kit', ' Shield', ' HAT',
  ' (Genuine)', ' (Clone)', ' (Tested)', ' Premium', ' Combo',
  ' + Datasheet', ' (Low Power)', ' (Industrial)', ' (Waterproof)', ' (Mini)',
  ' (Nano)', ' V3', ' (Long Range)', ' (High Speed)', ' (Ultra)',
  ' (Economy)', ' 2023', ' (Latest)', ' (Upgraded)', ' (Compact)',
];

function makeProducts(catSlug, catId) {
  const bases = BASES[catSlug] || [];
  const products = [];

  bases.forEach((b, bi) => {
    const variantsPerBase = Math.ceil(55 / bases.length);
    for (let i = 0; i < variantsPerBase; i++) {
      const suf = SUFFIXES[i] || ` Variant ${i + 1}`;
      const fullName = `${b.name}${suf}`;
      const priceVar = b.price + Math.floor(i * b.price * 0.05);
      const dpVar = b.dp + Math.floor(i * b.dp * 0.04);

      // Use real images from base for first variant; cycle them for others
      let productImages;
      if (b.images && b.images.length > 0) {
        // All variants of the same base share the same real images
        productImages = b.images.map(img => ({ url: img.url, alt: `${fullName} — ${img.alt}` }));
      } else {
        // Fallback to colored placeholder if no real image (shouldn't happen)
        productImages = [{ url: pimg(fullName, catSlug), alt: fullName }];
      }

      products.push({
        name: fullName,
        // NO slug field — let mongoose pre-save hook generate it cleanly
        description: `${fullName} — a reliable ${catSlug.replace(/-/g,' ')} product by ${b.brand}. Perfect for electronics projects, IoT builds and maker enthusiasts.`,
        shortDescription: `${b.brand} ${fullName} for your electronics projects.`,
        category: catId,
        brand: b.brand,
        price: priceVar,
        discountPrice: dpVar,
        stock: 20 + (i % 40),
        images: productImages,
        tags: [...(b.tags || []), catSlug],
        featured: i === 0,
        isBestSeller: i === 0,
        isNew: i < 3,
        ratings: parseFloat((3.5 + (i % 3) * 0.4).toFixed(1)),
        numReviews: 15 + i * 7,
        soldCount: 10 + i * 5,
        applications: [catSlug, 'electronics', 'iot', 'maker'],
        isActive: true,
        specifications: [
          { key: 'Brand', value: b.brand },
          { key: 'Category', value: catSlug },
          { key: 'Variant', value: suf.trim() || 'Standard' },
        ],
      });
    }
  });

  return products.slice(0, 55);
}

// ── Main seed function ─────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🔗 Connected to MongoDB');

  if (process.argv[2] === '-d') {
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('🗑️  All data destroyed');
    process.exit(0);
  }

  // Upsert categories — use updateOne+upsert to preserve explicit slug
  const catMap = {};
  for (const c of CAT_DEFS) {
    const result = await Category.findOneAndUpdate(
      { slug: c.slug },
      { $setOnInsert: c },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    catMap[c.slug] = result._id;
    console.log(`✅ Category: ${c.name} [${c.slug}]`);
  }

  // Seed products — save individually so pre-save slug hook fires
  let total = 0;
  for (const [slug, catId] of Object.entries(catMap)) {
    await Product.deleteMany({ category: catId });
    const products = makeProducts(slug, catId);
    let saved = 0;
    for (const p of products) {
      try { await new Product(p).save(); saved++; } catch (e) { /* skip duplicate slugs */ }
    }
    total += saved;
    console.log(`📦 ${slug}: ${saved} products seeded`);
  }

  console.log(`\n🎉 Done! ${total} products seeded across ${CAT_DEFS.length} categories.`);
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });

