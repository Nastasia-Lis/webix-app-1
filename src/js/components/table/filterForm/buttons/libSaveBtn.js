import { setLogValue }                           from '../../../logBlock.js';

import { setFunctionError,setAjaxError }         from "../../../../blocks/errors.js";
import { modalBox }                              from "../../../../blocks/notifications.js";

import { visibleInputs}                          from "./../common.js";

import { getItemId, pushUserDataStorage, 
         getUserDataStorage }                    from "../../../../blocks/commonFunctions.js";

import { Button }                                from "../../../../viewTemplates/buttons.js";

const logNameFile   = "tableFilter => buttons => libSaveBtn";

let nameTemplate;
let template;
let currId;
let sentObj;
let currName;

function pushValues(id, value, operation, logic, parent){

    template.values.push({
        id          : id, 
        value       : value,
        operation   : operation,
        logic       : logic,
        parent      : parent,
    });

}

function isParent(el){
    const parent = el.config.columnName + "_filter";
    const id     = el.config.id;
    let check    = null;

    if (parent !== id){
        check = el.config.columnName;
    } else {

    }

    return check;
}

function setOperation(arr){
    arr.forEach(function(el){
   
        try{
            const value      = $$( el ).getValue();

            const operation  = $$( el + "-btnFilterOperations" ).getValue();

            const segmentBtn = $$( el + "_segmentBtn" );
            let logic = null;
            if (segmentBtn.isVisible()){
                logic = segmentBtn.getValue();
            }

            const parent = isParent($$( el ));
    
            pushValues(el, value, operation, logic, parent);

        } catch(err){
            setFunctionError(
                err,
                logNameFile,
                "function setOperation"
            );
        }
    });
}

function createPrefsValue(){
    const keys             = Object.keys(visibleInputs);
    const keysLength       = keys.length;
   
    for (let i = 0; i < keysLength; i++) {   
        const key = keys[i];
        setOperation(visibleInputs[key]);
    }

}

function isTemplateExists(){
    let exists = {
        check : false
    };
    
    const path = "/init/default/api/userprefs/";
    const userprefsData = webix.ajax().get(path);

    return userprefsData.then(function(data){
        data = data.json().content;

        data.forEach(function(el){
       
            if (el.name == currName){
                exists = {
                    check : true,
                    id    : el.id
                };
            } 
        });

        return exists;
    
    }).fail(function(err){
        setAjaxError(
            err, 
            logNameFile,
            "isTemplateExists"
        );
        return exists;
    });

}


function putUserprefsTemplate(id){
    const path = "/init/default/api/userprefs/" + id;
    
    const putData = webix.ajax().put(path, sentObj);

    putData.then(function(data){
        data = data.json();
        if (data.err_type == "i"){
            setLogValue(
                "success",
                "Шаблон" +
                " «" +
                nameTemplate +
                "» " +
                " сохранён в библиотеку"
            );
        } else {
            setFunctionError(
                data.err,
                logNameFile,
                "saveExistsTemplate"
            );
        }
    });

    putData.fail(function(err){
        setAjaxError(
            err, 
            logNameFile,
            "putUserprefsData"
        );
    });
}

async function saveExistsTemplate(id){
    modalBox(   "Шаблон с таким именем существует", 
                "После сохранения предыдущие данные будут стёрты", 
                ["Отмена", "Сохранить изменения"]
                )
    .then(function(result){

        if (result == 1){
            putUserprefsTemplate(id);
        }
    });
 
}

 

function saveNewTemplate(){
  
    const path = "/init/default/api/userprefs/";

    const userprefsPost = webix.ajax().post(path, sentObj);
    
    userprefsPost.then(function(data){
        data = data.json();

        if (data.err_type == "i"){
            setLogValue(
                "success",
                "Шаблон" +
                " «" +
                nameTemplate +
                "» " +
                " сохранён в библиотеку"
            );
        } else {
            setFunctionError(
                data.err,
                logNameFile,
                "saveNewTemplate"
            );
        }
    });

    userprefsPost.fail(function(err){
        setAjaxError(
            err, 
            logNameFile,
            "saveTemplate => saveNewTemplate"
        );
    });

}


async function saveTemplate (result){ 

    let user = getUserDataStorage();
    
    if (!user){
        await pushUserDataStorage();
        user = getUserDataStorage();
    } 

    nameTemplate = result;
    currId             = getItemId();

    currName = currId + "_filter-template_" + nameTemplate;

    template           = {
        name   : nameTemplate,
        table  : currId,
        values : []
    };

    sentObj            = {
        name    : currId + "_filter-template_" + nameTemplate,
        prefs   : template,
        owner   : user.id
    };

  
    createPrefsValue();
    const existsInfo = await isTemplateExists();
    const isExists   = existsInfo.check;
    

    if (isExists){
        const id = existsInfo.id;
        saveExistsTemplate(id);  
    } else {
        saveNewTemplate();
    }

}


function libraryBtnClick () {
    try {
        webix.prompt({
            title       : "Название шаблона",
            ok          : "Сохранить",
            cancel      : "Отменить",
            css         : "webix_prompt-filter-lib",
            input       : {
                required    : true,
                placeholder : "Введите название шаблона...",
            },
            width       : 350,
        }).then(function(result){
            saveTemplate (result);

        });
    
    } catch(err) {
        setFunctionError(
            err,
            logNameFile,
            "filterSubmitBtn"
        );
    }
}

const librarySaveBtn = new Button({
    
    config   : {
        id       : "filterLibrarySaveBtn",
        hotkey   : "Shift+Esc",
        icon     : "icon-file",
        disabled : true, 
        click    : libraryBtnClick
    },
    titleAttribute : "Сохранить шаблон с полями в библиотеку"

   
}).minView();


export {
    librarySaveBtn
};