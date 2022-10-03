

import {setStorageData} from "./storageSetting.js";
import  {STORAGE,getData} from "./globalStorage.js";
function setLogValue (typeNotify,notifyText) {
    const date = new Date();
    let day = date.getDate();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes =String( date.getMinutes()).padStart(2, '0');
    let seconds =String( date.getSeconds()).padStart(2, '0');
    let currentDate = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;

        function addLogMsg (src){
            $$("logBlock-list").add({
                date:currentDate,
                value:notifyText,
                src:src
            });
        }
        async function createLogMessage(srcTable,itemTreeId) {

            if (!STORAGE.tableNames){
                await getData("fields"); 
            }

            if (STORAGE.tableNames){
                STORAGE.tableNames.forEach(function(el,i){
                    if (el.id == itemTreeId){
                        srcTable= el.name;
                    }
                });
            }

            addLogMsg (srcTable);
        }
        
            
    try {
        let itemTreeId=null;

        if ($$("tree").getSelectedItem() !== undefined){
            itemTreeId = $$("tree").getSelectedItem().id;
            if (itemTreeId.includes("single")){
                let singleSearch = itemTreeId.search("-single");
                itemTreeId = itemTreeId.slice(0,singleSearch); 
            }
        }

        if (itemTreeId){
        
            let srcTable;

            createLogMessage(srcTable,itemTreeId);

        } else {
            $$("logBlock-list").add({
                date:currentDate,
                value:notifyText,
                src:"Expa v1.0.31"
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

            if (item!==undefined){
                item.style.setProperty('color', 'red', 'important');
            }
            
            if ($$("webix_log-btn").config.icon =="wxi-eye"){
                $$("logLayout").config.height = 90;
                $$("logLayout").resize();
                $$("webix_log-btn").setValue(2);
                $$("webix_log-btn").config.icon ="wxi-eye-slash";
                $$("webix_log-btn").refresh();
                setStorageData("LogVisible", JSON.stringify("show"));
            }
        }
    } catch (error){
        console.log(error);
        catchErrorTemplate("006-000", error);
    }
    
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
                setLogValue ("success","Интерфейс загружен");
            } catch (error){
                console.log(error);
                catchErrorTemplate("006-000", error);
            }
            
        },
        onAfterAdd:function(id, index){
            try{
                if ($$("webix_log-btn").config.icon =="wxi-eye"){
                    if ($$("webix_log-btn").config.badge==""){
                        notifyCounter=0;
                    }
                    notifyCounter++;
                    $$("webix_log-btn").config.badge = notifyCounter;
                    $$("webix_log-btn").setValue(1);
                    $$("webix_log-btn").refresh();
                } else if ($$("webix_log-btn").config.icon =="wxi-eye-slash"){
                    notifyCounter = 0;
                    $$("webix_log-btn").config.badge = "";
                    $$("webix_log-btn").setValue(2);
                    $$("webix_log-btn").refresh();
                }
            } catch (error){
                console.log(error);
                catchErrorTemplate("006-000", error);
            }
          
        }
    }
};

const logLayout = {
    id:"logLayout",height:80,rows:[
        {template:"<div class='webix_log-headline'>Системные сообщения</div>", height:30},
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
    } catch (error){
        console.log(error);
        alert("Ошибка при выполнении"+" "+ error);
        window.stop();
    }
}

function ajaxErrorTemplate (code, status,statusText,responseURL){
    $$("webix_log-btn").setValue(2);
    
    notifyCounter = 0;
    let errorMsg = "СТАТУС: "+status+" "+statusText+"."+" ПОДРОБНОСТИ: "+responseURL;
    return setLogValue("error","ОШИБКА "+code+": "+errorMsg,);

}

export {
    logBlock,
    logLayout,
    setLogValue,
    catchErrorTemplate,
    ajaxErrorTemplate
};