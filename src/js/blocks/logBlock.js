import {setStorageData} from "./storageSetting.js";
import  {STORAGE,getData} from "./globalStorage.js";

import {setFunctionError} from "./errors.js";


function setLogValue (typeNotify,notifyText,specificSrc) {
    const date = new Date();
    let day = date.getDate();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes =String( date.getMinutes()).padStart(2, '0');
    let seconds =String( date.getSeconds()).padStart(2, '0');
    let currentDate = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;

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
    async function createLogMessage(srcTable,itemTreeId) {
        let name;

        function findTableName(){
            try{
                STORAGE.tableNames.forEach(function(el,i){
                    if (srcTable == "version"){
                        name = 'Expa v1.0.35';
                    } else if (el.id == srcTable){
                        name = el.name;
                    }
                });
            } catch (err){
                setFunctionError(err,"logBlock","findTableName");
            }
        }

        if (!STORAGE.tableNames){
            await getData("fields"); 
        }

        if (STORAGE.tableNames){
            findTableName();
        }

        addLogMsg (name);
    }
       
    function initLogMsg(){
        try{
            let itemTreeId=null;

            if ($$("tree").getSelectedItem()){
                itemTreeId = $$("tree").getSelectedItem().id;
            } else {
                let href = window.location.pathname;
                let index = href.lastIndexOf("/");
                itemTreeId = href.slice(index+1);
            }
        
            if (specificSrc){
                createLogMessage(specificSrc);
            } else if (itemTreeId){
                createLogMessage(itemTreeId);
            } 
        } catch (err){
            setFunctionError(err,"logBlock","initLogMsg");
        }
    }

    function getItemIndex(){
        let blockContainer = document.querySelector(".webix_log-block");
        let index;
        try{
            if (blockContainer){
                blockContainer.querySelectorAll(".webix_list_item").forEach(function(el,i){
                    index = i;
                });
            }
        } catch (err){
            setFunctionError(err,"logBlock","getItemIndex");
        }
        return index;
    }

    function setErrTypeMsg(){
        let itemListIndex = getItemIndex();

        let item = document.querySelectorAll(".webix_list_item")[itemListIndex];

        function setStyle(){
            try{
                if (item!==undefined){
                    item.style.setProperty('color', 'red', 'important');
                }
            } catch (err){
                setFunctionError(err,"logBlock","setStyle");
            }
        }
        function openLog(){
            try{
                if ($$("webix_log-btn").config.icon =="wxi-eye"){
                    $$("logLayout").config.height = 90;
                    $$("logLayout").resize();
                    $$("webix_log-btn").setValue(2);

                    $$("webix_log-btn").config.icon ="wxi-eye-slash";
                    $$("webix_log-btn").refresh();

                    setStorageData("LogVisible", JSON.stringify("show"));
                }
            } catch (err){
                setFunctionError(err,"logBlock","openLog");
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
                setFunctionError(err,"logBlock","logBlock onAfterLoad");
            }
            
        },
        onAfterAdd:function(id, index){
            function addNotify(){
                try{
                    if ($$("webix_log-btn").config.badge==""){
                        notifyCounter=0;
                    }
                    notifyCounter++;
                    $$("webix_log-btn").config.badge = notifyCounter;
                    $$("webix_log-btn").setValue(1);
                    $$("webix_log-btn").refresh();
                } catch (err){
                    setFunctionError(err,"logBlock","logBlock onAfterAdd function addNotify");
                }
            }

            function clearNotify(){
                try{
                    notifyCounter = 0;
                    $$("webix_log-btn").config.badge = "";
                    $$("webix_log-btn").setValue(2);
                    $$("webix_log-btn").refresh();
                } catch (err){
                    setFunctionError(err,"logBlock","logBlock onAfterAdd function clearNotify");
                }
            }
    
            if ($$("webix_log-btn").config.icon =="wxi-eye"){
                addNotify();
            } else if ($$("webix_log-btn").config.icon =="wxi-eye-slash"){
                clearNotify();
            }
            
          
        }
    }
};

const logLayout = {
    id:"logLayout",
    height:80,
    rows:[
        {   template:"<div class='webix_log-headline'>Системные сообщения</div>", 
            height:30
        },
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