## Installation

Do this installation process on a dummy account with sudo.

Linux:

  1. git clone https://github.com/cjordog/NRLWebsite;
     cd NRLWebsite
  2. copy the following into a file called .env
  		AUTH0_CLIENT_ID="toyCVGt8l5mNrfNDmcsGi57YjyF03KHL"
		AUTH0_DOMAIN="oceantuneucla.auth0.com"
		AUTH0_CLIENT_SECRET="t-BcTu43rj5EjTAmvfYPLfDvwwyEZhpdpsgKsFABC5T7XxX1ROSB4esRY8LhHmhR"
		AUTH0_CALLBACK_URL = "http://45.79.96.15:80/callback"
  3. change AUTH0_CALLBACK_URL to "http://serverURL:80/callback"
  4. change the host in demo/app.js on line 343 to the serverURL
  5. add http://serverURL:80/callback to the callback list on the auth0 oceantuneUCLA website. Ask CJ or Steven for the account details.
  6. ./exportStart
  7. sudo apt-get install nodejs
  8 sudo ln -s /usr/bin/nodejs /usr/bin/node
  9. sudo apt-get install npm
  10. npm install
  11. screen
  12. npm start
  13. ctrl-A, ctrl-D

Mac:

  1. git clone https://github.com/cjordog/NRLWebsite;
     cd NRLWebsite
  2. ssh-keygen
  3. cat ~/.ssh/id_rsa.pub | ssh user@machine "cat >> ~/.ssh/authorized_keys"
  4. ./exportStart
  5. brew install node
  6. brew install npm
  7. npm install
  8. npm start