
import { setLogValue }                          from '../logBlock.js';
import { getItemId, showElem, hideElem }        from "../commonFunctions.js";
import { setFunctionError, setAjaxError }       from "../errors.js";
import { createChildFields }                    from "./toolbarBtn.js";


import { addClass, removeClass,visibleInputs, visibleField }  from "./common.js";


const logNameFile = "tableFilter => userTemplate";
function getLibraryData(){
    const lib           = $$("filterEditLib");
    const libValue      = lib.getValue ();
    const radioValue    = lib.getOption(libValue);
    
    let userprefsData = webix.ajax("/init/default/api/userprefs/");
 
    userprefsData.then(function(data){
        let dataErr = data.json();
        data = data.json().content;
  
        const currId    = getItemId ();
        const allInputs = $$("inputsFilter").getChildViews();
   
        function hideFalseInputs(trueInputs){
          
            
            function findTrueInput(inp){
                let findInput;
                trueInputs.forEach(function(el,i){
                 
                    if (inp.includes(el)){
                        findInput = el;
                    }
                    
                });


                return findInput+"_rows";
            }

            try{
                allInputs.forEach(function(input,i){
         
                    let trueInp = findTrueInput(input.config.id);
                    let id      = input.config.id;
                    
                    function getElementHide(){
                        let indexHide = id.indexOf("_rows");
                        return id.slice(0,indexHide);
                    }

                    function getHtmlClass(elementHide){
                        let indexHtml = elementHide.indexOf("_filter");
                        return id.slice(0,indexHtml);
                    }
//visibleInputs.length = 0
                    if (input.config.id !== trueInp){
                        let elementHide = getElementHide();
                        let htmlClass = getHtmlClass(elementHide);
                        visibleField(0,htmlClass,elementHide);
                    }

                });
            } catch(err){
                setFunctionError(err,logNameFile,"function hideFalseInputs");
            }
        }

        function removeChilds(){
            const inputsInner = [];

            allInputs.forEach(function(input,i){
                inputsInner.push(input.getChildViews());
            });

            function getChilds(el){
                el.forEach(function(child,i){
                    if (child.config.id.includes("-child-")){
                        const childView = $$(child.config.id);
                        const parent = childView.getParentView();
                        parent.removeView(childView);
                    }
                });
            }
         
            inputsInner.forEach(function(el,i){
                if (el.length > 1){
                   getChilds(el);
                }
            });
        }

        function  createWorkspace(prefs){
            removeChilds();
            let trueInputs = [];

            try{
                prefs.collection.content.forEach(function(el,i){
                 
                    function getHtmlArgument (){
                        const indexHtml = el.parentField.id.indexOf("_filter");
                        return el.parentField.id.slice(0,indexHtml); 
                    }

                    function getIdElArgument (){
                        const indexId = el.parentField.id.indexOf("_rows");
                        return el.parentField.id.slice(0,indexId);
                    }

                    function showParentInputs(){
                        const htmlClass = getHtmlArgument ();
                        const idEl      = getIdElArgument ();
                 //visibleInputs.length = 0
                        visibleField(1,htmlClass,idEl);

                        trueInputs.push(idEl);
                    }

                    function setParentValues(){
                        if($$(el.parentValue.id)){
                            $$(el.parentValue.id).setValue(el.parentValue.value);
                        }
                    }

                    
                    function removeLastChilds (){
                        try{ 
                            if(  $$(el.parentField.id) ){
                                $$(el.parentField.id)._cells.forEach(function(child,i){
                                    if (child.config.id.includes("child")){
                                        $$(el.parentField.id).removeView($$(child.config.id));
                                    }
                                });
                            }
                        } catch(err){
                            setFunctionError(err,logNameFile,"function createWorkspace => removeLastChilds");
                        }
                    }

                    function createChilds(){
                        const columnsData = $$("table").getColumns(true);
       
                        try{ 
                            columnsData.forEach(function(col,i){
                                if ( el.parentField.id == col.id+"_filter" ){
                                  
                                    if (el.condition == "and"){
                                 
                                        createChildFields ("and",col);
        
                                        $$(el.childValue.id).setValue(el.childValue.value); 
                                   
                                   
                                    } else if (el.condition == "or"){
                                        createChildFields ("or",col);

                                        $$(el.childValue.id).setValue(el.childValue.value); 
                                     
                                    }
                           
                                }
                            });
                        } catch(err){
                            setFunctionError(err,logNameFile,"function createWorkspace => createChilds");
                        }
                    }


                    if (el.condition == "parent"){
                        
                        showParentInputs();
        
                        setParentValues();
                      removeLastChilds ();
                    
                    }
              
           
                    hideFalseInputs(trueInputs);
                    createChilds();
                });
        
                $$("filterTableForm").setValues(prefs.values);

            } catch(err){
                setFunctionError(err,logNameFile,"function createWorkspace");
            }
        }

        function dataEnumeration() {
            try{
                data.forEach(function(el,i){

                    if (el.name == currId+"_filter-template_"+radioValue.value){
                        let prefs = JSON.parse(el.prefs);
                        createWorkspace(prefs);
                    }

                    function removeFilterPopup(){
                        if ($$("popupFilterEdit")){
                            $$("popupFilterEdit").destructor();
                        }
                    }

                    function enableBtnSubmit(){
                        if ($$("btnFilterSubmit") && !($$("btnFilterSubmit").isEnabled())){
                            $$("btnFilterSubmit").enable();
                        }
                    }
                    removeFilterPopup();
                    enableBtnSubmit();
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