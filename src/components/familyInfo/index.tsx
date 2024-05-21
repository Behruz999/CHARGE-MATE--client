import './familyInfo.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { LogError, Notify } from '../../errorHandler/debug';
import axios, { AxiosError } from 'axios';
import { URL } from '../../config';
import { fetchedFamilyProps, familyDataProps } from '../../aliases/alias';

export const FamilyInfo = () => {
    const navigate = useNavigate()
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [fetchedFamily, setFetchedFamily] = useState<fetchedFamilyProps | null>(null);
    const [familyData, setFamilyData] = useState<familyDataProps>({
        name: '',
        password: '',
        users: [],
    });
    const jwt: string | null = localStorage?.getItem('jwt');
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [isDeleteChargesToo, setIsDeleteChargesToo] = useState<boolean>(false);

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFamilyData({
            ...familyData,
            [e.target.name]: e.target.value
        });
    }

    async function submit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault()
        try {
            const res = await axios?.patch(`${URL}/families/${fetchedFamily?._id}`, familyData, {
                headers: { Authorization: jwt }
            })
            res?.status === 200 && Notify('Family modification successful !', 'success')
            setRefreshKey(refreshKey + 1)
        } catch (err) {
            Notify(LogError(err as AxiosError), 'warn')
        }
    }

    const fetchFamily = async () => {
        try {
            const res = await axios.get(`${URL}/families/getinfo`, {
                headers: { Authorization: jwt && JSON?.parse(jwt) }
            })
            setFetchedFamily(res?.data[0])
        } catch (err) {
            Notify(LogError(err as AxiosError), 'err')
        }
    }

    const handleCloseModal = () => {
        setModalOpen(false)
    }

    const ensureUserChoice = async () => {
        if (confirm(`You want to leave family ?`)) {
            setModalOpen(true)
        } else {
            return handleCloseModal()
        }
    }

    const leaveFamily = async () => {
        try {
            if (confirm(`Sure ?`)) {
                const res = await axios.post(`${URL}/families/leave/${fetchedFamily?._id}`,
                    {
                        deleteFamilyDetailsToo: isDeleteChargesToo
                    },
                    {
                        headers: { Authorization: jwt ? JSON.parse(jwt) : undefined }
                    },
                )

                setModalOpen(false)
                res?.status === 200 && Notify(res?.data?.msg, 'info')
                navigate('/intial')
            } else {
                return handleCloseModal()
            }
        } catch (err) {
            handleCloseModal()
            Notify(LogError(err as AxiosError), 'err')
        }
    }

    useEffect(() => {
        fetchFamily()
    }, [refreshKey]);

    // Populate familyData with fetchedFamily data when it's available
    useEffect(() => {
        if (fetchedFamily) {
            setFamilyData({
                ...fetchedFamily,
                users: fetchedFamily?.users?.map(user => user?._id),
            });
        }
    }, [fetchedFamily]);

    return (
        <>
            <div className="fi_wrapper bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-500 in-out-quad relative h-screen">
                <div className="fi_header capitalize lg:text-3xl sm:text-xl flex flex-wrap justify-around">
                    <div className="fi_btm_part flex">
                        <h1>build:</h1>
                        <h1 className='ml-2'>{fetchedFamily?.createdAt}</h1>
                    </div>
                    <h1 className='hidden md:block'>modify family info</h1>
                    <div className="fi_btm_part flex">
                        <h1>modified:</h1>
                        <h1 className='ml-2'>{fetchedFamily?.updatedAt}</h1>
                    </div>
                </div>

                <div className="fi_body w-full absolute inset-0 flex flex-col justify-center items-center">
                    <div className="mb-5">
                        <label className='r_lab text-1xl' htmlFor="nickname">name</label>
                        <input className='r_inp text-black bg-white w-full sm:w-64' name='nickname'
                            type="text" value={familyData.name} onChange={changeHandler} required />
                    </div>

                    <div className="mb-5">
                        <label className='r_lab text-1xl' htmlFor="password">password</label>
                        <input className='r_inp text-black bg-white w-full sm:w-64' name='password'
                            type="text" value={familyData.password} onChange={changeHandler} required />
                    </div>
                    <div>
                        <button
                            onClick={ensureUserChoice}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mr-4 rounded capitalize mb-3"
                        >
                            leave
                        </button>
                        <button onClick={submit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 capitalize">
                            update
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <div className={`fixed z-10 inset-0 overflow-y-auto transition-opacity duration-300 ${!modalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
                    {/* Background overlay */}
                    <div onClick={handleCloseModal} className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                    {/* Modal content */}
                    <div className="bg-white dark:bg-gray-800 text-black dark:text-white duration-500 in-out-quad rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full md:max-w-xl lg:max-w-2xl md:w-9/12 lg:w-10/12 xl:w-9/12 fill-available-width">
                        <div className="bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-500 in-out-quad px-4 py-3">
                            <h2 className="text-lg font-semibold capitalize" id="modal-title">exit</h2>
                        </div>
                        {
                            (fetchedFamily?.users?.length ?? 0) < 2 &&
                            <>
                                <div className="px-4 py-6 capitalize">
                                    <input className='mr-1' type="checkbox" onChange={e => setIsDeleteChargesToo(e.target.checked)} name="deleteFamilyDetailsToo" checked={isDeleteChargesToo} />
                                    delete my family charges
                                </div>
                            </>
                        }
                        <div className="bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-500 in-out-quad px-4 py-3 flex justify-end">
                            <button onClick={leaveFamily} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded capitalize">
                                leave
                            </button>
                            <button className="ml-2 bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded capitalize" onClick={handleCloseModal}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
