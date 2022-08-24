

const userprefsLayout = {

    view:"form", 
    id:"userprefsForm",
    borderless:true,
    elements:[
        {cols:[{rows:[{  view:"template",
            id:"userprefsInfo",
            template:"",
            height:50, borderless:true,
        },
        {   view:"select", 
            label:"Отображение блока сообщений", 
            labelPosition:"top",
            value:1, 
            options:[
            { "id":1, "value":"Открыт" },
            { "id":2, "value":"Скрыт" },
            ],
            on:{
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
                    let currentDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;


                    let putObj = {
                        cdt:currentDate,
                        id: 2,
                        name: "default",
                        owner: 1,
                        //prefs: "{\"pageLimit\":8,\"countMsgFlashAlert\":30}",
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
        {   view:"button", 
                value:"Сохранить настройки" , 
                css:"webix_primary"
        },
        {   view:"button", 
            value:"Сбросить настройки" , 
            css:"webix_primary"
         },
        ]},
        {}
        ]}
    ]
   
};

export {
    userprefsLayout
};