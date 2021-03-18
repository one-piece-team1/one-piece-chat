import WebSocket from 'ws';
import * as EChatRoom from '../enums';

interface IBaseTimeArea {
  createdAt: string;
  updatedAt: string;
}

export interface IUserEntity extends IBaseTimeArea {
  id: string;
  role: EChatRoom.EUserRole;
  expiredDate: string;
  diamondCoin: number;
  goldCoin: number;
  username: string;
  email: string;
  status: boolean;
  gender?: EChatRoom.EUserGender;
  age?: number;
  desc?: string;
  profileImage?: string;
  chatParticipates: IChatParticipateEntity[];
  followers: IUserEntity[];
  followings: IUserEntity[];
  blockLists: IUserEntity[];
  followerCount: number;
  followingCount: number;
}

export interface IChatEntity extends IBaseTimeArea {
  id: string;
  message: string;
  chatParticipate: IChatParticipateEntity;
}

export interface IChatParticipateEntity extends IBaseTimeArea {
  id: string;
  chatRoom: IChatRoomEntity;
  chats: IChatEntity[];
  users: IUserEntity[];
}

export interface IChatRoomEntity extends IBaseTimeArea {
  id: string;
  name: string;
  type: EChatRoom.EChatRoomType;
  chatParticipate: IChatParticipateEntity;
}

export interface ISocketWithIdentity extends WebSocket {
  uid: string;
}
