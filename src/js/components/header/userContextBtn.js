
import { favsPopup }         from "../favorites.js";

import { returnOwner }       from "../../blocks/commonFunctions.js";
import { setFunctionError }  from "../../blocks/errors.js";
import { Button }            from "../../viewTemplates/buttons.js";

import { mediator }          from "../../blocks/_mediator.js";
import { ServerData }        from "../../blocks/getServerData.js";


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
      //  clickMenu("cp", "/cp");
      clearTree();
      navigateTo ("/cp");

    } else if (id == "settings"){
       // clickMenu("settings", "/settings");
       clearTree();
       navigateTo ("/settings");

    } else if (id == "favs"){
        const popup = $$("popupFavsLink");
        if (!popup){
            favsPopup();
        } else {
            popup.show();
        }
    }
 
}

function putUserprefs(id, sentObj){
    const path = "userprefs/" + id;

    new ServerData({
        id : path
    }).put(sentObj);
}

function postUserprefsData (sentObj){
    const path = "userprefs";
    new ServerData({
        id : path,
    }).post(sentObj);
}



async function onItemClickBtn(){
    const owner       = await returnOwner();

    const localUrl    = "/index.html/content";
    const spawUrl     = "/init/default/spaw/content";
    const path        = window.location.pathname;

    const prefName    = "userLocationHref";

    if (owner && owner.id){
        new ServerData({
            id : `smarts?query=userprefs.name=${prefName}+and+userprefs.owner=${owner.id}&limit=80&offset=0`
           
        }).get().then(function(data){
          
    
            if (data && path !== localUrl && path !== spawUrl){
               
                const location = {
                    href : window.location.href
                };
    
                const sentObj = {
                    name  : prefName,
                    owner : ownerId.id,
                    prefs : location
                };
    
                const content = data.content;
        
                if (content && content.length){ // запись с таким именем уже существует
                    const id = content[0].id;
                    putUserprefs(id, sentObj);
                } else {
                    postUserprefsData (sentObj);
                }
            }
             
        });
    } else {
        setFunctionError(
            `owner is not defined`, 
            "commonFunctions", 
            "onItemClickBtn"
        );
    }
    

 
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