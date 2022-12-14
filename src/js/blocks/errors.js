import { setLogValue }  from "../components/logBlock.js";
function setAjaxError(err, file, func){
    if (err.status === 400 ||  err.status === 401 || err.status === 404){

        setLogValue(
            "error", 
            file +
            " function " + func + ": " +
            err.status + " " + err.statusText + " " + 
            err.responseURL + " (" + err.responseText + ") "
        );
    } else {
        setLogValue(
            "error", 
            file + 
            " function " + func + ": " +
            err.status + " " + err.statusText + " " +
            err.responseURL + " (" + err.responseText + ") ",
            "version"
        );

        window.alert("Ошибка. Статус: " + err.status + ". Отсутствует соединение с сервером.");
    }
}

let error;
function setToLog(msg){
    console.log(error)
    if (!error){

        const sentObj = {
            level : 3,
            msg   : msg 
        };
       
        const path = "/init/default/api/events";
        const eventData = webix.ajax().post(path, sentObj);
 
        eventData.then(function(data){
            data = data.json();
        });

        eventData.fail(function(err){
            error = true;
            setAjaxError(
                err, 
                "errors", 
                "setToLog"
            );
        });
    }
}

function setFunctionError(err, file, func){
  
    console.log(err);
    const msg = file + " function " + func + ": " + err;

    setLogValue("error", file + " function " + func + ": " + err);

    setToLog(msg);
}

export {
    setAjaxError,
    setFunctionError
};