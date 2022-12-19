
function add(){
    const tabbar = $$("globalTabbar");
    const id     = webix.uid();

    tabbar.addOption({
        id    : id, 
        value : "Новая вкладка", 
        info  : {},
        close : true, 
    }, true);

    tabbar.showOption(id);
}

function remove(){
    console.log('remove')
}

export {
    add,
    remove
};