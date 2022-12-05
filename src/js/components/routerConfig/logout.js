import { setFunctionError, setAjaxError }   from "../../blocks/errors.js";
import { mediator }                         from "../../blocks/_mediator.js";

const logNameFile = "router => logout";

function clearStorage(){
    try{
        webix.storage.local.clear();
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "clearStorage"
        );
    }
}


function backPage(){
    try{
        history.back();
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "backPage"
        );
    }
}

function logoutRouter(){
    const path = "/init/default/logout/";
    const logoutData = webix.ajax().post(path);

    logoutData.then(function (){
        backPage        ();
        mediator.sidebar.clear();
        clearStorage    ();
    });

    logoutData.fail(function (err){
        setAjaxError(
            err, 
            logNameFile, 
            "logoutData"
        );
    });  
}

export{
    logoutRouter
};