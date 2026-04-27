import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { checkOnboardingComplete } from "@/app/actions/profile";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-up");
  }

  const { onboarded } = await checkOnboardingComplete();

  if (!onboarded) {
    redirect("/onboarding");
  }

  redirect("/today");
}
