import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);

        // Obtener los datos del request
        const {
            origin_address,
            destination_address,
            origin_latitude,
            origin_longitude,
            destination_latitude,
            destination_longitude,
            ride_time,
            departure_time,
            fare_price,
            payment_status,
            user_id,
            created_at,
        } = await request.json();

        // Validar que todos los campos requeridos están presentes
        if (
            !origin_address ||
            !destination_address ||
            !origin_latitude ||
            !origin_longitude ||
            !destination_latitude ||
            !destination_longitude ||
            !ride_time ||
            !departure_time ||
            !fare_price ||
            !payment_status ||
            !user_id ||
            !created_at
        ) {
            console.log("faltaron datos en ride");
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400 },
            );
        }

        // Ejecutar la función insert_ride de PostgreSQL para insertar el ride
        const response = await sql`
            SELECT insert_ride(
                           ${origin_address},
                           ${destination_address},
                           ${origin_latitude},
                           ${origin_longitude},
                           ${destination_latitude},
                           ${destination_longitude},
                           ${ride_time},
                           ${departure_time},
                           ${fare_price},
                           ${payment_status},
                           ${user_id},
                           ${created_at}
                   )
        `;

        // Responder con el resultado
        return new Response(JSON.stringify({ data: response }), { status: 201 });
    } catch (error) {
        console.log(error);
        return Response.json({ error: error }, { status: 500 });
    }
}