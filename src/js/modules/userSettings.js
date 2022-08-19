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

export{
    getStorageData,
    setStorageData
};