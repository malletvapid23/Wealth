﻿namespace BusinessObjects
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public class UserDistributionIndexRatingAverage
    {
        // TODO Get the parameters by constructor?
        
        [Display(Name = "Rating Count")]
        public int RatingCount { get; set; }

        [Display(Name = "Total Cost Index")]
        public decimal TotalCostIndexRating { get; set; }
        
        [Display(Name = "Knowledge Index")]
        public decimal KnowledgeIndexRating { get; set; }
        
        [Display(Name = "Quality Index")]
        public decimal QualityIndexRating { get; set; }
        
        [Display(Name = "Sector Index")]
        public decimal SectorIndexRating { get; set; }
        
        [Display(Name = "Employee Index")]
        public decimal EmployeeIndexRating { get; set; }
        
        [Display(Name = "Customer Index")]
        public decimal CustomerIndexRating { get; set; }
        
        [Display(Name = "Distance Index")]
        public decimal DistanceIndexRating { get; set; }

        [Display(Name="Total Index Rating")]
        public decimal TotalIndexRating
        {
            get
            {
                return TotalCostIndexRating
                    + KnowledgeIndexRating
                    + QualityIndexRating
                    + EmployeeIndexRating
                    + CustomerIndexRating
                    + SectorIndexRating;
                    // + DistanceIndexRating;
            }
        }

        public decimal TotalCostIndexWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;
                return TotalCostIndexRating / TotalIndexRating;
            }
        }

        public decimal KnowledgeIndexWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;
                return KnowledgeIndexRating / TotalIndexRating;
            }
        }

        public decimal QualityIndexWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;
                return QualityIndexRating / TotalIndexRating;
            }
        }

        public decimal EmployeeIndexWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;
                return EmployeeIndexRating / TotalIndexRating;
            }
        }

        public decimal CustomerIndexWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;
                return CustomerIndexRating / TotalIndexRating;
            }
        }

        public decimal SectorIndexWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;
                return SectorIndexRating / TotalIndexRating;
            }
        }

        public decimal DistanceIndexWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;
                return DistanceIndexRating / TotalIndexRating;
            }
        }
    }
}
