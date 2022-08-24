import {popupExec} from "./editTableForm.js";

function getStorageData () {
    let logBtnVal = webix.storage.local.get("LogVisible");
    let userLocation = webix.storage.local.get("userLocation");

    console.log(userLocation)
    if (logBtnVal){

        if(logBtnVal=="hide"){
            $$("logLayout").config.height = 5;
            $$("logLayout").resize();
            $$("webix_log-btn").config.icon ="wxi-eye";
            $$("webix_log-btn").refresh();

        } else if(logBtnVal=="show"){
            $$("logLayout").config.height = 90;
            $$("logLayout").resize();
            $$("webix_log-btn").config.icon ="wxi-eye-slash";
            $$("webix_log-btn").refresh();
        }
    }
    
    if (userLocation){

        console.log("pap")
            popupExec("Gg").then(
            function(){
                if (userLocation.includes("tree")){
                    let p =userLocation.lastIndexOf("#tree/")
                    console.log(p)
                }
                window.location.replace(userLocation);
            });
    
     
        //console.log(userLocation)
       // if (userLocation !=="")
    }

}

function setStorageData (name, value){
    if (typeof(Storage) !== 'undefined') {
        localStorage.setItem(name, value);
    } 
}

export{
    getStorageData,
    setStorageData
};