  
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
import { setFunctionError }         from "../blocks/errors.js";
import { Button }                   from "../viewTemplates/buttons.js";
import { mediator }                 from "../blocks/_mediator.js";
import { LoadServerData, 
        GetFields }                 from "../blocks/globalStorage.js";
import { setLogValue }              from "./logBlock.js";
import { ServerData }               from "../blocks/getServerData.js";
import { getItemId, 
        returnOwner, Action}        from "../blocks/commonFunctions.js";
import { Popup }                    from "../viewTemplates/popup.js";


const logNameFile = "viewHeadline";



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
        setFunctionError(
            err, 
            logNameFile, 
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
        setFunctionError(
            err, 
            logNameFile, 
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
                setFunctionError(
                    "Не удалось сохранить ссылку",
                    logNameFile,
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
            setFunctionError(
                "owner does not exists",
                logNameFile,
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
        setFunctionError(err, logNameFile, "setHeadlineBlock");
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


export {
    createHeadline
};
