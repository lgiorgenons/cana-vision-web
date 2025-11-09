import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const heroImage = "/images/img_login.png";
const brandLogo = "/images/icon_atmos_agro.svg";

const socialProviders = [
  { label: "Facebook", icon: "/images/ic_facebook.svg" },
  { label: "Apple", icon: "/images/ic_apple.svg" },
  { label: "Google", icon: "/images/ic_google.svg" },
];

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid min-h-screen bg-white lg:h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src={heroImage}
          alt="Campos agrícolas monitorados por satélite"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />

        <div className="absolute left-3 top-3 flex items-center gap-0 text-white">
          <img src={brandLogo} alt="AtmosAgro" className="h-20 w-20" />
          <span className="text-[20px] font-normal">AtmosAgro</span>
        </div>

        <div className="absolute bottom-12 left-8 right-10 text-white">
          <h2 className="max-w-xl text-5xl font-semibold leading-[50px]">
            Monitore a saúde da sua cana direto do espaço
          </h2>
          <p className="mt-6 max-w-xl text-base font-normal text-white/85 leading-[20px]">
            Imagens de satélite, índices de estresse e alertas inteligentes — tudo para manter seu
            canavial produtivo, do plantio à colheita.
          </p>
        </div>
      </div>

      <div className="flex flex-col bg-white">
        <div className="flex justify-end px-6 pt-6 sm:px-10">
          <Button
            asChild
            className="rounded-[25px] bg-[#34A853] px-8 py-4 text-base font-normal hover:bg-[#249b4a]"
          >
            <Link to="/registrar">Crie sua conta</Link>
          </Button>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold text-[#181E08]">
                Bem vindo ao Atmos
                <span className="text-[#34A853]">Agro</span>!
              </h1>
              <p className="text-base text-muted-foreground">Entre na sua conta</p>
            </div>

            <form className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium text-[#181E08]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Entre com seu endereço de email"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-medium text-[#181E08]">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Entre com sua senha"
                    className="h-12 pr-12 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-5 flex items-center text-muted-foreground transition hover:text-primary"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-sm text-[#181E08] sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-2 font-medium">
                  <Checkbox id="remember" defaultChecked className="border-muted-foreground" />
                  <span>Lembrar da conta</span>
                </label>
                <Link to="/recuperar" className="font-semibold text-primary hover:underline">
                  Esqueceu a senha ?
                </Link>
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-[10px] bg-[#34A853] text-base font-normal hover:bg-[#249b4a]"
              >
                Entrar
              </Button>
            </form>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Separator className="flex-1 bg-[#CBCAD7]" />
                <span className="font-medium text-[#8E8E93]">Ou entre com</span>
                <Separator className="flex-1 bg-[#CBCAD7]" />
              </div>

              <div className="flex justify-center gap-10">
                {socialProviders.map(({ label, icon }) => (
                  <button
                    key={label}
                    type="button"
                    className="p-0 transition focus-visible:outline-none"
                    aria-label={`Entrar com ${label}`}
                  >
                    <img src={icon} alt={label} className="h-[42px] w-[42px]" draggable={false} />
                  </button>
                ))}
              </div>
            </div>

            <p className="text-center text-sm text-[#181E08]">
              Não tem uma conta?{" "}
              <Link to="/registrar" className="font-semibold text-primary hover:underline">
                Registre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
