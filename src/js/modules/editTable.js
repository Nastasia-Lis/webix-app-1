import {tableId, editFormId, saveBtnId, addBtnId, delBtnId, cleanBtnId, saveNewBtnId} from './setId.js';
//import {createFields} from '../app.js';
import {tablesArray} from './data/data.js';



// function createFields () {

//     let headersArray= $$(tableId).getColumns();
//     let inputsArray = [];
//     // for each array, create array inputs, set array
//     headersArray.forEach((el) => {
//         inputsArray.push(
//             {
//             view:"text", 
//             name:el.id, 
//             label:el.id, 
//             }
//         );
//     });

//     return(console.log(inputsArray));

// }




function saveItem(){        
    let form = $$( editFormId );  
    let list = $$( tableId );  
    let itemData = $$(editFormId).getValues();    
    
    if( form.isDirty() && form.validate() ){
        if( itemData.id ) {
            list.updateItem(itemData.id, itemData);
            clearItem();
            notify ("success","Данные сохранены");}
        else {
            list.add( itemData );
            clearItem();
            notify ("success","Данные добавлены");
        }    
    }
    defaultStateForm ();
}

function addItem () {
    let headersArray= $$(tableId).getColumns();
    let inputsArray = [];
    headersArray.forEach((el) => {
        inputsArray.push(
            {
            view:"text", 
            name:el.id, 
            label:el.id, 
            }
        );
    });

    let inpObj = {margin:8,id:"inputsTable", rows:inputsArray};

    ($$(editFormId).addView( inpObj, 1));
    $$(saveBtnId).hide();
    $$(addBtnId).hide();
    $$(saveNewBtnId).show();
}


function saveNewItem (){
    $$(tableId).add($$(editFormId).getValues());
    clearItem();
    notify ("success","Данные добавлены");
    defaultStateForm ();
    $$(editFormId).removeView("inputsTable");
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
            notify ("success","Данные удалены");
    });

    defaultStateForm (saveBtnId);
    
}

function clearForm(){
    popupExec("Форма будет очищена").then(
        function(){
            clearItem();
            if ($$(saveBtnId)) {
                $$(saveBtnId).hide();
                $$(addBtnId).show();
            }
            notify ("success","Форма очищена");
            defaultStateForm ();
    }); 
}

function clearItem(){
    $$(editFormId).clear();
    $$(editFormId).clearValidation();
    defaultStateForm ();
}


function defaultStateForm () {
    
    if (saveNewBtnId) {
        $$(saveNewBtnId).hide();
    } else if (saveBtnId){
        $$(saveBtnId).hide();
    }

    //$$(editFormId).removeView("inputsTable");
    $$(addBtnId).show();
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
    view:"form", id:editFormId, minHeight:350,minWidth:350,width:350,
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
                        click:removeItem
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


    // rules:{
    //     title: webix.rules.isNotEmpty
    // }

};

    
export{
    editTableBar,
    notify
};
