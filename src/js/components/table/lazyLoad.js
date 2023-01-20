 
///////////////////////////////

// Загрузка постов по скроллу

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { createTableRows } from './createSpace/rows/createRows.js';

const limitLoad   = 80;


function refreshTable(table){
    const tableId           = table.config.idTable;
    const oldOffset         = table.config.offsetAttr;

    const newOffset         = oldOffset + limitLoad;

    table.config.offsetAttr = newOffset;
    table.refresh();

    createTableRows ("table", tableId, oldOffset);
}


function sortTable(table){
    table.attachEvent("onAfterSort", function(id, sortType){
        
        const sortInfo = {
            idCol : id,
            type  : sortType
        };

        table.config.sort       = sortInfo;
        table.config.offsetAttr = 0;


        webix.storage.local.put(
            "tableSortData", 
            sortInfo
        );

        table.clearAll();
        refreshTable(table);
        
    });
}


function scrollTableLoad(table){
    table.attachEvent("onScrollY", function(){
        const table        = this;
        const scrollState  = table.getScrollState();
        const maxHeight    = table._dtable_height;
        const offsetHeight = table._dtable_offset_height;
 
        if (maxHeight - scrollState.y == offsetHeight){ 
            refreshTable(table);
        }
      

    });
}


export{
    sortTable,
    scrollTableLoad
};