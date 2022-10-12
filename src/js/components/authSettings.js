
import {setLogValue} from '../blocks/logBlock.js';
import {setAjaxError,setFunctionError} from "../blocks/errors.js";

function doAuthCp (){
    try{
        const form = $$("cp-form");
        if ( form && form.validate()){
            
            let objPass = {op:"",np:""};
            let passData = form.getValues();
            objPass.np = passData.newPass;
            objPass.op = passData.oldPass;
            
            const postData = webix.ajax().post("/init/default/api/cp", objPass);
            
            postData.then(function(data){
                data = data.json();
                
                if (data.err_type == "i"){
                    setLogValue("success",data.err);
                } else {
                    setLogValue("error","authSettings function doAuthCp: "+data.err,"cp");

                }

                form.setDirty(false);
            });
            
            postData.fail(function(err){
                setAjaxError(err, "authSettings","doAuthCp post");
            });

        }
    } catch (err){
        setFunctionError(err,"authSettings","doAuthCp")
    }

}

const headline = {   
    template:"<div>Изменение пароля</div>",
    css:'webix_cp-form',
    height:35, 
    borderless:true
};

const userName = {   
    view:"template",
    id:"authName",
    css:"webix_userprefs-info",
    height:50, 
    borderless:true,
    template:function(){
        if (Object.keys($$("authName").getValues()).length !==0){
            return "<div style='display:inline-block;color:var(--primary);font-size:13px!important;font-weight:600'>"+
                    "Имя пользователя:</div>"+
                    "⠀"+
                    "<div style='display:inline-block;font-size:13px!important;font-weight:600'>"+
                    $$("authName").getValues()+
                    "<div>";
        } else {
            return "<div style='display:inline-block;color:var(--primary);font-size:13px!important;font-weight:600'>"+
                    "Имя пользователя:</div>"+
                    "⠀"+ 
                    "<div style='display:inline-block;font-size:13px!important;font-weight:600'>"+
                    "не указано</div>";
        }
    },
};

function generatePassInput(labelPass, namePass){
    return {   
        view:"text",
        width:300,
        labelPosition:"top", 
        type:"password",
        name:namePass,
        label:labelPass, 
    };
}


const btnSubmit = {   
    view:"button",
    height:48,
    width:300, 
    value:"Сменить пароль" , 
    css:"webix_primary", 
    click:doAuthCp
};

const authCp = {
    view:"form", 
    id:"cp-form",
    borderless:true,
    margin:5,
    elements:[
        headline,
        userName,
        generatePassInput("Старый пароль", "oldPass"),
        generatePassInput("Новый пароль", "newPass"),
        generatePassInput("Повтор нового пароля", "repeatPass"),
        {   margin:5, 
            cols:[
                btnSubmit,
            ]
        }
    ],

    rules:{
        $all:webix.rules.isNotEmpty,
        $obj:function(data){
            
            if (data.newPass != data.repeatPass){
                setLogValue("error","Новый пароль не совпадает с повтором");
            return false;
            }

            if (data.newPass == data.oldPass && $$("cp-form").isDirty() ){
                setLogValue("error","Новый пароль должен отличаться от старого");
                return false;
            }
            return true;
        }
    },
};


const authCpLayout = {
    id:"layout-cp",cols:[
        authCp,
        {}
    ]
};

export {
    authCpLayout
};