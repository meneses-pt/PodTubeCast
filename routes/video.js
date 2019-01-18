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

	ytdl(parameter, { quality: "highest" }).once("response", (videoRes) => {
		res.setHeader("content-type", videoRes.headers["content-type"]);
		res.setHeader("content-length", videoRes.headers["content-length"]);
	}).pipe(res);
}

module.exports = router;
