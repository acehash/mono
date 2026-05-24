import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

interface ShortcutBody {
  amount: number;
  category_id: string;
  date?: string;
  note?: string;
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: ShortcutBody = await request.json();

  if (!body.amount || body.amount <= 0) {
    return NextResponse.json(
      { error: "Amount must be positive" },
      { status: 400 }
    );
  }

  if (!body.category_id) {
    return NextResponse.json(
      { error: "Category is required" },
      { status: 400 }
    );
  }

  // 验证分类存在
  const { data: category } = await supabase
    .from("categories")
    .select("id, type")
    .eq("id", body.category_id)
    .or(`user_id.is.null,user_id.eq.${user.id}`)
    .single();

  if (!category) {
    return NextResponse.json(
      { error: "Category not found" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      type: category.type,
      amount: body.amount,
      category_id: body.category_id,
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
