import {setAjaxError,setFunctionError} from "./errors.js";
import {getUserData} from './commonFunctions.js';
function setStorageData (name, value){
    if (typeof(Storage) !== 'undefined') {
        localStorage.setItem(name, value);
    } 
}

function setLoginActionPref(userLocation, userprefsWorkspace){

    try{
        if (userprefsWorkspace.LoginActionOpt == 2){
            if (userLocation       && 
                userLocation.href  && 
                userLocation.href !== window.location.href ){
            
                window.location.replace(userLocation.href);
            }
        }
    } catch(err){
        setFunctionError(err,"storageSettings","setLoginActionPref");
    }
}



function moveUser(){
    const localPath = "/index.html/content";
    const expaPath  = "/init/default/spaw/content";

    if ( window.location.pathname == localPath || window.location.pathname == expaPath ){
  
        const userprefsWorkspace = webix.storage.local.get("userprefsWorkspaceForm");
        const userLocation       = webix.storage.local.get("userLocationHref");

        const url = new URL( userLocation.href );
 
        if (userprefsWorkspace                    && 
            userprefsWorkspace.LoginActionOpt     && 
            url.origin == window.location.origin  &&
            !(url.pathname.includes("logout")     )){
            
            setLoginActionPref( userLocation, userprefsWorkspace );
        }
    }
}


function setLogPref(){
    const userprefsWorkspace = webix.storage.local.get("userprefsWorkspaceForm");
    const logLayout          = $$("logLayout");
    const logBtn             = $$("webix_log-btn");

    function hideLog(){
        logLayout.config.height = 5;
        logBtn.config.icon ="icon-eye";
    }

    function showLog(){
        logLayout.config.height = 90;
        logBtn.config.icon ="icon-eye-slash";
    }
    
    try{
        if (userprefsWorkspace){
 
            if (userprefsWorkspace.logBlockOpt !== undefined ){

                if (userprefsWorkspace.logBlockOpt=="2"){
                    hideLog();

                } else if(userprefsWorkspace.logBlockOpt=="1"){
                    showLog();
                }

                logLayout.resize();
                logBtn.refresh();
            }


        }
    } catch(err){
        setFunctionError(err,"storageSettings","userprefsWorkspace");
    }
}



function setUserPrefs (){
 
    const userprefsData = webix.ajax("/init/default/api/userprefs/");
   
    userprefsData.then( function (data) {
        let user = webix.storage.local.get("user");
        data       = data.json().content;
        
        function setDataToStorage(){
 
            try{
                data.forEach(function(el,i){
                    if (el.owner == user.id && !(el.name.includes("fav-link_"))){
                        setStorageData (el.name, el.prefs);
                    }
               
                });
            } catch(err){
                setFunctionError(err,"storageSettings","setDataToStorage");
            }
        }

        
        async function setPrefs(){
 
            if (!user){
                const userprefsGetData = webix.ajax("/init/default/api/whoami");
                userprefsGetData.then(function(data){
                    data = data.json().content;

                    let userData = {};
                
                    userData.id       = data.id;
                    userData.name     = data.first_name;
                    userData.username = data.username;
                    
                    setStorageData("user", JSON.stringify(userData));
                });
                userprefsGetData.then(function(data){
                    user = webix.storage.local.get("user");
                    setDataToStorage ();
                    moveUser         ();
                    setLogPref       ();
                });

                userprefsGetData.fail(function(err){
                    setAjaxError(err, "favsLink", "btnSaveLpostContentinkClick => getUserData");
                });
    
            } else {
 
                setDataToStorage();
                moveUser        ();
            }

        
          
        }
        setPrefs();
    }).then(function(){
        setLogPref();
    });
    userprefsData.fail(function(err){
        setAjaxError(err, "storageSettings","setUserPrefs");
    });

}


export{
    setStorageData,
    setUserPrefs
};