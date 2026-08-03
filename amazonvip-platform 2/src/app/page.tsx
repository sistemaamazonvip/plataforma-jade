import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSectorByRole } from "@/lib/config/sectors";

export default async function Home() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user!.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  if (profile.role === "admin") {
    redirect("/admin");
  }

  const sector = getSectorByRole(profile.role);
  redirect(sector ? `/${sector.slug}` : "/login");
}
