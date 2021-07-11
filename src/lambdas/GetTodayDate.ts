'use strict'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import requestLoggerMiddleware from '../middleware/RequestLogger'
import { RunDate, RunDateAttributes, RunDateCreationAttributes, TODAY } from '../models/RunDate'
import { Model, Sequelize } from 'sequelize'
import { getRDSSecret, RDSSecret } from '../secrets/GetSecret'
import logger from '../logging/Logger'
const middy = require('@middy/core')

const jsonBodyParser = require('@middy/http-json-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')
const createError = require('http-errors')

async function getTodayDate (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const secret: RDSSecret = await getRDSSecret(process.env.DBSECRET!)
  const sequelize = new Sequelize(`postgres://${secret.username}:${secret.password}@${secret.host}:${secret.port}/dates`)
  const rundate = RunDate(sequelize)

  let today: Model<RunDateAttributes, RunDateCreationAttributes> | null
  try {
    today = await rundate.findOne({ where: { dateType: TODAY } })
  } catch (error) {
    logger.error(error)
    throw createError(500)
  }

  if (today == null) {
    logger.info(`date type not found: ${TODAY}`)
    throw createError(404)
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ date: today.dateValue })
  }
}

const handler = middy(getTodayDate)
  .use(requestLoggerMiddleware())
  .use(jsonBodyParser())
  .use(httpErrorHandler())

module.exports = { handler }
