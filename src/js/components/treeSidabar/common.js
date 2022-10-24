import {setFunctionError} from "../../blocks/errors.js"; 

function setStateFilterBtn(){
    try{
        const btnClass = document.querySelector(".webix_btn-filter");
        if (btnClass && btnClass.classList.contains ("webix-transparent-btn--primary")){
           
            btnClass.classList.add   ("webix-transparent-btn");
            btnClass.classList.remove("webix-transparent-btn--primary");
        }
    } catch (err){
        setFunctionError(err,"sidebar","setStateFilterBtn");
    }
}

export {
    setStateFilterBtn
};