import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../features/auth/authApi";
import lws_logo from "./../../assets/lws-logo-light.svg";

const Login = () => {
  const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    error: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setForm({
      ...form,
      error: "",
    });
    login({
      email: form?.email,
      password: form?.password,
    });
  };
  useEffect(() => {
    console.log(error);
    if (isError && error.data) {
      setForm({
        ...form,
        error: error.data,
      });
    } else if (isError && !error.data) {
      setForm({
        ...form,
        error: error.error,
      });
    }
  }, [error, isError]);
  useEffect(() => {
    if (isSuccess) {
      setForm({
        email: "",
        password: "",
        error: "",
      });
      navigate("/inbox");
    }
  }, [isSuccess]);

  return (
    <>
      <div className="grid place-items-center h-screen bg-[#F9FAFB">
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <img
                className="mx-auto h-12 w-auto"
                src={lws_logo}
                alt="Learn with sumit"
              />
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in to your account
              </h2>
            </div>
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
              action="#"
              method="POST"
            >
              <input type="hidden" name="remember" value="true" />
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label for="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autocomplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    value={form?.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label for="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autocomplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={form?.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-violet-600 hover:text-violet-500"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  disabled={isLoading}
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                >
                  Sign in
                </button>
              </div>
              {form?.error !== "" && (
                <p className="mt-3 text-red-600">{form?.error}</p>
              )}
            </form>
            <Link className="mt-2 text-sm text-blue-700" to="/register">
              Create new account...
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
