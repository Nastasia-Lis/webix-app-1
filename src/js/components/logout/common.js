import { setLogValue }                   from "../logBlock.js";
import { setAjaxError,setFunctionError } from "../../blocks/errors.js";
import { setStorageData }                from "../../blocks/storageSetting.js";

import { Button }                        from "../../viewTemplates/buttons.js";
import { Popup }                         from "../../viewTemplates/popup.js";

import { pushUserDataStorage, 
    getUserDataStorage }                 from "../../blocks/commonFunctions.js";


const logNameFile = "logout => common";

function putPrefs(id, sentObj){

    const path    = "/init/default/api/userprefs/" + id;
    const putData = webix.ajax().put(path, sentObj);

    putData.then(function(data){
   
        data = data.json();
    
        if (data.err_type !== "i"){
            setLogValue("error", data.err);
        }
    });

    putData.fail(function(err){
        setAjaxError(
            err, 
            logNameFile, 
            "putUserPrefs"
        );
    });   
}

function isPrefExists(data, name){
    const result = {
        exists : false
    };
 
    try{
        data.forEach(function(el){
            if (el.name == name){
                result.exists = true;
                result.id     = el.id;
            } 
        });  
    }   catch(err){
        setFunctionError(
            err, 
            logNameFile, 
            "isPrefExists"
        );
    }
    
    return result;
}

function postUserPrefs(sentObj){

    const path     = "/init/default/api/userprefs/";
    const postData = webix.ajax().post(path, sentObj);

    postData.then(function(data){
        data = data.json();
 
        if (data.err_type !== "i"){
            setFunctionError(
                data.err, 
                logNameFile, 
                "putUserPrefs"
            );
        }
    });

    postData.fail(function(err){
        setAjaxError(
            err, 
            logNameFile, 
            "postUserPrefs"
        );
    });

}


function returnSentTemplate(name, data){
    return {
        name  : name,
        prefs : data
    };
}

async function logout() {
   
    // let ownerId = getUserDataStorage();

    // if (!ownerId){
    //     await pushUserDataStorage();
    //     ownerId = getUserDataStorage();
    // }

    // const path = "/init/default/api/userprefs/";
    // const userprefsData = webix.ajax().get(path);

    // userprefsData.then(function(data){
    //     data = data.json().content;

    //     const location    = {};
    

    //     location.href     = window.location.href;

    //     const restore = {
    //         editProp :  webix.storage.local.get("editFormTempData"),
    //         filter   :  webix.storage.local.get("currFilterState")
    //     };

    //     const locationData = returnSentTemplate("userLocationHref", location);
    //     const restoreData  = returnSentTemplate("userRestoreData",  restore );
   
    //     if (window.location.pathname !== "/index.html/content"){

    //         const locationResult  = isPrefExists(data, "userLocationHref");
    //         const isExists        = locationResult.exists;
      
         
    //         if (isExists){
    //             const id = locationResult.id;
    //             putPrefs(id, locationData);
    //         } else {
    //             locationData.owner = ownerId.id;
    //             postUserPrefs(locationData);
    //         }
    //         restoreData.owner = ownerId.id;
    //         postUserPrefs(restoreData); // тк удаляется при login
    //     }

       

    // });

    // userprefsData.then(function(){
    //     Backbone.history.navigate("logout?auto=true", { trigger:true});
    // });

    // userprefsData.fail(function(err){
    //     setAjaxError(
    //         err, 
    //         logNameFile, 
    //         "logout"
    //     );
    // });
    Backbone.history.navigate("logout?auto=true", { trigger:true});
  
}


function checkNotAuth (err){
 
    let notAuth = false;
 
    if (err.status               === 401                  && 
        window.location.pathname !== "/index.html"        && 
        window.location.pathname !== "/init/default/spaw/"){
        
        notAuth = true;
        
        let params    = new URLSearchParams(document.location.search);
        let autoParam = params.get("auto");

        const prefs = {
            href : window.location.href
        };

        if (!autoParam){
            setStorageData ("outsideHref", JSON.stringify(prefs) );
        }
   
   
    //Backbone.history.navigate("/", { trigger:true});
    //window.location.reload();

    }

    return notAuth;
}

export {
    logout,
    checkNotAuth,
};