/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/blocks/storageSetting.js




function setStorageData (name, value){
    if (typeof(Storage) !== 'undefined') {
        localStorage.setItem(name, value);
    } 
}

function isLocationParam(userLocation){
    if (userLocation       && 
        userLocation.href  && 
        userLocation.href !== window.location.href )
    {
        return true;
    }
}


function setLoginActionPref(userLocation){
    if (isLocationParam(userLocation)){
        window.location.replace(userLocation.href);
    }
}

function setLink(data){
    const url          = new URL( data.href );
    const isLogoutPath = url.pathname.includes("logout");
    const origin       = window.location.origin;

    if (url.origin == origin && !isLogoutPath) {
        setLoginActionPref(data);
    }
}

function moveUser(){

    const localPath = "/index.html/content";
    const expaPath  = "/init/default/spaw/content";

    const path = window.location.pathname;
    if ( path == localPath || path == expaPath ){
  
        const userLocation = webix.storage.local.get("userLocationHref");
        const outsideHref  = webix.storage.local.get("outsideHref");

   
        if (outsideHref){
            setLink(outsideHref);
        } else {
            setLink(userLocation);
        }

    }
}

let restorePref;
let restore;

function setRestoreToStorage(name, value){
    if(restore && value){
        setStorageData (name, JSON.stringify(value));

    } 
}

function restoreData(){
    restore = webix.storage.local.get("userRestoreData");

    if (restore){
        const path = "/init/default/api/userprefs/" + restorePref.id;

        const delData = webix.ajax().del(path, restorePref);

        delData.then(function(data){
            data = data.json();

            if (data.err_type !== "i"){
                errors_setFunctionError(
                    data.err, 
                    "storageSettings", 
                    "restoreData"
                );
            }
        });

        delData.fail(function(err){
            setAjaxError(
                err, 
                "storageSettings", 
                "restoreData"
            );
        });
    
    
        setRestoreToStorage(
            "editFormTempData", 
            restore.editProp
        );

        setRestoreToStorage(
            "currFilterState",  
            restore.filter  
        );
 
    }
}

function setLogState(value){
    const logLayout          = $$("logLayout");
    const logBtn             = $$("webix_log-btn");
    
    let height;
    let icon;

    if (value == 1){
        height = 5;
        icon = "icon-eye";
    } else {
        height = 90;
        icon = "icon-eye-slash";
    }

    logLayout.config.height = height;
    logBtn.config.icon      = icon;

    logBtn.setValue(value);

    logLayout.resize ();
    logBtn   .refresh();
}


function setLogPref(){
  
    const form = "userprefsWorkspaceForm";

    const userprefsWorkspace = webix.storage.local.get(form);
 
    if (userprefsWorkspace){
        const option = userprefsWorkspace.logBlockOpt;

        if (option){
            if (option == "2"){
                setLogState(1);

            } else if(option == "1"){
                setLogState(2);
            }

        }

    }
   
}


function setDataToStorage(data, user){
 
    try{
        data.forEach(function(el){
            const owner = el.owner;
            const name  = el.name;

            const isFavPref = name.includes("fav-link_");

            if (owner == user.id && !isFavPref){
                setStorageData (el.name, el.prefs);

                if (name == "userRestoreData"){
                    restorePref = el;
                }
            }

        });
    } catch(err){
        errors_setFunctionError(
            err,
            "storageSettings",
            "setDataToStorage"
        );
    }
}



async function setUserPrefs (userData){
    
    let user = getUserDataStorage();

    if (!user){
        await pushUserDataStorage(); 
        user = getUserDataStorage();
    }
 
    const path = "/init/default/api/userprefs/";
    const userprefsData = webix.ajax(path);

    userprefsData.then( function (data) {
        let user = webix.storage.local.get("user");
        data     = data.json().content;

        if (userData){
            user = userData;
        }
   
        setDataToStorage(data, user);
     
        moveUser        ();

        restoreData();
     
        setLogPref ();
   
    });

    userprefsData.fail(function(err){
        console.log(err);
        console.log(
            "storageSettings function setUserPrefs"
        );
    });

}



;// CONCATENATED MODULE: ./src/js/viewTemplates/buttons.js



class buttons_Button {

    constructor (options){
        this.buttonView = {
            view    : "button",
            height  : 42,
            on      : {

            }
        };
        this.options    = options.config;

        this.values     = Object.values(this.options);
        this.keys       = Object.keys  (this.options);
        this.adaptValue = options.adaptValue;

        this.title      = options.titleAttribute;

        this.onFunc     = options.onFunc;

        this.css        = options.css;
    }


    modifyTitle(index){
        this.title = this.title + " (" + this.values[index] + ")";
    }

    setAdaptiveValue(btn, adaptVal, mainVal){
   
        const width  = btn.$width;

        if (width < 120 &&  btn.config.value !== adaptVal ){
            btn.config.value = adaptVal;
            btn.refresh();
          
        } else if (width > 120 &&  btn.config.value !== mainVal ) {
            btn.config.value = mainVal;
            btn.refresh();
        }
    }

    addOnFunctions(button){
        const self = this;
        
        if (this.onFunc){
            const names  = Object.keys  (this.onFunc);
            const values = Object.values(this.onFunc);

            names.forEach(function(name,i){
                button.on[name] = values[i];
            });

        }

        button.on.onAfterRender = function () {
        
            this.getInputNode().setAttribute("title", self.title);

            if (self.adaptValue){
                self.setAdaptiveValue(this, self.adaptValue, self.options.value);
            }
        };
    }

    addCss(type){
        const button    = this.buttonView; 
        const customCss = this.css || "";

        if (type == "primary"){
            button.css = "webix_primary ";

        } else if (type == "delete"){
            button.css  = "webix_danger ";

        } else {
            button.css = type || "";
            button.css = button.css + " " + customCss || "";
        }
      
    }

    
    addConfig(){
        const button = this.buttonView; 
        const values = this.values;
        const self   = this;

        this.keys.forEach(function(option,i){

            button[option] = values[i];

            if (option === "hotkey"){
                self.modifyTitle(i);
            }

        });

        this.addOnFunctions (button);
     
        return button;

    }

    maxView(type){
        this.addCss(type);
        return this.addConfig();
    }

    minView(type){
        this.addCss(type);

        const button = this.buttonView;
   
        button.width = 50;
        button.type  = "icon";

        return this.addConfig();
    }

    transparentView(){
        this.addCss("webix-transparent-btn");

        const button = this.buttonView;
   
        button.width = 50;
        button.type  = "icon";
        return this.addConfig();
    }

    static transparentDefaultState(){
        const primaryClass   = "webix-transparent-btn--primary";
        const secondaryClass = "webix-transparent-btn";
        try{
            const btnClass = document.querySelector(".webix_btn-filter");
            if (btnClass && btnClass.classList.contains (primaryClass)){
            
                btnClass.classList.add   (secondaryClass);
                btnClass.classList.remove(primaryClass);
            }
        } catch (err){
            errors_setFunctionError(
                err, 
                "buttons",
                "transparentViewDefaultState"
            );
        }
        
    }

}


;// CONCATENATED MODULE: ./src/js/components/logout/common.js










const logNameFile = "logout => common";

function putPrefs(id, sentObj){

    const path    = "/init/default/api/userprefs/" + id;
    const putData = webix.ajax().put(path, sentObj);

    putData.then(function(data){
   
        data = data.json();
    
        if (data.err_type !== "i"){
            setLogValue("error", data.err);
        }
    });

    putData.fail(function(err){
        setAjaxError(
            err, 
            logNameFile, 
            "putUserPrefs"
        );
    });   
}

function isPrefExists(data){
    const result = {
        exists : false
    };
 
    try{
        data.forEach(function(el){
            if (el.name == "userLocationHref"){
                result.exists = true;
                result.id     = el.id;
            } 
        });  
    }   catch(err){
        errors_setFunctionError(
            err, 
            logNameFile, 
            "isPrefExists"
        );
    }
    
    return result;
}



function postUserPrefs(sentObj){

    const path     = "/init/default/api/userprefs/";
    const postData = webix.ajax().post(path, sentObj);

    postData.then(function(data){
        data = data.json();
 
        if (data.err_type !== "i"){
            errors_setFunctionError(
                data.err, 
                logNameFile, 
                "putUserPrefs"
            );
        }
    });

    postData.fail(function(err){
        setAjaxError(
            err, 
            logNameFile, 
            "postUserPrefs"
        );
    });

}


function returnSentTamplate(name, data){
    return {
        name  : name,
        prefs : data
    };
}

async function logout() {
   
    let ownerId = getUserDataStorage();

    if (!ownerId){
        await pushUserDataStorage();
        ownerId = getUserDataStorage();
    }

    const path = "/init/default/api/userprefs/";
    const userprefsData = webix.ajax().get(path);

    userprefsData.then(function(data){
        data = data.json().content;

        const location    = {};
    

        location.href     = window.location.href;

        const restore = {
            editProp :  webix.storage.local.get("editFormTempData"),
            filter   :  webix.storage.local.get("currFilterState")
        };
        const locationData = returnSentTamplate("userLocationHref", location);
        const restoreData  = returnSentTamplate("userRestoreData",  restore );
   
        if (window.location.pathname !== "/index.html/content"){

            const result = isPrefExists(data);
            const isExists = result.exists;
      
         
            if (isExists){
                const id = result.id;
                putPrefs(id, locationData);
            } else {
                locationData.owner = ownerId.id;
                postUserPrefs(locationData);
            }
            restoreData.owner = ownerId.id;
            postUserPrefs(restoreData); // тк удаляется при login
        }
    });

    userprefsData.then(function(){
        Backbone.history.navigate("logout?auto=true", { trigger:true});
    });

    userprefsData.fail(function(err){
        setAjaxError(
            err, 
            logNameFile, 
            "logout"
        );
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
        
        let params    = new URLSearchParams(document.location.search);
        let autoParam = params.get("auto");

        const prefs = {
            href : window.location.href
        };

        if (!autoParam){
            setStorageData ("outsideHref", JSON.stringify(prefs) );
        }
   
   
    //Backbone.history.navigate("/", { trigger:true});
    //window.location.reload();

    }

    return notAuth;
}


;// CONCATENATED MODULE: ./src/js/blocks/globalStorage.js



const STORAGE = {};

function getTableNames (content){
    let tableNames = [];
    try{
        Object.values(content).forEach(function(el,i){
            tableNames.push({
                id:Object.keys(content)[i], 
                name:(el.plural) ? el.plural : el.singular
            });
        });
    } catch (err){   
        errors_setFunctionError(err,"globalStorage","getTableNames");
    }
    return tableNames;
}

function getData (fileName){
 
 
    if (    window.location.pathname !== "/index.html"          &&  
            window.location.pathname !== '/init/default/spaw'   ||
            fileName == "whoami"
        ){
        return webix.ajax().get(`/init/default/api/${fileName}.json`)
            .then(function (data) {
                STORAGE[fileName] = data.json();
                try{
                    if (fileName == "fields" && STORAGE[fileName]){
                        STORAGE.tableNames = getTableNames (STORAGE[fileName].content);
                    }
                } catch (err){   
                    errors_setFunctionError(err, "globalStorage", "getData");
                }
                return STORAGE[fileName];
            }).catch(err => {
                console.log(err);
                console.log("globalStorage function getData"); 
 
                checkNotAuth (err);
            }
        );
    }
    
}

class LoadServerData {
    static async content(nameFile){
        const self = this;

        if (!self[nameFile]){
            const path = `/init/default/api/${nameFile}.json`;
            
            return webix.ajax().get(path)
            .then(function (data){
                self[nameFile] = data.json();
                return true;
            })
            .fail(function (err){
                if (checkNotAuth (err)){
                   // Backbone.history.navigate("/", { trigger:true});
                } else {
                    $$("tree").callEvent("onLoadError", [err]);
                    return false;
                }
            });

        }
 
    }
}

class GetMenu   extends LoadServerData   {

    constructor(){
        super();
    }


    static get content (){
        if (this.mmenu){
            return this.mmenu.mmenu;
        }
    }


}

class GetFields extends LoadServerData {

    constructor(){
        super();
       // this.content = this.fields.content;
    }

    static attribute (key, attr){
        if (this.fields && this.fields.content[key]){
            return this.fields.content[key][attr];
        } 
    }

    static item (key){
        if (this.fields){
            return this.fields.content[key];
        } 
    }

    static get keys (){
        if (this.fields){
            return Object.keys  (this.fields.content);
        }   
    }

    static get values (){
        if (this.fields){
            return Object.values(this.fields.content);
        } 
    }

    static get names (){
        const values = this.values;
        const keys   = this.keys;
        if (this.fields){
            const tableNames = [];
            try{
                values.forEach(function(el,i){
                    tableNames.push({
                        id  : keys[i], 
                        name: (el.plural) ? el.plural : el.singular
                    });
                });
            } catch (err){   
                errors_setFunctionError(err,"globalStorage","getTableNames");
            }

            return tableNames;
  
        } 
    }
   
}



;// CONCATENATED MODULE: ./src/js/components/logBlock.js





let typeNotify;
let specificSrc;
let notifyText;


const eyeIcon      = "icon-eye";
const eyeIconSlash = "icon-eye-slash";


function createCurrDate(){
    const date    = new Date();
    const day     = date.getDate();
    const month   = String(date.getMonth() + 1).padStart(2, '0');
    const year    = date.getFullYear();
    const hours   = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}


function openLog(){
    try{
        const layout =  $$("logLayout");
        const btn    = $$("webix_log-btn");
        
        if (btn.config.icon == eyeIcon){
            layout.config.height = 90;
            layout.resize();
            btn   .setValue(2);

            btn.config.icon = eyeIconSlash;
            btn.refresh();

            setStorageData("LogVisible", JSON.stringify("show"));
        }
    } catch (err){
        errors_setFunctionError(err, "logBlock", "openLog");
    }
}

function addErrorStyle(id){
    const list = $$("logBlock-list");

    if (typeNotify == "error" && list){
        try{
            const item = list.getItemNode(id);
            if (item){
                item.style.setProperty('color', 'red', 'important');
            }
 
        } catch (err){
            errors_setFunctionError(err, "logBlock" ,"addErrorStyle");
        }

        openLog();
      
    }
}


function addLogMsg (src){
    const logList     = $$("logBlock-list");
    const currentDate = createCurrDate();
    if (!src){
        src = "expa";
    }
  
    logList.add({
        date  : currentDate,
        value : notifyText,
        src   : src
    });

    const lastId = logList.getLastId();

    logList.showItem(lastId);
}

function returnName(srcTable){
    const names = GetFields.names;
    let name;
    try{
        names.forEach(function(el){
            if (el.id == srcTable){
                name = el.name;
            }
        });

    } catch (err){
        errors_setFunctionError(err, "logBlock", "findTableName");
    }

    return name;
}

async function createLogMessage(srcTable) {
    let name;

    if (srcTable == "version"){
        name = 'Expa v1.0.69';

    } else if (srcTable == "cp"){
        name = 'Смена пароля';
    
    } else {
        await LoadServerData.content("fields");
        const keys = GetFields.keys;
        if (keys){
            name = returnName(srcTable);
        }
    }

    addLogMsg (name);
}

function initLogMsg(){
    try{

        let itemTreeId  = null;
        const tree      = $$("tree");

        if (tree && tree.getSelectedItem()){
            itemTreeId  = tree.getSelectedItem().id;
        } else {
            const href  = window.location.pathname;
            const index = href.lastIndexOf( "/" );
            itemTreeId  = href.slice( index + 1 );
        }

        if (specificSrc){
            createLogMessage(specificSrc);

        } else if (itemTreeId){
            createLogMessage(itemTreeId);

        } 
    } catch (err){
        errors_setFunctionError(err, "logBlock", "initLogMsg");
    }
}

let notifyCounter = 0;

function addNotify(btn){
    try{
   
        if ( btn.config.badge == "" ){
            notifyCounter = 0;
        }
        
        notifyCounter++;

        btn.config.badge = notifyCounter;
        btn.setValue(1);
        btn.refresh();

    } catch (err){
        errors_setFunctionError(
            err,
            "logBlock",
            "onAfterAdd addNotify"
        );
    }
}

function clearNotify(btn){
    try{
        notifyCounter    = 0;
        btn.config.badge = "";
        btn.setValue(2);
        btn.refresh();

    } catch (err){
        errors_setFunctionError(
            err,
            "logBlock",
            "onAfterAdd clearNotify"
        );
    }
}
const logBlock = {
    id      : "logBlock-list",
    css     : "webix_log-block",
    view    : "list",
    template: "#date# — #value#  (Источник: #src#)",
    data    : [],
    on      : {
        onAfterLoad:function(){
            setLogValue (
                "success", 
                "Интерфейс загружен", 
                "version"
            );   
        },
        onAfterAdd:function(id){
            const btn = $$("webix_log-btn");

            if ( btn.config.icon == eyeIcon ){
                addNotify(btn);
            } else if ( btn.config.icon == eyeIconSlash ){
                clearNotify(btn);
            }
            
            addErrorStyle(id);
        }
    }
};

const headline = {   
    template:
    "<div class='webix_log-headline'>Системные сообщения</div>", 
    height:30
};


const logLayout = {
    id:"logLayout",
    height:80,
    rows:[
        headline,
        logBlock
    ]
};

function setLogValue (type, text, src) {
    typeNotify  = type;
    specificSrc = src;
    notifyText  = text;     

    initLogMsg();
}


;// CONCATENATED MODULE: ./src/js/blocks/errors.js

function setAjaxError(err, file, func){
    if (err.status === 400 ||  err.status === 401 || err.status === 404){

        setLogValue(
            "error", 
            file +
            " function " + func + ": " +
            err.status + " " + err.statusText + " " + 
            err.responseURL + " (" + err.responseText + ") "
        );
    } else {
        setLogValue(
            "error", 
            file + 
            " function " + func + ": " +
            err.status + " " + err.statusText + " " +
            err.responseURL + " (" + err.responseText + ") ",
            "version"
        );

        window.alert("Ошибка. Статус: " + err.status + ". Отсутствует соединение с сервером.");
    }
}

let error;
function setToLog(msg){
    console.log(error)
    if (!error){

        const sentObj = {
            level : 3,
            msg   : msg 
        };
       
        const path = "/init/default/api/events";
        const eventData = webix.ajax().post(path, sentObj);
 
        eventData.then(function(data){
            data = data.json();
        });

        eventData.fail(function(err){
            error = true;
            setAjaxError(
                err, 
                "errors", 
                "setToLog"
            );
        });
    }
}

function errors_setFunctionError(err, file, func){
  
    console.log(err);
    const msg = file + " function " + func + ": " + err;

    setLogValue("error", file + " function " + func + ": " + err);

    setToLog(msg);
}


;// CONCATENATED MODULE: ./src/js/blocks/commonFunctions.js



let visibleItem;

function getItemId (){
    let idTable;


    try{
        const table     = $$("table");
        const tableView = $$("table-view");
        const dashboard = $$("dashboardContainer");

        if ($$("tables").isVisible()){
            idTable      = table.config.idTable;
            visibleItem  = table;
        } else if ($$("forms").isVisible()){
            idTable      = tableView.config.idTable;
            visibleItem  = tableView; 
  
        } else if ($$("dashboardContainer").isVisible()){
            idTable      = dashboard.config.idDash;
            visibleItem  = dashboard; 
        }

    } catch (err){
        errors_setFunctionError(err,"commonFunctions","getItemId");
    }

    return idTable;
}

function getTable(){
    getItemId ();
    return visibleItem;
}

class Action {
    static hideItem(item){
        if (item){
            item.hide();
        }
    }

    static showItem(item){
        if (item){
            item.show();
        }
    }

    static removeItem(item){
        if(item){
            const parent = item.getParentView();
            parent.removeView(item);
        }
    }

    static disableItem(item){
        if (item && item.isEnabled()){
            item.disable();
        }
    }

    static enableItem(item){
        if ( item && !(item.isEnabled()) ){
            item.enable();
        }
    }

    static destructItem(item){

        if(item){
            item.destructor();
        }
    }
}

class TableConfig {

    static getView (){
        let view;
    
        try{
            const table     = $$("table");
            const tableView = $$("table-view");
            console.log(table.isVisible(), tableView.isVisible());
            if ($$("tables").isVisible()){
        
                view = table;
            } else if ($$("forms").isVisible()){
             
                view = tableView; 
      
            }
    
        } catch (err){
            setFunctionError(err, "commonFunctions", "getView");
        }
        console.log(view);
        return view;
    }

    static getIdField (){
        const table = this.getView ();
        console.log(table);
        return table.config.idTable;
    }
}

function textInputClean(){
    let mdView = null;
  
    webix.event(document.body, "mousedown", e => { 
      const targetView = $$(e);
      if (targetView && targetView.getInputNode){
        mdView = targetView;
      } 
    });
    
    webix.event(document, "click", e => { 
      const clickedView = $$(e);
      if (mdView && clickedView && clickedView.config.id !== mdView.config.id){
        e.cancelBubble = true; 
        webix.html.preventEvent(e);
      }
      mdView = null;
    }, { capture: true });
}

function getComboOptions (refTable){
    const url       = "/init/default/api/" + refTable;

    return new webix.DataCollection({url:{
        $proxy:true,
        load: function(){
            return ( webix.ajax().get(url).then(function (data) {
                        data            = data.json().content;
                        const dataArray = [];
                        let keyArray;

                        function stringOption(l,el){
                            try{
                                while (l <= Object.values(el).length){
                                    if (typeof Object.values(el)[l] == "string"){
                                        keyArray = Object.keys(el)[l];
                                        break;
                                    } 
                                    l++;
                                }
                            } catch (err){  
                                errors_setFunctionError(
                                    err,
                                    "commonFunctions",
                                    "getComboOptions => stringOption"
                                );
                            }
                        }

                        function numOption(l,el){
                            try{
                                if (el[keyArray] == undefined){
                                    while (l <= Object.values(el).length) {
                                        if (typeof Object.values(el)[1] == "number"){
                                            keyArray = Object.keys(el)[1];
                                            break;
                                        }
                                        l++;
                                    }
                                }

                                dataArray.push({ "id":el.id, "value":el[keyArray]});
                            } catch (err){  
                                errors_setFunctionError(
                                    err,
                                    "commonFunctions",
                                    "getComboOptions => numOption"
                                );
                            }
                        }

                        function createComboValues(){
                            try{
                                data.forEach((el) =>{
                                    let l = 0;
                                    stringOption (l,el);
                                    numOption    (l,el);
                                
                                });
                            } catch (err){  
                                errors_setFunctionError(
                                    err,
                                    "commonFunctions",
                                    "getComboOptions => createComboValues"
                                );
                            }
                        }
                        createComboValues();
                        return dataArray;
                    
                    }).catch(err => {
                        setAjaxError(
                            err, 
                            "commonFunctions",
                            "getComboOptions"
                        );
                    })
            );
            
        }
    }});
}

function getUserDataStorage(){
    return  webix.storage.local.get("user");
}

async function pushUserDataStorage(){
 
    const path = "/init/default/api/whoami";
    const userprefsGetData = webix.ajax(path).fail(function(err){
        setAjaxError(err, "commonFunctions", "getUserData");
        return false;
    });

    userprefsGetData.then(function(data){

        data      = data.json().content;
 
        const userData = {};
    
        userData.id       = data.id;
        userData.name     = data.first_name;
        userData.username = data.username;
        
        setStorageData("user", JSON.stringify(userData));

    
    });

 
   
}



;// CONCATENATED MODULE: ./src/js/expalib.js
function lib (){
  
    (function (global, factory) {
        typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define('underscore', factory) :
        (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (function () {
          var current = global._;
          var exports = global._ = factory();
          exports.noConflict = function () { global._ = current; return exports; };
        }()));
      }(this, (function () {
        //     Underscore.js 1.13.4
        //     https://underscorejs.org
        //     (c) 2009-2022 Jeremy Ashkenas, Julian Gonggrijp, and DocumentCloud and Investigative Reporters & Editors
        //     Underscore may be freely distributed under the MIT license.
      
        // Current version.
        var VERSION = '1.13.4';
      
        // Establish the root object, `window` (`self`) in the browser, `global`
        // on the server, or `this` in some virtual machines. We use `self`
        // instead of `window` for `WebWorker` support.
        var root = (typeof self == 'object' && self.self === self && self) ||
                  (typeof global == 'object' && global.global === global && global) ||
                  Function('return this')() ||
                  {};
      
        // Save bytes in the minified (but not gzipped) version:
        var ArrayProto = Array.prototype, ObjProto = Object.prototype;
        var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;
      
        // Create quick reference variables for speed access to core prototypes.
        var push = ArrayProto.push,
            slice = ArrayProto.slice,
            toString = ObjProto.toString,
            hasOwnProperty = ObjProto.hasOwnProperty;
      
        // Modern feature detection.
        var supportsArrayBuffer = typeof ArrayBuffer !== 'undefined',
            supportsDataView = typeof DataView !== 'undefined';
      
        // All **ECMAScript 5+** native function implementations that we hope to use
        // are declared here.
        var nativeIsArray = Array.isArray,
            nativeKeys = Object.keys,
            nativeCreate = Object.create,
            nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;
      
        // Create references to these builtin functions because we override them.
        var _isNaN = isNaN,
            _isFinite = isFinite;
      
        // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
        var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
        var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
          'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
      
        // The largest integer that can be represented exactly.
        var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
      
        // Some functions take a variable number of arguments, or a few expected
        // arguments at the beginning and then a variable number of values to operate
        // on. This helper accumulates all remaining arguments past the function’s
        // argument length (or an explicit `startIndex`), into an array that becomes
        // the last argument. Similar to ES6’s "rest parameter".
        function restArguments(func, startIndex) {
          startIndex = startIndex == null ? func.length - 1 : +startIndex;
          return function() {
            var length = Math.max(arguments.length - startIndex, 0),
                rest = Array(length),
                index = 0;
            for (; index < length; index++) {
              rest[index] = arguments[index + startIndex];
            }
            switch (startIndex) {
              case 0: return func.call(this, rest);
              case 1: return func.call(this, arguments[0], rest);
              case 2: return func.call(this, arguments[0], arguments[1], rest);
            }
            var args = Array(startIndex + 1);
            for (index = 0; index < startIndex; index++) {
              args[index] = arguments[index];
            }
            args[startIndex] = rest;
            return func.apply(this, args);
          };
        }
      
        // Is a given variable an object?
        function isObject(obj) {
          var type = typeof obj;
          return type === 'function' || (type === 'object' && !!obj);
        }
      
        // Is a given value equal to null?
        function isNull(obj) {
          return obj === null;
        }
      
        // Is a given variable undefined?
        function isUndefined(obj) {
          return obj === void 0;
        }
      
        // Is a given value a boolean?
        function isBoolean(obj) {
          return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
        }
      
        // Is a given value a DOM element?
        function isElement(obj) {
          return !!(obj && obj.nodeType === 1);
        }
      
        // Internal function for creating a `toString`-based type tester.
        function tagTester(name) {
          var tag = '[object ' + name + ']';
          return function(obj) {
            return toString.call(obj) === tag;
          };
        }
      
        var isString = tagTester('String');
      
        var isNumber = tagTester('Number');
      
        var isDate = tagTester('Date');
      
        var isRegExp = tagTester('RegExp');
      
        var isError = tagTester('Error');
      
        var isSymbol = tagTester('Symbol');
      
        var isArrayBuffer = tagTester('ArrayBuffer');
      
        var isFunction = tagTester('Function');
      
        // Optimize `isFunction` if appropriate. Work around some `typeof` bugs in old
        // v8, IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
        var nodelist = root.document && root.document.childNodes;
        if ( true && typeof Int8Array != 'object' && typeof nodelist != 'function') {
          isFunction = function(obj) {
            return typeof obj == 'function' || false;
          };
        }
      
        var isFunction$1 = isFunction;
      
        var hasObjectTag = tagTester('Object');
      
        // In IE 10 - Edge 13, `DataView` has string tag `'[object Object]'`.
        // In IE 11, the most common among them, this problem also applies to
        // `Map`, `WeakMap` and `Set`.
        var hasStringTagBug = (
              supportsDataView && hasObjectTag(new DataView(new ArrayBuffer(8)))
            ),
            isIE11 = (typeof Map !== 'undefined' && hasObjectTag(new Map));
      
        var isDataView = tagTester('DataView');
      
        // In IE 10 - Edge 13, we need a different heuristic
        // to determine whether an object is a `DataView`.
        function ie10IsDataView(obj) {
          return obj != null && isFunction$1(obj.getInt8) && isArrayBuffer(obj.buffer);
        }
      
        var isDataView$1 = (hasStringTagBug ? ie10IsDataView : isDataView);
      
        // Is a given value an array?
        // Delegates to ECMA5's native `Array.isArray`.
        var isArray = nativeIsArray || tagTester('Array');
      
        // Internal function to check whether `key` is an own property name of `obj`.
        function has$1(obj, key) {
          return obj != null && hasOwnProperty.call(obj, key);
        }
      
        var isArguments = tagTester('Arguments');
      
        // Define a fallback version of the method in browsers (ahem, IE < 9), where
        // there isn't any inspectable "Arguments" type.
        (function() {
          if (!isArguments(arguments)) {
            isArguments = function(obj) {
              return has$1(obj, 'callee');
            };
          }
        }());
      
        var isArguments$1 = isArguments;
      
        // Is a given object a finite number?
        function isFinite$1(obj) {
          return !isSymbol(obj) && _isFinite(obj) && !isNaN(parseFloat(obj));
        }
      
        // Is the given value `NaN`?
        function isNaN$1(obj) {
          return isNumber(obj) && _isNaN(obj);
        }
      
        // Predicate-generating function. Often useful outside of Underscore.
        function constant(value) {
          return function() {
            return value;
          };
        }
      
        // Common internal logic for `isArrayLike` and `isBufferLike`.
        function createSizePropertyCheck(getSizeProperty) {
          return function(collection) {
            var sizeProperty = getSizeProperty(collection);
            return typeof sizeProperty == 'number' && sizeProperty >= 0 && sizeProperty <= MAX_ARRAY_INDEX;
          }
        }
      
        // Internal helper to generate a function to obtain property `key` from `obj`.
        function shallowProperty(key) {
          return function(obj) {
            return obj == null ? void 0 : obj[key];
          };
        }
      
        // Internal helper to obtain the `byteLength` property of an object.
        var getByteLength = shallowProperty('byteLength');
      
        // Internal helper to determine whether we should spend extensive checks against
        // `ArrayBuffer` et al.
        var isBufferLike = createSizePropertyCheck(getByteLength);
      
        // Is a given value a typed array?
        var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
        function isTypedArray(obj) {
          // `ArrayBuffer.isView` is the most future-proof, so use it when available.
          // Otherwise, fall back on the above regular expression.
          return nativeIsView ? (nativeIsView(obj) && !isDataView$1(obj)) :
                        isBufferLike(obj) && typedArrayPattern.test(toString.call(obj));
        }
      
        var isTypedArray$1 = supportsArrayBuffer ? isTypedArray : constant(false);
      
        // Internal helper to obtain the `length` property of an object.
        var getLength = shallowProperty('length');
      
        // Internal helper to create a simple lookup structure.
        // `collectNonEnumProps` used to depend on `_.contains`, but this led to
        // circular imports. `emulatedSet` is a one-off solution that only works for
        // arrays of strings.
        function emulatedSet(keys) {
          var hash = {};
          for (var l = keys.length, i = 0; i < l; ++i) hash[keys[i]] = true;
          return {
            contains: function(key) { return hash[key] === true; },
            push: function(key) {
              hash[key] = true;
              return keys.push(key);
            }
          };
        }
      
        // Internal helper. Checks `keys` for the presence of keys in IE < 9 that won't
        // be iterated by `for key in ...` and thus missed. Extends `keys` in place if
        // needed.
        function collectNonEnumProps(obj, keys) {
          keys = emulatedSet(keys);
          var nonEnumIdx = nonEnumerableProps.length;
          var constructor = obj.constructor;
          var proto = (isFunction$1(constructor) && constructor.prototype) || ObjProto;
      
          // Constructor is a special case.
          var prop = 'constructor';
          if (has$1(obj, prop) && !keys.contains(prop)) keys.push(prop);
      
          while (nonEnumIdx--) {
            prop = nonEnumerableProps[nonEnumIdx];
            if (prop in obj && obj[prop] !== proto[prop] && !keys.contains(prop)) {
              keys.push(prop);
            }
          }
        }
      
        // Retrieve the names of an object's own properties.
        // Delegates to **ECMAScript 5**'s native `Object.keys`.
        function keys(obj) {
          if (!isObject(obj)) return [];
          if (nativeKeys) return nativeKeys(obj);
          var keys = [];
          for (var key in obj) if (has$1(obj, key)) keys.push(key);
          // Ahem, IE < 9.
          if (hasEnumBug) collectNonEnumProps(obj, keys);
          return keys;
        }
      
        // Is a given array, string, or object empty?
        // An "empty" object has no enumerable own-properties.
        function isEmpty(obj) {
          if (obj == null) return true;
          // Skip the more expensive `toString`-based type checks if `obj` has no
          // `.length`.
          var length = getLength(obj);
          if (typeof length == 'number' && (
            isArray(obj) || isString(obj) || isArguments$1(obj)
          )) return length === 0;
          return getLength(keys(obj)) === 0;
        }
      
        // Returns whether an object has a given set of `key:value` pairs.
        function isMatch(object, attrs) {
          var _keys = keys(attrs), length = _keys.length;
          if (object == null) return !length;
          var obj = Object(object);
          for (var i = 0; i < length; i++) {
            var key = _keys[i];
            if (attrs[key] !== obj[key] || !(key in obj)) return false;
          }
          return true;
        }
      
        // If Underscore is called as a function, it returns a wrapped object that can
        // be used OO-style. This wrapper holds altered versions of all functions added
        // through `_.mixin`. Wrapped objects may be chained.
        function _$1(obj) {
          if (obj instanceof _$1) return obj;
          if (!(this instanceof _$1)) return new _$1(obj);
          this._wrapped = obj;
        }
      
        _$1.VERSION = VERSION;
      
        // Extracts the result from a wrapped and chained object.
        _$1.prototype.value = function() {
          return this._wrapped;
        };
      
        // Provide unwrapping proxies for some methods used in engine operations
        // such as arithmetic and JSON stringification.
        _$1.prototype.valueOf = _$1.prototype.toJSON = _$1.prototype.value;
      
        _$1.prototype.toString = function() {
          return String(this._wrapped);
        };
      
        // Internal function to wrap or shallow-copy an ArrayBuffer,
        // typed array or DataView to a new view, reusing the buffer.
        function toBufferView(bufferSource) {
          return new Uint8Array(
            bufferSource.buffer || bufferSource,
            bufferSource.byteOffset || 0,
            getByteLength(bufferSource)
          );
        }
      
        // We use this string twice, so give it a name for minification.
        var tagDataView = '[object DataView]';
      
        // Internal recursive comparison function for `_.isEqual`.
        function eq(a, b, aStack, bStack) {
          // Identical objects are equal. `0 === -0`, but they aren't identical.
          // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
          if (a === b) return a !== 0 || 1 / a === 1 / b;
          // `null` or `undefined` only equal to itself (strict comparison).
          if (a == null || b == null) return false;
          // `NaN`s are equivalent, but non-reflexive.
          if (a !== a) return b !== b;
          // Exhaust primitive checks
          var type = typeof a;
          if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
          return deepEq(a, b, aStack, bStack);
        }
      
        // Internal recursive comparison function for `_.isEqual`.
        function deepEq(a, b, aStack, bStack) {
          // Unwrap any wrapped objects.
          if (a instanceof _$1) a = a._wrapped;
          if (b instanceof _$1) b = b._wrapped;
          // Compare `[[Class]]` names.
          var className = toString.call(a);
          if (className !== toString.call(b)) return false;
          // Work around a bug in IE 10 - Edge 13.
          if (hasStringTagBug && className == '[object Object]' && isDataView$1(a)) {
            if (!isDataView$1(b)) return false;
            className = tagDataView;
          }
          switch (className) {
            // These types are compared by value.
            case '[object RegExp]':
              // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
            case '[object String]':
              // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
              // equivalent to `new String("5")`.
              return '' + a === '' + b;
            case '[object Number]':
              // `NaN`s are equivalent, but non-reflexive.
              // Object(NaN) is equivalent to NaN.
              if (+a !== +a) return +b !== +b;
              // An `egal` comparison is performed for other numeric values.
              return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case '[object Date]':
            case '[object Boolean]':
              // Coerce dates and booleans to numeric primitive values. Dates are compared by their
              // millisecond representations. Note that invalid dates with millisecond representations
              // of `NaN` are not equivalent.
              return +a === +b;
            case '[object Symbol]':
              return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
            case '[object ArrayBuffer]':
            case tagDataView:
              // Coerce to typed array so we can fall through.
              return deepEq(toBufferView(a), toBufferView(b), aStack, bStack);
          }
      
          var areArrays = className === '[object Array]';
          if (!areArrays && isTypedArray$1(a)) {
              var byteLength = getByteLength(a);
              if (byteLength !== getByteLength(b)) return false;
              if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) return true;
              areArrays = true;
          }
          if (!areArrays) {
            if (typeof a != 'object' || typeof b != 'object') return false;
      
            // Objects with different constructors are not equivalent, but `Object`s or `Array`s
            // from different frames are.
            var aCtor = a.constructor, bCtor = b.constructor;
            if (aCtor !== bCtor && !(isFunction$1(aCtor) && aCtor instanceof aCtor &&
                                     isFunction$1(bCtor) && bCtor instanceof bCtor)
                                && ('constructor' in a && 'constructor' in b)) {
              return false;
            }
          }
          // Assume equality for cyclic structures. The algorithm for detecting cyclic
          // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
      
          // Initializing stack of traversed objects.
          // It's done here since we only need them for objects and arrays comparison.
          aStack = aStack || [];
          bStack = bStack || [];
          var length = aStack.length;
          while (length--) {
            // Linear search. Performance is inversely proportional to the number of
            // unique nested structures.
            if (aStack[length] === a) return bStack[length] === b;
          }
      
          // Add the first object to the stack of traversed objects.
          aStack.push(a);
          bStack.push(b);
      
          // Recursively compare objects and arrays.
          if (areArrays) {
            // Compare array lengths to determine if a deep comparison is necessary.
            length = a.length;
            if (length !== b.length) return false;
            // Deep compare the contents, ignoring non-numeric properties.
            while (length--) {
              if (!eq(a[length], b[length], aStack, bStack)) return false;
            }
          } else {
            // Deep compare objects.
            var _keys = keys(a), key;
            length = _keys.length;
            // Ensure that both objects contain the same number of properties before comparing deep equality.
            if (keys(b).length !== length) return false;
            while (length--) {
              // Deep compare each member
              key = _keys[length];
              if (!(has$1(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
            }
          }
          // Remove the first object from the stack of traversed objects.
          aStack.pop();
          bStack.pop();
          return true;
        }
      
        // Perform a deep comparison to check if two objects are equal.
        function isEqual(a, b) {
          return eq(a, b);
        }
      
        // Retrieve all the enumerable property names of an object.
        function allKeys(obj) {
          if (!isObject(obj)) return [];
          var keys = [];
          for (var key in obj) keys.push(key);
          // Ahem, IE < 9.
          if (hasEnumBug) collectNonEnumProps(obj, keys);
          return keys;
        }
      
        // Since the regular `Object.prototype.toString` type tests don't work for
        // some types in IE 11, we use a fingerprinting heuristic instead, based
        // on the methods. It's not great, but it's the best we got.
        // The fingerprint method lists are defined below.
        function ie11fingerprint(methods) {
          var length = getLength(methods);
          return function(obj) {
            if (obj == null) return false;
            // `Map`, `WeakMap` and `Set` have no enumerable keys.
            var keys = allKeys(obj);
            if (getLength(keys)) return false;
            for (var i = 0; i < length; i++) {
              if (!isFunction$1(obj[methods[i]])) return false;
            }
            // If we are testing against `WeakMap`, we need to ensure that
            // `obj` doesn't have a `forEach` method in order to distinguish
            // it from a regular `Map`.
            return methods !== weakMapMethods || !isFunction$1(obj[forEachName]);
          };
        }
      
        // In the interest of compact minification, we write
        // each string in the fingerprints only once.
        var forEachName = 'forEach',
            hasName = 'has',
            commonInit = ['clear', 'delete'],
            mapTail = ['get', hasName, 'set'];
      
        // `Map`, `WeakMap` and `Set` each have slightly different
        // combinations of the above sublists.
        var mapMethods = commonInit.concat(forEachName, mapTail),
            weakMapMethods = commonInit.concat(mapTail),
            setMethods = ['add'].concat(commonInit, forEachName, hasName);
      
        var isMap = isIE11 ? ie11fingerprint(mapMethods) : tagTester('Map');
      
        var isWeakMap = isIE11 ? ie11fingerprint(weakMapMethods) : tagTester('WeakMap');
      
        var isSet = isIE11 ? ie11fingerprint(setMethods) : tagTester('Set');
      
        var isWeakSet = tagTester('WeakSet');
      
        // Retrieve the values of an object's properties.
        function values(obj) {
          var _keys = keys(obj);
          var length = _keys.length;
          var values = Array(length);
          for (var i = 0; i < length; i++) {
            values[i] = obj[_keys[i]];
          }
          return values;
        }
      
        // Convert an object into a list of `[key, value]` pairs.
        // The opposite of `_.object` with one argument.
        function pairs(obj) {
          var _keys = keys(obj);
          var length = _keys.length;
          var pairs = Array(length);
          for (var i = 0; i < length; i++) {
            pairs[i] = [_keys[i], obj[_keys[i]]];
          }
          return pairs;
        }
      
        // Invert the keys and values of an object. The values must be serializable.
        function invert(obj) {
          var result = {};
          var _keys = keys(obj);
          for (var i = 0, length = _keys.length; i < length; i++) {
            result[obj[_keys[i]]] = _keys[i];
          }
          return result;
        }
      
        // Return a sorted list of the function names available on the object.
        function functions(obj) {
          var names = [];
          for (var key in obj) {
            if (isFunction$1(obj[key])) names.push(key);
          }
          return names.sort();
        }
      
        // An internal function for creating assigner functions.
        function createAssigner(keysFunc, defaults) {
          return function(obj) {
            var length = arguments.length;
            if (defaults) obj = Object(obj);
            if (length < 2 || obj == null) return obj;
            for (var index = 1; index < length; index++) {
              var source = arguments[index],
                  keys = keysFunc(source),
                  l = keys.length;
              for (var i = 0; i < l; i++) {
                var key = keys[i];
                if (!defaults || obj[key] === void 0) obj[key] = source[key];
              }
            }
            return obj;
          };
        }
      
        // Extend a given object with all the properties in passed-in object(s).
        var extend = createAssigner(allKeys);
      
        // Assigns a given object with all the own properties in the passed-in
        // object(s).
        // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
        var extendOwn = createAssigner(keys);
      
        // Fill in a given object with default properties.
        var defaults = createAssigner(allKeys, true);
      
        // Create a naked function reference for surrogate-prototype-swapping.
        function ctor() {
          return function(){};
        }
      
        // An internal function for creating a new object that inherits from another.
        function baseCreate(prototype) {
          if (!isObject(prototype)) return {};
          if (nativeCreate) return nativeCreate(prototype);
          var Ctor = ctor();
          Ctor.prototype = prototype;
          var result = new Ctor;
          Ctor.prototype = null;
          return result;
        }
      
        // Creates an object that inherits from the given prototype object.
        // If additional properties are provided then they will be added to the
        // created object.
        function create(prototype, props) {
          var result = baseCreate(prototype);
          if (props) extendOwn(result, props);
          return result;
        }
      
        // Create a (shallow-cloned) duplicate of an object.
        function clone(obj) {
          if (!isObject(obj)) return obj;
          return isArray(obj) ? obj.slice() : extend({}, obj);
        }
      
        // Invokes `interceptor` with the `obj` and then returns `obj`.
        // The primary purpose of this method is to "tap into" a method chain, in
        // order to perform operations on intermediate results within the chain.
        function tap(obj, interceptor) {
          interceptor(obj);
          return obj;
        }
      
        // Normalize a (deep) property `path` to array.
        // Like `_.iteratee`, this function can be customized.
        function toPath$1(path) {
          return isArray(path) ? path : [path];
        }
        _$1.toPath = toPath$1;
      
        // Internal wrapper for `_.toPath` to enable minification.
        // Similar to `cb` for `_.iteratee`.
        function toPath(path) {
          return _$1.toPath(path);
        }
      
        // Internal function to obtain a nested property in `obj` along `path`.
        function deepGet(obj, path) {
          var length = path.length;
          for (var i = 0; i < length; i++) {
            if (obj == null) return void 0;
            obj = obj[path[i]];
          }
          return length ? obj : void 0;
        }
      
        // Get the value of the (deep) property on `path` from `object`.
        // If any property in `path` does not exist or if the value is
        // `undefined`, return `defaultValue` instead.
        // The `path` is normalized through `_.toPath`.
        function get(object, path, defaultValue) {
          var value = deepGet(object, toPath(path));
          return isUndefined(value) ? defaultValue : value;
        }
      
        // Shortcut function for checking if an object has a given property directly on
        // itself (in other words, not on a prototype). Unlike the internal `has`
        // function, this public version can also traverse nested properties.
        function has(obj, path) {
          path = toPath(path);
          var length = path.length;
          for (var i = 0; i < length; i++) {
            var key = path[i];
            if (!has$1(obj, key)) return false;
            obj = obj[key];
          }
          return !!length;
        }
      
        // Keep the identity function around for default iteratees.
        function identity(value) {
          return value;
        }
      
        // Returns a predicate for checking whether an object has a given set of
        // `key:value` pairs.
        function matcher(attrs) {
          attrs = extendOwn({}, attrs);
          return function(obj) {
            return isMatch(obj, attrs);
          };
        }
      
        // Creates a function that, when passed an object, will traverse that object’s
        // properties down the given `path`, specified as an array of keys or indices.
        function property(path) {
          path = toPath(path);
          return function(obj) {
            return deepGet(obj, path);
          };
        }
      
        // Internal function that returns an efficient (for current engines) version
        // of the passed-in callback, to be repeatedly applied in other Underscore
        // functions.
        function optimizeCb(func, context, argCount) {
          if (context === void 0) return func;
          switch (argCount == null ? 3 : argCount) {
            case 1: return function(value) {
              return func.call(context, value);
            };
            // The 2-argument case is omitted because we’re not using it.
            case 3: return function(value, index, collection) {
              return func.call(context, value, index, collection);
            };
            case 4: return function(accumulator, value, index, collection) {
              return func.call(context, accumulator, value, index, collection);
            };
          }
          return function() {
            return func.apply(context, arguments);
          };
        }
      
        // An internal function to generate callbacks that can be applied to each
        // element in a collection, returning the desired result — either `_.identity`,
        // an arbitrary callback, a property matcher, or a property accessor.
        function baseIteratee(value, context, argCount) {
          if (value == null) return identity;
          if (isFunction$1(value)) return optimizeCb(value, context, argCount);
          if (isObject(value) && !isArray(value)) return matcher(value);
          return property(value);
        }
      
        // External wrapper for our callback generator. Users may customize
        // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
        // This abstraction hides the internal-only `argCount` argument.
        function iteratee(value, context) {
          return baseIteratee(value, context, Infinity);
        }
        _$1.iteratee = iteratee;
      
        // The function we call internally to generate a callback. It invokes
        // `_.iteratee` if overridden, otherwise `baseIteratee`.
        function cb(value, context, argCount) {
          if (_$1.iteratee !== iteratee) return _$1.iteratee(value, context);
          return baseIteratee(value, context, argCount);
        }
      
        // Returns the results of applying the `iteratee` to each element of `obj`.
        // In contrast to `_.map` it returns an object.
        function mapObject(obj, iteratee, context) {
          iteratee = cb(iteratee, context);
          var _keys = keys(obj),
              length = _keys.length,
              results = {};
          for (var index = 0; index < length; index++) {
            var currentKey = _keys[index];
            results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
          }
          return results;
        }
      
        // Predicate-generating function. Often useful outside of Underscore.
        function noop(){}
      
        // Generates a function for a given object that returns a given property.
        function propertyOf(obj) {
          if (obj == null) return noop;
          return function(path) {
            return get(obj, path);
          };
        }
      
        // Run a function **n** times.
        function times(n, iteratee, context) {
          var accum = Array(Math.max(0, n));
          iteratee = optimizeCb(iteratee, context, 1);
          for (var i = 0; i < n; i++) accum[i] = iteratee(i);
          return accum;
        }
      
        // Return a random integer between `min` and `max` (inclusive).
        function random(min, max) {
          if (max == null) {
            max = min;
            min = 0;
          }
          return min + Math.floor(Math.random() * (max - min + 1));
        }
      
        // A (possibly faster) way to get the current timestamp as an integer.
        var now = Date.now || function() {
          return new Date().getTime();
        };
      
        // Internal helper to generate functions for escaping and unescaping strings
        // to/from HTML interpolation.
        function createEscaper(map) {
          var escaper = function(match) {
            return map[match];
          };
          // Regexes for identifying a key that needs to be escaped.
          var source = '(?:' + keys(map).join('|') + ')';
          var testRegexp = RegExp(source);
          var replaceRegexp = RegExp(source, 'g');
          return function(string) {
            string = string == null ? '' : '' + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
          };
        }
      
        // Internal list of HTML entities for escaping.
        var escapeMap = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '`': '&#x60;'
        };
      
        // Function for escaping strings to HTML interpolation.
        var _escape = createEscaper(escapeMap);
      
        // Internal list of HTML entities for unescaping.
        var unescapeMap = invert(escapeMap);
      
        // Function for unescaping strings from HTML interpolation.
        var _unescape = createEscaper(unescapeMap);
      
        // By default, Underscore uses ERB-style template delimiters. Change the
        // following template settings to use alternative delimiters.
        var templateSettings = _$1.templateSettings = {
          evaluate: /<%([\s\S]+?)%>/g,
          interpolate: /<%=([\s\S]+?)%>/g,
          escape: /<%-([\s\S]+?)%>/g
        };
      
        // When customizing `_.templateSettings`, if you don't want to define an
        // interpolation, evaluation or escaping regex, we need one that is
        // guaranteed not to match.
        var noMatch = /(.)^/;
      
        // Certain characters need to be escaped so that they can be put into a
        // string literal.
        var escapes = {
          "'": "'",
          '\\': '\\',
          '\r': 'r',
          '\n': 'n',
          '\u2028': 'u2028',
          '\u2029': 'u2029'
        };
      
        var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
      
        function escapeChar(match) {
          return '\\' + escapes[match];
        }
      
        // In order to prevent third-party code injection through
        // `_.templateSettings.variable`, we test it against the following regular
        // expression. It is intentionally a bit more liberal than just matching valid
        // identifiers, but still prevents possible loopholes through defaults or
        // destructuring assignment.
        var bareIdentifier = /^\s*(\w|\$)+\s*$/;
      
        // JavaScript micro-templating, similar to John Resig's implementation.
        // Underscore templating handles arbitrary delimiters, preserves whitespace,
        // and correctly escapes quotes within interpolated code.
        // NB: `oldSettings` only exists for backwards compatibility.
        function template(text, settings, oldSettings) {
          if (!settings && oldSettings) settings = oldSettings;
          settings = defaults({}, settings, _$1.templateSettings);
      
          // Combine delimiters into one regular expression via alternation.
          var matcher = RegExp([
            (settings.escape || noMatch).source,
            (settings.interpolate || noMatch).source,
            (settings.evaluate || noMatch).source
          ].join('|') + '|$', 'g');
      
          // Compile the template source, escaping string literals appropriately.
          var index = 0;
          var source = "__p+='";
          text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
            index = offset + match.length;
      
            if (escape) {
              source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
            } else if (interpolate) {
              source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            } else if (evaluate) {
              source += "';\n" + evaluate + "\n__p+='";
            }
      
            // Adobe VMs need the match returned to produce the correct offset.
            return match;
          });
          source += "';\n";
      
          var argument = settings.variable;
          if (argument) {
            // Insure against third-party code injection. (CVE-2021-23358)
            if (!bareIdentifier.test(argument)) throw new Error(
              'variable is not a bare identifier: ' + argument
            );
          } else {
            // If a variable is not specified, place data values in local scope.
            source = 'with(obj||{}){\n' + source + '}\n';
            argument = 'obj';
          }
      
          source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + 'return __p;\n';
      
          var render;
          try {
            render = new Function(argument, '_', source);
          } catch (e) {
            e.source = source;
            throw e;
          }
      
          var template = function(data) {
            return render.call(this, data, _$1);
          };
      
          // Provide the compiled source as a convenience for precompilation.
          template.source = 'function(' + argument + '){\n' + source + '}';
      
          return template;
        }
      
        // Traverses the children of `obj` along `path`. If a child is a function, it
        // is invoked with its parent as context. Returns the value of the final
        // child, or `fallback` if any child is undefined.
        function result(obj, path, fallback) {
          path = toPath(path);
          var length = path.length;
          if (!length) {
            return isFunction$1(fallback) ? fallback.call(obj) : fallback;
          }
          for (var i = 0; i < length; i++) {
            var prop = obj == null ? void 0 : obj[path[i]];
            if (prop === void 0) {
              prop = fallback;
              i = length; // Ensure we don't continue iterating.
            }
            obj = isFunction$1(prop) ? prop.call(obj) : prop;
          }
          return obj;
        }
      
        // Generate a unique integer id (unique within the entire client session).
        // Useful for temporary DOM ids.
        var idCounter = 0;
        function uniqueId(prefix) {
          var id = ++idCounter + '';
          return prefix ? prefix + id : id;
        }
      
        // Start chaining a wrapped Underscore object.
        function chain(obj) {
          var instance = _$1(obj);
          instance._chain = true;
          return instance;
        }
      
        // Internal function to execute `sourceFunc` bound to `context` with optional
        // `args`. Determines whether to execute a function as a constructor or as a
        // normal function.
        function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
          if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
          var self = baseCreate(sourceFunc.prototype);
          var result = sourceFunc.apply(self, args);
          if (isObject(result)) return result;
          return self;
        }
      
        // Partially apply a function by creating a version that has had some of its
        // arguments pre-filled, without changing its dynamic `this` context. `_` acts
        // as a placeholder by default, allowing any combination of arguments to be
        // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
        var partial = restArguments(function(func, boundArgs) {
          var placeholder = partial.placeholder;
          var bound = function() {
            var position = 0, length = boundArgs.length;
            var args = Array(length);
            for (var i = 0; i < length; i++) {
              args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
            }
            while (position < arguments.length) args.push(arguments[position++]);
            return executeBound(func, bound, this, this, args);
          };
          return bound;
        });
      
        partial.placeholder = _$1;
      
        // Create a function bound to a given object (assigning `this`, and arguments,
        // optionally).
        var bind = restArguments(function(func, context, args) {
          if (!isFunction$1(func)) throw new TypeError('Bind must be called on a function');
          var bound = restArguments(function(callArgs) {
            return executeBound(func, bound, context, this, args.concat(callArgs));
          });
          return bound;
        });
      
        // Internal helper for collection methods to determine whether a collection
        // should be iterated as an array or as an object.
        // Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
        // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
        var isArrayLike = createSizePropertyCheck(getLength);
      
        // Internal implementation of a recursive `flatten` function.
        function flatten$1(input, depth, strict, output) {
          output = output || [];
          if (!depth && depth !== 0) {
            depth = Infinity;
          } else if (depth <= 0) {
            return output.concat(input);
          }
          var idx = output.length;
          for (var i = 0, length = getLength(input); i < length; i++) {
            var value = input[i];
            if (isArrayLike(value) && (isArray(value) || isArguments$1(value))) {
              // Flatten current level of array or arguments object.
              if (depth > 1) {
                flatten$1(value, depth - 1, strict, output);
                idx = output.length;
              } else {
                var j = 0, len = value.length;
                while (j < len) output[idx++] = value[j++];
              }
            } else if (!strict) {
              output[idx++] = value;
            }
          }
          return output;
        }
      
        // Bind a number of an object's methods to that object. Remaining arguments
        // are the method names to be bound. Useful for ensuring that all callbacks
        // defined on an object belong to it.
        var bindAll = restArguments(function(obj, keys) {
          keys = flatten$1(keys, false, false);
          var index = keys.length;
          if (index < 1) throw new Error('bindAll must be passed function names');
          while (index--) {
            var key = keys[index];
            obj[key] = bind(obj[key], obj);
          }
          return obj;
        });
      
        // Memoize an expensive function by storing its results.
        function memoize(func, hasher) {
          var memoize = function(key) {
            var cache = memoize.cache;
            var address = '' + (hasher ? hasher.apply(this, arguments) : key);
            if (!has$1(cache, address)) cache[address] = func.apply(this, arguments);
            return cache[address];
          };
          memoize.cache = {};
          return memoize;
        }
      
        // Delays a function for the given number of milliseconds, and then calls
        // it with the arguments supplied.
        var delay = restArguments(function(func, wait, args) {
          return setTimeout(function() {
            return func.apply(null, args);
          }, wait);
        });
      
        // Defers a function, scheduling it to run after the current call stack has
        // cleared.
        var defer = partial(delay, _$1, 1);
      
        // Returns a function, that, when invoked, will only be triggered at most once
        // during a given window of time. Normally, the throttled function will run
        // as much as it can, without ever going more than once per `wait` duration;
        // but if you'd like to disable the execution on the leading edge, pass
        // `{leading: false}`. To disable execution on the trailing edge, ditto.
        function throttle(func, wait, options) {
          var timeout, context, args, result;
          var previous = 0;
          if (!options) options = {};
      
          var later = function() {
            previous = options.leading === false ? 0 : now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
          };
      
          var throttled = function() {
            var _now = now();
            if (!previous && options.leading === false) previous = _now;
            var remaining = wait - (_now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
              if (timeout) {
                clearTimeout(timeout);
                timeout = null;
              }
              previous = _now;
              result = func.apply(context, args);
              if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
              timeout = setTimeout(later, remaining);
            }
            return result;
          };
      
          throttled.cancel = function() {
            clearTimeout(timeout);
            previous = 0;
            timeout = context = args = null;
          };
      
          return throttled;
        }
      
        // When a sequence of calls of the returned function ends, the argument
        // function is triggered. The end of a sequence is defined by the `wait`
        // parameter. If `immediate` is passed, the argument function will be
        // triggered at the beginning of the sequence instead of at the end.
        function debounce(func, wait, immediate) {
          var timeout, previous, args, result, context;
      
          var later = function() {
            var passed = now() - previous;
            if (wait > passed) {
              timeout = setTimeout(later, wait - passed);
            } else {
              timeout = null;
              if (!immediate) result = func.apply(context, args);
              // This check is needed because `func` can recursively invoke `debounced`.
              if (!timeout) args = context = null;
            }
          };
      
          var debounced = restArguments(function(_args) {
            context = this;
            args = _args;
            previous = now();
            if (!timeout) {
              timeout = setTimeout(later, wait);
              if (immediate) result = func.apply(context, args);
            }
            return result;
          });
      
          debounced.cancel = function() {
            clearTimeout(timeout);
            timeout = args = context = null;
          };
      
          return debounced;
        }
      
        // Returns the first function passed as an argument to the second,
        // allowing you to adjust arguments, run code before and after, and
        // conditionally execute the original function.
        function wrap(func, wrapper) {
          return partial(wrapper, func);
        }
      
        // Returns a negated version of the passed-in predicate.
        function negate(predicate) {
          return function() {
            return !predicate.apply(this, arguments);
          };
        }
      
        // Returns a function that is the composition of a list of functions, each
        // consuming the return value of the function that follows.
        function compose() {
          var args = arguments;
          var start = args.length - 1;
          return function() {
            var i = start;
            var result = args[start].apply(this, arguments);
            while (i--) result = args[i].call(this, result);
            return result;
          };
        }
      
        // Returns a function that will only be executed on and after the Nth call.
        function after(times, func) {
          return function() {
            if (--times < 1) {
              return func.apply(this, arguments);
            }
          };
        }
      
        // Returns a function that will only be executed up to (but not including) the
        // Nth call.
        function before(times, func) {
          var memo;
          return function() {
            if (--times > 0) {
              memo = func.apply(this, arguments);
            }
            if (times <= 1) func = null;
            return memo;
          };
        }
      
        // Returns a function that will be executed at most one time, no matter how
        // often you call it. Useful for lazy initialization.
        var once = partial(before, 2);
      
        // Returns the first key on an object that passes a truth test.
        function findKey(obj, predicate, context) {
          predicate = cb(predicate, context);
          var _keys = keys(obj), key;
          for (var i = 0, length = _keys.length; i < length; i++) {
            key = _keys[i];
            if (predicate(obj[key], key, obj)) return key;
          }
        }
      
        // Internal function to generate `_.findIndex` and `_.findLastIndex`.
        function createPredicateIndexFinder(dir) {
          return function(array, predicate, context) {
            predicate = cb(predicate, context);
            var length = getLength(array);
            var index = dir > 0 ? 0 : length - 1;
            for (; index >= 0 && index < length; index += dir) {
              if (predicate(array[index], index, array)) return index;
            }
            return -1;
          };
        }
      
        // Returns the first index on an array-like that passes a truth test.
        var findIndex = createPredicateIndexFinder(1);
      
        // Returns the last index on an array-like that passes a truth test.
        var findLastIndex = createPredicateIndexFinder(-1);
      
        // Use a comparator function to figure out the smallest index at which
        // an object should be inserted so as to maintain order. Uses binary search.
        function sortedIndex(array, obj, iteratee, context) {
          iteratee = cb(iteratee, context, 1);
          var value = iteratee(obj);
          var low = 0, high = getLength(array);
          while (low < high) {
            var mid = Math.floor((low + high) / 2);
            if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
          }
          return low;
        }
      
        // Internal function to generate the `_.indexOf` and `_.lastIndexOf` functions.
        function createIndexFinder(dir, predicateFind, sortedIndex) {
          return function(array, item, idx) {
            var i = 0, length = getLength(array);
            if (typeof idx == 'number') {
              if (dir > 0) {
                i = idx >= 0 ? idx : Math.max(idx + length, i);
              } else {
                length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
              }
            } else if (sortedIndex && idx && length) {
              idx = sortedIndex(array, item);
              return array[idx] === item ? idx : -1;
            }
            if (item !== item) {
              idx = predicateFind(slice.call(array, i, length), isNaN$1);
              return idx >= 0 ? idx + i : -1;
            }
            for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
              if (array[idx] === item) return idx;
            }
            return -1;
          };
        }
      
        // Return the position of the first occurrence of an item in an array,
        // or -1 if the item is not included in the array.
        // If the array is large and already in sort order, pass `true`
        // for **isSorted** to use binary search.
        var indexOf = createIndexFinder(1, findIndex, sortedIndex);
      
        // Return the position of the last occurrence of an item in an array,
        // or -1 if the item is not included in the array.
        var lastIndexOf = createIndexFinder(-1, findLastIndex);
      
        // Return the first value which passes a truth test.
        function find(obj, predicate, context) {
          var keyFinder = isArrayLike(obj) ? findIndex : findKey;
          var key = keyFinder(obj, predicate, context);
          if (key !== void 0 && key !== -1) return obj[key];
        }
      
        // Convenience version of a common use case of `_.find`: getting the first
        // object containing specific `key:value` pairs.
        function findWhere(obj, attrs) {
          return find(obj, matcher(attrs));
        }
      
        // The cornerstone for collection functions, an `each`
        // implementation, aka `forEach`.
        // Handles raw objects in addition to array-likes. Treats all
        // sparse array-likes as if they were dense.
        function each(obj, iteratee, context) {
          iteratee = optimizeCb(iteratee, context);
          var i, length;
          if (isArrayLike(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
              iteratee(obj[i], i, obj);
            }
          } else {
            var _keys = keys(obj);
            for (i = 0, length = _keys.length; i < length; i++) {
              iteratee(obj[_keys[i]], _keys[i], obj);
            }
          }
          return obj;
        }
      
        // Return the results of applying the iteratee to each element.
        function map(obj, iteratee, context) {
          iteratee = cb(iteratee, context);
          var _keys = !isArrayLike(obj) && keys(obj),
              length = (_keys || obj).length,
              results = Array(length);
          for (var index = 0; index < length; index++) {
            var currentKey = _keys ? _keys[index] : index;
            results[index] = iteratee(obj[currentKey], currentKey, obj);
          }
          return results;
        }
      
        // Internal helper to create a reducing function, iterating left or right.
        function createReduce(dir) {
          // Wrap code that reassigns argument variables in a separate function than
          // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
          var reducer = function(obj, iteratee, memo, initial) {
            var _keys = !isArrayLike(obj) && keys(obj),
                length = (_keys || obj).length,
                index = dir > 0 ? 0 : length - 1;
            if (!initial) {
              memo = obj[_keys ? _keys[index] : index];
              index += dir;
            }
            for (; index >= 0 && index < length; index += dir) {
              var currentKey = _keys ? _keys[index] : index;
              memo = iteratee(memo, obj[currentKey], currentKey, obj);
            }
            return memo;
          };
      
          return function(obj, iteratee, memo, context) {
            var initial = arguments.length >= 3;
            return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
          };
        }
      
        // **Reduce** builds up a single result from a list of values, aka `inject`,
        // or `foldl`.
        var reduce = createReduce(1);
      
        // The right-associative version of reduce, also known as `foldr`.
        var reduceRight = createReduce(-1);
      
        // Return all the elements that pass a truth test.
        function filter(obj, predicate, context) {
          var results = [];
          predicate = cb(predicate, context);
          each(obj, function(value, index, list) {
            if (predicate(value, index, list)) results.push(value);
          });
          return results;
        }
      
        // Return all the elements for which a truth test fails.
        function reject(obj, predicate, context) {
          return filter(obj, negate(cb(predicate)), context);
        }
      
        // Determine whether all of the elements pass a truth test.
        function every(obj, predicate, context) {
          predicate = cb(predicate, context);
          var _keys = !isArrayLike(obj) && keys(obj),
              length = (_keys || obj).length;
          for (var index = 0; index < length; index++) {
            var currentKey = _keys ? _keys[index] : index;
            if (!predicate(obj[currentKey], currentKey, obj)) return false;
          }
          return true;
        }
      
        // Determine if at least one element in the object passes a truth test.
        function some(obj, predicate, context) {
          predicate = cb(predicate, context);
          var _keys = !isArrayLike(obj) && keys(obj),
              length = (_keys || obj).length;
          for (var index = 0; index < length; index++) {
            var currentKey = _keys ? _keys[index] : index;
            if (predicate(obj[currentKey], currentKey, obj)) return true;
          }
          return false;
        }
      
        // Determine if the array or object contains a given item (using `===`).
        function contains(obj, item, fromIndex, guard) {
          if (!isArrayLike(obj)) obj = values(obj);
          if (typeof fromIndex != 'number' || guard) fromIndex = 0;
          return indexOf(obj, item, fromIndex) >= 0;
        }
      
        // Invoke a method (with arguments) on every item in a collection.
        var invoke = restArguments(function(obj, path, args) {
          var contextPath, func;
          if (isFunction$1(path)) {
            func = path;
          } else {
            path = toPath(path);
            contextPath = path.slice(0, -1);
            path = path[path.length - 1];
          }
          return map(obj, function(context) {
            var method = func;
            if (!method) {
              if (contextPath && contextPath.length) {
                context = deepGet(context, contextPath);
              }
              if (context == null) return void 0;
              method = context[path];
            }
            return method == null ? method : method.apply(context, args);
          });
        });
      
        // Convenience version of a common use case of `_.map`: fetching a property.
        function pluck(obj, key) {
          return map(obj, property(key));
        }
      
        // Convenience version of a common use case of `_.filter`: selecting only
        // objects containing specific `key:value` pairs.
        function where(obj, attrs) {
          return filter(obj, matcher(attrs));
        }
      
        // Return the maximum element (or element-based computation).
        function max(obj, iteratee, context) {
          var result = -Infinity, lastComputed = -Infinity,
              value, computed;
          if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null)) {
            obj = isArrayLike(obj) ? obj : values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
              value = obj[i];
              if (value != null && value > result) {
                result = value;
              }
            }
          } else {
            iteratee = cb(iteratee, context);
            each(obj, function(v, index, list) {
              computed = iteratee(v, index, list);
              if (computed > lastComputed || (computed === -Infinity && result === -Infinity)) {
                result = v;
                lastComputed = computed;
              }
            });
          }
          return result;
        }
      
        // Return the minimum element (or element-based computation).
        function min(obj, iteratee, context) {
          var result = Infinity, lastComputed = Infinity,
              value, computed;
          if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null)) {
            obj = isArrayLike(obj) ? obj : values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
              value = obj[i];
              if (value != null && value < result) {
                result = value;
              }
            }
          } else {
            iteratee = cb(iteratee, context);
            each(obj, function(v, index, list) {
              computed = iteratee(v, index, list);
              if (computed < lastComputed || (computed === Infinity && result === Infinity)) {
                result = v;
                lastComputed = computed;
              }
            });
          }
          return result;
        }
      
        // Safely create a real, live array from anything iterable.
        var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
        function toArray(obj) {
          if (!obj) return [];
          if (isArray(obj)) return slice.call(obj);
          if (isString(obj)) {
            // Keep surrogate pair characters together.
            return obj.match(reStrSymbol);
          }
          if (isArrayLike(obj)) return map(obj, identity);
          return values(obj);
        }
      
        // Sample **n** random values from a collection using the modern version of the
        // [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
        // If **n** is not specified, returns a single random element.
        // The internal `guard` argument allows it to work with `_.map`.
        function sample(obj, n, guard) {
          if (n == null || guard) {
            if (!isArrayLike(obj)) obj = values(obj);
            return obj[random(obj.length - 1)];
          }
          var sample = toArray(obj);
          var length = getLength(sample);
          n = Math.max(Math.min(n, length), 0);
          var last = length - 1;
          for (var index = 0; index < n; index++) {
            var rand = random(index, last);
            var temp = sample[index];
            sample[index] = sample[rand];
            sample[rand] = temp;
          }
          return sample.slice(0, n);
        }
      
        // Shuffle a collection.
        function shuffle(obj) {
          return sample(obj, Infinity);
        }
      
        // Sort the object's values by a criterion produced by an iteratee.
        function sortBy(obj, iteratee, context) {
          var index = 0;
          iteratee = cb(iteratee, context);
          return pluck(map(obj, function(value, key, list) {
            return {
              value: value,
              index: index++,
              criteria: iteratee(value, key, list)
            };
          }).sort(function(left, right) {
            var a = left.criteria;
            var b = right.criteria;
            if (a !== b) {
              if (a > b || a === void 0) return 1;
              if (a < b || b === void 0) return -1;
            }
            return left.index - right.index;
          }), 'value');
        }
      
        // An internal function used for aggregate "group by" operations.
        function group(behavior, partition) {
          return function(obj, iteratee, context) {
            var result = partition ? [[], []] : {};
            iteratee = cb(iteratee, context);
            each(obj, function(value, index) {
              var key = iteratee(value, index, obj);
              behavior(result, value, key);
            });
            return result;
          };
        }
      
        // Groups the object's values by a criterion. Pass either a string attribute
        // to group by, or a function that returns the criterion.
        var groupBy = group(function(result, value, key) {
          if (has$1(result, key)) result[key].push(value); else result[key] = [value];
        });
      
        // Indexes the object's values by a criterion, similar to `_.groupBy`, but for
        // when you know that your index values will be unique.
        var indexBy = group(function(result, value, key) {
          result[key] = value;
        });
      
        // Counts instances of an object that group by a certain criterion. Pass
        // either a string attribute to count by, or a function that returns the
        // criterion.
        var countBy = group(function(result, value, key) {
          if (has$1(result, key)) result[key]++; else result[key] = 1;
        });
      
        // Split a collection into two arrays: one whose elements all pass the given
        // truth test, and one whose elements all do not pass the truth test.
        var partition = group(function(result, value, pass) {
          result[pass ? 0 : 1].push(value);
        }, true);
      
        // Return the number of elements in a collection.
        function size(obj) {
          if (obj == null) return 0;
          return isArrayLike(obj) ? obj.length : keys(obj).length;
        }
      
        // Internal `_.pick` helper function to determine whether `key` is an enumerable
        // property name of `obj`.
        function keyInObj(value, key, obj) {
          return key in obj;
        }
      
        // Return a copy of the object only containing the allowed properties.
        var pick = restArguments(function(obj, keys) {
          var result = {}, iteratee = keys[0];
          if (obj == null) return result;
          if (isFunction$1(iteratee)) {
            if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
            keys = allKeys(obj);
          } else {
            iteratee = keyInObj;
            keys = flatten$1(keys, false, false);
            obj = Object(obj);
          }
          for (var i = 0, length = keys.length; i < length; i++) {
            var key = keys[i];
            var value = obj[key];
            if (iteratee(value, key, obj)) result[key] = value;
          }
          return result;
        });
      
        // Return a copy of the object without the disallowed properties.
        var omit = restArguments(function(obj, keys) {
          var iteratee = keys[0], context;
          if (isFunction$1(iteratee)) {
            iteratee = negate(iteratee);
            if (keys.length > 1) context = keys[1];
          } else {
            keys = map(flatten$1(keys, false, false), String);
            iteratee = function(value, key) {
              return !contains(keys, key);
            };
          }
          return pick(obj, iteratee, context);
        });
      
        // Returns everything but the last entry of the array. Especially useful on
        // the arguments object. Passing **n** will return all the values in
        // the array, excluding the last N.
        function initial(array, n, guard) {
          return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
        }
      
        // Get the first element of an array. Passing **n** will return the first N
        // values in the array. The **guard** check allows it to work with `_.map`.
        function first(array, n, guard) {
          if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
          if (n == null || guard) return array[0];
          return initial(array, array.length - n);
        }
      
        // Returns everything but the first entry of the `array`. Especially useful on
        // the `arguments` object. Passing an **n** will return the rest N values in the
        // `array`.
        function rest(array, n, guard) {
          return slice.call(array, n == null || guard ? 1 : n);
        }
      
        // Get the last element of an array. Passing **n** will return the last N
        // values in the array.
        function last(array, n, guard) {
          if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
          if (n == null || guard) return array[array.length - 1];
          return rest(array, Math.max(0, array.length - n));
        }
      
        // Trim out all falsy values from an array.
        function compact(array) {
          return filter(array, Boolean);
        }
      
        // Flatten out an array, either recursively (by default), or up to `depth`.
        // Passing `true` or `false` as `depth` means `1` or `Infinity`, respectively.
        function flatten(array, depth) {
          return flatten$1(array, depth, false);
        }
      
        // Take the difference between one array and a number of other arrays.
        // Only the elements present in just the first array will remain.
        var difference = restArguments(function(array, rest) {
          rest = flatten$1(rest, true, true);
          return filter(array, function(value){
            return !contains(rest, value);
          });
        });
      
        // Return a version of the array that does not contain the specified value(s).
        var without = restArguments(function(array, otherArrays) {
          return difference(array, otherArrays);
        });
      
        // Produce a duplicate-free version of the array. If the array has already
        // been sorted, you have the option of using a faster algorithm.
        // The faster algorithm will not work with an iteratee if the iteratee
        // is not a one-to-one function, so providing an iteratee will disable
        // the faster algorithm.
        function uniq(array, isSorted, iteratee, context) {
          if (!isBoolean(isSorted)) {
            context = iteratee;
            iteratee = isSorted;
            isSorted = false;
          }
          if (iteratee != null) iteratee = cb(iteratee, context);
          var result = [];
          var seen = [];
          for (var i = 0, length = getLength(array); i < length; i++) {
            var value = array[i],
                computed = iteratee ? iteratee(value, i, array) : value;
            if (isSorted && !iteratee) {
              if (!i || seen !== computed) result.push(value);
              seen = computed;
            } else if (iteratee) {
              if (!contains(seen, computed)) {
                seen.push(computed);
                result.push(value);
              }
            } else if (!contains(result, value)) {
              result.push(value);
            }
          }
          return result;
        }
      
        // Produce an array that contains the union: each distinct element from all of
        // the passed-in arrays.
        var union = restArguments(function(arrays) {
          return uniq(flatten$1(arrays, true, true));
        });
      
        // Produce an array that contains every item shared between all the
        // passed-in arrays.
        function intersection(array) {
          var result = [];
          var argsLength = arguments.length;
          for (var i = 0, length = getLength(array); i < length; i++) {
            var item = array[i];
            if (contains(result, item)) continue;
            var j;
            for (j = 1; j < argsLength; j++) {
              if (!contains(arguments[j], item)) break;
            }
            if (j === argsLength) result.push(item);
          }
          return result;
        }
      
        // Complement of zip. Unzip accepts an array of arrays and groups
        // each array's elements on shared indices.
        function unzip(array) {
          var length = (array && max(array, getLength).length) || 0;
          var result = Array(length);
      
          for (var index = 0; index < length; index++) {
            result[index] = pluck(array, index);
          }
          return result;
        }
      
        // Zip together multiple lists into a single array -- elements that share
        // an index go together.
        var zip = restArguments(unzip);
      
        // Converts lists into objects. Pass either a single array of `[key, value]`
        // pairs, or two parallel arrays of the same length -- one of keys, and one of
        // the corresponding values. Passing by pairs is the reverse of `_.pairs`.
        function object(list, values) {
          var result = {};
          for (var i = 0, length = getLength(list); i < length; i++) {
            if (values) {
              result[list[i]] = values[i];
            } else {
              result[list[i][0]] = list[i][1];
            }
          }
          return result;
        }
      
        // Generate an integer Array containing an arithmetic progression. A port of
        // the native Python `range()` function. See
        // [the Python documentation](https://docs.python.org/library/functions.html#range).
        function range(start, stop, step) {
          if (stop == null) {
            stop = start || 0;
            start = 0;
          }
          if (!step) {
            step = stop < start ? -1 : 1;
          }
      
          var length = Math.max(Math.ceil((stop - start) / step), 0);
          var range = Array(length);
      
          for (var idx = 0; idx < length; idx++, start += step) {
            range[idx] = start;
          }
      
          return range;
        }
      
        // Chunk a single array into multiple arrays, each containing `count` or fewer
        // items.
        function chunk(array, count) {
          if (count == null || count < 1) return [];
          var result = [];
          var i = 0, length = array.length;
          while (i < length) {
            result.push(slice.call(array, i, i += count));
          }
          return result;
        }
      
        // Helper function to continue chaining intermediate results.
        function chainResult(instance, obj) {
          return instance._chain ? _$1(obj).chain() : obj;
        }
      
        // Add your own custom functions to the Underscore object.
        function mixin(obj) {
          each(functions(obj), function(name) {
            var func = _$1[name] = obj[name];
            _$1.prototype[name] = function() {
              var args = [this._wrapped];
              push.apply(args, arguments);
              return chainResult(this, func.apply(_$1, args));
            };
          });
          return _$1;
        }
      
        // Add all mutator `Array` functions to the wrapper.
        each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
          var method = ArrayProto[name];
          _$1.prototype[name] = function() {
            var obj = this._wrapped;
            if (obj != null) {
              method.apply(obj, arguments);
              if ((name === 'shift' || name === 'splice') && obj.length === 0) {
                delete obj[0];
              }
            }
            return chainResult(this, obj);
          };
        });
      
        // Add all accessor `Array` functions to the wrapper.
        each(['concat', 'join', 'slice'], function(name) {
          var method = ArrayProto[name];
          _$1.prototype[name] = function() {
            var obj = this._wrapped;
            if (obj != null) obj = method.apply(obj, arguments);
            return chainResult(this, obj);
          };
        });
      
        // Named Exports
      
        var allExports = {
          __proto__: null,
          VERSION: VERSION,
          restArguments: restArguments,
          isObject: isObject,
          isNull: isNull,
          isUndefined: isUndefined,
          isBoolean: isBoolean,
          isElement: isElement,
          isString: isString,
          isNumber: isNumber,
          isDate: isDate,
          isRegExp: isRegExp,
          isError: isError,
          isSymbol: isSymbol,
          isArrayBuffer: isArrayBuffer,
          isDataView: isDataView$1,
          isArray: isArray,
          isFunction: isFunction$1,
          isArguments: isArguments$1,
          isFinite: isFinite$1,
          isNaN: isNaN$1,
          isTypedArray: isTypedArray$1,
          isEmpty: isEmpty,
          isMatch: isMatch,
          isEqual: isEqual,
          isMap: isMap,
          isWeakMap: isWeakMap,
          isSet: isSet,
          isWeakSet: isWeakSet,
          keys: keys,
          allKeys: allKeys,
          values: values,
          pairs: pairs,
          invert: invert,
          functions: functions,
          methods: functions,
          extend: extend,
          extendOwn: extendOwn,
          assign: extendOwn,
          defaults: defaults,
          create: create,
          clone: clone,
          tap: tap,
          get: get,
          has: has,
          mapObject: mapObject,
          identity: identity,
          constant: constant,
          noop: noop,
          toPath: toPath$1,
          property: property,
          propertyOf: propertyOf,
          matcher: matcher,
          matches: matcher,
          times: times,
          random: random,
          now: now,
          escape: _escape,
          unescape: _unescape,
          templateSettings: templateSettings,
          template: template,
          result: result,
          uniqueId: uniqueId,
          chain: chain,
          iteratee: iteratee,
          partial: partial,
          bind: bind,
          bindAll: bindAll,
          memoize: memoize,
          delay: delay,
          defer: defer,
          throttle: throttle,
          debounce: debounce,
          wrap: wrap,
          negate: negate,
          compose: compose,
          after: after,
          before: before,
          once: once,
          findKey: findKey,
          findIndex: findIndex,
          findLastIndex: findLastIndex,
          sortedIndex: sortedIndex,
          indexOf: indexOf,
          lastIndexOf: lastIndexOf,
          find: find,
          detect: find,
          findWhere: findWhere,
          each: each,
          forEach: each,
          map: map,
          collect: map,
          reduce: reduce,
          foldl: reduce,
          inject: reduce,
          reduceRight: reduceRight,
          foldr: reduceRight,
          filter: filter,
          select: filter,
          reject: reject,
          every: every,
          all: every,
          some: some,
          any: some,
          contains: contains,
          includes: contains,
          include: contains,
          invoke: invoke,
          pluck: pluck,
          where: where,
          max: max,
          min: min,
          shuffle: shuffle,
          sample: sample,
          sortBy: sortBy,
          groupBy: groupBy,
          indexBy: indexBy,
          countBy: countBy,
          partition: partition,
          toArray: toArray,
          size: size,
          pick: pick,
          omit: omit,
          first: first,
          head: first,
          take: first,
          initial: initial,
          last: last,
          rest: rest,
          tail: rest,
          drop: rest,
          compact: compact,
          flatten: flatten,
          without: without,
          uniq: uniq,
          unique: uniq,
          union: union,
          intersection: intersection,
          difference: difference,
          unzip: unzip,
          transpose: unzip,
          zip: zip,
          object: object,
          range: range,
          chunk: chunk,
          mixin: mixin,
          'default': _$1
        };
      
        // Default Export
      
        // Add all of the Underscore functions to the wrapper object.
        var _ = mixin(allExports);
        // Legacy Node.js API.
        _._ = _;
      
        return _;
      
      })));
      //# sourceMappingURL=underscore-umd.js.map
      
//     Backbone.js 1.4.1

//     (c) 2010-2022 Jeremy Ashkenas and DocumentCloud
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(factory) {

    // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
    // We use `self` instead of `window` for `WebWorker` support.
    var root = typeof self == 'object' && self.self === self && self ||
              typeof global == 'object' && global.global === global && global;
  
    // Set up Backbone appropriately for the environment. Start with AMD.
    if (typeof define === 'function' && define.amd) {
      define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
        // Export global even in AMD case in case this script is loaded with
        // others that may still expect a global Backbone.
        root.Backbone = factory(root, exports, _, $);
      });
  
    // Next for Node.js or CommonJS. jQuery may not be needed as a module.
    } else if (typeof exports !== 'undefined') {
      var _ = require('underscore'), $;
      try { $ = require('jquery'); } catch (e) {}
      factory(root, exports, _, $);
  
    // Finally, as a browser global.
    } else {
      root.Backbone = factory(root, {}, root._, root.jQuery || root.Zepto || root.ender || root.$);
    }
  
  })(function(root, Backbone, _, $) {
  
    // Initial Setup
    // -------------
  
    // Save the previous value of the `Backbone` variable, so that it can be
    // restored later on, if `noConflict` is used.
    var previousBackbone = root.Backbone;
  
    // Create a local reference to a common array method we'll want to use later.
    var slice = Array.prototype.slice;
  
    // Current version of the library. Keep in sync with `package.json`.
    Backbone.VERSION = '1.4.1';
  
    // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
    // the `$` variable.
    Backbone.$ = $;
  
    // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
    // to its previous owner. Returns a reference to this Backbone object.
    Backbone.noConflict = function() {
      root.Backbone = previousBackbone;
      return this;
    };
  
    // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
    // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
    // set a `X-Http-Method-Override` header.
    Backbone.emulateHTTP = false;
  
    // Turn on `emulateJSON` to support legacy servers that can't deal with direct
    // `application/json` requests ... this will encode the body as
    // `application/x-www-form-urlencoded` instead and will send the model in a
    // form param named `model`.
    Backbone.emulateJSON = false;
  
    // Backbone.Events
    // ---------------
  
    // A module that can be mixed in to *any object* in order to provide it with
    // a custom event channel. You may bind a callback to an event with `on` or
    // remove with `off`; `trigger`-ing an event fires all callbacks in
    // succession.
    //
    //     var object = {};
    //     _.extend(object, Backbone.Events);
    //     object.on('expand', function(){ alert('expanded'); });
    //     object.trigger('expand');
    //
    var Events = Backbone.Events = {};
  
    // Regular expression used to split event strings.
    var eventSplitter = /\s+/;
  
    // A private global variable to share between listeners and listenees.
    var _listening;
  
    // Iterates over the standard `event, callback` (as well as the fancy multiple
    // space-separated events `"change blur", callback` and jQuery-style event
    // maps `{event: callback}`).
    var eventsApi = function(iteratee, events, name, callback, opts) {
      var i = 0, names;
      if (name && typeof name === 'object') {
        // Handle event maps.
        if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
        for (names = _.keys(name); i < names.length ; i++) {
          events = eventsApi(iteratee, events, names[i], name[names[i]], opts);
        }
      } else if (name && eventSplitter.test(name)) {
        // Handle space-separated event names by delegating them individually.
        for (names = name.split(eventSplitter); i < names.length; i++) {
          events = iteratee(events, names[i], callback, opts);
        }
      } else {
        // Finally, standard events.
        events = iteratee(events, name, callback, opts);
      }
      return events;
    };
  
    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    Events.on = function(name, callback, context) {
      this._events = eventsApi(onApi, this._events || {}, name, callback, {
        context: context,
        ctx: this,
        listening: _listening
      });
  
      if (_listening) {
        var listeners = this._listeners || (this._listeners = {});
        listeners[_listening.id] = _listening;
        // Allow the listening to use a counter, instead of tracking
        // callbacks for library interop
        _listening.interop = false;
      }
  
      return this;
    };
  
    // Inversion-of-control versions of `on`. Tell *this* object to listen to
    // an event in another object... keeping track of what it's listening to
    // for easier unbinding later.
    Events.listenTo = function(obj, name, callback) {
      if (!obj) return this;
      var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
      var listeningTo = this._listeningTo || (this._listeningTo = {});
      var listening = _listening = listeningTo[id];
  
      // This object is not listening to any other events on `obj` yet.
      // Setup the necessary references to track the listening callbacks.
      if (!listening) {
        this._listenId || (this._listenId = _.uniqueId('l'));
        listening = _listening = listeningTo[id] = new Listening(this, obj);
      }
  
      // Bind callbacks on obj.
      var error = tryCatchOn(obj, name, callback, this);
      _listening = void 0;
  
      if (error) throw error;
      // If the target obj is not Backbone.Events, track events manually.
      if (listening.interop) listening.on(name, callback);
  
      return this;
    };
  
    // The reducing API that adds a callback to the `events` object.
    var onApi = function(events, name, callback, options) {
      if (callback) {
        var handlers = events[name] || (events[name] = []);
        var context = options.context, ctx = options.ctx, listening = options.listening;
        if (listening) listening.count++;
  
        handlers.push({callback: callback, context: context, ctx: context || ctx, listening: listening});
      }
      return events;
    };
  
    // An try-catch guarded #on function, to prevent poisoning the global
    // `_listening` variable.
    var tryCatchOn = function(obj, name, callback, context) {
      try {
        obj.on(name, callback, context);
      } catch (e) {
        return e;
      }
    };
  
    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    Events.off = function(name, callback, context) {
      if (!this._events) return this;
      this._events = eventsApi(offApi, this._events, name, callback, {
        context: context,
        listeners: this._listeners
      });
  
      return this;
    };
  
    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    Events.stopListening = function(obj, name, callback) {
      var listeningTo = this._listeningTo;
      if (!listeningTo) return this;
  
      var ids = obj ? [obj._listenId] : _.keys(listeningTo);
      for (var i = 0; i < ids.length; i++) {
        var listening = listeningTo[ids[i]];
  
        // If listening doesn't exist, this object is not currently
        // listening to obj. Break out early.
        if (!listening) break;
  
        listening.obj.off(name, callback, this);
        if (listening.interop) listening.off(name, callback);
      }
      if (_.isEmpty(listeningTo)) this._listeningTo = void 0;
  
      return this;
    };
  
    // The reducing API that removes a callback from the `events` object.
    var offApi = function(events, name, callback, options) {
      if (!events) return;
  
      var context = options.context, listeners = options.listeners;
      var i = 0, names;
  
      // Delete all event listeners and "drop" events.
      if (!name && !context && !callback) {
        for (names = _.keys(listeners); i < names.length; i++) {
          listeners[names[i]].cleanup();
        }
        return;
      }
  
      names = name ? [name] : _.keys(events);
      for (; i < names.length; i++) {
        name = names[i];
        var handlers = events[name];
  
        // Bail out if there are no events stored.
        if (!handlers) break;
  
        // Find any remaining events.
        var remaining = [];
        for (var j = 0; j < handlers.length; j++) {
          var handler = handlers[j];
          if (
            callback && callback !== handler.callback &&
              callback !== handler.callback._callback ||
                context && context !== handler.context
          ) {
            remaining.push(handler);
          } else {
            var listening = handler.listening;
            if (listening) listening.off(name, callback);
          }
        }
  
        // Replace events if there are any remaining.  Otherwise, clean up.
        if (remaining.length) {
          events[name] = remaining;
        } else {
          delete events[name];
        }
      }
  
      return events;
    };
  
    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, its listener will be removed. If multiple events
    // are passed in using the space-separated syntax, the handler will fire
    // once for each event, not once for a combination of all events.
    Events.once = function(name, callback, context) {
      // Map the event into a `{event: once}` object.
      var events = eventsApi(onceMap, {}, name, callback, this.off.bind(this));
      if (typeof name === 'string' && context == null) callback = void 0;
      return this.on(events, callback, context);
    };
  
    // Inversion-of-control versions of `once`.
    Events.listenToOnce = function(obj, name, callback) {
      // Map the event into a `{event: once}` object.
      var events = eventsApi(onceMap, {}, name, callback, this.stopListening.bind(this, obj));
      return this.listenTo(obj, events);
    };
  
    // Reduces the event callbacks into a map of `{event: onceWrapper}`.
    // `offer` unbinds the `onceWrapper` after it has been called.
    var onceMap = function(map, name, callback, offer) {
      if (callback) {
        var once = map[name] = _.once(function() {
          offer(name, once);
          callback.apply(this, arguments);
        });
        once._callback = callback;
      }
      return map;
    };
  
    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    Events.trigger = function(name) {
      if (!this._events) return this;
  
      var length = Math.max(0, arguments.length - 1);
      var args = Array(length);
      for (var i = 0; i < length; i++) args[i] = arguments[i + 1];
  
      eventsApi(triggerApi, this._events, name, void 0, args);
      return this;
    };
  
    // Handles triggering the appropriate event callbacks.
    var triggerApi = function(objEvents, name, callback, args) {
      if (objEvents) {
        var events = objEvents[name];
        var allEvents = objEvents.all;
        if (events && allEvents) allEvents = allEvents.slice();
        if (events) triggerEvents(events, args);
        if (allEvents) triggerEvents(allEvents, [name].concat(args));
      }
      return objEvents;
    };
  
    // A difficult-to-believe, but optimized internal dispatch function for
    // triggering events. Tries to keep the usual cases speedy (most internal
    // Backbone events have 3 arguments).
    var triggerEvents = function(events, args) {
      var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
      switch (args.length) {
        case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
        case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
        case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
        case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
        default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
      }
    };
  
    // A listening class that tracks and cleans up memory bindings
    // when all callbacks have been offed.
    var Listening = function(listener, obj) {
      this.id = listener._listenId;
      this.listener = listener;
      this.obj = obj;
      this.interop = true;
      this.count = 0;
      this._events = void 0;
    };
  
    Listening.prototype.on = Events.on;
  
    // Offs a callback (or several).
    // Uses an optimized counter if the listenee uses Backbone.Events.
    // Otherwise, falls back to manual tracking to support events
    // library interop.
    Listening.prototype.off = function(name, callback) {
      var cleanup;
      if (this.interop) {
        this._events = eventsApi(offApi, this._events, name, callback, {
          context: void 0,
          listeners: void 0
        });
        cleanup = !this._events;
      } else {
        this.count--;
        cleanup = this.count === 0;
      }
      if (cleanup) this.cleanup();
    };
  
    // Cleans up memory bindings between the listener and the listenee.
    Listening.prototype.cleanup = function() {
      delete this.listener._listeningTo[this.obj._listenId];
      if (!this.interop) delete this.obj._listeners[this.id];
    };
  
    // Aliases for backwards compatibility.
    Events.bind   = Events.on;
    Events.unbind = Events.off;
  
    // Allow the `Backbone` object to serve as a global event bus, for folks who
    // want global "pubsub" in a convenient place.
    _.extend(Backbone, Events);
  
    // Backbone.Model
    // --------------
  
    // Backbone **Models** are the basic data object in the framework --
    // frequently representing a row in a table in a database on your server.
    // A discrete chunk of data and a bunch of useful, related methods for
    // performing computations and transformations on that data.
  
    // Create a new model with the specified attributes. A client id (`cid`)
    // is automatically generated and assigned for you.
    var Model = Backbone.Model = function(attributes, options) {
      var attrs = attributes || {};
      options || (options = {});
      this.preinitialize.apply(this, arguments);
      this.cid = _.uniqueId(this.cidPrefix);
      this.attributes = {};
      if (options.collection) this.collection = options.collection;
      if (options.parse) attrs = this.parse(attrs, options) || {};
      var defaults = _.result(this, 'defaults');
      attrs = _.defaults(_.extend({}, defaults, attrs), defaults);
      this.set(attrs, options);
      this.changed = {};
      this.initialize.apply(this, arguments);
    };
  
    // Attach all inheritable methods to the Model prototype.
    _.extend(Model.prototype, Events, {
  
      // A hash of attributes whose current and previous value differ.
      changed: null,
  
      // The value returned during the last failed validation.
      validationError: null,
  
      // The default name for the JSON `id` attribute is `"id"`. MongoDB and
      // CouchDB users may want to set this to `"_id"`.
      idAttribute: 'id',
  
      // The prefix is used to create the client id which is used to identify models locally.
      // You may want to override this if you're experiencing name clashes with model ids.
      cidPrefix: 'c',
  
      // preinitialize is an empty function by default. You can override it with a function
      // or object.  preinitialize will run before any instantiation logic is run in the Model.
      preinitialize: function(){},
  
      // Initialize is an empty function by default. Override it with your own
      // initialization logic.
      initialize: function(){},
  
      // Return a copy of the model's `attributes` object.
      toJSON: function(options) {
        return _.clone(this.attributes);
      },
  
      // Proxy `Backbone.sync` by default -- but override this if you need
      // custom syncing semantics for *this* particular model.
      sync: function() {
        return Backbone.sync.apply(this, arguments);
      },
  
      // Get the value of an attribute.
      get: function(attr) {
        return this.attributes[attr];
      },
  
      // Get the HTML-escaped value of an attribute.
      escape: function(attr) {
        return _.escape(this.get(attr));
      },
  
      // Returns `true` if the attribute contains a value that is not null
      // or undefined.
      has: function(attr) {
        return this.get(attr) != null;
      },
  
      // Special-cased proxy to underscore's `_.matches` method.
      matches: function(attrs) {
        return !!_.iteratee(attrs, this)(this.attributes);
      },
  
      // Set a hash of model attributes on the object, firing `"change"`. This is
      // the core primitive operation of a model, updating the data and notifying
      // anyone who needs to know about the change in state. The heart of the beast.
      set: function(key, val, options) {
        if (key == null) return this;
  
        // Handle both `"key", value` and `{key: value}` -style arguments.
        var attrs;
        if (typeof key === 'object') {
          attrs = key;
          options = val;
        } else {
          (attrs = {})[key] = val;
        }
  
        options || (options = {});
  
        // Run validation.
        if (!this._validate(attrs, options)) return false;
  
        // Extract attributes and options.
        var unset      = options.unset;
        var silent     = options.silent;
        var changes    = [];
        var changing   = this._changing;
        this._changing = true;
  
        if (!changing) {
          this._previousAttributes = _.clone(this.attributes);
          this.changed = {};
        }
  
        var current = this.attributes;
        var changed = this.changed;
        var prev    = this._previousAttributes;
  
        // For each `set` attribute, update or delete the current value.
        for (var attr in attrs) {
          val = attrs[attr];
          if (!_.isEqual(current[attr], val)) changes.push(attr);
          if (!_.isEqual(prev[attr], val)) {
            changed[attr] = val;
          } else {
            delete changed[attr];
          }
          unset ? delete current[attr] : current[attr] = val;
        }
  
        // Update the `id`.
        if (this.idAttribute in attrs) {
          var prevId = this.id;
          this.id = this.get(this.idAttribute);
          this.trigger('changeId', this, prevId, options);
        }
  
        // Trigger all relevant attribute changes.
        if (!silent) {
          if (changes.length) this._pending = options;
          for (var i = 0; i < changes.length; i++) {
            this.trigger('change:' + changes[i], this, current[changes[i]], options);
          }
        }
  
        // You might be wondering why there's a `while` loop here. Changes can
        // be recursively nested within `"change"` events.
        if (changing) return this;
        if (!silent) {
          while (this._pending) {
            options = this._pending;
            this._pending = false;
            this.trigger('change', this, options);
          }
        }
        this._pending = false;
        this._changing = false;
        return this;
      },
  
      // Remove an attribute from the model, firing `"change"`. `unset` is a noop
      // if the attribute doesn't exist.
      unset: function(attr, options) {
        return this.set(attr, void 0, _.extend({}, options, {unset: true}));
      },
  
      // Clear all attributes on the model, firing `"change"`.
      clear: function(options) {
        var attrs = {};
        for (var key in this.attributes) attrs[key] = void 0;
        return this.set(attrs, _.extend({}, options, {unset: true}));
      },
  
      // Determine if the model has changed since the last `"change"` event.
      // If you specify an attribute name, determine if that attribute has changed.
      hasChanged: function(attr) {
        if (attr == null) return !_.isEmpty(this.changed);
        return _.has(this.changed, attr);
      },
  
      // Return an object containing all the attributes that have changed, or
      // false if there are no changed attributes. Useful for determining what
      // parts of a view need to be updated and/or what attributes need to be
      // persisted to the server. Unset attributes will be set to undefined.
      // You can also pass an attributes object to diff against the model,
      // determining if there *would be* a change.
      changedAttributes: function(diff) {
        if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
        var old = this._changing ? this._previousAttributes : this.attributes;
        var changed = {};
        var hasChanged;
        for (var attr in diff) {
          var val = diff[attr];
          if (_.isEqual(old[attr], val)) continue;
          changed[attr] = val;
          hasChanged = true;
        }
        return hasChanged ? changed : false;
      },
  
      // Get the previous value of an attribute, recorded at the time the last
      // `"change"` event was fired.
      previous: function(attr) {
        if (attr == null || !this._previousAttributes) return null;
        return this._previousAttributes[attr];
      },
  
      // Get all of the attributes of the model at the time of the previous
      // `"change"` event.
      previousAttributes: function() {
        return _.clone(this._previousAttributes);
      },
  
      // Fetch the model from the server, merging the response with the model's
      // local attributes. Any changed attributes will trigger a "change" event.
      fetch: function(options) {
        options = _.extend({parse: true}, options);
        var model = this;
        var success = options.success;
        options.success = function(resp) {
          var serverAttrs = options.parse ? model.parse(resp, options) : resp;
          if (!model.set(serverAttrs, options)) return false;
          if (success) success.call(options.context, model, resp, options);
          model.trigger('sync', model, resp, options);
        };
        wrapError(this, options);
        return this.sync('read', this, options);
      },
  
      // Set a hash of model attributes, and sync the model to the server.
      // If the server returns an attributes hash that differs, the model's
      // state will be `set` again.
      save: function(key, val, options) {
        // Handle both `"key", value` and `{key: value}` -style arguments.
        var attrs;
        if (key == null || typeof key === 'object') {
          attrs = key;
          options = val;
        } else {
          (attrs = {})[key] = val;
        }
  
        options = _.extend({validate: true, parse: true}, options);
        var wait = options.wait;
  
        // If we're not waiting and attributes exist, save acts as
        // `set(attr).save(null, opts)` with validation. Otherwise, check if
        // the model will be valid when the attributes, if any, are set.
        if (attrs && !wait) {
          if (!this.set(attrs, options)) return false;
        } else if (!this._validate(attrs, options)) {
          return false;
        }
  
        // After a successful server-side save, the client is (optionally)
        // updated with the server-side state.
        var model = this;
        var success = options.success;
        var attributes = this.attributes;
        options.success = function(resp) {
          // Ensure attributes are restored during synchronous saves.
          model.attributes = attributes;
          var serverAttrs = options.parse ? model.parse(resp, options) : resp;
          if (wait) serverAttrs = _.extend({}, attrs, serverAttrs);
          if (serverAttrs && !model.set(serverAttrs, options)) return false;
          if (success) success.call(options.context, model, resp, options);
          model.trigger('sync', model, resp, options);
        };
        wrapError(this, options);
  
        // Set temporary attributes if `{wait: true}` to properly find new ids.
        if (attrs && wait) this.attributes = _.extend({}, attributes, attrs);
  
        var method = this.isNew() ? 'create' : options.patch ? 'patch' : 'update';
        if (method === 'patch' && !options.attrs) options.attrs = attrs;
        var xhr = this.sync(method, this, options);
  
        // Restore attributes.
        this.attributes = attributes;
  
        return xhr;
      },
  
      // Destroy this model on the server if it was already persisted.
      // Optimistically removes the model from its collection, if it has one.
      // If `wait: true` is passed, waits for the server to respond before removal.
      destroy: function(options) {
        options = options ? _.clone(options) : {};
        var model = this;
        var success = options.success;
        var wait = options.wait;
  
        var destroy = function() {
          model.stopListening();
          model.trigger('destroy', model, model.collection, options);
        };
  
        options.success = function(resp) {
          if (wait) destroy();
          if (success) success.call(options.context, model, resp, options);
          if (!model.isNew()) model.trigger('sync', model, resp, options);
        };
  
        var xhr = false;
        if (this.isNew()) {
          _.defer(options.success);
        } else {
          wrapError(this, options);
          xhr = this.sync('delete', this, options);
        }
        if (!wait) destroy();
        return xhr;
      },
  
      // Default URL for the model's representation on the server -- if you're
      // using Backbone's restful methods, override this to change the endpoint
      // that will be called.
      url: function() {
        var base =
          _.result(this, 'urlRoot') ||
          _.result(this.collection, 'url') ||
          urlError();
        if (this.isNew()) return base;
        var id = this.get(this.idAttribute);
        return base.replace(/[^\/]$/, '$&/') + encodeURIComponent(id);
      },
  
      // **parse** converts a response into the hash of attributes to be `set` on
      // the model. The default implementation is just to pass the response along.
      parse: function(resp, options) {
        return resp;
      },
  
      // Create a new model with identical attributes to this one.
      clone: function() {
        return new this.constructor(this.attributes);
      },
  
      // A model is new if it has never been saved to the server, and lacks an id.
      isNew: function() {
        return !this.has(this.idAttribute);
      },
  
      // Check if the model is currently in a valid state.
      isValid: function(options) {
        return this._validate({}, _.extend({}, options, {validate: true}));
      },
  
      // Run validation against the next complete set of model attributes,
      // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
      _validate: function(attrs, options) {
        if (!options.validate || !this.validate) return true;
        attrs = _.extend({}, this.attributes, attrs);
        var error = this.validationError = this.validate(attrs, options) || null;
        if (!error) return true;
        this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
        return false;
      }
  
    });
  
    // Backbone.Collection
    // -------------------
  
    // If models tend to represent a single row of data, a Backbone Collection is
    // more analogous to a table full of data ... or a small slice or page of that
    // table, or a collection of rows that belong together for a particular reason
    // -- all of the messages in this particular folder, all of the documents
    // belonging to this particular author, and so on. Collections maintain
    // indexes of their models, both in order, and for lookup by `id`.
  
    // Create a new **Collection**, perhaps to contain a specific type of `model`.
    // If a `comparator` is specified, the Collection will maintain
    // its models in sort order, as they're added and removed.
    var Collection = Backbone.Collection = function(models, options) {
      options || (options = {});
      this.preinitialize.apply(this, arguments);
      if (options.model) this.model = options.model;
      if (options.comparator !== void 0) this.comparator = options.comparator;
      this._reset();
      this.initialize.apply(this, arguments);
      if (models) this.reset(models, _.extend({silent: true}, options));
    };
  
    // Default options for `Collection#set`.
    var setOptions = {add: true, remove: true, merge: true};
    var addOptions = {add: true, remove: false};
  
    // Splices `insert` into `array` at index `at`.
    var splice = function(array, insert, at) {
      at = Math.min(Math.max(at, 0), array.length);
      var tail = Array(array.length - at);
      var length = insert.length;
      var i;
      for (i = 0; i < tail.length; i++) tail[i] = array[i + at];
      for (i = 0; i < length; i++) array[i + at] = insert[i];
      for (i = 0; i < tail.length; i++) array[i + length + at] = tail[i];
    };
  
    // Define the Collection's inheritable methods.
    _.extend(Collection.prototype, Events, {
  
      // The default model for a collection is just a **Backbone.Model**.
      // This should be overridden in most cases.
      model: Model,
  
  
      // preinitialize is an empty function by default. You can override it with a function
      // or object.  preinitialize will run before any instantiation logic is run in the Collection.
      preinitialize: function(){},
  
      // Initialize is an empty function by default. Override it with your own
      // initialization logic.
      initialize: function(){},
  
      // The JSON representation of a Collection is an array of the
      // models' attributes.
      toJSON: function(options) {
        return this.map(function(model) { return model.toJSON(options); });
      },
  
      // Proxy `Backbone.sync` by default.
      sync: function() {
        return Backbone.sync.apply(this, arguments);
      },
  
      // Add a model, or list of models to the set. `models` may be Backbone
      // Models or raw JavaScript objects to be converted to Models, or any
      // combination of the two.
      add: function(models, options) {
        return this.set(models, _.extend({merge: false}, options, addOptions));
      },
  
      // Remove a model, or a list of models from the set.
      remove: function(models, options) {
        options = _.extend({}, options);
        var singular = !_.isArray(models);
        models = singular ? [models] : models.slice();
        var removed = this._removeModels(models, options);
        if (!options.silent && removed.length) {
          options.changes = {added: [], merged: [], removed: removed};
          this.trigger('update', this, options);
        }
        return singular ? removed[0] : removed;
      },
  
      // Update a collection by `set`-ing a new list of models, adding new ones,
      // removing models that are no longer present, and merging models that
      // already exist in the collection, as necessary. Similar to **Model#set**,
      // the core operation for updating the data contained by the collection.
      set: function(models, options) {
        if (models == null) return;
  
        options = _.extend({}, setOptions, options);
        if (options.parse && !this._isModel(models)) {
          models = this.parse(models, options) || [];
        }
  
        var singular = !_.isArray(models);
        models = singular ? [models] : models.slice();
  
        var at = options.at;
        if (at != null) at = +at;
        if (at > this.length) at = this.length;
        if (at < 0) at += this.length + 1;
  
        var set = [];
        var toAdd = [];
        var toMerge = [];
        var toRemove = [];
        var modelMap = {};
  
        var add = options.add;
        var merge = options.merge;
        var remove = options.remove;
  
        var sort = false;
        var sortable = this.comparator && at == null && options.sort !== false;
        var sortAttr = _.isString(this.comparator) ? this.comparator : null;
  
        // Turn bare objects into model references, and prevent invalid models
        // from being added.
        var model, i;
        for (i = 0; i < models.length; i++) {
          model = models[i];
  
          // If a duplicate is found, prevent it from being added and
          // optionally merge it into the existing model.
          var existing = this.get(model);
          if (existing) {
            if (merge && model !== existing) {
              var attrs = this._isModel(model) ? model.attributes : model;
              if (options.parse) attrs = existing.parse(attrs, options);
              existing.set(attrs, options);
              toMerge.push(existing);
              if (sortable && !sort) sort = existing.hasChanged(sortAttr);
            }
            if (!modelMap[existing.cid]) {
              modelMap[existing.cid] = true;
              set.push(existing);
            }
            models[i] = existing;
  
          // If this is a new, valid model, push it to the `toAdd` list.
          } else if (add) {
            model = models[i] = this._prepareModel(model, options);
            if (model) {
              toAdd.push(model);
              this._addReference(model, options);
              modelMap[model.cid] = true;
              set.push(model);
            }
          }
        }
  
        // Remove stale models.
        if (remove) {
          for (i = 0; i < this.length; i++) {
            model = this.models[i];
            if (!modelMap[model.cid]) toRemove.push(model);
          }
          if (toRemove.length) this._removeModels(toRemove, options);
        }
  
        // See if sorting is needed, update `length` and splice in new models.
        var orderChanged = false;
        var replace = !sortable && add && remove;
        if (set.length && replace) {
          orderChanged = this.length !== set.length || _.some(this.models, function(m, index) {
            return m !== set[index];
          });
          this.models.length = 0;
          splice(this.models, set, 0);
          this.length = this.models.length;
        } else if (toAdd.length) {
          if (sortable) sort = true;
          splice(this.models, toAdd, at == null ? this.length : at);
          this.length = this.models.length;
        }
  
        // Silently sort the collection if appropriate.
        if (sort) this.sort({silent: true});
  
        // Unless silenced, it's time to fire all appropriate add/sort/update events.
        if (!options.silent) {
          for (i = 0; i < toAdd.length; i++) {
            if (at != null) options.index = at + i;
            model = toAdd[i];
            model.trigger('add', model, this, options);
          }
          if (sort || orderChanged) this.trigger('sort', this, options);
          if (toAdd.length || toRemove.length || toMerge.length) {
            options.changes = {
              added: toAdd,
              removed: toRemove,
              merged: toMerge
            };
            this.trigger('update', this, options);
          }
        }
  
        // Return the added (or merged) model (or models).
        return singular ? models[0] : models;
      },
  
      // When you have more items than you want to add or remove individually,
      // you can reset the entire set with a new list of models, without firing
      // any granular `add` or `remove` events. Fires `reset` when finished.
      // Useful for bulk operations and optimizations.
      reset: function(models, options) {
        options = options ? _.clone(options) : {};
        for (var i = 0; i < this.models.length; i++) {
          this._removeReference(this.models[i], options);
        }
        options.previousModels = this.models;
        this._reset();
        models = this.add(models, _.extend({silent: true}, options));
        if (!options.silent) this.trigger('reset', this, options);
        return models;
      },
  
      // Add a model to the end of the collection.
      push: function(model, options) {
        return this.add(model, _.extend({at: this.length}, options));
      },
  
      // Remove a model from the end of the collection.
      pop: function(options) {
        var model = this.at(this.length - 1);
        return this.remove(model, options);
      },
  
      // Add a model to the beginning of the collection.
      unshift: function(model, options) {
        return this.add(model, _.extend({at: 0}, options));
      },
  
      // Remove a model from the beginning of the collection.
      shift: function(options) {
        var model = this.at(0);
        return this.remove(model, options);
      },
  
      // Slice out a sub-array of models from the collection.
      slice: function() {
        return slice.apply(this.models, arguments);
      },
  
      // Get a model from the set by id, cid, model object with id or cid
      // properties, or an attributes object that is transformed through modelId.
      get: function(obj) {
        if (obj == null) return void 0;
        return this._byId[obj] ||
          this._byId[this.modelId(this._isModel(obj) ? obj.attributes : obj, obj.idAttribute)] ||
          obj.cid && this._byId[obj.cid];
      },
  
      // Returns `true` if the model is in the collection.
      has: function(obj) {
        return this.get(obj) != null;
      },
  
      // Get the model at the given index.
      at: function(index) {
        if (index < 0) index += this.length;
        return this.models[index];
      },
  
      // Return models with matching attributes. Useful for simple cases of
      // `filter`.
      where: function(attrs, first) {
        return this[first ? 'find' : 'filter'](attrs);
      },
  
      // Return the first model with matching attributes. Useful for simple cases
      // of `find`.
      findWhere: function(attrs) {
        return this.where(attrs, true);
      },
  
      // Force the collection to re-sort itself. You don't need to call this under
      // normal circumstances, as the set will maintain sort order as each item
      // is added.
      sort: function(options) {
        var comparator = this.comparator;
        if (!comparator) throw new Error('Cannot sort a set without a comparator');
        options || (options = {});
  
        var length = comparator.length;
        if (_.isFunction(comparator)) comparator = comparator.bind(this);
  
        // Run sort based on type of `comparator`.
        if (length === 1 || _.isString(comparator)) {
          this.models = this.sortBy(comparator);
        } else {
          this.models.sort(comparator);
        }
        if (!options.silent) this.trigger('sort', this, options);
        return this;
      },
  
      // Pluck an attribute from each model in the collection.
      pluck: function(attr) {
        return this.map(attr + '');
      },
  
      // Fetch the default set of models for this collection, resetting the
      // collection when they arrive. If `reset: true` is passed, the response
      // data will be passed through the `reset` method instead of `set`.
      fetch: function(options) {
        options = _.extend({parse: true}, options);
        var success = options.success;
        var collection = this;
        options.success = function(resp) {
          var method = options.reset ? 'reset' : 'set';
          collection[method](resp, options);
          if (success) success.call(options.context, collection, resp, options);
          collection.trigger('sync', collection, resp, options);
        };
        wrapError(this, options);
        return this.sync('read', this, options);
      },
  
      // Create a new instance of a model in this collection. Add the model to the
      // collection immediately, unless `wait: true` is passed, in which case we
      // wait for the server to agree.
      create: function(model, options) {
        options = options ? _.clone(options) : {};
        var wait = options.wait;
        model = this._prepareModel(model, options);
        if (!model) return false;
        if (!wait) this.add(model, options);
        var collection = this;
        var success = options.success;
        options.success = function(m, resp, callbackOpts) {
          if (wait) collection.add(m, callbackOpts);
          if (success) success.call(callbackOpts.context, m, resp, callbackOpts);
        };
        model.save(null, options);
        return model;
      },
  
      // **parse** converts a response into a list of models to be added to the
      // collection. The default implementation is just to pass it through.
      parse: function(resp, options) {
        return resp;
      },
  
      // Create a new collection with an identical list of models as this one.
      clone: function() {
        return new this.constructor(this.models, {
          model: this.model,
          comparator: this.comparator
        });
      },
  
      // Define how to uniquely identify models in the collection.
      modelId: function(attrs, idAttribute) {
        return attrs[idAttribute || this.model.prototype.idAttribute || 'id'];
      },
  
      // Get an iterator of all models in this collection.
      values: function() {
        return new CollectionIterator(this, ITERATOR_VALUES);
      },
  
      // Get an iterator of all model IDs in this collection.
      keys: function() {
        return new CollectionIterator(this, ITERATOR_KEYS);
      },
  
      // Get an iterator of all [ID, model] tuples in this collection.
      entries: function() {
        return new CollectionIterator(this, ITERATOR_KEYSVALUES);
      },
  
      // Private method to reset all internal state. Called when the collection
      // is first initialized or reset.
      _reset: function() {
        this.length = 0;
        this.models = [];
        this._byId  = {};
      },
  
      // Prepare a hash of attributes (or other model) to be added to this
      // collection.
      _prepareModel: function(attrs, options) {
        if (this._isModel(attrs)) {
          if (!attrs.collection) attrs.collection = this;
          return attrs;
        }
        options = options ? _.clone(options) : {};
        options.collection = this;
  
        var model;
        if (this.model.prototype) {
          model = new this.model(attrs, options);
        } else {
          // ES class methods didn't have prototype
          model = this.model(attrs, options);
        }
  
        if (!model.validationError) return model;
        this.trigger('invalid', this, model.validationError, options);
        return false;
      },
  
      // Internal method called by both remove and set.
      _removeModels: function(models, options) {
        var removed = [];
        for (var i = 0; i < models.length; i++) {
          var model = this.get(models[i]);
          if (!model) continue;
  
          var index = this.indexOf(model);
          this.models.splice(index, 1);
          this.length--;
  
          // Remove references before triggering 'remove' event to prevent an
          // infinite loop. #3693
          delete this._byId[model.cid];
          var id = this.modelId(model.attributes, model.idAttribute);
          if (id != null) delete this._byId[id];
  
          if (!options.silent) {
            options.index = index;
            model.trigger('remove', model, this, options);
          }
  
          removed.push(model);
          this._removeReference(model, options);
        }
        return removed;
      },
  
      // Method for checking whether an object should be considered a model for
      // the purposes of adding to the collection.
      _isModel: function(model) {
        return model instanceof Model;
      },
  
      // Internal method to create a model's ties to a collection.
      _addReference: function(model, options) {
        this._byId[model.cid] = model;
        var id = this.modelId(model.attributes, model.idAttribute);
        if (id != null) this._byId[id] = model;
        model.on('all', this._onModelEvent, this);
      },
  
      // Internal method to sever a model's ties to a collection.
      _removeReference: function(model, options) {
        delete this._byId[model.cid];
        var id = this.modelId(model.attributes, model.idAttribute);
        if (id != null) delete this._byId[id];
        if (this === model.collection) delete model.collection;
        model.off('all', this._onModelEvent, this);
      },
  
      // Internal method called every time a model in the set fires an event.
      // Sets need to update their indexes when models change ids. All other
      // events simply proxy through. "add" and "remove" events that originate
      // in other collections are ignored.
      _onModelEvent: function(event, model, collection, options) {
        if (model) {
          if ((event === 'add' || event === 'remove') && collection !== this) return;
          if (event === 'destroy') this.remove(model, options);
          if (event === 'changeId') {
            var prevId = this.modelId(model.previousAttributes(), model.idAttribute);
            var id = this.modelId(model.attributes, model.idAttribute);
            if (prevId != null) delete this._byId[prevId];
            if (id != null) this._byId[id] = model;
          }
        }
        this.trigger.apply(this, arguments);
      }
  
    });
  
    // Defining an @@iterator method implements JavaScript's Iterable protocol.
    // In modern ES2015 browsers, this value is found at Symbol.iterator.
    /* global Symbol */
    var $$iterator = typeof Symbol === 'function' && Symbol.iterator;
    if ($$iterator) {
      Collection.prototype[$$iterator] = Collection.prototype.values;
    }
  
    // CollectionIterator
    // ------------------
  
    // A CollectionIterator implements JavaScript's Iterator protocol, allowing the
    // use of `for of` loops in modern browsers and interoperation between
    // Backbone.Collection and other JavaScript functions and third-party libraries
    // which can operate on Iterables.
    var CollectionIterator = function(collection, kind) {
      this._collection = collection;
      this._kind = kind;
      this._index = 0;
    };
  
    // This "enum" defines the three possible kinds of values which can be emitted
    // by a CollectionIterator that correspond to the values(), keys() and entries()
    // methods on Collection, respectively.
    var ITERATOR_VALUES = 1;
    var ITERATOR_KEYS = 2;
    var ITERATOR_KEYSVALUES = 3;
  
    // All Iterators should themselves be Iterable.
    if ($$iterator) {
      CollectionIterator.prototype[$$iterator] = function() {
        return this;
      };
    }
  
    CollectionIterator.prototype.next = function() {
      if (this._collection) {
  
        // Only continue iterating if the iterated collection is long enough.
        if (this._index < this._collection.length) {
          var model = this._collection.at(this._index);
          this._index++;
  
          // Construct a value depending on what kind of values should be iterated.
          var value;
          if (this._kind === ITERATOR_VALUES) {
            value = model;
          } else {
            var id = this._collection.modelId(model.attributes, model.idAttribute);
            if (this._kind === ITERATOR_KEYS) {
              value = id;
            } else { // ITERATOR_KEYSVALUES
              value = [id, model];
            }
          }
          return {value: value, done: false};
        }
  
        // Once exhausted, remove the reference to the collection so future
        // calls to the next method always return done.
        this._collection = void 0;
      }
  
      return {value: void 0, done: true};
    };
  
    // Backbone.View
    // -------------
  
    // Backbone Views are almost more convention than they are actual code. A View
    // is simply a JavaScript object that represents a logical chunk of UI in the
    // DOM. This might be a single item, an entire list, a sidebar or panel, or
    // even the surrounding frame which wraps your whole app. Defining a chunk of
    // UI as a **View** allows you to define your DOM events declaratively, without
    // having to worry about render order ... and makes it easy for the view to
    // react to specific changes in the state of your models.
  
    // Creating a Backbone.View creates its initial element outside of the DOM,
    // if an existing element is not provided...
    var View = Backbone.View = function(options) {
      this.cid = _.uniqueId('view');
      this.preinitialize.apply(this, arguments);
      _.extend(this, _.pick(options, viewOptions));
      this._ensureElement();
      this.initialize.apply(this, arguments);
    };
  
    // Cached regex to split keys for `delegate`.
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;
  
    // List of view options to be set as properties.
    var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];
  
    // Set up all inheritable **Backbone.View** properties and methods.
    _.extend(View.prototype, Events, {
  
      // The default `tagName` of a View's element is `"div"`.
      tagName: 'div',
  
      // jQuery delegate for element lookup, scoped to DOM elements within the
      // current view. This should be preferred to global lookups where possible.
      $: function(selector) {
        return this.$el.find(selector);
      },
  
      // preinitialize is an empty function by default. You can override it with a function
      // or object.  preinitialize will run before any instantiation logic is run in the View
      preinitialize: function(){},
  
      // Initialize is an empty function by default. Override it with your own
      // initialization logic.
      initialize: function(){},
  
      // **render** is the core function that your view should override, in order
      // to populate its element (`this.el`), with the appropriate HTML. The
      // convention is for **render** to always return `this`.
      render: function() {
        return this;
      },
  
      // Remove this view by taking the element out of the DOM, and removing any
      // applicable Backbone.Events listeners.
      remove: function() {
        this._removeElement();
        this.stopListening();
        return this;
      },
  
      // Remove this view's element from the document and all event listeners
      // attached to it. Exposed for subclasses using an alternative DOM
      // manipulation API.
      _removeElement: function() {
        this.$el.remove();
      },
  
      // Change the view's element (`this.el` property) and re-delegate the
      // view's events on the new element.
      setElement: function(element) {
        this.undelegateEvents();
        this._setElement(element);
        this.delegateEvents();
        return this;
      },
  
      // Creates the `this.el` and `this.$el` references for this view using the
      // given `el`. `el` can be a CSS selector or an HTML string, a jQuery
      // context or an element. Subclasses can override this to utilize an
      // alternative DOM manipulation API and are only required to set the
      // `this.el` property.
      _setElement: function(el) {
        this.$el = el instanceof Backbone.$ ? el : Backbone.$(el);
        this.el = this.$el[0];
      },
  
      // Set callbacks, where `this.events` is a hash of
      //
      // *{"event selector": "callback"}*
      //
      //     {
      //       'mousedown .title':  'edit',
      //       'click .button':     'save',
      //       'click .open':       function(e) { ... }
      //     }
      //
      // pairs. Callbacks will be bound to the view, with `this` set properly.
      // Uses event delegation for efficiency.
      // Omitting the selector binds the event to `this.el`.
      delegateEvents: function(events) {
        events || (events = _.result(this, 'events'));
        if (!events) return this;
        this.undelegateEvents();
        for (var key in events) {
          var method = events[key];
          if (!_.isFunction(method)) method = this[method];
          if (!method) continue;
          var match = key.match(delegateEventSplitter);
          this.delegate(match[1], match[2], method.bind(this));
        }
        return this;
      },
  
      // Add a single event listener to the view's element (or a child element
      // using `selector`). This only works for delegate-able events: not `focus`,
      // `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
      delegate: function(eventName, selector, listener) {
        this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
        return this;
      },
  
      // Clears all callbacks previously bound to the view by `delegateEvents`.
      // You usually don't need to use this, but may wish to if you have multiple
      // Backbone views attached to the same DOM element.
      undelegateEvents: function() {
        if (this.$el) this.$el.off('.delegateEvents' + this.cid);
        return this;
      },
  
      // A finer-grained `undelegateEvents` for removing a single delegated event.
      // `selector` and `listener` are both optional.
      undelegate: function(eventName, selector, listener) {
        this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
        return this;
      },
  
      // Produces a DOM element to be assigned to your view. Exposed for
      // subclasses using an alternative DOM manipulation API.
      _createElement: function(tagName) {
        return document.createElement(tagName);
      },
  
      // Ensure that the View has a DOM element to render into.
      // If `this.el` is a string, pass it through `$()`, take the first
      // matching element, and re-assign it to `el`. Otherwise, create
      // an element from the `id`, `className` and `tagName` properties.
      _ensureElement: function() {
        if (!this.el) {
          var attrs = _.extend({}, _.result(this, 'attributes'));
          if (this.id) attrs.id = _.result(this, 'id');
          if (this.className) attrs['class'] = _.result(this, 'className');
          this.setElement(this._createElement(_.result(this, 'tagName')));
          this._setAttributes(attrs);
        } else {
          this.setElement(_.result(this, 'el'));
        }
      },
  
      // Set attributes from a hash on this view's element.  Exposed for
      // subclasses using an alternative DOM manipulation API.
      _setAttributes: function(attributes) {
        this.$el.attr(attributes);
      }
  
    });
  
    // Proxy Backbone class methods to Underscore functions, wrapping the model's
    // `attributes` object or collection's `models` array behind the scenes.
    //
    // collection.filter(function(model) { return model.get('age') > 10 });
    // collection.each(this.addView);
    //
    // `Function#apply` can be slow so we use the method's arg count, if we know it.
    var addMethod = function(base, length, method, attribute) {
      switch (length) {
        case 1: return function() {
          return base[method](this[attribute]);
        };
        case 2: return function(value) {
          return base[method](this[attribute], value);
        };
        case 3: return function(iteratee, context) {
          return base[method](this[attribute], cb(iteratee, this), context);
        };
        case 4: return function(iteratee, defaultVal, context) {
          return base[method](this[attribute], cb(iteratee, this), defaultVal, context);
        };
        default: return function() {
          var args = slice.call(arguments);
          args.unshift(this[attribute]);
          return base[method].apply(base, args);
        };
      }
    };
  
    var addUnderscoreMethods = function(Class, base, methods, attribute) {
      _.each(methods, function(length, method) {
        if (base[method]) Class.prototype[method] = addMethod(base, length, method, attribute);
      });
    };
  
    // Support `collection.sortBy('attr')` and `collection.findWhere({id: 1})`.
    var cb = function(iteratee, instance) {
      if (_.isFunction(iteratee)) return iteratee;
      if (_.isObject(iteratee) && !instance._isModel(iteratee)) return modelMatcher(iteratee);
      if (_.isString(iteratee)) return function(model) { return model.get(iteratee); };
      return iteratee;
    };
    var modelMatcher = function(attrs) {
      var matcher = _.matches(attrs);
      return function(model) {
        return matcher(model.attributes);
      };
    };
  
    // Underscore methods that we want to implement on the Collection.
    // 90% of the core usefulness of Backbone Collections is actually implemented
    // right here:
    var collectionMethods = {forEach: 3, each: 3, map: 3, collect: 3, reduce: 0,
      foldl: 0, inject: 0, reduceRight: 0, foldr: 0, find: 3, detect: 3, filter: 3,
      select: 3, reject: 3, every: 3, all: 3, some: 3, any: 3, include: 3, includes: 3,
      contains: 3, invoke: 0, max: 3, min: 3, toArray: 1, size: 1, first: 3,
      head: 3, take: 3, initial: 3, rest: 3, tail: 3, drop: 3, last: 3,
      without: 0, difference: 0, indexOf: 3, shuffle: 1, lastIndexOf: 3,
      isEmpty: 1, chain: 1, sample: 3, partition: 3, groupBy: 3, countBy: 3,
      sortBy: 3, indexBy: 3, findIndex: 3, findLastIndex: 3};
  
  
    // Underscore methods that we want to implement on the Model, mapped to the
    // number of arguments they take.
    var modelMethods = {keys: 1, values: 1, pairs: 1, invert: 1, pick: 0,
      omit: 0, chain: 1, isEmpty: 1};
  
    // Mix in each Underscore method as a proxy to `Collection#models`.
  
    _.each([
      [Collection, collectionMethods, 'models'],
      [Model, modelMethods, 'attributes']
    ], function(config) {
      var Base = config[0],
          methods = config[1],
          attribute = config[2];
  
      Base.mixin = function(obj) {
        var mappings = _.reduce(_.functions(obj), function(memo, name) {
          memo[name] = 0;
          return memo;
        }, {});
        addUnderscoreMethods(Base, obj, mappings, attribute);
      };
  
      addUnderscoreMethods(Base, _, methods, attribute);
    });
  
    // Backbone.sync
    // -------------
  
    // Override this function to change the manner in which Backbone persists
    // models to the server. You will be passed the type of request, and the
    // model in question. By default, makes a RESTful Ajax request
    // to the model's `url()`. Some possible customizations could be:
    //
    // * Use `setTimeout` to batch rapid-fire updates into a single request.
    // * Send up the models as XML instead of JSON.
    // * Persist models via WebSockets instead of Ajax.
    //
    // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
    // as `POST`, with a `_method` parameter containing the true HTTP method,
    // as well as all requests with the body as `application/x-www-form-urlencoded`
    // instead of `application/json` with the model in a param named `model`.
    // Useful when interfacing with server-side languages like **PHP** that make
    // it difficult to read the body of `PUT` requests.
    Backbone.sync = function(method, model, options) {
      var type = methodMap[method];
  
      // Default options, unless specified.
      _.defaults(options || (options = {}), {
        emulateHTTP: Backbone.emulateHTTP,
        emulateJSON: Backbone.emulateJSON
      });
  
      // Default JSON-request options.
      var params = {type: type, dataType: 'json'};
  
      // Ensure that we have a URL.
      if (!options.url) {
        params.url = _.result(model, 'url') || urlError();
      }
  
      // Ensure that we have the appropriate request data.
      if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
        params.contentType = 'application/json';
        params.data = JSON.stringify(options.attrs || model.toJSON(options));
      }
  
      // For older servers, emulate JSON by encoding the request into an HTML-form.
      if (options.emulateJSON) {
        params.contentType = 'application/x-www-form-urlencoded';
        params.data = params.data ? {model: params.data} : {};
      }
  
      // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
      // And an `X-HTTP-Method-Override` header.
      if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
        params.type = 'POST';
        if (options.emulateJSON) params.data._method = type;
        var beforeSend = options.beforeSend;
        options.beforeSend = function(xhr) {
          xhr.setRequestHeader('X-HTTP-Method-Override', type);
          if (beforeSend) return beforeSend.apply(this, arguments);
        };
      }
  
      // Don't process data on a non-GET request.
      if (params.type !== 'GET' && !options.emulateJSON) {
        params.processData = false;
      }
  
      // Pass along `textStatus` and `errorThrown` from jQuery.
      var error = options.error;
      options.error = function(xhr, textStatus, errorThrown) {
        options.textStatus = textStatus;
        options.errorThrown = errorThrown;
        if (error) error.call(options.context, xhr, textStatus, errorThrown);
      };
  
      // Make the request, allowing the user to override any Ajax options.
      var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
      model.trigger('request', model, xhr, options);
      return xhr;
    };
  
    // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
    var methodMap = {
      'create': 'POST',
      'update': 'PUT',
      'patch': 'PATCH',
      'delete': 'DELETE',
      'read': 'GET'
    };
  
    // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
    // Override this if you'd like to use a different library.
    Backbone.ajax = function() {
      return Backbone.$.ajax.apply(Backbone.$, arguments);
    };
  
    // Backbone.Router
    // ---------------
  
    // Routers map faux-URLs to actions, and fire events when routes are
    // matched. Creating a new one sets its `routes` hash, if not set statically.
    var Router = Backbone.Router = function(options) {
      options || (options = {});
      this.preinitialize.apply(this, arguments);
      if (options.routes) this.routes = options.routes;
      this._bindRoutes();
      this.initialize.apply(this, arguments);
    };
  
    // Cached regular expressions for matching named param parts and splatted
    // parts of route strings.
    var optionalParam = /\((.*?)\)/g;
    var namedParam    = /(\(\?)?:\w+/g;
    var splatParam    = /\*\w+/g;
    var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;
  
    // Set up all inheritable **Backbone.Router** properties and methods.
    _.extend(Router.prototype, Events, {
  
      // preinitialize is an empty function by default. You can override it with a function
      // or object.  preinitialize will run before any instantiation logic is run in the Router.
      preinitialize: function(){},
  
      // Initialize is an empty function by default. Override it with your own
      // initialization logic.
      initialize: function(){},
  
      // Manually bind a single named route to a callback. For example:
      //
      //     this.route('search/:query/p:num', 'search', function(query, num) {
      //       ...
      //     });
      //
      route: function(route, name, callback) {
        if (!_.isRegExp(route)) route = this._routeToRegExp(route);
        if (_.isFunction(name)) {
          callback = name;
          name = '';
        }
        if (!callback) callback = this[name];
        var router = this;
        Backbone.history.route(route, function(fragment) {
          var args = router._extractParameters(route, fragment);
          if (router.execute(callback, args, name) !== false) {
            router.trigger.apply(router, ['route:' + name].concat(args));
            router.trigger('route', name, args);
            Backbone.history.trigger('route', router, name, args);
          }
        });
        return this;
      },
  
      // Execute a route handler with the provided parameters.  This is an
      // excellent place to do pre-route setup or post-route cleanup.
      execute: function(callback, args, name) {
        if (callback) callback.apply(this, args);
      },
  
      // Simple proxy to `Backbone.history` to save a fragment into the history.
      navigate: function(fragment, options) {
        Backbone.history.navigate(fragment, options);
        return this;
      },
  
      // Bind all defined routes to `Backbone.history`. We have to reverse the
      // order of the routes here to support behavior where the most general
      // routes can be defined at the bottom of the route map.
      _bindRoutes: function() {
        if (!this.routes) return;
        this.routes = _.result(this, 'routes');
        var route, routes = _.keys(this.routes);
        while ((route = routes.pop()) != null) {
          this.route(route, this.routes[route]);
        }
      },
  
      // Convert a route string into a regular expression, suitable for matching
      // against the current location hash.
      _routeToRegExp: function(route) {
        route = route.replace(escapeRegExp, '\\$&')
        .replace(optionalParam, '(?:$1)?')
        .replace(namedParam, function(match, optional) {
          return optional ? match : '([^/?]+)';
        })
        .replace(splatParam, '([^?]*?)');
        return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
      },
  
      // Given a route, and a URL fragment that it matches, return the array of
      // extracted decoded parameters. Empty or unmatched parameters will be
      // treated as `null` to normalize cross-browser behavior.
      _extractParameters: function(route, fragment) {
        var params = route.exec(fragment).slice(1);
        return _.map(params, function(param, i) {
          // Don't decode the search params.
          if (i === params.length - 1) return param || null;
          return param ? decodeURIComponent(param) : null;
        });
      }
  
    });
  
    // Backbone.History
    // ----------------
  
    // Handles cross-browser history management, based on either
    // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
    // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
    // and URL fragments. If the browser supports neither (old IE, natch),
    // falls back to polling.
    var History = Backbone.History = function() {
      this.handlers = [];
      this.checkUrl = this.checkUrl.bind(this);
  
      // Ensure that `History` can be used outside of the browser.
      if (typeof window !== 'undefined') {
        this.location = window.location;
        this.history = window.history;
      }
    };
  
    // Cached regex for stripping a leading hash/slash and trailing space.
    var routeStripper = /^[#\/]|\s+$/g;
  
    // Cached regex for stripping leading and trailing slashes.
    var rootStripper = /^\/+|\/+$/g;
  
    // Cached regex for stripping urls of hash.
    var pathStripper = /#.*$/;
  
    // Has the history handling already been started?
    History.started = false;
  
    // Set up all inheritable **Backbone.History** properties and methods.
    _.extend(History.prototype, Events, {
  
      // The default interval to poll for hash changes, if necessary, is
      // twenty times a second.
      interval: 50,
  
      // Are we at the app root?
      atRoot: function() {
        var path = this.location.pathname.replace(/[^\/]$/, '$&/');
        return path === this.root && !this.getSearch();
      },
  
      // Does the pathname match the root?
      matchRoot: function() {
        var path = this.decodeFragment(this.location.pathname);
        var rootPath = path.slice(0, this.root.length - 1) + '/';
        return rootPath === this.root;
      },
  
      // Unicode characters in `location.pathname` are percent encoded so they're
      // decoded for comparison. `%25` should not be decoded since it may be part
      // of an encoded parameter.
      decodeFragment: function(fragment) {
        return decodeURI(fragment.replace(/%25/g, '%2525'));
      },
  
      // In IE6, the hash fragment and search params are incorrect if the
      // fragment contains `?`.
      getSearch: function() {
        var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
        return match ? match[0] : '';
      },
  
      // Gets the true hash value. Cannot use location.hash directly due to bug
      // in Firefox where location.hash will always be decoded.
      getHash: function(window) {
        var match = (window || this).location.href.match(/#(.*)$/);
        return match ? match[1] : '';
      },
  
      // Get the pathname and search params, without the root.
      getPath: function() {
        var path = this.decodeFragment(
          this.location.pathname + this.getSearch()
        ).slice(this.root.length - 1);
        return path.charAt(0) === '/' ? path.slice(1) : path;
      },
  
      // Get the cross-browser normalized URL fragment from the path or hash.
      getFragment: function(fragment) {
        if (fragment == null) {
          if (this._usePushState || !this._wantsHashChange) {
            fragment = this.getPath();
          } else {
            fragment = this.getHash();
          }
        }
        return fragment.replace(routeStripper, '');
      },
  
      // Start the hash change handling, returning `true` if the current URL matches
      // an existing route, and `false` otherwise.
      start: function(options) {
        if (History.started) throw new Error('Backbone.history has already been started');
        History.started = true;
  
        // Figure out the initial configuration. Do we need an iframe?
        // Is pushState desired ... is it available?
        this.options          = _.extend({root: '/'}, this.options, options);
        this.root             = this.options.root;
        this._wantsHashChange = this.options.hashChange !== false;
        this._hasHashChange   = 'onhashchange' in window && (document.documentMode === void 0 || document.documentMode > 7);
        this._useHashChange   = this._wantsHashChange && this._hasHashChange;
        this._wantsPushState  = !!this.options.pushState;
        this._hasPushState    = !!(this.history && this.history.pushState);
        this._usePushState    = this._wantsPushState && this._hasPushState;
        this.fragment         = this.getFragment();
  
        // Normalize root to always include a leading and trailing slash.
        this.root = ('/' + this.root + '/').replace(rootStripper, '/');
  
        // Transition from hashChange to pushState or vice versa if both are
        // requested.
        if (this._wantsHashChange && this._wantsPushState) {
  
          // If we've started off with a route from a `pushState`-enabled
          // browser, but we're currently in a browser that doesn't support it...
          if (!this._hasPushState && !this.atRoot()) {
            var rootPath = this.root.slice(0, -1) || '/';
            this.location.replace(rootPath + '#' + this.getPath());
            // Return immediately as browser will do redirect to new url
            return true;
  
          // Or if we've started out with a hash-based route, but we're currently
          // in a browser where it could be `pushState`-based instead...
          } else if (this._hasPushState && this.atRoot()) {
            this.navigate(this.getHash(), {replace: true});
          }
  
        }
  
        // Proxy an iframe to handle location events if the browser doesn't
        // support the `hashchange` event, HTML5 history, or the user wants
        // `hashChange` but not `pushState`.
        if (!this._hasHashChange && this._wantsHashChange && !this._usePushState) {
          this.iframe = document.createElement('iframe');
          this.iframe.src = 'javascript:0';
          this.iframe.style.display = 'none';
          this.iframe.tabIndex = -1;
          var body = document.body;
          // Using `appendChild` will throw on IE < 9 if the document is not ready.
          var iWindow = body.insertBefore(this.iframe, body.firstChild).contentWindow;
          iWindow.document.open();
          iWindow.document.close();
          iWindow.location.hash = '#' + this.fragment;
        }
  
        // Add a cross-platform `addEventListener` shim for older browsers.
        var addEventListener = window.addEventListener || function(eventName, listener) {
          return attachEvent('on' + eventName, listener);
        };
  
        // Depending on whether we're using pushState or hashes, and whether
        // 'onhashchange' is supported, determine how we check the URL state.
        if (this._usePushState) {
          addEventListener('popstate', this.checkUrl, false);
        } else if (this._useHashChange && !this.iframe) {
          addEventListener('hashchange', this.checkUrl, false);
        } else if (this._wantsHashChange) {
          this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
        }
  
        if (!this.options.silent) return this.loadUrl();
      },
  
      // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
      // but possibly useful for unit testing Routers.
      stop: function() {
        // Add a cross-platform `removeEventListener` shim for older browsers.
        var removeEventListener = window.removeEventListener || function(eventName, listener) {
          return detachEvent('on' + eventName, listener);
        };
  
        // Remove window listeners.
        if (this._usePushState) {
          removeEventListener('popstate', this.checkUrl, false);
        } else if (this._useHashChange && !this.iframe) {
          removeEventListener('hashchange', this.checkUrl, false);
        }
  
        // Clean up the iframe if necessary.
        if (this.iframe) {
          document.body.removeChild(this.iframe);
          this.iframe = null;
        }
  
        // Some environments will throw when clearing an undefined interval.
        if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
        History.started = false;
      },
  
      // Add a route to be tested when the fragment changes. Routes added later
      // may override previous routes.
      route: function(route, callback) {
        this.handlers.unshift({route: route, callback: callback});
      },
  
      // Checks the current URL to see if it has changed, and if it has,
      // calls `loadUrl`, normalizing across the hidden iframe.
      checkUrl: function(e) {
        var current = this.getFragment();
  
        // If the user pressed the back button, the iframe's hash will have
        // changed and we should use that for comparison.
        if (current === this.fragment && this.iframe) {
          current = this.getHash(this.iframe.contentWindow);
        }
  
        if (current === this.fragment) return false;
        if (this.iframe) this.navigate(current);
        this.loadUrl();
      },
  
      // Attempt to load the current URL fragment. If a route succeeds with a
      // match, returns `true`. If no defined routes matches the fragment,
      // returns `false`.
      loadUrl: function(fragment) {
        // If the root doesn't match, no routes can match either.
        if (!this.matchRoot()) return false;
        fragment = this.fragment = this.getFragment(fragment);
        return _.some(this.handlers, function(handler) {
          if (handler.route.test(fragment)) {
            handler.callback(fragment);
            return true;
          }
        });
      },
  
      // Save a fragment into the hash history, or replace the URL state if the
      // 'replace' option is passed. You are responsible for properly URL-encoding
      // the fragment in advance.
      //
      // The options object can contain `trigger: true` if you wish to have the
      // route callback be fired (not usually desirable), or `replace: true`, if
      // you wish to modify the current URL without adding an entry to the history.
      navigate: function(fragment, options) {
        if (!History.started) return false;
        if (!options || options === true) options = {trigger: !!options};
  
        // Normalize the fragment.
        fragment = this.getFragment(fragment || '');
  
        // Don't include a trailing slash on the root.
        var rootPath = this.root;
        if (fragment === '' || fragment.charAt(0) === '?') {
          rootPath = rootPath.slice(0, -1) || '/';
        }
        var url = rootPath + fragment;
  
        // Strip the fragment of the query and hash for matching.
        fragment = fragment.replace(pathStripper, '');
  
        // Decode for matching.
        var decodedFragment = this.decodeFragment(fragment);
  
        if (this.fragment === decodedFragment) return;
        this.fragment = decodedFragment;
  
        // If pushState is available, we use it to set the fragment as a real URL.
        if (this._usePushState) {
          this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);
  
        // If hash changes haven't been explicitly disabled, update the hash
        // fragment to store history.
        } else if (this._wantsHashChange) {
          this._updateHash(this.location, fragment, options.replace);
          if (this.iframe && fragment !== this.getHash(this.iframe.contentWindow)) {
            var iWindow = this.iframe.contentWindow;
  
            // Opening and closing the iframe tricks IE7 and earlier to push a
            // history entry on hash-tag change.  When replace is true, we don't
            // want this.
            if (!options.replace) {
              iWindow.document.open();
              iWindow.document.close();
            }
  
            this._updateHash(iWindow.location, fragment, options.replace);
          }
  
        // If you've told us that you explicitly don't want fallback hashchange-
        // based history, then `navigate` becomes a page refresh.
        } else {
          return this.location.assign(url);
        }
        if (options.trigger) return this.loadUrl(fragment);
      },
  
      // Update the hash location, either replacing the current entry, or adding
      // a new one to the browser history.
      _updateHash: function(location, fragment, replace) {
        if (replace) {
          var href = location.href.replace(/(javascript:|#).*$/, '');
          location.replace(href + '#' + fragment);
        } else {
          // Some browsers require that `hash` contains a leading #.
          location.hash = '#' + fragment;
        }
      }
  
    });
  
    // Create the default Backbone.history.
    Backbone.history = new History;
  
    // Helpers
    // -------
  
    // Helper function to correctly set up the prototype chain for subclasses.
    // Similar to `goog.inherits`, but uses a hash of prototype properties and
    // class properties to be extended.
    var extend = function(protoProps, staticProps) {
      var parent = this;
      var child;
  
      // The constructor function for the new subclass is either defined by you
      // (the "constructor" property in your `extend` definition), or defaulted
      // by us to simply call the parent constructor.
      if (protoProps && _.has(protoProps, 'constructor')) {
        child = protoProps.constructor;
      } else {
        child = function(){ return parent.apply(this, arguments); };
      }
  
      // Add static properties to the constructor function, if supplied.
      _.extend(child, parent, staticProps);
  
      // Set the prototype chain to inherit from `parent`, without calling
      // `parent`'s constructor function and add the prototype properties.
      child.prototype = _.create(parent.prototype, protoProps);
      child.prototype.constructor = child;
  
      // Set a convenience property in case the parent's prototype is needed
      // later.
      child.__super__ = parent.prototype;
  
      return child;
    };
  
    // Set up inheritance for the model, collection, router, view and history.
    Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;
  
    // Throw an error when a URL is needed, and none is supplied.
    var urlError = function() {
      throw new Error('A "url" property or function must be specified');
    };
  
    // Wrap an optional error callback with a fallback error event.
    var wrapError = function(model, options) {
      var error = options.error;
      options.error = function(resp) {
        if (error) error.call(options.context, model, resp, options);
        model.trigger('error', model, resp, options);
      };
    };
  
    return Backbone;
  });
}


;// CONCATENATED MODULE: ./src/js/components/dashboard/_layout.js
function returnTemplate(id){
    return {
        id      : "dashboard" + id,
        css     : "webix_dashTool", 
        minWidth: 200,
        width   : 350,
        hidden  : true,
        rows    : [{}],
        on:{
            onViewShow:function(){
                if (window.innerWidth > 850){
                    this.config.width = 350;
                    this.resize();
                }
            }
        }
    };
}

const dashboardTool    = returnTemplate("Tool");
const dashboardContext = returnTemplate("Context");

function dashboardLayout () {
        return [
            {  // view : "scrollview", 
                //id   : "dashScroll",  
               // body: 
               
                  //  {   
                       // view: "flexlayout",
                        id  : "dashboardContainer",
                
                        rows: [

                            {cols:[
                                {   id      : "dashboardInfoContainer",
                                    minWidth: 250, 
                                    rows    : [] 
                                },
                                {view: "resizer"},
                                dashboardTool,
                                dashboardContext
                            ]},
                        
                          
                        
                        ]
                    //} 
            }
        ];
}


;// CONCATENATED MODULE: ./src/js/components/viewHeadline/title.js


const title_logNameFile = "viewHeadline => title";

function returnHeadline(idTemplate, templateTitle){
    const headline = {   
        view        : "template",
        id          : idTemplate,
        borderless  : true,
        css         : "webix_block-headline",
        height      : 34,
        template    : templateTitle,
        on:{

        }
    };

    return headline;
}
function returnDiv(title = "Имя не указано"){
    return "<div class='no-wrap-headline'>" + title + "</div>";
}

function setHeadlineBlock ( idTemplate, title ){
    let templateTitle;
    try{
        if(title){
            templateTitle = title;
        } else {
            templateTitle = function(){
                const value      = $$(idTemplate).getValues();
                const valLength  = Object.keys(value).length;
                
                //changeTabName(id)
                if (valLength !== 0){
                   // mediator.tabs.changeTabName(null, value);
                    return returnDiv(title = value);
                } else {
                    return returnDiv();
                }
            };
        }
    } catch (err){
        errors_setFunctionError(err, title_logNameFile, "setHeadlineBlock");
    } 

    return returnHeadline(idTemplate, templateTitle);
}


;// CONCATENATED MODULE: ./src/js/components/viewHeadline/historyBtns.js



function prevBtnClick (){
    history.back();
}

function nextBtnClick (){
    history.forward();
}   

function createHistoryBtns(){

    
    const prevBtn = new buttons_Button({
        
        config   : {
            id       : webix.uid(),
            hotkey   : "Ctrl+Shift+P",
            icon     : "icon-arrow-left", 
            click    : function(){
                prevBtnClick();
            },
        },
        titleAttribute : "Вернуться назад"

    
    }).transparentView();

    const nextBtn = new buttons_Button({
        
        config   : {
            id       : webix.uid(),
            hotkey   : "Ctrl+Shift+B",
            icon     : "icon-arrow-right", 
            click    : function(){
                nextBtnClick();
            },
        },
        titleAttribute : "Перейти вперёд "

    
    }).transparentView();
   

    return {
        css  : "btn-history",
        cols : [
            prevBtn,
            nextBtn,
        ]
    };
}

 
 

;// CONCATENATED MODULE: ./src/js/viewTemplates/popup.js
class popup_Popup {

    constructor (options){


        this.elements   = options.elements;

        this.headline  = {
            template    : "<div class='no-wrap-headline'>" + 
                            options.headline + 
                            "</div>", 
            css         : "webix_popup-headline", 
            borderless  : true, 
            height      : 40 
        };

        this.closeBtn  =  {
            view    : "button",
            id      : "buttonClosePopup",
            css     : "popup_close-btn",
            type    : "icon",
            hotkey  : "esc",
            width   : 25,
            icon    : 'wxi-close',
            click   : function(){
 
                if (options.closeClick){
                    const config =  options.closeConfig;
                    const elem = config ? config.currElem : null;
                    options.closeClick(elem);
                } else {
                    const popup = $$(options.config.id);
                    if (popup){
                        popup.destructor();
                    }
                }
         
             
            }
        };
  
        this.popupView  = {
            view    : "popup",
            css     : "webix_popup-config",
            modal   : true,
            escHide : true,
            position: "center",
            body    : {
                scroll : "y",
                rows   : [
                    {   css : "webix_popup-headline-wrapper", 
                        cols: [ 
                            this.headline,
                           // {},
                            this.closeBtn,
                            {width:12},
                        ]
                    },

                    this.elements
        
                ]
            }
        };


        this.options  = options.config;
        this.id       = options.config.id;

        this.values   = Object.values(this.options);
        this.keys     = Object.keys  (this.options);

      
    }


    addConfig(){
        const popup  = this.popupView; 
        const values = this.values;

        this.keys.forEach(function(option,i){
            popup[option] = values[i];

        });
     
        return popup;

    }

    createView(){
        const popup  = this.popupView; 
        const values = this.values;

        this.keys.forEach(function(option,i){
            popup[option] = values[i];

        });

      
        return webix.ui(this.addConfig());
    }

    showPopup(){
        $$(this.id).show();
     
    }


}


;// CONCATENATED MODULE: ./src/js/components/viewHeadline/favoriteBtn.js










const favoriteBtn_logNameFile = "viewHeadline => favoriteBtn";

function findName (id, names){

    try{
        const nameTemplate = $$("favNameLink");
        names.forEach(function(el){
            if (el.id == id){
                if(nameTemplate){
                    nameTemplate.setValues(el.name);
                }
            }
            
        });
    } catch (err){
        errors_setFunctionError(
            err, 
            favoriteBtn_logNameFile, 
            "findName"
        );
    }
}

async function getLinkName(){
        
    await LoadServerData.content("fields");
    const names = GetFields.names;

    if (names){
        const id = getItemId();
        findName (id, names);
    }
  
}

function getLink(){
    try{
        let link    = window.location.href;
        const index = link.lastIndexOf("?");
        link        = link.slice(0, index);

        const favTemplate = $$("favLink");
        if (favTemplate){
            favTemplate.setValues(link);
        }
    } catch (err){
        errors_setFunctionError(
            err, 
            favoriteBtn_logNameFile, 
            "getLink"
        );
    }
}


function createDivTemplate(name, text){
    return "<div style='font-weight:600'>" + 
            name + ": </div>" + text;
}
 
function createTemplate(id, name, nonName){
    return {   
        id          : id,
        css         : "popup_subtitle", 
        borderless  : true, 
        height      : 20 ,
        template    : function(){
            const value = $$(id).getValues();
            const keys  = Object.keys(value);

            if (keys.length !== 0){
                return createDivTemplate(name, value);

            } else {
                return createDivTemplate(name, nonName);

            }
      
        }
    };
}

function getValue(elem){
    return  $$(elem).getValues();   
}



async function postContent(namePref){
    const favNameLinkVal = getValue("favNameLink");
    const favLinkVal     = getValue("favLink");

    let user = getUserDataStorage();

    if (!user){
        await pushUserDataStorage();
        user = getUserDataStorage();
    }


    if (user){

        const postObj = {
            name : "fav-link_" + namePref,
            owner: user.id,
            prefs:{
                name: favNameLinkVal,
                link: favLinkVal,
                id  : namePref,
            }
        };

        const path     = "/init/default/api/userprefs/";
        const postData = webix.ajax().post(path, postObj);

        postData.then(function(data){
            data = data.json();
    
            if (data.err_type == "i"){
                setLogValue(
                    "success", 
                    "Ссылка" + " «" + favNameLinkVal + "» " + 
                    " сохранёна в избранное");
            } else {
                errors_setFunctionError(
                    data.err, 
                    favoriteBtn_logNameFile, 
                    "postContent msg" 
                );
            }

            Action.destructItem($$("popupFavsLinkSave"));
        });

        postData.fail(function(err){
            setAjaxError(
                err, 
                favoriteBtn_logNameFile, 
                "postContent"
            );
        });
    }
}

function getFavPrefs(data){
    const prefs = [];
    try{
        data.forEach(function(pref){

            if (pref.name.includes("fav-link")){
                prefs.push(pref.name);
            }
    
        });
    } catch (err){
        errors_setFunctionError(
            err,
            favoriteBtn_logNameFile,
            "getFavPrefs"
        );
    }
    return prefs;
}

function returnId(el){
    const index = el.indexOf("_") + 1;
    return el.slice(index);
}

function getNotUniquePref(favPrefs, namePref){
    let unique = true;
    favPrefs.forEach(function(el){
                
        if (el.includes(namePref)){
            const id = returnId(el);

            if (id == namePref && unique){
                unique = false;
                setLogValue(
                    "success", 
                    "Такая ссылка уже есть в избранном"
                );
            } 
        } 
    });

    return unique;
}


function getNotUniquePrefs (data, namePref){
    const favPrefs = getFavPrefs(data);
    let unique = true;
    try{
        if (favPrefs.length){
            unique = 
            getNotUniquePref(favPrefs, namePref);
        } 
        
        
        if (!(favPrefs.length) || unique) {
            postContent(namePref);
        } else if (!unique){
            Action.destructItem($$("popupFavsLinkSave"));
        }
    } catch (err){
        errors_setFunctionError(
            err,
            favoriteBtn_logNameFile,
            "getNotUniquePrefs"
        );
    }
}

function btnSaveLinkClick(){
  
    const namePref = getItemId();
    const path     = "/init/default/api/userprefs/";
    const getData  = webix.ajax().get(path);
    getData.then(function(data){
        data = data.json().content;
        getNotUniquePrefs (data, namePref);
    
    });
    getData.fail(function(err){
        setAjaxError(
            err, 
            favoriteBtn_logNameFile,
            "btnSaveLinkClick"
        );
    });

}

const btnSaveLink = new buttons_Button({

    config   : {
        value    : "Сохранить ссылку", 
        click    : function(){
            btnSaveLinkClick();
        },
    },
    titleAttribute : "Сохранить ссылку в избранное"

   
}).maxView("primary");


function saveFavsClick(){

    const popup = new popup_Popup({
        headline : "Сохранить ссылку",
        config   : {
            id    : "popupFavsLinkSave",
            width : 500,
    
        },

        elements : {
            rows : [
                createTemplate("favNameLink", "Имя",    "не указано"),
                {height : 5},
                createTemplate("favLink",     "Ссылка", "не указана"),
                {height : 10},
                {   padding:{
                        left  : 8,
                        right : 8
                    },
                    rows:[
                        btnSaveLink,
                    ]
                },
                
                {}
            ]
          
        }
    });

    popup.createView ();
    popup.showPopup  ();


    getLinkName();
    getLink();
}


function createFavoriteBtn(){

       
    const favsBtn = new buttons_Button({
    
        config   : {
            id       : webix.uid(),
            hotkey   : "Ctrl+Shift+L",
            icon     : "icon-star",
            click    : function(){
                saveFavsClick();
            },
        },
        titleAttribute : "Добавить ссылку в избранное"
    
       
    }).transparentView();

    return favsBtn;
}




;// CONCATENATED MODULE: ./src/js/components/viewHeadline/_layout.js




function createHeadline(idTemplate, title = null){
    const headlineLayout = {
        css : "webix_block-headline",
        cols: [
            setHeadlineBlock(idTemplate, title),
            {},
            createHistoryBtns(),
            createFavoriteBtn()
        ]
    };

    return headlineLayout;
}




;// CONCATENATED MODULE: ./src/js/components/dashboard/createSpace/filter/filterLayout.js



const filterLayout_logNameFile = "dashboard => createSpace => dynamicElements => filterLayout";



function backBtnClick (){
    Action.hideItem ($$( "dashboardTool"));
    Action.showItem ($$( "dashboardInfoContainer"));
}


function createMainView(inputsArray){

    const headline = {  
        template    : "Фильтр",
        height      : 30, 
        css         : "webix_dash-filter-headline",
        borderless  : true
    };

    const filterBackBtn = new buttons_Button({
    
        config   : {
            id       : "dash-backDashBtn",
            hotkey   : "Esc",
            hidden   : true,  
            icon     : "icon-arrow-right", 
            click   : function(){
                backBtnClick();
            },
        },
        titleAttribute : "Вернуться к дашбордам"
    
       
    }).minView();
    
 
    const mainView = {
        id      : "dashboard-tool-main",
        padding : 20,
        hidden  : true,
        minWidth: 250,
        rows    : [
            {   id  : "dashboardToolHeadContainer",
                cols: [
                    headline,
                    filterBackBtn,
                ]
            },
            
            { rows : inputsArray }
        ], 
    };

    try{
      
        $$("dashboardTool").addView( mainView, 0);
    } catch (err){  
        errors_setFunctionError(
            err, 
            filterLayout_logNameFile, 
            "createMainView"
        );
    }
}


function filterBtnClick (){
    const dashTool      = $$("dashboard-tool-main");
    const container     = $$("dashboardContainer" );
    const tree          = $$("tree");
    const backBtn       = $$("dash-backDashBtn");
    const tools         = $$("dashboardTool");
    const infoContainer = $$("dashboardInfoContainer");

    function filterMinAdaptive(){

        Action.hideItem (tree);
        Action.hideItem (infoContainer);
        Action.showItem (tools);
        Action.showItem (backBtn);

        tools.config.width = window.innerWidth - 45;
        tools.resize();
    }

    function filterMaxAdaptive(){
        Action.removeItem($$("dashContextLayout"));
        Action.hideItem  ($$("dashboardContext" ));
        if (dashTool.isVisible()){
            Action.hideItem (tools);

        } else {
            Action.showItem (tools);
            Action.showItem (dashTool);
        }
    }

    filterMaxAdaptive();


    if (container.$width < 850){
        Action.hideItem(tree);

        if (container.$width  < 850 ){
            filterMinAdaptive();
        }

    } else {
        Action.hideItem(backBtn);      
    }


}


function addViewToContainer(filterBtn){
 
    const container     = $$("dash-template").getParentView();
    const containerView = $$(container.config.id);
  
    if (!$$("dashFilterBtn")){
      
        containerView.addView(
            {   id  : "dashboard-tool-btn",
                cols: [
                    filterBtn
                ]
            }
        ,2);
    }
}


function createFilterBtn(){

    const filterBtn = new buttons_Button({
        config   : {
            id       : "dashFilterBtn",
            hotkey   : "Ctrl+Shift+F",
            icon     : "icon-filter", 
            click   : function(){
                filterBtnClick();
            },
        },
        titleAttribute : "Показать/скрыть фильтры"
    
       
    }).transparentView();
  
  
    addViewToContainer(filterBtn);
  
}



function createFilterLayout(inputsArray){

    createMainView (inputsArray);
    createFilterBtn();
}


;// CONCATENATED MODULE: ./src/js/components/dashboard/createSpace/contextWindow.js






let container;
let item;
let field;

const contextWindow_headline  = {
    template    : "<div class='no-wrap-headline'>Подробности</div>", 
    css         : "webix_popup-headline", 
    borderless  : true, 
    height      : 40 
};

function closeBtnClick(){
    Action.removeItem($$("dashContextLayout"));
    Action.hideItem  (container);
    Action.showItem  ($$("dashboardInfoContainer"));

    mediator.linkParam(false, "id");
    mediator.linkParam(false, "src");
}

const closeBtn  = new buttons_Button({
    config   : {
        id     : "dashContexCloseBtn",
        hotkey : "Esc",
        icon   : "icon-arrow-right", 
        click  : function (){
            closeBtnClick();
        }
    },
    css            : "webix-transparent-btn",
    titleAttribute : "Скрыть конекстное окно"

   
}).minView();

async function findLabels(){
    await LoadServerData.content("fields");

    const tableData = GetFields.item(field);
    const fields    = Object.values (tableData.fields);
    const labels    = [];
    fields.forEach(function(el){
        labels.push(el.label);
    });

    return labels;
}

async function createPropElements(){

    const data = [];
        if (item){
        const values = Object.values(item);
        const labels = await findLabels();

        values.forEach(function(val, i){
            data.push({
                label : labels[i], 
                value :  val
            });
        });
    }


    return data;
}

async function returnProperty(){
    const property  = {
        view    : "property",  
        id      : "dashContextProperty", 
        minHeight:100,
        elements: await createPropElements(),
    };

    const propertyLayout = {   
        scroll     : "y", 
        rows       : [
            property,
            {height : 20}
        ]
    };

    return propertyLayout;
}


function goToTableBtnClick(){
    const id = item.id;

    if (item && item.id){
        const path   = "tree/" + field;
        const params = "?id=" + id;
        Backbone.history.navigate(path + params, { trigger:true });
        window.location.reload();
    }
 
}

const goToTableBtn = new buttons_Button({
    
    config   : {
        id       : "goToTableBtn",
        hotkey   : "Ctrl+Shift+Space",
        value    : "Редактировать", 
        click    : function (){
            goToTableBtnClick();
        }
    },
    titleAttribute : "Перейти в таблицу для редактирования записи"

   
}).maxView("primary");



async function createLayout(){
 
    const layout = {
        id      : "dashContextLayout",
        padding : 15,
        rows    : [
            {cols: [
                contextWindow_headline,
                {},
                closeBtn 
            ]},
            await returnProperty(),
           // {height : 20},
            goToTableBtn,
            {}
        ]
      
    };

    return layout;
}

async function createSpace(){
    const content = $$("dashContextLayout");
    if (content){
        Action.removeItem(content);
    }

    if (container){
        container.addView(await createLayout(), 0);
    }
   
}


function setLinkParams(){
    const params = {
        src : field, 
        id  : item.id
    };
    
    mediator.linkParam(true, params);
}

function createContextProperty(data, idTable){
    item  = data;
    field = idTable;

    const filters = $$("dashboardTool");
    Action.hideItem(filters);
    
    container = $$("dashboardContext");
    Action.showItem(container);
    if (window.innerWidth < 850){

        container.config.width = window.innerWidth - 45;
        console.log(container.config.width)
        container.resize();
        Action.hideItem($$("dashboardInfoContainer"));
    }

    setLinkParams();
    createSpace();
}


;// CONCATENATED MODULE: ./src/js/components/dashboard/createSpace/click/updateSpace.js




const updateSpace_logNameFile = "table => createSpace => click => updateSpace";

function createQuery(filter, sorts){
 
    const query = [ 
        "query=" + filter , 
        "sorts=" + sorts  , 
        "limit=" + 80, 
        "offset="+ 0
    ];

    return query;
}


function scrollToTable(tableElem){
    const node = tableElem.getNode();
    node.scrollIntoView();
}

function setDataToTable(table, data){

    const tableElem = $$(table);

    if (tableElem){
        tableElem.clearAll();
        tableElem.parse(data);

    } else {    
        errors_setFunctionError(
            "Таблица с id «" + table + 
            "» не найдена на странице", 
            updateSpace_logNameFile, 
            "setDataToTable"
        );
    }

    scrollToTable(tableElem);
}

function getTableData(tableId, query, onlySelect){

    const fullQuery = query.join("&");
    const path      = "/init/default/api/smarts?";
    const queryData = webix.ajax(path + fullQuery);

    queryData.then(function(data){
        data             = data.json();
        const notifyType = data.err_type;
        const notifyMsg  = data.err;
        const content    = data.content;
        const item       = content[0];

        if (!onlySelect){
            setDataToTable (tableId, content);
        } else if (item){
            createContextProperty (item, tableId);
        }
       

        if (notifyType !== "i"){
            setLogValue("error", notifyMsg);
        }  
    });
    queryData.fail(function(err){
        setAjaxError(
            err, 
            updateSpace_logNameFile, 
            "getTableData"
        );
    });
}

function updateSpace(chartAction){
    const tableId     = chartAction.field;

    const filter      = chartAction.params.filter;
    const filterParam = filter || tableId + ".id > 0" ;

    const sorts     = chartAction.params.sorts;
    const sortParam = sorts || tableId + ".id" ;
    const query     = createQuery(filterParam, sortParam);

    const onlySelect= chartAction.context;

    getTableData(tableId, query, onlySelect);
    
}


;// CONCATENATED MODULE: ./src/js/components/dashboard/createSpace/click/navigate.js

         



const navigate_logNameFile = "table => createSpace => click => navigate";

function createSentObj(prefs){
    const sentObj = {
        name    : "dashboards_context-prefs",
        prefs   : prefs,
    };

    const ownerId = webix.storage.local.get("user").id;

    if (ownerId){
        sentObj.owner = ownerId;
    }

    return sentObj;
}

function navigate_navigate(field, id){
    if (id){
        const path = "tree/" + field + "?view=filter&prefs=" + id;
        Backbone.history.navigate(path, { trigger : true });
        window.location.reload();   
    } 
}

function postPrefs(chartAction){
    const sentObj       = createSentObj(chartAction);
    const path          = "/init/default/api/userprefs/";
    const userprefsPost = webix.ajax().post(path, sentObj);
                    
    userprefsPost.then(function(data){
        data = data.json();
   
        if (data.err_type == "i"){
            const id = data.content.id;
            if (id){
                navigate_navigate(chartAction.field, id);
            } else {
                const errs   = data.content.errors;
                const values = Object.values(errs);
                const keys   = Object.keys  (errs);

                values.forEach(function(err, i){
                    errors_setFunctionError(
                        err + " - " + keys[i] , 
                        navigate_logNameFile, 
                        "postPrefs"
                    );
                });
               
            }
          

        } else {
            setLogValue("error", data.error);
        }
    });

    userprefsPost.fail(function(err){
        setAjaxError(
            err, 
            navigate_logNameFile,
            "postPrefs"
        );
    });
}


;// CONCATENATED MODULE: ./src/js/components/dashboard/createSpace/click/itemClickLogic.js







const action = {
    navigate: "true - переход на другую страницу, false - обновление в данном дашборде",
    context : "true - открыть окно с записью таблицы, false - обновить таблицу",
    field   : "название из fields (id таблицы должен быть идентичным, если navigate = false)",
    params  :{
        // sorts
        filter : "auth_group.id > 3", 
    }
   
};

const action2 = {
    navigate: true,
    field   : "auth_group", 
    context : true,
    params  :{
       filter : "auth_group.id = 1" 
    // filter : "auth_group.id != '1' or auth_group.id != '3' and auth_group.role contains 'р' or auth_group.role = 'а'" 
       // filter:"auth_user.registration_key != '3dg' and auth_user.registration_id = 'dfgg'"
    } 
};

function setCursorPointer(areas, fullElems, idElem){

    areas.forEach(function(el){
        if (el.tagName){
            const attr = el.getAttribute("webix_area_id");

            if (attr == idElem || fullElems){
                el.style.cursor = "pointer";
            }
            
        }
    });

}

function cursorPointer(self, elem){

    const node           = self.getNode();
    const htmlCollection = node.getElementsByTagName('map');
    const mapTag         = htmlCollection.item(0);

    if (mapTag){
        const areas      = mapTag.childNodes;
    
        if (elem.action){
            setCursorPointer(areas, true);
        } else if (elem.data){
            elem.data.forEach(function(el, i){

                // if (i == 1 || i == 4 ){
                //     el.action = action2; 
                // }
            
                if (el.action){
                    setCursorPointer(areas, false, el.id);
                }
            });
        }
    } else if (node){
        node.style.cursor = "pointer";
    }
}

async function findField(chartAction){
    await LoadServerData.content("fields");
    const keys = GetFields.keys;

    let field = chartAction;

    if (chartAction && chartAction.field){
        field = chartAction.field;
    }

    keys.forEach(function(key){
   
        if ( key == field ){
            if (chartAction.navigate){
                postPrefs(chartAction);
            } else {
                updateSpace(chartAction);
            } 
        
        }
    });
}

function findInnerChartField(elem, idEl){
    // найти выбранный элемент в data
    const collection = elem.data;
        
    let selectElement;

    collection.forEach( function (el){
        if (el.id == idEl){
            selectElement = el;
        }
    });

    const chartAction = selectElement.action;

    if (chartAction){
        findField(chartAction);

    } 
}

function setAttributes(elem, topAction){
    if (topAction){
        elem.action = topAction;
    }
  //  elem.action = action2;
    elem.borderless = true;
    elem.minWidth   = 250;
    elem.on         = {
        onAfterRender: function(){
            cursorPointer(this, elem);
        },

        onItemClick  : function(idEl){

            console.log("пример: ", action);
    
            if (elem.action){ // action всего элемента
                findField(elem.action);
                
            } else {          // action в data
                findInnerChartField(elem, idEl);
            }
            
        },

    };
     
    return elem;
}


function iterateArr(container, topAction){
    let res;
    const elements = [];

    function loop(container){

        if (container) {
            container.forEach(function(el){
              
                if (el){
                    const nextContainer = el.rows || el.cols || [el.body];
            
                    if (!el.rows && !el.cols){
                     
                        if (el.view && el.view !=="scrollview" && el.view !== "flexlayout"){
                            el = setAttributes(el, topAction);
                        }
                        
                        elements.push(el);
                    } else {
                        loop(nextContainer);
                    }
                }
            });
        }
    }

    loop (container);

    if (elements.length){
        res = elements;
    }

    return res;
}



function returnEl(element, topAction){

    const container = element.rows || element.cols || [element.body];
   
  
    let resultElem;
    
    container.forEach(function(el){
        const nextContainer = el.rows || el.cols || [el.body];
     
        if (nextContainer[0]){
            resultElem = iterateArr(nextContainer, topAction);
        } else {
            resultElem = setAttributes(el, topAction);
        }

    });

    return resultElem;
}


;// CONCATENATED MODULE: ./src/js/components/dashboard/createSpace/common.js
function getDashId ( idsParam ){
    const tree = $$("tree");
    let itemTreeId;

    if (idsParam){
        itemTreeId = idsParam;
    } else if (tree.getSelectedItem()){
        itemTreeId = tree.getSelectedItem().id;
    }

    return itemTreeId;
}


;// CONCATENATED MODULE: ./src/js/components/dashboard/createSpace/dynamicElements/chartsLayout.js




const chartsLayout_logNameFile = "dashboards => createSpace => dynamicElements => chartsLayout";

function chartsLayout_returnHeadline (titleTemplate){
    const headline = {   
        template    : titleTemplate,
        borderless  : true,
        height      : 35,
        css         : "dash-HeadlineBlock",
    };
 
    return headline;
}
const chartsLayout_action = {
    navigate: true,
    field   : "auth_group",
  //  context : true,
    params  :{
       // filter : "auth_group.id = 3" 
     filter : "auth_group.id != '1' or auth_group.id != '3' and auth_group.role contains 'р' or auth_group.role = 'а'" 
    } 
};

function createChart(dataCharts){
    const layout = [];
  
    try{

        const labels =  [
          { "view":"label", "label":"Больше 15 минут: 10"   ,"minWidth":200,"action":chartsLayout_action,"css":{"background-color":"#FFAAAA","text-align":"center"}},
          { "view":"label", "label":"Без комментария:  3"   ,"minWidth":200,"action":chartsLayout_action,"css":{"background-color":"#FFAAAA","text-align":"center"}},
          { "view":"label", "label":"За сегодня всего: 20"  ,"minWidth":200,"action":chartsLayout_action,"css":{"background-color":"#AAFFAA","text-align":"center"}},
          { "view":"label", "label":"За сегодня закрыто: 15","minWidth":200,"action":chartsLayout_action,"css":{"background-color":"#AAFFAA","text-align":"center"}},
          { "view":"label", "label":"За сегодня в работе: 5","minWidth":200,"action":chartsLayout_action,"css":{"background-color":"#AAFFFF","text-align":"center"}},
          { "view":"label", "label":"Всего не закрыто: 130" ,"minWidth":200,"action":chartsLayout_action,"css":{"background-color":"#AAFFFF","text-align":"center"}},
          { "view":"label", "label":"Без цвета: ???"        ,"minWidth":200,"action":chartsLayout_action,"css":{"text-align":"center"}},
        ]

        const res =  
            // {
            //     "title"  :"Статусы заявок",
            //     "margin" :10,
            //     "height" :300,
            //     "padding":10,
            //     "rows"   :[
            //       { "view":"scrollview", 
            //         "body":{    
            //             "view":"flexlayout",
            //             "height" :200,
            //             "margin":10, 
            //             "padding":0,
            //             "cols":labels
            //         },
            //       }
            //     ]  
            // }

            {   title  :"Статусы заявок",
                cols : labels
            };
                
                
            // };

            // {
            //     "title":"Монитор заявок по стадиям (открытых: %d)",
            //     "view":"chart",
            //     "type":"bar",
            //     "value":"#count#",
            //     "label":"#count#",
            //     "barWidth":30,
            //     "radius":0,
            //     "height":250,
            //     "tooltip":{
            //         "template":"#stage# - #count#"
            //     },
            //     "yAxis":{
            //         "title":"Количество"
            //     },
            //     "xAxis":{
            //         "template":"#stage#",
            //         "title":"Стадия"
            //     },
            //     "data":stages_data
            // },

            // {
            //     "title":"Монитор заявок (открытых: %d)" % len(data),
            //     "view":"datatable",
            //     "id":"btx_deals",
            //     "height":1000,
            //     "scroll":"xy",
            //     "columns":columns,
            //     "data":data,
            // },

        // const table = {
        //     "view": "datatable",
        //     "id"  : "auth_group",
        //     "height": 300,
        //     "scroll": "xy",
        //     "columns": [
        //         {
        //             "id": "id",
        //             "header": [
        //                 {
        //                     "text": "id"
        //                 }
        //             ],
        //             "width": 100,
        //         },
        //         {
        //             "id": "role",
        //             "header": [
        //                 {
        //                     "text": "роль"
        //                 }
        //             ],
                    
        //         },
        //         {
        //             "id": "description",
        //             "header": [
        //                 {
        //                     "text": "описание"
        //                 }
        //             ],
                    
        //         }
        //     ],
        //     "data": [
        //         {
        //             "id": 1,
        //             "role": "222",
        //             "description": "333",
        //         },
                
        //     ],
        //     "_inner": {
        //         "top": false
        //     },
        //     "onDblClick": {}
        // };
     
       // dataCharts.push(table)
        //dataCharts.push(res)
      
        dataCharts.forEach(function(el){
          
            if (el.cols || el.rows){
                returnEl(el, el.action);
                el.view   = "flexlayout";
                el.margin = 10;
                el.padding= 0;
            } else {
                el = setAttributes(el);
            }

        
            const titleTemplate = el.title;

            delete el.title;
         
            layout.push({
                css : "webix_dash-chart",
             
                rows: [ 
                    {template:' ', height:20, css:"dash-delim"},
                    chartsLayout_returnHeadline (titleTemplate),
                    {   margin     : 10,
                        height     : 300,
                        padding    : 10,
                        borderless : true,
                        rows       : [
                            {   
                                view : "scrollview", 
                                body : el,
                            },
                        ] 
               
                    }
  
                ]
            });


        });

   
    } catch (err){  
        errors_setFunctionError(
            err, 
            chartsLayout_logNameFile, 
            "createChart"
        );
    }

    return layout;
}


function setIdAttribute(idsParam){
    const container = $$("dashboardContainer");
    if (container){
        container.config.idDash = getDashId (idsParam);
    }
}


function createDashLayout(dataCharts){
    const layout = createChart(dataCharts);
 
    const dashLayout = [
        {  
            rows : layout
            
        }
    ];
 
    const dashCharts = {
        id  : "dashboard-charts",
        view: "flexlayout",
        css : "webix_dash-charts-flex",
        rows: dashLayout,
    };

    return dashCharts;
}

function createScrollContent(dataCharts){
    const content = {
        view        : "scrollview", 
        scroll      : "y",
        id          : "dashBodyScroll",
        borderless  : true, 
        body        : {
            id  : "dashboardBody",
            css : "dashboardBody",
            cols: [
                createDashLayout(dataCharts)
            ]
        }
    };

    return content;
}

function createDashboardCharts(idsParam, dataCharts){

    const container = $$("dashboardInfoContainer");

    const inner =  {   
        id  : "dashboardInfoContainerInner",
        rows: [
            createScrollContent(dataCharts)
            
        ]
    };

    try{
        container.addView(inner);
    } catch (err){  
        errors_setFunctionError(
            err, 
            chartsLayout_logNameFile, 
            "createFilterLayout"
        );
    } 

    setIdAttribute(idsParam);
}



;// CONCATENATED MODULE: ./src/js/viewTemplates/loadTemplate.js

function createOverlayTemplate(id, text = "Загрузка...", hidden = false){

    const template = {
        view    : "align", 
        hidden  :  hidden,
        align   : "middle,center",
        body    : {  
            borderless : true, 
            template   : text, 
            width      : 100,
            height     : 50, 
        },
        css     : "global_loadTemplate"

    };
 

    if (id){
        template.id = id;
    }

    return template;
     
}


;// CONCATENATED MODULE: ./src/js/components/dashboard/createSpace/dynamicElements/_layout.js










const _layout_logNameFile = "dashboards => createSpace => dynamicElems";

let inputsArray;
let idsParam;
let _layout_action;
let url;

function removeCharts(){
    Action.removeItem ($$("dashboardInfoContainerInner"));
    //Action.removeItem ($$("dash-template"              ));
}

function removeFilter(){
    Action.removeItem ($$("dashboard-tool-main"    ));
    Action.removeItem ($$("dashboard-tool-adaptive"));
}

function setLogHeight(height){
    try{
        const log = $$("logLayout");

        log.config.height = height;
        log.resize();
    } catch (err){  
        errors_setFunctionError(
            err, 
            _layout_logNameFile, 
            "setScrollHeight"
        );
    }
}

function setScrollHeight(){
    const logBth = $$("webix_log-btn");

    if ( logBth.config.icon == "icon-eye" ){
        setLogHeight(90);
        setLogHeight(5);
    } else {
        setLogHeight(5);
        setLogHeight(90);
    }
   
}

async function setDashName(idsParam) {
    const itemTreeId = getDashId (idsParam);
    try{
        await LoadServerData.content("fields");

        const names = GetFields.names;

        if (names){

            names.forEach(function(el){
                if (el.id == itemTreeId){
                    const template  = $$("dash-template");
                    const value     = el.name.toString();
                   
                    template.setValues(value);
                }
            });
        }
     
        
    } catch (err){  
        errors_setFunctionError(
            err, 
            _layout_logNameFile, 
            "setDashName"
        );
    }
}
function createDashHeadline(){
    $$("dashboardInfoContainer").addView(
        {id:"dash-headline-container", cols:[createHeadline("dash-template")]}
        
    );
    setDashName(idsParam);
}

function addSuccessView (dataCharts){
  
    if (!_layout_action){
        Action.removeItem      ($$("dash-headline-container"));
        createDashHeadline     ();
        createDashboardCharts  (idsParam, dataCharts);
        createFilterLayout     (inputsArray);
       
    } else {
        Action.removeItem       ($$("dashboardInfoContainerInner"));
        createDashboardCharts   (idsParam, dataCharts);
    }
    
}

function setUpdate(dataCharts){
    if (dataCharts == undefined){
        setLogValue   (
            "error", 
            "Ошибка при загрузке данных"
        );
    } else {
        addSuccessView(dataCharts);
    }
}

function setUserUpdateMsg(){
    if ( url.includes("?")   || 
         url.includes("sdt") && 
         url.includes("edt") )
        {
        setLogValue(
            "success", 
            "Данные обновлены"
        );
    } 
}

function addLoadElem(){
    const id = "dashLoad";
    if (!($$(id))){
        Action.removeItem($$("dashLoadErr"));

        const view = createOverlayTemplate(id);
        $$("dashboardInfoContainer").addView(view);
    }   
}


function removeLoadView(){
    Action.removeItem($$("dash-load-charts"));
}

function getChartsLayout(){
    addLoadElem();
    const getData = webix.ajax().get(url);
  
    getData.then(function(data){
   
        const err = data.json();
        if (err.err_type == "i"){

            Action.removeItem($$("dashLoad"));
            const dataCharts    = data.json().charts;
    
            Action.removeItem($$("dashBodyScroll"));
    
            if ( !_layout_action ){ //не с помощью кнопки фильтра
                removeFilter();
            }
            
            removeCharts    ();
            setUpdate       (dataCharts);
            setUserUpdateMsg();
            removeLoadView  ();
            setScrollHeight ();
         
        } else {
            errors_setFunctionError(
                err.err, 
                _layout_logNameFile, 
                "getChartsLayout"
            );
        }
    });
   
    getData.fail(function(err){
        const id = "dashLoadErr";
        Action.removeItem($$("dashLoad"));
        if ( !$$(id) ){
            $$("dashboardInfoContainer").addView(  
            createOverlayTemplate(id, "Ошибка"));
        }
   
        setAjaxError(err, _layout_logNameFile, "getAjax");
    });
    
}


function createDynamicElems ( path, array, ids, btnPress = false ) {
    inputsArray = array;
    idsParam    = ids;
    _layout_action      = btnPress;
    url         = path;
 
    getChartsLayout();

}


;// CONCATENATED MODULE: ./src/js/components/dashboard/createSpace/filter/submitBtnClick.js





const submitBtnClick_logNameFile = "dashboard => createSpace => submitBtn";

let index;
let submitBtnClick_inputsArray;
let submitBtnClick_idsParam;
let findAction;


let sdtDate;
let edtDate;
let validateEmpty;

const dateArray     = [];
const compareDates  = [];



function createTime(id, type){
    const formatTime     = webix.Date.dateToStr("%H:%i:%s");
    const value          = $$(id).getValue();
    const formattedValue = " " + formatTime(value);
    try{
        if (value){
            
            if (type == "sdt"){
                sdtDate = sdtDate.concat(formattedValue);
            } else if (type == "edt"){
                edtDate = edtDate.concat(formattedValue);
            }
    
        } else {
            validateEmpty = false;
        }
    } catch (err){  
        errors_setFunctionError(
            err,
            submitBtnClick_logNameFile,
            "createTime"
        );
    }
}

function createDate(id, type){
    try{
        if ( $$(id).getValue() !== null ){

            const value      = $$(id).getValue();
            const formatDate = webix.Date.dateToStr("%d.%m.%y");

            if (type == "sdt"){
                sdtDate = formatDate(value); 
            } else if ( type ==  "edt"){
                edtDate = formatDate(value);
            }
        
        } else {
            validateEmpty = false;
        }
    } catch (err){  
        errors_setFunctionError(
            err,
            submitBtnClick_logNameFile,
            "createDate"
        );
    }
}

function createFilterElems(id, type){
    if (id.includes(type)){

        if (id.includes("time")){
            createTime(id, type);

        } else {
            createDate(id, type);

        }
    }
}

function enumerationElements(el){
   
    const childs = $$(el.id).getChildViews();

    childs.forEach(function(elem){
        const id = elem.config.id;
        createFilterElems(id, "sdt");
        createFilterElems(id, "edt");
    });

}


function setInputs(){
    try{
        submitBtnClick_inputsArray.forEach(function(el){
            if ( el.id.includes("container") ){
                enumerationElements(el);
            }
        });
    } catch (err){  
        errors_setFunctionError(
            err,
            submitBtnClick_logNameFile,
            "setInputs"
        );
    }
}
function submitBtnClick_createQuery(type, val){
    dateArray.push( type + "=" + val );
    compareDates.push( val ); 
}



function getDataInputs(){
    setInputs   ();
    submitBtnClick_createQuery("sdt", sdtDate);
    submitBtnClick_createQuery("edt", edtDate);
}


function setStateBtn(index){
    try{
        const btn = $$("dashBtn" + index);
        btn.disable();
 
        setTimeout (function () {
            const node = btn.getNode();
            if (node){
                btn.enable();
            }
          
        }, 1000);
    } catch (err){  
        errors_setFunctionError(
            err, 
            submitBtnClick_logNameFile, 
            "setStateBtn"
        );
    }
}

const cssInvalid = "dash-filter-invalid";

function markInvalid(input){
    const node = input.getInputNode();
    webix.html.addCss(node, cssInvalid);
}

function resetInvalidMark(childs){
    childs.forEach(function(input){
        const view = input.config.view;
   
        if (view == "datepicker" ){
            const node = input.getInputNode();
            const css = node.classList.contains(cssInvalid);

            if (css){
                webix.html.removeCss(node, cssInvalid);
            }

        }

    });
}

function invalidTop(input, type){
    const id = input.config.id;
    if ( id.includes("_sdt") && type == "top"){
        markInvalid(input);
    }
}

function invalidEmpty(input, type){
    if (type == "empty"){
        const value = input.getValue();
        if (!value){
            markInvalid(input);
        }
    } 
}



function setInvalidView(type, childs){

    childs.forEach(function(input){
        const view = input.config.view;
       
        if (view == "datepicker"){
            invalidTop  (input, type);
            invalidEmpty(input, type);
        }

    });
   
}

function loadView(){
    const charts = $$("dashboard-charts");
    const parent = charts.getParentView();
    Action.removeItem(charts);
    parent.addView({
        id       : "dash-load-charts",
        template : "Загрузка..."
    }); 
}


function sentQuery (){
    const childs = 
    $$("datepicker-containersdt").getChildViews();

    if (validateEmpty){

        const formatData = webix.Date.dateToStr ("%Y/%m/%d %H:%i:%s");
        const start      = formatData (compareDates[0]);
        const end        = formatData (compareDates[1]);

        const compareValue = webix.filters.date.greater(start, end);
        
        if ( !(compareValue) || compareDates[0] == compareDates[1] ){

            const getUrl = findAction.url + "?" + dateArray.join("&");
      
            loadView();

            createDynamicElems(
                getUrl, 
                submitBtnClick_inputsArray,
                submitBtnClick_idsParam, 
                true
            );

            setStateBtn(index);
            resetInvalidMark(childs);
        } else {
            setInvalidView("top", childs);
            setLogValue(
                "error", 
                "Начало периода больше, чем конец"
            );
        }
    } else {
      
        setInvalidView("empty", childs);
     
        setLogValue(
            "error", 
            "Не все поля заполнены"
        );
    }
}

function clickBtn(i, inputs, ids, action){

    index       = i;
    submitBtnClick_inputsArray = inputs;
    submitBtnClick_idsParam    = ids;
    findAction  = action;

    dateArray   .length = 0;
    compareDates.length = 0;


    sdtDate         = "";
    edtDate         = "";
    validateEmpty   = true;

    getDataInputs();
    sentQuery ();
}





;// CONCATENATED MODULE: ./src/js/components/dashboard/createSpace/filter/elements.js




const elements_logNameFile = "dashboard => createSpace => filter";
 

const elements_inputsArray = [];
let   elements_findAction;
let   elements_idsParam;

function setAdaptiveWidth(elem){
    const child       = elem.getNode().firstElementChild;
    child.style.width = elem.$width + "px";

    const inp         = elem.getInputNode();
    inp.style.width   = elem.$width - 5 + "px";
}

function resetInvalidView(self){
    const node   = self.getNode();
    const input  = node.getElementsByTagName("input")[0];
    const css    = "dash-filter-invalid";
    if (input){
        const isInvalid = input.classList.contains(css);
        if (isInvalid){
            webix.html.removeCss(input, css);
        }   
    } 
}

function setNullTimeValue(self){
    const value = self.getText();
    if (!value){
        this.setValue("00:00:00");
    }
}


function elements_createDate(type, input){
    const dateTemplate = {
        view        : "datepicker",
        format      : "%d.%m.%y",
        editable    : true,
        value       : new Date(),
        placeholder : input.label,
        height      : 42,
        on          : {
            onItemClick:function(){
                resetInvalidView(this);
            },
            onAfterRender : function () {
                this.getInputNode().setAttribute(
                    "title",
                    input.comment
                );

               setAdaptiveWidth(this);
            },
        }
    };

    function setId(id){
        const dateFirst = dateTemplate;
        dateFirst.id    = "dashDatepicker_" + id;
        return dateFirst;
    }

    if (type == "first"){
        return setId("sdt");
    } else if (type == "last"){
        return setId("edt");
    }

}

function elements_createTime (type){
    const timeTemplate =  {   
        view        : "datepicker",
        format      : "%H:%i:%s",
        placeholder : "Время",
        height      : 42,
        editable    : true,
        value       : "00:00:00",
        type        : "time",
        seconds     : true,
        suggest     : {

            type    : "timeboard",
            css     : "dash-timeboard",
            hotkey  : "enter",
            body    : {
                button  : true,
                seconds : true,
                value   : "00:00:00",
                twelve  : false,
                height  : 110, 
            },
        },
        on: {
            onItemClick:function(){
                resetInvalidView(this);
            },

            onTimedKeyPress:function(){
                setNullTimeValue(this);
            },
            onAfterRender: function () {
                this.getInputNode()
                .setAttribute(
                    "title",
                    "Часы, минуты, секунды"
                );
                setAdaptiveWidth(this);
            }
           
        }
    };


    if (type == "first"){
        const timeFirst = timeTemplate;
        timeFirst.id    = "dashDatepicker_" + "sdt" + "-time";
        return timeFirst;
    } else if (type == "last"){
        const timeLast  = timeTemplate;
        timeLast.id     =  "dashDatepicker_" + "edt" + "-time"; 
        return timeLast;
    }
}


function createBtn (input, i){

    const btnFilter = new buttons_Button({
        
        config   : {
            id       : "dashBtn" + i,
            hotkey   : "Ctrl+Shift+Space",
            value    : input.label,
            click    : function(){
                clickBtn(
                    i, 
                    elements_inputsArray, 
                    elements_idsParam, 
                    elements_findAction
                );
            },
        },
        titleAttribute : input.comment,
        onFunc :{
            onViewResize:function(){
              setAdaptiveWidth(this);
            }
        }

    
    }).maxView("primary");

    return  btnFilter;
}


function createHead(text){
    return {   
        template   : text,
        height     : 30, 
        borderless : true,
        css        : "webix_template-datepicker"
    };
}


function createInputs( input ){

    const inputs = {   
        width   : 200,
        id      : "datepicker-container"+"sdt",
        rows    : [ 

            createHead ( "Начиная с:"  ),
            elements_createDate ( "first", input ),

            { height:10 },

            elements_createTime ("first"),


            { height:20 },


            createHead ( "Заканчивая:" ),
            elements_createDate ( "last", input ),

            { height:10 },

            elements_createTime ("last"),

        ]
    };

    try{
        elements_inputsArray.push( inputs );
    } catch (err){  
        errors_setFunctionError(err, elements_logNameFile, "createInputs");
    }
}

function createFilter (inputs, el, ids){
    elements_idsParam = ids;
    elements_inputsArray.length = 0;
    const values = Object.values(inputs);

    values.forEach(function(input, i){

        if (input.type == "datetime"&& input.order == 3){ 
            createInputs(input);

        } else if (input.type == "submit"){

            const actionType    = input.action;
            elements_findAction          = el.actions[actionType];
            
            elements_inputsArray.push(
                {height : 15}
            );
            elements_inputsArray.push(
                createBtn (input, i)
            );

        }


    });

    return elements_inputsArray;
  
}


;// CONCATENATED MODULE: ./src/js/components/dashboard/autorefresh.js

let autorefresh_idsParam;




function setIntervalConfig(counter){
    setInterval(function(){
        mediator.dashboards.load(autorefresh_idsParam);
    },  counter );
}

function autorefresh (el, ids) {

  
    if (el.autorefresh){

        const userprefsOther = webix.storage.local.get("userprefsOtherForm");
        const counter        = userprefsOther.autorefCounterOpt;
        autorefresh_idsParam             = ids;

        if ( counter !== undefined ){

            if ( counter >= 15000 ){
                setIntervalConfig(counter);

            } else {
                setIntervalConfig(50000);
            }

        } else {
            setIntervalConfig(50000);
        }

       
    }
}


;// CONCATENATED MODULE: ./src/js/components/dashboard/createDashboard.js









const createDashboard_logNameFile = "dashboard => createDashboard";
let createDashboard_idsParam;

function createDashboard_getDashId ( idsParam ){
    const tree = $$("tree");
    let itemTreeId;

    if (idsParam){
        itemTreeId = idsParam;
    } else if (tree.getSelectedItem()){
        itemTreeId = tree.getSelectedItem().id;
    }

    return itemTreeId;
}


function createDashSpace (){

    const keys   = GetFields.keys;
    const values = GetFields.values;

    const itemTreeId = createDashboard_getDashId(createDashboard_idsParam);
  
    values.forEach(function(el,i){

        const fieldId = keys[i];
     
        if (el.type == "dashboard" && fieldId == itemTreeId) {
          
            const url    = el.actions.submit.url;
            const inputs = createFilter (el.inputs, el, createDashboard_idsParam);
         
            createDynamicElems(url, inputs,      createDashboard_idsParam);
            autorefresh       (el,  createDashboard_idsParam);
        }
    });
}

async function getFieldsData (){
    await LoadServerData.content("fields");
    createDashSpace ();
}

function createDashboard_getData(tableId, src){

    const query = [
        "query=" + src + ".id=" + tableId,
        "sorts=" + src + ".id",
        "limit=" + 80,
        "offset="+ 0,
    ];
    const fullQuery = query.join("&");
    const path      = "/init/default/api/smarts?";
    const queryData = webix.ajax(path + fullQuery);

    queryData.then(function(data){
        data             = data.json();
        const notifyType = data.err_type;
        const notifyMsg  = data.err;
        const content    = data.content[0];

        if (content){
            createContextProperty(
                content, 
                src
            );
        }

        if (notifyType !== "i"){
            errors_setFunctionError(
                notifyMsg, 
                createDashboard_logNameFile, 
                "getData"
            );
        }  
    });
    queryData.fail(function(err){
        setAjaxError(
            err, 
            createDashboard_logNameFile, 
            "getTableData"
        );
    });
}

function getLinkParams(param){
    const href   = window.location.search;
    const params = new URLSearchParams (href);
    return params.get(param);
}

function selectContextId(){
    const idParam  = getLinkParams("id");
    const srcParam = getLinkParams("src");
    if (idParam && srcParam){
        createDashboard_getData(idParam , srcParam);
    } 
}
function createContext(){
    selectContextId()
}


function createDashboard ( ids ){
    createDashboard_idsParam = ids;

    const scroll = $$("dashBodyScroll");
    Action.removeItem(scroll);

    getFieldsData ();
  
    createContext();
}


;// CONCATENATED MODULE: ./src/js/components/dashboard/_dashMediator.js





class Dashboards {
    constructor (){
        this.name = "dashboards";
    }

    create(){
        if (!$$(this.name)){
            $$("container").addView(
                {   view    : "layout",
                    id      : this.name, 
                    hidden  : true, 
                    scroll  : "auto",
                    rows    : dashboardLayout()
                },
            3);
        }
    }

    showView(){
        Action.showItem($$(this.name));   
    }

    load(id){
        createDashboard(id);
    }

    defaultState(){
        Action.hideItem($$("dashboardTool"));
        Action.showItem($$("dashboardInfoContainer"));
    }

}


;// CONCATENATED MODULE: ./src/js/components/table/createSpace/rows/autorefresh.js


let interval;
function autorefresh_setIntervalConfig(type, counter){
    interval = setInterval(function(){
        if( type == "dbtable" ){
            getItemData ("table");
        } else if ( type == "tform" ){
            getItemData ("table-view");
        }
    }, counter );
}

function autorefresh_autorefresh (data){
 
    if (data.autorefresh){

        const userprefsOther = webix.storage.local.get("userprefsOtherForm");
        let counter;

        if (userprefsOther){
            counter = userprefsOther.autorefCounterOpt;
        }

        if ( userprefsOther && counter !== undefined ){
            if ( counter >= 15000 ){
                autorefresh_setIntervalConfig(data.type, counter);
                
            } else {
                autorefresh_setIntervalConfig(data.type, 120000);
            }
        }
    } else {
        clearInterval(interval);
    }
}



;// CONCATENATED MODULE: ./src/js/components/table/createSpace/rows/userContext.js


 
const userContext_logNameFile = "table => createSpace => userContext";

let prefs;
//let tableId;

function returnParameter(el, parameter){
    const prefs = JSON.parse(el.prefs)[parameter];
    return prefs;
}

function removePref(el){
    const path          = "/init/default/api/userprefs/" + el.id;
    const userprefsDel = webix.ajax().del(path, el);
                    
    userprefsDel.then(function (data){
        data = data.json();
        if (data.err_type !== "i"){
            errors_setFunctionError(
                data.err, 
                userContext_logNameFile, 
                "removePref"
            );
        }
    });

    userprefsDel.fail(function(err){
        setAjaxError(
            err, 
            userContext_logNameFile,
            "userprefsDel"
        );
    });
}


function userContext_createQuery(id){
 
    const tableSort = "userprefs.id";
 
    const data = { 
        'query' : tableSort + "=" + id, 
        'sorts' : tableSort, 
        'limit' : 80 , 
        'offset': 0 
    };

    const  queryString = mediator.createQuery(data);

    return queryString;
}

async function getDataPrefs(urlParameter){
    const query        = userContext_createQuery(urlParameter);
    const path         = "/init/default/api/smarts?" + query ;
    const userprefsGet = webix.ajax().get(path);
                    
    await userprefsGet.then(function (data){
        data         = data.json().content;
        const item   = data[0];
        
        if (item){
            prefs        = returnParameter(item, "params");
          //  tableId      = returnParameter(item, "field");
            removePref(item);
        }
    
    });

    userprefsGet.fail(function (err){
        setAjaxError(
            err, 
            userContext_logNameFile,
            "userprefsGet"
        );
    });
}

// function clearFilterBtn(){
//     const btn = {
//         view:"button", 
//         id:"my_button", 
//         value:"Button",
//     } ;
// }

async function getUserPrefsContext(urlParameter, parameter){
 
    await getDataPrefs(urlParameter);
 
    if (prefs){
        return prefs[parameter];
    }
   
}



;// CONCATENATED MODULE: ./src/js/components/table/createSpace/rows/formattingData.js

const formattingData_logNameFile = "table => createSpace => formattingData";

let idCurrView;

// date

function findDateCols (columns){
    const dateCols = [];
    try{
        columns.forEach(function(col,i){
            if ( col.type == "datetime" ){
                dateCols.push( col.id );
            }
        });
    } catch (err){
        errors_setFunctionError(err, formattingData_logNameFile, "findDateCols");
    }

    return dateCols;
}

function changeDateFormat (data, elType){
    data.forEach(function(el){
        if ( el[elType] ){
            const dateFormat = new Date( el[elType] );
            el[elType]       = dateFormat;
            
        }
    });
}

function formattingDateVals (table, data){

    const columns  = $$(table).getColumns();
    const dateCols = findDateCols (columns);

    function setDateFormatting (){
        dateCols.forEach(function(el,i){
            changeDateFormat (data, el);
        });
    }

    setDateFormatting ();
     
   
}



// boolean

function findBoolColumns(cols){
    const boolsArr = [];

    cols.forEach(function(el,i){
        if (el.type == "boolean"){
            boolsArr.push(el.id);
        }
    });

    return boolsArr;
}

 

function isBoolField(cols, key){
    const boolsArr = findBoolColumns(cols);
    let check      = false;
    boolsArr.forEach(function(el,i){
        if (el == key){
            check = true;
        } 
    });

    return check;
}


function getBoolFieldNames(){
    const boolKeys = [];
    const cols     = idCurrView.getColumns(true);

    cols.forEach(function(key){
    
        if( isBoolField(cols, key.id)){
            boolKeys.push(key.id);
    
        }
    });

    return boolKeys;
}

function setBoolValues(element){
    const boolFields = getBoolFieldNames();

    boolFields.forEach(function(el){
 
        if (element[el] !== undefined){
            if ( element[el] == false ){
                element[el] = 2;
            } else {
                element[el] = 1;
            }
        }
      
    });

}

function formattingBoolVals(id, data){
    idCurrView = id;

    data.forEach(function(el,i){
        setBoolValues(el);
    });

}


;// CONCATENATED MODULE: ./src/js/components/table/defaultValues.js
const formatData  = webix.Date.dateToStr("%d.%m.%y %H:%i:%s");


function createGuid() {  
    const mask = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return mask.replace(/[xy]/g, function(c) {  
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);  
    });  
}

function dateFormatting (el){
    const date = new Date(el.default);
    return formatData(date);
}

function returnDefaultValue (el){
    let defVal;



    const def      = el.default;
    const parsDate = Date.parse(new Date(def));

    const type     = el.type ;

    if (def === "now" && type == "datetime"){
        defVal = formatData(new Date());
 
    } else if (parsDate && type == "datetime" ){
        defVal = dateFormatting (el);

    } 

    else if (def && def.includes("make_guid")) {
        defVal = createGuid();

    } 
    
    else if (def == "False"){
        defVal = 2;

    } else if (def  == "True"){
        defVal = 1;

    } 

    else if (def !== "None" && def !== "null"){
        defVal = def;

    } else if (def  == "null") {
        defVal = null;
    }


    return defVal;
}



;// CONCATENATED MODULE: ./src/js/components/table/createSpace/rows/setDefaultValues.js




function isExists(value){
    if (value){
        return value.toString().length;
    }

}


function returnValue(fieldValue){
    const table = getTable();
    const cols  = table.getColumns(true);
    
   
    cols.forEach(function(el){
        const defValue =  returnDefaultValue(el);
       
        const value = fieldValue[el.id];

        if (isExists(defValue) && !value){
            fieldValue[el.id] = returnDefaultValue(el);
        }

    });
}

function setDefaultValues (data){

    data.forEach(function(el){
        returnValue(el);
    });

}


;// CONCATENATED MODULE: ./src/js/components/table/createSpace/createContextSpace.js



function createContextSpace_getLinkParams(param){
    const href   = window.location.search;
    const params = new URLSearchParams (href);
    return params.get(param);
}

function createContextSpace_selectContextId(){
    const idParam = createContextSpace_getLinkParams("id");
    const table   = getTable();
    
    if (table && table.exists(idParam)){
        table.select(idParam);
    } else {
        mediator.linkParam(false, "id");
    }
 
}



;// CONCATENATED MODULE: ./src/js/components/table/createSpace/returnLostData.js




let prop;
let returnLostData_form;

function returnLostData_getLinkParams(param){
    const href   = window.location.search;
    const params = new URLSearchParams (href);
    return params.get(param);
}

function isThisIdSelected(id){
    const selectedId = returnLostData_getLinkParams("id");
    if (id == selectedId){
        return true;
    }
    return false;
}

function setVals(values){
    prop.setValues(values);
    returnLostData_form.setDirty(true);

    setLogValue(
        "success", 
        "Данные редактора восстановлены"
    );
}

function isFilterParamExists(){
    const param = returnLostData_getLinkParams("view");
    if (param == "filter"){
        return true;
    }
}

function isEditParamExists(){
    const param = returnLostData_getLinkParams("view");
    if (param == "edit"){
        return true;
    }
}


function returnLostData(){

    if (isEditParamExists()){
        $$("table-editTableBtnId").callEvent("clickEvent", [ "" ]);
    }
  
    if (!isFilterParamExists()){

        const data = webix.storage.local.get("editFormTempData");

        if (data){
            prop          = $$("editTableFormProperty");
            returnLostData_form          = $$("table-editForm");
            const table   = $$("table");
            const tableId = table.config.idTable;

            const values  = data.values;
            const field   = data.table;
            const status  = data.status;

            if (tableId == field ){
                Action.hideItem($$("filterTableForm"));
        
                if (status === "put"){
                    const id = values.id;
                    if (table.exists(id)     &&
                        isThisIdSelected(id) )
                    {

                        table.select(id);
                        setVals(values);
                            
                    }
                
                } else if (status === "post"){
                    Action.showItem(returnLostData_form);
                    mediator.tables.editForm.postState();
                    setVals(values);
                }
            }
        }
    }
}


;// CONCATENATED MODULE: ./src/js/components/table/createSpace/returnSortData.js


function returnSortData(){
    const values = webix.storage.local.get("tableSortData");

    if (values){
        const table = getTable();
        table.config.sort = {
            idCol : values.idCol,
            type  : values.type
        };

    }
}


;// CONCATENATED MODULE: ./src/js/components/table/filterForm/actions/visibleField.js





const visibleField_logNameFile = "filterForm => actions => visibleField";


const showClass   = "webix_show-content";
const hideClass   = "webix_hide-content";

let segmentBtn;
let elementClass;
let condition;
let el;

function checkChild(elementClass){
    let unique = true;
    
    if (Filter.lengthItem(elementClass)){
        unique = false;
    }

    return unique;
 
}


function editStorage(){
    if (condition){
       
        const item = Filter.getItem(elementClass);

        if (!item){
            Filter.clearItem (elementClass); // =>  key = []
        }


        const unique = checkChild(elementClass, el);

        if (unique){
            Filter.pushInPull(elementClass, el);
            Action.showItem  (segmentBtn);
        }
     

    } else {
        Filter.clearItem(elementClass);
    }

}


function showInputContainers(){
    Action.showItem($$(el));
    Action.showItem($$(el + "_container-btns"));
}

function setValueHiddenBtn(btn, value){
    if( btn ){
        btn.setValue(value);
    }
}
function setDefStateBtns(){
    const operBtn    = $$(el + "-btnFilterOperations");
    const btns       = $$(el + "_container-btns"     );

    
    setValueHiddenBtn(operBtn   , "=");
    setValueHiddenBtn(segmentBtn,  1);
    Action.hideItem  (segmentBtn    );
    Action.hideItem  (btns          );
}

function setDefStateInputs (){
    $$(el).setValue("");
    $$(el).hide();
}


function setHtmlState(add, remove){
  
    const css = ".webix_filter-inputs";
    const htmlElement = document.querySelectorAll(css);
    
    try{
        htmlElement.forEach(function (elem){
            const isClassExists = elem.classList.contains(elementClass);
     
            if (isClassExists){
                Filter.addClass   (elem, add   );
                Filter.removeClass(elem, remove);
            } 

        });

        

    } catch(err){
        errors_setFunctionError(
            err,
            visibleField_logNameFile,
            "hideHtmlEl"
        );
    }
}

function removeChilds(){
    const container       = $$(el + "_rows");
    const containerChilds = container.getChildViews();

    const values = Object.values(containerChilds);
    const childs = [];

    try{
       
        values.forEach(function(elem){
            const id = elem.config.id;

            if (id.includes("child")){
                childs.push($$(id));
            }

        });

        childs.forEach(function(el){
            Action.removeItem(el);
        });

    } catch(err) {
        errors_setFunctionError(
            err,
            visibleField_logNameFile,
            "removeChids"
        );
    }
}

function isChildExists(){
    let checkChilds = false;


    const container = $$(el + "_rows");

    const childs    = container.getChildViews();

    if (childs.length > 1){
        checkChilds = true;
    }
    
    

    return checkChilds;
}

function showInput(){

    setHtmlState(showClass, hideClass);
    showInputContainers ();
    Action.enableItem   ($$("resetFilterBtn"        ));
    Action.enableItem   ($$("filterLibrarySaveBtn"  ));
    Action.hideItem     ($$("filterEmptyTempalte"   ));  
}

function hideInput(){

    setHtmlState(hideClass, showClass);


    if($$(el + "_rows")){
        removeChilds();
    }

    setDefStateInputs();
    setDefStateBtns  ();
    
}


function visibleField (visible, cssClass){

 
    if (cssClass !== "selectAll" && cssClass){

        condition    = visible;
        elementClass = cssClass;
        el           = cssClass + "_filter";

        segmentBtn   = $$( el + "_segmentBtn");
        
        editStorage();
    
        if (!isChildExists()){
            if (condition){
                showInput();
            } else {
                hideInput();
            }
        } else if (!condition){
            hideInput(); 
        }
    }

}


;// CONCATENATED MODULE: ./src/js/components/table/filterForm/actions/clearSpace.js


 
function hideElements(arr){
    arr.forEach(function(el){
        if ( !el.includes("_filter-child-") ){

            const colId      = $$(el).config.columnName;
            const segmentBtn = $$(el + "_segmentBtn");

            Filter.setFieldState(0, colId, el);
            segmentBtn.setValue (1);
            Action.hideItem     (segmentBtn);
        }   
    });
}

function clearTableFilter(){
    const table = getTable();
    table.config.filter = null;
}

function clearSpace(){

    clearTableFilter();

    const values = Filter.getAllChilds ();
 
    values.forEach(function(el){
    
        if (el.length){
            hideElements(el);
        }
    });

    Action.disableItem($$("btnFilterSubmit"));
}


;// CONCATENATED MODULE: ./src/js/components/table/filterForm/actions/getFilterState.js



const getFilterState_logNameFile   = "filterForm => getFilterState";

let template;

function isParent(el){
    const config = el.config;
    const name   = config.columnName;
    const parent = name + "_filter";
    const id     = config.id;

    let check    = null;

    if (parent !== id){
        check = name;
    }
    return check;
}

function pushValues(id, logic, index){

    const btn = $$(id + "-btnFilterOperations");

    if (btn){
        const operation = btn.getValue();
        const value     = $$(id).getValue();
        const parent    = isParent($$(id));

        template.values.push({
            id          : id, 
            value       : value,
            operation   : operation,
            logic       : logic,
            parent      : parent,
            index       : index
        });
    }
}

function setOperation(arr){
    arr.forEach(function(el, i){
   
        const segmentBtn = $$( el + "_segmentBtn" );

        if(segmentBtn){
            try{
            let logic = null;

            if (segmentBtn.isVisible()){
                logic = segmentBtn.getValue();
            }

            pushValues(el, logic,  i);

            } catch(err){
                errors_setFunctionError(
                    err,
                    getFilterState_logNameFile,
                    "setOperation"
                );
            }
            
        }  
     
    });
}


function getFilterState(){
    const keys       = Filter.getItems  ();
    const keysLength = Filter.lengthPull();

    
    template           = {
        values : []
    };

   
    for (let i = 0; i < keysLength; i++) {   
        const key = keys[i];
        setOperation(Filter.getItem(key));
    }


    return template;
}



;// CONCATENATED MODULE: ./src/js/components/table/filterForm/actions/setStateToStorage.js



function setState () {
    const result   = Filter.getFilter();
    const template = Filter.getActiveTemplate();
    
    const sentObj  = {
        id             : getItemId(),
        activeTemplate : template,
        values         : result
    };

    webix.storage.local.put(
        "currFilterState", 
        sentObj
    );
    
}



;// CONCATENATED MODULE: ./src/js/components/table/filterForm/actions/resetTable.js







const resetTable_logNameFile   = "tableFilter => buttons => resetBtn";


function setDataTable(data, table){
    const overlay = "Ничего не найдено";
    try{
        if (data.length !== 0){
            table.hideOverlay(overlay);
            table.clearAll   ();
            table.parse      (data);

        } else {
            table.clearAll   ();
            table.showOverlay(overlay);
        }
    } catch (err){
        errors_setFunctionError(
            err,
            resetTable_logNameFile,
            "setDataTable"
        );
    }
}

function setFilterCounterVal(table){
    try{
        const counter         = $$("table-findElements");
        const filterCountRows = table.count();
        const values          = {visible:filterCountRows}
        counter.setValues(JSON.stringify(values));

    } catch (err){

        errors_setFunctionError(
            err,
            resetTable_logNameFile,
            "setFilterCounterVal"
        );
    }
}

async function resetTable(){
    const itemTreeId = getItemId ();
    const table      = getTable  ();
    const query      = [
        `query=${itemTreeId}.id+%3E%3D+0&sorts=${itemTreeId}.id&limit=80&offset=0`
    ];
   
    const path       = "/init/default/api/smarts?" + query;
    const queryData  = webix.ajax(path);

     
    return await queryData.then(function(data){
        const dataErr =  data.json();
      
        data = data.json().content;

        if (dataErr.err_type == "i"){
            try{
                setDataTable (data, table);
                setFilterCounterVal(table);
                setLogValue("success", "Фильтры очищены");
                return true;
            } catch (err){
                errors_setFunctionError(
                    err,
                    resetTable_logNameFile,
                    "resetFilterBtn"
                );
            }

        } else {
            setLogValue(
                "error", 
                "resetFilterBtn ajax: " +
                dataErr.err
            );
        }
    }).fail(function(err){
        setAjaxError(
            err, 
            resetTable_logNameFile,
            "resetFilterBtn"
        );
    });
}


;// CONCATENATED MODULE: ./src/js/components/table/filterForm/actions/_FilterActions.js








const visibleInputs = {};

class FilterPull {
    static pushInPull (key, el){
        visibleInputs[key].push(el);
      
    }

    static getIndex(){

    }

    static clearItem (key){
        visibleInputs[key] = [];
    }


    static getItem (key){
        return visibleInputs[key];
    }

    static getAllChilds (isConcat){
        const values =  Object.values(visibleInputs);
        
        function concat(arr) {
            return [].concat(...arr);
        }

        if (isConcat){
            return concat(values);
        } else{
            return values;
        }
   
    }

   

    static getIndexFilters(){
        const container = $$("inputsFilter");
        const result    = [];
        if(container){
            const childs = container.getChildViews();
            childs.forEach(function(el, i){
                result[el.config.idCol] = i;
              
            });
        }

        return result;
    }


    static getAll (){
        return visibleInputs;
    }

    static getItems (){
        return Object.keys(visibleInputs);
    }


    static lengthItem(key){
        return visibleInputs[key].length;
    }

    static lengthPull (){
        const length = this.getItems().length;
        return length;
    }

    
    static clearAll(){
        const keys = this.getItems();
        if (keys){
            keys.forEach(function(key){
                delete visibleInputs[key];
            });
        }
    }

    static removeItemChild(key, child){
        const item = this.getItem(key);

        item.forEach(function(id, i){
            if (id == child){
                item.splice(i, 1);
            }
        });
    }
   
    static spliceChild (key, pos, child){
        visibleInputs[key].splice(pos, 0, child);
    }

}

class Filter extends FilterPull {

    static addClass(elem, className){
        if (!(elem.classList.contains(className))){
            elem.classList.add(className);
        }
    }
    
    static removeClass(elem, className){
        if (elem.classList.contains(className)){
       
            elem.classList.remove(className);
           
        }
    }

    static setFieldState(visible, cssClass){
        visibleField (visible, cssClass);
    }

    static clearFilter(){
        clearSpace();
    }

    static getFilter(){
        return getFilterState();
    }

    static setStateToStorage(){
        setState();
    }

    static setActiveTemplate(val){
        $$("filterTableForm").config.activeTemplate = val;
    }
    
    static getActiveTemplate(){
        return $$("filterTableForm").config.activeTemplate;
    }

    static showApplyNotify(show = true){
        const table   = getTable();

        if (table){
            const tableId = table.config.id;
            const item    = $$(tableId + "_applyNotify");
     
            if (show){
                Action.showItem(item); 
            } else {
                Action.hideItem(item); 
            }
        }
      
    
    }

    static async resetTable(){
        return await resetTable();
    }

    static hideInputsContainers(visibleInputs){
        const table = getTable();
        const cols  = table.getColumns();
        cols.forEach(function(col){
            const found = visibleInputs.find(element => element == col.id);
    
            if (!found){
                const htmlElement = document.querySelector("." + col.id ); 
                Filter.addClass   (htmlElement, "webix_hide-content");
                Filter.removeClass(htmlElement, "webix_show-content");
            }
        });
    }

    static enableSubmitButton(){
        const btn = $$("btnFilterSubmit");
   
        const inputs   = this.getAllChilds (true);
        let fullValues = true;
    
        if (inputs){
            inputs.forEach(function(input){
                const isValue = $$(input).getValue();
                if (!isValue && fullValues){
                    fullValues = false;
                }
            });
    
            if (fullValues){
                Action.enableItem (btn);
            } else {
                Action.disableItem(btn);
            }
        }
    }
    
    
}


;// CONCATENATED MODULE: ./src/js/components/table/filterForm/createElements/field.js





    
    
let field_el ;
let typeField;
let uniqueId;
let partId;

function enableSubmitBtn(){
    Action.enableItem($$("btnFilterSubmit"));
}

function createFieldTemplate(){

    const elemId  = field_el.id;
    const fieldId = elemId + partId;

    const fieldTemplate = {
        id        : fieldId, 
        name      : fieldId,
        label     : field_el.label,
        columnName: elemId,
        labelPosition:"top",
    };

    if (!uniqueId) fieldTemplate.hidden = true;

    return fieldTemplate;
}

function activeState(){
    enableSubmitBtn();
    Filter.setStateToStorage();
    $$("filterTableForm").clearValidation();
}

function createText(type){
    const element = createFieldTemplate();
    element.view  = "text";
 
    element.on    = {
        onTimedKeypress:function(){
            activeState();
        }
    };

    if(type == "text"){
        element.placeholder = "Введите текст";
    } else if (type == "int"){
        element.placeholder    = "Введите число";
        element.invalidMessage = 
        "Поле поддерживает только числовой формат";
        element.validate       = function(val){
            return !isNaN(val*1);
        };
    }


    

    return element;
}

function findComboTable(){
    if (field_el.editor && field_el.editor == "combo"){
        return field_el.type.slice(10);
    } 
}

function createCombo(type){

    const element       = createFieldTemplate();
    const findTableId   = findComboTable();

    element.view        = "combo";
    element.placeholder = "Выберите вариант";

    element.on    = {
        onChange:function(){
            activeState();
        }
    };

    if (type == "default"){
        element.options     = {
            data:getComboOptions(findTableId)
        };

    } else if (type == "bool"){
        element.options = [
            {id:1, value: "Да"},
            {id:2, value: "Нет"}
        ];
    }

    return element;
}

function createDatepicker() {
    const element       = createFieldTemplate();
    element.view        = "datepicker";
    element.placeholder = "дд.мм.гг";
    element.editable    = true,
    element.format      = "%d.%m.%Y %H:%i:%s";
    element.timepicker  = true;
    element.on    = {
        onChange:function(){
            activeState();
        }
    };

    return element;
}

function createField(){
 
    if (typeField=="text"){
        return createText("text");

    } else if (typeField=="combo"){
        return createCombo("default");

    } else if (typeField=="boolean"){
        return createCombo("bool");

    } else if (typeField=="date"){
        return createDatepicker();

    } else if (typeField=="integer"){
        return createText("int");

    }

}


function field_field (id, type, element){
    uniqueId = id;
    if (!uniqueId){ // parent input
        partId = "_filter";
    } else {
        partId = "_filter-child-" + uniqueId;
    }


    field_el        = element;
    typeField = type;

    return createField();
}


;// CONCATENATED MODULE: ./src/js/blocks/notifications.js
function popupExec (titleText) { 

    return webix.confirm({
        width:300,
        ok: 'Да',
        cancel: 'Отмена',
        title:titleText,
        text:"Вы уверены, что хотите продолжить?"
    });
}


function modalBox (title, text, btns){

    if(!title && !text && !btns){
        return webix.modalbox({
            title   : "Данные не сохранены",
            css     : "webix_modal-custom-save",
            buttons : ["Отмена", "Не сохранять", "Сохранить"],
            width   : 500,
            text    : "Выберите действие перед тем как продолжить"

        });
    } else {
        return webix.modalbox({
            title   : title,
            css     : "webix_modal-custom-save",
            buttons : btns,
            width   : 500,
            text    : text

        });
    }

}

;// CONCATENATED MODULE: ./src/js/components/table/filterForm/createElements/buttons/contextBtn.js













const contextBtn_logNameFile = "createElement => contextBtn";



function getVisibleInfo(lastIndex = false){
 
    const values = Filter.getAllChilds();

    const fillElements = [];
    
    let counter = 0;

    values.forEach(function(value, i){
        if (value.length){
            counter ++;
            fillElements.push(i);
        }
    });

    if (lastIndex){
        return fillElements.pop();
    } else {
        return counter;
    }

 
}

function showTemplateInfo(){
    if (Filter.getActiveTemplate()){
        Action.showItem($$("templateInfo"));
    }
}


function isLastInput(lastInput, thisInput){

    let check = false;

    if ( lastInput === thisInput){
        check = true;
    }

    return check;
}



function prevArray(keys, currKey){

    let value;

    function loop(key){
        const indexCurrKey = keys.indexOf(key);
        let indexPrevKey   = indexCurrKey - 1;
        
        if (indexPrevKey >= 0){

            const key    = keys[indexPrevKey];
            const length = Filter.lengthItem (key);

            if (length){
                value = Filter.getItem(key);
            } else {
                loop(key);
            }
           
        } 
    }
    
    loop(currKey);

    return value;
}

function showEmptyTemplate(){
 
    if (!getVisibleInfo()){
        Action.showItem($$("filterEmptyTempalte"));
    }

}


function returnLastItem(array){
    const indexes       = Filter.getIndexFilters();
    const selectIndexes = [];

    if (array){

        array.forEach(function(el){
            selectIndexes.push(indexes[el]);
        });

 
        let lastIndex = 0;

        for (let i = 0; i < selectIndexes.length; i++){

            if (selectIndexes[i] > lastIndex) {
                lastIndex = selectIndexes[i];
            }
        }

        const keys = Object.keys(indexes);

        const lastInput = 
        keys.find(key => indexes[key] === lastIndex);

  
        return lastInput;
    }

}

function isLastKey(inputsKey, keys) {
    const currInputs = [];
    keys.forEach(function(key){
        const item = Filter.getItem(key);
        if (item.length){
            currInputs.push(key)
        }    
    });


    const lastKey = returnLastItem(currInputs);
  
    if (inputsKey == lastKey){
        return true;
    }
 
   
}


function findInputs(id, keys){

    const result    = {};

    let isLastCollection = false;

    let inputs       = Filter.getItem(id);

    result.prevIndex = inputs.length - 2;
    result.lastIndex = inputs.length - 1;
    result.lastInput = inputs[result.lastIndex]; 

 
    if (result.prevIndex < 0){ // удален последний элемент из коллекции
        inputs = prevArray(keys, id); // найти не пустую коллекцию
     
        
        if (!inputs){
            isLastCollection = true;  // то была последняя коллекция в пулле
        } else {
            result.prevIndex = inputs.length - 1;
        }
    }
   

    if (!isLastCollection){
        result.prevInput = inputs[result.prevIndex];

    } else {
 
        if (Filter.getActiveTemplate()){
            Filter.setActiveTemplate(null);
        }
        Action.hideItem($$("templateInfo"));
        showEmptyTemplate();
    }

    return result;
}

function hideBtn(input){
    const btn = $$(input + "_segmentBtn");
    Action.hideItem(btn);

}

function hideSegmentBtn (action, inputsKey, thisInput){
 
    const keys      = Filter.getItems();
   
    const checkKey  = isLastKey(inputsKey, keys);
 
    // при удалении приходит удаляющийся

    if (action === "add" && checkKey){

        const inputs     = findInputs (inputsKey, keys);
        const checkInput = isLastInput(inputs.lastInput, thisInput);
    
        if (checkInput){
            
            hideBtn( inputs.lastInput );
        }
        

    } else if (action === "remove" && checkKey){
 
        const inputs     = findInputs (inputsKey, keys);
        const checkInput = isLastInput(inputs.lastInput, thisInput);

        if (checkInput){
            hideBtn( inputs.prevInput );
        }
   
    }
}

function hideHtmlEl(id){
    const idContainer = $$(id + "_filter_rows");
    const showClass   = "webix_show-content";
    const hideClass   = "webix_hide-content";

    const childs = idContainer.getChildViews();

    if (childs.length == 1){
        const div = idContainer.getNode();
       
        Filter.removeClass (div, showClass);
        Filter.addClass    (div, hideClass);

    }

}

function hideMainInput(thisInput, mainInput){
    const btnOperations = $$(thisInput + "-btnFilterOperations");

    try{
        mainInput.forEach(function(el){
            Action.hideItem(el);
        });

        btnOperations.setValue(" = ");

    } catch(err){ 
        errors_setFunctionError(
            err, 
            contextBtn_logNameFile, 
            "contextBtn remove => hideMainInput"
        );
    }
}




function clickContextBtnParent (id, el){

    const thisInput  = el.id + "_filter";
    const segmentBtn = $$(thisInput + "_segmentBtn");       
    
    function removeInput (){

        const container  = $$(thisInput).getParentView();
        const mainInput  = container.getChildViews();
     
        hideMainInput       (thisInput, mainInput);

        hideHtmlEl          (el.id);

  
        hideSegmentBtn      ("remove", el.id, thisInput);

        Filter.removeItemChild(el.id, thisInput);

        showEmptyTemplate        ();
        Filter.setStateToStorage ();
        setLogValue         ("success", "Поле удалено"); 

    }

    function addInput (){
    
        const idChild = createChildFields (el);
 
        hideSegmentBtn ("add", el.id, idChild);
        Action.showItem(segmentBtn);
        Filter.setStateToStorage();
    }


    if ( id === "add" ){
        addInput();
        Filter.enableSubmitButton();
        showTemplateInfo();
        
    } else if (id === "remove"){

        popupExec("Поле фильтра будет удалено").then(
            function(){
                removeInput ();
                Filter.enableSubmitButton();
                Action.hideItem(segmentBtn);
                showTemplateInfo();
                
            }
        );
    }
}


function returnThisInput(thisElem){
    const master    = thisElem.config.master;
    const index     = master.indexOf("_contextMenuFilter");
    const thisInput = master.slice(0, index);

    return thisInput;
}



function returnInputPosition(id, thisContainer){
    
    const parentInput  = $$(id + "_filter");
    const isVisibleParent = parentInput.isVisible();

    const item = Filter.getItem(id);

    let childPosition = 0;

    item.forEach(function(input, i){
        const inputContainer = input + "-container";

        if (inputContainer === thisContainer){
            childPosition = i + 1;
        }
    });

    if (!isVisibleParent){
        childPosition++;
    }

    return childPosition;
}



let thisInput;
let thisContainer;
let contextBtn_element;
 
function addChild(){
    const segmentBtn = $$(thisInput  + "_segmentBtn");

    const childPosition = returnInputPosition(
        contextBtn_element.id, 
        thisContainer
    );

    const idChild = createChildFields (contextBtn_element, childPosition);
    hideSegmentBtn  ("add", contextBtn_element.id, idChild);
    Action.showItem (segmentBtn);
    Filter.setStateToStorage();
}


function removeInput(){
    hideSegmentBtn           ("remove", contextBtn_element.id    ,thisInput);
    Filter.removeItemChild   (contextBtn_element.id, thisInput);
    Action.removeItem        ( $$(thisContainer));
    showEmptyTemplate        ();
    Filter.setStateToStorage ();
    setLogValue              ("success", "Поле удалено"); 
}


function clickContextBtnChild(id, el, thisElem){

    contextBtn_element       = el;
    thisInput     = returnThisInput(thisElem);
    thisContainer = thisInput + "-container";


    if ( id == "add" ){

        addChild();
        Filter.enableSubmitButton();
        showTemplateInfo();
     
    } else if (id === "remove"){
     
        popupExec("Поле фильтра будет удалено").then(
            function(res){
  
                if(res){
                    removeInput();
                    Filter.enableSubmitButton();
                    showTemplateInfo();
                }

            }
        );
    }
}



function returnActions(){
    const actions = [
        {   id      : "add",   
            value   : "Добавить поле", 
            icon    : "icon-plus",
        },
        {   id      : "remove", 
            value   : "Удалить поле", 
            icon    : "icon-trash"
        }
    ];


    return actions;
}

function createContextBtn (el, id, isChild){
  
    const popup = {
        view: 'contextmenu',
        css :"webix_contextmenu",
        data: returnActions(),
        on  :{
            onMenuItemClick:function(idClick){
                if (isChild){
                    clickContextBtnChild (idClick, el, this);
                } else {
                    clickContextBtnParent(idClick, el); 
                }
                
               
            },
         
        }
    };

    const contextBtn = new buttons_Button({
    
        config   : {
            id       :  id + "_contextMenuFilter",
            icon     : 'wxi-dots',
            width    : 40,
            inputHeight:38,
            popup       : popup,
        },
        titleAttribute : "Добавить/удалить поле",
        css            : "webix_filterBtns",
    
       
    }).minView();


    return contextBtn;       
}



;// CONCATENATED MODULE: ./src/js/components/table/filterForm/createElements/buttons/operationBtn.js







const operationBtn_logNameFile = "tableFilter => createElement => buttons => operationBtn";

 


function filterOperationsBtnLogic (idBtn, id){
  
    const btnFilterOperations = $$(idBtn);
    let operation;

    id === "notEqual" ? operation = "!="
    : id === "less"     ? operation = "<"
    : id === "more"     ? operation = ">"
    : id === "mrEqual"  ? operation = ">="
    : id === "lsEqual"  ? operation = "<="
    : id === "contains" ? operation = "⊆"
    : operation = "=";

    try {
        btnFilterOperations.setValue(operation);

    } catch (err){
        errors_setFunctionError(
            err,
            operationBtn_logNameFile,
            "filterOperationsBtnLogic"
        );
    }



}
function addOperation (self, value, id){
    self.add( { 
        value: value,       
        id   : id      
    });
}

function addDefaultOperations(self){
    addOperation (self, '='       , "eql"     );
    addOperation (self, '!='      , "notEqual");
    
}

function addMoreLessOperations(self){
    addOperation (self, '< ' , "less"    );
    addOperation (self, '> ' , "more"    );
    addOperation (self, '>=' , "mrEqual" );
    addOperation (self, '<=' , "lsEqual" );  
}

function filterOperationsBtnData (typeField){

    return webix.once(function(){

        if (typeField == "combo" || typeField == "boolean" ){
            addDefaultOperations(this);

        } else if (typeField  == "text" ){
            addDefaultOperations(this);
            addOperation (this, "содержит", "contains");

        } else if (typeField  == "date"){
            addDefaultOperations  (this);
            addMoreLessOperations (this);

        } else if (typeField  == "integer"   ){
            addDefaultOperations  (this);
            addMoreLessOperations (this);
            addOperation (this, "содержит", "contains");

        }   
    });
}


function createOperationBtn(typeField, elemId){
    const popup = {
        view  : 'contextmenu',
        width : 100,
        data  : [],
        on    : {
            onMenuItemClick(id) {
                filterOperationsBtnLogic (idBtnOperation, id);
            },
            onAfterLoad: filterOperationsBtnData(typeField)
           
        }
    };
    
    const idBtnOperation = elemId + "-btnFilterOperations";

    const btn = new buttons_Button({
    
        config   : {
            id       : idBtnOperation,
            value    : "=", 
            width    : 40,
            popup    : popup,
            inputHeight:38,
            on:{
                onChange:function(value){
                    
                    if (value == "contains"){
                        this.setValue("⊆");
                    }
                  
                    if (Filter.getActiveTemplate()){
                        Action.showItem($$("templateInfo"));
                    }
                    
                    Filter.setStateToStorage();
                }
            }
        },
        titleAttribute : "Выбрать условие поиска по полю",
        css            : "webix_filterBtns",
    
       
    }).maxView();
    
    return btn;
}


;// CONCATENATED MODULE: ./src/js/components/table/filterForm/createElements/buttons/_layoutBtns.js



function createBtns(element, typeField, isChild, uniqueId = null){

    let id;
    let hideAttribute = false;

    if (isChild){
        id =  element.id + "_filter-child-" + uniqueId;
    } else {
        id =  element.id + "_filter";
        hideAttribute = true;
    }

    return {
        id      : id + "_container-btns",
        hidden  : hideAttribute,
        css     : {"margin-top" : "22px!important"},
        cols    : [
            createOperationBtn (typeField, id, isChild),
            createContextBtn   (element,   id, isChild) 
        ]
    };
}


;// CONCATENATED MODULE: ./src/js/components/table/filterForm/createElements/segmentBtn.js




function segmentBtn_segmentBtn(element, isChild, uniqueId){
    let id;
    let hideAttribute = false;

    const idEl = element.id + "_filter";

    if (isChild){
        id = idEl + "-child-" + uniqueId;
    } else {
        id            = idEl;
        hideAttribute = true;
    }

    return {
        view    : "segmented", 
        id      : id + "_segmentBtn",
        hidden  : hideAttribute,
        value   : 1, 
        options : [
            { "id" : "1", "value" : "и" }, 
            { "id" : "2", "value" : "или" }, 
        ],
        on:{
            onChange:function(){
                Filter.setStateToStorage();
                if (Filter.getActiveTemplate()){
                    Action.showItem($$("templateInfo"));
                }
            }
        }
    };
}


;// CONCATENATED MODULE: ./src/js/components/table/filterForm/createElements/childFilter.js






let childFilter_element;
let elemId;
let childFilter_uniqueId;
let position;
let childFilter_typeField;

function returnArrPosition(){
    let arrPosition = position;
    const isInputVisible = $$(elemId + "_filter").isVisible();

    if (!isInputVisible){
        arrPosition = position - 1;
    } 

    return arrPosition;
}


function addInputToStorage(id){
    const arrPosition = returnArrPosition();
    Filter.spliceChild (elemId, arrPosition, id);
}

function setClearStorage(){
    const item = Filter.getItem (elemId);

    if ( !item ){
        Filter.clearItem (elemId);
    }

}

function returnBtns(input){
    const btns = [
       
        {   id      : webix.uid(),
            height  : 105,
            rows    : [
              
                {cols : [
                   input,              
                    createBtns(
                        childFilter_element, 
                        childFilter_typeField, 
                        true, 
                        childFilter_uniqueId
                    ) 
                ]},

                segmentBtn_segmentBtn(
                    childFilter_element, 
                    true, 
                    childFilter_uniqueId
                ),  
            ]
        }
    ];

    return btns

}

function addInputToContainer(btns){
    const containerRows = $$(elemId + "_filter_rows");
    const idContainer   = 
    elemId + "_filter-child-" + childFilter_uniqueId + "-container";

 
    containerRows.addView(
        {   id          : idContainer,
            padding     : 5,
            positionElem: position,
            rows        : btns
        }, position
    ); 
}

function addInput(){
   
    setClearStorage();

    const input = field_field (
        childFilter_uniqueId, 
        childFilter_typeField, 
        childFilter_element
    );

    addInputToStorage      (input.id);

    const btns = returnBtns(input);

    addInputToContainer    (btns);
}


function getTypeField(el){
    if (el.type !== "boolean"){
        childFilter_typeField = el.editor;
    } else {
        childFilter_typeField = "boolean";
    }
}


function getPosition(customPosition){
    if (customPosition == undefined){
        position = 1;
    } else {
        position = customPosition;
    }
}


function getIdCreatedField(){
    const  idCreateField = elemId + "_filter-child-" + childFilter_uniqueId;
    return idCreateField;
}

function createChildFields (el, customPosition) {
  
    childFilter_element  = el;
    elemId   = el.id;
    childFilter_uniqueId = webix.uid();

 
   
    getPosition (customPosition);
    getTypeField(el);

    addInput    ();

    return getIdCreatedField();
}


;// CONCATENATED MODULE: ./src/js/components/table/filterForm/userTemplate.js







const userTemplate_logNameFile     = "tableFilter => userTemplate";


function setValue(el, value){
    if (value){
        el.setValue(value);
    }
}

function setBtnsValue(el){
        
    const id = el.id;
    const segmentBtn    = $$(id + "_segmentBtn");
    const operationsBtn = $$(id + "-btnFilterOperations");

    setValue(segmentBtn   , el.logic    );
    setValue(operationsBtn, el.operation);
    
}

function showParentField (el){
    const idEl      = el.id;
    const element   = $$(idEl);
    const htmlClass = element.config.columnName;
    Filter.setFieldState(1, htmlClass, idEl);

    setBtnsValue(el);
    setValue    (element, el.value);
}

function createChildField(el){
    const table = getTable();
    const col   = table.getColumnConfig(el.parent);
 
    const idField = createChildFields  (col, el.index);

    const values  = el;
    values.id     = idField;
  
    setBtnsValue(values);

    setValue    ($$(idField), el.value);


}


function userTemplate_returnLastItem(array){
    const indexes       = Filter.getIndexFilters();
    const selectIndexes = [];

    if (array){

        array.forEach(function(el){
            selectIndexes.push(indexes[el]);
        });

 
        let lastIndex = 0;

        for (let i = 0; i < selectIndexes.length; i++){

            if (selectIndexes[i] > lastIndex) {
                lastIndex = selectIndexes[i];
            }
        }

        const keys = Object.keys(indexes);

        const lastInput = 
        keys.find(key => indexes[key] === lastIndex);

  
        return lastInput;
    }

}

function returnLastChild(item){
    return item[item.length - 1];
}

function userTemplate_hideSegmentBtn(){
    const lastCollection = userTemplate_returnLastItem  (Filter.getItems());
    const lastInput      = returnLastChild (Filter.getItem(lastCollection));
    const segmentBtn     = $$(lastInput + "_segmentBtn");

    Action.hideItem(segmentBtn);
}


function createWorkspace(prefs){
    
    Filter.clearFilter();

 
    prefs.forEach(function(el){
        if (!el.parent){
            showParentField  (el);
        } else {
            createChildField(el);
        }
   
    });

    userTemplate_hideSegmentBtn();

}


function createFiltersByTemplate(data) {
    const currId     = getItemId ();

    data             = data.json().content;

    const lib        = $$("filterEditLib");
    const libValue   = lib.getValue ();
    const radioValue = lib.getOption(libValue);
 
    try{
        data.forEach(function (el){
            const value = radioValue.value;

            const name = 
            currId + "_filter-template_" + value;
      
            if (el.name == name){
                const prefs = JSON.parse(el.prefs);
                createWorkspace(prefs.values);

                Action.destructItem($$("popupFilterEdit"));
                Filter.setActiveTemplate(radioValue);
            }

        });
    } catch(err){
        errors_setFunctionError(
            err, 
            userTemplate_logNameFile, 
            "createFiltersByTemplate"
        );
    }
}


function showHtmlContainers(){
    const keys = Filter.getItems();

    keys.forEach(function(el){
        const htmlElement = document.querySelector("." + el ); 
        Filter.addClass   (htmlElement, "webix_show-content");
        Filter.removeClass(htmlElement, "webix_hide-content");
    });

    Filter.hideInputsContainers(keys); // hidden inputs
}



function getLibraryData(){

    const userprefsData = webix.ajax("/init/default/api/userprefs/");

    userprefsData.then(function(data){
        createFiltersByTemplate  (data);
        showHtmlContainers       ();
        Filter.setStateToStorage ();
        Filter.enableSubmitButton();
        Action.hideItem($$("templateInfo"));
        setLogValue(
            "success", 
            "Рабочая область фильтра обновлена"
        );

    });

    userprefsData.fail(function(err){
        setAjaxError(
            err, 
            userTemplate_logNameFile, 
            "getLibraryData"
        );
    });

}


;// CONCATENATED MODULE: ./src/js/components/table/createSpace/returnLostFilter.js
 




function isDataExists(data){
    if (data && data.values.values.length){
        return true;
    }
}


function hideHtmlContainers(){
    const container = $$("inputsFilter").getChildViews();

    container.forEach(function(el){

        const node = el.getNode();

        const isShowContainer = node.classList.contains("webix_show-content");
        if (!isShowContainer){
            Filter.addClass(node, "webix_hide-content");
        }
       
    });

}

function returnLostFilter(id){
    const url       = window.location.search;
    const params    = new URLSearchParams(url);
    const viewParam = params.get("view"); 

    


    if (viewParam == "filter"){
        const data = webix.storage.local.get("currFilterState");

        Action.hideItem($$("table-editForm"));

        $$("table-filterId").callEvent("clickEvent", [ "" ]);

        if (data){
      
            const activeTemplate = data.activeTemplate;
            Filter.setActiveTemplate(activeTemplate); // option in popup library
        
          
            if (isDataExists(data) && id == data.id){
 
                createWorkspace(data.values.values);
         
                hideHtmlContainers();

                Filter.enableSubmitButton();
        
            }

            if (activeTemplate){
                Action.hideItem($$("templateInfo"));
            }

            Filter.setStateToStorage();
   
        }
    }



}


;// CONCATENATED MODULE: ./src/js/components/table/createSpace/returnDashboardFilter.js






let conditions;

function returnInputId(id){
    const index = id.lastIndexOf(".");
    return id.slice(index + 1);
}

function returnDashboardFilter_setOperation(id, value){
    if (value){
        const operationBtn = $$(id + "-btnFilterOperations");
        operationBtn.setValue(value);  
    }
   
}

function setSegmentBtn(id, value){
    if (value && value == "or"){
        const segmentBtn = $$(id + "_segmentBtn");
        const orId       = 2;
        segmentBtn.setValue(orId);  
    }
}

function setInputValue(id, value){
    if (value){
        const trueValue = value.replace(/['"]+/g, '');
        $$(id).setValue(trueValue);
    }
  
}

function returnDashboardFilter_setBtnsValue(id, array){
    returnDashboardFilter_setOperation (id, array[2]); // array[2] - operation
    setInputValue(id, array[3]); // array[2] - value
    setSegmentBtn(id, array[4]); // array[4] - and/or
}


function checkCondition(array){
    const id = returnInputId(array[1]); //[1] - id

    let inputId       = id + "_filter"; 
    const parentInput = $$(inputId);


    if (!parentInput.isVisible()){
        Filter.setFieldState(1, id);

    } else {
        const table = getTable();
        const col   = table.getColumnConfig(id);
        inputId     = createChildFields(col);

    }

    returnDashboardFilter_setBtnsValue(inputId, array);

}
   
// array[1] - id
// array[2] - operation   -- setValue
// array[3] - value  
// array[4] - and/or
function returInputsId(ids){
    const result = [];
    ids.forEach(function(el, i){
        const index = el.lastIndexOf(".") + 1;
        result.push(el.slice(index));
    });
    
    
    return result;
}


function iterateConditions(){
    const ids = [];
    conditions.forEach(function(el){
        const arr = el.split(' ');
        checkCondition(arr);
        ids.push(arr[1]);
     
    });
    
    const inputsId = returInputsId(ids);
    Filter.hideInputsContainers(inputsId);
}


function returnConditions(filter){
    const array = filter.split(' ');

    const conditions = [];
    let r            = "";
    let counter      = 0;

    array.forEach(function(el, i){
        const length = array.length;

        if (length - 1 === i){
            r += " " + el;
            counter ++;
        }

        if (counter >= 4 || length - 1 === i){
            conditions.push(r);
            r       = "";
            counter = 0;
        }

        if (counter < 4){
            r += " " + el;
            counter ++;
        }

        
    });
   

    return conditions;
}

function inputIsVisible(inputs, el){
    return inputs.find(
        element => element == el
    );
} 

function lastItem(result){
    return Math.max.apply(Math, result);
}

function returnCurrIndexes(indexes){
 
    const inputs  = Filter.getItems();
    const result = [];
    Object.keys(indexes).forEach(function(el){

        if (inputIsVisible(inputs, el)){
            result.push(indexes[el]);
        }
      
    });

    return result;

}


function findLastCollection(indexes, item){
    let lastItemId;

    Object.values(indexes).find(function(el, i){

        if(el == item) {

            lastItemId = Object.keys(indexes)[i]
        }
    });

    return lastItemId;
}

function findLastId(lastItemId){
    const collection = Filter.getItem (lastItemId);

    const index  = collection.length - 1;
    return collection[index];
}

function hideLastSegmentBtn(){
    const indexes     = Filter.getIndexFilters();

    const currIndexes = returnCurrIndexes (indexes);

    const item        = lastItem          (currIndexes);
    const lastItemId  = findLastCollection(indexes, item);
    const lastId      = findLastId        (lastItemId);

    Action.hideItem($$(lastId + "_segmentBtn"));

}

function returnDashboardFilter(filter){
    Filter.clearFilter();
    Filter.clearAll();

    conditions = returnConditions(filter);
    iterateConditions();
    hideLastSegmentBtn();

    Action.enableItem($$("btnFilterSubmit"));

    Filter.setStateToStorage();
}


;// CONCATENATED MODULE: ./src/js/components/table/createSpace/rows/loadRows.js
















const loadRows_logNameFile = "table => createSpace => loadData";


let idCurrTable;
let offsetParam;
let itemTreeId;

let idFindElem;

let firstError = false;
function setTableState(table){
     
    if (table == "table"){
        Action.enableItem($$("table-newAddBtnId"));
        Action.enableItem($$("table-filterId"));
        Action.enableItem($$("table-exportBtn"));
    }

}

function enableVisibleBtn(){
    const viewBtn =  $$("table-view-visibleCols");
    const btn     =  $$("table-visibleCols");
  
    if ( viewBtn.isVisible() ){
        Action.enableItem(viewBtn);

    } else if ( btn.isVisible() ){
        Action.enableItem(btn);

    }
  
}

 
let loadRows_idCurrView;


function checkNotUnique(idAddRow){    
    const tablePool = loadRows_idCurrView.data.pull;
    const values    = Object.values(tablePool);
    
    values.forEach(function(el){
        if ( el.id == idAddRow ){
            loadRows_idCurrView.remove(el.id);
        }
    });
}


function changeFullTable(data){
    const overlay = "Ничего не найдено";
    if (data.length !== 0){
        loadRows_idCurrView.hideOverlay(overlay);
        loadRows_idCurrView.parse      (data);

    } else {
        loadRows_idCurrView.showOverlay(overlay);
        loadRows_idCurrView.clearAll   ();
    }

    setTimeout(() => {
        enableVisibleBtn();
    }, 1000);
}

function changePart(data){
    data.forEach(function(el){
        checkNotUnique(el.id);
        loadRows_idCurrView.add(el);
    });
}

function parseRowData (data){

    loadRows_idCurrView = $$(idCurrTable);
   
    if (!offsetParam){
        loadRows_idCurrView.clearAll();
    }

    formattingBoolVals (loadRows_idCurrView, data);
    formattingDateVals (loadRows_idCurrView, data);
    setDefaultValues   (data);
 
 
    if ( !offsetParam ){
        changeFullTable(data);
    } else {
        changePart     (data);
    }
  
}


function setCounterVal (data, idTable){
    const table = $$(idTable)
    try{
        const prevCountRows = {full : data, visible : table.count()};
        $$(idFindElem).setValues(JSON.stringify(prevCountRows));
  
    } catch (err){
        errors_setFunctionError(
            err, 
            loadRows_logNameFile, 
            "setCounterVal"
        );
    }
}


function loadRows_getLinkParams(param){
    const  params = new URLSearchParams (window.location.search);
    return params.get(param);
}

function filterParam(){
    const  value = loadRows_getLinkParams("prefs");
    return value;
}


async function returnFilter(tableElem){
    const filterString = tableElem.config.filter;
    const urlParameter = filterParam();

    const result = {
        prefs : true
    };

    if (urlParameter){
        result.filter = await getUserPrefsContext(urlParameter, "filter");
        Filter.showApplyNotify();
    }

    if (!result.filter){
        result.prefs = false;
        if (filterString && filterString.table === itemTreeId){
            result.filter = filterString.query;

        } else {
            result.filter = itemTreeId +'.id+%3E%3D+0';
          
        }
    }

    return result;
}


function returnSort(tableElem){
    let sort;

    const firstCol = tableElem.getColumns()[0].id;
    const sortCol  = tableElem.config.sort.idCol;
    const sortType = tableElem.config.sort.type;
   
    if (sortCol){
        if (sortType == "desc"){
            sort = "~" + itemTreeId + '.' + sortCol;
        } else {
            sort = itemTreeId + '.' + sortCol;
        }
        tableElem.markSorting(sortCol, sortType);
    } else {
        sort = itemTreeId + '.' + firstCol;
        tableElem.markSorting(firstCol, "asc");
    }


    return sort;
}


function returnPath(tableElem, query){
    const tableType = tableElem.config.id;
    let path;
     
    if (tableType == "table"){
        path = "/init/default/api/smarts?"+ query.join("&");
    } else {
        path = "/init/default/api/" + itemTreeId;
    }

    return path;
}

function setConfigTable(tableElem, data, limitLoad){

    const tableType = tableElem.config.id;

    if ( !offsetParam && tableType == "table" ){
        tableElem.config.reccount  = data.reccount;
        tableElem.config.idTable   = itemTreeId;
        tableElem.config.limitLoad = limitLoad;
      //  setCounterVal (data.reccount.toString(), "table");
    }

    if( tableType == "table-view" ){
        tableElem.config.idTable   = itemTreeId;
        tableElem.config.reccount  = data.reccount;
       // setCounterVal (data.content.length.toString(), "table-view");
    }
}


function tableErrorState (){
  
    const prevCountRows = {full : "-"};
    const value         = prevCountRows.toString();
    try {
        $$(idCurrTable).showOverlay("Ничего не найдено");
        $$(idFindElem) .setValues  (JSON.stringify(value));
        
        Action.disableItem($$("table-newAddBtnId"));
        Action.disableItem($$("table-filterId"));
        Action.disableItem($$("table-exportBtn"));

    } catch (err){
        errors_setFunctionError(
            err, 
            loadRows_logNameFile, 
            "tableErrorState"
        );

    }
}


async function loadTableData(table, id, idsParam, offset){
    const tableElem = $$(table);
    const limitLoad = 80;

    idCurrTable = id;
    offsetParam = offset;      
    itemTreeId  = idsParam;

    idFindElem  = idCurrTable + "-findElements";

    const resultFilter = await returnFilter(tableElem);
    const isPrefs      = resultFilter.prefs;
    const filter       = resultFilter.filter;

    if (!offsetParam){
        returnSortData ();
    }


    const sort      = returnSort  (tableElem);

    const query = [ "query=" + filter, 
                    "sorts=" + sort, 
                    "limit=" + limitLoad, 
                    "offset="+ offsetParam
    ];

    tableElem.load({
        $proxy : true,
        load   : function(){
            
          
            const path      = returnPath (tableElem, query);
     
            const getData = webix.ajax().get( path );
      
    
            getData.then(function(data){
                data = data.json();

                const reccount = data.reccount;

                setConfigTable(tableElem, data, limitLoad);

                const type = data.err_type;
   
                if (type && type =="i" || !type){

              

                    data  = data.content;
    
                    // data = [
                    //     {
                    //         "created_on": "2022-11-23 17:33:03",
                    //         "id": 2,
                    //         "renew": true,
                    //         "service": "fffs",
                    //         "ticket": "ddddafa",
                    //         "user_id": 1,
                    //     },
                    //     {
                    //        // "created_on": "2021-02-13 20:33:03",
                    //         "id": 3,
                    //         "renew": true,
                    //         "service": "22233323",
                    //         "ticket": "fffffff",
                    //         "user_id": 2,
                    //     }
                    // ]
        
   
                    setTableState(table);
                    parseRowData (data);
            
                    if (!offsetParam){
                    
                        createContextSpace_selectContextId      ();  
                        returnLostData       ();
                        returnLostFilter     (itemTreeId);
                        if (isPrefs){
                            returnDashboardFilter(filter);
                        }
                    }
               
                    setCounterVal (reccount, tableElem);
                } else {
                    errors_setFunctionError(
                        data.err, 
                        "loadRows", 
                        "getData"
                    );
                    tableErrorState ();
                    
                }
            });
            
            getData.fail(function(err){
          
                tableErrorState ();

                if (err.status == 401 && !($$("popupNotAuth")) && !firstError){
                    firstError = true;
                    Backbone.history.navigate("/", { trigger:true});
                    window.location.reload();
                } 

                setAjaxError(err, "loadRows", "getData");
            });

        }
    });
}


;// CONCATENATED MODULE: ./src/js/components/table/createSpace/rows/createRows.js




let createRows_idCurrTable;
let createRows_offsetParam;
let createRows_itemTreeId;


function getItemData (table){

    const tableElem = $$(table);

    const reccount  = tableElem.config.reccount;

    if (reccount){
        const remainder = reccount - createRows_offsetParam;

        if (remainder > 0){
            loadTableData(table, createRows_idCurrTable, createRows_itemTreeId, createRows_offsetParam  ); 
        }

    } else {
        loadTableData(table, createRows_idCurrTable, createRows_itemTreeId, createRows_offsetParam ); 
    }

   
}

function setDataRows (type){
    if(type == "dbtable"){
        getItemData ("table");
    } else if (type == "tform"){
        getItemData ("table-view");
    }
}


function createTableRows (id, idsParam, offset = 0){

    const data  = GetFields.item(idsParam);

    createRows_idCurrTable = id;
    createRows_offsetParam = offset;      
    createRows_itemTreeId  = idsParam;

    setDataRows         (data.type);
    autorefresh_autorefresh         (data);
          
}


;// CONCATENATED MODULE: ./src/js/components/table/createSpace/cols/columnsWidth.js
let table; 
let columnsWidth_idsParam;
let storageData;


function setColsUserSize(){
    const sumWidth = [];
    storageData.values.forEach(function (el){
        sumWidth.push(el.width);
        table.setColumnWidth(el.column, el.width);
    }); 

    return sumWidth;  
}

function returnSumWidth(){
    let sumWidth;

    if ( storageData && storageData.values.length ){
        sumWidth = setColsUserSize();  
    }

    return sumWidth;
}

function returnCountCols(){
    let countCols;

    if(storageData && storageData.values.length){
        countCols  =  length;
    } else {
        const cols = table.getColumns(true);
        countCols  = cols .length;
    }
    return countCols;
}

function returnContainerWidth(){
    let containerWidth;

    containerWidth = window.innerWidth - $$("tree").$width - 25;

    return containerWidth;
}

function setColsSize(col){
    const countCols      = returnCountCols();
    const containerWidth = returnContainerWidth();

    const tableWidth     = containerWidth - 17;  
    const colWidth       = tableWidth / countCols;


    table.setColumnWidth(col, colWidth);
}


function findUniqueCols(col){
    let result = false;

    storageData.values.forEach(function(el){

        if (el.column == col){
            result = true;
        }

    });
    return result;
}


function getSumStorageColumns(){
    const sumWidth       = returnSumWidth();
    return sumWidth.reduce((a, b) => +a + +b, 0);
}

function getContainerWidth(){
    const tableWidth  = $$("tree").$width;
    const screenWidth = window.innerWidth;
    return screenWidth - tableWidth;
}

function getLastColumn(){
    const cols       = table.getColumns();
    const lastColId  = cols.length - 1;
    return cols[lastColId];
}


function setWidthLastCol(){
    const reduce         = getSumStorageColumns();
    const containerWidth = getContainerWidth();  

    if (reduce < containerWidth){
        const lastCol    = getLastColumn();
        const difference = containerWidth - reduce;
        const oldWidth   = lastCol.width;
        const newWidth   = oldWidth + difference;

        table.setColumnWidth(lastCol.id, newWidth);
        
    }

}



function setVisibleCols(allCols){

    allCols.forEach(function(el,i){

        if (findUniqueCols(el.id)){
            if( !( table.isColumnVisible(el.id) ) ){
                table.showColumn(el.id);
            }
        } else {
            const colIndex = table.getColumnIndex(el.id);
            if(table.isColumnVisible(el.id) && colIndex !== -1){
                table.hideColumn(el.id);
            }
        }
            
    });
}


function setPositionCols(){
    storageData.values.forEach(function(el){
        table.moveColumn(el.column,el.position);
            
    });
} 

function columnsWidth_setUserPrefs(idTable, ids){
    table       = idTable;
    columnsWidth_idsParam    = ids;

    const prefsName = "visibleColsPrefs_" + columnsWidth_idsParam;

    storageData   = webix.storage.local.get(prefsName);

    const allCols = table.getColumns       (true);
 
   
    if( storageData && storageData.values.length ){
        setVisibleCols (allCols);
        setPositionCols();
        setWidthLastCol();

    } else {   
   
        allCols.forEach(function(el){
            setColsSize(el.id);  
        });
       
    }

    
}


;// CONCATENATED MODULE: ./src/js/components/table/createSpace/cols/createCols.js








const createCols_logNameFile = "table => createSpace => cols => createCols";

let createCols_table;
let createCols_field;

function refreshCols(columnsData){
    if(createCols_table){
        createCols_table.refreshColumns(columnsData);
    }
}


function createReferenceCol (){
    try{
        
        const findTableId= createCols_field.type.slice(10);
        createCols_field.editor     = "combo";
        createCols_field.sort       = "int";
        createCols_field.collection = getComboOptions (findTableId);
        createCols_field.template   = function(obj, common, val, config){
            const itemId = obj[config.id];
            const item   = config.collection.getItem(itemId);
            return item ? item.value : "";
        };
    }catch (err){
        errors_setFunctionError(
            err, 
            createCols_logNameFile, 
            "createReferenceCol"
        );
    }
}

function createDatetimeCol  (){
    try{
        createCols_field.format = 
        webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
        createCols_field.editor = "date";
        createCols_field.sort   = "date";
        createCols_field.css    = {"text-align":"right"};
    }catch (err){
        errors_setFunctionError(
            err, 
            createCols_logNameFile, 
            "createDatetimeCol"
        );
    }
}

function createTextCol      (){
    try{
        createCols_field.editor = "text";
        createCols_field.sort   = "string";
    }catch (err){
        errors_setFunctionError(
            err,
            createCols_logNameFile,
            "createTextCol"
        );
    }
}

function createIntegerCol   (){
    try{
        createCols_field.editor         = "text";
        createCols_field.sort           = "int";
        createCols_field.numberFormat   = "1 111";
        createCols_field.css            = {"text-align":"right"};
        
    }catch (err){
        errors_setFunctionError(
            err,
            createCols_logNameFile,
            "createIntegerCol"
        );
    }
}
function createBoolCol      (){
    try{
        createCols_field.editor     = "combo";
        createCols_field.sort       = "text";
        createCols_field.collection = [
            {id : 1, value : "Да" },
            {id : 2, value : "Нет"}
        ];
    }catch (err){
        errors_setFunctionError(
            err,
            createCols_logNameFile,
            "createBoolCol"
        );
    }
}

function setIdCol       (data){
    createCols_field.id = data;
}

function setFillCol     (dataFields){
    const values      = Object.values(dataFields);
    const length      = values.length;
    const scrollWidth = 17;
    const containerWidth = $$("tableContainer").$width;
    const tableWidth  = containerWidth - scrollWidth;
    const colWidth    = tableWidth / length;

    createCols_field.width  = colWidth;
}


function setHeaderCol   (){
    createCols_field.header = createCols_field["label"];
}

function userPrefsId    (){
    const setting = 
    webix.storage.local.get("userprefsOtherForm");

    if( setting && setting.visibleIdOpt == "2" ){
        createCols_field.hidden = true;
    }
}  


function createCols_createField(type){

    if (type.includes("reference")){
        createReferenceCol();

    } else if ( type == "datetime"){
        createDatetimeCol ();

    } else if ( type == "boolean"){
        createBoolCol     ();

    } else if ( type == "integer" || 
                type == "id")
    {
        createIntegerCol  ();

    } else {
        createTextCol     ();
    }   
}

function createTableCols (idsParam, idCurrTable){
  
    const data          = GetFields.item(idsParam);
    const dataFields    = data.fields;
    const colsName      = Object.keys(data.fields);
    const columnsData   = [];
    
    createCols_table               = $$(idCurrTable);

    try{
        colsName.forEach(function(data) {
            createCols_field = dataFields[data]; 
         
            createCols_createField(createCols_field.type);

            setIdCol    (data);
            setFillCol  (dataFields);
            setHeaderCol();
            
            if(createCols_field.id == "id"){
                userPrefsId();
            }
           
            if (createCols_field.label){
                columnsData.push(createCols_field);
            }

        });

        refreshCols(columnsData);
        columnsWidth_setUserPrefs(createCols_table, idsParam);


    } catch (err){
        errors_setFunctionError(
            err, 
            createCols_logNameFile, 
            "createTableCols"
        );
    }


    return columnsData;
}


;// CONCATENATED MODULE: ./src/js/components/table/createSpace/cols/detailAction.js


function createDetailAction (columnsData, idsParam, idCurrTable){
    let idCol;
    let actionKey;
    let checkAction     = false;

    const data          = GetFields.item(idsParam);
    const table         = $$(idCurrTable);

    columnsData.forEach(function(field, i){
        if( field.type  == "action" && data.actions[field.id].rtype == "detail"){
            checkAction = true;
            idCol       = i;
            actionKey   = field.id;
        } 
    });
    
    if (actionKey !== undefined){
        const urlFieldAction = data.actions[actionKey].url;
    
        if (checkAction){
            const columns = table.config.columns;
            columns.splice(0, 0, { 
                id      : "action-first" + idCol, 
                maxWidth: 130, 
                src     : urlFieldAction, 
                css     : "action-column",
                label   : "Подробнее",
                header  : "Подробнее", 
                template: "<span class='webix_icon wxi-angle-down'></span> "
            });

            table.refreshColumns();
        }
    }


}


;// CONCATENATED MODULE: ./src/js/components/table/createSpace/cols/dynamicElements/buttonLogic.js



const buttonLogic_logNameFile = 
"table => createSpace => dynamicElements => buttonLogic";

let idElements;
let buttonLogic_url;
let verb;
let rtype;

const valuesArray = [];

function createQueryRefresh(){
    try{
        idElements.forEach((el) => {
            const val = $$(el.id).getValue();
            
            if (el.id.includes("customCombo")){
                const textVal = $$(el.id).getText();

                valuesArray.push (el.name + "=" + textVal);

            } else if ( el.id.includes("customInputs")     || 
                        el.id.includes("customDatepicker") )
            {
                valuesArray.push ( el.name + "=" + val );

            }   
        });
    } catch (err){  
        errors_setFunctionError(
            err, 
            buttonLogic_logNameFile, 
            "createQueryRefresh"
        );
    }
}

function buttonLogic_setTableState(tableView, data){
    const noneMsg = "Ничего не найдено";
    try{
        tableView.clearAll();
  
        if (data.length !== 0){
            tableView.hideOverlay(noneMsg);
            tableView.parse(data);
            setLogValue("success", "Данные обновлены");

        } else {
            tableView.showOverlay(noneMsg);

        }
    } catch (err){  
        errors_setFunctionError(
            err,
            buttonLogic_logNameFile,
            "setTableState"
        );
    }
}

function setTableCounter(tableView){
    try{
        const count = {full : tableView.count()};
        const findElementView = $$("table-view-findElements");
        const prevCountRows   = JSON.stringify(count);

        findElementView.setValues(prevCountRows);
    } catch (err){  
        errors_setFunctionError(
            err, 
            buttonLogic_logNameFile, 
            "setTableCounter"
        );
    }
}

function refreshButton(){
    createQueryRefresh();
    const path    = buttonLogic_url + "?" + valuesArray.join("&");
    const getData = webix.ajax(path);
    
    getData.then(function(data){
        const tableView = $$("table-view");
        data            = data.json().content;
  
        if (data.json().err_type == "i"){
            buttonLogic_setTableState   (tableView, data);
            setTableCounter (tableView);

        } else {
            errors_setFunctionError(
                data.err, 
                buttonLogic_logNameFile, 
                "refreshButton"
            );
        }
    });

    getData.fail(function(err){
        setAjaxError(
            err, 
            buttonLogic_logNameFile,
            "refreshButton"
        );
    });
}

function downloadButton(){

    webix.ajax().response("blob").get(buttonLogic_url, function(text, blob, xhr) {
        try {
            webix.html.download(blob, "table.docx");
        } catch (err){
            errors_setFunctionError(
                err, 
                buttonLogic_logNameFile, 
                "downloadButton"
            );
        } 
    }).catch(err => {
        setAjaxError(
            err, 
            buttonLogic_logNameFile, 
            "downloadButton"
        );
    });
}


async function uploadData(formData, link){
    fetch(link, {
        method  : "POST", 
        body    : formData
    })  

    .then(( response ) => response.json())
    .then(function( data ){
        const loadEl = $$("templateLoad");

        if ( data.err_type == "i" ){
            loadEl.setValues( "Файл загружен" );
            setLogValue(
                "success",
                "Файл успешно загружен"
            );

        } else {
            loadEl.setValues( "Ошибка" );
            setLogValue     ( "error", data.err );
        }
    })
    
    .catch(function(err){
        errors_setFunctionError(
            err, 
            buttonLogic_logNameFile, 
            "uploadData"
        );
    });

}

function addLoadEl(container){
    container.addView({
        id:"templateLoad",
        template: function(){
            const value      = $$("templateLoad").getValues();
            const valsLength = Object.keys( value ).length;

            if ( valsLength !==0 ){
                return value;
            } else {
                return "Загрузка ...";
            }
        },
        borderless:true,
    });
}

function postButton(){
    try{
   
        idElements.forEach((el,i) => {
            if (el.id.includes("customUploader")){
                const tablePull = $$(el.id).files.data.pull;
                const value     = Object.values(tablePull)[0];
                const link      = $$(el.id).config.upload;

                let formData = new FormData();  
                let container = $$(el.id).getParentView();
                addLoadEl(container);

                formData.append("file", value.file);

                uploadData(formData, link);
               
            }
        });
    } catch (err){  
        errors_setFunctionError(err, buttonLogic_logNameFile, "postButton");
    } 
}


function submitBtn (id, path, action, type){

    idElements = id;
    buttonLogic_url        = path;
    verb       = action;
    rtype      = type;

    valuesArray.length = 0;

    if (verb=="get"){ 
        if(rtype=="refresh"){
            refreshButton();
        } else if (rtype=="download"){
            downloadButton();
        } 
    } else if (verb=="post"){
        postButton();
    } 
    
}


;// CONCATENATED MODULE: ./src/js/components/table/createSpace/cols/dynamicElements/createInputs.js





const createInputs_logNameFile = "table => createSpace => dynamicElements => createInputs";

let data; 
let createInputs_idCurrTable;
let createInputs_field; 
let dataInputsArray;


function createInputs_setAdaptiveWidth(elem){

    const child       = elem.getNode().firstElementChild;
    child.style.width = elem.$width + "px";

    const inp         = elem.getInputNode();
    inp.style.width   = elem.$width - 5 + "px";
}

function createTextInput    (i){
    return {   
        view            : "text",
        placeholder     : createInputs_field.label, 
        id              : "customInputs" + i,
        height          : 48,
        labelPosition   : "top",
        on              : {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title", createInputs_field.comment);
                createInputs_setAdaptiveWidth(this);
            },
            onChange:function(){
                const inputs = $$("customInputs").getChildViews();

                inputs.forEach(function(el){
                    const view = el.config.view;
                    const btn  = $$(el.config.id);

                    if (view == "button"){
                        Action.enableItem(btn);
                    }
                });

            }
        }
    }
}

function getOptionData      (){
    const url = "/init/default/api/" + createInputs_field.apiname;

    return new webix.DataCollection({url:{
        $proxy:true,
        load: function(){
            return ( webix.ajax().get(url).then(function (data) {   
                    
                const dataSrc     = data.json().content;
                const dataOptions = [];
                let optionElement;

   

                function dataTemplate(i,valueElem){
                const template = { 
                        id    : i + 1, 
                        value : valueElem
                    };
                return template;
                }

      
                function createOptions(){
              
                    try{
                        dataSrc.forEach(function(data, i) {
                            const name = dataSrc[0].name;
                            const title = name ? name : data;
                            optionElement = dataTemplate(i, title);
                            dataOptions.push(optionElement); 
                        });
                
                    } catch (err){
                        errors_setFunctionError(
                            err,
                            createInputs_logNameFile,
                            "generateCustomInputs => getOptionData"
                        );
                    } 
                }

                createOptions();

                return dataOptions;

            }).catch(err => {
                console.log(err);
                setAjaxError(
                    err,
                    createInputs_logNameFile,
                    "generateCustomInputs => getOptionData"
                );
                
            }));
            
        
            
        }
    }});
}

function createSelectInput  (el, i){

    return   {   
        view          : "combo",
        height        : 48,
        id            : "customCombo" + i,
        placeholder   : createInputs_field.label, 
        labelPosition : "top", 
        options       : {
            data : getOptionData ( dataInputsArray, el )
        },
        on: {
            onAfterRender: function () {
                this.getInputNode()
                .setAttribute( "title", createInputs_field.comment );
                createInputs_setAdaptiveWidth(this);
            },
        }               
    };
}

function createDeleteAction (i){
    const table     = $$(createInputs_idCurrTable);
    const countCols = table.getColumns().length;
    const columns   = table.config.columns;

    try{
        columns.splice (countCols, 0 ,{ 
            id      : "action"+i, 
            header  : "Действие",
            label   : "Действие",
            css     : "action-column",
            template: "{common.trashIcon()}"
        });

        table.refreshColumns();

    } catch (err){
        errors_setFunctionError(
            err,
            createInputs_logNameFile,
            "generateCustomInputs => createDeleteAction"
        );
    } 

}

function getInputsId        (element){

    const parent     = element.getParentView();
    const childs     = parent .getChildViews();
    const idElements = [];

    try{
        childs.forEach((el,i) => {
            const view = el.config.view;
            const id   = el.config.id;
            if ( id !== undefined ){
                if ( view == "text" ){
                    idElements.push({
                        id  : id, 
                        name: "substr"
                    });

                } else if ( view == "combo"){
                    idElements.push({
                        id  : id, 
                        name: "valtype"
                    });
                } else if ( view == "uploader"    || 
                            view == "datepicker"  ){
                    idElements.push({ 
                        id : id 
                    });
                }
            }

        });
    } catch (err){
        errors_setFunctionError(
            err,
            createInputs_logNameFile,
            "generateCustomInputs => getInputsId"
        );
    } 
    return idElements;
}

function createDeleteBtn    (findAction,i){

    const btn = new buttons_Button({

        config   : {
            id       : "customBtnDel" + i,
            hotkey   : "Shift+Q",
            icon     : "icon-trash", 
            value    : createInputs_field.label,
            click    : function () {
                const idElements = getInputsId (this);
                submitBtn( idElements, findAction.url, "delete" );
            },
        },
        titleAttribute : createInputs_field.comment
    
       
    }).minView("delete");

    return btn;
}


function submitClick(findAction, i, id, elem){

    const idElements = getInputsId (elem);
    const btn        =  $$("contextActionsPopup");

    if (findAction.verb== "GET"){
        if ( findAction.rtype == "refresh") {
            submitBtn( 
                idElements, 
                findAction.url, 
                "get", 
                "refresh" 
            );

        } else if (findAction.rtype == "download") {
            submitBtn( 
                idElements, 
                findAction.url, 
                "get", 
                "download"
            );

        }
        
    } else if ( findAction.verb == "POST" ){
        submitBtn( 
            idElements, 
            findAction.url, 
            "post" 
        );
        $$("customBtn" + i ).disable();
    } 
    else if (findAction.verb == "download"){
        submitBtn( 
            idElements, 
            findAction.url, 
            "get", 
            "download", 
            id 
        );

    }
    Action.hideItem(btn);    
}

function createCustomBtn    (findAction, i){

    const btn = new buttons_Button({
        
        config   : {
            id       : "customBtn" + i,
            value    : createInputs_field.label,
            click    : function (id) {
                submitClick(findAction, i, id, this);
            },
        },
        titleAttribute : createInputs_field.comment,
        onFunc         : {
            onViewResize:function(){
                createInputs_setAdaptiveWidth(this);
            }
        }

    
    }).maxView("primary");

    return btn;
}

function createUpload       (i){
    return  {   
        view         : "uploader", 
        value        : "Upload file", 
        id           : "customUploader" + i,
        height       : 42,
        autosend     : false,
        upload       : data.actions.submit.url,
        label        : createInputs_field.label, 
        labelPosition: "top",
        on: {
            onAfterRender: function () {
                this.getInputNode().setAttribute( "title", createInputs_field.comment );
                createInputs_setAdaptiveWidth(this);
                const parent = this  .getParentView();
                const childs = parent.getChildViews();

                childs.forEach(function(el,i){
                    if (el.config.id.includes("customBtn")){
                        el.disable();
                    }
                });
            },
            onBeforeFileAdd:function(){
                const loadEl = $$("templateLoad");
                if (loadEl){
                    loadEl.getParentView().removeView(loadEl);
                }
            },
            onAfterFileAdd:function(file){
                const parent = this  .getParentView();
                const childs = parent.getChildViews();

                childs.forEach(function(el){
                    if (el.config.id.includes("customBtn")){
                        el.enable();
                    }
                });
            }

        }
    };
}

function createInputs_createDatepicker   (i){
    return {   
        view         : "datepicker",
        format       : "%d.%m.%Y %H:%i:%s",
        placeholder  : createInputs_field.label,  
        id           :"customDatepicker"+i, 
        timepicker   : true,
        labelPosition:"top",
        height       :48,
        on           : {
            onAfterRender: function () {
                this.getInputNode().setAttribute( "title", createInputs_field.comment );
                createInputs_setAdaptiveWidth(this);
            },
            onChange:function(){
                try{
                    const inputs = $$("customInputs").getChildViews();
                    inputs.forEach(function(el,i){
                        const btn  = $$(el.config.id);
                        const view = el.config.view;
                        if ( view == "button" && !(btn.isEnabled()) ){
                            btn.enable();
                        }
                    });
                } catch (err){
                    errors_setFunctionError(
                        err,
                        createInputs_logNameFile,
                        "generateCustomInputs => createDatepicker onChange"
                    );
                } 

            }
        }
    };
}

function createCheckbox     (i){
    return {   
        view       : "checkbox", 
        id         : "customСheckbox" + i, 
        css        : "webix_checkbox-style",
        labelRight : createInputs_field.label, 
        on         : {
            onAfterRender: function () {
                this.getInputNode()
                .setAttribute("title", createInputs_field.comment);
            },

            onChange:function(){
                try{
                    const inputs = $$("customInputs").getChildViews();
                    inputs.forEach(function(el,i){
                        const view = el.config.view;
                        const btn  = $$(el.config.id);
                        if (view == "button" && !(btn.isEnabled())){
                            btn.enable();
                        }
                    });
                } catch (err){
                    errors_setFunctionError(
                        err,
                        createInputs_logNameFile,
                        "generateCustomInputs => createCheckbox onChange"
                    );
                } 
            }
        }
    };
}

function generateCustomInputs (dataFields, id){  
    createInputs_idCurrTable = id;
    data        = dataFields;  

    dataInputsArray     = data.inputs;

    const customInputs  = [];
    const objInuts      = Object.keys(data.inputs);

    objInuts.forEach((el,i) => {
        createInputs_field = dataInputsArray[el];
        if ( createInputs_field.type == "string" ){
            customInputs.push(
                createTextInput(i)
            );
        } else if ( createInputs_field.type == "apiselect" ) {
           
            customInputs.push(
                createSelectInput(el, i, dataInputsArray)
            );

        } else if ( createInputs_field.type == "submit" || 
                    createInputs_field.type == "button" ){

            const actionType = createInputs_field.action;
            const findAction = data.actions[actionType];
        
            if ( findAction.verb == "DELETE" && actionType !== "submit" ){
                createDeleteAction (i);
            } else if ( findAction.verb == "DELETE" ) {
                customInputs.push(
                    createDeleteBtn(findAction, i)
                );
            } else {
                customInputs.push(
                    createCustomBtn(findAction, i)
                        
                );
            }
        } else if ( createInputs_field.type == "upload" ){
            customInputs.push(
                createUpload(i)
            );
        } else if ( createInputs_field.type == "datetime" ){
            customInputs.push(
                createInputs_createDatepicker(i)
            );
        }else if ( createInputs_field.type == "checkbox" ){
            customInputs.push(
                createCheckbox(i)
            );

        } 
    });


    return customInputs;
}


;// CONCATENATED MODULE: ./src/js/components/table/createSpace/cols/dynamicElements/createElements.js









const createElements_logNameFile = "table => createSpace => dynamicElements => createElements";

let createElements_data; 
let createElements_idCurrTable;
let createElements_idsParam;

let btnClass;
let formResizer;
let tools;

let secondaryBtnClass = "webix-transparent-btn";
let primaryBtnClass   = "webix-transparent-btn--primary";


function maxInputsSize (customInputs){

    const inpObj = {
        id      : "customInputs",
        css     : "webix_custom-inp", 
        rows    : [
            { height : 20 },
            { rows   : customInputs }
        ],
    };

       
    try{
        $$("viewToolsContainer").addView(inpObj, 0);
    
    } catch (err){
        errors_setFunctionError(err, createElements_logNameFile, "maxInputsSize");
    } 
    

}

function toolMinAdaptive(){
    Action.hideItem($$("formsContainer"));
    Action.hideItem($$("tree"));
    Action.showItem($$("table-backFormsBtnFilter"));
    Action.hideItem(formResizer);

    tools.config.width = window.innerWidth - 45;
    tools.resize();
}


function toolMaxAdaptive(){
    const formsTools = $$("viewTools");

    btnClass = document.querySelector(".webix_btn-filter");
    
    if (btnClass.classList.contains(primaryBtnClass)){

        btnClass.classList.add   (secondaryBtnClass);
        btnClass.classList.remove(primaryBtnClass);
        Action.hideItem(tools);
        Action.hideItem(formResizer);
        

    } else if (btnClass.classList.contains(secondaryBtnClass)){

        btnClass.classList.add   (primaryBtnClass);
        btnClass.classList.remove(secondaryBtnClass);
        Action.showItem(tools);
        Action.showItem(formResizer);
        Action.showItem(formsTools);
    }
}

function setStateTool(){

   
    formResizer         = $$("formsTools-resizer");
    const contaierWidth = $$("container").$width;

    if(!(btnClass.classList.contains(secondaryBtnClass))){
   
        if (contaierWidth < 850  ){
            Action.hideItem($$("tree"));
            if (contaierWidth  < 850 ){
                toolMinAdaptive();
            }
        } else {
     
            Action.hideItem($$("table-backFormsBtnFilter"));
            tools.config.width = 350;
            tools.resize();
        }
        Action.showItem(formResizer);

    } else {
        Action.hideItem(tools);
        Action.hideItem(formResizer);
        Action.hideItem($$("table-backFormsBtnFilter"));
        Action.showItem($$("formsContainer"));
    }
}

function viewToolsBtnClick(){

    Action.hideItem($$("propTableView"));

    toolMaxAdaptive();

    setStateTool   ();

}

function adaptiveCustomInputs (){
    
    Action.removeItem($$("contextActionsBtn"));

    const viewToolsBtn  = $$("viewToolsBtn");
    tools               = $$("formsTools");

    if (createElements_data.inputs){  
   
        const customInputs  = generateCustomInputs (createElements_data, createElements_idCurrTable);
        const filterBar     = $$("table-view-filterId").getParentView();

        const btnTools = new buttons_Button({
            config   : {
                id       : "viewToolsBtn",
                hotkey   : "Ctrl+Shift+G",
                icon     : "icon-filter",
                click    : function(){
                    viewToolsBtnClick();
                },
            },
            css            :  "webix_btn-filter",
            titleAttribute : "Показать/скрыть фильтры доступные дейсвтия"
        
           
        }).transparentView();

        
        if( !viewToolsBtn ){
            filterBar.addView( btnTools, 2 );
        } else {
            Action.showItem  (viewToolsBtn);
        }

        maxInputsSize  ( customInputs );

    } else {
        Action.hideItem(tools);
        Action.hideItem(viewToolsBtn);
      
    }
}

function createElements_createDynamicElems (id, ids){
    createElements_idCurrTable = id;
    createElements_idsParam    = ids;
    createElements_data        = GetFields.item(createElements_idsParam);  
 
    adaptiveCustomInputs ();

}


;// CONCATENATED MODULE: ./src/js/components/table/createSpace/generateTable.js












const generateTable_logNameFile = "getContent => getInfoTable";

let titem;
let generateTable_idsParam;
let generateTable_idCurrTable;

function setTableName(idCurrTable, idsParam) {
  
    try{
        const names = GetFields.names;

        if (names){

            names.forEach(function(el){
                if (el.id == idsParam){  
                    const template  = $$(idCurrTable + "-templateHeadline");
                    const value     = el.name.toString();
                    template.setValues(value);
                }
            });
        }
       // $$("tree").callEvent("onBeforeOpen", [ "","auth_group" ]);

        
    } catch (err){  
        errors_setFunctionError(err, generateTable_logNameFile, "setTableName");
    }
} 


function getValsTable (){
    titem     = $$("tree").getItem(generateTable_idsParam);

    if (!titem){
        titem = generateTable_idsParam;
    }
}


function preparationTable (){
    try{
        $$(generateTable_idCurrTable).clearAll();

        if (generateTable_idCurrTable == "table-view"){
            const popup       = $$("contextActionsPopup");
            
            if (popup){
                popup.destructor();
            }

            Action.removeItem($$("contextActionsBtnAdaptive"));
            Action.removeItem($$("customInputs"             ));
            Action.removeItem($$("customInputsMain"         ));

        
        }
    } catch (err){  
        errors_setFunctionError(err, generateTable_logNameFile, "preparationTable");
    }
}


function setTabInfo(data){
    const info = mediator.tabs.getInfo();
    if (info && info.tree){
        info.tree.data = data;
    }

    mediator.tabs.setInfo(info);

    console.log(mediator.tabs.getInfo());
}
async function generateTable (){ 

    await LoadServerData.content("fields");
    setTabInfo(GetFields.item(generateTable_idsParam));

    const keys = GetFields.keys;

    if (keys){
        const columnsData = createTableCols (generateTable_idsParam, generateTable_idCurrTable);

        createDetailAction  (columnsData, generateTable_idsParam, generateTable_idCurrTable);

        createElements_createDynamicElems  (generateTable_idCurrTable, generateTable_idsParam);

        createTableRows     (generateTable_idCurrTable, generateTable_idsParam);
       
        setTableName        (generateTable_idCurrTable, generateTable_idsParam);
    }
   
} 


function createTable (id, ids) {
  
    generateTable_idCurrTable = id;
    generateTable_idsParam    = ids;

    getValsTable ();
   
    if (titem == undefined) {
        setLogValue("error","Данные не найдены");
    } else {
        preparationTable ();
        generateTable ();
    } 

 

}


;// CONCATENATED MODULE: ./src/js/components/table/btnsInTable.js






const btnsInTable_logNameFile = "table => btnsIntable";

function trashBtn(config,idTable){
    function delElem(){
 
        const table      = $$(idTable);
        const formValues = table.getItem(config.row);
        const itemTreeId = getItemId ();
        const url        = "/init/default/api/" + itemTreeId + "/" + formValues.name + ".json" ;
 
        const delData    = webix.ajax().del(url, formValues);

        delData.then(function(data){
            data = data.json();
            if (data.err_type == "i"){
                try {
                    const selectEl = table.getSelectedId();
                    table.remove(selectEl);
                } catch (err){
                    errors_setFunctionError(
                        err,
                        btnsInTable_logNameFile,
                        "wxi-trash => delData"
                    );
                }
                setLogValue("success", "Данные успешно удалены");
            } else {
                setLogValue("error", data.err);
            }
        });

        delData.fail(function(err){
            setAjaxError(
                err, 
                btnsInTable_logNameFile,
                "wxi-trash => delElem"
            );
        });
    }

  
    popupExec("Запись будет удалена").then(function(res){

        if (res){
            delElem();
        }
  
    });
}



function hideViewTools(){
    const btnClass          = document.querySelector(".webix_btn-filter");
    const primaryBtnClass   = "webix-transparent-btn--primary";
    const secondaryBtnClass = "webix-transparent-btn";

    Action.hideItem($$("formsTools"));

    if (btnClass.classList.contains(primaryBtnClass)){
        btnClass.classList.add   (secondaryBtnClass);
        btnClass.classList.remove(primaryBtnClass);
    }
}

function createUrl(cell){
    let url;
    try{
        const id      = cell.row;
        const columns = $$("table-view").getColumns();


        columns.forEach(function(el,i){
            if (el.id == cell.column){
                url           = el.src;
                let urlArgEnd = url.search("{");
                url           = url.slice(0,urlArgEnd) + id + ".json"; 
            }
        });  
    } catch (err){
        errors_setFunctionError(err, btnsInTable_logNameFile, "createUrl");
    }
    return url;
}


function setProps(propertyElem, data){
    const arrayProperty = [];

    try{
        data.forEach(function(el, i){
            arrayProperty.push({
                type    : "text", 
                id      : i+1,
                label   : el.name, 
                value   : el.value
            });
        });

        propertyElem.define("elements", arrayProperty);
    } catch (err){
        errors_setFunctionError(
            err, 
            btnsInTable_logNameFile, 
            "setProps"
        );
    }
}


function initSpace(propertyElem){
    hideViewTools();
    Action.showItem(propertyElem);
}


function resizeProp(propertyElem){
    try{
        if (propertyElem.config.width < 200){
            propertyElem.config.width = 200;
            propertyElem.resize();
        }
    } catch (err){
        errors_setFunctionError(
            err,
            btnsInTable_logNameFile,
            "resizeProp"
        );
    }
}


function getProp(propertyElem, cell){
    const url       = createUrl(cell);
    const getData   = webix.ajax(url);

    getData.then(function(data){

        data = data.json().content;

        if (data.length){
            setProps    (propertyElem, data);
            initSpace   (propertyElem);
            resizeProp  (propertyElem);

        } else {
            errors_setFunctionError(
                "Данные отсутствуют", 
                btnsInTable_logNameFile, 
                "getProp"
            );
        }
       

    });

    getData.fail(function(err){
        setAjaxError(
            err, 
            btnsInTable_logNameFile,
            "getProp"
        );
    });
}


function showPropBtn (cell){
    const propertyElem = $$("propTableView");
    const isVisible    = propertyElem.isVisible();

    if (!isVisible){
        getProp        (propertyElem, cell);
    } else {
        Action.hideItem(propertyElem);
    }
}


;// CONCATENATED MODULE: ./src/js/components/table/columnsSettings/userprefsPost.js






const userprefsPost_logNameFile = "table => columnsSettings => visibleCols => userprefsPost";

function setUpdateCols(sentVals){
    const table   = getTable();
    const columns = table.getColumns(true);
    
    function findUniqueCols(col){
        let result = false;

        sentVals.values.forEach(function(el){
            if (el.column == col){
                result = true;
            }
            
        });

        return result;
    }

    function setVisibleState(){
        try{
            columns.forEach(function(el,i){
                
                if (findUniqueCols(el.id)){
                    if( !( table.isColumnVisible(el.id) ) ){
                        table.showColumn(el.id);
                    }
                 
                } else {
                    const colIndex = table.getColumnIndex(el.id);
                    if(table.isColumnVisible(el.id) && colIndex !== -1){
                        table.hideColumn(el.id);
                    }
                }
            });

 
        } catch(err){
            errors_setFunctionError(
                err,
                userprefsPost_logNameFile,
                "setUpdateCols => setVisibleState"
            );
        }
    }

    function moveListItem(){
        sentVals.values.forEach(function(el){
            table.moveColumn(el.column, el.position);
        });  
    }

    setVisibleState ();
    moveListItem    ();

}


function setSize(sentVals){
    const table = getTable();
    function setColWidth(el){
        table.eachColumn( 
            function (columnId){ 
                if (el.column == columnId){
                    table.setColumnWidth(columnId,el.width);
                }
            },true
        );
    }

    sentVals.values.forEach(function(el,i){

        setColWidth(el);
    });
}

async function postPrefsValues(values, visCol = false){

    let userData = getUserDataStorage();
    
    if (!userData){
        await pushUserDataStorage();
        userData = getUserDataStorage();
    }
   
    const id            = getItemId();
    const sentVals      = {
        values       : values, 
        tableIdPrefs : id
    };

    const sentObj = {
        name  : "visibleColsPrefs_" + id,
        owner : userData.id,
        prefs : sentVals,
    };

    function saveExistsTemplate(sentObj,idPutData){
        const url     = "/init/default/api/userprefs/"+idPutData;
        const putData = webix.ajax().put(url, sentObj);

        putData.then(function(data){
            data = data.json();
             
            if (data.err_type !== "i"){
                setLogValue("error","toolbarTable function saveExistsTemplate putData: "+ data.err);
            } else {
                setLogValue   ("success","Рабочая область таблицы обновлена");
                setStorageData("visibleColsPrefs_"+id, JSON.stringify(sentObj.prefs));
                setUpdateCols (sentVals);

                if (visCol){
                    setSize(sentVals);
                }
        
              
            }

           
        });

        putData.fail(function(err){
            setAjaxError(
                err, 
                userprefsPost_logNameFile,
                "saveExistsTemplate => putUserprefsData"
            );
        });

        Action.destructItem($$("popupVisibleCols"));
    } 

    function saveNewTemplate(){
      
        const url     = "/init/default/api/userprefs/";
        
        const userprefsPost = webix.ajax().post(url, sentObj);
        
        userprefsPost.then(function(data){
            data = data.json();
 
            if (data.err_type !== "i"){
                errors_setFunctionError(
                    data.err,
                    userprefsPost_logNameFile,
                    "saveNewTemplate"
                );
            } else {
                setLogValue   ("success", "Рабочая область таблицы обновлена");
                setStorageData("visibleColsPrefs_" + id, JSON.stringify(sentObj.prefs));
                setUpdateCols (sentVals);
            }
        });

        userprefsPost.fail(function(err){
            setAjaxError(err, userprefsPost_logNameFile,"saveTemplate");
        });

        Action.destructItem($$("popupVisibleCols"));
    }

    function getUserprefsData(){
      
        const getData = webix.ajax().get("/init/default/api/userprefs");
        let settingExists = false;
        let idPutData;
    
        getData.then(function(data){
            data = data.json().content;
            try{
                data.forEach(function(el){
                    
                    if (el.name == "visibleColsPrefs_" + id && !settingExists){
                        idPutData = el.id
                        settingExists = true;
                
                    }
                });
            } catch (err){
                errors_setFunctionError(
                    err,
                    userprefsPost_logNameFile,
                    "getUserprefsData getData"
                );
            }
        });

        getData.then(function(){
     
            if (!settingExists){
                saveNewTemplate();
            } else {
                saveExistsTemplate(sentObj,idPutData);
            }
        });


        getData.fail(function(err){
            setAjaxError(err, userprefsPost_logNameFile,"getUserprefsData");
        });

        return settingExists;

    }
    getUserprefsData();

}



;// CONCATENATED MODULE: ./src/js/components/table/columnsSettings/visibleCols/clearBtn.js







let clearBtn_table;
let values;
const clearBtn_logNameFile = "table => columnsSettings => visibleCols => clearBtn";


function returnContainer(){
    const tableId = getTable().config.id;
    if (tableId == "table"){
        return $$("tableContainer");
    } else if (tableId == "table-view"){
        return $$("formsContainer");
    }
    
}

function clearBtn_setColsSize(col, listItems){
    const container  = returnContainer();

    const table      = getTable();
    const countCols  = listItems.length;
    const scroll     = 17;
    const tableWidth = container.$width - scroll;
    const colWidth   = tableWidth / countCols;
    table.setColumnWidth(col, colWidth);
    table.setColumnWidth("action0", 400);
}


function returnWidthCol(){
    const scrollSpace    = 77;
    const treeWidth      = $$("tree").$width;
    const containerWidth = window.innerWidth - treeWidth - scrollSpace; 
    const cols           = clearBtn_table.getColumns(true).length;
    const colWidth       = containerWidth / cols;

    return colWidth.toFixed(2);
}

function returnPosition(column){
    let position;
    const pull = clearBtn_table.data.pull[1];
   
    if (pull){
        const defaultColsPosition = Object.keys(pull);
        
        defaultColsPosition.forEach(function(el, i){
            if (el == column){
                position = i;
            }
        });

    }

    return position;
}

function showCols(){
    const cols = clearBtn_table.getColumns(true);
    try{
        cols.forEach(function(el,i){
            const colWidth    = returnWidthCol();
            const positionCol = returnPosition(el.id);

            clearBtn_setColsSize(el.id,cols);
            
            if( !( clearBtn_table.isColumnVisible(el.id) ) ){
                clearBtn_table.showColumn(el.id);
            }
       
            clearBtn_table.setColumnWidth(el.id, colWidth);

            values.push({
                column   : el.id,
                position : positionCol,
                width    : colWidth 
            });
        });
    } catch(err){
        errors_setFunctionError(
            err,
            clearBtn_logNameFile,
            "clearBtnColsClick => showCols"
        );
    }
}

function clearBtnColsClick (){
    clearBtn_table        = getTable();

    values = [];

    modalBox("Будут установлены стандартные настройки", 
            "Вы уверены?", 
            ["Отмена", "Сохранить изменения"]
    )
    .then(function(result){

        if (result == 1){
            showCols();
            postPrefsValues(values);
            Action.destructItem($$("popupVisibleCols"));
            setLogValue (
                "success",
                "Рабочая область таблицы обновлена"
            );
        }
    });
}

function returnClearBtn(){
    const clearBtn = new buttons_Button({

        config   : {
            id       : "clearBtnCols",
            hotkey   : "Alt+Shift+R",
            icon     : "icon-trash",
     
            click    : function(){
                clearBtnColsClick();
            },
        },
        css            : "webix-trash-btn-color",
        titleAttribute : "Установить стандартные настройки"
       
    }).transparentView();

    return clearBtn;
}



;// CONCATENATED MODULE: ./src/js/components/table/columnsSettings/visibleCols/moveBtns.js


function setBtnSubmitState(state){
    const btnSubmit  = $$("visibleColsSubmit");
    const check      = btnSubmit.isEnabled();

    if (state == "enable" && !(check) ){
        btnSubmit.enable();
    } else if ( state == "disable" && check ){
        btnSubmit.disable();
    }
}

function createMsg(){
    if(!($$("visibleColsMsg")) ){
        webix.message({
            id:"visibleColsMsg",
            type:"debug", 
            text:"Элемент не выбран",
        });
    }
}


function colsMove(action){
    const list        = $$("visibleListSelected");
    const listElement = list.getSelectedId();

    if( listElement ){
        if (action == "up"){
            list.moveUp(listElement,1);
            setBtnSubmitState("enable");
        } else if (action == "down"){
            list.moveDown(listElement,1);
            setBtnSubmitState("enable");
        }   
    } else {
        createMsg();
    }
}


function returnMoveBtns(){

    const moveUpBtn = new buttons_Button({

        config   : {
            id       : "moveSelctedUp",
            hotkey   : "Shift+U",
            icon     : "icon-arrow-up",
            click   : function(){
                colsMove("up");
            },
        },

        titleAttribute : "Поднять выбраную колонку вверх"
       
    }).transparentView(); 

    const moveDownBtn = new buttons_Button({

        config   : {
            id       : "moveSelctedDown",
            hotkey   : "Shift+W",
            icon     : "icon-arrow-down",
            click   : function(){
                colsMove("down");
            },
        },

        titleAttribute : "Опустить выбраную колонку вниз"
       
    }).transparentView(); 

    const moveSelcted =  {
        cols : [
            moveUpBtn,
            moveDownBtn,
            {},
        ]
    };

    return moveSelcted;
}



;// CONCATENATED MODULE: ./src/js/components/table/columnsSettings/visibleCols/serachInput.js




const serachInput_logNameFile = "table => columnsSettings => visibleCols => searchInput";

function searchColsListPress (){
    const list       = $$("visibleList");
    const search     = $$("searchColsList");
    const value      = search.getValue().toLowerCase();
    const emptyTempl = $$("visibleColsEmptyTempalte");
    let counter      = 0;
    try{
    
        list.filter(function(obj){
            const condition = obj.label.toLowerCase().indexOf(value) !== -1;

            if (condition){
                counter ++;
            }
    
            return condition;
        });

        if (counter == 0){
            Action.showItem(emptyTempl);
        } else {
            Action.hideItem(emptyTempl);
        }
      
    } catch(err){
        errors_setFunctionError(
            err,
            serachInput_logNameFile,
            "searchColsListPress"
        );
    }

}



function returnSearch(){
    const search = {   
        view        : "search", 
        id          : "searchColsList",
        placeholder : "Поиск (Alt+Shift+F)", 
        css         : "searchTable",
        height      : 42, 
        hotkey      : "alt+shift+f", 
        on          : {
            onTimedKeyPress : function(){
                searchColsListPress();
            }
        }
    };

    return search;
}


;// CONCATENATED MODULE: ./src/js/components/table/columnsSettings/visibleCols/listMoveBtns.js



function listMoveBtns_createMsg(){
    if(!($$("visibleColsMsg")) ){
        webix.message({
            id:"visibleColsMsg",
            type:"debug", 
            text:"Элемент не выбран",
        });
    }
}


let list;
let listSelect;

function findPullLength(listName){
    return Object.keys(listName.data.pull).length;
}

function listActions(type){

    const currList  = 
    type == "available" ? list       : listSelect;

    const otherList = 
    type == "available" ? listSelect : list;

    const btn = $$("visibleColsSubmit");
    
    const selectedItem  = currList.getSelectedItem();
    const selectedId    = currList.getSelectedId  ();

    if (selectedItem){
   
        otherList.add   (selectedItem);
        currList .remove(selectedId);

        if (type == "available"){
            const pullLength = findPullLength(otherList);
            if (!pullLength){
                Action.disableItem(btn);
            } else {
                Action.enableItem (btn); 
            }
        } else {
            const pullLength = findPullLength(currList);
            if (!pullLength){
                Action.disableItem(btn);
            }
        }

    } else {
        listMoveBtns_createMsg();
    }
}


function colsPopupSelect(action){
    list                  = $$("visibleList");
    listSelect            = $$("visibleListSelected");

    if ( action == "add"){
        listActions("available");

    } else if ( action == "remove" ){
        listActions("selected");

    }

}

function returnListBtns(){
    const addColsBtn = new buttons_Button({

        config   : {
            id       : "addColsBtn",
            hotkey   : "Shift+A",
            icon     : "icon-arrow-right",
            disabled : true,
            click    : function(){
                colsPopupSelect("add");
            },
        },
        titleAttribute : "Добавить выбранные колонки"
       
    }).transparentView();

    const removeColsBtn = new buttons_Button({

        config   : {
            id       : "removeColsBtn",
            hotkey   : "Shift+D",
            icon     : "icon-arrow-left",
            disabled : true,
            click    : function(){
                colsPopupSelect("remove");
            },
        },
        titleAttribute : "Убрать выбранные колонки"
       
    }).transparentView();

    const moveBtns = {
        rows:[
            addColsBtn,
            removeColsBtn,
        ]
    };

    return moveBtns;
}


;// CONCATENATED MODULE: ./src/js/components/table/columnsSettings/visibleCols/saveBtn.js





const saveBtn_logNameFile = "table => columnsSettings => visibleCols => saveBtn";

function visibleColsSubmitClick (){

    const list      = $$("visibleListSelected");
    const listPull  = list.data.pull;
    const listItems = Object.values(listPull);
    const values    = [];
    const table     = getTable();

    const containerWidth = window.innerWidth - $$("tree").$width - 77; 

    function returnMinSize(){
        const allCols = table.getColumns(true).length;
        const width  = containerWidth / allCols;

        return width.toFixed(2);
    }

    function setLastColWidth(lastColumn,widthCols){
        const sumWidth       = widthCols.reduce((a, b) => a + b, 0);


        let widthLastCol   =  containerWidth - sumWidth;

        if (widthLastCol < 50){
            widthLastCol = returnMinSize();
        }

        lastColumn.width = Number(widthLastCol);

        values.push(lastColumn); 
    }


    try{
        const widthCols = [];
        const lastColumn = {};
 
        
        listItems.forEach(function(el,i){
            const positionElem = list.getIndexById(el.id);
            const lastCol      = list.getLastId();
         
            let colWidth;

            if ( el.id !== lastCol){
                colWidth = table.getColumnConfig(el.column).width;
              
                if ( colWidth >= containerWidth ){
                    colWidth = returnMinSize();
                }
            
                widthCols.push(colWidth);
           
                values.push({
                    column   : el.column, 
                    position : positionElem,
                    width    : Number(colWidth)
                });
            } else {
                lastColumn.column   = el.column;
                lastColumn.position = positionElem;
            } 
 
      

        });
        setLastColWidth(lastColumn,widthCols);

    } catch (err){
        errors_setFunctionError(
            err, 
            saveBtn_logNameFile, 
            "visibleColsSubmitClick"
        );
    }

    postPrefsValues(values,true);

}

function returnSaveBtn(){
    const btnSaveState = new buttons_Button({

        config   : {
            id       : "visibleColsSubmit",
            hotkey   : "Shift+S",
            disabled : true,
            value    : "Сохранить состояние", 
            click    : function(){
                visibleColsSubmitClick();
            },
        },
        titleAttribute : "Изменить отображение колонок в таблице"
    
       
    }).maxView("primary");

    return btnSaveState;
}



;// CONCATENATED MODULE: ./src/js/viewTemplates/emptyTemplate.js

function createEmptyTemplate(text, id){
    const formEmptyTemplate = {   
        css         : "webix_empty-template",
        template    : text,
        borderless  : true,
        height      : 47
    };

    if (id){
        formEmptyTemplate.id = id;
    }

    return formEmptyTemplate;
     
}


;// CONCATENATED MODULE: ./src/js/components/table/columnsSettings/visibleCols/createLists.js




function generateEmptyTemplate(id, text){

    const layout = {
        css:"list-filter-empty",
        rows:[
            createEmptyTemplate(text, id)
        ]
    };

    return  layout;
}

function selectPrevItem(self, id){
    
    const prevItem =  self.getNextId(id);
    if(prevItem){
        self.select(prevItem);
    }
}

function hideEmptyTemplate(self, id){
    const pullLength = Object.keys(self.data.pull).length;
    if (!pullLength){
        Action.showItem($$(id));
    }
}
function returnAvailableList(){
    const emptyElId = "visibleColsEmptyTempalte";
    const scrollView = [
        {   template    : "Доступные колонки", 
            css         : "list-filter-headline",
            height      : 25, 
            borderless  : true
        },
        generateEmptyTemplate(
            emptyElId,
            "Нет доступных колонок"
        ),

        {
            view      : "list", 
            id        : "visibleList",
            template  : "#label#",
            select    : true,
            css       : "list-filter-borders",
            borderless: true,
            data      : [],
            on        : {
                onAfterAdd:function(){
                    Action.enableItem($$("addColsBtn"));
                    Action.hideItem  ($$(emptyElId));
                },
                onAfterDelete:function(id){
                    hideEmptyTemplate(this, emptyElId);
                    selectPrevItem   (this, id);
                },
            }
        }
        
    ];

    return scrollView;
}


function returnSelectedList(){
    const emptyElId = "visibleColsEmptyTempalteSelected";
    const scrollViewSelected = [
        {   template    : "Выбранные колонки",
            css         : "list-filter-headline",
            height      : 25, 
            borderless  : true,
         
        },
        generateEmptyTemplate(
            emptyElId,
            "Выберите колонки из доступных"
        ),

        {
            view      : "list", 
            id        : "visibleListSelected",
            template  : "#label#",
            css       : "list-filter-borders",
            select    : true,
            borderless: true,
            data      : [],
            on        : {
                onAfterAdd : function(){
                    Action.enableItem($$("removeColsBtn"));
                    Action.hideItem  ($$(emptyElId));
                },
                onAfterDelete : function(id){
                    hideEmptyTemplate(this, emptyElId);
                    selectPrevItem   (this, id);
                },
            
            }
        }

    ];

    return scrollViewSelected;
}


;// CONCATENATED MODULE: ./src/js/components/table/columnsSettings/visibleCols/_layout.js









function genetateScrollView(idCheckboxes, inner){
    return {
        view        : "scrollview",
        css         : "webix_multivew-cell",
        borderless  : true,
        scroll      : false,
        body        : { 
            id  : idCheckboxes,
            rows: inner
        }
    };
}

function returnContent(){
    const content = { 
        cols:[
            {   
                rows:[
                    returnSearch(),

                    genetateScrollView(
                        "listContent",
                        returnAvailableList()
                    ),
                ]
            },

            {width:10},
            { rows:[
                {height:45},
                {},
                returnListBtns(),
                {}
            ]},
            {width:10},

            { rows:[
            
                {cols:[
                    returnMoveBtns(),
                    returnClearBtn(),
                ]},
                genetateScrollView(
                    "listSelectedContent",
                    returnSelectedList()
                ),
            ]},
        ]
    };

    return content;
}


function createPopup(){
       
    const popup = new popup_Popup({
        headline : "Видимость колонок",
        config   : {
            id          : "popupVisibleCols",
            width       : 600,
            maxHeight   : 400,
        },
     

        elements : {
            rows:[
                returnContent(),

                {height:20},

                returnSaveBtn(),
            ]
          
        }
    });

    popup.createView ();
}


;// CONCATENATED MODULE: ./src/js/components/table/toolbar/visibleColsBtn.js






const visibleColsBtn_logNameFile = "table => toolbar => visibleColsBtn";

function visibleColsBtn_createSpace(){
    const table    = getTable();
    const list     = $$("visibleList");
    const listPull = Object.values(list.data.pull);
    const cols     = table.getColumns(); 
    
    function findRemoveEl(elem){
        let check = false;

        cols.forEach(function(item,i){
            
            if (elem == item.id){
                check = true;
            }

        });
        return check;
    }

    
    function removeListItem(){

        try{
            listPull.forEach(function(el){
            
                if (findRemoveEl(el.column)){
                list.remove(el.id);
                }

            });
        } catch (err){
            errors_setFunctionError(
                err,
                visibleColsBtn_logNameFile,
                "createSpace => removeListItem"
            );
        }  
    }

    function addListSelectedItem(){
        const viewList = $$("visibleListSelected");
        const emptyEl  = $$("visibleColsEmptyTempalteSelected");
        
        if (cols.length){
            Action.hideItem(emptyEl);
        }
        try{
            cols.forEach(function(col){
                viewList.add({
                    column  :col.id,
                    label   :col.label,
                });
            });
        } catch (err){
            errors_setFunctionError(
                err,
                visibleColsBtn_logNameFile,
                "createSpace => addListSelectedItem"
            );
        } 
    }

    if (listPull.length !== cols.length){
        removeListItem();
        addListSelectedItem();
    }


}


function createListItems(idTable){

    const currTable  = $$(idTable);
    let columns      = $$(idTable).getColumns(true);

    try{
        columns = currTable.getColumns(true);
        const sortCols = _.sortBy(columns, "label");

        sortCols.forEach(function(col){
            
            if(col.css !== "action-column" && !col.hiddenCustomAttr ){
                
                $$("visibleList").add({
                    column  :col.id,
                    label   :col.label,
                });
                
            }
            
        });

    } catch (err){
        errors_setFunctionError(
            err,
            visibleColsBtn_logNameFile,
            "getCheckboxArray"
        );
    }
    
}

function  visibleColsButtonClick(idTable){
    createPopup    ();
    createListItems(idTable);

    Action.hideItem($$("visibleColsEmptyTempalte"));
    Action.showItem($$("popupVisibleCols"));

    visibleColsBtn_createSpace    ();
}

function toolbarVisibleColsBtn(idTable){
    const idVisibleCols = idTable + "-visibleCols";

    const visibleCols = new buttons_Button({
    
        config   : {
            id       : idVisibleCols,
            hotkey   : "Ctrl+Shift+A",
            disabled : true,
            icon     : "icon-columns",
            click    : function(){
                visibleColsButtonClick(idTable);
            },
        },
        titleAttribute : "Показать/скрыть колонки"
    
       
    }).transparentView();

    return visibleCols;
}



;// CONCATENATED MODULE: ./src/js/components/table/filterForm/createElements/parentFilter.js









const parentFilter_logNameFile = "tableFilter => createElements => parentFilter";

let parentElement;
let viewPosition;

let inputTemplate;


function parentFilter_returnFilter(el){
 
    if (el.type == "datetime"){
        return [
            field_field(false, "date", el),
            createBtns(el, "date"),  
        ];

    } 
    else if (el.type.includes("reference")) {
        return [
            field_field(false, "combo", el),
            createBtns(el, "combo"), 
        ];
 
    } 
    else if (el.type.includes("boolean")) {
        return [
            field_field(false, "boolean", el),
            createBtns(el, "combo")
        ];
    
    } 
    else if (el.type.includes("integer")) {
        return [
            field_field(false, "integer", el),
            createBtns(el, "integer"), 
        ];
    }
    else{

        return [ 
            field_field(false, "text", el),
            createBtns(el, "text"), 
        ];
    }
}


function generateElements(){
    const inputsArray = [];
    const columnsData = $$("table").getColumns(true);
    try{
        columnsData.forEach((el) => {
            const id = el.id;

            const idFullContainer  = id + "_filter_rows";
            const idInnerContainer = id + "_filter-container";
            const cssContainer     = id + " webix_filter-inputs";
         
            const filter  =  {   
                id  : idFullContainer,
                idCol:id,
                css : cssContainer,
                rows: [
                    {   id      : idInnerContainer,
                        padding : 5,
                        rows    : [
                            
                            { cols: 
                                parentFilter_returnFilter(el),
                            },
                            segmentBtn_segmentBtn(el, false),
                            
                        ]
                    }
                ]
            };

            inputsArray.push (filter);

        });

        return inputsArray;
    } catch (err){ 
        errors_setFunctionError(
            err,
            parentFilter_logNameFile,
            "generateElements"
        );
    }

}

function parentFilter_createFilter(arr){

    const inputs = {
        margin  : 8,
        id      : "inputsFilter",
        css     : "webix_inputs-table-filter", 
        rows    : arr
    };

    return inputs;
}


function addInputs(inputs){

    const elem = $$(parentElement);
    
    try{
        if(elem){ 
            elem.addView(
                parentFilter_createFilter(inputs), 
                viewPosition
            );
        }
    } catch (err){ 
        errors_setFunctionError(
            err,
            parentFilter_logNameFile,
            "addInputs"
        );
    }
}

function clearFormValidation(){
    const elem = $$(parentElement);

    try{
        if(elem){
            elem.clear();
            elem.clearValidation();
        }
    } catch (err){ 
        errors_setFunctionError(
            err,
            parentFilter_logNameFile,
            "clearFormValidation"
        );
    }
}

// function enableDelBtn(){
//     const delBtn = $$("table-delBtnId");
//     try{
//         if(parentElement == "table-editForm" && delBtn ){
//             delBtn.enable();
//         }
//     } catch (err){ 
//         setFunctionError(err,logNameFile,"enableDelBtn");
//     }
// }

function createParentFilter (parentElem, positon = 1) {
    parentElement      = parentElem;
    viewPosition       = positon;

    const childs       = $$(parentElement).elements;
    const childsLength = Object.keys(childs).length;


    if(childsLength == 0 ){
        Action.removeItem($$("inputsFilter"));
        const inputs = generateElements();
        addInputs       (inputs);

    } else {
        clearFormValidation();
        Action.showItem($$("inputsFilter"));
    }

    //enableDelBtn();
    
}



;// CONCATENATED MODULE: ./src/js/components/table/filterForm/toolbarBtnClick.js




 


const toolbarBtnClick_primaryBtnClass   = "webix-transparent-btn--primary";
const toolbarBtnClick_secondaryBtnClass = "webix-transparent-btn";

function resizeContainer(width){
    const filterContainer = $$("filterTableBarContainer");

    filterContainer.config.width = width;
    filterContainer.resize();
}

function filterMinAdaptive(){
    Action.hideItem($$("tableContainer"));
    Action.hideItem($$("tree"));

    Action.showItem($$("table-backTableBtnFilter"));

    const emptySpace = 45;
    resizeContainer(window.innerWidth - emptySpace);

}

function setBtnCssState(btnClass, add, remove){
    Filter.addClass    (btnClass, add);
    Filter.removeClass (btnClass, remove);
}


let toolbarBtnClick_btnClass;

function setPrimaryState(filter){
    Action.hideItem ($$("table-editForm"));
    Action.showItem (filter);

    const isChildExists = filter.getChildViews();

    if(isChildExists){
        createParentFilter("filterTableForm", 3);
    }

    setBtnCssState(
        toolbarBtnClick_btnClass, 
        toolbarBtnClick_primaryBtnClass, 
        toolbarBtnClick_secondaryBtnClass
    );

    Action.showItem($$("filterTableBarContainer"));
}

function setSecondaryState(){
    setBtnCssState(
        toolbarBtnClick_btnClass, 
        toolbarBtnClick_secondaryBtnClass, 
        toolbarBtnClick_primaryBtnClass
    );
    Action.hideItem($$("filterTableForm"));
    Action.hideItem($$("filterTableBarContainer"));
}

function toolbarBtnLogic(filter){
    toolbarBtnClick_btnClass = document.querySelector(".webix_btn-filter");
    const isPrimaryClass = toolbarBtnClick_btnClass.classList.contains(toolbarBtnClick_primaryBtnClass);
   
    if(!isPrimaryClass){
        setPrimaryState(filter);
        mediator.linkParam(true, {"view": "filter"});
    } else {
        setSecondaryState();
        mediator.linkParam(false, "view");
    }
}     

function filterMaxAdaptive(filter, idTable){

    $$(idTable).clearSelection();

    toolbarBtnLogic(filter);
    //resizeContainer(350);
}


function toolbarBtnClick_filterBtnClick (idTable){
   
   // Filter.clearAll(); // clear inputs storage
  
    const filter    = $$("filterTableForm");
    const container = $$("container");

    filterMaxAdaptive(filter, idTable);

    const width    = container.$width;
    const minWidth = 850;

    if (width < minWidth){
        Action.hideItem($$("tree"));
  
        if (width < minWidth ){
            filterMinAdaptive();
        }

    } else {
        Action.hideItem($$("table-backTableBtnFilter"));
        filter.config.width = 350;
        filter.resize();
    }

 
   
}


;// CONCATENATED MODULE: ./src/js/components/table/toolbar/filterBtn.js



function toolbarFilterBtn(idTable, visible){
    let idBtnEdit = idTable + "-editTableBtnId",
        idFilter  = idTable + "-filterId"
    ;

    const btn = new buttons_Button({
        config   : {
            id       : idFilter,
            hotkey   : "Ctrl+Shift+F",
            disabled : true,
            hidden   : visible,
            icon     : "icon-filter",
            click    : function(){
                this.callEvent("clickEvent", [ "" ]);
            },
            on:{
                clickEvent:function(){
                    toolbarBtnClick_filterBtnClick(idTable, idBtnEdit);
                }
            }
        },
        css            : "webix_btn-filter",
        titleAttribute : "Показать/скрыть фильтры",
    
       
    }).transparentView();

    return btn;
}


;// CONCATENATED MODULE: ./src/js/components/table/toolbar/editFormBtn.js






 
const editFormBtn_logNameFile = "tableEditForm => toolbarBtn";

function editFormBtn_setSecondaryState(){
    const btnClass       = document.querySelector(".webix_btn-filter");
    const primaryClass   = "webix-transparent-btn--primary";
    const secondaryClass = "webix-transparent-btn";

    try{
        btnClass.classList.add   (secondaryClass);
        btnClass.classList.remove(primaryClass  );
    } catch (err) {   
        errors_setFunctionError(err, editFormBtn_logNameFile, "setSecondaryState");
    }
}

function isIdParamExists(){
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');
    if (idParam){
        return true;
    }
}

function editBtnClick() {

    const editForm  = $$("table-editForm");
    const backBtn   = $$("table-backTableBtn");
    const tree      = $$("tree");
    const container = $$("container");

    function maxView () {
        const editContainer   = $$("editTableBarContainer");
        const filterContainer = $$("filterTableBarContainer");
        const filterForm      = $$("filterTableForm");
       
        const isVisible       = editForm.isVisible();
    
        Action.hideItem   (filterContainer);
        Action.hideItem   (filterForm);
    
        editFormBtn_setSecondaryState ();

        if (editForm && isVisible){
        
            Action.hideItem   (editForm);
            Action.hideItem   (editContainer);
            mediator.linkParam(false, "view");
   
        } else if (editForm && !isVisible) {
            Action.showItem (editForm);
            Action.showItem (editContainer);

            Action.hideItem ($$("tablePropBtnsSpace"));

            if(!isIdParamExists()){
                mediator.linkParam(true, {"view": "edit"});
            }
        
        }

    }

    function minView () {
        const tableContainer = $$("tableContainer");
        Action.hideItem (tableContainer);
        Action.hideItem (tree);
        Action.showItem (backBtn);
        
        const padding = 45;
        editForm.config.width = window.innerWidth - padding;
        editForm.resize();

    }
    
    maxView ();

    if (container.$width < 850 ){
        Action.hideItem(tree);
 

        if (container.$width < 850 ){
            minView ();
        }
      
    } else {
        Action.hideItem(backBtn);
    }
}



function toolbarEditButton (idTable, visible){
    const idBtnEdit = idTable + "-editTableBtnId";

    function returnValue( empty = true ){
        const icon = "<span class='webix_icon icon-pencil btn-edit-icon-toolbar'></span>";
        const text = "<span style='padding-left: 5px; font-size:13px!important; margin-right: 11px;' >Редактор записи</span>";

        if (empty){
            return icon;
        } else {
            return icon + text;
        }
    }   

    const btn = new buttons_Button({
        config   : {
            id       : idBtnEdit,
            hotkey   : "Ctrl+Shift+X",
            value    : returnValue( false ),
            hidden   : visible,
            minWidth : 40,
            maxWidth : 200, 
            onlyIcon : false,
            click    : function(){
                this.callEvent("clickEvent", [ "" ]);
            },
            on:{
                clickEvent:function(){
                    editBtnClick(idBtnEdit);
                }
               
            }
        },
        css            : "edit-btn-icon",
        titleAttribute : "Показать/скрыть фильтры",
        adaptValue     : returnValue( ),
    
       
    }).maxView();

    return btn;

}


;// CONCATENATED MODULE: ./src/js/components/table/toolbar/exportBtn.js




function exportToExcel(idTable){
    try{
        webix.toExcel(idTable, {
            filename    : "Table",
            filterHTML  : true,
            styles      : true
        });
        setLogValue("success", "Таблица сохранена");

    } catch (err) {   
        errors_setFunctionError(err, "toolbarTable", "exportToExcel");
    }
}

function toolbarDownloadButton(idTable, visible){
    const idExport = idTable + "-exportBtn";

    const exportBtn = new buttons_Button({
    
        config   : {
            id       : idExport,
            hotkey   : "Ctrl+Shift+Y",
            hidden   : visible, 
            icon     : "icon-arrow-circle-down",
            click    : function(){
                exportToExcel(idTable);
            },
        },
        titleAttribute : "Экспорт таблицы"
    
       
    }).transparentView();
    
    return exportBtn;
}



;// CONCATENATED MODULE: ./src/js/components/table/toolbar/counter.js


function createTemplateCounter(idEl, text){
    const view = {   
        view    : "template",
        id      : idEl,
        css     : "webix_style-template-count",
        height  : 30,
        template: function () {

            const values = $$(idEl).getValues();
            const keys   = Object.keys(values);


            if (keys.length){
                const table = getTable();
              
                const obj = JSON.parse(values);

                const full    = obj.full    ? obj.full    : table.config.reccount;
                const visible = obj.visible ? obj.visible : table.count();

                const counter = visible +  " / " + full;

                return "<div style='color:#999898;'>" + 
                        text + ": " + counter + 
                        " </div>"
                ;
                
            } else {
                return "";
            }
        }
    };

    return view;
}


;// CONCATENATED MODULE: ./src/js/components/table/toolbar/applyFilterNotify.js
function applyNotify(id){
  
    return   {
        cols:[
            {
                template   : "Фильтры применены",
                id         : id + "_applyNotify",
                hidden     : true,
                css        : "applyNotify",
                inputHeigth: 20,
                width      : 160,
                borderless : true,    
            },
             {}
        ]
    };
}


;// CONCATENATED MODULE: ./src/js/components/table/toolbar/_layout.js









function tableToolbar (idTable, visible = false) {

    const idFindElements   = idTable + "-findElements",
         // idFilterElements = idTable + "-idFilterElements",
          idHeadline       = idTable + "-templateHeadline"
    ;

    return { 
        
        rows:[
            createHeadline(idHeadline),
            {
                css     : "webix_filterBar",
                id      : idTable + "_toolbarBtns",
                padding : {
                    bottom : 4,
                }, 
                height  : 40,
                cols    : [
                    toolbarFilterBtn      (idTable, visible),
                    toolbarEditButton     (idTable, visible),
                    applyNotify           (idTable),
                    {},
                    toolbarVisibleColsBtn (idTable),
                    toolbarDownloadButton (idTable, visible),
                ],
            },

            { cols : [
                createTemplateCounter (
                    idFindElements  , 
                    "Количество записей"  
                ),

                // createTemplateCounter (
                //     idFilterElements, 
                //     "Видимое количество записей"
                // ),
            ]},
        ]
    };
}


;// CONCATENATED MODULE: ./src/js/components/table/formTools/viewProperty.js
function propertyTemplate (idProp){
    return {
        view      : "property",  
        id        : idProp, 
        tooltip   : 
        "Имя: #label#<br> Значение: #value#",
        width     : 348,
        nameWidth : 150,
        editable  : true,
        scroll    : true,
        hidden    : true,
    };
}


;// CONCATENATED MODULE: ./src/js/components/table/formTools/viewTools.js

function setBtnFilterState(){
    const btnClass          = document.querySelector(".webix_btn-filter");
    const primaryBtnClass   = "webix-transparent-btn--primary";
    const secondaryBtnClass = "webix-transparent-btn";

    if (btnClass.classList.contains(primaryBtnClass  )){
        btnClass.classList.add   (secondaryBtnClass);
        btnClass.classList.remove(primaryBtnClass  );
    }
}

function defaultState(){
    const tools       = $$("formsTools");    
    const сontainer   = $$("formsContainer");
    const formResizer = $$("formsTools-resizer");
    
    if ( tools && tools.isVisible() ){
        tools.hide();
        formResizer.hide();
    }

    if ( сontainer && !(сontainer.isVisible()) ){
        сontainer.show();
    }
}

function backFilterBtnClick (){
    defaultState();
    setBtnFilterState();
}

const filterBackTableBtn = { 
    view    : "button", 
    id      : "table-backFormsBtnFilter",
    type    : "icon",
    icon    : "icon-arrow-right",
    value   : "Вернуться к таблице",
    height  : 28,
    minWidth: 50,
    width   : 55,
   
    click   : function(){
        backFilterBtnClick();
    },

    on: {
        onAfterRender: function () {
            this.getInputNode()
            .setAttribute("title", "Вернуться к таблице");
        }
    } 
};

const viewTools = {
    id       : "viewTools",
    padding  : 10,
    rows     : [
       {cols : [

            {  
                template   : "Действия",
                height     : 30, 
                css        : "popup_headline",
                borderless : true,
            },
            {},
            filterBackTableBtn
        ]},
   
        {
            id   : "viewToolsContainer", 
            rows : [
                {}
            ]
        }
    ]
};


;// CONCATENATED MODULE: ./src/js/components/table/editForm/property.js



const property_logNameFile = "tableEditForm => property";

function editingEnd (editor, value){

    try{
        const property = $$("editTableFormProperty");
        const item     = property.getItem(editor);
        item.value     = value;

        property.updateItem(editor);

    } catch (err){
        errors_setFunctionError(
            err, 
            property_logNameFile, 
            "editingEnd"
        );
    }
}

function propTooltipAction (obj){
   
    const label      = obj.label;
    const labelText  = "Название: " + label + " <br>";
    const formatData = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
    let value;
    let typeElem;
    
    if        ( obj.type       == "date" ){
        typeElem = "Выберите дату";

    } else if ( obj.type       == "combo" ){
        typeElem = "Выберите значение";
        const node     = $$("editTableFormProperty").getItemNode(obj.id);

        if (node){
            const valueCss = "webix_property_value";
            const valueDiv = node.getElementsByClassName(valueCss)[0];
            const text     = valueDiv.innerHTML;
            obj.value      = text ? text : obj.value;
        }

    } else if ( obj.customType == "integer" ){
        typeElem = "Введите число";

    } else {
        typeElem = "Введите текст";
    } 
    
    if (obj.type == "date"){
        value = formatData(obj.value);  
    } else {
        value = obj.value;
    }

    if (obj.value){
        return labelText + "Значение: " + value;
    } else {
        return labelText + typeElem;
    }
}


function property_createTemplate (){
    document.getElementById('custom-date-editor')
    .addEventListener('input', function (e) {

        const x = e.target.value.replace(/\D/g, '')
        .match(/(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})/);

        function setNum(index){
            return (x[index] ? x[index] : ' __ ');
        }

        if (e.inputType !== "deleteContentBackward"){
            e.target.value =  setNum(1) + '.' +  setNum(2) + '.' + setNum(3) 
            + '  '+ 
            setNum(4) + ':' + setNum(5) + ':' + setNum(6);
        }
     
    });
}

function setFormDirty(){
    const form = $$("table-editForm");
    if ( form && !(form.isDirty()) ){
        form.setDirty(true);
    }
  
}

function isEqual(obj1, obj2) {
    if (obj1){
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }
        for (let key of keys1) {
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        }
    } else {
        return false;
    }
    return true;
}

function createTempData(self){
    if (!self.config.tempData){
        self.config.tempData = true;
    }
   
    const id      = getItemId();
    const status  = self.config.tableStatus;
    const values  = self.getValues();

    const tableValue  = $$("table").getItem(values.id);
   
    const storageName = "editFormTempData";

    if ( !isEqual(tableValue, values) ){
        const sentVals= {
            table : id,
            status: status,
            values: values
        };

        webix.storage.local.put(
            storageName, 
            sentVals
        );
    } else {
        webix.storage.local.remove(storageName);
    }
}


const propertyEditForm = {   
    view     : "property",  
    id       : "editTableFormProperty", 
    css      : "webix_edit-table-form-property",
    dirty    : false,
    editable : true,
    tooltip  : propTooltipAction,
    hidden   : true,
    tempData : false, // local storage
    elements : [],
    keyPressTimeout:800,
    statusForm     :null, // put or post
    on       : {

        onAfterEditStop:function(state, editor){
            Action.enableItem($$("table-saveBtn"));

            const inputEditor = document
            .getElementById('custom-date-editor');

            if (inputEditor){
                property_createTemplate ();
            }
 
            setFormDirty();// for combo inputs

            this.callEvent("onNewValues", [state.value, editor.config]);
        },

        onNewValues:function(value, editor){
            editingEnd (editor.id, value);
            createTempData(this);
        },

        onEditorChange:function(){
            setFormDirty(); // for text inputs
        },

        onBeforeRender:function (){

            const size = this.config.elements.length * 28;
            
            if (size && this.$height !== size){
                this.define("height", size);
                this.resize();
            }
    
          
        },

        onItemClick:function(id){
            const property = $$("editTableFormProperty");
            const item     = property.getItem(id);
            item.css       = "";
            property.refresh();
        },

        onTimedKeyPress:function(){
          
            createTempData(this);
            // во время ввода 
        },
 
       
    }
    
};

const propertyRefBtns = {  
    id:"propertyContainer",
    cols:[
        {   id:"propertyRefbtns",  
            rows:[]
        },
        {width:5}
    ] 
 
};


const propertyLayout = {   
    scroll:"y", 
    cols:[
        {width:4},
        propertyEditForm,
        {width:4},
        propertyRefBtns,
    ]
};



;// CONCATENATED MODULE: ./src/js/components/table/editForm/buttons.js








function setFormState(){
    mediator.tables.editForm.postState();
}

function modalBoxAddItem(){
    modalBox().then(function (result){
        if (result == 1){
            setFormState();
        } else if (result == 2){
            mediator.tables.editForm.put(false).then(function(result){
                if (result){
                    setFormState();
                }
            });
 
        }
    });

 
}


function addItem () {

    const isDirtyForm = $$("table-editForm").isDirty();
 

    if (isDirtyForm){
        modalBoxAddItem();
    } else {
        mediator.tables.editForm.clearTempStorage();
        setFormState();
 
    }

}

function backTableBtnClick() {
    const form           = $$("table-editForm");
    const tableContainer = $$("tableContainer");
    const table          = $$("table");

    function defaultState(){
        mediator.tables.editForm.clearTempStorage();
        Action.hideItem(form);
        Action.showItem(tableContainer);
        if (table){
            table.clearSelection();
        }
    }

    function createModalBox(){

        modalBox().then(function (result){
                        
            if (result == 1 || result == 2){
                if (result == 1){
                    defaultState();
                } else if (result == 2){
                    const isExists = $$("table-saveBtn").isVisible();
                    
                    if (isExists){
                        mediator.tables.editForm.put();
                    } else {
                        mediator.tables.editForm.post();
                    }
                }
                form.setDirty(false);
            }
        });
    }

   

    if (form.isDirty()){
        createModalBox ();
    
    } else {
        defaultState();
    }
  

}


const newAddBtn = new buttons_Button({
    
    config   : {
        id          : "table-newAddBtnId",
        hotkey      : "Alt+A",
        disabled    : true,
        value       : "Новая запись", 
        click       : addItem,
    },
    titleAttribute : "Добавить новую запись",
    adaptValue     : "+",

   
}).maxView();

const delBtn = new buttons_Button({
    
    config   : {
        id       : "table-delBtnId",
        hotkey   : "Ctrl+Enter",
        disabled : true,
        icon     : "icon-trash", 
        click    : function (){
            mediator.tables.editForm.remove();
        },
        on:{
            onViewShow:function(){
                const prop   = $$("editTableFormProperty");
                const status = prop.config.statusForm;
     
                if (status == "put") $$("table-delBtnId").enable();
       
            }
        }
    },
    titleAttribute : "Удалить запись из таблицы"

   
}).minView("delete");


const saveBtn = new buttons_Button({
    
    config   : {
        id       : "table-saveBtn",
        hotkey   : "Shift+Space",
        hidden   : true, 
        value    : "Сохранить", 
        click    : function(){
            mediator.tables.editForm.put();
        },
        on:{
            onViewShow:function(){
                if (this.isVisible()){
                    $$("editTableFormProperty")
                    .config.tableStatus = "put";
                }
   
            }
        }
    },
    titleAttribute : "Сохранить запись в таблицу"

   
}).maxView("primary");


const saveNewBtn = new buttons_Button({
    
    config   : {
        id       : "table-saveNewBtn",
        hotkey   : "Ctrl+Shift+Space",
        hidden   : true, 
        value    : "Сохранить", 
        click    : function(){
            mediator.tables.editForm.post();
        },
        on:{
            onViewShow:function(){

                if (this.isVisible()){
                    $$("editTableFormProperty")
                    .config.tableStatus = "post";
                }
   
            }
        }
    },
    titleAttribute : "Сохранить новую запись в таблицу"

   
}).maxView("primary");


const backTableBtn = new buttons_Button({
    
    config   : {
        id       : "table-backTableBtn",
        hotkey   : "Shift+Q",
        hidden   : true,  
        icon     : "icon-arrow-left", 
        click    : backTableBtnClick,
    },
    titleAttribute : "Вернуться к таблице"

   
}).minView();




const editFormBtns = {
    minHeight : 48,
    id:"editBtnsContainer",
    css       : "webix_form-adaptive", 
    margin    : 5, 
    rows:[
        {cols:[
            {   
                rows:[
                {
                    margin : 5,
                    rows   : [
                        {
                            margin : 2,
                            cols   : [
                                backTableBtn,
                                newAddBtn,  
                                delBtn,
                            ]
                        },
                
                    ]
                },
        
                {   margin : 10, 
                    rows   : [ 
                        saveBtn,
                        saveNewBtn,
                        {   id        : "EditEmptyTempalte",
                            rows      : [
                                {height:20},
                                createEmptyTemplate(
                                    "Добавьте новую запись или " +
                                    "выберите существующую из таблицы")
                            ],
                        }
                    
                    ]
                },
             
            ]},
            {   id      : "tablePropBtnsSpace",
                width   : 35, 
                hidden  : true
            },
        ]}
   
     

    ]
};



;// CONCATENATED MODULE: ./src/js/components/table/editForm/_layout.js





const editForm = {
    view        : "form", 
    id          : "table-editForm",
    hidden      : true,
    css         : "webix_form-edit",
    minHeight   : 350,
    minWidth    : 230,
    borderless  : true,
    scroll      : true,
    elements    : [
        editFormBtns,
        propertyLayout,  
    
    ],
    on:{
        onViewShow: webix.once(function(){
            this.config.width = 350;
            this.resize();
            mediator.setForm(this);
        }),
    },
   
    rules       : {
        $all:webix.rules.isNotEmpty
    },

    ready       : function(){
        this.validate();
    },

};



function editTableBar (){
    return editForm;
      
}



;// CONCATENATED MODULE: ./src/js/components/table/filterForm/buttons/libSaveBtn.js









const libSaveBtn_logNameFile   = "tableFilter => buttons => libSaveBtn";

let nameTemplate;
 
let sentObj;
let currName;


async function isTemplateExists(){
    let exists = {
        check : false
    };
    
    const path = "/init/default/api/userprefs/";
    const userprefsData = webix.ajax().get(path);

    await userprefsData.then(function(data){
        data = data.json().content;

        data.forEach(function(el){
   
            if (el.name == currName){
              
                exists = {
                    check : true,
                    id    : el.id
                };
            } 
        });


    }).fail(function(err){
        setAjaxError(
            err, 
            libSaveBtn_logNameFile,
            "isTemplateExists"
        );
        
    });

    return exists;
}


function putUserprefsTemplate(id){
    const path = "/init/default/api/userprefs/" + id;
    
    const putData = webix.ajax().put(path, sentObj);

    putData.then(function(data){
        data = data.json();
        if (data.err_type == "i"){
            setLogValue(
                "success",
                "Шаблон" +
                " «" +
                nameTemplate +
                "» " +
                " сохранён в библиотеку"
            );
        } else {
            errors_setFunctionError(
                data.err,
                libSaveBtn_logNameFile,
                "saveExistsTemplate"
            );
        }
    });

    putData.fail(function(err){
        setAjaxError(
            err, 
            libSaveBtn_logNameFile,
            "putUserprefsData"
        );
    });
}

async function saveExistsTemplate(id){
    modalBox(   "Шаблон с таким именем существует", 
                "После сохранения предыдущие данные будут стёрты", 
                ["Отмена", "Сохранить изменения"]
                )
    .then(function(result){

        if (result == 1){
            putUserprefsTemplate(id);
        }
    });
 
}

 

function saveNewTemplate(){
  
    const path = "/init/default/api/userprefs/";

    const userprefsPost = webix.ajax().post(path, sentObj);
    
    userprefsPost.then(function(data){
        data = data.json();

        if (data.err_type == "i"){
            setLogValue(
                "success",
                "Шаблон" +
                " «" +
                nameTemplate +
                "» " +
                " сохранён в библиотеку"
            );
        } else {
            errors_setFunctionError(
                data.err,
                libSaveBtn_logNameFile,
                "saveNewTemplate"
            );
        }
    });

    userprefsPost.fail(function(err){
        setAjaxError(
            err, 
            libSaveBtn_logNameFile,
            "saveTemplate => saveNewTemplate"
        );
    });

}


async function saveTemplate (result){ 

    let user = getUserDataStorage();
    
    if (!user){
        await pushUserDataStorage();
        user = getUserDataStorage();
    } 

   
    const currId = getItemId();
    const values = Filter.getFilter().values;


    nameTemplate = result;
    currName     = currId + "_filter-template_" + nameTemplate;

    
    const template = {
        name   : nameTemplate,
        table  : currId,
        values : values
    };

    sentObj = {
        name    : currName,
        prefs   : template,
        owner   : user.id
    };
  

    const existsInfo = await isTemplateExists();
    const isExists   = existsInfo.check;


    if (isExists){
        const id = existsInfo.id;
        saveExistsTemplate(id);  
    } else {
        saveNewTemplate();
    }

}


function libraryBtnClick () {
    try {
        webix.prompt({
            title       : "Название шаблона",
            ok          : "Сохранить",
            cancel      : "Отменить",
            css         : "webix_prompt-filter-lib",
            input       : {
                required    : true,
                placeholder : "Введите название шаблона...",
            },
            width       : 350,
        }).then(function(result){
            saveTemplate (result);

        });
    
    } catch(err) {
        errors_setFunctionError(
            err,
            libSaveBtn_logNameFile,
            "filterSubmitBtn"
        );
    }
}

const librarySaveBtn = new buttons_Button({
    
    config   : {
        id       : "filterLibrarySaveBtn",
        hotkey   : "Shift+Esc",
        icon     : "icon-file",
        disabled : true, 
        click    : libraryBtnClick
    },
    titleAttribute : 
    "Сохранить шаблон с полями в библиотеку"

   
}).minView();



;// CONCATENATED MODULE: ./src/js/components/table/filterForm/buttons/backBtn.js





function backBtn_setBtnFilterState(){
    const btnClass          = document.querySelector(".webix_btn-filter");
    const primaryBtnClass   = "webix-transparent-btn--primary";
    const secondaryBtnClass = "webix-transparent-btn";

    Filter.addClass   (btnClass, secondaryBtnClass);
    Filter.removeClass(btnClass, primaryBtnClass  );

}


function defaultFormState(){
    const filterForm     = $$("filterTableBarContainer");
    const tableContainer = $$("tableContainer");

    Action.hideItem(filterForm);
    Action.showItem(tableContainer);
}


function clearTableSelection(){
    const table = $$("table");
    if (table){
        table.clearSelection();
    } 
}



function backBtn_backTableBtnClick() {
    defaultFormState    ();
    clearTableSelection ();
    backBtn_setBtnFilterState   ();
  
}



const backBtn = new buttons_Button({
    
    config   : {
        id       : "table-backTableBtnFilter",
        hotkey   : "Shift+Q",
        hidden   : true,  
        icon     : "icon-arrow-left", 
        click   : function(){
            backBtn_backTableBtnClick();
        },
    },
    titleAttribute : "Вернуться к таблице"

   
}).minView();



;// CONCATENATED MODULE: ./src/js/components/table/filterForm/popup/submitBtn.js
















const submitBtn_logNameFile = "filterTable => popup => submitBtn";


function returnCollection(value){
    const colId      = $$(value).config.columnName;
    return Filter.getItem(colId);
}

function visibleSegmentBtn(selectAll, selectValues){
 
    const selectLength = selectValues.length;

    selectValues.forEach(function(value, i){
        const collection = returnCollection(value);
    
        const length     = collection.length;
        const lastIndex  = length - 1;
        const lastId     = collection[lastIndex];

        const segmentBtn = $$(lastId + "_segmentBtn");

        const lastElem   = selectLength - 1;
        const prevElem   = selectLength - 1;

        if ( i === lastElem){
          //  скрыть последний элемент
            Action.hideItem(segmentBtn);

        } else if ( i === prevElem || selectAll){
            Action.showItem(segmentBtn);
        }
   
    });
}


function createWorkspaceCheckbox (){
    const values       = $$("editFormPopup").getValues();
    const selectValues = [];

    try{
        const keys    = Object.keys(values); 
     
        let selectAll = false;
     
        keys.forEach(function(el){
            const isChecked = values[el];

            if (isChecked && el !== "selectAll"){
                selectValues.push(el);
            } else if (el == "selectAll"){
                selectAll = true;
            }
      
            const columnName = $$(el).config.columnName;

       
            Filter.setFieldState(values[el], columnName);
  
        });

        visibleSegmentBtn(selectAll, selectValues);

    } catch(err){
        errors_setFunctionError(
            err,
            submitBtn_logNameFile,
            "createWorkspaceCheckbox"
        );
    }
}

function visibleCounter(){
    const elements      = $$("filterTableForm").elements;
    const values        = Object.values(elements);
    let visibleElements = 0;
    try{
        values.forEach(function(el){
            const isVisibleElem = el.config.hidden;
            if ( !isVisibleElem ){
                visibleElements++;
            }
            
        });

    } catch(err){
        errors_setFunctionError(
            err,
            submitBtn_logNameFile,
            "visibleCounter"
        );
    }

    return visibleElements;
}


// function resetLibSelectOption(){
//     Filter.setActiveTemplate(null);
// }

function setDisableTabState(){
    const visibleElements = visibleCounter();

    if (!(visibleElements)){
        Action.showItem     ($$("filterEmptyTempalte" ));

        Action.disableItem  ($$("btnFilterSubmit"     ));
        Action.disableItem  ($$("filterLibrarySaveBtn"));
    } 
}


function submitBtn_createFilter(){
    Action.enableItem($$("filterLibrarySaveBtn"));
    createWorkspaceCheckbox ();

    setDisableTabState();

    Action.destructItem($$("popupFilterEdit"));

    //resetLibSelectOption();
  
    setLogValue(
        "success",
        "Рабочая область фильтра обновлена"
    );
}


async function createModalBox(table){
    return modalBox("С таблицы будет сброшен текущий фильтр", 
        "Вы уверены?", 
    ["Отмена", "Продолжить"]
    )
    .then(function (result){
        if (result == 1){

            return Filter.resetTable().then(function(result){
                if (result){
                    Filter.showApplyNotify(false);
                    table.config.filter = null;
                    
                } 

                return result;
            });
       
        }

    });
}

function showActiveTemplate(){
    if (Filter.getActiveTemplate()){
        Action.showItem($$("templateInfo"));
    } 
}

function resultActions(){
    submitBtn_createFilter();
    Filter.setStateToStorage ();
    Filter.enableSubmitButton();
    showActiveTemplate();
}

function isUnselectAll(){
    const checkboxContainer = $$("editFormPopupScrollContent");
    const checkboxes        = checkboxContainer.getChildViews();

    let isUnchecked = true;
    
    checkboxes.forEach(function(el){
        const id       = el.config.id;
        const checkbox = $$(id);

        if (checkbox){

            const value = checkbox.getValue();

            if (value && isUnchecked && id !== "selectAll"){
                isUnchecked = false;
            }
        }

    });

    return isUnchecked;

}

function getCheckboxData(){
    const table          = getTable();
    const isFilterExists = table.config.filter;

    if (isUnselectAll() && isFilterExists){
        createModalBox(table).then(function(result){
            if (result){
                resultActions();
            }
        });
    } else {
        resultActions();
    }

     
 
}

function submitBtn_showEmptyTemplate(){
    const keys = Filter.lengthPull();
    if ( !keys ){
        Action.showItem($$("filterEmptyTempalte"));
    }
}

function createLibraryInputs(){
    Filter.clearFilter  ();
    Filter.clearAll     ();
    getLibraryData      ();
}

function popupSubmitBtn (){
    try {                                             
        const tabbarValue = $$("filterPopupTabbar").getValue();

        if (tabbarValue == "editFormPopupLib"){

            const table          = getTable();
            const isFilterExists = table.config.filter;
         
            if (isFilterExists){
                createModalBox(table).then(function(result){
                    if (result){

                        Filter.resetTable().then(function(result){
                            if (result){
                                createLibraryInputs();
                              
                            } 
                        });
                    }
                });
            } else {
                createLibraryInputs();
          
            }

        } else if (tabbarValue == "editFormScroll" ){
            getCheckboxData();
            Filter.setStateToStorage();
        }

  

    } catch (err) {
        errors_setFunctionError( 
            err ,
            submitBtn_logNameFile, 
            "popupSubmitBtn"
        );

        Action.destructItem($$("popupFilterEdit"));
    }

    submitBtn_showEmptyTemplate();

}




const submitBtn_submitBtn = new buttons_Button({
    
    config   : {
        id       : "popupFilterSubmitBtn",
        hotkey   : "Shift+Space",
        disabled : true, 
        value    : "Применить", 
        click    : popupSubmitBtn
    },
    titleAttribute : "Выбранные фильтры будут" +
    "добавлены в рабочее поле, остальные скрыты"

}).maxView("primary");



;// CONCATENATED MODULE: ./src/js/components/table/filterForm/popup/removeBtn.js














const removeBtn_logNameFile = "filterTable => popup => removeBtn";

let removeBtn_lib;
let radioValue;

function removeOptionState (){
    const id      = radioValue.id;
    const options = removeBtn_lib.config.options;
    try{
        options.forEach(function(el){
            if (el.id == id){
                el.value = el.value + " (шаблон удалён)";
                removeBtn_lib.refresh();
                removeBtn_lib.disableOption(removeBtn_lib.getValue());
                removeBtn_lib.setValue("");
            }
        });
    } catch (err){
        errors_setFunctionError(
            err, 
            removeBtn_logNameFile, 
            "removeOptionState"
        );
    }
}

function deleteElement(){
    const prefs   = radioValue.prefs;
    const idPrefs = prefs.id;

    const path = "/init/default/api/userprefs/" + idPrefs;
    const deleteTemplate = webix.ajax().del(path, prefs);

    deleteTemplate.then(function(data){
        data = data.json();

        const value = radioValue.value;

        if (data.err_type == "i"){
            setLogValue(
                "success",
                "Шаблон « " + value + " » удален"
            );
            removeOptionState ();
            Filter.clearFilter();
            Filter.setStateToStorage();
            Action.showItem($$("filterEmptyTempalte"));
            
        } else {
            errors_setFunctionError(
                data.err, 
                removeBtn_logNameFile, 
                "userprefsData"
            );
        }

    });

    deleteTemplate.fail(function(err){
        setAjaxError(
            err, 
            removeBtn_logNameFile,
            "getLibraryData"
        );
    });
}


function resetLibSelectOption(){
    Filter.setActiveTemplate(null);
}


async function userprefsData (){ 

    removeBtn_lib = $$("filterEditLib");
    const libValue = removeBtn_lib.getValue();
    radioValue = removeBtn_lib.getOption(libValue);

    const idPrefs = radioValue.prefs.id;

    if (idPrefs){
        deleteElement       (radioValue, removeBtn_lib);
        resetLibSelectOption();
        Action.disableItem  ($$("editFormPopupLibRemoveBtn"));
    }

    

}

function removeBtnClick (){

    modalBox(   "Шаблон будет удалён", 
                "Вы уверены, что хотите продолжить?", 
                ["Отмена", "Удалить"]
    ).then(function(result){

        if (result == 1){
            userprefsData ();
            
        }
    });
}


const removeBtn = new buttons_Button({
    
    config   : {
        id       : "editFormPopupLibRemoveBtn",
        hotkey   : "Shift+Q",
        hidden   : true,  
        disabled : true,
        icon     : "icon-trash", 
        click   : function(){
            removeBtnClick ();
        },
    },
    titleAttribute : "Выбранный шаблон будет удален"

   
}).minView("delete");


;// CONCATENATED MODULE: ./src/js/components/table/filterForm/popup/_layoutButtons.js





const btnLayout = {
    cols   : [
        submitBtn_submitBtn,
        {width : 5},
        removeBtn,
    ]
};


;// CONCATENATED MODULE: ./src/js/components/table/filterForm/popup/tabbar/tabbar.js





const tabbar_logNameFile = "tableFilter => popup => tabbar => tabbar";

function btnSubmitState (state){

    const btn = $$("popupFilterSubmitBtn");

    if (state=="enable"){
        Action.enableItem(btn);

    } else if (state=="disable"){
        Action.disableItem(btn);
        
    }
    
}

function visibleRemoveBtn (param){
    const btn = $$("editFormPopupLibRemoveBtn");
   
    if (param){
        Action.showItem(btn);
    } else {
        Action.hideItem(btn);
    }
    
}

function setSelectedOption(){
    const radio = $$("filterEditLib");

    const currTemplate = Filter.getActiveTemplate();

    if (currTemplate && currTemplate.id){
        radio.setValue   (currTemplate.id);
        Action.enableItem($$("editFormPopupLibRemoveBtn"));
        btnSubmitState   ("disable");
    }
}

function filterLibrary(){

    function setStateSubmitBtn (){
        
        if ($$("filterEditLib").getValue() !== "" ){
            btnSubmitState ("enable");
        } else {
            btnSubmitState ("disable");
        }
    }

    try{
 
        setStateSubmitBtn ();
        visibleRemoveBtn  (true);
        setSelectedOption ();
    }catch(err){
        errors_setFunctionError(
            err, 
            tabbar_logNameFile, 
            "filterLibrary"
        );
    }  

}



function editFilter (){
    
    const checkboxes = $$("editFormPopup").getValues();
    const values     = Object.values(checkboxes);
    let counter = 0;
    
    function countChecked(){
        try{
            values.forEach(function(el,i){
                if (el){
                    counter++;
                }
            });
        } catch(err){
            errors_setFunctionError(
                err, 
                tabbar_logNameFile, 
                "countChecked"
            );
        }
    }
    
    function setStateSubmitBtn(){
        if (counter > 0){
            btnSubmitState ("enable");
        } else {
            btnSubmitState ("disable");
        }
    }

    

    countChecked     ();
    visibleRemoveBtn (false);
    setStateSubmitBtn();
   
}


function tabbarClick (id){

    if (id =="editFormPopupLib"){
        filterLibrary();  
    }

    if (id =="editFormScroll"){
        editFilter ();
    } 

}


function returnDivHeadline(title){
    return  "<span" + 
            "class='webix_tabbar-filter-headline'>" +
            title +
            "</span>";
}



const tabbar =  {
    view        : "tabbar",  
    type        : "top", 
    id          : "filterPopupTabbar",
    css         : "webix_filter-popup-tabbar",
    multiview   : true, 
    height      : 50,

    options     : [
        {   value: returnDivHeadline("Поля"), 
            id: 'editFormScroll' 
        },
        {   value: returnDivHeadline("Библиотека"), 
            id: 'editFormPopupLib' 
        },
    ],

    on:{
        onAfterTabClick: function(id){
            tabbarClick(id);
        }
    }
};



;// CONCATENATED MODULE: ./src/js/components/table/filterForm/popup/tabbar/tabForm.js
const tabForm = {   
    view        :"scrollview",
    id          : "editFormScroll", 
    borderless  : true, 
    css         : "webix_multivew-cell",
    scroll      : "y", 
    body        : { 
        id  : "editFormPopupScroll",
        rows: [ ]
    }

};



;// CONCATENATED MODULE: ./src/js/components/table/filterForm/popup/tabbar/tabLibrary.js



function onChangeLibBtn (){
    const submitBtn = $$("popupFilterSubmitBtn");

    const template      = Filter.getActiveTemplate();
    const selectedValue = template ? template : null;

    const lib        = $$("filterEditLib");
    const libValue   = lib.getValue ();
    const radioValue = lib.getOption(libValue);

    if (radioValue && radioValue.id !== selectedValue){
        Action.enableItem ($$("editFormPopupLibRemoveBtn"));
        Action.enableItem (submitBtn);
    } else {
        Action.disableItem(submitBtn);
    }


}

const radioLibBtn =  {   
    view    : "radio", 
    id      : "filterEditLib",
    vertical: true,
    options : [],
    on      : {
        onChange: function(){
            onChangeLibBtn ();
        }
    }
};

const tabLibrary = {  
    view        : "form", 
    scroll      : true ,
    id          : "editFormPopupLib",
    css         : "webix_multivew-cell",
    borderless  : true,
    elements    : [
        radioLibBtn
    ],

};



;// CONCATENATED MODULE: ./src/js/components/table/filterForm/popup/tabbar/_layoutTab.js





const layoutTab = {
    rows:[
        tabbar,
                
        {   height : 200,
            cells  : [
                tabForm,
                tabLibrary,
            ]   
        },
    ]
};


;// CONCATENATED MODULE: ./src/js/components/table/filterForm/popup/_layoutPopup.js







const editFormPopup = {
    view        : "form", 
    id          : "editFormPopup",
    css         : "webix_edit-form-popup",
    borderless  : true,
    elements    : [

        { rows : [ 
            layoutTab,
    
            {height : 20},
            btnLayout
        ]},
        {}

    ],
};



function createFilterPopup() {

    const popup = new popup_Popup({
        headline : "Редактор фильтров",
        config   : {
            id    : "popupFilterEdit",
            height  : 400,
            width   : 400,
    
        },
    
        elements : {
            rows : [
                createEmptyTemplate(
                    "Выберите нужные поля или шаблон из библиотеки"
                ),
                editFormPopup
            ]
          
        }
    });
    
    popup.createView ();
    popup.showPopup  ();

}





;// CONCATENATED MODULE: ./src/js/components/table/filterForm/buttons/editBtn/createLibTab.js





const createLibTab_logNameFile = "filterForm => buttons => editBtn => createLibTab";
let user;
let prefsData;
let createLibTab_lib;

function clearOptionsPull() {
    
    const oldOptions = [];

    const options     = createLibTab_lib.config.options;
    const isLibExists = options.length;

    if (createLibTab_lib && isLibExists){
        options.forEach(function(el){
            oldOptions.push(el.id);
        });

        oldOptions.forEach(function(el){
            createLibTab_lib.removeOption(el);
        });

    }
}


function createOption(i, data){
    const prefs   = JSON.parse(data.prefs);
    const idPrefs = prefs.table;
    const currId  = getItemId ();

    if (idPrefs == currId){
        createLibTab_lib.addOption( {
            id    : i + 1, 
            value : prefs.name,
            prefs : data
        });

    }
}

function isThisOption(data){
    const dataOwner = data.owner;
    const currOwner = user.id;

    const name           = "filter-template_";
    const isNameTemplate = data.name.includes(name);

    if (isNameTemplate && dataOwner == currOwner){
        return true;
    }

}
function setTemplates(){
   
    clearOptionsPull();

    const dataSrc = prefsData.json().content;
    try {
        dataSrc.forEach(function(data, i){
            if(isThisOption(data)){
                createOption(i, data);
            }
        
        });
    } catch (err) {
        errors_setFunctionError(
            err, 
            createLibTab_logNameFile, 
            "setTemplates"
        );
    }

}

function setEmptyOption(){
    $$("filterEditLib").addOption(
        {   id      : "radioNoneContent",
            disabled: true, 
            value   : "Сохранённых шаблонов нет"
        }
    );
}

async function createLibTab(){ 
    createLibTab_lib  = $$("filterEditLib");
    user = getUserDataStorage();

    if (!user){
        await pushUserDataStorage ();
        user =  getUserDataStorage();
    }

    const path = "/init/default/api/userprefs/";
    const userprefsGetData = webix.ajax(path);

    userprefsGetData.then(function(getData){
        prefsData = getData;
        if(user){
            setTemplates();

            const lib = $$("filterEditLib");
            
            if (lib && lib.data.options.length == 0 ){
                setEmptyOption();
            }
        
        }
       
        
    });
    
    userprefsGetData.fail(function(err){
        setAjaxError(
            err, 
            createLibTab_logNameFile, 
            "saveTemplate"
        );
    });
   
}


;// CONCATENATED MODULE: ./src/js/components/table/filterForm/buttons/editBtn/createFieldsTab.js





const createFieldsTab_logNameFile = "tableFilter => buttons => editBtn => createFieldsTab";

function popupSizeAdaptive(){
    const k     = 0.89;
    const size  = window.innerWidth * k;
    const popup = $$("popupFilterEdit");
    try{
        popup.config.width = size;
        popup.resize();
    } catch (err){
        errors_setFunctionError(
            err,
            createFieldsTab_logNameFile,
            "popupSizeAdaptive"
        );
    }
}

function setValueCheckbox(){
    const content     = $$("editFormPopupScrollContent");
    const checkboxes  = content.getChildViews();
    const isSelectAll = $$("selectAll").getValue();
    try{
        checkboxes.forEach(function(el){
            const isCheckbox = el.config.id.includes("checkbox");

            if (isCheckbox){
                if(isSelectAll){
                    el.setValue(1);
                } else {
                    el.setValue(0);
                }
            }

        });
    } catch (err){
        errors_setFunctionError(
            err,
            createFieldsTab_logNameFile,
            "setValueCheckbox"
        );
    }
}

function returnSelectAllCheckbox(){
    const checkbox =  {
        view        : "checkbox", 
        id          : "selectAll", 
        labelRight  : 
        "<div style='font-weight:600'>Выбрать всё</div>", 
        labelWidth  : 0,
        name        : "selectAll",
        on          : {
            onChange:function(){
                Action.enableItem($$("popupFilterSubmitBtn"));
                setValueCheckbox (); 
            },
    
        } 
    };

    return checkbox;
}

function createCheckboxData(config){
    return { 
        id    : config.id, 
        label : config.label 
    };
}

function getAllCheckboxes(){
    const checkboxes           = [];
    const filterTableElements  = $$("filterTableForm").elements;

    const values = Object.values(filterTableElements);
    try{
        values.forEach(function(el){
            checkboxes.push(
                createCheckboxData(el.config)
            );
        });
    } catch (err){
        errors_setFunctionError( 
            err, 
            createFieldsTab_logNameFile, 
            "getAllCheckboxes" 
        );
    }
 
    return checkboxes;
}


function getStatusCheckboxes(array){
    let counter = 0;

    try{
        array.forEach(function(el){
            const isCheckbox = el.config.id.includes("checkbox");
            
            if (isCheckbox){
                const value = el.config.value;

                if ( !(value) || value == "" ){
                   counter ++;
                }
            }
           
        });
    } catch (err){
        errors_setFunctionError(
            err,
            createFieldsTab_logNameFile,
            "getStatusCheckboxes"
        );
    }

    return counter;
}

 

function setValueSelectAll(selectAll, val){
    try {
        selectAll.config.value = val;
        selectAll.refresh();
    } catch (err) {
        errors_setFunctionError(
            err,
            createFieldsTab_logNameFile,
            "setSelectAllState"
        );
    }
}

function setSelectAllState(el) {
    const parent  = $$(el.id + "_checkbox").getParentView();
    const childs  = parent.getChildViews();
    const counter = getStatusCheckboxes(childs);

    const selectAll     = $$("selectAll");
    const isTrueValue = selectAll.config.value;

    if (!counter){
        setValueSelectAll(selectAll, 1);

    } else if (isTrueValue){
        setValueSelectAll(selectAll, 0);
        
    }
 
}

function checkboxOnChange (el){
    const parent  = $$(el.id + "_checkbox").getParentView();
    const childs  = parent.getChildViews();
    getStatusCheckboxes(childs);

    setSelectAllState  (el);
    
    Action.enableItem  ($$("popupFilterSubmitBtn"));

}



function returnCheckboxesContainer(layout){
    const nameList = [
        {cols:[
            {   id  : "editFormPopupScrollContent",
                css : "webix_edit-form-popup-scroll-content",
                rows: layout
            }
        ]}
    ];

    return nameList;
}

function createFieldsTab_returnTemplate(el){
    const template = {
        view        : "checkbox", 
        id          : el.id + "_checkbox", 
        labelRight  : el.label, 
        labelWidth  : 0,
        name        : el.id,
        on          : {
            onChange:function(){
                checkboxOnChange (el);
            }
        } 
    };

    return template;
}


function createFieldsTab_createCheckbox(el){

    const template = createFieldsTab_returnTemplate(el);

    const field     = $$(el.id);
    const container = $$(el.id + "_rows");
    const childs    = container.getChildViews();


    if (field && field.isVisible() || childs.length > 1 ){
        template.value = 1;
    }

    return template;
    
}


function addCheckboxesToLayout(checkboxesLayout){
    const scroll = $$("editFormPopupScroll");
    const layout = returnCheckboxesContainer(checkboxesLayout);
    try{
        if (scroll){
            scroll.addView( {rows : layout}, 1 );
        }
    } catch (err){
        errors_setFunctionError(
            err, 
            createFieldsTab_logNameFile, 
            "addCheckboxesToLayout"
        );
    }
}

function createCheckboxes(){

    const checkboxesLayout = [
        returnSelectAllCheckbox()
    ];

    try {  
        const formData = getAllCheckboxes();

        formData.forEach(function (el){
            const isChild  = el.id.includes("child");

            if(!isChild){
                checkboxesLayout.push(
                    createFieldsTab_createCheckbox(el)
                );
            }
        });

        addCheckboxesToLayout(checkboxesLayout);

    } catch (err){
        errors_setFunctionError(
            err, 
            createFieldsTab_logNameFile, 
            "createCheckboxes"
        );
    }
}


function stateSelectAll(){
    const selectAll  = $$("selectAll");
    
    const container  = $$("editFormPopupScrollContent");
    const checkboxes = container.getChildViews();
    const counter    = getStatusCheckboxes(checkboxes);
 
    if (!counter){
        setValueSelectAll(selectAll, 1);
    } 
    
}


function createFieldsTab (){
    
    if (window.innerWidth < 1200 ){
        popupSizeAdaptive();
    }
 
    createCheckboxes();
 
    stateSelectAll();
}


;// CONCATENATED MODULE: ./src/js/components/table/filterForm/buttons/editBtn/click.js





function editFiltersBtn (){

    createFilterPopup();

    createLibTab ();

    createFieldsTab();
 
}


;// CONCATENATED MODULE: ./src/js/components/table/filterForm/buttons/editBtn/_layout.js



const editBtn = new buttons_Button({
    
    config   : {
        hotkey   : "Alt+A",
        value    : "Открыть редактор", 
        click    : editFiltersBtn
    },
    titleAttribute : "Добавить/удалить фильтры"

   
}).maxView();


;// CONCATENATED MODULE: ./src/js/components/table/filterForm/buttons/submitBtn.js










 
const buttons_submitBtn_logNameFile   = "tableFilter => buttons => submitBtn";


function setLogicValue(value){
    let logic = null; 
    
    if (value == "1"){
        logic = "+and+";

    } else if (value == "2"){
        logic = "+or+";
    }

    return logic;
}


function setOperationValue(value){
    let operation;

    if (!value){
        operation =  "=";
    } else if (value === "⊆"){
        operation = "contains";
    } else {
        operation = value;
    }

    return "+" + operation + "+";
}

function setName(value){
    const itemTreeId = getItemId ();

    return itemTreeId + "." + value;
}

function isBool(name){
    const table = getTable();
    const col   = table.getColumnConfig(name);
    const type  = col.type;

    let check   = false;
  
    if (type && type === "boolean"){
        check = true;
    }

    return check;
}

function returnBoolValue(value){
    if (value == 1){
        return true;
    } else if (value == 2){
        return false;
    }
}

function submitBtn_setValue(name, value){

    let sentValue = "'" + value + "'";


    if (isBool(name)){
        sentValue = returnBoolValue(value);
    }

    return sentValue;
}

function submitBtn_createQuery (input){
    const name      = setName           (input.name);
    const value     = submitBtn_setValue          (input.name, input.value);
    const logic     = setLogicValue     (input.logic);
    const operation = setOperationValue (input.operation);

    let query = name + operation + value;

    if (logic){
        query = query + logic;
    }

    return query;
}

function segmentBtnValue(input) {
 
    const segmentBtn = $$(input + "_segmentBtn");
    const isVisible  = segmentBtn.isVisible();

    let value = null;

    if (isVisible){
        value = segmentBtn.getValue();
    }

    return value;
}

function createValuesArray(){
    const valuesArr  = [];
    const inputs     = Filter.getAllChilds(true);

    inputs.forEach(function(input){
        
        const name       = $$(input).config.columnName;
        const value      = $$(input)                         .getValue();
        const operation  = $$(input + "-btnFilterOperations").getValue();

        const logic      = segmentBtnValue(input); 

        valuesArr.push ( { 
            id        : input,
            name      : name, 
            value     : value,
            operation : operation,
            logic     : logic  
        });
    });

    return valuesArr;
}


function createGetData(){
       
    const format         = "%d.%m.%Y %H:%i:%s";
    const postFormatData = webix.Date.dateToStr(format);
    const valuesArr      = createValuesArray();
    const query          = [];

    valuesArr.forEach(function(el){
  
        const filterEl = $$(el.id);

        let value      = el.value;
   
        function formattingDateValue(){
            const view = filterEl.config.view; 
            if ( view == "datepicker" ){
                value = postFormatData(value);
            }
        }

        function formattingSelectValue(){
            const text = filterEl.config.text;
            if ( text && text == "Нет" ){
                value = 0;
            }
        }

        if (filterEl){
            formattingDateValue ();
            formattingSelectValue();
            query.push(submitBtn_createQuery(el));
           
        }

    });

    return query;
}

function createSentQuery(){
    const query = createGetData();
    return query.join("");
}

function setTableConfig(table, query){
    table.config.filter = {
        table:  table.config.filter,
        query:  query
    };
}

function setData(currTableView, data){
    const overlay = "Ничего не найдено";
    try{
        currTableView.clearAll();
        if (data.length){
            currTableView.hideOverlay(overlay);
            currTableView.parse(data);
        } else {
            currTableView.showOverlay(overlay);
        }
    } catch (err){
        errors_setFunctionError(
            err, 
            buttons_submitBtn_logNameFile, 
            "setData"
        );
    }
}

function setCounterValue (reccount){
    try{
        const table   = getTable();
        const id      = table.config.id;
        const counter = $$(id+"-findElements");

       // counter.setValues(reccount.toString());
       const res = {visible:reccount}
       counter.setValues(JSON.stringify(res));
    } catch (err){
        errors_setFunctionError(
            err, 
            buttons_submitBtn_logNameFile, 
            "setCounterVal"
        );
    }
}


function filterSubmitBtn (){
                           
 
    const isValid = $$("filterTableForm").validate();

    if (isValid){

        const currTableView = getTable();
        const query         = createSentQuery();

        setTableConfig(currTableView, query);

        const path = "/init/default/api/smarts?query=" + query;
        const queryData = webix.ajax(path);
 
        queryData.then(function(data){
            data             = data.json();
            const reccount   = data.reccount;
            const notifyType = data.err_type;
            const notifyMsg  = data.err;
            data             = data.content;
         
            if (notifyType == "i"){
                Filter.showApplyNotify();
                setData         (currTableView, data);
                setCounterValue (reccount);
                Action.hideItem ($$("tableFilterPopup"));
        
                setLogValue(
                    "success",
                    "Фильтры успшено применены"
                );
            
            } else {
                Filter.showApplyNotify(false);
                setLogValue("error", notifyMsg);
            } 
        });

        queryData.fail(function (err){
            setAjaxError(
                err, 
                buttons_submitBtn_logNameFile, 
                "createGetData"
            );
        });

    } else {
        setLogValue(
            "error", 
            "Не все поля формы заполнены"
        );
    }
  

}


const buttons_submitBtn_submitBtn = new buttons_Button({

    config   : {
        id       : "btnFilterSubmit",
        hotkey   : "Ctrl+Shift+Space",
        disabled : true,
        value    : "Применить фильтры", 
        click    : filterSubmitBtn,
    },
    titleAttribute : "Применить фильтры"


}).maxView("primary");


;// CONCATENATED MODULE: ./src/js/components/table/filterForm/buttons/resetBtn.js









const resetBtn_logNameFile   = "filterForm => buttons => resetBtn";



function removeValues(collection){

    if (collection){

        collection.forEach(function(el){
            const idChild = el.includes("_filter-child-");

            if (idChild){
                Action.removeItem($$(el + "-container"));
            }
     
        });
    }
    
}

function resetBtn_removeChilds(){
   const keys = Filter.getItems();

    keys.forEach(function(key){ 
        const item = Filter.getItem(key);
        removeValues(item);
    });

}



function clearFilterValues(){
    const form = $$("filterTableForm");
    if(form){
        form.clear(); 
    }
}

function hideInputsContainer(){
    const css       = ".webix_filter-inputs";
    const inputs    = document.querySelectorAll(css);
    const hideClass = "webix_hide-content";

    try{
        inputs.forEach(function(elem){
            Filter.addClass(elem, hideClass);
        });
    } catch (err){
        errors_setFunctionError(
            err,
            resetBtn_logNameFile,
            "hideInputsContainer"
        );
    }
}




function clearInputSpace(){

    resetBtn_removeChilds        ();
  
    clearFilterValues   ();
    hideInputsContainer ();
 
    Filter.clearFilter  ();

    Action.hideItem   ($$("tableFilterPopup"    ));

    Action.disableItem($$("filterLibrarySaveBtn"));
    Action.disableItem($$("resetFilterBtn"      ));

    Action.showItem   ($$("filterEmptyTempalte" ));

    Filter.setActiveTemplate(null);

  
    Filter.clearAll(); // clear inputs storage
 
    Filter.setStateToStorage();

}

function resetFilterBtnClick (){
    const table = getTable();
    try {

        modalBox("Все фильтры будут удалены", 
                 "Вы уверены?", 
                ["Отмена", "Удалить"]
        )
        .then(function (result){
            if (result == 1){
                Filter.resetTable().then(function(result){
                    if (result){
                        clearInputSpace();
                        Filter.showApplyNotify(false);
                    }
                    table.config.filter = null;
                    Action.hideItem($$("templateInfo"));
                });
              
               
            }

        });
        

    } catch(err) {
        errors_setFunctionError(
            err,
            "Ошибка при очищении фильтров; " +
            "filterForm => buttons",
            "resetFilterBtnClick"
        );
    }
}



const resetBtn = new buttons_Button({
    
    config   : {
        id       : "resetFilterBtn",
        hotkey   : "Shift+Esc",
        disabled : true,
        icon     : "icon-trash", 
        click    : function(){
            resetFilterBtnClick();
        }
    },
    titleAttribute : "Сбросить фильтры",
    onFunc: {
        resetFilter: function(){
  
            const table         = getTable();
            table.config.filter = null;

            Filter.resetTable().then(function(result){
                if (result){
                   
                    clearInputSpace();
                   
                    Filter.showApplyNotify(false);
           
                }

        
            });
        }
    }

   
}).minView("delete");


;// CONCATENATED MODULE: ./src/js/components/table/filterForm/buttons/_layoutBtn.js






function buttonsFormFilter (name) {
    if ( name == "formResetBtn" ) {
        return resetBtn;
    } else if ( name == "formBtnSubmit" ){
        return buttons_submitBtn_submitBtn;
    } else if ( name == "formEditBtn" ){
        return editBtn;
    } else if ( name == "filterBackTableBtn" ){
        return backBtn;
    } else if ( name == "formLibrarySaveBtn" ){
        return librarySaveBtn;
    }
}




;// CONCATENATED MODULE: ./src/js/components/table/filterForm/saveTemplateNotify.js







const saveTemplateNotify_logNameFile = "filterFrom => SaveTemplateNotify";


function saveTemplateNotify_putUserprefsTemplate(id, sentObj, nameTemplate){
    const path    = "/init/default/api/userprefs/" + id;
    const putData = webix.ajax().put(path, sentObj);

    putData.then(function(data){
        data = data.json();
        if (data.err_type == "i"){
            setLogValue(
                "success",
                "Шаблон" +
                " «" +
                nameTemplate +
                "» " +
                " обновлён"
            );

            Action.hideItem($$("templateInfo"));

        } else {
            errors_setFunctionError(
                data.err,
                saveTemplateNotify_logNameFile,
                "saveExistsTemplate"
            );
        }
    });

    putData.fail(function(err){
        setAjaxError(
            err, 
            saveTemplateNotify_logNameFile,
            "putUserprefsData"
        );
    });
}


function saveClick(){

    const selectTemplate = Filter.getActiveTemplate();
    const newValues = Filter.getFilter().values;

    const prefs  = JSON.parse(selectTemplate.prefs.prefs);
    prefs.values = newValues;

    const sentObj = {
        prefs : prefs
    };

    const id           = selectTemplate.prefs.id;
    const nameTemplate = prefs.name;

    saveTemplateNotify_putUserprefsTemplate(id, sentObj, nameTemplate);
    
    
}


function saveTemplateNotify(){
    const template = {
        template   : "Есть несохранённые изменения в шаблоне", 
        height     : 65, 
        borderless : true
    };

    const btn = new buttons_Button({
    
        config   : {
            id       : "putTemplateBtn",
            inputHeight:40,
            icon     : "icon-pencil",
            click    : function(){
                saveClick();
            },
        },
        titleAttribute : "Сохранить изменения"
    
       
    }).transparentView();

    const layout = {  
        id        : "templateInfo",
        hidden    : true,
        css       : "filter-template-info",
        cols      : [
            template,
            {rows : [
                {},
                btn,
                {}
            ]},
            {width : 5}
            
        ],
    };

    return layout;
}



;// CONCATENATED MODULE: ./src/js/components/table/filterForm/_layout.js




function _layout_returnBtns(){
    const btns = [
        {   rows   : [
            {   
                margin      : 2, 
                cols        : [
                    buttonsFormFilter("filterBackTableBtn"),
                    buttonsFormFilter("formEditBtn"),
                    buttonsFormFilter("formResetBtn"),
                ],
            },
            ]
        },

        {   id   : "btns-adaptive",
            rows : [
                {  
                    margin      : 2, 
                    cols        : [
                        buttonsFormFilter("formBtnSubmit"),
                        buttonsFormFilter("formLibrarySaveBtn"),
                    ]
                },
                
            ]
        }
    ];

    return btns;
}


const filterTableForm = {
    view        : "form", 
    hidden      : true,
    id          : "filterTableForm",
    minHeight   : 350,
    scroll      : true,
    elements    : [
        {   
            css       : "webix_form-adaptive",
            rows      :  _layout_returnBtns()
        },
        {   id        : "filterEmptyTempalte",
            rows      : [
                createEmptyTemplate(
                    "Добавьте фильтры из редактора"
                )
            ],
        },
        saveTemplateNotify()

        
    ],

    rules:{
        $all:webix.rules.isNotEmpty
    },


    ready:function(){
        this.validate();
    },

};

function filterForm (){
    const form = {   
        id       : "filterTableBarContainer", 
        minWidth : 250,
        width    : 350, 
        hidden   : true, 
        rows     : [
            {   id   : "editFilterBarAdaptive", 
                rows : [
                    filterTableForm
                ]
            }
        ]
    };
    
    return form;
}



;// CONCATENATED MODULE: ./src/js/components/table/editForm/states.js



const states_logNameFile = "tableEditForm => states";


function defaultStateForm () {

    const property = $$("editTableFormProperty");
    
    function btnsState(){
        
        const saveBtn    = $$("table-saveBtn");
        const saveNewBtn = $$("table-saveNewBtn");
        const delBtn     = $$("table-delBtnId");

        if (saveNewBtn.isVisible()) {
            saveNewBtn.hide();

        } else if (saveBtn.isVisible()){
            saveBtn.hide();

        }

        delBtn.disable();
    }

    function formPropertyState(){
 
        if (property){
            property.clear();
            property.hide();
        }
    }


    function removeRefBtns(){
        const refBtns = $$("propertyRefbtnsContainer");
        const parent  = $$("propertyRefbtns");
        if ( refBtns ){
            parent.removeView( refBtns );
        }
    }

    try{
        btnsState();
        formPropertyState();
        Action.showItem($$("EditEmptyTempalte"));
        removeRefBtns();

    } catch (err){
        errors_setFunctionError(err, states_logNameFile, "defaultStateForm");
    }

}


;// CONCATENATED MODULE: ./src/js/components/table/editForm/propBtns/calendar.js







let property;

const calendar_logNameFile = "tableEditForm => propBtns => calendar";


function unsetDirtyProp(elem){
    elem.config.dirtyProp = false;
}

function formatDate(format){
    return webix.Date.dateToStr("%" + format);
}

const formatHour = formatDate("H");
const formatMin  = formatDate("i");
const formatSec  = formatDate("s");


function setTimeInputsValue(value){
    $$("hourInp").setValue (formatHour(value));
    $$("minInp") .setValue (formatMin (value));
    $$("secInp") .setValue (formatSec (value));
}

function unsetDirtyPropInputs(calendar){
    unsetDirtyProp( calendar     );
    unsetDirtyProp( $$("hourInp"));
    unsetDirtyProp( $$("minInp" ) );
    unsetDirtyProp( $$("secInp" ) );
}

function setPropValues(elem){
 
    const val       = property.getValues()[elem.id];
    const valFormat = formatHour(val);

    const calendar  = $$("editCalendarDate");
    const btn       = $$("editPropCalendarSubmitBtn");

    try{

        if ( val && !isNaN(valFormat) ){
            calendar.setValue (val);
            setTimeInputsValue(val);

        } else {
            calendar.setValue( new Date() );
            Action.disableItem(btn);
        }

        unsetDirtyPropInputs(calendar);

    } catch (err){
        errors_setFunctionError(
            err, 
            calendar_logNameFile, 
            "setValuesDate"
        );
    }
    
}

function returnTimeValue(h, m, s){
    return h + ":" + m+":" + s;
}

function returnSentValue(date, time){
    return date + " " + time;
}

const errors = [];

function validTime(item, count, idEl){

    function markInvalid (){
        try{
            $$("timeForm").markInvalid(idEl);
        } catch (err){
            errors_setFunctionError(
                err, 
                calendar_logNameFile, 
                "validTime element: " + idEl
            );
        }
        errors.push(idEl);
    }
    
    if (item > count){
        markInvalid ();
    }

    if ( !( /^\d+$/.test(item) ) ){
        markInvalid ();
    }

    if (item.length < 2){
        markInvalid ();
    }

    return errors;
}

function setValToProperty(sentVal, elem){
    const propId  = property.getValues().id;
    try{

        if (!errors.length){
       
            property.setValues({ 
                [elem.id] : sentVal
            }, true);

            if(propId){
                property.setValues({ 
                    id : propId
                }, true);

            }
            calendar_setDataToStorage(elem, sentVal);

            Action.destructItem($$("editTablePopupCalendar"));
        }
    } catch (err){
        errors_setFunctionError(
            err, 
            calendar_logNameFile, 
            "setValToProperty"
        );
    }
}

function inputItterate(name, count){
    const val = $$(name).getValue();
    validTime(val, count, name);
    return val;
}

function calendar_setDataToStorage(elem, value){
    const prop   = $$("editTableFormProperty");
    const editor = prop.getItem(elem.id);
    prop.callEvent("onNewValues", [value, editor]);
}


function calendar_submitClick (elem){
    errors.length  = 0;

    const calendar = $$("editCalendarDate");
    const form     = $$("table-editForm");

    const hour = inputItterate("hourInp", 23);
    const min  = inputItterate("minInp",  59);
    const sec  = inputItterate("secInp",  59);
  
    const calendarVal    = calendar.getValue();
    const fullFormatDate = formatDate("d.%m.%y");
    const dateVal        = fullFormatDate(calendarVal);

    const timeVal        = returnTimeValue(hour, min, sec);

    const sentVal = returnSentValue(dateVal, timeVal);
    setValToProperty(sentVal, elem);
 
    form.setDirty(true);

    return errors.length;
}

function isDirty(){

    let check = false;

    function checkDirty(el){
        if (el.config.dirtyProp && !check){
            check = true;
        }
    }

    checkDirty ($$("editCalendarDate"));
    checkDirty ($$("hourInp"         ));
    checkDirty ($$("minInp"          ));
    checkDirty ($$("secInp"          ));

    return check;
}

function closePopupClick (elem){
    const calendar = $$("editTablePopupCalendar");

    if (calendar){
        
        if (isDirty(calendar)){
    
            modalBox().then(function(result){

                if (result == 1){
                    Action.destructItem(calendar);
                }

                if (result == 2 && !calendar_submitClick(elem)){

                    Action.destructItem(calendar);

                }
            });
        } else {
            Action.destructItem(calendar);
        }
    }
}

function returnCalendar(){
    const calendar = {
        view        :"calendar",
        id          :"editCalendarDate",
        format      :"%d.%m.%y",
        borderless  :true,
        width       :300,
        height      :250,
        dirtyProp   :false,
        on          :{
            onChange:function(){
                this.config.dirtyProp = true;
                Action.enableItem($$("editPropCalendarSubmitBtn"));
            }
        }
    } ;

    return calendar;
}


function returnInput(idEl){
    const calendar = $$("editPropCalendarSubmitBtn");
    return {
        view        : "text",
        name        : idEl,
        id          : idEl,
        placeholder : "00",
        attributes  : { maxlength :2 },
        dirtyProp   : false,
        on          : {
            onKeyPress:function(){
                $$("timeForm").markInvalid(idEl, false);
                Action.enableItem(calendar);
            },

            onChange:function(){
                this.config.dirtyProp = true;
                Action.enableItem(calendar);
            }
        }
    };
}

function returnTimeSpacer (idEl){
    return {   
        template   : ":",
        id         : idEl,
        borderless : true,
        width      : 9,
        height     : 5,
        css        : "popup_time-spacer"
    };
}

function returnTimePrompt(){
 
    const prompt = {   
        template:"<div style='font-size:13px!important'>"+
        "Введите время в формате xx : xx : xx</div>",
        borderless:true,
        css:"popup_time-timeFormHead",
    };

    return prompt;
}

function returnTimeForm(){
    const timeForm = {
        view    : "form", 
        id      : "timeForm",
        height  : 85,
        type    : "space",
        elements: [
            returnTimePrompt(),
            { cols:[
                returnInput("hourInp"),
                returnTimeSpacer (1),
                returnInput("minInp"),
                returnTimeSpacer (2),
                returnInput("secInp")
            ]}
        ]
    };

    return timeForm;
}

function returnDateEditor(){
    const dateEditor = {
        rows:[
            returnCalendar(), 
            {height:10}, 
            returnTimeForm(),
            {height:10}, 
        ]
    };

    return dateEditor;
}

function returnSubmitBtn(elem){
    const btn = new buttons_Button({

        config   : {
            id       : "editPropCalendarSubmitBtn",
            hotkey   : "Ctrl+Space",
            value    : "Добавить значение", 
            click    : function(){
                calendar_submitClick(elem);
            },
        },
        titleAttribute : "Добавить значение в запись таблицы"
    
       
    }).maxView("primary");

    return btn;

}
function popupEdit(elem){

    const headline = "Редактор поля  «" + elem.label + "»";

    const popup = new popup_Popup({
        headline : headline,
        config   : {
            id        : "editTablePopupCalendar",
            width     : 400,
            minHeight : 300,
        },
        closeConfig: {
            currElem : elem
        },
        closeClick : closePopupClick ,
        elements : {
            rows : [
                returnDateEditor(),
                {height:15},
                returnSubmitBtn(elem),
            ]
          
        }
    });
    
    popup.createView ();
    popup.showPopup  ();

    setPropValues(elem);

}

function propBtnClick(elem){
    property = $$("editTableFormProperty");
    popupEdit(elem);
}


function createDateBtn(elem){

    const btn = new buttons_Button({

        config   : {
            width    : 30,
            height   : 29,
            icon     : "icon-calendar", 
            click    : function(){
                propBtnClick (elem);
            },
        },
        titleAttribute : "Открыть календарь"
    
       
    }).minView();


    try{
        $$("propertyRefbtnsContainer").addView(btn);
    } catch (err){
        errors_setFunctionError(err, calendar_logNameFile, "createDateBtn");
    }
}

function createDatePopup(el){
    createDateBtn(el);
    Action.showItem($$("tablePropBtnsSpace"));
}


;// CONCATENATED MODULE: ./src/js/components/table/editForm/propBtns/textarea.js







const textarea_logNameFile = "editForm => propBtns => textarea";

let textarea_property;

function setPropValue(el, value){ 
    textarea_property.setValues({ 
        [el.id]:[value] 
    }, true);
}

function textarea_setDataToStorage(el, value){
    const prop   = $$("editTableFormProperty");
    const editor = prop.getItem(el.id);

    prop.callEvent("onNewValues", [value, editor]);
}

function textarea_submitClick (el){
    try{
        const value = $$("editPropTextarea").getValue();
      
        setPropValue(el, value);
 
        $$("table-editForm").setDirty(true);

        textarea_setDataToStorage(el, value);
     
    } catch (err){
        errors_setFunctionError(
            err, 
            textarea_logNameFile, 
            "submitClick"
        );
    }

    Action.destructItem($$("editTablePopupText"));
}

function setTextareaVal(el){
    try{
        const area = $$("editPropTextarea");
        const val  = el.value;
        if (val){
            area.setValue(val);
        }
    } catch (err){
        errors_setFunctionError(
            err,
            textarea_logNameFile,
            "setTextareaVal"
        );
    }
}

function textarea_createModalBox(el, area){

    const value = area.getValue();
    const popup = $$("editTablePopupText");

    if (area.dirtyValue){
        modalBox().then(function(result){

            if (result == 1 || result == 2){
                if (result == 2){
                    setPropValue(el, value);
                }
                Action.destructItem(popup);
            }
        });
    } else {
        Action.destructItem(popup);
    } 
}

function textarea_closePopupClick(el){
  
    const area  = $$("editPropTextarea");

    if (area){
        textarea_createModalBox(el, area);
    }

    return textarea_closePopupClick;
}




function returnTextArea(){

    const textarea = { 
        view        : "textarea",
        id          : "editPropTextarea", 
        height      : 150, 
        dirtyValue  : false,
        placeholder : "Введите текст",
        on          : {
            onAfterRender: webix.once(function(){
                const k     = 0.8;
                const width = $$("editTablePopupText").$width;

                this.config.width = width * k;        
                this.resize();    
            }),
            onKeyPress:function(){
                Action.enableItem($$("editPropSubmitBtn"));

                $$("editPropTextarea").dirtyValue = true;
            },
        }
    };

    return textarea;
}

function textarea_returnSubmitBtn(el){
    const btn = new buttons_Button({

        config   : {
            id       : "editPropSubmitBtn",
            disabled : true,
            hotkey   : "Ctrl+Space",
            value    : "Добавить значение", 
            click    : function(){
                textarea_submitClick(el);
            },
        },
        titleAttribute : "Добавить значение в запись таблицы"
    
       
    }).maxView("primary");

    return btn;
}


function textarea_popupEdit(el){
    const headline = "Редактор поля  «" + el.label + "»";

    const popup = new popup_Popup({
        headline : headline,
        config   : {
            id        : "editTablePopupText",
            width     : 400,
            minHeight : 300,
    
        },

        closeConfig: {
            currElem : el,
        },

        closeClick :  textarea_closePopupClick(el),
    
        elements   : {
            padding:{
                left  : 9,
                right : 9
            },
            rows   : [
                returnTextArea(),
                {height : 15},
                textarea_returnSubmitBtn(el),
            ]
          
        }
    });
    
    popup.createView ();
    popup.showPopup  ();

    setTextareaVal(el);

    $$("editPropTextarea").focus();
}

function createBtnTextEditor(el){
    const btn = new buttons_Button({

        config   : {
            width    : 30,
            height   : 29,
            icon     : "icon-window-restore", 
            click    : function(){
                textarea_popupEdit(el);
            },
        },
        titleAttribute : "Открыть большой редактор текста"
    
       
    }).minView();
    
    try{
        $$("propertyRefbtnsContainer").addView(btn);
    } catch (err){
        errors_setFunctionError(err,textarea_logNameFile,"createBtnTextEditor");
    }
}



function createPopupOpenBtn(el){
    textarea_property = $$("editTableFormProperty");

    createBtnTextEditor(el);
    Action.showItem($$("tablePropBtnsSpace"));
}


;// CONCATENATED MODULE: ./src/js/components/table/editForm/propBtns/reference.js










const reference_logNameFile = "tableEditForm => propBtns => reference";


let selectBtn;
let idPost;

function toRefTable (refTable){ 
    let url = "tree/" + refTable;

    if (idPost){
        url = url + "?id=" + idPost;
    }

    if (refTable){
        Backbone.history.navigate(url, { trigger : true});
        window.location.reload();
    }

}


function setRefTable (srcTable){
    const table = $$("table");
    const cols  = table.getColumns();
    const tree  = $$("tree");

    try {
        cols.forEach(function(col){

            if ( col.id == srcTable ){
            
                const refTable = col.type.slice(10);

                toRefTable (refTable);
            
            }

        });
    } catch (err){
        errors_setFunctionError(
            err, 
            reference_logNameFile, 
            "setRefTable"
        );

        Action.hideItem($$("EditEmptyTempalte"));
    }
}


function reference_createModalBox (srcTable){
   
    modalBox().then(function(result){
        const editForm =  $$("table-editForm");

        if (result == 1 || result == 2){
            const idExists = $$("table-saveBtn").isVisible();

            const form = mediator.tables.editForm;
            
            if (result == 2){
                if (idExists){
                    form.put(false, true)
                    .then(function (result){
                        if (result){
                            editForm.setDirty(false);
                            setRefTable (srcTable);
                        }
                    });
                } else {
                    form.post(false, true)
                    .then(function (result){
                        if (result){
                            editForm.setDirty(false);
                            setRefTable (srcTable); 
                        }
                    });
                }
            } else {
                editForm.setDirty(false);
                setRefTable      (srcTable); 
            }
        }
    });
        
    
}

function findIdPost(editor){
    const prop = $$("editTableFormProperty");
    const item = prop.getItem(editor);
    return item.value;
}

function btnClick (idBtn){
    const config      = $$(idBtn).config;
    const srcTable    = config.srcTable;
    const isDirtyForm = $$("table-editForm").isDirty();
    idPost            = findIdPost(config.idEditor);
    
    if (isDirtyForm){
        reference_createModalBox (srcTable);
    } else {
        setRefTable    (srcTable);
    }
}

function reference_btnLayout(idEditor){

    const btn = new buttons_Button({

        config   : {
            width    : 30,
            height   : 29,
            idEditor : idEditor,
            icon     : "icon-share-square-o", 
            srcTable : selectBtn,
            click    : function(id){
                btnClick (id);
            },
        },
        titleAttribute : "Перейти в родительскую таблицу"
    
       
    }).minView();

    try{
        $$("propertyRefbtnsContainer").addView(btn);
    } catch (err){
        errors_setFunctionError(err, reference_logNameFile, "btnLayout");
    }
}

function createRefBtn(btn){
    selectBtn = btn;
    reference_btnLayout(btn);
    Action.showItem($$("tablePropBtnsSpace"));
}



;// CONCATENATED MODULE: ./src/js/components/table/editForm/createProperty.js











const createProperty_logNameFile = "tableEditForm => createProperty";

function createDateEditor(){
    webix.editors.$popup = {
        date:{
           view : "popup",
           body : {
            view        :"calendar",
            weekHeader  :true,
            events      :webix.Date.isHoliday,
            timepicker  : true,
            icons       : true,
           }
        }
     };
}



function createEmptySpace(){
    $$("propertyRefbtnsContainer").addView({
        height : 29,
        width  : 1
    });
}


function createBtnsContainer(refBtns){
    try{
        refBtns.addView({
            id   : "propertyRefbtnsContainer",
            rows : []
        });
    } catch (err){
        errors_setFunctionError(
            err, 
            createProperty_logNameFile, 
            "createBtnsContainer"
        );
    }
}

function setToolBtns(){
    const property      = $$("editTableFormProperty");
    const refBtns       = $$("propertyRefbtns");
    const propertyElems = property.config.elements;


    if (!(refBtns._cells.length)){

        if (!$$("propertyRefbtnsContainer")){
            createBtnsContainer(refBtns);
        }

        propertyElems.forEach(function(el){
          
            if (el.type == "combo"){
                createRefBtn(el.id);

            } else if (el.customType == "popup"){
                createPopupOpenBtn(el);
                
            } else if (el.type == "customDate") {
                createDatePopup(el);

            } else {    
                createEmptySpace();

            }
        });
    }
}

function addEditInputs(arr){
    const property = $$("editTableFormProperty");
    property.define("elements", arr);
    property.refresh();
}

function createProperty_returnTemplate(el){
    const template = {
        id      : el.id,
        label   : el.label, 
        unique  : el.unique,
        notnull : el.notnull,
        length  : el.length,
        value   : returnDefaultValue (el),

    };

    return template;
}



function createDateTimeInput(el){
    const template =  createProperty_returnTemplate(el);
    template.type  = "customDate";

    return template;

}


function comboTemplate(obj, config){
    const value = obj.value;
    const item  = config.collection.getItem(value);
    return item ? item.value : "";
}
function createReferenceInput(el){
   
    const template =  createProperty_returnTemplate(el);    
    
    let findTableId   = el.type.slice(10);
    
    template.type     = "combo";
    template.css      = el.id + "_container";
    template.options  = getComboOptions(findTableId);
    template.template = function(obj, common, val, config){
       return comboTemplate(obj, config);
    };

    return template;
}


function createBooleanInput(el){
    const template =  createProperty_returnTemplate(el);    
 
    template.type     = "combo";
    template.options  = [
        {id:1, value: "Да"},
        {id:2, value: "Нет"}
    ];
    template.template = function(obj, common, val, config){
        return comboTemplate(obj, config);
    };

    return template;
}


function createProperty_createTextInput(el){
    const template =  createProperty_returnTemplate(el);

    if (el.length == 0 || el.length > 512){
        template.customType="popup";

    } 
    template.type = "text";
    return template;
}

function addIntegerType(el){
    const template =  createProperty_createTextInput(el);
    template.customType = "integer";
    return template;
}

function returnPropElem(el){
    let propElem;

    if (el.type == "datetime"){
        propElem = createDateTimeInput(el);

    } else if (el.type.includes("reference")) {
        propElem = createReferenceInput(el);

    } else if (el.type.includes("boolean")) {
        propElem = createBooleanInput(el);

    } else if (el.type.includes("integer")) {
        propElem = addIntegerType(el);

    } else {
        propElem = createProperty_createTextInput(el);
    }

    return propElem;
}


function createProperty (parentElement) {

    const property         = $$(parentElement);
    const columnsData      = $$("table").getColumns(true);
    const elems            = property.elements;
    const propertyLength   = Object.keys(elems).length;

    try {
        
        if ( !propertyLength ){
            const propElems = [];

            columnsData.forEach((el) => {

                const propElem = returnPropElem(el);
                propElems.push(propElem);

            });

        
            createDateEditor();
            addEditInputs   (propElems);
            setToolBtns     ();
    

        } else {
            property.clear();
            property.clearValidation();

            if(parentElement == "table-editForm"){
                $$("table-delBtnId").enable();
            }
        }
    } catch (err){
        errors_setFunctionError(
            err, 
            createProperty_logNameFile, 
            "createEditFields"
        );
    }
}


;// CONCATENATED MODULE: ./src/js/components/table/editForm/editFormMediator/setState.js






const setState_logNameFile = "table => editForm => setState";


function initPropertyForm(){
    const property = $$("editTableFormProperty");
    Action.showItem(property);
    property.clear();
    $$("table-editForm").setDirty(false);
}



function setWorkspaceState (table){
    const emptyTemplate = $$("EditEmptyTempalte");
    function tableState(){
        table.filter(false);
        table.clearSelection();
    }

    function buttonsState(){
        $$("table-delBtnId")   .disable();
        $$("table-saveBtn")    .hide();
        $$("table-saveNewBtn") .show();
        $$("table-newAddBtnId").disable();
    }

    try{
        tableState();
        buttonsState();
        createProperty("table-editForm");
        Action.hideItem(emptyTemplate);
    } catch (err){
        errors_setFunctionError(
            err,
            setState_logNameFile,
            "setWorkspaceState"
        );
    }

}


function setStatusProperty(status){
    const prop = $$("editTableFormProperty");

    if (prop){
        prop.config.statusForm = status;
    }
}

function editTablePostState(){
    const table = $$("table");
    initPropertyForm();
    setWorkspaceState (table);
    setStatusProperty("post");
 
    mediator.linkParam(true, {"view": "edit"});
}

//select exists entry
function setPropertyWidth(prop){
    const form = $$("table-editForm");

    if (prop && !(prop.isVisible())){
        prop.show();

        // if (window.innerWidth > 850){
        //    // form.config.width = 350;   
        //    // form.resize();
        // }
    }

}

function adaptiveView (editForm){
    try {
        const container = $$("container");

        if (container.$width < 850){
            Action.hideItem($$("tree"));

            if (container.$width < 850){
                Action.hideItem($$("tableContainer"));
                editForm.config.width = window.innerWidth;
                editForm.resize();
                Action.showItem($$("table-backTableBtn"));
            }
        }
    } catch (err){
        errors_setFunctionError(
            err,
            setState_logNameFile,
            "adaptiveView"
        );
    }
}

function editTablePutState(){
  
    try{
        const editForm  = $$("table-editForm");
        setPropertyWidth ($$("editTableFormProperty"));
        editForm.setDirty(false);
        Action.showItem  ($$("table-saveBtn"    ));

        Action.hideItem  ($$("table-saveNewBtn" ));
        Action.hideItem  ($$("EditEmptyTempalte"));

        Action.enableItem($$("table-delBtnId"   ));
        Action.enableItem($$("table-newAddBtnId"));
   
        if( !(editForm.isVisible()) ){
            mediator.tables.defaultState("filter");
            buttons_Button.transparentDefaultState();
            adaptiveView (editForm);
            editForm.show();
        }

        setStatusProperty("put");
 
    } catch (err){   
        errors_setFunctionError(
            err,
            setState_logNameFile,
            "editTablePutState"
        );
    }
    
}

function defPropertyState(){
    mediator.tables.editForm.clearTempStorage();
    const property = $$("editTableFormProperty");

    if (property){
        property.clear();
        property.hide();
    }
  
}

function setState_unsetDirtyProp(){
    $$("table-editForm").setDirty(false);
}

function editTableDefState(){
    setState_unsetDirtyProp();
    
    Action.hideItem   ($$("table-editForm"    ));
    Action.hideItem   ($$("tablePropBtnsSpace"));
    Action.hideItem   ($$("table-saveNewBtn"  ));
    Action.hideItem   ($$("table-saveBtn"     ));

    Action.showItem   ($$("tableContainer"    ));
    Action.showItem   ($$("EditEmptyTempalte" ));

    Action.enableItem ($$("table-newAddBtnId" ));

    Action.removeItem ($$("propertyRefbtnsContainer"));

    defPropertyState();
     
    setStatusProperty(null);
}


;// CONCATENATED MODULE: ./src/js/components/table/editForm/validation.js



const validation_logNameFile = "tableEditForm => validation";

function validateProfForm (){

    const errors = {};
    const messageErrors = [];
    const property      = $$("editTableFormProperty");
    
    function checkConditions (){ 
       
        const propVals = Object.keys(property.getValues());

        propVals.forEach(function(el){


            const propElement = property.getItem(el);
            const values      = property.getValues();

            let propValue  = values[el];
            errors[el] = {};

            function numberField(){
                
                function containsText(str) {
                    return /\D/.test(str);
                }

       
                if (propElement.customType              &&
                    propElement.customType == "integer" ){

                    const check =  containsText(propValue) ;

                    if ( check ){
                        errors[el].isNum = "Данное поле должно содержать только числа";
                    } else {
                        errors[el].isNum = null;
                    }
                       
                }
            }

            function dateField(){

                function getAllIndexes(arr, val) {
                    let indexes = [], i;
                    for(i = 0; i < arr.length; i++){
                        if (arr[i] === val){
                            indexes.push(i);
                        }
                    }
                         
                    return indexes;
                }

                function isTrueLength(arr){
                    if (arr.length === 2){
                        return true;
                    }
                }

                function isTrueIndexes(arr, first, second){
                    if (arr[0] == first && arr[1] == second){
                        return true;
                    }
                }

                function checkArr(arr, firstIndex, secondIndex){
                    if (isTrueLength(arr) && 
                        isTrueIndexes(arr, firstIndex, secondIndex )){
                            return true;
                    }
                }
 
                function findDividers(arr){
                    if (arr.length === 17) {
                        const dateDividers = getAllIndexes(arr, ".");
                        const timeDividers = getAllIndexes(arr, ":");

                        const dateResult = checkArr(dateDividers, 2,  5 );
                        const timeResult = checkArr(timeDividers, 11, 14);

                        if (dateResult && timeResult){
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                }
         
                if (propElement.type                 &&
                    propElement.type == "customDate" &&
                    propValue                        ){
                 
                    const dateArray = propValue.split('');
                    
                    let check      = findDividers(dateArray);
                    let countEmpty = 0;
                         
                    const x = propValue.replace(/\D/g, '')
                    .match(/(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})/);
        
                    for (let i = 1; i < 7; i++) {

                        if (x[i].length == 0){
                            countEmpty++;
                        }

                        if (x[i].length !== 2){
                         
                            if (!check){
                                check = true;
                            }
                        }
                    }


                    if ( countEmpty == 6 ){
                        errors[el].date = null;

                    } else {

                        if( (x[1] > 31 || x[1] < 1) ||
                            (x[2] > 12 || x[2] < 1) ||

                            x[4] > 23 ||
                            x[5] > 59 ||
                            x[6] > 59 ){
                                check = true;
                            }
      
                        if ( check ) {
                            errors[el].date = 
                            "Неверный формат даты. Введите дату в формате xx.xx.xx xx:xx:xx";
    
                        } else {
                            errors[el].date = null;
                        }
                    }
                       
                }
       
            }

            function valLength(){ 
                try{
               
                    if(propValue){
                        
                        if (propValue.length > propElement.length && propElement.length !== 0){
                            errors[el].length = "Длина строки не должна превышать " + propElement.length + " симв.";
                        } else {
                            errors[el].length = null;
                        }
                    }
                } catch (err){
                    errors_setFunctionError(err,validation_logNameFile,"valLength");
                }
            }

            function valNotNull (){
                try{
                    if ( propElement.notnull == true && propValue.length == 0 ){
                        errors[el].notnull = "Поле не может быть пустым";
                    } else {
                        errors[el].notnull = null;
                    }
                } catch (err){
                    errors_setFunctionError(err,validation_logNameFile,"valNotNull");
                }
            }

            function valUnique (){
                try{
                    errors[el].unique = null;
                                  
                    if (propElement.unique == true){

                        const tableRows   = Object.values($$("table").data.pull);

                        tableRows.forEach(function(row){
                            let tableValue = row[el];

                            function numToString(element){
                                if (element && typeof element === "number"){
                                    return element.toString();
                                } else {
                                    return element;
                                }
                            }

                            tableValue = numToString(tableValue);
                            propValue  = numToString(propValue);
                   
                            if (tableValue && typeof tableValue == "number"){
                                tableValue = tableValue.toString();
                            }

                            if (propValue && tableValue){
                                const isIdenticValues = propValue.localeCompare(tableValue) == 0;
                                const tableElemId     = row.id;
                                const propElemId      = values.id;

                                if (isIdenticValues && propElemId !== tableElemId){
                                    errors[el].unique = "Поле должно быть уникальным";
    
                                } 
                              
                            }
                        });
                    }
                } catch (err){
                    errors_setFunctionError(err, validation_logNameFile, "valUnique");
                }
            }
           
            dateField   ();
            numberField ();
            valLength   ();
            valNotNull  ();
            valUnique   ();
        });
    }

    function createErrorMessage (){
     
        function findErrors (){
            Object.values(errors).forEach(function(col, i){

                function createMessage (){
                    Object.values(col).forEach(function(error,e){
                        if (error !== null){
                            let nameCol = Object.keys(errors)[i];
                            let textError = error;
                            let typeError = Object.keys(col)[e];
                            messageErrors.push({nameCol,typeError,textError})
                        }
                        
                    });
                    return messageErrors;
                }

                createMessage ();
        
            });
        }

        findErrors ();
        
    }
    try{
        checkConditions ();
        createErrorMessage ();
    } catch (err){
        errors_setFunctionError(err, validation_logNameFile, "validateProfForm");
    }

  
    if (messageErrors.length){
     
        messageErrors.forEach(function(prop){
            const item =  property.getItem(prop.nameCol);
            item.css = "propery-error";
            property.refresh();

        });

       
    }
    return messageErrors;
}

function setLogError (){
    try{
        const table = $$("table");
        validateProfForm ().forEach(function(el){

            let nameEl;

            table.getColumns(true).forEach(function(col){
             
                if (col.id == el.nameCol){
                    nameEl = col.label;
                }
            });

            setLogValue("error", el.textError + " (Поле: " + nameEl + ")");
        });

    } catch (err){
        errors_setFunctionError(err, validation_logNameFile, "setLogError");
    }
}


function uniqueData (itemData){
    const validateData = {};
    try{
        const table      = $$("table");
        const dataValues = Object.values(itemData);

        dataValues.forEach(function(el, i){

            const oldValues    = table.getItem(itemData.id);
            const oldValueKeys = Object.keys(oldValues);

            function compareVals (){
                const newValKey = Object.keys(itemData)[i];

                oldValueKeys.forEach(function(oldValKey){
                    if (oldValKey == newValKey){
                        
                        if (oldValues   [oldValKey] !== Object.values(itemData)[i]){
                            validateData[newValKey]  =  Object.values(itemData)[i];
                        } 
                        
                    }
                }); 
            }
            compareVals ();
        });
    } catch (err){
        errors_setFunctionError(err, validation_logNameFile, "uniqueData");
    }

    return validateData;
}




;// CONCATENATED MODULE: ./src/js/components/table/editForm/editFormMediator/formAcitions.js










const formAcitions_logNameFile = "table => formActions";

function formAcitions_unsetDirtyProp(){
    $$("table-editForm").setDirty(false);
    mediator.tables.editForm.clearTempStorage();
}

function updateTable (itemData){
    try{
        const table = $$("table");
        const id    = itemData.id;
        table.updateItem(id, itemData);
        table.clearSelection();
    } catch (err){
        errors_setFunctionError(
            err,
            formAcitions_logNameFile,
            "updateTable"
        );
    }  
    
}



function formAcitions_dateFormatting(arr){
    const vals          = Object.values(arr);
    const keys          = Object.keys(arr);
    const formattingArr = arr;

    keys.forEach(function(el, i){
        const prop       = $$("editTableFormProperty");
        const item       = prop.getItem(el);
        const formatData = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");

        if ( item.type == "customDate" ){
            formattingArr[el] = formatData(vals[i]);
        }
    });


    return formattingArr;
}

function formAcitions_formattingBoolVals(arr){
    const table = $$( "table" );
    const cols  = table.getColumns();
    cols.forEach(function(el,i){

        if ( arr[el.id] && el.type == "boolean" ){
            if (arr[el.id] == 2){
                arr[el.id] = false;
            } else {
                arr[el.id] = true;
            }
        }
    });

    return arr;

} 

function formAcitions_createSentObj (values){
    const uniqueVals     = uniqueData     (values    );
    const dateFormatVals = formAcitions_dateFormatting (uniqueVals);
    return formAcitions_formattingBoolVals(dateFormatVals);
}

function putTable (updateSpace, isNavigate, form){
    try{    
        const property = $$("editTableFormProperty");
        const itemData = property.getValues();   
        const currId   = getItemId ();
        const isError  = validateProfForm().length;
        const id       = itemData.id;

        const isDirtyForm = $$("table-editForm").isDirty();
 
        if (!isError && id && isDirtyForm){
          
            const path    = "/init/default/api/" + currId + "/" + id;
            const sentObj = formAcitions_createSentObj (itemData);
    
            const putData = webix.ajax().put(path, sentObj);
       
            return putData.then(function (data){
                data = data.json();
             
                if (data.err_type == "i"){


                    if (updateSpace){
                        form.defaultState();
                    }

                 // для модальных окон без перехода на другую стр.
                    if (updateSpace || !isNavigate){ 
                        updateTable   (itemData);
                    }

                    formAcitions_unsetDirtyProp();

                    setLogValue(
                        "success", 
                        "Данные сохранены", 
                        currId
                    );

                    return true;

                } else {
                    setLogValue(
                        "error", 
                        formAcitions_logNameFile + 
                        " function saveItem: " + 
                        data.err
                    );

                    return false;
                }
            }).fail(function(err){
                setAjaxError(
                    err, 
                    formAcitions_logNameFile, 
                    "saveItem"
                );
            });
                

        } else {
            if (isError){
                validateProfForm()
                .forEach(function(){
                    setLogError ();
                });
            } else if (!id){
                setLogValue(
                    "error", 
                    "Поле id не заполнено"
                );
            } else if (!isDirtyForm){
                setLogValue(
                    "error", 
                    "Обновлять нечего"
                );
            }
           
        }
    } catch (err){
        errors_setFunctionError(
            err, 
            formAcitions_logNameFile, 
            "saveItem"
        );
    }
}


// post
function removeNullFields(arr){
    const vals    = Object.values(arr);
    const keys    = Object.keys(arr);
    const sentObj = {};

    vals.forEach(function(el,i){
        if (el){
            sentObj[keys[i]]= el;
        }
        formAcitions_dateFormatting(arr);
    });

    return sentObj;
}

function formAcitions_setCounterVal (remove){
    try{
        const counter  = $$("table-findElements");
      
        const reccount = $$("table").config.reccount;

        let full;

        if (remove){
            full = reccount - 1;

        } else {
            full = reccount + 1;

        }

        $$("table").config.reccount = full;

        const count = {full : full};

        counter.setValues(JSON.stringify(count));
    } catch (err){
        errors_setFunctionError(
            err, 
            formAcitions_logNameFile, 
            "setCounterVal"
        );
    }
}

function addToTable(newValues){
    const table  = $$("table");
    const offset = table.config.offsetAttr;

    if (newValues.id <= offset ){  // изменить 
        table.add(newValues); 
    }

    formAcitions_setCounterVal ();
}

function createPostObj(newValues){
    const notNullVals    = removeNullFields(newValues);
    const dateFormatVals = formAcitions_dateFormatting  (notNullVals);
    return formAcitions_formattingBoolVals(dateFormatVals);
}


function postTable (updateSpace, isNavigate, form){
    const currId  = getItemId ();
    const isError = validateProfForm().length;
  
    if (!isError){
        const property  = $$("editTableFormProperty");
        const newValues = property.getValues();
        const postObj   = createPostObj(newValues);
 
        const path      = "/init/default/api/" + currId;
        return  webix.ajax().post(path, postObj)
            .then(function(data){
   
            data         = data.json();
            const id     = data.content.id;
            newValues.id = id;

 
            if (data.err_type == "i" && id){
           

                if (updateSpace){
                    form.defaultState();
                }

            // для модальных окон без перехода на другую стр.
                if (updateSpace || !isNavigate){ 
                    addToTable    (newValues);
                }

                formAcitions_unsetDirtyProp();

                setLogValue(
                    "success",
                    "Данные успешно добавлены",
                    currId
                );

                return true;
                
            } else {
               
                const errs   = data.content.errors;
                let msg      = "";
                if (errs){
                    const values = Object.values(errs);
                    values.forEach(function(err, i){
                        const errorField = Object.keys(errs)[i];
                        msg += err + " (Поле: " + errorField + "); ";
                    });
                } else {
                    msg = data.err; 
                }

                setLogValue(
                    "error",
                    "editTableForm function saveNewItem: " + 
                    msg
                );

                return false;
            }
        }).fail(function(err){
            console.log(err);
            setAjaxError(
                err, 
                "tableEditForm => btns",
                "saveNewItem"
            );
            return false;
        });
    

    } else {
        setLogError ();
    }
}


// remove
function removeRow(){
    const table       = $$( "table" );
    const tableSelect = table.getSelectedId().id;

    if(table){
        table.remove(tableSelect);
    }

}

function removeTableItem(form){

    const currId = getItemId ();

    popupExec("Запись будет удалена").then(
        function(){
        
            const formValues = $$("editTableFormProperty").getValues();
            const id    = formValues.id;
            const path  ="/init/default/api/" + currId + "/" + id + ".json";
            const removeData = webix.ajax().del(path, formValues);

            removeData.then(function(data){
                data = data.json();

                if (data.err_type == "i"){
                    
                    form.defaultState();

                    formAcitions_unsetDirtyProp();
         
                    setLogValue(
                        "success",
                        "Данные успешно удалены"
                    );
                    removeRow();
                    formAcitions_setCounterVal (true);
                } else {
                    setLogValue(
                        "error",
                        "editTableForm function removeItem: " +
                        data.err
                    );
                }
            });
            removeData.fail(function(err){
                setAjaxError(
                    err, 
                    formAcitions_logNameFile,
                    "removeItem"
                );
            });
    
        }
    );

}


;// CONCATENATED MODULE: ./src/js/components/table/editForm/editFormMediator/editFormClass.js





  



class EditForm {
    static createForm (){
        $$("flexlayoutTable").addView(editTableBar());
        Action.enableItem($$("table-newAddBtnId"));
    }

    static defaultState (){
        editTableDefState();
    }

    static putState     (){
       editTablePutState();
    }

    static postState    (){
        editTablePostState();
    }

    static put (updateSpace = true, isNavigate = false){
        return putTable (updateSpace, isNavigate, this); 
    }

    static post (updateSpace = true, isNavigate = false){
        return postTable(updateSpace, isNavigate, this);
    }

    static remove (){
        removeTableItem(this);
    }

    static clearTempStorage(){
        $$("editTableFormProperty").config.tempData = false;
        webix.storage.local.remove("editFormTempData");
    }


}

;// CONCATENATED MODULE: ./src/js/components/table/onFuncs.js
 











const onFuncs_logNameFile = "table => onFuncs";

function toEditForm (nextItem) {
    const valuesTable = $$("table").getItem(nextItem); 

    function setViewDate(){
        const parseDate = webix.Date.dateToStr("%d.%m.%y %H:%i:%s");
 
        const values    = Object.values(valuesTable);
    
        try{
            values.forEach(function(el, i){
                if(el instanceof Date){
           
                    const key        = Object.keys(valuesTable)[i];
                    const value      = parseDate(el);
                    valuesTable[key] = value;
                }
            
            });
        } catch (err){ 
            errors_setFunctionError(err, onFuncs_logNameFile, "setViewDate");
        }
    }

    
    EditForm.putState();
    setViewDate();
    const prop = $$("editTableFormProperty");
    prop.setValues(valuesTable);
 

}


const onFuncTable = {

    onBeforeLoad:function(){
        this.showOverlay("Загрузка...");
    },

    onBeforeEditStop:function(state, editor){
        const table      = $$("table");
        try {
            if(state.value != state.old){

                const idRow = editor.row;
                const col   = editor.column;
                const value   = state.value;

                const item     = this.getItem(editor.row);

                const oldValue = item[editor.column];

                item[editor.column] = value;

                const property  = $$("editTableFormProperty");
                property.setValues(item);

                table.updateItem (idRow, {[col] : oldValue});
  
                mediator.tables.editForm.put(false);

            }
        } catch (err){
            errors_setFunctionError(
                err, 
                onFuncs_logNameFile, 
                "onBeforeEditStop"
            );
        }

    },

    onBeforeSelect:function(selection){
        const table     = $$("table");
        const nextItem   = selection.id;

        function successAction(){
            $$("table-editForm").setDirty(false);
            table.select(selection.id);
        }

        function modalBoxTable (){
  
            try{ 
                modalBox().then(function(result){
                    const saveBtn  = $$("table-saveBtn");
                    const form     = mediator.tables.editForm;
      
                    if (result == 1){
                        mediator.tables.editForm.defaultState();
                        table.select(selection.id);
                    } 

                    else if (result == 2){
                    
                        if (saveBtn.isVisible()){
                            form.put(false)
                            .then(function (result){
                     
                                if (result){
                                    successAction();
                                }

                            });
                        } else {
                            form.post(false)
                            .then(function (result){

                                if (result){
                                    successAction();
                                }

                            });
                        }
                    }

                });

                return false;
          
            } catch (err){ 
                errors_setFunctionError(
                    err,
                    onFuncs_logNameFile,
                    "onBeforeSelect => modalBoxTable"
                );
            }
        }
        const name = "table-editForm";
        const isDirtyForm = $$(name).isDirty();
        if (isDirtyForm){
            modalBoxTable ();
            return false;
        } else {
            createProperty(name);
            toEditForm(nextItem);
        }
    },
    onAfterSelect:function(row){
       
       // mediator.tables.setSize();
        mediator.linkParam(true, {id: row.id});
    },

    onAfterUnSelect:function(){
        mediator.linkParam(false, "id");
    },

    onAfterLoad:function(){
 
        try {
            this.hideOverlay();

            defaultStateForm ();
        } catch (err){
            errors_setFunctionError(
                err,
                onFuncs_logNameFile,
                "onAfterLoad"
            );
        }
    },  

    onAfterDelete: function() {
        
        function setOverlayState(){
            const id    = getTable().config.id;
            const table = $$(id);


            if ( !table.count() ){
                table.showOverlay("Ничего не найдено");
            } else {
                table.hideOverlay();
            }
        }

        setOverlayState();
      
    },

    onAfterAdd: function() {
        this.hideOverlay();
    },


};



;// CONCATENATED MODULE: ./src/js/components/table/_layout.js








const limitLoad   = 80; 


function _layout_table (idTable, onFunc, editableParam = false) {
    return {
        view        : "datatable",
        id          : idTable,
        css         : "webix_table-style webix_header_border webix_data_border ",
        autoConfig  : true,
        editable    : editableParam,
        editaction  :"dblclick",
        minHeight   : 350,
    //   height:200,
        footer      : true,
        select      : true,
        resizeColumn: true,
        sort        : [],
        offsetAttr  : limitLoad,
        on          : onFunc,
        onClick     :{
            "wxi-trash"     :function (event, config, html){
                trashBtn(config,idTable);
            },

            "wxi-angle-down":function (event, cell, target){
                showPropBtn (cell);
            },
            
        },
        ready:function(){ 
            const firstCol = this.getColumns()[0];
        },
    };
}

const tableContainer = {   
    id  : "tableContainer",
    rows: [
        tableToolbar ("table"),
        {   view  : "resizer",
            class : "webix_resizers"
        },
        _layout_table ("table", onFuncTable, true)
    ]
};

function returnLayoutTables(id){

    const layout = {   
        id      : id, 
        hidden  : true, 
        view    : "scrollview", 
        body    : { 
            view  : "flexlayout",
            id    : "flexlayoutTable", 
            cols  : [


                {cols : [
                    tableContainer,

                    {   view  : "resizer",
                        class : "webix_resizers", 
                        id    : "tableBarResizer" 
                    },
              
                    editTableBar(),
                    filterForm(),
                ]}
                                        
         
                
            ]
        }
    
    };
    return layout;
}



const tableLayout =  {   
    view:"scrollview", 
    body: {
        view:"flexlayout",
        cols:[
            _layout_table ("table-view"),
    
        ]
    }
};

const hiddenResizer = {   
    view   : "resizer",
    id     : "formsTools-resizer",
    hidden : true,
    class  : "webix_resizers",
};

const formsContainer = {   
    id:"formsContainer",
    rows:[
        tableToolbar("table-view", true ),
        {   view : "resizer", 
            class: "webix_resizers"
        },
        tableLayout, 
    ]
};

const _layout_tools = {   
    id       : "formsTools",
    hidden   : true,  
    minWidth : 190, 
    rows     : [
        viewTools,
    ]
};

function returnLayoutForms(id){  
   
    const layout =  {   
        view   : "layout",
        id     : id, 
        css    : "webix_tableView",
        hidden : true,                       
        rows   : [
            {cols : [
                formsContainer, 
                hiddenResizer,
                propertyTemplate("propTableView"),
                _layout_tools,
            ]},

        
        ],


    };

    return layout;
}



;// CONCATENATED MODULE: ./src/js/components/table/lazyLoad.js


const lazyLoad_limitLoad   = 80;


function refreshTable(table){
    const tableId           = table.config.idTable;
    const oldOffset         = table.config.offsetAttr;

    const newOffset         = oldOffset + lazyLoad_limitLoad;

    table.config.offsetAttr = newOffset;
    table.refresh();

    createTableRows ("table", tableId, oldOffset);
}


function sortTable(table){
    table.attachEvent("onAfterSort", function(id, sortType){
        
        const sortInfo = {
            idCol : id,
            type  : sortType
        };

        table.config.sort       = sortInfo;
        table.config.offsetAttr = 0;


        webix.storage.local.put(
            "tableSortData", 
            sortInfo
        );

        table.clearAll();
        refreshTable(table);
        
    });
}


function scrollTableLoad(table){
    table.attachEvent("onScrollY", function(){
        const table        = this;
        const scrollState  = table.getScrollState();
        const maxHeight    = table._dtable_height;
        const offsetHeight = table._dtable_offset_height;
 
        if (maxHeight - scrollState.y == offsetHeight){ 
            refreshTable(table);
        }
      

    });
}



;// CONCATENATED MODULE: ./src/js/components/table/onResize.js
function onResizeTable(table){
    table.attachEvent("onResize", function(width){
        const cols = table.getColumns();
        width -= 17;
        let sum = 0;
        cols.forEach(function(col,i){
            sum += col.width;
        });

        if (sum < width){
            const different = width - sum;
 
            const lastCol = cols.length - 1;
            cols.forEach(function(col,i){
                if (i == lastCol){
                    const newWidth = col.width + different;
                    table.setColumnWidth(col.id, newWidth);
                }
        
            });

        } 

    });
}


;// CONCATENATED MODULE: ./src/js/components/table/onColumnResize.js

let cols;
let lengthCols;

function returnCol(index){
    const currIndex = lengthCols - index;
    return cols[currIndex];
}

function returnSumWidthCols(){
    let sum = 0;
    cols.forEach(function(col){
        sum += col.width;
    });
    return sum;
}

function setNewWidth(table){
    const lastCol      = returnCol(1);
    const scrollWidth  = 17;
    const widthTable   = table.$width - scrollWidth;
    const sumWidthCols = returnSumWidthCols();
    
    if (sumWidthCols < widthTable && lastCol){
        const different = widthTable - sumWidthCols;
        const newWidth  = lastCol.width + different;
        
        table.setColumnWidth(lastCol.id, newWidth);

    }
}


function columnResize(table){

    table.attachEvent("onColumnResize", function(id, newWidth, oldWidth, userAction){
  
        cols       = table.getColumns();
        lengthCols = cols.length;
  
        if (userAction){
            const lastResizer = 2;
            const isExists    = lengthCols - lastResizer;
            const prevCol     = returnCol(lastResizer);
         
        //    if ( isExists > -1 && prevCol.id == id){ // это последняя колонка
                setNewWidth(table);
               
           // }
        }

    });
}


;// CONCATENATED MODULE: ./src/js/components/table/columnsSettings/columnsWidth.js


function setColsWidthStorage(table){
    table.attachEvent("onColumnResize",function(id, newWidth, oldWidth, action){
        if (action){
           
            const cols   = table.getColumns();
            const values = [];

            cols.forEach(function(el){

                values.push({
                    column  : el.id, 
                    position: table.getColumnIndex(el.id),
                    width   : el.width.toFixed(2)
                });
            });
            postPrefsValues(values);
        }
    });     
}


;// CONCATENATED MODULE: ./src/js/components/table/filterForm/setDefaultState.js



function filterFormDefState(){
    const filterContainer = $$("filterTableBarContainer");
    const inputs          = $$("inputsFilter");

    Filter.clearAll();
    Filter.showApplyNotify(false);

    if (filterContainer && filterContainer.isVisible()){
        Action.hideItem  (filterContainer);
    }

    Action.disableItem($$("btnFilterSubmit"));
    Action.disableItem($$("filterLibrarySaveBtn"));
    Action.disableItem($$("resetFilterBtn"));

    Action.removeItem(inputs);

    Action.showItem($$("filterEmptyTempalte"));
 
}


;// CONCATENATED MODULE: ./src/js/components/table/formTools/setDefaultState.js


function toolsDefState(){
    const property = $$("propTableView");
    
    if (property && property.isVisible()){
        property.clear();
        Action.hideItem(property);
    }
   
    Action.hideItem($$("formsTools"    ));
    Action.showItem($$("formsContainer"));

}




;// CONCATENATED MODULE: ./src/js/components/table/_tableMediator.js















const _tableMediator_logNameFile = "table => _tableMediator";

class Tables {
    constructor (){
        this.name = "tables";

        this.components = {
            editForm : new EditForm()
        };
    }

    create(){
        try{
            if (!$$(this.name)){

                $$("container").addView(
                    returnLayoutTables(this.name),
                5);

                $$("filterEmptyTempalte").attachEvent("onViewShow",function(){
                    Action.hideItem($$("templateInfo"));
                });

                const tableElem = $$("table");
                sortTable          (tableElem);
                onResizeTable      (tableElem);
                scrollTableLoad    (tableElem);
                setColsWidthStorage(tableElem);
                columnResize       (tableElem);
            }
        } catch (err){
            errors_setFunctionError(
                err, 
                _tableMediator_logNameFile, 
                "createTables"
            );
        }
    }

    showView(){
        Action.showItem($$(this.name));   
    }

    load(id){
        createTable("table", id);
    }

    get editForm (){
        return EditForm;
    }
  
    defaultState(type){
        if (type == "edit"){
            EditForm["default"]();
        } else if (type == "filter"){
            filterFormDefState();
        } else {
            EditForm.defaultState();
            filterFormDefState   ();
        }
  
       
    }

    setSize(full){
        const containerWidth = $$("flexlayoutTable").$width;
        const table          = $$("table");
        const emptySpace     = 30;
    
        if (full){
            const width        = containerWidth - emptySpace;
            table.config.width = width;

            table.resize();
            console.log(table.$width,width)
        } else {

            const formWidth  = $$("table-editForm").$width;
            const tableWidth = table.$width;
       
            const difference = containerWidth - formWidth - emptySpace;
            
            if (tableWidth > difference){
                table.config.width = difference;
                table.resize();
    
            }
            
        }
      
    }

}


class Forms {
    constructor (){
        this.name = "forms";
    }

    create(){
        try{
            if (!$$(this.name)){
                $$("container").addView(
                    returnLayoutForms(this.name),
                6);

                const tableElem = $$("table-view");

                onResizeTable      (tableElem);
                setColsWidthStorage(tableElem);
                columnResize       (tableElem);
           
            }
        } catch (err){
            errors_setFunctionError(
                err,
                _tableMediator_logNameFile,
                "createForms"
            );
        }
    }

    showView(){
        Action.showItem($$(this.name));   
    }

    load(id){
        createTable("table-view", id);
    }

    defaultState(){
        toolsDefState ();
        buttons_Button.transparentDefaultState();
    }


}


;// CONCATENATED MODULE: ./src/js/components/treeEdit/form.js
let tree;

const cssDisable = "tree_disabled-item";

function cssItems(action, selectItems){
    const pull       = tree.data.pull;
    const values     = Object.values(pull);
    values.forEach(function(item, i){

        if (action == "remove"){
            tree.removeCss(item.id, cssDisable);

        } else if (action == "add" && selectItems) {
            const result = 
            selectItems.find((id) => id == item.id);

            if (!result){
                tree.addCss   (item.id, cssDisable);
            }
        }
    
    });
}


function openFullBranch(value){
    const parent = tree.getParentId(value);
    if (parent && tree.getParentId(parent)){
        tree.open     (parent);
        openFullBranch(parent);
    } else {
        tree.open(value);
        tree.open(parent);
    }  



    return value;
}

function returnSelectItems(value){
    const res = [value];
    tree.data.eachSubItem(value, function(obj){ 
        res.push(obj.id);
    });   

    return res;
}

function parentsLogic(value){
    let topParent;

    if (tree.exists(value)){
     
        topParent = openFullBranch(value);

        tree.showItem   (value);
        tree.open       (value);

        const selectItems = returnSelectItems(value);

        cssItems("add", selectItems);
    }

    return topParent;
}


function getAvailableItems(topParent){
    const res = [topParent];
    tree.data.eachSubItem(topParent, function(obj){ 
        res.push(obj.id);
    });   

    return res;
}

function showLastItem(resultItems){
    const index = resultItems.length - 1;
    const item  = resultItems[index];
    tree.showItem (item);
}
 

function ownersLogic(value, topParent){
    const pull   = tree.data.pull;
    const values = Object.values(pull);

    const resultItems = [];

   
    if (topParent){ // если уже выбран элемент для редактирования
        const items = getAvailableItems(topParent);

        items.forEach(function(id, i){
            const item  = tree.getItem(id);
            const owner = item.owner;
    
            if (owner == value){
                resultItems.push(id);
              
            }

        });

        cssItems("add", resultItems);
    } else {
        values.forEach(function(el){
            const owner = el.owner; 
            if (owner && owner == value){
                resultItems.push(el.id);
            
            }
        });

    }

    cssItems("add", resultItems);

    showLastItem(resultItems);

    resultItems.forEach(function(id){
        openFullBranch(id);
    });
 
}   


function editTreeClick (){
    tree  = $$("treeEdit");

    cssItems("remove");

    const formVals = $$("editTreeForm").getValues();

    const parents = formVals.parents;
    const owners  = formVals.owners;

    let topParent;

    if (parents && parents !== "111"){
        topParent = parentsLogic(parents);
    }

    if (owners && owners !== "111"){
        ownersLogic(owners, topParent);
    }


}



function returnParentCombo(){
    const combo = {
        view          : "combo", 
        id            : "editTreeCombo",
        name          : "parents",
        value         : 111,
        labelPosition : "top",
        label         : "Выберите элемент для редактирования", 
        options       : []
    };

    return combo;
}

function returnOwnerCombo(){
    const combo = {
        view          : "combo", 
        id            : "editTreeComboOwner",
        name          : "owners",
        labelPosition : "top",
        value         : 111,
        label         : "Выберите владельца", 
        options       : []
 
    };

    return combo;
}


function returnBtn(){
    const btn = {   
        view  : "button", 
        value : "Применить" ,
        css   : "webix_primary",
        click : editTreeClick
    };

    return btn;
}


function returnForm(){
    const form = {
        view    : "form", 
        id      : "editTreeForm",
        width   : 300,
        elements: [
            returnParentCombo(),
            returnOwnerCombo (),
            returnBtn(),
            {}, 
        ]
    };

    return form;
}



;// CONCATENATED MODULE: ./src/js/components/treeEdit/_layout.js





function renameTree(state, editor){
 
    const url = "/init/default/api/trees/";
    
    if(state.value != state.old){
      
        const pid = $$("treeEdit").getParentId(editor.id);
        
        const postObj = {
            name    : state.value,
            pid     : pid,
            id      : editor.id,
            owner   : null,
            descr   : "",
            ttype   : 1,
            value   : "",
            cdt     : null,
        };

     
        const postData = webix.ajax().put(url + editor.id, postObj);

        postData.then(function(data){
            data = data.json();
            if (data.err_type == "i"){
                setLogValue("success", "Данные изменены");

            } else {
                errors_setFunctionError(
                    data.err,
                    "editTree",
                    "tree onAfterEditStop postData msg"
                );
            }
        });

        postData.fail(function(err){
            setAjaxError(
                err, 
                "editTree",
                "tree onAfterEditStop postData"
            );
        });


    }
  
}


function returnTree(){
    const tree = {
        view       : "edittree",
        id         : "treeEdit",
        editable   : true,
        editor     : "text",
        editValue  : "value",
        css        : "webix_tree-edit",
        editaction : "dblclick",
        data       : [],
        on         : {
            onAfterEditStop:function(state, editor){
                renameTree(state, editor);
            },
        }
    
    };

    return tree;
}

function editTreeLayout () {

    return [
        {   id  : "treeEditContainer", 
            cols: [
                {rows: [
                        returnTree(),
                    ],
                },
                returnForm()
                   
            ]
        }
   
    ];
}


webix.UIManager.addHotKey("Ctrl+Shift+E", function() { 

    Backbone.history.navigate("experimental/treeEdit", { trigger:true});

});


;// CONCATENATED MODULE: ./src/js/components/treeEdit/contextMenu.js




let contextMenu_tree;
let context ;
let contextMenu_titem ;
let menu ;  
let cmd ;  
let contextMenu_url ;
let postObj;

class Option {

    constructor (){
        this.combo     = $$("editTreeCombo");
        this.comboData = this.combo.getPopup().getList();
        this.pull      = Object.values(this.comboData.data.pull);
    }

    static returnCombo(){
        return $$("editTreeCombo");
    }


    static returnComboData(){
        const combo = this.returnCombo();
        return combo.getPopup().getList();
    }


    static returnPullValues(){
        const data = this.returnComboData();
        return Object.values(data.data.pull);
    }


    static add(option){  
        const data       = this.returnComboData();
        const pullValues = this.returnPullValues();

        pullValues.forEach(function(el,i){
            if (el.id !== option.id){
                data.parse(option);
            }
        });

    }

    static rename(option){
        const data       = this.returnComboData();
        const pullValues = this.returnPullValues();
   
        pullValues.forEach(function (el){

            if (el.id == option.id){
                data.parse(option);
            }
           
        });
      
    }

    static remove(option){
        const data       = this.returnComboData();
        const pullValues = this.returnPullValues();

        function removeSubItemOptions(id){
            const res = [id];

            contextMenu_tree.data.eachSubItem(id, function(obj){ 
                res.push(obj.id);
            }); 

            return res;
        }

        function isExists(element){
            let check = false;
            pullValues.forEach(function (el){

                if (el.id == element){
                    check = true;
                }
            });
            return check;
        }

        const removeItems = removeSubItemOptions(option.id);
        removeItems.forEach(function (item){
            if (isExists(item)){
                data.remove(item);
            }

        });
    
    }

}


function contextMenu_addItem(text){
    postObj.name = text;
    postObj.pid = contextMenu_titem.id;

    const postData = webix.ajax().post(contextMenu_url, postObj);

    postData.then(function(data){
        try{
            data = data.json();
            if (data.err_type == "i"){
                
                let idNewItem = data.content.id;
            
                contextMenu_tree.data.add({
                    id    : idNewItem,
                    value : text, 
                    pid   : contextMenu_titem.id
                }, 0, contextMenu_titem.id);
                
                contextMenu_tree.open(contextMenu_titem.id);

  
                const comboOption = {
                    id      : contextMenu_titem.id, 
                    value   : contextMenu_titem.value
                };

                Option.add(comboOption);
            
                setLogValue("success","Данные сохранены");
            } else {
                errors_setFunctionError( 
                    data.err,
                    "editTree",
                    "case add post msg"
                );
            }
        } catch (err){
            errors_setFunctionError(err, "editTree", "case add");
        }
    });

    postData.fail(function(err){
        setAjaxError(err, "editTree", "case add");
    });

}

function renameItem(text){
    postObj.name = text;
    postObj.id = contextMenu_titem.id;
    postObj.pid = contextMenu_titem.pid;

    const putData =  
    webix.ajax().put(contextMenu_url + contextMenu_titem.id, postObj);

    putData.then(function(data){
        try{
            data = data.json();
            if (data.err_type == "i"){
                contextMenu_titem.value = text;
                contextMenu_tree.updateItem(contextMenu_titem.id, contextMenu_titem);

                const option = {
                    id    : contextMenu_titem.id, 
                    value : contextMenu_titem.value
                };

                Option.rename(option);

                setLogValue("success", "Данные изменены");
            } else {
                errors_setFunctionError( 
                    data.err,
                    "editTree",
                    "case rename put msg"
                );
            }
        } catch (err){
            errors_setFunctionError( 
                err, 
                "editTree", 
                "case rename"
            );
        }
    });

    putData.fail(function(err){
        setAjaxError(err, "editTree", "case rename");
    });
}

function removeItem(){
    const delData = 
    webix.ajax().del(contextMenu_url + contextMenu_titem.id, contextMenu_titem);

    delData.then(function(data){
        try{
            data = data.json();
            if (data.err_type == "i"){

                const option = {
                    id    : contextMenu_titem.id, 
                    value : contextMenu_titem.value
                };

                Option.remove(option);

                contextMenu_tree.remove(contextMenu_titem.id);

              

                setLogValue("success", "Данные удалены");
            } else {
                errors_setFunctionError( 
                    data.err, 
                    "editTree", 
                    "case delete del msg"
                );
            }
        } catch (err){
            errors_setFunctionError(
                err, 
                "editTree", 
                "case delete"
            );
        }
    });

    delData.fail(function(err){
        setAjaxError(err, "editTree", "case delete");
    });
}

function expandItem(){
    try{
        contextMenu_tree.open(contextMenu_titem.id);
        contextMenu_tree.data.eachSubItem(contextMenu_titem.id, function (obj){ 
            contextMenu_tree.open(obj.id);
        });

    } catch (err){
        errors_setFunctionError( 
            err,
            "editTree",
            "case open all"
        );
    }
}

function collapseItem(){
    try{
        contextMenu_tree.close(contextMenu_titem.id);
        contextMenu_tree.data.eachSubItem(contextMenu_titem.id, function (obj){ 
            contextMenu_tree.close(obj.id);
        });
    } catch (err){
        errors_setFunctionError( 
            err,
            "editTree",
            "case close all"
        );
    }
}


function contextLogic(id, self){
    context = self.getContext();
    contextMenu_tree    = $$("treeEdit");
    contextMenu_titem   = contextMenu_tree.getItem(context.id); 
    menu    = self.getMenu(id);
    cmd     = menu.getItem(id).value;
    contextMenu_url     = "/init/default/api/trees/";

    postObj = {
        name  : "",
        pid   : "",
        owner : null,
        descr : "",
        ttype : 1,
        value : "",
        cdt   : null,
    };


    switch (cmd) {
        case "Добавить": {
        
            const text = 
            prompt
            ("Имя нового подэлемента '" + contextMenu_titem.value + "'", "");

            if (text != null) {
                contextMenu_addItem(text);
            }
            break;
        }
    
        case "Переименовать": {
            const text = prompt("Новое имя", contextMenu_titem.value);
            if (text != null) { 
                renameItem(text);
            }
            break;
        }
        case "Удалить": {
            removeItem();
            break;
        }

        case "Развернуть всё": {
            expandItem();
            break;
        }
        case "Свернуть всё": {
            collapseItem();
            break;
        }
        
    }
}

function contextMenu (){

    const contextMenu = {
        view : "contextmenu",
        id   : "contextMenuEditTree",
        data : [
                "Добавить",
                "Переименовать",
                { $template : "Separator" },
                "Развернуть всё",
                "Свернуть всё",
                { $template : "Separator" },
                "Удалить"
            ],
        master: $$("treeEdit"),
        on:{
            onMenuItemClick:function(id){
             
                contextLogic(id, this);
         
            }
        }
    };

    return contextMenu;
}


;// CONCATENATED MODULE: ./src/js/components/treeEdit/getInfoEditTree.js



const getInfoEditTree_logNameFile = "getContent => getInfoEditTree";

let treeEdit;



function returnEmptyOption(){
    const options = [
        { 
            id    : 111, 
            value : "Не выбрано" 
        }
    ];

    return options;
}


//set combo parents
function getInfoEditTree_isParent(el){
    let res          = false;
    const firstChild = treeEdit.getFirstChildId(el);

    if (firstChild){
        res = true;
    }

    return res;
}

function findParents(treeData){
    const parents = [];

    treeData.forEach(function(item,i){

        if (getInfoEditTree_isParent(item.id)){
            parents.push(item);
        }
       
    });

    return parents;
}


function setComboValues(treeData){
    const parents = findParents(treeData);
    const options = returnEmptyOption();
    const combo   = $$("editTreeCombo");

    parents.forEach(function(parent){
        options.push({
            id    : parent.id,
            value : parent.value
        });
    });

    combo.getPopup().getList().parse(options);

    const firstOption = options[0].id;
    combo.setValue(firstOption);

}


//set combo owners
async function getRefField(){
    await LoadServerData.content("fields");
    const field = GetFields.item("trees");

    const ownerConfig = field.fields.owner;
    const refAttr     = ownerConfig.type;

    return refAttr.slice(10); //slice "reference" 
}

function getOptions(data){
    const options = returnEmptyOption();

    data.forEach(function(el){
        options.push({
            id    : el.id, 
            value : el.first_name
        });
    });

    return options;
}

function setOptionsToCombo(options){
    const combo   = $$("editTreeComboOwner");
    combo.getPopup().getList().parse(options);
}

async function setOwnerComboValues(){

    const refField    = await getRefField();

    const url       = "/init/default/api/" + refField;
    const getDataRef   = webix.ajax().get(url);

    getDataRef.then(function(data){
        data = data.json().content;
      
        const options = getOptions(data);
        setOptionsToCombo(options);

    });
    getDataRef.fail(function(err){
        setAjaxError(
            err, 
            "getInfoTree", 
            "setOwnerComboValues"
        );
    });

}



// create tree struct
function createTreeItem(el){
    return {
        id    : el.id, 
        value : el.name, 
        owner : el.owner,
        pid   : el.pid, 
        data  : []
    };
}


function pushTreeData(data){
    const treeData = [];       
    try{
        data.forEach(function(el,i){
            if (el.pid == 0){
                const rootElement = createTreeItem(el);

                rootElement.open  = true;
                treeData.push ( rootElement );

            } else {
                const element = createTreeItem(el);

                treeData.push (element );
            }
        });
    } catch (err) {
        errors_setFunctionError(err,getInfoEditTree_logNameFile,"pushTreeData");
    }

    return treeData;
}

function createStruct(treeData){
    const treeStruct = [];
    const map        = {};
    try{
        treeData.forEach(function(el, i){

            map[el.id] = i; 

            if ( el.pid !== 0 && el.pid !== el.id && el.pid !== null ) {
                treeData[map[el.pid]].data.push(el);
            } else {
                treeStruct.push(el);
            }
        });
    } catch (err) {
        errors_setFunctionError(err, getInfoEditTree_logNameFile, "createStruct");
    }
    return treeStruct;
}

function getTrees(){
    const url       = "/init/default/api/" + "trees";
    const getData   = webix.ajax().get(url);

    getData.then(function(data){

        data = data.json().content;
        data[0].pid = 0;

        const treeData   = pushTreeData(data);
        const treeStruct = createStruct(treeData);

        treeEdit.parse      (treeStruct);

        setComboValues      (treeData);
        setOwnerComboValues ();

    });

    getData.fail(function(err){
        setAjaxError(
            err, 
            "getInfoTree", 
            "getInfoEditTree"
        );
    });

}

function getInfoEditTree() {
    treeEdit  = $$("treeEdit");

    getTrees();

    if (treeEdit){
        treeEdit.clearAll();
    }   
 
}


;// CONCATENATED MODULE: ./src/js/components/treeEdit/_treeEditMediator.js








const _treeEditMediator_logNameFile = "treeEdit => _treeEditMediator";

class TreeEdit {
    constructor (){
        this.name = "treeTempl";
    }

    create(){
        try{
            if (!$$(this.name)){
                $$("container").addView(
                    {   view:"layout",
                        id:this.name, 
                        hidden:true, 
                        scroll:"auto",
                        rows: editTreeLayout()
                    },
                4);
                
                webix.ui(contextMenu());
            }
          
        } catch (err){
            errors_setFunctionError(
                err,
                _treeEditMediator_logNameFile,
                "createTreeTempl"
            );
        }
    }

    showView(){
        Action.showItem($$(this.name));   
    }

    load(){
        getInfoEditTree();
    }


    defaultState(id){
        try{
            const elem = $$("treeTempl");
            if(!($$(id))){
                Action.hideItem(elem);
            }
        } catch (err){
            errors_setFunctionError(err, _treeEditMediator_logNameFile, "hideTreeTempl");
        }
    }

}



;// CONCATENATED MODULE: ./src/js/components/user_auth/_layout.js






let _layout_form;

function returnPassData(){
    const passData = _layout_form.getValues();

    const objPass = {
        op: passData.oldPass,
        np: passData.newPass
    };

    return objPass;
}

async function doAuthCp (){

    _layout_form = $$("cp-form");

    if ( _layout_form && _layout_form.validate()){

        const objPass = returnPassData();
        
        const path = "/init/default/api/cp";
        const postData = webix.ajax().post(path, objPass);
        
        return await postData.then(function(data){
            data = data.json();
            
            if (data.err_type == "i"){
                setLogValue("success", data.err);
                _layout_form.clear();
                _layout_form.setDirty(false);
                return true;
            } else {
                setLogValue(
                    "error",
                    "authSettings function doAuthCp: " + 
                    data.err, 
                    "cp"
                );
                return false;
            }
      
            
        }).fail(function(err){
            setAjaxError(
                err, 
                "authSettings",
                "doAuthCp"
            );
            return false;
        });

    } else {
        return false;
    }
   
}

const _layout_headline = {   
    template   : "<div>Изменение пароля</div>",
    css        : 'webix_cp-form',
    height     : 35, 
    borderless : true
};

function _layout_returnDiv(text){
    const defaultStyles = 
    "display:inline-block; font-size:13px!important; font-weight:600;";

    return "<div style='" + defaultStyles + "color:var(--primary);'>"+
    "Имя пользователя:</div>"+
    "⠀"+
    "<div style=' " + defaultStyles + " '>"+
    text +
    "<div>";
}

const userName = {   
    view        : "template",
    id          : "authName",
    css         : "webix_userprefs-info",
    height      : 50, 
    borderless  : true,
    template    : function(){
        const values = $$("authName").getValues();
        const keys   = Object.keys(values);
        if (keys.length !== 0){
            return _layout_returnDiv (values);
        } else {
            return _layout_returnDiv ("не указано");
        }
    },
};

function generatePassInput(labelPass, namePass){
    return {   
        view            : "text",
        width           : 300,
        labelPosition   : "top", 
        type            : "password",
        name            : namePass,
        label           : labelPass,
        on:{
            onChange:function(){
                $$("cp-form").setDirty(true);
            }
        } 
    };
}

const btnSubmit = new buttons_Button({
    
    config   : {
        hotkey   : "Shift+Space",
        value    : "Сменить пароль", 
        click    : doAuthCp
    },
    titleAttribute : "Изменить пароль"

}).maxView("primary");


const authCp = {
    view        : "form", 
    id          : "cp-form",
    borderless  : true,
    margin      : 5,
    elements    : [
        _layout_headline,
        userName,
        generatePassInput("Старый пароль"       , "oldPass"   ),
        generatePassInput("Новый пароль"        , "newPass"   ),
        generatePassInput("Повтор нового пароля", "repeatPass"),
        {   margin  : 5, 
            cols    : [
                btnSubmit,
            ]
        }
    ],

    on:{
        onViewShow: webix.once(function(){
            mediator.setForm(this);
        }),
    },

    rules:{
        $all:webix.rules.isNotEmpty,
        $obj:function(data){
            const checkCp = $$("cp-form").isDirty();

            if (data.newPass != data.repeatPass){
                setLogValue(
                    "error",
                    "Новый пароль не совпадает с повтором"
                );
            return false;
            }

            if (data.newPass == data.oldPass && checkCp ){
                setLogValue(
                    "error",
                    "Новый пароль должен отличаться от старого"
                );
                return false;
            }
            return true;
        }
    },
};


const authCpLayout = {
    id  : "layout-cp",
    cols: [
        authCp,
        {}
    ],
};


;// CONCATENATED MODULE: ./src/js/components/user_auth/_userAuthMediator.js


class UserAuth {
    constructor (){
        this.name = "user_auth";
    }

    create (){
        $$("container").addView(
            {   view   : "layout",
                id     : this.name, 
                css    : "webix_auth",
                hidden : true, 
                rows   : [
                    authCpLayout,
                    {}
                ],
            }, 
        7);

    }

    put (){
        return doAuthCp();
    }

}


;// CONCATENATED MODULE: ./src/js/components/settings/headline.js
const headline_headline = {   
    view        : "template",
    template    : "<div>Настройки</div>",
    css         : "webix_headline-userprefs",
    height      : 35, 
    borderless  : true,
};

const userInfo =  {   
    view        : "template",
    id          : "settingsName",
    css         : "webix_userprefs-info",
    height      : 50, 
    borderless  : true,

    template    : function(){
        function createDivData(msg){
            return `
            <div style = '
                display:inline-block;
                color:var(--primary);
                font-size:13px!important;
                font-weight:600
            '>Имя пользователя:</div>

            <div style = '
                display:inline-block;
                font-size:13px!important;
                font-weight:600
            '>${msg}</div>`;
        }

        const val       = $$("settingsName").getValues();
        const lenghtVal = Object.keys(val).length;

        if (lenghtVal !==0){
            return createDivData(val); 
        } else {
            return createDivData("не указано");        
        }
    },
};


const layoutHeadline =  [ 
    headline_headline,
    userInfo,
];


;// CONCATENATED MODULE: ./src/js/components/settings/tabbar/formTemplate.js
 



function returnFormTemplate(id, elems){
    const form =  {    
        view       : "form", 
        id         : id,
        borderless : true,
        elements   : [
            {cols  : elems},
        ],
    
        on        :{
            onViewShow: webix.once(function(){
               mediator.setForm(this);
            }),
    
            onChange:function(){
                const form     = this;
                const isDirty  = form.isDirty();

                const saveBtn  = $$("userprefsSaveBtn");
                const resetBtn = $$("userprefsResetBtn");
 
    
                function setSaveBtnState(){
                    if ( isDirty ){
                        Action.enableItem(saveBtn);
    
                    } else if ( !isDirty ){
                        Action.disableItem(saveBtn);
    
                    }
                }
    
                function setResetBtnState(){
                    if (isDirty){
                        Action.enableItem(resetBtn);
    
                    } else if ( !isDirty ){
                        Action.disableItem(resetBtn);
    
                    }  
                 
                }
          
                setSaveBtnState ();
                setResetBtnState();
            }
        },
    
        
    };

    return form;
}


;// CONCATENATED MODULE: ./src/js/components/settings/tabbar/formOther.js




const formOther_logNameFile   = "settings => tabbar => otherForm";

const autorefRadio   = {
    view            : "radio",
    labelPosition   : "top", 
    label           : "Автообновление специфичных страниц", 
    value           : 1,
    name            : "autorefOpt", 
    options         : [
        {"id" : 1, "value" : "Включено"},
        {"id" : 2, "value" : "Выключено"}
    ],
    on              : {
        onChange:function(newValue){

            const counter = $$("userprefsAutorefCounter");

            if (newValue == 1 ){
                Action.showItem(counter);
            }

            if (newValue == 2){
                Action.hideItem(counter);
            }
        
        }
    }
};

const autorefCounter = {   
    view            : "counter", 
    id              : "userprefsAutorefCounter",
    labelPosition   : "top",
    name            : "autorefCounterOpt", 
    label           : "Интервал автообновления (в миллисекундах)" ,
    min             : 15000, 
    max             : 900000,
    on              : {
        onChange:function(newValue){
            function createMsg (textMsg){
                return webix.message({
                    type   : "debug",
                    expire : 1000, 
                    text   : textMsg
                });
            }

            try{
                const counter = $$("userprefsAutorefCounter");
                const minVal  = counter.config.min;
                const maxVal  = counter.config.max;

                const defText = "возможное значение";
                
                if (newValue == minVal){
                    createMsg ("Минимально" +  defText);

                } else if (newValue == maxVal){
                    createMsg ("Максимально" + defText);
                }
            } catch (err){
                errors_setFunctionError(
                    err,
                    formOther_logNameFile,
                    "onChange"
                );
            }

        }
    }
};

const visibleIdRadio = {
    view            : "radio",
    labelPosition   : "top", 
    label           : "ID в таблицах", 
    value           : 1,
    name            : "visibleIdOpt", 
    options         : [
        {"id" : 1, "value" : "Показывать"   },
        {"id" : 2, "value" : "Не показывать"}
    ],
};

function formOther_returnForm(){
    const elems = [{
        rows: [
            autorefRadio,
            {height:5},
            autorefCounter,
            {height:5},
            visibleIdRadio,
            {}
        ]
    }];
    
 
    return returnFormTemplate(
        "userprefsOtherForm", 
        elems
    );
}

const otherFormLayout = {
    view      : "scrollview",
    borderless: true, 
    css       : "webix_multivew-cell",
    id        : "userprefsOther", 
    scroll    : "y", 
    body      : formOther_returnForm()
};


;// CONCATENATED MODULE: ./src/js/components/settings/tabbar/formWorkspace.js
 



const formWorkspace_logNameFile   = "settings => tabbar => workspaceForm";

const logBlockRadio = {
    view         : "radio",
    labelPosition: "top",
    name         : "logBlockOpt", 
    label        : "Отображение блока системных сообщений", 
    value        : 1, 
    options      : [
        {"id" : 1, "value" : "Показать"}, 
        {"id" : 2, "value" : "Скрыть"  }
    ],
    on:{
        onAfterRender: function () {
            this.getInputNode().setAttribute(
                "title",
                "Показать/скрыть по умолчанию" + 
                " блок системных сообщений"
                );
        },

        onChange:function(newValue, oldValue){
            try{
                const btn = $$("webix_log-btn");

                if (newValue !== oldValue){
             
                    if (newValue == 1){
                        btn.setValue(2);
                    } else {
                        btn.setValue(1);
                    }
                
                }
            } catch (err){
                errors_setFunctionError(
                    err,
                    formWorkspace_logNameFile,
                    "onChange"
                );
            }
 
        }
    }
};


function formWorkspace_returnForm(){
    const elems = [
        { rows : [  
            logBlockRadio,
            {height : 15},

        ]},
    ]; 

    return returnFormTemplate(
        "userprefsWorkspaceForm",  
        elems
    );
}


const workspaceLayout = {
    view      : "scrollview",
    borderless: true, 
    css       : "webix_multivew-cell",
    id        : "userprefsWorkspace",
    scroll    : "y", 
    body      : formWorkspace_returnForm()
};



;// CONCATENATED MODULE: ./src/js/components/settings/tabbar/commonTab.js

const defaultValue = {
    userprefsOther     : {},
    userprefsWorkspace : {},
};



;// CONCATENATED MODULE: ./src/js/components/settings/tabbar/buttons.js










const buttons_logNameFile   = "settings => tabbar => buttons";

let buttons_tabbar;
let tabbarVal;
let buttons_form;

let buttons_values;
let buttons_sentObj;

function buttons_putPrefs(el){
 
    const path    = "/init/default/api/userprefs/" + el.id;
    const putData = webix.ajax().put(path, buttons_sentObj);

    return putData.then(function(data){

        data = data.json();

        if (data.err_type == "i"){

            const formVals = JSON.stringify(buttons_values);
            setStorageData (tabbarVal, formVals);

            const name         = buttons_tabbar.getValue();
            defaultValue[name] = buttons_values;

            buttons_form.setDirty(false);

            setLogValue(
                "success", 
                "Настройки сохранены"
            );
            return true;
        } else {
            setLogValue("error", data.error);
            return false;
        }

    }).fail(function(err){
        setAjaxError(
            err, 
            buttons_logNameFile, 
            "putPrefs"
        );
        return false;
    });
}


function findExistsData(data){
    const result = {
        exists : false
    };

    try{
        data.forEach(function(el){
           
            if (el.name == tabbarVal){
                result.exists = true;
                result.findElem = el;
            } 
        });
    } catch (err){
        errors_setFunctionError(
            err, 
            buttons_logNameFile, 
            "findExistsData"
        );
    }
    return result;
}


function buttons_postPrefs(){
   
    const path = "/init/default/api/userprefs/";

    const postData = webix.ajax().post(path, buttons_sentObj);

    return postData.then(function(data){
        data = data.json();

        if (data.err_type == "i"){
            const tabbarVal         = buttons_tabbar.getValue();
            defaultValue[tabbarVal] = buttons_values;

            buttons_form.setDirty(false);

            setLogValue(
                "success", 
                "Настройки сохранены"
            );

            return true;
        } else {
            setLogValue(
                "error", 
                data.error
            );

            return false;
        }

    }).fail(function(err){
        setAjaxError(
            err, 
            buttons_logNameFile, 
            "postPrefs"
        );

        return false;
    });
}


async function savePrefs(){
    let ownerId = getUserDataStorage();

    if (!ownerId){
        await pushUserDataStorage();
        ownerId = getUserDataStorage();
    }

    const url     = "/init/default/api/userprefs/";
    const getData =  webix.ajax().get(url);
 
    return getData.then(function(data){
        data = data.json().content;

        buttons_values = buttons_form.getValues();
 
        buttons_sentObj = {
            name  : tabbarVal,
            owner : ownerId.id,
            prefs : buttons_values,
        };

   

        const result          = findExistsData(data);
        const isExistsSetting = result.exists;

        if (!isExistsSetting){
            return buttons_postPrefs();
        } else {
            const findElem = result.findElem;
            return buttons_putPrefs(findElem);
        }

    }).fail(function(err){
        setAjaxError(
            err, 
            buttons_logNameFile, 
            "savePrefs"
        );
    });
}


async function saveSettings (){
    buttons_tabbar    = $$("userprefsTabbar");
    const value     = buttons_tabbar.getValue();
    tabbarVal = value + "Form" ;
    buttons_form      = $$(tabbarVal);

    if (buttons_form.isDirty()){
        return savePrefs();   
   
    } else {
        setLogValue(
            "debug", 
            "Сохранять нечего"
        );
        return true;
    }
}

function clearSettings (){
    const tabbar    = $$("userprefsTabbar");
    const value     = tabbar.getValue();
    const tabbarVal = value + "Form" ;
    const form      = $$(tabbarVal);

    if (tabbarVal === "userprefsWorkspaceForm"){
    
        form.setValues({
            logBlockOpt    : '1', 
        //    LoginActionOpt : '1'
        });

    } else if (tabbarVal === "userprefsOtherForm"){
        form.setValues({
            autorefOpt        : '1', 
            autorefCounterOpt : 15000, 
            visibleIdOpt      : '1'
        });
    }

    form.setDirty(true);

    saveSettings ();
}


const clearBtn = new buttons_Button({
    
    config   : {
        id       : "userprefsResetBtn",
        hotkey   : "Shift+X",
        value    : "Сбросить", 
        click    : clearSettings,
    },
    titleAttribute : "Вернуть начальные настройки"

   
}).maxView();

const buttons_submitBtn = new buttons_Button({
    
    config   : {
        id       : "userprefsSaveBtn",
        hotkey   : "Shift+Space",
        disabled : true,
        value    : "Сохранить настройки", 
        click    : saveSettings,
    },
    titleAttribute : "Применить настройки"

   
}).maxView("primary");


const buttons =  { 
    id:"adaptiveUp", 
    rows:[
        {   responsive : "adaptiveUserprefs",
            cols:[
                clearBtn,
                buttons_submitBtn,
            ]
        }
    ]
};


;// CONCATENATED MODULE: ./src/js/components/settings/tabbar/tabbar.js





const tabbar_tabbar_logNameFile   = "settings => tabbar => tabbar";


function createHeadlineSpan(headMsg){
    return `<span class='webix_tabbar-filter-headline'>
            ${headMsg}
            </span>`;
}

const tabbar_tabbar = {   
    view     : "tabbar",  
    type     : "top", 
    id       : "userprefsTabbar",
    css      : "webix_filter-popup-tabbar",
    multiview: true, 
    height   : 50,
    options  : [
        {   value: createHeadlineSpan("Рабочее пространство"), 
            id   : 'userprefsWorkspace' 
        },
        {   value: createHeadlineSpan("Другое"), 
            id   : 'userprefsOther' 
        },
    ],

    on       :{
        onBeforeTabClick:function(id){
            const tabbar    = $$("userprefsTabbar");
            const value     = tabbar.getValue();
            const tabbarVal = value + "Form";
            const form      = $$(tabbarVal);

            function createModalBox(){
                try{
                    webix.modalbox({
                        title   : "Данные не сохранены",
                        css     : "webix_modal-custom-save",
                        buttons : ["Отмена", "Не сохранять", "Сохранить"],
                        width   : 500,
                        text    : "Выберите действие перед тем как продолжить"
                    }).then(function(result){

                        if ( result == 1){
                            
                            const storageData = webix.storage.local.get(tabbarVal);
                            const saveBtn     = $$("userprefsSaveBtn");
                            const resetBtn    = $$("userprefsResetBtn");

                            form.setValues(storageData);

                            tabbar.setValue(id);
                            Action.disableItem(saveBtn);
                            Action.disableItem(resetBtn);

                        } else if ( result == 2){
                            saveSettings ();
                            tabbar.setValue(id);
                        }
                    });
                } catch (err){
                    errors_setFunctionError(
                        err, 
                        tabbar_tabbar_logNameFile, 
                        "createModalBox"
                    );
                }
            }


            if (form.isDirty()){
                createModalBox();
                return false;
            }

        }
    }
};


;// CONCATENATED MODULE: ./src/js/components/settings/tabbar/_layoutTab.js





const layoutTabbar =  {
    rows:[
        tabbar_tabbar,
        {
            cells:[
                workspaceLayout,
                otherFormLayout
            ]
        },
        buttons
    ]
};


;// CONCATENATED MODULE: ./src/js/components/settings/_layout.js





const settingsLayout = {

    rows:[
        {   padding: {
                top    : 15, 
                bottom : 0, 
                left   : 20, 
                right  : 0
            },
            rows   :layoutHeadline,
        },
        layoutTabbar,
    ]

   
};



;// CONCATENATED MODULE: ./src/js/components/settings/_settingsMediator.js



class Settings {
    constructor (){
        this.name = "dashboards";
    }

    create (){
        $$("container").addView(
            {   view    :"layout",
                id      : "settings", 
                css     :"webix_auth",
                hidden  :true, 
                rows    :[
                    settingsLayout,
                ],
            }, 
        8);
    }

    async put (){
       return await saveSettings();
    }

}


;// CONCATENATED MODULE: ./src/js/components/treeSidabar/selectVisualElem.js





const selectVisualElem_logNameFile = "treeSidebar => selectVisualElem";


function createUndefinedView(){
    const id = "webix__null-content";

    const view = {
        view  : "align", 
        align : "middle,center",
        id    : id,
        body  : {  
            borderless : true, 
            template   : "Блок в процессе разработки", 
            height     : 50, 
            width      : 220,
            css        : {
                "color"     : "#858585",
                "font-size" : "14px!important"
            }
        }
        
    };

    if ( !($$(id)) ){
        try{
            $$("container").addView(view, 2);
        } catch (err){ 
            errors_setFunctionError(
                err, 
                selectVisualElem_logNameFile, 
                "createUndefinedView"
            );
        }
     
    }
   
}

function selectItemAction(type, id){
    const visiualElements = mediator.getViews();
    let selectElem;

    if (type){
        const values = {
            tree : {
                type  : type, 
                field : id
            }
        };

        mediator.tabs.setInfo(values);
    }
  
    if (type == "dbtable"){
        selectElem = "tables";
        mediator.tables.load(id);

    } else if(type == "tform"){
        selectElem = "forms";
        mediator.forms.load(id);

    } else if(type == "dashboard"){
        selectElem = "dashboards";
        mediator.dashboards.load(id);
        Action.hideItem($$("propTableView"));

    } 


    visiualElements.forEach(function(elem){
        if (elem !== selectElem){
            Action.hideItem($$(elem));
        } 

        if (elem == id){
            Action.removeItem($$("webix__null-content"));
            Action.showItem  ($$("webix__none-content"));
        }
    });

    Action.showItem($$(selectElem));

}

function removeTreeEdit(){
    Action.removeItem($$("treeTempl")); 
    Action.destructItem($$("contextMenuEditTree")); 
    
}

function selectElem(id){

    const type = GetFields.attribute (id, "type");

    Action.hideItem($$("webix__none-content"));

    removeTreeEdit();

    const isBranch = $$("tree").isBranch(id);
    
    if (!type && !isBranch){
        createUndefinedView();
    } else {
        Action.removeItem($$("webix__null-content")); 
    }
 
    selectItemAction (type, id);
}



;// CONCATENATED MODULE: ./src/js/components/treeSidabar/preparationView.js




async function getSingleTreeItem(data) {

    await LoadServerData.content("fields");

    const keys   = GetFields.keys;
  
    if (keys){
        selectElem(data);
    }   
}

function preparationView(id){
   
    mediator.header.defaultState();
    mediator.treeEdit.defaultState(id);
    mediator.dashboards.defaultState();
    mediator.tables.defaultState();
    mediator.forms.defaultState();
    getSingleTreeItem  (id) ;
 
    
}


;// CONCATENATED MODULE: ./src/js/components/treeSidabar/loadFields.js




const loadFields_logNameFile = "treeSidebar => loadFields";

let loadFields_tree;
let id;
let selectItem;

function loadFields_returnId(type, uid){
    return "q-" + type + "_data-tree_" + uid;
}

function addDisableItem(idLoadElement, value, idParent = id){
    loadFields_tree.data.add({
        id      :idLoadElement,
        disabled:true,
        value   :value
    }, 0, idParent );  
}

function createLoadEl(uid){
    const id = loadFields_returnId("none", uid);
    addDisableItem (id, "Загрузка ...");
    loadFields_tree.addCss    (id, "tree_load-items");
}

function createNoneEl(uid, idParent){
    const id = loadFields_returnId("none", uid);
    addDisableItem (id, "Раздел пуст", idParent);
}


function isUniqueItem (menu, data){
    let check  = true;

    try{
        menu.forEach(function(el, i){
            if (el.name == data){
                check = false;
                
            }
        });
    } catch (err){
        errors_setFunctionError(
            err, 
            loadFields_logNameFile, 
            "isUniqueItem"
        );
    }
    return check;
}

function isTrueType(values, typeChild){

    return values.type == typeChild;
}


function removeTreeEls( noneEl = false, uid ){
    const load = "q-load_data-tree_" + uid;
    const none = "q-none_data-tree_" + uid;
    try{
        if( loadFields_tree.exists(load)){
            loadFields_tree.remove(load);
        }
        
        if( loadFields_tree.exists(none) && noneEl){
            loadFields_tree.remove(none);
        }
    } catch (err){
        errors_setFunctionError(
            err, 
            loadFields_logNameFile, 
            "removeTreeEls"
        );
    }
}

// function openFullBranch(value){

//     const parent = tree.getParentId(value);
//     if (parent && tree.getParentId(parent)){
//         tree.open     (parent);
//         openFullBranch(parent);
     
//     } else {
      
//         tree.open(value);
//         tree.open(parent);
//         tree.select(value);
//         const item = tree.getItemNode(value);
   
//         // webix.html.addCss( item, "webix_selected");
//         // item.setAttribute("tabindex", "0");
//         // item.setAttribute("aria-selected", "true");
        
//         console.log(tree.exists(value), value, tree.getItem(value))
//     }     

// }


// function selectTreeItem(){
//     const isExists = tree.exists(selectItem);
 
//     if (isExists && selectItem){
//         openFullBranch(selectItem); 
//     }
// }


async function generateMenuData (typeChild, idParent, uid){
    await LoadServerData.content("fields");
    await LoadServerData.content("mmenu");

    const menu   = GetMenu.content;
    const keys   = GetFields.keys;
    const values = GetFields.values;

    let itemsExists = false;

    if (keys){
        try{
        
            keys.forEach(function(data, i) {
    
                if (isTrueType(values[i], typeChild) && isUniqueItem(menu, data)){
            
                    loadFields_tree.data.add({
                            id      : data, 
                            value   : (values[i].plural) ? 
                            values[i].plural : values[i].singular, 
                            "type"  : values[i].type
                    }, 0, idParent ); 

                    if (!itemsExists){
                        itemsExists = true;
                    }
                
                    removeTreeEls(true, uid);
            
                } 

            });

            if (!itemsExists){
                removeTreeEls(false, uid);
                const noneEl =  "q-none_data-tree_" + uid;
            
                if( !(loadFields_tree.exists(noneEl)) ){
                    createNoneEl(uid, idParent);
                    loadFields_tree.addCss(noneEl, "tree_none-items");
                }
            }
        } catch (err){
            errors_setFunctionError(
                err, 
                loadFields_logNameFile, 
                "generateMenuData"
            );
        }
    }

}


async function getMenuChilds(uid) {

    const selectedItem  = loadFields_tree.getItem(id);
    if (selectedItem.action.includes("all_")){
        const index = selectedItem.action.indexOf("_");
        const type  = selectedItem.action.slice  (index + 1);
  
        generateMenuData (type, id, uid);
    }
   
}



function loadFields(selectId, treeItem){
    const uid = webix.uid();
  
    loadFields_tree = $$("tree");
    id   = selectId;
    selectItem = treeItem;

    const item = loadFields_tree.getItem(id);

    if (loadFields_tree.getItem(id) && item.$count === -1){
        createLoadEl (uid);
        getMenuChilds(uid);
    }
  
}


;// CONCATENATED MODULE: ./src/js/components/treeSidabar/navigate.js




const treeSidabar_navigate_logNameFile = "treeSidebar => navigate";

function getFields (id){
    const menu  = GetMenu.content;
    
    if (menu){
        try{
            Backbone.history.navigate("tree/" + id, { trigger : true });
        } catch (err){
            errors_setFunctionError(err, treeSidabar_navigate_logNameFile, "getFields");
        }
    }
}


;// CONCATENATED MODULE: ./src/js/components/treeSidabar/adaptive.js




const adaptive_logNameFile = "treeSidebar => adaptive";

function setAdaptiveState(){
    try{
        if (window.innerWidth < 850 ){
            $$("tree").hide();
        }
    } catch (err){
        errors_setFunctionError(
            err, 
            adaptive_logNameFile, 
            "setAdaptiveState"
        );
    }
}


;// CONCATENATED MODULE: ./src/js/components/treeSidabar/errorLoad.js





function setErrLoad(err){
    Action.hideItem($$("loadTreeOverlay"));
                
    const container = $$("sidebarContainer");
    const id        = "treeErrOverlay"; 

    if ( !$$(id) && container){

        const errOverlay  = createOverlayTemplate(
            id,
            "Ошибка"
        );

        container.addView(errOverlay, 0);
    }

    if (err){
        setLogValue(
            "error", 
            err.status + " " + err.statusText + " " +
            err.responseURL + " (" + err.responseText + "). " +
            "Меню не загружено sidebar => onLoadError",
            "version"
        );
    } else {
        setLogValue(
            "error", 
            "Меню не загружено sidebar => onLoadError", 
            "version"
        );
    }
}


;// CONCATENATED MODULE: ./src/js/components/treeSidabar/_layout.js
 
 







function isBranch(id){
    return $$("tree").isBranch(id);
}

function treeSidebar () {
    const tree = {
        view        : "edittree",
        id          : "tree",
        css         : "webix_tree-main",
        minWidth    : 100,
        width       : 300,
        editable    : false,
        select      : true,
        editor      : "text",
        editValue   : "value",
        activeTitle : true,
        clipboard   : true,
        data        : [],
        on          : {
            onAfterLoad:function(){
                Action.hideItem($$("treeErrOverlay"));
            },
            onLoadError:function(xhr){
                setErrLoad(xhr);
            },

            onItemClick: function(id) {
             
                if (!isBranch(id)){
                    mediator.getGlobalModalBox()
                    .then(function(result){
                        if (result){
                            $$("tree").select(id);
                        }
                    
                    });
                    return false;
                }
                
            },

            onBeforeSelect: function(id) {

                const item = this.getItem(id);

                if (!isBranch(id) || item.webix_kids){
                    this.open(id);
                }
                preparationView(id);
            },

            onBeforeOpen:function (id, selectItem){
                loadFields(id, selectItem);
            },

            onAfterSelect:function(id){
                mediator.tabs.changeTabName(id);
                getFields (id);
                setAdaptiveState();
            },

        },

        ready:function(){
           
        }

    };

    return tree;
}


;// CONCATENATED MODULE: ./src/js/components/treeSidabar/loadMenu.js



const loadMenu_logNameFile = " treeSidebar => loadMenu";

function generateChildsTree  (el){
    let childs = [];

    try {
        el.childs.forEach(function(child,i){
            childs.push({
                id     : child.name, 
                value  : child.title,
                action : child.action
            });
        });
    } catch (err){
        errors_setFunctionError(
            err,
            loadMenu_logNameFile,
            "generateChildsTree"
        );
    }
    return childs;
}

function generateParentTree  (el){ 
    let menuItem;
    try {                  
        menuItem = {
            id     : el.name, 
            value  : el.title,
            action : el.action,
        };

  
        if ( !(el.title) ){
            menuItem.value="Без названия";
        }

        if ( el.mtype == 2 ) {

            if ( el.childs.length == 0 ){
                menuItem.webix_kids = true; 
            } else {
                menuItem.data = generateChildsTree (el);
            }         
        } 

    

    } catch (err){
        errors_setFunctionError(
            err,
            loadMenu_logNameFile,
            "generateParentTree"
        );
    }
    return menuItem;
} 


function generateMenuTree (menu){ 

    const menuTree   = [];
    const delims     = [];
    const tree       = $$("tree");
    const btnContext = $$("button-context-menu");

    let menuHeader = [];

    // menu.push ({
    //     "id": 77,
    //     "name": "sales",
    //     "title": "Sales",
    //     "mtype": 1,
    //     "ltype": 1,
    //     "action": "dashboard",
    //     "childs": []
    // });

    menu.forEach(function(el,i){
        if (el.mtype !== 3){
            menuTree.push  ( generateParentTree (el, menu, menuTree  ) );
            if (el.childs.length !==0){
                //menuHeader = generateHeaderMenu (el, menu, menuHeader);
            }
        } else {
            delims.push(el.name);
            menuTree.push({
                id       : el.name, 
                disabled : true,
                value    : ""
            });
        }
    
    });


    tree.clearAll();
    tree.parse(menuTree);
    Action.hideItem($$("loadTreeOverlay"));

    let popupData = btnContext.config.popup.data;
    if (popupData !== undefined){
        popupData = menuHeader;
        btnContext.enable();
    }


    delims.forEach(function(el){
        tree.addCss(el, "tree_delim-items");

    });


}


;// CONCATENATED MODULE: ./src/js/components/treeSidabar/_treeMediator.js






class Tree {
    constructor (){
        this.name = "tree";
    }

    create(){
        return treeSidebar();
    }

    showView(){
        Action.showItem($$(this.name));   
    }

    load(data){
        generateMenuTree(data);
    }

    selectItem(id){
        return selectElem(id);
    }

    dataLength(){
        return $$(this.name).data.order.length;
    }

    close (){
        const tree = $$(this.name);

        if (tree){
            tree.closeAll();
        }

    }

    clear (){
        const tree = $$(this.name);
    
        if (tree){
            tree.clearAll();
        }

    }

}



;// CONCATENATED MODULE: ./src/js/blocks/checkFonts.js


function checkFonts (){


    document.fonts.onloadingdone = function (fontFaceSetEvent) {
        const fontsArr  = fontFaceSetEvent.fontfaces;
        let check       = false;
    
        fontsArr.forEach(function(el){
            if (el.family.includes("icomoon")){
                check = true; 
            }
        });

        if (!check){
            setLogValue("success", "Не удалось загрузить шрифт иконок", 'expa');
        }


    };

}


;// CONCATENATED MODULE: ./src/js/components/header/collapseBtn.js




const collapseBtn_logNameFile = "header => collapseBtn";


function isIdIncludes(el){
    if (el.config.id.includes("search" )      || 
        el.config.id.includes("log-btn")      || 
        el.config.id.includes("context-menu") )
    {
        return true;
    }
}

function setSearchInputState(visible = false){
    const headerChilds = $$("header").getChildViews();

    headerChilds.forEach(function(el){
        if (isIdIncludes(el)){
            
            if(visible){
                el.show();
            } else {
                el.hide();
            }
            
        }
    });
}


function collapseClick (){
    const treeContainer = $$("sidebarContainer");
    const tree          = $$("tree");
    const resizer       = $$("sideMenuResizer");

    function showTree(){
        Action.showItem(treeContainer);
        Action.showItem(tree);

        if(window.innerWidth >= 600){
            Action.showItem(resizer);
        } 
     
    }

    function hideTree(){
        Action.hideItem(treeContainer);
        Action.hideItem(tree);
        Action.hideItem(resizer);
        
    }

    try {

        if (window.innerWidth > 850 ){
            if (tree.isVisible()){
                hideTree()

            } else {
                showTree(); 
 
            }
        } else {
            if (tree.isVisible()){
                hideTree();
                setSearchInputState(true);

            } else {
                showTree();

                tree.config.width = window.innerWidth;
                tree.resize();
        
                setSearchInputState();
            }
        }
        this.refresh();
       
    } catch (err){
        errors_setFunctionError(
            err,
            collapseBtn_logNameFile,
            "collapseClick"
        );

    }
}


const collapseBtn = {   
    view    : "button",
    type    : "icon",
    id      : "collapseBtn",
    icon    : "icon-bars",
    css     : "webix_collapse",
    title   : "текст",
    height  : 42, 
    width   : 40,
    click   : collapseClick,
    on      : {
        onAfterRender: function () {
            this.getInputNode()
            .setAttribute("title", "Видимость бокового меню");
            checkFonts();
        }
    }    
};





;// CONCATENATED MODULE: ./src/js/components/header/logBtn.js


function logBtnClick(id){
    const btn = $$(id);

    if (btn.getValue() == 1){
        btn.setValue(2);

    } else {
        btn.setValue(1);
    }
}


function onChangeLogBtn(newValue){
    const list      = $$("logBlock-list");
    const logLayout = $$("logLayout");
    const logBtn    = $$("webix_log-btn");

    const lastItemList = list.getLastId();

    function setState (height,icon){
        logBtn.config.badge     = "";

        logLayout.config.height = height;
        logLayout.resize();

        logBtn.config.icon      = icon;
        logBtn.refresh();
    }

    if (newValue == 2){
        setState (90, "icon-eye-slash");
        list.showItem(lastItemList);

    } else {
        setState (5, "icon-eye");
    }
}


const logBtn = new buttons_Button({
    
    config   : {
        id       : "webix_log-btn",
        hotkey   : "Ctrl+M",
        icon     : "icon-eye", 
        badge    : 0,
        click   : function(id){
            logBtnClick(id)
        },
    },
    onFunc   :{
        onChange:function(newValue){
            onChangeLogBtn(newValue);
        }
    },
    titleAttribute : "Показать/скрыть системные сообщения"

   
}).minView();


;// CONCATENATED MODULE: ./src/js/components/favorites.js











const favorites_logNameFile = "favorites";

function setAdaptiveSize(popup){
    if (window.innerWidth < 1200 ){
        const size  = window.innerWidth * 0.89;
        try{
            popup.config.width = size;
            popup.resize();
        } catch (err){
            errors_setFunctionError(
                err,
                favorites_logNameFile,
                "setAdaptiveSize"
            );
        }
    }
 
}

function findFavsInUserData(data, id){
    const collection = [];
    try{

        data.forEach(function(el){
            if (el.name.includes("fav-link") && id == el.owner){
                const prefs  = JSON.parse(el.prefs);
                prefs.dataId = el.id;
                collection.push(prefs);
                
            }
        });

    } catch (err){
        errors_setFunctionError(
            err, 
            favorites_logNameFile, 
            "findFavsisUserData"
        );
    }
    
    return collection;
}


function createOptions(data, user){
    const favCollection = findFavsInUserData(data, user.id);
    const radio         = $$("favCollectionLinks");
    try{
        if (favCollection.length){
            favCollection.forEach(function(el){
         
                radio.addOption(
                    {   id      : el.id,
                        value   : el.name,
                        favLink : el.link,
                        dataId  : el.dataId
                    }
                );
                radio.removeOption(
                    "radioNoneContent"
                );
            });
        }

        $$("popupFavsLink").show();

    } catch (err){
        errors_setFunctionError(
            err, 
            favorites_logNameFile, 
            "createOptions"
        );
    }
 
}

async function favsPopupCollectionClick (){

    let user =  getUserDataStorage();

    if (!user){
        await pushUserDataStorage();
        user =  getUserDataStorage();
    }

    const path    = "/init/default/api/userprefs/";
    const getData = webix.ajax().get(path);
    
    getData.then(function(data){
        data = data.json().content;
        if (user){
            createOptions(data, user);
        }

    });

    getData.fail(function(err){
        setAjaxError(
            err, 
            "favsLink",
            "favsPopupCollectionClick"
        );
    });

    
}

function favsPopupSubmitClick(){
    try{
        const radio  = $$("favCollectionLinks");
        const value  = radio.getValue();
        const option = radio.getOption(value);
        window.location.replace(option.favLink);
    } catch (err){
        errors_setFunctionError(
            err,
            favorites_logNameFile,
            "favsPopupSubmitClick"
        );
    }
}

function favorites_returnEmptyOption(){
    return {   
        id       : "radioNoneContent", 
        disabled : true, 
        value    : "Здесь будут сохранены Ваши ссылки"
    };
}

const radioLinks = {
    view     : "radio", 
    id       : "favCollectionLinks",
    vertical : true,
    options  : [
        favorites_returnEmptyOption()
    ],
    on       : {
        onChange:function(newValue, oldValue){
            if (newValue !== oldValue){
                Action.enableItem($$("favLinkSubmit"));
            }

            Action.enableItem($$("removeFavsBtn"));
        }
    }
};

const favorites_container = {
    view       : "scrollview",
    scroll     : "y",
    maxHeight  : 300,
    borderless : true,
    body       : {
        rows: [
            radioLinks
        ]
    }
};

const favorites_btnSaveLink = new buttons_Button({

    config   : {
        id       : "favLinkSubmit",
        hotkey   : "Ctrl+Shift+Space",
        value    : "Открыть ссылку", 
        disabled : true,
        click    : function(){
            favsPopupSubmitClick();
        },
    },
    titleAttribute : "Открыть ссылку"

   
}).maxView("primary");

function deleteUserprefsData(options, option){
    const id = option.dataId;

    const url = "/init/default/api/userprefs/" + id;
    const deleteData = webix.ajax().del(url, {id : option.id});
    deleteData.then(function(data){

        data = data.json();

        if (data.err_type == "i"){
            const length = options.data.options.length;
            if (length == 1){
                const emptyOpt = favorites_returnEmptyOption();
                options.addOption(emptyOpt);
            }
            options.removeOption(option.id);

        } else {
            errors_setFunctionError(
                data.err, 
                favorites_logNameFile, 
                "deleteUserprefsData" 
            );
        }
   
    });

    deleteData.fail(function(err){
        setAjaxError(
            err, 
            favorites_logNameFile, 
            "deleteUserprefsData"
        );
    });
}
function favorites_removeBtnClick(){
    const options = $$("favCollectionLinks");
    const value   = options.getValue();
    const option  = options.getOption(value);
    
    modalBox("Закладка будет удалена из избранного", 
        "Вы уверены?", 
        ["Отмена", "Удалить"]
    )
    .then(function (result){

        if (result == 1){

            deleteUserprefsData(options, option);
            setLogValue (
                "success",
                `Закладка «${option.value}» удалена из избранного`
            );
        }
    });

}

function returnRemoveBtn(){
    const removeBtn = new buttons_Button({

        config   : {
            id       : "removeFavsBtn",
            hotkey   : "Alt+Shift+R",
            icon     : "icon-trash",
            disabled : true,
            click    : function(){
                favorites_removeBtnClick();
            },
        },
        titleAttribute : "Удалить ссылку из избранного"
       
    }).minView("delete");

    return removeBtn;
}

function favsPopup(){

    const popupFavsLink = new popup_Popup({
        headline : "Избранное",
        config   : {
            id    : "popupFavsLink",
            width     : 400,
            minHeight : 300,
    
        },

        elements : {
            padding:{
                left  : 5,
                right : 5
            },
            rows : [
                favorites_container,
                {height:15},
                {
                    cols:[
                        favorites_btnSaveLink,
                        returnRemoveBtn()
                    ]
                }
               
            ]
          
        }
    });

    popupFavsLink.createView ();
    
    favsPopupCollectionClick ();
    setAdaptiveSize($$("popupFavsLink"));
}




;// CONCATENATED MODULE: ./src/js/components/header/userContextBtn.js











const userContextBtn_logNameFile = "header => userContextBtn";

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
                   
                    errors_setFunctionError(
                        data.error, 
                        userContextBtn_logNameFile,
                        msg
                    );
                }
            }); 

            ajaxVar.fail(function(err){
                setAjaxError(err, userContextBtn_logNameFile, msg);
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
            userContextBtn_logNameFile,
            "onItemClickBtn getData"
        );
    });

 
}


const userContextBtn = new buttons_Button({
    
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


;// CONCATENATED MODULE: ./src/js/components/header/_layout.js




const logo = {
    view    : "label",
    label   : "<img src='/init/static/images/expalogo.png' "+
        " style='height:30px; margin: 10px;'>", 
    height  : 25,
};

const search = {
    view        : "search", 
    id          : "headerSearch",
    placeholder : "Поиск (Alt+Shift+F)", 
    css         : "searchTable",
    height      : 42, 
    hotkey      : "alt+shift+f",
    maxWidth    : 250, 
    minWidth    : 40, 
};

const header = {
    view    : "toolbar", 
    id      : "header",
    padding : 10,
    css     : "webix_header-style",
    elements: [
        {cols: [
            collapseBtn,
            logo
        ]},
        
        {},
        search,
        logBtn,
        userContextBtn,
    ]
};


;// CONCATENATED MODULE: ./src/js/components/header/setDefaultState.js
function headerDefState(){
    const headerChilds = $$("header").getChildViews();

    headerChilds.forEach(function(el){
        if (el.config.id.includes("search")){
            el.show();
        }
    });
}



;// CONCATENATED MODULE: ./src/js/components/header/loadContextMenu.js
function createItems (){

    const items = [];

    function pustItem(id, value, icon){
        const item = {
            id    : id, 
            value : value, 
            icon  : icon
        };

        if (id == "logout"){
            item.css = "webix_logout";
        }
      
        items.push(item);
    
        return items;
    }
    
    pustItem ("favs",       "Избранное",     "icon-star"     );
    pustItem ("settings",  "Настройки",      "icon-cog"      );
    pustItem ("cp",         "Смена пароля",  "icon-lock"     );
    pustItem ("logout",     "Выйти",         "icon-sign-out" );

      
   
    return items;
}

function generateHeaderMenu (menu){

    const btnContext = $$("button-context-menu");
    let menuHeader;

    menu.forEach(function(el,i){
        if (el.mtype !== 3){
            if (el.mtype !== 3 && el.childs.length !==0){
                menuHeader = createItems (el, menu, menuHeader);
            }
        }
    
    });

    if (btnContext.config.popup.data !== undefined){
        btnContext.config.popup.data = menuHeader;
        btnContext.enable();
    }


}


;// CONCATENATED MODULE: ./src/js/components/header/_headerMediator.js





class Header {
    constructor (){
        this.name = "tree";
    }

    create(){
        return header;
    }

    showView(){
        Action.showItem($$(this.name));   
    }

    load(data){
        generateHeaderMenu(data);
    }

    defaultState(){
        headerDefState ();
    }

}


;// CONCATENATED MODULE: ./src/js/components/tabs/actions.js

function add(){
    const tabbar = $$("globalTabbar");
    const id     = webix.uid();

    tabbar.addOption({
        id    : id, 
        value : "Новая вкладка", 
        info  : {},
        close : true, 
    }, true);

    tabbar.showOption(id);
}

function remove(){
    console.log('remove')
}


;// CONCATENATED MODULE: ./src/js/components/tabs/_tabMediator.js




class Tabs {
    addTab(){
        add();
    }

    removeTab(id){
        remove(id);
    }

    setInfo(values){
        const tabbar   = $$("globalTabbar");
        const tabId    = tabbar.getValue();
        const tabIndex = tabbar.optionIndex(tabId);
        tabbar.config.options[tabIndex].info = values;
        tabbar.refresh();
    }

    getInfo(){
        const tabbar   = $$("globalTabbar");
        const tabId    = tabbar.getValue();
        const tabIndex = tabbar.optionIndex(tabId);
        return tabbar.config.options[tabIndex].info;
     
    }
    
    changeTabName(id, value){
        let name;

        if (id){
            const field = GetFields.item(id);
            if (field){
                name = field.plural ? field.plural : field.singular;
            } else {
                name = "Новая вкладка";
            }
      
           
        } else {
            name = value;
        }
        const tabbar   = $$("globalTabbar");
        const tabId    = tabbar.getValue   ();
        const tabIndex = tabbar.optionIndex(tabId);

        tabbar.config.options[tabIndex].value = name;
        tabbar.refresh();
    }
}


;// CONCATENATED MODULE: ./src/js/blocks/globalModalBox.js




function getSettingsFormValues(id){
    const storageData = webix.storage.local.get(id);
    return storageData;

}

function settingsForm(form){
    const id = form.config.id;
    if (id == "userprefsWorkspaceForm" || 
        id == "userprefsOtherForm")
    {
        getSettingsFormValues(form);
    }
    const storageData = getSettingsFormValues(id);
    form.setValues(storageData);
}

function unsetDirty(){
    const forms = mediator.getForms();
    let check = {
        dirty:false
    };

    if (forms){
        forms.forEach(function(form){

            if (form && form.isDirty()){

                form.clear();

                settingsForm (form);

                form.setDirty(false);
            }
        });
    }

    return check;
}



function successActions(){
    unsetDirty();
}
 

async function globalModalBox (idForm){
    return modalBox().then(function(result){
    
        if (result == 1){
            successActions();
            return true;

        } else if (result == 2){
     
            if (idForm == "table-editForm"){
                const saveBtn = $$("table-saveBtn");
                if (saveBtn.isVisible()){
                    return mediator.tables.editForm.put(false, false)
                    .then(function(result){

                        if (result){
                            successActions(); 
                            return result;
                        }

                     
                    });
                } else {
                    return mediator.tables.editForm.post(false, false)
                    .then(function(result){

                        if (result){
                            successActions();
                            return result;
                        }
                    }); 
                }
            
            } else if (idForm == "cp-form"){
      
                return mediator.user_auth.put()
                .then(function (result){
           
                    if (result){
                        successActions();
                        return result;
                    }
                });
            } else if (idForm == "userprefsOtherForm" ||
                       idForm == "userprefsWorkspaceForm"){
                    
                    return mediator.settings.put()   
                    .then(function (result){
                        if (result){
                            successActions();
                            return result;
                        }
                    }); 
            } 
            
        }
       
    });

}


function hasDirtyForms(){
    const forms = mediator.getForms();
    let check = {
        dirty:false
    };

    if (forms){
        forms.forEach(function(form){

            if (form && form.isDirty() && !check.dirty){
                check = {
                    dirty : true,
                    id    : form.config.id
                };
            }
        });
    }

    return check;
}

async function clickModalBox(id){
    const dirtyInfo = hasDirtyForms();
    const isDirty   = dirtyInfo.dirty;

    if (isDirty){
        const idForm = dirtyInfo.id;
        return globalModalBox (idForm);
    } else {
        return true;
    }
  
}


;// CONCATENATED MODULE: ./src/js/blocks/setParamToLink.js
function createParameters(params){
    const paramsObj =  params;
    return  "?" + new URLSearchParams(paramsObj).toString();
}

function setParamToLink(vals){
    const params = createParameters(vals);
    window.history.replaceState(null, null, params);
}

function removeParamFromLink(id){
    const oldUrl = window.location.href;
    const url    = new URL(oldUrl);

    url.searchParams.delete(id);

    history.replaceState(null, null, url);
}



;// CONCATENATED MODULE: ./src/js/blocks/queryToString.js
function encodeQueryData(data) {
    const ret = [];
    for (let item in data){
        const name  = encodeURIComponent(item);
        const param = encodeURIComponent(data[item]);
        ret.push(name + '=' + param);
    }
 
    return ret.join('&');
}


// const data = { 
//     'query' : table + id, 
//     'sorts' : table, 
//     'limit' : 80 , 
//     'offset': 0 
// };



;// CONCATENATED MODULE: ./src/js/blocks/_mediator.js














        
const elems = [
    "dashboards",
    "tables",
    "forms",
    "settings",
    "user_auth",
];

const boxes = (/* unused pure expression or super */ null && ([     // id компонентов с модальными окнами
    "tree", //
    "header",
    "editForm",     //при добавлении новой записи
    "refernce btn", // кнопки у combo в edit form   //
    "table",
])); 


// editForm, cp, up

const _mediator_forms = []; // формы


const mediator = {
    dashboards  : new Dashboards(),
    tables      : new Tables    (),
    forms       : new Forms     (),
    settings    : new Settings  (),
    user_auth   : new UserAuth  (),
    treeEdit    : new TreeEdit  (),
    sidebar     : new Tree      (),
    header      : new Header    (),
    tabs        : new Tabs      (),

    getViews(){
        return elems;
    },

    setForm(elem){
        _mediator_forms.push(elem);
    },

    getForms(){
        return _mediator_forms;
    },

    getGlobalModalBox(id){
        return clickModalBox(id);
    },

    linkParam(set, param){
        if (set){
            setParamToLink(param);
        } else {
            removeParamFromLink(param);
        }
    },

    createQuery(params){
        return encodeQueryData(params);
    }



};



;// CONCATENATED MODULE: ./src/js/components/routerConfig/actions/hideAllElements.js




function hideAllElements (){

    try {
        const container = $$("container");
        const childs    = container.getChildViews();
        
        childs.forEach(function(el){
            const view = el.config.view;
            if(view == "scrollview" || view == "layout"){
                Action.hideItem($$(el.config.id));
            }
        });
    } catch (err){
        errors_setFunctionError(
            err,
            "routerConfig => hideAllElements",
            "hideAllElements"
        );
    }
  
     
}


;// CONCATENATED MODULE: ./src/js/components/routerConfig/actions/createElements.js


let specificElement;

function createDefaultWorkspace(){
    if(!specificElement){
        mediator.dashboards.create();
        mediator.tables.create();
        mediator.forms.create();
    }
}

function createTreeTempl(){
    if (specificElement == "treeTempl"){
        mediator.treeEdit.create();
    }
 
}

function createCp(){
    if (specificElement == "cp"){
        mediator.user_auth.create();
    }

}

function createUserprefs(){
    if (specificElement == "settings"){
        mediator.settings.create();
    }

}

function createSpecificWorkspace (){
    createTreeTempl();
    createCp();
    createUserprefs();
}


function createElements(specElem){
    specificElement = specElem;
    createDefaultWorkspace();
    createSpecificWorkspace ();
  
}


;// CONCATENATED MODULE: ./src/js/components/routerConfig/actions/createContent.js









function getMenuTree() {

    LoadServerData.content("mmenu")
    
    .then(function (result){
        if (result){
            const menu = GetMenu.content;
            mediator.sidebar.load(menu);
            mediator.header.load(menu);
        }

    });

}

function setUserData(){
  
    const data = STORAGE.whoami.content;

    const userStorageData = {
        id       : data.id,
        name     : data.first_name,
        username : data.username
    };

    setStorageData(
        "user", 
        JSON.stringify(userStorageData)
    );
}


async function createContent (){

    if (!STORAGE.whoami){
        await getData("whoami"); 
    }

    
    if (STORAGE.whoami){
        Action.hideItem($$("userAuth"  ));
        Action.showItem($$("mainLayout"));
    
        setUserData();
    
        createElements();
    
        getMenuTree();
    } else {
        Backbone.history.navigate("/", { trigger:true});
        window.location.reload();
    }


}



;// CONCATENATED MODULE: ./src/js/components/routerConfig/actions/_RouterActions.js







class RouterActions {
    static hideEmptyTemplates(){
        Action.removeItem($$("webix__null-content"));
        Action.hideItem  ($$("webix__none-content"));     
    }

    static hideContent   (){
        hideAllElements();
    }

    static createContentSpace (){
        createContent  ();
    }

    static async loadSpace(){
        const isSidebarData = mediator.sidebar.dataLength();

        if (!isSidebarData){
            await createContent();
        }
    }

    static createContentElements(id){
        createElements (id);
    }

}


;// CONCATENATED MODULE: ./src/js/components/routerConfig/tree.js






const tree_logNameFile = "router => tree";

 
let tree_id;



// function returnTopParent(){
//     let topParent;

//     const pull   = tree.data.pull;
//     const values = Object.values(pull);

//     values.forEach(function(el){
   
//         if ( el.webix_kids && !(tree.exists (id)) ){
//             topParent = el.id;
//         }

//     });

//     return topParent;
// }


async function tree_getTableData (){

    await LoadServerData.content("fields");
    const keys = GetFields.keys;
 
    if (keys){
        mediator.sidebar.selectItem(tree_id);
    }
}


async function createTableSpace (){
    RouterActions.createContentSpace();

    const isFieldsExists = GetFields.keys;
    try{   
        const tree = $$("tree");
        tree.attachEvent("onAfterLoad", 
        webix.once(function (){
            if (!isFieldsExists) {
                tree_getTableData ();
            } 
        }));         
       
    } catch (err){
        errors_setFunctionError(
            err, 
            tree_logNameFile, 
            "createTableSpace"
        );
    }

}



async function checkTable(){

    try {
        const isSidebarData = mediator.sidebar.dataLength();
        
        if (!isSidebarData){
            createTableSpace ();
            
        }
    } catch (err){
        errors_setFunctionError(
            err, 
            tree_logNameFile, 
            "checkTable"
        );

    }    
  
}
async function treeRouter(selectId){
    tree_id = selectId;

    checkTable();
}


;// CONCATENATED MODULE: ./src/js/components/routerConfig/index.js




const routerConfig_logNameFile = "router => index";


function goToContentPage(){
    
    try {
        Backbone.history.navigate(
            "content", 
            {trigger : true}
        );
    } catch (err){
        console.log(
            err + 
            " " + 
            routerConfig_logNameFile + 
            " goToContentPage"
        );
    }
}


function showLogin(){
    Action.hideItem($$("mainLayout"));
    Action.showItem($$("userAuth"  ));

}

async function indexRouter(){

    if (!STORAGE.whoami ){
        await getData("whoami"); 
    }


    if (STORAGE.whoami){
        goToContentPage();

    } else {
        showLogin();
    }
}




;// CONCATENATED MODULE: ./src/js/components/routerConfig/cp.js






const cp_logNameFile = "router => cp";
 
function setUserValues(){
    const user     = webix.storage.local.get("user");
    const authName =  $$("authName");
    try{
        if (user){
            const values = user.name.toString();
            authName.setValues(values);
        }
    } catch (err){
        errors_setFunctionError(
            err,
            cp_logNameFile,
            "setUserValues"
        );
    }
}

 
function cp_createCp(){
    const auth = $$("user_auth");
    
    if(auth){
        Action.showItem(auth);
    } else {
        RouterActions.createContentElements("cp");
        Action.showItem($$("user_auth"));
   
    }
}


function loadSpace(){
    const isSidebarData = mediator.sidebar.dataLength();

    if (!isSidebarData){
        RouterActions.createContentSpace(); //async ?
    }
}

function cpRouter(){
    
    loadSpace();

    RouterActions.hideContent();
    cp_createCp        ();
 
    mediator.sidebar.close();

    setUserValues     ();
    RouterActions.hideEmptyTemplates();
}



;// CONCATENATED MODULE: ./src/js/components/routerConfig/settings.js





const settings_logNameFile = "router => settings";



function setUserprefsNameValue (){
    const user = webix.storage.local.get("user");
    try{
        if (user){
            const name = user.name.toString();
            $$("settingsName").setValues(name);
        }
    } catch (err){
      
        errors_setFunctionError(
            err, 
            settings_logNameFile,
            "setUserprefsNameValue"
        );
    }

}



function setTemplateValue(data){

    try{
        data.forEach(function(el){
            const name    = el.name;
            const prefsId = "userprefs";
            if (name.includes   (prefsId)     && 
                name.lastIndexOf(prefsId) == 0){

                const prefs = JSON.parse(el.prefs);
                const form  = $$(name);
                form.setValues(prefs);
                form.config.storagePrefs = prefs;
            }
        });
    } catch (err){
        errors_setFunctionError(
            err, 
            settings_logNameFile, 
            "getDataUserprefs"
        );
    }


}

function getDataUserprefs(){
    const path          = "/init/default/api/userprefs/";
    const userprefsData = webix.ajax().get(path);

    userprefsData.then(function(data){
        data = data.json().content;
        setTemplateValue(data);
        
    });

    userprefsData.fail(function (err){
        setAjaxError(
            err, 
            settings_logNameFile, 
            "getDataUserprefs"
        );
    });
}


function settingsRouter(){

    const id   = "settings";
    const elem = $$(id);
    
    RouterActions.hideContent();

    if (mediator.sidebar.dataLength() == 0){
        RouterActions.createContentSpace();
    }

    if (elem){
        Action.showItem(elem);
    } else {
        RouterActions.createContentElements (id);
        getDataUserprefs();
        Action.showItem($$(id));
    }

    setUserprefsNameValue   ();

    mediator.sidebar.close  ();
    RouterActions.hideEmptyTemplates();
    
  
}


;// CONCATENATED MODULE: ./src/js/components/routerConfig/experimental.js



function experimental_loadSpace(){
    const isTreeData = mediator.sidebar.dataLength();
    if (!isTreeData){
        RouterActions.createContentSpace();
    }
}

function createTreeTemplate(){
    const id = "treeTempl";
    if (!$$(id)){
        RouterActions.createContentElements(id);
    }

    mediator.treeEdit.showView();
    mediator.treeEdit.load();
}


function experimentalRouter(){
    RouterActions.hideEmptyTemplates();
   
    RouterActions.hideContent();

    experimental_loadSpace          ();
    
    createTreeTemplate ();
    
    mediator.sidebar.close();
}



;// CONCATENATED MODULE: ./src/js/components/routerConfig/logout.js




const logout_logNameFile = "router => logout";

function clearStorage(){
    try{
    
        webix.storage.local.clear();
    } catch (err){
        errors_setFunctionError(
            err, 
            logout_logNameFile, 
            "clearStorage"
        );
    }
}


function backPage(){
    try{
        const search = window.location.search;
        Backbone.history.navigate("/content" + search, { trigger:true});
        window.location.reload();
    } catch (err){
        errors_setFunctionError(
            err, 
            logout_logNameFile, 
            "backPage"
        );
    }
}



function logoutRouter(){
    const path = "/init/default/logout/";
    const logoutData = webix.ajax().post(path);
  
    logoutData.then(function (){
        backPage        ();
        mediator.sidebar.clear();
        clearStorage    ();
    });

    logoutData.fail(function (err){
        setAjaxError(
            err, 
            logout_logNameFile, 
            "logoutData"
        );
    });  
}


;// CONCATENATED MODULE: ./src/js/components/routerConfig/_router.js


lib ();









function router (){
    let routes = new (Backbone.Router.extend({
    
        routes:{
            ""                : "index" ,
            "content"         : "content", 
            "settings"        : "settings",
            "cp"              : "cp",
            "logout"          : "logout",
            "tree/:id"        : "tree",
            "experimental/:id":"experimental"
        },
        
        content:function(){
            RouterActions.createContentSpace();
        },
    
        index:function(){
            indexRouter();

        }, 

        tree: function(id){
            treeRouter(id);
        },
        
        cp: function(){
            cpRouter();
    
      
        },
    
        settings: function(){
            settingsRouter();
            

        },

        experimental: function (){
            experimentalRouter();
        },
    
        logout: function (){
            logoutRouter();
        }
    
    }));

    return routes;
}


;// CONCATENATED MODULE: ./src/js/components/login.js



function login_createSentObj(){
    const loginData = {};
    const form      = $$("formAuth");
    try{
     
        const userData  = form.getValues();

        loginData.un    = userData.username;
        loginData.np    = userData.password;
        
    } catch (err){
        console.log(
            err + 
            " login function createSentObj"
        );
    }

    return loginData;
}


function postLoginData(){
    const loginData = login_createSentObj();
    const form      = $$("formAuth");

    const path      = "/init/default/login";
    const postData  = webix.ajax().post(path, loginData);

    postData.then(function(data){

        if (data.json().err_type == "i"){

            data = data.json().content;

            if (form){
                form.clear();
            }

            Backbone.history.navigate("content", { trigger:true});
            window.location.reload();
 
        } else {

            if (form && form.isDirty()){
                form.markInvalid(
                    "username", 
                    ""
                );
                form.markInvalid(
                    "password", 
                    "Неверный логин или пароль"
                );
            }
        }

    });

    postData.fail(function(err){
        console.log(
            err + 
            " login function postLoginData"
        );
    });
}

const invalidMsgText = "Поле должно быть заполнено";

function returnLogin(){
    const login =  {   
        view            : "text", 
        label           : "Логин", 
        name            : "username",
        invalidMessage  : invalidMsgText,
        on              : {
            onItemClick:function(){
                $$('formAuth').clearValidation();
            }
        }  
    };

    return login;
}


function clickPass(event, self){
    const className = event.target.className;
    const input     = self.getInputNode();

    function removeCss(className){
        webix.html.removeCss(event.target, className);
    }

    function updateInput(type, className){
        webix.html.addCss(event.target, className);
        input.type = type;
    }

    if (className.includes("password-icon")){
   
        removeCss("wxi-eye-slash");
        removeCss("wxi-eye");

        if(input.type == "text"){    
            updateInput("password", "wxi-eye"); 
        } else {
            updateInput("text", "wxi-eye-slash"); 
        }

    }
    
    $$('formAuth').clearValidation();
}


function returnPass(){
    const pass =  {   
        view            : "text", 
        label           : "Пароль", 
        name            : "password",
        invalidMessage  : invalidMsgText,
        type            : "password",
        icon            : "password-icon wxi-eye",   
        on              : {
            onItemClick:function(id, event){
                clickPass(event, this);
     
            },
        } 
    };

    return pass;
}

function getLogin(){

    const form = $$("formAuth");

    form.validate();
    postLoginData();

}

function returnBtnSubmit(){
    const btnSubmit = {   
        view    : "button", 
        value   : "Войти", 
        css     : "webix_primary",
        hotkey  : "enter", 
        align   : "center", 
        click   :getLogin
    };

    return btnSubmit;
}

function login_returnForm(){
    const form = {
        view        : "form",
        id          : "formAuth",
        width       : 250,
        borderless  : true,
        elements    : [
            returnLogin     (),
            returnPass      (),
            returnBtnSubmit (), 
        ],

        rules:{
            
            "username" : webix.rules.isNotEmpty,
            "password" : webix.rules.isNotEmpty,
    
          },
    
    
        elementsConfig:{
            labelPosition:"top"
        }
    
    };

    return form;
}


function login () {
    router();
    return login_returnForm();
}

const auth = {
    hidden  : true, 
    id      : "userAuth", 
    cols    : [
        {
            view    : "align", 
            align   : "middle,center",
            body    : login()
        },

    ]
}; 


;// CONCATENATED MODULE: ./src/js/components/logout/autoLogout.js




function resetTimer (){

    let timeout;

    window.onload       = resetTimer;
    window.onmousemove  = resetTimer;
    window.onmousedown  = resetTimer;      
    window.ontouchstart = resetTimer;
    window.onclick      = resetTimer;     
    window.onkeypress   = resetTimer;   
    window.addEventListener('scroll', resetTimer, true); 

    function resetTimer() {
        try {
            if (window.location.pathname !== "/index.html"        && 
                window.location.pathname !== "/"                  && 
                window.location.pathname !== "/init/default/spaw" ){
                
                clearTimeout(timeout);
                timeout = setTimeout(logout, 600000); // 600000
            }
        } catch (err){
            errors_setFunctionError(err, "autoLogout", "resetTimer");
        }
    }
    
}



;// CONCATENATED MODULE: ./src/js/blocks/adaptive.js





function resizeSidebar(){
    const tree          = $$("tree");
    const resizer       = $$("sideMenuResizer");
    const treeContainer = $$("sidebarContainer");

    function resizeTree(){
        try{
            if (tree){
                tree.config.width = 250;
                tree.resize();
            }
        } catch (err){
            errors_setFunctionError(
                err, 
                "adaptive", 
                "resizeSidebar => resizeTree"
            );
        }
    } 


    
    if (window.innerWidth < 850){
        Action.hideItem(tree   );
        Action.hideItem(resizer);
        Action.hideItem(treeContainer);
        tree.config.adaptiveState = true;

    } else if (tree.config.adaptiveState){
        Action.showItem(tree   );
        Action.showItem(resizer);
        Action.showItem(treeContainer);
        tree.config.adaptiveState = false;

    }

    if (window.innerWidth > 850 && $$("tree")){
        resizeTree();
    }
    
}

function setMinView(element, container, backBtn){
    if (element.isVisible()){
        element.config.width = window.innerWidth - 45;
        element.resize();
        Action.hideItem(container);
        Action.showItem(backBtn);
    }
}

function setMaxWidth(tools, сontainer, backBtn){
    if (tools.isVisible()          && 
        tools.config.width !== 350 ){
        tools.config.width  = 350;
        tools.resize();
        Action.showItem(сontainer);
        Action.hideItem(backBtn);
    }
}


function resizeForms(){

    const tools       = $$("formsTools");    
    const сontainer   = $$("formsContainer");
    const formResizer = $$("formsTools-resizer");
    const backBtn     = $$("table-backFormsBtnFilter");

    if (window.innerWidth < 850){
        setMinView(tools,сontainer, backBtn);
        Action.hideItem(formResizer);
    }


    if (window.innerWidth > 850){
        setMaxWidth(tools, сontainer, backBtn);
        Action.showItem(formResizer);
    }

  
}


function resizeContext(){
    const dashContainer = $$("dashboardInfoContainer");
    const contextWindow = $$("dashboardContext");
    
    if (window.innerWidth < 850){
        setMinView(contextWindow, dashContainer);
    }


    if (window.innerWidth > 850){
        setMaxWidth(contextWindow, dashContainer);
    }
}

function resizeTools(){
    const dashTool      = $$("dashboardTool");
    const dashContainer = $$("dashboardInfoContainer");
    const backBtn       = $$("dash-backDashBtn");

    
    if (window.innerWidth < 850){
        setMinView(dashTool, dashContainer, backBtn);
    }


    if (window.innerWidth > 850){
        setMaxWidth(dashTool, dashContainer, backBtn);
    }
            
}



function resizeTableEditForm(){
    const container = $$("tableContainer");
    const editForm  = $$("table-editForm");
    const backBtn   = $$("table-backTableBtn");
    const tree      = $$("tree");

    
    if ($$("container").$width < 850 && editForm.isVisible()){
        Action.hideItem(tree);
    }


    if (window.innerWidth < 850){
        setMinView(editForm, container, backBtn);
    }

    if (window.innerWidth > 850){
        setMaxWidth(editForm, container, backBtn);
    }

}

function resizeTableFilterForm (){

    const filterForm = $$("filterTableBarContainer");
    
    const container  = $$("tableContainer");
    const backBtn    = $$("table-backTableBtnFilter");
    const tree       = $$("tree");
 
    if (window.innerWidth < 850){
        setMinView(filterForm, container, backBtn);
    }

    if ($$("container").$width < 850 && filterForm.isVisible()){
        Action.hideItem(tree);
    }


    if (window.innerWidth > 850){
        setMaxWidth(filterForm, container, backBtn);
    }

}

function adaptive_setSearchInputState(){
    const headerChilds = $$("header").getChildViews();

    headerChilds.forEach(function(el){
        if (el.config.id.includes("search")){
            el.show();
        }
    });
}


function resizeAdaptive (){

    window.addEventListener('resize', function() {
  
        async function getActiveView (){  

            function setAdaptiveLogic(visibleEl){
                if (visibleEl == "forms"){
                    resizeForms();

                } else if (visibleEl == "dashboards"){
                    resizeTools();  
                    resizeContext();
                } else if (visibleEl == "tables"){
                    resizeTableEditForm();
                    resizeTableFilterForm ();

                } else if (visibleEl == "userprefs"){
                    //none

                } else if (visibleEl == "user_auth"){
                    //none

                }
            }

            function initLogic(){

                const elements = [
                    "forms", 
                    "dashboards", 
                    "tables", 
                    "userprefs", 
                    "user_auth"
                ];

                elements.forEach(function(el,i){
                    const elem = $$(el);
                    if(elem && elem.isVisible()){
                        setAdaptiveLogic(el);
                    }
                });
                    
                
            }

            initLogic();
        
        }
    
        getActiveView ();
        resizeSidebar();

        if(window.innerWidth > 850){
            adaptive_setSearchInputState();
        }

    }, true);
}



function adaptivePoints (){

    const tree = $$("tree");

    function hideTree(){
        if (window.innerWidth < 850 && tree){
          //  tree.hide();
        }
    }

    function addTreeEvent(){
        if (window.innerWidth < 1200 ){
            const editContainer = $$("editTableBarContainer");

            tree.attachEvent("onAfterLoad", function(){
                Action.hideItem(editContainer);
            });
 
            Action.hideItem(editContainer);

        }
    }


    hideTree();
    addTreeEvent();


}

;// CONCATENATED MODULE: ./src/js/blocks/webixGlobalPrefs.js

function createCustomEditor(){
    webix.editors.customDate = webix.extend({
        render:function(){
            return webix.html.create("div", {
            "class":"webix_dt_editor"
            }, "<input class='webix_custom-date-editor' id='custom-date-editor' type='text'>");
    }}, webix.editors.text);
    
}

function setDateFormat(){
    webix.i18n.setLocale("ru-RU");   
    webix.i18n.parseFormat = "%d.%m.%Y %H:%i:%s";
    webix.i18n.setLocale();
    webix.Date.startOnMonday = true;
}

function setMsgPosition(){
    webix.message.position = "bottom";
}

function protoUIEdittree () {
    webix.protoUI({
        name:"edittree"
    }, webix.EditAbility, webix.ui.tree);
}


function webixGlobalPrefs (){
    createCustomEditor  ();
    setDateFormat       ();
    setMsgPosition      ();
}

function backButtonBrowserLogic (){
    window.addEventListener('popstate', function(event) {
        window.location.replace(window.location.href);
        window.location.reload();
        
    });
}



;// CONCATENATED MODULE: ./src/js/components/routerConfig/routerStart.js
function routerStart_navigate(path){
    Backbone.history.start({pushState: true, root: path});
}

function setRouterStart(){
    if (window.location.host.includes("localhost:3000")){
        routerStart_navigate('/index.html/');
    } else {
        routerStart_navigate('/init/default/spaw/');
    }
}


;// CONCATENATED MODULE: ./src/js/components/tabs/logic.js




function createAddBtn(){
    const btn = new buttons_Button({
    
        config   : {
            id       : "addTabBtn",
           // hotkey   : "Ctrl+Shift+A",
            icon     : "icon-plus", //wxi-plus
            click    : function(){
                mediator.tabs.addTab();
            },
        },
        titleAttribute : "Добавить вкладку"
    
       
    }).transparentView();

    return btn;
}



;// CONCATENATED MODULE: ./src/js/components/tabs/tabbar.js



function showTreeItem(config){
    console.log(config)
    // показать элемент но не загружать с сервера
    //mediator.sidebar.selectItem(config.field);
}

function createTabbar(){
    const tabbar = {
        view    : "tabbar",
        id      : "globalTabbar",
        css     : "global-tabbar",
        value   : "container",
        tooltip : "#value#",
        optionWidth: 300,
        multiview  : true, 
        options : [
            { 
                id    : "container", 
                value : "Имя вкладки", 
                info  : {},
                close : true
            },
        ],
        on:{
            onItemClick:function(){
                webix.message({
                    text  :"Блок находится в разработке",
                    type  :"debug", 
                    expire: 10000,
                });
            },
            onBeforeTabClick:function(id){
                const option = this.getOption(id);

                const treeConfig = option.info.tree;
                if (treeConfig){
                    showTreeItem(treeConfig);
                }
            }
        }
     
    };

    const layout = {
        cols:[
            createAddBtn(),
            tabbar,
        ]
    };

    return layout;
}


;// CONCATENATED MODULE: ./src/js/app.js
console.log("expa 1.0.69"); 






 








         







const emptySpace = {
    view    : "align", 
    align   : "middle,center",
    id      : "webix__none-content",
    body    : {  
        borderless  : true, 
        template    : "Выберите элемент дерева", 
        height      : 50, 
        width       : 210,
        css         : {
            "color"    :"#858585",
            "font-size":"14px!important"
        }
    }

};

const app_container = {   
    id  : "container",
    cols: [
        emptySpace,
    ]
};

const adaptive = {   
    id  : "adaptive",
    rows: []
};

const sideMenuResizer = {   
    id  : "sideMenuResizer",
    view: "resizer",
    css : "webix_resizer-hide",
};

const logResizer = {
    view : "resizer", 
    id : "log-resizer"
};

const mainLayout = {   
    hidden  : true, 
    id      : "mainLayout",
    rows    : [
    
        {   id  : "mainContent",
            css : "webix_mainContent",
                                            
            cols: [
                { rows  : [
                    mediator.header.create(),
         
                    adaptive,
                
                    {cols : [
                        {   id   : "sidebarContainer",
                            rows : [
                            createOverlayTemplate("loadTreeOverlay"),
                            mediator.sidebar.create(),
                           
                        ]},
                        sideMenuResizer,
                        {rows:[
                            createTabbar(),
                            {   id    : "globalTabCells",
                                cells : [  
                                    app_container,
                                    
                                ]
                            }
                        ]}
                   
                        //container,
                    ]}
                ]}, 

            ]
        },
        logResizer,
        logLayout

    ]
};

try{

    webix.ready (function(){

        protoUIEdittree();

        webix.ui({
            view    : "scrollview",
            type    : "clean",
            id      : "layout", 
            css     : "layoutContainer",
            scroll  : "y", 
            body    : {

                cells : [ 
                    {},
                    auth,
                    mainLayout
                ],

            },

        });


      

        setUserPrefs            ();
        resizeAdaptive          ();
        setRouterStart          ();
        adaptivePoints          ();
        textInputClean          ();

        backButtonBrowserLogic  ();
        resetTimer              ();
        webixGlobalPrefs        ();

    });

} catch(err){
    alert("Ошибка при выполнении "+ err);
    errors_setFunctionError(err,"app","layout");
}

/******/ })()
;