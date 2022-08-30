import {notify,createEditFields} from "./editTableForm.js";
import {tableId,filterElementsId,editFormId, saveBtnId,saveNewBtnId, delBtnId, findElementsId,editTableBtnId} from './setId.js';
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
                        //css:"webix_popup-filter-container",
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
                                                                }

                                                                $$("resetFilterBtn").enable();

                                                               
                                                                if ($$("filterEmptyTempalte").isVisible()){
                                                                    $$("filterEmptyTempalte").hide();
                                                                    $$("filterEmptyTempalte").refresh();
                                                                }
                                                               
                                                              
                                                                if($$(el+"_condition") && !($$(el+"_condition").isVisible())){
                                                                    $$(el+"_condition").show();
                                                                }

                                                            } else{
                                                                if ($$(el).isVisible()){
                                                                    $$(el).hide();
                                                                }

                                                                if($$(el+"_condition") && $$(el+"_condition").isVisible()){
                                                                    $$(el+"_condition").hide();
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

                    let formData = [];
                    let filterTableElements  = $$("filterTableForm").elements;

                    Object.values(filterTableElements).forEach(function(el,i){
                        formData.push({id:el.config.id, label:el.config.label})
                    });
                    
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
                    
                    formData.forEach(function(el,i){
                        if(!(el.id.includes("condition"))){
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
                    
                        let queryConstructor=[];
                        let filterEl;
                        Object.keys(values).forEach(function(el,i){
                            //console.log(el)
                            
                            filterEl = el;

                            if (el.includes("filter")&&!(el.includes("condition"))){
                                filterEl = el.lastIndexOf("_");
                                filterEl = el.slice(0,filterEl)
                            }
                         
                            if(!(el.includes("condition"))&&values[el]!==""&&el!=="selectAll"){
              
                                queryConstructor.push(itemTreeId+"."+filterEl+"="+values[el]);
                            }
                        
                        });
                        
                        let queryFull = queryConstructor.join("+and+")+"&sorts="+itemTreeId+".id&offset=0";


                        webix.ajax("/init/default/api/smarts?query="+queryFull,{
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
                                notify ("success","Фильтры успшено применены",true);
                            },
                            error:function(text, data, XmlHttpRequest){
                                notify ("error","Ошибка фильтрации данных",true);
                            }
                        });





                    },
                   
            },
            {height:10},

            {id:"filterEmptyTempalte",template:"<div style='color:#858585;font-size:13px!important'>Добавьте фильтры из редактора</div>", borderless:true}
        ]}
       
    ],

   

};

export{
    filterForm
};