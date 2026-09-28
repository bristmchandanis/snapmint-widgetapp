import { apiService } from '../utils/constants';
import { loginSchema } from '../validation/authValidation';
import { useAuthForm } from '../hooks/useAuthForm';
import FormField from '../components/common/FormField';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { IconLock, IconMail, IconSpinner, IconArrowRight } from '../components/common/Icons';

export default function Login({ onLoginSuccess }) {
  const {
    formData,
    fieldErrors,
    loading,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useAuthForm({ email: '', password: '' }, loginSchema);

  const handleLoginSubmit = async (data) => {
    const res = await apiService.login(data);
    if (res.success) {
      toast.success(res.message || 'Login successful!');
      if (res.token) {
        localStorage.setItem('token', res.token);
        if (res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
        }
        onLoginSuccess(res.user, res.token);
      }
    } else {
      toast.error(res.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="w-full max-w-125 my-auto px-4 py-12">
      <Card className="w-full shadow-none border border-gray-200 bg-white rounded-2xl overflow-hidden p-6 sm:p-8 space-y-3">
        <CardHeader className="space-y-1.5 text-center pb-4 pt-2">
          <CardTitle className="text-2xl font-extrabold tracking-tight text-gray-900">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-xs text-gray-500 font-medium">
            Sign in to access your shop merchant management portal
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(handleLoginSubmit)} noValidate>
          <CardContent className="space-y-4 pt-2">
            <FormField
              id="email"
              name="email"
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              error={fieldErrors.email}
              icon={IconMail}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <FormField
              id="password"
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              error={fieldErrors.password}
              icon={IconLock}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-5 pb-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-md shadow-2xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <IconSpinner className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>Sign In</span>
                    <IconArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
