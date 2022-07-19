export function editTable () {

    function saveItem(){        
        let form = $$( "editForm" );  
        let list = $$( "tableInfo" );  
        let itemData = $$("editForm").getValues();    
        
        if( form.isDirty() && form.validate() ){
            if( itemData.id ) 
                list.updateItem(itemData.id, itemData);
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
                notify ("success","Данные удалены");
        });
        
    }
    
    function clearForm(){
        popupExec("Форма будет очищена").then(
            function(){
                clearItem();
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

    return {
        view:"form", id:'editForm', width: 350,

        elements:[
            
            {cols: [
            
            { view:"button", id:"btnAdd",  type:"icon", icon:"wxi-plus-circle",  click:addItem},
            { view:"button", id:"btnClean",  value:"Очистить", click:clearForm},
            { view:"button", id:"btnRemove",  type:"icon",css:"", icon:"wxi-trash", click:removeItem},
            ]},
            { view:"button", id:"btnSave", value:"Сохранить", css:"webix_primary", click:saveItem},
            { view:"text", name:"title", label:"Title", invalidMessage:"Must be filled in"},
            { view:"text", name:"year", label:"Year", invalidMessage:"Should be between 1970 and current" },
            { view:"text", name:"rating", label:"Rating", invalidMessage:"Cannot be empty or 0" },
            { view:"text", name:"votes", label:"Votes", invalidMessage:"Must be less than 100000" }, 
            {}
        ],


        // rules:{
        //     title: webix.rules.isNotEmpty
        // }
    };
}
