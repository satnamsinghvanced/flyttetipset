import { getCachedCompanyData } from '@/services/data/company'
import React from 'react'
import CompanyPagination from './companyPagination';
import AgentCard from '../cards/agentCard';


const CompanyContent = async ({ cp }: any) => {

    const com_per_page = 8;
    const companiesResponse = await getCachedCompanyData(cp, com_per_page);
    const companies = await JSON.parse(JSON.stringify(companiesResponse));
    const com_data = companies?.success ? companies.data : [];
    const com_total_items = companies?.total || 0;
    const com_total_pages = companies?.totalPages || 0;

    return (
        <div className="my-8 ">
            <div className="flex flex-col gap-6">
                {com_data.map((company: any) => (

                    <AgentCard isAgent={true} key={company._id} {...company} />
                ))}

                {com_data.length === 0 && (
                    <div className="p-0">
                        {/* <p className="text-gray-500">No companies found.</p> */}
                    </div>
                )}

            </div>

            {com_total_pages > 1 && (
                <div className="flex justify-center items-center w-full mt-6">
                    <CompanyPagination
                        com_current_page={cp}
                        com_total_pages={com_total_pages}
                        com_total_items={com_total_items}
                        com_items_per_page={com_per_page}
                    />
                </div>
            )}
        </div>
    )
}

export default CompanyContent