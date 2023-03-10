'use client'
import { axiosInstance } from "@/app/utils/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { object, string, TypeOf } from 'zod';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




export const loginUserSchema = object({
    email: string()
        .min(1, {
            message: "Email is required",
        })
        .email("Email is invalid"),
    password: string()
        .min(1, {
            message: "Password is required",
        }),
});

type LoginUser = TypeOf<typeof loginUserSchema>;

export default function LoginPage() {
    const router = useRouter();

    const { register, formState: { errors }, handleSubmit } = useForm<LoginUser>({
        resolver: zodResolver(loginUserSchema),
    })
    const [loginErrors, setLoginErrors] = useState<string | null>(null)

    const notify = (error = '') => toast(error, {
        type: "error",
    });


    const onSubmit = async (data: LoginUser) => {
        try {
            await axiosInstance.post('/api/sessions', data)
            await router.push('/')
        } catch (err) {
            const error = err as AxiosError<{ msg: string }>;
            setLoginErrors(error.response?.data?.msg!);
            notify(loginErrors!);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-10 bg-gray-100">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-sm p-8 rounded-lg shadow-lg bg-gray-50 dark:bg-gray-800"
                method="POST"
            >
                <ToastContainer />

                <h1 className="mb-5 text-2xl font-bold text-gray-800">Login</h1>

                {/*  email */}
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                    <input type="email" id="email"
                        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 
                    ${errors.email ? 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400' : ''}`}
                        {...register('email')}
                    />
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        {errors.email && errors.email.message}
                    </p>
                </div>

                {/*  password */}
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input type="password" id="password"
                        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 
                    ${errors.password ? 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400' : ''}`}
                        {...register('password')}
                    />
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        {errors.password && errors.password.message}
                    </p>
                </div>


                <button type="submit" className="min-w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </form>

        </div>
    )
}
