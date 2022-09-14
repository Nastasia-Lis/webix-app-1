import { catchErrorTemplate} from "./logBlock.js";

function getStorageLogVal () {
    let logBtnVal = webix.storage.local.get("LogVisible");

    try {
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
    } catch (error){
        console.log(error);
        catchErrorTemplate("010-000", error);

    }

}

function setStorageData (name, value){
    if (typeof(Storage) !== 'undefined') {
        localStorage.setItem(name, value);
    } 
}


function setUserLocation (tableNames,userLocation,autoLogoutVal=false){
    try {
        userLocation = window.location.href;
        let tableIdHref = userLocation.slice(userLocation.lastIndexOf('/')+1); 
        let nameRecoverEl;
        let storageData;

        if (tableNames){
            tableNames.forEach(function(el,i){
                if (el.id == tableIdHref){
                    nameRecoverEl= el.name;
                }
            });
        } 

        storageData= {tableName:nameRecoverEl,tableId:tableIdHref,href:userLocation,autoLogout:autoLogoutVal};


        setStorageData ("userLocation", JSON.stringify(storageData));

    } catch (error){
        console.log(error);
        catchErrorTemplate("010-000", error);

    }
}
export{
    getStorageLogVal,
    setStorageData,
    setUserLocation
};