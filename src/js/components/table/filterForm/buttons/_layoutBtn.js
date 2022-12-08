import { librarySaveBtn }   from "./libSaveBtn.js";
import { backBtn }          from "./backBtn.js";
import { editBtn }          from "./editBtn/_layout.js";
import { submitBtn }        from "./submitBtn.js";
import { resetBtn }         from "./resetBtn.js";

function buttonsFormFilter (name) {
    if ( name == "formResetBtn" ) {
        return resetBtn;
    } else if ( name == "formBtnSubmit" ){
        return submitBtn;
    } else if ( name == "formEditBtn" ){
        return editBtn;
    } else if ( name == "filterBackTableBtn" ){
        return backBtn;
    } else if ( name == "formLibrarySaveBtn" ){
        return librarySaveBtn;
    }
}

export {
    buttonsFormFilter
};

