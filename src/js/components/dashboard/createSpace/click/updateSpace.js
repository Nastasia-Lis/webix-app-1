import { setAjaxError, setFunctionError } from "../../../../blocks/errors.js";
import { setLogValue }                    from "../../../logBlock.js";
import { createContextProperty }          from "../contextWindow.js";

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

function setDataToTable(table, data){

    const tableElem = $$(table);

    if (tableElem){
        tableElem.clearAll();
        tableElem.parse(data);

    } else {    
        setFunctionError(
            "Таблица с id «" + table + 
            "» не найдена на странице", 
            logNameFile, 
            "setDataToTable"
        );
    }

    scrollToTable(tableElem);
}

function getTableData(tableId, query, onlySelect){

    const fullQuery = query.join("&");
    const path      = "/init/default/api/smarts?";
    const queryData = webix.ajax(path + fullQuery);

    queryData.then(function(data){
        data             = data.json();
        const notifyType = data.err_type;
        const notifyMsg  = data.err;
        const content    = data.content;
        const item       = content[0];

        if (!onlySelect){
            setDataToTable (tableId, content);
        } else if (item){
            createContextProperty (item, tableId);
        }
       

        if (notifyType !== "i"){
            setLogValue("error", notifyMsg);
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