# UCSD Planner Helper
 
**Live at [sdschedule.com](https://sdschedule.com)!** Designed for and by UCSD students. Use this tool to automatically generate
your optimal class schedule without relying on WebReg.

# Details 

UCSD's class registration system, WebReg, is notoriously slow and clunky. 
During peak hours, students trying to plan their classes on WebReg might find
themselves unable to proceed, stuck waiting for a simple search query to load.
Everything about WebReg is extremely dated, from its outmoded user interface
to the bare minimum of features that it supports. Most importantly, WebReg
lacks the ability to generate schedules automatically, requiring users to
manually add each of their prospective classes themselves.

In this project, we attempted to address these concerns. Our planning tool 
allows UCSD students to automatically generate schedules given a list of classes
that they are interested in. Students can indicate at what times they would 
prefer certain classes and can specify class priorities. All of the 
schedule generation legwork is handled by our system. Additionally, we boast
extremely fast load times, a clean, modern UI and near 100% uptime. This 
schedule generation tool also integrates with calendar frameworks like
Google Calendar and Apple Calendar, enabling students to export their new
schedule to the device of their choice.

<sub><sup>Note that the user must manually enroll in classes on WebReg itself; 
we only provide schedule generation utilities, not enrollment features.</sup></sub>

# Primary Technologies

This project uses the following frameworks:

* ReactJS and Redux <sub>frontend logic</sub>
* React Storybook <sub>component testing</sub>
* Primereact <sub>UI components</sub>
* Flask <sub>backend server</sub>
* Selenium <sub>web scraping</sub>
* Cheerio <sub>HTML parsing</sub>
* MySQL <sub>database for scraped results</sub>
* Docker <sub>container management</sub>

The frontend is mostly written in JS, by virtue of React, and the backend is
mostly written in Python. 

# System Requirements

The following utilities must be present for installation purposes: 

* docker
* docker-compose

# Installation

This project is designed to be portable. We use docker to ensure that there is
clear separation between our tool's runtime environment and the
rest of your system.

To clone, use the following command:

```bash
git clone https://github.com/ctrando/UCSD-Planner-Helper
cd UCSD-Planner-Helper
```

Run this app using a simple shell script:

* To download the data, add "-d" flag. Note the scraping might take a while depends on your network environment.
* The app can be either run in development mode or production mode. Production mode uses Nginx.
* If any changes made to the files (e.g. update), add "-b" flag to tell docker to rebuild. Or docker will always use the images existing.
* "-s" flag is used to stop the detached services in production mode.

```bash
./scripts/run.sh [-h|--help] [-d|--download] [-p|--production] [-b|--build] [-s|--stop]
```

Usage:

```bash
./scripts/run.sh -h       # display help message

./scripts/run.sh          # run in development mode without reloading or rebuilding
./scripts/run.sh -d       # run in development mode and download the data
./scripts/run.sh -p       # run the app in production mode
./scripts/run.sh -p -d    # run the app in production mode, and download data
./scripts/run.sh -b -p -d # rebuild, run the app in production mode, and download data
```

The development server will be live at http://localhost:3000. Make sure the ports 3000 and 5000 
are not used on your machine.

## SSL

The production server will listen to 80 and 443 ports (ssl enabled by default).

Add SSL:

```bash
./scripts/run.sh -p                 # make sure the production services are up
./scripts/run.sh -c <your-email>    # give an email address
```

If you don't want to use https,
change the nginx config file, `UCSD-Planner-Helper\web\nginx\sites\sdschedule.conf`,
as specified in that file.

# Contributing

If you wish to contribute, please speak to [@ctrando](https://github.com/ctrando). 
We emphasize good testing practices as well as maintainable and well-documented code.
Contributing guidelines will be posted in the near future.
