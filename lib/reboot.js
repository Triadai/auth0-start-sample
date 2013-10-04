var exec = require('child_process').exec;

exports.run = function (callback) {
  var proc = exec('reboot', callback);
  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);
};