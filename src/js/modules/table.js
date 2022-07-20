import {gridColumns,tableDataOne} from './data/data.js';
import {selected} from './sidebar.js';

export function table () {
    return {
        view:"datatable",
        id:"tableInfo", 
        data:selected,
        css:"webix_table-style",
        resizeColumn: true,
        autoConfig: true,
        pager:"pagerTable",
        scroll:"x",
        minHeight:350,
        footer: true,
        //footer:{content:"summColumn"} 
        maxWidth:780,
        on:{
            onAfterSelect(id){
                let values = $$("tableInfo").getItem(id);
                $$("editForm").setValues(values);
                $$("btnSave").show();
                $$("btnAdd").hide();
            },
            onAfterLoad:function(){
                if (!this.count())
                  this.showOverlay("Ничего не найдено");
            }
        }
    };
    
}


