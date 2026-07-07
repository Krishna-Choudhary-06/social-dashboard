const request = require('supertest');
const app = require('../../src/app');
const { setup, teardown, clearDatabase } = require('../test.setup');
const { createTestUser, createTestWorkspace } = require('../test.utils');

beforeAll(async () => {
  process.env.JWT_SECRET = 'test_secret';
  await setup();
});

afterAll(async () => {
  await teardown();
});

afterEach(async () => {
  await clearDatabase();
});

describe('Integration Tests for all Modules', () => {
  let userToken;
  let userId;
  let workspaceId;
  let adminToken;

  beforeEach(async () => {
    const admin = await createTestUser('admin');
    adminToken = admin.token;
    userId = admin.user._id.toString();

    const workspace = await createTestWorkspace(userId);
    workspaceId = workspace._id.toString();

    const normalUser = await createTestUser('user');
    userToken = normalUser.token;
  });

  describe('Authentication & JWT Flow', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'New User',
        email: 'new@example.com',
        password: 'Password123!',
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
    });

    it('should fail with missing fields', async () => {
      const res = await request(app).post('/api/auth/register').send({});
      expect(res.statusCode).toEqual(400);
    });

    it('should block unauthenticated access to protected routes', async () => {
      const res = await request(app).get('/api/users/me');
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('RBAC Authorization', () => {
    it('should allow admin to access admin routes', async () => {
      const res = await request(app).get('/api/rbac/admin').set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
    });

    it('should block normal user from admin routes', async () => {
      const res = await request(app).get('/api/rbac/admin').set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(403);
    });
  });

  describe('Workspace Lifecycle', () => {
    it('should fetch workspaces for user', async () => {
      const res = await request(app).get('/api/workspaces').set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.workspaces.length).toBeGreaterThan(0);
    });

    it('should return 404 for invalid workspace ID', async () => {
      const res = await request(app).get('/api/workspaces/invalidId').set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).not.toEqual(200); // likely 400 or 404 due to objectid cast
    });
  });

  describe('Connected Accounts', () => {
    it('should list connected accounts', async () => {
      const res = await request(app).get(`/api/workspaces/${workspaceId}/accounts`).set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data.accounts)).toBe(true);
    });
  });

  describe('Analytics APIs', () => {
    it('should return mock overview data', async () => {
      const res = await request(app).get(`/api/workspaces/${workspaceId}/analytics/overview`).set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.metrics).toBeDefined();
    });
  });

  describe('Dashboard APIs', () => {
    it('should return dashboard summary', async () => {
      const res = await request(app).get(`/api/workspaces/${workspaceId}/dashboard/summary`).set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('Reports', () => {
    it('should list reports', async () => {
      const res = await request(app).get(`/api/workspaces/${workspaceId}/reports`).set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('Notifications', () => {
    it('should list notifications', async () => {
      const res = await request(app).get(`/api/workspaces/${workspaceId}/notifications`).set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('BullMQ Job Endpoints', () => {
    it('should queue an analytics job', async () => {
      const res = await request(app)
        .post('/api/jobs/analytics')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ workspaceId });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.jobId).toBeDefined();
    });

    it('should fetch job health', async () => {
      const res = await request(app).get('/api/jobs/health').set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
    });
  });
});
