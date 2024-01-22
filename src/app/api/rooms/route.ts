import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

type filter = {
  propertyId?: ObjectId;
  roomId?: ObjectId;
};

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("property-id");
  // const roomId = searchParams.get("room-id");

  const headersList = headers();
  const ip =
    headersList.get("x-forwarded-for") ||
    headersList.get("cf-connecting-ip") ||
    headersList.get("fastly-client-ip") ||
    headersList.get("x-real-ip") ||
    headersList.get("x-cluster-client-ip") ||
    headersList.get("x-forwarded") ||
    headersList.get("forwarded-for") ||
    headersList.get("forwarded");

  const response = await fetch(`https://ipapi.co/${ip}/json`);
  const data = await response.json();
  console.log(data, "data");
  // console.log(ip, "ip");

  const filter: filter = {};
  if (propertyId) {
    filter.propertyId = new ObjectId(propertyId);
  }
  if (!filter.propertyId && !filter.roomId) {
    return Response.json({
      success: false,
      message: "Please provide property id or room id",
    });
  }

  const { db } = await connectToDatabase();
  const property = await db
    .collection("properties")
    .findOne({ _id: filter.propertyId });
  if (!property) {
    return Response.json({
      success: false,
      message: "Property not found",
    });
  }
  const rooms = await db
    .collection("rooms")
    .find({ propertyId: filter.propertyId })
    .sort({ pricePerDay: 1 })
    .toArray();
  if (!rooms) {
    return Response.json({
      success: false,
      message: "Room not found",
    });
  }

  return Response.json({ property, rooms, location: data });
}
