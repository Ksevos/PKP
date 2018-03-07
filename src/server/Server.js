//@ts-check

import StorageHandler from './StorageHandler';
import Express from 'express';
import Multer from 'multer';
import HTTP from 'http';
import Socket from 'socket.io';

class Server{
    constructor(){
        this.app = Express();
        
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "http://localhost:3000");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Credentials", "true");
            next();
        });
    
        this.app.set('port', process.env.PORT || 4000);
				

        this.upload = Multer();

        this.mapGets(this.app);
        this.mapPosts(this.app);

        this.server = 
            this.app.listen(4000, () => console.log('Server listening on port 4000!'));

        //this.server = HTTP.createServer(this.app);
        //this.socket = Socket(this.server);
        this.socket = Socket.listen(this.server);
    }

    /** 
		 * Map get requests with their callbacks
     * @param {Express.Router} app
     */
    mapGets(app){
        app.get(
            '/storage', 
            (req, res) => res.send('Type /storage/current to get last uploaded data file'));
        app.get('/storage/current', (req, res) => StorageHandler.getLatest(res));
    }

    /** 
		 * Map post requests with their callbacks
     * @param {Express.Router} app
     */
    mapPosts(app){
        app.post('/storage', this.upload.any(), (req, res) => StorageHandler.save(req, res, this.socket));
    }
}

export default Server;