export const get_device = () => {
    return new Promise(resolve => {
	chrome.serial.getDevices(ports => {
	    resolve(ports);
	});
    });
};

export const send_byte = (id, c) => {
    console.log("send");
};

export const recv_byte = (id) => {
    console.log("recv");
};
