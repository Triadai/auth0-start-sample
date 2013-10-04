var fs = require('fs');
var ip = require('ip');

var is_dhcp = ~fs.readFileSync('/etc/network/interfaces').toString().indexOf('iface eth0 inet dhcp');

module.exports = ip.address() + (is_dhcp ? ' (dhcp) ' : '');