"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { SignIn, SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function HomePage() {
  const [openSignInForm, setOpenSignInForm] = useState(false);
  const searchParams = useSearchParams();
  const formType = searchParams.get("formType");

  const menuItems = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Sobre",
      path: "/about",
    },
    {
      name: "Contato",
      path: "/contact",
    },
  ];

  return (
    <div className="bg-bambu-beige min-h-screen">
      <div className="flex justify-between items-center bg-bambu-brown lg:px-20 px-5 py-3 w-full">
        <h1 className="font-bold text-2xl text-bambu-beige">
          <b>Bambu Burguer</b>
        </h1>

        <div className="flex gap-5 items-center">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="text-sm text-bambu-beige font-bold hover:text-bambu-green cursor-pointer transition-colors duration-200"
            >
              {item.name}
            </div>
          ))}

          <Button
            onClick={() => setOpenSignInForm(true)}
            className="bg-bambu-green hover:bg-bambu-green-dark text-bambu-brown"
          >
            Entrar
          </Button>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5 min-h-[80vh] items-center lg:px-20 px-5 py-16">
        <div className="col-span-1">
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold text-bambu-brown">
              HAMBÚRGUERES <b className="text-bambu-terracota">TRADICIONAIS</b>
            </h1>
            <p className="text-bambu-green-dark text-sm font-semibold mt-4 leading-relaxed">
              A Bambu Burgues nasceu com uma missão simples: resgatar o sabor
              dos hambúrgueres tradicionais feitos com ingredientes de qualidade
              e preparo artesanal. Aqui, cada sanduíche é feito na hora, com pão
              macio, carne suculenta e aquele toque caseiro que faz toda a
              diferença.
            </p>
          </div>
        </div>
        <div className="col-span-1 flex justify-center lg:justify-end">
          <img src="/logo.jpeg" className="w-auto h-80 object-contain" />
        </div>
      </div>

      <Sheet open={openSignInForm} onOpenChange={setOpenSignInForm}>
        <SheetContent className="min-w-[500px] flex justify-center items-center bg-bambu-beige">
          <SheetHeader>
            <SheetTitle></SheetTitle>
          </SheetHeader>

          <div>
            {formType === "signup" ? (
              <SignUp 
                routing="hash" 
                signInUrl="/?formType=signin"
              />
            ) : (
              <SignIn 
                routing="hash" 
                signUpUrl="/?formType=signup"
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
