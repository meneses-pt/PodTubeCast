const express = require("express");
const ytdl = require("ytdl-core");
const router = express.Router();

router.get("/:videoId", function(req, res, next) {
	processVideoRequest(req, res);
});

router.get("/", function(req, res, next) {
	processVideoRequest(req, res);
});

function processVideoRequest(req, res) {

	var videoId;
	if(req.params.videoId != null && req.params.videoId != "") {
		videoId = req.params.videoId;
	} else {
		videoId = req.query.videoId;
	}

	var parameter;
	if (isURL(videoId)) {
		parameter = ytdl.getURLVideoID(videoId);
	}
	else {
		parameter = videoId;
	}

	res.setHeader("Content-Type", "video/mp4");
	ytdl(parameter, { quality: "highest" }).pipe(res);
}

function isURL(str) {
	return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(str); 
}

module.exports = router;
