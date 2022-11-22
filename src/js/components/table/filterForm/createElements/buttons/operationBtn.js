
import { setFunctionError }    from "../../../../../blocks/errors.js";

const logNameFile = "tableFilter => createElement => buttons => operationBtn";

function filterOperationsBtnLogic (idBtn,id){
    try {
        let btnFilterOperations = $$(idBtn);

        if (id === "eql"){
            btnFilterOperations.setValue("=");
            
        } else if (id === "notEqual"){
            btnFilterOperations.setValue("!=");

        } else if (id.includes("less")){
            btnFilterOperations.setValue("<");

        } else if (id  === "more"){
            btnFilterOperations.setValue(">");

        } else if (id === "mrEqual"){
            btnFilterOperations.setValue(">=");

        } else if (id === "lsEqual"){
            btnFilterOperations.setValue("<=");

        } else if (id === "contains"){
            btnFilterOperations.setValue("⊆");

        }
    } catch (err){
        setFunctionError(err,logNameFile,"filterOperationsBtnLogic");
    }

}

function filterOperationsBtnData (typeField){

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
    
    const idBtnOperation = elemId + "-btnFilterOperations";
    
    return {
        view        : "button",
        id          : idBtnOperation,
        css         : "webix_filterBtns",
        value       : "=",
        inputHeight : 38,
        width       : 40,
        popup       : {
            view  : 'contextmenu',
            width : 200,
            data  : [],
            on    : {
                onMenuItemClick(id) {
                    filterOperationsBtnLogic (idBtnOperation, id);
                },
                onAfterLoad: filterOperationsBtnData(typeField)
               
            }
        },
        on          :{
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Выбрать условие поиска по полю");
            },
        }
    
    };
}

export {
    createOperationBtn
};