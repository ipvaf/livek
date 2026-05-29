"use server"

import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function approveSubmission(id: string) {
  const { data: sub, error } = await supabaseAdmin
    .from("creator_submissions")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !sub) return { error: "Submission not found" }

  await supabaseAdmin
    .from("creator_submissions")
    .update({ status: "approved" })
    .eq("id", id)

  await supabaseAdmin.from("creators").upsert({
    handle: sub.handle,
    display_name: sub.handle.replace("@", ""),
    platform: sub.platform,
    category: sub.category,
    country: sub.country,
    country_name: sub.country,
    flag: "🌍",
    followers: sub.followers ?? 0,
    is_verified: false,
    is_live: false,
    status: "approved",
    user_id: sub.user_id ?? null,
  }, { onConflict: "handle" })

  revalidatePath("/admin")
  revalidatePath("/creators")
  return { ok: true }
}

export async function rejectSubmission(id: string) {
  await supabaseAdmin
    .from("creator_submissions")
    .update({ status: "rejected" })
    .eq("id", id)

  revalidatePath("/admin")
  return { ok: true }
}

export async function deleteSubmission(id: string) {
  await supabaseAdmin
    .from("creator_submissions")
    .delete()
    .eq("id", id)

  revalidatePath("/admin")
  return { ok: true }
}

export async function toggleCreatorLive(id: string, isLive: boolean) {
  await supabaseAdmin
    .from("creators")
    .update({ is_live: !isLive })
    .eq("id", id)

  revalidatePath("/admin")
  revalidatePath("/creators")
  return { ok: true }
}

export async function deleteCreator(id: string) {
  await supabaseAdmin
    .from("creators")
    .delete()
    .eq("id", id)

  revalidatePath("/admin")
  revalidatePath("/creators")
  return { ok: true }
}
