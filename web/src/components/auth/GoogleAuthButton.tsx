"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createSupabaseClient } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type GoogleAuthButtonProps = {
    label?: string;
    className?: string; // Allow overriding classes if needed
};

export default function GoogleAuthButton({ label = "Google", className }: GoogleAuthButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            const supabase = createSupabaseClient();

            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                throw error;
            }
            // Redirect happens automatically
        } catch (error) {
            console.error("Erro no login Google:", error);
            setIsLoading(false);
            toast({
                variant: "destructive",
                title: "Erro ao iniciar sessão",
                description: "Não foi possível conectar com o Google. Tente novamente.",
            });
        }
    };

    return (
        <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className={`p-0 transition focus-visible:outline-none relative ${className || ""}`}
            aria-label={`Entrar com ${label}`}
            title={`Entrar com ${label}`}
        >
            {isLoading ? (
                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-slate-100">
                    <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
                </div>
            ) : (
                <img
                    src="/images/ic_google.svg"
                    alt={label}
                    className="h-[42px] w-[42px]"
                    draggable={false}
                />
            )}
        </button>
    );
}
