import {
	InstagramLogo,
	LinkedinLogo,
	TwitterLogo,
} from "@phosphor-icons/react";
import { Logo } from "@/components/logo";

export const Footer = () => {
	return (
		<footer className="border-neutral-200 border-t bg-white pt-16 pb-8">
			<div className="mx-auto max-w-6xl px-6">
				<div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
					<div className="col-span-2 md:col-span-1">
						<Logo />
						<p className="max-w-xs text-neutral-500 text-xs leading-relaxed">
							TrekToeic cam kết đồng hành cùng bạn trên con đường chinh phục bài
							thi TOEIC với phương pháp học tập hiện đại và hiệu quả.
						</p>
					</div>
					<div>
						<h4 className="mb-4 font-semibold text-neutral-900 text-xs uppercase tracking-wider">
							Study
						</h4>
						<ul className="space-y-3 text-neutral-500 text-sm">
							<li>
								<a href="#" className="hover:text-neutral-900">
									Listening (Part 1-4)
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-neutral-900">
									Reading (Part 5-7)
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-neutral-900">
									Vocabulary Drills
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-neutral-900">
									Grammar Review
								</a>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="mb-4 font-semibold text-neutral-900 text-xs uppercase tracking-wider">
							Company
						</h4>
						<ul className="space-y-3 text-neutral-500 text-sm">
							<li>
								<a href="#" className="hover:text-neutral-900">
									About Us
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-neutral-900">
									For Enterprise
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-neutral-900">
									Success Stories
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-neutral-900">
									Pricing
								</a>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="mb-4 font-semibold text-neutral-900 text-xs uppercase tracking-wider">
							Support
						</h4>
						<ul className="space-y-3 text-neutral-500 text-sm">
							<li>
								<a href="#" className="hover:text-neutral-900">
									Help Center
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-neutral-900">
									Score Calculator
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-neutral-900">
									Terms of Service
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-neutral-900">
									Privacy Policy
								</a>
							</li>
						</ul>
					</div>
				</div>
				<div className="flex flex-col items-center justify-between gap-4 border-neutral-100 border-t pt-8 sm:flex-row">
					<p className="text-neutral-400 text-xs">
						© 2025 TrekToeic. All rights reserved.
					</p>
					<div className="flex gap-4">
						<a href="#" className="text-neutral-400 hover:text-neutral-600">
							<TwitterLogo size={16} />
						</a>
						<a href="#" className="text-neutral-400 hover:text-neutral-600">
							<InstagramLogo size={16} />
						</a>
						<a href="#" className="text-neutral-400 hover:text-neutral-600">
							<LinkedinLogo size={16} />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};
