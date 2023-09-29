import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import axios from "@/lib/axios";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

const settingsUrl = absoluteUrl("/settings");

export async function GET() {
    try {
        const { userId } = auth();
        const user = currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const response = await axios.get(`/user-subscription/?userId=${userId}`);

        if (response?.data?.userId && response?.data?.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: response?.data?.stripeCustomerId,
                return_url: settingsUrl,
            });

            return new NextResponse(JSON.stringify({ url: stripeSession.url }));
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: await user.then((u) => u?.emailAddresses?.[0]?.emailAddress ?? ""),
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Futurify Subscription",
                            description: "Ultimate Futurify Usage",
                        },
                        unit_amount: 2000,
                        recurring: {
                            interval: "month",
                        },
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId,
            },
        });

        return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    } catch (error) {
        console.log("Error In Stripe Api Route", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
