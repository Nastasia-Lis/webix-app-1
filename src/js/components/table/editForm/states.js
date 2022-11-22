import { setFunctionError }                     from "../../../blocks/errors.js";
import { LoadServerData, GetFields }            from "../../../blocks/globalStorage.js";
import { modalBox }                             from "../../../blocks/notifications.js";
import { Action, getComboOptions }  from "../../../blocks/commonFunctions.js";

import { saveItem, saveNewItem }                from "./buttons.js";

import { setDirtyProperty }                     from "./property.js";

import { Popup }                                from "../../../viewTemplates/popup.js";
import { Button }                               from "../../../viewTemplates/buttons.js";



const logNameFile = "tableEditForm => states";

function destructorPopup(elem){
    try{
        const popup = elem;
        if (popup){
            popup.destructor();
        }
    } catch (err){
        setFunctionError(err,logNameFile,"destructPopup");
    }
}

function enableBtn (elem){
    try{
            
        const btn = elem;

        if( btn && !(btn.isEnabled()) ){
            btn.enable();
        }
    } catch (err){
        setFunctionError(err,logNameFile,"enableBtn");
    }
}

function createDateEditor(){
    webix.editors.$popup = {
        date:{
           view:"popup",
           body:{
            weekHeader:true,
            view:"calendar",
            events:webix.Date.isHoliday,
            timepicker: true,
            icons: true,
           }
        }
     };
}

function createEmptySpace(){
    $$("propertyRefbtnsContainer").addView({height:29,width:1});
}

async function toRefTable (refTable){ 
    await LoadServerData.content("fields");
    const keys   = GetFields.keys;

    if (keys){
        if (refTable){
            Backbone.history.navigate("tree/" + refTable, { trigger : true});
            window.location.reload();
        }

    }
}

function setRefTable (srcTable){
    const table = $$("table");
    const cols  = table.getColumns();
    const tree  = $$("tree");

    
    try {
        cols.forEach(function(col,i){

            if ( col.id == srcTable ){
            
                const refTable =  col.type.slice(10);

                if ( tree.getItem(refTable) ){

                        tree.select(refTable);
                } else {

                    if ( refTable ){
                        toRefTable (refTable);
                    }
                }
            
            }

        });
    } catch (err){
        setFunctionError(err,logNameFile,"setRefTable");
        Action.hideItem($$("EditEmptyTempalte"));
    }
}


function createRefBtn(selectBtn){
    const property = $$("editTableFormProperty");
    
    function btnClick (idBtn){
        const srcTable = $$(idBtn).config.srcTable;

        function createModalBox (){
            try{
                modalBox().then(function(result){
            
                    if (result == 1 || result == 2){
                        if (result == 1){
                        
                        } else if (result == 2){
                            if (property.getValues().id){

                                saveItem(false,true);
                            } else {
                                saveNewItem(); 
                            }
                            
                        }

                        setDirtyProperty ();
                        setRefTable (srcTable);
                    
                    }
                });
                
            } catch (err){
                setFunctionError(err,logNameFile,"createModalBox");
            }
        }
        if ( property.config.dirty){
            createModalBox ();
        } else {
            setRefTable (srcTable);
        }
    }

  
    function btnLayout(){
        try{
            $$("propertyRefbtnsContainer").addView({ 
                view:"button", 
                type:"icon",
                srcTable:selectBtn,
                width:30,
                height:29,
                icon: 'icon-share-square-o',
                on: {
                    onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Перейти в родительскую таблицу");
                    },
                },
                click:function (id){
                    btnClick (id);
                }
            });
        } catch (err){
            setFunctionError(err,logNameFile,"btnLayout");
        }
    }
   
    btnLayout();
    Action.showItem($$("tablePropBtnsSpace"));
}

function createPopupOpenBtn(elem){
    const property = $$("editTableFormProperty");
    
    
    function btnClick (){
        
        function editPropSubmitClick (){
            try{
                const value = $$("editPropTextarea").getValue();
                property.setValues({ [elem.id]:[value] }, true);
            } catch (err){
                setFunctionError(err,logNameFile,"editPropSubmitClick");
            }
            destructorPopup( $$("editTablePopupText"));
        }

        function setTextareaVal(){
            try{
                const area = $$("editPropTextarea");
                if (elem.value){
                    area.setValue(elem.value);
                }
            } catch (err){
                setFunctionError(err,logNameFile,"setTextareaVal");
            }
        }

        const closePopupClick = function (){
            const area  = $$("editPropTextarea");
       
            if (area){
 
                const value = area.getValue();
        
                if (area.dirtyValue){
                    modalBox().then(function(result){
        
                        if (result == 1 || result == 2){
                            if (result == 2){
                                property.setValues({ [elem.id]:[value] }, true);
                            }
                            destructorPopup( $$("editTablePopupText"));
                        }
                    });
                } else {
                    destructorPopup( $$("editTablePopupText"));
                }
            }
           
        };


        function popupEdit(){

            const textarea = { 
                view:"textarea",
                id:"editPropTextarea", 
                height:150, 
                dirtyValue:false,
                placeholder:"Введите текст",
                on:{
                    onKeyPress:function(){

                        enableBtn ($$("editPropSubmitBtn"));

                        $$("editPropTextarea").dirtyValue = true;
                    }
                }
            };

            
            const btnSave = new Button({
    
                config   : {
                    id       : "editPropSubmitBtn",
                    hotkey   : "Ctrl+Space",
                    value    : "Добавить значение", 
                    click    : function(){
                        editPropSubmitClick();
                    },
                },
                titleAttribute : "Добавить значение в запись таблицы"
            
               
            }).maxView("primary");
            
            const popup = new Popup({
                headline : "Редактор поля  «" + elem.label + "»",
                config   : {
                    id        : "editTablePopupText",
                    width     : 400,
                    minHeight : 300,
            
                },

                closeClick :  closePopupClick,
            
                elements   : {
                    padding:{
                        left  : 9,
                        right : 9
                    },
                    rows   : [
                        textarea,
                        {height : 15},
                        btnSave,
                    ]
                  
                }
            });
            
            popup.createView ();
            popup.showPopup  ();

            setTextareaVal();
        
        }
        
        popupEdit();


    }

    function createBtnTextEditor(){
        try{
            $$("propertyRefbtnsContainer").addView({ 
                view:"button", 
                type:"icon",
                width:30,
                height:29,
                icon: 'icon-window-restore',
                on: {
                    onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Открыть большой редактор текста");
                    },
                },
                click:function ( ){
                    btnClick ( );
                }
            });
        } catch (err){
            setFunctionError(err,logNameFile,"createBtnTextEditor");
        }
    }

    createBtnTextEditor();
    Action.showItem($$("tablePropBtnsSpace"));
}

function createDatePopup(elem){

    const property = $$("editTableFormProperty");


    function btnClick(){
        const postFormatDate = webix.Date.dateToStr("%d.%m.%y");

        function setPropValues(){
            const val            = property.getValues()[elem.id]
            const postFormatHour = webix.Date.dateToStr("%H");
            const postFormatMin  = webix.Date.dateToStr("%i");
            const postFormatSec  = webix.Date.dateToStr("%s");
            const calendar       = $$("editCalendarDate");
            const btn            = $$("editPropCalendarSubmitBtn");

            function unsetDirtyProp(elem){
                elem.config.dirtyProp = false;
            }

            function setValuesDate(){
                try{
        
                    if ( val && !isNaN(postFormatHour(val)) ){
                        calendar.setValue( val );
                        $$("hourInp").setValue (postFormatHour(val));
                        $$("minInp") .setValue (postFormatMin (val));
                        $$("secInp") .setValue (postFormatSec (val));

            
                    } else {
                        calendar.setValue( new Date() );
        
                        if( btn ){
                            btn.disable();
                        }
                    }

                    unsetDirtyProp( calendar     );
                    unsetDirtyProp( $$("hourInp"));
                    unsetDirtyProp( $$("minInp" ) );
                    unsetDirtyProp( $$("secInp" ) );
            
                } catch (err){
                    setFunctionError(err,logNameFile,"setValuesDate");
                }
            }


            setValuesDate();
           
        }

        function editPropCalendarSubmitClick (){

            const propId  = property.getValues().id;

            const calendar=  $$("editCalendarDate");

            const hour    = $$("hourInp").getValue();
            const min     = $$("minInp") .getValue();
            const sec     = $$("secInp") .getValue();

            const timeVal = hour+":"+min+":"+sec;
            const dateVal = postFormatDate(calendar.getValue());

            const sentVal = dateVal+" "+timeVal;

            const errors = [];

            function validTime(item, count, idEl){

                function markInvalid (){
                    $$("timeForm").markInvalid(idEl);
                    errors.push(idEl);
                }
                 
                try{
                    if (item > count){
                        markInvalid ();
                    }

                    if ( !( /^\d+$/.test(item) ) ){
                        markInvalid ();
                    }

                    if (item.length < 2){
                        markInvalid ();
                    }

                } catch (err){
                    setFunctionError(err, logNameFile, "validTime element: " + idEl);
                }
            }

            validTime(hour,23 ,"hourInp");
            validTime(min, 59, "minInp" );
            validTime(sec, 59, "secInp" );

            function setValToProperty(){
                try{
                    if ( !(errors, errors.length) ){
                        property.setValues({ [elem.id] : sentVal}, true);

                        if(propId){
                            property.setValues({ id : propId}, true);

                        }

                        destructorPopup( $$("editTablePopupCalendar"));
                    }
                } catch (err){
                    setFunctionError(err, logNameFile, "setValToProperty");
                }
            }

            setValToProperty();

            
            return errors.length;
        }

        function popupEdit(){

            const closePopupClick = function (){
                const calendar = $$("editTablePopupCalendar");
                let check      = false;

                function checkDirty(elem){
                    if ( elem.config.dirtyProp && !check ){
                        check = true;
                    }
                }

                checkDirty ( $$("editCalendarDate")) ;
                checkDirty ( $$("hourInp") );
                checkDirty ( $$("minInp" ) );
                checkDirty ( $$("secInp" ) );

                
                if (check){
              
                    modalBox().then(function(result){

                        if (result == 1){
                            destructorPopup( calendar );
                        }
        
                        if (result == 2){

                            if (result == 2){
                                const clickResult = editPropCalendarSubmitClick ();
                   
                                if (!clickResult){
                                    destructorPopup( calendar );
                                }
                            }

                          
                        }
                    });
                } else {
                    destructorPopup( calendar );
                }

            };
          
            const dateView = {
                view:"calendar",
                format:"%d.%m.%y",
                borderless:true,
                id:"editCalendarDate",
                width:300,
                height:250,
                dirtyProp:false,
                on:{
                    onChange:function(){
                        this.config.dirtyProp = true;
                        enableBtn ($$("editPropCalendarSubmitBtn"));
                    }
                }
            } ;
        

            function returnInput(idEl){
                return {
                    view: "text",
                    name:idEl,
                    id:idEl,
                    placeholder:"00",
                    attributes:{ maxlength :2 },
                    dirtyProp:false,
                    on:{
                        onKeyPress:function(){
                            $$("timeForm").markInvalid(idEl, false);
                            enableBtn ($$("editPropCalendarSubmitBtn"));
                        },

                        onChange:function(){
                            this.config.dirtyProp = true;
                            enableBtn ($$("editPropCalendarSubmitBtn"));
                        }
                    }
                };
            }

            function timeSpacer (idEl){
                return {   
                    template:":",
                    id:idEl,
                    borderless:true,
                    width:9,
                    height:5,
                    css:"popup_time-spacer"
                };
            }

            const timeForm = {
                view:"form", 
                id:"timeForm",
                height:85,
                type:"space",
                elements:[
                    {   template:"<div style='font-size:13px!important'>"+
                        "Введите время в формате xx : xx : xx</div>",
                        borderless:true,
                        css:"popup_time-timeFormHead",
                        
                    },
                    { cols:[
                        returnInput("hourInp"),
                        timeSpacer (1),
                        returnInput("minInp"),
                        timeSpacer (2),
                        returnInput("secInp")
                    ]}
                ]
            };


    
        

            const dateEditor = {
                rows:[
                    dateView, 
                    {height:10}, 
                    timeForm,
                    {height:10}, 
                ]
            };
            
        
            const btnSave = new Button({
    
                config   : {
                    id       : "editPropCalendarSubmitBtn",
                    hotkey   : "Ctrl+Space",
                    value    : "Добавить значение", 
                    click    : function(){
                        editPropCalendarSubmitClick();
                    },
                },
                titleAttribute : "Добавить значение в запись таблицы"
            
               
            }).maxView("primary");

            
            const popup = new Popup({
                headline : "Редактор поля  «" + elem.label + "»",
                config   : {
                    id        : "editTablePopupCalendar",
                    width     : 400,
                    minHeight : 300,
            
                },

                closeClick : closePopupClick,
            
                elements : {
                    rows : [
                        dateEditor,
                        {height:15},
                        btnSave,
                    ]
                  
                }
            });
            
            popup.createView ();
            popup.showPopup  ();

         

            setPropValues();

        }
        popupEdit();
    }

    function createDateBtn(){
        try{
            $$("propertyRefbtnsContainer").addView({ 
                view:"button", 
                type:"icon",
                width:30,
                height:29,
                icon: 'icon-calendar',
                on: {
                    onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Открыть календарь");
                    },
                },
                click:function (id){
                    btnClick (id);
                }
            });
        } catch (err){
            setFunctionError(err,logNameFile,"createDateBtn");
        }
    }

    createDateBtn();
    Action.showItem($$("tablePropBtnsSpace"));
}


function setToolBtns(){
    const property      = $$("editTableFormProperty");
    const refBtns       = $$("propertyRefbtns");
    const propertyElems = property.config.elements;

    function createBtnsContainer(){
        try{
            refBtns.addView({
                id:"propertyRefbtnsContainer",
                rows:[]
            });
        } catch (err){
            setFunctionError(err,logNameFile,"createBtnsContainer");
        }
    }


    if (!(refBtns._cells.length)){

        if (!$$("propertyRefbtnsContainer")){
            createBtnsContainer();
        }

        propertyElems.forEach(function(el,i){
            if        (el.type == "combo"){
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

function createGuid() {  
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {  
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);  
    });  
}

function createEditFields (parentElement) {
   const property = $$("editTableFormProperty");

    function addEditInputs(arr){
        property.define("elements", arr);
        property.refresh();
    }

    try {
        const columnsData = $$("table").getColumns(true);
        const inpElements = Object.keys($$(parentElement).elements);
        
        if ( inpElements.length==0  ){
            const inputsArray = [];
  
            columnsData.forEach((el,i) => {
             
                function defValue (){

                    function dateFormatting (){
                        return new Date(el.default);
                    }

                    const formatData = webix.Date.dateToStr("%d.%m.%y %H:%i:%s");

                    let defVal;
                    if (el.default === "now" && el.type == "datetime"){
                        defVal = formatData(new Date());

                    } else if (Date.parse(new Date(el.default)) && el.type == "datetime" ){
                        defVal = formatData(dateFormatting ());

                    } else if (el.default.includes("make_guid")) {
                        defVal = createGuid();

                    } else if (el.default == "False"){
                        defVal = 2;

                    } else if (el.default  == "True"){
                        defVal = 1;

                    } else if (el.default !== "None" && el.default !== "null"){
                        defVal = el.default;

                    } else if (el.default  == "None"){
                        defVal = "";

                    } else if (el.default  == "null") {
                        defVal = null;
                    }


                    return defVal;
                }

                
                const template = {
                    id      : el.id,
                    label   : el.label, 
                    unique  : el.unique,
                    notnull : el.notnull,
                    length  : el.length,
                    value   : defValue ()
                    
                };

                function createDateTimeInput(){
                    template.type = "customDate";

                }
              
                function createReferenceInput(){
               
                    let findTableId   = el.type.slice(10);
                    template.type     = "combo";
                    template.css      = el.id+"_container";
                    template.options  = getComboOptions(findTableId);
                    template.template = function(obj, common, val, config){
                        let item = config.collection.getItem(obj.value);
                        return item ? item.value : "";
                    };
                }

                function createBooleanInput(){
                    template.type = "select";
                    template.options = [
                        {id:1, value: "Да"},
                        {id:2, value: "Нет"}
                    ];
                }


                function createTextInput(){
                    if (el.length == 0 || el.length > 512){
                        template.customType="popup";

                    } 
                    template.type = "text";
             
                }

                function addIntegerType(){
                    template.customType = "integer";
                }


                if (el.type == "datetime"){
                    createDateTimeInput();

                } else if (el.type.includes("reference")) {
                    createReferenceInput();

                } else if (el.type.includes("boolean")) {
                    createBooleanInput();

                } else if (el.type.includes("integer")) {
                    createTextInput();
                    addIntegerType();

                } else {
                    createTextInput();
                }
                
       
                inputsArray.push(template);
 
            });

       

            createDateEditor();
            addEditInputs(inputsArray);
            setToolBtns();
       

        } else {
            $$(parentElement).clear();
            $$(parentElement).clearValidation();

            if(parentElement=="table-editForm"){
                $$("table-delBtnId").enable();
            }
        }
    } catch (err){
        setFunctionError(err,logNameFile,"createEditFields");
    }
}



function defaultStateForm () {

    const property = $$("editTableFormProperty");
    
    function btnsState(){
        
        const saveBtn    = $$("table-saveBtn");
        const saveNewBtn = $$("table-saveNewBtn");
        const delBtn     = $$("table-delBtnId");

        if (saveNewBtn.isVisible()) {
            saveNewBtn.hide();

        } else if (saveBtn.isVisible()){
            saveBtn.hide();

        }

        delBtn.disable();
    }

    function formPropertyState(){
 
        if (property){
            property.clear();
            property.hide();
        }
    }


    function removeRefBtns(){
        const refBtns = $$("propertyRefbtnsContainer");
        const parent  = $$("propertyRefbtns");
        if ( refBtns ){
            parent.removeView( refBtns );
        }
    }

    try{
        btnsState();
        formPropertyState();
        Action.showItem($$("EditEmptyTempalte"));
        removeRefBtns();

    }catch (err){
        setFunctionError(err,logNameFile,"defaultStateForm");
    }

}

export {
    createEditFields,
    defaultStateForm
};