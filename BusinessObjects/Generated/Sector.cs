//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace BusinessObjects
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    
    [MetadataType(typeof(BusinessObjects.Metadata.SectorMetadata))]
    public partial class Sector : IEntity<byte>
    {
        public Sector()
        {
            this.Organization = new HashSet<Organization>();
            this.UserSectorRating = new HashSet<UserSectorRating>();
        }
    
        public byte Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public System.DateTime CreatedOn { get; set; }
        public System.DateTime ModifiedOn { get; set; }
        public Nullable<System.DateTime> DeletedOn { get; set; }
    
        public virtual ICollection<Organization> Organization { get; set; }
        public virtual ICollection<UserSectorRating> UserSectorRating { get; set; }
    }
}
