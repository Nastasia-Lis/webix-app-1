
import { Action }             from "../../../blocks/commonFunctions.js";
import { mediator }           from "../../../blocks/_mediator.js";

import { setFunctionError  }  from "../../../blocks/errors.js";
import { Button }             from "../../../viewTemplates/buttons.js";
 
const logNameFile = "tableEditForm => toolbarBtn";

function setSecondaryState(){
    const btnClass       = document.querySelector(".webix_btn-filter");
    const primaryClass   = "webix-transparent-btn--primary";
    const secondaryClass = "webix-transparent-btn";

    try{
        btnClass.classList.add   (secondaryClass);
        btnClass.classList.remove(primaryClass  );
    } catch (err) {   
        setFunctionError(err, logNameFile, "setSecondaryState");
    }
}

function isIdParamExists(){
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');
    if (idParam){
        return true;
    }
}

function editBtnClick() {

    const editForm  = $$("table-editForm");
    const backBtn   = $$("table-backTableBtn");
    const tree      = $$("tree");
    const table     = $$("table");
    const container = $$("container");

    function maxView () {
        const editContainer   = $$("editTableBarContainer");
        const filterContainer = $$("filterTableBarContainer");
        const filterForm      = $$("filterTableForm");
       
        const isVisible       = editForm.isVisible();
    
        Action.hideItem   (filterContainer);
        Action.hideItem   (filterForm);
      
        setSecondaryState ();

        if (editForm && isVisible){
            mediator.tables.editForm.defaultState();

            Action.hideItem   (editForm);
            Action.hideItem   (editContainer);

            mediator.linkParam(false, "view");
            mediator.linkParam(false, "id"  );

            table.unselectAll ();
        } else if (editForm && !isVisible) {
            Action.showItem (editForm);
            Action.showItem (editContainer);

            Action.hideItem ($$("tablePropBtnsSpace"));

            if(!isIdParamExists()){
                mediator.linkParam(true, {"view" : "edit"});
            }
        
        }

    }

    function minView () {
        const tableContainer = $$("tableContainer");
        Action.hideItem (tableContainer);
        Action.hideItem (tree);
        Action.showItem (backBtn);
        
        const padding = 45;
        editForm.config.width = window.innerWidth - padding;
        editForm.resize();

    }
    
    maxView ();

    if (container.$width < 850 ){
        Action.hideItem(tree);
 

        if (container.$width < 850 ){
            minView ();
        }
      
    } else {
        Action.hideItem(backBtn);
    }
}



function toolbarEditButton (idTable, visible){
    const idBtnEdit = idTable + "-editTableBtnId";

    function returnValue( empty = true ){
        const icon = "<span class='webix_icon icon-pencil btn-edit-icon-toolbar'></span>";
        const text = "<span style='padding-left: 5px; font-size:13px!important; margin-right: 11px;' >Редактор записи</span>";

        if (empty){
            return icon;
        } else {
            return icon + text;
        }
    }   

    const btn = new Button({
        config   : {
            id       : idBtnEdit,
            hotkey   : "Ctrl+Shift+X",
            value    : returnValue( false ),
            hidden   : visible,
            minWidth : 40,
            maxWidth : 200, 
            onlyIcon : false,
            click    : function(){
                this.callEvent("clickEvent", [ "" ]);
            },
            on:{
                clickEvent:function(){
                    editBtnClick(idBtnEdit);
                }
               
            }
        },
        css            : "edit-btn-icon",
        titleAttribute : "Показать/скрыть фильтры",
        adaptValue     : returnValue( ),
    
       
    }).maxView();

    return btn;

}

export {
    toolbarEditButton
};