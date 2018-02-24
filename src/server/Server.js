//@ts-check

import StorageHandler from './StorageHandler';
import Express from 'express';
import Multer from 'multer';

class Server{
	constructor(){
		const app = Express();
		app.set('port', process.env.PORT || 4000);

		this.upload = Multer()

		this.mapGets(app);
		this.mapPosts(app);
		
		app.listen(4000, () => console.log('Server listening on port 4000!'));
	}

	/** 
	* @param {Express.Router} app
	*/
	mapGets(app){
		app.get('/storage', (req, res) => res.send('Type /storage/current to get last uploaded data file'));
		app.get('/storage/current', (req, res) => StorageHandler.getLatest(res));
	}

	/** 
	* @param {Express.Router} app
	*/
	mapPosts(app){
		app.post('/storage', this.upload.any(), (req, res) => StorageHandler.save(req, res));
	}
}

export default Server;