﻿using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using forCrowd.WealthEconomy.Framework.Exceptions;

namespace forCrowd.WealthEconomy.BusinessObjects.Tests
{
    [TestClass]
    public class ElementFieldIndexTests
    {
        [TestMethod]
        public void NewElementFieldIndex_ShouldCreate()
        {
            var user = new User("User");
            new ResourcePool(user, "CMRP")
                .AddElement("Element")
                .AddField("Field", ElementFieldDataType.Boolean, true)
                .EnableIndex(ElementFieldIndexSortType.HighestToLowest);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullOrDefaultException))]
        public void NewElementFieldIndexWithInvalidConstructor_Exception()
        {
            var user = new User("User");
            new ResourcePool(user, "CMRP")
                .AddElement("Element")
                .AddField("Field", ElementFieldDataType.String)
                .EnableIndex(ElementFieldIndexSortType.HighestToLowest);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void NewElementFieldIndexOnStringType_Exception()
        {
            var user = new User("User");
            new ResourcePool(user, "CMRP")
                .AddElement("Element")
                .AddField("Field", ElementFieldDataType.String)
                .EnableIndex(ElementFieldIndexSortType.HighestToLowest);
        }
    }
}
