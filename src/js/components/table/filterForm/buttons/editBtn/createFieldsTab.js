

import { Action }             from "../../../../../blocks/commonFunctions.js";
import { setFunctionError }   from "../../../../../blocks/errors.js";

const logNameFile = "tableFilter/buttons/editBtn/createFieldsTab";


function popupSizeAdaptive(){
    const k     = 0.89;
    const size  = window.innerWidth * k;
    const popup = $$("popupFilterEdit");
    try{
        popup.config.width = size;
        popup.resize();
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "popupSizeAdaptive"
        );
    }
}

function setValueCheckbox(){
    const content     = $$("editFormPopupScrollContent");

    if (content){
        const checkboxes  = content.getChildViews();
        const isSelectAll = $$("selectAll").getValue();
    
        if(checkboxes && checkboxes.length){
            checkboxes.forEach(function(el){
                const isCheckbox = el.config.id.includes("checkbox");
    
                if (isCheckbox){
                    if(isSelectAll){
                        el.setValue(1);
                    } else {
                        el.setValue(0);
                    }
                }
    
            });
        } 
    }
      
  
}

function returnSelectAllCheckbox(){
    const checkbox =  {
        view        : "checkbox", 
        id          : "selectAll", 
        labelRight  : 
        "<div style='font-weight:600'>Выбрать всё</div>", 
        labelWidth  : 0,
        name        : "selectAll",
        on          : {
            onChange:function(){
                Action.enableItem($$("popupFilterSubmitBtn"));
                setValueCheckbox (); 
            },
    
        } 
    };

    return checkbox;
}

function createCheckboxData(config){
    return { 
        id    : config.id, 
        label : config.label 
    };
}

function getAllCheckboxes(){
    const checkboxes           = [];
    const form = $$("filterTableForm");
    if (form){
        const filterTableElements  = form.elements;

        if (filterTableElements){
            const values = Object.values(filterTableElements);
    
            if (values && values.length){
                values.forEach(function(el){
                    checkboxes.push(
                        createCheckboxData(el.config)
                    );
                });
            } 
        }
     
    }
  

    return checkboxes;
}


function getStatusCheckboxes(array){
    let counter = 0;

    
    if (array && array.length){
        array.forEach(function(el){
            const isCheckbox = el.config.id.includes("checkbox");
            
            if (isCheckbox){
                const value = el.config.value;

                if ( !(value) || value == "" ){
                    counter ++;
                }
            }
            
        });
    } 
    
   

    return counter;
}

 

function setValueSelectAll(selectAll, val){
    try {
        selectAll.config.value = val;
        selectAll.refresh();
    } catch (err) {
        setFunctionError(
            err,
            logNameFile,
            "setSelectAllState"
        );
    }
}

function setSelectAllState(el) {
    const parent  = $$(el.id + "_checkbox").getParentView();
    const childs  = parent.getChildViews();
    const counter = getStatusCheckboxes(childs);

    const selectAll     = $$("selectAll");
    const isTrueValue = selectAll.config.value;

    if (!counter){
        setValueSelectAll(selectAll, 1);

    } else if (isTrueValue){
        setValueSelectAll(selectAll, 0);
        
    }
 
}

function checkboxOnChange (el){
    const parent  = $$(el.id + "_checkbox").getParentView();
    const childs  = parent.getChildViews();
    getStatusCheckboxes(childs);

    setSelectAllState  (el);
    
    Action.enableItem  ($$("popupFilterSubmitBtn"));

}



function returnCheckboxesContainer(layout){
    const nameList = [
        {cols:[
            {   id  : "editFormPopupScrollContent",
                css : "webix_edit-form-popup-scroll-content",
                rows: layout
            }
        ]}
    ];

    return nameList;
}

function returnTemplate(el){
    const template = {
        view        : "checkbox", 
        id          : el.id + "_checkbox", 
        labelRight  : el.label, 
        labelWidth  : 0,
        name        : el.id,
        on          : {
            onChange:function(){
                checkboxOnChange (el);
            }
        } 
    };

    return template;
}


function createCheckbox(el){

    const template = returnTemplate(el);

    const field     = $$(el.id);
    const container = $$(el.id + "_rows");
    const childs    = container.getChildViews();


    if (field && field.isVisible() || childs.length > 1 ){
        template.value = 1;
    }

    return template;
    
}


function addCheckboxesToLayout(checkboxesLayout){
    const scroll = $$("editFormPopupScroll");
    const layout = returnCheckboxesContainer(checkboxesLayout);
    try{
        if (scroll){
            scroll.addView( {rows : layout}, 1 );
        }
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "addCheckboxesToLayout"
        );
    }
}

function createCheckboxes(){

    const checkboxesLayout = [
        returnSelectAllCheckbox()
    ];


    const formData = getAllCheckboxes();

    if (formData && formData.length){
        formData.forEach(function (el){
            const isChild  = el.id.includes("child");

            if(!isChild){
                checkboxesLayout.push(
                    createCheckbox(el)
                );
            }
        });

        addCheckboxesToLayout(checkboxesLayout);
    } 
  
 
}


function stateSelectAll(){
    const selectAll  = $$("selectAll");
    
    const container  = $$("editFormPopupScrollContent");
    const checkboxes = container.getChildViews();
    const counter    = getStatusCheckboxes(checkboxes);
 
    if (!counter){
        setValueSelectAll(selectAll, 1);
    } 
    
}


function createFieldsTab (){
    
    if (window.innerWidth < 1200 ){
        popupSizeAdaptive();
    }
 
    createCheckboxes();
 
    stateSelectAll();
}

export {
    createFieldsTab
};