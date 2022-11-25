 
import { validateProfForm }                   from './editForm/validation.js';
import { setLogValue }                        from '../logBlock.js';
import { setAjaxError, setFunctionError }     from "../../blocks/errors.js";
import { Action }                             from "../../blocks/commonFunctions.js";


const logNameFile = "table => common";


function setDirtyProperty (){
    const prop        = $$("editTableFormProperty");
    prop.config.dirty = false;
    prop.refresh();
}

function toEditForm (nextItem) {
    const valuesTable = $$("table").getItem(nextItem); 

    function setViewDate(){
        const parseDate = webix.Date.dateToStr("%d.%m.%y %H:%i:%s");
        try{
            Object.values(valuesTable).forEach(function(el,i){
        
                if(el instanceof Date){
                    const key        = Object.keys(valuesTable)[i];
                    const value      = parseDate(el);
                    valuesTable[key] = value;
                }
            
            });
        } catch (err){ 
            setFunctionError(err,logNameFile,"setViewDate")
        }
    }

    function setPropState(){
        try{
            const prop      = $$("editTableFormProperty");
            const form      = $$("table-editForm"); 
            const newAddBtn = $$("table-newAddBtnId");

            if (prop && !(prop.isVisible())){
                prop.show();

                if (window.innerWidth > 850){
                    form.config.width = 350;   
                    form.resize();
                }
            }

            if (!(newAddBtn.isEnabled())){
                newAddBtn.enable();
            }

            setDirtyProperty();
            setViewDate     ();

            prop.setValues(valuesTable);
        
            $$("table-saveNewBtn").hide();
            $$("table-saveBtn")   .show();
            $$("table-delBtnId")  .enable();

        } catch (err){   
            setFunctionError(
                err,
                logNameFile,
                "toEditForm => setPropState"
            );
        }
    }

    setPropState();

}


function validateError (){
    validateProfForm ().forEach(function(el,i){

        let nameEl;
        try{
            $$("table").getColumns().forEach(function(col,i){
                if (col.id == el.nameCol){
                    nameEl = col.label;
                }
            });
        } catch (err){ 
            setFunctionError(err,logNameFile,"validateError")
        }
        setLogValue("error",el.textError + " (Поле: " + nameEl + ")");
    });
}

function uniqueData (itemData){
    let validateData = {};

    try{
        Object.values(itemData).forEach(function(el,i){
            const oldValues    = $$("table").getItem(itemData.id)
            const oldValueKeys = Object.keys(oldValues);

            function compareVals (){
                let newValKey = Object.keys(itemData)[i];
                
                oldValueKeys.forEach(function(oldValKey){
                    
                    if (oldValKey == newValKey){
                        
                        if  (oldValues[oldValKey] !== Object.values(itemData)[i] ){
                            validateData[Object.keys(itemData)[i]] = Object.values(itemData)[i];
                        } 
                        
                    }
                }); 
            }
            compareVals ();
        });
    } catch (err){ 
        setFunctionError(err,logNameFile,"uniqueData")
    }
    return validateData;
}

function putData (nextItem, valuesProp, currId, editInForm=false){
   
    if (!(validateProfForm().length)){

        if (valuesProp.id){

            let sentValues;
            if (editInForm){
                sentValues = uniqueData (valuesProp);
            } else {
                sentValues = valuesProp;
            }

            const table   =  $$("table");
            const url     = "/init/default/api/"+currId+"/"+valuesProp.id;
            const putData =  webix.ajax().put(url, sentValues);
            
            putData.then(function(data){
                data = data.json();
                if (data.err_type == "i"){

                    setLogValue("success","Данные сохранены");
                    table.updateItem(valuesProp.id, valuesProp);
                    Action.removeItem($$("propertyRefbtnsContainer"));

                    if (editInForm){
                        toEditForm(nextItem);
                        table.select(nextItem);
                    }
                } if (data.err_type == "e"){
                    setLogValue("error",data.error);
                }
            });

            putData.fail(function(err){
                setAjaxError(err, logNameFile,"putData");
            });
        
        }

    } else {
        validateError ();
    }
}


export {
    setDirtyProperty,
    toEditForm,
    validateError,
    uniqueData,
    putData
};