export function paginationTable() {
    return {
          view:"pager",
          id:"pagerTable",
          size:20,
          group:5,
          template:`{common.prev()} 
        {common.pages()} {common.next()}`
    };
}