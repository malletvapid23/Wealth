﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.OData.Builder;
using BusinessObjects;

namespace Web
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.EntitySet<User>("User");
            builder.EntitySet<UserDistributionIndexRating>("UserDistributionIndexRatingSet");
            builder.EntitySet<UserLicenseRating>("UserLicenseRating");
            builder.EntitySet<UserOrganizationRating>("UserOrganizationRating");
            builder.EntitySet<UserSectorRating>("UserSectorRating");
            config.Routes.MapODataRoute("odata", "odata", builder.GetEdmModel());
        }
    }
}
