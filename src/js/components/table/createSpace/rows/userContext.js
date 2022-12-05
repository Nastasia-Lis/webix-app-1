import { setAjaxError, 
         setFunctionError }   from "../../../../blocks/errors.js";
import { mediator }           from "../../../../blocks/_mediator.js";
 
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
            setFunctionError(
                data.err, 
                logNameFile, 
                "removePref"
            );
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


function createQuery(id){
 
    const tableSort = "userprefs.id";
 
    const data = { 
        'query' : tableSort + "=" + id, 
        'sorts' : tableSort, 
        'limit' : 80 , 
        'offset': 0 
    };

    const  queryString = mediator.createQuery(data);

    return queryString;
}

async function getDataPrefs(urlParameter){
    const query        = createQuery(urlParameter);
    const path         = "/init/default/api/smarts?" + query ;
    const userprefsGet = webix.ajax().get(path);
                    
    await userprefsGet.then(function (data){
        data         = data.json().content;
        const item   = data[0];
        
        if (item){
            prefs        = returnParameter(item, "params");
            tableId      = returnParameter(item, "field");
            removePref(item);
        }
    
    });

    userprefsGet.fail(function (err){
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