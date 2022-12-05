function navigate(path){
    Backbone.history.start({pushState: true, root: path});
}

function setRouterStart(){
    if (window.location.host.includes("localhost:3000")){
        navigate('/index.html/');
    } else {
        navigate('/init/default/spaw/');
    }
}

export {
    setRouterStart
};