import {tableId, pagerId,editFormId, saveBtnId,saveNewBtnId, addBtnId, delBtnId, findElemetsId, searchId,  exportBtn} from '../modules/setId.js';
import {defaultStateForm,createEditFields,popupExec,notify} from "../modules/editTableForm.js";


function tableToolbar () {
    function exportToExcel(){
        webix.toExcel(tableId, {
          filename:"Table",
          filterHTML:true,
          styles:true
        });
        notify ("success","Таблица сохранена");
    }
    return { 
        rows:[
            {padding:17, margin:5, 
                cols: [
                {   view:"search", 
                    placeholder:"Поиск", 
                    id:searchId,
                    css:"searchTable", 
                    maxWidth:250, 
                    minWidth:40, 
                    disabled:true,
                    on: {
                        onTimedKeyPress() {
                            let text = this.getValue().toLowerCase();
                            let table = $$(tableId);
                            let columns = table.config.columns;
                            let findElements = 0;
                            table.filter(function(obj){
                                for (let i=0; i<columns.length; i++)
                                    if (obj[columns[i].id].toString().toLowerCase().indexOf(text) !== -1){
                                        findElements++; 
                                        return true;
                                    }
                                return false;
                            });
                            if (!findElements){
                                $$(tableId).showOverlay("Ничего не найдено");
                            } else if(findElements){
                                $$(tableId).hideOverlay("Ничего не найдено");
                            }
                            $$(findElemetsId).setValues(findElements.toString());
                            
                        },
                        onAfterRender: function () {
                           this.getInputNode().setAttribute("title","Поиск по таблице");
                        },
                        
                    }
                },
 
                {
                    view:"pager",
                    id:pagerId,
                    size:10,
                    group:3,
                    template:`{common.prev()} 
                {common.pages()} {common.next()}`
                },

                {   view:"button",
                    width: 50, 
                    type:"icon",
                    id:exportBtn,
                    icon:"wxi-download",
                    css:"webix_btn-download",
                    title:"текст",
                    height:50,
                    width:60,
                    disabled:true,
                    click:exportToExcel,
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title","Экспорт таблицы");
                        }
                    } 
                },
                ],
            },
            {   view:"template",
                id:findElemetsId,
                height:30,
                template:function () {
                    if (Object.keys($$(findElemetsId).getValues()).length !==0){
                        return "<div style='color:#999898'> Количество записей:"+" "+$$(findElemetsId).getValues()+" </div>";
                    } else {
                        return "";
                    }
                },
            }
        ]

        
    };
}



let countRows;
let tableTemplate = {
    view:"datatable",
    id: tableId,
    css:"webix_table-style webix_header_border webix_data_border",
    resizeColumn: true,
    autoConfig: true,
    pager:pagerId,
    minHeight:300,
    footer: true,
    minWidth:500, 
    select:true,
    minColumnWidth:200,
    on:{
        onAfterSelect(id){

            let values = $$(tableId).getItem(id); 
            function toEditForm () {
                console.log(values)
                $$(editFormId).setValues(values);
                $$(saveNewBtnId).hide();
                $$(saveBtnId).show();
                $$(addBtnId).hide(); 
            }
            
            if($$(editFormId).isDirty()){
                popupExec("Данные не сохранены").then(
                    function(){
                        $$(editFormId).clear();
                        $$(delBtnId).enable();
                        toEditForm();
                }); 
            } else {
                createEditFields();
                toEditForm();
            }
            
        },

        onAfterLoad:function(){
            $$(editFormId).removeView("inputsTable");
            defaultStateForm ();
            
            if (!this.count())
                this.showOverlay("Ничего не найдено");
            
            if (this.count())
                this.hideOverlay();  
                
        },  

        onAfterDelete: function() {
            if (!this.count())
                this.showOverlay("Ничего не найдено");
        },

        onAfterAdd: function(id, index) {
            countRows+=1;
            $$(findElemetsId).setValues(countRows.toString());
            this.hideOverlay();

        },
    },
    ready:function(){
        if (!this.count()){ 
            webix.extend(this, webix.OverlayBox);
            this.showOverlay("<div style='...'>Ничего не найдено</div>");
        }
    }
};


export {
    tableToolbar,
    tableTemplate
};