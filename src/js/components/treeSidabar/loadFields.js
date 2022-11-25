import { LoadServerData, GetMenu, GetFields }   from "../../blocks/globalStorage.js";
import { setFunctionError }                     from "../../blocks/errors.js";


const logNameFile = "treeSidebar => loadFields";


let idLoadElement;
let idNoneElement;


let tree;
let id;

function returnId(type, uid){
    return "q-" + type + "_data-tree_" + uid;
}

function addDisableItem(idLoadElement, value, idParent = id){
    tree.data.add({
        id      :idLoadElement,
        disabled:true,
        value   :value
    }, 0, idParent );  
}

function createLoadEl(uid){
    const id = returnId("none", uid);
    addDisableItem (id, "Загрузка ...");
    tree.addCss    (id, "tree_load-items");
}

function createNoneEl(uid, idParent){
    const id = returnId("none", uid);
    addDisableItem (id, "Раздел пуст", idParent);
}


function isUniqueItem (menu, data){
    let check  = true;

    try{
        menu.forEach(function(el, i){
            if (el.name == data){
                check = false;
                
            }
        });
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "isUniqueItem"
        );
    }
    return check;
}

function isTrueType(values, typeChild){

    return values.type == typeChild;
}


function removeTreeEls( noneEl = false, uid ){
    const load = "q-load_data-tree_" + uid;
    const none = "q-none_data-tree_" + uid;
    try{
        if( tree.exists(load)){
            tree.remove(load);
        }
        
        if( tree.exists(none) && noneEl){
            tree.remove(none);
        }
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "removeTreeEls"
        );
    }
}


async function generateMenuData (typeChild, idParent, uid){
    await LoadServerData.content("fields");
    await LoadServerData.content("mmenu");

    const menu   = GetMenu  .content;
    const keys   = GetFields.keys;
    const values = GetFields.values;

    let itemsExists = false;

    if (keys){
        try{
        
            keys.forEach(function(data, i) {
    
                if (isTrueType(values[i], typeChild) && isUniqueItem(menu, data)){
            
                    tree.data.add({
                            id      : data, 
                            value   : (values[i].plural) ? 
                            values[i].plural : values[i].singular, 
                            "type"  : values[i].type
                    }, 0, idParent ); 

                    if (!itemsExists){
                        itemsExists = true;
                    }
                
                    removeTreeEls(true, uid);
            
                } 

            });

            if (!itemsExists){
                removeTreeEls(false, uid);
                const noneEl =  "q-none_data-tree_" + uid;
            
                if( !(tree.exists(noneEl)) ){
                    createNoneEl(uid, idParent);
                    tree.addCss(noneEl, "tree_none-items");
                }
            }
        } catch (err){
            setFunctionError(
                err, 
                logNameFile, 
                "generateMenuData"
            );
        }
    }

}


async function getMenuChilds(uid) {

    const selectedItem  = tree.getItem(id);
    if (selectedItem.action.includes("all_")){
        const index = selectedItem.action.indexOf("_");
        const type  = selectedItem.action.slice  (index + 1);
  
        generateMenuData (type, id, uid);
    }
   
}



function loadFields(selectId){
    const uid = webix.uid();
  
    tree = $$("tree");
    id   = selectId;

    if (tree.getItem(id).$count === -1){
        createLoadEl (uid);
        getMenuChilds(uid);
    }
  
}

export {
    loadFields
};