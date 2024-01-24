export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filterText = searchParams.get("input");
  let res = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${filterText}&&components=country:in&key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`,
  );
  const data = await res.json();
  return Response.json(data.predictions);
}
