///////////////////////////////
//
// Медиатор                                     (create mediator)
//
// Элемент с заголовком компонента              (create headline)
//
// Таббар с формами                             (create tabbar layout)
//
// Шаблон формы                                 (create form template)
//
// Форма настройки рабочего пространства        (create workspace settings tab)
//
// Форма других настроек                        (create other settings tab)
//
// Дефолтные значения форм                      (create default state)
//
// Сохранение пользовательских настроек         (create buttons)
//
// Layout пользовательских настроек             (create layout)
//
// Layout пользовательских настроек             (create user prefs settings)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////

import { setLogValue }          from "./logBlock.js";
import { setStorageData }       from "../blocks/storageSetting.js";
import { ServerData }           from "../blocks/getServerData.js";
import { Button }               from "../viewTemplates/buttons.js";
import { returnOwner }          from "../blocks/commonFunctions.js";
import { Action }               from "../blocks/commonFunctions.js";
import { setFunctionError  }    from "../blocks/errors.js";
import { mediator }             from "../blocks/_mediator.js";


const logNameFile   = "settings";


//create mediator
class Settings {
    constructor (){
        this.name = "dashboards";
    }

    create (){
        $$("container").addView(
            {   view    :"layout",
                id      : "settings", 
                css     :"webix_auth",
                hidden  :true, 
                rows    :[
                    settingsLayout,
                ],
            }, 
        8);

    
    }

    async put (){
       return await saveSettings();
    }

}

//create headline


const headline = {   
    view        : "template",
    template    : "<div>Настройки</div>",
    css         : "webix_headline-userprefs",
    height      : 35, 
    borderless  : true,
};

const userInfo =  {   
    view        : "template",
    id          : "settingsName",
    css         : "webix_userprefs-info",
    height      : 50, 
    borderless  : true,

    template    : function(){
        function createDivData(msg){
            return `
            <div style = '
                display:inline-block;
                color:var(--primary);
                font-size:13px!important;
                font-weight:600
            '>Имя пользователя:</div>

            <div style = '
                display:inline-block;
                font-size:13px!important;
                font-weight:600
            '>${msg}</div>`;
        }

        const val       = $$("settingsName").getValues();
        const lenghtVal = Object.keys(val).length;

        if (lenghtVal !==0){
            return createDivData(val); 
        } else {
            return createDivData("не указано");        
        }
    },
};


const layoutHeadline =  [ 
    headline,
    userInfo,
];


//create tabbar layout

function createHeadlineSpan(headMsg){
    return `<span class='webix_tabbar-filter-headline'>
            ${headMsg}
            </span>`;
}

const tabbar = {   
    view     : "tabbar",  
    type     : "top", 
    id       : "userprefsTabbar",
    css      : "webix_filter-popup-tabbar",
    multiview: true, 
    height   : 50,
    options  : [
        {   value: createHeadlineSpan("Рабочее пространство"), 
            id   : 'userprefsWorkspace' 
        },
        {   value: createHeadlineSpan("Другое"), 
            id   : 'userprefsOther' 
        },
    ],

    on       :{
        onBeforeTabClick:function(id){
            const tabbar    = $$("userprefsTabbar");
            const value     = tabbar.getValue();
            const tabbarVal = value + "Form";
            const form      = $$(tabbarVal);

            function createModalBox(){
                try{
                    webix.modalbox({
                        title   : "Данные не сохранены",
                        css     : "webix_modal-custom-save",
                        buttons : ["Отмена", "Не сохранять", "Сохранить"],
                        width   : 500,
                        text    : "Выберите действие перед тем как продолжить"
                    }).then(function(result){

                        if ( result == 1){
                            
                            const storageData = webix.storage.local.get(tabbarVal);
                            const saveBtn     = $$("userprefsSaveBtn");
                            const resetBtn    = $$("userprefsResetBtn");

                            form.setValues(storageData);

                            tabbar.setValue(id);
                            Action.disableItem(saveBtn);
                            Action.disableItem(resetBtn);

                        } else if ( result == 2){
                            saveSettings ();
                            tabbar.setValue(id);
                        }
                    });
                } catch (err){
                    setFunctionError(
                        err, 
                        logNameFile, 
                        "createModalBox"
                    );
                }
            }


            if (form.isDirty()){
                createModalBox();
                return false;
            }

        }
    }
};



//create form template
function returnFormTemplate(id, elems){
    const form =  {    
        view       : "form", 
        id         : id,
        borderless : true,
        elements   : [
            {cols  : elems},
        ],
    
        on        :{
            onViewShow: webix.once(function(){
               mediator.setForm(this);
            }),
      
            onChange:function(){
                const form     = this;
                const isDirty  = form.isDirty();

                const saveBtn  = $$("userprefsSaveBtn");
                const resetBtn = $$("userprefsResetBtn");
 
    
                function setSaveBtnState(){
                    if ( isDirty ){
                        Action.enableItem(saveBtn);
    
                    } else if ( !isDirty ){
                        Action.disableItem(saveBtn);
    
                    }
                }
    
                function setResetBtnState(){
                    if (isDirty){
                        Action.enableItem(resetBtn);
    
                    } else if ( !isDirty ){
                        Action.disableItem(resetBtn);
    
                    }  
                 
                }
          
                setSaveBtnState ();
                setResetBtnState();
            }
        },
    
        
    };

    return form;
}

//create workspace settings tab


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
            this.getInputNode().setAttribute(
                "title",
                "Показать/скрыть по умолчанию" + 
                " блок системных сообщений"
                );
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


function returnFormElem(){
    const elems = [
        { rows : [  
            logBlockRadio,
            {height : 15},

        ]},
    ]; 

    return returnFormTemplate(
        "userprefsWorkspaceForm",  
        elems
    );
}


const workspaceLayout = {
    view      : "scrollview",
    borderless: true, 
    css       : "webix_multivew-cell",
    id        : "userprefsWorkspace",
    scroll    : "y", 
    body      : returnFormElem()
};



//create other settings tab

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



//create default state

const defaultValue = {
    userprefsOther     : {},
    userprefsWorkspace : {},
};


//create buttons

let tabbarElem;
let tabbarVal;
let form;

let values;
let sentObj;

function createSentObj(owner, values){
    const sentObj = {
        name  : "/settings",
        owner : owner,
        prefs : {
            [tabbarVal]:values
        }
    };

    return sentObj;
}

function putPrefs(id){

    return new ServerData({
        id : `userprefs/${id}`
       
    }).put(sentObj).then(function(data){

        if (data){
            const formVals = JSON.stringify(values);
            setStorageData (tabbarVal, formVals);

            const name         = tabbarElem.getValue();
            defaultValue[name] = values;

            form.setDirty(false);

            setLogValue(
                "success", 
                "Настройки сохранены"
            );
            return true;
        }
         
    });

}


function postPrefs(){
    
    return new ServerData({
        id : "userprefs"
       
    }).post(sentObj).then(function(data){

        if (data){
            const tabbarVal         = tabbarElem.getValue();
            defaultValue[tabbarVal] = values;

            form.setDirty(false);

            setLogValue(
                "success", 
                "Настройки сохранены"
            );

            return true;
        }
         
    });
   
}




async function savePrefs(){
    const ownerId = await returnOwner();
    const name  = `userprefs.name='/settings'`;
    const owner = `userprefs.owner=${ownerId.id}`;

    return new ServerData({
        id : `smarts?query=${name}+and+${owner}&limit=80&offset=0`
       
    }).get().then(function(data){

        if (data && data.content){
        
            values  = form.getValues();

            if (data.content){
                sentObj = data.content[0];
            } 
           
            if (sentObj){ // modify exists settings
                const prefs = JSON.parse(sentObj.prefs);
                prefs[`${tabbarVal}`] = values;
   
                sentObj.prefs = prefs;
            } else {
                sentObj = createSentObj(ownerId.id, values);
            }


           

            if (sentObj){
                if (data.content && data.content.length){ // запись уже существует
                    const content   = data.content;
                    const firstPost = content[0];
        
                    if (firstPost){
                        return putPrefs(firstPost.id);
                    }
                
                } else {
                    return postPrefs(); 
                }
            }
        
           
        }
         
    });
}


async function saveSettings (){
    tabbarElem    = $$("userprefsTabbar");
    const value   = tabbarElem.getValue();
    tabbarVal     = value + "Form" ;
    form          = $$(tabbarVal);

    if (form.isDirty()){
        return savePrefs();   
   
    } else {
        setLogValue(
            "debug", 
            "Сохранять нечего"
        );
        return true;
    }
}

function clearSettings (){
    const tabbar    = $$("userprefsTabbar");
    const value     = tabbar.getValue();
    const tabbarVal = value + "Form" ;
    const form      = $$(tabbarVal);

    if (tabbarVal === "userprefsWorkspaceForm"){
    
        form.setValues({
            logBlockOpt    : '1', 
        });

    } else if (tabbarVal === "userprefsOtherForm"){
        form.setValues({
            autorefOpt        : '1', 
            autorefCounterOpt : 15000, 
            visibleIdOpt      : '1'
        });
    }

    form.setDirty(true);

    saveSettings ();
}


const clearBtn = new Button({
    
    config   : {
        id       : "userprefsResetBtn",
        hotkey   : "Shift+X",
        value    : "Сбросить", 
        click    : clearSettings,
    },
    titleAttribute : "Вернуть начальные настройки"

   
}).maxView();

const submitBtn = new Button({
    
    config   : {
        id       : "userprefsSaveBtn",
        hotkey   : "Shift+Space",
        disabled : true,
        value    : "Сохранить настройки", 
        click    : saveSettings,
    },
    titleAttribute : "Применить настройки"

   
}).maxView("primary");


const buttons =  { 
    id:"adaptiveUp", 
    rows:[
        {   responsive : "adaptiveUserprefs",
            cols:[
                clearBtn,
                submitBtn,
            ]
        }
    ]
};

//create layout

const layoutTabbar =  {
    rows:[
        tabbar,
        {
            cells:[
                workspaceLayout,
                otherFormLayout
            ]
        },
        buttons
    ]
};

//create user prefs settings

const settingsLayout = {

    rows:[
        {   padding: {
                top    : 15, 
                bottom : 0, 
                left   : 20, 
                right  : 0
            },
            rows   :layoutHeadline,
        },
        layoutTabbar,
    ]

   
};


export {
    Settings
};