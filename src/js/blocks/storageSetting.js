///////////////////////////////

// Загрузка в Local Storage и применение настроек  

// Copyright (c) 2022 CA Expert

/////////////////////////////// 


import { ServerData }               from "./getServerData.js"
import { returnOwner, isArray }     from "./commonFunctions.js";
import { mediator }                 from "./_mediator.js";

const logNameFile = "storageSettings";
function setStorageData (name, value){
    if (typeof(Storage) !== 'undefined') {
        localStorage.setItem(name, value);
    } 
}




function setLogState(value){
    const logLayout          = $$("logLayout");
    const logBtn             = $$("webix_log-btn");
    
    let height;
    let icon;

    if (value == 1){
        height = 5;
        icon = "icon-eye";
    } else {
        height = 90;
        icon = "icon-eye-slash";
    }

    logLayout.config.height = height;
    logBtn.config.icon      = icon;

    logBtn.setValue(value);

    logLayout.resize ();
    logBtn   .refresh();
}


function setLogPref(){
  
    const form = "userprefsWorkspaceForm";

    const userprefsWorkspace = webix.storage.local.get(form);

    if (userprefsWorkspace){
        const option = userprefsWorkspace.logBlockOpt;
    
        if (option){
            if (option == "2"){
                setLogState(1);

            } else if(option == "1"){
                setLogState(2);
            }

        }

    }
   
}

function deletePrefs(id, obj){
    if (id){

        new ServerData({
            id : `userprefs/${id}`
        }).del(obj);
    }
}


function setDataToStorage(data, user){
    
 
    if (isArray(data, logNameFile, "setDataToStorage")){
        data.forEach(function(el){
            const owner = el.owner;
            const name  = el.name;

            const isFavPref = name.includes("fav-link_");

            if (owner == user.id && !isFavPref){
                 

                if (name !== "userRestoreData"){
                    setStorageData (el.name, el.prefs);
                } 

                if (name == "tabbar" || name == "userRestoreData" 
                    || name == "tabsHistory"){
                    deletePrefs(el.id, el);
                }
            }

        });
    } 
}

function setTabHistory(){
    const data = webix.storage.local.get("tabsHistory"); 
  
    if (data){
        const history = data.history;
        
        if (isArray(data, logNameFile, "setDataToStorage")){
            history.forEach(function(el){
        
                mediator.tabs.addTabHistory(el);
            });

            webix.storage.local.remove("tabsHistory");
        }
        
    }
}


async function setUserPrefs (userData){
  
    const user = await returnOwner();
 
    const path = "/init/default/api/userprefs/";
    const userprefsData = webix.ajax(path);
  
    userprefsData.then( function (data) {
 
        data = data.json();

        if (data && data.content){
     
            const content = data.content;
            setDataToStorage(content, user);
            setLogPref      ();
            setTabHistory   ();
      
            $$("globalTabbar").callEvent("setStorageData", [ '1' ]);
        }

        
    });

    userprefsData.fail(function(err){
        console.log(err);
        console.log(
            logNameFile + " function setUserPrefs"
        );
    });

}


export{
    setStorageData,
    setUserPrefs
};