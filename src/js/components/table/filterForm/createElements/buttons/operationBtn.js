
import { setFunctionError }    from "../../../../../blocks/errors.js";
import { Button }              from "../../../../../viewTemplates/buttons.js";
import { Filter }              from "../../actions/_FilterActions.js";


const logNameFile = "tableFilter => createElement => buttons => operationBtn";

 


function filterOperationsBtnLogic (idBtn, id){
  
    const btnFilterOperations = $$(idBtn);
    let operation;

    id === "notEqual" ? operation = "!="
    : id === "less"     ? operation = "<"
    : id === "more"     ? operation = ">"
    : id === "mrEqual"  ? operation = ">="
    : id === "lsEqual"  ? operation = "<="
    : id === "contains" ? operation = "⊆"
    : operation = "=";

    try {
        btnFilterOperations.setValue(operation);

    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "filterOperationsBtnLogic"
        );
    }



}
function addOperation (self, value, id){
    self.add( { 
        value: value,       
        id   : id      
    });
}

function addDefaultOperations(self){
    addOperation (self, '='       , "eql"     );
    addOperation (self, '!='      , "notEqual");
    
}

function addMoreLessOperations(self){
    addOperation (self, '< ' , "less"    );
    addOperation (self, '> ' , "more"    );
    addOperation (self, '>=' , "mrEqual" );
    addOperation (self, '<=' , "lsEqual" );  
}

function filterOperationsBtnData (typeField){

    return webix.once(function(){

        if (typeField == "combo" || typeField == "boolean" ){
            addDefaultOperations(this);

        } else if (typeField  == "text" ){
            addDefaultOperations(this);
            addOperation (this, "содержит", "contains");

        } else if (typeField  == "date"){
            addDefaultOperations  (this);
            addMoreLessOperations (this);

        } else if (typeField  == "integer"   ){
            addDefaultOperations  (this);
            addMoreLessOperations (this);
            addOperation (this, "содержит", "contains");

        }   
    });
}


function createOperationBtn(typeField, elemId){
    const popup = {
        view  : 'contextmenu',
        width : 100,
        data  : [],
        on    : {
            onMenuItemClick(id) {
                filterOperationsBtnLogic (idBtnOperation, id);
            },
            onAfterLoad: filterOperationsBtnData(typeField)
           
        }
    };
    
    const idBtnOperation = elemId + "-btnFilterOperations";

    const btn = new Button({
    
        config   : {
            id       : idBtnOperation,
            value    : "=", 
            width    : 40,
            popup    : popup,
            inputHeight:38,
            on:{
                onChange:function(value){
           
                    if (value == "contains"){
                        this.setValue("⊆");
                    }
                    Filter.setStateToStorage();
                }
            }
        },
        titleAttribute : "Выбрать условие поиска по полю",
        css            : "webix_filterBtns",
    
       
    }).maxView();
    
    return btn;
}

export {
    createOperationBtn
};