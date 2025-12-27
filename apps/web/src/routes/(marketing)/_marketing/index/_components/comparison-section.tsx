export const ComparisonSection = () => {
	return (
		<section className="border-neutral-100 border-t bg-white py-24">
			<div className="mx-auto max-w-4xl px-6">
				<h2 className="mb-16 text-center font-semibold text-3xl text-neutral-900 tracking-tight">
					Tại sao chọn <span className="text-blue-700">TrekToeic</span> thay vì
					sách giáo khoa?
				</h2>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse text-left">
						<thead>
							<tr className="border-neutral-100 border-b">
								<th className="w-1/3 py-4 pl-4 font-medium text-neutral-400 text-sm uppercase tracking-wider">
									Phương pháp học tập
								</th>
								<th className="w-1/3 py-4 text-center font-semibold text-neutral-900">
									TrekToeic
								</th>
								<th className="w-1/3 py-4 text-center font-medium text-neutral-400">
									Sách giáo khoa truyền thống
								</th>
							</tr>
						</thead>
						<tbody className="text-sm">
							<tr className="border-neutral-50 border-b hover:bg-neutral-50/50">
								<td className="py-4 pl-4 font-medium text-neutral-700">
									Ngân hàng câu hỏi
								</td>
								<td className="py-4 text-center font-medium text-blue-600">
									10,000+ (Liên tục cập nhật)
								</td>
								<td className="py-4 text-center text-neutral-500">
									Cố định (Nhanh chóng lỗi thời)
								</td>
							</tr>
							<tr className="border-neutral-50 border-b hover:bg-neutral-50/50">
								<td className="py-4 pl-4 font-medium text-neutral-700">
									Theo dõi tiến độ học tập
								</td>
								<td className="py-4 text-center font-medium text-blue-600">
									Automatic Tracking
								</td>
								<td className="py-4 text-center text-neutral-500">
									Manual Tracking
								</td>
							</tr>
							<tr className="border-neutral-50 border-b hover:bg-neutral-50/50">
								<td className="py-4 pl-4 font-medium text-neutral-700">
									Listening
								</td>
								<td className="py-4 text-center font-medium text-blue-600">
									Variable Speeds (0.8x - 1.5x)
								</td>
								<td className="py-4 text-center text-neutral-500">
									CD / Static MP3
								</td>
							</tr>
							<tr className="hover:bg-neutral-50/50">
								<td className="py-4 pl-4 font-medium text-neutral-700">
									Chi phí hàng tháng
								</td>
								<td className="py-4 text-center font-medium text-blue-600">
									$3 / tháng
								</td>
								<td className="py-4 text-center text-neutral-500">
									$50+ mỗi cuốn
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</section>
	);
};
