import Debug from "debug";

const DEBUG_NAMESPACE = "dreamaker";

export const logger = Debug(DEBUG_NAMESPACE);
export const logError = logger.extend("error");

const namespaces = Debug.disable();
Debug.enable(
    `${DEBUG_NAMESPACE}:error*,${DEBUG_NAMESPACE}${
        (namespaces && `,${namespaces}`) || ""
    }`
);
