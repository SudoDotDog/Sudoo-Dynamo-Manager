/**
 * @author WMXPY
 * @namespace DynamoManager
 * @description Document Manager Instance
 */

import * as AWS from "aws-sdk";
import { AWSConfigUpdateCheckFunction, AWSConfigUpdateFunction } from "./declare";

export class DynamoDocumentManagerInstance {

    private _updatedFailedError?: Error;
    private _configUpdateCheckFunction?: AWSConfigUpdateCheckFunction;
    private _configUpdateFunction?: AWSConfigUpdateFunction;

    private readonly _documentClient: AWS.DynamoDB.DocumentClient;

    protected constructor() {

        this._documentClient = new AWS.DynamoDB.DocumentClient();
    }

    public declareConfigUpdateCheckFunction(configUpdateCheckFunction: AWSConfigUpdateCheckFunction): this {

        this._configUpdateCheckFunction = configUpdateCheckFunction;
        return this;
    }

    public declareConfigUpdateFunction(configUpdateFunction: AWSConfigUpdateFunction): this {

        this._configUpdateFunction = configUpdateFunction;
        return this;
    }

    public declareUpdatedFailedError(error: Error): this {

        this._updatedFailedError = error;
        return this;
    }

    public async put(params: AWS.DynamoDB.DocumentClient.PutItemInput): Promise<void> {

        await this._configUpdateEnsure();

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

        await this._configUpdateEnsure();

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

        await this._configUpdateEnsure();

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

        await this._configUpdateEnsure();

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

        await this._configUpdateEnsure();

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

        await this._configUpdateEnsure();

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

        await this._configUpdateEnsure();

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

        await this._configUpdateEnsure();

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

    protected async _configUpdateCheck(): Promise<boolean> {

        if (typeof this._configUpdateCheckFunction === 'undefined') {
            return true;
        }

        const checkResult: boolean = await Promise.resolve(this._configUpdateCheckFunction());
        if (!checkResult) {

            if (typeof this._configUpdateFunction === 'undefined') {
                return false;
            }

            const updateResult: boolean = await Promise.resolve(this._configUpdateFunction());
            if (!updateResult) {
                return false;
            }
        }
        return true;
    }

    protected async _configUpdateEnsure(): Promise<void> {

        if (!await this._configUpdateCheck()) {

            if (typeof this._updatedFailedError === 'undefined') {
                throw new Error('[Sudoo-Dynamo-Manager] Initialize check failed');
            } else {
                throw this._updatedFailedError;
            }
        }
        return;
    }
}
