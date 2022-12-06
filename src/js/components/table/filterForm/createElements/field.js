

import { getComboOptions, 
        Action }            from "../../../../blocks/commonFunctions.js";


let el ;
let uniqueId;
let typeField;



function createFieldTemplate(){

    const elemId  = el.id;
    const fieldId = elemId + "_filter-child-" + uniqueId;

    const fieldTemplate = {
        id        : fieldId, 
        name      : fieldId,
        label     : el.label,
        columnName: elemId,
        labelPosition:"top",
        on        :{
            onKeyPress:function(){
               
                $$("filterTableForm").clearValidation();
       
                const btn = $$("btnFilterSubmit");
                Action.enableItem(btn);
            },
        }
    };

    return fieldTemplate;
}


function createText(type){
    const element = createFieldTemplate();
    element.view  = "text";

    if(type == "text"){
        element.placeholder = "Введите текст";
    } else if (type == "int"){
        element.placeholder    = "Введите число";
        element.invalidMessage = 
        "Поле поддерживает только числовой формат";
        element.validate       = function(val){
            return !isNaN(val*1);
        };
    }
   

    return element;
}

function findComboTable(){
    if (el.editor && el.editor == "combo"){
        return el.type.slice(10);
    } 
}

function createCombo(type){

    const element       = createFieldTemplate();
    const findTableId   = findComboTable();

    element.view        = "combo";
    element.placeholder = "Выберите вариант";

    if (type == "default"){
        element.options     = {
            data:getComboOptions(findTableId)
        };

    } else if (type == "bool"){
        element.options = [
            {id:1, value: "Да"},
            {id:2, value: "Нет"}
        ];
    }

    return element;
}

function createDatepicker() {
    const element       = createFieldTemplate();
    element.view        = "datepicker";
    element.placeholder = "дд.мм.гг";
    element.format      = "%d.%m.%Y %H:%i:%s";
    element.timepicker  = true;
  
    return element;
}

function createField(){

    if (typeField=="text"){
        return createText("text");

    } else if (typeField=="combo"){
        return createCombo("default");

    } else if (typeField=="boolean"){
        return createCombo("bool");

    } else if (typeField=="date"){
        return createDatepicker();

    } else if (typeField=="integer"){
        return createText("int");

    }

}


function field (id, type, element){
    uniqueId    = id;
    el          = element;
    typeField   = type;

    return createField();
}

export {
    field
};