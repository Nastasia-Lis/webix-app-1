import {tableId,editFormId, saveBtnId,saveNewBtnId, delBtnId, findElementsId,editTableBtnId} from '../modules/setId.js';
import {defaultStateForm,createEditFields,popupExec,notify,saveItem} from "../modules/editTableForm.js";
import {itemTreeId, getComboOptions, urlFieldAction} from "../modules/sidebar.js";


// let escapedSearchText = "";

//     function findText(text, table) {

//         text = text || "";
//         escapedSearchText = text.replace(/[[\]{}()*+?.\\^$|]/g, "\\$&");
        
//         if (text) {
//           text = text.toLowerCase();
//           table.filter(data => {
//             return data[Object.keys(data)[1]].toLowerCase().indexOf(text) > -1;
//           });
//         } else {
//           table.filter();
//         }
//       };

//       function addTextMark(value, text) {

//         const checkOccurence = new RegExp("(" + text + ")", "ig");
 
//         return value.replace(
//           checkOccurence,
//           "<span class='search_mark'>$1</span>"
//         );
//       }

//       function searchColumnTemplate(value) {
//         let search = escapedSearchText;
//         webix.message(value);
//         if (search) {
//           value = addTextMark(value, search);
//         }
//         return value;
//       }  

function tableToolbar (idSearch, idExport,idBtnEdit, idFindElements, idFilterElements, idTable,idFilter,visible=false) {
   
    function exportToExcel(){
        webix.toExcel(idTable, {
          filename:"Table",
          filterHTML:true,
          styles:true
        });
        notify ("success","Таблица сохранена",true);
    }




    function createFilterElements (parentElement, viewPosition=1) {

        let columnsData = $$(tableId).getColumns();
    
        if(Object.keys($$(parentElement).elements).length==0  ){
            let inputsArray = [];
            columnsData.forEach((el,i) => {
                if (el.type == "datetime"){
                    inputsArray.push( 
                    {cols:[
                        { 
                        view: "datepicker",
                        format:"%d.%m.%Y %H:%i:%s",
                        id:el.id+"_filter",
                        name:el.id, 
                        hidden:true,
                        label:el.label, 
                        placeholder:"дд.мм.гг", 
                        timepicker: true,
                        labelPosition:"top",
                        on:{
                            onItemClick:function(){
                                $$(parentElement).clearValidation();
                                $$("btnFilterSubmit").enable();
                            }
                        }
                        },
                        {

                            
                              
          



                            // view:"button",
                            // id:el.id+"_filter"+"_condition", 
                            // hidden:true,
                            // css:{"vertical-align":"bottom!important","height":"38px!important"},
                            // type:"icon",
                            // icon: 'wxi-dots',
                            // inputHeight:38,
                            // width: 40,
                            // popup: {
                            //     view: 'contextmenu',
                            //     //id:"contextmenu",
                            //     css:"webix_contextmenu",
                            //     data: [
                            //         { value: 'Profile', href: '#profile' },
                            //     ],
                            //     on:{
                            //         onItemClick:function(id, e, node){
            
             
                            //         }
                            //     }
                            // },
                            // on: {
                            //     onAfterRender: function () {
                            //         this.getInputNode().setAttribute("title","Выбрать условие");
                            //     },
                            // },
                            // click:function(){
                              
                          // }
                        }
                    ]} 
                    );
        
                } 
                
    
               else if (el.type.includes("reference")) {
                let findTableId = el.type.slice(10);
    
                inputsArray.push(
                    {cols:[
                    {   view:"combo",
                        placeholder:"Выберите вариант",  
                        label:el.label, 
                        id:el.id+"_filter",
                        hidden:true,
                        name:el.id, 
                        labelPosition:"top",
                        options:{
                            data:getComboOptions(findTableId)
                        },
                        on:{
                            onItemClick:function(){
                                $$(parentElement).clearValidation();
                                $$("btnFilterSubmit").enable();
                            },
                        }
                    },

                    {
                        view:"button",
                        id:el.id+"_filter"+"_condition", 
                        hidden:true,
                        css:{"vertical-align":"bottom!important","height":"38px!important"},
                        type:"icon",
                        icon: 'wxi-dots',
                        inputHeight:38,
                        width: 40,
                        on: {
                            onAfterRender: function () {
                                this.getInputNode().setAttribute("title","Выбрать условие");
                            },
                        },
                        click:function(){
                          
                        }
                    }

                    ]}
    
                );
                
                } 
                else{
                    inputsArray.push(
                        {id:el.id+"_rows",rows:[

                            {id:el.id+"_container",cols:[
                                {
                                view:"text", 
                                name:el.id+"_filter",
                                id:el.id+"_filter", 
                                hidden:true,
                                label:el.label, 
                                labelPosition:"top",
                                on:{
                                    onKeyPress:function(){
                                        $$(parentElement).clearValidation();
                                        $$("btnFilterSubmit").enable();
                                    },
                                }
                                },

                                {
                                    view:"button",
                                    id:el.id+"btnFilterOperations",
                                    css:"webix_primary webix_filterBtns",
                                    value:"=",
                                    inputHeight:38,
                                    width: 40,
                                    popup: {
                                        view: 'contextmenu',
                                        width: 200,
                                        data: [
                                            { value: '=', id:"operations_eql" },
                                            { value: '!=', id:"operations_notEqual" },
                                            { value: '>', id:"operations_less" },
                                            { value: '<', id:"operations_more" },
                                            { value: '>=', id:"operations_mrEqual" },
                                            { value: '<=', id:"operations_lsEqual" },
                                            { value: 'содержит', id:"operations_contains" },
                                        ],
                                        on: {
                                        onMenuItemClick(id) {
                                            if (id.includes("eql")){
                                                $$(el.id+"btnFilterOperations").setValue("=");
                                                
                                            } else if (id.includes("notEqual")){
                                                $$(el.id+"btnFilterOperations").setValue("!=");
                                            } else if (id.includes("less")){
                                                $$(el.id+"btnFilterOperations").setValue("<");
                                            } else if (id.includes("more")){
                                                $$(el.id+"btnFilterOperations").setValue(">");
                                            } else if (id.includes("mrEqual")){
                                                $$(el.id+"btnFilterOperations").setValue(">=");
                                            } else if (id.includes("lsEqual")){
                                                $$(el.id+"btnFilterOperations").setValue("<=");
                                            } else if (id.includes("contains")){
                                                $$(el.id+"btnFilterOperations").setValue("⊆");
                                            }
        
                                        },
                                        
                                        }
                                    },
                                    on:{
                                        onAfterRender: function () {
                                            this.getInputNode().setAttribute("title","Выбрать условие поиска по полю");
                                        },
                                    }
                                
                                },

                            
                                {
                                    
                                    view:"button", 
                                    css: "webix_filterBtns",
                                    value:"+",
                                    hidden:true,
                                    id:el.id+"_filter"+"_condition",
                                    inputHeight:38,
                                    width: 40,
                                    popup: {
                                    view: 'contextmenu',
                                    width: 200,
                                    data: [
                                        { value: 'и', id:"add_and" },
                                        { value: 'или', id:"add_or" },
                                    ],
                                    on: {
                                        onMenuItemClick(id) {
                                        
                                            if(id.includes("and")){
                                                console.log("eee");
                                                $$(el.id+"_rows").addView(
                                                    {rows:[
                                                        {template:"+ и", height:30, borderless:true},
                                                        {cols:[
                                                    
                                                        {
                                                            view:"text", 
                                                            //name:el.id+"_filter",
                                                            //id:el.id+"_filter", 
                                                            //hidden:true,
                                                            on:{
                                                                onKeyPress:function(){
                                                                    $$(parentElement).clearValidation();
                                                                    $$("btnFilterSubmit").enable();
                                                                },
                                                            }
                                                        },
                                                        {
                                                            view:"button",
                                                            //css:{"vertical-align":"bottom!important","height":"38px!important"},
                                                            css:"webix_filterBtns webix_danger",
                                                            type:"icon",
                                                            icon: 'wxi-trash',
                                                            inputHeight:38,
                                                            width: 40,
                                                            on: {
                                                                onAfterRender: function () {
                                                                    this.getInputNode().setAttribute("title","");
                                                                },
                                                            },
                                                        
                                                        }
                                                        ]}
                                                    ]},2
                                                );

                                            } else if(id.includes("or")){

                                            }
                                        },
                                        
                                    }
                                    },
                                    on:{
                                        onAfterRender: function () {
                                            this.getInputNode().setAttribute("title","Добавить ещё вариант поля");
                                        },
                                    }
                                }
                            ]}
                        ]},
                    );
                }
            });
           

            inputsArray.forEach(function(el,i){
                if(el.view == "radio"){
                    inputsArray.pop();
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
    }

      
       

    return { 

       
         id:"adaptive-toolbar",rows:[
             
        
            
             {id:"filterBar",responsive:"adaptive-toolbar", css:"webix_filterBar",padding:17, height: 80,margin:5, 
                
                cols: [
                
                {   view:"search",
                    placeholder:"Поиск",
                    id:idSearch,
                    hidden:visible,
                    css:"searchTable",
                    maxWidth:250,
                    minWidth:40,
                    on: {
                        onTimedKeyPress() {
                            // const value = this.getValue();
                            // findText(value, $$(idTable));
                      
                            let text = this.getValue().toLowerCase();
                            let table = $$(idTable);
                            let columns = table.config.columns;
                            let findElements = 0;
                            table.filter(function(obj){
                                for (let i=0; i<columns.length; i++){
                                    if (obj[columns[i].id].toString().toLowerCase().indexOf(text) !== -1){
                                        findElements++;
                                        return true;
                                    }
                                return false;
                            }});
                            if (!findElements){
                                $$(idTable).showOverlay("Ничего не найдено");
                            } else if(findElements){
                                $$(idTable).hideOverlay("Ничего не найдено");
                            }
                            $$(idFilterElements).setValues(findElements.toString());
                            

                        },
                        onAfterRender: function () {
                           this.getInputNode().setAttribute("title","Поиск по таблице");
                        },
                        
                    }
                },
                {},
                {   view:"button",
                    width: 50, 
                    type:"icon",
                    id:idBtnEdit,
                    hidden:true,
                    icon:"wxi-pencil",
                    css:"webix_btn-edit",
                    title:"текст",
                    height:50,
                    click:function(){
                        let btnClass = document.querySelector(".webix_btn-filter");
                        $$("filterTableForm").hide();
                        $$(editFormId).show();
                        btnClass.classList.add("webix_secondary");
                        btnClass.classList.remove("webix_primary");
                        $$(idBtnEdit).hide();
                        this.hide();
                    },
                    on: {
                        onAfterRender: function () {
                            if(idTable !== "table" && this.isVisible()){
                                this.hide();
                            }
                            this.getInputNode().setAttribute("title","Редактировать таблицу");
                        }
                    } 
                },


                {   view:"button",
                    width: 50, 
                    type:"icon",
                    id:idFilter,
                    hidden:visible,
                    icon:"wxi-filter",
                    css:"webix_btn-filter",
                    title:"текст",
                    height:50,
                    click:function(){
                        $$(idTable).clearSelection();
                        let btnClass = document.querySelector(".webix_btn-filter");

                        if(!(btnClass.classList.contains("webix_primary"))){
                            $$("filterTableForm").show();
                            $$(editFormId).hide();
                          
                            if($$("filterTableForm").getChildViews() !== 0){
                                createFilterElements("filterTableForm",3);

                            }
                            btnClass.classList.add("webix_primary");
                            btnClass.classList.remove("webix_secondary");
                            $$(idBtnEdit).show();
                           
                        } else {
                        
                            $$("filterTableForm").hide();
                            $$(editFormId).show();
                            btnClass.classList.add("webix_secondary");
                            btnClass.classList.remove("webix_primary");
                            $$(idBtnEdit).hide();
                        }
                      
                    },
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title","Показать/скрыть фильтры");
                        }
                    } 
                },

                {   view:"button",
                    width: 50, 
                    type:"icon",
                    id:idExport,
                    hidden:visible,
                    icon:"wxi-download",
                    css:"webix_btn-download",
                    title:"текст",
                    height:50,
                    click:exportToExcel,
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title","Экспорт таблицы");
                        }
                    } 
                },


                ],
            },
            {cols:[
                {   view:"template",
                    id:idFindElements,
                    css:"webix_style-template-count",
                    height:30,
                    template:function () {
                        if (Object.keys($$(idFindElements).getValues()).length !==0){
                            return "<div style='color:#999898;'> Общее количество записей:"+" "+$$(idFindElements).getValues()+" </div>";
                        } else {
                            return "";
                        }
                    }
                 
                },

                {   view:"template",
                    id:idFilterElements,
                    css:"webix_style-template-count",
                    height:30,
                    template:function () {
                        if (Object.keys($$(idFilterElements).getValues()).length !==0){
                            
                            return "<div style='color:#999898;'>Видимое количество записей:"+" "+$$(idFilterElements).getValues()+" </div>";
                        } else {
                            return "";
                        }
                    }
                },

            ]},
        ]

        
    };
}



function table (idTable, onFunc, editableParam=false) {
    return {
        view:"datatable",
        id: idTable,
        css:"webix_table-style webix_header_border webix_data_border",
        resizeColumn: true,
        autoConfig: true,
        editable:editableParam,
        editaction:"dblclick",
        //pager:idPager,
        minHeight:350,
        //height:200,

        datafetch:5,
        datathrottle: 5000,
        loadahead:100,

        footer: true,
        minWidth:500, 
        select:true,
        minColumnWidth:200,
        on:onFunc,
        onClick:{
            "wxi-trash":function(){
                popupExec("Запись будет удалена").then(
                    function(){
                        let formValues = $$(idTable).getItem(id);
                        webix.ajax().del("/init/default/api/"+itemTreeId+"/"+formValues.id+".json", formValues,{
                            success:function(){
                                $$(idTable).remove($$(idTable).getSelectedId());
                                notify ("success","Данные успешно удалены",true);
                            },
                            error:function(){
                                notify ("error","Ошибка при удалении записи",true);
                            }
                        });
                });
            },

            "wxi-angle-down":function(event, cell, target){

            if (!($$("propTableView").isVisible()))   {
                let id = cell.row;
              
                let urlArgEnd = urlFieldAction.search("{");
                let findUrl = urlFieldAction.slice(0,urlArgEnd); 


                webix.ajax(findUrl+id+".json",{
                    success:function(text, data, XmlHttpRequest){
                        data = data.json().content;
                        let arrayProperty = [];
                        data.forEach(function(el,i){
                            arrayProperty.push({type:"text", id:i+1,label:el.name, value:el.value})
                        });
                        $$("propTableView").define("elements", arrayProperty);
                        $$("propTableView").show();
                        $$("propResize").show();
                    },
                    error:function(text, data, XmlHttpRequest){
                        notify ("error","Ошибка при загрузке");

                    }
                });
            } else {
                $$("propTableView").hide();
                $$("propResize").hide();
            }

            },
            
        }
    };
}





//----- table edit parameters
let onFuncTable = {
    onBeforeLoad:function(){
        this.showOverlay("Загрузка...");
    },
    onAfterEditStop:function(state, editor, ignoreUpdate){
      
        if(state.value != state.old){
            $$(editor.column).setValue(state.value);
            saveItem();
        }
    },

    onAfterSelect(id){
        
        if ($$(editTableBtnId).isVisible()){
            $$(editTableBtnId).hide();
        }

        if(!($$(editFormId).isVisible())){
            $$(editFormId).show();
            $$("filterTableForm").hide();
            let btnClass = document.querySelector(".webix_btn-filter");
            btnClass.classList.add("webix_secondary");
            btnClass.classList.remove("webix_primary");
            
        }
        
       
        let values = $$(tableId).getItem(id); 
        function toEditForm () {
            $$(editFormId).setValues(values);
            $$(saveNewBtnId).hide();
            $$(saveBtnId).show();
            $$(editFormId).clearValidation();
        }
        if($$(editFormId).isDirty()){
            popupExec("Данные не сохранены").then(
                function(){
                    $$(editFormId).clear();
                    $$(delBtnId).enable();
                    toEditForm();
            }); 
        } else {
            createEditFields(editFormId);
            toEditForm();
        }   
    },
    onAfterLoad:function(){
        this.hideOverlay();
        $$(editFormId).removeView("inputsTable");
        defaultStateForm ();
    },  
    onAfterDelete: function() {
        $$(findElementsId).setValues($$(tableId).count().toString());
        if (!this.count())
            this.showOverlay("Ничего не найдено");
        if (this.count())
            this.hideOverlay();
    },
    onAfterAdd: function() {
        $$(findElementsId).setValues($$(tableId).count().toString());
        this.hideOverlay();
    },

    
 
};
//----- table edit parameters


export {
    tableToolbar,
    table,
    onFuncTable,
    //onFuncTableView
};