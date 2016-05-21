//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace forCrowd.WealthEconomy.WebApi.Controllers.OData
{
    using forCrowd.WealthEconomy.BusinessObjects;
    using forCrowd.WealthEconomy.Facade;
    using Results;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.OData;
    using WebApi.Controllers.Extensions;

    public abstract class BaseUserClaimsController : BaseODataController
    {
        public BaseUserClaimsController()
		{
			MainUnitOfWork = new UserClaimUnitOfWork();		
		}

		protected UserClaimUnitOfWork MainUnitOfWork { get; private set; }

        // GET odata/UserClaim
        //[Queryable]
        public virtual IQueryable<UserClaim> Get()
        {
			var userId = this.GetCurrentUserId();
			if (!userId.HasValue)
                throw new HttpResponseException(HttpStatusCode.Unauthorized);	

			var list = MainUnitOfWork.AllLive;
			list = list.Where(item => item.UserId == userId.Value);
            return list;
        }

        // GET odata/UserClaim(5)
        //[Queryable]
        public virtual SingleResult<UserClaim> Get([FromODataUri] int key)
        {
            return SingleResult.Create(MainUnitOfWork.AllLive.Where(userClaim => userClaim.Id == key));
        }

        // PUT odata/UserClaim(5)
        public virtual async Task<IHttpActionResult> Put([FromODataUri] int key, UserClaim userClaim)
        {
            if (key != userClaim.Id)
            {
                return BadRequest();
            }

            try
            {
                await MainUnitOfWork.UpdateAsync(userClaim);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (await MainUnitOfWork.All.AnyAsync(item => item.Id == userClaim.Id))
                {
                    return Conflict();
                }
                else
                {
                    return NotFound();
                }
            }

            return Ok(userClaim);
        }

        // POST odata/UserClaim
        public virtual async Task<IHttpActionResult> Post(UserClaim userClaim)
        {
            try
            {
                await MainUnitOfWork.InsertAsync(userClaim);
            }
            catch (DbUpdateException)
            {
                if (await MainUnitOfWork.All.AnyAsync(item => item.Id == userClaim.Id))
                {
					return new UniqueKeyConflictResult(Request, "Id", userClaim.Id.ToString());
                }
                else throw;
            }

            return Created(userClaim);
        }

        // PATCH odata/UserClaim(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public virtual async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<UserClaim> patch)
        {
            var userClaim = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.Id == key);
            if (userClaim == null)
            {
                return NotFound();
            }

            var patchEntity = patch.GetEntity();

            if (patchEntity.RowVersion == null)
			{
                throw new InvalidOperationException("RowVersion property of the entity cannot be null");
			}

            if (!userClaim.RowVersion.SequenceEqual(patchEntity.RowVersion))
            {
                return Conflict();
            }

            patch.Patch(userClaim);

            try
            {
                await MainUnitOfWork.UpdateAsync(userClaim);
            }
            catch (DbUpdateException)
            {
                if (patch.GetChangedPropertyNames().Any(item => item == "Id"))
                {
                    object keyObject = null;
                    patch.TryGetPropertyValue("Id", out keyObject);

                    if (keyObject != null && await MainUnitOfWork.All.AnyAsync(item => item.Id == (int)keyObject))
                    {
                        return new UniqueKeyConflictResult(Request, "Id", keyObject.ToString());
                    }
                    else throw;
                }
                else throw;
            }

            return Ok(userClaim);
        }

        // DELETE odata/UserClaim(5)
        public virtual async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            var userClaim = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.Id == key);
            if (userClaim == null)
            {
                return NotFound();
            }

            await MainUnitOfWork.DeleteAsync(userClaim.Id);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }

    public partial class UserClaimsController : BaseUserClaimsController
    {
	}
}
