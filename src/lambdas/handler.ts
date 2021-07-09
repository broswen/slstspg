'use strict'

import { APIGatewayProxyEvent } from 'aws-lambda'

module.exports.hello = async (event: APIGatewayProxyEvent) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v2.0! Your function executed successfully!',
        input: event
      },
      null,
      2
    )
  }
}
