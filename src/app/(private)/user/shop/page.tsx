import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function UserShopPage() {
  const user = await currentUser();

  return (
    <div className="bg-bambu-beige min-h-screen p-5">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-bambu-brown mb-4">
            🍔 Cardápio Bambu Burger
          </h1>
          <div className="flex justify-between items-center">
            <p className="text-bambu-green-dark">
              Bem-vindo ao melhor hambúrguer da cidade!
            </p>
            <UserButton />
          </div>
        </div>

        <div className="bg-bambu-brown rounded-lg p-6 text-bambu-beige">
          <h2 className="text-lg font-semibold mb-3 text-bambu-terracota">
            Informações do Usuário
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">ID:</span> {user?.id}
            </div>
            <div>
              <span className="font-medium">Email:</span> {user?.emailAddresses[0]?.emailAddress}
            </div>
            <div>
              <span className="font-medium">Nome:</span> {user?.fullName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
