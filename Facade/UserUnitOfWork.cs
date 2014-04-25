﻿namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using System;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;

    public partial class UserUnitOfWork
    {
        LicenseRepository licenseRepository;
        ResourcePoolRepository resourcePoolRepository;
        SectorRepository sectorRepository;
        UserLicenseRatingRepository userLicenseRatingRepository;
        UserOrganizationRepository userOrganizationRepository;
        UserResourcePoolRepository userResourcePoolRepository;
        UserSectorRatingRepository userSectorRatingRepository;

        LicenseRepository LicenseRepository
        {
            get { return licenseRepository ?? (licenseRepository = new LicenseRepository(Context)); }
        }

        ResourcePoolRepository ResourcePoolRepository
        {
            get { return resourcePoolRepository ?? (resourcePoolRepository = new ResourcePoolRepository(Context)); }
        }

        SectorRepository SectorRepository
        {
            get { return sectorRepository ?? (sectorRepository = new SectorRepository(Context)); }
        }

        UserLicenseRatingRepository UserLicenseRatingRepository
        {
            get { return userLicenseRatingRepository ?? (userLicenseRatingRepository = new UserLicenseRatingRepository(Context)); }
        }

        UserOrganizationRepository UserOrganizationRepository
        {
            get { return userOrganizationRepository ?? (userOrganizationRepository = new UserOrganizationRepository(Context)); }
        }

        UserResourcePoolRepository UserResourcePoolRepository
        {
            get { return userResourcePoolRepository ?? (userResourcePoolRepository = new UserResourcePoolRepository(Context)); }
        }

        UserSectorRatingRepository UserSectorRatingRepository
        {
            get { return userSectorRatingRepository ?? (userSectorRatingRepository = new UserSectorRatingRepository(Context)); }
        }

        public override void Insert(User user)
        {
            // TODO Validation?
            base.Insert(user);

            // Add samples
            // Sample user resource pool
            // TODO Static Id 8 ?!
            var sampleResourcePools = ResourcePoolRepository
                .AllLive
                .Include(resourcePool => resourcePool.SectorSet)
                .Include(resourcePool => resourcePool.LicenseSet)
                .Include(resourcePool => resourcePool.OrganizationSet)
                .Where(resourcePool => resourcePool.Id <= 8);

            foreach (var resourcePool in sampleResourcePools)
            {
                var userResourcePool = new UserResourcePool()
                {
                    User = user,
                    ResourcePool = resourcePool,
                    ResourcePoolRate = 0,
                    TotalCostIndexRating = resourcePool.Id == 1 ? 100 : 0,
                    KnowledgeIndexRating = resourcePool.Id == 2 ? 100 : 0,
                    QualityIndexRating = resourcePool.Id == 3 ? 100 : 0,
                    SectorIndexRating = resourcePool.Id == 4 ? 100 : 0,
                    EmployeeSatisfactionIndexRating = resourcePool.Id == 5 ? 100 : 0,
                    CustomerSatisfactionIndexRating = resourcePool.Id == 6 ? 100 : 0,
                    DistanceIndexRating = resourcePool.Id == 7 ? 100 : 0,
                };

                UserResourcePoolRepository.Insert(userResourcePool);

                // Sample sector ratings
                var sampleSectors = resourcePool.SectorSet;
                foreach (var sector in sampleSectors)
                {
                    var sectorRating = new UserSectorRating()
                    {
                        User = user,
                        Sector = sector,
                        Rating = 0
                    };
                    UserSectorRatingRepository.Insert(sectorRating);
                }

                // Sample license ratings
                var sampleLicenses = resourcePool.LicenseSet;
                foreach (var license in sampleLicenses)
                {
                    var licenceRating = new UserLicenseRating()
                    {
                        User = user,
                        License = license,
                        Rating = 0
                    };
                    UserLicenseRatingRepository.Insert(licenceRating);
                }

                // Sample resource pool organizations
                var sampleOrganizations = resourcePool.OrganizationSet;
                foreach (var organization in sampleOrganizations)
                {
                    var userOrganization = new UserOrganization()
                    {
                        User = user,
                        Organization = organization,
                        NumberOfSales = 0,
                        // TODO Handle these sample ratings nicely ?!
                        QualityRating = organization.Id == 6 ? 80 : organization.Id == 7 ? 20 : 0,
                        CustomerSatisfactionRating = organization.Id == 8 ? 80 : organization.Id == 9 ? 20 : 0,
                        EmployeeSatisfactionRating = organization.Id == 10 ? 80 : organization.Id == 11 ? 20 : 0,
                    };

                    UserOrganizationRepository.Insert(userOrganization);
                }
            }
        }

        public override void Delete(params object[] id)
        {
            var user = Find(id);

            UserLicenseRatingRepository.DeleteRange(user.UserLicenseRatingSet);
            UserOrganizationRepository.DeleteRange(user.UserOrganizationSet);
            UserResourcePoolRepository.DeleteRange(user.UserResourcePoolSet);
            UserSectorRatingRepository.DeleteRange(user.UserSectorRatingSet);

            base.Delete(id);
        }

        public async Task<bool> AuthenticateUser(int userId, string password)
        {
            var selectedUser = await FindAsync(userId);

            if (selectedUser == null)
                return false;

            if (string.IsNullOrWhiteSpace(password))
                return false;

            if (selectedUser.Password != password)
                return false;

            return true;
        }

        public User AuthenticateUser2(string email, string password)
        {
            return AllLive.SingleOrDefault(user =>
                user.Email == email &&
                user.Password == password);
        }
    }
}