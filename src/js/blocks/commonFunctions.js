import {setFunctionError} from "./errors.js";


function getItemId (){
    let idTable;
 
    try{
        const table     = $$("tables");
        const tableView = $$("tables-view");

        if (table.isVisible()){
            idTable = table.config.idTable;
        } else if ($$("forms").isVisible()){
            idTable = tableView.config.idTable;
        }

    } catch (err){
        setFunctionError(err,"commonFunctions","getItemId");
    }

    return idTable;
}

function hideElem(elem){
    try{
        if (elem && elem.isVisible()){
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

export {
    getItemId,
    hideElem,
    showElem,
   // removeElem,
    textInputClean
};