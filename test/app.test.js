const request = require('supertest');
const app = require('../index'); // Assuming your Express app is exported from index.js
require('dotenv').config()

describe('Test user routes', () => {
  let authToken,token;

  // Test user registration
  //   1.Admin 
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testadmin',
        email: 'safayaparath@gmail.com',
        password: 'password',
        role: 'admin' 
      });
    expect(res.statusCode).toEqual(200);
  });
  //  2.User
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'safayaparath2@gmail.com',
        password: 'password',
        role: 'admin',
        adminpass: process.env.ADMIN_PASS
      });
    expect(res.statusCode).toEqual(200);
  });

  // Test user login
  it('should login a user and get auth token', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'safayaparath@gmail.com',
        password: 'password'
      });
    expect(res.statusCode).toEqual(200);
    authToken = res.body.accessToken; // Save auth token for further requests
  });

  // Test forgot password
  it('should initiate forgot password process', async () => {
    const res = await request(app)
      .post('/api/users/forget-password')
      .send({
        email: 'safayaparath@gmail.com'
      });
    expect(res.statusCode).toEqual(200);
    token = res.body.token;
  });

  // Test reset password -- User will get token through mail,but we are for testing purpose getting token through forget-password's response body
  it('should reset user password', async () => {
    // Assuming you have some way to get the reset token
    const res = await request(app)
      .post(`/api/users/reset-password/${token}`)
      .send({
        password: 'newpassword'
      });
    expect(res.statusCode).toEqual(200);
  });
});

describe('Test image routes for admin role', () => {
  let authToken,id;

  // Assuming you have some way to upload an image and get a token
  it('login',async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'safayaparath2@gmail.com',
        password: 'password'
      });
    authToken = res.body.accessToken;
  });

  // Test adding image
  it('should add an image', async () => {
    const res = await request(app)
      .post('/api/images/add')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('file', '/Users/dhanishsafaya/Downloads/html-css-js-portfolio-tutorial-2-main/assets/profile-pic.png')
      .field('text', 'Test image');
    expect(res.statusCode).toEqual(201);
    id = res.body.id;
  });

  // Test viewing images
  it('should view all images', async () => {
    const res = await request(app)
      .get('/api/images/view')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
  });

  // Test deleting image
  it('should delete an image', async () => {
    // Assuming you have some way to get the ID of an image to delete
    const imageId = id;
    const res = await request(app)
      .delete(`/api/images/delete/${imageId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
  });
});

describe('Test image routes for user role', () => {
    let authToken,id;
  
    // Assuming you have some way to upload an image and get a token
  it('login',async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'safayaparath@gmail.com',
        password: 'newpassword'
      });
    authToken = res.body.accessToken;
  });
  
    // Test adding image
    it('should add an image', async () => {
      const res = await request(app)
        .post('/api/images/add')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', '/Users/dhanishsafaya/Downloads/html-css-js-portfolio-tutorial-2-main/assets/profile-pic.png')
        .field('text', 'Test image');
      expect(res.statusCode).toEqual(401);
      id = res.body.id;
    });
  
    // Test viewing images
    it('should view all images', async () => {
      const res = await request(app)
        .get('/api/images/view')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.statusCode).toEqual(200);
    });
  
    // Test deleting image
    it('should delete an image', async () => {
      // Assuming you have some way to get the ID of an image to delete
      const imageId = id;
      const res = await request(app)
        .delete(`/api/images/delete/${imageId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.statusCode).toEqual(401);
    });
  });
