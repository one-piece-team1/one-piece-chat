export interface IAggregateResponse<T, K> {
  type: T;
  data: K;
}

export interface IResponseWithPk {
  id: string;
}
