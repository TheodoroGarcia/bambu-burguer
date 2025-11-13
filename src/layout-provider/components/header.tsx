import { IUser } from "@/interfaces";
import { Menu } from "lucide-react";
import { useState } from "react";
import MenuItems from "./menu-items";
import { Button } from "@/components/ui/button";

export default function Header({ user }: { user: IUser }) {
  const [openMenuItems, setOpenMenuItems] = useState(false);
  return (
    <div className="bg-bambu-brown p-5 flex justify-between items-center shadow-lg border-b-4 border-bambu-terracota">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-bambu-beige p-2 shadow-md">
          <img
            src="/logo.jpeg"
            alt="Bambu Burger Logo"
            className="w-8 h-8 object-contain"
          />
        </div>
        <div>
          <h2 className="text-bambu-beige font-bold text-lg">Bambu Burger</h2>
          <p className="text-bambu-beige/80 text-xs">Grilled to Perfection</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <h1 className="text-sm font-medium text-bambu-beige">Olá, {user.name}!</h1>
          <p className="text-xs text-bambu-beige/70">Bem-vindo de volta</p>
        </div>
        <Button 
          onClick={() => setOpenMenuItems(true)}
          className="bg-bambu-green hover:bg-bambu-green-dark text-bambu-brown hover:text-white transition-colors duration-200 cursor-pointer shadow-md"
        >
          <Menu size={16} />
        </Button>
      </div>

      {openMenuItems && (
        <MenuItems
          openMenuItems={openMenuItems}
          setOpenMenuItems={setOpenMenuItems}
        />
      )}
    </div>
  );
}
