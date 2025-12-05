import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { User } from "lucide-react";
import UserDropdownMenu from "@/components/layout/UserDropDFownMenu";

const ProfileTabContent: React.FC = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<User className="h-5 w-5" />
					Profile Settings
				</CardTitle>
				<CardDescription>
					Update your profile information and preferences
				</CardDescription>
			</CardHeader>
			<CardContent>
				<UserDropdownMenu />
			</CardContent>
		</Card>
	);
};

export default ProfileTabContent;
