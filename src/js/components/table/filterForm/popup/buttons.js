
import { setLogValue }                       from '../../../logBlock.js';

import { setFunctionError, setAjaxError }    from "../../../../blocks/errors.js";
import { modalBox }                          from "../../../../blocks/notifications.js";



import { getUserprefsData, PREFS_STORAGE }   from "../common.js";
import { visibleField, visibleInputs }       from "../common.js";


import { getLibraryData }      from "../userTemplate.js";

import { getItemId, Action }   from "../../../../blocks/commonFunctions.js";

import { Button }              from "../../../../viewTemplates/buttons.js";

import { SELECT_TEMPLATE }     from "../userTemplate.js";

const logNameFile = "tableFilter => popup => buttons";


function createWorkspaceCheckbox (){
    const values       = $$("editFormPopup").getValues();
    const selectValues = [];

    function returnSegmentBtn(input){
        return $$( input + "_segmentBtn");
    }
 
    function visibleSegmentBtn(selectAll){

        const selectLength = selectValues.length;

        selectValues.forEach(function(value,i){
            const colId      = $$(value).config.columnName;

            const collection = visibleInputs[colId];
            const length     = collection.length;
            const lastIndex  = length - 1;

            const segmentBtn = returnSegmentBtn(collection[lastIndex]);

            if ( i === selectLength - 1){
              //  скрыть последний элемент
              Action.hideItem(segmentBtn);
  
        
            } else if ( i === selectLength - 2 || selectAll){
                Action.showItem(segmentBtn);
            }

       
        });
    }
    try{
        const keys    = Object.keys(values); 
        let selectAll = false;

        keys.forEach(function(el,i){

            if (values[el] && el !== "selectAll"){
                selectValues.push(el);
            } else if (el == "selectAll"){
                selectAll = true;
            }

            const columnName = $$(el).config.columnName;
            visibleField (values[el], columnName, el);
  
        });

        visibleSegmentBtn(selectAll);

    } catch(err){
        setFunctionError(
            err,
            logNameFile,
            "function createWorkspaceCheckbox"
        );
    }
}

function visibleCounter(){
    const elements      = $$("filterTableForm").elements;
    const values        = Object.values(elements);
    let visibleElements = 0;
    try{
        values.forEach(function(el,i){
            if ( !(el.config.hidden) ){
                visibleElements++;
            }
            
        });

    } catch(err){
        setFunctionError(
            err,
            logNameFile,
            "visibleCounter"
        );
    }

    return visibleElements;
}


function hideFilterPopup (){
    const popup = $$("popupFilterEdit");
    if (popup){
        popup.destructor();
    }
}

function resetLibSelectOption(){
    if (SELECT_TEMPLATE){
        delete SELECT_TEMPLATE.id;
        delete SELECT_TEMPLATE.value;
    }
}



function popupSubmitBtn (){

    function getCheckboxData(){
      
        Action.enableItem($$("filterLibrarySaveBtn"));
        createWorkspaceCheckbox ();

        const visibleElements = visibleCounter();

        if (!(visibleElements)){
            Action.showItem     ($$("filterEmptyTempalte" ));
            Action.disableItem  ($$("btnFilterSubmit"     ));
            Action.disableItem  ($$("filterLibrarySaveBtn"));
        } 

        hideFilterPopup     ();
        resetLibSelectOption();
        setLogValue(
            "success",
            "Рабочая область фильтра обновлена"
        );
    }

    try {                                             
        const tabbarValue = $$("filterPopupTabbar").getValue();

        if (tabbarValue == "editFormPopupLib" ){
            $$("resetFilterBtn").callEvent("resetFilter");
            getLibraryData();

        } else if (tabbarValue == "editFormScroll" ){
            getCheckboxData();
        }
    } catch (err) {
        setFunctionError( 
            err ,
            logNameFile, 
            "function popupSubmitBtn"
        );
        $$("popupFilterEdit").destructor();
    }

    function showEmptyTemplate(){
        const keys = Object.keys(visibleInputs).length;

        if ( !keys ){
            Action.showItem($$("filterEmptyTempalte"));
        }
    }
    showEmptyTemplate();

}

function deleteElement(el, id, value, lib){

    const url            = "/init/default/api/userprefs/" + el.id;
    const deleteTemplate = webix.ajax().del(url, el);

    deleteTemplate.then(function(data){
        data = data.json();
    
        function removeOptionState (){
            try{
                lib.config.options.forEach(function(el,i){
                    if (el.id == id){
                        el.value = value + " (шаблон удалён)";
                        lib.refresh();
                        lib.disableOption(lib.getValue());
                        lib.setValue("");
                    }
                });
            } catch (err){
                setFunctionError(
                    err, 
                    logNameFile, 
                    "function deleteElement => removeOptionState"
                );
            }
        }

        if (data.err_type !== "e"&& data.err_type !== "x"){
            setLogValue("success","Шаблон « " + value + " » удален");
            removeOptionState ();
        } else {
            setFunctionError(
                data.err, 
                logNameFile, 
                "userprefsData"
            );
        }

    });
    deleteTemplate.fail(function(err){
        setAjaxError(
            err, 
            logNameFile,
            "getLibraryData"
        );
    });
}

async function userprefsData (){ 
    const currId     = getItemId ();
    const lib        = $$("filterEditLib");
    const libValue   = lib.getValue();
    const radioValue = lib.getOption(libValue);

    if (!PREFS_STORAGE.userprefs){
        await getUserprefsData (); 
    }

    if (PREFS_STORAGE.userprefs){
        const data         = PREFS_STORAGE.userprefs.content;

        const id           = radioValue.id;
        const value        = radioValue.value;

        const templateName = currId + "_filter-template_" + value;

        data.forEach(function(el){
            if (el.name == templateName){
                deleteElement(el, id, value, lib);
                resetLibSelectOption();
                Action.disableItem($$("editFormPopupLibRemoveBtn"));
            }
        });


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


const submitBtn = new Button({
    
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


const btnLayout = {
    cols   : [
        submitBtn,
        {width : 5},
        removeBtn,
    ]
};

export {
    btnLayout
};