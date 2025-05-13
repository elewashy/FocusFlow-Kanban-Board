import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
