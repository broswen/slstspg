
import { GetSecretValueCommand, GetSecretValueCommandInput, GetSecretValueCommandOutput, SecretsManagerClient } from '@aws-sdk/client-secrets-manager'
import logger from '../logging/Logger'
const smClient: SecretsManagerClient = new SecretsManagerClient({})

interface RDSSecret {
  username: string
  password: string
  engine: string
  host: string
  port: number
  dbInstanceIdentifier: string
}

async function getRDSSecret(secretArn: string): Promise<RDSSecret> {
  const getSecretInput: GetSecretValueCommandInput = {
    SecretId: process.env.DBSECRET
  }
  let getSecretResponse: GetSecretValueCommandOutput = await smClient.send(new GetSecretValueCommand(getSecretInput))

  if (getSecretResponse.SecretString == null) {
    throw new Error(`SecretString is null for ${secretArn}`)
  }

  let secret: RDSSecret
  try {
    secret = JSON.parse(getSecretResponse.SecretString!)
  } catch (error) {
    throw new Error(`unable to parse SecretString for ${secretArn}`)  
  }


  return secret;
}

export { getRDSSecret, RDSSecret}