function createParameters(params){
    const paramsObj =  params;
    return  "?" + new URLSearchParams(paramsObj).toString();
}

function setParamToLink(vals){
    const params = createParameters(vals);
    window.history.replaceState(null, null, params);
    
}

function removeParamFromLink(id){
    const oldUrl = window.location.href;
    const url    = new URL(oldUrl);

    url.searchParams.delete(id);

    history.replaceState(null, null, url);
}

export {
    setParamToLink,
    removeParamFromLink
};
