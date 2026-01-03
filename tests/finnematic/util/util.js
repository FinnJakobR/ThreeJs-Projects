//man muss http request machen damit ich ne file lesen kann! Internet ist toll
export async function readFile(path) {
    const res = await fetch(path);
    if(!res.ok) throw Error("[File Read Error]: " + res.statusText);
    return await res.text();
};
