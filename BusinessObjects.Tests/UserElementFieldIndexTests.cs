﻿using forCrowd.WealthEconomy.BusinessObjects.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace forCrowd.WealthEconomy.BusinessObjects.Tests
{
    [TestClass]
    public class UserElementFieldIndexTests
    {
        [TestMethod]
        public void NewUserElementFieldIndex_ShouldCreate()
        {
            var user = new User("User", "user@email.com");

            var project = new Project(user, "CMRP");
            
            project
                .AddElement("Element")
                .AddField("Field", ElementFieldDataType.Decimal, true)
                .EnableIndex()
                .AddUserRating(0);
        }
    }
}
