import {gridColumns,tableDataOne} from './data/data.js';
import {selected} from './sidebar.js';

export function table () {
    return {
        view:"datatable",
        id:"tableInfo", 
        data:selected,
        resizeColumn: true,
        autoConfig: true,
        pager:"pagerTable",
        on:{
            onAfterSelect(id){
                let values = $$("tableInfo").getItem(id);
                $$("editForm").setValues(values);
            }
        }



    };
}


