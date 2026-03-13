import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";
import fs from "fs";

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

let sharedDocuments: SharedDocument[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  
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
