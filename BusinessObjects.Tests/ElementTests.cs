﻿using forCrowd.WealthEconomy.BusinessObjects.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace forCrowd.WealthEconomy.BusinessObjects.Tests
{
    [TestClass]
    public class ElementTests
    {
        [TestMethod]
        public void NewElement_ShouldCreate()
        {
            var user = new User("User", "user@email.com");
            new Project(user, "CMRP")
                .AddElement("Element");
        }

        [TestMethod]
        public void AddField_SortOrder_ShouldCalculate()
        {
            // Arrange
            var user = new User("User", "user@email.com");
            var element = new Project(user, "CMRP")
                 .AddElement("Element");

            // Act
            var secondField = element.AddField("Second field after default Name field", ElementFieldDataType.String);

            // Assert
            Assert.IsTrue(secondField.SortOrder == 2);
        }
    }
}
