import {setLogValue} from '../blocks/logBlock.js';

function setAjaxError(err,file,func){
    if (err.status === 400 ||  err.status === 401 || err.status === 404){
        setLogValue("error", file+" function "+func+": "+err.status+" "+err.statusText+" "+err.responseURL+" ("+err.responseText+") ");
    } else {
        setLogValue("error", file+" function "+func+": "+err.status+" "+err.statusText+" "+err.responseURL+" ("+err.responseText+") ","version");
        window.alert("Ошибка. Статус: " + err.status+". Отсутствует соединение с сервером.");
    }
}

function setFunctionError(err,file,func){
    console.log(err);
    setLogValue("error", file+" function "+func+": "+err);
}

export {
    setAjaxError,
    setFunctionError
};