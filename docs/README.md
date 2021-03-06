# Sudoo-Dynamo-Manager

[![Continuous Integration](https://github.com/SudoDotDog/Sudoo-Dynamo-Manager/actions/workflows/ci.yml/badge.svg)](https://github.com/SudoDotDog/Sudoo-Dynamo-Manager/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/SudoDotDog/Sudoo-Dynamo-Manager/branch/main/graph/badge.svg)](https://codecov.io/gh/SudoDotDog/Sudoo-Dynamo-Manager)
[![npm version](https://badge.fury.io/js/%40sudoo%2Fdynamo-manager.svg)](https://www.npmjs.com/package/@sudoo/dynamo-manager)
[![downloads](https://img.shields.io/npm/dm/@sudoo/dynamo-manager.svg)](https://www.npmjs.com/package/@sudoo/dynamo-manager)

Dynamo Manager for Node

## Install

```sh
yarn add @sudoo/dynamo-manager
# Or
npm install @sudoo/dynamo-manager --save
```

## Usage

```ts
import { DynamoDocumentManager } from "@sudoo/dynamo-manager";

DynamoDocumentManager.declareConfigUpdateCheckFunction(() => {
    return ifMyAWSConfigDone();
}); // Optional
DynamoDocumentManager.declareConfigUpdateFunction(() => {
    return updateMyAWSConfig();
}); // Optional

await DynamoDocumentManager.put(params);
await DynamoDocumentManager.batchWrite(params);
await DynamoDocumentManager.updateAndGetNew(params);
await DynamoDocumentManager.get(params);
await DynamoDocumentManager.query(params);
await DynamoDocumentManager.scan(params);
await DynamoDocumentManager.continuesScan(params);
```
