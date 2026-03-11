import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/useAuthStore";
import {
  BadgeCheckIcon,
  BellIcon,
  LogOutIcon,
} from "lucide-react";
import { useEffect } from "react";

export function DropdownMenuAvatar() {
  const getProfile = useAuthStore((state) => (state.fetchProfile));
  const logout = useAuthStore((state) => (state.logout));
  const user = useAuthStore((state) => (state.user));

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage
              src="https://avatarngau.sbs/wp-content/uploads/2025/07/avatar-vo-danh-va-sach.jpg"
              alt="avatar"
            />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-gray-300">

        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
               {user?.email || "Guest"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
               {user?.name || "No fullname provided"}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-not-allowed">
            <BadgeCheckIcon />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-not-allowed">
            <BellIcon />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          <LogOutIcon />
          Sign Out
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
