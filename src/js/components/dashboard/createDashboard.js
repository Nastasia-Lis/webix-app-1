///////////////////////////////

// Отображение charts (create charts)

// Автообновление (create autorefresh) 

// Создание layout (create layout)

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { LoadServerData, GetFields }      from "../../blocks/globalStorage.js";
import { Action }                         from '../../blocks/commonFunctions.js';
import { mediator }                       from '../../blocks/_mediator.js';
import { ServerData }                     from '../../blocks/getServerData.js';

 import { createContextProperty, 
        createFilter, 
        createDynamicElems }              from './dynamicElements.js';


// create charts 

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

    
    new ServerData({
    
        id           : "smarts?" + fullQuery,
       
    }).get().then(function(data){
    
        if (data){

            const content = data.content;

            if (content){
             
                const firstPost = content[0];
    
                if (firstPost){
                    createContextProperty(
                        firstPost, 
                        src
                    );
                }

            }
        }
         
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





// create autorefresh 

function setIntervalConfig(counter){
    setInterval(function(){
        mediator.dashboards.load(idsParam);
    },  counter );
}

function autorefresh (el, ids) {

  
    if (el.autorefresh){

        const userprefsOther = webix.storage.local.get("userprefsOtherForm");
        const counter        = userprefsOther.autorefCounterOpt;
        idsParam             = ids;

        const minValue     = 15000;
        const defaultValue = 50000;

        if ( counter !== undefined ){

            if ( counter >= minValue ){
                setIntervalConfig(counter);

            } else {
                setIntervalConfig(defaultValue);
            }

        } else {
            setIntervalConfig(defaultValue);
        }

       
    }
}



//create layout


function returnTemplate(id){
    return {
        id      : "dashboard" + id,
        css     : "webix_dashTool", 
        minWidth: 200,
        width   : 350,
        hidden  : true,
        rows    : [{}],
        on:{
            onViewShow:function(){
                if (window.innerWidth > 850){
                    this.config.width = 350;
                    this.resize();
                }
            }
        }
    };
}

const dashboardTool    = returnTemplate("Tool");
const dashboardContext = returnTemplate("Context");

function dashboardLayout () {
        return [
            {  
                id  : "dashboardContainer",
        
                rows: [

                    {cols:[
                        {   id      : "dashboardInfoContainer",
                            css     : "dash_container",
                            minWidth: 250, 
                            rows    : [
                                {id : "dash-none-content"}
                            ] 
                        },
                        {view: "resizer"},
                        dashboardTool,
                        dashboardContext
                    ]},
                
                    
                
                ]
                    
            }
        ];
}



export {
    createDashboard,
    dashboardLayout
};