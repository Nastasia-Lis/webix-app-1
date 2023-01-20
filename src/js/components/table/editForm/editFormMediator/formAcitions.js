 
///////////////////////////////

// Посты и удаление в редакторе форм

// Copyright (c) 2022 CA Expert

///////////////////////////////


import { getItemId, isArray }       from "../../../../blocks/commonFunctions.js";
import { validateProfForm, 
        setLogError, uniqueData}    from "../validation.js";

import { setFunctionError }         from "../../../../blocks/errors.js";

import { setLogValue }              from "../../../logBlock.js";

import { popupExec }                from "../../../../blocks/notifications.js";
import { mediator }                 from "../../../../blocks/_mediator.js";
import { ServerData }               from "../../../../blocks/getServerData.js";

const logNameFile = "table => formActions";

function unsetDirtyProp(){
 
    $$("table-editForm").setDirty(false);
    mediator.tabs.setDirtyParam();
    mediator.tables.editForm.clearTempStorage();
}

function updateTable (itemData){
    try{
        const table = $$("table");
        const id    = itemData.id;
        table.updateItem(id, itemData);
        table.clearSelection();
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "updateTable"
        );
    }  
    
}



function dateFormatting(arr){
    const formattingArr = arr;
    if (isArray(formattingArr, logNameFile, "dateFormatting")){
        const vals          = Object.values(arr);
        const keys          = Object.keys(arr);
      
        if (keys.length){
            keys.forEach(function(el, i){
                const prop       = $$("editTableFormProperty");
                const item       = prop.getItem(el);
                const formatData = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
        
                if ( item.type == "customDate" ){
                    formattingArr[el] = formatData(vals[i]);
                }
            });
        } else {
            setFunctionError(
                "array length is null",
                logNameFile,
                "dateFormatting"
            );
        }
      
    }
  


    return formattingArr;
}

function formattingBoolVals(arr){
    const table = $$( "table" );
    const cols  = table.getColumns();
    if (isArray(cols, logNameFile, "formattingBoolVals")){
        cols.forEach(function(el,i){

            if ( arr[el.id] && el.type == "boolean" ){
                if (arr[el.id] == 2){
                    arr[el.id] = false;
                } else {
                    arr[el.id] = true;
                }
            }
        });
    }
    

    return arr;

} 

function createSentObj (values){
    const uniqueVals     = uniqueData     (values    );
    const dateFormatVals = dateFormatting (uniqueVals);
    return formattingBoolVals(dateFormatVals);
}

function putTable (updateSpace, isNavigate, form){
    try{    
        const property = $$("editTableFormProperty");
        const itemData = property.getValues();   
        const currId   = getItemId ();
        const isError  = validateProfForm().length;
        const id       = itemData.id;

        const isDirtyForm = $$("table-editForm").isDirty();
        if (!isError && id && isDirtyForm){
            const sentObj = createSentObj (itemData);


            return new ServerData({
    
                id           : `${currId}/${id}`
               
            }).put(sentObj).then(function(data){
            
                if (data){
            
                    if (updateSpace){
                        form.defaultState();
                    }

                 // для модальных окон без перехода на другую стр.
                    if (updateSpace || !isNavigate){ 
                        updateTable   (itemData);
                    }

                    unsetDirtyProp();

                    setLogValue(
                        "success", 
                        "Данные сохранены", 
                        currId
                    );

                    return true;
                }
                 
            });


        } else {
            if (isError){
                validateProfForm()
                .forEach(function(){
                    setLogError ();
                });
            } else if (!id){
                setLogValue(
                    "error", 
                    "Поле id не заполнено"
                );
            } else if (!isDirtyForm){
                setLogValue(
                    "error", 
                    "Обновлять нечего"
                );
            }
           
        }
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "saveItem"
        );
    }
}


// post
function removeNullFields(arr){
    const vals    = Object.values(arr);
    const keys    = Object.keys(arr);
    const sentObj = {};

    if (isArray(vals, logNameFile, "removeNullFields")){
        vals.forEach(function(el,i){
            if (el){
                sentObj[keys[i]]= el;
            }
            dateFormatting(arr);
        });
    }
   

    return sentObj;
}

function setCounterVal (remove){
    try{
        const counter  = $$("table-findElements");
      
        const reccount = $$("table").config.reccount;

        let full;

        if (remove){
            full = reccount - 1;

        } else {
            full = reccount + 1;

        }

        $$("table").config.reccount = full;

        const count = {full : full};

        counter.setValues(JSON.stringify(count));
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "setCounterVal"
        );
    }
}

function addToTable(newValues){
    const table  = $$("table");
    const offset = table.config.offsetAttr;

    if (newValues.id <= offset ){  // изменить 
        table.add(newValues); 
    }

    setCounterVal ();
}

function createPostObj(newValues){
    const notNullVals    = removeNullFields(newValues);
    const dateFormatVals = dateFormatting  (notNullVals);
    return formattingBoolVals(dateFormatVals);
}


function postTable (updateSpace, isNavigate, form){
    const currId  = getItemId ();
    const isError = validateProfForm().length;
  
    if (!isError){
        const property  = $$("editTableFormProperty");
        const newValues = property.getValues();
        const postObj   = createPostObj(newValues);

        return new ServerData({
            id : currId

        }).post(postObj).then(function(data){
        
            if (data){

                const id = data.content.id;
                if (id){
                    newValues.id = id;


                    if (updateSpace){
                        form.defaultState();
                    }
    
                // для модальных окон без перехода на другую стр.
                    if (updateSpace || !isNavigate){ 
                        addToTable    (newValues);
                    }
    
                    unsetDirtyProp();
    
                    setLogValue(
                        "success",
                        "Данные успешно добавлены",
                        currId
                    );
    
                    return true;
                }


               
               
            }
             
        });
 


    } else {
        setLogError ();
    }
}


// remove
function removeRow(){
    const table       = $$( "table" );
    const tableSelect = table.getSelectedId().id;

    if(table){
        table.remove(tableSelect);
    }

}

function removeTableItem(form){

    const currId = getItemId ();

    popupExec("Запись будет удалена").then(
        function(){
        
            const formValues = $$("editTableFormProperty").getValues();
            const id         = formValues.id;

            new ServerData({
    
                id           : `${currId}/${id}.json`,
               
            }).del(formValues).then(function(data){
            
                if (data){
                    form.defaultState();

                    unsetDirtyProp();
         
                    setLogValue(
                        "success",
                        "Данные успешно удалены"
                    );
                    removeRow();
                    setCounterVal (true);
                     
                }
                 
            });
    
        }
    );

}

export {
   putTable,
   postTable,
   removeTableItem
};