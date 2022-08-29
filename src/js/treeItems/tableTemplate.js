import {tableId,editFormId, saveBtnId,saveNewBtnId, delBtnId, findElementsId,editTableBtnId} from '../modules/setId.js';
import {defaultStateForm,createEditFields,popupExec,notify,saveItem} from "../modules/editTableForm.js";
import {itemTreeId, getComboOptions, urlFieldAction} from "../modules/sidebar.js";
import {tableNames} from "../modules/login.js";


// let escapedSearchText = "";

//     function findText(text, table) {

//         text = text || "";
//         escapedSearchText = text.replace(/[[\]{}()*+?.\\^$|]/g, "\\$&");
        
//         if (text) {
//           text = text.toLowerCase();
//           table.filter(data => {
//             return data[Object.keys(data)[1]].toLowerCase().indexOf(text) > -1;
//           });
//         } else {
//           table.filter();
//         }
//       };

//       function addTextMark(value, text) {

//         const checkOccurence = new RegExp("(" + text + ")", "ig");
 
//         return value.replace(
//           checkOccurence,
//           "<span class='search_mark'>$1</span>"
//         );
//       }

//       function searchColumnTemplate(value) {
//         let search = escapedSearchText;
//         webix.message(value);
//         if (search) {
//           value = addTextMark(value, search);
//         }
//         return value;
//       }  

function tableToolbar (idSearch, idExport,idBtnEdit, idFindElements, idFilterElements, idTable,idFilter,visible=false) {
   
    function exportToExcel(){
        webix.toExcel(idTable, {
          filename:"Table",
          filterHTML:true,
          styles:true
        });
        notify ("success","Таблица сохранена",true);
    }




    function createFilterElements (parentElement, viewPosition=1) {

        let columnsData = $$(tableId).getColumns();
    
        if(Object.keys($$(parentElement).elements).length==0  ){
            let inputsArray = [];
            columnsData.forEach((el,i) => {
                if (el.type == "datetime"){
                    inputsArray.push({   
                        view: "datepicker",
                        format:"%d.%m.%Y %H:%i:%s",
                        id:el.id,
                        name:el.id, 
                        hidden:true,
                        label:el.label, 
                        placeholder:"дд.мм.гг", 
                        timepicker: true,
                        labelPosition:"top",
                        on:{
                            onItemClick:function(){
                                $$(parentElement).clearValidation();
                            }
                        }
                    });
                    inputsArray.push(
                        {
                            view:"radio",
                            id:el.id+"_condition",
                            name:el.id+"_condition",
                            hidden:true,
                            options:[
                              { id:"1", value:"или" }, 
                              { id:"2", value:"и" }, 
                            ],
                            value:"1"
                        }
                    );
                } 
                
    
               else if (el.type.includes("reference")) {
                let findTableId = el.type.slice(10);
                let refTableName;
    
                tableNames.forEach(function(el,i){
                    if (el.id == findTableId){
                        refTableName= el.name;
                    }
                });
    
                inputsArray.push(
                    {cols:[
                    {   view:"combo",
                        placeholder:"Выберите вариант",  
                        label:el.label, 
                        id:el.id,
                        hidden:true,
                        name:el.id, 
                        labelPosition:"top",
                        options:{
                            data:getComboOptions(findTableId)
                        },
                        on:{
                            onItemClick:function(){
                                $$(parentElement).clearValidation();
                            },
                        }
                    },
                    {
                        view:"button",
                        css:{"vertical-align":"bottom!important","height":"38px!important"},
                        type:"icon",
                        icon: 'wxi-angle-right',
                        inputHeight:38,
                        width: 40,
                        on: {
                            onAfterRender: function () {
                                this.getInputNode().setAttribute("title","Перейти в таблицу"+" "+"«"+refTableName+"»");
                            },
                        },
                        click:function(){
                            $$("tree").select(findTableId);
                        }
                    }
                    ]}
    
                );
                inputsArray.push(
                    {
                        view:"radio",
                        id:el.id+"_condition",
                        hidden:true,
                        name:el.id+"_condition",
                        options:[
                            { id:"1", value:"или" }, 
                            { id:"2", value:"и" }, 
                        ],
                        value:"1"
                    }
                );
                
                } 
                else{
                    inputsArray.push(
                        {
                        view:"text", 
                        name:el.id,
                        id:el.id, 
                        hidden:true,
                        label:el.label, 
                        labelPosition:"top",
                        on:{
                            onKeyPress:function(){
                                $$(parentElement).clearValidation();
                            },
                            // onTimedKeypress:function(){
                                
                            //     let text = this.getValue().toString().toLowerCase();

                            //     $$(idTable).filter(function(obj){
                            //       let filter = obj.first_name;
                            //      // let filter = [obj.first_name].join("|");
                            //       filter = filter.toString().toLowerCase();
                            //       return (filter.indexOf(text) != -1);
                            //     });

                            // }
                        }
                        }
                    );
                    inputsArray.push(
                        {
                            view:"radio",
                            id:el.id+"_condition",
                            hidden:true,
                            name:el.id+"_condition",
                            options:[
                                { id:"1", value:"или" }, 
                                { id:"2", value:"и" }, 
                            ],
                            value:"1"
                        }
                    );
                }
            });
           

            inputsArray.forEach(function(el,i){
                if(el.view == "radio"){
                    inputsArray.pop();
                }
            });

            console.log(inputsArray);
    
            let inpObj = {margin:8,id:"inputsTable", rows:inputsArray};
    
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