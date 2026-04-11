import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const CtaSection = () => {
	return (
		<section className="border-border border-t bg-neutral-50 px-4 py-16 md:py-20">
			<div className="container mx-auto max-w-5xl">
				<div className="relative overflow-hidden rounded-none border border-border bg-foreground px-8 py-14 text-center shadow-none ring-1 ring-foreground/10 md:px-16 md:py-20">
					<div className="pointer-events-none absolute top-0 left-1/2 h-[280px] w-[min(100%,560px)] -translate-x-1/2 bg-blue-600/25 opacity-80 blur-3xl" />
					<div className="relative z-10">
						<h2 className="mb-4 font-heading font-semibold text-2xl text-primary-foreground tracking-tight md:mb-5 md:text-4xl">
							Bắt đầu hành trình TOEIC hôm nay
						</h2>
						<p className="mx-auto mb-8 max-w-lg text-primary-foreground/80 text-sm leading-relaxed md:mb-10 md:text-base">
							Đăng nhập hoặc tạo tài khoản để vào cùng giao diện luyện tập, thi
							thử và từ vựng như trong app.
						</p>
						<div className="mx-auto flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:items-stretch">
							<Input
								type="email"
								className="h-11 min-h-11 flex-1 rounded-none border-primary-foreground/25 bg-background/15 px-4 text-primary-foreground text-sm placeholder:text-primary-foreground/50 focus-visible:border-primary-foreground/40"
								placeholder="Nhập email của bạn"
							/>
							<Button
								variant="secondary"
								className="h-11 min-h-11 shrink-0 rounded-none px-6 font-semibold text-sm sm:min-w-[11rem]"
								asChild
							>
								<Link to="/login">Bắt đầu ngay</Link>
							</Button>
						</div>
						<p className="mt-4 text-primary-foreground/60 text-xs leading-relaxed">
							Không cần thẻ tín dụng. Hủy bất kỳ lúc nào.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};
