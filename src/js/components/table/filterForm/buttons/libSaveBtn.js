import { setLogValue }                           from '../../../logBlock.js';

import { setFunctionError,setAjaxError }         from "../../../../blocks/errors.js";
import { setStorageData }                        from "../../../../blocks/storageSetting.js";
import { modalBox }                              from "../../../../blocks/notifications.js";

import { visibleInputs, PREFS_STORAGE }          from "./../common.js";

import { getItemId }                             from "../../../../blocks/commonFunctions.js";

import { Button }                                from "../../../../viewTemplates/buttons.js";


const logNameFile   = "tableFilter => buttons => libSaveBtn";

//PREFS_STORAGE


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
          
            async function saveTemplate (){ 
           
                const data         = PREFS_STORAGE.userprefs.content;
                const nameTemplate = result;
                let settingExists  = false;

                const currId       = getItemId();

                const template     = {
                    name        : nameTemplate,
                    table       : currId,
                    values      : []
                };

                function createPrefsValue(){
                    const keys             = Object.keys(visibleInputs);
                    const keysLength       = keys.length;

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
                        arr.forEach(function(el,i){
                       
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
                                    "function libraryBtnClick => setOperation"
                                );
                            }
                        });
                    }
                   
                    for (let i = 0; i < keysLength; i++) {   
                        const key = keys[i];
                        setOperation(visibleInputs[key]);
                    }

                  
                }

                const sentObj = {
                    name    : currId + "_filter-template_" + nameTemplate,
                    prefs   : template,
                };
                
                
                function saveExistsTemplate(sentObj){
                    data.forEach(function(el,i){
               
                        const currName = currId + "_filter-template_" + nameTemplate;
                    
                        function putUserprefsData (){
                            const url     = "/init/default/api/userprefs/"+el.id;
                         
                            const putData = webix.ajax().put(url, sentObj);

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
                                    setLogValue(
                                        "error",
                                        "tableFilter => buttons function modalBoxExists: " + 
                                        data.err
                                    );
                                }
                            });

                            putData.fail(function(err){
                                setAjaxError(
                                    err, 
                                    logNameFile,
                                    "saveExistsTemplate => putUserprefsData"
                                );
                            });

                        }

                        function modalBoxExists(){
               
                            modalBox(   "Шаблон с таким именем существует", 
                                        "После сохранения предыдущие данные будут стёрты", 
                                        ["Отмена", "Сохранить изменения"]
                            )
                            .then(function(result){
                               
                                if (result == 1){
                                    putUserprefsData ();
                                }
                            });
                        }
                     
                        if (el.name == currName){
                            settingExists = true;
                            modalBoxExists();
                        } 
                    });
                }

                function setDataStorage(){
                    const whoamiData = webix.ajax("/init/default/api/whoami");
                    whoamiData.then(function(data){
                        data          = data.json().content;
                        sentObj.owner = data.id;

                        const userData      = {};
                        userData.id         = data.id;
                        userData.name       = data.first_name;
                        userData.username   = data.username;
                        
                        setStorageData("user", JSON.stringify(userData));
                    });

                    whoamiData.fail(function(err){
                        setAjaxError(err, logNameFile,"saveTemplate => setDataStorage");
                    });

                }
                
                function saveNewTemplate(){
                    const ownerId = webix.storage.local.get("user").id;
                    if (ownerId){
                        sentObj.owner = ownerId;
                    } else {
                        setDataStorage();
                    }

                    const url           = "/init/default/api/userprefs/";

                    const userprefsPost = webix.ajax().post(url, sentObj);
                    
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
                            setLogValue("error",data.error);
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
               
                if (PREFS_STORAGE.userprefs){

                    createPrefsValue    ();
                    saveExistsTemplate  (sentObj);

                    
                    if (!settingExists){
                        saveNewTemplate();
                    } 
                  
                }
            }

            saveTemplate ();

        });
    
    } catch(err) {
        setFunctionError(err,logNameFile,"function filterSubmitBtn");
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