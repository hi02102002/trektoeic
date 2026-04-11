import {
	InstagramLogo,
	LinkedinLogo,
	TwitterLogo,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";

export const Footer = () => {
	return (
		<footer className="border-border border-t bg-background pt-16 pb-8 ring-1 ring-foreground/5">
			<div className="container mx-auto max-w-6xl px-4">
				<div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
					<div className="col-span-2 md:col-span-1">
						<Logo />
						<p className="max-w-xs text-neutral-500 text-xs leading-relaxed">
							TrekToeic cam kết đồng hành cùng bạn trên con đường chinh phục bài
							thi TOEIC với phương pháp học tập hiện đại và hiệu quả.
						</p>
					</div>
					<div>
						<h4 className="mb-4 font-heading font-semibold text-foreground text-xs uppercase tracking-wider">
							Học tập
						</h4>
						<ul className="space-y-3 text-muted-foreground text-sm">
							<li>
								<Link to="/login" className="hover:text-foreground">
									Listening (Part 1–4)
								</Link>
							</li>
							<li>
								<Link to="/login" className="hover:text-foreground">
									Reading (Part 5–7)
								</Link>
							</li>
							<li>
								<Link to="/login" className="hover:text-foreground">
									Từ vựng
								</Link>
							</li>
							<li>
								<Link to="/login" className="hover:text-foreground">
									Ngữ pháp
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="mb-4 font-heading font-semibold text-foreground text-xs uppercase tracking-wider">
							Công ty
						</h4>
						<ul className="space-y-3 text-muted-foreground text-sm">
							<li>
								<Link to="/about-us" className="hover:text-foreground">
									Giới thiệu
								</Link>
							</li>
							<li>
								<Link to="/login" className="hover:text-foreground">
									Doanh nghiệp
								</Link>
							</li>
							<li>
								<Link to="/login" className="hover:text-foreground">
									Câu chuyện thành công
								</Link>
							</li>
							<li>
								<Link to="/login" className="hover:text-foreground">
									Bảng giá
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="mb-4 font-heading font-semibold text-foreground text-xs uppercase tracking-wider">
							Hỗ trợ
						</h4>
						<ul className="space-y-3 text-muted-foreground text-sm">
							<li>
								<Link to="/login" className="hover:text-foreground">
									Trung tâm trợ giúp
								</Link>
							</li>
							<li>
								<Link to="/login" className="hover:text-foreground">
									Ước lượng điểm
								</Link>
							</li>
							<li>
								<Link to="/login" className="hover:text-foreground">
									Điều khoản
								</Link>
							</li>
							<li>
								<Link to="/login" className="hover:text-foreground">
									Bảo mật
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className="flex flex-col items-center justify-between gap-4 border-border border-t pt-8 sm:flex-row">
					<p className="text-muted-foreground text-xs">
						© {new Date().getFullYear()} TrekToeic.
					</p>
					<div className="flex gap-4">
						<a
							href="https://twitter.com"
							className="text-muted-foreground hover:text-foreground"
							target="_blank"
							rel="noreferrer"
						>
							<TwitterLogo size={16} />
						</a>
						<a
							href="https://instagram.com"
							className="text-muted-foreground hover:text-foreground"
							target="_blank"
							rel="noreferrer"
						>
							<InstagramLogo size={16} />
						</a>
						<a
							href="https://linkedin.com"
							className="text-muted-foreground hover:text-foreground"
							target="_blank"
							rel="noreferrer"
						>
							<LinkedinLogo size={16} />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};
