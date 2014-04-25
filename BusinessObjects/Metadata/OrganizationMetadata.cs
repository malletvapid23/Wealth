namespace BusinessObjects.Metadata
{
    using BusinessObjects.Metadata.Attributes;
    using System;
    using System.ComponentModel.DataAnnotations;

    [DefaultProperty("Name")]
    public class OrganizationMetadata
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object Id { get; set; }

        [Display(Name = "Sector")]
        public object SectorId { get; set; }
    
        [Display(Name = "Organization")]
        [Required]
        public object Name { get; set; }
    
        [Display(Name = "Production Cost")]
        public object ProductionCost { get; set; }
    
        [Display(Name = "Sales Price")]
        public object SalesPrice { get; set; }
    
        public object LicenseId { get; set; }

        [Display(Name = "Created On")]
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object CreatedOn { get; set; }

        [Display(Name = "Modified On")]
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object ModifiedOn { get; set; }

        [Display(Name = "Deleted On")]
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object DeletedOn { get; set; }
    }
}
