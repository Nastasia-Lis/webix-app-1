import { logout }           from "./common.js";
import { setFunctionError } from "../errors.js";

function resetTimer (){

    let t;
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer;      
    window.ontouchstart = resetTimer;
    window.onclick = resetTimer;     
    window.onkeypress = resetTimer;   
    window.addEventListener('scroll', resetTimer, true); 

    function resetTimer() {
        try {
            if (window.location.pathname !== "/index.html"        && 
                window.location.pathname !== "/"                  && 
                window.location.pathname !== "/init/default/spaw" ){
                
                clearTimeout(t);
                t = setTimeout(logout, 600000); // 600000
            }
        } catch (err){
            setFunctionError(err,"autoLogout","resetTimer");
        }
    }
    
}


export {
    resetTimer
};