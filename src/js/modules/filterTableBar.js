import {notify,createEditFields} from "./editTableForm.js";
import {tableId,editFormId, saveBtnId,saveNewBtnId, delBtnId, findElementsId,editTableBtnId} from './setId.js';
import { urlFieldAction } from "./sidebar.js";



function editFilterPopup (){

    console.log(Object.keys($$("filterTableForm").elements));
}

const filterForm =  {   
    view:"form", 
    hidden:true,
    id:"filterTableForm",
    //container:"webix__form-container", 
    minHeight:350,
    minWidth:210,
    width: 320,
    scroll:true,
    elements:[
        { 
            css:"webix_filter-headlne",
            template:"<div style ='font-size:16px!important; font-weight:600!important'>Фильтры</div>",
            height: 40,
            labelPosition:"top",
            borderless:true
        },
        {cols:[
            {   view:"button",
                value:"Редактор фильтров",
                height:48,
                minWidth:140, 
                click:function(){
                    webix.ui({
                        view:"popup",
                        id:"popupFilterEdit",
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
                                    borderless:true,
                                    elements:[
                                        {rows:[ 
                                            {view:"scrollview",  scroll:"y", height:250,body:{ id:"editFormPopupScroll",rows:[

                                            ]},},
                                            
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
                                                                }

                                                                if($$(el+"_condition") && !($$(el+"_condition").isVisible())){
                                                                    $$(el+"_condition").show();
                                                                }

                                                            } else{
                                                                if ($$(el).isVisible()){
                                                                    $$(el).hide();
                                                                }

                                                                if (!($$("filterEmptyTempalte").isVisible())){
                                                                    $$("filterEmptyTempalte").show();
                                                                }

                                                                if($$(el+"_condition") && $$(el+"_condition").isVisible()){
                                                                    $$(el+"_condition").hide();
                                                                }
                                                            }
                                                            $$(el).refresh();
                                                        });

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
                    
                    let nameList = [{cols:[{rows:[]}]}];
                    formData.forEach(function(el,i){
                        if(!(el.id.includes("condition"))){
                            console.log(el)
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
                                                console.log($$("popupFilterSubmitBtn").isEnabled())
                                                if($$("popupFilterSubmitBtn").disable()){
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
                                                console.log($$("popupFilterSubmitBtn").isEnabled())
 
                                                if($$("popupFilterSubmitBtn").disable()){
                                                    $$("popupFilterSubmitBtn").enable();
                                                }
                                            }
                                        }
                                    }
                                );
                            }
                            

                            
                        }
                    });
                    console.log("1111")
                    $$("editFormPopupScroll").addView({rows:nameList},1);
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
                        $$(tableId).filter("");
                        notify ("success", "Фильтры очищены", true);
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
                    value:"Применить фильтры", 
                    click:function(){
                        let values = $$("filterTableForm").getValues();
                        
                        let condition;

                    



                        // ИЛИ
                        Object.keys(values).forEach(function(el,i){
                            
                            // if (el.includes("condition")){
                            //     console.log(values[el])
                            //     if (values[el] == 2){
                            //         condition = 
                                
                            //     } else if (values[el] == 1){

                            //     }
                            // }

                            // if (!(el.includes("condition"))){
                            //     $$(tableId).filter(function(obj){
                            //         //console.log(obj[el], el, "obj.el")
                            //     //let filter = obj.first_name;
                            //     //let filter = [obj.role, obj.description].join("|");

                            //      //  filter - пропускает через себя каждое значение колонки
                            //     let filter = obj[el].toString().toLowerCase();
                            //         console.log(filter.indexOf(values[el]) )
                                    
                                    
                            //         return (filter.indexOf(values[el]) != -1);
                            //     });
                            // }
                        
                        });

                        //let values = $$("filterTableForm").toString().toLowerCase();
                        console.log(values, "vvv");
                    


                        // filter : return currentElement > 3 && currentElement < 17;
                        
                        // obj.role == "оп" && obj.descr == "2"

                        $$(tableId).filter(function(obj){
                            console.log(obj.role)
                        //let filter = obj.first_name;
                        //let filter = [obj.role, obj.description].join("|");
                        let filter = obj.role.toString().toLowerCase();
                            return (filter.indexOf("оп"||"2") != -1);
                        });

                        
                        // $$(tableId).filter(function(obj){
                        //     console.log(obj.role)
                        // //let filter = obj.first_name;
                        // //let filter = [obj.role, obj.description].join("|");
                        // let filter = obj.description.toString().toLowerCase();
                        //     return (filter.indexOf("2") != -1);
                        // });
                    }
            },
            {height:10},

            {id:"filterEmptyTempalte",template:"<div style='color:#858585;font-size:13px!important'>Добавьте фильтры из редактора</div>", borderless:true}
        ]}
       
    ],

   

};

export{
    filterForm
};