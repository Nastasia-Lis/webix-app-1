
import { setFunctionError }   from "../../../../../blocks/errors.js";
import { Action }             from "../../../../../blocks/commonFunctions.js";
import { SELECT_TEMPLATE }    from "../../userTemplate.js";


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

    if (SELECT_TEMPLATE && SELECT_TEMPLATE.id){
        radio.setValue   (SELECT_TEMPLATE.id);
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
    const values     = Object.values(checkboxes);
    let counter = 0;
    
    function countChecked(){
        try{
            values.forEach(function(el,i){
                if (el){
                    counter++;
                }
            });
        } catch(err){
            setFunctionError(
                err, 
                logNameFile, 
                "countChecked"
            );
        }
    }
    
    function setStateSubmitBtn(){
        if (counter > 0){
            btnSubmitState ("enable");
        } else {
            btnSubmitState ("disable");
        }
    }

    countChecked     ();
    visibleRemoveBtn (false);
    setStateSubmitBtn();
   
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
