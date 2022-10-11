import {setAjaxError,setFunctionError} from "./errors.js";

function setStorageData (name, value){
    if (typeof(Storage) !== 'undefined') {
        localStorage.setItem(name, value);
    } 
}

function setUserPrefs (){
    
    const userprefsData = webix.ajax("/init/default/api/userprefs/");
   
    userprefsData.then(function(data){
        let user = webix.storage.local.get("user");
        data = data.json().content;
        
        function setDataToStorage(){
            try{
                data.forEach(function(el,i){
                    if (el.owner == user.id){
                        setStorageData (el.name, el.prefs);
                    }
                });
            } catch(err){
                setFunctionError(err,"storageSettings","setDataToStorage");
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
        if (user){

          
            setDataToStorage();

            if (window.location.pathname=="/index.html/content" || window.location.pathname=="/init/default/spaw/content"){
                let userprefsWorkspace = webix.storage.local.get("userprefsWorkspaceForm");
                let userLocation = webix.storage.local.get("userLocationHref");

                const url = new URL(userLocation.href);

                if (userprefsWorkspace                    && 
                    userprefsWorkspace.LoginActionOpt     && 
                    url.origin == window.location.origin  &&
                    !(url.pathname.includes("logout")     )){
                        setLoginActionPref(userLocation,userprefsWorkspace);
                    }
            }
        }
    });
    userprefsData.fail(function(err){
        setAjaxError(err, "storageSettings","setUserPrefs");
    });


    

    function setLogPref(){
        let userprefsWorkspace = webix.storage.local.get("userprefsWorkspaceForm");
        try{
            if (userprefsWorkspace){
     
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
    
    
            }
        } catch(err){
            setFunctionError(err,"storageSettings","userprefsWorkspace");
        }
    }
    setLogPref();

}


export{
    setStorageData,
    setUserPrefs
};