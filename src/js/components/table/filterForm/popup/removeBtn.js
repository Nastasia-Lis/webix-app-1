
import { setLogValue }       from '../../../logBlock.js';

import { setFunctionError, 
        setAjaxError }       from "../../../../blocks/errors.js";

import { modalBox }          from "../../../../blocks/notifications.js";

import { Action }            from "../../../../blocks/commonFunctions.js";

import { Button }            from "../../../../viewTemplates/buttons.js";

import { Filter }            from "../actions/_FilterActions.js";


const logNameFile = "filterTable => popup => removeBtn";

let lib;
let radioValue;

function removeOptionState (){
    const id      = radioValue.id;
    const options = lib.config.options;
    try{
        options.forEach(function(el){
            if (el.id == id){
                el.value = el.value + " (шаблон удалён)";
                lib.refresh();
                lib.disableOption(lib.getValue());
                lib.setValue("");
            }
        });
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "removeOptionState"
        );
    }
}

function deleteElement(){
    const prefs   = radioValue.prefs;
    const idPrefs = prefs.id;

    const path = "/init/default/api/userprefs/" + idPrefs;
    const deleteTemplate = webix.ajax().del(path, prefs);

    deleteTemplate.then(function(data){
        data = data.json();

        const value = radioValue.value;

        if (data.err_type == "i"){
            setLogValue(
                "success",
                "Шаблон « " + value + " » удален"
            );
            removeOptionState ();
            Filter.clearFilter();
            Filter.setStateToStorage();
            Action.showItem($$("filterEmptyTempalte"));
            
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


function resetLibSelectOption(){
    Filter.setActiveTemplate(null);
}


async function userprefsData (){ 

    lib = $$("filterEditLib");
    const libValue = lib.getValue();
    radioValue = lib.getOption(libValue);

    const idPrefs = radioValue.prefs.id;

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

export {
    removeBtn
};