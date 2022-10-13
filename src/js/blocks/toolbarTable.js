
import {setHeadlineBlock} from './blockHeadline.js';
import {toolbarFilterBtn} from "./filterTableForm.js";
import {setLogValue} from "./logBlock.js";
import {setFunctionError} from "./errors.js";

function hideElem(elem){
    try{
        if (elem && elem.isVisible()){
            elem.hide();
        }
    } catch (err){
        setFunctionError(err,"toolbarTable","hideElem");
    }
}

function showElem (elem){
    try{
        if (elem && !(elem.isVisible())){
            elem.show();
        }
    } catch (err){
        setFunctionError(err,"toolbarTable","showElem");
    }
}

function editBtnClick(idBtnEdit) {
    function maxView () {
        let btnClass = document.querySelector(".webix_btn-filter");

        function setSecondaryState(){
            try{
                btnClass.classList.add("webix-transparent-btn");
                btnClass.classList.remove("webix-transparent-btn--primary");
            } catch (err) {   
                setFunctionError(err,"toolbarTable","setSecondaryState");
            }
        }

        hideElem($$("filterTableBarContainer"));
        hideElem($$("filterTableForm"));
        setSecondaryState();

        hideElem($$(idBtnEdit));

        showElem($$("table-editForm"));
        showElem($$("editTableBarContainer"));

 
    }


    function minView () {
        const inputs               = $$("editTableBarAdaptive");
        const popupContainer       = $$("tableEditPopupContainer");
        const btnAdd = $$("table-newAddBtnId");
  
        function createPopup (){
            const popup =  webix.ui({
                view:"popup",
                css:"webix_popup-table-container webix_popup-config",
                modal:true,
                id:"tableEditPopup",
                escHide:true,
                position:"center",
                body:{
                    id:"tableEditPopupContainer",rows:[

                    ]
                }
            }).show();

            return popup;
        }

        function addInputs(){
            try{
                const container = $$("tableEditPopupContainer");
    
                if (container && inputs){
                    container.addView(inputs);
                }
            } catch (err) {   
                setFunctionError(err,"toolbarTable","minView => addInputs");
            }
    
        }

        function setInputsSize(){
            try{
                let size = window.innerWidth*0.7;
                if( inputs.$width > 200){
                    inputs.config.width = size;
                    inputs.resize();
                }
            } catch (err) {   
                setFunctionError(err,"toolbarTable","minView => setInputsSize");
            }
        }

        function enableNewAddBtn(){
            try{
                if (btnAdd && !(btnAdd.isEnabled())){
                    btnAdd.enable();
                }
            } catch (err) {   
                setFunctionError(err,"toolbarTable","minView => enableNewAddBtn");
            }
        }

        function setNewAddBtnState(){
            try{
                const saveBtn = $$("table-saveNewBtn");

                if(btnAdd){
                    if(saveBtn.isVisible() && $$(btnAdd).isEnabled()){
                        btnAdd.disable();
                    } else {
                        $$(btnAdd).enable();
                    }
                }
            } catch (err) {   
                setFunctionError(err,"toolbarTable","minView => setNewAddBtnState");
            }
        }

        if (!($$("tableEditPopup"))){

            createPopup  ();
            addInputs    ();
            showElem     ($$("editTableBarHeadline"));
            setInputsSize();
           
        } else {
            showElem     ($$("tableEditPopup"));
            setInputsSize();
            const containerLength = popupContainer.getChildViews().length;

            if (containerLength){
                enableNewAddBtn();
                showElem       ($$("editTableBarContainer"));
  

            } else {
                popupContainer.addView(inputs);
                showElem ($$("editTableBarHeadline"));
            }
        }
    
        setNewAddBtnState();
   
    }
 

    if (window.innerWidth > 1200){
        maxView ();
        


    } else {
        minView ();
        
    }

}

function exportToExcel(idTable){
    try{
        webix.toExcel(idTable, {
        filename:"Table",
        filterHTML:true,
        styles:true
        });
        setLogValue("success","Таблица сохранена");
    } catch (err) {   
        setFunctionError(err,"toolbarTable","exportToExcel");
    }
}

function createTemplateCounter(idEl,text){
    const view = {   
        view:"template",
        id:idEl,
        css:"webix_style-template-count",
        height:30,
        template:function () {
            if (Object.keys($$(idEl).getValues()).length !==0){
                
                return "<div style='color:#999898;'>"+text+":"+
                        " "+$$(idEl).getValues()+
                        " </div>";
            } else {
                return "";
            }
        }
    };

    return view;
}


function tableToolbar (idTable,visible=false) {

    let idExport         = idTable+"-exportBtn",
        idBtnEdit        = idTable+"-editTableBtnId",
        idFindElements   = idTable+"-findElements",
        idFilterElements = idTable+"-idFilterElements",
        idFilter         = idTable+"-filterId",
        idHeadline       = idTable+"-templateHeadline"
    ;

    const editButton = {   view:"button",
        maxWidth:200, 
        value:"<span class='webix_icon fas fa-pen'></span><span style='padding-left: 5px'>"+
              "Редактор таблицы</span>",
        id:idBtnEdit,
        hidden:true,
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
                    setFunctionError(err,"toolbarTable","btn edit onAfterRender");
                }
                this.getInputNode().setAttribute("title","Редактировать таблицу");
            }
        } 
    };

    const downloadButton = {   
        view:"button",
        width: 50, 
        type:"icon",
        id:idExport,
        hidden:visible,
        icon:"fas fa-circle-down",
        css:"webix_btn-download webix-transparent-btn",
        title:"текст",
        height:42,
        click:function(){
            exportToExcel(idTable);
        },
        on: {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Экспорт таблицы");
            }
        } 
    };


    return { 
        
        rows:[
            setHeadlineBlock(idHeadline),

            {
                css:"webix_filterBar",
                padding:{
                    bottom:4,
                }, 
                height: 40,
                cols: [
                    toolbarFilterBtn(idTable,idBtnEdit,idFilter,visible),
                    editButton,
                    {},
                    downloadButton,
                ],
            },

            {cols:[
                createTemplateCounter(idFindElements,  "Общее количество записей"),
                createTemplateCounter(idFilterElements,"Видимое количество записей"),
            ]},
        ]
    };
}


export{
    tableToolbar
};