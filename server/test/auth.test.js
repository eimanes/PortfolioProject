import { expect } from 'chai';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import UserVerification from '../models/UserVerification.js';
import { 
    signUpService, 
    verifyEmailService, 
    resendVerificationEmailService, 
    signInService, 
    forgotPasswordService, 
    resetPasswordService  
} from '../services/auth.service.js';

dotenv.config();

describe('Auth Service', () => {
    before(async () => {
        const salt = await bcrypt.genSalt();
        const password1 = await bcrypt.hash('Testpassword@1', salt);
        const password2 = await bcrypt.hash('Testpassword@2', salt);
        const password9 = await bcrypt.hash('Testpassword@9', salt);
        try {
            await mongoose.connect(process.env.MONGO_TEST_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
            });

            await User.deleteMany({});
            await UserVerification.deleteMany({});
            await User.create([
                { 
                    userId: '123e4567-e89b-12d3-a456-426655440000', 
                    username: 'test_username_1',
                    email: 'test1@email.com',
                    password: password1,
                    firstName: 'test',
                    lastName: '1',
                    occupation: 'tester',
                    verified: true
                },
                { 
                    userId: '456e7890-f12g-3h4i-5j6k-7l8m9n0o1p',
                    username: 'test_username_2',
                    email: 'test2@email.com',
                    password: password2,
                    firstName: 'test',
                    lastName: '2',
                    location: 'testplace'
                },
                { 
                    userId: 'ayam-f12g-3h4i-5j6k-7l8m9n0o1p',
                    username: 'test_username_9',
                    email: 'test9@email.com',
                    password: password9,
                    firstName: 'test',
                    lastName: '2',
                    location: 'testplace',
                    verified: false
                }
            ]);
            await UserVerification.create([
                {
                    userId: '456e7890-f12g-3h4i-5j6k-7l8m9n0o1p',
                    uniqueString: '515d6f8c-6889-4122-a054-f9d2575ab1db',
                    isRegister: true,
                    createdAt: new Date(),
                    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
                },
                {
                    userId: 'fake-f12g-3h4i-5j6k-7l8m9n0o1p',
                    uniqueString: 'fake-6889-4122-a054-f9d2575ab1db',
                    isPassword: true,
                    createdAt: new Date(),
                    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
                },
            ]);
            
            
        } catch (error) {
            throw error;
        }
    });
    
    after(async () => {
    try {
        await User.deleteMany({});
        await UserVerification.deleteMany({});
        await mongoose.connection.close();
    } catch (error) {
        throw error;
    }
    });

    describe('Sign Up', async () => {
        it('creates a new user with valid data and send verification email', async () => {
            const userData = {
                username: 'test_username_3',
                email: 'test3@email.com',
                password: 'Testpassword@3',
                confirmPassword: 'Testpassword@3',
                firstName: 'test',
                lastName: '3',
            };

            try {
                const result = await signUpService(userData);
                expect(result.success).to.equal(true);
                expect(result.message).to.equal("Signup successful. Please verify your email");   
            } catch (error) {
                throw error;
            }
        });

        it('fails to create user with empty data', async () => {
            const userData = {
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                firstName: '',
                lastName: '',
            };
            try {
                const result = await signUpService(userData);
                expect(result.success).to.equal(false);  
            } catch (error) {
                throw error;
            }
        });

        it('fails to create user with invalid username (space)', async () => {
            const userData = {
                username: 'test username 4',
                email: 'test4@email.com',
                password: 'Testpassword@4',
                confirmPassword: 'Testpassword@4',
                firstName: 'test',
                lastName: '4',
            };
            try {
                const result = await signUpService(userData);
                expect(result).to.deep.equal({
                    success: false, 
                    error: "Username can only contain alphanumeric characters and underscore" 
                });  
            } catch (error) {
                throw error;
            }
        });

        it('fails to create user with invalid username (not enough characters)', async () => {
            const userData = {
                username: 'a',
                email: 'test4@email.com',
                password: 'Testpassword@4',
                confirmPassword: 'Testpassword@4',
                firstName: 'test',
                lastName: '3',
            };
            try {
                const result = await signUpService(userData);
                expect(result).to.deep.equal({
                    success: false, 
                    error: "Username must be at least 5 characters long" 
                });  
            } catch (error) {
                throw error;
            }
        });

        it('fails to create user with invalid password (not meet requirements)', async () => {
            const userData = {
                username: 'test_username_4',
                email: 'test4@email.com',
                password: 'rd@4',
                confirmPassword: 'rd@4',
                firstName: 'test',
                lastName: '4',
            };
            try {
                const result = await signUpService(userData);
                expect(result).to.deep.equal({
                    success: false, 
                    error: "Password must be at least 8 characters long, contain at least 1 number, and contain at least 1 special character" 
                });  
            } catch (error) {
                throw error;
            }
        });

        it('fails to create user with mismatch password', async () => {
            const userData = {
                username: 'test_username_4',
                email: 'test4@email.com',
                password: 'Testpassword@4',
                confirmPassword: 'Testpassword@5',
                firstName: 'test',
                lastName: '4',
            };
            try {
                const result = await signUpService(userData);
                expect(result).to.deep.equal({
                    success: false,
                    error: "Passwords do not match",
                });  
            } catch (error) {
                throw error;
            }
        });

        it('fails to create user with invalid email', async () => {
            const userData = {
                username: 'test_username_4',
                email: 'test4email.com',
                password: 'Testpassword@4',
                confirmPassword: 'Testpassword@4',
                firstName: 'test',
                lastName: '4',
            };
            try {
                const result = await signUpService(userData);
                expect(result).to.deep.equal({
                    success: false,
                    error: "Email is required and must be valid",
                });  
            } catch (error) {
                throw error;
            }
        });

        it('fails to create user with existing username', async () => {
            const userData = {
                username: 'test_username_1',
                email: 'test4@email.com',
                password: 'Testpassword@4',
                confirmPassword: 'Testpassword@4',
                firstName: 'test',
                lastName: '4',
            };
            try {
                const result = await signUpService(userData);
                expect(result).to.deep.equal({
                    success: false,
                    error: "Username is already taken",
                });  
            } catch (error) {
                throw error;
            }
        });

        it('fails to create user with existing email', async () => {
            const userData = {
                username: 'test_username_4',
                email: 'test1@email.com',
                password: 'Testpassword@4',
                confirmPassword: 'Testpassword@4',
                firstName: 'test',
                lastName: '4',
            };
            try {
                const result = await signUpService(userData);
                expect(result).to.deep.equal({
                    success: false,
                    error: "Email is already taken",
                });  
            } catch (error) {
                throw error;
            }
        });
    });

    describe('verifyEmailService', async () => {
        it('should return success if userId and token is valid', async () => {
          const userId = '456e7890-f12g-3h4i-5j6k-7l8m9n0o1p';
          const userVertification = await UserVerification.findOne({ userId, isRegister: true });
          const token = userVertification.uniqueString;
          try {
            const result = await verifyEmailService(userId, token);
            expect(result).to.deep.equal({
                success: true, 
                message: "Email verified successfully"
            })
          } catch (error) {
            throw new Error(error.message);
          }
        });

        it('should return user not found when userId does not exist', async () => {
            const nonExistingUserId = '2665544-e89b-12d3-a456-123e45670000';
            const token = 'mockToken';
            const username = 'username';
          
            try {
              const result = await verifyEmailService(nonExistingUserId, token);
              expect(result.success).to.equal(false);
            } catch (error) {
              throw new Error(error.message);
            }
          });
      
        it('should return user not found when token does not exist', async () => {
            const userId = '123e4567-e89b-12d3-a456-426655440000';
            const userVertification = await UserVerification.findOne({ userId, isUsername: true });
            const token = 'mockToken';
            try {
                const username = 'username';
                const result = await verifyEmailService(userId, token);
                expect(result.success).to.equal(false);
            } catch (error) {
                throw new Error(error.message);
            }
        });
    });

    describe('resendVerificationEmailService', async () => {
        it('should successfully resend the verification email with valid email', async () => {
            const email = 'test3@email.com';
            try {
                const result = await resendVerificationEmailService(email);
                expect(result).to.deep.equal({
                    success: true,
                    message: "Verification email resent successfully"
                });
            } catch (error) {
                throw new Error(error.message);
            }
        });

        it('should return error with invalid email', async () => {
            const email = 'test3email.com';
            try {
                const result = await resendVerificationEmailService(email);
                expect(result).to.deep.equal({
                    success: false,
                    error: "Email is required and must be valid"
                });
            } catch (error) {
                throw new Error(error.message);
            }
        });

        it('should return error with non-existing email', async () => {
            const email = 'test5@email.com';
            try {
                const result = await resendVerificationEmailService(email);
                expect(result).to.deep.equal({
                    status: 404,
                    success: false,
                    error: "User not found"
                });
            } catch (error) {
                throw new Error(error.message);
            }
        });

        it('should return error with user email that has been verified', async () => {
            const email = 'test2@email.com';
            try {
                const result = await resendVerificationEmailService(email);
                expect(result).to.deep.equal({
                    success: false,
                    error: "User has been verified"
                });
            } catch (error) {
                throw new Error(error.message);
            }
        });
    });

    describe('SignInService', async () => {
        it('should return login success with correct username and password', async () => {
            const username = 'test_username_1';
            const password = 'Testpassword@1';
            try {
                const result = await signInService(username, password);
                expect(result.success).to.deep.equal(true);
            } catch (error) {
                throw new Error(error.message);
            }
        });

        it('should return login success with correct email and password', async () => {
            const email = 'test1@email.com';
            const password = 'Testpassword@1';
            try {
                const result = await signInService(email, password);
                expect(result.success).to.deep.equal(true);
            } catch (error) {
                throw new Error(error.message);
            }
        });

        it('should throw error login with non-existing email and password', async () => {
            const email = 'test5@email.com';
            const password = 'testpassword1';
            try {
                const result = await signInService(email, password);
                expect(result).to.deep.equal({
                    success: false, 
                    error: "User not found" 
                });
            } catch (error) {
                throw new Error(error.message);
            }
        });

        it('should throw error login with correct username but invalid password', async () => {
            const username = 'test_username_1';
            const password = 'testpassword2';
            try {
                const result = await signInService(username, password);
                expect(result).to.deep.equal({
                    success: false,
                    error: "Invalid Password!"
                });
            } catch (error) {
                throw new Error(error.message);
            }
        });

        it('should throw error login with unverified user', async () => {
            const username = 'test_username_9';
            const password = 'Testpassword@9';
            try {
                const result = await signInService(username, password);
                expect(result).to.deep.equal({
                    success: false, 
                    error: "User has not verified" 
                });
            } catch (error) {
                throw new Error(error.message);
            }
        });
    });
    
    describe('forgotPasswordService', async () => {
        it.skip('should return sending email successful with correct email', async () => {
          try {
            const email1 = 'test1@email.com';
            const email2 = 'test2@email.com';
            const result = await forgotPasswordService(email1);
            await forgotPasswordService(email2);
            expect(result).to.deep.equal({
              success: true,
              message: "Password reset email sent"
            });
          } catch (error) {
                throw new Error(error.message);
          }
        });

        it('should throw error if email is not valid', async () => {
            try {
              const email = '';
              const result = await forgotPasswordService(email);
              expect(result).to.deep.equal({
                success: false,
                error: "Email is required and must be valid"
              });
            } catch (error) {
                throw new Error(error.message);
            }
          });
        
        it('should return user not found with non existing email', async () => {
          try {
            const email = 'ayam@email.com';
            const result = await forgotPasswordService(email);
            console.log(result);
            expect(result.success).to.deep.equal(false);
              
          } catch (error) {
            throw new Error(error.message);
          }
        });
      });
    
      describe('resetPasswordService', async () => {
        it.skip('should return success if reset password meets requirements ', async () => {
          const userId = '456e7890-f12g-3h4i-5j6k-7l8m9n0o1p';
          const userVertification = await UserVerification.findOne({ userId, isPassword: true });
          const token = userVertification.uniqueString;
          const newPassword = 'Testpassword@1';
          const confirmNewPassword = 'Testpassword@1';
          const paramData = { userId, token };
          const passwordData = {newPassword, confirmNewPassword };
          try {
            const result = await resetPasswordService(paramData, passwordData);
            expect(result).to.deep.equal({
                success: true, 
                message: "Password reset successfully"
            })
          } catch (error) {
            throw new Error(error.message);
          }
        });
    
        it('should return user not found when userId does not exist', async () => {
          const nonExistingUserId = '2665544-e89b-12d3-a456-123e45670000';
          const token = 'mockToken';
          const newPassword = 'Testpassword@1';
          const confirmNewPassword = 'Testpassword@1';
        
          const paramData = { userId: nonExistingUserId, token };
          const passwordData = { newPassword, confirmNewPassword };
          try {
            const result = await resetPasswordService(paramData, passwordData);
            expect(result.success).to.equal(false);
          } catch (error) {
            throw new Error(error.message);
          }
        });
    
        it('should return user not found when token does not exist', async () => {
          const userId = '123e4567-e89b-12d3-a456-426655440000';
          const userVertification = await UserVerification.findOne({ userId, isPassword: true });
          const token = 'mockToken';
          const newPassword = 'Testpassword@1';
          const confirmNewPassword = 'Testpassword@1';
          const paramData = { userId, token };
          const passwordData = { newPassword, confirmNewPassword };
          try {
            const result = await resetPasswordService(paramData, passwordData);
            expect(result.success).to.equal(false);
          } catch (error) {
            throw new Error(error.message);
          }
        });
    
        it('should return error if reset password does not meet requirements', async () => {
          const userId = 'fake-f12g-3h4i-5j6k-7l8m9n0o1p';
          const userVertification = await UserVerification.findOne({ userId, isPassword: true });
          const token = userVertification.uniqueString;
          const newPassword = '@1';
          const confirmNewPassword = '@1';
          const paramData = { userId, token };
          const passwordData = { newPassword, confirmNewPassword };
          try {
            const result = await resetPasswordService(paramData, passwordData);
            expect(result.success).to.equal(false);
          } catch (error) {
            throw new Error(error.message);
          }
        });
    
        it.skip('should return error if password field is empty', async () => {
          const userId = 'fake-f12g-3h4i-5j6k-7l8m9n0o1p';
          const userVertification = await UserVerification.findOne({ userId, isUsername: true });
          const token = userVertification.uniqueString;
          const newPassword = '';
          const confirmNewPassword = '';
          const paramData = { userId, token };
          const passwordData = { newPassword, confirmNewPassword };
          try {
            const result = await resetPasswordService(paramData, passwordData);
            expect(result.success).to.equal(false);
          } catch (error) {
            throw new Error(error.message);
          }
        });

        it.skip('should return error if password mismatch', async () => {
            const userId = 'fake-f12g-3h4i-5j6k-7l8m9n0o1p';
            const userVertification = await UserVerification.findOne({ userId, isUsername: true });
            const token = userVertification.uniqueString;
            const newPassword = 'TestPassword@2';
            const confirmNewPassword = 'itik';
            const paramData = { userId, token };
            const passwordData = { newPassword, confirmNewPassword };
            try {
              const result = await resetPasswordService(paramData, passwordData);
              expect(result.success).to.equal(false);
            } catch (error) {
              throw new Error(error.message);
            }
          });
      });
})

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

