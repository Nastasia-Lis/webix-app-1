import {setLogValue} from './logBlock.js';
import {catchErrorTemplate,ajaxErrorTemplate} from "./logBlock.js";

let popupLibData = {};


function tabbarClick (id){
    function btnSubmitState (state){
        try {
            if (state=="enable"){
                if(!($$("popupFilterSubmitBtn").isEnabled())){
                    $$("popupFilterSubmitBtn").enable();
                }
            } else if (state=="disable"){
                if($$("popupFilterSubmitBtn").isEnabled()){
                    $$("popupFilterSubmitBtn").disable();
                }
            }
        } catch (error){
            console.log(error);
            catchErrorTemplate("004-000", error);
        }
    }
    try{
        if (id =="editFormPopupLib"){

            if ($$("filterEditLib").getValue() !== "" ){
                
                btnSubmitState ("enable");
            } else {
                btnSubmitState ("disable");
            }
        }

        if (id =="editFormScroll"){
            let checkboxes = $$("editFormPopup").getValues();
            let counter = 0;
            
            Object.values(checkboxes).forEach(function(el,i){
                if (el){
                    counter++;
                }
            });

            if (counter >0){
                btnSubmitState ("enable");
            } else {
                btnSubmitState ("disable");
            }
        
        }
    } catch (error){
        console.log(error);
        catchErrorTemplate("004-000", error);

    }
}

function popupSubmitBtn (){
    try{
                                                                
        let tabbarValue = $$("filterPopupTabbar").getValue();
        
        
        if (tabbarValue =="editFormPopupLib"){
            webix.message({type:"debug",expire:3000, text:"Библиотека в разработке"});

        } else if (tabbarValue=="editFormScroll"){

            if ($$("filterLibrarySaveBtn")&&!($$("filterLibrarySaveBtn").isEnabled())){
                $$("filterLibrarySaveBtn").enable();
            }
            
            let values = $$("editFormPopup").getValues();
            let btnClass;
            let elementClass;
            let index;
        
            Object.keys(values).forEach(function(el,i){
                index = el.lastIndexOf("_");
                elementClass = el.slice(0,index);
            
                btnClass = document.querySelectorAll(".webix_filter-inputs");
                if (values[el]){
                    
                    if (!($$(el).isVisible())){
            
                        btnClass.forEach(function(elem,i){
                            if (elem.classList.contains(elementClass)){
                              
                                if (!(elem.classList.contains("webix_show-content"))){
                                    elem.classList.add("webix_show-content");
                     
                                }
                                if (elem.classList.contains("webix_hide-content")){
                                    elem.classList.remove("webix_hide-content");
                                
                                }

                            } else {
                                if (!(elem.classList.contains("webix_hide-content"))){
                                    elem.classList.add("webix_hide-content");
                                 
                                }
                            }
                        });
                        
                    
                    
                        $$(el).show();

                        if($$(el+"_container-btns")&&!($$(el+"_container-btns").isVisible())){
                            $$(el+"_container-btns").show();
                        }
                    }

                    $$("resetFilterBtn").enable();

                
                    if ($$("filterEmptyTempalte").isVisible()){
                        $$("filterEmptyTempalte").hide();
                        $$("filterEmptyTempalte").refresh();
                    }

                } else{
                    if ($$(el).isVisible()){
                        btnClass.forEach(function(elem,i){
                            if (elem.classList.contains(elementClass)){
                                if (!(elem.classList.contains("webix_hide-content"))){
                                    elem.classList.add("webix_hide-content");
                                }
                                if (elem.classList.contains("webix_show-content")){
                                    elem.classList.remove("webix_show-content");
                                }
                            }
                        });
                        $$(el).hide();
                    
                    }
                    
                    if($$(el+"_container-btns")&&$$(el+"_container-btns").isVisible()){
                    
                        $$(el+"_container-btns").hide();
                    }
            
                    if($$(el+"_rows")){

                    let countChild = $$(el+"_rows").getChildViews();
                    

                    Object.values(countChild).forEach(function(elem,i){
                        if (elem.config.id.includes("child")){
                            $$(el+"_rows").removeView($$(elem.config.id));
                        }

                    });
                    }
                }
                $$(el).refresh();
            });

            let visibleElements=0;
    
        Object.values($$("filterTableForm").elements).forEach(function(el,i){
                if (!(el.config.hidden)){
                    visibleElements++;
                }
            
        });
        if (!(visibleElements)){
                if (!($$("filterEmptyTempalte").isVisible())){
                    $$("filterEmptyTempalte").show();
                    if($$("btnFilterSubmit").isEnabled()){
                        $$("btnFilterSubmit").disable();
                    }
                    if($$("filterLibrarySaveBtn").isEnabled()){
                        $$("filterLibrarySaveBtn").disable();
                    }
                } 
        }

            $$("popupFilterEdit").destructor();
            setLogValue("success","Рабочая область фильтра обновлена");
        }
    }catch(e){
        $$("popupFilterEdit").destructor();
        setLogValue("error","Ошибка при обновлении фильтров");
    }
}

function editFiltersBtn (){
    webix.ui({
        view:"popup",
        id:"popupFilterEdit",
        css:"webix_popup-filter-container webix_popup-config",
        modal:true,
        escHide:true,
        position:"center",
        height:400,
        width:400,
        body:{
            scroll:"y", rows:[
                {css:"webix_filter-headline-wrapper", cols:[ 
                    {template:"Редактор фильтров", css:"webix_template-recover", borderless:true, height:40 },
                    {width:150},
                    {
                        view:"button",
                        id:"buttonClosePopup",
                        css:"webix_close-btn",
                        type:"icon",
                        hotkey: "esc",
                        width:25,
                        icon: 'wxi-close',
                        click:function(){
                            if ($$("popupFilterEdit")){
                                $$("popupFilterEdit").destructor();
                            }
                           
                        }
                    },
                ]},

                {template:"Выберите нужные поля или шаблон из библиотеки", borderless:true, height:47},
                {
                    view:"form", 
                    id:"editFormPopup",
                    css:"webix_edit-form-popup",
                    borderless:true,
                    elements:[
                        {rows:[ 
                                {
                                    view:"tabbar",  
                                    type:"top", 
                                    id:"filterPopupTabbar",
                                    css:"webix_filter-popup-tabbar",
                                    multiview:true, 
                                    options: [
                                      { value: "<span class='webix_tabbar-filter-headline'>Поля</span>", id: 'editFormScroll' },
                                      { value: "<span class=webix_tabbar-filter-headline'>Библиотека</span>", id: 'editFormPopupLib' },
                                    ],
                                    height:50,
                                    on:{
                                        onAfterTabClick:function(id){
                                            tabbarClick(id);
                                        }
                                    }
                                },
                                
                                {height:200,cells:[
                                    {   
                                        view:"scrollview",
                                        borderless:true, 
                                        css:"webix_multivew-cell",
                                        id:"editFormScroll", 
                                        scroll:"y", 
                                        body:{ 
                                            id:"editFormPopupScroll",
                                            rows:[ ]
                                        }
                          
                                    },

                                    {  
                                        view:"form", 
                                        id:"editFormPopupLib",
                                        css:"webix_multivew-cell",
                                        borderless:true,
                                        elements:[
                                            {   view:"radio", 
                                                id:"filterEditLib",
                                                vertical:true,
                                                options:[
                                                    {"id":"radioNoneContent",disabled:true, "value":"Сохранённых шаблонов нет"},
                                                ],
                                                on:{
                                                    onChange:function(){
                                                        try {
                                                            if (this.getValue()&&$$("popupFilterSubmitBtn")){
                                                                if(!($$("popupFilterSubmitBtn").isEnabled())){
                                                                    $$("popupFilterSubmitBtn").enable();
                                                                }
                                                            }
                                                        } catch (error){
                                                            console.log(error);
                                                            catchErrorTemplate("004-000", error);

                                                        }
                                                    },
                                                
                                                    onAfterRender:function(){
                                                        try {
                                                            if (Object.keys(popupLibData).length>0){
                                                                $$("filterEditLib").addOption(popupLibData);
                                                                $$("filterEditLib").removeOption("radioNoneContent");
                                                            }
                                                        } catch (error){
                                                            console.log(error);
                                                            catchErrorTemplate("004-000", error);

                                                        }
                                                    }
                                                }
                                            }
                                        ],
                                    },
                                ]},
                          
                                {height:20},
                            
                                {   view:"button",
                                    id:"popupFilterSubmitBtn",
                                    height:48,
                                    minWidth:140,
                                    disabled:true, 
                                    css:"webix_primary",
                                    hotkey: "Enter",
                                    value:"Применить", 
                                    on: {
                                        onAfterRender: function () {
                                            this.getInputNode().setAttribute("title","Выбранные фильтры будут добавлены в рабочее поле, остальные скрыты");
                                        },
                                    },
                                    click:popupSubmitBtn
                                },
                        ]},
                        {}

                    ],
                }
            ]
        }
    }).show();


// select option
    let nameList = [
        {cols:[
            {   id:"editFormPopupScrollContent",
                css:"webix_edit-form-popup-scroll-content",
                rows:[
                    {
                        view:"checkbox", 
                        id:"selectAll", 
                        labelRight:"<div style='font-weight:600'>Выбрать всё</div>", 
                        labelWidth:0,
                        name:"selectAll",
                        on:{
                            onChange:function(){
                                try {
                                    if (this.getValue()){
                                        if(!($$("popupFilterSubmitBtn").isEnabled())){
                                            $$("popupFilterSubmitBtn").enable();
                                        }
                                    } else {
                                        if($$("popupFilterSubmitBtn").isEnabled()){
                                            $$("popupFilterSubmitBtn").disable();
                                        }
                                    }
                                    
                                    
                                    let checkboxes = $$("editFormPopupScrollContent").getChildViews();
                                
                                    checkboxes.forEach(function(el,i){
                                        if (el.config.id.includes("checkbox")){

                                            if($$("selectAll").getValue()){
                                                el.config.value = 1;
                                            } else {
                                                el.config.value = 0;
                                            }
                                            $$(el).refresh();
                                        }

                                    });
                                } catch (error){
                                    console.log(error);
                                    catchErrorTemplate("004-000", error);
                                }

                            },
                    
                        } 
                    }
                ]
            }
        ]}
    ];
    
    // all checkboxes template
  
        let formData = [];
        let filterTableElements  = $$("filterTableForm").elements;
    try {
        Object.values(filterTableElements).forEach(function(el,i){
            formData.push({id:el.config.id, label:el.config.label})
        });
    } catch (error){
        console.log(error);
        catchErrorTemplate("004-000", error);

    }

    function checkboxOnChange (el){
        try {
            let parent = $$(el.id+"_checkbox").getParentView();
            let childs = parent.getChildViews();
        
            let counter=0;
            let btnState = 0;
            
            childs.forEach(function(el,i){

                if (el.config.id.includes("checkbox")){
                    if (!(el.config.value)||el.config.value==""){
                        counter++;
                    }
                }

                if (el.config.value){
                    btnState++;
                }
            });

            if (btnState > 0) {
                if(!($$("popupFilterSubmitBtn").isEnabled())){
                    $$("popupFilterSubmitBtn").enable();
                }
            } else {
                if($$("popupFilterSubmitBtn").isEnabled()){
                    $$("popupFilterSubmitBtn").disable();
                }
            }

            if (counter == 0){
                $$("selectAll").config.value = 1;
                $$("selectAll").refresh();
            } else {
                if ($$("selectAll").config.value !== 0){
                    $$("selectAll").config.value = 0;
                    $$("selectAll").refresh();
                }
            }
        } catch (error){
            console.log(error);
            catchErrorTemplate("004-000", error);

        }
    }

    try {
        formData.forEach(function(el,i){
            if(!(el.id.includes("child"))){
                if ($$(el.id)&&$$(el.id).isVisible()){
                    
                    nameList[0].cols[0].rows.push(
                        {
                            view:"checkbox", 
                            id:el.id+"_checkbox", 
                            labelRight:el.label, 
                            labelWidth:0,
                            name:el.id,
                            value:1,
                            on:{
                                onChange:function(){
                                    checkboxOnChange (el); 
                                }
                            } 
                        }
                    );
                
                }else {
                    nameList[0].cols[0].rows.push(
                        {
                            view:"checkbox", 
                            id:el.id+"_checkbox", 
                            labelRight:el.label, 
                            labelWidth:0,
                            name:el.id,
                            on:{
                                onChange:function(){
                                    checkboxOnChange (el);
                                },
                            
                            }
                        }
                    );
                }
                
                
                
            }
        });

        $$("editFormPopupScroll").addView({rows:nameList},1);
    } catch (error){
        console.log(error);
        catchErrorTemplate("004-000", error);

    }

    let counter = 0;
    let checkboxes = $$("editFormPopupScrollContent").getChildViews();
    try{
        checkboxes.forEach(function(el,i){
            if (el.config.id.includes("checkbox")){
                if (!(el.config.value)||el.config.value==""){
                    counter++;
                }
            }
        });

        if (counter == 0){
            $$("selectAll").config.value = 1;
            $$("selectAll").refresh();
        } 
    } catch (error){
        console.log(error);
        catchErrorTemplate("004-000", error);

    }
}

function resetFilterBtn (){
    try {

        let itemTreeId = $$("tree").getSelectedItem().id;

        webix.ajax("/init/default/api/smarts?query="+itemTreeId+".id >= 0"+"&sorts="+itemTreeId+".id&offset=0",{
            success:function(text, data, XmlHttpRequest){
                data = data.json().content;
                
                if (data.length !== 0){
                    $$("table").hideOverlay("Ничего не найдено");
                    $$("table").clearAll()
                    $$("table").parse(data);
                } else {
                    $$("table").clearAll()
                    $$("table").showOverlay("Ничего не найдено");
                }

                let filterCountRows = $$("table").count();
                $$("table-idFilterElements").setValues(filterCountRows.toString());
                setLogValue("success", "Фильтры очищены");
            },
            error:function(text, data, XmlHttpRequest){
                ajaxErrorTemplate("004-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                setLogValue("error","Ошибка очистки фильтров");
            }
        }).catch(error => {
            console.log(error);
            ajaxErrorTemplate("004-000",error.status,error.statusText,error.responseURL);
        });

        
    } catch(e) {
        setLogValue("error", "Ошибка при очищении фильтров");
    }
}

function filterSubmitBtn (){
    
    let values = $$("filterTableForm").getValues();
                             
    let query =[];

    function getOperationVal (value, filterEl,el,condition, position, parentIndex=false){
        let itemTreeId = $$("tree").getSelectedItem().id;
        let operationValue = $$(el+"-btnFilterOperations").config.value;
        try {
            if (position == "parent"){
                if(parentIndex){

                    if (operationValue == "="){
                        query.push("+and+"+itemTreeId+"."+filterEl+"+=+"+value);

                    } else if (operationValue == "!="){
                        query.push("+and+"+itemTreeId+"."+filterEl+"+!=+"+value);

                    } else if (operationValue == "<"){
                        query.push("+and+"+itemTreeId+"."+filterEl+"+<+"+value);

                    } else if (operationValue == ">"){
                        query.push("+and+"+itemTreeId+"."+filterEl+"+>+"+value);

                    } else if (operationValue == "<="){
                        query.push("+and+"+itemTreeId+"."+filterEl+"+<=+"+value);

                    } else if (operationValue == ">="){
                        query.push("+and+"+itemTreeId+"."+filterEl+"+>=+"+value);

                    } else if (operationValue == "⊆"){
                        query.push("+and+"+itemTreeId+"."+filterEl+"+contains+"+value);

                    }

                }else {
                    if (operationValue == "="){
                        query.push(itemTreeId+"."+filterEl+"+=+"+value);

                    } else if (operationValue == "!="){
                        query.push(itemTreeId+"."+filterEl+"+!=+"+value);

                    } else if (operationValue == "<"){
                        query.push(itemTreeId+"."+filterEl+"+<+"+value);

                    } else if (operationValue == ">"){
                        query.push(itemTreeId+"."+filterEl+"+>+"+value);

                    } else if (operationValue == "<="){
                        query.push(itemTreeId+"."+filterEl+"+<=+"+value);

                    } else if (operationValue == ">="){
                        query.push(itemTreeId+"."+filterEl+"+>=+"+value);

                    } else if (operationValue == "⊆"){
                        query.push(itemTreeId+"."+filterEl+"+contains+"+value);

                    }
                }
                
            
            } else if (position == "child") {

                if (operationValue == "="){
                    query.push("+"+condition+"+"+filterEl+"+=+"+value);

                } else if (operationValue == "!="){
                    query.push("+"+condition+"+"+filterEl+"+!=+"+value);

                }  else if (operationValue == "<"){
                    query.push("+"+condition+"+"+filterEl+"+<+"+value);

                } else if (operationValue == ">"){
                    query.push("+"+condition+"+"+filterEl+"+>+"+value);

                } else if (operationValue == ">="){
                    query.push("+"+condition+"+"+filterEl+"+>=+"+value);

                } else if (operationValue == "<="){
                    query.push("+"+condition+"+"+filterEl+"+<=+"+value);

                } else if (operationValue == "⊆"){
                    query.push("+"+condition+"+"+filterEl+"+contains+"+value);

                }
            }
        } catch (error){
            console.log(error);
            catchErrorTemplate("004-000", error);
        }
    }


    if ($$("filterTableForm").validate()){
        let filterEl;
        let postFormatData = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
        let value;
        try{
            Object.keys(values).sort().forEach(function(el,i){
                filterEl = el;
            
                value = values[el];
                if (value){

                    if ($$(el).config.view=="datepicker"){
                        value = postFormatData(values[el]);
                    }
            
                    if ($$(el).config.text && $$(el).config.text == "Нет"){
                        value = 0;
                    }
        
                    if (el.includes("filter")&&!(el.includes("condition"))){
                        filterEl = el.lastIndexOf("_");
                        filterEl = el.slice(0,filterEl)
                    }

                    if(!(el.includes("condition"))&&values[el]!==""&&el!=="selectAll"&&!(el.includes("child"))){

                        if (i > 0){
                            getOperationVal (value,filterEl,el,"and","parent",true);
                        }else {
                            getOperationVal (value,filterEl,el,"and","parent");
                        }
                        
                    } else if (el.includes("child")){
                        if (el.includes("operAnd")){
                            getOperationVal (value,filterEl,el,"and","child");

                        } else if (el.includes("operOr")){
                            getOperationVal (value,filterEl,el,"or","child");
                        }
                    
                    }
                }

            });
        } catch (error){
            console.log(error);
            catchErrorTemplate("004-000", error);
        }
 

        webix.ajax("/init/default/api/smarts?query="+query.join(""),{
            success:function(text, data, XmlHttpRequest){
                let notifyType = data.json().err_type;
                let notifyMsg = data.json().err;
                data = data.json().content;
                
                if (data.length !== 0){
                    $$("table").hideOverlay("Ничего не найдено");
                    $$("table").clearAll()
                    $$("table").parse(data);
                } else {
                    $$("table").clearAll()
                    $$("table").showOverlay("Ничего не найдено");
                }

                let filterCountRows = $$("table").count();
                $$("table-idFilterElements").setValues(filterCountRows.toString());
        
                if (notifyType == "i"){
                    setLogValue("success","Фильтры успшено применены");
                } else if (notifyType == "e"){
                    setLogValue("error",notifyMsg);
                } else if (notifyType == "x"){
                    setLogValue("error","Ошибка фильтрации данных");
                }
                
            },
            error:function(text, data, XmlHttpRequest){
                ajaxErrorTemplate("003-011",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
            }
        }).catch(error => {
            console.log(error);
            ajaxErrorTemplate("003-011",error.status,error.statusText,error.responseURL);
        });
    } else {
        setLogValue("error","Не все поля формы заполнены");
    }
  

}

function filterLibraryBtn (){
    try {
        webix.prompt({
            title: "Название шаблона",
            ok: "Сохранить",
            cancel: "Отменить",
            css:"webix_prompt-filter-lib",
            input: {
            required:true,
            placeholder:"Введите название шаблона...",
            },
            width:350,
        }).then(function(result){
            let nameTemplate = result;
            let filterElements = $$("filterTableForm").elements;
            let filterTemplate = [];
            Object.values(filterElements).forEach(function(el,i){
                if ($$(el.config.id).isVisible()){
                    filterTemplate.push(el); // сохранить куда то массив с элементами
                }
            });

            popupLibData = {id:webix.uid(), value:nameTemplate}
            webix.message({type:"success",expire:1000, text:"Шаблон"+" «"+nameTemplate+"» "+" сохранён в библиотеку"});


        }).fail(function(){
        

        });

            
            
    } catch(error) {
        console.log(error);
        setLogValue("error", "Не удалось сохранить шаблон");
        catchErrorTemplate("004-001", error); 
    }
}


let filterForm;
try {

    filterForm =  {   
        view:"form", 
        hidden:true,
        id:"filterTableForm",
        minHeight:350,
        minWidth:210,
        width: 320,
        scroll:true,
        elements:[
            {   id:"form-adaptive",
                minHeight:48,
                css:"webix_form-adaptive",
                margin:5,
                rows:[
                    {   margin:5, 
                        rows:[
                        {   responsive:"form-adaptive",  
                            margin:5, 
                            cols:[
                                {   view:"button",
                                    value:"Редактор фильтров",
                                    height:48,
                                    minWidth:140, 
                                    click:editFiltersBtn,
                                    on: {
                                        onAfterRender: function () {
                                            this.getInputNode().setAttribute("title","Добавить/удалить фильтры");
                                        },
                                    },
                                },
                                {   view:"button",
                                    id:"resetFilterBtn",
                                    disabled:true,
                                    height:48,
                                    minWidth:50,
                                    width:65,
                                    hotkey: "shift+esc",
                                    css:"webix_danger", 
                                    type:"icon", 
                                    icon:"wxi-trash", 
                                    click:resetFilterBtn,
                                    on: {
                                        onAfterRender: function () {
                                            this.getInputNode().setAttribute("title", "Сбросить фильтры");
                                        }
                                    } 
                                },
                            ],
                        },
                        ]
                    },

                    {   id:"btns-adaptive",
                        css:{"margin-top":"5px!important"},
                        
                        rows:[
                            {   responsive:"btns-adaptive", 
                                margin:5, 
                                cols:[
                                    {   view:"button",
                                        id:"btnFilterSubmit",
                                        height:48,
                                        minWidth:70, 
                                        css:"webix_primary",
                                        hotkey: "Enter",
                                        disabled:true,
                                        value:"Применить фильтры", 
                                        click:filterSubmitBtn,
                                    
                                    },
                                    {   view:"button",
                                        id:"filterLibrarySaveBtn",
                                        disabled:true,
                                        height:48,
                                        minWidth:50,
                                        width:65,
                                        hotkey: "shift+esc",
                                        type:"icon", 
                                        icon:"wxi-file", 
                                        click:filterLibraryBtn,
                                        on: {
                                            onAfterRender: function () {
                                                this.getInputNode().setAttribute("title", "Сохранить шаблон с полями в библиотеку");
                                            }
                                        } 
                                    },
                            
                                ]
                            },
                            {height:10},

                            {   id:"filterEmptyTempalte",
                                template:"<div style='color:#858585;font-size:13px!important'>Добавьте фильтры из редактора</div>", 
                                borderless:true
                            }
                        ]
                    }
                ]
            },
        ],
        rules:{
            $all:webix.rules.isNotEmpty
        },


        ready:function(){
            this.validate();
        },

    };
}catch(error){
    console.log(error);
    catchErrorTemplate("004-003", error);
}

export{
    filterForm
};