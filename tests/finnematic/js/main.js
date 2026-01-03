import render from "./landing.js";
import loading from "./loading.js";



const main = async () => {

    await loading();
    render();

    

};

main();