
import { setFunctionError }             from "../../blocks/errors.js";
import { LoadServerData, GetFields }    from "../../blocks/globalStorage.js";
import { mediator }                     from "../../blocks/_mediator.js";
import { RouterActions }                from "./actions/_RouterActions.js";

const logNameFile = "router => tree";

 
let id;



// function returnTopParent(){
//     let topParent;

//     const pull   = tree.data.pull;
//     const values = Object.values(pull);

//     values.forEach(function(el){
   
//         if ( el.webix_kids && !(tree.exists (id)) ){
//             topParent = el.id;
//         }

//     });

//     return topParent;
// }


async function getTableData (){

    await LoadServerData.content("fields");
    const keys = GetFields.keys;
 
    if (keys){
        mediator.sidebar.selectItem(id);
    }
}


async function createTableSpace (){
    RouterActions.createContentSpace();

    const isFieldsExists = GetFields.keys;
    try{   
        const tree = $$("tree");
        tree.attachEvent("onAfterLoad", 
        webix.once(function (){
            if (!isFieldsExists) {
                getTableData ();
            } 
        }));         
       
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "createTableSpace"
        );
    }

}



async function checkTable(){

    try {
        const isSidebarData = mediator.sidebar.dataLength();
        
        if (!isSidebarData){
            createTableSpace ();
            
        }
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "checkTable"
        );

    }    
  
}
async function treeRouter(selectId){
    id = selectId;

    checkTable();
}

export {
    treeRouter
};