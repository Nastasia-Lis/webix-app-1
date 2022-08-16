import {tableId, editFormId, saveBtnId,searchId, addBtnId, delBtnId, cleanBtnId, saveNewBtnId,newAddBtnId} from './setId.js';
import {itemTreeId} from './sidebar.js';
import {setLogValue} from './logBlock.js';


//--- bns
function saveItem(){        

    let itemData = $$(editFormId).getValues();   
    if($$(editFormId).validate() ){
        if( itemData.id ) {
            webix.ajax().put("/init/default/api/"+itemTreeId+"/"+itemData.id, itemData, {
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
        // else {
        //     $$( tableId ).add( itemData );
        //     $$(newAddBtnId).enable();
        //     clearItem();
        //     notify ("success","Данные добавлены",true);
        // }    
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
    popupExec("Запись будет удалена").then(
        function(){
            $$( tableId ).remove($$(editFormId).getValues().id);
            let formValues = $$(editFormId).getValues();
            webix.ajax().del("/init/default/api/"+itemTreeId+"/"+formValues.id+".json", formValues,{
                success:function(){
                    console.log(formValues.id)
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



// function clearForm(){
    

//     if ($$(saveBtnId).isVisible()){
//         $$(editFormId).setDirty(true);
//     } 
    
//     if($$(editFormId).isDirty()){
//         popupExec("Данные не сохранены").then(
//             function(){
//                 clearItem();
//                 $$(tableId).clearSelection();
//                 defaultStateForm ();
//                 $$("inputsTable").hide();
//                 //notify ("success","Форма очищена");
//         });
//     } else {
//         notify ("debug","Форма пуста");
//     }
// }

//--- bns




//--- components

function createEditFields () {

    let columnsData = $$(tableId).getColumns();
    //console.log(columnsData)

    //let idSelect;
    if(Object.keys($$(editFormId).elements).length==0  ){
        let inputsArray = [];
        columnsData.forEach((el,i) => {
            //console.log(inputsArray)
            if (el.type == "datetime"){
                inputsArray.push({   
                    view: "datepicker",
                    format: webix.Date.strToDate("%d.%m.%Y"),
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
            let optionData = new webix.DataCollection({url:{
                $proxy:true,
                load: function(){
                    return ( webix.ajax().get("/init/default/api/"+findTableId).then(function (data) {
                                data = data.json().content;
                                let dataArray=[];
                                let keyArray;
                                data.forEach((el,i) =>{
                                    
                                    let l = 0;
                                    while (l <= Object.values(el).length) {
                                        
                                        if (typeof Object.values(el)[l] == "string"){
                                            keyArray = Object.keys(el)[l];
                                            break;
                                        } 
                                        l++;
                                    }

                                    if (el[keyArray] == undefined){

                                        while (l <= Object.values(el).length) {
                                            if (typeof Object.values(el)[1] == "number"){
                                                keyArray = Object.keys(el)[1];
                                                break;
                                            }
                                            l++;
                                        }
                                    }
                                    dataArray.push({ "id":el.id, "value":el[keyArray]});
                                });
                                return dataArray;
                            })
                    );
                    
                }
            }});
                //idSelect= i+1;
               
                inputsArray.push(
                    {   view:"combo",
                        placeholder:"Введите текст",  
                        label:el.label, 
                        name:el.id, 
                        labelPosition:"top",  
                        options:{
                           data:optionData
                        },
                        on:{
                            onItemClick:function(){
                                $$(editFormId).clearValidation();
                            }
                        }
                    }

                );
            
            } 
            else{
                inputsArray.push(
                    {
                    view:"text", 
                    name:el.id, 
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
        //$$(cleanBtnId).enable(); 
        $$(delBtnId).enable();
        return ($$(editFormId).addView( inpObj, 1));
        
    } else {
        console.log($$(editFormId).isDirty());

        $$(editFormId).clear();
        $$(editFormId).clearValidation();
        

        //$$(cleanBtnId).enable(); 
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
    //$$(addBtnId).show();
    $$(delBtnId).disable();
    //$$(cleanBtnId).disable();
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

function notify (typeNotify,textMessage, log = false) {
    webix.message.position = "bottom";
    webix.message({type:typeNotify,  text:textMessage});
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
    clearItem
};
