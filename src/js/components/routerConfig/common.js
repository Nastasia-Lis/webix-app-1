

import { setStorageData }           from "../../blocks/storageSetting.js";
import { STORAGE, getData, 
         LoadServerData, GetMenu}   from "../../blocks/globalStorage.js";
import {setFunctionError}           from "../../blocks/errors.js";
import { mediator }                 from "../../blocks/_mediator.js";
import { Action } from "../../blocks/commonFunctions.js";

const logNameFile = "router => common";
function createElements(specificElement){

    function createDefaultWorkspace(){
        if(!specificElement){
            mediator.dashboards.create();
            mediator.tables    .create();
            mediator.forms     .create();
        }
    }

    function createTreeTempl(){
        try{
            if (specificElement == "treeTempl"){
                mediator.treeEdit.create();
            }
        } catch (err){
            setFunctionError(
                err,
                logNameFile,
                "createTreeTempl"
            );
        }
    }

    function createCp(){
        try{
            if (specificElement == "cp"){
                mediator.user_auth.create();
            }
        } catch (err){
            setFunctionError(
                err,
                logNameFile,
                "createCp"
            );
        }
    }

    function createUserprefs(){
        try{
            if (specificElement == "settings"){
                mediator.settings.create();
            }
        } catch (err){
            setFunctionError(
                err,
                logNameFile,
                "createUserprefs"
            );
        }
    }

    function createSpecificWorkspace (){
        createTreeTempl();
        createCp();
        createUserprefs();
    }
   

    createDefaultWorkspace();
    createSpecificWorkspace ();
  
}

function removeElements(){

    function removeElement(idElement){
        try {
            const elem   = $$(idElement);
            const parent = $$("container");
            if (elem){
                parent.removeView(elem);
            }
        } catch (err){
            setFunctionError(
                err,
                logNameFile,
                "removeElement (element: " + idElement + ")"
            );
        }
    }
    removeElement ("tables");
    removeElement ("dashboards");
    removeElement ("forms");
    removeElement ("user_auth");
}


function getWorkspace (){

    function getMenuTree() {


        LoadServerData.content("mmenu")
        
        .then(function (){
            const menu = GetMenu.content;
            mediator.sidebar.load(menu);
            mediator.header .load(menu);
        });
 
    }

    function createContent (){ 
 
        function showMainContent(){
            try {
                $$("userAuth").hide();
                $$("mainLayout").show();
            } catch (err){
                window.alert
                ("showMainContent: " + err +  " (Подробности: ошибка в отрисовке контента)");
                setFunctionError(err,logNameFile,"showMainContent");
            }
        }

        function setUserData(){
            const userStorageData      = {};
            userStorageData.id       = STORAGE.whoami.content.id;
            userStorageData.name     = STORAGE.whoami.content.first_name;
            userStorageData.username = STORAGE.whoami.content.username;
            
            setStorageData("user", JSON.stringify(userStorageData));
        }

        showMainContent();

        setUserData();

        createElements();

        getMenuTree();
    }

    async function getAuth () {
        if (!STORAGE.whoami){
            await getData("whoami"); 
        }

        if (STORAGE.whoami){
            createContent (); 
        }

    }

    getAuth ();

}


function checkTreeOrder(){

    try{
        if (mediator.sidebar.dataLength() == 0){
            getWorkspace ();
        }
    
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "checkTreeOrder"
        );
    }
}

function hideAllElements (){

    try {
        $$("container").getChildViews().forEach(function(el,i){
            const view = el.config.view;
            if(view == "scrollview"|| view == "layout"){
                Action.hideItem($$(el.config.id));
            }
        });
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "hideAllElements"
        );
    }
  
     
}



export {
    createElements,
    removeElements,
    getWorkspace,
    hideAllElements,
    checkTreeOrder,
};