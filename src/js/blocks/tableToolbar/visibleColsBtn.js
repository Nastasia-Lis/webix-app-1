import { visibleColsButtonClick }     from "../columnsSettings/visibleColumns.js";
import { Button }                     from "../../viewTemplates/buttons.js";

function toolbarVisibleColsBtn(idTable){
    const idVisibleCols = idTable + "-visibleCols";

    const visibleCols = new Button({
    
        config   : {
            id       : idVisibleCols,
            hotkey   : "Ctrl+Shift+A",
            disabled : true,
            icon     : "icon-columns",
            click    : function(){
                visibleColsButtonClick(idTable);
            },
        },
        titleAttribute : "Показать/скрыть колонки"
    
       
    }).transparentView();

    return visibleCols;
}


export {
    toolbarVisibleColsBtn
};