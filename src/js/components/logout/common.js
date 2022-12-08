import { setLogValue }                   from "../logBlock.js";
import { setAjaxError,setFunctionError } from "../../blocks/errors.js";
import { setStorageData }                from "../../blocks/storageSetting.js";

import { Button }                        from "../../viewTemplates/buttons.js";
import { Popup }                         from "../../viewTemplates/popup.js";

import { pushUserDataStorage, 
    getUserDataStorage }                 from "../../blocks/commonFunctions.js";


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

//currFilterState
//editFormTempData




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


function postUserPrefs(sentObj){
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

async function logout() {
    let ownerId = getUserDataStorage();

    if (!ownerId){
        await pushUserDataStorage();
        ownerId = getUserDataStorage();
    }

    const userprefsData = webix.ajax().get("/init/default/api/userprefs/");

    userprefsData.then(function(data){
        data = data.json();

        if (data.err_type !== "i"){
            setFunctionError(
                data.err, 
                "autoLogout", 
                "putUserPrefs"
            );
        }


        const location    = {};
        data              = data.content;

        location.href     = window.location.href;
  
        const sentObj = {
            name  : "userLocationHref",
            prefs : location
        };

        const editPropData = webix.storage.local.get("editFormTempData");
        const filterData = webix.storage.local.get("currFilterState");

        console.log(editPropData, filterData)
      
        // const sentObj = {
        //     name  : "userLocationHref",
        //     prefs : location
        // };

        if (window.location.pathname !== "/index.html/content"){
            const settingExists = putUserPrefs(data, sentObj);

            if (!settingExists){
                sentObj.owner = ownerId.id;
                postUserPrefs(sentObj);
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

function toLogin(){
    window.location.reload();
}

function popupNotAuth(){
    const subtitle = {
        template    :"Войдите в систему, чтобы продолжить",
        height      :40,
        borderless  :true,
    };

    const btn = new Button({
    
        config   : {
            id      : "authBtnNavigate",
            hotkey  : "Shift+Space",
            value   : "Войти в систему", 
            click   : toLogin
        },
        titleAttribute : "Войти в систему"
    
    }).maxView("primary");

    const popup = new Popup({
        headline : "Отказ в доступе",
        config   : {
            id    : "popupNotAuth",
            width     : 400,
            minHeight : 300,
    
        },

        elements : {
            padding:{
                left : 5,
                right: 5
            },
            rows:[
                subtitle,
                btn
            ]
         
          
        }
    });
    if ( !($$("popupNotAuth")) ){
        popup.createView ();
    }
    popup.showPopup  ();
}

function checkNotAuth (err){
    let notAuth = false;
    if (err.status               === 401                  && 
        window.location.pathname !== "/index.html"        && 
        window.location.pathname !== "/init/default/spaw/"){
        notAuth = true;
        const prefs = {
            href : window.location.href
        };
        setStorageData ("outsideHref", JSON.stringify(prefs) );
        Backbone.history.navigate("/", { trigger:true});

    }

    return notAuth;
}

export {
    logout,
    checkNotAuth,
    popupNotAuth
};