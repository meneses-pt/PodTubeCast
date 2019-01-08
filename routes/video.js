const express = require("express");
const youtubedl = require('youtube-dl');
const router = express.Router();

router.get("/:videoId", function(req, res, next) {

    var video = youtubedl('http://www.youtube.com/watch?v=' + req.params.videoId
    //,
        // Optional arguments passed to youtube-dl.
        //['-f bestaudio[ext=m4a]'],
//        // Additional options can be given for calling `child_process.execFile()`.
//        { cwd: __dirname }
    );

    video.pipe(res);
});

module.exports = router;