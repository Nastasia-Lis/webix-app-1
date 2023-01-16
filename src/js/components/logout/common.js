
import { setStorageData }                from "../../blocks/storageSetting.js";



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
    logout,
    checkNotAuth,
};