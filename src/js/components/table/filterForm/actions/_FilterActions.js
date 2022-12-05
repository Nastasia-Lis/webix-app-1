
const visibleInputs = {};

class FilterPull {
    static pushInPull (key, el){
        visibleInputs[key].push(el);
    }

    static clearKey (key){
        visibleInputs[key] = [];
    }

    static clearAll(){
        
    }

    static lengthKey (key){
        return visibleInputs[key].length;
    }

    static length (){
        const keys = Object.keys(visibleInputs);
        return keys.length;
    }

    static getKey (key){
        return visibleInputs[key];
    }

    static get (){
        return visibleInputs;
    }
}

class Filter extends FilterPull {


    
}

export {
    Filter
};