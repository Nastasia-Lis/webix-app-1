
import { setFunctionError }             from "../../blocks/errors.js";
import { LoadServerData, GetFields }    from "../../blocks/globalStorage.js";
import { mediator }                     from "../../blocks/_mediator.js";
import { getWorkspace }                 from "./common.js";

const logNameFile = "router => tree";

let id;


function selectTreeItem(){
    const tree   = $$("tree");

    const pull   = tree.data.pull;
    const values = Object.values(pull);

    let topParent;
    values.forEach(function(el,i){
   
        if ( el.webix_kids && !(tree.exists (id)) ){
        
            const obj = [el.id];
         
            tree.callEvent("onBeforeOpen", obj);

            topParent = el.id;
        }

    });


    function setScroll(){
        const scroll = tree.getScrollState();
        tree.scrollTo(0, scroll.y); 
    }

    if (tree.exists(id)){
        if (topParent){
        
            tree.open     (topParent, true);
            tree.select   (id);
            tree.showItem (id);

            setScroll();
        }

    }
}

async function getTableData (){

    await LoadServerData.content("fields");
    const keys = GetFields.keys;
 
    if (keys){
        mediator.sidebar.selectItem(id);
        selectTreeItem  ();
    }


}


async function createTableSpace (){
    await getWorkspace ();

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



function checkTable(){
    try {
        if (mediator.sidebar.dataLength() == 0){
            createTableSpace ();
            
        }
    } catch (err){
        setFunctionError(err, logNameFile, "checkTable");

    }    
  
}
function treeRouter(selectId){
    id = selectId;
    checkTable();

}

export {
    treeRouter
};