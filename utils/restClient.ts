import { Response } from "./types";

/**
 * Fetches from the server using a POST request.
 * @param Output expected output on success
 * @param route route to fetch from
 * @param body body of the POST request
 * @returns A promise returning a Result of type Output or string.
 * It is guaranteed that result.value is of type Output when result.success is true,
 * and result.value is of type string when result.success is false.
 */

export const post = async <Output>(
  route: string,
  body: object = {}
): Promise<Response<Output>> => {
  const response = await (
    await fetch(`/api/${route}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  ).text();

  try {
    return JSON.parse(response);
  } catch (e) {
    return { success: false, value: "Invalid server response. How? Not sure." };
  }
};
