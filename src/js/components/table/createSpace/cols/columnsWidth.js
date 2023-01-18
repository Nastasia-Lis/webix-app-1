import { isArray } from "../../../../blocks/commonFunctions.js";

let table; 
let idsParam;
let storageData;

const logNameFile = "table/createSpace/cols/columnsWidth";

function setColsUserSize(){
    const sumWidth = [];
    if (isArray(storageData, logNameFile, "setColsUserSize")){
        storageData.values.forEach(function (el){
            sumWidth.push(el.width);
            table.setColumnWidth(el.column, el.width);
        }); 
    
    }
  
    return sumWidth;  
}

function returnSumWidth(){
    let sumWidth;

    if ( storageData && storageData.values.length ){
        sumWidth = setColsUserSize();  
    }

    return sumWidth;
}

function returnCountCols(){
    let countCols;

    if(storageData && storageData.values.length){
        countCols  =  length;
    } else {
        const cols = table.getColumns(true);
        countCols  = cols .length;
    }
    return countCols;
}

function returnContainerWidth(){
    let containerWidth;

    containerWidth = window.innerWidth - $$("tree").$width - 25;

    return containerWidth;
}

function setColsSize(col){
    const countCols      = returnCountCols();
    const containerWidth = returnContainerWidth();

    const tableWidth     = containerWidth - 17;  
    const colWidth       = tableWidth / countCols;


    table.setColumnWidth(col, colWidth);
}


function findUniqueCols(col){
    let result = false;

    if (isArray(storageData, logNameFile, "findUniqueCols")){
        storageData.values.forEach(function(el){

            if (el.column == col){
                result = true;
            }
    
        });
    }
  
    return result;
}


function getSumStorageColumns(){
    const sumWidth       = returnSumWidth();
    return sumWidth.reduce((a, b) => +a + +b, 0);
}

function getContainerWidth(){
    const tableWidth  = $$("tree").$width;
    const screenWidth = window.innerWidth;
    return screenWidth - tableWidth;
}

function getLastColumn(){
    const cols       = table.getColumns();
    const lastColId  = cols.length - 1;
    return cols[lastColId];
}


function setWidthLastCol(){
    const reduce         = getSumStorageColumns();
    const containerWidth = getContainerWidth();  

    if (reduce < containerWidth){
        const lastCol    = getLastColumn();
        const difference = containerWidth - reduce;
        const oldWidth   = lastCol.width;
        const newWidth   = oldWidth + difference;

        table.setColumnWidth(lastCol.id, newWidth);
        
    }

}



function setVisibleCols(allCols){

    if (isArray(allCols, logNameFile, "setVisibleCols")){
        allCols.forEach(function(el,i){

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
    }
  
}


function setPositionCols(){
    if (isArray(storageData.values, logNameFile, "setPositionCols")){
        storageData.values.forEach(function(el){
            table.moveColumn(el.column,el.position);
                
        });
    }
   
} 

function setUserPrefs(idTable, ids){
    table       = idTable;
    idsParam    = ids;

    const prefsName = "visibleColsPrefs_" + idsParam;

    storageData   = webix.storage.local.get(prefsName);

    const allCols = table.getColumns       (true);
 
   
    if( storageData && storageData.values.length ){
        setVisibleCols (allCols);
        setPositionCols();
        setWidthLastCol();

    } else {   
   
        if (isArray(allCols, logNameFile, "setUserPrefs")){
            allCols.forEach(function(el){
                setColsSize(el.id);  
            });
        }
      
       
    }

    
}

export {
    setUserPrefs
};