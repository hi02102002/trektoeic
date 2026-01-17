/**
 * Contact Form Component
 *
 * Complete contact form with validation styling.
 * Includes name, email, subject, and message fields.
 *
 * Usage:
 *   <ContactForm onSubmit={handleSubmit} />
 */

"use client";

import { useState } from "react";

interface ContactFormProps {
	onSubmit?: (data: ContactFormData) => Promise<void> | void;
}

interface ContactFormData {
	name: string;
	email: string;
	subject: string;
	message: string;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
	const [formData, setFormData] = useState<ContactFormData>({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [errors, setErrors] = useState<
		Partial<Record<keyof ContactFormData, string>>
	>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		// Clear error when user starts typing
		if (errors[name as keyof ContactFormData]) {
			setErrors((prev) => ({ ...prev, [name]: undefined }));
		}
	};

	const validate = (): boolean => {
		const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

		if (!formData.name.trim()) {
			newErrors.name = "Name is required";
		}

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Please enter a valid email";
		}

		if (!formData.subject.trim()) {
			newErrors.subject = "Subject is required";
		}

		if (!formData.message.trim()) {
			newErrors.message = "Message is required";
		} else if (formData.message.length < 10) {
			newErrors.message = "Message must be at least 10 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validate()) return;

		setIsSubmitting(true);
		try {
			await onSubmit?.(formData);
			setIsSuccess(true);
			setFormData({ name: "", email: "", subject: "", message: "" });
		} catch (error) {
			console.error("Form submission error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSuccess) {
		return (
			<div className="mx-auto max-w-md rounded-lg border border-success bg-success/10 p-8 text-center">
				<svg className="mx-auto mb-4 h-12 w-12 text-success">✓</svg>
				<h3 className="mb-2 font-semibold text-xl">Message Sent!</h3>
				<p className="mb-4 text-muted-foreground">
					Thank you for contacting us. We'll get back to you soon.
				</p>
				<button
					onClick={() => setIsSuccess(false)}
					className="text-primary underline-offset-4 hover:underline"
				>
					Send another message
				</button>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-6">
			{/* Name */}
			<div className="space-y-2">
				<label htmlFor="name" className="font-medium text-sm">
					Name <span className="text-destructive">*</span>
				</label>
				<input
					id="name"
					name="name"
					type="text"
					value={formData.name}
					onChange={handleChange}
					className={`w-full rounded-md border bg-background px-3 py-2 focus:outline-none focus:ring-2 ${
						errors.name
							? "border-destructive focus:ring-destructive"
							: "border-border focus:ring-primary"
					}`}
					placeholder="Your name"
					aria-invalid={!!errors.name}
					aria-describedby={errors.name ? "name-error" : undefined}
				/>
				{errors.name && (
					<p id="name-error" className="text-destructive text-sm">
						{errors.name}
					</p>
				)}
			</div>

			{/* Email */}
			<div className="space-y-2">
				<label htmlFor="email" className="font-medium text-sm">
					Email <span className="text-destructive">*</span>
				</label>
				<input
					id="email"
					name="email"
					type="email"
					value={formData.email}
					onChange={handleChange}
					className={`w-full rounded-md border bg-background px-3 py-2 focus:outline-none focus:ring-2 ${
						errors.email
							? "border-destructive focus:ring-destructive"
							: "border-border focus:ring-primary"
					}`}
					placeholder="you@example.com"
					aria-invalid={!!errors.email}
					aria-describedby={errors.email ? "email-error" : undefined}
				/>
				{errors.email && (
					<p id="email-error" className="text-destructive text-sm">
						{errors.email}
					</p>
				)}
			</div>

			{/* Subject */}
			<div className="space-y-2">
				<label htmlFor="subject" className="font-medium text-sm">
					Subject <span className="text-destructive">*</span>
				</label>
				<select
					id="subject"
					name="subject"
					value={formData.subject}
					onChange={handleChange}
					className={`w-full rounded-md border bg-background px-3 py-2 focus:outline-none focus:ring-2 ${
						errors.subject
							? "border-destructive focus:ring-destructive"
							: "border-border focus:ring-primary"
					}`}
					aria-invalid={!!errors.subject}
					aria-describedby={errors.subject ? "subject-error" : undefined}
				>
					<option value="">Select a subject</option>
					<option value="general">General Inquiry</option>
					<option value="support">Technical Support</option>
					<option value="sales">Sales Question</option>
					<option value="other">Other</option>
				</select>
				{errors.subject && (
					<p id="subject-error" className="text-destructive text-sm">
						{errors.subject}
					</p>
				)}
			</div>

			{/* Message */}
			<div className="space-y-2">
				<label htmlFor="message" className="font-medium text-sm">
					Message <span className="text-destructive">*</span>
				</label>
				<textarea
					id="message"
					name="message"
					value={formData.message}
					onChange={handleChange}
					rows={5}
					className={`w-full resize-y rounded-md border bg-background px-3 py-2 focus:outline-none focus:ring-2 ${
						errors.message
							? "border-destructive focus:ring-destructive"
							: "border-border focus:ring-primary"
					}`}
					placeholder="Your message..."
					aria-invalid={!!errors.message}
					aria-describedby={errors.message ? "message-error" : undefined}
				/>
				{errors.message && (
					<p id="message-error" className="text-destructive text-sm">
						{errors.message}
					</p>
				)}
				<p className="text-muted-foreground text-xs">
					{formData.message.length}/500 characters
				</p>
			</div>

			{/* Submit Button */}
			<button
				type="submit"
				disabled={isSubmitting}
				className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{isSubmitting ? (
					<>
						<svg className="h-5 w-5 animate-spin">⟳</svg>
						<span>Sending...</span>
					</>
				) : (
					"Send Message"
				)}
			</button>

			<p className="text-center text-muted-foreground text-xs">
				By submitting this form, you agree to our{" "}
				<a href="/privacy" className="text-primary hover:underline">
					privacy policy
				</a>
				.
			</p>
		</form>
	);
}

/**
 * Example Usage:
 *
 * <ContactForm
 *   onSubmit={async (data) => {
 *     await fetch('/api/contact', {
 *       method: 'POST',
 *       body: JSON.stringify(data),
 *     })
 *   }}
 * />
 */
