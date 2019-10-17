export const get_device = () => {
    return new Promise(resolve => {
	chrome.serial.getDevices(ports => {
	    resolve(ports);
	});
    });
};

export const send_byte = (id, c) => {
    return new Promise(resolve => {
	const buf = new Uint8Array([c]);
	chrome.serial.send(id, buf, sendinfo => resolve(sendinfo));
    });
};

export const recv_byte = (id) => {
    return new Promise(resolve => {
	const get_info = info => {
	    if (info.connectionId == id && info.data) {
		resolve(info.data);
	    }
	    chrome.serial.onReceive.removeListener(get_info);
	}
	chrome.serial.onReceive.addListener(get_info);
    });
};
