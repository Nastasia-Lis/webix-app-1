import { visibleField }  from "./visibleField.js";
import { clearSpace }    from "./clearSpace.js";


const visibleInputs = {};

class FilterPull {
    static pushInPull (key, el){
        visibleInputs[key].push(el);
      
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

    
}

export {
    Filter
};