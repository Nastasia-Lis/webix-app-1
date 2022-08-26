

const userprefsLayout = {

    view:"form", 
    id:"userprefsForm",
    borderless:true,
    elements:[
        {cols:[{rows:[
        {   view:"template",
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
       
        {   view:"select", 
            label:"Отображение блока сообщений", 
            labelPosition:"top",
            value:1, 
            options:[
            { "id":1, "value":"Показать" },
            { "id":2, "value":"Скрыть" },
            ],
            on:{
            
                onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Показать/скрыть по умолчанию блок системных сообщений");
                },
           
                onChange:function(newValue, oldValue, config){
                    console.log(newValue, oldValue, config);
                    let prefs = {logState:newValue};
                    console.log(prefs.logState.toString());
                 

                    const date = new Date();

                    let day = date.getDate();
                    let month = String(date.getMonth() + 1).padStart(2, '0');
                    let year = date.getFullYear();
                    let hours = date.getHours();
                    let minutes =String( date.getMinutes()).padStart(2, '0');
                    let seconds =date.getSeconds();
                    let currentDate = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;


                    let putObj = {
                        cdt:currentDate,
                        id: 4,
                        name: "default",
                        owner: 1,
                       // prefs: "{\"pageLimit\":8,\"countMsgFlashAlert\":30}",
                        prefs:{logState:prefs.logState.toString()},
                        ptype: 0
                    };
                    webix.ajax().put("/init/default/api/userprefs",putObj,{
                        success:function(text, data, XmlHttpRequest){
                            console.log(data.json());
                        },
                        error:function(text, data, XmlHttpRequest){
                            console.log(data.json());
                        }
                    });
                }
            }
        },
        {height:15},
        {   view:"select", 
            label:"Предлагать вернуться к тому, на чем остановились в прошлый раз", 
            labelPosition:"top",
            value:1, 
            options:[
            { "id":1, "value":"Предлагать" },
            { "id":2, "value":"Не предлагать" },
            ],
            on:{
                onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Показывать/не показывать всплывающее окно при загрузке приложения");
                },
                onChange:function(newValue, oldValue, config){
                }
            }
        },
        {height:20},
        { cols:[
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
        ]},
        ]},
        {}
        ]}
    ]
   
};

export {
    userprefsLayout
};