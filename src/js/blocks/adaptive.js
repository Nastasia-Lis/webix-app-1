
function resizeAdaptive (){
    window.addEventListener('resize', function(event) {
        
        if ($$("tree").isVisible()){
        } else {
            if(window.innerWidth <= 800){
                if($$("sideMenuResizer")){
                    $$("sideMenuResizer").hide(); 
                }
            } 
        }


    }, true);
}
console.log(window.innerWidth)


if (window.innerWidth < 830){

    // window.onload = function (){
    //     console.log($$("table-view-filterIdView"))
    //     let filterBar = $$("table-view-filterIdView").getParentView();
    // }

    
  //  filterBar.addView({template:"ueue"})
            
    // if ($$( "customInputs" )){
    //     filterBar.removeView($$( "customInputs" ))
    // }


}

export {
    resizeAdaptive
};