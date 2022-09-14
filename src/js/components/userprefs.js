
let checkDirtyForm = false;
let defaultValue = {
    userprefsOther:"",
    userprefsWorkspace:"",
};

const userprefsHeadline =  [ 
    
   // {height:20},
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
                            checkDirtyForm = true;
                        }
                     
                    }
                }
            },
            {height:5},
            {   view:"counter", 
                id:"userprefsAutorefCounter",
                labelPosition:"top",
                name:"autorefCounterOpt", 
                label:"Интервал автообновления" ,
                min:30, 
                max:7200,
                on:{
                    onChange:function(newValue, oldValue){
                        if (newValue !== oldValue){
                            checkDirtyForm = true;
                        }

                        const minVal = $$("userprefsAutorefCounter").config.min;
                        const maxVal = $$("userprefsAutorefCounter").config.max;
                        
                        if (newValue == minVal){
                            console.log("uueuue")
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
                                    checkDirtyForm = true;
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
                        { "id":2, "value":"Предложить вернуться на последнюю открытую страницу" },
                        { "id":3, "value":"Сразу перейти на последнюю открытую страницу" },
                        ],
                        on:{
                            onAfterRender: function () {
                                this.getInputNode().setAttribute("title","Показывать/не показывать всплывающее окно при загрузке приложения");
                            },
                            onChange:function(newValue, oldValue, config){
                                if (newValue !== oldValue){
                                    checkDirtyForm = true;
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
        {   view:"button", 
            value:"Сохранить настройки" ,
            height:48, 
            css:"webix_primary"
        },
        {width:10},            
        {   view:"button", 
            height:48,
            value:"Сбросить" 
        },
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
                    const tabbarOptions = $$("userprefsTabbar").config.options;
                    let prevActiveOption;
                    tabbarOptions.forEach(function(el,i){
                        if ($$(el.id).isVisible()){
                            prevActiveOption = el.id ;
                        }
                    });
                    if (checkDirtyForm){
                        webix.modalbox({
                            title:"Данные не сохранены",
                            css:"webix_modal-custom-save",
                            buttons:["Отмена", "Не сохранять", "Сохранить"],
                            width:500,
                            text:"Выберите действие перед тем как продолжить"
                        }).then(function(result){
                            if ( result == 1){
                                $$("userprefsTabbar").setValue(id);
                                checkDirtyForm = false;
                                // tabbarOptions.forEach(function(el,i){
                                //     console.log(el.id, $$(el.id).isVisible())
                                // });
                          //     $$(prevActiveOption+"Form").refresh();
               
                               $$(prevActiveOption+"Form").setValues(defaultValue);
                            } else if ( result == 2){
                                $$("userprefsTabbar").setValue(id);
                                checkDirtyForm = false;
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