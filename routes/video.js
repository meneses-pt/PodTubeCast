const express = require("express");
const ytdl = require("ytdl-core");
const router = express.Router();

router.get("/:videoId", function(req, res, next) {
	ytdl("http://www.youtube.com/watch?v=" + req.params.videoId, { quality: 'highest' }).pipe(res);
});

module.exports = router;