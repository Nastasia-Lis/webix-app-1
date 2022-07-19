import {gridColumns,tableDataOne} from './data/data.js';
import {selected} from './sidebar.js';
export function table (idTable, srcTable, gridTable) {
    function addNewElement(){
        const table = $$("tableInfo"); 
        const idNewElem = table.add({"product":"","available":"","date":"","color":"","code":"","price":"",}); 
        table.showItem(idNewElem); 
    }

    function removeElement(idElement){
        $$("tableInfo").remove(idElement);
    }

    return {
        view:"datatable",
        id:"tableInfo", 
        data:tableDataOne,
        resizeColumn: true,
        autoConfig: true,
        pager:"pagerTable",
        //columns: gridColumns

        on:{
            onAfterSelect(id){
                let values = $$("tableInfo").getItem(id);
                $$("editForm").setValues(values)
            }
        }



    };
}


