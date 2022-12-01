function propertyTemplate (idProp){
    return {
        view:"property",  
        id:idProp, 
        tooltip:"Имя: #label#<br> Значение: #value#",
        width:348,
        nameWidth:150,
        editable:true,
        scroll:true,
        hidden:true,
    };
}

export {
    propertyTemplate
};