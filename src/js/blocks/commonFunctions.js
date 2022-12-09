import { setFunctionError, setAjaxError }   from "./errors.js";
import { setStorageData }                   from "./storageSetting.js";

let visibleItem;

function getItemId (){
    let idTable;


    try{
        const table     = $$("table");
        const tableView = $$("table-view");
        const dashboard = $$("dashboardContainer");

        if ($$("tables").isVisible()){
            idTable      = table.config.idTable;
            visibleItem  = table;
        } else if ($$("forms").isVisible()){
            idTable      = tableView.config.idTable;
            visibleItem  = tableView; 
  
        } else if ($$("dashboardContainer").isVisible()){
            idTable      = dashboard.config.idDash;
            visibleItem  = dashboard; 
        }

    } catch (err){
        setFunctionError(err,"commonFunctions","getItemId");
    }

    return idTable;
}

function getTable(){
    getItemId ();
    return visibleItem;
}

class Action {
    static hideItem(item){
        if (item){
            item.hide();
        }
    }

    static showItem(item){
        if (item){
            item.show();
        }
    }

    static removeItem(item){
        if(item){
            const parent = item.getParentView();
            parent.removeView(item);
        }
    }

    static disableItem(item){
        if (item && item.isEnabled()){
            item.disable();
        }
    }

    static enableItem(item){
        if ( item && !(item.isEnabled()) ){
            item.enable();
        }
    }

    static destructItem(item){

        if(item){
            item.destructor();
        }
    }
}

class TableConfig {

    static getView (){
        let view;
    
        try{
            const table     = $$("table");
            const tableView = $$("table-view");
            console.log(table.isVisible(), tableView.isVisible());
            if ($$("tables").isVisible()){
        
                view = table;
            } else if ($$("forms").isVisible()){
             
                view = tableView; 
      
            }
    
        } catch (err){
            setFunctionError(err, "commonFunctions", "getView");
        }
        console.log(view);
        return view;
    }

    static getIdField (){
        const table = this.getView ();
        console.log(table);
        return table.config.idTable;
    }
}

function textInputClean(){
    let mdView = null;
  
    webix.event(document.body, "mousedown", e => { 
      const targetView = $$(e);
      if (targetView && targetView.getInputNode){
        mdView = targetView;
      } 
    });
    
    webix.event(document, "click", e => { 
      const clickedView = $$(e);
      if (mdView && clickedView && clickedView.config.id !== mdView.config.id){
        e.cancelBubble = true; 
        webix.html.preventEvent(e);
      }
      mdView = null;
    }, { capture: true });
}

function getComboOptions (refTable){
    const url       = "/init/default/api/" + refTable;

    return new webix.DataCollection({url:{
        $proxy:true,
        load: function(){
            return ( webix.ajax().get(url).then(function (data) {
                        data            = data.json().content;
                        const dataArray = [];
                        let keyArray;

                        function stringOption(l,el){
                            try{
                                while (l <= Object.values(el).length){
                                    if (typeof Object.values(el)[l] == "string"){
                                        keyArray = Object.keys(el)[l];
                                        break;
                                    } 
                                    l++;
                                }
                            } catch (err){  
                                setFunctionError(
                                    err,
                                    "commonFunctions",
                                    "getComboOptions => stringOption"
                                );
                            }
                        }

                        function numOption(l,el){
                            try{
                                if (el[keyArray] == undefined){
                                    while (l <= Object.values(el).length) {
                                        if (typeof Object.values(el)[1] == "number"){
                                            keyArray = Object.keys(el)[1];
                                            break;
                                        }
                                        l++;
                                    }
                                }

                                dataArray.push({ "id":el.id, "value":el[keyArray]});
                            } catch (err){  
                                setFunctionError(
                                    err,
                                    "commonFunctions",
                                    "getComboOptions => numOption"
                                );
                            }
                        }

                        function createComboValues(){
                            try{
                                data.forEach((el) =>{
                                    let l = 0;
                                    stringOption (l,el);
                                    numOption    (l,el);
                                
                                });
                            } catch (err){  
                                setFunctionError(
                                    err,
                                    "commonFunctions",
                                    "getComboOptions => createComboValues"
                                );
                            }
                        }
                        createComboValues();
                        return dataArray;
                    
                    }).catch(err => {
                        setAjaxError(
                            err, 
                            "commonFunctions",
                            "getComboOptions"
                        );
                    })
            );
            
        }
    }});
}

function getUserDataStorage(){
    return  webix.storage.local.get("user");
}

async function pushUserDataStorage(){
 
    const path = "/init/default/api/whoami";
    const userprefsGetData = webix.ajax(path).fail(function(err){
        setAjaxError(err, "commonFunctions", "getUserData");
        return false;
    });

    userprefsGetData.then(function(data){

        data      = data.json().content;
 
        const userData = {};
    
        userData.id       = data.id;
        userData.name     = data.first_name;
        userData.username = data.username;
        
        setStorageData("user", JSON.stringify(userData));

    
    });

 
   
}


export {
    getItemId,
    getTable,
    
    textInputClean,
    
    getComboOptions,
    pushUserDataStorage,
    getUserDataStorage,

    Action,
    TableConfig
   
};