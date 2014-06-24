namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    [DefaultProperty("Id")]
    public class UserResourcePool : BaseEntity
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Index("IX_UserIdResourcePoolId", 1, IsUnique = true)]
        public int UserId { get; set; }

        [Index("IX_UserIdResourcePoolId", 2, IsUnique = true)]
        public int ResourcePoolId { get; set; }

        [Display(Name = "CMRP Rate")]
        public decimal ResourcePoolRate { get; set; }

        [Display(Name = "Total Cost Index")]
        public decimal TotalCostIndexRating { get; set; }

        [Display(Name = "Knowledge Index")]
        public decimal KnowledgeIndexRating { get; set; }

        [Display(Name = "Quality Index")]
        public decimal QualityIndexRating { get; set; }

        [Display(Name = "Sector Index")]
        public decimal SectorIndexRating { get; set; }

        [Display(Name = "Employee Satisfaction Index")]
        public decimal EmployeeSatisfactionIndexRating { get; set; }

        [Display(Name = "Customer Satisfaction Index")]
        public decimal CustomerSatisfactionIndexRating { get; set; }

        [Display(Name = "Distance Index")]
        public decimal DistanceIndexRating { get; set; }

        public virtual User User { get; set; }

        public virtual ResourcePool ResourcePool { get; set; }

        #region - General -

        public string Name
        {
            get { return string.Format("{0} - {1}", User.Email, ResourcePool.Name); }
        }

        // A bit weird navigation property.
        // To prevent this (or ideally), there needs to be a foreign key between this class and UserOrganization (UserResourcePoolId on UserOrganization).
        public IEnumerable<UserOrganization> UserOrganizationSet
        {
            get
            {
                return User
                    .UserOrganizationSet
                    .Where(item => item.Organization.Sector.ResourcePool == ResourcePool);
            }
        }

        public decimal ResourcePoolRatePercentage
        {
            get { return ResourcePoolRate / 100; }
        }

        public decimal ResourcePoolTax
        {
            get { return UserOrganizationSet.Sum(item => item.ResourcePoolTax); }
        }

        public decimal SalesPriceIncludingResourcePoolTax
        {
            get { return UserOrganizationSet.Sum(item => item.SalesPriceIncludingResourcePoolTax); }
        }

        public int NumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.NumberOfSales); }

        }
        
        public decimal TotalProductionCost
        {
            get { return UserOrganizationSet.Sum(item => item.TotalProductionCost); }
        }
        
        public decimal TotalSalesRevenue
        {
            get { return UserOrganizationSet.Sum(item => item.TotalSalesRevenue); }
        }

        public decimal TotalProfit
        {
            get { return UserOrganizationSet.Sum(item => item.TotalProfit); }
        }
        
        public decimal TotalResourcePoolTax
        {
            get { return UserOrganizationSet.Sum(item => item.TotalResourcePoolTax); }
        }
        
        public decimal TotalSalesRevenueIncludingResourcePoolTax
        {
            get { return UserOrganizationSet.Sum(item => item.TotalSalesRevenueIncludingResourcePoolTax); }
        }
        
        public decimal TotalResourcePoolIncome
        {
            get { return UserOrganizationSet.Sum(item => item.TotalResourcePoolIncome); }
        }
        
        public decimal TotalIncome
        {
            get { return UserOrganizationSet.Sum(item => item.TotalIncome); }
        }

        #endregion

        #region - Sector Index -

        public decimal SectorIndexShare
        {
            get { return TotalResourcePoolTax * ResourcePool.SectorIndexRatingWeightedAverage; }
        }

        public decimal SectorIndexValueWeightedAverageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.SectorIndexValueWeightedAverageWithNumberOfSales); }
        }

        public decimal SectorIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.SectorIndexIncome); }
        }

        #endregion

        #region - Knowledge Index -

        public decimal KnowledgeIndexShare
        {
            get { return TotalResourcePoolTax * ResourcePool.KnowledgeIndexRatingWeightedAverage; }
        }

        public decimal KnowledgeIndexValueWeightedAverageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.KnowledgeIndexValueWeightedAverageWithNumberOfSales); }
        }

        public decimal KnowledgeIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.KnowledgeIndexIncome); }
        }

        #endregion

        #region - Total Cost Index -

        public decimal TotalCostIndexShare
        {
            get { return TotalResourcePoolTax * ResourcePool.TotalCostIndexRatingWeightedAverage; }
        }
        
        public decimal TotalCostIndexValueWeightedAverageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.TotalCostIndexValueWeightedAverageWithNumberOfSales); }
        }
        
        public decimal TotalCostIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.TotalCostIndexIncome); }
        }

        #endregion

        #region - Quality Index -

        public decimal QualityIndexShare
        {
            get { return TotalResourcePoolTax * ResourcePool.QualityIndexRatingWeightedAverage; }
        }
        
        public decimal QualityIndexValueWeightedAverageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.QualityIndexValueWeightedAverageWithNumberOfSales); }
        }

        public decimal QualityIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.QualityIndexIncome); }
        }

        #endregion

        #region - Employee Satifaction Index -

        public decimal EmployeeSatisfactionIndexShare
        {
            get { return TotalResourcePoolTax * ResourcePool.EmployeeSatisfactionIndexRatingWeightedAverage; }
        }
        
        public decimal EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSales); }
        }

        public decimal EmployeeSatisfactionIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.EmployeeSatisfactionIndexIncome); }
        }

        #endregion

        #region - Customer Satifaction Index -
        
        public decimal CustomerSatisfactionIndexShare
        {
            get { return TotalResourcePoolTax * ResourcePool.CustomerSatisfactionIndexRatingWeightedAverage; }
        }
        
        public decimal CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSales); }
        }
        
        public decimal CustomerSatisfactionIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.CustomerSatisfactionIndexIncome); }
        }

        #endregion
    }
}
