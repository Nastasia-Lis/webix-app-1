import { authCpLayout, doAuthCp } from "./_layout.js";

class UserAuth {
    constructor (){
        this.name = "user_auth";
    }

    create (){
        $$("container").addView(
            {   view   : "layout",
                id     : this.name, 
                css    : "webix_auth",
                hidden : true, 
                rows   : [
                    authCpLayout,
                    {}
                ],
            }, 
        7);

    }

    put (){
        return doAuthCp();
    }

}

export {
    UserAuth
};