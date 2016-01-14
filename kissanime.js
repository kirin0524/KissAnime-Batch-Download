var URL = window.location.origin;
var hostName = window.location.hostname;
var fullURL = window.location.href;

// determine if user is on KissAnime and on the anime's main episode page
if (hostName.search(/kissanime\.\w+/i) != -1){	
	if (fullURL.search(/kissanime\.\w+\/Anime\//i) == -1) {
		alert("You are not on the Anime's main episode page.");
		//fake function to cause script to terminate
		AbortJavaScript();
	}
}

// determine if user is on KissCartoon and on the cartoon's main episode page
else if (hostName.search(/kisscartoon\.\w+/i) != -1){
	if (fullURL.search(/kisscartoon\.\w+\/Cartoon\//i) == -1) {
		alert("You are not on the Cartoon's main episode page.");
		//fake function to cause script to terminate
		AbortJavaScript();
	}
}

// determine if user is on KissAsian and on the drama's main episode page
else if (hostName.search(/kissasian\.\w+/i) != -1){
	if (fullURL.search(/kissasian\.\w+\/Drama\//i) == -1) {
		alert("You are not on the Drama's main episode page.");
		//fake function to cause script to terminate
		AbortJavaScript();
	}
}

else {
	alert("You are not on a valid Kiss (Anime/Cartoon/Asian) site to use this script.");
	//fake function to cause script to terminate
	AbortJavaScript();
}

var episodeLinks = $('table.listing a').map(function(i,el) { return $(el).attr('href'); });
console.log('Found ' + episodeLinks.length + ' episode links on current page.');
if (episodeLinks === 0 || episodeLinks === null) {
	alert("There are no episode links on this page.");
	//fake function to cause script to terminate
	AbortJavaScript();
}

$.ajaxSetup({async:false});
$.getScript(URL + "/Scripts/asp.js");

var startEpisode; 
do {
	startEpisode = prompt("There are " + episodeLinks.length + " episodes found.\nEnter the episode number that you want to start from:");
	if (startEpisode === null) {
		throw new Error("Script cancelled by user!");
	}
	startEpisode = Number(startEpisode);
	if (startEpisode <= 0 || startEpisode > episodeLinks.length) {
		alert("Episode number must be greater than 0 and less than " + episodeLinks.length); 
	} else {
		break; 
	}
} while(true); 
console.log('Starting episode: ' + startEpisode)

var endEpisode; 
do {
	endEpisode = prompt("Starting from episode " + startEpisode + "\nEnter the episode number that you want to end at :");
	if (endEpisode === null) {
		throw new Error("Script cancelled by user!");
	}
	endEpisode = Number(endEpisode);
	if (endEpisode <= 0 || endEpisode > episodeLinks.length || endEpisode < startEpisode) {
		alert("Episode number must be greater than 0 and less than " + episodeLinks.length);
	} else {
		break;
	}
} while(true); 
console.log('Ending episode: ' + endEpisode)

var videoQuality = prompt("Enter the video quality that you want to download. Leave blank for default (1280x720.mp4)"); 
//set preferred quality (will choose the best available if not an option)
if (videoQuality === null || videoQuality == '') {
	videoQuality = '1280x720.mp4';
}
console.log('Selected quality: ' + videoQuality);

var i;
var long_url;
var absolute_url;
var newLinks = '';
var title = $(".bigChar").text();
var c = startEpisode;
for (i = (episodeLinks.length - startEpisode); i >= (episodeLinks.length - endEpisode); i--) {
	jQuery.ajax({
        url: URL + episodeLinks[i], 
        success: function(result) {
        	var $result = eval($(result));
		var stringStart = result.search("var wra"); 
		var stringEnd = result.search("document.write"); 
		var javascriptToExecute = result.substring(stringStart, stringEnd);
		eval(javascriptToExecute);
		$("body").append('<div id="episode' + i + '" style="display: none;"></div>')
		$('#episode' + i).append(wra); 
		
		var downloadQualityOptions = $('#episode' + i + ' a').map(function(i,el) { return $(el); });
		var j; 
		var qualityFound = false;
		for (j = 0; j < downloadQualityOptions.length; j++) {
			if (videoQuality === downloadQualityOptions[j].html()) {
				long_url = downloadQualityOptions[j].attr('href');
				qualityFound = true;
			} 
		}
		//if preferred quality is not found, defaults to highest quality
		if (qualityFound == false){
			videoQuality = downloadQualityOptions[0].html();
			long_url = downloadQualityOptions[0].attr('href');
		}
		absolute_url = (function(){
			var a;
			return function(url){
				if(!a) a = document.createElement('a');
				a.href=long_url;
				return a.href;
			}
		});
		console.log('Completed: ' + c + '/' + (endEpisode - startEpisode + 1));
		newLinks = newLinks + '<a href="' + absolute_url + '" download="' + title + ' - ' + c + '">Episode ' + c + ' (' + videoQuality + ')</a><br></br>\n';
		c++
		
        },
        async:   false, 
	script:  true
    });


var newPageText = 'Use an addon like DownThemAll! to download the episodes on this page at once. '
newPageText += 'To download them individually, right click the link and choose Save As. <br>'
newPageText += 'NOTE: If watching episodes from this list, open them in a new tab as you will not be able to come back.<br><h1>'+title+' - Download Page</h1>'
newPageText += newLinks

var newPage = window.open();
newPage.document.body.innerHTML = newPageText
