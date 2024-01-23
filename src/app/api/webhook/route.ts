import {
  BookingStatusEnum,
  BookingTypeEnum,
  PaymentMethodEnum,
  PaymentStatusEnum,
} from "@/lib/consts";
import { connectToDatabase } from "@/lib/mongodb";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

export async function POST(request: Request) {
  try {
    const text = await request.text();
    const signature = request.headers.get("X-Razorpay-Signature") as string;
    validateWebhookSignature(
      JSON.stringify(text),
      signature,
      "65a9812b54bcff1b869b0321",
    );
    const { db } = await connectToDatabase();

    const payment = JSON.parse(text);
    console.log(payment, "payment");
    console.log(payment.payload.payment.entity, "entity");
    if (
      payment.event === "payment.captured" ||
      payment.event === "payment.authorized"
    ) {
      // await db.collection("payments").insertOne(payment);
      console.log("Payment captured", payment.payload.payment.entity);
      const entity = payment.payload.payment.entity;
      const booking = {
        user: entity.notes.userId,
        propertyId: entity.notes.propertyId,
        bookingType: BookingTypeEnum.ONLINE,
        bookingStatus: BookingStatusEnum.CONFIRMED,
        guestName: entity.notes.guestName,
        guestPhoneNumber: parseInt(entity.notes.guestPhoneNumber),
        guestEmail: entity.notes.guestEmail,
        roomCategory: entity.notes.roomCategory,
        roomType: entity.notes.roomType,
        from: new Date(entity.notes.from),
        to: new Date(entity.notes.to),
        numberOfGuests: parseInt(entity.notes.numberOfGuests),
        paymentMethod: entity.method,
        paymentStatus: PaymentStatusEnum.PAID,
        paymentAmount: entity.amount / 100,
        invoiceId: entity.order_id,
      };
      const res = await db.collection("bookings").insertOne(booking);
      console.log(res, "res");
    }
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

// Process the webhook payload
// validateWebhookSignature(
//   JSON.stringify(text),
//   request.headers.get("X-Razorpay-Signature") as string,
//   "65a9812b54bcff1b869b0321",
// );
