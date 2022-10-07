export function textInputClean(){
  let mdView = null;

  webix.event(document.body, "mousedown", e => { 
    const targetView = $$(e);
    if (targetView && targetView.getInputNode){
      mdView = targetView;
    } 
  });
  
  webix.event(document, "click", e => { 
    const clickedView = $$(e);
    if (mdView && clickedView && clickedView.config.id !== mdView.config.id){
      e.cancelBubble = true; 
      webix.html.preventEvent(e);
    }
    mdView = null;
  }, { capture: true });
}