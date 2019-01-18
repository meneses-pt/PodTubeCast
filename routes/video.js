const express = require("express");
const ytdl = require("ytdl-core");
const webHelpers = require("../helpers/web");
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
	if (webHelpers.isURL(videoId)) {
		parameter = ytdl.getURLVideoID(videoId);
	}
	else {
		parameter = videoId;
	}

	res.setHeader("Content-Type", "video/mp4");

	ytdl(parameter, { quality: "highest" }).on("response", (videoRes) => {
		res.setHeader("content-type", videoRes.headers["content-type"]);
		res.setHeader("content-length", videoRes.headers["content-length"]);
		ytdl(parameter, { quality: "highest" }).pipe(res);
	});
}

module.exports = router;
