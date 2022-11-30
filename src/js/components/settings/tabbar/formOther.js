import { setFunctionError  }  from "../../../blocks/errors.js";
import { mediator  }          from "../../../blocks/_mediator.js";
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
          //  $$("userprefsOtherForm").setDirty();
            try{

                const counter = $$("userprefsAutorefCounter");

                if (newValue == 1 ){
                    counter.show();
                }

                if (newValue == 2){
                    counter.hide();
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
                
                if (newValue == minVal){
                    createMsg ("Минимально возможное значение");

                } else if (newValue == maxVal){
                    createMsg ("Максимально возможное значение");
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

const otherForm =  {    
    view        : "form", 
    id          : "userprefsOtherForm",
    borderless  : true,
    elements    : [
        autorefRadio,
        {height:5},
        autorefCounter,
        {height:5},
        visibleIdRadio,
        {}
    ],
    on:{
        onViewShow: webix.once(function(){
            mediator.setForm(this);
        }),

        onChange:function(){
            const saveBtn  = $$("userprefsSaveBtn");
            const resetBtn = $$("userprefsResetBtn");
            const form     = $$("userprefsOtherForm");

            function setSaveBtnState(){
                try{
                    if ( form.isDirty() && !(saveBtn.isEnabled()) ){
                        saveBtn.enable();
                    } else if (!(form.isDirty())){
                        saveBtn.disable();
                    }
                } catch (err){
                    setFunctionError(
                        err,
                        logNameFile,
                        "onChange setSaveBtnState"
                    );
                }
            }

            
            function setResetBtnState(){
                try{
                    if ( form.isDirty() && !(resetBtn.isEnabled()) ){
                        resetBtn.enable();
                    } else if ( !(form.isDirty()) ){
                        resetBtn.disable();
                    }  
                } catch (err){
                    setFunctionError(
                        err,
                        logNameFile,
                        "onChange setResetBtnState"
                    );
                }
            }
            
            setSaveBtnState ();
            setResetBtnState();
         
        }
    }
};

const otherFormLayout = {
    view      : "scrollview",
    borderless: true, 
    css       : "webix_multivew-cell",
    id        : "userprefsOther", 
    scroll    : "y", 
    body      : otherForm
};

export {
    otherFormLayout
};