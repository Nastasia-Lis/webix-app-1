
import { filterBtnClick }    from "../tableFilter/toolbarBtn.js";
import { Button }            from "../../viewTemplates/buttons.js";

function toolbarFilterBtn(idTable, visible){
    let idBtnEdit = idTable + "-editTableBtnId",
        idFilter  = idTable + "-filterId"
    ;

    const btn = new Button({
        config   : {
            id       : idFilter,
            hotkey   : "Ctrl+Shift+F",
            disabled : true,
            hidden   : visible,
            icon     : "icon-filter",
            click    : function(){
                filterBtnClick(idTable,idBtnEdit);
            },
        },
        css            :  "webix_btn-filter",
        titleAttribute : "Показать/скрыть фильтры"
    
       
    }).transparentView();

    return btn;
}

export {
    toolbarFilterBtn
};