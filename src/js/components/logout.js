///////////////////////////////
//
// Auto logout          (create auto logout)
//
// Общая логика logout  (create logout)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////


import { setStorageData }   from "../blocks/storageSetting.js";
import { setFunctionError } from "../blocks/errors.js";

//create auto logout
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

                const time = 600000;
                timeout = setTimeout(logout, time); // 600000
            }
        } catch (err){
            setFunctionError(err, "autoLogout", "resetTimer");
        }
    }
    
}



//create logout
async function logout() {

    Backbone.history.navigate("logout?auto=true", { trigger:true});
  
}


function checkNotAuth (err){
 
    let notAuth = false;
 
    if (err.status               === 401                  && 
        window.location.pathname !== "/index.html"        && 
        window.location.pathname !== "/init/default/spaw/"){
        
        notAuth = true;
        
        let params    = new URLSearchParams(document.location.search);
        let autoParam = params.get("auto");

        const prefs = {
            href : window.location.href
        };

        if (!autoParam){
            setStorageData ("outsideHref", JSON.stringify(prefs) );
        }

    }

    return notAuth;
}

export {
    checkNotAuth,
    resetTimer
};