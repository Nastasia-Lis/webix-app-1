

import { LoadServerData, GetFields }      from "../../../../blocks/globalStorage.js";
import { setAjaxError }                   from "../../../../blocks/errors.js";
import { setLogValue }                    from "../../../logBlock.js";

const logNameFile = "table => createSpace => click => itemClickLogic";
const uid         = webix.uid();

const action = {
   // navigate: true + " - переход на другую страницу, false - обновление таблицы в дашборде*/",
    navigate: true,
    field   : "auth_group",
    params  :{
        filter : "auth_group.id > 3" 
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

function createQuery(){
    const query = [ 
        "query=dash_urlmon.errors>=0" , 
        "sorts=dash_urlmon.errors" , 
        "limit=" + 80, 
        "offset="+ 0
    ];

    return query;
}

function updateTable(chartAction){
    console.log(chartAction)
    const tableId = chartAction.field;
    const filter = chartAction.params.filter;

}

function setAttributes(elem){
  //  elem.action = action 
  
    if (elem.view == "chart"){
        elem.borderless  = true;
        elem.minWidth    = 250;
        elem.on          = {
            onAfterRender:function(){
                const chart          = this.getNode();
                const htmlCollection = chart.getElementsByTagName('map');
                const mapTag         = htmlCollection.item(0);
                if (mapTag){
            
                    const areas          = mapTag.childNodes;
        
                    if (elem.action){
                        setCursorPointer(areas, true);
                    } else if (elem.data){
                        elem.data.forEach(function(el,i){
                            // if (i == 1 || i == 4 ){
                            //     el.action = action; 
                            // }
                        
                            if (el.action){
                                setCursorPointer(areas, false, el.id);
                            }
                        });
                    }
                }

            },

            onItemClick:function(idEl){
                console.log("пример: ", action);
                console.log("navigate: true - переход на другую страницу, false - обновление таблицы в дашборде");

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
                                console.log("В процессе разработки")
                                //updateTable(chartAction);
                            }
                        
                        }
                    });
                } 

        
                if (elem.action){
                    findField(elem.action);
                    
                } else {
                    const collection = elem.data;
        
                    let selectElement;
            
                    collection.forEach( function (el,i){
                        if (el.id == idEl){
                            selectElement = el;
                        }
                    });

                    const chartAction = selectElement.action;

                    if (chartAction){
                        findField(chartAction);

                    } 
                
                }
                
            },


        };
    } 
    else if (elem.view =="datatable"){
  
        // elem.on = {
        //     onItemClick:function(){
                // const query = [ 
                //     "query=dash_urlmon.errors>=0" , 
                //     "sorts=dash_urlmon.errors" , 
                //     "limit=" + 80, 
                //     "offset="+ 0
                // ];

        //         webix.ajax().get( "/init/default/api/smarts?" + query.join("&") );
        //     }
        // };
    }
    return elem;
 
}


function iterateArr(container){
    let res;
    const elements = [];

    function loop(container){
        container.forEach(function(el, i){
         
            const nextContainer = el.rows || el.cols;
     
            if (!el.rows && !el.cols){
                if (el.view && el.view == "chart"){
                    el = setAttributes(el);
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



function returnEl(element){
    const container = element.rows || element.cols;
   
    let resultElem;
    
    container.forEach(function(el,i){
        const nextContainer = el.rows || el.cols;
        resultElem    = iterateArr(nextContainer);

    });

    return resultElem;
}

export {
    returnEl,
    setAttributes
};