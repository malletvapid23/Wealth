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
    using BusinessObjects.Metadata;

    [MetadataType(typeof(ResourcePoolOrganizationMetadata))]
    public partial class ResourcePoolOrganization : IEntity
    {
        public ResourcePoolOrganization()
        {
            this.UserResourcePoolOrganizationSet = new HashSet<UserResourcePoolOrganization>();
        }

        public int Id { get; set; }
        public int ResourcePoolId { get; set; }
        public int OrganizationId { get; set; }
        public System.DateTime CreatedOn { get; set; }
        public System.DateTime ModifiedOn { get; set; }
        public Nullable<System.DateTime> DeletedOn { get; set; }

        public virtual Organization Organization { get; set; }
        public virtual ResourcePool ResourcePool { get; set; }
        public virtual ICollection<UserResourcePoolOrganization> UserResourcePoolOrganizationSet { get; set; }
    }
}
