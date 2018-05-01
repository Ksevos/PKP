//@ts-check

import Express from 'express';
import FileSystem from 'fs';
import ArffToJsonParser from './ArffToJsonParser';
import Logger from './Logger';
import Socket from 'socket.io';

/**
 * Methods to interract with local storage
 */
class StorageHandler{

    /** 
     * Save uplodaded data
     * @param {Express.Request} request
     * @param {Express.Response} response
     * @param {Socket.Server} socket 
     */
    static save(request, response, socket){
        if(!FileSystem.existsSync('./storage'))
            FileSystem.mkdirSync('./storage');

        FileSystem.writeFile(
            "./storage/data.arff",
            request.file.buffer, 
            err => {
                Logger.assertError(err, "File upload");
                if(!err){
                    this._parseArffToJson();
                    this._broadcastMessage(socket);
                }
            }
        );
    }

    /**
     * Broadcast to client, that data has been uploaded
     * @param {Socket.Server} socket
     * @private
     */
    static _broadcastMessage(socket){
        socket.emit('dataUploaded', true);
    } 

    /**
     * Parse uploaded .arff file
     * @private
     */
    static _parseArffToJson(){
        Logger.log("Parsing .arff file into .json");

        const parser = new ArffToJsonParser();
        parser.parseAndSave("./storage/data.arff", "data");
        
    }

    /** 
     * Get latest uploaded data from the storage
     * @param {Express.Response} response
     */
    static getLatest(response){
        try{
            response.json(
                JSON.parse(
                    FileSystem.readFileSync("./storage/data.json","utf8")));
        }
        catch(error){
            console.log(error);
        }   
    }
}

export default StorageHandler;