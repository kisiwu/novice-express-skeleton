/*
JS Modified from a tutorial found here:
http://www.inwebson.com/html5/custom-html5-video-controls-with-jquery/

I really wanted to learn how to skin html5 video.
*/
$(document).ready(function(){
	//INITIALIZE
	var video = $('#myVideo');
	var timerControl;
	var mouseOnVideoContainer = false;

	var moveNow = true;
	var timerMoveNow;

	var switchMoveNow = function(b){
		clearTimeout(timerMoveNow);
		var tMN = !isNaN(b) ? b : 610;
		moveNow = false;
		console.log(tMN);
		timerMoveNow = setTimeout(
			function(){
				moveNow = true;
			}
			,tMN
		);
	}

	/*$('.btnVideoFocus').on('blur',function(){console.log("focus out")});
	$('.btnVideoFocus').on('focus',function(){console.log("focus in")});*/

	var fadeOutControl = function(){
		if(timerControl){
			cancelTimerControl();
		}
		switchMoveNow();
		console.log("fade out");
		$('.control').stop().fadeOut(200);
		$('.caption').stop().fadeOut(200);
		$('body').css("cursor", "none");
	};

	var fadeInControl = function(){
		$('.control').stop().fadeIn(10);
		$('.caption').stop().fadeIn(10);
		$('body').css("cursor", "default");
	};

	var setTimerControl = function(a){
			if(timerControl){
				cancelTimerControl();
			}
			timerControl = setTimeout(fadeOutControl, 1750); // maybe
	};

	var cancelTimerControl = function(){
		clearTimeout(timerControl);
		timerControl = undefined;
	};

	//remove default control when JS loaded
	video[0].removeAttribute("controls");
	$('.control').fadeIn(500);
	$('.caption').fadeIn(500);

	//before everything get started
	video.on('loadedmetadata', function() {

		//set video properties
		$('.current').text(timeFormat(0));
		$('.duration').text(timeFormat(video[0].duration));
		updateVolume(0, 0.7);

		//start to get video buffering data
		setTimeout(startBuffer, 150);

		//bind video events
		$("body, .control")
		.hover(function() {
			/*$('.control').stop().fadeIn();
			$('.caption').stop().fadeIn();
			if(timerControl){
				cancelTimerControl();
			}
			timerControl = setTimeout(fadeOutControl, 2500); // maybe*/
			//mouseOnVideoContainer = true;
		}, function() {
			/*if(!volumeDrag && !timeDrag){
				$('.control').stop().fadeOut();
				$('.caption').stop().fadeOut();*/
				//mouseOnVideoContainer = false;
			//}
		});

		$( "body" ).mousemove(function( event ) {
			if(!volumeDrag && !timeDrag){
				if(moveNow){
					fadeInControl();
					//console.log("Move");
					setTimerControl();
				}
				else{
					console.log("you gos to chill");
				}
			}
			else{
				if(timerControl){
					console.log("cancel cause we draggin")
					cancelTimerControl();
				}
			}
		});


		$('.videoContainer')
		.on('click', function() {
			$('.btnVideoFocus').focus();
		});

		//console.log($('.videoContainer').height());
		//$('.videoContainer').height($('.videoContainer').height() - 5);
		//console.log($('.videoContainer').height());

		//video[0].src = "http://scontent-bru2-1.cdninstagram.com/t50.2886-16/14253475_244680455927562_1683054335_n.mp4http://scontent-bru2-1.cdninstagram.com/t50.2886-16/14253475_244680455927562_1683054335_n.mp4";
	})
	.on('play', function(){
		$('.btnPlay').find('.icon-play').addClass('icon-pause').removeClass('icon-play');
	})
	.on('pause', function(){
		$('.btnPlay').find('.icon-pause').removeClass('icon-pause').addClass('icon-play');
	})
	.on('volumechange', function(){
		if(!$(this)[0].muted) {
			$('.volumeBar').css('width', video[0].volume*100+'%');
			$('.sound').removeClass('muted');
		}
		else{
			$('.volumeBar').css('width',0);
			$('.sound').addClass('muted');
		}
	});

	//display video buffering bar
	var startBuffer = function() {
		var currentBuffer = video[0].buffered.end(0);
		var maxduration = video[0].duration;
		var perc = 100 * currentBuffer / maxduration;
		$('.bufferBar').css('width',perc+'%');

		if(currentBuffer < maxduration) {
			setTimeout(startBuffer, 500);
		}
	};

	//display current video play time
	video.on('timeupdate', function() {
		var currentPos = video[0].currentTime;
		var maxduration = video[0].duration;
		var perc = 100 * currentPos / maxduration;
		$('.timeBar').css('width',perc+'%');
		$('.current').text(timeFormat(currentPos));
	});

	//CONTROLS EVENTS
	//video screen and play button clicked
	var focusedVid;

	video.on('click', function()
		{
			switchMoveNow();
			playpause();
		}
	);
	$('.btnPlay').on('click', function() { playpause(); } );
	var playpause = function() {
		if(timerControl){
			cancelTimerControl();
		}
		if(video[0].paused || video[0].ended) {
			switchMoveNow();
			playVideo();
		}
		else {
			pauseVideo();
		}
		focusedVid = video[0];
		/*if(!mouseOnVideoContainer){
			$('.control').stop().fadeIn();
			timerControl = setTimeout(fadeOutControl, 2500);
		}*/
	};

	var playVideo = function(){
		$('.btnPlay').addClass('paused');
		$('.btnPlay').find('.icon-play').addClass('icon-pause').removeClass('icon-play');
		video[0].play();
		$('.btnVideoFocus').focus();

		if(!volumeDrag && !timeDrag){
			setTimerControl();
			console.log("hide cause i'm playin");
		}
	};

	var pauseVideo = function(){
		$('.btnPlay').removeClass('paused');
		$('.btnPlay').find('.icon-pause').removeClass('icon-pause').addClass('icon-play');
		video[0].pause();
		$('.btnVideoFocus').focus();

		cancelTimerControl();
		fadeInControl();
		console.log("show me cause its pause");
	};


	//fullscreen button clicked
	$('.btnFS').on('click', function() {
		switchMoveNow();
		/*if($.isFunction(video[0].webkitEnterFullscreen)) {

			//video[0].webkitEnterFullscreen(); // 'HTMLVideoElement.webkitEnterFullscreen()' is deprecated. Please use 'Element.requestFullscreen()' instead.
		}
		else if ($.isFunction(video[0].mozRequestFullScreen)) {
			//video[0].mozRequestFullScreen();
		}
		else {
			alert('Your browsers doesn\'t support fullscreen');
		}*/
		toggleFullScreen();
	});

	var toggleFullScreen = function() {
		if (!document.fullscreenElement &&    // alternative standard method
			!document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
			setFullScreen();
		} else {
			cancelFullScreen();
		}
	}

	var setFullScreen = function(){
		/*if (video[0].requestFullscreen) {
				video[0].requestFullscreen();
			} else if (video[0].mozRequestFullScreen) {
				video[0].mozRequestFullScreen();
			} else if (video[0].webkitRequestFullscreen) {
		      video[0].webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		    }*/
			setTimeout(function(){switchMoveNow();} , 4000);

			//$('.videoContainer').css({"border-radius": "0px"});

			$('video, .videoContainer').addClass("fullscreen");

			var element = document.body;
			var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
			if (requestMethod) { // Native full screen.
				requestMethod.call(element);
			} else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
				var wscript = new ActiveXObject("WScript.Shell");
				if (wscript !== null) {
					wscript.SendKeys("{F11}");
				}
			}
	}

	var cancelFullScreen = function(){

			if (!document.fullscreenElement &&    // alternative standard method
			!document.mozFullScreenElement && !document.webkitFullscreenElement) {
				return;
			}

			$('video, .videoContainer').removeClass("fullscreen");

			if (document.cancelFullScreen) {
		      document.cancelFullScreen();
		    } else if (document.mozCancelFullScreen) {
		      document.mozCancelFullScreen();
		    } else if (document.webkitCancelFullScreen) {
		      document.webkitCancelFullScreen();
			}
	}

	//sound button clicked
	$('.sound').click(function() {
		video[0].muted = !video[0].muted;
		$(this).toggleClass('muted');
		if(video[0].muted) {
			$('.volumeBar').css('width',0);
		}
		else{
			$('.volumeBar').css('width', video[0].volume*100+'%');
		}
	});


	//key control pressed
	$(window).keyup(function (e) {
		if (focusedVid && $('.btnVideoFocus').is(':focus')){
			if (e.keyCode === 0 || e.keyCode === 13 || e.keyCode === 32) {
				e.preventDefault()
				playpause();
			}
			if(e.keyCode === 27){
				cancelFullScreen();
			}
		}
	});

	//arrow keys
	$(window).keydown(function(e){
		if (focusedVid && $('.btnVideoFocus').is(':focus')){
			var skip_step = focusedVid.duration*.01;
			switch(e.which){
				case 37: // Back arrow
					if(skip_step < 1){
						skip_step = 0.5;
					}
					else if(skip_step > 07){
						skip_step = 07;
					}
					focusedVid.currentTime -= (skip_step + 0.5);
					break;
				case 39: // Forward arrow
					if(skip_step < 1){
						skip_step = 1;
					}
					else if(skip_step > 07){
						skip_step = 07;
					}
					focusedVid.currentTime += skip_step;
					break;
				case 38: // Up arrow
					updateVolume(0, focusedVid.volume + 0.1);
					break;
				case 40: // Down arrow
					updateVolume(0, focusedVid.volume - 0.1);
					break;
				default:
					//console.log(e.which);
					break;
            }
		}
    });

	//VIDEO EVENTS
	//video canplay event
	video.on('canplay', function() {
		$('.loading').fadeOut(100);
	});

	//video canplaythrough event
	//solve Chrome cache issue
	var completeloaded = false;
	video.on('canplaythrough', function() {
		completeloaded = true;
	});

	//video ended event
	video.on('ended', function() {
		$('.btnPlay').removeClass('paused');
		pauseVideo();
	});

	//video seeking event
	video.on('seeking', function() {
		//if video fully loaded, ignore loading screen
		if(!completeloaded) {
			$('.loading').fadeIn(200);
		}
	});

	//video seeked event
	video.on('seeked', function() { });

	//video waiting for more data event
	video.on('waiting', function() {
		$('.loading').fadeIn(200);
	});

	//VIDEO PROGRESS BAR
	//when video timebar clicked
	var toPlayOnMouseUp = false;
	var timeDrag = false;	/* check for drag event */
	$('.progress').on('mousedown', function(e) {
		timeDrag = true;
		updatebar(e.pageX);
		if(!video[0].paused){
			pauseVideo();
			toPlayOnMouseUp = true;
		}
	});
	$(document).on('mouseup', function(e) {
		if(timeDrag) {
			timeDrag = false;
			updatebar(e.pageX);
		}
		if(toPlayOnMouseUp){
			playVideo();
			toPlayOnMouseUp = false;
		}
	});
	$(document).on('mousemove', function(e) {
		if(timeDrag) {
			updatebar(e.pageX);
		}
	});
	var updatebar = function(x) {
		var progress = $('.progress');

		//calculate drag position
		//and update video currenttime
		//as well as progress bar
		var maxduration = video[0].duration;
		var position = x - progress.offset().left;
		var percentage = 100 * position / progress.width();
		if(percentage > 100) {
			percentage = 100;
		}
		if(percentage < 0) {
			percentage = 0;
		}
		$('.timeBar').css('width',percentage+'%');
		video[0].currentTime = maxduration * percentage / 100;
	};

	//VOLUME BAR
	//volume bar event
	var volumeDrag = false;
	$('.volume').on('mousedown', function(e) {
		volumeDrag = true;
		video[0].muted = false;
		$('.sound').removeClass('muted');
		updateVolume(e.pageX);
	});
	$(document).on('mouseup', function(e) {
		if(volumeDrag) {
			volumeDrag = false;
			updateVolume(e.pageX);
		}
	});
	$(document).on('mousemove', function(e) {
		if(volumeDrag) {
			updateVolume(e.pageX);
		}
	});
	var updateVolume = function(x, vol) {
		var volume = $('.volume');
		var percentage;
		//if only volume have specificed
		//then direct update volume
		if(vol) {
			percentage = vol * 100;
		}
		else {
			var position = x - volume.offset().left;
			percentage = 100 * position / volume.width();
		}

		if(percentage > 100) {
			percentage = 100;
		}
		if(percentage < 0) {
			percentage = 0;
		}

		//update volume bar and video volume
		$('.volumeBar').css('width',percentage+'%');
		video[0].volume = percentage / 100;

		//change sound icon based on volume
		if(video[0].volume == 0){
			$('.sound').removeClass('sound2').addClass('muted');
		}
		else if(video[0].volume > 0.5){
			$('.sound').removeClass('muted').addClass('sound2');
		}
		else{
			$('.sound').removeClass('muted').removeClass('sound2');
		}

	};

	//Time format converter - 00:00
	var timeFormat = function(seconds){
		var m = Math.floor(seconds/60)<10 ? "0"+Math.floor(seconds/60) : Math.floor(seconds/60);
		var s = Math.floor(seconds-(m*60))<10 ? "0"+Math.floor(seconds-(m*60)) : Math.floor(seconds-(m*60));
		return m+":"+s;
	};

	//Video Size inside the videoContainer
	/*var optimizeVideoSize = function(){
		if($(window).width() >= 992){
			video.prop("width", 854);
			//video.prop("height", 480);
		}
		else if($(window).width() >= 768){
			video.prop("width", 480);
			//video.prop("height", 270);
		}
		else if($(window).width() <= 767){
			video.prop("width", 438);
			//video.prop("height", 246);
		}
	}
	$(window).resize(optimizeVideoSize);

	optimizeVideoSize();
	*/

	// listening to API messages
	window.addEventListener('message', function(event) {
		/**
		* event.origin
		* event.data
		* event.source
		* ...
		*/
		postMessageAction(event.data);
		/*event.source.postMessage(
			{message: "All I Love"},
			event.origin === 'null' ? "*" : event.origin
		)*/
	}, false);

	function postMessageAction(data){
		if(data && !Array.isArray(data) && typeof data === 'object' && data.action){
			switch(data.action){
				case 'fullscreen':
					toggleFullScreen();
					break;
				case 'playpause':
					playpause();
					break;
				case 'play':
					playVideo();
					break;
				case 'pause':
					pauseVideo();
					break;
				default:
					console.warn('Unknown action', data.action);
					break;
			}
		}
	}

});
