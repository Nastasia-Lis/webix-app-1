

import { LoadServerData, 
         GetFields }        from "../../../../blocks/globalStorage.js";
import { updateSpace }      from "./updateSpace.js";
import { postPrefs }        from "./navigate.js";


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
    context : false,
    params  :{
        filter : "auth_group.id = 3" 
    //filter : "auth_group.id != '1' or auth_group.id != '3' and auth_group.role contains 'р' or auth_group.role = 'а'" 
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
    const chart          = self.getNode();
    const htmlCollection = chart.getElementsByTagName('map');
    const mapTag         = htmlCollection.item(0);
    if (mapTag){
        const areas          = mapTag.childNodes;

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
    }
}

async function findField(chartAction){
    await LoadServerData.content("fields");
    const keys   = GetFields.keys;

    let field = chartAction;

    if (chartAction && chartAction.field){
        field = chartAction.field;
    }

    keys.forEach(function(key){
   
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
        if (typeof(container) !== 'undefined') {
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
    }

    loop (container);

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