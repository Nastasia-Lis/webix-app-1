import {tablesArray} from './data/data.js';
import {tableId, pagerId,editFormId, saveBtnId, addBtnId} from './setId.js';

import {createFields } from './editTable.js';

export function table () {
    return {
        view:"datatable",
        id: tableId,
        data:tablesArray[0].content,
        css:"webix_table-style webix_header_border webix_data_border",
        resizeColumn: true,
        autoConfig: true,
        pager:pagerId,
        minHeight:300,
        footer: true,
        //footer:{content:"summColumn"} 
        minWidth:500, 
        minColumnWidth:120,
        on:{
            onAfterSelect(id, ev){
                let values = $$(tableId).getItem(id); 
                $$(editFormId).setValues(values);
                $$(saveBtnId).show();
                $$(addBtnId).hide();


            },

            onAfterLoad:function(){
                if (!this.count())
                  this.showOverlay("Ничего не найдено");
            },

        }
    };
    
}


