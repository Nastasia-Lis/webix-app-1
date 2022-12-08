import { setFunctionError }                     from "../../../../blocks/errors.js";
import { modalBox }                             from "../../../../blocks/notifications.js";
import { Action }                               from "../../../../blocks/commonFunctions.js";

import { Popup }                                from "../../../../viewTemplates/popup.js";
import { Button }                               from "../../../../viewTemplates/buttons.js";

let property;

const logNameFile = "tableEditForm => propBtns => calendar";


function unsetDirtyProp(elem){
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
    unsetDirtyProp( calendar     );
    unsetDirtyProp( $$("hourInp"));
    unsetDirtyProp( $$("minInp" ) );
    unsetDirtyProp( $$("secInp" ) );
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
        setFunctionError(err, logNameFile, "setValuesDate");
    }
    
}

function returnTimeValue(h, m, s){
    return h + ":" + m+":" + s;;
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
        if ( !(errors, errors.length) ){
            property.setValues({ [elem.id] : sentVal}, true);

            if(propId){
                property.setValues({ id : propId}, true);

            }

            Action.destructItem($$("editTablePopupCalendar"));
        }
    } catch (err){
        setFunctionError(err, logNameFile, "setValToProperty");
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

    setDataToStorage(elem, sentVal);

    return errors.length;
}

function isDirty(){
    let check      = false;
    function checkDirty(elem){
        if ( elem.config.dirtyProp && !check ){
            check = true;
        }
    }

    checkDirty ($$("editCalendarDate"));
    checkDirty ($$("hourInp"         ));
    checkDirty ($$("minInp"          ));
    checkDirty ($$("secInp"          ));

    return check;
}


const closePopupClick = function (elem){
    const calendar = $$("editTablePopupCalendar");

    if (isDirty()){
  
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

};


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

function returnSubmitBtn(elem){
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
        closeClick : closePopupClick,
        elements : {
            rows : [
                returnDateEditor(),
                {height:15},
                returnSubmitBtn(elem),
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

export {
    createDatePopup
};