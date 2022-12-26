

import { LoadServerData, 
         GetFields }        from "../../../../blocks/globalStorage.js";
import { updateSpace }      from "./updateSpace.js";
import { postPrefs }        from "./navigate.js";

import { mediator }         from "../../../../blocks/_mediator.js";
import { setFunctionError } from "../../../../blocks/errors.js";

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
    params  : {
       filter : "auth_group.id = 11" 
    // filter : "auth_group.id != '1' or auth_group.id != '3' and auth_group.role contains 'р' or auth_group.role = 'а'" 
       // filter:"auth_user.registration_key != '3dg' and auth_user.registration_id = 'dfgg'"
    } 
};

function setCursorPointer(areas, fullElems, idElem){

    areas.forEach(function(el){
        if (el.tagName){
            const attr = el.getAttribute("webix_area_id");

            if (attr == idElem || fullElems){
                el.style.cursor = "pointer";
            }
            
        }
    });

}

function cursorPointer(self, elem){

    const node           = self.getNode();
    const htmlCollection = node.getElementsByTagName('map');
    const mapTag         = htmlCollection.item(0);

    if (mapTag){
        const areas      = mapTag.childNodes;
    
        if (elem.action){
            setCursorPointer(areas, true);
        } else if (elem.data){
            elem.data.forEach(function(el, i){

                // if (i == 1 || i == 4 ){
                //     el.action = action2; 
                // }
            
                if (el.action){
                    setCursorPointer(areas, false, el.id);
                }
            });
        }

       
    } else if (node){
        node.style.cursor = "pointer";
    }
}

async function findField(chartAction){
    await LoadServerData.content("fields");
    const keys = GetFields.keys;

    let field = chartAction;

    if (chartAction && chartAction.field){
        field = chartAction.field;
    }

    let isExists = false;

    keys.forEach(function(key){
       
        if ( key == field ){
            isExists = true;
            if (chartAction.navigate){
                postPrefs(chartAction);
            } else {
       
                updateSpace(chartAction);
                webix.storage.local.put("dashTableContext", chartAction);
            } 
        
        }
    });

    if (!isExists){ 
        setFunctionError(
            "Key «" + field + "» doesn't exist", 
            "dashboard / create space / click / itemClickLogic", 
            "findField"
        );

        mediator.linkParam(false, "src");
        mediator.linkParam(false, "filter");
    }

 
}

function findInnerChartField(elem, idEl){
    // найти выбранный элемент в data
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
  //  elem.action = action2;
    elem.borderless = true;
    elem.minWidth   = 250;
    elem.on         = {
        onAfterRender: function(){
            cursorPointer(this, elem);
        },

        onItemClick  : function(idEl){

            console.log("пример: ", action);
    
            if (elem.action){ // action всего элемента
                findField(elem.action);
                
            } else {          // action в data
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

        if (container) {
            container.forEach(function(el){
              
                if (el){
                    const nextContainer = el.rows || el.cols || [el.body];
            
                    if (!el.rows && !el.cols){
                     
                        if (el.view && el.view !=="scrollview" && el.view !== "flexlayout"){
                            el = setAttributes(el, topAction);
                        }
                        
                        elements.push(el);
                    } else {
                        loop(nextContainer);
                    }
                }
            });
        }
    }

    loop (container);

    if (elements.length){
        res = elements;
    }

    return res;
}



function returnEl(element, topAction){

    const container = element.rows || element.cols || [element.body];
   
  
    let resultElem;
    
    container.forEach(function(el){
        const nextContainer = el.rows || el.cols || [el.body];
     
        if (nextContainer[0]){
            resultElem = iterateArr(nextContainer, topAction);
        } else {
            resultElem = setAttributes(el, topAction);
        }

    });

    return resultElem;
}

export {
    returnEl,
    setAttributes
};