import { setLogValue }                   from "../logBlock.js";
import { setAjaxError,setFunctionError } from "../errors.js";
import { setStorageData }                from "../storageSetting.js";


function logout() {

    const userprefsData = webix.ajax().get("/init/default/api/userprefs/");

    userprefsData.then(function(data){
        if (data.err_type !== "i"){
            setFunctionError(data.json().err,"autoLogout","putUserPrefs");
        }

        data = data.json().content;
        
        let settingExists = false;
        let location = {};
        location.href = window.location.href;

        let sentObj = {
            name:"userLocationHref",
            prefs:location
        };
  
        function putUserPrefs(){
            try{
                data.forEach(function(el,i){
                    if (el.name == "userLocationHref"){
                        settingExists = true;

                        const putData = webix.ajax().put("/init/default/api/userprefs/"+el.id, sentObj);

                        putData.then(function(data){
                            data = data.json();
                            if (data.err_type !== "i"){
                                setLogValue("error",data.err);
                            }
                        });

                        putData.fail(function(err){
                            setAjaxError(err, "autoLogout","putUserPrefs");
                        });
                    } 
                });  
            }   catch(err){
                setFunctionError(err,"autoLogout","putUserPrefs");
            }
        }

        function getWhoamiData(){
            let ownerId = webix.storage.local.get("user").id;

            try{
                if (ownerId){
                    sentObj.owner = ownerId;
                } else {
                    const whoamiData =  webix.ajax("/init/default/api/whoami");
                    
                    whoamiData.then(function(data){
                        data = data.json().content;
                        sentObj.owner       = data.id;

                        const userData      = {};

                        userData.id         = data.id;
                        userData.name       = data.first_name;
                        userData.username   = data.username;
                    });

                    whoamiData.fail(function(err){
                        setAjaxError(err, "autoLogout","getWhoamiData");
                    });

                }
            }   catch(err){
                setFunctionError(err,"autoLogout","getWhoamiData")
            }
        }
        
        function postUserPrefs(){

            const postData = webix.ajax().post("/init/default/api/userprefs/",sentObj);

            postData.then(function(data){
                data = data.json();

                if (data.err_type !== "i"){
                    setFunctionError(data.err,"autoLogout","putUserPrefs");
                }
            });

            postData.fail(function(err){
                setAjaxError(err, "autoLogout","postUserPrefs");
            });

        }


        if (window.location.pathname !== "/index.html/content"){
            putUserPrefs();

            if (!settingExists){
                getWhoamiData();
                postUserPrefs();
            }
        }
    });

    userprefsData.then(function(data){
        Backbone.history.navigate("logout", { trigger:true});
        Backbone.history.navigate("/", { trigger:true});
    });

    userprefsData.fail(function(err){
        setAjaxError(err, "autoLogout","logout");

    });
  
}


function checkNotAuth (err){
    if (err.status               === 401                  && 
        window.location.pathname !== "/index.html"        && 
        window.location.pathname !== "/init/default/spaw/"){
        
        const prefs = {href:window.location.href};
        setStorageData ("outsideHref", JSON.stringify(prefs) );
        Backbone.history.navigate("/", { trigger:true});

    }
}

export {
    logout,
    checkNotAuth
};