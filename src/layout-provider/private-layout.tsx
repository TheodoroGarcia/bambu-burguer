import { useEffect, useState } from "react";
import Header from "./components/header";
import { toast } from "react-hot-toast/headless";
import { getCurrentUserFromSupabase } from "@/actions/users";
import Spinner from "@/components/ui/spinner";
import usersGlobalStore, {
  IUsersGlobalStore,
} from "@/global-store/users-store";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser } = usersGlobalStore() as IUsersGlobalStore;
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await getCurrentUserFromSupabase();
      if (!response.success) {
        toast.error("Failed to fetch user data");
      } else {
        setUser(response.data);
      }
    } catch (error) {
      toast.error("An error occurred while fetching user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <Header user={user!} />
      {children}
    </div>
  );
}
