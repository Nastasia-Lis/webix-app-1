
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
            css      :  "webix_btn-filter webix-transparent-btn ",
            disabled : true,
            hidden   : visible,
            icon     : "icon-filter",
            click    : function(){
                filterBtnClick(idTable,idBtnEdit);
            },
        },
        titleAttribute : "Показать/скрыть фильтры"
    
       
    }).transparentView();

    return btn;
}

export {
    toolbarFilterBtn
};