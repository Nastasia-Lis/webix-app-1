import {setLogValue} from "./logBlock.js";
import {setAjaxError,setFunctionError} from "./errors.js";

const STORAGE = {};

function getTableNames (content){
    let tableNames = [];
    try{
        Object.values(content).forEach(function(el,i){
            tableNames.push({
                id:Object.keys(content)[i], 
                name:(el.plural) ? el.plural : el.singular
            });
        });
    } catch (err){   
        setFunctionError(err,"globalStorage","getTableNames")
    }
    return tableNames;
}

function checkNotAuth (err){
    if (err.status               === 401                  && 
        window.location.pathname !== "/index.html"        && 
        window.location.pathname !== "/init/default/spaw/"){
        Backbone.history.navigate("/", { trigger:true});
    }
}

function getData (fileName){
 
 
    if (    window.location.pathname !== "/index.html"          &&  
            window.location.pathname !== '/init/default/spaw'   ||
            fileName == "whoami"
        ){
        return webix.ajax().get(`/init/default/api/${fileName}.json`)
            .then(function (data) {
                STORAGE[fileName] = data.json();
                try{
                    if (fileName == "fields" && STORAGE[fileName]){
                        STORAGE.tableNames = getTableNames (STORAGE[fileName].content);
                    }
                } catch (err){   
                    setFunctionError(err,"globalStorage","getData")
                }
                return STORAGE[fileName];
            }).catch(err => {
                setAjaxError(err, "globalStorage","getData");
                checkNotAuth (err);
            }
        );
    }
    
}

export{
    getData,
    STORAGE,
};