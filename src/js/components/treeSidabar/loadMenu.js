import { setFunctionError }             from "../../blocks/errors.js";

const logNameFile = " treeSidebar => loadMenu";

function generateChildsTree  (el){
    let childs = [];

    try {
        el.childs.forEach(function(child,i){
            childs.push({
                id     : child.name, 
                value  : child.title,
                action : child.action
            });
        });
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "generateChildsTree"
        );
    }
    return childs;
}

function generateParentTree  (el){ 
    let menuItem;
    try {                  
        menuItem = {
            id     : el.name, 
            value  : el.title,
            action : el.action,
        };

  
        if ( !(el.title) ){
            menuItem.value="Без названия";
        }

        if ( el.mtype == 2 ) {

            if ( el.childs.length == 0 ){
                menuItem.webix_kids = true; 
            } else {
                menuItem.data = generateChildsTree (el);
            }         
        } 

    

    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "generateParentTree"
        );
    }
    return menuItem;
} 


function generateMenuTree (menu){ 

    const menuTree   = [];
    const delims     = [];
    const tree       = $$("tree");
    const btnContext = $$("button-context-menu");

    let menuHeader = [];

    // menu.push ({
    //     "id": 77,
    //     "name": "sales",
    //     "title": "Sales",
    //     "mtype": 1,
    //     "ltype": 1,
    //     "action": "dashboard",
    //     "childs": []
    // });

    menu.forEach(function(el,i){
        if (el.mtype !== 3){
            menuTree.push  ( generateParentTree (el, menu, menuTree  ) );
            if (el.childs.length !==0){
                //menuHeader = generateHeaderMenu (el, menu, menuHeader);
            }
        } else {
            delims.push(el.name);
            menuTree.push({
                id       : el.name, 
                disabled : true,
                value    : ""
            });
        }
    
    });


    tree.clearAll();
    tree.parse(menuTree);

    let popupData = btnContext.config.popup.data;
    if (popupData !== undefined){
        popupData = menuHeader;
        btnContext.enable();
    }


    delims.forEach(function(el){
        tree.addCss(el, "tree_delim-items");

    });


}

export {
    generateMenuTree
};