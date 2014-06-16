namespace BusinessObjects
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using BusinessObjects.Metadata;
    using System.ComponentModel.DataAnnotations.Schema;

    [MetadataType(typeof(ResourcePoolMetadata))]
    public partial class ResourcePool : BaseEntity
    {
        public ResourcePool()
        {
            this.LicenseSet = new HashSet<License>();
            this.OrganizationSet = new HashSet<Organization>();
            this.SectorSet = new HashSet<Sector>();
            this.UserResourcePoolSet = new HashSet<UserResourcePool>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsSample { get; set; }

        public virtual ICollection<Sector> SectorSet { get; set; }
        public virtual ICollection<License> LicenseSet { get; set; }
        public virtual ICollection<UserResourcePool> UserResourcePoolSet { get; set; }

        /* */

        public decimal SectorRatingAverage
        {
            get { return SectorSet.Sum(sector => sector.GetAverageRating()); }
        }

        public decimal LicenseRatingAverage
        {
            get { return LicenseSet.Sum(license => license.GetAverageRating()); }
        }

        public decimal QualityRatingAverage
        {
            get { return OrganizationSet.Sum(item => item.GetAverageQualityRating()); }
        }

        public decimal EmployeeSatisfactionRatingAverage
        {
            get { return OrganizationSet.Sum(item => item.GetAverageEmployeeSatisfactionRating()); }
        }

        public decimal CustomerSatisfactionRatingAverage
        {
            get { return OrganizationSet.Sum(organization => organization.GetAverageCustomerSatisfactionRating()); }
        }

        public decimal TotalCostIndexRatingAverage
        {
            get
            {
                if (!UserResourcePoolSet.Any())
                    return 0;

                return UserResourcePoolSet.Average(item => item.TotalCostIndexRating);
            }
        }

        public decimal KnowledgeIndexRatingAverage
        {
            get
            {
                if (!UserResourcePoolSet.Any())
                    return 0;

                return UserResourcePoolSet.Average(item => item.KnowledgeIndexRating);
            }
        }

        public decimal QualityIndexRatingAverage
        {
            get
            {
                if (!UserResourcePoolSet.Any())
                    return 0;

                return UserResourcePoolSet.Average(item => item.QualityIndexRating);
            }
        }

        public decimal SectorIndexRatingAverage
        {
            get
            {
                if (!UserResourcePoolSet.Any())
                    return 0;

                return UserResourcePoolSet.Average(item => item.SectorIndexRating);
            }
        }

        public decimal EmployeeSatisfactionIndexRatingAverage
        {
            get
            {
                if (!UserResourcePoolSet.Any())
                    return 0;

                return UserResourcePoolSet.Average(item => item.EmployeeSatisfactionIndexRating);
            }
        }

        public decimal CustomerSatisfactionIndexRatingAverage
        {
            get
            {
                if (!UserResourcePoolSet.Any())
                    return 0;

                return UserResourcePoolSet.Average(item => item.CustomerSatisfactionIndexRating);
            }
        }

        public decimal DistanceIndexRatingAverage
        {
            get
            {
                if (!UserResourcePoolSet.Any())
                    return 0;

                return UserResourcePoolSet.Average(item => item.DistanceIndexRating);
            }
        }

        public decimal TotalIndexRating
        {
            get
            {
                return TotalCostIndexRatingAverage
                    + KnowledgeIndexRatingAverage
                    + QualityIndexRatingAverage
                    + SectorIndexRatingAverage
                    + EmployeeSatisfactionIndexRatingAverage
                    + CustomerSatisfactionIndexRatingAverage
                    + DistanceIndexRatingAverage;
            }
        }

        public IEnumerable<Organization> OrganizationSet
        {
            get { return SectorSet.SelectMany(sector => sector.OrganizationSet); }
            private set { }
        }

        public decimal ProductionCost
        {
            get
            {
                if (!OrganizationSet.Any())
                    return 0;
                return OrganizationSet.Sum(organization => organization.ProductionCost);
            }
            private set { }
        }

        public decimal SalesPrice
        {
            get
            {
                if (!OrganizationSet.Any())
                    return 0;
                return OrganizationSet.Sum(organization => organization.SalesPrice);
            }
            private set { }
        }

        public decimal Profit
        {
            get
            {
                if (!OrganizationSet.Any())
                    return 0;
                return OrganizationSet.Sum(organization => organization.Profit);
            }
            private set { }
        }

        public decimal ProfitPercentage
        {
            get
            {
                if (!OrganizationSet.Any())
                    return 0;
                return OrganizationSet.Average(organization => organization.ProfitPercentage);
            }
            private set { }
        }

        public decimal ProfitMargin
        {
            get
            {
                if (!OrganizationSet.Any())
                    return 0;
                return OrganizationSet.Average(organization => organization.ProfitMargin);
            }
            private set { }
        }

        //public decimal ResourcePoolTax
        //{
        //    get { return OrganizationSet.Sum(organization => organization.ResourcePoolTax); }
        //}

        //public decimal SalesPriceIncludingResourcePoolTax
        //{
        //    get { return OrganizationSet.Sum(organization => organization.SalesPriceIncludingResourcePoolTax); }
        //}

    }
}
