export interface Usecase<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>
}
