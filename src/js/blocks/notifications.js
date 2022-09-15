function popupExec (titleText) { 

    return webix.confirm({
        width:300,
        ok: 'Да',
        cancel: 'Отмена',
        title:titleText,
        text:"Вы уверены, что хотите продолжить?"
    });
}


function modalBox (){
    return webix.modalbox({
        title:"Данные не сохранены",
        css:"webix_modal-custom-save",
        buttons:["Отмена", "Не сохранять", "Сохранить"],
        width:500,
        text:"Выберите действие перед тем как продолжить"

    });
}
export{
    popupExec,
    modalBox
};