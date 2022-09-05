
import {itemTreeId} from "./sidebar.js";
import {notify} from "./editTableForm.js";
import {tableNames} from "./login.js";
import {setStorageData,setUserLocation} from "./userSettings.js";

function setLogValue (typeNotify,notifyText) {
    const date = new Date();
    let day = date.getDate();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes =String( date.getMinutes()).padStart(2, '0');
    let seconds =String( date.getSeconds()).padStart(2, '0');
    let currentDate = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;

 
    if (itemTreeId){

        let srcTable;
        tableNames.forEach(function(el,i){
            if (el.id == itemTreeId){
               
                srcTable= el.name;
            }
        });

        $$("logBlock-list").add({
            date:currentDate,
            value:notifyText,
            src:srcTable
        });

    } else {
        $$("logBlock-list").add({
            date:currentDate,
            value:notifyText,
            src:"Expa v1.0.15"
        });
    }

    let itemListIndex;
    
    let blockContainer = document.querySelector(".webix_log-block");
    if (blockContainer){
        blockContainer.querySelectorAll(".webix_list_item").forEach(function(el,i){
            itemListIndex = i;
        });
    }
    
    let item = document.querySelectorAll(".webix_list_item")[itemListIndex];
    if (typeNotify == "error"){
        item.style.setProperty('color', 'red', 'important');
        
        if ($$("webix_log-btn").config.icon =="wxi-eye"){
            $$("logLayout").config.height = 90;
            $$("logLayout").resize();
            $$("webix_log-btn").config.icon ="wxi-eye-slash";
            $$("webix_log-btn").refresh();
            setStorageData("LogVisible", JSON.stringify("show"));
        }
    }
    
}

const logBlock = {
    id:"logBlock-list",
    css:"webix_log-block",
    view:"list",
    template:"#date# — #value#  (Источник: #src#)",
    data:[],
    on: {
        onAfterLoad:function(){
            setLogValue ("success","Интерфейс загружен")
        }
    }
};

const logLayout = {
    id:"logLayout",height:80,rows:[
        {template:"<div class='webix_log-headline'>Системные сообщения</div>", height:30},
        logBlock
    ]
};


function catchErrorTemplate (code,error) {
    return notify ("error","ОШИБКА "+code+": "+error.stack,true);
}

function ajaxErrorTemplate (code, status,statusText,responseURL){
  let errorMsg = "СТАТУС: "+status+" "+statusText+"."+" ПОДРОБНОСТИ: "+responseURL;
  return notify ("error","ОШИБКА "+code+": "+errorMsg,true);
}

export {
    logBlock,
    logLayout,
    setLogValue,
    catchErrorTemplate,
    ajaxErrorTemplate

};