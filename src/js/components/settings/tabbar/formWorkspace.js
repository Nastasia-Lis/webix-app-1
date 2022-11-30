 
import { setFunctionError }   from "../../../blocks/errors.js";
import { mediator } from "../../../blocks/_mediator.js";

const logNameFile   = "settings => tabbar => workspaceForm";

const logBlockRadio = {
    view         : "radio",
    labelPosition: "top",
    name         : "logBlockOpt", 
    label        : "Отображение блока системных сообщений", 
    value        : 1, 
    options      : [
        {"id" : 1, "value" : "Показать"}, 
        {"id" : 2, "value" : "Скрыть"  }
    ],
    on:{
        onAfterRender: function () {
            this.getInputNode().setAttribute("title","Показать/скрыть по умолчанию блок системных сообщений");
        },

        onChange:function(newValue, oldValue){
            try{
                const btn = $$("webix_log-btn");

                if (newValue !== oldValue){
             
                    if (newValue == 1){
                        btn.setValue(2);
                    } else {
                        btn.setValue(1);
                    }
                
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

const loginActionSelect = {   
    view         : "select", 
    name         : "LoginActionOpt",
    label        : "Действие после входа в систему", 
    labelPosition: "top",
    value        : 2, 
    options      : [
    { "id" : 1, "value" : "Перейти на главную страницу"            },
    { "id" : 2, "value" : "Перейти на последнюю открытую страницу" },
    ],
    on:{
        onAfterRender: function () {
            this.getInputNode().setAttribute("title","Показывать/не показывать всплывающее окно при загрузке приложения");
        },

    }
};

const workspaceForm =  {    
    view      : "form", 
    id        : "userprefsWorkspaceForm",
    borderless: true,
    elements  : [
        { cols:[
            { rows:[  
                logBlockRadio,
                {height:15},
                
                {cols:[
                    loginActionSelect,
                    {}
                ]}

            ]},
        ]},

    ],

    on        :{
        onViewShow: webix.once(function(){
           mediator.setForm(this);
        }),

        onChange:function(){
            const form     = $$("userprefsWorkspaceForm");
            const saveBtn  = $$("userprefsSaveBtn");
            const resetBtn = $$("userprefsResetBtn");

            function setSaveBtnState(){
                try{
                    if ( form.isDirty() && !(saveBtn.isEnabled()) ){
                        saveBtn.enable();
                    } else if ( !(form.isDirty()) ){
                        saveBtn.disable();
                    }
                } catch (err){
                    setFunctionError(
                        err,
                        logNameFile,
                        "setSaveBtnState"
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
                        "setResetBtnState"
                    );
                }
            }
      
            setSaveBtnState ();
            setResetBtnState();
        }
    },

    
};

const workspaceLayout = {
    view      : "scrollview",
    borderless: true, 
    css       : "webix_multivew-cell",
    id        : "userprefsWorkspace",
    scroll    : "y", 
    body      : workspaceForm
};


export {
    workspaceLayout
};