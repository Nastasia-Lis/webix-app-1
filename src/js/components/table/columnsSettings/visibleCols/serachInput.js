import { Action }            from "../../../../blocks/commonFunctions.js";
import { setFunctionError }  from "../../../../blocks/errors.js";


const logNameFile = "table => columnsSettings => visibleCols => searchInput";

function searchColsListPress (){
    const list       = $$("visibleList");
    const search     = $$("searchColsList");
    const value      = search.getValue().toLowerCase();
    const emptyTempl = $$("visibleColsEmptyTempalte");
    let counter      = 0;
    try{
    
        list.filter(function(obj){
            const condition = obj.label.toLowerCase().indexOf(value) !== -1;

            if (condition){
                counter ++;
            }
    
            return condition;
        });

        if (counter == 0){
            Action.showItem(emptyTempl);
        } else {
            Action.hideItem(emptyTempl);
        }
      
    } catch(err){
        setFunctionError(
            err,
            logNameFile,
            "searchColsListPress"
        );
    }

}



function returnSearch(){
    const search = {   
        view        : "search", 
        id          : "searchColsList",
        placeholder : "Поиск (Alt+Shift+F)", 
        css         : "searchTable",
        height      : 42, 
        hotkey      : "alt+shift+f", 
        on          : {
            onTimedKeyPress : function(){
                searchColsListPress();
            }
        }
    };

    return search;
}

export{
    returnSearch
};