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

    public abstract class BaseElementCellController : BaseODataController
    {
        public BaseElementCellController()
		{
			MainUnitOfWork = new ElementCellUnitOfWork();		
		}

		protected ElementCellUnitOfWork MainUnitOfWork { get; private set; }

        // GET odata/ElementCell
        //[Queryable]
        public virtual IQueryable<ElementCell> Get()
        {
			var list = MainUnitOfWork.AllLive;
            return list;
        }

        // GET odata/ElementCell(5)
        //[Queryable]
        public virtual SingleResult<ElementCell> Get([FromODataUri] int key)
        {
            return SingleResult.Create(MainUnitOfWork.AllLive.Where(elementCell => elementCell.Id == key));
        }

        // PUT odata/ElementCell(5)
        public virtual async Task<IHttpActionResult> Put([FromODataUri] int key, ElementCell elementCell)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != elementCell.Id)
            {
                return BadRequest();
            }

            try
            {
                await MainUnitOfWork.UpdateAsync(elementCell);
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

            return Ok(elementCell);
        }

        // POST odata/ElementCell
        public virtual async Task<IHttpActionResult> Post(ElementCell elementCell)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await MainUnitOfWork.InsertAsync(elementCell);
            }
            catch (DbUpdateException)
            {
                if (MainUnitOfWork.Exists(elementCell.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(elementCell);
        }

        // PATCH odata/ElementCell(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public virtual async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<ElementCell> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var elementCell = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.Id == key);
            if (elementCell == null)
            {
                return NotFound();
            }

            var patchEntity = patch.GetEntity();

            // TODO How is passed ModelState.IsValid?
            if (patchEntity.RowVersion == null)
                throw new InvalidOperationException("RowVersion property of the entity cannot be null");

            if (!elementCell.RowVersion.SequenceEqual(patchEntity.RowVersion))
            {
                return Conflict();
            }

            patch.Patch(elementCell);
            await MainUnitOfWork.UpdateAsync(elementCell);

            return Ok(elementCell);
        }

        // DELETE odata/ElementCell(5)
        public virtual async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            var elementCell = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.Id == key);
            if (elementCell == null)
            {
                return NotFound();
            }

            await MainUnitOfWork.DeleteAsync(elementCell.Id);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }

    public partial class ElementCellController : BaseElementCellController
    {
	}
}
