import { Dispatch, SetStateAction, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Hamburger,
  LayoutDashboard,
  List,
  LogOut,
  Map,
  ShoppingCart,
  SquareMenu,
  User2,
  UserPen,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePathname, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";

export interface MenuItensProps {
  openMenuItems: boolean;
  setOpenMenuItems: Dispatch<SetStateAction<boolean>>;
}

export default function MenuItems({
  openMenuItems,
  setOpenMenuItems,
}: MenuItensProps) {
  const [selectedRole, setSelectedRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const iconsSize = 14;

  const { signOut } = useAuth();

  const onSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      toast.success("Você saiu com sucesso!");
      router.push("/");
    } catch (error) {
      toast.error("Erro ao sair. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const userMenuItems = [
    {
      name: "Cardápio",
      route: "/user/shop",
      icon: <Hamburger size={iconsSize} />,
    },
    {
      name: "Carrinho",
      route: "/user/cart",
      icon: <ShoppingCart size={iconsSize} />,
    },
    {
      name: "Pedidos",
      route: "/user/orders",
      icon: <List size={iconsSize} />,
    },
    {
      name: "Endereço",
      route: "/user/address",
      icon: <Map size={iconsSize} />,
    },
    {
      name: "Perfil",
      route: "/user/profile",
      icon: <User2 size={iconsSize} />,
    },
  ];

  const sellerMenuItems = [
    {
      name: "Produtos",
      route: "/seller/products",
      icon: <Hamburger size={iconsSize} />,
    },
    {
      name: "Pedidos",
      route: "/seller/orders",
      icon: <List size={iconsSize} />,
    },
  ];

  const adminMenuItems = [
    {
      name: "Dashboard",
      route: "/admin/dashboard",
      icon: <LayoutDashboard size={iconsSize} />,
    },
    {
      name: "Pedidos",
      route: "/admin/orders",
      icon: <List size={iconsSize} />,
    },
    {
      name: "Usuários",
      route: "/admin/users",
      icon: <User2 size={iconsSize} />,
    },
    {
      name: "Vendedores",
      route: "/admin/sellers",
      icon: <UserPen size={iconsSize} />,
    },
  ];

  const userRoles = [
    {
      name: "Usuário",
      value: "user",
    },
    {
      name: "Vendedor",
      value: "seller",
    },
    {
      name: "Administrador",
      value: "admin",
    },
  ];

  let menuItemsToRender = useMemo(() => {
    if (selectedRole === "user") {
      return userMenuItems;
    } else if (selectedRole === "seller") {
      return sellerMenuItems;
    } else if (selectedRole === "admin") {
      return adminMenuItems;
    }
    return [];
  }, [selectedRole]);

  return (
    <Sheet open={openMenuItems} onOpenChange={() => setOpenMenuItems(false)}>
      <SheetContent className="bg-bambu-beige border-l-4 border-bambu-brown">
        <SheetHeader className="border-b border-bambu-brown pb-4 mb-6">
          <SheetTitle className="text-bambu-brown text-xl font-bold flex items-center gap-2">
            🍔 <span>Menu Bambu Burger</span>
          </SheetTitle>
        </SheetHeader>

        <div className="bg-white rounded-lg p-4 mb-6 border border-bambu-brown/20">
          <h3 className="text-sm font-semibold text-bambu-brown mb-3 flex items-center gap-2">
            <span>Selecione um Menu</span>
          </h3>
          <RadioGroup
            defaultValue={selectedRole}
            className="flex flex-col gap-3"
            onValueChange={(value) => setSelectedRole(value as string)}
          >
            {userRoles.map((role, index) => (
              <div
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-sm ${
                  selectedRole === role.value
                    ? "bg-bambu-green text-white border-bambu-green-dark shadow-md"
                    : "bg-bambu-beige border-bambu-brown/30 hover:border-bambu-green"
                }`}
                key={index}
                onClick={() => setSelectedRole(role.value)}
              >
                <RadioGroupItem
                  value={role.value}
                  id={role.value}
                  className={`${
                    selectedRole === role.value
                      ? "border-white data-[state=checked]:bg-white data-[state=checked]:text-bambu-green"
                      : "border-bambu-brown data-[state=checked]:bg-bambu-green data-[state=checked]:border-bambu-green"
                  }`}
                />
                <Label
                  htmlFor={role.value}
                  className={`font-medium cursor-pointer ${
                    selectedRole === role.value
                      ? "text-white"
                      : "text-bambu-brown"
                  }`}
                >
                  {role.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-bambu-brown mb-2 flex items-center gap-2">
            <SquareMenu /> <span>Navegação</span>
          </h3>
          {menuItemsToRender.map((item, index) => (
            <div
              className={`flex gap-4 p-4 rounded-lg cursor-pointer items-center transition-all duration-200 hover:shadow-md
                ${
                  pathname === item.route
                    ? "bg-bambu-green text-white shadow-lg border-2 border-bambu-green-dark"
                    : "bg-white text-bambu-brown hover:bg-bambu-green hover:text-white border border-bambu-brown/20"
                }
              `}
              key={index}
              onClick={() => {
                router.push(item.route);
                setOpenMenuItems(false);
              }}
            >
              <div
                className={`p-2 rounded-full ${
                  pathname === item.route ? "bg-white/20" : "bg-bambu-beige"
                }`}
              >
                {item.icon}
              </div>
              <span className="text-sm font-medium">{item.name}</span>
            </div>
          ))}
          
          <div className="border-t border-bambu-brown/20 my-2"></div>
          
          <div
            className="flex gap-4 p-4 rounded-lg cursor-pointer items-center transition-all duration-200 hover:shadow-md bg-red-50 text-red-700 hover:bg-red-600 hover:text-white border border-red-200 hover:border-red-600"
            onClick={onSignOut}
          >
            <div className="p-2 rounded-full bg-red-100">
              <LogOut size={iconsSize} />
            </div>
            <span className="text-sm font-medium">
              {loading ? "Saindo..." : "Sair"}
            </span>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-bambu-brown rounded-lg p-4 text-center">
            <p className="text-bambu-beige text-xs">
              🌱 <span className="font-semibold">Bambu Burger</span>
            </p>
            <p className="text-bambu-beige/80 text-xs">
              Sabor tradicional, qualidade sustentável
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
