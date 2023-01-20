 
///////////////////////////////

// Кнопка сохранить в библиотеку шаблон

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { setLogValue }                           from '../../../logBlock.js';

import { setFunctionError }                      from "../../../../blocks/errors.js";
import { modalBox }                              from "../../../../blocks/notifications.js";
import { ServerData }                            from "../../../../blocks/getServerData.js";
import { getItemId, returnOwner, isArray }       from "../../../../blocks/commonFunctions.js";

import { Button }                                from "../../../../viewTemplates/buttons.js";
import { Filter }                                from "../actions/_FilterActions.js";

const logNameFile   = "tableFilter => buttons => libSaveBtn";

let nameTemplate;
 
let sentObj;
let currName;


async function isTemplateExists(owner){
    let exists = {
        check : false
    };

    await new ServerData({
        id : `smarts?query=userprefs.name+=+%27${currName}%27+and+userprefs.owner+=+${owner}`
       
    }).get().then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (isArray(content, logNameFile, "isTemplateExists")){
    
                content.forEach(function(el){
   
                    if (el.name == currName){
                      
                        exists = {
                            check : true,
                            id    : el.id
                        };
                    } 
                });
            }
        }
         
    });


    return exists;
}


function putUserprefsTemplate(id){

    
    new ServerData({
        id : `userprefs/${id}`
    
    }).put(sentObj).then(function(data){

        if (data){

            setLogValue(
                "success",
                "Шаблон" +
                " «" +
                nameTemplate +
                "» " +
                " обновлён"
            );
        }
        
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

     
    new ServerData({
        id : "userprefs"
    
    }).post(sentObj).then(function(data){

        if (data){

            setLogValue(
                "success",
                "Шаблон" +
                " «" +
                nameTemplate +
                "» " +
                " сохранён в библиотеку"
            );
        }
        
    });


}


async function saveTemplate (result){ 

    const user = await returnOwner();

   
    const currId = getItemId();
    const values = Filter.getFilter().values;


    nameTemplate = result;
    currName     = currId + "_filter-template_" + nameTemplate;

    
    const template = {
        name   : nameTemplate,
        table  : currId,
        values : values
    };

    sentObj = {
        name    : currName,
        prefs   : template,
        owner   : user.id
    };
  

    const existsInfo = await isTemplateExists(user.id);
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
    titleAttribute : 
    "Сохранить шаблон с полями в библиотеку"

   
}).minView();


export {
    librarySaveBtn
};