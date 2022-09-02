
function getStorageData () {
    let logBtnVal = webix.storage.local.get("LogVisible");

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

}

function setStorageData (name, value){
    if (typeof(Storage) !== 'undefined') {
        localStorage.setItem(name, value);
    } 
}


function setUserLocation (tableNames,userLocation){
    userLocation = window.location.href;
    let url = userLocation.search("#");
    userLocation = userLocation.slice(url);
    if (userLocation !== "#content" || userLocation !== "#"){
        let tableIdHref = userLocation.slice(userLocation.lastIndexOf('/')+1); 
        let nameRecoverEl;
        let storageData;
        tableNames.forEach(function(el,i){
            if (el.id == tableIdHref){
                nameRecoverEl= el.name;
            }
        });
        if (nameRecoverEl !== undefined){
            storageData= {tableName:nameRecoverEl,tableId:tableIdHref,href:userLocation};
            setStorageData ("userLocation", JSON.stringify(storageData));
        }
        
    }
}
export{
    getStorageData,
    setStorageData,
    setUserLocation
};