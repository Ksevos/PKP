//@ts-check

import StorageHandler from './StorageHandler';
import Express from 'express';
import Multer from 'multer';
import Socket from 'socket.io';
import Path from 'path';

class Server{
    constructor(){
        this.app = Express();
        this.PORT = process.env.PORT || 4000;
        this.app.set('port', this.PORT);
        this.app.use(this.configureAccessControl);
        this.upload = this.configureMulter();

        this.mapGets(this.app); // Route get requests
        this.mapPosts(this.app); // Route post requests

        // Error handlers, must be last
        this.app.use(this.configureUploadErrorHandling);

        this.server = 
            this.app.listen(this.PORT, (err) =>  {
                if (err) throw err;
                console.log(`Server listening on port ${this.PORT}!`)
            });

        this.socket = Socket.listen(this.server);
    }

    /**
     * Configure parameters necessary for Socket
     * @param {*} req 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Express.NextFunction} next 
     */
    configureAccessControl(req, res, next){
        res.header("Access-Control-Allow-Origin", "https://vgtupkp.herokuapp.com");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Credentials", "true");
        next();
    }

    /**
     * Handle failed upload requests
     * @param {Error} error 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Express.NextFunction} next 
     */
    configureUploadErrorHandling(error, req, res, next){
        if(error.message === 'Only .arff files are allowed')
            res.status(415).send({
                type: 'UploadError',
                message: error.message
                });
        if(error.code === 'LIMIT_FILE_SIZE')
            res.status(413).send({
                type: 'UploadError',
                message: 'File is too large. Max 5Mb'
            });
        next(error);
    }

    /**
     * Used for file upload
     * @returns {Multer.Instance}
     */
    configureMulter(){
        return Multer({
            limits: {fileSize: 5*1024*1024, files:1},
            fileFilter: (req, file, callback) => {
                let extention = Path.extname(file.originalname);
                if(extention !== '.arff') {
                    return callback(new Error('Only .arff files are allowed'), false);
                }
                callback(null, true);
            }
        });
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
        app.post(
            '/storage', 
            this.upload.single('dataFile'), 
            (req, res) => {
                StorageHandler.save(req, res, this.socket);
            });
    }
}

export default Server;