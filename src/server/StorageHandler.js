//@ts-check

import Express from 'express';
import FileSystem from 'fs';
import ArffToJsonParser from './ArffToJsonParser';
import Logger from './Logger';
import Socket from 'socket.io';

class StorageHandler{

    /** 
     * @param {Express.Request} request
     * @param {Express.Response} response
     * @param {SocketIO.Server} socket 
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
     * 
     * @param {SocketIO.Server} socket 
     */
    static _broadcastMessage(socket){
        socket.emit('dataUploaded', true);
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