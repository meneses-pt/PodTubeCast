const express = require("express");
const ytdl = require("ytdl-core");
const router = express.Router();

router.get("/:videoId", function(req, res, next) {
	var parameter;

	if (isURL(req.params.videoId)) {
		parameter = ytdl.getURLVideoID(req.params.videoId);
	} else {
		parameter = req.params.videoId;
	}

	res.setHeader("Content-Type", "video/mp4");
	ytdl(parameter, { quality: "highest" }).pipe(res);
});

function isURL(str) {
	return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(str); 
}

module.exports = router;
