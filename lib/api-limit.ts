import { auth } from "@clerk/nextjs";
import axios from "./axios";

export const incrementApiLimit = async () => {
    const { userId } = auth();

    if (!userId) {
        return;
    }

    const data = {
        userId: userId,
    };

    const response = await axios.post("/user-api-limit/", data);
    return response.data;
};

export const checkApiLimit = async () => {
    const { userId } = auth();

    if (!userId) {
        return false;
    }

    const response = await axios.get(`/user-api-limit/?userId=${userId}`);

    if (response?.data.isNewUser || response?.data?.count < 5) {
        return true;
    } else {
        return false;
    }
};
