import { Property } from "@/app/search/types";
import { connectToDatabase } from "@/lib/mongodb";

type filter = {
  propertyType?: string;
  roomType?: string;
  roomCategory?: string;
};

type propertyFilter = {
  type?: string;
};

type responseBody = {
  success?: boolean;
  message?: string;
  data?: [];
};

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyType = searchParams.get("property-type");
  const roomType = searchParams.get("room-type");
  const roomCategory = searchParams.get("room-category");
  const roomsFilter: filter = {};
  const propertyFilter: propertyFilter = {};
  if (propertyType) {
    roomsFilter.propertyType = propertyType
      ?.replace("-", "/")
      .replace("+", " ");
    propertyFilter.type = propertyType?.replace("-", "/").replace("+", " ");
  }
  if (roomType) {
    roomsFilter.roomType = roomType?.replace("-", "/").replace("+", " ");
  }
  if (roomCategory) {
    roomsFilter.roomCategory = roomCategory
      ?.replace("-", "/")
      .replace("+", " ");
  }
  const { db } = await connectToDatabase();
  const properties = await db
    .collection("properties")
    .find(propertyFilter)
    .toArray();

  console.log(properties, "properties");
  if (!properties) {
    return Response.json({
      success: false,
      message: "Properties not found",
    });
  }
  return Response.json({
    success: true,
    message: "Properties found",
    data: properties,
  });
}
