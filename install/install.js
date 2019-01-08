var exec = require('child_process').exec,
    child;

 child = exec('npm install ffi --scripts-prepend-node-path=true',
 function (error, stdout, stderr) {
     console.log('stdout: ' + stdout);
     console.log('stderr: ' + stderr);
     if (error !== null) {
          console.log('exec error: ' + error);
     }
 });