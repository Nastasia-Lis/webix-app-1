///////////////////////////////

// Создание query  

// Copyright (c) 2022 CA Expert

///////////////////////////////

function encodeQueryData(data) {
    const ret = [];
    for (let item in data){
        const name  = encodeURIComponent(item);
        const param = encodeURIComponent(data[item]);
        ret.push(name + '=' + param);
    }
 
    return ret.join('&');
}


// const data = { 
//     'query' : table + id, 
//     'sorts' : table, 
//     'limit' : 80 , 
//     'offset': 0 
// };


export {
    encodeQueryData
};