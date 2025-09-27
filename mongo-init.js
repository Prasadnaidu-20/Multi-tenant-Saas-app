// MongoDB initialization script
db = db.getSiblingDB('multi-tenant-saas');

// Create collections
db.createCollection('users');
db.createCollection('notes');
db.createCollection('invitations');

// Create indexes for better performance
db.users.createIndex({ "email": 1, "tenantId": 1 }, { unique: true });
db.users.createIndex({ "tenantId": 1 });
db.users.createIndex({ "role": 1 });

db.notes.createIndex({ "tenantId": 1 });
db.notes.createIndex({ "createdBy": 1 });
db.notes.createIndex({ "createdAt": -1 });

db.invitations.createIndex({ "email": 1, "tenantId": 1 });
db.invitations.createIndex({ "token": 1 }, { unique: true });
db.invitations.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

print('Database initialized successfully!');
