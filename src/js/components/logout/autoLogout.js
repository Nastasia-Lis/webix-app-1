///////////////////////////////

// Автоматический выход из системы

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { logout }           from "./common.js";
import { setFunctionError } from "../../blocks/errors.js";


function resetTimer (){

    let timeout;

    window.onload       = resetTimer;
    window.onmousemove  = resetTimer;
    window.onmousedown  = resetTimer;      
    window.ontouchstart = resetTimer;
    window.onclick      = resetTimer;     
    window.onkeypress   = resetTimer;   
    window.addEventListener('scroll', resetTimer, true); 

    function resetTimer() {
        try {
            if (window.location.pathname !== "/index.html"        && 
                window.location.pathname !== "/"                  && 
                window.location.pathname !== "/init/default/spaw" ){
                
                clearTimeout(timeout);
                timeout = setTimeout(logout, 600000); // 600000
            }
        } catch (err){
            setFunctionError(err, "autoLogout", "resetTimer");
        }
    }
    
}


export {
    resetTimer
};