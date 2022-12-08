import { setFunctionError }         from "../../../../blocks/errors.js";
import { Filter }                   from "./_FilterActions.js";

const logNameFile   = "filterForm => getFilterState";

let template;

function isParent(el){
    const config = el.config;
    const name   = config.columnName;
    const parent = name + "_filter";
    const id     = config.id;

    let check    = null;

    if (parent !== id){
        check = name;
    } else {

    }

    return check;
}

function pushValues(id, logic, index){

    const btn = $$(id + "-btnFilterOperations");

    const operation = btn.getValue();
    const value     = $$(id).getValue();
    const parent    = isParent($$(id));

    template.values.push({
        id          : id, 
        value       : value,
        operation   : operation,
        logic       : logic,
        parent      : parent,
        index       : index
    });

}

function setOperation(arr){
    arr.forEach(function(el, i){
   
        
        try{
            const segmentBtn = $$( el + "_segmentBtn" );

            let logic = null;

            if (segmentBtn.isVisible()){
                logic = segmentBtn.getValue();
            }
 
            pushValues(el, logic,  i);

        } catch(err){
            setFunctionError(
                err,
                logNameFile,
                "setOperation"
            );
        }
    });
}


function getFilterState(){
    const keys       = Filter.getItems  ();
    const keysLength = Filter.lengthPull();

    
    template           = {
        values : []
    };

   
    for (let i = 0; i < keysLength; i++) {   
        const key = keys[i];
        setOperation(Filter.getItem(key));
    }


    return template;
}


export {
    getFilterState
};