import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { getUserService } from '../services/user.service.js';

dotenv.config();


describe('getUserService', () => {
  before((done) => {
    // Connect to MongoDB
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        User.deleteMany({})
        .then(() => {
            User.create([
                { 
                    userId: '123e4567-e89b-12d3-a456-426655440000', 
                    username: 'test_username_1',
                    email: 'test1@email.com',
                    password: 'testpassword1',
                },
                { 
                    userId: '456e7890-f12g-3h4i-5j6k-7l8m9n0o1p',
                    username: 'test_username_2',
                    email: 'test2@email.com',
                    password: 'testpassword2',
                }
            ])
            .then(() => {
                done();
            })
        })
    })
    .catch(error => {
        done(error);
    });
  });

  after((done) => {
    User.deleteMany({})
    .then(() => {
      mongoose.connection.close()
      .then(() => {
        done();
      });
    })
    .catch(error => {
      done(error);
    });
  });

  it('should return a user by userId', (done) => {
    getUserService('123e4567-e89b-12d3-a456-426655440000')
      .then(user => {
        expect(user).to.not.be.null;
        expect(user.userId).to.equal('123e4567-e89b-12d3-a456-426655440000');
        done();
      })
      .catch(error => {
        done(error);
      });
  });

  it('should return a user by username', (done) => {
    getUserService('test_username_1')
      .then(user => {
        expect(user).to.not.be.null;
        expect(user.username).to.equal('test_username_1');
        done();
      })
      .catch(error => {
        done(error);
      });
  });

  it('should throw an error when the user is not found by userId', (done) => {
    const nonExistingUserId = '42665544-e89b-12d3-a456-123e45670000';
    getUserService(nonExistingUserId)
      .then(() => {
        done(new Error('User not found'));
      })
      .catch(error => {
        expect(error).to.be.an('error');
        expect(error.message).to.equal('User not found');
        done();
      });
  });

  it('should throw an error when the user is not found by username', (done) => {
    const nonExistingUsername = 'non_existing_username';
    getUserService(nonExistingUsername)
      .then(() => {
        done(new Error('User not found'));
      })
      .catch(error => {
        expect(error).to.be.an('error');
        expect(error.message).to.equal('User not found');
        done();
      });
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