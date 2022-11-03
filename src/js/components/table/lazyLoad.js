import { createTableRows } from "../../blocks/getContent/getInfoTable.js";

const limitLoad   = 80;

function sortTable(table){
    table.attachEvent("onAfterSort", function(id,sortType,colType){
        const sortInfo = {
            idCol : id,
            type  : sortType
        };
        table.config.sort = sortInfo;
    });
}

function scrollTableLoad(table){
    table.attachEvent("onScrollY", function(){
        const table        = this;
        const scrollState  = table.getScrollState();
        const maxHeight    = table._dtable_height;
        const offsetHeight = table._dtable_offset_height;
    
    
    
        if (maxHeight - scrollState.y == offsetHeight){ 
    
            const tableId           = table.config.idTable;
            const oldOffset         = table.config.offsetAttr;
    
            const newOffset         = oldOffset + limitLoad;
    
            table.config.offsetAttr = newOffset;
            table.refresh();
    
            createTableRows ("table",tableId, oldOffset);
        }
         
    });
}


export{
    sortTable,
    scrollTableLoad
};