
import { hideElem, showElem } from "../commonFunctions.js";
import { setFunctionError  }  from "../errors.js";
import { Button }             from "../../viewTemplates/buttons.js";

const logNameFile = "tableEditForm => toolbarBtn";

function setSecondaryState(){
    const btnClass       = document.querySelector(".webix_btn-filter");
    const primaryClass   = "webix-transparent-btn--primary";
    const secondaryClass = "webix-transparent-btn";

    try{
        btnClass.classList.add   (secondaryClass);
        btnClass.classList.remove(primaryClass  );
    } catch (err) {   
        setFunctionError(err,logNameFile,"setSecondaryState");
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

        hideElem(filterContainer);
        hideElem(filterForm     );
        
        setSecondaryState();

        if (editForm && editForm.isVisible()){
            hideElem(editForm     );
            hideElem(editContainer);
          

        }else if (editForm && !(editForm.isVisible())) {
            showElem(editForm      );
            showElem(editContainer);
            hideElem($$("tablePropBtnsSpace"));
        }

    }

    function minView () {
        const tableContainer = $$("tableContainer");
        hideElem(tableContainer);
        hideElem(tree);
        showElem(backBtn);
        
        editForm.config.width = window.innerWidth-45;
        editForm.resize();
    }

    maxView ();
    if (container.$width < 850 ){
        hideElem(tree);

        if (container.$width < 850 ){
            minView ();
        }
      
    } else {
        hideElem(backBtn);
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
            css      : "edit-btn-icon",
            minWidth : 40,
            maxWidth : 200, 
            onlyIcon : false,
            click    : function(){
                editBtnClick(idBtnEdit);
            },
        },
        titleAttribute : "Показать/скрыть фильтры",
        adaptValue     : returnValue( ),
    
       
    }).maxView();

    return btn;

}

export {
    toolbarEditButton
};