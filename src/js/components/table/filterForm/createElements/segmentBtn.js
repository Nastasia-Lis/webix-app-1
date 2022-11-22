function segmentBtn(element, isChild, uniqueId){
    let id;
    let hideAttribute = false;

    if (isChild){
        id = element.id + "_filter-child-" + uniqueId;
    } else {
        id            = element.id + "_filter";
        hideAttribute = true;
    }

    return {
        view    : "segmented", 
        id      : id + "_segmentBtn",
        hidden  : hideAttribute,
        value   : 1, 
        options : [
            { "id" : "1", "value" : "и" }, 
            { "id" : "2", "value" : "или" }, 
        ]
    };
}

export {
    segmentBtn
};