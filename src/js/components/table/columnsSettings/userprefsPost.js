
///////////////////////////////

// Загрузка данных о модифицированных колонках на сервер

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { getItemId, returnOwner, 
        getTable, Action, isArray } from "../../../blocks/commonFunctions.js";
import { setFunctionError }         from "../../../blocks/errors.js";
import { setLogValue }              from "../../logBlock.js";
import { setStorageData }           from "../../../blocks/storageSetting.js";
import { ServerData }               from "../../../blocks/getServerData.js";



const logNameFile = "table => columnsSettings => userprefsPost";
let setUpdates;
let userData;

function findUniqueCols(sentVals, col){
    let result = false;

    if (isArray(sentVals, logNameFile, "findUniqueCols")){
        sentVals.values.forEach(function(el){
            if (el.column == col){
                result = true;
            }
            
        });
    }
  

    return result;
}


function setVisibleState(sentVals, table){
    const columns = table.getColumns(true);
    try{

        if (columns.length){
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
        } else {
            setFunctionError(
                "array length is null",
                logNameFile,
                "setVisibleState"
            );
        }
        


    } catch(err){
        setFunctionError(
            err,
            logNameFile,
            "setVisibleState"
        );
    }
}


function moveListItem(sentVals, table){
    if (isArray(sentVals.values, logNameFile, "moveListItem")){
        sentVals.values.forEach(function(el){
            table.moveColumn(el.column, el.position);
        }); 
    }
   
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

    if (isArray(sentVals.values, logNameFile, "setSize")){
        sentVals.values.forEach(function(el){
            setColWidth(el);
        });
    }
  
}



function saveExistsTemplate(sentObj, idPutData, visCol){

    const prefs   = sentObj.prefs;
    const id      = getItemId();

    new ServerData({
        id : `userprefs/${idPutData}`,
       
    }).put(sentObj).then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (content){
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
        }
         
    });


    Action.destructItem($$("popupVisibleCols"));
} 


 
function saveNewTemplate(sentObj){
    const prefs  = sentObj.prefs;
    const id     = getItemId();

       
    new ServerData({
        id : "userprefs",
       
    }).post(sentObj).then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (content){
               
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
        }
         
    });

    Action.destructItem($$("popupVisibleCols"));
}

function getUserprefsData(sentObj, visCol){
    const id      = getItemId();

    new ServerData({
        id : `smarts?query=userprefs.name+=+%27visibleColsPrefs_${id}%27+and+userprefs.owner+=+${userData.id}&limit=80&offset=0`,
    
    }).get().then(function(data){

        if (data){

            const content = data.content;

            if (content && content.length){ // запись уже существует
                saveExistsTemplate(sentObj, content[0].id, visCol);
            } else {
                saveNewTemplate(sentObj);
            }

        }
        
    });


}


async function postPrefsValues(values, visCol = false, updates = true){
    setUpdates   = updates;
    userData = await returnOwner();
   
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