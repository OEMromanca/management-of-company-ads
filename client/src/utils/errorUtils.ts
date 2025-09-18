import { toast } from "react-toastify";

export function handleError(message: string, err: unknown) {
  console.error(message, err);
  toast(message);
}
