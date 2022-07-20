//export function editTable () {

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
        view:"form", id:'editForm', width: 350,

        elements:[
            
            {  margin:5, borderless:true,cols: [
            
            //{ view:"button", id:"btnAdd", height:45,width:50,css:"webix_add-btn",  type:"icon", icon:"wxi-plus",  click:addItem},
            { view:"button", id:"btnClean",height:45,width:100,  value:"Очистить", click:clearForm},
            {},
            { view:"button", id:"btnRemove",height:45,width:50,css:"webix_danger", type:"icon", icon:"wxi-trash", click:removeItem},
            ]},
            { view:"button", id:"btnAdd", value:"Добавить новую запись", height:45, css:"webix_primary", click:addItem},
            { view:"button", id:"btnSave",hidden:true, value:"Сохранить", height:45, css:"webix_primary", click:saveItem},
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

    
export{
    editTableBar,
    notify
};
