﻿
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DataObjects
{
    using BusinessObjects;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class WealthEconomyEntities : DbContext
    {
        public WealthEconomyEntities()
            : base("name=WealthEconomyEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<License> License { get; set; }
        public virtual DbSet<Organization> Organization { get; set; }
        public virtual DbSet<Sector> Sector { get; set; }
        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<UserLicenseRating> UserLicenseRating { get; set; }
        public virtual DbSet<UserSectorRating> UserSectorRating { get; set; }
        public virtual DbSet<ResourcePool> ResourcePool { get; set; }
        public virtual DbSet<ResourcePoolOrganization> ResourcePoolOrganization { get; set; }
        public virtual DbSet<UserResourcePool> UserResourcePool { get; set; }
        public virtual DbSet<UserResourcePoolOrganization> UserResourcePoolOrganization { get; set; }
        public virtual DbSet<A1> A1 { get; set; }
    }
}
