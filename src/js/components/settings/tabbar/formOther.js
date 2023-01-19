///////////////////////////////

// Форма других настроек
// Copyright (c) 2022 CA Expert

///////////////////////////////

import { Action } from "../../../blocks/commonFunctions.js";
import { setFunctionError  }    from "../../../blocks/errors.js";
import { returnFormTemplate }   from "./formTemplate.js";

const logNameFile   = "settings => tabbar => otherForm";

const autorefRadio   = {
    view            : "radio",
    labelPosition   : "top", 
    label           : "Автообновление специфичных страниц", 
    value           : 1,
    name            : "autorefOpt", 
    options         : [
        {"id" : 1, "value" : "Включено"},
        {"id" : 2, "value" : "Выключено"}
    ],
    on              : {
        onChange:function(newValue){

            const counter = $$("userprefsAutorefCounter");

            if (newValue == 1 ){
                Action.showItem(counter);
            }

            if (newValue == 2){
                Action.hideItem(counter);
            }
        
        }
    }
};

const autorefCounter = {   
    view            : "counter", 
    id              : "userprefsAutorefCounter",
    labelPosition   : "top",
    name            : "autorefCounterOpt", 
    label           : "Интервал автообновления (в миллисекундах)" ,
    min             : 15000, 
    max             : 900000,
    on              : {
        onChange:function(newValue){
            function createMsg (textMsg){
                return webix.message({
                    type   : "debug",
                    expire : 1000, 
                    text   : textMsg
                });
            }

            try{
                const counter = $$("userprefsAutorefCounter");
                const minVal  = counter.config.min;
                const maxVal  = counter.config.max;

                const defText = "возможное значение";
                
                if (newValue == minVal){
                    createMsg ("Минимально" +  defText);

                } else if (newValue == maxVal){
                    createMsg ("Максимально" + defText);
                }
            } catch (err){
                setFunctionError(
                    err,
                    logNameFile,
                    "onChange"
                );
            }

        }
    }
};

const visibleIdRadio = {
    view            : "radio",
    labelPosition   : "top", 
    label           : "ID в таблицах", 
    value           : 1,
    name            : "visibleIdOpt", 
    options         : [
        {"id" : 1, "value" : "Показывать"   },
        {"id" : 2, "value" : "Не показывать"}
    ],
};

const saveHistoryRadio = {
    view            : "radio",
    labelPosition   : "top", 
    label           : "История последнего сеанса", 
    value           : 2,
    name            : "saveHistoryOpt", 
    options         : [
        {id : 1, value : "Сохранять"   },
        {id : 2, value : "Не сохранять"}
    ],
};

function returnForm(){
    const elems = [{
        rows: [
            autorefRadio,
            {height:25},
            autorefCounter,
            {height:25},
            visibleIdRadio,
            {height:25},
            saveHistoryRadio,
            {}
        ]
    }];
    
 
    return returnFormTemplate(
        "userprefsOtherForm", 
        elems
    );
}

const otherFormLayout = {
    view      : "scrollview",
    borderless: true, 
    css       : "webix_multivew-cell",
    id        : "userprefsOther", 
    scroll    : "y", 
    body      : returnForm()
};

export {
    otherFormLayout
};