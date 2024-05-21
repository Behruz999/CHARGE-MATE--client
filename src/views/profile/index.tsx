import './profile.css'
import React, { useState, useEffect } from 'react'
import { LogError, Notify } from '../../errorHandler/debug';
import axios, { AxiosError } from 'axios';
import { CiSettings } from "react-icons/ci";
import { jwtDecode } from 'jwt-decode';
import { URL } from '../../config';
import { useNavigate } from 'react-router-dom';
import { userDataProps, decodedUserProps, fetchedUserProps } from '../../aliases/alias';

export const Profile = () => {
  const navigate = useNavigate()
  const [fetchedUser, setFetchedUser] = useState<fetchedUserProps | null>(null);
  const [userData, setUserData] = useState<userDataProps>({
    nickname: '',
    password: '',
  });

  const jwt: string | null = localStorage?.getItem('jwt');

  const decodedUser: decodedUserProps = jwt ? jwtDecode(jwt) :
    { exp: 0, iat: 0, nickname: '', password: '', role: '', _id: '' };

  async function submit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault()
    try {
      const res = await axios.patch(`${URL}/users/${decodedUser?._id}`, userData, {
        headers: { Authorization: jwt }
      })
      res?.status === 200 && Notify('User modification successful !', 'success')
    } catch (err) {
      Notify(LogError(err as AxiosError), 'warn')
    }
  }

  async function deletionUser(e: any) {
    e.preventDefault()
    try {
      if (confirm(`You're going to delete ?`)) {
        if (confirm(`You cannot recover your account after you delete it !`)) {
          const res = await axios.delete(`${URL}/users/${decodedUser?._id}`, {
            headers: { Authorization: jwt && JSON?.parse(jwt) }
          })
          res?.status === 200 && Notify(`${res?.data?.msg}`, 'success')
          navigate('/')
          localStorage.clear()
        } else {
          return
        }
      } else {
        return
      }
    } catch (err) {
      Notify(LogError(err as AxiosError), 'err')
    }
  }

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${URL}/users/${decodedUser?._id}`)
      setFetchedUser(res?.data[0])
    } catch (err) {
      Notify(LogError(err as AxiosError), 'err')
    }
  }

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  }

  const logOut = () => {
    if (confirm(`You want to log out ?`)) {
      localStorage.clear()
      navigate('/')
    } else {
      return
    }
  }

  useEffect(() => {
    fetchUser()
  }, []);

  // Populate userData with fetchedUser data when it's available
  useEffect(() => {
    if (fetchedUser) {
      setUserData({
        nickname: fetchedUser.nickname,
        password: fetchedUser.password,
      });
    }
  }, [fetchedUser]);

  return (
    <>
      <div className="p_wrapper relative bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-500 in-out-quad">
        <div className="p_header text-center">
          <h1 className='p_header_txt  text-custom-lg capitalize'>profile information</h1>
        </div>

        <div className="p_body absolute inset-0 flex flex-col justify-center items-center">
          <form>
            <div className="mb-5">
              <label className='r_lab text-1xl' htmlFor="nickname">nickname</label>
              <input className='r_inp text-black bg-white w-full sm:w-64' name='nickname'
                type="text" value={userData.nickname} onChange={changeHandler} minLength={4} maxLength={15} required />
            </div>

            <div className="mb-5">
              <label className='r_lab text-1xl' htmlFor="password">password</label>
              <input className='r_inp text-black bg-white w-full sm:w-64' name='password'
                type="text" value={userData.password} onChange={changeHandler} minLength={4} maxLength={10} required />
            </div>

            <div className="mb-5">
              <div className="p_family_place flex justify-between">
                <label className='r_lab text-1xl' htmlFor="family">family</label>
                <CiSettings size={25} className='cursor-pointer' onClick={() => fetchedUser?.individual ? navigate('/family') : navigate('/familyInfo')} />
              </div>
              <input className='r_inp text-black bg-white w-full sm:w-64' name='family'
                type="text" value={fetchedUser?.family?.name} disabled />
            </div>
            <div className="p_del_place pb-4">
              <h1 onClick={deletionUser} className='capitalize hover:underline cursor-pointer'>delete my account</h1>
            </div>
            <div className="bg-success flex justify-between items-center">
              <button onClick={submit} className='r_btn font-bold capitalize'>update</button>
              <button onClick={logOut} className='r_btn max-md:ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded capitalize'>logout</button>
            </div>
          </form>

        </div>
      </div>
    </>
  )
}
