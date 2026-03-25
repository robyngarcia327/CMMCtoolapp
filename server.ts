import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// AWS S3 Client Configuration
// These should be set in environment variables
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// In-memory storage for demo purposes (since Firebase was declined)
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
  { orgId: 'demo-org', name: 'Demo Organization', role: 'Tenant_Admin' }
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

  app.use(express.json({ limit: '50mb' }));

  // --- Organization API ---
  app.get("/api/orgs", (req, res) => {
    res.json({ items: organizations });
  });

  app.post("/api/orgs", (req, res) => {
    const { name, domain } = req.body;
    const newOrg = {
      orgId: Math.random().toString(36).substr(2, 9),
      name,
      domain,
      role: 'Tenant_Admin',
      createdAt: new Date().toISOString()
    };
    organizations.push(newOrg);
    res.status(201).json(newOrg);
  });

  app.get("/api/orgs/discover", (req, res) => {
    const { domain } = req.query;
    const suggested = organizations.filter(o => o.domain === domain);
    res.json({ items: suggested });
  });

  app.post("/api/orgs/:orgId/join", (req, res) => {
    res.json({ status: "success" });
  });

  // --- Evidence Upload API (Multi-tenant S3) ---
  app.get("/api/orgs/:orgId/evidence", (req, res) => {
    const { orgId } = req.params;
    const items = evidence.filter(e => e.orgId === orgId);
    res.json({ items });
  });

  app.post("/api/orgs/:orgId/evidence", async (req, res) => {
    const { orgId } = req.params;
    const { filename, contentType, requirementId, sizeBytes } = req.body;

    if (!orgId || !filename || !contentType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Tenant-specific bucket name
    const bucketName = `cuallee-cyber-evidence-${orgId.toLowerCase()}`;
    const key = `uploads/${requirementId || 'GENERAL'}/${Date.now()}_${filename}`;

    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: contentType,
      });

      const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      const evidenceId = Math.random().toString(36).substr(2, 9);

      // Store metadata
      evidence.push({
        evidenceId,
        orgId,
        requirementId: requirementId || 'GENERAL',
        filename,
        contentType,
        sizeBytes,
        uploadedAt: new Date().toISOString(),
        s3Key: key,
        bucketName
      });

      res.json({
        uploadUrl,
        evidenceId,
        requiredHeaders: {
          'Content-Type': contentType
        }
      });
    } catch (error: any) {
      console.error("Error generating S3 upload URL:", error);
      res.status(500).json({ error: "Failed to generate upload URL. Ensure the S3 bucket exists and permissions are correct." });
    }
  });

  app.post("/api/orgs/:orgId/evidence/:evidenceId/upload-complete", (req, res) => {
    res.json({ status: "success" });
  });

  app.post("/api/orgs/:orgId/evidence/:evidenceId/download-request", async (req, res) => {
    const { orgId, evidenceId } = req.params;
    const item = evidence.find(e => e.evidenceId === evidenceId && e.orgId === orgId);
    
    if (!item) return res.status(404).json({ error: "Evidence not found" });

    try {
      // In a real app, you'd use GetObjectCommand to generate a pre-signed download URL
      // For now, we'll just return a mock URL or implement the real one if we have the client
      res.json({ downloadUrl: `https://${item.bucketName}.s3.amazonaws.com/${item.s3Key}` });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate download URL" });
    }
  });

  // --- Secure Vault API ---
  app.get("/api/vault/received", (req, res) => {
    const userEmail = req.query.email as string;
    const docs = sharedDocuments.filter(d => d.recipientEmail === userEmail);
    res.json({ items: docs });
  });

  app.get("/api/vault/sent", (req, res) => {
    const userEmail = req.query.email as string;
    const docs = sharedDocuments.filter(d => d.ownerEmail === userEmail);
    res.json({ items: docs });
  });

  app.post("/api/vault/share", async (req, res) => {
    const { filename, contentType, recipientEmail, sizeBytes } = req.body;
    const vaultId = Math.random().toString(36).substr(2, 9);
    
    // Use a shared vault bucket or tenant-specific
    const bucketName = "cuallee-cyber-vault-shared"; 
    const key = `vault/${vaultId}/${filename}`;

    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: contentType,
      });

      const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

      res.json({
        uploadUrl,
        vaultId,
        requiredHeaders: {
          'Content-Type': contentType
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate vault upload URL" });
    }
  });

  app.post("/api/vault/:id/complete", (req, res) => {
    res.json({ status: "success" });
  });

  app.patch("/api/vault/:id/status", (req, res) => {
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

  // Get documents shared WITH the user
  app.get("/api/documents/shared-with-me", (req, res) => {
    const userEmail = req.query.email as string;
    if (!userEmail) return res.status(400).json({ error: "Email required" });
    
    const docs = sharedDocuments.filter(d => d.recipientEmail === userEmail);
    res.json(docs);
  });

  // Get documents owned BY the user
  app.get("/api/documents/my-documents", (req, res) => {
    const userEmail = req.query.email as string;
    if (!userEmail) return res.status(400).json({ error: "Email required" });
    
    const docs = sharedDocuments.filter(d => d.ownerEmail === userEmail);
    res.json(docs);
  });

  // Share a document
  app.post("/api/documents/share", (req, res) => {
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

  // Approve/Decline sharing
  app.patch("/api/documents/:id/status", (req, res) => {
    const { id } = req.params;
    const { status, userEmail } = req.body;

    const docIndex = sharedDocuments.findIndex(d => d.id === id);
    if (docIndex === -1) return res.status(404).json({ error: "Document not found" });

    const doc = sharedDocuments[docIndex];
    
    // Only recipient can approve/decline
    if (doc.recipientEmail !== userEmail) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    sharedDocuments[docIndex].status = status;
    res.json(sharedDocuments[docIndex]);
  });

  // Download document
  app.get("/api/documents/:id/download", (req, res) => {
    const { id } = req.params;
    const userEmail = req.query.email as string;

    const doc = sharedDocuments.find(d => d.id === id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    // Only owner or recipient (if approved) can download
    if (doc.ownerEmail !== userEmail && (doc.recipientEmail !== userEmail || doc.status !== 'approved')) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.json({ content: doc.content, name: doc.name, mimeType: doc.mimeType });
  });

  // Delete document
  app.delete("/api/documents/:id", (req, res) => {
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

  // Vendor API Routes
  app.get("/api/vendors", (req, res) => {
    const orgId = req.query.orgId as string;
    if (!orgId) return res.status(400).json({ error: "orgId required" });
    
    // In a real app, filter by orgId
    res.json(vendors);
  });

  app.post("/api/vendors", (req, res) => {
    const vendor = req.body;
    const newVendor: Vendor = {
      ...vendor,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    vendors.push(newVendor);
    res.status(201).json(newVendor);
  });

  app.patch("/api/vendors/:id", (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const index = vendors.findIndex(v => v.id === id);
    if (index === -1) return res.status(404).json({ error: "Vendor not found" });
    
    vendors[index] = { ...vendors[index], ...updates };
    res.json(vendors[index]);
  });

  app.delete("/api/vendors/:id", (req, res) => {
    const { id } = req.params;
    const index = vendors.findIndex(v => v.id === id);
    if (index === -1) return res.status(404).json({ error: "Vendor not found" });
    
    vendors.splice(index, 1);
    res.status(204).send();
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
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
