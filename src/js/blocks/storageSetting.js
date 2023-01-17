import { setFunctionError } from "./errors.js";
import { ServerData }       from "./getServerData.js"
import { returnOwner }      from "./commonFunctions.js";
import { mediator }         from "./_mediator.js";

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
 
        
    if (data && typeof data == "object"){
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
    } else {
        setFunctionError(
            `type of content is not a array: 
            ${data} or array does not exists`, 
            logNameFile, 
            "createComboValues"
        ); 
    }
}

function setTabHistory(){
    const data = webix.storage.local.get("tabsHistory"); 
 
    if (data){
        const history = data.history;
        
        if (history.length){
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
  
        let user = webix.storage.local.get("user");
        data     = data.json().content;

        if (userData){
            user = userData;
        }
 
        setDataToStorage(data, user);
        setLogPref      ();
        setTabHistory   ();
  
        $$("globalTabbar").callEvent("setStorageData", [ '1' ]);
        
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