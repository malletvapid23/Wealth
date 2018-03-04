using forCrowd.WealthEconomy.BusinessObjects.Entities;

namespace forCrowd.WealthEconomy.WebApi.Controllers.OData
{
    using BusinessObjects;
    using Facade;
    using Filters;
    using Microsoft.AspNet.Identity;
    using System;
    using System.Data.Entity;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.OData;

    public class UserElementFieldController : BaseODataController
    {
        private readonly ProjectManager _projectManager = new ProjectManager();

        // POST odata/UserElementField
        public async Task<IHttpActionResult> Post(Delta<UserElementField> patch)
        {
            var userElementField = patch.GetEntity();

            // Don't allow the user to set these fields / coni2k - 29 Jul. '17
            // TODO Use ForbiddenFieldsValidator?: Currently breeze doesn't allow to post custom (delta) entity
            // TODO Or use DTO?: Needs a different metadata than the context, which can be overkill
            //userElementField.UserId = 0;
            userElementField.CreatedOn = DateTime.UtcNow;
            userElementField.ModifiedOn = DateTime.UtcNow;
            userElementField.DeletedOn = null;

            // Owner check: Entity must belong to the current user
            // REMARK UserCommandTreeInterceptor already filters "userId" on EntityFramework level, but that might be removed later on / coni2k - 31 Jul. '17
            var currentUserId = User.Identity.GetUserId<int>();
            if (currentUserId != userElementField.UserId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            await _projectManager.AddUserElementFieldAsync(userElementField);

            return Created(userElementField);
        }

        // PATCH odata/UserElementField(userId=5,elementFieldId=5)
        [AcceptVerbs("PATCH", "MERGE")]
        [ForbiddenFieldsValidator(nameof(UserElementField.UserId), nameof(UserElementField.ElementFieldId), nameof(UserElementField.CreatedOn), nameof(UserElementField.ModifiedOn), nameof(UserElementField.DeletedOn))]
        [EntityExistsValidator(typeof(UserElementField))]
        [ConcurrencyValidator(typeof(UserElementField))]
        public async Task<IHttpActionResult> Patch(int userId, int elementFieldId, Delta<UserElementField> patch)
        {
            // Owner check: Entity must belong to the current user
            var currentUserId = User.Identity.GetUserId<int>();
            if (currentUserId != userId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            // REMARK UserCommandTreeInterceptor already filters "userId" on EntityFramework level, but that might be removed later on / coni2k - 31 Jul. '17
            var userElementField = await _projectManager.GetUserElementFieldSet(userId, elementFieldId).SingleOrDefaultAsync();
            patch.Patch(userElementField);

            await _projectManager.SaveChangesAsync();

            return Ok(userElementField);
        }

        // DELETE odata/UserElementField(userId=5,elementFieldId=5)
        [EntityExistsValidator(typeof(UserElementField))]
        // TODO breeze doesn't support this at the moment / coni2k - 31 Jul. '17
        // [ConcurrencyValidator(typeof(UserElementField))]
        public async Task<IHttpActionResult> Delete(int userId, int elementFieldId)
        {
            // Owner check: Entity must belong to the current user
            var currentUserId = User.Identity.GetUserId<int>();
            if (currentUserId != userId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            await _projectManager.DeleteUserElementFieldAsync(userId, elementFieldId);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
