import  {trashBtn,showPropBtn}           from "./btnsInTable.js";

const limitLoad   = 80;

function table (idTable, onFunc, editableParam=false) {
    return {
        view        : "datatable",
        id          : idTable,
        css         : "webix_table-style webix_header_border webix_data_border",
        autoConfig  : true,
        editable    : editableParam,
        editaction  :"dblclick",
        minHeight   : 350,
       // height:200,
        footer      : true,
        select      : true,
        resizeColumn: true,
        sort        : [],
        offsetAttr  : limitLoad,
        on          : onFunc,
        onClick     :{
            "wxi-trash":function(event,config,html){
                trashBtn(config,idTable);
            },

            "wxi-angle-down":function(event, cell, target){
                showPropBtn (cell);
            },
            
        },
        ready:function(){ 
            const firstCol = this.getColumns()[0];
            this.markSorting(firstCol.id, "asc");
        },
    };
}

export {
    table
};