import { Action, getTable }           from "../../blocks/commonFunctions.js";
import { createTable }                from "./createSpace/generateTable.js";
import { returnLayoutForms, 
        returnLayoutTables }          from "./_layout.js";
import { sortTable, scrollTableLoad } from "./lazyLoad.js";
import { onResizeTable }              from "./onResize.js";
import { columnResize }               from "./onColumnResize.js";
import { setColsWidthStorage }        from "./columnsSettings/columnsWidth.js";
import { dropColsSettings }           from "./columnsSettings/onAfterColumnDrop.js";
import { setFunctionError }           from "../../blocks/errors.js";


import { EditForm }                   from "./editForm/editFormMediator/editFormClass.js";
import { Filter }                     from "./filterForm/actions/_FilterActions.js";

import { filterFormDefState }         from "./filterForm/setDefaultState.js";
import { toolsDefState }              from "./formTools/setDefaultState.js";

import { Button } from "../../viewTemplates/buttons.js";

const logNameFile = "table => _tableMediator";

class Tables {
    constructor (){
        this.name = "tables";

        this.components = {
            editForm : new EditForm()
        };
    }

    create(){
        try{
            if (!$$(this.name)){

                $$("container").addView(
                    returnLayoutTables(this.name),
                5);

                $$("filterEmptyTempalte").attachEvent("onViewShow",function(){
                    Action.hideItem($$("templateInfo"));
                });

                const tableElem = $$("table");
                sortTable          (tableElem);
                onResizeTable      (tableElem);
                scrollTableLoad    (tableElem);
                setColsWidthStorage(tableElem);
                columnResize       (tableElem);
                dropColsSettings   (tableElem);
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

    showExists(id){
        const table = getTable().config.id;
        createTable(table, id, true);
    }

    load(id){
       // const table = getTable().config.id;
        createTable("table", id);
    }

    get editForm (){
        return EditForm;
    }

    get filter (){
        return Filter;
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

    setSize(full){
        const containerWidth = $$("flexlayoutTable").$width;
        const table          = $$("table");
        const emptySpace     = 30;
    
        if (full){
            const width        = containerWidth - emptySpace;
            table.config.width = width;

            table.resize();
            console.log(table.$width,width)
        } else {

            const formWidth  = $$("table-editForm").$width;
            const tableWidth = table.$width;
       
            const difference = containerWidth - formWidth - emptySpace;
            
            if (tableWidth > difference){
                table.config.width = difference;
                table.resize();
    
            }
            
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

                onResizeTable      (tableElem);
                setColsWidthStorage(tableElem);
                columnResize       (tableElem);
                dropColsSettings   (tableElem);
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