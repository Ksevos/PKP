//@ts-check

import Express from 'express';
import FileSystem from 'fs';

class StorageHandler{

	/** 
	* @param {Express.Request} request
	* @param {Express.Response} response
	*/
	static save(request, response){
		FileSystem.writeFile(
			"./storage/data.txt",
			request.files[0].buffer, 
			err => {
				if(err){
					console.log("File upload failed " + err.message);
				}
				else{
					console.log("File upload sucessful");
				}
			});
	}

	/** 
	* @param {Express.Response} response
	*/
	static getLatest(response){

	}
}

export default StorageHandler;