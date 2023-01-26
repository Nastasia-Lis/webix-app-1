///////////////////////////////
//
// Layout попапа с настройками колонок                      (create popup)
//
// Кнопка сброса до дефолтных настроек                      (create clear btn) 
//
// Создание list компонентов попапа                         (create lists)
//
// Кнопки перемещения между list компонентами               (create list move btns)
//
// Кнопки перемещения колонок вверх/вниз                    (create move up btns)
//
// Сохранение настроек                                      (create save btn)
//
// Поиск по названию колонок                                (create search input) 
//
// Сохранение ресайза колонок                               (create resize cols)
//
// Перемещение колонок                                      (create drop cols)
//
// Загрузка данных о модифицированных колонках на сервер    (create modify cols data)
//
// Событие таблицы onColumnResize                           (create onColumnResize)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////


import { Popup }                 from "../../viewTemplates/popup.js";

import { Button }                from "../../viewTemplates/buttons.js";
import { setFunctionError }      from "../../blocks/errors.js";
import { setLogValue }           from "../logBlock.js";
import { modalBox }              from "../../blocks/notifications.js";
import { Action, getTable }      from "../../blocks/commonFunctions.js";
import { createEmptyTemplate }   from "../../viewTemplates/emptyTemplate.js";

import { getItemId, returnOwner, 
        isArray }                from "../../blocks/commonFunctions.js";
import { setStorageData }        from "../../blocks/storageSetting.js";
import { ServerData }            from "../../blocks/getServerData.js";



const logNameFile = "table/columnsSettings";


// create popup
function genetateScrollView(idCheckboxes, inner){
    return {
        view        : "scrollview",
        css         : "webix_multivew-cell",
        borderless  : true,
        scroll      : false,
        body        : { 
            id  : idCheckboxes,
            rows: inner
        }
    };
}

function returnContent(){
    const content = { 
        cols:[
            {   
                rows:[
                    returnSearch(),

                    genetateScrollView(
                        "listContent",
                        returnAvailableList()
                    ),
                ]
            },

            {width:10},
            { rows:[
                {height:45},
                {},
                returnListBtns(),
                {}
            ]},
            {width:10},

            { rows:[
            
                {cols:[
                    returnMoveBtns(),
                    returnClearBtn(),
                ]},
                genetateScrollView(
                    "listSelectedContent",
                    returnSelectedList()
                ),
            ]},
        ]
    };

    return content;
}


function createPopup(){
       
    const popup = new Popup({
        headline : "Видимость колонок",
        config   : {
            id          : "popupVisibleCols",
            width       : 600,
            maxHeight   : 400,
        },
     

        elements : {
            rows:[
                returnContent(),

                {height:20},

                returnSaveBtn(),
            ]
          
        }
    });

    popup.createView ();
}






// create clear btn

let table;
let values;

function returnContainer(){
    const tableId = getTable().config.id;
    if (tableId == "table"){
        return $$("tableContainer");
    } else if (tableId == "table-view"){
        return $$("formsContainer");
    }
    
}

function setColsSize(col, listItems){
    const container  = returnContainer();

    const table      = getTable();
    const countCols  = listItems.length;
    const scroll     = 17;
    const tableWidth = container.$width - scroll;
    const colWidth   = tableWidth / countCols;
    table.setColumnWidth(col, colWidth);
    table.setColumnWidth("action0", 400);
}


function returnWidthCol(){
    const scrollSpace    = 77;
    const treeWidth      = $$("tree").$width;
    const containerWidth = window.innerWidth - treeWidth - scrollSpace; 
    const cols           = table.getColumns(true).length;
    const colWidth       = containerWidth / cols;

    return colWidth.toFixed(2);
}
function returnArrayError(){
    setFunctionError(
        "array length is null",
        logNameFile,
        "returnPosition"
    );
}

function returnPosition(column){
    let position;
    const pull = table.data.pull[1];
   
    if (pull){
        const defaultColsPosition = Object.keys(pull);
        
        if (defaultColsPosition.length){
            defaultColsPosition.forEach(function(el, i){
                if (el == column){
                    position = i;
                }
            });
        } else {
            returnArrayError(); 
        }
        

    }

    return position;
}
 
function showCols(){
    const cols = table.getColumns(true);
    try{

        if (cols.length){
            cols.forEach(function(el,i){
                const colWidth    = returnWidthCol();
                const positionCol = returnPosition(el.id);
    
                setColsSize(el.id,cols);
                
                if( !( table.isColumnVisible(el.id) ) ){
                    table.showColumn(el.id);
                }
           
                table.setColumnWidth(el.id, colWidth);
    
                values.push({
                    column   : el.id,
                    position : positionCol,
                    width    : colWidth 
                });
            });
        } else {
            returnArrayError();
        }
       
    } catch(err){
        setFunctionError(
            err,
            logNameFile,
            "clearBtnColsClick / showCols"
        );
    }
}

function clearBtnColsClick (){
    table        = getTable();

    values = [];

    modalBox("Будут установлены стандартные настройки", 
            "Вы уверены?", 
            ["Отмена", "Сохранить изменения"]
    )
    .then(function(result){

        if (result == 1){
            showCols();
            postPrefsValues(values);
            Action.destructItem($$("popupVisibleCols"));
            setLogValue (
                "success",
                "Рабочая область таблицы обновлена"
            );
        }
    });
}

function returnClearBtn(){
    const clearBtn = new Button({

        config   : {
            id       : "clearBtnCols",
            hotkey   : "Alt+Shift+R",
            icon     : "icon-trash",
     
            click    : function(){
                clearBtnColsClick();
            },
        },
        css            : "webix-trash-btn-color",
        titleAttribute : "Установить стандартные настройки"
       
    }).transparentView();

    return clearBtn;
}







// create lists 

function generateEmptyTemplate(id, text){

    const layout = {
        css:"list-filter-empty",
        rows:[
            createEmptyTemplate(text, id)
        ]
    };

    return  layout;
}

function selectPrevItem(self, id){
    
    const prevItem =  self.getNextId(id);
    if(prevItem){
        self.select(prevItem);
    }
}

function hideEmptyTemplate(self, id){
    const pullLength = Object.keys(self.data.pull).length;
    if (!pullLength){
        Action.showItem($$(id));
    }
}
function returnAvailableList(){
    const emptyElId = "visibleColsEmptyTempalte";
    const scrollView = [
        {   template    : "Доступные колонки", 
            css         : "list-filter-headline",
            height      : 25, 
            borderless  : true
        },
        generateEmptyTemplate(
            emptyElId,
            "Нет доступных колонок"
        ),

        {
            view      : "list", 
            id        : "visibleList",
            template  : "#label#",
            select    : true,
            css       : "list-filter-borders",
            borderless: true,
            data      : [],
            on        : {
                onAfterAdd:function(){
                    Action.enableItem($$("addColsBtn"));
                    Action.hideItem  ($$(emptyElId));
                },
                onAfterDelete:function(id){
                    hideEmptyTemplate(this, emptyElId);
                    selectPrevItem   (this, id);
                },
            }
        }
        
    ];

    return scrollView;
}


function returnSelectedList(){
    const emptyElId = "visibleColsEmptyTempalteSelected";
    const scrollViewSelected = [
        {   template    : "Выбранные колонки",
            css         : "list-filter-headline",
            height      : 25, 
            borderless  : true,
         
        },
        generateEmptyTemplate(
            emptyElId,
            "Выберите колонки из доступных"
        ),

        {
            view      : "list", 
            id        : "visibleListSelected",
            template  : "#label#",
            css       : "list-filter-borders",
            select    : true,
            borderless: true,
            data      : [],
            on        : {
                onAfterAdd : function(){
                    Action.enableItem($$("removeColsBtn"));
                    Action.hideItem  ($$(emptyElId));
                },
                onAfterDelete : function(id){
                    hideEmptyTemplate(this, emptyElId);
                    selectPrevItem   (this, id);
                },
            
            }
        }

    ];

    return scrollViewSelected;
}







// create list move btns


function createMsg(){
    if(!($$("visibleColsMsg")) ){
        webix.message({
            id:"visibleColsMsg",
            type:"debug", 
            text:"Элемент не выбран",
        });
    }
}


let list;
let listSelect;

function findPullLength(listName){
    return Object.keys(listName.data.pull).length;
}

function listActions(type){

    const currList  = 
    type == "available" ? list       : listSelect;

    const otherList = 
    type == "available" ? listSelect : list;

    const btn = $$("visibleColsSubmit");
    
    const selectedItem  = currList.getSelectedItem();
    const selectedId    = currList.getSelectedId  ();

    if (selectedItem){
   
        otherList.add   (selectedItem);
        currList .remove(selectedId);
 
        if (type == "available"){
            const pullLength = findPullLength(otherList);
            if (!pullLength){
                Action.disableItem(btn);
            } else {
                Action.enableItem (btn); 
            }
        } else {
            const pullLength = findPullLength(currList);
    
            if (!pullLength){
                Action.disableItem(btn);
            } else {
                Action.enableItem (btn);
            }
        }

    } else {
        createMsg();
    }
}


function colsPopupSelect(action){
    list                  = $$("visibleList");
    listSelect            = $$("visibleListSelected");

    if ( action == "add"){
        listActions("available");

    } else if ( action == "remove" ){
        listActions("selected");

    }

}

function returnListBtns(){
    const addColsBtn = new Button({

        config   : {
            id       : "addColsBtn",
            hotkey   : "Shift+A",
            icon     : "icon-arrow-right",
            disabled : true,
            click    : function(){
                colsPopupSelect("add");
            },
        },
        titleAttribute : "Добавить выбранные колонки"
       
    }).transparentView();

    const removeColsBtn = new Button({

        config   : {
            id       : "removeColsBtn",
            hotkey   : "Shift+D",
            icon     : "icon-arrow-left",
            disabled : true,
            click    : function(){
                colsPopupSelect("remove");
            },
        },
        titleAttribute : "Убрать выбранные колонки"
       
    }).transparentView();

    const moveBtns = {
        rows:[
            addColsBtn,
            removeColsBtn,
        ]
    };

    return moveBtns;
}






//create move up btns

function setBtnSubmitState(state){
    const btnSubmit  = $$("visibleColsSubmit");
    const check      = btnSubmit.isEnabled();

    if (state == "enable" && !(check) ){
        btnSubmit.enable();
    } else if ( state == "disable" && check ){
        btnSubmit.disable();
    }
}

function colsMove(action){
    const list        = $$("visibleListSelected");
    const listElement = list.getSelectedId();
    
    if( listElement ){
        if (action == "up"){
            list.moveUp(listElement,1);
            setBtnSubmitState("enable");
        } else if (action == "down"){
            list.moveDown(listElement,1);
            setBtnSubmitState("enable");
        }   
    } else {
        createMsg();
    }
}


function returnMoveBtns(){

    const moveUpBtn = new Button({

        config   : {
            id       : "moveSelctedUp",
            hotkey   : "Shift+U",
            icon     : "icon-arrow-up",
            click   : function(){
                colsMove("up");
            },
        },

        titleAttribute : "Поднять выбраную колонку вверх"
       
    }).transparentView(); 

    const moveDownBtn = new Button({

        config   : {
            id       : "moveSelctedDown",
            hotkey   : "Shift+W",
            icon     : "icon-arrow-down",
            click   : function(){
                colsMove("down");
            },
        },

        titleAttribute : "Опустить выбраную колонку вниз"
       
    }).transparentView(); 

    const moveSelcted =  {
        cols : [
            moveUpBtn,
            moveDownBtn,
            {},
        ]
    };

    return moveSelcted;
}


// create save btn

function returnMinSize(table, containerWidth){
    const allCols = table.getColumns(true).length;
    const width  = containerWidth / allCols;

    return width.toFixed(2);
}


function visibleColsSubmitClick (){
 
    const list      = $$("visibleListSelected");
    const listPull  = list.data.pull;
    const listItems = Object.values(listPull);
    const values    = [];
    const table     = getTable();

    const emptySpace = 77;
    const containerWidth = window.innerWidth - $$("tree").$width - emptySpace; 


    function setLastColWidth(lastColumn,widthCols){
        const sumWidth     = widthCols.reduce((a, b) => a + b, 0);


        let widthLastCol   =  containerWidth - sumWidth;
        const minWidth     = 50;
        if (widthLastCol < minWidth){
            widthLastCol = returnMinSize(table, containerWidth);
        }

        lastColumn.width = Number(widthLastCol);

        values.push(lastColumn); 
    }


    try{
        const widthCols = [];
        const lastColumn = {};
 
        if (listItems.length){
            listItems.forEach(function(el){
                const positionElem = list.getIndexById(el.id);
                const lastCol      = list.getLastId();
             
                let colWidth;
    
                if ( el.id !== lastCol){
                    colWidth = table.getColumnConfig(el.column).width;
                  
                    if ( colWidth >= containerWidth ){
                        colWidth = returnMinSize();
                    }
                
                    widthCols.push(colWidth);
               
                    values.push({
                        column   : el.column, 
                        position : positionElem,
                        width    : Number(colWidth)
                    });
                } else {
                    lastColumn.column   = el.column;
                    lastColumn.position = positionElem;
                } 
     
          
    
            });
            setLastColWidth(lastColumn,widthCols);
        } else {
            setFunctionError(
                "array length is null", 
                logNameFile, 
                "visibleColsSubmitClick"
            ); 
        }
        
   

    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "visibleColsSubmitClick"
        );
    }
 
    postPrefsValues(values, true);

}

function returnSaveBtn(){
    const btnSaveState = new Button({

        config   : {
            id       : "visibleColsSubmit",
            hotkey   : "Shift+S",
            disabled : true,
            value    : "Сохранить состояние", 
            click    : function(){
                visibleColsSubmitClick();
            },
        },
        titleAttribute : "Изменить отображение колонок в таблице"
    
       
    }).maxView("primary");

    return btnSaveState;
}




//create search input

function searchColsListPress (){
    const list       = $$("visibleList");
    const search     = $$("searchColsList");
    const value      = search.getValue().toLowerCase();
    const emptyTempl = $$("visibleColsEmptyTempalte");
    let counter      = 0;
    try{
    
        list.filter(function(obj){
            const condition = obj.label.toLowerCase().indexOf(value) !== -1;

            if (condition){
                counter ++;
            }
    
            return condition;
        });

        if (counter == 0){
            Action.showItem(emptyTempl);
        } else {
            Action.hideItem(emptyTempl);
        }
      
    } catch(err){
        setFunctionError(
            err,
            logNameFile,
            "searchColsListPress"
        );
    }

}



function returnSearch(){
    const search = {   
        view        : "search", 
        id          : "searchColsList",
        placeholder : "Поиск (Alt+Shift+F)", 
        css         : "searchTable",
        height      : 42, 
        hotkey      : "alt+shift+f", 
        on          : {
            onTimedKeyPress : function(){
                searchColsListPress();
            }
        }
    };

    return search;
}



// create resize cols

function setColsWidthStorage(table){
    table.attachEvent("onColumnResize",function(id, newWidth, oldWidth, action){
        if (action){
           
            const cols   = table.getColumns();
            const values = [];

            if (cols.length){
                cols.forEach(function(el){

                    values.push({
                        column  : el.id, 
                        position: table.getColumnIndex(el.id),
                        width   : el.width.toFixed(2)
                    });
                });
                postPrefsValues(values);
            } else {
                setFunctionError(
                    "array length is null", 
                    "table/columnsSettings/columnsWidtn", 
                    "visibleColsSubmitClick"
                ); 
            }
         
        }
    });     
}




//create drop cols


function createValues(table){
    const cols = table.getColumns();
    const values = [];

    if (cols.length){
        cols.forEach(function(col, i){
            values.push({
                column   : col.id, 
                position : i,
                width    : Number(col.width)
            });
        });
    } else {
        setFunctionError(
            "array length is null", 
            "table/columnsSettings/onAfterColumnDrop", 
            "visibleColsSubmitClick"
        ); 
    }

    return values;
}

function dropColsSettings(table){
 
    table.attachEvent("onAfterColumnDrop", function(){
        const values = createValues(table);
        postPrefsValues(values, false, false);
       
    });
}



//create modify cols data
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


    if (sentVals && sentVals.columns){
        const vals = sentVals.columns.values;
        if (isArray(vals, logNameFile, "setSize")){
            vals.forEach(function(el){
                setColWidth(el);
            });
        }
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
                    setUpdateCols (prefs.columns);
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
                    setUpdateCols (prefs.columns);
                }

            }
        }
         
    });

    Action.destructItem($$("popupVisibleCols"));
}

function getUserprefsData(values, visCol){
    const id      = getItemId();

    const name  = `userprefs.name+=+%27fields/${id}%27`;
    const owner = `userprefs.owner+=+${userData.id}`;

    new ServerData({
        id : `smarts?query=${name}+and+${owner}&limit=80&offset=0`,
       // id : `smarts?query=userprefs.name+=+%27visibleColsPrefs_${id}%27+and+${owner}&limit=80&offset=0`,
    }).get().then(function(data){

        if (data){
            const content = data.content;

            if (content && content.length){ // запись уже существует
               
                const columnsData = content[0];

                if (columnsData){
                    const prefs       = JSON.parse(columnsData.prefs);

                    if (prefs){
                        prefs.columns = values;
                        columnsData.prefs = prefs;
                    }
    
                    saveExistsTemplate(columnsData, columnsData.id, visCol);
                }
          
            } else {

                const sentObj = {
                    name  : `fields/${id}`,
                    owner : userData.id,
                    prefs : {
                        columns:values
                    },
                };

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

    // const sentObj = {
    //     name  : `fields/${id}`,
    //     owner : userData.id,
    //     prefs : sentVals,
    // };


    getUserprefsData(sentVals, visCol);

}



//create onColumnResize
let cols;
let lengthCols;

function returnCol(index){
    const currIndex = lengthCols - index;
    return cols[currIndex];
}

function returnSumWidthCols(){
    let sum = 0;
    
    if (cols && cols.length){
        cols.forEach(function(col){
            sum += col.width;
        });
    }
 
    return sum;
}

function setNewWidth(table){
    const lastCol      = returnCol(1);
    const scrollWidth  = 17;
    const widthTable   = table.$width - scrollWidth;
    const sumWidthCols = returnSumWidthCols();
    
    if (sumWidthCols < widthTable && lastCol){
        const different = widthTable - sumWidthCols;
        const newWidth  = lastCol.width + different;
        
        table.setColumnWidth(lastCol.id, newWidth);

    }
}


function columnResize(table){

    table.attachEvent("onColumnResize", function(id, newWidth, oldWidth, userAction){
  
        cols       = table.getColumns();
        lengthCols = cols.length;
  
        if (userAction){
            const lastResizer = 2;
            const isExists    = lengthCols - lastResizer;
            const prevCol     = returnCol(lastResizer);
         
        //    if ( isExists > -1 && prevCol.id == id){ // это последняя колонка
                setNewWidth(table);
               
           // }
        }

    });
}

export {
    createPopup,
    setColsWidthStorage,
    dropColsSettings,
    columnResize
};