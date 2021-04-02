import { InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Repository, EntityRepository, getManager, EntityManager, Not } from 'typeorm';
import { User } from './user.entity';
import * as IUser from '../interfaces';
import { DeleteUserEventDto, UpdatePasswordEventDto, UpdateUserAdditionalInfoPublishDto } from './dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly repoManager: EntityManager = getManager();
  private readonly logger = new Logger('UserRepository');

  /**
   * @description async createUser Event
   * @event
   * @public
   * @param {User} userReq
   * @returns {void}
   */
  public createUser(userReq: User): void {
    this.repoManager.save(User, userReq).catch((err) => this.logger.log(err.message, 'CreatUser'));
  }

  /**
   * @description Get User By Id
   * @public
   * @param {string} id
   * @param {boolean} isAdmin
   * @returns {Promise<User>}
   */
  public async getUserById(id: string, isAdmin: boolean): Promise<User> {
    try {
      const findOpts: IUser.IFindOne = {
        where: {
          id,
          status: true,
        },
      };
      // only admin can view admin data
      // trial, user, vip can view each others data except admin data
      if (!isAdmin) findOpts.where.role = Not('admin');

      const user: User = await this.findOne(findOpts);
      if (!user) throw new NotFoundException();
      delete user.password;
      delete user.salt;
      return user;
    } catch (error) {
      this.logger.log(error.message, 'GetUserById');
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @description Get Chat participates
   * @public
   * @param {string} ids
   * @returns {Promise<User[]>}
   */
  public async getParticipates(ids: string[]): Promise<User[]> {
    try {
      const users: User[] = await this.findByIds(ids);
      if (users.length === 0) throw new NotFoundException();
      users.forEach((user) => {
        delete user.password;
        delete user.salt;
      });
      return users;
    } catch (error) {
      this.logger.error(error.message, '', 'GetParticipates');
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @description Update user password
   * @event
   * @public
   * @param {UpdatePasswordEventDto} updatePasswordEventDto
   * @returns {Promise<void>}
   */
  public async updateUserPassword(updatePasswordEventDto: UpdatePasswordEventDto): Promise<void> {
    const { id, salt, password } = updatePasswordEventDto;
    try {
      const user = await this.repoManager.getRepository(User).findOne({ where: { id, status: true } });
      user.salt = salt;
      user.password = password;
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @description Update user additional info
   * @event
   * @public
   * @param {UpdateUserAdditionalInfoPublishDto} updateUserAdditionalInfoPublishDto
   * @returns {Promise<void>}
   */
  public async updateUserAdditionalInfo(updateUserAdditionalInfoPublishDto: UpdateUserAdditionalInfoPublishDto): Promise<void> {
    const { id, gender, age, desc, profileImage } = updateUserAdditionalInfoPublishDto;
    try {
      const user = await this.repoManager.getRepository(User).findOne({ where: { id, status: true } });
      if (gender) user.gender = gender;
      if (age) user.age = age;
      if (desc) user.desc = desc;
      if (profileImage) user.profileImage = profileImage;
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @description Soft delete user
   * @event
   * @public
   * @param {DeleteUserEventDto} deleteUserEventDto
   * @returns {Promise<void>}
   */
  public async softDeleteUser(deleteUserEventDto: DeleteUserEventDto): Promise<void> {
    const { id } = deleteUserEventDto;
    try {
      const user = await this.repoManager.getRepository(User).findOne({ where: { id, status: true } });
      user.status = false;
      await user.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
