import { visibleField }     from "./visibleField.js";
import { clearSpace }       from "./clearSpace.js";
import { getFilterState }   from "./getFilterState.js";
import { setState }         from "./setStateToStorage.js";
import { resetTable }       from "./resetTable.js";
import { setFunctionError } from "../../../../blocks/errors.js";
import { Action, 
        getTable }          from "../../../../blocks/commonFunctions.js";

const visibleInputs = {};

class FilterPull {
    static pushInPull (key, el){
        visibleInputs[key].push(el);
      
    }

    static getIndex(){

    }

    static clearItem (key){
        visibleInputs[key] = [];
    }


    static getItem (key){
        return visibleInputs[key];
    }

    static getAllChilds (isConcat){
        const values =  Object.values(visibleInputs);
        
        function concat(arr) {
            return [].concat(...arr);
        }

        if (isConcat){
            return concat(values);
        } else{
            return values;
        }
   
    }

   

    static getIndexFilters(){
        const container = $$("inputsFilter");
        const result    = [];
        if(container){
            const childs = container.getChildViews();
            if (childs.length){
                childs.forEach(function(el, i){
                    result[el.config.idCol] = i;
                  
                });
            }
           
        }

        return result;
    }


    static getAll (){
        return visibleInputs;
    }

    static getItems (){
        return Object.keys(visibleInputs);
    }


    static lengthItem(key){
        return visibleInputs[key].length;
    }

    static lengthPull (){
        const length = this.getItems().length;
        return length;
    }

    
    static clearAll(){
        const keys = this.getItems();
        if (keys.length){
            keys.forEach(function(key){
                delete visibleInputs[key];
            });
        }  
    }

    static removeItemChild(key, child){
        const item = this.getItem(key);

        if (item.length){
            item.forEach(function(id, i){
                if (id == child){
                    item.splice(i, 1);
                }
            });
        } 
       
    }
   
    static spliceChild (key, pos, child){
        visibleInputs[key].splice(pos, 0, child);
    }

}

class Filter extends FilterPull {

    static addClass(elem, className){
        if (!(elem.classList.contains(className))){
            elem.classList.add(className);
        }
    }
    
    static removeClass(elem, className){
        if (elem.classList.contains(className)){
       
            elem.classList.remove(className);
           
        }
    }

    static setFieldState(visible, cssClass){
        visibleField (visible, cssClass);
    }

    static clearFilter(){
        clearSpace();
    }

    static getFilter(){
        return getFilterState();
    }

    static setStateToStorage(){
        setState();
    }

    static setActiveTemplate(val){
        $$("filterTableForm").config.activeTemplate = val;
    }
    
    static getActiveTemplate(){
        return $$("filterTableForm").config.activeTemplate;
    }

    static showApplyNotify(show = true){
        const table   = getTable();

        if (table){
            const tableId = table.config.id;
            const item    = $$(tableId + "_applyNotify");
     
            if (show){
                Action.showItem(item); 
            } else {
                Action.hideItem(item); 
            }
        }
      
    
    }

    static async resetTable(){
        return await resetTable();
    }

    static hideInputsContainers(visibleInputs){
        const table = getTable();
        const cols  = table.getColumns();
        if (cols && cols.length){
            cols.forEach(function(col){
                const found = visibleInputs.find(element => element == col.id);
        
                if (!found){
                    const htmlElement = document.querySelector("." + col.id ); 
                    Filter.addClass   (htmlElement, "webix_hide-content");
                    Filter.removeClass(htmlElement, "webix_show-content");
                }
            });
        } 
        
    }

    static enableSubmitButton(){
        const btn = $$("btnFilterSubmit");
   
        const inputs   = this.getAllChilds (true);
        let fullValues = true;
    
        if (inputs.length){
            inputs.forEach(function(input){
                const isValue = $$(input).getValue();
                if (!isValue && fullValues){
                    fullValues = false;
                }
            });
    
            if (fullValues){
                Action.enableItem (btn);
            } else {
                Action.disableItem(btn);
            }
        } 
    }
    
    
}

export {
    Filter
};