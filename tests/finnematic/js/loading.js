 


 export default async function loading() {


    return new Promise((resolve, reject) => {

            const x = document.getElementById("logo");
            const img = x.children[0];

                requestAnimationFrame(() => {
                    x.classList.add("active");
                });


                const length = 4;
                const url = "./assets/00";

                const colors = [
                        "#ed1d24",
                        "white",
                        "black",
                        "#746bab",
                        
                ];

                const speed = 1000 / 12; // 5 bilder die sec
                const animLength  = 1.9 * 1000; // in sec
                let i = 1;

                const cssAnimLength = 3.2 * 1000;


                const intervall = setInterval(() => {
                        const newColor = colors[(i % length)];
                        document.body.style.backgroundColor = newColor;        
                        const newImage = url + ((i % length) + 1) + ".png";
                        img.src = newImage;
                        i++;

                        document.body.style.backgroundColor = newColor;        
                    }, speed);

                setTimeout(() => {
                    clearInterval(intervall)
                }, animLength); 


                setTimeout(() => {
                    
                    x.style.display = "none";

                    requestAnimationFrame(()=> {
                        resolve();
                    });

                }, cssAnimLength)

    });
 }
 
 
 