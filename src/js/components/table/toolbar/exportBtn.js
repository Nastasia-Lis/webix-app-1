 
///////////////////////////////

// Кнопка, экспортирующая таблицу

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { setLogValue }              from "../../logBlock.js";
import { setFunctionError }         from "../../../blocks/errors.js";
import { Button }                   from "../../../viewTemplates/buttons.js";

function exportToExcel(idTable){
    try{
        webix.toExcel(idTable, {
            filename    : "Table",
            filterHTML  : true,
            styles      : true
        });
        setLogValue("success", "Таблица сохранена");

    } catch (err) {   
        setFunctionError(err, "toolbarTable", "exportToExcel");
    }
}

function toolbarDownloadButton(idTable, visible){
    const idExport = idTable + "-exportBtn";

    const exportBtn = new Button({
    
        config   : {
            id       : idExport,
            hotkey   : "Ctrl+Shift+Y",
            hidden   : visible, 
            icon     : "icon-arrow-circle-down",
            click    : function(){
                exportToExcel(idTable);
            },
        },
        titleAttribute : "Экспорт таблицы"
    
       
    }).transparentView();
    
    return exportBtn;
}


export {
    toolbarDownloadButton
};