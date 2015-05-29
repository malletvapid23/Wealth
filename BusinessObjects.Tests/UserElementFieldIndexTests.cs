﻿using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessObjects.Tests
{
    [TestClass]
    public class UserElementFieldIndexTests
    {
        [TestMethod]
        public void NewUserElementFieldIndex_ShouldCreate()
        {
            var user = new User("Email");
            
            var resourcePool = new ResourcePool(user, "CMRP");
            
            var newIndex = resourcePool
                .AddElement("Element")
                .AddField("Field", ElementFieldTypes.Boolean, true)
                .AddIndex(RatingSortType.HighestToLowest)
                .AddUserRating(user, 0);
        }
    }
}
