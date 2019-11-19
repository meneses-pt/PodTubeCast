const express = require("express");
const podcast = require("podcast");
const ytpl = require("ytpl");
const ytdl = require("ytdl-core");
const getYotubePlaylistId = require('get-youtube-playlist-id')
const webHelpers = require("../helpers/web");
const router = express.Router();

router.get("/:playlistId", function(req, res, next) {
	processPlaylistRequest(req, res);
});

router.get("/", function(req, res, next) {
	processPlaylistRequest(req, res);
});

function processPlaylistRequest(req, res) {

	var playlistId;
	if(req.params.playlistId != null && req.params.playlistId != "") {
		playlistId = req.params.playlistId;
	} else {
		playlistId = req.query.playlistId;
	}

	var parameter;
	if (webHelpers.isURL(playlistId)) {
		parameter = getYotubePlaylistId(playlistId);
	}
	else {
		parameter = playlistId;
	}

	var baseAddress = req.protocol + "://" + req.hostname;
	
	ytpl(parameter, function (err, playlist) {
		if (err)
			throw err;

		const feed = new podcast({
			title: playlist.title,
			description: "[PodTubeCast] " + playlist.title,
			feed_url: baseAddress + "/playlist/" + parameter,
			site_url: baseAddress,
			image_url: "https://dummyimage.com/400x400/e02f2f/ffffff.jpg&text=[PodTubeCast]+" +
				encodeURI(playlist.title),
			author: playlist.author.name,
			categories: ["Podcast"],
			itunesAuthor: playlist.author.name,
			itunesSubtitle: "[PodTubeCast] " + playlist.title,
			itunesCategory: {
				text: "Podcasts"
			},
			itunesImage: "https://dummyimage.com/400x400/e02f2f/ffffff.jpg&text=[PodTubeCast]+" +
				encodeURI(playlist.title)
		});
		
		var promises = [];
		
		playlist.items.forEach(function (element) {
			promises.push(ytdl.getBasicInfo("http://www.youtube.com/watch?v=" + element.id).catch(function(e) {
				console.log("Exception ytdl.getBasicInfo()");
				console.log(e);
			  }));
			promises.push(waitForEventWithTimeout(ytdl("http://www.youtube.com/watch?v=" + element.id, { quality: "highest" }), "response", 10000).catch(function(e) {
				console.log("Exception waitForEventWithTimeout");
				console.log(e);
			  }));
		});
		
		Promise.all(promises).then(results => {
			
			var infoElement;
			var responseElement;
			
			for(let i = 0; i < results.length; i+=2){
				
				infoElement = results[i];
				responseElement = results[i+1];
				
				//item = playlist.items.find(i => i.id == infoElement.video_id);
				item = playlist.items.find(i => i.id == infoElement.player_response.videoDetails.videoId);
				
				var format = ytdl.chooseFormat(infoElement.formats, {
					quality: "highest"
				});
				
				feed.addItem({
					title: item.title,
					description: infoElement.description,
					//url: baseAddress + "/video/" + infoElement.video_id,
					url: baseAddress + "/video/" + infoElement.player_response.videoDetails.videoId,
					guid: infoElement.video_id,
					author: infoElement.author.name,
					date: infoElement.published,
					enclosure: {
						//url: baseAddress + "/video/" + infoElement.video_id,
						url: baseAddress + "/video/" + infoElement.player_response.videoDetails.videoId,
						type: format.type,
						size: responseElement != null ? responseElement.headers['content-length'] : 0
					},
					itunesAuthor: infoElement.author.name,
					itunesExplicit: false,
					itunesDuration: item.duration,
					itunesImage: item.thumbnail
				});
			}

			const xml = feed.buildXml();
			res.set("Content-Type", "text/xml");
			res.send(xml);

		});
	});
}

function waitForEventWithTimeout(object, event, t) {
    return new Promise(function(resolve, reject) {
        var timer;

        function listener(data) {
            clearTimeout(timer);
            object.removeListener(event, listener);
            resolve(data);
        }

        object.on(event, listener);
        timer = setTimeout(function() {
            object.removeListener(event, listener);
            resolve(null);
        }, t);
    });
}

module.exports = router;
