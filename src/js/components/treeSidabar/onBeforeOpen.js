import {STORAGE,getData} from "../../blocks/globalStorage.js";
import {setAjaxError,setFunctionError} from "../../blocks/errors.js";


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

        if (!STORAGE.fields){
            await getData("fields"); 
      
        }

        const content = STORAGE.fields.content;
        const obj     = Object.keys(content); 

        function findNotUniqueItem (data){
            let check = false;
            try{
                STORAGE.mmenu.mmenu.forEach(function(el,i){
                    if (el.name == data){
                        check = true;
                        
                    }
                });
            } catch (err){
                setFunctionError(err,logNameFile,"findNotUniqueItem");
            }
            return check;
        }

        function removeTreeEls(noneEl=false){
            try{
                if( tree.exists(idLoadElement)){
                    tree.remove(idLoadElement);
                }
                
                if( tree.exists(idNoneElement) && noneEl){
                    tree.remove(idNoneElement);
                }
            } catch (err){
                setFunctionError(err,logNameFile,"removeTreeEls");
            }
        }

        function generateMenuData (typeChild){
            let itemsExists = false;
            try{
            
                obj.forEach(function(data) {
                   
                    if (content[data].type == typeChild && !findNotUniqueItem(data)){ 
             
                        tree.data.add({
                                id      : data, 
                                value   : (content[data].plural) ? 
                                content[data].plural         : 
                                content[data].singular       , 
                                "type"  : content[data].type
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
                setFunctionError(err,logNameFile,"generateMenuData");
            }
    
        }



        if (selectedItem.action.includes("all_")){
            const index = selectedItem.action.indexOf("_");
            const type  = selectedItem.action.slice(index + 1);
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