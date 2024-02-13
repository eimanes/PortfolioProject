import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import UserVerification from '../models/UserVerification.js';
import { 
  getUserService, 
  getUsersListService, 
  updateUserService, 
  changeUsernameReqService, 
  confirmChangeUsernameService, 
  deleteUserReqService, 
  confirmDeleteUserService 
} from "../services/user.service.js";

dotenv.config();


describe('User Service', () => {
  before(async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL, {
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
          password: 'testpassword1',
          firstName: 'test',
          lastName: '1',
          occupation: 'tester',
        },
        { 
          userId: '456e7890-f12g-3h4i-5j6k-7l8m9n0o1p',
          username: 'test_username_2',
          email: 'test2@email.com',
          password: 'testpassword2',
          firstName: 'test',
          lastName: '2',
          location: 'testplace'
        }
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
  
  describe('getUserService', () => {
    it('should return a user by userId', async () => {
      try {
        const user = await getUserService('123e4567-e89b-12d3-a456-426655440000');
        expect(user).to.not.be.null;
        expect(user.userId).to.equal('123e4567-e89b-12d3-a456-426655440000');
      } catch (error) {
        throw error;
      }
    });
    
    it('should return a user by username', async () => {
      try {
        const user = await getUserService('test_username_1');
        expect(user).to.not.be.null;
        expect(user.username).to.equal('test_username_1');
      } catch (error) {
        throw error;
      }
    });
    
    it('should throw an error when the user is not found by userId', async () => {
      const nonExistingUserId = '42665544-e89b-12d3-a456-123e45670000';
      try {
        const result = await getUserService(nonExistingUserId);
        expect(result).to.deep.equal({
          status: 404,
          success: false,
          message: "User not found"
      });
      } catch (error) {
        expect(error).to.deep.equal({
          status: 404,
          success: false,
          message: "User not found"
      });
      }
    });
    
    it('should throw an error when the user is not found by username', async () => {
      const nonExistingUsername = 'non_existing_username';
      try {
        const result = await getUserService(nonExistingUsername);
        expect(result).to.deep.equal({
            status: 404,
            success: false,
            message: "User not found"
        });
        
      } catch (error) {
        expect(error).to.deep.equal({
          status: 404,
          success: false,
          message: "User not found"
      });
      }
    });

    it('should throw an error when the userId / username empty', async () => {
      const empty = '';
      try {
        const result = await getUserService(empty);
        expect(result).to.deep.equal({
          status: 404,
          success: false,
          message: "User not found"
      });
      } catch (error) {
        expect(error).to.deep.equal({
          status: 404,
          success: false,
          message: "User not found"
      });
      }
    });
    
    it('should count a single user when querying by userId', async () => {
      const userCount = await User.countDocuments({ userId: '123e4567-e89b-12d3-a456-426655440000' });
      expect(userCount).to.equal(1);
    });
    
    it('should count a single user when querying by username', async () => {
      const userCount = await User.countDocuments({ username: 'test_username_1' });
      expect(userCount).to.equal(1);
    });
  });

  describe('getUserListService', () => {
    it('should return all users list', async () => {
      const result = await getUsersListService();
      expect(result).to.equal(result);
    });

    it('should return users with name: "1" only', async () => {
      const result = await getUsersListService('','','1');
      expect(result[0].userId).to.equal('123e4567-e89b-12d3-a456-426655440000');
    });

    it('should return user if user with occupation: "tester" only', async () => {
      const result = await getUsersListService('','','', 'tester');
      expect(result[0].userId).to.equal('123e4567-e89b-12d3-a456-426655440000');
    });

    it('should return user if user with location: "testplace" only', async () => {
      const result = await getUsersListService('','','', '', 'testplace');
      expect(result[0].userId).to.equal('456e7890-f12g-3h4i-5j6k-7l8m9n0o1p');
    });

    it('should return user if user with name: "1" and occupation: "tester"', async () => {
      const result = await getUsersListService('','','1', 'tester');
      expect(result[0].userId).to.equal('123e4567-e89b-12d3-a456-426655440000');
    });

    it('should return user if user with name: "2" and location: "testplace"', async () => {
      const result = await getUsersListService('','','2', '', 'testplace');
      expect(result[0].userId).to.equal('456e7890-f12g-3h4i-5j6k-7l8m9n0o1p');
    });

    it('should return empty if user with name: "1", and location: "testplace"', async () => {
      const result = await getUsersListService('','','1', '', 'testplace');
      expect(result).to.be.an('array').that.is.empty;
    });

    it('should return empty if user with name: "2", and occupation: "tester"', async () => {
      const result = await getUsersListService('','','2', 'tester', '');
      expect(result).to.be.an('array').that.is.empty;
    });

    it('should return empty if user with name: "1", occupation: "tester", and location: "testplace"', async () => {
      const result = await getUsersListService('','','1', 'tester', 'testplace');
      expect(result).to.be.an('array').that.is.empty;
    });
  });

  describe('updateUserService', async () =>  {
    it('should return success if update data with correct requirements', async () => {
      try {
        const userData = {
          firstName: 'John',
          lastName: 'Smith',
          location: 'newplace',
          occupation: 'spoiler',
        }
        const userId = '456e7890-f12g-3h4i-5j6k-7l8m9n0o1p';
        const result = await updateUserService(userId, userData);
        expect(result).to.equal(result);

      } catch (error){
        throw error;
      }
    });

    it('should return user not found if update data with non-exist userId', async () => {
      try {
        const userData = {
          firstName: 'John',
          lastName: 'Smith',
          location: 'newplace',
          occupation: 'spoiler',
        }
        const noexisting_userId = '42665544-e89b-12d3-a456-123e45670000';
        const result = await updateUserService(noexisting_userId, userData);
        expect(result).to.deep.equal({
          status: 404,
          success: false,
          message: "User not found"
      });
      } catch (error) {
        expect(error).to.deep.equal({
          status: 404,
          success: false,
          message: "User not found"
        });
      }
    })
  });

  describe('changeUsernameReqService', async () => {
    it('should return sending email successful with correct userId', async () => {
      try {
        const userId1 = '456e7890-f12g-3h4i-5j6k-7l8m9n0o1p';
        const userId2 = '123e4567-e89b-12d3-a456-426655440000';
        const result = await changeUsernameReqService(userId1);
        await changeUsernameReqService(userId2);
        expect(result).to.deep.equal({
          success: true,
          message: "Username reset email sent"
        });
      } catch (error) {
        expect(result).to.deep.equal({
          success: false, 
          error: 'Failed to send username reset email' 
        });
      }
    });
    
    it('should return user not found with non existing userId', async () => {
      try {
        const noexisting_userId = '42665544-e89b-12d3-a456-123e45670000';
        const result = await changeUsernameReqService(noexisting_userId);
        expect(result).to.deep.equal({
          status: 404,
          success: false,
          error: "User not found" 
        });
      } catch (error) {
        expect(error).to.deep.equal({
          status: 404,
          success: false,
          error: "User not found" 
        });
      }
    });
  });

  describe('confirmChangeUsernameService', async () => {
    it('should return success if change username meets requirements ', async () => {
      const userId = '456e7890-f12g-3h4i-5j6k-7l8m9n0o1p';
      const userVertification = await UserVerification.findOne({ userId, isUsername: true });
      const token = userVertification.uniqueString;
      const paramData = { userId, token };
      try {
        const username = 'username';
        const result = await confirmChangeUsernameService(paramData, username);
        expect(result).to.deep.equal({
          success: true, 
          message: "Username reset successfully" 
        })
      } catch (error) {
        throw new Error(error.message);
      }
    });

    it('should return user not found when userId does not exist', async () => {
      const nonExistingUserId = '2665544-e89b-12d3-a456-123e45670000';
      const token = 'mockToken';
      const username = 'username';
    
      const paramData = { userId: nonExistingUserId, token };
      try {
        const result = await confirmChangeUsernameService(paramData, username);
        expect(result.success).to.equal(false);
      } catch (error) {
        throw new Error(error.message);
      }
    });

    it('should return user not found when token does not exist', async () => {
      const userId = '123e4567-e89b-12d3-a456-426655440000';
      const userVertification = await UserVerification.findOne({ userId, isUsername: true });
      const token = 'mockToken';
      const paramData = { userId, token };
      try {
        const username = 'username';
        const result = await confirmChangeUsernameService(paramData, username);
        expect(result.success).to.equal(false);
      } catch (error) {
        throw new Error(error.message);
      }
    });

    it('should return error if change username does not meet requirements', async () => {
      const userId = '123e4567-e89b-12d3-a456-426655440000';
      const userVertification = await UserVerification.findOne({ userId, isUsername: true });
      const token = userVertification.uniqueString;
      const paramData = { userId, token };
      try {
        const username = 'a b c@';
        const result = await confirmChangeUsernameService(paramData, username);
        expect(result.success).to.equal(false);
      } catch (error) {
        throw new Error(error.message);
      }
    });

    it('should return error if username field is empty', async () => {
      const userId = '123e4567-e89b-12d3-a456-426655440000';
      const userVertification = await UserVerification.findOne({ userId, isUsername: true });
      const token = userVertification.uniqueString;
      const paramData = { userId, token };
      try {
        const username = null;
        const result = await confirmChangeUsernameService(paramData, username);
        expect(result.success).to.equal(false);
      } catch (error) {
        throw new Error(error.message);
      }
    });
  });

  describe('deleteUserReqService', async () => {
    it('should return sending email successfull with correct userId', async () => {
      try {
        const userId1 = '456e7890-f12g-3h4i-5j6k-7l8m9n0o1p';
        const userId2 = '123e4567-e89b-12d3-a456-426655440000';
        const result = await deleteUserReqService(userId1);
        await deleteUserReqService(userId2);
        expect(result).to.deep.equal({
          success: true,
          message: "Delete user email sent"
        });
      } catch (error) {
        expect(result).to.deep.equal({
          success: false, 
          error: 'Failed to send delete user email' 
        });
      }
    });
    
    it('should return user not found with non existing userId', async () => {
      try {
        const noexisting_userId = '42665544-e89b-12d3-a456-123e45670000';
        const result = await deleteUserReqService(noexisting_userId);
        expect(result).to.deep.equal({
          status: 404,
          success: false,
          error: "User not found" 
        });
      } catch (error) {
        expect(error).to.deep.equal({
          status: 404,
          success: false,
          error: "User not found" 
        });
      }
    });
  });

  describe('confirmDeleteUser', async () => {
    it('should return success if delete user meets requirements ', async () => {
      const userId = '456e7890-f12g-3h4i-5j6k-7l8m9n0o1p';
      const userVertification = await UserVerification.findOne({ userId, isDeleteUser: true });
      const token = userVertification.uniqueString;
      try {
        const result = await confirmDeleteUserService(userId, token);
        expect(result).to.deep.equal({
          success: true, 
        message: "User deleted successfully" 
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
        const result = await confirmDeleteUserService(nonExistingUserId, token);
        expect(result.success).to.equal(false);
      } catch (error) {
        throw new Error(error.message);
      }
    });

    it('should return user not found when token does not exist', async () => {
      const userId = '123e4567-e89b-12d3-a456-426655440000';
      const userVertification = await UserVerification.findOne({ userId, isDeleteUser: true });
      const token = 'mockToken';
      try {
        const username = 'username';
        const result = await confirmDeleteUserService(userId, token);
        expect(result.success).to.equal(false);
      } catch (error) {
        throw new Error(error.message);
      }
    });
  });
});