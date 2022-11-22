import { setLogValue }                   from "../logBlock.js";
import { setAjaxError,setFunctionError } from "../../blocks/errors.js";
import { setStorageData }                from "../../blocks/storageSetting.js";

function sentPrefs(id, sentObj){
    const path    = "/init/default/api/userprefs/" + id;
    const putData = webix.ajax().put(path, sentObj);

    putData.then(function(data){
        data = data.json();
        if (data.err_type !== "i"){
            setLogValue("error", data.err);
        }
    });

    putData.fail(function(err){
        setAjaxError(err, "autoLogout", "putUserPrefs");
    });   
}

function getWhoamiData(){
    const ownerId = webix.storage.local.get("user").id;
    let owner;
    try{
        if (ownerId){
            owner = ownerId;
        } else {
            const whoamiData =  webix.ajax("/init/default/api/whoami");
            
            whoamiData.then(function(data){
                data = data.json().content;
                owner = data.id;

                const userData      = {};

                userData.id         = data.id;
                userData.name       = data.first_name;
                userData.username   = data.username;
            });

            whoamiData.fail(function(err){
                setAjaxError(err, "autoLogout", "getWhoamiData");
            });

        }
    }   catch(err){
        setFunctionError(err, "autoLogout", "getWhoamiData")
    }

    return owner;
}


function putUserPrefs(data, sentObj){
    let check = false;
    try{
        data.forEach(function(el,i){
            if (el.name == "userLocationHref"){
                check = true;
                sentPrefs(el.id, sentObj);
            } 
        });  
    }   catch(err){
        setFunctionError(err, "autoLogout", "putUserPrefs");
    }
    return check;
}

function logout() {

    const userprefsData = webix.ajax().get("/init/default/api/userprefs/");

    userprefsData.then(function(data){
        data = data.json();

        if (data.err_type !== "i"){
            setFunctionError(data.err, "autoLogout", "putUserPrefs");
        }


        const location    = {};
        data              = data.content;

        location.href     = window.location.href;

        const sentObj = {
            name  : "userLocationHref",
            prefs : location
        };
      
        function postUserPrefs(){
            const path     = "/init/default/api/userprefs/";
            const postData = webix.ajax().post(path, sentObj);

            postData.then(function(data){
                data = data.json();

                if (data.err_type !== "i"){
                    setFunctionError(data.err, "autoLogout", "putUserPrefs");
                }
            });

            postData.fail(function(err){
                setAjaxError(err, "autoLogout", "postUserPrefs");
            });

        }


        if (window.location.pathname !== "/index.html/content"){
            const settingExists = putUserPrefs(data, sentObj);

            if (!settingExists){
                sentObj.owner = getWhoamiData();
                postUserPrefs();
            }
        }
    });

    userprefsData.then(function(data){
        Backbone.history.navigate("logout", { trigger:true});
        Backbone.history.navigate("/",      { trigger:true});
    });

    userprefsData.fail(function(err){
        setAjaxError(err, "autoLogout", "logout");
    });
  
}


function checkNotAuth (err){
    if (err.status               === 401                  && 
        window.location.pathname !== "/index.html"        && 
        window.location.pathname !== "/init/default/spaw/"){
        
        const prefs = {
            href : window.location.href
        };
        setStorageData ("outsideHref", JSON.stringify(prefs) );
        Backbone.history.navigate("/", { trigger:true});

    }
}

export {
    logout,
    checkNotAuth
};