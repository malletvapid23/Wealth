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

    [Authorize(Roles="Administrator")]
    public abstract class BaseSectorController : BaseController
    {
        public BaseSectorController()
		{
			MainUnitOfWork = new SectorUnitOfWork();		
		}

		protected SectorUnitOfWork MainUnitOfWork { get; private set; }

        // GET odata/Sector
        [Queryable]
        public virtual IQueryable<Sector> Get()
        {
			var list = MainUnitOfWork.AllLive;
            return list;
        }

        // GET odata/Sector(5)
        [Queryable]
        public virtual SingleResult<Sector> Get([FromODataUri] short key)
        {
            return SingleResult.Create(MainUnitOfWork.AllLive.Where(sector => sector.Id == key));
        }

        // PUT odata/Sector(5)
        public virtual async Task<IHttpActionResult> Put([FromODataUri] short key, Sector sector)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != sector.Id)
            {
                return BadRequest();
            }

            MainUnitOfWork.Update(sector);

            try
            {
                await MainUnitOfWork.SaveAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MainUnitOfWork.Exists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(sector);
        }

        // POST odata/Sector
        public virtual async Task<IHttpActionResult> Post(Sector sector)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            MainUnitOfWork.Insert(sector);

            try
            {
                await MainUnitOfWork.SaveAsync();
            }
            catch (DbUpdateException)
            {
                if (MainUnitOfWork.Exists(sector.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(sector);
        }

        // PATCH odata/Sector(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public virtual async Task<IHttpActionResult> Patch([FromODataUri] short key, Delta<Sector> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var sector = await MainUnitOfWork.FindAsync(key);
            if (sector == null)
            {
                return NotFound();
            }

            patch.Patch(sector);
            MainUnitOfWork.Update(sector);

            try
            {
                await MainUnitOfWork.SaveAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MainUnitOfWork.Exists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(sector);
        }

        // DELETE odata/Sector(5)
        public virtual async Task<IHttpActionResult> Delete([FromODataUri] short key)
        {
            var sector = await MainUnitOfWork.FindAsync(key);
            if (sector == null)
            {
                return NotFound();
            }

            MainUnitOfWork.Delete(sector.Id);
            await MainUnitOfWork.SaveAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }
    }

    public partial class SectorController : BaseSectorController
    {
	}
}
