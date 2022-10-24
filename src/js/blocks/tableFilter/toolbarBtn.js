import {hideElem,showElem} from "../commonFunctions.js";
import {setAjaxError,setFunctionError} from "../errors.js";
import {getComboOptions} from '../content.js';

import {popupExec} from "../notifications.js";

const logNameFile = "tableFilter => toolbar";


function field (operation,countChild,typeField,el){

    let findTableId;

    function getIdCombo(){
        if (el.editor && el.editor == "combo"){
            findTableId = el.type.slice(10);
        } 
    }

    function getElemId (){
        let id;
        if (el.id.includes("_filter")){
            let index = el.id.indexOf("_filter");
            id =  el.id.slice(0,index);
        } else {
            id = el.id;
        }
        return id;
    }

    function createField(){
     
        const elemId        = getElemId ();
        const containerRows = $$(elemId+"_filter"+"_rows");
        countChild          = containerRows.getChildViews().length;

        const fieldId       = elemId+"_filter-child-"+operation+"-"+countChild;
        const fieldTemplate = {
            id:  fieldId, 
            name:fieldId,
            on:{
                onKeyPress:function(){
                    const btn = $$("btnFilterSubmit");
                    $$("filterTableForm").clearValidation();
                    if (btn && !(btn.isEnabled())){
                        btn.enable();
                    }
                },
            }
        };

        function createText(type){
            const element       = fieldTemplate;
            element.view        = "text";

            if(type == "text"){
                element.placeholder = "Введите текст";
            } else if (type == "int"){
                element.placeholder    = "Введите число";
                element.invalidMessage = "Поле поддерживает только числовой формат";
                element.validate       = function(val){
                    return !isNaN(val*1);
                };
            }
           

            return element;
        }

        function createCombo(type){
            const element       = fieldTemplate;
            element.view        = "combo";
            element.placeholder = "Выберите вариант";
 
            if (type == "default"){
                element.options     = {
                    data:getComboOptions(findTableId)
                };
            } else if (type == "bool"){
                element.options = [
                    {id:1, value: "Да"},
                    {id:2, value: "Нет"}
                ];
            }

            return element;
        }

        function createDatepicker() {
            const element       = fieldTemplate;
            element.view        = "datepicker";
            element.placeholder = "дд.мм.гг";
            element.format      = "%d.%m.%Y %H:%i:%s";
            element.timepicker  = true;
          
            return element;
        }
   
        if (typeField=="text"){
            return createText("text");
    
        } else if (typeField=="combo"){
            return createCombo("default");
    
        } else if (typeField=="boolean"){
            return createCombo("bool");
    
        } else if (typeField=="date"){
            return createDatepicker();

        } else if (typeField=="integer"){
            return createText("int");

        }
 
       
    
    }


    getIdCombo();
    return createField();

}

function filterOperationsBtnLogic (idBtn,id){
    try {
        let btnFilterOperations = $$(idBtn);

        if        (id.includes("eql")){
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
    } catch (err){
        setFunctionError(err,logNameFile,"filterOperationsBtnLogic");
    }

}

function filterOperationsBtnData (typeField){
    return webix.once(function(){
        if (typeField == "combo" || typeField == "boolean" ){
            this.add( { value: '=', id:"operations_eql" });
            this.add(  { value: '!=', id:"operations_notEqual" });
        } else if (typeField  == "text" ){
            this.add( { value: '=', id:"operations_eql" });
            this.add(  { value: '!=', id:"operations_notEqual" });
            this.add( {value: 'содержит', id:"operations_contains"});
        } else if (typeField  == "date"){
            this.add( { value: '=', id:"operations_eql" });
            this.add(  { value: '!=', id:"operations_notEqual" });
            this.add( { value: '<', id:"operations_less"  });
            this.add(  { value: '>', id:"operations_more"  });
            this.add( { value: '>=', id:"operations_mrEqual" });
            this.add(  { value: '<=', id:"operations_lsEqual" });

        } else if (typeField  == "integer"   ){
            this.add( { value: '=', id:"operations_eql" });
            this.add(  { value: '!=', id:"operations_notEqual" });
            this.add( { value: '<', id:"operations_less"  });
            this.add(  { value: '>', id:"operations_more"  });
            this.add( { value: '>=', id:"operations_mrEqual" });
            this.add(  { value: '<=', id:"operations_lsEqual" });
            this.add( {value: 'содержит', id:"operations_contains"});

        }   
    });
}

function filterFieldsFunctions (el,typeField){

    const idBtnOperation = el.id+"_filter-btnFilterOperations";
    const btnOperation = {
        view:"button",
        id:idBtnOperation,
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
                    filterOperationsBtnLogic (idBtnOperation, id);
                },
                onAfterLoad: filterOperationsBtnData(typeField)
                
           
            }
        },
        on:{
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Выбрать условие поиска по полю");
            },
        }
    
    };

    const btnAdd = {
        view:"button", 
        css: "webix_filterBtns",
        value:"+",
        id:el.id+"_filter_condition",
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
                createChildFields (id,el);
            },
            
        }
        },
        on:{
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Добавить ещё вариант поля");
            },
        }
    };

    const btns = {
        id:el.id+"_filter_container-btns",
        css:{"margin-top":"27px!important"},
        hidden:true, 
        cols:[
            btnOperation,
            btnAdd,
        ]
    };

    return btns;       
}

function createChildFields (id,el) {
    const elemId        = el.id;
    const containerRows = $$(elemId+"_filter"+"_rows");
    const countChild    = containerRows.getChildViews().length;

    let typeField;
    function getTypeField(){
        if (el.type !== "boolean"){
            typeField     = el.editor;
        } else {
            typeField     = "boolean";
        }
    }
    getTypeField();
    function createAndInput(){
        const headline = {   
            id:"and_"+webix.uid(),
            template:"<div style='color:var(--primary)'>+ и</div>", 
            height:30, 
            borderless:true
        };

        const btnsId = elemId+"_filter-child-operAnd-"+countChild;
        
        const idBtnOperations = btnsId+"-btnFilterOperations";
        const btnOperations = {   
            view:"button",
            id:idBtnOperations,
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
                        filterOperationsBtnLogic (idBtnOperations, id);
                    },
                    onAfterLoad: filterOperationsBtnData(typeField)
                }
                
            },
            on:{
                onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Выбрать условие поиска по полю");
                },
            }
        };

        const idBtnDel =btnsId+"_remove";
        const btnDel = {
            view:"button",
            id:idBtnDel,
            css:"webix_filterBtns webix_danger",
            type:"icon",
            icon: 'wxi-trash',
            inputHeight:38,
            width: 40,
            click:function(){
                function popupSuccess (){     
                    try{ 
                        const container       = $$(idBtnDel).getParentView();
                        const parentContainer = container.getParentView().getParentView();
                        const rowsContainer   = $$(elemId+"_filter"+"_rows");
                        
                        rowsContainer.removeView($$(parentContainer.config.id));

                        setLogValue("success","Поле удалено");     
                    } catch(err){ 
                        setFunctionError(err,logNameFile,"createAndInput => popupSuccess");
                    }
                }
                
                popupExec("Поле фильтра будет удалено").then(
                    function(){
                        popupSuccess ();
                    }
                );


            },
            on: {
                onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Удалить поле фильтра");
                },
            },
        
        };

        const btns = {  
            id:elemId+"_filter_container-btns"+countChild,
            cols:[
                btnOperations,
                btnDel
            ]
        };

        function addInput(){
 
            try{     
                   
                containerRows.addView(
                    {   id:elemId+"_filter-container-child-"+countChild, 
                        padding:5,
                        rows:[
                            headline,
                            {   id:webix.uid(),
                                cols:[
                                    field ("operAnd",
                                            countChild,
                                            typeField,
                                            el
                                    ),
                                    btns
                                ]
                            }
                        ]
                    },countChild
        
                );
            }catch(err){ 
                setFunctionError(err,logNameFile,"createAndInput => addInput");
            }
        }

        addInput();
    }

    function createOrInput(){

        const headline =  {
            id:"or_"+webix.uid(),
            template:"<div style='color:var(--primary)'>+ или</div>",
            height:30, 
            borderless:true
        };
        const btnsId = elemId+"_filter-child-operOr-"+countChild;

        const idBtnOperation = btnsId+"-btnFilterOperations";
        const btnOperation = {
            view:"button",
            id:idBtnOperation,
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
                        filterOperationsBtnLogic (idBtnOperation, id);
                    },
                    onAfterLoad: filterOperationsBtnData(typeField)
                   
                }
            },
            on:{
                onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Выбрать условие поиска по полю");
                },
            }
        
        };

        const idBtnDel = btnsId+"_remove";
        const btnDel = {
            view:"button",
            css:"webix_filterBtns webix_danger",
            id:idBtnDel,
            type:"icon",
            icon: 'wxi-trash',
            inputHeight:38,
            width: 40,
            click:function(){
                function popupSuccess(){
                    try{
                        let container = $$(idBtnDel).getParentView();
                        let parentContainer = container.getParentView().getParentView();

                        containerRows.removeView($$(parentContainer.config.id));

                        setLogValue("success","Поле удалено"); 
                    }catch(err){ 
                        setFunctionError(err,logNameFile,"createOrInput => popupSuccess")
                    }
                }
                
                popupExec("Поле фильтра будет удалено").then(
                    function(){
                        popupSuccess();
                        
                    }
                );
            },
            on: {
                onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Удалить поле фильтра");
                },
            },
        
        };

        const btns =  {
            id:elemId+"_filter_container-btns"+countChild,
            cols:[
                btnOperation,
                btnDel
            ]
        };

        containerRows.addView(
            {   id:elemId+"_filter-container-child-operOr-"+countChild,
                padding:5,
                rows:[
                    headline,
                    {   id:webix.uid(),
                        cols:[
                            field ("operOr",
                                    countChild,
                                    typeField,
                                    el
                            ),
                            btns
                        ]
                    }
            ]},countChild
        );
    }

    if(id.includes("and")){
        createAndInput();
        
    } else if(id.includes("or")){
        createOrInput();
    }
 
}

function createFilterElements (parentElement, viewPosition=1) {
    const childs       = $$(parentElement).elements;
    const childsLength = Object.keys(childs).length;


    function enableDelBtn(){
        const delBtn = $$("table-delBtnId");
        try{
            if(parentElement=="table-editForm" && delBtn ){
                delBtn.enable();
            }
        } catch (err){ 
            setFunctionError(err,logNameFile,"createFilterElements => enableDelBtn");
        }
    }

    function generateElements(){
        const columnsData = $$("table").getColumns();
        let inputsArray   = [];
        try{
            columnsData.forEach((el,i) => {
                
                const inputTemplate = { 
                    id:el.id+"_filter",
                    name:el.id+"_filter", 
                    hidden:true,
                    label:el.label, 
                    labelPosition:"top",
                    on:{
                        onItemClick:function(){
                            $$(parentElement).clearValidation();
                            $$("btnFilterSubmit").enable();
                        }
                    }
                };
                const idContainerRows = el.id+"_filter"+"_rows";
                const idContainer     = el.id+"_container";
                const cssContainer    = el.id+" webix_filter-inputs";

                function pushData (element, btns){
                    const data  =  {   
                        id:idContainerRows,
                        css:cssContainer,
                        rows:[
                            {   id:idContainer,
                                padding:5,
                                cols:[
                                    element,
                                    btns
                                ]
                            }
                        ]
                    };

                    return data;
                }
        
        
                function createDatepicker(){
                    const elem       = inputTemplate;
                    elem.view        = "datepicker";
                    elem.format      = "%d.%m.%Y %H:%i:%s";
                    elem.placeholder = "дд.мм.гг";
                    elem.timepicker  = true;
                    return elem;
                }

                function createCombo(findTableId){
                    const elem       = inputTemplate;
                    elem.view        = "combo";
                    elem.placeholder = "Выберите вариант";
                    elem.options     = {
                        data:getComboOptions(findTableId)
                    };
                    return elem;
                }

                function createBoolCombo (){
                    const elem       = inputTemplate;
                    elem.view        = "combo";
                    elem.placeholder = "Выберите вариант";
                    elem.options     = [
                        {id:1, value: "Да"},
                        {id:2, value: "Нет"}
                    ];
                    return elem;
                }

                function createText (type){
        
                    const elem = inputTemplate;
                    elem.view  = "text";
                    elem.css   = {"passing-bottom":"5px!important"};

                    if        (type == "text"){
                        elem.placeholder = "Введите текст";

                } else if (type == "int"){
                        elem.placeholder     = "Введите число";
                        elem.invalidMessage  = "Поле поддерживает только числовой формат";
                        elem.validate        = function (val) {
                            return !isNaN(val*1);
                        };
                    }
                    
                    return elem;
                }

                if (el.type == "datetime"){
                    inputsArray.push(
                        pushData ( 
                            createDatepicker (),  
                            filterFieldsFunctions (el,"date")
                        )
                    );
                } 
            else if (el.type.includes("reference")) {
                let findTableId = el.type.slice(10);

                    inputsArray.push(
                        pushData ( 
                            createCombo(findTableId),
                            filterFieldsFunctions (el,"combo")
                        )
                    );
                
                } 
                else if (el.type.includes("boolean")) {
                    inputsArray.push(
                        pushData ( 
                            createBoolCombo(),
                            filterFieldsFunctions (el,"combo")
                        )
                    );
                
                } 
                else if (el.type.includes("integer")) {
                    inputsArray.push(
                        pushData ( 
                            createText ("int"),
                            filterFieldsFunctions (el,"integer")
                        )
                    );
                }
                else{
                    inputsArray.push(
                        pushData ( 
                            createText ("text"),
                            filterFieldsFunctions (el,"text")
                        )
                    );
                }
            });
        } catch (err){ 
            setFunctionError(err,logNameFile,"createFilterElements => generateElements");
        }


        let inpObj = {
            margin:8,
            id:"inputsFilter",
            css:"webix_inputs-table-filter", 
            rows:inputsArray
        };

        function addInputs(){
            try{
                if($$(parentElement)){
                    $$(parentElement).addView(inpObj, viewPosition);
                }
            } catch (err){ 
                setFunctionError(err,logNameFile,"createFilterElements => addInputs");
            }
        }

        enableDelBtn();
        addInputs();

    }

    function showElements(){
        function setFormState(){
            try{
                if($$(parentElement)){
                    $$(parentElement).clear();
                    $$(parentElement).clearValidation();
                }
            } catch (err){ 
                setFunctionError(err,logNameFile,"createFilterElements => setFormState");
            }
        }
        setFormState();
        enableDelBtn();
        showElem($$("inputsFilter"));
    }
    
    if(childsLength == 0 ){
        generateElements();

    } else {
        showElements();
    }
    
}

function filterBtnClick (idTable){
    const filter = $$("filterTableForm");
    
    function filterMinAdaptive(){
        hideElem($$("tableContainer"));
        hideElem($$("tree"));
        showElem($$("table-backTableBtnFilter"));
        
        filter.config.width = window.innerWidth-45;
        filter.resize();
      

    }

    function filterMaxAdaptive(){

        function clearTableSelection(){
            $$(idTable).clearSelection();
        }

        function toolbarBtnLogic(){
            const btnClass = document.querySelector(".webix_btn-filter");
            const primaryBtnClass = "webix-transparent-btn--primary";
            const secondaryBtnClass = "webix-transparent-btn";

            function setPrimaryBtnState(){
                try{
                    btnClass.classList.add(primaryBtnClass);
                    btnClass.classList.remove(secondaryBtnClass);
                } catch (err) {
                    setFunctionError(err,logNameFile,"filterMaxAdaptive => setPrimaryBtnState");
                }
            }

            function setSecondaryBtnState(){   
                try{   
                    btnClass.classList.add(secondaryBtnClass);
                    btnClass.classList.remove(primaryBtnClass);
                } catch (err) {
                    setFunctionError(err,logNameFile,"filterMaxAdaptive => setSecondaryBtnState");
                }
            }

            if(!(btnClass.classList.contains(primaryBtnClass))){
 
                hideElem($$("table-editForm"));
                showElem(filter);
                if(filter.getChildViews() !== 0){
                    createFilterElements("filterTableForm",3);
                }

                setPrimaryBtnState();
                showElem($$("filterTableBarContainer"));
            } else {
                setSecondaryBtnState();
                hideElem($$("filterTableForm"));
                hideElem($$("filterTableBarContainer"));

            }
        }     
    
        clearTableSelection();
        toolbarBtnLogic();
       
    }

    
    filterMaxAdaptive();
    
    if ($$("container").$width < 850){
        hideElem($$("tree"));
        if ($$("container").$width  < 850 ){
            filterMinAdaptive();
        }
    } else {
        hideElem($$("table-backTableBtnFilter"));
        filter.config.width = 350;
        filter.resize();
    }
}


function toolbarFilterBtn(idTable,visible){
    let idBtnEdit = idTable + "-editTableBtnId",
        idFilter  = idTable + "-filterId"
    ;

    const btn = 
    {   view:"button",
        width: 50, 
        type:"icon",
        id:idFilter,
        hidden:visible,
        icon:"icon-filter",
        css:"webix_btn-filter webix-transparent-btn ",
        disabled:true,
        title:"текст",
        height:42,
        click:function(){
            filterBtnClick(idTable,idBtnEdit);
        },
        on: {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Показать/скрыть фильтры");
            }
        } 
    };

    return btn;
}

export {
    toolbarFilterBtn,
    createChildFields
};