const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Social Dashboard Backend API',
    version: '1.0.0',
    description: 'API documentation for the Social Media Dashboard Backend, detailing Auth, Users, Workspaces, Analytics, and Jobs.',
  },
  servers: [
    {
      url: '/api',
      description: 'Main API Server (v1)',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Detailed error message here.' },
          code: { type: 'string', example: 'ERROR_CODE' }
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation completed successfully.' },
          data: { type: 'object' },
        },
      },
      JobResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Job triggered successfully.' },
          data: {
            type: 'object',
            properties: {
              jobId: { type: 'string', example: '12345' },
              status: { type: 'string', example: 'active' }
            }
          }
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'john@example.com' },
          role: { type: 'string', example: 'admin' },
          status: { type: 'string', example: 'active' }
        }
      },
      Workspace: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '60d0fe4f5311236168a109cb' },
          name: { type: 'string', example: 'My Workspace' },
          owner: { type: 'string', example: '60d0fe4f5311236168a109ca' },
          members: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                user: { type: 'string', example: '60d0fe4f5311236168a109cc' },
                role: { type: 'string', example: 'viewer' }
              }
            }
          }
        }
      }
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication and JWT token management' },
    { name: 'Users', description: 'User profile and management endpoints' },
    { name: 'Workspace', description: 'Workspace creation, membership, and RBAC' },
    { name: 'Media', description: 'Media upload and storage' },
    { name: 'Connected Accounts', description: 'Social platform connection lifecycle' },
    { name: 'Analytics', description: 'Deep-dive metrics for platforms and growth' },
    { name: 'Dashboard', description: 'Aggregated widgets and summaries for UI' },
    { name: 'Reports', description: 'Asynchronous PDF/CSV/Excel report generation' },
    { name: 'Notifications', description: 'In-app notification system' },
    { name: 'Jobs', description: 'BullMQ background job management' },
  ],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user account',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Jane Doe' },
                  email: { type: 'string', example: 'jane@example.com' },
                  password: { type: 'string', example: 'Secret123!' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'User registered successfully', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate and get JWT tokens',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'jane@example.com' },
                  password: { type: 'string', example: 'Secret123!' }
                }
              }
            }
          }
        },
        responses: {
          200: { 
            description: 'Login successful', 
            content: { 
              'application/json': { 
                schema: { 
                  type: 'object', 
                  properties: { 
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/User' },
                        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...' },
                        refreshToken: { type: 'string', example: 'dGVzdF9yZWZyZXNoX3Rva2Vu...' }
                      }
                    }
                  } 
                } 
              } 
            } 
          },
          401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/users/me': {
      get: {
        tags: ['Users'],
        summary: 'Retrieve current authenticated user profile',
        responses: {
          200: { description: 'Profile returned', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'List users with pagination, filtering, and sorting',
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } }
        ],
        responses: {
          200: { description: 'Paginated user list', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } }
        }
      }
    },
    '/workspaces': {
      get: {
        tags: ['Workspace'],
        summary: 'List workspaces the user has access to',
        responses: {
          200: { description: 'Workspaces retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } }
        }
      },
      post: {
        tags: ['Workspace'],
        summary: 'Create a new workspace',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { name: { type: 'string', example: 'Acme Corp Marketing' } }
              }
            }
          }
        },
        responses: {
          201: { description: 'Workspace created', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } }
        }
      }
    },
    '/media/upload': {
      post: {
        tags: ['Media'],
        summary: 'Upload an image or video asset',
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: { file: { type: 'string', format: 'binary' } }
              }
            }
          }
        },
        responses: {
          200: { description: 'File uploaded successfully', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } }
        }
      }
    },
    '/workspaces/{workspaceId}/accounts': {
      get: {
        tags: ['Connected Accounts'],
        summary: 'List connected social accounts for a workspace',
        parameters: [
          { in: 'path', name: 'workspaceId', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Accounts fetched successfully', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } }
        }
      },
      post: {
        tags: ['Connected Accounts'],
        summary: 'Connect a new social account',
        parameters: [
          { in: 'path', name: 'workspaceId', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  platform: { type: 'string', example: 'twitter' },
                  accountId: { type: 'string', example: 'twitter_user_123' },
                  username: { type: 'string', example: 'hello_world' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Account connected successfully' }
        }
      }
    },
    '/workspaces/{workspaceId}/analytics/overview': {
      get: {
        tags: ['Analytics'],
        summary: 'Fetch high-level analytics overview',
        parameters: [
          { in: 'path', name: 'workspaceId', required: true, schema: { type: 'string' } },
          { in: 'query', name: 'platform', schema: { type: 'string' } },
          { in: 'query', name: 'dateRange', schema: { type: 'string', example: 'last_30_days' } }
        ],
        responses: {
          200: { description: 'Overview data returned successfully' }
        }
      }
    },
    '/workspaces/{workspaceId}/dashboard/summary': {
      get: {
        tags: ['Dashboard'],
        summary: 'Fetch aggregated dashboard summary widgets',
        parameters: [
          { in: 'path', name: 'workspaceId', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Summary data returned successfully' }
        }
      }
    },
    '/workspaces/{workspaceId}/reports': {
      get: {
        tags: ['Reports'],
        summary: 'List generated reports',
        parameters: [
          { in: 'path', name: 'workspaceId', required: true, schema: { type: 'string' } },
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } }
        ],
        responses: {
          200: { description: 'Reports list fetched successfully' }
        }
      }
    },
    '/workspaces/{workspaceId}/notifications': {
      get: {
        tags: ['Notifications'],
        summary: 'Fetch user notifications in a workspace',
        parameters: [
          { in: 'path', name: 'workspaceId', required: true, schema: { type: 'string' } },
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 20 } },
          { in: 'query', name: 'isRead', schema: { type: 'boolean' } }
        ],
        responses: {
          200: { description: 'Notifications fetched successfully' }
        }
      }
    },
    '/jobs/reports': {
      post: {
        tags: ['Jobs'],
        summary: 'Queue a new report generation job',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  workspaceId: { type: 'string', example: '60d0fe4f5311236168a109cb' },
                  reportName: { type: 'string', example: 'Q3 Analytics' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Job queued successfully', content: { 'application/json': { schema: { $ref: '#/components/schemas/JobResponse' } } } },
          500: { description: 'Internal server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/jobs/analytics': {
      post: {
        tags: ['Jobs'],
        summary: 'Queue a new analytics synchronization job',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  workspaceId: { type: 'string', example: '60d0fe4f5311236168a109cb' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Job queued successfully', content: { 'application/json': { schema: { $ref: '#/components/schemas/JobResponse' } } } },
          500: { description: 'Internal server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/jobs/health': {
      get: {
        tags: ['Jobs'],
        summary: 'Get queue health metrics',
        responses: {
          200: { description: 'Health metrics returned', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } }
        }
      }
    },
    '/jobs/{jobId}': {
      get: {
        tags: ['Jobs'],
        summary: 'Get job status by ID',
        parameters: [
          { in: 'path', name: 'jobId', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Job status returned', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          404: { description: 'Job not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    }
  }
};

const swaggerConfig = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Social Dashboard API Docs',
};

module.exports = {
  swaggerSpec,
  swaggerConfig,
};
