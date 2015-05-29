namespace forCrowd.WealthEconomy.BusinessObjects
{
    using forCrowd.WealthEconomy.BusinessObjects.Attributes;
    using forCrowd.WealthEconomy.Framework;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    [forCrowd.WealthEconomy.BusinessObjects.Attributes.DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class Element : BaseEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public Element()
        {
            ResourcePoolMainElementSubSet = new HashSet<ResourcePool>();
            ElementFieldSet = new HashSet<ElementField>();
            ElementItemSet = new HashSet<ElementItem>();
            ParentFieldSet = new HashSet<ElementField>();
        }

        public Element(ResourcePool resourcePool, string name)
            : this()
        {
            Validations.ArgumentNullOrDefault(resourcePool, "resourcePool");
            Validations.ArgumentNullOrDefault(name, "name");

            ResourcePool = resourcePool;
            Name = name;

            AddField(name, ElementFieldTypes.String);
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        public int ResourcePoolId { get; set; }

        [Display(Name = "Element")]
        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        public virtual ResourcePool ResourcePool { get; set; }
        [InverseProperty("MainElement")]
        public virtual ICollection<ResourcePool> ResourcePoolMainElementSubSet { get; set; }
        public virtual ICollection<ElementField> ElementFieldSet { get; set; }
        public virtual ICollection<ElementItem> ElementItemSet { get; set; }
        [InverseProperty("SelectedElement")]
        public virtual ICollection<ElementField> ParentFieldSet { get; set; }

        #region - ReadOnly Properties -

        /// <summary>
        /// REMARK An element can only be selected by one field, therefore can only have one parent.
        /// </summary>
        public ElementField ParentField
        {
            get
            {
                return ParentFieldSet.Any() ? ParentFieldSet.Single() : null;
            }
        }

        /// <summary>
        /// REMARK: In other index types, this value is calculated on ElementFieldIndex class level, under IndexValue property
        /// </summary>
        //public decimal RatingAverage
        //{
        //    get { return ElementItemSet.Sum(item => item.RatingAverage); }
        //}

        //public IEnumerable<ElementFieldIndex> ElementFieldIndexSet
        //{
        //    get
        //    {
        //        return ElementFieldSet
        //            .Where(item => item.ElementFieldIndex != null)
        //            .Select(field => field.ElementFieldIndex);
        //    }
        //}

        public ElementField NameField
        {
            // TODO Is it correct approach?
            get { return ElementFieldSet.Single(item => item.SortOrder == 1); }
        }

        public bool HasNameField
        {
            get { return NameField != null; }
        }

        public ElementField DirectIncomeField
        {
            get { return ElementFieldSet.SingleOrDefault(item => item.ElementFieldType == (byte)ElementFieldTypes.DirectIncome); }
        }

        public bool HasResourcePoolField
        {
            get { return DirectIncomeField != null; }
        }

        public string ResourcePoolFieldName
        {
            get
            {
                if (!HasResourcePoolField)
                    return string.Empty;

                return DirectIncomeField.Name;
            }
        }

        public decimal ResourcePoolValue()
        {
            return ElementItemSet.Sum(item => item.DirectIncomeValue());
        }

        public decimal ResourcePoolAddition()
        {
            return ElementItemSet.Sum(item => item.ResourcePoolAddition());
        }

        public decimal ResourcePoolValueIncludingAddition()
        {
            return ElementItemSet.Sum(item => item.ResourcePoolValueIncludingAddition());
        }

        public ElementField MultiplierField
        {
            get { return ElementFieldSet.SingleOrDefault(item => item.ElementFieldType == (byte)ElementFieldTypes.Multiplier); }
        }

        public bool HasMultiplierField
        {
            get
            {
                return MultiplierField != null;
            }
        }

        public string MultiplierFieldName
        {
            get
            {
                if (!HasMultiplierField)
                    return string.Empty;

                return MultiplierField.Name;
            }
        }

        public decimal MultiplierValue()
        {
            return ElementItemSet.Sum(item => item.MultiplierValue());
        }

        public decimal TotalResourcePoolValue()
        {
            return ElementItemSet.Sum(item => item.TotalResourcePoolValue());
        }

        public decimal TotalResourcePoolAddition()
        {
            return ElementItemSet.Sum(item => item.TotalResourcePoolAddition());
        }

        public decimal TotalResourcePoolValueIncludingAddition()
        {
            return ElementItemSet.Sum(item => item.TotalResourcePoolValueIncludingAddition());
        }

        public decimal TotalIncome()
        {
            return ElementItemSet.Sum(item => item.TotalIncome());
        }

        #endregion

        #region - Methods -

        public decimal IndexRatingAverage()
        {
            return 0; // ElementFieldIndexSet.Sum(item => item.IndexRatingAverageOld);
        }

        //public ElementField AddField(string name, ElementFieldTypes fieldType)
        //{
        //    var sortOrder = (byte)(ElementFieldSet.Count + 1);
        //    var field = new ElementField(this, name, fieldType, sortOrder);
        //    return AddField(field);
        //}

        public ElementField AddField(string name, ElementFieldTypes fieldType, bool? useFixedValue = null)
        {
            var sortOrder = Convert.ToByte(ElementFieldSet.Count + 1);
            var field = new ElementField(this, name, fieldType, sortOrder, useFixedValue);

            //return AddField(field);
            //}

            //ElementField AddField(ElementField field)
            //{
            // TODO Validation - Same name?

            ElementFieldSet.Add(field);

            return field;
        }

        public ElementItem AddItem(string name)
        {
            // TODO Validation - Same name?

            var item = new ElementItem(this, name);
            ElementItemSet.Add(item);
            return item;
        }

        #endregion
    }
}
