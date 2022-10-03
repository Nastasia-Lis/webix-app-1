import {defaultStateForm,createEditFields,saveItem,saveNewItem} from "../blocks/editTableForm.js";
import {catchErrorTemplate,ajaxErrorTemplate} from "../blocks/logBlock.js";
import {modalBox,popupExec} from "../blocks/notifications.js";
import {setLogValue} from '../blocks/logBlock.js';
import {getComboOptions} from '../blocks/content.js';



function field (operation,countChild,typeField,el){

    let findTableId;

    if (el.editor && el.editor == "combo"){
        findTableId = el.type.slice(10);
    } else if (el.view == "combo"){

    }

    let elemId;
    if (el.id.includes("_filter")){
        let index = el.id.indexOf("_filter");
        elemId =  el.id.slice(0,index);
    } else {
        elemId = el.id
    }


    try{
        countChild= $$(elemId+"_filter"+"_rows").getChildViews().length;
        if (typeField=="text"){
            return  {
                view:"text", 
                placeholder:"Введите текст",  
                name:elemId+"_filter-child-"+operation+"-"+countChild,
                id:elemId+"_filter-child-"+operation+"-"+countChild, 
                on:{
                    onKeyPress:function(){
                        $$("filterTableForm").clearValidation();
                        if ($$("btnFilterSubmit")&&!($$("btnFilterSubmit").isEnabled())){
                            $$("btnFilterSubmit").enable();
                        }
                    },
                }
            };

        } else if (typeField=="combo"){
            return {   
                view:"combo",
                name:elemId+"_filter-child-"+operation+"-"+countChild,
                id:elemId+"_filter-child-"+operation+"-"+countChild, 
                placeholder:"Выберите вариант",  
                options:{
                    data:getComboOptions(findTableId)
                },
                on:{
                    onItemClick:function(){
                        $$("filterTableForm").clearValidation();
                        $$("btnFilterSubmit").enable();
                    },
                }
            };

        } else if (typeField=="boolean"){
            return {   
                view:"combo",
                name:elemId+"_filter-child-"+operation+"-"+countChild,
                id:elemId+"_filter-child-"+operation+"-"+countChild, 
                placeholder:"Выберите вариант",  
                options:[
                    {id:1, value: "Да"},
                    {id:2, value: "Нет"}
                ],
                on:{
                    onItemClick:function(){
                        $$("filterTableForm").clearValidation();
                        $$("btnFilterSubmit").enable();
                    },
                }
            };

        } else if (typeField=="datepicker"){
            return { 
                view: "datepicker",
                name:elemId+"_filter-child-"+operation+"-"+countChild,
                id:elemId+"_filter-child-"+operation+"-"+countChild, 
                format:"%d.%m.%Y %H:%i:%s",
                placeholder:"дд.мм.гг", 
                timepicker: true,
                on:{
                    onItemClick:function(){
                        $$("filterTableForm").clearValidation();
                        $$("btnFilterSubmit").enable();
                    }
                }
            };
        } else if (typeField=="integer"){
            return { 
                view: "text",
                name:elemId+"_filter-child-"+operation+"-"+countChild,
                id:elemId+"_filter-child-"+operation+"-"+countChild, 
                invalidMessage:"Поле поддерживает только числовой формат",
                placeholder:"Введите число", 
                on:{
                    onItemClick:function(){
                        $$("filterTableForm").clearValidation();
                        $$("btnFilterSubmit").enable();
                    }
                },
                validate:function(val){
                    return !isNaN(val*1);
                }
            };
        }
    } catch (error){
        console.log(error);
        catchErrorTemplate("012-000", error);
    }

}


function filterOperationsBtnLogic (idBtn,id){
    try {
        let btnFilterOperations = $$(idBtn);
        if (id.includes("eql")){
            return btnFilterOperations.setValue("=");
        } else if (id.includes("notEqual")){
            return btnFilterOperations.setValue("!=");
        } else if (id.includes("less")){
            return btnFilterOperations.setValue("<");
        } else if (id.includes("more")){
            return btnFilterOperations.setValue(">");
        } else if (id.includes("mrEqual")){
            return btnFilterOperations.setValue(">=");
        } else if (id.includes("lsEqual")){
            btnFilterOperations.setValue("<=");
        } else if (id.includes("contains")){
            return btnFilterOperations.setValue("⊆");
        }
    } catch (error){
        console.log(error);
        catchErrorTemplate("012-000", error);
    }

}


function filterOperationsBtnData (typeField){
    return webix.once(function(){
        if (typeField == "combo"){
            this.add( { value: '=', id:"operations_eql" });
            this.add(  { value: '!=', id:"operations_notEqual" });
        } else if (typeField == "text"){
            this.add( { value: '=', id:"operations_eql" });
            this.add(  { value: '!=', id:"operations_notEqual" });
            this.add( {value: 'содержит', id:"operations_contains"  });
        } else if (typeField == "datepicker"){
            this.add( { value: '=', id:"operations_eql" });
            this.add(  { value: '!=', id:"operations_notEqual" });
            this.add( { value: '<', id:"operations_less"  });
            this.add(  { value: '>', id:"operations_more"  });
            this.add( { value: '>=', id:"operations_mrEqual" });
            this.add(  { value: '<=', id:"operations_lsEqual" });
        } else if (typeField == "integer"){
            this.add( { value: '=', id:"operations_eql" });
            this.add(  { value: '!=', id:"operations_notEqual" });
            this.add( { value: '<', id:"operations_less"  });
            this.add(  { value: '>', id:"operations_more"  });
            this.add( { value: '>=', id:"operations_mrEqual" });
            this.add(  { value: '<=', id:"operations_lsEqual" });
            this.add( {value: 'содержит', id:"operations_contains"  });
        }
       
    });
}


function filterFieldsFunctions (el,typeField){
    let countChild;

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
                ],
                on: {
                    onMenuItemClick(id) {
                        filterOperationsBtnLogic (el.id+"_filter-btnFilterOperations", id);
                    },
                    onAfterLoad: filterOperationsBtnData(typeField)
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
                    
                    createChildFields (id,el)
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


function createChildFields (id,el) {
        let elemId = el.id;

        let typeField = el.editor;
 
        let countChild= $$(elemId+"_filter"+"_rows").getChildViews().length;
        if(id.includes("and")){
         
            $$(elemId+"_filter"+"_rows").addView(
                {id:elemId+"_filter-container-child-"+countChild, padding:5,rows:[
                    {id:"and_"+webix.uid(),template:"<div style='color:var(--primary)'>+ и</div>", height:30, borderless:true},
                    {id:webix.uid(),cols:[
             
                        field ("operAnd",countChild,typeField,el),
                        {  id:elemId+"_filter_container-btns"+countChild,cols:[
                            {   view:"button",
                                id:elemId+"_filter-child-operAnd-"+countChild+"-btnFilterOperations",
                                css:"webix_primary webix_filterBtns",
                                value:"=",
                                inputHeight:38,
                                width: 40,
                                popup: {
                                    view: 'contextmenu',
                                    width: 200,
                                    data: [],
                                    on: {
                                        onMenuItemClick(id) {
                                            filterOperationsBtnLogic (elemId+"_filter-child-operAnd-"+countChild+"-btnFilterOperations", id);
                                        },
                                        onAfterLoad: filterOperationsBtnData(typeField)
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
                                id:elemId+"_filter-child-operAnd-"+countChild+"_remove",
                                type:"icon",
                                icon: 'wxi-trash',
                                inputHeight:38,
                                width: 40,
                                click:function(){
                                    try{ 
                                        popupExec("Поле фильтра будет удалено").then(
                                            function(){
                                                let container = $$(elemId+"_filter-child-operAnd-"+countChild+"_remove").getParentView();
                                                let parentContainer = container.getParentView().getParentView();
                                                $$(elemId+"_filter"+"_rows").removeView($$(parentContainer.config.id));
                                                $$(elemId+"_filter"+"_rows").refresh();
                                                setLogValue("success","Поле удалено");
                                        });
                                        
                                
                                    }catch(e){
                                        setLogValue("error","Ошибка удаления поля");
                                    }

                                },
                                on: {
                                    onAfterRender: function () {
                                        this.getInputNode().setAttribute("title","Удалить поле фильтра");
                                    },
                                },
                            
                            }
                        ]}
                    ]}
                ]},countChild
       
            );

        } else if(id.includes("or")){
            $$(elemId+"_filter"+"_rows").addView(
                {id:elemId+"_filter-container-child-operOr-"+countChild,padding:5,rows:[
                    {id:"or_"+webix.uid(),template:"<div style='color:var(--primary)'>+ или</div>", height:30, borderless:true},
                    {id:webix.uid(),cols:[
                        field ("operOr",countChild,typeField,el),
                        {id:elemId+"_filter_container-btns"+countChild,cols:[
                            {
                                view:"button",
                                id:elemId+"_filter-child-operOr-"+countChild+"-btnFilterOperations",
                                css:"webix_primary webix_filterBtns",
                                value:"=",
                                inputHeight:38,
                                width: 40,
                                popup: {
                                    view: 'contextmenu',
                                    width: 200,
                                    data: [],
                                    on: {
                                        onMenuItemClick(id) {
                                            filterOperationsBtnLogic (elemId+"_filter-child-operOr-"+countChild+"-btnFilterOperations", id);
                                        },
                                        onAfterLoad: filterOperationsBtnData(typeField)
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
                                id:elemId+"_filter-child-operOr-"+countChild+"_remove",
                                type:"icon",
                                icon: 'wxi-trash',
                                inputHeight:38,
                                width: 40,
                                click:function(){
                                    try{
                                        popupExec("Поле фильтра будет удалено").then(
                                            function(){
                                                
                                                let container = $$(elemId+"_filter-child-operOr-"+countChild+"_remove").getParentView();
                                                let parentContainer = container.getParentView().getParentView();

                                                console.log(parentContainer)
                                                $$(elemId+"_filter"+"_rows").removeView($$(parentContainer.config.id));

                                               // $$(el.id+"_filter"+"_rows").removeView($$(el.id+"_filter-container-child-operOr-"+countChild));
                                                setLogValue("success","Поле удалено"); 
                                        });
                                        
                                    }catch(e){
                                        setLogValue("error","Ошибка удаления поля");
                                    }

                                },
                                on: {
                                    onAfterRender: function () {
                                        this.getInputNode().setAttribute("title","Удалить поле фильтра");
                                    },
                                },
                            
                            }
                        ]}
                    ]}
                ]},countChild
            );
        }
 
}


function exportToExcel(idTable){
    webix.toExcel(idTable, {
      filename:"Table",
      filterHTML:true,
      styles:true
    });
    setLogValue("success","Таблица сохранена");
}


function createFilterElements (parentElement, viewPosition=1) {
    try {
        let columnsData = $$("table").getColumns();
    
        if(Object.keys($$(parentElement).elements).length==0  ){
            let inputsArray = [];
            columnsData.forEach((el,i) => {
                if (el.type == "datetime"){
                    inputsArray.push(
                        {id:el.id+"_filter"+"_rows",css:el.id+" webix_filter-inputs", rows:[

                            {id:el.id+"_container",padding:5,cols:[
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
                                filterFieldsFunctions (el,"datepicker")
                            ]}
                        ]},
                    );
        
                } 
            else if (el.type.includes("reference")) {
                let findTableId = el.type.slice(10);
    
                    inputsArray.push(
                        {id:el.id+"_filter"+"_rows",css:el.id+" webix_filter-inputs",  rows:[

                            {id:el.id+"_container",padding:5,cols:[
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
                                filterFieldsFunctions (el,"combo")
                            ]}
                        ]},
                    );
                
                } 
                else if (el.type.includes("boolean")) {
    
                    inputsArray.push(
                        {id:el.id+"_filter"+"_rows",css:el.id+" webix_filter-inputs",  rows:[

                            {id:el.id+"_container",padding:5,cols:[
                                {   view:"combo",
                                    placeholder:"Выберите вариант",  
                                    label:el.label, 
                                    id:el.id+"_filter",
                                    hidden:true,
                                    name:el.id+"_filter",
                                    labelPosition:"top",
                                    options:[
                                        {id:1, value: "Да"},
                                        {id:2, value: "Нет"}
                                    ],
                                    on:{
                                        onItemClick:function(){
                                            $$(parentElement).clearValidation();
                                            $$("btnFilterSubmit").enable();
                                        },
                                    }
                                },
                                filterFieldsFunctions (el,"combo")
                            ]}
                        ]},
                    );
                
                } 
                else if (el.type.includes("integer")) {
                    inputsArray.push(
                        {id:el.id+"_filter"+"_rows",css:el.id+" webix_filter-inputs",rows:[

                            {id:el.id+"_container",  padding:5,css:"webix_inputs-show",cols:[
                                {
                                    view:"text", 
                                    name:el.id+"_filter",
                                    id:el.id+"_filter",
                                    css:{"padding-bottom":"5px!important"},
                                    placeholder:"Введите число", 
                                    hidden:true,
                                    label:el.label, 
                                    labelPosition:"top",
                                    invalidMessage:"Поле поддерживает только числовой формат",
                                    on:{
                                        onKeyPress:function(){
                                            $$(parentElement).clearValidation();
                                            $$("btnFilterSubmit").enable();
                                        },
                                    },
                                    validate:function(val){
                                        return !isNaN(val*1);
                                    }
                                },
                                filterFieldsFunctions (el,"integer")
                            ]}
                        ]},
                    );
                }
                else{
                    
                    inputsArray.push(
                        {id:el.id+"_filter"+"_rows",css:el.id+" webix_filter-inputs",rows:[

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
                                }
                                },
                                filterFieldsFunctions (el,"text")
                            ]}
                        ]},
                    );
                }
            });

    
            let inpObj = {margin:8,id:"inputsFilter",css:"webix_inputs-table-filter", rows:inputsArray};
    
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
            $$("inputsFilter").show();
        }
    } catch (error){
        console.log(error);
        catchErrorTemplate("012-000", error);
    }
}

function filterBtnClick (idTable,idBtnEdit){
    try{
        if (window.innerWidth > 1200){

            let filterFormValues;

            if ($$("filterTableForm").getValues()){
                filterFormValues = $$("filterTableForm").getValues();
            }
            
            if ($$("editFilterBarAdaptive").getParentView().config.id !==  "filterTableBarContainer"){
                $$("filterTableBarContainer").addView($$("editFilterBarAdaptive"));
            }

            if($$("editFilterBarHeadline")){
                $$("editFilterBarHeadline").hide();
            }
            $$("editFilterBarAdaptive").config.width = 350;
            $$("editFilterBarAdaptive").resize();

            $$(idTable).clearSelection();
            let btnClass = document.querySelector(".webix_btn-filter");

            if(!(btnClass.classList.contains("webix_primary"))){
                $$("filterTableForm").show();
                $$("table-editForm").hide();
            
                if($$("filterTableForm").getChildViews() !== 0){
                    createFilterElements("filterTableForm",3);
                }

                if (filterFormValues){
                    $$("filterTableForm").setValues(filterFormValues);
                    filterFormValues = null;
                }

                btnClass.classList.add("webix_primary");
                btnClass.classList.remove("webix_secondary");
                $$(idBtnEdit).show();

                if ($$("editTableBarContainer") && $$("editTableBarContainer").isVisible()){
                    $$("editTableBarContainer").hide();
                }

                if ($$("filterTableBarContainer") && !($$("filterTableBarContainer").isVisible())){
                    $$("filterTableBarContainer").show();
                }
            
            } else {
                $$("filterTableForm").hide();
                $$("table-editForm").show();
                btnClass.classList.add("webix_secondary");
                btnClass.classList.remove("webix_primary");
                $$(idBtnEdit).hide();
                
                if ($$("filterTableBarContainer") && $$("filterTableBarContainer").isVisible()){
                    $$("filterTableBarContainer").hide();
                }

                if ($$("editTableBarContainer") && !($$("editTableBarContainer").isVisible())){
                    $$("editTableBarContainer").show();
                }
            }
        } else {

            
            if ($$("editTableBarContainer") && $$("editTableBarContainer").isVisible()){
                $$("editTableBarContainer").hide();
            }
      
            if ($$("tableFilterPopup")){
                $$("tableFilterPopup").show();
            }

            if ($$("tableFilterPopupContainer") && !($$("tableFilterPopupContainer").isVisible())){
                $$("tableFilterPopupContainer").show();
            }

            let filterFormValues;

            if ($$("filterTableForm").getValues()){
                filterFormValues = $$("filterTableForm").getValues();
                
            }

            if ($$("tableFilterPopupContainer")){
                $$("tableFilterPopupContainer").addView($$("editFilterBarAdaptive"));
            }

            if($$("editFilterBarHeadline") && !($$("editFilterBarHeadline").isVisible())){
                $$("editFilterBarHeadline").show();
            }
 
            if($$("filterTableForm").getChildViews() !== 0){
                createFilterElements("filterTableForm",3);
            }

            $$("filterTableForm").show();

            if (filterFormValues){
                $$("filterTableForm").setValues(filterFormValues);
                $$("filterTableForm").setDirty();
                filterFormValues = null;
            }

            let size = window.innerWidth - 200;

            if( $$("editFilterBarAdaptive").$width > 200){
                $$("editFilterBarAdaptive").config.width = size;
                $$("editFilterBarAdaptive").resize();
            }

        }
    } catch (error){
        console.log(error);
        catchErrorTemplate("012-000", error);

    }
}


function editBtnClick(idBtnEdit) {
    try {

        if (window.innerWidth > 1200){
            let btnClass = document.querySelector(".webix_btn-filter");
            $$("filterTableForm").hide();
            $$("table-editForm").show();
            btnClass.classList.add("webix_secondary");
            btnClass.classList.remove("webix_primary");
            $$(idBtnEdit).hide();
            if ($$("editTableBarContainer") ){
                $$("editTableBarContainer").show();
            }
            if ($$("filterTableBarContainer") && $$("filterTableBarContainer").isVisible()){
                $$("filterTableBarContainer").hide();
            }


        } else {
            if (!($$("tableEditPopup"))){
                webix.ui({
                    view:"popup",
                    css:"webix_popup-table-container webix_popup-config",
                    modal:true,
                    id:"tableEditPopup",
                    escHide:true,
                    position:"center",
                    body:{
                        id:"tableEditPopupContainer",rows:[

                        ]
                    }
                }).show();


                $$("tableEditPopupContainer").addView($$("editTableBarAdaptive"));

                if($$("editTableBarHeadline") && !($$("editTableBarHeadline").isVisible())){
                    $$("editTableBarHeadline").show();
                }

                let size = window.innerWidth - 500;

                if( $$("editTableBarAdaptive").$width > 200){
                    $$("editTableBarAdaptive").config.width = size;
                    $$("editTableBarAdaptive").resize();
                }

          
               
            } else {
                $$("tableEditPopup").show();
                let size = window.innerWidth - 500;

                if( $$("editTableBarAdaptive").$width > 200){
                    $$("editTableBarAdaptive").config.width = size;
                    $$("editTableBarAdaptive").resize();
                }

                if ($$("tableEditPopupContainer").getChildViews().length){
                    
                    if (!($$("table-newAddBtnId").isEnabled())){
                        $$("table-newAddBtnId").enable();
                    }

                    if ($$("editTableBarContainer") ){
                        $$("editTableBarContainer").show();
                    }

                } else {
                    $$("tableEditPopupContainer").addView($$("editTableBarAdaptive"));

                    if($$("editTableBarHeadline") && !($$("editTableBarHeadline").isVisible())){
                        $$("editTableBarHeadline").show();
                    }
                }
            }
            if($$("table-newAddBtnId")){
                if($$("table-saveNewBtn").isVisible() && $$("table-newAddBtnId").isEnabled()){
                    $$("table-newAddBtnId").disable();
                } else {
                    $$("table-newAddBtnId").enable();
                }
            }
        }
    } catch (error){
        console.log(error);
        catchErrorTemplate("012-000", error);
    }
}



function tableToolbar (idSearch, idExport,idBtnEdit, idFindElements, idFilterElements, idTable,idFilter,idHeadline,visible=false) {

  
    return { 
        
        rows:[
            {   view:"template",
                id:idHeadline,
                css:"webix_style-template-count webix_block-title",
                height:34,
                template:function(){
                    if (Object.keys($$(idHeadline).getValues()).length !==0){
                        return "<div style='display:inline-block;font-size:15px!important;font-weight:600'>"+$$(idHeadline).getValues()+"</div>"
                    } else {
                        return "<div style='display:inline-block;font-size:13px!important;font-weight:600'>Имя не указано</div>";
                    }
                },
            },

            {//id:"filterBar", 
            css:"webix_filterBar",padding:17, height: 80,margin:5, 
                
                cols: [
                {   view:"button",
                    width: 50, 
                    type:"icon",
                    id:idFilter,
                    hidden:visible,
                    icon:"wxi-filter",
                    css:"webix_btn-filter",
                    disabled:true,
                    title:"текст",
                    height:50,
                    click:function(){
                        filterBtnClick(idTable,idBtnEdit);
                    },
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title","Показать/скрыть фильтры");
                        }
                    } 
                },
                {   view:"button",
                    maxWidth:200, 
                    value:"<span class='webix_icon wxi-pencil'></span><span style='padding-left: 4px'>Редактор таблицы</span>",
                    id:idBtnEdit,
                    hidden:true,
                    css:"webix_btn-edit",
                    title:"текст",
                    height:50,
                    click:function(){
                        editBtnClick(idBtnEdit);
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
                {},

                {   view:"button",
                    width: 50, 
                    type:"icon",
                    id:idExport,
                    hidden:visible,
                    icon:"wxi-download",
                    css:"webix_btn-download",
                    title:"текст",
                    height:50,
                    click:function(){
                        exportToExcel(idTable)
                    },
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
        minHeight:350,
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
                try {
                    popupExec("Запись будет удалена").then(
                        function(){
                            let formValues = $$(idTable).getItem(id);
                            let itemTreeId = $$("tree").getSelectedItem().id;
                            webix.ajax().del("/init/default/api/"+itemTreeId+"/"+formValues.id+".json", formValues,{
                                success:function(){
                                    $$(idTable).remove($$(idTable).getSelectedId());
                                    setLogValue("success","Данные успешно удалены");
                                },
                                error:function(text, data, XmlHttpRequest){
                                    ajaxErrorTemplate("012-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);

                                }
                            }).catch(error => {
                                console.log(error);
                                ajaxErrorTemplate("012-000",error.status,error.statusText,error.responseURL);
                            });
                    });
                } catch (error){
                    console.log(error);
                    catchErrorTemplate("012-000", error);
                }
            },

            "wxi-angle-down":function(event, cell, target){
                try {
                    if (!($$("propTableView").isVisible()))   {
                        let id = cell.row;
                        let url;
                        let columns = $$("table-view").getColumns();

                        columns.forEach(function(el,i){
                            if (el.id == cell.column){
                                url=el.src;
                                let urlArgEnd = url.search("{");
                                url = url.slice(0,urlArgEnd)+id+".json"; 
                            }
                        });    

                        webix.ajax(url,{
                            success:function(text, data, XmlHttpRequest){
                                try {
                                    data = data.json().content;
                                    let arrayProperty = [];
                                    data.forEach(function(el,i){
                                        arrayProperty.push({type:"text", id:i+1,label:el.name, value:el.value})
                                    });
                                    $$("propTableView").define("elements", arrayProperty);
                                    $$("propTableView").show();
                      
                                    if ($$("propTableView").config.width < 200){
                                        $$("propTableView").config.width = 200;
                                        $$("propTableView").resize();
                                    }
                                    $$("propResize").show();
                                } catch (error){
                                    console.log(error);
                                    catchErrorTemplate("012-000", error);
                                }
                            },
                            error:function(text, data, XmlHttpRequest){
                                ajaxErrorTemplate("012-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);


                            }
                        }).catch(error => {
                            console.log(error);
                            ajaxErrorTemplate("012-000",error.status,error.statusText,error.responseURL);
                        });
                    } else {
                        $$("propTableView").hide();
                        $$("propResize").hide();
                    }
                } catch (error){
                    console.log(error);
                    catchErrorTemplate("012-000", error);
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
        try {
            if(state.value != state.old){
                $$(editor.column).setValue(state.value);
                saveItem();
            }
        } catch (error){
            console.log(error);
            catchErrorTemplate("012-011", error);
        }
    },

    onAfterSelect(id){
        try {
            if ($$("table-editTableBtnId").isVisible() && window.innerWidth > 1200){
                $$("table-editTableBtnId").hide();
            }

            if ($$("table-newAddBtnId")){
                $$("table-newAddBtnId").enable();
            }
           
            if ($$("EditEmptyTempalte")){
                $$("EditEmptyTempalte").hide();
            }

            if(!($$("table-editForm").isVisible())){
                $$("table-editForm").show();
                $$("filterTableForm").hide();
                let btnClass = document.querySelector(".webix_btn-filter");
                btnClass.classList.add("webix_secondary");
                btnClass.classList.remove("webix_primary");
                
            }

            if ($$("filterTableBarContainer") && $$("filterTableBarContainer").isVisible()){
                $$("filterTableBarContainer").hide();
            }

            if ($$("editTableBarContainer") && !($$("editTableBarContainer").isVisible())){
                $$("editTableBarContainer").show();
            }
            if (window.innerWidth < 1200){

                if (!($$("tableEditPopup"))){
                    webix.ui({
                        view:"popup",
                        css:"webix_popup-table-container webix_popup-config",
                        modal:true,
                        id:"tableEditPopup",
                        escHide:true,
                        position:"center",
                        body:{
                            id:"tableEditPopupContainer",rows:[

                            ]
                        }
                    }).show();
                    $$("tableEditPopupContainer").addView($$("editTableBarAdaptive"))

                    if($$("editTableBarHeadline") && !($$("editTableBarHeadline").isVisible())){
                        $$("editTableBarHeadline").show();
                    }
              
                } else {
                    $$("tableEditPopup").show();
                   
                }

                if ($$("EditEmptyTempalte") && $$("EditEmptyTempalte").isVisible()){
                    $$("EditEmptyTempalte").hide();
                }

            }
            
        
        } catch (error){
            console.log(error);
            catchErrorTemplate("012-000", error);
        }

  
    },
    onBeforeSelect:function(selection, preserve){
        

        let values = $$("table").getItem(selection.id); 
        function toEditForm () {
            try {
           
                if ($$("editTableFormProperty") && !($$("editTableFormProperty").isVisible())){
                    $$("editTableFormProperty").show();
                }

                $$("editTableFormProperty").config.dirty = false;
                $$("editTableFormProperty").refresh();

                $$("editTableFormProperty").setValues(values);
              
                $$("table-saveNewBtn").hide();
                $$("table-saveBtn").show();
                $$("table-delBtnId").enable();
            } catch (error){
                console.log(error);
                catchErrorTemplate("012-000", error);
            }
        }
    
        if ($$("editTableFormProperty").config.dirty){
            
            modalBox().then(function(result){
                if (result == 1){
                    toEditForm();
                    $$("table").select(selection.id);
                } 

                else if (result == 2){

                    if ($$("editTableFormProperty").getValues().id){
                       
                        saveItem(false,false,true);
                    } else {
                        saveNewItem(); 
                    }
                    toEditForm();
                    $$("table").select(selection.id);

                }
            });

            if (!($$("table-newAddBtnId").isEnabled())){
                $$("table-newAddBtnId").enable();
            }

            return false;
        } else {
            createEditFields("table-editForm");
            toEditForm();
         
        }
    },
    onAfterLoad:function(){
        try {
            this.hideOverlay();
            defaultStateForm ();
        } catch (error){
            console.log(error);
            catchErrorTemplate("012-000", error);
        }
    },  
    onAfterDelete: function() {
        try {
            $$("table-findElements").setValues($$("table").count().toString());
            if (!this.count())
                this.showOverlay("Ничего не найдено");
            if (this.count())
                this.hideOverlay();
        } catch (error){
            console.log(error);
            catchErrorTemplate("012-000", error);
        }
    },
    onAfterAdd: function() {
        try {
            $$("table-findElements").setValues($$("table").count().toString());
            this.hideOverlay();
        } catch (error){
            console.log(error);
            catchErrorTemplate("012-000", error);
        }
    },
    onAfterRender:function(){
        if (window.innerWidth < 1200 ){
            if ($$("table-editTableBtnId") && !($$("table-editTableBtnId").isVisible())){
               $$("table-editTableBtnId").show(); 
            }
            
        }
    }

    
 
};


export {
    tableToolbar,
    table,
    onFuncTable,
    filterFieldsFunctions,
    createChildFields
};