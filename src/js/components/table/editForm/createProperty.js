
import { setFunctionError }        from "../../../blocks/errors.js";
import { getComboOptions }         from "../../../blocks/commonFunctions.js";

import { createDatePopup }         from "./propBtns/calendar.js";
import { createPopupOpenBtn }      from "./propBtns/textarea.js";
import { createRefBtn }            from "./propBtns/reference.js";

import { returnDefaultValue }      from "../defaultValues.js";


const logNameFile = "tableEditForm => createProperty";

function createDateEditor(){
    webix.editors.$popup = {
        date:{
           view : "popup",
           body : {
            view        :"calendar",
            weekHeader  :true,
            events      :webix.Date.isHoliday,
            timepicker  : true,
            icons       : true,
           }
        }
     };
}



function createEmptySpace(){
    $$("propertyRefbtnsContainer").addView({
        height : 29,
        width  : 1
    });
}


function createBtnsContainer(refBtns){
    try{
        refBtns.addView({
            id   : "propertyRefbtnsContainer",
            rows : []
        });
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "createBtnsContainer"
        );
    }
}

function setToolBtns(){
    const property      = $$("editTableFormProperty");
    const refBtns       = $$("propertyRefbtns");
    const propertyElems = property.config.elements;


    if (!(refBtns._cells.length)){

        if (!$$("propertyRefbtnsContainer")){
            createBtnsContainer(refBtns);
        }

        propertyElems.forEach(function(el,i){
            if (el.type == "combo"){
                createRefBtn(el.id);

            } else if (el.customType == "popup"){
                createPopupOpenBtn(el);
                
            } else if (el.type == "customDate") {
                createDatePopup(el);

            } else {    
                createEmptySpace();

            }
        });
    }
}

function addEditInputs(arr){
    const property = $$("editTableFormProperty");
    property.define("elements", arr);
    property.refresh();
}

function returnTemplate(el){
    const template = {
        id      : el.id,
        label   : el.label, 
        unique  : el.unique,
        notnull : el.notnull,
        length  : el.length,
        value   : returnDefaultValue (el),

    };

    return template;
}



function createDateTimeInput(el){
    const template =  returnTemplate(el);
    template.type  = "customDate";

    return template;

}


 function createReferenceInput(el){
   
    const template =  returnTemplate(el);    
    
    let findTableId   = el.type.slice(10);
    
    template.type     = "combo";
    template.css      = el.id + "_container";
    template.options  = getComboOptions(findTableId);
    template.template = function(obj, common, val, config){
        const value = obj.value;
        const item  = config.collection.getItem(value);
        return item ? item.value : "";
    };

    return template;
}


function createBooleanInput(el){
    const template =  returnTemplate(el);  

    template.type = "select";
    template.options = [
        {id:1, value: "Да"},
        {id:2, value: "Нет"}
    ];
    return template;
}


function createTextInput(el){
    const template =  returnTemplate(el);

    if (el.length == 0 || el.length > 512){
        template.customType="popup";

    } 
    template.type = "text";
    return template;
}

function addIntegerType(el){
    const template =  createTextInput(el);
    template.customType = "integer";
    return template;
}

function returnPropElem(el){
    let propElem;

    if (el.type == "datetime"){
        propElem = createDateTimeInput(el);

    } else if (el.type.includes("reference")) {
        propElem = createReferenceInput(el);

    } else if (el.type.includes("boolean")) {
        propElem = createBooleanInput(el);

    } else if (el.type.includes("integer")) {
        propElem = addIntegerType(el);

    } else {
        propElem = createTextInput(el);
    }

    return propElem;
}
function createProperty (parentElement) {

    const property         = $$(parentElement);
    const columnsData      = $$("table").getColumns(true);
    const elems            = property.elements;
    const propertyLength   = Object.keys(elems).length;

    try {
        
        if ( !propertyLength ){
            const propElems = [];

            columnsData.forEach((el) => {

                const propElem = returnPropElem(el);
                propElems.push(propElem);

            });

        
            createDateEditor();
            addEditInputs   (propElems);
            setToolBtns     ();
    

        } else {
            property.clear();
            property.clearValidation();

            if(parentElement == "table-editForm"){
                $$("table-delBtnId").enable();
            }
        }
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "createEditFields"
        );
    }
}

export {
    createProperty
};