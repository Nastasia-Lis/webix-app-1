
import { setLogValue }                      from "../blocks/logBlock.js";
import { setStorageData }                   from "../blocks/storageSetting.js";
import { setFunctionError,setAjaxError  }   from "../blocks/errors.js";

import { Button }                           from "../viewTemplates/buttons.js";

const defaultValue = {
    userprefsOther     : {},
    userprefsWorkspace : {},
};

function saveSettings (){
    const tabbar    = $$("userprefsTabbar");
    const value     = tabbar.getValue();
    const tabbarVal = value + "Form" ;
    const form      = $$(tabbarVal);
    
    function getUserprefsData(){
        const url     = "/init/default/api/userprefs/";
        const getData =  webix.ajax().get(url);
     
        getData.then(function(data){
            data = data.json().content;

            let settingExists = false;

            const values = form.getValues();

            const sentObj = {
                name :tabbarVal,
                prefs:values,
            };

            function putPrefs(el){
                const url     = "/init/default/api/userprefs/" + el.id;
                const putData = webix.ajax().put(url, sentObj);

                putData.then(function(data){
                    data = data.json();
                    if (data.err_type == "i"){
                        const formVals = JSON.stringify(form.getValues());
                        setStorageData (tabbarVal, formVals);
                        setLogValue("success", "Настройки сохранены");

                    } if (data.err_type !== "i"){
                        setLogValue("error", data.error);
                    }

                    const name         = tabbar.getValue();
                    defaultValue[name] = values;

                    form.setDirty(false);
                });

                putData.fail(function(err){
                    setAjaxError(err, "userprefs", "putPrefs");
                });
            }
     
            function findExistsData(){
                try{
                    data.forEach(function(el,i){
                       
                        if (el.name == tabbarVal){
                            settingExists = true;
                            putPrefs(el);
                        } 
                    });
                } catch (err){
                    setFunctionError(err, "userprefs", "findExistsData");
                }
            }

            findExistsData();


            function getOwnerData(){
                const getData = webix.ajax("/init/default/api/whoami");
                getData.then(function(data){
                    data = data.json().content;
                    sentObj.owner = data.id;

                    const userData = {};

                    userData.id       = data.id;
                    userData.name     = data.first_name;
                    userData.username = data.username;
                    
                    setStorageData("user", JSON.stringify(userData));
                });

                getData.fail(function(err){  
                    setAjaxError(err, "userprefs","getOwnerData");
                });
            }

            function postPrefs(){
       
                const url      = "/init/default/api/userprefs/";
  
                const postData = webix.ajax().post(url,sentObj);
 
                postData.then(function(data){
                    data = data.json();

                    if (data.err_type == "i"){
                        setLogValue("success", "Настройки сохранены");

                    } else {
                        setLogValue("error", data.error);
                    }

                    const tabbarVal         = tabbar.getValue();
                    defaultValue[tabbarVal] = values;

                    form.setDirty(false);
                });

                postData.fail(function(err){
                    setAjaxError(err, "userprefs","postPrefs");
                });
            }

          
            if (!settingExists){
                
                const ownerId = webix.storage.local.get("user").id;
     
                if (ownerId){
                    sentObj.owner = ownerId;
                } else {
                    getOwnerData();
                }
       
                postPrefs();
            }

        });
        getData.fail(function(err){
            setAjaxError(err, "userprefs","getUserprefsData");
        });
    }

    if ( form.isDirty() ){
        getUserprefsData();
    } else {
        setLogValue("debug","Сохранять нечего");
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
            LoginActionOpt : '1'
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
    on:{
        onChange:function(newValue){
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
                    "userprefs", 
                    "autorefRadio => onChange"
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
        onChange:function(newValue, oldValue, config){
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
                    "userprefs",
                    "autorefCounter => onChange"
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
                    setFunctionError(err,"userprefs","otherForm => onChange setSaveBtnState");
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
                    setFunctionError(err,"userprefs","otherForm => onChange setResetBtnState");
                }
            }
            
            setSaveBtnState ();
            setResetBtnState();
         
        }
    }
};

const userprefsOther = {
    view      : "scrollview",
    borderless: true, 
    css       : "webix_multivew-cell",
    id        : "userprefsOther", 
    scroll    : "y", 
    body      : otherForm
};

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
                setFunctionError(err,"userprefs","logBlockRadio => onChange");
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
                    setFunctionError(err,"userprefs","workspaceForm => setSaveBtnState");
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
                    setFunctionError(err,"userprefs","workspaceForm => setResetBtnState");
                }
            }
      
            setSaveBtnState ();
            setResetBtnState();
        }
    }
};

const userprefsWorkspace = {
    view      : "scrollview",
    borderless: true, 
    css       : "webix_multivew-cell",
    id        : "userprefsWorkspace",
    scroll    : "y", 
    body      : workspaceForm
};



const clearBtn = new Button({
    
    config   : {
        id       : "userprefsResetBtn",
        hotkey   : "Shift+X",
        disabled : true,
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


const userprefsConfirmBtns =  { 
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

            function disableBtn(btn){
                try{
                    if (btn.isEnabled()){
                        btn.disable();
                    }   
                } catch (err){
                    setFunctionError(err,"userprefs","tabbar => onBeforeTabClick");
                }
            }

            function createModalBox(){
                try{
                    webix.modalbox({
                        title   :"Данные не сохранены",
                        css     :"webix_modal-custom-save",
                        buttons :["Отмена", "Не сохранять", "Сохранить"],
                        width   :500,
                        text    :"Выберите действие перед тем как продолжить"
                    }).then(function(result){

                        if ( result == 1){
                            
                            const storageData = webix.storage.local.get(tabbarVal);
                            const saveBtn     = $$("userprefsSaveBtn");
                            const resetBtn    = $$("userprefsResetBtn");
                           

                            form.setValues(storageData);

                            tabbar.setValue(id);

                            disableBtn(saveBtn);
                            disableBtn(resetBtn);

                        } else if ( result == 2){
                            saveSettings ();
                            tabbar.setValue(id);
                        }
                    });
                } catch (err){
                    setFunctionError(err,"userprefs","tabbar => createModalBox");
                }
            }


            if (form.isDirty()){
                createModalBox();
                return false;
            }

        }
    }
};

const userprefsTabbar =  {
    rows:[
        tabbar,
        {
            cells:[
                userprefsWorkspace,
                userprefsOther
            ]
        },
        userprefsConfirmBtns
    ]
};


const headline = {   
    view:"template",
    template:"<div>Настройки</div>",
    css:"webix_headline-userprefs",
    height:35, 
    borderless:true,
};


const userInfo =  {   
    view        : "template",
    id          : "userprefsName",
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

        const val       = $$("userprefsName").getValues();
        const lenghtVal = Object.keys(val).length;

        if (lenghtVal !==0){
            return createDivData(val); 
        } else {
            return createDivData("не указано");        
        }
    },
};

const userprefsHeadline =  [ 
    headline,
    userInfo,
];


const userprefsLayout = {

    rows:[
        {   padding:{
                top     :15, 
                bottom  :0, 
                left    :20, 
                right   :0
            },
            rows:userprefsHeadline,
        },
        userprefsTabbar,
    ]

   
};


export {
    userprefsLayout
};