//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Web.Controllers.OData
{
    using BusinessObjects;
    using Facade;
    using Microsoft.AspNet.Identity;
    using System.Data.Entity.Infrastructure;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.ModelBinding;
    using System.Web.Http.OData;

    public abstract class BaseUserResourcePoolController : BaseODataController
    {
        public BaseUserResourcePoolController()
		{
			MainUnitOfWork = new UserResourcePoolUnitOfWork();		
		}

		protected UserResourcePoolUnitOfWork MainUnitOfWork { get; private set; }

        // GET odata/UserResourcePool
        [Queryable]
        public virtual IQueryable<UserResourcePool> Get()
        {
			var list = MainUnitOfWork.AllLive;
			list = list.Where(item => item.UserId == ApplicationUser.Id);
            return list;
        }

        // GET odata/UserResourcePool(5)
        [Queryable]
        public virtual SingleResult<UserResourcePool> Get([FromODataUri] int key)
        {
            return SingleResult.Create(MainUnitOfWork.AllLive.Where(userResourcePool => userResourcePool.Id == key));
        }

        // PUT odata/UserResourcePool(5)
        public virtual async Task<IHttpActionResult> Put([FromODataUri] int key, UserResourcePool userResourcePool)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != userResourcePool.Id)
            {
                return BadRequest();
            }

            try
            {
                await MainUnitOfWork.UpdateAsync(userResourcePool);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MainUnitOfWork.Exists(key))
                {
                    return NotFound();
                }
                else
                {
                    return Conflict();
                }
            }

            return Ok(userResourcePool);
        }

        // POST odata/UserResourcePool
        public virtual async Task<IHttpActionResult> Post(UserResourcePool userResourcePool)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await MainUnitOfWork.InsertAsync(userResourcePool);
            }
            catch (DbUpdateException)
            {
                if (MainUnitOfWork.Exists(userResourcePool.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(userResourcePool);
        }

        // PATCH odata/UserResourcePool(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public virtual async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<UserResourcePool> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userResourcePool = await MainUnitOfWork.FindAsync(key);
            if (userResourcePool == null)
            {
                return NotFound();
            }

            var patchEntity = patch.GetEntity();
            if (!userResourcePool.RowVersion.SequenceEqual(patchEntity.RowVersion))
            {
                return Conflict();
            }

            patch.Patch(userResourcePool);
            await MainUnitOfWork.UpdateAsync(userResourcePool);

            return Ok(userResourcePool);
        }

        // DELETE odata/UserResourcePool(5)
        public virtual async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            var userResourcePool = await MainUnitOfWork.FindAsync(key);
            if (userResourcePool == null)
            {
                return NotFound();
            }

            await MainUnitOfWork.DeleteAsync(userResourcePool.Id);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }

    public partial class UserResourcePoolController : BaseUserResourcePoolController
    {
	}
}
