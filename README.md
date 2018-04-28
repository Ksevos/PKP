# PKP

Master [![Build Status](https://travis-ci.org/Ksevos/PKP.svg?branch=master)](https://travis-ci.org/Ksevos/PKP)  
Develop [![Build Status](https://travis-ci.org/Ksevos/PKP.svg?branch=develop)](https://travis-ci.org/Ksevos/PKP)

## 2D/3D visualization app

## Coding style
1. Write private methods with _ i.e. \_calculateSomething()
2. Functions that return boolean value should be formed with
a is/has/does/etc. in front like isBlue(), isLoaded(),  
isValid()
3. Use 4 spaces as tabs, configure your IDE if you have to
4. Use ;

## Other guidelines
1. Commit as often as you can, but only functional code
2. Test before commiting
3. Make a push request if you finished your task
4. If you can, document the function like this:
```
  /**
  * Your description goes here
  * @param {Expected parameter type goes here} 'parameter' goes here
  */
  doStuff(parameter){
   ...
  }
```
5. Don't forget clean code principles

## Set up guide

1. Install [Node.js](https://nodejs.org/en/) version - 8.9.4
2. Run **npm install** in working dir  -  *installs dependencies*
3. Launch client with **npm start**
4. Launch backend with **npm run server**

Paleidus nepamirškit po to sustabdyt su **CTRL + C**, o jei CMD jau išjungtas tada su **taskkill /f /im node.exe**

## Launch built website

Before doing anything **npm install -g serve**

cmd 1

1. **npm run build-server**
2. **node build-server/index.js**

cmd 2

1. **npm run build**
2. **serve -s -p 3000 build**
3. View localhost:3000 in web

## Documentation

Make sure to do this in project's root directory.

To generate JSDocs use the following command:

    jsdoc -p -r ./src/ ./README.md -d ./docs

Alternatively, launch shell script  ```/src/resources/generate_jsdocs.bat```.

## Vidinis API

Norint gaut duomenis iš serverio reikia kreiptis **GET {server}/storage/current**  
kodas: **var data = Axios.get("/storage/current");**

Vėliau gerai būtų padaryt {server}/storage/current$?s=x1,x2,x3
kad galima būtų rinktis, kurias ašis gauti.
