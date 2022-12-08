
import { favsPopup }                                    from "../favorites.js";

import { setFunctionError, setAjaxError }               from "../../blocks/errors.js";
import { pushUserDataStorage, 
         getUserDataStorage }                           from "../../blocks/commonFunctions.js";

import { Button }                                       from "../../viewTemplates/buttons.js";

import { mediator }                                     from "../../blocks/_mediator.js";


const logNameFile = "header => userContextBtn";

function navigateTo (path){
    return Backbone.history.navigate(path, {trigger : true});
}

function clearTree(){
    const tree = $$("tree");
    if (tree){
        tree.unselectAll();
        tree.closeAll();

    }
}

function clickMenu(id, path = id){
    mediator.getGlobalModalBox(id).then(function(result){
        if (result){
            clearTree();
            navigateTo (path);
        }
    });

}

function itemClickContext(id){

    if (id=="logout"){
        clickMenu("logout", "logout?auto=true");

    } else if (id == "cp"){
        clickMenu("cp", "/cp");

    } else if (id == "settings"){
        clickMenu("settings", "/settings");

    } else if (id == "favs"){
        const popup = $$("popupFavsLink");
        if (!popup){
            favsPopup();
        } else {
            popup.show();
        }
    }
 
}

async function onItemClickBtn(){
    let ownerId = getUserDataStorage();

    if (!ownerId){
        await pushUserDataStorage();
        ownerId = getUserDataStorage();
    }

    const getData = webix.ajax().get("/init/default/api/userprefs/");

    getData.then(function(data){
        data = data.json().content;

        const localUrl    = "/index.html/content";
        const spawUrl     = "/init/default/spaw/content";
        const path        = window.location.pathname;
        
        let settingExists = false;

        function checkError(ajaxVar){
            const msg = "onItemClickBtn " + ajaxVar;

            ajaxVar.then(function(data){
                data = data.json();
          
                if (data.err_type !== "i"){
                   
                    setFunctionError(
                        data.error, 
                        logNameFile,
                        msg
                    );
                }
            }); 

            ajaxVar.fail(function(err){
                setAjaxError(err, logNameFile, msg);
            });
        }

        function putUserprefs(id, sentObj){
            const path = "/init/default/api/userprefs/" + id;
            const putData = webix.ajax().put(path, sentObj);
            checkError(putData);
        }

        function postUserprefsData (sentObj){
            const path = "/init/default/api/userprefs/";
            const postUserprefs = webix.ajax().post(path, sentObj);
            checkError(postUserprefs);
        }

        if (path !== localUrl && path !== spawUrl){

            const location = {
                href : window.location.href
            };

            const sentObj = {
                name  : "userLocationHref",
                owner : ownerId.id,
                prefs : location
            };


            data.forEach(function(el,i){
                if (el.name == "userLocationHref"){
                    putUserprefs(el.id, sentObj);
                    settingExists = true;
  
                } 
            });

            if (!settingExists){
                postUserprefsData (sentObj);
            }
         
        }
    });
    getData.fail(function(err){
    
        setAjaxError(
            err, 
            logNameFile,
            "onItemClickBtn getData"
        );
    });

 
}


const userContextBtn = new Button({
    
    config   : {
        id       : "button-context-menu",
        hotkey   : "Ctrl+L",
        icon     : "icon-user", 
        disabled : true,
        popup   : {

            view    : 'contextmenu',
            id      : "contextmenu",
            css     : "webix_contextmenu",
            data    : [],
            on      : {
                onItemClick: function(id){
                    itemClickContext(id);
                     
 
                }
            }
        },
    },
    onFunc   :{
        onItemClick: function(){
            onItemClickBtn();
        }
    },
    titleAttribute : "Пользователь"

   
}).minView();

export {
    userContextBtn
};