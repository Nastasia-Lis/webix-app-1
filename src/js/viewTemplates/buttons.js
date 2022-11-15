class Button{

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

            names.forEach(function(name,i){
                button.on[name] = values[i];
            });

        }

        button.on.onAfterRender = function () {
        
            this.getInputNode().setAttribute("title", self.title);

            if (self.adaptValue){
                self.setAdaptiveValue(this, self.adaptValue, self.options.value);
            }
        };
    }

    addCss(type){
        const button = this.buttonView; 

        if (type == "primary"){
            button.css = "webix_primary";
        } else if (type == "delete"){
            button.css = "webix_danger";
        } else {
            button.css = type;
        }
      
    }

    
    addConfig(){
        const button = this.buttonView; 
        const values = this.values;
        const self   = this;

        this.keys.forEach(function(option,i){

            button[option] = values[i];

            if (option === "hotkey"){
                self.modifyTitle(i);
            }

        });

        this.addOnFunctions (button);
     
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

}

   
const prevBtn = {
    view    : "button",
    id      : webix.uid(),
    css     : "webix-transparent-btn btn-history",
    type    : "icon",
    icon    : "icon-arrow-left",
    width   : 50,
    hotkey  : "ctrl+shift+p",
    click   : function(){
        prevBtnClick();
    },
    on      : {
        onAfterRender: function () {
            this.getInputNode().setAttribute("title","Вернуться назад (Ctrl+Shift+P)");
        },
    }

    
};


export{
    Button
};