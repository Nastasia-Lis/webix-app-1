
import { getItemId, pushUserDataStorage,
        getUserDataStorage, getTable, Action }  from "../../../blocks/commonFunctions.js";
import { setFunctionError, setAjaxError }       from "../../../blocks/errors.js";
import { setLogValue }                          from "../../logBlock.js";
import { setStorageData }                       from "../../../blocks/storageSetting.js";

const logNameFile = "table => columnsSettings => userprefsPost";
let setUpdates;

function findUniqueCols(sentVals, col){
    let result = false;

    sentVals.values.forEach(function(el){
        if (el.column == col){
            result = true;
        }
        
    });

    return result;
}


function setVisibleState(sentVals, table){
    const columns = table.getColumns(true);
    try{
        columns.forEach(function(el){
            
            if (findUniqueCols(sentVals, el.id)){
                if( !( table.isColumnVisible(el.id) ) ){
                    table.showColumn(el.id);
                }
             
            } else {
                const colIndex = table.getColumnIndex(el.id);
                if(table.isColumnVisible(el.id) && colIndex !== -1){
                    table.hideColumn(el.id);
                }
            }
        });


    } catch(err){
        setFunctionError(
            err,
            logNameFile,
            "setVisibleState"
        );
    }
}


function moveListItem(sentVals, table){
    sentVals.values.forEach(function(el){
        table.moveColumn(el.column, el.position);
    });  
}

function setUpdateCols(sentVals){
    const table   = getTable();

    setVisibleState (sentVals, table);
    moveListItem    (sentVals, table);

}


function setSize(sentVals){
    const table = getTable();
    function setColWidth(el){
        table.eachColumn( 
            function (columnId){ 
                if (el.column == columnId){
                    table.setColumnWidth(columnId, el.width);
                }
            },true
        );
    }

    sentVals.values.forEach(function(el){
        setColWidth(el);
    });
}



function saveExistsTemplate(sentObj, idPutData, visCol){
    const url     = "/init/default/api/userprefs/" + idPutData;
    const putData = webix.ajax().put(url, sentObj);

    const prefs   = sentObj.prefs;
    const id      = getItemId();

    putData.then(function(data){
        data = data.json();
         
        if (data.err_type !== "i"){
            setLogValue(
                "error",
                "toolbarTable function saveExistsTemplate putData: "+ 
                data.err
            );
        } else {
            setLogValue   (
                "success",
                "Рабочая область таблицы обновлена"
            );
            setStorageData(
                "visibleColsPrefs_" + 
                id, 
                JSON.stringify(sentObj.prefs)
            );
        
            if (setUpdates){
                setUpdateCols (prefs);
            }
          

            if (visCol){
                setSize(prefs);
            }
    
          
        }

       
    });

    putData.fail(function(err){
        setAjaxError(
            err, 
            logNameFile,
            "saveExistsTemplate => putUserprefsData"
        );
    });

    Action.destructItem($$("popupVisibleCols"));
} 


 
function saveNewTemplate(sentObj){
    const prefs  = sentObj.prefs;
    const id     = getItemId();

    const url    = "/init/default/api/userprefs/";
    
    const userprefsPost = webix.ajax().post(url, sentObj);
    
    userprefsPost.then(function(data){
        data = data.json();

        if (data.err_type !== "i"){

            setFunctionError(
                data.err,
                logNameFile,
                "saveNewTemplate"
            );

        } else {
            setLogValue   (
                "success", 
                "Рабочая область таблицы обновлена"
            );
            setStorageData(
                "visibleColsPrefs_" + 
                id, 
                JSON.stringify(sentObj.prefs)
            );

            if (setUpdates){
                setUpdateCols (prefs);
            }

        }
    });

    userprefsPost.fail(function(err){
        setAjaxError(
            err, 
            logNameFile, 
            "saveTemplate"
        );
    });

    Action.destructItem($$("popupVisibleCols"));
}

function getUserprefsData(sentObj, visCol){
    const id      = getItemId();
    const path    = "/init/default/api/userprefs";
    const getData = webix.ajax().get(path);
    
    let settingExists = false;
    let idPutData;

    getData.then(function(data){
        data = data.json().content;
     
        try{
            data.forEach(function(el){
                
                if (el.name == "visibleColsPrefs_" + id && !settingExists){
                    idPutData     = el.id;
                    settingExists = true;
            
                }
            });

        } catch (err){
            setFunctionError(
                err,
                logNameFile,
                "getUserprefsData getData"
            );
        }
    });

    getData.then(function(){
 
        if (!settingExists){
            saveNewTemplate(sentObj);
        } else {
  
            saveExistsTemplate(sentObj, idPutData, visCol);
        }
    });


    getData.fail(function(err){
        setAjaxError(
            err, 
            logNameFile, 
            "getUserprefsData"
        );
    });

    return settingExists;

}


async function postPrefsValues(values, visCol = false, updates = true){
    setUpdates   = updates;
    let userData = getUserDataStorage();
    
    if (!userData){
        await pushUserDataStorage();
        userData = getUserDataStorage();
    }
   
    const id = getItemId();
    
    const sentVals      = {
        values       : values, 
        tableIdPrefs : id
    };

    const sentObj = {
        name  : "visibleColsPrefs_" + id,
        owner : userData.id,
        prefs : sentVals,
    };


    getUserprefsData(sentObj, visCol);

}


export{
    postPrefsValues
};