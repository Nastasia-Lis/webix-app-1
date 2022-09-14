import {removeElements} from "../components/login.js";
import {setLogValue,catchErrorTemplate,ajaxErrorTemplate} from "./logBlock.js";
import {setUserLocation} from "./storageSetting.js";

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
        console.log(window.location.href,"wr")
        setUserLocation ("",window.location.href);
        console.log("logout1")
        webix.ajax().post("/init/default/logout/",{
            
            success:function(text, data, XmlHttpRequest){
                try {
                    if($$("popupFilterEdit")&&$$("popupFilterEdit").isVisible()){
                        $$("popupFilterEdit").hide();
                    }
                    if($$("popupPrevHref")&&$$("popupPrevHref").isVisible()){
                        $$("popupPrevHref").hide();
                    }
                  //  history.back();
                    window.location.reload()
                    removeElements();
                    $$("webix__none-content").show();
                    $$("tree").clearAll();
                    setLogValue("debug","Превышено время бездействия");

                } catch (error){
                    console.log(error);
                    catchErrorTemplate("008-000", error);

                }
            },
            error:function(text, data, XmlHttpRequest){
                setLogValue("error","Не удалось выполнить выход");
                ajaxErrorTemplate("008-006",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);

            }
        }).catch(error => {
            console.log(error);
            ajaxErrorTemplate("008-006",error.status,error.statusText,error.responseURL);
        });
  
    }

    function resetTimer() {
        try {
            if (window.location.pathname !== "/index.html" && window.location.pathname !== "/" && window.location.pathname !== "/init/default/spaw" ){
                clearTimeout(t);
                t = setTimeout(logout, 600000); // 600000
            }
        } catch (error){
            console.log(error);
            catchErrorTemplate("008-000", error);

        }
    };
    
}


export {
    resetTimer
};