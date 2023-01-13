import { setAjaxError, setFunctionError } from "./errors.js";
import { pushUserDataStorage, 
    getUserDataStorage }                  from "./commonFunctions.js";
import { mediator }                       from "./_mediator.js";

function setStorageData (name, value){
    if (typeof(Storage) !== 'undefined') {
        localStorage.setItem(name, value);
    } 
}

// function isLocationParam(userLocation){
//     if (userLocation       && 
//         userLocation.href  && 
//         userLocation.href !== window.location.href )
//     {
//         return true;
//     }
// }


// function setLoginActionPref(userLocation){
//     if (isLocationParam(userLocation)){
//         window.location.replace(userLocation.href);
//     }
// }

// function setLink(data){
//     const url          = new URL( data.href );
//     const isLogoutPath = url.pathname.includes("logout");
//     const origin       = window.location.origin;

//     if (url.origin == origin && !isLogoutPath) {
//         setLoginActionPref(data);
//     }
// }

// function moveUser(){

//     const localPath = "/index.html/content";
//     const expaPath  = "/init/default/spaw/content";

//     const path = window.location.pathname;
  
//     if ( path == localPath || path == expaPath ){
  
//         const userLocation = webix.storage.local.get("userLocationHref");
//         const outsideHref  = webix.storage.local.get("outsideHref");
 
   
//         if (outsideHref){
//             setLink(outsideHref);
//         } else {
//             setLink(userLocation);
//         }

//     }
// }

let restorePref;
let restore;

function setRestoreToStorage(name, value){
    if(value){
   
        setStorageData (name, JSON.stringify(value));
    

    } 
}


function restoreDataToStorage(el){
 
    ///?????
    // if (el){
    //     const prefs = JSON.parse(el);

    
    //     setRestoreToStorage(
    //         "editFormTempData", 
    //         prefs.editProp
    //     );
    
    //     setRestoreToStorage(
    //         "currFilterState",  
    //         prefs.filter  
    //     );
    // }
  
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
        const path = "/init/default/api/userprefs/" + id;

        const delData = webix.ajax().del(path, obj);

        delData.then(function(data){
            data = data.json();

            if (data.err_type !== "i"){
                setFunctionError(
                    data.err, 
                    "storageSettings", 
                    "deletePrefs"
                );
            }
        });

        delData.fail(function(err){
            setAjaxError(
                err, 
                "storageSettings", 
                "deletePrefs"
            );
        });
    }
}


function setDataToStorage(data, user){
 
    try{
        data.forEach(function(el){
            const owner = el.owner;
            const name  = el.name;

            const isFavPref = name.includes("fav-link_");

            if (owner == user.id && !isFavPref){
                 

                if (name !== "userRestoreData"){
                    setStorageData (el.name, el.prefs);
                    //restorePref = el;
                } else {
                    restoreDataToStorage(el.prefs);
                }

                if (name == "tabbar" || name == "userRestoreData" || name == "tabsHistory"){
                    deletePrefs(el.id, el);
                }
            }

        });
    } catch(err){
        setFunctionError(
            err,
            "storageSettings",
            "setDataToStorage"
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
  
    let user = getUserDataStorage();

    if (!user){
        await pushUserDataStorage(); 
        user = getUserDataStorage();
    }
 
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
            "storageSettings function setUserPrefs"
        );
    });

}


export{
    setStorageData,
    setUserPrefs
};