import {setFunctionError} from "../../blocks/errors.js"; 

function setStateFilterBtn(){
    const primaryClass   = "webix-transparent-btn--primary";
    const secondaryClass = "webix-transparent-btn";
    try{
        const btnClass = document.querySelector(".webix_btn-filter");
        if (btnClass && btnClass.classList.contains (primaryClass)){
           
            btnClass.classList.add   (secondaryClass);
            btnClass.classList.remove(primaryClass);
        }
    } catch (err){
        setFunctionError(err,"sidebar","setStateFilterBtn");
    }
}

export {
    setStateFilterBtn
};