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