import { setFunctionError, setAjaxError }   from "../../blocks/errors.js";
import { mediator }                         from "../../blocks/_mediator.js";

import { pushUserDataStorage, 
    getUserDataStorage }                    from "../../blocks/commonFunctions.js";

import { setLogValue }                   from "../logBlock.js";

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

async function getOwner(){
    let owner = getUserDataStorage();

    if (!owner){
        await pushUserDataStorage();
        owner = getUserDataStorage();
    } 

    return owner;
}


async function saveCurrData(servData, name, prefs, owner){

    const pref = returnSentTemplate(name, prefs);

   // if (window.location.pathname !== "/index.html/content"){

        const result   = isPrefExists(servData, name);
        const isExists = result.exists;
     
        if (isExists){
            const id = result.id;
            putPrefs(id, pref);
        } else {
            pref.owner = owner.id;
            postUserPrefs(pref);
        }
      //  restoreData.owner = ownerId.id;
      //  postUserPrefs(restoreData); // тк удаляется при login
   // }

 

}

const userLocation = {};
const restore      = {};

function saveHistoryTrue(){
    const tabbarData  = webix.storage.local.get("userprefsOtherForm");

    if (tabbarData && tabbarData.saveHistoryOpt == "1"){
        return true;
    }
}

async function saveLocalStorage() {

    const owner  = await getOwner();
    
    const path = "/init/default/api/userprefs/";
    const userprefsData = webix.ajax().get(path);

    await userprefsData.then(function(data){
        data = data.json().content;

        const tabbarData  = webix.storage.local.get("tabbar");
        saveCurrData(data, "tabbar"     , tabbarData , owner);

        console.log(saveHistoryTrue(), 'saveHistoryTrue()')
        if (saveHistoryTrue()){
            const tabsHistory = webix.storage.local.get("tabsHistory");
            saveCurrData(data, "tabsHistory", tabsHistory, owner);
        }
        
  
        if (window.location.pathname !== "/index.html/content"){

            const restore = {
                editProp :  webix.storage.local.get("editFormTempData"),
                filter   :  webix.storage.local.get("currFilterState")
            };

         //   saveCurrData(data, "userLocationHref", userLocation, owner);
            saveCurrData(data, "userRestoreData" , restore , owner);
        }
       
    });



    userprefsData.fail(function(err){
        setAjaxError(
            err, 
            logNameFile, 
            "saveLocalStorage"
        );
    });
  
}




function backPage(){
    try{
        const search = window.location.search;
        Backbone.history.navigate("/content" + search, { trigger:true});
        window.location.reload();
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "backPage"
        );
    }
}



async function logoutRouter(){


   // userLocation.href = window.location.href;

    // restore.editProp  = webix.storage.local.get("editFormTempData");
    // restore.filter    = webix.storage.local.get("currFilterState");

    await saveLocalStorage();

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