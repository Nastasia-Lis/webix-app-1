import { hideElem,showElem,getComboOptions }    from "../commonFunctions.js";
import { setFunctionError }                     from "../errors.js";
import { setLogValue }                          from "../logBlock.js";

import { popupExec }                            from "../notifications.js";

import { addClass, removeClass, visibleInputs } from "./common.js";

const logNameFile = "tableFilter => toolbar";


function field (operation,uniqueId,typeField,el){
 
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

        const fieldId       = elemId+"_filter-child-"+operation+"-"+uniqueId;
        const fieldTemplate = {
            id        : fieldId, 
            name      : fieldId,
            label     : el.label,
            columnName: elemId,
            labelPosition:"top",
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

        if (id === "eql"){
            btnFilterOperations.setValue("=");
            
        } else if (id === "notEqual"){
            btnFilterOperations.setValue("!=");

        } else if (id.includes("less")){
            btnFilterOperations.setValue("<");

        } else if (id  === "more"){
            btnFilterOperations.setValue(">");

        } else if (id === "mrEqual"){
            btnFilterOperations.setValue(">=");

        } else if (id === "lsEqual"){
            btnFilterOperations.setValue("<=");

        } else if (id === "contains"){
            btnFilterOperations.setValue("⊆");

        }
    } catch (err){
        setFunctionError(err,logNameFile,"filterOperationsBtnLogic");
    }

}

function showEmptyTemplate(){
                     
    const inputs = $$("inputsFilter");
    if ( inputs.$height == 46){
        showElem($$("filterEmptyTempalte"));
    }

}


function filterOperationsBtnData (typeField){

    function addOperation (self, value, id){
        self.add( { 
            value: value,       
            id   : id      
        });
    }

    function addDefaultOperations(self){
        addOperation (self, '='       , "eql"     );
        addOperation (self, '!='      , "notEqual");
        
    }

    function addMoreLessOperations(self){
        addOperation (self, '< ' , "less"    );
        addOperation (self, '> ' , "more"    );
        addOperation (self, '>=' , "mrEqual" );
        addOperation (self, '<=' , "lsEqual" );  
    }

    return webix.once(function(){

        if (typeField == "combo" || typeField == "boolean" ){
            addDefaultOperations(this);
        } else if (typeField  == "text" ){
            addDefaultOperations(this);
            addOperation (this, "содержит", "contains");
        } else if (typeField  == "date"){

            addDefaultOperations  (this);
            addMoreLessOperations (this);

        } else if (typeField  == "integer"   ){

            addDefaultOperations  (this);
            addMoreLessOperations (this);
            addOperation (this, "содержит", "contains");

        }   
    });
}

function removeInStorage(el,thisInput){
    visibleInputs[el.id].forEach(function(id,i){
        if (id == thisInput){
            visibleInputs[el.id].splice(i, 1);
        }
    });

}



function hideHtmlEl(id){
    const idContainer = $$(id+"_filter_rows");
    const showClass = "webix_show-content";
    const hideClass = "webix_hide-content";

    const childs = idContainer.getChildViews();

    if (childs.length == 1){
        const div = idContainer.getNode();
       
        removeClass (div, showClass);
        addClass    (div, hideClass);

    }

}


function hideNextSegmentBtn(){

    const values =  Object.values(visibleInputs);

    let check    = false;
    let nextInput;

    values.forEach(function(value,i){
  
        if (value.length && !check){
            nextInput = value[0];
            check     = true;
        }

        if ( !value.length ){
            const id = Object.keys(visibleInputs)[i];
            hideHtmlEl(id);
        }

    });


    const segmentBtn = $$(nextInput + "_segmentBtn");
    hideElem(segmentBtn);
}

function clickContextBtnParent (id,el){

    const thisInput = el.id + "_filter";
                 
    function removeInput(){

        const container     = $$(thisInput).getParentView();
        const mainInput     = container    .getChildViews();
      

       
        function hideMainInput(){
            const btnOperations = $$(thisInput + "-btnFilterOperations");
            const segmentBtn    = $$(thisInput + "_segmentBtn");
            try{
                mainInput.forEach(function(el){
                    hideElem(el);
                });


                btnOperations.setValue(" = ");
                hideElem(segmentBtn);
            } catch(err){ 
                setFunctionError(err,logNameFile,"contextBtn remove => hideMainInput");
            }
        }

        hideMainInput       ();
     //   hideHtmlEl          (thisInput);
        removeInStorage     (el, thisInput);
        showEmptyTemplate   ();
        hideNextSegmentBtn  ();
        setLogValue         ("success","Поле удалено"); 

    }

    if ( id === "add" ){
        createChildFields (id,el);
        
    } else if (id === "remove"){

        popupExec("Поле фильтра будет удалено").then(
            function(){
                removeInput();
                
            }
        );
    }
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


    const contextBtn = {   
        view:"button",
        id:el.id+"_filter_contextMenuFilter",
        type:"icon",
        css:"webix_filterBtns",
        icon: 'wxi-dots',
        inputHeight : 38,
        width       : 40,
        popup: {
            view: 'contextmenu',
            css:"webix_contextmenu",
            data: [
                {   id:"add",   
                    value:"Добавить поле", 
                    icon: "icon-plus",
                    },
                {id:"remove", value:"Удалить поле", icon: "icon-trash"}
            ],
            on:{
                onMenuItemClick:function(id){
                    clickContextBtnParent(id,el);
                },
             
            }
        },

        on:{
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Другие операции");
            },
        }
  
    };

    const btns = {
        id:el.id+"_filter_container-btns",
        css:{"margin-top":"22px!important"},
        hidden:true, 
        cols:[
            btnOperation,
            contextBtn
        ]
    };

    return btns;       
}

function clickContextBtnChild(id, el, thisElem){

    function returnThisInput(){
        const master    = thisElem.config.master;
        const index     = master.indexOf("_contextMenuFilter");
        const thisInput = master.slice(0,index);

        return thisInput;
    }

    const thisInput     = returnThisInput();
    const thisContainer = thisInput + "-container";
    
 

    function addChild(){
        const parentInput  = $$(el.id+"_filter");
        let childPosition  = 0;

        visibleInputs[el.id].forEach(function(input,i){

            const inputContainer = input + "-container";
            if (inputContainer === thisContainer){
                childPosition = i + 1;
            }
        });

        if ( !(parentInput.isVisible()) ){
            childPosition++;
        }

        createChildFields (id,el,childPosition);

    }

    function removeContainer(){
   
        const parent = $$(thisContainer).getParentView();
        
        parent.removeView($$(thisContainer));
    } 

    function isFirstInput(){
        let check = false;

        visibleInputs[el.id].forEach(function(input,i){
            if (input === thisInput && i === 0){
                check = true;
            }
        });

        return check;
    }

    function removeInput(){
        const isFirst = isFirstInput();
        removeInStorage(el, thisInput);

        removeContainer();

        if (isFirst){
            hideNextSegmentBtn();
        }
        showEmptyTemplate();
        setLogValue("success","Поле удалено"); 

    }

    if ( id == "add" ){

        addChild();
     
    } else if (id === "remove"){
     
        popupExec("Поле фильтра будет удалено").then(
            function(res){
  
                if(res){
                    removeInput();
                }

            }
        );
    }
}


function createChildFields (id,el,position) {
 
    const elemId        = el.id;
    const containerRows = $$(elemId + "_filter" + "_rows");
    const uniqueId      = webix.uid();
 
    if (position == undefined){
        position = 1;
    }

    let typeField;

    function getTypeField(){
        if (el.type !== "boolean"){
            typeField     = el.editor;
        } else {
            typeField     = "boolean";
        }
    }
    getTypeField();

    function returnButtonOperation(btnsId){
        
        const idBtnOperation = btnsId+"-btnFilterOperations";
        
        return {
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
    }

    function returnContextButton(btnsId){
        const idContextMenu = btnsId+"_contextMenuFilter";
        return {   
            view:"button",
            id:idContextMenu,
            type:"icon",
            css:"webix_filterBtns",
            icon: 'wxi-dots',
            inputHeight : 38,
            width       : 40,
            popup: {
                view: 'contextmenu',
                css:"webix_contextmenu",
                data: [
                    {   id:"add",   
                        value:"Добавить поле", 
                        icon: "icon-plus",
                        },
                    {id:"remove", value:"Удалить поле", icon: "icon-trash"}
                ],
                on:{
                    onMenuItemClick:function(id, e, node){
                        clickContextBtnChild(id,el,this);
                    },
                 
                }
            },
    
            on:{
                onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Другие операции");
                },
            }
      
        }
    }

    function returnLogicBtn(btnsId){
        return {
            view    : "segmented", 
            id      : btnsId+"_segmentBtn",
            value   : 1, 
            options : [
                { "id":"1", "value":"и" }, 
                { "id":"2", "value":"или" }, 
            ]
        };
    }

    function createBtns(btnsId){
        return {
            id:elemId+"_filter_container-btns"+uniqueId,
            css:{"margin-top":"22px!important"},
            cols:[
                returnButtonOperation(btnsId),
                returnContextButton  (btnsId)
            ]
        };
    }


    function addInput(operation){
        let operationsIdPart;

        if (operation == "operAnd"){
            operationsIdPart = "-operAnd-";
        } else {
            operationsIdPart = "-operOr-";
        }

       // const idContainer = elemId + "_filter-container-child" + operationsIdPart + uniqueId;
        const idContainer = elemId + "_filter-child" + operationsIdPart + uniqueId + "-container";
        const btnsId      = elemId + "_filter-child" + operationsIdPart + uniqueId;

        const input      = field (operation ,uniqueId, typeField, el);

        visibleInputs[elemId].splice(position, 0, input.id);

        

        containerRows.addView(
            {   id:idContainer,
                padding:5,
                positionElem:position,
                rows:[
                    {   id:webix.uid(),
                        rows:[
                            returnLogicBtn(btnsId),
                            {cols:[
                                input,
                                createBtns(btnsId)
                            ]},
                           
                        ]
                    }
            ]},position
        );

    }
    addInput("operAnd");
    // if(id.includes("and")){
    //     addInput("operAnd");
        
    // } else if(id.includes("or")){
    //     addInput("operOr");
    // }
 
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
        const columnsData = $$("table").getColumns(true);
        let inputsArray   = [];
        try{
            columnsData.forEach((el,i) => {
         
                const inputTemplate = { 
                    id              :el.id+"_filter",
                    name            :el.id+"_filter", 
                    hidden          :true,
                    label           :el.label, 
                    labelPosition   :"top",
                    columnName      : el.id,
                    on:{
                        onItemClick:function(){
                            $$(parentElement).clearValidation();
                            $$("btnFilterSubmit").enable();
                        }
                    }
                };

                const logicBtn = {
                    view    : "segmented", 
                    id      : el.id + "_filter_segmentBtn",
                    hidden  : true,
                    value   : 1, 
                    options : [
                        { "id":"1", "value":"и" }, 
                        { "id":"2", "value":"или" }, 
                    ]
                };

                const idContainerRows = el.id + "_filter"+"_rows";
                const idContainer     = el.id + "_filter-container";
                const cssContainer    = el.id + " webix_filter-inputs";
     
                function pushData (element, btns){
                    const data  =  {   
                        id:idContainerRows,
                        css:cssContainer,
                        rows:[
                            {   id:idContainer,
                                padding:5,
                                rows:[
                                    logicBtn,
                                    { cols:[
                                        element,
                                        btns,
                                    ]},
                                   
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
                            filterFieldsFunctions (el,"integer"),
                         
                        )
                    );
                }
                else{

                    inputsArray.push(
                        pushData ( 
                            createText ("text"),
                            filterFieldsFunctions (el,"text"),
                   
                        )
                    );
                }

            });
        } catch (err){ 
            setFunctionError(err,logNameFile,"createFilterElements => generateElements");
        }


        const inpObj = {
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

    function resizeContainer(width){
        const filterContainer = $$("filterTableBarContainer");
  
        filterContainer.config.width = width;
        filterContainer.resize();
    }
    function filterMinAdaptive(){

        hideElem($$("tableContainer"));
        hideElem($$("tree"));
        showElem($$("table-backTableBtnFilter"));
        resizeContainer(window.innerWidth-45);
      

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
        resizeContainer(350);
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
    {   view    : "button",
        width   : 50, 
        type    : "icon",
        id      : idFilter,
        hidden  : visible,
        icon    : "icon-filter",
        css     : "webix_btn-filter webix-transparent-btn ",
        disabled: true,
        title   : "текст",
        hotkey  : "ctrl+shift+f",
        height  : 42,
        click   : function(){
            filterBtnClick(idTable,idBtnEdit);
        },
        on      : {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Показать/скрыть фильтры (Ctrl+Shift+F)");
            }
        } 
    };

    return btn;
}

export {
    toolbarFilterBtn,
    createChildFields
};