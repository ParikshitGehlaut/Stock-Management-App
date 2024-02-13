import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  let { action, slug, initialQuantity } = await request.json();
  //   console.log(body);
  const uri =
    "mongodb+srv://Parikshit:wAngJi2pDnJEbdBc@stock-management.hd0wdri.mongodb.net/";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("stock-management");
    const inventory = database.collection("inventory");
    const filter = { slug: slug };
    let newQuantity =
      action == "plus"
        ? parseInt(initialQuantity) + 1
        : parseInt(initialQuantity) - 1;
    const updateDoc = {
      $set: {
        quantity: newQuantity,
      },
    };
    const result = await inventory.updateOne(filter, updateDoc, {});
    return NextResponse.json({
      success: true,
      message: `${result.matchedCount} `,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { error: "Failed to add product", ok: false },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
