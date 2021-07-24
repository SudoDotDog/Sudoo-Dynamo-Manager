/**
 * @author WMXPY
 * @namespace DynamoManager
 * @description Document Manager
 * @override Unit Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { DynamoDocumentManager } from "../../src/document-manager";

describe('Given {DynamoDocumentManager} Class', (): void => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const chance: Chance.Chance = new Chance('dynamo-manager-document-manager');

    it('should be able to get instance', (): void => {

        const instance: DynamoDocumentManager = DynamoDocumentManager.getInstance();

        expect(instance).to.be.instanceof(DynamoDocumentManager);
    });
});
