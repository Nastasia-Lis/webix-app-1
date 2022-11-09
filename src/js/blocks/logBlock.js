import {setStorageData}     from "./storageSetting.js";
import {STORAGE,getData}    from "./globalStorage.js";

import {setFunctionError}   from "./errors.js";


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
                setFunctionError(err,"logBlock","findTableName");
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
            setFunctionError(err,"logBlock","initLogMsg");
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
            setFunctionError(err,"logBlock","getItemIndex");
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
                setFunctionError(err,"logBlock","setStyle");
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
                    setFunctionError(err,"logBlock","logBlock onAfterAdd function addNotify");
                }
            }

            function clearNotify(){
                try{
                    notifyCounter = 0;
                    btn.config.badge = "";
                    btn.setValue(2);
                    btn.refresh();
                } catch (err){
                    setFunctionError(err,"logBlock","logBlock onAfterAdd function clearNotify");
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



export {
    logBlock,
    logLayout,
    setLogValue,
    catchErrorTemplate,
    ajaxErrorTemplate
};