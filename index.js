const { WebSocket } = require("ws");
const fs = require("fs");

const ws = new WebSocket("ws://192.168.1.20:8000");

let stream = fs.createWriteStream('rocketlog.txt');

let loop;

ws.on("open", function open() {
	console.log("CONNECTED!");
	stream.write("NEW SESSION:\n\n");
	loop = setInterval(() => {
		ws.send(".");
	}, 500)
});

ws.on("message", function message(data) {
	console.log("Got data: " + data);
	stream.write("\n");
	stream.write(data);
});

ws.on("close", function close() {
	stream.end("\n\nEND OF DATA")
});

process.on("SIGINT", () => {
	console.log("Caught interupt signal!");
	clearInterval(loop);
	stream.end("\n\nFORCE CLOSED");
	ws.close();
	console.log("EXITING");
});
