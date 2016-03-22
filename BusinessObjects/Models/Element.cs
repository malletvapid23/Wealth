namespace forCrowd.WealthEconomy.BusinessObjects
{
    using forCrowd.WealthEconomy.Framework;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    // [ODataControllerAuthorization("Administrator")]
    public class Element : BaseEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public Element()
        {
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
        }

        public int Id { get; set; }

        public int ResourcePoolId { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Required]
        public bool IsMainElement { get; set; }

        public virtual ResourcePool ResourcePool { get; set; }

        public virtual ICollection<ElementField> ElementFieldSet { get; set; }
        public virtual ICollection<ElementItem> ElementItemSet { get; set; }
        [InverseProperty("SelectedElement")]
        public virtual ICollection<ElementField> ParentFieldSet { get; set; }

        #region - ReadOnly Properties -

        public ElementField DirectIncomeField
        {
            get { return ElementFieldSet.SingleOrDefault(item => item.DataType == (byte)ElementFieldDataType.DirectIncome); }
        }

        public ElementField MultiplierField
        {
            get { return ElementFieldSet.SingleOrDefault(item => item.DataType == (byte)ElementFieldDataType.Multiplier); }
        }

        #endregion

        #region - Methods -

        public ElementField AddField(string name, ElementFieldDataType fieldType, bool? useFixedValue = null)
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
