import {tableId, editFormId, saveBtnId,searchId, addBtnId, delBtnId, cleanBtnId, saveNewBtnId} from './setId.js';
import {itemTreeId} from './sidebar.js';


//--- bns
function saveItem(){        

    let itemData = $$(editFormId).getValues();   
    if($$(editFormId).validate() ){
        if( itemData.id ) {
            webix.ajax().put("/init/default/api/"+itemTreeId+"/"+itemData.id, itemData, {
                success:function(){
                    console.log("success");
                    $$( tableId ).updateItem(itemData.id, itemData);
                    clearItem();
                    notify ("success","Данные сохранены");
                    defaultStateForm ();
                    $$("inputsTable").hide();
                    $$(tableId).clearSelection();
                },
                error:function(){
                    notify ("error","Ошибка при сохранении данных");
                }
            });
        }    
        else {
            $$( tableId ).add( itemData );
            clearItem();
            notify ("success","Данные добавлены");
        }    
    } else {
        notify ("error","Заполните пустые поля");
    }
}



function addItem () {
    $$(tableId).filter(false);
    $$(tableId).hideOverlay("Ничего не найдено");
    $$(searchId).setValue("");
    createEditFields();
    $$(delBtnId).disable();
    $$(saveBtnId).hide();
    $$(addBtnId).hide();
    $$(saveNewBtnId).show();
}



function saveNewItem (){
   
    if($$( editFormId ).validate() ) {
        if($$(editFormId).isDirty()){
            let newValues = $$(editFormId).getValues();
            newValues.id= $$(tableId).count()+1;
            console.log(newValues)
            webix.ajax().post("/init/default/api/"+itemTreeId, newValues,{
                success:function( ){
                    $$(tableId).add(newValues);
                    clearItem();
                    defaultStateForm ();
                    $$("inputsTable").hide();
                    notify ("success","Данные успешно добавлены");
                },
                error:function(){
                    notify ("error","Ошибка при добавлении данных");
                }
            });
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
            let formValues = $$(editFormId).getValues();
            webix.ajax().del("/init/default/api/"+itemTreeId+"/"+formValues.id+".json", formValues,{
                success:function(){
                    $$( tableId ).remove(formValues.id);
                    clearItem();
                    if ($$(saveBtnId)) {
                        $$(saveBtnId).hide();
                        $$(addBtnId).show();
                    }
                    $$("inputsTable").hide();
                    notify ("success","Данные успешно удалены");
                },
                error:function(){
                    notify ("error","Ошибка при удалении записи");
                }
            });
            defaultStateForm ();
    });
    
    
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

    let columnsData = $$(tableId).getColumns();
    //if (columnsData.type)
    let idSelect;
    if(Object.keys($$(editFormId).elements).length==0  ){
        let inputsArray = [];
        columnsData.forEach((el,i) => {
            console.log(inputsArray)
            if (el.type == "datetime"){
                inputsArray.push({   
                    view: "datepicker",
                    format: webix.Date.strToDate("%d.%m.%Y"),
                    name:el.id, 
                    label:el.label, 
                    placeholder:"дд.мм.гг", 
                    timepicker: true,
                    labelPosition:"top"
                });
            } 
            
            
            
           else if (el.type.includes("reference")) {

                idSelect= i+1;
                let findTableId = el.type.slice(10);
                
                inputsArray.push(
                    
                    { view:"combo",placeholder:"Введите текст",  label:el.label, name:el.id, labelPosition:"top",  options:{
                        body:{
                          template: "#value#",
                          dataFeed:{
                            $proxy: true, 
                            load: function(view, params){
                              return ( webix.ajax().get("/init/default/api/"+findTableId).then(function (data) {
                                        data = data.json().content;
                                        let dataArray=[];
                                        let keyArray;
                                        data.forEach((el,i) =>{
                                            let l = 0;
                                            while (l <= Object.values(el).length) {
                                                if (typeof Object.values(el)[1] == "string"){
                                                    keyArray = Object.keys(el)[1];
                                                    break;
                                                } 
                                                l++;
                                            }
                                            dataArray.push({ "id":el.id, "value":el[keyArray]});
                                        });
                                        return dataArray;
                                    })
                                );
                            }
                          }	
                        }
                      }}

                );

                // console.log(inputsArray);
////
                // inputsArray.push({ 
                //     view:"select",
                //     name:el.id, 
                //     label:el.label, 
                //     options:[  
                //         { "id":1, "value":"Master" },
                //         { "id":2, "value":"Release" }],
                //     labelPosition:"top"
                // });
            
            } 
            else{
                inputsArray.push(
                    {
                    view:"text", 
                    name:el.id, 
                    label:el.label, 
                    labelPosition:"top"
                    }
                );
            }
            //console.log(el.type == "datetime");
            // inputsArray.push(
            //     {
            //     view:"text", 
            //     name:el.id, 
            //     label:el.label, 
            //     }
            // );
        });
        let inpObj = {margin:8,id:"inputsTable", rows:inputsArray};
        $$(cleanBtnId).enable(); 
        $$(delBtnId).enable();
        return ($$(editFormId).addView( inpObj, 1));
    } else {
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
        ok: 'Да',
        cancel: 'Отмена',
        title:titleText,
        text:"Вы уверены, что хотите продолжить?"
    });
}

function notify (typeNotify,textMessage) {
    webix.message.position = "bottom";
    webix.message({type:typeNotify,  text:textMessage});
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
                        hotkey: "esc",
                        value:"Очистить форму", click:clearForm},
                        
                    {   view:"button", 
                        id:delBtnId,
                        disabled:true,
                        height:48,
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
        { 
            view:"button", 
            id:addBtnId,
            value:"Добавить новую запись", 
            height:48,
            disabled:true,
            hotkey: "shift",
            css:"webix_primary", 
            click:addItem
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

        ]},
        
    ]},
    {}
    
    
    ],
    
    rules:{
        $all:webix.rules.isNotEmpty
    },

    on:{ onChange:function( newv,oldv) {
       
        
        if (newv != oldv){
            //console.log("new")
            // obj = getCurObj();
            // obj[item.id] = state.value;
            // obj = setCurObj(obj);
             
        } 
        
    }},
    ready:function(){
        this.validate();
        //console.log(window.innerWidth);
    },

};

    
export{
    editTableBar,
    notify,
    createEditFields,
    popupExec,
    defaultStateForm,
    checkFormSaved,
    clearItem
};
