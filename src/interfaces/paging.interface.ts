export interface IPagingResponse {
  take: number;
  skip: number;
  count: number;
}

export interface IChatRoomPagingResponseBase<T> extends IPagingResponse {
  chatrooms: T;
}
