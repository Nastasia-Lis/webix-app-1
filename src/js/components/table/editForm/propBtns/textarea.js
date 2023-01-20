 
///////////////////////////////

// Кнопка с расширенным полем для ввода текста 

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { setFunctionError } from "../../../../blocks/errors.js";
import { modalBox }         from "../../../../blocks/notifications.js";
import { Action }           from "../../../../blocks/commonFunctions.js";

import { Popup }            from "../../../../viewTemplates/popup.js";
import { Button }           from "../../../../viewTemplates/buttons.js";

const logNameFile = "editForm => propBtns => textarea";

let property;

function setPropValue(el, value){ 
    property.setValues({ 
        [el.id]:[value] 
    }, true);
}

function setDataToStorage(el, value){
    const prop   = $$("editTableFormProperty");
    const editor = prop.getItem(el.id);

    prop.callEvent("onNewValues", [value, editor]);
}

function submitClick (el){
    try{
        const value = $$("editPropTextarea").getValue();
      
        setPropValue(el, value);
 
        $$("table-editForm").setDirty(true);

        setDataToStorage(el, value);
     
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "submitClick"
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
                submitClick(el);
            },
        },
        titleAttribute : "Добавить значение в запись таблицы"
    
       
    }).maxView("primary");

    return btn;
}


function popupEdit(el){
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
                popupEdit(el);
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
    property = $$("editTableFormProperty");

    createBtnTextEditor(el);
    Action.showItem($$("tablePropBtnsSpace"));
}

export {
    createPopupOpenBtn
};