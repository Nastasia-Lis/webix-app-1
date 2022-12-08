import { Button }            from "../../../../viewTemplates/buttons.js";
import { setFunctionError }  from "../../../../blocks/errors.js";
import { setLogValue }       from "../../../logBlock.js";
import { modalBox }          from "../../../../blocks/notifications.js";
import { Action, getTable }  from "../../../../blocks/commonFunctions.js";
import { postPrefsValues }   from "../userprefsPost.js";

let table;
let values;
const logNameFile = "table => columnsSettings => visibleCols => clearBtn";


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

function returnPosition(column){
    let position;
    const pull = table.data.pull[1];
   
    if (pull){
        const defaultColsPosition = Object.keys(pull);
        
        defaultColsPosition.forEach(function(el, i){
            if (el == column){
                position = i;
            }
        });

    }

    return position;
}

function showCols(){
    const cols = table.getColumns(true);
    try{
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
    } catch(err){
        setFunctionError(
            err,
            logNameFile,
            "clearBtnColsClick => showCols"
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


export {
    returnClearBtn
};