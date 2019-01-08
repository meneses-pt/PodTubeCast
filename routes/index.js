const express = require("express");
const podcast = require("podcast");
var ytpl = require("ytpl");
const router = express.Router();

const config = {
	GOOGLE_API_KEY: "AIzaSyDO-ToHIpj93rOCm_W68bXI93WFZ-JbMw4"
};

/* GET home page. */
router.get("/:playlistId", function(req, res, next) {
	var url = "https://www.youtube.com/playlist?list=PL-yLvk8MCLtzAgVNg77IDxfdo8-2GHdPr";

	var baseAddress = req.protocol + "://" + req.host;

	ytpl(req.params.playlistId, function(err, playlist) {
		if (err) throw err;

		console.log(playlist);

		/* lets create an rss feed */
		const feed = new podcast({
			title: playlist.title,
			description: playlist.title + " (Podcast Feed)",
			feed_url: baseAddress + "/playlist/" + req.params.playlistId,
			//site_url: "http://www.malucobeleza.tv/",
			//image_url: "http://www.malucobeleza.tv/wp-content/uploads/2015/08/logo-mb-retina.png",
			author: playlist.author.name,
			//managingEditor: 'Dylan Greene',
			//webMaster: 'Dylan Greene',
			//copyright: '2013 Dylan Greene',
			//language: "pt-PT",
			categories: ["Podcast"],
			//pubDate: "Jan 07, 2019 00:00:00 GMT",
			//ttl: '60',
			itunesAuthor: playlist.author.name,
			itunesSubtitle: playlist.title + " (Podcast Feed)",
			//itunesSummary: 'I am a summary',
			//itunesOwner: { name: 'Max Nowack', email:'max@unsou.de' },
			//itunesExplicit: false,
			itunesCategory: {
			text: "Podcasts" //,
				//"subcats": [{
				//  "text": "Television"
				//}]
			},
			//itunesImage: "http://www.malucobeleza.tv/wp-content/uploads/2015/08/logo-mb-retina.png"
		});

		playlist.items.forEach(function(element) {
			feed.addItem({
				title: element.title,
				//description: "Description " + i,
				url: baseAddress + "/video/" + element.id, // link to the item
				//guid: baseAddress + "/video/" + element.id, // optional - defaults to url
				//categories: ["Category 1", "Category 2", "Category 3", "Category 4"], // optional - array of item categories
				author: element.author.name, // optional - defaults to feed author property
				//date: "Jan 07, 2019", // any format that js Date can parse.
				//lat: 33.417974, //optional latitude field for GeoRSS
				//long: -111.933231, //optional longitude field for GeoRSS
				enclosure : {url: baseAddress + "/video/" + element.id, type: "video/mp4"/*, file:'path-to-file'*/}, // optional enclosure TODO: Link to episode
				itunesAuthor: element.author.name,
				itunesExplicit: false,
				//itunesSubtitle: "iTunes Subtitle " + i,
				//itunesSummary: "iTunes Summary " + i,
				itunesDuration: element.duration,
				//itunesKeywords: ["javascript", "podcast"]
			});
		});

		// cache the xml to send to clients
		const xml = feed.buildXml();

		res.set("Content-Type", "text/xml");
		res.send(xml);

	});
});

module.exports = router;
