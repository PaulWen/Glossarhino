# Description
This Ionic app is a multilingual glossary. The app can be published as a web app optimized for Firefox, Safari, and Chrome. Further, it can be published as hybrid iOS and Android applications. The hybrid mobile versions of the app can be used offline thanks to the use of PouchDB.

# Set-up
1) Install CouchDB on a server
2) Install Node.js on a server
3) Run the glossarhino2.0-server app on the node.js server (see for "glossarhino2.0-server/README.md")
4) Configure the constant "WEB_SERVER_DOMAIN" in "src/app/app-config.ts" with the correct URL of the glossarhino2.0-server app running on Node.js
5) Run "npm install"
6) Run "ionic serve" to execute the app
