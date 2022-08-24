import {tableId, editFormId, saveBtnId,searchId, addBtnId, delBtnId, cleanBtnId, saveNewBtnId,newAddBtnId} from './setId.js';
import {itemTreeId,getComboOptions} from './sidebar.js';
import {setLogValue} from './logBlock.js';
import {headerContextId} from './header.js';
import {tableNames} from "./login.js";
let currId;

function getCurrId (){
    if ( itemTreeId.length == 0){
        currId=headerContextId;
    } else {
        currId=itemTreeId;
    }
}


//--- bns
function saveItem(tableEditorVal){        
    getCurrId ();
    let itemData = $$(editFormId).getValues();   
    if($$(editFormId).validate() ){
        if( itemData.id ) {
            webix.ajax().put("/init/default/api/"+currId+"/"+itemData.id, itemData, {
                success:function(){
                    $$( tableId ).updateItem(itemData.id, itemData);
                    clearItem();
                    notify ("success","Данные сохранены",true);
                    defaultStateForm ();
                    $$("inputsTable").hide();
                    $$(tableId).clearSelection();
                    $$(newAddBtnId).enable();
                },
                error:function(){
                    notify ("error","Ошибка при сохранении данных",true);
                }
            });
        }    
  
    } else {
        notify ("error","Заполните пустые поля",true);
    }

    
}



function addItem () {
    if($$(editFormId).isDirty()){
        popupExec("Данные не сохранены").then(
        function(){
            $$(tableId).filter(false);
            $$(tableId).hideOverlay("Ничего не найдено");
            $$(searchId).setValue("");
            createEditFields();
            $$(delBtnId).disable();
            $$(saveBtnId).hide();
            $$(saveNewBtnId).show();
        });

    } else {
        $$(tableId).filter(false);
        $$(tableId).hideOverlay("Ничего не найдено");
        $$(searchId).setValue("");
        createEditFields();
        $$(delBtnId).disable();
        $$(saveBtnId).hide();
        $$(saveNewBtnId).show();
        $$(newAddBtnId).disable();
    }


}



function saveNewItem (){
    getCurrId ();
    
    if($$( editFormId ).validate() ) {
        if($$(editFormId).isDirty()){
            let newValues = $$(editFormId).getValues();
            newValues.id= $$(tableId).count()+1;

            webix.ajax().post("/init/default/api/"+currId, newValues,{
                success:function( ){
                    $$(tableId).add(newValues);
                    clearItem();
                    defaultStateForm ();
                    $$("inputsTable").hide();
                    $$(newAddBtnId).enable();
                    notify ("success","Данные успешно добавлены", true);
                },
                error:function(){
                    notify ("error","Ошибка при добавлении данных", true);
                }
            });
        }else {
            notify ("debug","Форма пуста");
        }
    } else {
        notify ("error","Заполните пустые поля",true);
    }
   
}


function removeItem() {
    getCurrId ();
    popupExec("Запись будет удалена").then(
        function(){
            $$( tableId ).remove($$(editFormId).getValues().id);
            let formValues = $$(editFormId).getValues();
            webix.ajax().del("/init/default/api/"+currId+"/"+formValues.id+".json", formValues,{
                success:function(){
                    clearItem();
                    defaultStateForm ();
                    $$("inputsTable").hide();
                    notify ("success","Данные успешно удалены",true);
                },
                error:function(){
                    notify ("error","Ошибка при удалении записи",true);
                }
            });
            
    });
    
    
}


//--- bns




//--- components

function createEditFields () {

    let columnsData = $$(tableId).getColumns();

    if(Object.keys($$(editFormId).elements).length==0  ){
        let inputsArray = [];
        columnsData.forEach((el,i) => {
            if (el.type == "datetime"){
                inputsArray.push({   
                    view: "datepicker",
                    format:"%d.%m.%Y %H:%i:%s",
                    id:el.id,
                    name:el.id, 
                    label:el.label, 
                    placeholder:"дд.мм.гг", 
                    timepicker: true,
                    labelPosition:"top",
                    on:{
                        onItemClick:function(){
                            $$(editFormId).clearValidation();
                        }
                    }
                });
            } 
            

           else if (el.type.includes("reference")) {
            let findTableId = el.type.slice(10);
            let refTableName;

            tableNames.forEach(function(el,i){
                if (el.id == findTableId){
                    refTableName= el.name;
                }
            });

            inputsArray.push(
                {cols:[
                {   view:"combo",
                    placeholder:"Выберите вариант",  
                    label:el.label, 
                    id:el.id,
                    name:el.id, 
                    labelPosition:"top",
                    options:{
                        data:getComboOptions(findTableId)
                    },
                    on:{
                        onItemClick:function(){
                            $$(editFormId).clearValidation();
                        },
                        // onChange: function(newValue, oldValue, config){

                        // }
                    }
                },
                {
                    view:"button",
                    css:{"vertical-align":"bottom!important","height":"38px!important"},
                    type:"icon",
                    icon: 'wxi-angle-right',
                    inputHeight:38,
                    width: 40,
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title","Перейти в таблицу"+" "+"«"+refTableName+"»");
                        },
                    },
                    click:function(){
                        $$("tree").select(findTableId);
                    }
                }
                ]}

            );
            
            } 
            else{
                inputsArray.push(
                    {
                    view:"text", 
                    name:el.id,
                    id:el.id, 
                    label:el.label, 
                    labelPosition:"top",
                    on:{
                        onKeyPress:function(){
                            $$(editFormId).clearValidation();
                        }
                    }
                    }
                );
            }
        });

        let inpObj = {margin:8,id:"inputsTable", rows:inputsArray};

        $$(delBtnId).enable();
        return ($$(editFormId).addView( inpObj, 1));
        
    } else {
        $$(editFormId).clear();
        $$(editFormId).clearValidation();

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
    $$(delBtnId).disable();
}

function popupExec (titleText) { 

    return webix.confirm({
        width:300,
        ok: 'Да',
        cancel: 'Отмена',
        title:titleText,
        text:"Вы уверены, что хотите продолжить?"
    });
}

function notify (typeNotify,textMessage, log = false, expireTime=4000) {
    webix.message.position = "bottom";
    webix.message({type:typeNotify,expire: expireTime,  text:textMessage});
    if(log){
        setLogValue(typeNotify, textMessage);
    }

}


function checkFormSaved() {
    return new webix.promise(function(resolve){
      webix.confirm(
        {
          title: 'Данные не сохранены',
          ok: 'Да',
          width:300,
          cancel: 'Отмена',
          text: 'Вы уверены, что хотите продолжить?',
          callback: function (result) {
            if (result) {
              resolve(true);
            } else {
              resolve(false);
            }
          }
        }
      );
    });
}

//--- components





let editTableBar = {
    view:"form", 
    id:editFormId,
    css:"webix_form-edit",
    container:"webix__form-container", 
    minHeight:350,
    minWidth:210,
    width: 320,
    scroll:true,
    elements:[

        {id:"form-adaptive",minHeight:48,css:"webix_form-adaptive", margin:5, rows:[{margin:5, rows:[
           
            
            {responsive:"form-adaptive",  margin:5, 

                cols: [
                    {   view:"button",
                        id:newAddBtnId,
                        height:48,
                        minWidth:90, 
                        hotkey: "shift",
                        value:"Новая запись", click:addItem},
                        
                    {   view:"button",
                        id:delBtnId,
                        disabled:true,
                        height:48,
                        minWidth:90,
                        width:100,
                        hotkey: "shift+esc",
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
            click:saveItem,
            hotkey: "enter" 
        },
        // { 
        //     view:"button", 
        //     id:addBtnId,
        //     value:"Добавить новую запись", 
        //     height:48,
        //     disabled:true,
        //     hotkey: "shift",
        //     css:"webix_primary", 
        //     click:addItem
        // },
        { 
            view:"button", 
            id:saveNewBtnId,
            value:"Сохранить новую запись",
            hidden:true,  
            height:48,
            hotkey: "enter" ,
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
    },

};

    
export{
    editTableBar,
    notify,
    createEditFields,
    popupExec,
    defaultStateForm,
    checkFormSaved,
    clearItem,
    saveItem
};
