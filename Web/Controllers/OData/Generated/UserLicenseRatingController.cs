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
    using System.Data.Entity.Infrastructure;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.ModelBinding;
    using System.Web.Http.OData;

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
            return SingleResult.Create(unitOfWork.AllLive.Where(userLicenseRating => userLicenseRating.Id == key));
        }

        // PUT odata/UserLicenseRating(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, UserLicenseRating userLicenseRating)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != userLicenseRating.Id)
            {
                return BadRequest();
            }

            unitOfWork.Update(userLicenseRating);

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

            return Updated(userLicenseRating);
        }

        // POST odata/UserLicenseRating
        public async Task<IHttpActionResult> Post(UserLicenseRating userLicenseRating)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.Insert(userLicenseRating);

            try
            {
                await unitOfWork.SaveAsync();
            }
            catch (DbUpdateException)
            {
                if (unitOfWork.Exists(userLicenseRating.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(userLicenseRating);
        }

        // PATCH odata/UserLicenseRating(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<UserLicenseRating> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userLicenseRating = await unitOfWork.FindAsync(key);
            if (userLicenseRating == null)
            {
                return NotFound();
            }

            patch.Patch(userLicenseRating);
            unitOfWork.Update(userLicenseRating);

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

            return Updated(userLicenseRating);
        }

        // DELETE odata/UserLicenseRating(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            var userLicenseRating = await unitOfWork.FindAsync(key);
            if (userLicenseRating == null)
            {
                return NotFound();
            }

            unitOfWork.Delete(userLicenseRating.Id);
            await unitOfWork.SaveAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
