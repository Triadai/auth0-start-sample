var fs   = require('fs');
var net  = require('net');
var exec = require('child_process').exec;
var ip   = require('ip');

var ejs = require('ejs');
var promptly = require('promptly');
var async = require('async');

var dynamic_template = ejs.compile(fs.readFileSync(__dirname + '/../templates/network_interfaces_dyn.ejs').toString());
var static_template  = ejs.compile(fs.readFileSync(__dirname + '/../templates/network_interfaces.ejs').toString());
var resolve_conf  = ejs.compile(fs.readFileSync(__dirname + '/../templates/resolve_conf.ejs').toString());


function validate_ip(ip) {
  if (!net.isIPv4(ip)) {
    throw new Error(ip + ' is not a valid ip address');
  }
  return ip;
}

function prompt_dhcp (options) {
  return function (done) {
    promptly.confirm('Enable DHCP?', function (err, enable) {
      if (err) return prompt_dhcp(options)(done);
      options.dhcp = enable;
      done();
    });
  };
}

function prompt_ipaddress (options) {
  return function (done) {
    if (options.dhcp) return done();
    var msg = ip.address() ? ('Ip Address (' + ip.address() + '):') : 'Ip Address';
    
    function validate (ip) {
      ip = ip || ip.address();
      return validate_ip(ip);
    }

    promptly.prompt(msg, { validator: validate }, function (err, address) {
      if (err) return prompt_ipaddress(options)(done);
      options.address = address;
      done();
    });
  };
}

function prompt_netmask (options) {
  return function (done) {
    if (options.dhcp) return done();
    promptly.prompt('Netmask:',  { validator: validate_ip }, function (err, netmask) {
      if (err) return prompt_netmask(options)(done);
      options.netmask = netmask;
      done();
    });
  };
}

function prompt_gateway (options) {
  return function (done) {
    if (options.dhcp) return done();
    promptly.prompt('Gateway:',  { validator: validate_ip }, function (err, gateway) {
      if (err) return prompt_gateway(options)(done);
      options.gateway = gateway;
      done();
    });
  };
}

function prompt_dns (options) {
  return function (done) {
    function validate(dnss) {
      var result = dnss.split(',').map(function(dns){
        return dns.trim();
      });
      result.forEach(validate_ip);
      return result;
    }
    
    promptly.prompt('DNS (comma separated):',  { validator: validate }, function (err, dnss) {
      if (err) return prompt_dns(options)(done);
      options.dnss = dnss;
      done();
    });
  };
}

function confirm (options) {
  return function (done) {
    var message;
    if (options.dhcp) {
      message = 'Enable DHCP' +
                   ', Dns ' + options.dnss.join(',');
    } else {
      message = 'Disable DHCP, IP Address ' + options.address + 
                   ', Netmask ' + options.netmask +
                   ', Gateway ' + options.gateway +
                   ', Dns ' + options.dnss.join(',');
    }
    promptly.confirm('Are these settings okay: ' + message + '?', function (err, sure) {
      if (err || !sure) return callback(new Error('canceled'));
      done();
    });
  };
}

function save_settings (options) {
  return function (done) {
    var interfaces_str = options.dhcp ? 
          dynamic_template(options) :
          static_template(options);
    fs.writeFileSync('/etc/network/interfaces', interfaces_str);

    var resolv_config_str = resolve_conf(options);
    fs.writeFileSync('/etc/resolv.conf', resolv_config_str);

    var proc = exec('ifdown eth0 && ifup eth0 ' + (options.dhcp ? '&& dhclient -r' : ''), done);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
  };
}

exports.run = function (callback) {
  var options = {};
  async.series ([
    prompt_dhcp(options),
    prompt_ipaddress(options),
    prompt_netmask(options),
    prompt_gateway(options),
    prompt_dns(options),
    confirm(options),
    save_settings(options)
  ], callback);
};