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
        //console.log(window.location.href,"wr")
        //setUserLocation ("",window.location.href);
      
        webix.ajax().get("/init/default/api/userprefs/", {
            success:function(text, data, XmlHttpRequest){
                data = data.json().content;
                if (data.err_type == "e"){
                    setLogValue("error",data.error);
                }


                if (window.location.pathname !== "/index.html/content"){
                    
                    let settingExists = false;
                    let location = {};
                    location.href = window.location.href;

                    let sentObj = {
                        name:"userLocationHref",
                        prefs:location
                    };
   
                    try{
                        data.forEach(function(el,i){
                            if (el.name == "userLocationHref"){
                                settingExists = true;

                                webix.ajax().put("/init/default/api/userprefs/"+el.id, sentObj, {
                                    success:function(text, data, XmlHttpRequest){
                                        data = data.json();
                                        if (data.err_type == "e"){
                                            setLogValue("error",data.error);
                                        }
                                    
                                    },
                                    error:function(text, data, XmlHttpRequest){
                                        ajaxErrorTemplate("008-011",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                                    }
                                }).catch(error => {
                                    console.log(error);
                                    ajaxErrorTemplate("008-011",error.status,error.statusText,error.responseURL);
                                });
                            
                            } 
                        });
                    } catch (error){
                        console.log(error);
                        catchErrorTemplate("008-000", error);
                    }


                    try{
                        if (!settingExists){
            
                            let ownerId = webix.storage.local.get("user").id;

                            if (ownerId){
                                sentObj.owner = ownerId;
                            } else {
                                webix.ajax("/init/default/api/whoami",{
                                    success:function(text, data, XmlHttpRequest){
                                        
                                        sentObj.owner = data.json().content.id;

                                        let userData = {};
                                        userData.id = data.json().content.id;
                                        userData.name = data.json().content.first_name;
                                        userData.username = data.json().content.username;
                                        
                                       // setStorageData("user", JSON.stringify(userData));
                                    },
                                    error:function(text, data, XmlHttpRequest){
                                        ajaxErrorTemplate("008-011",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                                    }
                                }).catch(error => {
                                    console.log(error);
                                    ajaxErrorTemplate("008-000",error.status,error.statusText,error.responseURL);
                                });
                            }

                            webix.ajax().post("/init/default/api/userprefs/",sentObj, {
                                success:function(text, data, XmlHttpRequest){
                                    data = data.json();
            
                                    if (data.err_type == "e"){
                                        setLogValue("error",data.error);
                                    }
                                    
                                },
                                error:function(text, data, XmlHttpRequest){
                                    ajaxErrorTemplate("008-001",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                                }
                            }).catch(error => {
                                console.log(error);
                                ajaxErrorTemplate("008-001",error.status,error.statusText,error.responseURL);
                            });
                        }
                    } catch (error){
                        console.log(error);
                        catchErrorTemplate("008-000", error);
                    }
                }
            },
            error:function(text, data, XmlHttpRequest){
                ajaxErrorTemplate("008-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
            }
        }).catch(error => {
            console.log(error);
            ajaxErrorTemplate("008-000",error.status,error.statusText,error.responseURL);
        }).then(function(data){
            Backbone.history.navigate("logout", { trigger:true});
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