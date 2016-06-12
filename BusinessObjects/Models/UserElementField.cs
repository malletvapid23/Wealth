namespace forCrowd.WealthEconomy.BusinessObjects
{
    using forCrowd.WealthEconomy.Framework;
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [UserAware("UserId")]
    public class UserElementField : BaseEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public UserElementField()
        { }

        public UserElementField(ElementField elementField, decimal rating)
            : this()
        {
            Validations.ArgumentNullOrDefault(elementField, "elementField");

            ElementField = elementField;
            Rating = rating;
        }

        [Key]
        [Column(Order = 1)]
        public int UserId { get; set; }

        [Key]
        [Column(Order = 2)]
        public int ElementFieldId { get; set; }

        public decimal Rating { get; set; }

        public virtual User User { get; set; }
        public virtual ElementField ElementField { get; set; }
    }
}
