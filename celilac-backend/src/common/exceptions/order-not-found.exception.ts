export class OrderNotFoundException extends Error {
    constructor() {
        super('Order not found.');
        this.name = 'OrderNotFoundException';
    }
}