
import { setFunctionError }  from "../../../blocks/errors.js";
import { saveSettings }      from "./buttons.js";

const logNameFile   = "settings => tabbar => tabbar";


function createHeadlineSpan(headMsg){
    return `<span class='webix_tabbar-filter-headline'>
            ${headMsg}
            </span>`;
}

const tabbar = {   
    view     : "tabbar",  
    type     : "top", 
    id       : "userprefsTabbar",
    css      : "webix_filter-popup-tabbar",
    multiview: true, 
    height   : 50,
    options  : [
        {   value: createHeadlineSpan("Рабочее пространство"), 
            id   : 'userprefsWorkspace' 
        },
        {   value: createHeadlineSpan("Другое"), 
            id   : 'userprefsOther' 
        },
    ],

    on       :{
        onBeforeTabClick:function(id){
            const tabbar    = $$("userprefsTabbar");
            const value     = tabbar.getValue();
            const tabbarVal = value + "Form";
            const form      = $$(tabbarVal);

            function disableBtn(btn){
                try{
                    if (btn.isEnabled()){
                        btn.disable();
                    }   
                } catch (err){
                    setFunctionError(err, logNameFile, "onBeforeTabClick");
                }
            }

            function createModalBox(){
                try{
                    webix.modalbox({
                        title   :"Данные не сохранены",
                        css     :"webix_modal-custom-save",
                        buttons :["Отмена", "Не сохранять", "Сохранить"],
                        width   :500,
                        text    :"Выберите действие перед тем как продолжить"
                    }).then(function(result){

                        if ( result == 1){
                            
                            const storageData = webix.storage.local.get(tabbarVal);
                            const saveBtn     = $$("userprefsSaveBtn");
                            const resetBtn    = $$("userprefsResetBtn");
                           

                            form.setValues(storageData);

                            tabbar.setValue(id);

                            disableBtn(saveBtn);
                            disableBtn(resetBtn);

                        } else if ( result == 2){
                            saveSettings ();
                            tabbar.setValue(id);
                        }
                    });
                } catch (err){
                    setFunctionError(err, logNameFile, "createModalBox");
                }
            }


            if (form.isDirty()){
                createModalBox();
                return false;
            }

        }
    }
};


export {
    tabbar
};