function prevBtnClick (){
    history.back();
}

function nextBtnClick (){
    history.forward();
}   

function backButtonBrowserLogic (){
    window.addEventListener('popstate', function(event) {
        window.location.replace(window.location.href);
        window.location.reload();
        
    });
}

export{
    prevBtnClick,
    nextBtnClick,
    backButtonBrowserLogic
};