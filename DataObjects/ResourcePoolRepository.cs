﻿namespace DataObjects
{
    using BusinessObjects;
    using DataObjects.Extensions;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;

    public partial class ResourcePoolRepository
    {
        const int DEFAULTNUMBEROFITEMS = 2;

        DbSet<ResourcePool> ResourcePoolSet { get { return Context.Set<ResourcePool>(); } }
        DbSet<UserResourcePool> UserResourcePoolSet { get { return Context.Set<UserResourcePool>(); } }

        public async Task<UserResourcePool> FindUserResourcePoolAsync(int userId, int resourcePoolId)
        {
            return await UserResourcePoolSet
                .Get(item => item.UserId == userId && item.ResourcePoolId == resourcePoolId)
                .SingleOrDefaultAsync();
        }

        public async Task<ResourcePool> FindByUserResourcePoolIdAsync(int userResourcePoolId)
        {
            var list = ResourcePoolSet.Get(item => item.UserResourcePoolSet.Any(item2 => item2.Id == userResourcePoolId));

            return list.Any()
                ? await list.SingleOrDefaultAsync()
                : null;
        }

        public ResourcePool CreateSectorIndexSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, 9);
            resourcePool.Name = "Sector Index Sample";
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.Name = "Sector";
            mainElement.ResourcePoolField.Name = "Sales Price"; // TODO It does not fit! Update this after having Initial Amount on RP!
            mainElement.MultiplierField.Name = "Sales Number";

            // Items, cell, user cells
            // TODO How about ToList()[0]?
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Basic Materials";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Conglomerates";
            mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "Consumer Goods";
            mainElement.ElementItemSet.Skip(3).Take(1).Single().Name = "Financial";
            mainElement.ElementItemSet.Skip(4).Take(1).Single().Name = "Healthcare";
            mainElement.ElementItemSet.Skip(5).Take(1).Single().Name = "Industrial Goods";
            mainElement.ElementItemSet.Skip(6).Take(1).Single().Name = "Services";
            mainElement.ElementItemSet.Skip(7).Take(1).Single().Name = "Technology";
            mainElement.ElementItemSet.Skip(8).Take(1).Single().Name = "Utilities";

            // Return
            return resourcePool;
        }

        public ResourcePool CreateKnowledgeIndexSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user);
            resourcePool.Name = "Knowledge Index Sample";
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.Name = "License";
            mainElement.ResourcePoolField.Name = "Sales Price"; // TODO It does not fit! Update this after having Initial Amount on RP!
            mainElement.MultiplierField.Name = "Sales Number";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Open Source License";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Restricted License";

            // Return
            return resourcePool;
        }

        public ResourcePool CreateTotalCostIndexSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user);
            resourcePool.Name = "Total Cost Index Sample";
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.Name = "Organization";
            mainElement.ResourcePoolField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Sales Number";

            // Resource pool index; change it to Sales Price itself, instead of User ratings
            resourcePool.ResourcePoolIndexSet.Clear();
            resourcePool.MainElement.NameField.ResourcePoolIndexSet.Clear();
            resourcePool.UserResourcePoolSet.First().UserResourcePoolIndexSet.Clear();
            var totalCostIndex = resourcePool.AddIndex("Total Cost Index", resourcePool.MainElement.ResourcePoolField, RatingSortType.LowestToHighest);
            resourcePool.UserResourcePoolSet.First().AddIndex(totalCostIndex, 100);
            
            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Lowlands";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().ResourcePoolCell.DecimalValue = 125;
            mainElement.ElementItemSet.Skip(0).Take(1).Single().NameCell.UserElementCellSet.Clear();
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "High Coast";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().ResourcePoolCell.DecimalValue = 175;
            mainElement.ElementItemSet.Skip(1).Take(1).Single().NameCell.UserElementCellSet.Clear();

            // Return
            return resourcePool;
        }

        public ResourcePool CreateDefaultResourcePool(User user)
        {
            return CreateDefaultResourcePool(user, DEFAULTNUMBEROFITEMS);
        }

        public ResourcePool CreateDefaultResourcePool(User user, short numberOfItems)
        {
            // Resource pool, main element, fields
            var resourcePool = new ResourcePool("Default");
            resourcePool
                .AddElement("Main Element")
                    .AddField("Resource Pool Field", ElementFieldTypes.ResourcePool)
                .Element
                    .AddField("Multiplier", ElementFieldTypes.Multiplier);

            // Items, cells, user cells
            var itemRating = numberOfItems > 0 ? 100 / numberOfItems : 0;
            for (var i = 1; i <= numberOfItems; i++)
            {
                var itemName = string.Format("Item {0}", i);

                resourcePool.MainElement
                    .AddItem(itemName)
                        .AddCell(resourcePool.MainElement.ResourcePoolField).SetValue(100M)
                    .ElementItem
                        .AddCell(resourcePool.MainElement.MultiplierField).SetValue(0M)
                    .ElementItem
                        .NameCell.AddUserCell(user, itemRating); // Rating for importance index
            }

            // Importance Index
            // TODO Will be updated with new field / index combo
            var importanceIndex = resourcePool.AddIndex("Importance Index", resourcePool.MainElement.NameField, RatingSortType.HighestToLowest);

            // User resource pool, index
            resourcePool.AddUserResourcePool(user, 101).AddIndex(importanceIndex, 100);

            // Return
            return resourcePool;
        }
    }
}
