import { LoadServerData, GetFields }      from "../../blocks/globalStorage.js";
import { Action }                         from '../../blocks/commonFunctions.js';
import { mediator }                       from '../../blocks/_mediator.js';
import { setFunctionError, 
            setAjaxError }                from '../../blocks/errors.js';

import { createDynamicElems }             from './createSpace/dynamicElements/_layout.js';
import { createFilter }                   from './createSpace/filter/elements.js';
import { autorefresh }                    from './autorefresh.js';
import { createContextProperty }          from './createSpace/contextWindow.js';


const logNameFile = "dashboard => createDashboard";

let idsParam;


function createDashSpace (){

    const item = GetFields.item(idsParam);

    if (item){

        Action.removeItem($$("dash-none-content"));

        const url    = item.actions.submit.url;
        const inputs = createFilter (item.inputs, item, idsParam);
     
        createDynamicElems(url, inputs,      idsParam);
        autorefresh       (item,  idsParam);
    }
}

async function getFieldsData (isShowExists){
    if (!isShowExists){
        await LoadServerData.content("fields");
    }

    if (!GetFields.keys){
        await LoadServerData.content("fields");
    }
    

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



function returnLostContext(){

    const data = mediator.tabs.getInfo();
 
    if (data && data.temp){

        const context = data.temp.context;

        if (context && context.open){ // open context window
  
            mediator.linkParam(true, {
                "src": context.field , 
                "id" : context.id  
            });
            
        } else if (context){ // set values to dash table
        
            mediator.linkParam(true, {
                "src"    : context.id , 
                "filter" : true  
            });

            // const table = $$(context.id);
            // scrollToTable(table);
        }
        
    }
 
}


function selectContextId(){
    returnLostContext();

    const idParam  = getLinkParams("id");
    const srcParam = getLinkParams("src");
    if (idParam && srcParam){
        getData(idParam , srcParam);
    } 
}
function createContext(){
    selectContextId();
}


function createDashboard (ids, isShowExists){
    idsParam = ids;

    const scroll = $$("dashBodyScroll");
    Action.removeItem(scroll);

    getFieldsData (isShowExists);
  
    createContext();
}

export {
    createDashboard
};