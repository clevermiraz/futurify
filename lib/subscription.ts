import { auth } from "@clerk/nextjs";
import axiosInstance from "./axios";

const DAY_IN_MILLISECONDS = 86_400_000;

export const checkSubscription = async () => {
    const { userId } = auth();

    if (!userId) {
        return false;
    }

    const response = await axiosInstance.get(`/user-subscription/?userId=${userId}`);

    if (!response?.data?.stripeSubscriptionId) {
        return false;
    }

    const parseStripeCurrentPeriodEndToMiliseconds = Date.parse(response?.data?.stripeCurrentPeriodEnd);

    const isValid =
        response?.data?.stripePriceId && parseStripeCurrentPeriodEndToMiliseconds + DAY_IN_MILLISECONDS > Date.now();

    return !!isValid;
};
