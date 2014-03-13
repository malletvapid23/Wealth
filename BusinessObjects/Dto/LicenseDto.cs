//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace BusinessObjects.Dto
{
    using System;
    using System.ComponentModel.DataAnnotations;
    
    public class LicenseDto
    {
        public short Id { get; set; }

        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public string Text { get; set; }
        public System.DateTime CreatedOn { get; set; }
        public System.DateTime ModifiedOn { get; set; }
        public Nullable<System.DateTime> DeletedOn { get; set; }
    	
    	public License ToBusinessObject()
    	{
    		return new License()
    		{
    			Id = Id, 
    			Name = Name, 
    			Description = Description, 
    			Text = Text, 
    			CreatedOn = CreatedOn, 
    			ModifiedOn = ModifiedOn, 
    			DeletedOn = DeletedOn
    		};
    	}
    }
}
