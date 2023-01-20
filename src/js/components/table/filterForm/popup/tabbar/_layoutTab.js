 
///////////////////////////////

// Layout таббара с табами

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { tabbar }       from './tabbar.js';
import { tabForm }      from './tabForm.js';
import { tabLibrary }   from './tabLibrary.js';


const layoutTab = {
    rows:[
        tabbar,
                
        {   height : 200,
            cells  : [
                tabForm,
                tabLibrary,
            ]   
        },
    ]
};

export {
    layoutTab
};