///////////////////////////////

// Получить id дашборда

// Copyright (c) 2022 CA Expert

/////////////////////////////// 

function getDashId ( idsParam ){
    const tree = $$("tree");
    let itemTreeId;

    if (idsParam){
        itemTreeId = idsParam;
    } else if (tree.getSelectedItem()){
        itemTreeId = tree.getSelectedItem().id;
    }

    return itemTreeId;
}

export {
    getDashId
};