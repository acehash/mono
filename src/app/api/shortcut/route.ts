import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

interface ShortcutBody {
  amount: number;
  category: string;
  type: "income" | "expense";
  date?: string;
  note?: string;
}

export async function POST(request: NextRequest) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Missing x-user-id header" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const body: ShortcutBody = await request.json();

  if (!body.amount || body.amount <= 0) {
    return NextResponse.json(
      { error: "Amount must be positive" },
      { status: 400 }
    );
  }

  if (!body.category) {
    return NextResponse.json(
      { error: "Category is required" },
      { status: 400 }
    );
  }

  if (!body.type || !["income", "expense"].includes(body.type)) {
    return NextResponse.json(
      { error: "Type must be income or expense" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: userId,
      type: body.type,
      amount: body.amount,
      category: body.category,
      note: body.note || null,
      date: body.date || new Date().toISOString().split("T")[0],
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    id: data.id,
  });
}
