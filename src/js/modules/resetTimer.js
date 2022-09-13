import {removeElements} from "./login.js";
import {notify} from "./editTableForm.js";
import {setUserLocation} from "./userSettings.js";
import {tableNames} from "./login.js";

import {catchErrorTemplate,ajaxErrorTemplate} from "./logBlock.js";


let hrefPrevAutoLogout = window.location.href;


function resetTimer (){

    let t;
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer;      
    window.ontouchstart = resetTimer;
    window.onclick = resetTimer;     
    window.onkeypress = resetTimer;   
    window.addEventListener('scroll', resetTimer, true); 

    function logout() {
       // let userLocation = window.location.href
   //     setUserLocation(tableNames,userLocation);
      // console.log(userLocation)
        
        webix.ajax().post("/init/default/logout/",{
            
            success:function(text, data, XmlHttpRequest){
                try {
                    if($$("popupFilterEdit")&&$$("popupFilterEdit").isVisible()){
                        $$("popupFilterEdit").hide();
                    }
                    if($$("popupPrevHref")&&$$("popupPrevHref").isVisible()){
                        $$("popupPrevHref").hide();
                    }
                    history.back();
                    removeElements();
                    $$("webix__none-content").show();
                    $$("tree").clearAll();
                    notify ("debug","Превышено время бездействия", false);
                } catch (error){
                    console.log(error);
                    catchErrorTemplate("008-000", error);

                }
            },
            error:function(text, data, XmlHttpRequest){
                notify ("error","Не удалось выполнить выход",true);
                ajaxErrorTemplate("008-006",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);

            }
        }).catch(error => {
            console.log(error);
            ajaxErrorTemplate("008-006",error.status,error.statusText,error.responseURL);
        });
  
    }

    function resetTimer() {
        try {
            clearTimeout(t);
            t = setTimeout(logout, 600000); // 600000
        } catch (error){
            console.log(error);
            catchErrorTemplate("008-000", error);

        }
    };
    
}


export {
    resetTimer
};