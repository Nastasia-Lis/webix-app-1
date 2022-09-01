import { notify } from "./editTableForm.js";
import { tableId,filterElementsId } from './setId.js';
import { itemTreeId } from "./sidebar.js";



const filterForm =  {   
    view:"form", 
    hidden:true,
    id:"filterTableForm",
    minHeight:350,
    minWidth:210,
    width: 320,
    scroll:true,
    elements:[
        {id:"form-adaptive",minHeight:48,css:"webix_form-adaptive", margin:5, rows:[{margin:5, rows:[
            {responsive:"form-adaptive",  margin:5, 
                cols:[
                    {   view:"button",
                        value:"Редактор фильтров",
                        height:48,
                        minWidth:140, 
                        click:function(){
                            
                            webix.ui({
                                view:"popup",
                                id:"popupFilterEdit",
                                css:"webix_popup-filter-container",
                                modal:true,
                                escHide:true,
                                position:"center",
                                height:400,
                                width:400,
                                body:{
                                    scroll:"y", rows:[
                                        {cols:[ 
                                            {template:"Редактор фильтров", css:"webix_template-recover", borderless:true, height:40 },
                                            {},
                                            {
                                                view:"button",
                                                id:"buttonClosePopup",
                                                css:"webix_close-btn",
                                                type:"icon",
                                                hotkey: "esc",
                                                width:25,
                                                icon: 'wxi-close',
                                                click:function(){
                                                    $$("popupFilterEdit").hide();
                                                }
                                            },
                                        ]},

                                        {template:"Выберите нужные поля для работы с фильтрами", borderless:true, height:40},
                                        {
                                            view:"form", 
                                            id:"editFormPopup",
                                            css:{"margin-top": "-15px!important"},
                                            borderless:true,
                                            elements:[
                                                {rows:[ 
                                             

                                                        {
                                                            view:"tabbar",  
                                                            type:"top", 
                                                            multiview:true, 
                                                            options: [
                                                              { value: "<span class='webix_icon fas fa-film'></span><span style='padding-left: 4px'>List</span>", id: 'editFormScroll' },
                                                              { value: "<span class='webix_icon fas fa-comments'></span><span style='padding-left: 4px'>Form</span>", id: 'filterEditLib' },
                                                            ],
                                                            height:50,
                                                            on:{
                                                                onAfterTabClick:function(id){
                                                                    //console.log(id);
                                                                    if (id =="editFormScroll"){
                                                                        console.log($$("inputsTable").getChildViews())
                                                                        let checkboes = $$("inputsTable").getChildViews();
                                                                        checkboes.forEach(function(el,i){
                                                                            let container = $$(el).getChildViews();
                                                                            container.forEach(function(elem,i){
                                                                                
                                                                                let elements = elem.getChildViews();

                                                                                elements.forEach(function(checks){

                                                                                    if (!(checks.config.id.includes("btns"))){
                                                                                        console.log($$(checks.config.id).getValue())
                                                                                    }
                                                                                });
                                                                               // let idCheckbox = elements[0].config.id;
                                                                                //let valueCheckbox = $$(idCheckbox).getValue()
                                                                                //console.log(idCheckbox,valueCheckbox)
                                                                            });
                                                                            //console.log($$("registration_key_container").getChildViews())
                                                                            //console.log(el.config.id)
                                                                        });
                                                                    }
                                                                    
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
                                                                //height:200,
                                                                body:{ 
                                                                    id:"editFormPopupScroll",rows:[ ]
                                                                }
                                                  
                                                            },

                                                            {  
                                                                view:"radio", 
                                                                id:"filterEditLib",
                                                                css:"webix_multivew-cell",
                                                                options:[
                                                                    {"id":1, "value":"Master"},
                                                                    {"id":2, "value":"Branch"}
                                                                ]
                                                                
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
                                                        click:function(){
                                                            try{

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
                                        
                                                                $$("popupFilterEdit").hide();
                                                                notify ("success","Рабочая область фильтра обновлена",true);

                                                            }catch(e){
                                                                $$("popupFilterEdit").hide();
                                                                notify ("error","Ошибка при обновлении фильтров",true);
                                                            }

                                                        }
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
                                    {id:"editFormPopupScrollContent",rows:[
                                        {
                                            view:"checkbox", 
                                            id:"selectAll", 
                                            labelRight:"<div style='font-weight:600'>Выбрать всё</div>", 
                                            labelWidth:0,
                                            name:"selectAll",
                                            on:{
                                                onChange:function(){
                                                    if(!($$("popupFilterSubmitBtn").isEnabled())){
                                                        $$("popupFilterSubmitBtn").enable();
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

                                                },
                                        
                                            } 
                                        }
                                    ]}
                                ]}
                            ];
                            

                            // all checkboxes template
                            let formData = [];
                            let filterTableElements  = $$("filterTableForm").elements;

                            Object.values(filterTableElements).forEach(function(el,i){
                                formData.push({id:el.config.id, label:el.config.label})
                            });

                            function checkboxOnChange (el){
                                if(!($$("popupFilterSubmitBtn").isEnabled())){
                                    $$("popupFilterSubmitBtn").enable();
                                }
                                let parent = $$(el.id+"_checkbox").getParentView();
                                let childs = parent.getChildViews();
                            
                                let counter=0;
                                childs.forEach(function(el,i){

                                    if (el.config.id.includes("checkbox")){
                                        if (!(el.config.value)||el.config.value==""){
                                            counter++;
                                        }
                                    }
                                });

                                if (counter == 0){
                                    $$("selectAll").config.value = 1;
                                    $$("selectAll").refresh();
                                } else {
                                    if ($$("selectAll").config.value !== 0){
                                        $$("selectAll").config.value = 0;
                                        $$("selectAll").refresh();
                                    }
                                }
                            }

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
                                                    }
                                                }
                                            }
                                        );
                                    }
                                    
                                    
                                    
                                }
                            });
                            $$("editFormPopupScroll").addView({rows:nameList},1);

                            let counter = 0;
                            let checkboxes = $$("editFormPopupScrollContent").getChildViews();
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
                                                
                        },
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
                        click:function(){
                            try {

                                webix.ajax("/init/default/api/smarts?query="+itemTreeId+".id >= 0"+"&sorts="+itemTreeId+".id&offset=0",{
                                    success:function(text, data, XmlHttpRequest){
                                        data = data.json().content;
                                        
                                        if (data.length !== 0){
                                            $$(tableId).hideOverlay("Ничего не найдено");
                                            $$(tableId).clearAll()
                                            $$(tableId).parse(data);
                                        } else {
                                            $$(tableId).clearAll()
                                            $$(tableId).showOverlay("Ничего не найдено");
                                        }

                                        let filterCountRows = $$(tableId).count();
                                        $$(filterElementsId).setValues(filterCountRows.toString());
                                        notify ("success", "Фильтры очищены", true);
                                    },
                                    error:function(text, data, XmlHttpRequest){
                                        notify ("error","Ошибка очистки фильтров",true);
                                    }
                                });

                                
                            } catch(e) {
                                notify ("error", "Ошибка при очищении фильтров", true); 
                            }
                        },
                        on: {
                            onAfterRender: function () {
                                this.getInputNode().setAttribute("title", "Сбросить фильтры");
                            }
                        } 
                    },
                ],
            },
        ]},
            {css:{"margin-top":"5px!important"},id:"btns-adaptive",rows:[
                {responsive:"btns-adaptive", margin:5, cols:[
                    {   view:"button",
                            id:"btnFilterSubmit",
                            height:48,
                            minWidth:70, 
                            css:"webix_primary",
                            hotkey: "shift",
                            disabled:true,
                            value:"Применить фильтры", 
                            click:function(){

                                let values = $$("filterTableForm").getValues();
                                
                                let query =[];
                                

                                function getOperationVal (value, filterEl,el,condition, position, parentIndex=false){
                                    let operationValue = $$(el+"-btnFilterOperations").config.value;
                                    

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
                                }
                        
                                if($$("filterTableForm").isDirty()){
                                    if ($$("filterTableForm").validate()){
                                        let filterEl;
                                        let postFormatData = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
                                        let value;
                                        Object.keys(values).sort().forEach(function(el,i){
                                            filterEl = el;
                                        
                                            value = values[el];
                                            if (el.includes("cdt")|| el.includes("edt")){
                                                value = postFormatData(values[el]);
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
                                            
                                        
                                        });

                                        webix.ajax("/init/default/api/smarts?query="+query.join(""),{
                                            success:function(text, data, XmlHttpRequest){
                                                let notifyType = data.json().err_type;
                                                let notifyMsg = data.json().err;
                                                data = data.json().content;
                                                
                                                if (data.length !== 0){
                                                    $$(tableId).hideOverlay("Ничего не найдено");
                                                    $$(tableId).clearAll()
                                                    $$(tableId).parse(data);
                                                } else {
                                                    $$(tableId).clearAll()
                                                    $$(tableId).showOverlay("Ничего не найдено");
                                                }

                                                let filterCountRows = $$(tableId).count();
                                                $$(filterElementsId).setValues(filterCountRows.toString());
                                        
                                                if (notifyType == "i"){
                                                    notify ("success","Фильтры успшено применены",true);
                                                } else if (notifyType == "e"){
                                                    notify ("error",notifyMsg,true);
                                                } else if (notifyType == "x"){
                                                    notify ("error","Ошибка фильтрации данных",true);
                                                }
                                                
                                            },
                                            error:function(text, data, XmlHttpRequest){
                                                notify ("error","Ошибка фильтрации данных",true);
                                            }
                                        });
                                    } else {
                                        notify ("error","Не все поля формы заполнены", true);
                                    }
                                } else {
                                    notify ("debug","Форма пуста");
                                }

                            },
                        
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
                        click:function(){
                            try {

                                let filterElements = $$("filterTableForm").elements;
                                let filterTemplate = [];
                                Object.values(filterElements).forEach(function(el,i){
                                    if ($$(el.config.id).isVisible()){
                                        filterTemplate.push(el);
                                    }
                                });


                                notify ("success", "Шаблон с полями сохранён в библиотеку", true); 
                            } catch(e) {
                                console.log(e);
                                notify ("error", "Не удалось сохранить шаблон", true); 
                            }
                        },
                        on: {
                            onAfterRender: function () {
                                this.getInputNode().setAttribute("title", "Сохранить шаблон с полями в библиотеку");
                            }
                        } 
                    },
                    
                ]},
                {height:10},

                {id:"filterEmptyTempalte",template:"<div style='color:#858585;font-size:13px!important'>Добавьте фильтры из редактора</div>", borderless:true}
            ]}
        ]},
    ],
    rules:{
        $all:webix.rules.isNotEmpty
    },


    ready:function(){
        this.validate();
    },

   

};

export{
    filterForm
};