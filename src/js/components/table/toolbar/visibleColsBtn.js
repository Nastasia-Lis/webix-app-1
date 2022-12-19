
import { Button }                   from "../../../viewTemplates/buttons.js";
import { Action, getTable }         from "../../../blocks/commonFunctions.js";
import { setFunctionError }         from "../../../blocks/errors.js";
import { createPopup }              from "../columnsSettings/visibleCols/_layout.js";

const logNameFile = "table => toolbar => visibleColsBtn";

function createSpace(){
    const table    = getTable();
    const list     = $$("visibleList");
    const listPull = Object.values(list.data.pull);
    const cols     = table.getColumns(); 
    
    function findRemoveEl(elem){
        let check = false;

        cols.forEach(function(item,i){
            
            if (elem == item.id){
                check = true;
            }

        });

 
        return check;
    }

    
    function removeListItem(){

        try{
            listPull.forEach(function(el){
                if (findRemoveEl(el.column)){
                    list.remove(el.id);
                }

            });
        } catch (err){
            setFunctionError(
                err,
                logNameFile,
                "createSpace => removeListItem"
            );
        }  
    }

    function addListSelectedItem(){
        const viewList = $$("visibleListSelected");
        const emptyEl  = $$("visibleColsEmptyTempalteSelected");
        
        if (cols.length){
            Action.hideItem(emptyEl);
        }
        try{
            cols.forEach(function(col){
                viewList.add({
                    column  :col.id,
                    label   :col.label,
                });
            });
        } catch (err){
            setFunctionError(
                err,
                logNameFile,
                "createSpace => addListSelectedItem"
            );
        } 
    }

  //  if (listPull.length !== cols.length){
    if (listPull.length){
        removeListItem();
        addListSelectedItem();
    }


}


function createListItems(idTable){

    const currTable  = $$(idTable);
    let columns      = currTable.getColumns(true);

    try{
        columns        = currTable.getColumns(true);
        const sortCols = _.sortBy(columns, "label");

        sortCols.forEach(function(col){
            
            if(col.css !== "action-column" && !col.hiddenCustomAttr ){
      
                $$("visibleList").add({
                    column  :col.id,
                    label   :col.label,
                });
                
            }
            
        });

    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "getCheckboxArray"
        );
    }
    
}

function  visibleColsButtonClick(idTable){
    createPopup    ();
    createListItems(idTable);

    Action.hideItem($$("visibleColsEmptyTempalte"));
    Action.showItem($$("popupVisibleCols"));

    createSpace    ();
}

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