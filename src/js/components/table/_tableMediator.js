import { Action }                     from "../../blocks/commonFunctions.js";
import { createTable }                from "./createSpace/generateTable.js";
import { returnLayoutForms, 
        returnLayoutTables }          from "./_layout.js";
import { sortTable, scrollTableLoad } from "./lazyLoad.js";
import { onResizeTable }              from "./onResize.js";
import { columnResize }               from "./onColumnResize.js";
import { setColsWidthStorage }        from "./columnsSettings/columnsWidth.js"
import { setFunctionError }           from "../../blocks/errors.js";

import { EditForm }                   from "./editForm/setState.js";
import { filterFormDefState }         from "./filterForm/setDefaultState.js";
import { toolsDefState }              from "./formTools/setDefaultState.js";

import { Button }                     from "../../viewTemplates/buttons.js";

const logNameFile = "table => _tableMediator";




class Tables {
    constructor (){
        this.name = "tables";
    }

    create(){
        try{
            if (!$$(this.name)){

                $$("container").addView(
                    returnLayoutTables(this.name),
                5);

                const tableElem = $$("table");
                sortTable          (tableElem);
                onResizeTable      (tableElem);
                scrollTableLoad    (tableElem);
                setColsWidthStorage(tableElem);
                columnResize       (tableElem);
            }
        } catch (err){
            setFunctionError(
                err, 
                logNameFile, 
                "createTables"
            );
        }
    }

    showView(){
        Action.showItem($$(this.name));   
    }

    load(id){
        createTable("table", id);
    }

    defaultState(type){
        if (type == "edit"){
            EditForm.default();
        } else if (type == "filter"){
            filterFormDefState();
        } else {
            EditForm.defaultState();
            filterFormDefState   ();
        }
  
       
    }

}


class Forms {
    constructor (){
        this.name = "forms";
    }

    create(){
        try{
            if (!$$(this.name)){
                $$("container").addView(
                    returnLayoutForms(this.name),
                6);

                const tableElem = $$("table-view");

                sortTable          (tableElem);
                onResizeTable      (tableElem);
                setColsWidthStorage(tableElem);
                columnResize       (tableElem);
           
            }
        } catch (err){
            setFunctionError(
                err,
                logNameFile,
                "createForms"
            );
        }
    }

    showView(){
        Action.showItem($$(this.name));   
    }

    load(id){
        createTable("table-view", id);
    }

    defaultState(){
        toolsDefState ();
        Button.transparentDefaultState();
    }


}

export {
    Tables,
    Forms
};