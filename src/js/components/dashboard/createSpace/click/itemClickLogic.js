

import { LoadServerData, GetFields }      from "../../../../blocks/globalStorage.js";
import { setAjaxError, setFunctionError } from "../../../../blocks/errors.js";
import { setLogValue }                    from "../../../logBlock.js";
import { createContextProperty }          from "../contextWindow.js";

const logNameFile = "table => createSpace => click => itemClickLogic";
const uid         = webix.uid();


const action = {
    navigate: "true - переход на другую страницу, false - обновление в данном дашборде",
    context : "true - открыть окно с записью таблицы, false - обновить таблицу",
    field   : "название из fields (id таблицы должен быть идентичным, если navigate = false)",
    params  :{
        // sorts
        filter : "auth_group.id > 3", 
    }
   
};
const action2 = {
    navigate: false,
    field   : "auth_group",
    context : true,
    params  :{
        filter : "auth_group.id = 3" 
    // filter : "auth_group.id != '1' or auth_group.id != '3' and auth_group.role contains 'р' or auth_group.role = 'а'" 
    }
    
 };
function createSentObj(prefs){
    const sentObj = {
        name    : "dashboards_context-prefs_" + uid,
        prefs   : prefs,
    };

    const ownerId = webix.storage.local.get("user").id;

    if (ownerId){
        sentObj.owner = ownerId;
    }

    return sentObj;
}

function createPath(field){
    const url ="tree/" + field;
    const parameter = "prefs=" + uid;
 
    if (field){
        return url + "?" + parameter;
    }
   
}

function navigate(field){
    const path = createPath(field);
    Backbone.history.navigate(path, { trigger : true });
    window.location.reload();   
}

function postPrefs(chartAction){
    const sentObj = createSentObj(chartAction);

    const path          = "/init/default/api/userprefs/";
    const userprefsPost = webix.ajax().post(path, sentObj);
                    
    userprefsPost.then(function(data){
        data = data.json();
   
        if (data.err_type == "i"){

            navigate(chartAction.field);

        } else {
            setLogValue("error", data.error);
        }
    });

    userprefsPost.fail(function(err){
        setAjaxError(
            err, 
            logNameFile,
            "postPrefs"
        );
    });
}

function setCursorPointer(areas, fullElems, idElem){

    areas.forEach(function(el,i){
        if (el.tagName){
            const attr = el.getAttribute("webix_area_id");

            if (attr == idElem || fullElems){
                el.style.cursor = "pointer";
            }
            
        }
    });

}

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
    tableElem.clearAll();
    if (tableElem){
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
        const content = data.content;

        if (!onlySelect){
            setDataToTable     (tableId, content);
        } else if (content[0]){
            createContextProperty(content[0], tableId);
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

function cursorPointer(self, elem){
    const chart          = self.getNode();
    const htmlCollection = chart.getElementsByTagName('map');
    const mapTag         = htmlCollection.item(0);
    if (mapTag){
        const areas          = mapTag.childNodes;

        if (elem.action){
            setCursorPointer(areas, true);
        } else if (elem.data){
            elem.data.forEach(function(el, i){

                if (i == 1 || i == 4 ){
                    el.action = action2; 
                }
            
                if (el.action){
                    setCursorPointer(areas, false, el.id);
                }
            });
        }
    }
}

async function findField(chartAction){
    await LoadServerData.content("fields");
    const keys   = GetFields.keys;

    let field = chartAction;

    if (chartAction && chartAction.field){
        field = chartAction.field;
    }

    keys.forEach(function(key,i){
   
        if ( key == field ){
            if (chartAction.navigate){
                postPrefs(chartAction);
            } else {
                updateSpace(chartAction);
            } 
        
        }
    });
}

function findInnerChartField(elem, idEl){
    const collection = elem.data;
        
    let selectElement;

    collection.forEach( function (el){
        if (el.id == idEl){
            selectElement = el;
        }
    });

    const chartAction = selectElement.action;

    if (chartAction){
        findField(chartAction);

    } 
}

function setAttributes(elem, topAction){
    if (topAction){
        elem.action = topAction;
    }

    elem.borderless  = true;
    elem.minWidth    = 250;
    elem.on          = {
        onAfterRender:function(){
            cursorPointer(this, elem);
        },

        onItemClick:function(idEl){
            console.log("пример: ", action);
    
            if (elem.action){ // action всего элемента
                findField(elem.action);
                
            } else { // action в data
                findInnerChartField(elem, idEl);
            }
            
        },


    };
     

    return elem;
 
}


function iterateArr(container, topAction){
    let res;
    const elements = [];

    function loop(container){
        container.forEach(function(el){
         
            const nextContainer = el.rows || el.cols;
     
            if (!el.rows && !el.cols){
                if (el.view && el.view == "chart"){
                    el = setAttributes(el, topAction);
                }
                
                elements.push(el);
            } else {
                loop(nextContainer);
            }
        });
    }

    loop( container );

    if (elements.length){
        res = elements;
    }

    return res;
}



function returnEl(element, topAction){
    const container = element.rows || element.cols;
   
    let resultElem;
    
    container.forEach(function(el){
        const nextContainer = el.rows || el.cols;
        resultElem = iterateArr(nextContainer, topAction);

    });

    return resultElem;
}

export {
    returnEl,
    setAttributes
};