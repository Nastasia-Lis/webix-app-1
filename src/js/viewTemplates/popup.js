  
///////////////////////////////

// Шаблон попапа

// Copyright (c) 2022 CA Expert

///////////////////////////////


class Popup {

    constructor (options){


        this.elements   = options.elements;

        this.headline  = {
            template    : "<div class='no-wrap-headline'>" + 
                            options.headline + 
                            "</div>", 
            css         : "webix_popup-headline", 
            borderless  : true, 
            height      : 40 
        };

        this.closeBtn  =  {
            view    : "button",
            id      : "buttonClosePopup",
            css     : "popup_close-btn",
            type    : "icon",
            hotkey  : "esc",
            width   : 25,
            icon    : 'wxi-close',
            click   : function(){
 
                if (options.closeClick){
                    const config =  options.closeConfig;
                    const elem = config ? config.currElem : null;
                    options.closeClick(elem);
                } else {
                    const popup = $$(options.config.id);
                    if (popup){
                        popup.destructor();
                    }
                }
         
             
            }
        };
  
        this.popupView  = {
            view    : "popup",
            css     : "webix_popup-config",
            modal   : true,
            escHide : true,
            position: "center",
            body    : {
                scroll : "y",
                rows   : [
                    {   css : "webix_popup-headline-wrapper", 
                        cols: [ 
                            this.headline,
                           // {},
                            this.closeBtn,
                            {width:12},
                        ]
                    },

                    this.elements
        
                ]
            }
        };


        this.options  = options.config;
        this.id       = options.config.id;

        this.values   = Object.values(this.options);
        this.keys     = Object.keys  (this.options);

      
    }


    addConfig(){
        const popup  = this.popupView; 
        const values = this.values;

        if (this.keys && this.keys.length){
            this.keys.forEach(function(option,i){
                popup[option] = values[i];
    
            });
        }
     
     
        return popup;

    }

    createView(){
        const popup  = this.popupView; 
        const values = this.values;

        if (this.keys && this.keys.length){
            this.keys.forEach(function(option,i){
                popup[option] = values[i];
    
            });
        }
     

      
        return webix.ui(this.addConfig());
    }

    showPopup(){
        $$(this.id).show();
     
    }


}

export {
    Popup
};