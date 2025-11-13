"use client";

import usersGlobalStore, {
  IUsersGlobalStore,
} from "@/global-store/users-store";

export default function UserCartPage() {
  const { user } = usersGlobalStore() as IUsersGlobalStore;
  return (
    <div className="p-5 flex flex-col gap-5">
      <h1>Carrinho</h1>
      <p>Bem-vindo {user.name}</p>
    </div>
  );
}
