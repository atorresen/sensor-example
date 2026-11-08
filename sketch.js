// thanks to Lucas Ma (MID 2027) for inspiring most of this code :)

// 1. connect Arduino board and sensors
      // microphone CZN-15E: OUT --> DIGITAL OUT 2; GND --> GND; VCC --> 5V
      // infrared HW-201: OUT --> DIGITAL OUT 2; GND --> GND; VCC --> 5V

// 2. modify/debug code below for specific sensor

// 3. run via local server ("Go Live" button in VS Code)

let serialPort;
let connectBtn;

let buffer = "";
let sensed = 0;

let mySound;

async function setup() {
  connectBtn = createButton("Click to connect Arduino");
  connectBtn.position(20, 20);
  connectBtn.mousePressed(connectToSerial);

  mySound = await loadSound('bells.mp3');

  var myCanvas = createCanvas(400, 400);
  myCanvas.parent("mySketch");
}

// connect the webpage to Arduino via serial port
async function connectToSerial() {
  try {
    serialPort = await navigator.serial.requestPort();
    await serialPort.open({ baudRate: 9600 });
    connectBtn.hide();
    readSerial();
  } catch (err) { console.error("Serial port failure", err); }
}

async function readSerial() {
  const reader = serialPort.readable.getReader();
  const decoder = new TextDecoder();
  while (true) {
    // read the sensor data
    const { value, done } = await reader.read();
    if (done) break;

    // decode and process the sensor data
    let data = decoder.decode(value);
    // get binary digits from the data string
    data = data.split(/(\d)/).filter((d) => ((d == "0") || d == "1")); 

    // append the sensor data to the buffer string
    buffer += data[data.length - 1]; 
  }
}

function draw() {
  // get the latest sensor value
  sensed = buffer.slice(-1);

  // incorporate sensor value as a variable in sketch
  if (sensed == 0) {
    background("blue")
  } else {
    background("red");
    mySound.play();
  }
}