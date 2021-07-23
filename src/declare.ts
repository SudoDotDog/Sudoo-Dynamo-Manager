/**
 * @author WMXPY
 * @namespace DynamoManager
 * @description Declare
 */

export type AWSConfigUpdateCheckFunction = () => boolean | Promise<boolean>;
export type AWSConfigUpdateFunction = () => boolean | Promise<boolean>;
