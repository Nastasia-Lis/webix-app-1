 
///////////////////////////////

// Layout с кнопками в редакторе 

// Copyright (c) 2022 CA Expert

///////////////////////////////


import { submitBtn }   from './submitBtn.js';
import { removeBtn }   from './removeBtn.js';


const btnLayout = {
    cols   : [
        submitBtn,
        {width : 5},
        removeBtn,
    ]
};

export {
    btnLayout
};