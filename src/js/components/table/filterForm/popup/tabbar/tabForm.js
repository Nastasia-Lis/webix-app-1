 
///////////////////////////////

// Layout таба с выбором полей

// Copyright (c) 2022 CA Expert

///////////////////////////////

const tabForm = {   
    view        :"scrollview",
    id          : "editFormScroll", 
    borderless  : true, 
    css         : "webix_multivew-cell",
    scroll      : "y", 
    body        : { 
        id  : "editFormPopupScroll",
        rows: [ ]
    }

};


export {
    tabForm
};