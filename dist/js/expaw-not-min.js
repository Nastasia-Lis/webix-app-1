/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/blocks/getServerData.js
///////////////////////////////
//
// Обёртка для ajax запросов 
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////





const logNameFile = "getServerData";


function isErrorsExists(data, errorActions){
    const type = data.err_type;
    const err  = data.err;

    if (type && err){

        if (type !== "i"){

            if (errorActions){
                errorActions();
            }
           
       

            errors_setFunctionError(
                err, 
                "getServerData", 
                "checkErrors"
            );

            return true;
        }

    }
}

class ServerData {
    constructor (options){
        this.id            = options.id;
        this.isFullPath    = options.isFullPath;
        this.errorActions  = options.errorActions;
    }

    returnPath(){

        const path = `/init/default/api/${this.id}`;
     
        return this.isFullPath ? this.id : path;
    }

    validate(data){
        if (data){
            data = data.json();

            if (isErrorsExists(data, this.errorActions)){
                return false;
            } else {
                return data;
            }
         
        } else {
            return false;
        }
    }

    get(){
        const self = this;
     
        if (self.id){
        
            const path = self.returnPath();
       
             
            return webix.ajax().get(path)
            .then(function(data){
                return self.validate(data);
            })
    
            .fail(function (err){
                if (self.errorActions){
                    self.errorActions();
                }
               
    
                setAjaxError(
                    err, 
                    logNameFile, 
                    "get server data"
                );
            });   
        }  
    }

    put(sentObj){
        const self = this;

        if (self.id){
        
            const path = self.returnPath();
    
            return webix.ajax().put(path, sentObj)
            .then(function(data){
                return self.validate(data);
            })

    
            .fail(function (err){
                if (self.errorActions){
                    self.errorActions();
                }
               
    
                setAjaxError(
                    err, 
                    logNameFile, 
                    "put server data"
                );
            });   
        }  
    }

    post(sentObj){
        const self = this;

        if (self.id){
        
            const path = self.returnPath();
    
            return webix.ajax().post(path, sentObj)
            .then(function(data){
                return self.validate(data);
            })

    
            .fail(function (err){
                if (self.errorActions){
                    self.errorActions();
                }
               
    
                setAjaxError(
                    err, 
                    logNameFile, 
                    "post server data"
                );
            });   
        }  
    }

    del(delObj){
        const self = this;

        if (self.id){
        
            const path = self.returnPath();
    
            return webix.ajax().del(path, delObj)
            .then(function(data){
                return self.validate(data);
            })

    
            .fail(function (err){
                if (self.errorActions){
                    self.errorActions();
                }
               
    
                setAjaxError(
                    err, 
                    logNameFile, 
                    "del server data"
                );
            });   
        }  
    }

}

//example


// new ServerData({
    
//     id           : url,
//     isFullPath   : true,
//     errorActions : errorActions
   
// }).get().then(function(data){

//     if (data){

//         const content = data.content;

//         if (content){


//         }
//     }
     
// });

 

;// CONCATENATED MODULE: ./src/js/components/logout.js
///////////////////////////////
//
// Auto logout          (create auto logout)
//
// Общая логика logout  (create logout)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////





//create auto logout
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

                const time = 600000;
                timeout = setTimeout(logout, time); // 600000
            }
        } catch (err){
            errors_setFunctionError(err, "autoLogout", "resetTimer");
        }
    }
    
}



//create logout
async function logout() {

    Backbone.history.navigate("logout?auto=true", { trigger:true});
  
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

    }

    return notAuth;
}


;// CONCATENATED MODULE: ./src/js/blocks/globalStorage.js
///////////////////////////////
//
// Хранилище для fields 
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////




const STORAGE = {};


function getTableNames (content){
    let tableNames = [];

    if (content && content.length){
        const values = Object.values(content);
    
        values.forEach(function(el,i){
            tableNames.push({
                id:Object.keys(content)[i], 
                name:(el.plural) ? el.plural : el.singular
            });
        });
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
        if (this.fields && this.fields.content){
            return this.fields.content[key];
        } 
    }

    static get keys (){
        if (this.fields && typeof this.fields == "object"){
            return Object.keys  (this.fields.content);
        }   
    }

    static get values (){
        if (this.fields && typeof this.fields == "object"){
            return Object.values(this.fields.content);
        } 
    }

    static get names (){
        const values = this.values;
        const keys   = this.keys;
        if (this.fields){
            const tableNames = [];

            if (values && values.length){
                values.forEach(function(el,i){
                    tableNames.push({
                        id  : keys[i], 
                        name: (el.plural) ? el.plural : el.singular
                    });
                });
            }


            return tableNames;
  
        } 
    }
   
}



;// CONCATENATED MODULE: ./src/js/viewTemplates/buttons.js
  
///////////////////////////////
//
// Шаблон кнопок 
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////





class Button {

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

            if (names && names.length){
                names.forEach(function(name,i){
                    button.on[name] = values[i];
                });
            }
          

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

        if (this.keys && this.keys.length){
            this.keys.forEach(function(option,i){

                button[option] = values[i];
    
                if (option === "hotkey"){
                    self.modifyTitle(i);
                }
    
            });
    
            this.addOnFunctions (button);
         
        }
  
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


;// CONCATENATED MODULE: ./src/js/viewTemplates/popup.js
  
///////////////////////////////
//
// Шаблон попапа
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////


class Popup {

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

        if (this.keys && this.keys.length){
            this.keys.forEach(function(option,i){
                popup[option] = values[i];
    
            });
        }
     
     
        return popup;

    }

    createView(){
        const popup  = this.popupView; 
        const values = this.values;

        if (this.keys && this.keys.length){
            this.keys.forEach(function(option,i){
                popup[option] = values[i];
    
            });
        }
     

      
        return webix.ui(this.addConfig());
    }

    showPopup(){
        $$(this.id).show();
     
    }


}


;// CONCATENATED MODULE: ./src/js/components/viewHeadline.js.js
  
///////////////////////////////
//
// Кнопка сохранения страницы в закладки    (create favorite btn)
//
// Кнопки с историей                        (create history btns)
//
// Название страницы                        (create title)
//
// Layout титульной панели                  (create layout)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////










const viewHeadline_js_logNameFile = "viewHeadline";



//create favorite btn

function findName (id, names){

    try{
        const nameTemplate = $$("favNameLink");

        if (names && names.length){
            names.forEach(function(el){
                if (el.id == id){
                    if(nameTemplate){
                        nameTemplate.setValues(el.name);
                    }
                }
                
            });
        }
      
    } catch (err){
        errors_setFunctionError(
            err, 
            viewHeadline_js_logNameFile, 
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
        let index   = link.lastIndexOf("?");
 
        if (index !== -1){ // if url params is exists
            link        = link.slice(0, index);
        }

        const favTemplate = $$("favLink");
        if (favTemplate){
            favTemplate.setValues(link);
        }
    } catch (err){
        errors_setFunctionError(
            err, 
            viewHeadline_js_logNameFile, 
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


function returnSuccessMsg(name){
    setLogValue(
        "success", 
        "Ссылка" + " «" + name + "» " + 
        " сохранёна в избранное"
    );
}


async function postContent(sentObj){
    const name = getValue("favNameLink");
    new ServerData({
        id : "userprefs"
        
    }).post(sentObj).then(function(data){
    
        if (data){
            returnSuccessMsg(name);
        }
        Action.destructItem($$("popupFavsLinkSave")); 
    });

    
}
function putContent(sentObj){

    const name = getValue("favNameLink");
    new ServerData({
        id : `userprefs/${sentObj.id}`,
       
    }).put(sentObj).then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (content){

                Action.destructItem($$("popupFavsLinkSave"));
                returnSuccessMsg(name);
    
            } else {
                Action.destructItem($$("popupFavsLinkSave"));
                errors_setFunctionError(
                    "Не удалось сохранить ссылку",
                    viewHeadline_js_logNameFile,
                    "putContent"
                );
            }
        }
         
    });


    Action.destructItem($$("popupVisibleCols"));
} 


function createPrefs(id){
    const favNameLinkVal = getValue("favNameLink");
    const favLinkVal     = getValue("favLink");

    const favorite = {
        name: favNameLinkVal,
        link: favLinkVal,
        id  : id,
    };

    return favorite;
}

async function btnSaveLinkClick(){
  
    const id        = getItemId();
 
    if (id){
        const name      = `fields/${id}`;
        const queryName = `userprefs.name+=+%27${name}%27`;
    
        const owner     = await returnOwner();
    
        if (owner && owner.id){
            
            const ownerId   = `userprefs.owner+=+${owner.id}`;
    
            new ServerData({
                id : `smarts?query=${queryName}+and+${ownerId}&limit=80&offset=0`,
            }).get().then(function(data){
            
                if (data && data.content){
          
                    const content = data.content;
        
                    if (content.length){ // exists
                        const item = content[0];
    
                        if (item){
                            const prefs = JSON.parse(item.prefs);
              
                            if (prefs.favorite){ //favs exists
                                setLogValue(
                                    "success", 
                                    "Ссылка уже в избранном"
                                );
                    
                                Action.destructItem($$("popupFavsLinkSave"));
                            } else {
                                prefs.favorite = createPrefs(id);
                                item.prefs = prefs;
                                putContent(item);
                            }
                        }
    
                    } else {
                        const favNameLinkVal = getValue("favNameLink");
    
                        const postObj = {
                            name : name,
                            owner: owner.id,
                            prefs: {}
                        };
    
                        postObj.prefs.favorite = createPrefs(id);
    
                        postContent(postObj,favNameLinkVal);
                    }
                    
                }
        
            });
        
        } else {
            errors_setFunctionError(
                "owner does not exists",
                viewHeadline_js_logNameFile,
                "btnSaveLinkClick"
            );
        }
    }
   
 
}

const btnSaveLink = new Button({

    config   : {
        value    : "Сохранить ссылку", 
        click    : function(){
            btnSaveLinkClick();
        },
    },
    titleAttribute : "Сохранить ссылку в избранное"

   
}).maxView("primary");


function saveFavsClick(){

    const popup = new Popup({
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

       
    const favsBtn = new Button({
    
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





//create history btns

function returnProp(name){
    const tabInfo = mediator.tabs.getInfo();
    return tabInfo[name];
}

function selectPage(config, id, changeHistory=false){
    mediator.tabs.setInfo(config, changeHistory);
    tabbarClick("onBeforeTabClick", id);
    tabbarClick("onAfterTabClick" , id);
}


function isThisPage(history){
    const lastHistory = history[history.length - 1];
    const tabConfig   = mediator.tabs.getInfo();

    if (tabConfig && lastHistory){
        const id        = tabConfig.tree ? tabConfig.tree.field : null;
        const historyId = lastHistory.field;

        if (id == historyId){
            return true;
        }
   
    }
   
}
function returnPrevPageConfig(history){
  
    if (history && history.length){

        let index = 1;

        if (isThisPage(history)){
            index = 2;
        }
        const lastIndex     = history.length - index;
        const modifyHistory = history.slice(0, lastIndex);
   
        if (lastIndex <= 1){
            mediator.tabs.setHistoryBtnState(false, false); // disable prev btn

        }

        mediator.tabs.setHistoryBtnState(true); // enable next btn
       
        if (history[lastIndex]){
            return{ 
                tree    : history[lastIndex],
                history : modifyHistory,
            };
        }
     
    }

}

function tabbarClick(ev, id){
    $$("globalTabbar").callEvent(ev, [ id ]);
}


function returnSelectTabId(){
    const tabbar   = $$("globalTabbar");
    return tabbar.getValue();  
}

function addNextPageConfig(prevPageConfig){
    const tree = returnProp ("tree");
    prevPageConfig.nextPage = tree;
}


function prevBtnClick (){
    const tabId          = returnSelectTabId    ();
    const history        = returnProp           ("history");
    const prevPageConfig = returnPrevPageConfig (history);
    
    if (prevPageConfig){
        addNextPageConfig(prevPageConfig);
        selectPage(prevPageConfig, tabId);
        
    }
}

function returnNextPageConfig(nextPage){
    const history = returnProp("history");
    const prevPage = returnProp("tree");
    history.push(prevPage);
    return {
        tree   : nextPage,
        history: history
    };
}

function isNextPageExists(nextPage){
    if (nextPage){
        return nextPage;
    }
}

function nextBtnClick (){
    const nextPage = returnProp("nextPage");

    if (isNextPageExists(nextPage)){
        const tabId          = returnSelectTabId   ();
        const nextPageConfig = returnNextPageConfig(nextPage);
  
        selectPage(nextPageConfig, tabId, true);

        mediator.tabs.setHistoryBtnState(true, false);// disable next btn
        mediator.tabs.setHistoryBtnState(); // enable prev btn
         
    }

}   

function createHistoryBtns(){

    
    const prevBtn = new Button({
        
        config   : {
            id       : `historyBtnLeft_${webix.uid()}`,
            hotkey   : "Ctrl+Shift+P",
            icon     : "icon-arrow-left",
            disabled : true, 
            css      : "historyBtnLeft",
            click    : function(){
                prevBtnClick();
            },
        },
        titleAttribute : "Вернуться назад"

    
    }).transparentView();

    const nextBtn = new Button({
        
        config   : {
            id       : `historyBtnRight_${webix.uid()}`,
            hotkey   : "Ctrl+Shift+B",
            icon     : "icon-arrow-right",
            css      : "historyBtnRight",
            disabled : true, 
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


//create title

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
        errors_setFunctionError(err, viewHeadline_js_logNameFile, "setHeadlineBlock");
    } 

    return returnHeadline(idTemplate, templateTitle);
}


//create layout
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




;// CONCATENATED MODULE: ./src/js/viewTemplates/loadTemplate.js
  
///////////////////////////////
//
// Шаблон загрузки
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////


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


;// CONCATENATED MODULE: ./src/js/components/dashboard/dynamicElements.js
///////////////////////////////

// Очищение рабочего пространства, 

// создание charts (create charts),

// пересоздание утерянного после перезагрузки
// фильтра (return lost filter)

// создание фильтра (create filter):
// создание inputs  (create inputs)
// кнопка Применить (create submit btn)
// создание layout  (create filter layout)

// обработка клика на элемент (create item click)
// Навигация на другую страницу (navigate other page), обновление таблицы 
// в данном дашборде (update space), показ контекстного окна (context window)


// Copyright (c) 2022 CA Expert

/////////////////////////////// 












 

const dynamicElements_logNameFile = "dashboard/dynamicElements";

let inputsArray;
let idsParam;
let action;
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
            dynamicElements_logNameFile, 
            "setScrollHeight"
        );
    }
}

function setScrollHeight(){
    const logBth = $$("webix_log-btn");

    const maxHeight = 90;
    const minHeight = 5;
    if ( logBth.config.icon == "icon-eye" ){
        setLogHeight(maxHeight);
        setLogHeight(minHeight);
    } else {
        setLogHeight(minHeight);
        setLogHeight(maxHeight);
    }
   
}

async function setDashName(idsParam) {
    const itemTreeId = idsParam;
    
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
            dynamicElements_logNameFile, 
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
  
    if (!action){
   
        Action.removeItem      ($$("dash-headline-container"));
        createDashHeadline     ();
        createDashboardCharts  (idsParam, dataCharts);
        createFilterLayout     (inputsArray);
        returnLostFilter       (idsParam);

    } else { // charts updated by click button
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



function errorActions(){
    const id = "dashLoadErr";
    Action.removeItem($$("dashLoad"));
    if ( !$$(id) ){
        $$("dashboardInfoContainer").addView(  
        createOverlayTemplate(id, "Ошибка"));
    }
}


function getChartsLayout(){
    addLoadElem();

    new ServerData({
    
        id           : url,
        isFullPath   : true,
        errorActions : errorActions
       
    }).get().then(function(data){

        if (data){

            const charts = data.charts;

            if (charts){

                Action.removeItem($$("dashLoad"));
        
                Action.removeItem($$("dashBodyScroll"));
        
                if ( !action ){ //не с помощью кнопки фильтра
                    removeFilter();
                }
                
                removeCharts    ();
                setUpdate       (charts);
                setUserUpdateMsg();
                removeLoadView  ();
                setScrollHeight ();

            }
        }
         
    });
 
}


function createDynamicElems ( path, array, ids, btnPress = false ) {
    inputsArray = array;
    idsParam    = ids;
    action      = btnPress;
    url         = path;

    getChartsLayout();

}






// create charts


function dynamicElements_returnHeadline (titleTemplate){
    const headline = {   
        template    : titleTemplate,
        borderless  : true,
        height      : 35,
        css         : "dash-HeadlineBlock",
    };
 
    return headline;
}
// const action = {
//     navigate: true,
//     field   : "auth_group",
//   //  context : true,
//     params  :{
//        // filter : "auth_group.id = 3" 
//      filter : "auth_group.id != '1' or auth_group.id != '3' and auth_group.role contains 'р' or auth_group.role = 'а'" 
//     } 
// };

function returnDefaultWidthChart(){
    const container = $$("dashboardInfoContainer");
    if (container){
        const width = container.$width;
        const k     = 2;

        return width/k;
    } else {
        return 500;
    }
}
function createChart(dataCharts){
    const layout = [];
  
    try{

        const labels =  [
          { "view":"label", "label":"Больше 15 минут: 10"   ,"minWidth":200,"action":action,"css":{"background-color":"#FFAAAA","text-align":"center"}},
          { "view":"label", "label":"Без комментария:  3"   ,"minWidth":200,"action":action,"css":{"background-color":"#FFAAAA","text-align":"center"}},
          { "view":"label", "label":"За сегодня всего: 20"  ,"minWidth":200,"action":action,"css":{"background-color":"#AAFFAA","text-align":"center"}},
          { "view":"label", "label":"За сегодня закрыто: 15","minWidth":200,"action":action,"css":{"background-color":"#AAFFAA","text-align":"center"}},
          { "view":"label", "label":"За сегодня в работе: 5","minWidth":200,"action":action,"css":{"background-color":"#AAFFFF","text-align":"center"}},
          { "view":"label", "label":"Всего не закрыто: 130" ,"minWidth":200,"action":action,"css":{"background-color":"#AAFFFF","text-align":"center"}},
          { "view":"label", "label":"Без цвета: ???"        ,"minWidth":200,"action":action,"css":{"text-align":"center"}}
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
        //     "minWidth":200,
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
     
        //  dataCharts.push(table);
       // dataCharts.push(res);
      
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
       
            const heightElem = el.height   ? el.height   : 300;
            const widthElem  = el.minWidth ? el.minWidth : returnDefaultWidthChart();
    
 
            layout.push({
                css : "webix_dash-chart",
             
                rows: [ 
                 //   {template:' ', height:20, css:"dash-delim"},
                    dynamicElements_returnHeadline (titleTemplate),
                    {   margin     : 4,
                        minHeight  : heightElem,
                        minWidth   : widthElem,
                        padding    : 4,
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
            dynamicElements_logNameFile, 
            "createChart"
        );
    }

    return layout;
}


function setIdAttribute(idsParam){
    const container = $$("dashboardContainer");
    if (container){
        container.config.idDash = idsParam;
    }
}


function createDashLayout(dataCharts){
    const layout = createChart(dataCharts);
 
 
    const dashCharts = {
        id  : "dashboard-charts",
        view: "flexlayout",
        css : "webix_dash-charts-flex",
        cols: layout,
    };

    return dashCharts;
}

function createScrollContent(dataCharts){
    const content = {
        view        : "scrollview", 
      //  scroll      : "y",
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

 

function isContextTableValues(){
    const href   = window.location.search;
    const params = new URLSearchParams (href);

    const src      = params.get("src");
    const isFilter = params.get("filter");
 
    if (src && isFilter){
        return true;
    } else {
        webix.storage.local.remove("dashTableContext"); // last context data
        return false;
    }
   
   
}

function createTableContext(){

    const data = webix.storage.local.get("dashTableContext");

    if (data){
        updateSpace(data);
    }

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
            dynamicElements_logNameFile, 
            "createFilterLayout"
        );
    } 

    setIdAttribute(idsParam);
    
    if (isContextTableValues()){
        createTableContext();
    }
    
}




// return lost filter


function setDataToTab(currState){
    const data = mediator.tabs.getInfo();
 
    if (data){
        if(!data.temp){
            data.temp = {};
        }
        if(!data.temp.filter){
            data.temp.filter = {};
        }

        data.temp.filter.dashboards = true;
        data.temp.filter.values     = currState;

        mediator.tabs.setInfo(data);
    }
}


function returnLostFilter (id){
    const url       = window.location.search;
    const params    = new URLSearchParams(url);
    const viewParam = params.get("view"); 

    
    if (viewParam == "filter"){
        $$("dashFilterBtn").callEvent("clickEvent", [ "" ]);

        const data = webix.storage.local.get("dashFilterState");
  
        if (data){
       
            const content = data.content;

         
            if (content){
                setDataToTab(content);

                content.forEach(function(el){
                    const input = $$(el.id);
                    if (input){
                        let value = el.value;

                        if (input.config.id.includes("-time")){
                            const formatting = webix.Date.dateToStr("%H:%i:%s");
                            value = formatting(value);
                        }
                        
                        
                        input.setValue(value);
                    }
                });

            }
        
        }
      
    }
}


//create filter

function setTabInfo(sentVals){
    
    const tabData =  mediator.tabs.getInfo();

    if (tabData){
        if (!tabData.temp){
            tabData.temp = {};
        }
        tabData.temp.filter = {
            dashboards: true,
            values    : sentVals,
        };
    }
}

function setToStorage(input){

    const container = input.getParentView();
    const childs    = container.getChildViews();
    const newValues = [];

    childs.forEach(function(el){

        if (el.config.view == "datepicker"){
            newValues.push({
                id    : el.config.id,
                value : el.config.value
            });
        }
    });
  
    if (newValues.length){
        const content = {
            content : newValues
        };
        webix.storage.local.put("dashFilterState", content);

        setTabInfo(newValues);
    }

   
}



// create inputs

const dynamicInputs = [];
let   findAction;
let   idsParameter;

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

function createDate(input, id){

    const dateTemplate = {
        view        : "datepicker",
        id          : `dashDatepicker_${id}`,
        format      : "%d.%m.%y",
        sentAttr    : id,
        editable    : true,
        value       : new Date(),
        placeholder : input.label,
        keyPressTimeout:900,
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

            onChange:function(newV, oldV, config){
                if(config){
                    setToStorage(this);
                }
               
            },

            onTimedKeyPress:function(){
                setToStorage(this);
            },
        }
    };


    return dateTemplate;

}



function createTime (id){
    const timeTemplate =  {   
        view        : "datepicker",
        id          :`dashDatepicker_${id}-time`,
        sentAttr    : id,
        format      : "%H:%i:%s",
        placeholder : "Время",
        height      : 42,
        editable    : true,
        keyPressTimeout:900,
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
                setToStorage(this);
            },
            onAfterRender: function () {
                this.getInputNode()
                .setAttribute(
                    "title",
                    "Часы, минуты, секунды"
                );
                setAdaptiveWidth(this);
            },

        }
    };

    return timeTemplate;
}


function createBtn (input, i){

    const btnFilter = new Button({
        
        config   : {
            id       : "dashBtn" + i,
            hotkey   : "Ctrl+Shift+Space",
            value    : input.label,
            click    : function(){
                clickBtn(
                    i, 
                    dynamicInputs, 
                    idsParameter, 
                    findAction
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


function createDatepicker(input, id){

    const inputs = {   
        width   : 200,
        rows    : [ 
            createHead (input.label),
            createDate (input, id),
            createTime (id),
            { height:20 },
        ]
    };
    if (dynamicInputs){
        dynamicInputs.push( inputs );
    }
       
}

function createText(input, id){
    
    const value = input.value ? input.value : "";
    const inputs = {   
        width   : 200,
        rows    : [ 

            createHead (input.label),
            { 
                view        : "text", 
                value       : value, 
                sentAttr    : id,
                placeholder : input.label,
            },
            { height:20 },
        ]
    };
   

    if (dynamicInputs){
        dynamicInputs.push( inputs );
    }
}



function dataTemplate(i, valueElem){
    const template = { 
            id    : i + 1, 
            value : valueElem
        };
    return template;
}


function createOptions(content){
    const dataOptions = [];
    if (content && content.length){
        content.forEach(function(name, i) {
     
            let title = name;
            if ( typeof name == "object"){
                title = name.name;
            }

            const optionElement = dataTemplate(i, title);
            dataOptions.push(optionElement); 
        });
    }

    return dataOptions;
}

function getOptionData (field){

    return new webix.DataCollection({url:{
        $proxy:true,
        load: function(){
            return ( 
                
                new ServerData({
                    id : field.apiname,
                
                }).get().then(function(data){
                
                    if (data){
                
                        const content = data.content;
                   
                        if (content && content.length){
                            return createOptions(content);
                        } else {
                            return [
                                { 
                                    id    : 1, 
                                    value : ""
                                }
                            ];
                        }
                    }
                    
                })

            );
            
        
            
        }
    }});
}


function createCombo(input, id){
 
    const inputs = {   
        width   : 200,
        rows    : [ 

            createHead (input.label),
            {
                view          : "combo", 
                placeholder   : input.label,
                sentAttr      : id,
                options       : getOptionData (input)
            },
            { height:20 },
        ]
    };

    if (dynamicInputs){
        dynamicInputs.push( inputs );
    }
}

function createFilter (inputs, el, ids){

    idsParameter         = ids;
    dynamicInputs.length = 0;

    const keys   = Object.keys(inputs);
    const values = Object.values(inputs);

    values.forEach(function(input, i){
 
        if (input.type == "datetime"){ 
            createDatepicker(input, keys[i]);

        } else if (input.type == "string"){
            createText(input, keys[i]);
        } else if (input.type == "apiselect"){
            createCombo(input, keys[i])

        } else if (input.type == "submit"){

            const actionType    = input.action;
            findAction          = el.actions[actionType];
            
            dynamicInputs.push(
                {height : 15}
            );
            dynamicInputs.push(
                createBtn (input, i)
            );

        }


    });

    return dynamicInputs;
  
}





// create submit btn


let inputs;
let ids;
let fieldAction;


let sdtDate;
let edtDate;


const dateArray     = [];
const compareDates  = [];



function createTimeFormat(id, type){
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
          //  validateEmpty = false;
        }
    } catch (err){  
        errors_setFunctionError(
            err,
            dynamicElements_logNameFile,
            "createTimeFormat"
        );
    }
}

function createDateFormat(id, type){
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
          //  validateEmpty = false;
        }
    } catch (err){  
        errors_setFunctionError(
            err,
            dynamicElements_logNameFile,
            "createDateFormat"
        );
    }
}

function createFilterElems(id, type){
    if (id.includes(type)){

        if (id.includes("time")){
            createTimeFormat(id, type);

        } else {
            createDateFormat(id, type);

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
        inputs.forEach(function(el){
            if ( el.id.includes("container") ){
                enumerationElements(el);
            }
        });
    } catch (err){  
        errors_setFunctionError(
            err,
            dynamicElements_logNameFile,
            "setInputs"
        );
    }
}
function createQuery(type, val){
    dateArray.push( type + "=" + val );
    compareDates.push( val ); 
}



function getDataInputs(){
    setInputs   ();
    createQuery("sdt", sdtDate);
    createQuery("edt", edtDate);
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

function findInputs(arr, result){

    arr.forEach(function(el){
        const view = el.config.view;

        if (view){
            result.push(el);
        }
    });

}
function findElems(){
    const container = $$("dashboardFilterElems");
    const result = [];
    if (container){
        const elems =  container.getChildViews();

        if (elems && elems.length){
            elems.forEach(function(el){
    
                const view = el.config.view;
                if (!view || view !=="button"){
                    const childs = el.getChildViews();
                    if (childs && childs.length){
                        findInputs(childs, result);
                        
                    }
         
                }
            });
        }
       
    }

    return result;
}

function returnFormattingTime(date){
    const format = webix.Date.dateToStr("%H:%i:%s");

    return format(date);
}

function returnFormattingDate(date){
    const format = webix.Date.dateToStr("%d.%m.%y");

    return format(date);
}

function findEachTime(obj, id){
    const res = obj.time.find(elem => elem.id === id);
    return res;
}

function createFullDate(obj, resultValues){
 
    obj.date.forEach(function(el){
        const id    = el.id;
        const value = el.value;
        if (id){
            const time  = findEachTime(obj, id);

            resultValues.push(id + "=" + value + "+" + time.value);
    
        }
    });

 

}


function formattingValues(values){

    const resultValues = [];

    let emptyValues = 0;
    const dateCollection = {
        time : [],
        date : []
    };

 

    values.forEach(function(el){

        let   value  = el.getValue();
        const view   = el.config.view;

        const sentAttr = el.config.sentAttr;
        const type     = el.config.type;

        if (value){

            if (view == "datepicker"){

                if(type && type == "time"){
                    value = returnFormattingTime(value);
                    dateCollection.time.push({
                        id   : sentAttr,
                        value: value
                    });
                } else {
                    value = returnFormattingDate(value);
                    dateCollection.date.push({
                        id   : sentAttr,
                        value: value
                    });
                }  

            } else {
                resultValues.push(sentAttr + "=" + value);
            }
           
        } else {
            emptyValues ++;
        }
    
    });

    
    if (dateCollection.time.length && dateCollection.date.length){
        createFullDate(dateCollection, resultValues);
 
    }

    return {
        values     : resultValues,
        emptyValues: emptyValues
    };

}


function sentQuery (){
    const inputs = findElems();
    let values;
    let empty = 0;

    if (inputs && inputs.length){
        const result = formattingValues(inputs);
        values = result.values;
        empty  = result.emptyValues;
    }
 
    if (!empty){

        const getUrl = fieldAction.url + "?" + values.join("&");
    
        loadView();

        createDynamicElems(
            getUrl, 
            inputs,
            ids, 
            true
        );


    } else {
      
        //setInvalidView("empty", childs);
     
        setLogValue(
            "error", 
            "Не все поля заполнены"
        );
    }
}

function clickBtn(i, inputsArr, ids, action){

  //  index       = i;
    inputs      = inputsArr;
    ids         = ids;
    fieldAction = action;

    dateArray   .length = 0;
    compareDates.length = 0;


    sdtDate         = "";
    edtDate         = "";
   // validateEmpty   = true;

    getDataInputs();
    sentQuery ();
}





//create filter layout


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

    const filterBackBtn = new Button({
    
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
            
            {   id  : "dashboardFilterElems",
                rows : inputsArray }
        ], 
    };

    try{
      
        $$("dashboardTool").addView( mainView, 0);
    } catch (err){  
        errors_setFunctionError(
            err, 
            dynamicElements_logNameFile, 
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
        
            mediator.linkParam(false, "view");
            mediator.tabs.clearTemp("dashFilterState", "filter");
          

        } else {
            Action.showItem (tools);
            Action.showItem (dashTool);
        
            mediator.linkParam(true, {"view": "filter"});
            mediator.tabs.clearTemp("dashTableContext", "context");
        }
    }

    filterMaxAdaptive();


    const minWidth = 850;
    if (container.$width < minWidth){
        Action.hideItem(tree);

        if (container.$width  < minWidth ){
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

    const filterBtn = new Button({
        config   : {
            id       : "dashFilterBtn",
            hotkey   : "Ctrl+Shift+F",
            icon     : "icon-filter", 
            click   : function(){
                filterBtnClick();
            },
        },
        titleAttribute : "Показать/скрыть фильтры",
        onFunc:{
            clickEvent:function(){
                filterBtnClick();
            }
        }
    
       
    }).transparentView();
  
  
    addViewToContainer(filterBtn);
  
}



function createFilterLayout(inputsArray){

    createMainView (inputsArray);
    createFilterBtn();
}





// create item click



const actionExample = {
    navigate: "true - переход на другую страницу, false - обновление в данном дашборде",
    context : "true - открыть окно с записью таблицы, false - обновить таблицу",
    field   : "название из fields (id таблицы должен быть идентичным, если navigate = false)",
    params  :{
        // sorts
        filter : "auth_group.id > 3", 
    }
   
};

// const action2 = {
//     navigate: false,
//     field   : "auth_group", 
//     context : true,
//     params  : {
//        filter : "auth_group.id = 1" 
//     // filter : "auth_group.id != '1' or auth_group.id != '3' and auth_group.role contains 'р' or auth_group.role = 'а'" 
//        // filter:"auth_user.registration_key != '3dg' and auth_user.registration_id = 'dfgg'"
//     } 
// };

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

    let isExists = false;

    keys.forEach(function(key){
       
        if ( key == field ){
            isExists = true;
            if (chartAction.navigate){
                dynamicElements_navigate(chartAction.field, chartAction.params.filter);
            } else {
       
                updateSpace(chartAction);
                webix.storage.local.put("dashTableContext", chartAction);
            } 
        
        }
    });

    if (!isExists){ 
        errors_setFunctionError(
            "Key «" + field + "» doesn't exist", 
            "dashboard / create space / click / itemClickLogic", 
            "findField"
        );

        mediator.linkParam(false, "src");
        mediator.linkParam(false, "filter");
    }

 
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

            console.log("пример: ", actionExample);
    
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




//////// navigate other page

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



const filterArr = [];
const idsElem   = [];


function setInputValue(value){
    let trueValue;
    if (value){
        trueValue = value.replace(/['"]+/g, '');
    }

    return trueValue;
  
}

function checkCondition(arr, index){
    let parent  = null;
   
    let id      = arr[1];
    const i     = id.lastIndexOf(".") + 1;
    id          = id.slice(i);

    let logic   = arr[4];
    const value = setInputValue(arr[3]);

    idsElem.push(id);
  
    const isUnique = idsElem.filter(elem => elem == id);

    if (isUnique.length > 1){ // isnt unique

        parent  = id; 
        id      = id + "_filter-child-"+ webix.uid();

    } else {
        id = id + "_filter";
    }


    if (logic == "and"){
        logic = "1";
    } else {
        logic = "2";
    }
    
 
    
    filterArr.push({
        id        : id,
        value     : value,
        operation : arr[2],
        logic     : logic,
        parent    : parent,
        index     : index
    });
}


function iterateConditions(conditions){

    conditions.forEach(function(el, i){
        const arr = el.split(' ');
        checkCondition(arr, i);
     
    });

    return filterArr;

}



function returnFilter(query){

    const conditions = returnConditions(query);
 
    iterateConditions(conditions);
}
function checkFieldType(field){

    const item = GetFields.item(field);

    if (item){
        return item.type;
    } else {
        LoadServerData("fields").then(function(data){
            checkFieldType(field);
        });
    }
 
}

function dynamicElements_navigate(field, filter){
    const type = checkFieldType(field);
  
    if (type){
        let infoData ;

        if (type == "dbtable"){
            filterArr.length = 0;
            idsElem.length       = 0;
        
            if (field){
        
                returnFilter(filter);
            
                infoData = {
                    tree:{
                        field : field,
                        type  : "dbtable"
                    },
                    temp:{
                        filter     : {
                            id     : field, 
                            values : {values : filterArr}
                        },
                        queryFilter :  filter
                    }
                };
        
              
        
            } 
        } else if (type == "tform"){
            infoData = {
                tree:{
                    field : field,
                    type  : "tform"
                },
            };
        } else if (type == "dashboard"){
            infoData = {
                tree:{
                    field : field,
                    type  : "dashboard"
                },
            };
        }
    
        if (infoData){
            mediator.tabs.openInNewTab(infoData);
        }
    

    }
  
  
}







////////update space
function createSentQuery(filter, sorts){
 
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



function setToTab(field, filter){
    const data = mediator.tabs.getInfo();
  
    if (data){
        if(!data.temp){
            data.temp = {};
        }
        if(data.temp.filter){
            delete data.temp.filter;
        }

        data.temp.context = {};

        data.temp.context.id     = field;
        data.temp.context.filter = filter;
  
        mediator.tabs.setInfo(data);

    } 

   
}

function setParamsToLink(id){
    mediator.linkParam(true, {
        "src"    : id , 
        "filter" : true  
    });
}

function clearParams(){
    mediator.linkParam(false, "src");
    mediator.linkParam(false, "filter");
}

function setDataToTable(table, data){

    const tableElem = $$(table);

    if (tableElem){
        tableElem.clearAll();
        tableElem.parse(data);

        setParamsToLink(table);
        scrollToTable  (tableElem);
    } else {    
        errors_setFunctionError(
            "Таблица с id «" + table + 
            "» не найдена на странице", 
            dynamicElements_logNameFile, 
            "setDataToTable"
        );

        clearParams();
    }
  
}

function getTableData(tableId, query, onlySelect){

    const fullQuery = query.join("&");

    new ServerData({
    
        id           : "smarts?" + fullQuery,
        isFullPath   : false,
        errorActions : clearParams
       
    }).get().then(function(data){
  
        if (data){

            const content = data.content;

            if (content){
                const item = content[0];
        
                if (!onlySelect){
                    setToTab   (tableId, fullQuery);
                    setDataToTable (tableId, content);
                } else if (item){
                    createContextProperty (item, tableId);
                }

            }
        }
         
    });

}

function updateSpace(chartAction){
 
    const tableId     = chartAction.field;

    const filter      = chartAction.params.filter;
    const filterParam = filter || tableId + ".id > 0" ;

    const sorts     = chartAction.params.sorts;
    const sortParam = sorts || tableId + ".id" ;
    const query     = createSentQuery(filterParam, sortParam);

    const onlySelect= chartAction.context;

    getTableData(tableId, query, onlySelect);
    

}








//context window

let container;
let item;
let field;

const headline  = {
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

const closeBtn  = new Button({
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
        const keys   = Object.keys(item);
        const labels = await findLabels();

        values.forEach(function(val, i){

            data.push({
                id    : keys[i],
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

        const propValues = $$("dashContextProperty").getValues();
 
        const infoData = {

            tree : {
                field : field,
                type  : "dbtable" 
            },
            temp : {
                edit  : {
                    selected : id, 
                    values   : {
                        status : "put",
                        table  : field,
                        values : propValues
                    }
                },
              
            }
        };

        mediator.tabs.openInNewTab(infoData);

    }
 
}

const goToTableBtn = new Button({
    
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
                headline,
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

function setToTabStorage(){
    const data = mediator.tabs.getInfo();
  
    if (data){
        if(!data.temp){
            data.temp = {};
        }
        if(data.temp.filter){
            delete data.temp.filter;
        }

        data.temp.context = {};

        data.temp.context.open  = true; // open context window
        data.temp.context.field = field;
        data.temp.context.id    = item.id;
  
        mediator.tabs.setInfo(data);
    } 

    
}

function createContextProperty(data, idTable){
    item  = data;
    field = idTable;

    const filters = $$("dashboardTool");
    Action.hideItem(filters);
    
    container = $$("dashboardContext");
    Action.showItem(container);

    const minWidth   = 850;
    const emptySpace = 45;
    if (window.innerWidth < minWidth){

        container.config.width = window.innerWidth - emptySpace;
 
        container.resize();
        Action.hideItem($$("dashboardInfoContainer"));
    }

    setLinkParams   ();
    createSpace     ();
    setToTabStorage ();
    
}









;// CONCATENATED MODULE: ./src/js/components/dashboard/createDashboard.js
///////////////////////////////

// Отображение charts (create charts)

// Автообновление (create autorefresh) 

// Создание layout (create layout)

// Copyright (c) 2022 CA Expert

///////////////////////////////






 


// create charts 

let createDashboard_idsParam;
function createDashSpace (){
    
    const item = GetFields.item(createDashboard_idsParam);

    if (item){

        Action.removeItem($$("dash-none-content"));

        const url    = item.actions.submit.url;
        const inputs = createFilter (item.inputs, item, createDashboard_idsParam);
     
        createDynamicElems(url, inputs,      createDashboard_idsParam);
        autorefresh       (item,  createDashboard_idsParam);
    }
}

async function getFieldsData (isShowExists){
    if (!isShowExists){
        await LoadServerData.content("fields");
    }

    if (!GetFields.keys){
        await LoadServerData.content("fields");
    }
  

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

    
    new ServerData({
    
        id           : "smarts?" + fullQuery,
       
    }).get().then(function(data){
    
        if (data){

            const content = data.content;

            if (content){
             
                const firstPost = content[0];
    
                if (firstPost){
                    createContextProperty(
                        firstPost, 
                        src
                    );
                }

            }
        }
         
    });



}

function getLinkParams(param){
    const href   = window.location.search;
    const params = new URLSearchParams (href);
    return params.get(param);
}



function returnLostContext(){

    const data = mediator.tabs.getInfo();
 
    if (data && data.temp){

        const context = data.temp.context;

        if (context && context.open){ // open context window
  
            mediator.linkParam(true, {
                "src": context.field , 
                "id" : context.id  
            });
            
        } else if (context){ // set values to dash table
        
            mediator.linkParam(true, {
                "src"    : context.id , 
                "filter" : true  
            });

            // const table = $$(context.id);
            // scrollToTable(table);
        }
        
    }
 
}


function selectContextId(){
    returnLostContext();

    const idParam  = getLinkParams("id");
    const srcParam = getLinkParams("src");
    if (idParam && srcParam){
        createDashboard_getData(idParam , srcParam);
    } 
}
function createContext(){
    selectContextId();
}


function createDashboard (ids, isShowExists){
    createDashboard_idsParam = ids;

    const scroll = $$("dashBodyScroll");
    Action.removeItem(scroll);
 
    getFieldsData (isShowExists);
  
    createContext();
}





// create autorefresh 

function setIntervalConfig(counter){
    setInterval(function(){
        mediator.dashboards.load(createDashboard_idsParam);
    },  counter );
}

function autorefresh (el, ids) {

  
    if (el.autorefresh){

        const userprefsOther = webix.storage.local.get("userprefsOtherForm");
        const counter        = userprefsOther.autorefCounterOpt;
        createDashboard_idsParam             = ids;

        const minValue     = 15000;
        const defaultValue = 50000;

        if ( counter !== undefined ){

            if ( counter >= minValue ){
                setIntervalConfig(counter);

            } else {
                setIntervalConfig(defaultValue);
            }

        } else {
            setIntervalConfig(defaultValue);
        }

       
    }
}



//create layout


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
            {  
                id  : "dashboardContainer",
        
                rows: [

                    {cols:[
                        {   id      : "dashboardInfoContainer",
                            css     : "dash_container",
                            minWidth: 250, 
                            rows    : [
                                {id : "dash-none-content"}
                            ] 
                        },
                        {view: "resizer"},
                        dashboardTool,
                        dashboardContext
                    ]},
                
                    
                
                ]
                    
            }
        ];
}




;// CONCATENATED MODULE: ./src/js/components/dashboard/_dashMediator.js
///////////////////////////////

// Медиатор

// Copyright (c) 2022 CA Expert

///////////////////////////////






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
    showExists(id){
        createDashboard(id, true);
    }

    load(id){
        createDashboard(id);
    }

    defaultState(){
      
        Action.hideItem($$("dashboardTool"));
        Action.showItem($$("dashboardInfoContainer"));
    }

}


;// CONCATENATED MODULE: ./src/js/blocks/notifications.js
///////////////////////////////
//
// Confirm и modalbox 
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////

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

;// CONCATENATED MODULE: ./src/js/viewTemplates/emptyTemplate.js
  
///////////////////////////////
//
// Шаблон пустого пространства
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////

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


;// CONCATENATED MODULE: ./src/js/components/table/editForm.js
 
///////////////////////////////
//
// Дефолтные значения пустых полей              (create default values)
//
// Layout редактора                             (create layout)
//
// Кнопки редактора                             (create form btns)
//
// Создание компонента редактора                (create property)
//
// Медиатор                                     (create mediator)
//
// Посты и удаление в редакторе форм            (create server actions)
//
// Состояния редактора записей                  (create states)
//
// Кнопка навигации на другую страницу          (create reference btn)
//
// Кнопка календаря                             (create calendar btn)
//
// Кнопка с расширенным полем для ввода текста  (create textarea btn)
//
// Property компонент                           (create property layout)
//
// Дефолтное состояние редактора                (create default state)
//
// Валидация перед постом записи                (create validation)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////
















const editForm_logNameFile = "table/editForm";


//create default values

const formatData  = webix.Date.dateToStr("%d.%m.%y %H:%i:%s");


function createGuid() {  
    const mask = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return mask.replace(/[xy]/g, function(c) {  
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);  
    });  
}

function dateFormattingLocic (el){
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
        defVal = dateFormattingLocic (el);

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



//create validation

function validateProfForm (){

    const errors = {};
    const messageErrors = [];
    const property      = $$("editTableFormProperty");
    
    function checkConditions (){ 
       
        const values = property.getValues();
        if (values){
            const propVals = Object.keys(values);

            if (propVals.length){
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
                            errors_setFunctionError(err,editForm_logNameFile,"valLength");
                        }
                    }
        
                    function valNotNull (){
                        try{
                            if ( propElement.notnull == false && propValue && propValue.length == 0 ){
                                errors[el].notnull = "Поле не может быть пустым";
                            } else {
                                errors[el].notnull = null;
                            }
                        } catch (err){
                            errors_setFunctionError(err, editForm_logNameFile, "valNotNull");
                        }
                    }
        
                    function valUnique (){
                        
                        errors[el].unique = null;

                        const pull = $$("table").data.pull;
                                        
                        if (propElement.unique == true && pull){
    
                            const tableRows   = Object.values(pull);
    
                            if (tableRows.length){
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
                            } else {
                                errors_setFunctionError("array is null", editForm_logNameFile, "valUnique");
                            }
                          
                        }
                    
                         
                    }
                   
                    dateField   ();
                    numberField ();
                    valLength   ();
                    valNotNull  ();
                    valUnique   ();
                });
            } else {
                errors_setFunctionError("array length is null", editForm_logNameFile, "checkConditions");
            }
          
        }
        
    }

    function createErrorMessage (){
     
        function findErrors (){
         
            if (errors){
                const values = Object.values(errors);
                if (values && values.length){
                    values.forEach(function(col, i){

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
                } else {
                    errors_setFunctionError("array length is null", editForm_logNameFile, "findErrors");
                }
            
            }
           
        }

        findErrors ();
        
    }
    try{
        checkConditions ();
        createErrorMessage ();
    } catch (err){
        errors_setFunctionError(err, editForm_logNameFile, "validateProfForm");
    }

  
    if (messageErrors && messageErrors.length){
     
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

            const cols = table.getColumns(true);
            if (cols && cols.length){
                table.getColumns(true).forEach(function(col){
             
                    if (col.id == el.nameCol){
                        nameEl = col.label;
                    }
                });
    
                setLogValue("error", el.textError + " (Поле: " + nameEl + ")");
            } else {
                errors_setFunctionError("array is null", editForm_logNameFile, "setLogError");
            }

   
        });

    } catch (err){
        errors_setFunctionError(err, editForm_logNameFile, "setLogError");
    }
}


function uniqueData (itemData){
    const validateData = {};
    if (itemData) {
        const table      = $$("table");
        const dataValues = Object.values(itemData);

        if (dataValues.length){
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
        } else {
            errors_setFunctionError("array is null", editForm_logNameFile, "uniqueData");
        }
     
    } 
    
 
      
     

    return validateData;
}



//create default state

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
        errors_setFunctionError(err, editForm_logNameFile, "defaultStateForm");
    }

}


//create property layout

function editingEnd (editor, value){

    try{
        const property = $$("editTableFormProperty");
        const item     = property.getItem(editor);
        item.value     = value;

        property.updateItem(editor);

    } catch (err){
        errors_setFunctionError(
            err, 
            editForm_logNameFile, 
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


function editForm_createTemplate (){
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

function editForm_setTabInfo(sentVals){
    
    const tabData =  mediator.tabs.getInfo();
 
    const tableId = $$("table").getSelectedId();
    let id;
    if (tableId){
        id = tableId.id;
    }

    if (tabData){
        if (!tabData.temp){
            tabData.temp = {};
        }
        tabData.temp.edit = {
            values: sentVals,
            selected: id
        };

        mediator.tabs.setInfo(tabData);
    }

 
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

 
    if (!isEqual(tableValue, values)){
        const sentVals = {
            table : id,
            status: status,
            values: values
        };

        editForm_setTabInfo(sentVals);

        webix.storage.local.put(
            storageName, 
            sentVals
        );
    } else {
       // webix.storage.local.remove(storageName);
    }

    mediator.tabs.setDirtyParam();
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
                editForm_createTemplate ();
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



//create reference btn

let selectBtn;
let idPost;

function createTabConfig(refTable){
    const infoData = {

        tree : {
            field : refTable,
            type  : "dbtable" 
        },
        temp : {
            edit  : {
                selected : idPost, 
                values   : {
                    status : "put",
                    table  : refTable,
                    values : {}
                }
            },
          
        }
    };  
    
    return infoData;
}

function setRefTable (srcTable){
    if (srcTable){
        const table = $$("table");
        const cols  = table.getColumns();
 

    
        if (cols && cols.length){
            cols.forEach(function(col){

                if ( col.id == srcTable ){
                
                    const refTable = col.type.slice(10);
                    
                    const infoData = createTabConfig(refTable);

                    mediator.tabs.openInNewTab(infoData);
                
                }

            });
        } else {
            errors_setFunctionError(
                "array length is null", 
                editForm_logNameFile, 
                "setRefTable"
            );

            Action.hideItem($$("EditEmptyTempalte")); 
        }
           
      

    }

}


function findIdPost(editor){
    const prop = $$("editTableFormProperty");
    const item = prop.getItem(editor);
    return item.value;
}

function btnClick (idBtn){
    const config      = $$(idBtn).config;
    const srcTable    = config.srcTable;

    idPost            = findIdPost(config.idEditor);

    setRefTable    (srcTable);
  
}

function btnLayout(idEditor){

    const btn = new Button({

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
        errors_setFunctionError(err, editForm_logNameFile, "btnLayout");
    }
}

function createRefBtn(btn){
    selectBtn = btn;
    btnLayout(btn);
    Action.showItem($$("tablePropBtnsSpace"));
}





//create calendar btn

let property;
function dirtyProp(elem){
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
    dirtyProp( calendar     );
    dirtyProp( $$("hourInp"));
    dirtyProp( $$("minInp" ) );
    dirtyProp( $$("secInp" ) );
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
            editForm_logNameFile, 
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
                editForm_logNameFile, 
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
            setDataToStorage(elem, sentVal);

            Action.destructItem($$("editTablePopupCalendar"));
        }
    } catch (err){
        errors_setFunctionError(
            err, 
            editForm_logNameFile, 
            "setValToProperty"
        );
    }
}

function inputItterate(name, count){
    const val = $$(name).getValue();
    validTime(val, count, name);
    return val;
}

function setDataToStorage(elem, value){
    const prop   = $$("editTableFormProperty");
    const editor = prop.getItem(elem.id);
    prop.callEvent("onNewValues", [value, editor]);
}


function submitClick (elem){
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

function closePopup (elem){
    const calendar = $$("editTablePopupCalendar");

    if (calendar){
        
        if (isDirty(calendar)){
    
            modalBox().then(function(result){

                if (result == 1){
                    Action.destructItem(calendar);
                }

                if (result == 2 && !submitClick(elem)){

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

function returnBtn(elem){
    const btn = new Button({

        config   : {
            id       : "editPropCalendarSubmitBtn",
            hotkey   : "Ctrl+Space",
            value    : "Добавить значение", 
            click    : function(){
                submitClick(elem);
            },
        },
        titleAttribute : "Добавить значение в запись таблицы"
    
       
    }).maxView("primary");

    return btn;

}
function popupEdit(elem){

    const headline = "Редактор поля  «" + elem.label + "»";

    const popup = new Popup({
        headline : headline,
        config   : {
            id        : "editTablePopupCalendar",
            width     : 400,
            minHeight : 300,
        },
        closeConfig: {
            currElem : elem
        },
        closeClick : closePopup ,
        elements : {
            rows : [
                returnDateEditor(),
                {height:15},
                returnBtn(elem),
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

    const btn = new Button({

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
        errors_setFunctionError(err, editForm_logNameFile, "createDateBtn");
    }
}

function createDatePopup(el){
    createDateBtn(el);
    Action.showItem($$("tablePropBtnsSpace"));
}



//create textarea btn

let propertyElem;

function setPropValue(el, value){ 
    propertyElem.setValues({ 
        [el.id]:[value] 
    }, true);
}


function submitBtnClick (el){
    try{
        const value = $$("editPropTextarea").getValue();
      
        setPropValue(el, value);
 
        $$("table-editForm").setDirty(true);

        setDataToStorage(el, value);
     
    } catch (err){
        errors_setFunctionError(
            err, 
            editForm_logNameFile, 
            "submitBtnClick"
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
            editForm_logNameFile,
            "setTextareaVal"
        );
    }
}

function createModalBox(el, area){

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

function closePopupClick(el){
  
    const area  = $$("editPropTextarea");

    if (area){
        createModalBox(el, area);
    }

    return closePopupClick;
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

function returnSubmitBtn(el){
    const btn = new Button({

        config   : {
            id       : "editPropSubmitBtn",
            disabled : true,
            hotkey   : "Ctrl+Space",
            value    : "Добавить значение", 
            click    : function(){
                submitBtnClick(el);
            },
        },
        titleAttribute : "Добавить значение в запись таблицы"
    
       
    }).maxView("primary");

    return btn;
}


function createPopup(el){
    const headline = "Редактор поля  «" + el.label + "»";

    const popup = new Popup({
        headline : headline,
        config   : {
            id        : "editTablePopupText",
            width     : 400,
            minHeight : 300,
    
        },

        closeConfig: {
            currElem : el,
        },

        closeClick :  closePopupClick(el),
    
        elements   : {
            padding:{
                left  : 9,
                right : 9
            },
            rows   : [
                returnTextArea(),
                {height : 15},
                returnSubmitBtn(el),
            ]
          
        }
    });
    
    popup.createView ();
    popup.showPopup  ();

    setTextareaVal(el);

    $$("editPropTextarea").focus();
}

function createBtnTextEditor(el){
    const btn = new Button({

        config   : {
            width    : 30,
            height   : 29,
            icon     : "icon-window-restore", 
            click    : function(){
                createPopup(el);
            },
        },
        titleAttribute : "Открыть большой редактор текста"
    
       
    }).minView();
    
    try{
        $$("propertyRefbtnsContainer").addView(btn);
    } catch (err){
        errors_setFunctionError(err,editForm_logNameFile,"createBtnTextEditor");
    }
}



function createPopupOpenBtn(el){
    propertyElem = $$("editTableFormProperty");

    createBtnTextEditor(el);
    Action.showItem($$("tablePropBtnsSpace"));
}



//create mediator
class EditForm {
    static createForm (){
        $$("flexlayoutTable").addView(editTableBar());
        Action.enableItem($$("table-newAddBtnId"));
    }

    static defaultState (clearDirty = true){
        editTableDefState(clearDirty);
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


//create server actions
function unsetDirtyProp(){
 
    $$("table-editForm").setDirty(false);
    mediator.tabs.setDirtyParam();
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
            editForm_logNameFile,
            "updateTable"
        );
    }  
    
}



function dateFormatting(arr){
    const formattingArr = arr;
    if (isArray(formattingArr, editForm_logNameFile, "dateFormatting")){
        const vals          = Object.values(arr);
        const keys          = Object.keys(arr);
      
        if (keys.length){
            keys.forEach(function(el, i){
                const prop       = $$("editTableFormProperty");
                const item       = prop.getItem(el);
                const formatData = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
        
                if ( item.type == "customDate" ){
                    formattingArr[el] = formatData(vals[i]);
                }
            });
        } else {
            errors_setFunctionError(
                "array length is null",
                editForm_logNameFile,
                "dateFormatting"
            );
        }
      
    }
  


    return formattingArr;
}

function formattingBoolVals(arr){
    const table = $$( "table" );
    const cols  = table.getColumns();
    if (isArray(cols, editForm_logNameFile, "formattingBoolVals")){
        cols.forEach(function(el,i){

            if ( arr[el.id] && el.type == "boolean" ){
                if (arr[el.id] == 2){
                    arr[el.id] = false;
                } else {
                    arr[el.id] = true;
                }
            }
        });
    }
    

    return arr;

} 

function createSentObj (values){
    const uniqueVals     = uniqueData     (values    );
    const dateFormatVals = dateFormatting (uniqueVals);
    return formattingBoolVals(dateFormatVals);
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
            const sentObj = createSentObj (itemData);


            return new ServerData({
    
                id           : `${currId}/${id}`
               
            }).put(sentObj).then(function(data){
            
                if (data){
            
                    if (updateSpace){
                        form.defaultState();
                    }

                 // для модальных окон без перехода на другую стр.
                    if (updateSpace || !isNavigate){ 
                        updateTable   (itemData);
                    }

                    unsetDirtyProp();

                    setLogValue(
                        "success", 
                        "Данные сохранены", 
                        currId
                    );

                    return true;
                }
                 
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
            editForm_logNameFile, 
            "saveItem"
        );
    }
}


// post
function removeNullFields(arr){
    const vals    = Object.values(arr);
    const keys    = Object.keys(arr);
    const sentObj = {};

    if (isArray(vals, editForm_logNameFile, "removeNullFields")){
        vals.forEach(function(el,i){
            if (el){
                sentObj[keys[i]]= el;
            }
            dateFormatting(arr);
        });
    }
   

    return sentObj;
}

function setCounterVal (remove){
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
            editForm_logNameFile, 
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

    setCounterVal ();
}

function createPostObj(newValues){
    const notNullVals    = removeNullFields(newValues);
    const dateFormatVals = dateFormatting  (notNullVals);
    return formattingBoolVals(dateFormatVals);
}


function postTable (updateSpace, isNavigate, form){
    const currId  = getItemId ();
    const isError = validateProfForm().length;
  
    if (!isError){
        const property  = $$("editTableFormProperty");
        const newValues = property.getValues();
        const postObj   = createPostObj(newValues);

        return new ServerData({
            id : currId

        }).post(postObj).then(function(data){
        
            if (data){

                const id = data.content.id;
                if (id){
                    newValues.id = id;


                    if (updateSpace){
                        form.defaultState();
                    }
    
                // для модальных окон без перехода на другую стр.
                    if (updateSpace || !isNavigate){ 
                        addToTable    (newValues);
                    }
    
                    unsetDirtyProp();
    
                    setLogValue(
                        "success",
                        "Данные успешно добавлены",
                        currId
                    );
    
                    return true;
                }


               
               
            }
             
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
            const id         = formValues.id;

            new ServerData({
    
                id           : `${currId}/${id}.json`,
               
            }).del(formValues).then(function(data){
            
                if (data){
                    form.defaultState();

                    unsetDirtyProp();
         
                    setLogValue(
                        "success",
                        "Данные успешно удалены"
                    );
                    removeRow();
                    setCounterVal (true);
                     
                }
                 
            });
    
        }
    );

}


//create states

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
            editForm_logNameFile,
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

function unsetDirtyEditFormProp(){
    $$("table-editForm").setDirty(false);
    mediator.tabs.setDirtyParam();
}

function editTablePostState(){
    const table = $$("table");
    initPropertyForm();
    setWorkspaceState (table);
    setStatusProperty("post");
    unsetDirtyEditFormProp();
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
            editForm_logNameFile,
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
            Button.transparentDefaultState();
            adaptiveView (editForm);
            editForm.show();
        }

        setStatusProperty("put");
 
    } catch (err){   
        errors_setFunctionError(
            err,
            editForm_logNameFile,
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



function editTableDefState(clearDirty){
    const form = $$("table-editForm");
    
    if (clearDirty){
        unsetDirtyEditFormProp();   
    } else {
        if (form){
            form.setDirty(false);   
        }

    }
 

    
    Action.hideItem   ($$(form                ));
    Action.hideItem   ($$("tablePropBtnsSpace"));
    Action.hideItem   ($$("table-saveNewBtn"  ));
    Action.hideItem   ($$("table-saveBtn"     ));

    Action.showItem   ($$("tableContainer"    ));
    Action.showItem   ($$("EditEmptyTempalte" ));

    Action.enableItem ($$("table-newAddBtnId" ));

    Action.disableItem($$("table-delBtnId"   ));

    Action.removeItem ($$("propertyRefbtnsContainer"));

    defPropertyState  ();

    setStatusProperty (null);
}

//create property

const containerId = "propertyRefbtnsContainer";


function createDateEditor(){
    webix.editors.$popup = {
        date:{
           view : "popup",
           body : {
            view        : "calendar",
            weekHeader  : true,
            events      : webix.Date.isHoliday,
            timepicker  : true,
            icons       : true,
           }
        }
     };
}



function createEmptySpace(){
    $$(containerId).addView({
        height : 29,
        width  : 1
    });
}


function createBtnsContainer(refBtns){
    try{
        refBtns.addView({
            id   : containerId,
            rows : []
        });
    } catch (err){
        errors_setFunctionError(
            err, 
            editForm_logNameFile, 
            "createBtnsContainer"
        );
    }
}

function returnArrayError(func){
    errors_setFunctionError(
        "array length is null", 
        editForm_logNameFile, 
        func
    );
}

function setToolBtns(){
    const property      = $$("editTableFormProperty");
    const refBtns       = $$("propertyRefbtns");
    const propertyElems = property.config.elements;

    Action.removeItem($$(containerId));

    createBtnsContainer(refBtns);

    if (propertyElems && propertyElems.length){
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
    } else {
        returnArrayError("setToolBtns");
    }

}

function addEditInputs(arr){
    const property = $$("editTableFormProperty");
    property.define("elements", arr);
    property.refresh();
}

function editForm_returnTemplate(el){
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
    const template =  editForm_returnTemplate(el);
    template.type  = "customDate";

    return template;

}


function comboTemplate(obj, config){
    const value = obj.value;
    const item  = config.collection.getItem(value);
    return item ? item.value : "";
}
function createReferenceInput(el){
   
    const template =  editForm_returnTemplate(el);    
    
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
    const template =  editForm_returnTemplate(el);    
 
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


function createTextInput(el){
    const template =  editForm_returnTemplate(el);

    if (el.length == 0 || el.length > 512){
        template.customType="popup";

    } 
    template.type = "text";
    return template;
}

function addIntegerType(el){
    const template =  createTextInput(el);
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
        propElem = createTextInput(el);
    }

    return propElem;
}
function findContentHeight(arr){
    let result = 0;
    if (arr && arr.length){
     
        arr.forEach(function(el, i){
            const height = el.$height;
            if (height){
                result += height;
            }
      
        });
    } else {
        returnArrayError("findContentHeight");
    }
  
 
    return result;
}

function findHeight(elem){
    if (elem && elem.isVisible()){
        return elem.$height;
    }
}
 

function setEditFormSize(){
    const form   = $$("table-editForm");
    const childs = form.getChildViews();

    const contentHeight = findContentHeight(childs);
    
    const containerHeight = findHeight($$("container"));

    if(contentHeight < containerHeight){
        const scrollBugSpace = 2;
        form.config.height   = containerHeight - scrollBugSpace;
        form.resize();
    }

}


function createProperty (parentElement) {

    const property         = $$(parentElement);
    const columnsData      = $$("table").getColumns(true);
    const elems            = property.elements;
    const propertyLength   = Object.keys(elems).length;

    try {

     
        if ( !propertyLength ){
            const propElems = [];

            if (columnsData && columnsData.length){
                columnsData.forEach((el) => {

                    const propElem = returnPropElem(el);
                    propElems.push(propElem);
    
                });
    
            
                createDateEditor();
                addEditInputs   (propElems);
                setToolBtns     ();
            } else {
                returnArrayError("createProperty");
            }
          
    

        } else {
            property.clear();
            property.clearValidation();

            if(parentElement == "table-editForm"){
                $$("table-delBtnId").enable();
            }
        }


        setEditFormSize();
    } catch (err){
        errors_setFunctionError(
            err, 
            editForm_logNameFile, 
            "createEditFields"
        );
    }
}




//create form btns

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


const newAddBtn = new Button({
    
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

const delBtn = new Button({
    
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


const saveBtn = new Button({
    
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


const saveNewBtn = new Button({
    
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


const backTableBtn = new Button({
    
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

//create layout
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





;// CONCATENATED MODULE: ./src/js/components/table/filter.js
 
///////////////////////////////
// Медиатор                                                 (create mediator)
//
// Очищение пространства фильтра                            (create clear space)
//
// Описание текущего фильтра для пересоздания               (create filter info)
//
// Сброс фильтра с таблицы                                  (create reset table)
//
// Сохранения состояния фильтра в local storage             (create local storage data)
//
// Показ и сокрытие полей фильтра                           (create visible fields)
//
// Кнопка применить фильтры                                 (create submit btn)
//
// Кнопка сброса фильтров                                   (create reset btn)
//
// Кнопка сохранить в библиотеку шаблон                     (create lib btn)
//
// Кнопка вернуться к таблице                               (create back btn)
//
// Медиатор для кнопок                                      (create btns mediator)
//
// Кнопка, открывающая попап с редактором фильтров          (create open btn)
//
// Создание чекбоксов в редакторе                           (create checkboxes)
//
// Создание таба с библиотекой шаблонов                     (create lib)
//
// Медиатор                                                 (create mediator)
//
// Очищение пространства фильтра                            (create clear space)
//
// Описание текущего фильтра для пересоздания               (create filter info)
//
// Сброс фильтра с таблицы                                  (create reset table)
//
// Сохранения состояния фильтра в local storage             (create local storage data)
//
// Показ и сокрытие полей фильтра                           (create visible fields)
//
// Кнопка с выбором операции элемента фильтра               (create operation field btn)
//
// Создание кнопок полей фильтра                            (create layout field btns)
//
// Кнопка с добавлением и удалением элемента фильтра        (create field context btn)
//
// Создание дочернего элемента                              (create child field)
//
// Типы полей элемента                                      (create field types)
//
// Создание родительского элемента фильтра                  (create parent field)
//
// Кнопка с выбором операции и/или                          (create logic operation field btn)
//
// Layout фильтра                                           (create filter form layout)
//
// Уведомление о новых несохранённых изменениях в шаблоне   (create notify new add)
//
// Дефолтное состояние фильтра                              (create default filter state)
//
// Кнопка в тулбаре таблицы, открывающая фильтр             (create open filter btn)
//
// Загрузка данных о шаблонах                               (create load templates data)
//
// Кнопка применения изменений фильтра                      (create submit popup btn)
//
// Кнопка удаления шаблона                                  (create template del btn)
//
// Layout таббара с табами                                  (create layout tabbar)
//
// Layout попапа с таббаром                                 (create layout edit popup)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////












const filter_logNameFile = "table/filter";



//create mediator
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
            if (childs.length){
                childs.forEach(function(el, i){
                    result[el.config.idCol] = i;
                  
                });
            }
           
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
        if (keys.length){
            keys.forEach(function(key){
                delete visibleInputs[key];
            });
        }  
    }

    static removeItemChild(key, child){
        const item = this.getItem(key);

        if (item.length){
            item.forEach(function(id, i){
                if (id == child){
                    item.splice(i, 1);
                }
            });
        } 
       
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
        if (cols && cols.length){
            cols.forEach(function(col){
                const found = visibleInputs.find(element => element == col.id);
        
                if (!found){
                    const htmlElement = document.querySelector("." + col.id ); 
                    Filter.addClass   (htmlElement, "webix_hide-content");
                    Filter.removeClass(htmlElement, "webix_show-content");
                }
            });
        } 
        
    }

    static enableSubmitButton(){
        const btn = $$("btnFilterSubmit");
   
        const inputs   = this.getAllChilds (true);
        let fullValues = true;
    
        if (inputs.length){
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


//create clear space

function hideElements(arr){
    if (arr && arr.length){
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

}


function clearSpace(){

    const values = Filter.getAllChilds ();
 
    if (values && values.length){
        values.forEach(function(el){
    
            if (el.length){
                hideElements(el);
            }
        });
    
        Action.disableItem($$("btnFilterSubmit"));
    }

}


//create filter info

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

    if (arr && arr.length){
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
                        filter_logNameFile,
                        "setOperation"
                    );
                }
                
            }  
            
        });
    }

  

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


//create reset table


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
            filter_logNameFile,
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
            filter_logNameFile,
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
   
    return await new ServerData({
        id : `smarts?${query}`
       
    }).get().then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (content){
                table.config.filter = null;

                setDataTable        (content, table);
                setFilterCounterVal (table);
                setLogValue         ("success", "Фильтры очищены");

                return true;

            }
        }
         
    });

}



//create local storage data


function filter_setTabInfo(id, sentVals){
    const tabData =  mediator.tabs.getInfo();
 
    if (tabData){
        if (!tabData.temp){
            tabData.temp = {};
        }
        tabData.temp.filter = sentVals;
    }
}

function setState () {
    const result   = Filter.getFilter();
    const template = Filter.getActiveTemplate();
    const id       = getItemId();
 
    const sentObj  = {
        id             : id,
        activeTemplate : template,
        values         : result
    };

    filter_setTabInfo(id, sentObj);

    webix.storage.local.put(
        "currFilterState", 
        sentObj
    );
    
}



//create visible fields

const showClass   = "webix_show-content";
const hideClass   = "webix_hide-content";

let segmentBtnElem;
let elementClass;
let condition;
let currElement;

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


        const unique = checkChild(elementClass, currElement);

        if (unique){
            Filter.pushInPull(elementClass, currElement);
            Action.showItem  (segmentBtnElem);
        }
     

    } else {
        Filter.clearItem(elementClass);
    }

}


function showInputContainers(){
    Action.showItem($$(currElement));
    Action.showItem($$(currElement + "_container-btns"));
}

function setValueHiddenBtn(btn, value){
    if( btn ){
        btn.setValue(value);
    }
}
function setDefStateBtns(){
    const operBtn    = $$(currElement + "-btnFilterOperations");
    const btns       = $$(currElement + "_container-btns"     );

    
    setValueHiddenBtn(operBtn   , "=");
    setValueHiddenBtn(segmentBtnElem,  1);
    Action.hideItem  (segmentBtnElem    );
    Action.hideItem  (btns          );
}

function setDefStateInputs (){
    $$(currElement).setValue("");
    $$(currElement).hide();
}


function setHtmlState(add, remove){
  
    const css = ".webix_filter-inputs";
    const htmlElement = document.querySelectorAll(css);
    
    if (htmlElement && htmlElement.length){
        htmlElement.forEach(function (elem){
            const isClassExists = elem.classList.contains(elementClass);
    
            if (isClassExists){
                Filter.addClass   (elem, add   );
                Filter.removeClass(elem, remove);
            } 

        });
    }

}

function removeChilds(){
    const container  = $$(currElement + "_rows");

    if (container){
        const containerChilds = container.getChildViews();

        if (containerChilds && containerChilds.length){
            const values = Object.values(containerChilds);
            const childs = [];
        
          
            if (values && values.length){
                values.forEach(function(elem){
                    const id = elem.config.id;
        
                    if (id.includes("child")){
                        childs.push($$(id));
                    }
        
                });
            } 
        
            if (childs && childs.length){
                
                childs.forEach(function(el){
                    Action.removeItem(el);
                });
            }
        }
    }

  
}

function isChildExists(){
    let checkChilds = false;


    const container = $$(currElement + "_rows");

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


    if($$(currElement + "_rows")){
        removeChilds();
    }

    setDefStateInputs();
    setDefStateBtns  ();
    
}


function visibleField (visible, cssClass){

 
    if (cssClass !== "selectAll" && cssClass){

        condition    = visible;
        elementClass = cssClass;
        currElement  = cssClass + "_filter";

        segmentBtnElem   = $$( currElement + "_segmentBtn");
        
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


//create submit btn

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
    } else if (value === "="){
        operation = "%3D";
    } else 
    {
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

function isDate(value){
    if (webix.isDate(value)){
        return true;
    }
}

function setValue(name, value){

    let sentValue = "'" + value + "'";


    if (isBool(name)){
        sentValue = returnBoolValue(value);
    }

    if (isDate(value)){
    
        const format = webix.Date.dateToStr("%d.%m.%Y+%H:%i:%s");
        sentValue = format(value);
    }
 
    return sentValue;
}

function filter_createQuery (input){
    const name      = setName           (input.name);
    const value     = setValue          (input.name, input.value);
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

    if (inputs && inputs.length){
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
    } 




    return valuesArr;
}


function createGetData(){
       
    const format         = "%d.%m.%Y %H:%i:%s";
    const postFormatData = webix.Date.dateToStr(format);
    const valuesArr      = createValuesArray();
    const query          = [];

    if (valuesArr && valuesArr.length){
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
                query.push(filter_createQuery(el));
               
            }
    
        });
    
    } 
 
    return query;
}

function filter_createSentQuery(){
    const query = createGetData();
    return query.join("");
}

function setConfigToTab(query){
    const data = mediator.tabs.getInfo();
    if (!data.temp){
        data.temp = {};
    }

    data.temp.queryFilter = query;

    mediator.tabs.setInfo(data);

}

function setTableConfig(table, query){
     
    table.config.filter = {
        table:  table.config.idTable,
        query:  query
    };

 

    setConfigToTab(query);

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
            filter_logNameFile, 
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
            filter_logNameFile, 
            "setCounterVal"
        );
    }
}

function filter_errorActions(){
    Filter.showApplyNotify(false);
}

function filterSubmitBtn (){
                           
 
    const isValid = $$("filterTableForm").validate();

    if (isValid){

        const currTableView = getTable();
        const query         = filter_createSentQuery();

        setTableConfig(currTableView, query);

        new ServerData({
    
            id           : `smarts?query=${query}`,
            isFullPath   : false,
            errorActions : filter_errorActions
           
        }).get().then(function(data){
          
            if (data){
                const reccount = data.reccount;
                const content  = data.content;

                Filter.showApplyNotify();
                setData         (currTableView, content);
                setCounterValue (reccount);
                Action.hideItem ($$("tableFilterPopup"));
        
                setLogValue(
                    "success",
                    "Фильтры успшено применены"
                );
            }
             
        });


    } else {
        setLogValue(
            "error", 
            "Не все поля формы заполнены"
        );
    }
  

}


const submitBtn = new Button({

    config   : {
        id       : "btnFilterSubmit",
        hotkey   : "Ctrl+Shift+Space",
        disabled : true,
        value    : "Применить фильтры", 
        click    : filterSubmitBtn,
    },
    titleAttribute : "Применить фильтры"


}).maxView("primary");



//create reset btn

function removeValues(collection){

    if (collection && collection.length){

        collection.forEach(function(el){
            const idChild = el.includes("_filter-child-");

            if (idChild){
                Action.removeItem($$(el + "-container"));
            }
     
        });
    } 
    
}

function removeChildsField(){
   const keys = Filter.getItems();

    if (keys && keys.length){
        keys.forEach(function(key){ 
            const item = Filter.getItem(key);
            removeValues(item);
        });
    } 

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


    if (inputs && inputs.length){
        inputs.forEach(function(elem){
            Filter.addClass(elem, hideClass);
        });
    } 
      
  
}




function clearInputSpace(){

    removeChildsField   ();
  
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

function filter_setToTabStorage(){
    const data = mediator.tabs.getInfo();

    if (data.temp && data.temp.queryFilter){
        data.temp.queryFilter = null;
    }
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
                    filter_setToTabStorage()
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



const resetBtn = new Button({
    
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




//create lib btn

let nameTemplate;
 
let sentObj;
let currName;


async function isTemplateExists(owner, currNameTemplate){
    let exists = {
        check : false
    };

    await new ServerData({
        id : `smarts?query=userprefs.name+=+%27${currName}%27+and+userprefs.owner+=+${owner}`
       
    }).get().then(function(data){
    
        if (data && data.content){
            const item = data.content[0];

            if (item){
              
                const prefs = JSON.parse(item.prefs);
                if (prefs){
                    item.prefs = prefs;
                 
                    const templates = prefs.filterTemplates;
 
                    if(templates && templates.length){  // шаблоны уже есть

                        templates.forEach(function(template, i){
                            // шаблон с именем уже существует
                            if (template.name == currNameTemplate){
                                exists = {
                                    check : true,
                                    item  : item,
                                    index : i
                                };
                            }
                        });

                        // шаблон с именем уникален
                        if (!exists.check){
                            exists.item = item;
                        }

                    }  else {   // шаблонов нет
                        exists = {
                            check : false,
                            item  : item
                        };
                    }
                    
                }
            }

        }
         
    });


    return exists;
}


async function saveExistsTemplate(sentObj){
    modalBox(   "Шаблон с таким именем существует", 
                "После сохранения предыдущие данные будут стёрты", 
                ["Отмена", "Сохранить изменения"]
                )
    .then(function(result){

        if (result == 1){
            saveNewTemplate(sentObj);
        }
    });
 
}

function successNotify(){
    setLogValue(
        "success",
        "Шаблон" +
        " «" +
        nameTemplate +
        "» " +
        " сохранён в библиотеку"
    );
}

function saveNewTemplate(sentObj){
    
     
    new ServerData({
        id : `userprefs/${sentObj.id}`
    
    }).put(sentObj).then(function(data){

        if (data){

            successNotify();
        }
        
    });


}

function postNewTemplate(sentObj){
    new ServerData({
        id : `userprefs`
    
    }).post(sentObj).then(function(data){

        if (data){

            successNotify();
        }
        
    });

}

async function saveTemplate (result){ 

    const user = await returnOwner();

   
    const currId = getItemId();
    const values = Filter.getFilter().values;

    
    nameTemplate = result;
    currName     = `fields/${currId}`;
    
    const template = {
        name   : nameTemplate,
        table  : currId,
        values : values
    };


    const existsInfo = await isTemplateExists(user.id, nameTemplate);
 
    const isExists   = existsInfo.check;
 
    if (isExists){
        const item  = existsInfo.item;
        const index = existsInfo.index;

        if (item){

            item.prefs.filterTemplates[index] = template;
            sentObj = item;
        
            saveExistsTemplate(sentObj); 
        }
     
    } else {
        const item = existsInfo.item;
        
        if (item){ // запись таблицы уже есть
            if (!item.prefs.filterTemplates){
                item.prefs.filterTemplates = [];
            }
        
            item.prefs.filterTemplates.push(template);
            
            sentObj = item;
            saveNewTemplate(sentObj);
        } else { // записи нет
            sentObj = {
                name    : currName,
                owner   : user.id,
                prefs   : {
                    filterTemplates:[
                        template,
                    ]
                }
            };
   
            postNewTemplate(sentObj);
           
        }

      

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
            filter_logNameFile,
            "filterSubmitBtn"
        );
    }
}

const librarySaveBtn = new Button({
    
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



//create back btn

function setBtnFilterState(){
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



function filter_backTableBtnClick() {
    defaultFormState    ();
    clearTableSelection ();
    setBtnFilterState   ();
  
}



const backBtn = new Button({
    
    config   : {
        id       : "table-backTableBtnFilter",
        hotkey   : "Shift+Q",
        hidden   : true,  
        icon     : "icon-arrow-left", 
        click   : function(){
            filter_backTableBtnClick();
        },
    },
    titleAttribute : "Вернуться к таблице"

   
}).minView();

//create btns mediator
function buttonsFormFilter (name) {
    if ( name == "formResetBtn" ) {
        return resetBtn;
    } else if ( name == "formBtnSubmit" ){
        return submitBtn;
    } else if ( name == "formEditBtn" ){
        return editBtn;
    } else if ( name == "filterBackTableBtn" ){
        return backBtn;
    } else if ( name == "formLibrarySaveBtn" ){
        return librarySaveBtn;
    }
}


//create lib

let user;
let libData;

 

function clearOptionsPull() {
    
    const oldOptions = [];

    const options     = libData.config.options;
    const isLibExists = options.length;

    if (libData && isLibExists && options && oldOptions){

        options.forEach(function(el){
            oldOptions.push(el.id);
        });

        oldOptions.forEach(function(el){
            libData.removeOption(el);
        });

    }
}


function createOption(i, data){

    const template = data;
 
    libData.addOption({
        id    : i + 1, 
        value : template.name,
        prefs : data
    });

}

function setTemplates(templates){
   
    templates.forEach(function(data, i){
        createOption(i, data);
        
    });


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

    libData       = $$("filterEditLib");
    user          = await returnOwner();

    const idField = getItemId();

    clearOptionsPull();

    if (user && idField){

        const name    = `fields/${idField}`;
    
        new ServerData({
            id : `smarts?query=userprefs.name+=+%27${name}%27+and+userprefs.owner+=+${user.id}`
            
        }).get().then(function(data){
        
            if (data){
        
                const content = data.content;
        
                if (content && content.length){

                    const item = content[0];

                    if (item.prefs){
                        const prefs     = JSON.parse(item.prefs);
                        const templates = prefs.filterTemplates;

                        if (templates && templates.length){
                            setTemplates(templates);
                        }
                        
                    }
                }
            }


        
            const lib = $$("filterEditLib");
        
            if (lib && lib.data.options.length == 0 ){
                setEmptyOption  ();
            }
                
        });
        
    }



   
}



//create checkboxes

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
            filter_logNameFile,
            "popupSizeAdaptive"
        );
    }
}

function setValueCheckbox(){
    const content     = $$("editFormPopupScrollContent");

    if (content){
        const checkboxes  = content.getChildViews();
        const isSelectAll = $$("selectAll").getValue();
    
        if(checkboxes && checkboxes.length){
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
        } 
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
    const form = $$("filterTableForm");
    if (form){
        const filterTableElements  = form.elements;

        if (filterTableElements){
            const values = Object.values(filterTableElements);
    
            if (values && values.length){
                values.forEach(function(el){
                    checkboxes.push(
                        createCheckboxData(el.config)
                    );
                });
            } 
        }
     
    }
  

    return checkboxes;
}


function getStatusCheckboxes(array){
    let counter = 0;

    
    if (array && array.length){
        array.forEach(function(el){
            const isCheckbox = el.config.id.includes("checkbox");
            
            if (isCheckbox){
                const value = el.config.value;

                if ( !(value) || value == "" ){
                    counter ++;
                }
            }
            
        });
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
            filter_logNameFile,
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

function filter_returnTemplate(el){
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


function createCheckbox(el){

    const template = filter_returnTemplate(el);

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
            filter_logNameFile, 
            "addCheckboxesToLayout"
        );
    }
}

function createCheckboxes(){

    const checkboxesLayout = [
        returnSelectAllCheckbox()
    ];


    const formData = getAllCheckboxes();

    if (formData && formData.length){
        formData.forEach(function (el){
            const isChild  = el.id.includes("child");

            if(!isChild){
                checkboxesLayout.push(
                    createCheckbox(el)
                );
            }
        });

        addCheckboxesToLayout(checkboxesLayout);
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
    const minWidth = 1200;
    if (window.innerWidth < minWidth ){
        popupSizeAdaptive();
    }
 
    createCheckboxes();
 
    stateSelectAll();
}

//create open btn
function editFiltersBtn (){

    createFilterPopup();

    createLibTab ();

    createFieldsTab();
 
}

const editBtn = new Button({
    
    config   : {
        hotkey   : "Alt+A",
        value    : "Открыть редактор", 
        click    : editFiltersBtn
    },
    titleAttribute : "Добавить/удалить фильтры"

   
}).maxView();





//create operation field btn


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
            filter_logNameFile,
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

    const btn = new Button({
    
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



//create field context btn

function getVisibleInfo(lastIndex = false){
 
    const values = Filter.getAllChilds();

    const fillElements = [];
    
    let counter = 0;

    if (values && values.length){
        values.forEach(function(value, i){
            if (value.length){
                counter ++;
                fillElements.push(i);
            }
        });
    }
 

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

    if (array && array.length){

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

    if (keys && keys.length){
        keys.forEach(function(key){
            const item = Filter.getItem(key);
            if (item.length){
                currInputs.push(key)
            }    
        });
    
    }
 

    const lastKey = returnLastItem(currInputs);
  
    if (inputsKey == lastKey){
        return true;
    }
 
   
}


function filter_findInputs(id, keys){

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

        const inputs     = filter_findInputs (inputsKey, keys);
        const checkInput = isLastInput(inputs.lastInput, thisInput);
    
        if (checkInput){
            
            hideBtn( inputs.lastInput );
        }
        

    } else if (action === "remove" && checkKey){
 
        const inputs     = filter_findInputs (inputsKey, keys);
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


    if (mainInput && mainInput.length){
        mainInput.forEach(function(el){
            Action.hideItem(el);
        });

        if (btnOperations){
            btnOperations.setValue(" = ");
        } else {
            errors_setFunctionError(
                `button is not defined`, 
                filter_logNameFile, 
                "hideMainInput"
            ); 
        }
      
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

    if (item && item.length){
        item.forEach(function(input, i){
            const inputContainer = input + "-container";
    
            if (inputContainer === thisContainer){
                childPosition = i + 1;
            }
        });
    
        if (!isVisibleParent){
            childPosition++;
        }
    
    }

    return childPosition;
}



let thisInput;
let thisContainer;
let filter_element;
 
function addChild(){
    const segmentBtn = $$(thisInput  + "_segmentBtn");

    const childPosition = returnInputPosition(
        filter_element.id, 
        thisContainer
    );

    const idChild = createChildFields (filter_element, childPosition);
    hideSegmentBtn  ("add", filter_element.id, idChild);
    Action.showItem (segmentBtn);
    Filter.setStateToStorage();
}


function removeInput(){
    hideSegmentBtn           ("remove", filter_element.id    ,thisInput);
    Filter.removeItemChild   (filter_element.id, thisInput);
    Action.removeItem        ( $$(thisContainer));
    showEmptyTemplate        ();
    Filter.setStateToStorage ();
    setLogValue              ("success", "Поле удалено"); 
}


function clickContextBtnChild(id, el, thisElem){

    filter_element       = el;
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

    const contextBtn = new Button({
    
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




//create layout field btns
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



//create child field

let fieldElement;
let elemId;
let uniqueId;
let position;
let typeField;

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

function returnLayoutBtns(input){
    const btns = [
       
        {   id      : webix.uid(),
            height  : 105,
            rows    : [
              
                {cols : [
                   input,              
                    createBtns(
                        fieldElement, 
                        typeField, 
                        true, 
                        uniqueId
                    ) 
                ]},

                segmentBtn(
                    fieldElement, 
                    true, 
                    uniqueId
                ),  
            ]
        }
    ];

    return btns;

}

function addInputToContainer(btns){
    const containerRows = $$(elemId + "_filter_rows");
    const idContainer   = 
    elemId + "_filter-child-" + uniqueId + "-container";

 
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

    const input = filter_field (
        uniqueId, 
        typeField, 
        fieldElement
    );

    addInputToStorage      (input.id);

    const btns = returnLayoutBtns(input);

    addInputToContainer    (btns);
}


function getTypeField(el){
    if (el.type !== "boolean"){
        typeField = el.editor;
    } else {
        typeField = "boolean";
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
    const  idCreateField = elemId + "_filter-child-" + uniqueId;
    return idCreateField;
}

function createChildFields (el, customPosition) {
  
    fieldElement    = el;
    elemId          = el.id;
    uniqueId        = webix.uid();

 
   
    getPosition (customPosition);
    getTypeField(el);

    addInput    ();

    return getIdCreatedField();
}




//create field types
    
let el ;
let typeFieldElem;
let uniqueIdElem;
let partId;

function enableSubmitBtn(){
    Action.enableItem($$("btnFilterSubmit"));
}

function createFieldTemplate(){

    const elemId  = el.id;
    const fieldId = elemId + partId;

    const fieldTemplate = {
        id        : fieldId, 
        name      : fieldId,
        label     : el.label,
        columnName: elemId,
        labelPosition:"top",
    };

    if (!uniqueIdElem) fieldTemplate.hidden = true;

    return fieldTemplate;
}

function activeState(){
    enableSubmitBtn();
    Filter.setStateToStorage();
    $$("filterTableForm").clearValidation();
}

function filter_createText(type){
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
    if (el.editor && el.editor == "combo"){
        
        return el.type.slice(10);
    } 
}

function filter_createCombo(type){

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

function filter_createDatepicker() {
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
 
    if (typeFieldElem=="text"){
        return filter_createText("text");

    } else if (typeFieldElem=="combo"){
        return filter_createCombo("default");

    } else if (typeFieldElem=="boolean"){
        return filter_createCombo("bool");

    } else if (typeFieldElem=="date"){
        return filter_createDatepicker();

    } else if (typeFieldElem=="integer"){
        return filter_createText("int");

    }

}


function filter_field (id, type, element){
    uniqueIdElem = id;
    if (!uniqueIdElem){ // parent input
        partId = "_filter";
    } else {
        partId = "_filter-child-" + uniqueIdElem;
    }


    el              = element;
    typeFieldElem   = type;

    return createField();
}






//create parent field

let parentElement;
let viewPosition;

let inputTemplate;


function filter_returnFilter(el){
 
    if (el.type == "datetime"){
        return [
            filter_field(false, "date", el),
            createBtns(el, "date"),  
        ];

    } 
    else if (el.type.includes("reference")) {
        return [
            filter_field(false, "combo", el),
            createBtns(el, "combo"), 
        ];
 
    } 
    else if (el.type.includes("boolean")) {
        return [
            filter_field(false, "boolean", el),
            createBtns(el, "combo")
        ];
    
    } 
    else if (el.type.includes("integer")) {
        return [
            filter_field(false, "integer", el),
            createBtns(el, "integer"), 
        ];
    }
    else{

        return [ 
            filter_field(false, "text", el),
            createBtns(el, "text"), 
        ];
    }
}


function generateElements(){
    const inputsArray = [];
    const columnsData = $$("table").getColumns(true);
    
    if (columnsData.length){
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
                                filter_returnFilter(el),
                            },
                            segmentBtn(el, false),
                            
                        ]
                    }
                ]
            };

            inputsArray.push (filter);

        });

    }
    
    return inputsArray;
    

}

function filter_createFilter(arr){

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
                filter_createFilter(inputs), 
                viewPosition
            );
        }
    } catch (err){ 
        errors_setFunctionError(
            err,
            filter_logNameFile,
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
            filter_logNameFile,
            "clearFormValidation"
        );
    }
}

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


}




//create logic operation field btn

function segmentBtn(element, isChild, uniqueId){
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
            onChange:function(v){
                Filter.setStateToStorage();
                if (Filter.getActiveTemplate()){
                    Action.showItem($$("templateInfo"));
                }
            }
        }
    };
}




//create filter form layout

function returnBtns(){
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
            rows      :  returnBtns()
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





//create notify new add
function putTemplate(id, sentObj, nameTemplate){

    new ServerData({
    
        id : `userprefs/${id}`
       
    }).put(sentObj).then(function(data){
    
        if (data){
    
            setLogValue(
                "success",
                "Шаблон" +
                " «" +
                nameTemplate +
                "» " +
                " обновлён"
            );

            Action.hideItem($$("templateInfo"));
        }
         
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

    putTemplate(id, sentObj, nameTemplate);
    
    
}


function saveTemplateNotify(){
    const template = {
        template   : "Есть несохранённые изменения в шаблоне", 
        height     : 65, 
        borderless : true
    };

    const btn = new Button({
    
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




//create default filter state

function setToolbarBtnState(){
    const node = $$("table-filterId").getNode();

    Filter.addClass   (node, "webix-transparent-btn");
    Filter.removeClass(node, "webix-transparent-btn--primary");
}

function resetTableFilter(){
    const table = getTable();

    if (table){
        table.config.filter = null;
    }

}


function filterFormDefState(){
    const filterContainer = $$("filterTableBarContainer");
    const inputs          = $$("inputsFilter");

    resetTableFilter();

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
    
    setToolbarBtnState();
}




//create open filter btn

const primaryBtnClass   = "webix-transparent-btn--primary";
const secondaryBtnClass = "webix-transparent-btn";

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


let btnClass;

function setPrimaryState(filter){
    Action.hideItem ($$("table-editForm"));
    Action.showItem (filter);

    const isChildExists = filter.getChildViews();

    if(isChildExists){
        createParentFilter("filterTableForm", 3);
    }

    setBtnCssState(
        btnClass, 
        primaryBtnClass, 
        secondaryBtnClass
    );

    Action.showItem($$("filterTableBarContainer"));
}


function setSecondaryState(){
    setBtnCssState(
        btnClass, 
        secondaryBtnClass, 
        primaryBtnClass
    );
    Action.hideItem($$("filterTableForm"));
    Action.hideItem($$("filterTableBarContainer"));
 
    mediator.tabs.clearTemp("currFilterState", "filter");

}

function toolbarBtnLogic(filter){
    btnClass = document.querySelector(".webix_btn-filter");
    const isPrimaryClass = btnClass.classList.contains(primaryBtnClass);
   
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


function filter_filterBtnClick (idTable){
   
   // Filter.clearAll(); // clear inputs storage
  
    const filter    = $$("filterTableForm");
    const container = $$("container");

    filterMaxAdaptive(filter, idTable);

    const width    = container.$width;
    const minWidth = 850;
    const filterMaxWidth = 350;

    if (width < minWidth){
        Action.hideItem($$("tree"));
  
        if (width < minWidth ){
            filterMinAdaptive();
        }

    } else {
        Action.hideItem($$("table-backTableBtnFilter"));
        filter.config.width = filterMaxWidth;
        filter.resize();
    }

 
   
}


// create load templates data

function setValueElem(el, value){
    if (value){
        el.setValue(value);
    }
}

function setBtnsValue(el){
        
    const id = el.id;
    const segmentBtn    = $$(id + "_segmentBtn");
    const operationsBtn = $$(id + "-btnFilterOperations");
 
    setValueElem(segmentBtn   , el.logic    );
    setValueElem(operationsBtn, el.operation);
    
}

function showParentField (el){
  
    const idEl      = el.id;
    const element   = $$(idEl);
    if (element){
        const htmlClass = element.config.columnName;
        Filter.setFieldState(1, htmlClass, idEl);
    
        setBtnsValue(el);
        setValueElem    (element, el.value);
    } else {
        errors_setFunctionError(
            "element is " + element, 
            filter_logNameFile, 
            "showParentField"
        ); 
    }
    
}

function createChildField(el){
    const table = getTable();
    const col   = table.getColumnConfig(el.parent);
 
    const idField = createChildFields  (col, el.index);

    const values  = el;
    values.id     = idField;
  
    setBtnsValue(values);

    setValueElem    ($$(idField), el.value);


}


function returnLastItemFilter(array){
    const indexes       = Filter.getIndexFilters();
    const selectIndexes = [];

    if (array && array.length){

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

function hideSegmentButton(){
    const lastCollection = returnLastItemFilter  (Filter.getItems());
    const lastInput      = returnLastChild (Filter.getItem(lastCollection));
    const segmentBtn     = $$(lastInput + "_segmentBtn");

    Action.hideItem(segmentBtn);
}


function createWorkspace(prefs){

    Filter.clearFilter();
 
    if (prefs && prefs.length){
        prefs.forEach(function(el){
            if (!el.parent){
                showParentField  (el);
            } else {
                createChildField(el);
            }
       
        });
    
        hideSegmentButton();
     
    }
 
}

function getOption(){
    const lib        = $$("filterEditLib");
    const libValue   = lib.getValue ();
    return lib.getOption(libValue);
}

function showHtmlContainers(){
    const keys = Filter.getItems();

    if (keys && keys.length){
        keys.forEach(function(el){
            const htmlElement = document.querySelector("." + el ); 
            Filter.addClass   (htmlElement, "webix_show-content");
            Filter.removeClass(htmlElement, "webix_hide-content");
        });
    
        Filter.hideInputsContainers(keys); // hidden inputs
    }

}



async function getLibraryData(){
    const radioValue = getOption();

    const template = radioValue.prefs.values;
    createWorkspace(template);

    Action.destructItem($$("popupFilterEdit"));
    Filter.setActiveTemplate(radioValue);

    showHtmlContainers       ();
    Filter.setStateToStorage ();
    Filter.enableSubmitButton();
    Action.hideItem($$("templateInfo"));

}

//create submit popup btn

function returnCollection(value){
    const colId = $$(value).config.columnName;
    return Filter.getItem(colId);
}

function visibleSegmentBtn(selectAll, selectValues){
 
    const selectLength = selectValues.length;

    if (selectValues && selectLength){
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
   
}


function createWorkspaceCheckbox (){
    const popup        = $$("editFormPopup");

    if (popup){
        const values       = popup.getValues();
        const selectValues = [];
    
        try{
            const keys    = Object.keys(values); 

            if (keys && keys.length){

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

  
            }
         
    
        } catch(err){
            errors_setFunctionError(
                err,
                filter_logNameFile,
                "createWorkspaceCheckbox"
            );
        }
    }

}

function visibleCounter(){
    const form = $$("filterTableForm");
    let visibleElements = 0;
    if (form){
        const elements      = $$("filterTableForm").elements;
 
        if (elements){
            const values        = Object.values(elements);
      
            if (values && values.length){
                values.forEach(function(el){
                    const isVisibleElem = el.config.hidden;
                    if ( !isVisibleElem ){
                        visibleElements++;
                    }
                    
                });
            }
          
        }
      
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


function createFilterSpace(){
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
 

async function filter_createModalBox(table){
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
                    filter_setToTabStorage();
                    
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
    createFilterSpace();
    Filter.setStateToStorage ();
    Filter.enableSubmitButton();
    showActiveTemplate();
}

function isUnselectAll(){
    const checkboxContainer = $$("editFormPopupScrollContent");
    let isUnchecked = true;
    if (checkboxContainer){
        const checkboxes = checkboxContainer.getChildViews();

        if (checkboxes && checkboxes.length){
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
        }
 
    
    }
 
    return isUnchecked;

}

function getCheckboxData(){
    const table          = getTable();
    const isFilterExists = table.config.filter;
 
    if (isUnselectAll() && isFilterExists){
        filter_createModalBox(table).then(function(result){
            if (result){
                resultActions();
            }
        });
    } else {
        resultActions();
    }

     
 
}

function showEmptyTemplateElem(){
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
                filter_createModalBox(table).then(function(result){
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
            filter_logNameFile, 
            "popupSubmitBtn"
        );

        Action.destructItem($$("popupFilterEdit"));
    }

    showEmptyTemplateElem();

}




const submitPopupBtn = new Button({
    
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


//create template del btn
let lib;
let radioValue;

function removeOptionState (){

    if (lib){
        const id      = radioValue.id;
        const options = lib.config.options;
        if (options){
            options.forEach(function(el){
                if (el.id == id){
                    el.value = el.value + " (шаблон удалён)";
                    lib.refresh();
                    lib.disableOption(lib.getValue());
                    lib.setValue("");
                }
            });
        }
    }

}

function sentPutData(sentObj){
    new ServerData({
        id : `userprefs/${sentObj.id}`
    
    }).put(sentObj).then(function(data){

        if (data){

            const value = radioValue.value;

            setLogValue(
                "success",
                "Шаблон « " + value + " » удален"
            );
            removeOptionState ();
            Filter.clearFilter();
            Filter.setStateToStorage();
            Action.showItem($$("filterEmptyTempalte"));
        }
        
    });
}


function createModifyPrefs(prefs, item){
    const result  = [];
    let itemPrefs = item.prefs;

    if (itemPrefs){
        itemPrefs = JSON.parse(itemPrefs);
        const templates = itemPrefs.filterTemplates;

        if (templates && templates.length){
            templates.forEach(function(el){

                if (el.name !== prefs.name){
                    result.push(el);
                }
            });
        }
    }

    return result;
}

async function deleteElement(){
    const prefs   = radioValue.prefs;
    const idPrefs = prefs.table;
    const name    = `fields/${idPrefs}`;
    user          = await returnOwner();
 

    new ServerData({
        id : `smarts?query=userprefs.name+=+%27${name}%27+and+userprefs.owner+=+${user.id}`
    
    }).get().then(function(data){
 

        if (data && data.content && data.content.length){
            const item = data.content[0];
    
            if (item){
            
                const sentData = createModifyPrefs(prefs, item);
                let itemPrefs  = item.prefs;

                if (itemPrefs){
                    itemPrefs = JSON.parse(itemPrefs);
                    itemPrefs.filterTemplates = sentData;

                    item.prefs = itemPrefs;

                    

                    sentPutData(item);
                }

  
            }
       
        }
        
    });

}


function resetLibSelectOption(){
    Filter.setActiveTemplate(null);
}


async function userprefsData (){ 

    lib = $$("filterEditLib");
    const libValue = lib.getValue();
    radioValue = lib.getOption(libValue);

    const idPrefs = radioValue.prefs.table;
 
    if (idPrefs){
        deleteElement       (radioValue, lib);
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


const removeBtn = new Button({
    
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



//create layout tabbar

const filter_btnLayout = {
    cols   : [
        submitPopupBtn,
        {width : 5},
        removeBtn,
    ]
};

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
            filter_logNameFile, 
            "filterLibrary"
        );
    }  

}



function editFilter (){
    
    const checkboxes = $$("editFormPopup").getValues();

    let counter = 0;
        

    function countChecked(){
        const values = Object.values(checkboxes);
        if (values && values.length){
            values.forEach(function(el){
                if (el){
                    counter++;
                }
            });
        }
           
        
    }
    
    function setStateSubmitBtn(){
        if (counter > 0){
            btnSubmitState ("enable");
        } else {
            btnSubmitState ("disable");
        }
    }

    if (checkboxes){

        countChecked     ();
        visibleRemoveBtn (false);
        setStateSubmitBtn();
    }
   
   
}


function filter_tabbarClick (id){

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
            filter_tabbarClick(id);
        }
    }
};

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


//create layout edit popup

const editFormPopup = {
    view        : "form", 
    id          : "editFormPopup",
    css         : "webix_edit-form-popup",
    borderless  : true,
    elements    : [

        { rows : [ 
            layoutTab,
    
            {height : 20},
            filter_btnLayout
        ]},
        {}

    ],
};



function createFilterPopup() {

    const popup = new Popup({
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



;// CONCATENATED MODULE: ./src/js/components/table/generateTable.js

///////////////////////////////
//
// Подготовка таблицы и загрузка                            (create table)
//
// Создание динамических колонок с действиями               (create detail action)
//
// Создание колонок                                         (create columns)
//
// Определение размера колонок                              (create column width)
//
// Динамические кнопки                                      (create dynamic buttons)
//
// Динамические инпуты                                      (create inputs)
//
// Область с динамическими элементами                       (create dynamic layout)
//
// Автообновление данных в таблице                          (create autorefresh)
//
// Загрузка таблицы                                         (create rows)
//
// Форматирование колонок с датой                           (create formatting date)
//
// Загрузка постов с сервера                                (create posts data)
//
// Дефолтные значения у пустых строк                        (create default values)
//
// Возвращение утерянного состояния сортировки              (create sort data)
//
// Возвр. утерянного состояния фильтров                     (create lost filter)
//
// Возвр. утерянного состояния редактора постов             (create lost data)
//
// Переход в таблицу после action дашборда с фильтром       (create dashboard context)
//
// Выделение поста в таблице по параметру в ссылке          (create context space)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////



















const generateTable_logNameFile = "table/generateTable";

let table; 

//create table
let titem;
let generateTable_idsParam;
let idCurrTable;

function setTableName(idCurrTable, idsParam) {
  
    try{
        const names = GetFields.names;

        if (isArray(names, generateTable_logNameFile, "setTableName")){

            names.forEach(function(el){
                if (el.id == idsParam){  
                    const template  = $$(idCurrTable + "-templateHeadline");
                    const value     = el.name.toString();
                    template.setValues(value);
                }
            });
        }
 

        
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
        $$(idCurrTable).clearAll();

        if (idCurrTable == "table-view"){
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

async function loadFields(){
    await LoadServerData.content("fields");
    return GetFields.keys;
}

async function generateTable (showExists){ 
 
    let keys;
    
    if (!showExists){
        keys = await loadFields();
    } 
    
    if (!keys && showExists){ // if tab is clicked but dont have fields
        keys = await loadFields();
    }
 
    if (keys){
        const columnsData = createTableCols (generateTable_idsParam, idCurrTable);
  
        createDetailAction  (columnsData, generateTable_idsParam, idCurrTable);

        generateTable_createDynamicElems  (idCurrTable, generateTable_idsParam);

        createTableRows     (idCurrTable, generateTable_idsParam);
  
        setTableName        (idCurrTable, generateTable_idsParam);

    }
   
} 


function createTable (id, ids, showExists) {
 
    idCurrTable = id;
    generateTable_idsParam    = ids;

    getValsTable ();
   
    if (titem == undefined) {
        setLogValue("error","Данные не найдены");
    } else {
        preparationTable ();
        generateTable (showExists);
    } 

 

}




//create detail action
function createDetailAction (columnsData, idsParam, idCurrTable){
    let idCol;
    let actionKey;
    let checkAction     = false;

    const data          = GetFields.item(idsParam);
    const table         = $$(idCurrTable);
    if (isArray(columnsData, "table/createSpace/cols/detailAction", "createDetailAction")){
        columnsData.forEach(function(field, i){
            if( field.type  == "action" && data.actions[field.id].rtype == "detail"){
                checkAction = true;
                idCol       = i;
                actionKey   = field.id;
            } 
        });
    }

    
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


//create columns


let generateTable_field;

function refreshCols(columnsData){
 
    if(table){
        table.refreshColumns(columnsData);
    }
}


function createReferenceCol (){
    try{
        
        const findTableId= generateTable_field.type.slice(10);
        generateTable_field.editor     = "combo";
        generateTable_field.sort       = "int";
        generateTable_field.collection = getComboOptions (findTableId);
        generateTable_field.template   = function(obj, common, val, config){
            const itemId = obj[config.id];
            const item   = config.collection.getItem(itemId);
            return item ? item.value : "";
        };
 
    }catch (err){
        errors_setFunctionError(
            err, 
            generateTable_logNameFile, 
            "createReferenceCol"
        );
    }
}

function createDatetimeCol  (){
    try{
        generateTable_field.format = 
        webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
        generateTable_field.editor = "date";
        generateTable_field.sort   = "date";
        generateTable_field.css    = {"text-align":"right"};
    }catch (err){
        errors_setFunctionError(
            err, 
            generateTable_logNameFile, 
            "createDatetimeCol"
        );
    }
}

function createTextCol      (){
    try{
        generateTable_field.editor = "text";
        generateTable_field.sort   = "string";
 
    }catch (err){
        errors_setFunctionError(
            err,
            generateTable_logNameFile,
            "createTextCol"
        );
    }
}

function createIntegerCol   (){
    
    try{
        generateTable_field.editor         = "text";
        generateTable_field.sort           = "int";
        generateTable_field.numberFormat   = "1 111";
        generateTable_field.css            = {"text-align":"right"};
        
    }catch (err){
        errors_setFunctionError(
            err,
            generateTable_logNameFile,
            "createIntegerCol"
        );
    }
}
function createBoolCol      (){
    try{
        generateTable_field.editor     = "combo";
        generateTable_field.sort       = "text";
        generateTable_field.collection = [
            {id : 1, value : "Да" },
            {id : 2, value : "Нет"}
        ];
    }catch (err){
        errors_setFunctionError(
            err,
            generateTable_logNameFile,
            "createBoolCol"
        );
    }
}

function setIdCol       (data){
    generateTable_field.id = data;
}

function setFillCol     (dataFields){
    const values      = Object.values(dataFields);
    const length      = values.length;
    const scrollWidth = 17;
    const containerWidth = $$("tableContainer").$width;
    const tableWidth  = containerWidth - scrollWidth;
    const colWidth    = tableWidth / length;

    generateTable_field.width  = colWidth;
}


function setHeaderCol   (){

   // field.header = field["label"] + `<span class="webix_icon wxi-angle-right "> </span>` 
    generateTable_field.header = generateTable_field["label"];
}

function userPrefsId    (){
    const setting = 
    webix.storage.local.get("userprefsOtherForm");

    if( setting && setting.visibleIdOpt == "2" ){
        generateTable_field.hidden = true;
    }
}  


function generateTable_createField(type){

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
    
    table = $$(idCurrTable);

    if (colsName.length){
        colsName.forEach(function(data) {
            generateTable_field = dataFields[data]; 
         
            generateTable_createField(generateTable_field.type);

            setIdCol    (data);
            setFillCol  (dataFields);
            setHeaderCol();
            
            if(generateTable_field.id == "id"){
                userPrefsId();
            }
      
            if (generateTable_field.label){
                columnsData.push(generateTable_field);
            }

        });

        
        refreshCols(columnsData);
        setUserPrefs(table, idsParam); 
    } else {
        errors_setFunctionError(
            "array length is null",
            generateTable_logNameFile,
            "createTableCols"
        );
    }
          

    return columnsData;
}



// create column width


let storageData;


function setColsUserSize(){
    const sumWidth = [];
    if (isArray(storageData, generateTable_logNameFile, "setColsUserSize")){
        storageData.values.forEach(function (el){
            sumWidth.push(el.width);
            table.setColumnWidth(el.column, el.width);
        }); 
    
    }
  
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
        countCols  =  storageData.values.length;
 
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
  
    if (isArray(storageData, generateTable_logNameFile, "findUniqueCols")){
        storageData.values.forEach(function(el){

            if (el.column == col){
                result = true;
            }
    
        });
    }
  
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

    if (isArray(allCols, generateTable_logNameFile, "setVisibleCols")){
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
  
}


function setPositionCols(){
   
    if (isArray(storageData, generateTable_logNameFile, "setPositionCols")){
        storageData.values.forEach(function(el){
       
            table.moveColumn(el.column,el.position);
                
        });
    }
   
} 

function setUserPrefs(idTable, ids){
    table       = idTable;

    const prefsName = `fields/${ids}`;

    storageData   = webix.storage.local.get(prefsName);
     
    if (storageData){
        storageData = storageData.columns;
    }
    
    const allCols = table.getColumns       (true);
 
 
    if( storageData && storageData.values.length ){
        setVisibleCols (allCols);
        setPositionCols();
        setWidthLastCol();

    } else {   
   
        if (isArray(allCols, generateTable_logNameFile, "setUserPrefs")){
            allCols.forEach(function(el){
                setColsSize(el.id);  
            });
        }
      
       
    }

    
}



//create dynamic buttons

let idElements;
let generateTable_url;
let verb;
let rtype;

const valuesArray = [];

function createQueryRefresh(){

    if (isArray(idElements, generateTable_logNameFile, "createQueryRefresh")){
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
    }
    
   
}

function setTableLoadState(tableView, data){
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
            generateTable_logNameFile,
            "setTableLoadState"
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
            generateTable_logNameFile, 
            "setTableCounter"
        );
    }
}

function refreshButton(){
    createQueryRefresh();
    
    new ServerData({
        
        id           : `${generateTable_url}?${valuesArray.join("&")}`,
        isFullPath   : true,
    
    }).get().then(function(data){

        if (data){

            const content = data.content;

            if (content){

                const tableView = $$("table-view");
              
                setTableLoadState   (tableView, content);
                setTableCounter (tableView);
            }
        }
        
    });

}

function downloadButton(){

    webix.ajax().response("blob").get(generateTable_url, function(text, blob, xhr) {
        try {
            webix.html.download(blob, "table.docx");
        } catch (err){
            errors_setFunctionError(
                err, 
                generateTable_logNameFile, 
                "downloadButton"
            );
        } 
    }).catch(err => {
        setAjaxError(
            err, 
            generateTable_logNameFile, 
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
            generateTable_logNameFile, 
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
   
        if (isArray(idElements, generateTable_logNameFile, "postButton")){
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
        }
        
    } catch (err){  
        errors_setFunctionError(err, generateTable_logNameFile, "postButton");
    } 
}


function generateTable_submitBtn (id, path, action, type){

    idElements = id;
    generateTable_url        = path;
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




// create inputs 


let data; 
let idTableElem;
let inputField; 
let dataInputsArray;


function generateTable_setAdaptiveWidth(elem){

    const child       = elem.getNode().firstElementChild;
    child.style.width = elem.$width + "px";

    const inp         = elem.getInputNode();
    inp.style.width   = elem.$width - 5 + "px";
}

function generateTable_returnArrayError(func){
    errors_setFunctionError(
        "array length is null",
        generateTable_logNameFile,
        func
    );
}
function generateTable_createTextInput    (i){
    return {   
        view            : "text",
        placeholder     : inputField.label, 
        id              : "customInputs" + i,
        height          : 48,
        labelPosition   : "top",
        on              : {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title", inputField.comment);
                generateTable_setAdaptiveWidth(this);
            },
            onChange:function(){
                const inputs = $$("customInputs").getChildViews();

                if (inputs.length){
                    inputs.forEach(function(el){
                        const view = el.config.view;
                        const btn  = $$(el.config.id);
    
                        if (view == "button"){
                            Action.enableItem(btn);
                        }
                    });
                } else {
                    generateTable_returnArrayError("createTextInput");
                }
               

            }
        }
    };
}


function generateTable_dataTemplate(i, valueElem){
    const template = { 
            id    : i + 1, 
            value : valueElem
        };
    return template;
}

function generateTable_createOptions(content){
    const dataOptions = [];
    if (isArray(content, generateTable_logNameFile, "createOptions")){
        content.forEach(function(name, i) {
     
            let title = name;
            if ( typeof name == "object"){
                title = name.name;
            }

            const optionElement = generateTable_dataTemplate(i, title);
            dataOptions.push(optionElement); 
        });
    }

    return dataOptions;
}

function generateTable_getOptionData      (){

    return new webix.DataCollection({url:{
        $proxy:true,
        load: function(){
            return ( 
                
                new ServerData({
                    id : inputField.apiname,
                
                }).get().then(function(data){
                
                    if (data){
                
                        const content = data.content;
                   
                        if (content && content.length){
                            return generateTable_createOptions(content);
                        } else {
                            return [
                                { 
                                    id    : 1, 
                                    value : ""
                                }
                            ];
                        }
                    }
                    
                })

            );
            
        
            
        }
    }});
}

function createSelectInput  (el, i){

    return   {   
        view          : "combo",
        height        : 48,
        id            : "customCombo" + i,
        placeholder   : inputField.label, 
        labelPosition : "top", 
        options       : {
            data : generateTable_getOptionData ( dataInputsArray, el )
        },
        on: {
            onAfterRender: function () {
                this.getInputNode()
                .setAttribute( "title", inputField.comment );
                generateTable_setAdaptiveWidth(this);
            },
        }               
    };
}

function createDeleteAction (i){
    const table     = $$(idTableElem);
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
            generateTable_logNameFile,
            "generateCustomInputs => createDeleteAction"
        );
    } 

}
 
function getInputsId        (element){

    const parent     = element.getParentView();
    const childs     = parent .getChildViews();
    const idElements = [];

    if (childs.length){
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
    } else {
        generateTable_returnArrayError("getInputsId");
    }
       
    
    return idElements;
}

function createDeleteBtn    (findAction,i){

    const btn = new Button({

        config   : {
            id       : "customBtnDel" + i,
            hotkey   : "Shift+Q",
            icon     : "icon-trash", 
            value    : inputField.label,
            click    : function () {
                const idElements = getInputsId (this);
                generateTable_submitBtn( idElements, findAction.url, "delete" );
            },
        },
        titleAttribute : inputField.comment
    
       
    }).minView("delete");

    return btn;
}


function generateTable_submitClick(findAction, i, id, elem){

    const idElements = getInputsId (elem);
    const btn        =  $$("contextActionsPopup");

    if (findAction.verb== "GET"){
        if ( findAction.rtype == "refresh") {
            generateTable_submitBtn( 
                idElements, 
                findAction.url, 
                "get", 
                "refresh" 
            );

        } else if (findAction.rtype == "download") {
            generateTable_submitBtn( 
                idElements, 
                findAction.url, 
                "get", 
                "download"
            );

        }
        
    } else if ( findAction.verb == "POST" ){
        generateTable_submitBtn( 
            idElements, 
            findAction.url, 
            "post" 
        );
        $$("customBtn" + i ).disable();
    } 
    else if (findAction.verb == "download"){
        generateTable_submitBtn( 
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

    const btn = new Button({
        
        config   : {
            id       : "customBtn" + i,
            value    : inputField.label,
            click    : function (id) {
                generateTable_submitClick(findAction, i, id, this);
            },
        },
        titleAttribute : inputField.comment,
        onFunc         : {
            onViewResize:function(){
                generateTable_setAdaptiveWidth(this);
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
        label        : inputField.label, 
        labelPosition: "top",
        on: {
            onAfterRender: function () {
                this.getInputNode().setAttribute( "title", inputField.comment );
                generateTable_setAdaptiveWidth(this);
                const parent = this  .getParentView();
                const childs = parent.getChildViews();

                if (childs.length){
                    childs.forEach(function(el,i){
                        if (el.config.id.includes("customBtn")){
                            el.disable();
                        }
                    });
                } else {
                    generateTable_returnArrayError("createUpload");
                }
               
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

                if (childs.length){
                    childs.forEach(function(el){
                        if (el.config.id.includes("customBtn")){
                            el.enable();
                        }
                    });
                } else {
                    generateTable_returnArrayError("createUpload");
                }
                
            }

        }
    };
}

function generateTable_createDatepicker   (i){
    return {   
        view         : "datepicker",
        format       : "%d.%m.%Y %H:%i:%s",
        placeholder  : inputField.label,  
        id           :"customDatepicker"+i, 
        timepicker   : true,
        labelPosition:"top",
        height       :48,
        on           : {
            onAfterRender: function () {
                this.getInputNode().setAttribute( "title", inputField.comment );
                generateTable_setAdaptiveWidth(this);
            },
            onChange:function(){
                try{
                    const inputs = $$("customInputs").getChildViews();

                    if (inputs.length){
                        inputs.forEach(function(el,i){
                            const btn  = $$(el.config.id);
                            const view = el.config.view;
                            if ( view == "button" && !(btn.isEnabled()) ){
                                btn.enable();
                            }
                        });
                    } else {
                        generateTable_returnArrayError("createDatepicker");
                    }
                  
                } catch (err){
                    errors_setFunctionError(
                        err,
                        generateTable_logNameFile,
                        "generateCustomInputs => createDatepicker onChange"
                    );
                } 

            }
        }
    };
}

function generateTable_createCheckbox     (i){
    return {   
        view       : "checkbox", 
        id         : "customСheckbox" + i, 
        css        : "webix_checkbox-style",
        labelRight : inputField.label, 
        on         : {
            onAfterRender: function () {
                this.getInputNode()
                .setAttribute("title", inputField.comment);
            },

            onChange:function(){
                try{
                    const inputs = $$("customInputs").getChildViews();
                    if (inputs.length){
                        inputs.forEach(function(el,i){
                            const view = el.config.view;
                            const btn  = $$(el.config.id);
                            if (view == "button" && !(btn.isEnabled())){
                                btn.enable();
                            }
                        });
                    } else {
                        generateTable_returnArrayError("createCheckbox");
                    }
                
                } catch (err){
                    errors_setFunctionError(
                        err,
                        generateTable_logNameFile,
                        "generateCustomInputs => createCheckbox onChange"
                    );
                } 
            }
        }
    };
}

function generateCustomInputs (dataFields, id){  
    idTableElem = id;
    data        = dataFields;  

    dataInputsArray     = data.inputs;

    const customInputs  = [];
    const objInuts      = Object.keys(data.inputs);

    if (objInuts.length){
        objInuts.forEach((el,i) => {
            inputField = dataInputsArray[el];
            if ( inputField.type == "string" ){
                customInputs.push(
                    generateTable_createTextInput(i)
                );
            } else if ( inputField.type == "apiselect" ) {
               
                customInputs.push(
                    createSelectInput(el, i, dataInputsArray)
                );
    
            } else if ( inputField.type == "submit" || 
                        inputField.type == "button" ){
    
                const actionType = inputField.action;
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
            } else if ( inputField.type == "upload" ){
                customInputs.push(
                    createUpload(i)
                );
            } else if ( inputField.type == "datetime" ){
                customInputs.push(
                    generateTable_createDatepicker(i)
                );
            }else if ( inputField.type == "checkbox" ){
                customInputs.push(
                    generateTable_createCheckbox(i)
                );
    
            } 
        });
    
    } else {
        generateTable_returnArrayError("generateCustomInputs");
    }
   

    return customInputs;
}



// create dynamic layout


let dataFields; 
let idTable;
let generateTable_ids;

let generateTable_btnClass;
let formResizer;
let tools;

let generateTable_secondaryBtnClass = "webix-transparent-btn";
let generateTable_primaryBtnClass   = "webix-transparent-btn--primary";


function maxInputsSize (customInputs){
   
    Action.removeItem($$("customInputs"));
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
        errors_setFunctionError(err, generateTable_logNameFile, "maxInputsSize");
    } 
    

}

function toolMinAdaptive(){
    Action.hideItem($$("formsContainer"));
    Action.hideItem($$("tree"));
    Action.showItem($$("table-backFormsBtnFilter"));
    Action.hideItem(formResizer);

    const emptySpace = 45;
    
    tools.config.width = window.innerWidth - emptySpace;
    tools.resize();
}


function toolMaxAdaptive(){
    const formsTools = $$("viewTools");

    generateTable_btnClass = document.querySelector(".webix_btn-filter");
    
    if (generateTable_btnClass.classList.contains(generateTable_primaryBtnClass)){

        generateTable_btnClass.classList.add   (generateTable_secondaryBtnClass);
        generateTable_btnClass.classList.remove(generateTable_primaryBtnClass);
        Action.hideItem(tools);
        Action.hideItem(formResizer);
        

    } else if (generateTable_btnClass.classList.contains(generateTable_secondaryBtnClass)){

        generateTable_btnClass.classList.add   (generateTable_primaryBtnClass);
        generateTable_btnClass.classList.remove(generateTable_secondaryBtnClass);
        Action.showItem(tools);
        Action.showItem(formResizer);
        Action.showItem(formsTools);
    }
}

function setStateTool(){

   
    formResizer         = $$("formsTools-resizer");
    const contaierWidth = $$("container").$width;

    if(!(generateTable_btnClass.classList.contains(generateTable_secondaryBtnClass))){
        const minWidth      = 850;
        const toolsMaxWidth = 350;
        
        if (contaierWidth < minWidth  ){
            Action.hideItem($$("tree"));
            if (contaierWidth  < minWidth ){
                toolMinAdaptive();
            }
        } else {
     
            Action.hideItem($$("table-backFormsBtnFilter"));
            tools.config.width = toolsMaxWidth;
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

    if (dataFields.inputs){  
   
        const customInputs  = generateCustomInputs (dataFields, idTable);
        const filterBar     = $$("table-view-filterId").getParentView();

        const btnTools = new Button({
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

function generateTable_createDynamicElems (id, idsParameter){
    idTable     = id;
    generateTable_ids         = idsParameter;
    dataFields  = GetFields.item(generateTable_ids);  
 
    adaptiveCustomInputs ();

}

// create autorefresh

let interval;
const intervals = [];
 
function generateTable_setIntervalConfig(type, counter){
    interval = setInterval(
        () => {
        
            const table         = getTable();
            const isAutoRefresh = table.config.autorefresh;
             
            if (isAutoRefresh){
                if( type == "dbtable" ){
                    getItemData ("table");
                } else if ( type == "tform" ){
                    getItemData ("table-view");
                }
            } else {
                clearInterval(interval);
            }
        },
        counter
    );


    intervals.push(interval);

}

function clearPastIntervals(){
    if (intervals.length){
        intervals.forEach(function(el, i){
            clearInterval(el);
            intervals.splice(i, 1);
        });
    }
}

function generateTable_autorefresh (data){

    clearPastIntervals();

    const table = getTable();


    if (data.autorefresh){

        table.config.autorefresh = true;
        const name               = "userprefsOtherForm";
        const userprefsOther     = webix.storage.local.get(name);
        let counter;

        if (userprefsOther){
            counter = userprefsOther.autorefCounterOpt;
        }

        const minValue     = 15000;
        const defaultValue = 120000;
        
        if ( userprefsOther && counter !== undefined ){
            if ( counter >= minValue ){
                generateTable_setIntervalConfig(data.type, counter);
                
            } else {
                generateTable_setIntervalConfig(data.type, defaultValue);
            }
        }

       
    } else {
        table.config.autorefresh = false;
        
    }

 
}




//create rows

let currIdTable;
let offsetParam;
let itemTreeId;


function getItemData (table){

    const tableElem = $$(table);

    const reccount  = tableElem.config.reccount;

    if (reccount){
        const remainder = reccount - offsetParam;

        if (remainder > 0){
            loadTableData(table, currIdTable, itemTreeId, offsetParam  ); 
        }

    } else {
        loadTableData(table, currIdTable, itemTreeId, offsetParam ); 
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

    currIdTable = id;
    offsetParam = offset;      
    itemTreeId  = idsParam;


    setDataRows         (data.type);
    generateTable_autorefresh         (data);
          
}


//create formatting date

let idCurrView;

// date

function findDateCols (columns){
    const dateCols = [];
    if (isArray(columns, generateTable_logNameFile, "findDateCols")){
        columns.forEach(function(col,i){
            if ( col.type == "datetime" ){
                dateCols.push( col.id );
            }
        });
    }
       
   

    return dateCols;
}

function changeDateFormat (data, elType){
    if (isArray(data, generateTable_logNameFile, "changeDateFormat")){
        data.forEach(function(el){
            if ( el[elType] ){
                const dateFormat = new Date( el[elType] );
                el[elType]       = dateFormat;
                
            }
        });
    }
  
}

function formattingDateVals (table, data){

    const columns  = $$(table).getColumns();
    const dateCols = findDateCols (columns);

    function setDateFormatting (){
        if (isArray(dateCols, generateTable_logNameFile, "formattingDateVals")){
            dateCols.forEach(function(el,i){
                changeDateFormat (data, el);
            });
        }
       
    }

    setDateFormatting ();
     
   
}



// boolean

function findBoolColumns(cols){
    const boolsArr = [];

    if (isArray(cols, generateTable_logNameFile, "findBoolColumns")){
        cols.forEach(function(el,i){
            if (el.type == "boolean"){
                boolsArr.push(el.id);
            }
        });
    }
   

    return boolsArr;
}

 

function isBoolField(cols, key){
    const boolsArr = findBoolColumns(cols);
    let check      = false;
    if (isArray(boolsArr, generateTable_logNameFile, "isBoolField")){
        boolsArr.forEach(function(el,i){
            if (el == key){
                check = true;
            } 
        });
    }
 

    return check;
}


function getBoolFieldNames(){
    const boolKeys = [];
    const cols     = idCurrView.getColumns(true);

    if (isArray(cols, generateTable_logNameFile, "getBoolFieldNames")){
        cols.forEach(function(key){
    
            if( isBoolField(cols, key.id)){
                boolKeys.push(key.id);
        
            }
        });
    }
  

    return boolKeys;
}

function setBoolValues(element){
    const boolFields = getBoolFieldNames();

    if (isArray(boolFields, generateTable_logNameFile, "setBoolValues")){
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
   

}

function generateTable_formattingBoolVals(id, data){
    idCurrView = id;

    if (isArray(data, generateTable_logNameFile, "formattingBoolVals")){
        data.forEach(function(el,i){
            setBoolValues(el);
        });
    }
 

}


//create posts data

let idTableElement;
let offset;
let itemTree;

let idFindElem;

//let firstError = false;
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

 
let currId;


function checkNotUnique(idAddRow){    
    const tablePool = currId.data.pull;
    const values    = Object.values(tablePool);
    
    if (isArray(values, generateTable_logNameFile, "checkNotUnique")){
        values.forEach(function(el){
            if ( el.id == idAddRow ){
                currId.remove(el.id);
            }
        });
    }
    
}


function changeFullTable(data){
    const overlay = "Ничего не найдено";
    if (data.length !== 0){
        currId.hideOverlay(overlay);
        currId.parse      (data);

    } else {
        currId.showOverlay(overlay);
        currId.clearAll   ();
    }

    setTimeout(() => {
        enableVisibleBtn();
    }, 1000);
}

function changePart(data){
    if (isArray(data, generateTable_logNameFile, "changePart")){
        data.forEach(function(el){
            checkNotUnique(el.id);
            currId.add(el);
        });
    }
    }


function parseRowData (data){

    currId = $$(idTableElement);
   
    if (!offset){
        currId.clearAll();
    }

    generateTable_formattingBoolVals (currId, data);
    formattingDateVals (currId, data);
    setDefaultValues   (data);
 
 
    if ( !offset ){
        changeFullTable(data);
    } else {
        changePart     (data);
    }
  
}


function generateTable_setCounterVal (data, idTable){

    const table = $$(idTable)
    try{
        const prevCountRows = {full : data, visible : table.count()};
        $$(idFindElem).setValues(JSON.stringify(prevCountRows));
  
    } catch (err){
        errors_setFunctionError(
            err, 
            generateTable_logNameFile, 
            "setCounterVal"
        );
    }
}



async function generateTable_returnFilter(tableElem){
 
    const filterString = tableElem.config.filter;
 
    const result = {
        prefs : true
    };


    if (!result.filter){
        result.prefs = false;
    
  
        if (filterString && filterString.table === itemTree){
            result.filter = filterString.query;
            const id = tableElem.config.id + "_applyNotify";
            Action.showItem($$(id));

        } else {
            result.filter = itemTree +'.id+%3E%3D+0';
          
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
            sort = "~" + itemTree + '.' + sortCol;
        } else {
            sort = itemTree + '.' + sortCol;
        }
        tableElem.markSorting(sortCol, sortType);
    } else {
        sort = itemTree + '.' + firstCol;
        tableElem.markSorting(firstCol, "asc");
    }


    return sort;
}


function returnPath(tableElem, query){
    const tableType = tableElem.config.id;
    let path;
     
    if (tableType == "table"){
        //path = "/init/default/api/smarts?"+ query.join("&");
        path = `smarts?${query.join("&")}`;
    } else {
        //path = "/init/default/api/" + itemTree;
        path = itemTree;
    }

    return path;
}

function setConfigTable(tableElem, data, limitLoad){

    const tableType = tableElem.config.id;

    if ( !offset && tableType == "table" ){
        tableElem.config.reccount  = data.reccount;
        tableElem.config.idTable   = itemTree;
        tableElem.config.limitLoad = limitLoad;
    }

    if( tableType == "table-view" ){
        tableElem.config.idTable   = itemTree;
        tableElem.config.reccount  = data.content ? data.content.length : null;
    }
}


function tableErrorState (){
  
    const prevCountRows = {full : "-"};
    const value         = prevCountRows.toString();
    try {
        $$(idTableElement).showOverlay("Ничего не найдено");
        $$(idFindElem) .setValues  (JSON.stringify(value));
        
        Action.disableItem($$("table-newAddBtnId"));
        Action.disableItem($$("table-filterId"));
        Action.disableItem($$("table-exportBtn"));

    } catch (err){
        errors_setFunctionError(
            err, 
            generateTable_logNameFile, 
            "tableErrorState"
        );

    }
}


async function loadTableData(table, id, idsParam, offsetParameter){
   
    const tableElem = $$(table);
    const limitLoad = 80;

    idTableElement  = id;
    offset          = offsetParameter;      
    itemTree        = idsParam;

    idFindElem      = idTableElement + "-findElements";

    const resultFilter = await generateTable_returnFilter(tableElem);
    const isPrefs      = resultFilter.prefs;
    const filter       = resultFilter.filter;

    if (!offset){
        returnSortData ();
    }


    const sort      = returnSort  (tableElem);

    const query = [ "query=" + filter, 
                    "sorts=" + sort, 
                    "limit=" + limitLoad, 
                    "offset="+ offset
    ];


    tableElem.load({
        $proxy : true,
        load   : function(){
            const path = returnPath (tableElem, query);

            new ServerData({
                id           : path,
                isFullPath   : false,
                errorActions : tableErrorState
            
            }).get().then(function(data){
            
                if (data){

                    const reccount = data.reccount ? data.reccount : data.content.length;
                    const content  = data.content;

                    setConfigTable(tableElem, data, limitLoad);

                    if (content){
                        //console.log(data)
                        // data = [
                        //     {id: 4, name: "Критический", cdt: "2023-01-17 14:23:28", ndt:"2022-12-14"},
                        //     {id: 5, name: "Критиче112ский", cdt: "2024-02-22 23:13:24", ndt:"2021-10-14"}
                        // ]
                        
                        setTableState(table);
                        parseRowData (content); ///content!!!!
             
                        if (!offset){
                        
                            generateTable_selectContextId      ();  
                     
                            returnLostData   ();
                            generateTable_returnLostFilter (itemTree);

                            if (isPrefs){
                                returnDashboardFilter(filter);
                            }
                        }

                        generateTable_setCounterVal (reccount, tableElem);
            
                    }
                }
                
            });
          

        }
    });

}


//create default values

function isExists(value){
    if (value){
        return value.toString().length;
    }

}


function returnValue(fieldValue){
    const table = getTable();
    const cols  = table.getColumns(true);
    
    if (isArray(cols, generateTable_logNameFile, "returnValue")){
        cols.forEach(function(el){
            const defValue =  returnDefaultValue(el);
        
            const value = fieldValue[el.id];

            if (isExists(defValue) && !value){
                fieldValue[el.id] = returnDefaultValue(el);
            }

        });
    }
  
}

function setDefaultValues (data){

    if (isArray(data, generateTable_logNameFile, "setDefaultValues")){
        data.forEach(function(el){
            returnValue(el);
        });
    }
   

}


//create sort data

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



// create lost filter
function isDataExists(data){
    
    if (data && data.values.values.length){
        return true;
    }
}


function hideHtmlContainers(){
    const container = $$("inputsFilter").getChildViews();

    if (container && container.length){
        container.forEach(function(el){

            const node = el.getNode();
    
            const isShowContainer = node.classList.contains("webix_show-content");
            if (!isShowContainer){
                Filter.addClass(node, "webix_hide-content");
            }
           
        });
    } else {
        errors_setFunctionError(
            `array length is null`, 
            "table/createSpace/returnLostFilter", 
            "hideHtmlContainers"
        ); 
    }
 

}

function generateTable_returnLostFilter(id){
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



//create lost data

let prop;
let generateTable_form;

function generateTable_getLinkParams(param){
    const href   = window.location.search;
    const params = new URLSearchParams (href);
    return params.get(param);
}

function isThisIdSelected(id){
    const selectedId = generateTable_getLinkParams("id");
    if (id == selectedId){
        return true;
    }
    return false;
}

function setVals(values){
    prop.setValues(values);
    generateTable_form.setDirty(true);

}

function isFilterParamExists(){
    const param = generateTable_getLinkParams("view");
    if (param == "filter"){
        return true;
    }
}

function isEditParamExists(){
    const param = generateTable_getLinkParams("view");
    if (param == "edit"){
        return true;
    }
}

function generateTable_setDataToTab(currState){
   const data = mediator.tabs.getInfo();

    if (data){
        if(!data.temp){
            data.temp = {};
        }
        if(!data.temp.edit){
            data.temp.edit = {};
        }
       
        data.temp.edit.values = currState;

        if (currState.status == "put"){
         
           data.temp.edit.selected = currState.values.id;
        }

        mediator.tabs.setInfo(data);
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
            generateTable_form          = $$("table-editForm");
            const table   = $$("table");
            const tableId = table.config.idTable;
     
            const values  = data.values;
            const field   = data.table;
            const status  = data.status;
         
            if (tableId == field ){
                Action.hideItem($$("filterTableForm"));

                generateTable_setDataToTab(data);
        
                if (status === "put"){
                    const id = values.id;
              
                    if (table.exists(id)     &&
                        isThisIdSelected(id) )
                    {
                  
                        table.select(id);
                        setVals(values);
                            
                    }
             
                } else if (status === "post"){
                    Action.showItem(generateTable_form);
                    mediator.tables.editForm.postState();
                    setVals(values);
                }


               
            }
        }
    }



    mediator.tabs.setDirtyParam();

    const tabInfo = mediator.tabs.getInfo();

  
    if (tabInfo.isClose){ // tab в процессе удаления
        mediator.getGlobalModalBox().then(function(result){

            if (result){
                const tabbar = $$("globalTabbar");
                const id     = tabbar.getValue();
                tabbar.removeOption(id);
            }

        });
    }

     
}


//create dashboard context

let conditions;

function returnInputId(id){
    const index = id.lastIndexOf(".");
    return id.slice(index + 1);
}

function generateTable_setOperation(id, value){
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

function generateTable_setInputValue(id, value){
    if (value){
        const trueValue = value.replace(/['"]+/g, '');
        $$(id).setValue(trueValue);
    }
  
}

function generateTable_setBtnsValue(id, array){
    generateTable_setOperation (id, array[2]); // array[2] - operation
    generateTable_setInputValue(id, array[3]); // array[2] - value
    setSegmentBtn(id, array[4]); // array[4] - and/or
}


function generateTable_checkCondition(array){
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

    generateTable_setBtnsValue(inputId, array);

}
   
// array[1] - id
// array[2] - operation   -- setValue
// array[3] - value  
// array[4] - and/or
function returInputsId(ids){
    const result = [];
    if (isArray(ids, generateTable_logNameFile, "returInputsId")){
        ids.forEach(function(el, i){
            const index = el.lastIndexOf(".") + 1;
            result.push(el.slice(index));
        });
    }
  
    
    
    return result;
}


function generateTable_iterateConditions(){
    const ids = [];
    if (isArray(conditions, generateTable_logNameFile, "iterateConditions")){
        conditions.forEach(function(el){
            const arr = el.split(' ');
            generateTable_checkCondition(arr);
            ids.push(arr[1]);
         
        });
        
        const inputsId = returInputsId(ids);
        Filter.hideInputsContainers(inputsId);
    }

}


function generateTable_returnConditions(filter){
    const array = filter.split(' ');

    const conditions = [];
    let r            = "";
    let counter      = 0;

    if (isArray(array, generateTable_logNameFile, "returnConditions")){
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
    }
  
   

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
    const result = [];
    if (isArray(indexes, generateTable_logNameFile, "returnCurrIndexes")){
        const inputs  = Filter.getItems();

        const keys = Object.keys(indexes);
        if (keys.length){
            keys.forEach(function(el){
    
                if (inputIsVisible(inputs, el)){
                    result.push(indexes[el]);
                }
              
            });
        } else {
            errors_setFunctionError(
                `array length is null`, 
                generateTable_logNameFile, 
                "returnCurrIndexes"
            ); 
        }
       
    
    }
 
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

    conditions = generateTable_returnConditions(filter);
    generateTable_iterateConditions();
    hideLastSegmentBtn();

    Action.enableItem($$("btnFilterSubmit"));

    Filter.setStateToStorage();
}



//create context space


function generateTable_selectContextId(){
    const idParam = generateTable_getLinkParams("id");
    const table   = getTable();
    
    if (table && table.exists(idParam)){
        table.select(idParam);
    } else {
        mediator.linkParam(false, "id");
    }
 
}

;// CONCATENATED MODULE: ./src/js/components/table/columnsSettings.js
///////////////////////////////
//
// Layout попапа с настройками колонок                      (create popup)
//
// Кнопка сброса до дефолтных настроек                      (create clear btn) 
//
// Создание list компонентов попапа                         (create lists)
//
// Кнопки перемещения между list компонентами               (create list move btns)
//
// Кнопки перемещения колонок вверх/вниз                    (create move up btns)
//
// Сохранение настроек                                      (create save btn)
//
// Поиск по названию колонок                                (create search input) 
//
// Сохранение ресайза колонок                               (create resize cols)
//
// Перемещение колонок                                      (create drop cols)
//
// Загрузка данных о модифицированных колонках на сервер    (create modify cols data)
//
// Событие таблицы onColumnResize                           (create onColumnResize)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////

















const columnsSettings_logNameFile = "table/columnsSettings";


// create popup
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


function columnsSettings_createPopup(){
       
    const popup = new Popup({
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






// create clear btn

let columnsSettings_table;
let values;

function returnContainer(){
    const tableId = getTable().config.id;
    if (tableId == "table"){
        return $$("tableContainer");
    } else if (tableId == "table-view"){
        return $$("formsContainer");
    }
    
}

function columnsSettings_setColsSize(col, listItems){
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
    const cols           = columnsSettings_table.getColumns(true).length;
    const colWidth       = containerWidth / cols;

    return colWidth.toFixed(2);
}
function columnsSettings_returnArrayError(){
    errors_setFunctionError(
        "array length is null",
        columnsSettings_logNameFile,
        "returnPosition"
    );
}

function returnPosition(column){
    let position;
    const pull = columnsSettings_table.data.pull[1];
   
    if (pull){
        const defaultColsPosition = Object.keys(pull);
        
        if (defaultColsPosition.length){
            defaultColsPosition.forEach(function(el, i){
                if (el == column){
                    position = i;
                }
            });
        } else {
            columnsSettings_returnArrayError(); 
        }
        

    }

    return position;
}
 
function showCols(){
    const cols = columnsSettings_table.getColumns(true);
    try{

        if (cols.length){
            cols.forEach(function(el,i){
                const colWidth    = returnWidthCol();
                const positionCol = returnPosition(el.id);
    
                columnsSettings_setColsSize(el.id,cols);
                
                if( !( columnsSettings_table.isColumnVisible(el.id) ) ){
                    columnsSettings_table.showColumn(el.id);
                }
           
                columnsSettings_table.setColumnWidth(el.id, colWidth);
    
                values.push({
                    column   : el.id,
                    position : positionCol,
                    width    : colWidth 
                });
            });
        } else {
            columnsSettings_returnArrayError();
        }
       
    } catch(err){
        errors_setFunctionError(
            err,
            columnsSettings_logNameFile,
            "clearBtnColsClick / showCols"
        );
    }
}

function clearBtnColsClick (){
    columnsSettings_table        = getTable();

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
    const clearBtn = new Button({

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







// create lists 

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







// create list move btns


function createMsg(){
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
            } else {
                Action.enableItem (btn);
            }
        }

    } else {
        createMsg();
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
    const addColsBtn = new Button({

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

    const removeColsBtn = new Button({

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






//create move up btns

function setBtnSubmitState(state){
    const btnSubmit  = $$("visibleColsSubmit");
    const check      = btnSubmit.isEnabled();

    if (state == "enable" && !(check) ){
        btnSubmit.enable();
    } else if ( state == "disable" && check ){
        btnSubmit.disable();
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

    const moveUpBtn = new Button({

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

    const moveDownBtn = new Button({

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


// create save btn

function returnMinSize(table, containerWidth){
    const allCols = table.getColumns(true).length;
    const width  = containerWidth / allCols;

    return width.toFixed(2);
}


function visibleColsSubmitClick (){
 
    const list      = $$("visibleListSelected");
    const listPull  = list.data.pull;
    const listItems = Object.values(listPull);
    const values    = [];
    const table     = getTable();

    const emptySpace = 77;
    const containerWidth = window.innerWidth - $$("tree").$width - emptySpace; 


    function setLastColWidth(lastColumn,widthCols){
        const sumWidth     = widthCols.reduce((a, b) => a + b, 0);


        let widthLastCol   =  containerWidth - sumWidth;
        const minWidth     = 50;
        if (widthLastCol < minWidth){
            widthLastCol = returnMinSize(table, containerWidth);
        }

        lastColumn.width = Number(widthLastCol);

        values.push(lastColumn); 
    }


    try{
        const widthCols = [];
        const lastColumn = {};
 
        if (listItems.length){
            listItems.forEach(function(el){
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
        } else {
            errors_setFunctionError(
                "array length is null", 
                columnsSettings_logNameFile, 
                "visibleColsSubmitClick"
            ); 
        }
        
   

    } catch (err){
        errors_setFunctionError(
            err, 
            columnsSettings_logNameFile, 
            "visibleColsSubmitClick"
        );
    }
 
    postPrefsValues(values, true);

}

function returnSaveBtn(){
    const btnSaveState = new Button({

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




//create search input

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
            columnsSettings_logNameFile,
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



// create resize cols

function setColsWidthStorage(table){
    table.attachEvent("onColumnResize",function(id, newWidth, oldWidth, action){
        if (action){
           
            const cols   = table.getColumns();
            const values = [];

            if (cols.length){
                cols.forEach(function(el){

                    values.push({
                        column  : el.id, 
                        position: table.getColumnIndex(el.id),
                        width   : el.width.toFixed(2)
                    });
                });
                postPrefsValues(values);
            } else {
                errors_setFunctionError(
                    "array length is null", 
                    "table/columnsSettings/columnsWidtn", 
                    "visibleColsSubmitClick"
                ); 
            }
         
        }
    });     
}




//create drop cols


function createValues(table){
    const cols = table.getColumns();
    const values = [];

    if (cols.length){
        cols.forEach(function(col, i){
            values.push({
                column   : col.id, 
                position : i,
                width    : Number(col.width)
            });
        });
    } else {
        errors_setFunctionError(
            "array length is null", 
            "table/columnsSettings/onAfterColumnDrop", 
            "visibleColsSubmitClick"
        ); 
    }

    return values;
}

function dropColsSettings(table){
 
    table.attachEvent("onAfterColumnDrop", function(){
        const values = createValues(table);
        postPrefsValues(values, false, false);
       
    });
}



//create modify cols data
let setUpdates;
let userData;

function columnsSettings_findUniqueCols(sentVals, col){
    let result = false;

    if (isArray(sentVals, columnsSettings_logNameFile, "findUniqueCols")){
        sentVals.values.forEach(function(el){
            if (el.column == col){
                result = true;
            }
            
        });
    }
  

    return result;
}


function setVisibleState(sentVals, table){
    const columns = table.getColumns(true);
    try{

        if (columns.length){
            columns.forEach(function(el){
            
                if (columnsSettings_findUniqueCols(sentVals, el.id)){
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
        } else {
            errors_setFunctionError(
                "array length is null",
                columnsSettings_logNameFile,
                "setVisibleState"
            );
        }
        


    } catch(err){
        errors_setFunctionError(
            err,
            columnsSettings_logNameFile,
            "setVisibleState"
        );
    }
}


function moveListItem(sentVals, table){
    if (isArray(sentVals.values, columnsSettings_logNameFile, "moveListItem")){
        sentVals.values.forEach(function(el){
            table.moveColumn(el.column, el.position);
        }); 
    }
   
}

function setUpdateCols(sentVals){
    const table   = getTable();

    setVisibleState (sentVals, table);
    moveListItem    (sentVals, table);

}


function setSize(sentVals){
    const table = getTable();
    function setColWidth(el){
        table.eachColumn( 
            function (columnId){ 
                if (el.column == columnId){
                    table.setColumnWidth(columnId, el.width);
                }
            },true
        );
    }


    if (sentVals && sentVals.columns){
        const vals = sentVals.columns.values;
        if (isArray(vals, columnsSettings_logNameFile, "setSize")){
            vals.forEach(function(el){
                setColWidth(el);
            });
        }
    }
  
  
}



function columnsSettings_saveExistsTemplate(sentObj, idPutData, visCol){

    const prefs   = sentObj.prefs;
    const id      = getItemId();
   
    new ServerData({
        id : `userprefs/${idPutData}`,
       
    }).put(sentObj).then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (content){
                setLogValue   (
                    "success",
                    "Рабочая область таблицы обновлена"
                );
                setStorageData(
                    "visibleColsPrefs_" + 
                    id, 
                    JSON.stringify(sentObj.prefs)
                );
            
                if (setUpdates){
                    setUpdateCols (prefs.columns);
                }
              
    
                if (visCol){
                    setSize(prefs);
                }
    
            }
        }
         
    });


    Action.destructItem($$("popupVisibleCols"));
} 


 
function columnsSettings_saveNewTemplate(sentObj){
    const prefs  = sentObj.prefs;
    const id     = getItemId();

       
    new ServerData({
        id : "userprefs",
       
    }).post(sentObj).then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (content){
               
                setLogValue   (
                    "success", 
                    "Рабочая область таблицы обновлена"
                );
                setStorageData(
                    "visibleColsPrefs_" + 
                    id, 
                    JSON.stringify(sentObj.prefs)
                );
    
                if (setUpdates){
                    setUpdateCols (prefs.columns);
                }

            }
        }
         
    });

    Action.destructItem($$("popupVisibleCols"));
}

function getUserprefsData(values, visCol){
    const id      = getItemId();

    const name  = `userprefs.name+=+%27fields/${id}%27`;
    const owner = `userprefs.owner+=+${userData.id}`;

    new ServerData({
        id : `smarts?query=${name}+and+${owner}&limit=80&offset=0`,
       // id : `smarts?query=userprefs.name+=+%27visibleColsPrefs_${id}%27+and+${owner}&limit=80&offset=0`,
    }).get().then(function(data){

        if (data){
            const content = data.content;

            if (content && content.length){ // запись уже существует
               
                const columnsData = content[0];

                if (columnsData){
                    const prefs       = JSON.parse(columnsData.prefs);

                    if (prefs){
                        prefs.columns = values;
                        columnsData.prefs = prefs;
                    }
    
                    columnsSettings_saveExistsTemplate(columnsData, columnsData.id, visCol);
                }
          
            } else {

                const sentObj = {
                    name  : `fields/${id}`,
                    owner : userData.id,
                    prefs : {
                        columns:values
                    },
                };

                columnsSettings_saveNewTemplate(sentObj);
            }
        }

        
    });


}


async function postPrefsValues(values, visCol = false, updates = true){
    setUpdates   = updates;
    userData = await returnOwner();
   
    const id = getItemId();
    
    const sentVals      = {
        values       : values, 
        tableIdPrefs : id
    };

    // const sentObj = {
    //     name  : `fields/${id}`,
    //     owner : userData.id,
    //     prefs : sentVals,
    // };


    getUserprefsData(sentVals, visCol);

}



//create onColumnResize
let cols;
let lengthCols;

function returnCol(index){
    const currIndex = lengthCols - index;
    return cols[currIndex];
}

function returnSumWidthCols(){
    let sum = 0;
    
    if (cols && cols.length){
        cols.forEach(function(col){
            sum += col.width;
        });
    }
 
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


;// CONCATENATED MODULE: ./src/js/components/table/tableElement.js
 
///////////////////////////////
//
// Медиатор                                                     (create mediator)
//
// Дефолт. состояние компонента с динамич. полями в формах      (create default tools state)
//
// Компонент с контекстом в формах                              (create form context property)
//
// Layout компонента с динамич. полями в формах                 (create form tools layout)
//
// Кнопка, открывающая попап с редактором колонок               (create open edit cols btn)
//
// Кнопка, открывающая фильтры                                  (create open filter btn)
//
// Кнопка, экспортирующая таблицу                               (create export btn)
//
// Кнопка, открывающая редактор записей                         (create open edit table btn)
//
// Счётчик записей                                              (create table counter)
//
// Маркер на таблице о применённых фильтрах                     (create apply notify)
//
// Layout тулбара                                               (create toolbar layout)
//
// Динамические кнопки в таблице                                (create dynamic btns)
//
// Функции таблицы                                              (create table functions)
//
// layout таблицы                                               (create table layout)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////


















const tableElement_logNameFile = "table/tableElement";

const limitLoad   = 80; 

//create mediator
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
                dropColsSettings   (tableElem);

           
            }
        } catch (err){
            errors_setFunctionError(
                err, 
                tableElement_logNameFile, 
                "createTables"
            );
        }
    }

    showView(){
        Action.showItem($$(this.name));   
    }

    showExists(id){
        const table = getTable().config.id;
        createTable(table, id, true);
    }

    load(id){

       // const table = getTable().config.id;
        createTable("table", id);
    }

    get editForm (){
        return EditForm;
    }

    get filter (){
        return Filter;
    }
  
    defaultState(type, clearDirty=true){
        if (type == "edit"){
            EditForm.defaultState(clearDirty);
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
                dropColsSettings   (tableElem);
            }
        } catch (err){
            errors_setFunctionError(
                err,
                tableElement_logNameFile,
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
        Button.transparentDefaultState();
    }


}




//create default tools state
function toolsDefState(){
    const property = $$("propTableView");
    
    if (property && property.isVisible()){
        property.clear();
        Action.hideItem(property);
    }
   
    Action.hideItem($$("formsTools"    ));
    Action.showItem($$("formsContainer"));

}


//create form context property
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


//create form tools layout

function tableElement_setBtnFilterState(){
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
    tableElement_setBtnFilterState();
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




//create open edit cols btn

function tableElement_createSpace(){
    const table    = getTable();
    const list     = $$("visibleList");
    const listPull = Object.values(list.data.pull);
    const cols     = table.getColumns(); 
    
    function findRemoveEl(elem){
        let check = false;

        if (cols.length){
            cols.forEach(function(item,i){
            
                if (elem == item.id){
                    check = true;
                }
    
            });
        }
      

 
        return check;
    }

    
    function removeListItem(){

       
        if (listPull && listPull.length){
            listPull.forEach(function(el){
                if (findRemoveEl(el.column)){
                    list.remove(el.id);
                }

            });
        }
           
       
    }

    function addListSelectedItem(){
        const viewList = $$("visibleListSelected");
        const emptyEl  = $$("visibleColsEmptyTempalteSelected");
        
        if (cols.length){
            Action.hideItem(emptyEl);
        }
        if (cols && cols.length){
            cols.forEach(function(col){
                viewList.add({
                    column  :col.id,
                    label   :col.label,
                });
            });
     
        }
          
    }
 
    if (listPull.length){
        removeListItem();
        addListSelectedItem();
    }


}


function createListItems(idTable){

    const currTable  = $$(idTable);
    let columns      = currTable.getColumns(true);

    try{
        columns        = currTable.getColumns(true);
        const sortCols = _.sortBy(columns, "label");

        if (sortCols.length){
            sortCols.forEach(function(col){
            
                if(col.css !== "action-column" && !col.hiddenCustomAttr ){
          
                    $$("visibleList").add({
                        column  :col.id,
                        label   :col.label,
                    });
                    
                }
                
            });
        }
    

    } catch (err){
        errors_setFunctionError(
            err,
            tableElement_logNameFile,
            "getCheckboxArray"
        );
    }
    
}

function  visibleColsButtonClick(idTable){
    columnsSettings_createPopup    ();
    createListItems(idTable);

    Action.hideItem($$("visibleColsEmptyTempalte"));
    Action.showItem($$("popupVisibleCols"));

    tableElement_createSpace    ();
}

function toolbarVisibleColsBtn(idTable){
    const idVisibleCols = idTable + "-visibleCols";

    const visibleCols = new Button({
    
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




//create open filter btn

function toolbarFilterBtn(idTable, visible){
    let idBtnEdit = idTable + "-editTableBtnId",
        idFilter  = idTable + "-filterId"
    ;

    const btn = new Button({
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
                    filter_filterBtnClick(idTable, idBtnEdit);
                }
            }
        },
        css            : "webix_btn-filter",
        titleAttribute : "Показать/скрыть фильтры",
    
       
    }).transparentView();

    return btn;
}



//create export btn

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

    const exportBtn = new Button({
    
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



//create open edit table btn

function tableElement_setSecondaryState(){
    const btnClass       = document.querySelector(".webix_btn-filter");
    const primaryClass   = "webix-transparent-btn--primary";
    const secondaryClass = "webix-transparent-btn";

    try{
        btnClass.classList.add   (secondaryClass);
        btnClass.classList.remove(primaryClass  );
    } catch (err) {   
        errors_setFunctionError(err, tableElement_logNameFile, "setSecondaryState");
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
    const table     = $$("table");
    const container = $$("container");

    function maxView () {
        const editContainer   = $$("editTableBarContainer");
        const filterContainer = $$("filterTableBarContainer");
        const filterForm      = $$("filterTableForm");
       
        const isVisible       = editForm.isVisible();
    
        Action.hideItem   (filterContainer);
        Action.hideItem   (filterForm);
      
        tableElement_setSecondaryState ();

        if (editForm && isVisible){
            mediator.tables.editForm.defaultState();

            Action.hideItem   (editForm);
            Action.hideItem   (editContainer);

            mediator.linkParam(false, "view");
            mediator.linkParam(false, "id"  );
            mediator.tabs.clearTemp("editFormTempData", "edit");

            table.unselectAll ();
        } else if (editForm && !isVisible) {
            Action.showItem (editForm);
            Action.showItem (editContainer);

            Action.hideItem ($$("tablePropBtnsSpace"));

            if(!isIdParamExists()){
                mediator.linkParam(true, {"view" : "edit"});
            }

            mediator.tabs.clearTemp("currFilterState", "filter");
        
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

    const minWidth = 850;
    if (container.$width < minWidth ){
        Action.hideItem(tree);
 

        if (container.$width < minWidth ){
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

    const btn = new Button({
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



//create table counter

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



//create apply notify
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

//create toolbar layout
function tableToolbar (idTable, visible = false) {

    const idFindElements   = idTable + "-findElements",
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

            ]},
        ]
    };
}


// create dynamic btns

function trashBtn(config, idTable){
    function delElem(){
 
        const table      = $$(idTable);
        const formValues = table.getItem(config.row);
        const itemTreeId = getItemId ();


        new ServerData({
    
            id : `${itemTreeId}/${formValues.name}`
           
        }).del(formValues).then(function(data){
        
            if (data){
                const selectEl = table.getSelectedId();
                table.remove(selectEl);
                setLogValue("success", "Данные успешно удалены");
            }
             
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

        if (columns && columns.length){
            columns.forEach(function(el,i){
            if (el.id == cell.column){
                url           = el.src;
                let urlArgEnd = url.search("{");
                url           = url.slice(0,urlArgEnd) + id + ".json"; 
            }
        }); 
        }
        
    } catch (err){
        errors_setFunctionError(err, tableElement_logNameFile, "createUrl");
    }
    return url;
}


function setProps(propertyElem, data){
    const arrayProperty = [];

 
    if (data && data.length){
        data.forEach(function(el, i){
            arrayProperty.push({
                type    : "text", 
                id      : i+1,
                label   : el.name, 
                value   : el.value
            });
        });

        propertyElem.define("elements", arrayProperty);
    }
 
}


function initSpace(propertyElem){
    hideViewTools();
    Action.showItem(propertyElem);
}


function resizeProp(propertyElem){
    const minPropWidth = 200;
    try{
        if (propertyElem.config.width < minPropWidth){
            propertyElem.config.width = minPropWidth;
            propertyElem.resize();
        }
    } catch (err){
        errors_setFunctionError(
            err,
            tableElement_logNameFile,
            "resizeProp"
        );
    }
}


function getProp(propertyElem, cell){
  
    const path = createUrl(cell);
    new ServerData({
        id         : path,
        isFullPath : true,
    
    }).get().then(function(data){
    
        if (data){
            const content = data.content;
            if (content && content.length){
                setProps    (propertyElem, content);
                initSpace   (propertyElem);
                resizeProp  (propertyElem);
            }
        
        }
         
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


//create table functions

function refreshTable(table){
    const tableId           = table.config.idTable;
    const oldOffset         = table.config.offsetAttr;

    const newOffset         = oldOffset + limitLoad;

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



function onResizeTable(table){
    table.attachEvent("onResize", function(width){
        const cols = table.getColumns();
        const scrollWidth = 17;
        width -= scrollWidth;
        let sum = 0;

        if (cols && cols.length){
            cols.forEach(function(col){
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
        }
        


    });
}


function toEditForm (nextItem) {
    const valuesTable = $$("table").getItem(nextItem); 

    function setViewDate(){
        const parseDate = webix.Date.dateToStr("%d.%m.%y %H:%i:%s");
 
        if (valuesTable){
            const values    = Object.values(valuesTable);
    
            if (values.length){
                try{
                    values.forEach(function(el, i){
                        if(el instanceof Date){
                   
                            const key        = Object.keys(valuesTable)[i];
                            const value      = parseDate(el);
                            valuesTable[key] = value;
                        }
                    
                    });
                } catch (err){ 
                    errors_setFunctionError(err, tableElement_logNameFile, "setViewDate");
                }
            }
           
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
                tableElement_logNameFile, 
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
                    tableElement_logNameFile,
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
                tableElement_logNameFile,
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

    onHeaderClick:function(config){
        const cols          = this.getColumns();
        const colId         = config.column;
        const currColConfig = this.getColumnConfig(colId);
        const self          = this;

        function resizeColumn(newWidth){
            self.setColumnWidth(colId, newWidth);
        }
        
        if (cols && cols.length){
            const lastIndex = cols.length - 1;
            let currColIndex;

            cols.forEach(function(col, i){
                if (col.id == colId){
                    currColIndex = i;
                }
            });

            if (lastIndex == currColIndex){
                 

                if (!$$("resizeLastCol")){
                    const width = currColConfig.width ? currColConfig.width : 0
                    webix.prompt({
                        title       : "Размер последней колонки",
                        ok          : "Применить",
                        cancel      : "Отменить",
                        css         : "webix_prompt-filter-lib",
                        input       : {
                            required    : true,
                            placeholder : "Введите число...",
                            value       : Math.round(width),
                        },
                        width       : 350,
                    }).then(function(result){
                      
                        if(result){

                            if (isNaN(+result)){
                                const text = "Нельзя изменить размер колонки." +
                                " «"+result + "» – не является числом";

                                errors_setFunctionError(
                                    text,
                                    tableElement_logNameFile, 
                                    "last column resize"
                                );
                            } else{
                                resizeColumn(result);
                            }
                           
                        }
                       
            
                    });
             
                }
            
                
      
           
               
            }
        }
        
    }




};

//create table layout

function tableElement_table (idTable, onFunc, editableParam = false) {
    return {
        view        : "datatable",
        id          : idTable,
        css         : "webix_table-style webix_header_border webix_data_border ",
        autoConfig  : true,
        editable    : editableParam,
        editaction  :"dblclick",
        minHeight   : 350,
        dragColumn  : true,
    //   height:200,
        footer      : true,
        select      : true,
        resizeColumn: true,
        sort        : [],
        offsetAttr  : limitLoad,
        on          : onFunc,
        onClick     :{
            "wxi-trash"     :function (event, config, html){
                trashBtn(config, idTable);
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
        tableElement_table ("table", onFuncTable, true)
    ]
};

function returnLayoutTables(id){

    const layout = {   
        id      : id, 
        hidden  : true, 
        view    : "scrollview", 
        body    : { 
          //  view  : "flexlayout",
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
            tableElement_table ("table-view"),
    
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

const tableElement_tools = {   
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
                tableElement_tools,
            ]},

        
        ],


    };

    return layout;
}



;// CONCATENATED MODULE: ./src/js/components/treeEdit.js
  
///////////////////////////////
//
// Медиатор                             (create mediator)
//
// Контекстное меню                     (create context menu)
//
// Формы с заданием условий для дерева  (create tree forms)
//
// Создание дерева                      (create tree data)
//
// Layout компонента                    (create layout)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////







const treeEdit_logNameFile = "treeEdit";


//create mediator
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
                treeEdit_logNameFile,
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
            errors_setFunctionError(err, treeEdit_logNameFile, "hideTreeTempl");
        }
    }

}


//create context menu
let treeItem;
let context ;
let treeEdit_titem ;
let menu ;  
let cmd ;  
let treeEdit_url ;
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

        if (pullValues && pullValues.length){
            pullValues.forEach(function(el,i){
                if (el.id !== option.id){
                    data.parse(option);
                }
            });
        }
       

    }

    static rename(option){
        const data       = this.returnComboData();
        const pullValues = this.returnPullValues();
   
        if (pullValues && pullValues.length){
            pullValues.forEach(function (el){

                if (el.id == option.id){
                    data.parse(option);
                }
            
            });
        }
      
    }

    static remove(option){
        const data       = this.returnComboData();
        const pullValues = this.returnPullValues();

        function removeSubItemOptions(id){
            const res = [id];

            tree.data.eachSubItem(id, function(obj){ 
                res.push(obj.id);
            }); 

            return res;
        }

        function isExists(element){
            let check = false;
            if (pullValues && pullValues.length){
                pullValues.forEach(function (el){

                    if (el.id == element){
                        check = true;
                    }
                });
            }
            return check;
        }

        const removeItems = removeSubItemOptions(option.id);
        if (removeItems && removeItems.length){
            removeItems.forEach(function (item){
                if (isExists(item)){
                    data.remove(item);
                }

            });
        }
    
    }

}


function treeEdit_addItem(text){
    postObj.name = text;
    postObj.pid = treeEdit_titem.id;

    new ServerData({
        id : treeEdit_url 
       
    }).post(postObj).then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (content){
                let idNewItem = content.id;
            
                treeItem.data.add({
                    id    : idNewItem,
                    value : text, 
                    pid   : treeEdit_titem.id
                }, 0, treeEdit_titem.id);
                
                treeItem.open(treeEdit_titem.id);
  
                const comboOption = {
                    id      : treeEdit_titem.id, 
                    value   : treeEdit_titem.value
                };

                Option.add(comboOption);
            
                setLogValue("success","Данные сохранены");
    
            }
        }
         
    });


}

function renameItem(text){
    postObj.name = text;
    postObj.id = treeEdit_titem.id;
    postObj.pid = treeEdit_titem.pid;

    new ServerData({
        id : treeEdit_url + treeEdit_titem.id
       
    }).put(postObj).then(function(data){
    
        if (data){

            treeEdit_titem.value = text;
            treeItem.updateItem(treeEdit_titem.id, treeEdit_titem);

            const option = {
                id    : treeEdit_titem.id, 
                value : treeEdit_titem.value
            };

            Option.rename(option);

            setLogValue("success", "Данные изменены");
    
            
        }
         
    });

}

function removeItem(){

    new ServerData({
        id : treeEdit_url + treeEdit_titem.id
       
    }).del(treeEdit_titem).then(function(data){
    
        if (data){
            const option = {
                id    : treeEdit_titem.id, 
                value : treeEdit_titem.value
            };

            Option.remove(option);

            treeItem.remove(treeEdit_titem.id);

            setLogValue("success", "Данные удалены"); 
    
        }
         
    });

}

function expandItem(){
    try{
        treeItem.open(treeEdit_titem.id);
        treeItem.data.eachSubItem(treeEdit_titem.id, function (obj){ 
            treeItem.open(obj.id);
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
        treeItem.close(treeEdit_titem.id);
        treeItem.data.eachSubItem(treeEdit_titem.id, function (obj){ 
            treeItem.close(obj.id);
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
    context     = self.getContext();
    treeItem    = $$("treeEdit");
    treeEdit_titem       = treeItem.getItem(context.id); 
    menu        = self.getMenu(id);
    cmd         = menu.getItem(id).value;
    treeEdit_url         = "trees/";

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
            ("Имя нового подэлемента '" + treeEdit_titem.value + "'", "");

            if (text != null) {
                treeEdit_addItem(text);
            }
            break;
        }
    
        case "Переименовать": {
            const text = prompt("Новое имя", treeEdit_titem.value);
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



//create tree forms
let tree;

const cssDisable = "tree_disabled-item";

function cssItems(action, selectItems){

    if (tree){
        const pull = tree.data.pull;

        if (pull){
            const values = Object.values(pull);

            if (values && values.length){
                values.forEach(function(item){
        
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
          
        }
    }
   
   
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

        if (items && items.length){
            items.forEach(function(id, i){
                const item  = tree.getItem(id);
                const owner = item.owner;
        
                if (owner == value){
                    resultItems.push(id);
                  
                }
    
            });
    
            cssItems("add", resultItems);
        }
        
    } else {

        if (values && values.length){
            values.forEach(function(el){
                const owner = el.owner; 
                if (owner && owner == value){
                    resultItems.push(el.id);
                
                }
            });
        }
   

    }

    cssItems("add", resultItems);

    showLastItem(resultItems);

    if (resultItems && resultItems.length){
        resultItems.forEach(function(id){
            openFullBranch(id);
        });
    }
   
 
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


function treeEdit_returnBtn(){
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
            treeEdit_returnBtn(),
            {}, 
        ]
    };

    return form;
}


//create tree data

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
function treeEdit_isParent(el){
    let res          = false;
    const firstChild = treeEdit.getFirstChildId(el);

    if (firstChild){
        res = true;
    }

    return res;
}

function findParents(treeData){
    const parents = [];

    if (treeData && treeData.length){
        treeData.forEach(function(item,i){

            if (treeEdit_isParent(item.id)){
                parents.push(item);
            }
           
        });
    
    }

    return parents;
}


function setComboValues(treeData){
    const parents = findParents(treeData);
 

    if (parents && parents.length){

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

    if (data && data.length){
        data.forEach(function(el){
            options.push({
                id    : el.id, 
                value : el.first_name
            });
        });
    }
 

    return options;
}

function setOptionsToCombo(options){
    const combo   = $$("editTreeComboOwner");
    combo.getPopup().getList().parse(options);
}

async function setOwnerComboValues(){

    const refField = await getRefField();

    new ServerData({
        id : refField 
       
    }).get().then(function(data){
    
        if (data){
    
            const content = data.content;
            if (content){
                const options = getOptions(content);
                setOptionsToCombo(options);
            }
        }
         
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
 

    if (data && data.length){
        data.forEach(function(el){
            if (el.pid == 0){
                const rootElement = createTreeItem(el);

                rootElement.open  = true;
                treeData.push ( rootElement );

            } else {
                const element = createTreeItem(el);

                treeData.push (element );
            }
        });
    }


    return treeData;
}

function createStruct(treeData){
    const treeStruct = [];
    const map        = {};
    try{

        if (treeData && treeData.length){
            treeData.forEach(function(el, i){

                map[el.id] = i; 
    
                if ( el.pid !== 0 && el.pid !== el.id && el.pid !== null ) {
                    treeData[map[el.pid]].data.push(el);
                } else {
                    treeStruct.push(el);
                }
            });
        }
    
    } catch (err) {
        errors_setFunctionError(err, treeEdit_logNameFile, "createStruct");
    }
    return treeStruct;
}

function getTrees(){

    new ServerData({
    
        id : "trees"
       
    }).get().then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (content){
                
                content[0].pid = 0;
        
                const treeData   = pushTreeData(content);
                const treeStruct = createStruct(treeData);
        
                treeEdit.parse      (treeStruct);
        
                setComboValues      (treeData);
                setOwnerComboValues ();
    
            }
        }
         
    });

}

function getInfoEditTree() {
    treeEdit  = $$("treeEdit");

    getTrees();

    if (treeEdit){
        treeEdit.clearAll();
    }   
 
}



//create layout


function renameTree(state, editor){
    
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

        new ServerData({
            id : `trees/${editor.id}`
           
        }).put(postObj).then(function(data){
        
            if (data){
                setLogValue("success", "Данные изменены");
            }
             
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


;// CONCATENATED MODULE: ./src/js/components/userAuth.js
  
///////////////////////////////
//
// Медиатор                 (create mediator)
//
// Layout редактора пароля  (create layout)
//
// Copyright (c) 2022 CA Expert

///////////////////////////////






//create mediator
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

//create layout

let userAuth_form;

function returnPassData(){
    const passData = userAuth_form.getValues();

    const objPass = {
        op: passData.oldPass,
        np: passData.newPass
    };

    return objPass;
}

async function doAuthCp (){

    userAuth_form = $$("cp-form");

    if ( userAuth_form && userAuth_form.validate()){

        const objPass = returnPassData();

        return await new ServerData({
    
            id : "cp"

        }).post(objPass).then(function(data){
        
            if (data){
                if (data.err){
                    setLogValue("success", data.err);
                }
                
                userAuth_form.clear();
                userAuth_form.setDirty(false);
                return true;
            }
             
        });


    } else {
        return false;
    }
   
}

const userAuth_headline = {   
    template   : "<div>Изменение пароля</div>",
    css        : 'webix_cp-form',
    height     : 35, 
    borderless : true
};

function userAuth_returnDiv(text){
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
            return userAuth_returnDiv (values);
        } else {
            return userAuth_returnDiv ("не указано");
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

const btnSubmit = new Button({
    
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
        userAuth_headline,
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


;// CONCATENATED MODULE: ./src/js/components/settings.js
///////////////////////////////
//
// Медиатор                                     (create mediator)
//
// Элемент с заголовком компонента              (create headline)
//
// Таббар с формами                             (create tabbar layout)
//
// Шаблон формы                                 (create form template)
//
// Форма настройки рабочего пространства        (create workspace settings tab)
//
// Форма других настроек                        (create other settings tab)
//
// Дефолтные значения форм                      (create default state)
//
// Сохранение пользовательских настроек         (create buttons)
//
// Layout пользовательских настроек             (create layout)
//
// Layout пользовательских настроек             (create user prefs settings)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////











const settings_logNameFile   = "settings";


//create mediator
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

//create headline


const settings_headline = {   
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
    settings_headline,
    userInfo,
];


//create tabbar layout

function createHeadlineSpan(headMsg){
    return `<span class='webix_tabbar-filter-headline'>
            ${headMsg}
            </span>`;
}

const settings_tabbar = {   
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
                        settings_logNameFile, 
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



//create form template
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

//create workspace settings tab


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
                    settings_logNameFile,
                    "onChange"
                );
            }
 
        }
    }
};


function returnFormElem(){
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
    body      : returnFormElem()
};



//create other settings tab

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
                    settings_logNameFile,
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

const saveHistoryRadio = {
    view            : "radio",
    labelPosition   : "top", 
    label           : "История последнего сеанса", 
    value           : 2,
    name            : "saveHistoryOpt", 
    options         : [
        {id : 1, value : "Сохранять"   },
        {id : 2, value : "Не сохранять"}
    ],
};

function settings_returnForm(){
    const elems = [{
        rows: [
            autorefRadio,
            {height:25},
            autorefCounter,
            {height:25},
            visibleIdRadio,
            {height:25},
            saveHistoryRadio,
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
    body      : settings_returnForm()
};



//create default state

const defaultValue = {
    userprefsOther     : {},
    userprefsWorkspace : {},
};


//create buttons

let tabbarElem;
let tabbarVal;
let settings_form;

let settings_values;
let settings_sentObj;

function settings_createSentObj(owner, values){
    const sentObj = {
        name  : "/settings",
        owner : owner,
        prefs : {
            [tabbarVal]:values
        }
    };

    return sentObj;
}

function putPrefs(id){

    return new ServerData({
        id : `userprefs/${id}`
       
    }).put(settings_sentObj).then(function(data){

        if (data){
            const formVals = JSON.stringify(settings_values);
            setStorageData (tabbarVal, formVals);

            const name         = tabbarElem.getValue();
            defaultValue[name] = settings_values;

            settings_form.setDirty(false);

            setLogValue(
                "success", 
                "Настройки сохранены"
            );
            return true;
        }
         
    });

}


function postPrefs(){
    
    return new ServerData({
        id : "userprefs"
       
    }).post(settings_sentObj).then(function(data){

        if (data){
            const tabbarVal         = tabbarElem.getValue();
            defaultValue[tabbarVal] = settings_values;

            settings_form.setDirty(false);

            setLogValue(
                "success", 
                "Настройки сохранены"
            );

            return true;
        }
         
    });
   
}




async function savePrefs(){
    const ownerId = await returnOwner();
    const name  = `userprefs.name='/settings'`;
    const owner = `userprefs.owner=${ownerId.id}`;

    return new ServerData({
        id : `smarts?query=${name}+and+${owner}&limit=80&offset=0`
       
    }).get().then(function(data){

        if (data && data.content){
        
            settings_values  = settings_form.getValues();

            if (data.content){
                settings_sentObj = data.content[0];
            } 
           
            if (settings_sentObj){ // modify exists settings
                const prefs = JSON.parse(settings_sentObj.prefs);
                prefs[`${tabbarVal}`] = settings_values;
   
                settings_sentObj.prefs = prefs;
            } else {
                settings_sentObj = settings_createSentObj(ownerId.id, settings_values);
            }


           

            if (settings_sentObj){
                if (data.content && data.content.length){ // запись уже существует
                    const content   = data.content;
                    const firstPost = content[0];
        
                    if (firstPost){
                        return putPrefs(firstPost.id);
                    }
                
                } else {
                    return postPrefs(); 
                }
            }
        
           
        }
         
    });
}


async function saveSettings (){
    tabbarElem    = $$("userprefsTabbar");
    const value   = tabbarElem.getValue();
    tabbarVal     = value + "Form" ;
    settings_form          = $$(tabbarVal);

    if (settings_form.isDirty()){
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


const clearBtn = new Button({
    
    config   : {
        id       : "userprefsResetBtn",
        hotkey   : "Shift+X",
        value    : "Сбросить", 
        click    : clearSettings,
    },
    titleAttribute : "Вернуть начальные настройки"

   
}).maxView();

const settings_submitBtn = new Button({
    
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
                settings_submitBtn,
            ]
        }
    ]
};

//create layout

const layoutTabbar =  {
    rows:[
        settings_tabbar,
        {
            cells:[
                workspaceLayout,
                otherFormLayout
            ]
        },
        buttons
    ]
};

//create user prefs settings

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



;// CONCATENATED MODULE: ./src/js/components/treeSidebar.js
  
///////////////////////////////
//
// Медиатор                             (create mediator)
//
// Отрисовка неизвестного компонента    (create null content)
//
// Отрисовка компонента выбранного      (create select component)
//
// Дефолтные состояния всех компонентов (create default states)
//
// Навигация по дереву                  (create navigate)
//
// Загрузка menu                        (create load menu logic)
//
// Загрузка fields                      (create load fields logic)
//
// Загрузка дерева с ошибкой            (create error load)
//
// Адаптив дерева                       (create adaptive)
//
// Layout дерева                        (create layout)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////

 






const treeSidebar_logNameFile = "treeSidebar";



//create mediator

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

//create null content
function createNullContent(id){
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

    return view;
}

//create select component
function setNameToTab(){
    mediator.tabs.changeTabName(false, false);
    const data = mediator.tabs.getInfo();
    data.tree  = {none:true};
    mediator.tabs.setInfo(data);
 
}

function createUndefinedView(){

    const id = "webix__null-content";

    // const view = {
    //     view  : "align", 
    //     align : "middle,center",
    //     id    : id,
    //     body  : {  
    //         borderless : true, 
    //         template   : "Блок в процессе разработки", 
    //         height     : 50, 
    //         width      : 220,
    //         css        : {
    //             "color"     : "#858585",
    //             "font-size" : "14px!important"
    //         }
    //     }
        
    // };
     
    if ( !($$(id)) ){
        try{

            if (mediator.tabs.isOtherViewTab()){
                mediator.tabs.addTab(true);
            } else {
                setNameToTab();
            }

            $$("container").addView(createNullContent(id), 2);
        } catch (err){ 
            errors_setFunctionError(
                err, 
                treeSidebar_logNameFile, 
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


    if (visiualElements && visiualElements.length){
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






//create default states
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




//create navigate

function getFields (id){
    const menu  = GetMenu.content;
    
    if (menu){
        try{
            Backbone.history.navigate("tree/" + id, { trigger : true });
        } catch (err){
            errors_setFunctionError(err, treeSidebar_logNameFile, "getFields");
        }
    }
}



//create load menu logic

function generateChildsTree  (el){
    let childs = [];

    
    const childsElems = el.childs;
    if (childsElems && childsElems.length){
        childsElems.forEach(function(child){
            childs.push({
                id     : child.name, 
                value  : child.title,
                action : child.action
            });
        });
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
            treeSidebar_logNameFile,
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

    if(isArray(menu, treeSidebar_logNameFile, "generateMenuTree")){
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


        if (delims && delims.length){
            delims.forEach(function(el){
                tree.addCss(el, "tree_delim-items");
    
            });
        }
      

    }
}





//create load fields logic
let treeSidebar_tree;
let id;
let selectItem;

function returnId(type, uid){
    return "q-" + type + "_data-tree_" + uid;
}

function addDisableItem(idLoadElement, value, idParent = id){
    treeSidebar_tree.data.add({
        id      :idLoadElement,
        disabled:true,
        value   :value
    }, 0, idParent );  
}

function createLoadEl(uid){
    const id = returnId("none", uid);
    addDisableItem (id, "Загрузка ...");
    treeSidebar_tree.addCss    (id, "tree_load-items");
}

function createNoneEl(uid, idParent){
    const id = returnId("none", uid);
    addDisableItem (id, "Раздел пуст", idParent);
}


function isUniqueItem (menu, data){
    let check  = true;

    if (isArray(menu, treeSidebar_logNameFile, "isUniqueItem")){
        menu.forEach(function(el, i){
            if (el.name == data){
                check = false;
                
            }
        });
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
        if( treeSidebar_tree.exists(load)){
            treeSidebar_tree.remove(load);
        }
        
        if( treeSidebar_tree.exists(none) && noneEl){
            treeSidebar_tree.remove(none);
        }
    } catch (err){
        errors_setFunctionError(
            err, 
            treeSidebar_logNameFile, 
            "removeTreeEls"
        );
    }
}

async function generateMenuData (typeChild, idParent, uid){
    await LoadServerData.content("fields");
    await LoadServerData.content("mmenu");

    const menu   = GetMenu.content;
    const keys   = GetFields.keys;
    const values = GetFields.values;

    let itemsExists = false;

    if (keys && keys.length){
        try{
        
            keys.forEach(function(data, i) {
    
                if (isTrueType(values[i], typeChild) && isUniqueItem(menu, data)){
            
                    treeSidebar_tree.data.add({
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
            
                if( !(treeSidebar_tree.exists(noneEl)) ){
                    createNoneEl(uid, idParent);
                    treeSidebar_tree.addCss(noneEl, "tree_none-items");
                }
            }
        } catch (err){
            errors_setFunctionError(
                err, 
                treeSidebar_logNameFile, 
                "generateMenuData"
            );
        }
    }

}


async function getMenuChilds(uid) {

    const selectedItem  = treeSidebar_tree.getItem(id);
    if (selectedItem.action.includes("all_")){
        const index = selectedItem.action.indexOf("_");
        const type  = selectedItem.action.slice  (index + 1);
  
        generateMenuData (type, id, uid);
    }
   
}



function treeSidebar_loadFields(selectId, treeItem){
 
    const uid = webix.uid();
  
    treeSidebar_tree = $$("tree");
    id   = selectId;
    selectItem = treeItem;

    const item = treeSidebar_tree.getItem(id);

    if (treeSidebar_tree.getItem(id) && item.$count === -1){
        createLoadEl (uid);
        getMenuChilds(uid);
    }
  
}





//create error load
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


//create adaptive
const minWidth    = 850;
function setAdaptiveState(){
    try{
        if (window.innerWidth < minWidth ){
            $$("tree").hide();
        }
    } catch (err){
        errors_setFunctionError(
            err, 
            treeSidebar_logNameFile, 
            "setAdaptiveState"
        );
    }
}



//create layout

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
                const tabbar       = $$("globalTabbar");
                const isTabsExists = tabbar.config.options.length;

                if (!isTabsExists){
                    tabbar.addOption({
                        id    : id, 
                        value : "Новая вкладка", 
                        info  : {
                            tree:{
                                none:true
                            }
                        },
                        close : true, 
                    }, true);
                }
       
              
                if (!this.config.isTabSelect){  // !(tree select by tab click)
                    const item = this.getItem(id);

                    if (!isBranch(id) || item.webix_kids){
                        this.open(id);
                    }
                    preparationView(id);
                } else {
                    mediator.forms.defaultState();
                }
            },

            onBeforeOpen:function (id, selectItem){
                treeSidebar_loadFields(id, selectItem);
            },

            onAfterSelect:function(id){
                
                if (!this.config.isTabSelect){ // !(tree select by tab click)
                  //  mediator.tabs.changeTabName(id);
                    getFields (id);
                    setAdaptiveState();
                } else {
                    this.config.isTabSelect = false;
                }
     
            },

        },

        ready:function(){
           
        }

    };

    return tree;
}


;// CONCATENATED MODULE: ./src/js/blocks/checkFonts.js
///////////////////////////////

// Проверка для иконочного шрифта

// Copyright (c) 2022 CA Expert

///////////////////////////////




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


;// CONCATENATED MODULE: ./src/js/components/favorites.js
  
///////////////////////////////
//
// Попап с избранными страницами
//
// Copyright (c) 2022 CA Expert

///////////////////////////////













const favorites_logNameFile = "favorites";
const favorites_minWidth    = 1200;
const k           = 0.89;
function setAdaptiveSize(popup){
    if (window.innerWidth < favorites_minWidth ){
        const size  = window.innerWidth * k;
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

        if (data && data.length){
            data.forEach(function(el){
                if (el.name.includes("fields/") && id == el.owner){
             
                    const prefs  = JSON.parse(el.prefs);

                    if (prefs && prefs.favorite){
                        prefs.favorite.dataId = el.id;
                        collection.push(prefs.favorite);
                    }
         
                    
                }
            });
        }
       
    } catch (err){
        errors_setFunctionError(
            err, 
            favorites_logNameFile, 
            "findFavsisUserData"
        );
    }
    
    return collection;
}


function favorites_createOptions(data, user){
    const favCollection = findFavsInUserData(data, user.id);
    const radio         = $$("favCollectionLinks");
    try{
        if (favCollection && favCollection.length){
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

        Action.showItem($$("popupFavsLink"));

    } catch (err){
        errors_setFunctionError(
            err, 
            favorites_logNameFile, 
            "createOptions"
        );
    }
 
}

async function favsPopupCollectionClick (){

    const user = await returnOwner();

    new ServerData({
        id : "userprefs"
       
    }).get().then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (content){
                if (user){
                    favorites_createOptions(content, user);
                }
    
            }
        }
         
    });


    
}

function favsPopupSubmitClick(){
    try{
        const radio   = $$("favCollectionLinks");
        const value   = radio.getValue();
        const option  = radio.getOption(value);
        const fieldId = option.id;

        if (fieldId){
            const infoData = {
                tree:{
                    field : fieldId,
                    type  : "dbtable" 
                },
            };
    
            mediator.tabs.openInNewTab(infoData);    
        }
        Action.destructItem($$("popupFavsLink"));

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

const favorites_btnSaveLink = new Button({

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


function removeOption(options, option){
      
    const length = options.data.options.length;
    if (length == 1){
        const emptyOpt = favorites_returnEmptyOption();
        options.addOption(emptyOpt);
    }

    options.removeOption(option.id);

}

function putItem(item, options, option){

    new ServerData({
        id : `userprefs/${item.id}`
       
    }).put(item).then(function(data){
    
        if (data && data.content){
            
            setLogValue(
                "success", 
                "Ссылка удалена из избранного"
            );
            
            removeOption(options, option);
        }
         
    });
}


async function deleteUserprefsData(options, option){
 
    if (option && options){
        const owner   = await returnOwner();
        const name    = `userprefs.name+=+%27fields/${option.id}%27`;
        const ownerId = `userprefs.owner+=+${owner.id}`;
        new ServerData({
            id : `smarts?query=${name}+and+${ownerId}&limit=80&offset=0`,
           
        }).get().then(function(data){
        
            if (data && data.content){
                const item = data.content[0];

                if (item){
                    const prefs = JSON.parse(item.prefs);
                  
                    if (prefs.favorite){
                        delete prefs.favorite;
                    }

                    item.prefs = prefs;

                    putItem(item, options, option);
                }

            }
             
        });
    }

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
    const removeBtn = new Button({

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

    const popupFavsLink = new Popup({
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




;// CONCATENATED MODULE: ./src/js/components/header.js
///////////////////////////////
//
// Меню пользователя. Загрузка                  (create load data)
//
// Дефолтное состояние header после адаптива    (create default state)
//
// Кнопка пользовательских функций              (create user prefs btn)
//
// Кнопка сокрытия лога                         (create log btn)
//
// Кнопка сокрытия дерева                       (create collapse btn)
// 
// Layout                                       (create layout)
//
// Медиатор                                     (create mediator)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////











const header_logNameFile = "header";

//create load data
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

    if (isArray(menu, "header/loadContextMenu", "generateHeaderMenu")){
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
 

}





//create default state
function headerDefState(){
    const headerChilds = $$("header").getChildViews();

    if (isArray(headerChilds, "header/setDefaultState", "headerDefState")){
        headerChilds.forEach(function(el){
            if (el.config.id.includes("search")){
                el.show();
            }
        });
    }
  
}
//create user prefs btn

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
        errors_setFunctionError(
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

//create log btn

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

    const minHeight = 5;
    
    const maxHeight = 90;

    function setState (height,icon){
        logBtn.config.badge     = "";

        logLayout.config.height = height;
        logLayout.resize();

        logBtn.config.icon      = icon;
        logBtn.refresh();
    }

    if (newValue == 2){
        setState (maxHeight, "icon-eye-slash");
        list.showItem(lastItemList);

    } else {
       
        setState (minHeight, "icon-eye");
    }
}


const logBtn = new Button({
    
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
        },
        setStorageData:function(){

        }
    },
    titleAttribute : "Показать/скрыть системные сообщения"

   
}).minView();

//create collapse btn
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

    if (isArray(headerChilds, header_logNameFile, "setSearchInputState")){
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

   
}


function collapseClick (){
    const treeContainer = $$("sidebarContainer");
    const tree          = $$("tree");
    const resizer       = $$("sideMenuResizer");

    function showTree(){
        Action.showItem(treeContainer);
        Action.showItem(tree);

        const minWidthResizer = 600;

        if(window.innerWidth >= minWidthResizer){
            Action.showItem(resizer);
        } 
     
    }

    function hideTree(){
        Action.hideItem(treeContainer);
        Action.hideItem(tree);
        Action.hideItem(resizer);
        
    }

    try {

        const minWidth = 850;
        if (window.innerWidth > minWidth ){
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
            header_logNameFile,
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

//create layout
const logo = {
    view        : "template",
    borderless  :true,
    css         :{"background-color":"transparent!important"},
    template    : "<img src='/init/static/images/expalogo.png' "+
        " style='height:30px; margin: 10px;'>", 
    height      : 25,
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
    on:{
        onViewResize:function(){
            console.log(12)
        }
    }
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


//create mediator
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


;// CONCATENATED MODULE: ./src/js/components/tabs.js

///////////////////////////////
//
// Медиатор                                                 (create mediator)
//
// Кнопка с историей и восстановлением последней вкладки    (create restore btn)
//
// Клик на таб                                              (create tab click logic)
//
// Восстановление утерянных вкладок после перезагрузки      (create restore data logic)
//
// layout кнопки добавления вкладки                         (create add btn layout)
//
// Добавление и удаление вкладок                            (create add tab logic)
//
// Layout панели вкладок                                    (create layout)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////






 




//create mediator
const TABS_HISTORY  = [];
const TABS_REMOVED  = [];

function isOtherViewTab(id){
    const option = $$("globalTabbar").getOption (id);

    if (option && option.isOtherView){
        return true;
    }

}

function createTab(){
    $$("globalTabbar").addOption({
        id    : webix.uid(), 
        value : " ", 
        info  : {
        },
        close : true, 
    }, true);
    
}

function changeName(self, values){
    
    if (values && values.tree){
        const id = values.tree.field;
        self.changeTabName(id);
    }
   
}

function getFieldsname(id){
    const field    = GetFields.item(id);
    let name; 

    if (field){
        const plural   = field.plural ;
        const singular = field.singular ;
    
      
    
        if (field){
            name = plural ? plural : singular;
        } else {
            name = "Новая вкладка";
        }
    } else {
        errors_setFunctionError(
            "Ссылки с id " + id + " не существует" , 
            "tabs/_tabMediator", 
            "getFieldsname"
        );
    }




    return name;
}

function tabs_setName(name){
    const tabbar   = $$("globalTabbar");
    const tabId    = tabbar.getValue   ();

    const tabIndex = tabbar.optionIndex(tabId);


    if (tabIndex > -1){
        tabbar.config.options[tabIndex].value = name;
        tabbar.refresh();
    }
}

function hasDirtyForms(){
    const forms = mediator.getForms();
    let check = {
        dirty:false
    };

    if (forms && forms.length){
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

function copyHistory(currHistory){
    
    let res = currHistory;

    
    if (currHistory.length > 4){
        res = res.slice(1);
    } 

    return res;
}

function checkAlreadyExists(history, currLastPage){
 
    const lastIndex = history.length - 1;
    const lastElem  = history[lastIndex];

    if (lastElem && lastElem.field == currLastPage.field){
        return true;
    }
 
}

function addLastPage(treeData, history){
    const lastPage = treeData;
    
    if (treeData && !treeData.none){ // isn't empty page
      
        const alreadyExists = checkAlreadyExists(history, lastPage);  //already exists in history
      
        if (!alreadyExists){
            mediator.tabs.addTabHistory(lastPage);
            history.push               (lastPage);  
        }
        
    } 
    
    return history;
}


function returnHistory(tabbar, tabIndex){
    const conf        = tabbar.config.options[tabIndex].info;
    const currHistory = conf.history;

    let history     = [];

    if (currHistory){
        history = copyHistory(currHistory); 
    } 

    history = addLastPage(conf.tree, history);

    return history;
}
function getTabConfig(){
    const tabbar = $$("globalTabbar");
    const id     = tabbar.getValue();
    return tabbar.getOption(id);
}

function unblockHistoryBtns(){
    const prevBtn = document.querySelector('.historyBtnLeft');
    const nextBtn = document.querySelector('.historyBtnRight');

    if (prevBtn && nextBtn){
        const option = getTabConfig();

        if (option){
            const history = option.info.history;
           
             if (history.length > 1){
                const id = prevBtn.getAttribute("view_id");
                
                Action.enableItem($$(id));
                


                // prev btn
            }

 
        }
       
    }
}

 
class Tabs {
    addTab(isNull, open = true){
        return add(isNull, open);
    }

    
    removeTab(lastTab){
        remove(lastTab);
    }

    setDataToStorage(tabbar, tabId){
        const options = tabbar.config.options;
                
        const data = {
            tabs   : options,
            select : tabId
        };
    
        webix.storage.local.put("tabbar", data);
    }
     
    

    isOtherViewTab(){
        const tabbar = $$("globalTabbar");
        const id     = tabbar.getValue();
        const option = $$("globalTabbar").getOption (id);
    
        if (option.isOtherView){
            return true;
        } 
    }

    clearTemp(name, type){
        webix.storage.local.remove(name);

        const tabbar = $$("globalTabbar");
        const idTab  = tabbar.getValue();
        const tab    = tabbar.getOption(idTab);
    
        if (tab.info.temp){
            if (type == "filter"){
                if (tab.info.temp.filter){
                    delete tab.info.temp.filter;
                }
            } else if (type == "edit"){
                if (tab.info.temp.edit){
                    delete tab.info.temp.edit;
                }
            }
            
        }
    }

    setInfo(values, addHistory=true){
  

        const tabbar = $$("globalTabbar");
        let tabId    = tabbar.getValue();
    

        if ( isOtherViewTab(tabId)){
            createTab();
            tabId = tabbar.getValue();
        }
       
        const tabIndex = tabbar.optionIndex(tabId);
 
        if (tabIndex > -1){

           
            const oldHistory = tabbar.config.options[tabIndex].info.history;
        
            tabbar.config.options[tabIndex].info = values;
            tabbar.refresh();


            changeName(this, values);


            
            if (addHistory){
                values.history = oldHistory;
                const history  = returnHistory(tabbar, tabIndex);
                values.history = history;
                
            }
        
            this.setDataToStorage(tabbar, tabId);
        }
    }

    getInfo(){
        const tabbar   = $$("globalTabbar");
        const tabId    = tabbar.getValue();
        const tabIndex = tabbar.optionIndex(tabId);

        return tabbar.config.options[tabIndex].info;
     
    }
    
    changeTabName(id, value){

        let name;
 
        if (!id && !value){
            name = "Новая вкладка";
        } else {
            if (id){
                name = getFieldsname(id);
            } else {
                name = value;
            }

         
      
        }
 
        tabs_setName(name);

    }

    setDirtyParam(){

        const tabbar = $$("globalTabbar");
        const id     = tabbar.getValue();
        const option = tabbar.getOption(id);

        if (option && option.info){
            option.info.dirty = hasDirtyForms().dirty;  
        }
    
     
    }

    openInNewTab(config){
        const newTabId = this.addTab();

        mediator.tabs.setInfo(config);

        tabs_tabbarClick("onBeforeTabClick", newTabId);
        tabs_tabbarClick("onAfterTabClick" , newTabId);
    }

    getTabHistory(){
        return TABS_HISTORY;
    }

    saveTabHistory(){
        const sentObj = {
            history : mediator.tabs.getTabHistory()
        };
    
        webix.storage.local.put("tabsHistory", sentObj);
    }

    addTabHistory(page){

        console.log()
      
        if (TABS_HISTORY.length > 10){
            TABS_HISTORY.shift();
        }

       
        unblockHistoryBtns();
        TABS_HISTORY.push(page);

        this.saveTabHistory();
    }

    removeTabHistoryPage(index){
        TABS_HISTORY.splice(index,  1);

        this.saveTabHistory();
    }

    clearTabHistory(){
        TABS_HISTORY.length = 0;

        this.saveTabHistory();
    }

    addRemovedTab(page){
        if (TABS_REMOVED.length > 10){
            TABS_REMOVED.shift();
        }
        TABS_REMOVED.push(page);
        
    }

    deleteOpenRemovedTab(index){
        TABS_REMOVED.splice(index,  1);
        
    }

    getRemovedTabs(){
        return TABS_REMOVED;
    }


    setHistoryBtnState(isNextBtn, enable = true){
        const id   = isNextBtn ? "Right" : "Left";
        const css  = `historyBtn${id}`;

        const node = document.querySelector(`.${css}`);
        
        if (node){
            const id  = node.getAttribute("view_id");

            if (enable){
                Action.enableItem($$(id));
            } else {
                Action.disableItem($$(id));
            }
           
        
        }
    }

 

}




//create restore btn

function getSelectedOption(){
    const radio      = $$("tabsHistoryList");
    const selectedId = radio.getValue();
    return radio.getOption(selectedId);
}


function tabs_returnEmptyOption(){
    return {   
        id       : "radioNoneContent", 
        disabled : true, 
        value    : "История пуста"
    };
}

function returnItem(config, index){
    
    const item = GetFields.item(config.field);
    const name = item.plural ? item.plural : item.singular;
  
    return {
        id    : webix.uid(),
        value : name,
        config: config,
        index : index
    };
   
}

function returnListItems(){
    const history = mediator.tabs.getTabHistory();
    const items = [];

    if (history && history.length){
     
        history.forEach(function(el, i){
            items.push(returnItem(el, i));
        });

    } else {
        items.push(tabs_returnEmptyOption());
    }

    return items;
}


function returnRadio(){
    const radio = {
        view     : "radio", 
        id       : "tabsHistoryList",
        vertical : true,
        options  : returnListItems(),
        on       : {
            onChange:function(newValue, oldValue){
                if (newValue !== oldValue){
                    Action.enableItem($$("tabsHistoryBtn"));
                }
            }
        }
    };

    return radio;
}

function returnRadioList(){
    const container = {
        view       : "scrollview",
        scroll     : "y",
        maxHeight  : 300,
        borderless : true,
        body       : {
            rows: [
                returnRadio()
            ]
        }
    };

    return container;
}


function openLink(){
    const option = getSelectedOption();
 
    const createConfig = {
        tree: option.config
    };

    mediator.tabs.openInNewTab(createConfig);

    Action.destructItem($$("popupTabsHistory"));
}

function returnOpenBtn(){
    const btn = new Button({
        config   : {
            id       : "tabsHistoryBtn",
            hotkey   : "Ctrl+Shift+Space",
            value    : "Открыть ссылку", 
            disabled : true,
            click    : function(){
                openLink();
            },
        },
        titleAttribute : "Открыть ссылку"
    
       
    }).maxView("primary");

    return btn;
}

function returnSuccessNotify(text){
    setLogValue ("succcess", text, '"expa'); 
}



function clearAllClick(){

    modalBox("История будет очищена полностью", 
        "Вы уверены?", 
        ["Отмена", "Продолжить"]
    )
    .then(function (result){
        if (result == 1){
            mediator.tabs.clearTabHistory();
            Action.destructItem($$("popupTabsHistory"));
            returnSuccessNotify("История успешно очищена");
        }

    });

}

function tabs_removeOptionState (option){
    const radio = $$("tabsHistoryList");
    try{

        option.value = option.value + " (запись удалена)";
        radio.refresh();
        
        radio.disableOption(option.id);

    } catch (err){
        errors_setFunctionError(
            err, 
            "tabs / tabsHistory", 
            "removeOptionState"
        );
    }
}

function removeItemClick(){
    const option = getSelectedOption();
 
    if (option){
        const name = option.value;
        modalBox("Запись «" + name + "» будет удалена из истории", 
            "Вы уверены?", 
            ["Отмена", "Продолжить"]
        )
        .then(function (result){
            if (result == 1){
                
                mediator.tabs.removeTabHistoryPage(option.index);
                tabs_removeOptionState (option);
                returnSuccessNotify("Запись «" + name + "» удалена из истории");
            }
    
        });
    } else {
        webix.message({
            text :"Запись не выбрана",
            type :"error", 
        });
    }
 
   
}



function tabs_returnRemoveBtn(){
    const removeBtn = new Button({

        config   : {
            id       : "removeTabsHistory",
            hotkey   : "Alt+Shift+R",
            icon     : "icon-trash",
            popup   : {

                view    : 'contextmenu',
                css     : "webix_contextmenu",
                data    : [
                    { id: 'clearSingle', value: 'Удалить ссылку'   },
                    { id: 'clearAll',    value: 'Очистить историю' }
                ],
                on      : {
                    onItemClick: function(id){
                        if (id == "clearAll"){
                            clearAllClick();
                        } else if (id == "clearSingle"){
                            removeItemClick();
                            // проверить выбрана ли ссылка
                        }
     
                    }
                }
            },

        },
        titleAttribute : "Очистить историю / удалить выбранную ссылку"
       
    }).minView("delete");

    return removeBtn;
}


function openHistoryPopup(){
 
    const popup = new Popup({
        headline : "История",
        config   : {
            id    : "popupTabsHistory",
            width : 500,
    
        },

        elements : {
            rows : [
                returnRadioList(),
                {cols:[
                    returnOpenBtn(),
                    tabs_returnRemoveBtn()
                ]}
            ]
          
        }
    });

    popup.createView ();
    popup.showPopup  ();
}

function findLastRemovedTab(){
    const removedHistory = mediator.tabs.getRemovedTabs();

    if (removedHistory){
        const index = removedHistory.length - 1;
        const tab   =  removedHistory[index];

        mediator.tabs.deleteOpenRemovedTab(index);

        return tab;

    }

}

function openClosedTab(){
    const lastRemovedTabConfig = findLastRemovedTab();
    if (lastRemovedTabConfig){
        mediator.tabs.openInNewTab({tree:lastRemovedTabConfig});
    }
   
    
}

function tabsHistoryBtn(){
    const btn = new Button({
        
        config   : {
            id       : "historyTabBtn",
           // hotkey   : "Ctrl+Shift+A",
            icon     : "icon-file", //wxi-plus
            popup   : {

                view    : 'contextmenu',
               
                css     : "webix_contextmenu",
                data    : [
                    { id: 'addTab' , value: 'Новая вкладка'            },
                    { id: 'history', value: 'Открыть историю'          },
                    { id: 'restore', value: 'Открыть закрытую вкладку' },
                    { id: 'empty'  , value: '',                        }
                ],
                on      : {
                    onItemClick: function(id){
                        if (id == "addTab"){
                            mediator.tabs.openInNewTab({tree:{none:true}});

                        } else if (id == "history"){
                            openHistoryPopup();

                        } else if (id == "restore"){
                           openClosedTab();
                        }  
     
                    }
                }
            },
            // click    : function(){
            //     openHistoryPopup();
            // },
        },
        titleAttribute : "Действия с вкладками"
    
       
    }).transparentView();

    return btn;
}






//create tab click logic


function returnSelectElem(type){
   
    let selectElem; 
        
    if (type == "dbtable"){
        selectElem = "tables";

    } else if(type == "tform"){
        selectElem = "forms";

    } else if(type == "dashboard"){
        selectElem = "dashboards";
    // Action.hideItem($$("propTableView"));

    }  

    return selectElem;
}

function hideOtherElems(selectElem){
    const visiualElements = mediator.getViews();


    if (visiualElements && visiualElements.length){
        visiualElements.forEach(function(elem){
            if (elem !== selectElem){
                Action.hideItem($$(elem));
            } 
        });
    }

    Action.hideItem ($$("webix__null-content"));
    Action.hideItem ($$("webix__none-content"));

}


function showContent(selectElem, id){
    if (selectElem == "tables" || selectElem == "forms"){
        mediator.tables.showExists(id);
    } else if (selectElem == "dashboards"){
        mediator.dashboards.showExists(id);
    }

}

function selectTree(id, isOtherTab){
   
    const tree = $$("tree");
    if ( tree.exists(id) && isOtherTab){
        tree.config.isTabSelect = true;
        tree.select(id);
       // tree.showItem(id);
    }

    // if parent is closed ??
}

function setLink(id){

    const path = "tree/" + id;
    
    Backbone.history.navigate(path);
 
}

function setEmptyState(){
    mediator.hideAllContent();
    Backbone.history.navigate("tree/tab?new=true", { trigger : true });
    Action.showItem ($$("webix__none-content"));
}

function changeHistoryBtnsState(){
    const config = mediator.tabs.getInfo();
 
    if (config && config.history){
        const history  = config.history;
        const nextPage = config.nextPage;

        if (history.length > 1){
            mediator.tabs.setHistoryBtnState(false);
        } else {
            mediator.tabs.setHistoryBtnState(false, false);
        }
 
        if (nextPage){
            mediator.tabs.setHistoryBtnState(true);
        } else {
            mediator.tabs.setHistoryBtnState(true, false);
        }
 
    }
    
}

function showTreeItem(config, isOtherTab, isOtherView){

    if (isOtherView){
        Backbone.history.navigate("/" + config.view, { trigger : true });
    } else {

        const id              = config.field;
        const type            = config.type;
    
        if (config.none){ //none-content
            setEmptyState();

        } else {
            const selectElem = returnSelectElem(type);

            hideOtherElems(selectElem);

            Action.showItem ($$(selectElem));
    

            if (id){
                setLink    (id);
                showContent(selectElem, id);
                selectTree (id, isOtherTab);

            }

        }


        changeHistoryBtnsState();
       
    }

}







//create restore data logic

function restoreTempData(tempConfig, field){
  
    const filter = tempConfig.filter;
    const edit   = tempConfig.edit;

    if (filter){
    
        if (filter.dashboards){
            const data = {
                content : filter.values
            };
            
            webix.storage.local.put("dashFilterState", data);
        } else {
       
            if (tempConfig.queryFilter){
                const table = getTable();
                if (table){
                    table.config.filter = {
                        table : filter.id,
                        query : tempConfig.queryFilter
                    };
                  
                }

             
            }
            webix.storage.local.put("currFilterState", filter);
        }
    
        window.history.pushState('', '', "?view=filter");
  
    }  
 
    if (edit){
         
        webix.storage.local.put("editFormTempData", edit.values);
        if (edit.selected){
            window.history.pushState('', '', "?id=" + edit.selected);
        }

    }


   
}







//create add btn layout

function createAddBtn(){
    const btn = new Button({
    
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






//create add tab logic


/// add tab 

function tabs_clearTree(){
    const tree = $$("tree");
    if (tree){
        tree.unselectAll();
    }
  
}

function tabs_createEmptySpace(show, hide){
    Action.showItem (show);  
    Action.hideItem (hide);
}

function tabs_createSpace(isNull){
    const nullContent = $$("webix__null-content");
    const noneContent = $$("webix__none-content");

   
    if (isNull){
        tabs_createEmptySpace(nullContent, noneContent);
    } else {
        tabs_createEmptySpace(noneContent, nullContent);
    }
}

function setPath(){
    Backbone.history.navigate(
        "tree/tab?new=true", 
        { trigger : true }
    );
}

function tabs_setToStorage(idTab){
    const options = $$("globalTabbar").config.options;
 
    if (options){

        const data = {
            tabs   : options,
            select : idTab
        };

        webix.storage.local.put   ("tabbar", data);
    } else {
        webix.storage.local.remove("tabbar");
    }   
}


function setDefaultState(){
    mediator.tables.defaultState();
    mediator.dashboards.defaultState();
    mediator.forms.defaultState();
}

function add(isNull, open){
    const tabbar = $$("globalTabbar");
    const id     = webix.uid();

   // let pathParam;

    const treeConfig =  {
        tree:{
            none : true
        }
    };


    tabbar.addOption({
        id    : id, 
        value : "Новая вкладка", 
        info  : treeConfig,
        close : true, 
    }, open);

    tabs_clearTree();

    if (open){
        setDefaultState();
    }

    mediator.hideAllContent(false);


    tabs_setToStorage();

    tabs_createSpace (isNull);

    setPath     ();

    return id;
}


// remove tab

function setEmptyTabLink(){
    Backbone.history.navigate(
        "tree/tab?new=true", 
        { trigger : true }
    );
}

function emptyTabsLogic(lastTab){
    const tabbar = $$("globalTabbar");

    tabbar.setValue(lastTab);
    const options = tabbar.config.options;

    let conutEmptyTabs = 0;
    if (options && options.length){
        options.forEach(function(el, i){
            if (el.info && el.info.tree && el.info.tree.none){ // empty tab
                conutEmptyTabs ++;
            }
        });
    }
  
     
    if (options.length == conutEmptyTabs){ // all tabs is empty
        setEmptyTabLink();
    }
}

function createConfig(lastTab){
    const option = $$("globalTabbar").getOption(lastTab);

    const treeConfig = option.info.tree;
    const tempConfig = option.info.temp;


    if (treeConfig){
        showTreeItem(treeConfig, true, option.isOtherView);
    }

    if (tempConfig){
        restoreTempData(tempConfig);
    }  
}






function remove(lastTab){

    setDefaultState();

    if (lastTab.length){
        emptyTabsLogic(lastTab);

        mediator.tables.filter.clearAll();

        createConfig(lastTab);
        
    } else {   
        setEmptyTabLink();
        mediator.hideAllContent();

    }

    tabs_clearTree();

    tabs_setToStorage(lastTab);
}






//create layout


let prevValue;

function setStateToStorage(idTab){
    const tabbar  = $$("globalTabbar");
    const options = tabbar.config.options;
    
 
    const data = {
        tabs   : options,
        select : idTab
    };

    webix.storage.local.put("tabbar", data);
}

function isOtherTab(id){
    let check = true;

    if (id == prevValue){
        check = false;
    }

    return check;
}

function createConfigSpace(id){
    const option     = $$("globalTabbar").getOption(id);
  
    const treeConfig = option.info.tree;
    const tempConfig = option.info.temp;
  
    if (treeConfig){
        showTreeItem(
            treeConfig, 
            isOtherTab(), 
            option.isOtherView
        );

 
        if (tempConfig){
            restoreTempData(
                tempConfig, 
                treeConfig.field
            );
        }
    }    
}

function tabs_tabbarClick(ev, id){
    $$("globalTabbar").callEvent(ev, [ id ]);
}



function restoreTabbar(data){
    const tabbar = $$("globalTabbar");
    const tabs   = data.tabs;
    const select = data.select;

    if (tabs && tabs.length){
        tabs.forEach(function(option){
            tabbar.addOption(option, false); 
        });
    }
   
  
    if (select){
    
        tabbar.setValue(select);
 
        tabs_tabbarClick("onBeforeTabClick", select);
   
        tabs_tabbarClick("onAfterTabClick" , select);
  
    } else {
        const options = tabbar.config.options;
        const index   = options.length - 1;
        const lastOpt = options[index]; 
        if (lastOpt){
            const id  = lastOpt.id;
            tabbar.setValue(id);
        }

   
    }
}

function addNewTab(){
    $$("globalTabbar").addOption( { 
        id    : "container", 
        value : "Новая вкладка", 
        info  : {},
        close : true
    }, true); 
}


function isSelectedOption(id){
    const selectOpt = $$("globalTabbar").getValue();
    if ( selectOpt == id ){
        return true;
    }
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
           
        ],
        on:{


            onBeforeTabClick:function(){
        
                const clearDirty = false;
                mediator.tables.defaultState("edit", clearDirty);
                
                mediator.tables.defaultState("filter");
                
                mediator.dashboards.defaultState();
               
                mediator.forms.defaultState();

                prevValue = this.getValue();
         
            },

            onAfterTabClick:function(id){
            
                mediator.tables.filter.clearAll();

                createConfigSpace(id);

                setStateToStorage(id);
        
            },


            setStorageData:function(){
                const data  = webix.storage.local.get("tabbar");
          
                
                if (data && data.tabs.length){
                 
                    restoreTabbar(data);
                  
                } else {
                    addNewTab();
                }
            },

            onBeforeTabClose: function(id){
               
                const tabConfig = this.getOption(id);
                if (tabConfig && tabConfig.info){
                    mediator.tabs.addRemovedTab(tabConfig.info.tree);
                }
                
                const tabbar     = this;
                const option     = tabbar.getOption(id);
                const isTabDirty = option.info.dirty;
   

                if (isSelectedOption(id)){ // текущая вкладка

                    mediator.getGlobalModalBox().then(function(result){

                        if (result){
                            tabbar.removeOption(id);
                        }
    
                    });

                } else { // другая вкладка
        
                    if (isTabDirty){
                        tabbar.setValue(id);
                 
                        tabs_tabbarClick("onBeforeTabClick", id);
                        tabs_tabbarClick("onAfterTabClick" , id);
    
                        const optionData = mediator.tabs.getInfo();
                        optionData.isClose = true;
                        mediator.tabs.setInfo(optionData);
                    } else {
                        tabbar.removeOption(id);
                    }
              
                } 
            
                return false;
            },


            onOptionRemove:function(removedTab, lastTab){
      
                mediator.tabs.removeTab(lastTab);

            },

           
          
        }
     
    };

    const layout = {

        rows:[
            {height:6},
            {  
                cols:[
                    createAddBtn(),
                    tabbar,
                    tabsHistoryBtn()
                ]
            },
            {height:6},
        ]
      
    };

    return layout;
}


;// CONCATENATED MODULE: ./src/js/blocks/globalModalBox.js
///////////////////////////////
//
// Модальное окно: проверяет чисты ли все формы 
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////






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

    if (storageData){
        form.setValues(storageData);
    }
    
}

function unsetDirty(){
    const forms = mediator.getForms();
    let check = {
        dirty:false
    };

    if (forms && typeof forms == "object"){
        forms.forEach(function(form){

            if (form && form.isDirty()){

                form.clear();

                settingsForm (form);

                form.setDirty(false);
            }
        });
    } else {
        errors_setFunctionError(
            `type of content is not a array: ${forms} or array does not exists`, 
            "commonFunctions", 
            "createComboValues"
        ); 
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


function globalModalBox_hasDirtyForms(){
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
    const dirtyInfo = globalModalBox_hasDirtyForms();
    const isDirty   = dirtyInfo.dirty;
 
    if (isDirty){
        const idForm = dirtyInfo.id;
        return globalModalBox (idForm);
    } else {
        return true;
    }
  
}


;// CONCATENATED MODULE: ./src/js/blocks/setParamToLink.js
///////////////////////////////
//
// Действия с параметрами в ссылке  
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////

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
///////////////////////////////
//
// Создание query  
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////

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
///////////////////////////////
//
// Медиатор
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////


















        
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

const _mediator_forms    = []; // формы


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
    },

    hideAllContent (show = true){
        const visiualElements = this.getViews();
    
        if (visiualElements){
            visiualElements.forEach(function(elem){
                Action.hideItem($$(elem));
            });
        }
    
        if (show){
            Action.hideItem ($$("webix__null-content"));
            Action.showItem ($$("webix__none-content"));
        }
       
    }
    



};



;// CONCATENATED MODULE: ./src/js/blocks/storageSetting.js
///////////////////////////////
//
// Загрузка в Local Storage и применение настроек  
//
// Copyright (c) 2022 CA Expert
//
/////////////////////////////// 






const storageSetting_logNameFile = "storageSettings";
function setStorageData (name, value){
    if (typeof(Storage) !== 'undefined') {
        localStorage.setItem(name, value);
    } 
}


function setLogState(value){
    const logLayout          = $$("logLayout");
    const logBtn             = $$("webix_log-btn");
    
    let height;
    let icon;

    const minWidth = 5;
    const maxWidth = 90;

    if (value == 1){
        height = minWidth;
        icon = "icon-eye";
    } else {
        height = maxWidth;
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

function deletePrefs(id, obj){
    if (id){

        new ServerData({
            id : `userprefs/${id}`
        }).del(obj);
    }
}

function setSettingsToStorage(el){
  
    const prefs  = JSON.parse(el.prefs);
    const names  = Object.keys(prefs);
    const values = Object.values(prefs);
    names.forEach(function(name, i){
        setStorageData (name, JSON.stringify(values[i]));
    });
 
 
}

function storageSetting_setDataToStorage(data, user){
    
 
    if (isArray(data, storageSetting_logNameFile, "setDataToStorage")){
        data.forEach(function(el){
            const owner = el.owner;
            const name  = el.name;

            const isFavPref = name.includes("fav-link_");

            if (owner == user.id && !isFavPref){
                 

                if (name == "/settings"){
                    setSettingsToStorage(el);
                } else {
                    if (name !== "userRestoreData"){
                        setStorageData (el.name, el.prefs);
                    } 
    
                    if (name == "tabbar" || name == "userRestoreData" 
                        || name == "tabsHistory"){
                        deletePrefs(el.id, el);
                    }
                }
              
            }

        });
    } 
}

function setTabHistory(){
    const data = webix.storage.local.get("tabsHistory"); 
  
    if (data){
        const history = data.history;
        
        if (isArray(data, storageSetting_logNameFile, "setDataToStorage")){
            history.forEach(function(el){
        
                mediator.tabs.addTabHistory(el);
            });

            webix.storage.local.remove("tabsHistory");
        }
        
    }
}


async function storageSetting_setUserPrefs (userData){
  
    const user = await returnOwner();
 
    const path = "/init/default/api/userprefs/";
    const userprefsData = webix.ajax(path);
  
    userprefsData.then( function (data) {
 
        data = data.json();

        if (data && data.content){
     
            const content = data.content;
            storageSetting_setDataToStorage(content, user);
            setLogPref      ();
            setTabHistory   ();
      
            $$("globalTabbar").callEvent("setStorageData", [ '1' ]);
        }

        
    });

    userprefsData.fail(function(err){
        console.log(err);
        console.log(
            storageSetting_logNameFile + " function setUserPrefs"
        );
    });

}



;// CONCATENATED MODULE: ./src/js/components/logBlock.js
  
///////////////////////////////
//
// Компонент с выводом ошибок 
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////






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
        const layout    =  $$("logLayout");
        const btn       = $$("webix_log-btn");
        const maxHeight = 90;

        if (btn.config.icon == eyeIcon){
            layout.config.height = maxHeight;
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

        if (names && names.length){
            names.forEach(function(el){
                if (el.id == srcTable){
                    name = el.name;
                }
            });
        }
        

    } catch (err){
        errors_setFunctionError(
            err, 
            "logBlock",
            "findTableName"
        );
    }

    return name;
}

async function createLogMessage(srcTable) {
    let name;

    if (srcTable == "version"){
        name = 'Expa v1.0.85';

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

const logBlock_headline = {   
    template:
    "<div class='webix_log-headline'>Системные сообщения</div>", 
    height:30
};


const logLayout = {
    id:"logLayout",
    height:80,
    rows:[
        logBlock_headline,
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
///////////////////////////////
//
// Обработка ошибок в обычных функциях и при ajax запросах 
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////


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

   
    if (error){
        console.log(error);
    } else {
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
///////////////////////////////
//
// Общеиспользуемые функции (Получить id, действия 
// над элементами (показать, включить и тд))
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////





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
  
        } else if (dashboard && dashboard.isVisible()){
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

    return new webix.DataCollection({url:{
        $proxy:true,
        load: function(){
            return ( 

                new ServerData({
    
                    id           : refTable
                   
                }).get().then(function(data){
            
                    const dataArray = [];
                    let keyArray;
            
                    function stringOption(l, el){
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
                    function createComboValues(content){
                       
                        
                        if (typeof content == "object"){
                            content.forEach((el) =>{
                                let l = 0;
                                stringOption (l, el);
                                numOption    (l, el);
                            
                            });
                        } else {
                            errors_setFunctionError(
                                `type of content is not a array: ${content}`, 
                                "commonFunctions", 
                                "createComboValues"
                            );
                        }
                            
                     
                    }
                 
            
                
                    if (data){
                
                        const content = data.content;
                        
                
                        if (content){
             
                            createComboValues(content);
                            return dataArray;
                
                        }
                    }
                     
                })
            );
            
        }
    }});
}

function getUserDataStorage(){
    return  webix.storage.local.get("user");
}

async function pushUserDataStorage(){
 
    return await new ServerData({
        id : "whoami"
       
    }).get().then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (content){

                const userData = {};
    
                userData.id       = content.id;
                userData.name     = content.first_name;
                userData.username = content.username;
                
                setStorageData("user", JSON.stringify(userData));
            }
        }
         
    });

}

async function returnOwner(){
    let ownerId = await getUserDataStorage();

    if (!ownerId){
        await pushUserDataStorage();
        ownerId = await getUserDataStorage();
    } 

    return ownerId;
}

function isArray(arr, logNameFile, func){
 
    if (arr && typeof arr == "object"){
        return true;
    } else {
        errors_setFunctionError(
            `type of content is not a array 
            or array does not exists : ${arr}`, 
            logNameFile, 
            func
        ); 
    }
}



;// CONCATENATED MODULE: ./src/js/expalib.js
  
///////////////////////////////

// Библиотека

// Copyright (c) 2022 CA Expert

///////////////////////////////

function expalib_lib (){
  
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


;// CONCATENATED MODULE: ./src/js/components/router.js
///////////////////////////////

// Начальные настройки роутера                      (create router settings)
//
// Навигация по сайдбару                            (create tree navigate)
//
// Пользовательские настройки                       (create settings)
//
// Выход из системы                                 (create logout)
//
// Проверка авторизации и перенаправление           (create index)
//
// Редактор дерева                                  (create edit tree)
//
// Смена пароля                                     (create cp)
//
// Роуты                                            (create routes)
//
// Сокрытие всех элементов                          (create visible state)
//
// Создание компонентов                             (create components)
//
// Отрисовка главного layout и сокрытие авторизации (create content)
//
// Медиатор                                         (create mediator)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////


expalib_lib ();










const router_logNameFile = "router";




async function getOwner(){
    const owner = await returnOwner();

    return owner;
}



//create router settings
function router_navigate(path){
    Backbone.history.start({pushState: true, root: path});
}

function setRouterStart(){
    if (window.location.host.includes("localhost:3000")){
        router_navigate('/index.html/');
    } else {
        router_navigate('/init/default/spaw/');
    }
}




//create tree navigate

let router_id;
let emptyTab = false;



async function router_getTableData (){

    await LoadServerData.content("fields");
    const keys = GetFields.keys;
 
    if (keys){
        mediator.sidebar.selectItem(router_id);
    }
}


async function createTableSpace (){
    RouterActions.createContentSpace();
   
    const isFieldsExists = GetFields.keys;
    try{   
        const tree = $$("tree");
        tree.attachEvent("onAfterLoad", 
        webix.once(function (){
            if (!isFieldsExists && !emptyTab) {
                router_getTableData ();
            } 
        }));         
       
    } catch (err){
        errors_setFunctionError(
            err, 
            router_logNameFile, 
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
            router_logNameFile, 
            "checkTable"
        );

    }    
  
}

async function treeRouter(selectId){

    const search = window.location.search;
    const params    = new URLSearchParams(search);
    const param = params.get("new"); 

    if (param){
        emptyTab = true;
    }

    router_id = selectId;
    checkTable();
  
}



//create settings

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
            router_logNameFile,
            "setUserprefsNameValue"
        );
    }

}



function setTemplateValue(data){
 
    if (isArray(data, router_logNameFile, "setTemplateValue")){
 
        const prefs = JSON.parse(data.prefs);

        if (prefs){
  
            const names  = Object.keys(prefs);
            const values = Object.values(prefs);
            
            if (names.length){
                names.forEach(function(name, i){
                    const form = $$(name);
                    if (form){
                        form.setValues(values[i]);
                        form.config.storagePrefs = values[i];
                    }
                   
                });
            }
        }
    } 

}

async function getDataUserprefs(){
    const owner   = await getOwner();
    const name    = `userprefs.name='/settings'`;
    const ownerId = `userprefs.owner=${owner.id}`;

    new ServerData({  
        id : `smarts?query=${name}+and+${ownerId}&limit=80&offset=0`
    }).get().then(function(data){
        if (data){
          
            if (data.content.length){
                setTemplateValue(data.content[0]);
            }
      
        } else {
            errors_setFunctionError(
                `data is ${data}` , 
                router_logNameFile, 
                "getDataUserprefs"
            ); 
        }
    });

}

function setTabData(id){
    $$("globalTabbar").addOption({
        id    : id, 
        value : "Настройки", 
        isOtherView : true,
        info  : {
            tree:{
                view : "settings"
            }
        },
        close : true, 
    }, true);
}

function settingsRouter(){

    const id   = "settings";
    const elem = $$(id);
    
    RouterActions.hideContent();

    if (mediator.sidebar.dataLength() == 0){
        RouterActions.createContentSpace();
    }

    setTabData(id);


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



//create logout

function clearStorage(){
    try{
    
        webix.storage.local.clear();
    } catch (err){
        errors_setFunctionError(
            err, 
            router_logNameFile, 
            "clearStorage"
        );
    }
}

function router_putPrefs(id, sentObj){

    new ServerData({  
        id : `userprefs/${id}`
    }).put(sentObj);
  
}

function isPrefExists(data, name){
    const result = {
        exists : false
    };
 
    if (isArray(data, router_logNameFile, "isPrefExists")){
        data.forEach(function(el){
            if (el.name == name){
                result.exists = true;
                result.id     = el.id;
            } 
        }); 
    }
        
  
    
    return result;
}

function postUserPrefs(sentObj){

    new ServerData({  
        id : "userprefs"
    }).post(sentObj);

}


function returnSentTemplate(name, data){
    return {
        name  : name,
        prefs : data
    };
}



async function saveCurrData(servData, name, prefs, owner){

    const pref = returnSentTemplate(name, prefs);

    const result   = isPrefExists(servData, name);
    const isExists = result.exists;
    
    if (isExists){
        const id = result.id;
        router_putPrefs(id, pref);
    } else {
        pref.owner = owner.id;
        postUserPrefs(pref);
    }

 

}


function saveHistoryTrue(){
    const tabbarData  = webix.storage.local.get("userprefsOtherForm");

    if (tabbarData && tabbarData.saveHistoryOpt == "1"){
        return true;
    }
}

function getLocalData(name){
    return webix.storage.local.get(name);
}

function createRestoreData(){
    const restore = {
        editProp :  getLocalData("editFormTempData"),
        filter   :  getLocalData("currFilterState")
    };

    return restore;
}

async function saveLocalStorage() {

    const owner  = await getOwner();
    
    new ServerData({  
        id           : "userprefs"
    }).get().then(function(data){

        if (data && data.content){

        const content = data.content;

        const tabbarData  = getLocalData("tabbar");
        saveCurrData(content, "tabbar" , tabbarData , owner);

 
        if (saveHistoryTrue()){
            const tabsHistory = getLocalData("tabsHistory");
            saveCurrData(content, "tabsHistory", tabsHistory, owner);
        }
        
  
        if (window.location.pathname !== "/index.html/content"){

            const restore = createRestoreData();

            saveCurrData(content, "userRestoreData" , restore , owner);
        }
        }
         
    });

  
}




function backPage(){
    try{
        const search = window.location.search;
        Backbone.history.navigate("/content" + search, { trigger:true});
        window.location.reload();
    } catch (err){
        errors_setFunctionError(
            err, 
            router_logNameFile, 
            "backPage"
        );
    }
}



async function logoutRouter(){

    await saveLocalStorage();

    new ServerData({  
        id           : "/init/default/logout/",
        isFullPath   : true
    }).post().then(function(data){

        if (data){
            backPage        ();
            mediator.sidebar.clear();
            clearStorage    ();
        } else {
            errors_setFunctionError(
                "data is " + data, 
                router_logNameFile, 
                "logoutRouter"
            );  
        }
         
    }); 
}



//create index

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
            router_logNameFile + 
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




//create edit tree

function loadTreeSpace(){
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

    loadTreeSpace ();
    
    createTreeTemplate ();
    
    mediator.sidebar.close();
}


//create cp
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
            router_logNameFile,
            "setUserValues"
        );
    }
}

 
function setTab(id){
    $$("globalTabbar").addOption({
        id    : id, 
        value : "Смена пароля", 
        isOtherView : true,
        info  : {
            tree:{
                view : "cp"
            }
        },
        close : true, 
    }, true);
}

function createCpComponent(){
    const auth = $$("user_auth");
    
    setTab("cp");

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
    createCpComponent        ();
 
    mediator.sidebar.close();

    setUserValues     ();
    RouterActions.hideEmptyTemplates();
}




//create routes
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

//create visible state

function hideAllElements (){

  
    const container = $$("container");
    const childs    = container.getChildViews();
    
    if (childs.length){
        childs.forEach(function(el){
            const view = el.config.view;
            if(view == "scrollview" || view == "layout"){
                Action.hideItem($$(el.config.id));
            }
        });
    } else {
        errors_setFunctionError(
            "array length is null",
            "routerConfig/hideAllElements",
            "hideAllElements"
        ); 
    }

  
     
}



//create components

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


//create content

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

//create mediator
class RouterActions {
    static hideEmptyTemplates(){
        Action.removeItem($$("webix__null-content"));
        Action.hideItem  ($$("webix__none-content"));     
    }

    static hideContent   (){
        hideAllElements();
    }

    static async createContentSpace (){
        await createContent  ();
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


;// CONCATENATED MODULE: ./src/js/components/login.js
  
///////////////////////////////
//
// Компонент авторизации 
//
// Copyright (c) 2022 CA Expert

///////////////////////////////






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


function login_errorActions (){
    const form      = $$("formAuth");

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

function postLoginData(){
    const loginData = login_createSentObj();
    const form      = $$("formAuth");

    new ServerData({
    
        id           : "/init/default/login",
        isFullPath   : true,
        errorActions : login_errorActions
       
    }).post(loginData).then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (content){
    
                if (form){
                    form.clear();
                }
                
                Backbone.history.navigate("content", { trigger:true});
                window.location.reload();
            }
        } else {
            login_errorActions (); 
        }
         
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
        keyPressTimeout :  120000,  // 120000  = 2 min
        on              : {
            onItemClick:function(id, event){
                clickPass(event, this);
     
            },
            onTimedKeyPress:function(){
                this.setValue(""); // auto clear
            }
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


;// CONCATENATED MODULE: ./src/js/blocks/adaptive.js
///////////////////////////////
//
// Адаптив для сайдбара, таблиц, дашбордов, форм
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////




const adaptive_minWidth = 850;

function resizeSidebar(){
    const tree          = $$("tree");
    const resizer       = $$("sideMenuResizer");
    const treeContainer = $$("sidebarContainer");
    const treeWidth     = 250;

    function resizeTree(){
        try{
            if (tree){
                tree.config.width = treeWidth;
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


    
    if (window.innerWidth < adaptive_minWidth){
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

    if (window.innerWidth > adaptive_minWidth && $$("tree")){
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

    if (window.innerWidth < adaptive_minWidth){
        setMinView(tools,сontainer, backBtn);
        Action.hideItem(formResizer);
    }


    if (window.innerWidth > adaptive_minWidth){
        setMaxWidth(tools, сontainer, backBtn);
        Action.showItem(formResizer);
    }

  
}


function resizeContext(){
    const dashContainer = $$("dashboardInfoContainer");
    const contextWindow = $$("dashboardContext");
    
    if (window.innerWidth < adaptive_minWidth){
        setMinView(contextWindow, dashContainer);
    }


    if (window.innerWidth > adaptive_minWidth){
        setMaxWidth(contextWindow, dashContainer);
    }
}

function resizeTools(){
    const dashTool      = $$("dashboardTool");
    const dashContainer = $$("dashboardInfoContainer");
    const backBtn       = $$("dash-backDashBtn");

    
    if (window.innerWidth < adaptive_minWidth){
        setMinView(dashTool, dashContainer, backBtn);
    }


    if (window.innerWidth > adaptive_minWidth){
        setMaxWidth(dashTool, dashContainer, backBtn);
    }
            
}



function resizeTableEditForm(){
    const container = $$("tableContainer");
    const editForm  = $$("table-editForm");
    const backBtn   = $$("table-backTableBtn");
    const tree      = $$("tree");

    
    if ($$("container").$width < adaptive_minWidth && editForm.isVisible()){
        Action.hideItem(tree);
    }


    if (window.innerWidth < adaptive_minWidth){
        setMinView(editForm, container, backBtn);
    }

    if (window.innerWidth > adaptive_minWidth){
        setMaxWidth(editForm, container, backBtn);
    }

}

function resizeTableFilterForm (){

    const filterForm = $$("filterTableBarContainer");
    
    const container  = $$("tableContainer");
    const backBtn    = $$("table-backTableBtnFilter");
    const tree       = $$("tree");
 
    if (window.innerWidth < adaptive_minWidth){
        setMinView(filterForm, container, backBtn);
    }

    if ($$("container").$width < adaptive_minWidth && filterForm.isVisible()){
        Action.hideItem(tree);
    }


    if (window.innerWidth > adaptive_minWidth){
        setMaxWidth(filterForm, container, backBtn);
    }

}

function adaptive_setSearchInputState(){
    const headerChilds = $$("header").getChildViews();

    
    headerChilds.forEach(function(el){
        el.show();
  
    });


   
}

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
function resizeAdaptive (){

    window.addEventListener('resize', function() {
  
        async function getActiveView (){  
            initLogic();
        }
    
        getActiveView ();
        resizeSidebar();
       

        if(window.innerWidth > adaptive_minWidth){
            adaptive_setSearchInputState();
        }

    }, true);
}



function adaptivePoints (){

    const tree = $$("tree");

    function hideTree(){
        if (window.innerWidth < adaptive_minWidth && tree){
          //  tree.hide();
        }
    }

    function addTreeEvent(){
        const minWidthEditProp = 1200;
        if (window.innerWidth < minWidthEditProp ){
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
///////////////////////////////
//
// Глобальные настройки для webix 
//
// Copyright (c) 2022 CA Expert
//
/////////////////////////////// 


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



;// CONCATENATED MODULE: ./src/js/app.js
  
///////////////////////////////
//
// Пустой компонент (create empty)
//
// Приложение
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////

console.log("expa 1.0.85"); 






 








         






//create empty
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
                                css   : "tabbar_globalCells",
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
     
       
      
    
        storageSetting_setUserPrefs            ();
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