
import { setLogValue }       from '../../../logBlock.js';

import { setFunctionError}   from "../../../../blocks/errors.js";

import { ServerData }        from "../../../../blocks/getServerData.js";

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

        
    new ServerData({
        id : `userprefs/${idPrefs}`
    
    }).del(prefs).then(function(data){

        if (data){

            const value = radioValue.value;

            setLogValue(
                "success",
                "Шаблон « " + value + " » удален"
            );
            removeOptionState ();
            Filter.clearFilter();
            Filter.setStateToStorage();
            Action.showItem($$("filterEmptyTempalte"));
        }
        
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