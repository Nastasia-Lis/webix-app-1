function saveItem(){        
    let form = $$( "editForm" );  
    let list = $$( "tableInfo" );  
    let itemData = $$("editForm").getValues();    
    
    if( form.isDirty() && form.validate() ){
        if( itemData.id ) 
            list.updateItem(itemData.id, itemData);
            clearItem();
            $$("btnSave").hide();
            $$("btnAdd").show();
            notify ("success","Данные сохранены");
            
    }
}

function addItem () {
    $$("tableInfo").add($$("editForm").getValues());
    clearItem();
    notify ("success","Данные добавлены");
}

function removeItem() {
    popupExec("Запись будет удалена").then(
        function(){
            $$( "tableInfo" ).remove($$("editForm").getValues().id);
            clearItem();
            if ($$("btnSave")) {
                $$("btnSave").hide();
                $$("btnAdd").show();
            }
            notify ("success","Данные удалены");
    });
    
}

function clearForm(){
    popupExec("Форма будет очищена").then(
        function(){
            clearItem();
            if ($$("btnSave")) {
                $$("btnSave").hide();
                $$("btnAdd").show();
            }
            notify ("success","Форма очищена");
    }); 
}

function clearItem(){
    $$("editForm").clear();
    $$("editForm").clearValidation();
}

function popupExec (titleText) { 
    return webix.confirm({
        title:titleText,
        text:"Вы уверены?"
    });
}

function notify (typeNotify,textMessage) {
    webix.message.position = "bottom";
    webix.message({type:typeNotify,  text:textMessage});
}

let editTableBar = {
    view:"form", id:'editForm', minHeight:350,

    elements:[
        
        {margin:15,rows:[{margin:5, rows:[
                {margin:5, 
                borderless:true,
                cols: [
                    {   view:"button", 
                        id:"btnClean",
                        height:48,
                        //maxWidth:1500,  
                        value:"Очистить форму", click:clearForm},
                    {   view:"button", 
                        id:"btnRemove",
                        height:48,
                        width:100,
                        css:"webix_danger", 
                        type:"icon", 
                        icon:"wxi-trash", 
                        click:removeItem
                    },
                ]
        },
            
        { 
            view:"button", 
            id:"btnAdd", 
            value:"Добавить новую запись", 
            height:48,
            css:"webix_primary", 
            click:addItem
        }
        ]},

       {margin:10, rows:[ { 
            view:"button", 
            id:"btnSave",
            hidden:true, 
            value:"Сохранить", 
            height:48, 
            css:"webix_primary", 
            click:saveItem
        },
        { 
            view:"text", 
            name:"title", 
            label:"Title", 
            invalidMessage:"-"
        },
        { 
            view:"text", 
            name:"year", 
            label:"Year", 
            invalidMessage:"-"
        },
        { 
            view:"text", 
            name:"rating", 
            label:"Rating", 
            invalidMessage:"-" 
        },
        { 
            view:"text", 
            name:"votes",
            label:"Votes", 
            invalidMessage:"-" 
        }, 
        {}]}]}
    
    
    ],


    // rules:{
    //     title: webix.rules.isNotEmpty
    // }
};

    
export{
    editTableBar,
    notify
};
