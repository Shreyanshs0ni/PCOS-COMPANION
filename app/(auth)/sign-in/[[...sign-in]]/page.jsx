import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-6" style={{ background: "linear-gradient(180deg, var(--primary-50) 0%, var(--bg) 60%)" }}>
      {/* Brand Header */}
      <div className="text-center mb-8 animate-slide-down">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl" style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", boxShadow: "0 8px 24px rgba(139, 126, 200, 0.3)" }}>
          🌸
        </div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          Welcome Back
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Continue your wellness journey
        </p>
      </div>

      {/* Clerk Sign In */}
      <div className="w-full animate-slide-up">
        <SignIn
          afterSignInUrl="/"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}
