
## Raspberry PI

Download Raspberry Pi OS Lite from https://www.raspberrypi.org/software/
Set up the OS [as instructed](https://projects.raspberrypi.org/en/projects/raspberry-pi-setting-up).

Boot and login. Default user/password is pi/raspberry

Configure some components:

```
sudo raspi-config 
     update
          select keyboard layout from Localisation options
          expand root filesystem from Advanced Options
          enable (camera / i2c /) ssh Interfacing Options

```

Set up fixed IP and fallback when there's no dhcp-server. Instructions can be found in the config file. Use the same IP as it helps use between development and actual use.
```
sudo vi /etc/dhcpcd.conf
```

```
reboot
```

## Surface laptop (Development machine)

### Setup public key authentication (run on your surface/development machine)
This if for Linux. If you use Windows on the dev (surface) machine, you need to figure it out yourself.
```
ssh-keygen
(edit ~/.ssh/config)     
ssh-copy-id -i .ssh/id_rsa.pub pi@<RASPBERRY_PI_IP>
```

### Login to RPI

### Update the Raspberry Pi OS

```
sudo apt update
sudo apt upgrade
sudo apt dist-upgrade
```

### Install git and other other needed packages

```
sudo apt install git gcc g++ make
```

### Install node.js (only for old raspberry pi ( pre-v3))

```
wget https://nodejs.org/dist/latest-v11.x/node-v11.15.0-linux-armv6l.tar.gz
tar -xvf node-v11.15.0-linux-armv6l.tar.gz
cd node-v11.15.0-linux-armv6l
sudo cp -R * /usr/local/
sudo ln -s /usr/local/bin/node  /usr/bin/node
sudo ln -s /usr/local/bin/npm /usr/bin/npm
```

### Install node (current models of Raspberry pi)

Select node version you like, this is for v16
```
sudo curl -fsSL https://deb.nodesource.com/setup_16.x | sudo bash -
sudo apt-get install -y nodejs
```


### Check that node works

```
node -v
npm -v
```

### Install pm2 for autostart
```
sudo npm install -g pm2
sudo env PATH=$PATH:/usr/local/bin pm2 startup systemd -u pi --hp /home/pi // for rpi4 (https://stackoverflow.com/questions/32781133/pm2-autostart-on-raspbian-raspberry-pi-does-not-work#)
```
### Compile mjpg_streamer

```
cd
sudo apt install -y libjpeg-dev cmake
git clone https://github.com/jacksonliam/mjpg-streamer.git
cd mjpg-streamer/mjpg-streamer-experimental
sudo make
sudo make install
```

### Clone the repository         

Create personal access token. 
```
git clone https//:oauth:<PERSONAL_TOKEN>/github.com/suanto/RaspberrySub.git rov
```


## Install Arduino stuff 

### Platformio

Guide: https://docs.platformio.org/en/latest//core/installation.html

```
sudo apt install python3 python3-venv
python3 -c "$(curl -fsSL https://raw.githubusercontent.com/platformio/platformio/master/scripts/get-platformio.py)"

sudo ln -s ~/.platformio/penv/bin/platformio /usr/local/bin/platformio
sudo ln -s ~/.platformio/penv/bin/pio /usr/local/bin/pio
sudo ln -s ~/.platformio/penv/bin/piodebuggdb /usr/local/bin/piodebuggdb

cd /etc/udev/rules.d/
curl -fsSL https://raw.githubusercontent.com/platformio/platformio-core/master/scripts/99-platformio-udev.rules | sudo tee /etc/udev/rules.d/99-platformio-udev.rules
sudo service udev restart
sudo usermod -a -G dialout pi
```

### Build and flash arduino

```
cd arduino
platformio run --target upload
```

## Raspberry Pi

## Build software and run pm2 (this autostarts system on startup)

```
cd client
npm install
npm run package
npm run copy
cd ../server
npm install
npm run package
pm2 start dist/server/src/server.js --name rov 
pm2 save
```

## Change to ROVNet
Now you can change to use the local rov lan. RPI does not need to have Internet connection anymore.

## RPI - Development
Install VSCode and the VSCode remote addon on dev machine.

## Start in dev mode

You need to start two processes
1. webpack to serve UI stuff (IP:4000)
```
cd RaspberrySub/client
npm install
npm run dev
```

2. webserver (IP:5000) no direct connection needed
```
cd RaspberrySub/server
npm install
npm run dev
```

3. Open browser
http://IP:4000 OR
http://IP:5000

## Which port do I use? 

Depends on what you run. If you run just the server which contains all the client files, then port 5000. Client files are copied from the client project using 'npm run copy'.

If you run webpack from the client project (using npm run dev) then access port 4000.


## Git
Use remote to allow collaboration between the ROV and development machine.

Add rov to remote.
```
git remote add rov 192.168.3.3/home/pi/rov
```

Copy the changes to local repo
```
git pull rov master
```


## Installing library to ROV when there is no Internet connection in the ROV
1. Install the library to local repo using platformio io. 
2. Copy & paste the library to the ROV using VSCode.

# Misc

Check webcam supported formats:
```
v4l2-ctl --list-formats-ext -d /dev/video2
```