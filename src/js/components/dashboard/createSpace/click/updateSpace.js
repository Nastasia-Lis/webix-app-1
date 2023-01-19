///////////////////////////////

// Action с обновлением данных в таблице
// и созданием контекстного окна

// Copyright (c) 2022 CA Expert

/////////////////////////////// 


import { setFunctionError }         from "../../../../blocks/errors.js";
import { mediator }                 from "../../../../blocks/_mediator.js";
import { ServerData }               from "../../../../blocks/getServerData.js";

import { createContextProperty }    from "../contextWindow.js";

const logNameFile = "table => createSpace => click => updateSpace";

function createQuery(filter, sorts){
 
    const query = [ 
        "query=" + filter , 
        "sorts=" + sorts  , 
        "limit=" + 80, 
        "offset="+ 0
    ];

    return query;
}


function scrollToTable(tableElem){
    const node = tableElem.getNode();
    node.scrollIntoView();
}

function setDataToTab(field, filter){
    const data = mediator.tabs.getInfo();
  
    if (data){
        if(!data.temp){
            data.temp = {};
        }
        if(data.temp.filter){
            delete data.temp.filter;
        }

        data.temp.context = {};

        data.temp.context.id     = field;
        data.temp.context.filter = filter;
  
        mediator.tabs.setInfo(data);

    } 

   
}

function setParamsToLink(id){
    mediator.linkParam(true, {
        "src"    : id , 
        "filter" : true  
    });
}

function clearParams(){
    mediator.linkParam(false, "src");
    mediator.linkParam(false, "filter");
}

function setDataToTable(table, data){

    const tableElem = $$(table);

    if (tableElem){
        tableElem.clearAll();
        tableElem.parse(data);

        setParamsToLink(table);
        scrollToTable  (tableElem);
    } else {    
        setFunctionError(
            "Таблица с id «" + table + 
            "» не найдена на странице", 
            logNameFile, 
            "setDataToTable"
        );

        clearParams();
    }
  
}

function getTableData(tableId, query, onlySelect){

    const fullQuery = query.join("&");

    new ServerData({
    
        id           : "smarts?" + fullQuery,
        isFullPath   : false,
        errorActions : clearParams
       
    }).get().then(function(data){
  
        if (data){

            const content = data.content;

            if (content){
                const item = content[0];
        
                if (!onlySelect){
                    setDataToTab   (tableId, fullQuery);
                    setDataToTable (tableId, content);
                } else if (item){
                    createContextProperty (item, tableId);
                }

            }
        }
         
    });

}

function updateSpace(chartAction){
 
    const tableId     = chartAction.field;

    const filter      = chartAction.params.filter;
    const filterParam = filter || tableId + ".id > 0" ;

    const sorts     = chartAction.params.sorts;
    const sortParam = sorts || tableId + ".id" ;
    const query     = createQuery(filterParam, sortParam);

    const onlySelect= chartAction.context;

    getTableData(tableId, query, onlySelect);
    

}

export {
    updateSpace
};