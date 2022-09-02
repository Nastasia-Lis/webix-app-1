import {removeElements} from "./login.js";
import {notify} from "./editTableForm.js";
import {setUserLocation} from "./userSettings.js";
import {tableNames} from "./login.js";
import {userLocation} from "./header.js";

export function resetTimer (){

    let t;
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer;      
    window.ontouchstart = resetTimer;
    window.onclick = resetTimer;     
    window.onkeypress = resetTimer;   
    window.addEventListener('scroll', resetTimer, true); 

    function logout() {
        setUserLocation(tableNames,userLocation);
        webix.ajax().post("/init/default/logout/",{
            
            success:function(text, data, XmlHttpRequest){
                

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
                notify ("debug","Превышено время бездействия", false, -1);
            },
            error:function(text, data, XmlHttpRequest){
                notify ("error","Не удалось выполнить выход",true);
            }
        });
  
    }

    function resetTimer() {
        clearTimeout(t);
        t = setTimeout(logout, 600000); // 600000
    };
    
}