# IAM Configuration Guide for Cuallee Cyber

To resolve the errors you encountered, ensure you are placing the JSON blocks in the correct tabs within the AWS IAM Console for each of your four roles.

## 1. The Trust Relationship (Apply to ALL 4 Roles)
*Where to put this:* **IAM Role > Trust relationships tab > Edit trust policy**
*Why:* This allows your Cognito Identity Pool to give these permissions to logged-in users.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "us-east-1:14d64338-3f72-4004-9557-b4bb05d0c6c1"
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "authenticated"
        }
      }
    }
  ]
}
```

---

## 2. Permissions Policies (Group Specific)
*Where to put these:* **IAM Role > Permissions tab > Add permissions > Create inline policy > JSON**

### A. Application_Administrator (Global Admin)
*Permissions:* Full control over the User Pool and all compliance data.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "CognitoAdminAccess",
            "Effect": "Allow",
            "Action": [
                "cognito-idp:ListUsers",
                "cognito-idp:AdminGetUser",
                "cognito-idp:AdminCreateUser",
                "cognito-idp:AdminAddUserToGroup",
                "cognito-idp:AdminRemoveUserFromGroup",
                "cognito-idp:AdminDeleteUser",
                "cognito-idp:AdminUpdateUserAttributes"
            ],
            "Resource": "arn:aws:cognito-idp:us-east-1:*:userpool/us-east-1_ky47RcgYh"
        },
        {
            "Sid": "DataFullAccess",
            "Effect": "Allow",
            "Action": [
                "dynamodb:*",
                "s3:*"
            ],
            "Resource": "*"
        }
    ]
}
```

### B. Tenant_Admin (Org Admin)
*Permissions:* Can manage evidence and users, but only if they share the same `custom:tenant_id`.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ScopedDataAccess",
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:Query",
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:dynamodb:us-east-1:*:table/ComplianceData",
                "arn:aws:s3:::your-evidence-bucket/uploads/${cognito-identity.amazonaws.com:sub}/*"
            ]
        }
    ]
}
```

### C. Admin_Created_Users (Standard User)
*Permissions:* Read/Write access to their own organization's evidence, but no administrative rights.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:Query",
                "dynamodb:GetItem",
                "s3:PutObject",
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:dynamodb:us-east-1:*:table/ComplianceData",
                "arn:aws:s3:::your-evidence-bucket/uploads/${cognito-identity.amazonaws.com:sub}/*"
            ]
        }
    ]
}
```

### D. Auditor (Read-Only)
*Permissions:* Strictly viewing data and artifacts without modification rights.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:Query",
                "dynamodb:GetItem",
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": "*"
        }
    ]
}
```

---

## 3. Recommended Lambda Execution Role
Since your frontend calls an API Gateway, the **Lambda function itself** needs a role to talk to Cognito. Attach this to your backend Lambda:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "cognito-idp:AdminAddUserToGroup",
                "cognito-idp:AdminRemoveUserFromGroup",
                "cognito-idp:AdminDeleteUser"
            ],
            "Resource": "arn:aws:cognito-idp:us-east-1:*:userpool/us-east-1_ky47RcgYh"
        }
    ]
}
```
