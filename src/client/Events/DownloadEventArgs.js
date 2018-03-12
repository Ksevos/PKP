//@ts-check

class DownloadEventArgs{
    /**
     * @param {{valueNames:string[],values:[number[]]}} data 
     * @param {{x:string,y:string,z:string}} axes 
     */
    constructor(data, axes){
        this.data = data;
        this.axes = axes;
    }

    /**
     * @returns {{valueNames:string[],values:[number[]]}}
     */
    getData(){
        return this.data;
    }

    /** 
     * @returns {{x:string,y:string,z:string}}}
     */
    getAxes(){
        return this.axes;
    }
}

export default DownloadEventArgs;