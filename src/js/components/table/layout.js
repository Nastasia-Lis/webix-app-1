import  {trashBtn,showPropBtn}           from "./btnsInTable.js";

function table (idTable, onFunc, editableParam=false) {
    return {
        view        :"datatable",
        id          : idTable,
        css         :"webix_table-style webix_header_border webix_data_border",
        autoConfig  : true,
        editable    :editableParam,
        editaction  :"dblclick",
        minHeight   :350,
        datafetch   :5,
        datathrottle: 5000,
        loadahead   :100,
        footer      : true,
        select      :true,
        resizeColumn: true,
        on          :onFunc,
        onClick     :{
            "wxi-trash":function(event,config,html){
                trashBtn(config,idTable);
            },

            "wxi-angle-down":function(event, cell, target){
                showPropBtn (cell);
            },
            
        },
    };
}

export {
    table
};