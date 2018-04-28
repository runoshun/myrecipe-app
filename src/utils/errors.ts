export abstract class AppError implements Error {
    public readonly name: string;
    public readonly message: string;

    constructor(message: string) {
        this.message = message;
        this.name = this.constructor.name;
    }
}