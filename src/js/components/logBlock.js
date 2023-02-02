  
///////////////////////////////
//
// Компонент с выводом ошибок 
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////

import { setStorageData }               from "../blocks/storageSetting.js";
import { LoadServerData, GetFields }    from "../blocks/globalStorage.js";
import { setFunctionError }             from "../blocks/errors.js";


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
        setFunctionError(err, "logBlock", "openLog");
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
            setFunctionError(err, "logBlock" ,"addErrorStyle");
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
        setFunctionError(
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
        setFunctionError(err, "logBlock", "initLogMsg");
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
        setFunctionError(
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
        setFunctionError(
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

export {
    logBlock,
    logLayout,
    setLogValue,
};