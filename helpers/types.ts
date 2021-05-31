/*
 * The idea here is that if success is true, the value must be of type output.
 * Otherwise, it must be of type string for the error.
 */
interface ResponseBase<Success, Output> {
  success: Success;
  value: Success extends true ? Output : string;
}

export type Response<Output> =
  | ResponseBase<true, Output>
  | ResponseBase<false, Output>;
