import {tableId,editFormId, saveBtnId,saveNewBtnId, delBtnId, findElementsId,filterElementsId} from '../modules/setId.js';
import {defaultStateForm,createEditFields,popupExec,notify,saveItem} from "../modules/editTableForm.js";
import { itemTreeId,urlFieldAction} from "../modules/sidebar.js";


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

function tableToolbar (idSearch, idExport, idFindElements, idFilterElements, idTable,idFilter,visible=false) {
   console.log(idSearch, idExport, idFindElements, idFilterElements, idTable,idFilter)
   
    function exportToExcel(){
        webix.toExcel(idTable, {
          filename:"Table",
          filterHTML:true,
          styles:true
        });
        notify ("success","Таблица сохранена",true);
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
                            //console.log(text)
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
                    id:idFilter,
                    hidden:visible,
                    icon:"wxi-filter",
                    css:"webix_btn-filter",
                    title:"текст",
                    height:50,
                    click:function(){
                        console.log(idTable)
                        $$(idTable).clearSelection();
                        console.log($$(idTable).getSelectedId(true, true))
                        let btnClass = document.querySelector(".webix_btn-filter");

                        if(!(btnClass.classList.contains("webix_primary"))){
                            $$("filterTableForm").show();
                            $$(editFormId).hide();

                            if($$("filterTableForm").getChildViews() !== 0){
                                createEditFields("filterTableForm",3);
                            }
                            btnClass.classList.add("webix_primary");
                            btnClass.classList.remove("webix_secondary");
                            
                           
                        } else {
                            $$("filterTableForm").hide();
                            $$(editFormId).show();
                            btnClass.classList.add("webix_secondary");
                            btnClass.classList.remove("webix_primary");
                        }
                      
                    },
                    on: {
                        onAfterRender: function () {
                            console.log( this.getInputNode())
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