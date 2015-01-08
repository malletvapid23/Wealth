﻿
using System;
namespace BusinessObjects.ViewModels
{
    public class ElementFieldIndex
    {
        public ElementFieldIndex() { }

        public ElementFieldIndex(BusinessObjects.ElementFieldIndex elementFieldIndex, User user)
        {
            Id = elementFieldIndex.Id;
            ElementFieldId = elementFieldIndex.ElementFieldId;
            Name = elementFieldIndex.Name;

            ValueMultiplied = elementFieldIndex.ValueMultiplied(user);
            ValuePercentage = elementFieldIndex.ValuePercentage(user);
            ElementFieldIndexIncome = elementFieldIndex.ElementFieldIndexIncome(user);

            IndexRatingCount = elementFieldIndex.IndexRatingCount();
            IndexRatingAverage = elementFieldIndex.IndexRatingAverage();
            IndexRatingPercentage = elementFieldIndex.IndexRatingPercentage();
            IndexShare = elementFieldIndex.IndexShare(user);
        }

        public int Id { get; set; }
        public Nullable<int> ElementFieldId { get; set; }
        public string Name { get; set; }

        public decimal ValueMultiplied { get; set; }
        public decimal ValuePercentage { get; set; }
        public decimal ElementFieldIndexIncome { get; set; }

        public decimal IndexRatingCount { get; set; }
        public decimal IndexRatingAverage { get; set; }
        public decimal IndexRatingPercentage { get; set; }
        public decimal IndexShare { get; set; }
    }
}
