import './family.css'
import { useState, useEffect } from 'react'
import { LogError, Notify } from '../../errorHandler/debug';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { TfiWrite } from "react-icons/tfi";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { jwtDecode } from 'jwt-decode';
import { URL } from '../../config';
import EmptyCharges from '../../components/emptyChages';
import {
    decodedUserProps, fetchedFamilyProps, fetchedUserProps,
    familyChargesProps
} from '../../aliases/alias';

// Utility function to check screen width
const isPhoneScreen = () => window.innerWidth < 640;

export const Family = () => {
    const navigate = useNavigate()
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [isPhone, setIsPhone] = useState(isPhoneScreen());
    const [isOpen, setIsOpen] = useState(false);
    const [buildFamily, setBuildFamily] = useState<boolean>(false);
    const [fetchedFamily, setFetchedFamily] = useState<fetchedFamilyProps>();
    const [fetchedUser, setFetchedUser] = useState<fetchedUserProps>();
    const [familyCharges, setFamilyCharges] = useState<familyChargesProps[]>([]);
    const [familyData, setFamilyData] = useState({
        name: '',
        password: '',
        includeMe: false,
        generatePassword: false,
        digit: 0,
    });
    const [chargeData, setChargeData] = useState({
        _id: '',
        title: '',
        category: '',
        currency: '',
        quantity: '',
        price: '',
    });
    // State variable to track whether modal is in "add" or "edit" mode
    const [isEditMode, setIsEditMode] = useState(false);
    const jwt: string | null = localStorage?.getItem('jwt');
    const decodedUser: decodedUserProps = jwt ? jwtDecode(jwt) :
        { exp: 0, iat: 0, nickname: '', password: '', role: '', _id: '' };

    const [loading, setLoading] = useState(false);
    // Extract unique values
    const uniqueTitles = Array.from(new Set(familyCharges.map(charge => charge.title)));
    // Extract unique non-null categories
    const uniqueCategories = Array.from(
        new Set(familyCharges.map(charge => charge.category).filter(category => category !== null))
    ) as string[];
    const uniqueCurrencies = Array.from(new Set(familyCharges.map(charge => charge.currency)));

    const handleOpenModal = () => {
        setModalOpen(true)
    }

    const handleCloseModal = () => {
        setModalOpen(false)
        setChargeData({
            _id: '',
            title: '',
            category: '',
            currency: '',
            quantity: '',
            price: '',
        })
    }

    // Function to handle opening the modal in "add" mode
    const handleAddMode = () => {
        setChargeData({
            _id: '',
            title: '',
            category: '',
            currency: '',
            quantity: '',
            price: '',
        }); // Clear existing data
        setIsEditMode(false); // Set mode to "add"
        handleOpenModal(); // Open modal
    };

    // Function to handle opening the modal in "edit" mode
    const handleEditMode = (charge: any) => {
        setChargeData(charge); // Populate data for editing
        setIsEditMode(true); // Set mode to "edit"
        handleOpenModal(); // Open modal
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Convert currency to uppercase if it exists
        const updatedValue = name === 'currency' && value ? value.toUpperCase() : value;
        setChargeData(prevState => ({
            ...prevState,
            [name]: name === 'price' || name === 'quantity' ? Number(updatedValue) : updatedValue,
        }));
    };

    const handleChange1 = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFamilyData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };


    const fetchFamily = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${URL}/families/getinfo`, {
                headers: { Authorization: jwt && JSON?.parse(jwt) }
            })
            setFetchedFamily(res?.data[0])
        } catch (err) {
            Notify(LogError(err as AxiosError), 'err')
        } finally {
            setLoading(false)
        }
    }

    const fetchUser = async () => {
        try {
            const res = await axios.get(`${URL}/users/${decodedUser?._id}`, {
                headers: { Authorization: jwt && JSON?.parse(jwt) }
            })
            setFetchedUser(res?.data[0])
        } catch (err) {
            Notify(LogError(err as AxiosError), 'err')
        }
    }

    const fetchFamilyCharges = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${URL}/charges/getfamilycharges`, {
                headers: { Authorization: jwt ? JSON.parse(jwt) : undefined } // Handling jwt parsing
            })
            setFamilyCharges(res?.data)
        } catch (err) {
            Notify(LogError(err as AxiosError), 'err')
        } finally {
            setLoading(false)
        }
    }

    // Function to handle form submission
    const submit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        try {
            const updatedCateg = chargeData.category !== '' ? chargeData.category : undefined
            if (!isEditMode) {
                const res = await axios.post(`${URL}/charges`, { ...chargeData, _id: undefined, category: updatedCateg }, {
                    headers: { Authorization: jwt && JSON?.parse(jwt) }
                })
                Notify(`${res?.data?.title}'s added`, 'success')
            } else {
                const res = await axios.patch(`${URL}/charges/${chargeData?._id}`, chargeData, {
                    headers: { Authorization: jwt && JSON?.parse(jwt) }
                })
                Notify(`${res?.data?.title}'s modified`, 'success')
            }

            handleCloseModal()
            setRefreshKey(refreshKey + 1)
        } catch (err) {
            Notify(LogError(err as AxiosError), 'err')
        }
    }

    const submitFamily = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        try {
            if (buildFamily) {
                const res = await axios.post(`${URL}/families`, familyData, {
                    headers: { Authorization: jwt && JSON?.parse(jwt) }
                })
                res?.status === 201 && Notify(`New ${res?.data?.name} family built !`, 'success')
                navigate('/family')
            } else {
                const res = await axios.post(`${URL}/families/join`, { ...familyData, digit: undefined, includeMe: undefined, generatePassword: undefined }, {
                    headers: { Authorization: jwt && JSON?.parse(jwt) }
                })

                res?.status === 200 && Notify(` Welcome to ${res?.data?.name} family`, 'success')
                navigate('/family')
            }

            setRefreshKey(refreshKey + 1)
        } catch (err) {
            Notify(LogError(err as AxiosError), 'err')
        }
    }

    const deletion = async (charge: any) => {
        try {
            if (confirm(`Sure to delete this ?`)) {
                const res = await axios.delete(`${URL}/charges/${charge?._id}`, {
                    headers: { Authorization: jwt && JSON?.parse(jwt) }
                })
                Notify(`${res?.data?.title}'s deleted !`, 'success')
            } else {
                return
            }
            setRefreshKey(refreshKey + 1)
        } catch (err) {
            Notify(LogError(err as AxiosError), 'err')
        }
    }

    const switchToBuild = () => {
        setBuildFamily(!buildFamily)
        setFamilyData({
            name: '',
            password: '',
            includeMe: false,
            generatePassword: false,
            digit: 0,
        })
    }

    useEffect(() => {
        fetchFamily()
        fetchUser()
        fetchFamilyCharges()
    }, [refreshKey]);

    useEffect(() => {
        const handleResize = () => {
            setIsPhone(isPhoneScreen());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                    <div className="loading-spinner"></div>
                </div>
            )}
            <div className="f_wrapper relative bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-500 in-out-quad">
                {
                    fetchedUser?.individual &&
                    <div className="min-h-screen flex justify-center items-center p-4">
                        <div className="f_body flex flex-col justify-center items-center md:py-12 w-full max-w-lg p-5 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
                            <div className="f_hedr capitalize text-3xl mb-5">
                                <h1>{buildFamily ? 'build' : 'join'} family</h1>
                            </div>

                            {buildFamily ? (
                                <>
                                    <div className="mb-5 w-full flex flex-col items-center">
                                        <label className='r_lab text-xl mb-2' htmlFor="name">family name</label>
                                        <input className='r_inp bg-white text-black w-full sm:w-64' name='name'
                                            type="text" value={familyData?.name} onChange={handleChange1} required />
                                    </div>
                                    {familyData?.generatePassword ? (
                                        <div className="mb-5 w-full flex flex-col items-center">
                                            <label className='r_lab text-xl mb-2' htmlFor="passwordLength">password length (optional)</label>
                                            <input className='r_inp bg-white text-black w-full sm:w-64' name='digit'
                                                type="number" value={familyData?.digit} onChange={(e) => setFamilyData(prevState => ({
                                                    ...prevState,
                                                    digit: Number(e.target.value),
                                                }))} required />
                                        </div>
                                    ) : (
                                        <div className="mb-5 w-full flex flex-col items-center">
                                            <label className='r_lab text-xl mb-2' htmlFor="password">password</label>
                                            <input className='r_inp bg-white text-black w-full sm:w-64' name='password'
                                                type="text" value={familyData?.password} onChange={handleChange1} required />
                                        </div>
                                    )}
                                    <div className="mb-5 w-full flex items-center md:justify-center">
                                        <input type="checkbox" name="includeMe" checked={familyData.includeMe} onChange={handleChange1} className="mr-2" />
                                        <label className='r_lab text-xl' htmlFor="includeMe">includeMe</label>
                                    </div>

                                    <div className="mb-5 w-full flex items-center md:justify-center">
                                        <input type="checkbox" name="generatePassword" checked={familyData.generatePassword} onChange={handleChange1} className="mr-2" />
                                        <label className='r_lab text-xl' htmlFor="generatePassword">generate password</label>
                                    </div>
                                </>
                            ) : (<>
                                <div className="mb-5 w-full flex flex-col items-center">
                                    <label className='r_lab text-xl mb-2' htmlFor="name">family name</label>
                                    <input className='r_inp bg-white text-black w-full sm:w-64' name='name'
                                        type="text" value={familyData?.name} onChange={handleChange1} required />
                                </div>

                                <div className="mb-5 w-full flex flex-col items-center">
                                    <label className='r_lab text-xl mb-2' htmlFor="password">password</label>
                                    <input className='r_inp bg-white text-black w-full sm:w-64' name='password'
                                        type="text" value={familyData?.password} onChange={handleChange1} required />
                                </div>
                            </>)}

                            <a onClick={() => switchToBuild()} className='r_status cursor-pointer hover:underline mb-5'>
                                {buildFamily ? 'join' : 'build'} family
                            </a>

                            <div className="bg-success flex justify-center items-center">
                                <button onClick={submitFamily} className='r_btn capitalize'>{buildFamily ? 'build' : 'join'}</button>
                            </div>
                        </div>
                    </div>
                }

                {
                    !fetchedUser?.individual &&
                    <>
                        {/* header for large devices */}
                        <div className="f_header text-xl flex justify-around mb-10 max-sm:hidden">
                            <div onClick={() => navigate('/familyinfo')} className="f_hed_part flex items-center">
                                <h1 className='mr-2'>Name:</h1>
                                <h1>{fetchedFamily?.name}</h1>
                                <span className='ml-2 cursor-pointer'><TfiWrite /></span>
                            </div>
                            <div onClick={() => navigate('/familyinfo')} className="f_hed_part flex items-center">
                                <h1 className='mr-2'>Password:</h1>
                                <h1>{fetchedFamily?.password}</h1>
                                <span className='ml-2 cursor-pointer'><TfiWrite /></span>
                            </div>
                            <div onClick={() => navigate('/familymember')} className="f_hed_part flex items-center cursor-pointer">
                                <h1 className='mr-2'>Members:</h1>
                                <h1>{fetchedFamily?.members || 0}</h1>
                            </div>
                        </div>

                        {/* three line icon for small devices */}
                        <nav className="bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-500 ease-in-out p-4">
                            <div className="flex justify-between items-center">
                                <div className="sm:hidden">
                                    <button
                                        type="button"
                                        className="block hover:text-gray-200 focus:outline-none focus:text-gray-200"
                                        onClick={toggleMenu}
                                    >
                                        <svg
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className={`sm:hidden transition-all duration-500 ease-in-out transform ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                                } overflow-hidden`}
                            >
                                <div className="f_header text-xl flex flex-col sm:flex-row justify-around mb-10 sm:mb-0">
                                    <div
                                        onClick={() => navigate('/familyinfo')}
                                        className="f_hed_part flex items-center my-2 sm:my-0 cursor-pointer"
                                    >
                                        <h1 className="mr-2">Name:</h1>
                                        <h1>{fetchedFamily?.name}</h1>
                                        <span className="ml-2 cursor-pointer">
                                            <TfiWrite />
                                        </span>
                                    </div>
                                    <div
                                        onClick={() => navigate('/familyinfo')}
                                        className="f_hed_part flex items-center my-2 sm:my-0 cursor-pointer"
                                    >
                                        <h1 className="mr-2">Password:</h1>
                                        <h1>{fetchedFamily?.password}</h1>
                                        <span className="ml-2 cursor-pointer">
                                            <TfiWrite />
                                        </span>
                                    </div>
                                    <div
                                        onClick={() => navigate('/familymember')}
                                        className="f_hed_part flex items-center cursor-pointer my-2 sm:my-0"
                                    >
                                        <h1 className="mr-2">Members:</h1>
                                        <h1>{fetchedFamily?.members || 0}</h1>
                                    </div>
                                </div>
                            </div>
                        </nav>

                        <div className="container mx-auto p-4 max-lg:pb-24">

                            {
                                familyCharges?.length > 0 &&
                                <div className="f_header_btm flex justify-end">
                                    {isPhone && (
                                        <div className='mana flex items-center'>
                                            <button
                                                onClick={handleAddMode}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded sm:hidden flex items-center space-x-2"
                                            >
                                                <MdOutlinePlaylistAdd size={20} />
                                            </button>
                                        </div>
                                    )}
                                    {!isPhone && (
                                        <div className='mana flex items-center'>
                                            <button
                                                onClick={handleAddMode}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hidden sm:block"
                                            >
                                                Add New Charge
                                            </button>
                                        </div>
                                    )}
                                </div>
                            }
                            {
                                familyCharges?.length < 1 &&
                                <>
                                    <div className="flex items-center justify-center">

                                        <EmptyCharges message='Family charges are empty. Add some charges to proceed.' onAddChargesClick={() => handleAddMode()} />
                                    </div>
                                </>
                            }
                            {
                                familyCharges?.length > 0 &&
                                <div className="ch_header_btm2 pt-5 mb-5 flex justify-end lg:hidden">
                                    <h1 onClick={() => navigate('/reports')} className="capitalize cursor-pointer hover:underline text-xl">view reports</h1>
                                </div>
                            }

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {
                                    familyCharges?.map((charge: familyChargesProps, i: number) => {
                                        return (
                                            <>
                                                <div key={i} className="bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-500 in-out-quad shadow-lg rounded-lg overflow-hidden">
                                                    <div className="px-6 py-4">
                                                        <div className="font-bold text-xl mb-2">{charge?.title}</div>
                                                        <p className="text-base">
                                                            <strong>Category:</strong> {charge?.category ? charge?.category : 'Not Defined'}
                                                        </p>
                                                        <p className="text-base">
                                                            <strong>Quantity:</strong> {charge?.quantity}
                                                        </p>
                                                        <p className="text-base">
                                                            <strong>Price:</strong> {charge?.price}
                                                            <p className="text-base">
                                                                <strong>Currency:</strong> {charge?.currency}
                                                            </p>
                                                        </p>
                                                        <p className="text-base">
                                                            <strong>Family:</strong> {charge?.family?.name}
                                                        </p>
                                                        <p className="text-base">
                                                            <strong>User:</strong> {!charge?.individual && charge?.user?.individual ? 'Left the family' : charge?.user?.nickname}
                                                        </p>
                                                        <p className="text-base">
                                                            <strong>Created At:</strong> {charge?.createdAt}
                                                        </p>
                                                        <p className="text-base">
                                                            <strong>Updated At:</strong> {charge?.updatedAt}
                                                        </p>
                                                        <div className="flex justify-end mt-4">
                                                            <button onClick={() => handleEditMode(charge)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                                                                Edit
                                                            </button>
                                                            <button onClick={() => deletion(charge)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })
                                }

                            </div>
                        </div>
                    </>
                }

            </div >

            {/* Modal */}
            <div className={`fixed z-10 inset-0 overflow-y-auto transition-opacity duration-300 ${!modalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
                    {/* Background overlay */}
                    <div onClick={handleCloseModal} className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                    {/* Modal content */}
                    <div className="bg-white dark:bg-gray-800 text-black dark:text-white duration-500 in-out-quad rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full md:max-w-xl lg:max-w-2xl md:w-9/12 lg:w-10/12 xl:w-9/12 fill-available-width">
                        <div className="bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-500 in-out-quad px-4 py-3">
                            <h2 className="text-lg font-semibold capitalize" id="modal-title">{isEditMode ? 'modify charge' : 'add new charge'}</h2>
                        </div>
                        <div className="px-4 py-6 ">
                            {/* Title selection */}
                            <div className="mb-4">
                                <label htmlFor="title" className="block font-semibold mb-1">Title</label>
                                <select id="title" onChange={handleChange} value={chargeData?.title} name="title" className="w-full border-gray-300 bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-500 in-out-quad rounded-md focus:border-blue-500 focus:ring-blue-500">
                                    <option value="" disabled>Select a title</option>
                                    {
                                        uniqueTitles?.map((t: string, i: number) => {
                                            return (
                                                <>
                                                    <option className='px-1' key={i} value={t}>{t}</option>
                                                </>
                                            )
                                        })
                                    }
                                    {/* Add more options as needed */}
                                </select>
                                <div className="mt-2">
                                    <input name='title' onChange={handleChange} value={chargeData?.title} type="text" placeholder="Confirm new title" className="w-full px-1 text-black  rounded-md focus:border-blue-500 focus:ring-blue-500 py-1" />
                                </div>
                            </div>
                            {/* Category selection */}
                            <div className="mb-4">
                                <label htmlFor="category" className="block font-semibold mb-1">Category (Optional)</label>
                                <select
                                    id="category"
                                    value={chargeData.category || ''}
                                    name="category"
                                    onChange={handleChange}
                                    className="w-full border-gray-300 bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-500 in-out-quad rounded-md focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="" disabled>Select a category</option>
                                    {uniqueCategories.map((c: string, i: number) => (
                                        <option className='px-1' key={i} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                                <div className="mt-2">
                                    <input type="text" onChange={handleChange} value={chargeData?.category} name='category' placeholder="Confirm new category" className="w-full px-1 text-black border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 py-1" />
                                </div>
                            </div>
                            {/* Currency selection */}
                            <div className="mb-4">
                                <label htmlFor="currency" className="block font-semibold mb-1">Currency</label>
                                <select id="currency" onChange={handleChange} value={chargeData?.currency || ''} name="currency" className="w-full border-gray-300 bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-500 in-out-quad rounded-md focus:border-blue-500 focus:ring-blue-500">
                                    <option value="" disabled>Select a currency</option>
                                    {
                                        uniqueCurrencies?.map((c: string, i: number) => {
                                            return (
                                                <>
                                                    <option className='px-1' key={i} value={c}>{c}</option>
                                                </>
                                            )
                                        })
                                    }
                                    {/* Add more options as needed */}
                                </select>
                                <div className="mt-2">
                                    <input type="text" onChange={handleChange} value={chargeData?.currency} name='currency' placeholder="Confirm new currency" className="w-full px-1 text-black border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 py-1" />
                                </div>
                            </div>
                            {/* Quantity input */}
                            <div className="mb-4">
                                <label htmlFor="quantity" className="block font-semibold mb-1">Quantity</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    onChange={handleChange}
                                    value={chargeData?.quantity ? Number(chargeData.quantity) : ''} // Convert to number
                                    name="quantity"
                                    placeholder="Enter quantity"
                                    className="w-full px-1 text-black border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 py-1"
                                />
                            </div>

                            {/* Price input */}
                            <div className="mb-4">
                                <label htmlFor="price" className="block font-semibold mb-1">Price</label>
                                <input
                                    type="number"
                                    onChange={handleChange}
                                    id="price"
                                    value={chargeData?.price ? Number(chargeData.price) : ''} // Convert to number
                                    name="price"
                                    placeholder="Enter price"
                                    className="w-full px-1 text-black border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 py-1"
                                />
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-500 in-out-quad px-4 py-3 flex justify-end">
                            <button onClick={submit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Save
                            </button>
                            <button className="ml-2 bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded" onClick={handleCloseModal}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
