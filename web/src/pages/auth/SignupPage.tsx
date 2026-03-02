import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import SmallLogo from "../../assets/images/mobile-logo.png";
import { useAuthStore } from "../../store/useAuthStore";
import { Link, useNavigate } from "react-router";


export interface SignupData {
  username: string;
  name?: string;
  password: string;
}

export default function SignupPage() {
  const [fields, setFields] = useState<SignupData>({
    username: '',
    name: '',
    password: '',
  });
  
  const changeFieldsValue = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);
  const isLoading = useAuthStore((state) => (state.isLoading));
  const handleSignup = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      await signup(fields);
      navigate('/');
    } catch (error) {
      alert("Sign up failed!");
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="SuperSimpleDev"
            src={SmallLogo}
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6"  onSubmit={handleSignup}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Full Name <span className="text-gray-500">(Optional)</span>
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  value={fields.name}
                  onChange={changeFieldsValue}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  value={fields.username}
                  onChange={changeFieldsValue}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  value={fields.password}
                  onChange={changeFieldsValue}
                />
              </div>
              
              <p className="mt-1 text-sm/6 text-gray-500">
              Must be at least 6 characters long.
              </p>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-jungle-green px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-jungle-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={isLoading}
              >
                {isLoading ? 'Signing up...' : 'Sign up'}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-700">
            Already have an account?{" "}
            <Link to="/auth/login">
              <span className="font-semibold text-jungle-green hover:text-jungle-light">Sign in</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}