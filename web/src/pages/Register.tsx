import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const heroImage = "/images/img_login.png";
const brandLogo = "/images/icon_atmos_agro.svg";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="grid min-h-screen bg-white lg:h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src={heroImage}
          alt="Campos agr��colas monitorados por satélite"
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
            <Link to="/login">Entre na sua conta</Link>
          </Button>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold text-[#181E08]">
                Bem vindo ao Atmos
                <span className="text-[#34A853]">Agro</span>!
              </h1>
              <p className="text-base text-muted-foreground">Crie sua conta e explore inúmeros benefícios</p>
            </div>

            <form className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium text-[#181E08]">
                  Nome
                </Label>
                <Input id="name" placeholder="Digite o seu nome completo" className="h-12 text-base" />
              </div>

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
                    placeholder="Escolha uma senha"
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

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-base font-medium text-[#181E08]">
                  Confirmar senha
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme a senha escolhida"
                    className="h-12 pr-12 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-5 flex items-center text-muted-foreground transition hover:text-primary"
                    aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-[#181E08]">
                <Checkbox id="terms" className="mt-1 border-muted-foreground" />
                <label htmlFor="terms" className="leading-relaxed">
                  Eu aceito os{" "}
                  <a href="#" className="font-semibold text-primary hover:underline">
                    termos e condições
                  </a>
                </label>
              </div>

              <Button type="submit" className="h-12 w-full rounded-[10px] bg-[#34A853] text-base font-normal hover:bg-[#249b4a]">
                Criar conta
              </Button>
            </form>

            <p className="text-center text-sm text-[#181E08]">
              Já tem uma conta?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Entre aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
