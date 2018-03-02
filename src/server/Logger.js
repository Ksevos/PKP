//@ts-check

var Logger = (()=>{
  let _loggerOn = false;

  return {
      log: message => {
        if(_loggerOn) 
          console.log(message)
      },
      assertError: (error, actionDescription) => {
        if(!_loggerOn)
          return;

        if(error)
          console.log(`${actionDescription} - failed. ${error.message}`);
        else
          console.log(`${actionDescription} - successful`);
      },
      turnOn: () =>{_loggerOn = true}
  };
})();

export default Logger;