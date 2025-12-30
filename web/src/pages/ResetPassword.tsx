import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { resetPassword } from "@/services/password";
import { ApiError } from "@/lib/api-client";
import AuthLayout from "./auth/AuthLayout";
import PasswordField from "@/components/auth/PasswordField";

const iconForm = "/images/ic_reset_password.svg";
const iconSuccess = "/images/ic_reset_sucess.svg";
const iconError = "/images/ic_reset_fail.svg";
const arrowIcon = "/images/ic_arrow.svg";

const resetSchema = z
  .object({
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
    confirmPassword: z.string().min(8, "Confirme a senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas precisam coincidir.",
  });

type ResetFormValues = z.infer<typeof resetSchema>;
type ViewMode = "form" | "success" | "error";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const accessToken = useMemo(() => {
    const hash = typeof window !== "undefined" ? window.location.hash.replace(/^#/, "") : "";
    const hashParams = new URLSearchParams(hash);
    return (
      searchParams.get("access_token") ||
      searchParams.get("token") ||
      hashParams.get("access_token") ||
      hashParams.get("token") ||
      ""
    );
  }, [searchParams]);

  const [viewMode, setViewMode] = useState<ViewMode>(accessToken ? "form" : "error");
  const [errorMessage, setErrorMessage] = useState(
    "Solicite um novo e-mail de recuperação na tela 'Esqueci minha senha'.",
  );

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: ResetFormValues) => resetPassword({ accessToken, password: values.password }),
    onSuccess: () => {
      setViewMode("success");
      toast({ title: "Senha atualizada", description: "Faça login com a nova senha." });
    },
    onError: (error: unknown) => {
      let description = "Não foi possível redefinir a senha. Solicite um novo link.";
      if (error instanceof ApiError) {
        description = error.message;
      }
      setErrorMessage(description);
      setViewMode("error");
      toast({ variant: "destructive", title: "Erro na redefinição", description });
    },
  });

  const onSubmit = (values: ResetFormValues) => {
    if (!accessToken) {
      setViewMode("error");
      setErrorMessage("Link inválido ou expirado. Solicite um novo e-mail de recuperação.");
      return;
    }
    mutation.mutate(values);
  };

  return (
    <AuthLayout
      heroTitle="Monitore a saúde da sua cana direto do espaço"
      heroDescription={
        <>
          Imagens de satélite, índices de estresse e alertas inteligentes — tudo para manter seu canavial produtivo, do
          plantio à colheita.
        </>
      }
      heroImageAlt="Campos agrícolas monitorados por satélite"
      topAction={
        <Button asChild className="rounded-[25px] bg-auth-brand px-8 py-4 text-base font-normal hover:bg-auth-brand-hover">
          <Link to="/login">Voltar ao login</Link>
        </Button>
      }
    >
      <div className="w-full max-w-md space-y-8 text-center">
        {viewMode === "form" && (
          <>
            <div className="flex justify-center">
              <img src={iconForm} alt="Definir nova senha" className="h-40 w-40" />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-auth-ink">Definir nova senha</h1>
              <p className="text-base text-muted-foreground">
                Escolha uma nova senha segura para voltar a acessar a plataforma.
              </p>
            </div>
            <Form {...form}>
              <form className="space-y-5 text-left" onSubmit={form.handleSubmit(onSubmit)}>
                <PasswordField
                  control={form.control}
                  name="password"
                  label="Nova senha"
                  placeholder="Digite a nova senha"
                  autoComplete="new-password"
                  toggleClassName="absolute inset-y-0 right-4 flex items-center text-slate-400 transition hover:text-slate-600"
                />
                <PasswordField
                  control={form.control}
                  name="confirmPassword"
                  label="Confirmar senha"
                  placeholder="Repita a nova senha"
                  autoComplete="new-password"
                  toggleClassName="absolute inset-y-0 right-4 flex items-center text-slate-400 transition hover:text-slate-600"
                />
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="h-12 w-full rounded-[10px] bg-auth-brand text-base font-normal hover:bg-auth-brand-hover"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                    </>
                  ) : (
                    "Redefinir senha"
                  )}
                </Button>
              </form>
            </Form>
          </>
        )}

        {viewMode === "success" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img src={iconSuccess} alt="Senha redefinida" className="h-40 w-40" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-auth-ink">Sua senha foi redefinida</h1>
              <p className="text-base text-muted-foreground">Você já pode acessar a plataforma com a nova senha.</p>
            </div>
            <Button
              className="h-12 w-full rounded-[10px] bg-auth-brand text-base font-normal hover:bg-auth-brand-hover"
              onClick={() => navigate("/login")}
            >
              Ir para o login
            </Button>
          </div>
        )}

        {viewMode === "error" && (
          <div className="space-y-5">
            <div className="flex justify-center">
              <img src={iconError} alt="Link inválido" className="h-40 w-40" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-auth-ink">Link inválido ou expirado.</h1>
              <p className="text-base text-muted-foreground">{errorMessage}</p>
            </div>
            <Button
              className="h-12 w-full rounded-[10px] bg-auth-brand text-base font-normal hover:bg-auth-brand-hover"
              onClick={() => navigate("/recuperar")}
            >
              Esqueci minha senha
            </Button>
          </div>
        )}

        <div className="text-left">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-auth-ink hover:text-primary"
          >
            <img src={arrowIcon} alt="Voltar" className="h-6 w-6" />
            Voltar para o login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
