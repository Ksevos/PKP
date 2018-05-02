//@ts-check

/**
 * Used to get various configuration settings
 */
let Configuration = (() => {
    return {
        getFullClientLink(){
            if(process.env.NODE_ENV !== 'production')
                return "http://localhost:3000"
            else
                return process.env.CLIENT_LINK;
        },
        getFullServerLink(){
            if(process.env.NODE_ENV !== 'production')
                return "http://localhost:4000"
            else
                return process.env.SERVER_LINK;
        },
        getClientPort(){
            return 3000;
        },
        getServerPort(){
            return 4000;
        }
    };
})();


export default Configuration;