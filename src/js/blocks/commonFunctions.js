import {setFunctionError, setAjaxError} from "./errors.js";
import {setStorageData} from "./storageSetting.js";

let visibleTable;

function getItemId (){
    let idTable;

    try{
        const table     = $$("table");
        const tableView = $$("table-view");

        if ($$("tables").isVisible()){
            idTable = table.config.idTable;
            visibleTable = table
        } else if ($$("forms").isVisible()){
            idTable = tableView.config.idTable;
            visibleTable = tableView; 
  
        }

    } catch (err){
        setFunctionError(err,"commonFunctions","getItemId");
    }

    return idTable;
}

function getTable(){
    getItemId ();

    return visibleTable;
}

function hideElem(elem){
    try{
        if (elem){
            elem.hide();
        }
    } catch (err){
        setFunctionError(err,"commonFunctions","hideElem, element: "+elem);
    }
}

function showElem (elem){
    try{
        if (elem && !(elem.isVisible())){
            elem.show();
        }
    } catch (err){
        setFunctionError(err,"commonFunctions","showElem element: "+elem);
    }
}

function removeElem (elem){
    try{
        if(elem){
            const parent = elem.getParentView();
            parent.removeView(elem);
        }
    
    } catch (err){
        setFunctionError(err,"commonFunctions","removeElem element: "+elem);
    }
}

function disableElem(element){
    try{
        if (element && element.isEnabled()){
            element.disable();
        }
    } catch (err){
        setFunctionError(err,"sidebar","disableElements");
    }
}

function enableElem(element){
    try{
        if ( element && !(element.isEnabled()) ){
            element.enable();
        }
    } catch (err){
        setFunctionError(err,"sidebar","enableElements");
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
    const url       = "/init/default/api/"+refTable;

    return new webix.DataCollection({url:{
        $proxy:true,
        load: function(){
            return ( webix.ajax().get(url).then(function (data) {
                        data = data.json().content;
                        let dataArray=[];
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
                                setFunctionError(err,"commonFunctions","getComboOptions => stringOption");
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
                                setFunctionError(err,"commonFunctions","getComboOptions => numOption");
                            }
                        }

                        function createComboValues(){
                            try{
                                data.forEach((el,i) =>{
                                    let l = 0;
                                    stringOption (l,el);
                                    numOption    (l,el);
                                
                                });
                            } catch (err){  
                                setFunctionError(err,"commonFunctions","getComboOptions => createComboValues");
                            }
                        }
                        createComboValues();
                        return dataArray;
                    
                    }).catch(err => {
                        setAjaxError(err, "commonFunctions","getComboOptions");
                    })
            );
            
        }
    }});
}

function getUserData(){
    const userprefsGetData = webix.ajax("/init/default/api/whoami");
    userprefsGetData.then(function(data){
        const err = data.json();
        data      = data.json().content;

        const userData = {};
    
        userData.id       = data.id;
        userData.name     = data.first_name;
        userData.username = data.username;
        
        setStorageData("user", JSON.stringify(userData));
    
        if (err.err_type !== "i"){
            setFunctionError(err,"commonFunctions","function getUserData");
        }
    
    });
    userprefsGetData.fail(function(err){
        setAjaxError(err, "favsLink","btnSaveLpostContentinkClick => getUserData");
    });
}


export {
    getItemId,
    getTable,

    hideElem,
    showElem,
    removeElem,
    disableElem,
    enableElem,

    textInputClean,
    
    getComboOptions,
    getUserData,
   
};