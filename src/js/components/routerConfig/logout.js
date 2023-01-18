import { setFunctionError }     from "../../blocks/errors.js";
import { mediator }             from "../../blocks/_mediator.js";
import { ServerData }           from "../../blocks/getServerData.js";

import { returnOwner, isArray } from "../../blocks/commonFunctions.js";


const logNameFile = "router/logout";

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

    new ServerData({  
        id : `userprefs/${id}`
    }).put(sentObj);
  
}

function isPrefExists(data, name){
    const result = {
        exists : false
    };
 
    if (isArray(data, logNameFile, "isPrefExists")){
        data.forEach(function(el){
            if (el.name == name){
                result.exists = true;
                result.id     = el.id;
            } 
        }); 
    }
        
  
    
    return result;
}

function postUserPrefs(sentObj){

    new ServerData({  
        id : "userprefs"
    }).post(sentObj);

}


function returnSentTemplate(name, data){
    return {
        name  : name,
        prefs : data
    };
}

async function getOwner(){
    const owner = await returnOwner();

    return owner;
}


async function saveCurrData(servData, name, prefs, owner){

    const pref = returnSentTemplate(name, prefs);

    const result   = isPrefExists(servData, name);
    const isExists = result.exists;
    
    if (isExists){
        const id = result.id;
        putPrefs(id, pref);
    } else {
        pref.owner = owner.id;
        postUserPrefs(pref);
    }

 

}


function saveHistoryTrue(){
    const tabbarData  = webix.storage.local.get("userprefsOtherForm");

    if (tabbarData && tabbarData.saveHistoryOpt == "1"){
        return true;
    }
}

function getLocalData(name){
    return webix.storage.local.get(name);
}

function createRestoreData(){
    const restore = {
        editProp :  getLocalData("editFormTempData"),
        filter   :  getLocalData("currFilterState")
    };

    return restore;
}

async function saveLocalStorage() {

    const owner  = await getOwner();
    
    new ServerData({  
        id           : "userprefs"
    }).get().then(function(data){

        if (data && data.content){

        const content = data.content;

        const tabbarData  = getLocalData("tabbar");
        saveCurrData(content, "tabbar" , tabbarData , owner);

 
        if (saveHistoryTrue()){
            const tabsHistory = getLocalData("tabsHistory");
            saveCurrData(content, "tabsHistory", tabsHistory, owner);
        }
        
  
        if (window.location.pathname !== "/index.html/content"){

            const restore = createRestoreData();

            saveCurrData(content, "userRestoreData" , restore , owner);
        }
        }
         
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

    await saveLocalStorage();

    new ServerData({  
        id           : "/init/default/logout/",
        isFullPath   : true
    }).post().then(function(data){

        if (data){
            backPage        ();
            mediator.sidebar.clear();
            clearStorage    ();
        } else {
            setFunctionError(
                "data is " + data, 
                logNameFile, 
                "logoutRouter"
            );  
        }
         
    }); 
}

export{
    logoutRouter
};