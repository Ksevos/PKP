//@ts-check

import FileSystem from 'fs';
import Logger from './Logger';

class ArffToJsonParser{
	constructor(){
		this.fileContents = null;
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
			err=>Logger.assertError(err, "Writing to .json file")
		);
	}

	/** 
	* Parses arff file data into local variables
	* @param {string[]} data
	*/
	_parseArffContents(data){
		for(let entry in data){
			if(entry.toLowerCase().indexOf("relation")!=-1)
				this.relation = entry.split(" ")[1];
			if(entry.toLowerCase().indexOf("attribute")!=-1)
				this.attributes.push(entry.split(" ")[1]);
			if(entry.toLowerCase().indexOf("data")!=-1)
				this.data = entry.substring(entry.indexOf("\n")+1).split("\n");
		};
	}

	/** 
	* Constructs Json string from local variables.
	*
	* Note. Not using native Json parser for more control over construction
	* process
	*/
	_getJsonRepresentation(){
		let jsonFile = `"valueNames":[`;

		//Add @ATTRIBUTE entries to Json
		for(let attribute in this.attributes){
			jsonFile += `"${attribute}",`;
        }
        
		//Remove comma at the end
		if(jsonFile[jsonFile.length-1] == ',')
		jsonFile = jsonFile.substring(0, jsonFile.length-1);

		jsonFile += `],"values":[`;

		//Add @DATA entries to Json
		for(let line in this.data){
			if(line!="")
				jsonFile += `[${line}],`;
		}
		//Remove comma at the end
		if(jsonFile[jsonFile.length-1] == ',')
			jsonFile = jsonFile.substring(0, jsonFile.length-1);

		jsonFile = `[{${jsonFile}]}]`;

		return jsonFile;
	}
}

export default ArffToJsonParser;