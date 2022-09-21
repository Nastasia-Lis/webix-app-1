import {ajaxErrorTemplate, catchErrorTemplate} from "./logBlock.js";

function setStorageData (name, value){
    if (typeof(Storage) !== 'undefined') {
        localStorage.setItem(name, value);
    } 
}


function setUserLocation (tableNames,userLocation,autoLogoutVal=false){
    try {
        userLocation = window.location.href;
        let tableIdHref = userLocation.slice(userLocation.lastIndexOf('/')+1); 
        let nameRecoverEl;
        let storageData;

        if (tableNames){
            tableNames.forEach(function(el,i){
                if (el.id == tableIdHref){
                    nameRecoverEl= el.name;
                }
            });
        } 

        storageData= {tableName:nameRecoverEl,tableId:tableIdHref,href:userLocation,autoLogout:autoLogoutVal};


        setStorageData ("userLocation", JSON.stringify(storageData));

    } catch (error){
        console.log(error);
        catchErrorTemplate("010-000", error);

    }
}


function setUserPrefs (){
    
    webix.ajax("/init/default/api/userprefs/",{
        success:function(text, data, XmlHttpRequest){
            try{
                let user = webix.storage.local.get("user");
                data = data.json().content;
                data.forEach(function(el,i){
                    if (el.owner == user.id){
                        setStorageData (el.name, el.prefs);
                    }
                });
      
                if (window.location.pathname=="/index.html/content" || window.location.pathname=="/init/default/spaw/content"){
                    let userprefsWorkspace = webix.storage.local.get("userprefsWorkspaceForm");
                    let userLocation = webix.storage.local.get("userLocationHref");

                        const url = new URL(userLocation.href);

                    if (userprefsWorkspace && userprefsWorkspace.LoginActionOpt && url.origin == window.location.origin ){
                        if (userprefsWorkspace.LoginActionOpt == 2){
                            if (userLocation && userLocation.href && userLocation.href !== window.location.href ){
                                //Backbone.history.navigate(window.location.pathname, { trigger:true});
                                window.location.replace(userLocation.href);
                            }
                        }
                    }
                }
                
            } catch(error){
                console.log(error);
                catchErrorTemplate("010-000", error);
            }
        },
        error:function(text, data, XmlHttpRequest){
            ajaxErrorTemplate("010-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
        }
    }).catch(error => {
        console.log(error);
        ajaxErrorTemplate("010-000",error.status,error.statusText,error.responseURL);
    });


    
    let userprefsWorkspace = webix.storage.local.get("userprefsWorkspaceForm");
    try{
        if (userprefsWorkspace){
        // Log
            if (userprefsWorkspace.logBlockOpt !== undefined ){
                if (userprefsWorkspace.logBlockOpt=="2"){
                    $$("logLayout").config.height = 5;
                    $$("logLayout").resize();
                    $$("webix_log-btn").config.icon ="wxi-eye";
                    $$("webix_log-btn").refresh();

                } else if(userprefsWorkspace.logBlockOpt=="1"){
                    $$("logLayout").config.height = 90;
                    $$("logLayout").resize();
                    $$("webix_log-btn").config.icon ="wxi-eye-slash";
                    $$("webix_log-btn").refresh();
                }
            }
        

        // if (userprefsWorkspace.logBlockOpt !== undefined){
        //     if (userprefsWorkspace.logBlockOpt > 30 && userprefsWorkspace.logBlockOpt < 7200){

        //     }
        // }

        }
    } catch(error){
        console.log(error);
        catchErrorTemplate("010-000", error);
    }
}
export{
    setStorageData,
    setUserLocation,
    setUserPrefs
};