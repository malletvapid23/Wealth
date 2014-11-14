﻿using Microsoft.AspNet.Identity;
using System.Web.Http;

namespace Web.Controllers.Extensions
{
    public static class ControllerExtensions
    {
        public static int? GetCurrentUserId(this ApiController controller)
        {
            if (controller.User == null)
                return null;
            return controller.User.Identity.GetUserId<int>();
        }

        public static bool GetCurrentUserIsAdmin(this ApiController controller)
        {
            return controller.User.IsInRole("Administrator");
        }
    }
}