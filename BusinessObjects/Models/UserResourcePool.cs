namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using Framework;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    [UserAware("UserId")]
    [DisplayName("User CMRP")]
    [BusinessObjects.Attributes.DefaultProperty("Id")]
    public class UserResourcePool : BaseEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public UserResourcePool()
        { }

        public UserResourcePool(ResourcePool resourcePool, decimal resourcePoolRate) : this()
        {
            // Validations.ArgumentNullOrDefault(user, "user");
            Validations.ArgumentNullOrDefault(resourcePool, "resourcePool");

            // User = user;
            ResourcePool = resourcePool;
            ResourcePoolRate = resourcePoolRate;
            //UserElementFieldIndexSet = new HashSet<UserElementFieldIndex>();
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Index("IX_UserIdResourcePoolId", 1, IsUnique = true)]
        public int UserId { get; set; }

        [Index("IX_UserIdResourcePoolId", 2, IsUnique = true)]
        public int ResourcePoolId { get; set; }

        [Display(Name = "CMRP Rate")]
        public decimal ResourcePoolRate { get; set; }

        public virtual User User { get; set; }

        public virtual ResourcePool ResourcePool { get; set; }

        //public virtual ICollection<UserElementFieldIndex> UserElementFieldIndexSet { get; set; }

        #region - General -

        //public string Name
        //{
        //    get { return string.Format("{0} - {1}", User.Email, ResourcePool.Name); }
        //}

        #endregion

        #region - Methods -

        //public UserElementFieldIndex AddIndex(ElementFieldIndex elementFieldIndex, decimal rating)
        //{
        //    //// TODO Validation?
        //    //var index = new UserElementFieldIndex(this, elementFieldIndex, rating);
        //    //elementFieldIndex.UserElementFieldIndexSet.Add(index);
        //    ////UserElementFieldIndexSet.Add(index);
        //    //return index;

        //    return null;
        //}

        #endregion

    }
}
