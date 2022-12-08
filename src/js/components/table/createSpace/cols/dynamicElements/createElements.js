import { GetFields }              from "../../../../../blocks/globalStorage.js";

import { setFunctionError }       from "../../../../../blocks/errors.js";

import { Action }                 from '../../../../../blocks/commonFunctions.js';
import { Button }                 from '../../../../../viewTemplates/buttons.js';
import { generateCustomInputs }   from './createInputs.js';


const logNameFile = "table => createSpace => dynamicElements => createElements";

let data; 
let idCurrTable;
let idsParam;

let btnClass;
let formResizer;
let tools;

let secondaryBtnClass = "webix-transparent-btn";
let primaryBtnClass   = "webix-transparent-btn--primary";


function maxInputsSize (customInputs){

    const inpObj = {
        id      : "customInputs",
        css     : "webix_custom-inp", 
        rows    : [
            { height : 20 },
            { rows   : customInputs }
        ],
    };

       
    try{
        $$("viewToolsContainer").addView(inpObj, 0);
    
    } catch (err){
        setFunctionError(err, logNameFile, "maxInputsSize");
    } 
    

}

function toolMinAdaptive(){
    Action.hideItem($$("formsContainer"));
    Action.hideItem($$("tree"));
    Action.showItem($$("table-backFormsBtnFilter"));
    Action.hideItem(formResizer);

    tools.config.width = window.innerWidth - 45;
    tools.resize();
}


function toolMaxAdaptive(){
    const formsTools = $$("viewTools");

    btnClass = document.querySelector(".webix_btn-filter");
    
    if (btnClass.classList.contains(primaryBtnClass)){

        btnClass.classList.add   (secondaryBtnClass);
        btnClass.classList.remove(primaryBtnClass);
        Action.hideItem(tools);
        Action.hideItem(formResizer);
        

    } else if (btnClass.classList.contains(secondaryBtnClass)){

        btnClass.classList.add   (primaryBtnClass);
        btnClass.classList.remove(secondaryBtnClass);
        Action.showItem(tools);
        Action.showItem(formResizer);
        Action.showItem(formsTools);
    }
}

function setStateTool(){

   
    formResizer         = $$("formsTools-resizer");
    const contaierWidth = $$("container").$width;

    if(!(btnClass.classList.contains(secondaryBtnClass))){
   
        if (contaierWidth < 850  ){
            Action.hideItem($$("tree"));
            if (contaierWidth  < 850 ){
                toolMinAdaptive();
            }
        } else {
     
            Action.hideItem($$("table-backFormsBtnFilter"));
            tools.config.width = 350;
            tools.resize();
        }
        Action.showItem(formResizer);

    } else {
        Action.hideItem(tools);
        Action.hideItem(formResizer);
        Action.hideItem($$("table-backFormsBtnFilter"));
        Action.showItem($$("formsContainer"));
    }
}

function viewToolsBtnClick(){

    Action.hideItem($$("propTableView"));

    toolMaxAdaptive();

    setStateTool   ();

}

function adaptiveCustomInputs (){
    
    Action.removeItem($$("contextActionsBtn"));

    const viewToolsBtn  = $$("viewToolsBtn");
    tools               = $$("formsTools");

    if (data.inputs){  
   
        const customInputs  = generateCustomInputs (data, idCurrTable);
        const filterBar     = $$("table-view-filterId").getParentView();

        const btnTools = new Button({
            config   : {
                id       : "viewToolsBtn",
                hotkey   : "Ctrl+Shift+G",
                icon     : "icon-filter",
                click    : function(){
                    viewToolsBtnClick();
                },
            },
            css            :  "webix_btn-filter",
            titleAttribute : "Показать/скрыть фильтры доступные дейсвтия"
        
           
        }).transparentView();

        
        if( !viewToolsBtn ){
            filterBar.addView( btnTools, 2 );
        } else {
            Action.showItem  (viewToolsBtn);
        }

        maxInputsSize  ( customInputs );

    } else {
        Action.hideItem(tools);
        Action.hideItem(viewToolsBtn);
      
    }
}

function createDynamicElems (id, ids){
    idCurrTable = id;
    idsParam    = ids;
    data        = GetFields.item(idsParam);  
 
    adaptiveCustomInputs ();

}

export {
    createDynamicElems
};