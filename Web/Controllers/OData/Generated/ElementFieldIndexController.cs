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

    public abstract class BaseElementFieldIndexController : BaseODataController
    {
        public BaseElementFieldIndexController()
		{
			MainUnitOfWork = new ElementFieldIndexUnitOfWork();		
		}

		protected ElementFieldIndexUnitOfWork MainUnitOfWork { get; private set; }

        // GET odata/ElementFieldIndex
        //[Queryable]
        public virtual IQueryable<ElementFieldIndex> Get()
        {
			var list = MainUnitOfWork.AllLive;
            return list;
        }

        // GET odata/ElementFieldIndex(5)
        //[Queryable]
        public virtual SingleResult<ElementFieldIndex> Get([FromODataUri] int key)
        {
            return SingleResult.Create(MainUnitOfWork.AllLive.Where(elementFieldIndex => elementFieldIndex.Id == key));
        }

        // PUT odata/ElementFieldIndex(5)
        public virtual async Task<IHttpActionResult> Put([FromODataUri] int key, ElementFieldIndex elementFieldIndex)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != elementFieldIndex.Id)
            {
                return BadRequest();
            }

            try
            {
                await MainUnitOfWork.UpdateAsync(elementFieldIndex);
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

            return Ok(elementFieldIndex);
        }

        // POST odata/ElementFieldIndex
        public virtual async Task<IHttpActionResult> Post(ElementFieldIndex elementFieldIndex)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await MainUnitOfWork.InsertAsync(elementFieldIndex);
            }
            catch (DbUpdateException)
            {
                if (MainUnitOfWork.Exists(elementFieldIndex.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(elementFieldIndex);
        }

        // PATCH odata/ElementFieldIndex(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public virtual async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<ElementFieldIndex> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var elementFieldIndex = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.Id == key);
            if (elementFieldIndex == null)
            {
                return NotFound();
            }

            var patchEntity = patch.GetEntity();

            // TODO How is passed ModelState.IsValid?
            if (patchEntity.RowVersion == null)
                throw new InvalidOperationException("RowVersion property of the entity cannot be null");

            if (!elementFieldIndex.RowVersion.SequenceEqual(patchEntity.RowVersion))
            {
                return Conflict();
            }

            patch.Patch(elementFieldIndex);
            await MainUnitOfWork.UpdateAsync(elementFieldIndex);

            return Ok(elementFieldIndex);
        }

        // DELETE odata/ElementFieldIndex(5)
        public virtual async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            var elementFieldIndex = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.Id == key);
            if (elementFieldIndex == null)
            {
                return NotFound();
            }

            await MainUnitOfWork.DeleteAsync(elementFieldIndex.Id);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }

    public partial class ElementFieldIndexController : BaseElementFieldIndexController
    {
	}
}
