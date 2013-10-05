[![Auth0](http://blog.auth0.com.s3.amazonaws.com/logo-290x200-letters.png)](http://auth0.com)

Auth0's appliance welcome screen.

![ss-2013-10-04T18-14-54.png](http://blog.auth0.com.s3.amazonaws.com/ss-2013-10-04T18-14-54.png)


## Introduction

We deploy Auth0 to the cloud but we also distribute as an appliance (a virtual machine). We took the idea from other appliances and here we are sharing our setup.

__This guide is only for ubuntu server__.

## What it does?

This repository has three actions:

1.  Reboot your appliance
2.  Change the network settings
3.  Run an script

## Setup

### Edit your /etc/init/tty1.conf

Every tty has an init script, the init script is an upstart job that starts [getty](http://manpages.ubuntu.com/manpages/lucid/man8/getty.8.html). Getty does some cool things and ends up executing `/bin/login`. 

Fortunately you can tell getty to start something else with the `-l` option:

~~~
exec /sbin/getty -n -l /opt/my-start-app/start-screen -8 38400 tty1
~~~

### Generate your ASCII art

There are several ASCII generators you can use to turn your product's name into a bigger and awesome banner. You can also use images to ascii converters. 

TIP: to make the ascii even awesome, change the resolution of Ubuntu Server by tweaking grub, edit your `/etc/default/grub` as follows:

~~~
GRUB_CMDLINE_LINUX_DEFAULT="splash vga=789"
~~~

Then run `sudo update-grub`.


## License

MIT 2013 - AUTH10 LLC
