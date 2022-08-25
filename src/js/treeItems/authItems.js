import {notify} from "../modules/editTableForm.js";
function doAuthCp (){
    if ( $$("cp-form").validate()){
        let objPass = {op:"",np:""};
        let passData = $$("cp-form").getValues();
        objPass.np = passData.newPass;
        objPass.op = passData.oldPass;
        webix.ajax().post("/init/default/api/cp", objPass, {
            success:function( ){
                notify ("success","Пароль обновлён", true);
            },
            error:function(){
                notify ("error","Ошибка при обновлении пароля", true);
            }
        });
    } 
  
}

const authCp = {
    view:"form", 
    id:"cp-form",
    borderless:true,
    margin:5,
    elements:[
        {template:"<div>Изменение пароля</div>",css:'webix_cp-form',height:35, borderless:true},
        { view:"text",width:300,labelPosition:"top", type:"password",label:"Старый пароль", name:"oldPass"},
        { view:"text",width:300,labelPosition:"top", type:"password", label:"Новый пароль", name:"newPass"},
        { view:"text",width:300,labelPosition:"top", type:"password", label:"Повтор нового пароля", name:"repeatPass"},
        { margin:5, cols:[
            { view:"button",height:48,width:300, value:"Сменить пароль" , css:"webix_primary", click:doAuthCp},
        ]}
    ],

    rules:{
        $all:webix.rules.isNotEmpty,
        $obj:function(data){

            if (data.newPass != data.repeatPass){
                notify ("error","Новый пароль не совпадает с повтором",true);
              return false;
            }

            if (data.newPass == data.oldPass && $$("cp-form").isDirty() ){
                notify ("error","Новый пароль должен отличаться от старого",true);
              return false;
            }
            return true;
        }
    },

};

const authCpLayout = {
    id:"layout-cp",cols:[authCp,{}]
};

export {
    authCpLayout
};