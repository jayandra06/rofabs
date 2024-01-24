export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get("input");

  // Fetch the place details
  const placeRes = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`,
  );
  const placeData = await placeRes.json();

  // Get the coordinates
  const coordinates = placeData.result.geometry.location;

  return Response.json({ data: placeData, coordinates });
}
