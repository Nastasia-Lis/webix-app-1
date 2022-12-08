import { setHeadlineBlock }  from "./title.js";
import { createHistoryBtns } from "./historyBtns.js";
import { createFavoriteBtn } from "./favoriteBtn.js";

function createHeadline(idTemplate, title = null){
    const headlineLayout = {
        css : "webix_block-headline",
        cols: [
            setHeadlineBlock(idTemplate, title),
            {},
            createHistoryBtns(),
            createFavoriteBtn()
        ]
    };

    return headlineLayout;
}


export {
    createHeadline
};
