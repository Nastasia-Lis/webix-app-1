import { setFunctionError } from "../../../blocks/errors.js";

const logNameFile = "tableEditForm => property";

function setDirtyProperty (type=false){
    try{
        const property = $$("editTableFormProperty");
        if(property){
            property.config.dirty = type;
            property.refresh();
        }
    } catch (err){
        setFunctionError(err,logNameFile,"setDirtyProperty");
    } 
}


function editingEnd (editor,value){
    try{
        const property = $$("editTableFormProperty");
        const item     = property.getItem(editor);
        item.value     = value;

        property.updateItem(editor);
        setDirtyProperty (true);

    } catch (err){
        setFunctionError(err,logNameFile,"editingEnd");
    }
}

function propTooltipAction (obj){
    const label      = obj.label;
    const labelText  = "Название: "+label+" <br>";
    const formatData = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
    let value;
    let typeElem;
    
    if        ( obj.type       == "date" ){
        typeElem = "Выберите дату";

    } else if ( obj.type       == "combo" ){
        typeElem = "Выберите значение";

    } else if ( obj.customType == "integer" ){
        typeElem = "Введите число";

    } else {
        typeElem = "Введите текст";
    } 
    
    if (obj.type == "date"){
        value = formatData(obj.value);
        
    } else{
        value = obj.value;
    }

    if (obj.value){
        return labelText + "Значение: " + value;
    } else {
        return labelText + typeElem;
    }
}


function createTemplate (){
    document.getElementById('custom-date-editor').addEventListener('input', function (e) {

        const x = e.target.value.replace(/\D/g, '')
        .match(/(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})/);

        function setNum(index){
            return (x[index] ? x[index] : ' __ ');
        }

        if (e.inputType !== "deleteContentBackward"){
            e.target.value = setNum(1) + '.' + setNum(2) + '.' + setNum(3) + '  '+ 
            setNum(4) + ':' + setNum(5) + ':' + setNum(6);
        }
     
    });
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
        onEditorChange:function(id, value){
        
            function setStateSaveBtn(){
                const saveBtn =$$("table-saveBtn"); 
                if (saveBtn              && 
                    saveBtn.isVisible()  &&
                  !(saveBtn.isEnabled()) ){ 
                    saveBtn.enable();
                }
            }

            editingEnd (id,value);
            setStateSaveBtn();

            const inputEditor = document.getElementById('custom-date-editor');

            if (inputEditor){
                createTemplate ();
            }
       
        },
        onBeforeRender:function (){

            const size = this.config.elements.length*28;
            
            if (size && this.$height !== size){
                this.define("height", size);
                this.resize();
            }
    
          
        },

        onAfterEditStop:function(state, editor){
            if (state.value !== state.old ){
                editingEnd (editor.id, state.value);
            }
        },

        onItemClick:function(id){
            const property = $$("editTableFormProperty");
            const item     =  property.getItem(id);
            item.css       = "";
            property.refresh();
        }

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
    setDirtyProperty,
    propertyLayout
};