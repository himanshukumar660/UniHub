# UniHub
A centralized system to report issues to the organisations with an ability to make organisations oneself. 

# Description
In this project, I have tried to make a centralized system where users can make their own groups and other users can join them upon approval of the admin of the group. After getting added the users can post their issues which can be upvoted/downvoted by their group mates. The user who posted that issue can also close them or delete them. Apart from all these the admin can post notices in the name of the group which will appear in the notices tab of each member of the group.

# Screenshots
  ## Issues/Home Page
   ![Issues/Home Page](https://github.com/himanshukumar660/UniHub/blob/master/ScreenShots/home.png)
   ![Admin Page](https://github.com/himanshukumar660/UniHub/blob/master/ScreenShots/admin_org_notice.png)
   ## Organisation Dashboard(Admin)
   ![Organisation Dashboard for admin](https://github.com/himanshukumar660/UniHub/blob/master/ScreenShots/admin_org.png)
   ## Organisation Dashboard(Members)
   ![Organisation Dashboard for members](https://github.com/himanshukumar660/UniHub/blob/master/ScreenShots/member_org.png)
   ## Manage Organisation
   ![Manage Organisations](https://github.com/himanshukumar660/UniHub/blob/master/ScreenShots/org.png)
   

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
