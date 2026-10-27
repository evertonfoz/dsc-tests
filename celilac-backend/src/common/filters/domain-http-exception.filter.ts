import { ArgumentsHost, Catch, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { OrderNotFoundException } from "../exceptions/order-not-found.exception.js";
import { PaymentNotFoundException } from "../exceptions/payment-not-found.exception.js";
import { PaymentNotApprovedException } from "../exceptions/payment-not-approved.exception.js";
import { OrderAlreadyConfirmedException } from "../exceptions/order-already-confirmed.exception.js";
import type { Response } from 'express';

type DomainExceptionClass = new (...args: never[]) => Error;

const DOMAIN_EXCEPTION_STATUS = new Map<DomainExceptionClass, HttpStatus>(
    [
        [OrderNotFoundException, HttpStatus.NOT_FOUND],
        [PaymentNotFoundException, HttpStatus.NOT_FOUND],
        [OrderAlreadyConfirmedException, HttpStatus.CONFLICT],
        [PaymentNotApprovedException, HttpStatus.UNPROCESSABLE_ENTITY],
    ]
);

@Catch()
export class DomainHttpExceptionFilter extends BaseExceptionFilter {
    catch(exception : unknown, host: ArgumentsHost) {
        const status = this.resolveStatus(exception);
        if (status === undefined) {
            return super.catch(exception, host);
        }

        const error = exception as Error;
        const response = host.switchToHttp().getResponse<Response>();

        response.status(status).json({
            statusCode: status,
            message: error.message,
            error: error.name
        });
    }

    private resolveStatus(exception: unknown): HttpStatus | undefined {
        for (const [ExceptionClass, status] of DOMAIN_EXCEPTION_STATUS.entries()) {
            if (exception instanceof ExceptionClass) {
                return status;
            }
        }
        return undefined;
    }
}