import * as EChatEvt from '../enums';
import * as IAuth from '../../interfaces';

export interface IResponseWithPk {
  id: string;
}

export interface IEventAggregateResponse<T, K> extends IResponseWithPk {
  type: T;
  data: K;
}

export interface IUpdateChatStatusEvt {
  sendStatus?: EChatEvt.EChatSendStatus;
  readStatus?: EChatEvt.EChatStatus;
  participateId?: string;
  chatId?: string;
  requestUserId: string;
  user: IAuth.JwtPayload;
}
