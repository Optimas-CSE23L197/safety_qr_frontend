import { useState } from "react";
import { Eye, EyeOff, Shield } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import authSchema from "../../validation/auth.schema";
import FormInput from "../../components/form/FormInput";
import { useAdminLogin } from "../../hooks/useAdminLogin";

export default function AdminLoginPage() {
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);

    const from = location.state?.from?.pathname || "/dashboard";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(authSchema) });

    const { login, loading, apiError } = useAdminLogin(from);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
            <div className="w-full max-w-md">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8">

                    {/* Header */}
                    <div className="text-center space-y-3 mb-6">
                        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <Shield className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-semibold text-white">Admin Login</h1>
                        <p className="text-slate-400 text-sm">
                            Secure access for authorized administrators only
                        </p>
                    </div>

                    {/* Form */}
                    <form autoComplete="on" onSubmit={handleSubmit(login)} className="space-y-5">
                        <FormInput
                            label="Email"
                            type="email"
                            autoComplete="email"
                            error={errors.email?.message}
                            {...register("email")}
                        />

                        <FormInput
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            error={errors.password?.message}
                            {...register("password")}
                            rightElement={
                                <button
                                    type="button"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            }
                        />

                        {apiError && (
                            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                                {apiError}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-opacity"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
}