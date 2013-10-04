var exec = require('child_process').exec;

exports.run = function (callback) {
  var proc = exec('/root/update.sh', callback);
  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);
};