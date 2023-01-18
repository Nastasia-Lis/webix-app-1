
import { setFunctionError }   from "../../../../../blocks/errors.js";
import { Action }             from "../../../../../blocks/commonFunctions.js";
import { Filter }             from "../../actions/_FilterActions.js";

const logNameFile = "tableFilter => popup => tabbar => tabbar";

function btnSubmitState (state){

    const btn = $$("popupFilterSubmitBtn");

    if (state=="enable"){
        Action.enableItem(btn);

    } else if (state=="disable"){
        Action.disableItem(btn);
        
    }
    
}

function visibleRemoveBtn (param){
    const btn = $$("editFormPopupLibRemoveBtn");
   
    if (param){
        Action.showItem(btn);
    } else {
        Action.hideItem(btn);
    }
    
}

function setSelectedOption(){
    const radio = $$("filterEditLib");

    const currTemplate = Filter.getActiveTemplate();

    if (currTemplate && currTemplate.id){
        radio.setValue   (currTemplate.id);
        Action.enableItem($$("editFormPopupLibRemoveBtn"));
        btnSubmitState   ("disable");
    }
}

function filterLibrary(){

    function setStateSubmitBtn (){
        
        if ($$("filterEditLib").getValue() !== "" ){
            btnSubmitState ("enable");
        } else {
            btnSubmitState ("disable");
        }
    }

    try{
 
        setStateSubmitBtn ();
        visibleRemoveBtn  (true);
        setSelectedOption ();
    }catch(err){
        setFunctionError(
            err, 
            logNameFile, 
            "filterLibrary"
        );
    }  

}



function editFilter (){
    
    const checkboxes = $$("editFormPopup").getValues();

    let counter = 0;
        

    function countChecked(){
        const values = Object.values(checkboxes);
        if (values && values.length){
            values.forEach(function(el){
                if (el){
                    counter++;
                }
            });
        }
           
        
    }
    
    function setStateSubmitBtn(){
        if (counter > 0){
            btnSubmitState ("enable");
        } else {
            btnSubmitState ("disable");
        }
    }

    if (checkboxes){

        countChecked     ();
        visibleRemoveBtn (false);
        setStateSubmitBtn();
    }
   
   
}


function tabbarClick (id){

    if (id =="editFormPopupLib"){
        filterLibrary();  
    }

    if (id =="editFormScroll"){
        editFilter ();
    } 

}


function returnDivHeadline(title){
    return  "<span" + 
            "class='webix_tabbar-filter-headline'>" +
            title +
            "</span>";
}



const tabbar =  {
    view        : "tabbar",  
    type        : "top", 
    id          : "filterPopupTabbar",
    css         : "webix_filter-popup-tabbar",
    multiview   : true, 
    height      : 50,

    options     : [
        {   value: returnDivHeadline("Поля"), 
            id: 'editFormScroll' 
        },
        {   value: returnDivHeadline("Библиотека"), 
            id: 'editFormPopupLib' 
        },
    ],

    on:{
        onAfterTabClick: function(id){
            tabbarClick(id);
        }
    }
};

export {
    tabbar
};
