const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const categories = [
  { name: 'Microcontrollers', slug: 'microcontrollers', icon: '🧠', order: 1 },
  { name: 'Arduino', slug: 'arduino', icon: '🔵', order: 1 },
  { name: 'ESP32 / ESP8266', slug: 'esp32-esp8266', icon: '📡', order: 2 },
  { name: 'Raspberry Pi', slug: 'raspberry-pi', icon: '🍓', order: 3 },
  { name: 'Sensors', slug: 'sensors', icon: '🌡️', order: 2 },
  { name: 'Temperature Sensors', slug: 'temperature-sensors', icon: '🌡️', order: 1 },
  { name: 'Motion Sensors', slug: 'motion-sensors', icon: '🏃', order: 2 },
  { name: 'Gas Sensors', slug: 'gas-sensors', icon: '💨', order: 3 },
  { name: 'Modules', slug: 'modules', icon: '📦', order: 3 },
  { name: 'WiFi Modules', slug: 'wifi-modules', icon: '📶', order: 1 },
  { name: 'Bluetooth Modules', slug: 'bluetooth-modules', icon: '🔵', order: 2 },
  { name: 'Components', slug: 'components', icon: '⚡', order: 4 },
  { name: 'Robotics Kits', slug: 'robotics-kits', icon: '🤖', order: 5 },
  { name: 'Tools', slug: 'tools', icon: '🔧', order: 6 },
];

const adminUser = {
  name: 'Admin User',
  email: 'admin@electromart.in',
  password: 'Admin@123',
  role: 'admin',
  phone: '9999999999',
};

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected for seeding...');
};

const seedData = async () => {
  await connectDB();
  // Clear existing
  await User.deleteMany();
  await Category.deleteMany();
  await Product.deleteMany();
  console.log('Cleared existing data');

  // Create admin
  const admin = await User.create(adminUser);
  console.log(`✅ Admin created: ${admin.email}`);

  // Create parent categories
  const [microCat, sensorCat, modulesCat, componentsCat, roboticsCat, toolsCat] = await Category.insertMany([
    { name: 'Microcontrollers', slug: 'microcontrollers', icon: '🧠', order: 1 },
    { name: 'Sensors', slug: 'sensors', icon: '🌡️', order: 2 },
    { name: 'Modules', slug: 'modules', icon: '📦', order: 3 },
    { name: 'Components', slug: 'components', icon: '⚡', order: 4 },
    { name: 'Robotics Kits', slug: 'robotics-kits', icon: '🤖', order: 5 },
    { name: 'Tools', slug: 'tools', icon: '🔧', order: 6 },
  ]);

  // Create sub-categories
  const [arduinoCat, espCat, piCat, tempCat, motionCat, gasCat, wifiCat, btCat] = await Category.insertMany([
    { name: 'Arduino', slug: 'arduino', icon: '🔵', parent: microCat._id, order: 1 },
    { name: 'ESP32 / ESP8266', slug: 'esp32-esp8266', icon: '📡', parent: microCat._id, order: 2 },
    { name: 'Raspberry Pi', slug: 'raspberry-pi', icon: '🍓', parent: microCat._id, order: 3 },
    { name: 'Temperature Sensors', slug: 'temperature-sensors', icon: '🌡️', parent: sensorCat._id, order: 1 },
    { name: 'Motion Sensors', slug: 'motion-sensors', icon: '🏃', parent: sensorCat._id, order: 2 },
    { name: 'Gas Sensors', slug: 'gas-sensors', icon: '💨', parent: sensorCat._id, order: 3 },
    { name: 'WiFi Modules', slug: 'wifi-modules', icon: '📶', parent: modulesCat._id, order: 1 },
    { name: 'Bluetooth Modules', slug: 'bluetooth-modules', icon: '🔵', parent: modulesCat._id, order: 2 },
  ]);

  console.log('✅ Categories seeded');

  // Products
  const products = [
    {
      name: 'Arduino Uno R3',
      slug: 'arduino-uno-r3',
      sku: 'ARD-UNO-R3',
      description: 'The Arduino Uno R3 is a microcontroller board based on the ATmega328P. It has 14 digital input/output pins (of which 6 can be used as PWM outputs), 6 analog inputs, a 16 MHz ceramic resonator (CSTCE16M0V53-R0), a USB connection, a power jack, an ICSP header and a reset button. It contains everything needed to support the microcontroller; simply connect it to a computer with a USB cable or power it with an AC-to-DC adapter or battery to get started.',
      shortDescription: 'Classic Arduino board with ATmega328P — the go-to board for every maker.',
      category: arduinoCat._id,
      brand: 'Arduino',
      price: 799,
      discountPrice: 649,
      stock: 150,
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg', alt: 'Arduino Uno R3 Front' },
        { url: 'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&q=80', alt: 'Arduino Uno R3 Blue' },
        { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80', alt: 'Arduino Circuit Board' },
      ],
      specifications: [
        { key: 'Microcontroller', value: 'ATmega328P' },
        { key: 'Operating Voltage', value: '5V' },
        { key: 'Input Voltage', value: '7-12V (recommended)' },
        { key: 'Digital I/O Pins', value: '14 (6 PWM)' },
        { key: 'Analog Input Pins', value: '6' },
        { key: 'Flash Memory', value: '32 KB' },
        { key: 'SRAM', value: '2 KB' },
        { key: 'EEPROM', value: '1 KB' },
        { key: 'Clock Speed', value: '16 MHz' },
        { key: 'USB', value: 'USB-B' },
      ],
      tags: ['arduino', 'microcontroller', 'beginner', 'ATmega328P', 'uno'],
      applications: ['IoT', 'Robotics', 'Education', 'Automation', 'Prototyping'],
      voltage: '5V / 7-12V input',
      protocol: 'UART, SPI, I2C',
      featured: true,
      isBestSeller: true,
      isNew: false,
    },
    {
      name: 'ESP32 Development Board',
      slug: 'esp32-development-board',
      sku: 'ESP-32-DEV',
      description: 'ESP32 is a powerful dual-core microcontroller with integrated WiFi 802.11 b/g/n and Bluetooth 4.2 + BLE. It runs at 240MHz and has 520KB SRAM for demanding IoT applications. Perfect for smart home devices, wearables, and industrial IoT. Supports MicroPython, Arduino IDE, and ESP-IDF frameworks.',
      shortDescription: 'Dual-core 240MHz WiFi + Bluetooth SoC — perfect for IoT projects.',
      category: espCat._id,
      brand: 'Espressif',
      price: 349,
      discountPrice: 299,
      stock: 200,
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/ESP32_Espressif_ESP-WROOM-32_Dev_Board.jpg/640px-ESP32_Espressif_ESP-WROOM-32_Dev_Board.jpg', alt: 'ESP32 Dev Board' },
        { url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&q=80', alt: 'ESP32 Module' },
      ],
      specifications: [
        { key: 'CPU', value: 'Dual-core Tensilica LX6' },
        { key: 'Clock Speed', value: '240 MHz max' },
        { key: 'WiFi', value: '802.11 b/g/n' },
        { key: 'Bluetooth', value: 'BT 4.2 + BLE' },
        { key: 'RAM', value: '520 KB SRAM' },
        { key: 'Flash', value: '4 MB' },
        { key: 'GPIO Pins', value: '30' },
        { key: 'ADC', value: '12-bit, 18 channels' },
        { key: 'Operating Voltage', value: '3.3V' },
      ],
      tags: ['esp32', 'wifi', 'bluetooth', 'iot', 'espressif'],
      applications: ['IoT', 'Smart Home', 'Wearables', 'Industrial IoT'],
      voltage: '3.3V (5V tolerant input)',
      protocol: 'WiFi, Bluetooth, UART, SPI, I2C, I2S',
      featured: true,
      isNew: true,
    },
    {
      name: 'DHT22 Temperature & Humidity Sensor',
      slug: 'dht22-temperature-humidity-sensor',
      sku: 'SEN-DHT22',
      description: 'The DHT22 (AM2302) is a digital temperature and humidity sensor with single-bus interface. It uses exclusive digital signal collecting technique and humidity sensing technology, enabling it to have very reliable and stable performance. Its sensing elements are connected with 8-bit single-chip computer.',
      shortDescription: 'Accurate digital temp & humidity sensor — ±0.5°C accuracy.',
      category: tempCat._id,
      brand: 'Aosong',
      price: 199,
      discountPrice: 159,
      stock: 300,
      images: [
        { url: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80', alt: 'DHT22 Temperature Sensor' },
        { url: 'https://images.unsplash.com/photo-1601410703576-d58d3d2b0f1a?w=600&q=80', alt: 'DHT22 Sensor Module' },
      ],
      specifications: [
        { key: 'Temperature Range', value: '-40 to +80°C' },
        { key: 'Temp Accuracy', value: '±0.5°C' },
        { key: 'Humidity Range', value: '0-100% RH' },
        { key: 'Humidity Accuracy', value: '±2-5% RH' },
        { key: 'Operating Voltage', value: '3.3-5.5V' },
        { key: 'Interface', value: 'Single-wire digital' },
        { key: 'Sampling Rate', value: '0.5 Hz (once every 2s)' },
      ],
      tags: ['temperature', 'humidity', 'sensor', 'dht22', 'iot', 'weather'],
      applications: ['Weather Station', 'HVAC', 'Agriculture', 'Smart Home'],
      voltage: '3.3-5.5V',
      protocol: 'Single-wire',
      featured: true,
    },
    {
      name: 'HC-SR04 Ultrasonic Distance Sensor',
      slug: 'hc-sr04-ultrasonic-sensor',
      sku: 'SEN-HCSR04',
      description: 'The HC-SR04 ultrasonic sensor uses sonar to determine the distance to an object, ranging from 2 to 400cm with 0.3cm accuracy. It features non-contact distance measurement, high precision, and stable readings. Uses only 2 GPIO pins (Trigger + Echo).',
      shortDescription: '2cm–400cm non-contact ultrasonic distance sensor for robotics.',
      category: motionCat._id,
      brand: 'Generic',
      price: 99,
      discountPrice: 79,
      stock: 500,
      images: [
        { url: 'https://images.unsplash.com/photo-1509390836518-4d11e67c6ef2?w=600&q=80', alt: 'HC-SR04 Ultrasonic Sensor' },
        { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80', alt: 'Electronic Sensor Board' },
      ],
      specifications: [
        { key: 'Working Voltage', value: '5V DC' },
        { key: 'Ranging Distance', value: '2cm - 400cm' },
        { key: 'Resolution', value: '0.3cm' },
        { key: 'Measuring Angle', value: '15°' },
        { key: 'Trigger Input', value: '10μS TTL Pulse' },
        { key: 'Frequency', value: '40 kHz' },
      ],
      tags: ['ultrasonic', 'distance', 'sensor', 'robotics', 'hcsr04'],
      applications: ['Robotics', 'Obstacle Detection', 'Parking Sensor', 'Level Sensing'],
      voltage: '5V',
      protocol: 'Trigger/Echo TTL',
      featured: false,
    },
    {
      name: 'MQ-2 Gas & Smoke Sensor Module',
      slug: 'mq-2-gas-sensor-module',
      sku: 'SEN-MQ2',
      description: 'The MQ-2 smoke sensor module is sensitive to LPG, i-butane, propane, methane, alcohol, hydrogen, and smoke. It has a digital output pin and analog output proportional to gas concentration. The module has onboard potentiometer to set the trigger threshold.',
      shortDescription: 'Multi-gas sensor for smoke, LPG, methane detection — analog + digital output.',
      category: gasCat._id,
      brand: 'Winsen',
      price: 149,
      discountPrice: 0,
      stock: 250,
      images: [
        { url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=600&q=80', alt: 'MQ2 Gas Sensor' },
        { url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80', alt: 'Gas Sensor Module' },
      ],
      specifications: [
        { key: 'Detects', value: 'LPG, Smoke, Alcohol, Methane, Propane, Hydrogen' },
        { key: 'Operating Voltage', value: '5V' },
        { key: 'Output', value: 'Analog + Digital (TTL)' },
        { key: 'Preheat Time', value: '20 seconds' },
        { key: 'Sensitivity', value: 'Adjustable via potentiometer' },
      ],
      tags: ['gas', 'smoke', 'sensor', 'mq2', 'safety', 'lpg'],
      applications: ['Gas Leak Detection', 'Air Quality Monitor', 'Safety Alarm', 'Industrial'],
      voltage: '5V',
    },
    {
      name: 'Raspberry Pi 4 Model B — 4GB',
      slug: 'raspberry-pi-4-model-b-4gb',
      sku: 'RPI-4-4GB',
      description: 'Raspberry Pi 4 Model B is the most powerful Raspberry Pi ever. It features a 64-bit quad-core ARM Cortex-A72 processor running at 1.5GHz, 4GB LPDDR4 RAM, 4K@60fps dual display output, USB 3.0, Gigabit Ethernet, and USB-C power. Run full desktop Linux or use it as an IoT gateway, NAS server, or media center.',
      shortDescription: 'The most powerful Pi ever — quad-core ARM, 4GB RAM, 4K output.',
      category: piCat._id,
      brand: 'Raspberry Pi Foundation',
      price: 6499,
      discountPrice: 5999,
      stock: 50,
      images: [
        { url: 'https://tse4.mm.bing.net/th/id/OIP.A8YtBzAztFcFI9hLa2tP6gHaE_?rs=1&pid=ImgDetMain&o=7&rm=3', alt: 'Raspberry Pi 4 Model B Side' },
        { url: 'https://tse4.mm.bing.net/th/id/OIP.A8YtBzAztFcFI9hLa2tP6gHaE_?rs=1&pid=ImgDetMain&o=7&rm=3', alt: 'Raspberry Pi Circuit Board' },
      ],
      specifications: [
        { key: 'CPU', value: 'Quad-core ARM Cortex-A72 @ 1.5GHz' },
        { key: 'Architecture', value: '64-bit' },
        { key: 'RAM', value: '4GB LPDDR4-3200' },
        { key: 'USB', value: '2x USB 3.0 + 2x USB 2.0' },
        { key: 'Display', value: '2x micro-HDMI (up to 4K60)' },
        { key: 'Network', value: 'Gigabit Ethernet + WiFi 5 + BT 5.0' },
        { key: 'Storage', value: 'MicroSD card slot' },
        { key: 'Power', value: '5V 3A via USB-C' },
      ],
      tags: ['raspberry-pi', 'sbc', 'linux', 'arm', 'single-board-computer'],
      applications: ['Media Center', 'IoT Gateway', 'Education', 'NAS Server', 'AI/ML'],
      voltage: '5V / 3A USB-C',
      featured: true,
      isBestSeller: true,
    },
    {
      name: 'Line Following Robot Kit',
      slug: 'line-following-robot-kit',
      sku: 'KIT-LINEBOT',
      description: 'Complete line following robot kit for beginners and students. Includes a robot chassis with two DC motors, L298N motor driver, IR line sensor module (2-channel), Arduino Uno compatible board, connecting wires, and screwdriver. Complete step-by-step assembly guide and Arduino code included. Build and program your own autonomous robot in 2 hours!',
      shortDescription: 'Complete DIY robot kit — chassis, motors, IR sensors, driver, Arduino all included.',
      category: roboticsCat._id,
      brand: 'ElectroMart',
      price: 1299,
      discountPrice: 999,
      stock: 80,
      images: [
        { url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80', alt: 'Line Following Robot Kit' },
        { url: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&q=80', alt: 'Robot Arms' },
        { url: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&q=80', alt: 'Robot Build' },
      ],
      specifications: [
        { key: 'Chassis', value: '2WD acrylic chassis' },
        { key: 'Motors', value: '2x DC 6V gear motors' },
        { key: 'Motor Driver', value: 'L298N dual H-bridge' },
        { key: 'Sensors', value: '2-channel IR line sensor' },
        { key: 'Controller', value: 'Arduino Uno compatible' },
        { key: 'Power', value: '6V battery holder (6x AA)' },
        { key: 'Skill Level', value: 'Beginner — Easy assembly' },
      ],
      tags: ['robot', 'kit', 'beginner', 'arduino', 'diy', 'line-follower', 'educational'],
      applications: ['Education', 'Robotics Competition', 'STEM Project', 'Hobby'],
      featured: true,
      isBestSeller: true,
      isNew: true,
    },
    {
      name: 'Professional Soldering Iron Station 60W',
      slug: 'soldering-iron-kit-60w',
      sku: 'TOOL-SOLDER-60W',
      description: 'Professional 60W adjustable temperature soldering iron station with LED digital display. The advanced temperature-stable design maintains accuracy ±5°C throughout operation. Kit includes 5 interchangeable tips (needle, chisel, hoof, cone, blade), solder wire 60/40, iron holder stand, cleaning sponge, tip tinner, and a carry case.',
      shortDescription: '60W pro soldering station with LED display, 5 tips & complete kit.',
      category: toolsCat._id,
      brand: 'Yihua',
      price: 899,
      discountPrice: 749,
      stock: 120,
      images: [
        { url: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=600&q=80', alt: 'Soldering Iron Station' },
        { url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=600&q=80', alt: 'Soldering Work' },
      ],
      specifications: [
        { key: 'Power', value: '60W' },
        { key: 'Temperature Range', value: '200°C - 480°C' },
        { key: 'Temperature Accuracy', value: '±5°C' },
        { key: 'Display', value: 'LED Digital' },
        { key: 'Tips Included', value: '5 (needle, chisel, hoof, cone, blade)' },
        { key: 'Cord Length', value: '1.2m' },
        { key: 'Input Voltage', value: '220V AC' },
      ],
      tags: ['soldering', 'soldering-iron', 'tool', 'electronics', 'pcb'],
      applications: ['PCB Assembly', 'Component Repair', 'Wire Splicing', 'Prototyping'],
    },
  ];

  for (const product of products) {
    await Product.create(product);
    process.stdout.write('.');
  }

  console.log('\n✅ Products seeded');
  console.log('\n🎉 Database seeded successfully!');
  console.log('Admin credentials: admin@electromart.in / Admin@123');
  process.exit(0);
};

seedData().catch((err) => {
  console.error(err);
  process.exit(1);
});
