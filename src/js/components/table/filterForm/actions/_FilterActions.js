import { visibleField }   from "./visibleField.js";
import { clearSpace }     from "./clearSpace.js";
import { getFilterState } from "./getFilterState.js";
import { setState }       from "./setStateToStorage.js";

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

    static getAllChilds (){
        return Object.values(visibleInputs);
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

    static setFieldState(visible, cssClass, element){
        visibleField (visible, cssClass, element);
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
    
    
}

export {
    Filter
};