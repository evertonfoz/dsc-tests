export class OrderAlreadyConfirmedException extends Error {
    constructor() {
        super('Order is already confirmed.');
        this.name = 'OrderAlreadyConfirmedException';
    }
}