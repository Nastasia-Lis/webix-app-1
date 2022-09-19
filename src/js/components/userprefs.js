
import {ajaxErrorTemplate,setLogValue} from "../blocks/logBlock.js";
import {setStorageData} from "../blocks/storageSetting.js";

let defaultValue = {
    userprefsOther:{},
    userprefsWorkspace:{},
};

function saveSettings (){
   
    const form = $$("userprefsTabbar").getValue()+"Form";
    if ($$(form).isDirty()){
    
        webix.ajax().get("/init/default/api/userprefs/", {
            success:function(text, data, XmlHttpRequest){
                data = data.json().content;
                if (data.err_type == "e"){
                    setLogValue("error",data.error);
                }

                let settingExists = false;
                const values = $$(form).getValues();
                let sentObj = {
                    name:form,
                    prefs:values
                };

         
              

                data.forEach(function(el,i){
                    if (el.name == form){
                        settingExists = true;

                        webix.ajax().put("/init/default/api/userprefs/"+el.id, sentObj, {
                            success:function(text, data, XmlHttpRequest){
                                data = data.json();
                                if (data.err_type == "i"){
                                    setStorageData (form, JSON.stringify($$(form).getValues()));
                                    setLogValue("success","Настройки сохранены");
                                } if (data.err_type == "e"){
                                    setLogValue("error",data.error);
                                }
                                defaultValue[$$("userprefsTabbar").getValue()] = values;
                                $$(form).setDirty(false);
                            },
                            error:function(text, data, XmlHttpRequest){
                                ajaxErrorTemplate("015-011",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                            }
                        }).catch(error => {
                            console.log(error);
                            ajaxErrorTemplate("015-011",error.status,error.statusText,error.responseURL);
                        });
                      
                    } 
                });

      
                if (!settingExists){
                    sentObj.owner = 1;
                    webix.ajax().post("/init/default/api/userprefs/",sentObj, {
                        success:function(text, data, XmlHttpRequest){
                            data = data.json();
    
                            if (data.err_type == "i"){
                                setLogValue("success","Настройки сохранены");
                            } else if (data.err_type == "e"){
                                setLogValue("error",data.error);
                            }
                            defaultValue[$$("userprefsTabbar").getValue()] = values;
                            $$(form).setDirty(false);
                            
                        },
                        error:function(text, data, XmlHttpRequest){
                            ajaxErrorTemplate("015-001",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                        }
                    }).catch(error => {
                        console.log(error);
                        ajaxErrorTemplate("015-001",error.status,error.statusText,error.responseURL);
                    });
                }
            
            },
            error:function(text, data, XmlHttpRequest){
                ajaxErrorTemplate("015-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
            }
        }).catch(error => {
            console.log(error);
            ajaxErrorTemplate("015-000",error.status,error.statusText,error.responseURL);
        });

    } else {
        setLogValue("debug","Сохранять нечего");
    }
}


const userprefsHeadline =  [ 

    {   
    view:"template",
    template:"<div>Настройки</div>",
    css:"webix_headline-userprefs",
    height:35, 
    borderless:true,
    },

    {   view:"template",
        id:"userprefsName",
        css:"webix_userprefs-info",
        template:function(){
            if (Object.keys($$("userprefsName").getValues()).length !==0){
                return "<div style='display:inline-block;color:var(--primary);font-size:13px!important;font-weight:600'>Имя пользователя:</div>"+"⠀"+"<div style='display:inline-block;font-size:13px!important;font-weight:600' >"+$$("userprefsName").getValues()+"<div>";
            } else {
                return "<div style='display:inline-block;color:var(--primary);font-size:13px!important;font-weight:600'>Имя пользователя:</div><div style='display:inline-block;font-size:13px!important;font-weight:600'>не указано</div>";
            }
        },
        height:50, 
        borderless:true,
        },

];

const userprefsOther = {
    view:"scrollview",
    borderless:true, 
    css:"webix_multivew-cell",
     id:"userprefsOther", 
    scroll:"y", 
    body:{    
        view:"form", 
        id:"userprefsOtherForm",
        borderless:true,
        elements:[
            {
                view:"radio",
                labelPosition:"top", 
                label:"Автообновление специфичных страниц", 
                value:1,
                name:"autorefOpt", 
                options:[
                    {"id":1, "value":"Включено"},
                    {"id":2, "value":"Выключено"}
                ],
                on:{
                    onChange:function(newValue, oldValue){
                        if (newValue == 1 && !($$("userprefsAutorefCounter").isVisible())){
                            $$("userprefsAutorefCounter").show();
                        }

                        if (newValue == 2 && $$("userprefsAutorefCounter").isVisible()){
                            $$("userprefsAutorefCounter").hide();
                        }
                    
                        if (newValue !== oldValue){
                            defaultValue.userprefsOther.autorefOpt = oldValue;
                        }
                     
                    }
                }
            },
            {height:5},
            {   view:"counter", 
                id:"userprefsAutorefCounter",
                labelPosition:"top",
                name:"autorefCounterOpt", 
                label:"Интервал автообновления (в миллисекундах)" ,
                min:15000, 
                max:900000,
                on:{
                    onChange:function(newValue, oldValue){
                        if (newValue !== oldValue){
                            defaultValue.userprefsOther.autorefCounterOpt = oldValue;
                        }
                        const minVal = $$("userprefsAutorefCounter").config.min;
                        const maxVal = $$("userprefsAutorefCounter").config.max;
                        
                        if (newValue == minVal){
             
                            webix.message({type:"debug",expire:1000, text:"Минимальное возможное значение"});
                        } else if (newValue == maxVal){
                            webix.message({type:"debug",expire:1000, text:"Максимальное возможное значение"});
                        }


                    }
                }
            },
            {}
        ],
        on:{
            // onBeforeLoad:function(){
            //     console.log(this.getValues())
            //     defaultValue.userprefsOther = this.getValues()  
            // }
        }
    }
};

const userprefsWorkspace = {
    view:"scrollview",
    borderless:true, 
    css:"webix_multivew-cell",
    id:"userprefsWorkspace",
    scroll:"y", 
    body:{    
        view:"form", 
        id:"userprefsWorkspaceForm",
        borderless:true,
        elements:[
            { cols:[
                { rows:[  
                    {
                        view:"radio",
                        labelPosition:"top",
                        name:"logBlockOpt", 
                        label:"Отображение блока системных сообщений", 
                        value:1, options:[
                            {"id":1, "value":"Показать"}, 
                            {"id":2, "value":"Скрыть"}
                        ],
                        on:{
                            onAfterRender: function () {
                                this.getInputNode().setAttribute("title","Показать/скрыть по умолчанию блок системных сообщений");
                            },
                    
                            onChange:function(newValue, oldValue, config){
                                if (newValue !== oldValue){
                                    defaultValue.userprefsWorkspace.logBlockOpt = oldValue;
                                
                                    if (newValue == 1){
                                        $$("webix_log-btn").setValue(2);
                                    } else {
                                        $$("webix_log-btn").setValue(1);
                                    }
                                
                                }

                                
                            }
                        }
                    },
                    {height:15},
                    {   view:"select", 
                        name:"LoginActionOpt",
                        label:"Действие после входа в систему", 
                        labelPosition:"top",
                        value:2, 
                        
                        options:[
                        { "id":1, "value":"Перейти на главную страницу" },
                       // { "id":3, "value":"Предложить вернуться на последнюю открытую страницу" },
                        { "id":2, "value":"Перейти на последнюю открытую страницу" },
                        ],
                        on:{
                            onAfterRender: function () {
                                this.getInputNode().setAttribute("title","Показывать/не показывать всплывающее окно при загрузке приложения");
                            },
                            onChange:function(newValue, oldValue, config){
                                if (newValue !== oldValue){
                                    defaultValue.userprefsWorkspace.LoginActionOpt = oldValue;
                                }
                            }
                        }
                    },
                ]},
                {}
            ]},
    
        ]
    }
    
   
};


const userprefsConfirmBtns =  { 
    cols:[
        {width:20},          
        {   view:"button", 
            height:48,
            value:"Сбросить" 
        },
        {width:10}, 
        {   view:"button", 
            value:"Сохранить настройки" ,
            height:48, 
            id:"userprefsSaveBtn",
            css:"webix_primary",
            click: saveSettings,
        },
        {width:20}, 
     
    ]
};

const userprefsTabbar =  {
    rows:[
        {   view:"tabbar",  
            type:"top", 
            id:"userprefsTabbar",
            css:"webix_filter-popup-tabbar",
            multiview:true, 
            options: [
            {  value: "<span class='webix_tabbar-filter-headline'>Рабочее пространство</span>", id: 'userprefsWorkspace' },
            {   value: "<span class=webix_tabbar-filter-headline'>Другое</span>", id: 'userprefsOther' },
            ],
            height:50,
            on:{
                onBeforeTabClick:function(id){
                    const formId = $$("userprefsTabbar").getValue()+"Form";
                    if ($$(formId).isDirty()){
                        webix.modalbox({
                            title:"Данные не сохранены",
                            css:"webix_modal-custom-save",
                            buttons:["Отмена", "Не сохранять", "Сохранить"],
                            width:500,
                            text:"Выберите действие перед тем как продолжить"
                        }).then(function(result){
                            if ( result == 1){
                                $$(formId).setValues(defaultValue[$$("userprefsTabbar").getValue()])
                                $$("userprefsTabbar").setValue(id);
                            } else if ( result == 2){
                                saveSettings ();
                                $$("userprefsTabbar").setValue(id);
                            }
                        });
                        
                        return false;
                    }
                   
                }
            }
        },
        {
            cells:[
                userprefsWorkspace,
                userprefsOther
            ]
        },
        userprefsConfirmBtns
    ]
};

const userprefsLayout = {

    rows:[
        { padding:{
            top:15, bottom:0, left:20, right:0
        },rows:
            userprefsHeadline,
        },
        userprefsTabbar,
    ]

   
};


export {
    userprefsLayout
};