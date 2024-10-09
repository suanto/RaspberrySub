# The Background

In January 2021 I found out that I needed an ROV for searching underwater. I had previously created a remote controlled boat which had a side scan sonar to search large bodies of water. However, to check its findings, I needed an underwater video and an ROV seemed to be the best vehicle to transport it.

As this was done as a hobby and the money to build it would come out of my pocket, it would have to be done on a shoestring.

I wasn't sure what the exact operating environment would be like, so I decided to play safe. The ROV would have to stand a pressure of an approx. 100m depth and to be operable at least 2hrs on a single charging. It would have to operate multiple video cameras and have powerful lights.

The major problem with building the ROV was that I had no idea how to do it. Much effort went into thinking how to build the ROV, as I didn't really have the know-how, tools or space to build it myself. And also I didn't have money to source it. I finally decided to learn how to create 3d drawings of the designs myself. I would source the most difficult components and build the easier ones myself.

Even though I was using a lot of my existing knowledge, I still had to learn a whole lot of new stuff. For example, I had to learn about the materials (plastics, steel, aluminium), how to make water tight enclosures and seals (especially o-ring sizing). Of course was spent on finding out how to source components and where to enquire offers outside EU, and also the information on taxes and customs when importing outside EU. 

Browsing the Internet, I discovered that building and ROV might be actually possible, because many people had documented how they had successfully done it themselves. The following projects and sites provided ideas and inspirations:
* https://www.instructables.com/DIY-Submersible-ROV/
* https://github.com/Moki38/Moki-ROV2
* https://www.homebuiltrovs.com/

And of course, the homebuilt ROVs forum:
* https://www.homebuiltrovs.com/rovforum/

Many ideas came also from ancient pages on how to build a diver's canister light:
* https://web.archive.org/web/20070623095042/http://users.tkk.fi/~mivuorel/Lamppu/eraan_sukelluslampun_anatomia.htm
* https://sfnet.harrastus.sukellus.narkive.com/HDn41vte/kanisteri-valon-rakennusta

To build (underwater) projects, there are many amazing resources such as:
* https://thecavepearlproject.org/

And for general inspiration:
* [Arduino vs Evil (youtube)](https://www.youtube.com/user/arduinoversusevil)

# The Build Process

Finally, I ended up with a sketch, roughly similar with [dcolemans ROV](https://www.instructables.com/DIY-Submersible-ROV/). The dry hull was modeled after the diver's canister light, similar to the diver's canister light (also here https://plazma.kapsi.fi/pictures/temp/lamppu/), but longer and without the switch. 

![The dry hull plan](/pictures/dry-hull-plan.png)
*The dry hull plan.*

The camera and light housings were modeled on the light head of a diver's canister light, similar to Pasi Lassila's design (https://plazma.kapsi.fi/pictures/temp/valopaa.jpg). 

![/pictures/uw-housing-plan.png](UW housing plan)

It was difficult to find a company to build the dry hull. Most large companies were not interested in building a single component. Smaller companies were busy and having difficulties to fulfill their current orders. Finally, I found a company from Oulu, Finland to build the dry hull.

Sourcing for the uw cases for lights and cameras turned out more suppliers. I finally requested offer from five chinese manufacturers, three Finnish manufacturers and three platforms which offered automatic quoting. The price range was large. The most expensive offer came, of course, from a Finnish manufacturer and it was 5x of the lowest bid while the lead time was longer. I chose the manufacturer, a small Polish CNC-shop, through Xometry platform.

The ROV had two computers: Raspberry pi as the companion computer and Arduino, which would control the motors and sensors. Lights were 1000lm Cree leds with an option to dim them. It had three cameras (front, up, down) and each camera had its own light. (In the end the cameras were left, front, right; covering almost 360-degrees).

Motors were causing lots of headache as the standard option was to use BlueROV thrusters. Even they were generally evaluated as excellent the price of approx. 200 euros per thruster was just too much. Finally, the (SV Seekers' blog)[https://www.svseeker.com/wp/sv-seeker-2/underwater-rovs/open-source-towed-sonar-rov/] provided the answer. Just replace the ball bearings of a standard drone motor with bronze bushings. 

# The design

![](/pictures/hulls-assembled.jpg)
*The dry and well hulls assembled.*

## Wet hull

The wet hull provides the rigid frame for the ROV. All of the parts are attached to it. Water is allowed to flood it, which makes the balancing easier. It would also be daunting task to make it waterproof as finding leaks in construction with that many joints is not easy.

The wet hull is made from a 32mm polypropylene sewage pipe. The corners are 88,5 degree sections (x8) and t-sections are used when needed (x12).

Some of the joints are bolted together to make sure the frame doesn't break into parts when lifting and pulling it.

The rough dimensions of the dry hull are 40 cm x 40 cm x 30 cm.

## Dry hull 

The electronic components are stored in the dry hull to keep them dry. The hull has air inside of it and must resist the water pressure of 100m (11bar).

The dry hull is made from a 140mm polypropylene pressure pipe. The pipe is certified for 14bar inner pressure. However, it is build from two sections which are welded together. Also one of the pipe endings has been welded shut. How much these weld seams actually withstand pressure was unknown.

One end of the hull has been welded shut, the other one has removable cap. The cap has 14 cable glands which provide access to the cables to enter the dry hull. The cable glands are certified for 10bar pressure. 

The removable cap is sealed with two o-rings and the cap is secured to the hull by using two adjustable latches. It was surprisingly hard to find sturdy enough latches.

## Propulsion

![](/pictures/v1-and-v2-propulsion.jpg)
*v2 propellor, motor, and the cover on the left.*

As BLDC motors are used for the propulsion, they need separate electronic speed controllers (ESC). The ESCs are in the dry hull, and just in case, they are molded in polyurethane resin. The molding provides physical strength and resistance against the water in case of flooding. The ESCs are controlled by the Arduino.

The ESCs' wire come through the cable glands to the motors. The motors are 1000kv 4s RC-plane motors. Propellers are 60mm 4-blade plastic RC-boat propellers. Propellers are fixed inside 75mm polypropylene sewage pipe sections so they don't cut the tether by accident. (v2 of the ROV was changed to use 10cm propellors)

There are 6 motors in the ROV. Two control the vertical movement (altitude = up / down) and the other four control the horizontal movement. The four horizontal movement motors are in diamond shape and controlled as vectored thrusters. The ROV can move horizontally forward (pitch), sideways (roll) and turn (yaw). (v2 of the was changed to use 4 motors: 2 up&down, 2 to forward/back and turn)

Motors are mounted in approx. 20-25 degree from directional center as more speed is needed to front/back movement than for lateral movement.

## Battery & electronics

The ROV is powered by 20Ah Li-Po 4S battery. As [Arduino vs. Evil](https://www.youtube.com/user/arduinoversusevil) says, "Angry pixies" flow through the power module to the fuses (2x, motors are separated to two units, if one fuse is blown, one motor for each direction will continue to work). The power module has 4700uf capacitor to provide stable voltage. All eletronics get their power through the fuses. 

There are two computers on board. The Raspberry Pi 4 as a companion computer. It is connected to the network and it receives the user's commands from the surface and sends back information about the state of the ROV. The Pi is also connected to the cameras and Arduino.

The Arduino Mega controls the motors, lights, and sensors. A separate computer is needed as Pi's clock is not accurate enought to control the ESCs. Pi and Arduino communicate using a serial connection over USB with a custom protocol.

The battery and electronics are attached to frame made out of two 138mm diameter PE discs and a 9mm plywood board. The rame can easily be slid to the dry hull.

## Sensors

In order to make sense of the surroinds the ROV has sensors. 

For power there are voltage and current sensors. The sensor used is a Chinese replica of the Arduino Power Module (APM) 1.0 (I think). It provides usable voltage sensing but the current sensing was suboptimal; actually it was not usable at all.

For depth and outside temperature I used a cheap Chinese replica of MS-5803. It has amazing accuracy for the price. The only caveat is the physical pressure sensing element, which is really delicate. I casted the module to epoxy resin and mounted it in a small plastic container with holes drilled to it. Care must be taken not to cast the actual sensor part.

For attitude and heading there is an MPU-9250 9-DoF sensor. After trying with three different sensors, I gave up. The first didn't work at all. The second indicated that magnetometer is broken. The third one worked occasionally. However, the temperature sensor worked well with the last one.

As the MPU-9250 did not work, the ROV doesn't have compass. This makes navigation or even following a straight line underwater impossible without visual guidance.

## Cameras

The ROV has three cameras. They are 15mmx15mm 1080p mjpg-stream cameras, which were sourced from AliExpress. They were reasonably priced but as they do not stream actual video, there are some shortcomings displaying and recording the video.

The cameras are placed in water tight closures. The closure is made out of 6066 aluminium and it has a round 38mm diameter x 50mm long space for the camera. The camera is help in place with a makeshift 6mm polyethylene plastic board (ie. old IKEA kitchen cutting board). 

The camera case has similar cable gland to the dry hull which provide access to the cable to enter the casing. The casing has a window, made from 6mm polycarbonate with a scratch proof coating.

The camera casings were sourced from [Xometry](https://www.xometry.com/). The windows were surprisingly difficult to find. As you can't use a regular hole cutter to create these, most of the suppliers turned me down. I finally found three different providers, one large and two really small companies. The large company quote was 8x more expensive than the cheapest, with a 6 week lead time. The cheapest price came with a next day delivery!

Sealing is done with 37,7x3,53 NBR70 o-ring.

## Lights

Each camera has its own light. The lights are Cree MK-R 10w 14v LED's with approximately 1000lm light power on full power. They are controlled by LED dimmers (Meanwell LDD-700L). The casing is the same as the cameras'. The LEDs create a lot of heat when run on full power so they have a heat sink. The heat sink is an aluminium board attached to the alu casing. The LED is attached to the plate with glue and there is heat conducting paste to make sure heat is conducted properly. The glue acts as insulator so the LED needs to be glued carefully.

The led dimmers can also heat up, so it's good to provide a heat sink for them too.

## Tether & network

As wireless control is not feasible for the ROV it needs a wayof communication with the surface. There is always a risk that ROV can get stuck, the surface cable has to be strong enough to withstand a forceful pull from the surface.

It was tempting to use CAT-5 or CAT-6 network cables as tether but they are too rigid to be usable. A [neat solution](https://forum.openrov.com/t/teardown-of-a-homeplug-adapter/305) is to use [ethernet-over-powerline plugs](http://www.helicopting.de/) to provide 100mb network over 24 awg cable. This thin cable can be inserted into the polyethylene rope which provides the needed pulling strength. The plastic cover and the powerline components of the plugs can be removed to reduce the space required.

The tether should be of neutral buyuoancy. If the tether sinks in the water, it is difficult to fix it. Most floating stuff used to fix it will compress in the deep causing to rope to sink when diving deep enough. Creating a neutral tether is a difficult task, in which I had no luck. There are no reasonably priced commercial solutions available.

## Buoyancy

The ROV itself has negative buoyancy in the water so additional floating pontoons are required. They are made from as 50mm sewage pipe with the same length than the ROV's. Additional weight are also needed to fine tune the attitude. In current setup, ROV needs an additional 300g weights. The weights are placed inside of two 32mm sewage pipes on the bottom of the ROV. Inside the pipes there is a threaded rod. The weights are washers on the rod and the their placement is controlled with nuts. 

Balancing the ROV must done carefully as even 10g of too much weight caused ROV to slowly sink.

## Controlling

The ROV is controlled from the surface laptop. The video from all the cameras is seen with info from sensors. A gamepad or keyboard can be used to control the ROV.

## Software - surface, webserver, arduino

Software architecture consists of three parts. The software architecture is similar to [Moki-ROV](https://github.com/Moki38/Moki-ROV2) but it's rewritten completely.

The system expects to reside on a private network with no other components on it. There is absolutely no thought given to security, so I don't recommend connecting it to the Internet.

### 1) Client
The client runs on a web browser. The video and info box are rendered to an HTML5 canvas element which also enables recording of the video feed (only on Chrome browser). The canvas is embedded on regular html-page. The client also listens the control events from the keyboard and gamepad, it contains controls to record video, and it sends heartbeat signal to webserver to notify that it's still alive and connected. The client app is done using HTML / Typescript.

*This implementation worked only because of a unfixed issue in Chromium browsers. The bug was fixed in 2021, resulting in this solution to no longer working. One solution is to read the streamed images in Raspberry pi (server), create a video and stream it to the client*

### 2) Server
There is a webserver which runs on Raspberry Pi. The server listens the events from the client, relays them over the serial to Aduino, listens Arduino's events and relays the status messages to the client. The webserver is created using node.js and Typescript. 

### 3) Arduino
The third component is custom software which runs on Arduino Mega. Arduino listens to the events from Raspberry Pi and acts upon them. If the heartbeat has not been received in every few seconds, Arduino stops the motors, stays still until the client wakes up. Arduino also sends a status message which contain the sensors' data at regular intervals. Arduino is programmed using PlatformIO / C++.
