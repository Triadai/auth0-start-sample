[![Auth0](http://blog.auth0.com.s3.amazonaws.com/logo-290x200-letters.png)](http://auth0.com)

Auth0 Server Appliance welcome screen.

![ss-2013-10-04T18-14-54.png](http://blog.auth0.com.s3.amazonaws.com/ss-2013-10-04T18-14-54.png)

## Introduction

Auth0 is offered both [as a service](https://app.auth0.com) and as an appliance (in essence a virtual machine). There ra many other offerings with a similar delivery model. We wanted to share some of our expereinces building it here.

__This guide is only for an Ubuntu based server__.

## What does it do?

The code in this repository has three pre-configured actions:

1.  Reboot your appliance
2.  Change the network settings
3.  Run an script

## Setup

### Edit your /etc/init/tty1.conf

Every tty has an init script, the init script is an upstart job that starts [getty](http://manpages.ubuntu.com/manpages/lucid/man8/getty.8.html). Getty does some cool things and ends up executing `/bin/login`. 

Fortunately, you can tell getty to start something else with the `-l` option:

~~~
exec /sbin/getty -n -l /opt/my-start-app/start-screen -8 38400 tty1
~~~

### Generate your _ASCII_ art

All awesome appliances need _ASCII Art__. There are several _ASCII_ generators you can use to turn your product's name and logo into a bigger and great banner. You can also use images to ASCII converters. 

TIP: to make the ASCII Art even _awesomer_, change the resolution of Ubuntu Server by tweaking grub, edit your `/etc/default/grub` as follows:

~~~
GRUB_CMDLINE_LINUX_DEFAULT="splash vga=789"
~~~

Then run `sudo update-grub`.


## License

MIT 2013 - AUTH10 LLC
