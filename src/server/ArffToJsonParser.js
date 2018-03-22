//@ts-check

import FileSystem from 'fs';
import Logger from './Logger';

class ArffToJsonParser{
    constructor(){
        /** @type {Buffer} */
        this.fileContents = null;
        /** @type {string} Title*/
        this.relation = null;
        this.attributes = [];
        this.data = [];
    }

    /** 
     * Converts .arff file to .json and saves it with a new name.
     * @param {string} filePath Full path to arff file
     * @param {string} newName A name which will be given to the parsed Json file
     */
    parseAndSave(filePath, newName){
        this.fileContents = FileSystem.readFileSync(filePath);

        this._parseArffContents(this.fileContents.toString("utf8").replace(/\r/g,"").split("@"));

        FileSystem.writeFile(
            filePath.substring(0, filePath.lastIndexOf("/")) + "/data.json",
            this._getJsonRepresentation(),
            err=>Logger.assertError(err, "Writing to .json file"));
    }

    /** 
     * Parses arff file data into local variables
     * @param {string[]} data
     */
    _parseArffContents(data){
        for(let i =0; i<data.length; i++){
            if(data[i].toLowerCase().indexOf("relation")!=-1)
                this.relation = data[i].split(" ")[1];
            if(data[i].toLowerCase().indexOf("attribute")!=-1)
                this.attributes.push(data[i].split(" ")[1]);
            if(data[i].toLowerCase().indexOf("data")!=-1)
                this.data = data[i].substring(data[i].indexOf("\n")+1).split("\n");
        };
    }

    /** 
     * Constructs Json string from local variables.
     *
     * Note. Not using native Json parser for more control over construction
     * process
     * @returns {string} Json string
     */
    _getJsonRepresentation(){
        let jsonFile = `"valueNames":[`;

        //Add @ATTRIBUTE entries to Json
        for(let i=0; i<this.attributes.length; i++){
            jsonFile += `"${this.attributes[i]}",`;
        }

        //Remove comma at the end
        if(jsonFile[jsonFile.length-1] == ',')
            jsonFile = jsonFile.substring(0, jsonFile.length-1);

        jsonFile += `],"values":[`;

        //Add @DATA entries to Json
        for(let i=0; i<this.data.length; i++){
            if(this.data[i]!="")
                jsonFile += `[${this.data[i]}],`;
        }
        //Remove comma at the end
        if(jsonFile[jsonFile.length-1] == ',')
            jsonFile = jsonFile.substring(0, jsonFile.length-1);

        jsonFile = `[{${jsonFile}]}]`;

        return jsonFile;
    }
}

export default ArffToJsonParser;