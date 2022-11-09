/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/blocks/storageSetting.js


function setStorageData (name, value){
    if (typeof(Storage) !== 'undefined') {
        localStorage.setItem(name, value);
    } 
}

function setLoginActionPref(userLocation, userprefsWorkspace){
    function replaceUser(){
        if (userLocation       && 
            userLocation.href  && 
            userLocation.href !== window.location.href ){
        
            window.location.replace(userLocation.href);
        }
    }
    try{
        if (userprefsWorkspace){
            if (userprefsWorkspace.LoginActionOpt == 2){
                replaceUser();
            }
        } else {
            replaceUser();
        }
    } catch(err){
        errors_setFunctionError(err,"storageSettings","setLoginActionPref");
    }
}



function moveUser(){

    const localPath = "/index.html/content";
    const expaPath  = "/init/default/spaw/content";



    if ( window.location.pathname == localPath || window.location.pathname == expaPath ){
  
        const userprefsWorkspace = webix.storage.local.get("userprefsWorkspaceForm");
        const userLocation       = webix.storage.local.get("userLocationHref");
        const outsideHref        = webix.storage.local.get("outsideHref");

        if (outsideHref){
            const url = new URL( outsideHref.href );
            
            if ( url.origin == window.location.origin && !(url.pathname.includes("logout"))) {
                setLoginActionPref( outsideHref, userprefsWorkspace );
            }

        } else {
            const url = new URL( userLocation.href );
            if ( userprefsWorkspace && userprefsWorkspace.LoginActionOpt || !userprefsWorkspace ){

                if ( url.origin == window.location.origin && !(url.pathname.includes("logout"))) {
                    setLoginActionPref( userLocation, userprefsWorkspace );
                }
            }
        }

    }
}


function setLogPref(){
    const userprefsWorkspace = webix.storage.local.get("userprefsWorkspaceForm");
    const logLayout          = $$("logLayout");
    const logBtn             = $$("webix_log-btn");

    function hideLog(){
        logLayout.config.height = 5;
        logBtn.config.icon ="icon-eye";
        logBtn.setValue(1);
    }

    function showLog(){
        logLayout.config.height = 90;
        logBtn.config.icon ="icon-eye-slash";
        logBtn.setValue(2);
    }
    
    try{
        if (userprefsWorkspace){
 
            if (userprefsWorkspace.logBlockOpt !== undefined ){

                if (userprefsWorkspace.logBlockOpt == "2"){
                    hideLog();

                } else if(userprefsWorkspace.logBlockOpt == "1"){
                    showLog();
                }

                logLayout.resize();
                logBtn.refresh();
            }


        }
    } catch(err){
        errors_setFunctionError(err,"storageSettings","userprefsWorkspace");
    }
}



function setUserPrefs (userData){
 
    const userprefsData = webix.ajax("/init/default/api/userprefs/");
   
    userprefsData.then( function (data) {
        let user = webix.storage.local.get("user");
        data       = data.json().content;

        if (userData){
            user = userData;
        }
        
        function setDataToStorage(){
 
            try{
                data.forEach(function(el,i){
                    if (el.owner == user.id && !(el.name.includes("fav-link_"))){
                        setStorageData (el.name, el.prefs);
                    }
               
                });
            } catch(err){
                errors_setFunctionError(err,"storageSettings","setDataToStorage");
            }
        }

        
        function setPrefs(){
   
            if (!user){
                const userprefsGetData = webix.ajax("/init/default/api/whoami");
                userprefsGetData.then(function(data){
                    data = data.json().content;
                
                    let userData = {};
                
                    userData.id       = data.id;
                    userData.name     = data.first_name;
                    userData.username = data.username;
           
                    setStorageData("user", JSON.stringify(userData));
                });
                userprefsGetData.then(function(data){
                    user = webix.storage.local.get("user");
                    setDataToStorage ();
                    moveUser         ();
                    setLogPref       ();
                });

                userprefsGetData.fail(function(err){
                    setAjaxError(err, "favsLink", "btnSaveLpostContentinkClick => getUserData");
                });
    
            } else {
 
                setDataToStorage();
                moveUser        ();
            }

        
          
        }
        setPrefs();
    }).then(function(){
        setLogPref();
    });
    userprefsData.fail(function(err){
        setAjaxError(err, "storageSettings","setUserPrefs");
    });

}



;// CONCATENATED MODULE: ./src/js/blocks/logout/common.js





function logout() {

    const userprefsData = webix.ajax().get("/init/default/api/userprefs/");

    userprefsData.then(function(data){
        if (data.err_type !== "i"){
            errors_setFunctionError(data.json().err,"autoLogout","putUserPrefs");
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
                errors_setFunctionError(err,"autoLogout","putUserPrefs");
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
                errors_setFunctionError(err,"autoLogout","getWhoamiData")
            }
        }
        
        function postUserPrefs(){

            const postData = webix.ajax().post("/init/default/api/userprefs/",sentObj);

            postData.then(function(data){
                data = data.json();

                if (data.err_type !== "i"){
                    errors_setFunctionError(data.err,"autoLogout","putUserPrefs");
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
        errors_setFunctionError(err,"globalStorage","getTableNames")
    }
    return tableNames;
}

// function checkNotAuth (err){
//     if (err.status               === 401                  && 
//         window.location.pathname !== "/index.html"        && 
//         window.location.pathname !== "/init/default/spaw/"){
//         Backbone.history.navigate("/", { trigger:true});
//     }
// }

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
                    errors_setFunctionError(err,"globalStorage","getData")
                }
                return STORAGE[fileName];
            }).catch(err => {
                setAjaxError(err, "globalStorage","getData");
                checkNotAuth (err);
            }
        );
    }
    
}


;// CONCATENATED MODULE: ./src/js/blocks/logBlock.js






function createCurrDate(){
    const date    = new Date();
    const day     = date.getDate();
    const month   = String(date.getMonth() + 1).padStart(2, '0');
    const year    = date.getFullYear();
    const hours   = date.getHours();
    const minutes = String( date.getMinutes()).padStart(2, '0');
    const seconds = String( date.getSeconds()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}


function setLogValue (typeNotify,notifyText,specificSrc) {

    const currentDate = createCurrDate();

    function addLogMsg (src){
        if (!src){
            src = "expa";
        }
      
        $$("logBlock-list").add({
            date:currentDate,
            value:notifyText,
            src:src
        });
    }

    async function createLogMessage(srcTable) {
        let name;

        function findTableName(){
            try{
                STORAGE.tableNames.forEach(function(el,i){
                    if (el.id == srcTable){
                        name = el.name;
                    }
                });
            } catch (err){
                errors_setFunctionError(err,"logBlock","findTableName");
            }
        }

        if (srcTable == "version"){
            name = 'Expa v1.0.49';

        } else if (srcTable == "cp") {
            name = 'Смена пароля';

        } else {
            if (!STORAGE.tableNames){
                await getData("fields"); 
            }
    
            if (STORAGE.tableNames){
                findTableName();
            }
        }

        addLogMsg (name);
    }
       

    function initLogMsg(){
        try{
            let itemTreeId  = null;
            const tree      = $$("tree");

            if (tree.getSelectedItem()){
                itemTreeId  = tree.getSelectedItem().id;
            } else {
                const href  = window.location.pathname;
                const index = href.lastIndexOf( "/" );
                itemTreeId  = href.slice( index+ 1 );
            }
        
            if (specificSrc){
                createLogMessage(specificSrc);

            } else if (itemTreeId){
                createLogMessage(itemTreeId);

            } 
        } catch (err){
            errors_setFunctionError(err,"logBlock","initLogMsg");
        }
    }

    function getItemIndex(){
        const blockContainer = document.querySelector(".webix_log-block");
        let index;

        try{
            if (blockContainer){
                const elems      = ".webix_list_item";
                const blockElems = blockContainer.querySelectorAll(elems);
                blockElems.forEach(function(el,i){
                    index = i;
                });
            }
        } catch (err){
            errors_setFunctionError(err,"logBlock","getItemIndex");
        }
        return index;
    }

    function setErrTypeMsg(){
        
        const itemListIndex = getItemIndex();
        const elems         = ".webix_list_item";
        const item          = document.querySelectorAll(elems)[itemListIndex];

        function setStyle(){
            try{
                if (item!==undefined){
                    item.style.setProperty('color', 'red', 'important');
                }
            } catch (err){
                errors_setFunctionError(err,"logBlock","setStyle");
            }
        }

        function openLog(){
            try{
                const layout =  $$("logLayout");
                const btn    = $$("webix_log-btn");
                
                if (btn.config.icon =="icon-eye"){
                    layout.config.height = 90;
                    layout.resize();
                    btn.setValue(2);

                    btn.config.icon ="icon-eye-slash";
                    btn.refresh();

                    setStorageData("LogVisible", JSON.stringify("show"));
                }
            } catch (err){
                errors_setFunctionError(err,"logBlock","openLog");
            }
        }
        
        if (typeNotify == "error"){
            setStyle();
            openLog();
        }
    }   
       
    initLogMsg();
    setErrTypeMsg();

    
}

let notifyCounter = 0;

const logBlock = {
    id:"logBlock-list",
    css:"webix_log-block",
    view:"list",
    template:"#date# — #value#  (Источник: #src#)",
    data:[],
    on: {
        onAfterLoad:function(){
            try {
                setLogValue ("success","Интерфейс загружен","version");
            } catch (err){
                errors_setFunctionError(err,"logBlock","logBlock onAfterLoad");
            }
            
        },
        onAfterAdd:function(){
            const btn = $$("webix_log-btn");

            function addNotify(){
                try{
               
                    if ( btn.config.badge == "" ){
                        notifyCounter=0;
                    }
                    notifyCounter++;

                    btn.config.badge = notifyCounter;
                    btn.setValue(1);
                    btn.refresh();

                } catch (err){
                    errors_setFunctionError(err,"logBlock","logBlock onAfterAdd function addNotify");
                }
            }

            function clearNotify(){
                try{
                    notifyCounter = 0;
                    btn.config.badge = "";
                    btn.setValue(2);
                    btn.refresh();
                } catch (err){
                    errors_setFunctionError(err,"logBlock","logBlock onAfterAdd function clearNotify");
                }
            }
    
            if ( btn.config.icon == "icon-eye" ){
                addNotify();
            } else if ( btn.config.icon == "icon-eye-slash" ){
                clearNotify();
            }
            
          
        }
    }
};

const headline = {   
    template:"<div class='webix_log-headline'>Системные сообщения</div>", 
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



function catchErrorTemplate (code,error,otherType=false) {

    try{
        $$("webix_log-btn").setValue(2);
        notifyCounter = 0;

        if (!otherType){
            return setLogValue("error","ОШИБКА "+code+": "+error.stack);
        } else {
            return setLogValue("error","ОШИБКА "+code+": "+error);
        }
    } catch (err){
        console.log(err);
        alert("Ошибка при выполнении"+" "+ err);
        window.stop();
    }
}

function ajaxErrorTemplate (code, status,statusText,responseURL){
    $$("webix_log-btn").setValue(2);
   
    notifyCounter = 0;
    let errorMsg = "СТАТУС: "+status+" "+statusText+"."+" ПОДРОБНОСТИ: "+responseURL;
    return setLogValue("error","ОШИБКА "+code+": "+errorMsg,);

}




;// CONCATENATED MODULE: ./src/js/blocks/errors.js


function setAjaxError(err,file,func){
    if (err.status === 400 ||  err.status === 401 || err.status === 404){
        setLogValue("error", file+" function "+func+": "+err.status+" "+err.statusText+" "+err.responseURL+" ("+err.responseText+") ");
    } else {
        setLogValue("error", file+" function "+func+": "+err.status+" "+err.statusText+" "+err.responseURL+" ("+err.responseText+") ","version");
        window.alert("Ошибка. Статус: " + err.status+". Отсутствует соединение с сервером.");
    }
}

function errors_setFunctionError(err,file,func){
    console.log(err);
    setLogValue("error", file+" function "+func+": "+err);
}


;// CONCATENATED MODULE: ./src/js/blocks/commonFunctions.js



function getItemId (){
    let idTable;

    try{
        const table     = $$("table");
        const tableView = $$("table-view");

        if ($$("tables").isVisible()){
            idTable = table.config.idTable;
        } else if ($$("forms").isVisible()){
            idTable = tableView.config.idTable;
  
        }

    } catch (err){
        errors_setFunctionError(err,"commonFunctions","getItemId");
    }

    return idTable;
}

function hideElem(elem){
    try{
        if (elem){
            elem.hide();
        }
    } catch (err){
        errors_setFunctionError(err,"commonFunctions","hideElem, element: "+elem);
    }
}

function showElem (elem){
    try{
        if (elem && !(elem.isVisible())){
            elem.show();
        }
    } catch (err){
        errors_setFunctionError(err,"commonFunctions","showElem element: "+elem);
    }
}

function removeElem (elem){
    try{
        if(elem){
            const parent = elem.getParentView();
            parent.removeView(elem);
        }
    
    } catch (err){
        errors_setFunctionError(err,"commonFunctions","removeElem element: "+elem);
    }
}

function disableElem(element){
    try{
        if (element && element.isEnabled()){
            element.disable();
        }
    } catch (err){
        errors_setFunctionError(err,"sidebar","disableElements");
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
    const url       = "/init/default/api/"+refTable;

    return new webix.DataCollection({url:{
        $proxy:true,
        load: function(){
            return ( webix.ajax().get(url).then(function (data) {
                        data = data.json().content;
                        let dataArray=[];
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
                                errors_setFunctionError(err,"commonFunctions","getComboOptions => stringOption");
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
                                errors_setFunctionError(err,"commonFunctions","getComboOptions => numOption");
                            }
                        }

                        function createComboValues(){
                            try{
                                data.forEach((el,i) =>{
                                    let l = 0;
                                    stringOption (l,el);
                                    numOption    (l,el);
                                
                                });
                            } catch (err){  
                                errors_setFunctionError(err,"commonFunctions","getComboOptions => createComboValues");
                            }
                        }
                        createComboValues();
                        return dataArray;
                    
                    }).catch(err => {
                        setAjaxError(err, "commonFunctions","getComboOptions");
                    })
            );
            
        }
    }});
}



function getUserData(){
    const userprefsGetData = webix.ajax("/init/default/api/whoami");
    userprefsGetData.then(function(data){
        const err = data.json();
        data      = data.json().content;

        const userData = {};
    
        userData.id       = data.id;
        userData.name     = data.first_name;
        userData.username = data.username;
        
        setStorageData("user", JSON.stringify(userData));
    
        if (err.err_type !== "i"){
            errors_setFunctionError(err,"commonFunctions","function getUserData");
        }
    
    });
    userprefsGetData.fail(function(err){
        setAjaxError(err, "favsLink","btnSaveLpostContentinkClick => getUserData");
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


;// CONCATENATED MODULE: ./src/js/components/dashboard.js
const dashboardTool = {
    id      : "dashboardTool",
    css     : "webix_dashTool", 
    minWidth: 200,
    width   : 350,
    hidden  : true,
    rows    : []
};

function dashboardLayout () {
        return [
            {   view : "scrollview", 
                id   : "dashScroll",  
                body: 
                    {   
                        view: "flexlayout",
                        id  : "dashboardContainer",
                
                        cols: [
                            {   id      : "dashboardInfoContainer",
                                minWidth: 250, 
                                rows    : [] 
                            },
                            {view: "resizer"},
                            dashboardTool,
                          
                        
                        ]
                    } 
            }
        ];
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


function modalBox (title,text,btns){

    if(!title && !text && !btns){
        return webix.modalbox({
            title:"Данные не сохранены",
            css:"webix_modal-custom-save",
            buttons:["Отмена", "Не сохранять", "Сохранить"],
            width:500,
            text:"Выберите действие перед тем как продолжить"

        });
    } else {
        return webix.modalbox({
            title:title,
            css:"webix_modal-custom-save",
            buttons:btns,
            width:500,
            text:text

        });
    }
}

;// CONCATENATED MODULE: ./src/js/components/table/btnsInTable.js






const logNameFile = "table => btnsIntable";

function trashBtn(config,idTable){
    function delElem(){
 
        const table      = $$(idTable);
        const formValues = table.getItem(config.row);
        const itemTreeId = getItemId ();
        const url        = "/init/default/api/"+itemTreeId+"/"+formValues.name+".json" ;
 
        const delData    =  webix.ajax().del(url, formValues);

        delData.then(function(data){
            data = data.json();
            if (data.err_type == "i"){
                try {
                    const selectEl = table.getSelectedId();
                    table.remove(selectEl);
                } catch (err){
                    errors_setFunctionError(err,logNameFile,"wxi-trash => delData");
                }
                setLogValue("success","Данные успешно удалены");
            } else {
                setLogValue("error",data.err);
            }
        });

        delData.fail(function(err){
            setAjaxError(err, logNameFile,"wxi-trash => delElem");
        });
    }

  
    popupExec("Запись будет удалена").then(function(res){

        if (res){
            delElem();
        }
  
    });
}

function showPropBtn (cell){
    const propertyElem = $$("propTableView");

    function hideViewTools(){
        const btnClass          = document.querySelector(".webix_btn-filter");
        const primaryBtnClass   = "webix-transparent-btn--primary";
        const secondaryBtnClass = "webix-transparent-btn";
        
        hideElem($$("formsTools"));

        if (btnClass.classList.contains(primaryBtnClass)){
            btnClass.classList.add(secondaryBtnClass);
            btnClass.classList.remove(primaryBtnClass);
        }
    }

    function createUrl(){
        let url;
        try{
            const id      = cell.row;
            const columns = $$("table-view").getColumns();


            columns.forEach(function(el,i){
                if (el.id == cell.column){
                    url           = el.src;
                    let urlArgEnd = url.search("{");
                    url           = url.slice(0,urlArgEnd)+id+".json"; 
                }
            });  
        } catch (err){
            errors_setFunctionError(err,logNameFile,"wxi-angle-down => createUrl");
        }
        return url;
    }

    function getProp(){
        const url       = createUrl();
        const getData   = webix.ajax(url);

        getData.then(function(data){

            data = data.json().content;
            
            function setProps(){
                const arrayProperty = [];
      
                try{
                    data.forEach(function(el,i){
                        arrayProperty.push({
                            type    :"text", 
                            id      :i+1,
                            label   :el.name, 
                            value   :el.value
                        });
                    });

                    propertyElem.define("elements", arrayProperty);
                } catch (err){
                    errors_setFunctionError(err,logNameFile,"wxi-angle-down => setProps");
                }
            }
            
            function initSpace(){
                hideViewTools();
                showElem(propertyElem);
            }


            function resizeProp(){
                try{
                    if (propertyElem.config.width < 200){
                        propertyElem.config.width = 200;
                        propertyElem.resize();
                    }
                } catch (err){
                    errors_setFunctionError(err,logNameFile,"wxi-angle-down => resizeProp");
                }
            }

            setProps();
            initSpace();
            resizeProp();

        });

        getData.fail(function(err){
            setAjaxError(err, logNameFile,"wxi-angle-down => getProp");
        });
    }

    if (!(propertyElem.isVisible()))   {
        getProp();
    } else {
        hideElem(propertyElem);
    }
}


;// CONCATENATED MODULE: ./src/js/components/table/layout.js


const limitLoad   = 80;

function table (idTable, onFunc, editableParam=false) {
    return {
        view        : "datatable",
        id          : idTable,
        css         : "webix_table-style webix_header_border webix_data_border",
        autoConfig  : true,
        editable    : editableParam,
        editaction  :"dblclick",
        minHeight   : 350,
        //height:200,
        footer      : true,
        select      : true,
        resizeColumn: true,
        sort        : [],
        offsetAttr  : limitLoad,
        on          : onFunc,
        onClick     :{
            "wxi-trash":function(event,config,html){
                trashBtn(config,idTable);
            },

            "wxi-angle-down":function(event, cell, target){
                showPropBtn (cell);
            },
            
        },
        ready:function(){ 
            const firstCol = this.getColumns()[0];
            this.markSorting(firstCol.id, "asc");
        },
    };
}


;// CONCATENATED MODULE: ./src/js/blocks/tableEditForm/property.js


const property_logNameFile = "tableEditForm => property";

function setDirtyProperty (type=false){
    try{
        const property = $$("editTableFormProperty");
        if(property){
            property.config.dirty = type;
            property.refresh();
        }
    } catch (err){
        errors_setFunctionError(err,property_logNameFile,"setDirtyProperty");
    } 
}


function editingEnd (editor,value){
    try{
        const property = $$("editTableFormProperty");
        const item     = property.getItem(editor);
        item.value     = value;

        property.updateItem(editor);
        setDirtyProperty (true);

    } catch (err){
        errors_setFunctionError(err,property_logNameFile,"editingEnd");
    }
}

function propTooltipAction (obj){
    const label      = obj.label;
    const labelText  = "Название: "+label+" <br>";
    const formatData = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
    let value;
    let typeElem;
    
    if        ( obj.type       == "date" ){
        typeElem = "Выберите дату";

    } else if ( obj.type       == "combo" ){
        typeElem = "Выберите значение";

    } else if ( obj.customType == "integer" ){
        typeElem = "Введите число";

    } else {
        typeElem = "Введите текст";
    } 
    
    if (obj.type == "date"){
        value = formatData(obj.value);
        
    } else{
        value = obj.value;
    }

    if (obj.value){
        return labelText + "Значение: " + value;
    } else {
        return labelText + typeElem;
    }
}


function createTemplate (){
    document.getElementById('custom-date-editor').addEventListener('input', function (e) {

        const x = e.target.value.replace(/\D/g, '')
        .match(/(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})/);

        function setNum(index){
            return (x[index] ? x[index] : ' __ ');
        }

        if (e.inputType !== "deleteContentBackward"){
            e.target.value = setNum(1) + '.' + setNum(2) + '.' + setNum(3) + '  '+ 
            setNum(4) + ':' + setNum(5) + ':' + setNum(6);
        }
     
    });
}


const propertyEditForm = {   
    view     : "property",  
    id       : "editTableFormProperty", 
    css      : "webix_edit-table-form-property",
    dirty    : false,
    editable : true,
    tooltip  : propTooltipAction,
    hidden   : true,
    elements : [],
    on       : {
        onEditorChange:function(id, value){
        
            function setStateSaveBtn(){
                const saveBtn =$$("table-saveBtn"); 
                if (saveBtn              && 
                    saveBtn.isVisible()  &&
                  !(saveBtn.isEnabled()) ){ 
                    saveBtn.enable();
                }
            }

            editingEnd (id,value);
            setStateSaveBtn();

            const inputEditor = document.getElementById('custom-date-editor');

            if (inputEditor){
                createTemplate ();
            }
       
        },
        onBeforeRender:function (){

            const size = this.config.elements.length*28;
            
            if (size && this.$height !== size){
                this.define("height", size);
                this.resize();
            }
    
          
        },

        onAfterEditStop:function(state, editor){

            if (state.value !==state.old ){
                editingEnd (editor.id,state.value);
            }
        },

    }
};

const propertyRefBtns = {  
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
        propertyRefBtns,
        {width:4},
        propertyEditForm,
        {width:4}
    ]
};


;// CONCATENATED MODULE: ./src/js/blocks/tableEditForm/validation.js



const validation_logNameFile = "tableEditForm => validation";

function validateProfForm (){

    const errors = {};
    const messageErrors = [];

    
    function checkConditions (){ 
        const property = $$("editTableFormProperty");
        const propVals = Object.keys(property.getValues());

        propVals.forEach(function(el,i){

            const propElement = property.getItem(el);
            const values      = property.getValues();
            
            errors[el] = {};

            function numberField(){
                
                function containsText(str) {
                    return /\D/.test(str);
                }

                if (propElement.customType              &&
                    propElement.customType == "integer" ){

                    const check =  containsText(values[el]) ;

                    if ( check ){
                        errors[el].isNum = "Данное поле должно содержать только числа";
                    } else {
                        errors[el].isNum = null;
                    }
                       
                }
            }

            function dateField(){
         
                if (propElement.type              &&
                    propElement.type == "customDate" ){
                     
                    let check      = false;
                    let countEmpty = 0;
      
                    const x = values[el].replace(/\D/g, '')
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
                            errors[el].date = "Неверный формат даты. Введите дату в формате xx.xx.xx xx:xx:xx";
    
                        } else {
                            errors[el].date = null;
                        }
                    }
                       
                }
       
            }

            function valLength(){ 
                try{
               
                    if(values[el]){
                        
                        if (values[el].length > propElement.length && propElement.length !==0){
                            errors[el].length = "Длина строки не должна превышать "+propElement.length+" симв.";
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
                    if ( propElement.notnull == true && values[el].length == 0 ){
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
                        const tableSelect = $$("table").getSelectedId().id;

                        tableRows.forEach(function(row,i){
                            if (values[el].localeCompare(row[el]) == 0 && row.id !== tableSelect){
                                errors[el].unique = "Поле должно быть уникальным";
                            }
                        });
                    }
                } catch (err){
                    errors_setFunctionError(err,validation_logNameFile,"valUnique");
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
            Object.values(errors).forEach(function(col,i){

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
        errors_setFunctionError(err,validation_logNameFile,"validateProfForm");
    }
    return messageErrors;
}

function setLogError (){
    try{
        const table = $$("table");
        validateProfForm ().forEach(function(el,i){

            let nameEl;

            table.getColumns().forEach(function(col,i){
                if (col.id == el.nameCol){
                    nameEl = col.label;
                }
            });

            setLogValue("error",el.textError+" (Поле: "+nameEl+")");
        });

    } catch (err){
        errors_setFunctionError(err,validation_logNameFile,"setLogError");
    }
}


function uniqueData (itemData){
    const validateData = {};
    try{
        const table = $$("table");

        Object.values(itemData).forEach(function(el,i){

            const oldValues    = table.getItem(itemData.id)
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
        errors_setFunctionError(err,validation_logNameFile,"uniqueData");
    }

    return validateData;
}




;// CONCATENATED MODULE: ./src/js/blocks/tableEditForm/buttons.js









const buttons_logNameFile = "tableEditForm => buttons";

function updateWorkspace (itemData){
    try{
        const table   = $$( "table" );
        table.updateItem(itemData.id, itemData);
        table.clearSelection();
      
        defaultStateForm();
    } catch (err){
        errors_setFunctionError(err,buttons_logNameFile,"saveItem => updateWorkspace");
    }  
    
}


function setDirtyProp (property){
                     
    try{
        property.config.dirty = false;
        property.refresh();
    } catch (err){
        errors_setFunctionError(err,buttons_logNameFile,"saveItem => setDirtyProp");
    } 
}


function addNewStateSpace(){
    const table   = $$( "table" );
    const delBtn  = $$("table-delBtnId");
    const saveBtn = $$("table-saveBtn");
    const saveNew = $$("table-saveNewBtn");
    try{
        table.filter(false);
        createEditFields("table-editForm");
        delBtn.disable(); 
        saveBtn.hide();
        saveNew.show();
    } catch (err){
        errors_setFunctionError(err,buttons_logNameFile,"saveItem => addNewStateSpace");
    }
}


function dateFormatting(arr){
    const vals          = Object.values(arr);
    const keys          = Object.keys(arr);
    const formattingArr = arr;

    keys.forEach(function(el,i){
        const prop       = $$("editTableFormProperty");
        const item       = prop.getItem(el);
        const formatData = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");

        if ( item.type == "customDate" ){
            formattingArr[el] = formatData(vals[i]);
        }
    });
    return formattingArr;
}


function formattingBoolVals(arr){
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


function saveItem(addBtnClick=false, refBtnClick=false){    
  
    try{    
        
        const itemData = $$("editTableFormProperty").getValues();   
        const currId   = getItemId ();
       
        if (!(validateProfForm().length)){

            if( itemData.id ) {
                const link       = "/init/default/api/"+currId+"/"+itemData.id;
                
                const editForm       = $$("table-editForm");
                const property       = $$("editTableFormProperty");
                const addBtn         = $$("table-newAddBtnId");
                const emptyTempl     = $$("EditEmptyTempalte");
                const container      = $$("tableContainer");
                const uniqueVals     = uniqueData (itemData);
                const dateFormatVals = dateFormatting(uniqueVals)
                const sentObj        = formattingBoolVals(dateFormatVals);
 
                const putData    = webix.ajax().put(link, sentObj);

                putData.then(function(data){
                    data = data.json();

                    if (data.err_type == "i"){

                        if (!refBtnClick){
                            updateWorkspace (itemData);
                            hideElem(editForm);
                        }

                        if (!addBtnClick ){
                            addBtn.enable();
                            setDirtyProp(property);
                           
                        } else {
                            showElem(property);
                            addNewStateSpace();
                            hideElem(emptyTempl);
                        }
                 
                        showElem(container);

                        if(window.innerWidth < 850){
                            editForm.hide();
                        }
 
                        setLogValue("success","Данные сохранены",currId);

                    } else {
                        setLogValue("error",buttons_logNameFile+" function saveItem: "+data.err);
                    }
                });
                putData.fail(function(err){
                    setAjaxError(err, buttons_logNameFile,"saveItem");
                });
            }    

        } else {
            validateProfForm ().forEach(function(el,i){
                setLogError ();
            });
        }
    } catch (err){
        errors_setFunctionError(err,buttons_logNameFile,"saveItem");
    }

}

function addItem () {
    const emptyTemplate = $$("EditEmptyTempalte");
    const property      = $$("editTableFormProperty");
    const table         = $$("table");

    function setWorkspaceState (){
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
            createEditFields("table-editForm");
            hideElem(emptyTemplate);
        } catch (err){
            errors_setFunctionError(err,buttons_logNameFile,"addItem => setWorkspaceState");
        }
    
    }

    function setDirtyProp (){
        try{
            property.config.dirty = false;
            property.refresh();
        } catch (err){
            errors_setFunctionError(err,buttons_logNameFile,"addItem => setDirtyProp");
        }
    }
    
    function modalBoxAddItem(){
        modalBox().then(function(result){
            if (result == 1){
                setWorkspaceState ();
                setDirtyProp ();
            
            } else if (result == 2){
                saveItem(true);
                setDirtyProp ();
                hideElem(emptyTemplate);
            }
        });
    }

   

    function initPropertyForm(){
        showElem(property);
        property.clear();
    }


    try {
  
        if ( property.config.dirty == true ){
            modalBoxAddItem();
        } else {
            initPropertyForm();
            setWorkspaceState ();
            table.hideOverlay("Ничего не найдено");
        }

    }catch (err){
        errors_setFunctionError(err,buttons_logNameFile,"addItem");
    }


}

function removeNullFields(arr){
    const vals    = Object.values(arr);
    const keys    = Object.keys(arr);
    const sentObj = {};

    vals.forEach(function(el,i){
        if (el){
            sentObj[keys[i]]= el;
        }
        dateFormatting(arr);
    });

    return sentObj;
}

function setCounterVal (){
    try{
        const counter = $$("table-findElements");
        
        const oldVal  = counter.getValues();
        const newVal  = +oldVal + 1;

        counter.setValues(newVal.toString());
    } catch (err){
        errors_setFunctionError(err,buttons_logNameFile,"setCounterVal");
    }
}

function saveNewItem (){
    const currId = getItemId ();
 
    if (!(validateProfForm().length)){

        const editForm       = $$("table-editForm");
        const property       = $$("editTableFormProperty");
        const newValues      = property.getValues();
        const notNullVals    = removeNullFields  (newValues);
        const dateFormatVals = dateFormatting    (notNullVals);
        const sentVals       = formattingBoolVals(dateFormatVals);


        const postData  = webix.ajax().post("/init/default/api/"+currId, sentVals);
      
        postData.then(function(data){
            data = data.json();

            function setDirtyProp(){
                try{
                    property.config.dirty = false;
                    property.refresh();
                } catch (err){
                    errors_setFunctionError(err,buttons_logNameFile,"saveNewItem => setDirtyProp");
                }
            }

            function tableUpdate(){
                newValues.id = data.content.id;

                if (newValues.id <= $$("table").config.offsetAttr ){
                    $$("table").add(newValues); 
                }

                setCounterVal ();

            }

            if (data.content.id !== null){

                if (data.err_type == "i"){
                    try{
                        tableUpdate();
                        defaultStateForm ();
                        setDirtyProp();
                        $$("table-newAddBtnId").enable();
                        hideElem(editForm);
                        showElem($$("tableContainer"));

                        if(window.innerWidth < 850){
                            editForm.hide();
                        }

              
                    } catch (err){
                        errors_setFunctionError(err,buttons_logNameFile,"saveNewItem");
                    }
                    setLogValue("success","Данные успешно добавлены",currId);
                } else {
                    console.log(data);
                    setLogValue("error",buttons_logNameFile+" function saveNewItem: "+data.err);
                }
            } else {

                let errs = data.content.errors;
                let msg = "";
                Object.values(errs).forEach(function(err,i){
                    msg +=err+" (Поле: "+Object.keys(errs)[i] +"); ";
                });

                setLogValue("error","editTableForm function saveNewItem: "+msg);
            }
        });
        postData.fail(function(err){
            setAjaxError(err, "tableEditForm => btns","saveNewItem");
        });
    

    } else {
        setLogError ();
    }
 
}

function removeItem() {
 
    try{
        const currId = getItemId ();

        popupExec("Запись будет удалена").then(
            function(){

                const formValues  = $$("editTableFormProperty").getValues();
                const table       = $$( "table" );
                const tableSelect = table.getSelectedId().id;
                
                function removeRow(){
                    if(table){
                        table.remove(tableSelect);
                    }
                }

                removeRow();
                const link ="/init/default/api/"+currId+"/"+formValues.id+".json";
                const removeData = webix.ajax().del(link, formValues);

                removeData.then(function(data){
                    data = data.json();

                    if (data.err_type == "i"){
                        
                        defaultStateForm();
                        setDirtyProperty();
                        showElem($$("tableContainer"));

                        if(window.innerWidth < 850){
                            $$("table-editForm").hide();
                        }

                        setLogValue("success","Данные успешно удалены");
                    } else {
                        setLogValue("error","editTableForm function removeItem: "+data.err);
                    }
                });
                removeData.fail(function(err){
                    setAjaxError(err, buttons_logNameFile,"removeItem");
                });
     
        });
    } catch (err){
        errors_setFunctionError(err,buttons_logNameFile,"removeItem");
    }
    
}


function backTableBtnClick() {
    const form           = $$("table-editForm");
    const tableContainer = $$("tableContainer");
    const property       = $$("editTableFormProperty");
    const table          = $$("table");

    function defaultState(){
        hideElem(form);
        showElem(tableContainer);
        if (table){
            table.clearSelection();
        }
    }

    function createModalBox(){

        modalBox().then(function(result){
                        
            if (result == 1 || result == 2){
                if (result == 1){
                    defaultState();
                } else if (result == 2){
                    if (property.getValues().id){
                        saveItem();
                        defaultState();
                    } else {
                        saveNewItem(); 
                    }
                }

                setDirtyProperty ();
            }
        });
    }

    if (property.config.dirty){
        createModalBox ();
    
    } else {
        defaultState();
    }
  

}


function setAdaptiveValue(btn, adaptVal, mainVal){
    const width  = btn.$width;
   
    if (width < 120 &&  btn.config.value !== adaptVal ){
        btn.config.value = adaptVal;
        btn.refresh();
      
    } else if (width > 120 &&  btn.config.value !== mainVal ) {
        btn.config.value = mainVal;
        btn.refresh();
    }
}

const newAddBtn = {   
    view    : "button",
    id      : "table-newAddBtnId",
    height  : 48,
    minWidth: 50, 
    disabled: true,
    hotkey  : "alt+a",
    value   : "Новая запись", 
    click   : addItem,
    on      : {
        onAfterRender: function () {
            this.getInputNode().setAttribute("title", "Добавить новую запись (Alt+A)");
            setAdaptiveValue(this, "+", "Новая запись");

        },
    
    } 
};

const delBtn = {  
    view:"button",
    id:"table-delBtnId",
    disabled:true,
    height:48,
    width:50,
    hotkey: "ctrl+enter",
    css:"webix_danger", 
    type:"icon", 
    icon:"icon-trash", 
    click:removeItem,
    on: {
        onAfterRender: function () {
            this.getInputNode().setAttribute("title","Удалить запись из таблицы (Ctrl+Enter)");
        }
    },
     
};

const saveBtn = { 
    view    : "button", 
    id      : "table-saveBtn",
    hidden  : true, 
    value   : "Сохранить", 
    hotkey  : "shift+space",
    height  : 48, 
    css     : "webix_primary", 
    click   : function(){
        saveItem();
    },
    on: {
        onAfterRender: function () {
            this.getInputNode().setAttribute("title","Удалить запись из таблицы (Shift+Space)");
        }
    },
};

const saveNewBtn = { 
    view    : "button", 
    id      : "table-saveNewBtn",
  //  value   : "Сохранить новую запись",
    value   : "Сохранить",
    hidden  : true,  
    height  : 48,
    css     : "webix_primary", 
    hotkey  : "ctrl+shift+space",
    click   : function(){
        saveNewItem();
    },
    on: {
        onAfterRender: function () {
            this.getInputNode().setAttribute("title","Удалить запись из таблицы (Ctrl+Shift+Space)");
        }
    },
};

const backTableBtn = { 
    view    : "button", 
    id      : "table-backTableBtn",
    type    : "icon",
    icon    : "icon-arrow-left",
    value   : "Вернуться к таблице",
    hidden  : true,  
    height  : 48,
    minWidth: 60,
    width   : 90,
    hotkey  : "shift+q",
    click   : function(){
        backTableBtnClick();
    },
    on: {
        onAfterRender: function () {
            this.getInputNode().setAttribute( "title", "Вернуться к таблице (Shift+Q)" );
        }
    } 
};

const emptyTmplate = {   
    id         : "EditEmptyTempalte",
    css        : "webix_empty-template",
    template   : "Добавьте новую запись или выберите существующую из таблицы", 
    borderless : true,
};

const editFormBtns = {
    minHeight : 48,
    css       : "webix_form-adaptive", 
    margin    : 5, 
    rows:[
        {cols:[
            {   id      : "tablePropBtnsSpace",
                width   : 35, 
                hidden  : true
            },
            {rows:[
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
                        emptyTmplate,
                    ]
                },
             
            ]}
        ]}
   
     

    ]
};



;// CONCATENATED MODULE: ./src/js/blocks/tableEditForm/states.js









const states_logNameFile = "tableEditForm => states";

function destructorPopup(elem){
    try{
        const popup = elem;
        if (popup){
            popup.destructor();
        }
    } catch (err){
        errors_setFunctionError(err,states_logNameFile,"destructPopup");
    }
}

function enableBtn (elem){
    try{
            
        const btn = elem;

        if( btn && !(btn.isEnabled()) ){
            btn.enable();
        }
    } catch (err){
        errors_setFunctionError(err,states_logNameFile,"enableBtn");
    }
}

function createDateEditor(){
    webix.editors.$popup = {
        date:{
           view:"popup",
           body:{
            weekHeader:true,
            view:"calendar",
            events:webix.Date.isHoliday,
            timepicker: true,
            icons: true,
           }
        }
     };
}

function createEmptySpace(){
    $$("propertyRefbtnsContainer").addView({height:29,width:1});
}

async function toRefTable (refTable){ 

    if (!STORAGE.fields){
        await getData("fields"); 
    }

    if (STORAGE.fields){
        if (refTable){
            Backbone.history.navigate("tree/"+refTable, { trigger:true});
            window.location.reload();
        }

    }
}

function setRefTable (srcTable){
    const table = $$("table");
    const cols  = table.getColumns();
    const tree  = $$("tree");

    
    try {
        cols.forEach(function(col,i){

            if ( col.id == srcTable ){
            
                const refTable =  col.type.slice(10);

                if ( tree.getItem(refTable) ){

                        tree.select(refTable);
                } else {

                    if ( refTable ){
                        toRefTable (refTable);
                    }
                }
            
            }

        });
    } catch (err){
        errors_setFunctionError(err,states_logNameFile,"setRefTable");
        hideElem($$("EditEmptyTempalte"));
    }
}


function createRefBtn(selectBtn){
    const property = $$("editTableFormProperty");
    
    function btnClick (idBtn){
        const srcTable = $$(idBtn).config.srcTable;

        function createModalBox (){
            try{
                modalBox().then(function(result){
            
                    if (result == 1 || result == 2){
                        if (result == 1){
                        
                        } else if (result == 2){
                            if (property.getValues().id){

                                saveItem(false,true);
                            } else {
                                saveNewItem(); 
                            }
                            
                        }

                        setDirtyProperty ();
                        setRefTable (srcTable);
                    
                    }
                });
                
            } catch (err){
                errors_setFunctionError(err,states_logNameFile,"createModalBox");
            }
        }
        if ( property.config.dirty){
            createModalBox ();
        } else {
            setRefTable (srcTable);
        }
    }

  
    function btnLayout(){
        try{
            $$("propertyRefbtnsContainer").addView({ 
                view:"button", 
                type:"icon",
                srcTable:selectBtn,
                width:30,
                height:29,
                icon: 'icon-share-square-o',
                on: {
                    onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Перейти в родительскую таблицу");
                    },
                },
                click:function (id){
                    btnClick (id);
                }
            });
        } catch (err){
            errors_setFunctionError(err,states_logNameFile,"btnLayout");
        }
    }
   
    btnLayout();
    showElem($$("tablePropBtnsSpace"));
}

function createPopupOpenBtn(elem){
    const property = $$("editTableFormProperty");
    
    
    function btnClick (){
        
        function editPropSubmitClick (){
            try{
                const value = $$("editPropTextarea").getValue();
                property.setValues({ [elem.id]:[value] }, true);
            } catch (err){
                errors_setFunctionError(err,states_logNameFile,"editPropSubmitClick");
            }
            destructorPopup( $$("editTablePopupText"));
        }

        function setTextareaVal(){
            try{
                const area = $$("editPropTextarea");
                if (elem.value){
                    area.setValue(elem.value);
                }
            } catch (err){
                errors_setFunctionError(err,states_logNameFile,"setTextareaVal");
            }
        }


        function popupEdit(){
            function closePopupClick(){
                const area  = $$("editPropTextarea");
                const value = area.getValue();
            
                if (area.dirtyValue){
                    modalBox().then(function(result){
        
                        if (result == 1 || result == 2){
                            if (result == 2){
                                property.setValues({ [elem.id]:[value] }, true);
                            }
                            destructorPopup( $$("editTablePopupText"));
                        }
                    });
                } else {
                    destructorPopup( $$("editTablePopupText"));
                }
            }

            const popupHeadline = {   
                template:"Редактор поля  «" + elem.label + "»", 
                width:250,
                css:"popup_headline", 
                borderless:true, 
                height:20 
            };
        
            const btnClosePopup = {
                view:"button",
                id:"buttonClosePopup",
                css:"popup_close-btn",
                type:"icon",
                width:35,
                icon: 'wxi-close',
                click:function(){
                    closePopupClick();
                }
            };
            
            const textarea = { 
                view:"textarea",
                id:"editPropTextarea", 
                height:150, 
                dirtyValue:false,
                placeholder:"Введите текст",
                on:{
                    onKeyPress:function(){

                        enableBtn ($$("editPropSubmitBtn"));

                        $$("editPropTextarea").dirtyValue = true;
                    }
                }
            };

            const btnSave = {
                view:"button",
                id:"editPropSubmitBtn", 
                value:"Добавить значение", 
                css:"webix_primary", 
                disabled:true,
                click:function(){
                    editPropSubmitClick();
                }
            
            };
            
            webix.ui({
                view:"popup",
                id:"editTablePopupText",
                css:"webix_popup-prev-href",
                width:400,
                minHeight:300,
                modal:true,
                escHide:true,
                position:"center",
                body:{
                    rows:[
                    {rows: [ 
                        { cols:[
                            popupHeadline,
                            {},
                            btnClosePopup,
                        ]},
                        textarea,
                        {height:15},
                        btnSave,
                    ]}]
                    
                },
        
            }).show();
            
            setTextareaVal();
        
        }
        
        popupEdit();


    }

    function createBtnTextEditor(){
        try{
            $$("propertyRefbtnsContainer").addView({ 
                view:"button", 
                type:"icon",
                width:30,
                height:29,
                icon: 'icon-window-restore',
                on: {
                    onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Открыть большой редактор текста");
                    },
                },
                click:function ( ){
                    btnClick ( );
                }
            });
        } catch (err){
            errors_setFunctionError(err,states_logNameFile,"createBtnTextEditor");
        }
    }

    createBtnTextEditor();
    showElem($$("tablePropBtnsSpace"));
}

function createDatePopup(elem){

    const property = $$("editTableFormProperty");


    function btnClick(){
        const postFormatDate = webix.Date.dateToStr("%d.%m.%y");

        function setPropValues(){
            const val            = property.getValues()[elem.id]
            const postFormatHour = webix.Date.dateToStr("%H");
            const postFormatMin  = webix.Date.dateToStr("%i");
            const postFormatSec  = webix.Date.dateToStr("%s");
            const calendar       = $$("editCalendarDate");
            const btn            = $$("editPropCalendarSubmitBtn");

            function unsetDirtyProp(elem){
                elem.config.dirtyProp = false;
            }

            function setValuesDate(){
                try{
        
                    if ( val && !isNaN(postFormatHour(val)) ){
                        calendar.setValue( val );
                        $$("hourInp").setValue (postFormatHour(val));
                        $$("minInp") .setValue (postFormatMin (val));
                        $$("secInp") .setValue (postFormatSec (val));

            
                    } else {
                        calendar.setValue( new Date() );
        
                        if( btn ){
                            btn.disable();
                        }
                    }

                    unsetDirtyProp( calendar     );
                    unsetDirtyProp( $$("hourInp"));
                    unsetDirtyProp( $$("minInp" ) );
                    unsetDirtyProp( $$("secInp" ) );
            
                } catch (err){
                    errors_setFunctionError(err,states_logNameFile,"setValuesDate");
                }
            }


            setValuesDate();
           
        }

        function editPropCalendarSubmitClick (){

            const propId  = property.getValues().id;

            const calendar=  $$("editCalendarDate");

            const hour    = $$("hourInp").getValue();
            const min     = $$("minInp") .getValue();
            const sec     = $$("secInp") .getValue();

            const timeVal = hour+":"+min+":"+sec;
            const dateVal = postFormatDate(calendar.getValue());

            const sentVal = dateVal+" "+timeVal;

            const errors = [];

            function validTime(item,count,idEl){
                try{
                    if (item > count){
                        $$("timeForm").markInvalid(idEl);
                        errors.push(idEl);
                    }

                    if ( !( /^\d+$/.test(item) ) ){
                        $$("timeForm").markInvalid(idEl);
                        errors.push(idEl);
                    }

                    if (item.length < 2){
                        $$("timeForm").markInvalid(idEl);
                        errors.push(idEl);
                    }

                } catch (err){
                    errors_setFunctionError(err,states_logNameFile,"validTime element: "+idEl);
                }
            }

            validTime(hour,23 ,"hourInp");
            validTime(min, 59, "minInp" );
            validTime(sec, 59, "secInp" );

            function setValToProperty(){
                try{
                    if ( !(errors,errors.length) ){
                        property.setValues({ [elem.id]:sentVal}, true);
                        if(propId){
                            property.setValues({ id:propId}, true);
                        }
                        destructorPopup( $$("editTablePopupCalendar"));
                    }
                } catch (err){
                    errors_setFunctionError(err,states_logNameFile,"setValToProperty");
                }
            }

            setValToProperty();
        }

        function popupEdit(){

            function closePopupClick(){
                let check = false;
                function checkDirty(elem){
                    if ( elem.config.dirtyProp && !check ){
                        check = true;
                    }
                }

                checkDirty ( $$("editCalendarDate")) ;
                checkDirty ( $$("hourInp") );
                checkDirty ( $$("minInp" ) );
                checkDirty ( $$("secInp" ) );
   
                if (check){
                    modalBox().then(function(result){
        
                        if (result == 1 || result == 2){

                            if (result == 2){
                                editPropCalendarSubmitClick ();
                            }

                           destructorPopup( $$("editTablePopupCalendar"));
                        }
                    });
                } else {
                    destructorPopup( $$("editTablePopupCalendar"));
                }

            }

            const popupHeadline = {   
                template:"Редактор поля  «" + elem.label + "»", 
                width:250,
                css:"popup_headline", 
                borderless:true, 
                height:20 
            };

            const btnClosePopup = {
                view:"button",
                id:"buttonClosePopup",
                css:"popup_close-btn",
                type:"icon",
                hotkey:"esc",
                width:35,
                icon: 'wxi-close',
                click:function(){
                    closePopupClick();
                }
            };
        
          
            const dateView = {
                view:"calendar",
                format:"%d.%m.%y",
                borderless:true,
                id:"editCalendarDate",
                width:300,
                height:250,
                dirtyProp:false,
                on:{
                    onChange:function(){
                        this.config.dirtyProp = true;
                        enableBtn ($$("editPropCalendarSubmitBtn"));
                    }
                }
            } ;
        

            function returnInput(idEl){
                return {
                    view: "text",
                    name:idEl,
                    id:idEl,
                    placeholder:"00",
                    attributes:{ maxlength :2 },
                    dirtyProp:false,
                    on:{
                        onKeyPress:function(){
                            $$("timeForm").markInvalid(idEl, false);
                            enableBtn ($$("editPropCalendarSubmitBtn"));
                        },

                        onChange:function(){
                            this.config.dirtyProp = true;
                            enableBtn ($$("editPropCalendarSubmitBtn"));
                        }
                    }
                };
            }

            function timeSpacer (idEl){
                return {   
                    template:":",
                    id:idEl,
                    borderless:true,
                    width:9,
                    height:5,
                    css:"popup_time-spacer"
                };
            }

            const timeForm = {
                view:"form", 
                id:"timeForm",
                height:85,
                type:"space",
                elements:[
                    {   template:"<div style='font-size:13px!important'>"+
                        "Введите время в формате xx : xx : xx</div>",
                        borderless:true,
                        css:"popup_time-timeFormHead",
                        
                    },
                    { cols:[
                        returnInput("hourInp"),
                        timeSpacer (1),
                        returnInput("minInp"),
                        timeSpacer (2),
                        returnInput("secInp")
                    ]}
                ]
            };


    
        

            const dateEditor = {
                rows:[
                    dateView, 
                    {height:10}, 
                    timeForm,
                    {height:10}, 
                ]
            };
            
        

            const btnSave = {
                view:"button",
                id:"editPropCalendarSubmitBtn", 
                value:"Добавить значение", 
                css:"webix_primary", 
                click:function(){
                    editPropCalendarSubmitClick();
                }
            
            };
            
            webix.ui({
                view:"popup",
                id:"editTablePopupCalendar",
                css:"webix_popup-prev-href",
                width:400,
                minHeight:300,
                modal:true,
                escHide:true,
                position:"center",
                body:{
                    rows:[
                    {rows: [ 
                        { cols:[
                            popupHeadline,
                            {},
                            btnClosePopup,
                        ]},
                        dateEditor,
                        {height:15},
                        btnSave,
                    ]}]
                    
                },
        
            }).show();

            setPropValues();

        }
        popupEdit();
    }

    function createDateBtn(){
        try{
            $$("propertyRefbtnsContainer").addView({ 
                view:"button", 
                type:"icon",
                width:30,
                height:29,
                icon: 'icon-calendar',
                on: {
                    onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Открыть календарь");
                    },
                },
                click:function (id){
                    btnClick (id);
                }
            });
        } catch (err){
            errors_setFunctionError(err,states_logNameFile,"createDateBtn");
        }
    }

    createDateBtn();
    showElem($$("tablePropBtnsSpace"));
}


function setToolBtns(){
    const property      = $$("editTableFormProperty");
    const refBtns       = $$("propertyRefbtns");
    const propertyElems = property.config.elements;

    function createBtnsContainer(){
        try{
            refBtns.addView({
                id:"propertyRefbtnsContainer",
                rows:[]
            });
        } catch (err){
            errors_setFunctionError(err,states_logNameFile,"createBtnsContainer");
        }
    }


    if (!(refBtns._cells.length)){

        if (!$$("propertyRefbtnsContainer")){
            createBtnsContainer();
        }

        propertyElems.forEach(function(el,i){

            if        (el.type == "combo"){
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

function createGuid() {  
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {  
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);  
    });  
}

function createEditFields (parentElement) {
   const property = $$("editTableFormProperty");

    function addEditInputs(arr){
        property.define("elements", arr);
        property.refresh();
    }

    try {
        const columnsData = $$("table").getColumns(true);
        const inpElements = Object.keys($$(parentElement).elements);
        
        if ( inpElements.length==0  ){
            const inputsArray = [];
  
            columnsData.forEach((el,i) => {
             
                function defValue (){

                    function dateFormatting (){
                        return new Date(el.default);
                    }

                    const formatData = webix.Date.dateToStr("%d.%m.%y %H:%i:%s");

                    let defVal;
                    if (el.default === "now" && el.type == "datetime"){
                        defVal = formatData(new Date());

                    } else if (Date.parse(new Date(el.default)) && el.type == "datetime" ){
                        defVal = formatData(dateFormatting ());

                    } else if (el.default.includes("make_guid")) {
                        defVal = createGuid();

                    } else if (el.default == "False"){
                        defVal = 2;

                    } else if (el.default  == "True"){
                        defVal = 1;

                    } else if (el.default !== "None" && el.default !== "null"){
                        defVal = el.default;

                    } else if (el.default  == "None"){
                        defVal = "";

                    } else if (el.default  == "null") {
                        defVal = null;
                    }


                    return defVal;
                }

                
                const template = {
                    id      : el.id,
                    label   : el.label, 
                    unique  : el.unique,
                    notnull : el.notnull,
                    length  : el.length,
                    value   : defValue ()
                    
                };

                function createDateTimeInput(){
                    template.type = "customDate";

                }
              
                function createReferenceInput(){
               
                    let findTableId   = el.type.slice(10);
                    template.type     = "combo";
                    template.css      = el.id+"_container";
                    template.options  = getComboOptions(findTableId);
                    template.template = function(obj, common, val, config){
                        let item = config.collection.getItem(obj.value);
                        return item ? item.value : "";
                    };
                }

                function createBooleanInput(){
                    template.type = "select";
                    template.options = [
                        {id:1, value: "Да"},
                        {id:2, value: "Нет"}
                    ];
                }


                function createTextInput(){
                    if (el.length == 0 || el.length > 512){
                        template.customType="popup";

                    } 
                    template.type = "text";
             
                }

                function addIntegerType(){
                    template.customType = "integer";
                }


                if (el.type == "datetime"){
                    createDateTimeInput();

                    
                

                } else if (el.type.includes("reference")) {
                    createReferenceInput();

                } else if (el.type.includes("boolean")) {
                    createBooleanInput();

                } else if (el.type.includes("integer")) {
                    createTextInput();
                    addIntegerType();

                } else {
                    createTextInput();
                }
                
       
                inputsArray.push(template);
 
            });

       

            createDateEditor();
            addEditInputs(inputsArray);
            setToolBtns();
       

        } else {
            $$(parentElement).clear();
            $$(parentElement).clearValidation();

            if(parentElement=="table-editForm"){
                $$("table-delBtnId").enable();
            }
        }
    } catch (err){
        errors_setFunctionError(err,states_logNameFile,"createEditFields");
    }
}



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
        showElem($$("EditEmptyTempalte"));
        removeRefBtns();

    }catch (err){
        errors_setFunctionError(err,states_logNameFile,"defaultStateForm");
    }

}


;// CONCATENATED MODULE: ./src/js/components/table/common.js
 






const common_logNameFile = "table => common";


function common_setDirtyProperty (){
    const prop = $$("editTableFormProperty");
    prop.config.dirty = false;
    prop.refresh();
}

function toEditForm (nextItem) {
    const valuesTable = $$("table").getItem(nextItem); 

    function setViewDate(){
        const parseDate = webix.Date.dateToStr("%d.%m.%y %H:%i:%s");
        try{
            Object.values(valuesTable).forEach(function(el,i){
        
                if(el instanceof Date){
                    const key        = Object.keys(valuesTable)[i];
                    const value      = parseDate(el);
                    valuesTable[key] = value;
                }
            
            });
        } catch (err){ 
            errors_setFunctionError(err,common_logNameFile,"setViewDate")
        }
    }

    function setPropState(){
        try{
            const prop      = $$("editTableFormProperty");
            const form      = $$("table-editForm"); 
            const newAddBtn = $$("table-newAddBtnId");

            if (prop && !(prop.isVisible())){
                prop.show();

                if (window.innerWidth > 850){
                    form.config.width = 350;   
                    form.resize();
                }
            }

            if (!(newAddBtn.isEnabled())){
                newAddBtn.enable();
            }

            common_setDirtyProperty();
            setViewDate     ();

            prop.setValues(valuesTable);
        
            $$("table-saveNewBtn").hide();
            $$("table-saveBtn")   .show();
            $$("table-delBtnId")  .enable();

        } catch (err){   
            errors_setFunctionError(err,common_logNameFile,"toEditForm => setPropState");
        }
    }

    setPropState();

}


function validateError (){
    validateProfForm ().forEach(function(el,i){

        let nameEl;
        try{
            $$("table").getColumns().forEach(function(col,i){
                if (col.id == el.nameCol){
                    nameEl = col.label;
                }
            });
        } catch (err){ 
            errors_setFunctionError(err,common_logNameFile,"validateError")
        }
        setLogValue("error",el.textError+" (Поле: "+nameEl+")");
    });
}

function common_uniqueData (itemData){
    let validateData = {};

    try{
        Object.values(itemData).forEach(function(el,i){
            const oldValues    = $$("table").getItem(itemData.id)
            const oldValueKeys = Object.keys(oldValues);

            function compareVals (){
                let newValKey = Object.keys(itemData)[i];
                
                oldValueKeys.forEach(function(oldValKey){
                    
                    if (oldValKey == newValKey){
                        
                        if  (oldValues[oldValKey] !== Object.values(itemData)[i] ){
                            validateData[Object.keys(itemData)[i]] = Object.values(itemData)[i];
                        } 
                        
                    }
                }); 
            }
            compareVals ();
        });
    } catch (err){ 
        errors_setFunctionError(err,common_logNameFile,"uniqueData")
    }
    return validateData;
}

function putData (nextItem, valuesProp, currId, editInForm=false){
   
    if (!(validateProfForm().length)){

        if (valuesProp.id){

            let sentValues;
            if (editInForm){
                sentValues = common_uniqueData (valuesProp);
            } else {
                sentValues = valuesProp;
            }

            const table   =  $$("table");
            const url     = "/init/default/api/"+currId+"/"+valuesProp.id;
            const putData =  webix.ajax().put(url, sentValues);
            
            putData.then(function(data){
                data = data.json();
                if (data.err_type == "i"){

                    setLogValue("success","Данные сохранены");
                    table.updateItem(valuesProp.id, valuesProp);
                    removeElem($$("propertyRefbtnsContainer"));

                    if (editInForm){
                        toEditForm(nextItem);
                        table.select(nextItem);
                    }
                } if (data.err_type == "e"){
                    setLogValue("error",data.error);
                }
            });

            putData.fail(function(err){
                setAjaxError(err, common_logNameFile,"putData");
            });
        
        }

    } else {
        validateError ();
    }
}


;// CONCATENATED MODULE: ./src/js/components/table/onFuncs.js
 









const onFuncs_logNameFile = "table => onFuncs";

const onFuncTable = {

    onBeforeLoad:function(){
        this.showOverlay("Загрузка...");
    },
    
    onBeforeEditStop:function(state, editor, ignoreUpdate){
        const table      = $$("table");
        const valuesProp = table.getSelectedItem();
        const currId     = getItemId ();
        const tableItem  = table.getSelectedItem();
        try {
            if(state.value != state.old){

                const idRow = editor.row;
                const col   = editor.column;
                const val   = state.value;
              
                table.updateItem(idRow, {[col]:val});
                $$("editTableFormProperty").setValues(tableItem);
                putData ("", valuesProp, currId);

            }
        } catch (err){
            errors_setFunctionError(err,onFuncs_logNameFile,"onBeforeEditStop");
        }
    },

    onAfterSelect(id){

        function filterTableHide (){
            try{
                const filterContainer = $$("filterTableBarContainer");
                const filterForm      = $$("filterTableForm");
                const btnClass        = document.querySelector(".webix_btn-filter");

                hideElem(filterContainer);
                hideElem(filterForm);
      
                btnClass.classList.add   ("webix-transparent-btn");
                btnClass.classList.remove("webix-transparent-btn--primary");

            } catch (err){
                errors_setFunctionError(err,onFuncs_logNameFile,"onAfterSelect => filterTableHide");
            }
        }


        function statePutEditForm (){
            
            try{
                const newAddBtn = $$("table-newAddBtnId");
                const editForm  = $$("table-editForm");

                showElem($$("editTableBarContainer"));

                if (newAddBtn){
                    newAddBtn.enable();
                }
           
                hideElem($$("EditEmptyTempalte"));

                if( !(editForm.isVisible()) ){
                    editForm.show();
                    filterTableHide ();
                }

            } catch (err){
                errors_setFunctionError(err,onFuncs_logNameFile,"onAfterSelect => statePutEditForm")
            }
        }



        function adaptiveEditForm (){
            try {
                const form      = $$("table-editForm");
                const container = $$("container");

                if (container.$width < 850){

                    hideElem($$("tree"))

                    if (container.$width< 850){
                        hideElem($$("tableContainer"));

                        form.config.width = window.innerWidth;
                        form.resize();

                        showElem($$("table-backTableBtn"));
                    }
                  
                    showElem(form);
                    hideElem($$("EditEmptyTempalte"));
                }
            } catch (err){
                errors_setFunctionError(err,onFuncs_logNameFile,"onAfterSelect => adaptiveEditForm");
            }
        }

        statePutEditForm ();
        adaptiveEditForm ();

    },
    
    onBeforeSelect:function(selection, preserve){
        const table     = $$("table");
        const property  = $$("editTableFormProperty");
    

        const valuesProp = property.getValues();
        const currId = getItemId ();
        const nextItem = selection.id;


        function postNewData (nextItem,currId,valuesProp){
            if (!(validateProfForm().length)){
                const url      = "/init/default/api/"+currId;
                
                const postData = webix.ajax().post(url, valuesProp);
                
                postData.then(function(data){
                 
                    data = data.json();

                    function tableUpdate (){
                        valuesProp.id = data.content.id;
                        table.add(valuesProp);
                    }
                
                    if (data.content.id !== null){
                        tableUpdate ();
                        toEditForm(nextItem);
                        removeElem($$("propertyRefbtnsContainer"));
                        table.select(nextItem);
                        setLogValue("success","Данные успешно добавлены");
                    } else {

                        const errs = data.content.errors;
                        let msg = "";
                        Object.values(errs).forEach(function(err,i){
                            msg +=err+" (Поле: "+Object.keys(errs)[i] +"); ";
                        });

                        setLogValue("error",msg);
                    }
                    
                });

                postData.fail(function(err){
                    setAjaxError(err, onFuncs_logNameFile,"onBeforeSelect => postNewData");
                });
 
            } else {
                validateError ();
            }
        }
 
 
        function modalBoxTable (){

            try{
                if (property.config.dirty){

                    modalBox().then(function(result){
                        const saveBtn  = $$("table-saveBtn");

                        if (result == 1){
                            toEditForm(nextItem);
                            table.select(selection.id);
                            removeElem($$("propertyRefbtnsContainer"));
                        } 

                        else if (result == 2){
                        
                            if (saveBtn.isVisible()){
                                putData (nextItem,valuesProp,currId, true);
                            } else {
                                postNewData (nextItem,currId,valuesProp);
                            }
                        }

                    });

                    return false;
                } else {
                    createEditFields("table-editForm");
                    toEditForm(nextItem);
                }
            } catch (err){ 
                errors_setFunctionError(err,onFuncs_logNameFile,"onBeforeSelect => modalBoxTable")
            }
        }
 
        modalBoxTable ();

        if (property.config.dirty){
            return false;
        }
    },

    onAfterLoad:function(){
        try {
            this.hideOverlay();

            defaultStateForm ();
        } catch (err){
            errors_setFunctionError(err,onFuncs_logNameFile,"onAfterLoad")
        }
    },  

    onAfterDelete: function() {
        function overlay (){

            function returnTableView(){
                if ($$("table").isVisible()){
                    return "table";
                } else if ($$("table-view").isVisible()){
                    return "table-view";
                }
              
            }

            function setOverlayState(){
                const tableId   = returnTableView();
                const tableView = $$(tableId);
    
    
                if ( !tableView.count() ){
                    tableView.showOverlay("Ничего не найдено");
                }
                if ( tableView.count() ){
                    tableView.hideOverlay();
                }
            }

            setOverlayState();
      
        }
      
        overlay ();
    },

    onAfterAdd: function() {
        this.hideOverlay();
    },

};



;// CONCATENATED MODULE: ./src/js/components/authSettings.js




function doAuthCp (){
    try{
        const form = $$("cp-form");
        if ( form && form.validate()){
            
            let objPass = {op:"",np:""};
            let passData = form.getValues();
            objPass.np = passData.newPass;
            objPass.op = passData.oldPass;
            
            const postData = webix.ajax().post("/init/default/api/cp", objPass);
            
            postData.then(function(data){
                data = data.json();
                
                if (data.err_type == "i"){
                    setLogValue("success",data.err);
                } else {
                    setLogValue("error","authSettings function doAuthCp: "+data.err,"cp");

                }

                form.setDirty(false);
            });
            
            postData.fail(function(err){
                setAjaxError(err, "authSettings","doAuthCp post");
            });

        }
    } catch (err){
        errors_setFunctionError(err,"authSettings","doAuthCp")
    }

}

const authSettings_headline = {   
    template:"<div>Изменение пароля</div>",
    css:'webix_cp-form',
    height:35, 
    borderless:true
};

const userName = {   
    view:"template",
    id:"authName",
    css:"webix_userprefs-info",
    height:50, 
    borderless:true,
    template:function(){
        if (Object.keys($$("authName").getValues()).length !==0){
            return "<div style='display:inline-block;color:var(--primary);font-size:13px!important;font-weight:600'>"+
                    "Имя пользователя:</div>"+
                    "⠀"+
                    "<div style='display:inline-block;font-size:13px!important;font-weight:600'>"+
                    $$("authName").getValues()+
                    "<div>";
        } else {
            return "<div style='display:inline-block;color:var(--primary);font-size:13px!important;font-weight:600'>"+
                    "Имя пользователя:</div>"+
                    "⠀"+ 
                    "<div style='display:inline-block;font-size:13px!important;font-weight:600'>"+
                    "не указано</div>";
        }
    },
};

function generatePassInput(labelPass, namePass){
    return {   
        view:"text",
        width:300,
        labelPosition:"top", 
        type:"password",
        name:namePass,
        label:labelPass, 
    };
}


const btnSubmit = {   
    view:"button",
    height:48,
    width:300, 
    value:"Сменить пароль" , 
    css:"webix_primary", 
    click:doAuthCp
};

const authCp = {
    view:"form", 
    id:"cp-form",
    borderless:true,
    margin:5,
    elements:[
        authSettings_headline,
        userName,
        generatePassInput("Старый пароль", "oldPass"),
        generatePassInput("Новый пароль", "newPass"),
        generatePassInput("Повтор нового пароля", "repeatPass"),
        {   margin:5, 
            cols:[
                btnSubmit,
            ]
        }
    ],

    rules:{
        $all:webix.rules.isNotEmpty,
        $obj:function(data){
            
            if (data.newPass != data.repeatPass){
                setLogValue("error","Новый пароль не совпадает с повтором");
            return false;
            }

            if (data.newPass == data.oldPass && $$("cp-form").isDirty() ){
                setLogValue("error","Новый пароль должен отличаться от старого");
                return false;
            }
            return true;
        }
    },
};


const authCpLayout = {
    id:"layout-cp",cols:[
        authCp,
        {}
    ]
};


;// CONCATENATED MODULE: ./src/js/components/userprefs.js





let defaultValue = {
    userprefsOther    :{},
    userprefsWorkspace:{},
};

function saveSettings (){
    const tabbarVal = $$("userprefsTabbar").getValue()+"Form" ;
    const form = $$(tabbarVal);
    
    function getUserprefsData(){

        const getData =  webix.ajax().get("/init/default/api/userprefs/");
     
        getData.then(function(data){
            data = data.json().content;

            if (data.err_type == "e"){
                setLogValue("error",data.error);
            }

            let settingExists = false;

            const values = form.getValues();

            const sentObj = {
                name :tabbarVal,
                prefs:values,
            };

            function putPrefs(el){
                const url     = "/init/default/api/userprefs/"+el.id;
                const putData = webix.ajax().put(url, sentObj);

                putData.then(function(data){
                    data = data.json();
                    if (data.err_type == "i"){
                        setStorageData (tabbarVal, JSON.stringify(form.getValues()));
                        setLogValue("success","Настройки сохранены");

                    } if (data.err_type == "e"){
                        setLogValue("error",data.error);
                    }

                    const name         = $$("userprefsTabbar").getValue();
                    defaultValue[name] = values;

                    form.setDirty(false);
                });

                putData.fail(function(err){
                    setAjaxError(err, "userprefs","putPrefs");
                });
            }
     
            function findExistsData(){
                try{
                    data.forEach(function(el,i){
                       
                        if (el.name == tabbarVal){
                            settingExists = true;
                            putPrefs(el);
                        } 
                    });
                } catch (err){
                    errors_setFunctionError(err,"userprefs","findExistsData");
                }
            }

            findExistsData();


            function getOwnerData(){
                const getData = webix.ajax("/init/default/api/whoami");
                getData.then(function(data){
                    data = data.json().content;
                    sentObj.owner = data.id;

                    const userData = {};

                    userData.id       = data.id;
                    userData.name     = data.first_name;
                    userData.username = data.username;
                    
                    setStorageData("user", JSON.stringify(userData));
                });

                getData.fail(function(err){  
                    setAjaxError(err, "userprefs","getOwnerData");
                });
            }

            function postPrefs(){
       
                const url      = "/init/default/api/userprefs/";
  
                const postData = webix.ajax().post(url,sentObj);
 
                postData.then(function(data){
                    data = data.json();

                    if (data.err_type == "i"){
                        setLogValue("success","Настройки сохранены");

                    } else if (data.err_type == "e"){
                        setLogValue("error",data.error);
                    }

                    const tabbarVal         = $$("userprefsTabbar").getValue();
                    defaultValue[tabbarVal] = values;

                    form.setDirty(false);
                });

                postData.fail(function(err){
                    setAjaxError(err, "userprefs","postPrefs");
                });
            }

          
            if (!settingExists){
                
                const ownerId = webix.storage.local.get("user").id;
     
                if (ownerId){
                    sentObj.owner = ownerId;
                } else {
                    getOwnerData();
                }
       
                postPrefs();
            }

        });
        getData.fail(function(err){
            setAjaxError(err, "userprefs","getUserprefsData");
        });
    }

    if ( form.isDirty() ){
        getUserprefsData();
    } else {
        setLogValue("debug","Сохранять нечего");
    }
}


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
    on:{
        onChange:function(newValue, oldValue,config){
            try{
                const counter = $$("userprefsAutorefCounter");
                if (newValue == 1 && !(counter.isVisible()) ){
                    counter.show();
                }

                if (newValue == 2 &&  counter.isVisible()   ){
                    counter.hide();
                }
        
            } catch (err){
                errors_setFunctionError(err,"userprefs","autorefRadio => onChange");
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
        onChange:function(newValue, oldValue, config){
            function createMsg (textMsg){
                return webix.message({
                    type:"debug",
                    expire:1000, 
                    text:textMsg
                });
            }

            try{
                const counter = $$("userprefsAutorefCounter");
                const minVal  = counter.config.min;
                const maxVal  = counter.config.max;
                
                if (newValue == minVal){
                    createMsg ("Минимально возможное значение");

                } else if (newValue == maxVal){
                    createMsg ("Максимально возможное значение");
                }
            } catch (err){
                errors_setFunctionError(err,"userprefs","autorefCounter => onChange");
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

const otherForm =  {    
    view        : "form", 
    id          : "userprefsOtherForm",
    borderless  : true,
    elements    : [
        autorefRadio,
        {height:5},
        autorefCounter,
        {height:5},
        visibleIdRadio,
        {}
    ],
    on:{
        onChange:function(){
            const saveBtn  = $$("userprefsSaveBtn");
            const resetBtn = $$("userprefsResetBtn");
            const form     = $$("userprefsOtherForm");

            function setSaveBtnState(){
                try{
                    if ( form.isDirty() && !(saveBtn.isEnabled()) ){
                        saveBtn.enable();
                    } else if (!(form.isDirty())){
                        saveBtn.disable();
                    }
                } catch (err){
                    errors_setFunctionError(err,"userprefs","otherForm => onChange setSaveBtnState");
                }
            }

            
            function setResetBtnState(){
                try{
                    if ( form.isDirty() && !(resetBtn.isEnabled()) ){
                        resetBtn.enable();
                    } else if ( !(form.isDirty()) ){
                        resetBtn.disable();
                    }  
                } catch (err){
                    errors_setFunctionError(err,"userprefs","otherForm => onChange setResetBtnState");
                }
            }
            
            setSaveBtnState ();
            setResetBtnState();
         
        }
    }
};

const userprefsOther = {
    view      : "scrollview",
    borderless: true, 
    css       : "webix_multivew-cell",
    id        : "userprefsOther", 
    scroll    : "y", 
    body      : otherForm
};

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
            this.getInputNode().setAttribute("title","Показать/скрыть по умолчанию блок системных сообщений");
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
                errors_setFunctionError(err,"userprefs","logBlockRadio => onChange");
            }
 
        }
    }
};

const loginActionSelect = {   
    view         : "select", 
    name         : "LoginActionOpt",
    label        : "Действие после входа в систему", 
    labelPosition: "top",
    value        : 2, 
    options      : [
    { "id" : 1, "value" : "Перейти на главную страницу"            },
    { "id" : 2, "value" : "Перейти на последнюю открытую страницу" },
    ],
    on:{
        onAfterRender: function () {
            this.getInputNode().setAttribute("title","Показывать/не показывать всплывающее окно при загрузке приложения");
        },

    }
};

const workspaceForm =  {    
    view      : "form", 
    id        : "userprefsWorkspaceForm",
    borderless: true,
    elements  : [
        { cols:[
            { rows:[  
                logBlockRadio,
                {height:15},
                
                {cols:[
                    loginActionSelect,
                    {}
                ]}

            ]},
        ]},

    ],

    on        :{
        onChange:function(){
            const form     = $$("userprefsWorkspaceForm");
            const saveBtn  = $$("userprefsSaveBtn");
            const resetBtn = $$("userprefsResetBtn");

            function setSaveBtnState(){
                try{
                    if ( form.isDirty() && !(saveBtn.isEnabled()) ){
                        saveBtn.enable();
                    } else if ( !(form.isDirty()) ){
                        saveBtn.disable();
                    }
                } catch (err){
                    errors_setFunctionError(err,"userprefs","workspaceForm => setSaveBtnState");
                }
            }

            function setResetBtnState(){
                try{
                    if ( form.isDirty() && !(resetBtn.isEnabled()) ){
                        resetBtn.enable();
                    } else if ( !(form.isDirty()) ){
                        resetBtn.disable();
                    }  
                } catch (err){
                    errors_setFunctionError(err,"userprefs","workspaceForm => setResetBtnState");
                }
            }
      
            setSaveBtnState ();
            setResetBtnState();
        }
    }
};

const userprefsWorkspace = {
    view      : "scrollview",
    borderless: true, 
    css       : "webix_multivew-cell",
    id        : "userprefsWorkspace",
    scroll    : "y", 
    body      : workspaceForm
};


const userprefsConfirmBtns =  { 
    id:"a1", 
    rows:[
        {   responsive : "a1",
            cols:[
        
            {   view    : "button", 
            
                height  : 48,
                minWidth: 200,
                value   : "Сбросить" ,
                id      : "userprefsResetBtn",
                disabled: true,
            },

            {   view    : "button", 
                value   : "Сохранить настройки" ,
                height  : 48, 
                minWidth: 200,
                id      : "userprefsSaveBtn",
                css     : "webix_primary",
                disabled: true,
                click   : saveSettings,
            },
        ]}
    ]
};

function createHeadlineSpan(headMsg){
    return `<span class='webix_tabbar-filter-headline'>${headMsg}</span>`;
}

const tabbar = {   
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
            const tabbarVal = $$("userprefsTabbar").getValue()+"Form";
            const form      = $$(tabbarVal);

            function disableBtn(btn){
                try{
                    if (btn.isEnabled()){
                        btn.disable();
                    }   
                } catch (err){
                    errors_setFunctionError(err,"userprefs","tabbar => onBeforeTabClick");
                }
            }

            function createModalBox(){
                try{
                    webix.modalbox({
                        title   :"Данные не сохранены",
                        css     :"webix_modal-custom-save",
                        buttons :["Отмена", "Не сохранять", "Сохранить"],
                        width   :500,
                        text    :"Выберите действие перед тем как продолжить"
                    }).then(function(result){

                        if ( result == 1){
                            
                            const storageData = webix.storage.local.get(tabbarVal);
                            const saveBtn     = $$("userprefsSaveBtn");
                            const resetBtn    = $$("userprefsResetBtn");
                            const tabbar      = $$("userprefsTabbar");

                            form.setValues(storageData);

                            tabbar.setValue(id);

                            disableBtn(saveBtn);
                            disableBtn(resetBtn);

                        } else if ( result == 2){
                            saveSettings ();
                            tabbar.setValue(id);
                        }
                    });
                } catch (err){
                    errors_setFunctionError(err,"userprefs","tabbar => createModalBox");
                }
            }


            if (form.isDirty()){
                createModalBox();
                return false;
            }

        }
    }
};

const userprefsTabbar =  {
    rows:[
        tabbar,
        {
            cells:[
                userprefsWorkspace,
                userprefsOther
            ]
        },
        userprefsConfirmBtns
    ]
};


const userprefs_headline = {   
    view:"template",
    template:"<div>Настройки</div>",
    css:"webix_headline-userprefs",
    height:35, 
    borderless:true,
};


const userInfo =  {   
    view        : "template",
    id          : "userprefsName",
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

        const val       = $$("userprefsName").getValues();
        const lenghtVal = Object.keys(val).length;

        if (lenghtVal !==0){
            return createDivData(val); 
        } else {
            return createDivData("не указано");        
        }
    },
};

const userprefsHeadline =  [ 
    userprefs_headline,
    userInfo,
];


const userprefsLayout = {

    rows:[
        {   padding:{
                top     :15, 
                bottom  :0, 
                left    :20, 
                right   :0
            },
            rows:userprefsHeadline,
        },
        userprefsTabbar,
    ]

   
};



;// CONCATENATED MODULE: ./src/js/components/editTree.js




function contextMenu (){

    return {
        view:"contextmenu",
        id:"contextMenuEditTree",
        data:[
                "Добавить",
                "Переименовать",
                { $template:"Separator" },
                "Свернуть всё",
                "Развернуть всё",
                { $template:"Separator" },
                "Удалить"
            ],
        master: $$("treeEdit"),
        on:{
            onMenuItemClick:function(id){
                let context = this.getContext();

                let tree = $$("treeEdit");

                let titem = tree.getItem(context.id); 

                let menu = this.getMenu(id);
                let cmd = menu.getItem(id).value;

                let url = "/init/default/api/trees/";
            
                let postObj = {
                    name : "",
                    pid : "",
                    owner : null,
                    descr : "",
                    ttype : 1,
                    value : "",
                    cdt : null,
                };

          
                switch (cmd) {
                    case "Добавить": {
                    
                        let text = prompt("Имя нового подэлемента '"+titem.value+"'", "");
                    
                        if (text != null) {
                            postObj.name = text;
                            postObj.pid = titem.id;

                            const postData = webix.ajax().post(url, postObj);

                            postData.then(function(data){
                                try{
                                    data = data.json();
                                    if (data.err_type == "i"){
                                        
                                        let idNewItem = data.content.id;
                                    
                                        tree.data.add({
                                            id:idNewItem,
                                            value:text, 
                                            pid:titem.id
                                        }, 0, titem.id);
                                        
                                        tree.open(titem.id);
                                    
                                        setLogValue("success","Данные сохранены");
                                    } else {
                                        errors_setFunctionError( data.err,"editTree","case add post msg");
                                    }
                                } catch (err){
                                    errors_setFunctionError( err,"editTree","case add");
                                }
                            });

                            postData.fail(function(err){
                                setAjaxError(err, "editTree","case add");
                            });


                        }
                        break;
                    }
                
                    case "Переименовать": {
                        var text = prompt("Новое имя", titem.value);
                        if (text != null) { 
                            
                            postObj.name = text;
                            postObj.id = titem.id;
                            postObj.pid = titem.pid;

                            const putData =  webix.ajax().put(url + titem.id, postObj);

                            putData.then(function(data){
                                try{
                                    data = data.json();
                                    if (data.err_type == "i"){
                                        titem.value = text;
                                        tree.updateItem(titem.id, titem);
                                        setLogValue("success","Данные изменены");
                                    } else {
                                        errors_setFunctionError( data.err,"editTree","case rename put msg");
                                    }
                                } catch (err){
                                    errors_setFunctionError( err,"editTree","case rename");
                                }
                            });

                            putData.fail(function(err){
                                setAjaxError(err, "editTree","case rename");
                            });
                        }
                        break;
                    }
                    case "Удалить": {

                        const delData =  webix.ajax().del(url+titem.id,titem);

                        delData.then(function(data){
                            try{
                                data = data.json();
                                if (data.err_type == "i"){
                                    tree.remove(titem.id);
                                    setLogValue("success","Данные удалены");
                                } else {
                                    errors_setFunctionError( data.err,"editTree","case delete del msg");
                                }
                            } catch (err){
                                errors_setFunctionError( err,"editTree","case delete");
                            }
                        });

                        delData.fail(function(err){
                            setAjaxError(err, "editTree","case delete");
                        });

                        break;
                    }

                    case "Развернуть всё": {
                        try{
                            tree.open(titem.id);
                            tree.data.eachSubItem(titem.id, function(obj){ 
                                tree.open(obj.id);
                            });

                        } catch (err){
                            errors_setFunctionError( err,"editTree","case open all");
                        }
                        break;
                    }
                    case "Свернуть всё": {
                        try{
                            tree.close(titem.id);
                            tree.data.eachSubItem(titem.id, function(obj){ 
                                tree.close(obj.id);
                            });
                        } catch (err){
                            errors_setFunctionError( err,"editTree","case close all");
                        }
                        
                        break;
                    }
                    
                }
         
            }
    }
    };
}


function editTreeLayout () {
    const tree = {
        view:"edittree",
        id:"treeEdit",
        editable:true,
        editor:"text",
        editValue:"value",
        css:"webix_tree-edit",
        editaction:"dblclick",
        data:[
        ],
        on:{
            onAfterEditStop:function(state, editor, ignoreUpdate){
            try {
                let url = "/init/default/api/trees/";
                
                if(state.value != state.old){
                    let pid = $$("treeEdit").getParentId(editor.id);
                    
                    let postObj = {
                        name : state.value,
                        pid : pid,
                        id:editor.id,
                        owner : null,
                        descr : "",
                        ttype : 1,
                        value : "",
                        cdt : null,
                    };

                    const postData = webix.ajax().put(url+editor.id, postObj);

                    postData.then(function(data){
                        data = data.json();
                        if (data.err_type == "i"){
                            setLogValue("success","Данные изменены");
                        } else {
                            errors_setFunctionError(data.err,"editTree","tree onAfterEditStop postData msg");
                        }
                    });

                    postData.fail(function(err){
                        setAjaxError(err, "editTree","tree onAfterEditStop postData");
                    });


                }
            } catch (err){
                setAjaxError(err, "editTree","tree onAfterEditStop");
            }
        },
        }
    
    };


    return [

        {id:"treeEditContainer", 
            cols:[
                {rows: [
                        tree,
                    ],
                },
                {}
            ]
        }

        
    ];
}


webix.UIManager.addHotKey("Ctrl+Shift+E", function() { 

    Backbone.history.navigate("experimental/treeEdit", { trigger:true});

});


;// CONCATENATED MODULE: ./src/js/blocks/getContent/getInfoTable.js










const getInfoTable_logNameFile = "getContent => getInfoTable";

function submitBtn (idElements, url, verb, rtype){

    const valuesArray = [];

    function refreshButton(){

        function createQuery(){
            try{
                idElements.forEach((el,i) => {
                    const val = $$(el.id).getValue();

                    if (el.id.includes("customCombo")){
                        const textVal = $$(el.id).getText();
                        valuesArray.push (el.name + "=" + textVal);

                    } else if ( el.id.includes("customInputs")     || 
                                el.id.includes("customDatepicker") ){
                        valuesArray.push ( el.name + "=" + val );

                    }   
                });
            } catch (err){  
                errors_setFunctionError(err,getInfoTable_logNameFile,"refreshButton => createQuery");
            }
        }
  
        createQuery();

        const getData = webix.ajax( url + "?" + valuesArray.join("&") );
        
        getData.then(function(data){
            const tableView = $$("table-view");
            
            function setTableState(){
                data = data.json().content;
                try{
                    tableView.clearAll();

                    
                    if (data.length !== 0){
                        tableView.hideOverlay("Ничего не найдено");
                        tableView.parse(data);
                        setLogValue("success","Данные обновлены");

                    } else {
                        tableView.showOverlay("Ничего не найдено");

                    }
                } catch (err){  
                    errors_setFunctionError(err,getInfoTable_logNameFile,"refreshButton => setTableState");
                }
            }

            function setTableCounter(){
                try{
                    const findElementView = $$("table-view-findElements");
                    const prevCountRows   = tableView.count().toString();

                    findElementView.setValues(prevCountRows);
                } catch (err){  
                    errors_setFunctionError(err,getInfoTable_logNameFile,"refreshButton => setTableCounter");
                }
            }
            if (data.json().err_type == "i"){
                setTableState();
                setTableCounter();

            } else {
                errors_setFunctionError(data.err,getInfoTable_logNameFile,"refreshButton");
            }
        });
        getData.fail(function(err){
            setAjaxError(err, getInfoTable_logNameFile,"refreshButton");
        });
    }

    function downloadButton(){

        webix.ajax().response("blob").get(url, function(text, blob, xhr) {
            try {
                webix.html.download(blob, "table.docx");
            } catch (err){
                errors_setFunctionError(err,getInfoTable_logNameFile,"downloadButton");
            } 
        }).catch(err => {
            setAjaxError(err, getInfoTable_logNameFile,"downloadButton");
        });
    }

    function postButton(){

        async function uploadData(formData,link){
            fetch(link, {
                method  : "POST", 
                body    : formData
            })  
   
            .then(( response ) => response.json())
            .then(function( data ){
                const loadEl = $$("templateLoad");
       
                if ( data.err_type == "i" ){
                    loadEl.setValues( "Файл загружен" );
                    setLogValue( "success","Файл успешно загружен" );

                } else {
                    loadEl.setValues( "Ошибка" );
                    setLogValue( "error", data.err );
                }
            })
            
            .catch(function(err){
                errors_setFunctionError(err,getInfoTable_logNameFile,"uploadData");
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
        try{
       
            idElements.forEach((el,i) => {
                if (el.id.includes("customUploader")){
                
                    let value = Object.values($$(el.id).files.data.pull)[0];
                    let link = $$(el.id).config.upload;

                    let formData = new FormData();  
                    let container = $$(el.id).getParentView();
                    addLoadEl(container);

                    formData.append("file", value.file);

                    uploadData(formData,link);
                   
                }
            });
        } catch (err){  
            errors_setFunctionError(err,getInfoTable_logNameFile,"postButton");
        } 
    }

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

function createTableRows (idCurrTable,idsParam, offset=0){
    const dataContent  = STORAGE.fields.content;
    const data         = dataContent[idsParam];

    const itemTreeId   = idsParam;

    let idFindElem;

    if (idCurrTable.includes("view")){
        idFindElem  = "table-view-findElements";
    } else {
        idFindElem  = "table-findElements";
    }


    function getItemData (table){

        function setTableState(){
            function enableBtn(btn){
                try{
                    if(!(btn.isEnabled())){
                        btn.enable();
                    }
                } catch (err){
                    errors_setFunctionError(err,getInfoTable_logNameFile,"createTableRows => setTableState")
                }
            }
         
            if (table == "table"){
                enableBtn ($$("table-newAddBtnId"));
                enableBtn ($$("table-filterId"   ));
                enableBtn ($$("table-exportBtn"  ));

            }
      
        }

        function datePrefs (data){
 
            let dateFormat;

            const columns  = $$(table).getColumns();
            const dateCols = [];

            function searchDateCols (){
                try{
                    columns.forEach(function(col,i){
                        if ( col.type == "datetime" ){
                            dateCols.push( col.id );
                        }
                    });
                } catch (err){
                    errors_setFunctionError(err,getInfoTable_logNameFile,"createTableRows => searchDateCols")
                }
            }
            searchDateCols ();
        
            data.forEach(function(el,i){

                function dateFormatting ( elType ){
                
                    if ( el[elType] ){
                        dateFormat = new Date( el[elType] );
                        el[elType] = dateFormat;
                        
                    }
                }

                function setDateFormatting (){
                    dateCols.forEach(function(el,i){
                        dateFormatting (el);
                    });
                }

                setDateFormatting ();
             
            });
        }

        function parseRowData (data){

            const idCurrView= $$(idCurrTable);
           
            if (!offset){
                idCurrView.clearAll();
            }

          
    
            function enableVisibleBtn(){
                const viewBtn =  $$("table-view-visibleCols");
                const btn     =  $$("table-visibleCols");

                
                function disableBtn(el){
                    if (el){
                        el.enable();
                    }
                }
        
                if ( viewBtn.isVisible() ){
                    disableBtn (viewBtn);
                } else if ( btn.isVisible() ){
                    disableBtn (btn);
                }
              
            }

            function formattingBoolVals(){
                const cols     = idCurrView.getColumns();
                const boolsArr = [];

                const boolKeys = [];

                cols.forEach(function(el,i){
                    if (el.type == "boolean"){
                        boolsArr.push(el.id);
                    }
                });

                function findBool(key){
                    let check = false;
                    boolsArr.forEach(function(el,i){
                        if (el == key){
                            check = true;
                        } 
                    });
               
                    return check;
                }

           
                function findKey(){
                    const cols = idCurrView.getColumns();
                    cols.forEach(function(key,i){
                    
                        if(findBool(key.id)){
                            boolKeys.push(key.id);
                        }
                    });
            
                }
                findKey  ();


                function returnVal(element){
                    boolKeys.forEach(function(el,i){
                        if ( element[el] == false ){
                            element[el] = 2;
                        } else {
                            element[el] = 1;
                        }
                    });
   
                }

                data.forEach(function(el,i){
                    returnVal(el);
                });

            }
            formattingBoolVals();


            function checkNotUnique(idAddRow){

                Object.values(idCurrView.data.pull).forEach(function(el,i){
            
                    if ( el.id == idAddRow ){
                        idCurrView.remove(el.id);
                    }
                });
            }


            try{
                if ( !offset ){
                    if (data.length !== 0){
                        idCurrView.hideOverlay("Ничего не найдено");
                        idCurrView.parse(data);
               
                    } else {
                        idCurrView.showOverlay("Ничего не найдено");
                        idCurrView.clearAll();
                    }
                
                    setTimeout(() => {
                        enableVisibleBtn();
       
                    }, 1000);
                } else {
           
                
                    data.forEach(function(el,i){
                        checkNotUnique(el.id);
                        idCurrView.add(el);
                    });
                }
           
            } catch (err){
                errors_setFunctionError(err,getInfoTable_logNameFile,"createTableRows => parseRowData");
            }
        }


        function setCounterVal (data){
            try{
                const prevCountRows = data;
                $$(idFindElem).setValues(prevCountRows);
                
                if(idCurrTable == "table"){
                    $$("table-findElements").setValues(prevCountRows);
                }
            } catch (err){
                errors_setFunctionError(err,getInfoTable_logNameFile,"createTableRows => setCounterVal");
            }
        }



        const tableElem = $$(table);
        const limitLoad = 80;
        const firstCol = tableElem.getColumns()[0].id;

        function returnFilter(){
            const filterString = tableElem.config.filter;

            let filter;
            if (filterString){
                filter = filterString;
            } else {
                filter = itemTreeId +'.id+%3E%3D+0';
        
            }
            return filter;
        }

        function returnSort(){
            let sort;

            const sortCol  = tableElem.config.sort.idCol;
            const sortType = tableElem.config.sort.type;
        
            if (sortCol){
                if (sortType == "desc"){
                    sort = "~" + itemTreeId + '.' + sortCol;
                } else {
                    sort =       itemTreeId + '.' + sortCol;
                }
            } else {
                    sort =       itemTreeId + '.' + firstCol;
            }

            return sort;
        }
      
        function loadTableData(){
            tableElem.load({
                $proxy : true,
                load   : function(view, params){
                    const filter = returnFilter();
                    const sort   = returnSort  ();

                    const query = [ "query=" + filter, 
                                    "sorts=" + sort, 
                                    "limit=" + limitLoad, 
                                    "offset="+ offset
                    ];

              
                    let url;
                    const tableType = tableElem.config.id;
                    if (tableType == "table"){
                        url = "/init/default/api/smarts?"+ query.join("&");
                    } else {
                        url = "/init/default/api/" + itemTreeId;
                    }

                    const getData = webix.ajax().get( url );

                    getData.then(function(data){
                        data = data.json();

                        
                        if ( !offset && tableType == "table" ){
                            tableElem.config.reccount  = data.reccount;
                            tableElem.config.idTable   = itemTreeId;
                            tableElem.config.limitLoad = limitLoad;
                            setCounterVal (data.reccount.toString());
                        }

                        if( tableType == "table-view" ){
                            tableElem.config.idTable   = itemTreeId;
                            setCounterVal (data.content.length.toString());
                        }

                        data  = data.content;

                        try {
                            setTableState ();
                            datePrefs     (data);
                            parseRowData  (data);
                        
                        
                        } catch (err){
                   
                            errors_setFunctionError(err,getInfoTable_logNameFile,"getItemData => table load");
                        } 
                    
                    });
                    
                    getData.fail(function(err){

                        function tableErrorState (){
                            const prevCountRows = "-";
                            function disableBtn(btn){
                                if(btn){
                                    btn.disable();
                                }
                            }
                            try {
                                $$(idFindElem)          .setValues(prevCountRows.toString());
                                $$("table-findElements").setValues(prevCountRows.toString());
        
                                disableBtn ($$("table-newAddBtnId"));
                                disableBtn ($$("table-filterId"   ));
                                disableBtn ($$("table-exportBtn"  ));
                         
  
                          
                            } catch (err){
                                errors_setFunctionError(err,getInfoTable_logNameFile,"tableErrorState");

                            }
                        }

                        function notAuthPopup(){
                
                            function destructPopup(){
                                try{
                                    const popup = $$("popupNotAuth");
                                    if (popup){
                                        popup.destructor();
                                    }
                                } catch (err){
                                    errors_setFunctionError(err,getInfoTable_logNameFile,"notAuthPopup btnClosePopup click");
                                }
                            }
                            const popupHeadline = {   
                                template    : "Вы не авторизованы", 
                                width       : 250,
                                css         : "webix_template-not-found", 
                                borderless  : true, 
                                height      : 20 
                            };
                            const btnClosePopup = {
                                view  : "button",
                                id    : "buttonClosePopup",
                                css   : "popup_close-btn",
                                type  : "icon",
                                width : 35,
                                icon: 'wxi-close',
                                click:function(){
                                    destructPopup();
                                }
                            };
            
                            const popupSubtitle = {   
                                template    : "Войдите в систему, чтобы продолжить.",
                                css         : "webix_template-not-found-descr", 
                                borderless  : true, 
                                height      : 35 
                            };
            
                            const mainBtnPopup = {
                                view    : "button",
                                css     : "webix_btn-go-login",
                                height  : 46,
                                value   : "Войти",
                                click   : function(){
                                    function navigate(){
                                        try{
                                            Backbone.history.navigate("/", { trigger:true});
                                            window.location.reload();
                                        } catch (err){
                                            errors_setFunctionError(err,getInfoTable_logNameFile,"notAuthPopup navigate");
                                        }
                                    }
                                    destructPopup();
                                    navigate();
                                 
                               
                                }
                            };
            
                            webix.ui({
                                view    : "popup",
                                id      : "popupNotAuth",
                                css     : "webix_popup-prev-href",
                                width   : 340,
                                height  : 125,
                                modal   : true,
                                position: "center",
                                body    : {
                                    rows: [
                                    {rows: [ 
                                        { cols: [
                                            popupHeadline,
                                            {},
                                            btnClosePopup,
                                        ]},
                                        popupSubtitle,
                                        mainBtnPopup,
                                        { height : 20 }
                                    ]}]
                                    
                                },
            
                            }).show();
                        }

                        tableErrorState ();

                        if (err.status == 401){
                    
                            if (!($$("popupNotAuth"))){
                                notAuthPopup();
                            }
                      
                        } 

                        setAjaxError(err, "getInpoTable","getData");
                    });

                }
            });
        }

        const reccount = tableElem.config.reccount;

        if (reccount){
            const remainder = reccount - offset;

            if (remainder > 0){
                loadTableData(); 
            }

        } else {
            loadTableData(); 
        }

       
    }

    function setDataRows (){
        if(data.type == "dbtable"){
            getItemData ("table");
        } else if (data.type == "tform"){
            getItemData ("table-view");
        }
    }

    function autorefreshProperty (){
        if (data.autorefresh){

            const userprefsOther = webix.storage.local.get("userprefsOtherForm");
            let counter;

            if (userprefsOther){
                counter = userprefsOther.autorefCounterOpt;
            }

            if ( userprefsOther && counter !== undefined ){
                if ( counter >= 15000 ){

                    setInterval(function(){
                        if( data.type == "dbtable" ){
                            getItemData ("table");
                        } else if ( data.type == "tform" ){
                            getItemData ("table-view");
                        }
                    }, counter );
                } else {
                    setInterval(function(){
                        if( data.type == "dbtable" ){
                            getItemData ("table");
                        } else if ( data.type == "tform" ){
                            getItemData ("table-view");
                        }
                    }, 120000);
                }
            }
        } 
    }

    setDataRows ();
    autorefreshProperty ();

            
}

function getInfoTable (idCurrTable,idsParam) {
 
    let filterBar,
        titem
    ;

    function getValsTable (){
        titem = $$("tree").getItem(idsParam);

        if (!titem){
            titem = idsParam;
        }

        try{ 
            if (idCurrTable.includes("view")){
            
                filterBar = $$("table-view-filterId").getParentView();
            
            } else {
                filterBar = $$("table-filterId").getParentView();
              
            }
        } catch (err){  
            errors_setFunctionError(err,getInfoTable_logNameFile,"getValsTable");
        }
    }

    function preparationTable (){
        try{
            $$(idCurrTable).clearAll();

            if (idCurrTable == "table-view"){
                const popup       = $$("contextActionsPopup");
                const btnAdaptive = $$("contextActionsBtnAdaptive");
                const inputs      = $$( "customInputs" );
                const inputsMain  = $$("customInputsMain");
                
                
                if (popup){
                    popup.destructor();
                }
      
                
                if (btnAdaptive){
                    filterBar.removeView(btnAdaptive);
                }

                if (inputs){
                    const parent = inputs.getParentView();
                    parent.removeView(inputs);
                }

                if (inputsMain){
                    const parent = inputsMain.getParentView();
                    parent.removeView(inputsMain);
                }
            
            }
        } catch (err){  
            errors_setFunctionError(err,getInfoTable_logNameFile,"preparationTable");
        }
    }


    function createExperementalElement (){
        STORAGE.fields.content.treeTemplate={
            "fields": {
                "id": {
                    "type": "id",
                    "unique": false,
                    "notnull": false,
                    "length": 512,
                    "label": "Id",
                    "comment": null,
                    "default": "None"
                },
                "pid": {
                    "type": "reference trees",
                    "unique": false,
                    "notnull": false,
                    "length": 512,
                    "label": "Родитель",
                    "comment": null,
                    "default": "None"
                },
                "owner": {
                    "type": "reference auth_user",
                    "unique": false,
                    "notnull": false,
                    "length": 512,
                    "label": "Владелец",
                    "comment": null,
                    "default": "None"
                },
                "ttype": {
                    "type": "integer",
                    "unique": false,
                    "notnull": false,
                    "length": 512,
                    "label": "Тип",
                    "comment": "Тип записи|1=системная;2=пользовательская|Перечисление",
                    "default": "1"
                },
                "name": {
                    "type": "string",
                    "unique": false,
                    "notnull": false,
                    "length": 100,
                    "label": "Наименование",
                    "comment": null,
                    "default": ""
                },
                "descr": {
                    "type": "string",
                    "unique": false,
                    "notnull": false,
                    "length": 1000,
                    "label": "Описание",
                    "comment": null,
                    "default": ""
                },
                "value": {
                    "type": "string",
                    "unique": false,
                    "notnull": false,
                    "length": 1000,
                    "label": "Значение",
                    "comment": null,
                    "default": ""
                },
                "cdt": {
                    "type": "datetime",
                    "unique": false,
                    "notnull": false,
                    "length": 512,
                    "label": "Создано",
                    "comment": null,
                    "default": "now"
                }
            },
            "singular": "Классификатор-пример",
            "ref_name": "name",
            "plural": "Классификаторы-пример",
            "type": "treeConf"
            
        };
    }

    function createTableCols (){
  
        const dataContent   = STORAGE.fields.content;
        const data          = dataContent[idsParam];
        const dataFields    = data.fields;
        const colsName      = Object.keys(data.fields);
        const columnsData   = [];
        const table         = $$(idCurrTable);
 
        let fieldType;
     
        function refreshCols(columnsData){
            if(table){
                table.refreshColumns(columnsData);
            }
        }


        const sumWidth = [];
        function setColsUserSize(storageData){
          
            storageData.values.forEach(function (el,i){
                sumWidth.push(el.width);
                table.setColumnWidth(el.column, el.width);
            });   
        }

        function getUserPrefs(){
   
            const storageData = webix.storage.local.get("visibleColsPrefs_"+idsParam);
            const allCols     = table.getColumns(true);

            if ( storageData && storageData.values.length ){
                setColsUserSize(storageData);  
            }

            function setColsSize(col){
                let countCols;
                let containerWidth;
          
                if(storageData && storageData.values.length){
                    countCols  = storageData.values.length;
                } else {
                    const cols = table.getColumns(true);
                    countCols  = cols .length;
                }

                containerWidth = window.innerWidth - $$("tree").$width - 25;

                const tableWidth = containerWidth - 17;
                const colWidth   = tableWidth / countCols;

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

            function setWidthLastCol(){
                const containerWidth = window.innerWidth - $$("tree").$width - 77; 
                const reduce = sumWidth.reduce((a, b) => +a + +b, 0);

                if (reduce < containerWidth){
                    const cols       = table.getColumns();
                    const lastCol    = cols[cols.length-1];
                    const difference = containerWidth - reduce;
                    const oldWidth   = lastCol.width;
                    const newWidth   = oldWidth + difference;
       
                    table.setColumnWidth(lastCol.id, newWidth);
                    
                }

            }

            function setVisibleCols(){
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
           
            if( storageData && storageData.values.length ){
                setVisibleCols();
                setPositionCols();
                setWidthLastCol();

            } else {   
             
                allCols.forEach(function(el,i){
                    setColsSize(el.id);  
                });
               
            }
    
            
        }

        try{
            colsName.forEach(function(data) {
                fieldType = dataFields[data].type;

                function createReferenceCol (){
                    try{
                        const findTableId           = fieldType.slice(10);
                        dataFields[data].editor     = "combo";
                        dataFields[data].collection = getComboOptions (findTableId);
                        dataFields[data].template   = function(obj, common, val, config){
                            const item = config.collection.getItem(obj[config.id]);
                            return item ? item.value : "";
                        };
                    }catch (err){
                        errors_setFunctionError(err, getInfoTable_logNameFile, "createTableCols => createReferenceCol")
                    }
                }

                function createDatetimeCol  (){
                    try{
                        dataFields[data].format = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
                        dataFields[data].editor = "date";
                        dataFields[data].css    = {"text-align":"right"};
                    }catch (err){
                        errors_setFunctionError(err, getInfoTable_logNameFile, "createTableCols => createDatetimeCol")
                    }
                }
                
                function createTextCol      (){
                    try{
           
                        dataFields[data].editor = "text";
                        dataFields[data].sort   = "string";
                    }catch (err){
                        errors_setFunctionError(err,getInfoTable_logNameFile,"createTableCols => createTextCol")
                    }
                }

              
                function createIntegerCol   (){
                    try{
                        dataFields[data].editor         = "text";
                        dataFields[data].sort           = "int";
                        dataFields[data].numberFormat   = "1 111";
                        dataFields[data].css            = {"text-align":"right"};
                        
                    }catch (err){
                        errors_setFunctionError(err,getInfoTable_logNameFile,"createTableCols => createIntegerCol");
                    }
                }
                function createBoolCol      (){
                    try{
                        dataFields[data].editor     = "combo";
                        dataFields[data].sort       = "text";
                        dataFields[data].collection = [
                            {id : 1, value : "Да" },
                            {id : 2, value : "Нет"}
                        ];
                    }catch (err){
                        errors_setFunctionError(err,getInfoTable_logNameFile,"createTableCols => createBoolCol");
                    }
                }

                if (fieldType.includes("reference")){
                    createReferenceCol();
                } else if ( fieldType == "datetime"){
                    createDatetimeCol ();
                } else if ( fieldType == "boolean"){
                    createBoolCol     ();
                } else if ( fieldType == "integer" || fieldType == "id"){
                    createIntegerCol  ();
                } else {
                    createTextCol     ();
                }


                function setIdCol       (){
                    dataFields[data].id         = data;
                }

                function setFillCOl     (){
             
                    const length     = Object.values(dataFields).length;
                    const tableWidth = $$("tableContainer").$width-17;
                    const colWidth   = tableWidth/length;
               
                    dataFields[data].width  = colWidth;
                }

                function setHeaderCol   (){
                    dataFields[data].header     = dataFields[data]["label"];
              
                }

                function userPrefsId    (){
                    const setting = webix.storage.local.get("userprefsOtherForm");

                    if( setting && setting.visibleIdOpt == "2" ){
                        dataFields[data].hidden = true;
                    }
                }  

           


                function pushColsData(){ 
               
                    try{        
                        if (dataFields[data].label){
                            columnsData.push(dataFields[data]);
                        }
        
                    } catch (err){
                        errors_setFunctionError(err,getInfoTable_logNameFile,"createTableCols => pushColsData");
                    }
             
                }

            
                setIdCol    ();
                setFillCOl  ();
                setHeaderCol();

                if(dataFields[data].id == "id"){
                    userPrefsId();
                }
               
                pushColsData();
        
            });


            refreshCols(columnsData);

            getUserPrefs();

 
        } catch (err){
            errors_setFunctionError(err,getInfoTable_logNameFile,"createTableCols");
        }


        return columnsData;
    }

    function createDetailAction (columnsData){
        let idCol;
        let actionKey;
        let checkAction     = false;

        const dataContent   = STORAGE.fields.content;
        const data          = dataContent[idsParam];
        const table         = $$(idCurrTable);

        columnsData.forEach(function(field,i){
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
                columns.splice(0,0,{ 
                    id      :"action-first"+idCol, 
                    maxWidth:130, 
                    src     :urlFieldAction, 
                    css     :"action-column",
                    label   :"Подробнее",
                    header  :"Подробнее", 
                    template:"<span class='webix_icon wxi-angle-down'></span> "
                });

                table.refreshColumns();
            }
        }
    

    }
    

    function createDynamicElems (){
        const dataContent       = STORAGE.fields.content;
        const data              = dataContent[idsParam];  
        const dataInputsArray   = data.inputs;

        function setAdaptiveWidth(elem){
            const child       = elem.getNode().firstElementChild;
            child.style.width = elem.$width+"px";

            const inp         = elem.getInputNode();
            inp.style.width   = elem.$width-5+"px";
        }
      
        function generateCustomInputs (){  
            const customInputs  = [];
            const objInuts      = Object.keys(data.inputs);

            function createTextInput    (el,i){
                return {   
                    view            : "text",
                    placeholder     : dataInputsArray[el].label, 
                    id              : "customInputs"+i,
                    height          : 48,
                    labelPosition   : "top",
                    on              : {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                            setAdaptiveWidth(this);
                        },
                        onChange:function(){
                            const inputs = $$("customInputs").getChildViews();

                            inputs.forEach(function(el,i){
                                const view = el.config.view;
                                const btn  = $$(el.config.id);

                                if (view == "button" && !( btn.isEnabled() )){
                                    btn.enable();
                                }
                            });
    
                        }
                    }
                }
            }
    
            function getOptionData      (dataInputsArray,el){
                const url = "/init/default/api/" + dataInputsArray[el].apiname;

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
                                    if ( dataSrc[0].name !== undefined ){
                                        
                                        dataSrc.forEach(function(data, i) {
                                            optionElement = dataTemplate(i,data.name);
                                            dataOptions.push(optionElement);
                                        });
                                    
                                    } else {
                                        dataSrc.forEach(function (data, i) {
                                            optionElement = dataTemplate(i,data);
                                            dataOptions.push(optionElement);
                                        });
    
                                    }
                            
                                } catch (err){
                                    errors_setFunctionError(err,getInfoTable_logNameFile,"generateCustomInputs => getOptionData")
                                } 
                            }

                            createOptions();

                            return dataOptions;

                        }).catch(err => {
                            console.log(err);
                            setAjaxError(err,getInfoTable_logNameFile,"generateCustomInputs => getOptionData");
                            
                        }));
                        
                    
                        
                    }
                }});
            }
    
            function createSelectInput  (el,i){
            
                return   {   
                    view          : "combo",
                    height        : 48,
                    id            : "customCombo"+i,
                    placeholder   : dataInputsArray[el].label, 
                    labelPosition : "top", 
                    options       : {
                        data : getOptionData ( dataInputsArray, el )
                    },
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute( "title", dataInputsArray[el].comment );
                            setAdaptiveWidth(this);
                        },
                    }               
                };
            }
    
            function createDeleteAction (i){
                const table     = $$(idCurrTable);
                const countCols = table.getColumns().length;
                const columns   = table.config.columns;
   
                try{
                    columns.splice (countCols, 0 ,{ 
                        id      : "action"+i, 
                        header  : "Действие",
                        label   : "Действие",
                        css     : "action-column",
                        maxWidth: 100, 
                        template: "{common.trashIcon()}"
                    });
        
                    table.refreshColumns();

                } catch (err){
                    errors_setFunctionError(err,getInfoTable_logNameFile,"generateCustomInputs => createDeleteAction")
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
                    errors_setFunctionError(err,getInfoTable_logNameFile,"generateCustomInputs => getInputsId");
                } 
                return idElements;
            }
    
            function createDeleteBtn    (el,findAction,i){
                return {   
                    view        : "button", 
                    id          : "customBtnDel"+i,
                    css         : "webix_danger", 
                    type        : "icon", 
                //    disabled    : true,
                    icon        : "icon-trash",
                    inputWidth  : 55,
                    inputHeight : 35,
                    value       : dataInputsArray[el].label,
                    click       : function (id) {
                        const idElements = getInputsId (this);
                        submitBtn( idElements, findAction.url, "delete" );
                    },
                    on          : {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute( "title", dataInputsArray[el].comment );
                        },
                    },
                };
            }
    
            function createCustomBtn    (el,findAction,i){
                return {   
                    view        : "button", 
                    css         : "webix_primary", 
                    id          : "customBtn"+i,
                    height      : 42,
                    value       : dataInputsArray[el].label,
                    click       : function (id) {
                        const idElements = getInputsId (this);
                        const btn        =  $$("contextActionsPopup");

                        if (findAction.verb== "GET"){
                            if ( findAction.rtype == "refresh") {
                                submitBtn( idElements, findAction.url, "get", "refresh" );
                            } else if (findAction.rtype == "download") {
                                submitBtn( idElements, findAction.url, "get", "download");
                            }
                            
                        } else if ( findAction.verb == "POST" ){
                            submitBtn( idElements, findAction.url, "post" );
                            $$("customBtn" + i ).disable();
                        } 
                        else if (findAction.verb == "download"){
                            submitBtn( idElements, findAction.url, "get", "download", id );
                        }
                            
                        if (btn){
                            btn.hide();
                        }
                    
                    },
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute( "title", dataInputsArray[el].comment );
                            setAdaptiveWidth(this);
                        },
                    },
                };
            }
    
            function createUpload       (el,i){
                return  {   
                    view         : "uploader", 
                    value        : "Upload file", 
                    id           : "customUploader"+i,
                    height       : 48,
                    autosend     : false,
                    upload       : data.actions.submit.url,
                    label        : dataInputsArray[el].label, 
                    labelPosition: "top",
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute( "title", dataInputsArray[el].comment );
                            setAdaptiveWidth(this);
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

                            childs.forEach(function(el,i){
                                if (el.config.id.includes("customBtn")){
                                    el.enable();
                                }
                            });
                        }

                    }
                };
            }
    
            function createDatepicker   (el,i){
                return {   
                    view         : "datepicker",
                    format       : "%d.%m.%Y %H:%i:%s",
                    placeholder  :dataInputsArray[el].label,  
                    id           :"customDatepicker"+i, 
                    timepicker   : true,
                    labelPosition:"top",
                    height       :48,
                    on           : {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute( "title", dataInputsArray[el].comment );
                            setAdaptiveWidth(this);
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
                                errors_setFunctionError(err,getInfoTable_logNameFile,"generateCustomInputs => createDatepicker onChange");
                            } 
    
                        }
                    }
                };
            }
            
            function createCheckbox     (el,i){
                return {   
                    view       : "checkbox", 
                    id         : "customСheckbox"+i, 
                    css        : "webix_checkbox-style",
                    labelRight : dataInputsArray[el].label, 
                    on         : {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
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
                                errors_setFunctionError(err,getInfoTable_logNameFile,"generateCustomInputs => createCheckbox onChange");
                            } 
                        }
                    }
                };
            }


            objInuts.forEach((el,i) => {

                if ( dataInputsArray[el].type == "string" ){
                    customInputs.push(
                        createTextInput(el,i)
                    );
                } else if ( dataInputsArray[el].type == "apiselect" ) {
                   
                    customInputs.push(
                        createSelectInput(el,i)
                    );

                } else if ( dataInputsArray[el].type == "submit" || 
                            dataInputsArray[el].type == "button" ){

                    const actionType = dataInputsArray[el].action;
                    const findAction = data.actions[actionType];
                
                    if ( findAction.verb == "DELETE" && actionType !== "submit" ){
                        createDeleteAction (i);
                    } else if ( findAction.verb == "DELETE" ) {
                        customInputs.push(
                            createDeleteBtn(el, findAction,i)
                        );
                    } else {
                        customInputs.push(
                            createCustomBtn(el, findAction,i)
                                
                        );
                    }
                } else if ( dataInputsArray[el].type == "upload" ){
                    customInputs.push(
                        createUpload(el,i)
                    );
                } else if ( dataInputsArray[el].type == "datetime" ){
                    customInputs.push(
                        createDatepicker(el,i)
                    );
                }else if ( dataInputsArray[el].type == "checkbox" ){
                    customInputs.push(
                        createCheckbox(el,i)
                    );

                } 
            });
     

            return customInputs;
        }

        function adaptiveCustomInputs (){

            function maxInputsSize (customInputs){
      
                const inpObj = {
                    id      : "customInputs",
                    css     : "webix_custom-inp", 
                    rows    : [
                        { height : 20 },
                        { rows   : customInputs }
                    ],
                };

           
                function addInputs(){
                   
                    try{
                        $$("viewToolsContainer").addView( inpObj,0 );
                  
                    } catch (err){
                        errors_setFunctionError(err,getInfoTable_logNameFile,"adaptiveCustomInputs => addInputs");
                    } 
                }
                addInputs();

            }

            function removeContextBtn(){
                try{
                    const btn = $$("contextActionsBtn");
                    if (btn){
                        $$(filterBar.config.id).removeView(btn);
                    }
                } catch (err){
                    errors_setFunctionError(err,getInfoTable_logNameFile,"adaptiveCustomInputs => removeContextBtn");
                } 
            }
            removeContextBtn();

           const tools = $$("formsTools");
           
            function viewToolsBtnClick(){
                const btnClass          = document.querySelector(".webix_btn-filter");
                const primaryBtnClass   = "webix-transparent-btn--primary";
                const secondaryBtnClass = "webix-transparent-btn";
                const formResizer       = $$("formsTools-resizer");
                const formsTools        = $$("viewTools");
                
                function toolMinAdaptive(){
                    hideElem($$("formsContainer"));
                    hideElem($$("tree"));
                    showElem($$("table-backFormsBtnFilter"));
                    hideElem(formResizer);
                    tools.config.width = window.innerWidth-45;
                    tools.resize();
                }
            

                function toolMaxAdaptive(){
                  
                    if         (btnClass.classList.contains(primaryBtnClass)){

                        btnClass.classList.add(secondaryBtnClass);
                        btnClass.classList.remove(primaryBtnClass);
                        hideElem(tools);
                        hideElem(formResizer);
                        

                    } else if (btnClass.classList.contains(secondaryBtnClass)){

                        btnClass.classList.add(primaryBtnClass);
                        btnClass.classList.remove(secondaryBtnClass);
                        showElem(tools);
                        showElem(formResizer);
                        showElem(formsTools);
                    }
                }
      
                hideElem($$("propTableView"));
                const contaierWidth = $$("formsContainer").$width;
         
                toolMaxAdaptive();
                if(!(btnClass.classList.contains(secondaryBtnClass))){
                    if (contaierWidth < 850  ){
                        hideElem($$("tree"));
                        if (contaierWidth  < 850 ){
                            toolMinAdaptive();
                        }
                    } else {
                    hideElem($$("table-backFormsBtnFilter"));
                    tools.config.width = 350;
                    tools.resize();
                    }
                    showElem(formResizer);
                } else {
                    hideElem(tools);
                    hideElem(formResizer);
                    hideElem($$("table-backFormsBtnFilter"));
                    showElem($$("formsContainer"));
                }

            }

            const viewToolsBtn  = $$("viewToolsBtn");
            if (data.inputs){  
           
                const customInputs  = generateCustomInputs ();
                const filterBar     = $$("table-view-filterId").getParentView();

                const btnTools = {   
                    view    : "button",
                    width   : 50, 
                    type    : "icon",
                    id      : "viewToolsBtn",
                    icon    : "icon-filter",
                    css     : "webix_btn-filter webix-transparent-btn",
                    title   : "текст",
                    height  : 42,
                    click   : function(){
                        viewToolsBtnClick();
                    },
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title","Показать/скрыть доступные дейсвтия");
                        }
                    } 
                };
                
                if( !viewToolsBtn ){
                    filterBar.addView( btnTools, 2 );
                } else {
                    showElem( viewToolsBtn );
                }

                maxInputsSize ( customInputs );

            } else {
              
                hideElem( tools );
                hideElem( viewToolsBtn );
              
            }
        }
        
        adaptiveCustomInputs ();

    }


    async function generateTable (){ // SINGLE ELS

        if (!STORAGE.fields){
            await getData("fields"); 
       
        }

        if (STORAGE.fields){
            createExperementalElement ();
            const columnsData = createTableCols ();

            createDetailAction (columnsData);
            createDynamicElems ();
          
            createTableRows (idCurrTable,idsParam);
           
        }
    } 

    getValsTable ();
   
    if (titem == undefined) {
        setLogValue("error","Данные не найдены");
    } else {
        preparationTable ();
        generateTable ();
    } 

}


;// CONCATENATED MODULE: ./src/js/components/table/lazyLoad.js


const lazyLoad_limitLoad   = 80;

function sortTable(table){
    table.attachEvent("onAfterSort", function(id,sortType,colType){
        const sortInfo = {
            idCol : id,
            type  : sortType
        };
        table.config.sort = sortInfo;
    });
}

function scrollTableLoad(table){
    table.attachEvent("onScrollY", function(){
        const table        = this;
        const scrollState  = table.getScrollState();
        const maxHeight    = table._dtable_height;
        const offsetHeight = table._dtable_offset_height;
    
    
    
        if (maxHeight - scrollState.y == offsetHeight){ 
    
            const tableId           = table.config.idTable;
            const oldOffset         = table.config.offsetAttr;
    
            const newOffset         = oldOffset + lazyLoad_limitLoad;
    
            table.config.offsetAttr = newOffset;
            table.refresh();
    
            createTableRows ("table",tableId, oldOffset);
        }
         
    });
}



;// CONCATENATED MODULE: ./src/js/blocks/columnsSettings/common.js






function destructPopup(){
    try{
        const popup = $$("popupVisibleCols");
        if (popup){
            popup.destructor();
        }
    } catch (err){
        errors_setFunctionError(err,"visibleColumns","destructPopup");
    }
}

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
            errors_setFunctionError(err,"visibleColumns","setUpdateCols => setVisibleState");
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

function getTable(){
    const tableTempl     = $$("table");
    const tableTemplView = $$("table-view");
    let table;

    if ( tableTempl.isVisible() ){
        table = tableTempl;
    } else if ( tableTemplView.isVisible() ){
        table = tableTemplView;
    }

    return table;
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
function postPrefsValues(values, visCol=false){
   
    const id            = getItemId();
    const sentVals      = {
        values       : values, 
        tableIdPrefs : id
    };

    const sentObj = {
        name:"visibleColsPrefs_"+id,
        prefs:sentVals,
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
            setAjaxError(err, "visibleColumns","saveExistsTemplate => putUserprefsData");
        });

        destructPopup();
    } 

    function saveNewTemplate(){
        const ownerId = webix.storage.local.get("user").id;
        const url     = "/init/default/api/userprefs/";
        
        if (ownerId){
            sentObj.owner = ownerId;
        }

        const userprefsPost = webix.ajax().post(url,sentObj);
        
        userprefsPost.then(function(data){
            data = data.json();
 
            if (data.err_type !== "i"){
                errors_setFunctionError(data.err,"visibleColumns","saveNewTemplate")
            } else {
                setLogValue   ("success","Рабочая область таблицы обновлена");
                setStorageData("visibleColsPrefs_"+id, JSON.stringify(sentObj.prefs));
                setUpdateCols (sentVals);
            }
        });

        userprefsPost.fail(function(err){
            setAjaxError(err, "visibleColumns","saveTemplate");
        });

        destructPopup();
    }

    function getUserprefsData(){
      
        const getData = webix.ajax().get("/init/default/api/userprefs");
        let settingExists = false;
        let idPutData;
    
        getData.then(function(data){
            data = data.json().content;
            try{
                data.forEach(function(el){
                    
                    if (el.name == "visibleColsPrefs_"+id && !settingExists){
                        idPutData = el.id
                        settingExists = true;
                
                    }
                });
            } catch (err){
                errors_setFunctionError(err,"visibleColumns","getUserprefsData getData");
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
            setAjaxError(err, "toolbarTable","getUserprefsData");
        });

        return settingExists;

    }
    getUserprefsData();

}



;// CONCATENATED MODULE: ./src/js/blocks/columnsSettings/columnsWidth.js


function setColsWidthStorage(table){
    table.attachEvent("onColumnResize",function(id,newWidth, oldWidth, action){
        if (action){
           
            const cols   = table.getColumns();
            const values = [];

            cols.forEach(function(el,i){

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


;// CONCATENATED MODULE: ./src/js/blocks/favsLink.js







function favsLink_getUserData(){
    const userprefsGetData = webix.ajax("/init/default/api/whoami");
    userprefsGetData.then(function(data){
        data = data.json().content;

        let userData = {};
    
        userData.id       = data.id;
        userData.name     = data.first_name;
        userData.username = data.username;
        
        setStorageData("user", JSON.stringify(userData));
        
    });
    userprefsGetData.fail(function(err){
        setAjaxError(err, "favsLink","btnSaveLpostContentinkClick => getUserData");
    });
}

function setAdaptiveSize(popup){
    if (window.innerWidth < 1200 ){
        const size  = window.innerWidth * 0.89;
        try{
            popup.config.width = size;
            popup.resize();
        } catch (err){
            errors_setFunctionError(err,"favsLink","function setAdaptiveSize");
        }
    }
 
}

function favsPopupCollectionClick (){
    const getData = webix.ajax().get("/init/default/api/userprefs/");
    
    getData.then(function(data){
        data = data.json().content;
        const favCollection = [];

        let user = webix.storage.local.get("user");

        if (!user){
            favsLink_getUserData();
            user = webix.storage.local.get("user");
        }
    
        
        function getFavsCollection(){
            try{
                data.forEach(function(el){
                    if (el.name.includes("fav-link") && user.id == el.owner){
                        favCollection.push(JSON.parse(el.prefs));
                    }
                });
            } catch (err){
                errors_setFunctionError(err,"favsLink","favsPopupCollectionClick => getFavsCollection");
            }
        }

        function createOptions(){
            const radio = $$("favCollectionLinks");
            try{
                if (favCollection.length){
                    favCollection.forEach(function(el){
                        radio.addOption(
                            {   id:el.id,
                                value:el.name,
                                favLink: el.link
                            }
                        );
                        radio.removeOption(
                            "radioNoneContent"
                        );
                    });
                }
                $$("popupFavsLink").show();
            } catch (err){
                errors_setFunctionError(err,"favsLink","favsPopupCollectionClick => createOptions");
            }
         
        }
        
        if (user){
            getFavsCollection();
            createOptions();
        }
   
    
    });

    getData.fail(function(err){
        setAjaxError(err, "favsLink","favsPopupCollectionClick getData");
    });

    
}

function favsPopupSubmitClick(){
    try{
        const radio  = $$("favCollectionLinks");
        const value  = radio.getValue();
        const option = radio.getOption(value);
        window.location.replace(option.favLink);
    } catch (err){
        errors_setFunctionError(err,"favsLink","favsPopupSubmitClick");
    }
}

function favsPopup(){

    const popupHeadline = {   
        template:"<div class='no-wrap-headline'>Избранное</div>", 
        css:"popup_headline", 
        borderless:true, 
        height:20 
    };

    const btnClosePopup = {
        view:"button",
        id:"buttonClosePopup",
        css:"popup_close-btn",
        type:"icon",
        width:35,
        hotkey :"esc",
        icon: 'wxi-close',
        click:function(){
            try{
                if ($$("popupFavsLink")){
                    $$("popupFavsLink").destructor();
                }
            } catch (err){
                errors_setFunctionError(err,"favsLink","favsPopup click");
            }
        
        }
    };

    const radioLinks = {
        view:"radio", 
        id:"favCollectionLinks",
        vertical:true,
        options:[
            {   id:"radioNoneContent", disabled:true, value:"Здесь будут сохранены Ваши ссылки"}
        ],
        on:{
            onChange:function(newValue, oldValue){
                try{
                    const submitBtn = $$("favLinkSubmit");
                    if (newValue !== oldValue){
                        if (submitBtn && !(submitBtn.isEnabled())){
                            submitBtn.enable();
                        }
                    }
                } catch (err){
                    errors_setFunctionError(err,"favsLink","favsPopup => radioLinks");
                }
            }
        }
    };

    const btnSaveLink = {
        view:"button",
        id:"favLinkSubmit", 
        value:"Открыть ссылку", 
        css:"webix_primary", 
        disabled:true,
        click:function(){
            favsPopupSubmitClick();
        }
 
    };
 
    webix.ui({
        view:"popup",
        id:"popupFavsLink",
        css:"webix_popup-prev-href",
        width:400,
        minHeight:300,
        escHide:true,
        modal:true,
        position:"center",
        body:{
            rows:[
            {rows: [ 
                { cols:[
                    popupHeadline,
                    {},
                    btnClosePopup,
                ]},
                radioLinks,
                {height:15},
                btnSaveLink,
            ]}]
            
        },

    });
    
    favsPopupCollectionClick ();
    setAdaptiveSize($$("popupFavsLink"));
}


function getCurrId(){
    let id;
    try{
        const tree = $$("tree");
        
        if (tree && tree.getSelectedId()){
            id = tree.getSelectedId();
        } else {
            const url = window.location.pathname;
            const index =  window.location.pathname.lastIndexOf("/")+1;
            id = url.slice(index);
        
        }
    } catch (err){
        errors_setFunctionError(err,"favsLink","getCurrId");
    }
    return id;
}

function saveFavsClick(){


    async function getLinkName(){
        
        if (!STORAGE.fields){
            await getData("fields"); 
        }

        function findName (id){
            try{
                const nameTemplate = $$("favNameLink");
                STORAGE.tableNames.forEach(function(el,i){
                    if (el.id == id){
                        if(nameTemplate){
                            nameTemplate.setValues(el.name);
                        }
                    }
                    
                });
            } catch (err){
                errors_setFunctionError(err,"favsLink","findName");
            }
        }
        if (STORAGE.tableNames){
            const id = getCurrId();
            findName (id);
        }
      
    }

    function getLink(){
        try{
            const link = window.location.href;
            const favTemplate = $$("favLink");
            if (favTemplate){
                favTemplate.setValues(link);
            }
        } catch (err){
            errors_setFunctionError(err,"favsLink","getLink");
        }
    }

    function destructPopupSave(){
        try{
            if ($$("popupFavsLinkSave")){
                $$("popupFavsLinkSave").destructor();
            }
        } catch (err){
            errors_setFunctionError(err,"favsLink","destrucPopupSave");
        }
    }
     
    function createTemplate(id, name,nonName){
        return {   
            id:id,
            css:"popup_subtitle", 
            borderless:true, 
            height:20 ,
            template: function(){
                if (Object.keys($$(id).getValues()).length !==0){
                    return "<div style='font-weight:600'>"+name+": </div>"+$$(id).getValues();
                } else {
                    return "<div style='font-weight:600'>"+name+": </div>"+name+" "+nonName;
                }
          
            }
        }
    }

    function btnSaveLinkClick(){
   
        let favNameLinkVal;
        let favLinkVal ;
        const namePref = getCurrId();
        function getData(){
            try{
                favNameLinkVal = $$("favNameLink").getValues();
                favLinkVal     = $$("favLink").getValues();
            } catch (err){
                errors_setFunctionError(err,"favsLink","btnSaveLinkClick => getData");
            }
        }


        function postContent(){
            let user = webix.storage.local.get("user");
            let ownerData;


            if (!user){
                favsLink_getUserData();
                user = webix.storage.local.get("user");
            }

            if (user){
                ownerData = user.id;

                const postObj = {
                    name:"fav-link_"+namePref,
                    owner:ownerData,
                    prefs:{
                        name: favNameLinkVal,
                        link: favLinkVal,
                        id:namePref,
                    }
                };
                const postData = webix.ajax().post("/init/default/api/userprefs/",postObj);

                postData.then(function(data){
                    data = data.json();
            
                    if (data.err_type == "i"){
                        setLogValue("success","Ссылка"+" «"+favNameLinkVal+"» "+" сохранёна в избранное");
                    } else {
                        errors_setFunctionError(data.err,"favsLink","btnSaveLinkClick => postContent msg" );
                    }

                    destructPopupSave();
                });

                postData.fail(function(err){
                    setAjaxError(err, "favsLink","btnSaveLinkClick => postContent");
                });
            }
        }


        function getUserprefs(){
            const getData = webix.ajax().get("/init/default/api/userprefs/");
            getData.then(function(data){
                data = data.json().content;
                const favPrefs = [];

                function getFavPrefs(){
                    try{
                        data.forEach(function(pref){
            
                            if (pref.name.includes("fav-link")){
                                favPrefs.push(pref.name);
                            }
                    
                        });
                    } catch (err){
                        errors_setFunctionError(err,"favsLink","getUserprefs => getFavPrefs");
                    }
                }

                function getNotUniquePrefs (){
                    try{
                        let unique = true;
                        if (favPrefs.length){
                            favPrefs.forEach(function(el){
                             
                                if (el.includes(namePref)){
                                    
                                    const index = el.indexOf("_")+1;
                                    const id = el.slice(index);
                            
                                    if (id == namePref && unique){
                                        unique = false;
                                        setLogValue("success", "Такая ссылка уже есть в избранном");
                                    } 
                                } 
                            });
                        } 
                        
                        
                        if (!(favPrefs.length) || unique) {
                            postContent();
                        } else if (!unique){
                            destructPopupSave();
                        }
                    } catch (err){
                        errors_setFunctionError(err,"favsLink","getUserprefs => getNotUniquePrefs");
                    }
                }
      
                getFavPrefs();
                getNotUniquePrefs ();
           
            });
            getData.fail(function(err){
                setAjaxError(err, "favsLink","getUserprefs getData");
            });
            }


       
        getData();
        getUserprefs();
    }
   
    const popupHeadline = {   
        template:"<div class='no-wrap-headline'>Сохранить ссылку</div>", 
        css:"popup_headline", 
        borderless:true, 
        height:20 
    };

    const btnClosePopup = {
        view:"button",
        id:"buttonClosePopup",
        css:"popup_close-btn",
        type:"icon",
        hotkey :"esc",
        width:35,
        icon: 'wxi-close',
        click:function(){
            destructPopupSave();
        
        }
    };

    
    const btnSaveLink = {
        view:"button", 
        value:"Сохранить ссылку", 
        css:"webix_primary", 
        click:function(){
            btnSaveLinkClick();
        }
 
    };



    webix.ui({
        view:"popup",
        id:"popupFavsLinkSave",
        css:"popup_padding-container",
        escHide:true,
        width:500,
        //height:300,
        modal:true,
        position:"center",
        body:{
            rows:[
            {rows: [ 
                { cols:[
                    popupHeadline,
                    {},
                    btnClosePopup,
                   
                ]},
                createTemplate("favNameLink","Имя","не указано"),
                {height:5},
                createTemplate("favLink","Ссылка","не указана"),
                {height:10},
                btnSaveLink,
                {}
                //{height:10}
            ]}]
            
        },

    }).show();

 

    getLinkName();
    getLink();

    setAdaptiveSize($$("popupFavsLinkSave"));   
   

}




;// CONCATENATED MODULE: ./src/js/blocks/historyBtns.js
function prevBtnClick (){
    history.back();
}

function nextBtnClick (){
    history.forward();
}   

function backButtonBrowserLogic (){
    window.addEventListener('popstate', function(event) {
        window.location.replace(window.location.href);
        window.location.reload();
        
    });
}


;// CONCATENATED MODULE: ./src/js/blocks/blockHeadline.js




function setHeadlineBlock ( idTemplate, title=null ){
    let templateTitle;
    try{
        if(title){
            templateTitle = title;
        } else {
            templateTitle = function(){
                const value = $$(idTemplate).getValues();
                if (Object.keys(value).length !==0){
                    return "<div class='no-wrap-headline'>" + value + "</div>";
                } else {
                    return "<div class='no-wrap-headline'> Имя не указано </div>";
                }
            };
        }
    } catch (err){
        errors_setFunctionError(err,"blockHeadline","setHeadlineBlock");
    }

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


    const favsBtn = {
        view    : "button", 
        css     : "webix-transparent-btn",
        type    : "icon",
        icon    : "icon-star",
        hotkey  : "ctrl+shift+l",
        width   : 50,
        click   : function(){
            saveFavsClick();
        },
        on      : {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Добавить ссылку в избранное (Ctrl+Shift+L)");
            },
        }
    
        
    };

    const prevBtn = {
        view    : "button", 
        css     : "webix-transparent-btn btn-history",
        type    : "icon",
        icon    : "icon-arrow-left",
        width   : 50,
        hotkey  : "ctrl+shift+p",
        click   : function(){
            prevBtnClick();
        },
        on      : {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Вернуться назад (Ctrl+Shift+P)");
            },
        }
    
        
    };
 
    const nextBtn = {
        view    : "button", 
        css     : "webix-transparent-btn btn-history",
        type    : "icon",
        icon    : "icon-arrow-right",
        width   : 50,
        hotkey  : "ctrl+shift+b",
        click   : function(){
            nextBtnClick();
        },
        on      : {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Перейти вперёд (Ctrl+Shift+B)");
            },
        }
    
        
    };
 


    const headlineLayout = {
        css : "webix_block-headline",
        cols: [
            headline,
            {},
            {   cols:[
                    prevBtn,
                    nextBtn,
                ]
            },
            favsBtn
        ]
    };

    return headlineLayout;
}


;// CONCATENATED MODULE: ./src/js/blocks/tableFilter/toolbarBtn.js






const toolbarBtn_logNameFile = "tableFilter => toolbar";


function field (operation,uniqueId,typeField,el){
 
    let findTableId;

    function getIdCombo(){
        if (el.editor && el.editor == "combo"){
            findTableId = el.type.slice(10);
        } 
    }

    function getElemId (){
        let id;
        if (el.id.includes("_filter")){
            let index = el.id.indexOf("_filter");
            id =  el.id.slice(0,index);
        } else {
            id = el.id;
        }
        return id;
    }

    function createField(){
     
        let labelType;
        if (operation == "operOr"){
            labelType = " + или";
        } else {
            labelType = " + и";
        }
        const elemId        = getElemId ();

        const fieldId       = elemId+"_filter-child-"+operation+"-"+uniqueId;
        const fieldTemplate = {
            id    : fieldId, 
            name  : fieldId,
            label : el.label,
           // label : el.label + `<span style='font-size: 12px !important; color:var(--primary)'>  ${labelType}</span>`,
            labelPosition:"top",
            on:{
                onKeyPress:function(){
                    const btn = $$("btnFilterSubmit");
                    $$("filterTableForm").clearValidation();
                    if (btn && !(btn.isEnabled())){
                        btn.enable();
                    }
                },
            }
        };

        function createText(type){
            const element       = fieldTemplate;
            element.view        = "text";

            if(type == "text"){
                element.placeholder = "Введите текст";
            } else if (type == "int"){
                element.placeholder    = "Введите число";
                element.invalidMessage = "Поле поддерживает только числовой формат";
                element.validate       = function(val){
                    return !isNaN(val*1);
                };
            }
           

            return element;
        }

        function createCombo(type){
            const element       = fieldTemplate;
            element.view        = "combo";
            element.placeholder = "Выберите вариант";
 
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
            const element       = fieldTemplate;
            element.view        = "datepicker";
            element.placeholder = "дд.мм.гг";
            element.format      = "%d.%m.%Y %H:%i:%s";
            element.timepicker  = true;
          
            return element;
        }
   
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


    getIdCombo();
    return createField();

}

function filterOperationsBtnLogic (idBtn,id){
    try {
        let btnFilterOperations = $$(idBtn);

        if        (id.includes("eql")){
            btnFilterOperations.setValue("=");
            
        } else if (id.includes("notEqual")){
            btnFilterOperations.setValue("!=");

        } else if (id.includes("less")){
            btnFilterOperations.setValue("<");

        } else if (id.includes("more")){
            btnFilterOperations.setValue(">");

        } else if (id.includes("mrEqual")){
            btnFilterOperations.setValue(">=");

        } else if (id.includes("lsEqual")){
            btnFilterOperations.setValue("<=");

        } else if (id.includes("contains")){
            btnFilterOperations.setValue("⊆");

        }
    } catch (err){
        errors_setFunctionError(err,toolbarBtn_logNameFile,"filterOperationsBtnLogic");
    }

}

function showEmptyTemplate(){
                     
    const inputs = $$("inputsFilter");
    if ( inputs.$height == 46){
        showElem($$("filterEmptyTempalte"));
    }

}


// function setLabel(firstChildInput){
//     const oldLabel = firstChildInput.config.label;
//     const index    = oldLabel.indexOf("<span");
//     const newLabel = oldLabel.slice(0,index);

//     firstChildInput.config.label = newLabel;
//     firstChildInput.refresh();
// }

function filterOperationsBtnData (typeField){
    return webix.once(function(){
        if (typeField == "combo" || typeField == "boolean" ){

            this.add( { value: '=',       id:"operations_eql"      });
            this.add( { value: '!=',      id:"operations_notEqual" });

        } else if (typeField  == "text" ){

            this.add( { value: '=',       id:"operations_eql"      });
            this.add( { value: '!=',      id:"operations_notEqual" });
            this.add( { value: 'содержит',id:"operations_contains" });

        } else if (typeField  == "date"){

            this.add( { value: '=',       id:"operations_eql"      });
            this.add( { value: '!=',      id:"operations_notEqual" });
            this.add( { value: '<',       id:"operations_less"     });
            this.add( { value: '>',       id:"operations_more"     });
            this.add( { value: '>=',      id:"operations_mrEqual"  });
            this.add( { value: '<=',      id:"operations_lsEqual"  });

        } else if (typeField  == "integer"   ){

            this.add( { value: '=',       id:"operations_eql"      });
            this.add( { value: '!=',      id:"operations_notEqual" });
            this.add( { value: '<',       id:"operations_less"     });
            this.add( { value: '>',       id:"operations_more"     });
            this.add( { value: '>=',      id:"operations_mrEqual"  });
            this.add( { value: '<=',      id:"operations_lsEqual"  });
            this.add( { value: 'содержит',id:"operations_contains" });

        }   
    });
}

function filterFieldsFunctions (el,typeField){

    const idBtnOperation = el.id+"_filter-btnFilterOperations";
    const btnOperation = {
        view:"button",
        id:idBtnOperation,
        css:"webix_primary webix_filterBtns",
        value:"=",
        inputHeight:38,
        width: 40,
        popup: {
            view: 'contextmenu',
            width: 200,
            data: [
            ],
            on: {
                onMenuItemClick(id) {
                    filterOperationsBtnLogic (idBtnOperation, id);
                },
                onAfterLoad: filterOperationsBtnData(typeField)
                
           
            }
        },
        on:{
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Выбрать условие поиска по полю");
            },
        }
    
    };


    const contextBtn = {   
        view:"button",
        id:el.id+"_contextMenuFilter",
        type:"icon",
        css:"webix_filterBtns",
        icon: 'wxi-dots',
        inputHeight : 38,
        width       : 40,
        popup: {
            view: 'contextmenu',
            css:"webix_contextmenu",
            data: [
                {   id:"add",   
                    value:"Добавить поле", 
                    icon: "icon-plus",
                    // submenu:[      
                    //     { id:"add_and", value: 'и'  },
                    //     { id:"add_or" , value: 'или'},
                    // ]
                    },
                {id:"remove", value:"Удалить поле", icon: "icon-trash"}
            ],
            on:{
                onMenuItemClick:function(id, e, node){
         
                    function popupSuccess(idBtnDel){

        
                        const container          = idBtnDel          .getParentView();
                    
                        const parentContainer    = container         .getParentView();
                        const mainInput          = parentContainer   .getChildViews();

                        const allInputsContainer = parentContainer   .getParentView();
                        const allInputs          = allInputsContainer.getChildViews();
              
             
                        function hideMainInput(){
                            try{
                                mainInput.forEach(function(el){
                                    const id = el.config.id;
   
                                    hideElem(el);
                                    
                                    if ( !(id.includes( "_container-btns" )) ){
                                        el.setValue("");
                                        hideElem($$(id+"_segmentBtn"));
                                    } 
                                });
                            }catch(err){ 
                                errors_setFunctionError(err,toolbarBtn_logNameFile,"contextBtn remove => hideMainInput");
                            }
                        }


                        function setFirstChildAttr(){
                      
                            const firstContainer  = allInputsContainer.getParentView();
                     
                            const firstChildContainer = firstContainer.getChildViews()[1];
                            const segmentBtn = firstChildContainer.getChildViews()[0]._collection[0];
                            
                            firstChildContainer.config.firstAttr = true;
    
                            hideElem($$(segmentBtn.id))

                        }

          
                        hideMainInput();
                        showEmptyTemplate();
                        setFirstChildAttr();
                        setLogValue("success","Поле удалено"); 
                     
                    }

                    if ( id == "add" ){
                        createChildFields (id,el);
                        
                    } else if (id.includes("remove")){
                        const idBtnDel = $$(this.config.master);

                        popupExec("Поле фильтра будет удалено").then(
                            function(){
                                popupSuccess(idBtnDel);
                                
                            }
                        );
                    }

                },
             
            }
        },

        on:{
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Другие операции");
            },
        }
  
    };

    const btns = {
        id:el.id+"_filter_container-btns",
        css:{"margin-top":"27px!important"},
        hidden:true, 
        cols:[
            btnOperation,
            contextBtn
        ]
    };

    return btns;       
}


function onMenuItemClickContextChild(id,el,thisElem){
    const contextBtn     = $$(thisElem.config.master);
    const btnContainer   = contextBtn.getParentView     ();
    const inputContainer = btnContainer.getParentView   ();
    const childContainer = inputContainer.getParentView ();
    const child          = childContainer.getParentView ();
    const container      = $$(el.id+"_filter_rows");

    function popupSuccess(){

        if (child.config.firstAttr){
    
   
            const firstChild = container.getChildViews()[2];
            const btnSegment = firstChild.getChildViews()[0]._cells[0];
            hideElem($$(btnSegment.config.id));
            firstChild.config.firstAttr = true;

        }

        const parent = child.getParentView();
        parent.removeView(child);
        showEmptyTemplate();
        setLogValue("success","Поле удалено"); 

    }

    if ( id == "add" ){
        const currView       = childContainer.getParentView();
        const currChildId    = currView.config.id;
        const allInputs      = container.getChildViews();

        let childPosition    = 0;
   
 
        allInputs.forEach(function(inp,i){
            const inputId     = inp.config.id;
            if ( inputId == currChildId ){
     
                childPosition = i+1;
            }
        
        });

  

        createChildFields (id,el,childPosition);

    } else if (id.includes("remove")){

        popupExec("Поле фильтра будет удалено").then(
            function(res){
  
                if(res){
                    popupSuccess();
                }
          
                
            }
        );
    }
}


function createChildFields (id,el,position) {
 
    const elemId        = el.id;
    const containerRows = $$(elemId+"_filter"+"_rows");
    const uniqueId   = webix.uid();
 
    if (position == undefined){
        position = 1;
    }

    let typeField;
    function getTypeField(){
        if (el.type !== "boolean"){
            typeField     = el.editor;
        } else {
            typeField     = "boolean";
        }
    }
    getTypeField();

    function returnButtonOperation(btnsId){
        
        const idBtnOperation = btnsId+"-btnFilterOperations";
        
        return {
            view:"button",
            id:idBtnOperation,
            css:"webix_primary webix_filterBtns",
            value:"=",
            inputHeight:38,
            width: 40,
            popup: {
                view: 'contextmenu',
                width: 200,
                data: [],
                on: {
                    onMenuItemClick(id) {
                        filterOperationsBtnLogic (idBtnOperation, id);
                    },
                    onAfterLoad: filterOperationsBtnData(typeField)
                   
                }
            },
            on:{
                onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Выбрать условие поиска по полю");
                },
            }
        
        };
    }

    function returnContextButton(btnsId){
        const idContextMenu = btnsId+"_contextMenuFilter";
        return {   
            view:"button",
            id:idContextMenu,
            type:"icon",
            css:"webix_filterBtns",
            icon: 'wxi-dots',
            inputHeight : 38,
            width       : 40,
            popup: {
                view: 'contextmenu',
                css:"webix_contextmenu",
                data: [
                    {   id:"add",   
                        value:"Добавить поле", 
                        icon: "icon-plus",
                        // submenu:[      
                        //     { id:"add_and", value: 'и'  },
                        //     { id:"add_or" , value: 'или'},
                        // ]
                        },
                    {id:"remove", value:"Удалить поле", icon: "icon-trash"}
                ],
                on:{
                    onMenuItemClick:function(id, e, node){
    
                        onMenuItemClickContextChild(id,el,this);
                    },
                 
                }
            },
    
            on:{
                onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Другие операции");
                },
            }
      
        }
    }

    function returnLogicBtn(btnsId){
        return {
            view    : "segmented", 
            id      : btnsId+"_segmentBtn",
            value   : 1, 
            options : [
                { "id":"1", "value":"и" }, 
                { "id":"2", "value":"или" }, 
            ]
        };
    }

    function createBtns(btnsId){
        return {
            id:elemId+"_filter_container-btns"+uniqueId,
            css:{"margin-top":"22px!important"},
            cols:[
                returnButtonOperation(btnsId),
                returnContextButton  (btnsId)
            ]
        };
    }


    function addInput(operation){
        let operationsIdPart;

        if (operation == "operAnd"){
            operationsIdPart = "-operAnd-";
        } else {
            operationsIdPart = "-operOr-";
        }

        const idContainer = elemId + "_filter-container-child" + operationsIdPart + uniqueId;
        const btnsId      = elemId + "_filter-child"           + operationsIdPart + uniqueId;

        containerRows.addView(
            {   id:idContainer,
                padding:5,
                positionElem:position,
                rows:[
                    {   id:webix.uid(),
                        rows:[
                            returnLogicBtn(btnsId),
                            {cols:[
                                field ( operation,
                                        uniqueId,
                                        typeField,
                                        el
                                ),
                                createBtns(btnsId)
                            ]},
                           
                        ]
                    }
            ]},position
        );

    }
    addInput("operAnd");
    // if(id.includes("and")){
    //     addInput("operAnd");
        
    // } else if(id.includes("or")){
    //     addInput("operOr");
    // }
 
}

function createFilterElements (parentElement, viewPosition=1) {
    const childs       = $$(parentElement).elements;
    const childsLength = Object.keys(childs).length;


    function enableDelBtn(){
        const delBtn = $$("table-delBtnId");
        try{
            if(parentElement=="table-editForm" && delBtn ){
                delBtn.enable();
            }
        } catch (err){ 
            errors_setFunctionError(err,toolbarBtn_logNameFile,"createFilterElements => enableDelBtn");
        }
    }

    function generateElements(){
        const columnsData = $$("table").getColumns(true);
        let inputsArray   = [];
        try{
            columnsData.forEach((el,i) => {
                const inputTemplate = { 
                    id:el.id+"_filter",
                    name:el.id+"_filter", 
                    hidden:true,
                    label:el.label, 
                    labelPosition:"top",
                    on:{
                        onItemClick:function(){
                            $$(parentElement).clearValidation();
                            $$("btnFilterSubmit").enable();
                        }
                    }
                };

                const logicBtn = {
                    view    : "segmented", 
                    id      : el.id + "_filter_segmentBtn",
                    hidden  : true,
                    value   : 1, 
                    options : [
                        { "id":"1", "value":"и" }, 
                        { "id":"2", "value":"или" }, 
                    ]
                };

                const idContainerRows = el.id+"_filter"+"_rows";
                const idContainer     = el.id+"_container";
                const cssContainer    = el.id+" webix_filter-inputs";
     
                function pushData (element, btns){
                    const data  =  {   
                        id:idContainerRows,
                        css:cssContainer,
                        rows:[
                            {   id:idContainer,
                                padding:5,
                                rows:[
                                    logicBtn,
                                    { cols:[
                                        element,
                                        btns,
                                    ]},
                                   
                                ]
                            }
                        ]
                    };

                    return data;
                }
        
        
                function createDatepicker(){
                    const elem       = inputTemplate;
                    elem.view        = "datepicker";
                    elem.format      = "%d.%m.%Y %H:%i:%s";
                    elem.placeholder = "дд.мм.гг";
                    elem.timepicker  = true;
                    return elem;
                }

                function createCombo(findTableId){
                    const elem       = inputTemplate;
                    elem.view        = "combo";
                    elem.placeholder = "Выберите вариант";
                    elem.options     = {
                        data:getComboOptions(findTableId)
                    };
                    return elem;
                }

                function createBoolCombo (){
                    const elem       = inputTemplate;
                    elem.view        = "combo";
                    elem.placeholder = "Выберите вариант";
                    elem.options     = [
                        {id:1, value: "Да"},
                        {id:2, value: "Нет"}
                    ];
                    return elem;
                }

                function createText (type){
        
                    const elem = inputTemplate;
                    elem.view  = "text";
                    elem.css   = {"passing-bottom":"5px!important"};

                    if        (type == "text"){
                        elem.placeholder = "Введите текст";

                    } else if (type == "int"){
                        elem.placeholder     = "Введите число";
                        elem.invalidMessage  = "Поле поддерживает только числовой формат";
                        elem.validate        = function (val) {
                            return !isNaN(val*1);
                        };
                    }
                    
                    return elem;
                }

                if (el.type == "datetime"){
                    inputsArray.push(
                        pushData ( 
                            createDatepicker (),  
                            filterFieldsFunctions (el,"date")
                        )
                    );
                } 
                else if (el.type.includes("reference")) {
                    let findTableId = el.type.slice(10);

                    inputsArray.push(
                        pushData ( 
                            createCombo(findTableId),
                            filterFieldsFunctions (el,"combo")
                        )
                    );
                    
                } 
                else if (el.type.includes("boolean")) {
                    inputsArray.push(
                        pushData ( 
                            createBoolCombo(),
                            filterFieldsFunctions (el,"combo")
                        )
                    );
                
                } 
                else if (el.type.includes("integer")) {
                    inputsArray.push(
                        pushData ( 
                            createText ("int"),
                            filterFieldsFunctions (el,"integer"),
                         
                        )
                    );
                }
                else{

                    inputsArray.push(
                        pushData ( 
                            createText ("text"),
                            filterFieldsFunctions (el,"text"),
                   
                        )
                    );
                }

            });
        } catch (err){ 
            errors_setFunctionError(err,toolbarBtn_logNameFile,"createFilterElements => generateElements");
        }


        const inpObj = {
            margin:8,
            id:"inputsFilter",
            css:"webix_inputs-table-filter", 
            rows:inputsArray
        };

        function addInputs(){
            try{
                if($$(parentElement)){
                    $$(parentElement).addView(inpObj, viewPosition);
                }
            } catch (err){ 
                errors_setFunctionError(err,toolbarBtn_logNameFile,"createFilterElements => addInputs");
            }
        }

        enableDelBtn();
        addInputs();

    }

    function showElements(){
        function setFormState(){
            try{
                if($$(parentElement)){
                    $$(parentElement).clear();
                    $$(parentElement).clearValidation();
                }
            } catch (err){ 
                errors_setFunctionError(err,toolbarBtn_logNameFile,"createFilterElements => setFormState");
            }
        }
        setFormState();
        enableDelBtn();
        showElem($$("inputsFilter"));
    }
    
    if(childsLength == 0 ){
        generateElements();

    } else {
        showElements();
    }
    
}

function filterBtnClick (idTable){
    const filter = $$("filterTableForm");

    function resizeContainer(width){
        const filterContainer = $$("filterTableBarContainer");
  
        filterContainer.config.width = width;
        filterContainer.resize();
    }
    function filterMinAdaptive(){

        hideElem($$("tableContainer"));
        hideElem($$("tree"));
        showElem($$("table-backTableBtnFilter"));
        resizeContainer(window.innerWidth-45);
      

    }

    function filterMaxAdaptive(){

        function clearTableSelection(){
            $$(idTable).clearSelection();
        }

        function toolbarBtnLogic(){
            const btnClass = document.querySelector(".webix_btn-filter");
            const primaryBtnClass = "webix-transparent-btn--primary";
            const secondaryBtnClass = "webix-transparent-btn";

            function setPrimaryBtnState(){
                try{
                    btnClass.classList.add(primaryBtnClass);
                    btnClass.classList.remove(secondaryBtnClass);
                } catch (err) {
                    errors_setFunctionError(err,toolbarBtn_logNameFile,"filterMaxAdaptive => setPrimaryBtnState");
                }
            }

            function setSecondaryBtnState(){   
                try{   
                    btnClass.classList.add(secondaryBtnClass);
                    btnClass.classList.remove(primaryBtnClass);
                } catch (err) {
                    errors_setFunctionError(err,toolbarBtn_logNameFile,"filterMaxAdaptive => setSecondaryBtnState");
                }
            }

            if(!(btnClass.classList.contains(primaryBtnClass))){
 
                hideElem($$("table-editForm"));
                showElem(filter);
                if(filter.getChildViews() !== 0){
                    createFilterElements("filterTableForm",3);
                }

                setPrimaryBtnState();
                showElem($$("filterTableBarContainer"));
            } else {
                setSecondaryBtnState();
                hideElem($$("filterTableForm"));
                hideElem($$("filterTableBarContainer"));

            }
        }     
    
        clearTableSelection();
        toolbarBtnLogic();
        resizeContainer(350);
    }

    
    filterMaxAdaptive();
    
    if ($$("container").$width < 850){
        hideElem($$("tree"));
        if ($$("container").$width  < 850 ){
            filterMinAdaptive();
        }
    } else {
        hideElem($$("table-backTableBtnFilter"));
        filter.config.width = 350;
        filter.resize();
    }
}


function toolbarFilterBtn(idTable,visible){
    let idBtnEdit = idTable + "-editTableBtnId",
        idFilter  = idTable + "-filterId"
    ;

    const btn = 
    {   view    : "button",
        width   : 50, 
        type    : "icon",
        id      : idFilter,
        hidden  : visible,
        icon    : "icon-filter",
        css     : "webix_btn-filter webix-transparent-btn ",
        disabled: true,
        title   : "текст",
        hotkey  : "ctrl+shift+f",
        height  : 42,
        click   : function(){
            filterBtnClick(idTable,idBtnEdit);
        },
        on      : {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Показать/скрыть фильтры (Ctrl+Shift+F)");
            }
        } 
    };

    return btn;
}


;// CONCATENATED MODULE: ./src/js/blocks/tableEditForm/toolbarBtn.js




const tableEditForm_toolbarBtn_logNameFile = "tableEditForm => toolbarBtn";

function setSecondaryState(){
    const btnClass       = document.querySelector(".webix_btn-filter");
    const primaryClass   = "webix-transparent-btn--primary";
    const secondaryClass = "webix-transparent-btn";

    try{
        btnClass.classList.add   (secondaryClass);
        btnClass.classList.remove(primaryClass  );
    } catch (err) {   
        errors_setFunctionError(err,tableEditForm_toolbarBtn_logNameFile,"setSecondaryState");
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

        hideElem(filterContainer);
        hideElem(filterForm     );
        
        setSecondaryState();

        if (editForm && editForm.isVisible()){
            hideElem(editForm     );
            hideElem(editContainer);
          

        }else if (editForm && !(editForm.isVisible())) {
            showElem(editForm      );
            showElem(editContainer);
            hideElem($$("tablePropBtnsSpace"));
        }

    }

    function minView () {
        const tableContainer = $$("tableContainer");
        hideElem(tableContainer);
        hideElem(tree);
        showElem(backBtn);
        
        editForm.config.width = window.innerWidth-45;
        editForm.resize();
    }

    maxView ();
    if (container.$width < 850 ){
        hideElem(tree);

        if (container.$width < 850 ){
            minView ();
        }
      
    } else {
        hideElem(backBtn);
        editForm.config.width = 350;
        editForm.resize();
    }
}



function toolbarEditButton (idTable){
    const idBtnEdit = idTable + "-editTableBtnId";

    function returnValue( empty = true ){
        const icon = "<span class='webix_icon icon-pencil'></span>";
        const text = "<span style='padding-left: 5px'>Редактор записи</span>";

        if (empty){
            return icon;
        } else {
            return icon+text;
        }
    }   

    return {   
        view    : "button",
        maxWidth: 200, 
        value   : returnValue( false ),
        id      : idBtnEdit,
        css     : "webix_btn-edit",
        title   : "текст",
        hotkey  : "ctrl+shift+x",
        height  : 42,
        minWidth: 40,
        onlyIcon: false,
        click   : function(){
            editBtnClick(idBtnEdit);
        },
        on      : {
            onAfterRender: function () {
                try{
                    if(idTable !== "table" && this.isVisible()){
                        this.hide();
                    }
                } catch (err) {   
                    errors_setFunctionError(err,tableEditForm_toolbarBtn_logNameFile,"btn edit onAfterRender");
                }

            
                if ( this.$width < 160 &&  !this.config.onlyIcon ){
                    this.setValue(returnValue( ));
                    this.config.onlyIcon = true;
                } else if (this.$width > 160 && this.config.onlyIcon){
                    this.setValue(returnValue( false ));
                    this.config.onlyIcon = false;
                }

                this.getInputNode().setAttribute("title","Редактировать запись (Ctrl+Shift+X)");
            }
        } 
    };
}


;// CONCATENATED MODULE: ./src/js/blocks/columnsSettings/visibleColumns.js






function searchColsListPress (){
    const list      = $$("visibleList");
    const search    = $$("searchColsList");
    const value     = search.getValue().toLowerCase();
    let counter     = 0;
    try{
    
        list.filter(function(obj){
            const condition = obj.label.toLowerCase().indexOf(value) !== -1;

            if (condition){
                counter ++;
            }
    
            return condition;
        });

        if (counter == 0){
           showElem($$("visibleColsEmptyTempalte"));
        } else {
            hideElem($$("visibleColsEmptyTempalte"));
        }
      
    } catch(err){
        errors_setFunctionError(err,"visibleColumns","searchColsListPress");
    }

}


function setBtnSubmitState(state){
    const btnSubmit  = $$("visibleColsSubmit");
    const check      = btnSubmit.isEnabled();

    if (state == "enable" && !(check) ){
        btnSubmit.enable();
    } else if ( state == "disable" && check ){
        btnSubmit.disable();
    }
}


function setColsSize(col,listItems){
    const table      = getTable();
    const countCols  = listItems.length;
    const tableWidth = $$("tableContainer").$width-17;
    const colWidth   = tableWidth / countCols;

    table.setColumnWidth(col, colWidth);
}

function clearBtnColsClick (){
    const table  = getTable();
    const cols   = table.getColumns(true);
    const values = [];
  
    function returnWidthCol(){
        const containerWidth = window.innerWidth - $$("tree").$width - 77; 
        const cols           = table.getColumns(true).length;
        const colWidth   = containerWidth / cols;
        return colWidth.toFixed(2);
    }



    function returnPosition(column){
        const defaultColsPosition = Object.keys(table.data.pull[1]);
        let position;
        defaultColsPosition.forEach(function(el,i){
            if (el == column){
                position = i;
            }
        });

        return position;
    }

    function showCols(){
        try{
            cols.forEach(function(el,i){
                const colWidth    = returnWidthCol();
                const positionCol = returnPosition(el.id);

                setColsSize(el.id,cols);
                
                if( !( table.isColumnVisible(el.id) ) ){
                    table.showColumn(el.id);
                }
           
                table.setColumnWidth(el.id, colWidth);

                values.push({
                    column   : el.id,
                    position : positionCol,
                    width    : colWidth 
                });
            });
        } catch(err){
            errors_setFunctionError(err,"visibleColumns","clearBtnColsClick => showCols");
        }
    }
    modalBox(   "Будут установлены стандартные настройки", 
            "Вы уверены?", 
            ["Отмена", "Сохранить изменения"]
    )
    .then(function(result){

        if (result == 1){
            showCols();
            postPrefsValues(values);
            destructPopup();
            setLogValue   ("success","Рабочая область таблицы обновлена");
        }
    });
}


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
        errors_setFunctionError(err,"visibleColumns","visibleColsSubmitClick");
    }

    postPrefsValues(values,true);

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

function colsPopupSelect(action){

    const list                  = $$("visibleList");
    const listSelect            = $$("visibleListSelected");
    const emptyTemplateSelected = $$("visibleColsEmptyTempalteSelected");
    const emptyTemplate         = $$("visibleColsEmptyTempalte");

    function showEmptyElem(list,emptyEl,btn){
        const listPull      = Object.values(list.data.pull);
        if ( !(listPull.length) ){
            showElem(emptyEl);

            if( btn && btn.isEnabled() ){
                btn.disable();
            } 

            setBtnSubmitState("disable");

        }
    }

    function hideEmptyElem(type){

        if ( type == "available" ){
            const pull = Object.values(list.data.pull);
            if ( pull.length ){
                hideElem(emptyTemplateSelected);
                setBtnSubmitState("enable");
            } 
             
        } else if ( type == "selected"  ){
            const pull = Object.values(listSelect.data.pull);
        
            if ( pull.length ){
                hideElem(emptyTemplate);
                setBtnSubmitState("enable");
                
            } 
        }  
    }


    if ( action == "add"){
        const selectedItem  = list.getSelectedItem();
        const selectedId    = list.getSelectedId  ();
        if (selectedItem){
            hideEmptyElem("available");
            listSelect.add(selectedItem);
            list.remove(selectedId);
            showEmptyElem(list,emptyTemplate, $$("addColsBtn"));
        
            setBtnSubmitState("enable");
        } else {
            createMsg();
        }

      

    } else if ( action == "remove" ){
        const selectedItem  = listSelect.getSelectedItem();
        const selectedId    = listSelect.getSelectedId();
    
        if (selectedItem){
            hideEmptyElem("selected");
            list.add(selectedItem);
            listSelect.remove(selectedId);

            showEmptyElem(listSelect,emptyTemplateSelected, $$("removeColsBtn"));
         
        } else {
            createMsg();
        }
    }


}


function createSpace(){
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
            listPull.forEach(function(el,i){
            
                if (findRemoveEl(el.column)){
                list.remove(el.id);
                }

            });
        } catch (err){
            errors_setFunctionError(err,"visibleColumns","createSpace => removeListItem");
        }  
    }

    function addListSelectedItem(){
        const viewList = $$("visibleListSelected");
        const emptyEl  = $$("visibleColsEmptyTempalteSelected");
        
        if (cols.length){
            hideElem(emptyEl);
        }
        try{
            cols.forEach(function(col,i){
                viewList.add({
                    column  :col.id,
                    label   :col.label,
                });
            });
        } catch (err){
            errors_setFunctionError(err,"visibleColumns","createSpace => addListSelectedItem");
        } 
    }

    if (listPull.length !== cols.length){
        removeListItem();
        addListSelectedItem();
    }


}

function  visibleColsButtonClick(idTable){
    const currTable  = $$(idTable);
    let columns      = $$(idTable).getColumns(true);

    

    function createCheckboxes(){

        function createListItems(){

            try{

                columns = currTable.getColumns(true);
                const sortCols = _.sortBy(columns,"label");

                sortCols.forEach(function(col){

                    if(col.css !== "action-column" && !col.hiddenCustomAttr ){
                      
                        $$("visibleList").add({
                            column  :col.id,
                            label   :col.label,
                        });
                     
                    }
                   
                });

            } catch (err){
                errors_setFunctionError(err,"visibleColumns","getCheckboxArray");
            }
        }

        createListItems();
        hideElem($$("visibleColsEmptyTempalte"));
        showElem($$("popupVisibleCols"));

    }

    function createPopup(){

        const popupHeadline = {   
            template    : "Видимость колонок", 
            width       : 250,
            css         : "popup_headline list-filter-head", 
            borderless  : true, 
            height      : 20 
        };

        const btnClosePopup = {
            view        : "button",
            id          : "buttonClosePopup",
            css         : "popup_close-btn",
            type        : "icon",
            hotkey      : "esc", 
            width       : 35,
            icon        : 'wxi-close',
            click       : function(){
                destructPopup();
            },
            on          : {
                onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Закрыть окно (Esc)");
                }
            } 
        };

        function generateEmptyTemplate(id,text){
            return {   
                id        : id,
                css       : "webix_empty-template list-filter-empty",
                template  : text, 
                borderless: true
            };
        }


        function genetateScrollView(idCheckboxes,inner){
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


        const btnSaveState = {
            view    : "button",
            id      : "visibleColsSubmit", 
            value   : "Сохранить состояние", 
            css     : "webix_primary",
            hotkey  : "shift+s", 
            disabled: true,
            click   : function(){
                visibleColsSubmitClick();
            },
            on      : {
                onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Изменить отображение колонок в таблице (Shift+S)");
                }
            } 
    
        };



        const scrollView = [
            {   template    : "Доступные колонки", 
                css         : "list-filter-headline",
                height      : 25, 
                borderless  : true
            },
            generateEmptyTemplate(
                "visibleColsEmptyTempalte",
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
                        const btnAdd    = $$("addColsBtn");

                        function enableBtn(){
                            if ( btnAdd && !(btnAdd.isEnabled()) ){
                                btnAdd.enable();
                            }
                        }

                        enableBtn();
  
                    },
                    onAfterDelete:function(id){
                        const prevItem =  this.getNextId(id);
                        if(prevItem){
                            this.select(prevItem);
                        }
                    },
                }
            }
            
        ];
   
        const scrollViewSelected = [
            {   template    : "Выбранные колонки",
                css         : "list-filter-headline",
                height      : 25, 
                borderless  : true,
             
            },
            generateEmptyTemplate(
                "visibleColsEmptyTempalteSelected",
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
                        const btnRemove    = $$("removeColsBtn");

                        function enableBtn(){
                            if ( btnRemove && !(btnRemove.isEnabled()) ){
                                btnRemove.enable();
                            }
                        }

                        enableBtn();
                    },
                    onAfterDelete : function(id){
                        const prevItem = this.getNextId(id);
                        if(prevItem){
                            this.select(prevItem);
                        }
                    },
                
                }
            }

        ];
  

        const moveBtns = {
            rows:[

                {   
                    view    : "button",
                    width   : 50, 
                    type    : "icon",
                    id      : "addColsBtn",
                    css     : "list-filter-move-btns",
                    disabled: true,
                    icon    : "icon-arrow-right",
                    hotkey  : "shift+a", 
                    height  : 30,
                    click   : function(){
                       colsPopupSelect("add");
                    },
                    on: {
                        onAfterRender : function () {
                            this.getInputNode().setAttribute("title","Добавить выбранные колонки (Shift+A)");
                        }
                    } 
                },
                {   
                    view    : "button",
                    width   : 50, 
                    type    : "icon",
                    id      : "removeColsBtn",
                    css     : "list-filter-move-btns",
                    disabled: true,
                    icon    : "icon-arrow-left",
                    hotkey  : "shift+d",
                    height  : 30,
                    click   : function(){
                        colsPopupSelect("remove");
                    },
                    on: {
                        onAfterRender : function () {
                            this.getInputNode().setAttribute("title","Убрать выбранные колонки (Shift+D)");
                        }
                    } 
                },
              
            ]
        };

        const moveSelcted =  {
            cols:[
                {   
                    view    : "button",
                    width   : 50, 
                    type    : "icon",
                    id      : "moveSelctedUp",
                    icon    : "icon-arrow-up",
                    hotkey  : "shift+u",
                    css     : "webix-transparent-btn",
                    height  : 42,
                    click   : function(){
                        colsMove("up");
                    },
                    on      : {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title","Поднять выбраную колонку вверх (Shift+U)");
                        }
                    } 
                },
                {   
                    view    : "button",
                    width   : 50, 
                    type    : "icon",
                    id      : "moveSelctedDown",
                    icon    : "icon-arrow-down",
                    css     : "webix-transparent-btn",
                    hotkey  : "shift+w",
                    height  : 42,
                    click   : function(){
                        colsMove("down");
                    },
                    on      : {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title","Опустить выбраную колонку вниз (Shift+W)");
                        }
                    } 
                },
                {},
            ]
        };

        const clearBtn = {   
            view    : "button",
            width   : 50, 
            type    : "icon",
            id      : "clearBtnCols",
            icon    : "icon-trash",
            hotkey  : "shift+r",
            css     : "webix-transparent-btn webix-trash-btn-color",
            height  : 42,
            click   : function(){
                clearBtnColsClick();
            },
            on: {
                onAfterRender : function () {
                    this.getInputNode().setAttribute("title","Установить стандартные настройки (Shift+R)");
                }
            } 
        };

        const search = {   
            view        : "search", 
            id          : "searchColsList",
            placeholder : "Поиск (Shift+F)", 
            css         : "searchTable",
            height      : 42, 
            //width       : 276,
            hotkey      : "shift+f", 
            on          : {
                onTimedKeyPress : function(){
                    searchColsListPress();
                }
            }
        };
    
        webix.ui({
            view        : "popup",
            id          : "popupVisibleCols",
            css         : "webix_popup-prev-href",
            width       : 600,
            maxHeight   : 400,
            modal       : true,
            escHide     : true,
            position    : "center",
            scroll      :"y",
            body        : {

                rows:[ 
                    { cols:[

                        popupHeadline,
                        {},
                        btnClosePopup,
              
                    ]},

                    {height:5},

                    { cols:[
                        {   
                            rows:[
                                search,

                                genetateScrollView(
                                    
                                    "listContent",
                                    scrollView
                                ),
                            ]
                        },
                        {width:10},
                        { rows:[
                            {height:45},
                            {},
                            moveBtns,
                            {}
                        ]},
                        {width:10},
                        { rows:[
                        
                            {cols:[
                                moveSelcted,
                                clearBtn,
                            ]},
                            genetateScrollView(
                                "listSelectedContent",
                                scrollViewSelected
                            ),
                        ]},
                    ]},

                    {height:20},

                    btnSaveState,

                ]
            },
            

        });
        createCheckboxes();
        createSpace();
    }

    createPopup();

}

function toolbarVisibleColsBtn(idTable){
    const idVisibleCols = idTable+"-visibleCols";
    return {   
        view    : "button",
        width   : 50, 
        type    : "icon",
        id      : idVisibleCols,
        disabled: true,
        icon    : "icon-columns",
        css     : "webix_btn-download webix-transparent-btn",
        title   : "текст",
        height  : 42,
        hotkey  :"ctrl+shift+c",
        click   : function(){
            visibleColsButtonClick(idTable);
        },
        on: {
            onAfterRender : function () {
                this.getInputNode().setAttribute("title","Показать/скрыть колонки (Ctrl+Shift+C)");
            }
        } 
    };
}




;// CONCATENATED MODULE: ./src/js/blocks/toolbarTable.js











function exportToExcel(idTable){
    try{
        webix.toExcel(idTable, {
        filename:"Table",
        filterHTML:true,
        styles:true
        });
        setLogValue("success","Таблица сохранена");
    } catch (err) {   
        errors_setFunctionError(err,"toolbarTable","exportToExcel");
    }
}

function toolbarDownloadButton(idTable,visible){
    const idExport = idTable+"-exportBtn";
    return {   
        view:"button",
        width: 50, 
        type:"icon",
        id:idExport,
        hidden:visible,
        icon:"icon-arrow-circle-down",
        css:"webix_btn-download webix-transparent-btn",
        title:"текст",
        height:42,
        hotkey  :"ctrl+shift+y",
        click:function(){
            exportToExcel(idTable);
        },
        on: {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Экспорт таблицы (Ctrl+Shift+Y)");
            }
        } 
    };
}

function createTemplateCounter(idEl,text){
    const view = {   
        view:"template",
        id:idEl,
        css:"webix_style-template-count",
        height:30,
        template:function () {
            if (Object.keys($$(idEl).getValues()).length !==0){
                
                return "<div style='color:#999898;'>"+text+":"+
                        " "+$$(idEl).getValues()+
                        " </div>";
            } else {
                return "";
            }
        }
    };

    return view;
}

function tableToolbar (idTable,visible=false) {

    const idFindElements   = idTable+"-findElements",
          idFilterElements = idTable+"-idFilterElements",
          idHeadline       = idTable+"-templateHeadline"
    ;

    return { 
        
        rows:[
            setHeadlineBlock(idHeadline),

            {
                css:"webix_filterBar",
                padding:{
                    bottom:4,
                }, 
                height: 40,
                cols: [
                    toolbarFilterBtn(idTable,visible),
                    toolbarEditButton(idTable),
                    {},
                    toolbarVisibleColsBtn(idTable),
                    toolbarDownloadButton(idTable,visible)
                ],
            },

            {cols:[
                createTemplateCounter (idFindElements,  "Общее количество записей"  ),
                createTemplateCounter (idFilterElements,"Видимое количество записей"),
            ]},
        ]
    };
}



;// CONCATENATED MODULE: ./src/js/blocks/tableEditForm/layout.js




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



;// CONCATENATED MODULE: ./src/js/blocks/viewPropertyTable.js
function propertyTemplate (idProp){
    return {
        view:"property",  
        id:idProp, 
        tooltip:"Имя: #label#<br> Значение: #value#",
        width:348,
        nameWidth:150,
        editable:true,
        scroll:true,
        hidden:true,
    };
}


;// CONCATENATED MODULE: ./src/js/blocks/tableFilter/popup.js









let filterTemplateValue;
const popup_logNameFile = "tableFilter => popup";

function clearPopupBtn (){
    $$("popupFilterEdit").destructor();
    resetFilterBtn ();
}


function popupSubmitBtn (){

    webix.message({
        text:"Блок находится в разработке",
        type:"debug", 
        expire: 10000,
    });

    const stateElements = [];
    function showSegmentBtn(){
    
        let counter = 0;
        stateElements.forEach(function(checkbox,i){
            if (i){
                if (checkbox.val){
                    counter++; 
                }

 
                if (counter > 1){
                    showElem($$(checkbox.elem + "_filter_segmentBtn"));
                } else {
                    hideElem($$(checkbox.elem + "_filter_segmentBtn")); 
                }
            }
             
        });
      
    }

    function visibleField (condition,elementClass=null,el=null){
        stateElements.push({elem:elementClass, val:condition});
        let htmlElement = document.querySelectorAll(".webix_filter-inputs");

        function showHtmlEl(){
            try{
             
                htmlElement.forEach(function(elem,i){
           
                    if (elem.classList.contains(elementClass)){
                      
                        if (!(elem.classList.contains("webix_show-content"))){
                            elem.classList.add("webix_show-content");
                            
                        }
                        if (elem.classList.contains("webix_hide-content")){
                            elem.classList.remove("webix_hide-content");
                        }

                    } else {
                        if (!(elem.classList.contains("webix_hide-content"))){
                            elem.classList.add("webix_hide-content");
                        }
                    }
                });

            } catch(err){
                errors_setFunctionError(err,popup_logNameFile,"function visibleField => showHtmlEl");
            }
        }

        function showInputContainers(){
            if ($$(el)){
                $$(el).show();
            }

            if($$(el+"_container-btns") && !($$(el+"_container-btns").isVisible())){
                $$(el+"_container-btns").show();
            }
        }
    
        function enableResetBtn(){
            if (!($$("resetFilterBtn").isEnabled())){
                $$("resetFilterBtn").enable();
            }
        }

        function enableLibrarySaveBtn(){
            if (!($$("filterLibrarySaveBtn").isEnabled())){
                $$("filterLibrarySaveBtn").enable();
            }
        }

        function hideEmptyTemplate(){
            if ($$("filterEmptyTempalte").isVisible()){
                $$("filterEmptyTempalte").hide();
            }
        }

        function hideInputContainers (){
            const operBtn =  $$(el+"-btnFilterOperations");
            if( operBtn ){
                operBtn.setValue("=");
            }
         
            $$(el).setValue("");
            $$(el).hide();
     
            if($$(el+"_container-btns") && $$(el+"_container-btns").isVisible()){
                $$(el+"_container-btns").hide();
            }
        }

        function hideHtmlEl (){
            try{
                htmlElement.forEach(function(elem,i){
                    if (elem.classList.contains(elementClass)){
                        if (!(elem.classList.contains("webix_hide-content"))){
                            elem.classList.add("webix_hide-content");
                        }
                        if (elem.classList.contains("webix_show-content")){
                            elem.classList.remove("webix_show-content");
                        }
                    }
                });

            } catch(err){
                errors_setFunctionError(err,popup_logNameFile,"function visibleField => hideHtmlEl");
            }
        }
      
        function removeChilds(){
            const countChild = $$(el+"_rows").getChildViews();  
            const childs     = [];
    
            try{
               
                Object.values(countChild).forEach(function(elem,i){
                  
                    if (elem.config.id.includes("child")){
                        childs.push($$(elem.config.id));
                    }

                });
 
                childs.forEach(function(el,i){
                    const parent = el.getParentView();
                    parent.removeView($$(el.config.id));
 
                });

            } catch(err){
                errors_setFunctionError(err,popup_logNameFile,"function visibleField => removeChids");
            }
        }

        let checkChilds = false;
        if (el!=="selectAll"){
            const childs = $$(el+"_rows").getChildViews();
            if (childs.length > 1){
                checkChilds = true;
            }
         
        }
 
        if ( !checkChilds ){
            if (condition){

                try{
                    showHtmlEl();
                    showInputContainers();
                    enableResetBtn();
                    enableLibrarySaveBtn();
                    hideEmptyTemplate();
                } catch(err){
                    errors_setFunctionError(err,popup_logNameFile,"function visibleField => showElements");
                }

            } else{
                try{
        
                    if ($$(el).isVisible()){
                        hideHtmlEl ();
                    }

                    if($$(el+"_rows")){
                        removeChilds();
                    }

                    hideInputContainers ();

                } catch(err){
                    errors_setFunctionError(err,popup_logNameFile,"function visibleField => hideElements");
                }
            }
        } else {
            if ( !condition ){
                if ($$(el).isVisible()){
                    hideHtmlEl ();
                }

                if($$(el+"_rows")){
                    removeChilds();
                }

                hideInputContainers ();
            }
        }
    }

    function getLibraryData(){
        
        let radioValue = $$("filterEditLib").getOption($$("filterEditLib").getValue());
        
        let userprefsData = webix.ajax("/init/default/api/userprefs/");
     
        userprefsData.then(function(data){
            let dataErr = data.json();
            data = data.json().content;
      
            const currId    = getItemId ();
            const allInputs = $$("inputsFilter").getChildViews();
       
            function hideFalseInputs(trueInputs){
              
                
                function findTrueInput(inp){
                    let findInput;
                    trueInputs.forEach(function(el,i){
                     
                        if (inp.includes(el)){
                            findInput = el;
                        }
                        
                    });


                    return findInput+"_rows";
                }

                try{
                    allInputs.forEach(function(input,i){
             
                        let trueInp = findTrueInput(input.config.id);
                        let id      = input.config.id;
                        
                        function getElementHide(){
                            let indexHide = id.indexOf("_rows");
                            return id.slice(0,indexHide);
                        }

                        function getHtmlClass(elementHide){
                            let indexHtml = elementHide.indexOf("_filter");
                            return id.slice(0,indexHtml);
                        }

                        if (input.config.id !== trueInp){
                            let elementHide = getElementHide();
                            let htmlClass = getHtmlClass(elementHide);
                            visibleField(0,htmlClass,elementHide);
                        }

                    });
                } catch(err){
                    errors_setFunctionError(err,popup_logNameFile,"function hideFalseInputs");
                }
            }

            function removeChilds(){
                const inputsInner = [];

                allInputs.forEach(function(input,i){
                    inputsInner.push(input.getChildViews());
                });

                function getChilds(el){
                    el.forEach(function(child,i){
                        if (child.config.id.includes("-child-")){
                            const childView = $$(child.config.id);
                            const parent = childView.getParentView();
                            parent.removeView(childView);
                        }
                    });
                }
             
                inputsInner.forEach(function(el,i){
                    if (el.length > 1){
                       getChilds(el);
                    }
                });
            }
 
            function  createWorkspace(prefs){
                removeChilds();
                let trueInputs = [];

                try{
                    prefs.collection.content.forEach(function(el,i){
                     
                        function getHtmlArgument (){
                            const indexHtml = el.parentField.id.indexOf("_filter");
                            return el.parentField.id.slice(0,indexHtml); 
                        }

                        function getIdElArgument (){
                            const indexId = el.parentField.id.indexOf("_rows");
                            return el.parentField.id.slice(0,indexId);
                        }

                        function showParentInputs(){
                            const htmlClass = getHtmlArgument ();
                            const idEl      = getIdElArgument ();
                    
                            visibleField(1,htmlClass,idEl);

                            trueInputs.push(idEl);
                        }

                        function setParentValues(){
                            if($$(el.parentValue.id)){
                                $$(el.parentValue.id).setValue(el.parentValue.value);
                            }
                        }

                        
                        function removeLastChilds (){
                            try{ 
                                if(  $$(el.parentField.id) ){
                                    $$(el.parentField.id)._cells.forEach(function(child,i){
                                        if (child.config.id.includes("child")){
                                            $$(el.parentField.id).removeView($$(child.config.id));
                                        }
                                    });
                                }
                            } catch(err){
                                errors_setFunctionError(err,popup_logNameFile,"function createWorkspace => removeLastChilds");
                            }
                        }

                        function createChilds(){
                            const columnsData = $$("table").getColumns(true);
           
                            try{ 
                                columnsData.forEach(function(col,i){
                                    if ( el.parentField.id == col.id+"_filter" ){
                                      
                                        if (el.condition == "and"){
                                     
                                            createChildFields ("and",col);
            
                                            $$(el.childValue.id).setValue(el.childValue.value); 
                                       
                                       
                                        } else if (el.condition == "or"){
                                            createChildFields ("or",col);
    
                                            $$(el.childValue.id).setValue(el.childValue.value); 
                                         
                                        }
                               
                                    }
                                });
                            } catch(err){
                                errors_setFunctionError(err,popup_logNameFile,"function createWorkspace => createChilds");
                            }
                        }


                        if (el.condition == "parent"){
                            
                            showParentInputs();
            
                            setParentValues();
                          removeLastChilds ();
                        
                        }
                  
               
                        hideFalseInputs(trueInputs);
                        createChilds();
                    });
            
                    $$("filterTableForm").setValues(prefs.values);

                } catch(err){
                    errors_setFunctionError(err,popup_logNameFile,"function createWorkspace");
                }
            }

            function dataEnumeration() {
                try{
                    data.forEach(function(el,i){

                        if (el.name == currId+"_filter-template_"+radioValue.value){
                            let prefs = JSON.parse(el.prefs);
                            createWorkspace(prefs);
                        }

                        function removeFilterPopup(){
                            if ($$("popupFilterEdit")){
                                $$("popupFilterEdit").destructor();
                            }
                        }

                        function enableBtnSubmit(){
                            if ($$("btnFilterSubmit") && !($$("btnFilterSubmit").isEnabled())){
                                $$("btnFilterSubmit").enable();
                            }
                        }
                        removeFilterPopup();
                        enableBtnSubmit();
                    });
                } catch(err){
                    errors_setFunctionError(err,popup_logNameFile,"function dataEnumeration");
                }
            }

            //if (dataErr.err_type == "i"){
            dataEnumeration();
            setLogValue("success","Рабочая область фильтра обновлена");
    
               
            // } else {
            //     setLogValue("error",dataErr.err); 
            // }

        });

        userprefsData.fail(function(err){
            setAjaxError(err, popup_logNameFile,"getLibraryData");
        });


      
    }

    function getCheckboxData(){

        function enableLibrarySaveBtn(){
            const btn = $$("filterLibrarySaveBtn");
            if ( btn && !(btn.isEnabled()) ){
                btn.enable();
            }
        }

        function createWorkspaceCheckbox (){
            let values = $$("editFormPopup").getValues();
            let elementClass;
            let index;
    
            try{
                Object.keys(values).forEach(function(el,i){
                    index        = el.lastIndexOf("_");
                    elementClass = el.slice(0,index);
                    visibleField (values[el],elementClass,el);
          
                });
            } catch(err){
                errors_setFunctionError(err,popup_logNameFile,"function createWorkspaceCheckbox");
            }
        }

        function visibleCounter(){
            let visibleElements=0;
            try{
                Object.values($$("filterTableForm").elements).forEach(function(el,i){
                    if (!(el.config.hidden)){
                        visibleElements++;
                    }
                    
                });

            } catch(err){
                errors_setFunctionError(err,popup_logNameFile,"function getCheckboxData => visibleCounter");
            }

            return visibleElements;
        }

        function showEmptyTempalte(){
            if (!($$("filterEmptyTempalte").isVisible())){
                $$("filterEmptyTempalte").show();
            } 
        }

        function disableFilterSubmit(){
            if($$("btnFilterSubmit") && $$("btnFilterSubmit").isEnabled()){
                $$("btnFilterSubmit").disable();
            }
        }

        function disableibrarySaveBtn(){
            if($$("filterLibrarySaveBtn").isEnabled()){
                $$("filterLibrarySaveBtn").disable();
            }
        }

        function hideFilterPopup (){
            if ($$("popupFilterEdit")){
                $$("popupFilterEdit").destructor();
            }
        }
       
        try{
            enableLibrarySaveBtn();
            createWorkspaceCheckbox ();

            const visibleElements = visibleCounter();

            if (!(visibleElements)){
                showEmptyTempalte();
                disableFilterSubmit();
                disableibrarySaveBtn(); 
            } 

            hideFilterPopup ();

        } catch(err){
            errors_setFunctionError(err,popup_logNameFile,"function getCheckboxData");
        }
      
        setLogValue("success","Рабочая область фильтра обновлена");
    }

    try{                                             
        const tabbarValue = $$("filterPopupTabbar").getValue();

        if (tabbarValue =="editFormPopupLib"){
            getLibraryData();

        } else if (tabbarValue=="editFormScroll"){
            getCheckboxData();
            showSegmentBtn();
        }
    }catch(err){
        errors_setFunctionError(err,popup_logNameFile,"function popupSubmitBtn");
        $$("popupFilterEdit").destructor();
    }
}

const templateRecover = {
    template:"<div class='no-wrap-headline'> Редактор фильтров </div>", 
    css:"webix_template-recover", 
    borderless:true, 
    height:40 
};

const buttonClosePopup =  {
    view:"button",
    id:"buttonClosePopup",
    css:"popup_close-btn",
    type:"icon",
    hotkey: "esc",
    width:25,
    icon: 'wxi-close',
    click:function(){
        if ($$("popupFilterEdit")){
            $$("popupFilterEdit").destructor();
        }
    
    }
};

const filterPrompt = {
    css:"webix_empty-template",
    template:"Выберите нужные поля или шаблон из библиотеки", 
    borderless:true, 
    height:47
};
function tabbarClick (id){


    function btnSubmitState (state){
        try {
            if (state=="enable"){
                if(!($$("popupFilterSubmitBtn").isEnabled())){
                    $$("popupFilterSubmitBtn").enable();
                }
            } else if (state=="disable"){
                if($$("popupFilterSubmitBtn").isEnabled()){
                    $$("popupFilterSubmitBtn").disable();
                }
            }
        }catch(err){
            errors_setFunctionError(err,popup_logNameFile,"btnSubmitState");
        }
    }


    function visibleRemoveBtn (param){
        if ($$("editFormPopupLibRemoveBtn") && 
        !($$("editFormPopupLibRemoveBtn").isVisible())){
            if (param){
                $$("editFormPopupLibRemoveBtn").show();
            } else {
                $$("editFormPopupLibRemoveBtn").hide();
            }
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
           // visibleClearBtn (false);
            setStateSubmitBtn ();
            visibleRemoveBtn (true);
        }catch(err){
            errors_setFunctionError(err,popup_logNameFile,"filterLibrary");
        }
        
        

    }     

    function editFilter (){
    

        let checkboxes = $$("editFormPopup").getValues();
        let counter = 0;
        
        function countChecked(){
            Object.values(checkboxes).forEach(function(el,i){
                if (el){
                    counter++;
                }
            });
        }
        
        function setStateSubmitBtn(){
            if (counter > 0){
                btnSubmitState ("enable");
            } else {
                btnSubmitState ("disable");
            }
        }

        try{
            countChecked();
          //  visibleClearBtn (true);
            visibleRemoveBtn (false);
            setStateSubmitBtn();
        }catch(err){
            errors_setFunctionError(err,popup_logNameFile,"editFilter");
        }
    }

    function tabbarLogic(){
        if (id =="editFormPopupLib"){
            filterLibrary();  
        }

        if (id =="editFormScroll"){
            editFilter ();
        }
    }

    try{
        tabbarLogic();
    } catch (err){
        errors_setFunctionError(err,popup_logNameFile,"tabbarLogic");
    }
}

const popup_tabbar =  {
    view:"tabbar",  
    type:"top", 
    id:"filterPopupTabbar",
    css:"webix_filter-popup-tabbar",
    multiview:true, 
    options: [
        {   value: "<span class='webix_tabbar-filter-headline'>Поля</span>", 
            id: 'editFormScroll' 
        },
        {   value: "<span class=webix_tabbar-filter-headline'>Библиотека</span>", 
            id: 'editFormPopupLib' 
        },
    ],
    height:50,
    on:{
        onAfterTabClick:function(id){
            tabbarClick(id);
        }
    }
};

const tabCheckboxes = {   
    view:"scrollview",
    borderless:true, 
    css:"webix_multivew-cell",
    id:"editFormScroll", 
    scroll:"y", 
    body:{ 
        id:"editFormPopupScroll",
        rows:[ ]
    }

};

function stateSubmitBtn(state){
    if(state){
        $$("popupFilterSubmitBtn").enable();
    } else {
        $$("popupFilterSubmitBtn").disable();
    }

}

function returnTemplateValue(){
    return filterTemplateValue;
}

const radioLibBtn =  {   
    view:"radio", 
    id:"filterEditLib",
    vertical:true,
    options:[],
    on:{
        onChange:function(){
            function enableRemoveBtn(){
                if (!($$("editFormPopupLibRemoveBtn").isEnabled())){
                    $$("editFormPopupLibRemoveBtn").enable();
                }
            }
            
            if (this.getValue()){
                filterTemplateValue = this.getValue();

                
                enableRemoveBtn();
                if(!($$("popupFilterSubmitBtn").isEnabled())){
                    stateSubmitBtn(true);
                }
            } else {
                if($$("popupFilterSubmitBtn").isEnabled()){
                    stateSubmitBtn(false);
                }
            }
        }
    }
};

const tabLib = {  
    view:"form", 
    scroll:true ,
    id:"editFormPopupLib",
    css:"webix_multivew-cell",
    borderless:true,
    elements:[
        radioLibBtn
    ],

};

const popup_submitBtn =  {   
    view:"button",
    id:"popupFilterSubmitBtn",
    height:48,
    minWidth:140,
    disabled:true, 
    css:"webix_primary",
    hotkey: "Enter",
    value:"Применить", 
    on: {
        onAfterRender: function () {
            this.getInputNode().setAttribute("title","Выбранные фильтры будут добавлены в рабочее поле, остальные скрыты");
        },
    },
    click:popupSubmitBtn
};

// const cleanBtn = {   
//     view:"button",
//     id:"popupFilterClearBtn",
//     width:110,
//     height:48,
//     css:"webix_secondary",
//     disabled:true,
//     value:"Сбросить", 
//     on: {
//         onAfterRender: function () {
//             this.getInputNode().setAttribute("title","Все фильтры будут очищены и удалены");
//         },
//     },
//     click:clearPopupBtn
// };

const removeBtn = {   
    view:"button",
    css:"webix_danger",
    id:"editFormPopupLibRemoveBtn",
    type:"icon",
    icon: 'icon-trash',
    hidden:true,
    disabled:true,
    width: 50,
    click:function(){
        const currId = getItemId ();
        async function userprefsData (){ 
            let libValue = $$("filterEditLib").getValue();
            let radioValue = $$("filterEditLib").getOption(libValue);

            if (!PREFS_STORAGE.userprefs){
                await getUserprefsData (); 
            }

            if (PREFS_STORAGE.userprefs){
                let data = PREFS_STORAGE.userprefs.content;
                let templateName = currId+"_filter-template_"+radioValue.value;


                data.forEach(function(el,i){
                    function deleteElement(){
                        let deleteTemplate = webix.ajax().del("/init/default/api/userprefs/"+el.id,el);

                        deleteTemplate.then(function(data){
                            data = data.json();
                        
                            function removeOptionState (){
                                try{
                                    $$("filterEditLib").config.options.forEach(function(el,i){
                                        if (el.id == radioValue.id){
                                            el.value = radioValue.value + " (шаблон удалён)";
                                            $$("filterEditLib").refresh();
                                            $$("filterEditLib").disableOption($$("filterEditLib").getValue());
                                            $$("filterEditLib").setValue("");
                                        }
                                    });
                                } catch (err){
                                    errors_setFunctionError(err,popup_logNameFile,"function deleteElement => removeOptionState");
                                }
                            }

                            if (data.err_type !== "e"&&data.err_type !== "x"){
                                setLogValue("success","Шаблон « "+radioValue.value+" » удален");
                                removeOptionState ();
                            } else {
                                setLogValue("error", popup_logNameFile+" function userprefsData: "+data.err);
                            }

                        });
                        deleteTemplate.fail(function(err){
                            setAjaxError(err, popup_logNameFile,"getLibraryData");
                        });
                    }

                    if (el.name == templateName){
                        deleteElement();
                    }
                });

            }
        }


        modalBox(   "Шаблон будет удалён", 
                    "Вы уверены, что хотите продолжить?", 
                    ["Отмена", "Удалить"]
        ).then(function(result){
    
            if (result == 1){

                userprefsData ();
                
            }
        });




    },
    on: {
        onAfterRender: function () {
            this.getInputNode().setAttribute("title","Выбранный шаблон будет удален");
        },
    },
};

const editFormPopup = {
    view:"form", 
    id:"editFormPopup",
    css:"webix_edit-form-popup",
    borderless:true,
    elements:[
        {rows:[ 
            popup_tabbar,
                
            {   height:200,
                cells:[
                    tabCheckboxes,
                    tabLib,
                ]   
            },
    
            {height:20},
            {cols:[
                popup_submitBtn,
                {width:5},
               // cleanBtn,
                removeBtn,
            ]},
        ]},
        {}

    ],
};

function createFilterPopup() {
    webix.ui({
        view:"popup",
        id:"popupFilterEdit",
        css:"webix_popup-filter-container webix_popup-config",
        modal:true,
        escHide:true,
        position:"center",
        height:400,
        width:400,
        body:{
            scroll:"y", rows:[
                {css:"webix_filter-headline-wrapper", cols:[ 
                    templateRecover,
                    {width:150},
                    buttonClosePopup,
                ]},

                filterPrompt,
                editFormPopup
            ]
        }
    }).show();
}
//createFilterPopup();





;// CONCATENATED MODULE: ./src/js/blocks/tableFilter/buttons.js








const PREFS_STORAGE = {};  
const tableFilter_buttons_logNameFile   = "tableFilter => buttons";

function getUserprefsData (){

    return webix.ajax().get(`/init/default/api/userprefs/`)
    .then(function (data) {
        PREFS_STORAGE.userprefs = data.json();
        return PREFS_STORAGE.userprefs;
    }).fail(err => {
        setAjaxError(err, tableFilter_buttons_logNameFile,"getUserprefsData");
    }
);
}

function editFiltersBtn (){
  
    const currId = getItemId ();

    createFilterPopup();

    function userprefsData (){ 

        const userprefsGetData = webix.ajax("/init/default/api/userprefs/");

        userprefsGetData.then(function(data){

            function setTemplates(user){
                const lib = $$("filterEditLib");

                function clearOptionsPull(){
                
                    const oldOptions = [];
    
                    if (lib && lib.config.options.length !== 0){
                        lib.config.options.forEach(function(el){
                            oldOptions.push(el.id);
                        });

                        oldOptions.forEach(function(el){
                            lib.removeOption(el);
                        
                        });
                
                    }
                }

                clearOptionsPull();

                const dataSrc = data.json().content;
                try{
                    dataSrc.forEach(function(data, i) {
                     
                        if( data.name.includes("filter-template_") && data.owner == user.id ){
                            const prefs = JSON.parse(data.prefs);
                            if (prefs.table == currId){
                    
                                lib.addOption( {
                                    id    : i+1, 
                                    value : prefs.name
                                });
                    
                            }
                        }
                    
                    });
                } catch (err){
                    errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function setTemplates");
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


            let user = webix.storage.local.get("user");

            try{
                if (!user){
                    getUserData ();
                    user = webix.storage.local.get("user");
                }
    
                if(user){
                    setTemplates(user);

                    const lib = $$("filterEditLib");
                    
                    if (lib && lib.data.options.length == 0 ){
                        setEmptyOption();
                    }
             
                }
            } catch (err){
                errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function userprefsData");
            }
            
        });
        userprefsGetData.fail(function(err){
            setAjaxError(err, tableFilter_buttons_logNameFile,"saveTemplate");
        });
       
    }

    userprefsData ();

    function setValueLib(){
        const lib = $$("filterEditLib");
        if (lib){ 
            lib.setValue(  returnTemplateValue () );   
          
        }
    }  

    function stateSubmitBtn(state){
        const btn = $$("popupFilterSubmitBtn");
        if(state){
            btn.enable();
        } else {
            btn.disable();
        }
    
    }
    
    
    function popupSizeAdaptive(){

        const size  = window.innerWidth * 0.89;
        const popup = $$("popupFilterEdit");
        try{
            popup.config.width = size;
            popup.resize();
        } catch (err){
            errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function userprefsData => popupSizeAdaptive");
        }
    }
    
    setValueLib();

    if (window.innerWidth < 1200 ){
        popupSizeAdaptive();
    }

    const checkbox =  {
        view        : "checkbox", 
        id          : "selectAll", 
        labelRight  : "<div style='font-weight:600'>Выбрать всё</div>", 
        labelWidth  : 0,
        name        : "selectAll",
        on          : {
            onChange:function(){
                stateSubmitBtn(true);

                function setValueCheckbox(){
                    const checkboxes = $$("editFormPopupScrollContent").getChildViews();
                    try{
                        checkboxes.forEach(function(el,i){
                            if (el.config.id.includes("checkbox")){

                                if($$("selectAll").getValue()){
                                    el.config.value = 1;
                                } else {
                                    el.config.value = 0;
                                }
                                $$(el).refresh();
                            }

                        });
                    } catch (err){
                        errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function checkbox:onchange => setValueCheckbox");
                    }
                }

                setValueCheckbox(); 
            

            },
    
        } 
    };
 
    
 
    function getAllCheckboxes(){
        const checkboxes           = [];
        const filterTableElements  = $$("filterTableForm").elements;
        try{
            Object.values(filterTableElements).forEach(function(el,i){
                checkboxes.push({ 
                    id    : el.config.id, 
                    label : el.config.label 
                });
            });
        }catch (err){
            errors_setFunctionError( err, tableFilter_buttons_logNameFile, "function editFiltersBtn => getAllCheckboxes" );
        }
     
        return checkboxes;
    }

   // let formData = getAllCheckboxes();
   
 
    function checkboxOnChange (el){
   
        const parent = $$(el.id+"_checkbox").getParentView();
        const childs = parent.getChildViews();
    
        let counter  = 0;
        let btnState = 0;

        function getStatusCheckboxes(){
            try{
                childs.forEach(function(el,i){
                    if (el.config.id.includes("checkbox")){
                        const value = el.config.value;

                        if ( !(value) || value == "" ){
                            counter++;
                        }
                    }
                    if (el.config.value){
                        btnState++;
                    }
                });
            } catch (err){
                errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function checkboxOnChange => getStatusCheckboxes");
            }
        }

        function setStateBtnSubmit(){
            stateSubmitBtn(true);
        }

        function setSelectAllState(){
            try{
                const selectAll = $$("selectAll");
               
                if (counter == 0){
                    selectAll.config.value = 1;
                    selectAll.refresh();

                } else if ( selectAll.config.value !== 0 ){
                    selectAll.config.value = 0;
                    selectAll.refresh();
                    
                }
            } catch (err){
                errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function checkboxOnChange => setSelectAllState");
            }
        }
       
        try{
            getStatusCheckboxes();
            setStateBtnSubmit();
            setSelectAllState();
        } catch (err){
            errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function checkboxOnChange");

        }
    }

   
    function createCheckboxes(){

        const nameList = [
            {cols:[
                {   id  : "editFormPopupScrollContent",
                    css : "webix_edit-form-popup-scroll-content",
                    rows: [
                        checkbox
                    ]
                }
            ]}
        ];

  
   
        try {  
            const formData = getAllCheckboxes();

            formData.forEach(function(el,i){
                if(!(el.id.includes("child"))){

                    const template = {
                        view        : "checkbox", 
                        id          : el.id+"_checkbox", 
                        labelRight  : el.label, 
                        labelWidth  : 0,
                        name        : el.id,
                        on          : {
                            onChange:function(){
                                checkboxOnChange (el);
                            }
                        } 
                    };

                    const field = $$(el.id);

                    const allInputs = $$( el.id+"_rows").getChildViews();

            
                    if (field && field.isVisible() || allInputs.length > 1 ){
               
                        template.value = 1;
                        nameList[0].cols[0].rows.push(template);
                    
                    }else {
                        nameList[0].cols[0].rows.push(template);
                    }
                }
            });

            const scroll = $$("editFormPopupScroll");

            if (scroll){
                scroll.addView( {rows : nameList}, 1 );
            }
        } catch (err){
            errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function createCheckboxes");
        }
    }
    
    createCheckboxes();
  

    let counter = 0;
    const checkboxes = $$("editFormPopupScrollContent").getChildViews();
    
    function countSelectCheckboxes(){
        try{
            checkboxes.forEach(function(el,i){
                if (el.config.id.includes("checkbox")){
                    const value = el.config.value;

                    if ( !(value) || value == "" ){
                        counter++;
                    }
                }
            });
        } catch (err){
            errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function countSelectCheckboxes");
        }
    } 

    function stateSelectAll(){
        try{
            const selectAll = $$("selectAll");
            if ( counter == 0 ){
                selectAll.config.value = 1;
                selectAll.refresh();
            } 
        } catch (err){
            errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function stateSelectAll");
        }
    }

    countSelectCheckboxes();
    stateSelectAll();
 
}

function filterSubmitBtn (){
    
                             
    let query =[];

    function getOperationVal (value, filterEl,condition, position, parentIndex=false){

        const segmentBtnVal = $$(filterEl+"_segmentBtn").getValue();

        if (segmentBtnVal == "1"){
            condition = "and";
        } else {
            condition = "or";
        }


        const itemTreeId     = getItemId ();
        const operationValue = $$(filterEl+"-btnFilterOperations").config.value;
        
        let sentName;

        if (filterEl.includes("_filter")){
            const index = filterEl.lastIndexOf("_");
            sentName    = filterEl.slice(0,index);
        }

        function templateSecondItems (operation){
            const name = itemTreeId + "." + sentName;
            return "+and+" + name + operation + value;
        }

        function templateFirstItems(operation){
            const name = itemTreeId + "." + sentName;
            return name + operation + value;
        }

        
        function templateChilds(operation){
            const name = itemTreeId + "." + sentName;
            return "+" + condition + "+" + name + operation + value;
        }

        try {
      
            if (position == "parent"){

                if(parentIndex){
          
                    if (operationValue == "="){
                       query.push(templateSecondItems ("+=+"));
                     
                    } else if (operationValue == "!="){

                       query.push(templateSecondItems ("+!=+"));
                  
                    } else if (operationValue == "<"){
                       query.push(templateSecondItems ("+<+"));
                       
                    } else if (operationValue == ">"){
                       query.push(templateSecondItems ("+>+"));
                        
                    } else if (operationValue == "<="){
    
                      query.push(templateSecondItems ("+<=+"));
                
                    } else if (operationValue == ">="){
                        query.push(templateSecondItems ("+>=+"));
                        
                    } else if (operationValue == "⊆"){
                    
                        query.push(templateSecondItems ("+contains+"));
                    }

                }else {
                    if (operationValue == "="){
                        query.push(templateFirstItems("+=+"));
                    } else if (operationValue == "!="){
                        query.push(templateFirstItems("+!=+"));
                    } else if (operationValue == "<"){
                        query.push(templateFirstItems("+<+"));
                    } else if (operationValue == ">"){
                        query.push(templateFirstItems("+>+"));
                    } else if (operationValue == "<="){
                        query.push(templateFirstItems("+<=+"));
                    } else if (operationValue == ">="){
                        query.push(templateFirstItems("+>=+"));
                    } else if (operationValue == "⊆"){
                        query.push(templateFirstItems("+contains+"));
                    }
                }
                
            
            } else if (position == "child") {

                
                    if (operationValue == "="){
                        query.push(templateChilds("+=+"));
                    
                    } else if (operationValue == "!="){
                        query.push(templateChilds("+!=+"));

                    }  else if (operationValue == "<"){
                        query.push(templateChilds("+<+"));

                    } else if (operationValue == ">"){
                        query.push(templateChilds("+>+"));

                    } else if (operationValue == ">="){
                        query.push(templateChilds("+>=+"));

                    } else if (operationValue == "<="){
                        query.push(templateChilds("+<=+"));

                    } else if (operationValue == "⊆"){
                        query.push(templateChilds("+contains+"));
                    }
                
            }
        } catch (err){
            errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function filterSubmitBtn => getOperationVal");
        }
    }


    
    
    function createGetData(){
       
        const postFormatData = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
        const valuesArr      = [];

        function checkInput(el){
            el.getChildViews().forEach(function(child,i){
                const idEl = child.config.id;
                if (idEl.includes("-container-child-")){
                    const childInp = child.getChildViews()[0]._collection[0].cols[0];
           
                    const valueChild   = $$(childInp.id).getValue();

                    valuesArr.push ( { 
                        name  : childInp.name, 
                        value : valueChild 
                    });

                } else {
                    const index         = idEl.indexOf("_container");
                    const idParentInput = idEl.slice(0,index)+"_filter";

                    const name         = $$(idParentInput).config.name;
                    valuesArr.push ({ 
                        name  : name, 
                        value : $$(idParentInput).getValue()
                    });

                }
            });
        }
        
        $$("inputsFilter")._cells.forEach(function(el,i){
            checkInput(el);
        });

        let checkFirstChild = false;
        let firstItem       = 0;
     
        const notNullVals = [];

        function removeNull(){
            valuesArr.forEach(function(el,i){
                if (el.value){
                    notNullVals.push(el);
                } 
            });
        }

        removeNull();

        console.log(valuesArr,notNullVals)

        notNullVals.forEach(function(el,i){
      
            let filterEl = el.name;
            let value    = el.value ;
 
 
            if (i == 0 && filterEl.includes("child")){
                checkFirstChild = true;
                firstItem       = 1;
            } else {
                checkFirstChild = false;
            }
       
            function formattingDateValue(){
                const view = $$(filterEl).config.view; 
                if ( view == "datepicker" ){
                    value = postFormatData(value);
                }
            }
 
            function formattinSelectValue(){
                const text = $$(filterEl).config.text;
                if ( text && text == "Нет" ){
                    value = 0;
                }
            }

            function createQuery(){
                //console.log($$(filterEl+"_segmentBtn"), $$(filterEl+"_segmentBtn").getValue())
     
                try{

                    if( !(filterEl.includes("child")) ){

                        if (checkFirstChild){
                            getOperationVal ("'"+value+"'",filterEl,"and","parent",true);
                            firstItem++;
                        } else if ( firstItem == 0 ) {
                            getOperationVal ("'"+value+"'",filterEl,"and","parent");
                        } else if  ( firstItem > 0 ){
                            getOperationVal ("'"+value+"'",filterEl,"and","parent",true);
                        }

                        firstItem++;
                        
                    } else if (filterEl.includes("child")){ 

                        if (checkFirstChild){

                            if (filterEl.includes("operAnd")){
                                getOperationVal ("'"+value+"'",filterEl,"and","parent");
    
                            } else if (filterEl.includes("operOr")){
                                getOperationVal ("'"+value+"'",filterEl,"or","parent");
                            }
                           
                        } else {
                            if (filterEl.includes("operAnd")){
                                getOperationVal ("'"+value+"'",filterEl,"and","child");
    
                            } else if (filterEl.includes("operOr")){
                                getOperationVal ("'"+value+"'",filterEl,"or","child");
                            }
                        }
                    
                    }
                } catch (err){
                    errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function createQuery");
                }
            }


            if (value && $$(filterEl)){
                try{
                    formattingDateValue();
                    formattinSelectValue();
                    createQuery();
                } catch (err){
                    errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function createGetData");
                }
            }

        });

    }

    
    if ($$("filterTableForm").validate()){
        
        createGetData();
        let currTableView;
        if ($$("table").isVisible()){
            currTableView = $$("table");
        } else {
            currTableView = $$("table-view");
        }
   
        currTableView.config.filter = query.join("");

        const queryData = webix.ajax("/init/default/api/smarts?query=" + query.join("") );

        queryData.then(function(data){
            data             = data.json();
            const reccount   = data.reccount;
            const notifyType = data.err_type;
            const notifyMsg  = data.err;

            data             = data.content;


            function setData(){
                try{
                   
                    if (data.length !== 0){
                        currTableView.hideOverlay("Ничего не найдено");
                        currTableView.clearAll();
                        currTableView.parse(data);
                    } else {
                        currTableView.clearAll();
                        currTableView.showOverlay("Ничего не найдено");
                    }
                } catch (err){
                    errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function filterSubmitBtn => setData");
                }
            }

            function setCounterValue (){
                try{
                    const counter = $$("table-idFilterElements");
                    counter.setValues(reccount.toString());
                } catch (err){
                    errors_setFunctionError(err,tableFilter_buttons_logNameFile,"setCounterVal");
                }
            }

         
            if (notifyType == "i"){

                setData();
                setCounterValue();
                hideElem($$("tableFilterPopup"));
        
                setLogValue("success","Фильтры успшено применены");
            
            } else {
                setLogValue("error",notifyMsg);
            } 
        });
        queryData.fail(function(err){
            setAjaxError(err, tableFilter_buttons_logNameFile,"createGetData");
        });

        
    } else {
        setLogValue("error","Не все поля формы заполнены");
    }
  

}

function filterLibraryBtn () {
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
            width:350,
        }).then(function(result){
          
            async function saveTemplate (){ 

                if (!PREFS_STORAGE.userprefs){
                    await getUserprefsData (); 
                }

           
                const data         = PREFS_STORAGE.userprefs.content;
                const nameTemplate = result;
                const collection   = { content:[] };
                let settingExists  = false;

                const currId       = getItemId();
                const inputs       =  $$("inputsFilter")._collection;

                const formVals     = $$("filterTableForm").getValues();

                const template     = {
                    name        : nameTemplate,
                    collection  : collection,
                    values      : formVals,
                    table       : currId
                };
              
           

                const sentObj = {
                    name    : currId + "_filter-template_" + nameTemplate,
                    prefs   : template,
                };

                function childs(el,id){
                 
                    try{
                     
                        $$(el.id).getChildViews().forEach(function(child,i){
                            
                            const condition   = $$(child.config.id)._collection[0].id;
                            const index       = el.id.lastIndexOf("_rows");
                            const parentField = el.id.slice(0,index);

                   
                         
                            function setChildToCollection(){
                                let idInput = $$(child.config.id).getChildViews()[1]._collection[0].id;
                                let tempalteCollectionItem = {
                                    parentField: $$(parentField).config, 
                                    childValue : {
                                        id   : idInput+"-btnFilterOperations",
                                        value: $$(idInput+"-btnFilterOperations").getValue()
                                    }
                                };
                                if (condition.includes("and")){
                                    tempalteCollectionItem.condition = "and";
                                    collection.content.push(tempalteCollectionItem);
                                } else if (condition.includes("or")){
                                    tempalteCollectionItem.condition = "or";
                                    collection.content.push(tempalteCollectionItem);
                                } 
                            }

                            console.log(child.config.id)
                            if (child.config.id.includes("child")){
                                setChildToCollection();
                          
                            } else {
                                collection.content.push({
                                    condition:"parent",
                                    parentField:$$(el.id).config, 
                                    parentValue:{
                                        id:id+"-btnFilterOperations", 
                                        value:$$(id+"-btnFilterOperations").getValue()
                                    }
                                });
                            }

                        });
                    } catch(err){
                        errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function filterLibraryBtn => childs:");
                    }
                }

                
                function saveExistsTemplate(sentObj){
                    data.forEach(function(el,i){
               
                        const currName = currId + "_filter-template_" + nameTemplate;

                        function putUserprefsData (){
                            const url     = "/init/default/api/userprefs/"+el.id;
                            const putData = webix.ajax().put(url, sentObj);

                            putData.then(function(data){
                                data = data.json();
                                if (data.err_type == "i"){
                                    setLogValue("success","Шаблон"+" «"+nameTemplate+"» "+" сохранён в библиотеку");
                                } else {
                                    setLogValue("error","tableFilter => buttons function modalBoxExists: "+ data.err);
                                }
                            });

                            putData.fail(function(err){
                                setAjaxError(err, tableFilter_buttons_logNameFile,"saveExistsTemplate => putUserprefsData");
                            });

                        }

                        function modalBoxExists(){
               
                            modalBox(   "Шаблон с таким именем существует", 
                                        "После сохранения предыдущие данные будут стёрты", 
                                        ["Отмена", "Сохранить изменения"]
                            )
                            .then(function(result){
                               
                                if (result == 1){
                                    putUserprefsData ();
                                }
                            });
                        }
                     
                        if (el.name == currName){
                            settingExists = true;
                            modalBoxExists();
                        } 
                    });
                }

                function setDataStorage(){
                    const whoamiData = webix.ajax("/init/default/api/whoami");
                    whoamiData.then(function(data){
                        data          = data.json().content;
                        sentObj.owner = data.id;

                        const userData      = {};
                        userData.id         = data.id;
                        userData.name       = data.first_name;
                        userData.username   = data.username;
                        
                        setStorageData("user", JSON.stringify(userData));
                    });

                    whoamiData.fail(function(err){
                        setAjaxError(err, tableFilter_buttons_logNameFile,"saveTemplate => setDataStorage");
                    });

                }
                
                function saveNewTemplate(){
                    const ownerId = webix.storage.local.get("user").id;
                    if (ownerId){
                        sentObj.owner = ownerId;
                    } else {
                        setDataStorage();
                    }

                    const url           = "/init/default/api/userprefs/";
                    const userprefsPost = webix.ajax().post(url, sentObj);
                    
                    userprefsPost.then(function(data){
                        data = data.json();
    
                        if (data.err_type == "i"){
                            setLogValue("success","Шаблон"+" «"+nameTemplate+"» "+" сохранён в библиотеку");
                        } else {
                            setLogValue("error",data.error);
                        }
                    });

                    userprefsPost.fail(function(err){
                        setAjaxError(err, tableFilter_buttons_logNameFile,"saveTemplate => saveNewTemplate");
                    });

                }

                if (PREFS_STORAGE.userprefs){
                    inputs.forEach(function(el,i){
                       
                        const indexId = el.id.lastIndexOf("_rows");
                        const id = el.id.slice(0,indexId);

                        if ($$(id).isVisible()){
                            childs(el,id);
                        }
                    });

                    saveExistsTemplate(sentObj);

                    
                    if (!settingExists){
                        saveNewTemplate();
                    } 
                  
                }
            }

            saveTemplate ();

        });
    
    } catch(err) {
        errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function filterSubmitBtn");
    }
}

function buttons_backTableBtnClick() {
    const filterForm     = $$("filterTableBarContainer");
   
    const tableContainer = $$("tableContainer");
    

    function setBtnFilterState(){
        const btnClass          = document.querySelector(".webix_btn-filter");
        const primaryBtnClass   = "webix-transparent-btn--primary";
        const secondaryBtnClass = "webix-transparent-btn";

        if (btnClass.classList.contains(primaryBtnClass)){
            btnClass.classList.add     (secondaryBtnClass);
            btnClass.classList.remove  (primaryBtnClass);
        }
    }
    function defaultState(){
        if ( filterForm && filterForm.isVisible() ){
            filterForm.hide();
        }
    
        if ( tableContainer && !(tableContainer.isVisible()) ){
            tableContainer.show();
        }

        const table = $$("table");
        if (table){
            table.clearSelection();
        }
    }


    defaultState();
    setBtnFilterState();
  
}

function buttons_resetFilterBtn (){
    try {

        const itemTreeId = getItemId ();
        const url        = "/init/default/api/smarts?query="+itemTreeId+".id >= 0";
        const queryData  = webix.ajax(url);
        queryData.then(function(data){
            const dataErr =  data.json();
          
            data = data.json().content;
                
            function setDataTable(){
                try{
                    const table = $$("table");
                    if (data.length !== 0){
                        table.hideOverlay("Ничего не найдено");
                        table.clearAll();
                        table.parse(data);
                    } else {
                        table.clearAll();
                        table.showOverlay("Ничего не найдено");
                    }
                } catch (err){
                    errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function resetFilterBtn => setDataTable");
                }
            }

            function setFilterCounterVal(){
                try{
                    const filterTable     = $$("table-idFilterElements");
                    const filterCountRows = $$("table").count();
                    const value           = filterCountRows.toString();

                    filterTable.setValues(value);
                } catch (err){
                    errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function setFilterCounterVal");
                }
            }

            function clearFilterValues(){
                const form = $$("filterTableForm");
                if(form){
                    form.clear(); 
                }
            }

            function hideInputsContainer(){
                const inputs = document.querySelectorAll(".webix_filter-inputs");

                const hideClass = "webix_hide-content";
                try{
                    inputs.forEach(function(elem,i){
                        if ( !(elem.classList.contains(hideClass)) ){
                            elem.classList.add(hideClass);
                        }
                    });
                } catch (err){
                    errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function resetFilterBtn => hideInputsContainer");
                }
            }

            function clearSpace(){
                const childs = [];
                const inputsContainer = $$("inputsFilter").getChildViews();
                
      
                inputsContainer.forEach(function(el,i){
                    const inputId = el._collection[0].cols[0].id;
                    
                    function removeParentInput(){
                        $$(inputId).hide();
                    }

                    function getChildsId (){
                        try{
                            const childsView = $$(el.config.id).getChildViews();
                            childsView.forEach(function(child,i){
                                if (child.config.id.includes("child")){
                                    childs.push (child.config.id);
                                }
                            });
                        } catch (err){
                            errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function resetFilterBtn => getChildsId");
                        }
                    }

                    try{
                        removeParentInput();
                        getChildsId ();
                        hideElem($$(inputId+"_container-btns"));
                    } catch (err){
                        errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function resetFilterBtn => clearSpace");
                    }

                });
               
                function removeChilds(){
                    try{
                        childs.forEach(function(idChild,i){
                            const child  = $$(idChild);
                            const parent = child.getParentView();
                            parent.removeView(child);
                        });
                    } catch (err){
                        errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function resetFilterBtn => removeChilds");
                    }
                }
                removeChilds();
            }

            function disableLibSaveBtn(){
                const saveBtn = $$("filterLibrarySaveBtn") ;
                if (saveBtn && saveBtn.isEnabled()){
                    saveBtn.disable();
                }
            }

            function showEmptyTemplate(){
                const emptyTemplate = $$("filterEmptyTempalte");
                if  (emptyTemplate && !(emptyTemplate.isVisible()) ){
                    emptyTemplate.show();
                    emptyTemplate.refresh();
                }
            }

            function disableRemoveBtn(){
                $$("resetFilterBtn").disable();
            }

            if (dataErr.err_type == "i"){
                try{
                    setDataTable();
                    setFilterCounterVal();
                    hideElem($$("tableFilterPopup"));
                    clearFilterValues();
                    hideInputsContainer();
                    clearSpace();
                    disableLibSaveBtn();
                    showEmptyTemplate();
                    disableRemoveBtn();
                } catch (err){
                    errors_setFunctionError(err,tableFilter_buttons_logNameFile,"function resetFilterBtn");
                }
            
                setLogValue("success", "Фильтры очищены");
            } else {
                setLogValue("error", "tableFilter => buttons function resetFilterBtn ajax: "+dataErr.err);
            }
        });

        queryData.fail(function(err){
            setAjaxError(err, tableFilter_buttons_logNameFile,"resetFilterBtn");
        });
    
    } catch(err) {
        errors_setFunctionError(err,"Ошибка при очищении фильтров; tableFilter => buttons","function resetFilterBtn");
    }
}

function buttonsFormFilter (name) {

    const formResetBtn = {  
        view    : "button",
        id      : "resetFilterBtn",
        disabled: true,
        height  : 48,
        minWidth: 50,
        width   : 65,
        hotkey  : "shift+esc",
        css     : "webix_danger", 
        type    : "icon", 
        icon    : "icon-trash", 
        click   : buttons_resetFilterBtn,
        on      : {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title", "Сбросить фильтры");
            }
        } 
    };
    
    const formBtnSubmit = {   
        view    : "button",
        id      : "btnFilterSubmit",
        height  : 48,
        minWidth: 70, 
        css     : "webix_primary",
        hotkey  : "Enter",
        disabled: true,
        value   : "Применить фильтры", 
        click   : filterSubmitBtn,
    };
    
    const formEditBtn = {   
        view    : "button",
        value   : "Открыть редактор",
        height  : 48,
        minWidth: 140, 
        click   : editFiltersBtn,
        on      : {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Добавить/удалить фильтры");
            },
        },
    };    
    
    const filterBackTableBtn = { 
        view    : "button", 
        id      : "table-backTableBtnFilter",
        type    : "icon",
        icon    : "icon-arrow-left",
        value   : "Вернуться к таблице",
        hidden  : true,  
        height  : 48,
        minWidth: 50,
        width   : 55,
       
        click   : function(){
            buttons_backTableBtnClick();
        },
    
        on      : {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Вернуться к таблице");
            }
        } 
    };
    
    const formLibrarySaveBtn = {   
        view    : "button",
        id      : "filterLibrarySaveBtn",
        disabled: true,
        height  : 48,
        minWidth: 50,
        width   : 65,
        hotkey  : "shift+esc",
        type    : "icon", 
        icon    : "icon-file", 
        click   : filterLibraryBtn,
        on      : {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title", "Сохранить шаблон с полями в библиотеку");
            }
        } 
    };
    
    if ( name == "formResetBtn" ) {
        return formResetBtn;
    } else if ( name == "formBtnSubmit" ){
        return formBtnSubmit;
    } else if ( name == "formEditBtn" ){
        return formEditBtn;
    } else if ( name == "filterBackTableBtn" ){
        return filterBackTableBtn;
    } else if ( name == "formLibrarySaveBtn" ){
        return formLibrarySaveBtn;
    }
}


;// CONCATENATED MODULE: ./src/js/blocks/tableFilter/layout.js




function layout_setAdaptiveValue(btn, adaptVal, mainVal){
    const width  = btn.$width;
   
    if (width < 120 &&  btn.config.value !== adaptVal ){
        btn.config.value = adaptVal;
        btn.refresh();
      
    } else if (width > 120 &&  btn.config.value !== mainVal ) {
        btn.config.value = mainVal;
        btn.refresh();
    }
}


const formEmptyTemplate = {   
    id:"filterEmptyTempalte",
    css:"webix_empty-template",
    template:"Добавьте фильтры из редактора",
    borderless:true
};

const filterTableForm = {
    view        : "form", 
    hidden      : true,
    id          : "filterTableForm",
    minHeight   : 350,
   // width       : 320,
    scroll      : true,
    borderless  : true,
    elements    : [
        {   
            minHeight : 48,
            css       : "webix_form-adaptive",
            margin    : 5,
            rows      : [
                {   margin : 5, 
                    rows   : [
                      
                    {   
                        margin      : 5, 
                        cols        : [
                            buttonsFormFilter("filterBackTableBtn"),
                            buttonsFormFilter("formEditBtn"),
                            buttonsFormFilter("formResetBtn"),
                        ],
                    },
                    ]
                },

                {   id   : "btns-adaptive",
                    css  : {"margin-top":"5px!important"},
                    rows : [
                        {   responsive  : "btns-adaptive", 
                            margin      : 5, 
                            cols        : [
                                buttonsFormFilter("formBtnSubmit"),
                                buttonsFormFilter("formLibrarySaveBtn"),
                            ]
                        },
                        {height:10},
                        formEmptyTemplate
                    ]
                }
            ]
        },
    ],
    rules:{
        $all:webix.rules.isNotEmpty
    },


    ready:function(){
        this.validate();
    },

};

function filterForm (){
    return {    id      : "filterTableBarContainer", 
                minWidth: 250,
                width   : 350, 
                hidden  : true, 
                rows    : [
                    {   id  : "editFilterBarAdaptive", 
                        rows: [
                            filterTableForm
                        ]
                    }
                ]
            };
}



;// CONCATENATED MODULE: ./src/js/blocks/viewTools.js
function backFilterBtnClick (){
    const tools       = $$("formsTools");    
    const сontainer   = $$("formsContainer");
    const formResizer = $$("formsTools-resizer");

    function setBtnFilterState(){
        const btnClass          = document.querySelector(".webix_btn-filter");
        const primaryBtnClass   = "webix-transparent-btn--primary";
        const secondaryBtnClass = "webix-transparent-btn";

        if (btnClass.classList.contains(primaryBtnClass  )){
            btnClass.classList.add     (secondaryBtnClass);
            btnClass.classList.remove  (primaryBtnClass  );
        }
    }
    function defaultState(){
        if ( tools && tools.isVisible() ){
            tools.hide();
            formResizer.hide();
        }
    
        if ( сontainer && !(сontainer.isVisible()) ){
            сontainer.show();
        }
    }


    defaultState();
    setBtnFilterState();
}

const filterBackTableBtn = { 
    view:"button", 
    id:"table-backFormsBtnFilter",
    type:"icon",
    icon:"icon-arrow-right",
    value:"Вернуться к таблице",
 //   hidden:true,  
    height:28,
    minWidth:50,
    width:55,
   
    click:function(){
        backFilterBtnClick();
    },

    on: {
        onAfterRender: function () {
            this.getInputNode().setAttribute("title","Вернуться к таблице");
        }
    } 
};

const viewTools = {
    id:"viewTools",
    padding:10,
    rows:[
       {cols:[

            {  
                template:"Действия",
                height:30, 
                css:"popup_headline",
                borderless:true,
            },
            {},
            filterBackTableBtn
        ]},
   
        {id:"viewToolsContainer",rows:[{}]}
    ]
}


;// CONCATENATED MODULE: ./src/js/blocks/routerConfig/common.js

// tree elements








 
// other blocks
















const routerConfig_common_logNameFile = "router => common";
function createElements(specificElement){

    function createDashboards(){
        try{
            if (!$$("dashboards")){
                $$("container").addView(
                    {   view:"layout",
                        id:"dashboards", 
                        hidden:true, 
                        scroll:"auto",
                        rows: dashboardLayout()
                    },
                3);
            }
        } catch (err){
            errors_setFunctionError(err,routerConfig_common_logNameFile,"createDashboards");
        }
    }

    function createTables(){
        try{
            if (!$$("tables")){

                $$("container").addView(
                    {   id:"tables", 
                        hidden:true, 
                        view:"scrollview", 
                        body: { 
                            view:"flexlayout",
                            id:"flexlayoutTable", 
                            cols:[
                                                        
                                {   id:"tableContainer",
                                    rows:[
                                        tableToolbar ("table"),
                                        { view:"resizer",class:"webix_resizers"},
                                        table ("table", onFuncTable,true)
                                    ]
                                },
                            
                                
                               {  view:"resizer",class:"webix_resizers", id:"tableBarResizer" },
                          
                                editTableBar(),
                                filterForm(),
                                
                            ]
                        }
                    
                    },

                
                5);
                sortTable          ($$("table"));
                scrollTableLoad    ($$("table"));
                setColsWidthStorage($$("table"));
            }
        } catch (err){
            errors_setFunctionError(err,routerConfig_common_logNameFile,"createTables");
        }
    }

    function createForms(){
        try{
            if (!$$("forms")){
                $$("container").addView(
                    {   view:"layout",
                        id:"forms", 
                        css:"webix_tableView",
                        hidden:true,                       
                        rows:[
                            {cols:[
                                {id:"formsContainer",rows:[
                                    tableToolbar("table-view", true ),
                                    { view:"resizer",class:"webix_resizers",},
                                    
                                    {   view:"scrollview", 
                                        body: {
                                            view:"flexlayout",
                                            cols:[
                                                table ("table-view"),
                                        
                                            ]
                                        }
                                    }, 
                                ]}, 

                                { view:"resizer",id:"formsTools-resizer",hidden:true,class:"webix_resizers",},
                                propertyTemplate("propTableView"),
                                {id:"formsTools",hidden:true,  minWidth:190, rows:[
                                    viewTools,                                
                                ]},
                            ]},
                        
                         
                        ],

                        
                    },
                6);

               sortTable          ($$("table-view"));
               setColsWidthStorage($$("table-view"));
              //  scrollTableLoad($$("table-view"));
           
            }
        } catch (err){
            errors_setFunctionError(err,routerConfig_common_logNameFile,"createForms");
        }
    }

    function createDefaultWorkspace(){
        if(!specificElement){
            createDashboards();
            createTables();
            createForms();
        }
    }

    function createTreeTempl(){
        try{
            if (specificElement == "treeTempl"){
                if (!$$("treeTempl")){
                    $$("container").addView(
                        {   view:"layout",
                            id:"treeTempl", 
                            hidden:true, 
                            scroll:"auto",
                            rows: editTreeLayout()
                        },
                    4);
                    webix.ui(contextMenu());
                }
            }
        } catch (err){
            errors_setFunctionError(err,routerConfig_common_logNameFile,"createTreeTempl")
        }
    }

    function createCp(){
        try{
            if (specificElement == "cp"){
                $$("container").addView(
                    {   view:"layout",
                        id:"user_auth", 
                        css:"webix_auth",
                        hidden:true, 
                        rows:[
                            authCpLayout,
                            {}
                        ],
                    }, 
                7);
            }
        } catch (err){
            errors_setFunctionError(err,routerConfig_common_logNameFile,"createCp")
        }
    }

    function createUserprefs(){
        try{
            if (specificElement == "userprefs"){

                $$("container").addView(
                    {   view:"layout",
                        id:"userprefs", 
                        css:"webix_auth",
                        hidden:true, 
                        rows:[
                            userprefsLayout,
                        ],
                    }, 
                8);
            }
        } catch (err){
            errors_setFunctionError(err,routerConfig_common_logNameFile,"createUserprefs")
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
            setFunctionError(err,routerConfig_common_logNameFile,"removeElement (element: "+idElement+")")
        }
    }
    removeElement ("tables");
    removeElement ("dashboards");
    removeElement ("forms");
    removeElement ("user_auth");
}


function getWorkspace (){
  
    async function getMenuTree() {

        if (!STORAGE.mmenu){
        
            await getData("mmenu"); 
            
        }
        

        function generateChildsTree  (el){
            let childs = [];
    
            try {
                el.childs.forEach(function(child,i){
                    childs.push({
                        id:child.name, 
                        value:child.title,
                        action:child.action
                    });
                });
            } catch (err){
                errors_setFunctionError(err,routerConfig_common_logNameFile,"generateChildsTree");
            }
            return childs;
        }

        function generateParentTree  (el){ 
            let menuItem;
            try {                  
                menuItem = {
                    id:el.name, 
                    value:el.title,
                    action:el.action,
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
                errors_setFunctionError(err,routerConfig_common_logNameFile,"generateParentTree");
            }
            return menuItem;
        } 

       

        function generateHeaderMenu  (el){
            let items = [];
            
            try{ 
                items.push({id:"favs", value:"Избранное", icon: "icon-star"});
                items.push({id:"userprefs", value:"Настройки", icon: "icon-cog"});
                items.push({id:"cp", value:"Смена пароля", icon: "icon-lock"});
                items.push({id:"logout", value:"Выйти", css:"webix_logout", icon: "icon-sign-out"});
                // el.childs.forEach(function(child,i){
                //     let item = {
                //         id:child.name,
                //         value:child.title
                //     };

                    
                //     if (child.name !== "logout"){
                //         items.push(item);
                //     } 
                // });

              
            } catch (err){
                errors_setFunctionError(err,routerConfig_common_logNameFile,"generateHeaderMenu");
            }

            return items;
        }

        function generateMenuTree (){ 
            let menu,
                menuTree   = [],
                menuHeader = []
            ;

            const delims     = [];
            const tree       = $$("tree");
            const btnContext = $$("button-context-menu");

            try {
                menu = STORAGE.mmenu.mmenu;
        
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
                            menuHeader = generateHeaderMenu (el, menu, menuHeader);
                        }
                    } else {
                        delims.push(el.name);
                        menuTree.push({id:el.name, disabled:true,value:""})
                    }
              
                });

                

                tree.clearAll();
                tree.parse(menuTree);
                if (btnContext.config.popup.data !== undefined){
                    btnContext.config.popup.data = menuHeader;
                    btnContext.enable();
                }

         
                delims.forEach(function(el){
                    tree.addCss(el, "tree_delim-items");

                });
            } catch (err){
                errors_setFunctionError(err,routerConfig_common_logNameFile,"generateMenuTree");
            }
        }

        generateMenuTree (); 

 
    }

    function createContent (){ 
 
        function showMainContent(){
            try {
                $$("userAuth").hide();
                $$("mainLayout").show();
            } catch (err){
                window.alert("showMainContent: "+err+ " (Подробности: ошибка в отрисовке контента)");
                errors_setFunctionError(err,routerConfig_common_logNameFile,"showMainContent");
            }
        }

        function setUserData(){
            let userStorageData      = {};
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
        if ($$("tree").data.order.length == 0){
            getWorkspace ();
        }
    } catch (err){
        errors_setFunctionError(err,routerConfig_common_logNameFile,"checkTreeOrder");
    }
}

function closeTree(){
    try{
        if($$("tree")){
            $$("tree").closeAll();
        }
    } catch (err){
        errors_setFunctionError(err,routerConfig_common_logNameFile,"closeTree");
    }
    
}

function hideAllElements (){

    try {
        $$("container").getChildViews().forEach(function(el,i){
           
            if(el.config.view=="scrollview"|| el.config.view=="layout"){
                const element = $$(el.config.id);
                
                if (element.isVisible()){
                    element.hide();
                }
            }
        });
    } catch (err){
        errors_setFunctionError(err,routerConfig_common_logNameFile,"hideAllElements");
    }
  
     
}




;// CONCATENATED MODULE: ./src/js/blocks/getContent/getInfoDashboard.js









const getInfoDashboard_logNameFile = "getContent => getInfoDashboard";

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

function removeScroll (){
    try{
        const elem = $$("dashBodyScroll");
        if (elem){
            const parent = elem.getParentView();
            if (elem){
                parent.removeView(elem);
            }
        }
    } catch (err){  
        errors_setFunctionError(err,getInfoDashboard_logNameFile,"removeScroll");
    }
}

function addErrorView(){
          
    function createTools(){
        const dashboardTool = $$("dashboardTool");

        const tools = {
            view:"scrollview",
            id:"dashboard-tool-main",
            borderless:true,
            css:{"margin":"20px!important","height":"50px!important"},
            body: {
                view:"flexlayout",
                padding:20,
                rows:[]
            }
        };

        const headline = {
            rows:[{
                template:"",
                id:"dash-template",
                css:"webix_style-template-count webix-block-title",
                borderless:false,
                height:40,
            }]
        };

        dashboardTool.addView({
            rows:[
                tools,
                headline
            ]
        },0);
    }

    function createBody(){
        const container = $$("dashboardInfoContainer");
        const charts =  {
            id:"dashboard-charts",
            borderless:true,
            body: {
                view:"flexlayout",
                rows:[]
            }
        };

        const dashBody =   {
            view:"scrollview", 
            scroll:"auto",
            id:"dashBodyScroll",
            borderless:true, 
            body:{
                id:"dashboardBody",
                css:"dashboardBody",
                cols:[
                    charts
                ]
            }
        };

        container.addView(dashBody);
    }
   
    createTools();
    createBody();    
}

async function setTableName(idsParam) {
    const itemTreeId = getDashId(idsParam);
    try{
        if (!STORAGE.tableNames){
            await getData("fields"); 
        }

        if (STORAGE.tableNames){
            STORAGE.tableNames.forEach(function(el,i){
                if (el.id == itemTreeId){
                    const template  = $$("dash-template");
                    const value     = el.name.toString();
                    template.setValues(value);
                }
            });
        }
    } catch (err){  
        errors_setFunctionError(err,getInfoDashboard_logNameFile,"setTableName");
    }
}

function removeItems (){

    function setVars(elem){
   
        if (elem){
            try{
                const parent = elem.getParentView();
                if (elem){
                    parent.removeView(elem);
                } 
            } catch (err){
                errors_setFunctionError(err,getInfoDashboard_logNameFile,"getAjax => setVars");
            } 
        }
     
    }

    setVars ($$("dashboardInfoContainerInner")  );
    setVars ($$("dash-template")                );
    setVars ($$("dashboard-tool-main")          );
    setVars ($$("dashboard-tool-adaptive")      );
 
}

const dashLayout = [
    {   type : "wide",
        rows : []
    }
];

function clearDashLayout(){
    if ( dashLayout[0].rows.length ){
        dashLayout[0].rows = [];
    }  
}

function goToRefView(chartAction){
    const tree = $$("tree");

    if ( tree.getItem(chartAction) ){
        tree.select(chartAction);
    } else {
        Backbone.history.navigate("tree/"+chartAction, { trigger:true});
        window.location.reload();
    }
}

function createCharts(dataCharts){
 
    clearDashLayout();

    try{
        dataCharts.forEach(function(el,i){
            const titleTemplate = el.title;

            delete el.title;
     
            el.borderless  = true;
            el.minWidth    = 250;
            el.on          = {
                onItemClick:function(idEl,event,html){
                    const chartAction = el.data[idEl-1].action;
                   // const chartAction = "auth_user"

                    if (chartAction){
                        const fields = STORAGE.fields.content;
                        Object.keys(fields).forEach(function(key,i){
                          
                            if ( key == chartAction ){
                                goToRefView(chartAction);
                            }
                        });
                    } else {
                        const emptyAcion  = el.data[idEl-1];
                        emptyAcion.action = null;
                        console.log(emptyAcion)
                    }
                
                   
                }
            };

            const headline = {   
                template    : titleTemplate,
                borderless  : true,
                height      : 35,
                css         : {  
                    "font-weight" : "400!important", 
                    "font-size"   : "17px!important"
                }, 
            };
        
            dashLayout[0].rows.push({
                css : "webix_dash-chart-headline",
                rows: [ 
                    headline,
                    el
                ]
            });
        
        });

   
    } catch (err){  
        errors_setFunctionError(err,getInfoDashboard_logNameFile,"createCharts");
    }
}


function getInfoDashboard_createSpace( inputsArray, idsParam ){

    function backBtnClick (){
        const dashTool = $$("dashboard-tool-main");

       // hideElem    (dashTool);
        hideElem    ($$( "dashboardTool"));
       
        showElem    ($$("dashboardInfoContainer"));
    }

    function createMainView(){

        const headline = {  
            template    : "Фильтр",
            height      : 30, 
            css         : "webix_dash-filter-headline",
            borderless  : true
        };

        
        const filterBackBtn = { 
            view    : "button", 
            id      : "dash-backDashBtn",
            type    : "icon",
            icon    : "icon-arrow-right",
            value   : "Вернуться к дашбордам",
            hidden  : true,  
            height  : 15,
            hotkey  : "esc",
            minWidth: 50,
            width   : 55,
            
            click:function(){
                backBtnClick();
            },
            
            on: {
                onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Вернуться к дашбордам");
                }
            } 
        };
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
                
                { rows:inputsArray }
            ], 
        };

        try{
            $$("dashboardTool").addView( mainView );
        } catch (err){  
            errors_setFunctionError(err, getInfoDashboard_logNameFile, "createMainView");
        }
    }

    createMainView();

  
    function createFilterBtn(){

        function filterBtnClick (){
            const dashTool           = $$("dashboard-tool-main");
            const container          = $$("dashboardContainer" );
            const tree               = $$("tree");
            const backBtn            = $$("dash-backDashBtn");

            function filterMinAdaptive(){

                hideElem (tree);
                hideElem ($$("dashboardInfoContainer"));
                showElem ($$("dashboardTool"));
               // showElem (dashTool);
                showElem (backBtn);
            
                // dashTool.config.width = window.innerWidth-45;
                // dashTool.resize();

                $$("dashboardTool").config.width = window.innerWidth-45;
                $$("dashboardTool").resize();
            }

            function filterMaxAdaptive(){
                if (dashTool.isVisible()){
                    hideElem ($$("dashboardTool"));
                 //   hideElem(dashTool);
                } else {
                    showElem ($$("dashboardTool"));
                    showElem(dashTool);
                }
            }
       
            filterMaxAdaptive();


            if (container.$width < 850){
           
                hideElem(tree);

                if (container.$width  < 850 ){
                    filterMinAdaptive();
                }

            } else {
                hideElem(backBtn);
   
                // if (dashTool.config.width !== 350){
                //     dashTool.config.width  = 350;
                //     dashTool.resize();
                // }

                if ($$("dashboardTool").config.width !== 350){
                    $$("dashboardTool").config.width  = 350;
                    $$("dashboardTool").resize();
                }

                
            }


        }

        const filterBtn = {
            view    : "button", 
            id      : "dashFilterBtn", 
            css     : "webix-transparent-btn",
            type    : "icon",
            icon    : "icon-filter",
            width   : 50,
            click   : function() {
                filterBtnClick();
            },
            on      : {
                onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Показать/скрыть фильтры");
                },
            }
        
            
        };

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

    function createDashInfo(){
        const template  = setHeadlineBlock("dash-template");
        const container = $$("dashboardInfoContainer");

        const dashCharts = {
            id  : "dashboard-charts",
            view: "flexlayout",
            css : "webix_dash-charts-flex",
            rows: dashLayout,
        };

        const content = {
            view        : "scrollview", 
            scroll      : "y",
            id          : "dashBodyScroll",
            borderless  : true, 
            body        : {
                id  : "dashboardBody",
                css : "dashboardBody",
                cols: [
                    dashCharts
                ]
            }
        };

        const inner =  {   
            id  : "dashboardInfoContainerInner",
            rows: [
                template,
                content
            ]
        };

        try{
            container.addView(inner);
        } catch (err){  
            errors_setFunctionError(err,getInfoDashboard_logNameFile,"createDashInfo");
        } 

        setTableName( idsParam );
            
    }
    createDashInfo ();

    createFilterBtn();
}

function updateDash(){

    const inner = $$("dashboardInfoContainerInner");

    const dashCharts = {
        id  : "dashboard-charts",
        view: "flexlayout",
        css : "webix_dash-charts-flex",
        rows: dashLayout,
       
    };
 

    const dashBody = {
        view        : "scrollview", 
        scroll      : "y",
        id          : "dashBodyScroll",
        borderless  : true, 
        body        : {
            id  : "dashboardBody",
            css : "dashboardBody",
            cols: [
                dashCharts
            ]
        }
    };


    try{

       inner.addView(dashBody);
    } catch (err){  
        errors_setFunctionError(err,getInfoDashboard_logNameFile,"updateDash");
    }
}

function getAjax ( url, inputsArray, idsParam, action=false ) {
  
    const getData = webix.ajax().get(url);

    
    getData.then(function(data){
     
        const dataCharts    = data.json().charts;

        removeScroll();
        
        if ( !action ){ //не с помощью кнопки фильтра
            removeItems ();
        }
      
        function addSuccessView (){

            createCharts( dataCharts );

            if (!action){
                getInfoDashboard_createSpace( inputsArray,idsParam );
            } else {
                updateDash();
            }
            
        }

        if (dataCharts == undefined){
            addErrorView  ();
            setLogValue   ("error","Ошибка при загрузке данных");
        } else {
            addSuccessView();
        }

        function setScrollHeight(){
            const log    = $$("logLayout");
            const logBth = $$("webix_log-btn");
            
            function setLogHeight(height){
                log.config.height = height;
                log.resize();
            }

            try{
                if ( logBth.config.icon == "icon-eye" ){
                    setLogHeight(90);
                    setLogHeight(5);
                } else {
                    setLogHeight(5);
                    setLogHeight(90);
                }
            } catch (err){  
                errors_setFunctionError(err,getInfoDashboard_logNameFile,"setScrollHeight");
            }
        }

        setScrollHeight();

        if ( url.includes("?") || url.includes("sdt") && url.includes("edt") ){
            setLogValue("success", "Данные обновлены");
        } 
      
    });
   
    getData.fail(function(err){
        setAjaxError(err, getInfoDashboard_logNameFile,"getAjax");
    });
    
}

async function getFieldsData ( idsParam ){
    
    if (!STORAGE.fields){
        await getData("fields"); 
    }

    function createDashSpace (){
     
        let findAction;
        let singleItemContent;
        let fields = STORAGE.fields.content;
        let inputsArray= [];

        function setAdaptiveWidth(elem){
            const child       = elem.getNode().firstElementChild;
            child.style.width = elem.$width+"px";

            const inp         = elem.getInputNode();
            inp.style.width   = elem.$width-5+"px";
        }
     
        function createFilterElems (inputs,el){
           
            function createDate(type,input){
                const dateTemplate = {
                    view        : "datepicker",
                    format      : "%d.%m.%y",
                    editable    : true,
                    value       : new Date(),
                    placeholder : input.label,
                    height      : 48,
                    on          : {
                        onAfterRender : function () {
                            this.getInputNode().setAttribute("title",input.comment);
   
                           setAdaptiveWidth(this);
                        },
                    }
                };

                if (type == "first"){
                    const dateFirst = dateTemplate;
                    dateFirst.id    = "dashDatepicker_"+"sdt";
                    return dateFirst;
                } else if (type == "last"){
                    const dateLast  = dateTemplate;
                    dateLast.id     = "dashDatepicker_"+"edt";
                    return dateLast;
                }

            }

            function createTime (type){
                let timeTemplate =  {   
                    view        : "datepicker",
                    format      : "%H:%i:%s",
                    placeholder : "Время",
                    height      : 48,
                    editable    : true,
                    value       : "00:00:00",
                    type        : "time",
                    seconds     : true,
                    suggest     : {

                        type    : "timeboard",
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
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title","Часы, минуты, секунды");
                            setAdaptiveWidth(this);
                        },
                    }
                };


                if (type == "first"){
                    const timeFirst = timeTemplate;
                    timeFirst.id    = "dashDatepicker_"+"sdt"+"-time";
                    return timeFirst;
                } else if (type == "last"){
                    const timeLast = timeTemplate;
                    timeLast.id    = "dashDatepicker_"+"edt"+"-time"; 
                    return timeLast;
                }
            }

            function createBtn (input, i){

                function clickBtn(){
                    const dateArray     = [];
                    const compareDates  = [];

                    let sdtDate         = "";
                    let edtDate         = "";
                    let validateEmpty   = true;

                    function enumerationElements(el){
                   
                        const childs         = $$(el.id).getChildViews();
                        const postformatTime = webix.Date.dateToStr("%H:%i:%s");

                        childs.forEach(function(elem,i){

                            function createTime(type){
                                const value = $$(elem.config.id).getValue();
                          
                                try{
                                    if (value !==null ){

                                        if (type == "sdt"){
                                            sdtDate = sdtDate.concat( " " + postformatTime(value) );
                                        } else if (type == "edt"){
                                            edtDate = edtDate.concat( " " + postformatTime(value) );
                                        }
                                
                                    } else {
                                        validateEmpty = false;
                                    }
                                } catch (err){  
                                    errors_setFunctionError(err,getInfoDashboard_logNameFile,"createTime");
                                }
                            }

                            function createDate(type){
                                try{
                                    if ( $$(elem.config.id).getValue() !== null ){

                                        const value          = $$(elem.config.id).getValue();
                                        const postFormatData = webix.Date.dateToStr("%d.%m.%y");

                                        if (type == "sdt"){
                                            sdtDate = postFormatData(value); 
                                        } else if ( type ==  "edt"){
                                            edtDate = postFormatData(value);
                                        }
                                    
                                    } else {
                                        validateEmpty=false;
                                    }
                                } catch (err){  
                                    errors_setFunctionError(err,getInfoDashboard_logNameFile,"createDate");
                                }
                            }
                            
                            if (elem.config.id.includes("sdt")){

                                if (elem.config.id.includes("time")){
                                    createTime("sdt");
                                } else {
                                    createDate("sdt");
                                }
                            } else if (elem.config.id.includes("edt")){
                            
                                if (elem.config.id.includes("time")){
                                    createTime("edt");
                                } else {
                                    createDate("edt");
                                }
                            
                                
                            }
                        });
                   
                    }

                    function setInputs(){
                        try{
                            inputsArray.forEach(function(el,i){
                                if ( el.id.includes("container") ){
                                    enumerationElements(el);
                                }
                            });
                        } catch (err){  
                            errors_setFunctionError(err,getInfoDashboard_logNameFile,"setInputs");
                        }
                    }

                    function createQuery(){
                        dateArray.push( "sdt" + "=" + sdtDate );
                        dateArray.push( "edt" + "=" + edtDate );
                     
                        compareDates.push( sdtDate ); 
                        compareDates.push( edtDate );
                    }

                    function getDataInputs(){
                        setInputs   ();
                        createQuery ();
                    }

                    function sentQuery (){

                        function removeCharts(){
                            try{
                                const charts = $$("dashboard-charts");
                                const body   = $$("dashboardBody");
                      
                                if (charts){
                                    body.removeView(charts);
                                }
                            } catch (err){  
                                errors_setFunctionError(err,getInfoDashboard_logNameFile,"removeCharts");
                            }
                        }

                        function setStateBtn(){
                            try{
                                const btn = $$("dashBtn"+i);
                                btn.disable();
                                setInterval(function () {
                                    btn.enable();
                                }, 1000);
                            } catch (err){  
                                errors_setFunctionError(err,getInfoDashboard_logNameFile,"setStateBtn");
                            }
                        }

                        if (validateEmpty){

                            const compareFormatData = webix.Date.dateToStr ("%Y/%m/%d %H:%i:%s");
                            const start             = compareFormatData    (compareDates[0]);
                            const end               = compareFormatData    (compareDates[1]);

                            const compareValue      = webix.filters.date.greater(start,end);
                            
                            if ( !(compareValue) || compareDates[0] == compareDates[1] ){

                                const getUrl = findAction.url+"?"+dateArray.join("&");
                                removeCharts();
                                getAjax(getUrl, inputsArray,idsParam, true);
                                setStateBtn();

                            } else {
                                setLogValue("error", "Начало периода больше, чем конец");
                            }
                        } else {
                            setLogValue("error", "Не все поля заполнены");
                        }
                    }
            
                    getDataInputs();
                    sentQuery ();
                }


                

                const btnFilter = {   
                    rows: [
                        { height:10 },
                        {   view        :"button", 
                            css         :"webix_primary", 
                            id          :"dashBtn"+i,
                            inputHeight :48,
                            height      :48, 
                            minWidth    :100,
                            maxWidth    :200,
                            value       :input.label,
                            click       :function () {
                                clickBtn();
                            },
                            on          : {
                                onAfterRender: function () {
                                    this.getInputNode().setAttribute("title",input.comment);
                                    setAdaptiveWidth(this);
                                },
                            },

                        },
                        {}
                    ]
                };

                return  btnFilter;
            }

            function createHead(text){
                return {   
                    template:text,
                    height:30, 
                    borderless:true,
                    css:"webix_template-datepicker"
                };
            }
            
            function createFilter (el){

        
         
                Object.values(inputs).forEach(function(input,i){
                    function createInputs(){

                        const inputs = {   
                            width   : 200,
                            id      : "datepicker-container"+"sdt",
                            rows    : [ 

                                createHead ( "Начиная с:"  ),
                                createDate ( "first",input ),

                                { height:10 },

                                createTime ("first"),


                                { height:20 },


                                createHead ( "Заканчивая:" ),
                                createDate ( "last", input ),

                                { height:10 },

                                createTime ("last"),

                            ]
                        };
                 
                        try{
                            inputsArray.push( inputs );
                        } catch (err){  
                            errors_setFunctionError(err,getInfoDashboard_logNameFile,"createInputs");
                        }
                    }

                    if (input.type == "datetime"&& input.order == 3){ //-------------- order
                        let key = Object.keys(inputs)[i]; // заменены на sdt и edt
                        createInputs();

                    } else if (input.type == "submit"){

                        const actionType    = input.action;
                        findAction          = el.actions[actionType];
                    
                        inputsArray.push(
                            createBtn (input, i)
                        );

                    }


                });
            }

            createFilter (el);

            return inputsArray;
          
        }
 
        function autorefresh (el) {
            if (el.autorefresh){

                const userprefsOther = webix.storage.local.get("userprefsOtherForm");
                const counter        = userprefsOther.autorefCounterOpt;

                const url            = singleItemContent.actions.submit.url;

                try{
                    if ( counter !== undefined ){

                        if ( counter >= 15000 ){
                            setInterval(function(){
                                getAjax(url, inputsArray, idsParam);
                            },  counter );
            
                        } else {
                            setInterval(function(){
                                getAjax(url, inputsArray, idsParam);
                            }, 50000);
                        }
                    }

                } catch (err){  
                    errors_setFunctionError(err,getInfoDashboard_logNameFile,"autorefresh");
                }
            }
        }


        const itemTreeId = getDashId(idsParam);
        const fieldsVals = Object.values(fields);
        
        fieldsVals.forEach(function(el,i){

            const fieldId = Object.keys(fields)[i];

            if (el.type == "dashboard" && fieldId == itemTreeId) {
      
                const url    = el.actions.submit.url;
                const inputs = createFilterElems (el.inputs,el);

                getAjax(url, inputs,idsParam);
                autorefresh (el);  
            }
        });
    }

    if (STORAGE.fields){
        createDashSpace ();
    }

}



function getInfoDashboard ( idsParam ){

    removeScroll();

    if(!($$("dashBodyScroll"))){
        getFieldsData (idsParam);
    }  
    
}


;// CONCATENATED MODULE: ./src/js/blocks/routerConfig/tree.js





//import {getInfoTable,getInfoDashboard} from "../content.js";






const tree_logNameFile = "router => tree";

function treeRouter(id){

    function notFoundPopup(){

        const popupHeadline = {   
            template:"Что-то пошло не так...", 
            width:250,
            css:"popup-headline", 
            borderless:true, 
            height:20 
        };
        const btnClosePopup = {
            view:"button",
            id:"buttonClosePopup",
            css:"popup_close-btn",
            type:"icon",
            width:35,
            icon: 'wxi-close',
            click:function(){
                try{
                    const popup = $$("popupNotFound");
                    if (popup){
                        popup.hide();
                    }
                } catch (err){
                    errors_setFunctionError(err,tree_logNameFile,"btnClosePopup click");
                }
            
            }
        };
    
        const popupSubtitle = {   
            template:"Страница не найдена",
            css:"webix_template-not-found-descr", 
            borderless:true, 
            height:35 
        };
    
        const mainBtnPopup = {
            view:"button",
            css:"webix_btn-not-found-back",
            height:46,
            value:"Вернуться на главную",
            click:function(){
                function destructPopup(){
                    try{
                        if ($$("popupNotFound")){
                            $$("popupNotFound").destructor();
                        }
                    } catch (err){
                        errors_setFunctionError(err,tree_logNameFile,"mainBtnPopup click destructPopup");
                    }
                }
                function navigate(){
                    try{
                        Backbone.history.navigate("content", { trigger:true});
                        window.location.reload();
                    } catch (err){
                        errors_setFunctionError(err,tree_logNameFile,"mainBtnPopup click navigate");
                    }
                }
                destructPopup();
                navigate();
             
           
            }
        };
    
        webix.ui({
            view:"popup",
            id:"popupNotFound",
            css:"webix_popup-prev-href",
            width:340,
            height:125,
            position:"center",
            body:{
                rows:[
                {rows: [ 
                    { cols:[
                        popupHeadline,
                        {},
                        btnClosePopup,
                    ]},
                    popupSubtitle,
                    mainBtnPopup,
                    {height:20}
                ]}]
                
            },
    
        }).show();
    }

    function showNotFoundPopup (){
        try{
            setTimeout(function(){
                notFoundPopup();
            }, 1500);
        } catch (err){
            errors_setFunctionError(err,tree_logNameFile,"showNotFoundPopup");
        }
    }
    
    function showTableData (){
        let fieldsData;
        let checkFound = false;
        fieldsData = STORAGE.fields.content;
    
        function showElem(idElem){
            try{
                const elem = $$(idElem);
                if (elem){
                    elem.show();
                }
            } catch (err){
                errors_setFunctionError(err,tree_logNameFile,"showTableData (element: "+idElem+")");
            }
        }
    


        function createElem(){
            try{
                Object.values(fieldsData).forEach(function(field,i){
                
                    if (Object.keys(fieldsData)[i] == id){
                        checkFound=true;
                        
                        if (field.type == "dbtable" || 
                            field.type == "tform"   || 
                            field.type == "dashboard"){
                        
                               // console.log(webix.storage.local.get("visibleColsPrefs_"+"hattrs"),'SSSS')
                                hideElem($$("webix__none-content"));
    
                            if (field.type == "dbtable"){
                                showElem("tables");
                                getInfoTable ("table", id);
               
                      
                                
                            } else if (field.type == "tform"){
                                showElem("forms");
                                getInfoTable ("table-view", id);
                                // const idField = $$("table-view").config.idTable;
                                // const storageData = webix.storage.local.get("visibleColsPrefs_"+idField);
                                // getUserPrefs("table-view",storageData)
    
                            } else if (field.type == "dashboard"){
                                showElem("dashboards");
                                getInfoDashboard(id);
                            }
                            
                        } 
                    }
                });
            } catch (err){
                errors_setFunctionError(err,tree_logNameFile,"createElem");
            }
        }
        createElem();


    
        if (!checkFound){
            showNotFoundPopup ();
        }
    }
    
    function setTableName (){
        
        if ($$("table-templateHeadline")){
            const headline = $$("table-templateHeadline");
            try{
                STORAGE.tableNames.forEach(function(el,i){
                    if (el.id == id){
                        if(headline){
                            headline.setValues(el.name);
                        }
                    }
                    
                });
            } catch (err){
                errors_setFunctionError(err,tree_logNameFile,"setTableName");
            }
        } 
        
        if ($$("table-view-templateHeadline")){
            const headline = $$("table-view-templateHeadline");
            try{
                STORAGE.tableNames.forEach(function(el,i){
                    if (el.id == id){
                        if(headline){
                            headline.setValues(el.name);
                        }
                    
                    }
                    
                });
            } catch (err){
                errors_setFunctionError(err,tree_logNameFile,"setTableName element table-view-templateHeadline");
            }
        }
    }
    
    async function getTableData (){
        
      
    
        if (!STORAGE.fields){
            await getData("fields"); 
        }
     
        if (STORAGE.fields){
            showTableData ();
            setTableName ();


        }
    }
    
    async function createTable (){
        await getWorkspace ();

        try{   
            const tree = $$("tree");
            tree.attachEvent("onAfterLoad", function () {

                function treeselectItem(){
                    const parentId = tree.getParentId(id);
                    tree.open(parentId);
                    tree.select(id);
                }
    
                if (tree.getItem(id)){
                
                    treeselectItem();
                
                } else if (!STORAGE.fields) {
                    getTableData ();
            
                } else if (STORAGE.fields){
                    showTableData ();
                    setTableName ();
                } 
                    
            });
        } catch (err){
            errors_setFunctionError(err,tree_logNameFile,"createTable");
        }
    }
    
    function checkTable(){
        try {
            const tree = $$("tree");
            if (tree.data.order.length == 0){
                createTable ();
                
            }
        } catch (err){
            errors_setFunctionError(err,tree_logNameFile,"checkTable");
    
        }    
      
    }
   
    checkTable();
   
}


;// CONCATENATED MODULE: ./src/js/blocks/routerConfig/index.js




const routerConfig_logNameFile = "router => index";

function indexRouter(){

    function goToContentPage(){
    
        try {
            Backbone.history.navigate("content", { trigger:true});
        } catch (err){
            errors_setFunctionError(err,routerConfig_logNameFile,"goToContentPage");
        }
    }

    function showWorkspace(){
        try{
            const main  = $$("mainLayout");
            const login = $$("userAuth");
            
            if(main){
                (main).hide();
            }

            if(login){
                login.show();
            }
            
        } catch (err){
            window.alert("getAuth: "+err+ " (Подробности: ошибка в отрисовке контента, router:index function showWorkspace)");
            errors_setFunctionError(err,routerConfig_logNameFile,"index => showWorkspace");
        }
    }

    async function getAuth () {
     
        if (!STORAGE.whoami ){
            await getData("whoami"); 
        }


        if (STORAGE.whoami){
            goToContentPage();

        } else {
  
            showWorkspace();
        }
    }
    getAuth ();
    
}

;// CONCATENATED MODULE: ./src/js/blocks/routerConfig/cp.js






const cp_logNameFile = "router => cp";

function showUserAuth(){
    try{
        const elem = $$("user_auth");
        if (elem){
            elem.show();
        }
    } catch (err){
        errors_setFunctionError(err,cp_logNameFile,"showUserAuth");
    }
}
   
function setUserValues(){
    const user     = webix.storage.local.get("user");
    const authName =  $$("authName");
    try{
        if (user){
            authName.setValues(user.name.toString());
        }
    } catch (err){
        errors_setFunctionError(err,cp_logNameFile,"setUserValues");
    }
}

function hideNoneContent(){
    try{
        const elem = $$("webix__none-content");
        if(elem){
            elem.hide();
        }
    } catch (err){
        errors_setFunctionError(err,cp_logNameFile,"hideNoneContent");
    }
}

function removeNullContent(){
    try{
        const elem = $$("webix__null-content");
        if(elem){
            const parent = elem.getParentView();
            parent.removeView(elem);
        }
    } catch (err){
        errors_setFunctionError(err,cp_logNameFile,"removeNoneContent");
    }
}







function cpRouter(){
    
 
 
    checkTreeOrder();


    hideAllElements ();
  
    if($$("user_auth")){
        showUserAuth();
    } else {
    
        createElements("cp");
        showUserAuth();
   
    }
  
    closeTree();
    setUserValues();
    hideNoneContent();

    removeNullContent();
}



;// CONCATENATED MODULE: ./src/js/blocks/routerConfig/userprefs.js




const userprefs_logNameFile = "router => userprefs";

function showUserprefs(){
    try{
        $$("userprefs").show();
    } catch (err){
      
        errors_setFunctionError(err,userprefs_logNameFile,"showUserprefs");
    }
}

function setUserprefsNameValue (){
    let user = webix.storage.local.get("user");
    try{
        if (user){
            $$("userprefsName").setValues(user.name.toString());
        }
    } catch (err){
      
        errors_setFunctionError(err,userprefs_logNameFile,"setUserprefsNameValue");
    }

}

function userprefs_hideNoneContent(){
    try{
        const elem = $$("webix__none-content");
        if(elem){
            elem.hide();
        }
    } catch (err){
        
        errors_setFunctionError(err,userprefs_logNameFile,"hideNoneContent");
    }
}

function getDataUserprefs(){
    const userprefsData = webix.ajax().get("/init/default/api/userprefs/");

    userprefsData.then(function(data){

        data = data.json().content;
    
        function setTemplateValue(){
            try{
                data.forEach(function(el,i){
        
                    if (el.name.includes("userprefs") && 
                        el.name.lastIndexOf("userprefs") == 0){
                        $$(el.name).setValues(JSON.parse(el.prefs));
                    }
                });
            } catch (err){
                errors_setFunctionError(err,userprefs_logNameFile,"getDataUserprefs");
            }
        }

        setTemplateValue();
        
    });

    userprefsData.fail(function(err){
        setAjaxError(err, userprefs_logNameFile,"getDataUserprefs");
    });
}

function userprefs_removeNullContent(){
    try{
        const elem = $$("webix__null-content");
        if(elem){
            const parent = elem.getParentView();
            parent.removeView(elem);
        }
    } catch (err){
        errors_setFunctionError(err,userprefs_logNameFile,"removeNullContent");
    }
}


function userprefsRouter(){

    hideAllElements ();
  
    checkTreeOrder();

    if ($$("userprefs")){
        showUserprefs();
    } else {
        createElements("userprefs");
        getDataUserprefs();
        showUserprefs();

    }

    setUserprefsNameValue ();
    closeTree();
    userprefs_hideNoneContent();

    userprefs_removeNullContent();
}


;// CONCATENATED MODULE: ./src/js/blocks/getContent/getInfoEditTree.js


const getInfoEditTree_logNameFile = "getContent => getInfoEditTree";


function getInfoEditTree() {
    const treeEdit  = $$("treeEdit");
    const url       = "/init/default/api/"+"trees";
    const getData   = webix.ajax().get(url);

    treeEdit.clearAll();

    getData.then(function(data){

        data = data.json().content;
        data[0].pid = 0;
        

        const map = {}, 
            treeStruct = [],
            treeData   = []
        ;
        
        function createTreeItem(el){
            return {
                id    :el.id, 
                value :el.name, 
                pid   :el.pid, 
                data  :[]
            };
        }

        function pushTreeData(){
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
        }

        function createStruct(){
            try{
                treeData.forEach(function(el,i){

                    map[el.id] = i; 

                    if ( el.pid !== 0 && el.pid !== el.id && el.pid !== null ) {
                        treeData[map[el.pid]].data.push(el);
                    } else {
                        treeStruct.push(el);
                    }
                });
            } catch (err) {
                errors_setFunctionError(err,getInfoEditTree_logNameFile,"createStruct")
            }
        }

        pushTreeData();
        createStruct();

        treeEdit.parse(treeStruct);

    });

    getData.fail(function(err){
        setAjaxError(err, "content","getInfoEditTree");
    });

  
}


;// CONCATENATED MODULE: ./src/js/blocks/routerConfig/experimental.js








const experimental_logNameFile = "router => experimental";

function showTreeTempl(){
    try{
        $$("treeTempl").show();
    } catch (err){
        errors_setFunctionError(err,experimental_logNameFile,"showTreeTempl");
    }
}

function experimental_removeNullContent(){
    try{
        const elem = $$("webix__null-content");
        if(elem){
            const parent = elem.getParentView();
            parent.removeView(elem);
        }
    } catch (err){
        errors_setFunctionError(err,experimental_logNameFile,"removeNullContent");
    }
}

function experimentalRouter(){
    experimental_removeNullContent();

    hideAllElements ();
    
    hideElem($$("webix__none-content"));
    
    
    checkTreeOrder();
    
    
    if($$("treeTempl")){
        showTreeTempl ();
        getInfoEditTree();
    }else {
        createElements("treeTempl");
        getInfoEditTree();
        showTreeTempl();
    }
    
    closeTree();
}



;// CONCATENATED MODULE: ./src/js/blocks/routerConfig/logout.js


const logout_logNameFile = "router => logout";

function logoutRouter(){
    const logoutData = webix.ajax().post("/init/default/logout/");

    logoutData.then(function(data){
        function showNoneContent(){
            try{
                const elem = $$("webix__none-content");

                if(elem){
                    elem.show();
                }
            } catch (err){
                errors_setFunctionError(err,logout_logNameFile,"showNoneContent");
            }
        }
        function clearTree (){
            try{
                const tree = $$("tree");

                if( tree){
                    tree.clearAll();
                }
            } catch (err){
                errors_setFunctionError(err,logout_logNameFile,"clearTree");
            }
        }

        function clearStorage(){
            try{
                webix.storage.local.clear();
            } catch (err){
                errors_setFunctionError(err,logout_logNameFile,"clearStorage");
            }
        }

        function backPage(){
            try{
                history.back();
            } catch (err){
                errors_setFunctionError(err,logout_logNameFile,"backPage");
            }
        }

        backPage();
        showNoneContent();
        clearTree ();
        clearStorage();
    
    });

    logoutData.fail(function(err){
        setAjaxError(err, logout_logNameFile,"logoutData");
    });  
}


;// CONCATENATED MODULE: ./src/js/blocks/routerConfig/router.js


lib ();










function router (){
    let routes = new (Backbone.Router.extend({
    
        routes:{
            ""                : "index" ,
            "content"         : "content", 
            "userprefs"       : "userprefs",
            "cp"              : "cp",
            "logout"          : "logout",
            "tree/:id"        : "tree",
            "experimental/:id":"experimental"
        },
        
        content:function(){
            getWorkspace();
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
    
        userprefs: function(){
            userprefsRouter();
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







function createSentObj(){
    const loginData = {};
    const form      = $$("formAuth");
    try{
     
        const userData  = form.getValues();

        loginData.un    = userData.username;
        loginData.np    = userData.password;
        
    } catch (err){
        errors_setFunctionError(err,"login","createSentObj");
    }

    return loginData;
}

function postLoginData(){
    const loginData = createSentObj();
    const form      = $$("formAuth");

    const postData  = webix.ajax().post("/init/default/login",loginData);

    postData.then(function(data){

        if (data.json().err_type == "i"){

            data = data.json().content;
            const userData     = {};


            userData.id        = data.id;
            userData.name      = data.first_name;
            userData.username  = data.username;

            if (form){
                form.clear();
            }

            Backbone.history.navigate("content", { trigger:true});
            window.location.reload();
 
        } else {
            if (form && form.isDirty()){
                form.markInvalid("username", "");
                form.markInvalid("password", "Неверный логин или пароль");
            }
        }

    });

    postData.fail(function(err){
        setAjaxError(err, "login","postLoginData");
    });
}

function getLogin(){

    const form = $$("formAuth");

    form.validate();
    postLoginData();

}

function login () {
  
    router();

    const invalidMsgText = "Поле должно быть заполнено";

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

    const pass =  {   
        view            : "text", 
        label           : "Пароль", 
        name            : "password",
        invalidMessage  : invalidMsgText,
        type            : "password",
        on              : {
            onItemClick:function(){
                $$('formAuth').clearValidation();
            }
        } 
    };

    const btnSubmit = {   
        view    : "button", 
        value   : "Войти", 
        css     : "webix_primary",
        hotkey  : "enter", 
        align   : "center", 
        click   :getLogin
    };

    const form = {
        view        : "form",
        id          : "formAuth",
        width       : 250,
        borderless  : true,
        elements    : [
            login,
            pass,
            btnSubmit, 
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
            setLogValue("success","Не удалось загрузить шрифт иконок", 'expa');
        }


    };

}


;// CONCATENATED MODULE: ./src/js/components/header.js













let userLocation;
let headerContextId;

function header() {
    function collapseClick (){

        function setSearchInputState(visible=false){
            const headerChilds = $$("header").getChildViews();

            headerChilds.forEach(function(el){
                if (el.config.id.includes("search" )      || 
                    el.config.id.includes("log-btn")      || 
                    el.config.id.includes("context-menu") ){
                    if(visible){
                        el.show();
                    } else {
                        el.hide();
                    }
                  
                }
            });
        }
        try {

            if (window.innerWidth > 850 ){
                if ($$("tree").isVisible()){
                  // this.config.icon ="wxi-angle-double-right";
                    this.refresh();
                    $$("tree").hide();
                    if($$("sideMenuResizer")){
                        $$("sideMenuResizer").hide();
                    } 

                } else {
                    $$("tree").show();
                  //  this.config.icon ="wxi-angle-double-left";
                    this.refresh();
                    if(window.innerWidth >= 800){
                        if($$("sideMenuResizer")){
                            $$("sideMenuResizer").show();
                        }
                    } 
                
                    
                }
            } else {
                if ($$("tree").isVisible()){
                   // this.config.icon ="wxi-angle-double-right";
                    this.refresh();
                    $$("tree").hide();
                    if($$("sideMenuResizer")){
                        $$("sideMenuResizer").hide();
                    } 
                    setSearchInputState(true);

                } else {
                    $$("tree").show();
                    $$("tree").config.width = window.innerWidth;
                    $$("tree").resize()
                    
                   // this.config.icon ="wxi-angle-double-left";
                    this.refresh();
                    if(window.innerWidth >= 800){
                        if($$("sideMenuResizer")){
                            $$("sideMenuResizer").show();
                        }
                    } 

                    setSearchInputState();
                }
            }

           
        } catch (error){
            console.log(error);
            catchErrorTemplate("009-000", error);
    
        }
    }

    const header = {
        view: "toolbar", 
        id: "header",
        padding:10,
        css:"webix_header-style",
        elements: [
            {cols:[
                {   
                    view:"button",
                    type:"icon",
                    id:"collapseBtn",
                    icon:"icon-bars",
                    css:"webix_collapse",
                    title:"текст",
                    height:42, 
                    width:40,
                    click:collapseClick,
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title","Видимость бокового меню");
                            checkFonts();
                        }
                    }    
                },
                {
                    view:"label",
                    label:"<img src='/init/static/images/expalogo.png' style='height:30px; margin: 10px;'>", 
                    height:25
               }
            ]},
            
            {},
            {view:"search", 
                placeholder:"Поиск (Shift+F)", 
                css:"searchTable",
                height:42, 
                hotkey :"shift+f",
                maxWidth:250, 
                minWidth:40, 
            },
            {   view:"button",  
                id:"webix_log-btn",
                type:"icon", 
                icon:"icon-eye",
                height:42, 
                badge:0,
                width: 50,
                hotkey :"ctrl+m",
                css:"webix_log-btn",
                click:function (){
         
                    if (this.getValue() == 1){
                        this.setValue(2);
                 
                    } else {
                        this.setValue(1);
                    }
                },
                on: {
                    onAfterRender: function () {
                        this.getInputNode().setAttribute("title","Показать/скрыть системные сообщения (Ctrl+M)");
                    },

                    onChange:function(newValue, oldValue, config){
                        const list      = $$("logBlock-list");
                        const logLayout = $$("logLayout");
                        const logBtn    = $$("webix_log-btn");

                        const lastItemList = list.getLastId();
                        if (newValue == 2){
                            this.config.badge = "";
                            list.showItem(lastItemList);
                        
                            logLayout.config.height = 90;
                        
                            logLayout.resize();
                            this.config.icon ="icon-eye-slash";
                            this.refresh();
                        } else {
                            logLayout.config.height = 5;
                            logLayout.resize();
                            this.config.icon ="icon-eye";
                            this.refresh();
            
                            logBtn.config.badge = "";
                            logBtn.refresh();
                        }
            
                    }
                },
               
            },

            {   view:"button",
                id:"button-context-menu",
                type:"icon",
                disabled:true,
                icon: 'icon-user',
                height:38, 
                width: 50,
                popup: {
                    view: 'contextmenu',
                    id:"contextmenu",
                    css:"webix_contextmenu",
                    data: [],
                    on:{
                        onItemClick:function(id, e, node){
                            function clearTree(){
                                if ($$("tree")){
                                    $$("tree").clearAll();
                                }
                            }

                            function modalBoxTable (navPath){
                                try{
                                    modalBox().then(function(result){
                                        const saveBtn    = $$("table-saveBtn");
                                        if (result == 1){
                                            Backbone.history.navigate(navPath, { trigger:true});
                                            
                                            $$("editTableFormProperty").config.dirty = false;
                                            $$("editTableFormProperty").refresh();
                                            clearTree();
                                        } else if (result == 2){
                                            if ($$("editTableFormProperty") && $$("editTableFormProperty").config.dirty){
                                                if (saveBtn.isVisible()){
                                                    saveItem(false,false,true);
                                                } else {
                                                    saveNewItem(); 
                                                }

                                                $$("editTableFormProperty").config.dirty = false;
                                                $$("editTableFormProperty").refresh();
                                                Backbone.history.navigate(navPath, { trigger:true});
                                                clearTree();
                                            }
                                            
                                        }
                                    });
                                } catch (error){
                                    console.log(error);
                                    catchErrorTemplate("005-000", error);
                                }
                               
                            }

                            function hideContentElements(id){
                                $$("container").getChildViews().forEach(function(el){
                                
                                    if ( el.config.id !== id && $$(el.config.id).isVisible() ){
                                        $$(el.config.id).hide();
                                    }
                                }); 
                            }

                            // function createPath(){
                            //     if (window.location.href.includes("localhost:3000/index.html/")){
                            //         return "/index.html/";
                            //     } else {
                            //         return "/init/default/spaw/";
                            //     }
                            // }
                      
                            try {
                              //  const path = createPath();
                            
                                if (id=="logout"){
                                    if($$("editTableFormProperty") && $$("editTableFormProperty").config.dirty || $$("cp-form") && $$("cp-form").isDirty()){
                                       
                                        
                                        try{
                                            modalBox().then(function(result){
                                                if (result == 1){
                                                    Backbone.history.navigate("logout", { trigger:true});
                                                    
                                                    $$("editTableFormProperty").config.dirty = false;
                                                    $$("editTableFormProperty").refresh();
                                                } else if (result == 2){

                                                    if ($$("cp-form") || $$("editTableFormProperty")){
                                                        if ($$("cp-form") && $$("cp-form").isDirty() && $$("cp-form").validate()){
                                                            let objPass = {op:"",np:""};
                                                            let passData = $$("cp-form").getValues();
                                                            objPass.np = passData.newPass;
                                                            objPass.op = passData.oldPass;
                                                            webix.ajax().post("/init/default/api/cp", objPass, {
                                                                success:function(text, data, XmlHttpRequest){
                                                                    data = data.json()
                                                                    if (data.err_type == "i"){
                                                                        setLogValue("success",data.err);
                                                                    
                                                                    } else if (data.err_type == "e"){
                                                                        setLogValue("error",data.err);
                                                                    }
                                                                },
                                                                error:function(text, data, XmlHttpRequest){
                                                                    ajaxErrorTemplate("011-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                                                                }
                                                            });
                                                            Backbone.history.navigate("logout", { trigger:true});
                                                        
                                                        } else if ($$("editTableFormProperty") && $$("editTableFormProperty").config.dirty){
                                                            if ($$("editTableFormProperty").getValues().id){
                                                                saveItem(false,false,true);
                                                            } else {
                                                                saveNewItem(); 
                                                            }
                                                            
                                                            $$("editTableFormProperty").config.dirty = false;
                                                            $$("editTableFormProperty").refresh();
                                                            Backbone.history.navigate("logout", { trigger:true});
                                                        
                                                        }else {
                                                            setLogValue("error","Заполните пустые поля");
                                                            return false;
                                                        }
                                                    } 
                                                }
                                            });
                                        } catch (error){
                                            console.log(error);
                                            catchErrorTemplate("005-000", error);
                                        }
         
                                        return false;
                                    } else {
                                        Backbone.history.navigate("logout", { trigger:true});
                                       // window.location.replace(logoutPath);
                                    }
                                } else if (id == "cp"){
                                    if ($$("editTableFormProperty") && $$("editTableFormProperty").config.dirty){
                                    modalBoxTable ("cp");
                                    } else {
                                        clearTree();
                                       Backbone.history.navigate("/cp", { trigger:true});
                                        //console.log( window.location.hostname)
                                       
                                       // window.location.replace(path+"cp");
                                    }
                                    hideContentElements("user_auth");
                                } else if (id == "userprefs"){
                                    if ($$("editTableFormProperty") && $$("editTableFormProperty").config.dirty){
                                    modalBoxTable ("userprefs");
                                    } else {
                                        clearTree();
                                       Backbone.history.navigate("/userprefs", { trigger:true});
                                       // window.location.replace("/index.html/userprefs");
                                      
                                      // window.location.replace(path+"userprefs");
                                    }
                                    hideContentElements("userprefs");
                                } else if (id == "favs"){
                                   
                                    favsPopup();
                                }
                            } catch (error){
                                console.log(error);
                                catchErrorTemplate("005-000", error);
                            }
 

                  
                        }
                    }
                },
                on:{
                    onItemClick:function(){
                        try {

                            webix.ajax().get("/init/default/api/userprefs/", {
                                success:function(text, data, XmlHttpRequest){
                                    data = data.json().content;
                                    if (data.err_type == "e"){
                                        setLogValue("error",data.error);
                                    }

                                    if (window.location.pathname !== "/index.html/content" &&  window.location.pathname!=="/init/default/spaw/content"){
                                        
                                        let settingExists = false;
                                        let location = {};
                                        location.href = window.location.href;

                                        let sentObj = {
                                            name:"userLocationHref",
                                            prefs:location
                                        };
                                    
                                        try{
                                            data.forEach(function(el,i){
                                                if (el.name == "userLocationHref"){
                                                    settingExists = true;

                                                    webix.ajax().put("/init/default/api/userprefs/"+el.id, sentObj, {
                                                        success:function(text, data, XmlHttpRequest){
                                                            data = data.json();
                                                            if (data.err_type == "e"){
                                                                setLogValue("error",data.error);
                                                            }
                                                        
                                                        },
                                                        error:function(text, data, XmlHttpRequest){
                                                            ajaxErrorTemplate("005-011",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                                                        }
                                                    }).catch(error => {
                                                        console.log(error);
                                                        ajaxErrorTemplate("005-011",error.status,error.statusText,error.responseURL);
                                                    });
                                                
                                                } 
                                            });
                                        } catch (error){
                                            console.log(error);
                                            catchErrorTemplate("005-000", error);
                                        }


                                        try{
                                            if (!settingExists){
                                
                                                let ownerId = webix.storage.local.get("user").id;
            
                                                if (ownerId){
                                                    sentObj.owner = ownerId;
                                                } else {
                                                    webix.ajax("/init/default/api/whoami",{
                                                        success:function(text, data, XmlHttpRequest){
                                                            
                                                            sentObj.owner = data.json().content.id;
            
                                                            let userData = {};
                                                            userData.id = data.json().content.id;
                                                            userData.name = data.json().content.first_name;
                                                            userData.username = data.json().content.username;
                                                            
                                                            setStorageData("user", JSON.stringify(userData));
                                                        },
                                                        error:function(text, data, XmlHttpRequest){
                                                            ajaxErrorTemplate("005-011",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                                                        }
                                                    }).catch(error => {
                                                        console.log(error);
                                                        ajaxErrorTemplate("005-000",error.status,error.statusText,error.responseURL);
                                                    });
                                                }

                                                webix.ajax().post("/init/default/api/userprefs/",sentObj, {
                                                    success:function(text, data, XmlHttpRequest){
                                                        data = data.json();
                                
                                                        if (data.err_type == "e"){
                                                            setLogValue("error",data.error);
                                                        }
                                                        
                                                    },
                                                    error:function(text, data, XmlHttpRequest){
                                                        ajaxErrorTemplate("005-001",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                                                    }
                                                }).catch(error => {
                                                    console.log(error);
                                                    ajaxErrorTemplate("005-001",error.status,error.statusText,error.responseURL);
                                                });
                                            }
                                        } catch (error){
                                            console.log(error);
                                            catchErrorTemplate("005-000", error);
                                        }
                                    }
                                },
                                error:function(text, data, XmlHttpRequest){
                                    ajaxErrorTemplate("005-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                                }
                            }).catch(error => {
                                console.log(error);
                                ajaxErrorTemplate("005-000",error.status,error.statusText,error.responseURL);
                            });
                        } catch (error){
                            console.log(error);
                            catchErrorTemplate("005-000", error);
                        }
                    }
                }
            },

        ]
    };

    return header;

}


;// CONCATENATED MODULE: ./src/js/components/treeSidabar/common.js
 

function setStateFilterBtn(){
    try{
        const btnClass = document.querySelector(".webix_btn-filter");
        if (btnClass && btnClass.classList.contains ("webix-transparent-btn--primary")){
           
            btnClass.classList.add   ("webix-transparent-btn");
            btnClass.classList.remove("webix-transparent-btn--primary");
        }
    } catch (err){
        errors_setFunctionError(err,"sidebar","setStateFilterBtn");
    }
}


;// CONCATENATED MODULE: ./src/js/components/treeSidabar/onSelectChange.js
 
//import {getInfoTable,getInfoDashboard}              from "../../blocks/content.js";



 









const onSelectChange_logNameFile = "treeSidebar => onSelectChange";

function onSelectChangeFunc(ids){
    const tree          = $$("tree");
    const treeItemId    = tree.getSelectedItem().id;
    const getItemParent = tree.getParentId(treeItemId);
    const treeArray     = tree.data.order;
    let parentsArray    = [];

    function setWidthEditForm(){
        try{
            const editForm = $$("table-editForm");
      
            if (editForm && editForm.config.width < 320){
                editForm.config.width = 320;
                editForm.refresh();
            }
        } catch (err){
            errors_setFunctionError(err,onSelectChange_logNameFile,"setWidthEditForm");
        }
    }

    function hideTreeTempl(){
        try{
            let elem = $$("treeTempl");
            if(elem && !($$(ids)) ){
                elem.hide();
            }
        } catch (err){
            errors_setFunctionError(err,onSelectChange_logNameFile,"hideTreeTempl");
        }
    }


    function getTreeParents(){
        let parents = [];
        try{
            treeArray.forEach(function(el,i){
                if (tree.getParentId(el) == 0){
                    parents.push(el);
                }
            });
        } catch (err){
            errors_setFunctionError(err,onSelectChange_logNameFile,"getTreeParents");
        }
        return parents;
    }

    function hideNoneContent(){
        try{
            if (ids[0] && getItemParent!==0){
                hideElem ($$("webix__none-content"));
            }
        } catch (err){
            errors_setFunctionError(err,onSelectChange_logNameFile,"hideNoneContent");
        }
    }
 
    function setTableName (id){
        try{
           
            const tableHeadline = $$("table-templateHeadline");
            const tableViewHeadline = $$("table-view-templateHeadline");
       
            if (tableHeadline){
                STORAGE.tableNames.forEach(function(el,i){
                    if (el.id == id){
                        tableHeadline.setValues(el.name);
                    }
                });
            } 
            
            if (tableViewHeadline){
                STORAGE.tableNames.forEach(function(el,i){
                    if (el.id == id){
                        tableViewHeadline.setValues(el.name);
                    }
                    
                });
            }
        } catch (err){
            errors_setFunctionError(err,onSelectChange_logNameFile,"setTableName");
        }
    }

    function setSearchInputState(){
        const headerChilds = $$("header").getChildViews();

        headerChilds.forEach(function(el){
            if (el.config.id.includes("search")){
                el.show();
            }
        });
    }
    removeElem  ($$("propertyRefbtnsContainer"));
    hideElem    ($$("tablePropBtnsSpace"));
    hideElem    ($$("editTableFormProperty"));
    
    setSearchInputState();
    
    hideElem    ($$("filterTableBarContainer"));

    showElem    ($$("filterEmptyTempalte"));
    showElem    ($$("EditEmptyTempalte"));

    disableElem ($$("btnFilterSubmit"));
    disableElem ($$("filterLibrarySaveBtn"));
    disableElem ($$("resetFilterBtn"));
    
    setWidthEditForm  ();
    
    setStateFilterBtn ();
    
    hideTreeTempl     ();

    hideNoneContent   ();

    function visibleTreeItem(idsUndefined){

        async function findSingleEl () {
            let single;
            if (!STORAGE.fields){
                await getData("fields"); 
            }

            if (STORAGE.fields){
                let storageData = STORAGE.fields.content;
                single = false;
                    if (storageData[idsUndefined]){
                      
                        single = true;
                        if        (storageData[idsUndefined].type == "dbtable"  ){
                            showElem ($$("tables"));

                        } else if (storageData[idsUndefined].type == "tform"    ){
                            showElem ($$("forms"));

                        } else if (storageData[idsUndefined].type == "dashboard"){
                            showElem ($$("dashboards"));
                        }

                        setTableName (idsUndefined);
                    }
           
            }

            return single;

        }

        function removeNullContent(){
            try{
                let viewEl  = $$("webix__null-content");
                
                if(viewEl){
                    removeElem (viewEl);
                }
            } catch (err){
                errors_setFunctionError(err,onSelectChange_logNameFile,"removeNullContent");
            }
        }  

    
        removeNullContent();
        hideElem ($$("user_auth"));
        hideElem ($$("userprefs"));


        function createUndefinedMsg(){
            $$("container").addView(
            {
                view:"align", 
                align:"middle,center",
                id:"webix__null-content",
                body:{  
                    borderless:true, 
                    template:"Блок в процессе разработки", 
                    height:50, 
                    width:220,
                    css:{"color":"#858585","font-size":"14px!important"}
                }
                
            },
            
            2);
        }
        
        
        function initUndefinedElement(){

            findSingleEl().then(function(response) {
                if (!response){
         
                    hideElem ($$("webix__none-content"));
                     
                    if(!($$("webix__null-content"))){
                        createUndefinedMsg();
                    } 
                }
            });
        }

        parentsArray = getTreeParents();

        function viewSingleElements(){
            parentsArray.forEach(function(el,i){
                let singleAction = $$("tree").getItem(idsUndefined).action; //dashboard
                let treeItemAct  = $$("tree").getItem(el).action;
                if (idsUndefined){
                    initUndefinedElement();
                } 
  
                if (singleAction !== treeItemAct && treeItemAct){
                    if (treeItemAct == "dbtable" || treeItemAct == "all_dbtable"){
                        hideElem ($$("tables"));
                    } else if (treeItemAct == "tform" || treeItemAct == "all_tform"){
                        hideElem ($$("forms"));
                    } else if (treeItemAct == "dashboard" || getItemParent !== "dashboards"){
                        hideElem ($$("dashboards"));
                    }
                }
                            
            }); 
        }

        function viewDefaultElements(){
            try{
                parentsArray.forEach(function(el,i){

                    if (el == getItemParent){
                       
                        if ($$(el)){
                            $$(el).show();

                        } else {
                            if(!($$("webix__null-content"))){
                                createUndefinedMsg();
                            } 
                        }
                    } else if ($$(el) || el=="treeTempl"){
                        
                        if ($$(el)){
                            $$(el).hide();
                        }
                        
                    } else {
                   
                        const treeItemAct  = $$("tree").getItem(el).action;
                       
                        if (treeItemAct == "dbtable" && getItemParent !== "tables"){
                            hideElem ($$("tables"));
                        } else if (treeItemAct == "tform" && getItemParent !== "forms"){
                            hideElem ($$("forms"));
                        } else if (treeItemAct == "dashboard" && getItemParent !== "dashboards"){
                           
                            hideElem ($$("dashboards"));
                        }
                    }     
                    
                }); 
            } catch (err){
                errors_setFunctionError(err,onSelectChange_logNameFile,"viewDefaultElements");
            }
        }

        if(idsUndefined !== undefined){
            viewSingleElements();

        } else {
            viewDefaultElements();

        }

    }


    function selectItemAction(){

        if (       getItemParent == "tables"    ){
            visibleTreeItem();

        } else if( getItemParent == "dashboards"){
            visibleTreeItem(); 

        } else if( getItemParent == "forms"     ){
            hideElem ($$("propTableView"));
            visibleTreeItem();

        } else if ( getItemParent == 0           && 
                    treeItemId   !=="tables"     && 
                    treeItemId   !=="user_auth"  && 
                    treeItemId   !=="dashboards" && 
                    treeItemId   !=="forms"      ){
      
            visibleTreeItem(ids[0]); 
          
        } else if (getItemParent !==0){
            visibleTreeItem(ids[0]); 
        }
    }


    function getInfoSelectElement (){
        if (       getItemParent   == "tables"     ){
            defaultStateForm();
          //  getInfoTable ("table", ids[0]);
            setTableName (treeItemId); 

        } else if (getItemParent   == "dashboards" ){
            getInfoDashboard ();

        } else if (getItemParent   == "forms"      ){
          //  getInfoTable ("table-view", ids[0]);
            setTableName (treeItemId);

        }
    }

    selectItemAction     ();
    getInfoSelectElement ();
}


;// CONCATENATED MODULE: ./src/js/components/treeSidabar/onItemClick.js
 







const onItemClick_logNameFile = "treeSidebar => onItemClick";

function onItemClickFunc(id){
    function getItemId (){
        let idTable;
     
        if ($$("tables").isVisible()){
            idTable = $$("table").config.idTable;

        } else if ($$("forms").isVisible()){

            idTable = $$("table-view").config.idTable;
        }
        return idTable;
    }
    const prop       = $$("editTableFormProperty");
    const valuesProp = prop.getValues();
    const currId     = getItemId ();


    function setDirtyProperty (){
        try{
            prop.config.dirty = false;
            prop.refresh();
        } catch (err){
            errors_setFunctionError(err,onItemClick_logNameFile,"setDirtyProperty");
        }
    }

    function setDefaultStateProperty (){
        try{
            if (prop && prop.isVisible()){
                prop.clear();
                prop.hide();
            }
        } catch (err){
            errors_setFunctionError(err,onItemClick_logNameFile,"setDirtyProperty");
        }
    }

    function setDefaultStateBtns (){
        try{
            const saveNewBtn = $$("table-saveNewBtn");
            const saveBtn    = $$("table-saveBtn");
            const delBtn     = $$("table-delBtnId");
     
            if (saveNewBtn.isVisible()) {
                saveNewBtn.hide();

            } else if (saveBtn.isVisible()){
                saveBtn.hide();
            }

            delBtn.disable();

        } catch (err){
            errors_setFunctionError(err,onItemClick_logNameFile,"setDefaultStateBtns");
        }
    }

    function validateError (){
        try{
            validateProfForm ().forEach(function(el,i){
                let nameEl;

                $$("table").getColumns().forEach(function(col,i){
                    if (col.id == el.nameCol){
                        nameEl = col.label;
                    }
                });

                setLogValue("error",el.textError+" (Поле: "+nameEl+")");
            });
        } catch (err){
            errors_setFunctionError(err,onItemClick_logNameFile,"validateError");
        }
    }

    function uniqueData (itemData){
        let validateData = {};

        function compareVals (i){
            try{
                let oldValues       = $$("table").getItem(itemData.id);
                let oldValueKeys    = Object.keys  (oldValues);

                let newValKey       = Object.keys  (itemData)[i];
                let newVal          = Object.values(itemData)[i];
                
                oldValueKeys.forEach(function(oldValKey){
                    
                    if (oldValKey == newValKey){

                        if (oldValues[oldValKey]  !== newVal){
                            validateData[newValKey] = newVal;
                        } 
                        
                    }
                }); 
            } catch (err){
                errors_setFunctionError(err,onItemClick_logNameFile,"compareVals");
            }
        }

        Object.values(itemData).forEach(function(el,i){         
            compareVals (i);
        });

        return validateData;
    }

    function selectTree(id){
        const tree = $$("tree");
        if (tree){
            tree.select(id);
        }
    }

    function postNewData (){
        if (!(validateProfForm().length)){
            const url       = "/init/default/api/"+currId;
            const postData  = webix.ajax().post(url, valuesProp);

            postData.then(function(data){
                data = data.json();
                if (data.content.id !== null){
                    setDirtyProperty ();
                    removeElem ($$("propertyRefbtnsContainer"));
                    selectTree(id);
                    setLogValue("success","Данные успешно добавлены",currId);
                } else {

                    const errs   = data.content.errors;
                    let msg      = "";
                    Object.values(errs).forEach(function(err,i){
                        msg +=err+" (Поле: "+Object.keys(errs)[i] +"); ";
                    });

                    setLogValue("error",msg);
                }

                if(data.err_type !== "i"){
                    errors_setFunctionError(data.err,"sidebar","onItemClick => postNewData");
                }
            });

            postData.fail(function(err){
                setAjaxError(err, "sidebar","onItemClick => postNewData");
            });

        } else {
            validateError ();
        }
    }

    function putData (){
        if (!(validateProfForm().length)){

            if (valuesProp.id){
                const url= "/init/default/api/"+currId+"/"+valuesProp.id;
                const putValue = uniqueData (valuesProp);
                const putData = webix.ajax().put(url, putValue);

                putData.then(function(data){
                    data = data.json()
                
                    if (data.err_type == "i"){
                        setDirtyProperty ();
                        removeElem ($$("propertyRefbtnsContainer"));
                        selectTree(id);
                        setLogValue("success","Данные успешно добавлены",currId);
                
                    } else {
                        errors_setFunctionError(data.err,"sidebar","onItemClick => putData")
                    }
                });

                putData.fail(function(err){
                    setAjaxError(err, "sidebar","onItemClick => putData");
                });

            }

        } else {
            validateError ();
        }
    }


    function modalBoxTree (){
        const saveBtn    = $$("table-saveBtn");
        modalBox().then(function(result){
            if (result == 1){

                setDefaultStateBtns ();
                setDefaultStateProperty ();
                setDirtyProperty ();

                $$("tree").select(id);
            } else if (result == 2){

                if (saveBtn.isVisible()){
                    putData ();
              
                } else {
                    postNewData ();  
                }
                setDirtyProperty ();
            }

            if (result == 1 || result == 2){
                removeElem ($$("propertyRefbtnsContainer"));
            }

        });
    }
    if(prop.config.dirty){
        modalBoxTree ();
        return false;
    }
    
    setDefaultStateBtns ();
}


;// CONCATENATED MODULE: ./src/js/components/treeSidabar/onBeforeSelect.js
//import {getInfoTable,getInfoDashboard} from "../../blocks/content.js";










const onBeforeSelect_logNameFile = "treeSidebar => onBeforeSelect";

function onBeforeSelectFunc(data){

    const tree          = $$("tree");
    const selectItem    = tree.getItem(data);
    const filterForm    = $$("filterTableForm");
    const inputs        = $$("inputsFilter");

    if (data.includes("q-none_data-tree_") || 
        data.includes("q-load_data-tree_") ||
        selectItem.webix_kids              ){
        return false;
    }
    
    function setFilterDefaultState(){
        try{
            if (filterForm && filterForm.isVisible()){

                filterForm.hide();
                setStateFilterBtn();
            
                showElem ($$("table-editForm"));
            
            }

            if (inputs){
                removeElem (inputs);
            }
        } catch (err){
            errors_setFunctionError(err,onBeforeSelect_logNameFile,"setFilterDefaultState");
        }
    }

    function setBtnCssState(){
        const btnClass          = document.querySelector(".webix_btn-filter");
        const primaryBtnClass   = "webix-transparent-btn--primary";
        const secondaryBtnClass = "webix-transparent-btn";

        if ( btnClass && btnClass.classList.contains(primaryBtnClass) ){

            btnClass.classList.add   (secondaryBtnClass);
            btnClass.classList.remove(primaryBtnClass);
        }
      
    }
    function setFormToolsDefaultState(){
        const formsTools     = $$("formsTools");
        const formsContainer = $$("formsContainer");
  
        hideElem (formsTools);
        showElem (formsContainer);

    }

    function adaptiveViewEditTable(){

        const container = $$("tableContainer");
        const tables    = $$("tables");
        
        hideElem  ($$("editTableBarContainer"));
        hideElem  ($$("table-backTableBtn"));
        hideElem  ($$("table-editForm"));
        showElem  ($$("tableContainer"));

        if(tables.$width - container.$width > 9){
           // $$("flexlayoutTable").config.width = tables.$width - 9;
            $$("tableContainer").resize();
            //tables.resize();
        }

    }

    function adaptiveViewDashFilter(){
        const dashTool      = $$("dashboardTool");
        const dashContainer = $$("dashboardInfoContainer");

        hideElem (dashTool);
        showElem (dashContainer);
    }

    function disableVisibleBtn(){
        const viewBtn =  $$("table-view-visibleCols");
        const btn     =  $$("table-visibleCols");
        
        function disableBtn(el){
            if (el){
                el.disable();
            }
        }

        if ( viewBtn.isVisible() ){
            disableBtn(viewBtn);
        } else if ( btn.isVisible() ){
            disableBtn(btn);
        }
      
    }

    setBtnCssState();
    setFilterDefaultState();

    hideElem   ($$("editTableFormProperty"));

    setFormToolsDefaultState();

    adaptiveViewDashFilter();

    adaptiveViewEditTable();

    disableVisibleBtn();

    async function getSingleTreeItem() {

        if (!STORAGE.fields){
            await getData("fields"); 
        }
      
        const content   = STORAGE.fields.content;
        const obj       = Object.keys(content); 

    
        function generateItem (){
            try{
                obj.forEach(function(el) {
                    if (el == data){ 
                        hideElem ($$("webix__none-content"));
                        removeElem ($$("webix__null-content"));

                        if (content[el].type == "dbtable"){
                            showElem ($$("tables"));
                            getInfoTable ("table", data);
                            
                        } else if (content[el].type == "tform"){
                            showElem ($$("forms"));
                            getInfoTable ("table-view", data);

                        } else if (content[el].type == "dashboard"){
                            showElem ($$("dashboards"));
                            getInfoDashboard(data);
                            
                        }
    
                    }
                });
            } catch (err){
                errors_setFunctionError(err,onBeforeSelect_logNameFile,"generateItem");
            }
        }

        generateItem ();
        
    }
    getSingleTreeItem() ;

    
}


;// CONCATENATED MODULE: ./src/js/components/treeSidabar/onBeforeOpen.js




const onBeforeOpen_logNameFile = "treeSidebar => onBeforeOpen";

function onBeforeOpenFunc(id){
    const tree          = $$("tree");
    const selectedItem  = $$("tree").getItem(id);
    const idLoadElement = "q-load_data-tree_"+ webix.uid();
    const idNoneElement = "q-none_data-tree_"+ webix.uid();

    function createLoadEl(){
        tree.data.add({
            id      :idLoadElement,
            disabled:true,
            value   :"Загрузка ..."
        }, 0, id );  
        
        tree.addCss(idLoadElement, "tree_load-items");
    }

    function createNoneEl(){
        tree.data.add({
            id      :idNoneElement,
            disabled:true,
            value   :"Раздел пуст"
        }, 0, id );  
    }

    async function getMenuChilds() {

        if (!STORAGE.fields){
            await getData("fields"); 
      
        }

        const content   = STORAGE.fields.content;
        const obj       = Object.keys(content); 

        function findNotUniqueItem (data){
            let check = false;
            try{
                STORAGE.mmenu.mmenu.forEach(function(el,i){
                    if (el.name == data){
                        check = true;
                        
                    }
                });
            } catch (err){
                errors_setFunctionError(err,onBeforeOpen_logNameFile,"findNotUniqueItem");
            }
            return check;
        }

        function removeTreeEls(noneEl=false){
            try{
                if( tree.exists(idLoadElement)){
                    tree.remove(idLoadElement);
                }
                if( tree.exists(idNoneElement) && noneEl){
                    tree.remove(idNoneElement);
                }
            } catch (err){
                errors_setFunctionError(err,onBeforeOpen_logNameFile,"removeTreeEls");
            }
        }

        function generateMenuData (typeChild){
            let itemsExists = false;
            try{
            
                obj.forEach(function(data) {
                   
                    if (content[data].type == typeChild && !findNotUniqueItem(data)){ 
             
                        tree.data.add({
                                id:data, 
                                value:(content[data].plural) ? 
                                content[data].plural         : 
                                content[data].singular       , 
                                "type":content[data].type
                        }, 0, id ); 

                        if (!itemsExists){
                            itemsExists = true;
                        }
                       
                        removeTreeEls(true);
                
                    } 


                });

                if (!itemsExists){
                    removeTreeEls();
                    if( !(tree.exists(idNoneElement)) ){
                        createNoneEl();
                        tree.addCss(idNoneElement, "tree_none-items");
                    }
                }
            } catch (err){
                errors_setFunctionError(err,onBeforeOpen_logNameFile,"generateMenuData");
            }
    
        }



        if (selectedItem.action.includes("all_")){
            const index = selectedItem.action.indexOf("_");
            const type  = selectedItem.action.slice(index+1);
            generateMenuData (type);
        }
    
        
    }

    if ($$("tree").getItem(id).$count===-1){
     
        createLoadEl();
        getMenuChilds();
      
    }
}


;// CONCATENATED MODULE: ./src/js/components/treeSidabar/onAfterSelect.js




function onAfterSelectFunc(id){
    
    async function getFields (){
        if (!STORAGE.mmenu){
            await getData("fields"); 
        }

        if (STORAGE.fields){
            try{
                Backbone.history.navigate("tree/"+id, { trigger:true });
            } catch (err){
                errors_setFunctionError(err,"treeSidebar => onAfterSelect","getFields");
            }
        }
    }
    function setAdaptiveState(){
        try{
            if (window.innerWidth < 850 ){
                $$("tree").hide();
            }
        } catch (err){
            errors_setFunctionError(err,"treeSidebar => onAfterSelect","setAdaptiveState");
        }
    }

    getFields ();
    setAdaptiveState();
}


;// CONCATENATED MODULE: ./src/js/components/treeSidabar/layout.js
 

 
 
 
 
 


function treeSidebar () {
    const tree = {
        view        :"edittree",
        id          :"tree",
        css         :"webix_tree-main",
        minWidth    :100,
        width       : 250,
        editable    :false,
        select      :true,
        editor      :"text",
        editValue   :"value",
        activeTitle :true,
        clipboard   : true,
        data        :[],
        on          :{
            
            onSelectChange:function (ids) {
                onSelectChangeFunc(ids);
            },

            onItemClick:function(id){
                return onItemClickFunc(id);
            },

            onBeforeSelect: function(data) {
                onBeforeSelectFunc(data);
            },

            onLoadError:function(xhr){
                setAjaxError(xhr, "sidebar","onLoadError");
            },

            onBeforeOpen:function (id){
                onBeforeOpenFunc(id);
            },

            onAfterSelect:function(id){
                onAfterSelectFunc(id);
            }
        },

    };

    return tree;
}


;// CONCATENATED MODULE: ./src/js/blocks/logout/autoLogout.js



function resetTimer (){

    let t;
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer;      
    window.ontouchstart = resetTimer;
    window.onclick = resetTimer;     
    window.onkeypress = resetTimer;   
    window.addEventListener('scroll', resetTimer, true); 

    function resetTimer() {
        try {
            if (window.location.pathname !== "/index.html"        && 
                window.location.pathname !== "/"                  && 
                window.location.pathname !== "/init/default/spaw" ){
                
                clearTimeout(t);
                t = setTimeout(logout, 600000); // 600000
            }
        } catch (err){
            errors_setFunctionError(err,"autoLogout","resetTimer");
        }
    }
    
}



;// CONCATENATED MODULE: ./src/js/blocks/adaptive.js






function resizeSidebar(){
    const tree = $$("tree");

    function resizeTree(){
        try{
            if (tree){
                tree.config.width = 250;
                tree.resize();
            }
        } catch (err){
            errors_setFunctionError(err,"adaptive","resizeSidebar => resizeTree");
        }
    } 

    
    if (window.innerWidth < 850){
        hideElem(tree);
    }

    if (!tree.isVisible()  && 
        window.innerWidth <= 800 ){
        hideElem($$("sideMenuResizer"));
    }

    if (window.innerWidth > 850 && $$("tree")){
        resizeTree();
    }
    
}

function resizeForms(){

    const tools       = $$("formsTools");    
    const сontainer   = $$("formsContainer");
    const formResizer = $$("formsTools-resizer");
    const backBtn     = $$("table-backFormsBtnFilter");
  
    function createFormAdaptive(){
        
        if (tools.isVisible()){
            tools.config.width = window.innerWidth - 45;
            tools.resize();

            hideElem (сontainer  );
            hideElem (formResizer);
            hideElem ($$("tree") );
            showElem (backBtn    );
          
        }
    }

    function createFormMain(){
        if (tools.isVisible()          && 
            tools.config.width !== 350 ){

            tools.config.width = 350;
            tools.resize();
            showElem (formResizer);
            showElem (сontainer  );
            hideElem (backBtn    );
        }
    }
 
    if (window.innerWidth < 850){
        createFormAdaptive();
    }


    if (window.innerWidth > 850){
        createFormMain();
    }

  
}



function resizeDashboards(){
    const dashTool      = $$("dashboardTool");
    const dashContainer = $$("dashboardInfoContainer");
    const tree          = $$("tree");
    const backBtn       = $$("dash-backDashBtn");
   
    function createDashAdaptive(){
        
        if (dashTool.isVisible()){
            dashTool.config.width = window.innerWidth-45;
            dashTool.resize();

            hideElem (dashContainer);
            hideElem (tree         );
            showElem (backBtn      );
        }
    }


    function createDashMain(){
        if (dashTool.isVisible()          && 
            dashTool.config.width !== 350 ){

            dashTool.config.width = 350;
            dashTool.resize();

            $$("dashboardTool").config.width = 350;
            $$("dashboardTool").resize();

            showElem (dashContainer);
            hideElem (backBtn      );
        }
     
    }
    
    if (window.innerWidth < 850){
        createDashAdaptive();
    }


    if (window.innerWidth > 850){
   
        createDashMain();
    }
            
}



function resizeTableEditForm(){
    const container = $$("tableContainer");
    const editForm  = $$("table-editForm");
    const backBtn   = $$("table-backTableBtn");
    const tree      = $$("tree");

    function tableAdaptiveView(){

        if (editForm.isVisible()){
            editForm.config.width = window.innerWidth-45;
            editForm.resize();

            hideElem (container);
            hideElem (tree);
            showElem (backBtn);
        }
    }

    function tableMainView(){

        if (editForm.isVisible()          && 
            editForm.config.width !== 350 ){

            editForm.config.width = 350;
            editForm.resize();

            showElem (container);
            hideElem (backBtn);
        }

    }

    
    if ($$("container").$width < 850 && editForm.isVisible()){
        hideElem (tree);
    }


    if (window.innerWidth < 850){
        tableAdaptiveView();
    }

    if (window.innerWidth > 850){
        tableMainView();
    }

}

function resizeTableFilterForm (){

    const filterForm = $$("filterTableBarContainer");
    
    const container  = $$("tableContainer");
    const backBtn    = $$("table-backTableBtnFilter");
    const tree       = $$("tree");

    function filterAdaptive(){
        if (filterForm.isVisible()){
            filterForm.config.width = window.innerWidth-45;
            filterForm.resize();
 
            hideElem (container);
            hideElem (tree     );
            showElem (backBtn  );

        }
    }

    function filterMain(){
        if (filterForm.isVisible()          && 
            filterForm.config.width !== 350 ){

        filterForm.config.width = 350;
        filterForm.resize();

        showElem (container);
        hideElem (backBtn  );
    }
    }
   
    if (window.innerWidth < 850){
        filterAdaptive();
    }

    if ($$("container").$width < 850 && filterForm.isVisible()){
        hideElem (tree);
    }


    if (window.innerWidth > 850){
        filterMain();
    }

}

function setSearchInputState(){
    const headerChilds = $$("header").getChildViews();

    headerChilds.forEach(function(el){
        if (el.config.id.includes("search")){
            el.show();
        }
    });
}


function resizeTableCols(){
    
}



function resizeAdaptive (){

    window.addEventListener('resize', function(event) {
  
        async function getActiveView (){  

            if (!STORAGE.mmenu){
                await getData("mmenu"); 
            }

            function setAdaptiveLogic(visibleEl){
                if (visibleEl == "forms"){
                    resizeForms();

                } else if (visibleEl == "dashboards"){
                    resizeDashboards();

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
                if (STORAGE.mmenu){
                    const menuData = STORAGE.mmenu.mmenu;
                    menuData.forEach(function(el,i){
                        if($$(el.name) && $$(el.name).isVisible()){
                            let visibleEl = el.name;
                            setAdaptiveLogic(visibleEl);
                        }
                    });
                    
                }
            }

            initLogic();
        
        }
    
        getActiveView ();
        resizeSidebar();

        if(window.innerWidth > 850){
            setSearchInputState();
        }

    }, true);
}



function adaptivePoints (){

    const tree = $$("tree");

    function hideTree(){
        if (window.innerWidth < 850 && tree){
            tree.hide();
        }
    }

    function addTreeEvent(){
        if (window.innerWidth < 1200 ){
            const editContainer = $$("editTableBarContainer");

            tree.attachEvent("onAfterLoad", function(){
                hideElem(editContainer);
            });
 
            hideElem(editContainer);

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



;// CONCATENATED MODULE: ./src/js/blocks/routerConfig/routerStart.js
function setRouterStart(){
    if (window.location.host.includes("localhost:3000")){
        Backbone.history.start({pushState: true, root: '/index.html/'});
    } else {
        Backbone.history.start({pushState: true, root: '/init/default/spaw/'});
    }
}


;// CONCATENATED MODULE: ./src/js/app.js
console.log("expa 1.0.49"); 


















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

const container = {   
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
                    header(),
                    adaptive,
                
                    {cols : [
                        treeSidebar(), 
                        sideMenuResizer,
                        container,
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