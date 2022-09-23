import {getComboOptions} from './content.js';
import {headerContextId} from '../components/header.js';
import {tableNames} from "./router.js";
import {catchErrorTemplate,ajaxErrorTemplate,setLogValue} from "./logBlock.js";
import {modalBox, popupExec} from "./notifications.js";

let currId;

//let editTableBar;

function getCurrId (){
    let itemTreeId = $$("tree").getSelectedItem().id;
    if ( itemTreeId.length == 0){
        currId=headerContextId;
    } else {
        if (itemTreeId.includes("-single")){
            let singleIndex = itemTreeId.search("-single");
            itemTreeId = itemTreeId.slice(0,singleIndex)
        }
        
        currId=itemTreeId;
        
    }
}


//--- bns
function saveItem(addBtnClick=false){    
    try{    
        getCurrId ();
        let itemData = $$("table-editForm").getValues();   
        if($$("table-editForm").validate() ){
            if( itemData.id ) {
                webix.ajax().put("/init/default/api/"+currId+"/"+itemData.id, itemData, {
                    success:function(text, data, XmlHttpRequest){
                        data = data.json();
                        $$( "table" ).updateItem(itemData.id, itemData);
                        clearItem();
                        defaultStateForm ();
                        $$("table").clearSelection();
                        
                        if (!(addBtnClick)){
                            if ($$("inputsTable")){
                                $$("inputsTable").hide();
                            }
                            $$("table-newAddBtnId").enable();
                        if ($$("EditEmptyTempalte")&&!($$("EditEmptyTempalte").isVisible())){
                            $$("EditEmptyTempalte").show();
                        }
                            
                        } else {
                            $$("table").filter(false);
                            createEditFields("table-editForm");
                            $$("table-delBtnId").disable(); 
                            $$("table-saveBtn").hide();
                            $$("table-saveNewBtn").show();
                        }
 

                        if (data.err_type == "i"){
                            
                            if (window.innerWidth < 1200 && $$("tableEditPopup")){
                                $$("tableEditPopup").hide();
                            }

                            setLogValue("success","Данные сохранены");
                        } if (data.err_type == "e"){
                            setLogValue("error",data.error);
                        }
                    
                    },
                    error:function(text, data, XmlHttpRequest){
                        ajaxErrorTemplate("003-011",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                    }
                }).catch(error => {
                    console.log(error);
                    ajaxErrorTemplate("003-011",error.status,error.statusText,error.responseURL);
                });
            }    
    
        } else {
            setLogValue("error","Заполните пустые поля");
        }
    }catch (error){
        catchErrorTemplate("003-000", error);
    }

}

function addItem () {
    try {
 
        if($$("table-editForm").isDirty()){

            modalBox().then(function(result){
                if (result == 1){
                    $$("table").filter(false);
                    createEditFields("table-editForm");
                    $$("table-delBtnId").disable();
                    $$("table-saveBtn").hide();
                    $$("table-saveNewBtn").show();
                
                } else if (result == 2){
                    if ($$("table-editForm").validate()){
                        saveItem(true);
                        
                    } else {
                        setLogValue("error","Заполните пустые поля");
                        return false;
                    }
                    
                }
            });

        } else {
            if ($$("EditEmptyTempalte")&&$$("EditEmptyTempalte").isVisible()){
                $$("EditEmptyTempalte").hide();
            }
            $$("table").clearSelection();
            $$("table").filter(false);
            $$("table").hideOverlay("Ничего не найдено");
            createEditFields("table-editForm");
            $$("table-delBtnId").disable();
            $$("table-saveBtn").hide();
            $$("table-saveNewBtn").show();
            $$("table-newAddBtnId").disable();
        }
    }catch (error){
        catchErrorTemplate("003-000", error);
    }


}

function saveNewItem (){
    try{
        getCurrId ();
        
        if($$( "table-editForm" ).validate() ) {
            if($$("table-editForm").isDirty()){
                let newValues = $$("table-editForm").getValues();

                newValues.id=webix.uid();
                webix.ajax().post("/init/default/api/"+currId, newValues,{
                    success:function(text, data, XmlHttpRequest){
                        data = data.json();
                        $$("table").add(newValues);
                        clearItem();
                        defaultStateForm ();
                        if ($$("inputsTable")){
                            $$("inputsTable").hide();
                        }
                        $$("table-newAddBtnId").enable();
                        if ($$("EditEmptyTempalte")&&!($$("EditEmptyTempalte").isVisible())){
                            $$("EditEmptyTempalte").show();
                        }

                        

                        if (data.err_type == "i"){
                            if (window.innerWidth < 1200 && $$("tableEditPopup")){
                                $$("tableEditPopup").hide();
                            }
                            setLogValue("success","Данные успешно добавлены");
                        } else if (data.err_type == "e"){
                            setLogValue("error",data.error);
                        }
                        
                    },
                    error:function(text, data, XmlHttpRequest){
                        ajaxErrorTemplate("003-001",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                    }
                }).catch(error => {
                    console.log(error);
                    ajaxErrorTemplate("003-001",error.status,error.statusText,error.responseURL);
                });
            }else {
                webix.message({type:"debug",expire:1000, text:"Форма пуста"});
            }
        } else {
            setLogValue("error","Заполните пустые поля");
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
               
                $$( "table" ).remove($$("table-editForm").getValues().id);
                let formValues = $$("table-editForm").getValues();
        
                console.log("/init/default/api/"+currId+"/"+formValues.id+".json",formValues)
                webix.ajax().del("/init/default/api/"+currId+"/"+formValues.id+".json", formValues,{
                    success:function(text, data, XmlHttpRequest){
                        data = data.json();
                        clearItem();
                        defaultStateForm ();
                        $$("inputsTable").hide();

                        if (window.innerWidth < 1200 && $$("tableEditPopup")){
                            $$("tableEditPopup").hide();
                        }
                        
                        if (data.err_type == "i"){
                            if (window.innerWidth < 1200 && $$("tableEditPopup")){
                                $$("tableEditPopup").hide();
                            }
                            setLogValue("success","Данные успешно удалены");
                        } if (data.err_type == "e"){
                            setLogValue("error",data.error);
                        }
                       
                    },
                    error:function(text, data, XmlHttpRequest){
                        ajaxErrorTemplate("003-002",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                    }
                }).catch(error => {
                    console.log(error);
                    ajaxErrorTemplate("003-002",error.status,error.statusText,error.responseURL);
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
        let columnsData = $$("table").getColumns();

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
                            onChange:function(){
                               // console.log(this.getList())
                                $$(el.id).setValue(this.getValue()); 
                                $$(el.id).refresh()

                            },
                            onBindRequest:function(data){
                               // console.log(data)
                            }
                        },
                        ready:function(){
                            //console.log("rea")
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

                                if ($$("tableEditPopup") && $$("tableEditPopup").isVisible()){
                                    $$("tableEditPopup").hide();
                                }
                            } catch (e){
                                console.log(e);
                                setLogValue("error","Таблица не найдена");

                                if ($$("EditEmptyTempalte")&&$$("EditEmptyTempalte").isVisible()){
                                    $$("EditEmptyTempalte").hide();
                                }
                            }
                            
                        }
                    }
                    ]}

                );
                
            } else if (el.type.includes("boolean")) {

                inputsArray.push(
                    {cols:[
                    {   view:"combo",
                        placeholder:"Выберите вариант",  
                        label:el.label, 
                        id:el.id,
                        name:el.id, 
                        labelPosition:"top",
                        options:[
                            {id:1, value: "Да"},
                            {id:2, value: "Нет"}
                        ],
                        on:{
                            onItemClick:function(){
                                $$(parentElement).clearValidation();
                            },
                        }
                    },
                    
                    ]}

                );
                
            } else if (el.type.includes("integer")) {

                inputsArray.push(
                    {cols:[
                        {
                            view:"text", 
                            name:el.id,
                            id:el.id, 
                            label:el.label, 
                            labelPosition:"top",
                            invalidMessage:"Поле поддерживает только числовой формат",
                            on:{
                                onKeyPress:function(){
                                    $$(parentElement).clearValidation();
                                }
                            },
                            validate:function(val){
                                return !isNaN(val*1);
                            }
                        },
                    
                    ]}

                );
                
            } else {
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

            if(parentElement=="table-editForm"){
                $$("table-delBtnId").enable();
            }
            
            return ($$(parentElement).addView( inpObj, viewPosition));
            
        } else {
            $$(parentElement).clear();
            $$(parentElement).clearValidation();

            if(parentElement=="table-editForm"){
                $$("table-delBtnId").enable();
            }
            $$("inputsTable").show();
        }
    } catch (error){
        catchErrorTemplate("003-000", error);
    }
}

function clearItem(){
    $$("table-editForm").clear();
    $$("table-editForm").clearValidation();
    defaultStateForm ();
}

function defaultStateForm () {
    if ($$("table-saveNewBtn").isVisible()) {
        $$("table-saveNewBtn").hide();
    } else if ($$("table-saveBtn").isVisible()){
        $$("table-saveBtn").hide();
    }
    $$("table-delBtnId").disable();
}

//--- components




function editTableBar (){
    return {id:"editTableBarContainer",rows:[
        {id:"editTableBarAdaptive", rows:[
            {id:"editTableBarHeadline",hidden:true,cols:[
                {  template:"Редактор записей",height:30, 
                    css:"table-edit-headline",
                    borderless:true,
                },
                {
                    view:"button",
                    id:"buttonClosePopupTableEdit",
                    css:"webix_close-btn",
                    type:"icon",
                    hotkey: "esc",
                    width:25,
                    icon: 'wxi-close',
                    click:function(){
                        if($$("table-editForm")){
                            if($$("table-editForm").isDirty()){
                                modalBox().then(function(result){
                                    if (result == 1){
                                        $$("table-editForm").clear();
                                        if ($$("tableEditPopup")){
                                            $$("tableEditPopup").hide();
                                        }
                                    } else if (result == 2){
                                        if ($$("table-editForm").validate()){
                                            if ($$("table-editForm").getValues().id){
                                                saveItem();
                                            } else {
                                                saveNewItem(); 
                                            }
                                            $$("table-editForm").clear();
                                            $$("table-delBtnId").enable();
                                            if ($$("tableEditPopup")){
                                                $$("tableEditPopup").hide();
                                            }
                                        
                                        } else {
                                            setLogValue("error","Заполните пустые поля");
                                            return false;
                                        }
                                        
                                    }
                                });

                               
                            } else {

                                if ( $$("inputsTable")){
                                    $$("inputsTable").getParentView().removeView($$("inputsTable"))
                                }

                                $$("table").filter(false);
                            
                                $$("table-delBtnId").disable();
                                $$("table-saveBtn").hide();
                                $$("table-saveNewBtn").hide();

                                if ($$("tableEditPopup")){
                                    $$("tableEditPopup").hide();
                                }
                                
                            }
                        }
                    }
                }
            ]},
            {
                view:"form", 
                id:"table-editForm",
                css:"webix_form-edit",
                minHeight:350,
                minWidth:210,
                width: 320,
                scroll:true,
                borderless:true,
                elements:[
            
                    {//id:"form-adaptive",
                    minHeight:48,css:"webix_form-adaptive", margin:5, rows:[{margin:5, rows:[
                    
                        
                        {//responsive:"form-adaptive",  
                        margin:5, 
            
                            cols: [
                                {   view:"button",
                                    id:"table-newAddBtnId",
                                    height:48,
                                    minWidth:90, 
                                    hotkey: "shift",
                                    value:"Новая запись", click:addItem},
                                    
                                {   view:"button",
                                    id:"table-delBtnId",
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
                        id:"table-saveBtn",
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
                        id:"table-saveNewBtn",
                        value:"Сохранить новую запись",
                        hidden:true,  
                        height:48,
                        hotkey: "enter" ,
                        css:"webix_primary", 
                        click:saveNewItem,
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
            
            }
        ]}
    ]}
}

try{


} catch (error){
    alert("Ошибка при выполнении"+" "+ error);
    console.log(error);

    // let script = document.createElement("script");
    // script.setAttribute("src", "/js/codebase/webix.js");
    // script.setAttribute("type", "text/javascript");
    // script.setAttribute("async", true);
    // document.body.appendChild(script);

    // script.addEventListener("load", () => {
    //     console.log("Файл загружен")
    // });
    
    // script.addEventListener("error", (ev) => {
    //     console.log("Загрузка не удалась", ev);
    // });


    // const loadScript = (FILE_URL, async = true, type = "text/javascript") => {
    //     return new Promise((resolve, reject) => {
    //         try {
    //             const scriptEle = document.createElement("script");
    //             scriptEle.type = type;
    //             scriptEle.async = async;
    //             scriptEle.src =FILE_URL;
    
    //             scriptEle.addEventListener("load", (ev) => {
    //                 resolve({ status: true });
    //             });
    
    //             scriptEle.addEventListener("error", (ev) => {
    //                 reject({
    //                     status: false,
    //                     message: `Failed to load the script ${FILE_URL}`
    //                 });
    //             });
    
    //             document.body.appendChild(scriptEle);
    //         } catch (error) {
    //             reject(error);
    //         }
    //     });
    // };
    
    // loadScript("/js/codebase/webix.js")
    //     .then( data  => {
    //         console.log("Script loaded successfully", data);
    //     })
    //     .catch( err => {
    //         console.error(err);
    //     });
    window.stop();
   
}

    
export{
    editTableBar,
    createEditFields,
    defaultStateForm,
    clearItem,
    saveItem,
    saveNewItem
};
