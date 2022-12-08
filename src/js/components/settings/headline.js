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

export {
    layoutHeadline
};