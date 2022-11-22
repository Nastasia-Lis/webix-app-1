import { setAjaxError, setFunctionError }   from "../../../../blocks/errors.js";


const logNameFile = "table => createSpace => userContext";

let prefs;
let tableId;
function returnParameter(el, parameter){
    const prefs = JSON.parse(el.prefs)[parameter];
    return prefs;
}

function removePref(el){
    const path          = "/init/default/api/userprefs/" + el.id;
    const userprefsDel = webix.ajax().del(path, el);
                    
    userprefsDel.then(function (data){
        data = data.json();
        if (data.err_type !== "i"){
            setFunctionError(data.err, logNameFile, "removePref");
        }
    });

    userprefsDel.fail(function(err){
        setAjaxError(
            err, 
            logNameFile,
            "userprefsDel"
        );
    });
}

function findPrefs(data, urlParameter){
    const name = "dashboards_context-prefs_" + urlParameter;
    let prefs;
    data.forEach(function(el,i){
        if (el.name == name){
            prefs   = returnParameter(el,"params");
            tableId = returnParameter(el,"field");

            removePref(el);
        }
 
    });
    return prefs;
}

async function getDataPrefs(urlParameter){
    const path          = "/init/default/api/userprefs/";
    const userprefsGet = webix.ajax().get(path);
                    
    await userprefsGet.then(function (data){
        data         = data.json().content;
        const values = Object.values(data);
        prefs = findPrefs(values, urlParameter);
    });

    userprefsGet.fail(function(err){
        setAjaxError(
            err, 
            logNameFile,
            "userprefsGet"
        );
    });
}


async function getUserPrefsContext(urlParameter, parameter){
    await getDataPrefs(urlParameter);

    if (prefs){
        return prefs[parameter];
    }
   
}


export {
    getUserPrefsContext
};