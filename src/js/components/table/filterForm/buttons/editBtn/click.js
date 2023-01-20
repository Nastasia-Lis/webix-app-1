 
///////////////////////////////

// Клик на кнопку открытия попапа с редактированием

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { createFilterPopup }  from "../../popup/_layoutPopup.js";
import { createLibTab }       from "./createLibTab.js";
import { createFieldsTab }    from "./createFieldsTab.js";

function editFiltersBtn (){

    createFilterPopup();

    createLibTab ();

    createFieldsTab();
 
}

export {
    editFiltersBtn
};