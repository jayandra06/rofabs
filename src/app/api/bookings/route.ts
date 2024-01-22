import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

type filter = {
  propertyId?: ObjectId;
  roomId?: ObjectId;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("property-id");
  const roomId = searchParams.get("room-id");

  const filter: filter = {};
  if (propertyId) {
    filter.propertyId = new ObjectId(propertyId);
  }
  if (roomId) {
    filter.roomId = new ObjectId(roomId);
  }
  if (!filter.propertyId || !filter.roomId) {
    return Response.json({
      success: false,
      message: "Please provide property id or room id",
    });
  }
  try {
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
    const room = await db.collection("rooms").findOne({ _id: filter.roomId });
    if (!room) {
      return Response.json({
        success: false,
        message: "Room not found",
      });
    }
    return Response.json({ property, room });
  } catch (error) {
    const err = error as Error & { message: string };
    return Response.json({
      success: false,
      message: err.message,
    });
  }
}
