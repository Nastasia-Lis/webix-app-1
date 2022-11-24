
import { setFunctionError,setAjaxError }         from "../../../../blocks/errors.js";

import { createFilterPopup}                      from "../popup/_layoutPopup.js";

import { getItemId, pushUserDataStorage, 
        getUserDataStorage}                      from "../../../../blocks/commonFunctions.js";

import { Button }                                from "../../../../viewTemplates/buttons.js";

const logNameFile   = "tableFilter => buttons => editBtn";

function editFiltersBtn (){
  
    const currId = getItemId ();

    createFilterPopup();

    async function userprefsData (){ 
        let user = getUserDataStorage();
        if (!user){
            await pushUserDataStorage ();
            user =  getUserDataStorage();
        }

        const userprefsGetData = webix.ajax("/init/default/api/userprefs/");

        userprefsGetData.then(function(data){

            function setTemplates(user){
                const lib = $$("filterEditLib");

                function clearOptionsPull(){
                
                    const oldOptions = [];
    
                    if (lib && lib.config.options.length !== 0){
                        lib.config.options.forEach(function(el){
                            oldOptions.push(el.id);
                        });

                        oldOptions.forEach(function(el){
                            lib.removeOption(el);
                        
                        });
                
                    }
                }

                clearOptionsPull();

                const dataSrc = data.json().content;
                try{
                    dataSrc.forEach(function(data, i) {
                     
                        if( data.name.includes("filter-template_") && data.owner == user.id ){
                            const prefs = JSON.parse(data.prefs);
                            if (prefs.table == currId){
                    
                                lib.addOption( {
                                    id    : i + 1, 
                                    value : prefs.name
                                });
                    
                            }
                        }
                    
                    });
                } catch (err){
                    setFunctionError(err, logNameFile, "function setTemplates");
                }
    
            }
    
            function setEmptyOption(){
                $$("filterEditLib").addOption(
                    {   id      : "radioNoneContent",
                        disabled: true, 
                        value   : "Сохранённых шаблонов нет"
                    }
                );
            }


           
            try{
                
    
                if(user){
                    setTemplates(user);

                    const lib = $$("filterEditLib");
                    
                    if (lib && lib.data.options.length == 0 ){
                        setEmptyOption();
                    }
             
                }
            } catch (err){
                setFunctionError(err, logNameFile, "function userprefsData");
            }
            
        });
        userprefsGetData.fail(function(err){
            setAjaxError(err, logNameFile,"saveTemplate");
        });
       
    }

    userprefsData ();

    function stateSubmitBtn(state){
        const btn = $$("popupFilterSubmitBtn");
        if(state){
            btn.enable();
        } else {
            btn.disable();
        }
    
    }
    
    
    function popupSizeAdaptive(){

        const size  = window.innerWidth * 0.89;
        const popup = $$("popupFilterEdit");
        try{
            popup.config.width = size;
            popup.resize();
        } catch (err){
            setFunctionError(
                err,
                logNameFile,
                "function userprefsData => popupSizeAdaptive"
            );
        }
    }
    
//    setValueLib();

    if (window.innerWidth < 1200 ){
        popupSizeAdaptive();
    }

    const checkbox =  {
        view        : "checkbox", 
        id          : "selectAll", 
        labelRight  : "<div style='font-weight:600'>Выбрать всё</div>", 
        labelWidth  : 0,
        name        : "selectAll",
        on          : {
            onChange:function(){
                stateSubmitBtn(true);

                function setValueCheckbox(){
                    const content    = $$("editFormPopupScrollContent");
                    const checkboxes = content.getChildViews();
                    try{
                        checkboxes.forEach(function(el,i){
                            if (el.config.id.includes("checkbox")){

                                if($$("selectAll").getValue()){
                                    el.config.value = 1;
                                } else {
                                    el.config.value = 0;
                                }
                                $$(el).refresh();
                            }

                        });
                    } catch (err){
                        setFunctionError(
                            err,
                            logNameFile,
                            "function checkbox:onchange => setValueCheckbox"
                        );
                    }
                }

                setValueCheckbox(); 
            

            },
    
        } 
    };
 
    
 
    function getAllCheckboxes(){
        const checkboxes           = [];
        const filterTableElements  = $$("filterTableForm").elements;
        try{
            Object.values(filterTableElements).forEach(function(el,i){
                checkboxes.push({ 
                    id    : el.config.id, 
                    label : el.config.label 
                });
            });
        }catch (err){
            setFunctionError( 
                err, 
                logNameFile, 
                "function editFiltersBtn => getAllCheckboxes" 
            );
        }
     
        return checkboxes;
    }
   
 
    function checkboxOnChange (el){
   
        const parent = $$(el.id+"_checkbox").getParentView();
        const childs = parent.getChildViews();
    
        let counter  = 0;
        let btnState = 0;

        function getStatusCheckboxes(){
            try{
                childs.forEach(function(el,i){
                    if (el.config.id.includes("checkbox")){
                        const value = el.config.value;

                        if ( !(value) || value == "" ){
                            counter++;
                        }
                    }
                    if (el.config.value){
                        btnState++;
                    }
                });
            } catch (err){
                setFunctionError(
                    err,
                    logNameFile,
                    "function checkboxOnChange => getStatusCheckboxes"
                );
            }
        }

        function setStateBtnSubmit(){
            stateSubmitBtn(true);
        }

        function setSelectAllState(){
            try{
                const selectAll = $$("selectAll");
               
                if (counter == 0){
                    selectAll.config.value = 1;
                    selectAll.refresh();

                } else if ( selectAll.config.value !== 0 ){
                    selectAll.config.value = 0;
                    selectAll.refresh();
                    
                }
            } catch (err){
                setFunctionError(
                    err,
                    logNameFile,
                    "function checkboxOnChange => setSelectAllState"
                );
            }
        }
       
        try{
            getStatusCheckboxes();
            setStateBtnSubmit();
            setSelectAllState();
        } catch (err){
            setFunctionError(
                err,
                logNameFile,
                "function checkboxOnChange"
            );

        }
    }

   
    function createCheckboxes(){

        const nameList = [
            {cols:[
                {   id  : "editFormPopupScrollContent",
                    css : "webix_edit-form-popup-scroll-content",
                    rows: [
                        checkbox
                    ]
                }
            ]}
        ];

  
   
        try {  
            const formData = getAllCheckboxes();

            formData.forEach(function(el,i){
                if(!(el.id.includes("child"))){

                    const template = {
                        view        : "checkbox", 
                        id          : el.id+"_checkbox", 
                        labelRight  : el.label, 
                        labelWidth  : 0,
                        name        : el.id,
                        on          : {
                            onChange:function(){
                                checkboxOnChange (el);
                            }
                        } 
                    };

                    const field = $$(el.id);

                    const allInputs = $$( el.id+"_rows").getChildViews();

            
                    if (field && field.isVisible() || allInputs.length > 1 ){
               
                        template.value = 1;
                        nameList[0].cols[0].rows.push(template);
                    
                    }else {
                        nameList[0].cols[0].rows.push(template);
                    }
                }
            });

            const scroll = $$("editFormPopupScroll");

            if (scroll){
                scroll.addView( {rows : nameList}, 1 );
            }
        } catch (err){
            setFunctionError(err,logNameFile,"function createCheckboxes");
        }
    }
    
    createCheckboxes();
  

    let counter = 0;
    const checkboxes = $$("editFormPopupScrollContent").getChildViews();
    
    function countSelectCheckboxes(){
        try{
            checkboxes.forEach(function(el,i){
                if (el.config.id.includes("checkbox")){
                    const value = el.config.value;

                    if ( !(value) || value == "" ){
                        counter++;
                    }
                }
            });
        } catch (err){
            setFunctionError(err, logNameFile, "function countSelectCheckboxes");
        }
    } 

    function stateSelectAll(){
        try{
            const selectAll = $$("selectAll");
            if ( counter == 0 ){
                selectAll.config.value = 1;
                selectAll.refresh();
            } 
        } catch (err){
            setFunctionError(err, logNameFile, "function stateSelectAll");
        }
    }

    countSelectCheckboxes();
    stateSelectAll();
 
}

const editBtn = new Button({
    
    config   : {
        hotkey   : "Alt+A",
        value    : "Открыть редактор", 
        click    : editFiltersBtn
    },
    titleAttribute : "Добавить/удалить фильтры"

   
}).maxView();

export {
    editBtn
};