import {tableId, editFormId, saveBtnId,searchId, addBtnId, delBtnId, cleanBtnId, saveNewBtnId,newAddBtnId} from './setId.js';
import {itemTreeId,getComboOptions} from './sidebar.js';
import {setLogValue} from './logBlock.js';
import {headerContextId} from './header.js';
import {tableNames} from "./login.js";
import { catchErrorTemplate,ajaxErrorTemplate} from "./logBlock.js";

let currId;

let editTableBar;

function getCurrId (){
    if ( itemTreeId.length == 0){
        currId=headerContextId;
    } else {
        currId=itemTreeId;
    }
}


//--- bns
function saveItem(addBtnClick=false){    
    try{    
        getCurrId ();
        let itemData = $$(editFormId).getValues();   
        if($$(editFormId).validate() ){
            if( itemData.id ) {

                webix.ajax().put("/init/default/api/"+currId+"/"+itemData.id, itemData, {
                    success:function(){
                        $$( tableId ).updateItem(itemData.id, itemData);
                        notify ("success","Данные сохранены",true);
                        clearItem();
                        defaultStateForm ();
                        $$(tableId).clearSelection();
                        
                        if (!(addBtnClick)){
                            $$("inputsTable").hide();
                            $$(newAddBtnId).enable();
                        if ($$("EditEmptyTempalte")&&!($$("EditEmptyTempalte").isVisible())){
                            $$("EditEmptyTempalte").show();
                        }
                            
                        } else {
                            $$(tableId).filter(false);
                            createEditFields(editFormId);
                            $$(delBtnId).disable(); 
                            $$(saveBtnId).hide();
                            $$(saveNewBtnId).show();
                        }
                    
                    },
                    error:function(text, data, XmlHttpRequest){
                        ajaxErrorTemplate("003-011",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                    }
                });
            }    
    
        } else {
            notify ("error","Заполните пустые поля",true);
        }
    }catch (error){
        catchErrorTemplate("003-000", error);
    }

}



function addItem () {
    try {
        if($$(editFormId).isDirty()){

            modalBox().then(function(result){
                if (result == 1){
                    $$(tableId).filter(false);
                    createEditFields(editFormId);
                    $$(delBtnId).disable();
                    $$(saveBtnId).hide();
                    $$(saveNewBtnId).show();
                
                } else if (result == 2){
                    if ($$(editFormId).validate()){
                        saveItem(true);
                        
                    } else {
                        notify ("error","Заполните пустые поля",true);
                        return false;
                    }
                    
                }
            });

        } else {
            if ($$("EditEmptyTempalte")&&$$("EditEmptyTempalte").isVisible()){
                $$("EditEmptyTempalte").hide();
            }
            $$(tableId).clearSelection();
            $$(tableId).filter(false);
            $$(tableId).hideOverlay("Ничего не найдено");
            createEditFields(editFormId);
            $$(delBtnId).disable();
            $$(saveBtnId).hide();
            $$(saveNewBtnId).show();
            $$(newAddBtnId).disable();
        }
    }catch (error){
        catchErrorTemplate("003-000", error);
    }


}



function saveNewItem (){
    try{
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
                        if ($$("EditEmptyTempalte")&&!($$("EditEmptyTempalte").isVisible())){
                            $$("EditEmptyTempalte").show();
                        }
                        notify ("success","Данные успешно добавлены", true);
                    },
                    error:function(text, data, XmlHttpRequest){
                        ajaxErrorTemplate("003-001",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                    }
                });
            }else {
                notify ("debug","Форма пуста");
            }
        } else {
            notify ("error","Заполните пустые поля",true);
        }
    }catch (error){
        catchErrorTemplate("003-000", error);
    }
   
}


function removeItem() {
    try{
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
                    error:function(text, data, XmlHttpRequest){
                        ajaxErrorTemplate("003-002",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                    }
                });
                
        });
    }catch (error){
        catchErrorTemplate("003-000", error);
    }
    
}


//--- bns




//--- components

function createEditFields (parentElement, viewPosition=1) {
    try {
        let columnsData = $$(tableId).getColumns();

        if(Object.keys($$(parentElement).elements).length==0  ){
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
                                $$(parentElement).clearValidation();
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
                                $$(parentElement).clearValidation();
                            },
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
                            try {
                                $$("tree").select(findTableId);
                            } catch (e){
                                console.log(e);
                                notify ("error","Таблица не найдена",true);

                                if ($$("EditEmptyTempalte")&&$$("EditEmptyTempalte").isVisible()){
                                    $$("EditEmptyTempalte").hide();
                                }
                            }
                            
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
                                $$(parentElement).clearValidation();
                            }
                        }
                        }
                    );
                }
            });

            let inpObj = {margin:8,id:"inputsTable", rows:inputsArray};

            if(parentElement==editFormId){
                $$(delBtnId).enable();
            }
            
            return ($$(parentElement).addView( inpObj, viewPosition));
            
        } else {
            $$(parentElement).clear();
            $$(parentElement).clearValidation();

            if(parentElement==editFormId){
                $$(delBtnId).enable();
            }
            $$("inputsTable").show();
        }
    } catch (error){
        catchErrorTemplate("003-000", error);
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

function modalBox (){
    return webix.modalbox({
        title:"Данные не сохранены",
        css:"webix_modal-custom-save",
        buttons:["Отмена", "Не сохранять", "Сохранить"],
        width:500,
        text:"Выберите действие перед тем как продолжить"

    })
}


function notify (typeNotify,textMessage, log = false, expireTime=4000) {
    //webix.message.position = "bottom";
    //webix.message({type:typeNotify,expire: expireTime,  text:textMessage});
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


try{


 editTableBar = {
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
            click:function(){
                saveItem();
            },
            hotkey: "enter" 
        },
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
        {id:"EditEmptyTempalte",template:"<div style='color:#858585;font-size:13px!important'>Добавьте новую запись или выберите существующую из таблицы</div>", borderless:true}


        ]},


        
    ]},

    ],
    
    rules:{
        $all:webix.rules.isNotEmpty
    },


    ready:function(){
        this.validate();
    },

};
} catch (error){
    alert("Ошибка при выполнении"+" "+ error);
    console.log(error);
    window.stop();
   
}

    
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
