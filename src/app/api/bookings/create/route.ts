import { OrderProps } from "@/app/search/types";
import { UUID } from "mongodb";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  const payload: OrderProps = await request.json();
  console.log(payload, "payload");
  const randomNum = Math.floor(Math.random() * 1000);
  const instance = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string,
  });
  const order = await instance.orders.create({
    amount: payload.amount * 100,
    currency: "INR",
    receipt: "R#" + payload.userId + "#" + randomNum,
    notes: {
      guestName: payload.guestName,
      guestPhoneNumber: payload.guestPhoneNumber,
      guestEmail: payload.guestEmail,
      from: payload.from.toString(),
      to: payload.to.toString(),
      numberOfGuests: payload.numberOfGuests,
      roomType: payload.roomType,
      roomCategory: payload.roomCategory,
      propertyId: payload.propertyId,
      userId: payload.userId,
    },
  });
  console.log(order, "order");
  return Response.json(order);
}
