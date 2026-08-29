import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiId = new cdk.CfnParameter(this, 'ExistingRestApiId', { type: 'String' });
    const orgIdResourceId = new cdk.CfnParameter(this, 'ExistingOrgIdResourceId', { type: 'String', description: 'Resource id for existing /orgs/{orgId}.' });
    const billingResourceId = new cdk.CfnParameter(this, 'ExistingBillingResourceId', { type: 'String', description: 'Resource id for existing /billing.' });
    const authorizerId = new cdk.CfnParameter(this, 'ExistingCognitoAuthorizerId', { type: 'String' });
    const orgTableName = new cdk.CfnParameter(this, 'OrgDirectoryTableName', { type: 'String' });
    const tenantsTableName = new cdk.CfnParameter(this, 'TenantsTableName', { type: 'String' });
    const stripeSecretArn = new cdk.CfnParameter(this, 'StripeSecretArn', { type: 'String', noEcho: true, description: 'Secrets Manager ARN containing secretKey and webhookSecret.' });
    const stripeLayerArn = new cdk.CfnParameter(this, 'StripePythonLayerArn', { type: 'String' });
    const mspBasePrice = new cdk.CfnParameter(this, 'StripeMspBasePriceId', { type: 'String', noEcho: true });
    const mspClientPrice = new cdk.CfnParameter(this, 'StripeMspClientPriceId', { type: 'String', noEcho: true });
    const starterPrice = new cdk.CfnParameter(this, 'StripeStarterPriceId', { type: 'String', noEcho: true });
    const professionalPrice = new cdk.CfnParameter(this, 'StripeProfessionalPriceId', { type: 'String', noEcho: true });
    const guidedPrice = new cdk.CfnParameter(this, 'StripeGuidedPriceId', { type: 'String', noEcho: true });
    const invitationEmail = new cdk.CfnParameter(this, 'InvitationFromEmail', { type: 'String', default: '' });
    const appBaseUrl = new cdk.CfnParameter(this, 'AppBaseUrl', { type: 'String', default: 'https://app.cualleecyber.com' });

    const orgTable = dynamodb.Table.fromTableName(this, 'OrgDirectory', orgTableName.valueAsString);
    const tenantsTable = dynamodb.Table.fromTableName(this, 'Tenants', tenantsTableName.valueAsString);
    const stripeSecret = secretsmanager.Secret.fromSecretCompleteArn(this, 'StripeSecret', stripeSecretArn.valueAsString);
    const stripeLayer = lambda.LayerVersion.fromLayerVersionArn(this, 'StripeLayer', stripeLayerArn.valueAsString);
    const code = lambda.Code.fromAsset(path.join(__dirname, '../../lambda'), { exclude: ['__pycache__', '*.pyc', 'fixes', 'common'] });
    const common = { runtime: lambda.Runtime.PYTHON_3_12, code, timeout: cdk.Duration.seconds(30), memorySize: 256, architecture: lambda.Architecture.ARM_64, tracing: lambda.Tracing.ACTIVE, logRetention: 30 };

    const createOrg = new lambda.Function(this, 'CreateOrganization', { ...common, handler: 'create_org.lambda_handler', environment: { ORG_DIRECTORY_TABLE: orgTable.tableName } });
    const listOrgs = new lambda.Function(this, 'ListOrganizations', { ...common, handler: 'list_orgs.lambda_handler', environment: { ORG_DIRECTORY_TABLE: orgTable.tableName } });
    const hierarchy = new lambda.Function(this, 'OrganizationHierarchy', { ...common, handler: 'org_hierarchy.lambda_handler', environment: { ORG_DIRECTORY_TABLE: orgTable.tableName, APP_BASE_URL: appBaseUrl.valueAsString, INVITATION_FROM_EMAIL: invitationEmail.valueAsString, RETURN_INVITE_TOKEN: 'false' } });
    const responsibility = new lambda.Function(this, 'ResponsibilityMatrices', { ...common, handler: 'responsibility_matrices.lambda_handler', environment: { ORG_DIRECTORY_TABLE: orgTable.tableName } });
    const upgrade = new lambda.Function(this, 'UpgradeExistingAccountToMsp', { ...common, handler: 'billing_upgrade_msp.lambda_handler', layers: [stripeLayer], timeout: cdk.Duration.seconds(60), environment: { ORG_DIRECTORY_TABLE: orgTable.tableName, TENANTS_TABLE: tenantsTable.tableName, STRIPE_SECRET_KEY: stripeSecret.secretValueFromJson('secretKey').unsafeUnwrap(), STRIPE_PRICE_ID_MSP_BASE: mspBasePrice.valueAsString, STRIPE_PRICE_ID_MSP_CLIENT: mspClientPrice.valueAsString, STRIPE_PRICE_ID_STARTER: starterPrice.valueAsString, STRIPE_PRICE_ID_PROFESSIONAL: professionalPrice.valueAsString, STRIPE_PRICE_ID_GUIDED: guidedPrice.valueAsString } });
    const webhookCandidate = new lambda.Function(this, 'MspWebhookSynchronizationCandidate', { ...common, handler: 'billing_webhook_msp.lambda_handler', layers: [stripeLayer], environment: { ORG_DIRECTORY_TABLE: orgTable.tableName, TENANTS_TABLE: tenantsTable.tableName, STRIPE_WEBHOOK_SECRET: stripeSecret.secretValueFromJson('webhookSecret').unsafeUnwrap(), STRIPE_PRICE_ID_MSP_BASE: mspBasePrice.valueAsString } });

    orgTable.grantReadWriteData(createOrg);
    orgTable.grantReadData(listOrgs);
    orgTable.grantReadWriteData(hierarchy);
    orgTable.grantReadWriteData(responsibility);
    orgTable.grantReadData(upgrade);
    tenantsTable.grantReadData(upgrade);
    orgTable.grantReadWriteData(webhookCandidate);
    tenantsTable.grantReadWriteData(webhookCandidate);
    hierarchy.addToRolePolicy(new iam.PolicyStatement({ actions: ['ses:SendEmail'], resources: [this.formatArn({ service: 'ses', resource: 'identity', resourceName: invitationEmail.valueAsString })] }));

    const lookupHandler = new lambda.Function(this, 'ApiRootLookupFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(30),
      code: lambda.Code.fromInline(`const {APIGatewayClient,GetResourcesCommand}=require('@aws-sdk/client-api-gateway');exports.handler=async(e)=>{if(e.RequestType==='Delete')return{PhysicalResourceId:'api-root'};const r=await new APIGatewayClient({}).send(new GetResourcesCommand({restApiId:process.env.API_ID,limit:500}));const root=(r.items||[]).find(x=>x.path==='/');if(!root)throw new Error('API root not found');return{PhysicalResourceId:'api-root-'+process.env.API_ID,Data:{RootResourceId:root.id}}};`),
      environment: { API_ID: apiId.valueAsString },
    });
    lookupHandler.addToRolePolicy(new iam.PolicyStatement({ actions: ['apigateway:GET'], resources: ['*'] }));
    const provider = new cr.Provider(this, 'ApiRootLookupProvider', { onEventHandler: lookupHandler });
    const lookup = new cdk.CustomResource(this, 'ExistingApiRootLookup', { serviceToken: provider.serviceToken });

    const clients = new apigateway.CfnResource(this, 'ClientsResource', { restApiId: apiId.valueAsString, parentId: orgIdResourceId.valueAsString, pathPart: 'clients' });
    const orgInvites = new apigateway.CfnResource(this, 'OrgInvitationsResource', { restApiId: apiId.valueAsString, parentId: orgIdResourceId.valueAsString, pathPart: 'invitations' });
    const matrices = new apigateway.CfnResource(this, 'ResponsibilityMatricesResource', { restApiId: apiId.valueAsString, parentId: orgIdResourceId.valueAsString, pathPart: 'responsibility-matrices' });
    const rootInvites = new apigateway.CfnResource(this, 'InvitationsResource', { restApiId: apiId.valueAsString, parentId: lookup.getAttString('RootResourceId'), pathPart: 'invitations' });
    const acceptInvite = new apigateway.CfnResource(this, 'AcceptInvitationResource', { restApiId: apiId.valueAsString, parentId: rootInvites.ref, pathPart: 'accept' });
    const upgradeMsp = new apigateway.CfnResource(this, 'UpgradeMspResource', { restApiId: apiId.valueAsString, parentId: billingResourceId.valueAsString, pathPart: 'upgrade-msp' });

    const addMethod = (logicalId: string, resourceId: string, method: string, fn: lambda.Function) => {
      fn.addPermission(`${logicalId}Invoke`, { principal: new iam.ServicePrincipal('apigateway.amazonaws.com'), sourceArn: `arn:${cdk.Aws.PARTITION}:execute-api:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:${apiId.valueAsString}/*/${method}/*` });
      new apigateway.CfnMethod(this, logicalId, { restApiId: apiId.valueAsString, resourceId, httpMethod: method, authorizationType: 'COGNITO_USER_POOLS', authorizerId: authorizerId.valueAsString, integration: { type: 'AWS_PROXY', integrationHttpMethod: 'POST', uri: `arn:${cdk.Aws.PARTITION}:apigateway:${cdk.Aws.REGION}:lambda:path/2015-03-31/functions/${fn.functionArn}/invocations` } });
    };
    addMethod('GetManagedClients', clients.ref, 'GET', hierarchy);
    addMethod('CreateManagedClient', clients.ref, 'POST', hierarchy);
    addMethod('CreateOrganizationInvitation', orgInvites.ref, 'POST', hierarchy);
    addMethod('AcceptOrganizationInvitation', acceptInvite.ref, 'POST', hierarchy);
    addMethod('GetResponsibilityMatrices', matrices.ref, 'GET', responsibility);
    addMethod('SaveResponsibilityMatrix', matrices.ref, 'POST', responsibility);
    addMethod('UpgradeToMsp', upgradeMsp.ref, 'POST', upgrade);

    new cdk.CfnOutput(this, 'CreateOrganizationFunctionArn', { value: createOrg.functionArn, description: 'Set as the existing POST /orgs integration.' });
    new cdk.CfnOutput(this, 'ListOrganizationsFunctionArn', { value: listOrgs.functionArn, description: 'Set as the existing GET /orgs integration.' });
    new cdk.CfnOutput(this, 'WebhookCandidateFunctionArn', { value: webhookCandidate.functionArn, description: 'Merge its MSP logic into the existing Stripe webhook.' });
    new cdk.CfnOutput(this, 'ManualApiDeploymentRequired', { value: 'Deploy the existing CualleeCyberEvidence stage after CDK completes.' });
  }
}
