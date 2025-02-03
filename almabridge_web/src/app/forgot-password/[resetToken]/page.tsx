import { ResetTokenProps } from "@/types";
import ResetPassword from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage({ params }: ResetTokenProps) {
    return <ResetPassword resetToken={params.resetToken} />;
}