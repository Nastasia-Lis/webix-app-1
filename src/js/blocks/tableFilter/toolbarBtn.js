import {hideElem,showElem,getComboOptions} from "../commonFunctions.js";
import {setAjaxError,setFunctionError} from "../errors.js";
import {setLogValue} from "../logBlock.js";


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
     
        let labelType;
        if (operation == "operOr"){
            labelType = " + или";
        } else {
            labelType = " + и";
        }
        const elemId        = getElemId ();
        const containerRows = $$(elemId+"_filter"+"_rows");
        countChild          = containerRows.getChildViews().length;

        const fieldId       = elemId+"_filter-child-"+operation+"-"+countChild;
        const fieldTemplate = {
            id    : fieldId, 
            name  : fieldId,
            label : el.label + `<span style='font-size: 12px !important; color:var(--primary)'>  ${labelType}</span>`,
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

function showEmptyTemplate(){
                     
    const inputs = $$("inputsFilter");
    if ( inputs.$height == 46){
        showElem($$("filterEmptyTempalte"));
    }

}

function filterOperationsBtnData (typeField){
    return webix.once(function(){
        if (typeField == "combo" || typeField == "boolean" ){

            this.add( { value: '=',       id:"operations_eql"      });
            this.add( { value: '!=',      id:"operations_notEqual" });

        } else if (typeField  == "text" ){

            this.add( { value: '=',       id:"operations_eql"      });
            this.add( { value: '!=',      id:"operations_notEqual" });
            this.add( { value: 'содержит',id:"operations_contains" });

        } else if (typeField  == "date"){

            this.add( { value: '=',       id:"operations_eql"      });
            this.add( { value: '!=',      id:"operations_notEqual" });
            this.add( { value: '<',       id:"operations_less"     });
            this.add( { value: '>',       id:"operations_more"     });
            this.add( { value: '>=',      id:"operations_mrEqual"  });
            this.add( { value: '<=',      id:"operations_lsEqual"  });

        } else if (typeField  == "integer"   ){

            this.add( { value: '=',       id:"operations_eql"      });
            this.add( { value: '!=',      id:"operations_notEqual" });
            this.add( { value: '<',       id:"operations_less"     });
            this.add( { value: '>',       id:"operations_more"     });
            this.add( { value: '>=',      id:"operations_mrEqual"  });
            this.add( { value: '<=',      id:"operations_lsEqual"  });
            this.add( { value: 'содержит',id:"operations_contains" });

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


    const contextBtn = {   
        view:"button",
        id:el.id+"_contextMenuFilter",
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
                    submenu:[      
                        { id:"add_and", value: 'и'  },
                        { id:"add_or" , value: 'или'},
                    ]},
                {id:"remove", value:"Удалить поле", icon: "icon-trash"}
            ],
            on:{
                onMenuItemClick:function(id, e, node){
         
                    function popupSuccess(idBtnDel){

        
                        const container          = idBtnDel          .getParentView();
                    
                        const parentContainer    = container         .getParentView();
                        const mainInput          = parentContainer   .getChildViews();

                        const allInputsContainer = parentContainer   .getParentView();
                        const allInputs          = allInputsContainer.getChildViews();
              
             
                        function hideMainInput(){
                            try{
                                mainInput.forEach(function(el){
                                    const id = el.config.id;
             
                                    hideElem(el);
                                    
                                    if ( !(id.includes( "_container-btns" )) ){
                                        el.setValue("");


                                   //     hideHtmlContainer( id + "_rows" );
  
                                    }
                                });
                            }catch(err){ 
                                setFunctionError(err,logNameFile,"contextBtn remove => hideMainInput");
                            }
                        }


                        function setFirstChildAttr(){
                           
                            const firstContainer  = allInputs[1]  .getChildViews()[0];
                 
                            const firstChildInput = firstContainer.getChildViews()[0];
                            
                            if (firstChildInput){
                                firstChildInput.config.firstAttr = true;
                            }

                        }

          
                        hideMainInput();
                        showEmptyTemplate();
                        setFirstChildAttr();
                        setLogValue("success","Поле удалено"); 
                     
                    }

                    if ( id == "add_and" || id == "add_or" ){
                        createChildFields (id,el);
                        
                    } else if (id.includes("remove")){
                        const idBtnDel = $$(this.config.master);

                        popupExec("Поле фильтра будет удалено").then(
                            function(){
                                popupSuccess(idBtnDel);
                                
                            }
                        );
                    }

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
        css:{"margin-top":"27px!important"},
        hidden:true, 
        cols:[
            btnOperation,
           // btnAdd,
           // btnDel
           contextBtn
        ]
    };

    return btns;       
}

function createChildFields (id,el,position) {
 
    const elemId        = el.id;
    const containerRows = $$(elemId+"_filter"+"_rows");
    const countChild    = containerRows.getChildViews().length;

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

  
    function createAndInput(){
      
        const headline = {   
            id:"and_"+webix.uid(),
            template:`<span style='font-size: 12px !important;'>${el.label}</span> <span style='font-size: 12px !important; color:var(--primary)'>  + и</span>`,
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



        const contextBtn = {   
            view:"button",
            id:btnsId+"_contextMenuFilter",
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
                        submenu:[      
                            { id:"add_and", value: 'и'  },
                            { id:"add_or" , value: 'или'},
                        ]},
                    {id:"remove", value:"Удалить поле", icon: "icon-trash"}
                ],
                on:{
                    onMenuItemClick:function(id, e, node){
    
                    
                        const contextBtn     = $$(this.config.master);
                        const btnContainer   = contextBtn.getParentView     ();
                        const inputContainer = btnContainer.getParentView   ();
                        const childContainer = inputContainer.getParentView ();
                        const container      = $$(el.id+"_filter_rows");
                        
             
                        function popupSuccess(){
                        
                            container.removeView(childContainer);
                            showEmptyTemplate();
                            setLogValue("success","Поле удалено"); 
                    
                        }
    
                        if ( id == "add_and" || id == "add_or" ){
                            const currChildId    = childContainer.config.id;
                            const allInputs      = container.getChildViews();

                            let childPosition    = 0;
             
                            allInputs.forEach(function(inp,i){
                                const inputId     = inp.config.id;
                   

                                if ( inputId == currChildId ){
                                    childPosition = i+1;
                                }
                            
                            });

                            createChildFields (id,el,childPosition);

                        } else if (id.includes("remove")){

                            popupExec("Поле фильтра будет удалено").then(
                                function(res){
                      
                                    if(res){
                                        popupSuccess();
                                    }
                              
                                    
                                }
                            );
                        }
                    
    
            
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
            id:elemId+"_filter_container-btns"+countChild,
            css:{"margin-top":"22px!important"},
            cols:[
                btnOperations,
                contextBtn
               // btnDel
            ]
        };



        function addInput(){

            try{ 
 
                containerRows.addView(
                    {   id:elemId+"_filter-container-child-operAnd-"+countChild, 
                        padding:5,
                        positionElem:position,
                        rows:[
                          //  headline,
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
                    },position
        
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
            template:`<span style='font-size: 12px !important;'>${el.label}</span> <span style='font-size: 12px !important; color:var(--primary)'>  + или</span>`,
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
        const contextBtn = {   
            view:"button",
            id:btnsId+"_contextMenuFilter",
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
                        submenu:[      
                            { id:"add_and", value: 'и'  },
                            { id:"add_or" , value: 'или'},
                        ]},
                    {id:"remove", value:"Удалить поле", icon: "icon-trash"}
                ],
                on:{
                    onMenuItemClick:function(id, e, node){
    
                    
                        const contextBtn     = $$(this.config.master);
                        const btnContainer   = contextBtn.getParentView     ();
                        const inputContainer = btnContainer.getParentView   ();
                        const childContainer = inputContainer.getParentView ();
                        const container      = $$(el.id+"_filter_rows");
                    
                     
             
                        function popupSuccess(){
                        
                            container.removeView(childContainer);
                            showEmptyTemplate();
                            setLogValue("success","Поле удалено"); 
                    
                        }
    
                        if ( id == "add_and" || id == "add_or" ){
                            const currChildId    = childContainer.config.id;
                            const allInputs      = container.getChildViews();

                            let childPosition    = 0;
             
                            allInputs.forEach(function(inp,i){
                                const inputId     = inp.config.id;
                   

                                if ( inputId == currChildId ){
                                    childPosition = i+1;
                                }
                            
                            });

                            createChildFields (id,el,childPosition);

                        } else if (id.includes("remove")){

                            popupExec("Поле фильтра будет удалено").then(
                                function(res){
                      
                                    if(res){
                                        popupSuccess();
                                    }
                              
                                    
                                }
                            );
                        }
                    
    
            
                    },
                 
                }
            },
    
            on:{
                onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Другие операции");
                },
            }
      
        };


        const btns =  {
            id:elemId+"_filter_container-btns"+countChild,
            css:{"margin-top":"22px!important"},
            cols:[
                btnOperation,
                contextBtn
            ]
        };
 
        containerRows.addView(
            {   id:elemId+"_filter-container-child-operOr-"+countChild,
                padding:5,
                positionElem:position,
                rows:[
                  //  headline,
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
            ]},position
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
        const columnsData = $$("table").getColumns(true);
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
                                    btns,
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
        hotkey:"ctrl+shift+f",
        height:42,
        click:function(){
            filterBtnClick(idTable,idBtnEdit);
        },
        on: {
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