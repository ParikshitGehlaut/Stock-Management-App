import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const query = request.nextUrl.searchParams.get("query");
  console.log(query);
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);
  try {
    const database = client.db("stock-management");
    const inventory = database.collection("inventory");
    const products = await inventory
      .aggregate([
        {
          $match: {
            $or: [{ slug: { $regex: query, $options: "i" } }],
          },
        },
        // {
        //   $search: {
        //     text: {
        //       query: query,
        //       path: ["slug", "quantity", "price"],
        //     },
        //   },
        // },
        {
          $sort: {
            price: 1,
          },
        },
      ])
      .toArray();
    return NextResponse.json({ success: true, products });
  } finally {
    await client.close();
  }
}
