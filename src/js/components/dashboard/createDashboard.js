import { LoadServerData, GetFields }      from "../../blocks/globalStorage.js";
import { Action }                         from '../../blocks/commonFunctions.js';
import { setFunctionError, 
            setAjaxError }                from '../../blocks/errors.js';

import { createDynamicElems }             from './createSpace/dynamicElements/_layout.js';
import { createFilter }                   from './createSpace/filter/elements.js';
import { autorefresh }                    from './autorefresh.js';
import { createContextProperty }          from './createSpace/contextWindow.js';

const logNameFile = "dashboard => createDashboard";
let idsParam;

function getDashId ( idsParam ){
    const tree = $$("tree");
    let itemTreeId;

    if (idsParam){
        itemTreeId = idsParam;
    } else if (tree.getSelectedItem()){
        itemTreeId = tree.getSelectedItem().id;
    }

    return itemTreeId;
}


function createDashSpace (){

    const keys   = GetFields.keys;
    const values = GetFields.values;

    const itemTreeId = getDashId(idsParam);
  
    values.forEach(function(el,i){

        const fieldId = keys[i];
     
        if (el.type == "dashboard" && fieldId == itemTreeId) {
          
            const url    = el.actions.submit.url;
            const inputs = createFilter (el.inputs, el, idsParam);
         
            createDynamicElems(url, inputs,      idsParam);
            autorefresh       (el,  idsParam);
        }
    });
}

async function getFieldsData (){
    await LoadServerData.content("fields");
    createDashSpace ();
}

function getData(tableId, src){

    const query = [
        "query=" + src + ".id=" + tableId,
        "sorts=" + src + ".id",
        "limit=" + 80,
        "offset="+ 0,
    ];
    const fullQuery = query.join("&");
    const path      = "/init/default/api/smarts?";
    const queryData = webix.ajax(path + fullQuery);

    queryData.then(function(data){
        data             = data.json();
        const notifyType = data.err_type;
        const notifyMsg  = data.err;
        const content    = data.content[0];

        if (content){
            createContextProperty(
                content, 
                src
            );
        }

        if (notifyType !== "i"){
            setFunctionError(
                notifyMsg, 
                logNameFile, 
                "getData"
            );
        }  
    });
    queryData.fail(function(err){
        setAjaxError(
            err, 
            logNameFile, 
            "getTableData"
        );
    });
}

function getLinkParams(param){
    const href   = window.location.search;
    const params = new URLSearchParams (href);
    return params.get(param);
}

function selectContextId(){
    const idParam  = getLinkParams("id");
    const srcParam = getLinkParams("src");
    if (idParam && srcParam){
        getData(idParam , srcParam);
    } 
}
function createContext(){
    selectContextId()
}


function createDashboard ( ids ){
    idsParam = ids;

    const scroll = $$("dashBodyScroll");
    Action.removeItem(scroll);

    getFieldsData ();
  
    createContext();
}

export {
    createDashboard
};