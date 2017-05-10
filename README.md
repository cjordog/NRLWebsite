## Installation
Linux:

  1. git clone https://github.com/cjordog/NRLWebsite
     cd NRLWebsite
  2. ssh-keygen
  3. ssh-copy-id username@serverAddress
  4. ./exportStart
  5. sudo apt-get install node
  6. sudo apt-get install npm
  7. npm install
  8. npm start

Mac:

  1. git clone https://github.com/cjordog/NRLWebsite
     cd NRLWebsite
  2. ssh-keygen
  3. cat ~/.ssh/id_rsa.pub | ssh user@machine "cat >> ~/.ssh/authorized_keys"
  4. ./exportStart
  5. brew install node
  6. brew install npm
  7. npm install
  8. npm start