//@ts-check

import FileSystem from 'fs';
import Logger from './Logger';

class ArffToJsonParser {
    constructor() {
        /** @type {Buffer} */
        this.fileContents = null;
        /** @type {string} Title*/
        this.relation = null;
        this.attributes = [];
        this.data = [];
        this.classes = [];
    }

    /**
     * Converts .arff file to .json and saves it with a new name.
     * @param {string} filePath Full path to arff file
     * @param {string} newName A name which will be given to the parsed Json file
     */
    parseAndSave(filePath, newName) {
        this.fileContents = FileSystem.readFileSync(filePath);

        this._parseArffContents(this.fileContents.toString("utf8").replace(/\r/g, "").split("@"));

        FileSystem.writeFile(
            filePath.substring(0, filePath.lastIndexOf("/")) + "/data.json",
            this._getJsonRepresentation(),
            err => Logger.assertError(err, "Writing to .json file"));
    }

    /**
     * Parses arff file data into local variables
     * @param {string[]} data
     */
    _parseArffContents(data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].toLowerCase().indexOf("relation") != -1)
                this.relation = data[i].split(" ")[1];
            if (data[i].toLowerCase().indexOf("attribute") != -1) {
                this.attributes.push(data[i].split(" ")[1]);
                if (data[i].toLowerCase().indexOf('class') != -1) {
                    const rxp = /{([^}]+)}/g;
                    let mat = null;
                    while (mat = rxp.exec(data[i])) {
                        this.classes = mat[1].split(',').map((item) => {
                            return `"${item}"`;
                        });
                    }
                }
            }
            if (data[i].toLowerCase().indexOf("data") != -1) {
                const rowLen = this.attributes.length;
                const dataTemp = data[i].substring(data[i].indexOf("\n") + 1).split("\n").map(r => {
                    if (r.length > 0) {
                        const rowElements = r.split(',');
                        let row = (rowElements.map((rowElement, index) => {
                            if (rowLen === index + 1) {
                                return `"${rowElement}"`;
                            } else {
                                return rowElement;
                            }
                        }));
                        return `[${row}]`;
                    }
                });
                // filter(Boolean) removes undefined values from array
                this.data = dataTemp.filter(Boolean);
            }
        };
    }

    /**
     * Constructs Json string from local variables.
     *
     * Note. Not using native Json parser for more control over construction
     * process
     * @returns {string} Json string
     */
    _getJsonRepresentation() {
        let jsonFile = `"valueNames":[`;

        //Add @ATTRIBUTE entries to Json
        for (let i = 0; i < this.attributes.length; i++) {
            jsonFile += `"${this.attributes[i]}",`;
        }

        //Remove comma at the end
        if (jsonFile[jsonFile.length - 1] == ',')
            jsonFile = jsonFile.substring(0, jsonFile.length - 1);

        jsonFile += `],"classes":[`;

        //Add @ATTRIBUTE CLASS entries to Json
        jsonFile += `${this.classes}`;

        jsonFile += `],"values":[`;

        //Add @DATA entries to Json
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i] != "") {
                jsonFile += `${this.data[i]},`;
            }
        }
        //Remove comma at the end
        if (jsonFile[jsonFile.length - 1] == ',')
            jsonFile = jsonFile.substring(0, jsonFile.length - 1);

        jsonFile = `[{${jsonFile}]}]`;

        return jsonFile;
    }
}

export default ArffToJsonParser;