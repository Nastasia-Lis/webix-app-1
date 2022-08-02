let jsonFormEdit = {
    treeHeadlines :[
        {"id": 'formOne', "value": "Информация 1"}
    ],
};

const formEdit  = {
    view:"form", 
    container:"webix__form-container", 
    minHeight:350,
    scroll:false,
    elements:[
        {margin:15,
            rows:[
                { template:"<h3>Информация №1</h3>", borderless:true},
                {   view:"text",
                    placeholder:"Введите ...",  
                    label:"Название"    
                },
                {   view:"text",
                    placeholder:"Введите ...",  
                    label:"Название"    
                },
                {}
            ]},
            {margin:15,
                rows:[
                    { template:"<h3>Информация №2</h3>", borderless:true},
                    {   view:"text",
                        placeholder:"Введите ...",  
                        label:"Название"    
                    },
                    {   view:"text",
                        placeholder:"Введите ...",  
                        label:"Название"    
                    },
                    {   view:"text",
                        placeholder:"Введите ...",  
                        label:"Название"    
                    },
                    {}
            ]},
    ],
};

export {
    formEdit,
    jsonFormEdit
};