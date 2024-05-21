import './register.css'
import React, { useState } from 'react'
import axios, { AxiosError } from 'axios';
import { URL } from '../../config';
import { LogError, Notify } from '../../errorHandler/debug';
import { useNavigate } from 'react-router-dom';
import { userDataProps } from '../../aliases/alias';

export const Register = () => {
    const navigate = useNavigate()
    const [status, setStatus] = useState<string>('signin');
    const [userData, setUserData] = useState<userDataProps>({
        nickname: '',
        password: '',
    });

    const handleChangeStatus = () => {
        setStatus(status === 'signin' ? 'signup' : 'signin')
    }

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    }

    async function submit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault()
        try {
            const res = await axios.post(`${URL}/users/${status}`, userData)
            Notify(res.data.msg, 'success')
            localStorage.setItem('jwt', JSON.stringify(res.data.token))
            navigate('/intial')
        } catch (err) {
            Notify(LogError(err as AxiosError), 'warn')
        }
    }

    return (
        <>
            <div className="r_wrapper bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-500 in-out-quad">
                <div className="r_container mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-500 in-out-quad">
                    <div className="r_header text-center">
                        <h1 className='r_header_txt text-3xl xl:text-4xl'>{status === 'signin' ? 'login' : 'registration'} page</h1>
                    </div>

                    <div className="r_body lg:flex md:flex sm:flex flex-col items-center">
                        <div className="r_part mb-5">
                            <label className='r_lab text-1xl' htmlFor="nickname">nickname</label>
                            <input className='r_inp w-full text-black sm:w-64' name='nickname'
                                type="text" value={userData.nickname} onChange={changeHandler} required />
                        </div>

                        <div className="r_part mb-5">
                            <label className='r_lab text-1xl' htmlFor="password">password</label>
                            <input className='r_inp w-full text-black sm:w-64' name='password'
                                type="text" value={userData.password} onChange={changeHandler} required />
                        </div>

                        <a onClick={handleChangeStatus} className='r_status mb-2 cursor-pointer'>{status === 'signup' ? 'already have an account ?' : 'don\'t have an account ?'}</a>
                        <div className="r_btn_wrap bg-success">
                            <button onClick={submit} className='r_btn'>sign {status === 'signup' ? 'up' : 'in'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
