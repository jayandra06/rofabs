import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

export async function POST(request: Request) {
  try {
    const text = await request.text();
    // Process the webhook payload
    // validateWebhookSignature(
    //   JSON.stringify(text),
    //   request.headers.get("X-Razorpay-Signature") as string,
    //   "65a9812b54bcff1b869b0321",
    // );
  } catch (error) {
    const err = error as Error & { message: string };
    return new Response(`Webhook error: ${err.message}`, {
      status: 400,
    });
  }

  return new Response("Success! webhook working", {
    status: 200,
  });
}
