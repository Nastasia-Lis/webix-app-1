let jsonFormView = {
    treeHeadlines :[
        {"id": 'formTwo', "value": "Информация 101"}
    ],
};
let formView  = {
    view:"form", 
    container:"webix__form-container", 
    minHeight:350,
    scroll:false,
    elements:[
        {margin:15,
            rows:[
                { template:"<h3>Информация №1</h3>", borderless:true},
                {   view:"text",
                    disabled:true,
                    placeholder:"Введите ...",  
                    label:"Название"    
                },
                {   view:"text",
                    disabled:true,
                    placeholder:"Введите ...",  
                    label:"Название"    
                },
                {}
            ]},
            {margin:15,
                rows:[
                    { template:"<h3>Информация №2</h3>", borderless:true},
                    {   view:"text",
                        disabled:true,
                        text:"Информация 1",
                        placeholder:"Введите ...",  
                        label:"Название"    
                    },
                    {   view:"text",
                        disabled:true,
                        text:"Информация 2",
                        placeholder:"Введите ...",  
                        label:"Название"    
                    },
                    {   view:"text",
                        disabled:true,
                        text:"Информация 3",
                        placeholder:"Введите ...",  
                        label:"Название"    
                    },
                    {}
            ]},
    ],
};


export {
    formView,
    jsonFormView
};