#!/opt/homebrew/opt/node/bin/node
import * as cdk from 'aws-cdk-lib/core';
import { InfrastructureStack } from '../lib/infrastructure-stack';
const app = new cdk.App();
new InfrastructureStack(app, 'CualleeMspInfrastructure', { stackName: 'CualleeMspInfrastructure' });
