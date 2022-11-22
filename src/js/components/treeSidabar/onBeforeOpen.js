import { LoadServerData, GetMenu, GetFields }   from "../../blocks/globalStorage.js";
import { setFunctionError }                     from "../../blocks/errors.js";


const logNameFile = "treeSidebar => onBeforeOpen";

function onBeforeOpenFunc(id){
  
    const tree          = $$("tree");
    const selectedItem  = tree.getItem(id);
    const idLoadElement = "q-load_data-tree_" + webix.uid();
    const idNoneElement = "q-none_data-tree_" + webix.uid();

    function createLoadEl(){
        tree.data.add({
            id      :idLoadElement,
            disabled:true,
            value   :"Загрузка ..."
        }, 0, id );  
        
        tree.addCss(idLoadElement, "tree_load-items");
    }

    function createNoneEl(){
        tree.data.add({
            id      :idNoneElement,
            disabled:true,
            value   :"Раздел пуст"
        }, 0, id );  
    }

    async function getMenuChilds() {

        function isUniqueItem (menu, data){
            let check  = true;

            try{
                menu.forEach(function(el, i){
                    if (el.name == data){
                        check = false;
                        
                    }
                });
            } catch (err){
                setFunctionError(err, logNameFile, "isUniqueItem");
            }
            return check;
        }

        function removeTreeEls( noneEl = false ){
            try{
                if( tree.exists(idLoadElement)){
                    tree.remove(idLoadElement);
                }
                
                if( tree.exists(idNoneElement) && noneEl){
                    tree.remove(idNoneElement);
                }
            } catch (err){
                setFunctionError(err, logNameFile, "removeTreeEls");
            }
        }

        async function generateMenuData (typeChild){
            await LoadServerData.content("fields");
            await LoadServerData.content("mmenu");

            const menu   = GetMenu  .content;
            const keys   = GetFields.keys;
            const values = GetFields.values;
 
            let itemsExists = false;

            try{
            
                keys.forEach(function(data, i) {
                
                    
                    if (values[i].type == typeChild && isUniqueItem(menu, data)){ 
                
                        tree.data.add({
                                id      : data, 
                                value   : (values[i].plural) ? 
                                values[i].plural : values[i].singular, 
                                "type"  : values[i].type
                        }, 0, id ); 

                        if (!itemsExists){
                            itemsExists = true;
                        }
                       
                        removeTreeEls(true);
                
                    } 
 
                });

                if (!itemsExists){
                    removeTreeEls();
                    if( !(tree.exists(idNoneElement)) ){
                        createNoneEl();
                        tree.addCss(idNoneElement, "tree_none-items");
                    }
                }
            } catch (err){
                setFunctionError(err, logNameFile, "generateMenuData");
            }
    
        }

        if (selectedItem.action.includes("all_")){
            const index = selectedItem.action.indexOf("_");
            const type  = selectedItem.action.slice  (index + 1);
            generateMenuData (type);
        }
       
    }

    if (tree.getItem(id).$count === -1){
        createLoadEl();
        getMenuChilds();
    }


  
}

export {
    onBeforeOpenFunc
};