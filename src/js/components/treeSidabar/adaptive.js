
import { setFunctionError } from "../../blocks/errors.js";


const logNameFile = "treeSidebar => adaptive";

function setAdaptiveState(){
    try{
        if (window.innerWidth < 850 ){
            $$("tree").hide();
        }
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "setAdaptiveState"
        );
    }
}

export {
    setAdaptiveState
};