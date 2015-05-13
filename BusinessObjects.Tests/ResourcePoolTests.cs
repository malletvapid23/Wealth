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
        public void TwoElementItems_ImportanceIndex_SingleUser()
        {
            // Arrange + act
            var user = new User("User");

            var resourcePool = new ResourcePool("Default");
            resourcePool.AddUserResourcePool(user, 100);

            var organization = resourcePool.AddElement("Organization");
            //organization.FilterSettings.CurrentUser = user;

            organization
                    .AddField("Sales Price", ElementFieldTypes.ResourcePool, true)
                .Element
                    .AddField("Number of Sales", ElementFieldTypes.Multiplier);
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
            Assert.IsTrue(resourcePool.TotalResourcePoolAddition() == 400);
            Assert.IsTrue(resourcePool.TotalResourcePoolValueIncludingAddition() == 800);
            Assert.IsTrue(resourcePool.TotalIncome() == 800);

            Assert.IsTrue(organization.IndexRatingAverage() == 100);

            Assert.IsTrue(importanceFieldIndex.IndexRatingCountOld == 1);
            Assert.IsTrue(importanceFieldIndex.IndexRatingAverageOld == 100);
            Assert.IsTrue(importanceFieldIndex.IndexRatingPercentage() == 1);
            Assert.IsTrue(importanceFieldIndex.IndexShare() == 400);

            Assert.IsTrue(organization1.ResourcePoolValue() == 200);
            Assert.IsTrue(organization1.ResourcePoolAddition() == 200);
            Assert.IsTrue(organization1.ResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization1.TotalResourcePoolValue() == 200);
            Assert.IsTrue(organization1.TotalResourcePoolAddition() == 200);
            Assert.IsTrue(organization1.TotalResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization1.IndexIncome() == 300);
            Assert.IsTrue(organization1.TotalIncome() == 500);

            Assert.IsTrue(organization2.ResourcePoolValue() == 200);
            Assert.IsTrue(organization2.ResourcePoolAddition() == 200);
            Assert.IsTrue(organization2.ResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization2.TotalResourcePoolValue() == 200);
            Assert.IsTrue(organization2.TotalResourcePoolAddition() == 200);
            Assert.IsTrue(organization2.TotalResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization2.IndexIncome() == 100);
            Assert.IsTrue(organization2.TotalIncome() == 300);

            // Arrange + act 2
            // TODO Since creating the whole scenario needs too much configuration,
            // it contains two different tests, try to separate them
            importanceFieldIndex.RatingSortType = (byte)RatingSortType.LowestToHighest;

            // Assert 2
            Assert.IsTrue(organization1.ResourcePoolValue() == 200);
            Assert.IsTrue(organization1.ResourcePoolAddition() == 200);
            Assert.IsTrue(organization1.ResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization1.TotalResourcePoolValue() == 200);
            Assert.IsTrue(organization1.TotalResourcePoolAddition() == 200);
            Assert.IsTrue(organization1.TotalResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization1.IndexIncome() == 100);
            Assert.IsTrue(organization1.TotalIncome() == 300);

            Assert.IsTrue(organization2.ResourcePoolValue() == 200);
            Assert.IsTrue(organization2.ResourcePoolAddition() == 200);
            Assert.IsTrue(organization2.ResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization2.TotalResourcePoolValue() == 200);
            Assert.IsTrue(organization2.TotalResourcePoolAddition() == 200);
            Assert.IsTrue(organization2.TotalResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization2.IndexIncome() == 300);
            Assert.IsTrue(organization2.TotalIncome() == 500);
        }

        [TestMethod]
        public void TwoElementItems_SalesPriceIndex_SingleUser()
        {
            // Arrange + act
            var user = new User("User");

            var resourcePool = new ResourcePool("Default");
            resourcePool.AddUserResourcePool(user, 100);

            var organization = resourcePool.AddElement("Organization");
            //organization.FilterSettings.CurrentUser = user;

            organization
                    .AddField("Sales Price", ElementFieldTypes.ResourcePool, true)
                .Element
                    .AddField("Number of Sales", ElementFieldTypes.Multiplier);
            
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
            Assert.IsTrue(resourcePool.TotalResourcePoolAddition() == 100);
            Assert.IsTrue(resourcePool.TotalResourcePoolValueIncludingAddition() == 200);
            Assert.IsTrue(resourcePool.TotalIncome() == 200);

            Assert.IsTrue(organization.IndexRatingAverage() == 100);

            Assert.IsTrue(elementFieldIndex.IndexRatingCountOld == 1);
            Assert.IsTrue(elementFieldIndex.IndexRatingAverageOld == 100);
            Assert.IsTrue(elementFieldIndex.IndexRatingPercentage() == 1);
            Assert.IsTrue(elementFieldIndex.IndexShare() == 100);

            Assert.IsTrue(organization1.ResourcePoolValue() == 25);
            Assert.IsTrue(organization1.ResourcePoolAddition() == 25);
            Assert.IsTrue(organization1.ResourcePoolValueIncludingAddition() == 50);
            Assert.IsTrue(organization1.TotalResourcePoolValue() == 25);
            Assert.IsTrue(organization1.TotalResourcePoolAddition() == 25);
            Assert.IsTrue(organization1.TotalResourcePoolValueIncludingAddition() == 50);
            Assert.IsTrue(organization1.IndexIncome() == 75);
            Assert.IsTrue(organization1.TotalIncome() == 100);

            Assert.IsTrue(organization2.ResourcePoolValue() == 75);
            Assert.IsTrue(organization2.ResourcePoolAddition() == 75);
            Assert.IsTrue(organization2.ResourcePoolValueIncludingAddition() == 150);
            Assert.IsTrue(organization2.TotalResourcePoolValue() == 75);
            Assert.IsTrue(organization2.TotalResourcePoolAddition() == 75);
            Assert.IsTrue(organization2.TotalResourcePoolValueIncludingAddition() == 150);
            Assert.IsTrue(organization2.IndexIncome() == 25);
            Assert.IsTrue(organization2.TotalIncome() == 100);
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
            // organization.FilterSettings.CurrentUser = user1;

            organization
                    .AddField("Sales Price", ElementFieldTypes.ResourcePool, true)
                .Element
                    .AddField("Number of Sales", ElementFieldTypes.Multiplier);
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
            Assert.IsTrue(resourcePool.TotalResourcePoolAddition() == 400);
            Assert.IsTrue(resourcePool.TotalResourcePoolValueIncludingAddition() == 800);
            Assert.IsTrue(resourcePool.TotalIncome() == 800);

            Assert.IsTrue(organization.IndexRatingAverage() == 100);

            Assert.IsTrue(elementFieldIndex.IndexRatingCountOld == 1);
            Assert.IsTrue(elementFieldIndex.IndexRatingAverageOld == 100);
            Assert.IsTrue(elementFieldIndex.IndexRatingPercentage() == 1);
            Assert.IsTrue(elementFieldIndex.IndexShare() == 400);

            Assert.IsTrue(organization1.ResourcePoolValue() == 200);
            Assert.IsTrue(organization1.ResourcePoolAddition() == 200);
            Assert.IsTrue(organization1.ResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization1.TotalResourcePoolValue() == 200);
            Assert.IsTrue(organization1.TotalResourcePoolAddition() == 200);
            Assert.IsTrue(organization1.TotalResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization1.IndexIncome() == 300);
            Assert.IsTrue(organization1.TotalIncome() == 500);

            Assert.IsTrue(organization2.ResourcePoolValue() == 200);
            Assert.IsTrue(organization2.ResourcePoolAddition() == 200);
            Assert.IsTrue(organization2.ResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization2.TotalResourcePoolValue() == 200);
            Assert.IsTrue(organization2.TotalResourcePoolAddition() == 200);
            Assert.IsTrue(organization2.TotalResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization2.IndexIncome() == 100);
            Assert.IsTrue(organization2.TotalIncome() == 300);

            // Arrange + act 2
            // TODO Since creating the whole scenario needs too much configuration,
            // it contains two different tests, try to separate them
            elementFieldIndex.RatingSortType = (byte)RatingSortType.LowestToHighest;

            // Assert 2
            Assert.IsTrue(organization1.ResourcePoolValue() == 200);
            Assert.IsTrue(organization1.ResourcePoolAddition() == 200);
            Assert.IsTrue(organization1.ResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization1.TotalResourcePoolValue() == 200);
            Assert.IsTrue(organization1.TotalResourcePoolAddition() == 200);
            Assert.IsTrue(organization1.TotalResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization1.IndexIncome() == 100);
            Assert.IsTrue(organization1.TotalIncome() == 300);

            Assert.IsTrue(organization2.ResourcePoolValue() == 200);
            Assert.IsTrue(organization2.ResourcePoolAddition() == 200);
            Assert.IsTrue(organization2.ResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization2.TotalResourcePoolValue() == 200);
            Assert.IsTrue(organization2.TotalResourcePoolAddition() == 200);
            Assert.IsTrue(organization2.TotalResourcePoolValueIncludingAddition() == 400);
            Assert.IsTrue(organization2.IndexIncome() == 300);
            Assert.IsTrue(organization2.TotalIncome() == 500);
        }
    }
}
