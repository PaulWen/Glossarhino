# DESCRIPTION
This Ionic 3 app represents a multilingual glossary. The app can be used as a web app
on Firefox, Safari and Chrome as well as an iOS and Android app.

# INSTALLATION
1) install CouchDB on a server
2) install Node.js on a server
3) run the glossarhino2.0-server app on the node.js server (see for "glossarhino2.0-server/README.md")
4) Configure the constant "WEB_SERVER_DOMAIN" in "src/app/app-config.ts" with the correct URL of the glossarhino2.0-server app running on Node.js
5) run "npm install"
6) run "ionic serve" to execute the app
