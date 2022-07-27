// import {tablesArray} from './data/data.js';
// import {tableId, pagerId,editFormId, saveBtnId,saveNewBtnId, addBtnId, delBtnId} from './setId.js';

// import {createEditFields,popupExec} from './editTable.js';

// export function table () {
//     return {
//         view:"datatable",
//         id: tableId,
//         data:tablesArray[0].content,
//         css:"webix_table-style webix_header_border webix_data_border",
//         resizeColumn: true,
//         autoConfig: true,
//         //pager:pagerId,
//         minHeight:300,
//         footer: true,
//         minWidth:500, 
//         minColumnWidth:120,
//         on:{
//             onAfterSelect(id){
//                 let values = $$(tableId).getItem(id); 

//                 function toEditForm () {
//                     $$(editFormId).setValues(values);
//                     $$(saveNewBtnId).hide();
//                     $$(saveBtnId).show();
//                     $$(addBtnId).hide();
                    
//                 }
                
//                 if($$(editFormId).isDirty()){
//                     popupExec("Данные не сохранены").then(
//                         function(){
//                             $$(editFormId).clear();
//                             $$(delBtnId).enable();
//                             toEditForm();
                            
//                     }); 
//                 } else {
//                     createEditFields();
//                     toEditForm();
//                     //$$(editFormId).setDirty();
//                 }
                
//             },

//             onAfterLoad:function(){
//                 if (!this.count())
//                   this.showOverlay("Ничего не найдено");
//             },  
//         },
//         ready:function(){
//             if (!this.count()){ // if no data are available
//                 webix.extend(this, webix.OverlayBox);
//                 this.showOverlay("<div style='...'>There is no data</div>");
//             }
//         }
//     };
    
// }