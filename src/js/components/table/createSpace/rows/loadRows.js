import { Action }                           from "../../../../blocks/commonFunctions.js";
import { setAjaxError, setFunctionError }   from "../../../../blocks/errors.js";

import { getUserPrefsContext }              from './userContext.js';
import { popupNotAuth }                     from './popupNotAuth.js';
import {  formattingBoolVals,
          formattingDateVals, }             from './formattingData.js';

import { setDefaultValues }                 from './setDefaultValues.js';

import { selectContextId }                  from '../createContextSpace.js';
import { returnLostData }                   from '../returnLostData.js';
const logNameFile = "table => createSpace => loadData";


let idCurrTable;
let offsetParam;
let itemTreeId;

let idFindElem;


function setTableState(table){
     
    if (table == "table"){
        Action.enableItem($$("table-newAddBtnId"));
        Action.enableItem($$("table-filterId"));
        Action.enableItem($$("table-exportBtn"));
    }

}

function enableVisibleBtn(){
    const viewBtn =  $$("table-view-visibleCols");
    const btn     =  $$("table-visibleCols");
  
    if ( viewBtn.isVisible() ){
        Action.enableItem(viewBtn);

    } else if ( btn.isVisible() ){
        Action.enableItem(btn);

    }
  
}

 
let idCurrView;


function checkNotUnique(idAddRow){    
    const tablePool = idCurrView.data.pull;
    const values    = Object.values(tablePool);
    
    values.forEach(function(el){
        if ( el.id == idAddRow ){
            idCurrView.remove(el.id);
        }
    });
}


function changeFullTable(data){

    if (data.length !== 0){
        idCurrView.hideOverlay("Ничего не найдено");
        idCurrView.parse      (data);

    } else {
        idCurrView.showOverlay("Ничего не найдено");
        idCurrView.clearAll   ();
    }

    setTimeout(() => {
        enableVisibleBtn();
    }, 1000);
}

function changePart(data){
    data.forEach(function(el,i){
        checkNotUnique(el.id);
        idCurrView.add(el);
    });
}

function parseRowData (data){

    idCurrView = $$(idCurrTable);
   
    if (!offsetParam){
        idCurrView.clearAll();
    }

    formattingBoolVals (idCurrView, data);
    formattingDateVals (idCurrView, data);
    setDefaultValues   (data);
 
 
    if ( !offsetParam ){
        changeFullTable(data);
    } else {
        changePart     (data);
    }
  
}


function setCounterVal (data){
    try{
        const prevCountRows = data;
        $$(idFindElem).setValues(prevCountRows);

    } catch (err){
        setFunctionError(err, logNameFile, "setCounterVal");
    }
}


function getLinkParams(param){
    const  params = new URLSearchParams (window.location.search);
    return params.get(param);
}

function filterParam(){
    const  value = getLinkParams("prefs");
    return value;
}


async function returnFilter(tableElem){
    const filterString = tableElem.config.filter;
    const urlParameter = filterParam();

    let filter;

    if (urlParameter){
        filter = await getUserPrefsContext(urlParameter, "filter");
    }

    if (!filter){
        if (filterString && filterString.table === itemTreeId){
            filter = filterString.query;

        } else {
            filter = itemTreeId +'.id+%3E%3D+0';
          
        }
    }

    return filter;
}


function returnSort(tableElem){
    let sort;

    const firstCol = tableElem.getColumns()[0].id;
    const sortCol  = tableElem.config.sort.idCol;
    const sortType = tableElem.config.sort.type;

    if (sortCol){
        if (sortType == "desc"){
            sort = "~" + itemTreeId + '.' + sortCol;
        } else {
            sort =       itemTreeId + '.' + sortCol;
        }
    } else {
            sort =       itemTreeId + '.' + firstCol;
    }
    return sort;
}


function returnPath(tableElem, query){
    const tableType = tableElem.config.id;
    let path;
     
    if (tableType == "table"){
        path = "/init/default/api/smarts?"+ query.join("&");
    } else {
        path = "/init/default/api/" + itemTreeId;
    }

    return path;
}

function setConfigTable(tableElem, data, limitLoad){

    const tableType = tableElem.config.id;

    if ( !offsetParam && tableType == "table" ){
        tableElem.config.reccount  = data.reccount;
        tableElem.config.idTable   = itemTreeId;
        tableElem.config.limitLoad = limitLoad;
        setCounterVal (data.reccount.toString());
    }

    if( tableType == "table-view" ){
        tableElem.config.idTable   = itemTreeId;
        setCounterVal (data.content.length.toString());
    }
}


function tableErrorState (){
    const prevCountRows = "-";
    const value         = prevCountRows.toString();
    try {
        $$(idFindElem).setValues(value);
        
        Action.disableItem($$("table-newAddBtnId"));
        Action.disableItem($$("table-filterId"));
        Action.disableItem($$("table-exportBtn"));

    } catch (err){
        setFunctionError(err, logNameFile, "tableErrorState");

    }
}


async function loadTableData(table, id, idsParam, offset){
    const tableElem = $$(table);
    const limitLoad = 80;

    idCurrTable = id;
    offsetParam = offset;      
    itemTreeId  = idsParam;

    idFindElem  = idCurrTable + "-findElements";

    const filter    = await returnFilter(tableElem);
   

    const sort      = returnSort  (tableElem);

    const query = [ "query=" + filter, 
                    "sorts=" + sort, 
                    "limit=" + limitLoad, 
                    "offset="+ offsetParam
    ];

    tableElem.load({
        $proxy : true,
        load   : function(){
            
          
            const path      = returnPath (tableElem, query);
     
            const getData = webix.ajax().get( path );
      
    
            getData.then(function(data){
                data = data.json();

                
                setConfigTable(tableElem, data, limitLoad);

                data  = data.content;
 
                // data = [
                //     {
                //         "created_on": "2022-11-23 17:33:03",
                //         "id": 2,
                //         "renew": true,
                //         "service": "fffs",
                //         "ticket": "ddddafa",
                //         "user_id": 1,
                //     },
                //     {
                //        // "created_on": "2021-02-13 20:33:03",
                //         "id": 3,
                //         //"renew": true,
                //         "service": "22233323",
                //         "ticket": "fffffff",
                //         "user_id": 2,
                //     }
                // ]
              
   
                setTableState(table);
                parseRowData (data);
                if (!offsetParam){
                    selectContextId();  
                    returnLostData();
                }
            

            });
            
            getData.fail(function(err){

                tableErrorState ();

                if (err.status == 401 && !($$("popupNotAuth"))){
                    popupNotAuth();
                } 

                setAjaxError(err, "getInfoTable", "getData");
            });

        }
    });
}

export {
    loadTableData
};