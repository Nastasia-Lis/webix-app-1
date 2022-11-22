import { setFunctionError }   from "../../../../blocks/errors.js";

import { Button }             from '../../../../viewTemplates/buttons.js';
import { Popup }              from '../../../../viewTemplates/popup.js';

const logNameFile = "table => createSpace => popupNotAuth";

function destructPopup(){
    try{
        const popup = $$("popupNotAuth");
        if (popup){
            popup.destructor();
        }
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "notAuthPopup btnClosePopup click"
        );
    }
}


const popupSubtitle = {   
    template    : "Войдите в систему, чтобы продолжить.",
    css         : "webix_template-not-found-descr", 
    borderless  : true, 
    height      : 35 
};



function submitClick(){

    function navigate(){
        try{
            Backbone.history.navigate("/", { trigger:true});
            window.location.reload();

        } catch (err){
            setFunctionError(
                err, 
                logNameFile,
                "notAuthPopup navigate"
            );
        }
    }
    destructPopup();
    navigate();
 
}

const mainBtnPopup = new Button({

    config   : {
        id       : "webix_btn-go-login",
        hotkey   : "Shift+Space",
        value    : "Войти", 
        click   : function(){
            submitClick();
        },
    },
    titleAttribute : "Перейти на страницу авторизации"

   
}).maxView("primary");


function popupNotAuth(){

    const popup = new Popup({
        headline : "Вы не авторизованы",
        config   : {
            id    : "popupNotAuth",
            width   : 340,
            height  : 125,
        },

        elements : {
            padding:{
                left : 5,
                right: 5
            },
            rows:[
                popupSubtitle,
                {   padding:{
                        left : 5,
                        right: 5
                    },
                    rows:[
                        mainBtnPopup,
                    ]
                }
            
            ]
          
        }
    });

    popup.createView ();
    popup.showPopup  ();

}


export {
    popupNotAuth
};