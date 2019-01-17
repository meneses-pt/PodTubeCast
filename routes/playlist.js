const express = require("express");
const podcast = require("podcast");
const ytpl = require("ytpl");
const ytdl = require("ytdl-core");
const getYotubePlaylistId = require('get-youtube-playlist-id')
const router = express.Router();

/* GET home page. */
router.get("/:playlistId", function(req, res, next) {
	var baseAddress = req.protocol + "://" + req.hostname;

	var parameter;
	
	if(isURL(req.params.playlistId)) {
		parameter = getYotubePlaylistId(req.params.playlistId);
	} else {
		parameter = req.params.playlistId;
	}

	ytpl(parameter, function(err, playlist) {
		if (err) throw err;

		console.log(playlist);

		/* lets create an rss feed */
		const feed = new podcast({
			title: playlist.title,
			description: "[PodTubeCast] " + playlist.title,
			feed_url: baseAddress + "/playlist/" + parameter,
			site_url: baseAddress,
			image_url:
				"https://dummyimage.com/400x400/f2f7f8/40424a.jpg&text=[PodTubeCast]+" +
				encodeURI(playlist.title),
			author: playlist.author.name,
			//managingEditor: 'Dylan Greene',
			//webMaster: 'Dylan Greene',
			//copyright: '2013 Dylan Greene',
			//language: "pt-PT",
			categories: ["Podcast"],
			//pubDate: "Jan 07, 2019 00:00:00 GMT",
			//ttl: '60',
			itunesAuthor: playlist.author.name,
			itunesSubtitle: "[PodTubeCast] " + playlist.title,
			//itunesSummary: 'I am a summary',
			//itunesOwner: { name: 'Max Nowack', email:'max@unsou.de' },
			//itunesExplicit: false,
			itunesCategory: {
				text: "Podcasts" //,
				//"subcats": [{
				//  "text": "Television"
				//}]
			},
			itunesImage:
				"https://dummyimage.com/400x400/f2f7f8/40424a.jpg&text=[PodTubeCast]+" +
				encodeURI(playlist.title)
		});

		var promises = [];

		playlist.items.forEach(function(element) {
			promises.push(
				ytdl.getBasicInfo(
					"http://www.youtube.com/watch?v=" + element.id
				)
			);
		});

		Promise.all(promises).then(results => {
			results.forEach(element => {
				console.log(element);

				item = playlist.items.find(i => i.id == element.video_id);
				var format = ytdl.chooseFormat(element.formats, {
					quality: "highest"
				});

				feed.addItem({
					title: element.title,
					description: element.description,
					url: baseAddress + "/video/" + element.video_id, // link to the item
					guid: element.video_id, // optional - defaults to url
					//categories: ["Category 1", "Category 2", "Category 3", "Category 4"], // optional - array of item categories
					author: element.author.name, // optional - defaults to feed author property
					date: element.published, // any format that js Date can parse.
					//lat: 33.417974, //optional latitude field for GeoRSS
					//long: -111.933231, //optional longitude field for GeoRSS
					enclosure: {
						url: baseAddress + "/video/" + element.video_id,
						type: format.type /*, file:'path-to-file'*/,
						size: format.size || 0
					}, // optional enclosure TODO: size
					itunesAuthor: element.author.name,
					itunesExplicit: false,
					//itunesSubtitle: "iTunes Subtitle " + i,
					//itunesSummary: "iTunes Summary " + i,
					itunesDuration: item.duration,
					//itunesKeywords: ["javascript", "podcast"],
					itunesImage: item.thumbnail
				});
			});

			const xml = feed.buildXml();

			res.set("Content-Type", "text/xml");
			res.send(xml);
			console.log("Send XML");
		});
	});
});

function isURL(str) {
	return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(str); 
}

module.exports = router;
