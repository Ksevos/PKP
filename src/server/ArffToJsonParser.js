//@ts-check

import FileSystem from 'fs';
import Logger from './Logger';

/**
 * Used for uploaded .arff file parsing
 */
class ArffToJsonParser {
    constructor() {
        /** @type {Buffer}*/
        this.fileContents = null;
        /** @type {string}*/
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

        let cleanedData = this._cleanData(this.fileContents.toString("utf8").replace(/\r/g, ""));

        this._parseArffContents(cleanedData);

        FileSystem.writeFile(
            filePath.substring(0, filePath.lastIndexOf("/")) + "/data.json",
            this._getJsonRepresentation(),
            err => Logger.assertError(err, "Writing to .json file"));
    }

    /**
     * Clean up .arff file of comments, unwanted symbols and newlines
     * @param {string} data 
     * @returns {string[]}
     */
    _cleanData(data){
        /** @type {string[]} */
        let cleanData = [];
        //Split into rows
        let rows = data.split(/\n/g);
        for(let i = 0; i < rows.length; i++){
            //Remove comments
            let commentlessSide = rows[i].split("%")[0];
            if(!commentlessSide)
                continue;
            
            //Remove tabs
            commentlessSide = commentlessSide.replace(/\t/g, ' ');

            //Remove unnecesarry spaces
            commentlessSide = commentlessSide.replace(/\s{2,}/g, '')
                                             .trim()
                                             .replace(/(\s{1},\s{1})|(\s{1},)|(,\s{1})/g, ',')
                                             .replace(/{\s/g, '{')
                                             .replace(/\s}/g, '}');

            if(commentlessSide)
               cleanData.push(commentlessSide);
        }
        return cleanData;
    }

    /**
     * Parses arff file data into local variables
     * @param {string[]} data
     * @private
     */
    _parseArffContents(data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].toLowerCase().indexOf("@relation") != -1)
                this.relation = data[i].substr(('@relation ').length);
            if (data[i].toLowerCase().indexOf("@attribute") != -1) {
                this._parseAttribute(data[i]);
            }
            if (data[i].toLowerCase().indexOf("@data") != -1) {
                this._parseData(data.slice(i+1));
            }
        };
    }

    /**
     * Parse @ATTRIBUTE part of the file
     * @param {string} row
     * @private
     */
    _parseAttribute(row){
        let attributeName = row.substr(('@attribute ').length).replace(/\snumeric|\sinteger|\sreal|\sstring|\sNUMERIC|\sINTEGER|\sREAL|\sSTRING/g, '');
        if(attributeName.toLowerCase().includes('{') || attributeName.toLowerCase().includes("}")){
            let attributeParts = attributeName.split('{');
            attributeName = attributeParts[0].trim();
            let classes = attributeParts[1].replace('}','').split(',');

            for(let j = 0; j < classes.length; j++){
                this.classes.push('"' + classes[j].replace(/'/g, '').trim() + '"');
            }
        }
        this.attributes.push('"' + attributeName.replace(/'/g, '').trim() + '"');
    }
    /**
     * Parse @DATA part of the file
     * @param {string[]} rows 
     * @private
     */
    _parseData(rows){
        for(let i = 0; i < rows.length; i++){
            /** @type {any} */ // isNaN wants numeric
            let dataRow = rows[i].replace(/'/g, '').split(',');
            for(let j = 0; j < dataRow.length; j++){
                if(j == dataRow.length - 1)
                    dataRow[j] = '"' + dataRow[j] + '"';
            }
            this.data.push(dataRow);
        }
    }

    /**
     * Constructs Json string from local variables.
     *
     * Note. Not using native Json parser for more control over construction
     * process
     * @returns {string} Json string
     * @private
     */
    _getJsonRepresentation() {
        let jsonFile = `"valueNames":[${this.attributes}],"classes":[${this.classes}],"values":[`;

        //Add @DATA entries to Json
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i] != "") {
                jsonFile += `[${this.data[i]}],`;
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