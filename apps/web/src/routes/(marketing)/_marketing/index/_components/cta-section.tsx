import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const CtaSection = () => {
	return (
		<section className="px-6 py-20">
			<div className="relative mx-auto max-w-5xl overflow-hidden rounded-md bg-slate-900 p-12 text-center md:p-20">
				<div className="-translate-x-1/2 absolute top-0 left-1/2 h-[300px] w-[600px] rounded-full bg-blue-600/20 blur-[100px]" />
				<div className="relative z-10">
					<h2 className="mb-6 font-semibold text-3xl text-white tracking-tight md:text-5xl">
						Bắt đầu hành trình chinh phục TOEIC ngay hôm nay!
					</h2>
					<p className="mx-auto mb-10 max-w-xl text-lg text-slate-400">
						Đăng ký ngay để trải nghiệm phương pháp học tập hiệu quả và nâng cao
						kỹ năng TOEIC của bạn với TrekToeic.
					</p>
					<form className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
						<Input
							className="dark h-11 w-full flex-1"
							placeholder="Nhập email của bạn"
						/>
						<Button variant="outline" size="lg" type="button">
							Bắt đầu ngay
						</Button>
					</form>
					<p className="mt-4 text-slate-500 text-xs">
						Không cần thẻ tín dụng. Hủy bất kỳ lúc nào.
					</p>
				</div>
			</div>
		</section>
	);
};
