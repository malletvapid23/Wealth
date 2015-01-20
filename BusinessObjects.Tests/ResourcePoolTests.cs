﻿using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessObjects.Tests
{
    [TestClass]
    public class ResourcePoolTests
    {
        [TestMethod]
        public void NewResourcePool_ShouldCreate()
        {
            new ResourcePool("Default");
        }

        [TestMethod]
        public void IncreaseMultiplier_ShouldPass()
        {
            // Arrange
            var user = new User("User");
            var resourcePool = new ResourcePool("CMRP");
            var element = resourcePool.AddElement("Element");
            var multiplierField = element.AddField("Multiplier", ElementFieldTypes.Multiplier);
            var element1 = element.AddItem("Element 1");
            element1.AddCell(element.MultiplierField).SetValue(1M, user);
            var element2 = element.AddItem("Element 2");
            element2.AddCell(element.MultiplierField).SetValue(10M, user);

            // Act
            resourcePool.IncreaseMultiplier(user);

            // Assert
            Assert.IsTrue(element1.MultiplierValue(user) == 2M);
            Assert.IsTrue(element2.MultiplierValue(user) == 11M);
        }

        [TestMethod]
        public void DecreaseMultiplier_ShouldPass()
        {
            // Arrange
            var user = new User("User");
            var resourcePool = new ResourcePool("CMRP");
            var element = resourcePool.AddElement("Element");
            var multiplierField = element.AddField("Multiplier", ElementFieldTypes.Multiplier);
            var element1 = element.AddItem("Element 1");
            element1.AddCell(element.MultiplierField).SetValue(5M, user);
            var element2 = element.AddItem("Element 2");
            element2.AddCell(element.MultiplierField).SetValue(10M, user);

            // Act
            resourcePool.DecreaseMultiplier(user);

            // Assert
            Assert.IsTrue(element1.MultiplierValue(user) == 4M);
            Assert.IsTrue(element2.MultiplierValue(user) == 9M);
        }

        [TestMethod]
        public void ResetMultiplier_ShouldPass()
        {
            // Arrange
            var user = new User("User");
            var resourcePool = new ResourcePool("CMRP");
            var element = resourcePool.AddElement("Element");
            var multiplierField = element.AddField("Multiplier", ElementFieldTypes.Multiplier);
            var element1 = element.AddItem("Element 1");
            element1.AddCell(element.MultiplierField).SetValue(5M, user);
            var element2 = element.AddItem("Element 2");
            element2.AddCell(element.MultiplierField).SetValue(10M, user);

            // Act
            resourcePool.ResetMultiplier(user);

            // Assert
            Assert.IsTrue(element1.MultiplierValue(user) == 0M);
            Assert.IsTrue(element2.MultiplierValue(user) == 0M);
        }

        [TestMethod]
        public void TwoElementItems_ImportanceIndex_SingleUser_InitialValue()
        {
            // Arrange + act
            var user = new User("Email");

            var resourcePool = new ResourcePool("Default");
            //resourcePool.InitialValue = 100;

            var organization = resourcePool.AddElement("Organization");
            
            var importanceField = resourcePool.MainElement.AddField("Importance Field", ElementFieldTypes.Decimal, false);

            var importanceFieldIndex = importanceField.AddIndex("Importance Index", RatingSortType.HighestToLowest);
            importanceFieldIndex.AddUserRating(user, 100);

            var organization1 = organization.AddItem("Organization 1");
            organization1.AddCell(importanceField).SetValue(75M, user);

            var organization2 = organization.AddItem("Organization 2");
            organization2.AddCell(importanceField).SetValue(25M, user);
            
            // Assert
            Assert.IsTrue(resourcePool.ResourcePoolAddition() == 0);
            Assert.IsTrue(resourcePool.ResourcePoolValueIncludingAddition() == 0);
            //Assert.IsTrue(resourcePool.TotalResourcePoolValue(user) == 400);
            Assert.IsTrue(resourcePool.TotalResourcePoolAddition(user) == 0);
            Assert.IsTrue(resourcePool.TotalResourcePoolValueIncludingAddition(user) == 0);
            Assert.IsTrue(resourcePool.TotalResourcePoolValue(user) == 100);
            Assert.IsTrue(resourcePool.TotalIncome(user) == 100);

            Assert.IsTrue(organization.IndexRatingAverage() == 100);

            Assert.IsTrue(importanceFieldIndex.IndexRatingCount() == 1);
            Assert.IsTrue(importanceFieldIndex.IndexRatingAverage() == 100);
            Assert.IsTrue(importanceFieldIndex.IndexRatingPercentage() == 1);
            Assert.IsTrue(importanceFieldIndex.IndexShare(user) == 100);

            Assert.IsTrue(organization1.ValueCount() == 1);
            Assert.IsTrue(organization1.Value() == 75);
            Assert.IsTrue(organization1.ResourcePoolValue() == 0);
            Assert.IsTrue(organization1.ResourcePoolAddition() == 0);
            Assert.IsTrue(organization1.ResourcePoolValueIncludingAddition() == 0);
            Assert.IsTrue(organization1.TotalResourcePoolValue(user) == 0);
            Assert.IsTrue(organization1.TotalResourcePoolAddition(user) == 0);
            Assert.IsTrue(organization1.TotalResourcePoolValueIncludingAddition(user) == 0);
            Assert.IsTrue(organization1.ElementFieldIndexIncome(user) == 75);
            Assert.IsTrue(organization1.TotalIncome(user) == 75);

            Assert.IsTrue(organization2.ValueCount() == 1);
            Assert.IsTrue(organization2.Value() == 25);
            Assert.IsTrue(organization2.ResourcePoolValue() == 0);
            Assert.IsTrue(organization2.ResourcePoolAddition() == 0);
            Assert.IsTrue(organization2.ResourcePoolValueIncludingAddition() == 0);
            Assert.IsTrue(organization2.TotalResourcePoolValue(user) == 0);
            Assert.IsTrue(organization2.TotalResourcePoolAddition(user) == 0);
            Assert.IsTrue(organization2.TotalResourcePoolValueIncludingAddition(user) == 0);
            Assert.IsTrue(organization2.ElementFieldIndexIncome(user) == 25);
            Assert.IsTrue(organization2.TotalIncome(user) == 25);

            // Arrange + act 2
            // TODO Since creating the whole scenario needs too much configuration,
            // it contains two different tests, try to separate them
            importanceFieldIndex.RatingSortType = (byte)RatingSortType.LowestToHighest;

            // Assert 2
            Assert.IsTrue(organization1.ValueCount() == 1);
            Assert.IsTrue(organization1.Value() == 75);
            Assert.IsTrue(organization1.ResourcePoolValue() == 0);
            Assert.IsTrue(organization1.ResourcePoolAddition() == 0);
            Assert.IsTrue(organization1.ResourcePoolValueIncludingAddition() == 0);
            Assert.IsTrue(organization1.TotalResourcePoolValue(user) == 0);
            Assert.IsTrue(organization1.TotalResourcePoolAddition(user) == 0);
            Assert.IsTrue(organization1.TotalResourcePoolValueIncludingAddition(user) == 0);
            Assert.IsTrue(organization1.ElementFieldIndexIncome(user) == 25);
            Assert.IsTrue(organization1.TotalIncome(user) == 25);

            Assert.IsTrue(organization2.ValueCount() == 1);
            Assert.IsTrue(organization2.Value() == 25);
            Assert.IsTrue(organization2.ResourcePoolValue() == 0);
            Assert.IsTrue(organization2.ResourcePoolAddition() == 0);
            Assert.IsTrue(organization2.ResourcePoolValueIncludingAddition() == 0);
            Assert.IsTrue(organization2.TotalResourcePoolValue(user) == 0);
            Assert.IsTrue(organization2.TotalResourcePoolAddition(user) == 0);
            Assert.IsTrue(organization2.TotalResourcePoolValueIncludingAddition(user) == 0);
            Assert.IsTrue(organization2.ElementFieldIndexIncome(user) == 75);
            Assert.IsTrue(organization2.TotalIncome(user) == 75);
        }

        [TestMethod]
        public void TwoElementItems_ImportanceIndex_SingleUser()
        {
            // Arrange + act
            var user = new User("Email");

            var resourcePool = new ResourcePool("Default");
            resourcePool.AddUserResourcePool(user, 100);

            var organization = resourcePool.AddElement("Organization");

            organization
                    .AddField("Sales Price", ElementFieldTypes.ResourcePool, true)
                .Element
                    .AddField("Sales Number", ElementFieldTypes.Multiplier);
            var importanceField = resourcePool.MainElement.AddField("Importance Field", ElementFieldTypes.Decimal, false);

            var importanceFieldIndex = importanceField.AddIndex("Importance Index", RatingSortType.HighestToLowest);
            importanceFieldIndex.AddUserRating(user, 100);

            var organization1 = organization.AddItem("Organization 1");
            organization1
                    .AddCell(organization.ResourcePoolField).SetValue(200M)
                .ElementItem
                    .AddCell(organization.MultiplierField).SetValue(1M, user)
                .ElementItem
                    .AddCell(importanceField).SetValue(75M, user);

            var organization2 = organization.AddItem("Organization 2");
            organization2
                    .AddCell(organization.ResourcePoolField).SetValue(200M)
                .ElementItem
                    .AddCell(organization.MultiplierField).SetValue(1M, user)
                .ElementItem
                    .AddCell(importanceField).SetValue(25M, user);

            // Assert
            Assert.IsTrue(resourcePool.ResourcePoolAddition() == 400);
            Assert.IsTrue(resourcePool.ResourcePoolValueIncludingAddition() == 800);
            //Assert.IsTrue(resourcePool.TotalResourcePoolValue(user) == 400);
            Assert.IsTrue(resourcePool.TotalResourcePoolAddition(user) == 400);
            Assert.IsTrue(resourcePool.TotalResourcePoolValueIncludingAddition(user) == 800);
            Assert.IsTrue(resourcePool.TotalIncome(user) == 800);

            Assert.IsTrue(organization.IndexRatingAverage() == 100);

            Assert.IsTrue(importanceFieldIndex.IndexRatingCount() == 1);
            Assert.IsTrue(importanceFieldIndex.IndexRatingAverage() == 100);
            Assert.IsTrue(importanceFieldIndex.IndexRatingPercentage() == 1);
            Assert.IsTrue(importanceFieldIndex.IndexShare(user) == 400);

            Assert.IsTrue(organization1.ValueCount() == 1);
            Assert.IsTrue(organization1.Value() == 75);
            Assert.IsTrue(organization1.ResourcePoolValue() == 200);
            Assert.IsTrue(organization1.ResourcePoolAddition() == 200);
            Assert.IsTrue(organization1.ResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization1.TotalResourcePoolValue(user) == 200);
            Assert.IsTrue(organization1.TotalResourcePoolAddition(user) == 200);
            Assert.IsTrue(organization1.TotalResourcePoolValueIncludingAddition(user) == 400);
            Assert.IsTrue(organization1.ElementFieldIndexIncome(user) == 300);
            Assert.IsTrue(organization1.TotalIncome(user) == 500);

            Assert.IsTrue(organization2.ValueCount() == 1);
            Assert.IsTrue(organization2.Value() == 25);
            Assert.IsTrue(organization2.ResourcePoolValue() == 200);
            Assert.IsTrue(organization2.ResourcePoolAddition() == 200);
            Assert.IsTrue(organization2.ResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization2.TotalResourcePoolValue(user) == 200);
            Assert.IsTrue(organization2.TotalResourcePoolAddition(user) == 200);
            Assert.IsTrue(organization2.TotalResourcePoolValueIncludingAddition(user) == 400);
            Assert.IsTrue(organization2.ElementFieldIndexIncome(user) == 100);
            Assert.IsTrue(organization2.TotalIncome(user) == 300);

            // Arrange + act 2
            // TODO Since creating the whole scenario needs too much configuration,
            // it contains two different tests, try to separate them
            importanceFieldIndex.RatingSortType = (byte)RatingSortType.LowestToHighest;

            // Assert 2
            Assert.IsTrue(organization1.ValueCount() == 1);
            Assert.IsTrue(organization1.Value() == 75);
            Assert.IsTrue(organization1.ResourcePoolValue() == 200);
            Assert.IsTrue(organization1.ResourcePoolAddition() == 200);
            Assert.IsTrue(organization1.ResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization1.TotalResourcePoolValue(user) == 200);
            Assert.IsTrue(organization1.TotalResourcePoolAddition(user) == 200);
            Assert.IsTrue(organization1.TotalResourcePoolValueIncludingAddition(user) == 400);
            Assert.IsTrue(organization1.ElementFieldIndexIncome(user) == 100);
            Assert.IsTrue(organization1.TotalIncome(user) == 300);

            Assert.IsTrue(organization2.ValueCount() == 1);
            Assert.IsTrue(organization2.Value() == 25);
            Assert.IsTrue(organization2.ResourcePoolValue() == 200);
            Assert.IsTrue(organization2.ResourcePoolAddition() == 200);
            Assert.IsTrue(organization2.ResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization2.TotalResourcePoolValue(user) == 200);
            Assert.IsTrue(organization2.TotalResourcePoolAddition(user) == 200);
            Assert.IsTrue(organization2.TotalResourcePoolValueIncludingAddition(user) == 400);
            Assert.IsTrue(organization2.ElementFieldIndexIncome(user) == 300);
            Assert.IsTrue(organization2.TotalIncome(user) == 500);
        }

        [TestMethod]
        public void TwoElementItems_SalesPriceIndex_SingleUser()
        {
            // Arrange + act
            var user = new User("Email");

            var resourcePool = new ResourcePool("Default");
            resourcePool.AddUserResourcePool(user, 100);

            var organization = resourcePool.AddElement("Organization");

            organization
                    .AddField("Sales Price", ElementFieldTypes.ResourcePool, true)
                .Element
                    .AddField("Sales Number", ElementFieldTypes.Multiplier);
            
            var elementFieldIndex = organization.ResourcePoolField.AddIndex("Importance Index", RatingSortType.LowestToHighest);
            elementFieldIndex.AddUserRating(user, 100);

            var organization1 = organization.AddItem("Organization 1");
            organization1
                    .AddCell(organization.ResourcePoolField).SetValue(25M)
                .ElementItem
                    .AddCell(organization.MultiplierField).SetValue(1M, user);

            var organization2 = organization.AddItem("Organization 2");
            organization2
                    .AddCell(organization.ResourcePoolField).SetValue(75M)
                .ElementItem
                    .AddCell(organization.MultiplierField).SetValue(1M, user);

            // Assert
            Assert.IsTrue(resourcePool.ResourcePoolAddition() == 100);
            Assert.IsTrue(resourcePool.ResourcePoolValueIncludingAddition() == 200);
            //Assert.IsTrue(resourcePool.TotalResourcePoolValue(user) == 100);
            Assert.IsTrue(resourcePool.TotalResourcePoolAddition(user) == 100);
            Assert.IsTrue(resourcePool.TotalResourcePoolValueIncludingAddition(user) == 200);
            Assert.IsTrue(resourcePool.TotalIncome(user) == 200);

            Assert.IsTrue(organization.IndexRatingAverage() == 100);

            Assert.IsTrue(elementFieldIndex.IndexRatingCount() == 1);
            Assert.IsTrue(elementFieldIndex.IndexRatingAverage() == 100);
            Assert.IsTrue(elementFieldIndex.IndexRatingPercentage() == 1);
            Assert.IsTrue(elementFieldIndex.IndexShare(user) == 100);

            Assert.IsTrue(organization1.ValueCount() == 1);
            Assert.IsTrue(organization1.Value() == 25);
            Assert.IsTrue(organization1.ResourcePoolValue() == 25);
            Assert.IsTrue(organization1.ResourcePoolAddition() == 25);
            Assert.IsTrue(organization1.ResourcePoolValueIncludingAddition() == 50);
            Assert.IsTrue(organization1.TotalResourcePoolValue(user) == 25);
            Assert.IsTrue(organization1.TotalResourcePoolAddition(user) == 25);
            Assert.IsTrue(organization1.TotalResourcePoolValueIncludingAddition(user) == 50);
            Assert.IsTrue(organization1.ElementFieldIndexIncome(user) == 75);
            Assert.IsTrue(organization1.TotalIncome(user) == 100);

            Assert.IsTrue(organization2.ValueCount() == 1);
            Assert.IsTrue(organization2.Value() == 75);
            Assert.IsTrue(organization2.ResourcePoolValue() == 75);
            Assert.IsTrue(organization2.ResourcePoolAddition() == 75);
            Assert.IsTrue(organization2.ResourcePoolValueIncludingAddition() == 150);
            Assert.IsTrue(organization2.TotalResourcePoolValue(user) == 75);
            Assert.IsTrue(organization2.TotalResourcePoolAddition(user) == 75);
            Assert.IsTrue(organization2.TotalResourcePoolValueIncludingAddition(user) == 150);
            Assert.IsTrue(organization2.ElementFieldIndexIncome(user) == 25);
            Assert.IsTrue(organization2.TotalIncome(user) == 100);
        }

        [TestMethod]
        public void TwoElementItems_ImportanceIndex_TwoUsers()
        {
            // Todo Improve this test: Can be shorter and have a better case for "user2"

            // Arrange + act
            var user1 = new User("User 1");
            var user2 = new User("User 2");

            var resourcePool = new ResourcePool("Default");
            resourcePool.AddUserResourcePool(user1, 100);

            var organization = resourcePool.AddElement("Organization");

            organization
                    .AddField("Sales Price", ElementFieldTypes.ResourcePool, true)
                .Element
                    .AddField("Sales Number", ElementFieldTypes.Multiplier);
            var importanceField = resourcePool.MainElement.AddField("Importance Field", ElementFieldTypes.Decimal, false);

            var elementFieldIndex = importanceField.AddIndex("Importance Index", RatingSortType.HighestToLowest);
            elementFieldIndex.AddUserRating(user1, 100);

            var organization1 = organization.AddItem("Organization 1");
            organization1
                    .AddCell(organization.ResourcePoolField).SetValue(200M)
                .ElementItem
                    .AddCell(organization.MultiplierField)
                        .SetValue(1M, user1)
                        .SetValue(10M, user2)
                .ElementItem
                    .AddCell(importanceField).SetValue(75M, user1);

            var organization2 = organization.AddItem("Organization 2");
            organization2
                    .AddCell(organization.ResourcePoolField).SetValue(200M)
                .ElementItem
                    .AddCell(organization.MultiplierField)
                        .SetValue(1M, user1)
                        .SetValue(10M, user2)
                .ElementItem
                    .AddCell(importanceField).SetValue(25M, user1);

            // Assert
            Assert.IsTrue(resourcePool.ResourcePoolAddition() == 400);
            Assert.IsTrue(resourcePool.ResourcePoolValueIncludingAddition() == 800);
            //Assert.IsTrue(resourcePool.TotalResourcePoolValue(user1) == 400);
            Assert.IsTrue(resourcePool.TotalResourcePoolAddition(user1) == 400);
            Assert.IsTrue(resourcePool.TotalResourcePoolValueIncludingAddition(user1) == 800);
            Assert.IsTrue(resourcePool.TotalIncome(user1) == 800);

            Assert.IsTrue(organization.IndexRatingAverage() == 100);

            Assert.IsTrue(elementFieldIndex.IndexRatingCount() == 1);
            Assert.IsTrue(elementFieldIndex.IndexRatingAverage() == 100);
            Assert.IsTrue(elementFieldIndex.IndexRatingPercentage() == 1);
            Assert.IsTrue(elementFieldIndex.IndexShare(user1) == 400);

            Assert.IsTrue(organization1.ValueCount() == 1);
            Assert.IsTrue(organization1.Value() == 75);
            Assert.IsTrue(organization1.ResourcePoolValue() == 200);
            Assert.IsTrue(organization1.ResourcePoolAddition() == 200);
            Assert.IsTrue(organization1.ResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization1.TotalResourcePoolValue(user1) == 200);
            Assert.IsTrue(organization1.TotalResourcePoolAddition(user1) == 200);
            Assert.IsTrue(organization1.TotalResourcePoolValueIncludingAddition(user1) == 400);
            Assert.IsTrue(organization1.ElementFieldIndexIncome(user1) == 300);
            Assert.IsTrue(organization1.TotalIncome(user1) == 500);

            Assert.IsTrue(organization2.ValueCount() == 1);
            Assert.IsTrue(organization2.Value() == 25);
            Assert.IsTrue(organization2.ResourcePoolValue() == 200);
            Assert.IsTrue(organization2.ResourcePoolAddition() == 200);
            Assert.IsTrue(organization2.ResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization2.TotalResourcePoolValue(user1) == 200);
            Assert.IsTrue(organization2.TotalResourcePoolAddition(user1) == 200);
            Assert.IsTrue(organization2.TotalResourcePoolValueIncludingAddition(user1) == 400);
            Assert.IsTrue(organization2.ElementFieldIndexIncome(user1) == 100);
            Assert.IsTrue(organization2.TotalIncome(user1) == 300);

            // Arrange + act 2
            // TODO Since creating the whole scenario needs too much configuration,
            // it contains two different tests, try to separate them
            elementFieldIndex.RatingSortType = (byte)RatingSortType.LowestToHighest;

            // Assert 2
            Assert.IsTrue(organization1.ValueCount() == 1);
            Assert.IsTrue(organization1.Value() == 75);
            Assert.IsTrue(organization1.ResourcePoolValue() == 200);
            Assert.IsTrue(organization1.ResourcePoolAddition() == 200);
            Assert.IsTrue(organization1.ResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization1.TotalResourcePoolValue(user1) == 200);
            Assert.IsTrue(organization1.TotalResourcePoolAddition(user1) == 200);
            Assert.IsTrue(organization1.TotalResourcePoolValueIncludingAddition(user1) == 400);
            Assert.IsTrue(organization1.ElementFieldIndexIncome(user1) == 100);
            Assert.IsTrue(organization1.TotalIncome(user1) == 300);

            Assert.IsTrue(organization2.ValueCount() == 1);
            Assert.IsTrue(organization2.Value() == 25);
            Assert.IsTrue(organization2.ResourcePoolValue() == 200);
            Assert.IsTrue(organization2.ResourcePoolAddition() == 200);
            Assert.IsTrue(organization2.ResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization2.TotalResourcePoolValue(user1) == 200);
            Assert.IsTrue(organization2.TotalResourcePoolAddition(user1) == 200);
            Assert.IsTrue(organization2.TotalResourcePoolValueIncludingAddition(user1) == 400);
            Assert.IsTrue(organization2.ElementFieldIndexIncome(user1) == 300);
            Assert.IsTrue(organization2.TotalIncome(user1) == 500);
        }
    }
}
