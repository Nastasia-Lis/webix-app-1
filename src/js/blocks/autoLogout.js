import {setLogValue} from "./logBlock.js";
import {setAjaxError,setFunctionError} from "./errors.js";

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

        const userprefsData = webix.ajax().get("/init/default/api/userprefs/");

        userprefsData.then(function(data){
            if (data.err_type !== "i"){
                setFunctionError(data.json().err,"autoLogout","putUserPrefs");
            }

            data = data.json().content;
            
            let settingExists = false;
            let location = {};
            location.href = window.location.href;

            let sentObj = {
                name:"userLocationHref",
                prefs:location
            };
            
            function putUserPrefs(){
                try{
                    data.forEach(function(el,i){
                        if (el.name == "userLocationHref"){
                            settingExists = true;

                            const putData = webix.ajax().put("/init/default/api/userprefs/"+el.id, sentObj);

                            putData.then(function(data){
                                data = data.json();
                                if (data.err_type !== "i"){
                                    setLogValue("error",data.err);
                                }
                            });

                            putData.fail(function(err){
                                setAjaxError(err, "autoLogout","putUserPrefs");
                            });
                        } 
                    });  
                }   catch(err){
                    setFunctionError(err,"autoLogout","putUserPrefs");
                }
            }

            function getWhoamiData(){
                let ownerId = webix.storage.local.get("user").id;

                try{
                    if (ownerId){
                        sentObj.owner = ownerId;
                    } else {
                        const whoamiData =  webix.ajax("/init/default/api/whoami");
                        
                        whoamiData.then(function(data){
                            sentObj.owner = data.json().content.id;

                            let userData = {};
                            userData.id = data.json().content.id;
                            userData.name = data.json().content.first_name;
                            userData.username = data.json().content.username;
                        });

                        whoamiData.fail(function(err){
                            setAjaxError(err, "autoLogout","getWhoamiData");
                        });

                    }
                }   catch(err){
                    setFunctionError(err,"autoLogout","getWhoamiData")
                }
            }
            
            function postUserPrefs(){

                const postData = webix.ajax().post("/init/default/api/userprefs/",sentObj);

                postData.then(function(data){
                    data = data.json();

                    if (data.err_type !== "i"){
                        setFunctionError(data.err,"autoLogout","putUserPrefs");
                    }
                });

                postData.fail(function(err){
                    setAjaxError(err, "autoLogout","postUserPrefs");
                });

            }


            if (window.location.pathname !== "/index.html/content"){
                putUserPrefs();
   
                if (!settingExists){
                    getWhoamiData();
                    postUserPrefs();
                }
            }
        });

        userprefsData.then(function(data){
            Backbone.history.navigate("logout", { trigger:true});
        });

        userprefsData.fail(function(err){
            setAjaxError(err, "autoLogout","logout");

        });
      
    }

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