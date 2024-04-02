import fs from "fs";

const readFromFile = (name: string) => {
    try {
        return fs.readFileSync(name, "utf-8");
    } catch (error) {
        console.error(`Error reading from file ${name}:`, error);
    }
}

const addrs = readFromFile("./addrs");

if (!addrs) {
    console.error("No addresses found");
    process.exit(1);
}

const [DREAM_SINGLETON_ADDRESS, DREAM_PROXY_FACTORY_ADDRESS, DREAMAKER_ADDRESS] = addrs.split(";");

console.log({
    DREAM_SINGLETON_ADDRESS,
    DREAM_PROXY_FACTORY_ADDRESS,
    DREAMAKER_ADDRESS
})

if (!DREAM_SINGLETON_ADDRESS || !DREAM_PROXY_FACTORY_ADDRESS || !DREAMAKER_ADDRESS) {
    console.error("Invalid addresses found");
    process.exit(1);
}

export {
    DREAM_SINGLETON_ADDRESS,
    DREAM_PROXY_FACTORY_ADDRESS,
    DREAMAKER_ADDRESS
}