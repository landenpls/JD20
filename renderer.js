const { ipcRenderer } = require("electron");
let log = function(str) {
	//send a signal to the launcher process to log something
	ipcRenderer.invoke("log", str);
}
let getSongInfo = function() {
	let title = document.querySelector(".song-detail__text").innerText;
	let artist = document.querySelector(".song-detail__artist").innerText;
	let duration = Date.now() + ((document.querySelector("#in-game_video").duration + 5) * 1000);
	return { title: title, artist: artist, duration: duration };
}
let isInSong = function() {
	//check if user is currently dancing
	return document.querySelector("#in-game_video").src !== "";
}
let cleanse = function(inputStr) {
	//clear string
	if (!inputStr) inputStr = "NoData";
	return inputStr.replace("\n", "");
}
let clearControl = function() {
	//remove fullscreen elem
	document.querySelector(".toggle-fullscreen").outerHTML = "";
}
document.onreadystatechange = () => {
	//render loaded
	document.querySelector(".launch-game").click();
	log("Initializing...");
}
let iteration = 0;
let songController;
let lastArtist = "";
let _lastArtist = "";
let lastTitle = "";
let _lastTitle = "";
setInterval(() => {
	if (document.querySelector("#in-game_video")) {
		document.querySelector("#in-game_video").oncanplay = function() {
			// in song
			let currentSong = getSongInfo();
			let startTimestamp = Date.now();
			log("Playing song (" + cleanse(currentSong.title) + ")");
			ipcRenderer.invoke('rpc', {
				details: lastTitle,
				state: lastArtist,
				endTimestamp: currentSong.duration,
				largeImageKey: "jd",
				largeImageText: "Just Dance 2020"
			});
			clearControl();
		}
		document.querySelector("#in-game_video").onemptied = function() {
			// done with song
			log("Emptied");
			ipcRenderer.invoke('rpc', {
				details: "Menu",
				largeImageKey: "jd",
				largeImageText: "Just Dance 2020"
			});
			clearControl();
		}
		console.log("Succesfully bound (on the " + iteration + "th try)")
		return;
	} else {
		console.log("Trying to bind... " + iteration);
	}
	iteration++;
}, 500);
setInterval(() => {
	let songInfo = getSongInfo();
	_lastArtist = songInfo.artist != "" ? songInfo.artist : null;
	if (_lastArtist) lastArtist = _lastArtist;
	_lastTitle = songInfo.title != "" ? songInfo.title : null;
	if (_lastTitle) lastTitle = _lastTitle;
}, 500);