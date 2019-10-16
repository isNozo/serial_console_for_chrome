import * as Serial from './serial.js';

var currentConnectionId;
var consoleArea;
var portList;
var connectBtn;

// initialize
window.addEventListener("load", () => {
    consoleArea = document.getElementById("console");
    portList = document.getElementById("port");
    connectBtn = document.getElementById("connect");

    // Detect available ports
    Serial.get_device().then(ports => {
	for (let i=0; i<ports.length; i++) {
	    const option = document.createElement("option");
	    option.text = ports[i].path;
	    option.value = ports[i].path;
	    portList.appendChild(option);
	}
    });

    // Connection
    connectBtn.addEventListener('click', () => {
	const path = portList.options[portList.selectedIndex].value;
	chrome.serial.connect(path, {}, connectionInfo => {
	    console.log("Connected:", connectionInfo);
	    currentConnectionId = connectionInfo.connectionId;
	});
    });
});

// Recieve message
chrome.serial.onReceive.addListener(info => {
    if (info.connectionId == currentConnectionId && info.data) {
	const str = String.fromCharCode.apply(null, new Uint8Array(info.data));
	consoleArea.innerHTML += str.replace(/\r/, '');
	consoleArea.scrollTop = consoleArea.scrollHeight;
    }
});

// Send message
document.addEventListener('keypress', e => {
    if(!currentConnectionId) return;

    const buf = new Uint8Array([e.charCode]);
    chrome.serial.send(currentConnectionId, buf, _ => {});
});
