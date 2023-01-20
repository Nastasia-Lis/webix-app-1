 
///////////////////////////////

// Кнопка, открывающая попап с редактором фильтров

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { editFiltersBtn } from "./click.js";
import { Button }         from "../../../../../viewTemplates/buttons.js";

const editBtn = new Button({
    
    config   : {
        hotkey   : "Alt+A",
        value    : "Открыть редактор", 
        click    : editFiltersBtn
    },
    titleAttribute : "Добавить/удалить фильтры"

   
}).maxView();

export {
    editBtn
};