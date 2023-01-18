import { Action, isArray }                  from "../../../../blocks/commonFunctions.js";
import { setFunctionError }                 from "../../../../blocks/errors.js";
import { ServerData }                       from "../../../../blocks/getServerData.js";

import {  formattingBoolVals,
          formattingDateVals, }             from './formattingData.js';

import { setDefaultValues }                 from './setDefaultValues.js';

import { selectContextId }                  from '../createContextSpace.js';
import { returnLostData }                   from '../returnLostData.js';
import { returnSortData }                   from '../returnSortData.js';
import { returnLostFilter }                 from '../returnLostFilter.js';
import { returnDashboardFilter }            from '../returnDashboardFilter.js';

const logNameFile = "table => createSpace => loadData";


let idCurrTable;
let offsetParam;
let itemTreeId;

let idFindElem;

//let firstError = false;
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
    
    if (isArray(values, logNameFile, "checkNotUnique")){
        values.forEach(function(el){
            if ( el.id == idAddRow ){
                idCurrView.remove(el.id);
            }
        });
    }
    
}


function changeFullTable(data){
    const overlay = "Ничего не найдено";
    if (data.length !== 0){
        idCurrView.hideOverlay(overlay);
        idCurrView.parse      (data);

    } else {
        idCurrView.showOverlay(overlay);
        idCurrView.clearAll   ();
    }

    setTimeout(() => {
        enableVisibleBtn();
    }, 1000);
}

function changePart(data){
    if (isArray(data, logNameFile, "changePart")){
        data.forEach(function(el){
            checkNotUnique(el.id);
            idCurrView.add(el);
        });
    }
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


function setCounterVal (data, idTable){

    const table = $$(idTable)
    try{
        const prevCountRows = {full : data, visible : table.count()};
        $$(idFindElem).setValues(JSON.stringify(prevCountRows));
  
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "setCounterVal"
        );
    }
}



async function returnFilter(tableElem){
 
    const filterString = tableElem.config.filter;
 
    const result = {
        prefs : true
    };


    if (!result.filter){
        result.prefs = false;
    
  
        if (filterString && filterString.table === itemTreeId){
            result.filter = filterString.query;
            const id = tableElem.config.id + "_applyNotify";
            Action.showItem($$(id));

        } else {
            result.filter = itemTreeId +'.id+%3E%3D+0';
          
        }
    }

  

    return result;
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
            sort = itemTreeId + '.' + sortCol;
        }
        tableElem.markSorting(sortCol, sortType);
    } else {
        sort = itemTreeId + '.' + firstCol;
        tableElem.markSorting(firstCol, "asc");
    }


    return sort;
}


function returnPath(tableElem, query){
    const tableType = tableElem.config.id;
    let path;
     
    if (tableType == "table"){
        //path = "/init/default/api/smarts?"+ query.join("&");
        path = `smarts?${query.join("&")}`;
    } else {
        //path = "/init/default/api/" + itemTreeId;
        path = itemTreeId;
    }

    return path;
}

function setConfigTable(tableElem, data, limitLoad){

    const tableType = tableElem.config.id;

    if ( !offsetParam && tableType == "table" ){
        tableElem.config.reccount  = data.reccount;
        tableElem.config.idTable   = itemTreeId;
        tableElem.config.limitLoad = limitLoad;
    }

    if( tableType == "table-view" ){
        tableElem.config.idTable   = itemTreeId;
        tableElem.config.reccount  = data.content ? data.content.length : null;
    }
}


function tableErrorState (){
  
    const prevCountRows = {full : "-"};
    const value         = prevCountRows.toString();
    try {
        $$(idCurrTable).showOverlay("Ничего не найдено");
        $$(idFindElem) .setValues  (JSON.stringify(value));
        
        Action.disableItem($$("table-newAddBtnId"));
        Action.disableItem($$("table-filterId"));
        Action.disableItem($$("table-exportBtn"));

    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "tableErrorState"
        );

    }
}


async function loadTableData(table, id, idsParam, offset){
   
    const tableElem = $$(table);
    const limitLoad = 80;

    idCurrTable = id;
    offsetParam = offset;      
    itemTreeId  = idsParam;

    idFindElem  = idCurrTable + "-findElements";

    const resultFilter = await returnFilter(tableElem);
    const isPrefs      = resultFilter.prefs;
    const filter       = resultFilter.filter;

    if (!offsetParam){
        returnSortData ();
    }


    const sort      = returnSort  (tableElem);

    const query = [ "query=" + filter, 
                    "sorts=" + sort, 
                    "limit=" + limitLoad, 
                    "offset="+ offsetParam
    ];


    tableElem.load({
        $proxy : true,
        load   : function(){
            const path = returnPath (tableElem, query);

            new ServerData({
                id           : path,
                isFullPath   : false,
                errorActions : tableErrorState
            
            }).get().then(function(data){
            
                if (data){

                    const reccount = data.reccount ? data.reccount : data.content.length;
                    const content  = data.content;

                    setConfigTable(tableElem, data, limitLoad);

                    if (content){
                        data  = data.content;
            
                        setTableState(table);
                        parseRowData (data);
             
                        if (!offsetParam){
                        
                            selectContextId      ();  
                     
                            returnLostData   ();
                            returnLostFilter (itemTreeId);

                            if (isPrefs){
                                returnDashboardFilter(filter);
                            }
                        }

                        setCounterVal (reccount, tableElem);
            
                    }
                }
                
            });
          

        }
    });

}

export {
    loadTableData
};