


"use strict";

function localStorageIsAvailable()
{
	try{
		return 'localStorage' in window && window['localStorage'] !== null;
	}catch(e){
		return false;
	}
}

/*

if(localStorageIsAvailable()){
	//
} else{
	alert('Local Storage non disponible ! ');
}

*/

var playerRecordingLoop;

var VideoPlayerPtracker = {
	initialize: function(player) {
		console.log(this.id());
		if( localStorageIsAvailable()){
			this.player = player;
		this.addEventListeners();
		} else {
			alert('You need to have the localStorage enabled in order to use this tracker');
		}
		
	},

	addEventListeners: function() {
		this.player.ready(this.onLoad.bind(this));
		this.player.on("play",this.onPlay.bind(this));
		this.player.on("ended",this.onEnd.bind(this));
		this.player.on("volumechange",this.onVolumeChange.bind(this));

		// Event Listeners for PlackbackRate items
		var plackbackRates = document.querySelectorAll('.vjs-menu-item');
		for (var i = 0; i <plackbackRates.length; i++){
			plackbackRates[i].addEventListener('click',this.onPlaybackRateChange.bind(this));
		}
	},

	onLoad: function() {
		console.log("Video loaded");
	},

	onPlay: function(){
		this.beginRecordingPosition();
	},

	onEnd: function(){
		this.stopRecordingPosition();
	},

	onVolumeChange: function(){
		localStorage.setItem('tdn_volume', this.player.volume());
	},

	onPlaybackRateChange: function(){
		localStorage.setItem('tdn_playback_speed', this.player.playbackRate());
	},

	beginRecordingPosition: function(){
		playerRecordingLoop = setInterval(function(){
			localStorage.setItem(this.id(),this.currentTime());
		}.bind(this), 3000);
	},

	stopRecordingPosition: function(){
		clearInterval(playerRecordingLoop);
		localStorage.removeItem(this.id());
	},

	startAt: function(time){
		return this.player.currentTime(time);
	},

	play: function() {
		return this.player.play();
	},

	currentTime: function(){
		return this.player.currentTime();
	},

	id: function(){
		return "tdn_video" + location.pathname;
	}
};

VideoPlayerPtracker.initialize(
	videojs('my-video',{
		playbackRates: [.5, .75, 1, 1.25, 1.5, 1.75,2],
		fluid: true
	})
);