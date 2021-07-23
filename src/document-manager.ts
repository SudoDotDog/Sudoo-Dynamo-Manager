/**
 * @author WMXPY
 * @namespace DynamoManager
 * @description Document Manager
 */

import * as AWS from "aws-sdk";
import { AWSConfigUpdateCheckFunction } from "./declare";

export class DynamoDocumentManager {

    private static _instance?: DynamoDocumentManager;

    public static get instance(): DynamoDocumentManager {

        if (!this._instance) {
            this._instance = new DynamoDocumentManager();
        }
        return this._instance;
    }

    private _updatedFailedError?: Error;
    private _configUpdateCheckFunction?: AWSConfigUpdateCheckFunction;

    private readonly _documentClient: AWS.DynamoDB.DocumentClient;

    private constructor() {

        this._documentClient = new AWS.DynamoDB.DocumentClient();
    }

    public async configUpdateCheck(): Promise<boolean> {

        if (!this._configUpdateCheckFunction) {
            return false;
        }
        return await Promise.resolve(this._configUpdateCheckFunction());
    }

    public async configUpdateEnsure(): Promise<void> {

        if (!await this.configUpdateCheck()) {

            if (typeof this._updatedFailedError === 'undefined') {
                throw new Error('[Sudoo-Dynamo-Manager] Initialize check failed');
            } else {
                throw this._updatedFailedError;
            }
        }
        return;
    }

    public declareConfigUpdateCheckFunction(
        configUpdateCheckFunction: AWSConfigUpdateCheckFunction,
    ): this {

        this._configUpdateCheckFunction = configUpdateCheckFunction;
        return this;
    }

    public declareUpdatedFailedError(
        error: Error,
    ): this {

        this._updatedFailedError = error;
        return this;
    }

    public async put(params: AWS.DynamoDB.DocumentClient.PutItemInput): Promise<void> {

        await this.configUpdateEnsure();

        return await new Promise<void>((resolve: () => void, reject: (reason: any) => void) => {

            this._documentClient.put(
                params,
                (err: any) => {

                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                },
            );
        });
    }

    public async batchWrite(params: AWS.DynamoDB.DocumentClient.BatchWriteItemInput): Promise<AWS.DynamoDB.DocumentClient.BatchWriteItemOutput> {

        await this.configUpdateEnsure();

        return await new Promise<AWS.DynamoDB.DocumentClient.BatchWriteItemOutput>((resolve: (data: AWS.DynamoDB.DocumentClient.BatchWriteItemOutput) => void, reject: (reason: any) => void) => {

            this._documentClient.batchWrite(
                params,
                (err: any, data: AWS.DynamoDB.DocumentClient.BatchWriteItemOutput) => {

                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                },
            );
        });
    }

    public async updateAndGetNew(params: AWS.DynamoDB.DocumentClient.UpdateItemInput): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput> {

        await this.configUpdateEnsure();

        return await new Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput>((resolve: (data: AWS.DynamoDB.DocumentClient.UpdateItemOutput) => void, reject: (reason: any) => void) => {

            this._documentClient.update(
                {
                    ...params,
                    ReturnValues: 'UPDATED_NEW',
                },
                (err: any, data: AWS.DynamoDB.DocumentClient.UpdateItemOutput) => {

                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                },
            );
        });
    }

    public async get(params: AWS.DynamoDB.DocumentClient.GetItemInput): Promise<AWS.DynamoDB.DocumentClient.GetItemOutput> {

        await this.configUpdateEnsure();

        return await new Promise<AWS.DynamoDB.DocumentClient.GetItemOutput>((resolve: (data: AWS.DynamoDB.DocumentClient.GetItemOutput) => void, reject: (reason: any) => void) => {

            this._documentClient.get(
                params,
                (err: any, data: AWS.DynamoDB.DocumentClient.GetItemOutput) => {

                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                },
            );
        });
    }

    public async batchGet(params: AWS.DynamoDB.DocumentClient.BatchGetItemInput): Promise<AWS.DynamoDB.DocumentClient.BatchGetItemOutput> {

        await this.configUpdateEnsure();

        return await new Promise<AWS.DynamoDB.DocumentClient.BatchGetItemOutput>((resolve: (data: AWS.DynamoDB.DocumentClient.BatchGetItemOutput) => void, reject: (reason: any) => void) => {

            this._documentClient.batchGet(
                params,
                (err: any, data: AWS.DynamoDB.DocumentClient.BatchGetItemOutput) => {

                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                },
            );
        });
    }

    public async query(params: AWS.DynamoDB.DocumentClient.QueryInput): Promise<AWS.DynamoDB.DocumentClient.QueryOutput> {

        await this.configUpdateEnsure();

        return await new Promise<AWS.DynamoDB.DocumentClient.QueryOutput>((resolve: (data: AWS.DynamoDB.DocumentClient.QueryOutput) => void, reject: (reason: any) => void) => {

            this._documentClient.query(
                params,
                (err: any, data: AWS.DynamoDB.DocumentClient.QueryOutput) => {

                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                },
            );
        });
    }

    public async scan(params: AWS.DynamoDB.DocumentClient.ScanInput): Promise<AWS.DynamoDB.DocumentClient.ScanOutput> {

        await this.configUpdateEnsure();

        return await new Promise<AWS.DynamoDB.DocumentClient.ScanOutput>((resolve: (data: AWS.DynamoDB.DocumentClient.ScanOutput) => void, reject: (reason: any) => void) => {

            this._documentClient.scan(
                params,
                (err: any, data: AWS.DynamoDB.DocumentClient.ScanOutput) => {

                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                },
            );
        });
    }

    public async continuesScan<T extends any>(params: AWS.DynamoDB.DocumentClient.ScanInput): Promise<T[]> {

        await this.configUpdateEnsure();

        const results: T[] = [];
        let exclusiveStartKey: any;

        // eslint-disable-next-line no-constant-condition
        while (true) {

            const output: AWS.DynamoDB.DocumentClient.ScanOutput = await this.scan({
                ...params,
                ExclusiveStartKey: exclusiveStartKey,
            });
            if (!output.Items) {
                return results;
            }
            for (const item of output.Items) {
                results.push(item as any);
            }
            if (typeof output.LastEvaluatedKey === 'undefined') {
                return results;
            }
            exclusiveStartKey = output.LastEvaluatedKey;
        }
    }
}
