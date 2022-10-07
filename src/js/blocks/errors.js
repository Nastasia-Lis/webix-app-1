import {setLogValue} from '../blocks/logBlock.js';

function setAjaxError(err,file,func){
    console.log(err);
    setLogValue("error", file+" function "+func+": "+err.status+" "+err.statusText+" "+err.responseURL+" ("+err.responseText+") ");
}

function setFunctionError(err,file,func){
    console.log(err);
    setLogValue("error", file+" function "+func+": "+err);
}

export {
    setAjaxError,
    setFunctionError
};