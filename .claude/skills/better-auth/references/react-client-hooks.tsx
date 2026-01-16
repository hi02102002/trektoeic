/**
 * React Client Components with better-auth
 *
 * This example demonstrates:
 * - useSession hook
 * - Sign in/up forms
 * - Social sign-in buttons
 * - Protected route component
 * - User profile component
 * - Organization switcher
 */

"use client";

import { createAuthClient, useSession } from "better-auth/client";
import { useEffect, useState } from "react";

// Initialize auth client
export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});

// ============================================================================
// Login Form Component
// ============================================================================

export function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleEmailSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const { data, error } = await authClient.signIn.email({
				email,
				password,
			});

			if (error) {
				setError(error.message);
				return;
			}

			// Redirect on success
			window.location.href = "/dashboard";
		} catch (err) {
			setError("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		setLoading(true);
		await authClient.signIn.social({
			provider: "google",
			callbackURL: "/dashboard",
		});
	};

	const handleGitHubSignIn = async () => {
		setLoading(true);
		await authClient.signIn.social({
			provider: "github",
			callbackURL: "/dashboard",
		});
	};

	return (
		<div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow">
			<h2 className="mb-6 font-bold text-2xl">Sign In</h2>

			{error && (
				<div className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</div>
			)}

			<form onSubmit={handleEmailSignIn} className="space-y-4">
				<div>
					<label htmlFor="email" className="mb-1 block font-medium text-sm">
						Email
					</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="w-full rounded-md border px-3 py-2"
						placeholder="you@example.com"
					/>
				</div>

				<div>
					<label htmlFor="password" className="mb-1 block font-medium text-sm">
						Password
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="w-full rounded-md border px-3 py-2"
						placeholder="••••••••"
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
				>
					{loading ? "Signing in..." : "Sign In"}
				</button>
			</form>

			<div className="mt-6">
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-gray-300 border-t" />
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="bg-white px-2 text-gray-500">
							Or continue with
						</span>
					</div>
				</div>

				<div className="mt-6 grid grid-cols-2 gap-3">
					<button
						onClick={handleGoogleSignIn}
						disabled={loading}
						className="rounded-md border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
					>
						Google
					</button>
					<button
						onClick={handleGitHubSignIn}
						disabled={loading}
						className="rounded-md border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
					>
						GitHub
					</button>
				</div>
			</div>

			<p className="mt-4 text-center text-gray-600 text-sm">
				Don't have an account?{" "}
				<a href="/signup" className="text-blue-600 hover:underline">
					Sign up
				</a>
			</p>
		</div>
	);
}

// ============================================================================
// Sign Up Form Component
// ============================================================================

export function SignUpForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const { data, error } = await authClient.signUp.email({
				email,
				password,
				name,
			});

			if (error) {
				setError(error.message);
				return;
			}

			setSuccess(true);
		} catch (err) {
			setError("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow">
				<h2 className="mb-4 font-bold text-2xl">Check your email</h2>
				<p className="text-gray-600">
					We've sent a verification link to <strong>{email}</strong>. Click the
					link to verify your account.
				</p>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow">
			<h2 className="mb-6 font-bold text-2xl">Sign Up</h2>

			{error && (
				<div className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</div>
			)}

			<form onSubmit={handleSignUp} className="space-y-4">
				<div>
					<label htmlFor="name" className="mb-1 block font-medium text-sm">
						Name
					</label>
					<input
						id="name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						className="w-full rounded-md border px-3 py-2"
						placeholder="John Doe"
					/>
				</div>

				<div>
					<label htmlFor="email" className="mb-1 block font-medium text-sm">
						Email
					</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="w-full rounded-md border px-3 py-2"
						placeholder="you@example.com"
					/>
				</div>

				<div>
					<label htmlFor="password" className="mb-1 block font-medium text-sm">
						Password
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						minLength={8}
						className="w-full rounded-md border px-3 py-2"
						placeholder="••••••••"
					/>
					<p className="mt-1 text-gray-500 text-xs">At least 8 characters</p>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
				>
					{loading ? "Creating account..." : "Sign Up"}
				</button>
			</form>

			<p className="mt-4 text-center text-gray-600 text-sm">
				Already have an account?{" "}
				<a href="/login" className="text-blue-600 hover:underline">
					Sign in
				</a>
			</p>
		</div>
	);
}

// ============================================================================
// User Profile Component
// ============================================================================

export function UserProfile() {
	const { data: session, isPending } = useSession();

	if (isPending) {
		return <div className="p-4">Loading...</div>;
	}

	if (!session) {
		return (
			<div className="p-4">
				<p>Not authenticated</p>
				<a href="/login" className="text-blue-600 hover:underline">
					Sign in
				</a>
			</div>
		);
	}

	const handleSignOut = async () => {
		await authClient.signOut();
		window.location.href = "/login";
	};

	return (
		<div className="rounded-lg bg-white p-4 shadow">
			<div className="flex items-center gap-4">
				{session.user.image && (
					<img
						src={session.user.image}
						alt={session.user.name || "User"}
						className="h-12 w-12 rounded-full"
					/>
				)}
				<div className="flex-1">
					<h3 className="font-semibold">{session.user.name}</h3>
					<p className="text-gray-600 text-sm">{session.user.email}</p>
				</div>
				<button
					onClick={handleSignOut}
					className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
				>
					Sign Out
				</button>
			</div>
		</div>
	);
}

// ============================================================================
// Protected Route Component
// ============================================================================

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { data: session, isPending } = useSession();

	if (isPending) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<div className="mx-auto h-12 w-12 animate-spin rounded-full border-blue-600 border-b-2" />
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	if (!session) {
		// Redirect to login
		if (typeof window !== "undefined") {
			window.location.href = "/login";
		}
		return null;
	}

	return <>{children}</>;
}

// ============================================================================
// Organization Switcher Component (if using organizations plugin)
// ============================================================================

export function OrganizationSwitcher() {
	const { data: session } = useSession();
	const [organizations, setOrganizations] = useState([]);
	const [loading, setLoading] = useState(true);

	// Fetch user's organizations
	useEffect(() => {
		async function fetchOrgs() {
			const orgs = await authClient.organization.listUserOrganizations();
			setOrganizations(orgs);
			setLoading(false);
		}
		fetchOrgs();
	}, []);

	const switchOrganization = async (orgId: string) => {
		await authClient.organization.setActiveOrganization({
			organizationId: orgId,
		});
		window.location.reload();
	};

	if (loading) return <div>Loading organizations...</div>;

	return (
		<select
			onChange={(e) => switchOrganization(e.target.value)}
			className="rounded-md border px-3 py-2"
		>
			{organizations.map((org) => (
				<option key={org.id} value={org.id}>
					{org.name}
				</option>
			))}
		</select>
	);
}

// ============================================================================
// 2FA Setup Component (if using twoFactor plugin)
// ============================================================================

export function TwoFactorSetup() {
	const [qrCode, setQrCode] = useState("");
	const [verifyCode, setVerifyCode] = useState("");
	const [enabled, setEnabled] = useState(false);

	const enable2FA = async () => {
		const { data } = await authClient.twoFactor.enable({ method: "totp" });
		setQrCode(data.qrCode);
	};

	const verify2FA = async (e: React.FormEvent) => {
		e.preventDefault();
		const { error } = await authClient.twoFactor.verify({ code: verifyCode });
		if (!error) {
			setEnabled(true);
		}
	};

	if (enabled) {
		return <div className="rounded bg-green-100 p-4">2FA is enabled!</div>;
	}

	if (qrCode) {
		return (
			<div className="rounded-lg bg-white p-4 shadow">
				<h3 className="mb-4 font-semibold">Scan QR Code</h3>
				<img src={qrCode} alt="2FA QR Code" className="mx-auto mb-4" />
				<form onSubmit={verify2FA} className="space-y-4">
					<input
						type="text"
						value={verifyCode}
						onChange={(e) => setVerifyCode(e.target.value)}
						placeholder="Enter 6-digit code"
						className="w-full rounded-md border px-3 py-2"
						maxLength={6}
					/>
					<button
						type="submit"
						className="w-full rounded-md bg-blue-600 px-4 py-2 text-white"
					>
						Verify & Enable
					</button>
				</form>
			</div>
		);
	}

	return (
		<button
			onClick={enable2FA}
			className="rounded-md bg-blue-600 px-4 py-2 text-white"
		>
			Enable 2FA
		</button>
	);
}
