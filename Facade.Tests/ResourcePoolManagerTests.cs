﻿namespace forCrowd.WealthEconomy.Facade.Tests
{
    using forCrowd.WealthEconomy.Facade;
    using forCrowd.WealthEconomy.Framework;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Linq;
    using System.Threading.Tasks;

    [TestClass]
    public class ResourcePoolManagerTests
    {
        /// <summary>
        /// TODO: This is just a temp test with a specific db data, ignore it
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task UpdateComputedFields()
        {
            Security.LoginAs(1, "Administrator");

            using (var manager = new ResourcePoolManager())
            {
                var list = manager.AllLive.Where(item => item.Id == 29).AsEnumerable();

                await manager.UpdateComputedFieldsAsync(list.First().Id);
            }
        }

        /// <summary>
        /// TODO: This is just a temp test with a specific db data, ignore it
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task UpdateComputedFields2()
        {
            Security.LoginAs(3, "Regular");

            using (var manager = new ResourcePoolManager())
            {
                var list = manager.AllLive.Where(item => item.Id == 17).AsEnumerable();

                await manager.UpdateComputedFieldsAsync(list.First().Id);
            }
        }
    }
}
