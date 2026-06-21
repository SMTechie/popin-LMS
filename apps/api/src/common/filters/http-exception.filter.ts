import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;
    const responseMessage = typeof exceptionResponse === "object" && exceptionResponse && "message" in exceptionResponse
      ? (exceptionResponse as { message?: string | string[] }).message
      : null;
    const message = Array.isArray(responseMessage)
      ? responseMessage.join("; ")
      : responseMessage || (exception instanceof HttpException ? exception.message : "Internal error");

    response.status(status).json({
      statusCode: status,
      message,
      requestId: request.headers["x-request-id"]
    });
  }
}
