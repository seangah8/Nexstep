import { MongoClient, Db, Collection, Document } from 'mongodb'
import { loggerService } from './logger.service'
import { configLocal } from '../config/local.config'

export const dbService = {
	getCollection,
}

let dbConn: Db | null = null

async function getCollection<T extends Document = Document>(collectionName: string): Promise<Collection<T>> {
	try {
		const db : Db = await _connect()
		const collection : Collection<T> = db.collection<T>(collectionName)
		return collection
	} catch (err: any) {
		loggerService.error('Failed to get Mongo collection', err)
		throw err
	}
}

async function _connect(): Promise<Db> {
	if (dbConn) return dbConn

	try {
		const client : MongoClient = await MongoClient.connect(configLocal.dbURL)
		dbConn = client.db(configLocal.dbName)
		return dbConn
	} catch (err: any) {
		loggerService.error('Cannot Connect to DB', err)
		throw err
	}
}
