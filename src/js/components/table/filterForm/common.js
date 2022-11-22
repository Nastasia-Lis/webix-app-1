

import { Action }                            from "../../../blocks/commonFunctions.js";
import { setFunctionError, setAjaxError }    from "../../../blocks/errors.js";

const visibleInputs = {};
const PREFS_STORAGE = {};

const logNameFile = "tableFilter => common";

function getUserprefsData (){

    return webix.ajax().get(`/init/default/api/userprefs/`)
    .then(function (data) {
        PREFS_STORAGE.userprefs = data.json();
        return PREFS_STORAGE.userprefs;
    }).fail(err => {
        setAjaxError(err, logNameFile, "getUserprefsData");
    }
);
}



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

function checkChild(elementClass){
    let unique = true;

    if ( visibleInputs[elementClass].length ){
        unique = false;
    }

    return unique;
 
}

function visibleField (condition, elementClass = null, el = null){
    const showClass  = "webix_show-content";
    const hideClass  = "webix_hide-content";
    const segmentBtn = $$( el + "_segmentBtn");


    function editStorage(){
        if (condition && el !== "selectAll"){

            if ( !visibleInputs[elementClass] ){
                visibleInputs[elementClass] = [];
            }


            const unique = checkChild(elementClass, el);

            if (unique){
                visibleInputs[elementClass].push(el);
                Action.showItem(segmentBtn);
            }
         

        } else if (el !== "selectAll") {
            visibleInputs[elementClass] = [];
        }

    }

    editStorage();


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
        Action.showItem($$(el));
        Action.showItem($$(el+"_container-btns"));
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
        Action.hideItem(btns);
   
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
            Action.enableItem   ($$("resetFilterBtn"        ));
            Action.enableItem   ($$("filterLibrarySaveBtn"  ));
            Action.hideItem     ($$("filterEmptyTempalte"   ));
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

function clearSpace(){
    const values = Object.values(visibleInputs);

    function hideElements(arr){
        arr.forEach(function(el,i){
            if ( !el.includes("_filter-child-") ){
                const colId      = $$(el).config.columnName;
                const segmentBtn = $$(el + "_segmentBtn");

                visibleField (0, colId, el);
                segmentBtn.setValue(1);
                Action.hideItem(segmentBtn);
            }
        });
    }

    values.forEach(function(el,i){
     
        if (el.length){
            hideElements(el);
        }
    });
}


export {
    addClass,
    removeClass,
    visibleField,
    clearSpace,
    
    visibleInputs,
    PREFS_STORAGE,
    getUserprefsData
};