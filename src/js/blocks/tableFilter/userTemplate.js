
import { setLogValue }                               from '../logBlock.js';
import { setFunctionError, setAjaxError }            from "../errors.js";
import { createChildFields }                         from "./toolbarBtn.js";

import { visibleInputs, visibleField, clearSpace }   from "./common.js";

import { getItemId, hideElem, enableElem, getTable }  from "../commonFunctions.js";

const logNameFile = "tableFilter => userTemplate";


function getLibraryData(){
    const lib        = $$("filterEditLib");
    const libValue   = lib.getValue ();
    const radioValue = lib.getOption(libValue);
    
    const userprefsData = webix.ajax("/init/default/api/userprefs/");
 
    userprefsData.then(function(data){
      //  const dataErr = data.json();
        const currId  = getItemId ();
        data          = data.json().content;

        function  createWorkspace(prefs){

            clearSpace();

            const values = prefs.values;

            function setValue(el,value){
                if (value){
                    el.setValue(value);
                }
            }

            function setBtnsValue(el){
                
                const id = el.id;
                const segmentBtn    = $$(id + "_segmentBtn");
                const operationsBtn = $$(id + "-btnFilterOperations");
    
                setValue(segmentBtn   , el.logic    );
                setValue(operationsBtn, el.operation);
                
            }

            function showParentField (el){
                const idEl      = el.id;
                const element   = $$(idEl);
                const htmlClass = element.config.columnName;
             
                visibleField(1, htmlClass, idEl);

                setBtnsValue(el);
                setValue    (element, el.value);
            }
 
            function createChildField(el){
                const table = getTable();
                const col   = table.getColumnConfig(el.parent);

                const idField = createChildFields (col);

                const values = el;
                values.id = idField;

                setBtnsValue(values);
                setValue    ($$(idField), el.value);
            }


            function hideSegmentBtn(){
                function returnValue(array, index){
                    const lastKey = array.length - index;
                    return array[lastKey];
                }
          
                const lastCollection = returnValue (Object.keys(visibleInputs)   , 1);
                const lastInput      = returnValue (visibleInputs[lastCollection], 1);

                const segmentBtn = $$(lastInput +"_segmentBtn");

                hideElem(segmentBtn);
            }
            
 
            values.forEach(function(el,i){
                
                if (!el.parent){
                    showParentField  (el);
                } else {
                    createChildField(el);
                }
            });

            hideSegmentBtn();
             
            
        }

        function dataEnumeration() {
            try{
                data.forEach(function(el,i){

                    if (el.name == currId+"_filter-template_"+radioValue.value){
                        let prefs = JSON.parse(el.prefs);
                        createWorkspace(prefs);
                    }

                    function removeFilterPopup(){
                        const popup = $$("popupFilterEdit");
                        if (popup){
                            popup.destructor();
                        }
                    }
                
          
                    removeFilterPopup();
                    enableElem($$("btnFilterSubmit"));
                });
            } catch(err){
                setFunctionError(err,logNameFile,"function dataEnumeration");
            }
        }

        //if (dataErr.err_type == "i"){
        dataEnumeration();
        setLogValue("success","Рабочая область фильтра обновлена");

           
        // } else {
        //     setLogValue("error",dataErr.err); 
        // }

    });

    userprefsData.fail(function(err){
        setAjaxError(err, logNameFile,"getLibraryData");
    });


  
}

export{
    getLibraryData  
};