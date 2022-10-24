
import {hideElem,showElem} from "../commonFunctions.js";
import {setFunctionError} from "../errors.js";

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



function toolbarEditButton (idTable){
    const idBtnEdit = idTable+"-editTableBtnId";

    return {   
        view:"button",
        maxWidth:200, 
        value:"<span class='webix_icon icon-pencil'></span><span style='padding-left: 5px'>"+
            "Редактор таблицы</span>",
        id:idBtnEdit,
        css:"webix_btn-edit",
        title:"текст",
        height:42,
        click:function(){
            editBtnClick(idBtnEdit);
        },
        on: {
            onAfterRender: function () {
                try{
                    if(idTable !== "table" && this.isVisible()){
                        this.hide();
                    }
                } catch (err) {   
                    setFunctionError(err,logNameFile,"btn edit onAfterRender");
                }
                this.getInputNode().setAttribute("title","Редактировать таблицу");
            }
        } 
    };
}

export {
    toolbarEditButton
};