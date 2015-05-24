﻿namespace DataObjects
{
    using BusinessObjects;
    using DataObjects.Extensions;
    using Microsoft.AspNet.Identity.EntityFramework;
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
        DbSet<UserElementFieldIndex> UserElementFieldIndexSet { get { return Context.Set<UserElementFieldIndex>(); } }
        DbSet<UserElementCell> UserElementCellSet { get { return Context.Set<UserElementCell>(); } }

        public async Task SaveChangesAsync()
        {
            await Context.SaveChangesAsync();
        }

        public async Task DeleteUserResourcePool(int resourcePoolId)
        {
            var entity = await UserResourcePoolSet.SingleOrDefaultAsync(item => item.ResourcePoolId == resourcePoolId);

            if (entity == null)
                return;

            UserResourcePoolSet.Remove(entity);
        }

        public async Task DeleteUserElementFieldIndex(int elementFieldIndexId)
        {
            var entity = await UserElementFieldIndexSet.SingleOrDefaultAsync(item => item.ElementFieldIndexId == elementFieldIndexId);

            if (entity == null)
                return;

            UserElementFieldIndexSet.Remove(entity);
        }

        public async Task DeleteUserElementCell(int elementCellId)
        {
            var entity = await UserElementCellSet.SingleOrDefaultAsync(item => item.ElementCellId == elementCellId);

            if (entity == null)
                return;

            UserElementCellSet.Remove(entity);
        }
    }
}