 
///////////////////////////////
//
// Дефолтные значения пустых полей              (create default values)
//
// Layout редактора                             (create layout)
//
// Кнопки редактора                             (create form btns)
//
// Создание компонента редактора                (create property)
//
// Медиатор                                     (create mediator)
//
// Посты и удаление в редакторе форм            (create server actions)
//
// Состояния редактора записей                  (create states)
//
// Кнопка навигации на другую страницу          (create reference btn)
//
// Кнопка календаря                             (create calendar btn)
//
// Кнопка с расширенным полем для ввода текста  (create textarea btn)
//
// Property компонент                           (create property layout)
//
// Дефолтное состояние редактора                (create default state)
//
// Валидация перед постом записи                (create validation)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////


import { mediator }                 from "../../blocks/_mediator.js";
import { modalBox }                 from "../../blocks/notifications.js";
import { Action, 
        getComboOptions, getItemId, 
        isArray }                   from "../../blocks/commonFunctions.js";
import { Button }                   from "../../viewTemplates/buttons.js";
import { createEmptyTemplate }      from "../../viewTemplates/emptyTemplate.js";
import { setFunctionError }         from "../../blocks/errors.js";

import { setLogValue }              from "../logBlock.js";
import { popupExec }                from "../../blocks/notifications.js";
import { ServerData }               from "../../blocks/getServerData.js";

import { Popup }                    from "../../viewTemplates/popup.js";


const logNameFile = "table/editForm";


//create default values

const formatData  = webix.Date.dateToStr("%d.%m.%y %H:%i:%s");


function createGuid() {  
    const mask = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return mask.replace(/[xy]/g, function(c) {  
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);  
    });  
}

function dateFormattingLocic (el){
    const date = new Date(el.default);
    return formatData(date);
}

function returnDefaultValue (el){
    let defVal;



    const def      = el.default;
    const parsDate = Date.parse(new Date(def));

    const type     = el.type ;

    if (def === "now" && type == "datetime"){
        defVal = formatData(new Date());
 
    } else if (parsDate && type == "datetime" ){
        defVal = dateFormattingLocic (el);

    } 

    else if (def && def.includes("make_guid")) {
        defVal = createGuid();

    } 
    
    else if (def == "False"){
        defVal = 2;

    } else if (def  == "True"){
        defVal = 1;

    } 

    else if (def !== "None" && def !== "null"){
        defVal = def;

    } else if (def  == "null") {
        defVal = null;
    }


    return defVal;
}



//create validation

function validateProfForm (){

    const errors = {};
    const messageErrors = [];
    const property      = $$("editTableFormProperty");
    
    function checkConditions (){ 
       
        const values = property.getValues();
        if (values){
            const propVals = Object.keys(values);

            if (propVals.length){
                propVals.forEach(function(el){
    
    
                    const propElement = property.getItem(el);
                    const values      = property.getValues();
        
                    let propValue  = values[el];
                    errors[el] = {};
        
                    function numberField(){
                        
                        function containsText(str) {
                            return /\D/.test(str);
                        }
        
               
                        if (propElement.customType              &&
                            propElement.customType == "integer" ){
        
                            const check =  containsText(propValue) ;
        
                            if ( check ){
                                errors[el].isNum = "Данное поле должно содержать только числа";
                            } else {
                                errors[el].isNum = null;
                            }
                               
                        }
                    }
        
                    function dateField(){
        
                        function getAllIndexes(arr, val) {
                            let indexes = [], i;
                            for(i = 0; i < arr.length; i++){
                                if (arr[i] === val){
                                    indexes.push(i);
                                }
                            }
                                 
                            return indexes;
                        }
        
                        function isTrueLength(arr){
                            if (arr.length === 2){
                                return true;
                            }
                        }
        
                        function isTrueIndexes(arr, first, second){
                            if (arr[0] == first && arr[1] == second){
                                return true;
                            }
                        }
        
                        function checkArr(arr, firstIndex, secondIndex){
                            if (isTrueLength(arr) && 
                                isTrueIndexes(arr, firstIndex, secondIndex )){
                                    return true;
                            }
                        }
         
                        function findDividers(arr){
                            if (arr.length === 17) {
                                const dateDividers = getAllIndexes(arr, ".");
                                const timeDividers = getAllIndexes(arr, ":");
        
                                const dateResult = checkArr(dateDividers, 2,  5 );
                                const timeResult = checkArr(timeDividers, 11, 14);
        
                                if (dateResult && timeResult){
                                    return false;
                                } else {
                                    return true;
                                }
                            } else {
                                return true;
                            }
                        }
                 
                        if (propElement.type                 &&
                            propElement.type == "customDate" &&
                            propValue                        ){
                         
                            const dateArray = propValue.split('');
                            
                            let check      = findDividers(dateArray);
                            let countEmpty = 0;
                                 
                            const x = propValue.replace(/\D/g, '')
                            .match(/(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})/);
                
                            for (let i = 1; i < 7; i++) {
        
                                if (x[i].length == 0){
                                    countEmpty++;
                                }
        
                                if (x[i].length !== 2){
                                 
                                    if (!check){
                                        check = true;
                                    }
                                }
                            }
        
        
                            if ( countEmpty == 6 ){
                                errors[el].date = null;
        
                            } else {
        
                                if( (x[1] > 31 || x[1] < 1) ||
                                    (x[2] > 12 || x[2] < 1) ||
        
                                    x[4] > 23 ||
                                    x[5] > 59 ||
                                    x[6] > 59 ){
                                        check = true;
                                    }
              
                                if ( check ) {
                                    errors[el].date = 
                                    "Неверный формат даты. Введите дату в формате xx.xx.xx xx:xx:xx";
            
                                } else {
                                    errors[el].date = null;
                                }
                            }
                               
                        }
               
                    }
        
                    function valLength(){ 
                        try{
                       
                            if(propValue){
                                
                                if (propValue.length > propElement.length && propElement.length !== 0){
                                    errors[el].length = "Длина строки не должна превышать " + propElement.length + " симв.";
                                } else {
                                    errors[el].length = null;
                                }
                            }
                        } catch (err){
                            setFunctionError(err,logNameFile,"valLength");
                        }
                    }
        
                    function valNotNull (){
                        try{
                            if ( propElement.notnull == false && propValue && propValue.length == 0 ){
                                errors[el].notnull = "Поле не может быть пустым";
                            } else {
                                errors[el].notnull = null;
                            }
                        } catch (err){
                            setFunctionError(err, logNameFile, "valNotNull");
                        }
                    }
        
                    function valUnique (){
                        
                        errors[el].unique = null;

                        const pull = $$("table").data.pull;
                                        
                        if (propElement.unique == true && pull){
    
                            const tableRows   = Object.values(pull);
    
                            if (tableRows.length){
                                tableRows.forEach(function(row){
                                    let tableValue = row[el];
        
                                    function numToString(element){
                                        if (element && typeof element === "number"){
                                            return element.toString();
                                        } else {
                                            return element;
                                        }
                                    }
        
                                    tableValue = numToString(tableValue);
                                    propValue  = numToString(propValue);
                            
                                    if (tableValue && typeof tableValue == "number"){
                                        tableValue = tableValue.toString();
                                    }
        
                                    if (propValue && tableValue){
                                        const isIdenticValues = propValue.localeCompare(tableValue) == 0;
                                        const tableElemId     = row.id;
                                        const propElemId      = values.id;
        
                                        if (isIdenticValues && propElemId !== tableElemId){
                                            errors[el].unique = "Поле должно быть уникальным";
            
                                        } 
                                        
                                    }
                                });
                            } else {
                                setFunctionError("array is null", logNameFile, "valUnique");
                            }
                          
                        }
                    
                         
                    }
                   
                    dateField   ();
                    numberField ();
                    valLength   ();
                    valNotNull  ();
                    valUnique   ();
                });
            } else {
                setFunctionError("array length is null", logNameFile, "checkConditions");
            }
          
        }
        
    }

    function createErrorMessage (){
     
        function findErrors (){
         
            if (errors){
                const values = Object.values(errors);
                if (values && values.length){
                    values.forEach(function(col, i){

                        function createMessage (){
                            Object.values(col).forEach(function(error,e){
                                if (error !== null){
                                    let nameCol = Object.keys(errors)[i];
                                    let textError = error;
                                    let typeError = Object.keys(col)[e];
                                    messageErrors.push({nameCol,typeError,textError})
                                }
                                
                            });
                            return messageErrors;
                        }
        
                        createMessage ();
                
                    });
                } else {
                    setFunctionError("array length is null", logNameFile, "findErrors");
                }
            
            }
           
        }

        findErrors ();
        
    }
    try{
        checkConditions ();
        createErrorMessage ();
    } catch (err){
        setFunctionError(err, logNameFile, "validateProfForm");
    }

  
    if (messageErrors && messageErrors.length){
     
        messageErrors.forEach(function(prop){
            const item =  property.getItem(prop.nameCol);
            item.css = "propery-error";
            property.refresh();

        });

       
    } 
    return messageErrors;
}

function setLogError (){
    try{
        const table = $$("table");
        validateProfForm ().forEach(function(el){

            let nameEl;

            const cols = table.getColumns(true);
            if (cols && cols.length){
                table.getColumns(true).forEach(function(col){
             
                    if (col.id == el.nameCol){
                        nameEl = col.label;
                    }
                });
    
                setLogValue("error", el.textError + " (Поле: " + nameEl + ")");
            } else {
                setFunctionError("array is null", logNameFile, "setLogError");
            }

   
        });

    } catch (err){
        setFunctionError(err, logNameFile, "setLogError");
    }
}


function uniqueData (itemData){
    const validateData = {};
    if (itemData) {
        const table      = $$("table");
        const dataValues = Object.values(itemData);

        if (dataValues.length){
            dataValues.forEach(function(el, i){

                const oldValues    = table.getItem(itemData.id);
                const oldValueKeys = Object.keys(oldValues);
    
                function compareVals (){
                    const newValKey = Object.keys(itemData)[i];
    
                    oldValueKeys.forEach(function(oldValKey){
                        if (oldValKey == newValKey){
                            
                            if (oldValues   [oldValKey] !== Object.values(itemData)[i]){
                                validateData[newValKey]  =  Object.values(itemData)[i];
                            } 
                            
                        }
                    }); 
                }
                compareVals ();
            });
        } else {
            setFunctionError("array is null", logNameFile, "uniqueData");
        }
     
    } 
    
 
      
     

    return validateData;
}



//create default state

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

    } catch (err){
        setFunctionError(err, logNameFile, "defaultStateForm");
    }

}


//create property layout

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
 
    const tableId = $$("table").getSelectedId();
    let id;
    if (tableId){
        id = tableId.id;
    }

    if (tabData){
        if (!tabData.temp){
            tabData.temp = {};
        }
        tabData.temp.edit = {
            values: sentVals,
            selected: id
        };

        mediator.tabs.setInfo(tabData);
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

    mediator.tabs.setDirtyParam();
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



//create reference btn

let selectBtn;
let idPost;

function createTabConfig(refTable){
    const infoData = {

        tree : {
            field : refTable,
            type  : "dbtable" 
        },
        temp : {
            edit  : {
                selected : idPost, 
                values   : {
                    status : "put",
                    table  : refTable,
                    values : {}
                }
            },
          
        }
    };  
    
    return infoData;
}

function setRefTable (srcTable){
    if (srcTable){
        const table = $$("table");
        const cols  = table.getColumns();
 

    
        if (cols && cols.length){
            cols.forEach(function(col){

                if ( col.id == srcTable ){
                
                    const refTable = col.type.slice(10);
                    
                    const infoData = createTabConfig(refTable);

                    mediator.tabs.openInNewTab(infoData);
                
                }

            });
        } else {
            setFunctionError(
                "array length is null", 
                logNameFile, 
                "setRefTable"
            );

            Action.hideItem($$("EditEmptyTempalte")); 
        }
           
      

    }

}


function findIdPost(editor){
    const prop = $$("editTableFormProperty");
    const item = prop.getItem(editor);
    return item.value;
}

function btnClick (idBtn){
    const config      = $$(idBtn).config;
    const srcTable    = config.srcTable;

    idPost            = findIdPost(config.idEditor);

    setRefTable    (srcTable);
  
}

function btnLayout(idEditor){

    const btn = new Button({

        config   : {
            width    : 30,
            height   : 29,
            idEditor : idEditor,
            icon     : "icon-share-square-o", 
            srcTable : selectBtn,
            click    : function(id){
                btnClick (id);
            },
        },
        titleAttribute : "Перейти в родительскую таблицу"
    
       
    }).minView();

    try{
        $$("propertyRefbtnsContainer").addView(btn);
    } catch (err){
        setFunctionError(err, logNameFile, "btnLayout");
    }
}

function createRefBtn(btn){
    selectBtn = btn;
    btnLayout(btn);
    Action.showItem($$("tablePropBtnsSpace"));
}





//create calendar btn

let property;
function dirtyProp(elem){
    elem.config.dirtyProp = false;
}

function formatDate(format){
    return webix.Date.dateToStr("%" + format);
}

const formatHour = formatDate("H");
const formatMin  = formatDate("i");
const formatSec  = formatDate("s");


function setTimeInputsValue(value){
    $$("hourInp").setValue (formatHour(value));
    $$("minInp") .setValue (formatMin (value));
    $$("secInp") .setValue (formatSec (value));
}

function unsetDirtyPropInputs(calendar){
    dirtyProp( calendar     );
    dirtyProp( $$("hourInp"));
    dirtyProp( $$("minInp" ) );
    dirtyProp( $$("secInp" ) );
}

function setPropValues(elem){
 
    const val       = property.getValues()[elem.id];
    const valFormat = formatHour(val);

    const calendar  = $$("editCalendarDate");
    const btn       = $$("editPropCalendarSubmitBtn");

    try{

        if ( val && !isNaN(valFormat) ){
            calendar.setValue (val);
            setTimeInputsValue(val);

        } else {
            calendar.setValue( new Date() );
            Action.disableItem(btn);
        }

        unsetDirtyPropInputs(calendar);

    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "setValuesDate"
        );
    }
    
}

function returnTimeValue(h, m, s){
    return h + ":" + m+":" + s;
}

function returnSentValue(date, time){
    return date + " " + time;
}

const errors = [];

function validTime(item, count, idEl){

    function markInvalid (){
        try{
            $$("timeForm").markInvalid(idEl);
        } catch (err){
            setFunctionError(
                err, 
                logNameFile, 
                "validTime element: " + idEl
            );
        }
        errors.push(idEl);
    }
    
    if (item > count){
        markInvalid ();
    }

    if ( !( /^\d+$/.test(item) ) ){
        markInvalid ();
    }

    if (item.length < 2){
        markInvalid ();
    }

    return errors;
}

function setValToProperty(sentVal, elem){
    const propId  = property.getValues().id;
    try{

        if (!errors.length){
       
            property.setValues({ 
                [elem.id] : sentVal
            }, true);

            if(propId){
                property.setValues({ 
                    id : propId
                }, true);

            }
            setDataToStorage(elem, sentVal);

            Action.destructItem($$("editTablePopupCalendar"));
        }
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "setValToProperty"
        );
    }
}

function inputItterate(name, count){
    const val = $$(name).getValue();
    validTime(val, count, name);
    return val;
}

function setDataToStorage(elem, value){
    const prop   = $$("editTableFormProperty");
    const editor = prop.getItem(elem.id);
    prop.callEvent("onNewValues", [value, editor]);
}


function submitClick (elem){
    errors.length  = 0;

    const calendar = $$("editCalendarDate");
    const form     = $$("table-editForm");

    const hour = inputItterate("hourInp", 23);
    const min  = inputItterate("minInp",  59);
    const sec  = inputItterate("secInp",  59);
  
    const calendarVal    = calendar.getValue();
    const fullFormatDate = formatDate("d.%m.%y");
    const dateVal        = fullFormatDate(calendarVal);

    const timeVal        = returnTimeValue(hour, min, sec);

    const sentVal = returnSentValue(dateVal, timeVal);
    setValToProperty(sentVal, elem);
 
    form.setDirty(true);

    return errors.length;
}

function isDirty(){

    let check = false;

    function checkDirty(el){
        if (el.config.dirtyProp && !check){
            check = true;
        }
    }

    checkDirty ($$("editCalendarDate"));
    checkDirty ($$("hourInp"         ));
    checkDirty ($$("minInp"          ));
    checkDirty ($$("secInp"          ));

    return check;
}

function closePopup (elem){
    const calendar = $$("editTablePopupCalendar");

    if (calendar){
        
        if (isDirty(calendar)){
    
            modalBox().then(function(result){

                if (result == 1){
                    Action.destructItem(calendar);
                }

                if (result == 2 && !submitClick(elem)){

                    Action.destructItem(calendar);

                }
            });
        } else {
            Action.destructItem(calendar);
        }
    }
}

function returnCalendar(){
    const calendar = {
        view        :"calendar",
        id          :"editCalendarDate",
        format      :"%d.%m.%y",
        borderless  :true,
        width       :300,
        height      :250,
        dirtyProp   :false,
        on          :{
            onChange:function(){
                this.config.dirtyProp = true;
                Action.enableItem($$("editPropCalendarSubmitBtn"));
            }
        }
    } ;

    return calendar;
}


function returnInput(idEl){
    const calendar = $$("editPropCalendarSubmitBtn");
    return {
        view        : "text",
        name        : idEl,
        id          : idEl,
        placeholder : "00",
        attributes  : { maxlength :2 },
        dirtyProp   : false,
        on          : {
            onKeyPress:function(){
                $$("timeForm").markInvalid(idEl, false);
                Action.enableItem(calendar);
            },

            onChange:function(){
                this.config.dirtyProp = true;
                Action.enableItem(calendar);
            }
        }
    };
}

function returnTimeSpacer (idEl){
    return {   
        template   : ":",
        id         : idEl,
        borderless : true,
        width      : 9,
        height     : 5,
        css        : "popup_time-spacer"
    };
}

function returnTimePrompt(){
 
    const prompt = {   
        template:"<div style='font-size:13px!important'>"+
        "Введите время в формате xx : xx : xx</div>",
        borderless:true,
        css:"popup_time-timeFormHead",
    };

    return prompt;
}

function returnTimeForm(){
    const timeForm = {
        view    : "form", 
        id      : "timeForm",
        height  : 85,
        type    : "space",
        elements: [
            returnTimePrompt(),
            { cols:[
                returnInput("hourInp"),
                returnTimeSpacer (1),
                returnInput("minInp"),
                returnTimeSpacer (2),
                returnInput("secInp")
            ]}
        ]
    };

    return timeForm;
}

function returnDateEditor(){
    const dateEditor = {
        rows:[
            returnCalendar(), 
            {height:10}, 
            returnTimeForm(),
            {height:10}, 
        ]
    };

    return dateEditor;
}

function returnBtn(elem){
    const btn = new Button({

        config   : {
            id       : "editPropCalendarSubmitBtn",
            hotkey   : "Ctrl+Space",
            value    : "Добавить значение", 
            click    : function(){
                submitClick(elem);
            },
        },
        titleAttribute : "Добавить значение в запись таблицы"
    
       
    }).maxView("primary");

    return btn;

}
function popupEdit(elem){

    const headline = "Редактор поля  «" + elem.label + "»";

    const popup = new Popup({
        headline : headline,
        config   : {
            id        : "editTablePopupCalendar",
            width     : 400,
            minHeight : 300,
        },
        closeConfig: {
            currElem : elem
        },
        closeClick : closePopup ,
        elements : {
            rows : [
                returnDateEditor(),
                {height:15},
                returnBtn(elem),
            ]
          
        }
    });
    
    popup.createView ();
    popup.showPopup  ();

    setPropValues(elem);

}

function propBtnClick(elem){
    property = $$("editTableFormProperty");
    popupEdit(elem);
}


function createDateBtn(elem){

    const btn = new Button({

        config   : {
            width    : 30,
            height   : 29,
            icon     : "icon-calendar", 
            click    : function(){
                propBtnClick (elem);
            },
        },
        titleAttribute : "Открыть календарь"
    
       
    }).minView();


    try{
        $$("propertyRefbtnsContainer").addView(btn);
    } catch (err){
        setFunctionError(err, logNameFile, "createDateBtn");
    }
}

function createDatePopup(el){
    createDateBtn(el);
    Action.showItem($$("tablePropBtnsSpace"));
}



//create textarea btn

let propertyElem;

function setPropValue(el, value){ 
    propertyElem.setValues({ 
        [el.id]:[value] 
    }, true);
}


function submitBtnClick (el){
    try{
        const value = $$("editPropTextarea").getValue();
      
        setPropValue(el, value);
 
        $$("table-editForm").setDirty(true);

        setDataToStorage(el, value);
     
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "submitBtnClick"
        );
    }

    Action.destructItem($$("editTablePopupText"));
}

function setTextareaVal(el){
    try{
        const area = $$("editPropTextarea");
        const val  = el.value;
        if (val){
            area.setValue(val);
        }
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "setTextareaVal"
        );
    }
}

function createModalBox(el, area){

    const value = area.getValue();
    const popup = $$("editTablePopupText");

    if (area.dirtyValue){
        modalBox().then(function(result){

            if (result == 1 || result == 2){
                if (result == 2){
                    setPropValue(el, value);
                }
                Action.destructItem(popup);
            }
        });
    } else {
        Action.destructItem(popup);
    } 
}

function closePopupClick(el){
  
    const area  = $$("editPropTextarea");

    if (area){
        createModalBox(el, area);
    }

    return closePopupClick;
}




function returnTextArea(){

    const textarea = { 
        view        : "textarea",
        id          : "editPropTextarea", 
        height      : 150, 
        dirtyValue  : false,
        placeholder : "Введите текст",
        on          : {
            onAfterRender: webix.once(function(){
                const k     = 0.8;
                const width = $$("editTablePopupText").$width;

                this.config.width = width * k;        
                this.resize();    
            }),
            onKeyPress:function(){
                Action.enableItem($$("editPropSubmitBtn"));

                $$("editPropTextarea").dirtyValue = true;
            },
        }
    };

    return textarea;
}

function returnSubmitBtn(el){
    const btn = new Button({

        config   : {
            id       : "editPropSubmitBtn",
            disabled : true,
            hotkey   : "Ctrl+Space",
            value    : "Добавить значение", 
            click    : function(){
                submitBtnClick(el);
            },
        },
        titleAttribute : "Добавить значение в запись таблицы"
    
       
    }).maxView("primary");

    return btn;
}


function createPopup(el){
    const headline = "Редактор поля  «" + el.label + "»";

    const popup = new Popup({
        headline : headline,
        config   : {
            id        : "editTablePopupText",
            width     : 400,
            minHeight : 300,
    
        },

        closeConfig: {
            currElem : el,
        },

        closeClick :  closePopupClick(el),
    
        elements   : {
            padding:{
                left  : 9,
                right : 9
            },
            rows   : [
                returnTextArea(),
                {height : 15},
                returnSubmitBtn(el),
            ]
          
        }
    });
    
    popup.createView ();
    popup.showPopup  ();

    setTextareaVal(el);

    $$("editPropTextarea").focus();
}

function createBtnTextEditor(el){
    const btn = new Button({

        config   : {
            width    : 30,
            height   : 29,
            icon     : "icon-window-restore", 
            click    : function(){
                createPopup(el);
            },
        },
        titleAttribute : "Открыть большой редактор текста"
    
       
    }).minView();
    
    try{
        $$("propertyRefbtnsContainer").addView(btn);
    } catch (err){
        setFunctionError(err,logNameFile,"createBtnTextEditor");
    }
}



function createPopupOpenBtn(el){
    propertyElem = $$("editTableFormProperty");

    createBtnTextEditor(el);
    Action.showItem($$("tablePropBtnsSpace"));
}



//create mediator
class EditForm {
    static createForm (){
        $$("flexlayoutTable").addView(editTableBar());
        Action.enableItem($$("table-newAddBtnId"));
    }

    static defaultState (clearDirty = true){
        editTableDefState(clearDirty);
    }

    static putState     (){
       editTablePutState();
    }

    static postState    (){
        editTablePostState();
    }

    static put (updateSpace = true, isNavigate = false){
        return putTable (updateSpace, isNavigate, this); 
    }

    static post (updateSpace = true, isNavigate = false){
        return postTable(updateSpace, isNavigate, this);
    }

    static remove (){
        removeTableItem(this);
    }

    static clearTempStorage(){
        $$("editTableFormProperty").config.tempData = false;
        webix.storage.local.remove("editFormTempData");
    }


}


//create server actions
function unsetDirtyProp(){
 
    $$("table-editForm").setDirty(false);
    mediator.tabs.setDirtyParam();
    mediator.tables.editForm.clearTempStorage();
}

function updateTable (itemData){
    try{
        const table = $$("table");
        const id    = itemData.id;
        table.updateItem(id, itemData);
        table.clearSelection();
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "updateTable"
        );
    }  
    
}



function dateFormatting(arr){
    const formattingArr = arr;
    if (isArray(formattingArr, logNameFile, "dateFormatting")){
        const vals          = Object.values(arr);
        const keys          = Object.keys(arr);
      
        if (keys.length){
            keys.forEach(function(el, i){
                const prop       = $$("editTableFormProperty");
                const item       = prop.getItem(el);
                const formatData = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
        
                if ( item.type == "customDate" ){
                    formattingArr[el] = formatData(vals[i]);
                }
            });
        } else {
            setFunctionError(
                "array length is null",
                logNameFile,
                "dateFormatting"
            );
        }
      
    }
  


    return formattingArr;
}

function formattingBoolVals(arr){
    const table = $$( "table" );
    const cols  = table.getColumns();
    if (isArray(cols, logNameFile, "formattingBoolVals")){
        cols.forEach(function(el,i){

            if ( arr[el.id] && el.type == "boolean" ){
                if (arr[el.id] == 2){
                    arr[el.id] = false;
                } else {
                    arr[el.id] = true;
                }
            }
        });
    }
    

    return arr;

} 

function createSentObj (values){
    const uniqueVals     = uniqueData     (values    );
    const dateFormatVals = dateFormatting (uniqueVals);
    return formattingBoolVals(dateFormatVals);
}

function putTable (updateSpace, isNavigate, form){
    try{    
        const property = $$("editTableFormProperty");
        const itemData = property.getValues();   
        const currId   = getItemId ();
        const isError  = validateProfForm().length;
        const id       = itemData.id;

        const isDirtyForm = $$("table-editForm").isDirty();
        if (!isError && id && isDirtyForm){
            const sentObj = createSentObj (itemData);


            return new ServerData({
    
                id           : `${currId}/${id}`
               
            }).put(sentObj).then(function(data){
            
                if (data){
            
                    if (updateSpace){
                        form.defaultState();
                    }

                 // для модальных окон без перехода на другую стр.
                    if (updateSpace || !isNavigate){ 
                        updateTable   (itemData);
                    }

                    unsetDirtyProp();

                    setLogValue(
                        "success", 
                        "Данные сохранены", 
                        currId
                    );

                    return true;
                }
                 
            });


        } else {
            if (isError){
                validateProfForm()
                .forEach(function(){
                    setLogError ();
                });
            } else if (!id){
                setLogValue(
                    "error", 
                    "Поле id не заполнено"
                );
            } else if (!isDirtyForm){
                setLogValue(
                    "error", 
                    "Обновлять нечего"
                );
            }
           
        }
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "saveItem"
        );
    }
}


// post
function removeNullFields(arr){
    const vals    = Object.values(arr);
    const keys    = Object.keys(arr);
    const sentObj = {};

    if (isArray(vals, logNameFile, "removeNullFields")){
        vals.forEach(function(el,i){
            if (el){
                sentObj[keys[i]]= el;
            }
            dateFormatting(arr);
        });
    }
   

    return sentObj;
}

function setCounterVal (remove){
    try{
        const counter  = $$("table-findElements");
      
        const reccount = $$("table").config.reccount;

        let full;

        if (remove){
            full = reccount - 1;

        } else {
            full = reccount + 1;

        }

        $$("table").config.reccount = full;

        const count = {full : full};

        counter.setValues(JSON.stringify(count));
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "setCounterVal"
        );
    }
}

function addToTable(newValues){
    const table  = $$("table");
    const offset = table.config.offsetAttr;

    if (newValues.id <= offset ){  // изменить 
        table.add(newValues); 
    }

    setCounterVal ();
}

function createPostObj(newValues){
    const notNullVals    = removeNullFields(newValues);
    const dateFormatVals = dateFormatting  (notNullVals);
    return formattingBoolVals(dateFormatVals);
}


function postTable (updateSpace, isNavigate, form){
    const currId  = getItemId ();
    const isError = validateProfForm().length;
  
    if (!isError){
        const property  = $$("editTableFormProperty");
        const newValues = property.getValues();
        const postObj   = createPostObj(newValues);

        return new ServerData({
            id : currId

        }).post(postObj).then(function(data){
        
            if (data){

                const id = data.content.id;
                if (id){
                    newValues.id = id;


                    if (updateSpace){
                        form.defaultState();
                    }
    
                // для модальных окон без перехода на другую стр.
                    if (updateSpace || !isNavigate){ 
                        addToTable    (newValues);
                    }
    
                    unsetDirtyProp();
    
                    setLogValue(
                        "success",
                        "Данные успешно добавлены",
                        currId
                    );
    
                    return true;
                }


               
               
            }
             
        });
 


    } else {
        setLogError ();
    }
}


// remove
function removeRow(){
    const table       = $$( "table" );
    const tableSelect = table.getSelectedId().id;

    if(table){
        table.remove(tableSelect);
    }

}

function removeTableItem(form){

    const currId = getItemId ();

    popupExec("Запись будет удалена").then(
        function(){
        
            const formValues = $$("editTableFormProperty").getValues();
            const id         = formValues.id;

            new ServerData({
    
                id           : `${currId}/${id}.json`,
               
            }).del(formValues).then(function(data){
            
                if (data){
                    form.defaultState();

                    unsetDirtyProp();
         
                    setLogValue(
                        "success",
                        "Данные успешно удалены"
                    );
                    removeRow();
                    setCounterVal (true);
                     
                }
                 
            });
    
        }
    );

}


//create states

function initPropertyForm(){
    const property = $$("editTableFormProperty");
    Action.showItem(property);
    property.clear();
    $$("table-editForm").setDirty(false);
}



function setWorkspaceState (table){
    const emptyTemplate = $$("EditEmptyTempalte");
    function tableState(){
        table.filter(false);
        table.clearSelection();
    }

    function buttonsState(){
        $$("table-delBtnId")   .disable();
        $$("table-saveBtn")    .hide();
        $$("table-saveNewBtn") .show();
        $$("table-newAddBtnId").disable();
    }

    try{
        tableState();
        buttonsState();
        createProperty("table-editForm");
        Action.hideItem(emptyTemplate);
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "setWorkspaceState"
        );
    }

}


function setStatusProperty(status){
    const prop = $$("editTableFormProperty");

    if (prop){
        prop.config.statusForm = status;
    }
}

function unsetDirtyEditFormProp(){
    $$("table-editForm").setDirty(false);
    mediator.tabs.setDirtyParam();
}

function editTablePostState(){
    const table = $$("table");
    initPropertyForm();
    setWorkspaceState (table);
    setStatusProperty("post");
    unsetDirtyEditFormProp();
    mediator.linkParam(true, {"view": "edit"});
}

//select exists entry
function setPropertyWidth(prop){
    const form = $$("table-editForm");

    if (prop && !(prop.isVisible())){
        prop.show();

        // if (window.innerWidth > 850){
        //    // form.config.width = 350;   
        //    // form.resize();
        // }
    }

}

function adaptiveView (editForm){
    try {
        const container = $$("container");
        
        if (container.$width < 850){
            Action.hideItem($$("tree"));

            if (container.$width < 850){
                Action.hideItem($$("tableContainer"));
                editForm.config.width = window.innerWidth;
                editForm.resize();
                Action.showItem($$("table-backTableBtn"));
            }
        }
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "adaptiveView"
        );
    }
}

function editTablePutState(){
  
    try{
        const editForm  = $$("table-editForm");
        setPropertyWidth ($$("editTableFormProperty"));
        editForm.setDirty(false);
        Action.showItem  ($$("table-saveBtn"    ));

        Action.hideItem  ($$("table-saveNewBtn" ));
        Action.hideItem  ($$("EditEmptyTempalte"));

        Action.enableItem($$("table-delBtnId"   ));
        Action.enableItem($$("table-newAddBtnId"));
   
        if( !(editForm.isVisible()) ){
            mediator.tables.defaultState("filter");
            Button.transparentDefaultState();
            adaptiveView (editForm);
            editForm.show();
        }

        setStatusProperty("put");
 
    } catch (err){   
        setFunctionError(
            err,
            logNameFile,
            "editTablePutState"
        );
    }
    
}

function defPropertyState(){
    mediator.tables.editForm.clearTempStorage();
    const property = $$("editTableFormProperty");

    if (property){
        property.clear();
        property.hide();
    }
  
}



function editTableDefState(clearDirty){
    const form = $$("table-editForm");
    
    if (clearDirty){
        unsetDirtyEditFormProp();   
    } else {
        if (form){
            form.setDirty(false);   
        }

    }
 

    
    Action.hideItem   ($$(form                ));
    Action.hideItem   ($$("tablePropBtnsSpace"));
    Action.hideItem   ($$("table-saveNewBtn"  ));
    Action.hideItem   ($$("table-saveBtn"     ));

    Action.showItem   ($$("tableContainer"    ));
    Action.showItem   ($$("EditEmptyTempalte" ));

    Action.enableItem ($$("table-newAddBtnId" ));

    Action.disableItem($$("table-delBtnId"   ));

    Action.removeItem ($$("propertyRefbtnsContainer"));

    defPropertyState  ();

    setStatusProperty (null);
}

//create property

const containerId = "propertyRefbtnsContainer";


function createDateEditor(){
    webix.editors.$popup = {
        date:{
           view : "popup",
           body : {
            view        : "calendar",
            weekHeader  : true,
            events      : webix.Date.isHoliday,
            timepicker  : true,
            icons       : true,
           }
        }
     };
}



function createEmptySpace(){
    $$(containerId).addView({
        height : 29,
        width  : 1
    });
}


function createBtnsContainer(refBtns){
    try{
        refBtns.addView({
            id   : containerId,
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

function returnArrayError(func){
    setFunctionError(
        "array length is null", 
        logNameFile, 
        func
    );
}

function setToolBtns(){
    const property      = $$("editTableFormProperty");
    const refBtns       = $$("propertyRefbtns");
    const propertyElems = property.config.elements;

    Action.removeItem($$(containerId));

    createBtnsContainer(refBtns);

    if (propertyElems && propertyElems.length){
        propertyElems.forEach(function(el){
        
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
    } else {
        returnArrayError("setToolBtns");
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


function comboTemplate(obj, config){
    const value = obj.value;
    const item  = config.collection.getItem(value);
    return item ? item.value : "";
}
function createReferenceInput(el){
   
    const template =  returnTemplate(el);    
    
    let findTableId   = el.type.slice(10);
    
    template.type     = "combo";
    template.css      = el.id + "_container";
    template.options  = getComboOptions(findTableId);
    template.template = function(obj, common, val, config){
       return comboTemplate(obj, config);
    };

    return template;
}


function createBooleanInput(el){
    const template =  returnTemplate(el);    
 
    template.type     = "combo";
    template.options  = [
        {id:1, value: "Да"},
        {id:2, value: "Нет"}
    ];
    template.template = function(obj, common, val, config){
        return comboTemplate(obj, config);
    };

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
function findContentHeight(arr){
    let result = 0;
    if (arr && arr.length){
     
        arr.forEach(function(el, i){
            const height = el.$height;
            if (height){
                result += height;
            }
      
        });
    } else {
        returnArrayError("findContentHeight");
    }
  
 
    return result;
}

function findHeight(elem){
    if (elem && elem.isVisible()){
        return elem.$height;
    }
}
 

function setEditFormSize(){
    const form   = $$("table-editForm");
    const childs = form.getChildViews();

    const contentHeight = findContentHeight(childs);
    
    const containerHeight = findHeight($$("container"));

    if(contentHeight < containerHeight){
        const scrollBugSpace = 2;
        form.config.height   = containerHeight - scrollBugSpace;
        form.resize();
    }

}


function createProperty (parentElement) {

    const property         = $$(parentElement);
    const columnsData      = $$("table").getColumns(true);
    const elems            = property.elements;
    const propertyLength   = Object.keys(elems).length;

    try {

     
        if ( !propertyLength ){
            const propElems = [];

            if (columnsData && columnsData.length){
                columnsData.forEach((el) => {

                    const propElem = returnPropElem(el);
                    propElems.push(propElem);
    
                });
    
            
                createDateEditor();
                addEditInputs   (propElems);
                setToolBtns     ();
            } else {
                returnArrayError("createProperty");
            }
          
    

        } else {
            property.clear();
            property.clearValidation();

            if(parentElement == "table-editForm"){
                $$("table-delBtnId").enable();
            }
        }


        setEditFormSize();
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "createEditFields"
        );
    }
}




//create form btns

function setFormState(){
    mediator.tables.editForm.postState();
}

function modalBoxAddItem(){
    modalBox().then(function (result){
        if (result == 1){
            setFormState();
        } else if (result == 2){
            mediator.tables.editForm
            .put(false).then(function(result){
                if (result){
                    setFormState();
                }
            });
 
        }
    });

 
}


function addItem () {

    const isDirtyForm = $$("table-editForm").isDirty();
 
    
    if (isDirtyForm){
        modalBoxAddItem();
    } else {
        mediator.tables.editForm.clearTempStorage();
        setFormState();
        
 
    }

}

function backTableBtnClick() {
    const form           = $$("table-editForm");
    const tableContainer = $$("tableContainer");
    const table          = $$("table");

    function defaultState(){
        mediator.tables.editForm.clearTempStorage();
        Action.hideItem(form);
        Action.showItem(tableContainer);
        if (table){
            table.clearSelection();
        }
    }

    function createModalBox(){

        modalBox().then(function (result){
                        
            if (result == 1 || result == 2){
                if (result == 1){
                    defaultState();
                } else if (result == 2){
                    const isExists = $$("table-saveBtn").isVisible();
                    
                    if (isExists){
                        mediator.tables.editForm.put();
                    } else {
                        mediator.tables.editForm.post();
                    }
                }
                form.setDirty(false);
            }
        });
    }

   

    if (form.isDirty()){
        createModalBox ();
    
    } else {
        defaultState();
    }
  

}


const newAddBtn = new Button({
    
    config   : {
        id          : "table-newAddBtnId",
        hotkey      : "Alt+A",
        disabled    : true,
        value       : "Новая запись", 
        click       : addItem,
    },
    titleAttribute : "Добавить новую запись",
    adaptValue     : "+",

   
}).maxView();

const delBtn = new Button({
    
    config   : {
        id       : "table-delBtnId",
        hotkey   : "Ctrl+Enter",
        disabled : true,
        icon     : "icon-trash", 
        click    : function (){
            mediator.tables.editForm.remove();
        },
        on:{
            onViewShow:function(){
                const prop   = $$("editTableFormProperty");
                const status = prop.config.statusForm;
     
                if (status == "put") $$("table-delBtnId").enable();
       
            }
        }
    },
    titleAttribute : "Удалить запись из таблицы"

   
}).minView("delete");


const saveBtn = new Button({
    
    config   : {
        id       : "table-saveBtn",
        hotkey   : "Shift+Space",
        hidden   : true, 
        value    : "Сохранить", 
        click    : function(){
            mediator.tables.editForm.put();
        },
        on:{
            onViewShow:function(){
                if (this.isVisible()){
                    $$("editTableFormProperty")
                    .config.tableStatus = "put";
                }
   
            }
        }
    },
    titleAttribute : "Сохранить запись в таблицу"

   
}).maxView("primary");


const saveNewBtn = new Button({
    
    config   : {
        id       : "table-saveNewBtn",
        hotkey   : "Ctrl+Shift+Space",
        hidden   : true, 
        value    : "Сохранить", 
        click    : function(){
            mediator.tables.editForm.post();
        },
        on:{
            onViewShow:function(){

                if (this.isVisible()){
                    $$("editTableFormProperty")
                    .config.tableStatus = "post";
                }
   
            }
        }
    },
    titleAttribute : "Сохранить новую запись в таблицу"

   
}).maxView("primary");


const backTableBtn = new Button({
    
    config   : {
        id       : "table-backTableBtn",
        hotkey   : "Shift+Q",
        hidden   : true,  
        icon     : "icon-arrow-left", 
        click    : backTableBtnClick,
    },
    titleAttribute : "Вернуться к таблице"

   
}).minView();




const editFormBtns = {
    minHeight : 48,
    id:"editBtnsContainer",
    css       : "webix_form-adaptive", 
    margin    : 5, 
    rows:[
        {cols:[
            {   
                rows:[
                {
                    margin : 5,
                    rows   : [
                        {
                            margin : 2,
                            cols   : [
                                backTableBtn,
                                newAddBtn,  
                                delBtn,
                            ]
                        },
                
                    ]
                },
        
                {   margin : 10, 
                    rows   : [ 
                        saveBtn,
                        saveNewBtn,
                        {   id        : "EditEmptyTempalte",
                            rows      : [
                                {height:20},
                                createEmptyTemplate(
                                    "Добавьте новую запись или " +
                                    "выберите существующую из таблицы")
                            ],
                        }
                    
                    ]
                },
             
            ]},
            {   id      : "tablePropBtnsSpace",
                width   : 35, 
                hidden  : true
            },
        ]}
   
     

    ]
};

//create layout
const editForm = {
    view        : "form", 
    id          : "table-editForm",
    hidden      : true,
    css         : "webix_form-edit",
    minHeight   : 350,
    minWidth    : 230,
    borderless  : true,
    scroll      : true,
    elements    : [
        editFormBtns,
        propertyLayout,  
    
    ],
    on:{
        onViewShow: webix.once(function(){
            
            this.config.width = 350;
            this.resize();
            mediator.setForm(this);
        }),
    },
   
    rules       : {
        $all:webix.rules.isNotEmpty
    },

    ready       : function(){
        this.validate();
    },

};



function editTableBar (){
    return editForm;
      
}




export {
    editTableBar,
    createProperty,
    EditForm,
    defaultStateForm,
    returnDefaultValue
};