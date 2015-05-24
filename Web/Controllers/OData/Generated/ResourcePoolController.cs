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
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.ModelBinding;
    using System.Web.Http.OData;

    public abstract class BaseResourcePoolController : BaseODataController
    {
        public BaseResourcePoolController()
		{
			MainUnitOfWork = new ResourcePoolUnitOfWork();		
		}

		protected ResourcePoolUnitOfWork MainUnitOfWork { get; private set; }

        // GET odata/ResourcePool
        //[Queryable]
        public virtual IQueryable<ResourcePool> Get()
        {
			var list = MainUnitOfWork.AllLive;
            return list;
        }

        // GET odata/ResourcePool(5)
        //[Queryable]
        public virtual SingleResult<ResourcePool> Get([FromODataUri] int key)
        {
            return SingleResult.Create(MainUnitOfWork.AllLive.Where(resourcePool => resourcePool.Id == key));
        }

        // PUT odata/ResourcePool(5)
        public virtual async Task<IHttpActionResult> Put([FromODataUri] int key, ResourcePool resourcePool)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != resourcePool.Id)
            {
                return BadRequest();
            }

            try
            {
                await MainUnitOfWork.UpdateAsync(resourcePool);
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

            return Ok(resourcePool);
        }

        // POST odata/ResourcePool
        public virtual async Task<IHttpActionResult> Post(ResourcePool resourcePool)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await MainUnitOfWork.InsertAsync(resourcePool);
            }
            catch (DbUpdateException)
            {
                if (MainUnitOfWork.Exists(resourcePool.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(resourcePool);
        }

        // PATCH odata/ResourcePool(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public virtual async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<ResourcePool> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var resourcePool = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.Id == key);
            if (resourcePool == null)
            {
                return NotFound();
            }

            var patchEntity = patch.GetEntity();

            // TODO How is passed ModelState.IsValid?
            if (patchEntity.RowVersion == null)
                throw new InvalidOperationException("RowVersion property of the entity cannot be null");

            if (!resourcePool.RowVersion.SequenceEqual(patchEntity.RowVersion))
            {
                return Conflict();
            }

            patch.Patch(resourcePool);
            await MainUnitOfWork.UpdateAsync(resourcePool);

            return Ok(resourcePool);
        }

        // DELETE odata/ResourcePool(5)
        public virtual async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            var resourcePool = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.Id == key);
            if (resourcePool == null)
            {
                return NotFound();
            }

            await MainUnitOfWork.DeleteAsync(resourcePool.Id);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }

    public partial class ResourcePoolController : BaseResourcePoolController
    {
	}
}
