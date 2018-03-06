//@ts-check

import StorageHandler from './StorageHandler';
import Express from 'express';
import Multer from 'multer';
import HTTP from 'http';
import Socket from 'socket.io';

class Server{
    constructor(){
        this.app = Express();
        
        this.app.use((req, res, next)=>{
            res.header('Access-Control-Allow-Origin', "*");
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
        });
    
        this.app.set('port', process.env.PORT || 4000);
        this.server = new HTTP.Server(this.app);
        this.socket = Socket(this.server);
        this.upload = Multer();

        this.mapGets(this.app);
        this.mapPosts(this.app);

        this.app.listen(4000, () => console.log('Server listening on port 4000!'));
    }

    /** 
     * @param {Express.Router} app
     */
    mapGets(app){
        app.get(
            '/storage', 
            (req, res) => res.send('Type /storage/current to get last uploaded data file'));
        app.get('/storage/current', (req, res) => StorageHandler.getLatest(res));
    }

    /** 
     * @param {Express.Router} app
     */
    mapPosts(app){
        app.post('/storage', this.upload.any(), (req, res) => StorageHandler.save(req, res, this.socket));
    }
}

export default Server;