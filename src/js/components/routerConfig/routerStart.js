function setRouterStart(){
    if (window.location.host.includes("localhost:3000")){
        Backbone.history.start({pushState: true, root: '/index.html/'});
    } else {
        Backbone.history.start({pushState: true, root: '/init/default/spaw/'});
    }
}

export {
    setRouterStart
};