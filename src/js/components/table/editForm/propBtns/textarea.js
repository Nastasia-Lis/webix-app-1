import { setFunctionError } from "../../../../blocks/errors.js";
import { modalBox }         from "../../../../blocks/notifications.js";
import { Action }           from "../../../../blocks/commonFunctions.js";

import { Popup }            from "../../../../viewTemplates/popup.js";
import { Button }           from "../../../../viewTemplates/buttons.js";

const logNameFile = "tableEditForm => propBtns => textarea";

let property;
let elem;

function setPropValue(value){
    property.setValues({ 
        [elem.id]:[value] 
    }, true);
}

function setDataToStorage(value){
    const prop   = $$("editTableFormProperty");
    const editor = prop.getItem(elem.id);

    prop.callEvent("onNewValues", [value, editor]);
}

function submitClick (){
    try{
        const value = $$("editPropTextarea").getValue();
        setPropValue(value);
 
        $$("table-editForm").setDirty(true);

        setDataToStorage(value);
     
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "submitClick"
        );
    }
    Action.destructItem($$("editTablePopupText"));
}

function setTextareaVal(){
    try{
        const area = $$("editPropTextarea");
        const val  = elem.value;
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

function createModalBox(area){
   
    const value = area.getValue();
    const popup = $$("editTablePopupText");

    if (area.dirtyValue){
        modalBox().then(function(result){

            if (result == 1 || result == 2){
                if (result == 2){
                    setPropValue(value);
                }
                Action.destructItem(popup);
            }
        });
    } else {
        Action.destructItem(popup);
    } 
}


const closePopupClick = function (){
    const area  = $$("editPropTextarea");

    if (area){
        createModalBox(area);
    }
   
};

function returnTextArea(){

    const textarea = { 
        view        : "textarea",
        id          : "editPropTextarea", 
        height      : 150, 
        dirtyValue  : false,
        placeholder : "Введите текст",
        on          : {
            onKeyPress:function(){
                Action.enableItem($$("editPropSubmitBtn"));

                $$("editPropTextarea").dirtyValue = true;
            },
        }
    };

    return textarea;
}

function returnSubmitBtn(){
    const btn = new Button({

        config   : {
            id       : "editPropSubmitBtn",
            disabled : true,
            hotkey   : "Ctrl+Space",
            value    : "Добавить значение", 
            click    : function(){
                submitClick();
            },
        },
        titleAttribute : "Добавить значение в запись таблицы"
    
       
    }).maxView("primary");

    return btn;
}
function popupEdit(){
    const headline = "Редактор поля  «" + elem.label + "»";

    const popup = new Popup({
        headline : headline,
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
                returnTextArea(),
                {height : 15},
                returnSubmitBtn(),
            ]
          
        }
    });
    
    popup.createView ();
    popup.showPopup  ();

    setTextareaVal();

    $$("editPropTextarea").focus();
}

function btnClick (){
    popupEdit();
}


function createBtnTextEditor(){
    const btn = new Button({

        config   : {
            width    : 30,
            height   : 29,
            icon     : "icon-window-restore", 
            click    : function(){
                btnClick ();
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
    elem     = el;

    createBtnTextEditor();
    Action.showItem($$("tablePropBtnsSpace"));
}

export {
    createPopupOpenBtn
};