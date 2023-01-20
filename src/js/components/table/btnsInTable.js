 
///////////////////////////////

// Динамические кнопки в таблице

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { popupExec }            from "../../blocks/notifications.js";
import { setLogValue }          from '../logBlock.js';
import { setFunctionError }     from "../../blocks/errors.js";
import { ServerData }           from "../../blocks/getServerData.js";
import { Action, getItemId }    from "../../blocks/commonFunctions.js";

const logNameFile = "table => btnsIntable";

function trashBtn(config,idTable){
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
        setFunctionError(err, logNameFile, "createUrl");
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
        setFunctionError(
            err,
            logNameFile,
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

export {
    trashBtn,
    showPropBtn
};