import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button, Card, TextInput } from "tf-ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    // Simulate an auth request
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setError("Invalid email or password. Please try again.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-page">
      <div className="w-full max-w-[420px]">

        {/* Brand header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block no-underline">
            <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 text-3xl">
              🪙
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-ink leading-tight mb-1">
            Hobbybordet
          </h1>
          <p className="text-sm text-ink-muted">Sign in to log your findings</p>
        </div>

        <Card variant="elevated" padding="p-8">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            {error && (
              <div
                role="alert"
                className="bg-error-soft border border-edge-error rounded-md px-4 py-3 text-sm text-error"
              >
                {error}
              </div>
            )}

            <TextInput
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              size="md"
            />

            <div>
              <TextInput
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                size="md"
              />
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="block text-right text-sm text-primary mt-2 no-underline hover:text-primary-dark hover:underline transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Sign in
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3 text-sm text-ink-faint">
              <hr className="flex-1 border-edge" />
              or
              <hr className="flex-1 border-edge" />
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => {}}
            >
              Continue with Google
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-ink-muted mt-6">
          Don't have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-semibold no-underline hover:text-primary-dark hover:underline transition-colors"
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
