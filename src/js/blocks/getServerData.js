import { setFunctionError, setAjaxError } from "./errors.js";


const logNameFile = "getServerData";


function isErrorsExists(data, errorActions){
    const type = data.err_type;
    const err  = data.err;

    if (type && err){

        if (type !== "i"){

            if (errorActions){
                errorActions();
            }
           
       

            setFunctionError(
                err, 
                "getServerData", 
                "checkErrors"
            );

            return true;
        }

    }
}

class ServerData {
    constructor (options){
        this.id            = options.id;
        this.isFullPath    = options.isFullPath;
        this.errorActions  = options.errorActions;
    }

    returnPath(){

        const path = `/init/default/api/${this.id}`;
     
        return this.isFullPath ? this.id : path;
    }

    validate(data){
        if (data){
            data = data.json();

            if (isErrorsExists(data, this.errorActions)){
                return false;
            } else {
                return data;
            }
         
        } else {
            return false;
        }
    }

    get(){
        const self = this;
     
        if (self.id){
        
            const path = self.returnPath();
       
             
            return webix.ajax().get(path)
            .then(function(data){
                return self.validate(data);
            })
    
            .fail(function (err){
                if (self.errorActions){
                    self.errorActions();
                }
               
    
                setAjaxError(
                    err, 
                    logNameFile, 
                    "get server data"
                );
            });   
        }  
    }

    put(sentObj){
        const self = this;

        if (self.id){
        
            const path = self.returnPath();
    
            return webix.ajax().put(path, sentObj)
            .then(function(data){
                return self.validate(data);
            })

    
            .fail(function (err){
                if (self.errorActions){
                    self.errorActions();
                }
               
    
                setAjaxError(
                    err, 
                    logNameFile, 
                    "put server data"
                );
            });   
        }  
    }

    post(sentObj){
        const self = this;

        if (self.id){
        
            const path = self.returnPath();
    
            return webix.ajax().post(path, sentObj)
            .then(function(data){
                return self.validate(data);
            })

    
            .fail(function (err){
                if (self.errorActions){
                    self.errorActions();
                }
               
    
                setAjaxError(
                    err, 
                    logNameFile, 
                    "post server data"
                );
            });   
        }  
    }

    del(delObj){
        const self = this;

        if (self.id){
        
            const path = self.returnPath();
    
            return webix.ajax().del(path, delObj)
            .then(function(data){
                return self.validate(data);
            })

    
            .fail(function (err){
                if (self.errorActions){
                    self.errorActions();
                }
               
    
                setAjaxError(
                    err, 
                    logNameFile, 
                    "del server data"
                );
            });   
        }  
    }

}

//example


// new ServerData({
    
//     id           : url,
//     isFullPath   : true,
//     errorActions : errorActions
   
// }).get().then(function(data){

//     if (data){

//         const content = data.content;

//         if (content){


//         }
//     }
     
// });

 
export {
    ServerData
};