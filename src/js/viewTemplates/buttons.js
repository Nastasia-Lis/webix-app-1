  
///////////////////////////////
//
// Шаблон кнопок 
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////


import { setFunctionError }           from "../blocks/errors.js";


class Button {

    constructor (options){
        this.buttonView = {
            view    : "button",
            height  : 42,
            on      : {

            }
        };
        this.options    = options.config;

        this.values     = Object.values(this.options);
        this.keys       = Object.keys  (this.options);
        this.adaptValue = options.adaptValue;

        this.title      = options.titleAttribute;

        this.onFunc     = options.onFunc;

        this.css        = options.css;
    }


    modifyTitle(index){
        this.title = this.title + " (" + this.values[index] + ")";
    }

    setAdaptiveValue(btn, adaptVal, mainVal){
   
        const width  = btn.$width;

        if (width < 120 &&  btn.config.value !== adaptVal ){
            btn.config.value = adaptVal;
            btn.refresh();
          
        } else if (width > 120 &&  btn.config.value !== mainVal ) {
            btn.config.value = mainVal;
            btn.refresh();
        }
    }

    addOnFunctions(button){
        const self = this;
        
        if (this.onFunc){
            const names  = Object.keys  (this.onFunc);
            const values = Object.values(this.onFunc);

            if (names && names.length){
                names.forEach(function(name,i){
                    button.on[name] = values[i];
                });
            }
          

        }

        button.on.onAfterRender = function () {
        
            this.getInputNode().setAttribute("title", self.title);

            if (self.adaptValue){
                self.setAdaptiveValue(this, self.adaptValue, self.options.value);
            }
        };
    }

    addCss(type){
        const button    = this.buttonView; 
        const customCss = this.css || "";

        if (type == "primary"){
            button.css = "webix_primary ";

        } else if (type == "delete"){
            button.css  = "webix_danger ";

        } else {
            button.css = type || "";
            button.css = button.css + " " + customCss || "";
        }
      
    }

    
    addConfig(){
        const button = this.buttonView; 
        const values = this.values;
        const self   = this;

        if (this.keys && this.keys.length){
            this.keys.forEach(function(option,i){

                button[option] = values[i];
    
                if (option === "hotkey"){
                    self.modifyTitle(i);
                }
    
            });
    
            this.addOnFunctions (button);
         
        }
  
        return button;

    }

    maxView(type){
        this.addCss(type);
        return this.addConfig();
    }

    minView(type){
        this.addCss(type);

        const button = this.buttonView;
   
        button.width = 50;
        button.type  = "icon";

        return this.addConfig();
    }

    transparentView(){
        this.addCss("webix-transparent-btn");

        const button = this.buttonView;
   
        button.width = 50;
        button.type  = "icon";
        return this.addConfig();
    }

    static transparentDefaultState(){
        const primaryClass   = "webix-transparent-btn--primary";
        const secondaryClass = "webix-transparent-btn";
        try{
            const btnClass = document.querySelector(".webix_btn-filter");
            if (btnClass && btnClass.classList.contains (primaryClass)){
            
                btnClass.classList.add   (secondaryClass);
                btnClass.classList.remove(primaryClass);
            }
        } catch (err){
            setFunctionError(
                err, 
                "buttons",
                "transparentViewDefaultState"
            );
        }
        
    }

}

export{
    Button
};