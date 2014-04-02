namespace Web.Controllers.OData
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.ModelBinding;
    using System.Web.Http.OData;
    using System.Web.Http.OData.Routing;
    using BusinessObjects;
    using DataObjects;
    using Facade;

    public partial class UserLicenseRatingController : ODataController
    {
        UserLicenseRatingUnitOfWork unitOfWork = new UserLicenseRatingUnitOfWork();

        // GET odata/UserLicenseRating
        [Queryable]
        public IQueryable<UserLicenseRating> GetUserLicenseRating()
        {
            return unitOfWork.AllLive;
        }

        // GET odata/UserLicenseRating(5)
        [Queryable]
        public SingleResult<UserLicenseRating> GetUserLicenseRating([FromODataUri] int key)
        {
            return SingleResult.Create(unitOfWork.AllLive.Where(userlicenserating => userlicenserating.Id == key));
        }

        // PUT odata/UserLicenseRating(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, UserLicenseRating userlicenserating)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != userlicenserating.Id)
            {
                return BadRequest();
            }

            unitOfWork.Update(userlicenserating);
            try
            {
                await unitOfWork.SaveAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!unitOfWork.Exists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(userlicenserating);
        }

        // POST odata/UserLicenseRating
        public async Task<IHttpActionResult> Post(UserLicenseRating userlicenserating)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.Insert(userlicenserating);

            try
            {
                await unitOfWork.SaveAsync();
            }
            catch (DbUpdateException)
            {
                if (unitOfWork.Exists(userlicenserating.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(userlicenserating);
        }

        // PATCH odata/UserLicenseRating(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<UserLicenseRating> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            UserLicenseRating userlicenserating = await unitOfWork.FindAsync(key);
            if (userlicenserating == null)
            {
                return NotFound();
            }

            patch.Patch(userlicenserating);
            unitOfWork.Update(userlicenserating);

            try
            {
                await unitOfWork.SaveAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!unitOfWork.Exists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(userlicenserating);
        }

        // DELETE odata/UserLicenseRating(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            UserLicenseRating userlicenserating = await unitOfWork.FindAsync(key);
            if (userlicenserating == null)
            {
                return NotFound();
            }

            unitOfWork.Delete(userlicenserating.Id);
            await unitOfWork.SaveAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
