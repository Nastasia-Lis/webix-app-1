import {tableId, editFormId, saveBtnId, addBtnId, delBtnId, cleanBtnId, saveNewBtnId} from './setId.js';

//--- bns
function saveItem(){        
    let list = $$( tableId );  
    let itemData = $$(editFormId).getValues();    
    
    if($$(editFormId).validate() ){
       
        if( itemData.id ) {
            list.updateItem(itemData.id, itemData);
            clearItem();
            notify ("success","Данные сохранены");
            defaultStateForm ();
            $$("inputsTable").hide();
            $$(tableId).clearSelection();}
        else {
            list.add( itemData );
            clearItem();
            notify ("success","Данные добавлены");
        }    
    } else {
        notify ("error","Заполните пустые поля");
    }
}

function addItem () {
    createEditFields();
    $$(delBtnId).disable();
    $$(saveBtnId).hide();
    $$(addBtnId).hide();
    $$(saveNewBtnId).show();
}


function saveNewItem (){
    
    if($$( editFormId ).validate() ) {
        if($$(editFormId).isDirty()){
            $$(tableId).add($$(editFormId).getValues());
            clearItem();
            notify ("success","Данные добавлены"); 
            defaultStateForm ();
            $$("inputsTable").hide();
        }else {
            notify ("debug","Форма пуста");
        }
    } else {
        notify ("error","Заполните пустые поля");
    }
}


function removeItem() {
    popupExec("Запись будет удалена").then(
        function(){
            $$( tableId ).remove($$(editFormId).getValues().id);
            clearItem();
            if ($$(saveBtnId)) {
                $$(saveBtnId).hide();
                $$(addBtnId).show();
            }
            $$("inputsTable").hide();
            notify ("success","Данные удалены");
    });
    defaultStateForm ();
    
}



function clearForm(){
    if ($$(saveBtnId).isVisible()){
        $$(editFormId).setDirty(true);
    } 
    
    if($$(editFormId).isDirty()){
        popupExec("Форма будет очищена").then(
            function(){
                clearItem();
                $$(tableId).clearSelection();
                defaultStateForm ();
                $$("inputsTable").hide();
                notify ("success","Форма очищена");
        });
    } else {
        notify ("debug","Форма пуста");
    }
}

//--- bns




//--- components

function createEditFields () {
    
    $$(tableId).attachEvent("onBeforeLoad", webix.once(function( ){
        //при переходе в др табл

        //получить id текущего tree item 
        // переменная в дереве, сравнить???
        //вставить если fail

        let currItemTree ;
        let newItemTree = $$("tree").getSelectedItem();
        console.log(currItemTree)
        popupExec ("Данные не сохранены").then(
            function(){
               
        }).fail(function(){
            webix.message("Cancel");
        });


        // if($$(editFormId).isDirty()){
        //     popupExec("Форма будет очищена").then(
        //         function(){
        //             clearItem();
        //             $$(tableId).clearSelection();
        //             defaultStateForm ();
        //             $$("inputsTable").hide();
        //             notify ("success","Форма очищена");
        //     });
        // } else {
        //     notify ("debug","Форма пуста");
        // }

    }));
    


    let columnsData = $$(tableId).getColumns();

    if(Object.keys($$(editFormId).elements).length==0  ){
        //let headersArray= $$(tableId).getColumns();
        //console.log(columnsData[0].label)
        let inputsArray = [];
        columnsData.forEach((el) => {
            
            inputsArray.push(
                {
                view:"text", 
                name:el.id, 
                label:el.label, 
                }
            );
        });
        let inpObj = {margin:8,id:"inputsTable", rows:inputsArray};
        $$(cleanBtnId).enable(); 
        $$(delBtnId).enable();
        return ($$(editFormId).addView( inpObj, 1));
    } else {
        //$$(editFormId).refresh();
        $$(cleanBtnId).enable(); 
        $$(delBtnId).enable();
        $$("inputsTable").show();
    }
}

function clearItem(){
    $$(editFormId).clear();
    $$(editFormId).clearValidation();
    defaultStateForm ();
}

function defaultStateForm () {
    if ($$(saveNewBtnId).isVisible()) {

        $$(saveNewBtnId).hide();
    } else if ($$(saveBtnId).isVisible()){
        $$(saveBtnId).hide();
    }
    $$(addBtnId).show();
    $$(delBtnId).disable();
    $$(cleanBtnId).disable();
}

function popupExec (titleText) { 
    return webix.confirm({
        width:300,
        title:titleText,
        text:"Вы уверены?"
    });
}

function notify (typeNotify,textMessage) {
    webix.message.position = "bottom";
    webix.message({type:typeNotify,  text:textMessage});
}

//--- components





let editTableBar = {
    view:"form", 
    id:editFormId,
    container:"webix__form-container", 
    minHeight:350,
    minWidth:350,
    width: 350,
    scroll:true,
    elements:[
        {margin:5,rows:[{margin:5, rows:[
                {margin:5, 
                borderless:true,
                cols: [
                    {   view:"button", 
                        id:cleanBtnId,
                        height:48, 
                        disabled:true,
                        value:"Очистить форму", click:clearForm},
                        
                    {   view:"button", 
                        id:delBtnId,
                        disabled:true,
                        height:48,
                        width:100,
                        css:"webix_danger", 
                        type:"icon", 
                        icon:"wxi-trash", 
                        click:removeItem,
                        on: {
                            onAfterRender: function () {
                                this.getInputNode().setAttribute("title","Удалить запись из таблицы");
                            }
                        } 
                    },
                ]
        },
            
       
        ]},

       {margin:10, rows:[ { 
            view:"button", 
            id:saveBtnId,
            hidden:true, 
            value:"Сохранить", 
            height:48, 
            css:"webix_primary", 
            click:saveItem
        },
        { 
            view:"button", 
            id:addBtnId,
            value:"Добавить новую запись", 
            height:48,
            disabled:true,
            css:"webix_primary", 
            click:addItem
        },
        { 
            view:"button", 
            id:saveNewBtnId,
            value:"Сохранить новую запись",
            hidden:true,  
            height:48,
            css:"webix_primary", 
            click:saveNewItem
        },

        ]},
        
    ]},
    {}
    
    
    ],
    
    rules:{
        $all:webix.rules.isNotEmpty
    },
    ready:function(){
        this.validate();
        console.log(window.innerWidth)
    },

};

    
export{
    editTableBar,
    notify,
    createEditFields,
    popupExec,
    defaultStateForm
};
