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

function getDistanceInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyType = searchParams.get("property-type");
  const roomType = searchParams.get("room-type");
  const roomCategory = searchParams.get("room-category");
  const placeId = searchParams.get("place-id");
  console.log(placeId, "placeId");

  const roomsFilter: filter = {};
  const propertyFilter: propertyFilter = {};
  if (propertyType) {
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
  let coordinates = null;

  try {
    const placeRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`,
    );
    const placeData = await placeRes.json();
    console.log(placeData, "placeData");
    coordinates = placeData.result.geometry.location;
  } catch (error) {
    console.log(error, "error");
  }

  const { db } = await connectToDatabase();

  const properties = await db
    .collection("properties")
    .find({
      ...propertyFilter,
    })
    .toArray();

  let nearProperties = [];
  if (coordinates && properties && properties.length > 0) {
    for (const property of properties) {
      const distance = getDistanceInKm(
        coordinates.lat,
        coordinates.lng,
        property.coOfLocation.coordinates[0],
        property.coOfLocation.coordinates[1],
      );
      if (distance <= 100) {
        nearProperties.push(property);
      }
    }
  } else {
    nearProperties = properties;
  }
  console.log(nearProperties, "nearProperties");

  const propertiesWithFilter = [];
  if (roomsFilter.roomType || roomsFilter.roomCategory) {
    for (const nearProperty of nearProperties) {
      const getRoom = await db
        .collection("rooms")
        .findOne({ propertyId: nearProperty._id, ...roomsFilter });
      if (getRoom) {
        propertiesWithFilter.push(nearProperty);
      }
    }
  } else {
    propertiesWithFilter.push(...nearProperties);
  }

  console.log(propertiesWithFilter, "properties");
  if (!properties) {
    return Response.json({
      success: false,
      message: "Properties not found",
    });
  }
  return Response.json({
    success: true,
    message: propertiesWithFilter.length
      ? "Properties found"
      : "No properties found",
    data: propertiesWithFilter,
  });
}
