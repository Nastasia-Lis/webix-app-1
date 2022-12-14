
import { popupExec }                     from "../../blocks/notifications.js";
import { setLogValue }                   from '../logBlock.js';
import { setAjaxError,setFunctionError } from "../../blocks/errors.js";
import { Action, getItemId }             from "../../blocks/commonFunctions.js";

const logNameFile = "table => btnsIntable";

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
                    setFunctionError(
                        err,
                        logNameFile,
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
                logNameFile,
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
        setFunctionError(err, logNameFile, "createUrl");
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
        setFunctionError(
            err, 
            logNameFile, 
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
        setFunctionError(
            err,
            logNameFile,
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
            setFunctionError(
                "Данные отсутствуют", 
                logNameFile, 
                "getProp"
            );
        }
       

    });

    getData.fail(function(err){
        setAjaxError(
            err, 
            logNameFile,
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

export {
    trashBtn,
    showPropBtn
};