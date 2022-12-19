import { setFunctionError }   from "../../../blocks/errors.js";
import { Action, getItemId }  from "../../../blocks/commonFunctions.js";
import { mediator }           from "../../../blocks/_mediator.js";
const logNameFile = "tableEditForm => property";

function editingEnd (editor, value){

    try{
        const property = $$("editTableFormProperty");
        const item     = property.getItem(editor);
        item.value     = value;

        property.updateItem(editor);

    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "editingEnd"
        );
    }
}

function propTooltipAction (obj){
   
    const label      = obj.label;
    const labelText  = "Название: " + label + " <br>";
    const formatData = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
    let value;
    let typeElem;
    
    if        ( obj.type       == "date" ){
        typeElem = "Выберите дату";

    } else if ( obj.type       == "combo" ){
        typeElem = "Выберите значение";
        const node     = $$("editTableFormProperty").getItemNode(obj.id);

        if (node){
            const valueCss = "webix_property_value";
            const valueDiv = node.getElementsByClassName(valueCss)[0];
            const text     = valueDiv.innerHTML;
            obj.value      = text ? text : obj.value;
        }

    } else if ( obj.customType == "integer" ){
        typeElem = "Введите число";

    } else {
        typeElem = "Введите текст";
    } 
    
    if (obj.type == "date"){
        value = formatData(obj.value);  
    } else {
        value = obj.value;
    }

    if (obj.value){
        return labelText + "Значение: " + value;
    } else {
        return labelText + typeElem;
    }
}


function createTemplate (){
    document.getElementById('custom-date-editor')
    .addEventListener('input', function (e) {

        const x = e.target.value.replace(/\D/g, '')
        .match(/(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})/);

        function setNum(index){
            return (x[index] ? x[index] : ' __ ');
        }

        if (e.inputType !== "deleteContentBackward"){
            e.target.value =  setNum(1) + '.' +  setNum(2) + '.' + setNum(3) 
            + '  '+ 
            setNum(4) + ':' + setNum(5) + ':' + setNum(6);
        }
     
    });
}

function setFormDirty(){
    const form = $$("table-editForm");
    if ( form && !(form.isDirty()) ){
        form.setDirty(true);
    }
  
}

function isEqual(obj1, obj2) {
    if (obj1){
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }
        for (let key of keys1) {
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        }
    } else {
        return false;
    }
    return true;
}

function setTabInfo(sentVals){
    const tabData =  mediator.tabs.getInfo();

    if (tabData){
        if (!tabData.temp){
            tabData.temp = {};
        }
        tabData.temp.edit = sentVals;
    }
}

function createTempData(self){
    if (!self.config.tempData){
        self.config.tempData = true;
    }
   
    const id      = getItemId();
    const status  = self.config.tableStatus;
    const values  = self.getValues();

    const tableValue  = $$("table").getItem(values.id);
   
    const storageName = "editFormTempData";

    if (!isEqual(tableValue, values)){
        const sentVals = {
            table : id,
            status: status,
            values: values
        };

        setTabInfo(sentVals);

        webix.storage.local.put(
            storageName, 
            sentVals
        );
    } else {
       // webix.storage.local.remove(storageName);
    }
}


const propertyEditForm = {   
    view     : "property",  
    id       : "editTableFormProperty", 
    css      : "webix_edit-table-form-property",
    dirty    : false,
    editable : true,
    tooltip  : propTooltipAction,
    hidden   : true,
    tempData : false, // local storage
    elements : [],
    keyPressTimeout:800,
    statusForm     :null, // put or post
    on       : {

        onAfterEditStop:function(state, editor){
            Action.enableItem($$("table-saveBtn"));

            const inputEditor = document
            .getElementById('custom-date-editor');

            if (inputEditor){
                createTemplate ();
            }
 
            setFormDirty();// for combo inputs

            this.callEvent("onNewValues", [state.value, editor.config]);
        },

        onNewValues:function(value, editor){
            editingEnd (editor.id, value);
            createTempData(this);
        },

        onEditorChange:function(){
            setFormDirty(); // for text inputs
        },

        onBeforeRender:function (){

            const size = this.config.elements.length * 28;
            
            if (size && this.$height !== size){
                this.define("height", size);
                this.resize();
            }
    
          
        },

        onItemClick:function(id){
            const property = $$("editTableFormProperty");
            const item     = property.getItem(id);
            item.css       = "";
            property.refresh();
        },

        onTimedKeyPress:function(){
          
            createTempData(this);
            // во время ввода 
        },
 
       
    }
    
};

const propertyRefBtns = {  
    id:"propertyContainer",
    cols:[
        {   id:"propertyRefbtns",  
            rows:[]
        },
        {width:5}
    ] 
 
};


const propertyLayout = {   
    scroll:"y", 
    cols:[
        {width:4},
        propertyEditForm,
        {width:4},
        propertyRefBtns,
    ]
};


export {
    propertyLayout
};