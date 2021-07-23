/**
 * @author WMXPY
 * @namespace DynamoManager
 * @description Document Manager
 */

import { AWSConfigUpdateCheckFunction, AWSConfigUpdateFunction } from "./declare";
import { DynamoDocumentManagerInstance } from "./document-manager-instance";

export class DynamoDocumentManager extends DynamoDocumentManagerInstance {

    private static _instance?: DynamoDocumentManager;

    public static get instance(): DynamoDocumentManager {

        return this.getInstance();
    }

    public static getInstance(): DynamoDocumentManager {

        if (!this._instance) {
            this._instance = new DynamoDocumentManager();
        }
        return this._instance;
    }

    public static declareConfigUpdateCheckFunction(configUpdateCheckFunction: AWSConfigUpdateCheckFunction): void {

        this.getInstance().declareConfigUpdateCheckFunction(configUpdateCheckFunction);
    }

    public static declareConfigUpdateFunction(configUpdateFunction: AWSConfigUpdateFunction): void {

        this.getInstance().declareConfigUpdateFunction(configUpdateFunction);
    }


    public static declareUpdatedFailedError(error: Error): void {

        this.getInstance().declareUpdatedFailedError(error);
    }

    public static async put(params: AWS.DynamoDB.DocumentClient.PutItemInput): Promise<void> {

        return this.getInstance().put(params);
    }

    public static async batchWrite(params: AWS.DynamoDB.DocumentClient.BatchWriteItemInput): Promise<AWS.DynamoDB.DocumentClient.BatchWriteItemOutput> {

        return this.getInstance().batchWrite(params);
    }

    public static async updateAndGetNew(params: AWS.DynamoDB.DocumentClient.UpdateItemInput): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput> {

        return this.getInstance().updateAndGetNew(params);
    }

    public static async get(params: AWS.DynamoDB.DocumentClient.GetItemInput): Promise<AWS.DynamoDB.DocumentClient.GetItemOutput> {

        return this.getInstance().get(params);
    }

    public static async batchGet(params: AWS.DynamoDB.DocumentClient.BatchGetItemInput): Promise<AWS.DynamoDB.DocumentClient.BatchGetItemOutput> {

        return this.getInstance().batchGet(params);
    }

    public static async query(params: AWS.DynamoDB.DocumentClient.QueryInput): Promise<AWS.DynamoDB.DocumentClient.QueryOutput> {

        return this.getInstance().query(params);
    }

    public static async scan(params: AWS.DynamoDB.DocumentClient.ScanInput): Promise<AWS.DynamoDB.DocumentClient.ScanOutput> {

        return this.getInstance().scan(params);
    }

    public static async continuesScan<T extends any>(params: AWS.DynamoDB.DocumentClient.ScanInput): Promise<T[]> {

        return this.getInstance().continuesScan(params);
    }

    private constructor() {
        super();
    }
}
