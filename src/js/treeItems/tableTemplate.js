import {tableId,editFormId, saveBtnId,saveNewBtnId, delBtnId, findElementsId,editTableBtnId} from '../modules/setId.js';
import {defaultStateForm,createEditFields,popupExec,notify,saveItem} from "../modules/editTableForm.js";
import {itemTreeId, getComboOptions, urlFieldAction} from "../modules/sidebar.js";  

function tableToolbar (idSearch, idExport,idBtnEdit, idFindElements, idFilterElements, idTable,idFilter,visible=false) {
    

    function exportToExcel(){
        webix.toExcel(idTable, {
          filename:"Table",
          filterHTML:true,
          styles:true
        });
        notify ("success","Таблица сохранена",true);
    }



    function filterFieldsFunctions (el,parentElement, typeField){
        let findTableId = el.type.slice(10);
        let countChild;
        if ($$(el.id+"_filter"+"_rows")){
            countChild = $$(el.id+"_filter"+"_rows").getChildViews().length;
        }
        
        
        function field (operation){

            if (typeField=="text"){
                return  {
                    view:"text", 
                    placeholder:"Введите текст",  
                    name:el.id+"_filter-child-"+operation+"-"+countChild,
                    id:el.id+"_filter-child-"+operation+"-"+countChild, 
                    on:{
                        onKeyPress:function(){
                            $$(parentElement).clearValidation();
                            $$("btnFilterSubmit").enable();
                        },
                    }
                };

            } else if (typeField=="combo"){
                return {   
                    view:"combo",
                    name:el.id+"_filter-child-"+operation+"-"+countChild,
                    id:el.id+"_filter-child-"+operation+"-"+countChild, 
                    placeholder:"Выберите вариант",  
                    options:{
                        data:getComboOptions(findTableId)
                    },
                    on:{
                        onItemClick:function(){
                            $$(parentElement).clearValidation();
                            $$("btnFilterSubmit").enable();
                        },
                    }
                };

            } else if (typeField=="datepicker"){
                return { 
                    view: "datepicker",
                    name:el.id+"_filter-child-"+operation+"-"+countChild,
                    id:el.id+"_filter-child-"+operation+"-"+countChild, 
                    format:"%d.%m.%Y %H:%i:%s",
                    placeholder:"дд.мм.гг", 
                    timepicker: true,
                    on:{
                        onItemClick:function(){
                            $$(parentElement).clearValidation();
                            $$("btnFilterSubmit").enable();
                        }
                    }
                };
            }
       
        }
        return {id:el.id+"_filter_container-btns",css:{"margin-top":"27px!important"},hidden:true, cols:[

            {
                view:"button",
                id:el.id+"_filter-btnFilterOperations",
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
                        { value: '<', id:"operations_less" },
                        { value: '>', id:"operations_more" },
                        { value: '>=', id:"operations_mrEqual" },
                        { value: '<=', id:"operations_lsEqual" },
                        { value: 'содержит', id:"operations_contains" },
                    ],
                    on: {
                    onMenuItemClick(id) {
                        let btnFilterOperations = $$(el.id+"_filter-btnFilterOperations");
                        if (id.includes("eql")){
                            btnFilterOperations.setValue("=");
                        } else if (id.includes("notEqual")){
                            btnFilterOperations.setValue("!=");
                        } else if (id.includes("less")){
                            btnFilterOperations.setValue("<");
                        } else if (id.includes("more")){
                            btnFilterOperations.setValue(">");
                        } else if (id.includes("mrEqual")){
                            btnFilterOperations.setValue(">=");
                        } else if (id.includes("lsEqual")){
                            btnFilterOperations.setValue("<=");
                        } else if (id.includes("contains")){
                            btnFilterOperations.setValue("⊆");
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

                            $$(el.id+"_filter"+"_rows").addView(
                                {id:el.id+"_filter-container"+"-child-"+countChild,rows:[
                                    {template:"+ и", height:30, borderless:true},
                                    {cols:[
                                
                                        field ("operAnd"),
                                        {
                                            view:"button",
                                            id:el.id+"_filter-child-operAnd-"+countChild+"-btnFilterOperations",
                                            css:"webix_primary webix_filterBtns",
                                            value:"=",
                                            inputHeight:38,
                                            width: 40,
                                            popup: {
                                                view: 'contextmenu',
                                                width: 200,
                                                data: [
                                                    { value: '=', id:"operations_eql"+"-"+countChild },
                                                    { value: '!=', id:"operations_notEqual"+"-"+countChild },
                                                    { value: '<', id:"operations_less"+"-"+countChild },
                                                    { value: '>', id:"operations_more"+"-"+countChild },
                                                    { value: '>=', id:"operations_mrEqual"+"-"+countChild },
                                                    { value: '<=', id:"operations_lsEqual"+"-"+countChild },
                                                    { value: 'содержит', id:"operations_contains"+"-"+countChild },
                                                ],
                                                on: {
                                                onMenuItemClick(id) {
                                                    let idBtnOperations =  $$(el.id+"_filter-child-operAnd-"+countChild+"-btnFilterOperations");
                                                    if (id.includes("eql")){
                                                        idBtnOperations.setValue("=");
                                                    } else if (id.includes("notEqual")){
                                                        idBtnOperations.setValue("!=");
                                                    } else if (id.includes("less")){
                                                        idBtnOperations.setValue("<");
                                                    } else if (id.includes("more")){
                                                        idBtnOperations.setValue(">");
                                                    } else if (id.includes("mrEqual")){
                                                        idBtnOperations.setValue(">=");
                                                    } else if (id.includes("lsEqual")){
                                                        idBtnOperations.setValue("<=");
                                                    } else if (id.includes("contains")){
                                                        idBtnOperations.setValue("⊆");
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
                                            css:"webix_filterBtns webix_danger",
                                            id:el.id+"_filter"+"-"+countChild+"_remove",
                                            type:"icon",
                                            icon: 'wxi-trash',
                                            inputHeight:38,
                                            width: 40,
                                            click:function(){
                                                try{ 

                                                    popupExec("Поле фильтра будет удалено").then(
                                                        function(){
                                                            $$(el.id+"_filter"+"_rows").removeView($$(el.id+"_filter-container-child-"+countChild));
                                                            notify ("success","Поле удалено");
                                                    });
                                                    
                                              
                                                }catch(e){
                                                    notify ("error","Ошибка удаления поля",true);
                                                }

                                            },
                                            on: {
                                                onAfterRender: function () {
                                                    this.getInputNode().setAttribute("title","Удалить поле фильтра");
                                                },
                                            },
                                        
                                        }
                                    ]}
                                ]},countChild
                            );

                        } else if(id.includes("or")){

                            $$(el.id+"_filter"+"_rows").addView(
                                {id:el.id+"_filter-container-child-operOr-"+countChild,rows:[
                                    {template:"+ или", height:30, borderless:true},
                                    {cols:[
                                        field ("operOr"),
                                        {
                                            view:"button",
                                            id:el.id+"_filter-child-operOr-"+countChild+"-btnFilterOperations",
                                            css:"webix_primary webix_filterBtns",
                                            value:"=",
                                            inputHeight:38,
                                            width: 40,
                                            popup: {
                                                view: 'contextmenu',
                                                width: 200,
                                                data: [
                                                    { value: '=', id:"operations_eql"+"-operOr-"+countChild },
                                                    { value: '!=', id:"operations_notEqual"+"-operOr-"+countChild },
                                                    { value: '<', id:"operations_less"+"-operOr-"+countChild },
                                                    { value: '>', id:"operations_more"+"-operOr-"+countChild },
                                                    { value: '>=', id:"operations_mrEqual"+"-operOr-"+countChild },
                                                    { value: '<=', id:"operations_lsEqual"+"-operOr-"+countChild },
                                                    { value: 'содержит', id:"operations_contains"+"-operOr-"+countChild },
                                                ],
                                                on: {
                                                onMenuItemClick(id) {
                                                    let btnFilterOperations = $$(el.id+"_filter-child-operOr-"+countChild+"-btnFilterOperations" );
                                                    if (id.includes("eql")){
                                                        btnFilterOperations.setValue("=");
                                                    } else if (id.includes("notEqual")){
                                                        btnFilterOperations.setValue("!=");
                                                    } else if (id.includes("less")){
                                                        btnFilterOperations.setValue("<");
                                                    } else if (id.includes("more")){
                                                        btnFilterOperations.setValue(">");
                                                    } else if (id.includes("mrEqual")){
                                                        btnFilterOperations.setValue(">=");
                                                    } else if (id.includes("lsEqual")){
                                                        btnFilterOperations.setValue("<=");
                                                    } else if (id.includes("contains")){
                                                        btnFilterOperations.setValue("⊆");
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
                                            css:"webix_filterBtns webix_danger",
                                            id:el.id+"_filter"+"-operOr-"+countChild+"_remove",
                                            type:"icon",
                                            icon: 'wxi-trash',
                                            inputHeight:38,
                                            width: 40,
                                            click:function(){
                                                try{
                                                    popupExec("Поле фильтра будет удалено").then(
                                                        function(){
                                                            $$(el.id+"_filter"+"_rows").removeView($$(el.id+"_filter-container-child-operOr-"+countChild));
                                                            notify ("success","Поле удалено"); 
                                                    });
                                                    
                                                }catch(e){
                                                    notify ("error","Ошибка удаления поля",true);
                                                }

                                            },
                                            on: {
                                                onAfterRender: function () {
                                                    this.getInputNode().setAttribute("title","Удалить поле фильтра");
                                                },
                                            },
                                        
                                        }
                                    ]}
                                ]},countChild
                            );
                        }
                    },
                    
                }
                },
                on:{
                    onAfterRender: function () {
                        this.getInputNode().setAttribute("title","Добавить ещё вариант поля");
                    },
                }
            },

        ]};       
    }



    function createFilterElements (parentElement, viewPosition=1) {

        let columnsData = $$(tableId).getColumns();
    
        if(Object.keys($$(parentElement).elements).length==0  ){
            let inputsArray = [];
            columnsData.forEach((el,i) => {
                if (el.type == "datetime"){
                    inputsArray.push(
                        {id:el.id+"_filter"+"_rows",css:"webix_filter-inputs webix_input-hide", rows:[

                            {id:el.id+"_container",cols:[
                                { 
                                    view: "datepicker",
                                    format:"%d.%m.%Y %H:%i:%s",
                                    id:el.id+"_filter",
                                    name:el.id+"_filter", 
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
                                filterFieldsFunctions (el,parentElement,"datepicker")
                            ]}
                        ]},
                    );
        
                } 
                
    
               else if (el.type.includes("reference")) {
                let findTableId = el.type.slice(10);
    
                    inputsArray.push(
                        {id:el.id+"_filter"+"_rows",css:"webix_filter-inputs webix_input-hide",  rows:[

                            {id:el.id+"_container",cols:[
                                {   view:"combo",
                                    placeholder:"Выберите вариант",  
                                    label:el.label, 
                                    id:el.id+"_filter",
                                    hidden:true,
                                    name:el.id+"_filter",
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
                                filterFieldsFunctions (el,parentElement,"combo")
                            ]}
                        ]},
                    );
                
                } 
                else{
                    
                    inputsArray.push(
                        {id:el.id+"_filter"+"_rows",css:"webix_filter-inputs",rows:[

                            {id:el.id+"_container",  padding:5,css:"webix_inputs-show",cols:[
                                {
                                view:"text", 
                                name:el.id+"_filter",
                                id:el.id+"_filter",
                                css:{"passing-bottom":"5px!important"},
                                placeholder:"Введите текст", 
                                hidden:true,
                                label:el.label, 
                                labelPosition:"top",
                                on:{
                                    onKeyPress:function(){
                                        $$(parentElement).clearValidation();
                                        $$("btnFilterSubmit").enable();
                                    },
                                    onViewShow:function(){
                                        //console.log(this.getParentView().getParentView())
                                        //this.getParentView().getParentView().config.css = "webix_filter-inputs webix_input-show"
                                        //this.getParentView().getParentView().refresh();
                                        // let input = document.querySelectorAll(".webix_filter-inputs");
                                        // input.forEach(function(el,i){
                                        //     if (input.classList.contains("webix_input-hide")){
                                        //         console.log("h")
                                        //         input.classList.remove("webix_input-hide");
                                        //     }
    
                                        //     if (!(input.classList.contains("webix_input-show"))){
                                        //         console.log("s")
                                        //         input.classList.add("webix_input-show");
                                        //     }
                                        // });
                                      
                                        
                                       
                                        
                                    
                                    }
                                }
                                },
                                filterFieldsFunctions (el,parentElement,"text")
                            ]}
                        ]},
                    );
                }
            });

    
            let inpObj = {margin:8,id:"inputsTable",css:"webix_inputs-table-filter", rows:inputsArray};
    
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