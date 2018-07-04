# UniHub
A centralized system to report issues to the head of the organisation with an option to report to next higher level parent organisation. 

# SetUp
To set up the development environment, you need to follow the following steps
1. Download npm and nodeJs. Installation guide can be found [here](https://www.joyent.com/blog/installing-node-and-npm)
2. Download and install MongoDB on your system.

# Running the Porject on local Server
First navigate to the project directory in your filesystem.
1. Now create a directory /data/db in the location where your project folder resides.
2. Now run `mongod --dbpath=./data/db` from the current directory.
3. Now run `cd Unihub`, or go inside the project folder.
4. Now run `nodemon start` in the terminal.
5. Open `localhost:3000` from your favourite browser.
