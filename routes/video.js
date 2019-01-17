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
	var pattern = new RegExp(
		"^(https?:\\/\\/)?" + // protocol
		"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
		"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
		"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
		"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
			"(\\#[-a-z\\d_]*)?$",
		"i"
	); // fragment locator
	return pattern.test(str);
}

module.exports = router;
