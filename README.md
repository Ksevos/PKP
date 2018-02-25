# PKP

## 2D/3D visualization app

## Set up guide

1. Install [Node.js](https://nodejs.org/en/) version - 8.9.4
2. Run **npm install** in working dir  -  *installs dependencies*
3. Launch client with **npm start**
4. Launch backend with **npm run server**

Paleidus nepamirškit po to sustabdyt su **CTRL + C**, o jei CMD jau išjungtas tada su **taskkill /f /im node.exe**

## Vidinis API

Norint gaut duomenis iš serverio reikia kreiptis **GET {server}/storage/current**  
kodas: **var data = Axios.get("/storage/current");**

Vėliau gerai būtų padaryt {server}/storage/current$?s=x1,x2,x3
kad galima būtų rinktis, kurias ašis gauti.