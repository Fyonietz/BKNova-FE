// src/pages/LoginPage.tsx
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';

// ─────────────────────────────────────────────
// 1. REQUEST SHAPE — what you SEND to the backend
// Edit this to match your backend's expected body.
// ─────────────────────────────────────────────
interface LoginRequest {
  Nama: string;
  Password: string;
}

// ─────────────────────────────────────────────
// 2. RESPONSE SHAPE — what backend SENDS BACK
// Edit this to match your backend's actual JSON response.
// ─────────────────────────────────────────────
interface LoginResponse {
  token: string;
  nama: string;
  role: string;
  refresh_Token: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [nama, setNama] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nama || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // ───────────────────────────────────────
      // 3. THE ACTUAL API CALL
      // Change '/auth/login' to your real endpoint path.
      // ───────────────────────────────────────
      const payload: LoginRequest = { Nama: nama, Password: password };
      const response = await api.post<LoginResponse>('/api/v1/auth/login', payload, {
        auth: false, // no token needed yet, we're logging in
      });

      // ───────────────────────────────────────
      // 4. WHAT TO DO WITH THE RESPONSE
      // Store token + user however your app needs.
      // ───────────────────────────────────────
      localStorage.setItem('token', response.token);
      localStorage.setItem('refresh_token', response.refresh_Token);
      if(response.role != "Admin"){
        setError('Role Mismatch')
        return
      }
      navigate("/admin/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Login failed. Please try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-secondary via-background to-background px-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <Card className="relative w-full max-w-sm border-t-4 border-t-primary bg-card/95 backdrop-blur-sm shadow-2xl shadow-primary/20 ring-1 ring-primary/10">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full shadow-lg shadow-primary/30">
            <img src="/logo.jpeg" alt="Logo" className="h-full w-full object-cover" />
          </div>
          <CardTitle className="mt-6 mb-6"> 
            Welcome To <br /> BK Nova!
          </CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama</Label>
              <Input
                id="nama"
                placeholder="John Doe"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full shadow-md shadow-primary/30"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
