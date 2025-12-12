import { Company } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedCompanyData = unstable_cache(
    async (page: number = 1, limit: number = 10) => {
        try {
            await connectDB();

            const skip = (page - 1) * limit;

            const [companyData, totalCount] = await Promise.all([
                Company.find()
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                Company.countDocuments()
            ]);

            if (!companyData || companyData.length === 0) {
                console.warn('No company data found in database');
                return {
                    success: false,
                    data: [],
                    total: 0,
                    page: page,
                    totalPages: 0
                };
            }

            const totalPages = Math.ceil(totalCount / limit);

            return {
                success: true,
                data: companyData,
                total: totalCount,
                page: page,
                totalPages: totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            };
        } catch (error) {
            console.error('company data fetch error:', error);
            return {
                success: false,
                data: [],
                total: 0,
                page: page,
                totalPages: 0,
                error: error
            };
        }
    },
    ['company-data'],
    { revalidate: 10 }
);