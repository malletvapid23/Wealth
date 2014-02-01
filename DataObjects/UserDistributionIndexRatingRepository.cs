﻿namespace DataObjects
{
    using BusinessObjects;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;

    public partial class UserDistributionIndexRatingRepository
    {
        public async Task<UserDistributionIndexRatingAverage> GetAverageAsync()
        {
            // Prepare the query
            var query = AllLive;

            // Result object
            var result = new UserDistributionIndexRatingAverage();

            // If there is any record, fill
            if (query.Count() > 0)
            {
                result.RatingCount = query.Count();
                result.TotalCostIndexRating = await query.AverageAsync(rating => rating.TotalCostIndexRating);
                result.KnowledgeIndexRating = await query.AverageAsync(rating => rating.KnowledgeIndexRating);
                result.QualityIndexRating = await query.AverageAsync(rating => rating.QualityIndexRating);
                result.SectorIndexRating = await query.AverageAsync(rating => rating.SectorIndexRating);
                result.EmployeeSatisfactionIndexRating = await query.AverageAsync(rating => rating.EmployeeSatisfactionIndexRating);
                result.CustomerSatisfactionIndexRating = await query.AverageAsync(rating => rating.CustomerSatisfactionIndexRating);
                result.DistanceIndexRating = await query.AverageAsync(rating => rating.DistanceIndexRating);
            }

            // Return
            return result;
        }
    }
}
