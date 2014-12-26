﻿namespace DataObjects
{
    using BusinessObjects;
    using DataObjects.Extensions;
    using Framework;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;

    public class UserStore : UserStore<User, Role, int, UserLogin, UserRole, UserClaim>
    {
        public UserStore()
            : this(new WealthEconomyContext())
        {
        }

        public UserStore(WealthEconomyContext context)
            : base(context)
        {
            AutoSaveChanges = false;
        }

        // TODO This doesn't hide base.Context, UserManager can still access to Store.Context?
        private new WealthEconomyContext Context { get { return (WealthEconomyContext)base.Context; } }

        DbSet<ResourcePool> ResourcePoolSet { get { return Context.Set<ResourcePool>(); } }
        DbSet<UserResourcePool> UserResourcePoolSet { get { return Context.Set<UserResourcePool>(); } }
        DbSet<UserElementCell> UserElementCellSet { get { return Context.Set<UserElementCell>(); } }

        public async Task SaveChangesAsync()
        {
            await Context.SaveChangesAsync();
        }

        /// <summary>
        /// Copies sample data of the source user to the target
        /// </summary>
        /// <param name="sourceUserId">Must be a persistent entity's Id</param>
        /// <param name="targetUser">Might a new or persistent entity</param>
        /// <returns></returns>
        public async Task CopySampleDataAsync(int sourceUserId, User targetUser)
        {
            Validations.ArgumentNullOrDefault(sourceUserId, "sourceUserId");
            Validations.ArgumentNullOrDefault(targetUser, "targetUser");

            // Resource pools
            var sourceUserResourcePools = await UserResourcePoolSet
                .Get(item => item.UserId == sourceUserId && item.ResourcePool.IsSample)
                .ToListAsync();

            foreach (var sourceUserResourcePool in sourceUserResourcePools)
            {
                var targetUserResourcePool = sourceUserResourcePool.ResourcePool
                    .AddUserResourcePool(targetUser, sourceUserResourcePool.ResourcePoolRate);

                // Indexes
                var sourceUserElementFieldIndexes = sourceUserResourcePool.UserElementFieldIndexSet;
                foreach (var sourceIndex in sourceUserElementFieldIndexes)
                    targetUserResourcePool.AddIndex(sourceIndex.ElementFieldIndex, sourceIndex.Rating);
            }

            // Element cells
            var sourceUserElementCells = await UserElementCellSet
                .Get(item => item.UserId == sourceUserId && item.ElementCell.ElementField.Element.ResourcePool.IsSample)
                .ToListAsync();

            // TODO Can this part be improved?
            foreach (var sourceUserElementCell in sourceUserElementCells)
            {
                var elementCell = sourceUserElementCell.ElementCell;
                var fieldType = (ElementFieldTypes)elementCell.ElementField.ElementFieldType;

                switch (fieldType)
                {
                    case ElementFieldTypes.Boolean:
                        if (sourceUserElementCell.BooleanValue.HasValue)
                            elementCell.SetValue(sourceUserElementCell.BooleanValue.Value, targetUser);
                        break;
                    case ElementFieldTypes.Integer:
                        if (sourceUserElementCell.IntegerValue.HasValue)
                            elementCell.SetValue(sourceUserElementCell.IntegerValue.Value, targetUser);
                        break;
                    case ElementFieldTypes.Decimal:
                        if (sourceUserElementCell.DecimalValue.HasValue)
                            elementCell.SetValue(sourceUserElementCell.DecimalValue.Value, targetUser);
                        break;
                    case ElementFieldTypes.DateTime:
                        if (sourceUserElementCell.DateTimeValue.HasValue)
                            elementCell.SetValue(sourceUserElementCell.DateTimeValue.Value, targetUser);
                        break;
                }
            }
        }

        public async Task ResetSampleDataAsync(int userId, int sampleUserId)
        {
            await DeleteSampleDataAsync(userId);

            var targetUser = await FindByIdAsync(userId);
            await CopySampleDataAsync(sampleUserId, targetUser);
        }

        public async Task DeleteSampleDataAsync(int userId)
        {
            var sampleResourcePools = await ResourcePoolSet
                .Get(item => item.IsSample)
                .Select(item => item.Id)
                .ToListAsync();

            foreach (var resourcePoolId in sampleResourcePools)
                await DeleteResourcePoolDataByIdAsync(userId, resourcePoolId);
        }

        public async Task DeleteResourcePoolDataAsync(int userId)
        {
            var resourcePoolData = await UserResourcePoolSet
                .Get(item => item.UserId == userId)
                .ToListAsync();

            UserResourcePoolSet.RemoveRange(resourcePoolData);
        }

        public async Task DeleteResourcePoolDataByIdAsync(int userId, int resourcePoolId)
        {
            var resourcePoolData = await UserResourcePoolSet
                .Get(item => item.UserId == userId
                    && item.ResourcePoolId == resourcePoolId)
                .ToListAsync();

            UserResourcePoolSet.RemoveRange(resourcePoolData);
        }
    }
}