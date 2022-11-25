 
import { validateProfForm }               from "../table/editForm/validation.js";
import { modalBox }                       from "../../blocks/notifications.js";
import { setLogValue }                    from "../logBlock.js";
import { setAjaxError, setFunctionError } from "../../blocks/errors.js";
import { Action, getItemId}               from "../../blocks/commonFunctions.js";


const logNameFile = "treeSidebar => onItemClick";

 
let prop;
let propBtns;
let valuesProp;
let currId;
let id;

function setDirtyProperty (){
    try{
        prop.config.dirty = false;
        prop.refresh();
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "setDirtyProperty"
        );
    }
}

function setDefaultStateProperty (){
    try{
        if (prop && prop.isVisible()){
            prop.clear();
            prop.hide();
        }
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "setDirtyProperty"
        );
    }
}

function setDefaultStateBtns (){
    try{
        const saveNewBtn = $$("table-saveNewBtn");
        const saveBtn    = $$("table-saveBtn");
        const delBtn     = $$("table-delBtnId");
 
      
        if (saveNewBtn.isVisible()) {
            saveNewBtn.hide();

        } else if (saveBtn.isVisible()){
            saveBtn.hide();
        }
        
        Action.disableItem(delBtn);

    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "setDefaultStateBtns"
        );
    }
}


function validateError (){
    try{
        validateProfForm ().forEach(function(el,i){
            let nameEl;

            $$("table").getColumns().forEach(function(col){
                if (col.id == el.nameCol){
                    nameEl = col.label;
                }
            });

            setLogValue("error", 
            el.textError + " (Поле: " + nameEl + ")");
        });
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "validateError"
        );
    }
}


function uniqueData (itemData){
    let validateData = {};

    function compareVals (i){
        try{
            const oldValues       = $$("table").getItem(itemData.id);
            const oldValueKeys    = Object.keys  (oldValues);

            const newValKey       = Object.keys  (itemData)[i];
            const newVal          = Object.values(itemData)[i];
            
            oldValueKeys.forEach(function(oldValKey){
                
                if (oldValKey == newValKey){

                    if (oldValues[oldValKey]  !== newVal){
                        validateData[newValKey] = newVal;
                    } 
                    
                }
            }); 
        } catch (err){
            setFunctionError( err, logNameFile, "compareVals");
        }
    }

    Object.values(itemData).forEach(function(el, i){         
        compareVals (i);
    });

    return validateData;
}



function selectTree(id){
    const tree = $$("tree");
    if (tree){
        tree.select(id);
    }
}

function postNewData (){


    if (!(validateProfForm().length)){
        const url       = "/init/default/api/" + currId;
        const postData  = webix.ajax().post(url, valuesProp);

        postData.then(function(data){
            data = data.json();
            if (data.content.id !== null){
                setDirtyProperty ();
                Action.removeItem(propBtns);
                selectTree(id);
                setLogValue(
                    "success", 
                    "Данные успешно добавлены", 
                    currId
                );

            } else {

                const errs   = data.content.errors;
                const values = Object.values(errs);
                let msg      = "";

                values.forEach(function(err,i){
                    const field = Object.keys(errs)[i];
                    msg += err + " (Поле: " + field + "); ";
                });

                setLogValue("error", msg);
            }

            if(data.err_type !== "i"){
                setFunctionError(
                    data.err,
                    logNameFile,
                    "postNewData"
                );
            }
        });

        postData.fail(function(err){
            setAjaxError(err, logNameFile, "postNewData");
        });

    } else {
        validateError ();
    }
}

function putData (){
    if (!(validateProfForm().length)){

        if (valuesProp.id){
            const url = "/init/default/api/" + currId + "/" + valuesProp.id;
            const putValue = uniqueData (valuesProp);
            const putData = webix.ajax().put(url, putValue);

            putData.then(function(data){
                data = data.json()
            
                if (data.err_type == "i"){
                    setDirtyProperty ();
                    Action.removeItem(propBtns);
                    selectTree(id);
                    setLogValue(
                        "success",
                        "Данные успешно добавлены",
                        currId
                    );
            
                } else {
                    setFunctionError(
                        data.err, 
                        logNameFile, 
                        "putData"
                    );
                }
            });

            putData.fail(function(err){
                setAjaxError(err, logNameFile ,"putData");
            });

        }

    } else {
        validateError ();
    }
}


function modalBoxTree (){
    const saveBtn = $$("table-saveBtn");

    modalBox().then(function(result){
        if (result == 1){

            setDefaultStateBtns ();
            setDefaultStateProperty ();
            setDirtyProperty ();

            $$("tree").select(id);

        } else if (result == 2){

            if (saveBtn.isVisible()){
                putData ();
          
            } else {
                postNewData ();  
            }
            setDirtyProperty ();
        }

        if (result == 1 || result == 2){
            Action.removeItem(propBtns);
        }

    });
}

function createModalBox(nextId){

    prop       = $$("editTableFormProperty");
    propBtns   = $$("propertyRefbtnsContainer");
    valuesProp = prop.getValues();
    currId     = getItemId ();
    id         = nextId;


    if(prop.config.dirty){
        modalBoxTree ();
        return false;
    }
    
    setDefaultStateBtns ();
}

export {
    createModalBox
};