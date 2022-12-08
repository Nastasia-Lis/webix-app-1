
import { getItemId, pushUserDataStorage,
        getUserDataStorage, getTable, Action }  from "../../../blocks/commonFunctions.js";
import { setFunctionError, setAjaxError }       from "../../../blocks/errors.js";
import { setLogValue }                          from "../../logBlock.js";
import { setStorageData }                       from "../../../blocks/storageSetting.js";

const logNameFile = "table => columnsSettings => visibleCols => userprefsPost";

function setUpdateCols(sentVals){
    const table   = getTable();
    const columns = table.getColumns(true);
    
    function findUniqueCols(col){
        let result = false;

        sentVals.values.forEach(function(el){
            if (el.column == col){
                result = true;
            }
            
        });

        return result;
    }

    function setVisibleState(){
        try{
            columns.forEach(function(el,i){
                
                if (findUniqueCols(el.id)){
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
                "setUpdateCols => setVisibleState"
            );
        }
    }

    function moveListItem(){
        sentVals.values.forEach(function(el){
            table.moveColumn(el.column, el.position);
        });  
    }

    setVisibleState ();
    moveListItem    ();

}


function setSize(sentVals){
    const table = getTable();
    function setColWidth(el){
        table.eachColumn( 
            function (columnId){ 
                if (el.column == columnId){
                    table.setColumnWidth(columnId,el.width);
                }
            },true
        );
    }

    sentVals.values.forEach(function(el,i){

        setColWidth(el);
    });
}

async function postPrefsValues(values, visCol = false){

    let userData = getUserDataStorage();
    
    if (!userData){
        await pushUserDataStorage();
        userData = getUserDataStorage();
    }
   
    const id            = getItemId();
    const sentVals      = {
        values       : values, 
        tableIdPrefs : id
    };

    const sentObj = {
        name  : "visibleColsPrefs_" + id,
        owner : userData.id,
        prefs : sentVals,
    };

    function saveExistsTemplate(sentObj,idPutData){
        const url     = "/init/default/api/userprefs/"+idPutData;
        const putData = webix.ajax().put(url, sentObj);

        putData.then(function(data){
            data = data.json();
             
            if (data.err_type !== "i"){
                setLogValue("error","toolbarTable function saveExistsTemplate putData: "+ data.err);
            } else {
                setLogValue   ("success","Рабочая область таблицы обновлена");
                setStorageData("visibleColsPrefs_"+id, JSON.stringify(sentObj.prefs));
                setUpdateCols (sentVals);

                if (visCol){
                    setSize(sentVals);
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

    function saveNewTemplate(){
      
        const url     = "/init/default/api/userprefs/";
        
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
                setLogValue   ("success", "Рабочая область таблицы обновлена");
                setStorageData("visibleColsPrefs_" + id, JSON.stringify(sentObj.prefs));
                setUpdateCols (sentVals);
            }
        });

        userprefsPost.fail(function(err){
            setAjaxError(err, logNameFile,"saveTemplate");
        });

        Action.destructItem($$("popupVisibleCols"));
    }

    function getUserprefsData(){
      
        const getData = webix.ajax().get("/init/default/api/userprefs");
        let settingExists = false;
        let idPutData;
    
        getData.then(function(data){
            data = data.json().content;
            try{
                data.forEach(function(el){
                    
                    if (el.name == "visibleColsPrefs_" + id && !settingExists){
                        idPutData = el.id
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
                saveNewTemplate();
            } else {
                saveExistsTemplate(sentObj,idPutData);
            }
        });


        getData.fail(function(err){
            setAjaxError(err, logNameFile,"getUserprefsData");
        });

        return settingExists;

    }
    getUserprefsData();

}


export{
    postPrefsValues
};