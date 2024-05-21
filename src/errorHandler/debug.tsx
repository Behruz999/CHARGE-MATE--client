import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { ErrorResponse } from "../aliases/alias";

export function LogError(err: AxiosError): string {
    const axiosError = err as AxiosError<ErrorResponse>;

    if (axiosError.response && axiosError.response.data) {
        const data = axiosError.response.data;
        // Type assertion to tell TypeScript that data is of type ErrorResponse
        const errorMessage = (data as ErrorResponse).msg;
        if (errorMessage) {
            return errorMessage;
        }
    }

    return err.message; // Fallback to generic error message
}

export function Notify(msg: string, condition: string) {
    switch (condition) {
        case 'err':
            toast.error(msg, {
                position: "top-left"
            });
            break;
        case 'success':
            toast.success(msg, {
                position: "top-center"
            });
            break
        case 'warn':
            toast.warn(msg, {
                position: "top-center"
            });
            break
        case 'info':
            toast.info(msg, {
                position: "top-center"
            });
            break

        default:
            toast("Default Notification !");
            break;
    }
}
