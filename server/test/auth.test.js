// //TODO: Need to update with coennction to database
// import { expect } from 'chai';
// import { register, verifyEmail, resendVerificationEmail, login, forgotPassword, resetPassword } from '../controllers/auth.controller.js';

// describe('AuthController', () => {
//     describe('register', () => {
//         it('creates a new user with valid data and send verification email', async () => {
//             // Setup
//             const req = {
//                 body: {
//                     username: 'userTest',
//                     firstName: 'John',
//                     lastName: 'Doe',
//                     email: 'john@example.com',
//                     password: 'password123',
//                     confirmPassword: 'password123'
//                 }
//             };
//             let status = null;
//             let responseData = null;
//             const res = {
//                 status: (code) => {
//                     status = code;
//                     return res;
//                 },
//                 json: (data) => {
//                     responseData = data;
//                 }
//             };
//             const next = () => {};

//             // Exercise
//             register(req, res, next).then(() => {
//                 // Verify
//                 expect(status).to.equal(201);
//                 expect(responseData).to.deep.equal({ success: true, message: 'Signup successful. Please verify your email' });
//                 done();
//             }).catch((error) => {
//                 done(error);
//             });
//         });

//         it('fails to create user with empty data', async () => {
//             const req = {
//                 body: {
//                     username: '',
//                     firstName: '',
//                     lastName: '',
//                     email: '',
//                     password: '',
//                     confirmPassword: ''
//                 }
//             };
//             let status = null;
//             let responseData = null;
//             const res = {
//                 status: (code) => {
//                     status = code;
//                     return res;
//                 },
//                 json: (data) => {
//                     responseData = data;
//                 }
//             };
//             const next = () => {};

//             // Exercise
//             register(req, res, next).then(() => {
//                 // Verify
//                 expect(status).to.equal(400);
//                 expect(responseData).to.deep.equal({ success: false});
//                 done();
//             }).catch((error) => {
//                 done(error);
//             });
//         });

//         it('fails to create user with invalid username', async () => {
//             const req = {
//                 body: {
//                     username: 'a',
//                     firstName: 'John',
//                     lastName: 'Doe',
//                     email: 'john@example.com',
//                     password: 'password123',
//                     confirmPassword: 'password123'
//                 }
//             };
//             let status = null;
//             let responseData = null;
//             const res = {
//                 status: (code) => {
//                     status = code;
//                     return res;
//                 },
//                 json: (data) => {
//                     responseData = data;
//                 }
//             };
//             const next = () => {};

//             // Exercise
//             register(req, res, next).then(() => {
//                 // Verify
//                 expect(status).to.equal(400);
//                 expect(responseData).to.deep.equal({ success: false});
//                 done();
//             }).catch((error) => {
//                 done(error);
//             });
//         });

//         it('fails to create user with invalid password', async () => {
//             const req = {
//                 body: {
//                     username: 'userTest',
//                     firstName: 'John',
//                     lastName: 'Doe',
//                     email: 'john@example.com',
//                     password: '123',
//                     confirmPassword: '123'
//                 }
//             };
//             let status = null;
//             let responseData = null;
//             const res = {
//                 status: (code) => {
//                     status = code;
//                     return res;
//                 },
//                 json: (data) => {
//                     responseData = data;
//                 }
//             };
//             const next = () => {};

//             // Exercise
//             register(req, res, next).then(() => {
//                 // Verify
//                 expect(status).to.equal(400);
//                 expect(responseData).to.deep.equal({ success: false});
//                 done();
//             }).catch((error) => {
//                 done(error);
//             });
//         });

//         it('fails to create user with mismatch password', async () => {
//             const req = {
//                 body: {
//                     username: 'userTest',
//                     firstName: 'John',
//                     lastName: 'Doe',
//                     email: 'john@example.com',
//                     password: 'password123',
//                     confirmPassword: 'ayam'
//                 }
//             };
//             let status = null;
//             let responseData = null;
//             const res = {
//                 status: (code) => {
//                     status = code;
//                     return res;
//                 },
//                 json: (data) => {
//                     responseData = data;
//                 }
//             };
//             const next = () => {};

//             // Exercise
//             register(req, res, next).then(() => {
//                 // Verify
//                 expect(status).to.equal(400);
//                 expect(responseData).to.deep.equal({ success: false});
//                 done();
//             }).catch((error) => {
//                 done(error);
//             });
//         });
//     });

//     describe('verifyEmail', () => {
//         it('should verify the user email and delete the user verification entry from the database', async () => {
//             // Mock the User and UserVerification models
//             const User = {
//                 findByIdAndUpdate: (userId, updates) => {
//                     // Check whether the correct user verification status was updated
//                     expect(updates.verified).to.be.true;
//                     // Return a Promise to resolve the mocked database call
//                     return Promise.resolve({ _id: userId });
//                 }
//             };

//             const UserVerification = {
//                 findOne: (query) => {
//                     // Check whether the correct query was passed to the database call
//                     expect(query.userId).to.equal('userId');
//                     expect(query.uniqueString).to.equal('token');
//                     // Return a mocked user verification object
//                     return Promise.resolve({
//                         _id: 'userVerificationId',
//                         userId: 'userId',
//                         uniqueString: 'token',
//                         expiresAt: Date.now() + 10000
//                     });
//                 },
//                 findByIdAndDelete: (id) => {
//                     // Check whether the correct user verification object was deleted
//                     expect(id).to.equal('userVerificationId');
//                     // Return a Promise to resolve the mocked database call
//                     return Promise.resolve({ _id: id });
//                 }
//             };

//             // Mock the request and response objects
//             const req = {
//                 query: {
//                     userId: 'userId',
//                     token: 'token'
//                 }
//             };

//             const res = {
//                 status: (code) => {
//                     return {
//                         json: (data) => {
//                             expect(data).to.deep.equal({ success: true, message: "Email verified successfully" });
//                         }
//                     };
//                 }
//             };
//             const next = () => {};

//             verifyEmail(req, res, next).then(() => {
//                 // Verify
//                 expect(status).to.equal(200);
//                 expect(responseData).to.deep.equal({ success: true });
//                 done();
//             }).catch((error) => {
//                 done(error);
//             });

//         });

//         it('fails to verify account when the userId is empty', async () => {
//             // Mock the User and UserVerification models
//             const User = {};
//             const UserVerification = {};

//             // Mock the request and response objects
//             const req = {
//                 query: {
//                     userId: '',
//                     token: 'token'
//                 }
//             };

//             const res = {
//                 status: (code) => {
//                     return {
//                         json: (data) => {
//                             expect(data).to.deep.equal({ success: false });
//                         }
//                     };
//                 }
//             };
//             const next = () => {};

//             verifyEmail(req, res, next).then(() => {
//                 // Verify
//                 expect(status).to.equal(404);
//                 expect(responseData).to.deep.equal({ success: false });
//                 done();
//             }).catch((error) => {
//                 done(error);
//             });
//         });

//         it('fails to verify account when the token is empty', async () => {
//             // Mock the User and UserVerification models
//             const User = {};
//             const UserVerification = {};

//             // Mock the request and response objects
//             const req = {
//                 query: {
//                     userId: 'userId',
//                     token: ''
//                 }
//             };

//             const res = {
//                 status: (code) => {
//                     return {
//                         json: (data) => {
//                             expect(data).to.deep.equal({ success: false });
//                         }
//                     };
//                 }
//             };
//             const next = () => {};

//             verifyEmail(req, res, next).then(() => {
//                 // Verify
//                 expect(status).to.equal(400);
//                 expect(responseData).to.deep.equal({ success: false });
//                 done();
//             }).catch((error) => {
//                 done(error);
//             });
//         });

//         it('fails to verify account when both the userId and token are empty', async () => {
//             // Mock the User and UserVerification models
//             const User = {};
//             const UserVerification = {};

//             // Mock the request and response objects
//             const req = {
//                 query: {
//                     userId: '',
//                     token: ''
//                 }
//             };

//             const res = {
//                 status: (code) => {
//                     return {
//                         json: (data) => {
//                             expect(data).to.deep.equal({ success: false });
//                         }
//                     };
//                 }
//             };
//             const next = () => {};

//             verifyEmail(req, res, next).then(() => {
//                 // Verify
//                 expect(status).to.equal(400);
//                 expect(responseData).to.deep.equal({ success: false });
//                 done();
//             }).catch((error) => {
//                 done(error);
//             });
//         });

//         it('should return a 404 error when the userId is not found in the database', async () => {
//             // Mock the User and UserVerification models
//             const User = {
//                 findByIdAndUpdate: (userId, updates) => {
//                     // Check whether the correct user verification status was updated
//                     expect(updates.verified).to.be.true;
//                     // Return a Promise to resolve the mocked database call
//                     return Promise.resolve({ _id: userId });
//                 }
//             };

//             const UserVerification = {
//                 findOne: (query) => {
//                     // Check whether the correct query was passed to the database call
//                     expect(query.userId).to.equal('invalidUserId');
//                     expect(query.uniqueString).to.equal('token');
//                     // Return a Promise to reject the mocked database call
//                     return Promise.reject({ message: "User verification not found" });
//                 }
//             };

//             // Mock the request and response objects
//             const req = {
//                 query: {
//                     userId: 'invalidUserId',
//                     token: 'token'
//                 }
//             };

//             const res = {
//                 status: (code) => {
//                     return {
//                         json: (data) => {
//                             expect(data).to.deep.equal({ success: false, error: "Verification token not found" });
//                         }
//                     };
//                 }
//             };
//             const next = () => {};

//             verifyEmail(req, res, next).then(() => {
//                 // Verify
//                 expect(status).to.equal(404);
//                 expect(responseData).to.deep.equal({ success: false, error: "Verification token not found" });
//                 done();
//             }).catch((error) => {
//                 done(error);
//             });
//         });

//         it('should return a 400 error when the token is invalid', async () => {
//             // Mock the User and UserVerification models
//             const User = {
//                 findByIdAndUpdate: (userId, updates) => {
//                     // Check whether the correct user verification status was updated
//                     expect(updates.verified).to.be.true;
//                     // Return a Promise to resolve the mocked database call
//                     return Promise.resolve({ _id: userId });
//                 }
//             };

//             const UserVerification = {
//                 findOne: (query) => {
//                     // Check whether the correct query was passed to the database call
//                     expect(query.userId).to.equal('userId');
//                     expect(query.uniqueString).to.equal('invalidToken');
//                     // Return a mocked user verification object
//                     return Promise.resolve({
//                         _id: 'userVerificationId',
//                         userId: 'userId',
//                         uniqueString: 'token',
//                         expiresAt: Date.now() + 10000
//                     });
//                 }
//             };

//             // Mock the request and response objects
//             const req = {
//                 query: {
//                     userId: 'userId',
//                     token: 'invalidToken'
//                 }
//             };

//             const res = {
//                 status: (code) => {
//                     return {
//                         json: (data) => {
//                             expect(data).to.deep.equal({ success: false, error: "Verification token expired" });
//                         }
//                     };
//                 }
//             };
//             const next = () => {};

//             verifyEmail(req, res, next).then(() => {
//                 // Verify
//                 expect(status).to.equal(400);
//                 expect(responseData).to.deep.equal({ success: false, error: "Verification token expired" });
//                 done();
//             }).catch((error) => {
//                 done(error);
//             });
//         });
//     });

//     describe("resend email verification", () => {
//         it('should resend verification email successfully', async () => {
//             // Setup
//             const req = {
//                 body: {
//                     email: 'john@example.com',
//                 }
//             };
//             let status = null;
//             let responseData = null;
//             const res = {
//                 status: (code) => {
//                     status = code;
//                     return res;
//                 },
//                 json: (data) => {
//                     responseData = data;
//                 }
//             };
//             const next = () => {};

//             // Exercise
//             resendVerificationEmail(req, res, next).then(() => {
//                 // Verify
//                 expect(status).to.equal(201);
//                 expect(responseData).to.deep.equal({ success: true });
//                 done();
//             }).catch((error) => {
//                 done(error);
//             });
//         });

//         it('fails to resend verification email with empty email', async () => {
//             // Setup
//             const req = {
//                 body: {
//                     email: '',
//                 }
//             };
//             let status = null;
//             let responseData = null;
//             const res = {
//                 status: (code) => {
//                     status = code;
//                     return res;
//                 },
//                 json: (data) => {
//                     responseData = data;
//                 }
//             };
//             const next = () => {};

//             // Exercise
//             resendVerificationEmail(req, res, next).then(() => {
//                 // Verify
//                 expect(status).to.equal(400);
//                 expect(responseData).to.deep.equal({ success: false });
//                 done();
//             }).catch((error) => {
//                 done(error);
//             });
//         });
//     });

//     describe('login', () => {
//         it('should login with valid username and password', async () => {
//             const req = {
//                 body: {
//                     username: 'userTest',
//                     password: "password123"
//                 }
//             };
//             let status = null;
//             let responseData = null;
//             const res = {
//                 status: (code) => {
//                     status = code;
//                     return res;
//                 },
//                 json: (data) => {
//                     responseData = data;
//                 }
//             };
//             const next = () => {};

//             // Exercise
//             login(req, res, next).then(() => {
//                 // Verify
//                 expect(status).to.equal(200);
//                 expect(responseData).to.deep.equal({ success: true });
//                 done();
//             }).catch((error) => {
//                 done(error);
//             });
//         });

//         it('should login with valid email as username and password', async () => {
//             const req = {
//                 body: {
//                     username: 'user@testmail.com',
//                     password: "password123"
//                 }
//             };
//             let status = null;
//             let responseData = null;
//             const res = {
//                 status: (code) => {
//                     status = code;
//                     return res;
//                 },
//                 json: (data) => {
//                     responseData = data;
//                 }
//             };
//             const next = () => {};

//             // Exercise
//             login(req, res, next).then(() => {
//                 // Verify
//                 expect(status).to.equal(200);
//                 expect(responseData).to.deep.equal({ success: true });
//                 done();
//             }).catch((error) => {
//                 done(error);
//             });
//         });

//         it('fails to login with empty username and password', async () => {
//             const req = {
//                 body: {
//                     username: '',
//                     password: ""
//                 }
//             };
//             let status = null;
//             let responseData = null;
//             const res = {
//                 status: (code) => {
//                     status = code;
//                     return res;
//                 },
//                 json: (data) => {
//                     responseData = data;
//                 }
//             };
//             const next = () => {};

//             // Exercise
//             login(req, res, next).then(() => {
//                 // Verify
//                 expect(status).to.equal(400);
//                 expect(responseData).to.deep.equal({ success: false });
//                 done();
//             }).catch((error) => {
//                 done(error);
//             });
//         });

//         it('fails to login with invalid username and password', async () => {
//             const req = {
//                 body: {
//                     username: 1,
//                     password: 'a'
//                 }
//             };
//             let status = null;
//             let responseData = null;
//             const res = {
//                 status: (code) => {
//                     status = code;
//                     return res;
//                 },
//                 json: (data) => {
//                     responseData = data;
//                 }
//             };
//             const next = () => {};

//             // Exercise
//             login(req, res, next).then(() => {
//                 // Verify
//                 expect(status).to.equal(400);
//                 expect(responseData).to.deep.equal({ success: false });
//                 done();
//             }).catch((error) => {
//                 done(error);
//             });

//         });
//     });

//     describe("forgot password", () => {
//         it('should send forgot password email successfully', async () => {
//             // Setup
//             const req = {
//                 body: {
//                     email: 'john@example.com',
//                 }
//             };
//             let status = null;
//             let responseData = null;
//             const res = {
//                 status: (code) => {
//                     status = code;
//                     return res;
//                 },
//                 json: (data) => {
//                     responseData = data;
//                 }
//             };
//             const next = () => {};

//             // Exercise
//             forgotPassword(req, res, next).then(() => {
//                 // Verify
//                 expect(status).to.equal(201);
//                 expect(responseData).to.deep.equal({ success: true });
//                 done();
//             }).catch((error) => {
//                 done(error);
//             });
//         });

//         it('fails to send forgot password email with empty email', async () => {
//             // Setup
//             const req = {
//                 body: {
//                     email: '',
//                 }
//             };
//             let status = null;
//             let responseData = null;
//             const res = {
//                 status: (code) => {
//                     status = code;
//                     return res;
//                 },
//                 json: (data) => {
//                     responseData = data;
//                 }
//             };
//             const next = () => {};

//             // Exercise
//             forgotPassword(req, res, next).then(() => {
//                 // Verify
//                 expect(status).to.equal(400);
//                 expect(responseData).to.deep.equal({ success: false });
//                 done();
//             }).catch((error) => {
//                 done(error);
//             });
//         });
//     });

//     describe('resetPassword', () => {});

// });

