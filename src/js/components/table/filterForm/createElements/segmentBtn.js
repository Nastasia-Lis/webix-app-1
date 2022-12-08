function segmentBtn(element, isChild, uniqueId){
    let id;
    let hideAttribute = false;

    const idEl = element.id + "_filter";

    if (isChild){
        id = idEl + "-child-" + uniqueId;
    } else {
        id            = idEl;
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