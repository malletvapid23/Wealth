﻿using BusinessObjects;
using Facade;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
//using System.Web.Mvc;
// using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Web.App_Code;
using Web.Models;
using Web.Controllers.Extensions;

namespace Web.Controllers.Api
{
    [RoutePrefix("api/Account")]
    public class AccountController : BaseApiController
    {
        private const string LocalLoginProvider = "Local";

        public AccountController()
        {
        }

        public AccountController(ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
        {
            AccessTokenFormat = accessTokenFormat;
        }

        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }

        // GET api/Account/UserInfo
        [Route("UserInfo")]
        public async Task<UserInfoViewModel> GetUserInfo()
        {
            var currentUser = await GetCurrentUserAsync();
            return new UserInfoViewModel
            {
                Id = currentUser.Id,
                Email = currentUser.Email,
                IsAdmin = this.GetCurrentUserIsAdmin()
            };
        }

        // POST api/Account/ChangePassword
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentUserId = this.GetCurrentUserId();

            // TODO Is this correct result?
            if (!currentUserId.HasValue)
                return InternalServerError();

            var result = await UserManager.ChangePasswordAsync(currentUserId.Value, model.CurrentPassword,
                model.NewPassword);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok();
        }

        // POST api/Account/Logout
        public IHttpActionResult Logout()
        {
            Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
            return Ok();
        }

        // POST api/Account/Register
        [AllowAnonymous]
        public async Task<IHttpActionResult> Register(RegisterBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new User
            {
                UserName = model.Email,
                Email = model.Email
            };

            var result = await UserManager.CreateAsync(user, model.Password);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok();
        }

        // POST api/Account/Register
        [HttpPost]
        public async Task<IHttpActionResult> ResetSampleData()
        {
            var currentUserId = this.GetCurrentUserId();

            // TODO Is this correct result?
            if (!currentUserId.HasValue)
                return InternalServerError();

            await UserManager.ResetSampleDataAsync(currentUserId.Value);

            return Ok();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                UserManager.Dispose();
            }

            base.Dispose(disposing);
        }

        #region Helpers

        private IAuthenticationManager Authentication
        {
            get { return Request.GetOwinContext().Authentication; }
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        #endregion
    }
}
