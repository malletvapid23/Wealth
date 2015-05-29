﻿namespace forCrowd.WealthEconomy.DataObjects
{
    using forCrowd.WealthEconomy.BusinessObjects;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System.Threading.Tasks;

    public class RoleStore : RoleStore<Role, int, UserRole>
    {
        public RoleStore()
            : base(new WealthEconomyContext())
        { }

        public RoleStore(WealthEconomyContext context)
            : base(context)
        { }
    }
}