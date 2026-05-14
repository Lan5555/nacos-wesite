import AuthHero from "@/components/auth/AuthHero";
import LoginForm from "@/components/auth/LoginForm";
export default function LoginPage() {
  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block">
        <AuthHero />
      </div>
      <div className="bg-white flex items-centre justify-center px-6 py-10">
        <LoginForm />
      </div>
    </main>
  );
}