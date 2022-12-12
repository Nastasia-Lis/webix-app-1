import { visibleField }     from "./visibleField.js";
import { clearSpace }       from "./clearSpace.js";
import { getFilterState }   from "./getFilterState.js";
import { setState }         from "./setStateToStorage.js";
import { Action, getTable } from "../../../../blocks/commonFunctions.js";

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
            childs.forEach(function(el, i){
                result[el.config.idCol] = i;
              
            });
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
        if (keys){
            keys.forEach(function(key){
                delete visibleInputs[key];
            });
        }
    }

    static removeItemChild(key, child){
        const item = this.getItem(key);

        item.forEach(function(id, i){
            if (id == child){
                item.splice(i, 1);
            }
        });
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
  
        const tableId = getTable().config.id;
        const item    = $$(tableId + "_applyNotify");
 
        if (show){
            Action.showItem(item); 
        } else {
            Action.hideItem(item); 
        }
    
    }
    
    
}

export {
    Filter
};