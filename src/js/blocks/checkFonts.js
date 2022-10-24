import {setLogValue} from "./logBlock.js";

function checkFonts (){


    document.fonts.onloadingdone = function (fontFaceSetEvent) {
        const fontsArr  = fontFaceSetEvent.fontfaces;
        let check       = false;
    
        fontsArr.forEach(function(el){
            if (el.family.includes("icomoon")){
                check = true; 
            }
        });

        if (!check){
            setLogValue("success","Не удалось загрузить шрифт иконок", 'expa');
        }


    };

}

export {
    checkFonts
};