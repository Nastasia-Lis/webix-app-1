
import { Action }             from "../../../blocks/commonFunctions.js";
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


function editBtnClick() {
    const editForm  = $$("table-editForm");
    const backBtn   = $$("table-backTableBtn");
    const tree      = $$("tree");
    const container = $$("container");


    function maxView () {
        const editContainer   = $$("editTableBarContainer");
        const filterContainer = $$("filterTableBarContainer");
        const filterForm      = $$("filterTableForm");
        Action.hideItem(filterContainer);
        Action.hideItem(filterForm);

        
        setSecondaryState();

        if (editForm && editForm.isVisible()){
            Action.hideItem(editForm);
            Action.hideItem(editContainer);
          

        }else if (editForm && !(editForm.isVisible())) {
            Action.showItem(editForm);
            Action.showItem(editContainer);
            Action.hideItem($$("tablePropBtnsSpace"));
        }

    }

    function minView () {
        const tableContainer = $$("tableContainer");
        Action.hideItem(tableContainer);
        Action.hideItem(tree);
        Action.showItem(backBtn);
        
        editForm.config.width = window.innerWidth - 45;
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
        editForm.config.width = 350;
        editForm.resize();
    }
}



function toolbarEditButton (idTable, visible){
    const idBtnEdit = idTable + "-editTableBtnId";

    function returnValue( empty = true ){
        const icon = "<span class='webix_icon  icon-pencil' style='font-size:13px!important;'></span>";
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
                editBtnClick(idBtnEdit);
            },
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