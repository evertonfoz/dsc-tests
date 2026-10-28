import {
  ArgumentsHost,
  Catch,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import type { Response } from 'express';
import { OrderAlreadyConfirmedException } from '../exceptions/order-already-confirmed.exception.js';
import { OrderNotFoundException } from '../exceptions/order-not-found.exception.js';
import { OrderStateInconsistencyException } from '../exceptions/order-state-inconsistency.exception.js';
import { PaymentNotApprovedException } from '../exceptions/payment-not-approved.exception.js';
import { PaymentNotFoundException } from '../exceptions/payment-not-found.exception.js';

type DomainExceptionClass = new (...args: never[]) => Error;

const DOMAIN_EXCEPTION_STATUS = new Map<DomainExceptionClass, HttpStatus>([
  [OrderNotFoundException, HttpStatus.NOT_FOUND],
  [PaymentNotFoundException, HttpStatus.NOT_FOUND],
  [OrderAlreadyConfirmedException, HttpStatus.CONFLICT],
  [PaymentNotApprovedException, HttpStatus.UNPROCESSABLE_ENTITY],
  [OrderStateInconsistencyException, HttpStatus.INTERNAL_SERVER_ERROR],
]);

@Catch()
export class DomainHttpExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const status = this.resolveStatus(exception);

    // Exceções não reconhecidas (HttpException, erros inesperados)
    // seguem o tratamento padrão do Nest.
    if (status === undefined) {
      return super.catch(exception, host);
    }

    const error = exception as Error;
    const response = host.switchToHttp().getResponse<Response>();

    response.status(status).json({
      statusCode: status,
      error: error.name,
      message: error.message,
    });
  }

  private resolveStatus(exception: unknown): HttpStatus | undefined {
    for (const [exceptionClass, status] of DOMAIN_EXCEPTION_STATUS) {
      if (exception instanceof exceptionClass) {
        return status;
      }
    }
    return undefined;
  }
}
