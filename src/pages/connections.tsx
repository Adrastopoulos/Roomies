import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import type { BuiltInProviderType } from "next-auth/providers";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa";
import { ConnectionList } from "../components/connections/ConnectionList";
import MainLayout, { DashboardCard } from "../components/MainLayout";
import { prisma } from "../server/db/client";
import { authOptions } from "./api/auth/[...nextauth]";

const connections: Record<
	string,
	{ icon: React.ReactNode; provider: BuiltInProviderType }
> = {
	Discord: { icon: <FaDiscord className="h-10 w-10" />, provider: "discord" },
};

const Connections: NextPage = () => {
	return (
		<MainLayout>
			<div className="w-full text-3xl font-bold">Connections</div>
			<div className="w-full">
				<DashboardCard>
					<div>
						<h3 className="font-bold">Add accounts to your profile</h3>
						<span className="text-sm font-thin">
							This information will not be shared outside of Roomies whatsoever,
							and is used in accordance with the{" "}
							<Link href="/privacy" className="link">
								Privacy Policy
							</Link>
							.
						</span>
					</div>
					<div className="flex flex-wrap gap-2">
						{Object.entries(connections).map(([connection, data]) => (
							<button
								key={connection}
								className="tooltip rounded-lg bg-slate-700 p-2"
								data-tip={connection}
								onClick={() => signIn(data.provider)}
							>
								{data.icon}
							</button>
						))}
					</div>
				</DashboardCard>
			</div>
			<ConnectionList />
		</MainLayout>
	);
};

export default Connections;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await unstable_getServerSession(
		context.req,
		context.res,
		authOptions
	);

	const profile = await prisma.profile.findUnique({
		where: { userId: session?.user.id },
	});

	if (!profile) {
		return {
			redirect: {
				destination: "/setup/1",
				permanent: true,
			},
		};
	}

	return { props: {} };
};