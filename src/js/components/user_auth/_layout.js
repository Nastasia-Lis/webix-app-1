
import {setLogValue}                   from '../logBlock.js';
import {setAjaxError,setFunctionError} from "../../blocks/errors.js";

let form;
function returnPassData(){
    const passData = form.getValues();

    const objPass = {
        op: passData.oldPass,
        np: passData.newPass
    };

    return objPass;
}
function doAuthCp (){
    try{
        form = $$("cp-form");
        if ( form && form.validate()){

            const objPass = returnPassData();
            
            const url      = "/init/default/api/cp";
            const postData = webix.ajax().post(url, objPass);
            
            postData.then(function(data){
                data = data.json();
                
                if (data.err_type == "i"){
                    setLogValue("success", data.err);
                } else {
                    setLogValue(
                        "error",
                        "authSettings function doAuthCp: " + 
                        data.err, 
                        "cp"
                    );

                }

                form.setDirty(false);
            });
            
            postData.fail(function(err){
                setAjaxError(
                    err, 
                    "authSettings",
                    "doAuthCp"
                );
            });

        }
    } catch (err){
        setFunctionError(err,"authSettings","doAuthCp")
    }

}

const headline = {   
    template   : "<div>Изменение пароля</div>",
    css        : 'webix_cp-form',
    height     : 35, 
    borderless : true
};

const userName = {   
    view        : "template",
    id          : "authName",
    css         : "webix_userprefs-info",
    height      : 50, 
    borderless  : true,
    template    : function(){
        const values = $$("authName").getValues();
        const keys   = Object.keys(values);

        function returnDiv(text){
            const defaultStyles = "display:inline-block; font-size:13px!important; font-weight:600;";

            return "<div style='" + defaultStyles + "color:var(--primary);'>"+
            "Имя пользователя:</div>"+
            "⠀"+
            "<div style=' " + defaultStyles + " '>"+
            text +
            "<div>";
        }

        if (keys.length !== 0){
            return returnDiv (values);
        } else {
            return returnDiv ("не указано");
        }
    },
};

function generatePassInput(labelPass, namePass){
    return {   
        view            : "text",
        width           : 300,
        labelPosition   : "top", 
        type            : "password",
        name            : namePass,
        label           : labelPass, 
    };
}


const btnSubmit = {   
    view    : "button",
    height  : 48,
    width   : 300, 
    value   : "Сменить пароль" , 
    css     : "webix_primary", 
    click   : doAuthCp
};

const authCp = {
    view        : "form", 
    id          : "cp-form",
    borderless  : true,
    margin      : 5,
    elements    : [
        headline,
        userName,
        generatePassInput("Старый пароль"       , "oldPass"   ),
        generatePassInput("Новый пароль"        , "newPass"   ),
        generatePassInput("Повтор нового пароля", "repeatPass"),
        {   margin  : 5, 
            cols    : [
                btnSubmit,
            ]
        }
    ],

    rules:{
        $all:webix.rules.isNotEmpty,
        $obj:function(data){
            const checkCp = $$("cp-form").isDirty();

            if (data.newPass != data.repeatPass){
                setLogValue("error","Новый пароль не совпадает с повтором");
            return false;
            }

            if (data.newPass == data.oldPass && checkCp ){
                setLogValue("error","Новый пароль должен отличаться от старого");
                return false;
            }
            return true;
        }
    },
};


const authCpLayout = {
    id  : "layout-cp",
    cols: [
        authCp,
        {}
    ]
};

export {
    authCpLayout
};