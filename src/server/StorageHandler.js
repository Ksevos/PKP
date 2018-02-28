//@ts-check

import Express from 'express';
import FileSystem from 'fs';
import ArffToJsonParser from './ArffToJsonParser';
import Logger from './Logger';

class StorageHandler{

	/** 
	* @param {Express.Request} request
	* @param {Express.Response} response
	*/
	static save(request, response){
		FileSystem.writeFile(
			"./storage/data.arff",
			request.files[0].buffer, 
			err => {
				Logger.assertError(err, "File upload");
				if(!err)
					this._parseArffToJson();
			}
		);
	}

	static _parseArffToJson(){
		Logger.log("Parsing .arff file into .json");

		const parser = new ArffToJsonParser();
		parser.parseAndSave("./storage/data.arff", "data");
		
	}

	/** 
	* @param {Express.Response} response
	*/
	static getLatest(response){
		response.json(
			JSON.parse(
				FileSystem.readFileSync("./storage/data.json","utf8")));
	}
}

export default StorageHandler;