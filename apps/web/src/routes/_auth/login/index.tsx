/** biome-ignore-all lint/a11y/useValidAnchor: <no link> */

import { CaretLeftIcon } from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { generateMetadata } from "@/lib/meta";
import { cn } from "@/lib/utils";
import { LoginForm } from "./_components/login-form";

export const Route = createFileRoute("/_auth/login/")({
	component: RouteComponent,
	head: () => {
		const { meta, links } = generateMetadata({
			title: "Đăng nhập",
			description:
				"Đăng nhập vào TrekToeic để tiếp tục hành trình chinh phục TOEIC của bạn. Truy cập các bài luyện tập, đề thi thử và theo dõi tiến độ học tập.",
			robots: {
				index: false,
				follow: false,
			},
			alternates: {
				canonical: "/login",
			},
		});

		return { meta, links };
	},
});

function RouteComponent() {
	return (
		<div className="relative flex min-h-screen items-center justify-center">
			<Link
				className={cn(
					buttonVariants({
						variant: "ghost",
					}),
					"absolute top-4 left-4",
				)}
				//@ts-expect-error
				to="/"
			>
				<CaretLeftIcon />
				Trang chủ
			</Link>
			<div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<div className="mb-4">
						<h2 className="text-center font-semibold text-foreground text-xl">
							Chào mừng bạn đến với TrekToeic!
						</h2>
						<p className="mt-2 text-center text-muted-foreground text-sm">
							Đăng nhập để tiếp tục đến với hành trình chinh phục TOEIC của bạn.
						</p>
					</div>
					<LoginForm />
					<p className="mt-4 text-center text-muted-foreground text-xs">
						Khi đăng nhập, bạn đồng ý với{" "}
						<a href="#" className="underline underline-offset-4">
							điều khoản dịch vụ
						</a>{" "}
						và{" "}
						<a href="#" className="underline underline-offset-4">
							chính sách bảo mật
						</a>{" "}
						của chúng tôi.
					</p>
				</div>
			</div>
		</div>
	);
}
