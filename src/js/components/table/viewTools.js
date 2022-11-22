function backFilterBtnClick (){
    const tools       = $$("formsTools");    
    const сontainer   = $$("formsContainer");
    const formResizer = $$("formsTools-resizer");

    function setBtnFilterState(){
        const btnClass          = document.querySelector(".webix_btn-filter");
        const primaryBtnClass   = "webix-transparent-btn--primary";
        const secondaryBtnClass = "webix-transparent-btn";

        if (btnClass.classList.contains(primaryBtnClass  )){
            btnClass.classList.add     (secondaryBtnClass);
            btnClass.classList.remove  (primaryBtnClass  );
        }
    }
    function defaultState(){
        if ( tools && tools.isVisible() ){
            tools.hide();
            formResizer.hide();
        }
    
        if ( сontainer && !(сontainer.isVisible()) ){
            сontainer.show();
        }
    }


    defaultState();
    setBtnFilterState();
}

const filterBackTableBtn = { 
    view    : "button", 
    id      : "table-backFormsBtnFilter",
    type    : "icon",
    icon    : "icon-arrow-right",
    value   : "Вернуться к таблице",
 //   hidden:true,  
    height  : 28,
    minWidth: 50,
    width   : 55,
   
    click   : function(){
        backFilterBtnClick();
    },

    on: {
        onAfterRender: function () {
            this.getInputNode().setAttribute("title","Вернуться к таблице");
        }
    } 
};

const viewTools = {
    id:"viewTools",
    padding:10,
    rows:[
       {cols:[

            {  
                template:"Действия",
                height:30, 
                css:"popup_headline",
                borderless:true,
            },
            {},
            filterBackTableBtn
        ]},
   
        {id:"viewToolsContainer",rows:[{}]}
    ]
};

export {
    viewTools
};