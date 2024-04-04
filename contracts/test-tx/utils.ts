import fs from "fs";

const readFromFile = (name: string) => {
    try {
        return fs.readFileSync(name, "utf-8");
    } catch (error) {
        console.error(`Error reading from file ${name}:`, error);
    }
}

export const preprendToaddr = (data: string) => {
    const current = readFromFile("./addrs");
    if (!current) {
        console.error("No addresses found");
        process.exit(1);
    }

    const [a, b, c] = current.split(";");

    fs.writeFileSync("./addrs", `${a};${b};${c};${data}`);
}

export const GET_PROXY_ADDRESS = () => {
    const data = readFromFile("./addrs");
    if (!data) {
        console.error("No addresses found");
        process.exit(1);
    }
    const addr = data.split(";")[3] || "";
    if (!addr) {
        console.error("No proxy address found");
        process.exit(1);
    }
    return addr;
}

const addrs = readFromFile("./addrs");

if (!addrs) {
    console.error("No addresses found");
    process.exit(1);
}

const [DREAM_SINGLETON_ADDRESS, DREAM_PROXY_FACTORY_ADDRESS, DREAMAKER_ADDRESS, PROXY_ADDRESS] = addrs.split(";");

if (!DREAM_SINGLETON_ADDRESS || !DREAM_PROXY_FACTORY_ADDRESS || !DREAMAKER_ADDRESS) {
    console.error("Invalid addresses found");
    process.exit(1);
}

export {
    DREAM_SINGLETON_ADDRESS,
    DREAM_PROXY_FACTORY_ADDRESS,
    DREAMAKER_ADDRESS,
    PROXY_ADDRESS
}