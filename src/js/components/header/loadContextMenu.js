///////////////////////////////

// Меню пользователя. Загрузка

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { isArray }          from "../../blocks/commonFunctions.js";
function createItems (){

    const items = [];

    function pustItem(id, value, icon){
        const item = {
            id    : id, 
            value : value, 
            icon  : icon
        };

        if (id == "logout"){
            item.css = "webix_logout";
        }
      
        items.push(item);
    
        return items;
    }
    
    pustItem ("favs",       "Избранное",     "icon-star"     );
    pustItem ("settings",  "Настройки",      "icon-cog"      );
    pustItem ("cp",         "Смена пароля",  "icon-lock"     );
    pustItem ("logout",     "Выйти",         "icon-sign-out" );

      
   
    return items;
}

function generateHeaderMenu (menu){

    const btnContext = $$("button-context-menu");
    let menuHeader;

    if (isArray(menu, "header/loadContextMenu", "generateHeaderMenu")){
        menu.forEach(function(el,i){
            if (el.mtype !== 3){
                if (el.mtype !== 3 && el.childs.length !==0){
                    menuHeader = createItems (el, menu, menuHeader);
                }
            }
        
        });
    
        if (btnContext.config.popup.data !== undefined){
            btnContext.config.popup.data = menuHeader;
            btnContext.enable();
        }
    
    }
 

}

export {
    generateHeaderMenu
};