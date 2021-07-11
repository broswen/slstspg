'use strict'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Model, Sequelize } from 'sequelize'
import requestLoggerMiddleware from '../middleware/RequestLogger'
import { PREVIOUSMONTHEND, RunDate, RunDateAttributes, RunDateCreationAttributes } from '../models/RunDate'
import logger from '../logging/Logger'
import { RDSSecret, getRDSSecret } from '../secrets/GetSecret'
const middy = require('@middy/core')

const jsonBodyParser = require('@middy/http-json-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')
const createError = require('http-errors')

let sequelize: Sequelize

async function getPreviousMonthEnd(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const secret: RDSSecret = await getRDSSecret(process.env.DBSECRET!)
  try {
    sequelize = new Sequelize(`postgres://${secret.username}:${secret.password}@${secret.host}:${secret.port}/dates`)
    await sequelize.authenticate();
  } catch (error) {
    logger.error(error)
    throw createError(500)
  }
  const rundate = RunDate(sequelize)

  let previousMonthEnd: Model<RunDateAttributes, RunDateCreationAttributes> | null
  try {
    previousMonthEnd = await rundate.findOne({ where: { dateType: PREVIOUSMONTHEND } })
  } catch (error) {
    logger.error(error)
    throw createError(500)
  }

  if (previousMonthEnd == null) {
    logger.info(`date type not found: ${PREVIOUSMONTHEND}`)
    throw createError(404)
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ date: previousMonthEnd.dateValue })
  }
}

const handler = middy(getPreviousMonthEnd)
  .use(requestLoggerMiddleware())
  .use(jsonBodyParser())
  .use(httpErrorHandler())

module.exports = { handler }
