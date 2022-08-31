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

        {cols:[
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
                                            {view:"scrollview",borderless:true, id:"editFormScroll", scroll:"y", height:250,body:{ id:"editFormPopupScroll",rows:[

                                            ]},},
                                            {height:20},
                                            
                                            {   view:"button",
                                                id:"popupFilterSubmitBtn",
                                                height:48,
                                                minWidth:140,
                                                disabled:true, 
                                                css:"webix_primary",
                                                hotkey: "shift",
                                                value:"Применить", 
                                                on: {
                                                    onAfterRender: function () {
                                                        this.getInputNode().setAttribute("title","Выбранные фильтры будут добавлены в рабочее поле, остальные скрыты");
                                                    },
                                                },
                                                click:function(){
                                                    try{
                                                        
                                                        let values = $$("editFormPopup").getValues();

                                                        Object.keys(values).forEach(function(el,i){

                                                            if (values[el]){
                                                                if (!($$(el).isVisible())){
                                                                   
                                                                    $$(el).show();
                                                                   // $$(el).getParentView().config.padding=5;
                                                                    console.log( $$(el).getParentView().config.padding)
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
                                                                    $$(el).getParentView().config.padding=0;
                                                                    console.log( $$(el).getParentView().config.padding)
                                                                    $$(el).getParentView().refresh()
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
                                              
                                                if(!($$("popupFilterSubmitBtn").isEnabled())){
                                                    $$("popupFilterSubmitBtn").enable();
                                                }
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
            {width:7},
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
        ]},
        {css:{"margin-top":"5px!important"},rows:[
            {   view:"button",
                    id:"btnFilterSubmit",
                    height:48,
                    minWidth:140, 
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
            {height:10},

            {id:"filterEmptyTempalte",template:"<div style='color:#858585;font-size:13px!important'>Добавьте фильтры из редактора</div>", borderless:true}
        ]}
       
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