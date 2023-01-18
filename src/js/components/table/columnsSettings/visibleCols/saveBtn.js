import { Button }           from "../../../../viewTemplates/buttons.js";
import { setFunctionError } from "../../../../blocks/errors.js";
import { postPrefsValues }  from "../userprefsPost.js";
import { getTable }         from "../../../../blocks/commonFunctions.js";

const logNameFile = "table => columnsSettings => visibleCols => saveBtn";

function visibleColsSubmitClick (){
 
    const list      = $$("visibleListSelected");
    const listPull  = list.data.pull;
    const listItems = Object.values(listPull);
    const values    = [];
    const table     = getTable();

    const containerWidth = window.innerWidth - $$("tree").$width - 77; 

    function returnMinSize(){
        const allCols = table.getColumns(true).length;
        const width  = containerWidth / allCols;

        return width.toFixed(2);
    }

    function setLastColWidth(lastColumn,widthCols){
        const sumWidth     = widthCols.reduce((a, b) => a + b, 0);


        let widthLastCol   =  containerWidth - sumWidth;

        if (widthLastCol < 50){
            widthLastCol = returnMinSize();
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


export {
    returnSaveBtn
};