const formatData  = webix.Date.dateToStr("%d.%m.%y %H:%i:%s");


function createGuid() {  
    const mask = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return mask.replace(/[xy]/g, function(c) {  
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);  
    });  
}

function dateFormatting (el){
    const date = new Date(el.default);
    return formatData(date);
}

function returnDefaultValue (el){
    let defVal;



    const def      = el.default;
    const parsDate = Date.parse(new Date(def));

    const type     = el.type ;



    if (def === "now" && type == "datetime"){
        defVal = formatData(new Date());
 
    } else if (parsDate && type == "datetime" ){
        defVal = dateFormatting (el);

    } 

    else if (def && def.includes("make_guid")) {
        defVal = createGuid();

    } 
    
    else if (def == "False"){
        defVal = 2;

    } else if (def  == "True"){
        defVal = 1;

    } 

    else if (def !== "None" && def !== "null"){
        defVal = def;

    } else if (def  == "None"){
        defVal = "";

    } else if (def  == "null") {
        defVal = null;
    }


    return defVal;
}


export {
    returnDefaultValue
};