import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";
import fs from "fs";
import cors from "cors";
import Stripe from "stripe";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import jwt from "jsonwebtoken";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27-acacia",
});

// Initialize DynamoDB
const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const TENANTS_TABLE = process.env.DYNAMODB_TENANTS_TABLE!;
const USERS_TABLE = process.env.DYNAMODB_USERS_TABLE!;

// Helper to extract user sub from JWT
function getUserSub(req: express.Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  
  let token = authHeader;
  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  
  try {
    const decoded = jwt.decode(token) as any;
    return decoded?.sub || null;
  } catch (e) {
    return null;
  }
}

// Entitlement Middleware
async function checkEntitlement(req: express.Request, res: express.Response, next: express.NextFunction) {
  const orgId = req.params.orgId || req.query.orgId || req.body.orgId;
  
  if (!orgId) return next(); // If no orgId, skip (might be global route)

  // Allow hardcoded demo orgs
  if (organizations.some(o => o.orgId === orgId)) return next();

  try {
    const result = await ddbDocClient.send(new QueryCommand({
      TableName: TENANTS_TABLE,
      IndexName: "OrgIdIndex",
      KeyConditionExpression: "orgId = :orgId",
      ExpressionAttributeValues: {
        ":orgId": orgId,
      },
    }));

    if (!result.Items || result.Items.length === 0) {
      return res.status(403).json({ error: "No active subscription found for this organization" });
    }

    const tenant = result.Items[0];
    if (tenant.status !== 'active' && tenant.status !== 'canceling') {
      return res.status(403).json({ error: "Subscription is inactive. Please renew to continue." });
    }

    next();
  } catch (error) {
    console.error("Entitlement Check Error:", error);
    next(); // Fail open for now to avoid blocking demo, but in production should fail closed
  }
}

// In-memory storage for demo purposes
// In a real app, this would be a database
interface SharedDocument {
  id: string;
  name: string;
  ownerId: string;
  ownerEmail: string;
  recipientEmail: string;
  status: 'pending' | 'approved' | 'declined';
  uploadDate: string;
  fileSize: number;
  mimeType: string;
  content?: string; // Base64 or path to file
}

interface Vendor {
  id: string;
  orgId: string;
  name: string;
  domain: string;
  serviceProvided: string;
  criticality: 'Low' | 'Medium' | 'High' | 'Critical';
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string;
  status: 'Active' | 'Under Review' | 'Rejected';
  hasNDASigned: boolean;
  hasDPA: boolean;
  handlesCUI: boolean;
  lastAssessmentDate: number;
  nextAssessmentDate: number;
}

let sharedDocuments: SharedDocument[] = [];
let organizations: any[] = [
  { orgId: 'demo-org', name: 'Demo Organization', role: 'Tenant_Admin', domain: 'demo.com' },
  { orgId: 'cyber-solutions', name: 'Cyber Solutions Inc.', role: 'Tenant_Admin', domain: 'cybersolutions.com' },
  { orgId: 'defense-a', name: 'Defense Systems A', role: 'Tenant_Admin', domain: 'defense-a.com' }
];
let evidence: any[] = [];
let vendors: Vendor[] = [
  {
    id: 'v1',
    orgId: 'demo-org',
    name: 'CyberGuard Solutions',
    domain: 'cyberguard.com',
    serviceProvided: 'Managed Security Services',
    criticality: 'High',
    contactPerson: 'Alice Johnson',
    contactEmail: 'alice@cyberguard.com',
    contactPhone: '555-0123',
    status: 'Active',
    hasNDASigned: true,
    hasDPA: true,
    handlesCUI: true,
    lastAssessmentDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
    nextAssessmentDate: Date.now() + 335 * 24 * 60 * 60 * 1000
  },
  {
    id: 'v2',
    orgId: 'demo-org',
    name: 'CloudFlow Systems',
    domain: 'cloudflow.io',
    serviceProvided: 'Cloud Infrastructure',
    criticality: 'Critical',
    contactPerson: 'Bob Smith',
    contactEmail: 'bob@cloudflow.io',
    contactPhone: '555-0456',
    status: 'Active',
    hasNDASigned: true,
    hasDPA: true,
    handlesCUI: false,
    lastAssessmentDate: Date.now() - 60 * 24 * 60 * 60 * 1000,
    nextAssessmentDate: Date.now() + 305 * 24 * 60 * 60 * 1000
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  console.log(`[Server] Starting in ${process.env.NODE_ENV || 'development'} mode`);

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  app.use((req, res, next) => {
    console.log(`[Server] ${req.method} ${req.url} - Host: ${req.headers.host}`);
    next();
  });

  // --- API Router ---
  const apiRouter = express.Router();

  // Mount API router at the very top
  app.use("/api", (req, res, next) => {
    console.log(`[API-Mount] ${req.method} ${req.url} - Path: ${req.path}`);
    next();
  }, apiRouter);

  // Debug route directly on app to verify prefix matching
  app.get("/api-health-check", (req, res) => {
    res.json({ status: "ok", message: "API prefix is working", url: req.url });
  });

  // Direct app routes for critical endpoints to bypass router issues
  app.get(["/api/orgs", "/api/orgs/"], (req, res) => {
    console.log("Direct app match for GET /api/orgs");
    res.json({ items: organizations });
  });

  app.get(["/api/vendors", "/api/vendors/"], (req, res) => {
    console.log("Direct app match for GET /api/vendors");
    res.json(vendors);
  });

  // API Logger
  apiRouter.use((req, res, next) => {
    console.log(`[API-Router] ${req.method} ${req.path} - Headers: ${JSON.stringify(req.headers)}`);
    next();
  });

  apiRouter.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // --- Billing API ---
  apiRouter.post("/billing/checkout-session", async (req, res) => {
    const { orgName, email, userSub } = req.body;

    if (!orgName || !email || !userSub) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID_YEARLY,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.APP_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: process.env.APP_CANCEL_URL,
        customer_email: email,
        metadata: {
          userSub,
          email,
          orgName,
        },
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe Checkout Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  apiRouter.post("/billing/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );
    } catch (err: any) {
      console.error("Webhook Signature Error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const { userSub, email, orgName } = session.metadata || {};
          
          if (!userSub || !email || !orgName) {
            console.error("Missing metadata in checkout session");
            break;
          }

          const orgId = `org_${Math.random().toString(36).substr(2, 9)}`;
          const tenantId = `tenant_${Math.random().toString(36).substr(2, 9)}`;

          // Create Tenant Record in DynamoDB
          await ddbDocClient.send(new PutCommand({
            TableName: TENANTS_TABLE,
            Item: {
              tenantId,
              orgId,
              orgName,
              ownerSub: userSub, // Track the owner
              status: "active",
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          }));

          // Update User record to link to org
          await ddbDocClient.send(new UpdateCommand({
            TableName: USERS_TABLE,
            Key: { userId: userSub },
            UpdateExpression: "set organizationId = :orgId, status = :status, updatedAt = :updatedAt",
            ExpressionAttributeValues: {
              ":orgId": orgId,
              ":status": "ACTIVE",
              ":updatedAt": new Date().toISOString(),
            },
          }));

          console.log(`[Billing] Tenant and Org created for ${email}`);
          break;
        }
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          const status = subscription.status === "active" ? "active" : 
                         subscription.status === "past_due" ? "inactive" : 
                         subscription.status === "canceled" ? "inactive" : "inactive";

          // Update Tenant Status in DynamoDB
          // This requires a query to find the tenant by stripeSubscriptionId
          const result = await ddbDocClient.send(new QueryCommand({
            TableName: TENANTS_TABLE,
            IndexName: "StripeSubscriptionIndex", // Assuming this index exists
            KeyConditionExpression: "stripeSubscriptionId = :subId",
            ExpressionAttributeValues: {
              ":subId": subscription.id,
            },
          }));

          if (result.Items && result.Items.length > 0) {
            const tenant = result.Items[0];
            await ddbDocClient.send(new UpdateCommand({
              TableName: TENANTS_TABLE,
              Key: { tenantId: tenant.tenantId },
              UpdateExpression: "set #status = :status, updatedAt = :updatedAt, cancelAtPeriodEnd = :cancelAt",
              ExpressionAttributeNames: { "#status": "status" },
              ExpressionAttributeValues: {
                ":status": status,
                ":updatedAt": new Date().toISOString(),
                ":cancelAt": subscription.cancel_at_period_end,
              },
            }));
          }
          break;
        }
      }
      res.json({ received: true });
    } catch (error: any) {
      console.error("Webhook Processing Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  apiRouter.get("/billing/status", async (req, res) => {
    const { orgId } = req.query;
    if (!orgId) return res.status(400).json({ error: "orgId required" });

    try {
      const result = await ddbDocClient.send(new QueryCommand({
        TableName: TENANTS_TABLE,
        IndexName: "OrgIdIndex", // Assuming this index exists
        KeyConditionExpression: "orgId = :orgId",
        ExpressionAttributeValues: {
          ":orgId": orgId,
        },
      }));

      if (!result.Items || result.Items.length === 0) {
        return res.status(404).json({ error: "Tenant not found" });
      }

      const tenant = result.Items[0];
      res.json({
        status: tenant.status,
        renewalDate: tenant.currentPeriodEnd,
        cancelAtPeriodEnd: tenant.cancelAtPeriodEnd,
        currentPriceId: tenant.stripePriceId,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  apiRouter.post("/billing/portal-session", async (req, res) => {
    const { orgId } = req.body;
    if (!orgId) return res.status(400).json({ error: "orgId required" });

    try {
      const result = await ddbDocClient.send(new QueryCommand({
        TableName: TENANTS_TABLE,
        IndexName: "OrgIdIndex",
        KeyConditionExpression: "orgId = :orgId",
        ExpressionAttributeValues: {
          ":orgId": orgId,
        },
      }));

      if (!result.Items || result.Items.length === 0) {
        return res.status(404).json({ error: "Tenant not found" });
      }

      const tenant = result.Items[0];
      const session = await stripe.billingPortal.sessions.create({
        customer: tenant.stripeCustomerId,
        return_url: process.env.APP_SUCCESS_URL,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  apiRouter.post("/billing/cancel", async (req, res) => {
    const { orgId } = req.body;
    if (!orgId) return res.status(400).json({ error: "orgId required" });

    try {
      const result = await ddbDocClient.send(new QueryCommand({
        TableName: TENANTS_TABLE,
        IndexName: "OrgIdIndex",
        KeyConditionExpression: "orgId = :orgId",
        ExpressionAttributeValues: {
          ":orgId": orgId,
        },
      }));

      if (!result.Items || result.Items.length === 0) {
        return res.status(404).json({ error: "Tenant not found" });
      }

      const tenant = result.Items[0];
      await stripe.subscriptions.update(tenant.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      res.json({ status: "canceling" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  apiRouter.get("/orgs/:orgId", checkEntitlement, (req, res) => {
    const { orgId } = req.params;
    const org = organizations.find(o => o.orgId === orgId);
    if (!org) return res.status(404).json({ error: "Organization not found" });
    res.json(org);
  });

  apiRouter.get(["/orgs", "/orgs/"], async (req, res) => {
    const userSub = getUserSub(req);
    console.log("Handling GET /api/orgs for user:", userSub);

    let userOrgs = [...organizations];

    if (userSub) {
      try {
        // Query DynamoDB for tenants owned by this user
        const result = await ddbDocClient.send(new ScanCommand({
          TableName: TENANTS_TABLE,
          FilterExpression: "ownerSub = :sub",
          ExpressionAttributeValues: {
            ":sub": userSub,
          },
        }));

        if (result.Items) {
          const dbOrgs = result.Items.map(item => ({
            orgId: item.orgId,
            name: item.orgName,
            role: 'Tenant_Admin',
            createdAt: item.createdAt,
            status: item.status
          }));
          userOrgs = [...userOrgs, ...dbOrgs];
        }
      } catch (error) {
        console.error("Error fetching user orgs from DynamoDB:", error);
      }
    }

    res.json({ items: userOrgs });
  });

  apiRouter.post(["/orgs", "/orgs/"], async (req, res) => {
    const { name, domain } = req.body;
    const orgId = Math.random().toString(36).substr(2, 9);
    const newOrg = {
      orgId,
      name,
      domain,
      role: 'Tenant_Admin',
      createdAt: new Date().toISOString()
    };

    organizations.push(newOrg);
    res.status(201).json(newOrg);
  });

  apiRouter.get(["/orgs/discover", "/orgs/discover/"], (req, res) => {
    const { domain } = req.query;
    const suggested = organizations.filter(o => o.domain === domain);
    res.json({ items: suggested });
  });

  apiRouter.post(["/orgs/:orgId/join", "/orgs/:orgId/join/"], (req, res) => {
    res.json({ status: "success" });
  });

  // --- Evidence Upload API ---
  apiRouter.get(["/orgs/:orgId/evidence", "/orgs/:orgId/evidence/"], checkEntitlement, (req, res) => {
    const { orgId } = req.params;
    const items = evidence.filter(e => e.orgId === orgId);
    res.json({ items });
  });

  apiRouter.post(["/orgs/:orgId/evidence", "/orgs/:orgId/evidence/"], checkEntitlement, async (req, res) => {
    const { orgId } = req.params;
    const { filename, contentType, requirementId, sizeBytes } = req.body;

    if (!orgId || !filename || !contentType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const bucketName = `cuallee-cyber-evidence-${String(orgId).toLowerCase()}`;
    const key = `uploads/${requirementId || 'GENERAL'}/${Date.now()}_${filename}`;

    const uploadUrl = `https://mock-s3-upload.local/${bucketName}/${key}`;
    const evidenceId = Math.random().toString(36).substr(2, 9);
    evidence.push({ evidenceId, orgId, requirementId: requirementId || 'GENERAL', filename, contentType, sizeBytes, uploadedAt: new Date().toISOString(), s3Key: key, bucketName });
    return res.json({ uploadUrl, evidenceId, requiredHeaders: { 'Content-Type': contentType } });
  });

  apiRouter.post(["/orgs/:orgId/evidence/:evidenceId/upload-complete", "/orgs/:orgId/evidence/:evidenceId/upload-complete/"], checkEntitlement, (req, res) => {
    res.json({ status: "success" });
  });

  apiRouter.post(["/orgs/:orgId/evidence/:evidenceId/download-request", "/orgs/:orgId/evidence/:evidenceId/download-request/"], checkEntitlement, async (req, res) => {
    const { orgId, evidenceId } = req.params;
    const item = evidence.find(e => e.evidenceId === evidenceId && e.orgId === orgId);
    
    if (!item) return res.status(404).json({ error: "Evidence not found" });

    return res.json({ downloadUrl: `https://mock-s3-download.local/${item.bucketName}/${item.s3Key}` });
  });

  // --- Secure Vault API ---
  apiRouter.get(["/vault/received", "/vault/received/"], (req, res) => {
    const userEmail = req.query.email as string;
    const docs = sharedDocuments.filter(d => d.recipientEmail === userEmail);
    res.json({ items: docs });
  });

  apiRouter.get(["/vault/sent", "/vault/sent/"], (req, res) => {
    const userEmail = req.query.email as string;
    const docs = sharedDocuments.filter(d => d.ownerEmail === userEmail);
    res.json({ items: docs });
  });

  apiRouter.post(["/vault/share", "/vault/share/"], async (req, res) => {
    const { filename, contentType, recipientEmail, sizeBytes } = req.body;
    const vaultId = Math.random().toString(36).substr(2, 9);
    
    const bucketName = "cuallee-cyber-vault-shared"; 
    const key = `vault/${vaultId}/${filename}`;

    const uploadUrl = `https://mock-vault-upload.local/${bucketName}/${key}`;
    return res.json({ uploadUrl, vaultId, requiredHeaders: { 'Content-Type': contentType } });
  });

  apiRouter.post(["/vault/:id/complete", "/vault/:id/complete/"], (req, res) => {
    res.json({ status: "success" });
  });

  apiRouter.patch(["/vault/:id/status", "/vault/:id/status/"], (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const docIndex = sharedDocuments.findIndex(d => d.id === id);
    if (docIndex !== -1) {
      sharedDocuments[docIndex].status = status;
      res.json(sharedDocuments[docIndex]);
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  });

  apiRouter.get(["/documents/shared-with-me", "/documents/shared-with-me/"], (req, res) => {
    const userEmail = req.query.email as string;
    if (!userEmail) return res.status(400).json({ error: "Email required" });
    
    const docs = sharedDocuments.filter(d => d.recipientEmail === userEmail);
    res.json(docs);
  });

  apiRouter.get(["/documents/my-documents", "/documents/my-documents/"], (req, res) => {
    const userEmail = req.query.email as string;
    if (!userEmail) return res.status(400).json({ error: "Email required" });
    
    const docs = sharedDocuments.filter(d => d.ownerEmail === userEmail);
    res.json(docs);
  });

  apiRouter.post(["/documents/share", "/documents/share/"], (req, res) => {
    const { name, ownerId, ownerEmail, recipientEmail, fileSize, mimeType, content } = req.body;
    
    if (!name || !ownerEmail || !recipientEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newDoc: SharedDocument = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      ownerId,
      ownerEmail,
      recipientEmail,
      status: 'pending',
      uploadDate: new Date().toISOString(),
      fileSize,
      mimeType,
      content
    };

    sharedDocuments.push(newDoc);
    res.status(201).json(newDoc);
  });

  apiRouter.patch(["/documents/:id/status", "/documents/:id/status/"], (req, res) => {
    const { id } = req.params;
    const { status, userEmail } = req.body;

    const docIndex = sharedDocuments.findIndex(d => d.id === id);
    if (docIndex === -1) return res.status(404).json({ error: "Document not found" });

    const doc = sharedDocuments[docIndex];
    
    if (doc.recipientEmail !== userEmail) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    sharedDocuments[docIndex].status = status;
    res.json(sharedDocuments[docIndex]);
  });

  apiRouter.get(["/documents/:id/download", "/documents/:id/download/"], (req, res) => {
    const { id } = req.params;
    const userEmail = req.query.email as string;

    const doc = sharedDocuments.find(d => d.id === id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    if (doc.ownerEmail !== userEmail && (doc.recipientEmail !== userEmail || doc.status !== 'approved')) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.json({ content: doc.content, name: doc.name, mimeType: doc.mimeType });
  });

  apiRouter.delete(["/documents/:id", "/documents/:id/"], (req, res) => {
    const { id } = req.params;
    const userEmail = req.query.email as string;

    const docIndex = sharedDocuments.findIndex(d => d.id === id);
    if (docIndex === -1) return res.status(404).json({ error: "Document not found" });

    const doc = sharedDocuments[docIndex];
    if (doc.ownerEmail !== userEmail) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    sharedDocuments.splice(docIndex, 1);
    res.status(204).send();
  });

  apiRouter.get(["/vendors", "/vendors/"], (req, res) => {
    const orgId = req.query.orgId as string;
    if (!orgId) return res.status(400).json({ error: "orgId required" });
    res.json(vendors);
  });

  apiRouter.post(["/vendors", "/vendors/"], (req, res) => {
    const vendor = req.body;
    const newVendor: Vendor = {
      ...vendor,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    vendors.push(newVendor);
    res.status(201).json(newVendor);
  });

  apiRouter.patch(["/vendors/:id", "/vendors/:id/"], (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const index = vendors.findIndex(v => v.id === id);
    if (index === -1) return res.status(404).json({ error: "Vendor not found" });
    
    vendors[index] = { ...vendors[index], ...updates };
    res.json(vendors[index]);
  });

  apiRouter.delete(["/vendors/:id", "/vendors/:id/"], (req, res) => {
    const { id } = req.params;
    const index = vendors.findIndex(v => v.id === id);
    if (index === -1) return res.status(404).json({ error: "Vendor not found" });
    
    vendors.splice(index, 1);
    res.status(204).send();
  });

  // Catch-all for API router to return JSON 404
  apiRouter.all("*", (req, res) => {
    console.log(`[API 404] ${req.method} ${req.url} (Path: ${req.path})`);
    res.status(404).json({ 
      error: "API endpoint not found",
      method: req.method,
      path: req.path,
      url: req.url
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
  app.get('*', (req, res) => {
    console.log(`[Fallback] ${req.method} ${req.url}`);
    res.sendFile(path.join(distPath, 'index.html'));
  });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
