import './familyMember.css'
import { useState, useEffect } from 'react'
import { LogError, Notify } from '../../errorHandler/debug';
import axios, { AxiosError } from 'axios';
import { URL } from '../../config';
import { fetchedFamilyProps } from '../../aliases/alias';

export const FamilyMember = () => {
    const [fetchedFamily, setFetchedFamily] = useState<fetchedFamilyProps | null>(null);
    const jwt: string | null = localStorage?.getItem('jwt');

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

    useEffect(() => {
        fetchFamily()
    }, []);

    return (
        <>
            <div className="fm_wrapper bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-500 ease-in-out p-4">
                <div className="fm_header flex justify-center text-2xl sm:text-3xl mb-5 capitalize">
                    <h1>family members:</h1>
                    <h1 className="ml-2">2</h1>
                </div>

                <div className="fm_body bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-500 ease-in-out overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col" className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                            {
                                fetchedFamily?.users?.map((user, index) => {
                                    return (
                                        <>
                                            <tr key={index}>
                                                <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                    {user?.nickname}
                                                </td>
                                                <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                    Active
                                                </td>
                                                <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                    user
                                                </td>
                                            </tr>
                                        </>
                                    )
                                }
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
