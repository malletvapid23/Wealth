﻿namespace BusinessObjects
{
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    public partial class Organization
    {
        /// <summary>
        /// a.k.a. Markup
        /// </summary>
        public decimal Profit
        {
            get { return SalesPrice - ProductionCost; }
        }

        public decimal GetAverageQualityRating()
        {
            return GetAverageQualityRating(0);
        }

        public decimal GetAverageQualityRating(int userId)
        {
            var ratings = userId > 0
                ? UserOrganizationSet.Where(rating => rating.UserId == userId)
                : UserOrganizationSet;

            if (!ratings.Any())
                return 0;

            return ratings.Average(rating => rating.QualityRating);
        }

        public decimal GetAverageEmployeeSatisfactionRating()
        {
            return GetAverageEmployeeSatisfactionRating(0);
        }

        public decimal GetAverageEmployeeSatisfactionRating(int userId)
        {
            var ratings = userId > 0
                ? UserOrganizationSet.Where(rating => rating.UserId == userId)
                : UserOrganizationSet;

            if (!ratings.Any())
                return 0;

            return ratings.Average(rating => rating.EmployeeSatisfactionRating);
        }

        public decimal GetAverageCustomerSatisfactionRating()
        {
            return GetAverageCustomerSatisfactionRating(0);
        }

        public decimal GetAverageCustomerSatisfactionRating(int userId)
        {
            var ratings = userId > 0
                ? UserOrganizationSet.Where(rating => rating.UserId == userId)
                : UserOrganizationSet;

            if (!ratings.Any())
                return 0;

            return ratings.Average(rating => rating.CustomerSatisfactionRating);
        }

        /// <summary>
        /// a.k.a Markup percentage
        /// </summary>
        [Display(Name = "Profit Percentage")]
        public decimal ProfitPercentage
        {
            get
            {
                if (ProductionCost == 0)
                    return 0;

                return Profit / ProductionCost;
            }
        }

        [Display(Name = "Profit Margin")]
        public decimal ProfitMargin
        {
            get
            {
                if (SalesPrice == 0)
                    return 0;

                return Profit / SalesPrice;
            }
        }
    }
}
