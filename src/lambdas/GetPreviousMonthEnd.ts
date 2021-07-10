'use strict'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Model, Sequelize } from 'sequelize'
import requestLoggerMiddleware from '../middleware/RequestLogger'
import { PREVIOUSMONTHEND, RunDate, RunDateAttributes, RunDateCreationAttributes } from '../models/RunDate'
import logger from '../logging/Logger'

const middy = require('@middy/core')

const jsonBodyParser = require('@middy/http-json-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')
const createError = require('http-errors')

const sequelize = new Sequelize(`postgres://postgres:password@${process.env.DBADDRESS}:${process.env.DBPORT}/dates`)
const rundate = RunDate(sequelize)

async function getPreviousMonthEnd (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
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
