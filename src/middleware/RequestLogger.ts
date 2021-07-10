import { APIGatewayProxyEvent } from "aws-lambda"

const winston = require('winston')

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({})
    ]
})

const requestLoggerMiddleware = (options?) => {
    let requestLoggerBefore = async (request: { event: APIGatewayProxyEvent }) => {
        logger.info({
            method: request.event.httpMethod,
            path: request.event.path,
            sourceIp: request.event.requestContext.identity.sourceIp
        }
    }

    return {
        before: requestLoggerBefore
    }

}

export default requestLoggerMiddleware