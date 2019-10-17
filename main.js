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

	    recv_msg(currentConnectionId);
	    send_msg(currentConnectionId);
	});
    });
});

const get_key = () => {
    return new Promise(resolve => {
	document.addEventListener('keypress', e => {
	    resolve(e.charCode);
	}, {once:true});
    });
}

const send_msg = async (id) => {
    const code = await get_key();
    Serial.send_byte(id, code);
    send_msg(id);
};

const recv_msg = async (id) => {
    console.log('rec');
    const data = await Serial.recv_byte(id);
    const buf = new Uint8Array(data);
    const str = String.fromCharCode.apply(null, buf);
    consoleArea.innerHTML += str.replace(/\r/, '');
    consoleArea.scrollTop = consoleArea.scrollHeight;
    recv_msg(id);
}
