import { Sequelize, Model, DataTypes, ModelDefined } from 'sequelize'
interface RunDateAttributes {
  dateType: string
  dateValue: Date
}

const TODAY = 'today'
const PREVIOUSMONTHEND = 'previousmonthend'

interface RunDateCreationAttributes { }

interface RunDateModel extends Model<RunDateAttributes, RunDateCreationAttributes>, RunDateAttributes {
  dateType: string
  dateValue: Date
}

const RunDate = function (sequelize: Sequelize): ModelDefined<RunDateAttributes, RunDateCreationAttributes> {
  return sequelize.define(
    'RunDate',
    {
      dateType: {
        type: DataTypes.TEXT,
        primaryKey: true
      },
      dateValue: {
        type: DataTypes.DATEONLY,
        allowNull: false
      }
    }, {
      createdAt: false,
      updatedAt: false,
      tableName: 'dates'
    })
}

export { RunDateModel, RunDate, RunDateAttributes, RunDateCreationAttributes, TODAY, PREVIOUSMONTHEND }
