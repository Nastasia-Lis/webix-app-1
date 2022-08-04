function form (idForm, formElements) {
    return {
        view:"form", 
        id:idForm,
        container:"webix__form-container", 
        minHeight:350,
        scroll:false,
        elements:formElements,
    };
}



//----- form view parameters
let jsonFormView = {
    treeHeadlines :[
        {"id": 'formTwo', "value": "Информация 101"}
    ],
};

let elementsFormView = [
    {margin:15,
        rows:[
            { template:"<h3>Информация №1</h3>", css:"webix_form-template",borderless:true},
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
            {}
        ]},
        {margin:15,
            rows:[
                { template:"<h3>Информация №2</h3>",css:"webix_form-template", borderless:true},
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
];
//----- form view parameters






//----- form edit parameters
let jsonFormEdit = {
    treeHeadlines :[
        {"id": 'formOne', "value": "Информация 1"}
    ],
};

let elementsFormEdit = [
    {margin:15,
        rows:[
            { template:"<h3>Информация №1</h3>", css:"webix_form-template",borderless:true},
            {   view:"text",
                placeholder:"Введите ...",  
                label:"Название"    
            },
            {   view:"text",
                placeholder:"Введите ...",  
                label:"Название"    
            },
            { 
                view:"button", 
                value:"Сохранить", 
                height:48, 
                css:"webix_primary", 
                hotkey: "enter" 
            },
            {}
        ]},
        {margin:15,
            rows:[
                { template:"<h3>Информация №2</h3>",css:"webix_form-template", borderless:true},
                {   view:"text",
                    text:"Информация 1",
                    placeholder:"Введите ...",  
                    label:"Название"    
                },
                {   view:"text",
                    text:"Информация 2",
                    placeholder:"Введите ...",  
                    label:"Название"    
                },
                { 
                    view:"button", 
                    value:"Сохранить", 
                    height:48, 
                    css:"webix_primary", 
                    hotkey: "enter" ,
                    disabled:true,
                },
                {}
        ]},
];
//----- form edit parameters


export {
    form,
    jsonFormView,
    elementsFormView,

    jsonFormEdit,
    elementsFormEdit
};