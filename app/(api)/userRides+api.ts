import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { userEmail, rideId } = await request.json();

    if (!userEmail || !rideId) {
      return Response.json(
        {
          error: "Missing required fields",
        },
        { status: 400 },
      );
    }

    const response = await sql`
            INSERT INTO user_rides (user_email, ride_id)
            VALUES (${userEmail}, ${rideId})`;

    return new Response(JSON.stringify({ data: response }), { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: error }, { status: 500 });
  }
}
