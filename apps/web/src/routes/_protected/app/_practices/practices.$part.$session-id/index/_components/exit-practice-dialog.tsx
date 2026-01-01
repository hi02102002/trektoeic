import { useBlocker } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const ExitPracticeDialog = () => {
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);

	const { proceed, reset, status } = useBlocker({
		condition: true,
	});

	useEffect(() => {
		if (status === "blocked") {
			setShowConfirmDialog(true);
		}
	}, [status]);

	const handleCancel = () => {
		setShowConfirmDialog(false);
		reset?.();
	};

	const handleConfirmLeave = () => {
		setShowConfirmDialog(false);
		proceed?.();
	};

	return (
		<AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Xác nhận rời khỏi bài luyện tập</AlertDialogTitle>
					<AlertDialogDescription>
						Bạn có chắc chắn muốn rời khỏi bài luyện tập không? Tiến trình của
						bạn sẽ không được lưu lại.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={handleCancel}>Ở lại</AlertDialogCancel>
					<AlertDialogAction onClick={handleConfirmLeave}>
						Rời khỏi
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
