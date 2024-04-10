import { ValidationError } from "yup";
export { ValidationError } from "yup";
import { logError } from "./logger";

interface IWrappedError extends Error {
    originalError?: Error;
    toJSON?: () => string;
}

const getPropsToCopy = (error: IWrappedError) => {
    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        name,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        message,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        stack,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        constructor,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        originalError,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        toJSON,
        ...propsToCopy
    } = error;
    return propsToCopy;
};

export class OperationalError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class AuthError extends OperationalError {
    originalError?: Error;

    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = this.constructor.name;
        this.originalError = originalError;
        if (originalError && typeof originalError === "object") {
            Object.assign(this, getPropsToCopy(originalError));
        }
    }
}

export class BusinessError extends OperationalError {
    originalError?: Error;

    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = this.constructor.name;
        this.originalError = originalError;
        if (originalError && typeof originalError === "object") {
            Object.assign(this, getPropsToCopy(originalError));
        }
    }
}

export class ObjectNotFoundError extends OperationalError {
    originalError?: Error;

    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = this.constructor.name;
        this.originalError = originalError;
        if (originalError && typeof originalError === "object") {
            Object.assign(this, getPropsToCopy(originalError));
        }
    }
}

export class InternalError extends Error {
    originalError?: Error;

    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = this.constructor.name;
        this.originalError = originalError;
        if (originalError && typeof originalError === "object") {
            Object.assign(this, getPropsToCopy(originalError));
        }
    }
}

export class ConflictError extends Error {
    originalError?: Error;

    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = this.constructor.name;
        this.originalError = originalError;
        if (originalError && typeof originalError === "object") {
            Object.assign(this, getPropsToCopy(originalError));
        }
    }
}

export const errorHandler = (error: unknown, context: object): void => {
    if (
        !(error instanceof ValidationError) &&
        !(error instanceof OperationalError)
    ) {
        logError(error, "\nContext: ", JSON.stringify(context, null, 2));
    }
};
