//@ts-check

import FileSystem from 'fs';
import Logger from './Logger';

class ArffToJsonParser{
	constructor(){
		this.fileContents = null;
	}

	/** 
	* Converts .arff file to .json and saves it with a new name.
	* @param {string} filePath Full path to arff file
	* @param {string} newName A name which will be given to the parsed Json file
	*/
	parseAndSave(filePath, newName){

		this.fileContents = FileSystem.readFileSync(filePath);

		FileSystem.writeFile(
			filePath.substring(0, filePath.lastIndexOf("/")) + "/data.json",
			this.fileContents,
			err=>Logger.assertError(err, "Writing to .json file")
		);
	}

	/** 
	* @param {string} filePath
	*/
	static hasArffExtention(filePath){
		if(filePath.split('.').pop().toLowerCase() == "arff")
			return true;
		return false;
	}

}

export default ArffToJsonParser;