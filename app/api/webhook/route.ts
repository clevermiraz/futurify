import axios from "@/lib/axios";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
    const body = await request.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (error: any) {
        console.log("Error In Stripe Webhook Route", error.message);
        return new NextResponse("Invalid Stripe Webhook Signature", { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        if (!session?.metadata?.userId) {
            return new NextResponse("Invalid User Id", { status: 400 });
        }

        const response = await axios.post("/user-subscription/", {
            userId: session?.metadata?.userId,
            stripeSubscriptionId: subscription?.id,
            stripeCustomerId: subscription?.customer as string,
            stripePriceId: subscription?.items?.data?.[0]?.price?.id,
            stripeCurrentPeriodStart: new Date((subscription?.current_period_start as number) * 1000).toISOString(),
            stripeCurrentPeriodEnd: new Date((subscription?.current_period_end as number) * 1000).toISOString(),
        });
    }

    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        const response = await axios.post("/user-subscription/", {
            stripeSubscriptionId: subscription?.id,
            stripePriceId: subscription?.items?.data?.[0]?.price?.id,
            stripeCurrentPeriodStart: new Date((subscription?.current_period_start as number) * 1000).toISOString(),
            stripeCurrentPeriodEnd: new Date((subscription?.current_period_end as number) * 1000).toISOString(),
        });
    }

    return new NextResponse(null, { status: 200 });
}
