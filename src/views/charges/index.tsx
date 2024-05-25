import './charges.css'
import { useState, useEffect } from 'react'
import { MdOutlinePlaylistAdd } from "react-icons/md"
import { useNavigate } from 'react-router-dom'
import { URL } from '../../config';
import axios, { AxiosError } from 'axios';
import { LogError, Notify } from '../../errorHandler/debug';
import EmptyCharges from '../../components/emptyChages';
import { familyChargesProps } from '../../aliases/alias';


// Utility function to check screen width
const isPhoneScreen = () => window.innerWidth < 640;

export const Charges = () => {
  const navigate = useNavigate()
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isPhone, setIsPhone] = useState(isPhoneScreen());
  const [familyCharges, setFamilyCharges] = useState<familyChargesProps[]>([]);
  const [chargeData, setChargeData] = useState({
    _id: '',
    title: '',
    category: '',
    currency: '',
    quantity: '',
    price: '',
  });
  const [loading, setLoading] = useState(false);
  // State variable to track whether modal is in "add" or "edit" mode
  const [isEditMode, setIsEditMode] = useState(false);
  const jwt: string | null = localStorage?.getItem('jwt');

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Convert currency to uppercase if it exists
    const updatedValue = name === 'currency' && value ? value.toUpperCase() : value;
    setChargeData(prevState => ({
      ...prevState,
      [name]: name === 'price' || name === 'quantity' ? Number(updatedValue) : updatedValue,
    }));
  };

  const fetchFamilyCharges = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${URL}/charges/getindividualcharges`, {
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
    console.log(chargeData);
    e.preventDefault()
    const updatedChargeData = {
      ...chargeData,
      _id: undefined,
      category: chargeData?.category === "" ? null : chargeData?.category
    }
    try {
      if (!isEditMode) {
        const res = await axios.post(`${URL}/charges`, updatedChargeData, {
          headers: { Authorization: jwt && JSON?.parse(jwt) }
        })
        Notify(`${res?.data?.title}'s added`, 'success')
      } else {
        const res = await axios.patch(`${URL}/charges/${chargeData?._id}`, updatedChargeData, {
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

  useEffect(() => {
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
      {
        familyCharges?.length < 1 && !loading ?
          <>
            <div className="h-screen flex justify-center items-center">
              <div>
                <div className="flex items-center justify-center">
                  <EmptyCharges message='Your charges are empty. Add some charges to proceed.' onAddChargesClick={() => handleAddMode()} />
                </div>
              </div>
            </div>

          </> :
          <div className="ch_wrapper bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-500 in-out-quad max-sm:mb-16">
            {/* Header */}
            <div className="ch_header text-xl flex flex-col sm:flex-row justify-between items-center mb-10">
              <div className="flex items-center justify-center sm:justify-start space-x-4">
                <h1 className="text-3xl capitalize text-center sm:text-left">your charges</h1>
                {isPhone && (
                  <button
                    onClick={handleAddMode}
                    className={`bg-blue-500 hover:bg-blue-700 ${familyCharges?.length < 1 && 'hidden'} text-white font-bold py-2 px-4 rounded sm:hidden flex items-center space-x-2`}
                  >
                    <MdOutlinePlaylistAdd size={20} />
                  </button>
                )}
              </div>
              {!isPhone && (
                <button
                  onClick={handleAddMode}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hidden sm:block"
                >
                  Add New Charge
                </button>
              )}
            </div>
            {/* {
          familyCharges?.length < 1 &&
          <>
            <div className="flex items-center justify-center">
              <EmptyCharges message='Your charges are empty. Add some charges to proceed.' onAddChargesClick={() => handleAddMode()} />
            </div>
          </>
        } */}

            <div className="container mx-auto p-4">
              {/* View Reports Button */}
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
          </div>
      }


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
