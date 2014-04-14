Scavhn Server
==================

## Scavhn Server
NodeJS-based RESTful services for the Scavhn iOS app.

### Getting Started
All of the node modules needed by the server and there is a full MongoDB distro in the repo and referenced in the project.  The only requirement is to have NodeJS installed.  While it is runnable on Windows, the setup scripts are BASH-based.  It will run on OSX, should run on Linux, may be runnable on Windows under Cygwin or by porting the setup scripts to windows shell or powershell.

To run the scavhn server on OSX:

1. Open a Terminal window and navigate into the bin folder
2. Start Mongo by running the start_mongo.sh script.
  The console output should be something like 
  ```
  Sun Apr 13 17:08:31.064 [initandlisten] MongoDB starting : pid=910 port=27017 dbpath=../db 64-bit host=[hostname]
  Sun Apr 13 17:08:31.064 [initandlisten] db version v2.4.8
  Sun Apr 13 17:08:31.064 [initandlisten] git version: a350fc38922fbda2cec8d5dd842237b904eafc14
  Sun Apr 13 17:08:31.064 [initandlisten] build info: Darwin bs-osx-106-x86-64-2.10gen.cc 10.8.0 Darwin Kernel Version 10.8.0: Tue Jun  7 16:32:41 PDT 2011; root:xnu-1504.15.3~1/RELEASE_X86_64 x86_64 BOOST_LIB_VERSION=1_49
  Sun Apr 13 17:08:31.064 [initandlisten] allocator: system
  Sun Apr 13 17:08:31.064 [initandlisten] options: { dbpath: "../db" }
  Sun Apr 13 17:08:31.068 [initandlisten] journal dir=../db/journal
  Sun Apr 13 17:08:31.068 [initandlisten] recover : no journal files present, no recovery needed
  Sun Apr 13 17:08:31.206 [websvr] admin web console waiting for connections on port 28017
  Sun Apr 13 17:08:31.206 [initandlisten] waiting for connections on port 27017
  ```

3. Open a new terminal window and navigate back into the bin folder.  Load the Mongo server with scavenger hunt test data by running the dbload.sh script.  The output should look like:
  ```
  loading reference data
  MongoDB shell version: 2.4.8
  connecting to: scavs_dev
  [object Object]
  connected to: localhost
  Sun Apr 13 17:44:04.573 imported 3 objects
  connected to: localhost
  Sun Apr 13 17:44:04.628 check 9 30
  Sun Apr 13 17:44:04.628 imported 30 objects
  connected to: localhost
  Sun Apr 13 17:44:04.674 imported 3 objects
  associating items with scavs
  ~/Projects/REMD/scavhn-server/bin/dbapp ~/Projects/REMD/scavhn-server/bin
  inside pscav
  looking for items for scav: vulture level: Beginner
  looking for items for scav: owl level: Intermediate
  looking for items for scav: raccoon level: Expert
  updated document: vulture now has: 10 items 
  updated document: owl now has: 10 items 
  updated document: raccoon now has: 10 items
  ```

4. From the window opened in the above step, enter Ctrl + C to get back to a prompt.  Again from the bin folder, start the REST server by running the start_scavhn.sh script.  Console output should be:
  ```
  Express server listening on port 3000
  ```
  
  The server should now be running.  To test it, try hitting the /scavs GET endpoint from a browser by entering the url:
  
  ```
  http://localhost:3000/scavhn/v1/api/scavs
  ```
  
  CORS has been enabled, so you should also be able to hit it with your IP:

  ```  
  http://[ip address]:3000/scavhn/v1/api/scavs
  ```
  
  You should get JSON back containing test data for 3 full Scav games.
  
  You will need to ensure it can run this way in order for the Scavhn iOS app to function correctly.
 
 
### Stopping the Server
Stopping the server is a two step process.  You need to kill the REST server, then kill mongo.  

To stop the REST server, Enter Ctrl + C in the Terminal window running the start_scavhn.sh script.  Terminal will return you to a prompt.

Once stopped, kill mongo by running the stop_mongo.sh script from the bin folder.  You can do this by 

1. Returning to the Terminal window you started mongo from
2. Enter Ctrl + C to get back to a prompt if it isn't already
3. Run ```./stop_mongo.sh```

