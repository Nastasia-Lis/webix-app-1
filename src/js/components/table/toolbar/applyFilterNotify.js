 
///////////////////////////////

// Маркер на таблице о применённых фильтрах

// Copyright (c) 2022 CA Expert

///////////////////////////////

function applyNotify(id){
  
    return   {
        cols:[
            {
                template   : "Фильтры применены",
                id         : id + "_applyNotify",
                hidden     : true,
                css        : "applyNotify",
                inputHeigth: 20,
                width      : 160,
                borderless : true,    
            },
             {}
        ]
    };
}

export {
    applyNotify
};