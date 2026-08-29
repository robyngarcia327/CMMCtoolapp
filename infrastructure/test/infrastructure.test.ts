import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { InfrastructureStack } from '../lib/infrastructure-stack';

test('creates MSP Lambda handlers and protected API methods', () => {
  const app = new cdk.App();
  const template = Template.fromStack(new InfrastructureStack(app, 'TestStack'));
  for (const handler of ['create_org.lambda_handler', 'list_orgs.lambda_handler', 'org_hierarchy.lambda_handler', 'responsibility_matrices.lambda_handler', 'billing_upgrade_msp.lambda_handler', 'billing_webhook_msp.lambda_handler']) {
    template.hasResourceProperties('AWS::Lambda::Function', { Handler: handler });
  }
  template.resourcePropertiesCountIs('AWS::ApiGateway::Method', { AuthorizationType: 'COGNITO_USER_POOLS', Integration: Match.objectLike({ Type: 'AWS_PROXY' }) }, 7);
  template.hasOutput('CreateOrganizationFunctionArn', {});
  template.hasOutput('ListOrganizationsFunctionArn', {});
  template.hasOutput('WebhookCandidateFunctionArn', {});
});
