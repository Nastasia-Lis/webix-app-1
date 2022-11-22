
import { modalBox }                               from "../../blocks/notifications.js";
import { setLogValue }                            from '../logBlock.js';
import { setStorageData }                         from "../../blocks/storageSetting.js";

 
import { saveItem, saveNewItem }                  from "../table/editForm/buttons.js";

import { favsPopup }                              from "../favorites.js";

import { setFunctionError, setAjaxError }         from "../../blocks/errors.js";
import { Action }                                 from "../../blocks/commonFunctions.js";

import { Button }                                 from "../../viewTemplates/buttons.js";


const logNameFile = "header => userContextBtn";

function clearTree(){
    $$("tree").clearAll();
}

function hideContentElements(id){
    const childs =  $$("container").getChildViews();
    childs.forEach(function(el){
        if ( el.config.id !== id ){
            Action.hideItem($$(el.config.id));

        }
    }); 
}

function navigateTo (path){
    return Backbone.history.navigate(path, {trigger : true});
}

function itemClickContext(id){
    const editProperty = $$("editTableFormProperty");
    const cpForm       = $$("cp-form");


    function goToItem(navPath){
        navigateTo (navPath);
            
        editProperty.config.dirty = false;
        editProperty.refresh();
    
    }
    
    function modalBoxTable (navPath){

        modalBox().then(function(result){
            const saveBtn    = $$("table-saveBtn");
            if (result == 1){
                goToItem(navPath);
                clearTree();

            } else if (result == 2){
                if (editProperty                && 
                    editProperty.config.dirty   ){
                    
                    if ( saveBtn.isVisible() ){
                        saveItem(false, true);
                    } else {
                        saveNewItem(); 
                    }

                    goToItem(navPath);
                    clearTree();
                }
                
            }

           
        });
    
    }

    function logoutClick(){
        const propertyCondition = editProperty && editProperty.config.dirty;
        const cpCondition       = cpForm && cpForm.isDirty();

        function postNewPass(){
            const passValues = cpForm.getValues();

            const objPass = {
                op:passValues.oldPass,
                np:passValues.newPass
            };

            const url      = "/init/default/api/cp";
            const postData = webix.ajax().post(url, objPass);

            postData.then(function(data){
                data = data.json()
                if (data.err_type == "i"){
                    setLogValue("success", data.err);
                    navigateTo ("logout");
                } else {
                    setFunctionError(data.err, logNameFile, "save new pass");
                }
            });

            postData.fail(function(err){
                setAjaxError(err, logNameFile,"save new pass");
            });
        }

        function savePropertyVals(){
            const values = editProperty.getValues();
            if (values.id){
                saveItem(false,false,true);
                goToItem("logout");
            } else {
                saveNewItem();
                goToItem("logout"); 
            }
        }
        
        if (propertyCondition || cpCondition){
         
            modalBox().then(function(result){
                if (result == 1){
                    goToItem("logout");
                } else if (result == 2){

                    if (cpForm || editProperty){

                        if (cpCondition && cpForm.validate()){
                            postNewPass();
                            
                        
                        } else if (propertyCondition){
                            savePropertyVals();
                     
                        
                        }else {
                            setLogValue("error","Заполните пустые поля");
                            return false;
                        }
                    } 
                }
            });
            return false;
        } else {
            navigateTo ("logout");
        }
    }

    function cpClick(){
        if (editProperty && editProperty.config.dirty){
            modalBoxTable ("cp");
        } else {
            clearTree();
            navigateTo ("/cp");
        }
        hideContentElements("user_auth");
    }

    function settingsClick(){
        if (editProperty && editProperty.config.dirty){
            modalBoxTable ("settings");
        } else {
            clearTree();
            navigateTo ("/settings");
        }
        hideContentElements("settings");
    }

    if (id=="logout"){
        logoutClick();

    } else if (id == "cp"){
        cpClick();

    } else if (id == "settings"){
        settingsClick();


    } else if (id == "favs"){
    
        favsPopup();
    }
 
}

function onItemClickBtn(){

    const getData = webix.ajax().get("/init/default/api/userprefs/");

    getData.then(function(data){
        data = data.json().content;

        if (data.err_type == "e"){
            setFunctionError(data.error,logNameFile,"onItemClickBtn getData")
        }

        const localUrl    = "/index.html/content";
        const spawUrl     = "/init/default/spaw/content";
        const path        = window.location.pathname;
        
        let settingExists = false;

        function checkError(ajaxVar){
            const msg = "onItemClickBtn " + ajaxVar;

            ajaxVar.then(function(data){
                data = data.json();
                if (data.err_type !== "i"){
                    setFunctionError(data.error, logNameFile, msg);
                }
            }); 

            ajaxVar.fail(function(err){
                setAjaxError(err, logNameFile,msg);
            });
        }

        function putUserprefs(id, sentObj){
            const url     = "/init/default/api/userprefs/" + id;
            const putData = webix.ajax().put(url, sentObj);
            checkError(putData);
        }

        function getWhoData(sentObj){
            const getWho =  webix.ajax("/init/default/api/whoami");

            getWho.then(function(data){
                data              = data.json().content;

                sentObj.owner     = data.id;

                const userData    = {};
                userData.id       = data.id;
                userData.name     = data.first_name;
                userData.username = data.username;
                
                setStorageData("user", JSON.stringify(userData));
            });

            getWho.fail(function(err){
                setAjaxError(err, logNameFile,"onItemClickBtn getWho");
            });
        }

        function postUserprefsData (sentObj){
            const url           = "/init/default/api/userprefs/";
            const postUserprefs = webix.ajax().post(url,sentObj);
            checkError(postUserprefs);
        }

        if (path !== localUrl && path !== spawUrl){

            const location = {
                href : window.location.href
            };

            const sentObj = {
                name  : "userLocationHref",
                prefs : location
            };


            data.forEach(function(el,i){
                if (el.name == "userLocationHref"){
                    putUserprefs(el.id, sentObj);
                    settingExists = true;
  
                } 
            });

            if (!settingExists){

                const ownerId = webix.storage.local.get("user").id;

                if (ownerId){
                    sentObj.owner = ownerId;
                } else {
                    getWhoData(sentObj);
                }
                postUserprefsData (sentObj);
               
            }
         
        }
    });
    getData.fail(function(err){
        setAjaxError(err, logNameFile,"onItemClickBtn getData");
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
                onItemClick: function(id, e, node){
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