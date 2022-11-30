import { setFunctionError } from "../../../blocks/errors.js";

const logNameFile = "tableEditForm => property";

function editingEnd (editor, value){
    try{
        const property = $$("editTableFormProperty");
        const item     = property.getItem(editor);
        item.value     = value;

        property.updateItem(editor);

    } catch (err){
        setFunctionError(err, logNameFile, "editingEnd");
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
            e.target.value = setNum(1) + '.' + setNum(2) + '.' + setNum(3) 
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

const propertyEditForm = {   
    view     : "property",  
    id       : "editTableFormProperty", 
    css      : "webix_edit-table-form-property",
    dirty    : false,
    editable : true,
    tooltip  : propTooltipAction,
    hidden   : true,
    elements : [],
    on       : {
        onBeforeEditStop:function(state, editor){
            function setStateSaveBtn(){
                const saveBtn = $$("table-saveBtn"); 
                if (saveBtn              && 
                    saveBtn.isVisible()  &&
                  !(saveBtn.isEnabled()) ){ 
                    saveBtn.enable();
                }
            }

            setStateSaveBtn();

            const inputEditor = document.getElementById('custom-date-editor');

            if (inputEditor){
                createTemplate ();
            }

            const type = editor.config.type;
            if (type == "combo"){
                setFormDirty();
            }

        },
        onEditorChange:function(editor, value){
            editingEnd (editor, value);
            setFormDirty();
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
            const item     =  property.getItem(id);
            item.css       = "";
            property.refresh();
        },
    }
};

const propertyRefBtns = {  
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
        propertyRefBtns,
        {width:4},
        propertyEditForm,
        {width:4}
    ]
};

export {
    propertyLayout
};