import {tableId,editFormId, saveBtnId,saveNewBtnId, addBtnId, delBtnId, findElementsId} from '../modules/setId.js';
import {defaultStateForm,createEditFields,popupExec,notify} from "../modules/editTableForm.js";
import { itemTreeId,  getPopupInfo, urlFieldAction} from "../modules/sidebar.js";

// function accordionFilter () {
//     const accordion = {
//         css:"webix_accordion-container",
//         view:"accordion",
//         id:"accordionFilterTable",
//         minHeight:100,
//         type:"line",
//         collapsed:true,
//         rows:[ 
//         ]
//     };
//     return accordion;
// }

function tableToolbar (idPager, idSearch, idExport, idFindElements, idTable,visible=false) {
    function exportToExcel(){
        webix.toExcel(idTable, {
          filename:"Table",
          filterHTML:true,
          styles:true
        });
        notify ("success","Таблица сохранена");
    }
    return { 
         rows:[
            {id:"filterBar",padding:17, height: 80,margin:5, 
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
                            let text = this.getValue().toLowerCase();
                            let table = $$(idTable);
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
                                $$(idTable).showOverlay("Ничего не найдено");
                            } else if(findElements){
                                $$(idTable).hideOverlay("Ничего не найдено");
                            }
                            $$(idFindElements).setValues(findElements.toString());
                            
                        },
                        onAfterRender: function () {
                           this.getInputNode().setAttribute("title","Поиск по таблице");
                        },
                        
                    }
                },
 
                {
                    view:"pager",
                    id:idPager,
                    size:10,
                    inputHeight:48,
                    group:3,
                    height:50,
                    template:`{common.prev()} 
                {common.pages()} {common.next()}`
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
            {   view:"template",
                id:idFindElements,
                css:"webix_style-template-count",
                height:30,
                template:function () {
                    if (Object.keys($$(idFindElements).getValues()).length !==0){
                        return "<div style='color:#999898;'> Количество записей:"+" "+$$(idFindElements).getValues()+" </div>";
                    } else {
                        return "";
                    }
                },
            },
            //accordionFilter()
        ]

        
    };
}




function table (idTable, idPager, onFunc, srcData) {
    return {
        view:"datatable",
        id: idTable,
        css:"webix_table-style webix_header_border webix_data_border",
        resizeColumn: true,
        autoConfig: true,
        pager:idPager,
        minHeight:300,
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
                                notify ("success","Данные успешно удалены");
                            },
                            error:function(){
                                notify ("error","Ошибка при удалении записи");
                            }
                        });
                });
            },

            "wxi-angle-down":function(event, cell, target){
                console.log(cell.row)
                let id = cell.row;
                getPopupInfo(urlFieldAction, cell.row);
                $$("popupTable").show( );
            },
        }
    };
}





//----- table edit parameters
let onFuncTable = {
    onAfterSelect(id){
        let values = $$(tableId).getItem(id); 
        function toEditForm () {
            $$(editFormId).setValues(values);
            $$(saveNewBtnId).hide();
            $$(saveBtnId).show();
            $$(addBtnId).hide(); 
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
            createEditFields();
            toEditForm();
        }   
    },
    onAfterLoad:function(){
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





//----- table view parameters


let onFuncTableView = {
    // onAfterDelete: function() {
    //     $$(findElementsId).setValues($$(tableId).count().toString());
    //     if (!this.count())
    //         this.showOverlay("Ничего не найдено");
    //     if (this.count())
    //         this.hideOverlay();
    // },
    // onAfterAdd: function() {
    //     $$(findElementsId).setValues($$(tableId).count().toString());
    //     this.hideOverlay();
    // },
  
};

//----- table view parameters


export {
    tableToolbar,
    table,
    onFuncTable,

    onFuncTableView
};