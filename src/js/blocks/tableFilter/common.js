

import { showElem, hideElem }    from "../commonFunctions.js";
import { setFunctionError}       from "../errors.js";

const visibleInputs = {};

const logNameFile = "tableFilter => common";
function addClass(elem, className){
    if (!(elem.classList.contains(className))){
        elem.classList.add(className);
    }
}

function removeClass(elem, className){
    if (elem.classList.contains(className)){
        elem.classList.remove(className);
    }
}

function showSegmentBtn (condition,el){
    const segmentBtn = $$( el + "_segmentBtn");
   
    if (condition && el !== "selectAll"){
        showElem(segmentBtn);
    } 
}

function visibleField (condition, elementClass = null, el = null){

    const showClass = "webix_show-content";
    const hideClass = "webix_hide-content";
    function editStorage(){
        if (condition && el !== "selectAll"){
            visibleInputs[elementClass]  = [el];

        } else if (visibleInputs[elementClass]) {
            delete visibleInputs[elementClass];

        }
    }

    editStorage();

    showSegmentBtn (condition,el);

    const htmlElement = document.querySelectorAll(".webix_filter-inputs");

    function showHtmlEl(){
  
        try{
         
            htmlElement.forEach(function(elem,i){
       
                if (elem.classList.contains(elementClass)){
                    addClass   (elem, showClass);
                    removeClass(elem, hideClass);

                } else {
                    addClass   (elem, hideClass);

                }
            });

        } catch(err){
            setFunctionError(err,logNameFile,"function visibleField => showHtmlEl");
        }
    }

    function showInputContainers(){
       showElem($$(el));
       showElem($$(el+"_container-btns"));   
    }

    function enableElem (elem){
        if (!(elem.isEnabled())){
            elem.enable();
        }
    }


    function setValueHiddenBtn(btn,value){
        if( btn ){
            btn.setValue(value);
        }
    }

    function hideInputContainers (){
        const operBtn     =  $$(el+"-btnFilterOperations");
        const segmentBtn = $$(el+"_segmentBtn");
        const btns       = $$(el+"_container-btns");
        
      

        $$(el).setValue("");
        $$(el).hide();

        setValueHiddenBtn(operBtn,  "=");
        setValueHiddenBtn(segmentBtn, 1);

        hideElem(btns);
   
    }

    function hideHtmlEl (){
        try{
            htmlElement.forEach(function(elem,i){
                if (elem.classList.contains(elementClass)){
                    addClass   (elem, hideClass);
                    removeClass(elem, showClass);
                }
            });

        } catch(err){
            setFunctionError(err,logNameFile,"function visibleField => hideHtmlEl");
        }
    }
  
    function removeChilds(){
        const countChild = $$(el+"_rows").getChildViews();  
        const childs     = [];

        try{
           
            Object.values(countChild).forEach(function(elem,i){
              
                if (elem.config.id.includes("child")){
                    childs.push($$(elem.config.id));
                }

            });

            childs.forEach(function(el,i){
                const parent = el.getParentView();
                parent.removeView($$(el.config.id));

            });

        } catch(err){
            setFunctionError(err,logNameFile,"function visibleField => removeChids");
        }
    }

    let checkChilds = false;
    if (el!=="selectAll"){
        const childs = $$(el+"_rows").getChildViews();
        if (childs.length > 1){
            checkChilds = true;
        }
     
    }

    if ( !checkChilds ){
        if (condition){
            showHtmlEl          ();
            showInputContainers ();
            enableElem          ($$("resetFilterBtn"        ));
            enableElem          ($$("filterLibrarySaveBtn"  ));
            hideElem            ($$("filterEmptyTempalte"   ));
        } else{
            try{
    
                if ($$(el).isVisible()){
                    hideHtmlEl ();
                }

                if($$(el+"_rows")){
                    removeChilds();
                }

                hideInputContainers ();

            } catch(err){
                setFunctionError(err,logNameFile,"function visibleField => hideElements");
            }
        }
    } else {
        if ( !condition ){
            if ($$(el).isVisible()){
                hideHtmlEl ();
            }

            if($$(el+"_rows")){
                removeChilds();
            }

            hideInputContainers ();
        }
    }
}


export {
    addClass,
    removeClass,
    visibleField,
  //  stateElements,
    visibleInputs
};