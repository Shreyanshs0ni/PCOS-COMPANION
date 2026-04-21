import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center flex-1 h-full p-4 mt-8">
      <SignIn />
    </div>
  );
}
