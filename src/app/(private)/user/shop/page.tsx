import { getCurrentUserFromSupabase } from "@/actions/users";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function UserShopPage() {
  const user = await currentUser();
  console.log("Current User:", user);
  const supabaseUserResponse = await getCurrentUserFromSupabase();

  return (
    <div className="p-5 flex flex-col gap-5">
      <h1>User Shop Page</h1>
      <UserButton />

      <div className="flex flex-col gap-2">
        <h1>Clerk User ID: {user?.id}</h1>
        <h1>Clerk User Email: {user?.emailAddresses[0]?.emailAddress}</h1>
        <h1>User Full Name: {user?.fullName}</h1>
      </div>
    </div>
  );
}
